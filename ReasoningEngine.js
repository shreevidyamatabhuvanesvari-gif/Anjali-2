// ReasoningEngine.js
// ADVANCED SOLID CORE
// Intent-first | Context-aware | Deterministic | Offline
// NO generic loop | NO async | NO API

export class ReasoningEngine {

  think(input) {
    if (typeof input !== "string") {
      return "मैं आपकी बात समझ नहीं पाई।";
    }

    const text = this.normalize(input);
    if (text === "") {
      return "आप कुछ कहना चाह रहे हैं।";
    }

    /* =========================
       1️⃣ IDENTITY (HIGHEST PRIORITY)
    ========================= */
    if (
      this.hasAny(text, ["तुम", "आप", "अंजली"]) &&
      this.hasAny(text, ["कौन", "नाम"])
    ) {
      return "मैं अंजली हूँ। मैं केवल उत्तर देने के लिए नहीं, आपको समझने के लिए बनी हूँ।";
    }

    /* =========================
       2️⃣ MORAL / DEFINITION
    ========================= */
    if (this.hasAny(text, ["सही", "गलत"])) {
      if (this.hasAny(text, ["क्या", "अर्थ", "मतलब"])) {
        return "सही वह है जिससे किसी को अनावश्यक पीड़ा न पहुँचे, और गलत वह है जो आत्मसम्मान या विश्वास को तोड़े।";
      }
    }

    /* =========================
       3️⃣ WHY / CAUSE
    ========================= */
    if (text.includes("क्यों")) {
      return "हर ‘क्यों’ के पीछे कोई कारण होता है। यदि आप परिस्थिति बताएँ, तो कारण स्पष्ट हो सकता है।";
    }

    /* =========================
       4️⃣ HOW / PROCESS
    ========================= */
    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया में होता है। पहले स्थिति समझना ज़रूरी है, फिर समाधान चुना जाता है।";
    }

    /* =========================
       5️⃣ EMOTIONAL (CONTEXTUAL)
    ========================= */
    if (this.hasAny(text, ["परेशान", "दुखी", "अकेला", "थक", "उलझन"])) {
      return "आप ऐसा महसूस कर रहे हैं, यह महत्वपूर्ण है। मैं यहाँ हूँ — आप चाहें तो धीरे-धीरे सब बता सकते हैं।";
    }

    /* =========================
       6️⃣ TRUST / RELATIONSHIP
    ========================= */
    if (this.hasAny(text, ["भरोसा", "विश्वास", "प्रेम", "रिश्ता"])) {
      return "रिश्तों में सबसे ज़रूरी है ईमानदारी और सम्मान। जहाँ ये होते हैं, वहीं स्थिरता आती है।";
    }

    /* =========================
       7️⃣ SMART FALLBACK (REASONED)
    ========================= */
    return "आप जो कह रहे हैं, उसमें कुछ अर्थ छिपा है। यदि आप थोड़ा और स्पष्ट करें, तो मैं बेहतर समझ पाऊँगी।";
  }

  /* =========================
     HELPERS
  ========================= */

  normalize(text) {
    return text
      .trim()
      .replace(/[?!.]/g, "")
      .replace(/\s+/g, " ");
  }

  hasAny(text, words) {
    return words.some(w => text.includes(w));
  }
}
