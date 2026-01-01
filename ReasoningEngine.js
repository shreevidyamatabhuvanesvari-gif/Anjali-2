// ReasoningEngine.js
// FINAL FIXED CORE
// Intent-first reasoning (NO generic loop)

export class ReasoningEngine {

  think(input) {
    if (typeof input !== "string") {
      return "मैं आपकी बात समझ नहीं पाई।";
    }

    const text = input.trim();
    if (text === "") {
      return "आप कुछ कहना चाह रहे हैं।";
    }

    /* =========================
       1️⃣ FACT / DEFINITION
    ========================= */
    if (this.hasAny(text, ["क्या है", "क्या होता", "अर्थ"])) {
      if (text.includes("सही") || text.includes("गलत")) {
        return "सही और गलत वह होता है जिससे किसी को अनावश्यक पीड़ा न पहुँचे और आत्मसम्मान बना रहे।";
      }
    }

    /* =========================
       2️⃣ WHY / HOW (REASONING)
    ========================= */
    if (text.includes("क्यों")) {
      return "क्यों का उत्तर कारण में होता है, लेकिन कारण समझने के लिए परिस्थिति जानना ज़रूरी है।";
    }

    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया में होता है। पहले स्थिति समझिए, फिर शांत होकर कदम तय कीजिए।";
    }

    /* =========================
       3️⃣ IDENTITY
    ========================= */
    if (
      this.hasAny(text, ["तुम", "आप", "अंजली"]) &&
      this.hasAny(text, ["कौन", "नाम"])
    ) {
      return "मैं अंजली हूँ। मैं केवल सुनती नहीं, समझने की कोशिश भी करती हूँ।";
    }

    /* =========================
       4️⃣ EMOTIONAL
    ========================= */
    if (this.hasAny(text, ["परेशान", "दुखी", "अकेला", "थक"])) {
      return "यह कहना आसान नहीं होता। आपकी बात महत्वपूर्ण है, आप चाहें तो और बताइए।";
    }

    /* =========================
       5️⃣ FINAL FALLBACK (RARE)
    ========================= */
    return "आप जो कह रहे हैं, उस पर मैं ध्यान दे रही हूँ। थोड़ा और स्पष्ट करेंगे?";
  }

  hasAny(text, words) {
    return words.some(w => text.includes(w));
  }
}
