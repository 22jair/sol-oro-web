/* ==========================================
   SOL DE ORO - JavaScript principal
   Mockup de interfaz accesible
   ========================================== */

let simPlazo = 12;
let panelVisible = true;
let navMenuOpen = false;
const PANEL_STORAGE_KEY = "soldeoro_panel_visible";

function pageNavbar() {
  return document.querySelector(".navbar");
}

function pagePanel() {
  return document.querySelector("[id^='panel-ayuda-']");
}

function pageNavMenu() {
  return document.getElementById("main-nav");
}

function pageNavButton() {
  return document.getElementById("btn-menu");
}

function getSavedPanelVisibility() {
  try {
    const saved = localStorage.getItem(PANEL_STORAGE_KEY);
    if (saved === null) return null;
    return saved === "true";
  } catch {
    return null;
  }
}

function savePanelVisibility(visible) {
  try {
    localStorage.setItem(PANEL_STORAGE_KEY, String(visible));
  } catch {
    // Ignorar errores de almacenamiento (modo privado, etc.)
  }
}

function syncAccessibilityButton() {
  const panel = pagePanel();
  const button = document.getElementById("btn-accesibilidad");
  if (!panel || !button) return;

  const visible = panel.style.display !== "none";
  button.textContent = visible ? "Ocultar panel" : "Mostrar panel";
  button.setAttribute("aria-expanded", visible ? "true" : "false");
  button.setAttribute(
    "aria-label",
    visible ? "Ocultar panel de ayuda" : "Mostrar panel de ayuda",
  );
  panelVisible = visible;
}

function togglePanel() {
  const panel = pagePanel();
  if (!panel) return;
  const nextVisible = panel.style.display === "none";
  panel.style.display = nextVisible ? "" : "none";
  savePanelVisibility(nextVisible);
  syncAccessibilityButton();
}

function syncNavMenuButton() {
  const navbar = pageNavbar();
  const button = pageNavButton();
  const menu = pageNavMenu();
  if (!navbar || !button || !menu) return;

  const open = navbar.classList.contains("menu-open");
  navMenuOpen = open;
  button.textContent = open ? "Cerrar" : "Menú";
  button.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeNavMenu() {
  const navbar = pageNavbar();
  if (!navbar) return;
  navbar.classList.remove("menu-open");
  navMenuOpen = false;
  syncNavMenuButton();
}

function toggleNavMenu() {
  const navbar = pageNavbar();
  if (!navbar) return;
  navbar.classList.toggle("menu-open");
  syncNavMenuButton();
}

function seleccionarPlazo(meses) {
  simPlazo = meses;
  document.querySelectorAll(".sim-pill").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.dataset.meses, 10) === meses);
  });
  simReactivo();
}

function simReactivo() {
  const montoInput = document.getElementById("sim-monto");
  const monto = montoInput ? parseFloat(montoInput.value) : NaN;
  const tasaMensual = 0.015;

  const cuotaEl = document.getElementById("result-cuota");
  const montoEl = document.getElementById("result-monto-display");
  const plazoEl = document.getElementById("result-plazo-display");

  if (plazoEl) plazoEl.textContent = simPlazo + " meses";

  if (!monto || monto < 1) {
    if (cuotaEl) cuotaEl.textContent = "S/ —";
    if (montoEl) montoEl.textContent = "—";
    return;
  }

  const factor = Math.pow(1 + tasaMensual, simPlazo);
  const cuota = (monto * (tasaMensual * factor)) / (factor - 1);

  if (cuotaEl) cuotaEl.textContent = formatMoney(cuota);
  if (montoEl) montoEl.textContent = formatMoney(monto);

  sessionStorage.setItem("sim_monto", formatMoney(monto));
  sessionStorage.setItem("sim_cuota", formatMoney(cuota));
  sessionStorage.setItem("sim_plazo", simPlazo);
}

function formatMoney(amount) {
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
  return "S/ " + formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function solicitudInit() {
  const monto = sessionStorage.getItem("sim_monto");
  const cuota = sessionStorage.getItem("sim_cuota");
  const plazo = sessionStorage.getItem("sim_plazo");

  const montoEl = document.getElementById("res-monto");
  const cuotaEl = document.getElementById("res-cuota");
  const plazoEl = document.getElementById("res-plazo");

  if (montoEl) montoEl.textContent = monto || "S/ —";
  if (cuotaEl) cuotaEl.textContent = cuota || "S/ —";
  if (plazoEl) plazoEl.textContent = plazo ? plazo + " meses" : "—";
}

document.addEventListener("DOMContentLoaded", function () {
  syncNavMenuButton();

  const panel = pagePanel();
  const savedVisible = getSavedPanelVisibility();

  if (panel) {
    if (savedVisible !== null) {
      panel.style.display = savedVisible ? "" : "none";
      panelVisible = savedVisible;
    } else {
      panel.style.display = "none";
      panelVisible = false;
      savePanelVisibility(false);
    }
  }

  solicitudInit();
  syncAccessibilityButton();

  document.querySelectorAll(".nav-links .nav-link").forEach(function (link) {
    link.addEventListener("click", closeNavMenu);
  });
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 640) {
    closeNavMenu();
  }
});
