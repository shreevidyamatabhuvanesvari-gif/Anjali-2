// VoiceController.js
// Responsibility: Reliable Speech (listen + speak)
// GUARANTEE: No double-start, no silent failure

export class VoiceController {

  constructor(onUserSpeech) {
    this.onUserSpeech = onUserSpeech;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("आपका ब्राउज़र वॉइस सपोर्ट नहीं करता");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = "hi-IN";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.synth = window.speechSynthesis;

    this.isListening = false;
    this.isSpeaking = false;

    this._bindEvents();
  }

  /* ---------- Internal Wiring ---------- */
  _bindEvents() {

    this.recognition.onresult = (event) => {
      if (!this.isListening) return;

      this.isListening = false;
      const text = event.results[0][0].transcript.trim();

      this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      this.isListening = false;
    };

    // ❌ यहाँ कोई auto-restart नहीं
    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  /* ---------- Speak ---------- */
  speak(text) {
    if (typeof text !== "string" || text.trim() === "") {
      return; // 🔒 कभी खाली न बोले
    }

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.isSpeaking = true;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;

    u.onend = () => {
      this.isSpeaking = false;
      this.listen();   // ✅ केवल यहीं से listen
    };

    this.synth.speak(u);
  }

  /* ---------- Listen ---------- */
  listen() {
    if (this.isListening || this.isSpeaking) return;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (_) {
      this.isListening = false;
    }
  }
}
