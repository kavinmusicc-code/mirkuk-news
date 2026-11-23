(function () {
  function renderMirkukBannerAd() {
    const slot = document.getElementById("mirkuk-ad-slot");
    if (!slot) return;

    slot.innerHTML = "";
    slot.style.minHeight = "250px";

    window.atOptions = {
      key: "cd6b88215d85afcaea148234eaa0b655",
      format: "iframe",
      height: 250,
      width: 300,
      params: {}
    };

    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.setAttribute("data-cfasync", "false");
    adScript.src = "https://bicea.org/22/cd6b88215d85afcaea148234eaa0b655";
    adScript.async = true;

    slot.appendChild(adScript);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMirkukBannerAd);
  } else {
    renderMirkukBannerAd();
  }
})();
