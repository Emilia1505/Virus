const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hintText = document.getElementById("hintText");
const questionCard = document.getElementById("questionCard");
const successCard = document.getElementById("successCard");
const restartBtn = document.getElementById("restartBtn");
const mainHeading = document.getElementById("mainHeading");
const photoBackground = document.getElementById("photoBackground");
const confettiLayer = document.getElementById("confettiLayer");
const photos = document.querySelectorAll(".bg-photo");
const legoWalk = document.getElementById("legoWalk");

const successHeading = document.getElementById("successHeading");
const successText = document.getElementById("successText");
const finalLine = document.getElementById("finalLine");
const successEyebrow = document.getElementById("successEyebrow");
const questionEyebrow = questionCard.querySelector(".eyebrow");

let noAttempts = 0;
let lastMove = 0;
let noIsDisappearing = false;

const moveCooldown = 750;
const screenMargin = 14;
const yesSafetyPadding = 55;

const noMessages = [
  "That button has commitment issues.",
  "Interesting choice. Try again.",
  "That button seems suspiciously slippery.",
  "Oiiiii!!!!!!!",
  "I admire the effort.",
  "The website respectfully disagrees.",
  "The No button has trust issues.",
  "Statistically, Yes is looking stronger.",
  "At this point, just press Yes."
];

const eyebrowTexts = [
  "Why are you Gay?",
  "Really? :(",
  "Seriously?",
  "AHHHHHHHHHHHHHHHHHHHHH",
  "I'm running out of messages."
];

const yesTexts = [
  "Yes",
  "Ja",
  "Sí",
  "Absolutely"
];

const noTexts = [
  "No",
  "Nope",
  "Nah",
  "Still no.",
  "No? :("
];

const achievements = [
  "Persistent, I see :(",
  "Still trying to say no, eh?",
  "Bold strategy, Bella. I am watching you :0",
  "Are you taking the piss???? >:("
];

const photoPositions = [
  { top: "24px", left: "3%", rotation: "-8deg" },
  { top: "56px", left: "21%", rotation: "6deg" },
  { top: "24px", left: "40%", rotation: "-3deg" },
  { top: "56px", right: "21%", rotation: "7deg" },
  { top: "24px", right: "3%", rotation: "-6deg" },

  { bottom: "10px", left: "4%", rotation: "5deg" },
  { bottom: "0px", left: "29%", rotation: "-7deg" },
  { bottom: "10px", right: "29%", rotation: "4deg" },
  { bottom: "0px", right: "4%", rotation: "-5deg" }
];

photos.forEach((photo, index) => {
  const position = photoPositions[index];

  if (!position) return;

  Object.assign(photo.style, position);
  photo.style.setProperty("--rotation", position.rotation);
});

/* Counter and achievement text */
const score = document.createElement("p");
score.className = "score";
score.textContent = "No attempts: 0";
questionCard.appendChild(score);

const achievement = document.createElement("p");
achievement.className = "achievement";
questionCard.appendChild(achievement);


function rectsOverlap(a, b, padding = 0) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

function updateExtras() {
  score.textContent = `No attempts: ${noAttempts}`;

  if (noAttempts < 3) {
    questionEyebrow.textContent = eyebrowTexts[0];
  } else if (noAttempts < 6) {
    questionEyebrow.textContent = eyebrowTexts[1];
  } else if (noAttempts < 8) {
    questionEyebrow.textContent = eyebrowTexts[2];
  } else if (noAttempts < 12) {
    questionEyebrow.textContent = eyebrowTexts[3];
  } else {
    questionEyebrow.textContent = eyebrowTexts[4];
  }

  if (noAttempts < 3) {
    yesBtn.textContent = yesTexts[0];
  } else if (noAttempts < 5) {
    yesBtn.textContent = yesTexts[1];
  } else if (noAttempts < 8) {
    yesBtn.textContent = yesTexts[2];
  } else {
    yesBtn.textContent = yesTexts[3];
  }

  noBtn.textContent =
    noTexts[Math.min(noAttempts, noTexts.length - 1)];

  if ([2, 4, 6, 8].includes(noAttempts)) {
    const achievementIndex = noAttempts / 2 - 1;
    achievement.textContent = achievements[achievementIndex];
  }
}

function findSafePosition() {
  const viewport = getViewport();
  const yesRect = yesBtn.getBoundingClientRect();

  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;

  const minX = viewport.left + screenMargin;
  const maxX =
    viewport.left +
    viewport.width -
    noWidth -
    screenMargin;

  const minY = viewport.top + screenMargin;
  const maxY =
    viewport.top +
    viewport.height -
    noHeight -
    screenMargin;

function moveNoButton() {
  const now = Date.now();

  if (now - lastMove < moveCooldown) return;
  lastMove = now;

  noAttempts++;

  const stageRect = buttonStage.getBoundingClientRect();
  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;

  const yesRect = yesBtn.getBoundingClientRect();
  const stageLeft = stageRect.left;
  const stageTop = stageRect.top;

  const yesSafeZone = {
    left: yesRect.left - stageLeft - 28,
    right: yesRect.right - stageLeft + 28,
    top: yesRect.top - stageTop - 24,
    bottom: yesRect.bottom - stageTop + 24
  };

  const padding = 8;
  const maxX = stageRect.width - noWidth - padding;
  const maxY = stageRect.height - noHeight - padding;

  let x;
  let y;
  let candidate;
  let tries = 0;

  do {
    x = padding + Math.random() * Math.max(1, maxX - padding);
    y = padding + Math.random() * Math.max(1, maxY - padding);

    candidate = {
      left: x,
      right: x + noWidth,
      top: y,
      bottom: y + noHeight
    };

    tries++;
  } while (
    rectsOverlap(candidate, yesSafeZone, 12) &&
    tries < 100
  );

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const photoIndex = noAttempts - 1;

  if (photoIndex < photos.length) {
    photos[photoIndex].classList.add("show", "photo-pop");
  }

  hintText.textContent =
    noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];

  if (noAttempts >= 5) {
    mainHeading.textContent =
      "I think you already know the correct answer.";
  }

  const noScale = Math.max(
    0.32,
    1 - noAttempts * 0.06
  );

  const yesScale = Math.min(
    1.04,
    1 + noAttempts * 0.06
  );

  const rotation = Math.random() * 10 - 5;

  noBtn.style.transform =
    `scale(${noScale}) rotate(${rotation}deg)`;

  yesBtn.style.transform =
    `translate(-50%, -50%) scale(${yesScale})`;

  updateExtras();

  if (noAttempts >= 9) {
    yesBtn.style.animation = "pulse .8s";

    setTimeout(() => {
      yesBtn.style.animation = "";
    }, 1600);
  }
}

function launchConfetti() {
  const emojis = ["🎉", "✨", "💙", "🥳", "🎊"];

  for (let i = 0; i < 50; i += 1) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay =
      `${Math.random() * 0.4}s`;

    piece.style.fontSize =
      `${18 + Math.random() * 18}px`;

    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 2400);
  }
}

function showSuccessSequence() {
  questionCard.classList.add("hidden");
  photoBackground.classList.add("hide-photos");
  successCard.classList.remove("hidden");

  noBtn.style.display = "none";
  restartBtn.style.display = "none";

  finalLine.classList.add("hidden");
  legoWalk.classList.add("hidden");

  successEyebrow.textContent = "System check";
  successHeading.textContent = "Analysing response...";
  successText.textContent = "Please wait.";

  window.setTimeout(() => {
    successHeading.textContent =
      "Checking compatibility...";

    successText.textContent =
      "This is an important decision.";
  }, 1000);

  window.setTimeout(() => {
    successHeading.textContent =
      "Searching for reasons to say no...";

    successText.textContent = "Scanning...";
  }, 2100);

  window.setTimeout(() => {
    successHeading.textContent = "Hmm...";
    successText.textContent = "Still checking...";
  }, 3800);

  window.setTimeout(() => {
    successHeading.textContent = "Searching harder...";

    successText.textContent =
      "This is taking longer than expected...";
  }, 5300);

  window.setTimeout(() => {
    successHeading.textContent = "None found.";

    successText.textContent =
      "That is the correct answer.";
  }, 6800);

  window.setTimeout(() => {
    successEyebrow.textContent = "Mission complete";
    successHeading.textContent = "Congratulations!";

    successText.innerHTML =
      "You have successfully unlocked:<br>" +
      "<strong>One German girlfriend</strong><br><br>" +
      "No attempts: " +
      noAttempts +
      "<br>I'll pretend I didn't see that.";

    finalLine.classList.remove("hidden");
    legoWalk.classList.remove("hidden");
    restartBtn.style.display = "inline-block";

    launchConfetti();
  }, 9000);
}


document.addEventListener("mousemove", (event) => {
  if (
    !questionCard.classList.contains("hidden") &&
    isNearNoButton(event.clientX, event.clientY)
  ) {
    moveNoButton();
  }
});

document.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.touches[0];

    if (
      touch &&
      !questionCard.classList.contains("hidden") &&
      isNearNoButton(touch.clientX, touch.clientY)
    ) {
      moveNoButton();
    }
  },
  { passive: true }
);

document.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];

    if (
      touch &&
      !questionCard.classList.contains("hidden") &&
      isNearNoButton(touch.clientX, touch.clientY)
    ) {
      moveNoButton();
    }
  },
  { passive: true }
);

noBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (noAttempts >= 15) {
    disappearNoButton();
    return;
  }

  moveNoButton();
});

yesBtn.addEventListener("click", showSuccessSequence);

restartBtn.addEventListener("click", () => {
  noAttempts = 0;
  lastMove = 0;
  noIsDisappearing = false;

  legoWalk.classList.add("hidden");
  successEyebrow.textContent = "Mission complete";

  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");
  photoBackground.classList.remove("hide-photos");

  hintText.textContent = "Go on. Try the No button.";
  mainHeading.textContent =
    "Will you be my girlfriend?";

  questionEyebrow.textContent = "Why are you Gay?";

  score.textContent = "No attempts: 0";
  achievement.textContent = "";

  yesBtn.textContent = "Yes";
  noBtn.textContent = "No";

  photos.forEach((photo) => {
    photo.classList.remove("show", "photo-pop");
  });

  yesBtn.style.transform =
    "translate(-50%, -50%)";

  requestAnimationFrame(resetNoButtonPosition);
});
