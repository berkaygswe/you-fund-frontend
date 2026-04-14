import { AssetPriceChanges } from "./assetPriceChanges";

export interface Etf extends AssetPriceChanges {
    symbol: string;
    name: string;
    date: string;
    iconUrl: string;
    price: number;
}
