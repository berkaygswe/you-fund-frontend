export interface FundDetail {
    code: string;
    name: string;
    fundType: string;
    umbrellaType: string;
    currentPrice: number;
    founderName: string;
    founderLogoUrl: string;
    priceChanges: {
        weekly: number;
        monthly: number;
        threeMonth: number;
        sixMonth: number;
        yearly: number;
    };
    risk: number,
    buyingValor: number,
    sellingValor: number,
    yearlyManagementFee: number
}