/* =========================================================
   AnjaliCore.js
   Role: Central Brain (Locked Identity + Control)
   Stage: 2
   ========================================================= */

(function (window) {
  "use strict";

  // ---- Identity & Locks (DO NOT CHANGE) ----
  const AnjaliCore = {
    meta: {
      appName: "अंजली",
      relationship: "premika",          // Locked relationship
      personaTraits: [
        "स्नेह",
        "विश्वास",
        "समझ",
        "सहानुभूति",
        "सम्मान",
        "धैर्य",
        "ईमानदारी",
        "भावनात्मक स्थिरता",
        "संवाद-कुशलता",
        "प्रोत्साहन",
        "निष्ठा (सीमित)",
        "मर्यादा"
      ],
      adminSupremacy: true,              // Admin > System > User
      memoryGoalGB: 40,                  // Design target (not LocalStorage)
      version: "0.2"
    },

    // ---- Runtime State ----
    state: {
      booted: false,
      silentMode: false,
      lastStatus: "INIT"
    },

    // ---- Boot Sequence ----
    boot() {
      if (this.state.booted) return;
      this.state.booted = true;
      this.state.lastStatus = "BOOT_OK";
      this.log("🌸 AnjaliCore booted");
      this.emit("boot");
    },

    // ---- Status / Control ----
    setSilentMode(on) {
      this.state.silentMode = !!on;
      this.emit("silent", { on: this.state.silentMode });
      this.log(this.state.silentMode ? "मौन मोड चालू" : "मौन मोड बंद");
    },

    getStatus() {
      return {
        app: this.meta.appName,
        relationship: this.meta.relationship,
        version: this.meta.version,
        silentMode: this.state.silentMode,
        lastStatus: this.state.lastStatus
      };
    },

    // ---- Event Bus (Internal) ----
    _events: {},
    on(event, handler) {
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(handler);
    },
    emit(event, payload) {
      (this._events[event] || []).forEach(fn => {
        try { fn(payload); } catch (e) { console.error(e); }
      });
    },

    // ---- Logging (Centralized) ----
    log(msg) {
      // Central place for future logging policies
      console.log(`[Anjali] ${msg}`);
    }
  };

  // ---- Auto Boot on DOM Ready ----
  document.addEventListener("DOMContentLoaded", () => {
    AnjaliCore.boot();
  });

  // ---- Expose Globally (Read-Only Reference) ----
  Object.defineProperty(window, "AnjaliCore", {
    value: AnjaliCore,
    writable: false,
    configurable: false
  });

})(window);
