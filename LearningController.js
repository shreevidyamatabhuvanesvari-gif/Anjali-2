// LearningController.js
// Responsibility:
// - User के प्रश्न का सुरक्षित, निश्चित उत्तर देना
// - Learned Q/A → TopicRules → ReasoningEngine (via Bridge)
// - Voice pipeline को कभी break न होने देना
// Rule-based | Deterministic | Offline | Voice-safe | FINAL

import { LearningStorage } from "./LearningStorage.js";
import { TopicRules } from "./TopicRules.js";
import { IntentResolver } from "./IntentResolver.js";
import { AnswerBank } from "./AnswerBank.js";
import { LearningControllerBridge } from "./LearningControllerBridge.js";

export class LearningController {

  constructor() {
    this.storage = new LearningStorage();
    this.bridge  = new LearningControllerBridge();

    // 🔒 runtime cache (IndexedDB async समस्या का समाधान)
    this.runtimeLearned = new Map();
  }

  /* =====================================================
     MAIN ENTRY POINT
  ===================================================== */
  learn(input) {

    /* ---------- HARD STRING GUARD ---------- */
    if (typeof input !== "string" || input.trim() === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const question = input.trim();

    /* =====================================================
       1️⃣ Learned Q/A (Runtime Cache – Instant)
    ===================================================== */
    if (this.runtimeLearned.has(question)) {
      return this.runtimeLearned.get(question);
    }

    /* =====================================================
       2️⃣ Learned Q/A (IndexedDB – Async Safe Load)
    ===================================================== */
    try {
      this.storage.findAnswer(question, (answer) => {
        if (typeof answer === "string" && answer.trim() !== "") {
          this.runtimeLearned.set(question, answer);
        }
      });
    } catch (_) {
      // कोई असर नहीं – fallback रहेगा
    }

    /* =====================================================
       3️⃣ Topic Rules
    ===================================================== */
    const topicAnswer = TopicRules.getTopicAnswer(question);

    /* =====================================================
       4️⃣ Intent Resolution
    ===================================================== */
    const intent = IntentResolver.resolve(question);

    /* =====================================================
       5️⃣ FINAL DECISION (Bridge → ReasoningEngine)
    ===================================================== */
    const finalAnswer = this.bridge.getReasonedAnswer({
      question,
      intent,
      learnedAnswer: null,      // runtime cache ऊपर handle हो चुका
      topicAnswer
    });

    /* ---------- HARD GUARANTEE ---------- */
    if (typeof finalAnswer === "string" && finalAnswer.trim() !== "") {
      return finalAnswer;
    }

    return AnswerBank.GENERAL.UNKNOWN;
  }

  /* =====================================================
     🔑 LearningUI से बुलाया जाने वाला Hook
     (जब नया Q/A सिखाया जाए)
  ===================================================== */
  onLearnedQA(question, answer) {
    if (
      typeof question === "string" &&
      typeof answer === "string" &&
      question.trim() !== "" &&
      answer.trim() !== ""
    ) {
      this.runtimeLearned.set(question.trim(), answer.trim());
    }
  }
}
