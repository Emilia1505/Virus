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
  id: "mail-reader",
  icon: "✉️",
  title: "You've Got Mail",
  description: "Opened a message from the German girlfriend."
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
  id: "mail-reader",
  icon: "✉️",
  title: "You've Got Mail",
  description: "Opened a message from the German girlfriend."
  },
  {
  id: "nice",
  icon: "😏",
  title: "Uh lala.",
  description: "Attempted to press No exactly 69 times. Prepare for a railing ♋"
},
{
  id: "secret-finder",
  icon: "🕵️‍♀️",
  title: "Detective",
  description: "Found something that was definitely not meant to be found."
},
{
  id: "frequent-transmitter",
  icon: "📡",
  title: "Excellent communicator",
  description: "Sent five transmissions to the developer. I appreciate it, love how engaged you are <3"
},
{
  id: "affection-required",
  icon: "🫂",
  title: "Affection Required",
  description: "Submitted an emergency affection request. I am sorry feel yourself hugged and snogged."
},
{
  id: "message-archaeologist",
  icon: "📂",
  title: "Message Archaeologist",
  description: "Explored the message archive"
},
{
  id: "formal-complaint",
  icon: "📋",
  title: "Formal Complaint",
  description: "Submitted an official girlfriend complaint. Why you do this to me? :((((( what have I done."
},
{
  id: "first-roll",
  icon: "🎲",
  title: "Let Fate Decide",
  description: "Used the activity generator for the first time."
},
{
  id: "first-date",
  icon: "💙",
  title: "No Take-Backsies",
  description: "Accepted the first generated date without rerolling."
},
{
  id: "reroll-addict",
  icon: "🎰",
  title: "Commitment Issues",
  description: "Rerolled five times before accepting an activity."
},
{
  id: "thomas-intervention",
  icon: "🚂",
  title: "Thomas Intervention",
  description: "Experienced an unauthorised railway event."
},
{
  id: "Interrupt",
  icon: "🚆",
  title: "Interrupt Thomas",
  description:
    "Had a transmission interrupted by Thomas. How rude :((("
},
{
  id: "patch-notes-express",
  icon: "🛠️",
  title: "Unscheduled Maintenance",
  description:
    "Observed unauthorised railway activity. chuh chuh. Hope Thomas could molest ya."
},
{
  id: "achievement-inspector",
  icon: "🔎",
  title: "Ticket Inspection",
  description:
    "Had your achievements audited by an entirely unqualified railway employee."
},
{
  id: "date-planner",
  icon: "❤️",
  title: "Noted.",
  description:
    "Saved a date for future relationship operations."
},

{
  id: "conversation-starter",
  icon: "💬",
  title: "We Need To Talk",
  description:
    "Used the conversation generator. Concerning wording, really."
},

{
  id: "emotionally-competent",
  icon: "🧠",
  title: "Emotionally Competent",
  description:
    "Generated ten conversation questions. Communication has occurred."
},
{
  id: "serial-daters",
  icon: "💕",
  title: "Serial Daters",
  description:
    "Completed five generated dates. Disturbingly functional behaviour."
},
{
  id: "completionist",
  icon: "🏆",
  title: "Relationship Side Quests",
  description:
    "Completed ten generated dates."
},
{
id:"date-completed",
icon: "✅",
title: "Completed first generated date",
description: "Hell Yeah, we went on a date :))))"
},
{
  id: "thomas-therapist",
  icon: "🚂",
  title: "Unlicensed Therapist",
  description: "Thomas intercepted the Conversation Department."
},
{
  id: "suspicious-rail-activity",
  icon: "🚂",
  title: "Suspicious Rail Activity",
  description: "Encountered Thomas five times. This can no longer reasonably be considered a coincidence."
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

function getStatistic(key) {
  return Number(localStorage.getItem(key) || 0);
}

function incrementStatistic(key) {
  const newValue = getStatistic(key) + 1;

  localStorage.setItem(key, String(newValue));

  return newValue;
}

function setStatistic(key, value) {
  localStorage.setItem(key, String(value));
}

function addStatistic(key, amount = 1) {
  const newValue = getStatistic(key) + amount;
  setStatistic(key, newValue);
  return newValue;
}