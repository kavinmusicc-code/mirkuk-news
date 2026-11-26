
const MirkukYouTube = (() => {
  const API_KEY = "AIzaSyBNAjSC9DlD8Kekd0l01ZV4pSjD-znaCnY";
  const CHANNEL_ID = "";
  const SEARCH_QUERY = "breaking news world tech";
  const MAX_RESULTS = 6;
  const CACHE_TTL_MS = 60 * 60 * 1000;

  function getCacheKey() {
    return `mirkuk_yt_cache_${CHANNEL_ID || SEARCH_QUERY}`;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(getCacheKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.items;
      }
    } catch (_) {}
    return null;
  }

  function writeCache(items) {
    try {
      localStorage.setItem(
        getCacheKey(),
        JSON.stringify({ timestamp: Date.now(), items })
      );
    } catch (_) {}
  }

  async function fetchVideos() {
    const cached = readCache();
    if (cached) return cached;

    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      order: "date",
      maxResults: String(MAX_RESULTS),
      key: API_KEY,
    });

    if (CHANNEL_ID) {
      params.set("channelId", CHANNEL_ID);
    } else {
      params.set("q", SEARCH_QUERY);
    }

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();
    const items = (data.items || []).map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title || "Untitled Video",
      channelTitle: item.snippet?.channelTitle || "",
      publishedAt: item.snippet?.publishedAt || "",
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "",
    }));

    writeCache(items);
    return items;
  }

  function renderVideos(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    fetchVideos()
      .then((videos) => {
        if (!videos.length) {
          container.innerHTML = "<p>Abhi koi video uplabdh nahi hai.</p>";
          return;
        }
        container.innerHTML = videos
          .map(
            (v) => `
          <article class="mirkuk-video-card">
            <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener noreferrer">
              <img src="${v.thumbnail}" alt="${v.title}" loading="lazy" />
              <h4>${v.title}</h4>
              <span>${v.channelTitle}</span>
            </a>
          </article>
        `
          )
          .join("");
      })
      .catch(() => {
        container.innerHTML = "<p>Video feed asthayi roop se load nahi ho saka.</p>";
      });
  }

  return { renderVideos };
})();
