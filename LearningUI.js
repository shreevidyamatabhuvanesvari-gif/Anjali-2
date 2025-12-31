// LearningUI.js
// Responsibility:
// - User द्वारा सिखाए गए प्रश्न–उत्तर को पढ़ना
// - उन्हें LearningStorage में सुरक्षित रूप से सहेजना
// - Modal (.show class) के माध्यम से UI खोलना/बंद करना
// UI-only | Deterministic | Voice-safe | No guessing

import { LearningStorage } from "./LearningStorage.js";
import { ResponseResolver } from "./ResponseResolver.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CORE INSTANCES
  =============================== */
  const storage  = new LearningStorage();
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
    return; // 🔒 आगे कुछ नहीं चलेगा
  }

  /* ===============================
     OPEN LEARNING MODAL
  =============================== */
  openBtn.addEventListener("click", () => {
    panel.classList.add("show");   // 🔑 modal-safe open
    statusBox.textContent = "";
  });

  /* ===============================
     CLOSE LEARNING MODAL
  =============================== */
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("show"); // 🔑 modal-safe close
  });

  /* ===============================
     SAVE LEARNING (Q/A)
  =============================== */
  saveBtn.addEventListener("click", () => {

    const rawText = inputBox.value;

    if (typeof rawText !== "string" || rawText.trim() === "") {
      statusBox.textContent = "कृपया प्रश्न–उत्तर लिखें।";
      return;
    }

    const lines = rawText.split("\n");

    let currentQ   = null;
    let savedCount = 0;

    lines.forEach(line => {
      const text = line.trim();

      // प्रश्न
      if (text.startsWith("Q:")) {
        currentQ = text.substring(2).trim();
      }

      // उत्तर
      else if (text.startsWith("A:") && currentQ) {
        const answer = text.substring(2).trim();

        if (answer !== "") {
          // IndexedDB में सुरक्षित करें
          storage.saveQA(currentQ, answer, "user");

          // Runtime resolver cache में भी डालें
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
