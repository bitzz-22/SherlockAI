# SherlockAI 🔍

SherlockAI is an advanced, AI-powered campus lost-and-found platform designed specifically for university communities. It leverages intelligent forensic matching to help students and faculty quickly reconnect with their misplaced belongings.

---

## 1. Problem Statement
Losing something important on campus—whether it's a student ID, a laptop charger, or an expensive pair of headphones—can be incredibly stressful. Traditional lost-and-found bins are highly disorganized, and campus-wide email chains or Facebook groups are incredibly inefficient. There is no centralized, smart system to automatically cross-reference items that people have lost with items that others have found.

## 2. Solution Given
SherlockAI solves this by providing a unified, secure platform for universities. Students can quickly upload a report of what they lost, or what they found. Instead of forcing users to manually scroll through endless bulletin boards, our intelligent backend system does the heavy lifting to automatically connect the finder with the loser, all within a safe, spam-free, admin-moderated environment.

## 3. How AI is used in the Project
Our backend is powered by state-of-the-art vision models and natural language processing via Google's Gemini AI. 
- **Intelligent Matching**: When a "Found" item is uploaded, the AI forensically compares its image and description against all active "Lost" reports in the database.
- **Automated Scoring**: The AI generates a sophisticated "Match Score" (0-100%) based on visual similarity, location proximity, and descriptive keywords. 
- **Admin Routing**: High-probability matches are instantly flagged and sent to a secure Admin Dashboard, where campus administrators can manually verify the match before publishing it, ensuring zero spam or fraudulent claims.

---

## 4. Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Supabase Account
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bitzz-22/SherlockAI.git
   cd SherlockAI
   ```

2. **Frontend Setup (Next.js)**
   ```bash
   npm install
   ```

3. **Backend Setup (FastAPI)**
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate
   # Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_key
   RESEND_API_KEY=your_resend_key
   EMAIL_FROM=your_sender_email
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Database Setup**
   Execute the SQL code found in `schema.sql` inside your Supabase SQL Editor to create the necessary tables.

6. **Run the Application**
   Open two terminals:
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```
   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

---

## 5. How to use

1. **User Registration**: Users navigate to `http://localhost:3000` and create a free account.
2. **Report a Lost Item**: If you lost something, click "Report Item", select "Lost", upload a photo (optional) and provide details. This is instantly added to the active search database.
3. **Report a Found Item**: If you found an item, submit it via "Report Item". Our Python backend will intercept this submission and run an AI forensic check against all active lost items.
4. **Admin Verification**: If the AI detects a strong match, it routes the item to the Admin Dashboard (`/admin/dashboard`). An administrator can review the AI Score and approve it.
5. **Reconnection**: Once approved, the item appears on the public board, and the matched users can view contact details to safely arrange a return.


# Project by - Pratyush Kulshreshtha, Monish Mannet, Akshat Indurkhya, Jatin Raghuwanshi