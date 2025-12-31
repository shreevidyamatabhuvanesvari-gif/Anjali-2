// AnjaliCoreBridge.js
// Responsibility:
// - Voice input लेना
// - LearningController से उत्तर लेना
// - Voice से उत्तर बोलना
// GUARANTEE: आवाज़ बंद नहीं होगी

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

/* =========================
   CORE INSTANCE
========================= */
const learner = new LearningController();

/* =========================
   VOICE ORCHESTRATION
========================= */
const voice = new VoiceController((userText) => {

  // 🔒 Safety guard
  if (typeof userText !== "string" || userText.trim() === "") {
    voice.speak("कृपया स्पष्ट बोलिए।");
    return;
  }

  // ✅ यही वह लाइन थी जो गायब थी
  const reply = learner.learn(userText);

  // 🔒 अंतिम सुरक्षा
  if (typeof reply === "string" && reply.trim() !== "") {
    voice.speak(reply);
  } else {
    voice.speak("मैं समझ नहीं पाई, कृपया फिर से पूछिए।");
  }
});

/* =========================
   START BUTTON
========================= */
document.getElementById("startTalk").addEventListener("click", () => {
  voice.speak("नमस्ते, मैं अंजली हूँ। मैं सुन रही हूँ।");
});
