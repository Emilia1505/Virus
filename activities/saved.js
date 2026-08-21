const savedDateList =
  document.getElementById("savedDateList");

const savedEmpty =
  document.getElementById("savedEmpty");


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


/* =========================================
   REMOVE SAVED DATE
========================================= */

function removeSavedDate(id) {

  const saved =
    getSavedDates().filter(
      savedId => savedId !== id
    );

  localStorage.setItem(
    "savedDates",
    JSON.stringify(saved)
  );

  renderSavedDates();
}


/* =========================================
   RENDER
========================================= */

function renderSavedDates() {

  const savedIds =
    getSavedDates();

  const completedIds =
    getCompletedDates();


  savedDateList.innerHTML = "";


  /*
    Find the actual date objects
    matching the saved IDs.
  */

  const savedDates =
    dateIdeas.filter(
      date =>
        savedIds.includes(date.id)
    );


  /* Nothing saved */

  if (savedDates.length === 0) {

    savedEmpty.classList.remove(
      "hidden"
    );

    return;
  }


  savedEmpty.classList.add(
    "hidden"
  );


  /* Create saved date cards */

  savedDates.forEach(date => {

    const completed =
      completedIds.includes(date.id);


    const card =
      document.createElement("article");


    card.className =
      "saved-date-item";


    card.innerHTML = `

      <div class="saved-date-header">

        <span class="saved-date-emoji">
          ${date.emoji || "💙"}
        </span>

        <div>
          <h2>
            ${date.title}
          </h2>

          ${
            completed
              ? `<span class="saved-completed">
                   ✓ Completed
                 </span>`
              : ""
          }
        </div>

      </div>


      <p class="saved-date-description">
        ${date.description}
      </p>


      <div class="date-tags">

        <span>
          💰 ${date.budget}
        </span>

        <span>
          ⚡ ${date.energy}
        </span>

        <span>
          📍 ${date.location}
        </span>

      </div>


      <button
        class="remove-saved-date"
        type="button"
        data-id="${date.id}"
      >
        Remove from saved
      </button>
    `;


    savedDateList.appendChild(
      card
    );
  });


  /* Remove buttons */

  document
    .querySelectorAll(".remove-saved-date")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          removeSavedDate(
            button.dataset.id
          );
        }
      );
    });
}


/* =========================================
   INITIAL LOAD
========================================= */

renderSavedDates();