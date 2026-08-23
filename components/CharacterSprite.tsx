"use client";

import React from "react";
import { CharacterId, FlagShape, CharacterAccessory, CharacterSize } from "../types/campaign";
import { useTypewriter } from "../lib/useTypewriter";

interface CharacterSpriteProps {
  characterId: CharacterId;
  ctaText?: string;
  bubbleText?: string;
  themeColor?: string;
  flagShape?: FlagShape;
  accessory?: CharacterAccessory;
  wheelColor?: string;
  size?: CharacterSize;
  isHovered?: boolean;
  isTalking?: boolean;
  isWaving?: boolean;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  characterId,
  ctaText = "Click to see our products",
  bubbleText,
  themeColor = "#2563eb",
  flagShape = "swallowtail",
  accessory = "none",
  wheelColor = "#0f172a",
  size = "large",
  isHovered = false,
  isTalking = false,
  isWaving = false,
}) => {
  // Typewriter: animate bubble text character by character
  const typedBubble = useTypewriter(bubbleText, 30);

  // Render optional customizer accessory overlay (cape, party_hat, sunglasses, crown, gold_medal)
  const renderAccessoryOverlay = () => {
    if (!accessory || accessory === "none") return null;

    if (accessory === "cape") {
      return (
        <g className="animate-pulse">
          <path d="M 45 42 Q 10 55 5 95 Q 25 90 40 85 Z" fill="#dc2626" opacity="0.9" />
        </g>
      );
    }

    if (accessory === "party_hat") {
      return (
        <g transform="translate(68, 2)">
          <polygon points="10,22 0,0 20,0" fill="#ec4899" />
          <polygon points="10,22 5,0 15,0" fill="#f43f5e" />
          <circle cx="10" cy="24" r="3.5" fill="#fde047" className="animate-ping" />
          <line x1="4" y1="7" x2="16" y2="7" stroke="#fde047" strokeWidth="2" />
          <line x1="7" y1="14" x2="13" y2="14" stroke="#38bdf8" strokeWidth="2" />
        </g>
      );
    }

    if (accessory === "sunglasses") {
      return (
        <g transform="translate(65, 26)">
          <rect x="0" y="0" width="11" height="7" rx="2" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
          <rect x="13" y="0" width="11" height="7" rx="2" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
          <line x1="11" y1="3" x2="13" y2="3" stroke="#fbbf24" strokeWidth="2" />
          <line x1="2" y1="2" x2="5" y2="5" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
          <line x1="15" y1="2" x2="18" y2="5" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
        </g>
      );
    }

    if (accessory === "crown") {
      return (
        <g transform="translate(64, 4)" className="drop-shadow-md">
          <path d="M 0 16 L 3 0 L 10 10 L 17 0 L 20 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <rect x="0" y="14" width="20" height="4" rx="1" fill="#ca8a04" />
          <circle cx="3" cy="2" r="1.5" fill="#ef4444" />
          <circle cx="10" cy="10" r="1.5" fill="#3b82f6" />
          <circle cx="17" cy="2" r="1.5" fill="#ef4444" />
        </g>
      );
    }

    if (accessory === "gold_medal") {
      return (
        <g transform="translate(68, 48)">
          <path d="M 0 0 L 8 16 L 16 0" stroke="#2563eb" strokeWidth="3" fill="none" />
          <circle cx="8" cy="18" r="7" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="8" y="21" fontSize="7" textAnchor="middle" fill="#78350f" fontWeight="900" fontFamily="sans-serif">1</text>
        </g>
      );
    }

    return null;
  };

  // Render customizable trailing flag / banner depending on shape
  const renderFlagBanner = (icon: string) => {
    let clipPathStyle = "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)";
    let shapePadding = "pr-7";

    if (flagShape === "ribbon") {
      clipPathStyle = "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)";
      shapePadding = "pr-6";
    } else if (flagShape === "pennant") {
      clipPathStyle = "polygon(0% 0%, 100% 15%, 88% 50%, 100% 85%, 0% 100%)";
      shapePadding = "pr-8";
    } else if (flagShape === "box") {
      clipPathStyle = "none";
      shapePadding = "pr-4 rounded-r-2xl";
    }

    return (
      <div className="relative flex items-center -mr-3 z-10 transition-all duration-300 group-hover:scale-105">
        <div
          className={`relative py-2.5 px-4 rounded-l-2xl shadow-xl text-white font-extrabold text-xs tracking-wide whitespace-nowrap flex items-center gap-2 border-y border-l border-white/30 transition-all ${shapePadding}`}
          style={{
            background: `linear-gradient(135deg, ${themeColor}, #1e3a8a)`,
            clipPath: flagShape === "box" ? undefined : clipPathStyle,
          }}
        >
          <span className="text-sm">{icon}</span>
          <span className="drop-shadow-sm">{ctaText}</span>
        </div>
        <div className="w-6 h-1 bg-slate-400 rounded-full -ml-1"></div>
      </div>
    );
  };

  const sizeTransformClass =
    size === "small"
      ? "scale-[0.62] origin-bottom-left"
      : size === "medium"
      ? "scale-[0.80] origin-bottom-left"
      : "scale-100 origin-bottom-left";

  return (
    <div className={`relative w-full h-full flex items-center justify-start pointer-events-auto cursor-pointer group select-none transition-transform duration-300 ${sizeTransformClass}`}>
      
      {/* --- SPEECH BUBBLE OVERHEAD --- */}
      {bubbleText && (
        <div
          className={`absolute -top-14 left-10 z-40 transition-all duration-300 transform origin-bottom ${
            isHovered || isTalking ? "scale-105 -translate-y-1" : "scale-100"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black py-1.5 px-3 rounded-2xl shadow-xl border border-slate-300 whitespace-nowrap flex items-center gap-1.5 drop-shadow-md">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: themeColor }}
            ></span>
            <span>{typedBubble}</span>
          </div>
          <div className="w-3 h-3 bg-white border-b border-r border-slate-300 rotate-45 mx-auto -mt-1.5"></div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 1. WHEELCHAIR BOY (MANUAL WHEELCHAIR & FLAG) --- */}
      {/* ========================================================================= */}
      {characterId === "wheelchair_boy" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🚩")}

          <div className="relative w-36 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="80" cy="125" rx="60" ry="6" fill="#000000" opacity="0.18" />
              
              {/* Guy Body */}
              <circle cx="75" cy="35" r="14" fill="#fbcfe8" />
              <path d="M 68 25 Q 75 18 82 25 Z" fill="#334155" />
              <rect x="62" y="48" width="26" height="35" rx="8" fill="#16a34a" />
              
              {/* Arms - Wave Gesture when hovered/waving */}
              {isHovered || isWaving ? (
                <g className="animate-bounce">
                  <path d="M 75 55 L 45 65" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 75 50 L 95 30 L 105 38" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="105" cy="38" r="5" fill="#fbcfe8" />
                </g>
              ) : (
                <g>
                  <path d="M 75 55 L 45 65" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 75 55 L 85 70 L 95 65" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
                </g>
              )}

              {/* Legs */}
              <path d="M 70 80 L 95 80 L 95 105" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Wheelchair Frame */}
              <path d="M 50 45 L 55 90 L 95 90 L 105 110" stroke="#475569" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="52" y="70" width="30" height="12" rx="3" fill="#1e293b" />

              {/* Big Spinning Back Wheel */}
              <g className="animate-[spin_1.2s_linear_infinite] origin-[65px_100px]">
                <circle cx="65" cy="100" r="26" fill="#0f172a" />
                <circle cx="65" cy="100" r="22" fill="none" stroke={themeColor} strokeWidth="2.5" />
                <circle cx="65" cy="100" r="10" fill="#94a3b8" />
                <line x1="65" y1="74" x2="65" y2="126" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="39" y1="100" x2="91" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="47" y1="82" x2="83" y2="118" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="47" y1="118" x2="83" y2="82" stroke="#cbd5e1" strokeWidth="2" />
              </g>

              {/* Small Front Caster Wheel */}
              <g className="animate-[spin_0.8s_linear_infinite] origin-[112px_112px]">
                <circle cx="112" cy="112" r="9" fill="#0f172a" />
                <circle cx="112" cy="112" r="4" fill="#cbd5e1" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 2. ACCESSIBLE MINIVAN (RAMP VAN & RIBBON BANNER) --- */}
      {/* ========================================================================= */}
      {characterId === "accessible_van" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🚐")}

          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 240 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="120" cy="125" rx="100" ry="7" fill="#000000" opacity="0.2" />
              
              {/* Body */}
              <path d="M 20 95 Q 20 40 40 30 L 140 30 Q 160 30 170 50 L 210 50 Q 230 50 230 80 L 230 95 Q 230 110 215 110 L 35 110 Q 20 110 20 95 Z" fill={themeColor} />
              
              {/* Side White Door/Panel for Business */}
              <rect x="45" y="42" width="85" height="48" rx="6" fill="#ffffff" />
              <rect x="48" y="45" width="79" height="42" rx="4" fill="#f8fafc" />
              <text x="88" y="66" fill="#0f172a" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">ABC</text>
              <text x="88" y="78" fill={themeColor} fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">MOBILITY</text>

              {/* Windshield */}
              <path d="M 145 35 L 165 50 L 195 50 L 195 72 L 145 72 Z" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="2" />
              
              {/* Driver Inside */}
              <circle cx="165" cy="58" r="6" fill="#fbcfe8" />
              <path d="M 160 68 Q 165 62 175 66" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

              {/* Headlights Beam */}
              <rect x="225" y="70" width="7" height="14" rx="3" fill="#fef08a" />
              <path d="M 232 77 L 260 62 L 260 92 Z" fill="#fef08a" opacity="0.4" />

              {/* Animated Spinning Wheels */}
              <g className="animate-[spin_1.2s_linear_infinite] origin-[60px_108px]">
                <circle cx="60" cy="108" r="18" fill="#0f172a" />
                <circle cx="60" cy="108" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
              </g>
              <g className="animate-[spin_1.2s_linear_infinite] origin-[185px_108px]">
                <circle cx="185" cy="108" r="18" fill="#0f172a" />
                <circle cx="185" cy="108" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 3. SCOOTER & NURSE WITH GUIDE DOG --- */}
      {/* ========================================================================= */}
      {characterId === "scooter_nurse" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🛵")}

          <div className="relative w-52 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 260 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="130" cy="125" rx="110" ry="7" fill="#000000" opacity="0.2" />

              {/* 1. Lady on Mobility Scooter */}
              <rect x="25" y="92" width="85" height="15" rx="6" fill="#16a34a" />
              <rect x="40" y="55" width="12" height="40" rx="4" fill="#1e293b" />
              <rect x="35" y="48" width="22" height="12" rx="3" fill="#16a34a" />
              
              {/* Elderly Lady */}
              <circle cx="50" cy="35" r="10" fill="#fde047" />
              <circle cx="50" cy="38" r="8" fill="#fed7aa" />
              <rect x="42" y="48" width="20" height="25" rx="5" fill="#db2777" />

              {/* Scooter Wheels */}
              <g className="animate-[spin_1.2s_linear_infinite] origin-[35px_107px]">
                <circle cx="35" cy="107" r="12" fill="#0f172a" />
                <circle cx="35" cy="107" r="5" fill="#cbd5e1" />
              </g>
              <g className="animate-[spin_1.2s_linear_infinite] origin-[95px_107px]">
                <circle cx="95" cy="107" r="12" fill="#0f172a" />
                <circle cx="95" cy="107" r="5" fill="#cbd5e1" />
              </g>

              {/* 2. Nurse Walking */}
              <g transform="translate(115, 15)">
                <circle cx="20" cy="20" r="10" fill="#fed7aa" />
                <path d="M 12 14 Q 20 8 28 14 Z" fill="#475569" />
                <rect x="10" y="32" width="20" height="38" rx="6" fill="#0284c7" />
                <path d="M 14 70 L 10 95" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" className="animate-pulse" />
                <path d="M 26 70 L 30 95" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" className="animate-pulse" />
              </g>

              {/* 3. Golden Retriever Guide Dog */}
              <g transform="translate(170, 60)">
                <ellipse cx="25" cy="30" rx="20" ry="12" fill="#eab308" />
                <circle cx="42" cy="18" r="10" fill="#eab308" />
                <rect x="15" y="24" width="18" height="8" rx="2" fill="#ef4444" />
                <line x1="12" y1="40" x2="12" y2="52" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                <line x1="20" y1="40" x2="20" y2="52" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                <line x1="32" y1="40" x2="32" y2="52" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                <line x1="38" y1="40" x2="38" y2="52" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                <path d="M 5 25 Q -5 15 0 10" stroke="#eab308" strokeWidth="4" strokeLinecap="round" className="animate-bounce" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 4. POWERGLIDE PRO ELECTRIC CHAIR (BESPOKE SVG) --- */}
      {/* ========================================================================= */}
      {characterId === "electric_chair" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦼")}

          <div className="relative w-40 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 180 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="90" cy="125" rx="65" ry="6" fill="#000000" opacity="0.2" />
              
              {/* Backrest & Headrest */}
              <rect x="45" y="25" width="22" height="15" rx="4" fill="#7c3aed" /> {/* Headrest */}
              <rect x="48" y="40" width="16" height="55" rx="5" fill="#1e293b" /> {/* Back spine */}
              <rect x="52" y="45" width="24" height="45" rx="6" fill="#334155" /> {/* Cushion */}

              {/* Rider Guy / Lady */}
              <circle cx="68" cy="35" r="11" fill="#fed7aa" />
              <path d="M 60 28 Q 68 20 76 28 Z" fill="#64748b" />
              <rect x="60" y="48" width="22" height="30" rx="6" fill="#6d28d9" />

              {/* Joystick Controller Armrest */}
              <path d="M 70 65 L 105 65 L 105 75" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
              <rect x="98" y="58" width="14" height="10" rx="3" fill="#0f172a" />
              <circle cx="105" cy="54" r="3" fill="#ef4444" /> {/* Joystick knob */}
              <circle cx="102" cy="62" r="2" fill="#22c55e" className="animate-ping" /> {/* Status LED */}

              {/* Footrest */}
              <path d="M 72 78 L 98 85 L 115 105 L 125 105" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Main Power Chassis Box */}
              <rect x="50" y="85" width="65" height="22" rx="6" fill="#0f172a" />
              <rect x="54" y="89" width="57" height="14" rx="4" fill="#1e293b" />
              <text x="82" y="100" fill="#a78bfa" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">POWER PRO</text>

              {/* Big Drive Wheel */}
              <g className="animate-[spin_1s_linear_infinite] origin-[80px_110px]">
                <circle cx="80" cy="110" r="22" fill="#0f172a" />
                <circle cx="80" cy="110" r="16" fill="none" stroke="#7c3aed" strokeWidth="3" />
                <circle cx="80" cy="110" r="8" fill="#cbd5e1" />
                <line x1="80" y1="88" x2="80" y2="132" stroke="#94a3b8" strokeWidth="2" />
                <line x1="58" y1="110" x2="102" y2="110" stroke="#94a3b8" strokeWidth="2" />
              </g>

              {/* Front Caster Wheel */}
              <g className="animate-[spin_0.7s_linear_infinite] origin-[125px_118px]">
                <circle cx="125" cy="118" r="8" fill="#0f172a" />
                <circle cx="125" cy="118" r="3" fill="#cbd5e1" />
              </g>

              {/* Rear Anti-Tip Caster */}
              <g className="animate-[spin_0.7s_linear_infinite] origin-[42px_118px]">
                <circle cx="42" cy="118" r="6" fill="#0f172a" />
                <circle cx="42" cy="118" r="2" fill="#cbd5e1" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 5. EASYCLIMB STAIRLIFT PRO (BESPOKE RAIL & SEAT SVG) --- */}
      {/* ========================================================================= */}
      {characterId === "stairlift_pro" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🛗")}

          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 220 140" className="w-full h-full drop-shadow-xl overflow-visible">
              {/* Diagonal Rail Track */}
              <line x1="10" y1="125" x2="210" y2="65" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <line x1="10" y1="125" x2="210" y2="65" stroke="#ea580c" strokeWidth="2" strokeDasharray="6,4" />

              <g transform="translate(60, 20)">
                {/* Stairlift Seat Chassis Base gliding on rail */}
                <rect x="25" y="65" width="45" height="18" rx="4" fill="#0f172a" />
                <circle cx="35" cy="80" r="5" fill="#f97316" />
                <circle cx="60" cy="73" r="5" fill="#f97316" />

                {/* Swivel Chair Seat */}
                <rect x="20" y="25" width="12" height="42" rx="4" fill="#ea580c" />
                <rect x="20" y="55" width="45" height="12" rx="4" fill="#ea580c" />

                {/* Elderly Rider */}
                <circle cx="38" cy="18" r="10" fill="#e2e8f0" /> {/* Grey hair */}
                <circle cx="38" cy="20" r="8" fill="#fed7aa" />
                <rect x="30" y="30" width="22" height="26" rx="5" fill="#c2410c" />

                {/* Armrest with controls */}
                <rect x="28" y="42" width="30" height="6" rx="2" fill="#1e293b" />
                <circle cx="54" cy="45" r="3" fill="#22c55e" className="animate-ping" />

                {/* Foldable Footrest */}
                <rect x="35" y="78" width="30" height="6" rx="2" fill="#475569" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 6. ACTIVE ROLLATOR WALKER SENIOR (BESPOKE SVG) --- */}
      {/* ========================================================================= */}
      {characterId === "walker_lady" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦯")}

          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="100" cy="125" rx="80" ry="6" fill="#000000" opacity="0.18" />

              {/* Senior Lady Walking */}
              <g transform="translate(30, 10)">
                <circle cx="35" cy="20" r="10" fill="#f1f5f9" /> {/* Curly Silver Hair */}
                <circle cx="35" cy="22" r="8" fill="#fed7aa" />
                <rect x="25" y="32" width="22" height="38" rx="6" fill="#059669" /> {/* Emerald Coat */}

                {/* Legs walking cycle animation */}
                <path d="M 28 70 L 22 98" stroke="#047857" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                <path d="M 40 70 L 48 98" stroke="#047857" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />

                {/* Arms holding Walker Handles */}
                <path d="M 36 42 L 65 55" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* 4-Wheel Rollator Walker Frame */}
              <g transform="translate(85, 45)">
                {/* Frame Tubes */}
                <path d="M 10 20 L 25 70 M 10 20 L 45 70" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                <rect x="5" y="15" width="12" height="6" rx="2" fill="#0f172a" /> {/* Hand Grip */}

                {/* Seat & Basket */}
                <rect x="18" y="42" width="28" height="8" rx="2" fill="#0f172a" />
                <rect x="20" y="50" width="24" height="15" rx="3" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,2" />
                <text x="32" y="60" fontSize="10" textAnchor="middle">🛍️</text> {/* Shopping */}

                {/* 4 Small Caster Wheels */}
                <g className="animate-[spin_1s_linear_infinite] origin-[25px_72px]">
                  <circle cx="25" cy="72" r="8" fill="#0f172a" />
                  <circle cx="25" cy="72" r="3" fill="#cbd5e1" />
                </g>
                <g className="animate-[spin_1s_linear_infinite] origin-[45px_72px]">
                  <circle cx="45" cy="72" r="8" fill="#0f172a" />
                  <circle cx="45" cy="72" r="3" fill="#cbd5e1" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 7. GUIDE DOG & HANDLER DUO --- */}
      {/* ========================================================================= */}
      {characterId === "guide_dog_duo" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦮")}
          <div className="relative w-52 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 260 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="130" cy="128" rx="105" ry="6" fill="#000000" opacity="0.18" />

              {/* Handler Person */}
              <g transform="translate(140, 10)">
                {/* Head with dark glasses */}
                <circle cx="28" cy="20" r="12" fill="#fcd9a0" />
                <rect x="18" y="18" width="20" height="6" rx="3" fill="#0f172a" />
                {/* Hair */}
                <path d="M 18 15 Q 28 8 38 15" fill="#1e293b" />
                {/* Body */}
                <rect x="18" y="32" width="22" height="36" rx="7" fill="#b45309" />
                {/* Arms - white cane */}
                <path d="M 18 42 L 2 80" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
                <path d="M 2 80 L 0 110" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="112" r="4" fill="#94a3b8" />
                {/* Harness leash to dog */}
                <path d="M 36 48 Q 20 55 5 58" stroke="#b45309" strokeWidth="3" strokeDasharray="4,3" strokeLinecap="round" />
                {/* Legs walking */}
                <path d="M 22 68 L 16 100" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" className="animate-pulse" />
                <path d="M 32 68 L 38 100" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />
              </g>

              {/* Guide Dog with Harness */}
              <g transform="translate(30, 60)">
                {/* Dog body */}
                <ellipse cx="55" cy="38" rx="42" ry="22" fill="#c2954a" />
                {/* Harness vest */}
                <rect x="28" y="24" width="40" height="18" rx="5" fill="#f97316" opacity="0.85" />
                <text x="48" y="37" fontSize="8" textAnchor="middle" fill="white" fontWeight="900" fontFamily="sans-serif">GUIDE</text>
                {/* Dog head */}
                <ellipse cx="88" cy="28" rx="18" ry="16" fill="#c2954a" />
                <ellipse cx="98" cy="32" rx="8" ry="6" fill="#a87535" /> {/* Snout */}
                <circle cx="100" cy="30" r="2" fill="#0f172a" />
                <path d="M 98 37 Q 105 42 98 42" stroke="#e2e8f0" strokeWidth="2" /> {/* Mouth */}
                <ellipse cx="82" cy="16" rx="7" ry="12" fill="#a87535" className="animate-[wiggle_0.8s_ease-in-out_infinite]" />
                <ellipse cx="94" cy="16" rx="5" ry="12" fill="#a87535" />
                {/* Dog tail wagging */}
                <path d="M 14 30 Q 5 20 2 10" stroke="#c2954a" strokeWidth="6" strokeLinecap="round" className="animate-bounce" />
                {/* Legs */}
                <line x1="30" y1="55" x2="22" y2="72" stroke="#a87535" strokeWidth="5" strokeLinecap="round" />
                <line x1="45" y1="57" x2="40" y2="74" stroke="#a87535" strokeWidth="5" strokeLinecap="round" />
                <line x1="65" y1="57" x2="70" y2="74" stroke="#a87535" strokeWidth="5" strokeLinecap="round" />
                <line x1="78" y1="55" x2="85" y2="72" stroke="#a87535" strokeWidth="5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 8. HEARING AID TEEN WITH SKATEBOARD --- */}
      {/* ========================================================================= */}
      {characterId === "hearing_aid_teen" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🎧")}
          <div className="relative w-40 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 180 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="90" cy="128" rx="72" ry="6" fill="#000000" opacity="0.18" />

              {/* Teen Body */}
              <g transform="translate(40, 8)">
                {/* Head */}
                <circle cx="45" cy="22" r="14" fill="#fddba8" />
                {/* Cool messy hair */}
                <path d="M 32 18 Q 38 8 45 10 Q 52 7 58 18 Q 53 12 45 14 Q 37 12 32 18" fill="#1e293b" />
                {/* Behind-the-ear hearing aid — BTE device */}
                <rect x="56" y="16" width="5" height="12" rx="2.5" fill="#0891b2" />
                <circle cx="58" cy="28" r="3" fill="#0891b2" className="animate-ping" />
                {/* Earbud wire */}
                <path d="M 57 22 Q 60 26 58 30" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
                {/* T-Shirt */}
                <rect x="31" y="36" width="28" height="38" rx="7" fill="#0891b2" />
                <text x="45" y="56" fontSize="7" textAnchor="middle" fill="white" fontWeight="900" fontFamily="sans-serif">HEAR</text>
                <text x="45" y="65" fontSize="7" textAnchor="middle" fill="white" fontWeight="900" fontFamily="sans-serif">ME</text>
                {/* Skateboard under arm */}
                <rect x="55" y="52" width="32" height="9" rx="3" fill="#0f172a" />
                <rect x="55" y="56" width="32" height="5" rx="2" fill="#0891b2" opacity="0.7" />
                <g className="animate-[spin_0.7s_linear_infinite] origin-[62px_63px]">
                  <circle cx="62" cy="63" r="4" fill="#0f172a" />
                  <circle cx="62" cy="63" r="2" fill="#94a3b8" />
                </g>
                <g className="animate-[spin_0.7s_linear_infinite] origin-[79px_63px]">
                  <circle cx="79" cy="63" r="4" fill="#0f172a" />
                  <circle cx="79" cy="63" r="2" fill="#94a3b8" />
                </g>
                {/* Arms */}
                <path d="M 31 44 L 12 60" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                <path d="M 59 44 L 58 54" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                {/* Legs */}
                <path d="M 36 74 L 30 108" stroke="#1e3a5f" strokeWidth="7" strokeLinecap="round" />
                <path d="M 50 74 L 56 108" stroke="#1e3a5f" strokeWidth="7" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 9. BLADE RUNNER PROSTHETIC ATHLETE --- */}
      {/* ========================================================================= */}
      {characterId === "prosthetic_athlete" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🏃")}
          <div className="relative w-40 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 180 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="90" cy="128" rx="65" ry="6" fill="#000000" opacity="0.18" />

              {/* Athlete sprinting pose */}
              <g transform="translate(30, 5)">
                {/* Head — leaning forward */}
                <circle cx="85" cy="22" r="12" fill="#c8845a" />
                {/* Helmet */}
                <path d="M 74 22 Q 74 10 85 10 Q 96 10 96 22" fill="#dc2626" />
                {/* Body — leaning torso */}
                <rect x="74" y="34" width="22" height="30" rx="6" fill="#dc2626" transform="rotate(-8, 85, 49)" />

                {/* Normal left leg — bent back in sprint */}
                <path d="M 80 62 L 70 90 L 60 110" stroke="#c8845a" strokeWidth="7" strokeLinecap="round" className="animate-pulse" />

                {/* Carbon blade right prosthetic */}
                <path d="M 88 62 L 95 90" stroke="#c8845a" strokeWidth="7" strokeLinecap="round" />
                {/* The C-shaped blade */}
                <path d="M 95 90 Q 120 100 115 118 Q 110 130 98 128" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M 95 90 Q 118 98 113 116 Q 108 126 100 124" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Arms pumping */}
                <path d="M 76 38 L 55 28" stroke="#c8845a" strokeWidth="6" strokeLinecap="round" />
                <path d="M 94 38 L 112 52" stroke="#c8845a" strokeWidth="6" strokeLinecap="round" />

                {/* Motion lines */}
                <line x1="30" y1="50" x2="50" y2="50" stroke="#dc2626" strokeWidth="2" opacity="0.6" />
                <line x1="25" y1="60" x2="45" y2="60" stroke="#dc2626" strokeWidth="2" opacity="0.4" />
                <line x1="28" y1="70" x2="48" y2="70" stroke="#dc2626" strokeWidth="2" opacity="0.3" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 10. ADVENTURE KID ON CRUTCHES (SUPERHERO CAPE) --- */}
      {/* ========================================================================= */}
      {characterId === "crutches_kid" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦸")}
          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="100" cy="128" rx="75" ry="6" fill="#000000" opacity="0.18" />

              {/* Kid body */}
              <g transform="translate(40, 5)">
                {/* Head */}
                <circle cx="55" cy="22" r="13" fill="#fddba8" />
                {/* Hair */}
                <path d="M 44 18 Q 55 8 66 18 Q 60 12 55 13 Q 50 12 44 18" fill="#92400e" />
                {/* Big happy smile */}
                <path d="M 49 26 Q 55 32 61 26" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Eyes */}
                <circle cx="51" cy="21" r="2" fill="#0f172a" />
                <circle cx="59" cy="21" r="2" fill="#0f172a" />

                {/* Superhero cape — billowing */}
                <path d="M 44 36 Q 30 55 25 80 Q 35 75 45 72 Q 45 55 55 45 Z" fill="#7c3aed" className="animate-pulse" />

                {/* Body — superhero shirt */}
                <rect x="42" y="34" width="26" height="32" rx="7" fill="#7c3aed" />
                <text x="55" y="52" fontSize="9" textAnchor="middle" fill="#fbbf24" fontWeight="900" fontFamily="sans-serif">⚡</text>

                {/* Left forearm crutch */}
                <path d="M 42 44 L 20 50" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
                <path d="M 20 50 L 8 90" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <rect x="5" y="88" width="10" height="3" rx="1.5" fill="#64748b" />
                <rect x="12" y="50" width="14" height="4" rx="2" fill="#64748b" /> {/* Cuff */}

                {/* Right forearm crutch */}
                <path d="M 68 44 L 85 50" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
                <path d="M 85 50 L 95 90" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <rect x="93" y="88" width="10" height="3" rx="1.5" fill="#64748b" />
                <rect x="82" y="50" width="14" height="4" rx="2" fill="#64748b" />

                {/* Legs */}
                <path d="M 48 66 L 42 105" stroke="#4c1d95" strokeWidth="7" strokeLinecap="round" />
                <path d="M 62 66 L 68 105" stroke="#4c1d95" strokeWidth="7" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 11. ADAPTIVE CARGO DELIVERY TRIKE --- */}
      {/* ========================================================================= */}
      {characterId === "delivery_trike" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🚲")}
          <div className="relative w-52 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 260 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="130" cy="128" rx="108" ry="6" fill="#000000" opacity="0.2" />

              {/* Cargo Crate */}
              <rect x="15" y="50" width="75" height="55" rx="5" fill="#0d9488" />
              <rect x="20" y="55" width="65" height="45" rx="3" fill="#134e4a" />
              <text x="52" y="75" fontSize="9" textAnchor="middle" fill="#5eead4" fontWeight="900" fontFamily="sans-serif">MOBILITY</text>
              <text x="52" y="86" fontSize="9" textAnchor="middle" fill="#5eead4" fontWeight="900" fontFamily="sans-serif">DELIVERY</text>
              <text x="52" y="96" fontSize="10" textAnchor="middle">📦</text>

              {/* Frame connecting crate to rider */}
              <line x1="90" y1="90" x2="145" y2="90" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
              <line x1="120" y1="90" x2="120" y2="65" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
              {/* Handlebars */}
              <path d="M 112 65 L 130 65 L 130 58" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <rect x="125" y="55" width="12" height="5" rx="2.5" fill="#0f172a" />

              {/* Rider */}
              <circle cx="145" cy="42" r="11" fill="#fddba8" />
              <path d="M 135 42 Q 145 32 155 42" fill="#0d9488" /> {/* Helmet */}
              <rect x="133" y="53" width="24" height="28" rx="7" fill="#0d9488" />
              {/* Rider legs pedalling */}
              <path d="M 138 80 L 128 100" stroke="#115e59" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
              <path d="M 152 80 L 165 96" stroke="#115e59" strokeWidth="6" strokeLinecap="round" />
              {/* Pedals */}
              <circle cx="145" cy="92" r="8" fill="#0f172a" stroke="#0d9488" strokeWidth="2" />
              <line x1="138" y1="92" x2="152" y2="92" stroke="#94a3b8" strokeWidth="3" />

              {/* Two rear wheels */}
              <g className="animate-[spin_1s_linear_infinite] origin-[40px_108px]">
                <circle cx="40" cy="108" r="20" fill="#0f172a" />
                <circle cx="40" cy="108" r="8" fill="#4b5563" />
                <line x1="40" y1="88" x2="40" y2="128" stroke="#6b7280" strokeWidth="2" />
                <line x1="20" y1="108" x2="60" y2="108" stroke="#6b7280" strokeWidth="2" />
              </g>
              <g className="animate-[spin_1s_linear_infinite] origin-[88px_108px]">
                <circle cx="88" cy="108" r="20" fill="#0f172a" />
                <circle cx="88" cy="108" r="8" fill="#4b5563" />
                <line x1="88" y1="88" x2="88" y2="128" stroke="#6b7280" strokeWidth="2" />
                <line x1="68" y1="108" x2="108" y2="108" stroke="#6b7280" strokeWidth="2" />
              </g>

              {/* Front wheel */}
              <g className="animate-[spin_1.2s_linear_infinite] origin-[200px_108px]">
                <circle cx="200" cy="108" r="24" fill="#0f172a" />
                <circle cx="200" cy="108" r="10" fill="#4b5563" stroke="#64748b" strokeWidth="2" />
                <line x1="200" y1="84" x2="200" y2="132" stroke="#6b7280" strokeWidth="2" />
                <line x1="176" y1="108" x2="224" y2="108" stroke="#6b7280" strokeWidth="2" />
                <line x1="183" y1="91" x2="217" y2="125" stroke="#6b7280" strokeWidth="2" />
                <line x1="183" y1="125" x2="217" y2="91" stroke="#6b7280" strokeWidth="2" />
              </g>

              {/* Fork connecting pedal to front wheel */}
              <line x1="152" y1="92" x2="180" y2="108" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 12. SIGN LANGUAGE DUO --- */}
      {/* ========================================================================= */}
      {characterId === "sign_language_duo" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🤟")}
          <div className="relative w-52 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 260 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="130" cy="128" rx="105" ry="6" fill="#000000" opacity="0.18" />

              {/* Person 1 — signing with left hand raised */}
              <g transform="translate(20, 10)">
                <circle cx="40" cy="22" r="12" fill="#fddba8" />
                <path d="M 30 18 Q 40 10 50 18" fill="#7c2d12" />
                <rect x="28" y="34" width="24" height="32" rx="7" fill="#a21caf" />
                {/* Right arm pointing forward to Person 2 */}
                <path d="M 52 42 L 80 38" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                {/* Sign language hand — ILY hand shape */}
                <g transform="translate(76, 25)">
                  {/* Palm */}
                  <rect x="0" y="8" width="14" height="16" rx="3" fill="#fddba8" />
                  {/* Index finger up */}
                  <rect x="3" y="0" width="5" height="12" rx="2.5" fill="#fddba8" />
                  {/* Pinky extended */}
                  <rect x="10" y="1" width="4" height="10" rx="2" fill="#fddba8" />
                  {/* Thumb out */}
                  <rect x="-5" y="10" width="8" height="4" rx="2" fill="#fddba8" />
                </g>
                {/* Left arm down */}
                <path d="M 28 42 L 18 68" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                {/* Legs */}
                <path d="M 34 66 L 28 102" stroke="#7e22ce" strokeWidth="7" strokeLinecap="round" />
                <path d="M 46 66 L 52 102" stroke="#7e22ce" strokeWidth="7" strokeLinecap="round" />
              </g>

              {/* Communication lines / bubbles between them */}
              <g transform="translate(110, 30)">
                <circle cx="20" cy="10" r="4" fill="#a21caf" opacity="0.4" className="animate-ping" />
                <circle cx="28" cy="25" r="3" fill="#a21caf" opacity="0.6" className="animate-ping" style={{animationDelay: "0.2s"}} />
                <circle cx="20" cy="40" r="4" fill="#a21caf" opacity="0.4" className="animate-ping" style={{animationDelay: "0.4s"}} />
                <text x="24" y="18" fontSize="12" textAnchor="middle">🤟</text>
              </g>

              {/* Person 2 — signing back (mirror) */}
              <g transform="translate(145, 10)">
                <circle cx="52" cy="22" r="12" fill="#c8845a" />
                <path d="M 42 18 Q 52 10 62 18" fill="#1e293b" />
                <rect x="40" y="34" width="24" height="32" rx="7" fill="#a21caf" />
                {/* Left arm raised to sign */}
                <path d="M 40 42 L 12 35" stroke="#c8845a" strokeWidth="6" strokeLinecap="round" />
                {/* Sign language hand shape on left side */}
                <g transform="translate(-8, 22)">
                  <rect x="0" y="8" width="14" height="16" rx="3" fill="#c8845a" />
                  <rect x="3" y="0" width="5" height="12" rx="2.5" fill="#c8845a" />
                  <rect x="8" y="1" width="4" height="10" rx="2" fill="#c8845a" />
                  <rect x="12" y="10" width="7" height="4" rx="2" fill="#c8845a" />
                </g>
                {/* Right arm — wave back when hovering */}
                {isHovered || isWaving ? (
                  <path d="M 64 42 L 84 28" stroke="#c8845a" strokeWidth="6" strokeLinecap="round" className="animate-bounce" />
                ) : (
                  <path d="M 64 42 L 80 60" stroke="#c8845a" strokeWidth="6" strokeLinecap="round" />
                )}
                {/* Legs */}
                <path d="M 46 66 L 40 102" stroke="#7e22ce" strokeWidth="7" strokeLinecap="round" />
                <path d="M 58 66 L 64 102" stroke="#7e22ce" strokeWidth="7" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* --- 13. BIONIC ARM BUILDER --- */}
      {/* ========================================================================= */}
      {characterId === "bionic_arm_builder" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦾")}
          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="95" cy="128" rx="80" ry="6" fill="#000000" opacity="0.18" />

              {/* Person Body */}
              <g transform="translate(60, 8)">
                {/* Head & Hair */}
                <circle cx="36" cy="22" r="13" fill="#fddba8" />
                <path d="M 23 18 Q 36 6 49 18 Q 44 26 23 18 Z" fill="#1e293b" />
                {/* Eyeglasses */}
                <rect x="32" y="18" width="10" height="7" rx="2" fill="none" stroke="#0284c7" strokeWidth="2" />
                <line x1="30" y1="21" x2="32" y2="21" stroke="#0284c7" strokeWidth="1.5" />
                
                {/* Torso / Tech Vest */}
                <rect x="23" y="34" width="26" height="36" rx="6" fill="#0369a1" />
                <rect x="28" y="38" width="16" height="28" rx="3" fill="#0284c7" />
                {renderAccessoryOverlay()}

                {/* Left Arm: High-tech Bionic Arm with Glowing Circuit Nodes */}
                <g className={isHovered ? "animate-pulse" : ""}>
                  {/* Shoulder Joint */}
                  <circle cx="20" cy="40" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Bionic Upper Arm */}
                  <path d="M 20 40 L 4 64" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                  <line x1="18" y1="42" x2="6" y2="60" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Elbow Servo */}
                  <circle cx="4" cy="64" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  {/* Bionic Forearm & Articulated Hand */}
                  <path d="M 4 64 L -12 52" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
                  {/* Glowing Energy Node */}
                  <circle cx="-12" cy="52" r="4" fill="#38bdf8" className="animate-ping" opacity="0.8" />
                  <circle cx="-12" cy="52" r="3.5" fill="#38bdf8" />
                  {/* Articulated Bionic Fingers holding a holographic tablet */}
                  <rect x="-24" y="38" width="16" height="22" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
                  <line x1="-20" y1="44" x2="-12" y2="44" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="-20" y1="49" x2="-14" y2="49" stroke="#38bdf8" strokeWidth="1.5" />
                </g>

                {/* Right Arm: Natural arm waving or holding stylus */}
                {isHovered || isWaving ? (
                  <path d="M 48 40 L 68 22" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" className="animate-bounce" />
                ) : (
                  <path d="M 48 40 L 56 62" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                )}

                {/* Legs & Tech Sneakers */}
                <path d="M 28 68 L 22 106" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                <path d="M 44 68 L 48 106" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                <rect x="14" y="104" width="16" height="8" rx="3" fill="#0284c7" />
                <rect x="42" y="104" width="16" height="8" rx="3" fill="#0284c7" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 14. SENSORY CALM TEEN --- */}
      {/* ========================================================================= */}
      {characterId === "sensory_calm_teen" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🎧")}
          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="95" cy="128" rx="75" ry="6" fill="#000000" opacity="0.18" />

              {/* Ambient Calming Soundwave Aura */}
              <g transform="translate(68, 8)">
                <circle cx="36" cy="22" r="26" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.3" className="animate-ping" style={{animationDuration: "3s"}} />
                <circle cx="36" cy="22" r="32" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.2" className="animate-ping" style={{animationDuration: "4s"}} />

                {/* Head & Soft Curly Hair */}
                <circle cx="36" cy="22" r="13" fill="#fed7aa" />
                <path d="M 22 18 Q 36 4 50 18 Q 46 28 22 18 Z" fill="#92400e" />

                {/* Over-Ear Noise Cancelling Headphones */}
                <path d="M 21 22 A 16 16 0 0 1 51 22" fill="none" stroke="#6d28d9" strokeWidth="4" strokeLinecap="round" />
                <rect x="18" y="16" width="7" height="13" rx="3" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" />
                <rect x="47" y="16" width="7" height="13" rx="3" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" />

                {/* Cozy Oversized Hoodie */}
                <rect x="20" y="34" width="32" height="38" rx="8" fill="#8b5cf6" />
                <path d="M 28 34 L 36 50 L 44 34" fill="#7c3aed" opacity="0.7" />
                {renderAccessoryOverlay()}

                {/* Left Arm holding glowing tactile fidget spinner */}
                <path d="M 20 42 L 8 62" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" />
                <circle cx="6" cy="64" r="5" fill="#fed7aa" />
                <circle cx="6" cy="64" r="8" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" style={{animationDuration: "2s"}} />
                <circle cx="6" cy="64" r="3" fill="#38bdf8" />

                {/* Right Arm: peaceful wave or gentle posture */}
                {isHovered || isWaving ? (
                  <path d="M 52 42 L 68 28" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" className="animate-bounce" />
                ) : (
                  <path d="M 52 42 L 60 66" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" />
                )}

                {/* Relaxed Pants & Shoes */}
                <path d="M 28 70 L 24 106" stroke="#4c1d95" strokeWidth="7" strokeLinecap="round" />
                <path d="M 44 70 L 48 106" stroke="#4c1d95" strokeWidth="7" strokeLinecap="round" />
                <rect x="16" y="104" width="16" height="8" rx="3" fill="#a78bfa" />
                <rect x="42" y="104" width="16" height="8" rx="3" fill="#a78bfa" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 15. PEDIATRIC SUPERHERO WALKER --- */}
      {/* ========================================================================= */}
      {characterId === "pediatric_walker_kid" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("🦸‍♂️")}
          <div className="relative w-44 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="95" cy="128" rx="80" ry="6" fill="#000000" opacity="0.18" />

              {/* Posterior Pediatric Walker Frame (Bright Red/Orange) */}
              <g transform="translate(45, 12)">
                {/* Main Posterior U-Frame surrounding the child from behind */}
                <path d="M 12 35 L 12 85 L 35 98 L 78 98" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
                <path d="M 12 35 L 65 35" fill="none" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
                
                {/* Rear Wheels with Light-Up Speed Sparks */}
                <circle cx="12" cy="98" r="9" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
                <circle cx="12" cy="98" r="4" fill="#ea580c" className="animate-spin" />
                {/* Front Swivel Caster Wheels with Light-up glow */}
                <circle cx="78" cy="98" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="78" cy="98" r="3" fill="#38bdf8" className="animate-ping" opacity="0.7" />

                {/* Superhero Child inside walker */}
                <g transform="translate(32, 4)">
                  {/* Flapping Superhero Cape */}
                  <path d="M 12 28 Q -8 40 -18 70 Q -4 65 14 55 Z" fill="#dc2626" opacity="0.9" className="animate-pulse" />

                  {/* Head & Joyful Smile */}
                  <circle cx="24" cy="16" r="11" fill="#fddba8" />
                  <path d="M 14 12 Q 24 2 34 12 Z" fill="#b45309" />
                  <path d="M 20 18 Q 24 23 28 18" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                  {/* Superhero Shirt with Star Badge */}
                  <rect x="14" y="26" width="20" height="28" rx="5" fill="#2563eb" />
                  <circle cx="24" cy="38" r="4.5" fill="#facc15" />
                  <text x="24" y="41" fontSize="6" textAnchor="middle" fill="#1e3a8a" fontWeight="bold">★</text>
                  {renderAccessoryOverlay()}

                  {/* Arms gripping ergonomic walker handgrips */}
                  <path d="M 16 32 L -4 30" stroke="#fddba8" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 32 32 L 38 31" stroke="#fddba8" strokeWidth="5" strokeLinecap="round" />

                  {/* Energetic Striding Legs with AFO Braces */}
                  <path d="M 18 52 L 12 82" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
                  {/* AFO Ankle Brace (Bright Teal) */}
                  <rect x="8" y="72" width="8" height="12" rx="2" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                  
                  <path d="M 28 52 L 34 82" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
                  <rect x="30" y="72" width="8" height="12" rx="2" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                  {/* Sneakers */}
                  <rect x="6" y="82" width="13" height="6" rx="2" fill="#ea580c" />
                  <rect x="28" y="82" width="13" height="6" rx="2" fill="#ea580c" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 16. CARER SUPPORT DUO --- */}
      {/* ========================================================================= */}
      {characterId === "carer_support_duo" && (
        <div className="relative flex items-center overflow-visible">
          {renderFlagBanner("👩‍⚕️")}
          <div className="relative w-52 h-28 flex-shrink-0 z-20 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 260 140" className="w-full h-full drop-shadow-xl overflow-visible">
              <ellipse cx="130" cy="128" rx="105" ry="6" fill="#000000" opacity="0.18" />

              {/* Person 1: Support Worker (left, wearing teal scrubs & lanyard) */}
              <g transform="translate(30, 8)">
                <circle cx="34" cy="20" r="12" fill="#fddba8" />
                <path d="M 24 16 Q 34 6 44 16" fill="#7c2d12" />
                {/* Medical / Care Scrubs */}
                <rect x="22" y="32" width="24" height="34" rx="6" fill="#059669" />
                {/* Lanyard / Badge */}
                <path d="M 28 32 L 34 46 L 40 32" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                <rect x="31" y="46" width="6" height="8" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                {renderAccessoryOverlay()}

                {/* Right arm linked gently to support Person 2 */}
                <path d="M 44 40 L 75 42" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                
                {/* Left arm: Friendly wave */}
                {isHovered || isWaving ? (
                  <path d="M 22 40 L 8 20" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" className="animate-bounce" />
                ) : (
                  <path d="M 22 40 L 16 64" stroke="#fddba8" strokeWidth="6" strokeLinecap="round" />
                )}

                {/* Legs */}
                <path d="M 28 66 L 24 104" stroke="#047857" strokeWidth="7" strokeLinecap="round" />
                <path d="M 40 66 L 44 104" stroke="#047857" strokeWidth="7" strokeLinecap="round" />
                <rect x="18" y="102" width="14" height="7" rx="3" fill="#0f172a" />
                <rect x="38" y="102" width="14" height="7" rx="3" fill="#0f172a" />
              </g>

              {/* Heart connection symbol between them */}
              <g transform="translate(102, 28)" className="animate-bounce">
                <path d="M 12 4 A 4 4 0 0 0 4 8 C 4 14 12 18 12 18 C 12 18 20 14 20 8 A 4 4 0 0 0 12 4 Z" fill="#ec4899" opacity="0.85" />
              </g>

              {/* Person 2: Active Senior Client (right, walking confidently with cane in left hand) */}
              <g transform="translate(125, 8)">
                <circle cx="48" cy="20" r="12" fill="#fed7aa" />
                {/* Silver/Grey Hair */}
                <path d="M 38 16 Q 48 4 58 16 Q 52 24 38 16 Z" fill="#94a3b8" />
                {/* Cheerful Cardigan */}
                <rect x="36" y="32" width="24" height="34" rx="6" fill="#d97706" />
                <line x1="48" y1="32" x2="48" y2="66" stroke="#b45309" strokeWidth="2" />

                {/* Left arm: holding supportive walking cane */}
                <path d="M 38 40 L 18 58" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                {/* Sleek Modern Ergonomic Cane */}
                <path d="M 16 54 Q 12 50 8 54 L 8 106" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <circle cx="8" cy="106" r="3" fill="#0f172a" />

                {/* Right arm linked with Carer */}
                <path d="M 58 40 L 45 42" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />

                {/* Legs */}
                <path d="M 42 66 L 38 104" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                <path d="M 54 66 L 58 104" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                <rect x="32" y="102" width="14" height="7" rx="3" fill="#1e293b" />
                <rect x="52" y="102" width="14" height="7" rx="3" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>
      )}

    </div>
  );
};
