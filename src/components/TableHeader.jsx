import { TIMEFRAMES } from '../constants/config';
import InfoTooltip from './InfoTooltip';

export default function TableHeader({ sortConfig, onSort }) {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '⇅';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleSort = (key) => {
    onSort(key);
  };

  return (
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
        {/* Volume vs Avg - CON TOOLTIP */}
        <th 
        onClick={() => handleSort('volumeVsAvg')}
        className="text-center py-3 px-4 text-gray-400 font-medium text-xs cursor-pointer hover:text-white transition-colors"
        >
        <span className="flex items-center justify-center gap-1">
            Vol vs Avg {getSortIcon('volumeVsAvg')}
            <InfoTooltip content="Current 24h volume compared to the average volume over the last 24 hours. High values (>20%) indicate unusual trading activity." />
        </span>
        </th>

        {/* Action */}
        <th className="text-center py-3 px-4 text-gray-400 font-medium">
          Action
        </th>
      </tr>
    </thead>
  );
}