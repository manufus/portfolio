// Add your javascript here
import AOS from "aos";

const stickyClasses = [];
const unstickyClasses = [];
const stickyClassesContainer = [
  "shadow-floating",
  "rounded-card",
  "bg-surface-canvas/65",
  "border-border-subtle/65",
  "backdrop-blur-2xl",
  "backdrop-brightness-120",
];
const unstickyClassesContainer = [
  "shadow-none",
  "border-transparent",
  "rounded-none",
  "bg-transparent",
];
let headerElement = null;

document.addEventListener("DOMContentLoaded", () => {
  headerElement = document.getElementById("header");

  if (!headerElement || !headerElement.firstElementChild) {
    return;
  }

  stickyHeaderFuncionality();
  applyMenuItemClasses();
  evaluateHeaderPosition();
  mobileMenuFunctionality();

  // Initialize AOS
  AOS.init({
    duration: 400,
    easing: "ease-out-cubic",
    once: true,
    offset: 20,
    delay: 0,
  });
});

window.stickyHeaderFuncionality = () => {
  let isTicking = false;
  window.addEventListener("scroll", () => {
    if (isTicking) return;
    isTicking = true;

    window.requestAnimationFrame(() => {
      evaluateHeaderPosition();
      isTicking = false;
    });
  });
};

window.evaluateHeaderPosition = () => {
  if (!headerElement || !headerElement.firstElementChild) {
    return;
  }

  if (window.scrollY > 48) {
    headerElement.firstElementChild.classList.add(...stickyClassesContainer);
    headerElement.firstElementChild.classList.remove(...unstickyClassesContainer);
    headerElement.classList.add(...stickyClasses);
    headerElement.classList.remove(...unstickyClasses);
  } else {
    headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
    headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
    headerElement.classList.add(...unstickyClasses);
    headerElement.classList.remove(...stickyClasses);
  }
};

window.applyMenuItemClasses = () => {
  const menuItems = document.querySelectorAll("#menu a");
  if (!menuItems.length) {
    return;
  }

  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].pathname === window.location.pathname) {
      menuItems[i].classList.add("text-content-primary");
    }
  }
};

function mobileMenuFunctionality() {
  const openMenuButton = document.getElementById("openMenu");
  const closeMenuButton = document.getElementById("closeMenu");

  if (!openMenuButton || !closeMenuButton) {
    return;
  }

  openMenuButton.addEventListener("click", () => {
    openMobileMenu();
  });

  closeMenuButton.addEventListener("click", () => {
    closeMobileMenu();
  });
}

window.openMobileMenu = () => {
  const openMenuButton = document.getElementById("openMenu");
  const closeMenuButton = document.getElementById("closeMenu");
  const menu = document.getElementById("menu");
  const menuBackground = document.getElementById("mobileMenuBackground");

  if (!openMenuButton || !closeMenuButton || !menu || !menuBackground) {
    return;
  }

  openMenuButton.classList.add("hidden");
  closeMenuButton.classList.remove("hidden");
  openMenuButton.setAttribute("aria-expanded", "true");
  closeMenuButton.setAttribute("aria-expanded", "true");
  menu.classList.remove("hidden");
  menuBackground.classList.add("opacity-0");
  menuBackground.classList.remove("hidden");

  setTimeout(() => {
    menuBackground.classList.remove("opacity-0");
  }, 1);
};

window.closeMobileMenu = () => {
  const openMenuButton = document.getElementById("openMenu");
  const closeMenuButton = document.getElementById("closeMenu");
  const menu = document.getElementById("menu");
  const menuBackground = document.getElementById("mobileMenuBackground");

  if (!openMenuButton || !closeMenuButton || !menu || !menuBackground) {
    return;
  }

  closeMenuButton.classList.add("hidden");
  openMenuButton.classList.remove("hidden");
  openMenuButton.setAttribute("aria-expanded", "false");
  closeMenuButton.setAttribute("aria-expanded", "false");
  menu.classList.add("hidden");
  menuBackground.classList.add("hidden");
};
