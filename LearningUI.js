import { LearningStorage } from "./LearningStorage.js";
import { ResponseResolver } from "./ResponseResolver.js";

document.addEventListener("DOMContentLoaded", () => {

  const storage  = new LearningStorage();
  const resolver = new ResponseResolver();

  const openBtn   = document.getElementById("openLearning");
  const panel     = document.getElementById("learningPanel");
  const closeBtn  = document.getElementById("closeLearning");
  const saveBtn   = document.getElementById("saveLearning");
  const inputBox  = document.getElementById("learningInput");
  const statusBox = document.getElementById("learningStatus");

  if (!openBtn || !panel || !closeBtn || !saveBtn || !inputBox || !statusBox) {
    console.error("LearningUI: required elements missing");
    return;
  }

  openBtn.addEventListener("click", () => {
    document.getElementById("learningViewerPanel")?.classList.remove("show");
    panel.classList.add("show");
    statusBox.textContent = "";
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
  });

  saveBtn.addEventListener("click", () => {
    const rawText = inputBox.value.trim();
    if (!rawText) {
      statusBox.textContent = "कृपया प्रश्न–उत्तर लिखें।";
      return;
    }

    const lines = rawText.split("\n");
    let q = null;
    let count = 0;

    lines.forEach(line => {
      const t = line.trim();
      if (t.startsWith("Q:")) q = t.slice(2).trim();
      else if (t.startsWith("A:") && q) {
        const a = t.slice(2).trim();
        if (a) {
          storage.saveQA(q, a, "user");
          resolver.addLearnedQA(q, a);
          count++;
          q = null;
        }
      }
    });

    statusBox.textContent =
      count ? `${count} प्रश्न–उत्तर सहेजे गए।` :
      "Q:/A: फ़ॉर्मेट सही नहीं है।";

    if (count) inputBox.value = "";
  });

});
