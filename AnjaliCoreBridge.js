// AnjaliCoreBridge.js
// FINAL VOICE FIX – COMPLETE LOOP

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

const learner = new LearningController();

const voice = new VoiceController((userText) => {
  const reply = learner.learn(userText);
  voice.speak(reply);
});

// 🔑 यही एकमात्र जगह है जहाँ Mic start होगा
document.getElementById("startTalk").addEventListener("click", () => {
  voice.speak("नमस्ते, मैं अंजली हूँ। आप बोल सकते हैं।");
  voice.listen(); // ✅ user gesture → browser allows mic
});
