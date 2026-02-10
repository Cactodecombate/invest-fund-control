import { Wallet, TrendingUp, PieChart, Award, LayoutGrid, List, Plus, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StatsCard from "@/components/StatsCard";
import FundCard from "@/components/FundCard";
import FundsTable from "@/components/FundsTable";
import { Button } from "@/components/ui/button";
import { useFunds } from "@/hooks/useFunds";
import { mockFunds, portfolioStats } from "@/data/mockFunds";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { data: funds = [], isLoading } = useFunds();

  // Combine database funds with mock funds for display
  const allFunds = funds.length > 0 ? funds.map(f => ({
    id: f.id,
    name: f.name,
    ticker: f.ticker,
    type: f.type,
    aum: Number(f.aum),
    ytdReturn: Number(f.ytd_return),
    monthlyReturn: Number(f.monthly_return),
    risk: f.risk as "Baixo" | "Médio" | "Alto",
    manager: f.manager,
    minInvestment: Number(f.min_investment),
  })) : mockFunds;

  // Calculate stats from funds
  const stats = {
    totalAUM: allFunds.reduce((acc, f) => acc + f.aum, 0),
    totalFunds: allFunds.length,
    avgReturn: allFunds.length > 0 
      ? allFunds.reduce((acc, f) => acc + f.ytdReturn, 0) / allFunds.length 
      : 0,
    topPerformer: allFunds.length > 0 
      ? allFunds.reduce((max, f) => f.ytdReturn > max.ytdReturn ? f : max, allFunds[0])
      : null,
  };

  const formatAUM = (value: number) => {
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)}M`;
    return `R$ ${value.toLocaleString("pt-BR")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Controle de Fundos
            </h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie seus fundos de investimento em um só lugar.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <LogIn className="w-4 h-4" />
                Cadastrar
              </Button>
            </Link>
            <Link to="/fund/add">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Fundo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Patrimônio Total"
            value={formatAUM(stats.totalAUM)}
            change="+8.3% vs mês anterior"
            changeType="positive"
            icon={Wallet}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Fundos Ativos"
            value={String(stats.totalFunds)}
            change={funds.length > 0 ? "Dados do banco" : "Dados mock"}
            changeType="neutral"
            icon={PieChart}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Rentabilidade Média"
            value={`${stats.avgReturn >= 0 ? "+" : ""}${stats.avgReturn.toFixed(1)}%`}
            change="Acima do CDI"
            changeType="positive"
            icon={TrendingUp}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Melhor Performance"
            value={stats.topPerformer?.ticker || "-"}
            change={stats.topPerformer ? `+${stats.topPerformer.ytdReturn.toFixed(2)}% no ano` : "-"}
            changeType="positive"
            icon={Award}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          />
        </div>

        {/* Section Header with View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Fichas de Fundos</h2>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            Carregando fundos...
          </div>
        )}

        {/* Funds Display */}
        {!isLoading && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allFunds.map((fund, index) => (
              <FundCard
                key={fund.id}
                id={fund.id}
                name={fund.name}
                ticker={fund.ticker}
                type={fund.type}
                aum={fund.aum}
                ytdReturn={fund.ytdReturn}
                monthlyReturn={fund.monthlyReturn}
                risk={fund.risk}
                manager={fund.manager}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              />
            ))}
          </div>
        )}
        {!isLoading && viewMode === "table" && (
          <FundsTable funds={allFunds} />
        )}

        {/* Empty State */}
        {!isLoading && allFunds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum fundo cadastrado ainda.</p>
            <Link to="/fund/add">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar primeiro fundo
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
