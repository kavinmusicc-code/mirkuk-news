/* === MIRKUK LIVE DESK SYNC JS START === */
(function () {
  const DESK_STORIES = [
    { title: "Celebrities & Stage Spotlight: New Creative Releases This Week", topic: "Celebrities", region: "India" },
    { title: "Beauty Desk: Barrier-Friendly Skincare & Daily Routine Guide", topic: "Beauty", region: "Global" },
    { title: "Fashion Desk: Layering, Silhouettes & Seasonal Wardrobe Picks", topic: "Fashion", region: "Global" },
    { title: "Tech Desk: Fast Browser Architecture & Lightweight Web Tools", topic: "Technology", region: "Global" },
    { title: "Defence Desk: Strategic Readiness & Modernization Briefs", topic: "Defence", region: "India" },
    { title: "Business Desk: Small-Scale Commerce, Supply & Market Notes", topic: "Business", region: "India" }
  ];

  function renderDeskFeedBox() {
    const rightPanel = document.querySelector(".mk-right-panel");
    if (!rightPanel || document.getElementById("mk-live-desk-box")) return;

    const box = document.createElement("div");
    box.id = "mk-live-desk-box";
    box.className = "mk-box-card";

    const listHtml = DESK_STORIES.map(
      (item) => `
      <div style="padding:7px 0;border-bottom:1px solid #e5e7eb;cursor:pointer;" data-topic="${item.topic}">
        <div style="font-size:10px;font-weight:700;color:#c8102e;text-transform:uppercase;">${item.topic} · ${item.region}</div>
        <div style="font-size:12px;font-weight:600;line-height:1.35;margin-top:2px;">${item.title}</div>
      </div>
    `
    ).join("");

    box.innerHTML = `
      <h3 class="mk-box-heading">Mirkuk Desk Wire</h3>
      <div>${listHtml}</div>
    `;

    box.addEventListener("click", (e) => {
      const card = e.target.closest("[data-topic]");
      if (!card) return;
      const topic = card.getAttribute("data-topic");
      const search =
        document.querySelector('input[type="search"]') ||
        document.querySelector('input[placeholder*="Search" i]') ||
        document.querySelector("#searchInput, #search, .search-input");
      if (search) {
        search.value = topic;
        search.dispatchEvent(new Event("input", { bubbles: true }));
        search.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    rightPanel.appendChild(box);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDeskFeedBox);
  } else {
    renderDeskFeedBox();
  }
  window.addEventListener("load", () => setTimeout(renderDeskFeedBox, 400));
})();
/* === MIRKUK LIVE DESK SYNC JS END === */