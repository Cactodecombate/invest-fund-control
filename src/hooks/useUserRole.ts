import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export type AppRole = "gerente" | "analista";

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRole = () => {
  const { user, isAuthenticated } = useAuthContext();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data as UserRole;
    },
    enabled: isAuthenticated && !!user,
  });

  const isGerente = userRole?.role === "gerente";
  const isAnalista = userRole?.role === "analista";

  return {
    role: userRole?.role || null,
    isGerente,
    isAnalista,
    isLoading,
    canEdit: isGerente,
    canDelete: isGerente,
    canCreate: isAuthenticated,
  };
};
