// LearningUI.js
// Responsibility:
// - Learning Mode UI संभालना
// - 1000 Q-A तक parse करके UserTeachingStore में सहेजना
// Voice-Safe | Deterministic | No AI/ML

import { UserTeachingStore } from "./UserTeachingStore.js";

const openBtn   = document.getElementById("openLearning");
const closeBtn  = document.getElementById("closeLearning");
const panel     = document.getElementById("learningPanel");
const textarea  = document.getElementById("learningInput");
const saveBtn   = document.getElementById("saveLearning");
const statusBox = document.getElementById("learningStatus");

openBtn.addEventListener("click", () => {
  panel.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  panel.style.display = "none";
  statusBox.textContent = "";
});

saveBtn.addEventListener("click", () => {
  const text = textarea.value;
  if (!text || text.trim() === "") {
    statusBox.textContent = "कुछ भी सिखाया नहीं गया।";
    return;
  }

  const lines = text.split("\n");
  let q = null;
  let count = 0;

  for (let line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("Q:")) {
      q = trimmed.slice(2).trim();
    } else if (trimmed.startsWith("A:") && q) {
      const a = trimmed.slice(2).trim();
      if (UserTeachingStore.add(q, a)) {
        count += 1;
      }
      q = null;
      if (count >= 1000) break;
    }
  }

  statusBox.textContent = `सीख सहेजी गई: ${count} प्रश्न–उत्तर`;
  textarea.value = "";
});
