-- Add unique constraint to site_settings.setting_key to enable upsert functionality
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_setting_key_unique UNIQUE (setting_key);