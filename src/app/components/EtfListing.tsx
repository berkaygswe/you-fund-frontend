"use client"

import { ColumnDef, PaginationState, Row, SortingState } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import Image from 'next/image';
import ImageWrap from "./ImageWrap";
import { useEtfList } from "@/hooks/useEtfList";
import { Etf } from "@/types/etf";
import { ArrowDown, ArrowUp } from "lucide-react";
import debounce from "lodash.debounce";
import { DataTable } from "./DataTable";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useCurrencyStore } from "@/stores/currency-store";
import { Input } from "@/components/ui/input";

// Move outside component to prevent recreation on each render
const periods = ['dailyChangePercent', 'oneMonthChangePercent', 'threeMonthChangePercent', 'oneYearChangePercent'] as const;

const periodHeaderMap: Record<typeof periods[number], string> = {
    'dailyChangePercent': 'Daily Return',
    'oneMonthChangePercent': '1 Month Return',
    'threeMonthChangePercent': '3 Month Return',
    'oneYearChangePercent': '1 Year Return',
};

export function EtfListing(){

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

    const formatCurrency = useFormatCurrency()
    const currency = useCurrencyStore((s) => s.currency)

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

    // Server-side parameters
    // Memoize params so that they only change when one of the dependencies changes
    const params = useMemo(() => ({
        search: globalFilter,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
        page: pagination.pageIndex,
        size: pagination.pageSize,
        currency
    }), [globalFilter, sorting, pagination, currency]);
    
    // Data fetching
    //const { funds, loading, error } = useFunds();
    const { etfs, totalCount, totalPages, loading, error } = useEtfList(params);

    // Memoized columns definition
    const columns = useMemo<ColumnDef<Etf>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Etf Code',
            enableSorting: true,
            size: 70,
            cell: ({ row }) => (
                <div className="font-medium">
                    <Link className='flex gap-1 justify-center items-center' href={`/etf/detail/${row.getValue('symbol')}`}>
                        {row.original.iconUrl ? (
                            <ImageWrap
                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/etf/${row.original.iconUrl}`}
                                width={20}
                                height={20}
                                className='rounded-md'
                                alt="Founder logo"
                            />
                            ) : (
                            <Image
                                src="/bank.jpg"
                                width={20}
                                height={20}
                                className='rounded-md'
                                alt="Default logo"
                            />
                        )}
                        {row.getValue('symbol')}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Fund Name',
            size: 300,
            enableSorting: true,
        },
        {
            accessorKey: 'closePrice',
            header: 'Price',
            size: 100,
            cell: ({ row }) => (
                <div className="text-center whitespace-nowrap">
                    {formatCurrency(row.getValue('closePrice'))}
                </div>
            ),
        },
        {
            accessorKey: 'volume',
            header: 'Volume',
            size: 100,
            cell: ({ row }) => (
                <div className="text-center whitespace-nowrap">
                    {formatCurrency(row.getValue('volume'))}
                </div>
            ),
        },
        ...periods.map(
            (period) => ({
                id: period, // Use period directly as ID if it's unique, or periodToFieldMap[period]
                accessorKey: period, // Assuming Etf type has these properties directly
                // Use the new periodHeaderMap for the header text
                header: periodHeaderMap[period],
                size: 100,
                cell: ({ row }: { row: Row<Etf> }) => {
                    // Type assertion for row.original to access dynamic keys safely
                    const value = row.original[period];
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
    ], [periods, formatCurrency]);

    // Error state
    if (error) {
        return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading etfs: {error.message}
        </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search funds..."
                    className="max-w-md bg-white"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                
                {isPending && (
                    <div className="text-sm text-muted-foreground">Updating...</div>
                )}
            </div>
                <DataTable<Etf>
                    columns={columns}
                    data={etfs}
                    sorting={sorting}
                    pagination={pagination}
                    totalCount={totalCount}
                    totalPages={totalPages}
                    loading={loading}
                    setSorting={setSorting}
                    setPagination={setPagination}
                />
        </div>
    )
}