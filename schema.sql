-- Run this script in your Supabase project's SQL Editor to create the necessary tables.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_urls TEXT[] DEFAULT '{}',
    embedding vector(768), -- Only if you have pgvector enabled, otherwise comment this out
    status TEXT DEFAULT 'active',
    ai_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anyone can browse items)
CREATE POLICY "Allow public read access" 
ON public.items FOR SELECT USING (true);

-- Allow authenticated users to insert their own items
CREATE POLICY "Allow authenticated users to insert items" 
ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
