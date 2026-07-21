(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var COMPANY = {
    phoneDisplay: "+91 8115 012 336",
    phoneIntl: "918115012336",
    email: "waltsolarenergies17@gmail.com"
  };

  var FALLBACK_PRICING = {
    currencySymbol: "₹",
    competitor: "TATA",
    brands: ["Waree", "Adani", "Alpex"],
    systems: [
      {
        id: "hybrid", name: "Hybrid Solar System",
        tagline: "Battery backup + grid , power even during outages.",
        brands: ["Waree", "Adani", "Alpex"],
        tiers: [
          { capacity: "2 kW", capacityKw: 2, price: 175000 },
          { capacity: "3 kW", capacityKw: 3, price: 220000 },
          { capacity: "4 kW", capacityKw: 4, price: 275000 }
        ]
      },
      {
        id: "ongrid", name: "On-Grid Solar System",
        tagline: "Grid-tied with net metering , the lowest-cost way to go solar.",
        brands: ["Waree", "Adani", "Alpex"],
        tiers: [
          { capacity: "2 kW", capacityKw: 2, price: 140000, tata: 165000 },
          { capacity: "3 kW", capacityKw: 3, price: 170000, tata: 190000 },
          { capacity: "4 kW", capacityKw: 4, price: 215000, tata: 225000 },
          { capacity: "5 kW", capacityKw: 5, price: 250000, tata: 265000 }
        ]
      }
    ],
    comparison: {
      competitor: "TATA",
      rows: [
        { capacity: "2 kW", walt: 140000, tata: 165000, save: 25000 },
        { capacity: "3 kW", walt: 170000, tata: 190000, save: 20000 },
        { capacity: "4 kW", walt: 215000, tata: 225000, save: 10000 },
        { capacity: "5 kW", walt: 250000, tata: 265000, save: 15000 }
      ]
    }
  };

  var SHOWCASE_SLIDES = [
    { src: "assets/videos/solar-drone.mp4", caption: "Drone footage of the solar installation" },
    { src: "assets/videos/solar-install.mp4", caption: "On-site installation in progress" },
    { src: "assets/videos/solar-closeup.mp4", caption: "Close-up of premium solar panels" }
  ];

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmtINR(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    function onScroll() {
      if (window.scrollY > 24) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = document.getElementById("menu-toggle");
    var closeBtn = document.getElementById("menu-close");
    var drawer = document.getElementById("mobile-drawer");
    var overlay = document.getElementById("drawer-overlay");

    function openDrawer() {
      drawer.classList.add("open");
      overlay.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      navbar.classList.add("drawer-open");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      navbar.classList.remove("drawer-open");
      document.body.style.overflow = "";
    }
    if (toggle) toggle.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
    Array.prototype.forEach.call(document.querySelectorAll(".mobile-link"), function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll(".stat-num");
    function run(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (prefersReduced) { el.textContent = target.toLocaleString("en-IN") + suffix; return; }
      var start = 0, dur = 1600, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var val = Math.floor((0.5 - Math.cos(p * Math.PI) / 2) * (target - start) + start);
        el.textContent = val.toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nums, run); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  }

  /* ---------- Showcase carousel ---------- */
  function initShowcase() {
    var wrap = document.getElementById("showcase-wrapper");
    var frame = document.querySelector(".showcase-swiper");
    if (!wrap || !frame) return;

    wrap.innerHTML = "";
    SHOWCASE_SLIDES.forEach(function (s, index) {
      var slide = document.createElement("div");
      slide.className = "showcase-slide" + (index === 0 ? " active" : "");
      slide.setAttribute("data-index", String(index));

      var video = document.createElement("video");
      video.src = s.src;
      video.autoplay = index === 0;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("disablePictureInPicture", "");
      video.setAttribute("aria-label", s.caption);
      video.className = "showcase-video";
      video.addEventListener("canplay", function () {
        video.play().catch(function () {});
      });
      video.addEventListener("loadedmetadata", function () {
        video.play().catch(function () {});
      });

      var caption = document.createElement("div");
      caption.className = "slide-caption";
      caption.textContent = s.caption;

      slide.appendChild(video);
      slide.appendChild(caption);
      wrap.appendChild(slide);
    });

    var slides = Array.prototype.slice.call(wrap.querySelectorAll(".showcase-slide"));
    var current = 0;
    var pagination = frame.querySelector(".swiper-pagination");
    var bullets = [];
    var setActive = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
        var video = slide.querySelector("video");
        if (video) {
          if (i === current) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        }
      });
      bullets.forEach(function (bullet, i) {
        bullet.classList.toggle("swiper-pagination-bullet-active", i === current);
      });
    };

    var nextBtn = frame.querySelector(".swiper-button-next");
    var prevBtn = frame.querySelector(".swiper-button-prev");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () { setActive(current + 1); });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () { setActive(current - 1); });
    }
    if (pagination) {
      pagination.innerHTML = "";
      slides.forEach(function (_, index) {
        var dot = document.createElement("button");
        dot.className = "swiper-pagination-bullet" + (index === 0 ? " swiper-pagination-bullet-active" : "");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to slide " + (index + 1));
        dot.addEventListener("click", function () { setActive(index); });
        pagination.appendChild(dot);
        bullets.push(dot);
      });
    }
    setActive(0);

    window.clearInterval(window.showcaseAutoTimer);
    window.showcaseAutoTimer = window.setInterval(function () {
      setActive(current + 1);
    }, 4500);
  }

  /* ---------- Floating video pop ---------- */
  function initFloatingVideoPop() {
    var video = document.getElementById("floating-video");
    var toggleBtn = document.getElementById("floating-video-toggle");
    var muteBtn = document.getElementById("floating-video-mute");
    var minimizeBtn = document.getElementById("floating-video-minimize");
    var maximizeBtn = document.getElementById("floating-video-maximize");
    var pop = document.querySelector(".floating-video-pop");
    if (!video || !toggleBtn || !muteBtn || !minimizeBtn || !maximizeBtn || !pop) return;

    var minimized = false;

    function setButtonIcon(btn, iconName) {
      if (!btn || !window.lucide || typeof window.lucide.createIcons !== "function") return;
      btn.innerHTML = "";
      var icon = document.createElement("i");
      icon.setAttribute("data-lucide", iconName);
      btn.appendChild(icon);
      window.lucide.createIcons({ root: btn });
    }

    function setToggleLabel() {
      var newIconName = video.paused ? "play" : "pause";
      setButtonIcon(toggleBtn, newIconName);
      toggleBtn.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
    }

    function setMuteLabel() {
      var newIconName = video.muted ? "volume-x" : "volume-2";
      setButtonIcon(muteBtn, newIconName);
      muteBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
    }

    function setMinimizedState() {
      pop.classList.toggle("is-minimized", minimized);
      pop.setAttribute("aria-expanded", minimized ? "false" : "true");
    }

    video.addEventListener("play", setToggleLabel);
    video.addEventListener("pause", setToggleLabel);
    video.addEventListener("volumechange", setMuteLabel);

    toggleBtn.addEventListener("click", function () {
      if (video.paused) video.play().catch(function() {});
      else video.pause();
    });

    muteBtn.addEventListener("click", function () {
      video.muted = !video.muted;
    });

    minimizeBtn.addEventListener("click", function () {
      minimized = true;
      setMinimizedState();
    });

    maximizeBtn.addEventListener("click", function () {
      minimized = false;
      setMinimizedState();
    });

    setTimeout(function() {
      setToggleLabel();
      setMuteLabel();
      setMinimizedState();
    }, 50);
  }

  /* ---------- Catalog ---------- */
  var STATE = { brand: "", capacity: "all", data: null };

  function buildCapacityChips(data) {
    var caps = {};
    data.systems.forEach(function (sys) {
      sys.tiers.forEach(function (t) { caps[t.capacityKw] = t.capacity; });
    });
    var order = Object.keys(caps).map(Number).sort(function (a, b) { return a - b; });
    var container = document.getElementById("capacity-filter");
    if (!container) return;
    var html = '<button class="cap-chip active" data-cap="all">All</button>';
    order.forEach(function (kw) {
      html += '<button class="cap-chip" data-cap="' + kw + '">' + caps[kw] + "</button>";
    });
    container.innerHTML = html;
    Array.prototype.forEach.call(container.querySelectorAll(".cap-chip"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(container.querySelectorAll(".cap-chip"), function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        STATE.capacity = btn.getAttribute("data-cap");
        renderCatalog();
      });
    });
  }

  function systemMatchesBrand(sys, q) {
    if (!q) return true;
    if (sys.name.toLowerCase().indexOf(q) !== -1) return true;
    return sys.brands.some(function (b) { return b.toLowerCase().indexOf(q) !== -1; });
  }

  function renderCatalog() {
    var grid = document.getElementById("catalog-grid");
    if (!grid || !STATE.data) return;
    var q = STATE.brand.trim().toLowerCase();
    var cap = STATE.capacity;
    var cards = [];

    STATE.data.systems.forEach(function (sys) {
      if (!systemMatchesBrand(sys, q)) return;
      var tiers = sys.tiers.filter(function (t) { return cap === "all" || String(t.capacityKw) === String(cap); });
      if (!tiers.length) return;

      var actions = sys.id === "hybrid"
        ? [["System Specs", "#systems"], ["Compare", "#compare"]]
        : [["Compare", "#compare"], ["Investment Guide", "#contact"]];

      var rows = tiers.map(function (t) {
        return '<div class="tier-row">' +
          '<span class="tier-cap">' + t.capacity + "</span>" +
          '<span class="tier-price">' + fmtINR(t.price) + "</span>" +
          '<button class="tier-btn" data-quote data-system="' + sys.name + '" data-capacity="' + t.capacity + '">' +
          '<i data-lucide="file-text"></i> Quote</button>' +
          "</div>";
      }).join("");

      var actionBtns = '<button data-quote data-system="' + sys.name + '"><i data-lucide="mail"></i> Request Quote</button>';
      actions.forEach(function (a) {
        actionBtns += '<button data-scroll="' + a[1] + '">' + a[0] + "</button>";
      });

      var brandTags = sys.brands.map(function (b) { return "<span>" + b + "</span>"; }).join("");

      cards.push(
        '<div class="catalog-card">' +
          "<h3>" + sys.name + "</h3>" +
          '<p class="sub">' + sys.tagline + "</p>" +
          '<div class="catalog-brands">' + brandTags + "</div>" +
          '<div class="tier-list">' + rows + "</div>" +
          '<div class="catalog-actions">' + actionBtns + "</div>" +
        "</div>"
      );
    });

    grid.innerHTML = cards.length ? cards.join("") : '<div class="catalog-empty">No results. Try “Waree”, “Adani” or “Alpex”.</div>';
    wireCatalogButtons(grid);
    refreshIcons();
  }

  function wireCatalogButtons(grid) {
    Array.prototype.forEach.call(grid.querySelectorAll("[data-quote]"), function (btn) {
      btn.addEventListener("click", function () {
        openModal({
          system: btn.getAttribute("data-system") || "",
          capacity: btn.getAttribute("data-capacity") || "",
          brand: STATE.brand.trim()
        });
      });
    });
    Array.prototype.forEach.call(grid.querySelectorAll("[data-scroll]"), function (btn) {
      btn.addEventListener("click", function () {
        var el = document.querySelector(btn.getAttribute("data-scroll"));
        if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      });
    });
  }

  function initCatalog(data) {
    STATE.data = data;
    buildCapacityChips(data);
    var search = document.getElementById("brand-search");
    if (search) {
      search.addEventListener("input", function () { STATE.brand = search.value; renderCatalog(); });
    }
    renderCatalog();
  }

  /* ---------- Comparison table + chart ---------- */
  function initCompare(data) {
    var cmp = data.comparison;
    var table = document.getElementById("compare-table");
    if (table) {
      var head = "<thead><tr><th>Capacity</th><th>Walt Solar Energies</th><th>" + cmp.competitor + "</th><th>You Save</th></tr></thead>";
      var body = "<tbody>" + cmp.rows.map(function (r) {
        return "<tr>" +
          '<td class="c-cap">' + r.capacity + "</td>" +
          '<td class="c-walt">' + fmtINR(r.walt) + "</td>" +
          '<td class="c-tata">' + fmtINR(r.tata) + "</td>" +
          '<td class="c-save">' + fmtINR(r.save) + "</td>" +
          "</tr>";
      }).join("") + "</tbody>";
      table.innerHTML = head + body;
    }

    var chart = document.getElementById("compare-chart");
    if (chart) {
      var max = Math.max.apply(null, cmp.rows.map(function (r) { return r.tata; }));
      var html = "";
      cmp.rows.forEach(function (r) {
        html += '<div class="bar-group">' +
          '<div class="bar-cap">' + r.capacity + "</div>" +
          '<div class="bar bar-walt" data-w="' + Math.round((r.walt / max) * 100) + '">Walt ' + fmtINR(r.walt) + "</div>" +
          '<div class="bar bar-tata" data-w="' + Math.round((r.tata / max) * 100) + '">TATA ' + fmtINR(r.tata) + "</div>" +
          "</div>";
      });
      html += '<div class="chart-legend"><span><i class="dot" style="background:#C8A24B"></i> Walt Solar Energies</span><span><i class="dot" style="background:rgba(14,14,14,.2)"></i> TATA</span></div>';
      chart.innerHTML = html;

      var animate = function () {
        Array.prototype.forEach.call(chart.querySelectorAll(".bar"), function (bar) {
          bar.style.width = bar.getAttribute("data-w") + "%";
        });
      };
      if (prefersReduced || !("IntersectionObserver" in window)) { animate(); }
      else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { animate(); io.disconnect(); } });
        }, { threshold: 0.3 });
        io.observe(chart);
      }
    }
  }

  /* ---------- Quote modal ---------- */
  var modalCtx = {};
  function openModal(ctx) {
    modalCtx = ctx || {};
    var modal = document.getElementById("quote-modal");
    var sub = document.getElementById("modal-sub");
    if (sub) {
      var parts = [];
      if (modalCtx.system) parts.push(modalCtx.system);
      if (modalCtx.capacity) parts.push(modalCtx.capacity);
      if (modalCtx.brand) parts.push(modalCtx.brand);
      sub.textContent = parts.length ? parts.join(" · ") : "Tell us your details and we'll send a tailored quote.";
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var first = document.getElementById("m-name");
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal() {
    var modal = document.getElementById("quote-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function quoteText(ctx, name, phone, city) {
    var lines = [
      "Hello Walt Solar Energies, I'd like a quote.",
      ctx.system ? "System: " + ctx.system : "",
      ctx.capacity ? "Capacity: " + ctx.capacity : "",
      ctx.brand ? "Preferred brand: " + ctx.brand : "",
      name ? "Name: " + name : "",
      phone ? "Phone: " + phone : "",
      city ? "City: " + city : ""
    ];
    return lines.filter(Boolean).join("\n");
  }

  function initModal() {
    var modal = document.getElementById("quote-modal");
    if (!modal) return;
    Array.prototype.forEach.call(modal.querySelectorAll("[data-modal-close]"), function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    var form = document.getElementById("modal-form");
    var wa = document.getElementById("m-wa");
    function vals() {
      return {
        name: (document.getElementById("m-name") || {}).value || "",
        phone: (document.getElementById("m-phone") || {}).value || "",
        city: (document.getElementById("m-city") || {}).value || ""
      };
    }
    if (wa) {
      wa.addEventListener("click", function () {
        var v = vals();
        wa.href = "https://wa.me/" + COMPANY.phoneIntl + "?text=" + encodeURIComponent(quoteText(modalCtx, v.name, v.phone, v.city));
      });
    }
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = vals();
        var subject = "Quote Request" + (modalCtx.system ? " , " + modalCtx.system : "");
        window.location.href = "mailto:" + COMPANY.email + "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(quoteText(modalCtx, v.name, v.phone, v.city));
      });
    }
  }

  /* ---------- Main contact form ---------- */
  function initContactForm() {
    var form = document.getElementById("quote-form");
    if (!form) return;
    var wa = document.getElementById("wa-submit");
    function ctxFromForm() {
      return {
        system: (document.getElementById("system") || {}).value || "",
        capacity: (document.getElementById("capacity") || {}).value || "",
        brand: ""
      };
    }
    function vals() {
      return {
        name: (document.getElementById("name") || {}).value || "",
        phone: (document.getElementById("phone") || {}).value || "",
        city: (document.getElementById("city") || {}).value || "",
        message: (document.getElementById("message") || {}).value || ""
      };
    }
    function waLink() {
      var v = vals();
      var text = quoteText(ctxFromForm(), v.name, v.phone, v.city) + (v.message ? "\nMessage: " + v.message : "");
      return "https://wa.me/" + COMPANY.phoneIntl + "?text=" + encodeURIComponent(text);
    }
    if (wa) {
      form.addEventListener("input", function () { wa.href = waLink(); });
      wa.addEventListener("click", function () { wa.href = waLink(); });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = vals();
      var subject = "Solar Quote Request , " + (v.name || "Website");
      var body = quoteText(ctxFromForm(), v.name, v.phone, v.city) + (v.message ? "\nMessage: " + v.message : "");
      window.location.href = "mailto:" + COMPANY.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Section quote buttons ---------- */
  function initSectionQuoteButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-quote-system]"), function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal({ system: btn.getAttribute("data-quote-system"), capacity: "", brand: "" });
      });
    });
  }

  /* ---------- Load data ---------- */
  function loadPricing() {
    return fetch("data/pricing.json", { cache: "no-store" })
      .then(function (res) { if (!res.ok) throw new Error("bad response"); return res.json(); })
      .catch(function () { return FALLBACK_PRICING; });
  }

  ready(function () {
    initNavbar();
    initReveal();
    initCounters();
    initShowcase();
    initFloatingVideoPop();
    initModal();
    initContactForm();
    initSectionQuoteButtons();

    loadPricing().then(function (data) {
      initCatalog(data);
      initCompare(data);
      refreshIcons();
    });

    refreshIcons();
  });
})();
