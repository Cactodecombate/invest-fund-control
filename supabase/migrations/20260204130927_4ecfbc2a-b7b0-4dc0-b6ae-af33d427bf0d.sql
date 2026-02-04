-- Create funds table
CREATE TABLE public.funds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL,
  aum NUMERIC NOT NULL DEFAULT 0,
  ytd_return NUMERIC NOT NULL DEFAULT 0,
  monthly_return NUMERIC NOT NULL DEFAULT 0,
  risk TEXT NOT NULL DEFAULT 'Médio',
  manager TEXT NOT NULL,
  min_investment NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create amortizations table
CREATE TABLE public.amortizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id UUID NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  quota_reference NUMERIC NOT NULL DEFAULT 0,
  pl_percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integralizations table
CREATE TABLE public.integralizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id UUID NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  quotas_acquired NUMERIC NOT NULL DEFAULT 0,
  quota_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RCI (Investment Committee) table
CREATE TABLE public.rci (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id UUID NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  agenda TEXT NOT NULL,
  decision TEXT NOT NULL DEFAULT 'Em análise',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AGQ (Shareholder Meetings) table
CREATE TABLE public.agq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id UUID NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'Ordinária',
  agenda TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendada',
  quorum NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amortizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integralizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rci ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agq ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for funds (public read, authenticated write)
CREATE POLICY "Anyone can view funds" ON public.funds FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create funds" ON public.funds FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update funds" ON public.funds FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete funds" ON public.funds FOR DELETE TO authenticated USING (true);

-- Create RLS policies for amortizations
CREATE POLICY "Anyone can view amortizations" ON public.amortizations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create amortizations" ON public.amortizations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update amortizations" ON public.amortizations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete amortizations" ON public.amortizations FOR DELETE TO authenticated USING (true);

-- Create RLS policies for integralizations
CREATE POLICY "Anyone can view integralizations" ON public.integralizations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create integralizations" ON public.integralizations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update integralizations" ON public.integralizations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete integralizations" ON public.integralizations FOR DELETE TO authenticated USING (true);

-- Create RLS policies for RCI
CREATE POLICY "Anyone can view rci" ON public.rci FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rci" ON public.rci FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update rci" ON public.rci FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete rci" ON public.rci FOR DELETE TO authenticated USING (true);

-- Create RLS policies for AGQ
CREATE POLICY "Anyone can view agq" ON public.agq FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create agq" ON public.agq FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update agq" ON public.agq FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete agq" ON public.agq FOR DELETE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON public.funds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_amortizations_updated_at BEFORE UPDATE ON public.amortizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integralizations_updated_at BEFORE UPDATE ON public.integralizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rci_updated_at BEFORE UPDATE ON public.rci FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agq_updated_at BEFORE UPDATE ON public.agq FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();