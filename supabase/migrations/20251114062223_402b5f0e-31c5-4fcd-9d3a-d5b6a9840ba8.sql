-- Enable realtime for site_settings and stat_boxes tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stat_boxes;