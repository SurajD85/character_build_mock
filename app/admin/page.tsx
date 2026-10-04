"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AdCampaign, CharacterAsset, CharacterId, PageSlug,
} from "../../types/campaign";
import { INITIAL_CAMPAIGNS, MOCK_CHARACTERS } from "../../lib/mockData";
import { CharacterLibrary } from "../../components/CharacterLibrary";
import { DynamicCharacterBuilder } from "../../components/DynamicCharacterBuilder";
import { LivingCruisingEngine } from "../../components/LivingCruisingEngine";

export default function AdminPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [customCharacters, setCustomCharacters] = useState<CharacterAsset[]>([]);
  const [activeTab, setActiveTab] = useState<"CAMPAIGNS" | "CHARACTERS" | "CREATE_CAMPAIGN" | "CREATE_CHARACTER">("CAMPAIGNS");
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);

  const [formAdvertiserName, setFormAdvertiserName] = useState("Freedom Welcab Australia");
  const [formAdvertiserId, setFormAdvertiserId] = useState("adv_abc_mobility");
  const [formCharacterId, setFormCharacterId] = useState<string>("wheelchair_boy");
  const [formCtaText, setFormCtaText] = useState("Click for Details");
  const [formBubbleText, setFormBubbleText] = useState("G'day! Looking for mobility solutions?");
  const [formPages, setFormPages] = useState<PageSlug[]>(["all"]);
  const [formTargetUrl, setFormTargetUrl] = useState("https://freedomwelcab.com.au");

  // Load custom characters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("acm_custom_characters");
    if (saved) {
      try {
        setCustomCharacters(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse custom characters", err);
      }
    }
  }, []);

  const handleSaveCustomCharacter = (newChar: CharacterAsset) => {
    const updated = [newChar, ...customCharacters];
    setCustomCharacters(updated);
    localStorage.setItem("acm_custom_characters", JSON.stringify(updated));
    setActiveTab("CHARACTERS");
  };

  const handleDeleteCustomCharacter = (id: string) => {
    const updated = customCharacters.filter((c) => c.id !== id);
    setCustomCharacters(updated);
    localStorage.setItem("acm_custom_characters", JSON.stringify(updated));
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: AdCampaign = {
      id: editingCampaign ? editingCampaign.id : `camp_${Date.now()}`,
      advertiserName: formAdvertiserName,
      advertiserId: formAdvertiserId,
      characterId: formCharacterId as any,
      ctaText: formCtaText,
      bubbleText: formBubbleText,
      campaignMode: "SOLO",
      targetUrl: formTargetUrl,
      clickBehavior: "MODAL",
      assignedPages: formPages,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "ACTIVE",
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === newCamp.id);
      if (exists) {
        return prev.map((c) => (c.id === newCamp.id ? newCamp : c));
      }
      return [newCamp, ...prev];
    });

    setEditingCampaign(null);
    setActiveTab("CAMPAIGNS");
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" };
        }
        return c;
      })
    );
  };

  const allCharacters = [...MOCK_CHARACTERS, ...customCharacters];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-32">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
            ← Back to Homepage
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-lg font-black text-slate-900">Living Ad Revenue &amp; Dynamic CMS Studio</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-200 text-xs font-bold shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("CAMPAIGNS")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CAMPAIGNS" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Active Campaigns ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CHARACTERS")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CHARACTERS" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Living Character Library ({allCharacters.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CREATE_CHARACTER")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CREATE_CHARACTER" ? "bg-purple-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ✨ Create Dynamic Character
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCampaign(null);
              setActiveTab("CREATE_CAMPAIGN");
            }}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "CREATE_CAMPAIGN" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            + Create Campaign
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "CAMPAIGNS" && (
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center text-3xl">
                    {allCharacters.find((c) => c.id === camp.characterId)?.icon || "♿"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{camp.advertiserName}</h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${camp.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-400"}`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">CTA: "{camp.ctaText}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(camp.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
                  >
                    {camp.status === "ACTIVE" ? "Pause" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "CHARACTERS" && (
          <CharacterLibrary
            customCharacters={customCharacters}
            onDeleteCustomCharacter={handleDeleteCustomCharacter}
            onSelectCharacter={(char) => {
              setFormCharacterId(char.id);
              setFormCtaText(char.defaultCta);
              setFormBubbleText(char.defaultBubble);
              setActiveTab("CREATE_CAMPAIGN");
            }}
          />
        )}

        {activeTab === "CREATE_CHARACTER" && (
          <DynamicCharacterBuilder
            onSaveCharacter={handleSaveCustomCharacter}
            onCancel={() => setActiveTab("CHARACTERS")}
          />
        )}

        {activeTab === "CREATE_CAMPAIGN" && (
          <form onSubmit={handleSaveCampaign} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto text-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">Create / Edit Living Campaign</h3>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Advertiser Business Name</label>
              <input
                type="text"
                value={formAdvertiserName}
                onChange={(e) => setFormAdvertiserName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Character Model</label>
              <select
                value={formCharacterId}
                onChange={(e) => setFormCharacterId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                {allCharacters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name} {c.isCustom ? "(Custom)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Flag Banner CTA Text</label>
              <input
                type="text"
                value={formCtaText}
                onChange={(e) => setFormCtaText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Speech Bubble Dialogue</label>
              <input
                type="text"
                value={formBubbleText}
                onChange={(e) => setFormBubbleText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
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
      </main>

      <LivingCruisingEngine campaigns={campaigns} onCampaignClick={() => {}} />
    </div>
  );
}
