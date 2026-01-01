// UltraFastAnalyzer.js
// PURPOSE: मिलीसेकंड-स्तर विश्लेषण

export class UltraFastAnalyzer {

  analyze(text) {
    const t = text;

    if (this.hasAny(t, ["क्यों"])) {
      return { type: "WHY", depth: 2 };
    }

    if (this.hasAny(t, ["क्या करूँ", "निर्णय"])) {
      return { type: "DECISION", depth: 3 };
    }

    if (this.hasAny(t, ["दुखी", "परेशान", "अकेला"])) {
      return { type: "EMOTION", depth: 3 };
    }

    if (this.hasAny(t, ["कौन", "नाम"])) {
      return { type: "IDENTITY", depth: 1 };
    }

    return { type: "GENERAL", depth: 1 };
  }

  hasAny(text, words) {
    return words.some(w => text.includes(w));
  }
}
