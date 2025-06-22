import { PriceChanges } from "./priceChanges";

export interface Fund {
  code: string;
  name: string;
  fundType: string;
  umbrellaType: string;
  currentPrice: number;
  founderName: string;
  founderLogoUrl: string;
  priceChanges: PriceChanges;
}