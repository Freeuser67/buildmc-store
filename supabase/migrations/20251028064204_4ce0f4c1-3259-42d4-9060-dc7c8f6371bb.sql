-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;

-- Create a new policy that only allows users to view their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);