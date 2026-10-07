import { AuthService } from "../auth.js";
import { MatriculaService } from "../matricula.js";
import { MateriaService } from "../materias.js";
import { createEnrollmentDialog } from "./createEnrollmentDialog.js";

const START_HOUR = 6;
const END_HOUR = 22;
const DAYS_IN_WEEK = 7;
const DAY_INDEX = {
  lunes: 0,
  martes: 1,
  miércoles: 2,
  miercoles: 2,
  jueves: 3,
  viernes: 4,
  sábado: 5,
  sabado: 5,
  domingo: 6,
};

export const initMatriculasView = async () => {
  if (!document.getElementById("create-enrollment-modal")) {
    document.body.appendChild(createEnrollmentDialog());
  }

  const calendarGrid = document.getElementById("calendar-grid");
  const form = document.getElementById("create-enrollment-form");
  const subjectSelect = document.getElementById("enrollment-subject");
  const groupSelect = document.getElementById("enrollment-group");
  const scheduleContainer = document.getElementById(
    "enrollment-schedule-container",
  );
  const scheduleElement = document.getElementById("enrollment-schedule");
  const alertElement = document.getElementById("enrollment-form-alert");
  const submitButton = document.getElementById("create-enrollment-button");
  const coursesBody = document.getElementById("courses-tbody");
  const modalElement = document.getElementById("create-enrollment-modal");
  const modalTitle = document.getElementById("create-enrollment-title");
  const openButton = document.getElementById("open-enrollment-button");

  if (!calendarGrid || !form || !subjectSelect || !groupSelect) {
    return;
  }

  buildCalendarRows(calendarGrid);

  let student = null;
  let selectedSchedule = [];
  let selectedSubject = null;
  let selectedGroup = null;
  let scheduleHasConflict = false;
  let editingEnrollmentId = null;
  let enrollmentRecords = [];
  let availableSubjects = [];
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  try {
    student = await AuthService.me();
    const subjects = normalizeList(
      await MateriaService.getAvailableMaterias(student.id),
    );
    availableSubjects = subjects;
    const enrollments = normalizeList(await MatriculaService.getMatricula());
    populateSubjects(subjectSelect, subjects);
    enrollmentRecords = await renderExistingEnrollments(
      calendarGrid,
      coursesBody,
      enrollments,
    );
  } catch (error) {
    showAlert(
      alertElement,
      error.message || "No se pudieron cargar las materias.",
    );
  }

  openButton.addEventListener("click", () => {
    editingEnrollmentId = null;
    selectedSubject = null;
    selectedGroup = null;
    selectedSchedule = [];
    scheduleHasConflict = false;
    modalTitle.textContent = "Añadir matrícula";
    submitButton.textContent = "Crear matrícula";
    subjectSelect.disabled = false;
    populateSubjects(subjectSelect, availableSubjects);
    form.reset();
    resetGroups(groupSelect);
    resetSchedule(scheduleContainer, scheduleElement);
    hideAlert(alertElement);
    submitButton.disabled = false;
  });

  coursesBody.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("button[data-enrollment-action]");
    if (!actionButton) {
      return;
    }

    const enrollmentId = actionButton.dataset.enrollmentId;
    const enrollment = enrollmentRecords.find(
      (item) => String(item.id) === String(enrollmentId),
    );

    if (!enrollment) {
      return;
    }

    if (actionButton.dataset.enrollmentAction === "delete") {
      if (!window.confirm("¿Deseas eliminar esta matrícula?")) {
        return;
      }

      try {
        await MatriculaService.deleteMatricula(enrollmentId);
        enrollmentRecords = enrollmentRecords.filter(
          (item) => String(item.id) !== String(enrollmentId),
        );
        availableSubjects = [
          ...availableSubjects,
          {
            id: enrollment.materiaId,
            codigo: enrollment.materiaCodigo,
            nombre: enrollment.materiaNombre,
          },
        ];
        populateSubjects(subjectSelect, availableSubjects);
        rebuildEnrollmentDisplay(calendarGrid, coursesBody, enrollmentRecords);
      } catch (error) {
        showAlert(
          alertElement,
          error.message || "No se pudo eliminar la matrícula.",
        );
      }
      return;
    }

    editingEnrollmentId = enrollment.id;
    selectedSubject = {
      id: enrollment.materiaId,
      code: enrollment.materiaCodigo,
      name: enrollment.materiaNombre,
    };
    selectedSchedule = normalizeList(
      enrollment.schedule ||
        (await MateriaService.getGroupSchedules(enrollment.grupoId)),
    );
    selectedGroup = {
      id: enrollment.grupoId,
      name: enrollment.grupoNombre,
      professor: enrollment.grupoProfesor,
    };
    modalTitle.textContent = "Editar matrícula";
    submitButton.textContent = "Guardar cambios";
    subjectSelect.disabled = true;
    populateSubjects(subjectSelect, [selectedSubject]);
    subjectSelect.value = String(selectedSubject.id);
    const groups = normalizeList(
      await MateriaService.getGroupsByMateria(selectedSubject.id),
    );
    populateGroups(groupSelect, groups);
    groupSelect.value = String(selectedGroup.id);
    renderSchedulePreview(scheduleContainer, scheduleElement, selectedSchedule);
    scheduleHasConflict = hasScheduleConflict(
      selectedSchedule,
      enrollmentRecords,
      editingEnrollmentId,
    );
    submitButton.disabled = scheduleHasConflict;
    modal.show();
  });

  subjectSelect.addEventListener("change", async () => {
    hideAlert(alertElement);
    selectedSubject = getSelectedOptionData(subjectSelect);
    selectedGroup = null;
    selectedSchedule = [];
    scheduleHasConflict = false;
    resetSchedule(scheduleContainer, scheduleElement);
    resetGroups(groupSelect);

    if (!subjectSelect.value) {
      return;
    }

    groupSelect.options[0].textContent = "Cargando grupos...";

    try {
      const groups = normalizeList(
        await MateriaService.getGroupsByMateria(subjectSelect.value),
      );
      populateGroups(groupSelect, groups);
    } catch (error) {
      resetGroups(groupSelect, "No se pudieron cargar los grupos");
      showAlert(
        alertElement,
        error.message || "No se pudieron cargar los grupos.",
      );
    }
  });

  groupSelect.addEventListener("change", async () => {
    selectedGroup = getSelectedOptionData(groupSelect);
    selectedSchedule = [];
    scheduleHasConflict = false;
    resetSchedule(scheduleContainer, scheduleElement);

    if (!groupSelect.value) {
      return;
    }

    groupSelect.disabled = true;

    try {
      selectedSchedule = normalizeList(
        await MateriaService.getGroupSchedules(groupSelect.value),
      );
      renderSchedulePreview(
        scheduleContainer,
        scheduleElement,
        selectedSchedule,
      );
      scheduleHasConflict = hasScheduleConflict(
        selectedSchedule,
        enrollmentRecords,
        editingEnrollmentId,
      );
      submitButton.disabled = scheduleHasConflict;
      if (scheduleHasConflict) {
        showAlert(
          alertElement,
          "El horario seleccionado se cruza con otra materia matriculada.",
          "warning",
        );
      }
    } catch (error) {
      showAlert(alertElement, error.message || "No se pudo cargar el horario.");
    } finally {
      groupSelect.disabled = false;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideAlert(alertElement);

    if (!student?.id || !selectedSubject?.id || !selectedGroup?.id) {
      showAlert(
        alertElement,
        "Selecciona una materia y un grupo antes de continuar.",
      );
      return;
    }

    if (scheduleHasConflict) {
      showAlert(
        alertElement,
        "No puedes guardar un grupo cuyo horario se cruza con otra materia.",
        "warning",
      );
      return;
    }

    submitButton.disabled = true;

    try {
      const response = editingEnrollmentId
        ? await MatriculaService.updateMatricula(editingEnrollmentId, {
            grupoId: Number(selectedGroup.id),
          })
        : await MatriculaService.createMatricula({
            materiaId: Number(selectedSubject.id),
            grupoId: Number(selectedGroup.id),
            estudianteId: Number(student.id),
          });

      const updatedEnrollment = {
        ...(enrollmentRecords.find(
          (enrollment) => String(enrollment.id) === String(editingEnrollmentId),
        ) || {}),
        ...(response || {}),
        id: response?.id || editingEnrollmentId,
        materiaId: Number(selectedSubject.id),
        materiaCodigo: selectedSubject.code,
        materiaNombre: selectedSubject.name,
        grupoId: Number(selectedGroup.id),
        grupoNombre: selectedGroup.name,
        grupoProfesor: selectedGroup.professor,
        schedule: selectedSchedule,
      };

      enrollmentRecords = editingEnrollmentId
        ? enrollmentRecords.map((enrollment) =>
            String(enrollment.id) === String(editingEnrollmentId)
              ? updatedEnrollment
              : enrollment,
          )
        : [...enrollmentRecords, updatedEnrollment];
      rebuildEnrollmentDisplay(calendarGrid, coursesBody, enrollmentRecords);

      showAlert(
        alertElement,
        editingEnrollmentId
          ? "Matrícula actualizada correctamente."
          : "Matrícula creada correctamente.",
        "success",
      );
      form.reset();
      selectedSubject = null;
      selectedGroup = null;
      selectedSchedule = [];
      scheduleHasConflict = false;
      editingEnrollmentId = null;
      resetGroups(groupSelect);
      resetSchedule(scheduleContainer, scheduleElement);
      subjectSelect.disabled = false;
      modalTitle.textContent = "Añadir matrícula";
      submitButton.textContent = "Crear matrícula";
      modal.hide();
    } catch (error) {
      showAlert(
        alertElement,
        error.message || "No se pudo crear la matrícula.",
      );
    } finally {
      submitButton.disabled = scheduleHasConflict;
    }
  });
};

const buildCalendarRows = (calendarGrid) => {
  const rows = document.createDocumentFragment();

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const timeLabel = document.createElement("div");
    timeLabel.className =
      "time-slot bg-body-tertiary fw-semibold p-2 text-center text-body-secondary small";
    timeLabel.textContent = `${String(hour).padStart(2, "0")}:00`;
    rows.appendChild(timeLabel);

    for (let day = 0; day < DAYS_IN_WEEK; day += 1) {
      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot p-2";
      timeSlot.dataset.hour = String(hour);
      timeSlot.dataset.day = String(day);
      rows.appendChild(timeSlot);
    }
  }

  calendarGrid.appendChild(rows);
};

const populateSubjects = (select, subjects) => {
  select.replaceChildren(new Option("Selecciona una materia", "", true, true));

  subjects.forEach((subject) => {
    const subjectId = subject.id ?? subject.materiaId;
    const subjectName =
      subject.nombre || subject.name || subject.materiaNombre || "Materia";
    const subjectCode =
      subject.codigo || subject.code || subject.materiaCodigo || "";
    const option = new Option(`${subjectCode} - ${subjectName}`, subjectId);
    option.dataset.id = subjectId;
    option.dataset.name = subjectName;
    option.dataset.code = subjectCode;
    select.appendChild(option);
  });
};

const populateGroups = (select, groups) => {
  select.replaceChildren(new Option("Selecciona un grupo", "", true, true));

  groups.forEach((group) => {
    const groupId = group.id ?? group.grupoId;
    const groupName =
      group.nombre ||
      group.name ||
      group.grupo ||
      group.grupoNombre ||
      `Grupo ${groupId}`;
    const professor =
      group.profesor ||
      group.nombreProfesor ||
      group.profesorNombre ||
      "Profesor pendiente";
    const option = new Option(`${groupName} - ${professor}`, groupId);
    option.dataset.id = groupId;
    option.dataset.name = groupName;
    option.dataset.professor = professor;
    select.appendChild(option);
  });

  select.disabled = groups.length === 0;
  if (groups.length === 0) {
    select.options[0].textContent = "No hay grupos disponibles";
  }
};

const resetGroups = (select, message = "Selecciona primero una materia") => {
  select.replaceChildren(new Option(message, "", true, true));
  select.disabled = true;
};

const renderSchedulePreview = (container, element, schedule) => {
  container.classList.remove("d-none");
  element.replaceChildren();

  if (schedule.length === 0) {
    element.textContent = "No hay horarios registrados para este grupo.";
    return;
  }

  schedule.forEach((item) => {
    const scheduleLine = document.createElement("p");
    scheduleLine.className = "mb-1";
    scheduleLine.textContent = formatSchedule(item);
    element.appendChild(scheduleLine);
  });
};

const resetSchedule = (container, element) => {
  container.classList.add("d-none");
  element.replaceChildren();
};

const renderScheduleOnCalendar = (calendarGrid, schedule, subject, group) => {
  schedule.forEach((item) => {
    const day = getDayIndex(item);
    const startHour = getHour(item);
    const endHour = getEndHour(item, startHour);

    for (let hour = startHour; hour < endHour; hour += 1) {
      const cell = calendarGrid.querySelector(
        `[data-day="${day}"][data-hour="${hour}"]`,
      );

      if (!cell) {
        continue;
      }

      const courseBlock = document.createElement("div");
      courseBlock.className = "calendar-course";
      courseBlock.textContent = `${subject.name || subject.code} - ${group.name}`;
      cell.appendChild(courseBlock);
    }
  });
};

const appendCourseRow = (coursesBody, subject, group) => {
  if (!coursesBody) {
    return;
  }

  const loadingRow = coursesBody.querySelector("td[colspan='5']");
  if (loadingRow) {
    coursesBody.replaceChildren();
  }

  const row = document.createElement("tr");
  row.dataset.enrollmentId = group.enrollmentId || "";
  [
    subject.code || "--",
    subject.name || "Materia",
    group.name || "--",
    group.professor || "--",
  ].forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  const actionsCell = document.createElement("td");
  actionsCell.className = "text-nowrap";
  actionsCell.innerHTML = `
    <button class="btn btn-outline-primary btn-sm me-1" type="button"
      data-enrollment-action="edit" data-enrollment-id="${group.enrollmentId}">
      Editar
    </button>
    <button class="btn btn-outline-danger btn-sm" type="button"
      data-enrollment-action="delete" data-enrollment-id="${group.enrollmentId}">
      Eliminar
    </button>
  `;
  row.appendChild(actionsCell);
  coursesBody.appendChild(row);
};

const renderExistingEnrollments = async (
  calendarGrid,
  coursesBody,
  enrollments,
) => {
  if (coursesBody) {
    coursesBody.replaceChildren();
  }

  const records = [];
  for (const enrollment of enrollments) {
    const subject = {
      code: enrollment.materiaCodigo,
      name: enrollment.materiaNombre,
    };
    const group = {
      id: enrollment.grupoId,
      name: enrollment.grupoNombre,
      professor: enrollment.grupoProfesor,
      enrollmentId: enrollment.id,
    };

    const schedule = normalizeList(
      await MateriaService.getGroupSchedules(enrollment.grupoId),
    );
    records.push({ ...enrollment, schedule });
    appendCourseRow(coursesBody, subject, group);
    renderScheduleOnCalendar(calendarGrid, schedule, subject, group);
  }

  return records;
};

const rebuildEnrollmentDisplay = (calendarGrid, coursesBody, enrollments) => {
  calendarGrid.querySelectorAll(".calendar-course").forEach((course) => {
    course.remove();
  });
  coursesBody.replaceChildren();

  enrollments.forEach((enrollment) => {
    const subject = {
      code: enrollment.materiaCodigo,
      name: enrollment.materiaNombre,
    };
    const group = {
      enrollmentId: enrollment.id,
      name: enrollment.grupoNombre,
      professor: enrollment.grupoProfesor,
    };
    appendCourseRow(coursesBody, subject, group);
    renderScheduleOnCalendar(
      calendarGrid,
      enrollment.schedule || [],
      subject,
      group,
    );
  });
};

const getSelectedOptionData = (select) => {
  const option = select.options[select.selectedIndex];
  return option
    ? {
        id: option.dataset.id || option.value,
        name: option.dataset.name,
        code: option.dataset.code,
        professor: option.dataset.professor,
      }
    : null;
};

const normalizeList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return (
    data?.content ||
    data?.items ||
    data?.data ||
    data?.horarios ||
    data?.grupos ||
    []
  );
};

const hasScheduleConflict = (schedule, enrollments, ignoredEnrollmentId) => {
  return schedule.some((candidate) =>
    enrollments
      .filter(
        (enrollment) => String(enrollment.id) !== String(ignoredEnrollmentId),
      )
      .some((enrollment) =>
        (enrollment.schedule || []).some((existing) =>
          schedulesOverlap(candidate, existing),
        ),
      ),
  );
};

const schedulesOverlap = (first, second) => {
  if (getDayIndex(first) !== getDayIndex(second)) {
    return false;
  }

  const firstStart = getTimeInMinutes(first, "start");
  const firstEnd = getTimeInMinutes(first, "end");
  const secondStart = getTimeInMinutes(second, "start");
  const secondEnd = getTimeInMinutes(second, "end");

  return firstStart < secondEnd && secondStart < firstEnd;
};

const getTimeInMinutes = (schedule, boundary) => {
  const value =
    boundary === "start"
      ? (schedule.horaInicio ?? schedule.hora_inicio ?? schedule.startTime)
      : (schedule.horaFin ?? schedule.hora_fin ?? schedule.endTime);
  const [hours = 0, minutes = 0] = String(value || "00:00").split(":");
  return Number(hours) * 60 + Number(minutes);
};

const getDayIndex = (schedule) => {
  const value =
    schedule.dia ?? schedule.day ?? schedule.diaSemana ?? schedule.dayOfWeek;

  if (typeof value === "number") {
    return value >= 1 && value <= 7 ? value - 1 : value;
  }

  return DAY_INDEX[String(value || "").toLowerCase()] ?? 0;
};

const getHour = (schedule) => {
  const value =
    schedule.horaInicio ?? schedule.hora_inicio ?? schedule.startTime;
  const hour = Number.parseInt(String(value || "").split(":")[0], 10);
  return Number.isNaN(hour) ? START_HOUR : hour;
};

const getEndHour = (schedule, startHour) => {
  const value = schedule.horaFin ?? schedule.hora_fin ?? schedule.endTime;
  const endHour = Number.parseInt(String(value || "").split(":")[0], 10);
  return Number.isNaN(endHour) || endHour <= startHour
    ? startHour + 1
    : endHour;
};

const formatSchedule = (schedule) => {
  const day =
    schedule.dia ?? schedule.day ?? schedule.diaSemana ?? "Día pendiente";
  const start =
    schedule.horaInicio ?? schedule.hora_inicio ?? schedule.startTime ?? "--";
  const end = schedule.horaFin ?? schedule.hora_fin ?? schedule.endTime ?? "--";
  return `${day}: ${start} - ${end}`;
};

const showAlert = (element, message, type = "danger") => {
  element.textContent = message;
  element.className = `alert alert-${type}`;
};

const hideAlert = (element) => {
  element.textContent = "";
  element.className = "alert d-none";
};
