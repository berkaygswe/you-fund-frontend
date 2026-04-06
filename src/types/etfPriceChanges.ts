export interface EtfPriceChanges {
    name: string;
    symbol: string;
    iconUrl: string;
    price: number;
    dailyChangePercent: number;
    monthlyChangePercent: number;
    yearlyChangePercent: number;
    ytdChangePercent: number;
    volume: number;
    currency: string;
    timestamp: number;
}
