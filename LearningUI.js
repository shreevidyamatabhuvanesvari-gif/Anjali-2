// LearningUI.js
// Responsibility:
// - User द्वारा सिखाए गए प्रश्न–उत्तर को पढ़ना
// - उन्हें LearningStorage में सुरक्षित रूप से सहेजना
// - साथ ही ReasoningGraphStore में भी दर्ज करना
// UI-only | Deterministic | Voice-safe | No guessing

import { LearningStorage } from "./LearningStorage.js";
import { ResponseResolver } from "./ResponseResolver.js";
import { LearningReasoningBridge } from "./LearningReasoningBridge.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CORE INSTANCES
  =============================== */
  const storage  = new LearningStorage();
  const resolver = new ResponseResolver();
  const lrBridge = new LearningReasoningBridge();

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
     HARD SAFETY CHECK
  =============================== */
  if (
    !openBtn ||
    !panel ||
    !closeBtn ||
    !saveBtn ||
    !inputBox ||
    !statusBox
  ) {
    console.error("LearningUI disabled: required DOM elements missing");
    return;
  }

  /* ===============================
     OPEN LEARNING MODAL
  =============================== */
  openBtn.addEventListener("click", () => {
    document.getElementById("learningViewerPanel")?.classList.remove("show");
    panel.classList.add("show");
    statusBox.textContent = "";
  });

  /* ===============================
     CLOSE LEARNING MODAL
  =============================== */
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
  });

  /* ===============================
     SAVE LEARNING (Q/A)
  =============================== */
  saveBtn.addEventListener("click", () => {

    const rawText = inputBox.value.trim();

    if (!rawText) {
      statusBox.textContent = "कृपया प्रश्न–उत्तर लिखें।";
      return;
    }

    const lines = rawText.split("\n");

    let currentQ = null;
    let savedCount = 0;

    lines.forEach(line => {
      const text = line.trim();

      // प्रश्न
      if (text.startsWith("Q:")) {
        currentQ = text.slice(2).trim();
      }

      // उत्तर
      else if (text.startsWith("A:") && currentQ) {
        const answer = text.slice(2).trim();

        if (answer) {
          // 1️⃣ IndexedDB में सहेजें
          storage.saveQA(currentQ, answer, "user");

          // 2️⃣ Runtime resolver cache
          resolver.addLearnedQA(currentQ, answer);

          // 3️⃣ Reasoning Graph में जोड़ें
          lrBridge.onLearnedQA(currentQ, answer);

          savedCount++;
          currentQ = null;
        }
      }
    });

    statusBox.textContent = savedCount
      ? `${savedCount} प्रश्न–उत्तर सफलतापूर्वक सहेजे गए।`
      : "Q:/A: फ़ॉर्मेट सही नहीं है।";

    if (savedCount) {
      inputBox.value = "";
    }
  });

});
