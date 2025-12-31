// AnjaliCoreBridge.js
// FINAL FIX: Voice + Learning COMPLETE LOOP

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

const learner = new LearningController();

const voice = new VoiceController((userText) => {
  // 🔑 अब userText वास्तव में आता है
  const reply = learner.learn(userText);
  voice.speak(reply);
});

document.getElementById("startTalk").addEventListener("click", () => {
  // 1️⃣ पहले बोले
  voice.speak("नमस्ते, मैं अंजली हूँ। आपका प्रश्न सुन रही हूँ।");

  // 2️⃣ बोलने के बाद सुनना अनिवार्य
  // ⚠️ यह लाइन पहले missing थी या गलत समय पर थी
  setTimeout(() => {
    voice.listen();
  }, 600); // browser-safe delay
});
