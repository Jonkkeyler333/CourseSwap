import { SolicitudesService } from "../solicitudes.js";
import { MatriculaService } from "../matricula.js";
import { MateriaService } from "../materias.js";
import { AuthService } from "../auth.js";
import { MatchService } from "../match.js";

export const initSolicitudesView = async () => {
  const requestList = document.getElementById("requests-list");
  const emptyState = document.getElementById("empty-requests-state");
  const requestCount = document.getElementById("requests-count");
  const messageElement = document.getElementById("request-form-alert");
  const selectMateria = document.getElementById("request-materia");
  const grupoActualElement = document.getElementById("request-current-group");
  const grupoDeseadoElement = document.getElementById("request-target-group");
  const codigoEstInput = document.getElementById("request-codigo");
  const formCreate = document.getElementById("new-request-form");
  const logoutButton = document.getElementById("logout-button");

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
      }, 5000);
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
      setTimeout(() => {
        messageElement.textContent = "";
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      messageElement.textContent =
        error.message ||
        "Error al crear la solicitud. Por favor, inténtalo de nuevo.";
      messageElement.className = "alert alert-danger";
      setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "";
      }, 5000);
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
        solicitudesOrdered.map((solicitud) => createRequestCard(solicitud)),
      );
      cards.forEach((card) => requestList.appendChild(card));
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

const createRequestCard = async (solicitud) => {
  const article = document.createElement("article");

  article.className = "card border-0 shadow-sm";
  article.dataset.requestId = solicitud.id;
  article.dataset.requestStatus = solicitud.estado;

  // const badgeClass = solicitud.estado === "MATCHED" ? "text-bg-warning" : solicitud.estado === "CONFIRMADA" ? "text-bg-success" : "text-bg-danger";
  const statusClasses = {
    CONFIRMADA: "text-bg-success", // Verde
    PENDIENTE: "text-bg-warning", // Amarillo
    RECHAZADA: "text-bg-danger", // Rojo
    MATCHED: "text-bg-info", // Azul
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
                    <p class="small text-secondary mb-1">Grupo actual</p>
                    <p class="fw-semibold mb-0">
                        ${solicitud.nombreGrupoActual}
                    </p>
                </div>

                <div class="col-sm-6">
                    <p class="small text-secondary mb-1">Grupo deseado</p>
                    <p class="fw-semibold mb-0">
                        ${solicitud.nombreGrupoDeseado}
                    </p>
                </div>
            </div>

            ${await renderRequestActions(solicitud)}
            
        </div>
    `;

  return article;
};

const renderRequestActions = async (solicitud) => {
  if (solicitud.estado === "PROPUESTA") {
    return `
      <div class="d-flex gap-2 mt-4" data-request-actions>
        <button
          class="btn btn-outline-primary btn-sm"
          type="button"
          data-action="edit-request"
          data-request-id="${solicitud.id}">
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
    const confirmButton = currentStudentConfirmed
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

    return `
      <div>
        <p><b>Contraparte</b>: ${counterpartName}</p>
        <p><b>Estado del match</b>: ${matchForSolicitud.estado}</p>
        <p><b>Tu confirmación</b>: ${currentStudentConfirmed ? "Sí" : "No"}</p>
        <p><b>Confirmación de la contraparte</b>: ${counterpartConfirmed ? "Sí" : "No"}</p>
      </div>
      ${confirmButton}
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
