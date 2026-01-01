/* =========================================================
   stt.js
   Role: Speech To Text → Question → LearningBridge
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("STT not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = async function (event) {
    const transcript = event.results[0][0].transcript.trim();

    console.log("STT heard:", transcript);

    // 🔑 यही सबसे ज़रूरी लाइन है
    if (window.LearningBridge) {
      await LearningBridge.answerQuestion(transcript);
    } else if (window.TTS) {
      TTS.speak("मुझे अभी उत्तर देने की व्यवस्था नहीं मिली है।");
    }
  };

  recognition.onerror = function () {
    if (window.TTS) {
      TTS.speak("मैं आपकी आवाज़ ठीक से सुन नहीं पाई।");
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "STT", {
    value: {
      start() {
        recognition.start();
        if (window.TTS) {
          TTS.speak("मैं सुन रही हूँ। कृपया प्रश्न बोलिए।");
        }
      },
      stop() {
        recognition.stop();
      }
    },
    writable: false
  });

})(window);
