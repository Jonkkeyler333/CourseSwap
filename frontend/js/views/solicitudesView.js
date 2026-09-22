import { SolicitudesService } from "../solicitudes.js";
import { MatriculaService } from "../matricula.js";
import { MateriaService } from "../materias.js";
import { AuthService } from "../auth.js";

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
    messageElement.textContent = "Error al obtener los datos del usuario. Por favor, inténtalo de nuevo.";
    messageElement.className = "alert alert-danger";
  }

  formCreate.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (codigoEstInput.value !== userData.codigo) {
        messageElement.textContent = "El código ingresado no coincide con tu código de estudiante.";
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
  })
//   let grupoActual = undefined;
  try {
    const solicitudes = await SolicitudesService.getStudentSolicitudes();
    const matriculasStudent = await MatriculaService.getMatricula()
    requestCount.textContent = `${solicitudes.length} Solicitudes Encontradas`;
    if (solicitudes.length === 0) {
      requestList.innerHTML = "";
      emptyState.classList.remove("d-none");
      return;
    }

    emptyState.classList.add("d-none");
    requestList.innerHTML = "";
    solicitudes.forEach((solicitud) => {
      const card = createRequestCard(solicitud);
      requestList.appendChild(card);
    });

    selectMateria.innerHTML = `
        <option value="" selected disabled>Selecciona una materia</option>
        ${matriculasStudent.map(m => `<option value="${m.materiaId}">${m.materiaCodigo}:${m.materiaNombre}</option>`).join('')}
    `;

    selectMateria.addEventListener("change", async (event) => {
        const materiaId = event.target.value;
        console.log('Materia seleccionada:', materiaId);
        console.log('Matriculas del estudiante:', matriculasStudent);

        const matriculaFind = matriculasStudent.find(
          (materia) => materia.materiaId === parseInt(materiaId),
        );
        if (matriculaFind) {
            console.log('Matricula encontrada:', matriculaFind);
            // grupoActual = matriculaFind.grupoNombre;
            grupoActualElement.innerHTML = `<input readonly class="form-control" id="grupoActual" type="text" value="${matriculaFind.grupoNombre}" />
            <input type="hidden" id="grupoActualId" type="text" value="${matriculaFind.grupoId}" />`;
            const horariosDisponibles = await MateriaService.getMateriaHorarios(matriculaFind.materiaCodigo);
            const horariosDisponiblesFiltered = horariosDisponibles.filter(h => h.idGrupo !== matriculaFind.grupoId);
            grupoDeseadoElement.innerHTML = `
                <option value="" selected disabled>Selecciona un grupo</option>
                ${horariosDisponiblesFiltered.map(h => `<option value="${h.idGrupo}">${h.grupo} - dia: ${h.dia} - hora: ${h.horaInicio} - hora fin: ${h.horaFin} - profesor: ${h.profesor}</option>`).join('')}`;

        } else {
            grupoActualElement.innerHTML = `<input readonly class="form-control" type="text" value="No se encontró el grupo actual" />`;
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

const createRequestCard = (solicitud) => {
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
                    #${solicitud.id}
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

            <div class="d-flex gap-2 mt-4">
                <button
                    class="btn btn-outline-primary btn-sm"
                    type="button"
                    data-action="edit-request">
                    Editar solicitud
                </button>

                <button
                    class="btn btn-outline-danger btn-sm"
                    type="button"
                    data-action="delete-request">
                    Cancelar solicitud
                </button>
            </div>
        </div>
    `;

  return article;
};
