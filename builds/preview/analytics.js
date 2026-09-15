/* GA4 stays inactive until a valid G- ID is configured. */
(function () {
  "use strict";
  var measurementId = "G-0QX9YV7TZ6";
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  var consentKey = "axhum-analytics-consent";
  var ready = false;
  function readConsent() { try { return localStorage.getItem(consentKey); } catch (_) { return null; } }
  function saveConsent(value) { try { localStorage.setItem(consentKey, value); } catch (_) { /* Applies to this page only. */ } }

  function loadGoogleTag() {
    if (ready) return;
    ready = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  window.addEventListener("axhum:track", function (event) {
    var detail = event.detail;
    if (!ready || !detail || typeof detail.event !== "string") return;
    var params = {};
    ["path", "product", "channel", "interest", "budgetBand"].forEach(function (key) {
      if (typeof detail[key] === "string" && detail[key]) params[key] = detail[key].slice(0, 100);
    });
    window.gtag("event", detail.event.replace(/[^a-z0-9_]/gi, "_").toLowerCase(), params);
  });

  function renderConsent() {
    var box = document.createElement("aside");
    box.className = "analytics-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-labelledby", "analytics-consent-title");
    box.innerHTML = '<div><strong id="analytics-consent-title">Cookies de medición</strong><p>Usamos Google Analytics para entender qué páginas y acciones resultan útiles. No enviamos datos escritos en el formulario.</p></div><div class="analytics-consent__actions"><button type="button" class="btn analytics-consent__accept" data-analytics-accept>Aceptar y continuar</button><button type="button" class="analytics-consent__reject" data-analytics-reject>Rechazar</button></div>';
    document.body.appendChild(box);
    box.querySelector("[data-analytics-reject]").addEventListener("click", function () { saveConsent("denied"); box.remove(); });
    box.querySelector("[data-analytics-accept]").addEventListener("click", function () { saveConsent("granted"); box.remove(); loadGoogleTag(); });
  }

  var consent = readConsent();
  if (consent === "granted") loadGoogleTag();
  else if (consent !== "denied") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderConsent, { once: true });
    else renderConsent();
  }
})();
