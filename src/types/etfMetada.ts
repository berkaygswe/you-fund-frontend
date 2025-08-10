export interface EtfTopHolding {
  Name: string;
  'Holding Percent': number;
}

export interface EtfSectorAllocation {
  sector: string;
  weight: number;
}

export interface EtfMetadata {
  symbol: string;
  name: string;
  description: string;
  aum: number;
  expenseRatio: number;
  dividendYield: number;
  peRatio: number;
  pbRatio: number;
  inceptionDate: string;
  holdingsCount: number;
  managementCompany: string;
  benchmarkIndex: string | null;
  primaryExchange: string;
  currency: string;
  distributionFrequency: string | null;
  legalStructure: string;
  etfType: string;
  investmentStrategy: string | null;
  topHoldings: EtfTopHolding[];
  sectorAllocation: EtfSectorAllocation[];
  geographicAllocation: [];
  inverse: boolean;
  activelyManaged: boolean;
  leveraged: boolean;
  iconUrl: string;
}