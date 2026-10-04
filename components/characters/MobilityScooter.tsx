import React from "react";
import { CharacterSvgProps } from "./types";

export const MobilityScooter: React.FC<CharacterSvgProps> = ({
  emotion,
  themeColor,
}) => {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <ellipse cx="120" cy="162" rx="90" ry="7" fill="#000000" opacity="0.25" />
      <g className="anim-chassis">
        <path d="M 45 138 L 195 138 Q 200 138 200 130 L 195 115 L 180 115 L 175 134 L 75 134 L 70 100 L 45 100 Z" fill={themeColor || "#ef4444"} stroke="#991b1b" strokeWidth="2" />
        <rect x="68" y="70" width="14" height="42" rx="4" fill="#1e293b" />
        <rect x="70" y="55" width="10" height="12" rx="3" fill="#1e293b" />
        <rect x="70" y="105" width="38" height="10" rx="3" fill="#1e293b" />
        <line x1="180" y1="125" x2="165" y2="75" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
        <rect x="156" y="68" width="18" height="10" rx="3" fill="#0f172a" />
        <circle cx="165" cy="73" r="3" fill="#38bdf8" />
        <path d="M 175 80 L 195 80 L 190 102 L 175 102 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="183" cy="78" r="5" fill="#f59e0b" />
        <circle cx="188" cy="76" r="4" fill="#10b981" />
        <g className="anim-breathe">
          <rect x="94" y="60" width="8" height="10" fill="#fed7aa" />
          <circle cx="98" cy="50" r="14" fill="#fed7aa" />
          <path d="M 86 48 Q 98 34 110 46" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
          <rect x="98" y="46" width="12" height="6" rx="2" fill="#38bdf8" opacity="0.8" stroke="#1e293b" strokeWidth="1" />
          <path d="M 82 70 L 115 70 L 110 110 L 80 110 Z" fill="#0284c7" />
          <path d="M 88 108 L 130 110 L 138 135" fill="none" stroke="#334155" strokeWidth="9" strokeLinecap="round" />
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="88" y1="75" x2="105" y2="48" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
              <line x1="105" y1="48" x2="116" y2="30" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <circle cx="118" cy="28" r="4" fill="#fed7aa" />
            </g>
          ) : (
            <path d="M 88 75 L 125 80 L 160 74" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
          )}
        </g>
        <g transform="translate(185, 144)">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="10" fill="#94a3b8" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#ffffff" strokeWidth="2" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke="#ffffff" strokeWidth="2" />
          </g>
          <circle cx="0" cy="0" r="3.5" fill="#ef4444" />
        </g>
        <g transform="translate(60, 144)">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="10" fill="#94a3b8" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#ffffff" strokeWidth="2" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke="#ffffff" strokeWidth="2" />
          </g>
          <circle cx="0" cy="0" r="3.5" fill="#ef4444" />
        </g>
      </g>
    </svg>
  );
};
