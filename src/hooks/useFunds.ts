import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Fund, FundInsert } from "@/types/fund";
import { useToast } from "@/hooks/use-toast";

export const useFunds = () => {
  return useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funds")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Fund[];
    },
  });
};

export const useFund = (id: string) => {
  return useQuery({
    queryKey: ["fund", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funds")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Fund;
    },
    enabled: !!id,
  });
};

export const useCreateFund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fund: FundInsert) => {
      const { data, error } = await supabase
        .from("funds")
        .insert(fund)
        .select()
        .single();
      
      if (error) throw error;
      return data as Fund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      toast({
        title: "Fundo criado",
        description: "O fundo foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar fundo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...fund }: Partial<Fund> & { id: string }) => {
      const { data, error } = await supabase
        .from("funds")
        .update(fund)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Fund;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      queryClient.invalidateQueries({ queryKey: ["fund", data.id] });
      toast({
        title: "Fundo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar fundo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("funds")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      toast({
        title: "Fundo excluído",
        description: "O fundo foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir fundo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
