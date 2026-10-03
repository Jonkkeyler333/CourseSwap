import { AuthService } from "../auth.js";
import { MatchService } from "../match.js";

const hasCurrentStudentConfirmed = (match, userData) => {
  const currentStudentName = `${userData.nombre} ${userData.apellido}`;
  if (match.nombreEstudianteA === currentStudentName) return match.confirmadoPorA;
  if (match.nombreEstudianteB === currentStudentName) return match.confirmadoPorB;
  return false;
};

export const initDashboardView = async () => {
  const matchList = document.getElementById("match-list");
  const messageAlert = document.getElementById("alert-message");

  AuthService.checkAuthGuard(true);

  const logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", () => {
    AuthService.logout();
    window.location.href = "./index.html";
  });

  const userNameElement = document.getElementById("user-name");
  const navBarUserEmailElement = document.getElementById("navbar-user-name");
  const userCodeElement = document.getElementById("user-code");

  try {
    const userData = await AuthService.me();
    userNameElement.textContent = userData.nombre;
    navBarUserEmailElement.textContent = userData.email;
    userCodeElement.textContent = "Código: " + userData.codigo;

    const matchesStudent = await MatchService.getStudentMatches();
    const activeMatches = matchesStudent.filter(
      (match) => match.estado === "ACTIVO",
    );

    matchList.innerHTML = "";
    const cards = activeMatches.map((match) => createMatchCard(match, userData));
    console.log(cards.length);

    if (cards.length === 0) {
      messageAlert.classList.remove("d-none");
      messageAlert.classList.add("alert", "alert-warning");
      messageAlert.textContent = "No hay matches disponibles en este momento.";
    } else {
      messageAlert.classList.add("d-none");
      cards.forEach((card) => {
        if (card) {
          matchList.appendChild(card);
        }
      });
    }
  } catch (error) {
    messageAlert.classList.remove("d-none");
    messageAlert.textContent = "Error al obtener los matches: " + error.message;
    setTimeout(() => {
      messageAlert.classList.add("d-none");
    }, 5000);
  }

  matchList.addEventListener("click", async (event) => {
    const buttonConfirm = event.target.closest("button[data-action='confirm-match']");
    const buttonCancel = event.target.closest("button[data-action='cancel-match']");
    if (!buttonConfirm && !buttonCancel) {
        return;
    }
    const matchId = (buttonConfirm || buttonCancel).dataset.matchId;
    try {
        if (buttonCancel) {
          if (!window.confirm("¿Cancelar este match? Las dos solicitudes quedarán canceladas.")) return;
          await MatchService.cancelMatch(matchId);
        } else {
          const result = await MatchService.confirmMatch(matchId);
          const matchCard = buttonConfirm.closest("article");
          if (result.estado === "CONFIRMADO") {
            matchCard.remove();
            if (!matchList.querySelector("article")) {
              messageAlert.className = "alert alert-warning";
              messageAlert.textContent = "No tienes otros matches activos.";
            }
          } else {
            buttonConfirm.disabled = true;
            buttonConfirm.textContent = "Confirmación enviada";
            const status = document.createElement("p");
            status.className = "small text-success mt-2 mb-0";
            status.textContent = "Ya confirmaste. El match seguirá disponible para cancelarlo mientras esperas la confirmación de la otra persona.";
            buttonConfirm.parentElement.insertAdjacentElement("beforebegin", status);
          }
        }
        messageAlert.classList.remove("d-none");
        if (buttonCancel) {
          messageAlert.textContent = "Match cancelado; ambas solicitudes quedaron canceladas.";
        } else if (messageAlert.textContent !== "No tienes otros matches activos.") {
          messageAlert.textContent = "Tu confirmación se registró correctamente.";
        }
        setTimeout(() => {
            messageAlert.classList.add("d-none");
        }, 5000);
        if (buttonCancel) window.location.reload();
    } catch (error) {
        messageAlert.classList.remove("d-none");
        messageAlert.textContent = `Error al ${buttonCancel ? "cancelar" : "confirmar"} el match: ` + error.message;
        setTimeout(() => {
            messageAlert.classList.add("d-none");
        }, 5000);
    }
  })
};

const createMatchCard = (match, userData) => {
  const article = document.createElement("article");
  article.dataset.matchId = match.matchId;
  const currentStudentConfirmed = hasCurrentStudentConfirmed(match, userData);
  console.log(match);

  const statusClasses = {
    ACTIVO: "bg-success-subtle text-success",
    // CONFIRMADO: "bg-primary-subtle text-primary",
    // CANCELADO: "bg-danger-subtle text-danger",
  };

  const badgeClass =
    statusClasses[match.estado] || "bg-secondary-subtle text-secondary";

  article.innerHTML = `
        <div class="card-body p-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                    <div class="d-flex gap-3">
                        <div class="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px;">
                            ⏱️
                        </div>
                        <div>
                            <p class="text-success fw-semibold mb-1" id="match-status">Match encontrado</p>
                            <h2 class="h4 mb-1" id="match-title">Tienes un intercambio disponible</h2>
                            <p class="text-secondary mb-0" id="match-description">Revisa la información de la persona y confirma si deseas continuar.</p>
                        </div>
                    </div>
                    <span class="badge text-bg-success align-self-start" id="match-state">Activo</span>
            </div>
            <hr class="my-4">
            <div class="row g-4" id="match-details">
                <div class="col-md-4">
                    <p class="small text-uppercase text-secondary fw-semibold mb-1">Materia</p>
                    <p class="mb-0 fw-semibold" id="match-course-name">${match.nombreMateria}</p>
                    <p class="small text-secondary mb-0" id="match-course-code">Código: ${match.codigoMateria}</p>
                </div>
                <div class="col-md-4">
                    <p class="small text-uppercase text-secondary fw-semibold mb-1">Intercambio</p>
                    <p class="mb-0" id="match-course-groups"><span class="fw-semibold">Grupo ${match.nombreGrupoA}</span> <span class="text-secondary">por</span> <span class="fw-semibold">Grupo ${match.nombreGrupoB}</span></p>
                    <p class="small text-secondary mb-0">Cambio de grupo</p>
                </div>
            </div>

            <div class="d-flex flex-wrap gap-2 mt-4" id="match-actions">
                ${currentStudentConfirmed
                  ? '<button class="btn btn-success" type="button" disabled>Confirmación enviada</button>'
                  : `<button class="btn btn-success" type="button" data-action="confirm-match" data-match-id="${match.matchId}">Confirmar match</button>`}
                <button class="btn btn-danger" type="button" data-action="cancel-match" data-match-id="${match.matchId}">Cancelar match</button>
            </div>
            ${currentStudentConfirmed ? '<p class="small text-success mt-2 mb-0">Ya confirmaste. El match sigue activo mientras esperas la confirmación de la otra persona.</p>' : ''}
        </div>
    `;
    return article;
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

// EJEMPLO DE CÓDIGO HTML PARA EL MATCH CARD que esta en el dashboard.html
//<div class="card border-0 shadow-sm" id="match-card">
// <div class="card-body p-4">
//   <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
//     <div class="d-flex gap-3">
//       <div class="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px;">
//         <span class="fw-bold">✓</span>
//   </div>
// <div>
