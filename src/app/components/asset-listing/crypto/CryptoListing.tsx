"use client"

import { ColumnDef, PaginationState, Row, SortingState } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Image from 'next/image';
import ImageWrap from "../../ImageWrap";
import { useCryptoList } from "@/hooks/useCryptoList";
import { Etf } from "@/types/etf";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import debounce from "lodash.debounce";
import { DataTable } from "../../DataTable";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useCurrencyStore } from "@/stores/currency-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimePrices, PriceUpdate } from '@/hooks/useRealtimePrices';
import { RealtimeChangeCell, RealtimePriceCell } from '../etf/RealtimeCells';

// ─── Cell Wrappers ──────────────────────────────────────────────────────────

function PriceCellWrapper({ symbol, currency, value, pricesRef }: {
    symbol: string;
    currency: string;
    value: number;
    pricesRef: React.RefObject<Record<string, PriceUpdate>>;
}) {
    const wsSymbol = `${symbol}-${currency}`;
    const rt = pricesRef.current?.[symbol] || pricesRef.current?.[wsSymbol];
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

function ChangeCellWrapper({ symbol, currency, value, pricesRef }: {
    symbol: string;
    currency: string;
    value: number;
    pricesRef: React.RefObject<Record<string, PriceUpdate>>;
}) {
    const wsSymbol = `${symbol}-${currency}`;
    const rt = pricesRef.current?.[symbol] || pricesRef.current?.[wsSymbol];
    return (
        <RealtimeChangeCell
            value={value}
            realtimeChange={rt?.dailyChangePercent}
        />
    );
}

const periods = ['dailyChangePercent', 'monthlyChangePercent', 'yearlyChangePercent', 'ytdChangePercent'] as const;

const periodHeaderMap: Record<typeof periods[number], string> = {
    'dailyChangePercent': 'Daily Return',
    'monthlyChangePercent': '1 Month Return',
    'yearlyChangePercent': '1 Year Return',
    'ytdChangePercent': 'YTD Return',
};

export function CryptoListing() {
    // States
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [inputValue, setInputValue] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');

    const formatCurrency = useFormatCurrency()
    const currency = useCurrencyStore((s) => s.currency)

    const debouncedSetGlobalFilter = useMemo(() =>
        debounce((value: string) => {
            setGlobalFilter(value);
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        }, 300), []);

    useEffect(() => {
        return () => {
            debouncedSetGlobalFilter.cancel();
        };
    }, [debouncedSetGlobalFilter]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSetGlobalFilter(value);
    }, [debouncedSetGlobalFilter]);

    // Server-side parameters
    const params = useMemo(() => ({
        search: globalFilter,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
        page: pagination.pageIndex,
        size: pagination.pageSize,
        currency
    }), [globalFilter, sorting, pagination, currency]);

    // Data fetching
    const { cryptos, totalCount, totalPages, isLoading, isFetching, error, retry } = useCryptoList(params);

    // Realtime prices subscription
    // Generate WS symbols dynamically like BTC-USD if USD is selected
    const symbols = useMemo(() => cryptos?.map(e => `${e.symbol}-${currency}`) || [], [cryptos, currency]);
    const realtimePrices = useRealtimePrices(symbols, params.currency);

    const pricesRef = useRef(realtimePrices);
    pricesRef.current = realtimePrices;

    // Memoized columns definition
    const columns = useMemo<ColumnDef<Etf>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Crypto Code',
            enableSorting: true,
            size: 70,
            cell: ({ row }) => (
                <div className="font-medium">
                    <Link className='grid grid-cols-2 justify-center items-center' href={`/crypto/detail/${row.getValue('symbol')}`}>
                        {row.original.iconUrl ? (
                            <div className="flex justify-center">
                                <ImageWrap
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/crypto/${row.original.iconUrl}`}
                                    width={20}
                                    height={20}
                                    className='rounded-md'
                                    alt="Crypto logo"
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
            header: 'Crypto Name',
            size: 300,
            enableSorting: true,
        },
        {
            accessorKey: 'price',
            header: 'Price',
            size: 100,
            cell: ({ row }) => (
                <PriceCellWrapper
                    symbol={row.original.symbol}
                    currency={currency}
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
                    {formatCurrency(row.getValue('volume'))}
                </div>
            ),
        },
        ...periods.map(
            (period) => ({
                id: period,
                accessorKey: period,
                header: periodHeaderMap[period],
                size: 100,
                cell: ({ row }: { row: Row<Etf> }) => {
                    const value = row.original[period];

                    if (period === 'dailyChangePercent') {
                        return (
                            <ChangeCellWrapper
                                symbol={row.original.symbol}
                                currency={currency}
                                value={value}
                                pricesRef={pricesRef}
                            />
                        );
                    }

                    if (value == null || isNaN(value)) {
                        return <div className="text-center">-</div>;
                    }

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
    ], [currency, formatCurrency]);

    // Error state with retry
    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center space-y-3">
                <p className="text-red-700 font-medium">Failed to load Cryptos</p>
                <p className="text-sm text-red-600">{error.message}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={retry}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search Cryptos..."
                    className="max-w-md bg-white"
                    value={inputValue}
                    onChange={handleInputChange}
                />

                {isFetching && (
                    <div className="text-sm text-muted-foreground animate-pulse">Updating...</div>
                )}
            </div>
            <DataTable<Etf>
                columns={columns}
                data={cryptos}
                sorting={sorting}
                pagination={pagination}
                totalCount={totalCount}
                totalPages={totalPages}
                isLoading={isLoading}
                isFetching={isFetching}
                setSorting={setSorting}
                setPagination={setPagination}
            />
        </div>
    )
}
