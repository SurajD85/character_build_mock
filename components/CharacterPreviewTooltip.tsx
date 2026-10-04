"use client";

import React from "react";
import { AdCampaign } from "../types/campaign";

interface CharacterPreviewTooltipProps {
  campaign: AdCampaign;
}

export const CharacterPreviewTooltip: React.FC<CharacterPreviewTooltipProps> = ({ campaign }) => {
  return (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150">
      <span>{campaign.advertiserName}</span>
      <span className="ml-1.5 opacity-70 font-normal">• Click to interact</span>
    </div>
  );
};
