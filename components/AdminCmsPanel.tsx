"use client";

import React, { useState } from "react";
import { AdCampaign, CharacterAsset, CharacterId, CampaignMode, PageSlug, CharacterSize } from "../types/campaign";
import { MOCK_CHARACTERS, MOCK_ADVERTISERS } from "../lib/mockData";
import { CharacterLibrary } from "./CharacterLibrary";
import { CharacterSprite } from "./CharacterSprite";

interface AdminCmsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: AdCampaign[];
  onSaveCampaign: (campaign: AdCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const ALL_PAGES: { slug: PageSlug; label: string }[] = [
  { slug: "all", label: "🌐 All Pages (Sitewide)" },
  { slug: "home", label: "🏠 Homepage Only" },
  { slug: "wheelchairs", label: "🧑‍🦼 Wheelchairs Category" },
  { slug: "vans", label: "🚐 Vans & Vehicles Category" },
  { slug: "scooters", label: "🛵 Mobility Scooters Category" },
  { slug: "finance", label: "💳 Finance & Support Page" },
];

export const AdminCmsPanel: React.FC<AdminCmsPanelProps> = ({
  isOpen,
  onClose,
  campaigns,
  onSaveCampaign,
  onDeleteCampaign,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "edit">("list");
  const [editingCampaign, setEditingCampaign] = useState<Partial<AdCampaign> | null>(null);

  if (!isOpen) return null;

  const handleStartNew = () => {
    const defaultChar = MOCK_CHARACTERS[0];
    setEditingCampaign({
      id: `camp_${Date.now()}`,
      advertiserName: "ABC Mobility Solutions",
      advertiserId: MOCK_ADVERTISERS[0].id,
      characterId: defaultChar.id,
      characterSize: "large",
      campaignMode: "CO_OP",
      partnerCharacterId: "accessible_van",
      partnerAdvertiserName: "Freedom Mobility & Chairs",
      dialogueScript: {
        char1Line: "Need an accessible ramp van?",
        char2Line: "ABC Mobility has 20+ in stock!"
      },
      mergedBannerText: "Click for Co-Op Van & Wheelchair Packages",
      ctaText: defaultChar.defaultCta,
      bubbleText: defaultChar.defaultBubble,
      targetUrl: "https://example.com/abcmobility",
      clickBehavior: "MODAL",
      assignedPages: ["all", "home"],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "ACTIVE",
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    });
    setActiveTab("edit");
  };

  const handleEdit = (camp: AdCampaign) => {
    setEditingCampaign({ ...camp });
    setActiveTab("edit");
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.advertiserName || !editingCampaign.ctaText) return;
    onSaveCampaign(editingCampaign as AdCampaign);
    setActiveTab("list");
    setEditingCampaign(null);
  };

  const handlePageToggle = (slug: PageSlug) => {
    if (!editingCampaign) return;
    const current: PageSlug[] = editingCampaign.assignedPages || [];
    if (slug === "all") {
      setEditingCampaign({ ...editingCampaign, assignedPages: ["all"] });
      return;
    }
    let updated: PageSlug[] = current.filter(p => p !== "all");
    if (updated.includes(slug)) {
      updated = updated.filter(p => p !== slug);
    } else {
      updated.push(slug);
    }
    if (updated.length === 0) updated = ["all"];
    setEditingCampaign({ ...editingCampaign, assignedPages: updated });
  };

  const selectedCharMeta = MOCK_CHARACTERS.find(c => c.id === editingCampaign?.characterId) || MOCK_CHARACTERS[0];
  const partnerCharMeta = MOCK_CHARACTERS.find(c => c.id === editingCampaign?.partnerCharacterId) || MOCK_CHARACTERS[1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* --- MODAL HEADER --- */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold">
              🎭
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Ad Slot Revenue & Choreography CMS
              </h3>
              <p className="text-xs text-slate-400">
                Configure solo cruisers, co-op dialogues, hero convoys & dynamic dynamic text flags.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeTab === "edit") {
                  setActiveTab("list");
                } else {
                  handleStartNew();
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              {activeTab === "edit" ? "← Back to Campaigns" : "+ Create New Ad Campaign"}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* --- BODY CONTENT: LIST VIEW vs EDIT FORM --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === "list" ? (
            <div className="space-y-6">
              {/* Stats Overview Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Ad Slots</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {campaigns.filter(c => c.status === "ACTIVE").length} / {campaigns.length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Co-Op & Convoy Slots</div>
                  <div className="text-2xl font-black text-purple-600 mt-1">
                    {campaigns.filter(c => c.campaignMode !== "SOLO").length} Active
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Monthly Revenue</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    ${(campaigns.filter(c => c.status === "ACTIVE").reduce((sum, c) => sum + (c.campaignMode === "CO_OP" ? 1800 : c.campaignMode === "CONVOY" ? 3000 : 850), 0)).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Dialogue Clicks</div>
                  <div className="text-2xl font-black text-indigo-600 mt-1">
                    {campaigns.reduce((acc, c) => acc + c.clicks, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Campaign Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h4 className="text-sm font-bold text-slate-800">Advertiser Choreography Campaigns</h4>
                  <span className="text-xs text-slate-500">{campaigns.length} total campaigns configured</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {campaigns.map((camp) => {
                    const charMeta = MOCK_CHARACTERS.find(c => c.id === camp.characterId);
                    return (
                      <div key={camp.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                        
                        {/* Advertiser & Mode Info */}
                        <div className="flex items-start gap-4 min-w-[280px]">
                          <div className="text-3xl p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex-shrink-0">
                            {charMeta?.icon || "🎭"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-extrabold text-slate-900 text-sm">{camp.advertiserName}</h5>
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                camp.campaignMode === "CO_OP"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : camp.campaignMode === "CONVOY"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {camp.campaignMode} MODE
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                camp.characterSize === "small"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : camp.characterSize === "medium"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>
                                {camp.characterSize === "small" ? "COMPACT (SM)" : camp.characterSize === "medium" ? "STANDARD (MD)" : "HERO (LG)"}
                              </span>
                            </div>
                            <div className="text-xs text-blue-700 font-bold mt-0.5">
                              Character: <span className="text-slate-700">{charMeta?.name || camp.characterId}</span>
                            </div>
                            {camp.dialogueScript && (
                              <div className="text-[11px] text-slate-600 mt-1 italic space-y-0.5">
                                <div>💬 Char 1: "{camp.dialogueScript.char1Line}"</div>
                                <div>💬 Char 2: "{camp.dialogueScript.char2Line}"</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Page Assignment & Schedule */}
                        <div className="space-y-1 text-xs text-slate-600">
                          <div>
                            <span className="font-bold text-slate-700">Pages: </span>
                            {camp.assignedPages.map(p => (
                              <span key={p} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md mr-1 text-[10px] font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Schedule: </span>
                            <span>{camp.startDate} to {camp.endDate}</span>
                          </div>
                        </div>

                        {/* Clicks & Actions */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onToggleStatus(camp.id)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                              camp.status === "ACTIVE"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                          >
                            {camp.status === "ACTIVE" ? "Pause Ad" : "Activate Ad"}
                          </button>

                          <button
                            onClick={() => handleEdit(camp)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition-all"
                          >
                            Edit Flow
                          </button>

                          <button
                            onClick={() => onDeleteCampaign(camp.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            🗑️
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* --- EDIT / CREATE FORM --- */
            <form onSubmit={handleSubmitForm} className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span>⚙️</span> Campaign & Choreography Flow Builder
                </h4>

                {/* 1. Campaign Mode Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    1. Campaign Flow Mode *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { mode: "SOLO", title: "🚶 Solo Cruiser", desc: "Single character cruising horizontally across web pages." },
                      { mode: "CO_OP", title: "🤝 Co-Op Dialogue", desc: "Two characters meet at center & exchange speech bubbles." },
                      { mode: "CONVOY", title: "🚜 Hero Group Convoy", desc: "Three characters converge as a team parade." },
                      { mode: "RACE_OVERTAKE", title: "⚡ Overtake Race", desc: "Fast racer accelerates & passes partner with playful banter." }
                    ].map((m) => {
                      const isSel = (editingCampaign?.campaignMode || "SOLO") === m.mode;
                      return (
                        <button
                          key={m.mode}
                          type="button"
                          onClick={() => setEditingCampaign({ ...editingCampaign, campaignMode: m.mode as CampaignMode })}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            isSel
                              ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="font-extrabold text-xs text-slate-900">{m.title}</div>
                          <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1B. Flag Shape Customizer */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    1B. Trailing Banner Flag Shape *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { shape: "swallowtail", title: "🚩 Swallowtail", desc: "Classic dual-v-cut tail flag" },
                      { shape: "ribbon", title: "🎗️ Ribbon Streamer", desc: "Sleek flowing ribbon banner" },
                      { shape: "pennant", title: "📐 Pennant Triangle", desc: "Dynamic speed chevron tail" },
                      { shape: "box", title: "🏷️ Box Badge", desc: "Clean rounded rectangular badge" },
                    ].map((f) => {
                      const isSel = (editingCampaign?.flagShape || "swallowtail") === f.shape;
                      return (
                        <button
                          key={f.shape}
                          type="button"
                          onClick={() => setEditingCampaign({ ...editingCampaign, flagShape: f.shape as any })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            isSel
                              ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-xs font-extrabold">{f.title}</div>
                          <div className="text-[10px] text-slate-500">{f.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1C. Character Sizing & Placement Tier */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    1C. Character Sizing & Sponsor Tier *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { size: "large", title: "🌟 Large (Hero / Premium)", badge: "100% Hero Scale", desc: "Full scale (~200px) — Flagship sponsor with maximum visual authority & click impact." },
                      { size: "medium", title: "✨ Medium (Standard)", badge: "80% Standard Scale", desc: "Balanced scale (~150px) — Standard category sponsorship with crisp typography." },
                      { size: "small", title: "🔍 Small (Compact)", badge: "62% Compact Scale", desc: "Compact scale (~115px) — Subtle peripheral placement; non-intrusive mobile browsing." },
                    ].map((s) => {
                      const isSel = (editingCampaign?.characterSize || "large") === s.size;
                      return (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => setEditingCampaign({ ...editingCampaign, characterSize: s.size as CharacterSize })}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                            isSel
                              ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-md shadow-blue-500/10"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-xs font-extrabold flex items-center justify-between">
                            <span>{s.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">{s.badge}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{s.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Advertiser Info & Target URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      2. Primary Advertiser Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCampaign?.advertiserName || ""}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, advertiserName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      3. Target URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCampaign?.targetUrl || ""}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, targetUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Character Asset Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    4. Primary Character Selection *
                  </label>
                  <CharacterLibrary
                    selectedCharacterId={(editingCampaign?.characterId || "wheelchair_boy") as CharacterId}
                    onSelectCharacter={(char: CharacterAsset) => {
                      setEditingCampaign({ ...editingCampaign, characterId: char.id });
                    }}
                    sampleCtaText={editingCampaign?.ctaText}
                    selectedFlagShape={editingCampaign?.flagShape}
                    selectedAccessory={editingCampaign?.accessory}
                    onSelectAccessory={(accessory) => {
                      setEditingCampaign({ ...editingCampaign, accessory });
                    }}
                  />
                </div>

                {/* 4. CHOREOGRAPHY SCRIPT BUILDER (If CO_OP or CONVOY mode) */}
                {editingCampaign?.campaignMode !== "SOLO" && (
                  <div className="p-5 bg-purple-50/70 border-2 border-purple-200 rounded-3xl space-y-4">
                    <h5 className="text-xs font-black text-purple-900 flex items-center gap-2">
                      <span>💬</span> Co-Op Dialogue Script & Secondary Character Setup
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Secondary Partner Character *
                        </label>
                        <select
                          value={editingCampaign?.partnerCharacterId || "accessible_van"}
                          onChange={(e) => setEditingCampaign({ ...editingCampaign, partnerCharacterId: e.target.value as CharacterId })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          {MOCK_CHARACTERS.map(ch => (
                            <option key={ch.id} value={ch.id}>
                              {ch.icon} {ch.name} ({ch.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Joint Merged Banner Flag Text
                        </label>
                        <input
                          type="text"
                          value={editingCampaign?.mergedBannerText || ""}
                          onChange={(e) => setEditingCampaign({ ...editingCampaign, mergedBannerText: e.target.value })}
                          placeholder='e.g. "Click for Co-Op Van & Wheelchair Packages"'
                          className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Character 1 Speech Bubble Line
                        </label>
                        <input
                          type="text"
                          value={editingCampaign?.dialogueScript?.char1Line || ""}
                          onChange={(e) => setEditingCampaign({
                            ...editingCampaign,
                            dialogueScript: {
                              char1Line: e.target.value,
                              char2Line: editingCampaign?.dialogueScript?.char2Line || ""
                            }
                          })}
                          placeholder='e.g. "Need an accessible wheelchair van?"'
                          className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Character 2 Speech Bubble Line
                        </label>
                        <input
                          type="text"
                          value={editingCampaign?.dialogueScript?.char2Line || ""}
                          onChange={(e) => setEditingCampaign({
                            ...editingCampaign,
                            dialogueScript: {
                              char1Line: editingCampaign?.dialogueScript?.char1Line || "",
                              char2Line: e.target.value
                            }
                          })}
                          placeholder='e.g. "ABC Mobility has 20+ in stock!"'
                          className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-Time Dialogue Encounter Render Preview */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Live Encounter Flow Render Preview ({editingCampaign?.campaignMode || "SOLO"})</span>
                    <span className="text-[10px] text-slate-400">Center Encounter Point</span>
                  </div>
                  <div className="h-32 flex items-center justify-center gap-6 overflow-hidden relative">
                    <div className="transform">
                      <CharacterSprite
                        characterId={editingCampaign?.characterId || "wheelchair_boy"}
                        ctaText={editingCampaign?.mergedBannerText || editingCampaign?.ctaText || "Click to see our products"}
                        bubbleText={editingCampaign?.dialogueScript?.char1Line || editingCampaign?.bubbleText}
                        themeColor={selectedCharMeta.themeColor}
                        flagShape={editingCampaign?.flagShape}
                        accessory={editingCampaign?.accessory}
                        size={editingCampaign?.characterSize || "large"}
                      />
                    </div>
                    {editingCampaign?.campaignMode !== "SOLO" && (
                      <div className="transform -ml-8">
                        <CharacterSprite
                          characterId={editingCampaign?.partnerCharacterId || "accessible_van"}
                          ctaText={editingCampaign?.ctaText || "Click to see our products"}
                          bubbleText={editingCampaign?.dialogueScript?.char2Line || partnerCharMeta.defaultBubble}
                          themeColor={partnerCharMeta.themeColor}
                          flagShape="swallowtail"
                          size={editingCampaign?.characterSize || "large"}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Page Assignment */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    5. Page Assignment *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {ALL_PAGES.map((pg) => {
                      const isAssigned = (editingCampaign?.assignedPages || []).includes(pg.slug);
                      return (
                        <button
                          key={pg.slug}
                          type="button"
                          onClick={() => handlePageToggle(pg.slug)}
                          className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${
                            isAssigned
                              ? "border-blue-600 bg-blue-50 text-blue-800"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span>{pg.label}</span>
                          {isAssigned && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Submit Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("list")}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all"
                  >
                    Save & Launch Choreography Campaign →
                  </button>
                </div>

              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
