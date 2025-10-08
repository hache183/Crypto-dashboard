import { formatCurrency, formatLargeNumber } from '../utils/formatters';
import { TIMEFRAMES } from '../constants/config';
import PercentageCell from './PercentageCell';

export default function CryptoTable({ coins, loading, error }) {
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
        No coins data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-crypto-dark z-10">
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-4 text-gray-400 font-medium sticky left-0 bg-crypto-dark">
              #
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium sticky left-12 bg-crypto-dark">
              Coin
            </th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">
              Price
            </th>
            
            {/* Colonne Timeframes */}
            {TIMEFRAMES.map(tf => (
              <th 
                key={tf.id}
                className="text-center py-3 px-2 text-gray-400 font-medium text-xs"
              >
                {tf.label}
              </th>
            ))}
            
            <th className="text-right py-3 px-4 text-gray-400 font-medium">
              Market Cap
            </th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">
              Volume 24h
            </th>
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
              
              {/* Timeframe Changes */}
              {TIMEFRAMES.map(tf => (
                <td key={tf.id} className="py-3 px-2">
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
              
              {/* Volume */}
              <td className="py-3 px-4 text-right text-gray-300">
                {formatLargeNumber(coin.total_volume)}
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