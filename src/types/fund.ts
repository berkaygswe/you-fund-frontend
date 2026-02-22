import { PriceChanges } from "./priceChanges";

export interface TefasFund {
  code: string;
  name: string;
  fundType: string;
  umbrellaType: string;
  currentPrice: number;
  founderName: string;
  founderLogoUrl: string;
  priceChanges: PriceChanges;
}

export type Fund = TefasFund;