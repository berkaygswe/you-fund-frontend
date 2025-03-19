// src/app/components/FundListMUI.tsx
"use client";

import { useEffect, useState } from 'react';
import { useFunds } from '../../hooks/useFunds';
import { 
  DataGrid, 
  GridColDef,
  GridRenderCellParams,
  GridToolbar, // This might be the issue
} from '@mui/x-data-grid';
import Link from 'next/link';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

export default function FundList() {
  const { funds, loading, error } = useFunds();
  const [pageSize, setPageSize] = useState(20);
  const [mounted, setMounted] = useState(false);

  // Only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return nothing during SSR
  if (!mounted) return null;

  // Updated formatter functions - using more generic types
  const numberFormatter = (params: any) => {
    return params.value.toFixed(2) + '%';
  };

  const priceFormatter = (params: any) => {
    return params?.value?.toFixed(6);
  };

  // Cell renderer for price changes (adds colors)
  const renderPriceChange = (params: GridRenderCellParams) => {
    const value = params.value || 0;
    return (
      <Typography
        sx={{
          color: value >= 0 ? 'success.main' : 'error.main',
          fontWeight: 'medium'
        }}
      >
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </Typography>
    );
  };

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Fund Name', width: 400 },
    { field: 'umbrellaType', headerName: 'Umbrella Type', width: 200 },
    { 
      field: 'currentPrice', 
      headerName: 'Price', 
      width: 120,
      valueFormatter: priceFormatter
    },
    { 
      field: 'weeklyChange', 
      headerName: 'Weekly', 
      width: 120,
      renderCell: renderPriceChange
    },
    { 
      field: 'monthlyChange', 
      headerName: 'Monthly', 
      width: 120,
      renderCell: renderPriceChange
    },
    { 
      field: 'threeMonthChange', 
      headerName: '3 Month', 
      width: 120,
      renderCell: renderPriceChange
    },
    { 
      field: 'sixMonthChange', 
      headerName: '6 Month', 
      width: 120,
      renderCell: renderPriceChange
    },
    { 
      field: 'yearlyChange', 
      headerName: 'Yearly', 
      width: 120,
      renderCell: renderPriceChange
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Link 
          href={`/funds/${params.row.code}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View Details
        </Link>
      )
    }
  ];

  // Transform the data to match DataGrid requirements
  const rows = funds.map(fund => ({
    id: fund.code,
    code: fund.code,
    name: fund.name,
    fundType: fund.fundType,
    umbrellaType: fund.umbrellaType,
    currentPrice: fund.currentPrice,
    weeklyChange: fund.priceChanges.weekly,
    monthlyChange: fund.priceChanges.monthly,
    threeMonthChange: fund.priceChanges.threeMonth,
    sixMonthChange: fund.priceChanges.sixMonth,
    yearlyChange: fund.priceChanges.yearly
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading funds: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.05)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: pageSize },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        onPaginationModelChange={(model) => setPageSize(model.pageSize)}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        density="standard"
        sx={{
          border: 'none',
          '& .MuiDataGrid-main': { 
            padding: '12px 8px' 
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600'
          },
          '& .MuiDataGrid-cell': {
            padding: '12px 16px',
            fontSize: '14px'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f5f5f5'
          },
          '& .MuiCheckbox-root': {
            color: '#d9d9d9',
            '&.Mui-checked': {
              color: '#1890ff'
            }
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0'
          },
          '& .MuiButton-root': {
            textTransform: 'none',
            fontSize: '14px'
          },
          '& .MuiTablePagination-root': {
            fontSize: '14px'
          }
        }}
      />
    </Box>
  );
}