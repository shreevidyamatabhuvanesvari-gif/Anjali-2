// VoiceController.js
// Responsibility: बोलना + सुनना (न्यूनतम, विश्वसनीय)

export class VoiceController {

  constructor(onUserSpeech) {
    this.onUserSpeech = onUserSpeech;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition सपोर्ट नहीं है");
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = "hi-IN";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.synth = window.speechSynthesis;
    this.listening = false;

    this.recognition.onresult = (e) => {
      this.listening = false;
      const text = e.results[0][0].transcript.trim();
      if (this.onUserSpeech) this.onUserSpeech(text);
    };

    this.recognition.onerror = () => {
      this.listening = false;
    };
  }

  speak(text) {
    if (typeof text !== "string" || text.trim() === "") return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";

    u.onend = () => {
      this.listen();
    };

    this.synth.speak(u);
  }

  listen() {
    if (this.listening) return;

    try {
      this.listening = true;
      this.recognition.start();
    } catch (_) {
      this.listening = false;
    }
  }
}
