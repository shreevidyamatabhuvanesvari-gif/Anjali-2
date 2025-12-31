// ConversationPatternStore.js
// Responsibility:
// - बातचीत से निकले प्रश्न-पैटर्न सहेजना
// - उत्तर नहीं, केवल संकेत (meta-data)
// Rule-based | Deterministic | Voice-Safe

export const ConversationPatternStore = (() => {

  const STORAGE_KEY = "ANJALI_CONVERSATION_PATTERN_STORE";

  function _load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  function _save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  return {

    record(question, wasClarificationNeeded) {
      if (typeof question !== "string") return;

      const store = _load();
      const q = question.trim();

      if (!store[q]) {
        store[q] = {
          count: 0,
          clarificationCount: 0
        };
      }

      store[q].count += 1;

      if (wasClarificationNeeded === true) {
        store[q].clarificationCount += 1;
      }

      _save(store);
    },

    getStats(question) {
      const store = _load();
      return store[question] || null;
    }

  };
})();
