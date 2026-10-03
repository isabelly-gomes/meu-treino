const REST_TIME = 40;

let timer = null;
let timeLeft = REST_TIME;

function startExercise(button) {
  const card = button.closest(".exercise");

  // Fecha qualquer outro exercício aberto
  document.querySelectorAll(".exercise").forEach(exercise => {
    if (exercise !== card) {
      const oldWorkout = exercise.querySelector(".workout-area");
      if (oldWorkout) oldWorkout.remove();

      const oldButton = exercise.querySelector(".start-button");
      if (oldButton) oldButton.style.display = "block";
    }
  });

  clearInterval(timer);

  const totalSets = Number(card.dataset.sets);
  const reps = card.dataset.reps;
  const weight = card.dataset.weight;

  button.style.display = "none";

  const area = document.createElement("div");
  area.className = "workout-area";

  area.innerHTML = `
    <div class="set-counter">
      Série <strong class="current-set">1</strong> de ${totalSets}
    </div>

    <div class="current-data">
      <strong>${weight} kg</strong>
      <span>×</span>
      <strong>${reps} reps</strong>
    </div>

    <button class="finish-set">
      ✓ Concluir série
    </button>
  `;

  card.appendChild(area);

  let currentSet = 1;

  area.querySelector(".finish-set").onclick = function () {

    if (currentSet >= totalSets) {
      clearInterval(timer);

      area.innerHTML = `
        <div class="exercise-complete">
          ✓ Exercício concluído
        </div>
      `;

      return;
    }

    startRest(area, () => {
      currentSet++;

      area.innerHTML = `
        <div class="set-counter">
          Série <strong>${currentSet}</strong> de ${totalSets}
        </div>

        <div class="current-data">
          <strong>${weight} kg</strong>
          <span>×</span>
          <strong>${reps} reps</strong>
        </div>

        <button class="finish-set">
          ✓ Concluir série
        </button>
      `;

      area.querySelector(".finish-set").onclick =
        arguments.callee;
    });
  };
}

function startRest(area, finished) {

  clearInterval(timer);

  timeLeft = REST_TIME;

  area.innerHTML = `
    <div class="rest-label">DESCANSO</div>

    <div class="timer">
      00:${String(timeLeft).padStart(2, "0")}
    </div>

    <div class="timer-buttons">
      <button class="add-time">+15 s</button>
      <button class="skip-time">Pular</button>
    </div>
  `;

  const timerDisplay = area.querySelector(".timer");

  area.querySelector(".add-time").onclick = () => {
    timeLeft += 15;
    timerDisplay.textContent =
      `00:${String(timeLeft).padStart(2, "0")}`;
  };

  area.querySelector(".skip-time").onclick = () => {
    clearInterval(timer);
    finished();
  };

  timer = setInterval(() => {

    timeLeft--;

    timerDisplay.textContent =
      `00:${String(timeLeft).padStart(2, "0")}`;

    if (timeLeft <= 0) {

      clearInterval(timer);

      if ("vibrate" in navigator) {
        navigator.vibrate([300, 150, 300]);
      }

      finished();
    }

  }, 1000);
}
