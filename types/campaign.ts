export type CharacterId = 
  | "wheelchair_boy" 
  | "accessible_van" 
  | "scooter_nurse" 
  | "electric_chair" 
  | "stairlift_pro" 
  | "walker_lady" 
  | "guide_dog_duo" 
  | "hearing_aid_teen" 
  | "prosthetic_athlete" 
  | "crutches_kid" 
  | "delivery_trike" 
  | "sign_language_duo"
  | "bionic_arm_builder"
  | "sensory_calm_teen"
  | "pediatric_walker_kid"
  | "carer_support_duo";

export type PageSlug = "all" | "home" | "wheelchairs" | "vans" | "scooters" | "finance";

export type CampaignMode = "SOLO" | "CO_OP" | "CONVOY" | "RACE_OVERTAKE";

export type FlagShape = "swallowtail" | "ribbon" | "pennant" | "box";

export type CharacterAccessory = "none" | "cape" | "party_hat" | "sunglasses" | "crown" | "gold_medal";

export type CharacterSize = "small" | "medium" | "large";

export interface DialogueScript {
  char1Line: string; // e.g. "Looking for accessible transport?"
  char2Line: string; // e.g. "ABC Mobility has 20+ vans in stock!"
}

export interface CharacterAsset {
  id: CharacterId;
  name: string;
  category: string;
  icon: string;
  description: string;
  defaultCta: string;
  defaultBubble: string;
  themeColor: string;
  badge: string;
  speedMultiplier: number;
  defaultFlagShape?: FlagShape;
}

export interface AdvertiserItem {
  id: string;
  title: string;
  price: string;
  imageBg: string;
  category: string;
  badge: string;
  description: string;
  specs: string[];
}

export interface Advertiser {
  id: string;
  name: string;
  logoText: string;
  contactEmail: string;
  websiteUrl: string;
  rating: number;
  totalListings: number;
  itemsForSale: AdvertiserItem[];
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  advertiserId: string;
  characterId: CharacterId;
  ctaText: string;             // Flag / Ribbon banner dynamic text
  bubbleText?: string;          // Optional speech bubble text
  flagShape?: FlagShape;       // Shape of banner flag
  accessory?: CharacterAccessory; // Customizer accessory (cape, hat, sunglasses, etc.)
  wheelColor?: string;         // Custom wheel accent color
  characterSize?: CharacterSize; // Size tier: large (100% hero), medium (78% standard), small (58% compact)
  
  // --- CHOREOGRAPHY & MULTI-CHARACTER ENCOUNTER FIELDS ---
  campaignMode: CampaignMode;
  partnerCharacterId?: CharacterId;
  partnerAdvertiserName?: string;
  dialogueScript?: DialogueScript;
  mergedBannerText?: string;   // Joint banner displayed when characters group up
  
  targetUrl: string;            
  clickBehavior: "PAGE" | "MODAL" | "URL"; 
  assignedPages: PageSlug[];    
  startDate: string;            
  endDate: string;              
  status: "ACTIVE" | "INACTIVE";
  impressions: number;
  clicks: number;
  createdAt: string;
}

