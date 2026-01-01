document.getElementById("viewLearning").onclick = async () => {
  await KnowledgeBase.init();
  const items = await KnowledgeBase.getAll();
  alert("कुल सुरक्षित प्रश्न–उत्तर: " + items.length);
};
