import { useState } from 'react';
import { useCryptoData } from './hooks/useCryptoData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import CryptoTable from './components/CryptoTable';
import LoadingSpinner from './components/LoadingSpinner';
import DebugPanel from './components/DebugPanel';
import HelpPanel from './components/HelpPanel';

function App() {
  const { 
    coins, 
    loading, 
    error, 
    lastUpdate, 
    countdown, 
    refresh, 
    snapshotStats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
  } = useCryptoData();

  const [showDebug, setShowDebug] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRefresh: refresh,
    onToggleDebug: () => setShowDebug(prev => !prev),
    onClearSearch: () => setSearchQuery(''),
  });

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
      />

      <FilterBar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCoins={coins.length}
      />
      
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="text-blue-400 font-medium mb-1">
                Advanced Tracking Active
              </h3>
              <p className="text-sm text-gray-300">
                Price & volume changes tracked across 14 timeframes. 
                Click column headers to sort. Use filters to narrow down results.
                <span className="text-blue-400 ml-1">
                  Cycle #{snapshotStats.cycleCount}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              View shortcuts
            </button>
          </div>
        </div>

        <div className="bg-crypto-dark rounded-lg shadow-xl overflow-hidden">
          <CryptoTable 
            coins={coins}
            loading={loading && coins.length > 0}
            error={error}
            sortConfig={sortConfig}
            onSort={requestSort}
          />
        </div>
      </main>

      {/* Debug Panel */}
      <DebugPanel 
        snapshotStats={snapshotStats}
        coins={coins}
        isVisible={showDebug}
        onToggle={() => setShowDebug(!showDebug)}
      />

      {/* Help Panel */}
      <HelpPanel 
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}

export default App;