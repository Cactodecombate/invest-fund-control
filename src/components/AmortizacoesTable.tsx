import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle } from "lucide-react";
import { Amortizacao } from "@/data/mockFundDetails";

interface AmortizacoesTableProps {
  amortizacoes: Amortizacao[];
}

const AmortizacoesTable = ({ amortizacoes }: AmortizacoesTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <ArrowDownCircle className="w-5 h-5 text-destructive" />
        <CardTitle className="text-lg">Amortizações</CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {amortizacoes.length} registros
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Cota Ref.</TableHead>
              <TableHead className="text-right">% PL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amortizacoes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{formatDate(item.data)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">
                  {formatCurrency(item.valor)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.cotaReferencia.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.percentualPL.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AmortizacoesTable;
