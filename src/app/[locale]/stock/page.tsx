import { StockListing } from '@/components/asset-listing/stock/StockListing';
import { getTranslations } from 'next-intl/server';

export default async function StocksPage() {
  const t = await getTranslations('Stocks');

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>
      <StockListing />
    </>
  );
}
