'use client';

import { useMemo, useState, useCallback, useTransition } from 'react';
import { TefasFund } from '@/types/fund';
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import {
    SortingState,
    ColumnDef,
    PaginationState,
    Row,
    ColumnFiltersState,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import debounce from 'lodash.debounce';
import { ArrowDown, ArrowUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from "@/hooks/useCurrency";
import { useTefasFunds } from '@/hooks/useTefasFunds';
import { useFundUmbrellaTypes } from '@/hooks/useFundUmbrellaTypes';
import Link from 'next/link';
import Image from 'next/image';
import ImageWrap from '../../ImageWrap';
import { DataTable } from '../../DataTable';
import { useFormatCurrency } from '@/utils/formatCurrency';

// Move outside component to prevent recreation on each render
const periods = ['weekly', 'monthly', 'threeMonth', 'sixMonth', 'yearly'] as const;

// Add this mapping utility
const periodToFieldMap: Record<string, string> = {
    weekly: 'weeklyChange',
    monthly: 'monthlyChange',
    threeMonth: 'threeMonthChange',
    sixMonth: 'sixMonthChange',
    yearly: 'yearlyChange'
};

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

    const handleUmbrellaTypeSelect = useCallback((value: FundUmbrellaType | null) => {
        // Wrap the state update that triggers the fetch/heavy re-render
        startTransition(() => {
            setSelectedUmbrellaType(value);
        });
    }, [startTransition]); // Add startTransition as a dependency

    const columnFilters = useMemo<ColumnFiltersState>(() => {
        const filters: ColumnFiltersState = [];
        if (selectedUmbrellaType) {
            filters.push({ id: 'umbrellaType', value: selectedUmbrellaType.name });
        }
        return filters;
    }, [selectedUmbrellaType]);

    // Data fetching
    const { tefasFunds, loading, error } = useTefasFunds(currency);
    const { umbrellaTypes } = useFundUmbrellaTypes();

    // Memoized columns definition
    const columns = useMemo<ColumnDef<TefasFund>[]>(() => [
        {
            accessorKey: 'code',
            header: 'Fon Kodu',
            enableSorting: true,
            size: 70,
            cell: ({ row }) => (
                <div className="font-medium">
                    <Link className='flex gap-1 justify-center items-center' href={`/fund/detail/${row.getValue('code')}`}>
                        {row.original.founderLogoUrl ? (
                            <ImageWrap
                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/fund/${row.original.founderLogoUrl}`}
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
                        {row.getValue('code')}
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
                    {formatCurrency(row.getValue('currentPrice'))}
                </div>
            ),
        },
        ...periods.map(
            (period) => ({
                id: periodToFieldMap[period],
                accessorKey: `priceChanges.${period}`,
                header: `${period.charAt(0).toUpperCase() + period.slice(1)} Change`,
                size: 100,
                cell: ({ row }: { row: Row<TefasFund> }) => {
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
    ], [formatCurrency]);

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
                    className="max-w-md bg-white"
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
            ) : (<>
                <DataTable<TefasFund>
                    columns={columns}
                    data={tefasFunds}
                    sorting={sorting}
                    pagination={pagination}
                    totalCount={tefasFunds.length}
                    totalPages={0}
                    loading={loading}
                    setSorting={setSorting}
                    setPagination={setPagination}
                    clientSide={true}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    columnFilters={columnFilters}
                />
            </>
            )}
        </div>
    );
}