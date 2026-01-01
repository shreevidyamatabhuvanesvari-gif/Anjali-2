/* =========================================================
   KnowledgeBase.js
   Role: Single Source IndexedDB Controller
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const DB_VERSION = 1;
  const STORE = "qa_store";

  let db = null;
  let opening = null;

  function openDB() {
    if (db) return Promise.resolve(db);
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE)) {
          d.createObjectStore(STORE, {
            keyPath: "id",
            autoIncrement: true
          });
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

  async function withStore(mode, fn) {
    const d = await openDB();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      fn(store, resolve);
      tx.onerror = () => reject(tx.error);
    });
  }

  const KnowledgeBase = {

    async init() {
      await openDB();
      return true;
    },

    async saveOne({ question, answer, tags = [] }) {
      return withStore("readwrite", (store, done) => {
        store.add({
          question,
          answer,
          tags,
          time: Date.now()
        });
        done(true);
      });
    },

    async saveBulk(records = []) {
      let saved = 0;
      for (const r of records) {
        await this.saveOne(r);
        saved++;
      }
      return saved;
    },

    // ✅ REQUIRED & FIXED
    parseBulk(rawText) {
      const blocks = rawText.split(/\n\s*\n/);
      const out = [];

      blocks.forEach(b => {
        const q = b.match(/Q:\s*([\s\S]+?)(?:\n|$)/i);
        const a = b.match(/A:\s*([\s\S]+?)(?:\n|$)/i);
        const t = b.match(/TAGS:\s*([\s\S]+)/i);

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

    async getAll() {
      return withStore("readonly", (store, done) => {
        const all = [];
        store.openCursor().onsuccess = (e) => {
          const c = e.target.result;
          if (c) {
            all.push(c.value);
            c.continue();
          } else {
            done(all);
          }
        };
      });
    }
  };

  window.KnowledgeBase = KnowledgeBase;

})(window);
