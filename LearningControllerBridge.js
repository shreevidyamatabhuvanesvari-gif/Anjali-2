// LearningControllerBridge.js
// Responsibility:
// - LearningController और ReasoningEngine के बीच सेतु
// - पहले सीखे गए ज्ञान को ReasoningEngine को देना
// - Reasoned उत्तर को LearningController तक वापस पहुँचाना
// Rule-based | Deterministic | Offline | Voice-safe | NO AI/ML

import { ReasoningEngine } from "./ReasoningEngine.js";
import { AnswerBank } from "./AnswerBank.js";

export class LearningControllerBridge {

  constructor() {
    this.reasoner = new ReasoningEngine();
  }

  /* =====================================================
     MAIN BRIDGE API
  ===================================================== */
  getReasonedAnswer(params) {

    if (!params || typeof params !== "object") {
      return AnswerBank.GENERAL.UNKNOWN;
    }

    const {
      question,
      intent,
      learnedAnswer,
      topicAnswer
    } = params;

    // 1️⃣ यदि सीखा हुआ उत्तर है → सर्वोच्च प्राथमिकता
    if (typeof learnedAnswer === "string" && learnedAnswer.trim() !== "") {
      return learnedAnswer;
    }

    // 2️⃣ यदि TopicRules से उत्तर मिला है
    if (typeof topicAnswer === "string" && topicAnswer.trim() !== "") {
      return topicAnswer;
    }

    // 3️⃣ ReasoningEngine से सोचकर उत्तर
    const reasoned = this.reasoner.think({
      question,
      intent
    });

    if (typeof reasoned === "string" && reasoned.trim() !== "") {
      return reasoned;
    }

    // 4️⃣ अंतिम fallback (कभी खाली नहीं)
    return AnswerBank.GENERAL.UNKNOWN;
  }

}
