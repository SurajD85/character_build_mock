"use client";

import React, { useState } from "react";
import { CharacterAsset, CharacterId, FlagShape, CharacterAccessory } from "../types/campaign";
import { MOCK_CHARACTERS } from "../lib/mockData";
import { CharacterSprite } from "./CharacterSprite";

interface CharacterLibraryProps {
  selectedCharacterId: CharacterId;
  onSelectCharacter: (character: CharacterAsset) => void;
  sampleCtaText?: string;
  selectedFlagShape?: FlagShape;
  selectedAccessory?: CharacterAccessory;
  onSelectAccessory?: (accessory: CharacterAccessory) => void;
}

export const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  sampleCtaText = "Click to see our products!",
  selectedFlagShape,
  selectedAccessory = "none",
  onSelectAccessory,
}) => {
  const [hoveredTestCharId, setHoveredTestCharId] = useState<string | null>(null);

  const ACCESSORY_OPTIONS: { id: CharacterAccessory; label: string; icon: string }[] = [
    { id: "none", label: "Standard", icon: "✨" },
    { id: "cape", label: "Superhero Cape", icon: "🦸" },
    { id: "party_hat", label: "Party Cone", icon: "🥳" },
    { id: "sunglasses", label: "Cool Shades", icon: "😎" },
    { id: "crown", label: "Royal Crown", icon: "👑" },
    { id: "gold_medal", label: "Gold Medal", icon: "🥇" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>🎭</span> Character Library & Outfit Customizer
          </h4>
          <p className="text-xs text-slate-500">
            Select an animated character and customize their accessory outfit live! Hover over any character to test interactive animation states.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
          {MOCK_CHARACTERS.length} Characters
        </span>
      </div>

      {/* Outfit Accessory Customizer Bar */}
      <div className="p-3 bg-blue-50/80 rounded-2xl text-slate-900 space-y-2 border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎨</span> Live Outfit Accessory Customizer
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">Real-time SVG Overlay</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {ACCESSORY_OPTIONS.map((acc) => {
            const isActive = selectedAccessory === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onSelectAccessory?.(acc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{acc.icon}</span>
                <span>{acc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
        {MOCK_CHARACTERS.map((char) => {
          const isSelected = selectedCharacterId === char.id;
          const isTestHovered = hoveredTestCharId === char.id;

          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              onMouseEnter={() => setHoveredTestCharId(char.id)}
              onMouseLeave={() => setHoveredTestCharId(null)}
              className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Top Row Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-1.5 bg-slate-100 rounded-xl">{char.icon}</span>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 leading-tight">{char.name}</h5>
                    <span className="text-[10px] font-semibold text-slate-500">{char.category}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {char.badge}
                </span>
              </div>

              {/* Character Live Preview Container */}
              <div className="relative h-28 my-1 bg-slate-50 rounded-xl border border-slate-100 p-2 overflow-hidden flex items-center justify-center">
                <div className="scale-90 transform">
                  <CharacterSprite
                    characterId={char.id}
                    ctaText={sampleCtaText || char.defaultCta}
                    bubbleText={char.defaultBubble}
                    themeColor={char.themeColor}
                    flagShape={selectedFlagShape || char.defaultFlagShape}
                    accessory={selectedAccessory}
                    isHovered={isTestHovered}
                    isWaving={isTestHovered}
                  />
                </div>
              </div>

              {/* Description & Selection Indicator */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="line-clamp-1">{char.description}</span>
                <span className={`font-bold ml-2 ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                  {isSelected ? "Selected ✓" : "Select"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
