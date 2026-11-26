/* === MIRKUK REFRESH TO SEE NEW BANNER JS START === */
(function () {
  const REFRESH_INTERVAL_MS = 180000; // 3 minutes

  function createBanner() {
    if (document.getElementById("mirkuk-refresh-banner")) return;

    const banner = document.createElement("div");
    banner.id = "mirkuk-refresh-banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");

    banner.innerHTML = 
      <div class="mirkuk-refresh-left">
        <span class="mirkuk-refresh-dot"></span>
        <span class="mirkuk-refresh-text" id="mirkuk-refresh-label">
          Refresh to see new — Latest headlines &amp; desk updates available
        </span>
      </div>
      <div class="mirkuk-refresh-actions">
        <button type="button" class="mirkuk-refresh-btn" id="mirkuk-refresh-now-btn">
          Refresh Now
        </button>
        <button type="button" class="mirkuk-refresh-dismiss" id="mirkuk-refresh-close-btn" aria-label="Dismiss">
          ×
        </button>
      </div>
    ;

    document.body.insertBefore(banner, document.body.firstChild);

    const refreshBtn = document.getElementById("mirkuk-refresh-now-btn");
    const closeBtn = document.getElementById("mirkuk-refresh-close-btn");
    const labelEl = document.getElementById("mirkuk-refresh-label");

    function triggerRefresh() {
      if (labelEl) {
        labelEl.textContent = "Refreshing Mirkuk News...";
      }
      window.location.reload();
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", triggerRefresh);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        banner.classList.add("is-hidden");
      });
    }

    // Periodically surface the notification when new cycle arrives
    setInterval(() => {
      if (labelEl) {
        labelEl.textContent = "Refresh to see new — Fresh stories ready to load";
      }
      banner.classList.remove("is-hidden");
    }, REFRESH_INTERVAL_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner);
  } else {
    createBanner();
  }
})();
/* === MIRKUK REFRESH TO SEE NEW BANNER JS END === */
