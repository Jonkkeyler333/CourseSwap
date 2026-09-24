import { AuthService } from "../auth.js";
import { MatchService } from "../match.js";

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
  AuthService.me()
    .then((userData) => {
      console.log(userData);
      userNameElement.textContent = userData.nombre;
      navBarUserEmailElement.textContent = userData.email;
      userCodeElement.textContent = "Código: " + userData.codigo;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  try {
    const matchesStudent = await MatchService.getStudentMatches();
    const activeMatches = matchesStudent.filter(
      (match) => match.estado === "ACTIVO",
    );

    matchList.innerHTML = "";
    const cards = activeMatches.map((match) => createMatchCard(match));

    if (cards.length === 0) {
      messageAlert.classList.remove("d-none");
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
    if (!buttonConfirm) {
        return;
    }
    const matchId = buttonConfirm.dataset.matchId;
    try {
        await MatchService.confirmMatch(matchId);
        messageAlert.classList.remove("d-none");
        messageAlert.textContent = "Match confirmado exitosamente.";
        setTimeout(() => {
            messageAlert.classList.add("d-none");
        }, 5000);
        window.location.reload();
    } catch (error) {
        messageAlert.classList.remove("d-none");
        messageAlert.textContent = "Error al confirmar el match: " + error.message;
        setTimeout(() => {
            messageAlert.classList.add("d-none");
        }, 5000);
    }
  })
};

const createMatchCard = (match) => {
  const article = document.createElement("article");
  article.dataset.matchId = match.matchId;

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
                <button class="btn btn-success" type="button" data-action="confirm-match" data-match-id="${match.matchId}">Confirmar match</button>
                <button class="bbtn btn-outline-secondary" type="button" data-action="cancel-match" data-match-id="${match.matchId}">Cancelar match</button>
            </div>
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