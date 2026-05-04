import { UUID } from "crypto";

export interface StockMetadata {
  assetId: UUID;
  symbol: string;
  name: string;
  longName: string;
  shortName: string;
  description: string;
  sector: string;
  industry: string;
  website: string;
  fullTimeEmployees: number;
  iconUrl: string;

  // Valuation & Multiples
  marketCap: number;
  enterpriseValue: number;
  trailingPe: number;
  forwardPe: number;
  pegRatio: number;
  priceToSalesTrailing12Months: number;
  priceToBook: number;
  enterpriseToRevenue: number;
  enterpriseToEbitda: number;

  // Dividends
  dividendYield: number;
  dividendRate: number;
  payoutRatio: number;
  fiveYearAvgDividendYield: number;

  // Performance & Risk
  beta: number;
  profitMargins: number;
  operatingMargins: number;
  returnOnAssets: number;
  returnOnEquity: number;
  revenueGrowth: number;
  earningsGrowth: number;

  // Share Info
  floatShares: number;
  sharesOutstanding: number;
  shortRatio: number;
  shortPercentOfFloat: number;
  heldPercentInsiders: number;
  heldPercentInstitutions: number;

  // Market Info
  exchange: string;
  currency: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyDayAverage: number;
  twoHundredDayAverage: number;

  // Location
  city: string;
  state: string;
  country: string;
}
