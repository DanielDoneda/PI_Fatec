// =========================
// Toggle do Menu Lateral
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const toggleButton = document.getElementById("toggleMenu");
    const sidebar = document.getElementById("sidebar");

    if (toggleButton && sidebar) {
        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar-closed");
        });
    }

    console.log("app.js carregado e executando.");
});
