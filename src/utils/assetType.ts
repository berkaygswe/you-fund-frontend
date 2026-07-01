/**
 * Helper to get a localized, unambiguous asset type name based on country and type.
 */
export function getAssetTypeLabel(tAsset: (key: string) => string, type: string, country?: string): string {
  if (!type) return "";
  const normalizedType = type.toLowerCase();
  const normalizedCountry = country?.toLowerCase();
  
  if (normalizedCountry) {
    const compoundKey = `${normalizedCountry}_${normalizedType}`;
    // Explicit whitelist of compound keys defined in translations
    const whitelistedKeys = ["us_stock", "us_etf", "tr_fund"];
    if (whitelistedKeys.includes(compoundKey)) {
      return tAsset(compoundKey);
    }
  }
  
  return tAsset(normalizedType);
}
