/* =========================================================
   admin_bulk_loader.js
   Role: Bulk Learning UI + REAL SAVE (1000+ QnA)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ---------- Create Bulk Modal ----------
  const modal = document.createElement("div");
  modal.id = "bulkLearningModal";
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
      width:96%;
      max-width:640px;
      background:#1e1e1e;
      color:#eee;
      border-radius:18px;
      padding:16px;
      box-shadow:0 20px 44px rgba(0,0,0,.65)
    ">
      <h3 style="margin:0 0 8px; color:#ffd6d6;">
        📦 Bulk Learning (1000+ प्रश्नोत्तर)
      </h3>

      <div style="font-size:12px; color:#ccc; margin-bottom:8px;">
        फॉर्मेट (एक प्रश्न–उत्तर = एक ब्लॉक):
        <br>
        <code>
        Q: प्रश्न...?<br>
        A: उत्तर...<br>
        TAGS: टैग1, टैग2
        </code>
        <br><br>
        हर ब्लॉक के बीच <b>एक खाली लाइन</b> रखें।
      </div>

      <textarea id="bulkInput"
        placeholder="यहाँ 1000+ प्रश्नोत्तर पेस्ट करें..."
        style="
          width:100%;
          min-height:220px;
          padding:10px;
          border-radius:12px;
          border:1px solid #333;
          background:#121212;
          color:#eee;
          resize:vertical;
        "></textarea>

      <div style="display:flex; gap:8px; margin-top:10px; justify-content:space-between; flex-wrap:wrap;">
        <div id="bulkInfo" style="font-size:12px; color:#9fdf9f;">
          अभी कोई डेटा प्रोसेस नहीं हुआ
        </div>
        <div>
          <button id="bulkCancel"
            style="padding:10px 12px; border-radius:12px;
            background:#2a2a2a; color:#eee; border:1px solid #333;">
            रद्द
          </button>
          <button id="bulkPreview"
            style="padding:10px 12px; border-radius:12px;
            background:linear-gradient(180deg,#ffd6d6,#ffb3b3);
            color:#1b1b1b; border:none;">
            सेव करें
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // ---------- Open Modal ----------
  const openBtn = document.getElementById("bulkAdd");
  if (openBtn) {
    openBtn.onclick = function () {
      modal.style.display = "flex";
      document.getElementById("bulkInfo").textContent =
        "Bulk मोड सक्रिय — सेव के लिए तैयार";
    };
  }

  // ---------- Close Modal ----------
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("bulkCancel").onclick = function () {
    modal.style.display = "none";
  };

  // ---------- PREVIEW + REAL SAVE ----------
  document.getElementById("bulkPreview").onclick = async function () {
    const info = document.getElementById("bulkInfo");
    const raw = document.getElementById("bulkInput").value.trim();

    if (!raw) {
      info.style.color = "#ff9f9f";
      info.textContent = "कोई डेटा नहीं मिला।";
      return;
    }

    if (!window.KnowledgeBase) {
      info.style.color = "#ff9f9f";
      info.textContent = "KnowledgeBase उपलब्ध नहीं है।";
      return;
    }

    try {
      await KnowledgeBase.init();

      // -------- Parse blocks --------
      const blocks = raw.split(/\n\s*\n/);
      const records = [];

      blocks.forEach(block => {
        const q = block.match(/Q:\s*([\s\S]+?)(?:\n|$)/i);
        const a = block.match(/A:\s*([\s\S]+?)(?:\n|$)/i);
        const t = block.match(/TAGS:\s*([\s\S]+)/i);

        if (q && a) {
          records.push({
            question: q[1].trim(),
            answer: a[1].trim(),
            tags: t ? t[1].split(",").map(s => s.trim()).filter(Boolean) : []
          });
        }
      });

      if (!records.length) {
        info.style.color = "#ff9f9f";
        info.textContent = "मान्य प्रश्न–उत्तर नहीं मिले।";
        return;
      }

      // -------- SAVE (Sequential, Safe) --------
      let saved = 0;
      for (const r of records) {
        await KnowledgeBase.saveOne(r);
        saved++;
      }

      info.style.color = "#9fdf9f";
      info.textContent =
        `स्थायी रूप से सेव किए गए प्रश्न–उत्तर: ${saved}`;

    } catch (e) {
      info.style.color = "#ff9f9f";
      info.textContent = "Bulk सेव करने में त्रुटि हुई।";
    }
  };

});
