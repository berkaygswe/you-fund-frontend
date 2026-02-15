'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
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
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTablePagination } from './DataTablePagination';

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
}: DataTableProps<TData>) {

  // Backward compat: old `loading` prop falls back to `isLoading` behavior
  const isLoading = isLoadingProp || loading || false;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
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
          <TableBody>
            {isFetching ? (
              // Skeleton rows during refetch — keeps table structure, no layout shift
              Array.from({ length: skeletonRowCount }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`} className="bg-background">
                  {columns.map((_, colIdx) => (
                    <TableCell key={`skeleton-${rowIdx}-${colIdx}`}>
                      <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows?.length ? (
              rows.map(row => (
                <TableRow key={row.id} className='bg-background'>
                  {row.getVisibleCells().map(cell => (
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
        pageSizeOptions={[10, 20, 30]}
      />
    </div>
  );
}