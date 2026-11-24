/* === MIRKUK TOI-STYLE FOOTER BOUNDARY START === */
(function () {
  const FOOTER_COLUMNS = {
    "Living & Entertainment": [
      "Lifestyle", "Food News", "Travel Destinations", "Entertainment",
      "Wellness", "Culture", "Digital Trends", "Weekend Reads"
    ],
    "Services": [
      "Breaking News", "Gadgets & Tech", "City Updates", "Markets & Business",
      "Auto & Mobility", "Career & Education", "Defence Desk", "Weather & Alerts"
    ]
  };

  const HOT_ON_THE_WEB = [
    "AI & Future Tech", "Global Markets", "Space & Science", "Digital Creators",
    "Startup India", "Cyber Security", "Smart Gadgets", "Exam & Career Tips",
    "Clean Energy", "Defence Updates", "World Affairs", "Health & Fitness"
  ];

  const TRENDING_TOPICS = [
    "Top Tech Stories", "Stock & Crypto Watch", "National Policy", "New Launches",
    "Global Summits", "Education Updates", "Sports Highlights", "Weather Today"
  ];

  const POPULAR_CATEGORIES = [
    "Headlines", "Technology", "Information Technology", "Education",
    "Defence", "Business", "World", "National",
    "Sports", "Science", "Health", "Automobiles"
  ];

  const TRENDING_VIDEOS = [
    "Tech & Gadget Breakdowns in 60 Seconds",
    "Weekly Market & Economy Wrap",
    "Top Science & Space Highlights",
    "Quick Explainer: How Digital Systems Work"
  ];

  const LATEST_NEWS_ITEMS = [
    "Live updates across national, global, and tech desks",
    "Curated daily briefs with clean editorial readability",
    "Auto-rotating highlights with 30-day freshness window",
    "Installable web app experience on mobile and desktop"
  ];

  function handleTopicClick(label) {
    const searchInput =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Search" i]') ||
      document.querySelector('#searchInput, #search, .search-input');

    if (searchInput) {
      searchInput.value = label;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const matchEl = Array.from(
      document.querySelectorAll("button, a, [data-category], [data-topic]")
    ).find((el) => {
      if (el.closest("#mirkuk-editorial-footer")) return false;
      const text = (el.dataset.category || el.dataset.topic || el.textContent || "").trim().toLowerCase();
      return text === label.toLowerCase();
    });

    if (matchEl) {
      matchEl.click();
      matchEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function makeGridSection(title, items, columns = 4) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "margin-top: 24px; padding-top: 18px; border-top: 1px solid #e5e7eb;";

    const h = document.createElement("h3");
    h.textContent = title;
    h.style.cssText = "margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #18191a;";

    const grid = document.createElement("div");
    grid.style.cssText = display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px 16px;;

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item;
      btn.style.cssText = [
        "text-align: left",
        "background: none",
        "border: none",
        "padding: 3px 0",
        "font-size: 13px",
        "color: #374151",
        "cursor: pointer"
      ].join(";");
      btn.addEventListener("mouseenter", () => (btn.style.color = "#c8102e"));
      btn.addEventListener("mouseleave", () => (btn.style.color = "#374151"));
      btn.addEventListener("click", () => handleTopicClick(item));
      grid.appendChild(btn);
    });

    wrap.appendChild(h);
    wrap.appendChild(grid);
    return wrap;
  }

  function renderEditorialFooter() {
    if (document.getElementById("mirkuk-editorial-footer")) return;

    const footer = document.createElement("footer");
    footer.id = "mirkuk-editorial-footer";
    footer.style.cssText = [
      "margin-top: 32px",
      "background: #ffffff",
      "color: #18191a",
      "border-top: 2px solid #18191a",
      "padding: 28px 16px 24px 16px"
    ].join(";");

    const inner = document.createElement("div");
    inner.style.cssText = "max-width: 1200px; margin: 0 auto;";

    const topRow = document.createElement("div");
    topRow.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;";

    const brandCol = document.createElement("div");
    brandCol.innerHTML = 
      <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.04em; color: #c8102e; margin-bottom: 10px;">MIRKUK NEWS</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; font-size: 13px; color: #374151;">
        <span>About Us</span>
        <span>Advertise</span>
        <span>Privacy Policy</span>
        <span>Terms &amp; Conditions</span>
        <span>Editorial Desk</span>
        <span>Contact</span>
      </div>
    ;
    topRow.appendChild(brandCol);

    Object.entries(FOOTER_COLUMNS).forEach(([colTitle, items]) => {
      const col = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.textContent = colTitle;
      titleEl.style.cssText = "font-size: 15px; font-weight: 700; margin-bottom: 10px; color: #18191a;";

      const listEl = document.createElement("div");
      listEl.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px;";

      items.forEach((label) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.style.cssText = "text-align:left; background:none; border:none; padding:2px 0; font-size:13px; color:#374151; cursor:pointer;";
        b.addEventListener("mouseenter", () => (b.style.color = "#c8102e"));
        b.addEventListener("mouseleave", () => (b.style.color = "#374151"));
        b.addEventListener("click", () => handleTopicClick(label));
        listEl.appendChild(b);
      });

      col.appendChild(titleEl);
      col.appendChild(listEl);
      topRow.appendChild(col);
    });

    inner.appendChild(topRow);
    inner.appendChild(makeGridSection("Hot on the Web", HOT_ON_THE_WEB));
    inner.appendChild(makeGridSection("Trending Topics", TRENDING_TOPICS));
    inner.appendChild(makeGridSection("Popular Categories", POPULAR_CATEGORIES));
    inner.appendChild(makeGridSection("Trending Videos", TRENDING_VIDEOS));
    inner.appendChild(makeGridSection("Latest News", LATEST_NEWS_ITEMS));

    const bottomBar = document.createElement("div");
    bottomBar.style.cssText = [
      "margin-top: 24px",
      "padding-top: 16px",
      "border-top: 1px solid #e5e7eb",
      "text-align: center",
      "font-size: 12px",
      "color: #6b7280"
    ].join(";");

    bottomBar.innerHTML = 
      <div>Copyright &copy;  Mirkuk News. All rights reserved.</div>
      <div style="margin-top: 10px; font-weight: 600; color: #374151;">Follow Us On</div>
      <div style="margin-top: 8px; display: flex; justify-content: center; gap: 10px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#111827;font-weight:700;">f</span>
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#111827;font-weight:700;">X</span>
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#111827;font-weight:700;">▶</span>
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#111827;font-weight:700;">in</span>
      </div>
    ;

    inner.appendChild(bottomBar);
    footer.appendChild(inner);

    const oldFooter = document.querySelector("footer");
    if (oldFooter && oldFooter.parentNode) {
      oldFooter.parentNode.replaceChild(footer, oldFooter);
    } else {
      document.body.appendChild(footer);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderEditorialFooter);
  } else {
    renderEditorialFooter();
  }
})();
/* === MIRKUK TOI-STYLE FOOTER BOUNDARY END === */
