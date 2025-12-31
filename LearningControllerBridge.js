// LearningControllerBridge.js
// Responsibility:
// - Voice के लिए एकमात्र सुरक्षित entry point
// - Learning (सीखा हुआ) + Reasoning (सोच) को सही क्रम में जोड़ना
// GUARANTEE:
// - हमेशा string return
// - Voice कभी block नहीं होगी
// FINAL | STABLE | VOICE-SAFE

import { LearningController } from "./LearningController.js";
import { TopicRules } from "./TopicRules.js";
import { IntentResolver } from "./IntentResolver.js";
import { ReasoningEngine } from "./ReasoningEngine.js";
import { AnswerBank } from "./AnswerBank.js";

export class LearningControllerBridge {

  constructor() {
    this.learning = new LearningController();
  }

  /**
   * 🔑 यही एकमात्र method है जिसे Voice बुलाएगी
   * @param {string} userText
   * @returns {string} (GUARANTEED)
   */
  process(userText) {

    /* ===============================
       HARD STRING GUARD
    =============================== */
    if (typeof userText !== "string" || userText.trim() === "") {
      return AnswerBank.GENERAL.LISTENING;
    }

    const question = userText.trim();

    /* ===============================
       1️⃣ सीखा हुआ उत्तर (FAST PATH)
       ⚠️ async storage पर निर्भर नहीं
    =============================== */
    const learnedAnswer = this.learning.getCachedAnswer?.(question);
    if (typeof learnedAnswer === "string") {
      return learnedAnswer;
    }

    /* ===============================
       2️⃣ विषय आधारित नियम
    =============================== */
    const topicAnswer = TopicRules.getTopicAnswer(question);

    if (typeof topicAnswer === "string") {
      return topicAnswer;
    }

    /* ===============================
       3️⃣ Intent पहचान
    =============================== */
    const intent = IntentResolver.resolve(question);

    /* ===============================
       4️⃣ FINAL सोच (ReasoningEngine)
    =============================== */
    const reasoned = ReasoningEngine.think({
      question,
      intent
    });

    if (typeof reasoned === "string" && reasoned.trim() !== "") {
      return reasoned;
    }

    /* ===============================
       5️⃣ अंतिम fallback (VOICE SAFE)
    =============================== */
    return AnswerBank.GENERAL.UNKNOWN;
  }
}
