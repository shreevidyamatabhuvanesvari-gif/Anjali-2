/* =========================================================
   AnjaliCoreBridge.js
   🔗 FINAL VOICE + LEARNING + SAFE MEMORY
========================================================= */

/* ---------- Imports ---------- */
import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";

/* ---------- Core Instances ---------- */
const learner = new LearningController();
const memory = new MemoryController();

/* ---------- Speech APIs ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("आपका ब्राउज़र वॉइस सपोर्ट नहीं करता");
}

const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

const synth = window.speechSynthesis;

/* ---------- State ---------- */
let listening = false;

/* =========================================================
   SPEAK
========================================================= */
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN";
  u.rate = 0.95;
  u.pitch = 1.05;

  // 🔒 Memory write (NON-BLOCKING)
  memory.rememberLearning(text);

  u.onend = () => {
    startListening();
  };

  synth.cancel();
  synth.speak(u);
}

/* =========================================================
   LISTEN
========================================================= */
function startListening() {
  if (listening) return;
  listening = true;
  recognition.start();
}

/* ---------- Result ---------- */
recognition.onresult = (event) => {
  listening = false;

  const text = event.results[0][0].transcript.trim();

  // 🔒 Memory write (NON-BLOCKING)
  memory.rememberConversation(text);

  const reply = learner.learn(text);
  speak(reply);
};

/* ---------- Error ---------- */
recognition.onerror = () => {
  listening = false;
};

/* =========================================================
   START BUTTON
========================================================= */
document.getElementById("startTalk").addEventListener("click", () => {
  if (listening) return;

  speak(
    `नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`
  );
});
