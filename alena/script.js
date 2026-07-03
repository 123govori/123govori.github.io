// ===== Smooth scroll (Lenis) =====
let lenis;
if (window.Lenis) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ===== Preloader =====
const preloader = document.getElementById("preloader");
const barFill = document.querySelector(".preloader__bar-fill");

let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    finishLoading();
  }
  barFill.style.width = progress + "%";
}, 120);

requestAnimationFrame(() => preloader.classList.add("is-ready"));

function finishLoading() {
  setTimeout(() => {
    preloader.classList.add("is-done");
    document.body.classList.add("is-loaded");
    setTimeout(() => preloader.remove(), 1200);
  }, 350);
}

window.addEventListener("load", () => {
  if (progress < 100) {
    progress = 100;
  }
});

// ===== Custom cursor =====
const cursor = document.getElementById("cursor");
let cx = 0, cy = 0, tx = 0, ty = 0;
window.addEventListener("mousemove", (e) => {
  tx = e.clientX;
  ty = e.clientY;
});
(function animateCursor() {
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("[data-hover]").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
});

// ===== Magnetic buttons =====
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "translate(0, 0)";
  });
});

// ===== Nav scroll state =====
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 40);
});

// ===== Mobile menu =====
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
  burger.classList.toggle("is-open");
  mobileMenu.classList.toggle("is-open");
});
mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    burger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(".reveal-up, .reveal-scale");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));
