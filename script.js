/*
  EASY EDIT AREA
  Change the text below, then save. No coding knowledge needed.
*/
const SETTINGS = {
  question: "Will you be my girlfriend?",
  subtitle: "Choose wisely. One answer is clearly superior.",
  yesButton: "Yes 💕",
  noButton: "No",
  yesTitle: "YAY!!!",
  yesMessage: "You just made me incredibly happy. I cannot wait for all the little adventures, stupid jokes, deep talks, and memories ahead.",
  hints: [
    "The “No” button is emotionally unavailable.",
    "Interesting choice. Unfortunately, no.",
    "That button has commitment issues.",
    "Nope. Try the pink-approved answer.",
    "The universe gently rejects that option.",
    "Look at the Yes button. So stable. So reliable."
  ]
};

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const hint = document.getElementById("hint");
const celebration = document.getElementById("celebration");
const questionCard = document.getElementById("questionCard");
const restartButton = document.getElementById("restartButton");
const hearts = document.getElementById("hearts");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let attempts = 0;
let confettiPieces = [];
let confettiAnimation = null;

function applySettings() {
  document.getElementById("mainQuestion").textContent = SETTINGS.question;
  document.getElementById("subtitle").textContent = SETTINGS.subtitle;
  yesButton.textContent = SETTINGS.yesButton;
  noButton.textContent = SETTINGS.noButton;
  document.getElementById("yesTitle").textContent = SETTINGS.yesTitle;
  document.getElementById("yesMessage").textContent = SETTINGS.yesMessage;
  hint.textContent = SETTINGS.hints[0];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function moveNoButton() {
  attempts += 1;

  const buttonWidth = noButton.offsetWidth || 108;
  const buttonHeight = noButton.offsetHeight || 48;
  const margin = 14;
  const maxX = window.innerWidth - buttonWidth - margin;
  const maxY = window.innerHeight - buttonHeight - margin;

  const current = noButton.getBoundingClientRect();
  let x;
  let y;
  let tries = 0;

  // Keep generating a new position until it is meaningfully away from the current one.
  do {
    x = margin + Math.random() * Math.max(1, maxX - margin);
    y = margin + Math.random() * Math.max(1, maxY - margin);
    tries += 1;
  } while (
    tries < 30 &&
    Math.abs(x - current.left) < 90 &&
    Math.abs(y - current.top) < 90
  );

  noButton.style.left = `${clamp(x, margin, maxX)}px`;
  noButton.style.top = `${clamp(y, margin, maxY)}px`;

  const noScale = clamp(1 - attempts * 0.075, 0.52, 1);
  const yesScale = clamp(1 + attempts * 0.055, 1, 1.45);
  noButton.style.setProperty("--no-scale", noScale);
  yesButton.style.setProperty("--yes-scale", yesScale);

  noButton.classList.remove("running");
  void noButton.offsetWidth;
  noButton.classList.add("running");

  hint.textContent = SETTINGS.hints[attempts % SETTINGS.hints.length];
}

function isNearNoButton(clientX, clientY) {
  const rect = noButton.getBoundingClientRect();
  const buffer = 85;
  return (
    clientX >= rect.left - buffer &&
    clientX <= rect.right + buffer &&
    clientY >= rect.top - buffer &&
    clientY <= rect.bottom + buffer
  );
}

// Desktop mouse proximity.
document.addEventListener("mousemove", (event) => {
  if (!celebration.classList.contains("hidden")) return;
  if (isNearNoButton(event.clientX, event.clientY)) moveNoButton();
});

// Mobile finger proximity. This is the important bit for phones.
document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch || !celebration.classList.contains("hidden")) return;
  if (isNearNoButton(touch.clientX, touch.clientY)) {
    event.preventDefault();
    moveNoButton();
  }
}, { passive: false });

document.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (!touch || !celebration.classList.contains("hidden")) return;
  if (isNearNoButton(touch.clientX, touch.clientY)) {
    event.preventDefault();
    moveNoButton();
  }
}, { passive: false });

// Fallback: even if she lands a tap, No still refuses.
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesButton.addEventListener("click", showCelebration);
yesButton.addEventListener("touchend", (event) => {
  event.preventDefault();
  showCelebration();
}, { passive: false });

restartButton.addEventListener("click", () => {
  attempts = 0;
  yesButton.style.setProperty("--yes-scale", 1);
  noButton.style.setProperty("--no-scale", 1);
  hint.textContent = SETTINGS.hints[0];
  celebration.classList.add("hidden");
  questionCard.classList.remove("hidden");
  placeNoButtonInitial();
});

function showCelebration() {
  questionCard.classList.add("hidden");
  celebration.classList.remove("hidden");
  fireConfetti();
}

function placeNoButtonInitial() {
  const rect = questionCard.getBoundingClientRect();
  const x = Math.min(window.innerWidth - 125, Math.max(20, rect.left + rect.width / 2 - 54));
  const y = Math.min(window.innerHeight - 80, Math.max(20, rect.top + rect.height - 120));
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
}

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "❤️" : "💕";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${16 + Math.random() * 20}px`;
  heart.style.animationDuration = `${6 + Math.random() * 7}s`;
  heart.style.animationDelay = `${Math.random() * 2}s`;
  hearts.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}

setInterval(createHeart, 520);

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function fireConfetti() {
  resizeCanvas();
  confettiPieces = [];
  const emojis = ["❤️", "💕", "✨", "💖", "🎉"];

  for (let i = 0; i < 95; i += 1) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.8) * 10,
      gravity: 0.16 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.25,
      size: 16 + Math.random() * 15,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      life: 120 + Math.random() * 40
    });
  }

  if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.spin;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.font = `${p.size}px serif`;
    ctx.globalAlpha = clamp(p.life / 90, 0, 1);
    ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((p) => p.life > 0 && p.y < window.innerHeight + 80);

  if (confettiPieces.length) {
    confettiAnimation = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  if (celebration.classList.contains("hidden")) placeNoButtonInitial();
});

applySettings();
resizeCanvas();
window.addEventListener("load", placeNoButtonInitial);
setTimeout(placeNoButtonInitial, 100);
