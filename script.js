const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonStage = document.getElementById("buttonStage");
const hintText = document.getElementById("hintText");
const questionCard = document.getElementById("questionCard");
const successCard = document.getElementById("successCard");
const restartBtn = document.getElementById("restartBtn");
let lastMove = 0;
const moveCooldown = 500;

/* EDIT YOUR 9 MESSAGES HERE */
const noMessages = [
  "That button has commitment issues.",
  "That button seems suspiciously slippery.",
  "Interesting choice. Try again.",
  "The No button has chosen self-preservation.",
  "The No button has trust issues.",
  "I admire the effort.",
  "The website respectfully disagrees.",
  "Statistically, Yes is looking stronger.",
  "At this point, just press Yes."
];

let noAttempts = 0;

function rectsOverlap(a, b, padding = 14) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

function getRelativeRect(element, parent) {
  const e = element.getBoundingClientRect();
  const p = parent.getBoundingClientRect();

  return {
    left: e.left - p.left,
    right: e.right - p.left,
    top: e.top - p.top,
    bottom: e.bottom - p.top,
    width: e.width,
    height: e.height
  };
}

function moveNoButton() {
  const now = Date.now();
  if (now - lastMove < moveCooldown) return;
  lastMove = now;
  const stageRect = buttonStage.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRelative = getRelativeRect(yesBtn, buttonStage);

  const padding = 8;
  const maxX = stageRect.width - noRect.width - padding;
  const maxY = stageRect.height - noRect.height - padding;

  let x;
  let y;
  let candidate;
  let tries = 0;

  do {
    x = padding + Math.random() * Math.max(1, maxX - padding);
    y = padding + Math.random() * Math.max(1, maxY - padding);

    candidate = {
      left: x,
      right: x + noRect.width,
      top: y,
      bottom: y + noRect.height
    };

    tries++;
  } while (rectsOverlap(candidate, yesRelative, 20) && tries < 80);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  noAttempts++;

  const messageIndex = Math.min(noAttempts - 1, noMessages.length - 1);
  hintText.textContent = noMessages[messageIndex];

  const noScale = Math.max(0.74, 1 - noAttempts * 0.035);
  const yesScale = Math.min(1.24, 1 + noAttempts * 0.035);

  noBtn.style.transform = `scale(${noScale})`;
  yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
}

function isNearNoButton(x, y) {
  const rect = noBtn.getBoundingClientRect();
  const buffer = 70;

  return (
    x > rect.left - buffer &&
    x < rect.right + buffer &&
    y > rect.top - buffer &&
    y < rect.bottom + buffer
  );
}

/* Desktop Chrome */
document.addEventListener("mousemove", (event) => {
  if (isNearNoButton(event.clientX, event.clientY)) {
    moveNoButton();
  }
});

/* Mobile */
document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch) return;

  if (isNearNoButton(touch.clientX, touch.clientY)) {
    moveNoButton();
  }
}, { passive: true });

document.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (!touch) return;

  if (isNearNoButton(touch.clientX, touch.clientY)) {
    moveNoButton();
  }
}, { passive: true });

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  questionCard.classList.add("hidden");
  successCard.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  noAttempts = 0;

  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");

  hintText.textContent = "Take your time.";

  yesBtn.style.left = "26%";
  yesBtn.style.top = "55%";
  yesBtn.style.transform = "translate(-50%, -50%)";

  noBtn.style.left = "68%";
  noBtn.style.top = "55%";
  noBtn.style.transform = "translate(-50%, -50%)";
});
