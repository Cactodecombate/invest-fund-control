import { TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { useDeleteFund } from "@/hooks/useFunds";

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
  const { canEdit, canDelete } = useUserRole();
  const deleteFund = useDeleteFund();
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/fund/${fund.id}`} className="cursor-pointer">
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      {canEdit && (
                        <DropdownMenuItem asChild>
                          <Link to={`/fund/${fund.id}/edit`} className="cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir fundo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o fundo "{fund.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteFund.mutate(fund.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
