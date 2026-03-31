import { EtfListing } from '@/components/asset-listing/etf/EtfListing';
import { getTranslations } from 'next-intl/server';

export default async function EtfsPage() {
  const t = await getTranslations('Etf');

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>
      <EtfListing />
    </>
  );
}
