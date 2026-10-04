export type CharacterId = 
  | "wheelchair_boy" 
  | "accessible_van" 
  | "mobility_scooter" 
  | "scooter_nurse"
  | "care_nurse" 
  | "doctor_specialist" 
  | "guide_dog_duo" 
  | "prosthetic_athlete" 
  | "electric_chair" 
  | "stairlift_pro" 
  | "walker_lady" 
  | "hearing_aid_teen" 
  | "crutches_kid" 
  | "delivery_trike" 
  | "sign_language_duo"
  | "bionic_arm_builder"
  | "sensory_calm_teen"
  | "pediatric_walker_kid"
  | "carer_support_duo"
  | "target_aim_hero"
  | "target_archer_hero"
  | string;

export type PageSlug = "all" | "home" | "wheelchairs" | "vans" | "scooters" | "finance";

export type CampaignMode = "SOLO" | "CO_OP" | "CONVOY" | "RACE_OVERTAKE";

export type FlagShape = "swallowtail" | "ribbon" | "pennant" | "box";

export type CharacterAccessory = "none" | "cape" | "party_hat" | "sunglasses" | "crown" | "gold_medal";

export type CharacterSize = "small" | "medium" | "large";

export interface DialogueScript {
  char1Line: string;
  char2Line: string;
}

export interface CharacterRiggingRules {
  hasWheelSpin: boolean;
  hasBlinkingEyes: boolean;
  hasGazeTracking: boolean;
  hasBreathingTorso: boolean;
  hasWavingArm: boolean;
  hasScarfRipple: boolean;
  hasTailWag: boolean;
}

export interface CharacterAsset {
  id: string;
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
  isCustom?: boolean;
  rigging?: CharacterRiggingRules;
  customSvgContent?: string;
  baseTemplate?: "wheelchair" | "van" | "scooter" | "nurse" | "doctor" | "dog" | "runner" | "target";
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
  characterId: string;
  ctaText: string;
  bubbleText?: string;
  flagShape?: FlagShape;
  accessory?: CharacterAccessory;
  wheelColor?: string;
  characterSize?: CharacterSize;
  campaignMode: CampaignMode;
  partnerCharacterId?: string;
  partnerAdvertiserName?: string;
  dialogueScript?: DialogueScript;
  mergedBannerText?: string;
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