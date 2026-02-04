export interface Fund {
  id: string;
  name: string;
  ticker: string;
  type: string;
  aum: number;
  ytd_return: number;
  monthly_return: number;
  risk: "Baixo" | "Médio" | "Alto";
  manager: string;
  min_investment: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FundInsert {
  name: string;
  ticker: string;
  type: string;
  aum?: number;
  ytd_return?: number;
  monthly_return?: number;
  risk?: string;
  manager: string;
  min_investment?: number;
  description?: string | null;
}

export interface Amortization {
  id: string;
  fund_id: string;
  date: string;
  amount: number;
  quota_reference: number;
  pl_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface AmortizationInsert {
  fund_id: string;
  date: string;
  amount: number;
  quota_reference?: number;
  pl_percentage?: number;
}

export interface Integralization {
  id: string;
  fund_id: string;
  date: string;
  amount: number;
  quotas_acquired: number;
  quota_value: number;
  created_at: string;
  updated_at: string;
}

export interface IntegralizationInsert {
  fund_id: string;
  date: string;
  amount: number;
  quotas_acquired?: number;
  quota_value?: number;
}

export interface RCI {
  id: string;
  fund_id: string;
  date: string;
  agenda: string;
  decision: "Aprovado" | "Reprovado" | "Em análise";
  observations?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RCIInsert {
  fund_id: string;
  date: string;
  agenda: string;
  decision?: string;
  observations?: string | null;
}

export interface AGQ {
  id: string;
  fund_id: string;
  date: string;
  type: "Ordinária" | "Extraordinária";
  agenda: string;
  status: "Realizada" | "Agendada" | "Cancelada";
  quorum: number;
  created_at: string;
  updated_at: string;
}

export interface AGQInsert {
  fund_id: string;
  date: string;
  type?: string;
  agenda: string;
  status?: string;
  quorum?: number;
}
