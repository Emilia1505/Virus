const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonZone = document.getElementById("buttonZone");
const questionCard = document.getElementById("questionCard");
const successCard = document.getElementById("successCard");
const hintText = document.getElementById("hintText");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const restartBtn = document.getElementById("restartBtn");

let noAttempts = 0;
let yesChance = 72;

const hints = [
  "That button seems suspiciously slippery.",
  "Interesting choice. Try again.",
  "The No button has trust issues.",
  "Statistically, Yes is becoming more likely.",
  "Bold attempt. Poor execution.",
  "At this point the website has taken a side.",
  "The “No” button is emotionally unavailable.",
  "The universe gently rejects that option.",
  "Look at the Yes button. So stable. So reliable."
];

function updateProgress() {
  yesChance = Math.min(99, yesChance + 5);
  progressFill.style.width = `${yesChance}%`;
  progressLabel.textContent = `Current likelihood of saying yes: ${yesChance}%`;
}

function moveNoButton() {
  const zoneRect = buttonZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 8;
  const maxX = zoneRect.width - btnRect.width - padding;
  const maxY = zoneRect.height - btnRect.height - padding;

  const randomX = Math.max(padding, Math.random() * maxX);
  const randomY = Math.max(padding, Math.random() * maxY);

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.transform = "none";

  noAttempts += 1;

  const scale = Math.max(0.72, 1 - noAttempts * 0.045);
  noBtn.style.transform = `scale(${scale})`;

  yesBtn.style.transform = `translate(-50%, -50%) scale(${1 + noAttempts * 0.035})`;

  hintText.textContent = hints[Math.min(noAttempts - 1, hints.length - 1)];
  updateProgress();

  buttonZone.classList.remove("shake");
  void buttonZone.offsetWidth;
  buttonZone.classList.add("shake");
}

function isNearNoButton(x, y) {
  const rect = noBtn.getBoundingClientRect();
  const buffer = 65;

  return (
    x > rect.left - buffer &&
    x < rect.right + buffer &&
    y > rect.top - buffer &&
    y < rect.bottom + buffer
  );
}

document.addEventListener("pointermove", (event) => {
  if (isNearNoButton(event.clientX, event.clientY)) {
    moveNoButton();
  }
});

noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  questionCard.classList.add("hidden");
  successCard.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");

  noAttempts = 0;
  yesChance = 72;

  progressFill.style.width = "72%";
  progressLabel.textContent = "Current likelihood of saying yes: 72%";
  hintText.textContent = "Choose wisely.";

  noBtn.style.left = "58%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%, -50%)";

  yesBtn.style.transform = "translate(-50%, -50%)";
});
