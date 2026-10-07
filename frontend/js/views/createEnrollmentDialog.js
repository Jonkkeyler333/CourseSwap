export const createEnrollmentDialog = () => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="modal fade" id="create-enrollment-modal" tabindex="-1"
      aria-labelledby="create-enrollment-title" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5" id="create-enrollment-title">Añadir matrícula</h2>
            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <form id="create-enrollment-form">
            <div class="modal-body">
              <div class="alert d-none" role="alert" id="enrollment-form-alert"></div>

              <div class="mb-3">
                <label class="form-label" for="enrollment-subject">Materia</label>
                <select class="form-select" id="enrollment-subject" required>
                  <option value="" selected disabled>Selecciona una materia</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label" for="enrollment-group">Grupo</label>
                <select class="form-select" id="enrollment-group" disabled required>
                  <option value="" selected disabled>Selecciona primero una materia</option>
                </select>
              </div>

              <div class="border rounded bg-body-tertiary p-3 d-none" id="enrollment-schedule-container">
                <p class="small text-uppercase text-secondary fw-semibold mb-2">Horario</p>
                <div id="enrollment-schedule" aria-live="polite"></div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary" type="submit" id="create-enrollment-button">Crear matrícula</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return template.content.firstElementChild;
};
