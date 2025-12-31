// MemoryController.js
// Long-Term Memory System using IndexedDB
// No assumptions, no placeholders

export class MemoryController {

  constructor() {
    this.dbName = "ANJALI_LONG_TERM_MEMORY";
    this.dbVersion = 1;
    this.db = null;

    this._init();
  }

  /* ---------- Initialization ---------- */
  _init() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Conversations
      if (!db.objectStoreNames.contains("Conversations")) {
        db.createObjectStore("Conversations", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      // Emotional Patterns
      if (!db.objectStoreNames.contains("EmotionalPatterns")) {
        db.createObjectStore("EmotionalPatterns", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      // Trust History
      if (!db.objectStoreNames.contains("TrustHistory")) {
        db.createObjectStore("TrustHistory", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      // Silence Moments
      if (!db.objectStoreNames.contains("SilenceMoments")) {
        db.createObjectStore("SilenceMoments", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      // Learning Growth
      if (!db.objectStoreNames.contains("LearningGrowth")) {
        db.createObjectStore("LearningGrowth", {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
    };

    request.onerror = () => {
      throw new Error("IndexedDB प्रारंभ नहीं हो सका");
    };
  }

  /* ---------- Generic Writer ---------- */
  _write(storeName, data) {
    if (!this.db) return;

    const tx = this.db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.add({
      timestamp: Date.now(),
      data: data
    });
  }

  /* ---------- Generic Reader ---------- */
  _readAll(storeName, callback) {
    if (!this.db) return;

    const tx = this.db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      callback(request.result);
    };
  }

  /* ---------- Public Memory APIs ---------- */

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

  recallConversations(callback) {
    this._readAll("Conversations", callback);
  }

  recallEmotions(callback) {
    this._readAll("EmotionalPatterns", callback);
  }

  recallTrustHistory(callback) {
    this._readAll("TrustHistory", callback);
  }

  recallSilenceMoments(callback) {
    this._readAll("SilenceMoments", callback);
  }

  recallLearningGrowth(callback) {
    this._readAll("LearningGrowth", callback);
  }
}
