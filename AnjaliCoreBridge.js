// AnjaliCoreBridge.js
// Responsibility: Voice + Learning orchestration (ANSWER FIX)

import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";

const learner = new LearningController();

const voice = new VoiceController((userText) => {

  // 🔥 यही लाइन पहले गायब थी
  const reply = learner.learn(userText);

  // अब वास्तविक उत्तर बोला जाएगा
  voice.speak(reply);
});

/* USER GESTURE */
document.getElementById("startTalk").addEventListener("click", () => {

  voice.speak("नमस्ते, मैं अंजली हूँ। आप क्या पूछना चाहते हैं?");

  // mic start (browser safe)
  voice.listen();
});
