import { StockListing } from '@/components/asset-listing/stock/StockListing';
import { getTranslations } from 'next-intl/server';
import { Building2 } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-sm">
          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none">{t('title')}</h1>
          <p className="text-gray-600 text-sm mt-1">{t('subtitle')}</p>
        </div>
      </div>
      <StockListing />
    </>
  );
}
