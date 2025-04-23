'use client';

import { useMemo, useState, useCallback, useTransition } from 'react';
import { useFunds } from '../../hooks/useFunds';
import { Fund } from '@/types/fund';
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import debounce from 'lodash.debounce';
import { DataTablePagination } from './DataTablePagination';
import { ArrowDown, ArrowUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFundUmbrellaTypes } from '@/hooks/useFundUmbrellaTypes';
import { useFundsTest } from '@/hooks/useFundsTest';
import Link from 'next/link';

// Move outside component to prevent recreation on each render
const periods = ['weekly', 'monthly', 'threeMonth', 'sixMonth', 'yearly'] as const;

export function FundListv5() {
  // States
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([
    //{ id: 'code', desc: false } // Default sort
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [inputValue, setInputValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUmbrellaType, setSelectedUmbrellaType] = useState<FundUmbrellaType | null>(null);

  // Memoize the debounced function so that it doesn't get recreated on every render.
  const debouncedSetGlobalFilter = useMemo(() =>
    debounce((value: string) => {
      // Wrap the state update that triggers the fetch/heavy re-render
      startTransition(() => {
        setGlobalFilter(value);
      });
    }, 150), [startTransition]); // 1500 ms delay (adjust as needed)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);        // Update input value immediately
    debouncedSetGlobalFilter(value); // Trigger debounced filter update
  }, [debouncedSetGlobalFilter]); // Add debounced function as dependency

  const handleUmbrellaTypeSelect = useCallback((value: FundUmbrellaType | null) => {
    // Wrap the state update that triggers the fetch/heavy re-render
    startTransition(() => {
      setSelectedUmbrellaType(value);
    });
  }, [startTransition]); // Add startTransition as a dependency

  // Server-side parameters
  // Memoize params so that they only change when one of the dependencies changes
  const params = useMemo(() => ({
    search: globalFilter,
    umbrellaType: selectedUmbrellaType?.name,
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    page: pagination.pageIndex,
    size: pagination.pageSize,
  }), [globalFilter, selectedUmbrellaType, sorting, pagination]);
  
  // Data fetching
  //const { funds, loading, error } = useFunds();
  const { funds, totalCount, totalPages, loading, error } = useFundsTest(params);
  const { umbrellaTypes } = useFundUmbrellaTypes();

  // Add this mapping utility
  const periodToFieldMap: Record<string, string> = {
    weekly: 'weeklyChange',
    monthly: 'monthlyChange',
    threeMonth: 'threeMonthChange',
    sixMonth: 'sixMonthChange',
    yearly: 'yearlyChange'
  };

  // Memoized columns definition
  const columns = useMemo<ColumnDef<Fund>[]>(() => [
    {
      accessorKey: 'code',
      header: 'Kod',
      enableSorting: true,
      size: 70,
      cell: ({ row }) => (
        <div className="font-medium"><Link href={`/fund/detail/${row.getValue('code')}`}>{row.getValue('code')}</Link></div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Fund Name',
      size: 300,
      enableSorting: true,
    },
    {
      accessorKey: 'umbrellaType',
      header: 'Umbrella Type',
      size: 100,
      enableSorting: true,
    },
    {
      accessorKey: 'currentPrice',
      header: 'Price',
      size: 100,
      cell: ({ row }) => (
        <div className="text-center">
          {Number(row.getValue('currentPrice')).toFixed(6)}
        </div>
      ),
    },
    ...periods.map(
      (period) => ({
        id: periodToFieldMap[period], 
        accessorKey: `priceChanges.${period}`,
        header: `${period.charAt(0).toUpperCase() + period.slice(1)} Change`,
        size: 100,
        cell: ({ row }) => {
          const value = row.original.priceChanges[period];
          return (
            <div className={`text-center font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? (
                  <ArrowUp className="inline h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="inline h-4 w-4 mr-1" />
                )}{value.toFixed(2)}%
            </div>
          );
        },
        enableSorting: true,
      })
    ),
  ], []);

  // Create table instance with memoization
  const table = useReactTable({
    data: funds,
    columns,
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // Loading state
  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <Skeleton className="h-10 w-full max-w-md" />
  //       {Array.from({ length: 10 }).map((_, i) => (
  //         <Skeleton key={i} className="h-8 w-full" />
  //       ))}
  //     </div>
  //   );
  // }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading funds: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search funds..."
          className="max-w-md"
          value={inputValue}
          onChange={handleInputChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`cursor-pointer ${isPending ? 'opacity-70' : ''}`}>
              {selectedUmbrellaType?.name || 'Umbrella Fund Type'} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {selectedUmbrellaType && (
              <DropdownMenuItem 
                onSelect={() => handleUmbrellaTypeSelect(null)}
                className="duration-200 justify-center border m-2 cursor-pointer bg-gray-100"
              >
                <X className="h-4 w-4 mr-2" /> Clear filter
              </DropdownMenuItem>
            )}
            {umbrellaTypes.map(type => (
              <DropdownMenuItem 
                key={type.id} 
                onSelect={() => handleUmbrellaTypeSelect(type)} 
                className={`duration-200 justify-center border m-2 cursor-pointer ${selectedUmbrellaType?.name === type.name ? 'bg-accent' : ''}`}
              >
                {type.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isPending && (
          <div className="text-sm text-muted-foreground">Updating...</div>
        )}
      </div>
      {loading ? (
        <div className="p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full my-2" />
          ))}
        </div>
      ) : ( <>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className='bg-muted'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      style={{ width: header.column.getSize() }} 
                    >
                      {header.isPlaceholder ? null : (
                        <div className={`flex ${
                            header.column.id !== 'code' && header.column.id !== 'name' 
                              ? 'justify-center' 
                              : ''
                          }`}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span className="ml-1">
                              {{
                                asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                desc: <ArrowDown className="ml-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination         
          table={table}
          totalItems={totalCount}
          pageSizeOptions={[10, 20, 30]} /></>
      )}
    </div>
  );
}