/* =========================================================
   KnowledgeBase.js
   Role: Persistent Knowledge Storage (IndexedDB)
   Stage: 6 (Fixed – SAFE Bulk Save)
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
  function now() {
    return Date.now();
  }

  function tx(storeName, mode = "readonly") {
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  // ---------- API ----------
  const KnowledgeBase = {

    async init() {
      await openDB();
      return true;
    },

    // ---------- Save single QnA ----------
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

    // ---------- Save bulk QnA (SAFE chunked save) ----------
    async saveBulk(records = []) {
      await openDB();

      const CHUNK_SIZE = 50; // मोबाइल/ब्राउज़र-safe
      let totalSaved = 0;

      for (let i = 0; i < records.length; i += CHUNK_SIZE) {
        const chunk = records.slice(i, i + CHUNK_SIZE);

        await new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_QA, "readwrite");
          const store = transaction.objectStore(STORE_QA);

          chunk.forEach(r => {
            const rec = {
              subject: r.subject || "",
              topic: r.topic || "",
              question: r.question,
              answer: r.answer,
              tags: r.tags || [],
              time: now()
            };
            store.add(rec);
          });

          transaction.oncomplete = () => {
            totalSaved += chunk.length;
            resolve();
          };

          transaction.onerror = () => {
            reject(transaction.error);
          };
        });
      }

      return totalSaved;
    },

    // ---------- Parse bulk raw text ----------
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
            tags: t
              ? t[1].split(",").map(s => s.trim()).filter(Boolean)
              : []
          });
        }
      });

      return out;
    },

    // ---------- Simple stats ----------
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
