import WatchlistDashboard from "./components/watchlist-dashboard";

export default function WatchlistPage() {
    return (
        <div className="w-full pb-12">
            <div className="flex flex-col space-y-8 w-full max-w-5xl mx-auto pt-8 px-4 sm:px-6">
                <WatchlistDashboard />
            </div>
        </div>
    );
}
