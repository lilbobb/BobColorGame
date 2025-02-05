const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F0FF33",
  "#FF33F6",
  "#33FFF2",
];

let availableColors = [...colors];
let score = 0;
let timer;
let timeLeft = 30;
let targetColor;
let gameActive = false;
let isMuted = false;

const colorBox = document.getElementById("colorBox");
const colorOptions = document.getElementById("colorOptions");
const gameInstructions = document.getElementById("gameInstructions");
const scoreDisplay = document.getElementById("score");
const newGameButton = document.getElementById("newGameButton");
const resetButton = document.getElementById("resetButton");
const timerDisplay = document.getElementById("timer");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon");

function playBeep(frequency, type = "sine", duration = 0.5) {
  if (isMuted) return;

  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  osc.frequency.value = frequency;
  osc.type = type;

  gainNode.gain.value = 0.5;
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function getRandomColor() {
  if (availableColors.length === 0) {
    availableColors = [...colors];
  }
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors.splice(randomIndex, 1)[0];
}

function startGame() {
  resetGame();
  gameActive = true;
  gameInstructions.textContent = "Guess the correct color!";
  colorBox.style.display = "block";
  enableColorOptions();
  nextColor();
}

function nextColor() {
  if (!colorBox) return;
  targetColor = getRandomColor();
  colorBox.style.backgroundColor = targetColor;
}

function generateColorOptions() {
  colorOptions.innerHTML = "";
  colors.forEach((color) => {
    const card = document.createElement("div");
    card.classList.add("color-card");

    const button = document.createElement("button");
    button.classList.add("color-option");
    button.style.backgroundColor = color;
    button.setAttribute("data-testid", "colorOption");
    button.onclick = () => handleGuess(color);

    card.appendChild(button);
    colorOptions.appendChild(card);
  });
  disableColorOptions();
}

function handleGuess(selectedColor) {
  if (!gameActive) return;

  if (selectedColor === targetColor) {
    score++;
    playSound(true);
    gameInstructions.textContent = "✅ Correct! Keep going!";
    nextColor();
  } else {
    playSound(false);
    gameInstructions.textContent = "❌ Wrong! Try again!";
  }
  updateScore();
}

function playSound(isCorrect) {
  if (isMuted) return;

  if (isCorrect) {
    playBeep(440, "sine", 0.5);
    console.log("✅ Correct sound played");
  } else {
    playBeep(220, "sawtooth", 0.3);
    console.log("❌ Wrong sound played");
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      gameInstructions.textContent =
        "⏳ Time's up! Click 'New Game' to restart.";
      gameActive = false;
      disableColorOptions();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
}

function resetGame() {
  clearInterval(timer);
  score = 0;
  timeLeft = 30;
  gameActive = false;
  availableColors = [...colors];

  updateScore();
  generateColorOptions();
  gameInstructions.textContent = "Game reset. Click 'New Game' to start!";
  colorBox.style.display = "block";
  colorBox.style.backgroundColor = "#ffffff";
  disableColorOptions();
  timerDisplay.textContent = "30";
}

function disableColorOptions() {
  document
    .querySelectorAll(".color-option")
    .forEach((button) => (button.disabled = true));
}

function enableColorOptions() {
  document
    .querySelectorAll(".color-option")
    .forEach((button) => (button.disabled = false));
}

newGameButton.addEventListener("click", () => {
  startGame();
  startTimer();
  enableColorOptions();
});
resetButton.addEventListener("click", resetGame);

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  muteIcon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
});

resetGame();