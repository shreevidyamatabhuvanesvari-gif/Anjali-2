// LearningController.js
// PRIMARY BRAIN = ReasoningEngine

import { ReasoningEngine } from "./ReasoningEngine.js";

export class LearningController {

  constructor() {
    this.brain = new ReasoningEngine();
  }

  learn(input) {
    return this.brain.think(input);
  }
}
