/* =========================================================
   admin_learning_ui.js
   Role: Admin Learning Box (UI only)
   Stage: 4
   ========================================================= */

(function () {
  "use strict";

  // --- Create Learning Modal ---
  const modal = document.createElement("div");
  modal.id = "learningModal";
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    display:none; align-items:center; justify-content:center; z-index:9999;
  `;

  modal.innerHTML = `
    <div style="
      width:94%; max-width:560px; background:#1e1e1e; color:#eee;
      border-radius:18px; padding:16px; box-shadow:0 18px 40px rgba(0,0,0,.6)
    ">
      <h3 style="margin:0 0 10px; color:#ffd6d6;">🧠 सीखने का बॉक्स</h3>

      <div style="display:grid; gap:8px;">
        <input id="learnSubject" placeholder="विषय"
          style="padding:10px; border-radius:10px; border:1px solid #333; background:#121212; color:#eee;">
        <input id="learnTopic" placeholder="उपविषय"
          style="padding:10px; border-radius:10px; border:1px solid #333; background:#121212; color:#eee;">
        <textarea id="learnQuestion" placeholder="प्रश्न"
          style="padding:10px; border-radius:10px; border:1px solid #333; background:#121212; color:#eee; min-height:70px;"></textarea>
        <textarea id="learnAnswer" placeholder="उत्तर"
          style="padding:10px; border-radius:10px; border:1px solid #333; background:#121212; color:#eee; min-height:70px;"></textarea>
        <input id="learnTags" placeholder="टैग (कॉमा से अलग करें)"
          style="padding:10px; border-radius:10px; border:1px solid #333; background:#121212; color:#eee;">
      </div>

      <div style="display:flex; gap:8px; margin-top:12px; justify-content:flex-end;">
        <button id="learnCancel" style="
          padding:10px 12px; border-radius:12px; background:#2a2a2a; color:#eee; border:1px solid #333;
        ">रद्द</button>
        <button id="learnSave" style="
          padding:10px 12px; border-radius:12px; background:linear-gradient(180deg,#ffd6d6,#ffb3b3);
          color:#1b1b1b; border:none;
        ">सेव करें</button>
      </div>

      <div id="learnMsg" style="margin-top:8px; font-size:12px; color:#9fdf9f;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // --- Open / Close Handlers ---
  const openBtn = document.getElementById("openLearningUI");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      document.getElementById("learnMsg").textContent = "";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("learnCancel").onclick = () => {
    modal.style.display = "none";
  };

  // --- Save (UI-only; storage will be wired in KnowledgeBase.js) ---
  document.getElementById("learnSave").onclick = () => {
    const data = {
      subject: document.getElementById("learnSubject").value.trim(),
      topic: document.getElementById("learnTopic").value.trim(),
      question: document.getElementById("learnQuestion").value.trim(),
      answer: document.getElementById("learnAnswer").value.trim(),
      tags: document.getElementById("learnTags").value.split(",").map(s=>s.trim()).filter(Boolean),
      time: Date.now()
    };

    if (!data.subject || !data.question || !data.answer) {
      document.getElementById("learnMsg").style.color = "#ff9f9f";
      document.getElementById("learnMsg").textContent = "विषय, प्रश्न और उत्तर अनिवार्य हैं।";
      return;
    }

    // अभी केवल पुष्टि (स्टोरेज अगली फाइल में जुड़ेगा)
    document.getElementById("learnMsg").style.color = "#9fdf9f";
    document.getElementById("learnMsg").textContent = "सीख सुरक्षित की गई (UI Ready).";

    // Clear minimal
    document.getElementById("learnQuestion").value = "";
    document.getElementById("learnAnswer").value = "";
  };
})();
