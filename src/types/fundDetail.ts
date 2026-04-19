import { UUID } from "crypto";
import { PriceChanges } from "./priceChanges";

export interface FundDetail {
    assetId: UUID;
    code: string;
    name: string;
    fundType: string;
    umbrellaType: string;
    currentPrice: number;
    founderName: string;
    founderLogoUrl: string;
    priceChanges: PriceChanges;
    risk: number,
    buyingValor: number,
    sellingValor: number,
    yearlyManagementFee: number
}
