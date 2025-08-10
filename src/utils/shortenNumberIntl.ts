// utils/shortenNumberIntl.js
export function shortenNumberIntl(value: number, maximumFractionDigits = 1, locale = 'en-US') {
  if (value === null || value === undefined || value === 0) return '';

  if (!isFinite(value)) return String(value);

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits
  }).format(value);
}