-- Add is_text_only column to quick_links table
ALTER TABLE public.quick_links 
ADD COLUMN is_text_only BOOLEAN DEFAULT false;