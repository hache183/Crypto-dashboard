/**
 * PersistenceService - Gestisce persistenza dati in memoria
 */
class PersistenceService {
  constructor() {
    this.storage = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('💾 PersistenceService initialized');
  }

  save(key, data) {
    this.storage.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  load(key) {
    const stored = this.storage.get(key);
    return stored ? stored.data : null;
  }

  clear() {
    this.storage.clear();
    console.log('💾 Storage cleared');
  }

  getSize() {
    return this.storage.size;
  }
}

export const persistenceService = new PersistenceService();
persistenceService.init();