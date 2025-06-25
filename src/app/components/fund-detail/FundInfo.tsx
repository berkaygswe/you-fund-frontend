import { FundDetail } from "@/types/fundDetail";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

export default function FundInfo({ fund }: { fund: FundDetail }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fund Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-6 items-center justify-between">
                        <span className="col-span-2 text-sm font-medium text-gray-500">Fund Name</span>
                        <span className="col-span-4 text-right text-lg font-semibold">{fund.name}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Fund Code</span>
                        <span className="text-lg font-semibold">{fund.code}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Risk</span>
                        <span className="text-lg font-semibold">{fund.risk}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Management Fee</span>
                        <span className="text-lg font-semibold">{fund.yearlyManagementFee}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Buying Valor</span>
                        <span className="text-lg font-semibold">{fund.buyingValor}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Selling Valor</span>
                        <span className="text-lg font-semibold">{fund.sellingValor}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}