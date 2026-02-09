import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useCreateFund } from "@/hooks/useFunds";
import { useCreateAmortization, useCreateIntegralization, useCreateRCI, useCreateAGQ } from "@/hooks/useFundDetails";

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

interface PendingAmortization {
  id: string;
  date: string;
  amount: number;
  quota_reference: number;
  pl_percentage: number;
}

interface PendingIntegralization {
  id: string;
  date: string;
  amount: number;
  quotas_acquired: number;
  quota_value: number;
}

interface PendingRCI {
  id: string;
  date: string;
  agenda: string;
  decision: "Aprovado" | "Reprovado" | "Em análise";
  observations: string;
}

interface PendingAGQ {
  id: string;
  date: string;
  type: "Ordinária" | "Extraordinária";
  agenda: string;
  status: "Realizada" | "Agendada" | "Cancelada";
  quorum: number;
}

const AddFund = () => {
  const navigate = useNavigate();
  const createFund = useCreateFund();
  const createAmortization = useCreateAmortization();
  const createIntegralization = useCreateIntegralization();
  const createRCI = useCreateRCI();
  const createAGQ = useCreateAGQ();

  const [pendingAmortizations, setPendingAmortizations] = useState<PendingAmortization[]>([]);
  const [pendingIntegralizations, setPendingIntegralizations] = useState<PendingIntegralization[]>([]);
  const [pendingRCIs, setPendingRCIs] = useState<PendingRCI[]>([]);
  const [pendingAGQs, setPendingAGQs] = useState<PendingAGQ[]>([]);

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

  // Amortization form state
  const [amortForm, setAmortForm] = useState({
    date: "",
    amount: "",
    quota_reference: "",
    pl_percentage: "",
  });

  // Integralization form state
  const [integForm, setIntegForm] = useState({
    date: "",
    amount: "",
    quotas_acquired: "",
    quota_value: "",
  });

  // RCI form state
  const [rciForm, setRciForm] = useState({
    date: "",
    agenda: "",
    decision: "Em análise" as "Aprovado" | "Reprovado" | "Em análise",
    observations: "",
  });

  // AGQ form state
  const [agqForm, setAgqForm] = useState({
    date: "",
    type: "Ordinária" as "Ordinária" | "Extraordinária",
    agenda: "",
    status: "Agendada" as "Realizada" | "Agendada" | "Cancelada",
    quorum: "",
  });

  const addAmortization = () => {
    if (!amortForm.date || !amortForm.amount) return;
    setPendingAmortizations([
      ...pendingAmortizations,
      {
        id: crypto.randomUUID(),
        date: amortForm.date,
        amount: parseFloat(amortForm.amount),
        quota_reference: parseFloat(amortForm.quota_reference) || 0,
        pl_percentage: parseFloat(amortForm.pl_percentage) || 0,
      },
    ]);
    setAmortForm({ date: "", amount: "", quota_reference: "", pl_percentage: "" });
  };

  const addIntegralization = () => {
    if (!integForm.date || !integForm.amount) return;
    setPendingIntegralizations([
      ...pendingIntegralizations,
      {
        id: crypto.randomUUID(),
        date: integForm.date,
        amount: parseFloat(integForm.amount),
        quotas_acquired: parseFloat(integForm.quotas_acquired) || 0,
        quota_value: parseFloat(integForm.quota_value) || 0,
      },
    ]);
    setIntegForm({ date: "", amount: "", quotas_acquired: "", quota_value: "" });
  };

  const addRCI = () => {
    if (!rciForm.date || !rciForm.agenda) return;
    setPendingRCIs([
      ...pendingRCIs,
      {
        id: crypto.randomUUID(),
        date: rciForm.date,
        agenda: rciForm.agenda,
        decision: rciForm.decision,
        observations: rciForm.observations,
      },
    ]);
    setRciForm({ date: "", agenda: "", decision: "Em análise", observations: "" });
  };

  const addAGQ = () => {
    if (!agqForm.date || !agqForm.agenda) return;
    setPendingAGQs([
      ...pendingAGQs,
      {
        id: crypto.randomUUID(),
        date: agqForm.date,
        type: agqForm.type,
        agenda: agqForm.agenda,
        status: agqForm.status,
        quorum: parseFloat(agqForm.quorum) || 0,
      },
    ]);
    setAgqForm({ date: "", type: "Ordinária", agenda: "", status: "Agendada", quorum: "" });
  };

  const onSubmit = async (data: FundFormData) => {
    setIsSubmitting(true);
    try {
      const fundData = {
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
      };
      const fund = await createFund.mutateAsync(fundData);

      // Create all related records
      await Promise.all([
        ...pendingAmortizations.map((a) =>
          createAmortization.mutateAsync({
            fund_id: fund.id,
            date: a.date,
            amount: a.amount,
            quota_reference: a.quota_reference,
            pl_percentage: a.pl_percentage,
          })
        ),
        ...pendingIntegralizations.map((i) =>
          createIntegralization.mutateAsync({
            fund_id: fund.id,
            date: i.date,
            amount: i.amount,
            quotas_acquired: i.quotas_acquired,
            quota_value: i.quota_value,
          })
        ),
        ...pendingRCIs.map((r) =>
          createRCI.mutateAsync({
            fund_id: fund.id,
            date: r.date,
            agenda: r.agenda,
            decision: r.decision,
            observations: r.observations,
          })
        ),
        ...pendingAGQs.map((a) =>
          createAGQ.mutateAsync({
            fund_id: fund.id,
            date: a.date,
            type: a.type,
            agenda: a.agenda,
            status: a.status,
            quorum: a.quorum,
          })
        ),
      ]);

      navigate(`/fund/${fund.id}`);
    } catch (error) {
      console.error("Error creating fund:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const decisaoStyles = {
    Aprovado: "bg-success/10 text-success border-success/20",
    Reprovado: "bg-destructive/10 text-destructive border-destructive/20",
    "Em análise": "bg-warning/10 text-warning border-warning/20",
  };

  const statusStyles = {
    Realizada: "bg-success/10 text-success border-success/20",
    Agendada: "bg-primary/10 text-primary border-primary/20",
    Cancelada: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Adicionar Novo Fundo</h1>
          <p className="text-muted-foreground">
            Preencha as informações do fundo e adicione registros de RCI, amortizações, integralizações e AGQs.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="rci" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="rci">RCI ({pendingRCIs.length})</TabsTrigger>
                <TabsTrigger value="amortizacoes">Amortizações ({pendingAmortizations.length})</TabsTrigger>
                <TabsTrigger value="integralizacoes">Integralizações ({pendingIntegralizations.length})</TabsTrigger>
                <TabsTrigger value="agq">AGQ ({pendingAGQs.length})</TabsTrigger>
              </TabsList>

              {/* RCI Tab */}
              <TabsContent value="rci">
                <Card>
                  <CardHeader>
                    <CardTitle>Reuniões do Comitê de Investimentos</CardTitle>
                    <CardDescription>Adicione registros de RCI para este fundo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={rciForm.date}
                          onChange={(e) => setRciForm({ ...rciForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Pauta</label>
                        <Input
                          placeholder="Assunto da reunião"
                          value={rciForm.agenda}
                          onChange={(e) => setRciForm({ ...rciForm, agenda: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Decisão</label>
                        <Select
                          value={rciForm.decision}
                          onValueChange={(v) => setRciForm({ ...rciForm, decision: v as typeof rciForm.decision })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Reprovado">Reprovado</SelectItem>
                            <SelectItem value="Em análise">Em análise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Observações</label>
                        <Input
                          placeholder="Notas adicionais"
                          value={rciForm.observations}
                          onChange={(e) => setRciForm({ ...rciForm, observations: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addRCI} className="gap-2">
                      <Plus className="w-4 h-4" /> Adicionar RCI
                    </Button>

                    {pendingRCIs.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Pauta</TableHead>
                            <TableHead>Decisão</TableHead>
                            <TableHead>Observações</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingRCIs.map((rci) => (
                            <TableRow key={rci.id}>
                              <TableCell>{new Date(rci.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>{rci.agenda}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={decisaoStyles[rci.decision]}>
                                  {rci.decision}
                                </Badge>
                              </TableCell>
                              <TableCell>{rci.observations}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPendingRCIs(pendingRCIs.filter((r) => r.id !== rci.id))}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Amortizações Tab */}
              <TabsContent value="amortizacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Amortizações</CardTitle>
                    <CardDescription>Registre as amortizações do fundo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={amortForm.date}
                          onChange={(e) => setAmortForm({ ...amortForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Valor (R$)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={amortForm.amount}
                          onChange={(e) => setAmortForm({ ...amortForm, amount: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cota Referência</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0.0000"
                          value={amortForm.quota_reference}
                          onChange={(e) => setAmortForm({ ...amortForm, quota_reference: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">% do PL</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={amortForm.pl_percentage}
                          onChange={(e) => setAmortForm({ ...amortForm, pl_percentage: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addAmortization} className="gap-2">
                      <Plus className="w-4 h-4" /> Adicionar Amortização
                    </Button>

                    {pendingAmortizations.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Cota Ref.</TableHead>
                            <TableHead>% PL</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingAmortizations.map((a) => (
                            <TableRow key={a.id}>
                              <TableCell>{new Date(a.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(a.amount)}</TableCell>
                              <TableCell className="font-mono">{a.quota_reference.toFixed(4)}</TableCell>
                              <TableCell className="font-mono">{a.pl_percentage.toFixed(2)}%</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPendingAmortizations(pendingAmortizations.filter((x) => x.id !== a.id))}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integralizações Tab */}
              <TabsContent value="integralizacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Integralizações</CardTitle>
                    <CardDescription>Registre as integralizações do fundo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={integForm.date}
                          onChange={(e) => setIntegForm({ ...integForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Valor (R$)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={integForm.amount}
                          onChange={(e) => setIntegForm({ ...integForm, amount: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cotas Adquiridas</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={integForm.quotas_acquired}
                          onChange={(e) => setIntegForm({ ...integForm, quotas_acquired: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Valor da Cota</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0.0000"
                          value={integForm.quota_value}
                          onChange={(e) => setIntegForm({ ...integForm, quota_value: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addIntegralization} className="gap-2">
                      <Plus className="w-4 h-4" /> Adicionar Integralização
                    </Button>

                    {pendingIntegralizations.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Cotas</TableHead>
                            <TableHead>Valor Cota</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingIntegralizations.map((i) => (
                            <TableRow key={i.id}>
                              <TableCell>{new Date(i.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(i.amount)}</TableCell>
                              <TableCell className="font-mono">{i.quotas_acquired.toFixed(2)}</TableCell>
                              <TableCell className="font-mono">{i.quota_value.toFixed(4)}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPendingIntegralizations(pendingIntegralizations.filter((x) => x.id !== i.id))}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AGQ Tab */}
              <TabsContent value="agq">
                <Card>
                  <CardHeader>
                    <CardTitle>Assembleias Gerais de Quotistas</CardTitle>
                    <CardDescription>Registre as assembleias do fundo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={agqForm.date}
                          onChange={(e) => setAgqForm({ ...agqForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <Select
                          value={agqForm.type}
                          onValueChange={(v) => setAgqForm({ ...agqForm, type: v as typeof agqForm.type })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ordinária">Ordinária</SelectItem>
                            <SelectItem value="Extraordinária">Extraordinária</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Pauta</label>
                        <Input
                          placeholder="Assunto da assembleia"
                          value={agqForm.agenda}
                          onChange={(e) => setAgqForm({ ...agqForm, agenda: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={agqForm.status}
                          onValueChange={(v) => setAgqForm({ ...agqForm, status: v as typeof agqForm.status })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Agendada">Agendada</SelectItem>
                            <SelectItem value="Realizada">Realizada</SelectItem>
                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quórum (%)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          value={agqForm.quorum}
                          onChange={(e) => setAgqForm({ ...agqForm, quorum: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addAGQ} className="gap-2">
                      <Plus className="w-4 h-4" /> Adicionar AGQ
                    </Button>

                    {pendingAGQs.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Pauta</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Quórum</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingAGQs.map((agq) => (
                            <TableRow key={agq.id}>
                              <TableCell>{new Date(agq.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>{agq.type}</TableCell>
                              <TableCell>{agq.agenda}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={statusStyles[agq.status]}>
                                  {agq.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono">{agq.quorum.toFixed(1)}%</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPendingAGQs(pendingAGQs.filter((x) => x.id !== agq.id))}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link to="/">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Fundo"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default AddFund;
