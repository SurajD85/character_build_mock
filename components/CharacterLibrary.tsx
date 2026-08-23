"use client";

import React, { useState } from "react";
import { CharacterAsset, CharacterId, FlagShape, CharacterAccessory } from "../types/campaign";
import { MOCK_CHARACTERS } from "../lib/mockData";

interface CharacterLibraryProps {
  selectedCharacterId: CharacterId;
  onSelectCharacter: (character: CharacterAsset) => void;
  sampleCtaText?: string;
  selectedFlagShape?: FlagShape;
  selectedAccessory?: CharacterAccessory;
  onSelectAccessory?: (accessory: CharacterAccessory) => void;
}

const ACCESSORY_OPTIONS: {
  id: CharacterAccessory;
  label: string;
  icon: string;
  activeBg: string;
  activeText: string;
}[] = [
  { id: "none",       label: "None",        icon: "✨", activeBg: "bg-slate-700",  activeText: "text-white" },
  { id: "cape",       label: "Hero Cape",   icon: "🦸", activeBg: "bg-red-600",    activeText: "text-white" },
  { id: "party_hat",  label: "Party Hat",   icon: "🥳", activeBg: "bg-pink-500",   activeText: "text-white" },
  { id: "sunglasses", label: "Shades",      icon: "😎", activeBg: "bg-amber-500",  activeText: "text-white" },
  { id: "crown",      label: "Crown",       icon: "👑", activeBg: "bg-yellow-500", activeText: "text-slate-900" },
  { id: "gold_medal", label: "Medal",       icon: "🥇", activeBg: "bg-orange-500", activeText: "text-white" },
];

export const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  selectedAccessory = "none",
  onSelectAccessory,
}) => {
  const selectedChar = MOCK_CHARACTERS.find(c => c.id === selectedCharacterId) || MOCK_CHARACTERS[0];

  return (
    <div className="space-y-6">

      {/* ── ACCESSORY PILLS ──────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Outfit Accessory
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCESSORY_OPTIONS.map(acc => {
            const isActive = selectedAccessory === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onSelectAccessory?.(acc.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold border-2 transition-all duration-150 ${
                  isActive
                    ? `${acc.activeBg} ${acc.activeText} border-transparent shadow-md scale-105`
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <span className="text-base leading-none">{acc.icon}</span>
                <span>{acc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CURRENTLY SELECTED — HERO CALLOUT ────────────────────── */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl border-2 shadow-sm"
        style={{
          borderColor: selectedChar.themeColor,
          background: `${selectedChar.themeColor}12`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md border-2 border-white"
          style={{ background: `${selectedChar.themeColor}25` }}
        >
          {selectedChar.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-0.5">Currently Selected</p>
          <p className="text-base font-black text-slate-900 leading-tight">{selectedChar.name}</p>
          <p className="text-xs text-slate-500 font-semibold">{selectedChar.category} · {selectedChar.badge}</p>
        </div>
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: selectedChar.themeColor }}
        />
      </div>

      {/* ── CHARACTER GRID ───────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Choose Mascot — <span className="text-blue-600">{MOCK_CHARACTERS.length} available</span>
        </p>

        <div className="grid grid-cols-3 xl:grid-cols-4 gap-2.5">
          {MOCK_CHARACTERS.map(char => {
            const isSelected = char.id === selectedCharacterId;

            return (
              <button
                key={char.id}
                type="button"
                onClick={() => onSelectCharacter(char)}
                className={`group relative text-left rounded-2xl border-2 transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? "border-transparent shadow-xl scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
                }`}
                style={isSelected ? { borderColor: char.themeColor, background: `${char.themeColor}18` } : {}}
              >
                {/* Colour bar at top */}
                <div
                  className="h-1 w-full"
                  style={{ background: char.themeColor }}
                />

                <div className="p-3 flex flex-col items-center text-center gap-2">
                  {/* Large emoji icon — clear at a glance */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-150"
                    style={
                      isSelected
                        ? { background: `${char.themeColor}30`, borderColor: `${char.themeColor}50` }
                        : { background: "#f8fafc", borderColor: "#e2e8f0" }
                    }
                  >
                    {char.icon}
                  </div>

                  {/* Name + category */}
                  <div>
                    <p className={`text-[11px] font-black leading-tight ${isSelected ? "text-slate-900" : "text-slate-800"}`}>
                      {char.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{char.category}</p>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div
                      className="absolute top-3 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: char.themeColor }}
                    >
                      <span className="text-[9px] text-white font-black">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
