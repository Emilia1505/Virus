const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonStage = document.getElementById("buttonStage");
const hintText = document.getElementById("hintText");
const questionCard = document.getElementById("questionCard");
const successCard = document.getElementById("successCard");
const restartBtn = document.getElementById("restartBtn");
const mainHeading = document.getElementById("mainHeading");
const photos = document.querySelectorAll(".bg-photo");

let noAttempts = 0;
let lastMove = 0;
const moveCooldown = 650;

const noMessages = [
  "That button has commitment issues.",
  "Interesting choice. Try again.",  
  "That button seems suspiciously slippery.",
  "The No button has chosen self-preservation.",
  "I admire the effort.",
  "The website respectfully disagrees.",
  "The No button has trust issues.",
  "Statistically, Yes is looking stronger.",
  "At this point, just press Yes."
];

const photoPositions = [
  { top: "3%", left: "3%", rotation: "-8deg" },
  { top: "4%", right: "3%", rotation: "7deg" },
  { top: "28%", left: "-2%", rotation: "5deg" },
  { top: "30%", right: "-2%", rotation: "-6deg" },
  { bottom: "4%", left: "3%", rotation: "8deg" },
  { bottom: "4%", right: "3%", rotation: "-7deg" },
  { bottom: "1%", left: "30%", rotation: "-4deg" },
  { bottom: "1%", right: "30%", rotation: "5deg" },
  { top: "1%", left: "42%", rotation: "3deg" }
];

photos.forEach((photo, index) => {
  const position = photoPositions[index];

  if (!position) return;

  Object.assign(photo.style, position);
  photo.style.setProperty("--rotation", position.rotation);
});

function rectsOverlap(a, b, padding = 18) {
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
  } while (rectsOverlap(candidate, yesRelative, 24) && tries < 100);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  noAttempts++;

  const photoIndex = noAttempts - 1;

  if (photoIndex < photos.length) {
    photos[photoIndex].classList.add("show");
  }

  const messageIndex = Math.min(noAttempts - 1, noMessages.length - 1);
  hintText.textContent = noMessages[messageIndex];

  if (noAttempts >= 5) {
    mainHeading.textContent = "I think you already know the correct answer.";
  }

  const noScale = Math.max(0.74, 1 - noAttempts * 0.035);
  const yesScale = Math.min(1.45, 1 + noAttempts * 0.05);

  noBtn.style.transform = `scale(${noScale})`;
  yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
}

function isNearNoButton(x, y) {
  const rect = noBtn.getBoundingClientRect();
  const buffer = 55;

  return (
    x > rect.left - buffer &&
    x < rect.right + buffer &&
    y > rect.top - buffer &&
    y < rect.bottom + buffer
  );
}

document.addEventListener("mousemove", (event) => {
  if (isNearNoButton(event.clientX, event.clientY)) {
    moveNoButton();
  }
});

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
  lastMove = 0;

  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");

  hintText.textContent = "Take your time.";
  mainHeading.textContent = "Will you be my girlfriend?";

  photos.forEach((photo) => {
    photo.classList.remove("show");
  });

  yesBtn.style.left = "26%";
  yesBtn.style.top = "55%";
  yesBtn.style.transform = "translate(-50%, -50%)";

  noBtn.style.left = "68%";
  noBtn.style.top = "55%";
  noBtn.style.transform = "translate(-50%, -50%)";
});
