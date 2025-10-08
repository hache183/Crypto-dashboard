import { useMemo } from 'react';

export default function StatsSummary({ coins }) {
  const stats = useMemo(() => {
    if (!coins || coins.length === 0) {
      return { gainers: 0, losers: 0, avgChange: 0, highVolume: 0 };
    }

    const changes24h = coins
      .map(c => c.priceChanges?.['24h'])
      .filter(c => c !== null && c !== undefined);

    const gainers = changes24h.filter(c => c > 0).length;
    const losers = changes24h.filter(c => c < 0).length;
    const avgChange = changes24h.length > 0
      ? changes24h.reduce((sum, c) => sum + c, 0) / changes24h.length
      : 0;
    
    const highVolume = coins.filter(c => c.volumeVsAvg > 50).length;

    return { gainers, losers, avgChange, highVolume };
  }, [coins]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Gainers */}
      <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📈</span>
          <span className="text-sm text-gray-400">Gainers (24h)</span>
        </div>
        <div className="text-2xl font-bold text-green-400">
          {stats.gainers}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {coins.length > 0 ? ((stats.gainers / coins.length) * 100).toFixed(0) : 0}% of total
        </div>
      </div>

      {/* Losers */}
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📉</span>
          <span className="text-sm text-gray-400">Losers (24h)</span>
        </div>
        <div className="text-2xl font-bold text-red-400">
          {stats.losers}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {coins.length > 0 ? ((stats.losers / coins.length) * 100).toFixed(0) : 0}% of total
        </div>
      </div>

      {/* Avg Change */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <span className="text-sm text-gray-400">Avg Change (24h)</span>
        </div>
        <div className={`text-2xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Market sentiment
        </div>
      </div>

      {/* High Volume */}
      <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔥</span>
          <span className="text-sm text-gray-400">High Volume</span>
        </div>
        <div className="text-2xl font-bold text-orange-400">
          {stats.highVolume}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          &gt;50% above average
        </div>
      </div>
    </div>
  );
}