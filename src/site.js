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
  });

  var form = document.querySelector('[data-brief-form]');
  if (!form) return;
  var status = form.querySelector('[data-form-status]');
  var params = new URLSearchParams(location.search);
  var interest = params.get('interes');
  var options = { web: 'Una página web', software: 'Software a medida', automatizacion: 'Una automatización' };
  if (options[interest]) form.elements.interes.value = options[interest];

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
    var message = [
      'Hola Axhum Tech, quiero hacer una consulta.',
      'Nombre: ' + data.get('nombre'),
      'Negocio o rubro: ' + data.get('negocio'),
      'Necesito: ' + data.get('interes'),
      'Detalle: ' + data.get('detalle'),
    ].join('\n');
    track('contact_form_prepared', { channel: 'whatsapp', interest: String(data.get('interes')) });
    var url = 'https://wa.me/543865267037?text=' + encodeURIComponent(message);
    var opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else location.href = url;
    if (status) {
      status.hidden = false;
      status.textContent = 'Se abrió WhatsApp con el mensaje preparado. Revisalo y tocá enviar.';
    }
  });
})();
