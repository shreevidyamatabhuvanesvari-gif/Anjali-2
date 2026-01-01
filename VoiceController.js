// VoiceController.js
// FINAL VOICE FIX
// Rule: Mic starts ONLY from user gesture

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

    this._bind();
  }

  _bind() {
    this.recognition.onresult = (e) => {
      this.isListening = false;
      const text = e.results[0][0].transcript.trim();
      this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;

    this.synth.speak(u);
  }

  // ⚠️ Mic start ONLY from button click
  listen() {
    if (this.isListening) return;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (_) {
      this.isListening = false;
    }
  }
}
