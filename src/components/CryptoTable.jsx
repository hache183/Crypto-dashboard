import { memo } from 'react';
import { formatCurrency, formatLargeNumber } from '../utils/formatters';
import { TIMEFRAMES } from '../constants/config';
import PercentageCell from './PercentageCell';
import WatchlistButton from './WatchlistButton';
import VolumeIndicator from './VolumeIndicator';
import MiniSparkline from './MiniSparkline';
import TableSkeleton from './TableSkeleton';

export default memo(function CryptoTable({ 
  coins, 
  loading, 
  error, 
  sortConfig, 
  onSort,
  isInWatchlist,
  onToggleWatchlist 
}) {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '⇅';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleSort = (key) => {
    onSort(key);
  };

      if (loading && !coins.length) {
        return <TableSkeleton rows={10} />;
      }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-400">❌ {error}</p>
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No coins match your filters
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-crypto-dark z-10">
          <tr className="border-b-2 border-gray-700">
            {/* Rank */}
            <th 
              onClick={() => handleSort('market_cap_rank')}
              className="text-left py-3 px-4 text-gray-400 font-medium sticky left-0 bg-crypto-dark cursor-pointer hover:text-white transition-colors"
            >
              <span className="flex items-center gap-1">
                # {getSortIcon('market_cap_rank')}
              </span>
            </th>

            {/* Coin */}
            <th 
              onClick={() => handleSort('name')}
              className="text-left py-3 px-4 text-gray-400 font-medium sticky left-12 bg-crypto-dark cursor-pointer hover:text-white transition-colors min-w-[180px]"
            >
              <span className="flex items-center gap-1">
                Coin {getSortIcon('name')}
              </span>
            </th>

            {/* Price */}
            <th 
              onClick={() => handleSort('current_price')}
              className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
            >
              <span className="flex items-center justify-end gap-1">
                Price {getSortIcon('current_price')}
              </span>
            </th>

            {/* NUOVA COLONNA: Trend */}
            <th className="text-center py-3 px-4 text-gray-400 font-medium text-xs">
              Trend (6h)
            </th>

            {/* Price Changes per Timeframe */}
            {TIMEFRAMES.map(tf => (
              <th 
                key={`price-${tf.id}`}
                onClick={() => handleSort(`priceChanges.${tf.id}`)}
                className="text-center py-3 px-2 text-gray-400 font-medium text-xs cursor-pointer hover:text-white transition-colors"
                title={`Click to sort by ${tf.label} price change`}
              >
                <span className="flex items-center justify-center gap-1">
                  {tf.label} {getSortIcon(`priceChanges.${tf.id}`)}
                </span>
              </th>
            ))}

            {/* Market Cap */}
            <th 
              onClick={() => handleSort('market_cap')}
              className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
            >
              <span className="flex items-center justify-end gap-1">
                Market Cap {getSortIcon('market_cap')}
              </span>
            </th>

            {/* Volume 24h */}
            <th 
              onClick={() => handleSort('total_volume')}
              className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
            >
              <span className="flex items-center justify-end gap-1">
                Volume 24h {getSortIcon('total_volume')}
              </span>
            </th>

            {/* Volume vs Avg */}
            <th 
              onClick={() => handleSort('volumeVsAvg')}
              className="text-center py-3 px-4 text-gray-400 font-medium text-xs cursor-pointer hover:text-white transition-colors"
              title="Current volume vs 24h average"
            >
              <span className="flex items-center justify-center gap-1">
                Vol vs Avg {getSortIcon('volumeVsAvg')}
              </span>
            </th>

            {/* Action */}
            <th className="text-center py-3 px-4 text-gray-400 font-medium">
              Action
            </th>
          </tr>
        </thead>
        
        <tbody>
          {coins.map((coin) => (
            <tr
              key={coin.id}
              className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
            >
              {/* Rank */}
              <td className="py-3 px-4 text-gray-400 sticky left-0 bg-crypto-dark">
                {coin.market_cap_rank}
              </td>
              
              {/* Coin Info + Watchlist Button */}
              <td className="py-3 px-4 sticky left-12 bg-crypto-dark">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{coin.name}</div>
                    <div className="text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                  <WatchlistButton 
                    coinId={coin.id}
                    isInWatchlist={isInWatchlist(coin.id)}
                    onToggle={onToggleWatchlist}
                  />
                </div>
              </td>
              
              {/* Price */}
              <td className="py-3 px-4 text-right font-mono text-white">
                {formatCurrency(coin.current_price)}
              </td>

              {/* NUOVA CELLA: Sparkline */}
              <td className="py-3 px-4 text-center">
                <MiniSparkline priceChanges={coin.priceChanges} />
              </td>
              
              {/* Price Changes per Timeframe */}
              {TIMEFRAMES.map(tf => (
                <td key={`price-${coin.id}-${tf.id}`} className="py-3 px-2">
                  <PercentageCell 
                    value={coin.priceChanges?.[tf.id]} 
                    timeframe={tf.label}
                  />
                </td>
              ))}
              
              {/* Market Cap */}
              <td className="py-3 px-4 text-right text-gray-300">
                {formatLargeNumber(coin.market_cap)}
              </td>
              
              {/* Volume 24h con Volume Indicator */}
              <td className="py-3 px-4 text-right">
                <VolumeIndicator 
                  volume={coin.total_volume}
                  vsAvg={coin.volumeVsAvg}
                />
              </td>

              {/* Volume vs Average */}
              <td className="py-3 px-4">
                <PercentageCell 
                  value={coin.volumeVsAvg} 
                  timeframe="Vol vs 24h Avg"
                />
              </td>
              
              {/* Action */}
              <td className="py-3 px-4 text-center">
                <a
                  href={`https://www.coingecko.com/en/coins/${coin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crypto-blue hover:text-blue-400 text-sm"
                >
                  View →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});