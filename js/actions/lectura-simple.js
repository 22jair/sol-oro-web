/* Accion: lectura simple */
(function () {
  const SIMPLE_READING_STORAGE_KEY = "soldeoro_lectura_simple";

  function getSavedSimpleReading() {
    try {
      return localStorage.getItem(SIMPLE_READING_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  function saveSimpleReading(enabled) {
    try {
      localStorage.setItem(SIMPLE_READING_STORAGE_KEY, String(enabled));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  function applySimpleReading(enabled) {
    document.body.classList.toggle("lectura-simple", enabled);
  }

  function toggleLecturaSimple() {
    const nextEnabled = !document.body.classList.contains("lectura-simple");
    applySimpleReading(nextEnabled);
    saveSimpleReading(nextEnabled);
  }

  window.toggleLecturaSimple = toggleLecturaSimple;

  document.addEventListener("DOMContentLoaded", function () {
    applySimpleReading(getSavedSimpleReading());
  });
})();
