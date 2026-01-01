/* =========================================================
   AnjaliCore.js
   Role: Central Deterministic Core Controller
   ========================================================= */

(function (window) {
  "use strict";

  // ---------- Internal State (Authoritative) ----------
  const state = {
    version: "1.0.0",
    name: "Anjali",
    relationship: "premika",
    silentMode: false,
    initialized: false
  };

  // ---------- Core Object ----------
  const AnjaliCore = {

    // Initialize core once
    init() {
      if (state.initialized) return true;
      state.initialized = true;
      return true;
    },

    // Read-only status (for UI/Admin)
    getStatus() {
      return {
        version: state.version,
        name: state.name,
        relationship: state.relationship,
        silentMode: state.silentMode,
        initialized: state.initialized
      };
    },

    // Silent mode control
    setSilentMode(flag) {
      state.silentMode = !!flag;
      return state.silentMode;
    },

    // Simple speak hook (voice layer will attach later)
    canSpeak() {
      return !state.silentMode;
    }
  };

  // ---------- Expose (Immutable) ----------
  Object.defineProperty(window, "AnjaliCore", {
    value: AnjaliCore,
    writable: false,
    configurable: false
  });

  // ---------- Auto-init ----------
  AnjaliCore.init();

})(window);
