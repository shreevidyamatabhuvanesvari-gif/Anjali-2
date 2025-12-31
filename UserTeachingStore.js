// UserTeachingStore.js
// Responsibility:
// - यूज़र द्वारा सिखाए गए प्रश्न-उत्तर सुरक्षित रूप से सहेजना
// Rule-based | Deterministic | Voice-Safe | No AI/ML

export const UserTeachingStore = (() => {

  const STORAGE_KEY = "ANJALI_USER_TEACHING_STORE";

  function _load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function _save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  return {

    add(question, answer) {
      if (
        typeof question !== "string" ||
        typeof answer !== "string" ||
        question.trim() === "" ||
        answer.trim() === ""
      ) {
        return false;
      }

      const store = _load();
      store.push({
        question: question.trim(),
        answer: answer.trim(),
        timestamp: Date.now()
      });

      _save(store);
      return true;
    },

    getAll() {
      return _load();
    },

    findExact(question) {
      if (typeof question !== "string") return null;

      const store = _load();
      const q = question.trim();

      const match = store.find(item => item.question === q);
      return match ? match.answer : null;
    }

  };
})();
