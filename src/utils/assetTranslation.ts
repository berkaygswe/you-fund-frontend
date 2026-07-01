/**
 * Resolves a localized display name for a given asset name, falling back to the original name if not translated.
 */
export function getLocalizedAssetName(tNames: any, name: string): string {
  if (!name) return "";
  const normalizedKey = name.toUpperCase();
  
  if (typeof tNames.has === 'function' && tNames.has(normalizedKey)) {
    return tNames(normalizedKey);
  }
  
  return name;
}
