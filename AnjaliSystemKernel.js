// AnjaliSystemKernel.js
// Responsibility:
// - पूरे सिस्टम की सभी JS फ़ाइलों को एक स्थान पर जोड़ना
// - Order + Dependency को स्थिर करना
// - Testing के लिए single entry देना
// ❗ No logic | No replacement | Only wiring

/* ===============================
   CORE LOGIC
=============================== */
import { LearningController } from "./LearningController.js";
import { LearningStorage } from "./LearningStorage.js";

/* ===============================
   VOICE
=============================== */
import { VoiceController } from "./VoiceController.js";

/* ===============================
   MEMORY
=============================== */
import { MemoryController } from "./MemoryController.js";

/* ===============================
   KNOWLEDGE / RULES
=============================== */
import { AnswerBank } from "./AnswerBank.js";
import { TopicRules } from "./TopicRules.js";
import { IntentResolver } from "./IntentResolver.js";

/* ===============================
   REASONING
=============================== */
import { ReasoningEngine } from "./ReasoningEngine.js";

/* ===============================
   UI / LEARNING
=============================== */
import "./LearningUI.js";
import "./LearningViewerUI.js";

/* ===============================
   CORE BRIDGE
=============================== */
import { AppIdentity } from "./AppIdentity.js";

/* ===============================
   SYSTEM BOOTSTRAP
=============================== */
export const AnjaliSystem = Object.freeze({
  LearningController,
  LearningStorage,
  VoiceController,
  MemoryController,
  AnswerBank,
  TopicRules,
  IntentResolver,
  ReasoningEngine,
  AppIdentity
});
