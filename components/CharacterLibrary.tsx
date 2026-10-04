"use client";

import React from "react";
import { CharacterAsset, CharacterId } from "../types/campaign";
import { MOCK_CHARACTERS } from "../lib/mockData";
import { LivingCharacterSprite } from "./LivingCharacterSprite";

interface CharacterLibraryProps {
  selectedCharacterId?: CharacterId;
  onSelectCharacter: (character: CharacterAsset) => void;
  customCharacters?: CharacterAsset[];
  onDeleteCustomCharacter?: (id: string) => void;
}

export const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  customCharacters = [],
  onDeleteCustomCharacter,
}) => {
  const allCharacters = [...MOCK_CHARACTERS, ...customCharacters];
  const selectedChar = allCharacters.find((c) => c.id === selectedCharacterId) || allCharacters[0];

  return (
    <div className="space-y-6">
      {/* CURRENTLY SELECTED HERO CALLOUT */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl border-2 shadow-sm"
        style={{
          borderColor: selectedChar.themeColor,
          background: `${selectedChar.themeColor}12`,
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-md border-2 border-white relative"
          style={{ background: `${selectedChar.themeColor}25` }}
        >
          <div className="scale-[0.35] transform-gpu origin-center translate-y-1">
            <LivingCharacterSprite
              type={selectedChar.id}
              showBubble={false}
              showCta={false}
              themeColor={selectedChar.themeColor}
              mousePos={{ x: 300, y: 300 }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-0.5">Currently Selected Hero</p>
          <p className="text-base font-black text-slate-900 leading-tight">{selectedChar.name}</p>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {selectedChar.category} • {selectedChar.badge} {selectedChar.isCustom ? "(Custom Dynamic)" : ""}
          </p>
        </div>
        <div
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
          style={{ background: selectedChar.themeColor }}
        />
      </div>

      {/* CHARACTER GRID */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Choose Living Character Mascot — <span className="text-blue-600">{allCharacters.length} Available</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {allCharacters.map((char) => {
            const isSelected = char.id === selectedCharacterId;

            return (
              <div key={char.id} className="relative group">
                <button
                  type="button"
                  onClick={() => onSelectCharacter(char)}
                  className={`w-full text-left rounded-2xl border-2 transition-all duration-150 overflow-hidden ${
                    isSelected
                      ? "border-transparent shadow-xl scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
                  }`}
                  style={isSelected ? { borderColor: char.themeColor, background: `${char.themeColor}18` } : {}}
                >
                  <div
                    className="h-1 w-full"
                    style={{ background: char.themeColor }}
                  />

                  <div className="p-3.5 flex flex-col items-center text-center gap-2">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-150 relative overflow-hidden"
                      style={
                        isSelected
                          ? { background: `${char.themeColor}30`, borderColor: `${char.themeColor}50` }
                          : { background: "#f8fafc", borderColor: "#e2e8f0" }
                      }
                    >
                      <div className="scale-[0.32] transform-gpu origin-center translate-y-1">
                        <LivingCharacterSprite
                          type={char.id}
                          showBubble={false}
                          showCta={false}
                          themeColor={char.themeColor}
                          mousePos={{ x: 300, y: 300 }}
                        />
                      </div>
                      {char.isCustom && (
                        <span className="absolute -top-1 -right-1 text-[8px] bg-purple-600 text-white font-black px-1 rounded-full z-10">
                          NEW
                        </span>
                      )}
                    </div>

                    <div>
                      <p className={`text-xs font-black leading-tight ${isSelected ? "text-slate-900" : "text-slate-800"}`}>
                        {char.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{char.category}</p>
                    </div>

                    {isSelected && (
                      <div
                        className="absolute top-3 right-2.5 w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                        style={{ background: char.themeColor }}
                      >
                        <span className="text-[9px] text-white font-black">✓</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Delete Custom Character Button */}
                {char.isCustom && onDeleteCustomCharacter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomCharacter(char.id);
                    }}
                    className="absolute top-2 left-2 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-xs z-10"
                    title="Delete Custom Character"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};