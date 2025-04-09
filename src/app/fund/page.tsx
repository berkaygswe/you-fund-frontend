// src/app/funds/page.tsx
import FundList from '@/app/components/FundList';
import FundListTable from '@/app/components/FundListTable';
import FundListv2 from '@/app/components/FundListv2';
import { FundListv3 } from '@/app/components/FundListv3';
import { FundListv4 } from '@/app/components/FundListv4';
import { FundListv5 } from '@/app/components/FundListv5';
import Layout from '@/app/components/Layout';
import dynamic from 'next/dynamic';

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