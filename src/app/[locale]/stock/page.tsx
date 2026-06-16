import { StockListing } from '@/components/asset-listing/stock/StockListing';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.Stocks" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

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
