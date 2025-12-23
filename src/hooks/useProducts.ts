import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: string | null;
}

export const useProducts = (limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    let query = supabase.from('products').select('*').order('name');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  return { products, isLoading, refetch: fetchProducts };
};
