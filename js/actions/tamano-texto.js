/* Accion: aumentar y disminuir texto */
(function () {
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 28;
  const FONT_STEP = 2;
  const DEFAULT_FONT_SIZE = 16;
  const FONT_STORAGE_KEY = "soldeoro_font_size";
  const TEXT_SELECTORS =
    "h1,h2,h3,h4,h5,h6,p,span,a,button,label,li,small,strong,input,textarea,select,td,th";
  let fontSize = DEFAULT_FONT_SIZE;

  function getSavedFontSize() {
    try {
      const saved = parseInt(localStorage.getItem(FONT_STORAGE_KEY) || "", 10);
      if (Number.isNaN(saved)) return DEFAULT_FONT_SIZE;
      return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, saved));
    } catch {
      return DEFAULT_FONT_SIZE;
    }
  }

  function applyFontSize() {
    const size = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, fontSize));
    fontSize = size;
    const scale = size / DEFAULT_FONT_SIZE;

    // Compatibilidad: algunos estilos usan --font-size y otros tamaño directo.
    document.documentElement.style.setProperty("--font-size", size + "px");
    document.documentElement.style.setProperty("--base-font-size", size + "px");
    document.documentElement.style.fontSize = size + "px";
    document.body.style.fontSize = size + "px";

    document.querySelectorAll(TEXT_SELECTORS).forEach(function (el) {
      const rawBase = el.getAttribute("data-sd-base-font");
      let base = rawBase ? parseFloat(rawBase) : NaN;

      if (Number.isNaN(base)) {
        base = parseFloat(window.getComputedStyle(el).fontSize);
        if (!Number.isNaN(base) && base > 0) {
          el.setAttribute("data-sd-base-font", String(base));
        }
      }

      if (!Number.isNaN(base) && base > 0) {
        el.style.fontSize = Math.round(base * scale * 100) / 100 + "px";
      }
    });

    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(size));
    } catch {
      // Ignorar errores de almacenamiento (modo privado, etc.)
    }
  }

  function changeFont(step) {
    fontSize += step * FONT_STEP;
    applyFontSize();
  }

  function aumentarTexto() {
    changeFont(1);
  }

  function disminuirTexto() {
    changeFont(-1);
  }

  window.aumentarTexto = aumentarTexto;
  window.disminuirTexto = disminuirTexto;

  document.addEventListener("DOMContentLoaded", function () {
    fontSize = getSavedFontSize();
    applyFontSize();
  });
})();
