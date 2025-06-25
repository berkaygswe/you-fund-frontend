"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useAssetTopMovers } from "@/hooks/useAssetTopMovers";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetTopMovers(){

    const { assets: topLosers, loading: topLosersLoading, error: topLosersError } = useAssetTopMovers('ASC', 'TRY');
    const { assets: topGainers, loading: topGainersLoading, error: topGainersError } = useAssetTopMovers('DESC', 'TRY');

    if (topLosersLoading || topGainersLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader><CardTitle>Top Gainers</CardTitle></CardHeader>
                    <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Top Losers</CardTitle></CardHeader>
                    <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
                </Card>
            </div>
        );
    }

    // Handle error state
    if (topLosersError || topGainersError) {
        return <Card className="p-4 text-red-500">Error loading data. Please try again.</Card>;
    }

    const displayTopLosers = Array.isArray(topLosers) ? topLosers : [];
    const displayTopGainers = Array.isArray(topGainers) ? topGainers : [];

    // Only render the card if assetComparisonData has data and prices has data
    if (displayTopLosers.length === 0 && displayTopGainers.length === 0) {
        return <Card className="p-4 text-gray-500">No data available for top movers at the moment.</Card>;
    }

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Top Gainers</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topGainers.map((asset) => (
                            <TableRow key={asset.symbol}>
                                <TableCell>{asset.symbol}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.currentClose.toFixed(2)}</TableCell>
                                <TableCell className={`${asset.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>{asset.percentageChange.toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Top Losers</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topLosers.map((asset) => (
                            <TableRow key={asset.symbol}>
                                <TableCell>{asset.symbol}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.currentClose.toFixed(2)}</TableCell>
                                <TableCell className={`${asset.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>{asset.percentageChange.toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
    )
}