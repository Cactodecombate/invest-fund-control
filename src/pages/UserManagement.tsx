import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  role: AppRole;
  role_id: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthContext();
  const { isGerente, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!roleLoading && !isGerente) {
      navigate("/");
      toast({ title: "Acesso negado", description: "Apenas gerentes podem acessar esta página.", variant: "destructive" });
    }
  }, [roleLoading, isGerente, navigate, toast]);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role");

      if (rolesError) throw rolesError;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name");

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles.map(p => [p.user_id, p.full_name]));

      return (roles || []).map(r => ({
        user_id: r.user_id,
        full_name: profileMap.get(r.user_id) || null,
        role: r.role as AppRole,
        role_id: r.id,
      }));
    },
    enabled: isGerente,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, newRole }: { roleId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
      toast({ title: "Papel atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar papel", variant: "destructive" });
    },
  });

  if (loading || roleLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Gerencie os papéis e permissões dos usuários</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Papel Atual</TableHead>
                  <TableHead>Alterar Papel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.role_id}>
                    <TableCell className="font-medium">
                      {u.full_name || "Sem nome"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {u.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === "gerente" ? "default" : "secondary"} className="capitalize">
                        <Shield className="w-3 h-3 mr-1" />
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(value: AppRole) =>
                          updateRoleMutation.mutate({ roleId: u.role_id, newRole: value })
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gerente">Gerente</SelectItem>
                          <SelectItem value="analista">Analista</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
