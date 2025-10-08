import { useEffect } from 'react';

export function useKeyboardShortcuts({ onRefresh, onToggleDebug, onClearSearch }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignora se l'utente sta scrivendo in un input
      if (e.target.tagName === 'INPUT') return;

      switch(e.key.toLowerCase()) {
        case 'r':
          // R = Refresh
          e.preventDefault();
          onRefresh();
          break;
        case 'd':
          // D = Toggle Debug
          e.preventDefault();
          onToggleDebug();
          break;
        case 'escape':
          // ESC = Clear Search
          e.preventDefault();
          onClearSearch();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onRefresh, onToggleDebug, onClearSearch]);
}