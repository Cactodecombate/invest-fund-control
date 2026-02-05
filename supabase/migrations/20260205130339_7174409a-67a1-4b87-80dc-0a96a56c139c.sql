-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('gerente', 'analista');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'gerente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Gerentes can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'gerente'));

CREATE POLICY "Gerentes can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'gerente'));

-- Update funds policies to allow only gerentes to modify
DROP POLICY IF EXISTS "Authenticated users can update funds" ON public.funds;
DROP POLICY IF EXISTS "Authenticated users can delete funds" ON public.funds;

CREATE POLICY "Gerentes can update funds"
ON public.funds
FOR UPDATE
USING (public.has_role(auth.uid(), 'gerente'));

CREATE POLICY "Gerentes can delete funds"
ON public.funds
FOR DELETE
USING (public.has_role(auth.uid(), 'gerente'));

-- Function to assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'analista');
  RETURN NEW;
END;
$$;

-- Trigger to assign role on signup
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
