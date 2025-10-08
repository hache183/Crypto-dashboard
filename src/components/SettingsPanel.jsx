import { exportService } from '../services/exportService';
import { TIMEFRAMES } from '../constants/config';

export default function SettingsPanel({ isVisible, onClose, coins, onExportCSV, onExportJSON }) {
  if (!isVisible) return null;

  const handleExportCSV = () => {
    exportService.downloadCSV(coins, TIMEFRAMES);
  };

  const handleExportJSON = () => {
    exportService.downloadJSON(coins);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">⚙️ Settings & Export</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Export Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Export Data</h4>
          <div className="space-y-2">
            <button
              onClick={handleExportCSV}
              className="w-full bg-green-900/20 hover:bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>📊</span>
                <span>Export as CSV</span>
              </span>
              <span className="text-xs text-gray-500">{coins.length} coins</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="w-full bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800 text-blue-300 px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>📦</span>
                <span>Export as JSON</span>
              </span>
              <span className="text-xs text-gray-500">Full data</span>
            </button>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Alert Thresholds</h4>
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Price change (5m)</span>
              <span className="text-white font-mono">± 5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Volume spike</span>
              <span className="text-white font-mono">+50%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Alerts trigger when these thresholds are exceeded
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <div className="flex gap-2">
            <span>💡</span>
            <div className="text-xs text-blue-300">
              <p className="font-medium mb-1">Tips:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• CSV format works with Excel/Google Sheets</li>
                <li>• JSON includes complete data structure</li>
                <li>• Exports reflect current filters and sorting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}