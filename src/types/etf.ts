import { EtfPriceChanges } from "./etfPriceChanges";

export interface Etf extends EtfPriceChanges {
  symbol: string;
  name: string;
  date: string;
  iconUrl: string;
  price: number;
}