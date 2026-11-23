const ARTICLES_DATA = [
  {
    id: 0,
    region: "World",
    category: "National",
    imageBase: "images/hero",
    title: "Metropolitan Transit Overhaul Secures Historic Bipartisan Infrastructure Backing",
    author: "Eleanor Vance",
    date: "November 23, 2026",
    readTime: "4 min read",
    url: "",
    excerpt: "City planners and federal transport officials unveiled a sweeping ten-year modernization blueprint promising high-speed commuter corridors and zero-emission fleets.",
    paragraphs: [
      "City planners and federal transport officials unveiled a sweeping ten-year modernization blueprint on Monday, promising high-speed commuter corridors, zero-emission bus fleets, and upgraded regional rail hubs across twelve major districts. The initiative represents the largest single public transit investment in more than four decades.",
      "According to documents released by the Department of Transportation, construction on the first three priority corridors will begin early next spring. Engineers estimate that upgraded signaling systems alone will reduce peak-hour delays by nearly thirty-five percent while increasing overall passenger capacity during morning and evening commutes.",
      "Business coalitions and neighborhood associations largely welcomed the announcement, noting that reliable transit links are essential to sustaining downtown retail recovery and connecting outer-ring residential neighborhoods with major employment centers.",
      "Local municipal leaders have scheduled a series of public town halls over the coming month to gather feedback on station accessibility, bicycle lane integration, and fare-capping programs designed for low-income commuters."
    ]
  },
  {
    id: 1,
    region: "India",
    category: "India",
    imageBase: "images/local",
    title: "Major Rail and Highway Corridors Expand Across Indian Metro and Regional Hubs",
    author: "Rohan Deshmukh",
    date: "November 23, 2026",
    readTime: "3 min read",
    url: "",
    excerpt: "New connectivity upgrades aim to cut freight transit times and link tier-two cities with major industrial centers across India.",
    paragraphs: [
      "Infrastructure authorities across India have rolled out new rail and highway milestones aimed at strengthening regional trade links and daily commuter travel.",
      "Officials highlighted improved logistics corridors connecting manufacturing clusters with ports and urban commercial hubs."
    ]
  },
  {
    id: 2,
    region: "USA",
    category: "USA",
    imageBase: "images/business",
    title: "Midwest Manufacturing Output Climbs as Domestic Supply Chains Stabilize",
    author: "Claire Holloway",
    date: "November 23, 2026",
    readTime: "5 min read",
    url: "",
    excerpt: "Regional factory orders across the United States rose as precision machinery, clean-energy components, and domestic logistics steadied.",
    paragraphs: [
      "Industrial production across the American Midwest posted stronger gains as shorter shipping lead times and steadier input costs lifted factory utilization rates.",
      "Regional suppliers reported steady hiring in skilled technical roles, particularly in automated assembly and quality assurance."
    ]
  },
  {
    id: 3,
    region: "North East",
    category: "North East",
    imageBase: "images/weather",
    title: "Early Winter Weather and Connectivity Updates Across North East Regions",
    author: "Owen Grant",
    date: "November 23, 2026",
    readTime: "3 min read",
    url: "",
    excerpt: "Brisk seasonal air currents, road advisories, and regional updates shape conditions across North East corridors.",
    paragraphs: [
      "Seasonal weather patterns and brisk winds moved across North East corridors, prompting routine travel advisories and utility readiness checks.",
      "Local authorities advised commuters and residents to plan ahead for cooler overnight temperatures and changing transit schedules."
    ]
  },
  {
    id: 4,
    region: "World",
    category: "World",
    imageBase: "images/hero",
    title: "Global Diplomacy and Trade Corridors Shape Cross-Border Cooperation",
    author: "Eleanor Vance",
    date: "November 23, 2026",
    readTime: "4 min read",
    url: "",
    excerpt: "International delegates and policy desks track evolving trade agreements, energy transitions, and regional summits.",
    paragraphs: [
      "Cross-border policy discussions and international trade corridors remain central to global economic outlooks.",
      "Analysts monitor maritime logistics, clean energy targets, and diplomatic updates across major capitals."
    ]
  },
  {
    id: 5,
    region: "Business",
    category: "Business",
    imageBase: "images/business",
    title: "Markets and Enterprise Hubs Adapt to Shifting Supply Chain and Capital Trends",
    author: "Claire Holloway",
    date: "November 23, 2026",
    readTime: "4 min read",
    url: "",
    excerpt: "Companies focus on operational efficiency, domestic manufacturing, and digital tools across key sectors.",
    paragraphs: [
      "Business leaders across manufacturing, retail, and finance continue adjusting investment plans around interest rates and supply chain resilience.",
      "Regional enterprises are prioritizing cost discipline and faster fulfillment."
    ]
  },
  {
    id: 6,
    region: "Tech",
    category: "Tech",
    imageBase: "images/tech",
    title: "Open-Source Battery Research Promises Faster Charging for Grid Storage",
    author: "Sanjay Kulkarni",
    date: "November 23, 2026",
    readTime: "4 min read",
    url: "",
    excerpt: "Engineers publish benchmark results on durable storage designs, software tooling, and cloud infrastructure.",
    paragraphs: [
      "Researchers and engineering teams continue advancing energy storage, developer tools, and connected infrastructure.",
      "Open standards and modular architectures are helping smaller teams build faster web and hardware solutions."
    ]
  },
  {
    id: 7,
    region: "Sports",
    category: "Sports",
    imageBase: "images/sports",
    title: "Late Fourth-Quarter Drive Seals Championship Berth in Stadium Showdown",
    author: "Devon Brooks",
    date: "November 23, 2026",
    readTime: "4 min read",
    url: "",
    excerpt: "A dramatic late-game finish highlights weekend fixtures, league standings, and standout performances.",
    paragraphs: [
      "High-stakes matchups across major leagues delivered decisive late-game moments and shifting playoff pictures.",
      "Coaches and players credited late-game composure and team depth."
    ]
  }
];

const LIVE_RSS_FEEDS = [
  {
    region: "India",
    category: "India",
    imageBase: "images/local",
    rssUrl: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml"
  },
  {
    region: "USA",
    category: "USA",
    imageBase: "images/business",
    rssUrl: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml"
  },
  {
    region: "North East",
    category: "North East",
    imageBase: "images/weather",
    rssUrl: "https://www.thehindu.com/news/national/other-states/feeder/default.rss"
  },
  {
    region: "World",
    category: "World",
    imageBase: "images/hero",
    rssUrl: "https://feeds.bbci.co.uk/news/world/rss.xml"
  },
  {
    region: "Business",
    category: "Business",
    imageBase: "images/business",
    rssUrl: "https://feeds.bbci.co.uk/news/business/rss.xml"
  },
  {
    region: "Tech",
    category: "Tech",
    imageBase: "images/tech",
    rssUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml"
  },
  {
    region: "Sports",
    category: "Sports",
    imageBase: "images/sports",
    rssUrl: "https://feeds.bbci.co.uk/sport/rss.xml"
  }
];

let CURRENT_GRID_ARTICLES = ARTICLES_DATA.filter((item) => item.id !== 0);
let ACTIVE_REGION = "All";

function extractImageFromHtml(htmlString) {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  const img = doc.querySelector("img");
  if (!img) return "";
  const src = (img.getAttribute("src") || "").trim();
  if (!src || src.startsWith("data:")) return "";
  return src;
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

async function fetchLiveNews() {
  const collected = [];
  const usedRealImages = new Set();

  for (let i = 0; i < LIVE_RSS_FEEDS.length; i++) {
    const feed = LIVE_RSS_FEEDS[i];
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.rssUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) continue;
      const data = await response.json();
      if (data.status !== "ok" || !Array.isArray(data.items)) continue;

      data.items.slice(0, 2).forEach((item, idx) => {
        const rawRealImg = getRealArticleImage(item);
        let finalRealImg = "";
        if (rawRealImg && !usedRealImages.has(rawRealImg)) {
          usedRealImages.add(rawRealImg);
          finalRealImg = rawRealImg;
        }

        const cleanDesc = stripHtml(item.description);
        const shortExcerpt =
          cleanDesc.length > 140
            ? `${cleanDesc.slice(0, 140)}...`
            : cleanDesc || `Live ${feed.region} news dispatch.`;

        collected.push({
          id: 100 + i * 10 + idx,
          region: feed.region,
          category: feed.category,
          imageBase: feed.imageBase,
          realImageUrl: finalRealImg,
          isLiveFeed: true,
          title: item.title || `${feed.region} News Update`,
          author: item.author || (data.feed && data.feed.title) || `${feed.region} Desk`,
          date: item.pubDate
            ? new Date(item.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            : "Today",
          readTime: "LIVE",
          url: item.link || "",
          excerpt: shortExcerpt,
          paragraphs: [
            cleanDesc || "This item was pulled automatically from a live RSS news feed.",
            `Section: ${feed.region} | Source: ${(data.feed && data.feed.title) || "Public News RSS"}. Open the source link to read the complete story.`
          ]
        });
      });
    } catch (err) {
      // Keep local items intact if offline or blocked
    }
  }

  if (collected.length > 0) {
    CURRENT_GRID_ARTICLES = collected;
    applyFilters();
  }
}

function setActiveRegionButton(regionName) {
  ACTIVE_REGION = regionName || "All";
  const container = document.getElementById("region-filters");
  if (!container) return;
  const buttons = container.querySelectorAll(".region-btn");
  buttons.forEach((b) => {
    const btnRegion = b.getAttribute("data-region");
    b.classList.toggle("active", btnRegion && btnRegion.toLowerCase() === ACTIVE_REGION.toLowerCase());
  });
}

function applyFilters() {
  const searchInput = document.getElementById("news-search");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = CURRENT_GRID_ARTICLES.filter((article) => {
    let matchesRegion = true;
    if (ACTIVE_REGION === "LIVE") {
      matchesRegion = Boolean(article.isLiveFeed || article.url);
    } else if (ACTIVE_REGION !== "All") {
      matchesRegion =
        (article.region && article.region.toLowerCase() === ACTIVE_REGION.toLowerCase()) ||
        article.category.toLowerCase().includes(ACTIVE_REGION.toLowerCase()) ||
        article.title.toLowerCase().includes(ACTIVE_REGION.toLowerCase());
    }

    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      (article.region && article.region.toLowerCase().includes(query)) ||
      article.excerpt.toLowerCase().includes(query);

    return matchesRegion && matchesSearch;
  });

  renderNewsCards(filtered);
}

function initRegionFilters() {
  const container = document.getElementById("region-filters");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get("view");
  const regionParam = params.get("region");

  if (viewParam && viewParam.toLowerCase() === "live") {
    setActiveRegionButton("LIVE");
  } else if (regionParam) {
    setActiveRegionButton(regionParam);
  }

  const buttons = container.querySelectorAll(".region-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosen = btn.getAttribute("data-region") || "All";
      setActiveRegionButton(chosen);
      applyFilters();
      if (chosen === "LIVE") {
        fetchLiveNews();
      }
      const latestSec = document.getElementById("latest-news");
      if (latestSec) {
        latestSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
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
  const savedTheme = localStorage.getItem("mirkuk_theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  updateThemeButtonLabel();
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("mirkuk_theme", isDark ? "dark" : "light");
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

function renderNewsCards(articles) {
  const grid = document.getElementById("news-grid");
  const noResults = document.getElementById("no-results");
  if (!grid) return;

  grid.innerHTML = "";
  if (articles.length === 0) {
    if (noResults) noResults.classList.remove("hidden");
    return;
  }
  if (noResults) noResults.classList.add("hidden");

  articles.forEach((article) => {
    const card = document.createElement("article");
    card.className = "news-card";
    const targetHref = article.url ? article.url : `article.html?id=${article.id}`;
    const targetAttrs = article.url ? 'target="_blank" rel="noopener noreferrer"' : "";
    const badgeText = article.region && article.region !== article.category
      ? `${article.region} • ${article.category}`
      : article.category;
    const initialImgSrc = article.realImageUrl ? article.realImageUrl : `${article.imageBase}.jpg`;

    card.innerHTML = `
      <a href="${targetHref}" ${targetAttrs} class="card-thumb" aria-label="${article.title}">
        <img src="${initialImgSrc}" data-base="${article.imageBase}" onerror="handleArticleImgError(this)" alt="${article.title}" class="card-img">
        <span class="media-caption">${(article.region || article.category).toUpperCase()}</span>
      </a>
      <div class="card-body">
        <span class="category-badge">${badgeText}</span>
        <h3 class="card-title">
          <a href="${targetHref}" ${targetAttrs}>${article.title}</a>
        </h3>
        <p class="card-excerpt">${article.excerpt}</p>
        <div class="card-footer">
          <span>${article.readTime}</span>
          <a href="${targetHref}" ${targetAttrs} class="read-more-link">${article.url ? "Source &rarr;" : "Read Story &rarr;"}</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initNewsSearch() {
  const searchInput = document.getElementById("news-search");
  applyFilters();
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    applyFilters();
  });
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
  renderCurrentDate();
  initDarkMode();
  initMobileMenu();
  initRegionFilters();
  initNewsSearch();
  initSingleArticlePage();
  fetchLiveNews();
});
