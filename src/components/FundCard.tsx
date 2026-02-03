import { TrendingUp, TrendingDown, BarChart3, Shield, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface FundCardProps {
  name: string;
  ticker: string;
  type: string;
  aum: number;
  ytdReturn: number;
  monthlyReturn: number;
  risk: "Baixo" | "Médio" | "Alto";
  manager: string;
  className?: string;
  style?: React.CSSProperties;
}

const FundCard = ({
  name,
  ticker,
  type,
  aum,
  ytdReturn,
  monthlyReturn,
  risk,
  manager,
  className,
  style,
}: FundCardProps) => {
  const isPositiveYTD = ytdReturn >= 0;
  const isPositiveMonthly = monthlyReturn >= 0;

  const riskColors = {
    Baixo: "text-success",
    Médio: "text-warning",
    Alto: "text-destructive",
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;
    return `R$ ${value.toLocaleString("pt-BR")}`;
  };

  return (
    <div
      className={cn(
        "glass-card p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer",
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {ticker}
            </span>
            <span className="text-xs text-muted-foreground">{type}</span>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </div>
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Returns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Rent. Ano</p>
          <div className="flex items-center gap-1.5">
            {isPositiveYTD ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span
              className={cn(
                "font-mono font-semibold text-lg",
                isPositiveYTD ? "text-success" : "text-destructive"
              )}
            >
              {isPositiveYTD ? "+" : ""}
              {ytdReturn.toFixed(2)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Rent. Mês</p>
          <div className="flex items-center gap-1.5">
            {isPositiveMonthly ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span
              className={cn(
                "font-mono font-semibold text-lg",
                isPositiveMonthly ? "text-success" : "text-destructive"
              )}
            >
              {isPositiveMonthly ? "+" : ""}
              {monthlyReturn.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-border/50 grid grid-cols-3 gap-2">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <DollarSign className="w-3 h-3" />
            <span className="text-xs">PL</span>
          </div>
          <p className="font-mono text-sm text-foreground">{formatCurrency(aum)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Shield className="w-3 h-3" />
            <span className="text-xs">Risco</span>
          </div>
          <p className={cn("font-semibold text-sm", riskColors[risk])}>{risk}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Gestor</p>
          <p className="text-sm text-foreground truncate">{manager}</p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
