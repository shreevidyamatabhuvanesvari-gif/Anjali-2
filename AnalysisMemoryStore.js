// AnalysisMemoryStore.js
// PURPOSE: विश्लेषण-संदर्भ स्मृति
// SPEED: O(1) lookup
// Offline | Deterministic

export class AnalysisMemoryStore {

  constructor() {
    this.cache = [];
    this.MAX = 50; // सीमित लेकिन तेज़
  }

  remember(entry) {
    this.cache.unshift(entry);
    if (this.cache.length > this.MAX) {
      this.cache.pop();
    }
  }

  last() {
    return this.cache[0] || null;
  }

  findByType(type) {
    return this.cache.find(e => e.type === type) || null;
  }
}
