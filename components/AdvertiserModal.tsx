"use client";

import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { AdCampaign } from "../types/campaign";
import { MOCK_ADVERTISERS, MOCK_CHARACTERS } from "../lib/mockData";

interface AdvertiserModalProps {
  campaign: AdCampaign | null;
  onClose: () => void;
}

export const AdvertiserModal: React.FC<AdvertiserModalProps> = ({ campaign, onClose }) => {
  const isOpen = Boolean(campaign);

  // Backdrop spring: fade in/out
  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 220, friction: 26 },
  });

  // Panel spring: slide up from y:40, spring bounce on open
  const panelSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : 44,
    scale: isOpen ? 1 : 0.95,
    config: isOpen
      ? { tension: 300, friction: 28 }        // springy entrance
      : { tension: 260, friction: 20, clamp: true }, // fast exit clamp
  });

  if (!campaign) return null;

  const advertiser = MOCK_ADVERTISERS.find(a => a.id === campaign.advertiserId) || {
    id: campaign.advertiserId,
    name: campaign.advertiserName,
    logoText: campaign.advertiserName,
    contactEmail: "contact@advertiser.com",
    websiteUrl: campaign.targetUrl,
    rating: 4.9,
    totalListings: 12,
    itemsForSale: [
      {
        id: "item_gen_1",
        title: `${campaign.advertiserName} Featured Accessibility Product`,
        price: "$1,890",
        imageBg: "from-blue-600 to-indigo-700",
        category: "Featured Item",
        badge: "Direct Listing",
        description: "Official product listing from verified advertiser on AbilityClassifieds.",
        specs: ["Verified Business", "Full Warranty", "Nationwide Delivery", "Finance Available"]
      }
    ]
  };

  const partnerAdvertiser = MOCK_ADVERTISERS.find(a => a.name === campaign.partnerAdvertiserName) || MOCK_ADVERTISERS[1];

  const charMeta = MOCK_CHARACTERS.find(c => c.id === campaign.characterId) || MOCK_CHARACTERS[0];
  const partnerCharMeta = MOCK_CHARACTERS.find(c => c.id === campaign.partnerCharacterId) || MOCK_CHARACTERS[1];

  const isCoOpOrConvoy = campaign.campaignMode !== "SOLO";

  return (
    <animated.div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
      style={{
        ...backdropSpring,
        backgroundColor: "rgba(15,23,42,0.75)",
      }}
      onClick={onClose}
    >
      <animated.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 cursor-default relative my-auto"
        style={panelSpring}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-extrabold shadow-lg border-2 border-slate-900 z-10">
                  {charMeta.icon}
                </div>
                {isCoOpOrConvoy && (
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl font-extrabold shadow-lg border-2 border-slate-900 z-20">
                    {partnerCharMeta.icon}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                    isCoOpOrConvoy 
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  }`}>
                    {campaign.campaignMode} Choreography Campaign
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    ★ {advertiser.rating} Rating
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                  {isCoOpOrConvoy ? `${advertiser.name} & ${partnerAdvertiser.name}` : advertiser.name}
                </h2>
                <p className="text-xs text-slate-400">
                  Verified Advertiser Showcase on AbilityClassifieds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={campaign.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Visit Official Website</span>
                <span>↗</span>
              </a>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Dialogue Encounter Summary Banner */}
          {campaign.dialogueScript && (
            <div className="mt-4 p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-xs text-slate-200 space-y-1">
              <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">💬 Live Scripted Character Encounter Dialogue</div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-slate-300">
                <span>{charMeta.icon} <strong>{charMeta.name}:</strong> "{campaign.dialogueScript.char1Line}"</span>
                <span className="hidden sm:inline">➜</span>
                <span>{partnerCharMeta.icon} <strong>{partnerCharMeta.name}:</strong> "{campaign.dialogueScript.char2Line}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Items Showcase Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>🛒</span> Featured Equipment Listings
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Co-Op Partner Catalog
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...advertiser.itemsForSale, ...(isCoOpOrConvoy ? partnerAdvertiser.itemsForSale : [])].map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group">
                
                {/* Visual Image Header */}
                <div className={`h-36 bg-gradient-to-br ${item.imageBg} p-4 text-white flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-2xl font-black">{item.price}</span>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      {item.specs.map((spec, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={campaign.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md text-center transition-all"
                    >
                      Inquire / Buy Item →
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Contact Footer */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <h5 className="text-xs font-black text-slate-900">Direct Partner Business Contact</h5>
                <p className="text-xs text-slate-500">Email: {advertiser.contactEmail}</p>
              </div>
            </div>
            <a
              href={campaign.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
            >
              View Full Co-Op Store →
            </a>
          </div>

        </div>

      </animated.div>
    </animated.div>
  );
};
