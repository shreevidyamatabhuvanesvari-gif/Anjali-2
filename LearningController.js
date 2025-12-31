// LearningController.js

export class LearningController {

  learn(input) {
    const text = input.trim();

    // 1️⃣ प्रश्न पहचान
    if (this.isQuestion(text)) {
      return this.respondToQuestion(text);
    }

    // 2️⃣ भावनात्मक स्थिति पहचान
    if (this.isSad(text)) {
      return "मैं समझ रही हूँ अनुज, लगता है यह बात आपको भीतर से छू रही है। चाहें तो विस्तार से बताइए।";
    }

    if (this.isHappy(text)) {
      return "यह सुनकर अच्छा लगा अनुज। आपकी बातों में आज सकारात्मकता महसूस हो रही है।";
    }

    // 3️⃣ सामान्य कथन
    return "मैं आपकी बात समझ रही हूँ अनुज। आगे बोलिए, मैं सुन रही हूँ।";
  }

  /* ---------- Helper Rules ---------- */

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

  respondToQuestion(text) {
    return "आपका प्रश्न महत्वपूर्ण है अनुज। इस पर मैं सोच रही हूँ, आप थोड़ा और स्पष्ट करेंगे?";
  }
}
