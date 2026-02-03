import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Coins, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CotaInicial } from "@/data/mockFundDetails";

interface CotaInicialCardProps {
  cotaInicial: CotaInicial;
}

const CotaInicialCard = ({ cotaInicial }: CotaInicialCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isPositive = cotaInicial.variacao >= 0;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <Coins className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Cota Inicial (CI)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Data de Início</span>
            </div>
            <p className="text-xl font-mono font-semibold text-foreground">
              {formatDate(cotaInicial.dataInicio)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="w-4 h-4" />
              <span className="text-sm">Valor Inicial</span>
            </div>
            <p className="text-xl font-mono font-semibold text-foreground">
              R$ {cotaInicial.valorInicial.toFixed(4)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Cota Atual</span>
            </div>
            <p className="text-xl font-mono font-semibold text-foreground">
              R$ {cotaInicial.cotaAtual.toFixed(4)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Variação Total</span>
            </div>
            <p
              className={cn(
                "text-xl font-mono font-semibold",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {cotaInicial.variacao.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CotaInicialCard;
