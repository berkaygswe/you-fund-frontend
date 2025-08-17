// src/app/funds/page.tsx
import { FundListv5 } from '@/app/components/asset-listing/fund/FundListv5';

export default function FundsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fund Listing</h1>
        <p className="text-gray-600">Browse and compare available funds</p>
      </div>
      
      {/* <FundList /> */}
      {/* <FundListTable /> */}
      {/* <FundListv2 /> */}
      {/* <FundListv3 /> */}
      {/* <FundListv4 /> */}
      <FundListv5 />
    </>
  );
}