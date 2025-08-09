"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select"
import { useCurrencyStore} from "@/stores/currency-store"
import Image from "next/image"
import { Currency } from "@/types/currency"

const currencies: { code: Currency; symbol: string; countryCode: string }[] = [
  { code: "USD", symbol: "$", countryCode: "us" },
  { code: "TRY", symbol: "₺", countryCode: "tr" },
]

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

  const selected = currencies.find((c) => c.code === currency)

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
            <div>{selected.code}</div>
          </div>
        )}
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <div className="flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/h20/${c.countryCode}.png`}
                alt={c.code}
                width={20}
                height={15}
              />
              {c.code}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}