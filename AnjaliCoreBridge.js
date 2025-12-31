/* =========================================================
   AnjaliCoreBridge.js
   🔗 STABLE + HARDENED VOICE + LEARNING + SAFE MEMORY
========================================================= */

import { AppIdentity } from "./AppIdentity.js";
import { LearningController } from "./LearningController.js";
import { MemoryController } from "./MemoryController.js";

/* ---------- Core Instances ---------- */
const learner = new LearningController();
const memory  = new MemoryController();

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

/* ---------- Voice State ---------- */
const STATE = Object.freeze({
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  SPEAKING: "SPEAKING"
});

let voiceState = STATE.IDLE;

/* ---------- State Helper ---------- */
function setState(next) {
  voiceState = next;
}

/* =========================================================
   SPEAK
========================================================= */
function speak(text) {
  if (synth.speaking) {
    synth.cancel(); // overlap safety
  }

  setState(STATE.SPEAKING);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  // 🔒 Safe memory write
  memory.rememberLearning(text);

  utterance.onend = () => {
    setState(STATE.IDLE);
    startListening();
  };

  utterance.onerror = () => {
    setState(STATE.IDLE);
  };

  synth.speak(utterance);
}

/* =========================================================
   LISTEN
========================================================= */
function startListening() {
  if (voiceState !== STATE.IDLE) return;

  try {
    setState(STATE.LISTENING);
    recognition.start();
  } catch (e) {
    setState(STATE.IDLE);
  }
}

/* ---------- RESULT ---------- */
recognition.onresult = (event) => {
  if (voiceState !== STATE.LISTENING) return;

  setState(STATE.IDLE);

  const text = event.results[0][0].transcript.trim();

  // 🔒 Safe memory write
  memory.rememberConversation(text);

  const reply = learner.learn(text);
  speak(reply);
};

/* ---------- END (important hardening) ---------- */
recognition.onend = () => {
  // अगर बोल नहीं रहा और state IDLE है → फिर सुनने की कोशिश
  if (voiceState === STATE.IDLE && !synth.speaking) {
    startListening();
  }
};

/* ---------- ERROR ---------- */
recognition.onerror = () => {
  setState(STATE.IDLE);
};

/* =========================================================
   START BUTTON
========================================================= */
document.getElementById("startTalk").addEventListener("click", () => {
  if (voiceState !== STATE.IDLE) return;

  speak(
    `नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`
  );
});
