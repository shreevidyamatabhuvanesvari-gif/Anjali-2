/* =========================================================
   tts.js
   Role: Text To Speech (Deterministic, Browser Native)
   Fix: Mobile Chrome Audio Unlock
   ========================================================= */

(function (window, document) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    throw new Error("SpeechSynthesis not supported");
  }

  let unlocked = false;
  let currentUtterance = null;

  // ---------- AUDIO UNLOCK (MANDATORY FOR MOBILE CHROME) ----------
  function unlockAudio() {
    if (unlocked) return;

    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0; // silent unlock
    window.speechSynthesis.speak(u);

    unlocked = true;
  }

  // Attach unlock to first user gesture
  document.addEventListener(
    "click",
    function () {
      unlockAudio();
    },
    { once: true }
  );

  document.addEventListener(
    "touchstart",
    function () {
      unlockAudio();
    },
    { once: true }
  );

  // ---------- TTS API ----------
  const TTS = {

    // Ensure audio is unlocked (safe to call multiple times)
    init() {
      unlockAudio();
      return true;
    },

    // ---------- Speak ----------
    speak(text, options = {}) {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid text for TTS");
      }

      // Ensure unlocked
      unlockAudio();

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

})(window, document);
