import { formatTimestamp } from '../utils/formatters';

export default function DebugPanel({ snapshotStats, coins, onToggle, isVisible, apiStats, onReset }) {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg z-50"
      >
        📊 System Dashboard
      </button>
    );
  }

  const highVolumeCoins = coins?.filter(c => c.volumeVsAvg > 50).length || 0;
  const lowVolumeCoins = coins?.filter(c => c.volumeVsAvg < -20).length || 0;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl min-w-[400px] max-h-[80vh] overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span>📊</span>
          <span>System Dashboard</span>
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
      
      {/* Snapshot Stats */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Snapshot System</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Cycles:</span>
            <span className="text-white font-mono">{snapshotStats.cycleCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Successful:</span>
            <span className="text-green-400 font-mono">{snapshotStats.successfulCycles}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Failed:</span>
            <span className="text-red-400 font-mono">{snapshotStats.failedCycles}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Data Quality:</span>
            <span className={`font-mono font-bold ${
              parseFloat(snapshotStats.dataQuality) >= 95 ? 'text-green-400' :
              parseFloat(snapshotStats.dataQuality) >= 80 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {snapshotStats.dataQuality}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Tracked Coins:</span>
            <span className="text-white font-mono">{snapshotStats.totalCoins}</span>
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

      {/* API Stats */}
      {apiStats && (
        <div className="border-t border-gray-700 pt-4 mb-4">
          <h4 className="text-xs text-gray-500 uppercase mb-2">API Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Requests:</span>
              <span className="text-white font-mono">{apiStats.requestCount || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Errors:</span>
              <span className="text-red-400 font-mono">{apiStats.errorCount || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Cache Entries:</span>
              <span className="text-white font-mono">{apiStats.cacheSize || 0}</span>
            </div>
            
            {apiStats.lastError && (
              <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded break-words">
                Last Error: {apiStats.lastError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volume Analysis */}
      <div className="border-t border-gray-700 pt-3 mb-4">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Volume Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">🔥 High Volume:</span>
            <span className="text-green-400 font-mono">{highVolumeCoins} coins</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">📉 Low Volume:</span>
            <span className="text-red-400 font-mono">{lowVolumeCoins} coins</span>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            High: &gt;50% | Low: &lt;-20%
          </div>
        </div>
      </div>

      {/* Actions */}
      {onReset && (
        <div className="border-t border-gray-700 pt-4 mb-4">
          <button
            onClick={onReset}
            className="w-full bg-red-900/20 hover:bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded transition-colors"
          >
            🗑️ Reset All Data
          </button>
        </div>
      )}

      {/* Info */}
      <div className="border-t border-gray-700 pt-3">
        <div className="text-xs text-gray-500 space-y-1">
          <div>⏱️ Snapshots update every 5min</div>
          <div>📈 More cycles = better accuracy</div>
          <div>💾 Data persists in session memory</div>
        </div>
      </div>
    </div>
  );
}