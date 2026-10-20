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
    if (document.querySelector('.analytics-consent')) return;
    var locale = document.documentElement.lang.slice(0, 2);
    var copy = {
      es: ['Cookies de medición', 'Usamos Google Analytics para entender qué páginas y acciones resultan útiles. No enviamos datos escritos en el formulario.', 'Aceptar y continuar', 'Rechazar'],
      en: ['Analytics cookies', 'We use Google Analytics to understand which pages and actions are useful. We do not send information entered in the contact form.', 'Accept and continue', 'Reject'],
      pt: ['Cookies de análise', 'Usamos o Google Analytics para entender quais páginas e ações são úteis. Não enviamos os dados preenchidos no formulário.', 'Aceitar e continuar', 'Recusar'],
      fr: ['Cookies de mesure', 'Nous utilisons Google Analytics pour comprendre quelles pages et actions sont utiles. Nous ne transmettons pas les données saisies dans le formulaire.', 'Accepter et continuer', 'Refuser'],
    }[locale] || ['Analytics cookies', 'We use analytics to understand site usage.', 'Accept', 'Reject'];
    var box = document.createElement("aside");
    box.className = "analytics-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-labelledby", "analytics-consent-title");
    box.innerHTML = '<div><strong id="analytics-consent-title">' + copy[0] + '</strong><p>' + copy[1] + '</p></div><div class="analytics-consent__actions"><button type="button" class="btn analytics-consent__accept" data-analytics-accept>' + copy[2] + '</button><button type="button" class="analytics-consent__reject" data-analytics-reject>' + copy[3] + '</button></div>';
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

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-consent-open]')) renderConsent();
  });
})();
