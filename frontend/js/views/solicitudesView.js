import { SolicitudesService } from "../solicitudes.js";
import { MatriculaService } from "../matricula.js";
import { MateriaService } from "../materias.js";
import { AuthService } from "../auth.js";
import { MatchService } from "../match.js";

export const initSolicitudesView = async () => {
  AuthService.checkAuthGuard(true);
  const requestList = document.getElementById("requests-list");
  const emptyState = document.getElementById("empty-requests-state");
  const requestCount = document.getElementById("requests-count");
  const requestStatusFilter = document.getElementById("request-status-filter");
  const emptyRequestsTitle = document.getElementById("empty-requests-title");
  const emptyRequestsDescription = document.getElementById("empty-requests-description");
  const messageElement = document.getElementById("request-form-alert");
  const selectMateria = document.getElementById("request-materia");
  const grupoActualElement = document.getElementById("request-current-group");
  const grupoDeseadoElement = document.getElementById("request-target-group");
  const codigoEstInput = document.getElementById("request-codigo");
  const formCreate = document.getElementById("new-request-form");
  const logoutButton = document.getElementById("logout-button");
  const studentNameElement = document.getElementById("navbar-user-name");
  const editRequestModalBody = document.getElementById("editRequestModalBody");
  const editRequestActions = document.getElementById("editRequestActions");
  const editRequestModal = document.getElementById("editRequestModal");
  const alertMessageUpdate = document.getElementById("alert-message-update");
  
  const me = await AuthService.me();
  studentNameElement.textContent = `${me.nombre} ${me.apellido}`;
  requestList.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("button[data-action]");

    if (!actionButton || !requestList.contains(actionButton)) {
      return;
    }

    const action = actionButton.dataset.action;
    const requestId = actionButton.dataset.requestId;
    const matchId = actionButton.dataset.matchId;

    if (action === "confirm-request") {
      console.log("Confirmando match con ID:", matchId);
      try {
        const data = await MatchService.confirmMatch(matchId);
        console.log("Match confirmado:", data);
        alert(`Haz confirmado el match exitosamente. Debes esperar a que el otro estudiante confirme 🧐`)
      } catch (error) {
        console.error("Error confirming match:", error);
        messageElement.textContent =
          error.message ||
          "Error al confirmar el match. Por favor, inténtalo de nuevo.";
        messageElement.className = "alert alert-danger";
      }
    } else if (action === "cancel-match") {
      try {
        if (!window.confirm("¿Cancelar este match? Las dos solicitudes quedarán canceladas.")) return;
        await MatchService.cancelMatch(matchId);
        window.location.reload();
      } catch (error) {
        console.error("Error cancelling match:", error);
        messageElement.textContent = error.message || "Error al cancelar el match.";
        messageElement.className = "alert alert-danger";
      }
    } else if (action === "delete-request") {
      try {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas cancelar esta solicitud?, se eliminara definitivamente ‼");
        if (confirmDelete) {
          await SolicitudesService.deleteSolicitud(requestId);
        }
        else {
          return;
        }
        window.location.reload();
      } catch (error) {
        console.error("Error deleting request:", error);
        messageElement.textContent =
          error.message ||
          "Error al eliminar la solicitud. Por favor, inténtalo de nuevo.";
        messageElement.className = "alert alert-danger";
        setTimeout(() => {
          messageElement.textContent = "";
          messageElement.className = "";
        }, 3500);
      }
    }

  })

  logoutButton.addEventListener("click", async () => {
    try {
      await AuthService.logout();
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  });

  let userData = null;

  try {
    userData = await AuthService.me();
    console.log("User data fetched successfully:", userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    messageElement.textContent =
      "Error al obtener los datos del usuario. Por favor, inténtalo de nuevo.";
    messageElement.className = "alert alert-danger";
  }

  formCreate.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (codigoEstInput.value !== userData.codigo) {
      messageElement.textContent =
        "El código ingresado no coincide con tu código de estudiante.";
      messageElement.className = "alert alert-danger";
      setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "";
      }, 3500);
      return;
    }

    const grupoActualId = document.getElementById("grupoActualId").value;

    const grupoDeseadoId = grupoDeseadoElement.value;

    console.log("Código:", codigoEstInput.value);
    console.log("Materia:", selectMateria.value);
    console.log("Grupo actual:", grupoActualId);
    console.log("Grupo deseado:", grupoDeseadoId);

    const solicitudData = {
      codigo: codigoEstInput.value,
      grupoActualId: parseInt(grupoActualId),
      grupoNuevoId: parseInt(grupoDeseadoId),
      materiaId: parseInt(selectMateria.value),
    };

    try {
      const responseSolicitud =
        await SolicitudesService.createSolicitud(solicitudData);
      console.log("Solicitud creada:", responseSolicitud);
      codigoEstInput.value = "";
      selectMateria.value = "";
      grupoActualElement.innerHTML = "";
      grupoDeseadoElement.innerHTML = "";
      if (responseSolicitud.estado === "MATCHED") {
        alert(
          `¡Felicidades! Se ha encontrado un match para tu solicitud. ID de la solicitud: ${responseSolicitud.id}. Por favor, confirma el match en la sección de solicitudes.`,
        );
      }
      messageElement.textContent = `Solicitud creada exitosamente con ID: ${responseSolicitud.id}, estado: ${responseSolicitud.estado}, materia: ${responseSolicitud.nombreMateria}, grupo actual: ${responseSolicitud.nombreGrupoActual}, grupo deseado: ${responseSolicitud.nombreGrupoDeseado}`;
      messageElement.className = "alert alert-success";
      setTimeout(() => {
        messageElement.textContent = "";
        window.location.reload();
      }, 3500);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      messageElement.textContent =
        error.message ||
        "Error al crear la solicitud. Por favor, inténtalo de nuevo.";
      messageElement.className = "alert alert-danger";
      setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "";
      }, 3500);
    }
  });
  //   let grupoActual = undefined;
  try {
    const solicitudes = await SolicitudesService.getStudentSolicitudes();
    const solicitudesOrdered = solicitudes.sort((a, b) => {
      return Date.parse(b.fechaSolicitud) - Date.parse(a.fechaSolicitud);
    });
    const matriculasStudent = await MatriculaService.getMatricula();
    requestCount.textContent = `${solicitudes.length} Solicitudes Encontradas`;
    if (solicitudes.length === 0) {
      requestList.innerHTML = "";
      emptyState.classList.remove("d-none");
    } else {
      emptyState.classList.add("d-none");
      requestList.innerHTML = "";
      const cards = await Promise.all(
        solicitudesOrdered.map((solicitud) => createRequestCard(solicitud, editRequestModalBody, editRequestActions)),
      );
      cards.forEach((card) => requestList.appendChild(card));
      const applyRequestFilter = () => {
        const selectedStatus = requestStatusFilter?.value || "ALL";
        let visibleCount = 0;
        requestList.querySelectorAll("article[data-request-status]").forEach((card) => {
          const visible = selectedStatus === "ALL" || card.dataset.requestStatus === selectedStatus;
          card.classList.toggle("d-none", !visible);
          if (visible) visibleCount++;
        });
        requestCount.textContent = `${visibleCount} Solicitudes Encontradas`;
        emptyState.classList.toggle("d-none", visibleCount > 0);
        if (visibleCount === 0 && solicitudes.length > 0) {
          emptyRequestsTitle.textContent = "No hay solicitudes de este tipo";
          emptyRequestsDescription.textContent = "Prueba con otro tipo de solicitud en el filtro.";
        } else {
          emptyRequestsTitle.textContent = "Aún no tienes solicitudes";
          emptyRequestsDescription.textContent = "Crea una solicitud para comenzar a buscar un intercambio.";
        }
      };
      requestStatusFilter?.addEventListener("change", applyRequestFilter);
      applyRequestFilter();
    }

    const materiasSolicitudesActivas = solicitudes
      .filter((solicitud) =>
        ["PROPUESTA", "MATCHED"].includes(solicitud.estado),
      )
      .map((solicitud) => String(solicitud.materiaCodigo));
    console.log("Solicitudes del estudiante:", solicitudes);
    console.log("Matriculas del estudiante:", matriculasStudent);

    const matriculasStudentFiltered = matriculasStudent.filter(
      (m) => !materiasSolicitudesActivas.includes(String(m.materiaCodigo)),
    );

    selectMateria.innerHTML = `
        <option value="" selected disabled>Selecciona una materia</option>
        ${matriculasStudentFiltered.map((m) => `<option value="${m.materiaId}">${m.materiaCodigo}:${m.materiaNombre}</option>`).join("")}
    `;

    selectMateria.addEventListener("change", async (event) => {
      const materiaId = event.target.value;
      console.log("Materia seleccionada:", materiaId);
      console.log("Matriculas del estudiante:", matriculasStudent);

      const matriculaFind = matriculasStudent.find(
        (materia) => String(materia.materiaId) === String(materiaId),
      );
      if (matriculaFind) {
        console.log("Matricula encontrada:", matriculaFind);
        // grupoActual = matriculaFind.grupoNombre;
        grupoActualElement.innerHTML = `<input readonly class="form-control" id="grupoActual" type="text" value="${matriculaFind.grupoNombre}" />
            <input type="hidden" id="grupoActualId" type="text" value="${matriculaFind.grupoId}" />`;
        const horariosDisponibles = await MateriaService.getMateriaHorarios(
          matriculaFind.materiaCodigo,
        );
        const horariosDisponiblesFiltered = horariosDisponibles.filter(
          (h) => h.idGrupo !== matriculaFind.grupoId,
        );
        grupoDeseadoElement.innerHTML = `
                <option value="" selected disabled>Selecciona un grupo</option>
                ${horariosDisponiblesFiltered.map((h) => `<option value="${h.idGrupo}">${h.grupo} - dia: ${h.dia} - hora: ${h.horaInicio} - hora fin: ${h.horaFin} - profesor: ${h.profesor}</option>`).join("")}`;
      } else {
        grupoActualElement.innerHTML = `<input readonly class="form-control" type="text" value="No se encontró el grupo actual" />`;
      }
    });

    editRequestModal.addEventListener("click", async (event) => {
      const saveChangesButton = event.target.closest("button[data-action='save-changes']");
      
      if (!saveChangesButton) {
        return;
      }
      const requestId = saveChangesButton.dataset.requestId;
      const editRequestSelect = editRequestModal.querySelector(
        "#edit-request-target-group",
      );
      const targetGroupId = editRequestSelect?.value;

      if (!targetGroupId) {
        alert("Selecciona un grupo deseado.");
        return;
      }

      try {
        const result = await SolicitudesService.updateSolicitud(
          parseInt(requestId),
          parseInt(targetGroupId),
        );
        alertMessageUpdate.classList.remove("d-none");
        alertMessageUpdate.textContent = `Solicitud actualizada exitosamente. ID de la solicitud: ${result.id}. Nuevo grupo deseado: ${result.nombreGrupoDeseado}`;
        alertMessageUpdate.className = "alert alert-success";
      } catch (error) {
        alertMessageUpdate.textContent =
          error.message ||
          "Error al actualizar la solicitud. Por favor, inténtalo de nuevo.";
        alertMessageUpdate.className = "alert alert-danger";
      }
      finally {
        setTimeout(() => {
          alertMessageUpdate.textContent = "";
          alertMessageUpdate.classList.add("d-none");
          alertMessageUpdate.className = "";
          window.location.reload();
        }, 3500);
      }
    })

    // matriculasStudent.forEach( (matricula) => {
    //     selectMateria.innerHTML += `<option value="${matricula.materiaId}">${matricula.materiaCodigo}: ${matricula.materiaNombre}</option>`;
    // })
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    messageElement.textContent =
      error.message ||
      "Error al obtener las solicitudes. Por favor, inténtalo de nuevo.";
    messageElement.className = "alert alert-danger";
  }
};

const createRequestCard = async (solicitud, editRequestModalBody, editRequestActions) => {
  const article = document.createElement("article");
  const isConfirmed = solicitud.estado === "CONFIRMADA";
  const previousGroupLabel = isConfirmed ? "Grupo anterior" : "Grupo actual";
  const desiredGroupLabel = isConfirmed ? "Grupo actual" : "Grupo deseado";

  article.className = "card border-0 shadow-sm";
  article.dataset.requestId = solicitud.id;
  article.dataset.requestStatus = solicitud.estado;

  // const badgeClass = solicitud.estado === "MATCHED" ? "text-bg-warning" : solicitud.estado === "CONFIRMADA" ? "text-bg-success" : "text-bg-danger";
  const statusClasses = {
    CONFIRMADA: "text-bg-success", // Verde
    PROPUESTA: "text-bg-warning",
    MATCHED: "text-bg-info", // Azul
    CANCELADA: "text-bg-danger",
  };

  const badgeClass = statusClasses[solicitud.estado] || "text-bg-secondary";

  article.innerHTML = `
        <div class="card-body p-4">
            <div class="d-flex justify-content-between">
                <div>
                    <span class="badge ${badgeClass}">
                        ${solicitud.estado}
                    </span>

                    <h3 class="h5 mt-2 mb-1">
                        ${solicitud.nombreMateria}
                    </h3>

                    <p class="small text-secondary mb-0">
                        Código: ${solicitud.materiaCodigo}
                    </p>
                </div>

                <span class="small text-secondary">
                    ID: ${solicitud.id}
                </span>
            </div>

            <hr>

            <div class="row g-3">
                <div class="col-sm-6">
                <p class="small text-secondary mb-1">${previousGroupLabel}</p>
                    <p class="fw-semibold mb-0">
                        ${solicitud.nombreGrupoActual}
                    </p>
                </div>

                <div class="col-sm-6">
                <p class="small text-secondary mb-1">${desiredGroupLabel}</p>
                    <p class="fw-semibold mb-0">
                        ${solicitud.nombreGrupoDeseado}
                    </p>
                </div>
            </div>

            ${await renderRequestActions(solicitud, editRequestModalBody, editRequestActions)}
            
        </div>
    `;

  return article;
};

const renderRequestActions = async (solicitud, editRequestModalBody, editRequestActions) => {
  if (solicitud.estado === "PROPUESTA") {

    const horariosDisponibles = await MateriaService.getMateriaHorarios(
          solicitud.materiaCodigo,
    );
    const horariosDisponiblesFiltered = horariosDisponibles.filter(
          (h) => h.idGrupo !== parseInt(solicitud.grupoActual) && h.idGrupo !== parseInt(solicitud.grupoDeseado),
    );
    console.log("Solicitud en estado PROPUESTA:", solicitud);
    editRequestModalBody.innerHTML = `
      <h4><b>Tu grupo actual:</b> ${solicitud.nombreGrupoActual}</h4>
      <h4><b>Grupo deseado:</b> ${solicitud.nombreGrupoDeseado}</h4>
      <p>Recuerda que para cada grupo saldrán las 2 franjas horarias. Basta con seleccionar una sola</p>
      <select id="edit-request-target-group" class="form-select">
          <option value="" selected disabled>Selecciona un grupo</option>
          ${horariosDisponiblesFiltered.map((h) => `<option value="${h.idGrupo}">${h.grupo} - dia: ${h.dia} - hora: ${h.horaInicio} - hora fin: ${h.horaFin} - profesor: ${h.profesor}</option>`).join("")}
      </select>
    `;
    editRequestActions.innerHTML = `
      <button type="button" class="btn btn-primary" data-action="save-changes" data-request-id="${solicitud.id}">Guardar cambios</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `
    return `
      <div class="d-flex gap-2 mt-4" data-request-actions>
        <button
          type="button"
          class="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#editRequestModal"
        >
          Editar solicitud
        </button>
        <button
          class="btn btn-outline-danger btn-sm"
          type="button"
          data-action="delete-request"
          data-request-id="${solicitud.id}">
          Cancelar solicitud
        </button>
      </div>
    `;
  }

  if (solicitud.estado === "MATCHED") {
    const matchesStudent = await MatchService.getStudentMatches();
    const matchForSolicitud = matchesStudent.find(
      (match) =>
        String(match.solicitudAId) === String(solicitud.id) ||
        String(match.solicitudBId) === String(solicitud.id),
    );
    if (!matchForSolicitud) {
      return "";
    }

    const isEstudianteA =
      String(matchForSolicitud.solicitudAId) === String(solicitud.id);
    const counterpartRole = isEstudianteA ? "B" : "A";
    const counterpartName =
      matchForSolicitud[`nombreEstudiante${counterpartRole}`] ||
      "Nombre no disponible";
    const currentStudentConfirmed = isEstudianteA
      ? matchForSolicitud.confirmadoPorA
      : matchForSolicitud.confirmadoPorB;
    const counterpartConfirmed = isEstudianteA
      ? matchForSolicitud.confirmadoPorB
      : matchForSolicitud.confirmadoPorA;
    const confirmButton = currentStudentConfirmed || matchForSolicitud.estado !== "ACTIVO"
      ? ""
      : `<div class="d-flex gap-2 mt-4" data-request-actions>
          <button
            class="btn btn-success btn-sm"
            type="button"
            data-action="confirm-request"
            data-request-id="${solicitud.id}"
            data-match-id="${matchForSolicitud.matchId}">
            Confirmar match
          </button>
        </div>`;

    const cancelButton = matchForSolicitud.estado === "ACTIVO"
      ? `<button class="btn btn-outline-danger btn-sm" type="button" data-action="cancel-match" data-match-id="${matchForSolicitud.matchId}">Cancelar match</button>`
      : "";

    return `
      <div>
        <p><b>Contraparte</b>: ${counterpartName}</p>
        <p><b>Estado del match</b>: ${matchForSolicitud.estado}</p>
        <p><b>Tu confirmación</b>: ${currentStudentConfirmed ? "Sí" : "No"}</p>
        <p><b>Confirmación de la contraparte</b>: ${counterpartConfirmed ? "Sí" : "No"}</p>
      </div>
      ${confirmButton}
      ${cancelButton ? `<div class="d-flex gap-2 mt-2" data-request-actions>${cancelButton}</div>` : ""}
    `;
  }

  return "";
};


//Ejemplo de respuesta del endpoint de matches del estudiante
//   {
//     "matchId": 1,
//     "solicitudAId": 4,
//     "solicitudBId": 3,
//     "estado": "CONFIRMADO",
//     "codigoMateria": "22955",
//     "confirmadoPorA": true,
//     "confirmadoPorB": true,
//     "nombreMateria": "Estruc. de datos y análisis de alg.",
//     "nombreGrupoA": "E2",
//     "nombreGrupoB": "E1",
//     "nombreEstudianteA": null,
//     "nombreEstudianteB": null
//   },
//   {
//     "matchId": 2,
//     "solicitudAId": 9,
//     "solicitudBId": 8,
//     "estado": "ACTIVO",
//     "codigoMateria": "22960",
//     "confirmadoPorA": false,
//     "confirmadoPorB": false,
//     "nombreMateria": "Base de Datos II",
//     "nombreGrupoA": "G2",
//     "nombreGrupoB": "G1",
//     "nombreEstudianteA": null,
//     "nombreEstudianteB": null
//   }
// ]
        // <button
        //   class="btn btn-outline-primary btn-sm"
        //   type="button"
        //   data-action="edit-request"
        //   data-request-id="${solicitud.id}">
        //   Editar solicitud
        // </button>
