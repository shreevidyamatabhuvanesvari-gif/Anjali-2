// AnjaliCoreBridge.js
// Responsibility: केवल Voice को चालू करना

import { VoiceController } from "./VoiceController.js";

const voice = new VoiceController((userText) => {
  // फिलहाल echo
  voice.speak(`आपने कहा: ${userText}`);
});

document.getElementById("startTalk").addEventListener("click", () => {
  voice.speak("नमस्ते, मैं अंजली हूँ। मैं सुन रही हूँ।");
});
