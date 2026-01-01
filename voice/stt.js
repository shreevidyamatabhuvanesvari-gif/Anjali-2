/* =========================================================
   stt.js
   Role: Speech To Text (Hindi, Browser Native)
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = function () {
    if (window.TTS) {
      TTS.speak("मैं सुन रही हूँ");
    }
  };

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript.trim();

    // Echo back (TEST PURPOSE)
    if (window.TTS) {
      TTS.speak("आपने कहा: " + text);
    }
  };

  recognition.onerror = function () {
    if (window.TTS) {
      TTS.speak("मुझे सुनने में समस्या हुई");
    }
  };

  const STT = {
    start() {
      recognition.start();
    },
    stop() {
      recognition.stop();
    }
  };

  window.STT = STT;

})(window);
