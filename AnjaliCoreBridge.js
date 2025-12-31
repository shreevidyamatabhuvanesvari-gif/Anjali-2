/* =========================================================
   AnjaliCoreBridge.js
   🔗 SINGLE AUTHORITY CONNECTOR (PURE)
========================================================= */

import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";

/* ---------- Core Instances ---------- */
const learner = new LearningController();
const memory  = new MemoryController();

/* ---------- Voice Wiring ---------- */
const voice = new VoiceController((userText) => {

  // 1️⃣ Memory (side-effect only)
  memory.rememberConversation(userText);

  // 2️⃣ Learning (decision)
  const reply = learner.learn(userText);

  // 3️⃣ Memory (side-effect only)
  memory.rememberLearning(reply);

  // 4️⃣ Voice output
  voice.speak(reply);
});

/* ---------- UI Entry Point ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  voice.speak(
    `नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`
  );
});
