(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  // Real Google News RSS feeds by category & edition
  const FEEDS = {
    top:      { label: "Top Stories",   url: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en" },
    india:    { label: "India",         url: "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en" },
    world:    { label: "World",         url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en" },
    business: { label: "Business",      url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en" },
    tech:     { label: "Technology",    url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en" },
    sports:   { label: "Sports",        url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en" },
    ent:      { label: "Entertainment", url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en" },
    science:  { label: "Science",       url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en" }
  };

  const EDITIONS = {
    IN: "hl=en-IN&gl=IN&ceid=IN:en",
    US: "hl=en-US&gl=US&ceid=US:en",
    GB: "hl=en-GB&gl=GB&ceid=GB:en",
    AE: "hl=en-AE&gl=AE&ceid=AE:en"
  };

  let currentCategory = "top";
  let currentEdition = "IN";

  // Clean fallback news photos (real editorial photography from Unsplash)
  const FALLBACK_PHOTOS = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80"
  ];

  function timeAgo(dateStr) {
    const pub = new Date(dateStr);
    if (isNaN(pub)) return "Just now";
    const diffMins = Math.max(1, Math.floor((Date.now() - pub.getTime()) / 60000));
    if (diffMins < 60) return diffMins + "m ago";
    const hrs = Math.floor(diffMins / 60);
    if (hrs < 24) return hrs + "h ago";
    return Math.floor(hrs / 24) + "d ago";
  }

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").trim();
  }

  function extractImage(item, idx) {
    if (item.thumbnail && item.thumbnail.startsWith("http")) return item.thumbnail;
    if (item.enclosure && item.enclosure.link && item.enclosure.link.startsWith("http")) return item.enclosure.link;
    const match = (item.description || "").match(/<img[^>]+src="([^">]+)"/i);
    if (match && match[1].startsWith("http")) return match[1];
    return FALLBACK_PHOTOS[idx % FALLBACK_PHOTOS.length];
  }

  function cleanTitleAndSource(rawTitle) {
    const parts = (rawTitle || "").split(" - ");
    if (parts.length > 1) {
      const source = parts.pop();
      return { title: parts.join(" - "), source };
    }
    return { title: rawTitle, source: "Mirkuk Wire" };
  }

  function buildFeedUrl(catKey, searchQuery) {
    const ed = EDITIONS[currentEdition] || EDITIONS.IN;
    if (searchQuery) {
      return `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&${ed}`;
    }
    const base = (FEEDS[catKey] || FEEDS.top).url;
    return base.replace(/hl=[^&]+&gl=[^&]+&ceid=[^&]+/, ed);
  }

  async function loadLiveNews(catKey = "top", searchQuery = "") {
    currentCategory = catKey;
    const sectionTitle = document.getElementById("mk-active-section-title");
    const statusPill = document.getElementById("mk-feed-status");
    const heroArea = document.getElementById("mk-hero-area");
    const gridArea = document.getElementById("mk-grid-area");
    const tickerArea = document.getElementById("mk-ticker-links");

    const label = searchQuery ? `Search: "${searchQuery}"` : (FEEDS[catKey]?.label || "Top Stories");
    if (sectionTitle) sectionTitle.textContent = label;
    if (statusPill) statusPill.textContent = "Fetching live wire...";

    try {
      const rssUrl = buildFeedUrl(catKey, searchQuery);
      const res = await fetch(RSS_API + encodeURIComponent(rssUrl));
      const data = await res.json();

      if (!data.items || !data.items.length) {
        throw new Error("No live stories returned");
      }

      // Newest first (sorted by pubDate descending)
      const items = data.items.slice().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      // 1. Update Breaking Ticker
      if (tickerArea) {
        tickerArea.innerHTML = items.slice(0, 6).map(item => {
          const { title } = cleanTitleAndSource(item.title);
          return `<a href="${item.link}" target="_blank" rel="noopener noreferrer">&bull; ${title}</a>`;
        }).join("");
      }

      // 2. Render Hero Section (1 Lead + 3 Mid Compact + 6 Right Wire)
      const lead = items[0];
      const leadInfo = cleanTitleAndSource(lead.title);
      const leadImg = extractImage(lead, 0);
      const leadDesc = stripHtml(lead.description).slice(0, 210);

      const midItems = items.slice(1, 4);
      const wireItems = items.slice(4, 11);
      const gridItems = items.slice(11);

      if (heroArea) {
        heroArea.innerHTML = `
          <div class="mk-hero-grid">
            <article class="mk-card mk-lead-card">
              <a href="${lead.link}" target="_blank" rel="noopener noreferrer">
                <img src="${leadImg}" alt="${leadInfo.title.replace(/"/g, '&quot;')}" onerror="this.src='${FALLBACK_PHOTOS[0]}'" />
              </a>
              <div class="mk-lead-body">
                <span class="mk-cat-tag">${label} &bull; ${leadInfo.source}</span>
                <h1><a href="${lead.link}" target="_blank" rel="noopener noreferrer">${leadInfo.title}</a></h1>
                <p>${leadDesc || "Click to read the complete live report from " + leadInfo.source + "."}</p>
                <div class="mk-meta">Published ${timeAgo(lead.pubDate)} &bull; Verified Live Feed</div>
              </div>
            </article>

            <div class="mk-mid-stack">
              ${midItems.map((it, i) => {
                const info = cleanTitleAndSource(it.title);
                const img = extractImage(it, i + 1);
                return `
                  <article class="mk-compact-card">
                    <a href="${it.link}" target="_blank" rel="noopener noreferrer">
                      <img src="${img}" alt="" loading="lazy" onerror="this.src='${FALLBACK_PHOTOS[(i+1)%FALLBACK_PHOTOS.length]}'" />
                    </a>
                    <div>
                      <span class="mk-cat-tag">${info.source}</span>
                      <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${info.title}</a></h3>
                      <div class="mk-meta">${timeAgo(it.pubDate)}</div>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>

            <aside class="mk-wire-box">
              <h3>Latest Wire (Newest First)</h3>
              <ul class="mk-wire-list">
                ${wireItems.map(it => {
                  const info = cleanTitleAndSource(it.title);
                  return `
                    <li>
                      <a href="${it.link}" target="_blank" rel="noopener noreferrer">${info.title}</a>
                      <span class="mk-wire-time">${info.source} &bull; ${timeAgo(it.pubDate)}</span>
                    </li>
                  `;
                }).join("")}
              </ul>
            </aside>
          </div>
        `;
      }

      // 3. Render Bottom Multi-Column Grid
      if (gridArea) {
        const displayGrid = gridItems.length ? gridItems : items.slice(4);
        gridArea.innerHTML = displayGrid.map((it, i) => {
          const info = cleanTitleAndSource(it.title);
          const img = extractImage(it, i + 2);
          const desc = stripHtml(it.description).slice(0, 140);
          return `
            <article class="mk-card mk-grid-card">
              <a href="${it.link}" target="_blank" rel="noopener noreferrer">
                <img src="${img}" alt="" loading="lazy" onerror="this.src='${FALLBACK_PHOTOS[(i+2)%FALLBACK_PHOTOS.length]}'" />
              </a>
              <div class="mk-grid-body">
                <div>
                  <span class="mk-cat-tag">${info.source}</span>
                  <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${info.title}</a></h3>
                  <p>${desc}</p>
                </div>
                <div class="mk-meta">${timeAgo(it.pubDate)}</div>
              </div>
            </article>
          `;
        }).join("");
      }

      if (statusPill) {
        statusPill.textContent = `Live &bull; ${items.length} stories updated just now`;
        statusPill.innerHTML = `Live &bull; ${items.length} real stories loaded`;
      }
    } catch (err) {
      if (statusPill) statusPill.textContent = "Reconnecting to live feed...";
      if (heroArea) {
        heroArea.innerHTML = `<div class="mk-loader">Unable to reach live RSS relay right now. Please refresh or check connection.</div>`;
      }
    }
  }

  // Real-time IST Date & Clock + Live Delhi Weather (Open-Meteo Free API, no key needed)
  function initClockAndWeather() {
    const dateEl = document.getElementById("mk-live-clock");
    function tick() {
      if (!dateEl) return;
      const now = new Date();
      dateEl.textContent = now.toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata"
      }) + " IST";
    }
    tick();
    setInterval(tick, 30000);

    const weatherEl = document.getElementById("mk-live-weather");
    if (weatherEl) {
      fetch("https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true")
        .then(r => r.json())
        .then(d => {
          if (d && d.current_weather) {
            weatherEl.textContent = `New Delhi ${Math.round(d.current_weather.temperature)}°C`;
          }
        })
        .catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initClockAndWeather();

    // Category Navigation
    document.querySelectorAll("[data-mk-cat]").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".mk-nav-btn").forEach(b => b.classList.remove("active"));
        if (this.classList.contains("mk-nav-btn")) this.classList.add("active");
        const cat = this.getAttribute("data-mk-cat");
        loadLiveNews(cat, "");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Edition Switcher
    const edSel = document.getElementById("mk-edition-select");
    if (edSel) {
      edSel.addEventListener("change", function () {
        currentEdition = this.value;
        loadLiveNews(currentCategory, "");
      });
    }

    // Live Search Form
    const searchForm = document.getElementById("mk-search-form");
    const searchInput = document.getElementById("mk-search-input");
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) loadLiveNews("top", q);
      });
    }

    // Initial Load
    loadLiveNews("top", "");
  });
})();
