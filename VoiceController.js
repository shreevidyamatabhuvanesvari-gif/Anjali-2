// VoiceController.js
// Responsibility: Reliable Speech (speak + listen)
// GUARANTEE: Mic starts ONLY from user gesture (browser safe)

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
    this.isSpeaking  = false;

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

    // ❗ auto-restart नहीं (browser policy safe)
    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  /* ---------- SPEAK ---------- */
  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

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
      // ❌ यहाँ listen() नहीं बुलाया जाएगा
    };

    this.synth.speak(u);
  }

  /* ---------- LISTEN (USER-GESTURE ONLY) ---------- */
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
