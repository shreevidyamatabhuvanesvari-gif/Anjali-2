// ReasoningEngine.js
// PRIMARY BRAIN + ANALYSIS

import { AnalysisEngine } from "./AnalysisEngine.js";

export class ReasoningEngine {

  constructor() {
    this.analyzer = new AnalysisEngine();
  }

  think(input) {
    if (typeof input !== "string") {
      return "मैं आपकी बात समझ नहीं पाई।";
    }

    const text = input.trim();
    if (text === "") {
      return "आप कुछ कहना चाह रहे हैं।";
    }

    const analysis = this.analyzer.analyze(text);

    /* =========================
       IDENTITY
    ========================= */
    if (
      this.hasAny(text, ["तुम", "आप", "अंजली"]) &&
      this.hasAny(text, ["कौन", "नाम"])
    ) {
      return "मैं अंजली हूँ। मैं सुनती भी हूँ और सोचकर उत्तर देने की कोशिश करती हूँ।";
    }

    /* =========================
       ANALYTICAL WHY
    ========================= */
    if (analysis.isWhy) {
      return (
        "किसी भी कारण को समझने के लिए तीन बातें देखी जाती हैं:\n" +
        "पहला, परिस्थिति।\n" +
        "दूसरा, भावनाएँ।\n" +
        "तीसरा, निर्णय।\n" +
        "आप किस संदर्भ में पूछ रहे हैं?"
      );
    }

    /* =========================
       EMOTIONAL + ANALYSIS
    ========================= */
    if (analysis.isEmotional) {
      return (
        "आप जो महसूस कर रहे हैं, वह किसी स्थिति का परिणाम हो सकता है।\n" +
        "यदि आप चाहें, तो हम पहले स्थिति समझ सकते हैं और फिर समाधान पर जाएँ।"
      );
    }

    /* =========================
       MORAL / DECISION
    ========================= */
    if (analysis.isDecision) {
      return (
        "निर्णय लेते समय तीन आधार होते हैं:\n" +
        "1) आत्मसम्मान\n" +
        "2) दीर्घकालिक परिणाम\n" +
        "3) किसी को अनावश्यक चोट न पहुँचना\n" +
        "आप किस निर्णय को लेकर उलझन में हैं?"
      );
    }

    /* =========================
       DEFAULT
    ========================= */
    return "मैं आपकी बात समझने की कोशिश कर रही हूँ। आप थोड़ा और बताएँ।";
  }

  hasAny(text, words) {
    return words.some(w => text.includes(w));
  }
}
