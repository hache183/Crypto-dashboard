import { useState, useMemo, useCallback } from 'react';
import { useCryptoData } from './hooks/useCryptoData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';
import { coinGeckoService } from './services/coinGeckoService';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatsSummary from './components/StatsSummary';
import CryptoTable from './components/CryptoTable';
import LoadingSpinner from './components/LoadingSpinner';
import DebugPanel from './components/DebugPanel';
import HelpPanel from './components/HelpPanel';
import SettingsPanel from './components/SettingsPanel';
import AlertPanel from './components/AlertPanel';
import Toast from './components/Toast';

function App() {
  const { 
    coins, 
    loading, 
    error, 
    lastUpdate, 
    countdown, 
    refresh,
    reset, // ✅ Nuova funzione
    snapshotStats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    toggleWatchlist,
    isInWatchlist,
    watchlistCount,
    alerts,
    alertStats, // ✅ Nuove statistiche
  } = useCryptoData();

  const { toasts, showToast, removeToast } = useToast();

  const [showDebug, setShowDebug] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);

  // Handle watchlist toggle with toast feedback
  const handleToggleWatchlist = useCallback((coinId) => {
    const added = toggleWatchlist(coinId);
    showToast(
      added ? '⭐ Added to watchlist' : 'Removed from watchlist',
      'success',
      2000
    );
  }, [toggleWatchlist, showToast]);

  // Handle reset with confirmation
  const handleReset = useCallback(() => {
    reset();
    showToast('🗑️ All data has been reset', 'info', 3000);
  }, [reset, showToast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRefresh: refresh,
    onToggleDebug: () => setShowDebug(prev => !prev),
    onClearSearch: () => setSearchQuery(''),
  });

  // Memoize active alerts with severity
  const activeAlerts = useMemo(() => alerts, [alerts]);
  const hasHighSeverityAlerts = useMemo(() => 
    activeAlerts.some(alert => alert.severity === 'high'),
    [activeAlerts]
  );

  // ✅ Get API stats
  const apiStats = useMemo(() => coinGeckoService.getStats(), [loading]);

  // Show loading spinner only on initial load
  if (loading && !coins.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Header 
        lastUpdate={lastUpdate}
        onRefresh={refresh}
        countdown={countdown}
        onShowHelp={() => setShowHelp(true)}
        onShowSettings={() => setShowSettings(true)}
        alertCount={activeAlerts.length}
        hasHighSeverityAlerts={hasHighSeverityAlerts} // ✅ Passa severity
      />

      <FilterBar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCoins={coins.length}
        watchlistCount={watchlistCount}
      />

      {/* Stats Summary */}
      {!loading && coins.length > 0 && (
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <StatsSummary coins={coins} />
        </div>
      )}
      
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="text-blue-400 font-medium mb-1">
                Professional Crypto Tracking Dashboard
              </h3>
              <div className="text-sm text-gray-300 flex items-center gap-4 flex-wrap">
                <span>
                  14 timeframes • Volume analytics • Real-time alerts
                </span>
                <span className="text-blue-400">
                  Cycle #{snapshotStats.cycleCount}
                </span>
                <span className={`font-medium ${
                  parseFloat(snapshotStats.dataQuality) >= 95 ? 'text-green-400' :
                  parseFloat(snapshotStats.dataQuality) >= 80 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  Quality: {snapshotStats.dataQuality}%
                </span>
                <span className="text-yellow-400">
                  ⭐ {watchlistCount} watchlist
                </span>
                {activeAlerts.length > 0 && (
                  <span className={`font-bold ${hasHighSeverityAlerts ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
                    🚨 {activeAlerts.length} alerts
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="text-blue-400 hover:text-blue-300 text-sm underline whitespace-nowrap"
            >
              View guide
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-red-400 font-medium mb-1">Error Loading Data</h3>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
              <button
                onClick={refresh}
                className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-crypto-dark rounded-lg shadow-xl overflow-hidden">
          <CryptoTable 
            coins={coins}
            loading={loading && coins.length > 0}
            error={error}
            sortConfig={sortConfig}
            onSort={requestSort}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>

        {/* Empty State */}
        {!loading && coins.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-white mb-2">No coins found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-crypto-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Alert Panel */}
      {showAlerts && activeAlerts.length > 0 && (
        <AlertPanel 
          alerts={activeAlerts}
          onClose={() => setShowAlerts(false)}
        />
      )}

      {/* Debug Panel */}
      <DebugPanel 
        snapshotStats={snapshotStats}
        coins={coins}
        isVisible={showDebug}
        onToggle={() => setShowDebug(!showDebug)}
        apiStats={apiStats} // ✅ Passa API stats
        onReset={handleReset} // ✅ Passa handler reset
      />

      {/* Help Panel */}
      <HelpPanel 
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        coins={coins}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Loading Overlay */}
      {loading && coins.length > 0 && (
        <div className="fixed top-20 right-4 bg-blue-900/90 border border-blue-700 rounded-lg px-4 py-2 shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="text-white text-sm font-medium">Updating data...</span>
          </div>
        </div>
      )}

      {/* System Status Footer */}
      <div className="fixed bottom-4 left-4 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-gray-400 z-40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>System Active</span>
          </div>
          <div>API: {apiStats.successRate}% success</div>
          <div>Alerts: {alertStats?.totalAlerts || 0} total</div>
        </div>
      </div>
    </div>
  );
}

export default App;