// LearningViewerUI.js
// Responsibility:
// - संग्रहीत प्रश्न–उत्तर की सूची दिखाना
// - LearningStorage से पढ़कर UI में render करना
// UI-only | Voice-safe | No logic | No guessing

import { LearningStorage } from "./LearningStorage.js";

const storage = new LearningStorage();

/* ===============================
   DOM ELEMENTS
=============================== */
const openBtn   = document.getElementById("viewLearning");
const panel     = document.getElementById("learningViewerPanel");
const closeBtn  = document.getElementById("closeViewer");
const listBox   = document.getElementById("learningList");

/* ===============================
   SAFETY CHECK (HARD)
=============================== */
if (!openBtn || !panel || !closeBtn || !listBox) {
  console.warn("LearningViewerUI disabled: required elements missing");
} else {

  /* ===============================
     OPEN VIEWER
  =============================== */
  openBtn.addEventListener("click", () => {
    panel.style.display = "block";
    renderList();
  });

  /* ===============================
     CLOSE VIEWER
  =============================== */
  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });
}

/* ===============================
   RENDER LIST
=============================== */
function renderList() {
  listBox.innerHTML = "";

  storage.getAll((items) => {
    if (!items || items.length === 0) {
      listBox.innerHTML = "<p>अभी कोई प्रश्न–उत्तर सहेजा नहीं गया है।</p>";
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement("div");
      row.style.borderBottom = "1px solid #ddd";
      row.style.padding = "10px 0";

      row.innerHTML = `
        <div style="font-weight:600;">${index + 1}. Q: ${item.question}</div>
        <div style="margin-top:4px;">A: ${item.answer}</div>
        <div style="font-size:12px;color:#777;margin-top:2px;">
          विषय: ${item.topic || "general"}
        </div>
      `;

      listBox.appendChild(row);
    });
  });
}
