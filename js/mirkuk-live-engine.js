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

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  const STREAM_FEEDS = [
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=gaming+esports+news&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss?hl=hi-IN&gl=IN&ceid=IN:hi"
  ];

  let feedCursor = 0;
  let flashIndex = 0;

  function normKey(t) {
    return (t || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, " ").trim().slice(0, 85);
  }

  function parseXmlRss(xmlStr) {
    try {
      const doc = new DOMParser().parseFromString(xmlStr, "text/xml");
      return Array.from(doc.querySelectorAll("item")).map(node => ({
        title: (node.querySelector("title")?.textContent || "").trim(),
        link: (node.querySelector("link")?.textContent || "").trim(),
        pubDate: (node.querySelector("pubDate")?.textContent || new Date().toUTCString()).trim(),
        description: (node.querySelector("description")?.textContent || "").trim()
      }));
    } catch (_) {
      return [];
    }
  }

  async function fetchFeedFast(feedUrl) {
    try {
      const r1 = await fetch(RELAYS[0](feedUrl));
      const j1 = await r1.json();
      if (Array.isArray(j1.items) && j1.items.length) return j1.items;
    } catch (_) {}

    try {
      const r2 = await fetch(RELAYS[1](feedUrl));
      const j2 = await r2.json();
      if (j2 && j2.contents) return parseXmlRss(j2.contents);
    } catch (_) {}

    return [];
  }

  async function harvestNextSlice() {
    const url = STREAM_FEEDS[feedCursor % STREAM_FEEDS.length];
    feedCursor++;

    const raw = await fetchFeedFast(url);
    if (!raw.length) return;

    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const seen = new Set(existing.map(it => normKey(it.__cleanTitle || it.title)));
    const freshOnes = [];

    for (const it of raw) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : "Live Wire";
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
      const k = normKey(cleanT);
      if (!k || seen.has(k)) continue;
      seen.add(k);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";

      freshOnes.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: src,
        __summary: (tmp.textContent || tmp.innerText || "").trim(),
        __timeAgo: "Just In",
        __isJustIn: true
      }));
    }

    if (freshOnes.length) {
      const merged = freshOnes.concat(existing).slice(0, 120);
      window.__mirkukCurrentItems = merged;
      window.__mirkukAllItemsBackup = merged.slice();
      window.__mirkukBeastProcessedFor = null;

      const grid = document.getElementById("mk-grid-area");
      if (grid) {
        grid.innerHTML = merged.slice(0, 48).map(it => `
          <article class="mk-card mk-grid-card">
            <a href="${it.link}" target="_blank" rel="noopener noreferrer">
              <img src="${it.__img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'}" alt="" loading="lazy" />
            </a>
            <div class="mk-grid-body">
              <div>
                <span class="mk-cat-tag">${it.__isJustIn ? '<span class="mk-new-badge">NEW</span>' : ''}${it.__source}</span>
                <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
                <p>${(it.__summary || "").slice(0, 155)}</p>
              </div>
              <div class="mk-meta">${it.__timeAgo || "Live"}</div>
            </div>
          </article>
        `).join("");
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const clockEl = document.getElementById("mk-rt-clock");
    const headEl = document.getElementById("mk-rt-headline");
    const countEl = document.getElementById("mk-rt-counter");

    // 1. Every 1 second: update live seconds clock & story pool counter
    setInterval(() => {
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString("en-GB", { hour12: false }) + " LIVE";
      }
      const items = window.__mirkukCurrentItems || [];
      if (countEl) {
        countEl.textContent = `Pool: ${items.length} stories`;
      }
    }, 1000);

    // 2. Every 3.5 seconds: cycle live wire flash headline smoothly
    setInterval(() => {
      const items = window.__mirkukCurrentItems || [];
      if (!items.length || !headEl) return;
      const cur = items[flashIndex % Math.min(25, items.length)];
      flashIndex++;
      headEl.textContent = `[${cur.__source || "WIRE"}] ${cur.__cleanTitle || cur.title}`;
    }, 3500);

    // 3. Every 12 seconds: pull next global/topic feed in background with dual-relay fallback
    setTimeout(harvestNextSlice, 2500);
    setInterval(harvestNextSlice, 12000);
  });
})();

(function () {
  const BASE_TITLE = document.title || "Mirkuk News — India & Global Live Newsroom";

  function syncDynamicTitle() {
    const activeCatBtn = document.querySelector(".mk-nav-btn.active");
    const catText = activeCatBtn ? (activeCatBtn.textContent || "").trim() : "";
    const searchInp = document.getElementById("mk-search-input");
    const q = searchInp ? (searchInp.value || "").trim() : "";

    if (q) {
      document.title = `"${q}" — Search | Mirkuk News`;
    } else if (catText && catText.toLowerCase() !== "top stories") {
      document.title = `${catText} — Mirkuk News`;
    } else {
      document.title = BASE_TITLE;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mk-cat]").forEach(el => {
      el.addEventListener("click", () => setTimeout(syncDynamicTitle, 120));
    });

    const form = document.getElementById("mk-search-form");
    if (form) {
      form.addEventListener("submit", () => setTimeout(syncDynamicTitle, 120));
    }

    // Support ?q= search term directly from URL
    try {
      const params = new URLSearchParams(window.location.search);
      const qParam = (params.get("q") || "").trim();
      const inp = document.getElementById("mk-search-input");
      if (qParam && inp && form) {
        setTimeout(() => {
          inp.value = qParam;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          syncDynamicTitle();
        }, 1200);
      }
    } catch (_) {}
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  // Global & National Major Portals Direct Feeds
  const GLOBAL_PORTAL_FEEDS = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://feeds.bbci.co.uk/news/business/rss.xml",
    "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "https://feeds.bbci.co.uk/sport/cricket/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.thehindu.com/news/national/feeder/default.rss",
    "https://www.thehindu.com/news/international/feeder/default.rss",
    "https://indianexpress.com/section/india/feed/",
    "https://indianexpress.com/section/technology/feed/",
    "https://indianexpress.com/section/sports/cricket/feed/",
    "https://feeds.feedburner.com/ndtvnews-top-stories",
    "https://feeds.feedburner.com/ndtvnews-world-news",
    "https://feeds.ign.com/ign/games-all",
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
  ];

  const TOPIC_FALLBACK_IMGS = {
    cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
    gaming:  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    tech:    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    biz:     "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    default: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80"
  };

  function pickFallbackByTitle(title) {
    const t = (title || "").toLowerCase();
    if (/\b(cricket|ipl|test|odi|t20|icc|wicket|match)\b/.test(t)) return TOPIC_FALLBACK_IMGS.cricket;
    if (/\b(game|gaming|esports|ps5|xbox|gta|nintendo|steam)\b/.test(t)) return TOPIC_FALLBACK_IMGS.gaming;
    if (/\b(ai|tech|chip|google|apple|microsoft|cyber|space|isro|nasa)\b/.test(t)) return TOPIC_FALLBACK_IMGS.tech;
    if (/\b(market|stock|nifty|sensex|economy|bank|rupee|trade|startup)\b/.test(t)) return TOPIC_FALLBACK_IMGS.biz;
    return TOPIC_FALLBACK_IMGS.default;
  }

  function extractRealImage(item) {
    if (item.thumbnail && /^https?:\/\//i.test(item.thumbnail)) return item.thumbnail;
    if (item.enclosure && item.enclosure.link && /^https?:\/\//i.test(item.enclosure.link)) return item.enclosure.link;
    if (item.enclosure && item.enclosure.url && /^https?:\/\//i.test(item.enclosure.url)) return item.enclosure.url;

    const rawHtml = (item.content || "") + " " + (item.description || "");
    const m = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && m[1] && /^https?:\/\//i.test(m[1]) && !/pixel|tracker|1x1|logo/i.test(m[1])) {
      return m[1];
    }
    return pickFallbackByTitle(item.title);
  }

  function parseXmlWithMedia(xmlStr) {
    try {
      const doc = new DOMParser().parseFromString(xmlStr, "text/xml");
      const channelTitle = (doc.querySelector("channel > title")?.textContent || "Global Portal").trim();
      return Array.from(doc.querySelectorAll("item")).map(node => {
        const mediaContent = node.getElementsByTagNameNS("*", "content")[0];
        const mediaThumb = node.getElementsByTagNameNS("*", "thumbnail")[0];
        const enc = node.querySelector("enclosure");
        const imgUrl =
          (mediaContent && mediaContent.getAttribute("url")) ||
          (mediaThumb && mediaThumb.getAttribute("url")) ||
          (enc && enc.getAttribute("url")) || "";

        return {
          title: (node.querySelector("title")?.textContent || "").trim(),
          link: (node.querySelector("link")?.textContent || "").trim(),
          pubDate: (node.querySelector("pubDate")?.textContent || new Date().toUTCString()).trim(),
          description: (node.querySelector("description")?.textContent || "").trim(),
          thumbnail: imgUrl,
          __portalName: channelTitle
        };
      });
    } catch (_) {
      return [];
    }
  }

  async function fetchPortalFeed(url) {
    try {
      const r1 = await fetch(RELAYS[0](url));
      const j1 = await r1.json();
      if (Array.isArray(j1.items) && j1.items.length) {
        const feedName = (j1.feed && j1.feed.title) || "Global Portal";
        return j1.items.map(it => Object.assign({}, it, { __portalName: feedName }));
      }
    } catch (_) {}

    try {
      const r2 = await fetch(RELAYS[1](url));
      const j2 = await r2.json();
      if (j2 && j2.contents) return parseXmlWithMedia(j2.contents);
    } catch (_) {}

    return [];
  }

  async function syncGlobalPortalsWithImages() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    const batches = await Promise.all(GLOBAL_PORTAL_FEEDS.map(fetchPortalFeed));
    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const combined = batches.flat().concat(existing);

    const seen = new Set();
    const enriched = [];

    for (const it of combined) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : (it.__source || it.__portalName || "Global Wire");
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.__cleanTitle || it.title || "").trim();
      const key = cleanT.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";
      const realImg = extractRealImage(it);

      enriched.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: src,
        __img: realImg,
        __fallbackImg: pickFallbackByTitle(cleanT),
        __summary: it.__summary || (tmp.textContent || tmp.innerText || "").trim(),
        __timeAgo: it.__timeAgo || "Live Portal"
      }));
    }

    enriched.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (enriched.length) {
      window.__mirkukCurrentItems = enriched;
      window.__mirkukAllItemsBackup = enriched.slice();
      window.__mirkukBeastProcessedFor = null;

      grid.innerHTML = enriched.slice(0, 56).map(it => `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img}" onerror="this.onerror=null;this.src='${it.__fallbackImg}';" alt="" loading="lazy" />
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
        countEl.textContent = `Global Portals Connected: Showing ${Math.min(56, enriched.length)} of ${enriched.length} stories with real media`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(syncGlobalPortalsWithImages, 1600);
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  // Expanded Worldwide & Regional News Feeds
  const WORLDWIDE_FEEDS = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://feeds.bbci.co.uk/news/business/rss.xml",
    "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "https://feeds.bbci.co.uk/sport/cricket/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.thehindu.com/news/national/feeder/default.rss",
    "https://www.thehindu.com/news/international/feeder/default.rss",
    "https://indianexpress.com/section/india/feed/",
    "https://indianexpress.com/section/technology/feed/",
    "https://indianexpress.com/section/sports/cricket/feed/",
    "https://feeds.feedburner.com/ndtvnews-top-stories",
    "https://feeds.feedburner.com/ndtvnews-world-news",
    "https://feeds.ign.com/ign/games-all",
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss?hl=en-GB&gl=GB&ceid=GB:en",
    "https://news.google.com/rss?hl=en-AE&gl=AE&ceid=AE:en",
    "https://news.google.com/rss?hl=en-SG&gl=SG&ceid=SG:en",
    "https://news.google.com/rss?hl=en-AU&gl=AU&ceid=AU:en"
  ];

  function escapeXml(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function pickThemeColors(title) {
    const t = (title || "").toLowerCase();
    if (/\b(cricket|ipl|test|odi|t20|icc|sport|match|goal)\b/.test(t)) return { bg1: "#0f2942", bg2: "#1d5b8c", accent: "#38bdf8", tag: "SPORTS WIRE" };
    if (/\b(game|gaming|esports|ps5|xbox|gta|nintendo|steam)\b/.test(t)) return { bg1: "#1c103b", bg2: "#5b21b6", accent: "#c084fc", tag: "GAMING DESK" };
    if (/\b(ai|tech|chip|google|apple|microsoft|cyber|space|science)\b/.test(t)) return { bg1: "#0b2530", bg2: "#0f766e", accent: "#2dd4bf", tag: "TECH & SCIENCE" };
    if (/\b(market|stock|nifty|sensex|economy|bank|rupee|trade|business)\b/.test(t)) return { bg1: "#1e293b", bg2: "#991b1b", accent: "#f87171", tag: "MARKETS & BIZ" };
    return { bg1: "#14181f", bg2: "#7f1d1d", accent: "#ef4444", tag: "MIRKUK WIRE" };
  }

  // Generates a guaranteed non-empty visual graphic card image when real image is missing/blocked
  function buildGeneratedCardImage(title, source) {
    const theme = pickThemeColors(title);
    const words = (title || "Global News Update").trim().split(/\s+/).slice(0, 9).join(" ");
    const line1 = escapeXml(words.slice(0, 34));
    const line2 = escapeXml(words.slice(34, 68));
    const srcSafe = escapeXml((source || "MIRKUK NEWS").slice(0, 24).toUpperCase());

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${theme.bg1}"/>
          <stop offset="100%" stop-color="${theme.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g)"/>
      <rect x="0" y="0" width="800" height="8" fill="${theme.accent}"/>
      <rect x="40" y="42" width="170" height="30" rx="4" fill="rgba(255,255,255,0.14)"/>
      <text x="54" y="62" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${theme.tag}</text>
      <text x="40" y="155" fill="#ffffff" font-family="Arial, sans-serif" font-size="30" font-weight="bold">${line1}</text>
      <text x="40" y="198" fill="#f1f5f9" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${line2}</text>
      <line x1="40" y1="365" x2="760" y2="365" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <text x="40" y="402" fill="${theme.accent}" font-family="Arial, sans-serif" font-size="15" font-weight="bold">MIRKUK NEWS</text>
      <text x="760" y="402" text-anchor="end" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14">${srcSafe}</text>
    </svg>`;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function extractRealImage(item) {
    if (item.thumbnail && /^https?:\/\//i.test(item.thumbnail)) return item.thumbnail;
    if (item.enclosure && item.enclosure.link && /^https?:\/\//i.test(item.enclosure.link)) return item.enclosure.link;
    if (item.enclosure && item.enclosure.url && /^https?:\/\//i.test(item.enclosure.url)) return item.enclosure.url;

    const rawHtml = (item.content || "") + " " + (item.description || "");
    const m = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && m[1] && /^https?:\/\//i.test(m[1]) && !/pixel|tracker|1x1|logo|icon/i.test(m[1])) {
      return m[1];
    }
    return "";
  }

  function parseXmlWithMedia(xmlStr) {
    try {
      const doc = new DOMParser().parseFromString(xmlStr, "text/xml");
      const channelTitle = (doc.querySelector("channel > title")?.textContent || "World Wire").trim();
      return Array.from(doc.querySelectorAll("item")).map(node => {
        const mediaContent = node.getElementsByTagNameNS("*", "content")[0];
        const mediaThumb = node.getElementsByTagNameNS("*", "thumbnail")[0];
        const enc = node.querySelector("enclosure");
        const imgUrl =
          (mediaContent && mediaContent.getAttribute("url")) ||
          (mediaThumb && mediaThumb.getAttribute("url")) ||
          (enc && enc.getAttribute("url")) || "";

        return {
          title: (node.querySelector("title")?.textContent || "").trim(),
          link: (node.querySelector("link")?.textContent || "").trim(),
          pubDate: (node.querySelector("pubDate")?.textContent || new Date().toUTCString()).trim(),
          description: (node.querySelector("description")?.textContent || "").trim(),
          thumbnail: imgUrl,
          __portalName: channelTitle
        };
      });
    } catch (_) {
      return [];
    }
  }

  async function fetchWorldwideFeed(url) {
    try {
      const r1 = await fetch(RELAYS[0](url));
      const j1 = await r1.json();
      if (Array.isArray(j1.items) && j1.items.length) {
        const feedName = (j1.feed && j1.feed.title) || "World Wire";
        return j1.items.map(it => Object.assign({}, it, { __portalName: feedName }));
      }
    } catch (_) {}

    try {
      const r2 = await fetch(RELAYS[1](url));
      const j2 = await r2.json();
      if (j2 && j2.contents) return parseXmlWithMedia(j2.contents);
    } catch (_) {}

    return [];
  }

  async function syncWorldwideWithGuaranteedImages() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    const batches = await Promise.all(WORLDWIDE_FEEDS.map(fetchWorldwideFeed));
    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const combined = batches.flat().concat(existing);

    const seen = new Set();
    const enriched = [];

    for (const it of combined) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : (it.__source || it.__portalName || "World Wire");
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.__cleanTitle || it.title || "").trim();
      const key = cleanT.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";
      const genImg = buildGeneratedCardImage(cleanT, src);
      const realImg = extractRealImage(it) || genImg;

      enriched.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: src,
        __img: realImg,
        __genImg: genImg,
        __summary: it.__summary || (tmp.textContent || tmp.innerText || "").trim(),
        __timeAgo: it.__timeAgo || "World Live"
      }));
    }

    enriched.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (enriched.length) {
      window.__mirkukCurrentItems = enriched;
      window.__mirkukAllItemsBackup = enriched.slice();
      window.__mirkukBeastProcessedFor = null;

      grid.innerHTML = enriched.slice(0, 64).map(it => `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img}" onerror="this.onerror=null;this.src='${it.__genImg}';" alt="" loading="lazy" />
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
        countEl.textContent = `Worldwide Wire: Showing ${Math.min(64, enriched.length)} of ${enriched.length} stories (100% visual coverage)`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(syncWorldwideWithGuaranteedImages, 1500);
  });
})();

(function () {
  function applyDeviceLookClass() {
    const isMobile = window.innerWidth <= 767;
    document.body.classList.toggle("mk-mobile-view", isMobile);
    document.body.classList.toggle("mk-desktop-view", !isMobile);
  }

  document.addEventListener("DOMContentLoaded", applyDeviceLookClass);
  window.addEventListener("resize", applyDeviceLookClass);
})();

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const panel = document.getElementById("mk-more-panel");
    if (!panel) return;

    panel.querySelectorAll("[data-mk-topic]").forEach(btn => {
      btn.addEventListener("click", function () {
        const topic = (btn.getAttribute("data-mk-topic") || "").trim();
        const inp = document.getElementById("mk-search-input");
        const form = document.getElementById("mk-search-form");
        if (topic && inp && form) {
          inp.value = topic;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
})();

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mk-topic]").forEach(btn => {
      if (btn.dataset.mkTopicBound === "1") return;
      btn.dataset.mkTopicBound = "1";
      btn.addEventListener("click", function () {
        const topic = (btn.getAttribute("data-mk-topic") || "").trim();
        const inp = document.getElementById("mk-search-input");
        const form = document.getElementById("mk-search-form");
        if (topic && inp && form) {
          inp.value = topic;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
})();

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mk-topic]").forEach(btn => {
      if (btn.dataset.mkTopicBound === "1") return;
      btn.dataset.mkTopicBound = "1";
      btn.addEventListener("click", function () {
        const topic = (btn.getAttribute("data-mk-topic") || "").trim();
        const inp = document.getElementById("mk-search-input");
        const form = document.getElementById("mk-search-form");
        if (topic && inp && form) {
          inp.value = topic;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  const MEGA_EVERYTHING_FEEDS = [
    "https://news.google.com/rss/search?q=Elon+Musk+OR+Tesla+OR+SpaceX&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=billionaires+OR+Forbes+billionaire+OR+wealth&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=Apple+iPhone+OR+Microsoft+OR+Google+launch&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=new+movie+release+OR+movie+launch+OR+box+office&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=new+game+launch+OR+gaming+release+OR+PS5+OR+PC+game&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=celebrity+news+OR+Bollywood+OR+Hollywood+news&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=media+company+OR+broadcast+OR+streaming+news&hl=en-US&gl=US&ceid=US:en"
  ];

  function makeCardFallback(title, source) {
    const safeT = (title || "Global Wire Update").replace(/[<>&"']/g, "").slice(0, 68);
    const safeS = (source || "MIRKUK WIRE").replace(/[<>&"']/g, "").slice(0, 24).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs>
      <rect width="800" height="450" fill="url(#mg)"/>
      <rect x="0" y="0" width="800" height="8" fill="#ef4444"/>
      <text x="40" y="65" fill="#fca5a5" font-family="Arial,sans-serif" font-size="14" font-weight="bold">GLOBAL MEGA WIRE</text>
      <text x="40" y="165" fill="#ffffff" font-family="Arial,sans-serif" font-size="30" font-weight="bold">${safeT.slice(0, 34)}</text>
      <text x="40" y="208" fill="#f3f4f6" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${safeT.slice(34, 68)}</text>
      <text x="40" y="405" fill="#ef4444" font-family="Arial,sans-serif" font-size="15" font-weight="bold">MIRKUK NEWS</text>
      <text x="760" y="405" text-anchor="end" fill="#d1d5db" font-family="Arial,sans-serif" font-size="14">${safeS}</text>
    </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function pickImg(item, title, source) {
    if (item.thumbnail && /^https?:\/\//i.test(item.thumbnail)) return item.thumbnail;
    if (item.enclosure && (item.enclosure.link || item.enclosure.url)) {
      const u = item.enclosure.link || item.enclosure.url;
      if (/^https?:\/\//i.test(u)) return u;
    }
    const html = (item.content || "") + " " + (item.description || "");
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && m[1] && /^https?:\/\//i.test(m[1]) && !/pixel|tracker|1x1|logo|icon/i.test(m[1])) return m[1];
    return makeCardFallback(title, source);
  }

  async function pullMegaEverything() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    const results = await Promise.all(
      MEGA_EVERYTHING_FEEDS.map(async u => {
        try {
          const r = await fetch(RELAYS[0](u));
          const j = await r.json();
          if (Array.isArray(j.items) && j.items.length) return j.items;
        } catch (_) {}
        try {
          const r2 = await fetch(RELAYS[1](u));
          const j2 = await r2.json();
          if (j2 && j2.contents) {
            const doc = new DOMParser().parseFromString(j2.contents, "text/xml");
            return Array.from(doc.querySelectorAll("item")).map(n => ({
              title: (n.querySelector("title")?.textContent || "").trim(),
              link: (n.querySelector("link")?.textContent || "").trim(),
              pubDate: (n.querySelector("pubDate")?.textContent || new Date().toUTCString()).trim(),
              description: (n.querySelector("description")?.textContent || "").trim()
            }));
          }
        } catch (_) {}
        return [];
      })
    );

    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const seen = new Set(existing.map(x => (x.__cleanTitle || x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85)));
    const added = [];

    for (const it of results.flat()) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : "Global Wire";
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
      const key = cleanT.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";
      const fb = makeCardFallback(cleanT, src);

      added.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: src,
        __img: pickImg(it, cleanT, src),
        __genImg: fb,
        __summary: (tmp.textContent || tmp.innerText || "").trim(),
        __timeAgo: "Mega Wire",
        __isJustIn: true
      }));
    }

    if (added.length) {
      const merged = added.concat(existing).slice(0, 150);
      window.__mirkukCurrentItems = merged;
      window.__mirkukAllItemsBackup = merged.slice();
      window.__mirkukBeastProcessedFor = null;

      grid.innerHTML = merged.slice(0, 64).map(it => `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img}" onerror="this.onerror=null;this.src='${it.__genImg || makeCardFallback(it.__cleanTitle, it.__source)}';" alt="" loading="lazy" />
          </a>
          <div class="mk-grid-body">
            <div>
              <span class="mk-cat-tag">${it.__isJustIn ? '<span class="mk-new-badge">LIVE</span>' : ''}${it.__source}</span>
              <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
              <p>${(it.__summary || "").slice(0, 155)}</p>
            </div>
            <div class="mk-meta">${it.__timeAgo || "Live"}</div>
          </div>
        </article>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(pullMegaEverything, 1800);
    document.querySelectorAll("[data-mk-topic]").forEach(btn => {
      if (btn.dataset.mkMegaBound === "1") return;
      btn.dataset.mkMegaBound = "1";
      btn.addEventListener("click", function () {
        const q = (btn.getAttribute("data-mk-topic") || "").trim();
        const inp = document.getElementById("mk-search-input");
        const form = document.getElementById("mk-search-form");
        if (q && inp && form) {
          inp.value = q;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  const EXTRA_LIFE_FEEDS = [
    "https://news.google.com/rss/search?q=scholarship+apply+students+India+OR+abroad&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=government+scheme+OR+yojana+apply+India&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=global+grant+OR+public+scheme+OR+fellowship+program&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=travel+news+OR+flight+OR+visa+OR+tourism&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=international+travel+airlines+tourism+destination&hl=en-US&gl=US&ceid=US:en"
  ];

  function ensureApplyHelperBox() {
    const panel = document.getElementById("mk-more-panel");
    if (!panel || document.getElementById("mk-apply-guide-box")) return;

    const box = document.createElement("div");
    box.id = "mk-apply-guide-box";
    box.style.cssText = "margin-top:14px; padding:12px 14px; background:rgba(255,255,255,0.05); border-left:4px solid #38bdf8; border-radius:4px; font-size:12px; line-height:1.5; color:#e2e8f0;";
    box.innerHTML = `
      <strong style="color:#7dd3fc;">How to Apply (Scholarships &amp; Schemes — Quick Checklist):</strong>
      1) News/Alert se Official Portal ka naam aur Last Date check karein.
      2) Eligibility, Income/Academic Criteria aur Required Documents (ID, Marksheet/Certificates, Bank/Passport details) taiyar rakhein.
      3) Official website par Registration -> Form Fill -> Document Upload -> Final Submit karke Acknowledgement/Receipt save karein.
    `;
    panel.appendChild(box);
  }

  async function pullScholarshipsSchemesTravel() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    const batches = await Promise.all(
      EXTRA_LIFE_FEEDS.map(async u => {
        try {
          const r = await fetch(RELAYS[0](u));
          const j = await r.json();
          if (Array.isArray(j.items) && j.items.length) return j.items;
        } catch (_) {}
        try {
          const r2 = await fetch(RELAYS[1](u));
          const j2 = await r2.json();
          if (j2 && j2.contents) {
            const doc = new DOMParser().parseFromString(j2.contents, "text/xml");
            return Array.from(doc.querySelectorAll("item")).map(n => ({
              title: (n.querySelector("title")?.textContent || "").trim(),
              link: (n.querySelector("link")?.textContent || "").trim(),
              pubDate: (n.querySelector("pubDate")?.textContent || new Date().toUTCString()).trim(),
              description: (n.querySelector("description")?.textContent || "").trim()
            }));
          }
        } catch (_) {}
        return [];
      })
    );

    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const seen = new Set(existing.map(x => (x.__cleanTitle || x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85)));
    const added = [];

    for (const it of batches.flat()) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : "Schemes & Travel Wire";
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
      const key = cleanT.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 85);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";
      const safeT = cleanT.replace(/[<>&"']/g, "").slice(0, 68);
      const safeS = src.replace(/[<>&"']/g, "").slice(0, 24).toUpperCase();
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="st" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs><rect width="800" height="450" fill="url(#st)"/><rect x="0" y="0" width="800" height="8" fill="#38bdf8"/><text x="40" y="65" fill="#7dd3fc" font-family="Arial,sans-serif" font-size="14" font-weight="bold">SCHOLARSHIPS • SCHEMES • TRAVEL</text><text x="40" y="165" fill="#ffffff" font-family="Arial,sans-serif" font-size="30" font-weight="bold">${safeT.slice(0, 34)}</text><text x="40" y="208" fill="#e0f2fe" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${safeT.slice(34, 68)}</text><text x="40" y="405" fill="#38bdf8" font-family="Arial,sans-serif" font-size="15" font-weight="bold">MIRKUK NEWS</text><text x="760" y="405" text-anchor="end" fill="#bae6fd" font-family="Arial,sans-serif" font-size="14">${safeS}</text></svg>`;
      const genImg = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);

      added.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: src,
        __img: (it.thumbnail && /^https?:\/\//i.test(it.thumbnail)) ? it.thumbnail : genImg,
        __genImg: genImg,
        __summary: (tmp.textContent || tmp.innerText || "").trim(),
        __timeAgo: "Live Update",
        __isJustIn: true
      }));
    }

    if (added.length) {
      const merged = added.concat(existing).slice(0, 160);
      window.__mirkukCurrentItems = merged;
      window.__mirkukAllItemsBackup = merged.slice();
      window.__mirkukBeastProcessedFor = null;

      grid.innerHTML = merged.slice(0, 64).map(it => `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img}" onerror="this.onerror=null;this.src='${it.__genImg}';" alt="" loading="lazy" />
          </a>
          <div class="mk-grid-body">
            <div>
              <span class="mk-cat-tag">${it.__isJustIn ? '<span class="mk-new-badge">LIVE</span>' : ''}${it.__source}</span>
              <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a></h3>
              <p>${(it.__summary || "").slice(0, 155)}</p>
            </div>
            <div class="mk-meta">${it.__timeAgo || "Live"}</div>
          </div>
        </article>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureApplyHelperBox();
    setTimeout(pullScholarshipsSchemesTravel, 2000);
    document.querySelectorAll("[data-mk-topic]").forEach(btn => {
      if (btn.dataset.mkExtraBound === "1") return;
      btn.dataset.mkExtraBound = "1";
      btn.addEventListener("click", function () {
        const q = (btn.getAttribute("data-mk-topic") || "").trim();
        const inp = document.getElementById("mk-search-input");
        const form = document.getElementById("mk-search-form");
        if (q && inp && form) {
          inp.value = q;
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  const SHOPPING_FEEDS = [
    "https://news.google.com/rss/search?q=Amazon+OR+Flipkart+sale+deals+offers+India&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=shopping+deals+Black+Friday+sale+discounts&hl=en-US&gl=US&ceid=US:en"
  ];

  let visibleLimit = 64;

  function renderCardsWithLimit() {
    const grid = document.getElementById("mk-grid-area");
    const items = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems : [];
    if (!grid || !items.length) return;

    const slice = items.slice(0, visibleLimit);
    grid.innerHTML = slice.map(it => {
      const title = it.__cleanTitle || it.title || "Update";
      const src = it.__source || "Mirkuk Wire";
      const img = it.__img || it.__genImg || "";
      const fb = it.__genImg || img;
      const summary = (it.__summary || "").slice(0, 155);
      const timeAgo = it.__timeAgo || "Live";
      const badge = it.__isJustIn ? '<span class="mk-new-badge">LIVE</span>' : '';
      return `
        <article class="mk-card mk-grid-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${img}" onerror="this.onerror=null;this.src='${fb}';" alt="" loading="lazy" />
          </a>
          <div class="mk-grid-body">
            <div>
              <span class="mk-cat-tag">${badge}${src}</span>
              <h3><a href="${it.link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
              <p>${summary}</p>
            </div>
            <div class="mk-meta">${timeAgo}</div>
          </div>
        </article>
      `;
    }).join("");

    let loadBtn = document.getElementById("mk-fixed-load-more");
    if (!loadBtn) {
      loadBtn = document.createElement("button");
      loadBtn.id = "mk-fixed-load-more";
      loadBtn.type = "button";
      loadBtn.textContent = "Load More Stories";
      loadBtn.style.cssText = "display:block; margin:18px auto 8px; padding:10px 22px; background:#c8102e; color:#fff; border:0; border-radius:6px; font-weight:700; cursor:pointer;";
      loadBtn.addEventListener("click", function () {
        visibleLimit += 32;
        renderCardsWithLimit();
      });
      grid.parentNode.insertBefore(loadBtn, grid.nextSibling);
    }

    if (visibleLimit >= items.length) {
      loadBtn.textContent = `All ${items.length} Loaded (Reset View)`;
      loadBtn.onclick = function () {
        visibleLimit = 64;
        renderCardsWithLimit();
      };
    } else {
      loadBtn.textContent = `Load More (${items.length - visibleLimit} more available)`;
      loadBtn.onclick = function () {
        visibleLimit += 32;
        renderCardsWithLimit();
      };
    }
  }

  function ensureStoreBar() {
    const panel = document.getElementById("mk-more-panel");
    if (!panel || document.getElementById("mk-store-quick-bar")) return;

    const bar = document.createElement("div");
    bar.id = "mk-store-quick-bar";
    bar.style.cssText = "margin-top:12px; padding:10px 12px; background:rgba(255,255,255,0.05); border-radius:6px; display:flex; flex-wrap:wrap; align-items:center; gap:8px; font-size:12px;";
    bar.innerHTML = `
      <strong style="color:#fbbf24;">Direct Stores:</strong>
      <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Amazon India</a>
      <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Flipkart</a>
      <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Myntra</a>
      <a href="https://www.ajio.com" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">AJIO</a>
      <a href="https://www.croma.com" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Croma</a>
      <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Amazon Global</a>
    `;
    panel.appendChild(bar);
  }

  async function pullShoppingDeals() {
    const batches = await Promise.all(
      SHOPPING_FEEDS.map(async u => {
        try {
          const r = await fetch(RELAYS[0](u));
          const j = await r.json();
          if (Array.isArray(j.items) && j.items.length) return j.items;
        } catch (_) {}
        return [];
      })
    );

    const existing = Array.isArray(window.__mirkukCurrentItems) ? window.__mirkukCurrentItems.slice() : [];
    const seen = new Set(existing.map(x => (x.__cleanTitle || x.title || "").toLowerCase().trim().slice(0, 85)));
    const added = [];

    for (const it of batches.flat()) {
      const cleanT = (it.title || "").split(" - ")[0].trim();
      const key = cleanT.toLowerCase().trim().slice(0, 85);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const safeT = cleanT.replace(/[<>&"']/g, "").slice(0, 68);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><rect width="800" height="450" fill="url(#sh)"/><text x="40" y="65" fill="#fde68a" font-family="Arial,sans-serif" font-size="14" font-weight="bold">SHOPPING &amp; DEALS WIRE</text><text x="40" y="170" fill="#ffffff" font-family="Arial,sans-serif" font-size="30" font-weight="bold">${safeT.slice(0, 34)}</text><text x="40" y="212" fill="#fef3c7" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${safeT.slice(34, 68)}</text><text x="40" y="405" fill="#fbbf24" font-family="Arial,sans-serif" font-size="15" font-weight="bold">MIRKUK SHOPPING</text></svg>`;
      const genImg = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);

      added.push(Object.assign({}, it, {
        __cleanTitle: cleanT,
        __source: "Shopping Deals",
        __img: (it.thumbnail && /^https?:\/\//i.test(it.thumbnail)) ? it.thumbnail : genImg,
        __genImg: genImg,
        __summary: "Latest shopping offer, sale update, and deal alert.",
        __timeAgo: "Deals Live",
        __isJustIn: true
      }));
    }

    if (added.length) {
      window.__mirkukCurrentItems = added.concat(existing).slice(0, 220);
      renderCardsWithLimit();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureStoreBar();
    setTimeout(renderCardsWithLimit, 2400);
    setTimeout(pullShoppingDeals, 2800);
  });
})();

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("div, section").forEach(el => {
      if (el.id === "mk-more-panel" || el.closest("#mk-more-panel")) return;
      const txt = (el.textContent || "").trim();
      if (txt.startsWith("SCHOLARSHIPS, SCHEMES & TRAVEL") && txt.length < 450) {
        el.remove();
      }
    });
  });
})();

(function () {
  function syncMorePanelState() {
    const panel = document.getElementById("mk-more-panel");
    if (!panel) return;
    if (!panel.dataset.userToggled) {
      panel.classList.remove("open");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const panel = document.getElementById("mk-more-panel");
    const openBtn = document.getElementById("mk-more-toggle-btn");
    const closeBtn = document.getElementById("mk-more-close");

    if (panel) {
      panel.classList.remove("open");
    }

    if (openBtn && panel) {
      openBtn.addEventListener("click", function () {
        panel.dataset.userToggled = "1";
        panel.classList.toggle("open");
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener("click", function () {
        panel.dataset.userToggled = "1";
        panel.classList.remove("open");
      });
    }

    setTimeout(syncMorePanelState, 600);
    setTimeout(syncMorePanelState, 1800);
  });
})();

(function () {
  const RELAYS = [
    u => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u),
    u => "https://api.allorigins.win/get?url=" + encodeURIComponent(u)
  ];

  const SAFE_FEEDS = [
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=Elon+Musk+OR+Tesla+OR+Apple+OR+Kanye+West&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=movie+launch+OR+gaming+release+OR+scholarship+OR+scheme+OR+travel&hl=en-IN&gl=IN&ceid=IN:en"
  ];

  function makeSvg(title, source) {
    const t = (title || "Mirkuk News Live").replace(/[<>&"']/g, "").slice(0, 68);
    const s = (source || "MIRKUK WIRE").replace(/[<>&"']/g, "").slice(0, 24).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><rect x="0" y="0" width="800" height="8" fill="#ef4444"/><text x="40" y="65" fill="#fca5a5" font-family="Arial,sans-serif" font-size="14" font-weight="bold">MIRKUK NEWS LIVE</text><text x="40" y="165" fill="#ffffff" font-family="Arial,sans-serif" font-size="30" font-weight="bold">${t.slice(0, 34)}</text><text x="40" y="208" fill="#f3f4f6" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${t.slice(34, 68)}</text><text x="40" y="405" fill="#ef4444" font-family="Arial,sans-serif" font-size="15" font-weight="bold">MIRKUK NEWS</text><text x="760" y="405" text-anchor="end" fill="#d1d5db" font-family="Arial,sans-serif" font-size="14">${s}</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function ensureGridExists() {
    let grid = document.getElementById("mk-grid-area");
    if (!grid) {
      const main = document.querySelector("main") || document.body;
      grid = document.createElement("div");
      grid.id = "mk-grid-area";
      grid.className = "mk-grid-area";
      grid.style.cssText = "display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; margin:16px auto; max-width:1280px; padding:0 16px;";
      const footer = document.querySelector("footer");
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(grid, footer);
      } else {
        main.appendChild(grid);
      }
    }
    grid.style.display = "grid";
    grid.style.visibility = "visible";
    grid.style.opacity = "1";
    return grid;
  }

  async function hydrateContentIfEmpty() {
    const grid = ensureGridExists();
    if (grid && grid.children.length >= 4) return;

    const batches = await Promise.all(
      SAFE_FEEDS.map(async u => {
        try {
          const r = await fetch(RELAYS[0](u));
          const j = await r.json();
          if (Array.isArray(j.items) && j.items.length) return j.items;
        } catch (_) {}
        try {
          const r2 = await fetch(RELAYS[1](u));
          const j2 = await r2.json();
          if (j2 && j2.contents) {
            const doc = new DOMParser().parseFromString(j2.contents, "text/xml");
            return Array.from(doc.querySelectorAll("item")).map(n => ({
              title: (n.querySelector("title")?.textContent || "").trim(),
              link: (n.querySelector("link")?.textContent || "").trim(),
              description: (n.querySelector("description")?.textContent || "").trim()
            }));
          }
        } catch (_) {}
        return [];
      })
    );

    const flat = batches.flat();
    if (!flat.length) return;

    const seen = new Set();
    const cards = [];
    for (const it of flat) {
      const parts = (it.title || "").split(" - ");
      const src = parts.length > 1 ? parts.pop().trim() : "Mirkuk Wire";
      const cleanT = parts.length > 1 ? parts.join(" - ").trim() : (it.title || "").trim();
      const key = cleanT.toLowerCase().slice(0, 80);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const tmp = document.createElement("div");
      tmp.innerHTML = it.description || "";
      const desc = (tmp.textContent || tmp.innerText || "").trim().slice(0, 150);
      const fb = makeSvg(cleanT, src);
      const img = (it.thumbnail && /^https?:\/\//i.test(it.thumbnail)) ? it.thumbnail : fb;

      cards.push(`
        <article class="mk-card mk-grid-card">
          <a href="${it.link || "#"}" target="_blank" rel="noopener noreferrer">
            <img src="${img}" onerror="this.onerror=null;this.src='${fb}';" alt="" loading="lazy" style="width:100%;height:175px;object-fit:cover;display:block;" />
          </a>
          <div class="mk-grid-body" style="padding:12px;">
            <span class="mk-cat-tag">${src}</span>
            <h3 style="margin:6px 0;font-size:15px;"><a href="${it.link || "#"}" target="_blank" rel="noopener noreferrer">${cleanT}</a></h3>
            <p style="margin:0;font-size:13px;opacity:0.85;">${desc}</p>
          </div>
        </article>
      `);
    }

    if (cards.length) {
      grid.innerHTML = cards.slice(0, 60).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureGridExists();
    setTimeout(hydrateContentIfEmpty, 1200);
    setTimeout(hydrateContentIfEmpty, 3200);
  });
})();

(function () {
  function applyLeadPlusSmallCardsLayout() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll("article"));
    if (!cards.length) return;

    cards.forEach((card, idx) => {
      card.classList.add("mk-card", "mk-grid-card");
      if (idx === 0) {
        card.classList.add("mk-lead-big");
      } else {
        card.classList.remove("mk-lead-big");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLeadPlusSmallCardsLayout();
    setTimeout(applyLeadPlusSmallCardsLayout, 1500);
    setTimeout(applyLeadPlusSmallCardsLayout, 3500);

    const grid = document.getElementById("mk-grid-area");
    if (grid && typeof MutationObserver !== "undefined") {
      const obs = new MutationObserver(() => applyLeadPlusSmallCardsLayout());
      obs.observe(grid, { childList: true });
    }
  });
})();

(function () {
  function buildToiBroadsheet() {
    const grid = document.getElementById("mk-grid-area");
    if (!grid) return;

    const oldStage = document.getElementById("mk-portal-showcase");
    if (oldStage) oldStage.remove();

    let stage = document.getElementById("mk-toi-broadsheet");
    if (!stage) {
      stage = document.createElement("section");
      stage.id = "mk-toi-broadsheet";
      stage.className = "mk-toi-stage";
      stage.innerHTML = `
        <div class="mk-toi-hero-grid">
          <aside class="mk-toi-col-left">
            <div class="mk-toi-col-heading">Latest Wire Briefs</div>
            <div id="mk-toi-left-briefs"></div>
          </aside>

          <div class="mk-toi-center-lead">
            <div id="mk-toi-lead-main"></div>
            <div id="mk-toi-lead-sub" class="mk-toi-sub-strip"></div>
          </div>

          <aside class="mk-toi-col-right">
            <div class="mk-toi-col-heading">Trending &amp; Top Picks</div>
            <div id="mk-toi-right-briefs"></div>
          </aside>
        </div>

        <div class="mk-toi-desk-bar">
          <h3>Top Stories &amp; Global Desks</h3>
          <span style="font-size:11px; opacity:0.75;">Multi-Source Live Coverage</span>
        </div>
      `;
      grid.parentNode.insertBefore(stage, grid);
    }

    const items = Array.isArray(window.__mirkukCurrentItems) && window.__mirkukCurrentItems.length
      ? window.__mirkukCurrentItems
      : Array.from(grid.querySelectorAll("article")).map(art => {
          const a = art.querySelector("h3 a, a");
          const img = art.querySelector("img");
          const p = art.querySelector("p");
          const tag = art.querySelector(".mk-cat-tag");
          return {
            __cleanTitle: (a && a.textContent || "").trim(),
            link: (a && a.href) || "#",
            __img: (img && img.src) || "",
            __genImg: (img && img.src) || "",
            __summary: (p && p.textContent || "").trim(),
            __source: (tag && tag.textContent || "Mirkuk Wire").trim()
          };
        }).filter(x => x.__cleanTitle);

    if (!items.length) return;

    const leftBox = document.getElementById("mk-toi-left-briefs");
    if (leftBox) {
      leftBox.innerHTML = items.slice(0, 6).map(it => `
        <div class="mk-toi-brief-item">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a>
          <small>${it.__source || "Mirkuk Wire"} • ${it.__timeAgo || "Live"}</small>
        </div>
      `).join("");
    }

    const lead = items[6] || items[0];
    const leadMain = document.getElementById("mk-toi-lead-main");
    if (leadMain && lead) {
      leadMain.innerHTML = `
        <a href="${lead.link}" target="_blank" rel="noopener noreferrer">
          <img src="${lead.__img || lead.__genImg}" onerror="this.onerror=null;this.src='${lead.__genImg || ""}';" alt="" />
        </a>
        <div class="mk-toi-center-lead-body">
          <span class="mk-cat-tag">${lead.__source || "Lead Story"}</span>
          <h2><a href="${lead.link}" target="_blank" rel="noopener noreferrer">${lead.__cleanTitle}</a></h2>
          <p>${(lead.__summary || "").slice(0, 220)}</p>
        </div>
      `;
    }

    const leadSub = document.getElementById("mk-toi-lead-sub");
    if (leadSub) {
      leadSub.innerHTML = items.slice(7, 10).map(it => `
        <div class="mk-toi-sub-card">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">
            <img src="${it.__img || it.__genImg}" onerror="this.onerror=null;this.src='${it.__genImg || ""}';" alt="" loading="lazy" />
            <span>${it.__cleanTitle}</span>
          </a>
        </div>
      `).join("");
    }

    const rightBox = document.getElementById("mk-toi-right-briefs");
    if (rightBox) {
      rightBox.innerHTML = items.slice(10, 16).map(it => `
        <div class="mk-toi-brief-item">
          <a href="${it.link}" target="_blank" rel="noopener noreferrer">${it.__cleanTitle}</a>
          <small>${it.__source || "Mirkuk Wire"}</small>
        </div>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(buildToiBroadsheet, 900);
    setTimeout(buildToiBroadsheet, 2300);
    setTimeout(buildToiBroadsheet, 4200);
  });
})();
