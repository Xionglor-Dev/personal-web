const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentPage = document.body.dataset.page;

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
