import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGQ } from "@/data/mockFundDetails";

interface AGQTableProps {
  agqs: AGQ[];
}

const AGQTable = ({ agqs }: AGQTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: AGQ["status"]) => {
    switch (status) {
      case "Realizada":
        return "bg-success/20 text-success border-success/30";
      case "Agendada":
        return "bg-warning/20 text-warning border-warning/30";
      case "Cancelada":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "";
    }
  };

  const getTipoColor = (tipo: AGQ["tipo"]) => {
    return tipo === "Ordinária"
      ? "bg-primary/20 text-primary border-primary/30"
      : "bg-secondary text-secondary-foreground";
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Assembleias Gerais de Quotistas (AGQ)</CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {agqs.length} registros
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Pauta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quórum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agqs.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{formatDate(item.data)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", getTipoColor(item.tipo))}>
                    {item.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={item.pauta}>
                  {item.pauta}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.quorum > 0 ? `${item.quorum.toFixed(1)}%` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AGQTable;
