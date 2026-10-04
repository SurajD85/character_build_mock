import React from "react";
import { CharacterSvgProps } from "./types";

export const TargetArcherHero: React.FC<CharacterSvgProps> = ({
  emotion,
  themeColor = "#8b5cf6",
  internalBlink,
  pupil,
}) => {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <defs>
        <radialGradient id="shadowGradTarget" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="120" cy="165" rx="80" ry="8" fill="url(#shadowGradTarget)" />

      {/* TARGET BOARD STAND (Right Side) */}
      <g transform="translate(188, 75)">
        {/* Wooden Target Tripod Stand */}
        <line x1="0" y1="20" x2="-18" y2="85" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="20" x2="18" y2="85" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="20" x2="0" y2="88" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
        
        {/* Bullseye Target Board */}
        <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
        <circle cx="0" cy="0" r="20" fill="#ef4444" />
        <circle cx="0" cy="0" r="14" fill="#ffffff" />
        <circle cx="0" cy="0" r="8" fill="#ef4444" />
        <circle cx="0" cy="0" r="3.5" fill="#facc15" />

        {/* Bullseye Arrow Sticking in Center */}
        <line x1="-12" y1="-12" x2="0" y2="0" stroke="#0f172a" strokeWidth="2.5" />
        <path d="M -16 -16 L -10 -14 L -14 -10 Z" fill="#3b82f6" />
      </g>

      <g className="anim-chassis">
        {/* ARCHER ATHLETE SEATED FRAME */}
        <line x1="55" y1="75" x2="70" y2="135" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <line x1="68" y1="135" x2="120" y2="137" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <line x1="115" y1="137" x2="138" y2="158" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <rect x="130" y="156" width="20" height="5" rx="2.5" fill="#0f172a" />

        {/* Dynamic Athlete Body */}
        <g className="anim-breathe">
          {/* Blue Legs */}
          <path d="M 76 132 L 118 134 L 138 156" fill="none" stroke="#2563eb" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 136 156 L 152 156" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          
          {/* Purple Athletic Jersey */}
          <path d="M 65 82 Q 78 76 94 80 L 85 130 L 68 130 Z" fill="url(#purpleGradient)" />
          
          {/* Crosshair Target Emblem on Chest */}
          <g transform="translate(74, 92) scale(0.65)">
            <circle cx="10" cy="10" r="10" fill="#ef4444" />
            <circle cx="10" cy="10" r="7" fill="#ffffff" />
            <circle cx="10" cy="10" r="4" fill="#ef4444" />
            <circle cx="10" cy="10" r="1.5" fill="#facc15" />
          </g>

          {/* Neck & Head */}
          <rect x="76" y="70" width="8" height="10" fill="#fed7aa" />
          <circle cx="83" cy="58" r="16" fill="#fed7aa" />
          
          {/* Precision Headband with Aim Visor Monocle */}
          <path d="M 68 50 Q 83 36 98 50 Q 100 56 98 58 L 68 58 Z" fill="#6b21a8" />
          <rect x="74" y="44" width="20" height="4" rx="2" fill="#facc15" />

          {/* Eye & Precision Aim HUD Monocle */}
          <g transform="translate(91, 56)">
            <ellipse cx="0" cy="0" rx="3.5" ry="4.5" fill="#ffffff" />
            {!internalBlink && (
              <circle cx={pupil.dx} cy={pupil.dy} r="2" fill="#0f172a">
                <circle cx="-0.6" cy="-0.6" r="0.6" fill="#ffffff" />
              </circle>
            )}
            {internalBlink && <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />}
            {/* Target Crosshair Monocle Ring */}
            <circle cx="0" cy="0" r="7" fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity="0.9" />
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#06b6d4" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke="#06b6d4" strokeWidth="1" opacity="0.8" />
          </g>

          {/* Confident Smile */}
          <path d="M 86 66 Q 90 70 95 66" fill="none" stroke="#7f1d1d" strokeWidth="1.8" strokeLinecap="round" />

          {/* ARCHERY BOW & AIMING ARMS */}
          <g className="anim-wave">
            {/* Bow held in extended right arm */}
            <path d="M 130 35 Q 148 70 130 105" fill="none" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="130" y1="35" x2="110" y2="70" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="130" y1="105" x2="110" y2="70" stroke="#cbd5e1" strokeWidth="1.2" />

            {/* Extended Right Arm holding Bow */}
            <line x1="84" y1="84" x2="130" y2="70" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="130" cy="70" r="4" fill="#fed7aa" />

            {/* Left Arm pulling arrow back */}
            <path d="M 72 84 L 98 75 L 110 70" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="70" r="3.5" fill="#fed7aa" />

            {/* Arrow loaded in bow pointing straight at target */}
            <line x1="95" y1="70" x2="160" y2="70" stroke="#0f172a" strokeWidth="2" />
            <path d="M 160 70 L 153 67 L 153 73 Z" fill="#ef4444" />
            <path d="M 95 70 L 99 67 M 95 70 L 99 73" stroke="#3b82f6" strokeWidth="1.5" />
          </g>
        </g>

        {/* Front Caster Wheel */}
        <g transform="translate(138, 160)">
          <circle cx="0" cy="0" r="9" fill="#0f172a" />
          <circle cx="0" cy="0" r="6" fill="#64748b" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#f8fafc" strokeWidth="1.5" />
          </g>
          <circle cx="0" cy="0" r="2.5" fill="#cbd5e1" />
        </g>

        {/* Main Target Wheel (with Concentric Target Rings) */}
        <g transform="translate(68, 140)">
          <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
          <circle cx="0" cy="0" r="28" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="20" fill="none" stroke="#ef4444" strokeWidth="2" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-24" y1="0" x2="24" y2="0" stroke="#a855f7" strokeWidth="1.5" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#a855f7" strokeWidth="1.5" />
            <line x1="-17" y1="-17" x2="17" y2="17" stroke="#a855f7" strokeWidth="1.5" />
            <line x1="-17" y1="17" x2="17" y2="-17" stroke="#a855f7" strokeWidth="1.5" />
          </g>
          <circle cx="0" cy="0" r="8" fill="#facc15" stroke="#1e293b" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#0f172a" />
        </g>
      </g>
    </svg>
  );
};