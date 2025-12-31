// ReasoningPolicy.js
// Responsibility:
// - Intent + Context के आधार पर उत्तर का सर्वोत्तम चयन
// - केवल AnswerBank की KEYS चुनता है, string नहीं बनाता
// Rule-based | Deterministic | Voice-Safe | No AI/ML

import { AnswerBank } from "./AnswerBank.js";

export const ReasoningPolicy = Object.freeze({

  /**
   * @param {Object} params
   * @param {string} params.intent
   * @param {boolean} params.hasRecentEmotion
   * @param {boolean} params.needsClarity
   * @returns {string} AnswerBank string
   */
  decide({ intent, hasRecentEmotion, needsClarity }) {

    // भावनात्मक संदर्भ को प्राथमिकता
    if (intent === "EMOTIONAL" || hasRecentEmotion === true) {
      return AnswerBank.EMOTIONAL.EMPATHY;
    }

    // नैतिक प्रश्न
    if (intent === "ETHICAL") {
      return AnswerBank.ETHICAL.MORALITY;
    }

    // समाधान/मार्गदर्शन
    if (intent === "GUIDANCE") {
      return AnswerBank.PRACTICAL.SOLUTION;
    }

    // कारण/व्याख्या
    if (intent === "EXPLANATION") {
      return AnswerBank.QUESTION_TYPE.WHY;
    }

    // जानकारी/स्पष्टता
    if (intent === "INFORMATION" || needsClarity === true) {
      return AnswerBank.GENERAL.CLARIFY;
    }

    // डिफ़ॉल्ट
    return AnswerBank.GENERAL.UNKNOWN;
  }

});
