(function () {
  var SITE_URL = "https://kavinmusicc-code.github.io/mirkuk-news/";

  function getShareTitle(card) {
    if (card) {
      var heading = card.querySelector("h1, h2, h3, h4, .title, .headline");
      if (heading && heading.textContent.trim()) {
        return heading.textContent.trim() + " - Mirkuk News";
      }
    }
    return document.title || "Mirkuk News";
  }

  function shareItem(title, url, btn) {
    if (navigator.share) {
      navigator.share({ title: title, text: title, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        var oldText = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = oldText; }, 1500);
      }).catch(function () {});
    }
  }

  function createShareButton(card) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mirkuk-share-btn";
    btn.textContent = "Share";
    btn.style.cssText = "margin-top:8px;padding:4px 10px;font-size:12px;cursor:pointer;border:1px solid #ccc;border-radius:4px;background:#fff;";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      shareItem(getShareTitle(card), SITE_URL, btn);
    });
    return btn;
  }

  function injectShareButtons() {
    var cards = document.querySelectorAll("article, .news-card, .card, .post");
    cards.forEach(function (card) {
      var existing = card.querySelector(".mirkuk-share-btn");
      if (existing) return;
      card.appendChild(createShareButton(card));
    });

    if (!document.querySelector(".mirkuk-page-share-wrap")) {
      var wrap = document.createElement("div");
      wrap.className = "mirkuk-page-share-wrap";
      wrap.style.cssText = "margin:16px 0;";
      wrap.appendChild(createShareButton(null));
      var mainEl = document.querySelector("main") || document.body;
      mainEl.appendChild(wrap);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectShareButtons);
  } else {
    injectShareButtons();
  }

  var observer = new MutationObserver(injectShareButtons);
  observer.observe(document.body, { childList: true, subtree: true });
})();
