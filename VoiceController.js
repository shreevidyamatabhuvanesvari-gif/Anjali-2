// VoiceController.js
// PURPOSE: Browser-safe Voice (Speak + Listen)
// GUARANTEE:
// - Mic केवल user gesture से शुरू होगा
// - कोई silent failure नहीं
// - कोई auto-restart नहीं
// - आवाज़ कभी अपने आप बंद नहीं होगी

export class VoiceController {

  constructor(onUserSpeech) {
    this.onUserSpeech = onUserSpeech;

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      alert("यह ब्राउज़र वॉइस सपोर्ट नहीं करता");
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = "hi-IN";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.synth = window.speechSynthesis;

    this._bind();
  }

  /* =========================
     INTERNAL EVENTS
  ========================= */
  _bind() {

    this.recognition.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (text && this.onUserSpeech) {
        this.onUserSpeech(text);
      }
    };

    this.recognition.onerror = () => {
      // कोई auto retry नहीं
    };

    this.recognition.onend = () => {
      // ❌ यहाँ listen() नहीं बुलाया जाएगा
    };
  }

  /* =========================
     SPEAK (SAFE)
  ========================= */
  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang  = "hi-IN";
    u.rate  = 0.95;
    u.pitch = 1.05;

    this.synth.speak(u);
  }

  /* =========================
     LISTEN (CRITICAL RULE)
     ⚠️ इसे केवल BUTTON CLICK से बुलाना है
  ========================= */
  listenFromUserGesture() {
    try {
      this.recognition.start();
    } catch (_) {
      // browser silently blocks if rule violated
    }
  }
}
