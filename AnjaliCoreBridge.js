// AnjaliCoreBridge.js
// FINAL — PRIMARY BRAIN WIRED

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

const learner = new LearningController();

const voice = new VoiceController((userText) => {
  const reply = learner.learn(userText);
  voice.speak(reply);
});

document.getElementById("startTalk").addEventListener("click", () => {
  voice.speak("नमस्ते, मैं अंजली हूँ। मैं सुन रही हूँ।");

  setTimeout(() => {
    voice.listen();
  }, 600);
});
