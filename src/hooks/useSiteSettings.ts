import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (!error && data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      setSettings(settingsMap);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('site_settings_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, isLoading, refetch: fetchSettings };
};
