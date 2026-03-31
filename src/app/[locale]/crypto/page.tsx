import { CryptoListing } from '@/components/asset-listing/crypto/CryptoListing';
import { getTranslations } from 'next-intl/server';

export default async function CryptoPage() {
    const t = await getTranslations('Crypto');

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-gray-600">{t('subtitle')}</p>
            </div>
            <CryptoListing />
        </>
    );
}
