// VoiceController.js
// Responsibility: Speech only (listen + speak)

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

    this.STATE = {
      IDLE: "IDLE",
      LISTENING: "LISTENING",
      SPEAKING: "SPEAKING"
    };

    this.state = this.STATE.IDLE;

    this._bindEvents();
  }

  /* ---------- Internal Wiring ---------- */
  _bindEvents() {
    this.recognition.onresult = (event) => {
      if (this.state !== this.STATE.LISTENING) return;

      this.state = this.STATE.IDLE;
      const text = event.results[0][0].transcript.trim();

      this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      this.state = this.STATE.IDLE;
    };

    this.recognition.onend = () => {
      if (this.state === this.STATE.IDLE && !this.synth.speaking) {
        this.listen();
      }
    };
  }

  /* ---------- Public APIs ---------- */

  speak(text) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.state = this.STATE.SPEAKING;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;

    u.onend = () => {
      this.state = this.STATE.IDLE;
      this.listen();
    };

    this.synth.speak(u);
  }

  listen() {
    if (this.state !== this.STATE.IDLE) return;

    try {
      this.state = this.STATE.LISTENING;
      this.recognition.start();
    } catch (_) {
      this.state = this.STATE.IDLE;
    }
  }
}
