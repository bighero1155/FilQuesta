// HumanBodyLevels.ts
export interface PartConfig {
  name: string;
  assetKey: string;
  scale: number;
  x: number; // Desktop X offset from center
  y: number; // Desktop Y offset from center
  mobileX: number; // Mobile X offset from center
  mobileY: number; // Mobile Y offset from center
  description: string;
  imagePath: string;
  // ── Astronomy / Orbit fields (optional) ──
  isCenter?: boolean;         // True for the anchor body (Sun, Jupiter, Saturn)
  orbitRadius?: number;       // Desktop orbit radius in px
  mobileOrbitRadius?: number; // Mobile orbit radius in px
  orbitStartAngle?: number;   // Starting angle in degrees
  // ── Life Cycle fields (optional) ──
  cycleOrder?: number;        // 1–5 correct sequence position in the life cycle
}

export interface LevelConfig {
  id: number;
  categoryId: string;
  levelInCategory: number;
  title: string;
  time: number;
  snapRadius: number;
  scorePerPart: number;
  parts: PartConfig[];
  backgroundImage: string;
  // ── Astronomy-specific (optional) ──
  orbitSpeed?: number; // deg/sec, negative = counter-clockwise
  // ── Life cycle-specific (optional) ──
  isLifecycle?: boolean; // True for EXPERT life cycle levels — draws circular arrows
}

// ========================================
// 🟢 BASIC — Food Groups (15 items)
// ========================================
const basicFoods: PartConfig[] = [
  // ── GROW tier ──
  {
    name: "Egg",
    assetKey: "egg", scale: 0.25,
    x: 0, y: -190, mobileX: 0, mobileY: -100,
    description: "A protein-rich food that helps build muscles and repair body tissues.",
    imagePath: "/assets/egg.png"
  },
  {
    name: "Milk",
    assetKey: "milk", scale: 0.25,
    x: -55, y: -135, mobileX: -35, mobileY: -60,
    description: "A dairy drink rich in calcium that strengthens bones and teeth.",
    imagePath: "/assets/milk.png"
  },
  {
    name: "Chicken",
    assetKey: "chicken", scale: 0.25,
    x: 55, y: -135, mobileX: 35, mobileY: -60,
    description: "A lean meat that provides protein for growth and body repair.",
    imagePath: "/assets/chicken.png"
  },
  // ── GLOW tier ──
  {
    name: "Carrot",
    assetKey: "carrot", scale: 0.25,
    x: -150, y: 10, mobileX: -70, mobileY: 10,
    description: "A vegetable rich in vitamin A that keeps eyes and skin healthy.",
    imagePath: "/assets/carrot.png"
  },
  {
    name: "Apple",
    assetKey: "apple", scale: 0.25,
    x: -80, y: 10, mobileX: -30, mobileY: 10,
    description: "A fruit packed with vitamins and fiber that boosts the immune system.",
    imagePath: "/assets/apple.png"
  },
  {
    name: "Spinach",
    assetKey: "spinach", scale: 0.25,
    x: 110, y: 10, mobileX: -10, mobileY: 10,
    description: "A leafy vegetable rich in iron and vitamins for healthy blood.",
    imagePath: "/assets/spinach.png"
  },
  {
    name: "Orange",
    assetKey: "orange", scale: 0.25,
    x: -100, y: 10, mobileX: 30, mobileY: 10,
    description: "A citrus fruit high in vitamin C that strengthens the immune system.",
    imagePath: "/assets/orange.png"
  },
  {
    name: "Banana",
    assetKey: "banana", scale: 0.25,
    x: -30, y: 10, mobileX: -70, mobileY: 10,
    description: "A fruit that provides quick energy and is rich in potassium.",
    imagePath: "/assets/banana.png"
  },
  {
    name: "Broccoli",
    assetKey: "broccoli", scale: 0.25,
    x: 40, y: 10, mobileX: 70, mobileY: 10,
    description: "A vegetable packed with vitamins C and K for a strong body.",
    imagePath: "/assets/broccoli.png"
  },
  // ── GO tier ──
  {
    name: "Rice",
    assetKey: "rice", scale: 0.25,
    x: -200, y: 160, mobileX: -109, mobileY: 80,
    description: "A staple grain that gives the body energy to move and think.",
    imagePath: "/assets/rice.png"
  },
  {
    name: "Bread",
    assetKey: "bread", scale: 0.25,
    x: -180, y: 160, mobileX: -65, mobileY: 80,
    description: "A baked grain food that provides carbohydrates for daily energy.",
    imagePath: "/assets/bread.png"
  },
  {
    name: "Corn",
    assetKey: "corn", scale: 0.25,
    x: -100, y: 160, mobileX: -22, mobileY: 80,
    description: "A grain vegetable that fuels the body with carbohydrates and fiber.",
    imagePath: "/assets/corn.png"
  },
  {
    name: "Pasta",
    assetKey: "pasta", scale: 0.25,
    x: -20, y: 160, mobileX: 22, mobileY: 80,
    description: "A wheat-based food rich in carbohydrates that provides lasting energy.",
    imagePath: "/assets/pasta.png"
  },
  {
    name: "Sweet Potato",
    assetKey: "sweet_potato", scale: 0.25,
    x: 60, y: 160, mobileX: 65, mobileY: 80,
    description: "A root vegetable packed with carbohydrates and vitamins for energy.",
    imagePath: "/assets/sweet_potato.png"
  },
  {
    name: "Oats",
    assetKey: "oats", scale: 0.25,
    x: 140, y: 160, mobileX: 109, mobileY: 80,
    description: "A whole grain that provides slow-releasing energy to keep you full.",
    imagePath: "/assets/oats.png"
  },
];

// ========================================
// 🔵 NORMAL — Body Parts (15 items)
// ========================================
const normalBodyParts: PartConfig[] = [
  {
    name: "Eyes", assetKey: "eyes", scale: 0.3,
    x: 0, y: -320, mobileX: 0, mobileY: -200,
    description: "Allow vision and light perception.", imagePath: "/assets/eyes.png"
  },
  {
    name: "Nails", assetKey: "nails", scale: 0.15,
    x: -200, y: -20, mobileX: -75, mobileY: -35,
    description: "Protect fingertips and toes.", imagePath: "/assets/nails.png"
  },
  {
    name: "Ears", assetKey: "ears", scale: 0.2,
    x: 50, y: -310, mobileX: 0, mobileY: -140,
    description: "Enable hearing and balance.", imagePath: "/assets/ears.png"
  },
  {
    name: "Feet", assetKey: "feet", scale: 0.25,
    x: -80, y: 330, mobileX: 0, mobileY: 80,
    description: "Support body weight and enable movement.", imagePath: "/assets/feet.png"
  },
  {
    name: "Toes", assetKey: "toes", scale: 0.18,
    x: 80, y: 330, mobileX: 0, mobileY: 95,
    description: "Help with balance and walking.", imagePath: "/assets/toes.png"
  },
  {
    name: "Nose", assetKey: "nose", scale: 0.25,
    x: 0, y: -330, mobileX: 0, mobileY: -170,
    description: "Detects smells and filters air.", imagePath: "/assets/nose.png"
  },
  {
    name: "Mouth", assetKey: "mouth", scale: 0.3,
    x: 0, y: -280, mobileX: 0, mobileY: -110,
    description: "For eating, speaking, and breathing.", imagePath: "/assets/mouth.png"
  },
  {
    name: "Hands", assetKey: "hands", scale: 0.25,
    x: -180, y: -10, mobileX: -60, mobileY: -50,
    description: "Manipulate objects and sense touch.", imagePath: "/assets/hands.png"
  },
  {
    name: "Fingers", assetKey: "fingers", scale: 0.2,
    x: 180, y: -10, mobileX: -70, mobileY: -40,
    description: "Provide fine motor control.", imagePath: "/assets/fingers.png"
  },
  {
    name: "Arms", assetKey: "arms", scale: 0.25,
    x: -140, y: -130, mobileX: -55, mobileY: -70,
    description: "Connect shoulders to hands.", imagePath: "/assets/arms.png"
  },
  {
    name: "Teeth", assetKey: "teeth", scale: 0.25,
    x: 0, y: -300, mobileX: 0, mobileY: -115,
    description: "Break down food by chewing.", imagePath: "/assets/teeth.png"
  },
  {
    name: "Tongue", assetKey: "tongue", scale: 0.22,
    x: 0, y: -270, mobileX: 0, mobileY: -105,
    description: "Tastes food and helps with speech.", imagePath: "/assets/tongue.png"
  },
  {
    name: "Legs", assetKey: "legs", scale: 0.25,
    x: 0, y: 50, mobileX: 0, mobileY: 40,
    description: "Support body and enable walking.", imagePath: "/assets/legs.png"
  },
  {
    name: "Skin", assetKey: "skin", scale: 0.2,
    x: 0, y: -100, mobileX: 0, mobileY: 0,
    description: "Protects the body and regulates temperature.", imagePath: "/assets/skin.png"
  },
  {
    name: "Hair", assetKey: "hair", scale: 0.25,
    x: 0, y: -360, mobileX: 0, mobileY: -230,
    description: "Protects scalp and regulates temperature.", imagePath: "/assets/hair.png"
  },
];

// ========================================
// 🔴 HARD — Astronomy / Solar System
// Orbit-based gameplay, counter-clockwise moving targets
// 3 sets of 5: Sun system → Jupiter system → Saturn system
// ========================================

// ── Set 1: Sun + inner planets ──────────
const astronomySunParts: PartConfig[] = [
  {
    name: "Sun",
    assetKey: "sun", scale: 0.55,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Our star at the center of the solar system.",
    imagePath: "/assets/sun.png",
    isCenter: true,
  },
  {
    name: "Mercury",
    assetKey: "mercury", scale: 0.22,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Closest planet to the Sun.",
    imagePath: "/assets/mercury.png",
    orbitRadius: 110, mobileOrbitRadius: 70, orbitStartAngle: 0,
  },
  {
    name: "Venus",
    assetKey: "venus", scale: 0.26,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Hottest planet in the solar system.",
    imagePath: "/assets/venus.png",
    orbitRadius: 160, mobileOrbitRadius: 100, orbitStartAngle: 90,
  },
  {
    name: "Earth",
    assetKey: "earth", scale: 0.26,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Our home planet.",
    imagePath: "/assets/earth.png",
    orbitRadius: 210, mobileOrbitRadius: 130, orbitStartAngle: 180,
  },
  {
    name: "Mars",
    assetKey: "mars", scale: 0.24,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "The Red Planet.",
    imagePath: "/assets/mars.png",
    orbitRadius: 260, mobileOrbitRadius: 160, orbitStartAngle: 270,
  },
];

// ── Set 2: Jupiter + Galilean moons ─────
const astronomyJupiterParts: PartConfig[] = [
  {
    name: "Jupiter",
    assetKey: "jupiter", scale: 0.5,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Largest planet in our solar system.",
    imagePath: "/assets/jupiter.png",
    isCenter: true,
  },
  {
    name: "Io",
    assetKey: "io", scale: 0.2,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Most volcanically active moon in the solar system.",
    imagePath: "/assets/io.png",
    orbitRadius: 110, mobileOrbitRadius: 70, orbitStartAngle: 0,
  },
  {
    name: "Europa",
    assetKey: "europa", scale: 0.2,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Icy moon possibly hiding a subsurface ocean.",
    imagePath: "/assets/europa.png",
    orbitRadius: 160, mobileOrbitRadius: 100, orbitStartAngle: 90,
  },
  {
    name: "Ganymede",
    assetKey: "ganymede", scale: 0.22,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Largest moon in the solar system.",
    imagePath: "/assets/ganymede.png",
    orbitRadius: 210, mobileOrbitRadius: 130, orbitStartAngle: 180,
  },
  {
    name: "Callisto",
    assetKey: "callisto", scale: 0.22,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Most cratered object in the solar system.",
    imagePath: "/assets/callisto.png",
    orbitRadius: 260, mobileOrbitRadius: 160, orbitStartAngle: 270,
  },
];

// ── Set 3: Saturn + moons ────────────────
const astronomySaturnParts: PartConfig[] = [
  {
    name: "Saturn",
    assetKey: "saturn", scale: 0.5,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Known for its stunning ring system.",
    imagePath: "/assets/saturn.png",
    isCenter: true,
  },
  {
    name: "Titan",
    assetKey: "titan", scale: 0.22,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Saturn's largest moon with a thick atmosphere.",
    imagePath: "/assets/titan.png",
    orbitRadius: 110, mobileOrbitRadius: 70, orbitStartAngle: 0,
  },
  {
    name: "Enceladus",
    assetKey: "enceladus", scale: 0.18,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Shoots water geysers from its south pole.",
    imagePath: "/assets/enceladus.png",
    orbitRadius: 160, mobileOrbitRadius: 100, orbitStartAngle: 90,
  },
  {
    name: "Mimas",
    assetKey: "mimas", scale: 0.18,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Resembles the Death Star with its huge crater.",
    imagePath: "/assets/mimas.png",
    orbitRadius: 210, mobileOrbitRadius: 130, orbitStartAngle: 180,
  },
  {
    name: "Rhea",
    assetKey: "rhea", scale: 0.2,
    x: 0, y: 0, mobileX: 0, mobileY: 0,
    description: "Saturn's second-largest moon.",
    imagePath: "/assets/rhea.png",
    orbitRadius: 260, mobileOrbitRadius: 160, orbitStartAngle: 270,
  },
];

// ========================================
// 🟠 ADVANCED — Habitat Sorting (15 animals)
// Background: habitat.png (SKY top / LAND middle / WATER bottom)
// x / y are offsets from scene center to the correct snap zone.
// SKY   zone center ≈ y -290 (desktop) / -185 (mobile)
// LAND  zone center ≈ y  -60 (desktop) /  -35 (mobile)
// WATER zone center ≈ y  200 (desktop) /  130 (mobile)
// 5 animals per zone, spread across x so they don't overlap.
// ========================================

// ── SKY animals (5) ──
const skyAnimals: PartConfig[] = [
  {
    name: "Eagle",
    assetKey: "eagle", scale: 0.28,
    x: -180, y: -290, mobileX: -110, mobileY: -185,
    description: "A powerful bird of prey that soars high in the sky.",
    imagePath: "/assets/eagle.png",
  },
  {
    name: "Parrot",
    assetKey: "parrot", scale: 0.26,
    x: -90, y: -290, mobileX: -55, mobileY: -185,
    description: "A colorful bird known for its ability to mimic sounds.",
    imagePath: "/assets/parrot.png",
  },
  {
    name: "Butterfly",
    assetKey: "butterfly", scale: 0.26,
    x: 0, y: -290, mobileX: 0, mobileY: -185,
    description: "A winged insect that flutters through the air.",
    imagePath: "/assets/butterfly.png",
  },
  {
    name: "Bat",
    assetKey: "bat", scale: 0.26,
    x: 90, y: -290, mobileX: 55, mobileY: -185,
    description: "A flying mammal that navigates using echolocation.",
    imagePath: "/assets/bat.png",
  },
  {
    name: "Owl",
    assetKey: "owl", scale: 0.26,
    x: 180, y: -290, mobileX: 110, mobileY: -185,
    description: "A nocturnal bird with excellent night vision.",
    imagePath: "/assets/owl.png",
  },
];

// ── LAND animals (5) ──
const landAnimals: PartConfig[] = [
  {
    name: "Lion",
    assetKey: "lion", scale: 0.28,
    x: -180, y: -60, mobileX: -110, mobileY: -35,
    description: "The king of the savanna, a powerful land predator.",
    imagePath: "/assets/lion.png",
  },
  {
    name: "Elephant",
    assetKey: "elephant", scale: 0.28,
    x: -90, y: -60, mobileX: -55, mobileY: -35,
    description: "The largest land animal on Earth.",
    imagePath: "/assets/elephant.png",
  },
  {
    name: "Snake",
    assetKey: "snake", scale: 0.26,
    x: 0, y: -60, mobileX: 0, mobileY: -35,
    description: "A reptile that slithers along the ground.",
    imagePath: "/assets/snake.png",
  },
  {
    name: "Rabbit",
    assetKey: "rabbit", scale: 0.26,
    x: 90, y: -60, mobileX: 55, mobileY: -35,
    description: "A small, fast mammal that lives in burrows.",
    imagePath: "/assets/rabbit.png",
  },
  {
    name: "Tiger",
    assetKey: "tiger", scale: 0.28,
    x: 180, y: -60, mobileX: 110, mobileY: -35,
    description: "A striped big cat that hunts in forests and grasslands.",
    imagePath: "/assets/tiger.png",
  },
];

// ── WATER animals (5) ──
const waterAnimals: PartConfig[] = [
  {
    name: "Shark",
    assetKey: "shark", scale: 0.28,
    x: -180, y: 200, mobileX: -110, mobileY: 130,
    description: "A fierce ocean predator with rows of sharp teeth.",
    imagePath: "/assets/shark.png",
  },
  {
    name: "Dolphin",
    assetKey: "dolphin", scale: 0.28,
    x: -90, y: 200, mobileX: -55, mobileY: 130,
    description: "An intelligent marine mammal known for its playfulness.",
    imagePath: "/assets/dolphin.png",
  },
  {
    name: "Clownfish",
    assetKey: "clownfish", scale: 0.26,
    x: 0, y: 200, mobileX: 0, mobileY: 130,
    description: "A small, brightly colored fish that lives among sea anemones.",
    imagePath: "/assets/clownfish.png",
  },
  {
    name: "Crab",
    assetKey: "crab", scale: 0.26,
    x: 90, y: 200, mobileX: 55, mobileY: 130,
    description: "A crustacean that walks sideways along the ocean floor.",
    imagePath: "/assets/crab.png",
  },
  {
    name: "Turtle",
    assetKey: "turtle", scale: 0.26,
    x: 180, y: 200, mobileX: 110, mobileY: 130,
    description: "A shelled reptile that swims gracefully in the sea.",
    imagePath: "/assets/turtle.png",
  },
];

// Flat array: SKY first, then LAND, then WATER
// generateCategoryLevels slices in batches of 5, so:
// Batch 0 (levels 1–5)  → skyAnimals
// Batch 1 (levels 6–10) → landAnimals
// Batch 2 (levels 11–15)→ waterAnimals
const advancedHabitat: PartConfig[] = [
  ...skyAnimals,
  ...landAnimals,
  ...waterAnimals,
];

// ========================================
// 💀 EXPERT — Life Cycle Ordering (15 stages)
// 3 life cycles × 5 stages each, arranged in a circle.
// Snap targets sit on a circle around scene center.
// Arrows are drawn between them in the scene.
//
// Circle math (clockwise from top, radius 200px desktop / 130px mobile):
//   Stage 1 (top):          angle -90°  →  x=0,    y=-200
//   Stage 2 (top-right):    angle  -18° →  x=190,  y=-62
//   Stage 3 (bottom-right): angle   54° →  x=118,  y=162
//   Stage 4 (bottom-left):  angle  126° →  x=-118, y=162
//   Stage 5 (top-left):     angle  198° →  x=-190, y=-62
// Mobile radius 130px — same angles, scaled ~0.65
// ========================================

// ── 🐸 Frog Life Cycle ──────────────────
const frogCycle: PartConfig[] = [
  {
    name: "Egg",
    assetKey: "frog_egg", scale: 0.26,
    x: 0,    y: -200, mobileX: 0,    mobileY: -130,
    description: "Frog eggs laid in clusters in still water.",
    imagePath: "/assets/frog_egg.png",
    cycleOrder: 1,
  },
  {
    name: "Tadpole",
    assetKey: "tadpole", scale: 0.26,
    x: 190,  y: -62,  mobileX: 124,  mobileY: -40,
    description: "A legless larva that swims and breathes through gills.",
    imagePath: "/assets/tadpole.png",
    cycleOrder: 2,
  },
  {
    name: "Tadpole with Legs",
    assetKey: "tadpole_legs", scale: 0.26,
    x: 118,  y: 162,  mobileX: 77,   mobileY: 105,
    description: "A tadpole that has grown hind legs and is changing shape.",
    imagePath: "/assets/tadpole_legs.png",
    cycleOrder: 3,
  },
  {
    name: "Froglet",
    assetKey: "froglet", scale: 0.26,
    x: -118, y: 162,  mobileX: -77,  mobileY: 105,
    description: "A young frog that still has a small tail.",
    imagePath: "/assets/froglet.png",
    cycleOrder: 4,
  },
  {
    name: "Adult Frog",
    assetKey: "adult_frog", scale: 0.28,
    x: -190, y: -62,  mobileX: -124, mobileY: -40,
    description: "A fully grown frog that can live on land and in water.",
    imagePath: "/assets/adult_frog.png",
    cycleOrder: 5,
  },
];

// ── 🦋 Butterfly Life Cycle ─────────────
const butterflyCycle: PartConfig[] = [
  {
    name: "Egg",
    assetKey: "butterfly_egg", scale: 0.24,
    x: 0,    y: -200, mobileX: 0,    mobileY: -130,
    description: "Tiny eggs laid on the underside of leaves.",
    imagePath: "/assets/butterfly_egg.png",
    cycleOrder: 1,
  },
  {
    name: "Caterpillar",
    assetKey: "caterpillar", scale: 0.28,
    x: 190,  y: -62,  mobileX: 124,  mobileY: -40,
    description: "A larva that eats leaves and grows rapidly.",
    imagePath: "/assets/caterpillar.png",
    cycleOrder: 2,
  },
  {
    name: "Pupa (Chrysalis)",
    assetKey: "chrysalis", scale: 0.26,
    x: 118,  y: 162,  mobileX: 77,   mobileY: 105,
    description: "A protective case where the caterpillar transforms.",
    imagePath: "/assets/chrysalis.png",
    cycleOrder: 3,
  },
  {
    name: "Emerging Butterfly",
    assetKey: "emerging_butterfly", scale: 0.26,
    x: -118, y: 162,  mobileX: -77,  mobileY: 105,
    description: "A butterfly breaking free from its chrysalis.",
    imagePath: "/assets/emerging_butterfly.png",
    cycleOrder: 4,
  },
  {
    name: "Adult Butterfly",
    assetKey: "adult_butterfly", scale: 0.28,
    x: -190, y: -62,  mobileX: -124, mobileY: -40,
    description: "A fully grown butterfly that pollinates flowers.",
    imagePath: "/assets/adult_butterfly.png",
    cycleOrder: 5,
  },
];

// ── 🌱 Plant Life Cycle ──────────────────
const plantCycle: PartConfig[] = [
  {
    name: "Seed",
    assetKey: "seed", scale: 0.26,
    x: 0,    y: -200, mobileX: 0,    mobileY: -130,
    description: "A tiny seed that contains everything needed to grow a plant.",
    imagePath: "/assets/seed.png",
    cycleOrder: 1,
  },
  {
    name: "Germinating Seed",
    assetKey: "sprout", scale: 0.26,
    x: 190,  y: -62,  mobileX: 124,  mobileY: -40,
    description: "A seed cracking open as a tiny root and shoot emerge.",
    imagePath: "/assets/sprout.png",
    cycleOrder: 2,
  },
  {
    name: "Seedling",
    assetKey: "seedling", scale: 0.26,
    x: 118,  y: 162,  mobileX: 77,   mobileY: 105,
    description: "A young plant with its first small leaves.",
    imagePath: "/assets/seedling.png",
    cycleOrder: 3,
  },
  {
    name: "Mature Plant",
    assetKey: "mature_plant", scale: 0.26,
    x: -118, y: 162,  mobileX: -77,  mobileY: 105,
    description: "A fully grown plant with stems and leaves.",
    imagePath: "/assets/mature_plant.png",
    cycleOrder: 4,
  },
  {
    name: "Flowering Plant",
    assetKey: "flowering_plant", scale: 0.28,
    x: -190, y: -62,  mobileX: -124, mobileY: -40,
    description: "A plant in full bloom that produces seeds to restart the cycle.",
    imagePath: "/assets/flowering_plant.png",
    cycleOrder: 5,
  },
];

// Flat array: Frog → Butterfly → Plant
// Batch 0 (levels 1–5):  frog stages
// Batch 1 (levels 6–10): butterfly stages
// Batch 2 (levels 11–15): plant stages
const expertLifecycle: PartConfig[] = [
  ...frogCycle,
  ...butterflyCycle,
  ...plantCycle,
];

// ========================================
// Level Generation — Standard categories
// ========================================
function generateCategoryLevels(
  categoryId: string,
  startId: number,
  allParts: PartConfig[]
): LevelConfig[] {
  const levels: LevelConfig[] = [];

  for (let i = 1; i <= 15; i++) {
    const globalId = startId + i - 1;
    const batchIndex = Math.floor((i - 1) / 5);
    const positionInBatch = ((i - 1) % 5) + 1;
    const batchStartIndex = batchIndex * 5;
    const parts = allParts.slice(batchStartIndex, batchStartIndex + positionInBatch);

    let title: string;
    let time: number;
    let snapRadius: number;
    let scorePerPart: number;

    if (i <= 5) {
      title = `${categoryId} ${i} – ${parts.length} Part${parts.length > 1 ? "s" : ""}`;
      time = 60 - (positionInBatch - 1) * 5;
      snapRadius = 60 - (positionInBatch - 1) * 3;
      scorePerPart = 10 + (positionInBatch - 1) * 2;
    } else if (i <= 10) {
      title = `${categoryId} ${i} – Scattered Challenge`;
      time = 60 - (positionInBatch - 1) * 5;
      snapRadius = 60 - (positionInBatch - 1) * 3;
      scorePerPart = 20 + (positionInBatch - 1) * 2;
    } else {
      title = `${categoryId} ${i} – Expert Mode`;
      time = 50 - (positionInBatch - 1) * 4;
      snapRadius = 50 - (positionInBatch - 1) * 2;
      scorePerPart = 30 + (positionInBatch - 1) * 3;
    }

    let backgroundImage: string;
    if (categoryId === "BASIC" || categoryId === "NORMAL") {
      backgroundImage = "/assets/human5.png";
    } else if (categoryId === "ADVANCED") {
      backgroundImage = "/assets/habitat.png";
    } else {
      // EXPERT
      backgroundImage = "/assets/lifecycle/lifecycle_bg.png";
    }

    levels.push({
      id: globalId,
      categoryId,
      levelInCategory: i,
      title,
      time,
      snapRadius,
      scorePerPart,
      parts,
      backgroundImage,
      isLifecycle: categoryId === "EXPERT",
    });
  }

  return levels;
}

// ========================================
// Level Generation — HARD = Astronomy
// orbitSpeed: deg/sec, negative = counter-clockwise
// Set 1 (levels 1–5):   Sun system   -15 → -35  slow
// Set 2 (levels 6–10):  Jupiter sys  -40 → -60  medium
// Set 3 (levels 11–15): Saturn sys   -65 → -85  fast
// ========================================
function generateHardAstronomyLevels(startId: number): LevelConfig[] {
  const sets: Array<{
    pool: PartConfig[];
    speeds: number[];
    times: number[];
    snaps: number[];
    scores: number[];
  }> = [
    {
      pool: astronomySunParts,
      speeds: [-15, -20, -25, -30, -35],
      times:  [ 60,  75,  90, 100,  90],
      snaps:  [ 45,  42,  40,  38,  32],
      scores: [  1,   1,   1,   1,   2],
    },
    {
      pool: astronomyJupiterParts,
      speeds: [-40, -45, -50, -55, -60],
      times:  [ 60,  75,  90, 100,  90],
      snaps:  [ 42,  40,  38,  36,  30],
      scores: [  1,   1,   1,   1,   2],
    },
    {
      pool: astronomySaturnParts,
      speeds: [-65, -70, -75, -80, -85],
      times:  [ 60,  75,  90, 100,  90],
      snaps:  [ 40,  38,  36,  34,  28],
      scores: [  1,   1,   1,   1,   2],
    },
  ];

  const levels: LevelConfig[] = [];

  sets.forEach((set, setIndex) => {
    for (let pos = 0; pos < 5; pos++) {
      const levelInCategory = setIndex * 5 + pos + 1; // 1–15
      const globalId = startId + levelInCategory - 1;

      // pos=0 (levels 1, 6, 11): center only — place the star/planet by itself
      // pos=1–4: center + orbiters added one per level
      const parts: PartConfig[] = pos === 0
        ? [set.pool[0]]                               // center only
        : [set.pool[0], ...set.pool.slice(1, pos + 1)]; // center + 1..4 orbiters

      levels.push({
        id: globalId,
        categoryId: "HARD",
        levelInCategory,
        title: `HARD ${levelInCategory} – Astronomy`,
        time: set.times[pos],
        snapRadius: set.snaps[pos],
        scorePerPart: set.scores[pos],
        parts,
        backgroundImage: "/assets/astronomy/space_bg.png",
        orbitSpeed: set.speeds[pos],
      });
    }
  });

  return levels;
}

// ========================================
// All Levels — 75 total
// BASIC    1–15   (food groups / pyramid)
// NORMAL   16–30  (body parts)
// HARD     31–45  (astronomy orbit game)
// ADVANCED 46–60  (habitat sorting)
// EXPERT   61–75  (life cycle ordering — circular arrows)
// ========================================
const levels: LevelConfig[] = [
  ...generateCategoryLevels("BASIC",    1,  basicFoods),
  ...generateCategoryLevels("NORMAL",   16, normalBodyParts),
  ...generateHardAstronomyLevels(31),
  ...generateCategoryLevels("ADVANCED", 46, advancedHabitat),
  ...generateCategoryLevels("EXPERT",   61, expertLifecycle),
];

export default levels;

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getLevelConfig(levelId: number): LevelConfig {
  return levels.find((l) => l.id === levelId) || levels[0];
}

export function getLevelsByCategory(categoryId: string): LevelConfig[] {
  return levels.filter((l) => l.categoryId === categoryId);
}

export function getLevelByCategory(
  categoryId: string,
  levelInCategory: number
): LevelConfig | undefined {
  return levels.find(
    (l) => l.categoryId === categoryId && l.levelInCategory === levelInCategory
  );
}

export function getRequiredAssets(levelConfig: LevelConfig): string[] {
  return [...new Set(levelConfig.parts.map((p) => p.assetKey))];
}

export function getAssetPath(assetKey: string): string {
  return `/assets/${assetKey}.png`;
}