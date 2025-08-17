// src/app/stocks/page.tsx
import { StockListing } from '../components/asset-listing/stock/StockListing';
import { FundListv5 } from '../components/asset-listing/fund/FundListv5';

export default function StocksPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">US Stocks</h1>
        <p className="text-gray-600">Browse and analyze US stocks</p>
      </div>
    
      <StockListing />
    </>
  );
}