export type LivingCharacterType = 
  | "wheelchair_hero" 
  | "accessible_van" 
  | "mobility_scooter" 
  | "care_nurse" 
  | "doctor_specialist" 
  | "guide_dog_duo" 
  | "prosthetic_athlete"
  | "target_archer_hero";

export type LivingEmotion = "CRUISING" | "WAVING" | "TALKING" | "CELEBRATING" | "TURBO";

export interface CharacterSvgProps {
  emotion: LivingEmotion;
  themeColor: string;
  internalBlink: boolean;
  pupil: { dx: number; dy: number };
}