"use client";

import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { AdCampaign } from "../types/campaign";
import { MOCK_ADVERTISERS } from "../lib/mockData";

interface CharacterActionMenuProps {
  campaign: AdCampaign;
  isVisible: boolean;
  onViewProducts: () => void;
  onComeBackLater: () => void;
  onShareDeal: () => void;
}

export const CharacterActionMenu: React.FC<CharacterActionMenuProps> = ({
  campaign,
  isVisible,
  onViewProducts,
  onComeBackLater,
  onShareDeal,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Physics spring entrance — replaces CSS @keyframes entirely
  const menuSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 16,
    scale: isVisible ? 1 : 0.88,
    config: { tension: 340, friction: 26, clamp: !isVisible },
  });

  // Auto-dismiss after 7s
  useEffect(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => onComeBackLater(), 7000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, onComeBackLater]);

  const advertiser = MOCK_ADVERTISERS.find((a) => a.id === campaign.advertiserId);
  const featuredItem = advertiser?.itemsForSale[0];

  // Keep rendered (spring handles opacity) so the close animation plays out
  if (!isVisible && menuSpring.opacity.get() === 0) return null;

  return (
    <animated.div
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
      style={{
        ...menuSpring,
        pointerEvents: isVisible ? "auto" : "none",
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.22))",
      }}
    >
      <div className="bg-white/98 backdrop-blur-xl border border-slate-200/80 rounded-2xl w-72 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-violet-600" />

        <div className="p-3.5 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-black text-slate-800 truncate leading-tight">
                  {campaign.advertiserName}
                </p>
                {advertiser && (
                  <p className="text-[9px] text-amber-500 font-bold leading-tight">
                    ★ {advertiser.rating} · {advertiser.totalListings} listings
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onComeBackLater(); }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all text-[10px] font-black flex-shrink-0 ml-1"
            >
              ✕
            </button>
          </div>

          {/* Speech bubble */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-3 py-2">
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              💬 &ldquo;Oh! You noticed me! What would you like to do?&rdquo;
            </p>
          </div>

          {/* Featured item */}
          {featuredItem && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                🏷️
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-700 truncate leading-tight">
                  {featuredItem.title}
                </p>
                <p className="text-[11px] font-black text-emerald-600 leading-tight">
                  {featuredItem.price}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onViewProducts(); }}
              className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <span className="text-sm">🏷️</span>
              <span>See Products &amp; Deals →</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onShareDeal(); }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <span>🔗</span><span>Share Deal</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onComeBackLater(); }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <span>👋</span><span>Maybe Later</span>
              </button>
            </div>
          </div>

          <p className="text-center text-[9px] text-slate-400">
            Auto-closes in 7s · Tap anywhere to dismiss
          </p>
        </div>
      </div>

      {/* Triangle pointer */}
      <div className="w-3 h-3 bg-white border-b border-r border-slate-200/80 rotate-45 mx-auto -mt-1.5"
        style={{ boxShadow: "2px 2px 4px rgba(0,0,0,0.06)" }}
      />
    </animated.div>
  );
};
