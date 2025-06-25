import AssetComparison from "./components/fund-detail/AssetComparsion"
import AssetTopMovers from "./components/homepage/asset-top-movers"
import { SectionCards } from "./components/homepage/section-cards"

const popularAssets = [
    { symbol: 'XAU', name: 'GOLD', type: 'commodity', icon_url : '', exchange_icon_url: '' },
    { symbol: 'XAG', name: 'SILVER', type: 'commodity', icon_url : '', exchange_icon_url: '' },
    { symbol: 'XU100', name: 'BIST 100', type: 'index', icon_url : '', exchange_icon_url: '' },
    { symbol: 'IXIC', name: 'NASDAQ', type: 'index', icon_url : '', exchange_icon_url: '' },
    { symbol: 'GSPC', name: 'S&P 500', type: 'index', icon_url : '', exchange_icon_url: '' },
]

export default function Home() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
        <div className="flex flex-col col-span-2">
            <div className="grid sm:grid-cols-2 md:lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {popularAssets.map((asset) => (
                    <SectionCards key={asset.symbol} code={asset.symbol} />
                ))}
            </div>
            <AssetComparison code="" />
        </div>
        <div className="flex flex-col gap-4 col-span-1">
            <AssetTopMovers />
        </div>
    </div>
  )
}