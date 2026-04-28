"use client"

import { ColumnDef, PaginationState, Row, SortingState } from "@tanstack/react-table";
import { Link } from "@/i18n/routing";
import { useCallback, useMemo, useState, useTransition } from "react";
import Image from 'next/image';
import ImageWrap from "../../ImageWrap";
import { Etf } from "@/types/etf";
import { ArrowDown, ArrowUp } from "lucide-react";
import debounce from "lodash.debounce";
import { DataTable } from "../../DataTable";
import { useCurrency } from "@/hooks/useCurrency";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useStockList } from "@/hooks/useStockList";
import { useRealtimePrices, PriceUpdate } from '@/hooks/useRealtimePrices';
import { RealtimeChangeCell, RealtimePriceCell } from '../etf/RealtimeCells';
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Move outside component to prevent recreation on each render
const periods = ['dailyChangePercent', 'monthlyChangePercent', 'yearlyChangePercent', 'ytdChangePercent'] as const;

const periodHeaderMap: Record<typeof periods[number], string> = {
    'dailyChangePercent': 'Daily Return',
    'monthlyChangePercent': '1 Month Return',
    'yearlyChangePercent': '1 Year Return',
    'ytdChangePercent': 'YTD Return',
};

function PriceCellWrapper({ symbol, value, pricesRef }: {
    symbol: string;
    value: number;
    pricesRef: React.RefObject<Record<string, PriceUpdate>>;
}) {
    const rt = pricesRef.current?.[symbol];
    return (
        <div className="text-center whitespace-nowrap">
            <RealtimePriceCell
                value={value}
                realtimePrice={rt?.price}
                timestamp={rt?.lastUpdate}
            />
        </div>
    );
}

function ChangeCellWrapper({ symbol, value, pricesRef }: {
    symbol: string;
    value: number;
    pricesRef: React.RefObject<Record<string, PriceUpdate>>;
}) {
    const rt = pricesRef.current?.[symbol];
    return (
        <RealtimeChangeCell
            value={value}
            realtimeChange={rt?.dailyChangePercent}
        />
    );
}

export function StockListing() {

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
    const currency = useCurrency();

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
    const { stocks, totalCount, totalPages, loading, error } = useStockList(params);

    // Realtime prices subscription
    const assets = useMemo(() => stocks?.map(e => ({ type: 'stock', symbol: e.symbol } as const)) || [], [stocks]);
    const realtimePrices = useRealtimePrices(assets, params.currency);

    const pricesRef = useRef(realtimePrices);
    pricesRef.current = realtimePrices;

    // Memoized columns definition
    const columns = useMemo<ColumnDef<Etf>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Stock Code',
            enableSorting: true,
            size: 70,
            cell: ({ row }) => (
                <div className="font-medium">
                    <Link className='grid grid-cols-2 justify-center items-center' href={`/stock/detail//${row.getValue('symbol')}`}>
                        {row.original.iconUrl ? (
                            <div className="flex justify-center">
                                <ImageWrap
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/stock/${row.original.iconUrl}`}
                                    width={20}
                                    height={20}
                                    className='rounded-md'
                                    alt="Founder logo"
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Image
                                    src="/bank.jpg"
                                    width={20}
                                    height={20}
                                    className='rounded-md'
                                    alt="Default logo"
                                />
                            </div>
                        )}
                        {row.getValue('symbol')}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Stock Name',
            size: 300,
            enableSorting: true,
            cell: ({ row }) => (
                <div className="text-center whitespace-nowrap">
                    {row.getValue('name')}
                </div>
            ),
        },
        {
            accessorKey: 'price',
            header: 'Price',
            size: 100,
            cell: ({ row }) => (
                <PriceCellWrapper
                    symbol={row.original.symbol}
                    value={row.getValue('price')}
                    pricesRef={pricesRef}
                />
            ),
        },
        {
            accessorKey: 'volume',
            header: 'Volume',
            size: 100,
            cell: ({ row }) => (
                <div className="text-center whitespace-nowrap">
                    {formatCurrency(row.getValue('volume'), true)}
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
                    const value = (row.original as unknown as Record<string, number>)[period];

                    if (period === 'dailyChangePercent') {
                        return (
                            <ChangeCellWrapper
                                symbol={row.original.symbol}
                                value={value}
                                pricesRef={pricesRef}
                            />
                        );
                    }

                    if (value === undefined || value === null) {
                        return (
                            <div className="text-center text-muted-foreground font-medium">
                                -
                            </div>
                        );
                    }

                    const isPositive = value >= 0;

                    return (
                        <div className={`text-center font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
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
    ], [formatCurrency]);

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
                data={stocks}
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
