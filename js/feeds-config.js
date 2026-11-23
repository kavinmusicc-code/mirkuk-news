window.MIRKUK_FEEDS = {
  refreshIntervalMs: 600000, // 10 minutes auto-refresh for faster market & world updates
  sources: [
    // --- STOCK MARKETS & CORPORATE NEWS (WORLDWIDE + INDIA) ---
    {
      desk: "Markets",
      name: "CNBC Markets",
      url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258",
      fallbackImage: "images/business.jpg"
    },
    {
      desk: "Markets",
      name: "Yahoo Finance",
      url: "https://finance.yahoo.com/news/rssindex",
      fallbackImage: "images/business.jpg"
    },
    {
      desk: "Markets",
      name: "MarketWatch Top Stories",
      url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
      fallbackImage: "images/business.jpg"
    },
    {
      desk: "Markets",
      name: "Economic Times Markets",
      url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
      fallbackImage: "images/business.jpg"
    },
    {
      desk: "Markets",
      name: "ET Stocks & Companies",
      url: "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms",
      fallbackImage: "images/business.jpg"
    },
    {
      desk: "Markets",
      name: "Investing.com News",
      url: "https://www.investing.com/rss/news.rss",
      fallbackImage: "images/business.jpg"
    },

    // --- TECH & BIG TECH COMPANIES ---
    {
      desk: "Tech",
      name: "The Verge",
      url: "https://www.theverge.com/rss/index.xml",
      fallbackImage: "images/tech.jpg"
    },
    {
      desk: "Tech",
      name: "TechCrunch",
      url: "https://techcrunch.com/feed/",
      fallbackImage: "images/tech.jpg"
    },

    // --- WORLD NEWS ---
    {
      desk: "World",
      name: "BBC World",
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      fallbackImage: "images/hero.jpg"
    },
    {
      desk: "World",
      name: "Al Jazeera World",
      url: "https://www.aljazeera.com/xml/rss/all.xml",
      fallbackImage: "images/hero.jpg"
    },

    // --- GAMING & ENTERTAINMENT ---
    {
      desk: "Gaming",
      name: "IGN News",
      url: "https://feeds.feedburner.com/ign/news",
      fallbackImage: "images/sports.jpg"
    },

    // --- YOUTUBE VIDEO WIRE ---
    {
      desk: "YouTube",
      name: "Google Developers YT",
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw",
      fallbackImage: "images/tech.jpg"
    }
  ]
};
