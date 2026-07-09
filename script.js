const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonStage = document.getElementById("buttonStage");
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


let noAttempts = 0;
let lastMove = 0;
const moveCooldown = 750;

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

const score = document.createElement("p");
score.className = "score";
score.textContent = "No attempts: 0";
questionCard.appendChild(score);

const achievement = document.createElement("p");
achievement.className = "achievement";
questionCard.appendChild(achievement);

function rectsOverlap(a, b, padding = 28) {
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

function updateExtras() {
  score.textContent = `No attempts: ${noAttempts}`;

  if (noAttempts >= 3) {
    document.querySelector(".eyebrow").textContent = eyebrowTexts[1];
  }

  if (noAttempts >= 6) {
    document.querySelector(".eyebrow").textContent = eyebrowTexts[2];
  }

  if (noAttempts >= 8) {
    document.querySelector(".eyebrow").textContent = eyebrowTexts[3];
  }

  if (noAttempts >= 3) yesBtn.textContent = yesTexts[1];
  if (noAttempts >= 5) yesBtn.textContent = yesTexts[2];
  if (noAttempts >= 8) yesBtn.textContent = yesTexts[3];

  noBtn.textContent = noTexts[Math.min(noAttempts, noTexts.length - 1)];

  if ([2, 4, 6, 8].includes(noAttempts)) {
    achievement.textContent = achievements[Math.min(noAttempts / 2 - 1, achievements.length - 1)];
  }
}

function moveNoButton() {
  const now = Date.now();
  if (now - lastMove < moveCooldown) return;
  lastMove = now;

  noAttempts++;

  const stageRect = buttonStage.getBoundingClientRect();

  const yesWidth = yesBtn.offsetWidth;
  const yesHeight = yesBtn.offsetHeight;
  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;

  const yesLeft = stageRect.width * 0.08;
  const yesTop = stageRect.height * 0.28;
  const yesSafeZone = {
    left: yesLeft - 18,
    right: yesLeft + yesWidth + 46,
    top: yesTop - 18,
    bottom: yesTop + yesHeight + 36
  };

  const padding = 8;
  const minX = stageRect.width * 0.66;
  const maxX = stageRect.width - noWidth - padding;
  const minY = padding;
  const maxY = stageRect.height - noHeight - padding;

  let x, y, candidate, tries = 0;

  do {
    x = minX + Math.random() * Math.max(1, maxX - minX);
    y = minY + Math.random() * Math.max(1, maxY - minY);

    candidate = {
      left: x,
      right: x + noWidth,
      top: y,
      bottom: y + noHeight
    };

    tries++;
  } while (rectsOverlap(candidate, yesSafeZone, 20) && tries < 100);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const photoIndex = noAttempts - 1;
  if (photoIndex < photos.length) {
    photos[photoIndex].classList.add("show", "photo-pop");
  }

  hintText.textContent = noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];

  if (noAttempts >= 5) {
    mainHeading.textContent = "I think you already know the correct answer.";
  }

  const noScale = Math.max(0.58, 1 - noAttempts * 0.05);
  const yesScale = Math.min(1.04, 1 + noAttempts * 0.005);
  
  noBtn.style.transform = `scale(${noScale}) rotate(${Math.random() * 10 - 5}deg)`;
  yesBtn.style.transform = `translate(-50%,-50%) scale(${yesScale})`;


  updateExtras();

  if(noAttempts >= 9){

    yesBtn.style.animation = "pulse .8s";

    setTimeout(()=>{
        yesBtn.style.animation = "";
    },800);

}
}

function isNearNoButton(x, y) {
  const rect = noBtn.getBoundingClientRect();
  const buffer = 48;

  return (
    x > rect.left - buffer &&
    x < rect.right + buffer &&
    y > rect.top - buffer &&
    y < rect.bottom + buffer
  );
}

function launchConfetti() {
  const emojis = ["🎉", "✨", "💙", "🥳", "🎊"];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.fontSize = `${18 + Math.random() * 18}px`;
    confettiLayer.appendChild(piece);

    setTimeout(() => piece.remove(), 2400);
  }
}

function showSuccessSequence() {
  questionCard.classList.add("hidden");
  photoBackground.classList.add("hide-photos");
  successCard.classList.remove("hidden");

  restartBtn.style.display = "none";
  finalLine.classList.add("hidden");
  legoWalk.classList.add("hidden");

  successEyebrow.textContent = "System check";
  successHeading.textContent = "Analysing response...";
  successText.textContent = "Please wait.";

  setTimeout(function () {
    successHeading.textContent = "Checking compatibility...";
    successText.textContent = "This is an important decision.";
  }, 1000);

  setTimeout(function () {
    successHeading.textContent = "Searching for reasons to say no...";
    successText.textContent = "Scanning...";
  }, 2100);

  setTimeout(() => {
    successHeading.textContent = "Hmm...";
    successText.textContent = "Still checking...";
  }, 3800);

  setTimeout(() => {
    successHeading.textContent = "Searching harder...";
    successText.textContent = "This is taking longer than expected...";
  }, 5300);

  setTimeout(function () {
    successHeading.textContent = "None found.";
    successText.textContent = "That is the correct answer.";
  }, 6800);

  setTimeout(function () {
    successEyebrow.textContent = "Mission complete";
    successHeading.textContent = "Congratulations!";
    successText.innerHTML =
      "You have successfully unlocked:<br><strong>One German girlfriend</strong><br><br>No attempts: " +
      noAttempts +
      "<br>I'll pretend I didn't see that.";

    finalLine.classList.remove("hidden");
    legoWalk.classList.remove("hidden");
    restartBtn.style.display = "inline-block";
    launchConfetti();
  }, 9000);
}

document.addEventListener("mousemove", (event) => {
  if (isNearNoButton(event.clientX, event.clientY)) moveNoButton();
});

document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (touch && isNearNoButton(touch.clientX, touch.clientY)) moveNoButton();
}, { passive: true });

document.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (touch && isNearNoButton(touch.clientX, touch.clientY)) moveNoButton();
}, { passive: true });

noBtn.addEventListener("click",(event)=>{

    event.preventDefault();

    if(noAttempts >= 15){

        hintText.textContent = "Seriously?!";

        noBtn.style.opacity = "0";

        noBtn.style.pointerEvents = "none";

        setTimeout(()=>{

            moveNoButton();

            noBtn.style.opacity = "1";
            noBtn.style.pointerEvents = "auto";

        },350);

        return;

    }

    moveNoButton();

});

yesBtn.addEventListener("click", showSuccessSequence);

restartBtn.addEventListener("click", () => {
  noAttempts = 0;
  lastMove = 0;

  legoWalk.classList.add("hidden");
  successEyebrow.textContent = "Mission complete";

  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");
  photoBackground.classList.remove("hide-photos");

  hintText.textContent = "Go on. Try the No button.";
  mainHeading.textContent = "Will you be my girlfriend?";
  document.querySelector(".eyebrow").textContent = "Why are you Gay?";

  score.textContent = "No attempts: 0";
  achievement.textContent = "";

  yesBtn.textContent = "Yes";
  noBtn.textContent = "No";

  photos.forEach((photo) => {
    photo.classList.remove("show", "photo-pop");
  });

  yesBtn.style.left = "28%";
  yesBtn.style.top = "50%";
  yesBtn.style.transform = "translate(-50%,-50%)";

  noBtn.style.left = "72%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%,-50%)";
});
