const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentPage = document.body.dataset.page;
const mainVisualVideo = document.querySelector(".main-visual-video");
const usesMainVisualFallback =
  Boolean(mainVisualVideo) &&
  Boolean(window.CSS) &&
  CSS.supports("-webkit-touch-callout", "none") &&
  navigator.maxTouchPoints > 0;
let videoFallbackEventsAttached = false;

if (usesMainVisualFallback) {
  mainVisualVideo.pause();
  mainVisualVideo.remove();
}

function closeMenu() {
  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");

    navLinks.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);

  if (link.dataset.page === currentPage) {
    link.classList.add("active");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks && navLinks.classList.contains("is-open")) {
    closeMenu();
  }
});

function prepareMainVisualVideo() {
  if (!mainVisualVideo || usesMainVisualFallback) {
    return;
  }

  mainVisualVideo.muted = true;
  mainVisualVideo.defaultMuted = true;
  mainVisualVideo.playsInline = true;
  mainVisualVideo.autoplay = true;
  mainVisualVideo.loop = true;
  mainVisualVideo.controls = false;
  mainVisualVideo.setAttribute("muted", "");
  mainVisualVideo.setAttribute("autoplay", "");
  mainVisualVideo.setAttribute("playsinline", "");
  mainVisualVideo.setAttribute("webkit-playsinline", "");
  mainVisualVideo.removeAttribute("controls");
}

function addVideoFallbackEvents() {
  if (videoFallbackEventsAttached) {
    return;
  }

  videoFallbackEventsAttached = true;
  document.addEventListener("touchstart", playMainVisualVideo, { once: true });
  document.addEventListener("click", playMainVisualVideo, { once: true });
}

function playMainVisualVideo() {
  if (!mainVisualVideo || usesMainVisualFallback) {
    return;
  }

  prepareMainVisualVideo();

  const playPromise = mainVisualVideo.play();

  if (playPromise) {
    playPromise.catch(() => {
      addVideoFallbackEvents();
    });
  }
}

prepareMainVisualVideo();
playMainVisualVideo();

window.addEventListener("DOMContentLoaded", playMainVisualVideo);
window.addEventListener("load", playMainVisualVideo);
window.addEventListener("pageshow", playMainVisualVideo);

if (mainVisualVideo && !usesMainVisualFallback) {
  mainVisualVideo.addEventListener("loadedmetadata", playMainVisualVideo);
  mainVisualVideo.addEventListener("canplay", playMainVisualVideo);
  window.setTimeout(playMainVisualVideo, 300);
  window.setTimeout(playMainVisualVideo, 1000);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    playMainVisualVideo();
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

if ("IntersectionObserver" in window && sections.length > 1) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

        if (entry.isIntersecting && activeLink) {
          navItems.forEach((link) => link.classList.remove("active"));
          activeLink.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-45% 0px -50% 0px",
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "Thanks for your message. This demo form is ready to connect to a backend.";
    contactForm.reset();
  });
}
