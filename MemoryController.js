// MemoryController.js
// Long-Term Memory System using IndexedDB (SAFE & READY-AWARE)

export class MemoryController {

  constructor() {
    this.dbName = "ANJALI_LONG_TERM_MEMORY";
    this.dbVersion = 1;
    this.db = null;
    this.ready = false;
    this.queue = [];

    this._init();
  }

  /* ---------- Initialization ---------- */
  _init() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const stores = [
        "Conversations",
        "EmotionalPatterns",
        "TrustHistory",
        "SilenceMoments",
        "LearningGrowth"
      ];

      stores.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      });
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.ready = true;

      // 🔁 queued writes flush
      this.queue.forEach(job => {
        this._write(job.store, job.data);
      });
      this.queue = [];
    };

    request.onerror = () => {
      throw new Error("IndexedDB प्रारंभ नहीं हो सका");
    };
  }

  /* ---------- Safe Writer ---------- */
  _write(storeName, data) {
    if (!this.ready) {
      this.queue.push({ store: storeName, data });
      return;
    }

    const tx = this.db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.add({
      timestamp: Date.now(),
      data
    });
  }

  /* ---------- Reader ---------- */
  _readAll(storeName, callback) {
    if (!this.ready) return;

    const tx = this.db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();

    req.onsuccess = () => callback(req.result);
  }

  /* ---------- Public APIs ---------- */

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

  recallConversations(cb) {
    this._readAll("Conversations", cb);
  }

  recallEmotions(cb) {
    this._readAll("EmotionalPatterns", cb);
  }

  recallTrustHistory(cb) {
    this._readAll("TrustHistory", cb);
  }

  recallSilenceMoments(cb) {
    this._readAll("SilenceMoments", cb);
  }

  recallLearningGrowth(cb) {
    this._readAll("LearningGrowth", cb);
  }
}
