/* =========================================================
   admin_learning_ui.js
   Role: Single Learning UI (Admin)
   ========================================================= */

(function () {
  "use strict";

  // ---------- Create Modal ----------
  const modal = document.createElement("div");
  modal.id = "learningModal";
  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:10000;
  `;

  modal.innerHTML = `
    <div style="
      width:94%;
      max-width:560px;
      background:#1e1e1e;
      color:#eee;
      border-radius:18px;
      padding:16px;
      box-shadow:0 18px 40px rgba(0,0,0,.6)
    ">
      <h3 style="margin:0 0 10px; color:#ffd6d6;">
        🧠 सीखने का बॉक्स
      </h3>

      <div style="display:grid; gap:8px;">
        <textarea id="learnQuestion" placeholder="प्रश्न"
          style="min-height:70px; padding:10px;
          border-radius:10px; border:1px solid #333;
          background:#121212; color:#eee;"></textarea>

        <textarea id="learnAnswer" placeholder="उत्तर"
          style="min-height:70px; padding:10px;
          border-radius:10px; border:1px solid #333;
          background:#121212; color:#eee;"></textarea>

        <input id="learnTags" placeholder="टैग (कॉमा से अलग करें)"
          style="padding:10px;
          border-radius:10px; border:1px solid #333;
          background:#121212; color:#eee;">
      </div>

      <div style="display:flex; gap:8px; margin-top:12px; justify-content:flex-end;">
        <button id="learnCancel"
          style="padding:10px 12px; border-radius:12px;
          background:#2a2a2a; color:#eee; border:1px solid #333;">
          रद्द
        </button>

        <button id="learnSave"
          style="padding:10px 12px; border-radius:12px;
          background:linear-gradient(180deg,#ffd6d6,#ffb3b3);
          color:#1b1b1b; border:none;">
          सेव करें
        </button>
      </div>

      <div id="learnMsg"
        style="margin-top:8px; font-size:12px;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- Open Modal ----------
  const openBtn = document.getElementById("openLearningUI");
  if (openBtn) {
    openBtn.onclick = () => {
      modal.style.display = "flex";
      document.getElementById("learnMsg").textContent = "";
    };
  }

  // ---------- Close Modal ----------
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("learnCancel").onclick = () => {
    modal.style.display = "none";
  };

  // ---------- Save (Deterministic) ----------
  document.getElementById("learnSave").onclick = async () => {
    const msg = document.getElementById("learnMsg");

    if (!window.KnowledgeBase) {
      msg.style.color = "#ff9f9f";
      msg.textContent = "KnowledgeBase उपलब्ध नहीं है।";
      return;
    }

    const question = document.getElementById("learnQuestion").value.trim();
    const answer = document.getElementById("learnAnswer").value.trim();
    const tags = document.getElementById("learnTags").value
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!question || !answer) {
      msg.style.color = "#ff9f9f";
      msg.textContent = "प्रश्न और उत्तर अनिवार्य हैं।";
      return;
    }

    try {
      await KnowledgeBase.saveOne({ question, answer, tags });
      msg.style.color = "#9fdf9f";
      msg.textContent = "प्रश्न–उत्तर स्थायी रूप से सेव हो गया।";

      document.getElementById("learnQuestion").value = "";
      document.getElementById("learnAnswer").value = "";
      document.getElementById("learnTags").value = "";

    } catch (e) {
      msg.style.color = "#ff9f9f";
      msg.textContent = "सेव करने में त्रुटि हुई।";
    }
  };

})();
