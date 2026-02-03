export interface Amortizacao {
  id: string;
  data: string;
  valor: number;
  cotaReferencia: number;
  percentualPL: number;
}

export interface Integralizacao {
  id: string;
  data: string;
  valor: number;
  cotasAdquiridas: number;
  cotaValor: number;
}

export interface RCI {
  id: string;
  data: string;
  pauta: string;
  decisao: "Aprovado" | "Reprovado" | "Em análise";
  observacoes: string;
}

export interface AGQ {
  id: string;
  data: string;
  tipo: "Ordinária" | "Extraordinária";
  pauta: string;
  status: "Realizada" | "Agendada" | "Cancelada";
  quorum: number;
}

export const mockAmortizacoes: Amortizacao[] = [
  { id: "1", data: "2024-12-15", valor: 500000, cotaReferencia: 1.2345, percentualPL: 2.5 },
  { id: "2", data: "2024-09-15", valor: 750000, cotaReferencia: 1.1987, percentualPL: 3.8 },
  { id: "3", data: "2024-06-15", valor: 300000, cotaReferencia: 1.1654, percentualPL: 1.5 },
  { id: "4", data: "2024-03-15", valor: 1000000, cotaReferencia: 1.1234, percentualPL: 5.0 },
];

export const mockIntegralizacoes: Integralizacao[] = [
  { id: "1", data: "2024-11-01", valor: 2000000, cotasAdquiridas: 1620.45, cotaValor: 1.2345 },
  { id: "2", data: "2024-08-01", valor: 1500000, cotasAdquiridas: 1251.87, cotaValor: 1.1982 },
  { id: "3", data: "2024-05-01", valor: 3000000, cotasAdquiridas: 2573.21, cotaValor: 1.1659 },
  { id: "4", data: "2024-02-01", valor: 500000, cotasAdquiridas: 445.12, cotaValor: 1.1233 },
];

export const mockRCIs: RCI[] = [
  { id: "1", data: "2024-12-10", pauta: "Aporte em CRI logístico", decisao: "Aprovado", observacoes: "Retorno esperado de 14% a.a." },
  { id: "2", data: "2024-11-05", pauta: "Desinvestimento em FII ABC", decisao: "Aprovado", observacoes: "Realização de lucro após valorização" },
  { id: "3", data: "2024-09-20", pauta: "Novo investimento em debêntures", decisao: "Em análise", observacoes: "Aguardando due diligence" },
  { id: "4", data: "2024-08-15", pauta: "Aquisição de cotas FII XYZ", decisao: "Reprovado", observacoes: "Risco elevado para o perfil do fundo" },
];

export const mockAGQs: AGQ[] = [
  { id: "1", data: "2025-03-15", tipo: "Ordinária", pauta: "Aprovação de contas do exercício 2024", status: "Agendada", quorum: 0 },
  { id: "2", data: "2024-11-20", tipo: "Extraordinária", pauta: "Alteração do regulamento do fundo", status: "Realizada", quorum: 78.5 },
  { id: "3", data: "2024-03-15", tipo: "Ordinária", pauta: "Aprovação de contas do exercício 2023", status: "Realizada", quorum: 82.3 },
  { id: "4", data: "2023-09-10", tipo: "Extraordinária", pauta: "Aprovação de nova política de investimentos", status: "Realizada", quorum: 65.2 },
];
