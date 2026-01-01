/* =========================================================
   LearningBridge.js
   Role: Deterministic Bridge between Core, Knowledge & Experience
   ========================================================= */

(function (window) {
  "use strict";

  if (!window.AnjaliCore) {
    throw new Error("AnjaliCore not loaded");
  }
  if (!window.KnowledgeBase) {
    throw new Error("KnowledgeBase not loaded");
  }
  if (!window.ExperienceMemory) {
    throw new Error("ExperienceMemory not loaded");
  }

  // ---------- Bridge ----------
  const LearningBridge = {

    // Ensure all layers are ready
    async init() {
      await KnowledgeBase.init();
      await ExperienceMemory.init();
      return true;
    },

    // ---------- Knowledge ----------
    async learnQA({ question, answer, tags = [] }) {
      if (!question || !answer) {
        throw new Error("Invalid QA");
      }
      // Persist knowledge
      await KnowledgeBase.saveOne({ question, answer, tags });

      // Record experience of learning
      await ExperienceMemory.save({
        type: "learn_qa",
        payload: { question, tags }
      });

      return true;
    },

    // ---------- Experience ----------
    async recordInteraction({ intent, data = {} }) {
      if (!intent) {
        throw new Error("Invalid interaction");
      }
      await ExperienceMemory.save({
        type: "interaction",
        payload: { intent, data }
      });
      return true;
    },

    // ---------- Read ----------
    async getKnowledge() {
      return KnowledgeBase.getAll();
    },

    async getExperiences() {
      return ExperienceMemory.getAll();
    }
  };

  // ---------- Expose ----------
  Object.defineProperty(window, "LearningBridge", {
    value: LearningBridge,
    writable: false,
    configurable: false
  });

})(window);
