import { formatTimestamp } from '../utils/formatters';

export default function DebugPanel({ snapshotStats, onToggle, isVisible }) {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
      >
        📊 Stats
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">📊 Snapshot Stats</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
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

        <div className="pt-2 border-t border-gray-700 mt-2">
          <div className="text-xs text-gray-500">
            Snapshots update every 5min
          </div>
        </div>
      </div>
    </div>
  );
}