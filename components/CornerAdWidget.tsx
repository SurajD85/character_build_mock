"use client";

import React, { useState } from "react";
import { AdCampaign } from "../types/campaign";
import { MOCK_CHARACTERS } from "../lib/mockData";

interface CornerAdWidgetProps {
  campaign: AdCampaign;
  onCampaignClick: (campaign: AdCampaign) => void;
  isQuietMode?: boolean;
  onDismiss?: () => void;
}

export const CornerAdWidget: React.FC<CornerAdWidgetProps> = ({
  campaign,
  onCampaignClick,
  isQuietMode = false,
  onDismiss,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const charMeta = MOCK_CHARACTERS.find((c) => c.id === campaign.characterId) || MOCK_CHARACTERS[0];
  const themeColor = charMeta.themeColor || "#2563eb";

  if (isMinimized) {
    return (
      <div className="fixed bottom-16 right-4 z-[65] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          style={{ borderColor: themeColor }}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 hover:scale-105 transition-all text-left"
        >
          <span className="text-xl">{charMeta.icon}</span>
          <div className="hidden sm:block">
            <p className="text-[11px] font-black text-slate-800 leading-tight">{campaign.advertiserName}</p>
            <p className="text-[9px] font-bold text-slate-400">Featured Partner</p>
          </div>
          <span className="w-2 h-2 rounded-full" style={{ background: themeColor }} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 right-4 z-[65] pointer-events-auto max-w-xs sm:max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
      <div
        className="relative bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border-2 transition-all overflow-hidden"
        style={{ borderColor: `${themeColor}60` }}
      >
        {/* Color accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: themeColor }} />

        {/* Top bar controls */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {isQuietMode ? "⏸ Quiet Partner" : "Featured Partner"}
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
              style={{ background: themeColor }}
            >
              {charMeta.badge}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Minimize widget"
              className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs font-bold transition-colors"
            >
              –
            </button>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                title="Dismiss"
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content row */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-white shadow-md"
            style={{ background: `${themeColor}20` }}
          >
            {charMeta.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-900 leading-snug truncate">
              {campaign.advertiserName}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 line-clamp-2 mt-0.5">
              {campaign.ctaText}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCampaignClick(campaign)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-black text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 hover:opacity-95"
            style={{ background: themeColor }}
          >
            <span>Explore Storefront</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
