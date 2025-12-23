import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  quick_text?: string;
  display_order: number;
  is_text_only?: boolean;
}

export const useQuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuickLinks = async () => {
    const { data, error } = await supabase
      .from('quick_links')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setQuickLinks(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  return { quickLinks, isLoading, refetch: fetchQuickLinks };
};
