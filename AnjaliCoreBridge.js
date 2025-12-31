/* =========================================================
   AnjaliCoreBridge.js
   🔗 Single Authority Connector (PURE ORCHESTRATION)
   Responsibility:
   - Voice ↔ Learning ↔ Memory को जोड़ना
   - IdentityGuard के माध्यम से सुरक्षित संबोधन
========================================================= */

/* ---------- Imports ---------- */
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";
import { getSafeLoverName, getSafeAppName } from "./IdentityGuard.js";

/* ---------- Core Instances ---------- */
const learner = new LearningController();
const memory  = new MemoryController();

/* ---------- Voice Wiring ---------- */
/*
  VoiceController केवल बोलना/सुनना करता है।
  जब यूज़र बोलता है, यह callback बुलाता है।
*/
const voice = new VoiceController((userText) => {

  // 1️⃣ स्मृति: यूज़र का कथन (side-effect only)
  memory.rememberConversation(userText);

  // 2️⃣ सीख/निर्णय: उत्तर बनाना
  const reply = learner.learn(userText);

  // 3️⃣ स्मृति: अंजली का उत्तर (side-effect only)
  memory.rememberLearning(reply);

  // 4️⃣ आवाज़: उत्तर बोलना
  voice.speak(reply);
});

/* ---------- UI Entry Point ---------- */
document.getElementById("startTalk").addEventListener("click", () => {

  // 🔒 IdentityGuard के माध्यम से सुरक्षित नाम
  const loverName = getSafeLoverName();
  const appName   = getSafeAppName();

  // प्रारंभिक संबोधन
  voice.speak(`नमस्ते ${loverName}, मैं ${appName} हूँ।`);
});
