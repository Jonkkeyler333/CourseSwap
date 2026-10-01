const START_HOUR = 6;
const END_HOUR = 22;
const DAYS_IN_WEEK = 7;

export const initMatriculasView = () => {
  const calendarGrid = document.getElementById("calendar-grid");

  if (!calendarGrid) {
    return;
  }

  const rows = document.createDocumentFragment();

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const timeLabel = document.createElement("div");
    timeLabel.className =
      "time-slot bg-light fw-semibold p-2 text-center text-secondary small";
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
