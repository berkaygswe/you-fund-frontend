import { useFundAllocation } from "@/hooks/useFundAllocation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Cell, Pie, PieChart, Sector } from "recharts"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)", "var(--chart-7)"];

const chartConfig = {} as ChartConfig;

export default function FundAllocation({ code }: { code: string })  {
    const {fundAllocation, loading, error} = useFundAllocation(code);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const activeItem = activeIndex !== null ? fundAllocation[activeIndex] : null;

    const renderActiveShape = (props: any) => {
        const {
        cx, cy, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent
        } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 5}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Fund Allocations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-[250px] w-full rounded-md" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardContent>
            </Card>
        );
    }

    if (!fundAllocation || fundAllocation.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fund Allocations</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
                    <PieChart>
                        <ChartTooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                            const { name, percentage } = payload[0].payload;
                            return (
                                <ChartTooltipContent>
                                <div className="text-sm font-semibold">{name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {percentage.toFixed(2)}%
                                </div>
                                </ChartTooltipContent>
                            );
                            }
                            return null;
                        }}
                        />
                        <Pie
                            data={fundAllocation}
                            dataKey="percentage"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={90}
                            activeIndex={activeIndex ?? undefined}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                            {fundAllocation.map((entry, index) => (
                                <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {activeItem && (
                    <div className="text-center">
                        <div className="text-sm font-medium">{activeItem.name}</div>
                        <div className="text-xs text-muted-foreground">
                        {activeItem.percentage.toFixed(2)}%
                        </div>
                    </div>
                )}

                <CardFooter className="flex-col gap-2 text-sm p-0 mt-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Distribution</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fundAllocation.map((allocation, index) => (
                                <TableRow key={index}>
                                    <TableCell>{allocation.name}</TableCell>
                                    <TableCell className="text-right">{allocation.percentage.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardFooter>
            </CardContent>
        </Card>
    );
}