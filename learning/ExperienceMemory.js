/* =========================================================
   ExperienceMemory.js
   Role: Experience-based Persistent Memory (IndexedDB)
   ========================================================= */

(function (window) {
  "use strict";

  const DB_NAME = "AnjaliExperienceDB";
  const DB_VERSION = 1;
  const STORE_NAME = "experience_store";

  let db = null;

  // ---------- Open DB ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db);
        return;
      }

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          d.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
          });
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
  }

  // ---------- Save Experience ----------
  async function saveExperience(exp) {
    if (!exp || !exp.type) {
      throw new Error("Invalid experience");
    }

    const d = await openDB();

    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      store.add({
        type: exp.type,          // e.g. "interaction", "feedback"
        payload: exp.payload || {},
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

  // ---------- Read All Experiences ----------
  async function getAllExperiences() {
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
  const ExperienceMemory = {
    init: openDB,
    save: saveExperience,
    getAll: getAllExperiences
  };

  Object.defineProperty(window, "ExperienceMemory", {
    value: ExperienceMemory,
    writable: false,
    configurable: false
  });

})(window);
