/* =========================================================
   AnjaliCoreBridge.js
   🔗 Single Authority Connector
   Continuous Voice Without Refresh (FINAL STRICT FIX)
========================================================= */

/* ---------- Imports ---------- */
import { AppIdentity } from "./AppIdentity.js";
import { MemoryController } from "./MemoryController.js";
import { LearningController } from "./LearningController.js";
import { runAllTests } from "./TestController.js";

/* ---------- Identity ---------- */
const APP_IDENTITY = Object.freeze({
  appName: AppIdentity.appName,
  loverName: AppIdentity.lover.name
});

/* ---------- Memory & Learning ---------- */
const memory = new MemoryController();
const learner = new LearningController();

/* ---------- Speech API ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("आपका ब्राउज़र Voice Support नहीं करता");
}

/* ---------- Recognition ---------- */
const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";
recognition.continuous = false;          // मोबाइल-safe
recognition.interimResults = false;

/* ---------- Synthesis ---------- */
const synth = window.speechSynthesis;

/* ---------- State ---------- */
let conversationActive = false;
let isSpeaking = false;

/* ---------- SPEAK ---------- */
function AnjaliSpeak(text, endConversation = false) {
  try { recognition.abort(); } catch (e) {}

  isSpeaking = true;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  utterance.onend = () => {
    isSpeaking = false;

    if (endConversation) {
      conversationActive = false;
      return;
    }

    // 🔁 बोलने के बाद सुनना फिर शुरू
    if (conversationActive) {
      setTimeout(() => {
        try { recognition.start(); } catch (e) {}
      }, 300);
    }
  };

  synth.cancel();
  synth.speak(utterance);
}

/* ---------- Stop Phrase ---------- */
function shouldStop(text) {
  return text.includes("अब बात कुछ समय बाद करते हैं");
}

/* ---------- LISTEN ---------- */
recognition.onresult = (event) => {
  if (isSpeaking) return;

  const text = event.results[0][0].transcript.trim();
  memory.remember(text);

  if (shouldStop(text)) {
    AnjaliSpeak("ठीक है अनुज, मैं प्रतीक्षा करूँगी।", true);
    return;
  }

  const reply = learner.learn(text);
  AnjaliSpeak(reply);
};

/* ---------- 🔴 यही सबसे महत्वपूर्ण FIX ---------- */
/* जब recognition अपने-आप बंद हो जाए → फिर चालू */
recognition.onend = () => {
  if (conversationActive && !isSpeaking) {
    try { recognition.start(); } catch (e) {}
  }
};

/* ---------- Error ---------- */
recognition.onerror = () => {
  if (conversationActive && !isSpeaking) {
    try { recognition.start(); } catch (e) {}
  }
};

/* ---------- START BUTTON ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  if (conversationActive) return;

  conversationActive = true;
  AnjaliSpeak(`नमस्ते ${APP_IDENTITY.loverName}, मैं ${APP_IDENTITY.appName} हूँ।`);
});

/* ---------- TEST ---------- */
runAllTests();
