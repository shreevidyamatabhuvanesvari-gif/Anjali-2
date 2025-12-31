// ReasoningEngine.js
// Responsibility:
// - Intent + Topic + Learned Knowledge के आधार पर संतुलित, संवेदनशील और तर्कसंगत उत्तर चुनना
// - प्रेमिका-जैसी संवेदना (empathy, respect, reassurance) + स्पष्ट तर्क
// Rule-based | Offline | Deterministic | Voice-safe | GUARANTEED string

import { AnswerBank } from "./AnswerBank.js";
import { TopicRules } from "./TopicRules.js";
import { IntentResolver } from "./IntentResolver.js";

export class ReasoningEngine {

  constructor(options = {}) {
    // हालिया भावनात्मक स्थिति (lightweight context)
    this.context = {
      recentEmotion: null,
      lastIntent: null
    };

    // ट्यूनिंग (kernel से बदली जा सकती है)
    this.config = {
      warmth: options.warmth ?? true,          // प्रेमिका-जैसी सौम्यता
      reassurance: options.reassurance ?? true,// ढांढस/आश्वासन
      clarityFirst: options.clarityFirst ?? true
    };
  }

  /* =====================================================
     MAIN ENTRY
  ===================================================== */
  respond(input, learnedAnswer = null) {
    // 🔒 String guard
    if (typeof input !== "string" || input.trim() === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const text = input.trim();

    // 1️⃣ यदि सिखाया गया सटीक उत्तर उपलब्ध है — वही सर्वोपरि
    if (typeof learnedAnswer === "string" && learnedAnswer.trim() !== "") {
      return this._softenIfNeeded(learnedAnswer);
    }

    // 2️⃣ Topic आधारित सीधा उत्तर
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (typeof topicAnswer === "string") {
      return this._softenIfNeeded(topicAnswer);
    }

    // 3️⃣ Intent पहचान
    const intent = IntentResolver.resolve(text);
    this.context.lastIntent = intent;

    // 4️⃣ Intent + Context के आधार पर Reasoned चयन
    const answer = this._decideByIntent(intent, text);

    // 5️⃣ अंतिम सुरक्षा
    return (typeof answer === "string" && answer.trim() !== "")
      ? answer
      : AnswerBank.GENERAL.UNKNOWN;
  }

  /* =====================================================
     INTENT-BASED DECISION
  ===================================================== */
  _decideByIntent(intent, text) {

    switch (intent) {

      case "EMOTIONAL":
        this.context.recentEmotion = "ACTIVE";
        return this._emotionalResponse(text);

      case "ETHICAL":
        return this._ethicalResponse(text);

      case "GUIDANCE":
        return this._guidanceResponse(text);

      case "EXPLANATION":
        return AnswerBank.QUESTION_TYPE.WHY;

      case "INFORMATION":
        return this._informationResponse(text);

      default:
        // यदि हाल में भावनात्मक स्थिति रही है तो सौम्य उत्तर
        if (this.context.recentEmotion && this.config.warmth) {
          return AnswerBank.EMOTIONAL.EMPATHY;
        }
        return AnswerBank.GENERAL.UNKNOWN;
    }
  }

  /* =====================================================
     RESPONSE BUILDERS (RULED, SAFE)
  ===================================================== */

  _emotionalResponse(text) {
    // प्रेमिका-जैसी संवेदना: पहले समझ, फिर आश्वासन
    if (this.config.reassurance) {
      return `${AnswerBank.EMOTIONAL.EMPATHY} ${AnswerBank.EMOTIONAL.CALM}`;
    }
    return AnswerBank.EMOTIONAL.EMPATHY;
  }

  _ethicalResponse(text) {
    // सही-गलत को संतुलन के साथ रखना
    return AnswerBank.ETHICAL.MORALITY;
  }

  _guidanceResponse(text) {
    // व्यवहारिक दिशा — बिना आदेशात्मक लहजे के
    return AnswerBank.PRACTICAL.SOLUTION;
  }

  _informationResponse(text) {
    // स्पष्टता को प्राथमिकता
    if (this.config.clarityFirst) {
      return AnswerBank.GENERAL.CLARIFY;
    }
    return AnswerBank.GENERAL.UNKNOWN;
  }

  /* =====================================================
     TONE SOFTENER (VOICE-SAFE)
  ===================================================== */
  _softenIfNeeded(answer) {
    // यहाँ string concatenation सीमित और सुरक्षित है
    if (!this.config.warmth) return answer;

    // यदि उत्तर पहले से भावनात्मक/सम्मानजनक है, वैसा ही रखें
    return answer;
  }
      }
