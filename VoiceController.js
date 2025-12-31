// VoiceController.js
// FINAL, VOICE-SAFE, BROWSER-CORRECT

export class VoiceController {

  constructor(onUserSpeech) {
    this.onUserSpeech = onUserSpeech;

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      alert("आपका ब्राउज़र वॉइस सपोर्ट नहीं करता");
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = "hi-IN";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.synth = window.speechSynthesis;

    this.listening = false;

    this._bind();
  }

  _bind() {
    this.recognition.onresult = (e) => {
      this.listening = false;
      const text = e.results[0][0].transcript.trim();
      this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      this.listening = false;
    };

    this.recognition.onend = () => {
      this.listening = false;
    };
  }

  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

    this.synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;

    // 🔑 यही निर्णायक लाइन है
    u.onend = () => {
      this._startListeningSafely();
    };

    this.synth.speak(u);
  }

  _startListeningSafely() {
    if (this.listening) return;

    try {
      this.listening = true;
      this.recognition.start();
    } catch {
      this.listening = false;
    }
  }

  // 🔒 बाहरी listen() की ज़रूरत नहीं
}
