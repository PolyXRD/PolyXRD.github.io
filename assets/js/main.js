// PolyXRD site — theme toggle, i18n, scroll reveal, footer year
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- theme ---------- */
  var saved = null;
  try { saved = localStorage.getItem("px-theme"); } catch (e) {}
  if (!saved) {
    saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.setAttribute("data-theme", saved);

  var btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("px-theme", next); } catch (e) {}
    });
  }

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) { lang = window.DEFAULT_LANG || "en"; dict = window.I18N[lang]; }
    if (!dict) { return; }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, k)) { el.textContent = dict[k]; }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-html");
      if (Object.prototype.hasOwnProperty.call(dict, k)) { el.innerHTML = dict[k]; }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr"); // format: "attr:key"
      var idx = spec.indexOf(":");
      if (idx < 0) { return; }
      var attr = spec.slice(0, idx);
      var k = spec.slice(idx + 1);
      if (Object.prototype.hasOwnProperty.call(dict, k)) { el.setAttribute(attr, dict[k]); }
    });

    root.lang = lang;
    root.dir = (window.RTL_LANGS && window.RTL_LANGS[lang]) ? "rtl" : "ltr";

    var sel = document.getElementById("langSelect");
    if (sel) { sel.value = lang; }

    try { localStorage.setItem("px-lang", lang); } catch (e) {}
  }

  var sel = document.getElementById("langSelect");
  if (sel) {
    sel.addEventListener("change", function () { applyLang(sel.value); });
  }

  var savedLang = null;
  try { savedLang = localStorage.getItem("px-lang"); } catch (e) {}
  applyLang(savedLang || (window.DEFAULT_LANG || "en"));

  /* ---------- scroll reveal ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) { y.textContent = new Date().getFullYear(); }
})();
