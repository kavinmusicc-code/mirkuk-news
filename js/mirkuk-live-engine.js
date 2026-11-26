(function () {
  const RSS_RELAYS = [
    "https://api.rss2json.com/v1/api.json?rss_url=",
    "https://api.allorigins.win/raw?url="
  ];

  // Broad multi-source + new business / startup / topic pools
  const SOURCE_POOLS = {
    top: [
      "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://www.thehindu.com/news/national/feeder/default.rss",
      "https://indianexpress.com/section/india/feed/",
      "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
      "https://feeds.reuters.com/reuters/topNews"
    ],
    business: [
      "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
      "https://news.google.com/rss/search?q=new+business+startup+entrepreneurship&hl=en-IN&gl=IN&ceid=IN:en",
      "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
      "https://economictimes.indiatimes.com/small-biz/sme-sector/rssfeeds/5575607.cms",
      "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
      "https://feeds.bbci.co.uk/news/business/rss.xml"
    ],
    india: [
      "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en",
      "https://www.thehindu.com/news/national/feeder/default.rss",
      "https://indianexpress.com/section/india/feed/",
      "https://indianexpress.com/section/cities/delhi/feed/",
      "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml"
    ],
    world: [
      "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
      "https://feeds.bbci.co.uk/news/world/europe/rss.xml",
      "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml"
    ],
    tech: [
      "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
      "https://news.google.com/rss/search?q=artificial+intelligence+tech+innovation&hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/news/technology/rss.xml",
      "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms"
    ],
    sports: [
      "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/sport/rss.xml",
      "https://indianexpress.com/section/sports/feed/"
    ],
    ent: [
      "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
    ],
    science: [
      "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en",
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
    ]
  };

  const LABELS = {
    top: "Top Stories (Multi-Source)",
    business: "Business, Startups & New Ventures",
    india: "India & NCR",
    world: "World",
    tech: "Tech & Innovation",
    sports: "Sports",
    ent: "Entertainment",
    science: "Science & Environment"
  };

  const EDITIONS = {
    IN: "hl=en-IN&gl=IN&ceid=IN:en",
    US: "hl=en-US&gl=US&ceid=US:en",
    GB: "hl=en-GB&gl=GB&ceid=GB:en",
    AE: "hl=en-AE&gl=AE&ceid=AE:en"
  };

  const FALLBACK_PHOTOS = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80"
  ];

  let currentCategory = "top";
  let currentEdition = "IN";
  let currentSearch = "";
  let allLoadedItems = [];
  let visibleGridCount = 12;

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

  function cleanTitleAndSource(rawTitle, feedTitle) {
    const parts = (rawTitle || "").split(" - ");
    if (parts.length > 1) {
      const source = parts.pop();
      return { title: parts.join(" - ").trim(), source: source.trim() };
    }
    return { title: (rawTitle || "").trim(), source: feedTitle || "Wire" };
  }

  function getUrlsForRequest(catKey, searchQuery) {
    const ed = EDITIONS[currentEdition] || EDITIONS.IN;
    if (searchQuery) {
      return [
        `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&${ed}`,
        `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery + " latest news")}&${ed}`
      ];
    }
    const pool = SOURCE_POOLS[catKey] || SOURCE_POOLS.top;
    return pool.map(u =>
      u.includes("news.google.com")
        ? u.replace(/hl=[^&]+&gl=[^&]+&ceid=[^&]+/, ed)
        : u
    );
  }

  function parseXmlFallback(xmlText, feedUrl) {
    try {
      const doc = new DOMParser().parseFromString(xmlText, "text/xml");
      const feedTitle = (doc.querySelector("channel > title")?.textContent || new URL(feedUrl).hostname).trim();
      const nodes = Array.from(doc.querySelectorAll("item"));
      return nodes.map(node => ({
        title: (node.querySelector("title")?.textContent || "").trim(),
        link: (node.querySelector("link")?.textContent || "#").trim(),
        pubDate: (node.querySelector("pubDate")?.textContent || new Date().toISOString()).trim(),
        description: (node.querySelector("description")?.textContent || "").trim(),
        __feedTitle: feedTitle
      })).filter(it => it.title);
    } catch (_) {
      return [];
    }
  }

  async function fetchSingleFeed(url) {
    // 1. Try primary rss2json relay
    try {
      const res = await fetch(RSS_RELAYS[0] + encodeURIComponent(url));
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length) {
        const feedName = (data.feed && data.feed.title) ? data.feed.title : "Live Wire";
        return data.items.map(it => Object.assign({}, it, { __feedTitle: feedName }));
      }
    } catch (_) {}

    // 2. Fallback XML fetch via second relay
    try {
      const res2 = await fetch(RSS_RELAYS[1] + encodeURIComponent(url));
      const xmlText = await res2.text();
      return parseXmlFallback(xmlText, url);
    } catch (_) {
      return [];
    }
  }

  function renderGridChunk(label) {
    const gridArea = document.getElementById("mk-grid-area");
    const loadBtn = document.getElementById("mk-load-more-btn");
    const countLabel = document.getElementById("mk-grid-count");
    if (!gridArea) return;

    const pool = allLoadedItems.slice(12);
    const slice = pool.slice(0, visibleGridCount);

    gridArea.innerHTML = slice.map((it, i) => {
      const info = cleanTitleAndSource(it.title, it.__feedTitle);
      const img = extractImage(it, i + 2);
      const desc = stripHtml(it.description).slice(0, 155);
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

    if (countLabel) {
      countLabel.textContent = `Showing ${Math.min(allLoadedItems.length, 12 + slice.length)} of ${allLoadedItems.length} stories (${label})`;
    }

    if (loadBtn) {
      loadBtn.style.display = slice.length < pool.length ? "inline-block" : "none";
    }
  }

  async function loadLiveNews(catKey = "top", searchQuery = "") {
    currentCategory = catKey;
    currentSearch = searchQuery;
    visibleGridCount = 12;

    const sectionTitle = document.getElementById("mk-active-section-title");
    const statusPill = document.getElementById("mk-feed-status");
    const heroArea = document.getElementById("mk-hero-area");
    const tickerArea = document.getElementById("mk-ticker-links");

    const label = searchQuery ? `Search: "${searchQuery}"` : (LABELS[catKey] || "Top Stories");
    if (sectionTitle) sectionTitle.textContent = label;
    if (statusPill) statusPill.textContent = "Pulling fresh stories across sources...";

    try {
      const urls = getUrlsForRequest(catKey, searchQuery);
      const results = await Promise.all(urls.map(fetchSingleFeed));
      const merged = results.flat();

      const seen = new Set();
      const uniqueItems = [];
      for (const it of merged) {
        const key = (it.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        uniqueItems.push(it);
      }

      if (!uniqueItems.length) throw new Error("No stories returned");

      allLoadedItems = uniqueItems
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .map((it, idx) => {
          const inf = cleanTitleAndSource(it.title, it.__feedTitle);
          return Object.assign({}, it, {
            __cleanTitle: inf.title,
            __source: inf.source,
            __img: extractImage(it, idx),
            __summary: stripHtml(it.description),
            __timeAgo: timeAgo(it.pubDate)
          });
        });

      window.__mirkukCurrentItems = allLoadedItems;

      if (tickerArea) {
        tickerArea.innerHTML = allLoadedItems.slice(0, 10).map(item =>
          `<a href="${item.link}" target="_blank" rel="noopener noreferrer">&bull; ${item.__cleanTitle}</a>`
        ).join("");
      }

      const lead = allLoadedItems[0];
      const briefItems = allLoadedItems.slice(1, 4).map(it =>
        `<li><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></li>`
      ).join("");

      const midItems = allLoadedItems.slice(4, 7);
      const wireItems = allLoadedItems.slice(7, 15);

      if (heroArea) {
        heroArea.innerHTML = `
          <div class="mk-hero-grid">
            <article class="mk-card mk-lead-card">
              <a href="${lead.link}" target="_blank" rel="noopener noreferrer">
                <img src="${lead.__img}" alt="${lead.__cleanTitle.replace(/"/g, '&quot;')}" onerror="this.src='${FALLBACK_PHOTOS[0]}'" />
              </a>
              <div class="mk-lead-body">
                <span class="mk-cat-tag">${label} &bull; ${lead.__source}</span>
                <h1><a href="${lead.link}" target="_blank" rel="noopener noreferrer">${lead.__cleanTitle}</a></h1>
                <p>${lead.__summary.slice(0, 220) || "Read full coverage on " + lead.__source + "."}</p>
                <div class="mk-meta">${lead.__timeAgo} &bull; Multi-Source Live Wire</div>
                <div class="mk-brief-box">
                  <div class="mk-brief-title">Key Developments</div>
                  <ul class="mk-brief-list">${briefItems}</ul>
                </div>
              </div>
            </article>

            <div class="mk-mid-stack">
              ${midItems.map((it, i) => `
                <article class="mk-compact-card">
                  <a href="${it.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${it.__img}" alt="" loading="lazy" onerror="this.src='${FALLBACK_PHOTOS[(i+1)%FALLBACK_PHOTOS.length]}'" />
                  </a>
                  <div>
                    <span class="mk-cat-tag">${it.__source}</span>
                    <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                    <div class="mk-meta">${it.__timeAgo}</div>
                  </div>
                </article>
              `).join("")}
            </div>

            <aside class="mk-wire-box">
              <h3>Latest Wire (Newest First)</h3>
              <ul class="mk-wire-list">
                ${wireItems.map(it => `
                  <li>
                    <a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a>
                    <span class="mk-wire-time">${it.__source} &bull; ${it.__timeAgo}</span>
                  </li>
                `).join("")}
              </ul>
            </aside>
          </div>
        `;
      }

      renderGridChunk(label);

      if (statusPill) {
        statusPill.innerHTML = `Live &bull; ${allLoadedItems.length} stories from ${urls.length} feeds &bull; Auto-sync every 10m`;
      }
    } catch (_) {
      if (statusPill) statusPill.textContent = "Reconnecting to live feeds...";
      if (heroArea) {
        heroArea.innerHTML = `<div class="mk-loader">Unable to load live stories right now. Please refresh shortly.</div>`;
      }
    }
  }

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
            weatherEl.textContent = `Delhi ${Math.round(d.current_weather.temperature)}°C`;
          }
        })
        .catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initClockAndWeather();

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

    const edSel = document.getElementById("mk-edition-select");
    if (edSel) {
      edSel.addEventListener("change", function () {
        currentEdition = this.value;
        loadLiveNews(currentCategory, currentSearch);
      });
    }

    const searchForm = document.getElementById("mk-search-form");
    const searchInput = document.getElementById("mk-search-input");
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) loadLiveNews("top", q);
      });
    }

    const loadMoreBtn = document.getElementById("mk-load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        visibleGridCount += 12;
        renderGridChunk(currentSearch ? `Search: "${currentSearch}"` : (LABELS[currentCategory] || "Top Stories"));
      });
    }

    loadLiveNews("top", "");
    // Every 10 minutes (600,000 ms), pull fresh stories so newest items flow to top
    setInterval(() => loadLiveNews(currentCategory, currentSearch), 600000);
  });

  // In-site Story Reader handler
  document.addEventListener("DOMContentLoaded", function () {
    const backdrop = document.getElementById("mk-reader-backdrop");
    const closeBtn = document.getElementById("mk-reader-close");
    const copyBtn = document.getElementById("mk-reader-copy");
    if (!backdrop) return;

    function openReaderByIndex(idx) {
      const items = window.__mirkukCurrentItems || [];
      const item = items[idx];
      if (!item) return;

      document.getElementById("mk-reader-source").textContent = item.__source || "Mirkuk Wire";
      document.getElementById("mk-reader-title").textContent = item.__cleanTitle || item.title || "Story";
      document.getElementById("mk-reader-meta").textContent = (item.__timeAgo || "Just now") + " • Mirkuk News Reader";

      const imgEl = document.getElementById("mk-reader-img");
      if (item.__img) {
        imgEl.src = item.__img;
        imgEl.style.display = "block";
      } else {
        imgEl.style.display = "none";
      }

      document.getElementById("mk-reader-summary").textContent =
        item.__summary || "Open the original source link below to read the complete report.";

      const extLink = document.getElementById("mk-reader-ext");
      extLink.href = item.link || "#";
      if (copyBtn) copyBtn.setAttribute("data-url", item.link || "");

      const relBox = document.getElementById("mk-reader-related");
      if (relBox) {
        const picks = items.filter((_, i) => i !== idx).slice(0, 3);
        relBox.innerHTML = picks.map(p => {
          const pIdx = items.indexOf(p);
          return `
            <div class="mk-related-card" data-mk-open-idx="${pIdx}">
              <span class="mk-cat-tag">${p.__source || "Wire"}</span>
              <h4>${p.__cleanTitle || p.title}</h4>
              <div class="mk-meta">${p.__timeAgo || "Recent"}</div>
            </div>
          `;
        }).join("");
      }

      backdrop.classList.add("open");
    }

    document.addEventListener("click", function (e) {
      const trigger = e.target.closest("[data-mk-open-idx]");
      if (trigger) {
        e.preventDefault();
        const idx = parseInt(trigger.getAttribute("data-mk-open-idx"), 10);
        if (!isNaN(idx)) openReaderByIndex(idx);
        return;
      }

      const storyLink = e.target.closest("#mk-hero-area a, #mk-grid-area a, .mk-wire-list a");
      if (storyLink && !storyLink.hasAttribute("data-mk-open-idx")) {
        const items = window.__mirkukCurrentItems || [];
        const href = storyLink.getAttribute("href");
        const foundIdx = items.findIndex(it => it.link === href);
        if (foundIdx >= 0) {
          e.preventDefault();
          openReaderByIndex(foundIdx);
        }
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => backdrop.classList.remove("open"));
    }
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        const u = this.getAttribute("data-url") || window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(u).then(() => {
            copyBtn.textContent = "Link Copied!";
            setTimeout(() => { copyBtn.textContent = "Copy Story Link"; }, 1800);
          });
        }
      });
    }
  });
})();

(function () {
  const SAVE_KEY = "mirkuk_saved_stories_v1";
  const CACHE_PREFIX = "mirkuk_feed_cache_v1_";

  function getSavedList() {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function setSavedList(list) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(list.slice(0, 60)));
    } catch (_) {}
    updateSavedCounter();
  }

  function isSaved(link) {
    return getSavedList().some(x => x.link === link);
  }

  function updateSavedCounter() {
    const el = document.getElementById("mk-saved-count");
    if (el) el.textContent = String(getSavedList().length);
  }

  function toggleSaveStory(item) {
    if (!item || !item.link) return;
    const list = getSavedList();
    const idx = list.findIndex(x => x.link === item.link);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift({
        title: item.__cleanTitle || item.title || "Story",
        link: item.link,
        source: item.__source || "Mirkuk Wire",
        summary: item.__summary || "",
        img: item.__img || "",
        timeAgo: item.__timeAgo || "Saved"
      });
    }
    setSavedList(list);
  }

  function cacheFeed(key, items) {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        ts: Date.now(),
        items: items.slice(0, 50)
      }));
    } catch (_) {}
  }

  function readCachedFeed(key) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) && parsed.items.length ? parsed.items : null;
    } catch (_) {
      return null;
    }
  }

  function injectSaveButtons() {
    const items = window.__mirkukCurrentItems || [];
    document.querySelectorAll("#mk-grid-area .mk-grid-body").forEach((bodyEl) => {
      if (bodyEl.querySelector(".mk-save-btn")) return;
      const linkEl = bodyEl.querySelector("h3 a");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const matched = items.find(it => it.link === href);
      if (!matched) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mk-save-btn" + (isSaved(href) ? " saved" : "");
      btn.textContent = isSaved(href) ? "Saved ✓" : "+ Save";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSaveStory(matched);
        const nowSaved = isSaved(href);
        btn.classList.toggle("saved", nowSaved);
        btn.textContent = nowSaved ? "Saved ✓" : "+ Save";
      });
      bodyEl.appendChild(btn);
    });
  }

  function showSavedStoriesView() {
    const saved = getSavedList();
    const sectionTitle = document.getElementById("mk-active-section-title");
    const statusPill = document.getElementById("mk-feed-status");
    const heroArea = document.getElementById("mk-hero-area");
    const gridArea = document.getElementById("mk-grid-area");
    const loadBtn = document.getElementById("mk-load-more-btn");

    if (sectionTitle) sectionTitle.textContent = "Saved Stories";
    if (statusPill) statusPill.textContent = `${saved.length} bookmarked on this device`;
    if (loadBtn) loadBtn.style.display = "none";
    if (heroArea) heroArea.innerHTML = "";

    if (!gridArea) return;
    if (!saved.length) {
      gridArea.innerHTML = `<div class="mk-loader" style="grid-column:1/-1;">No saved stories yet. Click "+ Save" on any card to bookmark it for later.</div>`;
      return;
    }

    gridArea.innerHTML = saved.map((it, idx) => `
      <article class="mk-card mk-grid-card">
        <a href="${it.link}" target="_blank" rel="noopener noreferrer">
          <img src="${it.img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
        </a>
        <div class="mk-grid-body">
          <div>
            <span class="mk-cat-tag">${it.source || "Saved"}</span>
            <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.title}</a></h3>
            <p>${(it.summary || "").slice(0, 150)}</p>
          </div>
          <div class="mk-meta">${it.timeAgo || "Saved"}</div>
          <button type="button" class="mk-save-btn saved" data-mk-remove-saved="${idx}">Remove Saved</button>
        </div>
      </article>
    `).join("");

    gridArea.querySelectorAll("[data-mk-remove-saved]").forEach(btn => {
      btn.addEventListener("click", function () {
        const i = parseInt(this.getAttribute("data-mk-remove-saved"), 10);
        const cur = getSavedList();
        cur.splice(i, 1);
        setSavedList(cur);
        showSavedStoriesView();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateSavedCounter();

    // Observe grid updates to attach + Save buttons cleanly
    const gridEl = document.getElementById("mk-grid-area");
    if (gridEl && window.MutationObserver) {
      const obs = new MutationObserver(() => {
        injectSaveButtons();
        if (Array.isArray(window.__mirkukCurrentItems) && window.__mirkukCurrentItems.length) {
          cacheFeed(window.location.pathname, window.__mirkukCurrentItems);
        }
      });
      obs.observe(gridEl, { childList: true });
    }

    // Topic chips trigger search
    document.querySelectorAll("[data-mk-topic]").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".mk-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        const topic = this.getAttribute("data-mk-topic");
        const searchInput = document.getElementById("mk-search-input");
        const searchForm = document.getElementById("mk-search-form");
        if (searchInput && searchForm) {
          searchInput.value = topic;
          searchForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });

    // Saved stories button
    const savedBtn = document.getElementById("mk-saved-view-btn");
    if (savedBtn) {
      savedBtn.addEventListener("click", function () {
        document.querySelectorAll(".mk-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        showSavedStoriesView();
      });
    }

    // Instant cached preview if live network is slow on first second
    setTimeout(() => {
      const hero = document.getElementById("mk-hero-area");
      if (hero && hero.textContent.includes("Loading live news")) {
        const cached = readCachedFeed(window.location.pathname);
        if (cached && cached.length) {
          window.__mirkukCurrentItems = cached;
          const grid = document.getElementById("mk-grid-area");
          if (grid) {
            grid.innerHTML = cached.slice(0, 8).map(it => `
              <article class="mk-card mk-grid-card">
                <div class="mk-grid-body">
                  <div>
                    <span class="mk-cat-tag">${it.__source || "Cached Wire"}</span>
                    <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle || it.title}</a></h3>
                    <p>${(it.__summary || "").slice(0, 140)}</p>
                  </div>
                  <div class="mk-meta">${it.__timeAgo || "Recent"}</div>
                </div>
              </article>
            `).join("");
            injectSaveButtons();
          }
        }
      }
    }, 1800);
  });
})();

(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  const HI_FEEDS = {
    top:      "https://news.google.com/rss?hl=hi-IN&gl=IN&ceid=IN:hi",
    india:    "https://news.google.com/rss/headlines/section/topic/NATION?hl=hi-IN&gl=IN&ceid=IN:hi",
    world:    "https://news.google.com/rss/headlines/section/topic/WORLD?hl=hi-IN&gl=IN&ceid=IN:hi",
    business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=hi-IN&gl=IN&ceid=IN:hi",
    tech:     "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=hi-IN&gl=IN&ceid=IN:hi",
    sports:   "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi-IN&gl=IN&ceid=IN:hi",
    ent:      "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi-IN&gl=IN&ceid=IN:hi",
    science:  "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=hi-IN&gl=IN&ceid=IN:hi"
  };

  function updateShareLinks(item) {
    const title = item.__cleanTitle || item.title || "Mirkuk News";
    const link = item.link || window.location.href;
    const text = `${title} — ${link}`;
    const waEl = document.getElementById("mk-reader-wa");
    const xEl = document.getElementById("mk-reader-x");
    if (waEl) waEl.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (xEl) xEl.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`;
  }

  async function loadHindiFeed(cat, q) {
    const hero = document.getElementById("mk-hero-area");
    const grid = document.getElementById("mk-grid-area");
    const ticker = document.getElementById("mk-ticker-links");
    const status = document.getElementById("mk-feed-status");
    const titleEl = document.getElementById("mk-active-section-title");
    const loadBtn = document.getElementById("mk-load-more-btn");

    if (titleEl) titleEl.textContent = q ? `खोज: "${q}"` : `हिन्दी समाचार (${cat.toUpperCase()})`;
    if (status) status.textContent = "हिन्दी लाइव फ़ीड लोड हो रही है...";
    if (loadBtn) loadBtn.style.display = "none";

    const rssUrl = q
      ? `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=hi-IN&gl=IN&ceid=IN:hi`
      : (HI_FEEDS[cat] || HI_FEEDS.top);

    try {
      const res = await fetch(RSS_API + encodeURIComponent(rssUrl));
      const data = await res.json();
      const rawItems = Array.isArray(data.items) ? data.items : [];
      if (!rawItems.length) throw new Error("No Hindi items");

      const items = rawItems
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .map(it => {
          const tmp = document.createElement("div");
          tmp.innerHTML = it.description || "";
          const parts = (it.title || "").split(" - ");
          const src = parts.length > 1 ? parts.pop().trim() : "Mirkuk Hindi";
          const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
          return Object.assign({}, it, {
            __cleanTitle: cleanT,
            __source: src,
            __summary: (tmp.textContent || tmp.innerText || "").trim(),
            __timeAgo: "ताज़ा"
          });
        });

      window.__mirkukCurrentItems = items;

      if (ticker) {
        ticker.innerHTML = items.slice(0, 8).map(it =>
          `<a href="${it.link}" target="_blank" rel="noopener noreferrer">&bull; ${it.__cleanTitle}</a>`
        ).join("");
      }

      const lead = items[0];
      if (hero) {
        hero.innerHTML = `
          <div class="mk-hero-grid">
            <article class="mk-card mk-lead-card">
              <div class="mk-lead-body">
                <span class="mk-cat-tag">${lead.__source}</span>
                <h1><a href="${lead.link}" target="_blank" rel="noopener noreferrer">${lead.__cleanTitle}</a></h1>
                <p>${lead.__summary.slice(0, 220)}</p>
                <div class="mk-meta">Mirkuk News Hindi Desk</div>
              </div>
            </article>
            <div class="mk-mid-stack">
              ${items.slice(1, 4).map(it => `
                <article class="mk-compact-card" style="grid-template-columns:1fr;">
                  <div>
                    <span class="mk-cat-tag">${it.__source}</span>
                    <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                  </div>
                </article>
              `).join("")}
            </div>
            <aside class="mk-wire-box">
              <h3>ताज़ा खबरें</h3>
              <ul class="mk-wire-list">
                ${items.slice(4, 11).map(it => `
                  <li>
                    <a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a>
                    <span class="mk-wire-time">${it.__source}</span>
                  </li>
                `).join("")}
              </ul>
            </aside>
          </div>
        `;
      }

      if (grid) {
        grid.innerHTML = items.slice(11, 27).map(it => `
          <article class="mk-card">
            <div class="mk-grid-body">
              <div>
                <span class="mk-cat-tag">${it.__source}</span>
                <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                <p>${it.__summary.slice(0, 150)}</p>
              </div>
              <div class="mk-meta">${it.__source}</div>
            </div>
          </article>
        `).join("");
      }

      if (status) status.textContent = `लाइव • ${items.length} हिन्दी खबरें`;
    } catch (_) {
      if (status) status.textContent = "हिन्दी फ़ीड फ़िलहाल उपलब्ध नहीं है";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const langSel = document.getElementById("mk-lang-select");
    let activeCat = "top";
    let activeQuery = "";

    function syncByLang() {
      if (langSel && langSel.value === "hi") {
        loadHindiFeed(activeCat, activeQuery);
      }
    }

    if (langSel) {
      langSel.addEventListener("change", function () {
        if (this.value === "hi") {
          loadHindiFeed(activeCat, activeQuery);
        } else {
          const homeBtn = document.querySelector('.mk-nav-btn[data-mk-cat="' + activeCat + '"]') || document.querySelector(".mk-nav-btn");
          if (homeBtn) homeBtn.click();
        }
      });
    }

    document.querySelectorAll("[data-mk-cat]").forEach(btn => {
      btn.addEventListener("click", function () {
        activeCat = this.getAttribute("data-mk-cat") || "top";
        activeQuery = "";
        if (langSel && langSel.value === "hi") {
          setTimeout(() => loadHindiFeed(activeCat, ""), 60);
        }
      });
    });

    const sf = document.getElementById("mk-search-form");
    const si = document.getElementById("mk-search-input");
    if (sf && si) {
      sf.addEventListener("submit", function () {
        activeQuery = si.value.trim();
        if (langSel && langSel.value === "hi" && activeQuery) {
          setTimeout(() => loadHindiFeed(activeCat, activeQuery), 60);
        }
      });
    }

    // Hook share buttons whenever reader opens
    document.addEventListener("click", function (e) {
      const trigger = e.target.closest("[data-mk-open-idx], #mk-hero-area a, #mk-grid-area a, .mk-wire-list a");
      if (!trigger) return;
      setTimeout(() => {
        const items = window.__mirkukCurrentItems || [];
        const titleEl = document.getElementById("mk-reader-title");
        if (!titleEl || !items.length) return;
        const found = items.find(it => (it.__cleanTitle || it.title) === titleEl.textContent) || items[0];
        if (found) updateShareLinks(found);
      }, 40);
    });

    syncByLang();
  });
})();

(function () {
  function calcReadMinutes(text) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 180) + 1);
  }

  function decorateCardsWithReadTimeAndSource() {
    const items = window.__mirkukCurrentItems || [];
    if (!items.length) return;

    // Populate source dropdown once per batch
    const srcSelect = document.getElementById("mk-source-filter");
    if (srcSelect) {
      const prevVal = srcSelect.value || "ALL";
      const sources = Array.from(new Set(items.map(it => it.__source).filter(Boolean))).sort();
      srcSelect.innerHTML = `<option value="ALL">All Sources (${items.length})</option>` +
        sources.map(s => `<option value="${s.replace(/"/g, '&quot;')}">${s}</option>`).join("");
      if (Array.from(srcSelect.options).some(o => o.value === prevVal)) {
        srcSelect.value = prevVal;
      }
    }

    // Add read-time badge to grid meta lines
    document.querySelectorAll("#mk-grid-area .mk-grid-body").forEach((bodyEl) => {
      const metaEl = bodyEl.querySelector(".mk-meta");
      if (!metaEl || metaEl.querySelector(".mk-read-pill")) return;
      const linkEl = bodyEl.querySelector("h3 a");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const matched = items.find(it => it.link === href);
      const mins = calcReadMinutes((matched && matched.__summary) || bodyEl.textContent);
      const badge = document.createElement("span");
      badge.className = "mk-read-pill";
      badge.textContent = `${mins} min read`;
      metaEl.appendChild(badge);
    });

    const statsEl = document.getElementById("mk-pulse-stats");
    if (statsEl) {
      const uniqueSources = new Set(items.map(it => it.__source).filter(Boolean)).size;
      statsEl.textContent = `${items.length} stories • ${uniqueSources} sources active`;
    }
  }

  function applySourceFilter(chosenSource) {
    const all = window.__mirkukAllItemsBackup || window.__mirkukCurrentItems || [];
    if (!window.__mirkukAllItemsBackup && all.length) {
      window.__mirkukAllItemsBackup = all.slice();
    }
    const base = window.__mirkukAllItemsBackup || [];
    if (!base.length) return;

    const filtered = (!chosenSource || chosenSource === "ALL")
      ? base.slice()
      : base.filter(it => (it.__source || "") === chosenSource);

    window.__mirkukCurrentItems = filtered.length ? filtered : base.slice();

    const gridArea = document.getElementById("mk-grid-area");
    if (gridArea) {
      gridArea.innerHTML = window.__mirkukCurrentItems.slice(0, 16).map((it, i) => {
        const mins = calcReadMinutes(it.__summary || it.__cleanTitle || "");
        return `
          <article class="mk-card mk-grid-card">
            <a href="${it.link}" target="_blank" rel="noopener noreferrer">
              <img src="${it.__img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
            </a>
            <div class="mk-grid-body">
              <div>
                <span class="mk-cat-tag">${it.__source || "Wire"}</span>
                <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle || it.title}</a></h3>
                <p>${(it.__summary || "").slice(0, 155)}</p>
              </div>
              <div class="mk-meta">${it.__timeAgo || "Live"} <span class="mk-read-pill">${mins} min read</span></div>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const gridEl = document.getElementById("mk-grid-area");
    if (gridEl && window.MutationObserver) {
      const obs = new MutationObserver(() => {
        if (Array.isArray(window.__mirkukCurrentItems) && window.__mirkukCurrentItems.length) {
          window.__mirkukAllItemsBackup = window.__mirkukCurrentItems.slice();
        }
        decorateCardsWithReadTimeAndSource();
      });
      obs.observe(gridEl, { childList: true });
    }

    const srcSelect = document.getElementById("mk-source-filter");
    if (srcSelect) {
      srcSelect.addEventListener("change", function () {
        applySourceFilter(this.value);
      });
    }

    // Countdown timer (600s = 10m) + Force Sync button
    let remainingSec = 600;
    const syncLabel = document.getElementById("mk-next-sync");
    const forceBtn = document.getElementById("mk-force-sync-btn");

    function triggerRefresh() {
      remainingSec = 600;
      const activeNav = document.querySelector(".mk-nav-btn.active") || document.querySelector(".mk-nav-btn");
      if (activeNav) activeNav.click();
    }

    if (forceBtn) {
      forceBtn.addEventListener("click", triggerRefresh);
    }

    setInterval(() => {
      remainingSec = remainingSec > 0 ? remainingSec - 1 : 600;
      if (syncLabel) {
        const m = String(Math.floor(remainingSec / 60)).padStart(2, "0");
        const s = String(remainingSec % 60).padStart(2, "0");
        syncLabel.textContent = `Auto-sync: ${m}:${s}`;
      }
    }, 1000);

    // Power shortcuts: '/' focuses search, 'Escape' closes reader modal
    document.addEventListener("keydown", function (e) {
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea") {
        const inp = document.getElementById("mk-search-input");
        if (inp) {
          e.preventDefault();
          inp.focus();
        }
      } else if (e.key === "Escape") {
        const backdrop = document.getElementById("mk-reader-backdrop");
        if (backdrop && backdrop.classList.contains("open")) {
          backdrop.classList.remove("open");
        }
      }
    });
  });
})();

(function () {
  const THEME_KEY = "mirkuk_theme_mode_v1";

  function applySavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const btn = document.getElementById("mk-theme-toggle");
    if (saved === "dark") {
      document.body.classList.add("mk-dark-mode");
      if (btn) btn.textContent = "Light Mode";
    } else {
      document.body.classList.remove("mk-dark-mode");
      if (btn) btn.textContent = "Dark Mode";
    }
  }

  function applyFreshnessWindow(winCode) {
    const all = window.__mirkukAllItemsBackup || window.__mirkukCurrentItems || [];
    if (!window.__mirkukAllItemsBackup && all.length) {
      window.__mirkukAllItemsBackup = all.slice();
    }
    const base = window.__mirkukAllItemsBackup || [];
    if (!base.length) return;

    const now = Date.now();
    const maxAgeMs = winCode === "2H" ? 2 * 3600 * 1000 : (winCode === "24H" ? 24 * 3600 * 1000 : Infinity);
    const filtered = maxAgeMs === Infinity
      ? base.slice()
      : base.filter(it => {
          const t = new Date(it.pubDate).getTime();
          return !isNaN(t) && (now - t) <= maxAgeMs;
        });

    const chosen = filtered.length ? filtered : base.slice();
    window.__mirkukCurrentItems = chosen;

    const gridArea = document.getElementById("mk-grid-area");
    if (gridArea) {
      gridArea.innerHTML = chosen.slice(0, 16).map(it => `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
          </a>
          <div class="mk-grid-body">
            <div>
              <span class="mk-cat-tag">${it.__source || "Wire"}</span>
              <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle || it.title}</a></h3>
              <p>${(it.__summary || "").slice(0, 155)}</p>
            </div>
            <div class="mk-meta">${it.__timeAgo || "Live"}</div>
          </div>
        </article>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applySavedTheme();

    const themeBtn = document.getElementById("mk-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("mk-dark-mode");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
      });
    }

    const freshSel = document.getElementById("mk-freshness-filter");
    if (freshSel) {
      freshSel.addEventListener("change", function () {
        applyFreshnessWindow(this.value);
      });
    }
  });
})();

(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  const DESK_FEEDS = [
    { key: "india",    title: "India & National Desk",        url: "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "business", title: "Business, Markets & Startups", url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "world",    title: "World & Global Affairs",       url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "tech",     title: "Tech, AI & Digital",           url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "sports",   title: "World Cricket & Sports",       url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en" }
  ];

  async function renderMegaDesks() {
    const shelf = document.getElementById("mk-mega-shelf");
    const activeBtn = document.querySelector(".mk-nav-btn.active");
    const activeCat = activeBtn ? activeBtn.getAttribute("data-mk-cat") : "top";
    if (!shelf) return;

    if (activeCat !== "top") {
      shelf.innerHTML = "";
      return;
    }

    try {
      const blocks = await Promise.all(
        DESK_FEEDS.map(async desk => {
          try {
            const res = await fetch(RSS_API + encodeURIComponent(desk.url));
            const data = await res.json();
            const items = Array.isArray(data.items) ? data.items.slice(0, 4) : [];
            if (!items.length) return "";

            const cardsHtml = items.map(it => {
              const parts = (it.title || "").split(" - ");
              const src = parts.length > 1 ? parts.pop().trim() : (data.feed && data.feed.title) || "Wire";
              const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
              const tmp = document.createElement("div");
              tmp.innerHTML = it.description || "";
              const desc = (tmp.textContent || tmp.innerText || "").trim().slice(0, 130);
              return `
                <article class="mk-card mk-grid-card">
                  <div class="mk-grid-body">
                    <div>
                      <span class="mk-cat-tag">${src}</span>
                      <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${cleanT}</a></h3>
                      <p>${desc}</p>
                    </div>
                    <div class="mk-meta">${src}</div>
                  </div>
                </article>
              `;
            }).join("");

            return `
              <div class="mk-shelf-block">
                <div class="mk-section-head">
                  <h2>${desk.title}</h2>
                  <a href="#" class="mk-status-pill" data-mk-cat="${desk.key}">View All &rarr;</a>
                </div>
                <div class="mk-shelf-grid">${cardsHtml}</div>
              </div>
            `;
          } catch (_) {
            return "";
          }
        })
      );

      shelf.innerHTML = blocks.filter(Boolean).join("");
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(renderMegaDesks, 900);

    document.querySelectorAll("[data-mk-cat]").forEach(btn => {
      btn.addEventListener("click", function () {
        const cat = this.getAttribute("data-mk-cat");
        if (cat === "top") {
          setTimeout(renderMegaDesks, 900);
        } else {
          const shelf = document.getElementById("mk-mega-shelf");
          if (shelf) shelf.innerHTML = "";
        }
      });
    });

    const progBar = document.getElementById("mk-progress-bar");
    const topBtn = document.getElementById("mk-top-btn");

    window.addEventListener("scroll", function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      if (progBar) progBar.style.width = pct.toFixed(1) + "%";
      if (topBtn) topBtn.style.display = scrollTop > 450 ? "block" : "none";
    }, { passive: true });

    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });
})();

(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  // Extra high-volume feeds so more stories populate across sections
  const EXTRA_FEEDS = [
    "https://news.google.com/rss/search?q=breaking+news+india+today&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=global+news+world+affairs&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=business+economy+startup+market&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=technology+ai+science+news&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=cricket+sports+world+news&hl=en-IN&gl=IN&ceid=IN:en"
  ];

  async function boostStoriesCount() {
    const gridArea = document.getElementById("mk-grid-area");
    if (!gridArea) return;

    try {
      const batches = await Promise.all(
        EXTRA_FEEDS.map(u =>
          fetch(RSS_API + encodeURIComponent(u))
            .then(r => r.json())
            .then(d => Array.isArray(d.items) ? d.items.map(it => Object.assign({}, it, { __feedTitle: (d.feed && d.feed.title) || "Global Wire" })) : [])
            .catch(() => [])
        )
      );

      const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
      const combined = existing.concat(batches.flat());

      const seen = new Set();
      const unique = [];
      for (const it of combined) {
        const key = (it.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
        if (!key || seen.has(key)) continue;
        seen.add(key);

        const tmp = document.createElement("div");
        tmp.innerHTML = it.description || "";
        const parts = (it.title || "").split(" - ");
        const src = parts.length > 1 ? parts.pop().trim() : (it.__source || it.__feedTitle || "Wire");
        const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.__cleanTitle || it.title || "").trim();

        unique.push(Object.assign({}, it, {
          __cleanTitle: cleanT,
          __source: src,
          __summary: it.__summary || (tmp.textContent || tmp.innerText || "").trim(),
          __timeAgo: it.__timeAgo || "Live"
        }));
      }

      if (unique.length > existing.length) {
        window.__mirkukCurrentItems = unique;
        window.__mirkukAllItemsBackup = unique.slice();
        window.__mirkukBeastProcessedFor = null;

        gridArea.innerHTML = unique.slice(0, 32).map(it => `
          <article class="mk-card mk-grid-card">
            <a href="${it.link}" target="_blank" rel="noopener noreferrer">
              <img src="${it.__img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
            </a>
            <div class="mk-grid-body">
              <div>
                <span class="mk-cat-tag">${it.__source}</span>
                <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                <p>${(it.__summary || "").slice(0, 155)}</p>
              </div>
              <div class="mk-meta">${it.__timeAgo}</div>
            </div>
          </article>
        `).join("");

        const countEl = document.getElementById("mk-grid-count");
        if (countEl) {
          countEl.textContent = `Showing ${Math.min(32, unique.length)} of ${unique.length} live stories`;
        }
      }
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(boostStoriesCount, 1800);
    document.querySelectorAll("[data-mk-cat]").forEach(btn => {
      btn.addEventListener("click", () => setTimeout(boostStoriesCount, 1800));
    });
  });
})();

(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  const FULL_DESKS = [
    { key: "india",    title: "India & National Desk",        url: "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "business", title: "Business, Markets & Startups", url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "world",    title: "World & Global Affairs",       url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "tech",     title: "Tech, AI & Digital",           url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "sports",   title: "World Cricket & Sports",       url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "ent",      title: "Entertainment & Cinema",       url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en" },
    { key: "science",  title: "Science & Environment",        url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en" }
  ];

  async function renderFullMegaShelf() {
    const shelf = document.getElementById("mk-mega-shelf");
    const activeBtn = document.querySelector(".mk-nav-btn.active");
    const activeCat = activeBtn ? activeBtn.getAttribute("data-mk-cat") : "top";
    if (!shelf || activeCat !== "top") return;

    const blocks = await Promise.all(
      FULL_DESKS.map(async desk => {
        try {
          const res = await fetch(RSS_API + encodeURIComponent(desk.url));
          const data = await res.json();
          const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];
          if (!items.length) return "";

          const cardsHtml = items.map(it => {
            const parts = (it.title || "").split(" - ");
            const src = parts.length > 1 ? parts.pop().trim() : (data.feed && data.feed.title) || "Wire";
            const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
            const tmp = document.createElement("div");
            tmp.innerHTML = it.description || "";
            const desc = (tmp.textContent || tmp.innerText || "").trim().slice(0, 135);
            return `
              <article class="mk-card mk-grid-card">
                <div class="mk-grid-body">
                  <div>
                    <span class="mk-cat-tag">${src}</span>
                    <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${cleanT}</a></h3>
                    <p>${desc}</p>
                  </div>
                  <div class="mk-meta">${src}</div>
                </div>
              </article>
            `;
          }).join("");

          return `
            <div class="mk-shelf-block">
              <div class="mk-section-head">
                <h2>${desk.title}</h2>
                <a href="#" class="mk-status-pill" data-mk-cat="${desk.key}">Explore ${desk.title} &rarr;</a>
              </div>
              <div class="mk-shelf-grid">${cardsHtml}</div>
            </div>
          `;
        } catch (_) {
          return "";
        }
      })
    );

    const valid = blocks.filter(Boolean);
    if (valid.length) {
      shelf.innerHTML = valid.join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(renderFullMegaShelf, 1400);
  });
})();

(function () {
  const CITIES = [
    { label: "Delhi",    tz: "Asia/Kolkata" },
    { label: "London",   tz: "Europe/London" },
    { label: "New York", tz: "America/New_York" },
    { label: "Dubai",    tz: "Asia/Dubai" },
    { label: "Tokyo",    tz: "Asia/Tokyo" }
  ];

  function renderWorldClocks() {
    const box = document.getElementById("mk-world-clocks");
    if (!box) return;
    const now = new Date();
    const parts = CITIES.map(c => {
      let timeStr = "";
      try {
        timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }).format(now);
      } catch (_) {
        timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return `<span class="mk-clock-item"><strong>${c.label}:</strong> ${timeStr}</span>`;
    });

    box.innerHTML = `<strong style="text-transform:uppercase; letter-spacing:0.05em; color:#f0f6fc;">World Clock:</strong>` + parts.join("");
  }

  function setupAudioBriefing() {
    const btn = document.getElementById("mk-listen-btn");
    if (!btn) return;

    const hasSpeech = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
    let speaking = false;

    function stopSpeech() {
      if (hasSpeech) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      speaking = false;
      btn.classList.remove("stop");
      btn.innerHTML = "&#9654; Listen Top Briefing";
    }

    btn.addEventListener("click", function () {
      if (!hasSpeech) {
        alert("Your browser does not support built-in voice briefing.");
        return;
      }

      if (speaking) {
        stopSpeech();
        return;
      }

      const items = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice(0, 6) : [];
      if (!items.length) return;

      const scriptText = "Mirkuk News Top Briefing. " + items.map((it, idx) => {
        const title = it.__cleanTitle || it.title || "";
        return `Story ${idx + 1}: ${title}.`;
      }).join(" ");

      stopSpeech();
      const utter = new SpeechSynthesisUtterance(scriptText);
      utter.rate = 1.02;
      utter.pitch = 1.0;
      utter.onend = stopSpeech;
      utter.onerror = stopSpeech;

      speaking = true;
      btn.classList.add("stop");
      btn.innerHTML = "&#9632; Stop Briefing";

      try {
        window.speechSynthesis.speak(utter);
      } catch (_) {
        stopSpeech();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderWorldClocks();
    setInterval(renderWorldClocks, 30000);
    setupAudioBriefing();
  });
})();

(function () {
  const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  const BLACK_HOLE_SOURCES = [
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss?hl=en-GB&gl=GB&ceid=GB:en",
    "https://news.google.com/rss/search?q=video+games+gaming+esports+news&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=world+news+breaking+headlines&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=india+news+economy+tech+cricket&hl=en-IN&gl=IN&ceid=IN:en",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://feeds.bbci.co.uk/news/technology/rss.xml"
  ];

  function normalizeKey(title) {
    return (title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .slice(0, 85);
  }

  async function pullBlackHoleStream() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    try {
      const batches = await Promise.all(
        BLACK_HOLE_SOURCES.map(url =>
          fetch(RSS_API + encodeURIComponent(url))
            .then(r => r.json())
            .then(d => Array.isArray(d.items)
              ? d.items.map(it => Object.assign({}, it, { __bhFeed: (d.feed && d.feed.title) || "Global Wire" }))
              : [])
            .catch(() => [])
        )
      );

      const current = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
      const merged = current.concat(batches.flat());

      const seen = new Set();
      const pulled = [];

      for (const it of merged) {
        const key = normalizeKey(it.title);
        if (!key || seen.has(key)) continue;
        seen.add(key);

        const tmp = document.createElement("div");
        tmp.innerHTML = it.description || "";
        const parts = (it.title || "").split(" - ");
        const src = parts.length > 1 ? parts.pop().trim() : (it.__source || it.__bhFeed || "Black Hole Wire");
        const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.__cleanTitle || it.title || "").trim();

        pulled.push(Object.assign({}, it, {
          __cleanTitle: cleanT,
          __source: src,
          __summary: it.__summary || (tmp.textContent || tmp.innerText || "").trim(),
          __timeAgo: it.__timeAgo || "Live Wire"
        }));
      }

      pulled.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      if (pulled.length > current.length) {
        window.__mirkukCurrentItems = pulled;
        window.__mirkukAllItemsBackup = pulled.slice();
        window.__mirkukBeastProcessedFor = null;

        grid.innerHTML = pulled.slice(0, 40).map(it => `
          <article class="mk-card mk-grid-card">
            <a href="${it.link}" target="_blank" rel="noopener noreferrer">
              <img src="${it.__img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
            </a>
            <div class="mk-grid-body">
              <div>
                <span class="mk-cat-tag">${it.__source}</span>
                <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                <p>${(it.__summary || "").slice(0, 155)}</p>
              </div>
              <div class="mk-meta">${it.__timeAgo}</div>
            </div>
          </article>
        `).join("");

        const countEl = document.getElementById("mk-grid-count");
        if (countEl) {
          countEl.textContent = `Black Hole Stream: Showing ${Math.min(40, pulled.length)} of ${pulled.length} stories`;
        }
      }
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(pullBlackHoleStream, 2100);
    document.querySelectorAll("[data-mk-cat], [data-mk-topic]").forEach(el => {
      el.addEventListener("click", () => setTimeout(pullBlackHoleStream, 2100));
    });
  });
})();
