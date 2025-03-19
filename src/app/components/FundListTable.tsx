"use client";

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Table, Alert, Spin, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useFunds } from '../../hooks/useFunds';
import Link from 'next/link';
import { Fund } from '@/types/fund';

const { Text } = Typography;

interface FundListTableProps {
  initialFunds?: Fund[];
}

type IndexedFund = ReturnType<typeof createIndexedFund>;

const createIndexedFund = (fund: Fund) => {
  const searchKey = `${fund.code} ${fund.name} ${fund.umbrellaType} ${fund.currentPrice} ${Object.values(fund.priceChanges).join(' ')}`.toLowerCase();
  
  return {
    ...fund,
    key: fund.code,
    searchKey,
  };
};

export default function FundListTable({ initialFunds = [] }: FundListTableProps) {
  const { funds, loading, error } = useFunds();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // useEffect(() => {
  //   const timer = setTimeout(() => setDebouncedSearch(searchText), 300);
  //   return () => clearTimeout(timer);
  // }, [searchText]);

  const indexedData = useMemo(() => funds.map(createIndexedFund), [funds]);

  const filteredData = useMemo(() => {
    if (!searchText) return indexedData;
    const searchTerms = searchText.toLowerCase().split(' ');
    
    return indexedData.filter(item => 
      searchTerms.every(term => 
        item.searchKey.includes(term))
    );
  }, [searchText, indexedData]);

  // Updated columns with additional price change periods
  const columns = useMemo(() => [
    {
      title: 'Code',
      dataIndex: 'code',
      width: 100,
      sorter: (a: IndexedFund, b: IndexedFund) => a.code.localeCompare(b.code),
    },
    {
      title: 'Fund Name',
      dataIndex: 'name',
      width: 400,
      sorter: (a: IndexedFund, b: IndexedFund) => a.name.localeCompare(b.name),
    },
    {
      title: 'Umbrella Type',
      dataIndex: 'umbrellaType',
      width: 200,
      sorter: (a: IndexedFund, b: IndexedFund) => a.umbrellaType.localeCompare(b.umbrellaType),
    },
    {
      title: 'Price',
      dataIndex: 'currentPrice',
      width: 120,
      render: (value: number) => value?.toFixed(6),
      sorter: (a: IndexedFund, b: IndexedFund) => a.currentPrice - b.currentPrice,
    },
    {
      title: 'Weekly Change',
      dataIndex: ['priceChanges', 'weekly'],
      width: 120,
      render: (value: number) => <Text type={value >= 0 ? 'success' : 'danger'}>{value}%</Text>,
      sorter: (a: IndexedFund, b: IndexedFund) => a.priceChanges.weekly - b.priceChanges.weekly,
    },
    // New columns start here
    {
      title: 'Monthly Change',
      dataIndex: ['priceChanges', 'monthly'],
      width: 120,
      render: (value: number) => <Text type={value >= 0 ? 'success' : 'danger'}>{value}%</Text>,
      sorter: (a: IndexedFund, b: IndexedFund) => a.priceChanges.monthly - b.priceChanges.monthly,
    },
    {
      title: '3 Month Change',
      dataIndex: ['priceChanges', 'threeMonth'],
      width: 120,
      render: (value: number) => <Text type={value >= 0 ? 'success' : 'danger'}>{value}%</Text>,
      sorter: (a: IndexedFund, b: IndexedFund) => a.priceChanges.threeMonth - b.priceChanges.threeMonth,
    },
    {
      title: '6 Month Change',
      dataIndex: ['priceChanges', 'sixMonth'],
      width: 120,
      render: (value: number) => <Text type={value >= 0 ? 'success' : 'danger'}>{value}%</Text>,
      sorter: (a: IndexedFund, b: IndexedFund) => a.priceChanges.sixMonth - b.priceChanges.sixMonth,
    },
    {
      title: 'Yearly Change',
      dataIndex: ['priceChanges', 'yearly'],
      width: 120,
      render: (value: number) => <Text type={value >= 0 ? 'success' : 'danger'}>{value}%</Text>,
      sorter: (a: IndexedFund, b: IndexedFund) => a.priceChanges.yearly - b.priceChanges.yearly,
    }
  ], []);

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
          placeholder="Search funds..."
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

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="code"
        scroll={{ x: 'max-content', y: 600 }}
        pagination={false}
        virtual
        bordered
        size="small"
      />
    </div>
  );
}