/**
 * ExportService - Gestisce export di dati in vari formati
 */
class ExportService {
  /**
   * Export coins data come CSV
   */
  exportCSV(coins, timeframes) {
    // Headers
    const headers = [
      'Rank',
      'Name',
      'Symbol',
      'Price (USD)',
      'Market Cap',
      'Volume 24h',
      'Volume vs Avg (%)',
    ];

    // Aggiungi headers per timeframes
    timeframes.forEach(tf => {
      headers.push(`Price Change ${tf.label} (%)`);
    });

    // Crea righe CSV
    const rows = coins.map(coin => {
      const row = [
        coin.market_cap_rank,
        coin.name,
        coin.symbol.toUpperCase(),
        coin.current_price,
        coin.market_cap,
        coin.total_volume,
        coin.volumeVsAvg?.toFixed(2) || 'N/A',
      ];

      // Aggiungi price changes
      timeframes.forEach(tf => {
        const change = coin.priceChanges?.[tf.id];
        row.push(change !== null && change !== undefined ? change.toFixed(2) : 'N/A');
      });

      return row;
    });

    // Combina headers e rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Export coins data come JSON
   */
  exportJSON(coins) {
    const exportData = coins.map(coin => ({
      rank: coin.market_cap_rank,
      name: coin.name,
      symbol: coin.symbol,
      id: coin.id,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      volumeVsAvg: coin.volumeVsAvg,
      priceChanges: coin.priceChanges,
      volumeChanges: coin.volumeChanges,
      image: coin.image,
      lastUpdated: new Date().toISOString(),
    }));

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Download file
   */
  download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📥 Downloaded', filename);
  }

  /**
   * Export e download CSV
   */
  downloadCSV(coins, timeframes) {
    const csv = this.exportCSV(coins, timeframes);
    const timestamp = new Date().toISOString().split('T')[0];
    this.download(csv, `crypto-dashboard-${timestamp}.csv`, 'text/csv');
  }

  /**
   * Export e download JSON
   */
  downloadJSON(coins) {
    const json = this.exportJSON(coins);
    const timestamp = new Date().toISOString().split('T')[0];
    this.download(json, `crypto-dashboard-${timestamp}.json`, 'application/json');
  }
}

// Export singleton
export const exportService = new ExportService();