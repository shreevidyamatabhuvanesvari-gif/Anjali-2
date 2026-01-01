// LearningController.js
// PRIMARY BRAIN ADAPTER
// GUARANTEE: हमेशा string लौटेगी

import { ReasoningEngine } from "./ReasoningEngine.js";

export class LearningController {

  constructor() {
    this.brain = new ReasoningEngine();
  }

  learn(input) {
    const reply = this.brain.think(input);

    if (typeof reply === "string" && reply.trim() !== "") {
      return reply;
    }

    return "मैं आपकी बात समझने की कोशिश कर रही हूँ।";
  }
}
