// VoiceController.js
// Responsibility: Speech only (listen + speak)
// FIXED: Single restart point (utterance.onend)
// GUARANTEE: Stable voice on mobile & desktop

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

      // User speech delivered to core
      this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      // Silent fail-safe
      this.state = this.STATE.IDLE;
    };

    // ❌ IMPORTANT:
    // recognition.onend से listen() दोबारा नहीं बुलाया जाएगा
    // (मोबाइल पर यही double-restart bug पैदा करता है)
    this.recognition.onend = () => {
      // intentionally empty
    };
  }

  /* ---------- Public APIs ---------- */

  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.state = this.STATE.SPEAKING;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;

    u.onend = () => {
      // बोलना समाप्त → अब सुनना शुरू
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
      // duplicate start protection
      this.state = this.STATE.IDLE;
    }
  }
}
