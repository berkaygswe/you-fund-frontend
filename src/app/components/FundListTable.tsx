// src/app/components/FundListTable.tsx
"use client";

import { useEffect, useState } from 'react';
import { useFunds } from '../../hooks/useFunds';
import { Table, Alert, Spin, Typography, Tag } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import Link from 'next/link';

const { Text } = Typography;

export default function FundListTable() {
  const { funds, loading, error } = useFunds();
  const [pageSize, setPageSize] = useState(20);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const priceFormatter = (value: number) => value?.toFixed(6);
  const changeRenderer = (value: number) => (
    <Text style={{ color: value >= 0 ? '#389e0d' : '#cf1322' }}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}%
    </Text>
  );

  const columns: TableProps['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Fund Name',
      dataIndex: 'name',
      key: 'name',
      width: 400,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Umbrella Type',
      dataIndex: 'umbrellaType',
      key: 'umbrellaType',
      width: 200,
      sorter: (a, b) => a.umbrellaType.localeCompare(b.umbrellaType),
    },
    {
      title: 'Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 120,
      render: priceFormatter,
      sorter: (a, b) => a.currentPrice - b.currentPrice,
    },
    {
      title: 'Weekly',
      dataIndex: 'weeklyChange',
      key: 'weeklyChange',
      width: 120,
      render: changeRenderer,
      sorter: (a, b) => a.weeklyChange - b.weeklyChange,
    },
    {
      title: 'Monthly',
      dataIndex: 'monthlyChange',
      key: 'monthlyChange',
      width: 120,
      render: changeRenderer,
      sorter: (a, b) => a.monthlyChange - b.monthlyChange,
    },
    {
      title: '3 Month',
      dataIndex: 'threeMonthChange',
      key: 'threeMonthChange',
      width: 120,
      render: changeRenderer,
      sorter: (a, b) => a.threeMonthChange - b.threeMonthChange,
    },
    {
      title: '6 Month',
      dataIndex: 'sixMonthChange',
      key: 'sixMonthChange',
      width: 120,
      render: changeRenderer,
      sorter: (a, b) => a.sixMonthChange - b.sixMonthChange,
    },
    {
      title: 'Yearly',
      dataIndex: 'yearlyChange',
      key: 'yearlyChange',
      width: 120,
      render: changeRenderer,
      sorter: (a, b) => a.yearlyChange - b.yearlyChange,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Link 
          href={`/funds/${record.code}`}
          style={{ color: '#1890ff', textDecoration: 'underline' }}
        >
          View Details
        </Link>
      ),
    },
  ];

  const data = funds.map(fund => ({
    key: fund.code,
    code: fund.code,
    name: fund.name,
    umbrellaType: fund.umbrellaType,
    currentPrice: fund.currentPrice,
    weeklyChange: fund.priceChanges.weekly,
    monthlyChange: fund.priceChanges.monthly,
    threeMonthChange: fund.priceChanges.threeMonth,
    sixMonthChange: fund.priceChanges.sixMonth,
    yearlyChange: fund.priceChanges.yearly
  }));

  const paginationConfig: TablePaginationConfig = {
    pageSize: pageSize,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    onShowSizeChange: (current, size) => setPageSize(size),
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading funds"
        description={error.message}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return (
    <div
      style={{
        boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.05)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={paginationConfig}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          type: 'checkbox',
          columnWidth: 48,
        }}
        style={{
          backgroundColor: 'white',
        }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  backgroundColor: '#fafafa',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              />
            ),
          },
        }}
      />
    </div>
  );
}