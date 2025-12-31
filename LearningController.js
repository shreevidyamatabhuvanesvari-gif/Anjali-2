// LearningController.js
// Responsibility: प्रश्न के अनुसार सटीक उत्तर देना
// PersonalityEngine integrated safely
// Rule-based | Deterministic | No AI/ML
// GUARANTEE: हर स्थिति में string return (Voice SAFE)

import { TopicRules } from "./TopicRules.js";
import { PersonalityEngine } from "./personality/PersonalityEngine.js";

export class LearningController {

  learn(input) {
    // Input validation — absolute guard
    if (typeof input !== "string") {
      return "कृपया अपना प्रश्न स्पष्ट रूप से पूछिए।";
    }

    const text = input.trim();
    if (text === "") {
      return "कृपया अपना प्रश्न स्पष्ट रूप से पूछिए।";
    }

    // 1) Attempt topic-specific answer first (definitive)
    try {
      const topicAnswer = TopicRules.getTopicAnswer(text);
      if (topicAnswer !== null && typeof topicAnswer === "string") {
        return this.applyPersonality(topicAnswer, text);
      }
    } catch (e) {
      // Fail-safe: do not break voice flow; continue to generic handler
    }

    // 2) Question-type handling
    if (this.isQuestion(text)) {
      return this.applyPersonality(this.answerQuestion(text), text);
    }

    // 3) Fallback for non-question statements
    return this.applyPersonality("मैं आपकी बात ध्यान से सुन रही हूँ। यदि कोई प्रश्न हो तो स्पष्ट पूछिए।", text);
  }

  /* =====================================================
     QUESTION HANDLER (concise, deterministic)
     Always returns a short string
  ===================================================== */
  answerQuestion(text) {
    // Identification / name
    if (
      this.includesAny(text, ["तुम", "आप", "अंजली"]) &&
      this.includesAny(text, ["कौन", "नाम"])
    ) {
      return "मेरा नाम अंजली है।";
    }

    // App-related
    if (this.includesAny(text, ["एप", "ऐप", "प्रोग्राम"])) {
      return "यह एक नियम-आधारित संवाद एप है जो प्रश्न के अनुसार उत्तर देता है।";
    }

    // Why / क्यों — ask for context (short)
    if (text.includes("क्यों")) {
      return "क्यों का उत्तर कारण पर निर्भर करता है; क्या आप विषय स्पष्ट कर सकती हैं?";
    }

    // How / कैसे — ask for scope (short)
    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया पर निर्भर करता है; कृपया बताइए किस हिस्से के बारे में?";
    }

    // What / क्या — request clarification (short)
    if (text.includes("क्या")) {
      return "कृपया प्रश्न को थोड़ा और स्पष्ट करें ताकि मैं सटीक उत्तर दे सकूँ।";
    }

    // When/Where/Who
    if (this.includesAny(text, ["कब", "कहाँ", "कौन"])) {
      return "इस प्रश्न का उत्तर देने के लिए संदर्भ आवश्यक है; कृपया पूरा प्रश्न बताइए।";
    }

    // Guaranteed fallback
    return "आपका प्रश्न समझ में आ रहा है, पर विषय स्पष्ट नहीं है।";
  }

  /* =====================================================
     PERSONALITY APPLICATION (ALL 6 TRAITS — voice-safe)
     - Always keep base answer concise
     - Append at most one short trait-based clause to avoid long utterances
  ===================================================== */
  applyPersonality(baseAnswer, originalText) {
    // defensive guards
    if (typeof baseAnswer !== "string" || baseAnswer.trim() === "") {
      baseAnswer = "मैं आपकी बात समझने की कोशिश कर रही हूँ।";
    }
    const text = (typeof originalText === "string") ? originalText : "";

    const {
      EmotionalTraits = {},
      MentalTraits = {},
      LoveTraits = {},
      EthicalTraits = {},
      SpiritualTraits = {},
      PracticalTraits = {}
    } = PersonalityEngine || {};

    // Ensure baseAnswer remains short. Normalize whitespace.
    let final = baseAnswer.trim();

    // Decide one short append clause (priority order: Ethical -> Practical -> Spiritual)
    let append = "";

    if (this.includesAny(text, ["सही", "गलत", "नैतिक", "मर्यादा", "ईमान"]) && EthicalTraits && Object.keys(EthicalTraits).length) {
      append = " निर्णय में ईमानदारी व मर्यादा का ध्यान रखें।";
    } else if (this.includesAny(text, ["उपाय", "समाधान", "कैसे करूँ", "व्यवहार"]) && PracticalTraits && Object.keys(PracticalTraits).length) {
      append = " व्यवहारिक रूप से वह करें जो संभव और संतुलित हो।";
    } else if (this.includesAny(text, ["आत्मा", "अर्थ", "जीवन", "कर्म", "आध्यात्म"]) && SpiritualTraits && Object.keys(SpiritualTraits).length) {
      append = " यह खोज समझ व आत्मिक संतुलन से होती है।";
    }

    // Tone adjustments (light-touch — do not lengthen answer)
    // If emotional empathy exists and baseAnswer is neutral, optionally soften start (but short)
    if (!append && EmotionalTraits && EmotionalTraits.empathy && EmotionalTraits.sensitivity) {
      // Only prefix a very short softener if the baseAnswer is a clarification or fallback
      const lower = final.toLowerCase?.() || "";
      if (lower.includes("कृपया") || lower.includes("साफ") || lower.includes("स्पष्ट")) {
        final = "मैं समझना चाहती हूँ। " + final;
      }
    }

    // Apply love/respect & mental clarity considerations (no change in length)
    // (kept as design placeholders to make integration obvious and testable)
    if (LoveTraits && LoveTraits.respect) {
      // no-op; reserved for future lightweight phrasing rules
    }
    if (MentalTraits && MentalTraits.clearCommunication) {
      // no-op; ensures baseAnswer is expected to be clear
    }

    // Append chosen short clause once (keeps utterance short)
    if (append) {
      final = (final + append).trim();
    }

    // Final safety: Limit length to a reasonable size (approx 220 chars)
    if (final.length > 220) {
      final = final.slice(0, 217).trim() + "...";
    }

    return final;
  }

  /* =====================================================
     HELPERS (deterministic, fast)
  ===================================================== */
  isQuestion(text) {
    return (
      text.endsWith("?") ||
      this.includesAny(text, ["क्या", "क्यों", "कैसे", "कब", "कहाँ", "कौन"])
    );
  }

  includesAny(text, words) {
    if (typeof text !== "string") return false;
    return words.some(word => text.includes(word));
  }
  }
