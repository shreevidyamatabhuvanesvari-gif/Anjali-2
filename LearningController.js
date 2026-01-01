// LearningController.js
// PRIMARY BRAIN: ReasoningEngine
// GUARANTEE:
// - हर बार string return
// - Reasoning पहले, fallback बाद में
// - Voice-safe, no async, no silent fail

import { ReasoningEngine } from "./ReasoningEngine.js";

export class LearningController {

  constructor() {
    this.reasoner = new ReasoningEngine();
  }

  /* =====================================================
     MAIN ENTRY (VOICE → BRAIN)
  ===================================================== */
  learn(input) {

    // 🔒 Absolute Voice Safety
    if (typeof input !== "string") {
      return "मैं आपकी बात स्पष्ट नहीं सुन पाई। कृपया फिर से कहिए।";
    }

    const text = input.trim();

    if (text === "") {
      return "आप कुछ कहना चाह रहे हैं। मैं सुन रही हूँ।";
    }

    // 🧠 STEP–1: THINK FIRST (PRIMARY)
    const thought = this.reasoner.think(text);

    if (typeof thought === "string" && thought.trim() !== "") {
      return thought;
    }

    // 🛟 STEP–2: अंतिम सुरक्षित fallback (कभी नहीं टूटेगा)
    return "मैं आपकी बात समझने की कोशिश कर रही हूँ। आप थोड़ा और बताइए।";
  }
}
