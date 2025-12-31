// LearningController.js
// Responsibility: प्रश्न के अनुसार सटीक उत्तर देना
// Rule-based, no AI/ML, no guessing

export class LearningController {

  learn(input) {
    if (typeof input !== "string" || input.trim() === "") {
      return "कृपया अपना प्रश्न स्पष्ट रूप से पूछिए।";
    }

    const text = input.trim();

    // 1️⃣ प्रश्न पहचान
    if (this.isQuestion(text)) {
      return this.answerQuestion(text);
    }

    // 2️⃣ सामान्य कथन
    return "मैं सुन रही हूँ। यदि कोई प्रश्न है तो स्पष्ट पूछिए।";
  }

  /* =====================================================
     QUESTION HANDLER
  ===================================================== */

  answerQuestion(text) {

    // --- पहचान / नाम ---
    if (this.includesAny(text, ["तुम", "आप", "अंजली"]) &&
        this.includesAny(text, ["कौन", "नाम"])) {
      return "मेरा नाम अंजली है।";
    }

    // --- एप से संबंधित ---
    if (this.includesAny(text, ["एप", "ऐप", "प्रोग्राम"])) {
      return "यह एक संवाद करने वाला एप है, जो आपकी बात सुनकर उत्तर देता है।";
    }

    // --- क्यों ---
    if (text.includes("क्यों")) {
      return "क्यों का उत्तर कारण पर निर्भर करता है। कृपया जिस विषय पर पूछ रहे हैं, उसे स्पष्ट करें।";
    }

    // --- कैसे ---
    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया से जुड़ा होता है। आप किस प्रक्रिया के बारे में जानना चाहते हैं?";
    }

    // --- क्या ---
    if (text.includes("क्या")) {
      return "आप जो पूछ रहे हैं, उसका उत्तर विषय पर निर्भर है। कृपया थोड़ा और स्पष्ट करें।";
    }

    // --- कब / कहाँ / कौन ---
    if (this.includesAny(text, ["कब", "कहाँ", "कौन"])) {
      return "इस प्रश्न का उत्तर देने के लिए संदर्भ आवश्यक है। कृपया पूरा प्रश्न बताइए।";
    }

    // --- fallback (बहुत कम आएगा) ---
    return "आपका प्रश्न समझ में आ रहा है, लेकिन विषय स्पष्ट नहीं है।";
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
