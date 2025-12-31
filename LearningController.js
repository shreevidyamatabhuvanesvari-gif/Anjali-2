// LearningController.js
// Responsibility:
// - प्रश्न के अनुसार सटीक उत्तर चुनना
// - TopicRules + AnswerBank से तैयार उत्तर लौटाना
// Rule-based | Deterministic | Voice-Safe | No AI/ML | No guessing

import { TopicRules } from "./TopicRules.js";
import { AnswerBank } from "./AnswerBank.js";

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

    // 1️⃣ Topic-based answer (highest priority)
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      return topicAnswer;
    }

    // 2️⃣ Question-type handling (fallback logic)
    if (this.isQuestion(text)) {
      return this.answerByQuestionType(text);
    }

    // 3️⃣ Non-question statement
    return AnswerBank.GENERAL.LISTENING;
  }

  /* =====================================================
     QUESTION TYPE HANDLER (SAFE)
  ===================================================== */

  answerByQuestionType(text) {

    if (text.includes("क्यों")) {
      return AnswerBank.QUESTION_TYPE.WHY;
    }

    if (text.includes("कैसे")) {
      return AnswerBank.QUESTION_TYPE.HOW;
    }

    if (text.includes("क्या")) {
      return AnswerBank.QUESTION_TYPE.WHAT;
    }

    if (this.includesAny(text, ["कब", "कहाँ", "कौन"])) {
      return AnswerBank.QUESTION_TYPE.WHEN_WHERE_WHO;
    }

    // Guaranteed safe fallback
    return AnswerBank.GENERAL.UNKNOWN;
  }

  /* =====================================================
     HELPERS
  ===================================================== */

  isQuestion(text) {
    return (
      text.endsWith("?") ||
      this.includesAny(text, ["क्या", "क्यों", "कैसे", "कब", "कहाँ", "कौन"])
    );
  }

  includesAny(text, words) {
    return words.some(word => text.includes(word));
  }
}
