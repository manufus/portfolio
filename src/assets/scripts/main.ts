import AOS from "aos";

declare global {
  interface Window {
    stickyHeaderFuncionality: () => void;
    evaluateHeaderPosition: () => void;
    applyMenuItemClasses: () => void;
    openMobileMenu: () => void;
    closeMobileMenu: () => void;
  }
}

const stickyClasses: string[] = [];
const unstickyClasses: string[] = [];
const stickyClassesContainer: string[] = [
  "shadow-floating",
  "rounded-card",
  "bg-surface-canvas/65",
  "border-border-subtle/65",
  "backdrop-blur-2xl",
  "backdrop-brightness-120",
];
const unstickyClassesContainer: string[] = [
  "shadow-none",
  "border-transparent",
  "rounded-none",
  "bg-transparent",
];

let headerElement: HTMLElement | null = null;

const stickyHeaderFuncionality = (): void => {
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

const evaluateHeaderPosition = (): void => {
  if (!headerElement?.firstElementChild) {
    return;
  }

  const headerContainer = headerElement.firstElementChild;

  if (window.scrollY > 48) {
    headerContainer.classList.add(...stickyClassesContainer);
    headerContainer.classList.remove(...unstickyClassesContainer);
    headerElement.classList.add(...stickyClasses);
    headerElement.classList.remove(...unstickyClasses);
  } else {
    headerContainer.classList.remove(...stickyClassesContainer);
    headerContainer.classList.add(...unstickyClassesContainer);
    headerElement.classList.add(...unstickyClasses);
    headerElement.classList.remove(...stickyClasses);
  }
};

const applyMenuItemClasses = (): void => {
  const menuItems = document.querySelectorAll<HTMLAnchorElement>("#menu a");
  if (!menuItems.length) {
    return;
  }

  for (const menuItem of menuItems) {
    if (menuItem.pathname === window.location.pathname) {
      menuItem.classList.add("text-content-primary");
    }
  }
};

const openMobileMenu = (): void => {
  const openMenuButton = document.getElementById("openMenu") as HTMLButtonElement | null;
  const closeMenuButton = document.getElementById("closeMenu") as HTMLButtonElement | null;
  const menu = document.getElementById("menu") as HTMLElement | null;
  const menuBackground = document.getElementById("mobileMenuBackground") as HTMLElement | null;

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

  window.setTimeout(() => {
    menuBackground.classList.remove("opacity-0");
  }, 1);
};

const closeMobileMenu = (): void => {
  const openMenuButton = document.getElementById("openMenu") as HTMLButtonElement | null;
  const closeMenuButton = document.getElementById("closeMenu") as HTMLButtonElement | null;
  const menu = document.getElementById("menu") as HTMLElement | null;
  const menuBackground = document.getElementById("mobileMenuBackground") as HTMLElement | null;

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

const mobileMenuFunctionality = (): void => {
  const openMenuButton = document.getElementById("openMenu") as HTMLButtonElement | null;
  const closeMenuButton = document.getElementById("closeMenu") as HTMLButtonElement | null;

  if (!openMenuButton || !closeMenuButton) {
    return;
  }

  openMenuButton.addEventListener("click", () => {
    openMobileMenu();
  });

  closeMenuButton.addEventListener("click", () => {
    closeMobileMenu();
  });
};

window.stickyHeaderFuncionality = stickyHeaderFuncionality;
window.evaluateHeaderPosition = evaluateHeaderPosition;
window.applyMenuItemClasses = applyMenuItemClasses;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;

document.addEventListener("DOMContentLoaded", () => {
  headerElement = document.getElementById("header") as HTMLElement | null;

  if (!headerElement?.firstElementChild) {
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
