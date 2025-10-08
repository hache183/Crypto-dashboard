import { formatTimestamp } from '../utils/formatters';

export default function DebugPanel({ snapshotStats, coins, onToggle, isVisible }) {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg"
      >
        📊 Stats
      </button>
    );
  }

  // Calculate some interesting stats
  const highVolumeCoins = coins?.filter(c => c.volumeVsAvg > 50).length || 0;
  const lowVolumeCoins = coins?.filter(c => c.volumeVsAvg < -20).length || 0;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl min-w-[320px] max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">📊 Dashboard Stats</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {/* Snapshot Stats */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Snapshot System</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Tracked Coins:</span>
            <span className="text-white font-mono">{snapshotStats.totalCoins}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Cycle Count:</span>
            <span className="text-white font-mono">{snapshotStats.cycleCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Avg Snapshots/Coin:</span>
            <span className="text-white font-mono">
              {snapshotStats.avgSnapshotsPerCoin.toFixed(1)}
            </span>
          </div>
          
          {snapshotStats.lastSnapshotTime && (
            <div className="flex justify-between">
              <span className="text-gray-400">Last Snapshot:</span>
              <span className="text-white font-mono text-xs">
                {formatTimestamp(snapshotStats.lastSnapshotTime)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Volume Stats */}
      <div className="border-t border-gray-700 pt-3">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Volume Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">🔥 High Volume:</span>
            <span className="text-crypto-green font-mono">{highVolumeCoins} coins</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">📉 Low Volume:</span>
            <span className="text-crypto-red font-mono">{lowVolumeCoins} coins</span>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            High: &gt;50% above avg | Low: &lt;-20% below avg
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="text-xs text-gray-500">
          <div className="mb-1">⏱️ Snapshots update every 5min</div>
          <div>📈 More data = more accurate trends</div>
        </div>
      </div>
    </div>
  );
}