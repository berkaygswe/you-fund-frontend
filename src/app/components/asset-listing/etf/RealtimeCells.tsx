import { ArrowDown, ArrowUp } from "lucide-react";
import { useRef } from "react";
import { useFormatCurrency } from "@/utils/formatCurrency";

/**
 * Hook that tracks price direction changes and returns a flash key + direction.
 * 
 * Instead of using React state (which races with high-frequency WebSocket ticks),
 * this uses a ref-based counter. The consumer uses the counter as a React `key`
 * on a flash overlay element, forcing a remount that restarts the CSS animation.
 * This follows Vercel's `rerender-use-ref-transient-values` pattern.
 */
function useFlash(currentValue: number | undefined, initialValue: number) {
    const prevRef = useRef(initialValue);
    const flashRef = useRef<{ key: number; direction: 'green' | 'red' }>({ key: 0, direction: 'green' });

    if (currentValue !== undefined && currentValue !== prevRef.current) {
        const direction = currentValue > prevRef.current ? 'green' : 'red';
        prevRef.current = currentValue;
        // Increment the key to force a new element mount → restart CSS animation
        flashRef.current = { key: flashRef.current.key + 1, direction };
    }

    return flashRef.current;
}

// ─── Flash Overlay ──────────────────────────────────────────────────────────
// A tiny element that mounts with a CSS animation class. Because it has a unique
// `key`, React unmounts the old one and mounts a new one on each price change,
// which restarts the CSS `@keyframes` animation automatically.
function FlashOverlay({ flashKey, direction }: { flashKey: number; direction: 'green' | 'red' }) {
    if (flashKey === 0) return null; // No flash on initial render
    return (
        <span
            key={flashKey}
            className={`absolute inset-0 rounded pointer-events-none price-flash-${direction}`}
        />
    );
}

// ─── Price Cell ─────────────────────────────────────────────────────────────

interface PriceCellProps {
    value: number;
    realtimePrice?: number;
    timestamp?: number;
}

export function RealtimePriceCell({ value, realtimePrice, timestamp }: PriceCellProps) {
    const formatCurrency = useFormatCurrency();
    const { key: flashKey, direction } = useFlash(realtimePrice, value);

    const displayPrice = realtimePrice ?? value;

    return (
        <div className="relative text-center whitespace-nowrap rounded px-2 py-1">
            <FlashOverlay flashKey={flashKey} direction={direction} />
            <span className="relative z-[1]">{formatCurrency(displayPrice)}</span>
        </div>
    );
}

// ─── Change Cell ────────────────────────────────────────────────────────────

interface ChangeCellProps {
    value: number;
    realtimeChange?: number;
}

export function RealtimeChangeCell({ value, realtimeChange }: ChangeCellProps) {
    const displayChange = realtimeChange ?? value;

    if (displayChange == null || isNaN(displayChange)) {
        return <div className="text-center">-</div>;
    }

    const isPositive = displayChange >= 0;

    const { key: flashKey, direction } = useFlash(realtimeChange, value);

    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

    return (
        <div className={`relative text-center font-semibold rounded px-2 py-1 ${colorClass}`}>
            <FlashOverlay flashKey={flashKey} direction={direction} />
            <span className="relative z-[1]">
                {isPositive ? (
                    <ArrowUp className="inline h-4 w-4 mr-1" />
                ) : (
                    <ArrowDown className="inline h-4 w-4 mr-1" />
                )}
                {displayChange.toFixed(2)}%
            </span>
        </div>
    );
}
