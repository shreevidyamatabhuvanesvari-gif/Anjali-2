/* =========================================================
   admin_bulk_loader.js
   Role: Bulk Learning UI (1000+ QnA)
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
            style="
              padding:10px 12px;
              border-radius:12px;
              background:#2a2a2a;
              color:#eee;
              border:1px solid #333;
            ">
            रद्द
          </button>
          <button id="bulkPreview"
            style="
              padding:10px 12px;
              border-radius:12px;
              background:linear-gradient(180deg,#ffd6d6,#ffb3b3);
              color:#1b1b1b;
              border:none;
            ">
            जाँच करें
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
        "Bulk मोड सक्रिय — अभी सेव नहीं किया गया";
    };
  }

  // ---------- Close Modal ----------
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("bulkCancel").onclick = function () {
    modal.style.display = "none";
  };

  // ---------- Preview / Validate ----------
  document.getElementById("bulkPreview").onclick = function () {
    const info = document.getElementById("bulkInfo");
    const raw = document.getElementById("bulkInput").value.trim();

    if (!raw) {
      info.style.color = "#ff9f9f";
      info.textContent = "कोई डेटा नहीं मिला।";
      return;
    }

    // Split by empty line
    const blocks = raw.split(/\n\s*\n/);
    let valid = 0;

    blocks.forEach(b => {
      const hasQ = /Q:\s*.+/i.test(b);
      const hasA = /A:\s*.+/i.test(b);
      if (hasQ && hasA) valid++;
    });

    info.style.color = valid ? "#9fdf9f" : "#ff9f9f";
    info.textContent =
      "मान्य प्रश्न–उत्तर ब्लॉक: " + valid + " / " + blocks.length +
      " (सेव अगले चरण में)";
  };

});
