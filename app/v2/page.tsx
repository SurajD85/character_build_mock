"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LivingCharacterSprite, LivingCharacterType, LivingEmotion } from "../../components/LivingCharacterSprite";
import { CanvasConfettiEffect } from "../../components/CanvasConfettiEffect";
import { NativeCruiseController } from "../../lib/nativeMotion";

const CHARACTERS: { id: LivingCharacterType; name: string; icon: string; defaultBubble: string; cta: string }[] = [
  {
    id: "wheelchair_hero",
    name: "Max Hero",
    icon: "♿",
    defaultBubble: "G'day! Looking for wheelchair vans or mobility aids?",
    cta: "Freedom Welcab Vans",
  },
  {
    id: "accessible_van",
    name: "Welcab Van",
    icon: "🚐",
    defaultBubble: "Certified Welcab Vans with electric ramps in stock!",
    cta: "View 24+ Vans",
  },
  {
    id: "mobility_scooter",
    name: "Apex Scooter",
    icon: "🛵",
    defaultBubble: "All-terrain 4-wheel scooters with 25 km range!",
    cta: "Explore Scooters",
  },
  {
    id: "care_nurse",
    name: "Nurse Sarah",
    icon: "🩺",
    defaultBubble: "Our care team recommends certified NDIS mobility equipment!",
    cta: "Home Care Aids",
  },
  {
    id: "doctor_specialist",
    name: "Dr. Harrison",
    icon: "👨‍⚕️",
    defaultBubble: "Approved NDIS assessments & OT equipment prescriptions!",
    cta: "Clinical Solutions",
  },
  {
    id: "guide_dog_duo",
    name: "Maya & Guide Dog",
    icon: "🦮",
    defaultBubble: "Empowering independence with sensory & guide equipment!",
    cta: "Vision & Sensory",
  },
  {
    id: "prosthetic_athlete",
    name: "Blade Runner",
    icon: "🏃",
    defaultBubble: "Push your limits with carbon-fiber running blades & sports chairs!",
    cta: "Sports Mobility",
  },
];

const DEMO_LISTINGS = [
  {
    id: "ad_1",
    title: "2023 Toyota HiAce Welcab Wheelchair Ramp Van",
    price: "$58,990",
    badge: "Verified Dealer",
    location: "Sydney, NSW",
    specs: ["Rear Electric Ramp", "Auto Tie-Downs", "Low 18,500 km"],
    seller: "Freedom Welcab Australia",
  },
  {
    id: "ad_2",
    title: "ErgoLite 2 Ultra-Lightweight Folding Wheelchair",
    price: "$1,150",
    badge: "Top Rated",
    location: "Melbourne, VIC",
    specs: ["Only 8.7 kg", "Aircraft Grade Alloy", "Fold-Down Backrest"],
    seller: "Mobility Direct VIC",
  },
  {
    id: "ad_3",
    title: "Pride Apex Rapid 4-Wheel Electric Travel Scooter",
    price: "$2,450",
    badge: "Popular",
    location: "Brisbane, QLD",
    specs: ["All-Round Suspension", "25 km Range", "LED Front Light"],
    seller: "Queensland Mobility Care",
  },
  {
    id: "ad_4",
    title: "Stairlift Platinum Horizon Curved Track Rail",
    price: "$4,800",
    badge: "Installed",
    location: "Perth, WA",
    specs: ["Custom Rail Fit", "Twin Remote Controls", "Safety Sensors"],
    seller: "Stairlift Pro WA",
  },
];

export default function V2ShowcasePage() {
  const [characterType, setCharacterType] = useState<LivingCharacterType>("wheelchair_hero");
  const [versionMode, setVersionMode] = useState<"V2" | "V1">("V2");
  const [emotion, setEmotion] = useState<LivingEmotion>("CRUISING");
  const [speed, setSpeed] = useState<number>(1.0);
  const [bubbleText, setBubbleText] = useState<string>(CHARACTERS[0].defaultBubble);
  const [ctaText, setCtaText] = useState<string>(CHARACTERS[0].cta);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isQuietMode, setIsQuietMode] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [confettiOrigin, setConfettiOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [underlyingClicks, setUnderlyingClicks] = useState<number>(0);
  const [lastClickedItem, setLastClickedItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cruiserRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<NativeCruiseController | null>(null);

  const handleSelectCharacter = (c: typeof CHARACTERS[number]) => {
    setCharacterType(c.id);
    setBubbleText(c.defaultBubble);
    setCtaText(c.cta);
    setEmotion("CRUISING");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Native Web Animations API Loop (Zero GSAP)
  useEffect(() => {
    if (isQuietMode || !cruiserRef.current) return;

    controllerRef.current = new NativeCruiseController(cruiserRef.current);
    controllerRef.current.start({
      speed: speed,
      onRepeat: () => setEmotion("CRUISING"),
    });

    return () => {
      if (controllerRef.current) controllerRef.current.stop();
    };
  }, [speed, isQuietMode, characterType]);

  const handleCharacterHoverStart = () => {
    if (controllerRef.current) controllerRef.current.slowDown(0.15);
    setEmotion("WAVING");
    setBubbleText("👋 Hello there! Need help finding the right mobility equipment?");
    setShowBubble(true);
  };

  const handleCharacterHoverEnd = () => {
    if (controllerRef.current) controllerRef.current.resume(1.0);
    setEmotion("CRUISING");
    const activeChar = CHARACTERS.find((c) => c.id === characterType);
    setBubbleText(activeChar ? activeChar.defaultBubble : "Find your mobility solution on AbilityClassifieds!");
  };

  const handleCharacterClick = () => {
    const rect = cruiserRef.current?.getBoundingClientRect();
    const clickX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const clickY = rect ? rect.top + 50 : window.innerHeight - 120;

    setConfettiOrigin({ x: clickX, y: clickY });
    setConfettiActive(true);
    setEmotion("CELEBRATING");
    setBubbleText("🎉 Awesome choice! Opening dealer showcase...");

    setTimeout(() => {
      setIsModalOpen(true);
      setEmotion("CRUISING");
    }, 600);
  };

  const triggerWave = () => {
    setEmotion("WAVING");
    setBubbleText("👋 Warm greetings from our accessibility team!");
    setShowBubble(true);
    setTimeout(() => setEmotion("CRUISING"), 3500);
  };

  const triggerCelebrate = () => {
    const rect = cruiserRef.current?.getBoundingClientRect();
    setConfettiOrigin({
      x: rect ? rect.left + 100 : window.innerWidth / 2,
      y: rect ? rect.top + 40 : window.innerHeight - 150,
    });
    setConfettiActive(true);
    setEmotion("CELEBRATING");
    setBubbleText("⭐ Verified NDIS Partner Dealer!");
    setTimeout(() => setEmotion("CRUISING"), 3500);
  };

  const triggerDialogue = () => {
    setEmotion("TALKING");
    setBubbleText("💬 AbilityClassifieds connects buyers directly with certified dealers across Australia!");
    setShowBubble(true);
    setTimeout(() => setEmotion("CRUISING"), 4500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans relative pb-36 overflow-x-hidden">
      <CanvasConfettiEffect
        active={confettiActive}
        origin={confettiOrigin}
        onComplete={() => setConfettiActive(false)}
      />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition flex items-center gap-1.5"
              >
                ← Back to Home
              </Link>
              <div className="h-4 w-px bg-slate-200" />
              <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                100% Living Character Engine (V2 - Zero License)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Speed:</span>
              {[0.5, 1.0, 1.8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-md font-bold text-xs transition ${
                    speed === s
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={triggerWave}
                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold transition"
              >
                👋 Wave
              </button>
              <button
                type="button"
                onClick={triggerCelebrate}
                className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold transition"
              >
                🎉 Confetti
              </button>
              <button
                type="button"
                onClick={triggerDialogue}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition"
              >
                💬 Talk
              </button>
              <button
                type="button"
                onClick={() => setIsQuietMode(!isQuietMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  isQuietMode
                    ? "bg-rose-50 text-rose-700 border-rose-300"
                    : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {isQuietMode ? "🔔 Exit Quiet" : "🔕 Quiet Mode"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase mr-1 shrink-0">Characters:</span>
            {CHARACTERS.map((c) => {
              const isSelected = characterType === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCharacter(c)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm scale-102"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-200 border-slate-200"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        <div className="mb-8 p-4 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent border-l-4 border-emerald-500 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Hitbox Safety &amp; Click-Through Guarantee
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              The floating character cruises above these cards. Click any card button below while the character passes over to prove clicks are <strong>never hijacked</strong>.
            </p>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Underlying Clicks Recorded: </span>
            <strong className="text-emerald-600 text-sm font-black">{underlyingClicks}</strong>
            {lastClickedItem && (
              <span className="ml-2 text-slate-400 text-[11px]">({lastClickedItem})</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {DEMO_LISTINGS.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                    {listing.badge}
                  </span>
                  <span className="text-slate-400">{listing.location}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                  {listing.title}
                </h4>
                <p className="text-xl font-black text-blue-600 mb-3">{listing.price}</p>
                <ul className="text-xs text-slate-500 space-y-1 mb-4">
                  {listing.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnderlyingClicks((c) => c + 1);
                    setLastClickedItem(`Enquire: ${listing.title.slice(0, 18)}...`);
                  }}
                  className="flex-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition text-center"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {!isQuietMode ? (
        <div
          className="fixed bottom-0 left-0 w-full h-44 pointer-events-none z-40 overflow-hidden"
          style={{ willChange: "transform" }}
        >
          <div className="absolute bottom-4 left-0 w-full h-px bg-slate-300/40" />
          <div
            ref={cruiserRef}
            className="absolute bottom-2 left-0 pointer-events-auto"
            onMouseEnter={handleCharacterHoverStart}
            onMouseLeave={handleCharacterHoverEnd}
          >
            <LivingCharacterSprite
              type={characterType}
              emotion={emotion}
              speed={speed}
              themeColor="#2563eb"
              ctaText={ctaText}
              bubbleText={showBubble ? bubbleText : undefined}
              showBubble={showBubble}
              onCharacterClick={handleCharacterClick}
              onCtaClick={handleCharacterClick}
              mousePos={mousePos}
            />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border-2 border-blue-500 flex items-center gap-3">
            <span className="text-2xl">♿</span>
            <div>
              <p className="text-xs font-black text-slate-900">Featured Partner Docked</p>
              <p className="text-[10px] text-slate-500">Quiet mode active</p>
            </div>
            <button
              type="button"
              onClick={() => setIsQuietMode(false)}
              className="ml-2 text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-2">Partner Showcase</h3>
            <p className="text-xs text-slate-600 mb-6">Certified NDIS partner dealer offering Australia-wide delivery.</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Close Showcase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
