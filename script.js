const cardsContainer = document.getElementById("cards-container");
const rouletteDisplay = document.getElementById("roulette-display");
const spinBtn = document.getElementById("spin-btn");
const historyList = document.getElementById("history-list");

const popup = document.getElementById("popup");
const popupNumber = document.getElementById("popup-number");
const popupPlayer = document.getElementById("popup-player"); // 👈 NUEVO
const closePopup = document.getElementById("close-popup");
const reiniciarPopup = document.getElementById("reiniciar-popup");

const configBtn = document.getElementById("config-btn");
const configPopup = document.getElementById("config-popup");
const numCardsInput = document.getElementById("num-cards");
const applyConfig = document.getElementById("apply-config");
const closeConfig = document.getElementById("close-config");

const autoSpinBtn = document.getElementById("auto-spin-btn");
const speedSelect = document.getElementById("speed-select");


let counts = {}; // Contador de cada número
let totalCards = 20; // valor inicial
let autoSpinInterval = null;
let autoSpinSpeed = 650; // valor por defecto (Normal)

// Botón Giro Automático
autoSpinBtn.addEventListener("click", () => {
  if (!autoSpinInterval) {
    autoSpinInterval = setInterval(spinRoulette, autoSpinSpeed);
    autoSpinBtn.textContent = "⛔ Detener Auto.";
    spinBtn.disabled = true;
  } else {
    clearInterval(autoSpinInterval);
    autoSpinInterval = null;
    autoSpinBtn.textContent = "🔄 Giro Auto.";
    spinBtn.disabled = false;
  }
});


// Mostrar popup config
configBtn.addEventListener("click", () => {
  configPopup.style.display = "flex";
});

// Cerrar popup config
closeConfig.addEventListener("click", () => {
  configPopup.style.display = "none";
});

// Aplicar nueva configuración
applyConfig.addEventListener("click", () => {
  let value = parseInt(numCardsInput.value);
  if (value >= 1 && value <= 20) {
    totalCards = value;
    autoSpinSpeed = parseInt(speedSelect.value); // 👈 guardar velocidad
    createCards();
    historyList.innerHTML = "";
    rouletteDisplay.textContent = "?";
    configPopup.style.display = "none";
  } else {
    alert("Por favor ingresa un número entre 1 y 20");
  }
});


// Modificar createCards para usar totalCards
function createCards() {
  cardsContainer.innerHTML = "";
  for (let i = 1; i <= totalCards; i++) {
    counts[i] = 0;

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.number = i;

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("card-number");
    numberDiv.textContent = i;

    const playerInput = document.createElement("textarea");
    playerInput.placeholder = "Jugador";
    playerInput.classList.add("card-player");
    playerInput.rows = 2;

    playerInput.addEventListener("input", () => {
      if (playerInput.value.length > 20) {
        playerInput.classList.add("long-text");
      } else {
        playerInput.classList.remove("long-text");
      }
    });

    const circlesDiv = document.createElement("div");
    circlesDiv.classList.add("circles");
    for (let j = 0; j < 5; j++) {
      const circle = document.createElement("div");
      circle.classList.add("circle");
      circlesDiv.appendChild(circle);
    }

    card.appendChild(numberDiv);
    card.appendChild(playerInput);
    card.appendChild(circlesDiv);
    cardsContainer.appendChild(card);
  }
}

function updateCardCircles(number) {
  const card = document.querySelector(`.card[data-number='${number}']`);
  if (!card) return;

  const circles = card.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    if (index < counts[number]) {
      circle.classList.add("filled");
    } else {
      circle.classList.remove("filled");
    }
  });

  // Resetear niveles de carta
  card.classList.remove("level-1", "level-2", "level-3", "level-4", "level-5");

  if (counts[number] > 0) {
    card.classList.add(`level-${counts[number]}`);
  }
}

function spinRoulette() {
  const result = Math.floor(Math.random() * totalCards) + 1; // 👈 ahora usa totalCards
  rouletteDisplay.textContent = result;

  if (counts[result] < 5) {
    counts[result]++;
  }

  updateCardCircles(result);

  const li = document.createElement("li");
  li.textContent = `Salió: ${result}`;
  historyList.prepend(li);

  if (counts[result] === 5) {
  const card = document.querySelector(`.card[data-number='${result}']`);
  const playerName = card.querySelector(".card-player").value || "Sin nombre";

  popupNumber.textContent = `Número: ${result}`;
  popupPlayer.textContent = `Jugador: ${playerName}`;
  popup.style.display = "flex";

  // 👇 DETENER AUTO-SPIN SI ESTÁ ACTIVO
  if (autoSpinInterval) {
    clearInterval(autoSpinInterval);
    autoSpinInterval = null;
    autoSpinBtn.textContent = "🔄 Giro Auto.";
    spinBtn.disabled = false; // reactivar botón manual
  }
}
}

// Reiniciar ronda
function reiniciarRonda() {
  for (let i = 1; i <= 20; i++) {
    counts[i] = 0;
  }
  createCards();
  historyList.innerHTML = "";
  rouletteDisplay.textContent = "?";
  popup.style.display = "none";
}

// Eventos
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});
reiniciarPopup.addEventListener("click", reiniciarRonda);

createCards();
spinBtn.addEventListener("click", spinRoulette);
