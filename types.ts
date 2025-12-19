
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string; // ex: CDB, Ações, FII
  investedAmount: number;
  currentAmount: number;
  lastUpdated: string;
}

export interface PredictionData {
  forecast3Months: number;
  forecast6Months: number;
  forecast12Months: number;
  insight: string;
  risks: string[];
}

export interface SimulationResult {
  scenario: string;
  newForecast: number;
  impactDescription: string;
}

export const CATEGORIES = [
  'Alimentação',
  'Aluguel/Moradia',
  'Salário',
  'Contas Fixas',
  'Lazer',
  'Transporte',
  'Saúde',
  'Educação',
  'Compras',
  'Investimentos',
  'Outros'
];

export const INVESTMENT_TYPES = [
  'Renda Fixa (CDB/Tesouro)',
  'Ações',
  'Fundos Imobiliários',
  'Criptomoedas',
  'Previdência Privada',
  'Outros'
];
