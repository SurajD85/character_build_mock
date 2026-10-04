"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdCampaign, PageSlug } from "../types/campaign";
import { INITIAL_CAMPAIGNS, MOCK_CHARACTERS } from "../lib/mockData";
import { LivingCruisingEngine } from "../components/LivingCruisingEngine";
import { AdminCmsPanel } from "../components/AdminCmsPanel";
import { AdvertiserModal } from "../components/AdvertiserModal";
import { LivingCharacterType } from "../components/LivingCharacterSprite";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PageSlug>("home");
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedModalCampaign, setSelectedModalCampaign] = useState<AdCampaign | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Handle Campaign Clicks from Cruising Engine -> Open Showcase Modal
  const handleCampaignClick = (campaign: AdCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, clicks: c.clicks + 1 } : c))
    );

    if (campaign.clickBehavior === "URL" && campaign.targetUrl && campaign.targetUrl.startsWith("http")) {
      window.open(campaign.targetUrl, "_blank");
    } else {
      setSelectedModalCampaign(campaign);
    }
  };

  const handleSaveCampaign = (savedCampaign: AdCampaign) => {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === savedCampaign.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCampaign.id ? savedCampaign : c));
      }
      return [savedCampaign, ...prev];
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" };
        }
        return c;
      })
    );
  };

  const activeAdsForCurrentPage = campaigns.filter((c) => {
    if (c.status !== "ACTIVE") return false;
    if (c.assignedPages.includes("all")) return true;
    return c.assignedPages.includes(currentPage);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative pb-32 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP CONTROLLER BAR */}
      {/* ========================================================================= */}
      <div className="bg-white text-slate-800 py-2.5 px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs z-50 relative shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            100% Living Character Engine (V2)
          </span>
          <span className="text-slate-500 hidden lg:inline font-medium">
            Active Cruising Ads on Page: <strong className="text-slate-900 font-bold">{activeAdsForCurrentPage.length}</strong>
          </span>

          {/* Quick Character Presets */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 overflow-x-auto">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 hidden sm:inline">Active Character:</span>
            {MOCK_CHARACTERS.map((char) => (
              <button
                key={char.id}
                type="button"
                onClick={() => {
                  setCampaigns((prev) =>
                    prev.map((c, i) => (i === 0 ? { ...c, characterId: char.id as any } : c))
                  );
                }}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  (campaigns[0]?.characterId as string) === char.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span>{char.icon}</span>
                <span className="hidden md:inline">{char.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/v2"
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs"
          >
            <span>✨ Full V2 Showcase</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black">PLAYGROUND →</span>
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs"
          >
            <span>Ad Revenue & CMS Studio</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black">ADMIN →</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN MARKETPLACE HEADER & CATEGORY FILTER */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md">
              A
            </div>
            <div>
              <h1 className="text-xl font-black text-blue-800 tracking-tight leading-tight">AbilityClassifieds</h1>
              <p className="text-[11px] text-slate-500 font-semibold">Connecting People. Empowering Independence.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto w-full md:w-auto">
            {(["all", "home", "wheelchairs", "vans", "scooters", "finance"] as PageSlug[]).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition-all whitespace-nowrap ${
                  currentPage === pg
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                {pg === "all" ? "All Pages" : pg}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO CONTENT */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-4">
              Australia's #1 Accessibility Hub
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Empowering Freedom & Mobility Across Australia
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Search verified NDIS-registered wheelchair accessible vans, power wheelchairs, mobility scooters, and clinical support equipment.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg"
              >
                Browse 1,400+ Listings
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition border border-white/20"
              >
                Manage Ad Campaigns
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-4">
              🚐
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Welcab Vans & Slopers</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Explore Toyota HiAce, Alphard, and Ford Transit custom ramp vehicles with certified tie-down systems.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl mb-4">
              ♿
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Ergonomic Wheelchairs</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Ultra-lightweight manual chairs, power tilt-in-space chairs, and pediatric superhero designs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl mb-4">
              🩺
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Clinical OT Assessments</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Connect directly with registered Occupational Therapists and care providers for NDIS funding.
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. NATIVE LIVING CRUISING ENGINE (FLOATING OVER VIEWPORT) */}
      {/* ========================================================================= */}
      <LivingCruisingEngine
        campaigns={activeAdsForCurrentPage}
        currentPage={currentPage}
        onCampaignClick={handleCampaignClick}
        speedMultiplier={speedMultiplier}
      />

      {/* Admin Panel Drawer */}
      {isAdminOpen && (
        <AdminCmsPanel
          campaigns={campaigns}
          onSaveCampaign={handleSaveCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          onToggleStatus={handleToggleStatus}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Advertiser Modal */}
      {selectedModalCampaign && (
        <AdvertiserModal
          campaign={selectedModalCampaign}
          onClose={() => setSelectedModalCampaign(null)}
        />
      )}
    </div>
  );
}
