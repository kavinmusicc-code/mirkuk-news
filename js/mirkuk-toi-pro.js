/* === MIRKUK FULL TOI-INSPIRED BROADSHEET JS START === */
(function () {
  const NAV_SECTIONS = [
    {
      label: "Top Stories",
      cols: {
        "Highlights": ["Latest News", "National", "World", "Defence", "Education"],
        "More Desks": ["Business", "Markets", "Sports", "Celebrities", "Beauty", "Fashion"]
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
    { cat: "Fashion", title: "Modern streetwear, layering, and seasonal style notes", img: "mirkuk-news/images/culture.jpg", topic: "Fashion" },
    { cat: "Tech", title: "Clean front-end architecture & fast zero-cost hosting", img: "mirkuk-news/images/tech.jpg", topic: "Technology" }
  ];

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

  function renderProLayout() {
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
        <aside class="mk-right-panel" aria-label="Quick Desks">
          <div class="mk-box-card">
            <h3 class="mk-box-heading">Quick Desk Filter</h3>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              <button type="button" class="mk-nav-btn" data-topic="Celebrities">Celebrities</button>
              <button type="button" class="mk-nav-btn" data-topic="Beauty">Beauty</button>
              <button type="button" class="mk-nav-btn" data-topic="Fashion">Fashion</button>
              <button type="button" class="mk-nav-btn" data-topic="Technology">Tech</button>
            </div>
          </div>
        </aside>
      </div>
    `;

    frontWrap.addEventListener("click", (e) => {
      const t = e.target.closest("[data-topic]");
      if (t) filterByTopic(t.getAttribute("data-topic"));
    });

    masthead.insertAdjacentElement("afterend", frontWrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderProLayout);
  } else {
    renderProLayout();
  }
})();
/* === MIRKUK FULL TOI-INSPIRED BROADSHEET JS END === */