/* =========================================================
   KnowledgeBase.js
   Role: Persistent Knowledge Storage (IndexedDB)
   Stage: 6
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const DB_VERSION = 1;
  const STORE_QA = "qa_store";

  let db = null;

  // ---------- Open / Init DB ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_QA)) {
          const store = d.createObjectStore(STORE_QA, {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("by_subject", "subject", { unique: false });
          store.createIndex("by_topic", "topic", { unique: false });
          store.createIndex("by_time", "time", { unique: false });
        }
      };

      req.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = () => reject(req.error);
    });
  }

  // ---------- Helpers ----------
  function tx(storeName, mode = "readonly") {
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  function now() {
    return Date.now();
  }

  // ---------- API ----------
  const KnowledgeBase = {

    async init() {
      await openDB();
      return true;
    },

    // Save single QnA
    async saveOne({ subject, topic, question, answer, tags = [] }) {
      await openDB();
      return new Promise((resolve, reject) => {
        const rec = {
          subject: subject || "",
          topic: topic || "",
          question,
          answer,
          tags,
          time: now()
        };
        const req = tx(STORE_QA, "readwrite").add(rec);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    },

    // Save bulk QnA (array of records)
    async saveBulk(records = []) {
      await openDB();
      return new Promise((resolve, reject) => {
        const store = tx(STORE_QA, "readwrite");
        let saved = 0;

        records.forEach(r => {
          const rec = {
            subject: r.subject || "",
            topic: r.topic || "",
            question: r.question,
            answer: r.answer,
            tags: r.tags || [],
            time: now()
          };
          const req = store.add(rec);
          req.onsuccess = () => { saved++; };
          req.onerror = () => { /* skip bad record */ };
        });

        store.transaction.oncomplete = () => resolve(saved);
        store.transaction.onerror = () => reject(store.transaction.error);
      });
    },

    // Parse bulk raw text into records
    parseBulk(rawText, defaults = {}) {
      const blocks = rawText.split(/\n\s*\n/);
      const out = [];

      blocks.forEach(b => {
        const q = b.match(/Q:\s*([\s\S]+?)(?:\n|$)/i);
        const a = b.match(/A:\s*([\s\S]+?)(?:\n|$)/i);
        const t = b.match(/TAGS:\s*([\s\S]+)/i);

        if (q && a) {
          out.push({
            subject: defaults.subject || "",
            topic: defaults.topic || "",
            question: q[1].trim(),
            answer: a[1].trim(),
            tags: t ? t[1].split(",").map(s => s.trim()).filter(Boolean) : []
          });
        }
      });

      return out;
    },

    // Simple stats
    async countAll() {
      await openDB();
      return new Promise((resolve, reject) => {
        const req = tx(STORE_QA).count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "KnowledgeBase", {
    value: KnowledgeBase,
    writable: false,
    configurable: false
  });

})(window);
