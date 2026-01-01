document.getElementById("learnSave").onclick = async () => {
  const msg = document.getElementById("learnMsg");

  try {
    await KnowledgeBase.init();

    const data = {
      question: document.getElementById("learnQuestion").value.trim(),
      answer: document.getElementById("learnAnswer").value.trim(),
      tags: document.getElementById("learnTags").value
        .split(",").map(s => s.trim()).filter(Boolean)
    };

    if (!data.question || !data.answer) {
      msg.textContent = "प्रश्न और उत्तर अनिवार्य हैं।";
      return;
    }

    await KnowledgeBase.saveOne(data);
    msg.style.color = "#9fdf9f";
    msg.textContent = "प्रश्न–उत्तर स्थायी रूप से सेव हो गया।";

  } catch (e) {
    msg.style.color = "#ff9f9f";
    msg.textContent = "सेव करने में त्रुटि हुई।";
  }
};
