// IntentResolver.js
// Responsibility:
// - उपयोगकर्ता के वाक्य का इरादा (Intent) पहचानना
// - कोई उत्तर नहीं बनाता, केवल Intent लौटाता है
// Rule-based | Deterministic | Voice-Safe | No AI/ML

export const IntentResolver = Object.freeze({

  /**
   * @param {string} text
   * @returns {string} intent
   */
  resolve(text) {
    if (typeof text !== "string") {
      return "UNKNOWN";
    }

    const query = text.trim();
    if (query === "") {
      return "UNKNOWN";
    }

    /* ==============================
       जानकारी चाहने वाला
    ============================== */
    if (this.hasAny(query, ["कौन", "क्या", "कब", "कहाँ"])) {
      return "INFORMATION";
    }

    /* ==============================
       कारण / स्पष्टीकरण
    ============================== */
    if (this.hasAny(query, ["क्यों", "कैसे"])) {
      return "EXPLANATION";
    }

    /* ==============================
       भावनात्मक अभिव्यक्ति
    ============================== */
    if (this.hasAny(query, ["परेशान", "दुखी", "थक", "अकेला", "चिंतित"])) {
      return "EMOTIONAL";
    }

    /* ==============================
       नैतिक / सही-गलत
    ============================== */
    if (this.hasAny(query, ["सही", "गलत", "नैतिक", "उचित"])) {
      return "ETHICAL";
    }

    /* ==============================
       समाधान / मार्गदर्शन
    ============================== */
    if (this.hasAny(query, ["उपाय", "समाधान", "क्या करूँ"])) {
      return "GUIDANCE";
    }

    return "UNKNOWN";
  },

  hasAny(text, words) {
    return words.some(word => text.includes(word));
  }

});
