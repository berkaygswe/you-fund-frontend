"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/components/ui/select"
import { useCurrencyStore } from "@/stores/currency-store"
import Image from "next/image"
import { Currency, SUPPORTED_CURRENCIES } from "@/types/currency"

export function CurrencySwitcher() {
    const currency = useCurrencyStore((s) => s.currency)
    const setCurrency = useCurrencyStore((s) => s.setCurrency)
    const hasHydrated = useCurrencyStore((s) => s._hasHydrated)

    // Show loading state during hydration to prevent mismatch
    if (!hasHydrated) {
        return (
            <div className="w-[130px] h-9 px-3 border rounded-md flex items-center justify-between bg-background">
                <div className="flex items-center gap-2 opacity-50">
                    <div className="w-5 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        )
    }

    const selected = SUPPORTED_CURRENCIES.find((c) => c.value === currency)

    return (
        <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
            <SelectTrigger className="w-[130px] h-9 px-3 justify-between bg-background cursor-pointer hover:bg-accent transition-all">
                {selected && (
                    <div className="flex items-center gap-2">
                        <Image
                            src={`https://flagcdn.com/h20/${selected.countryCode}.png`}
                            alt="Currency Flag"
                            width={20}
                            height={15}
                        />
                        <div>{selected.value}</div>
                    </div>
                )}
            </SelectTrigger>
            <SelectContent position="popper">
                {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                            <Image
                                src={`https://flagcdn.com/h20/${c.countryCode}.png`}
                                alt={c.value}
                                width={20}
                                height={15}
                            />
                            {c.value}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
