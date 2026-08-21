/* =========================================
   DATE GENERATOR
========================================= */


/* ---------- Elements ---------- */

const dateSetup =
  document.getElementById("dateSetup");

const dateResult =
  document.getElementById("dateResult");

const generateDateButton =
  document.getElementById("generateDate");

const rerollDateButton =
  document.getElementById("rerollDate");

const saveDateButton =
  document.getElementById("saveDateButton");

const completeDateButton =
  document.getElementById("completeDateButton");

const changeFiltersButton =
  document.getElementById("changeFilters");

const energyFilter =
  document.getElementById("energyFilter");

const budgetFilter =
  document.getElementById("budgetFilter");

const locationFilter =
  document.getElementById("locationFilter");

const dateEmoji =
  document.getElementById("dateEmoji");

const dateTitle =
  document.getElementById("dateTitle");

const dateDescription =
  document.getElementById("dateDescription");

const dateTags =
  document.getElementById("dateTags");

const noResults =
  document.getElementById("noResults");


let currentDate = null;
let rerollCount = 0;


/* =========================================
   STORAGE
========================================= */

function getSavedDates() {
  return JSON.parse(
    localStorage.getItem("savedDates") || "[]"
  );
}


function getCompletedDates() {
  return JSON.parse(
    localStorage.getItem("completedDates") || "[]"
  );
}


function isDateSaved(id) {
  return getSavedDates().includes(id);
}


function isDateCompleted(id) {
  return getCompletedDates().includes(id);
}


function saveDate(id) {
  const saved = getSavedDates();

  if (!saved.includes(id)) {
    saved.push(id);

    localStorage.setItem(
      "savedDates",
      JSON.stringify(saved)
    );

    unlockAchievement("date-planner");
  }
}


function completeDate(id) {
  const completed =
    getCompletedDates();

  if (!completed.includes(id)) {
    completed.push(id);

    localStorage.setItem(
      "completedDates",
      JSON.stringify(completed)
    );

    /* First completed date */
    unlockAchievement(
      "date-completed"
    );

    /* Five completed dates */
    if (completed.length >= 5) {
      unlockAchievement(
        "serial-daters"
      );
    }

    /* Ten completed dates */
    if (completed.length >= 10) {
      unlockAchievement(
        "completionist"
      );
    }
  }
}


/* =========================================
   FILTERING
========================================= */

function getFilteredDates() {
  return dateIdeas.filter((date) => {

    const energyMatches =
      energyFilter.value === "Any" ||
      date.energy === energyFilter.value;

    const budgetMatches =
      budgetFilter.value === "Any" ||
      date.budget === budgetFilter.value;

    const locationMatches =
      locationFilter.value === "Any" ||
      date.location === locationFilter.value ||
      date.location === "Anywhere";

    return (
      energyMatches &&
      budgetMatches &&
      locationMatches
    );
  });
}

/* =========================================
   COMPLETELY UNNECESSARY THOMAS EVENT
========================================= */

const thomasEvent =
  document.getElementById("thomasEvent");

const thomasTrain =
  document.getElementById("thomasTrain");

let thomasRunning = false;


/*
  Occasionally Thomas simply drives through.

  There is no explanation.
  There is no follow-up.
  Nobody invited him.
*/

function maybeTriggerThomas() {

  if (
    !thomasEvent ||
    !thomasTrain ||
    thomasRunning ||
    Math.random() >= 0.05
  ) {
    return false;
  }

  runThomasIntervention();

  return true;
}


function runThomasIntervention() {

  thomasRunning = true;

  unlockAchievement(
    "thomas-intervention"
  );

  const thomasCount =
    incrementStatistic(
      "thomasEncounters"
    );

  if (thomasCount >= 5) {
    unlockAchievement(
      "suspicious-rail-activity"
    );
  }


  /* Show railway nonsense */

  thomasEvent.classList.remove(
    "hidden"
  );


  /* Restart animation */

  thomasTrain.classList.remove(
    "driving"
  );

  void thomasTrain.offsetWidth;

  thomasTrain.classList.add(
    "driving"
  );


  /* Thomas leaves. No explanation provided. */

  setTimeout(() => {

    thomasEvent.classList.add(
      "hidden"
    );

    thomasTrain.classList.remove(
      "driving"
    );

    thomasRunning = false;

  }, 3500);
}


/* =========================================
   DATE GENERATOR
========================================= */

function generateDate() {

  /*
    FIRST:
    give Thomas the opportunity
    to seize control.
  */

  maybeTriggerThomas()


  const possibleDates =
    getFilteredDates();


  noResults.classList.add(
    "hidden"
  );


  /* ---------- No matches ---------- */

  if (possibleDates.length === 0) {

    currentDate = null;

    dateResult.classList.add(
      "hidden"
    );

    noResults.classList.remove(
      "hidden"
    );

    return;
  }


  /*
    Avoid immediately generating
    the same date twice if possible.
  */

  let availableDates =
    possibleDates;


  if (
    currentDate &&
    possibleDates.length > 1
  ) {

    const alternatives =
      possibleDates.filter(
        (date) =>
          date.id !== currentDate.id
      );


    if (alternatives.length > 0) {
      availableDates =
        alternatives;
    }
  }


  /* ---------- Pick date ---------- */

  currentDate =
    availableDates[
      Math.floor(
        Math.random() *
        availableDates.length
      )
    ];


  renderDate();


  dateSetup.classList.add(
    "hidden"
  );

  dateResult.classList.remove(
    "hidden"
  );


  unlockAchievement(
    "first-roll"
  );
}


/* =========================================
   RENDER DATE
========================================= */

function renderDate() {

  if (!currentDate) {
    return;
  }


  dateEmoji.textContent =
    currentDate.emoji || "💙";


  dateTitle.textContent =
    currentDate.title;


  dateDescription.textContent =
    currentDate.description;


  dateTags.innerHTML = `
    <span>
      💰 ${currentDate.budget}
    </span>

    <span>
      ⚡ ${currentDate.energy}
    </span>

    <span>
      📍 ${currentDate.location}
    </span>
  `;


  updateDateButtons();
}


/* =========================================
   SAVE / COMPLETE BUTTONS
========================================= */

function updateDateButtons() {

  if (!currentDate) {
    return;
  }


  /* ---------- Save ---------- */

  if (
    isDateSaved(currentDate.id)
  ) {

    saveDateButton.textContent =
      "♥ Saved";

    saveDateButton.classList.add(
      "saved"
    );

  } else {

    saveDateButton.textContent =
      "♡ Save this one";

    saveDateButton.classList.remove(
      "saved"
    );
  }


  /* ---------- Completed ---------- */

  if (
    isDateCompleted(currentDate.id)
  ) {

    completeDateButton.textContent =
      "✓ Completed";

    completeDateButton.classList.add(
      "completed"
    );

  } else {

    completeDateButton.textContent =
      "✓ We did this!";

    completeDateButton.classList.remove(
      "completed"
    );
  }
}


/* =========================================
   BUTTON EVENTS
========================================= */


/* ---------- Generate ---------- */

if (generateDateButton) {

  generateDateButton.addEventListener(
    "click",
    generateDate
  );
}


/* ---------- Reroll ---------- */

if (rerollDateButton) {

  rerollDateButton.addEventListener(
    "click",
    () => {

      rerollCount++;

      if (rerollCount >= 5) {
        unlockAchievement(
          "reroll-addict"
        );
      }

      generateDate();
    }
  );
}


/* ---------- Save ---------- */

if (saveDateButton) {

  saveDateButton.addEventListener(
    "click",
    () => {

      if (!currentDate) {
        return;
      }

      saveDate(
        currentDate.id
      );

      updateDateButtons();
    }
  );
}


/* ---------- Complete ---------- */

if (completeDateButton) {

  completeDateButton.addEventListener(
    "click",
    () => {

      if (!currentDate) {
        return;
      }
      
      if (rerollCount === 0) {
        unlockAchievement("first-date");
      }

      completeDate(
        currentDate.id
      );

      updateDateButtons();
    }
  );
}


/* ---------- Change filters ---------- */

if (changeFiltersButton) {

  changeFiltersButton.addEventListener(
    "click",
    () => {

      dateResult.classList.add(
        "hidden"
      );

      noResults.classList.add(
        "hidden"
      );

      dateSetup.classList.remove(
        "hidden"
      );
      rerollCount = 0;
    }
  );
}