export interface Fund {
    code: string;
    name: string;
    fundType: string;
    umbrellaType: string;
    currentPrice: number;
    priceChanges: {
      weekly: number;
      monthly: number;
      threeMonth: number;
      sixMonth: number;
      yearly: number;
    };
  }