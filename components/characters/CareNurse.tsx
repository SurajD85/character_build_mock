import React from "react";
import { CharacterSvgProps } from "./types";

export const CareNurse: React.FC<CharacterSvgProps> = ({
  emotion,
  internalBlink,
  pupil,
}) => {
  return (
    <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <ellipse cx="110" cy="162" rx="65" ry="7" fill="#000000" opacity="0.25" />
      <g className="anim-chassis">
        <rect x="55" y="125" width="95" height="18" rx="6" fill="#0f766e" stroke="#115e59" strokeWidth="2" />
        <rect x="135" y="110" width="18" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M 144 116 L 144 128 M 138 122 L 150 122" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        <g className="anim-breathe">
          <rect x="94" y="55" width="8" height="10" fill="#fcd34d" />
          <circle cx="98" cy="44" r="15" fill="#fcd34d" />
          <path d="M 84 40 Q 98 25 112 40" fill="#78350f" />
          <rect x="90" y="27" width="16" height="7" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 98 29 L 98 33 M 95 31 L 101 31" stroke="#0d9488" strokeWidth="1.5" />
          <g transform="translate(105, 42)">
            <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#ffffff" />
            {!internalBlink && <circle cx={pupil.dx} cy={pupil.dy} r="2" fill="#0f172a" />}
            {internalBlink && <line x1="-3" y1="0" x2="3" y2="0" stroke="#78350f" strokeWidth="1.5" />}
          </g>
          <path d="M 104 52 Q 108 55 112 52" fill="none" stroke="#be123c" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 92 64 Q 98 82 104 82 Q 110 82 114 64" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="104" cy="84" r="3" fill="#94a3b8" />
          <path d="M 85 60 L 115 60 L 110 115 L 85 115 Z" fill="#0d9488" />
          <path d="M 90 115 L 94 140 M 106 115 L 110 140" stroke="#134e4a" strokeWidth="8" strokeLinecap="round" />
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="88" y1="65" x2="96" y2="42" stroke="#0d9488" strokeWidth="7" strokeLinecap="round" />
              <line x1="96" y1="42" x2="108" y2="24" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round" />
              <circle cx="110" cy="22" r="4.5" fill="#fcd34d" />
            </g>
          ) : (
            <g>
              <path d="M 88 65 L 105 85 L 118 78" fill="none" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
              <rect x="115" y="70" width="12" height="16" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            </g>
          )}
        </g>
        <g transform="translate(135, 148)">
          <circle cx="0" cy="0" r="14" fill="#0f172a" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#f8fafc" strokeWidth="2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#f8fafc" strokeWidth="2" />
          </g>
        </g>
        <g transform="translate(70, 148)">
          <circle cx="0" cy="0" r="14" fill="#0f172a" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#f8fafc" strokeWidth="2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#f8fafc" strokeWidth="2" />
          </g>
        </g>
      </g>
    </svg>
  );
};
