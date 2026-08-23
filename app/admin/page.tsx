"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdCampaign, CharacterAsset, CharacterId, CampaignMode, PageSlug, CharacterSize, FlagShape, CharacterAccessory } from "../../types/campaign";
import { INITIAL_CAMPAIGNS, MOCK_CHARACTERS, MOCK_ADVERTISERS } from "../../lib/mockData";
import { CharacterLibrary } from "../../components/CharacterLibrary";
import { CharacterSprite } from "../../components/CharacterSprite";
import { CruisingAdEngine } from "../../components/CruisingAdEngine";

const ALL_PAGES: { slug: PageSlug; label: string }[] = [
  { slug: "all", label: "🌐 All Pages (Sitewide)" },
  { slug: "home", label: "🏠 Homepage Only" },
  { slug: "wheelchairs", label: "🧑‍🦼 Wheelchairs Category" },
  { slug: "vans", label: "🚐 Vans & Vehicles Category" },
  { slug: "scooters", label: "🛵 Mobility Scooters Category" },
  { slug: "finance", label: "💳 Finance & Support Page" },
];

export default function AdminCmsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<"list" | "edit">("list");
  const [editingCampaign, setEditingCampaign] = useState<Partial<AdCampaign> | null>(null);

  const activeCount = campaigns.filter(c => c.status === "ACTIVE").length;
  const multiCharCount = campaigns.filter(c => c.status === "ACTIVE" && c.campaignMode !== "SOLO").length;
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const estRevenue = activeCount * 850;

  const handleStartNew = () => {
    const defaultChar = MOCK_CHARACTERS[0];
    setEditingCampaign({
      id: `camp_${Date.now()}`,
      advertiserName: "Suraj Mobility Solutions",
      advertiserId: "adv_abc_mobility",
      characterId: defaultChar.id,
      characterSize: "large",
      campaignMode: "SOLO",
      ctaText: "Suraj Mobility Solutions — Explore All Ads",
      bubbleText: "Suraj Mobility Solutions",
      targetUrl: "https://example.com/surajmobility",
      clickBehavior: "PAGE",
      assignedPages: ["all", "home", "wheelchairs"],
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

  const handleDelete = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" };
      }
      return c;
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.advertiserName || !editingCampaign.ctaText) return;

    const savedCampaign = editingCampaign as AdCampaign;
    setCampaigns(prev => {
      const exists = prev.some(c => c.id === savedCampaign.id);
      if (exists) {
        return prev.map(c => c.id === savedCampaign.id ? savedCampaign : c);
      }
      return [savedCampaign, ...prev];
    });
    setActiveTab("list");
  };

  const handlePageToggle = (slug: PageSlug) => {
    if (!editingCampaign) return;
    const current = editingCampaign.assignedPages || [];
    let updated: PageSlug[];
    if (slug === "all") {
      updated = current.includes("all") ? [] : ["all"];
    } else {
      const filtered = current.filter(s => s !== "all");
      updated = filtered.includes(slug)
        ? filtered.filter(s => s !== slug)
        : [...filtered, slug];
    }
    setEditingCampaign({ ...editingCampaign, assignedPages: updated });
  };

  const selectedCharMeta = MOCK_CHARACTERS.find(c => c.id === editingCampaign?.characterId) || MOCK_CHARACTERS[0];
  const partnerCharMeta = MOCK_CHARACTERS.find(c => c.id === editingCampaign?.partnerCharacterId) || MOCK_CHARACTERS[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* --- TOP STICKY CMS HEADER --- */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 border border-slate-700 shadow-sm"
            >
              <span>←</span>
              <span>Back to Marketplace</span>
            </Link>
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
                🎭
              </div>
              <div>
                <h1 className="text-base md:text-lg font-black text-white leading-tight">
                  Ad Slot Revenue &amp; Choreography CMS
                </h1>
                <p className="text-[11px] text-slate-400">
                  Configure solo cruisers, co-op dialogues, hero convoys &amp; sponsor sizing tiers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "edit" ? (
              <button
                onClick={() => setActiveTab("list")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Cancel &amp; View All
              </button>
            ) : (
              <button
                onClick={handleStartNew}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>+</span>
                <span>Create New Ad Campaign</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN DASHBOARD CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* --- 4 REVENUE & PERFORMANCE METRIC TILES --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Ad Slots</span>
            <div className="text-3xl font-black text-blue-400">{activeCount} / {campaigns.length}</div>
            <p className="text-[10px] text-slate-500 font-medium">Currently cruising on site</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Co-Op &amp; Convoy Slots</span>
            <div className="text-3xl font-black text-purple-400">{multiCharCount} Active</div>
            <p className="text-[10px] text-slate-500 font-medium">Multi-character encounters</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Est. Monthly Revenue</span>
            <div className="text-3xl font-black text-emerald-400">${estRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-medium">$850/mo standard slot rate</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Dialogue Clicks</span>
            <div className="text-3xl font-black text-amber-400">{totalClicks.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-medium">High user engagement</p>
          </div>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === "list" ? (
          
          /* ============================================================ */
          /* --- CAMPAIGN LIST VIEW --- */
          /* ============================================================ */
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Advertiser Choreography Campaigns</h2>
                <p className="text-xs text-slate-400">Manage all solo, co-op, convoy, and overtake character campaigns.</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                {campaigns.length} total configured
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {campaigns.map((camp) => {
                const charMeta = MOCK_CHARACTERS.find(c => c.id === camp.characterId);
                const partnerMeta = MOCK_CHARACTERS.find(c => c.id === camp.partnerCharacterId);
                const isActive = camp.status === "ACTIVE";

                return (
                  <div key={camp.id} className="p-6 hover:bg-slate-800/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Left: Character Avatar & Campaign Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                        {charMeta?.icon || "🎭"}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-white text-base">{camp.advertiserName}</h3>
                          
                          {/* Mode Badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            camp.campaignMode === "CO_OP" ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" :
                            camp.campaignMode === "CONVOY" ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" :
                            camp.campaignMode === "RACE_OVERTAKE" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" :
                            "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}>
                            {camp.campaignMode} MODE
                          </span>

                          {/* Sizing Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            (camp.characterSize || "large") === "large" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" :
                            camp.characterSize === "medium" ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" :
                            "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}>
                            {camp.characterSize === "small" ? "COMPACT (SM)" : camp.characterSize === "medium" ? "STANDARD (MD)" : "HERO (LG)"}
                          </span>

                          {/* Destination Badge */}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {camp.clickBehavior === "PAGE" ? "STOREFRONT" : camp.clickBehavior || "PAGE"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400">
                          <strong className="text-slate-300">Banner:</strong> &ldquo;{camp.ctaText}&rdquo;
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span><strong>Pages:</strong> {camp.assignedPages.join(", ")}</span>
                          <span>•</span>
                          <span><strong>Schedule:</strong> {camp.startDate} to {camp.endDate}</span>
                          <span>•</span>
                          <span className="text-blue-400 font-bold">🎯 {camp.clicks} Clicks</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleToggleStatus(camp.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isActive
                            ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {isActive ? "✓ Active" : "Paused"}
                      </button>

                      <button
                        onClick={() => handleEdit(camp)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all"
                      >
                        Edit Flow
                      </button>

                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700 hover:border-red-400/30"
                        title="Delete Campaign"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /* ============================================================ */
          /* --- CAMPAIGN BUILDER & EDITOR FORM --- */
          /* ============================================================ */
          <form onSubmit={handleSubmitForm} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-8 shadow-2xl">
            
            <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Campaign Choreography Studio</h2>
                <p className="text-xs text-slate-400">Design dynamic animated ads, multi-character encounters, and sizing tiers.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                ← Back to Campaigns
              </button>
            </div>

            {/* 1. Choreography Encounter Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1. Campaign Encounter Mode *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { id: "SOLO", icon: "👤", title: "Solo Cruiser", desc: "Single character cruising smoothly across the viewport." },
                  { id: "CO_OP", icon: "💬", title: "Co-Op Dialogue", desc: "Two partner characters cruise together and exchange speech bubbles." },
                  { id: "CONVOY", icon: "🚚", title: "Hero Convoy", desc: "Train of 2-3 characters cruising in synchronized formation." },
                  { id: "RACE_OVERTAKE", icon: "⚡", title: "Race Overtake", desc: "Fast vehicle overtakes standard cruiser midway on screen." }
                ].map((mode) => {
                  const isSel = (editingCampaign?.campaignMode || "SOLO") === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, campaignMode: mode.id as CampaignMode })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSel
                          ? "border-blue-500 bg-blue-500/10 text-white font-bold shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="text-2xl mb-1">{mode.icon}</div>
                      <div className="text-xs font-extrabold text-white">{mode.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1B. Flag Shape & Geometry */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1B. Flag Shape &amp; Geometry *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { shape: "swallowtail", title: "Swallowtail Flag 🚩", desc: "Deep V-cut tail" },
                  { shape: "ribbon", title: "Wavy Ribbon 🎗️", desc: "Smooth wave tails" },
                  { shape: "pennant", title: "Triangular Pennant 📐", desc: "Tapered point" },
                  { shape: "box", title: "Badge Box 🏷️", desc: "Solid rectangle" },
                ].map((f) => {
                  const isSel = (editingCampaign?.flagShape || "swallowtail") === f.shape;
                  return (
                    <button
                      key={f.shape}
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, flagShape: f.shape as FlagShape })}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isSel
                          ? "border-blue-500 bg-blue-500/10 text-white font-bold shadow-md"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">{f.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1C. Character Sizing Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1C. Character Sizing &amp; Sponsor Tier *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { size: "large", title: "🌟 Large (Hero / Premium)", badge: "100% Scale", desc: "Full scale (~200px) — Flagship sponsor with maximum visual authority & click impact." },
                  { size: "medium", title: "✨ Medium (Standard)", badge: "80% Scale", desc: "Balanced scale (~150px) — Standard category sponsorship with crisp typography." },
                  { size: "small", title: "🔍 Small (Compact)", badge: "62% Scale", desc: "Compact scale (~115px) — Subtle peripheral placement; non-intrusive mobile browsing." },
                ].map((s) => {
                  const isSel = (editingCampaign?.characterSize || "large") === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, characterSize: s.size as CharacterSize })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSel
                          ? "border-amber-500 bg-amber-500/10 text-white font-bold shadow-lg shadow-amber-500/20"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white flex items-center justify-between">
                        <span>{s.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">{s.badge}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Advertiser Name & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  2. Primary Advertiser Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCampaign?.advertiserName || ""}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, advertiserName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  3. Dynamic Flag Banner CTA Text *
                </label>
                <input
                  type="text"
                  required
                  value={editingCampaign?.ctaText || ""}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2B. User Click Destination Action */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                2B. User Click Destination Action *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "PAGE", icon: "🏪", title: "Dedicated Seller Page", desc: "Opens full /seller/[id] showcase with products, NDIS badges & booking inquiry form." },
                  { id: "MODAL", icon: "📱", title: "Quick Catalog Modal", desc: "Opens popup dialog displaying featured inventory without leaving the current page." },
                  { id: "URL", icon: "🔗", title: "Direct External URL", desc: "Directly opens advertiser external website in a new browser tab." },
                ].map((dest) => {
                  const isSel = (editingCampaign?.clickBehavior || "PAGE") === dest.id;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, clickBehavior: dest.id as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSel
                          ? "border-emerald-500 bg-emerald-500/10 text-white font-bold shadow-lg shadow-emerald-500/20"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <span>{dest.icon}</span>
                        <span>{dest.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{dest.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Character Picker & Outfit Customizer */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                3. Primary Character &amp; Outfit Customizer (16 Available) *
              </label>
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800">
                <CharacterLibrary
                  selectedCharacterId={(editingCampaign?.characterId || "wheelchair_boy") as CharacterId}
                  onSelectCharacter={(char: CharacterAsset) => {
                    setEditingCampaign({ ...editingCampaign, characterId: char.id, ctaText: char.defaultCta, bubbleText: char.defaultBubble });
                  }}
                  sampleCtaText={editingCampaign?.ctaText}
                  selectedFlagShape={editingCampaign?.flagShape}
                  selectedAccessory={editingCampaign?.accessory}
                  onSelectAccessory={(accessory) => {
                    setEditingCampaign({ ...editingCampaign, accessory });
                  }}
                />
              </div>
            </div>

            {/* 4. Live Dialogue & Encounter Flow Preview */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <span>🎬</span> Live Encounter Studio Preview ({editingCampaign?.campaignMode || "SOLO"})
                </span>
                <span className="text-[10px] text-slate-400">Interactive Preview</span>
              </div>
              <div className="h-36 bg-slate-900/90 rounded-2xl flex items-center justify-center gap-6 overflow-hidden relative border border-slate-800">
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
                  <div className="transform -ml-6">
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
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
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
                      className={`p-3.5 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${
                        isAssigned
                          ? "border-blue-500 bg-blue-500/15 text-white font-black"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>{pg.label}</span>
                      {isAssigned && <span className="text-blue-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-xl shadow-blue-600/30 transition-all"
              >
                Save &amp; Deploy Campaign to Marketplace →
              </button>
            </div>

          </form>
        )}

      </main>

      {/* Cruising Ad engine on admin page */}
      <CruisingAdEngine
        campaigns={campaigns}
        currentPage="all"
        onCampaignClick={(camp) => handleEdit(camp)}
      />

    </div>
  );
}
