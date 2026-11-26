/* === MIRKUK CLEAN BROADSHEET TOP & CARDS JS START === */
(function () {
  const TOP_CATEGORIES = [
    "Videos",
    "India",
    "World",
    "Business",
    "Tech",
    "Gadgets Now",
    "Cricket",
    "Sports",
    "Entertainment",
    "Auto",
    "Travel",
    "TV"
  ];

  const EXTRA_CATEGORIES = [
    "Celebrities",
    "Beauty",
    "Fashion",
    "Defence",
    "Education",
    "Science",
    "Lifestyle"
  ];

  const LEFT_STORIES = [
    { cat: "India", title: "National & policy updates across major desks", img: "mirkuk-news/images/local.jpg", topic: "India" },
    { cat: "World", title: "Global dispatches & cross-border developments", img: "mirkuk-news/images/weather.jpg", topic: "World" },
    { cat: "Entertainment", title: "Screen spotlights, culture & stage stories", img: "mirkuk-news/images/culture.jpg", topic: "Entertainment" }
  ];

  const FEATURED_VIDEOS = [
    { title: "Desk Highlights: Key Stories", img: "mirkuk-news/images/hero.jpg", topic: "Videos" },
    { title: "Tech & Gadgets Rundown", img: "mirkuk-news/images/tech.jpg", topic: "Tech" },
    { title: "Sports & Match Notes", img: "mirkuk-news/images/sports.jpg", topic: "Sports" },
    { title: "Culture & Lifestyle Clips", img: "mirkuk-news/images/arts.jpg", topic: "Entertainment" }
  ];

  const THREE_DESKS = [
    {
      heading: "Tech >",
      topic: "Tech",
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
      topic: "Gadgets Now",
      lead: { title: "Everyday hardware, wearables, and mobile setups reviewed", img: "mirkuk-news/images/tech.jpg" },
      items: [
        "Battery life & display clarity notes for daily commutes",
        "Choosing accessories that balance cost and durability",
        "Storage & performance habits for smooth multitasking",
        "Quick checklist before buying a new device"
      ]
    },
    {
      heading: "Business >",
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
    { title: "Creator & stage highlights across major shows", img: "mirkuk-news/images/culture.jpg", topic: "Entertainment" },
    { title: "Seasonal wardrobe & styling guides for daily wear", img: "mirkuk-news/images/arts.jpg", topic: "Fashion" },
    { title: "Skincare & grooming routines that stay simple", img: "mirkuk-news/images/arts.jpg", topic: "Beauty" },
    { title: "City safety, civic updates & local reports", img: "mirkuk-news/images/local.jpg", topic: "India" },
    { title: "Lightweight web builds & developer setups", img: "mirkuk-news/images/tech.jpg", topic: "Tech" },
    { title: "Regional commerce & small-business briefs", img: "mirkuk-news/images/business.jpg", topic: "Business" }
  ];

  const FIVE_VIDEO_STRIP = [
    { title: "Morning Focus & Daily Habits", img: "mirkuk-news/images/arts.jpg", topic: "Beauty" },
    { title: "Creative & Stage Spotlights", img: "mirkuk-news/images/culture.jpg", topic: "Entertainment" },
    { title: "Smart Tech Walkarounds", img: "mirkuk-news/images/tech.jpg", topic: "Tech" },
    { title: "Match Highlights & Analysis", img: "mirkuk-news/images/sports.jpg", topic: "Sports" },
    { title: "Regional & Policy Rundown", img: "mirkuk-news/images/local.jpg", topic: "India" }
  ];

  const SIX_MINI_DESKS = [
    { title: "Science >", topic: "Science", img: "mirkuk-news/images/tech.jpg", links: ["Space & discovery notes", "Lab & research briefs", "Data & climate updates", "Everyday science Q&A"] },
    { title: "Astrology >", topic: "Lifestyle", img: "mirkuk-news/images/arts.jpg", links: ["Daily zodiac & routine notes", "Weekly planner overview", "Mindful habits check", "Seasonal sky highlights"] },
    { title: "Environment >", topic: "India", img: "mirkuk-news/images/weather.jpg", links: ["Air quality & city weather", "Clean energy & green tech", "Water & urban conservation", "Wildlife & habitat reports"] },
    { title: "Speaking Tree >", topic: "Lifestyle", img: "mirkuk-news/images/culture.jpg", links: ["Reflections on calm focus", "Practical life lessons", "Mindful reading notes", "Community wisdom"] },
    { title: "Sunday Times >", topic: "Entertainment", img: "mirkuk-news/images/arts.jpg", links: ["Weekend long reads", "Culture & arts essays", "Interviews & profiles", "Curated photo stories"] },
    { title: "Tech Tips >", topic: "Tech", img: "mirkuk-news/images/tech.jpg", links: ["Speed up browser workflows", "Keyboard & terminal shortcuts", "Battery & storage care", "Clean file organization"] }
  ];

  const FOCUS_TAGS = ["India", "World", "Business", "Tech", "Cricket", "Sports", "Entertainment", "Travel"];

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
    const oldDeskBox = document.getElementById("mk-live-desk-box");
    if (oldDeskBox) oldDeskBox.remove();

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

    const masthead = document.createElement("header");
    masthead.id = "mk-pro-masthead";
    masthead.className = "mk-masthead";
    masthead.innerHTML = `
      <div class="mk-brand-center">
        <div class="mk-brand-sub">Global &amp; India Broadsheet</div>
        <h1 class="mk-brand-title">Mirkuk News</h1>
      </div>
      <nav class="mk-cat-bar" aria-label="Categories">
        <div id="mk-cat-buttons" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;"></div>
        <div class="mk-more-wrap" id="mk-more-wrap">
          <button type="button" class="mk-more-dots-btn" id="mk-more-dots-btn" aria-expanded="false">•••</button>
          <div class="mk-more-menu" id="mk-more-menu" role="menu"></div>
        </div>
      </nav>
    `;

    const banner = document.getElementById("mirkuk-refresh-banner");
    if (banner && banner.nextSibling) {
      banner.parentNode.insertBefore(masthead, banner.nextSibling);
    } else {
      document.body.insertBefore(masthead, document.body.firstChild);
    }

    const catButtonsWrap = document.getElementById("mk-cat-buttons");
    const moreBtn = document.getElementById("mk-more-dots-btn");
    const moreMenu = document.getElementById("mk-more-menu");

    TOP_CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mk-cat-btn";
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        catButtonsWrap.querySelectorAll(".mk-cat-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        filterByTopic(cat);
      });
      catButtonsWrap.appendChild(btn);
    });

    EXTRA_CATEGORIES.forEach((cat) => {
      const itemBtn = document.createElement("button");
      itemBtn.type = "button";
      itemBtn.setAttribute("role", "menuitem");
      itemBtn.textContent = cat;
      itemBtn.addEventListener("click", () => {
        moreMenu.classList.remove("is-open");
        moreBtn.classList.remove("is-open");
        filterByTopic(cat);
      });
      moreMenu.appendChild(itemBtn);
    });

    const countryBtn = document.createElement("button");
    countryBtn.type = "button";
    countryBtn.setAttribute("role", "menuitem");
    countryBtn.textContent = "Browse 195 Countries";
    countryBtn.addEventListener("click", () => {
      moreMenu.classList.remove("is-open");
      moreBtn.classList.remove("is-open");
      const openCountries = document.getElementById("mirkuk-open-countries-btn");
      if (openCountries) openCountries.click();
    });
    moreMenu.appendChild(countryBtn);

    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !moreMenu.classList.contains("is-open");
      moreMenu.classList.toggle("is-open", willOpen);
      moreBtn.classList.toggle("is-open", willOpen);
      moreBtn.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (e) => {
      if (!masthead.contains(e.target)) {
        moreMenu.classList.remove("is-open");
        moreBtn.classList.remove("is-open");
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

    const fiveStripHtml = FIVE_VIDEO_STRIP.map(
      (v) => `
      <div class="mk-six-card" data-topic="${v.topic}">
        <img src="${v.img}" alt="${v.title}" onerror="this.style.display='none';" />
        <p>${v.title}</p>
      </div>
    `
    ).join("");

    const sixMiniDesksHtml = SIX_MINI_DESKS.map(
      (col) => `
      <div class="mk-mini-desk-col">
        <h4 data-topic="${col.topic}">${col.title}</h4>
        <img src="${col.img}" alt="${col.title}" data-topic="${col.topic}" onerror="this.style.display='none';" />
        <ul class="mk-desk-list">
          ${col.links.map((lk) => `<li data-topic="${col.topic}">${lk}</li>`).join("")}
        </ul>
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
          <h2 class="mk-lead-headline">Mirkuk News: Clean Broadsheet Edition Across India &amp; Global Desks</h2>
          <div class="mk-lead-media">
            <img src="mirkuk-news/images/hero.jpg" alt="Mirkuk News Lead" onerror="this.style.display='none';" />
          </div>
          <p class="mk-lead-summary">
            Read top stories across Videos, India, World, Business, Tech, Gadgets Now, Cricket, Sports, Entertainment, Auto, Travel, and TV.
          </p>
        </main>
        <aside class="mk-right-panel" aria-label="Featured Highlights">
          <div>
            <h3 class="mk-flat-panel-title">Quick Desks</h3>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              <button type="button" class="mk-cat-btn" data-topic="India">India</button>
              <button type="button" class="mk-cat-btn" data-topic="Tech">Tech</button>
              <button type="button" class="mk-cat-btn" data-topic="Cricket">Cricket</button>
              <button type="button" class="mk-cat-btn" data-topic="Entertainment">Entertainment</button>
            </div>
          </div>
          <div>
            <h3 class="mk-flat-panel-title">Featured Videos &gt;</h3>
            <div class="mk-video-grid-2">${videoTilesHtml}</div>
          </div>
        </aside>
      </div>

      <div class="mk-audio-bar" aria-label="Audio Briefing">
        <button type="button" class="mk-audio-play-btn" id="mk-audio-toggle">▶ Briefing</button>
        <span class="mk-audio-title" id="mk-audio-status">Top News Audio Briefing — Mirkuk Desk</span>
        <div class="mk-audio-track"><div class="mk-audio-fill" id="mk-audio-fill"></div></div>
        <span style="font-size:12px;color:#555e68;">04:25</span>
      </div>

      <div class="mk-section-block">
        <div class="mk-three-desk-grid">${threeDesksHtml}</div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Entertainment">Entertainment &gt;</h3>
        <div class="mk-ent-three-grid">
          <div>
            <div class="mk-two-photo-pair">
              <div class="mk-photo-story" data-topic="Entertainment">
                <img src="mirkuk-news/images/culture.jpg" alt="Entertainment" onerror="this.style.display='none';" />
                <h4>Spotlight on actors, creators &amp; screen releases</h4>
              </div>
              <div class="mk-photo-story" data-topic="Fashion">
                <img src="mirkuk-news/images/arts.jpg" alt="Fashion & Style" onerror="this.style.display='none';" />
                <h4>Seasonal fashion &amp; daily style picks</h4>
              </div>
            </div>
          </div>
          <div>
            <ul class="mk-desk-list">
              <li data-topic="Entertainment">New film &amp; screen announcements catching viewer attention</li>
              <li data-topic="Beauty">Skincare &amp; grooming routines explained simply</li>
              <li data-topic="Fashion">Everyday layering ideas for work and casual outings</li>
              <li data-topic="Entertainment">Behind-the-scenes stories from music and stage</li>
            </ul>
          </div>
          <div class="mk-side-video-stack">
            <h4 class="mk-flat-panel-title">Entertainment Videos &gt;</h4>
            <div class="mk-side-video-row" data-topic="Entertainment">
              <img src="mirkuk-news/images/culture.jpg" alt="Video 1" onerror="this.style.display='none';" />
              <span>Spotlight Clips &amp; Stage Notes</span>
            </div>
            <div class="mk-side-video-row" data-topic="Fashion">
              <img src="mirkuk-news/images/arts.jpg" alt="Video 2" onerror="this.style.display='none';" />
              <span>Style &amp; Routine Walkthroughs</span>
            </div>
          </div>
        </div>
        <div class="mk-focus-row">
          <span class="mk-focus-label">In Focus</span>
          ${focusHtml}
        </div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="India">Trending &gt;</h3>
        <div class="mk-six-grid">${sixStripHtml}</div>
      </div>

      <div class="mk-section-block">
        <div class="mk-split-video-grid">
          <div>
            <h3 class="mk-section-heading-link" data-topic="Videos">Videos &gt;</h3>
            <div class="mk-photo-story" data-topic="Videos">
              <img src="mirkuk-news/images/hero.jpg" alt="Featured Video" style="height:215px;" onerror="this.style.display='none';" />
              <h4 style="font-size:15px;margin-top:8px;">Desk Highlights: Key Stories &amp; Visual Briefings</h4>
            </div>
          </div>
          <div class="mk-side-video-stack">
            <div class="mk-side-video-row" data-topic="Tech">
              <img src="mirkuk-news/images/tech.jpg" alt="Side Video 1" onerror="this.style.display='none';" />
              <span>Tech &amp; Gadget Rundown</span>
            </div>
            <div class="mk-side-video-row" data-topic="Sports">
              <img src="mirkuk-news/images/sports.jpg" alt="Side Video 2" onerror="this.style.display='none';" />
              <span>Match Highlights &amp; Field Notes</span>
            </div>
            <div class="mk-side-video-row" data-topic="Business">
              <img src="mirkuk-news/images/business.jpg" alt="Side Video 3" onerror="this.style.display='none';" />
              <span>Business &amp; Policy Brief</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Science">Science &amp; Tech &gt;</h3>
        <div class="mk-six-grid">${sixStripHtml}</div>
        <div class="mk-convo-banner">
          <div class="mk-convo-top">
            <button type="button" class="mk-convo-btn" data-topic="Tech">Start a conversation</button>
            <span class="mk-convo-badge">MK</span>
          </div>
          <div class="mk-convo-bottom">MIRKUK EDITORIAL DESK</div>
        </div>
      </div>

      <div class="mk-section-block">
        <div class="mk-select-showcase">
          <div>
            <div style="font-size:11px;letter-spacing:0.14em;font-weight:700;opacity:0.8;">MIRKUK SELECT</div>
            <h3 style="margin:8px 0 6px;font-family:Georgia,serif;font-size:21px;line-height:1.2;">Don't just read the story. Experience it.</h3>
            <p style="margin:0;font-size:12px;opacity:0.8;line-height:1.45;">Deeper visual features and curated desk picks.</p>
            <button type="button" class="mk-select-cta" data-topic="Entertainment">EXPLORE ALL</button>
          </div>
          <div class="mk-select-cards">
            <div class="mk-select-card" data-topic="Sports">
              <img src="mirkuk-news/images/sports.jpg" alt="Sports Feature" onerror="this.style.display='none';" />
              <div class="mk-select-card-label">Game Day Chronicles</div>
            </div>
            <div class="mk-select-card" data-topic="Entertainment">
              <img src="mirkuk-news/images/culture.jpg" alt="Culture Feature" onerror="this.style.display='none';" />
              <div class="mk-select-card-label">Culture &amp; Stage Stories</div>
            </div>
            <div class="mk-select-card" data-topic="Tech">
              <img src="mirkuk-news/images/tech.jpg" alt="Tech Feature" onerror="this.style.display='none';" />
              <div class="mk-select-card-label">Inside Modern Builds</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Videos">Spotlight Videos &gt;</h3>
        <div class="mk-five-grid">${fiveStripHtml}</div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Business">Business &gt;</h3>
        <div class="mk-sub-inline-links" style="margin-left:0;margin-bottom:10px;">
          <span data-topic="Business">Featured</span>
          <span data-topic="India">India</span>
          <span data-topic="World">International</span>
          <span data-topic="Tech">Digital</span>
        </div>
        <div class="mk-ent-three-grid">
          <div class="mk-photo-story" data-topic="Business">
            <img src="mirkuk-news/images/business.jpg" alt="Business Lead" style="height:150px;" onerror="this.style.display='none';" />
            <h4 style="margin-top:8px;">Market &amp; commerce updates across key sectors</h4>
          </div>
          <ul class="mk-desk-list">
            <li data-topic="Business">Small-business growth &amp; practical supply tips</li>
            <li data-topic="India">Policy &amp; economy takeaways for builders</li>
            <li data-topic="World">Global trade &amp; cross-border developments</li>
            <li data-topic="Tech">Digital tools &amp; workflow shifts</li>
          </ul>
          <div class="mk-side-video-stack">
            <h4 class="mk-flat-panel-title">Desk Quick Links</h4>
            <ul class="mk-desk-list">
              <li data-topic="Business">Business &amp; Commerce</li>
              <li data-topic="Tech">Technology</li>
              <li data-topic="Travel">Travel &amp; Auto</li>
            </ul>
          </div>
        </div>
        <div class="mk-focus-row">
          <span class="mk-focus-label">In Focus</span>
          ${focusHtml}
        </div>
      </div>

      <div class="mk-section-block">
        <h3 class="mk-section-heading-link" data-topic="Tech">Tech &amp; Gadgets &gt;</h3>
        <div class="mk-sub-inline-links" style="margin-left:0;margin-bottom:10px;">
          <span data-topic="Tech">News &amp; Reviews</span>
          <span data-topic="Gadgets Now">Mobiles &amp; Tabs</span>
          <span data-topic="Tech">Laptops &amp; PC</span>
          <span data-topic="Tech">Tech Tips</span>
          <span data-topic="Auto">Auto</span>
        </div>
        <div class="mk-tech-grid">
          <div>
            <div class="mk-photo-story" data-topic="Tech">
              <img src="mirkuk-news/images/tech.jpg" alt="Tech Lead" style="height:145px;" onerror="this.style.display='none';" />
              <h4 style="margin-top:8px;">Web tools, browsers &amp; everyday tech updates</h4>
            </div>
            <ul class="mk-desk-list">
              <li data-topic="Tech">Lightweight setups for fast daily browsing</li>
              <li data-topic="Gadgets Now">Display, battery &amp; camera notes compared</li>
            </ul>
          </div>
          <div>
            <ul class="mk-desk-list">
              <li data-topic="Tech">Browser &amp; developer workflow improvements</li>
              <li data-topic="Gadgets Now">Wearables &amp; health tracking highlights</li>
              <li data-topic="Tech">Choosing dependable hardware on a budget</li>
              <li data-topic="Gadgets Now">Comparing mid-range phones before upgrading</li>
            </ul>
            <div class="mk-compare-strip">
              <div class="mk-compare-card" data-topic="Gadgets Now">
                <img src="mirkuk-news/images/tech.jpg" alt="Model A" onerror="this.style.display='none';" />
                <p>Model A vs Model B</p>
              </div>
              <div class="mk-compare-card" data-topic="Gadgets Now">
                <img src="mirkuk-news/images/tech.jpg" alt="Model C" onerror="this.style.display='none';" />
                <p>Model C vs Model D</p>
              </div>
              <div class="mk-compare-card" data-topic="Gadgets Now">
                <img src="mirkuk-news/images/tech.jpg" alt="Model E" onerror="this.style.display='none';" />
                <p>Model E vs Model F</p>
              </div>
              <div class="mk-compare-card" data-topic="Gadgets Now">
                <img src="mirkuk-news/images/tech.jpg" alt="Model G" onerror="this.style.display='none';" />
                <p>Model G vs Model H</p>
              </div>
            </div>
          </div>
          <div class="mk-side-video-stack">
            <h4 class="mk-flat-panel-title">Latest Devices &gt;</h4>
            <div class="mk-device-item" data-topic="Gadgets Now">
              <img src="mirkuk-news/images/tech.jpg" alt="Device 1" onerror="this.style.display='none';" />
              <div>
                <div class="mk-device-name">Pulse X 5G</div>
                <div class="mk-device-price">₹17,999</div>
                <div class="mk-device-specs">8GB RAM · 128GB · 5500mAh</div>
              </div>
            </div>
            <div class="mk-device-item" data-topic="Gadgets Now">
              <img src="mirkuk-news/images/tech.jpg" alt="Device 2" onerror="this.style.display='none';" />
              <div>
                <div class="mk-device-name">Note Edge 5G</div>
                <div class="mk-device-price">₹13,499</div>
                <div class="mk-device-specs">8GB RAM · 128GB · 5500mAh</div>
              </div>
            </div>
            <div class="mk-device-item" data-topic="Gadgets Now">
              <img src="mirkuk-news/images/tech.jpg" alt="Device 3" onerror="this.style.display='none';" />
              <div>
                <div class="mk-device-name">Aero Neo 5G</div>
                <div class="mk-device-price">₹37,999</div>
                <div class="mk-device-specs">8GB RAM · 256GB · 7000mAh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mk-section-block">
        <div class="mk-three-desk-grid">
          <div class="mk-desk-col">
            <h3 class="mk-section-heading-link" data-topic="Travel">Travel &gt;</h3>
            <div class="mk-desk-lead-card" data-topic="Travel">
              <img src="mirkuk-news/images/weather.jpg" alt="Travel" onerror="this.style.display='none';" />
              <h4>Smart route &amp; seasonal trip planning notes</h4>
            </div>
            <ul class="mk-desk-list">
              <li data-topic="Travel">Packing light &amp; weather tips</li>
              <li data-topic="India">Weekend getaway ideas &amp; guides</li>
            </ul>
          </div>
          <div class="mk-desk-col">
            <h3 class="mk-section-heading-link" data-topic="Auto">Auto &gt;</h3>
            <div class="mk-desk-lead-card" data-topic="Auto">
              <img src="mirkuk-news/images/local.jpg" alt="Auto" onerror="this.style.display='none';" />
              <h4>Commute efficiency, EV notes &amp; road updates</h4>
            </div>
            <ul class="mk-desk-list">
              <li data-topic="Auto">Maintenance habits for longer vehicle life</li>
              <li data-topic="India">City traffic &amp; transit updates</li>
            </ul>
          </div>
          <div class="mk-desk-col">
            <h3 class="mk-section-heading-link" data-topic="Cricket">Cricket &amp; Sports &gt;</h3>
            <div class="mk-desk-lead-card" data-topic="Cricket">
              <img src="mirkuk-news/images/sports.jpg" alt="Cricket & Sports" onerror="this.style.display='none';" />
              <h4>Match reports, series notes &amp; key performances</h4>
            </div>
            <ul class="mk-desk-list">
              <li data-topic="Cricket">Top moments &amp; squad updates</li>
              <li data-topic="Sports">International &amp; domestic fixtures</li>
            </ul>
          </div>
        </div>
        <div class="mk-focus-row">
          <span class="mk-focus-label">In Focus</span>
          ${focusHtml}
        </div>
      </div>

      <div class="mk-section-block">
        <div class="mk-six-desk-cols">${sixMiniDesksHtml}</div>
      </div>

      <div class="mk-section-block">
        <div class="mk-bottom-strip">
          <div>
            <h3 class="mk-section-heading-link" data-topic="TV">TV &amp; Desk Videos &gt;</h3>
            <div class="mk-tv-three">
              <div class="mk-tv-card" data-topic="TV">
                <img src="mirkuk-news/images/culture.jpg" alt="Clip 1" onerror="this.style.display='none';" />
                <p>Behind the Scenes &amp; Stage Notes</p>
              </div>
              <div class="mk-tv-card" data-topic="Sports">
                <img src="mirkuk-news/images/sports.jpg" alt="Clip 2" onerror="this.style.display='none';" />
                <p>Match Moments &amp; Team Highlights</p>
              </div>
              <div class="mk-tv-card" data-topic="Lifestyle">
                <img src="mirkuk-news/images/arts.jpg" alt="Clip 3" onerror="this.style.display='none';" />
                <p>Wellness &amp; Daily Routine Clips</p>
              </div>
            </div>
          </div>
          <div class="mk-side-video-stack">
            <h4 class="mk-flat-panel-title">Regional Desk &gt;</h4>
            <div class="mk-photo-story" data-topic="India">
              <img src="mirkuk-news/images/local.jpg" alt="Regional Desk" style="height:80px;" onerror="this.style.display='none';" />
              <h4 style="margin-top:6px;">Local &amp; state updates across major regions</h4>
            </div>
          </div>
        </div>
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
/* === MIRKUK CLEAN BROADSHEET TOP & CARDS JS END === */