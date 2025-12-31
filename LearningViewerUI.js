import { LearningStorage } from "./LearningStorage.js";

document.addEventListener("DOMContentLoaded", () => {

  const storage = new LearningStorage();

  const openBtn  = document.getElementById("viewLearning");
  const panel    = document.getElementById("learningViewerPanel");
  const closeBtn = document.getElementById("closeViewer");
  const listBox  = document.getElementById("learningList");

  if (!openBtn || !panel || !closeBtn || !listBox) {
    console.error("LearningViewerUI: required elements missing");
    return;
  }

  openBtn.addEventListener("click", () => {
    document.getElementById("learningPanel")?.classList.remove("show");
    panel.classList.add("show");
    render();
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
  });

  function render() {
    listBox.innerHTML = "";
    storage.getAll(items => {
      if (!items.length) {
        listBox.innerHTML = "<p>अभी कोई प्रश्न–उत्तर सहेजा नहीं गया है।</p>";
        return;
      }
      items.forEach((it, i) => {
        const d = document.createElement("div");
        d.style.borderBottom = "1px solid #ddd";
        d.style.padding = "10px 0";
        d.innerHTML = `<b>${i+1}. Q:</b> ${it.question}<br><b>A:</b> ${it.answer}`;
        listBox.appendChild(d);
      });
    });
  }

});
