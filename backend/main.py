import os
import json
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
from google import genai
from google.genai import types

# ============================================================================
# 1. ARCHITECTURAL & ENVIRONMENT VARIABLE INITIALIZATION
# ============================================================================

# Load environment variables from .env.local in the parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                if k.strip() not in os.environ:
                    os.environ[k.strip()] = v.strip().strip('"\'')

# Initialize FastAPI application
app = FastAPI(
    title="SherlockAI Backend",
    description="Async backend core logic for SherlockAI using FastAPI, Supabase, and Google GenAI",
    version="1.0.0"
)

# Configure CORS middleware to allow communication with a local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize Supabase Client
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # We allow the app to start but it will fail on DB operations if not set.
    # In a real production environment, you might want to raise an error here.
    print("WARNING: SUPABASE_URL and/or SUPABASE_KEY environment variables are missing.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Initialize Google GenAI Client
# The Client will automatically look for the GEMINI_API_KEY environment variable.
try:
    gemini_client = genai.Client()
except Exception as e:
    print(f"WARNING: Failed to initialize Google GenAI client: {e}")
    gemini_client = None


# ============================================================================
# Pydantic Models for Request Validation
# ============================================================================

class ItemSubmitRequest(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user submitting the item")
    type: str = Field(..., pattern="^(lost|found)$", description="Must be exactly 'lost' or 'found'")
    title: str = Field(..., description="Short title of the item")
    description: str = Field(..., description="Detailed textual description of the item")
    category: str = Field(..., description="Category of the item")
    location: Optional[str] = Field(None, description="Where the item was lost or found")
    latitude: Optional[float] = Field(None, description="Latitude of location")
    longitude: Optional[float] = Field(None, description="Longitude of location")
    image_urls: List[str] = Field(default_factory=list, description="List of image URLs")


# ============================================================================
# 2. ENHANCED SEARCH ROUTE
# ============================================================================

@app.get("/api/items")
async def get_items(search: Optional[str] = None):
    """
    Fetch active items.
    Optionally filter by search string within the description.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Start base query for active items
        query = supabase.table("items").select("id,type,title,category,location,created_at").eq("status", "active").order("created_at", desc=True).limit(20)
        
        # Apply optional search filter using ilike equivalent for description or title
        if search:
            query = query.ilike("title", f"%{search}%")
            
        response = query.execute()
        return response.data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items: {str(e)}")


# ============================================================================
# 3. COGNITIVE MATCH & DEDUCTION ROUTE
# ============================================================================

@app.post("/api/items/submit")
async def submit_item(item: ItemSubmitRequest):
    """
    Submit a new lost/found item, process AI semantic matching against opposing items,
    and intelligently route to 'approved' or 'pending' based on confidence score.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")
    if not gemini_client:
        raise HTTPException(status_code=500, detail="AI client not initialized")

    try:
        # Step A: Fetch active opposing records
        opposing_type = "found" if item.type == "lost" else "lost"
        
        candidates_response = supabase.table("items")\
            .select("id, title, description, location, type, category")\
            .eq("type", opposing_type)\
            .execute()
            
        candidates = candidates_response.data
        
        # Default starting values
        ai_score = 0
        status = "approved" # Default to approved if no candidates exist to match against
        
        if candidates and item.type == "found":
            # Step B: Package context for Gemini
            prompt = f"""
            You are a forensic analyst for a campus lost and found system.
            A new '{item.type}' item has been reported.
            Title: {item.title}
            Category: {item.category}
            Description: {item.description}
            Location: {item.location}
            
            Compare this newly reported item against the following list of candidate '{opposing_type}' items.
            Assess semantic alignment, physical attributes, color combinations, and location contexts to find the highest likelihood of a match.
            
            Candidates:
            {json.dumps(candidates)}
            
            Return ONLY a valid JSON object declaring the single highest match confidence value between 0 and 100 for the best candidate. 
            Do not include any other text or markdown formatting.
            Format: {{"highest_match_score": integer}}
            """
            
            # Step C: Send to Gemini for forensic analysis
            # Requesting JSON response using response_schema
            ai_response = gemini_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            try:
                result_json = json.loads(ai_response.text)
                ai_score = result_json.get("highest_match_score", 0)
            except json.JSONDecodeError:
                # Fallback if AI response is malformed
                print(f"Warning: Failed to parse AI response: {ai_response.text}")
                ai_score = 0
                
            # Step D: Enforce conditional routing thresholds
            if ai_score > 90:
                status = "pending" # High match, send to admin
            else:
                status = "approved" # No match, post publicly

        # Step E: Persist into Supabase database
        # Mapping to actual Next.js supabase table schema
        insert_payload = {
            "user_id": item.user_id,
            "type": item.type,
            "title": item.title,
            "description": item.description,
            "category": item.category,
            "location": item.location,
            "latitude": item.latitude,
            "longitude": item.longitude,
            "image_urls": item.image_urls,
            "status": "active" if status == "approved" else "pending",
            "ai_score": ai_score,
        }
        
        insert_response = supabase.table("items").insert(insert_payload).execute()
        
        if not insert_response.data:
            raise HTTPException(status_code=500, detail="Failed to insert record into database")
            
        return insert_response.data[0]

    except Exception as e:
        # Wrap any unexpected errors in HTTPException
        raise HTTPException(status_code=500, detail=f"An error occurred during submission: {str(e)}")


# ============================================================================
# 4. ADMINISTRATIVE CONTROL & MODERATION ROUTES
# ============================================================================

@app.get("/api/admin/pending")
async def get_pending_items(search: Optional[str] = None):
    """
    Fetch all items currently flagged as 'pending' (AI score <= 90).
    Allows optional search filtering on description.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        query = supabase.table("items").select("*").eq("status", "pending")
        
        if search:
            query = query.ilike("description", f"%{search}%")
            
        response = query.execute()
        return response.data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pending items: {str(e)}")


@app.post("/api/admin/approve/{item_id}")
async def approve_item(item_id: str):
    """
    Directly update an item's status from 'pending' to 'approved'.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Update row where id matches to status 'approved'
        response = supabase.table("items").update({"status": "approved"}).eq("id", item_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found or already updated")
            
        return {"message": "Item approved successfully", "item": response.data[0]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to approve item: {str(e)}")


@app.delete("/api/admin/delete/{item_id}")
async def delete_item(item_id: str):
    """
    Prune and permanently drop a specific item record from the database.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        response = supabase.table("items").delete().eq("id", item_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")
            
        return {"message": "Item deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete item: {str(e)}")

# To run the server for testing: 
# uvicorn main:app --reload --port 8000
