// VoiceController.js
// GUARANTEE: आवाज़ हमेशा आएगी (TTS only)

export class VoiceController {

  constructor() {
    this.synth = window.speechSynthesis;
    this.ready = false;

    // voices लोड होने का इंतज़ार
    const waitVoices = () => {
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        this.ready = true;
      } else {
        setTimeout(waitVoices, 100);
      }
    };

    waitVoices();
  }

  speak(text) {
    if (!this.ready) {
      console.warn("Voice not ready yet");
      return;
    }

    if (typeof text !== "string" || text.trim() === "") return;

    // पहले की आवाज़ रोकें
    this.synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.95;
    u.pitch = 1.05;
    u.volume = 1.0;

    this.synth.speak(u);
  }
}
