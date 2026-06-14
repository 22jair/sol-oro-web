/* Accion: alto contraste */
(function () {
  const CONTRAST_STORAGE_KEY = "soldeoro_alto_contraste";

  function getSavedContrast() {
    try {
      return localStorage.getItem(CONTRAST_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  function saveContrast(enabled) {
    try {
      localStorage.setItem(CONTRAST_STORAGE_KEY, String(enabled));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  function applyContrast(enabled) {
    document.body.classList.toggle("alto-contraste", enabled);
  }

  function toggleAltoContraste() {
    const nextEnabled = !document.body.classList.contains("alto-contraste");
    applyContrast(nextEnabled);
    saveContrast(nextEnabled);
  }

  window.toggleAltoContraste = toggleAltoContraste;

  document.addEventListener("DOMContentLoaded", function () {
    applyContrast(getSavedContrast());
  });
})();
