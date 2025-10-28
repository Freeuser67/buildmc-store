-- Change default order status from 'unpaid' to 'processing'
ALTER TABLE public.orders 
ALTER COLUMN status SET DEFAULT 'processing';