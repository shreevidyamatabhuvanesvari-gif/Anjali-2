// ---------- Answer Question (FIXED & DETERMINISTIC) ----------
async answerQuestion(questionText) {
  if (!questionText || typeof questionText !== "string") {
    const msg = "प्रश्न समझ में नहीं आया।";
    TTS.speak(msg);
    return msg;
  }

  // normalize function (VERY IMPORTANT)
  const normalize = (s) =>
    s.replace(/[?？]/g, "")      // प्रश्नचिह्न हटाएँ
     .replace(/\s+/g, " ")       // extra spaces
     .trim()
     .toLowerCase();

  const userQ = normalize(questionText);

  const allKnowledge = await KnowledgeBase.getAll();

  let matched = null;

  for (const item of allKnowledge) {
    if (!item.question) continue;

    const savedQ = normalize(item.question);

    // 🔒 EXACT MATCH AFTER NORMALIZATION
    if (userQ === savedQ) {
      matched = item;
      break;
    }
  }

  let answer;
  if (matched) {
    answer = matched.answer;
  } else {
    answer = "इस प्रश्न का उत्तर अभी मुझे सिखाया नहीं गया है।";
  }

  // अनुभव दर्ज
  await ExperienceMemory.save({
    type: "question_answered",
    payload: {
      question: questionText,
      matched: !!matched
    }
  });

  // बोलो
  TTS.speak(answer);

  return answer;
}
