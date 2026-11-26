/* === MIRKUK FULL BROADSHEET LOWER SECTIONS JS START === */
(function () {
  const NAV_SECTIONS = [
    {
      label: "Top Stories",
      cols: {
        "Highlights": ["Latest News", "National", "World", "Defence", "Education"],
        "More Desks": ["Business", "Sports", "Celebrities", "Beauty", "Fashion"]
      },
      thumbs: [
        { title: "National & policy updates across major desks", img: "mirkuk-news/images/local.jpg", topic: "National" },
        { title: "Global dispatches & international shifts", img: "mirkuk-news/images/weather.jpg", topic: "World" },
        { title: "Defence readiness & strategic briefs", img: "mirkuk-news/images/hero.jpg", topic: "Defence" }
      ]
    },
    {
      label: "Entertainment",
      cols: {
        "Showbiz & Style": ["Celebrities", "Movies", "Web Series", "Music", "Red Carpet"],
        "Beauty & Fashion": ["Beauty", "Skincare", "Fashion", "Street Style", "Wardrobe"]
      },
      thumbs: [
        { title: "Screen spotlights & celebrity moments", img: "mirkuk-news/images/culture.jpg", topic: "Celebrities" },
        { title: "Daily skincare & grooming routines", img: "mirkuk-news/images/arts.jpg", topic: "Beauty" },
        { title: "Seasonal fashion & styling edits", img: "mirkuk-news/images/culture.jpg", topic: "Fashion" }
      ]
    },
    {
      label: "Tech",
      cols: {
        "Technology": ["Technology", "Information Technology", "AI & Tools", "Apps & Web", "Gadgets"],
        "Business": ["Business", "Startups", "Economy", "Finance", "Careers"]
      },
      thumbs: [
        { title: "Lightweight web & developer workflows", img: "mirkuk-news/images/tech.jpg", topic: "Technology" },
        { title: "Independent builders & digital products", img: "mirkuk-news/images/business.jpg", topic: "Business" },
        { title: "Fast browser tools for everyday tasks", img: "mirkuk-news/images/tech.jpg", topic: "Information Technology" }
      ]
    },
    {
      label: "Sports",
      cols: {
        "Sports Desk": ["Sports", "Cricket", "Football", "Athletics", "Match Notes"]
      },
      thumbs: [
        { title: "Key match highlights & tournament updates", img: "mirkuk-news/images/sports.jpg", topic: "Sports" }
      ]
    }
  ];

  const THREE_DOT_ITEMS = [
    { label: "Celebrities", topic: "Celebrities" },
    { label: "Beauty", topic: "Beauty" },
    { label: "Fashion", topic: "Fashion" },
    { label: "Technology", topic: "Technology" },
    { label: "Defence", topic: "Defence" },
    { label: "Business", topic: "Business" },
    { label: "Browse 195 Countries", action: "countries" }
  ];

  const LEFT_STORIES = [
    { cat: "Celebrities", title: "Spotlight on emerging creators, cinema, and stage stories", img: "mirkuk-news/images/culture.jpg", topic: "Celebrities" },
    { cat: "Beauty", title: "Practical skincare & grooming habits for daily routines", img: "mirkuk-news/images/arts.jpg", topic: "Beauty" },
    { cat: "Fashion", title: "Modern streetwear, layering, and seasonal style notes", img: "mirkuk-news/images/culture.jpg", topic: "Fashion" }
  ];

  const FEATURED_VIDEOS = [
    { title: "Evening Dispatch: Key Highlights", img: "mirkuk-news/images/hero.jpg", topic: "National" },
    { title: "Tech & Gadgets Rundown", img: "mirkuk-news/images/tech.jpg", topic: "Technology" },
    { title: "Sports Desk Wrap", img: "mirkuk-news/images/sports.jpg", topic: "Sports" },
    { title: "Culture & Stage Notes", img: "mirkuk-news/images/culture.jpg", topic: "Celebrities" }
  ];

  const THREE_DESKS = [
    {
      heading: "Technology >",
      topic: "Technology",
      lead: { title: "Fast browser builds & clean developer workflows for everyday use", img: "mirkuk-news/images/tech.jpg" },
      items: [
        "How static front-end sites stay fast on low-memory devices",
        "Key updates in web standards, tooling, and security",
        "Practical tips for organizing local scripts and repositories",
        "What to check before shipping a new layout update"
      ]
    },
    {
      heading: "Gadgets Now >",
      topic: "Gadgets",
      lead: { title: "Everyday hardware, wearables, and mobile setups reviewed", img: "mirkuk-news/images/tech.jpg" },
      items: [
        "Battery life & display clarity notes for daily commutes",
        "Choosing accessories that balance cost and durability",
        "Storage & performance habits for smooth multitasking",
        "Quick checklist before buying a new device"
      ]
    },
    {
      heading: "Also In News >",
      topic: "Business",
      lead: { title: "Small-business operations, regional updates, and public briefs", img: "mirkuk-news/images/business.jpg" },
      items: [
        "How local sellers streamline inventory and customer outreach",
        "Key economic & policy takeaways for independent builders",
        "Community & civic updates across major cities",
        "Weekly roundup of notable stories across desks"
      ]
    }
  ];

  const SIX_STRIP_CARDS = [
    { title: "Creator & stage highlights across major shows", img: "mirkuk-news/images/culture.jpg", topic: "Celebrities" },
    { title: "Seasonal wardrobe & styling guides for daily wear", img: "mirkuk-news/images/arts.jpg", topic: "Fashion" },
    { title: "Skincare & grooming routines that stay simple", img: "mirkuk-news/images/arts.jpg", topic: "Beauty" },
    { title: "City safety, civic updates & local reports", img: "mirkuk-news/images/local.jpg", topic: "National" },
    { title: "Lightweight web builds & developer setups", img: "mirkuk-news/images/tech.jpg", topic: "Technology" },
    { title: "Regional commerce & small-business briefs", img: "mirkuk-news/images/business.jpg", topic: "Business" }
  ];

  const FOCUS_TAGS = ["Celebrities", "Beauty", "Fashion", "Technology", "Defence", "Business", "Sports", "World"];

  function filterByTopic(topic) {
    const search =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Search" i]') ||
      document.querySelector("#searchInput, #search, .search-input");
    if (search) {
      search.value = topic;
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function cleanupExcludedSections() {
    const idsToRemove = ["mk-live-desk-box"];
    idsToRemove.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const selectorsToHide = [
      '[data-section="24-7-live"]',
      '[data-section="global-stock-market"]',
      '[data-section="more-sections"]',
      '[data-section="radar-feedback"]',
      ".mirkuk-live-247",
      ".mirkuk-stock-market",
      ".mirkuk-more-sections",
      ".mirkuk-radar-feedback"
    ];
    selectorsToHide.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.display = "none";
      });
    });

    // Also hide any standalone heading/card containing 24/7 Live, Global Stock Market, More Sections, or Radar Feedback
    const blockedPhrases = ["24/7 live", "global stock market", "more sections", "radar feedback"];
    document.querySelectorAll("section, article, aside, div").forEach((el) => {
      if (el.id === "mk-front-editorial" || el.id === "mk-pro-masthead") return;
      if (el.closest("#mk-front-editorial") || el.closest("#mk-pro-masthead")) return;
      const firstLine = (el.textContent || "").trim().toLowerCase().slice(0, 120);
      if (blockedPhrases.some((p) => firstLine.includes(p)) && el.children.length <= 6) {
        el.style.display = "none";
      }
    });
  }

  function renderProLayout() {
    cleanupExcludedSections();
    if (document.getElementById("mk-pro-masthead")) return;

    const nowText = new Date().toLocaleString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const masthead = document.createElement("header");
    masthead.id = "mk-pro-masthead";
    masthead.className = "mk-masthead";
    masthead.innerHTML = `
      <div class="mk-masthead-top">
        <span>Edition: <strong>Global &amp; India</strong></span>
        <span>${nowText}</span>
        <span>Mirkuk Editorial Desk</span>
      </div>
      <div class="mk-brand-center">
        <h1 class="mk-brand-title">Mirkuk News</h1>
      </div>
      <nav class="mk-nav-strip" aria-label="Primary Sections">
        <div class="mk-nav-links" id="mk-nav-links"></div>
        <div class="mk-dots-wrap" id="mk-dots-wrap">
          <button type="button" class="mk-dots-btn" id="mk-dots-btn" aria-expanded="false" aria-label="More sections">•••</button>
          <div class="mk-dots-menu" id="mk-dots-menu" role="menu"></div>
        </div>
        <div class="mk-sub-dropdown" id="mk-sub-dropdown"></div>
      </nav>
    `;

    const banner = document.getElementById("mirkuk-refresh-banner");
    if (banner && banner.nextSibling) {
      banner.parentNode.insertBefore(masthead, banner.nextSibling);
    } else {
      document.body.insertBefore(masthead, document.body.firstChild);
    }

    const navLinksEl = document.getElementById("mk-nav-links");
    const dotsBtn = document.getElementById("mk-dots-btn");
    const dotsMenu = document.getElementById("mk-dots-menu");
    const subDropdown = document.getElementById("mk-sub-dropdown");

    let activeNavIndex = null;

    function closeAllMenus() {
      dotsMenu.classList.remove("is-open");
      dotsBtn.classList.remove("is-open");
      dotsBtn.setAttribute("aria-expanded", "false");
      subDropdown.classList.remove("is-open");
      activeNavIndex = null;
      navLinksEl.querySelectorAll(".mk-nav-btn").forEach((b) => b.classList.remove("is-active"));
    }

    function openSectionDropdown(idx, btnEl) {
      const wasSame = activeNavIndex === idx && subDropdown.classList.contains("is-open");
      closeAllMenus();
      if (wasSame) return;

      activeNavIndex = idx;
      btnEl.classList.add("is-active");
      const sec = NAV_SECTIONS[idx];

      const colsHtml = Object.entries(sec.cols || {})
        .map(
          ([colTitle, items]) => `
          <div>
            <div class="mk-sub-col-title">${colTitle}</div>
            ${items
              .map(
                (it) =>
                  `<button type="button" class="mk-sub-link-btn" data-topic="${it}">${it}</button>`
              )
              .join("")}
          </div>
        `
        )
        .join("");

      const thumbsHtml = (sec.thumbs || [])
        .map(
          (th) => `
          <div class="mk-sub-thumb-card" data-topic="${th.topic}">
            <img src="${th.img}" alt="${th.title}" onerror="this.style.display='none';" />
            <p>${th.title}</p>
          </div>
        `
        )
        .join("");

      subDropdown.innerHTML = `
        <div class="mk-sub-grid-cols">${colsHtml}</div>
        ${thumbsHtml ? `<div class="mk-sub-thumb-strip">${thumbsHtml}</div>` : ""}
      `;
      subDropdown.classList.add("is-open");
    }

    NAV_SECTIONS.forEach((sec, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mk-nav-btn";
      btn.textContent = sec.label;
      btn.addEventListener("mouseenter", () => openSectionDropdown(idx, btn));
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openSectionDropdown(idx, btn);
      });
      navLinksEl.appendChild(btn);
    });

    THREE_DOT_ITEMS.forEach((item) => {
      const mBtn = document.createElement("button");
      mBtn.type = "button";
      mBtn.setAttribute("role", "menuitem");
      mBtn.textContent = item.label;
      mBtn.addEventListener("click", () => {
        closeAllMenus();
        if (item.action === "countries") {
          const cBtn = document.getElementById("mirkuk-open-countries-btn");
          if (cBtn) cBtn.click();
        } else if (item.topic) {
          filterByTopic(item.topic);
        }
      });
      dotsMenu.appendChild(mBtn);
    });

    dotsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dotsMenu.classList.contains("is-open");
      closeAllMenus();
      if (willOpen) {
        dotsMenu.classList.add("is-open");
        dotsBtn.classList.add("is-open");
        dotsBtn.setAttribute("aria-expanded", "true");
      }
    });

    subDropdown.addEventListener("click", (e) => {
      const target = e.target.closest("[data-topic]");
      if (target) {
        const topic = target.getAttribute("data-topic");
        closeAllMenus();
        filterByTopic(topic);
      }
    });

    masthead.addEventListener("mouseleave", () => {
      subDropdown.classList.remove("is-open");
      activeNavIndex = null;
      navLinksEl.querySelectorAll(".mk-nav-btn").forEach((b) => b.classList.remove("is-active"));
    });

    document.addEventListener("click", (e) => {
      if (!masthead.contains(e.target)) {
        closeAllMenus();
      }
    });

    const frontWrap = document.createElement("section");
    frontWrap.id = "mk-front-editorial";
    frontWrap.className = "mk-editorial-wrap";

    const leftHtml = LEFT_STORIES.map(
      (st) => `
      <article class="mk-rail-card" data-topic="${st.topic}">
        <div class="mk-rail-cat">${st.cat}</div>
        <div class="mk-rail-row">
          <img src="${st.img}" alt="${st.cat}" onerror="this.style.display='none';" />
          <h3 class="mk-rail-title">${st.title}</h3>
        </div>
      </article>
    `
    ).join("");

    const videoTilesHtml = FEATURED_VIDEOS.map(
      (v) => `
      <div class="mk-video-tile" data-topic="${v.topic}">
        <img src="${v.img}" alt="${v.title}" onerror="this.style.display='none';" />
        <div class="mk-video-tile-caption">${v.title}</div>
      </div>
    `
    ).join("");

    const threeDesksHtml = THREE_DESKS.map(
      (desk) => `
      <div class="mk-desk-col">
        <h3 class="mk-section-heading-link" data-topic="${desk.topic}">${desk.heading}</h3>
        <div class="mk-desk-lead-card" data-topic="${desk.topic}">
          <img src="${desk.lead.img}" alt="${desk.heading}" onerror="this.style.display='none';" />
          <h4>${desk.lead.title}</h4>
        </div>
        <ul class="mk-desk-list">
          ${desk.items.map((it) => `<li data-topic="${desk.topic}">${it}</li>`).join("")}
        </ul>
      </div>
    `
    ).join("");

    const sixStripHtml = SIX_STRIP_CARDS.map(
      (c) => `
      <div class="mk-six-card" data-topic="${c.topic}">
        <img src="${c.img}" alt="${c.title}" onerror="this.style.display='none';" />
        <p>${c.title}</p>
      </div>
    `
    ).join("");

    const focusHtml = FOCUS_TAGS.map(
      (tag) => `<button type="button" class="mk-focus-pill" data-topic="${tag}">${tag}</button>`
    ).join("");

    frontWrap.innerHTML = `
      <div class="mk-front-grid">
        <aside class="mk-side-rail" aria-label="Category Highlights">${leftHtml}</aside>
        <main class="mk-lead-story">
          <h2 class="mk-lead-headline">Mirkuk Editorial Desk: Celebrities, Beauty, Fashion &amp; Global Briefs</h2>
          <div class="mk-lead-media">
            <img src="mirkuk-news/images/hero.jpg" alt="Mirkuk News Lead" onerror="this.style.display='none';" />
          </div>
          <p class="mk-lead-summary">
            Explore curated stories across Celebrities, Beauty, Fashion, Technology, Defence, Business, and 195 country editions in a clean broadsheet layout.
          </p>
        </main>
        <aside class="mk-right-panel" aria-label="Featured Highlights">
          <div class="mk-box-card">
            <h3 class="mk-box-heading">Mirkuk Edition Highlights</h3>
            <p style="margin:0 0 8px;font-size:12px;color:#5c6470;">
              Browse all 195 countries or jump straight into a desk.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              <button type="button" class="mk-nav-btn" data-topic="Celebrities">Celebrities</button>
              <button type="button" class="mk-nav-btn" data-topic="Beauty">Beauty</button>
              <button type="button" class="mk-nav-btn" data-topic="Fashion">Fashion</button>
              <button type="button" class="mk-nav-btn" data-topic="Technology">Tech</button>
            </div>
          </div>
          <div class="mk-box-card">
            <h3 class="mk-box-heading">Featured Videos &gt;</h3>
            <div class="mk-video-grid-2">${videoTilesHtml}</div>
          </div>
        </aside>
      </div>

      <div class="mk-audio-bar" aria-label="Audio Briefing">
        <button type="button" class="mk-audio-play-btn" id="mk-audio-toggle">▶ Briefing</button>
        <span class="mk-audio-title" id="mk-audio-status">Top News Audio Briefing — Mirkuk Desk</span>
        <div class="mk-audio-track"><div class="mk-audio-fill" id="mk-audio-fill"></div></div>
        <span style="font-size:12px;color:#5c6470;">04:25</span>
      </div>

      <div class="mk-section-block">
        <div class="mk-three-desk-grid">${threeDesksHtml}</div>
      </div>

      <div class="mk-section-block">
        <div class="mk-section-head-row">
          <h3 class="mk-section-heading-link" data-topic="Celebrities">Entertainment &amp; Spotlight &gt;</h3>
        </div>
        <div class="mk-six-grid">${sixStripHtml}</div>
        <div class="mk-focus-row">
          <span class="mk-focus-label">In Focus</span>
          ${focusHtml}
        </div>
      </div>

      <div class="mk-section-block">
        <div class="mk-split-video-grid">
          <div>
            <h3 class="mk-section-heading-link" data-topic="World">World &amp; Global Desks &gt;</h3>
            <div class="mk-two-photo-pair">
              <div class="mk-photo-story" data-topic="World">
                <img src="mirkuk-news/images/weather.jpg" alt="World Desk 1" onerror="this.style.display='none';" />
                <h4>Cross-border policy, diplomacy &amp; global dispatches</h4>
              </div>
              <div class="mk-photo-story" data-topic="Defence">
                <img src="mirkuk-news/images/hero.jpg" alt="World Desk 2" onerror="this.style.display='none';" />
                <h4>Strategic briefs, security updates &amp; regional shifts</h4>
              </div>
            </div>
            <ul class="mk-desk-list">
              <li data-topic="World">International trade &amp; supply route updates across regions</li>
              <li data-topic="Business">Global technology &amp; digital policy developments</li>
              <li data-topic="National">Key domestic policy &amp; public service updates</li>
            </ul>
          </div>
          <div>
            <h4 style="margin:0 0 12px;font-size:15px;font-weight:800;">World &amp; Sports Clips &gt;</h4>
            <div class="mk-video-grid-2">
              <div class="mk-video-tile" data-topic="World">
                <img src="mirkuk-news/images/weather.jpg" alt="Clip 1" onerror="this.style.display='none';" />
                <div class="mk-video-tile-caption">Global Briefing</div>
              </div>
              <div class="mk-video-tile" data-topic="Sports">
                <img src="mirkuk-news/images/sports.jpg" alt="Clip 2" onerror="this.style.display='none';" />
                <div class="mk-video-tile-caption">Match &amp; Field Notes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Sports">Sports &amp; Active Culture &gt;</h3>
        <div class="mk-six-grid">${sixStripHtml}</div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Beauty">Lifestyle, Beauty &amp; Fashion &gt;</h3>
        <div class="mk-six-grid">${sixStripHtml}</div>
      </div>
    `;

    frontWrap.addEventListener("click", (e) => {
      const t = e.target.closest("[data-topic]");
      if (t) filterByTopic(t.getAttribute("data-topic"));
    });

    masthead.insertAdjacentElement("afterend", frontWrap);

    const audioBtn = document.getElementById("mk-audio-toggle");
    const audioStatus = document.getElementById("mk-audio-status");
    const audioFill = document.getElementById("mk-audio-fill");
    let playing = false;
    let progress = 28;

    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        playing = !playing;
        audioBtn.textContent = playing ? "❚❚ Pause" : "▶ Briefing";
        if (audioStatus) {
          audioStatus.textContent = playing
            ? "Playing Desk Briefing — Mirkuk Editorial"
            : "Top News Audio Briefing — Mirkuk Desk";
        }
        if (playing && audioFill) {
          progress = progress >= 95 ? 20 : progress + 18;
          audioFill.style.width = progress + "%";
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderProLayout);
  } else {
    renderProLayout();
  }
  window.addEventListener("load", () => setTimeout(cleanupExcludedSections, 400));
})();
/* === MIRKUK FULL BROADSHEET LOWER SECTIONS JS END === */