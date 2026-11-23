window.MIRKUK_FEEDS = {
  refreshIntervalMs: 900000, // 15 minutes auto-refresh
  sources: [
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
      desk: "World",
      name: "BBC World",
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      fallbackImage: "images/hero.jpg"
    },
    {
      desk: "Gaming",
      name: "IGN News",
      url: "https://feeds.feedburner.com/ign/news",
      fallbackImage: "images/sports.jpg"
    },
    {
      desk: "YouTube",
      name: "Google Developers YT",
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw",
      fallbackImage: "images/tech.jpg"
    }
  ]
};
