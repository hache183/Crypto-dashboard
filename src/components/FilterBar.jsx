import { FILTER_OPTIONS } from '../constants/config';

export default function FilterBar({ 
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  totalCoins,
  watchlistCount 
}) {
  return (
    <div className="bg-crypto-dark border-b border-gray-800 px-4 py-4">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm mr-2">Filter:</span>
          
          <button
            onClick={() => onFilterChange(FILTER_OPTIONS.TOP_50)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === FILTER_OPTIONS.TOP_50
                ? 'bg-crypto-blue text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Top 50
          </button>

          <button
            onClick={() => onFilterChange(FILTER_OPTIONS.TOP_100)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === FILTER_OPTIONS.TOP_100
                ? 'bg-crypto-blue text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Top 100
          </button>

          <button
            onClick={() => onFilterChange(FILTER_OPTIONS.WATCHLIST)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeFilter === FILTER_OPTIONS.WATCHLIST
                ? 'bg-crypto-blue text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>⭐</span>
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:border-crypto-blue focus:outline-none w-64 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-medium">{totalCoins}</span> coins
          </div>
        </div>
      </div>
    </div>
  );
}