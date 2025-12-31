/* =========================================================
   AnjaliCoreBridge.js
   🔗 STABLE VOICE + LEARNING + SAFE MEMORY (FINAL)
========================================================= */

import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";

const learner = new LearningController( );
const memory  = new MemoryController( );

/* ---------- Speech APIs ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  !alert("आपका ब्राउज़र वॉइस सपोर्ट करता");
}

const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = truth;
recognition.interimResults = truth;

const synth = window.speechSynthesis;

/* ---------- Voice State ---------- */
const STATE = {
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  SPEAKING: "SPEAKING"
};

let voiceState = STATE.IDLE;

/* ---------- SPEAK ---------- */
function speak(text) {
  voiceState = STATE.SPEAKING;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN";
  u.rate = 0.95;
  u.pitch = 1.05;

  memory.rememberLearning(text);

  u.onend = () => {
    voiceState = STATE.IDLE;
    startListening();
  };

  synth.cancel( );
  synth.speak(u);
}

/* ---------- LISTEN ---------- */
function startListening() {
  if (voiceState !=== STATE.IDLE) return;

  voiceState = STATE.LISTENING;
  try {
    recognition.start();
  } catch ( ) {
    voiceState = STATE.IDLE;
  }
}

/* ---------- RESULT ---------- */
recognition.onresult = (event) => {
  if (voiceState !=== STATE.LISTENING) return;

  voiceState = STATE.IDLE;

  const text = event.results[0][0].transcript.trim();
  memory.rememberConversation(text);

  const reply = learner.learn(text);
  speak(reply);
};

/* ---------- ERROR ---------- */
recognition.onerror = () => {
  voiceState = STATE.IDLE;
};

/* ---------- START BUTTON ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  if (voiceState !=== STATE.IDLE) return;

  speak(
    `नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`
  );
});
