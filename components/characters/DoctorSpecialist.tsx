import React from "react";
import { CharacterSvgProps } from "./types";

export const DoctorSpecialist: React.FC<CharacterSvgProps> = ({
  emotion,
  internalBlink,
  pupil,
}) => {
  return (
    <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <ellipse cx="110" cy="162" rx="65" ry="7" fill="#000000" opacity="0.25" />
      <g className="anim-chassis">
        <g className="anim-breathe">
          <rect x="94" y="52" width="8" height="10" fill="#fed7aa" />
          <circle cx="98" cy="42" r="15" fill="#fed7aa" />
          <path d="M 85 38 Q 98 25 111 38" fill="#475569" stroke="#334155" strokeWidth="3" />
          <rect x="92" y="38" width="8" height="6" rx="1.5" fill="none" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="102" y="38" width="8" height="6" rx="1.5" fill="none" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="100" y1="41" x2="102" y2="41" stroke="#1e293b" strokeWidth="1.5" />
          <g transform="translate(106, 41)">
            <ellipse cx="0" cy="0" rx="3" ry="3.5" fill="#ffffff" />
            {!internalBlink && <circle cx={pupil.dx} cy={pupil.dy} r="1.8" fill="#0f172a" />}
          </g>
          <path d="M 98 51 Q 102 54 106 51" fill="none" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 94 62 L 102 62 L 100 80 L 98 84 L 96 80 Z" fill="#2563eb" />
          <path d="M 82 58 L 114 58 L 118 128 L 78 128 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 88 60 Q 98 80 108 80 Q 112 75 114 62" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="108" cy="80" r="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
          <path d="M 88 128 L 88 152 M 106 128 L 106 152" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
          <path d="M 84 153 L 95 153 M 102 153 L 113 153" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="84" y1="66" x2="94" y2="44" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
              <line x1="94" y1="44" x2="106" y2="25" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <circle cx="108" cy="23" r="4.5" fill="#fed7aa" />
            </g>
          ) : (
            <g>
              <path d="M 84 66 L 98 88 L 112 84" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
              <rect x="110" y="74" width="16" height="22" rx="3" fill="#0f172a" />
              <rect x="112" y="76" width="12" height="18" rx="1.5" fill="#38bdf8" opacity="0.85" />
              <path d="M 115 85 L 118 88 L 122 82" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
