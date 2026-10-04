import React from "react";
import { CharacterSvgProps } from "./types";

export const GuideDogDuo: React.FC<CharacterSvgProps> = ({
  emotion,
}) => {
  return (
    <svg viewBox="0 0 260 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <ellipse cx="140" cy="162" rx="100" ry="7" fill="#000000" opacity="0.25" />
      <g className="anim-chassis">
        {/* Handler Maya */}
        <g className="anim-breathe" transform="translate(30, 0)">
          <rect x="94" y="55" width="8" height="10" fill="#fcd34d" />
          <circle cx="98" cy="44" r="14" fill="#fcd34d" />
          <path d="M 85 40 Q 98 26 111 38" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <rect x="94" y="41" width="14" height="6" rx="2" fill="#0f172a" />
          <line x1="94" y1="44" x2="108" y2="44" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <path d="M 96 52 Q 100 55 104 52" fill="none" stroke="#991b1b" strokeWidth="1.5" />
          <path d="M 82 62 L 114 62 L 110 120 L 82 120 Z" fill="#8b5cf6" />
          <path d="M 88 120 L 85 152 M 106 120 L 110 152" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="108" y1="88" x2="175" y2="158" stroke="#f8fafc" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="165" y1="148" x2="175" y2="158" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="84" y1="68" x2="94" y2="46" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
              <line x1="94" y1="46" x2="106" y2="28" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round" />
              <circle cx="108" cy="26" r="4.5" fill="#fcd34d" />
            </g>
          ) : (
            <path d="M 86 68 L 108 88" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
          )}
        </g>
        {/* Guide Dog Barnaby */}
        <g transform="translate(155, 30)">
          <path d="M 12 108 Q -10 100 -18 84" fill="none" stroke="#d97706" strokeWidth="7" strokeLinecap="round" className="anim-tail" />
          <ellipse cx="42" cy="112" rx="34" ry="18" fill="#f59e0b" />
          <path d="M 30 96 L 56 96 L 52 128 L 28 128 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <rect x="36" y="105" width="12" height="12" rx="2" fill="#3b82f6" />
          <circle cx="42" cy="111" r="3" fill="#ffffff" />
          <circle cx="72" cy="95" r="14" fill="#f59e0b" />
          <path d="M 78 95 Q 92 98 88 106 L 76 106 Z" fill="#d97706" />
          <circle cx="86" cy="98" r="2.5" fill="#0f172a" />
          <circle cx="76" cy="92" r="2" fill="#0f172a" />
          <path d="M 64 88 Q 58 102 68 105" fill="#b45309" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="124" x2="24" y2="152" stroke="#d97706" strokeWidth="7" strokeLinecap="round" />
          <line x1="38" y1="124" x2="42" y2="152" stroke="#b45309" strokeWidth="7" strokeLinecap="round" />
          <line x1="58" y1="124" x2="56" y2="152" stroke="#d97706" strokeWidth="7" strokeLinecap="round" />
          <line x1="70" y1="124" x2="74" y2="152" stroke="#b45309" strokeWidth="7" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
