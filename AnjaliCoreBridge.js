// AnjaliCoreBridge.js
// Responsibility: Voice orchestration (FINAL FIX)

import { VoiceController } from "./VoiceController.js";

const voice = new VoiceController((userText) => {

  // अभी के लिए echo + response pipeline
  const reply = `आपने कहा: ${userText}`;
  voice.speak(reply);
});

/* 🔑 USER GESTURE = CLICK */
document.getElementById("startTalk").addEventListener("click", () => {

  // 1️⃣ बोलना
  voice.speak("नमस्ते, मैं अंजली हूँ। मैं सुन रही हूँ।");

  // 2️⃣ 🔥 यही निर्णायक लाइन थी (अब mic खुलेगा)
  voice.listen();
});
