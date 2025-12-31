// LearningController.js
// Responsibility:
// - प्रश्न के अनुसार उत्तर का चयन
// - TopicRules + IntentResolver + AnswerBank का सुरक्षित उपयोग
// Rule-based | Deterministic | Voice-Safe | No AI/ML

import { TopicRules } from "./TopicRules.js";
import { AnswerBank } from "./AnswerBank.js";
import { IntentResolver } from "./IntentResolver.js";

export class LearningController {

  learn(input) {
    // ---- Absolute guards ----
    if (typeof input !== "string") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const text = input.trim();
    if (text === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    // 1️⃣ पहले इरादा पहचानें (समझ)
    const intent = IntentResolver.resolve(text);

    // 2️⃣ फिर विषय-आधारित उत्तर खोजें
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      return topicAnswer;
    }

    // 3️⃣ विषय न मिले तो इरादे के अनुसार सुरक्षित उत्तर
    return this.answerByIntent(intent);
  }

  /* =====================================================
     INTENT-BASED SAFE SELECTION
  ===================================================== */

  answerByIntent(intent) {
    switch (intent) {

      case "INFORMATION":
        return AnswerBank.GENERAL.CLARIFY;

      case "EXPLANATION":
        return AnswerBank.QUESTION_TYPE.WHY;

      case "EMOTIONAL":
        return AnswerBank.EMOTIONAL.EMPATHY;

      case "ETHICAL":
        return AnswerBank.ETHICAL.MORALITY;

      case "GUIDANCE":
        return AnswerBank.PRACTICAL.SOLUTION;

      default:
        return AnswerBank.GENERAL.UNKNOWN;
    }
  }
}
