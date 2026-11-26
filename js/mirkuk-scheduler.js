/* === MIRKUK AUTO BOUNDARY START === */
(function () {
  const CONFIG = {
    containerId: "mirkuk-auto-box",
    storageKey: "mirkuk_timed_items_v1",
    rotateEveryHours: 24, // 1 karein to har 1 ghante, 24 karein to har 24 ghante
    expireDays: 30
  };

  function loadCleanItems() {
    const now = Date.now();
    const maxAgeMs = CONFIG.expireDays * 24 * 60 * 60 * 1000;
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    const active = saved.filter(item => now - item.createdAt < maxAgeMs);
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(active));
    return active;
  }

  window.MirkukBoundary = {
    addItem(title, body = "") {
      const items = loadCleanItems();
      items.push({
        id: Date.now(),
        title,
        body,
        createdAt: Date.now()
      });
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(items));
      this.render();
    },
    render() {
      const box = document.getElementById(CONFIG.containerId);
      if (!box) return;
      const items = loadCleanItems();
      if (!items.length) {
        box.innerHTML = "";
        return;
      }
      const slotIndex = Math.floor(Date.now() / (CONFIG.rotateEveryHours * 3600 * 1000));
      const current = items[slotIndex % items.length];
      box.innerHTML = <div style="padding:12px;border:1px solid #ddd;border-radius:8px;">
        <strong></strong>
        <p style="margin:6px 0 0;"></p>
      </div>;
    }
  };

  document.addEventListener("DOMContentLoaded", () => window.MirkukBoundary.render());
})();
/* === MIRKUK AUTO BOUNDARY END === */
