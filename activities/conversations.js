let selectedCategory = "Any";

const filterButtons =
  document.querySelectorAll(
    ".topic-filters button"
  );

const questionButton =
  document.getElementById("questionButton");

const questionResult =
  document.getElementById("questionResult");

const questionEmoji =
  document.getElementById("questionEmoji");

const questionCategory =
  document.getElementById("questionCategory");

const questionText =
  document.getElementById("questionText");


filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory =
      button.dataset.category;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
  });
});


/* ---------- Thomas Easter egg ---------- */

function maybeThomasConversation() {
  // 8% chance per question.
  if (Math.random() >= 0.08) {
    return false;
  }

  unlockAchievement("thomas-therapist");

  const thomasCount =
    incrementStatistic("thomasEncounters");

  if (thomasCount >= 5) {
    unlockAchievement(
      "suspicious-rail-activity"
    );
  }

  const thomasQuestions = [
    "Thomas would like to know whether you feel emotionally supported by the railway.",
    "Thomas has entered the conversation. Please describe your attachment style using only train terminology.",
    "Thomas wants to know which one of you would survive longest as a railway employee.",
    "Thomas would like each of you to name one thing you appreciate about the other. He is taking notes.",
    "Thomas asks: if your relationship were a train journey, where are you going and who forgot the snacks?"
  ];

  questionEmoji.textContent = "🚂";

  questionCategory.textContent =
    "UNAUTHORISED RAIL ACTIVITY";

  questionText.textContent =
    thomasQuestions[
      Math.floor(
        Math.random() *
        thomasQuestions.length
      )
    ];

  questionResult.classList.remove(
    "hidden"
  );

  questionButton.textContent =
    "🎲 Please remove Thomas";

  return true;
}


/* ---------- Normal question generator ---------- */

questionButton.addEventListener(
  "click",
  () => {

    if (maybeThomasConversation()) {
      return;
    }

    let possibleTopics =
      conversationTopics;

    if (selectedCategory !== "Any") {
      possibleTopics =
        conversationTopics.filter(
          (topic) =>
            topic.category ===
            selectedCategory
        );
    }

    if (possibleTopics.length === 0) {
      questionEmoji.textContent = "🤨";

      questionCategory.textContent =
        "System error";

      questionText.textContent =
        "Apparently we have nothing to talk about. Concerning.";

      questionResult.classList.remove(
        "hidden"
      );

      return;
    }

    const topic =
      possibleTopics[
        Math.floor(
          Math.random() *
          possibleTopics.length
        )
      ];

    questionEmoji.textContent =
      topic.emoji;

    questionCategory.textContent =
      topic.category;

    questionText.textContent =
      topic.question;

    questionResult.classList.remove(
      "hidden"
    );

    questionButton.textContent =
      "🎲 Another question";

    unlockAchievement(
      "conversation-starter"
    );

    const count =
      incrementStatistic(
        "conversationQuestions"
      );

    if (count >= 10) {
      unlockAchievement(
        "emotionally-competent"
      );
    }
  }
);
