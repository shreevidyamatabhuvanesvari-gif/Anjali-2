/* =========================================================
   tts.js
   Role: Text To Speech (Deterministic, Browser Native)
   ========================================================= */

(function (window) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    throw new Error("SpeechSynthesis not supported");
  }

  let currentUtterance = null;

  const TTS = {

    // ---------- Speak ----------
    speak(text, options = {}) {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid text for TTS");
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);

      // Deterministic defaults
      u.lang = options.lang || "hi-IN";
      u.rate = options.rate || 1;
      u.pitch = options.pitch || 1;
      u.volume = options.volume || 1;

      currentUtterance = u;
      window.speechSynthesis.speak(u);

      return true;
    },

    // ---------- Stop ----------
    stop() {
      window.speechSynthesis.cancel();
      currentUtterance = null;
      return true;
    },

    // ---------- Status ----------
    isSpeaking() {
      return window.speechSynthesis.speaking;
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "TTS", {
    value: TTS,
    writable: false,
    configurable: false
  });

})(window);
