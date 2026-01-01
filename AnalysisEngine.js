// AnalysisEngine.js
// PURPOSE: प्रश्न को तोड़कर सोच का ढांचा बनाना
// Rule-based | Offline | Deterministic

export class AnalysisEngine {

  analyze(text) {
    const result = {
      isProblem: false,
      isEmotional: false,
      isWhy: false,
      isDecision: false
    };

    if (this.hasAny(text, ["क्यों"])) result.isWhy = true;
    if (this.hasAny(text, ["दुखी", "परेशान", "अकेला", "थक"])) result.isEmotional = true;
    if (this.hasAny(text, ["क्या करूँ", "निर्णय", "चुनूँ"])) result.isDecision = true;

    if (result.isWhy || result.isDecision) {
      result.isProblem = true;
    }

    return result;
  }

  hasAny(text, words) {
    return words.some(w => text.includes(w));
  }
}
