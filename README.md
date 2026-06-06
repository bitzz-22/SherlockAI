# SherlockAI
SherlockAI is an AI-powered campus lost-and-found platform that uses intelligent matching to help students quickly reconnect with their misplaced belongings.

## Environment Variables
Create a `.env.local` in the project root:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY
- RESEND_API_KEY
- EMAIL_FROM
- NEXT_PUBLIC_APP_URL

## Development
1. Install dependencies: `npm install`
2. Set up environment variables.
3. Run Supabase migrations.
4. Start dev server: `npm run dev`

## Deployment
Deploy to Vercel and connect Supabase.
