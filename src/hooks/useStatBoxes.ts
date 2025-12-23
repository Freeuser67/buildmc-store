import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StatBox {
  id: string;
  icon: string;
  label: string;
  value: string;
  display_order: number;
}

export const useStatBoxes = () => {
  const [statBoxes, setStatBoxes] = useState<StatBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatBoxes = async () => {
    const { data, error } = await supabase
      .from('stat_boxes')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setStatBoxes(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStatBoxes();

    const channel = supabase
      .channel('stat_boxes_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stat_boxes' },
        () => fetchStatBoxes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { statBoxes, isLoading, refetch: fetchStatBoxes };
};
