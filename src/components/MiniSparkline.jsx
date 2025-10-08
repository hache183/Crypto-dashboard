import { memo, useMemo } from 'react';

function MiniSparkline({ priceChanges }) {
  // Crea array di valori per sparkline
  const values = useMemo(() => {
    const timeframes = ['5m', '15m', '30m', '1h', '2h', '4h'];
    return timeframes.map(tf => priceChanges?.[tf] ?? null);
  }, [priceChanges]);

  // Filtra valori null
  const validValues = values.filter(v => v !== null);
  
  if (validValues.length < 2) {
    return (
      <div className="w-16 h-6 flex items-center justify-center">
        <span className="text-xs text-gray-600">-</span>
      </div>
    );
  }

  // Calcola min/max per scaling
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const range = max - min || 1;

  // Genera path SVG
  const width = 64;
  const height = 24;
  const padding = 2;

  const points = values.map((value, index) => {
    if (value === null) return null;
    const x = (index / (values.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  }).filter(p => p !== null);

  const pathData = points.reduce((acc, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${acc} ${command} ${point.x},${point.y}`;
  }, '');

  // Determina colore basato su trend
  const trend = validValues[validValues.length - 1] - validValues[0];
  const strokeColor = trend >= 0 ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} className="inline-block">
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default memo(MiniSparkline);