import { formatPercent as formatLocalePercent } from '@/lib/format/number-format';

/**
 * @deprecated Use `useFormatters().percent` from `@/lib/format/use-formatters` (locale-aware).
 * Pinned to "en" to keep current output unchanged until call sites migrate.
 */
export const formatPercent = (value: number | null | undefined): string =>
    formatLocalePercent(value, { locale: 'en' });
