import { useState } from 'react';
import { useCryptoData } from './hooks/useCryptoData';
import Header from './components/Header';
import CryptoTable from './components/CryptoTable';
import LoadingSpinner from './components/LoadingSpinner';
import DebugPanel from './components/DebugPanel';

function App() {
  const { coins, loading, error, lastUpdate, countdown, refresh, snapshotStats } = useCryptoData(50);
  const [showDebug, setShowDebug] = useState(false);

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
      />
      
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-blue-400 font-medium mb-1">
                Snapshot System Active
              </h3>
              <p className="text-sm text-gray-300">
                Price changes are calculated from historical snapshots. Data becomes more accurate after multiple refresh cycles.
                <span className="text-blue-400 ml-1">
                  Currently on cycle #{snapshotStats.cycleCount}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-crypto-dark rounded-lg shadow-xl overflow-hidden">
          <CryptoTable 
            coins={coins}
            loading={loading && coins.length > 0}
            error={error}
          />
        </div>
      </main>

      {/* Debug Panel */}
      <DebugPanel 
        snapshotStats={snapshotStats}
        isVisible={showDebug}
        onToggle={() => setShowDebug(!showDebug)}
      />
    </div>
  );
}

export default App;