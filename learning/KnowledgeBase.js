/* =========================================================
   KnowledgeBase.js
   Role: Single Source IndexedDB Controller (AUTHORITATIVE)
   Environment: HTTPS (GitHub Pages Compatible)
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const DB_VERSION = 1;
  const STORE = "qa_store";

  let db = null;
  let opening = null; // 🔒 prevents parallel opens

  // ---------- OPEN DB (SERIALIZED) ----------
  function openDB() {
    if (db) return Promise.resolve(db);
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE)) {
          const s = d.createObjectStore(STORE, {
            keyPath: "id",
            autoIncrement: true
          });
          s.createIndex("time", "time", { unique: false });
        }
      };

      req.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = () => reject(req.error);
    });

    return opening;
  }

  // ---------- TRANSACTION HELPER ----------
  async function withStore(mode, fn) {
    const d = await openDB();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      fn(store, resolve, reject);
      tx.onerror = () => reject(tx.error);
    });
  }

  // ---------- API ----------
  const KnowledgeBase = {

    async init() {
      await openDB();
      return true;
    },

    // ---- SAVE ONE (SAFE) ----
    async saveOne(rec) {
      return withStore("readwrite", (store, resolve) => {
        store.add({
          question: rec.question,
          answer: rec.answer,
          tags: rec.tags || [],
          time: Date.now()
        });
        resolve(true);
      });
    },

    // ---- SAVE BULK (CHUNKED + SERIAL) ----
    async saveBulk(records) {
      const CHUNK = 25;
      let saved = 0;

      for (let i = 0; i < records.length; i += CHUNK) {
        const batch = records.slice(i, i + CHUNK);

        await withStore("readwrite", (store, resolve) => {
          batch.forEach(r => {
            store.add({
              question: r.question,
              answer: r.answer,
              tags: r.tags || [],
              time: Date.now()
            });
          });
          saved += batch.length;
          resolve();
        });
      }
      return saved;
    },

    // ---- READ ALL (VIEW) ----
    async getAll() {
      return withStore("readonly", (store, resolve) => {
        const out = [];
        store.openCursor().onsuccess = (e) => {
          const c = e.target.result;
          if (c) {
            out.push(c.value);
            c.continue();
          } else {
            resolve(out);
          }
        };
      });
    }
  };

  Object.defineProperty(window, "KnowledgeBase", {
    value: KnowledgeBase,
    writable: false
  });

})(window);
