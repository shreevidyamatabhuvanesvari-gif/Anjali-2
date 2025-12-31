// LearningController.js
// Responsibility: प्रश्न के अनुसार सटीक उत्तर देना
// PersonalityEngine integrated safely
// Rule-based | Deterministic | No AI/ML
// GUARANTEE: हर स्थिति में string return (Voice SAFE)

import { TopicRules } from "./TopicRules.js";
import { PersonalityEngine } from "./personality/PersonalityEngine.js";

export class LearningController {

  learn(input) {
    if (typeof input !== "string" || input.trim() === "") {
      return "कृपया अपना प्रश्न स्पष्ट रूप से पूछिए।";
    }

    const text = input.trim();

    // 1️⃣ विषय-विशेष उत्तर (यदि मिला)
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (topicAnswer !== null) {
      return this.applyPersonality(topicAnswer, text);
    }

    // 2️⃣ प्रश्न-प्रकार
    if (this.isQuestion(text)) {
      return this.applyPersonality(
        "आपका प्रश्न विषय के बिना स्पष्ट नहीं है। कृपया थोड़ा और स्पष्ट करें।",
        text
      );
    }

    // 3️⃣ सामान्य कथन
    return this.applyPersonality(
      "मैं सुन रही हूँ। यदि कोई प्रश्न है तो स्पष्ट पूछिए।",
      text
    );
  }

  /* =====================================================
     PERSONALITY APPLICATION (ALL 6 TRAITS)
  ===================================================== */

  applyPersonality(answer, originalText) {
    const {
      EmotionalTraits,
      MentalTraits,
      LoveTraits,
      EthicalTraits,
      SpiritualTraits,
      PracticalTraits
    } = PersonalityEngine;

    let finalAnswer = answer;

    /* ---------- Emotional + Love + Mental (हमेशा सुरक्षित) ---------- */
    // (भाषा को सौम्य, सम्मानजनक और स्पष्ट बनाए रखना)
    if (
      EmotionalTraits.empathy &&
      LoveTraits.respect &&
      MentalTraits.clearCommunication
    ) {
      finalAnswer = finalAnswer;
    }

    /* ---------- Ethical Traits (केवल नैतिक प्रश्नों पर) ---------- */
    if (
      EthicalTraits &&
      this.includesAny(originalText, ["सही", "गलत", "नैतिक", "मर्यादा", "ईमान"])
    ) {
      finalAnswer =
        finalAnswer +
        " निर्णय लेते समय ईमानदारी और मर्यादा का ध्यान रखना आवश्यक होता है।";
    }

    /* ---------- Spiritual Traits (केवल गूढ़ प्रश्नों पर) ---------- */
    if (
      SpiritualTraits &&
      this.includesAny(originalText, ["आत्मा", "अर्थ", "जीवन", "कर्म", "आध्यात्म"])
    ) {
      finalAnswer =
        finalAnswer +
        " जीवन की गहराई समझ और आत्मिक संतुलन से प्रकट होती है।";
    }

    /* ---------- Practical Traits (केवल व्यवहारिक प्रश्नों पर) ---------- */
    if (
      PracticalTraits &&
      this.includesAny(originalText, ["उपाय", "समाधान", "कैसे करूँ", "व्यवहार"])
    ) {
      finalAnswer =
        finalAnswer +
        " व्यवहारिक रूप से वही करें जो परिस्थिति में संभव और संतुलित हो।";
    }

    return finalAnswer;
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
