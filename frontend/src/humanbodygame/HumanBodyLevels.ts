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
  imagePath: string; // Explicit image path for each part
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
}

// ========================================
// 🟢 BASIC — Organs (15 items)
// ========================================
const basicOrgans: PartConfig[] = [
  { 
    name: "Heart", 
    assetKey: "heart", 
    scale: 0.2, 
    x: 40, 
    y: -230, 
    mobileX: 30, 
    mobileY: -140, 
    description: "Pumps blood throughout the body.",
    imagePath: "/assets/heart.png"
  },
  { 
    name: "Lungs", 
    assetKey: "lungs", 
    scale: 0.2, 
    x: 0, 
    y: -190, 
    mobileX: -10, 
    mobileY: -110, 
    description: "Allow breathing and oxygen exchange.",
    imagePath: "/assets/lungs.png"
  },
  { 
    name: "Brain", 
    assetKey: "brain", 
    scale: 0.5, 
    x: 0, 
    y: -350, 
    mobileX: 0, 
    mobileY: -220, 
    description: "Controls thoughts, memory, and movement.",
    imagePath: "/assets/brain.png"
  },
  { 
    name: "Stomach", 
    assetKey: "stomach", 
    scale: 0.3, 
    x: 30, 
    y: -130, 
    mobileX: 20, 
    mobileY: -60, 
    description: "Breaks down food during digestion.",
    imagePath: "/assets/stomach.png"
  },
  { 
    name: "Liver", 
    assetKey: "liver", 
    scale: 0.35, 
    x: -20, 
    y: -145, 
    mobileX: -20, 
    mobileY: -70, 
    description: "Filters toxins and produces bile.",
    imagePath: "/assets/liver.png"
  },
  { 
    name: "Kidneys", 
    assetKey: "kidney", 
    scale: 0.18, 
    x: -35, 
    y: -100, 
    mobileX: -35, 
    mobileY: -40, 
    description: "Filter blood and remove waste.",
    imagePath: "/assets/kidney.png"
  },
  { 
    name: "Trachea", 
    assetKey: "trachea", 
    scale: 0.25, 
    x: 0, 
    y: -260, 
    mobileX: 0, 
    mobileY: -160, 
    description: "Windpipe that carries air to lungs.",
    imagePath: "/assets/trachea.png"
  },
  { 
    name: "Esophagus", 
    assetKey: "esophagus", 
    scale: 0.22, 
    x: 10, 
    y: -200, 
    mobileX: 5, 
    mobileY: -120, 
    description: "Tube connecting mouth to stomach.",
    imagePath: "/assets/esophagus.png"
  },
  { 
    name: "Pancreas", 
    assetKey: "pancreas", 
    scale: 0.25, 
    x: -30, 
    y: -120, 
    mobileX: -25, 
    mobileY: -55, 
    description: "Produces insulin and digestive enzymes.",
    imagePath: "/assets/pancreas.png"
  },
  { 
    name: "Intestine", 
    assetKey: "intestine", 
    scale: 0.2, 
    x: 0, 
    y: -75, 
    mobileX: 0, 
    mobileY: -20, 
    description: "Absorbs nutrients and water.",
    imagePath: "/assets/Intestine.png"
  },
  { 
    name: "Bladder", 
    assetKey: "bladder", 
    scale: 0.2, 
    x: 0, 
    y: -40, 
    mobileX: 0, 
    mobileY: -10, 
    description: "Stores urine before excretion.",
    imagePath: "/assets/bladder.png"
  },
  { 
    name: "Gallbladder", 
    assetKey: "gallbladder", 
    scale: 0.18, 
    x: -40, 
    y: -135, 
    mobileX: -35, 
    mobileY: -65, 
    description: "Stores bile from the liver.",
    imagePath: "/assets/gallbladder.png"
  },
  { 
    name: "Spleen", 
    assetKey: "spleen", 
    scale: 0.2, 
    x: -50, 
    y: -150, 
    mobileX: -40, 
    mobileY: -80, 
    description: "Filters blood and fights infection.",
    imagePath: "/assets/spleen.png"
  },
  { 
    name: "Thyroid gland", 
    assetKey: "thyroid", 
    scale: 0.15, 
    x: 0, 
    y: -300, 
    mobileX: 0, 
    mobileY: -180, 
    description: "Regulates metabolism and energy.",
    imagePath: "/assets/thyroid.png"
  },
  { 
    name: "Appendix", 
    assetKey: "appendix", 
    scale: 0.15, 
    x: 20, 
    y: -60, 
    mobileX: 15, 
    mobileY: -25, 
    description: "Small pouch attached to large intestine.",
    imagePath: "/assets/appendix.png"
  },
];

// ========================================
// 🔵 NORMAL — Body Parts (15 items)
// ========================================
const normalBodyParts: PartConfig[] = [
  { 
    name: "Eyes", 
    assetKey: "eyes",
    scale: 0.3, 
    x: 0, 
    y: -320, 
    mobileX: 0, 
    mobileY: -200, 
    description: "Allow vision and light perception.",
    imagePath: "/assets/eyes.png"
  },
  { 
    name: "Nails", 
    assetKey: "nails",
    scale: 0.15, 
    x: -200, 
    y: -20, 
    mobileX: -75, 
    mobileY: -35, 
    description: "Protect fingertips and toes.",
    imagePath: "/assets/nails.png"
  },
  { 
    name: "Ears", 
    assetKey: "ears",
    scale: 0.2, 
    x: 50, 
    y: -310, 
    mobileX: 0, 
    mobileY: -140, 
    description: "Enable hearing and balance.",
    imagePath: "/assets/ears.png"
  },
  { 
    name: "Feet", 
    assetKey: "feet",
    scale: 0.25, 
    x: -80, 
    y: 330, 
    mobileX: 0, 
    mobileY: 80, 
    description: "Support body weight and enable movement.",
    imagePath: "/assets/feet.png"
  },
  { 
    name: "Toes", 
    assetKey: "toes",
    scale: 0.18, 
    x: 80, 
    y: 330, 
    mobileX: 0, 
    mobileY: 95, 
    description: "Help with balance and walking.",
    imagePath: "/assets/toes.png"
  },
  { 
    name: "Nose", 
    assetKey: "nose",
    scale: 0.25, 
    x: 0, 
    y: -330, 
    mobileX: 0, 
    mobileY: -170, 
    description: "Detects smells and filters air.",
    imagePath: "/assets/nose.png"
  },
  { 
    name: "Mouth", 
    assetKey: "mouth",
    scale: 0.3, 
    x: 0, 
    y: -280, 
    mobileX: 0, 
    mobileY: -110, 
    description: "For eating, speaking, and breathing.",
    imagePath: "/assets/mouth.png"
  },
  { 
    name: "Hands", 
    assetKey: "hands",
    scale: 0.25, 
    x: -180, 
    y: -10, 
    mobileX: -60, 
    mobileY: -50, 
    description: "Manipulate objects and sense touch.",
    imagePath: "/assets/hands.png"
  },
  { 
    name: "Fingers", 
    assetKey: "fingers",
    scale: 0.2, 
    x: 180, 
    y: -10, 
    mobileX: -70, 
    mobileY: -40, 
    description: "Provide fine motor control.",
    imagePath: "/assets/fingers.png"
  },
  { 
    name: "Arms", 
    assetKey: "arms",
    scale: 0.25, 
    x: -140, 
    y: -130, 
    mobileX: -55, 
    mobileY: -70, 
    description: "Connect shoulders to hands.",
    imagePath: "/assets/arms.png"
  },
  { 
    name: "Teeth", 
    assetKey: "teeth",
    scale: 0.25, 
    x: 0, 
    y: -300, 
    mobileX: 0, 
    mobileY: -115, 
    description: "Break down food by chewing.",
    imagePath: "/assets/teeth.png"
  },
  { 
    name: "Tongue", 
    assetKey: "tongue",
    scale: 0.22, 
    x: 0, 
    y: -270, 
    mobileX: 0, 
    mobileY: -105, 
    description: "Tastes food and helps with speech.",
    imagePath: "/assets/tongue.png"
  },
  { 
    name: "Legs", 
    assetKey: "legs",
    scale: 0.25, 
    x: 0, 
    y: 50, 
    mobileX: 0, 
    mobileY: 40, 
    description: "Support body and enable walking.",
    imagePath: "/assets/legs.png"
  },
  { 
    name: "Skin", 
    assetKey: "skin",
    scale: 0.2, 
    x: 0, 
    y: -100, 
    mobileX: 0, 
    mobileY: 0, 
    description: "Protects the body and regulates temperature.",
    imagePath: "/assets/skin.png"
  },
  { 
    name: "Hair", 
    assetKey: "hair",
    scale: 0.25, 
    x: 0, 
    y: -360, 
    mobileX: 0, 
    mobileY: -230, 
    description: "Protects scalp and regulates temperature.",
    imagePath: "/assets/hair.png"
  },
];

// ========================================
// 🔴 HARD — Skeleton (15 items)
// ========================================
const hardSkeleton: PartConfig[] = [
  { 
    name: "", 
    assetKey: "skull",
    scale: 0.4, 
    x: 0, 
    y: -350, 
    mobileX: 0, 
    mobileY: -220, 
    description: "Protects the brain.",
    imagePath: "/assets/skull.png"
  },
  { 
    name: "", 
    assetKey: "mandible",
    scale: 0.25, 
    x: 0, 
    y: -300, 
    mobileX: 0, 
    mobileY: -180, 
    description: "Lower jawbone.",
    imagePath: "/assets/mandible.png"
  },
  { 
    name: "", 
    assetKey: "clavicle",
    scale: 0.2, 
    x: -20, 
    y: -250, 
    mobileX: -40, 
    mobileY: -150, 
    description: "Collarbone connecting sternum to shoulder.",
    imagePath: "/assets/clavicle.png"
  },
  { 
    name: "", 
    assetKey: "scapula",
    scale: 0.25, 
    x: -70, 
    y: -220, 
    mobileX: -55, 
    mobileY: -130, 
    description: "Shoulder blade.",
    imagePath: "/assets/scapula.png"
  },
  { 
    name: "", 
    assetKey: "sternum",
    scale: 0.2, 
    x: 0, 
    y: -200, 
    mobileX: 0, 
    mobileY: -140, 
    description: "Breastbone in the center of chest.",
    imagePath: "/assets/sternum.png"
  },
  { 
    name: "", 
    assetKey: "ribs",
    scale: 0.3, 
    x: 0, 
    y: -190, 
    mobileX: 0, 
    mobileY: -110, 
    description: "Protects heart and lungs.",
    imagePath: "/assets/ribs.png"
  },
  { 
    name: "", 
    assetKey: "spine",
    scale: 0.25, 
    x: 0, 
    y: -100, 
    mobileX: 0, 
    mobileY: -50, 
    description: "Supports body structure.",
    imagePath: "/assets/spine.png"
  },
  { 
    name: "", 
    assetKey: "pelvis",
    scale: 0.3, 
    x: 0, 
    y: -30, 
    mobileX: 0, 
    mobileY: -10, 
    description: "Connects spine to legs.",
    imagePath: "/assets/pelvis.png"
  },
  { 
    name: "", 
    assetKey: "humerus",
    scale: 0.18, 
    x: -140, 
    y: -180, 
    mobileX: -60, 
    mobileY: -90, 
    description: "Upper arm bone.",
    imagePath: "/assets/humerus.png"
  },
  { 
    name: "", 
    assetKey: "radius",
    scale: 0.16, 
    x: -150, 
    y: -90, 
    mobileX: -65, 
    mobileY: -55, 
    description: "Forearm bone on thumb side.",
    imagePath: "/assets/radius.png"
  },
  { 
    name: "", 
    assetKey: "ulna",
    scale: 0.16, 
    x: -145, 
    y: -95, 
    mobileX: -60, 
    mobileY: -50, 
    description: "Forearm bone on pinky side.",
    imagePath: "/assets/ulna.png"
  },
  { 
    name: "", 
    assetKey: "femur",
    scale: 0.2, 
    x: -70, 
    y: 50, 
    mobileX: -20, 
    mobileY: 40, 
    description: "Thighbone, longest bone in body.",
    imagePath: "/assets/femur.png"
  },
  { 
    name: "", 
    assetKey: "patella",
    scale: 0.15, 
    x: -70, 
    y: 130, 
    mobileX: -18, 
    mobileY: 65, 
    description: "Kneecap.",
    imagePath: "/assets/patella.png"
  },
  { 
    name: "", 
    assetKey: "tibia",
    scale: 0.18, 
    x: -70, 
    y: 230, 
    mobileX: -15, 
    mobileY: 90, 
    description: "Shinbone.",
    imagePath: "/assets/tibia.png"
  },
  { 
    name: "", 
    assetKey: "fibula",
    scale: 0.16, 
    x: 70, 
    y: 230,  
    mobileX: -12, 
    mobileY: 95, 
    description: "Calf bone next to tibia.", 
    imagePath: "/assets/fibula.png"
  },
];

// ========================================
// 🟠 ADVANCED — Organ-Based Diseases (15 items)
// ========================================
const advancedPathogens: PartConfig[] = [
  { 
    name: "Peptic Ulcer Disease", 
    assetKey: "peptic_ulcer",
    scale: 0.22, 
    x: 40, 
    y: -150, 
    mobileX: 0, 
    mobileY: -120, 
    description: "Open sores in the stomach lining.",
    imagePath: "/assets/peptic_ulcer.png"
  },
  { 
    name: "Encephalitis", 
    assetKey: "encephalitis",
    scale: 0.2, 
    x: 5, 
    y: -370, 
    mobileX: 20, 
    mobileY: -90, 
    description: "Inflammation of the brain.",
    imagePath: "/assets/encephalitis.png"
  },
  { 
    name: "Bladder Stones", 
    assetKey: "bladder_stones",
    scale: 0.22, 
    x: -5, 
    y: -50, 
    mobileX: -20, 
    mobileY: -90, 
    description: "Hard mineral deposits in the bladder.",
    imagePath: "/assets/bladder_stones.png"
  },
  { 
    name: "Diabetes Mellitus", 
    assetKey: "diabetes",
    scale: 0.2, 
    x: 0, 
    y: -100, 
    mobileX: 0, 
    mobileY: -60, 
    description: "Chronic condition affecting blood sugar regulation.",
    imagePath: "/assets/diabetes.png"
  },
  { 
    name: "Tuberculosis", 
    assetKey: "tuberculosis",
    scale: 0.22, 
    x: -70, 
    y: -180, 
    mobileX: 30, 
    mobileY: -105, 
    description: "Bacterial lung infection.",
    imagePath: "/assets/tuberculosis.png"
  },
  { 
    name: "Splenomegaly", 
    assetKey: "splenomegaly",
    scale: 0.2, 
    x: 70, 
    y: -180, 
    mobileX: -30, 
    mobileY: -105, 
    description: "Abnormal enlargement of the spleen.",
    imagePath: "/assets/spleen.png"
  },
  { 
    name: "Hypothyroidism", 
    assetKey: "hypothyroidism",
    scale: 0.21, 
    x: 2, 
    y: -270, 
    mobileX: 25, 
    mobileY: -70, 
    description: "Underactive thyroid gland.",
    imagePath: "/assets/hypothyroidism.png"
  },
  { 
    name: "Appendicitis", 
    assetKey: "appendicitis",
    scale: 0.2, 
    x: -35, 
    y: -60, 
    mobileX: -25, 
    mobileY: -70, 
    description: "Inflammation of the appendix.",
    imagePath: "/assets/appendicitis.png"
  },
  { 
    name: "Coronary Artery Disease", 
    assetKey: "coronary_artery_disease",
    scale: 0.19, 
    x: 15, 
    y: -200, 
    mobileX: 0, 
    mobileY: -30, 
    description: "Narrowing of heart arteries.",
    imagePath: "/assets/coronary_artery_disease.png"
  },
  { 
    name: "Crohn’s Disease", 
    assetKey: "crohns_disease",
    scale: 0.2, 
    x: 40, 
    y: -80, 
    mobileX: 30, 
    mobileY: -50, 
    description: "Chronic inflammatory bowel disease.",
    imagePath: "/assets/crohns_disease.png"
  },
  { 
    name: "Pneumonia", 
    assetKey: "pneumonia",
    scale: 0.2, 
    x: -40, 
    y: -210, 
    mobileX: -30, 
    mobileY: -50, 
    description: "Infection causing lung inflammation.",
    imagePath: "/assets/pneumonia.png"
  },
  { 
    name: "Hepatitis B", 
    assetKey: "hepatitis_b",
    scale: 0.18, 
    x: -35, 
    y: -150, 
    mobileX: 25, 
    mobileY: -20, 
    description: "Viral infection of the liver.",
    imagePath: "/assets/hepatitis_b.png"
  },
  { 
    name: "Ovarian Cancer", 
    assetKey: "ovarian_cancer",
    scale: 0.18, 
    x: 0, 
    y: -40, 
    mobileX: -25, 
    mobileY: -20, 
    description: "Cancer of the ovaries.",
    imagePath: "/assets/ovarian_cancer.png"
  },
  { 
    name: "Nephritis", 
    assetKey: "nephritis",
    scale: 0.17, 
    x: 30, 
    y: -90, 
    mobileX: 20, 
    mobileY: 0, 
    description: "Inflammation of the kidneys.",
    imagePath: "/assets/nephritis.png"
  },
  { 
    name: "Stroke", 
    assetKey: "stroke",
    scale: 0.19, 
    x: 0, 
    y: -370, 
    mobileX: -20, 
    mobileY: 0, 
    description: "Disrupted blood flow to the brain.",
    imagePath: "/assets/stroke.png"
  },
];

// ========================================
// 💀 EXPERT — Cells (Organ Only, 15 items, Randomized)
// ========================================
const expertCells: PartConfig[] = [
  { 
    name: "Neuron", 
    assetKey: "neuron",
    scale: 0.22, 
    x: 0, 
    y: -360, 
    mobileX: 0, 
    mobileY: -130, 
    description: "Nerve cell transmitting signals. Found in the brain.",
    imagePath: "/assets/neuron.png"
  },
  { 
    name: "Red blood cell", 
    assetKey: "red_blood_cell",
    scale: 0.25, 
    x: -20, 
    y: -200, 
    mobileX: 0, 
    mobileY: -110, 
    description: "Carries oxygen throughout the body. Found in the heart and blood.",
    imagePath: "/assets/red_blood_cell.png"
  },
  { 
    name: "White blood cell", 
    assetKey: "white_blood_cell",
    scale: 0.2, 
    x: 70, 
    y: -150, 
    mobileX: 20, 
    mobileY: -90, 
    description: "Defends the body against disease. Found in the spleen and blood.",
    imagePath: "/assets/white_blood_cell.png"
  },
  { 
    name: "Platelet", 
    assetKey: "platelet",
    scale: 0.18, 
    x: -30, 
    y: -150, 
    mobileX: -20, 
    mobileY: -90, 
    description: "Helps blood clot to stop bleeding. Found in blood.",
    imagePath: "/assets/platelet.png"
  },
  { 
    name: "Cardiac muscle cell", 
    assetKey: "cardiac_muscle_cell",
    scale: 0.2, 
    x: 20, 
    y: -200, 
    mobileX: -30, 
    mobileY: -70, 
    description: "Makes up heart muscle tissue. Found in the heart.",
    imagePath: "/assets/cardiac_muscle_cell.png"
  },
  { 
    name: "Skeletal muscle cell", 
    assetKey: "skeletal_muscle_cell",
    scale: 0.2, 
    x: 40, 
    y: 70, 
    mobileX: 30, 
    mobileY: -70, 
    description: "Enables voluntary body movement. Found in muscles.",
    imagePath: "/assets/skeletal_muscle_cell.png"
  },
  { 
    name: "Smooth muscle cell", 
    assetKey: "smooth_muscle_cell",
    scale: 0.19, 
    x: 0, 
    y: -90, 
    mobileX: 0, 
    mobileY: -50, 
    description: "Lines internal organs. Found in stomach, intestines, and blood vessels.",
    imagePath: "/assets/smooth_muscle_cell.png"
  },
  { 
    name: "Epithelial cell", 
    assetKey: "epithelial_cell",
    scale: 0.18, 
    x: 35, 
    y: -150, 
    mobileX: 25, 
    mobileY: -35, 
    description: "Forms protective layers. Found lining organs like stomach and lungs.",
    imagePath: "/assets/epithelial_cell.png"
  },
  { 
    name: "Liver cell", 
    assetKey: "liver_cell",
    scale: 0.18, 
    x: -30, 
    y: -150, 
    mobileX: -20, 
    mobileY: 0, 
    description: "Performs liver functions. Found in the liver.",
    imagePath: "/assets/liver_cell.png"
  },
  { 
    name: "Kidney epithelial cell", 
    assetKey: "kidney_cell",
    scale: 0.18, 
    x: -60, 
    y: -90, 
    mobileX: 20, 
    mobileY: 0, 
    description: "Filters waste from blood. Found in the kidneys.",
    imagePath: "/assets/kidney_cell.png"
  },
  { 
    name: "Stem cell", 
    assetKey: "stem_cell",
    scale: 0.19, 
    x: 70, 
    y: -150, 
    mobileX: 20, 
    mobileY: -10, 
    description: "Can become different cells. Found in blood and spleen.",
    imagePath: "/assets/stem_cell.png"
  },
  { 
    name: "Sperm cell", 
    assetKey: "sperm_cell",
    scale: 0.19, 
    x: -30, 
    y: -50, 
    mobileX: -20, 
    mobileY: 20, 
    description: "Male reproductive cell. Found in the testes.",
    imagePath: "/assets/sperm_cell.png"
  },
  { 
    name: "Egg cell", 
    assetKey: "egg_cell",
    scale: 0.2, 
    x: 30, 
    y: -50, 
    mobileX: 0, 
    mobileY: 20, 
    description: "Female reproductive cell. Found in the ovaries.",
    imagePath: "/assets/egg_cell.png"
  },
  { 
    name: "Red pulp spleen cell", 
    assetKey: "spleen_cell",
    scale: 0.18, 
    x: 70, 
    y: -210,
    mobileX: -20, 
    mobileY: -15, 
    description: "Helps fight infection. Found in the spleen.",
    imagePath: "/assets/spleen_cell.png"
  },
  { 
    name: "Pulmonary epithelial cell", 
    assetKey: "lung_cell",
    scale: 0.18, 
    x: -50, 
    y: -210,
    mobileX: 0, 
    mobileY: 0, 
    description: "Lines airways. Found in the lungs.",
    imagePath: "/assets/lung_cell.png"
  },
];

// ========================================
// Level Generation
// ========================================

// Generate levels for a category with batched item progression
function generateCategoryLevels(
  categoryId: string,
  startId: number,
  allParts: PartConfig[]
): LevelConfig[] {
  const levels: LevelConfig[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const globalId = startId + i - 1;
    
    // ⭐ Determine which batch of 5 items this level belongs to
    // Levels 1-5: items 0-4
    // Levels 6-10: items 5-9
    // Levels 11-15: items 10-14
    const batchIndex = Math.floor((i - 1) / 5); // 0, 1, or 2
    const positionInBatch = ((i - 1) % 5) + 1; // 1-5
    
    // Get cumulative parts for this level within the current batch
    const batchStartIndex = batchIndex * 5;
    const parts = allParts.slice(batchStartIndex, batchStartIndex + positionInBatch);
    
    let title: string;
    let time: number;
    let snapRadius: number;
    let scorePerPart: number;
    
    if (i <= 5) {
      // Levels 1-5: Normal gameplay (Batch 1)
      title = `${categoryId} ${i} – ${parts.length} Part${parts.length > 1 ? 's' : ''}`;
      time = 60 - (positionInBatch - 1) * 5;
      snapRadius = 60 - (positionInBatch - 1) * 3;
      scorePerPart = 10 + (positionInBatch - 1) * 2;
    } else if (i <= 10) {
      // Levels 6-10: Scattered organs (Batch 2)
      title = `${categoryId} ${i} – Scattered Challenge`;
      time = 60 - (positionInBatch - 1) * 5;
      snapRadius = 60 - (positionInBatch - 1) * 3;
      scorePerPart = 20 + (positionInBatch - 1) * 2;
    } else {
      // Levels 11-15: Advanced challenges (Batch 3)
      title = `${categoryId} ${i} – Expert Mode`;
      time = 50 - (positionInBatch - 1) * 4;
      snapRadius = 50 - (positionInBatch - 1) * 2;
      scorePerPart = 30 + (positionInBatch - 1) * 3;
    }
    
     let backgroundImage: string;
    if (categoryId === "BASIC" || categoryId === "NORMAL") {
      backgroundImage = "/assets/human5.png";
    } else if (categoryId === "HARD") {
      backgroundImage = "/assets/skeleton.png";
    } else if (categoryId === "ADVANCED" || categoryId === "EXPERT") {
      backgroundImage = "/assets/humanorgans.png";
    } else {
      backgroundImage = "/assets/human5.png"; // Default fallback
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
    });
  }
  
  return levels;
}

// Generate all 75 levels (15 per category × 5 categories)
const levels: LevelConfig[] = [
  ...generateCategoryLevels("BASIC", 1, basicOrgans),           // Levels 1-15
  ...generateCategoryLevels("NORMAL", 16, normalBodyParts),     // Levels 16-30
  ...generateCategoryLevels("HARD", 31, hardSkeleton),          // Levels 31-45
  ...generateCategoryLevels("ADVANCED", 46, advancedPathogens), // Levels 46-60
  ...generateCategoryLevels("EXPERT", 61, expertCells),         // Levels 61-75
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

// Helper function to get all unique asset keys needed for a level
export function getRequiredAssets(levelConfig: LevelConfig): string[] {
  const assetKeys = levelConfig.parts.map(part => part.assetKey);
  return [...new Set(assetKeys)]; // Remove duplicates
}

// Helper function to get asset path for an asset key
export function getAssetPath(assetKey: string): string {
  return `/assets/${assetKey}.png`;
}