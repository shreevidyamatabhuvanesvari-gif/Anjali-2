// LearningStorage.js
// Responsibility:
// - User-taught Q/A को संरचित रूप में संग्रहित करना
// - पढ़ने योग्य APIs देना (list / topic-wise)
// Rule-based | IndexedDB | Voice-safe | No guessing

export class LearningStorage {

  constructor() {
    this.db = null;
    this.ready = false;
    this.queue = []; // ✅ pending writes
    this._init();
  }

  /* ===============================
     INIT
  =============================== */
  _init() {
    const req = indexedDB.open("ANJALI_LEARNING_DB", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains("qa")) {
        db.createObjectStore("qa", {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    req.onsuccess = (e) => {
      this.db = e.target.result;
      this.ready = true;

      // ✅ queued writes flush
      this.queue.forEach(item => {
        this._write(item.question, item.answer, item.topic);
      });
      this.queue = [];
    };

    req.onerror = () => {
      console.warn("LearningStorage disabled");
      this.ready = false;
    };
  }

  /* ===============================
     INTERNAL WRITE (SAFE)
  =============================== */
  _write(question, answer, topic) {
    const tx = this.db.transaction("qa", "readwrite");
    const store = tx.objectStore("qa");

    store.add({
      question,
      answer,
      topic,
      timestamp: Date.now()
    });
  }

  /* ===============================
     SAVE Q/A
  =============================== */
  saveQA(question, answer, topic = "general") {

    if (
      typeof question !== "string" ||
      typeof answer !== "string" ||
      question.trim() === "" ||
      answer.trim() === ""
    ) {
      return;
    }

    const q = question.trim();
    const a = answer.trim();
    const t = typeof topic === "string" ? topic : "general";

    if (!this.ready) {
      // ✅ lossless queue
      this.queue.push({ question: q, answer: a, topic: t });
      return;
    }

    this._write(q, a, t);
  }

  /* ===============================
     READ ALL
  =============================== */
  getAll(callback) {
    if (!this.ready || typeof callback !== "function") return;

    const tx = this.db.transaction("qa", "readonly");
    const store = tx.objectStore("qa");
    const req = store.getAll();

    req.onsuccess = () => callback(req.result || []);
  }

  /* ===============================
     READ BY TOPIC
  =============================== */
  getByTopic(topic, callback) {
    if (!this.ready || typeof callback !== "function") return;

    this.getAll((list) => {
      const filtered = list.filter(
        item => item.topic === topic
      );
      callback(filtered);
    });
  }

  /* ===============================
     FIND ANSWER (EXACT MATCH)
  =============================== */
  findAnswer(question, callback) {
    if (typeof callback !== "function") return;

    if (!this.ready || typeof question !== "string") {
      callback(null);
      return;
    }

    const q = question.trim();
    if (q === "") {
      callback(null);
      return;
    }

    this.getAll((list) => {
      const found = list.find(item => item.question === q);
      callback(found ? found.answer : null);
    });
  }
        }
