// TopicRules.js
// Responsibility:
// - उपयोगकर्ता के प्रश्न से विषय (Topic) पहचानना
// - AnswerBank से केवल KEY के आधार पर उत्तर लौटाना
// Rule-based | Deterministic | Voice-Safe | No AI/ML | No string building

import { AnswerBank } from "./AnswerBank.js";

export class TopicRules {

  /**
   * @param {string} text
   * @returns {string|null}
   */
  static getTopicAnswer(text) {
    if (typeof text !== "string") return null;

    const query = text.trim();
    if (query === "") return null;

    /* =====================================================
       पहचान / परिचय
    ===================================================== */
    if (
      this.hasAny(query, ["तुम", "आप", "अंजली"]) &&
      this.hasAny(query, ["कौन", "नाम"])
    ) {
      return AnswerBank.IDENTITY.NAME;
    }

    /* =====================================================
       एप / सिस्टम
    ===================================================== */
    if (this.hasAny(query, ["एप", "ऐप", "प्रोग्राम", "सिस्टम"])) {
      return AnswerBank.APP.DESCRIPTION;
    }

    /* =====================================================
       प्रेम / संबंध
    ===================================================== */
    if (this.hasAny(query, ["प्रेम", "प्यार", "रिश्ता", "संबंध"])) {
      return AnswerBank.EMOTIONAL.EMPATHY;
    }

    /* =====================================================
       विश्वास / ईमानदारी
    ===================================================== */
    if (this.hasAny(query, ["विश्वास", "भरोसा", "ईमानदारी", "सत्य"])) {
      return AnswerBank.ETHICAL.MORALITY;
    }

    /* =====================================================
       समय / धैर्य
    ===================================================== */
    if (this.hasAny(query, ["समय", "धैर्य", "प्रतीक्षा"])) {
      return AnswerBank.EMOTIONAL.CALM;
    }

    /* =====================================================
       उद्देश्य / लक्ष्य
    ===================================================== */
    if (this.hasAny(query, ["उद्देश्य", "लक्ष्य", "मकसद"])) {
      return AnswerBank.PRACTICAL.SOLUTION;
    }

    /* =====================================================
       कोई विषय नहीं मिला
    ===================================================== */
    return null;
  }

  /* =====================================================
     Helper
  ===================================================== */
  static hasAny(text, words) {
    return words.some(word => text.includes(word));
  }
}
