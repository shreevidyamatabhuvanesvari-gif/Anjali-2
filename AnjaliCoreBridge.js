/* =========================================================
   AnjaliCoreBridge.js
   FINAL FIX — VOICE + UI GUARANTEED
   Responsibility:
   - UI button → Voice start
   - Voice → LearningController
   - No race condition
   - No missing event
========================================================= */

import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";
import { AppIdentity } from "./AppIdentity.js";

/* =========================================================
   🔒 SAFE NAME RESOLUTION
========================================================= */
function safeName(value, fallback) {
  if (typeof value === "string") {
    const v = value.trim();
    if (v && v !== "undefined" && v !== "null") {
      return v;
    }
  }
  return fallback;
}

/* =========================================================
   DOM READY — 🔑 सबसे महत्वपूर्ण FIX
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- HARD DOM CHECK ---------- */
  const startBtn = document.getElementById("startTalk");
  if (!startBtn) {
    alert("startTalk बटन नहीं मिला — HTML जाँचें");
    return;
  }

  /* ---------- CORE INSTANCES ---------- */
  const learner = new LearningController();
  const memory  = new MemoryController();

  const voice = new VoiceController((userText) => {

    if (typeof userText !== "string" || userText.trim() === "") return;

    // 1️⃣ स्मृति
    memory.rememberConversation(userText);

    // 2️⃣ उत्तर
    const reply = learner.learn(userText);

    // 3️⃣ स्मृति
    memory.rememberLearning(reply);

    // 4️⃣ बोलें
    voice.speak(reply);
  });

  /* ---------- START BUTTON ---------- */
  startBtn.addEventListener("click", () => {

    const loverName = safeName(AppIdentity?.loverName, "प्रिय");
    const appName   = safeName(AppIdentity?.appName, "अंजली");

    // 🔑 यही लाइन पूरी आवाज़ चालू करती है
    voice.speak(`नमस्ते ${loverName}, मैं ${appName} हूँ।`);
  });

});
