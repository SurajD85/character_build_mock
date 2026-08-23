"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdCampaign, PageSlug } from "../types/campaign";
import { INITIAL_CAMPAIGNS, MOCK_CHARACTERS } from "../lib/mockData";
import { CruisingAdEngine } from "../components/CruisingAdEngine";
import { AdminCmsPanel } from "../components/AdminCmsPanel";
import { AdvertiserModal } from "../components/AdvertiserModal";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageSlug>("home");
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedModalCampaign, setSelectedModalCampaign] = useState<AdCampaign | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Handle Campaign Clicks from Cruising Engine -> Directly Open Full Seller Storefront Page
  const handleCampaignClick = (campaign: AdCampaign) => {
    // Increment click count in state
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaign.id) {
        return { ...c, clicks: c.clicks + 1 };
      }
      return c;
    }));

    if (campaign.clickBehavior === "URL" && campaign.targetUrl && campaign.targetUrl.startsWith("http")) {
      window.open(campaign.targetUrl, "_blank");
    } else {
      // Direct navigation to dedicated full seller storefront page
      router.push(`/seller/${campaign.advertiserId || "adv_abc_mobility"}`);
    }
  };

  // Save / Update Campaign from Admin Panel
  const handleSaveCampaign = (savedCampaign: AdCampaign) => {
    setCampaigns(prev => {
      const exists = prev.some(c => c.id === savedCampaign.id);
      if (exists) {
        return prev.map(c => c.id === savedCampaign.id ? savedCampaign : c);
      }
      return [savedCampaign, ...prev];
    });
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const activeAdsForCurrentPage = campaigns.filter(c => {
    if (c.status !== "ACTIVE") return false;
    if (c.assignedPages.includes("all")) return true;
    return c.assignedPages.includes(currentPage);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative pb-32 overflow-x-hidden">
      
      {/* --- TOP ADMIN PROMOTIONAL CONTROLLER BAR (CLEAN LIGHT THEME) --- */}
      <div className="bg-white text-slate-800 py-2.5 px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs z-50 relative shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Prototype CMS Live Mode
          </span>
          <span className="text-slate-500 hidden lg:inline font-medium">
            Active Cruising Ads on this page: <strong className="text-slate-900 font-bold">{activeAdsForCurrentPage.length}</strong>
          </span>

          {/* Quick Character Preset Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 hidden sm:inline">Select Character:</span>
            {MOCK_CHARACTERS.map((char) => {
              const isActiveChar = campaigns.some(c => c.status === "ACTIVE" && c.characterId === char.id && (c.assignedPages.includes("all") || c.assignedPages.includes(currentPage)));
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    // Update first active campaign to use this character
                    setCampaigns(prev => prev.map((c, i) => {
                      if (i === 0 || c.assignedPages.includes(currentPage)) {
                        return { ...c, characterId: char.id, ctaText: `${c.advertiserName} — See All Ads`, bubbleText: char.defaultBubble };
                      }
                      return c;
                    }));
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                    isActiveChar
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
                  }`}
                  title={`Switch active character to ${char.name}`}
                >
                  <span>{char.icon}</span>
                  <span className="hidden md:inline">{char.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Size Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 hidden sm:inline">Size:</span>
            {(["large", "medium", "small"] as const).map((sz) => {
              const activeCampaign = campaigns[0];
              const isSelected = (activeCampaign?.characterSize || "large") === sz;
              return (
                <button
                  key={sz}
                  onClick={() => {
                    setCampaigns(prev => prev.map((c, i) => {
                      if (i === 0 || c.assignedPages.includes(currentPage)) {
                        return { ...c, characterSize: sz };
                      }
                      return c;
                    }));
                  }}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all capitalize ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 font-black shadow-sm scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                  title={`Set character size to ${sz}`}
                >
                  {sz === "large" ? "🌟 Large" : sz === "medium" ? "✨ Medium" : "🔍 Small"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>💼 Ad Revenue &amp; CMS Studio</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black">NEW PAGE ↗</span>
          </Link>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR & PAGE SIMULATOR --- */}
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

          {/* PAGE SWITCHER TAB SIMULATOR */}
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200">
            {[
              { slug: "home", label: "🏠 Home", badge: "General" },
              { slug: "wheelchairs", label: "🧑‍🦼 Wheelchairs", badge: "Category" },
              { slug: "vans", label: "🚐 Vans & Vehicles", badge: "Category" },
              { slug: "scooters", label: "🛵 Mobility Scooters", badge: "Category" },
              { slug: "finance", label: "💳 Finance", badge: "Services" },
            ].map((tab) => {
              const isActive = currentPage === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setCurrentPage(tab.slug as PageSlug)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md shadow-slate-200 scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl text-xs font-black text-indigo-700 hover:bg-indigo-50 border border-indigo-200 flex items-center gap-1.5 transition-all"
            >
              <span>⚙️ CMS Studio</span>
              <span className="text-[10px] text-indigo-500 font-bold">↗</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* --- PAGE CONTENT BASED ON CURRENT PAGE SIMULATOR --- */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/15">
              <span>🌟</span> Australia's #1 Mobility Marketplace
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {currentPage === "home" && "Freedom & Independence on Wheels."}
              {currentPage === "wheelchairs" && "Certified Power & Manual Wheelchairs."}
              {currentPage === "vans" && "Wheelchair Accessible Vehicles & Ramp Vans."}
              {currentPage === "scooters" && "All-Terrain & Foldable Mobility Scooters."}
              {currentPage === "finance" && "Accessible Equipment Financing & Grants."}
            </h2>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Explore thousands of verified listing ads from premier advertisers across Australia and New Zealand. Look out for our moving character ad slots cruising at the bottom of the page!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="px-6 py-3.5 bg-white text-blue-800 font-extrabold text-sm rounded-xl hover:bg-blue-50 shadow-xl transition-all">
                Browse Category Listings
              </button>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="px-6 py-3.5 bg-blue-600/80 hover:bg-blue-600 text-white font-extrabold text-sm rounded-xl border border-white/20 transition-all"
              >
                + Post Paid Advertiser Slot
              </button>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </section>

        {/* ACTIVE MOVING CHARACTERS BANNER SUMMARY CARD */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl font-black">
              📢
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Current Cruising Ad Slots on Page ({currentPage.toUpperCase()})</h3>
              <p className="text-xs text-slate-500">
                Below are the active advertiser campaigns assigned to cruise across this page. Click on any moving character or banner flag to test the user flow!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {activeAdsForCurrentPage.map((ad) => {
              const charMeta = MOCK_CHARACTERS.find(c => c.id === ad.characterId);
              return (
                <div 
                  key={ad.id} 
                  onClick={() => router.push(`/seller/${ad.advertiserId || "adv_abc_mobility"}`)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-center gap-2 text-xs font-bold shadow-sm hover:shadow"
                  title={`Open ${ad.advertiserName} Storefront`}
                >
                  <span className="text-lg">{charMeta?.icon || "🎭"}</span>
                  <div>
                    <div className="text-slate-900 leading-tight flex items-center gap-1">
                      <span>{ad.advertiserName}</span>
                      <span className="text-[10px] text-blue-600 font-bold">↗</span>
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold">"{ad.ctaText}"</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DUMMY LISTINGS GRID FOR PAGE CONTENT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Featured Classified Listings</h3>
            <span className="text-xs font-bold text-slate-500">Showing top results for {currentPage}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all">
                <div className="h-44 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl text-slate-300 font-black">
                  📷 Item Image #{item}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                      Verified Seller
                    </span>
                    <span className="text-lg font-black text-slate-900">$4,250</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {currentPage === "vans" && "2021 Toyota HiAce Wheelchair Lift Van"}
                    {currentPage === "wheelchairs" && "Permobil M3 Corpus Power Wheelchair"}
                    {currentPage === "scooters" && "Pride Mobility 4-Wheel Scooter"}
                    {(currentPage === "home" || currentPage === "finance") && "Smart Accessibility Equipment Package"}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Excellent condition, low usage, inspected by certified engineers. Available for immediate delivery.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>📍 Sydney, NSW</span>
                  <span className="font-bold text-blue-600 hover:underline cursor-pointer">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* --- FLOATING CRUISING AD ENGINE (LOTTIE + GSAP RENDERER) --- */}
      <CruisingAdEngine
        campaigns={campaigns}
        currentPage={currentPage}
        onCampaignClick={handleCampaignClick}
      />

      {/* --- ADVERTISER CATALOG SHOWCASE MODAL (FALLBACK) --- */}
      <AdvertiserModal
        campaign={selectedModalCampaign}
        onClose={() => setSelectedModalCampaign(null)}
      />

    </div>
  );
}