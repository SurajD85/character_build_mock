"use client";

import React, { useEffect, useRef, useState } from "react";
import { LivingCharacterSprite, LivingCharacterType, LivingEmotion } from "./LivingCharacterSprite";
import { CanvasConfettiEffect } from "./CanvasConfettiEffect";
import { NativeCruiseController } from "../lib/nativeMotion";
import { AdCampaign } from "../types/campaign";

interface LivingCruisingEngineProps {
  campaigns: AdCampaign[];
  currentPage?: string;
  onCampaignClick: (campaign: AdCampaign) => void;
  speedMultiplier?: number;
}

export const LivingCruisingEngine: React.FC<LivingCruisingEngineProps> = ({
  campaigns,
  currentPage = "home",
  onCampaignClick,
  speedMultiplier = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<NativeCruiseController | null>(null);

  const [emotion, setEmotion] = useState<LivingEmotion>("CRUISING");
  const [isQuiet, setIsQuiet] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [confettiOrigin, setConfettiOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeCampaignIdx, setActiveCampaignIdx] = useState<number>(0);

  // Active campaign
  const activeCampaign = campaigns.length > 0 ? campaigns[activeCampaignIdx % campaigns.length] : null;

  // Track mouse position for character eye gaze
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize Native Web Animations API Cruising
  useEffect(() => {
    if (isQuiet || !containerRef.current) return;

    controllerRef.current = new NativeCruiseController(containerRef.current);
    controllerRef.current.start({
      speed: speedMultiplier,
      onRepeat: () => {
        setEmotion("CRUISING");
        // Cycle to next active campaign on each pass
        if (campaigns.length > 1) {
          setActiveCampaignIdx((prev) => (prev + 1) % campaigns.length);
        }
      },
    });

    return () => {
      if (controllerRef.current) controllerRef.current.stop();
    };
  }, [speedMultiplier, isQuiet, campaigns.length]);

  const handleMouseEnter = () => {
    if (controllerRef.current) {
      controllerRef.current.slowDown(0.15);
    }
    setEmotion("WAVING");
  };

  const handleMouseLeave = () => {
    if (controllerRef.current) {
      controllerRef.current.resume(1.0);
    }
    setEmotion("CRUISING");
  };

  const handleClick = () => {
    if (!activeCampaign) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const clickX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const clickY = rect ? rect.top + 40 : window.innerHeight - 150;

    setConfettiOrigin({ x: clickX, y: clickY });
    setConfettiActive(true);
    setEmotion("CELEBRATING");

    setTimeout(() => {
      onCampaignClick(activeCampaign);
      setEmotion("CRUISING");
    }, 500);
  };

  if (!activeCampaign) return null;

  const characterId = (activeCampaign.characterId as LivingCharacterType) || "wheelchair_hero";
  const bubbleText = activeCampaign.bubbleText || `G'day! ${activeCampaign.advertiserName} has top mobility offers!`;

  return (
    <>
      {/* 60 FPS Native Canvas Confetti Effect */}
      <CanvasConfettiEffect
        active={confettiActive}
        origin={confettiOrigin}
        onComplete={() => setConfettiActive(false)}
      />

      {!isQuiet ? (
        <div
          className="fixed bottom-0 left-0 w-full h-44 pointer-events-none z-40 overflow-hidden"
          style={{ willChange: "transform" }}
        >
          {/* Ground Contact Line */}
          <div className="absolute bottom-4 left-0 w-full h-px bg-slate-300/40" />

          {/* Native Web Animations API Cruising Wrapper */}
          <div
            ref={containerRef}
            className="absolute bottom-2 left-0 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <LivingCharacterSprite
              type={characterId}
              emotion={emotion}
              speed={speedMultiplier}
              themeColor={activeCampaign.wheelColor || "#2563eb"}
              ctaText={activeCampaign.ctaText || "View Products"}
              bubbleText={bubbleText}
              showBubble={true}
              onCharacterClick={handleClick}
              onCtaClick={handleClick}
              mousePos={mousePos}
            />
          </div>
        </div>
      ) : (
        /* Docked Corner Widget when in Quiet Mode */
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div
            onClick={handleClick}
            className="cursor-pointer bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border-2 border-blue-500 flex items-center gap-3 hover:scale-105 transition-all"
          >
            <span className="text-2xl">♿</span>
            <div>
              <p className="text-xs font-black text-slate-900">{activeCampaign.advertiserName}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{activeCampaign.ctaText}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsQuiet(false);
              }}
              className="ml-2 text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </>
  );
};
