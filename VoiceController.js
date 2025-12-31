// VoiceController.js
export class VoiceController {
  constructor(onStop) {
    this.onStop = onStop;
    this.recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = "hi-IN";
    this.recognition.continuous = true;
  }

  listen(callback) {
    this.recognition.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript;
      if (text.includes("अब बात कुछ समय बाद करते हैं")) {
        this.stop();
        this.onStop();
      } else {
        callback(text);
      }
    };
    this.recognition.start();
  }

  speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    speechSynthesis.speak(u);
  }

  stop() {
    this.recognition.stop();
  }
}
