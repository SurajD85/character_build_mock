import React from "react";
import { CharacterSvgProps } from "./types";

export const AccessibleVan: React.FC<CharacterSvgProps> = ({
  emotion,
  themeColor,
}) => {
  return (
    <svg viewBox="0 0 280 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <ellipse cx="140" cy="162" rx="115" ry="8" fill="#000000" opacity="0.25" />
      <g className="anim-chassis">
        <path d="M 25 142 L 35 88 Q 42 62 70 60 L 180 60 Q 215 62 235 90 L 255 118 Q 260 126 260 142 L 235 142 Q 225 125 205 125 Q 185 125 175 142 L 105 142 Q 95 125 75 125 Q 55 125 45 142 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <path d="M 38 128 L 255 128 L 252 136 L 36 136 Z" fill={themeColor} />
        {/* Windows */}
        <path d="M 185 68 L 225 94 L 225 116 L 185 116 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M 125 68 L 175 68 L 175 116 L 125 116 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M 68 68 L 115 68 L 115 116 L 55 116 Q 52 85 68 68 Z" fill="#38bdf8" opacity="0.85" />
        {/* Waving Driver */}
        <circle cx="205" cy="95" r="9" fill="#1e293b" />
        {emotion === "WAVING" && <path d="M 216 92 L 224 83" stroke="#fed7aa" strokeWidth="3.5" strokeLinecap="round" />}
        {/* Headlights Beam */}
        <polygon points="255,122 260,126 256,134 250,132" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        <polygon points="260,124 285,115 285,145 260,136" fill="#fef08a" opacity="0.25" />
        {/* Wheelchair Accessibility Emblem */}
        <circle cx="142" cy="120" r="10" fill={themeColor} />
        <circle cx="142" cy="116" r="2" fill="#ffffff" />
        <path d="M 140 119 L 144 119 L 145 123" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        {/* Front Wheel */}
        <g transform="translate(205, 142)">
          <circle cx="0" cy="0" r="20" fill="#0f172a" />
          <circle cx="0" cy="0" r="13" fill="#cbd5e1" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="2.5" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#475569" strokeWidth="2.5" />
          </g>
          <circle cx="0" cy="0" r="4.5" fill="#0f172a" />
        </g>
        {/* Rear Wheel */}
        <g transform="translate(75, 142)">
          <circle cx="0" cy="0" r="20" fill="#0f172a" />
          <circle cx="0" cy="0" r="13" fill="#cbd5e1" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="2.5" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#475569" strokeWidth="2.5" />
          </g>
          <circle cx="0" cy="0" r="4.5" fill="#0f172a" />
        </g>
      </g>
    </svg>
  );
};
