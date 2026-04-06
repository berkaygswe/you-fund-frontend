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
  category: string;
  iconUrl: string;
  aum: number;
  totalNetAssets: number;
  navPrice: number;
  marketPrice: number;
  expenseRatio: number;
  dividendYield: number;
  peRatio: number;
  pbRatio: number;
  beta3y: number;
  inceptionDate: string;
  holdingsCount: number;
  holdingsTurnover: number;
  managementCompany: string;
  primaryExchange: string;
  currency: string;
  legalStructure: string;
  etfType: string;
  isLeveraged: boolean;
  isInverse: boolean;
  isActivelyManaged: boolean;
  benchmarkIndex?: string | null;
  distributionFrequency?: string | null;
  topHoldings: EtfTopHolding[];
  sectorAllocation: Record<string, number>;
  assetClasses: {
    bondPosition: number;
    cashPosition: number;
    otherPosition: number;
    stockPosition: number;
    preferredPosition: number;
    convertiblePosition: number;
  };
  equityHoldingsMetrics: Record<string, {
    "Price/Book": number | null;
    "Price/Sales": number | null;
    "Price/Cashflow": number | null;
    "Price/Earnings": number | null;
    "Median Market Cap": number | null;
    "3 Year Earnings Growth": number | null;
  }>;
  bondHoldingsMetrics: Record<string, {
    "Duration": number | null;
    "Maturity": number | null;
    "Credit Quality": number | null;
  }>;
  bondRatings: Record<string, number>;
}
