/* Runs before CSS so a saved theme is applied before the first paint. */
(function () {
  "use strict";
  var key = "axhum-theme";
  var root = document.documentElement;
  var labels = {
    es: ["Activar modo claro", "Activar modo oscuro"],
    en: ["Switch to light mode", "Switch to dark mode"],
    pt: ["Ativar modo claro", "Ativar modo escuro"],
    fr: ["Activer le mode clair", "Activer le mode sombre"],
    nl: ["Lichte modus inschakelen", "Donkere modus inschakelen"],
  };

  function apply(value) {
    var dark = value === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#101e2d" : "#ffffff");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.hidden = false;
      button.setAttribute("aria-pressed", String(dark));
      var label = (labels[(root.lang || 'es').slice(0, 2)] || labels.es)[dark ? 0 : 1];
      button.setAttribute("title", label);
      button.setAttribute("aria-label", label);
    });
  }

  var saved;
  try { saved = window.localStorage.getItem(key); } catch (_) { /* Storage can be disabled. */ }
  apply(saved);

  function bind() {
    apply(root.dataset.theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var next = root.dataset.theme === "dark" ? "light" : "dark";
        apply(next);
        try { window.localStorage.setItem(key, next); } catch (_) { /* The current page still switches. */ }
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
  else bind();

  window.addEventListener("storage", function (event) {
    if (event.key === key || event.key === null) {
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch (_) { return; }
      apply(event.newValue);
    }
  });
})();
