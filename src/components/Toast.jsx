import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  const colors = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-blue-900/90 border-blue-700 text-blue-100',
    warning: 'bg-yellow-900/90 border-yellow-700 text-yellow-100',
  };

  return (
    <div className={`fixed bottom-20 right-4 ${colors[type]} border rounded-lg px-4 py-3 shadow-2xl z-50 flex items-center gap-3 min-w-[300px] animate-fade-in`}>
      <span className="text-2xl">{icons[type]}</span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}