import { EtfListing } from '@/components/asset-listing/etf/EtfListing';
import { getTranslations } from 'next-intl/server';
import { Layers } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.Etf" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function EtfsPage() {
  const t = await getTranslations('Etf');

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none">{t('title')}</h1>
          <p className="text-gray-600 text-sm mt-1">{t('subtitle')}</p>
        </div>
      </div>
      <EtfListing />
    </>
  );
}
