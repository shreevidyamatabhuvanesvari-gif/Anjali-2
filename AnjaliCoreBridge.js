/* =========================================================
   AnjaliCoreBridge.js
   🔗 Single Authority Connector
   FINAL STABLE VOICE + LEARNING FLOW
========================================================= */

/* ---------- Imports ---------- */
import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";

/* ---------- Learning ---------- */
const learner = new LearningController();

/* ---------- Speech APIs ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("आपका ब्राउज़र वॉइस सपोर्ट नहीं करता");
}

/* ---------- Recognition ---------- */
const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

/* ---------- Synthesis ---------- */
const synth = window.speechSynthesis;

/* ---------- State ---------- */
let listening = false;

/* =========================================================
   SPEAK
========================================================= */
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  utterance.onend = () => {
    startListening();   // बोलना खत्म → सुनना शुरू
  };

  synth.cancel();
  synth.speak(utterance);
}

/* =========================================================
   LISTEN
========================================================= */
function startListening() {
  if (listening) return;      // 🔒 Guard
  listening = true;
  recognition.start();
}

/* ---------- Result ---------- */
recognition.onresult = (event) => {
  listening = false;

  const text = event.results[0][0].transcript.trim();
  const reply = learner.learn(text);

  speak(reply);
};

/* ---------- Error ---------- */
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
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
