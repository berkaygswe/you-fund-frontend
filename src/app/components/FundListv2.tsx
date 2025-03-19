"use client";

import { useMemo, useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useFunds } from '../../hooks/useFunds';
import { Alert, Spin, Typography, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Fund } from '@/types/fund';

const { Text } = Typography;

interface FundListTableProps {
  initialFunds?: Fund[];
}

// Precompute search terms for lightning-fast filtering
type IndexedFund = ReturnType<typeof createIndexedFund>;

const createIndexedFund = (fund: Fund) => {
  const searchKey = `${fund.code} ${fund.name} ${fund.umbrellaType} ${fund.currentPrice} ${Object.values(fund.priceChanges).join(' ')}`.toLowerCase();
  
  return {
    key: fund.code,
    code: fund.code,
    name: fund.name,
    umbrellaType: fund.umbrellaType,
    currentPrice: fund.currentPrice,
    weeklyChange: fund.priceChanges.weekly,
    monthlyChange: fund.priceChanges.monthly,
    threeMonthChange: fund.priceChanges.threeMonth,
    sixMonthChange: fund.priceChanges.sixMonth,
    yearlyChange: fund.priceChanges.yearly,
    searchKey,
  };
};

export default function FundListv2({ initialFunds = [] }: FundListTableProps) {
  const { funds, loading, error } = useFunds();
  const [searchText, setSearchText] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Optimized data with search index
  const indexedData = useMemo(() => funds.map(createIndexedFund), [funds]);

  // Lightweight resize observer
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Turbo-charged search filter
  const filteredData = useMemo(() => {
    if (!searchText) return indexedData;
    const searchTerms = searchText.toLowerCase().split(' ');
    
    return indexedData.filter(item => 
      searchTerms.every(term => 
        item.searchKey.includes(term))
    );
  }, [searchText, indexedData]);

  // Virtualized row renderer
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const fund = filteredData[index];
    return (
      <div style={style} className="flex items-center border-b hover:bg-gray-50">
        <div className="w-[100px] px-4 py-2">{fund.code}</div>
        <div className="w-[400px] px-4 py-2">{fund.name}</div>
        <div className="w-[200px] px-4 py-2">{fund.umbrellaType}</div>
        <div className="w-[120px] px-4 py-2">{fund.currentPrice?.toFixed(6)}</div>
        {/* Add other columns similarly */}
        <div className="w-[120px] px-4 py-2">
          <Link 
            href={`/funds/${fund.code}`}
            className="text-blue-500 hover:underline"
            prefetch={false}
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }, [filteredData]);

  if (loading) return <Spin size="large" className="mx-auto mt-8" />;

  if (error) return (
    <Alert
      message="Error loading funds"
      description={error.message}
      type="error"
      showIcon
      className="m-4"
    />
  );

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Instant search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className="max-w-lg"
          allowClear
        />
        <Text className="self-center">
          Showing {filteredData.length} of {indexedData.length} funds
        </Text>
      </div>

      {/* Virtualized table header */}
      <div className="flex font-semibold bg-gray-100">
        <div className="w-[100px] px-4 py-2">Code</div>
        <div className="w-[400px] px-4 py-2">Fund Name</div>
        <div className="w-[200px] px-4 py-2">Umbrella Type</div>
        <div className="w-[120px] px-4 py-2">Price</div>
        {/* Add other headers */}
        <div className="w-[120px] px-4 py-2">Actions</div>
      </div>

      {/* Virtualized list for performance */}
      <List
        height={600}
        itemCount={filteredData.length}
        itemSize={45}
        width={windowWidth - 32}
        overscanCount={10}
      >
        {Row}
      </List>
    </div>
  );
}