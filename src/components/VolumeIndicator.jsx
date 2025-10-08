import { formatLargeNumber, getPercentageColorClass } from '../utils/formatters';

export default function VolumeIndicator({ volume, vsAvg }) {
  const getVolumeIcon = (change) => {
    if (change === null || change === undefined) return '📊';
    if (change > 50) return '🔥'; // Volume molto alto
    if (change > 20) return '📈'; // Volume alto
    if (change < -20) return '📉'; // Volume basso
    return '📊'; // Volume normale
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="text-gray-300 text-sm">
        {formatLargeNumber(volume)}
      </div>
      {vsAvg !== null && vsAvg !== undefined && (
        <div className={`text-xs flex items-center gap-1 ${getPercentageColorClass(vsAvg)}`}>
          <span>{getVolumeIcon(vsAvg)}</span>
          <span>{vsAvg > 0 ? '+' : ''}{vsAvg.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}