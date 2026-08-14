document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxItem = document.querySelector("[data-parallax]");
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const mainNavigation = document.querySelector(".main-nav");
const signalField = document.querySelector("[data-signal-field]");

if (menuToggle && siteHeader && mainNavigation) {
  const closeMenu = () => {
    siteHeader.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const willOpen = !siteHeader.classList.contains("menu-open");
    siteHeader.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  mainNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) closeMenu();
  });
}

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    revealObserver.observe(item);
  });
}

if (signalField && !reduceMotion) {
  signalField.addEventListener("pointermove", (event) => {
    const bounds = signalField.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 16;
    signalField.style.setProperty("--signal-x", `${offsetX.toFixed(1)}px`);
    signalField.style.setProperty("--signal-y", `${offsetY.toFixed(1)}px`);
  });

  signalField.addEventListener("pointerleave", () => {
    signalField.style.setProperty("--signal-x", "0px");
    signalField.style.setProperty("--signal-y", "0px");
  });
}

let framePending = false;

const updatePageMotion = () => {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = scrollRange > 0 ? scrollTop / scrollRange : 0;

  if (progress) {
    progress.style.transform = `scaleX(${scrollRatio})`;
  }

  if (parallaxItem && !reduceMotion && scrollTop < window.innerHeight * 1.3) {
    parallaxItem.style.setProperty("--parallax-y", `${scrollTop * 0.08}px`);
  }

  framePending = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updatePageMotion);
  },
  { passive: true }
);

updatePageMotion();
