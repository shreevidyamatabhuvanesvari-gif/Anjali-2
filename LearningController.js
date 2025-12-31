// LearningController.js

export class LearningController {

  learn(input) {
    const text = input.trim();

    // प्रश्न पहचान
    if (this.isQuestion(text)) {
      return this.handleQuestion(text);
    }

    // भाव पहचान
    if (this.isSad(text)) {
      return "मैं समझ रही हूँ अनुज, यह बात आपको परेशान कर रही है। चाहें तो विस्तार से बताइए।";
    }

    if (this.isHappy(text)) {
      return "यह सुनकर अच्छा लगा अनुज। आपकी बातों में सकारात्मकता है।";
    }

    // सामान्य कथन
    return "मैं आपकी बात ध्यान से सुन रही हूँ अनुज। आगे बोलिए।";
  }

  /* ---------- Question Handling ---------- */

  handleQuestion(text) {
    if (text.includes("क्यों")) {
      return "क्यों का उत्तर अक्सर कारणों में छिपा होता है अनुज। आप पूरा संदर्भ बताएँगे?";
    }

    if (text.includes("कैसे")) {
      return "कैसे का उत्तर प्रक्रिया से जुड़ा होता है अनुज। आप किस हिस्से पर जानना चाहते हैं?";
    }

    if (text.includes("क्या")) {
      return "आप जो जानना चाहते हैं वह स्पष्ट है अनुज। कृपया थोड़ा और संदर्भ जोड़ें।";
    }

    // केवल अज्ञात प्रश्न के लिए
    return "आपका प्रश्न महत्वपूर्ण है अनुज। इसे समझने के लिए मुझे थोड़ा और स्पष्ट विवरण चाहिए।";
  }

  /* ---------- Helpers ---------- */

  isQuestion(text) {
    return text.endsWith("?") ||
           text.includes("क्या") ||
           text.includes("क्यों") ||
           text.includes("कैसे");
  }

  isSad(text) {
    const sadWords = ["दुख", "परेशान", "थक", "अकेला", "उदास", "भारी"];
    return sadWords.some(word => text.includes(word));
  }

  isHappy(text) {
    const happyWords = ["खुश", "अच्छा", "संतोष", "प्रसन्न", "मज़ा"];
    return happyWords.some(word => text.includes(word));
  }
}
