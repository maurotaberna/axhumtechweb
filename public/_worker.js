const CANONICAL_HOST = "axhumtech.com";
const MOVED_PAGES = {
  "/webs": "/servicios#webs",
  "/software-a-medida": "/servicios#software",
  "/posicionamiento": "/servicios#webs",
  "/gestion": "/productos#escritorio",
  "/comanda": "/productos#escritorio",
  "/service": "/productos#escritorio",
  "/distribuidora": "/productos#escritorio",
  "/arena": "/productos",
  "/faq": "/contacto",
  "/nosotros": "/#empresa",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname !== CANONICAL_HOST) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";

      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/locale-hint") {
      const country = request.cf?.country || "";
      const language = country === "NL" ? "nl"
        : country === "BR" || country === "PT" ? "pt"
        : ["FR", "BE", "CH", "LU"].includes(country) ? "fr"
        : ["US", "GB", "CA", "AU", "NZ", "IE"].includes(country) ? "en" : "es";
      return Response.json({ language }, { headers: { "Cache-Control": "private, no-store" } });
    }

    const oldPath = url.pathname.replace(/\.html$/, "").replace(/\/$/, "");
    if (MOVED_PAGES[oldPath]) {
      const destination = new URL(MOVED_PAGES[oldPath], url.origin);
      destination.search = url.search;
      return Response.redirect(destination.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
