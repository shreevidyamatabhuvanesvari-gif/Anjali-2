/* =========================================================
   AnjaliCoreBridge.js
   🔗 Single Authority Connector
   Voice + Memory + Learning (Stable Integrated v1)
========================================================= */

/* ---------- External Core Imports ---------- */
import { AppIdentity } from "./AppIdentity.js";
import { MemoryController } from "./MemoryController.js";
import { VoiceController } from "./VoiceController.js";
import { LearningController } from "./LearningController.js";
import { runAllTests } from "./TestController.js";

/* ---------- Identity Lock (Bridge Level) ---------- */
const APP_IDENTITY = Object.freeze({
  appName: AppIdentity.appName,
  loverName: AppIdentity.lover.name
});

/* ---------- Memory & Learning ---------- */
const memory = new MemoryController();
const learner = new LearningController();

/* ---------- Speech Engines (Native Browser) ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("आपका ब्राउज़र Voice Support नहीं करता");
}

// Listener
const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = true;
recognition.interimResults = false;

// Speaker
const synth = window.speechSynthesis;

/* ---------- State ---------- */
let conversationActive = false;

/* ---------- Speak Function ---------- */
function AnjaliSpeak(text) {
  if (!conversationActive) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  synth.speak(utterance);
}

/* ---------- Stop Condition ---------- */
function checkStopCondition(spokenText) {
  return spokenText.includes("अब बात कुछ समय बाद करते हैं");
}

/* ---------- Listening Logic ---------- */
recognition.onresult = (event) => {
  const lastResult =
    event.results[event.results.length - 1][0].transcript.trim();

  console.log(`${APP_IDENTITY.loverName}:`, lastResult);

  // स्मृति में संग्रह
  memory.remember(lastResult);

  // Stop Condition
  if (checkStopCondition(lastResult)) {
    conversationActive = false;
    recognition.stop();
    AnjaliSpeak("ठीक है अनुज, मैं प्रतीक्षा करूँगी।");
    return;
  }

  // सीखकर उत्तर
  const response = learner.learn(lastResult);
  AnjaliSpeak(response);
};

/* ---------- Error Handling ---------- */
recognition.onerror = (event) => {
  console.error("Voice Error:", event.error);
};

/* ---------- Start Button Binding ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  if (conversationActive) return;

  conversationActive = true;
  AnjaliSpeak(`नमस्ते ${APP_IDENTITY.loverName}, मैं ${APP_IDENTITY.appName} हूँ।`);
  recognition.start();
});

/* ---------- System Test ---------- */
runAllTests();
