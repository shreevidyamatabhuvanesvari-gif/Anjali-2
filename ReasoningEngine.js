// ReasoningEngine.js
// ANALYSIS + MEMORY CORE
// Extremely fast | No loops | Deterministic

import { UltraFastAnalyzer } from "./UltraFastAnalyzer.js";
import { AnalysisMemoryStore } from "./AnalysisMemoryStore.js";

export class ReasoningEngine {

  constructor() {
    this.analyzer = new UltraFastAnalyzer();
    this.memory   = new AnalysisMemoryStore();
  }

  think(input) {
    if (typeof input !== "string") {
      return "मैं समझ नहीं पाई।";
    }

    const text = input.trim();
    if (!text) return "आप कुछ कहना चाह रहे हैं।";

    const analysis = this.analyzer.analyze(text);

    // स्मृति में दर्ज करें
    this.memory.remember({
      type: analysis.type,
      text: text,
      time: Date.now()
    });

    // पिछले संदर्भ
    const last = this.memory.last();

    /* =====================
       IDENTITY
    ===================== */
    if (analysis.type === "IDENTITY") {
      return "मैं अंजली हूँ। मैं सुनती, सोचती और याद भी रखती हूँ।";
    }

    /* =====================
       WHY + MEMORY
    ===================== */
    if (analysis.type === "WHY") {
      return (
        "किसी कारण को समझने के लिए हम तीन स्तर देखते हैं:\n" +
        "स्थिति → भावना → निर्णय।\n" +
        "आप किस स्थिति के बारे में पूछ रहे हैं?"
      );
    }

    /* =====================
       EMOTION + CONTEXT
    ===================== */
    if (analysis.type === "EMOTION") {
      return (
        "आप भावनात्मक स्थिति में हैं।\n" +
        "अगर चाहें तो हम पहले कारण समझें और फिर समाधान की ओर जाएँ।"
      );
    }

    /* =====================
       DECISION
    ===================== */
    if (analysis.type === "DECISION") {
      return (
        "निर्णय के लिए तीन कसौटियाँ होती हैं:\n" +
        "1) आत्मसम्मान\n" +
        "2) दीर्घकालिक परिणाम\n" +
        "3) मन की शांति\n" +
        "आप किस निर्णय पर अटके हैं?"
      );
    }

    /* =====================
       CONTEXTUAL FOLLOW-UP
    ===================== */
    if (last && last.type !== "GENERAL") {
      return "आप उसी विषय को आगे बढ़ा रहे हैं। थोड़ा और स्पष्ट करें।";
    }

    return "मैं सुन रही हूँ। आप आगे कह सकते हैं।";
  }
}
