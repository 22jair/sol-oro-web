/* Accion: leer en voz alta */
(function () {
  function leerEnVozAlta() {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta la lectura en voz alta.");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const activePage = document.getElementsByClassName("page active")[0];
    const source = activePage || document.body;
    const text = source ? source.innerText.trim() : "";
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  window.leerEnVozAlta = leerEnVozAlta;

  window.addEventListener("beforeunload", function () {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  });
})();
