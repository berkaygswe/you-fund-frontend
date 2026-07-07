export const formatPercent = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return '-';
    return `${value.toFixed(2)}%`;
};
