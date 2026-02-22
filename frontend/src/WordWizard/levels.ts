// WordWizardLevels.ts
export interface WordEntry {
  word: string;
  description: string;
  choices?: string[]; // Multiple choice options (correct answer must be included)
}

export interface LevelConfig {
  id: number;
  categoryId: string;
  levelInCategory: number;
  title: string;
  time: number;
  scorePerWord: number;
  words: WordEntry[];
  maxAttempts: number;
  mode?: "drag" | "type" | "multiple_choice"; // Optional override
}

// ========================================
// 🟢 BASIC — 3-Letter Animals (15 items)
// ========================================
const basicSpelling: WordEntry[] = [
  { word: "CAT", description: "A small furry pet\nthat meows and purrs" },
  { word: "DOG", description: "A friendly pet that barks\nand wags its tail" },
  { word: "FOX", description: "A wild animal with orange fur\nand a bushy tail" },
  { word: "ANT", description: "A tiny insect\nthat works in groups" },
  { word: "BEE", description: "A flying insect\nthat makes honey" },
  { word: "COW", description: "A large farm animal\nthat gives us milk" },
  { word: "PIG", description: "A pink farm animal\nthat oinks" },
  { word: "HEN", description: "A female chicken\nthat lays eggs" },
  { word: "BAT", description: "A flying animal that\ncomes out at night" },
  { word: "RAT", description: "A small rodent\nwith a long tail" },
  { word: "OWL", description: "A bird that hunts\nat night and hoots" },
  { word: "EEL", description: "A long, snake-like fish\nthat lives in water" },
  { word: "EMU", description: "A large bird from Australia\nthat cannot fly" },
  { word: "YAK", description: "A large hairy animal\nfrom mountains" },
  { word: "APE", description: "A large primate like\na gorilla or chimp" }
];

// ========================================
// 🔵 NORMAL — Grammar Fill-in-the-Blank (15 items)
// Spell the missing word to complete the sentence!
// ========================================
const normalGrammar: WordEntry[] = [
  { word: "IS",      description: "She ___ happy.\nSpell the missing word!" },
  { word: "ARE",     description: "They ___ playing.\nSpell the missing word!" },
  { word: "GOES",    description: "He ___ to school.\nSpell the missing word!" },
  { word: "READ",    description: "I ___ a book.\nSpell the missing word!" },
  { word: "WERE",    description: "We ___ late.\nSpell the missing word!" },
  { word: "HAS",     description: "She ___ a cat.\nSpell the missing word!" },
  { word: "LIKES",   description: "He ___ milk.\nSpell the missing word!" },
  { word: "ARE",     description: "They ___ home.\nSpell the missing word!" },
  { word: "AM",      description: "I ___ tired.\nSpell the missing word!" },
  { word: "RUNS",    description: "The dog ___ fast.\nSpell the missing word!" },
  { word: "WENT",    description: "She ___ yesterday.\nSpell the missing word!" },
  { word: "WATCHED", description: "We ___ a movie.\nSpell the missing word!" },
  { word: "IS",      description: "He ___ not here.\nSpell the missing word!" },
  { word: "EAT",     description: "They ___ food.\nSpell the missing word!" },
  { word: "DID",     description: "I ___ my homework.\nSpell the missing word!" },
];

// ========================================
// 🔴 HARD — Vocabulary Fill-in-the-Blank (15 items)
// Spell the word that matches the meaning!
// ========================================
const hardVocabulary: WordEntry[] = [
  { word: "HUGE",  description: "Big means ___.\nSpell the missing word!" },
  { word: "FAST",  description: "Quick means ___.\nSpell the missing word!" },
  { word: "GLAD",  description: "Happy means ___.\nSpell the missing word!" },
  { word: "WARM",  description: "Cold is the opposite of ___.\nSpell the missing word!" },
  { word: "TINY",  description: "Small means ___.\nSpell the missing word!" },
  { word: "ANGRY", description: "Mad means ___.\nSpell the missing word!" },
  { word: "BEGIN", description: "Start means ___.\nSpell the missing word!" },
  { word: "PLAIN", description: "Simple means ___.\nSpell the missing word!" },
  { word: "RICH",  description: "Wealthy means ___.\nSpell the missing word!" },
  { word: "QUIET", description: "Silent means ___.\nSpell the missing word!" },
  { word: "BRAVE", description: "Fearless means ___.\nSpell the missing word!" },
  { word: "OLDER", description: "Aged means ___.\nSpell the missing word!" },
  { word: "NEAT",  description: "Tidy means ___.\nSpell the missing word!" },
  { word: "BUY",   description: "Purchase means ___.\nSpell the missing word!" },
  { word: "SMART", description: "Clever means ___.\nSpell the missing word!" },
];

// ========================================
// 🟠 ADVANCED — Punctuation Multiple Choice (15 items)
// Tap the correct sentence!
// ========================================
const advancedPunctuation: WordEntry[] = [
  {
    word: "Hello.",
    description: "A greeting that ends\nwith a period. Pick it!",
    choices: ["Hello", "Hello.", "Hello!"],
  },
  {
    word: "How are you?",
    description: "You are asking someone\na question. Pick it!",
    choices: ["How are you.", "How are you?", "How are you!"],
  },
  {
    word: "It's raining.",
    description: "\"It is\" shortened uses\nan apostrophe. Pick it!",
    choices: ["Its raining.", "It is raining", "It's raining."],
  },
  {
    word: "I like apples, oranges, and bananas.",
    description: "A list of 3 things\nneeds commas. Pick it!",
    choices: ["I like apples oranges and bananas.", "I like apples, oranges, and bananas.", "I like apples; oranges; and bananas."],
  },
  {
    word: "Stop!",
    description: "A strong command\nneeds an exclamation mark. Pick it!",
    choices: ["Stop?", "Stop.", "Stop!"],
  },
  {
    word: 'She said, "Hi."',
    description: "Speech marks go around\nwhat someone says. Pick it!",
    choices: ['She said "Hi"', 'She said "Hi".', 'She said, "Hi."'],
  },
  {
    word: "Let's eat, grandma.",
    description: "A comma after \"eat\"\nmeans we are calling grandma. Pick it!",
    choices: ["Lets eat grandma.", "Let's eat, grandma.", "Let's eat grandma."],
  },
  {
    word: "Yes, I agree.",
    description: "\"Yes\" at the start\nneeds a comma after it. Pick it!",
    choices: ["Yes I agree.", "Yes, I agree.", "Yes I agree"],
  },
  {
    word: "What time is it?",
    description: "You are asking\nfor the time. Pick it!",
    choices: ["What time is it!", "What time is it.", "What time is it?"],
  },
  {
    word: "That's my book.",
    description: "\"That is\" shortened\nneeds an apostrophe. Pick it!",
    choices: ["Thats my book.", "That is my book", "That's my book."],
  },
  {
    word: "It is cold today.",
    description: "A plain statement of fact\nends with a period. Pick it!",
    choices: ["It is cold today", "It is cold today!", "It is cold today."],
  },
  {
    word: "Wait!",
    description: "An urgent command\nneeds an exclamation mark. Pick it!",
    choices: ["Wait?", "Wait.", "Wait!"],
  },
  {
    word: "He ran fast; he won.",
    description: "A semicolon joins two\nrelated sentences. Pick it!",
    choices: ["He ran fast he won.", "He ran fast, he won.", "He ran fast; he won."],
  },
  {
    word: "I'm ready.",
    description: "\"I am\" shortened\nneeds an apostrophe. Pick it!",
    choices: ["Im ready.", "I am ready", "I'm ready."],
  },
  {
    word: "We won, didn't we?",
    description: "A tag question checks\nif someone agrees. Pick it!",
    choices: ["We won didnt we?", "We won didn't we.", "We won, didn't we?"],
  },
];

// ========================================
// 💀 EXPERT — Comprehension Drag & Drop (15 items)
// Read the passage, drag the correct answer to the box!
// 3 yellow tile choices — only 1 is correct!
// ========================================
const expertComprehension: WordEntry[] = [
  {
    word: "TOM",
    description: "Tom woke up early\nand went to school.\nWho woke up early?",
    choices: ["SAM", "TOM", "JACK"],
  },
  {
    word: "SCHOOL",
    description: "Tom woke up early\nand went to school.\nWhere did Tom go?",
    choices: ["HOME", "PARK", "SCHOOL"],
  },
  {
    word: "RAIN",
    description: "It was raining, so\nwe stayed inside.\nWhy did we stay inside?",
    choices: ["WIND", "SUN", "RAIN"],
  },
  {
    word: "RAINY",
    description: "It was raining, so\nwe stayed inside.\nWhat was the weather?",
    choices: ["SUNNY", "CLOUDY", "RAINY"],
  },
  {
    word: "SARA",
    description: "Sara studied hard because\nshe wanted to pass.\nWho studied hard?",
    choices: ["ANNA", "SARA", "EMMA"],
  },
  {
    word: "PASS",
    description: "Sara studied hard because\nshe wanted to pass.\nWhy did she study?",
    choices: ["SLEEP", "PLAY", "PASS"],
  },
  {
    word: "YES",
    description: "Although he was tired,\nhe finished his work.\nWas he tired?",
    choices: ["MAYBE", "NO", "YES"],
  },
  {
    word: "DOG",
    description: "The dog barked loudly\nwhen the door opened.\nWhat barked?",
    choices: ["CAT", "BIRD", "DOG"],
  },
  {
    word: "APPLES",
    description: "Lisa likes apples more\nthan oranges.\nWhat does Lisa like more?",
    choices: ["ORANGES", "APPLES", "BANANAS"],
  },
  {
    word: "NO",
    description: "The movie was long\nbut interesting.\nWas the movie boring?",
    choices: ["YES", "MAYBE", "NO"],
  },
  {
    word: "BUS",
    description: "Jack missed the bus,\nso he was late.\nWhat did Jack miss?",
    choices: ["TAXI", "TRAIN", "BUS"],
  },
  {
    word: "CAUSE",
    description: "Jack missed the bus,\nso he was late.\nThe word 'so' shows:",
    choices: ["TIME", "PLACE", "CAUSE"],
  },
  {
    word: "HOME",
    description: "If it rains, we\nwill stay home.\nWhat happens if it rains?",
    choices: ["GO OUT", "TRAVEL", "HOME"],
  },
  {
    word: "EMMA",
    description: "Emma smiled because\nshe was happy.\nWho smiled?",
    choices: ["LILY", "SARA", "EMMA"],
  },
  {
    word: "HAPPY",
    description: "Emma smiled because\nshe was happy.\nWhy did she smile?",
    choices: ["SAD", "ANGRY", "HAPPY"],
  },
];

// ========================================
// Level Generation
// ========================================

// Generate levels for a category - each level gets ONE word
function generateCategoryLevels(
  categoryId: string,
  startId: number,
  allWords: WordEntry[]
): LevelConfig[] {
  const levels: LevelConfig[] = [];

  for (let i = 1; i <= 15; i++) {
    const globalId = startId + i - 1;

    // Each level gets exactly ONE word at its index
    const wordIndex = i - 1; // Level 1 gets word 0, Level 2 gets word 1, etc.
    const word = allWords[wordIndex];

    let title: string;
    let time: number;
    let scorePerWord: number;
    let maxAttempts: number;

    if (i <= 5) {
      // Levels 1-5: Normal gameplay
      title = `${categoryId} ${i} – ${word.word}`;
      time = 90 - (i - 1) * 5;
      scorePerWord = 10 + (i - 1) * 2;
      maxAttempts = 8 - (i - 1);
    } else if (i <= 10) {
      // Levels 6-10: Medium Challenge
      title = `${categoryId} ${i} – Medium Challenge`;
      time = 80 - (i - 6) * 5;
      scorePerWord = 20 + (i - 6) * 2;
      maxAttempts = 7 - (i - 6);
    } else {
      // Levels 11-15: Expert Mode
      title = `${categoryId} ${i} – Expert Mode`;
      time = 70 - (i - 11) * 4;
      scorePerWord = 30 + (i - 11) * 3;
      maxAttempts = 6 - (i - 11);
    }

    levels.push({
      id: globalId,
      categoryId,
      levelInCategory: i,
      title,
      time,
      scorePerWord,
      words: [word], // Array with single word
      maxAttempts,
    });
  }

  return levels;
}

// Generate all 75 levels (15 per category × 5 categories)
const levels: LevelConfig[] = [
  ...generateCategoryLevels("BASIC", 1, basicSpelling),        // Levels 1-15
  ...generateCategoryLevels("NORMAL", 16, normalGrammar),            // Levels 16-30
  ...generateCategoryLevels("HARD", 31, hardVocabulary),          // Levels 31-45
  ...generateCategoryLevels("ADVANCED", 46, advancedPunctuation), // Levels 46-60
  ...generateCategoryLevels("EXPERT", 61, expertComprehension),     // Levels 61-75
];

export default levels;

// Helper function to get a level by ID
export function getLevelConfig(levelId: number): LevelConfig {
  return levels.find((l) => l.id === levelId) || levels[0];
}

// Helper function to get levels by category
export function getLevelsByCategory(categoryId: string): LevelConfig[] {
  return levels.filter((l) => l.categoryId === categoryId);
}

// Helper function to get a level by category and level number
export function getLevelByCategory(categoryId: string, levelInCategory: number): LevelConfig | undefined {
  return levels.find((l) => l.categoryId === categoryId && l.levelInCategory === levelInCategory);
}

// Helper function to get all words needed for a level
export function getRequiredWords(levelConfig: LevelConfig): WordEntry[] {
  return levelConfig.words;
}

// ========================================
// 🔵 NORMAL — Decoy Letter Generator
// Use this helper to generate shuffled tiles
// for grammar levels (answer letters + decoys)
// ========================================

/**
 * Generates a shuffled array of letters for a grammar level tile set.
 * Includes all letters of the correct answer plus decoy letters.
 *
 * @param answer   - The correct answer word (e.g. "GOES")
 * @param decoyCount - How many extra fake letters to add (default: 3)
 * @returns Shuffled array of letters (answer + decoys)
 *
 * @example
 * generateGrammarTiles("IS")    → ["A", "S", "R", "I", "E", "O"] (shuffled)
 * generateGrammarTiles("GOES")  → ["G", "X", "O", "E", "S", "T", "A"] (shuffled)
 */
export function generateGrammarTiles(answer: string, decoyCount = 3): string[] {
  // Common decoy letters pool — avoid letters already in the answer
  const decoyPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(
    (l) => !answer.includes(l)
  );

  // Pick random decoys
  const decoys: string[] = [];
  const shuffledPool = Phaser_shuffle(decoyPool);
  for (let i = 0; i < decoyCount && i < shuffledPool.length; i++) {
    decoys.push(shuffledPool[i]);
  }

  // Combine answer letters + decoys and shuffle
  const allLetters = [...answer.split(""), ...decoys];
  return Phaser_shuffle(allLetters);
}

/** Simple Fisher-Yates shuffle (no Phaser dependency) */
function Phaser_shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}