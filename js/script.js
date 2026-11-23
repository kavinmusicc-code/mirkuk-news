(function initMirkukCookieConsent() {
  const CONSENT_KEY = "mirkuk_cookie_consent_v1";
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function applyConsentState(choice) {
    const granted = choice === "allow";
    try {
      gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    } catch (_) {}
  }

  function saveChoice(choice) {
    try {
      if (typeof safeSetLocalStorage === "function") {
        safeSetLocalStorage(CONSENT_KEY, choice);
      } else {
        localStorage.setItem(CONSENT_KEY, choice);
      }
    } catch (_) {}
    applyConsentState(choice);
  }

  function getSavedChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }

  try {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500
    });
  } catch (_) {}

  function renderBanner() {
    if (document.getElementById("mirkuk-cookie-banner")) return;
    const banner = document.createElement("div");
    banner.id = "mirkuk-cookie-banner";
    banner.className = "mirkuk-cookie-banner is-visible";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
      <div class="mirkuk-cookie-text">
        We use cookies and browser storage to keep feeds fast and measure site traffic. See our
        <a href="privacy.html">Privacy Policy</a>.
      </div>
      <div class="mirkuk-cookie-actions">
        <button type="button" id="mirkuk-cookie-decline" class="mirkuk-cookie-btn mirkuk-cookie-decline">Decline</button>
        <button type="button" id="mirkuk-cookie-allow" class="mirkuk-cookie-btn mirkuk-cookie-allow">Allow</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("mirkuk-cookie-allow").addEventListener("click", () => {
      saveChoice("allow");
      banner.remove();
    });
    document.getElementById("mirkuk-cookie-decline").addEventListener("click", () => {
      saveChoice("decline");
      banner.remove();
    });
  }

  window.openMirkukCookieSettings = function () {
    try { localStorage.removeItem(CONSENT_KEY); } catch (_) {}
    renderBanner();
  };

  const existingChoice = getSavedChoice();
  if (existingChoice === "allow" || existingChoice === "decline") {
    applyConsentState(existingChoice);
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBanner);
  } else {
    renderBanner();
  }
})();
const ARTICLES_DATA = [
  {
    id: 0,
    region: "World",
    category: "National",
    imageBase: "images/hero",
    title: "Metropolitan Transit Overhaul Secures Historic Bipartisan Infrastructure Backing",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "City planners and federal transport officials unveiled a sweeping ten-year modernization blueprint promising high-speed commuter corridors and zero-emission fleets.",
    paragraphs: [
      "City planners and federal transport officials unveiled a sweeping ten-year modernization blueprint on Monday, promising high-speed commuter corridors, zero-emission bus fleets, and upgraded regional rail hubs across twelve major districts.",
      "According to documents released by the Department of Transportation, construction on the first three priority corridors will begin early next spring."
    ]
  },
  {
    id: 1,
    region: "Tech",
    category: "Gaming & Tech",
    imageBase: "images/tech",
    title: "Grand Theft Auto 6 (GTA 6): Open-World Scale, Next-Gen Physics, and Release Watch",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "5 min read",
    url: "",
    excerpt: "A roundup of key details, open-world ambitions, AI NPC behavior, and player expectations surrounding Grand Theft Auto 6 (GTA 6).",
    paragraphs: [
      "Grand Theft Auto 6 (GTA 6) remains one of the most closely tracked releases in gaming and interactive entertainment, drawing global attention for its sprawling open-world setting and next-generation visual detail.",
      "Players and industry analysts continue watching official milestones, platform optimization details, and open-world simulation features ahead of launch."
    ]
  },
  {
    id: 2,
    region: "India",
    category: "India",
    imageBase: "images/local",
    title: "Major Rail and Highway Corridors Expand Across Indian Metro and Regional Hubs",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "3 min read",
    url: "",
    excerpt: "New connectivity upgrades aim to cut freight transit times and link tier-two cities with major industrial centers across India.",
    paragraphs: [
      "Infrastructure authorities across India have rolled out new rail and highway milestones aimed at strengthening regional trade links and daily commuter travel.",
      "Officials highlighted improved logistics corridors connecting manufacturing clusters with ports and urban commercial hubs."
    ]
  },
  {
    id: 3,
    region: "USA",
    category: "USA",
    imageBase: "images/business",
    title: "Midwest Manufacturing Output Climbs as Domestic Supply Chains Stabilize",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "5 min read",
    url: "",
    excerpt: "Regional factory orders across the United States rose as precision machinery, clean-energy components, and domestic logistics steadied.",
    paragraphs: [
      "Industrial production across the American Midwest posted stronger gains as shorter shipping lead times and steadier input costs lifted factory utilization rates.",
      "Regional suppliers reported steady hiring in skilled technical roles."
    ]
  },
  {
    id: 4,
    region: "North East",
    category: "North East",
    imageBase: "images/weather",
    title: "Early Winter Weather and Connectivity Updates Across North East Regions",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "3 min read",
    url: "",
    excerpt: "Brisk seasonal air currents, road advisories, and regional updates shape conditions across North East corridors.",
    paragraphs: [
      "Seasonal weather patterns and brisk winds moved across North East corridors, prompting routine travel advisories and utility readiness checks.",
      "Local authorities advised commuters and residents to plan ahead for cooler overnight temperatures."
    ]
  },
  {
    id: 5,
    region: "UK",
    category: "UK",
    imageBase: "images/hero",
    title: "UK Energy Grid and Regional Rail Projects Advance Across Britain",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "Utilities and transport bodies outline winter readiness and regional connectivity updates across the United Kingdom.",
    paragraphs: [
      "Grid operators and transport teams across the UK published seasonal reliability updates covering power transmission and rail corridors.",
      "Local councils highlighted commuter and small-business support measures."
    ]
  },
  {
    id: 6,
    region: "World",
    category: "World",
    imageBase: "images/hero",
    title: "Global Diplomacy and Trade Corridors Shape Cross-Border Cooperation",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "International delegates and policy desks track evolving trade agreements, energy transitions, and regional summits.",
    paragraphs: [
      "Cross-border policy discussions and international trade corridors remain central to global economic outlooks.",
      "Analysts monitor maritime logistics, clean energy targets, and diplomatic updates across major capitals."
    ]
  },
  {
    id: 7,
    region: "Business",
    category: "Business",
    imageBase: "images/business",
    title: "Markets and Enterprise Hubs Adapt to Shifting Supply Chain and Capital Trends",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "Companies focus on operational efficiency, domestic manufacturing, and digital tools across key sectors.",
    paragraphs: [
      "Business leaders across manufacturing, retail, and finance continue adjusting investment plans around interest rates and supply chain resilience.",
      "Regional enterprises are prioritizing cost discipline and faster fulfillment."
    ]
  },
  {
    id: 8,
    region: "Tech",
    category: "Tech",
    imageBase: "images/tech",
    title: "Open-Source Battery Research Promises Faster Charging for Grid Storage",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "Engineers publish benchmark results on durable storage designs, software tooling, and cloud infrastructure.",
    paragraphs: [
      "Researchers and engineering teams continue advancing energy storage, developer tools, and connected infrastructure.",
      "Open standards and modular architectures are helping smaller teams build faster web and hardware solutions."
    ]
  },
  {
    id: 9,
    region: "Sports",
    category: "Sports",
    imageBase: "images/sports",
    title: "Late Fourth-Quarter Drive Seals Championship Berth in Stadium Showdown",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "A dramatic late-game finish highlights weekend fixtures, league standings, and standout performances.",
    paragraphs: [
      "High-stakes matchups across major leagues delivered decisive late-game moments and shifting playoff pictures.",
      "Coaches and players credited late-game composure and team depth."
    ]
  },
  {
    id: 10,
    region: "Gaming",
    category: "Gaming",
    imageBase: "images/tech",
    title: "Rockstar Games & Top Viral New Releases: GTA VI Spotlight and Trending Games",
    author: "Prashant Sagar",
    date: "November 23, 2026",
    timestamp: Date.now(),
    readTime: "4 min read",
    url: "",
    excerpt: "Tracking Rockstar Games updates, Grand Theft Auto VI milestones, and top viral new game launches across PC and consoles.",
    paragraphs: [
      "This desk tracks major Rockstar Games announcements, Grand Theft Auto VI developments, and viral new game releases making waves across the gaming community.",
      "Live gaming feeds sync automatically every minute so new patch notes, trailers, and trending titles appear alongside built-in highlights."
    ]
  }
];

const LIVE_RSS_FEEDS = [
  { channel: "BBC India", region: "India", category: "India", imageBase: "images/local", rssUrl: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml" },
  { channel: "The Hindu National", region: "India", category: "India", imageBase: "images/local", rssUrl: "https://www.thehindu.com/news/national/feeder/default.rss" },
  { channel: "Google News India", region: "India", category: "India", imageBase: "images/local", rssUrl: "https://news.google.com/rss/headlines/section/geo/India?hl=en-IN&gl=IN&ceid=IN:en" },
  { channel: "BBC US & Canada", region: "USA", category: "USA", imageBase: "images/business", rssUrl: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml" },
  { channel: "Google News USA", region: "USA", category: "USA", imageBase: "images/business", rssUrl: "https://news.google.com/rss/headlines/section/geo/United%20States?hl=en-US&gl=US&ceid=US:en" },
  { channel: "The Hindu Other States", region: "North East", category: "North East", imageBase: "images/weather", rssUrl: "https://www.thehindu.com/news/national/other-states/feeder/default.rss" },
  { channel: "Google News North East", region: "North East", category: "North East", imageBase: "images/weather", rssUrl: "https://news.google.com/rss/search?q=North%20East%20India%20news&hl=en-IN&gl=IN&ceid=IN:en" },
  { channel: "BBC UK", region: "UK", category: "UK", imageBase: "images/hero", rssUrl: "https://feeds.bbci.co.uk/news/uk/rss.xml" },
  { channel: "Google News UK", region: "UK", category: "UK", imageBase: "images/hero", rssUrl: "https://news.google.com/rss/headlines/section/geo/United%20Kingdom?hl=en-GB&gl=GB&ceid=GB:en" },
  { channel: "Google News Canada", region: "Canada", category: "Canada", imageBase: "images/local", rssUrl: "https://news.google.com/rss/headlines/section/geo/Canada?hl=en-CA&gl=CA&ceid=CA:en" },
  { channel: "Google News Australia", region: "Australia", category: "Australia", imageBase: "images/weather", rssUrl: "https://news.google.com/rss/headlines/section/geo/Australia?hl=en-AU&gl=AU&ceid=AU:en" },
  { channel: "Google News Japan", region: "Japan", category: "Japan", imageBase: "images/tech", rssUrl: "https://news.google.com/rss/headlines/section/geo/Japan?hl=en-JP&gl=JP&ceid=JP:en" },
  { channel: "BBC Europe", region: "Europe", category: "Europe", imageBase: "images/culture", rssUrl: "https://feeds.bbci.co.uk/news/world/europe/rss.xml" },
  { channel: "BBC Middle East", region: "Middle East", category: "Middle East", imageBase: "images/hero", rssUrl: "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml" },
  { channel: "BBC World", region: "World", category: "World", imageBase: "images/hero", rssUrl: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { channel: "BBC Business", region: "Business", category: "Business", imageBase: "images/business", rssUrl: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { channel: "BBC Tech", region: "Tech", category: "Tech", imageBase: "images/tech", rssUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
  { channel: "BBC Sport", region: "Sports", category: "Sports", imageBase: "images/sports", rssUrl: "https://feeds.bbci.co.uk/sport/rss.xml" }
];

const YOUTUBE_API_KEY = "";
const LIVE_YT_CACHE_MS = 30 * 60 * 1000;

const COUNTRY_LIVE_STREAMS = {
  "All": { title: "All Editions — Global Live Wire", note: "Showing live updates across all editions.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "LIVE": { title: "LIVE — Continuous Global Dispatch", note: "24/7 live news desk synced with live feeds.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "India": { title: "India Live Desk", note: "Live coverage and updates focused on India.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "USA": { title: "USA Live Desk", note: "Live coverage and updates focused on the United States.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "North East": { title: "North East Live Desk", note: "Regional updates across North East India.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "UK": { title: "UK Live Desk", note: "Live coverage and updates focused on the United Kingdom.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "Canada": { title: "Canada Live Desk", note: "Live coverage and updates focused on Canada.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "Australia": { title: "Australia Live Desk", note: "Live coverage and updates focused on Australia.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "Japan": { title: "Japan Live Desk", note: "Live coverage and updates focused on Japan.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "Europe": { title: "Europe Live Desk", note: "Live coverage and updates focused on Europe.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "Middle East": { title: "Middle East Live Desk", note: "Live coverage and updates focused on the Middle East.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" },
  "World": { title: "World Live Desk", note: "International headlines and cross-border coverage.", skyNewsEmbedUrl: "", youtubeEmbedUrl: "", embedUrl: "", mp4Url: "" }
};

const AUTO_REFRESH_INTERVAL_MS = 60000;
const ARCHIVE_STORAGE_KEY = "mirkuk_news_archive_v1";
const MAX_ARCHIVED_ARTICLES = 500;
const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const PAGE_BATCH_SIZE = 60;

let VISIBLE_NEWS_LIMIT = PAGE_BATCH_SIZE;
let CURRENT_GRID_ARTICLES = ARTICLES_DATA.filter((item) => item.id !== 0);
let ACTIVE_REGION = "All";
let IS_FETCHING_LIVE = false;

function getDefaultArticles() {
  return ARTICLES_DATA.filter((item) => item.id !== 0);
}

function pruneExpiredArticles(articles, nowMs = Date.now()) {
  if (!Array.isArray(articles)) return [];
  const cutoff = nowMs - RETENTION_MS;
  return articles.filter((item) => {
    if (!item || !item.title) return false;
    if (Number(item.id) < 100) {
      return true;
    }
    const itemTime = Number(item.timestamp || item.savedAt || 0);
    if (!itemTime) {
      item.savedAt = nowMs;
      return true;
    }
    return itemTime >= cutoff;
  });
}

function loadSavedArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const freshOnly = pruneExpiredArticles(parsed);
    return freshOnly.length > 0 ? freshOnly : null;
  } catch (e) {
    return null;
  }
}

function saveArchiveToStorage(articles) {
  try {
    const trimmed = Array.isArray(articles) ? articles.slice(0, MAX_ARCHIVED_ARTICLES) : [];
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    try {
      const smaller = (Array.isArray(articles) ? articles : []).slice(0, 120);
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(smaller));
    } catch (err2) {}
  }
}

function getArticleUniqueKey(item) {
  const titleKey = (item.title || "").trim().toLowerCase();
  const linkKey = (item.url || "").trim().toLowerCase();
  return `${titleKey}::${linkKey}`;
}

function mergeAndSaveArticles(existingList, incomingList) {
  const nowMs = Date.now();
  const map = new Map();

  const addItem = (item) => {
    if (!item || !item.title) return;
    const key = getArticleUniqueKey(item);
    if (!map.has(key)) {
      map.set(key, item);
    }
  };

  const cleanIncoming = (incomingList || []).map((item) => ({
    ...item,
    timestamp: item.timestamp || nowMs,
    savedAt: item.savedAt || nowMs
  }));
  const cleanExisting = pruneExpiredArticles(existingList || [], nowMs);

  cleanIncoming.forEach(addItem);
  cleanExisting.forEach(addItem);

  const merged = pruneExpiredArticles(Array.from(map.values()), nowMs).sort(
    (a, b) => (b.timestamp || b.savedAt || 0) - (a.timestamp || a.savedAt || 0)
  );

  const capped = merged.slice(0, MAX_ARCHIVED_ARTICLES);
  saveArchiveToStorage(capped);
  return capped;
}

function updateSyncStatus(text) {
  const statusEl = document.getElementById("live-sync-status");
  if (statusEl) statusEl.textContent = text;
}

function extractImageFromHtml(htmlString) {
  if (!htmlString) return "";
  try {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    const img = doc.querySelector("img");
    if (!img) return "";
    const src = (img.getAttribute("src") || "").trim();
    if (!src || src.startsWith("data:")) return "";
    return src;
  } catch (e) {
    return "";
  }
}

function getRealArticleImage(item) {
  const candidates = [];
  if (item.enclosure && item.enclosure.link) candidates.push(String(item.enclosure.link).trim());
  if (item.thumbnail) candidates.push(String(item.thumbnail).trim());
  const descImg = extractImageFromHtml(item.description || "");
  if (descImg) candidates.push(descImg);
  const contentImg = extractImageFromHtml(item.content || "");
  if (contentImg) candidates.push(contentImg);

  for (let i = 0; i < candidates.length; i++) {
    if (/^https?:\/\//i.test(candidates[i])) return candidates[i];
  }
  return "";
}

window.handleArticleImgError = function (imgEl) {
  const extensions = ["jpg", "jpeg", "JPG", "JPEG"];
  const base = imgEl.getAttribute("data-base");
  let step = parseInt(imgEl.getAttribute("data-ext-step") || "-1", 10) + 1;

  if (base && step < extensions.length) {
    imgEl.setAttribute("data-ext-step", String(step));
    imgEl.src = `${base}.${extensions[step]}`;
  } else {
    imgEl.onerror = null;
  }
};

function stripHtml(htmlText) {
  const div = document.createElement("div");
  div.innerHTML = htmlText || "";
  return (div.textContent || div.innerText || "").trim();
}

function parsePubTimestamp(pubDate) {
  if (!pubDate) return 0;
  const parsed = Date.parse(pubDate);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function fetchLiveNews() {
  if (IS_FETCHING_LIVE) return;
  IS_FETCHING_LIVE = true;
  updateSyncStatus("Syncing channels...");

  const collected = [];
  const usedRealImages = new Set();

  try {
    for (let i = 0; i < LIVE_RSS_FEEDS.length; i++) {
      const feed = LIVE_RSS_FEEDS[i];
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.rssUrl)}`;

      try {
        const controller = new AbortController();
        const timerId = setTimeout(() => controller.abort(), 7000);
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timerId);
        if (!response.ok) continue;
        const data = await response.json();
        if (!data || data.status !== "ok" || !Array.isArray(data.items)) continue;

        const sortedFeedItems = [...data.items].sort(
          (a, b) => parsePubTimestamp(b.pubDate) - parsePubTimestamp(a.pubDate)
        );

        sortedFeedItems.slice(0, 8).forEach((item, idx) => {
          const rawRealImg = getRealArticleImage(item);
          let finalRealImg = "";
          if (rawRealImg && !usedRealImages.has(rawRealImg)) {
            usedRealImages.add(rawRealImg);
            finalRealImg = rawRealImg;
          }

          const ts = parsePubTimestamp(item.pubDate);
          const cleanDesc = stripHtml(item.description);
          const shortExcerpt =
            cleanDesc.length > 140
              ? `${cleanDesc.slice(0, 140)}...`
              : cleanDesc || `Live dispatch from ${feed.channel}.`;
          const sourceName = item.author || (data.feed && data.feed.title) || feed.channel;

          collected.push({
            id: 100 + i * 10 + idx,
            region: feed.region,
            category: feed.category,
            imageBase: feed.imageBase,
            realImageUrl: finalRealImg,
            isLiveFeed: true,
            timestamp: ts || Date.now(),
            savedAt: Date.now(),
            title: item.title || `${feed.channel} Update`,
            author: sourceName,
            date: ts
              ? new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Just now",
            readTime: `${sourceName} • LIVE`,
            url: item.link || "",
            excerpt: shortExcerpt,
            paragraphs: [
              cleanDesc || "This item was pulled automatically from a live channel RSS feed.",
              `Channel: ${sourceName} | Section: ${feed.region}. Open the source link to read the complete story.`
            ]
          });
        });
      } catch (err) {}
    }
  } finally {
    IS_FETCHING_LIVE = false;
  }

  if (collected.length > 0) {
    CURRENT_GRID_ARTICLES = mergeAndSaveArticles(CURRENT_GRID_ARTICLES, collected);
    applyFilters();
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    updateSyncStatus(`Updated ${nowTime} • +${collected.length} fetched • 30d auto-clean`);
  } else {
    const pruned = pruneExpiredArticles(CURRENT_GRID_ARTICLES);
    CURRENT_GRID_ARTICLES = pruned.length > 0 ? pruned : getDefaultArticles();
    applyFilters();
    updateSyncStatus("Latest archive active (1m auto)");
  }
}

function startAutoMinuteUpdates() {
  fetchLiveNews();
  setInterval(() => {
    fetchLiveNews();
  }, AUTO_REFRESH_INTERVAL_MS);
}

window.retryCountryLiveStream = function () {
  try {
    renderCountryLiveVideo(ACTIVE_REGION || "All");
    fetchLiveNews();
  } catch (e) {}
};

window.handleStreamFallback = function (videoEl, keyName) {
  try {
    if (videoEl) videoEl.onerror = null;
    const stageEl = document.getElementById("live-video-stage");
    if (!stageEl) return;
    stageEl.innerHTML = `
      <div class="live-video-placeholder">
        <p><strong>Stream temporarily unavailable (${keyName})</strong></p>
        <p style="margin-top:6px;opacity:0.85;">Live news updates continue automatically every 1 minute below.</p>
        <button type="button" class="region-btn active" style="margin-top:12px;" onclick="retryCountryLiveStream()">Retry Stream</button>
      </div>
    `;
  } catch (e) {}
};

function renderCountryLiveVideo(regionName) {
  try {
    const headingEl = document.getElementById("live-country-heading");
    const subtextEl = document.getElementById("live-country-subtext");
    const stageEl = document.getElementById("live-video-stage");
    if (!stageEl) return;

    const cleanRegion = String(regionName || "All").trim();
    const key = Object.keys(COUNTRY_LIVE_STREAMS).find(
      (k) => k.toLowerCase() === cleanRegion.toLowerCase()
    ) || "All";
    const info = COUNTRY_LIVE_STREAMS[key] || {
      title: `${cleanRegion} 24/7 Live Desk`,
      note: `Live coverage and dispatches for ${cleanRegion}.`,
      skyNewsEmbedUrl: "",
      youtubeEmbedUrl: "",
      embedUrl: "",
      mp4Url: ""
    };

    if (headingEl) headingEl.textContent = info.title;
    if (subtextEl) subtextEl.textContent = `${info.note} (24/7 feed sync active every 1 minute)`;

    const ytSrc = info.skyNewsEmbedUrl || info.youtubeEmbedUrl || info.embedUrl;
    if (info.mp4Url) {
      stageEl.innerHTML = `<video controls autoplay muted playsinline src="${info.mp4Url}" onerror="handleStreamFallback(this, '${key}')"></video>`;
    } else if (ytSrc) {
      stageEl.innerHTML = `<iframe src="${ytSrc}" title="${info.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    } else {
      stageEl.innerHTML = `
        <div class="live-video-placeholder">
          <p><strong>24/7 LIVE DESK — ${key.toUpperCase()}</strong></p>
          <p style="margin-top:6px;opacity:0.85;">Latest stories for ${key} are shown below and updated every 1 minute.</p>
          <button type="button" class="region-btn active" style="margin-top:12px;" onclick="retryCountryLiveStream()">Sync Now</button>
        </div>
      `;
    }
  } catch (e) {}
}

function cleanIndexQueryUrl() {
  try {
    if (window.location && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      let changed = false;
      if (url.searchParams.has("view") || url.searchParams.has("region")) {
        url.searchParams.delete("view");
        url.searchParams.delete("region");
        changed = true;
      }
      if (url.pathname.endsWith("/index.html")) {
        url.pathname = url.pathname.replace(/index\.html$/, "");
        changed = true;
      }
      if (changed) {
        const cleanPath = url.pathname + (url.search ? url.search : "") + (url.hash ? url.hash : "");
        window.history.replaceState({}, document.title, cleanPath);
      }
    }
  } catch (e) {}
}

function setActiveRegionButton(regionName) {
  ACTIVE_REGION = String(regionName || "All").trim();
  const container = document.getElementById("region-filters");
  if (container) {
    const buttons = container.querySelectorAll(".region-btn");
    buttons.forEach((b) => {
      const btnRegion = (b.getAttribute("data-region") || "").trim();
      b.classList.toggle("active", btnRegion.toLowerCase() === ACTIVE_REGION.toLowerCase());
    });
  }
  renderCountryLiveVideo(ACTIVE_REGION);
}

function applyFilters() {
  try {
    const searchInput = document.getElementById("news-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selected = (ACTIVE_REGION || "All").trim().toLowerCase();

    const baseList = (Array.isArray(CURRENT_GRID_ARTICLES) && CURRENT_GRID_ARTICLES.length > 0)
      ? CURRENT_GRID_ARTICLES
      : getDefaultArticles();

    const filtered = baseList.filter((article) => {
      if (!article) return false;
      let matchesRegion = true;

      if (selected === "live") {
        matchesRegion = Boolean(article.isLiveFeed || article.url);
      } else if (selected !== "all") {
        const reg = (article.region || "").trim().toLowerCase();
        const cat = (article.category || "").trim().toLowerCase();
        const title = (article.title || "").toLowerCase();
        const excerpt = (article.excerpt || "").toLowerCase();

        if (selected === "usa" || selected === "us" || selected === "united states") {
          matchesRegion =
            reg === "usa" ||
            cat === "usa" ||
            title.includes("u.s.") ||
            title.includes("us ") ||
            title.includes("america") ||
            title.includes("united states");
        } else if (selected === "uk" || selected === "united kingdom") {
          matchesRegion =
            reg === "uk" ||
            cat === "uk" ||
            title.includes("u.k.") ||
            title.includes("uk ") ||
            title.includes("britain") ||
            title.includes("british");
        } else {
          matchesRegion =
            reg === selected ||
            cat === selected ||
            title.includes(selected) ||
            excerpt.includes(selected);
        }
      }

      const matchesSearch =
        !query ||
        (article.title || "").toLowerCase().includes(query) ||
        (article.category || "").toLowerCase().includes(query) ||
        (article.region || "").toLowerCase().includes(query) ||
        (article.author || "").toLowerCase().includes(query) ||
        (article.excerpt || "").toLowerCase().includes(query);

      return matchesRegion && matchesSearch;
    });

    renderNewsCards(filtered);
  } catch (e) {
    renderNewsCards(getDefaultArticles());
  }
}

function initRegionFilters() {
  const container = document.getElementById("region-filters");
  if (!container) return;

  let initialRegion = "All";
  try {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const regionParam = params.get("region");
    if (viewParam && viewParam.toLowerCase() === "live") {
      initialRegion = "LIVE";
    } else if (regionParam) {
      initialRegion = regionParam;
    }
  } catch (e) {}

  cleanIndexQueryUrl();
  setActiveRegionButton(initialRegion);
  applyFilters();

  if (!container.dataset.boundClick) {
    container.dataset.boundClick = "true";
    container.addEventListener("click", (event) => {
      const btn = event.target.closest(".region-btn");
      if (!btn) return;
      event.preventDefault();

      const chosen = (btn.getAttribute("data-region") || "All").trim();
      VISIBLE_NEWS_LIMIT = PAGE_BATCH_SIZE;
      setActiveRegionButton(chosen);
      applyFilters();

      if (chosen.toUpperCase() === "LIVE") {
        fetchLiveNews();
      }

      const latestSec = document.getElementById("latest-news");
      if (latestSec) {
        latestSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function renderCurrentDate() {
  const dateEl = document.getElementById("current-date");
  if (!dateEl) return;
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function initDarkMode() {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("mirkuk_theme"); } catch (e) {}
  if (savedTheme === "dark") document.body.classList.add("dark");
  updateThemeButtonLabel();
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    try { localStorage.setItem("mirkuk_theme", isDark ? "dark" : "light"); } catch (e) {}
    updateThemeButtonLabel();
  });
}

function updateThemeButtonLabel() {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  if (!toggleBtn) return;
  const isDark = document.body.classList.contains("dark");
  const iconSpan = toggleBtn.querySelector(".theme-icon");
  const labelSpan = toggleBtn.querySelector(".theme-label");
  if (iconSpan) iconSpan.innerHTML = isDark ? "&#9728;" : "&#9790;";
  if (labelSpan) labelSpan.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mainNav = document.getElementById("main-nav");
  if (!menuBtn || !mainNav) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function syncLoadMoreButton(totalCount) {
  const btn = document.getElementById("load-more-news-btn");
  if (!btn) return;
  if (totalCount > VISIBLE_NEWS_LIMIT) {
    btn.style.display = "inline-block";
    btn.textContent = `Load More News (${Math.min(VISIBLE_NEWS_LIMIT, totalCount)} / ${Math.min(totalCount, MAX_ARCHIVED_ARTICLES)})`;
  } else {
    btn.style.display = "none";
  }
}

function renderNewsCards(articles) {
  const grid = document.getElementById("news-grid");
  const noResults = document.getElementById("no-results");
  if (!grid) return;

  grid.innerHTML = "";
  const list = Array.isArray(articles) && articles.length > 0 ? articles : getDefaultArticles();
  const cappedList = list.slice(0, MAX_ARCHIVED_ARTICLES);

  if (noResults) noResults.classList.add("hidden");
  syncLoadMoreButton(cappedList.length);

  cappedList.slice(0, VISIBLE_NEWS_LIMIT).forEach((article) => {
    const card = document.createElement("article");
    card.className = "news-card";
    const targetHref = article.url ? article.url : `article?id=${article.id}`;
    const targetAttrs = article.url ? 'target="_blank" rel="noopener noreferrer"' : "";
    const badgeText = article.region && article.region !== article.category
      ? `${article.region} • ${article.category}`
      : article.category;
    const initialImgSrc = article.realImageUrl ? article.realImageUrl : `${article.imageBase}.jpg`;
    const metaInfo = article.date && article.isLiveFeed
      ? `${article.readTime} • ${article.date}`
      : article.readTime;

    card.innerHTML = `
      <a href="${targetHref}" ${targetAttrs} class="card-thumb" aria-label="${article.title}">
        <img src="${initialImgSrc}" data-base="${article.imageBase}" onerror="handleArticleImgError(this)" alt="${article.title}" class="card-img">
        <span class="media-caption">${(article.region || article.category).toUpperCase()}</span>
      </a>
      <div class="card-body">
        <span class="category-badge">${badgeText}</span>
        <div class="card-meta-line">${article.date || "Mirkuk Desk"} • ${article.author || "Prashant Sagar"}</div>
        <h3 class="card-title">
          <a href="${targetHref}" ${targetAttrs}>${article.title}</a>
        </h3>
        <p class="card-excerpt">${article.excerpt}</p>
        <div class="card-footer">
          <span>${metaInfo}</span>
          <a href="${targetHref}" ${targetAttrs} class="read-more-link">${article.url ? "Source &rarr;" : "Read Story &rarr;"}</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initNewsSearch() {
  CURRENT_GRID_ARTICLES = loadSavedArchive() || getDefaultArticles();
  applyFilters();

  const searchInput = document.getElementById("news-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      VISIBLE_NEWS_LIMIT = PAGE_BATCH_SIZE;
      applyFilters();
    });
  }

  const moreBtn = document.getElementById("load-more-news-btn");
  if (moreBtn && !moreBtn.dataset.boundMore) {
    moreBtn.dataset.boundMore = "true";
    moreBtn.addEventListener("click", () => {
      VISIBLE_NEWS_LIMIT = Math.min(VISIBLE_NEWS_LIMIT + PAGE_BATCH_SIZE, MAX_ARCHIVED_ARTICLES);
      applyFilters();
    });
  }
}

function initSingleArticlePage() {
  const titleEl = document.getElementById("article-title");
  if (!titleEl) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = parseInt(params.get("id"), 10);
  const article = ARTICLES_DATA.find((item) => item.id === idParam) || ARTICLES_DATA[0];

  document.title = `${article.title} — Mirkuk News`;
  const categoryEl = document.getElementById("article-category");
  const authorEl = document.getElementById("article-author");
  const dateEl = document.getElementById("article-date");
  const readTimeEl = document.getElementById("article-read-time");
  const imageEl = document.getElementById("article-image");
  const bodyEl = document.getElementById("article-body");

  if (categoryEl) categoryEl.textContent = (article.region || article.category).toUpperCase();
  titleEl.textContent = article.title;
  if (authorEl) authorEl.textContent = article.author;
  if (dateEl) dateEl.textContent = article.date;
  if (readTimeEl) readTimeEl.textContent = article.readTime;
  if (imageEl) {
    const initialImgSrc = article.realImageUrl ? article.realImageUrl : `${article.imageBase}.jpg`;
    imageEl.className = "article-hero-image";
    imageEl.innerHTML = `
      <img src="${initialImgSrc}" data-base="${article.imageBase}" onerror="handleArticleImgError(this)" alt="${article.title}" class="article-hero-img">
      <span id="article-image-caption" class="media-caption">${(article.region || article.category).toUpperCase()} DESK — MIRKUK NEWS ARCHIVE</span>
    `;
  }
  if (bodyEl) bodyEl.innerHTML = article.paragraphs.map((p) => `<p>${p}</p>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const safeRun = (fn) => {
    try { fn(); } catch (err) {}
  };

  safeRun(renderCurrentDate);
  safeRun(initDarkMode);
  safeRun(initMobileMenu);
  safeRun(initNewsSearch);
  safeRun(initRegionFilters);
  safeRun(initSingleArticlePage);
  safeRun(startAutoMinuteUpdates);
});



