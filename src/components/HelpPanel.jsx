export default function HelpPanel({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">⌨️ Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Refresh data</span>
            <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">R</kbd>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Toggle stats panel</span>
            <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">D</kbd>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Clear search</span>
            <kbd className="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono">ESC</kbd>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-white mb-2">💡 Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Click column headers to sort</li>
            <li>• Use filters to narrow results</li>
            <li>• Search works on name, symbol, and ID</li>
            <li>• Data accuracy improves over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}