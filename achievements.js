const ACHIEVEMENTS = [
  {
    id: "girlfriend-acquired",
    icon: "💙",
    title: "Girlfriend Acquired",
    description: "Successfully completed the relationship proposal.",
    unlockedByDefault: true
  },
  {
    id: "german-humour",
    icon: "🇩🇪",
    title: "Survived German Humour",
    description: "Demonstrated patience under difficult circumstances.",
    unlockedByDefault: true
  },
  {
    id: "forbidden-button",
    icon: "⚠️",
    title: "Found the Forbidden Button",
    description: "Pressed the button despite being explicitly warned."
  },
  {
    id: "mail-time",
    icon: "📡",
    title: "Mail Time",
    description: "Sent a transmission to the developer."
  },
  {
    id: "train-spotter",
    icon: "🚂",
    title: "Train Spotter",
    description: "Found the tiny train."
  },
  {
    id: "persistent",
    icon: "🏃‍♀️",
    title: "Persistent",
    description: "Attempted to press No at least nine times."
  },
  {
    id: "ear-molesting",
    icon: "👂🏻",
    title: "Survived the ear fingering",
    description: "Wow, your ears are still alive!! Lemme put my fingers in them hehe 👂🏻👈🏻",
    unlockedByDefault: true
  },  
  {
    id: "patch",
    icon: "📝",
    title: "Patch Notes",
    description: "Thank you for reading my patch notes 😘"
  },
  {
    id: "hopeless-romantic",
    icon: "🩷",
    title: "Hopeless Romantic",
    description: "Clicked on the newest message because one read wasn't enough."
  },
  {
    id: "classified",
    icon: "❓",
    title: "???",
    description: "Unlock requirements unknown."
  }
];

function getUnlockedAchievements() {
  const saved = JSON.parse(
    localStorage.getItem("unlockedAchievements") || "[]"
  );

  ACHIEVEMENTS.forEach((achievement) => {
    if (
      achievement.unlockedByDefault &&
      !saved.includes(achievement.id)
    ) {
      saved.push(achievement.id);
    }
  });

  localStorage.setItem(
    "unlockedAchievements",
    JSON.stringify(saved)
  );

  return saved;
}

function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();

  if (!unlocked.includes(id)) {
    unlocked.push(id);

    localStorage.setItem(
      "unlockedAchievements",
      JSON.stringify(unlocked)
    );
  }
}

function isAchievementUnlocked(id) {
  return getUnlockedAchievements().includes(id);
}

