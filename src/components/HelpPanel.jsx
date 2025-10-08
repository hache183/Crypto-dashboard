export default function HelpPanel({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">💡 Dashboard Guide</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">⌨️ Keyboard Shortcuts</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Refresh data</span>
              <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">R</kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Toggle stats panel</span>
              <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">D</kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Clear search</span>
              <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">ESC</kbd>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">✨ Features</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Click star icon</strong> to add/remove coins from watchlist</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Click column headers</strong> to sort (click again to reverse)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Use filters</strong> to switch between Top 50, Top 100, or Watchlist</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Search bar</strong> finds coins by name, symbol, or ID</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Export data</strong> as CSV or JSON from Settings (⚙️)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Alerts</strong> show automatically for significant price/volume changes</span>
            </div>
          </div>
        </div>

        {/* Understanding the Data */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">📊 Understanding the Data</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex gap-2">
              <span className="text-green-400">•</span>
              <span><strong>Price Changes:</strong> Calculated from historical snapshots (more accurate over time)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400">•</span>
              <span><strong>Vol vs Avg:</strong> Current volume compared to 24h average</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400">•</span>
              <span><strong>Cycle Count:</strong> Number of 5-minute refresh cycles completed</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400">•</span>
              <span><strong>Trend Chart:</strong> Mini sparkline showing 6-hour price movement</span>
            </div>
          </div>
        </div>

        {/* Visual Indicators */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">🎨 Visual Indicators</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">📈</span>
                <span className="text-gray-300">Price Gain</span>
              </div>
              <span className="text-xs text-gray-500">Green background</span>
            </div>

            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400">📉</span>
                <span className="text-gray-300">Price Loss</span>
              </div>
              <span className="text-xs text-gray-500">Red background</span>
            </div>

            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span>🔥</span>
                <span className="text-gray-300">High Volume</span>
              </div>
              <span className="text-xs text-gray-500">&gt;50% above avg</span>
            </div>

            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span>⭐</span>
                <span className="text-gray-300">In Watchlist</span>
              </div>
              <span className="text-xs text-gray-500">Yellow star filled</span>
            </div>

            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span>🚨</span>
                <span className="text-gray-300">Alert Active</span>
              </div>
              <span className="text-xs text-gray-500">Threshold exceeded</span>
            </div>

            <div className="bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span>-</span>
                <span className="text-gray-300">No Data</span>
              </div>
              <span className="text-xs text-gray-500">Not enough snapshots</span>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-white mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Data accuracy improves with more refresh cycles</li>
            <li>• Sort by 5m changes to catch quick movers</li>
            <li>• Use watchlist for coins you monitor frequently</li>
            <li>• Export data regularly for record-keeping</li>
            <li>• Check alerts panel for significant movements</li>
            <li>• Combine filters with search for precise results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}