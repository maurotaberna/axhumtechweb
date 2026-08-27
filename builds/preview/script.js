/* Axhum Tech — interacciones del sitio.
   Todo es progresivo: sin JS la pagina sigue siendo legible y navegable. */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Ano en curso
     --------------------------------------------------------------- */
  var yearSlots = document.querySelectorAll("[data-year]");
  if (yearSlots.length) {
    var year = String(new Date().getFullYear());
    yearSlots.forEach(function (slot) {
      slot.textContent = year;
    });
  }

  /* ---------------------------------------------------------------
     Aparicion por scroll
     --------------------------------------------------------------- */
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px" }
    );

    revealItems.forEach(function (item, index) {
      item.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 80 + "ms");
      revealObserver.observe(item);
    });
  }

  /* ---------------------------------------------------------------
     Navegacion de escritorio con paneles
     --------------------------------------------------------------- */
  var navTriggers = document.querySelectorAll("[data-nav-trigger]");

  function closeAllPanels(except) {
    navTriggers.forEach(function (trigger) {
      if (trigger === except) return;
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.classList.remove("is-open");
    });
  }

  navTriggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;

    var parent = trigger.closest("li");
    var hoverTimer;

    function open() {
      closeAllPanels(trigger);
      trigger.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
    }

    function close() {
      trigger.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
    }

    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      if (trigger.getAttribute("aria-expanded") === "true") close();
      else open();
    });

    if (parent && window.matchMedia("(hover: hover)").matches) {
      parent.addEventListener("mouseenter", function () {
        window.clearTimeout(hoverTimer);
        open();
      });
      parent.addEventListener("mouseleave", function () {
        hoverTimer = window.setTimeout(close, 160);
      });
    }

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
        trigger.focus();
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-nav-trigger]") && !event.target.closest(".nav-panel")) {
      closeAllPanels();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAllPanels();
  });

  /* ---------------------------------------------------------------
     Menu movil
     --------------------------------------------------------------- */
  var menuBtn = document.querySelector(".menu-btn");
  var drawer = document.getElementById("mobile-drawer");

  if (menuBtn && drawer) {
    var setDrawer = function (open) {
      menuBtn.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    menuBtn.addEventListener("click", function () {
      setDrawer(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawer(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawer(false);
        menuBtn.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && drawer.classList.contains("is-open")) setDrawer(false);
    });

    drawer.querySelectorAll(".drawer-title").forEach(function (title) {
      var sub = document.getElementById(title.getAttribute("aria-controls"));
      if (!sub) return;
      title.addEventListener("click", function () {
        var open = title.getAttribute("aria-expanded") !== "true";
        title.setAttribute("aria-expanded", String(open));
        sub.classList.toggle("is-open", open);
      });
    });
  }

  /* ---------------------------------------------------------------
     Brillo que sigue al cursor en las tarjetas
     --------------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var box = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((event.clientX - box.left) / box.width) * 100 + "%");
        card.style.setProperty("--my", ((event.clientY - box.top) / box.height) * 100 + "%");
      });
    });
  }

  /* ---------------------------------------------------------------
     Progreso de lectura, cabecera fija y CTA movil
     --------------------------------------------------------------- */
  var progress = document.querySelector(".progress-bar");
  var header = document.querySelector(".site-header");
  var dock = document.querySelector(".dock");
  var heroPanel = document.querySelector("[data-float]");
  var lastY = window.scrollY;
  var ticking = false;

  function onFrame() {
    var y = window.scrollY;
    var range = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.transform = "scaleX(" + (range > 0 ? Math.min(y / range, 1) : 0) + ")";
    }

    if (header) {
      header.classList.toggle("is-stuck", y > 12);
    }

    if (dock) {
      dock.classList.toggle("is-visible", y > 420);
    }

    if (heroPanel && !reduceMotion && y < window.innerHeight * 1.4) {
      heroPanel.style.transform = "translate3d(0," + (y * -0.045).toFixed(2) + "px,0)";
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onFrame);
    },
    { passive: true }
  );

  onFrame();

  /* ---------------------------------------------------------------
     Formulario de contacto -> WhatsApp o correo
     Sin backend: arma el mensaje y lo entrega por el canal que eligio
     la persona. Los radios son reales, asi que la eleccion se ve
     aunque el JS no llegue a correr.
     --------------------------------------------------------------- */
  var contactForm = document.querySelector("[data-wa-form]");

  if (contactForm) {
    var phone = contactForm.getAttribute("data-wa-phone") || "543865267037";
    var mail = contactForm.getAttribute("data-wa-mail") || "hola@axhumtech.com";
    var status = contactForm.querySelector("[data-wa-status]");
    var label = contactForm.querySelector("[data-wa-label]");
    var hint = contactForm.querySelector("[data-wa-hint]");

    var canalElegido = function () {
      var marcado = contactForm.querySelector('input[name="canal"]:checked');
      return marcado ? marcado.value : "whatsapp";
    };

    var textos = {
      whatsapp: {
        boton: "Enviar por WhatsApp",
        nota:
          "Al enviar se abre WhatsApp con el mensaje ya escrito: revisás y tocás enviar. No guardamos tus datos en ningún servidor.",
        ok: "Listo. Se abrió WhatsApp con tu mensaje preparado; solo falta enviarlo.",
        bloqueado: "Tu navegador bloqueó la ventana. Escribinos directamente al +54 3865 267037.",
      },
      correo: {
        boton: "Enviar por correo",
        nota:
          "Al enviar se abre tu programa de correo con el mensaje ya escrito a " +
          mail +
          ": revisás y tocás enviar. No guardamos tus datos en ningún servidor.",
        ok: "Listo. Se abrió tu correo con el mensaje preparado; solo falta enviarlo.",
        bloqueado: "No pudimos abrir tu correo. Escribinos directamente a " + mail + ".",
      },
    };

    var refrescarTextos = function () {
      var t = textos[canalElegido()] || textos.whatsapp;
      if (label) label.textContent = t.boton;
      if (hint) hint.textContent = t.nota;
      if (status) status.hidden = true;
    };

    contactForm.querySelectorAll('input[name="canal"]').forEach(function (radio) {
      radio.addEventListener("change", refrescarTextos);
    });

    refrescarTextos();

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(contactForm);
      var get = function (key) {
        return String(data.get(key) || "").trim();
      };

      var interes = get("interes") || "-";

      var lines = [
        "Hola Axhum Tech, quiero conversar un proyecto.",
        "",
        "Nombre: " + (get("nombre") || "-"),
        "Negocio: " + (get("negocio") || "-"),
        "Necesito: " + interes,
      ];

      var detalle = get("detalle");
      if (detalle) {
        lines.push("", "Detalle:", detalle);
      }

      var contacto = get("contacto");
      if (contacto) {
        lines.push("", "Me pueden responder a: " + contacto);
      }

      var cuerpo = lines.join("\n");
      var canal = canalElegido();
      var t = textos[canal] || textos.whatsapp;
      var url;
      var opened;

      if (canal === "correo") {
        var asunto = interes === "-" ? "Consulta desde axhumtech.com" : "Consulta: " + interes;
        url =
          "mailto:" +
          mail +
          "?subject=" +
          encodeURIComponent(asunto) +
          "&body=" +
          encodeURIComponent(cuerpo);
        window.location.href = url;
        opened = true;
      } else {
        url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(cuerpo);
        opened = window.open(url, "_blank", "noopener");
        if (!opened) window.location.href = url;
      }

      if (status) {
        status.hidden = false;
        status.textContent = opened ? t.ok : t.bloqueado;
      }
    });
  }

  /* ---------------------------------------------------------------
     Diagramas interactivos
     Cada caja del dibujo enciende su explicacion y el camino que la
     conecta. Funciona con mouse, con el dedo y con el teclado.
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-diagram]").forEach(function (diagrama) {
    var nodos = diagrama.querySelectorAll("[data-node]");
    var lineas = diagrama.querySelectorAll("[data-edge]");
    var notas = diagrama.querySelectorAll("[data-note]");
    if (!nodos.length || !notas.length) return;

    var hoverReal = window.matchMedia("(hover: hover)").matches;

    function activar(clave) {
      nodos.forEach(function (nodo) {
        nodo.classList.toggle("is-active", nodo.getAttribute("data-node") === clave);
        nodo.setAttribute("aria-pressed", String(nodo.getAttribute("data-node") === clave));
      });

      lineas.forEach(function (linea) {
        var toca = linea.getAttribute("data-edge").split(" ").indexOf(clave) !== -1;
        linea.classList.toggle("is-lit", toca);
      });

      notas.forEach(function (nota) {
        nota.classList.toggle("is-active", nota.getAttribute("data-note") === clave);
      });
    }

    nodos.forEach(function (nodo) {
      var clave = nodo.getAttribute("data-node");

      nodo.addEventListener("click", function () {
        activar(clave);
      });

      nodo.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        event.preventDefault();
        activar(clave);
      });

      nodo.addEventListener("focus", function () {
        activar(clave);
      });

      if (hoverReal) {
        nodo.addEventListener("mouseenter", function () {
          activar(clave);
        });
      }
    });

    // Arranca con la primera caja explicada, para que el panel nunca este vacio.
    activar(nodos[0].getAttribute("data-node"));
  });
})();
