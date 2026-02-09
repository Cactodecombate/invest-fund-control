import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useFund, useUpdateFund } from "@/hooks/useFunds";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthContext } from "@/contexts/AuthContext";

const fundSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  ticker: z.string().min(1, "Ticker é obrigatório").max(50),
  type: z.string().min(1, "Tipo é obrigatório"),
  aum: z.coerce.number().min(0, "Patrimônio deve ser positivo"),
  ytd_return: z.coerce.number(),
  monthly_return: z.coerce.number(),
  risk: z.enum(["Baixo", "Médio", "Alto"]),
  manager: z.string().min(1, "Gestor é obrigatório").max(100),
  min_investment: z.coerce.number().min(0, "Investimento mínimo deve ser positivo"),
  description: z.string().max(2000).optional(),
});

type FundFormData = z.infer<typeof fundSchema>;

const EditFund = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { canEdit, isLoading: roleLoading } = useUserRole();
  const { data: fund, isLoading: fundLoading } = useFund(id || "");
  const updateFund = useUpdateFund();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FundFormData>({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      name: "",
      ticker: "",
      type: "",
      aum: 0,
      ytd_return: 0,
      monthly_return: 0,
      risk: "Médio",
      manager: "",
      min_investment: 0,
      description: "",
    },
  });

  // Populate form when fund data is loaded
  useEffect(() => {
    if (fund) {
      form.reset({
        name: fund.name,
        ticker: fund.ticker,
        type: fund.type,
        aum: fund.aum,
        ytd_return: fund.ytd_return,
        monthly_return: fund.monthly_return,
        risk: fund.risk as "Baixo" | "Médio" | "Alto",
        manager: fund.manager,
        min_investment: fund.min_investment,
        description: fund.description || "",
      });
    }
  }, [fund, form]);

  // Redirect if not authenticated or not a gerente
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!roleLoading && !canEdit && isAuthenticated) {
      navigate(`/fund/${id}`);
    }
  }, [roleLoading, canEdit, isAuthenticated, navigate, id]);

  const onSubmit = async (data: FundFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await updateFund.mutateAsync({
        id,
        name: data.name,
        ticker: data.ticker,
        type: data.type,
        aum: data.aum,
        ytd_return: data.ytd_return,
        monthly_return: data.monthly_return,
        risk: data.risk,
        manager: data.manager,
        min_investment: data.min_investment,
        description: data.description || null,
      });

      navigate(`/fund/${id}`);
    } catch (error) {
      console.error("Error updating fund:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fundLoading || authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="text-center text-muted-foreground">Carregando...</div>
        </main>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Fundo não encontrado</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <Link to={`/fund/${id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para detalhes
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Editar Fundo</h1>
          <p className="text-muted-foreground">
            Atualize as informações do fundo {fund.name}.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais do fundo de investimento</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Nome do Fundo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Verde AM Alocação FIC FIM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticker</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: VERDE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Multimercado">Multimercado</SelectItem>
                          <SelectItem value="Ações">Ações</SelectItem>
                          <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                          <SelectItem value="Crédito Privado">Crédito Privado</SelectItem>
                          <SelectItem value="Participações">Participações</SelectItem>
                          <SelectItem value="Imobiliário">Imobiliário</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gestor</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Verde Asset" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patrimônio (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_investment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investimento Mínimo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ytd_return"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rentabilidade Ano (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthly_return"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rentabilidade Mês (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="risk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Risco</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o risco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baixo">Baixo</SelectItem>
                          <SelectItem value="Médio">Médio</SelectItem>
                          <SelectItem value="Alto">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva as características e estratégia do fundo..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link to={`/fund/${id}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default EditFund;
