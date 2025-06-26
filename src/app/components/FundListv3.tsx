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
  Row,
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

type IndexedFund = Fund & {
  key: string;
  searchKey: string;
};

// Move outside component to prevent recreation on each render
const periods = ['weekly', 'monthly', 'threeMonth', 'sixMonth', 'yearly'] as const;

export function FundListv3() {
  // States
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUmbrellaType, setSelectedUmbrellaType] = useState<FundUmbrellaType | null>(null);
  
  // Data fetching
  const { funds, loading, error } = useFunds();
  const { umbrellaTypes } = useFundUmbrellaTypes();

  // Index all funds once with searchable terms - this only recomputes when funds change
  const indexedFunds = useMemo(() => {
    return funds.map(fund => ({
      ...fund,
      key: fund.code,
      searchKey: `${fund.code} ${fund.name} ${fund.umbrellaType} ${fund.currentPrice} ${Object.values(fund.priceChanges).join(' ')}`.toLowerCase(),
    }));
  }, [funds]);

  // Apply filters to pre-indexed data - more efficient than re-indexing on each filter change
  const filteredData = useMemo(() => {
    // First apply umbrella type filter
    const typeFiltered = !selectedUmbrellaType 
      ? indexedFunds 
      : indexedFunds.filter(fund => fund.umbrellaType === selectedUmbrellaType.name);
    
    // Then apply global search filter if needed
    if (!globalFilter) return typeFiltered;
    
    const lowerFilter = globalFilter.toLowerCase();
    return typeFiltered.filter(fund => fund.searchKey.includes(lowerFilter));
  }, [indexedFunds, selectedUmbrellaType, globalFilter]);

  // Memoized columns definition
  const columns = useMemo<ColumnDef<IndexedFund>[]>(() => [
    {
      accessorKey: 'code',
      header: 'Kod',
      enableSorting: true,
      size: 70,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('code')}</div>
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
        accessorKey: `priceChanges.${period}`,
        header: `${period.charAt(0).toUpperCase() + period.slice(1)} Change`,
        size: 100,
        cell: ({ row }: { row: Row<IndexedFund> }) => {
          const value = row.original.priceChanges[period];
          return (
            <div className={`text-center font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? (
                  <ArrowUp className="inline h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="inline h-4 w-4 mr-1" />
                )}{value}%
            </div>
          );
        },
        enableSorting: true,
      })
    ),
  ], []);

  // Create table instance with memoization
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Properly memoized event handlers
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      startTransition(() => {
        setGlobalFilter(value);
      });
    }, 150),
    []
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleUmbrellaTypeSelect = useCallback((type: FundUmbrellaType | null) => {
    startTransition(() => {
      setSelectedUmbrellaType(type);
    });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

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
          onChange={handleSearchChange}
          className="max-w-md"
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
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
        totalItems={50}
        pageSizeOptions={[10, 20, 30]} 
      />
    </div>
  );
}