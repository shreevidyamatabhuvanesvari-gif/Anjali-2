/* =========================================================
   KnowledgeBase.js
   Role: Deterministic IndexedDB (Clean Reset + Stable Save)
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliKnowledgeDB";
  const STORE_NAME = "qa_store";
  const DB_VERSION = 2; // 🔑 version bump forces clean rebuild

  let db = null;

  // ---------- Open DB (Clean) ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        const d = e.target.result;

        // 🔥 FORCE CLEAN
        if (d.objectStoreNames.contains(STORE_NAME)) {
          d.deleteObjectStore(STORE_NAME);
        }

        d.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      };

      req.onsuccess = function (e) {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = function () {
        reject(req.error);
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

  const KnowledgeBase = {
    init: openDB,
    saveOne: saveOne,
    getAll: getAll
  };

  Object.defineProperty(window, "KnowledgeBase", {
    value: KnowledgeBase,
    writable: false
  });

})(window);
