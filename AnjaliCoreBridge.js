/* =========================================================
   AnjaliCoreBridge.js
   🔗 FINAL VOICE FLOW — GUARANTEED RESPONSE
========================================================= */

import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";

const learner = new LearningController();

/* ---------- Speech API ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Voice support उपलब्ध नहीं");
}

const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

const synth = window.speechSynthesis;

/* ---------- State ---------- */
let listening = false;

/* ---------- SPEAK ---------- */
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN";

  u.onend = () => {
    listening = true;
    recognition.start();   // केवल यहाँ start
  };

  synth.cancel();
  synth.speak(u);
}

/* ---------- LISTEN ---------- */
recognition.onresult = (e) => {
  listening = false;

  const text = e.results[0][0].transcript.trim();

  const reply = learner.learn(text);
  speak(reply);
};

/* ---------- ERROR ---------- */
recognition.onerror = () => {
  if (listening) recognition.start();
};

/* ---------- START ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  if (listening) return;

  speak(`नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`);
});
