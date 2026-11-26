/* === MIRKUK ROTATOR CONTAINER BOUNDARY START === */
(function () {
  const ROTATOR_CONFIG = {
    containerId: "mirkuk-rotator-box",
    storageKey: "mirkuk_rotator_items_v1",
    mode: "minute", // "minute" = har 1 minute, "hour" = har 1 ghante, "day" = har 24 ghante
    expireDays: 30
  };

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getThemeColors() {
    const isDark = darkQuery.matches;
    if (isDark) {
      return {
        bg: "#0f172a",
        text: "#f8fafc",
        muted: "#94a3b8",
        border: "#334155"
      };
    }
    return {
      bg: "#ffffff",
      text: "#0f172a",
      muted: "#475569",
      border: "#cbd5e1"
    };
  }

  function getIntervalMs(mode) {
    if (mode === "minute") return 60 * 1000;
    if (mode === "hour") return 60 * 60 * 1000;
    return 24 * 60 * 60 * 1000;
  }

  function cleanExpiredItems() {
    const now = Date.now();
    const maxAgeMs = ROTATOR_CONFIG.expireDays * 24 * 60 * 60 * 1000;
    const saved = JSON.parse(localStorage.getItem(ROTATOR_CONFIG.storageKey) || "[]");
    const active = saved.filter(item => now - item.createdAt < maxAgeMs);
    localStorage.setItem(ROTATOR_CONFIG.storageKey, JSON.stringify(active));
    return active;
  }

  function seedDefaultItemsIfEmpty() {
    const existing = cleanExpiredItems();
    if (existing.length > 0) return existing;

    const now = Date.now();
    const defaults = [
      { id: 1, title: "Update Slot #1", text: "Pehla item — test rotation active.", createdAt: now },
      { id: 2, title: "Update Slot #2", text: "Doosra item — automatically rotates by timer.", createdAt: now },
      { id: 3, title: "Update Slot #3", text: "Teesra item — kept for up to 30 days.", createdAt: now }
    ];
    localStorage.setItem(ROTATOR_CONFIG.storageKey, JSON.stringify(defaults));
    return defaults;
  }

  window.MirkukRotator = {
    setMode(newMode) {
      if (["minute", "hour", "day"].includes(newMode)) {
        ROTATOR_CONFIG.mode = newMode;
        this.render();
      }
    },
    add(title, text = "") {
      const items = seedDefaultItemsIfEmpty();
      items.push({
        id: Date.now(),
        title,
        text,
        createdAt: Date.now()
      });
      localStorage.setItem(ROTATOR_CONFIG.storageKey, JSON.stringify(items));
      this.render();
    },
    render() {
      const box = document.getElementById(ROTATOR_CONFIG.containerId);
      if (!box) return;

      const items = seedDefaultItemsIfEmpty();
      const stepMs = getIntervalMs(ROTATOR_CONFIG.mode);
      const bucket = Math.floor(Date.now() / stepMs);
      const current = items[bucket % items.length];
      const colors = getThemeColors();

      box.innerHTML = 
        <div style="background:;color:;border:1px solid ;border-radius:8px;padding:14px;margin:16px 0;transition:background-color 0.2s ease,color 0.2s ease;">
          <div style="font-size:12px;color:;">Mode:  | Auto-delete:  days</div>
          <h3 style="margin:6px 0 4px;color:;"></h3>
          <p style="margin:0;color:;"></p>
        </div>
      ;
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.MirkukRotator.render();
    setInterval(() => window.MirkukRotator.render(), 10000);
  });

  if (darkQuery.addEventListener) {
    darkQuery.addEventListener("change", () => window.MirkukRotator.render());
  }
})();
/* === MIRKUK ROTATOR CONTAINER BOUNDARY END === */
