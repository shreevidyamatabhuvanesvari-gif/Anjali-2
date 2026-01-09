/* ==========================================================
   tts.js
   Level-4
   ROLE:
   Human-like speech output for Anjali
   Works through SpeechGate (never call speechSynthesis directly)
   ========================================================== */

(function (window) {
  "use strict";

  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    // Prefer Hindi female if available
    let v = voices.find(v => v.lang.startsWith("hi") && v.name.toLowerCase().includes("female"));
    if (!v) v = voices.find(v => v.lang.startsWith("hi"));
    if (!v) v = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
    return v || voices[0];
  }

  window.TTS = Object.freeze({
    init() {
      // warm up voices
      try {
        speechSynthesis.getVoices();
      } catch {}
    },

    speak(text, opts = {}) {
      if (!window.SpeechGate) return;

      SpeechGate.speak(text, {
        rate: opts.rate || 0.9,
        pitch: opts.pitch || 1.1,
        volume: opts.volume || 0.9
      });
    }
  });

})(window);
