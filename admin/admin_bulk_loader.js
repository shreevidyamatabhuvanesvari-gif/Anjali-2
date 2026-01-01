(function () {
  "use strict";

  document.getElementById("bulkProcess").onclick = async () => {
    const info = document.getElementById("bulkInfo");

    try {
      await KnowledgeBase.init();

      const raw = document.getElementById("bulkInput").value.trim();
      if (!raw) {
        info.textContent = "कोई डेटा नहीं मिला।";
        return;
      }

      const records = KnowledgeBase.parseBulk(raw);
      if (!records.length) {
        info.textContent = "मान्य प्रश्न–उत्तर नहीं मिले।";
        return;
      }

      const saved = await KnowledgeBase.saveBulk(records);
      info.style.color = "#9fdf9f";
      info.textContent = `स्थायी रूप से सेव किए गए प्रश्न–उत्तर: ${saved}`;

    } catch (e) {
      info.style.color = "#ff9f9f";
      info.textContent = "Bulk सेव करने में त्रुटि हुई।";
    }
  };

})();
