import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";
import { AppIdentity } from "./AppIdentity.js";

function safe(v, f) {
  return (typeof v === "string" && v.trim()) ? v.trim() : f;
}

const learner = new LearningController();
const memory  = new MemoryController();

const voice = new VoiceController((userText) => {
  memory.rememberConversation(userText);
  const reply = learner.learn(userText);
  memory.rememberLearning(reply);
  voice.speak(reply);
});

document.getElementById("startTalk").addEventListener("click", () => {
  const lover = safe(AppIdentity?.loverName, "प्रिय");
  const app   = safe(AppIdentity?.appName, "अंजली");
  voice.speak(`नमस्ते ${lover}, मैं ${app} हूँ।`);
});
