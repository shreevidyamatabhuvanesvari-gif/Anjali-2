// LearningController.js
// FINAL KERNEL
// Responsibility: ReasoningEngine को PRIMARY बनाना
// GUARANTEE: learn() हमेशा string लौटाएगा
// Voice-safe | No async | No storage

import { ReasoningEngine } from "./ReasoningEngine.js";

export class LearningController {

  constructor() {
    this.reasoner = new ReasoningEngine();
  }

  learn(input) {
    // 🔒 Absolute safety
    if (typeof input !== "string") {
      return "मैं आपकी बात समझ नहीं पाई।";
    }

    // 🧠 PRIMARY: Reasoning
    const response = this.reasoner.think(input);

    // 🔐 Final guard
    if (typeof response === "string" && response.trim() !== "") {
      return response;
    }

    // ❗ यह लाइन practically नहीं पहुँचेगी
    return "मैं आपकी बात समझने की कोशिश कर रही हूँ।";
  }
}
