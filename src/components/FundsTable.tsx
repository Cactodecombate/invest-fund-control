import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Fund {
  id: string;
  name: string;
  ticker: string;
  type: string;
  aum: number;
  ytdReturn: number;
  monthlyReturn: number;
  risk: "Baixo" | "Médio" | "Alto";
  manager: string;
  minInvestment: number;
}

interface FundsTableProps {
  funds: Fund[];
}

const FundsTable = ({ funds }: FundsTableProps) => {
  const riskColors = {
    Baixo: "text-success bg-success/10",
    Médio: "text-warning bg-warning/10",
    Alto: "text-destructive bg-destructive/10",
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(0)}K`;
    return `R$ ${value.toLocaleString("pt-BR")}`;
  };

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Fundo</TableHead>
            <TableHead className="text-muted-foreground font-medium">Tipo</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Patrimônio</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Rent. Ano</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Rent. Mês</TableHead>
            <TableHead className="text-muted-foreground font-medium text-center">Risco</TableHead>
            <TableHead className="text-muted-foreground font-medium">Gestor</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Aplicação Mín.</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds.map((fund) => {
            const isPositiveYTD = fund.ytdReturn >= 0;
            const isPositiveMonthly = fund.monthlyReturn >= 0;

            return (
              <TableRow
                key={fund.id}
                className="border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{fund.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{fund.ticker}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{fund.type}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono text-sm text-foreground">
                    {formatCurrency(fund.aum)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isPositiveYTD ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "font-mono text-sm font-medium",
                        isPositiveYTD ? "text-success" : "text-destructive"
                      )}
                    >
                      {isPositiveYTD ? "+" : ""}
                      {fund.ytdReturn.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isPositiveMonthly ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "font-mono text-sm font-medium",
                        isPositiveMonthly ? "text-success" : "text-destructive"
                      )}
                    >
                      {isPositiveMonthly ? "+" : ""}
                      {fund.monthlyReturn.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      riskColors[fund.risk]
                    )}
                  >
                    {fund.risk}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{fund.manager}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono text-sm text-muted-foreground">
                    {formatCurrency(fund.minInvestment)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FundsTable;
