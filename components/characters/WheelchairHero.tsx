import React from "react";
import { CharacterSvgProps } from "./types";

export const WheelchairHero: React.FC<CharacterSvgProps> = ({
  emotion,
  themeColor,
  internalBlink,
  pupil,
}) => {
  return (
    <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-2xl overflow-visible">
      <defs>
        <radialGradient id="shadowGradWc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wheelRimWc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="162" rx="72" ry="7" fill="url(#shadowGradWc)" />
      <g className="anim-chassis">
        <g className="anim-scarf">
          <path d="M 75 75 Q 40 85 20 80 Q 35 98 70 88 Z" fill="#ef4444" opacity="0.9" />
          <path d="M 70 80 Q 45 92 15 95 Q 38 108 65 92 Z" fill="#dc2626" opacity="0.75" />
        </g>
        <line x1="72" y1="65" x2="88" y2="118" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <line x1="86" y1="118" x2="135" y2="120" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <line x1="130" y1="120" x2="152" y2="148" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <line x1="150" y1="146" x2="168" y2="146" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
        <rect x="80" y="112" width="56" height="10" rx="4" fill="#0f172a" />
        <g className="anim-breathe">
          <path d="M 94 116 L 136 118 L 152 144" fill="none" stroke="#3b82f6" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 148 144 L 170 144 Q 174 144 172 150 L 148 150 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 85 75 Q 98 70 114 74 L 105 116 L 86 116 Z" fill={themeColor} />
          <path d="M 90 73 L 108 73" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <path d="M 98 78 L 108 98 L 92 114" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          <rect x="96" y="65" width="8" height="9" fill="#fed7aa" />
          <circle cx="103" cy="52" r="16" fill="#fed7aa" />
          <path d="M 88 50 Q 102 33 118 48 Q 120 54 118 56 L 88 56 Z" fill={themeColor} />
          <path d="M 112 50 L 132 52 Q 134 54 130 56 L 114 56 Z" fill="#1e293b" />
          <g transform="translate(112, 49)">
            <ellipse cx="0" cy="0" rx="3.5" ry="4.5" fill="#ffffff" />
            {!internalBlink && (
              <circle cx={pupil.dx} cy={pupil.dy} r="2" fill="#0f172a">
                <circle cx="-0.6" cy="-0.6" r="0.6" fill="#ffffff" />
              </circle>
            )}
            {internalBlink && <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />}
          </g>
          <path d="M 111 60 Q 115 64 119 60" fill="none" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
          {emotion === "WAVING" || emotion === "CELEBRATING" ? (
            <g className="anim-wave">
              <line x1="88" y1="74" x2="98" y2="52" stroke={themeColor} strokeWidth="8" strokeLinecap="round" />
              <line x1="98" y1="52" x2="108" y2="34" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
              <circle cx="110" cy="31" r="5" fill="#fed7aa" />
              <path d="M 118 26 Q 122 30 118 34" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <path d="M 90 75 L 104 94 L 118 102" fill="none" stroke={themeColor} strokeWidth="7" strokeLinecap="round" />
              <circle cx="119" cy="103" r="4" fill="#fed7aa" />
            </g>
          )}
        </g>
        <g transform="translate(153, 150)">
          <circle cx="0" cy="0" r="10" fill="#0f172a" />
          <circle cx="0" cy="0" r="7" fill="#64748b" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
          </g>
          <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
        </g>
        <g transform="translate(86, 126)">
          <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="url(#wheelRimWc)" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="28" fill="none" stroke="#334155" strokeWidth="1.5" />
          <g className="anim-wheel-spin" style={{ transformOrigin: "0px 0px" }}>
            <line x1="-27" y1="0" x2="27" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="0" y1="-27" x2="0" y2="27" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="-19" y1="-19" x2="19" y2="19" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="-19" y1="19" x2="19" y2="-19" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="1.5" fill="#f59e0b" />
          </g>
          <circle cx="0" cy="0" r="7" fill={themeColor} stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#0f172a" />
        </g>
      </g>
    </svg>
  );
};
