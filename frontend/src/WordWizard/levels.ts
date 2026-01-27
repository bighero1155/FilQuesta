// WordWizardLevels.ts
export interface WordEntry {
  word: string;
  description: string;
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
}

// ========================================
// 🟢 BASIC — 3-Letter Animals (15 items)
// ========================================
const basic3LetterAnimals: WordEntry[] = [
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
// 🔵 NORMAL — 4-Letter Food (15 items)
// ========================================
const normal4LetterFood: WordEntry[] = [
  { word: "RICE", description: "Small white grains that\nare cooked and eaten" },
  { word: "SOUP", description: "A hot liquid meal with\nvegetables or meat" },
  { word: "CAKE", description: "A sweet dessert for\nbirthdays and celebrations" },
  { word: "MILK", description: "A white drink that\ncomes from cows" },
  { word: "MEAT", description: "Food that comes from animals\nlike chicken or beef" },
  { word: "TACO", description: "A Mexican food with a\nfolded shell and filling" },
  { word: "BEEF", description: "Meat that comes\nfrom a cow" },
  { word: "SALT", description: "White crystals that\nmake food taste better" },
  { word: "EGGS", description: "Oval food that \nchickens lay,often eaten\n for breakfast" },
  { word: "NUTS", description: "Hard-shelled seeds like\npeanuts or almonds" },
  { word: "CORN", description: "Yellow vegetable with\nkernels on a cob" },
  { word: "FISH", description: "A water animal that\nwe can eat" },
  { word: "PEAR", description: "A sweet fruit shaped\nlike a light bulb" },
  { word: "PLUM", description: "A small round purple\nor red fruit" },
  { word: "BEAN", description: "A small vegetable seed\nthat grows in pods" }
];

// ========================================
// 🔴 HARD — 5-Letter Places (15 items)
// ========================================
const hard5LetterPlaces: WordEntry[] = [
  { word: "HOUSE", description: "A building where\npeople live" },
  { word: "RIVER", description: "A long flowing body\nof fresh water" },
  { word: "BEACH", description: "Sandy area next to\nthe ocean or sea" },
  { word: "FIELD", description: "A large open area of\ngrass or farmland" },
  { word: "PARKS", description: "Outdoor areas with trees,\ngrass, and playgrounds" },
  { word: "MALLS", description: "Large buildings with\nmany shops inside" },
  { word: "ROADS", description: "Paved paths where cars\nand vehicles travel" },
  { word: "TOWER", description: "A very tall,\nnarrow building" },
  { word: "LANES", description: "Narrow roads or paths\nin a neighborhood" },
  { word: "PLAZA", description: "A public square in\na city or town" },
  { word: "STORE", description: "A shop where you\nbuy things" },
  { word: "COURT", description: "A place where legal\ncases are decided" },
  { word: "HOTEL", description: "A building where travelers\nstay for the night" },
  { word: "VILLA", description: "A large, fancy house\noften in the countryside" },
  { word: "CANAL", description: "A man-made waterway\nfor boats" }
];

// ========================================
// 🟠 ADVANCED — 6-Letter Objects (15 items)
// ========================================
const advanced6LetterObjects: WordEntry[] = [
  { word: "PENCIL", description: "A writing tool with\nlead inside wood" },
  { word: "MARKER", description: "A thick pen with\ncolorful ink" },
  { word: "BOTTLE", description: "A container for holding\nliquids like water" },
  { word: "BASKET", description: "A container made of woven\nmaterial for carrying things" },
  { word: "CAMERA", description: "A device for taking\npictures and photos" },
  { word: "WINDOW", description: "A glass opening in a wall\nthat lets in light" },
  { word: "BUTTON", description: "A small round object used\nto fasten clothes" },
  { word: "CANDLE", description: "A wax stick with a wick\nthat gives light when burned" },
  { word: "SPOONS", description: "Utensils used for eating\nsoup or cereal" },
  { word: "POCKET", description: "A small pouch in clothing\nfor carrying small items" },
  { word: "PILLOW", description: "A soft cushion for\nresting your head" },
  { word: "LADDER", description: "A tool with steps for\nclimbing up high" },
  { word: "HAMMER", description: "A tool for hitting\nnails into wood" },
  { word: "BUCKET", description: "A round container with\na handle for carrying water" },
  { word: "MIRROR", description: "A glass surface that\nshows your reflection" }
];

// ========================================
// 💀 EXPERT — 7-Letter Fantasy (15 items)
// ========================================
const expert7LetterFantasy: WordEntry[] = [
  { word: "DRAGON", description: "A mythical flying creature\nthat breathes fire" },
  { word: "KINGDOM", description: "A land ruled by\na king or queen" },
  { word: "CRYSTAL", description: "A clear, sparkling\nmagical stone or gem" },
  { word: "WIZARD", description: "A magical person\nwho casts spells" },
  { word: "MONSTER", description: "A scary imaginary\ncreature" },
  { word: "SPIRIT", description: "A ghost or magical being\nwithout a body" },
  { word: "PORTAL", description: "A magical doorway\nto another world" },
  { word: "PHOENIX", description: "A mythical bird that\nrises from ashes" },
  { word: "FANTASY", description: "Magical stories with imaginary\ncreatures and worlds" },
  { word: "UNICORN", description: "A magical horse with\na horn on its head" },
  { word: "SORCERY", description: "The practice of\nmagic and spells" },
  { word: "ENCHANT", description: "To put a magical\nspell on something" },
  { word: "MYTHIC", description: "Related to ancient\nlegends and myths" },
  { word: "ANCIENT", description: "Very old, from\nlong ago" },
  { word: "MAGICAL", description: "Having supernatural\npowers or qualities" }
];

// ========================================
// Level Generation - FIXED VERSION
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
    
    // ⭐ FIXED: Each level gets exactly ONE word at its index
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
      words: [word], // ⭐ FIXED: Array with single word
      maxAttempts,
    });
  }
  
  return levels;
}

// Generate all 75 levels (15 per category × 5 categories)
const levels: LevelConfig[] = [
  ...generateCategoryLevels("BASIC", 1, basic3LetterAnimals),           // Levels 1-15
  ...generateCategoryLevels("NORMAL", 16, normal4LetterFood),           // Levels 16-30
  ...generateCategoryLevels("HARD", 31, hard5LetterPlaces),             // Levels 31-45
  ...generateCategoryLevels("ADVANCED", 46, advanced6LetterObjects),    // Levels 46-60
  ...generateCategoryLevels("EXPERT", 61, expert7LetterFantasy),        // Levels 61-75
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