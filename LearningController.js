// LearningController.js
// Responsibility: प्रश्न समझना और उपयुक्त उत्तर देना
// NO voice, NO memory, ONLY thinking logic

export class LearningController {

  learn(input) {
    if (!input || typeof input !== "string") {
      return "मैं आपकी बात समझ नहीं पाई, कृपया फिर से कहिए।";
    }

    const text = input.trim();

    // 1️⃣ प्रश्न पहचान
    if (this.isQuestion(text)) {
      return this.answerQuestion(text);
    }

    // 2️⃣ भाव पहचान
    if (this.isSad(text)) {
      return "लगता है यह बात आपको दुखी कर रही है। मैं आपकी बात ध्यान से सुन रही हूँ।";
    }

    if (this.isHappy(text)) {
      return "यह सुनकर अच्छा लगा। आपकी बातों में सकारात्मकता है।";
    }

    // 3️⃣ सामान्य उत्तर
    return "मैं आपकी बात समझ रही हूँ। आगे बताइए।";
  }

  /* ---------- Question Handling ---------- */

  answerQuestion(text) {
    if (text.includes("क्यों")) {
      return "क्यों का उत्तर अक्सर कारणों में छिपा होता है। आप पूरा संदर्भ बताएँगे?";
    }

    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया से जुड़ा होता है। आप किस हिस्से के बारे में जानना चाहते हैं?";
    }

    if (text.includes("क्या")) {
      return "आप जो पूछ रहे हैं वह महत्वपूर्ण है। कृपया थोड़ा और स्पष्ट करें।";
    }

    // fallback (कम ही आएगा)
    return "आपका प्रश्न समझ में आ रहा है। मैं सोचकर उत्तर देने की कोशिश कर रही हूँ।";
  }

  /* ---------- Helpers ---------- */

  isQuestion(text) {
    return (
      text.endsWith("?") ||
      text.includes("क्या") ||
      text.includes("क्यों") ||
      text.includes("कैसे")
    );
  }

  isSad(text) {
    const sadWords = ["दुख", "परेशान", "थक", "अकेला", "उदास", "भारी"];
    return sadWords.some(word => text.includes(word));
  }

  isHappy(text) {
    const happyWords = ["खुश", "अच्छा", "प्रसन्न", "मज़ा", "संतोष"];
    return happyWords.some(word => text.includes(word));
  }
}
