// AnalysisMemory.js
// DEPTH-3 ANALYSIS MEMORY (FAST, OFFLINE)
// Deterministic | Voice-safe | No async

export class AnalysisMemory {
  constructor() {
    this.cache = [];
    this.MAX = 50; // तेज़ी के लिए सीमित इतिहास (last 50 turns)
  }

  push(entry) {
    if (!entry || typeof entry.text !== "string") return;

    this.cache.push({
      text: entry.text,
      intent: entry.intent || "UNKNOWN",
      emotion: entry.emotion || null,
      time: Date.now()
    });

    if (this.cache.length > this.MAX) {
      this.cache.shift();
    }
  }

  // हाल की भावनात्मक तीव्रता
  recentEmotionScore() {
    const recent = this.cache.slice(-5);
    let score = 0;

    recent.forEach(e => {
      if (e.emotion === "NEGATIVE") score += 2;
      if (e.emotion === "POSITIVE") score += 1;
    });

    return score; // 0–10
  }

  // क्या यूज़र लगातार "क्यों/कैसे" में अटका है?
  isStuckInWhyHow() {
    const recent = this.cache.slice(-4);
    return recent.filter(e =>
      e.intent === "WHY" || e.intent === "HOW"
    ).length >= 2;
  }
}
