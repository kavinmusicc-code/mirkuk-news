const ARTICLES_DATA = [
  {
    id: 0,
    category: "National",
    title: "Metropolitan Transit Overhaul Secures Historic Bipartisan Infrastructure Backing",
    author: "Eleanor Vance",
    date: "November 23, 2026",
    readTime: "4 min read",
    gradientClass: "gradient-hero",
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
    category: "Local",
    title: "Harborfront Public Library Reopens After Two-Year Architectural Restoration",
    author: "Marcus Sterling",
    date: "November 23, 2026",
    readTime: "3 min read",
    gradientClass: "gradient-local",
    excerpt: "The century-old landmark returns to civic service with expanded community reading rooms, archival digitization labs, and free evening workshops.",
    paragraphs: [
      "Hundreds of residents lined the granite steps of the Harborfront Public Library on Monday morning as city officials cut the ribbon on a $28 million restoration project two years in the making.",
      "Architects carefully preserved the building's 1924 limestone facade and coffered oak ceilings while retrofitting the interior with modern climate controls, accessible elevators, and solar-assisted lighting systems.",
      "The renovated lower level now houses a public media and digitization lab where local families can preserve historical photographs, community newspapers, and oral history recordings free of charge.",
      "Library administrators announced that weekend operating hours will be extended immediately to accommodate students and remote workers seeking quiet study spaces."
    ]
  },
  {
    id: 2,
    category: "Business",
    title: "Midwest Manufacturing Output Climbs as Domestic Supply Chains Stabilize",
    author: "Claire Holloway",
    date: "November 23, 2026",
    readTime: "5 min read",
    gradientClass: "gradient-business",
    excerpt: "Regional factory orders rose for the fourth consecutive month, led by precision machinery, clean-energy components, and medical equipment.",
    paragraphs: [
      "Industrial production across the American Midwest posted stronger-than-expected gains this quarter as shorter shipping lead times and steadier raw material costs lifted factory utilization rates.",
      "Economists tracking regional purchasing managers noted that mid-sized suppliers in Ohio, Michigan, and Illinois reported steady hiring in skilled technical roles, particularly in automated assembly and quality assurance.",
      "Export demand for agricultural machinery and grid-scale battery enclosures also contributed to the upward trend, offsetting softer order books in traditional residential construction materials.",
      "Market analysts say sustained capital investment in factory floor modernization positions regional manufacturers well heading into the first quarter of next year."
    ]
  },
  {
    id: 3,
    category: "Sports",
    title: "Late Fourth-Quarter Drive Seals Championship Berth for Harbor City Wolves",
    author: "Devon Brooks",
    date: "November 23, 2026",
    readTime: "4 min read",
    gradientClass: "gradient-sports",
    excerpt: "Quarterback Julian Mercer orchestrated an 84-yard march in the final two minutes to clinch a dramatic 24-21 victory before a sold-out stadium.",
    paragraphs: [
      "In front of 68,000 roaring supporters, the Harbor City Wolves engineered one of the most memorable finishes of the season on Sunday night, edging past the Northern Hawks 24-21 to book their spot in the national title game.",
      "Trailing by four points with less than two minutes remaining on the clock, quarterback Julian Mercer completed six consecutive passes against a relentless blitz, capping the 84-yard drive with a pinpoint touchdown throw to the corner of the end zone.",
      "The Wolves' defensive unit sealed the win seconds later when linebacker Andre Cole intercepted a desperate deep pass at midfield, setting off celebrations across the stadium.",
      "Head coach Patricia Morales praised her roster's composure under pressure, noting that months of two-minute drill preparation paid off on the biggest stage."
    ]
  },
  {
    id: 4,
    category: "Culture",
    title: "National Symphony Launches Free Neighborhood Chamber Concert Series",
    author: "Hannah Lindqvist",
    date: "November 23, 2026",
    readTime: "3 min read",
    gradientClass: "gradient-culture",
    excerpt: "Musicians will perform intimate classical and contemporary programs in public parks, schools, and community centers across all five boroughs.",
    paragraphs: [
      "Seeking to bring live orchestral music beyond traditional concert halls, the National Symphony Orchestra has announced a season-long series of forty free chamber performances hosted inside neighborhood auditoriums and public parks.",
      "Each sixty-minute program pairs cornerstone works by Beethoven and Dvorak with newly commissioned pieces by emerging American composers, followed by informal Q&A sessions with the performers.",
      "Cultural directors say ticket cost and downtown travel remain primary barriers for working families, making neighborhood-based programming vital to building the next generation of arts audiences.",
      "Seating for all performances is open to the public on a first-come basis, with morning matinees reserved for local public school students."
    ]
  },
  {
    id: 5,
    category: "Weather",
    title: "Early Winter Cold Front Brings Brisk Winds and Clear Skies Across Northeast",
    author: "Owen Grant",
    date: "November 23, 2026",
    readTime: "3 min read",
    gradientClass: "gradient-weather",
    excerpt: "Temperatures are forecast to dip into the upper twenties overnight as a dry Canadian air mass sweeps across the Atlantic seaboard.",
    paragraphs: [
      "A crisp early-winter air mass pushed across the Great Lakes and into the Northeast on Monday morning, ushering in bright sunshine alongside noticeably brisk northwest winds.",
      "Daytime highs across coastal cities will hover in the mid-forties before dropping into the upper twenties after sunset, prompting municipal agencies to issue routine overnight frost advisories for motorists.",
      "National Weather Service forecasters expect dry, settled conditions to hold steady through midweek, offering favorable visibility for travelers ahead of the busy holiday corridor.",
      "Residents are advised to secure outdoor furniture against gusts reaching thirty miles per hour and to check residential heating systems ahead of colder December temperatures."
    ]
  },
  {
    id: 6,
    category: "Tech",
    title: "Open-Source Battery Research Promises Faster Charging for Grid Storage",
    author: "Sanjay Kulkarni",
    date: "November 23, 2026",
    readTime: "4 min read",
    gradientClass: "gradient-tech",
    excerpt: "University engineers published benchmark results demonstrating a cobalt-free cathode design capable of surviving ten thousand charge cycles.",
    paragraphs: [
      "A consortium of university materials scientists released open-source test data this week detailing a novel iron-phosphate cathode architecture engineered for utility-scale energy storage.",
      "Unlike conventional lithium cells that rely on scarce cobalt and nickel, the new design uses abundant domestic minerals while maintaining thermal stability under rapid charging loads.",
      "In laboratory stress tests spanning eighteen months, prototype cells retained more than ninety-two percent of their original capacity after ten thousand full charge-discharge cycles.",
      "Energy grid operators say low-cost, long-duration storage remains the missing link in balancing wind and solar generation during peak evening electricity demand."
    ]
  }
];

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
    card.innerHTML = `
      <a href="article.html?id=${article.id}" class="card-thumb ${article.gradientClass}" aria-label="${article.title}">
        <span class="media-caption">${article.category.toUpperCase()}</span>
      </a>
      <div class="card-body">
        <span class="category-badge">${article.category}</span>
        <h3 class="card-title">
          <a href="article.html?id=${article.id}">${article.title}</a>
        </h3>
        <p class="card-excerpt">${article.excerpt}</p>
        <div class="card-footer">
          <span>${article.readTime}</span>
          <a href="article.html?id=${article.id}" class="read-more-link">Read Story &rarr;</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initNewsSearch() {
  const searchInput = document.getElementById("news-search");
  const gridArticles = ARTICLES_DATA.filter((item) => item.id !== 0);
  renderNewsCards(gridArticles);
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    const filtered = gridArticles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
      );
    });
    renderNewsCards(filtered);
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
  const captionEl = document.getElementById("article-image-caption");
  const bodyEl = document.getElementById("article-body");

  if (categoryEl) categoryEl.textContent = article.category.toUpperCase();
  titleEl.textContent = article.title;
  if (authorEl) authorEl.textContent = article.author;
  if (dateEl) dateEl.textContent = article.date;
  if (readTimeEl) readTimeEl.textContent = article.readTime;
  if (imageEl) imageEl.className = `article-hero-image ${article.gradientClass}`;
  if (captionEl) captionEl.textContent = `${article.category.toUpperCase()} DESK — MIRKUK NEWS ARCHIVE`;
  if (bodyEl) bodyEl.innerHTML = article.paragraphs.map((p) => `<p>${p}</p>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCurrentDate();
  initDarkMode();
  initMobileMenu();
  initNewsSearch();
  initSingleArticlePage();
});
