/* ==========================================================
   stt.js
   Level-4
   ROLE:
   Real microphone speech-to-text using Web Speech API
   Works with STT_LongListening
   ========================================================== */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("इस ब्राउज़र में Voice Recognition समर्थित नहीं है");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  let active = false;

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    if (window.STT.onResult) {
      STT.onResult(text);
    }
  };

  recognition.onend = function () {
    active = false;
    if (window.STT.onEnd) STT.onEnd();
  };

  recognition.onerror = function () {
    active = false;
    if (window.STT.onError) STT.onError();
  };

  window.STT = Object.freeze({
    start() {
      if (active) return;
      try {
        recognition.start();
        active = true;
      } catch {}
    },

    stop() {
      try {
        recognition.stop();
      } catch {}
      active = false;
    },

    // hooks for STT_LongListening
    onResult: null,
    onEnd: null,
    onError: null
  });

})(window);
