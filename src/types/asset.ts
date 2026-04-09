export type AssetType = 'stock' | 'etf' | 'cryptocurrency' | 'commodity' | 'fund' | 'index';

export interface AssetIdentifier {
  type: AssetType;
  symbol: string;
}
