/* =========================================================
   admin_learning_view.js
   Role: Admin View for Saved Knowledge (Read Only)
   ========================================================= */

(function () {
  "use strict";

  // ---------- Modal ----------
  const modal = document.createElement("div");
  modal.id = "learningViewModal";
  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:10001;
  `;

  modal.innerHTML = `
    <div style="
      width:96%;
      max-width:680px;
      background:#1e1e1e;
      color:#eee;
      border-radius:18px;
      padding:16px;
      box-shadow:0 20px 44px rgba(0,0,0,.65)
    ">
      <h3 style="margin:0 0 8px; color:#ffd6d6;">
        📚 सीखा हुआ ज्ञान
      </h3>

      <div id="learnCount"
        style="font-size:12px; color:#ccc; margin-bottom:8px;">
        लोड हो रहा है…
      </div>

      <div id="learnList"
        style="
          max-height:360px;
          overflow:auto;
          border:1px solid #333;
          border-radius:12px;
          padding:10px;
          background:#121212;
        ">
      </div>

      <div style="display:flex; justify-content:flex-end; margin-top:10px;">
        <button id="closeLearningView"
          style="
            padding:10px 12px;
            border-radius:12px;
            background:#2a2a2a;
            color:#eee;
            border:1px solid #333;
          ">
          बंद करें
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- Render ----------
  function render(items) {
    const box = document.getElementById("learnList");
    const count = document.getElementById("learnCount");

    box.innerHTML = "";

    if (!items || !items.length) {
      count.textContent = "कोई ज्ञान सुरक्षित नहीं है।";
      box.innerHTML =
        "<div style='color:#aaa;'>रिकॉर्ड उपलब्ध नहीं हैं।</div>";
      return;
    }

    count.textContent = "कुल सुरक्षित प्रश्न–उत्तर: " + items.length;

    items.forEach((it, i) => {
      const div = document.createElement("div");
      div.style.cssText =
        "border-bottom:1px dashed #333; padding:8px 4px; margin-bottom:6px;";

      div.innerHTML = `
        <div style="font-size:12px; color:#ffb3b3;">
          ${i + 1}.
        </div>
        <div style="font-size:13px; margin-top:4px;">
          <b>Q:</b> ${it.question}
        </div>
        <div style="font-size:13px; margin-top:2px;">
          <b>A:</b> ${it.answer}
        </div>
        <div style="font-size:11px; color:#aaa; margin-top:2px;">
          ${it.tags && it.tags.length ? "टैग: " + it.tags.join(", ") : ""}
        </div>
      `;
      box.appendChild(div);
    });
  }

  // ---------- Open ----------
  const openBtn = document.getElementById("viewLearning");
  if (openBtn) {
    openBtn.onclick = async function () {
      modal.style.display = "flex";

      if (!window.KnowledgeBase) {
        document.getElementById("learnCount").textContent =
          "KnowledgeBase उपलब्ध नहीं है।";
        return;
      }

      try {
        const items = await KnowledgeBase.getAll();
        render(items);
      } catch (e) {
        document.getElementById("learnCount").textContent =
          "डेटा पढ़ने में त्रुटि हुई।";
      }
    };
  }

  // ---------- Close ----------
  document.getElementById("closeLearningView").onclick = function () {
    modal.style.display = "none";
  };

})();
