/* =========================================================
   stt.js
   Role: Speech To Text (Deterministic, Browser Native)
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("SpeechRecognition not supported");
  }

  let recognition = null;
  let listening = false;

  const STT = {

    // ---------- Start Listening ----------
    start(options = {}) {
      if (listening) return false;

      recognition = new SpeechRecognition();

      // Deterministic defaults
      recognition.lang = options.lang || "hi-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      listening = true;

      recognition.onend = function () {
        listening = false;
      };

      recognition.onerror = function () {
        listening = false;
      };

      recognition.start();
      return true;
    },

    // ---------- Stop Listening ----------
    stop() {
      if (recognition && listening) {
        recognition.stop();
      }
      listening = false;
      return true;
    },

    // ---------- One-shot Listen ----------
    listenOnce(options = {}) {
      return new Promise((resolve, reject) => {
        if (listening) {
          reject(new Error("Already listening"));
          return;
        }

        recognition = new SpeechRecognition();

        recognition.lang = options.lang || "hi-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = function (event) {
          const transcript = event.results[0][0].transcript;
          listening = false;
          resolve(transcript);
        };

        recognition.onerror = function (event) {
          listening = false;
          reject(event.error);
        };

        recognition.onend = function () {
          listening = false;
        };

        listening = true;
        recognition.start();
      });
    },

    // ---------- Status ----------
    isListening() {
      return listening;
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "STT", {
    value: STT,
    writable: false,
    configurable: false
  });

})(window);
