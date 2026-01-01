// ReasoningEngine.js
// A-1.1 FINAL
// Responsibility:
// - कच्चे उत्तर को "अंजली-जैसी सोच" में बदलना
// - Emotion + Love + Ethics + Mind का सुरक्षित संयोजन
// GUARANTEE:
// - हमेशा string लौटाएगा
// - कोई async नहीं
// - voice-safe

import { EmotionCore } from "./EmotionEngine/EmotionCore.js";
import { LoveCore } from "./LoveEngine/LoveCore.js";
import { EthicsCore } from "./EthicsEngine/EthicsCore.js";
import { MindCore } from "./MindEngine/MindCore.js";

export class ReasoningEngine {

  /**
   * @param {string} intent   // प्रश्न का आशय (WHY / WHAT / EMOTION / GENERAL)
   * @param {string} base     // तथ्यात्मक / कच्चा उत्तर
   * @returns {string}        // अंतिम उत्तर (अंजली की वाणी)
   */
  static reason(intent, base) {

    // 🔒 Absolute safety
    if (typeof base !== "string" || base.trim() === "") {
      return "मैं आपकी बात समझने की कोशिश कर रही हूँ। आप थोड़ा और बताइए।";
    }

    let answer = base.trim();

    /* =========================
       1️⃣ Emotion Layer
    ========================= */
    if (EmotionCore.empathy && intent === "EMOTION") {
      answer =
        "मैं समझ सकती हूँ कि यह प्रश्न आपके मन से जुड़ा है। " + answer;
    }

    /* =========================
       2️⃣ Love Layer
    ========================= */
    if (LoveCore.respect) {
      answer =
        answer.replace(/^/, "आपके भाव का सम्मान करते हुए, ");
    }

    /* =========================
       3️⃣ Ethics Layer
    ========================= */
    if (EthicsCore.honesty && intent === "ETHICAL") {
      answer =
        answer +
        " नैतिक रूप से वही सही होता है जिससे किसी का अपमान न हो।";
    }

    /* =========================
       4️⃣ Mind Layer
    ========================= */
    if (MindCore.patience) {
      answer =
        answer +
        " इसे शांति से समझना सबसे बेहतर होता है।";
    }

    return answer;
  }
}
