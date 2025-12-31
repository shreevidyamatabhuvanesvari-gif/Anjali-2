// ReasoningEngine.js
// Responsibility:
// - ऑफ़लाइन, नियम-आधारित वास्तविक reasoning करना
// - Question → Concept → Conclusion flow
// - AnswerBank / Traits / GraphStore को जोड़ना
// Rule-based | Deterministic | Offline-only | No AI | No API

import { ReasoningGraphStore } from "./ReasoningGraphStore.js";
import { AnswerBank } from "./AnswerBank.js";

export class ReasoningEngine {

  constructor() {
    this.graph = new ReasoningGraphStore();
  }

  /* =====================================================
     MAIN ENTRY
  ===================================================== */
  reason(questionText) {

    // 🔒 HARD STRING GUARD
    if (typeof questionText !== "string" || questionText.trim() === "") {
      return AnswerBank.GENERAL.CLARIFY;
    }

    const question = questionText.trim();

    // 1️⃣ भावनात्मक संकेत जाँच
    if (this._hasEmotion(question)) {
      return AnswerBank.EMOTIONAL.EMPATHY;
    }

    // 2️⃣ प्रेम / संबंध
    if (this._hasLoveContext(question)) {
      return "मैं तुम्हारी भावना को हल्के में नहीं ले रही हूँ। प्रेम में उत्तर से पहले समझ ज़रूरी होती है।";
    }

    // 3️⃣ नैतिक / सही–गलत
    if (this._hasEthicalContext(question)) {
      return "सही वही होता है जिसमें किसी के मन को ठेस न पहुँचे और संबंध सुरक्षित रहें।";
    }

    // 4️⃣ उद्देश्य / भविष्य
    if (this._hasFutureContext(question)) {
      return "भविष्य का उत्तर एक कदम में नहीं मिलता, लेकिन दिशा अभी तय की जा सकती है।";
    }

    // 5️⃣ कोई स्पष्ट संदर्भ नहीं → सुरक्षित fallback
    return AnswerBank.GENERAL.UNKNOWN;
  }

  /* =====================================================
     CONTEXT DETECTORS (PURE RULES)
  ===================================================== */

  _hasEmotion(text) {
    return this._hasAny(text, [
      "दुख", "परेशान", "रो", "अकेला",
      "थक", "डर", "चिंता", "बेचैन"
    ]);
  }

  _hasLoveContext(text) {
    return this._hasAny(text, [
      "प्रेम", "प्यार", "तुम",
      "हम", "रिश्ता", "साथ"
    ]);
  }

  _hasEthicalContext(text) {
    return this._hasAny(text, [
      "सही", "गलत", "धोखा",
      "ईमान", "नैतिक"
    ]);
  }

  _hasFutureContext(text) {
    return this._hasAny(text, [
      "भविष्य", "आगे", "कल",
      "जीवन", "लक्ष्य"
    ]);
  }

  /* =====================================================
     UTILITY
  ===================================================== */
  _hasAny(text, words) {
    return words.some(word => text.includes(word));
  }
}
