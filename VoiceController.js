// LearningController.js
// FINAL ACTIVE REASONING VERSION
// Responsibility:
// - Intent (समझ) पहचानना
// - Reasoning (सोच) से उत्तर चुनना
// - केवल AnswerBank से सुरक्षित वाक्य लौटाना
// GUARANTEE: Voice-safe | Deterministic | No AI/ML | No guessing

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

    // ---------- 1️⃣ समझ (Intent) ----------
    const intent = IntentResolver.resolve(text);

    // ---------- 2️⃣ विषय (Topic) ----------
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      return topicAnswer;
    }

    // ---------- 3️⃣ सोच (Reasoning) ----------
    // अभी memory संकेत safe-default हैं
    const hasRecentEmotion = (intent === "EMOTIONAL");
    const needsClarity = this.isQuestion(text);

    return ReasoningPolicy.decide({
      intent,
      hasRecentEmotion,
      needsClarity
    });
  }

  /* ---------- Helper ---------- */
  isQuestion(text) {
    return (
      text.endsWith("?") ||
      ["क्या", "क्यों", "कैसे", "कब", "कहाँ", "कौन"].some(w => text.includes(w))
    );
  }
}
