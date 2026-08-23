"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { MOCK_ADVERTISERS } from "../../../lib/mockData";
import { CruisingAdEngine } from "../../../components/CruisingAdEngine";
import { AdCampaign } from "../../../types/campaign";

interface SellerPageProps {
  params: Promise<{ id: string }>;
}

export default function SellerStorefrontPage({ params }: SellerPageProps) {
  const resolvedParams = use(params);
  const sellerId = resolvedParams.id;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "", ndisNumber: "" });
  const [selectedItemModal, setSelectedItemModal] = useState<any | null>(null);

  // Find advertiser by ID or name matching
  const advertiser = MOCK_ADVERTISERS.find(
    (a) => a.id.toLowerCase() === sellerId.toLowerCase() ||
           a.name.toLowerCase().replace(/\s+/g, "-") === sellerId.toLowerCase() ||
           sellerId.toLowerCase().includes("suraj") ||
           sellerId.toLowerCase().includes("abc")
  ) || {
    id: sellerId,
    name: "Suraj Mobility Solutions",
    logoText: "Suraj Mobility",
    contactEmail: "contact@surajmobility.com.au",
    websiteUrl: "https://surajmobility.com.au",
    rating: 4.9,
    totalListings: 14,
    itemsForSale: [
      {
        id: "item_hero_1",
        title: "2024 Quantum Edge 3 Stretto Power Chair with iLevel",
        price: "$8,950",
        imageBg: "from-blue-600 via-indigo-600 to-slate-800",
        category: "Power Wheelchairs",
        badge: "NDIS Registered Provider",
        description: "Flagship motorized power wheelchair featuring 12-inch seat elevation at 3.5 mph walking speed, smooth suspension, and LED lighting package.",
        specs: ["12-inch Power Elevation", "Q-Logic 3 Drive Controls", "Up to 18 Miles Battery Range", "Full 3-Year Factory Warranty"]
      },
      {
        id: "item_hero_2",
        title: "Toyota HiAce Welcab Automated Rear-Lift Accessible Van",
        price: "$49,800",
        imageBg: "from-sky-500 via-blue-600 to-indigo-800",
        category: "Accessible Vans",
        badge: "Low Mileage",
        description: "Certified accessible van with remote-controlled heavy-duty wheelchair lift, Q'Straint automatic tie-downs, and passenger swivel seat.",
        specs: ["18,400 km", "Electronic Wheelchair Lift", "Seats 6 + 2 Wheelchairs", "Full NDIS & Roadworthy Certified"]
      },
      {
        id: "item_hero_3",
        title: "Pride Mobility Apex Rapid 4-Wheel Comfort Scooter",
        price: "$2,290",
        imageBg: "from-emerald-500 via-teal-600 to-slate-800",
        category: "Mobility Scooters",
        badge: "Bestseller",
        description: "Ultra-smooth CTS front and rear suspension scooter. Disassembles easily with one hand for quick trunk transport.",
        specs: ["15.5 Mile Range", "CTS Comfort Suspension", "Disassembles in 5 Pieces", "LED Front & Puddle Light"]
      },
      {
        id: "item_hero_4",
        title: "Carbon Ultralight Active Rollator Walker",
        price: "$690",
        imageBg: "from-amber-500 via-orange-600 to-slate-800",
        category: "Daily Living Aids",
        badge: "Carbon Fibre",
        description: "The world's lightest 4-wheel rollator walker at only 4.8 kg. Shock-absorbing carbon frame and soft EVA wheels.",
        specs: ["Only 4.8 kg Total Weight", "Built-in Ergonomic Seat", "Mesh Shopping Bag Included", "Fold & Lock Transport Clip"]
      },
      {
        id: "item_hero_5",
        title: "Bionic Kinetic Grip Myoelectric Prosthetic Hand",
        price: "$14,500",
        imageBg: "from-indigo-600 via-purple-600 to-slate-800",
        category: "Prosthetics & Robotics",
        badge: "High-Tech Innovation",
        description: "Multi-articulating myoelectric prosthetic hand with 14 customizable grip patterns and Bluetooth app calibration.",
        specs: ["14 Multi-Grip Modes", "Water Resistant IP67", "Proportional Muscle Sensor", "Custom Silicone Skin Cover"]
      },
      {
        id: "item_hero_6",
        title: "Sensory Calm & Focus Ergonomic Noise Reduction Headset",
        price: "$340",
        imageBg: "from-purple-600 via-violet-700 to-slate-900",
        category: "Sensory & Neurodiversity",
        badge: "Sensory Friendly",
        description: "Engineered specifically for sensory sensitivity, filtering out harsh frequencies while allowing natural conversation clarity.",
        specs: ["Active Soundwave Filtering", "Memory Foam Ear Cushions", "30-Hour Battery Life", "NDIS Claimable Consumable"]
      }
    ]
  };

  // Build a store-specific cruising ad campaign for this seller
  const sellerStoreCampaign: AdCampaign[] = [
    {
      id: `camp_store_${advertiser.id}`,
      advertiserName: advertiser.name,
      advertiserId: advertiser.id,
      characterId: "wheelchair_boy",
      characterSize: "large",
      campaignMode: "SOLO",
      ctaText: `${advertiser.name} — Verified Retailer`,
      bubbleText: "Welcome to Our Showroom!",
      flagShape: "swallowtail",
      targetUrl: advertiser.websiteUrl,
      clickBehavior: "PAGE",
      assignedPages: ["all"],
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "ACTIVE",
      impressions: 1200,
      clicks: 80,
      createdAt: new Date().toISOString(),
    }
  ];

  const categories = ["all", "Power Wheelchairs", "Accessible Vans", "Mobility Scooters", "Daily Living Aids", "Prosthetics & Robotics", "Sensory & Neurodiversity"];

  const filteredItems = selectedCategory === "all"
    ? advertiser.itemsForSale
    : advertiser.itemsForSale.filter((item) => item.category === selectedCategory);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* --- TOP BRAND HEADER BAR --- */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow-sm"
            >
              <span>←</span>
              <span>Back to Marketplace</span>
            </Link>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <span>/</span>
              <span>Verified Sellers</span>
              <span>/</span>
              <span className="text-white font-bold">{advertiser.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Showroom Open Now
            </span>
            <button
              onClick={() => {
                const el = document.getElementById("inquiry-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>💬 Book Home Demo / Trial</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- SELLER STOREFRONT HERO BANNER --- */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 border-b border-slate-800 pt-12 pb-16 px-6 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            {/* Seller Identity & Verified Badges */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/30 border-2 border-white/20 flex-shrink-0">
                {advertiser.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {advertiser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-black flex items-center gap-1">
                    <span>✓</span> Verified Retailer
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black flex items-center gap-1">
                    <span>★</span> NDIS Registered
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Official certified accessibility partner on AbilityClassifieds. Specializing in high-performance power wheelchairs, custom ramp vans, pediatric mobility solutions, and nationwide home trial service.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-semibold">
                  <span className="flex items-center gap-1 text-amber-400">
                    ★ {advertiser.rating} <span className="text-slate-500">(148 Verified Customer Reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">📍 Sydney, Melbourne & Brisbane Showrooms</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">⚡ Fast &lt; 15 min response time</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap md:flex-col gap-2.5 w-full md:w-auto">
              <a
                href={`mailto:${advertiser.contactEmail}`}
                className="flex-1 md:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold text-center border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>✉️ Email Seller</span>
              </a>
              <a
                href={advertiser.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black text-center shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>🌐 Official Website ↗</span>
              </a>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Classifieds</div>
              <div className="text-xl font-black text-white mt-0.5">{advertiser.itemsForSale.length} Listed Items</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NDIS Compliance</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">100% Registered</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Warranty Included</div>
              <div className="text-xl font-black text-blue-400 mt-0.5">2 - 3 Years Factory</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Home Trials</div>
              <div className="text-xl font-black text-purple-400 mt-0.5">Available On Demand</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- STORE INVENTORY SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
        {/* Category Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>🛍️</span> Current Inventory & Showcase Ads from {advertiser.name}
            </h2>
            <span className="text-xs text-slate-400">
              Showing {filteredItems.length} products
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 scale-105"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "🌐 All Products" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 space-y-4 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Visual Banner */}
                <div className={`h-48 rounded-2xl bg-gradient-to-tr ${item.imageBg} flex flex-col justify-between p-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/20 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-1 bg-blue-500/80 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/20">
                      {item.badge}
                    </span>
                  </div>
                  <div className="z-10 flex items-baseline justify-between">
                    <div className="text-2xl font-black text-white drop-shadow-md">
                      {item.price}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 drop-shadow">NDIS Eligible</span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Specs Chips */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {item.specs.map((spec: string, i: number) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                      <span className="text-blue-400 text-xs">✓</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedItemModal(item)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all text-center"
                >
                  View Full Specs & Quote
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("inquiry-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                  title="Inquire about this item"
                >
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- INQUIRY & HOME DEMO TRIAL SECTION --- */}
        <section id="inquiry-section" className="mt-16 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 rounded-3xl border border-blue-900/50 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-extrabold border border-blue-400/30">
                Direct Seller Inquiry & Home Trial
              </span>
              <h2 className="text-2xl font-black text-white">
                Book a Free Home Demonstration or Request NDIS Quote
              </h2>
              <p className="text-xs text-slate-400">
                Connect directly with {advertiser.name}'s assistive technology specialists. Free trial options available nationwide.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <div className="text-3xl">🎉</div>
                <h3 className="text-lg font-black text-emerald-300">Inquiry Received Successfully!</h3>
                <p className="text-xs text-emerald-200">
                  A representative from <strong>{advertiser.name}</strong> will contact you within 15 minutes to confirm details.
                </p>
                <button
                  onClick={() => setInquirySent(false)}
                  className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+61 400 000 000"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">NDIS Participant Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 430982341"
                    value={inquiryForm.ndisNumber}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, ndisNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Message / Items of Interest *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="I am interested in scheduling a home demonstration for the power wheelchair..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-600/40 transition-all"
                  >
                    Submit Booking Request to {advertiser.name} →
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* --- STOREFRONT FLOATING CHARACTER ENGINE --- */}
      <CruisingAdEngine
        campaigns={sellerStoreCampaign}
        currentPage="all"
        onCampaignClick={() => {
          const el = document.getElementById("inquiry-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* --- QUICK ITEM DETAIL MODAL --- */}
      {selectedItemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-400">{selectedItemModal.category}</span>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <h3 className="text-lg font-black text-white">{selectedItemModal.title}</h3>
            <div className="text-2xl font-black text-emerald-400">{selectedItemModal.price}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedItemModal.description}</p>
            <div className="space-y-1.5 pt-2">
              {selectedItemModal.specs.map((s: string, i: number) => (
                <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> {s}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  setSelectedItemModal(null);
                  const el = document.getElementById("inquiry-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs"
              >
                Inquire About This Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
