-- Create quick_links table for customizable footer links
CREATE TABLE public.quick_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- Policies for quick_links
CREATE POLICY "Anyone can view quick links"
ON public.quick_links
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert quick links"
ON public.quick_links
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quick links"
ON public.quick_links
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quick links"
ON public.quick_links
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create site_settings table for Discord/YouTube links
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
ON public.site_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_quick_links_updated_at
BEFORE UPDATE ON public.quick_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default social links
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('discord_url', 'https://discord.gg/buildmc'),
  ('youtube_url', 'https://youtube.com/@buildmc');