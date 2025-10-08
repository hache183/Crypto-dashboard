import { formatCurrency, formatLargeNumber } from '../utils/formatters';
import { TIMEFRAMES } from '../constants/config';
import PercentageCell from './PercentageCell';
import TableHeader from './TableHeader';
import VolumeIndicator from './VolumeIndicator';

export default function CryptoTable({ coins, loading, error, sortConfig, onSort }) {
  if (loading && !coins.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue"></div>
      </div>
    );
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
        <TableHeader sortConfig={sortConfig} onSort={onSort} />
        
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
              
              {/* Coin Info */}
              <td className="py-3 px-4 sticky left-12 bg-crypto-dark">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-white">{coin.name}</div>
                    <div className="text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
              </td>
              
              {/* Price */}
              <td className="py-3 px-4 text-right font-mono text-white">
                {formatCurrency(coin.current_price)}
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
              
              {/* Volume 24h */}
{/* Volume 24h */}
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
}