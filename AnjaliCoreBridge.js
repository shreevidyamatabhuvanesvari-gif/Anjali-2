/* =========================================================
   AnjaliCoreBridge.js
   🔗 Single Authority Connector
   Voice Speaking + Listening (Stable v1)
========================================================= */

// ---------- Identity Lock ----------
const APP_IDENTITY = Object.freeze({
  appName: "अंजली",
  loverName: "अनुज"
});

// ---------- Speech Engines ----------
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

// ---------- State ----------
let conversationActive = false;

// ---------- Speak Function ----------
function AnjaliSpeak(text) {
  if (!conversationActive) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  synth.speak(utterance);
}

// ---------- Stop Condition ----------
function checkStopCondition(spokenText) {
  return spokenText.includes("अब बात कुछ समय बाद करते हैं");
}

// ---------- Listening Logic ----------
recognition.onresult = (event) => {
  const lastResult = event.results[event.results.length - 1][0].transcript.trim();

  console.log("अनुज:", lastResult);

  if (checkStopCondition(lastResult)) {
    conversationActive = false;
    recognition.stop();
    AnjaliSpeak("ठीक है अनुज, मैं प्रतीक्षा करूँगी।");
    return;
  }

  // Basic empathetic response (v1 stable)
  AnjaliSpeak("मैं सुन रही हूँ अनुज, बोलिए।");
};

// ---------- Error Handling ----------
recognition.onerror = (event) => {
  console.error("Voice Error:", event.error);
};

// ---------- Start Button Binding ----------
document.getElementById("startTalk").addEventListener("click", () => {
  if (conversationActive) return;

  conversationActive = true;
  AnjaliSpeak("नमस्ते अनुज, मैं अंजली हूँ।");
  recognition.start();
});
