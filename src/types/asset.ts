export type AssetType = 'stock' | 'etf' | 'cryptocurrency' | 'commodity' | 'fund' | 'index' | 'forex';

export interface AssetIdentifier {
  type: AssetType;
  symbol: string;
}
