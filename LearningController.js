// LearningController.js
// FINAL WITH STRING-GUARD
// Responsibility:
// - Intent + Topic + Reasoning से उत्तर चुनना
// - हर स्थिति में VALID STRING लौटाना
// GUARANTEE: Voice-safe | Deterministic | No AI/ML

import { TopicRules } from "./TopicRules.js";
import { AnswerBank } from "./AnswerBank.js";
import { IntentResolver } from "./IntentResolver.js";
import { ReasoningPolicy } from "./ReasoningPolicy.js";

export class LearningController {

  learn(input) {
    // ---------- Absolute Guards ----------
    if (typeof input !== "string") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const text = input.trim();
    if (text === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    let result = null;

    // ---------- 1️⃣ समझ (Intent) ----------
    const intent = IntentResolver.resolve(text);

    // ---------- 2️⃣ विषय (Topic) ----------
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      result = topicAnswer;
    }

    // ---------- 3️⃣ सोच (Reasoning) ----------
    if (result === null) {
      const hasRecentEmotion = (intent === "EMOTIONAL");
      const needsClarity = this.isQuestion(text);

      result = ReasoningPolicy.decide({
        intent,
        hasRecentEmotion,
        needsClarity
      });
    }

    // ---------- 🔒 FINAL STRING-GUARD ----------
    // ❗ यही वह निर्णायक लाइन है जो आवाज़ बचाती है
    if (typeof result !== "string" || result.trim() === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    return result;
  }

  /* ---------- Helper ---------- */
  isQuestion(text) {
    return (
      text.endsWith("?") ||
      ["क्या", "क्यों", "कैसे", "कब", "कहाँ", "कौन"].some(w => text.includes(w))
    );
  }
}
