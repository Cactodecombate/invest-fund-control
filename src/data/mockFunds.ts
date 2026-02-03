export interface Fund {
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

export const mockFunds: Fund[] = [
  {
    id: "1",
    name: "INOVA EMPRESA FUNDO DE INVESTIMENTO EM PARTICIPAÇÕES MULTIESTRATEGIA",
    ticker: "FIP Inova Empresa",
    type: "Participações",
    aum: 380000000,
    ytdReturn: 14.52,
    monthlyReturn: 1.23,
    risk: "Médio",
    manager: "Angra Partners",
    minInvestment: 50000,
  },
  {
    id: "2",
    name: "SPX Nimitz Feeder FIC FIM",
    ticker: "SPXNM",
    type: "Multimercado",
    aum: 8700000000,
    ytdReturn: 18.34,
    monthlyReturn: 2.15,
    risk: "Alto",
    manager: "SPX Capital",
    minInvestment: 100000,
  },
  {
    id: "3",
    name: "Kapitalo Kappa Advisory FIC FIM",
    ticker: "KAPPA",
    type: "Multimercado",
    aum: 6200000000,
    ytdReturn: 12.89,
    monthlyReturn: 0.87,
    risk: "Médio",
    manager: "Kapitalo",
    minInvestment: 25000,
  },
  {
    id: "4",
    name: "Dynamo Cougar FIA",
    ticker: "DYNAM",
    type: "Ações",
    aum: 4800000000,
    ytdReturn: 22.45,
    monthlyReturn: 3.21,
    risk: "Alto",
    manager: "Dynamo",
    minInvestment: 10000,
  },
  {
    id: "5",
    name: "JGP Strategy FIC FIM",
    ticker: "JGPST",
    type: "Multimercado",
    aum: 3500000000,
    ytdReturn: 9.78,
    monthlyReturn: 0.45,
    risk: "Baixo",
    manager: "JGP",
    minInvestment: 5000,
  },
  {
    id: "6",
    name: "BTG Pactual Tesouro Selic FI RF",
    ticker: "BTGTS",
    type: "Renda Fixa",
    aum: 15200000000,
    ytdReturn: 11.25,
    monthlyReturn: 0.92,
    risk: "Baixo",
    manager: "BTG Pactual",
    minInvestment: 1000,
  },
  {
    id: "7",
    name: "Alaska Black BDR Nível I FIC FIA",
    ticker: "ALASK",
    type: "Ações",
    aum: 2100000000,
    ytdReturn: -5.67,
    monthlyReturn: -1.23,
    risk: "Alto",
    manager: "Alaska",
    minInvestment: 1000,
  },
  {
    id: "8",
    name: "XP Selection FIC FIM CP",
    ticker: "XPSEL",
    type: "Crédito Privado",
    aum: 5600000000,
    ytdReturn: 13.45,
    monthlyReturn: 1.05,
    risk: "Médio",
    manager: "XP Asset",
    minInvestment: 10000,
  },
];

export const portfolioStats = {
  totalAUM: "R$ 58,6B",
  totalFunds: "8",
  avgReturn: "+12.1%",
  topPerformer: "Dynamo Cougar",
};
