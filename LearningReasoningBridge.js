// LearningReasoningBridge.js
// Responsibility:
// - Learning (Q/A) को ReasoningGraphStore से जोड़ना
// - Question → Answer को graph nodes/edges में संरचित करना
// - Side-effect only (LearningController untouched)
// Rule-based | Deterministic | Offline-only | Voice-safe

import { ReasoningGraphStore } from "./ReasoningGraphStore.js";

export class LearningReasoningBridge {

  constructor() {
    this.graph = new ReasoningGraphStore();
  }

  /* =====================================================
     PUBLIC API
     - LearningUI / LearningStorage से कॉल किया जा सकता है
  ===================================================== */

  /**
   * सीखाए गए Q/A को graph में दर्ज करता है
   * @param {string} question
   * @param {string} answer
   */
  onLearnedQA(question, answer) {
    if (
      typeof question !== "string" ||
      typeof answer !== "string" ||
      question.trim() === "" ||
      answer.trim() === ""
    ) {
      return; // 🔒 कुछ भी असुरक्षित न लिखें
    }

    const q = question.trim();
    const a = answer.trim();

    // Nodes जोड़ें
    const qNodeId = this._addNodeSafe("question", q);
    const aNodeId = this._addNodeSafe("answer", a);

    // Relation जोड़ें (question -> answer)
    if (qNodeId !== null && aNodeId !== null) {
      this._addEdgeSafe(qNodeId, aNodeId, "leads_to");
    }
  }

  /* =====================================================
     INTERNAL SAFE HELPERS
  ===================================================== */

  _addNodeSafe(type, value) {
    try {
      // GraphStore async init को block नहीं करते
      this.graph.addNode(type, value);
      // NOTE: autoIncrement id async है; immediate id आवश्यक नहीं
      return true; // success marker
    } catch (_) {
      return null;
    }
  }

  _addEdgeSafe(fromNodeId, toNodeId, relation) {
    try {
      this.graph.addEdge(fromNodeId, toNodeId, relation);
    } catch (_) {
      // ignore safely
    }
  }
}
