import { memo } from 'react';
import { formatCompactPercentage, getPercentageColorClass, getPercentageBackgroundClass } from '../utils/formatters';

export default memo(function PercentageCell({ value, timeframe }) {
  const colorClass = getPercentageColorClass(value);
  const bgClass = getPercentageBackgroundClass(value);

  return (
    <div 
      className={`px-2 py-1 rounded text-center font-mono text-sm ${bgClass}`}
      title={value !== null ? `${timeframe}: ${formatCompactPercentage(value)}` : 'Data not available yet'}
    >
      <span className={colorClass}>
        {formatCompactPercentage(value)}
      </span>
    </div>
  );
});