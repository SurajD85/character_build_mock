"use client";

import React, { useState } from "react";
import { AdCampaign, CharacterId } from "../types/campaign";
import { MOCK_CHARACTERS } from "../lib/mockData";
import { CharacterLibrary } from "./CharacterLibrary";
import { LivingCharacterSprite } from "./LivingCharacterSprite";

interface AdminCmsPanelProps {
  campaigns: AdCampaign[];
  onToggleStatus: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onSaveCampaign: (campaign: AdCampaign) => void;
  onClose: () => void;
}

export const AdminCmsPanel: React.FC<AdminCmsPanelProps> = ({
  campaigns,
  onToggleStatus,
  onDeleteCampaign,
  onSaveCampaign,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"CAMPAIGNS" | "CHARACTERS" | "CREATE">("CAMPAIGNS");
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);

  // Form State
  const [formAdvertiserName, setFormAdvertiserName] = useState("Precision Mobility Australia");
  const [formCharacterId, setFormCharacterId] = useState<CharacterId>("target_aim_hero");
  const [formCtaText, setFormCtaText] = useState("Precision Target Range");
  const [formBubbleText, setFormBubbleText] = useState("🎯 Hit your mobility goals with 100% precision!");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: AdCampaign = {
      id: `camp_${Date.now()}`,
      advertiserName: formAdvertiserName,
      advertiserId: "adv_abc_mobility",
      characterId: formCharacterId,
      ctaText: formCtaText,
      bubbleText: formBubbleText,
      flagShape: "ribbon",
      wheelColor: "#8b5cf6",
      characterSize: "large",
      campaignMode: "SOLO",
      targetUrl: "/seller/adv_abc_mobility",
      clickBehavior: "MODAL",
      assignedPages: ["all"],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "ACTIVE",
      impressions: 1,
      clicks: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    onSaveCampaign(newCamp);
    setActiveTab("CAMPAIGNS");
  };

  const handleSelectCharacterForCampaign = (char: typeof MOCK_CHARACTERS[0]) => {
    setFormCharacterId(char.id as CharacterId);
    setFormCtaText(char.defaultCta);
    setFormBubbleText(char.defaultBubble);
    setActiveTab("CREATE");
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Living Ad Engine & Revenue CMS Studio
            </h2>
            <p className="text-xs text-slate-500">Configure Living Characters, Campaign Cadence & Dealer Storefronts</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("CAMPAIGNS")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CAMPAIGNS"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Active Campaigns ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CHARACTERS")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CHARACTERS"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Living Character Library ({MOCK_CHARACTERS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCampaign(null);
              setActiveTab("CREATE");
            }}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CREATE"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            + Create New Campaign
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "CAMPAIGNS" && (
            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100/80 via-blue-50 to-indigo-100/80 rounded-xl border border-purple-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                      <div className="scale-[0.3] transform-gpu origin-center translate-y-1">
                        <LivingCharacterSprite
                          type={camp.characterId}
                          showBubble={false}
                          showCta={false}
                          mousePos={{ x: 300, y: 300 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{camp.advertiserName}</h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${
                            camp.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        >
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">CTA: "{camp.ctaText}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(camp.id)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
                    >
                      {camp.status === "ACTIVE" ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "CHARACTERS" && (
            <CharacterLibrary onSelectCharacter={handleSelectCharacterForCampaign} />
          )}

          {activeTab === "CREATE" && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-sm font-black text-slate-900">Configure Living Ad Campaign</h3>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Advertiser Name</label>
                <input
                  type="text"
                  value={formAdvertiserName}
                  onChange={(e) => setFormAdvertiserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Character Model</label>
                <select
                  value={formCharacterId}
                  onChange={(e) => setFormCharacterId(e.target.value as CharacterId)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  {MOCK_CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Flag Banner CTA Copy</label>
                <input
                  type="text"
                  value={formCtaText}
                  onChange={(e) => setFormCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Speech Bubble Dialogue</label>
                <input
                  type="text"
                  value={formBubbleText}
                  onChange={(e) => setFormBubbleText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("CAMPAIGNS")}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};