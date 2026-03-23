// src/app/crypto/page.tsx
import { CryptoListing } from '../components/asset-listing/crypto/CryptoListing';

export default function CryptoPage() {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Crypto Listing</h1>
                <p className="text-gray-600">Browse and compare available cryptocurrencies</p>
            </div>

            <CryptoListing />
        </>
    );
}
