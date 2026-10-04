"use client";

import React, { useState } from "react";
import { CharacterAsset, CharacterRiggingRules } from "../types/campaign";
import { LivingCharacterSprite, LivingCharacterType } from "./LivingCharacterSprite";

interface DynamicCharacterBuilderProps {
  onSaveCharacter: (character: CharacterAsset) => void;
  onCancel: () => void;
}

const COLOR_PRESETS = [
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Royal Purple", hex: "#8b5cf6" },
  { name: "Crimson Red", hex: "#ef4444" },
  { name: "Amber Gold", hex: "#f59e0b" },
  { name: "Deep Teal", hex: "#0d9488" },
];

const EMOJI_PRESETS = ["🦾", "🎯", "🤖", "⚽", "🩺", "🏃", "🦮", "👨‍⚕️", "🚐", "🛵", "♿", "🎨", "🚀", "👑"];

export const DynamicCharacterBuilder: React.FC<DynamicCharacterBuilderProps> = ({
  onSaveCharacter,
  onCancel,
}) => {
  const [name, setName] = useState("Robotic Rehabilitation Arm");
  const [category, setCategory] = useState("Pediatric Mobility");
  const [icon, setIcon] = useState("🦾");
  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [badge, setBadge] = useState("Bionic Tech Hero");
  const [defaultCta, setDefaultCta] = useState("Robotic Rehabilitation Range");
  const [defaultBubble, setDefaultBubble] = useState("Empowering next-gen bionic mobility!");
  const [baseTemplate, setBaseTemplate] = useState<"wheelchair" | "van" | "scooter" | "nurse" | "doctor" | "dog" | "runner" | "target">("runner");

  // Rigging rules
  const [rigging, setRigging] = useState<CharacterRiggingRules>({
    hasWheelSpin: true,
    hasBlinkingEyes: true,
    hasGazeTracking: true,
    hasBreathingTorso: true,
    hasWavingArm: true,
    hasScarfRipple: true,
    hasTailWag: false,
  });

  // Preview test state
  const [previewEmotion, setPreviewEmotion] = useState<"CRUISING" | "WAVING" | "CELEBRATING">("CRUISING");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newChar: CharacterAsset = {
      id: `custom_${Date.now()}`,
      name,
      category,
      icon,
      description: `Custom dynamic character created via Admin Studio.`,
      defaultCta,
      defaultBubble,
      themeColor,
      badge,
      speedMultiplier: 1.1,
      defaultFlagShape: "ribbon",
      isCustom: true,
      rigging,
      baseTemplate,
    };
    onSaveCharacter(newChar);
  };

  const templateTypeMap: Record<string, LivingCharacterType> = {
    wheelchair: "wheelchair_hero",
    van: "accessible_van",
    scooter: "mobility_scooter",
    nurse: "care_nurse",
    doctor: "doctor_specialist",
    dog: "guide_dog_duo",
    runner: "prosthetic_athlete",
    target: "target_archer_hero",
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto text-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
            Admin Studio • Dynamic Rigging Engine
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Create &amp; Rig New Character</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Character Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Icon Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-center text-base mb-1.5"
                required
              />
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                {EMOJI_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`w-6 h-6 rounded-md text-xs flex items-center justify-center transition border ${
                      icon === emoji
                        ? "bg-purple-600 text-white border-purple-600 scale-105 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Model Archetype</label>
              <select
                value={baseTemplate}
                onChange={(e) => setBaseTemplate(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
              >
                <option value="runner">🦾 Bionic Arm / Blade Athlete</option>
                <option value="target">🎯 Target Archer Hero</option>
                <option value="wheelchair">♿ Wheelchair Hero</option>
                <option value="van">🚐 Welcab Van</option>
                <option value="scooter">🛵 Mobility Scooter</option>
                <option value="nurse">🩺 Care Nurse</option>
                <option value="doctor">👨‍⚕️ Specialist Doctor</option>
                <option value="dog">🦮 Guide Dog Duo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Theme Color</label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setThemeColor(col.hex)}
                  style={{ backgroundColor: col.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    themeColor === col.hex ? "border-slate-900 scale-110 shadow-sm" : "border-white"
                  }`}
                  title={col.name}
                />
              ))}
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Default Flag Banner CTA Copy</label>
            <input
              type="text"
              value={defaultCta}
              onChange={(e) => setDefaultCta(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Default Speech Bubble Dialogue</label>
            <input
              type="text"
              value={defaultBubble}
              onChange={(e) => setDefaultBubble(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              required
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-black text-slate-900 text-xs mb-1">Animation Rigging Controls</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasWheelSpin}
                  onChange={(e) => setRigging({ ...rigging, hasWheelSpin: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Rotating Wheels Physics</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasBlinkingEyes}
                  onChange={(e) => setRigging({ ...rigging, hasBlinkingEyes: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Natural Eye Blinking</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasGazeTracking}
                  onChange={(e) => setRigging({ ...rigging, hasGazeTracking: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Cursor Pupil Gaze Tracking</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasBreathingTorso}
                  onChange={(e) => setRigging({ ...rigging, hasBreathingTorso: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Organic Torso Breathing</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasWavingArm}
                  onChange={(e) => setRigging({ ...rigging, hasWavingArm: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Kinetic Arm Waving on Hover</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rigging.hasScarfRipple}
                  onChange={(e) => setRigging({ ...rigging, hasScarfRipple: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Flowing Scarf / Cape Ripple</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md transition text-xs"
          >
            ✨ Save &amp; Publish Dynamic Character
          </button>
        </form>

        <div className="flex flex-col justify-between bg-slate-50 p-6 rounded-3xl border border-slate-200 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Live Interactive Stage Preview
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewEmotion("CRUISING")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    previewEmotion === "CRUISING" ? "bg-blue-600 text-white" : "bg-white text-slate-600"
                  }`}
                >
                  Cruise
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEmotion("WAVING")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    previewEmotion === "WAVING" ? "bg-amber-500 text-white" : "bg-white text-slate-600"
                  }`}
                >
                  Wave
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEmotion("CELEBRATING")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    previewEmotion === "CELEBRATING" ? "bg-purple-600 text-white" : "bg-white text-slate-600"
                  }`}
                >
                  Cheer
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-inner flex items-center justify-center min-h-[220px]">
              <LivingCharacterSprite
                type={templateTypeMap[baseTemplate] || "wheelchair_hero"}
                emotion={previewEmotion}
                themeColor={themeColor}
                ctaText={defaultCta}
                bubbleText={defaultBubble}
                showBubble={true}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Rigging Active Features:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              {rigging.hasWheelSpin && <li>Rotating Wheel / Joint Physics Active</li>}
              {rigging.hasBlinkingEyes && <li>Natural Eye Eyelid Blinking Active</li>}
              {rigging.hasGazeTracking && <li>Cursor Pupil Mouse Tracking Active</li>}
              {rigging.hasWavingArm && <li>Hover Kinetic Arm Waving Active</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};