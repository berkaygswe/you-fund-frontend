import { FundListv5 } from '@/components/asset-listing/fund/FundListv5';
import { getTranslations } from 'next-intl/server';

export default async function FundsPage() {
  const t = await getTranslations('Fund');

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>
      <FundListv5 />
    </>
  );
}
