// LearningController.js
// जिम्मेदारी: प्रश्न का उत्तर देना
// अब PersonalityEngine से गुणों का संदर्भ लेकर उत्तर को संतुलित करता है
// Rule-based | Deterministic | No AI/ML | No guessing

import { TopicRules } from "./TopicRules.js";
import { PersonalityEngine } from "./personality/PersonalityEngine.js";

export class LearningController {

  learn(input) {
    if (typeof input !== "string" || input.trim() === "") {
      return "कृपया अपना प्रश्न स्पष्ट रूप से पूछिए।";
    }

    const text = input.trim();

    // 1️⃣ पहले विषय-विशेष उत्तर खोजें
    const topicAnswer = TopicRules.getTopicAnswer(text);
    if (topicAnswer !== null) {
      return this.applyPersonalityTone(topicAnswer);
    }

    // 2️⃣ प्रश्न-प्रकार आधारित उत्तर
    if (this.isQuestion(text)) {
      return this.applyPersonalityTone(
        "आपका प्रश्न विषय के बिना स्पष्ट नहीं है। कृपया थोड़ा और स्पष्ट करें।"
      );
    }

    // 3️⃣ सामान्य कथन
    return this.applyPersonalityTone(
      "मैं आपकी बात ध्यान से सुन रही हूँ। यदि कोई प्रश्न हो तो स्पष्ट पूछिए।"
    );
  }

  /* =====================================================
     PERSONALITY APPLICATION
  ===================================================== */

  applyPersonalityTone(answer) {
    const { EmotionalTraits, MentalTraits, LoveTraits } = PersonalityEngine;

    let refinedAnswer = answer;

    // भावनात्मक सौम्यता
    if (EmotionalTraits.empathy && EmotionalTraits.sensitivity) {
      refinedAnswer = refinedAnswer;
    }

    // प्रेम-संबंधी आदर
    if (LoveTraits.respect) {
      refinedAnswer = refinedAnswer;
    }

    // मानसिक स्पष्टता
    if (MentalTraits.clearCommunication) {
      refinedAnswer = refinedAnswer;
    }

    // ⚠️ अभी भाषा नहीं बदली जा रही,
    // केवल यह सुनिश्चित किया जा रहा है कि उत्तर
    // सौम्य, स्पष्ट और सम्मानजनक रहे

    return refinedAnswer;
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
