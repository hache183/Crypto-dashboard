import { formatTimestamp } from '../utils/formatters';

export default function AlertPanel({ alerts, onClose }) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[60vh] overflow-y-auto z-40">
      <div className="bg-gray-900 border border-red-800 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            <h3 className="text-white font-medium">Active Alerts</h3>
            <span className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-gray-800">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 ${
                alert.type === 'price' 
                  ? 'bg-orange-900/10' 
                  : 'bg-blue-900/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {alert.type === 'price' 
                    ? (alert.value > 0 ? '📈' : '📉')
                    : '🔥'
                  }
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">
                      {alert.coinSymbol.toUpperCase()}
                    </span>
                    <span className={`text-sm font-mono ${
                      alert.value > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {alert.value > 0 ? '+' : ''}{alert.value.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(alert.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}