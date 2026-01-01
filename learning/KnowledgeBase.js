/* =========================================================
   KnowledgeBase.js
   Role: Deterministic IndexedDB Storage (Single Source)
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const DB_VERSION = 1;
  const STORE_NAME = "qa_store";

  let db = null;

  // ---------- Open DB ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (e) {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          d.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onsuccess = function (e) {
        db = e.target.result;
        resolve(db);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  // ---------- Save One (AUTHORITATIVE) ----------
  async function saveOne(record) {
    if (!record || !record.question || !record.answer) {
      throw new Error("Invalid record");
    }

    const d = await openDB();

    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      store.add({
        question: record.question,
        answer: record.answer,
        tags: record.tags || [],
        time: Date.now()
      });

      tx.oncomplete = function () {
        resolve(true);
      };

      tx.onerror = function () {
        reject(tx.error);
      };
    });
  }

  // ---------- Read All ----------
  async function getAll() {
    const d = await openDB();

    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const out = [];

      const req = store.openCursor();
      req.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          out.push(cursor.value);
          cursor.continue();
        } else {
          resolve(out);
        }
      };

      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  // ---------- Public API ----------
  const KnowledgeBase = {
    init: openDB,
    saveOne: saveOne,
    getAll: getAll
  };

  Object.defineProperty(window, "KnowledgeBase", {
    value: KnowledgeBase,
    writable: false,
    configurable: false
  });

})(window);
