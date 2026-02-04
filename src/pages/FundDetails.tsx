import { useParams, Link } from "react-router-dom";
import { ArrowLeft, DollarSign, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AmortizacoesTable from "@/components/AmortizacoesTable";
import IntegralizacoesTable from "@/components/IntegralizacoesTable";
import RCICard from "@/components/RCICard";
import AGQTable from "@/components/AGQTable";
import { useFund } from "@/hooks/useFunds";
import { useAmortizations, useIntegralizations, useRCIs, useAGQs } from "@/hooks/useFundDetails";
import { mockFunds } from "@/data/mockFunds";
import {
  mockAmortizacoes,
  mockIntegralizacoes,
  mockRCIs,
  mockAGQs,
} from "@/data/mockFundDetails";
import { cn } from "@/lib/utils";

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Try to get fund from database first
  const { data: dbFund, isLoading: isFundLoading } = useFund(id || "");
  const { data: dbAmortizations = [] } = useAmortizations(id || "");
  const { data: dbIntegralizations = [] } = useIntegralizations(id || "");
  const { data: dbRCIs = [] } = useRCIs(id || "");
  const { data: dbAGQs = [] } = useAGQs(id || "");

  // Fallback to mock data if not found in database
  const mockFund = mockFunds.find((f) => f.id === id);
  
  // Determine which fund data to use
  const fund = dbFund ? {
    id: dbFund.id,
    name: dbFund.name,
    ticker: dbFund.ticker,
    type: dbFund.type,
    aum: Number(dbFund.aum),
    ytdReturn: Number(dbFund.ytd_return),
    monthlyReturn: Number(dbFund.monthly_return),
    risk: dbFund.risk as "Baixo" | "Médio" | "Alto",
    manager: dbFund.manager,
    minInvestment: Number(dbFund.min_investment),
    description: dbFund.description || null,
  } : mockFund ? {
    ...mockFund,
    description: null as string | null,
  } : null;

  // Transform database data to component format
  const amortizacoes = dbAmortizations.length > 0 
    ? dbAmortizations.map(a => ({
        id: a.id,
        data: a.date,
        valor: Number(a.amount),
        cotaReferencia: Number(a.quota_reference),
        percentualPL: Number(a.pl_percentage),
      }))
    : mockAmortizacoes;

  const integralizacoes = dbIntegralizations.length > 0
    ? dbIntegralizations.map(i => ({
        id: i.id,
        data: i.date,
        valor: Number(i.amount),
        cotasAdquiridas: Number(i.quotas_acquired),
        cotaValor: Number(i.quota_value),
      }))
    : mockIntegralizacoes;

  const rcis = dbRCIs.length > 0
    ? dbRCIs.map(r => ({
        id: r.id,
        data: r.date,
        pauta: r.agenda,
        decisao: r.decision as "Aprovado" | "Reprovado" | "Em análise",
        observacoes: r.observations || "",
      }))
    : mockRCIs;

  const agqs = dbAGQs.length > 0
    ? dbAGQs.map(a => ({
        id: a.id,
        data: a.date,
        tipo: a.type as "Ordinária" | "Extraordinária",
        pauta: a.agenda,
        status: a.status as "Realizada" | "Agendada" | "Cancelada",
        quorum: Number(a.quorum),
      }))
    : mockAGQs;

  if (isFundLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center text-muted-foreground">
            Carregando...
          </div>
        </main>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;
    return `R$ ${value.toLocaleString("pt-BR")}`;
  };

  const riskColors = {
    Baixo: "text-success",
    Médio: "text-warning",
    Alto: "text-destructive",
  };

  const isPositiveYTD = fund.ytdReturn >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Button>
        </Link>

        {/* Fund Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="font-mono">
                  {fund.ticker}
                </Badge>
                <Badge variant="outline">{fund.type}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{fund.name}</h1>
              <p className="text-muted-foreground">Gestor: {fund.manager}</p>
              {fund.description && (
                <p className="text-sm text-muted-foreground mt-2">{fund.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patrimônio</p>
                  <p className="font-mono font-semibold">{formatCurrency(fund.aum)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rent. Ano</p>
                  <p
                    className={cn(
                      "font-mono font-semibold",
                      isPositiveYTD ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositiveYTD ? "+" : ""}
                    {fund.ytdReturn.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risco</p>
                  <p className={cn("font-semibold", riskColors[fund.risk])}>{fund.risk}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rci" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="rci">RCI</TabsTrigger>
            <TabsTrigger value="amortizacoes">Amortizações</TabsTrigger>
            <TabsTrigger value="integralizacoes">Integralizações</TabsTrigger>
            <TabsTrigger value="agq">AGQ</TabsTrigger>
          </TabsList>

          <TabsContent value="rci" className="animate-fade-in">
            <RCICard rcis={rcis} />
          </TabsContent>

          <TabsContent value="amortizacoes" className="animate-fade-in">
            <AmortizacoesTable amortizacoes={amortizacoes} />
          </TabsContent>

          <TabsContent value="integralizacoes" className="animate-fade-in">
            <IntegralizacoesTable integralizacoes={integralizacoes} />
          </TabsContent>

          <TabsContent value="agq" className="animate-fade-in">
            <AGQTable agqs={agqs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FundDetails;
