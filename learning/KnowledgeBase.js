/* =========================================================
   KnowledgeBase.js
   Role: Single Source of Truth for Learning Storage
   Storage: IndexedDB (Browser Persistent)
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const DB_VERSION = 1;
  const STORE_NAME = "qa_store";

  let db = null;
  let opening = null;

  // ---------- Open DB (singleton, serialized) ----------
  function openDB() {
    if (db) return Promise.resolve(db);
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          const store = d.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("time", "time", { unique: false });
        }
      };

      req.onsuccess = function (e) {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = function () {
        reject(req.error);
      };
    });

    return opening;
  }

  // ---------- Transaction Helper ----------
  async function withStore(mode, work) {
    const d = await openDB();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      work(store, resolve, reject);
      tx.onerror = function () {
        reject(tx.error);
      };
    });
  }

  // ---------- Public API ----------
  const KnowledgeBase = {

    // Ensure DB is ready
    async init() {
      await openDB();
      return true;
    },

    // ---------- Save Single ----------
    async saveOne({ question, answer, tags = [] }) {
      if (!question || !answer) {
        throw new Error("Invalid Q/A");
      }

      return withStore("readwrite", function (store, done) {
        store.add({
          question: question,
          answer: answer,
          tags: tags,
          time: Date.now()
        });
        done(true);
      });
    },

    // ---------- Parse Bulk Text ----------
    parseBulk(rawText) {
      const blocks = rawText.split(/\n\s*\n/);
      const out = [];

      blocks.forEach(block => {
        const q = block.match(/Q:\s*([\s\S]+?)(?:\n|$)/i);
        const a = block.match(/A:\s*([\s\S]+?)(?:\n|$)/i);
        const t = block.match(/TAGS:\s*([\s\S]+)/i);

        if (q && a) {
          out.push({
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

    // ---------- Save Bulk ----------
    async saveBulk(records) {
      if (!Array.isArray(records) || !records.length) {
        throw new Error("No records");
      }

      let saved = 0;

      for (const r of records) {
        await this.saveOne(r);
        saved++;
      }

      return saved;
    },

    // ---------- Read All ----------
    async getAll() {
      return withStore("readonly", function (store, done) {
        const out = [];
        store.openCursor().onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            out.push(cursor.value);
            cursor.continue();
          } else {
            done(out);
          }
        };
      });
    }
  };

  // ---------- Expose (immutable) ----------
  Object.defineProperty(window, "KnowledgeBase", {
    value: KnowledgeBase,
    writable: false,
    configurable: false
  });

})(window);
