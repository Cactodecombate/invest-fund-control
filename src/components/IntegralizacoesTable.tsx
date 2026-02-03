import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle } from "lucide-react";
import { Integralizacao } from "@/data/mockFundDetails";

interface IntegralizacoesTableProps {
  integralizacoes: Integralizacao[];
}

const IntegralizacoesTable = ({ integralizacoes }: IntegralizacoesTableProps) => {
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
        <ArrowUpCircle className="w-5 h-5 text-success" />
        <CardTitle className="text-lg">Integralizações</CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {integralizacoes.length} registros
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Cotas</TableHead>
              <TableHead className="text-right">Valor Cota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integralizacoes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{formatDate(item.data)}</TableCell>
                <TableCell className="text-right font-mono text-success">
                  {formatCurrency(item.valor)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.cotasAdquiridas.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.cotaValor.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IntegralizacoesTable;
