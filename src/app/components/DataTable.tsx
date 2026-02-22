'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTablePagination } from './DataTablePagination';
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** @deprecated Use `isLoading` instead. Kept for backward compatibility. */
  loading?: boolean;
  /** True only on initial load — shows full skeleton placeholder */
  isLoading?: boolean;
  /** True during background refetch — dims table with overlay */
  isFetching?: boolean;
  sorting: SortingState;
  pagination: PaginationState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalPages: number;
  totalCount: number;
  clientSide?: boolean;
  globalFilter?: string;
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function DataTable<TData>({
  columns,
  data,
  sorting,
  pagination,
  totalCount,
  totalPages,
  loading,
  isLoading: isLoadingProp = false,
  isFetching = false,
  setSorting,
  setPagination,
  clientSide = false,
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
}: DataTableProps<TData>) {

  // Backward compat: old `loading` prop falls back to `isLoading` behavior
  const isLoading = isLoadingProp || loading || false;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      ...(globalFilter !== undefined && { globalFilter }),
      ...(columnFilters !== undefined && { columnFilters }),
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: clientSide ? getFilteredRowModel() : undefined,
    getPaginationRowModel: clientSide ? getPaginationRowModel() : undefined,
    getSortedRowModel: clientSide ? getSortedRowModel() : undefined,
    pageCount: clientSide ? undefined : totalPages,
    manualPagination: !clientSide,
    manualSorting: !clientSide,
    manualFiltering: !clientSide,
  });

  // Full skeleton only on initial load (no data yet)
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full my-2" />
          ))}
        </div>
      </div>
    );
  }

  const { rows } = table.getRowModel();
  // To prevent layout shift, match the skeleton count to the current number of rows
  // If no rows exist (initial load or empty state), fall back to page size
  const skeletonRowCount = rows?.length > 0 ? rows.length : (pagination.pageSize || 10);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className='bg-muted'>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className={`flex justify-center`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
          <TableBody className="relative">
            {rows?.length ? (
              // If we have rows, always show them to prevent layout shift and image flickering.
              // We just dim them if we are fetching in the background.
              rows.map(row => (
                <TableRow
                  key={row.id}
                  className={cn(
                    'bg-background transition-opacity duration-200',
                    isFetching && 'opacity-70 grayscale-[0.5] pointer-events-none'
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isFetching ? (
              // Skeletons only if there is NO data yet (initial load or empty search)
              Array.from({ length: skeletonRowCount }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`} className="bg-background">
                  {columns.map((_, colIdx) => (
                    <TableCell key={`skeleton-${rowIdx}-${colIdx}`}>
                      <Skeleton className="h-5 w-full rounded" />
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
        totalItems={clientSide ? table.getFilteredRowModel().rows.length : totalCount}
        pageSizeOptions={[10, 20, 30]}
      />
    </div>
  );
}