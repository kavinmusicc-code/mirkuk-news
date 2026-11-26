(function () {
  const STOP_WORDS = new Set([
    "the", "and", "for", "with", "that", "this", "from", "into", "over", "after",
    "amid", "says", "say", "will", "are", "was", "were", "has", "have", "had",
    "new", "live", "news", "report", "reports", "update", "updates", "india",
    "world", "more", "than", "about", "what", "when", "where", "why", "how",
    "its", "their", "they", "them", "his", "her", "out", "off", "all", "one", "two"
  ]);

  const TOPIC_RULES = [
    { tag: "Gaming", re: /\b(gaming|gamer|esports|playstation|xbox|nintendo|gta|steam|mobile game|tournament)\b/i },`n    { tag: "AI & Tech", re: /\b(ai|artificial intelligence|tech|chip|semiconductor|software|cyber|google|apple|microsoft|openai|startup|app|data)\b/i },
    { tag: "Markets & Biz", re: /\b(market|stock|nifty|sensex|rupee|rbi|bank|economy|gdp|trade|investment|ipo|business|company|profit)\b/i },
    { tag: "Sports", re: /\b(cricket|ipl|match|test|odi|goal|win|cup|league|tournament|player|olympic|football|tennis)\b/i },
    { tag: "World", re: /\b(un|global|us|usa|china|europe|uk|russia|ukraine|israel|gaza|summit|president|minister|diplomacy)\b/i },
    { tag: "India", re: /\b(india|indian|delhi|mumbai|parliament|supreme court|state|govt|government|railway|isro)\b/i }
  ];

  function detectTopic(text) {
    for (const rule of TOPIC_RULES) {
      if (rule.re.test(text || "")) return rule.tag;
    }
    return "General";
  }

  function tokenSet(title) {
    return new Set(
      (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w))
    );
  }

  function jaccardSimilarity(setA, setB) {
    if (!setA.size || !setB.size) return 0;
    let inter = 0;
    setA.forEach(w => { if (setB.has(w)) inter++; });
    const union = setA.size + setB.size - inter;
    return union ? inter / union : 0;
  }

  function scoreStory(item) {
    const now = Date.now();
    const pubMs = new Date(item.pubDate).getTime();
    const ageHours = isNaN(pubMs) ? 12 : Math.max(0, (now - pubMs) / 3600000);
    const freshnessScore = Math.max(0, 50 - ageHours * 2.2);
    const summaryBonus = Math.min(20, ((item.__summary || "").length / 25));
    const titleBonus = ((item.__cleanTitle || item.title || "").length >= 25) ? 10 : 0;
    return freshnessScore + summaryBonus + titleBonus;
  }

  function runBeastBrain() {
    const rawItems = window.__mirkukCurrentItems;
    if (!Array.isArray(rawItems) || !rawItems.length) return;
    if (window.__mirkukBeastProcessedFor === rawItems) return;
    window.__mirkukBeastProcessedFor = rawItems;

    const accepted = [];
    const acceptedTokens = [];

    const ranked = rawItems.slice().sort((a, b) => scoreStory(b) - scoreStory(a));

    for (const it of ranked) {
      const titleText = it.__cleanTitle || it.title || "";
      const tok = tokenSet(titleText);
      const isNearDup = acceptedTokens.some(prevTok => jaccardSimilarity(tok, prevTok) >= 0.62);
      if (isNearDup) continue;

      const topic = detectTopic(`${titleText} ${it.__summary || ""}`);
      accepted.push(Object.assign({}, it, { __beastTopic: topic }));
      acceptedTokens.push(tok);
    }

    if (accepted.length >= 4) {
      window.__mirkukCurrentItems = accepted;
      window.__mirkukAllItemsBackup = accepted.slice();
    }

    // Tag grid cards with auto-detected topic badge
    document.querySelectorAll("#mk-grid-area .mk-grid-body").forEach((bodyEl) => {
      const catTag = bodyEl.querySelector(".mk-cat-tag");
      if (!catTag || catTag.querySelector(".mk-auto-tag")) return;
      const linkEl = bodyEl.querySelector("h3 a");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const match = (window.__mirkukCurrentItems || []).find(x => x.link === href);
      if (match && match.__beastTopic) {
        const span = document.createElement("span");
        span.className = "mk-auto-tag";
        span.textContent = match.__beastTopic;
        catTag.appendChild(span);
      }
    });

    // Extract top trending buzzwords across loaded stories
    const freq = new Map();
    for (const it of (window.__mirkukCurrentItems || [])) {
      const words = (it.__cleanTitle || it.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length >= 4 && !STOP_WORDS.has(w));
      const uniqueInStory = new Set(words);
      uniqueInStory.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
    }

    const topBuzz = Array.from(freq.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);

    const buzzContainer = document.getElementById("mk-buzz-keywords");
    if (buzzContainer && topBuzz.length) {
      buzzContainer.innerHTML =
        `<strong style="text-transform:uppercase; letter-spacing:0.04em;">Beast Buzz:</strong>` +
        topBuzz.map(w => `<button type="button" class="mk-buzz-btn" data-mk-buzz="${w}">${w.toUpperCase()}</button>`).join("");

      buzzContainer.querySelectorAll("[data-mk-buzz]").forEach(btn => {
        btn.addEventListener("click", function () {
          const term = this.getAttribute("data-mk-buzz");
          const inp = document.getElementById("mk-search-input");
          const form = document.getElementById("mk-search-form");
          if (inp && form) {
            inp.value = term;
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        });
      });
    }

    const metaEl = document.getElementById("mk-beast-meta");
    if (metaEl) {
      metaEl.textContent = `Beast Brain: ${accepted.length} ranked & deduplicated stories`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const gridEl = document.getElementById("mk-grid-area");
    if (gridEl && window.MutationObserver) {
      const obs = new MutationObserver(() => {
        setTimeout(runBeastBrain, 60);
      });
      obs.observe(gridEl, { childList: true });
    }
    setTimeout(runBeastBrain, 1500);
  });
})();

