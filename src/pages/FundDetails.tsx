import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Shield, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AmortizacoesTable from "@/components/AmortizacoesTable";
import IntegralizacoesTable from "@/components/IntegralizacoesTable";
import RCICard from "@/components/RCICard";
import AGQTable from "@/components/AGQTable";
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
  const fund = mockFunds.find((f) => f.id === id);

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
            <RCICard rcis={mockRCIs} />
          </TabsContent>

          <TabsContent value="amortizacoes" className="animate-fade-in">
            <AmortizacoesTable amortizacoes={mockAmortizacoes} />
          </TabsContent>

          <TabsContent value="integralizacoes" className="animate-fade-in">
            <IntegralizacoesTable integralizacoes={mockIntegralizacoes} />
          </TabsContent>

          <TabsContent value="agq" className="animate-fade-in">
            <AGQTable agqs={mockAGQs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FundDetails;
