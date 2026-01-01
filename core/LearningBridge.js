/* =========================================================
   LearningBridge.js
   Role: Deterministic Bridge between Question, Knowledge & Voice
   ========================================================= */

(function (window) {
  "use strict";

  // ---------- Dependency Check ----------
  if (!window.KnowledgeBase) {
    throw new Error("LearningBridge: KnowledgeBase not loaded");
  }
  if (!window.ExperienceMemory) {
    throw new Error("LearningBridge: ExperienceMemory not loaded");
  }
  if (!window.TTS) {
    throw new Error("LearningBridge: TTS not loaded");
  }

  // ---------- Bridge Object ----------
  const LearningBridge = {

    // ---------- Init ----------
    async init() {
      await KnowledgeBase.init();
      await ExperienceMemory.init();
      return true;
    },

    // ---------- Learn (Admin side) ----------
    async learnQA({ question, answer, tags = [] }) {
      if (!question || !answer) {
        throw new Error("Invalid QA");
      }

      await KnowledgeBase.saveOne({
        question: question.trim(),
        answer: answer.trim(),
        tags
      });

      await ExperienceMemory.save({
        type: "learn_qa",
        payload: { question, tags }
      });

      return true;
    },

    // ---------- Answer Question (USER SIDE) ----------
    async answerQuestion(questionText) {
      if (!questionText || typeof questionText !== "string") {
        const msg = "प्रश्न समझ में नहीं आया।";
        TTS.speak(msg);
        return msg;
      }

      const question = questionText.trim();

      // Load all learned knowledge
      const allKnowledge = await KnowledgeBase.getAll();

      let matched = null;

      // Deterministic matching (no AI, no guess)
      for (const item of allKnowledge) {
        if (
          item.question &&
          question.includes(item.question.trim())
        ) {
          matched = item;
          break;
        }
      }

      let answer;
      if (matched) {
        answer = matched.answer;
      } else {
        answer = "इस प्रश्न का उत्तर अभी मुझे सिखाया नहीं गया है।";
      }

      // Record interaction
      await ExperienceMemory.save({
        type: "question_answered",
        payload: {
          question,
          answered: !!matched
        }
      });

      // Speak answer
      TTS.speak(answer);

      return answer;
    },

    // ---------- Utilities ----------
    async getAllKnowledge() {
      return KnowledgeBase.getAll();
    },

    async getAllExperiences() {
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
