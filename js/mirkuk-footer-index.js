/* === MIRKUK AUTO FOOTER CATEGORIES BOUNDARY START === */
(function () {
  const MIRKUK_EXTRA_CATEGORIES = [
    "Technology",
    "Information Technology",
    "Education",
    "Defence",
    "Business",
    "Markets",
    "World",
    "National",
    "Sports",
    "Science",
    "Health",
    "Automobiles",
    "Lifestyle",
    "Entertainment",
    "Career & Jobs",
    "Environment"
  ];

  function triggerTopicSelection(topic) {
    const searchInput =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Search" i]') ||
      document.querySelector('#searchInput, #search, .search-input');

    if (searchInput) {
      searchInput.value = topic;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const matchingTarget = Array.from(
      document.querySelectorAll("button, a, [data-category], [data-topic], .category-btn, .tab-btn")
    ).find((el) => {
      if (el.closest("#mirkuk-auto-footer-box")) return false;
      const label = (el.dataset.category || el.dataset.topic || el.textContent || "").trim().toLowerCase();
      return label === topic.toLowerCase();
    });

    if (matchingTarget) {
      matchingTarget.click();
      matchingTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMirkukFooterIndex() {
    if (document.getElementById("mirkuk-auto-footer-box")) return;

    const host = document.createElement("section");
    host.id = "mirkuk-auto-footer-box";
    host.setAttribute("aria-label", "More News Categories");
    host.style.cssText = [
      "margin: 28px auto 16px auto",
      "max-width: 1200px",
      "padding: 18px 20px",
      "background: var(--toi-surface, #ffffff)",
      "color: var(--toi-ink, #18191a)",
      "border: 1px solid var(--toi-border, #dfe3e8)",
      "border-top: 3px solid var(--toi-accent, #c8102e)",
      "border-radius: 4px"
    ].join(";");

    const heading = document.createElement("div");
    heading.textContent = "MORE SECTIONS & TOPICS";
    heading.style.cssText = [
      "font-size: 13px",
      "font-weight: 700",
      "letter-spacing: 0.06em",
      "margin-bottom: 12px",
      "color: var(--toi-accent, #c8102e)"
    ].join(";");

    const list = document.createElement("div");
    list.style.cssText = [
      "display: flex",
      "flex-wrap: wrap",
      "gap: 8px 14px"
    ].join(";");

    MIRKUK_EXTRA_CATEGORIES.forEach((topic) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = topic;
      btn.style.cssText = [
        "background: transparent",
        "color: inherit",
        "border: 1px solid var(--toi-border, #dfe3e8)",
        "border-radius: 3px",
        "padding: 5px 10px",
        "font-size: 13px",
        "cursor: pointer"
      ].join(";");

      btn.addEventListener("click", () => triggerTopicSelection(topic));
      list.appendChild(btn);
    });

    host.appendChild(heading);
    host.appendChild(list);

    const footer = document.querySelector("footer");
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(host, footer);
    } else {
      document.body.appendChild(host);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMirkukFooterIndex);
  } else {
    renderMirkukFooterIndex();
  }
})();
/* === MIRKUK AUTO FOOTER CATEGORIES BOUNDARY END === */
