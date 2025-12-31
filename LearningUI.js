// LearningUI.js
// Responsibility:
// - User द्वारा सिखाए गए प्रश्न–उत्तर को पढ़ना
// - उन्हें LearningStorage में सुरक्षित रूप से सहेजना
// UI-only | Deterministic | Voice-safe | No guessing

import { LearningStorage } from "./LearningStorage.js";
import { ResponseResolver } from "./ResponseResolver.js";

document.addEventListener("DOMContentLoaded", () => {

  const storage = new LearningStorage();
  const resolver = new ResponseResolver();

  /* ===============================
     DOM ELEMENTS
  =============================== */
  const openBtn   = document.getElementById("openLearning");
  const panel     = document.getElementById("learningPanel");
  const closeBtn  = document.getElementById("closeLearning");
  const saveBtn   = document.getElementById("saveLearning");
  const inputBox  = document.getElementById("learningInput");
  const statusBox = document.getElementById("learningStatus");

  /* ===============================
     HARD SAFETY CHECK (NO SILENT FAIL)
  =============================== */
  if (!openBtn || !panel || !closeBtn || !saveBtn || !inputBox || !statusBox) {
    console.error("LearningUI disabled: required DOM elements missing");
    return; // 🔒 यहीं रुक जाए — आगे कुछ नहीं चलेगा
  }

  /* ===============================
     OPEN PANEL
  =============================== */
  openBtn.addEventListener("click", () => {
    panel.style.display = "block";
    statusBox.textContent = "";
  });

  /* ===============================
     CLOSE PANEL
  =============================== */
  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });

  /* ===============================
     SAVE LEARNING
  =============================== */
  saveBtn.addEventListener("click", () => {
    const rawText = inputBox.value;

    if (typeof rawText !== "string" || rawText.trim() === "") {
      statusBox.textContent = "कृपया प्रश्न–उत्तर लिखें।";
      return;
    }

    const lines = rawText.split("\n");

    let currentQ = null;
    let savedCount = 0;

    lines.forEach(line => {
      const text = line.trim();

      if (text.startsWith("Q:")) {
        currentQ = text.substring(2).trim();
      }
      else if (text.startsWith("A:") && currentQ) {
        const answer = text.substring(2).trim();

        if (answer !== "") {
          storage.saveQA(currentQ, answer, "user");

          // तुरंत resolver cache में भी डालें
          resolver.addLearnedQA(currentQ, answer);

          savedCount++;
          currentQ = null;
        }
      }
    });

    if (savedCount === 0) {
      statusBox.textContent =
        "कोई वैध प्रश्न–उत्तर नहीं मिला। Q: / A: फ़ॉर्मेट जाँचें।";
      return;
    }

    statusBox.textContent =
      `${savedCount} प्रश्न–उत्तर सफलतापूर्वक सहेजे गए।`;

    inputBox.value = "";
  });

});
