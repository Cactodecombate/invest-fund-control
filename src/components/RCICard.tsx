import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { RCI } from "@/data/mockFundDetails";

interface RCICardProps {
  rcis: RCI[];
}

const RCICard = ({ rcis }: RCICardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const decisaoStyles = {
    Aprovado: "bg-success/20 text-success border-success/30",
    Reprovado: "bg-destructive/20 text-destructive border-destructive/30",
    "Em análise": "bg-warning/20 text-warning border-warning/30",
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Comitê de Investimentos (RCI)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Pauta
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">Decisão</TableHead>
                <TableHead className="text-muted-foreground">Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rcis.map((rci) => (
                <TableRow
                  key={rci.id}
                  className="border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-foreground">
                    {formatDate(rci.data)}
                  </TableCell>
                  <TableCell className="text-foreground max-w-xs">
                    {rci.pauta}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-medium", decisaoStyles[rci.decisao])}
                    >
                      {rci.decisao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs">
                    {rci.observacoes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RCICard;
