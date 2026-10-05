import { AuthService } from "../auth.js";
import { SolicitudesService } from "../solicitudes.js";

export const initBuscarSolicitudesView = async () => {
  AuthService.checkAuthGuard(true);

  const requestList = document.getElementById("compatible-requests-list");
  const emptyState = document.getElementById("empty-search-requests-state");
  const countElement = document.getElementById("compatible-requests-count");
  const alertElement = document.getElementById("search-requests-alert");
  const logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", () => AuthService.logout());

  requestList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action='accept-request']");

    if (!button) return;

    button.disabled = true;
    button.textContent = "Procesando...";

    try {
      await SolicitudesService.aceptarMatchManual(button.dataset.requestId);
      showAlert("Match creado. Ya puedes revisarlo en el dashboard.", "success");
      await loadSolicitudes();
    } catch (error) {
      showAlert(error.message || "No se pudo aceptar la solicitud.", "danger");
      button.disabled = false;
      button.textContent = "Hacer match";
    }
  });

  function showAlert(message, type) {
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
  }

  function createRequestCard(solicitud) {
    const card = document.createElement("article");
    card.className = "card border-0 shadow-sm";

    card.innerHTML = `
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <h2 class="h5 mb-1" data-field="materia"></h2>
            <p class="small text-secondary mb-1" data-field="codigo"></p>
            <p class="mb-0" data-field="estudiante"></p>
          </div>
          <div class="text-md-end">
            <p class="small text-secondary mb-1">Intercambio solicitado</p>
            <p class="mb-0 fw-semibold" data-field="grupos"></p>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-primary"
                  type="button"
                  data-action="accept-request">
            Hacer match
          </button>
        </div>
      </div>
    `;

    card.querySelector('[data-field="materia"]').textContent =
      solicitud.nombreMateria ?? "Materia";
    card.querySelector('[data-field="codigo"]').textContent =
      `Código: ${solicitud.codigoMateria ?? "--"}`;
    card.querySelector('[data-field="estudiante"]').textContent =
      `Publicado por: ${solicitud.nombreEstudiante ?? "Estudiante"}`;
    card.querySelector('[data-field="grupos"]').textContent =
      `${solicitud.nombreGrupoActual ?? "--"} → ${solicitud.nombreGrupoDeseado ?? "--"}`;
    card.querySelector("button[data-action]").dataset.requestId = solicitud.id;

    return card;
  }

  async function loadSolicitudes() {
    requestList.innerHTML = "";
    emptyState.classList.add("d-none");

    try {
      const solicitudes = await SolicitudesService.getSolicitudesCompatibles();
      countElement.textContent = `${solicitudes.length} solicitudes compatibles`;

      if (solicitudes.length === 0) {
        emptyState.classList.remove("d-none");
        return;
      }

      solicitudes.forEach((solicitud) => {
        requestList.appendChild(createRequestCard(solicitud));
      });
    } catch (error) {
      countElement.textContent = "";
      showAlert(error.message || "No se pudieron cargar las solicitudes.", "danger");
    }
  }

  await loadSolicitudes();
};