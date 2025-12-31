// MemoryController.js
export class MemoryController {
  constructor() {
    this.dbKey = "ANJALI_LONG_TERM_MEMORY";
    this.memory = JSON.parse(localStorage.getItem(this.dbKey)) || [];
  }

  remember(entry) {
    this.memory.push({
      time: new Date().toISOString(),
      data: entry
    });
    localStorage.setItem(this.dbKey, JSON.stringify(this.memory));
  }

  recall() {
    return this.memory;
  }
}
