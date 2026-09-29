import { initLoginView } from "./views/loginView.js";
import { initDashboardView } from "./views/dashboardView.js";
import { initSolicitudesView } from "./views/solicitudesView.js";
import { initMatriculasView } from "./views/matriculasView.js";
import { initBuscarSolicitudesView } from "./views/buscarSolicitudesView.js";
import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  if (document.getElementById("login-form")) {
    initLoginView();
  } else if (document.getElementById("dashboard-home")) {
    console.log("dashboard");
    initDashboardView();
  } else if (document.getElementById("requests-page")) {
    console.log("solicitudes");
    initSolicitudesView();
  } else if (document.getElementById("search-requests-page")) {
    initBuscarSolicitudesView();
  } else if (document.getElementById("enrollment-page")) {
    initMatriculasView();
  }
});