// LearningController.js
// Responsibility:
// - उपयोगकर्ता के कथन से सुरक्षित उत्तर चुनना
// - TopicRules + IntentResolver + ReasoningPolicy को संयोजित करना
// GUARANTEE:
// - हर स्थिति में केवल string return
// - VoiceController के साथ पूर्ण संगत (voice-safe)

import { TopicRules } from "./TopicRules.js";
import { IntentResolver } from "./IntentResolver.js";
import { ReasoningPolicy } from "./ReasoningPolicy.js";
import { AnswerBank } from "./AnswerBank.js";

export class LearningController {

  learn(input) {

    /* ---------- HARD INPUT GUARD ---------- */
    if (typeof input !== "string") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const text = input.trim();
    if (text === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    /* =====================================================
       1️⃣ विषय-विशेष उत्तर (Direct Topic Match)
    ===================================================== */
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      return topicAnswer;
    }

    /* =====================================================
       2️⃣ Intent पहचान
    ===================================================== */
    const intent = IntentResolver.resolve(text);

    /* =====================================================
       3️⃣ Reasoning Policy (सुरक्षित निर्णय)
    ===================================================== */
    const decidedAnswer = ReasoningPolicy.decide({
      intent: intent,
      hasRecentEmotion: intent === "EMOTIONAL",
      needsClarity: intent === "INFORMATION"
    });

    /* =====================================================
       4️⃣ FINAL STRING GUARD (अत्यंत महत्वपूर्ण)
    ===================================================== */
    if (typeof decidedAnswer === "string") {
      return decidedAnswer;
    }

    /* ---------- ABSOLUTE FALLBACK ---------- */
    return AnswerBank.GENERAL.UNKNOWN;
  }
}
