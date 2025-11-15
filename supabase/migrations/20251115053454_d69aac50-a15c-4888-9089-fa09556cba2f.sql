-- Add quick_text column to quick_links table
ALTER TABLE public.quick_links 
ADD COLUMN quick_text TEXT;