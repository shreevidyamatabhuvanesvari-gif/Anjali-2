// MemoryController.js
// NON-BLOCKING Long-Term Memory System
// GUARANTEED: App response will NEVER stop

export class MemoryController {

  constructor() {
    this.db = null;
    this.ready = false;
    this._init();
  }

  /* ---------- Init (NON-BLOCKING) ---------- */
  _init() {
    const request = indexedDB.open("ANJALI_LONG_TERM_MEMORY", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      ["Conversations","EmotionalPatterns","TrustHistory","SilenceMoments","LearningGrowth"]
        .forEach(name => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: "id", autoIncrement: true });
          }
        });
    };

    request.onsuccess = (e) => {
      this.db = e.target.result;
      this.ready = true;
    };

    request.onerror = () => {
      // ❗ Memory failure MUST NOT stop app
      console.warn("Memory disabled: IndexedDB unavailable");
      this.ready = false;
    };
  }

  /* ---------- SAFE WRITE (NEVER BLOCKS) ---------- */
  _write(store, data) {
    if (!this.ready || !this.db) return; // 🔒 skip silently

    try {
      const tx = this.db.transaction(store, "readwrite");
      tx.objectStore(store).add({
        timestamp: Date.now(),
        data
      });
    } catch (e) {
      // ❗ ignore — response must continue
    }
  }

  /* ---------- PUBLIC APIs (ALL NON-BLOCKING) ---------- */

  rememberConversation(text) {
    this._write("Conversations", text);
  }

  rememberEmotion(emotion) {
    this._write("EmotionalPatterns", emotion);
  }

  rememberTrustEvent(event) {
    this._write("TrustHistory", event);
  }

  rememberSilence(reason) {
    this._write("SilenceMoments", reason);
  }

  rememberLearning(detail) {
    this._write("LearningGrowth", detail);
  }

}
