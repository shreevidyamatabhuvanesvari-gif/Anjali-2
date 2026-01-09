/* ==========================================================
   voice/tts.js
   ROLE:
   Soft female voice for Anjali
   Web Speech API based
   ========================================================== */

(function (window) {
  "use strict";

  let voices = [];
  let unlocked = false;

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  function pickVoice() {
    // Prefer soft female Hindi / English voice
    return voices.find(v =>
      v.lang.startsWith("hi") ||
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman")
    ) || voices[0];
  }

  function speak(text, opts = {}) {
  if (!unlocked) return;
  if (!text) return;

  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;

  /* 🌸 ANJALI VOICE PERSONALITY 🌸
     मुस्कान + कोमलता + पास बैठकर बोलना
  */

  // गति — साँस जैसी
  u.rate = typeof opts.rate === "number" ? opts.rate : 0.78;

  // पिच — स्त्रीत्व + कोमल गर्माहट
  u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1.18;

  // वॉल्यूम — फुसफुसाने जैसा नहीं, पास बैठकर
  u.volume = typeof opts.volume === "number" ? opts.volume : 0.6;

  // 🌿 Micro-pauses → “मुस्कराकर बोलने” का भ्रम
  // यह शब्दों के बीच हल्की हवा देता है
  u.text = String(text)
    .replace(/([।?!])/g, "$1…")   // वाक्य के बाद साँस
    .replace(/,/g, ", ");        // नरम ठहराव

  // 🌿 हल्की “smile tilt”
  // कुछ ब्राउज़र pitch modulation को भाव की तरह लेते हैं
  const smile = 0.02 + Math.random() * 0.03;
  u.pitch = u.pitch + smile;

  try {
    window.speechSynthesis.cancel(); // पुराने शब्द न टकराएँ
    window.speechSynthesis.speak(u);
  } catch (e) {
    // चुपचाप विफल — अंजली का भाव नहीं टूटना चाहिए
  }
}

  // Soft presence tone (used by AnjaliPresence)
  function playTone({ frequency = 400, duration = 300, volume = 0.2 }) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  }

  function init() {
    // Required by mobile browsers
    unlocked = true;
    speak(" "); // silent unlock
  }

  window.TTS = {
    speak,
    playTone,
    init
  };

})(window);
