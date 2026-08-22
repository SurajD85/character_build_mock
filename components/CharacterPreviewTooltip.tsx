"use client";

import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { AdCampaign } from "../types/campaign";
import { MOCK_ADVERTISERS } from "../lib/mockData";

interface CharacterPreviewTooltipProps {
  campaign: AdCampaign;
  isVisible: boolean;
}

export const CharacterPreviewTooltip: React.FC<CharacterPreviewTooltipProps> = ({
  campaign,
  isVisible,
}) => {
  // Physics spring — snappy pop in, fast fade out
  const spring = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 10,
    scale: isVisible ? 1 : 0.92,
    config: isVisible
      ? { tension: 380, friction: 28 }   // bouncy entrance
      : { tension: 260, friction: 20, clamp: true }, // quick fade out
  });

  const advertiser = MOCK_ADVERTISERS.find((a) => a.id === campaign.advertiserId);
  const featuredItem = advertiser?.itemsForSale[0];

  return (
    <animated.div
      className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ ...spring, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.28))" }}
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 p-3 rounded-2xl w-64 shadow-2xl space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-extrabold text-blue-300 truncate">
              {campaign.advertiserName}
            </span>
          </div>
          {advertiser && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>★</span> {advertiser.rating}
            </span>
          )}
        </div>

        {/* Featured item */}
        {featuredItem ? (
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center text-xs font-black flex-shrink-0">
              🏷️
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] font-bold text-slate-200 truncate leading-tight">
                {featuredItem.title}
              </div>
              <div className="text-[11px] font-black text-emerald-400">
                {featuredItem.price}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-300 italic">{campaign.ctaText}</p>
        )}

        {/* Action hint */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-0.5">
          <span>Click to interact</span>
          <span className="text-blue-400 animate-pulse">View Now →</span>
        </div>
      </div>

      {/* Arrow pointer */}
      <div className="w-3 h-3 bg-slate-900/95 border-b border-r border-slate-700/80 rotate-45 mx-auto -mt-1.5" />
    </animated.div>
  );
};
