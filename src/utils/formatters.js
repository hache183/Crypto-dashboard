/**
 * Formatta numero in valuta USD
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

/**
 * Formatta numero grande (market cap, volume)
 */
export const formatLargeNumber = (value) => {
  if (value === null || value === undefined) return '0';
  
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

/**
 * Formatta percentuale con colore
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0.00%';
  
  const formatted = Math.abs(value).toFixed(2);
  return `${value >= 0 ? '+' : '-'}${formatted}%`;
};

/**
 * Ottieni classe CSS per percentuale (verde/rosso)
 */
export const getPercentageColorClass = (value) => {
  if (value === null || value === undefined || value === 0) {
    return 'text-gray-400';
  }
  return value > 0 ? 'text-crypto-green' : 'text-crypto-red';
};

/**
 * Formatta timestamp in formato leggibile
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Formatta percentuale compatta per tabella
 * Mostra solo se disponibile, altrimenti -
 */
export const formatCompactPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  return formatPercentage(value);
};

/**
 * Ottieni background color class per celle percentuale
 */
export const getPercentageBackgroundClass = (value) => {
  if (value === null || value === undefined) return '';
  
  if (value > 5) return 'bg-green-900/30';
  if (value > 0) return 'bg-green-900/10';
  if (value < -5) return 'bg-red-900/30';
  if (value < 0) return 'bg-red-900/10';
  return '';
};