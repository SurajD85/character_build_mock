"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AdCampaign, CharacterAsset, CharacterId, CampaignMode,
  PageSlug, CharacterSize, FlagShape, CharacterAccessory,
} from "../../types/campaign";
import { INITIAL_CAMPAIGNS, MOCK_CHARACTERS, MOCK_ADVERTISERS } from "../../lib/mockData";
import { CharacterLibrary } from "../../components/CharacterLibrary";
import { CharacterSprite } from "../../components/CharacterSprite";
import { CruisingAdEngine } from "../../components/CruisingAdEngine";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ALL_PAGES: { slug: PageSlug; label: string; icon: string }[] = [
  { slug: "all",         label: "All Pages (Sitewide)",       icon: "🌐" },
  { slug: "home",        label: "Homepage Only",              icon: "🏠" },
  { slug: "wheelchairs", label: "Wheelchairs",                icon: "🧑‍🦼" },
  { slug: "vans",        label: "Vans & Vehicles",            icon: "🚐" },
  { slug: "scooters",    label: "Mobility Scooters",          icon: "🛵" },
  { slug: "finance",     label: "Finance & Support",          icon: "💳" },
];

const ENCOUNTER_MODES: { id: CampaignMode; icon: string; title: string; subtitle: string; accentColor: string }[] = [
  { id: "SOLO",         icon: "👤", title: "Solo Cruiser",    subtitle: "Single mascot glides across viewport",   accentColor: "blue" },
  { id: "CO_OP",        icon: "💬", title: "Co-Op Dialogue",  subtitle: "Two mascots exchange speech bubbles",     accentColor: "purple" },
  { id: "CONVOY",       icon: "🚚", title: "Hero Convoy",     subtitle: "Formation pair with joined banner",       accentColor: "sky" },
  { id: "RACE_OVERTAKE",icon: "⚡", title: "Race Overtake",   subtitle: "Fast mascot overtakes mid-screen",        accentColor: "amber" },
];

const FLAG_SHAPES: { shape: FlagShape; icon: string; title: string; desc: string; svgPath: string }[] = [
  {
    shape: "swallowtail", icon: "🚩", title: "Swallowtail", desc: "Deep V-cut",
    svgPath: "M0,0 L80,0 L80,10 L64,25 L80,40 L80,50 L0,50 Z",
  },
  {
    shape: "ribbon",  icon: "🎗️", title: "Wavy Ribbon", desc: "Wave edge",
    svgPath: "M0,5 Q4,0 8,5 L80,5 L80,45 L8,45 Q4,50 0,45 Z",
  },
  {
    shape: "pennant", icon: "📐", title: "Pennant",     desc: "Sharp point",
    svgPath: "M0,0 L80,18 L80,32 L0,50 Z",
  },
  {
    shape: "box",     icon: "🏷️", title: "Badge Box",   desc: "Pill badge",
    svgPath: "M8,0 L72,0 Q80,0 80,8 L80,42 Q80,50 72,50 L8,50 Q0,50 0,42 L0,8 Q0,0 8,0 Z",
  },
];

const SIZE_TIERS: { size: CharacterSize; label: string; icon: string; height: number; price: string; desc: string; accent: string }[] = [
  { size: "large",  label: "Hero",     icon: "🌟", height: 56, price: "$1,200/mo", desc: "Maximum viewport impact",   accent: "amber" },
  { size: "medium", label: "Standard", icon: "✨", height: 44, price: "$850/mo",   desc: "Balanced brand presence",   accent: "blue"  },
  { size: "small",  label: "Compact",  icon: "🔍", height: 32, price: "$490/mo",   desc: "Subtle peripheral slot",    accent: "slate" },
];

// ─────────────────────────────────────────────────────────────
// HELPER — accent classes lookup
// ─────────────────────────────────────────────────────────────
const accentClasses: Record<string, { ring: string; bg: string; text: string; border: string; pill: string }> = {
  blue:   { ring: "ring-blue-500/30",   bg: "bg-blue-600",   text: "text-blue-600",   border: "border-blue-500",   pill: "bg-blue-50 text-blue-700 border-blue-200" },
  purple: { ring: "ring-purple-500/30", bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-500", pill: "bg-purple-50 text-purple-700 border-purple-200" },
  sky:    { ring: "ring-sky-500/30",    bg: "bg-sky-600",    text: "text-sky-600",    border: "border-sky-500",    pill: "bg-sky-50 text-sky-700 border-sky-200" },
  amber:  { ring: "ring-amber-500/30",  bg: "bg-amber-500",  text: "text-amber-600",  border: "border-amber-500",  pill: "bg-amber-50 text-amber-700 border-amber-200" },
  slate:  { ring: "ring-slate-400/30",  bg: "bg-slate-700",  text: "text-slate-600",  border: "border-slate-400",  pill: "bg-slate-100 text-slate-700 border-slate-200" },
  emerald:{ ring: "ring-emerald-500/30",bg: "bg-emerald-600",text: "text-emerald-600",border: "border-emerald-500",pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function AdminCmsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [view, setView] = useState<"list" | "studio">("list");
  const [editing, setEditing] = useState<Partial<AdCampaign> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dialogStep, setDialogStep] = useState(0);

  // ── Derived metrics ──────────────────────────────────────
  const activeCount  = campaigns.filter(c => c.status === "ACTIVE").length;
  const totalImpr    = campaigns.reduce((a, c) => a + c.impressions, 0);
  const totalClicks  = campaigns.reduce((a, c) => a + c.clicks, 0);
  const estRevenue   = activeCount * 850;

  // ── Co-Op dialogue cycle ─────────────────────────────────
  useEffect(() => {
    if (!isPlaying || editing?.campaignMode === "SOLO") return;
    const t = setInterval(() => setDialogStep(p => (p + 1) % 3), 2400);
    return () => clearInterval(t);
  }, [isPlaying, editing?.campaignMode]);

  // ── Helpers ──────────────────────────────────────────────
  const openNew = () => {
    const c = MOCK_CHARACTERS[0];
    setEditing({
      id: `camp_${Date.now()}`,
      advertiserName: "Suraj Mobility Solutions",
      advertiserId: "adv_suraj",
      characterId: c.id,
      characterSize: "large",
      campaignMode: "SOLO",
      flagShape: "swallowtail",
      accessory: "none",
      partnerCharacterId: "accessible_van",
      partnerAdvertiserName: "Freedom Mobility & Chairs",
      dialogueScript: { char1Line: "Need an accessible wheelchair van?", char2Line: "Yes! 20+ models in stock!" },
      mergedBannerText: "Click for Co-Op Van & Wheelchair Packages",
      ctaText: "Suraj Mobility — Explore All Ads",
      bubbleText: "Suraj Mobility Solutions",
      targetUrl: "https://example.com",
      clickBehavior: "PAGE",
      assignedPages: ["all"],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "ACTIVE",
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    });
    setView("studio");
  };

  const openEdit = (camp: AdCampaign) => {
    setEditing({ flagShape: "swallowtail", accessory: "none", characterSize: "large", ...camp });
    setView("studio");
  };

  const handleDelete  = (id: string) => setCampaigns(p => p.filter(c => c.id !== id));
  const handleToggle  = (id: string) => setCampaigns(p => p.map(c => c.id === id ? { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : c));
  const handlePageToggle = (slug: PageSlug) => {
    if (!editing) return;
    const cur = editing.assignedPages || [];
    let next: PageSlug[];
    if (slug === "all") { next = cur.includes("all") ? [] : ["all"]; }
    else {
      const filtered = cur.filter(s => s !== "all");
      next = filtered.includes(slug) ? filtered.filter(s => s !== slug) : [...filtered, slug];
    }
    setEditing({ ...editing, assignedPages: next });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.advertiserName) return;
    const saved = editing as AdCampaign;
    setCampaigns(p => {
      const exists = p.some(c => c.id === saved.id);
      return exists ? p.map(c => c.id === saved.id ? saved : c) : [saved, ...p];
    });
    setView("list");
  };

  const selectedCharMeta  = MOCK_CHARACTERS.find(c => c.id === editing?.characterId)  || MOCK_CHARACTERS[0];
  const partnerCharMeta   = MOCK_CHARACTERS.find(c => c.id === editing?.partnerCharacterId) || MOCK_CHARACTERS[1];
  const currentMode       = editing?.campaignMode || "SOLO";
  const currentSize       = editing?.characterSize || "large";
  const currentFlag       = editing?.flagShape     || "swallowtail";
  const currentAccessory  = editing?.accessory     || "none";

  // ─────────────────────────────────────────────────────────
  // SHARED HEADER
  // ─────────────────────────────────────────────────────────
  const Header = () => (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 text-sm font-black transition-all">
            ←
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
              🎭
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight">Choreography CMS</p>
              <p className="text-[11px] text-slate-400 font-medium">AbilityClassifieds Ad Studio</p>
            </div>
          </div>
        </div>

        {/* Nav pills */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-2xl p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Campaign List
          </button>
          <button
            type="button"
            onClick={() => editing ? setView("studio") : openNew()}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              view === "studio" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Studio
          </button>
        </div>

        {/* Right CTA */}
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span>
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );

  // ─────────────────────────────────────────────────────────
  // METRIC TILES
  // ─────────────────────────────────────────────────────────
  const MetricTiles = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Live Ad Slots",      value: `${activeCount} / ${campaigns.length}`, sub: "Active right now",       icon: "📡", color: "blue"   },
        { label: "Monthly Revenue",    value: `$${estRevenue.toLocaleString()}`,       sub: "Est. at $850/slot/mo",   icon: "💰", color: "emerald"},
        { label: "Total Impressions",  value: totalImpr.toLocaleString(),             sub: "All-time views",         icon: "👁",  color: "purple" },
        { label: "CTA Clicks",         value: totalClicks.toLocaleString(),           sub: "Engagement actions",     icon: "🎯", color: "amber"  },
      ].map(m => {
        const ac = accentClasses[m.color];
        return (
          <div key={m.label} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base ${ac.bg} bg-opacity-10`}>
                {m.icon}
              </span>
            </div>
            <div className={`text-2xl font-black ${ac.text} leading-tight`}>{m.value}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{m.sub}</div>
          </div>
        );
      })}
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // CAMPAIGN LIST VIEW
  // ─────────────────────────────────────────────────────────
  const ListView = () => (
    <div className="space-y-4">
      <MetricTiles />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Configured Campaigns</h2>
            <p className="text-xs text-slate-400 mt-0.5">{campaigns.length} campaigns · click any row to edit</p>
          </div>
          <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {activeCount} Live
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {campaigns.map((camp) => {
            const ch     = MOCK_CHARACTERS.find(c => c.id === camp.characterId);
            const isLive = camp.status === "ACTIVE";
            const sz     = camp.characterSize || "large";
            const mode   = camp.campaignMode;
            const modeMeta = ENCOUNTER_MODES.find(m => m.id === mode);

            return (
              <div
                key={camp.id}
                onClick={() => openEdit(camp)}
                className="group px-6 py-5 hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${ch?.themeColor || "#3b82f6"}22, ${ch?.themeColor || "#3b82f6"}44)` }}
                >
                  {ch?.icon || "🎭"}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-slate-900 text-sm truncate">{camp.advertiserName}</span>

                    {/* Mode badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${accentClasses[modeMeta?.accentColor || "blue"].pill}`}>
                      {modeMeta?.icon} {mode}
                    </span>

                    {/* Size badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${sz === "large" ? accentClasses.amber.pill : sz === "medium" ? accentClasses.blue.pill : accentClasses.slate.pill}`}>
                      {sz === "large" ? "🌟 Hero" : sz === "medium" ? "✨ Standard" : "🔍 Compact"}
                    </span>

                    {/* Flag badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                      🚩 {camp.flagShape || "swallowtail"}
                    </span>

                    {/* Status dot */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${isLive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                      {isLive ? "Live" : "Paused"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate">
                    <span className="font-semibold text-slate-700">Banner:</span> &ldquo;{camp.ctaText}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pages: {camp.assignedPages.join(", ")} · {camp.clicks} clicks
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggle(camp.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all ${
                      isLive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {isLive ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(camp)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-extrabold shadow-sm transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(camp.id)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 flex items-center justify-center transition-all text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STUDIO VIEW  (2-column layout)
  // ─────────────────────────────────────────────────────────
  const StudioView = () => {
    if (!editing) return null;

    // Flag SVG preview colour for each shape
    const flagMeta = FLAG_SHAPES.find(f => f.shape === currentFlag) || FLAG_SHAPES[0];

    // ── RIGHT PANEL (rendered outside the form so it is truly fixed) ──
    const RightPanel = (
      <div className="w-[400px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Live Preview Stage</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying(p => !p)}
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border transition-all ${
              isPlaying
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>

        {/* Scale ruler */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-3 text-[10px] font-extrabold flex-shrink-0">
          {SIZE_TIERS.map(s => (
            <span key={s.size} className={currentSize === s.size ? "text-blue-600" : "text-slate-300"}>
              {s.label} {s.height}px {currentSize === s.size && "← active"}
            </span>
          ))}
        </div>

        {/* Simulation viewport */}
        <div className="mx-5 my-3 flex-shrink-0 h-64 bg-gradient-to-b from-sky-50 to-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden shadow-inner">
          {/* Ground line */}
          <div className="absolute bottom-3 left-0 right-0 h-px bg-slate-200" />
          {/* Character — scaled to always fit, anchored bottom-left */}
          <div className={`absolute bottom-3 left-4 transition-all duration-500 ${isPlaying ? "" : "opacity-70"}`}>
            <div className="scale-[0.58] origin-bottom-left">
              <CharacterSprite
                characterId={editing.characterId || "wheelchair_boy"}
                ctaText={editing.ctaText || "Your Banner Headline"}
                bubbleText={editing.bubbleText}
                themeColor={selectedCharMeta.themeColor}
                flagShape={currentFlag}
                accessory={currentAccessory}
                size={currentSize}
                isHovered={isPlaying}
              />
            </div>
          </div>
        </div>

        {/* Live spec sheet */}
        <div className="px-5 pb-2 flex-shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Configuration</p>
          {[
            { label: "Mascot",       value: `${selectedCharMeta.icon} ${selectedCharMeta.name}`,                                                                    valueClass: "text-slate-900" },
            { label: "Flag Shape",   value: FLAG_SHAPES.find(f => f.shape === currentFlag)?.title || currentFlag,                                                    valueClass: "text-slate-900" },
            { label: "Sponsor Tier", value: (SIZE_TIERS.find(s => s.size === currentSize)?.label || "") + " (" + (SIZE_TIERS.find(s => s.size === currentSize)?.price || "") + ")", valueClass: "text-amber-600" },
            { label: "Outfit",       value: currentAccessory === "none" ? "Standard" : `✓ ${currentAccessory.replace("_", " ")}`,                                   valueClass: "text-purple-600" },
            { label: "Click Route",  value: editing.clickBehavior === "PAGE" ? "/seller/storefront" : editing.clickBehavior || "PAGE",                               valueClass: "text-emerald-700 font-mono text-[10px]" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-[11px] text-slate-400 font-semibold">{row.label}</span>
              <span className={`text-[11px] font-extrabold ${row.valueClass}`}>{row.value}</span>
            </div>
          ))}
        </div>

      </div>
    );

    return (
      <>
        {/* ── LEFT — scrollable form controls ── */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">

            {/* STEP 01 — Flag Shape */}
            <Section step="01" title="Flag Shape & Vector Geometry" hint="The banner shape attached to your mascot">
              <div className="grid grid-cols-4 gap-3">
                {FLAG_SHAPES.map(f => {
                  const isSel = currentFlag === f.shape;
                  return (
                    <button
                      key={f.shape}
                      type="button"
                      onClick={() => setEditing({ ...editing, flagShape: f.shape })}
                      className={`group p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                        isSel
                          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-500/20 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="w-full h-12 flex items-center justify-center mb-2">
                        <svg viewBox="0 0 80 50" className="w-full h-full overflow-visible drop-shadow-sm">
                          <path d={f.svgPath} fill={isSel ? "#2563eb" : "#94a3b8"} className="transition-colors duration-200" />
                          <text x="32" y="30" fontSize="9" fill="white" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">AD</text>
                        </svg>
                      </div>
                      <p className="text-[11px] font-extrabold text-slate-900">{f.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{f.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* STEP 02 — Sponsor Size Tier */}
            <Section step="02" title="Sponsor Size Tier" hint="Determines viewport footprint and pricing level">
              <div className="grid grid-cols-3 gap-3">
                {SIZE_TIERS.map(s => {
                  const isSel = currentSize === s.size;
                  const ac = accentClasses[s.accent];
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setEditing({ ...editing, characterSize: s.size })}
                      className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSel
                          ? `${ac.border} bg-white ring-4 ${ac.ring} shadow-md`
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {isSel && (
                        <span className={`absolute top-3 right-3 w-5 h-5 rounded-full ${ac.bg} flex items-center justify-center`}>
                          <span className="text-[9px] text-white font-black">✓</span>
                        </span>
                      )}
                      <div className="flex items-end gap-1 mb-3 h-14">
                        <div className={`w-8 rounded-t-xl transition-all ${isSel ? ac.bg : "bg-slate-200"}`} style={{ height: `${s.height}px` }} />
                        <div className="text-[10px] font-extrabold text-slate-400 mb-1">~{s.height}px</div>
                      </div>
                      <p className="text-xs font-extrabold text-slate-900">{s.icon} {s.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                      <p className={`text-xs font-black mt-1.5 ${ac.text}`}>{s.price}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* STEP 03 — Character & Outfit */}
            <Section step="03" title="Mascot & Outfit Customizer" hint="Select from 16 animated disability mascots">
              <CharacterLibrary
                selectedCharacterId={(editing.characterId || "wheelchair_boy") as CharacterId}
                onSelectCharacter={(char: CharacterAsset) => {
                  setEditing({
                    ...editing,
                    characterId: char.id,
                    ctaText: `${editing.advertiserName || "Advertiser"} — ${char.defaultBubble}`,
                    bubbleText: char.defaultBubble,
                  });
                }}
                sampleCtaText={editing.ctaText}
                selectedFlagShape={editing.flagShape}
                selectedAccessory={editing.accessory}
                onSelectAccessory={(accessory) => setEditing({ ...editing, accessory })}
              />
            </Section>

            {/* STEP 04 — Copy & Identity */}
            <Section step="04" title="Campaign Copy & Identity" hint="Banner headline, bubble text and advertiser identity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Advertiser Name" value={editing.advertiserName || ""} onChange={v => setEditing({ ...editing, advertiserName: v })} placeholder="e.g. Suraj Mobility Solutions" required />
                <InputField label="Flag Banner CTA Text" value={editing.ctaText || ""} onChange={v => setEditing({ ...editing, ctaText: v })} placeholder="e.g. Suraj Mobility — Fast Delivery!" required />
                <InputField label="Speech Bubble Text" value={editing.bubbleText || ""} onChange={v => setEditing({ ...editing, bubbleText: v })} placeholder="e.g. Find your perfect mobility aid!" />
              </div>
            </Section>

            {/* STEP 05 — Click Destination */}
            <Section step="05" title="Click Destination Action" hint="Where does a visitor go after tapping the mascot?">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "PAGE",  icon: "🏪", title: "Seller Page",  desc: "Opens /seller/[id] storefront", color: "emerald" },
                  { id: "MODAL", icon: "📱", title: "Quick Modal",   desc: "Popup product catalog dialog",  color: "purple" },
                  { id: "URL",   icon: "🔗", title: "External URL",  desc: "Redirect to external website",  color: "blue" },
                ].map(dest => {
                  const isSel = (editing.clickBehavior || "PAGE") === dest.id;
                  const ac = accentClasses[dest.color];
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setEditing({ ...editing, clickBehavior: dest.id as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSel ? `${ac.border} bg-white ring-4 ${ac.ring} shadow-md` : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{dest.icon}</span>
                      <p className="text-xs font-extrabold text-slate-900">{dest.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{dest.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* STEP 06 — Page Targeting */}
            <Section step="06" title="Page Targeting" hint="Which site pages will show this mascot campaign?">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {ALL_PAGES.map(pg => {
                  const isAssigned = (editing.assignedPages || []).includes(pg.slug);
                  return (
                    <button
                      key={pg.slug}
                      type="button"
                      onClick={() => handlePageToggle(pg.slug)}
                      className={`px-4 py-3 rounded-2xl border-2 text-xs font-extrabold text-left flex items-center justify-between transition-all ${
                        isAssigned
                          ? "border-blue-500 bg-blue-600 text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <span>{pg.icon} {pg.label}</span>
                      {isAssigned && <span className="text-white/80 font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Submit bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 pb-8">
              <button type="button" onClick={() => setView("list")} className="px-5 py-2.5 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-2xl text-xs font-extrabold transition-all">
                ← Cancel
              </button>
              <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2">
                <span>🚀</span>
                <span>Deploy Campaign</span>
              </button>
            </div>

          </div>
        </form>

        {/* ── RIGHT — truly fixed, never scrolls ── */}
        {RightPanel}
      </>
    );
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      <Header />

      {/* List view: normal scrolling page */}
      {view === "list" ? (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 space-y-6 pb-32">
            <ListView />
          </div>
        </main>
      ) : (
        /* Studio view — outer shell owns the split; left scrolls, right is truly fixed */
        <div className="flex-1 overflow-hidden flex">
          {StudioView()}
        </div>
      )}

      <CruisingAdEngine
        campaigns={campaigns}
        currentPage="all"
        onCampaignClick={(camp) => openEdit(camp)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────

interface SectionProps {
  step: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}
function Section({ step, title, hint, children }: SectionProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-2xl bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          {step}
        </span>
        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">{title}</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}
function InputField({ label, value, onChange, placeholder, required }: InputFieldProps) {
  return (
    <div>
      <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-blue-600">*</span>}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}
