/* =========================================================
   AdminControl.js
   Role: Authority & Behaviour Governance (FINAL)
   ========================================================= */

(function (window) {
  "use strict";

  if (!window.AnjaliCore) {
    throw new Error("AnjaliCore not loaded");
  }

  // ---------- INTERNAL STATE (AUTHORITATIVE) ----------
  const state = {
    affectionLevel: 2,   // 0=Neutral, 1=Soft, 2=Affectionate, 3=Deep (MAX)
    silentMode: false,
    learningLocked: false
  };

  // ---------- VALIDATION ----------
  function clampAffection(level) {
    if (typeof level !== "number") return state.affectionLevel;
    if (level < 0) return 0;
    if (level > 3) return 3;
    return level;
  }

  // ---------- PUBLIC CONTROL API ----------
  const AdminControl = {

    // ---- Affection Control ----
    setAffectionLevel(level) {
      state.affectionLevel = clampAffection(level);
      return state.affectionLevel;
    },

    getAffectionLevel() {
      return state.affectionLevel;
    },

    // ---- Behaviour Flags ----
    setSilentMode(flag) {
      state.silentMode = !!flag;
      return state.silentMode;
    },

    isSilent() {
      return state.silentMode;
    },

    lockLearning(flag) {
      state.learningLocked = !!flag;
      return state.learningLocked;
    },

    isLearningLocked() {
      return state.learningLocked;
    },

    // ---- Behaviour Modulation ----
    applyAffectionTone(text) {
      if (!text || typeof text !== "string") return text;

      switch (state.affectionLevel) {
        case 0:
          return text; // Neutral
        case 1:
          return "मैं ध्यान से सुन रही हूँ। " + text;
        case 2:
          return "आपकी बात मेरे लिए महत्त्वपूर्ण है। " + text;
        case 3:
          return "मैं पूरी स्नेहपूर्वक आपके साथ हूँ। " + text;
        default:
          return text;
      }
    },

    // ---- Guard Checks ----
    canLearn() {
      return !state.learningLocked;
    }
  };

  // ---------- HARD BIND TO CORE ----------
  Object.defineProperty(window, "AdminControl", {
    value: AdminControl,
    writable: false,
    configurable: false
  });

})(window);
