"use client";

import React, { useEffect, useState, useRef } from "react";
import { LivingCharacterType, LivingEmotion } from "./characters/types";
import { WheelchairHero } from "./characters/WheelchairHero";
import { AccessibleVan } from "./characters/AccessibleVan";
import { MobilityScooter } from "./characters/MobilityScooter";
import { CareNurse } from "./characters/CareNurse";
import { DoctorSpecialist } from "./characters/DoctorSpecialist";
import { GuideDogDuo } from "./characters/GuideDogDuo";
import { ProstheticAthlete } from "./characters/ProstheticAthlete";
import { TargetArcherHero } from "./characters/TargetArcherHero";
import { MOCK_CHARACTERS } from "../lib/mockData";

export type { LivingCharacterType, LivingEmotion };

interface LivingCharacterSpriteProps {
  type?: string;
  emotion?: LivingEmotion;
  speed?: number; // 0.5 to 2.5
  themeColor?: string;
  ctaText?: string;
  bubbleText?: string;
  showBubble?: boolean;
  showCta?: boolean;
  onCharacterClick?: () => void;
  onCtaClick?: () => void;
  mousePos?: { x: number; y: number };
}

export const LivingCharacterSprite: React.FC<LivingCharacterSpriteProps> = ({
  type = "wheelchair_hero",
  emotion = "CRUISING",
  speed = 1,
  themeColor = "#2563eb",
  ctaText,
  bubbleText,
  showBubble = true,
  showCta = true,
  onCharacterClick,
  onCtaClick,
  mousePos = { x: 0, y: 0 },
}) => {
  const [internalBlink, setInternalBlink] = useState(false);
  const [typedText, setTypedText] = useState("");
  const spriteRef = useRef<HTMLDivElement>(null);
  const [bubblePosition, setBubblePosition] = useState<"top" | "bottom">("top");

  const wheelDuration = Math.max(0.18, 0.85 / speed).toFixed(2);

  // Map any legacy, custom, or shorthand character ID to a guaranteed living character
  const resolveCharacterType = (rawType?: string): LivingCharacterType => {
    if (!rawType) return "wheelchair_hero";

    // Direct exact matches
    if (rawType === "target_archer_hero" || rawType === "target_aim_hero") return "target_archer_hero";
    if (rawType === "wheelchair_hero" || rawType === "wheelchair_boy") return "wheelchair_hero";
    if (rawType === "accessible_van") return "accessible_van";
    if (rawType === "mobility_scooter") return "mobility_scooter";
    if (rawType === "care_nurse") return "care_nurse";
    if (rawType === "doctor_specialist") return "doctor_specialist";
    if (rawType === "guide_dog_duo") return "guide_dog_duo";
    if (rawType === "prosthetic_athlete") return "prosthetic_athlete";

    let targetString = rawType.toLowerCase();

    // Check if rawType is in MOCK_CHARACTERS
    let foundChar = MOCK_CHARACTERS.find((c) => c.id === rawType);

    // If not, check custom characters in localStorage
    if (!foundChar && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("acm_custom_characters");
        if (saved) {
          const list = JSON.parse(saved);
          foundChar = list.find((c: any) => c.id === rawType);
        }
      } catch (e) {
        // ignore error
      }
    }

    if (foundChar) {
      if (foundChar.baseTemplate) {
        const bt = foundChar.baseTemplate.toLowerCase();
        if (bt === "target" || bt.includes("target")) return "target_archer_hero";
        if (bt === "runner" || bt.includes("runner") || bt.includes("athlete")) return "prosthetic_athlete";
        if (bt === "van" || bt.includes("van")) return "accessible_van";
        if (bt === "scooter" || bt.includes("scooter")) return "mobility_scooter";
        if (bt === "nurse" || bt.includes("nurse")) return "care_nurse";
        if (bt === "doctor" || bt.includes("doctor")) return "doctor_specialist";
        if (bt === "dog" || bt.includes("dog")) return "guide_dog_duo";
        if (bt === "wheelchair" || bt.includes("wheelchair")) return "wheelchair_hero";
        targetString = bt;
      } else {
        targetString = (foundChar.id + " " + (foundChar.category || "") + " " + (foundChar.name || "")).toLowerCase();
      }
    }

    // Keyword matching fallback
    if (
      targetString.includes("runner") ||
      targetString.includes("athlete") ||
      targetString.includes("prosthetic") ||
      targetString.includes("arm") ||
      targetString.includes("bionic") ||
      targetString.includes("robot") ||
      targetString.includes("rehabilitation")
    ) {
      return "prosthetic_athlete";
    }

    if (targetString.includes("target") || targetString.includes("aim") || targetString.includes("archer")) {
      return "target_archer_hero";
    }

    if (targetString.includes("van") || targetString.includes("vehicle") || targetString.includes("trike")) {
      return "accessible_van";
    }

    if (targetString.includes("scooter")) {
      return "mobility_scooter";
    }

    if (targetString.includes("nurse") || targetString.includes("care")) {
      return "care_nurse";
    }

    if (targetString.includes("doctor") || targetString.includes("specialist") || targetString.includes("clinical")) {
      return "doctor_specialist";
    }

    if (targetString.includes("dog") || targetString.includes("guide") || targetString.includes("sensory")) {
      return "guide_dog_duo";
    }

    if (targetString.includes("wheelchair") || targetString.includes("chair")) {
      return "wheelchair_hero";
    }

    return "wheelchair_hero";
  };

  const resolvedType = resolveCharacterType(type);

  // Typewriter effect
  useEffect(() => {
    if (!bubbleText) {
      setTypedText("");
      return;
    }
    let idx = 0;
    setTypedText("");
    const timer = setInterval(() => {
      idx++;
      setTypedText(bubbleText.slice(0, idx));
      if (idx >= bubbleText.length) {
        clearInterval(timer);
      }
    }, 22);
    return () => clearInterval(timer);
  }, [bubbleText]);

  // Periodic eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setInternalBlink(true);
      setTimeout(() => setInternalBlink(false), 160);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Viewport collision check for bubble
  useEffect(() => {
    if (!spriteRef.current) return;
    const rect = spriteRef.current.getBoundingClientRect();
    if (rect.top < 130) {
      setBubblePosition("bottom");
    } else {
      setBubblePosition("top");
    }
  }, [mousePos]);

  // Pupil offset
  const getPupilOffset = () => {
    if (!spriteRef.current) return { dx: 0, dy: 0 };
    const rect = spriteRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX);
    const dist = Math.min(2.5, Math.hypot(mousePos.x - centerX, mousePos.y - centerY) / 80);
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
    };
  };

  const pupil = getPupilOffset();

  const spriteWidth = 
    resolvedType === "accessible_van" ? 280 : 
    resolvedType === "guide_dog_duo" ? 260 : 
    resolvedType === "mobility_scooter" ? 240 : 
    resolvedType === "target_archer_hero" ? 240 : 220;

  const svgProps = {
    emotion,
    themeColor,
    internalBlink,
    pupil,
  };

  return (
    <div
      ref={spriteRef}
      className="relative select-none pointer-events-none"
      style={{ width: spriteWidth, height: 180 }}
    >
      <style>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes chassisBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.5px); }
        }
        @keyframes torsoBreathe {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.02, 0.985); }
        }
        @keyframes armWaveMotion {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(28deg); }
        }
        @keyframes scarfRipple {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(-8deg) skewX(-6deg); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes bladeStride {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes flagFlutter {
          0%, 100% { transform: skewY(0deg); }
          50% { transform: skewY(2.5deg); }
        }
        @keyframes victoryCheer {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.04); }
        }
        .anim-wheel-spin {
          animation: wheelSpin ${wheelDuration}s linear infinite;
        }
        .anim-chassis {
          animation: chassisBounce ${Math.max(0.18, 0.35 / speed)}s ease-in-out infinite;
        }
        .anim-breathe {
          animation: torsoBreathe 2.4s ease-in-out infinite;
          transform-origin: 90px 110px;
        }
        .anim-wave {
          animation: armWaveMotion 0.6s ease-in-out infinite;
          transform-origin: 88px 72px;
        }
        .anim-scarf {
          animation: scarfRipple 0.5s ease-in-out infinite;
          transform-origin: 75px 76px;
        }
        .anim-tail {
          animation: tailWag 0.25s ease-in-out infinite;
          transform-origin: 40px 135px;
        }
        .anim-blade {
          animation: bladeStride 0.4s ease-in-out infinite;
          transform-origin: 105px 120px;
        }
        .anim-flag {
          animation: flagFlutter 0.7s ease-in-out infinite;
          transform-origin: left center;
        }
        .anim-cheer {
          animation: victoryCheer 0.4s ease-in-out infinite;
        }
      `}</style>

      {/* SPEECH BUBBLE */}
      {showBubble && bubbleText && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-40 pointer-events-auto transition-all duration-300 ${
            bubblePosition === "top" ? "-top-16" : "top-[165px]"
          }`}
          style={{ minWidth: 220, maxWidth: 320 }}
        >
          <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 text-slate-800 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
            <span className="leading-snug text-slate-700">{typedText || bubbleText}</span>
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-slate-200 transform rotate-45 ${
                bubblePosition === "top"
                  ? "-bottom-1.5 border-r border-b"
                  : "-top-1.5 border-l border-t"
              }`}
            />
          </div>
        </div>
      )}

      {/* CHARACTER SPRITE */}
      <div
        onClick={onCharacterClick}
        className={`w-full h-full relative cursor-pointer pointer-events-auto transition-transform duration-200 active:scale-95 group ${
          emotion === "CELEBRATING" ? "anim-cheer" : ""
        }`}
        title="Click to interact with character"
      >
        {resolvedType === "wheelchair_hero" && <WheelchairHero {...svgProps} />}
        {resolvedType === "accessible_van" && <AccessibleVan {...svgProps} />}
        {resolvedType === "mobility_scooter" && <MobilityScooter {...svgProps} />}
        {resolvedType === "care_nurse" && <CareNurse {...svgProps} />}
        {resolvedType === "doctor_specialist" && <DoctorSpecialist {...svgProps} />}
        {resolvedType === "guide_dog_duo" && <GuideDogDuo {...svgProps} />}
        {resolvedType === "prosthetic_athlete" && <ProstheticAthlete {...svgProps} />}
        {resolvedType === "target_archer_hero" && <TargetArcherHero {...svgProps} />}
      </div>

      {/* CTA BANNER FLAG */}
      {showCta && ctaText && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onCtaClick) onCtaClick();
          }}
          className="absolute -right-4 top-6 z-30 pointer-events-auto cursor-pointer anim-flag transition-transform hover:scale-105"
        >
          <div
            style={{ backgroundColor: themeColor }}
            className="px-3 py-1.5 rounded-r-xl rounded-l-md text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border-l-2 border-white/60 hover:brightness-110"
          >
            <span>{ctaText}</span>
            <span className="text-xs">▶</span>
          </div>
        </div>
      )}
    </div>
  );
};