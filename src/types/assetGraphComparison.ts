interface AssetGraphDataPoint {
  date: string;
  value: number;
}

export interface AssetGraphComparsion{
    name: string,
    data: Array<AssetGraphDataPoint>
}