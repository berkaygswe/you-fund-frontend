// src/app/funds/page.tsx
import { EtfListing } from '../components/EtfListing';

export default function EtfsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Etf Listing</h1>
        <p className="text-gray-600">Browse and compare available etfs</p>
      </div>
    
      <EtfListing />
    </>
  );
}