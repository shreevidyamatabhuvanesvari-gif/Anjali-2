// AnjaliCoreBridge.js
// GUARANTEE: बटन दबाते ही आवाज़ आएगी

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

const voice   = new VoiceController();
const learner = new LearningController();

document.getElementById("startTalk").addEventListener("click", () => {
  const reply = learner.learn("नमस्ते");
  voice.speak(reply);
});
