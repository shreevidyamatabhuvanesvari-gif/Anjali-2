/* =========================================================
   stt.js
   Role: Speech To Text + Answer via LearningBridge
   Environment: Mobile Chrome / Desktop Chrome
   ========================================================= */

(function (window) {
  "use strict";

  // ---------- Browser Support Check ----------
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  // ---------- Deterministic Config ----------
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;

  // ---------- STT API ----------
  const STT = {

    start() {
      if (listening) return;
      listening = true;

      try {
        recognition.start();
      } catch (e) {
        listening = false;
      }
    },

    stop() {
      listening = false;
      recognition.stop();
    }
  };

  // ---------- RESULT HANDLER (⭐ निर्णायक हिस्सा) ----------
  recognition.onresult = async function (event) {
    listening = false;

    const transcript = event.results[0][0].transcript.trim();

    // यूज़र को सुनने की पुष्टि
    if (window.TTS) {
      TTS.speak("आपने पूछा: " + transcript);
    }

    // 🔑 उत्तर निकालना
    if (!window.LearningBridge) {
      if (window.TTS) {
        TTS.speak("ज्ञान प्रणाली उपलब्ध नहीं है।");
      }
      return;
    }

    try {
      const knowledge = await LearningBridge.getKnowledge();

      // सरल और सुरक्षित मिलान
      const found = knowledge.find(k =>
        transcript.includes(k.question) ||
        k.question.includes(transcript)
      );

      if (found && found.answer) {
        TTS.speak(found.answer);
      } else {
        TTS.speak("इस प्रश्न का उत्तर अभी मेरे ज्ञान में नहीं है।");
      }

    } catch (e) {
      if (window.TTS) {
        TTS.speak("उत्तर प्राप्त करने में समस्या आई।");
      }
    }
  };

  // ---------- ERROR HANDLER ----------
  recognition.onerror = function () {
    listening = false;
    if (window.TTS) {
      TTS.speak("मैं अभी आपकी बात नहीं समझ पाई।");
    }
  };

  recognition.onend = function () {
    listening = false;
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "STT", {
    value: STT,
    writable: false,
    configurable: false
  });

})(window);
