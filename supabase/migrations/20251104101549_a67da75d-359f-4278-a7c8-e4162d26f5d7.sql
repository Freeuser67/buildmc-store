-- Create stat_boxes table for homepage statistics
CREATE TABLE public.stat_boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stat_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view stat boxes" 
ON public.stat_boxes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert stat boxes" 
ON public.stat_boxes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update stat boxes" 
ON public.stat_boxes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete stat boxes" 
ON public.stat_boxes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stat_boxes_updated_at
BEFORE UPDATE ON public.stat_boxes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stat boxes
INSERT INTO public.stat_boxes (icon, label, value, display_order) VALUES
  ('Users', 'Active Players', '15K+', 0),
  ('Calendar', 'Events Hosted', '500+', 1),
  ('Clock', 'Uptime', '99.9%', 2);