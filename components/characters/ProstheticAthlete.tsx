import React from "react";
import { CharacterSvgProps } from "./types";

export const ProstheticAthlete: React.FC<CharacterSvgProps> = ({
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
          <circle cx="98" cy="42" r="14" fill="#fed7aa" />
          <path d="M 85 36 Q 98 26 111 36" fill="#1e293b" />
          <rect x="88" y="38" width="20" height="5" rx="1.5" fill="#f59e0b" />
          <g transform="translate(106, 41)">
            <ellipse cx="0" cy="0" rx="3" ry="3.5" fill="#ffffff" />
            {!internalBlink && <circle cx={pupil.dx} cy={pupil.dy} r="1.8" fill="#0f172a" />}
          </g>
          <path d="M 98 50 Q 102 54 106 50" fill="none" stroke="#7f1d1d" strokeWidth="1.5" />
          <path d="M 85 58 L 112 58 L 108 108 L 86 108 Z" fill="#10b981" />
          <path d="M 92 68 L 104 68" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 92 108 L 86 132 L 78 152" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 72 153 L 84 153" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          {/* Carbon Fiber Curved Running Blade */}
          <g className="anim-blade">
            <rect x="100" y="108" width="12" height="16" rx="3" fill="#334155" />
            <path d="M 106 124 Q 120 144 116 154 L 126 154" fill="none" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 116 154 L 126 154" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          </g>
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="86" y1="64" x2="96" y2="42" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <line x1="96" y1="42" x2="108" y2="24" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <circle cx="110" cy="22" r="4.5" fill="#fed7aa" />
            </g>
          ) : (
            <g>
              <path d="M 86 64 L 105 82 L 122 75" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <circle cx="123" cy="74" r="3.5" fill="#fed7aa" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
