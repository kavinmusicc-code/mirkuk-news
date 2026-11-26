/* === MIRKUK 195 COUNTRIES MODULE JS START === */
(function () {
  const COUNTRIES_195 = [
    ["AF","Afghanistan","Asia"],["AL","Albania","Europe"],["DZ","Algeria","Africa"],["AD","Andorra","Europe"],["AO","Angola","Africa"],
    ["AG","Antigua and Barbuda","Americas"],["AR","Argentina","Americas"],["AM","Armenia","Asia"],["AU","Australia","Oceania"],["AT","Austria","Europe"],
    ["AZ","Azerbaijan","Asia"],["BS","Bahamas","Americas"],["BH","Bahrain","Asia"],["BD","Bangladesh","Asia"],["BB","Barbados","Americas"],
    ["BY","Belarus","Europe"],["BE","Belgium","Europe"],["BZ","Belize","Americas"],["BJ","Benin","Africa"],["BT","Bhutan","Asia"],
    ["BO","Bolivia","Americas"],["BA","Bosnia and Herzegovina","Europe"],["BW","Botswana","Africa"],["BR","Brazil","Americas"],["BN","Brunei","Asia"],
    ["BG","Bulgaria","Europe"],["BF","Burkina Faso","Africa"],["BI","Burundi","Africa"],["CV","Cabo Verde","Africa"],["KH","Cambodia","Asia"],
    ["CM","Cameroon","Africa"],["CA","Canada","Americas"],["CF","Central African Republic","Africa"],["TD","Chad","Africa"],["CL","Chile","Americas"],
    ["CN","China","Asia"],["CO","Colombia","Americas"],["KM","Comoros","Africa"],["CG","Congo","Africa"],["CR","Costa Rica","Americas"],
    ["CI","Cote d'Ivoire","Africa"],["HR","Croatia","Europe"],["CU","Cuba","Americas"],["CY","Cyprus","Asia"],["CZ","Czechia","Europe"],
    ["CD","Democratic Republic of the Congo","Africa"],["DK","Denmark","Europe"],["DJ","Djibouti","Africa"],["DM","Dominica","Americas"],["DO","Dominican Republic","Americas"],
    ["EC","Ecuador","Americas"],["EG","Egypt","Africa"],["SV","El Salvador","Americas"],["GQ","Equatorial Guinea","Africa"],["ER","Eritrea","Africa"],
    ["EE","Estonia","Europe"],["SZ","Eswatini","Africa"],["ET","Ethiopia","Africa"],["FJ","Fiji","Oceania"],["FI","Finland","Europe"],
    ["FR","France","Europe"],["GA","Gabon","Africa"],["GM","Gambia","Africa"],["GE","Georgia","Asia"],["DE","Germany","Europe"],
    ["GH","Ghana","Africa"],["GR","Greece","Europe"],["GD","Grenada","Americas"],["GT","Guatemala","Americas"],["GN","Guinea","Africa"],
    ["GW","Guinea-Bissau","Africa"],["GY","Guyana","Americas"],["HT","Haiti","Americas"],["VA","Holy See","Europe"],["HN","Honduras","Americas"],
    ["HU","Hungary","Europe"],["IS","Iceland","Europe"],["IN","India","Asia"],["ID","Indonesia","Asia"],["IR","Iran","Asia"],
    ["IQ","Iraq","Asia"],["IE","Ireland","Europe"],["IL","Israel","Asia"],["IT","Italy","Europe"],["JM","Jamaica","Americas"],
    ["JP","Japan","Asia"],["JO","Jordan","Asia"],["KZ","Kazakhstan","Asia"],["KE","Kenya","Africa"],["KI","Kiribati","Oceania"],
    ["KP","North Korea","Asia"],["KR","South Korea","Asia"],["KW","Kuwait","Asia"],["KG","Kyrgyzstan","Asia"],["LA","Laos","Asia"],
    ["LV","Latvia","Europe"],["LB","Lebanon","Asia"],["LS","Lesotho","Africa"],["LR","Liberia","Africa"],["LY","Libya","Africa"],
    ["LI","Liechtenstein","Europe"],["LT","Lithuania","Europe"],["LU","Luxembourg","Europe"],["MG","Madagascar","Africa"],["MW","Malawi","Africa"],
    ["MY","Malaysia","Asia"],["MV","Maldives","Asia"],["ML","Mali","Africa"],["MT","Malta","Europe"],["MH","Marshall Islands","Oceania"],
    ["MR","Mauritania","Africa"],["MU","Mauritius","Africa"],["MX","Mexico","Americas"],["FM","Micronesia","Oceania"],["MD","Moldova","Europe"],
    ["MC","Monaco","Europe"],["MN","Mongolia","Asia"],["ME","Montenegro","Europe"],["MA","Morocco","Africa"],["MZ","Mozambique","Africa"],
    ["MM","Myanmar","Asia"],["NA","Namibia","Africa"],["NR","Nauru","Oceania"],["NP","Nepal","Asia"],["NL","Netherlands","Europe"],
    ["NZ","New Zealand","Oceania"],["NI","Nicaragua","Americas"],["NE","Niger","Africa"],["NG","Nigeria","Africa"],["MK","North Macedonia","Europe"],
    ["NO","Norway","Europe"],["OM","Oman","Asia"],["PK","Pakistan","Asia"],["PW","Palau","Oceania"],["PS","Palestine","Asia"],
    ["PA","Panama","Americas"],["PG","Papua New Guinea","Oceania"],["PY","Paraguay","Americas"],["PE","Peru","Americas"],["PH","Philippines","Asia"],
    ["PL","Poland","Europe"],["PT","Portugal","Europe"],["QA","Qatar","Asia"],["RO","Romania","Europe"],["RU","Russia","Europe"],
    ["RW","Rwanda","Africa"],["KN","Saint Kitts and Nevis","Americas"],["LC","Saint Lucia","Americas"],["VC","Saint Vincent and the Grenadines","Americas"],["WS","Samoa","Oceania"],
    ["SM","San Marino","Europe"],["ST","Sao Tome and Principe","Africa"],["SA","Saudi Arabia","Asia"],["SN","Senegal","Africa"],["RS","Serbia","Europe"],
    ["SC","Seychelles","Africa"],["SL","Sierra Leone","Africa"],["SG","Singapore","Asia"],["SK","Slovakia","Europe"],["SI","Slovenia","Europe"],
    ["SB","Solomon Islands","Oceania"],["SO","Somalia","Africa"],["ZA","South Africa","Africa"],["SS","South Sudan","Africa"],["ES","Spain","Europe"],
    ["LK","Sri Lanka","Asia"],["SD","Sudan","Africa"],["SR","Suriname","Americas"],["SE","Sweden","Europe"],["CH","Switzerland","Europe"],
    ["SY","Syria","Asia"],["TJ","Tajikistan","Asia"],["TZ","Tanzania","Africa"],["TH","Thailand","Asia"],["TL","Timor-Leste","Asia"],
    ["TG","Togo","Africa"],["TO","Tonga","Oceania"],["TT","Trinidad and Tobago","Americas"],["TN","Tunisia","Africa"],["TR","Turkey","Asia"],
    ["TM","Turkmenistan","Asia"],["TV","Tuvalu","Oceania"],["UG","Uganda","Africa"],["UA","Ukraine","Europe"],["AE","United Arab Emirates","Asia"],
    ["GB","United Kingdom","Europe"],["US","United States","Americas"],["UY","Uruguay","Americas"],["UZ","Uzbekistan","Asia"],["VU","Vanuatu","Oceania"],
    ["VE","Venezuela","Americas"],["VN","Vietnam","Asia"],["YE","Yemen","Asia"],["ZM","Zambia","Africa"],["ZW","Zimbabwe","Africa"]
  ];

  const REGIONS = ["All", "Asia", "Europe", "Africa", "Americas", "Oceania"];
  let activeRegion = "All";
  let selectedCountry = "";

  function applyCountryFilter(countryName) {
    selectedCountry = countryName;
    const triggerBtn = document.getElementById("mirkuk-open-countries-btn");
    if (triggerBtn) {
      triggerBtn.textContent = countryName
        ? Edition:  (195 Countries)
        : "Browse All 195 Countries";
    }

    const searchInput =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Search" i]') ||
      document.querySelector("#searchInput, #search, .search-input");

    if (searchInput) {
      searchInput.value = countryName;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function renderUI() {
    if (document.getElementById("mirkuk-countries-bar")) return;

    const bar = document.createElement("div");
    bar.id = "mirkuk-countries-bar";
    bar.innerHTML = 
      <div class="mirkuk-countries-left">
        <span class="mirkuk-countries-badge">Global Desk</span>
        <span><strong> Countries</strong> supported</span>
      </div>
      <div class="mirkuk-countries-left">
        <button type="button" class="mirkuk-country-trigger" id="mirkuk-open-countries-btn">
          Browse All 195 Countries
        </button>
        <button type="button" class="mirkuk-country-trigger" id="mirkuk-reset-country-btn">
          All / Global
        </button>
      </div>
    ;

    const banner = document.getElementById("mirkuk-refresh-banner");
    if (banner && banner.parentNode) {
      banner.insertAdjacentElement("afterend", bar);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    const modal = document.createElement("div");
    modal.id = "mirkuk-countries-modal";
    modal.innerHTML = 
      <div class="mirkuk-countries-dialog" role="dialog" aria-modal="true" aria-label="195 Countries Directory">
        <div class="mirkuk-countries-head">
          <h3>Mirkuk News — All 195 Countries ()</h3>
          <button type="button" class="mirkuk-countries-close" id="mirkuk-close-countries-btn" aria-label="Close">&times;</button>
        </div>
        <div class="mirkuk-countries-controls" id="mirkuk-countries-controls">
          <input type="text" class="mirkuk-countries-search" id="mirkuk-country-search" placeholder="Search country name or code (e.g. India, US, JP)..." />
        </div>
        <div class="mirkuk-countries-grid" id="mirkuk-countries-grid"></div>
      </div>
    ;
    document.body.appendChild(modal);

    const controls = document.getElementById("mirkuk-countries-controls");
    const searchEl = document.getElementById("mirkuk-country-search");
    const gridEl = document.getElementById("mirkuk-countries-grid");

    REGIONS.forEach((reg) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mirkuk-region-btn" + (reg === activeRegion ? " active" : "");
      btn.textContent = reg;
      btn.addEventListener("click", () => {
        activeRegion = reg;
        Array.from(controls.querySelectorAll(".mirkuk-region-btn")).forEach((b) => {
          b.classList.toggle("active", b.textContent === reg);
        });
        paintList();
      });
      controls.appendChild(btn);
    });

    function paintList() {
      const q = (searchEl.value || "").trim().toLowerCase();
      gridEl.innerHTML = "";

      const filtered = COUNTRIES_195.filter(([code, name, region]) => {
        const matchRegion = activeRegion === "All" || region === activeRegion;
        const matchQuery = !q || name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
        return matchRegion && matchQuery;
      });

      if (filtered.length === 0) {
        gridEl.innerHTML = <p style="grid-column:1/-1;margin:8px 0;color:#6b7280;">No matching country found.</p>;
        return;
      }

      filtered.forEach(([code, name]) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "mirkuk-country-item" + (selectedCountry === name ? " selected" : "");
        item.innerHTML = <span></span><span class="mirkuk-country-code"></span>;
        item.addEventListener("click", () => {
          applyCountryFilter(name);
          modal.classList.remove("is-open");
          paintList();
        });
        gridEl.appendChild(item);
      });
    }

    paintList();

    searchEl.addEventListener("input", paintList);

    document.getElementById("mirkuk-open-countries-btn").addEventListener("click", () => {
      modal.classList.add("is-open");
      setTimeout(() => searchEl.focus(), 50);
    });

    document.getElementById("mirkuk-reset-country-btn").addEventListener("click", () => {
      applyCountryFilter("");
      paintList();
    });

    document.getElementById("mirkuk-close-countries-btn").addEventListener("click", () => {
      modal.classList.remove("is-open");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("is-open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderUI);
  } else {
    renderUI();
  }
})();
/* === MIRKUK 195 COUNTRIES MODULE JS END === */
