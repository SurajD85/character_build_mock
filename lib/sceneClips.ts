import { CharacterId, PageSlug } from "../types/campaign";

export type EmotionState =
  | "IDLE"         // Normal cruising
  | "EXCITED"      // On hover / first notice
  | "STARTLED"     // Fast page scroll
  | "IMPATIENT"    // Long user idle
  | "DISAPPOINTED" // User dismissed without clicking
  | "TALKING";     // Mid-dialogue

export interface SceneDialogueLine {
  speaker: 1 | 2;
  text: string;
  durationMs: number;
  emotion?: EmotionState;
}

export interface SceneClip {
  id: string;
  char1: CharacterId;
  char2: CharacterId;
  page?: PageSlug;     // If set, only fires on this page; otherwise acts as fallback
  intro?: string;      // Admin-facing description
  pauseAtCenterMs: number;
  lines: SceneDialogueLine[];
}

// =============================================================================
// PAGE-SPECIFIC SCENE CLIPS (highest priority in lookup)
// =============================================================================

export const SCENE_CLIPS: SceneClip[] = [
  // --- VANS PAGE: Van + Wheelchair → product demo ---
  {
    id: "van_wc_vans",
    char1: "accessible_van",
    char2: "wheelchair_boy",
    page: "vans",
    intro: "Van arrives and lowers its ramp for the wheelchair user — feels like a product demo.",
    pauseAtCenterMs: 5500,
    lines: [
      { speaker: 1, text: "Hey! Need a lift? Ramp's coming down! 🚐", durationMs: 2200 },
      { speaker: 2, text: "Perfect! That's exactly what I need!", durationMs: 1800 },
      { speaker: 1, text: "20+ certified Welcab vans in stock!", durationMs: 2000 },
      { speaker: 2, text: "Click us to book a test drive! 🏎️", durationMs: 1800 },
    ],
  },

  // --- HOME PAGE: Van + Wheelchair → marketplace intro ---
  {
    id: "van_wc_home",
    char1: "accessible_van",
    char2: "wheelchair_boy",
    page: "home",
    intro: "Van and wheelchair introduce AbilityClassifieds to new visitors.",
    pauseAtCenterMs: 4500,
    lines: [
      { speaker: 2, text: "Looking for accessible transport? 🧑‍🦼", durationMs: 2000 },
      { speaker: 1, text: "ABC Mobility has exactly what you need!", durationMs: 2000 },
      { speaker: 2, text: "Australia's #1 mobility marketplace! 🌏", durationMs: 2200 },
    ],
  },

  // --- WHEELCHAIRS PAGE: Wheelchair + Nurse → care recommendation ---
  {
    id: "wc_nurse_wheelchairs",
    char1: "wheelchair_boy",
    char2: "scooter_nurse",
    page: "wheelchairs",
    intro: "Wheelchair user and nurse discuss staying independent with the right chair.",
    pauseAtCenterMs: 5000,
    lines: [
      { speaker: 1, text: "FreedomChairs kept me independent! 🏆", durationMs: 2200 },
      { speaker: 2, text: "Our care team recommends them too! 👩‍⚕️", durationMs: 2000 },
      { speaker: 1, text: "ErgoLite from just $890 — see the range!", durationMs: 2200 },
      { speaker: 2, text: "Tap me to view their catalogue! 📋", durationMs: 1800 },
    ],
  },

  // --- SCOOTERS PAGE: Scooter Nurse → scooter product highlight ---
  {
    id: "nurse_scooter_scooters",
    char1: "scooter_nurse",
    char2: "wheelchair_boy",
    page: "scooters",
    intro: "Nurse and scooter lady highlight the Apex 4-wheel scooter features.",
    pauseAtCenterMs: 4800,
    lines: [
      { speaker: 1, text: "This scooter changed everything for me! 🛵", durationMs: 2000 },
      { speaker: 2, text: "Apex 4-Wheel goes 12 mph! ⚡", durationMs: 1800 },
      { speaker: 1, text: "25-mile range, perfect for our daily outings!", durationMs: 2200 },
      { speaker: 2, text: "USB charger included too! 🔌", durationMs: 1800 },
    ],
  },

  // --- HOME PAGE: Electric Chair + Walker Lady → speed contrast humour ---
  {
    id: "electric_walker_home",
    char1: "electric_chair",
    char2: "walker_lady",
    page: "home",
    intro: "Electric chair zooms past walker lady — playful speed contrast comedy.",
    pauseAtCenterMs: 4000,
    lines: [
      { speaker: 1, text: "Passing on the left! PowerGlide Pro! ⚡", durationMs: 1800 },
      { speaker: 2, text: "Hey! My rollator is just as stylish! 🛒", durationMs: 2000 },
      { speaker: 1, text: "Both on AbilityClassifieds right now! 😄", durationMs: 2000 },
      { speaker: 2, text: "Tap either of us to explore!", durationMs: 1800 },
    ],
  },

  // --- FINANCE PAGE: Electric Chair + Walker Lady → cost conversation ---
  {
    id: "electric_walker_finance",
    char1: "electric_chair",
    char2: "walker_lady",
    page: "finance",
    intro: "They discuss how financing makes mobility equipment more accessible.",
    pauseAtCenterMs: 5500,
    lines: [
      { speaker: 2, text: "I thought power chairs were too expensive... 💭", durationMs: 2400 },
      { speaker: 1, text: "Not with our finance plans! From $0 deposit! 💳", durationMs: 2200 },
      { speaker: 2, text: "Really? That changes everything for me! 🙌", durationMs: 2000 },
      { speaker: 2, text: "Click to see all finance options today!", durationMs: 2000 },
    ],
  },

  // --- ALL PAGES: Guide Dog Duo + Sign Language Duo ---
  {
    id: "guide_dog_sign_all",
    char1: "guide_dog_duo",
    char2: "sign_language_duo",
    intro: "Guide dog handler and signing duo exchange warm greetings about inclusive community.",
    pauseAtCenterMs: 5000,
    lines: [
      { speaker: 1, text: "Guide dog in training — making travel safe! 🦮", durationMs: 2200 },
      { speaker: 2, text: "🤟 [Signing: We love accessible community!]", durationMs: 2000 },
      { speaker: 1, text: "Assistance animals and sign aids together!", durationMs: 2000 },
      { speaker: 2, text: "Click to view accessible community services! 🌟", durationMs: 1800 },
    ],
  },

  // --- WHEELCHAIRS & HOME PAGE: Prosthetic Athlete + Superhero Crutches Kid ---
  {
    id: "blade_crutches_race",
    char1: "prosthetic_athlete",
    char2: "crutches_kid",
    intro: "Prosthetic runner and crutches kid have a fun high-energy race overtake dialogue.",
    pauseAtCenterMs: 4800,
    lines: [
      { speaker: 1, text: "Carbon blade prosthetics — sprint past limits! ⚡", durationMs: 2000 },
      { speaker: 2, text: "Superhero squad right behind you! 🦸‍♂️", durationMs: 1800 },
      { speaker: 1, text: "From pediatric crutches to blade prosthetics!", durationMs: 2200 },
      { speaker: 2, text: "Tap to see high performance mobility gear! 🏆", durationMs: 1800 },
    ],
  },

  // --- SCOOTERS PAGE: Delivery Trike + Hearing Aid Teen ---
  {
    id: "trike_teen_delivery",
    char1: "delivery_trike",
    char2: "hearing_aid_teen",
    intro: "Cargo trike delivers fresh mobility tech gear while teen highlights hearing aids.",
    pauseAtCenterMs: 5000,
    lines: [
      { speaker: 1, text: "Mobility Express Delivery in your neighborhood! 📦", durationMs: 2200 },
      { speaker: 2, text: "Got my new Bluetooth hearing aids delivered! 🎧", durationMs: 2000 },
      { speaker: 1, text: "Same-day delivery on selected items!", durationMs: 2000 },
      { speaker: 2, text: "Click to explore delivery & hearing tech! ⚡", durationMs: 1800 },
    ],
  },

  // =============================================================================
  // GENERIC FALLBACK CLIPS (no page restriction)
  // =============================================================================

  {
    id: "generic_van_wc",
    char1: "accessible_van",
    char2: "wheelchair_boy",
    intro: "Generic van & wheelchair marketplace intro.",
    pauseAtCenterMs: 3500,
    lines: [
      { speaker: 1, text: "Australia's #1 Mobility Marketplace! 🌏", durationMs: 2000 },
      { speaker: 2, text: "Hundreds of verified listings await you!", durationMs: 2000 },
    ],
  },
  {
    id: "generic_electric_walker",
    char1: "electric_chair",
    char2: "walker_lady",
    intro: "Generic electric chair & walker fallback.",
    pauseAtCenterMs: 3500,
    lines: [
      { speaker: 1, text: "PowerGlide Pro — speed meets freedom! ⚡", durationMs: 2000 },
      { speaker: 2, text: "And rollator walkers for daily independence! 🦯", durationMs: 2000 },
    ],
  },
  {
    id: "generic_nurse_van",
    char1: "scooter_nurse",
    char2: "accessible_van",
    intro: "Nurse and van fallback — care & transport pairing.",
    pauseAtCenterMs: 3500,
    lines: [
      { speaker: 1, text: "Mobility and care go hand in hand! 👩‍⚕️", durationMs: 2000 },
      { speaker: 2, text: "Accessible transport for every journey! 🚐", durationMs: 2000 },
    ],
  },
];

// =============================================================================
// EMOTION-BASED FLOATING BUBBLE TEXT
// =============================================================================
export const EMOTION_BUBBLES: Record<EmotionState, string[]> = {
  IDLE: [],
  EXCITED: ["Oh! You noticed me! 👋", "Hey there! 😊", "Hi! Click me! 🎉"],
  STARTLED: ["Whoa! Slow down! 😲", "Easy! Easy! 😅", "Careful up there! 🙈"],
  IMPATIENT: ["Ahem... notice me? 👀", "Still here! 😤", "Tap me when ready! 🥱"],
  DISAPPOINTED: ["Come back soon! 👋", "See you next time! 💙", "Don't be a stranger! 😊"],
  TALKING: [],
};

// Crowd mode reactions when 2+ campaigns are visible
export const CROWD_LINES: string[] = [
  "Getting busy in here! 🏙️",
  "Busy street today! 😄",
  "Great company on the road! 🌟",
  "AbilityClassifieds is popular! 🎉",
  "Rush hour mobility! 🚦",
];

// =============================================================================
// LOOKUP: Find best scene clip for a char pair + page
// =============================================================================
export function findSceneClip(
  char1: CharacterId,
  char2: CharacterId,
  page: PageSlug
): SceneClip | undefined {
  // 1. Try page-specific match
  const pageMatch = SCENE_CLIPS.find(
    (c) =>
      c.page === page &&
      ((c.char1 === char1 && c.char2 === char2) ||
        (c.char1 === char2 && c.char2 === char1))
  );
  if (pageMatch) return pageMatch;

  // 2. Fall back to generic (no page)
  return SCENE_CLIPS.find(
    (c) =>
      !c.page &&
      ((c.char1 === char1 && c.char2 === char2) ||
        (c.char1 === char2 && c.char2 === char1))
  );
}

// Random helper
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
