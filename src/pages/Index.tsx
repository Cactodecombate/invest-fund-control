import { Wallet, TrendingUp, PieChart, Award, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import FundCard from "@/components/FundCard";
import FundsTable from "@/components/FundsTable";
import { Button } from "@/components/ui/button";
import { mockFunds, portfolioStats } from "@/data/mockFunds";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Controle de Fundos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie seus fundos de investimento em um só lugar.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Patrimônio Total"
            value={portfolioStats.totalAUM}
            change="+8.3% vs mês anterior"
            changeType="positive"
            icon={Wallet}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Fundos Ativos"
            value={portfolioStats.totalFunds}
            change="2 novos este mês"
            changeType="neutral"
            icon={PieChart}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Rentabilidade Média"
            value={portfolioStats.avgReturn}
            change="Acima do CDI"
            changeType="positive"
            icon={TrendingUp}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          />
          <StatsCard
            title="Melhor Performance"
            value={portfolioStats.topPerformer}
            change="+22.45% no ano"
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

        {/* Funds Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockFunds.map((fund, index) => (
              <FundCard
                key={fund.id}
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
        ) : (
          <FundsTable funds={mockFunds} />
        )}
      </main>
    </div>
  );
};

export default Index;
