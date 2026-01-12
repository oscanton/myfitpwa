// js/core/pwa.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .catch(err => console.error("SW register failed:", err));
  });
}