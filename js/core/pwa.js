// js/core/pwa.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Desde index.html -> "sw.js"
    // Desde views/*.html -> "../sw.js"
    // new URL() lo resuelve correctamente.
    const swUrl = new URL("./sw.js", window.location.href).toString();

    navigator.serviceWorker.register(swUrl)
      .catch(err => console.error("SW register failed:", err));
  });
}
