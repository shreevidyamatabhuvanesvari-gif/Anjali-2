// MemoryController.js
// SAFE & NON-BLOCKING MEMORY LAYER
// DOES NOT AFFECT VOICE FLOW

export class MemoryController {

  constructor() {
    this.db = null;
    this.ready = false;
    this._init();
  }

  _init() {
    const request = indexedDB.open("ANJALI_LONG_TERM_MEMORY", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      [
        "Conversations",
        "EmotionalPatterns",
        "TrustHistory",
        "SilenceMoments",
        "LearningGrowth"
      ].forEach(name => {
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
      // Memory failure must never stop app
      this.ready = false;
    };
  }

  _write(store, data) {
    if (!this.ready || !this.db) return;

    try {
      const tx = this.db.transaction(store, "readwrite");
      tx.objectStore(store).add({
        timestamp: Date.now(),
        data
      });
    } catch (_) {}
  }

  rememberConversation(text) {
    this._write("Conversations", text);
  }

  rememberLearning(reply) {
    this._write("LearningGrowth", reply);
  }

  rememberEmotion(emotion) {
    this._write("EmotionalPatterns", emotion);
  }

  rememberSilence(reason) {
    this._write("SilenceMoments", reason);
  }
}
