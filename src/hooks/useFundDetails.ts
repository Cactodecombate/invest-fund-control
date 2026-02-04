import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Amortization, AmortizationInsert,
  Integralization, IntegralizationInsert,
  RCI, RCIInsert,
  AGQ, AGQInsert
} from "@/types/fund";
import { useToast } from "@/hooks/use-toast";

// Amortizations
export const useAmortizations = (fundId: string) => {
  return useQuery({
    queryKey: ["amortizations", fundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amortizations")
        .select("*")
        .eq("fund_id", fundId)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Amortization[];
    },
    enabled: !!fundId,
  });
};

export const useCreateAmortization = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amortization: AmortizationInsert) => {
      const { data, error } = await supabase
        .from("amortizations")
        .insert(amortization)
        .select()
        .single();
      
      if (error) throw error;
      return data as Amortization;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["amortizations", data.fund_id] });
      toast({
        title: "Amortização adicionada",
        description: "A amortização foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar amortização",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Integralizations
export const useIntegralizations = (fundId: string) => {
  return useQuery({
    queryKey: ["integralizations", fundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integralizations")
        .select("*")
        .eq("fund_id", fundId)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Integralization[];
    },
    enabled: !!fundId,
  });
};

export const useCreateIntegralization = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (integralization: IntegralizationInsert) => {
      const { data, error } = await supabase
        .from("integralizations")
        .insert(integralization)
        .select()
        .single();
      
      if (error) throw error;
      return data as Integralization;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integralizations", data.fund_id] });
      toast({
        title: "Integralização adicionada",
        description: "A integralização foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar integralização",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// RCI
export const useRCIs = (fundId: string) => {
  return useQuery({
    queryKey: ["rcis", fundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rci")
        .select("*")
        .eq("fund_id", fundId)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as RCI[];
    },
    enabled: !!fundId,
  });
};

export const useCreateRCI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rci: RCIInsert) => {
      const { data, error } = await supabase
        .from("rci")
        .insert(rci)
        .select()
        .single();
      
      if (error) throw error;
      return data as RCI;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rcis", data.fund_id] });
      toast({
        title: "RCI adicionado",
        description: "O registro do comitê foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar RCI",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// AGQ
export const useAGQs = (fundId: string) => {
  return useQuery({
    queryKey: ["agqs", fundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agq")
        .select("*")
        .eq("fund_id", fundId)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as AGQ[];
    },
    enabled: !!fundId,
  });
};

export const useCreateAGQ = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (agq: AGQInsert) => {
      const { data, error } = await supabase
        .from("agq")
        .insert(agq)
        .select()
        .single();
      
      if (error) throw error;
      return data as AGQ;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agqs", data.fund_id] });
      toast({
        title: "AGQ adicionada",
        description: "A assembleia foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar AGQ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
