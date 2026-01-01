/* =========================================================
   admin_learning_view.js
   Role: View Saved Knowledge (Admin)
   Stage: 10
   ========================================================= */

(function () {
  "use strict";

  // ---------- Modal ----------
  const modal = document.createElement("div");
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    display:none; align-items:center; justify-content:center; z-index:10001;
  `;

  modal.innerHTML = `
    <div style="
      width:96%; max-width:680px; background:#1e1e1e; color:#eee;
      border-radius:18px; padding:16px;
      box-shadow:0 20px 44px rgba(0,0,0,.65)
    ">
      <h3 style="margin:0 0 8px; color:#ffd6d6;">
        📚 सीखा हुआ ज्ञान
      </h3>

      <div style="font-size:12px; color:#ccc; margin-bottom:8px;" id="learnCount">
        लोड हो रहा है…
      </div>

      <div id="learnList" style="
        max-height:360px; overflow:auto; border:1px solid #333;
        border-radius:12px; padding:10px; background:#121212;
      "></div>

      <div style="display:flex; justify-content:flex-end; margin-top:10px;">
        <button id="closeView" style="
          padding:10px 12px; border-radius:12px;
          background:#2a2a2a; color:#eee; border:1px solid #333;
        ">बंद करें</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- Helpers ----------
  function renderList(items) {
    const box = document.getElementById("learnList");
    box.innerHTML = "";

    if (!items.length) {
      box.innerHTML = "<div style='color:#aaa;'>कोई ज्ञान सुरक्षित नहीं है।</div>";
      return;
    }

    items.forEach((it, i) => {
      const div = document.createElement("div");
      div.style.cssText = `
        border-bottom:1px dashed #333; padding:8px 4px; margin-bottom:6px;
      `;
      div.innerHTML = `
        <div style="font-size:12px; color:#ffb3b3;">
          ${i + 1}. ${it.subject || "—"} ${it.topic ? "› " + it.topic : ""}
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
    openBtn.onclick = async () => {
      modal.style.display = "flex";

      if (!window.KnowledgeBase) {
        document.getElementById("learnCount").textContent =
          "KnowledgeBase उपलब्ध नहीं है।";
        return;
      }

      // Fetch all records
      const items = [];
      const db = await indexedDB.open("AnjaliKnowledgeDB");

      db.onsuccess = () => {
        const d = db.result;
        const tx = d.transaction("qa_store", "readonly");
        const store = tx.objectStore("qa_store");
        const req = store.openCursor();

        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            items.push(cursor.value);
            cursor.continue();
          } else {
            document.getElementById("learnCount").textContent =
              `कुल सुरक्षित प्रश्न–उत्तर: ${items.length}`;
            renderList(items);
          }
        };
      };
    };
  }

  document.getElementById("closeView").onclick = () => {
    modal.style.display = "none";
  };

})();
