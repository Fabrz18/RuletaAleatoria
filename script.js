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
const winnersList = document.getElementById("winners-list");
const numPositionsInput = document.getElementById("num-positions");
const prizeAmountInput = document.getElementById("prize-amount");

const yapeInput = document.getElementById("yape-number");
const yapeDisplay = document.getElementById("yape-display");

let counts = {}; // Contador de cada número
let totalCards = 20; // valor inicial
let autoSpinInterval = null;
let autoSpinSpeed = 650; // valor por defecto (Normal)
let winners = [];
let prizeAmount = "100 puntos";
let prizeConfig = [{puesto:1, premio:"20"}, {puesto:2, premio:"15"}, {puesto:3, premio:"10"}, {puesto:4, premio:"10"}, {puesto:5, premio:"5"}]; // [{puesto:1, premio:"20"}, {puesto:2, premio:"15"}, {puesto:3, premio:"10"}]

numPositionsInput.addEventListener("input", () => {
  renderPrizeInputs(parseInt(numPositionsInput.value));
});
// Cargar Yape guardado al iniciar
window.addEventListener("load", () => {
    const savedYape = "💜" + localStorage.getItem("yapeNumber") + "💜";
    if (savedYape) {
        yapeDisplay.textContent = savedYape;
        yapeInput.value = savedYape;
    }
});

// Al cargar la página, renderizamos los 3 por defecto
renderPrizeInputs(numPositionsInput.value);
function renderPrizeInputs(count) {
  const container = document.getElementById("prizes-config");
  container.innerHTML = ""; // limpiar
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("label");
    label.textContent = `Premio puesto ${i}:`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `prize-${i}`;
    input.value = (prizeConfig[i-1]?.premio || "");

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  }
}
// 🔹 Función para agregar ganador
// 🔹 Función para agregar ganador
function addWinner(number, player) {
  // Usar la longitud de prizeConfig como límite
  if (winners.length >= prizeConfig.length) return;

  const puesto = winners.length + 1;
  const premio = prizeConfig.find(p => p.puesto === puesto)?.premio || "—";

  winners.push({ puesto, numero: number, jugador: player, premio });

  renderWinners();
}


// 🔹 Mostrar ganadores en pantalla
function renderWinners() {
  winnersList.innerHTML = "";
  winners.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `Puesto ${w.puesto}: ${w.jugador} (N°${w.numero}) - Premio: ${w.premio}`;
    winnersList.appendChild(li);
  });
}


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

applyConfig.addEventListener("click", () => {
  let value = parseInt(numCardsInput.value);
  const yapeNumber = yapeInput.value.trim();
    if (yapeNumber) {
        localStorage.setItem("yapeNumber", yapeNumber);
        yapeDisplay.textContent = "💜" + yapeNumber + "💜";
    } else {
        localStorage.removeItem("yapeNumber");
        yapeDisplay.textContent = "";
    }
  if (value >= 1 && value <= 50) {
    totalCards = value;
    autoSpinSpeed = parseInt(speedSelect.value);

    numPositions = parseInt(numPositionsInput.value) || 3;

    // construir prizeConfig desde inputs dinámicos
    prizeConfig = [];
    for (let i = 1; i <= numPositions; i++) {
      const premio = document.getElementById(`prize-${i}`).value || "—";
      prizeConfig.push({ puesto: i, premio });
    }

    createCards();
    historyList.innerHTML = "";
    rouletteDisplay.textContent = "?";
    configPopup.style.display = "none";
  } else {
    alert("Por favor ingresa un número entre 1 y 50");
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

    // 🔹 Botones de Moradeo
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("moradeo-buttons");

    const btnYaMoradeo = document.createElement("button");
    btnYaMoradeo.textContent = "M";
    btnYaMoradeo.style.backgroundColor = "#800080"; // morado fuerte
    btnYaMoradeo.style.color = "white";
    btnYaMoradeo.style.marginRight = "5px";

    const btnFaltaMoradear = document.createElement("button");
    btnFaltaMoradear.textContent = "N";
    btnFaltaMoradear.style.backgroundColor = "#d8b0ff"; // morado claro
    btnFaltaMoradear.style.color = "black";

    // Evento: pintar playerInput
    btnYaMoradeo.addEventListener("click", () => {
      playerInput.style.backgroundColor = "#800080";
      playerInput.style.color = "white";
    });

    btnFaltaMoradear.addEventListener("click", () => {
      playerInput.style.backgroundColor = "#d8b0ff";
      playerInput.style.color = "black";
    });

    buttonsDiv.appendChild(btnYaMoradeo);
    buttonsDiv.appendChild(btnFaltaMoradear);

    const circlesDiv = document.createElement("div");
    circlesDiv.classList.add("circles");
    for (let j = 0; j < 5; j++) {
      const circle = document.createElement("div");
      circle.classList.add("circle");
      circlesDiv.appendChild(circle);
    }

    card.appendChild(numberDiv);
    card.appendChild(playerInput);
    card.appendChild(buttonsDiv); // 🔹 Añadimos botones
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

// 🔹 Cuando una carta llega a 5 → ganador
function spinRoulette() {
  if (popup.style.display === "flex") return; // 🚫 Bloquea giros si popup está abierto

  let i = 1;
  let startTime = Date.now();
  let duration = 750;
  let intervalTime = duration / totalCards;
  
  // 🔹 Resetear colores ANTES de girar
  document.querySelectorAll(".card-player").forEach(input => {
    input.style.backgroundColor = "";
    input.style.color = "";
  });

  const interval = setInterval(() => {
    rouletteDisplay.textContent = i;
    i = (i >= totalCards) ? 1 : i + 1;

    if (Date.now() - startTime >= duration) {
      clearInterval(interval);

      // 🔹 Filtrar números que todavía no ganaron
      const availableNumbers = [];
      for (let n = 1; n <= totalCards; n++) {
        if (!winners.some(w => w.numero === n) && counts[n] < 5) {
          availableNumbers.push(n);
        }
      }

      if (availableNumbers.length === 0) {
        rouletteDisplay.textContent = "🎉 Todos ganaron!";
        return;
      }
      if (popup.style.display === "flex") return;
      // 🔹 Elegir un número aleatorio de los disponibles
      const result = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      rouletteDisplay.textContent = result;

      

      counts[result]++;
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

        addWinner(result, playerName);

        // 🚫 Detener auto-spin si había
        if (autoSpinInterval) {
          clearInterval(autoSpinInterval);
          autoSpinInterval = null;
          autoSpinBtn.textContent = "🔄 Giro Auto.";
          spinBtn.disabled = false;
        }

        return; // 🚨 No seguir sumando puntos
      }
    }
  }, intervalTime);
}





// Reiniciar ronda
function reiniciarRonda() {
  for (let i = 1; i <= totalCards; i++) {
    counts[i] = 0;
  }
  createCards();
  historyList.innerHTML = "";
  rouletteDisplay.textContent = "?";
  popup.style.display = "none";
  // 🔹 Limpiar ganadores
  winners = [];
  renderWinners();
}

// Eventos
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});
reiniciarPopup.addEventListener("click", reiniciarRonda);

createCards();
spinBtn.addEventListener("click", spinRoulette);
