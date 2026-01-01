/* =========================================================
   Ultra Robust STT → TTS Controller (Best Possible on Web)
   ========================================================= */

(function (window) {
  "use strict";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  let busy = false;

  function safeSpeak(text) {
    if (!window.TTS) return;

    // 1️⃣ पहले सब कुछ रोक दो
    window.speechSynthesis.cancel();

    // 2️⃣ छोटा delay ताकि audio focus लौट सके
    setTimeout(() => {
      try {
        TTS.init();
        TTS.speak(text);
      } catch (e) {
        console.warn("TTS failed", e);
      }
    }, 400);
  }

  recognition.onresult = async function (event) {
    if (busy) return;
    busy = true;

    const transcript = event.results[0][0].transcript.trim();

    // 🔴 सबसे ज़रूरी: STT पूरी तरह बंद
    recognition.stop();

    // पुष्टि
    safeSpeak("आपने पूछा: " + transcript);

    // ज्ञान खोज
    if (window.LearningBridge) {
      try {
        const knowledge = await LearningBridge.getKnowledge();
        const found = knowledge.find(k =>
          transcript.includes(k.question) ||
          k.question.includes(transcript)
        );

        if (found) {
          safeSpeak(found.answer);
        } else {
          safeSpeak("इस प्रश्न का उत्तर मेरे ज्ञान में उपलब्ध नहीं है।");
        }
      } catch (e) {
        safeSpeak("उत्तर प्राप्त करने में समस्या आई है।");
      }
    }

    // unlock
    setTimeout(() => {
      busy = false;
    }, 1500);
  };

  recognition.onerror = function () {
    busy = false;
    safeSpeak("मैं आपकी आवाज़ स्पष्ट नहीं सुन पाई।");
  };

  // ---------- Expose ----------
  window.STT = {
    start() {
      try {
        recognition.start();
      } catch (e) {}
    },
    stop() {
      try {
        recognition.stop();
      } catch (e) {}
    }
  };

})(window);
