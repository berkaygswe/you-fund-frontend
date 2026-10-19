// src/components/crypto/detail/CryptoDataFreshnessBar.tsx
"use client";

import React from 'react';
import { Clock, ShieldCheck, AlertCircle, Info, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CryptoFreshnessStatus } from '@/types/cryptoMetadata';
import { useTranslations, useLocale } from 'next-intl';

interface CryptoDataFreshnessBarProps {
    freshness?: CryptoFreshnessStatus;
    providerUpdatedAt?: string | null;
    fetchedAt?: string | null;
    provider?: string;
    currency?: string | null;
    fxRateDate?: string | null;
    className?: string;
}

export function CryptoDataFreshnessBar({
    freshness = 'UNKNOWN',
    providerUpdatedAt,
    fetchedAt,
    provider,
    currency,
    fxRateDate,
    className = '',
}: CryptoDataFreshnessBarProps) {
    const t = useTranslations('CryptoDetail');
    const locale = useLocale();

    const timestampToDisplay = providerUpdatedAt || fetchedAt;

    const formattedTime = React.useMemo(() => {
        if (!timestampToDisplay) return null;
        try {
            const date = new Date(timestampToDisplay);
            if (isNaN(date.getTime())) return null;
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
            }).format(date);
        } catch {
            return null;
        }
    }, [timestampToDisplay, locale]);

    const formattedFxDate = React.useMemo(() => {
        if (!fxRateDate) return null;
        try {
            const date = new Date(fxRateDate);
            if (isNaN(date.getTime())) return fxRateDate;
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
        } catch {
            return fxRateDate;
        }
    }, [fxRateDate, locale]);

    const freshnessConfig = {
        FRESH: {
            label: t('fresh'),
            badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
            dotClass: 'bg-emerald-500 animate-pulse',
            icon: ShieldCheck,
        },
        DELAYED: {
            label: t('delayed'),
            badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
            dotClass: 'bg-amber-500',
            icon: Clock,
        },
        STALE: {
            label: t('stale'),
            badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40',
            dotClass: 'bg-rose-500',
            icon: AlertCircle,
        },
        UNKNOWN: {
            label: t('unknown'),
            badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            dotClass: 'bg-slate-400',
            icon: Info,
        },
    }[freshness] || {
        label: t('unknown'),
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        dotClass: 'bg-slate-400',
        icon: Info,
    };

    const StatusIcon = freshnessConfig.icon;

    return (
        <div
            className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-xs text-slate-600 dark:text-slate-300 ${className}`}
        >
            <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                    <Database className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{provider ? `${provider} Data Feed` : 'Institutional Data Feed'}</span>
                </div>

                <Badge
                    variant="outline"
                    className={`gap-1 px-2 py-0.5 font-semibold text-[11px] ${freshnessConfig.badgeClass}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${freshnessConfig.dotClass}`} />
                    <StatusIcon className="w-3 h-3" />
                    {freshnessConfig.label}
                </Badge>

                {formattedTime ? (
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{t('sourceObservation')}: <strong className="font-medium text-slate-700 dark:text-slate-300">{formattedTime}</strong></span>
                    </div>
                ) : null}
            </div>

            {currency === 'TRY' && formattedFxDate ? (
                <div className="flex items-center gap-1.5 bg-blue-50/70 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800/30 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                    <Info className="w-3 h-3" />
                    <span>{t('fxRateDateNotice', { date: formattedFxDate })}</span>
                </div>
            ) : null}
        </div>
    );
}
