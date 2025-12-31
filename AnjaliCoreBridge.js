/* ---------- SPEAK ---------- */
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN";

  u.onend = () => {
    startListening(); // बोलना खत्म → सुनना शुरू
  };

  synth.cancel();
  synth.speak(u);
}

/* ---------- LISTEN ---------- */
function startListening() {
  if (listening) return;      // ✅ GUARD (बहुत जरूरी)
  listening = true;
  recognition.start();
}

recognition.onresult = (e) => {
  listening = false;

  const text = e.results[0][0].transcript.trim();
  const reply = learner.learn(text);

  speak(reply);
};

/* ---------- ERROR ---------- */
recognition.onerror = (e) => {
  console.error("Speech recognition error:", e);
  listening = false;
  // ❌ यहाँ recognition.start() मत बुलाइए
};

/* ---------- START ---------- */
document.getElementById("startTalk").addEventListener("click", () => {
  if (listening) return;

  speak(`नमस्ते ${AppIdentity.loverName}, मैं ${AppIdentity.appName} हूँ।`);
});
