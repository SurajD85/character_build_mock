"use client";

import React, { useState, useEffect } from "react";
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

  // Interactive Stage Simulation State
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationDialogueStep, setSimulationDialogueStep] = useState(0);

  const activeCount = campaigns.filter(c => c.status === "ACTIVE").length;
  const multiCharCount = campaigns.filter(c => c.status === "ACTIVE" && c.campaignMode !== "SOLO").length;
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const estRevenue = activeCount * 850;

  // Dialogue simulation timer
  useEffect(() => {
    if (!isSimulating || editingCampaign?.campaignMode === "SOLO") return;
    const interval = setInterval(() => {
      setSimulationDialogueStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(interval);
  }, [isSimulating, editingCampaign?.campaignMode]);

  const handleStartNew = () => {
    const defaultChar = MOCK_CHARACTERS[0];
    setEditingCampaign({
      id: `camp_${Date.now()}`,
      advertiserName: "Suraj Mobility Solutions",
      advertiserId: "adv_abc_mobility",
      characterId: defaultChar.id,
      characterSize: "large",
      campaignMode: "SOLO",
      flagShape: "swallowtail",
      accessory: "none",
      partnerCharacterId: "accessible_van",
      partnerAdvertiserName: "Freedom Mobility & Chairs",
      dialogueScript: {
        char1Line: "Need an accessible wheelchair van?",
        char2Line: "Yes! 20+ models in stock!"
      },
      mergedBannerText: "Click for Co-Op Van & Wheelchair Packages",
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
    setEditingCampaign({
      flagShape: "swallowtail",
      accessory: "none",
      characterSize: "large",
      ...camp,
    });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* --- TOP STICKY CMS HEADER (CLEAN LIGHT THEME) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-black transition-all flex items-center gap-2 border border-slate-200 shadow-sm"
            >
              <span>←</span>
              <span>Back to Marketplace</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-xl shadow-md text-white">
                🎭
              </div>
              <div>
                <h1 className="text-base md:text-lg font-black text-slate-900 leading-tight">
                  Ad Slot Revenue &amp; Choreography CMS
                </h1>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Configure solo cruisers, co-op dialogues, hero convoys &amp; sponsor sizing tiers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "edit" ? (
              <button
                onClick={() => setActiveTab("list")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
              >
                Cancel &amp; View All
              </button>
            ) : (
              <button
                onClick={handleStartNew}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
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
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Active Ad Slots</span>
            <div className="text-3xl font-black text-blue-600">{activeCount} / {campaigns.length}</div>
            <p className="text-[11px] text-slate-400 font-medium">Currently cruising on site</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Co-Op &amp; Convoy Slots</span>
            <div className="text-3xl font-black text-purple-600">{multiCharCount} Active</div>
            <p className="text-[11px] text-slate-400 font-medium">Multi-character encounters</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Est. Monthly Revenue</span>
            <div className="text-3xl font-black text-emerald-600">${estRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-medium">$850/mo standard slot rate</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Dialogue Clicks</span>
            <div className="text-3xl font-black text-amber-600">{totalClicks.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-medium">High user engagement</p>
          </div>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === "list" ? (
          
          /* ============================================================ */
          /* --- CAMPAIGN LIST VIEW --- */
          /* ============================================================ */
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900">Advertiser Choreography Campaigns</h2>
                <p className="text-xs text-slate-500">Manage all solo, co-op, convoy, and overtake character campaigns.</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                {campaigns.length} total configured
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {campaigns.map((camp) => {
                const charMeta = MOCK_CHARACTERS.find(c => c.id === camp.characterId);
                const isActive = camp.status === "ACTIVE";

                return (
                  <div key={camp.id} className="p-6 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Left: Character Avatar & Campaign Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                        {charMeta?.icon || "🎭"}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{camp.advertiserName}</h3>
                          
                          {/* Mode Badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            camp.campaignMode === "CO_OP" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                            camp.campaignMode === "CONVOY" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            camp.campaignMode === "RACE_OVERTAKE" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                            {camp.campaignMode} MODE
                          </span>

                          {/* Sizing Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            (camp.characterSize || "large") === "large" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                            camp.characterSize === "medium" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {camp.characterSize === "small" ? "COMPACT (SM)" : camp.characterSize === "medium" ? "STANDARD (MD)" : "HERO (LG)"}
                          </span>

                          {/* Flag Shape Badge */}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            🚩 {camp.flagShape || "Swallowtail"}
                          </span>

                          {/* Destination Badge */}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {camp.clickBehavior === "PAGE" ? "STOREFRONT" : camp.clickBehavior || "PAGE"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-800">Banner:</strong> &ldquo;{camp.ctaText}&rdquo;
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span><strong>Pages:</strong> {camp.assignedPages.join(", ")}</span>
                          <span>•</span>
                          <span><strong>Schedule:</strong> {camp.startDate} to {camp.endDate}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-bold">🎯 {camp.clicks} Clicks</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleToggleStatus(camp.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isActive
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200"
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
                        className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all border border-slate-200 hover:border-red-200"
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
          /* --- 2-COLUMN SPLIT STUDIO: CONTROLS (LEFT) + STICKY SIMULATOR (RIGHT) --- */
          /* ============================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ============================================================ */}
            {/* --- LEFT COLUMN (7 COLS): CONFIGURATION CONTROLS --- */}
            {/* ============================================================ */}
            <form onSubmit={handleSubmitForm} className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-7 space-y-8 shadow-sm">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Campaign Choreography Studio</h2>
                  <p className="text-xs text-slate-500">Customize motion parameters, vector flag geometries, and size tiers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
                >
                  ← Back to List
                </button>
              </div>

              {/* 1. Choreography Encounter Mode */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span>1.</span> Campaign Encounter Mode *
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Live Stage Updates Instantly
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "SOLO", icon: "👤", title: "Solo Cruiser", desc: "Single character gliding smoothly across the viewport." },
                    { id: "CO_OP", icon: "💬", title: "Co-Op Dialogue", desc: "Two characters cruise in tandem and exchange speech bubbles." },
                    { id: "CONVOY", icon: "🚚", title: "Hero Convoy", desc: "Formation of 2 characters with connected banners." },
                    { id: "RACE_OVERTAKE", icon: "⚡", title: "Race Overtake", desc: "Fast cruiser overtakes partner midway across the screen." }
                  ].map((mode) => {
                    const isSel = (editingCampaign?.campaignMode || "SOLO") === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setEditingCampaign({ ...editingCampaign, campaignMode: mode.id as CampaignMode })}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSel
                            ? "border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-sm ring-2 ring-blue-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{mode.icon}</span>
                          <span className="text-xs font-extrabold text-slate-900">{mode.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">{mode.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1B. Flag Shape & Geometry (Real-time SVG Shapes) */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>1B.</span> Flag Shape &amp; Vector Geometry *
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { shape: "swallowtail", icon: "🚩", title: "Swallowtail", desc: "Deep V-cut tail" },
                    { shape: "ribbon", icon: "🎗️", title: "Wavy Ribbon", desc: "Gold wave border" },
                    { shape: "pennant", icon: "📐", title: "Pennant", desc: "Tapered point" },
                    { shape: "box", icon: "🏷️", title: "Badge Box", desc: "Rounded pill" },
                  ].map((f) => {
                    const isSel = (editingCampaign?.flagShape || "swallowtail") === f.shape;
                    return (
                      <button
                        key={f.shape}
                        type="button"
                        onClick={() => setEditingCampaign({ ...editingCampaign, flagShape: f.shape as FlagShape })}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${
                          isSel
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-extrabold shadow-sm ring-2 ring-blue-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xl mb-1">{f.icon}</div>
                        <div className="text-xs font-bold text-slate-900">{f.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1C. Character Sizing & Sponsor Tier */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>1C.</span> Character Sizing &amp; Sponsor Tier *
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    { size: "large", title: "🌟 Hero (100%)", height: "~180px", desc: "Maximum visual impact & flagship authority." },
                    { size: "medium", title: "✨ Standard (80%)", height: "~145px", desc: "Balanced scale for category sponsorship." },
                    { size: "small", title: "🔍 Compact (62%)", height: "~110px", desc: "Subtle peripheral placement." },
                  ].map((s) => {
                    const isSel = (editingCampaign?.characterSize || "large") === s.size;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setEditingCampaign({ ...editingCampaign, characterSize: s.size as CharacterSize })}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSel
                            ? "border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-sm ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                          <span>{s.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">{s.height}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-snug">{s.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Advertiser Name & CTA Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    2. Primary Advertiser Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCampaign?.advertiserName || ""}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, advertiserName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    3. Dynamic Flag Banner CTA Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCampaign?.ctaText || ""}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2B. User Click Destination Action */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>2B.</span> User Click Destination Action *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    { id: "PAGE", icon: "🏪", title: "Dedicated Seller Page", desc: "Opens full /seller/[id] showcase with products & booking form." },
                    { id: "MODAL", icon: "📱", title: "Quick Catalog Modal", desc: "Opens popup dialog displaying featured items." },
                    { id: "URL", icon: "🔗", title: "Direct External URL", desc: "Opens advertiser external website." },
                  ].map((dest) => {
                    const isSel = (editingCampaign?.clickBehavior || "PAGE") === dest.id;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setEditingCampaign({ ...editingCampaign, clickBehavior: dest.id as any })}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSel
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{dest.icon}</span>
                          <span>{dest.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-snug">{dest.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Character Picker & Outfit Customizer */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>3.</span> Primary Character &amp; Outfit Customizer (16 Characters) *
                </label>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                  <CharacterLibrary
                    selectedCharacterId={(editingCampaign?.characterId || "wheelchair_boy") as CharacterId}
                    onSelectCharacter={(char: CharacterAsset) => {
                      setEditingCampaign({
                        ...editingCampaign,
                        characterId: char.id,
                        ctaText: `${editingCampaign?.advertiserName || "Suraj Mobility"} — ${char.defaultBubble}`,
                        bubbleText: char.defaultBubble,
                      });
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

              {/* 4. Co-Op Dialogue Script (Only if Multi-Character Mode) */}
              {editingCampaign?.campaignMode !== "SOLO" && (
                <div className="p-5 bg-purple-50/70 border-2 border-purple-200 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900 flex items-center gap-2">
                      <span>💬</span> Multi-Character Dialogue Script &amp; Partner Setup
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Dynamic Exchange</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Secondary Partner Character *
                      </label>
                      <select
                        value={editingCampaign?.partnerCharacterId || "accessible_van"}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, partnerCharacterId: e.target.value as CharacterId })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                        Partner Speech Line *
                      </label>
                      <input
                        type="text"
                        value={editingCampaign?.dialogueScript?.char2Line || ""}
                        onChange={(e) => setEditingCampaign({
                          ...editingCampaign,
                          dialogueScript: {
                            char1Line: editingCampaign?.dialogueScript?.char1Line || editingCampaign?.bubbleText || "",
                            char2Line: e.target.value,
                          }
                        })}
                        placeholder="e.g. Yes! Over 20+ models in stock!"
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Page Assignment */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>5.</span> Category Page Assignment *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ALL_PAGES.map((pg) => {
                    const isAssigned = (editingCampaign?.assignedPages || []).includes(pg.slug);
                    return (
                      <button
                        key={pg.slug}
                        type="button"
                        onClick={() => handlePageToggle(pg.slug)}
                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${
                          isAssigned
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-black"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{pg.label}</span>
                        {isAssigned && <span className="text-blue-600 font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs shadow-xl shadow-blue-600/30 transition-all"
                >
                  Save &amp; Deploy Campaign to Marketplace →
                </button>
              </div>

            </form>

            {/* ============================================================ */}
            {/* --- RIGHT COLUMN (5 COLS): STICKY INTERACTIVE LIVE STAGE --- */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              
              {/* --- THE LIVE SIMULATOR STAGE BOX --- */}
              <div className="bg-white rounded-3xl border-2 border-blue-200 p-6 shadow-xl space-y-4 overflow-hidden relative">
                
                {/* Stage Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Live Simulation Stage
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSimulating(!isSimulating)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 ${
                        isSimulating
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span>{isSimulating ? "⏸ Pause" : "▶ Play Motion"}</span>
                    </button>
                  </div>
                </div>

                {/* Sizing Comparison Scale Ruler Top Guide */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-2">
                  <span>Scale Guide:</span>
                  <div className="flex items-center gap-2">
                    <span className={(editingCampaign?.characterSize || "large") === "large" ? "text-amber-600 font-extrabold underline" : ""}>
                      Large 180px
                    </span>
                    <span>•</span>
                    <span className={editingCampaign?.characterSize === "medium" ? "text-blue-600 font-extrabold underline" : ""}>
                      Medium 145px
                    </span>
                    <span>•</span>
                    <span className={editingCampaign?.characterSize === "small" ? "text-slate-700 font-extrabold underline" : ""}>
                      Small 110px
                    </span>
                  </div>
                </div>

                {/* Stage Viewport Area */}
                <div className="h-56 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100/80 rounded-2xl border border-slate-200 flex flex-col justify-end p-4 relative overflow-hidden shadow-inner">
                  
                  {/* Subtle ground baseline track */}
                  <div className="absolute bottom-3 left-0 right-0 h-1 bg-slate-200/80 border-t border-slate-300/40"></div>

                  {/* Motion floating wrapper */}
                  <div className={`relative flex items-end justify-center gap-4 transition-all duration-500 ${
                    isSimulating ? "animate-pulse" : ""
                  }`}>
                    
                    {/* Primary Character */}
                    <div className="relative transform transition-all duration-300">
                      <CharacterSprite
                        characterId={editingCampaign?.characterId || "wheelchair_boy"}
                        ctaText={editingCampaign?.ctaText || "Suraj Mobility Solutions — Explore All Ads"}
                        bubbleText={
                          editingCampaign?.campaignMode !== "SOLO" && simulationDialogueStep === 1
                            ? (editingCampaign?.dialogueScript?.char1Line || editingCampaign?.bubbleText)
                            : editingCampaign?.bubbleText
                        }
                        themeColor={selectedCharMeta.themeColor}
                        flagShape={editingCampaign?.flagShape || "swallowtail"}
                        accessory={editingCampaign?.accessory || "none"}
                        size={editingCampaign?.characterSize || "large"}
                        isTalking={simulationDialogueStep === 1}
                        isHovered={simulationDialogueStep === 1}
                      />
                    </div>

                    {/* Secondary Partner Character (If Multi-Character Mode) */}
                    {editingCampaign?.campaignMode !== "SOLO" && (
                      <div className={`relative transform transition-all duration-500 ${
                        editingCampaign?.campaignMode === "RACE_OVERTAKE" ? "translate-x-3 -translate-y-2" : "-ml-6"
                      }`}>
                        <CharacterSprite
                          characterId={editingCampaign?.partnerCharacterId || "accessible_van"}
                          ctaText={editingCampaign?.ctaText}
                          bubbleText={
                            simulationDialogueStep === 2
                              ? (editingCampaign?.dialogueScript?.char2Line || partnerCharMeta.defaultBubble)
                              : partnerCharMeta.defaultBubble
                          }
                          themeColor={partnerCharMeta.themeColor}
                          flagShape="swallowtail"
                          size={editingCampaign?.characterSize || "large"}
                          isTalking={simulationDialogueStep === 2}
                        />
                      </div>
                    )}

                  </div>

                </div>

                {/* Live Real-Time Spec Sheet */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold">Selected Mascot:</span>
                    <strong className="text-slate-900">{selectedCharMeta.icon} {selectedCharMeta.name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold">Active Outfit:</span>
                    <strong className="text-blue-700 capitalize">
                      {editingCampaign?.accessory && editingCampaign.accessory !== "none" ? `✨ ${editingCampaign.accessory.replace("_", " ")}` : "Standard Gear"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold">Flag Shape Geometry:</span>
                    <strong className="text-slate-900 capitalize">🚩 {editingCampaign?.flagShape || "Swallowtail"}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold">Sponsor Sizing Tier:</span>
                    <strong className="text-amber-700 uppercase">
                      {(editingCampaign?.characterSize || "large") === "large" ? "Hero (100% Scale)" : editingCampaign?.characterSize === "medium" ? "Standard (80% Scale)" : "Compact (62% Scale)"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold">Click Action Route:</span>
                    <strong className="text-emerald-700 font-mono text-[11px]">
                      {editingCampaign?.clickBehavior === "PAGE" ? "/seller/storefront" : editingCampaign?.clickBehavior || "/seller/storefront"}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          </div>
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
