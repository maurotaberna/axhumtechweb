(function () {
  'use strict';

  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  function track(eventName, detail) {
    window.dispatchEvent(new CustomEvent('axhum:track', {
      detail: Object.assign({ event: eventName, path: location.pathname }, detail || {}),
    }));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-track]');
    if (link) track(link.dataset.track, { product: link.dataset.trackProduct || undefined });
    var choice = event.target.closest('a[data-locale-choice]');
    if (choice) {
      try { localStorage.setItem('axhum-language', choice.dataset.localeChoice); } catch (_) { /* Optional preference. */ }
    }
  });

  var language = document.documentElement.lang.slice(0, 2);
  var messages = {
    es: { intro: 'Hola Axhum Tech, quiero hacer una consulta.', fields: ['Nombre', 'Negocio o rubro', 'Necesito', 'Detalle'], status: 'Se abrió WhatsApp con el mensaje preparado. Revisalo y tocá enviar.' },
    en: { intro: 'Hello Axhum Tech, I would like to discuss a project.', fields: ['Name', 'Business or industry', 'I need', 'Details'], status: 'WhatsApp opened with your draft message. Please review and send it.' },
    pt: { intro: 'Olá Axhum Tech, gostaria de conversar sobre um projeto.', fields: ['Nome', 'Empresa ou setor', 'Preciso de', 'Detalhes'], status: 'O WhatsApp abriu com a mensagem preparada. Revise e envie.' },
    fr: { intro: 'Bonjour Axhum Tech, je souhaite discuter d’un projet.', fields: ['Nom', 'Entreprise ou secteur', 'J’ai besoin de', 'Détails'], status: 'WhatsApp s’est ouvert avec votre message. Vérifiez-le puis envoyez-le.' },
    nl: { intro: 'Hallo Axhum Tech, ik wil graag een project bespreken.', fields: ['Naam', 'Bedrijf of branche', 'Ik zoek', 'Details'], status: 'WhatsApp is geopend met uw conceptbericht. Controleer het voordat u het verstuurt.' },
  };
  var messageCopy = messages[language] || messages.es;
  var hint = document.querySelector('[data-language-hint]');
  if (hint) {
    var saved;
    try { saved = localStorage.getItem('axhum-language'); } catch (_) { /* Ignore unavailable storage. */ }
    if (!saved) {
      var preferred = (navigator.languages || [navigator.language]).map(function (item) { return item.toLowerCase(); });
      var suggestion = preferred.find(function (item) { return /^(en|pt|fr|nl)(-|$)/.test(item); });
      function showSuggestion(code) {
        if (!['en', 'pt', 'fr', 'nl'].includes(code)) return;
        var label = { en: 'English', pt: 'Português', fr: 'Français', nl: 'Nederlands' }[code];
        var languageLink = document.querySelector('a[data-locale-choice="' + code + '"]');
        if (!languageLink) return;
        hint.innerHTML = '<span>¿Preferís ver este sitio en ' + label + '?</span> <a href="' + languageLink.getAttribute('href') + '" data-locale-choice="' + code + '">Cambiar idioma</a> <button type="button" aria-label="Cerrar sugerencia de idioma" data-hint-close>×</button>';
        hint.hidden = false;
        hint.querySelector('[data-hint-close]').addEventListener('click', function () { hint.hidden = true; });
      }
      if (suggestion) showSuggestion(suggestion.slice(0, 2));
      else if (location.protocol === 'https:') {
        fetch('/locale-hint').then(function (response) { return response.json(); })
          .then(function (data) { showSuggestion(data.language); })
          .catch(function () { /* The selector remains available. */ });
      }
    }
  }

  var form = document.querySelector('[data-brief-form]');
  if (!form) return;
  var status = form.querySelector('[data-form-status]');
  var params = new URLSearchParams(location.search);
  var interest = params.get('interes');
  if (['web', 'software', 'automatizacion', 'gestion', 'axenda', 'otro'].includes(interest)) form.elements.interes.value = interest;

  var started = false;
  form.addEventListener('input', function () {
    if (started) return;
    started = true;
    track('contact_form_started');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var selected = form.elements.interes.selectedOptions[0];
    var message = [
      messageCopy.intro,
      messageCopy.fields[0] + ': ' + data.get('nombre'),
      messageCopy.fields[1] + ': ' + data.get('negocio'),
      messageCopy.fields[2] + ': ' + (selected ? selected.textContent : data.get('interes')),
      messageCopy.fields[3] + ': ' + data.get('detalle'),
    ].join('\n');
    track('contact_form_prepared', { channel: 'whatsapp', interest: String(data.get('interes')) });
    var url = 'https://wa.me/543865267037?text=' + encodeURIComponent(message);
    var opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else location.href = url;
    if (status) {
      status.hidden = false;
      status.textContent = messageCopy.status;
    }
  });
})();
