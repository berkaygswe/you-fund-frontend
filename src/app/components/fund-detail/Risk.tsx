import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";

const RISK_COLORS = [
  "bg-green-600",    // 1
  "bg-lime-400",     // 2
  "bg-yellow-400",   // 3
  "bg-orange-300",   // 4
  "bg-orange-500",   // 5
  "bg-red-500",      // 6
  "bg-red-800",      // 7
];

type RiskScaleProps = {
  riskLevel: number; // 1 to 7
};

export default function RiskScale({ riskLevel }: RiskScaleProps) {
  return (
    <Card>
        <CardContent>
            {/* Risk Bars */}
            <div className="flex w-full justify-between gap-1">
                {Array.from({ length: 7 }, (_, i) => {
                const level = i + 1;
                const isSelected = riskLevel === level;
                return (
                    <div key={level} className="flex flex-col items-center flex-1 relative">
                        {/* Box */}
                        <div
                            className={cn(
                            "w-full flex items-center justify-center text-white text-sm font-medium rounded-md",
                            RISK_COLORS[i],
                            isSelected ? "h-10" : "h-6",
                            )}
                        >
                            {level}
                        </div>
                        {/* Arrow */}
                        {isSelected && (
                            <div className="absolute top-10">
                                <ChevronUp />
                            </div>
                        )}
                    </div>
                );
                })}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-6 text-sm text-muted-foreground">
                <span>Düşük Risk</span>
                <span>Yüksek Risk</span>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground">
                Fonun haftalık getirileri üzerinden, volatilitesi dikkate alınarak hesaplanır.
                1 en az riskli, 7 en fazla riskli olmak üzere Risk Değeri 1 ile 7 arasındadır.
            </p>
      </CardContent>
    </Card>
  );
}