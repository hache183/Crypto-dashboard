import { formatTimestamp } from '../utils/formatters';

export default function Header({ 
  lastUpdate, 
  onRefresh, 
  countdown, 
  onShowHelp, 
  onShowSettings,
  alertCount 
}) {
  return (
    <header className="bg-crypto-dark border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              🚀 Crypto Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time cryptocurrency tracking with advanced analytics
            </p>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Update</p>
                <p className="text-sm text-gray-300">
                  {formatTimestamp(lastUpdate)}
                </p>
              </div>
            )}

            <div className="text-right">
              <p className="text-xs text-gray-500">Next Refresh</p>
              <p className="text-sm text-crypto-blue font-mono">
                {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
              </p>
            </div>

            {/* Alerts indicator */}
            {alertCount > 0 && (
              <div className="relative">
                <div className="bg-red-900 text-red-300 px-3 py-2 rounded-lg flex items-center gap-2">
                  <span className="animate-pulse">🚨</span>
                  <span className="font-medium">{alertCount}</span>
                </div>
              </div>
            )}

            <button
              onClick={onShowSettings}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Settings & Export"
            >
              <span>⚙️</span>
            </button>

            <button
              onClick={onShowHelp}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Keyboard shortcuts"
            >
              <span>❓</span>
            </button>

            <button
              onClick={onRefresh}
              className="bg-crypto-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Refresh data (Press R)"
            >
              <span>↻</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}