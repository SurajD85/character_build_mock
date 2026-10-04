"use client";

import React from "react";
import { AdCampaign } from "../types/campaign";
import { MOCK_ADVERTISERS, MOCK_CHARACTERS } from "../lib/mockData";
import { LivingCharacterSprite } from "./LivingCharacterSprite";

interface AdvertiserModalProps {
  campaign: AdCampaign;
  onClose: () => void;
}

export const AdvertiserModal: React.FC<AdvertiserModalProps> = ({ campaign, onClose }) => {
  const advertiser = MOCK_ADVERTISERS.find((a) => a.id === campaign.advertiserId) || MOCK_ADVERTISERS[0];
  const charMeta = MOCK_CHARACTERS.find((c) => c.id === campaign.characterId) || MOCK_CHARACTERS[0];

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100/80 via-blue-50 to-indigo-100/80 border border-purple-200/80 shadow-md flex items-center justify-center relative shrink-0 overflow-hidden">
            <div className="scale-[0.34] transform-gpu origin-center translate-y-1">
              <LivingCharacterSprite
                type={campaign.characterId as any}
                showBubble={false}
                showCta={false}
                themeColor={charMeta.themeColor || "#8b5cf6"}
                mousePos={{ x: 300, y: 300 }}
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 border border-purple-200/60 px-2.5 py-0.5 rounded-md shadow-xs">
              Verified Partner Dealer
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
              {campaign.advertiserName}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Official NDIS registered provider offering nationwide delivery, home fitting demonstrations, and full warranty coverage.
        </p>

        {advertiser.itemsForSale.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Featured Listing Offer</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-700">{advertiser.itemsForSale[0].title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{advertiser.itemsForSale[0].description}</p>
              </div>
              <span className="text-sm font-black text-slate-900 shrink-0 ml-3">
                {advertiser.itemsForSale[0].price}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-sm"
          >
            Visit Partner Storefront  →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};