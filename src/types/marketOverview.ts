export interface MarketOverviewData {
  fearGreed: {
    score: number;
    label: string;
    description: string;
  };
  breadth: {
    advancingCount: number;
    decliningCount: number;
    unchangedCount: number;
    advancingPercent: number;
    label: string;
  };
  hotCategory: {
    leader: {
      category: string;
      medianChange: number;
    };
    weakest: {
      category: string;
      medianChange: number;
    };
  };
  markets: {
    markets: {
      market: string;
      status: 'OPEN' | 'CLOSED';
      displayLabel: string;
    }[];
  };
}
