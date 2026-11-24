/* === MIRKUK TOI CARDS & MEGA MENU SCRIPT START === */
(function () {
  const SAMPLE_CARDS = [
    {
      tag: "Technology",
      title: "Next-Gen Web & AI Tools Reshaping Digital Publishing",
      image: "images/culture.jpg",
      sublinks: [
        "Fast browser interfaces for lightweight devices",
        "Independent creators adopting AI workflows"
      ]
    },
    {
      tag: "Defence",
      title: "Strategic Modernization & Indigenous Tech Highlights",
      image: "images/culture.jpg",
      sublinks: [
        "Focus on self-reliant defence systems",
        "Border infrastructure and security updates"
      ]
    },
    {
      tag: "Education",
      title: "Digital Learning & Skill Pathways for Students",
      image: "images/culture.jpg",
      sublinks: [
        "Open schooling and flexible exam tracks",
        "Practical tech and vocational skill programs"
      ]
    },
    {
      tag: "Business",
      title: "Markets, Startups & Independent Creator Economy",
      image: "images/culture.jpg",
      sublinks: [
        "Zero-budget digital storefronts and publishing",
        "Weekly market & economy wrap"
      ]
    }
  ];

  const COMPACT_STRIP_ITEMS = [
    {
      topic: "Information Technology",
      title: "How lightweight PWAs keep mobile & low-RAM browsers fast",
      image: "images/culture.jpg"
    },
    {
      topic: "World",
      title: "Global tech shifts and cross-border digital trends",
      image: "images/culture.jpg"
    },
    {
      topic: "National",
      title: "Key policy, public services, and infrastructure briefs",
      image: "images/culture.jpg"
    }
  ];

  const MEGA_MENU_DATA = {
    "News & Sections": {
      "Core Desks": ["Latest News", "National", "World", "City Updates", "Defence", "Education"],
      "Tech & Digital": ["Technology", "Information Technology", "Gadgets", "AI & Future", "Cyber Watch"]
    },
    "Entertainment": {
      "Screen & Culture": ["Movies", "Web Series", "Music", "Reviews", "Pop Culture"],
      "Lifestyle": ["Wellness", "Travel", "Food", "Book & Creator Notes"]
    },
    "Business & Markets": {
      "Economy": ["Markets", "Startups", "Personal Finance", "Auto & Mobility", "Career & Jobs"]
    }
  };

  function runTopicFilter(topic) {
    const input =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Search" i]') ||
      document.querySelector("#searchInput, #search, .search-input");

    if (input) {
      input.value = topic;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function findAnchorTarget() {
    return (
      document.getElementById("mirkuk-auto-footer-box") ||
      document.querySelector("footer") ||
      document.body
    );
  }

  function renderCardsSection() {
    if (document.getElementById("mirkuk-cards-showcase")) return;

    const section = document.createElement("section");
    section.id = "mirkuk-cards-showcase";
    section.className = "mirkuk-cards-showcase";

    const head = document.createElement("div");
    head.className = "mirkuk-section-head";
    head.innerHTML = 
      <h2>Top Editorial Desks</h2>
      <span class="mirkuk-section-badge">Mirkuk Desk</span>
    ;
    section.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "mirkuk-showcase-grid";

    const appCard = document.createElement("div");
    appCard.className = "mirkuk-app-promo-card";
    appCard.innerHTML = 
      <h4>Mirkuk News App</h4>
      <div class="mirkuk-app-slot-box" id="mirkuk-app-qr-slot">
        App QR / Link Slot<br/>(Add your app QR later)
      </div>
      <button type="button" class="mirkuk-app-btn" id="mirkuk-open-mega-from-card">
        Browse All Sections
      </button>
    ;

    const cardsWrap = document.createElement("div");
    cardsWrap.className = "mirkuk-cards-row";

    SAMPLE_CARDS.forEach((item) => {
      const card = document.createElement("article");
      card.className = "mirkuk-news-card";

      const subListHtml = (item.sublinks || [])
        .map((sub) => <li></li>)
        .join("");

      card.innerHTML = 
        <div class="mirkuk-news-card-media">
          <img src="" alt="" onerror="this.parentElement.style.display='none';" />
        </div>
        <div class="mirkuk-news-tag"></div>
        <h3 class="mirkuk-news-title"></h3>
        <ul class="mirkuk-card-sublinks"></ul>
      ;
      card.style.cursor = "pointer";
      card.addEventListener("click", () => runTopicFilter(item.tag));
      cardsWrap.appendChild(card);
    });

    grid.appendChild(appCard);
    grid.appendChild(cardsWrap);
    section.appendChild(grid);

    const strip = document.createElement("div");
    strip.className = "mirkuk-compact-strip";
    COMPACT_STRIP_ITEMS.forEach((row) => {
      const itemEl = document.createElement("div");
      itemEl.className = "mirkuk-compact-item";
      itemEl.innerHTML = 
        <img src="" alt="" onerror="this.style.display='none';" />
        <p class="mirkuk-compact-title"></p>
      ;
      itemEl.addEventListener("click", () => runTopicFilter(row.topic));
      strip.appendChild(itemEl);
    });
    section.appendChild(strip);

    const anchor = findAnchorTarget();
    if (anchor && anchor !== document.body && anchor.parentNode) {
      anchor.parentNode.insertBefore(section, anchor);
    } else {
      document.body.appendChild(section);
    }
  }

  function renderMegaMenu() {
    if (document.getElementById("mirkuk-mega-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "mirkuk-mega-overlay";

    const panel = document.createElement("div");
    panel.className = "mirkuk-mega-panel";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mirkuk-mega-close";
    closeBtn.setAttribute("aria-label", "Close Menu");
    closeBtn.textContent = "×";

    const title = document.createElement("div");
    title.textContent = "MIRKUK NEWS — ALL SECTIONS";
    title.style.cssText = "font-size: 15px; font-weight: 800; color: #c8102e;";

    const layout = document.createElement("div");
    layout.className = "mirkuk-mega-layout";

    const catsCol = document.createElement("div");
    catsCol.className = "mirkuk-mega-cats";

    const subCol = document.createElement("div");
    subCol.className = "mirkuk-mega-subgrid";

    const categoryKeys = Object.keys(MEGA_MENU_DATA);

    function showCategory(key) {
      Array.from(catsCol.children).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.catKey === key);
      });

      subCol.innerHTML = "";
      const groups = MEGA_MENU_DATA[key] || {};
      Object.entries(groups).forEach(([groupName, items]) => {
        const box = document.createElement("div");
        box.className = "mirkuk-mega-group";

        const h5 = document.createElement("h5");
        h5.textContent = groupName;
        box.appendChild(h5);

        items.forEach((topic) => {
          const itemBtn = document.createElement("button");
          itemBtn.type = "button";
          itemBtn.textContent = topic;
          itemBtn.addEventListener("click", () => {
            overlay.classList.remove("is-open");
            runTopicFilter(topic);
          });
          box.appendChild(itemBtn);
        });

        subCol.appendChild(box);
      });
    }

    categoryKeys.forEach((key) => {
      const catBtn = document.createElement("button");
      catBtn.type = "button";
      catBtn.className = "mirkuk-mega-cat-btn";
      catBtn.dataset.catKey = key;
      catBtn.textContent = key;
      catBtn.addEventListener("click", () => showCategory(key));
      catsCol.appendChild(catBtn);
    });

    if (categoryKeys.length > 0) {
      showCategory(categoryKeys[0]);
    }

    function closeOverlay() {
      overlay.classList.remove("is-open");
    }

    closeBtn.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    });

    layout.appendChild(catsCol);
    layout.appendChild(subCol);
    panel.appendChild(closeBtn);
    panel.appendChild(title);
    panel.appendChild(layout);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.addEventListener("click", (e) => {
      if (e.target.closest("#mirkuk-open-mega-from-card, [data-mirkuk-mega]")) {
        overlay.classList.add("is-open");
      }
    });
  }

  function init() {
    renderCardsSection();
    renderMegaMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", () => setTimeout(init, 400));
})();
/* === MIRKUK TOI CARDS & MEGA MENU SCRIPT END === */
