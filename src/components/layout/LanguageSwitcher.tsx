"use client"

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'tr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLocale}
      className="uppercase"
    >
      {locale === 'en' ? 'TR' : 'EN'}
    </Button>
  );
}
