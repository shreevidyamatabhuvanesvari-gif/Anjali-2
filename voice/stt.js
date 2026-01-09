/* ==========================================================
   voice/stt.js
   Level-4 / Version-4.x
   ROLE:
   True microphone Speech-To-Text engine for Anjali.
   Uses browser Web Speech API.
   Works with STT_LongListening.js
   ========================================================== */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("यह ब्राउज़र Speech Recognition सपोर्ट नहीं करता। Chrome उपयोग करें।");
    return;
  }

  let recognition = null;
  let listening = false;

  function createRecognition() {
    const r = new SpeechRecognition();

    r.lang = "hi-IN";         // Hindi first
    r.continuous = false;    // LongListening will restart it
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onresult = function (event) {
      if (!event.results || !event.results[0]) return;

      const text = event.results[0][0].transcript;

      if (window.STT.onResult) {
        window.STT.onResult(text);
      }
    };

    r.onerror = function () {
      if (window.STT.onError) {
        window.STT.onError();
      }
    };

    r.onend = function () {
      listening = false;
      if (window.STT.onEnd) {
        window.STT.onEnd();
      }
    };

    return r;
  }

  /* ===============================
     PUBLIC STT API
     =============================== */
  window.STT = {
    onResult: null,
    onEnd: null,
    onError: null,

    start() {
      if (listening) return;

      try {
        if (!recognition) {
          recognition = createRecognition();
        }

        listening = true;
        recognition.start();
      } catch (e) {
        listening = false;
      }
    },

    stop() {
      try {
        if (recognition) {
          recognition.stop();
        }
      } catch (e) {}
      listening = false;
    },

    status() {
      return {
        listening,
        engine: "browser-speech-api",
        language: "hi-IN"
      };
    }
  };

})(window);
