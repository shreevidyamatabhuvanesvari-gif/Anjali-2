/* =========================================================
   AnjaliCoreBridge.js
   🔗 SINGLE FILE – FINAL & PERMANENT IDENTITY FIX
   Responsibility:
   - Voice ↔ Learning ↔ Memory orchestration
   - Identity safety GUARANTEED in this file itself
========================================================= */

/* ---------- Imports ---------- */
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";
import { AppIdentity } from "./AppIdentity.js";

/* =========================================================
   🔒 HARD IDENTITY SAFETY (NO OTHER FILE DEPENDENCY)
========================================================= */

/**
 * यह फ़ंक्शन कभी भी undefined / null / खाली string
 * को बोलने नहीं देगा — चाहे ऊपर कुछ भी गड़बड़ हो।
 */
function resolveSafeName(rawName, fallback) {
  if (typeof rawName === "string") {
    const cleaned = rawName.trim();
    if (cleaned.length > 0 && cleaned !== "undefined" && cleaned !== "null") {
      return cleaned;
    }
  }
  return fallback;
}

function getSafeLoverName() {
  return resolveSafeName(AppIdentity?.loverName, "प्रिय");
}

function getSafeAppName() {
  return resolveSafeName(AppIdentity?.appName, "मैं");
}

/* =========================================================
   CORE INSTANCES
========================================================= */

const learner = new LearningController();
const memory  = new MemoryController();

/* =========================================================
   VOICE ORCHESTRATION
========================================================= */

const voice = new VoiceController((userText) => {

  // 1️⃣ स्मृति (side-effect only)
  memory.rememberConversation(userText);

  // 2️⃣ सीख / निर्णय
  const reply = learner.learn(userText);

  // 3️⃣ स्मृति (side-effect only)
  memory.rememberLearning(reply);

  // 4️⃣ आवाज़
  voice.speak(reply);
});

/* =========================================================
   UI ENTRY POINT
========================================================= */

document.getElementById("startTalk").addEventListener("click", () => {

  const loverName = getSafeLoverName();
  const appName   = getSafeAppName();

  // ❗ अब इस लाइन से कभी गलत नाम नहीं निकलेगा
  voice.speak(`नमस्ते ${loverName}, मैं ${appName} हूँ।`);
});
