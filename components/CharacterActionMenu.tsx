"use client";

import React from "react";
import { AdCampaign } from "../types/campaign";

interface CharacterActionMenuProps {
  campaign: AdCampaign;
  onClose: () => void;
  onOpenStorefront: () => void;
}

export const CharacterActionMenu: React.FC<CharacterActionMenuProps> = ({
  campaign,
  onClose,
  onOpenStorefront,
}) => {
  return (
    <div className="absolute -top-36 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-200 text-xs w-60 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
        <span className="font-bold text-slate-900 truncate">{campaign.advertiserName}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 font-bold px-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onOpenStorefront}
          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition flex items-center justify-between"
        >
          <span>Browse Offer</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
