"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { AdCampaign, PageSlug } from "../types/campaign";
import { CharacterSprite } from "./CharacterSprite";
import { CharacterPreviewTooltip } from "./CharacterPreviewTooltip";
import { CharacterActionMenu } from "./CharacterActionMenu";
import { MOCK_CHARACTERS } from "../lib/mockData";
import {
  findSceneClip,
  pickRandom,
  EMOTION_BUBBLES,
  CROWD_LINES,
  type EmotionState,
} from "../lib/sceneClips";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CruisingAdEngineProps {
  campaigns: AdCampaign[];
  currentPage: PageSlug;
  onCampaignClick: (campaign: AdCampaign) => void;
  speedMultiplier?: number;
}

export const CruisingAdEngine: React.FC<CruisingAdEngineProps> = ({
  campaigns,
  currentPage,
  onCampaignClick,
  speedMultiplier = 1,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Which campaign currently has the click-to-interact action menu open
  const [actionMenuCampaignId, setActionMenuCampaignId] = useState<string | null>(null);

  // Which campaign is being hovered (for preview tooltip)
  const [hoveredCampaignId, setHoveredCampaignId] = useState<string | null>(null);

  // Per-campaign bubble text driven by scene clips / emotion states
  const [activeDialogues, setActiveDialogues] = useState<{
    [campaignId: string]: { char1?: string; char2?: string };
  }>({});

  // Per-campaign emotion state (drives GSAP physical reactions)
  const [emotionStates, setEmotionStates] = useState<{
    [campaignId: string]: EmotionState;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const adRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // Inner wrapper refs — Draggable applies here (y+rotation only), isolating from outer x timeline
  const innerAdRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timelinesRef = useRef<{ [key: string]: gsap.core.Timeline | gsap.core.Tween }>({});
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emotionCleanupRefs = useRef<{ [key: string]: ReturnType<typeof setTimeout> | null }>({});
  const quickTiltRefs = useRef<{ [key: string]: gsap.QuickToFunc }>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Active campaigns for this page
  const activeCampaigns = campaigns.filter((c) => {
    if (c.status !== "ACTIVE") return false;
    if (c.assignedPages.includes("all")) return true;
    return c.assignedPages.includes(currentPage);
  });

  // Stable string key to prevent infinite re-render loops while properly updating when campaigns change
  const activeCampaignKey = activeCampaigns
    .map(
      (c) =>
        `${c.id}_${c.characterId}_${c.partnerCharacterId || ""}_${c.campaignMode}_${c.status}_${c.characterSize || "large"}_${c.ctaText}_${c.bubbleText || ""}_${c.mergedBannerText || ""}_${speedMultiplier}`
    )
    .join(",");
  const isCrowded = activeCampaigns.length >= 2;

  // ============================================================
  // EMOTION STATE MACHINE — GSAP physical reactions on INNER wrapper
  // ============================================================
  const triggerEmotion = useCallback(
    (campaignId: string, emotion: EmotionState, bubbleOverride?: string) => {
      const innerEl = innerAdRefs.current[`${campaignId}_primary`];
      if (!innerEl) return;

      // Clear any previous emotion cleanup timer
      if (emotionCleanupRefs.current[campaignId]) {
        clearTimeout(emotionCleanupRefs.current[campaignId]!);
      }

      setEmotionStates((prev) => ({ ...prev, [campaignId]: emotion }));

      // Set emotion-appropriate bubble text
      const bubblePool = EMOTION_BUBBLES[emotion];
      const bubble = bubbleOverride || (bubblePool && bubblePool.length > 0 ? pickRandom(bubblePool) : null);
      if (bubble) {
        setActiveDialogues((prev) => ({
          ...prev,
          [campaignId]: { ...prev[campaignId], char1: bubble },
        }));
      }

      // GSAP physical effect per emotion — applied ONLY to innerEl so outer path timeline is NEVER killed
      switch (emotion) {
        case "STARTLED":
          gsap.killTweensOf(innerEl, "x,rotation");
          gsap.to(innerEl, {
            x: "+=8",
            rotation: 5,
            duration: 0.08,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(innerEl, { x: 0, rotation: 0, duration: 0.3 });
            },
          });
          break;

        case "IMPATIENT":
          gsap.killTweensOf(innerEl, "y");
          gsap.to(innerEl, {
            y: "-=8",
            duration: 0.3,
            yoyo: true,
            repeat: 5,
            ease: "sine.inOut",
            onComplete: () => {
              gsap.to(innerEl, { y: 0, duration: 0.3 });
            },
          });
          break;

        case "EXCITED":
          gsap.killTweensOf(innerEl, "scale");
          gsap.to(innerEl, {
            scale: 1.1,
            duration: 0.18,
            yoyo: true,
            repeat: 3,
            ease: "back.out(2)",
            onComplete: () => {
              gsap.to(innerEl, { scale: 1, duration: 0.3 });
            },
          });
          break;

        case "DISAPPOINTED":
          gsap.to(innerEl, {
            y: 8,
            opacity: 0.7,
            duration: 0.4,
            ease: "power2.out",
          });
          break;

        case "IDLE":
          gsap.to(innerEl, { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, duration: 0.3 });
          break;
      }

      // Auto-revert to IDLE after a moment (except DISAPPOINTED which needs longer)
      const duration = emotion === "DISAPPOINTED" ? 3500 : 2500;
      emotionCleanupRefs.current[campaignId] = setTimeout(() => {
        setEmotionStates((prev) => ({ ...prev, [campaignId]: "IDLE" }));
        gsap.to(innerEl, { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, duration: 0.4 });
        // Clear emotion bubble text
        setActiveDialogues((prev) => ({ ...prev, [campaignId]: { ...prev[campaignId], char1: undefined } }));
      }, duration);
    },
    [] // stable ref — no deps needed since we only touch refs and state setters
  );

  // ============================================================
  // CURSOR TILT — quickTo for 60fps tilt without React re-renders
  // ============================================================
  useEffect(() => {
    if (!isMounted) return;

    // Build quickTo functions for rotation on each active character
    const buildQuickTilts = () => {
      activeCampaigns.forEach((c) => {
        const el = innerAdRefs.current[`${c.id}_primary`];
        if (el) {
          quickTiltRefs.current[`${c.id}_primary`] = gsap.quickTo(el, "rotation", {
            duration: 0.55,
            ease: "power2.out",
          });
        }
        const elP = innerAdRefs.current[`${c.id}_partner`];
        if (elP) {
          quickTiltRefs.current[`${c.id}_partner`] = gsap.quickTo(elP, "rotation", {
            duration: 0.7,
            ease: "power2.out",
          });
        }
      });
    };

    buildQuickTilts();
    // Rebuild after a short delay to ensure refs are populated
    const buildTimer = setTimeout(buildQuickTilts, 500);

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const normalizedX = (e.clientX - cx) / cx; // -1 to +1
      // Map to ±5 degrees — subtle enough to feel natural
      const tilt = normalizedX * 5;
      Object.values(quickTiltRefs.current).forEach((quickTilt) => {
        if (typeof quickTilt === "function") {
          quickTilt(tilt);
        }
      });
    };

    // Reset tilt on mouse leave
    const handleMouseLeave = () => {
      Object.values(quickTiltRefs.current).forEach((quickTilt) => {
        if (typeof quickTilt === "function") {
          quickTilt(0);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(buildTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMounted, activeCampaignKey]);

  // ============================================================
  // SCROLL SPEED BOOST — ScrollTrigger drives timeline timeScale
  // ============================================================
  useEffect(() => {
    if (!isMounted) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()); // px/sec
        const boost = Math.min(1 + velocity / 1800, 3.5);
        if (masterTlRef.current && !masterTlRef.current.paused() && !actionMenuCampaignId && !hoveredCampaignId) {
          gsap.to(masterTlRef.current, { timeScale: boost, duration: 0.25, ease: "power1.out" });
          gsap.to(masterTlRef.current, {
            timeScale: 1,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.3,
          });
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [isMounted, activeCampaignKey, actionMenuCampaignId, hoveredCampaignId]);

  // ============================================================
  // DRAGGABLE — inner wrappers get vertical drag + rotation
  // ============================================================
  useEffect(() => {
    if (!isMounted) return;

    gsap.registerPlugin(Draggable);

    const draggables: Draggable[] = [];

    const setupTimer = setTimeout(() => {
      Object.entries(innerAdRefs.current).forEach(([key, el]) => {
        if (!el) return;

        const d = Draggable.create(el, {
          type: "y",
          bounds: { minY: -120, maxY: 60 },
          edgeResistance: 0.65,
          inertia: false,
          cursor: "grab",
          activeCursor: "grabbing",
          dragClickables: false,
          onDragStart() {
            gsap.to(el, { scale: 1.06, duration: 0.15, ease: "power2.out" });
          },
          onDrag() {
            const tilt = Math.max(-25, Math.min(25, this.y * 0.28));
            gsap.set(el, { rotation: tilt });
          },
          onDragEnd() {
            gsap.to(el, {
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.45)",
            });
          },
        })[0];

        draggables.push(d);
      });
    }, 800);

    return () => {
      clearTimeout(setupTimer);
      draggables.forEach((d) => d && d.kill());
    };
  }, [isMounted, activeCampaignKey]);

  // ============================================================
  // MAIN GSAP MASTER SEQUENTIAL CRUISING ENGINE
  // ============================================================
  useEffect(() => {
    if (!isMounted || activeCampaigns.length === 0) return;

    // Clean up existing master timeline
    if (masterTlRef.current) {
      masterTlRef.current.kill();
      masterTlRef.current = null;
    }
    Object.values(timelinesRef.current).forEach((tl) => tl?.kill());
    timelinesRef.current = {};

    gsap.registerPlugin(MotionPathPlugin, CustomEase);
    const EASE_SUSPENSION = CustomEase.create(
      "suspension",
      "M0,0 C0.08,0 0.1,1 0.22,1 0.38,1 0.52,0.92 0.62,1 0.78,1 0.9,0.97 1,1"
    );
    const EASE_TURBO_BOOST = CustomEase.create(
      "turboBoost",
      "M0,0 C0,0 0.18,0.08 0.36,0.62 0.56,1.18 0.72,0.95 1,1"
    );

    const ctx = gsap.context(() => {
      // 1. Immediately hide and place ALL characters completely off-screen left
      activeCampaigns.forEach((c) => {
        const pEl = adRefs.current[`${c.id}_primary`];
        const partEl = adRefs.current[`${c.id}_partner`];
        if (pEl) {
          gsap.set(pEl, { x: -900, y: 0, opacity: 0, visibility: "hidden" });
        }
        if (partEl) {
          gsap.set(partEl, { x: -1250, y: 0, opacity: 0, visibility: "hidden" });
        }
      });

      // 2. Build one unified master continuous sequential timeline
      const masterTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2.0,
      });
      masterTlRef.current = masterTl;

      const clearDialogue = (cId: string) => {
        setActiveDialogues((prev) => ({ ...prev, [cId]: {} }));
        setEmotionStates((prev) => ({ ...prev, [cId]: "IDLE" }));
      };

      const addDialoguePhases = (
        tl: gsap.core.Timeline,
        cId: string,
        lines: { speaker: 1 | 2; text: string; durationMs: number }[]
      ) => {
        lines.forEach((line, lineIdx) => {
          tl.to({}, {
            duration: line.durationMs / 1000,
            onStart: () => {
              const prevLines = lines.slice(0, lineIdx + 1);
              const char1Text = [...prevLines].reverse().find((l) => l.speaker === 1)?.text;
              const char2Text = [...prevLines].reverse().find((l) => l.speaker === 2)?.text;
              setActiveDialogues((prev) => ({
                ...prev,
                [cId]: { char1: char1Text, char2: char2Text },
              }));
              setEmotionStates((prev) => ({ ...prev, [cId]: "TALKING" }));
            },
          });
        });
      };

      activeCampaigns.forEach((campaign) => {
        const primaryEl = adRefs.current[`${campaign.id}_primary`];
        const partnerEl = adRefs.current[`${campaign.id}_partner`];
        const innerPrimaryEl = innerAdRefs.current[`${campaign.id}_primary`];
        if (!primaryEl) return;

        const charMeta = MOCK_CHARACTERS.find((ch) => ch.id === campaign.characterId);
        const charSpeed = Math.max(0.35, (charMeta?.speedMultiplier || 1) * speedMultiplier);
        const w = typeof window !== "undefined" ? window.innerWidth : 1440;

        const campTl = gsap.timeline({
          onStart: () => {
            clearDialogue(campaign.id);
            gsap.set(primaryEl, { visibility: "visible", opacity: 1 });
            if (partnerEl) gsap.set(partnerEl, { visibility: "visible", opacity: 1 });
          },
          onComplete: () => {
            clearDialogue(campaign.id);
            gsap.set(primaryEl, { x: -900, visibility: "hidden", opacity: 0 });
            if (partnerEl) gsap.set(partnerEl, { x: -1250, visibility: "hidden", opacity: 0 });
          },
        });

        // ----------------------------------------------------
        // 1. CO_OP MODE
        // ----------------------------------------------------
        if (campaign.campaignMode === "CO_OP" && partnerEl) {
          const clip = findSceneClip(campaign.characterId, campaign.partnerCharacterId!, currentPage);
          const lines = clip?.lines || (campaign.dialogueScript
            ? [
                { speaker: 1 as const, text: campaign.dialogueScript.char1Line, durationMs: 2200 },
                { speaker: 2 as const, text: campaign.dialogueScript.char2Line, durationMs: 2200 },
              ]
            : []);

          campTl.set(primaryEl, { x: -650, y: 0, visibility: "visible", opacity: 1 });
          campTl.set(partnerEl, { x: -1000, y: 0, visibility: "visible", opacity: 1 });

          // Smooth curved road cruise in from offscreen left
          campTl.to(primaryEl, {
            motionPath: {
              path: [
                { x: -650, y: 0 },
                { x: w * 0.18, y: -12 },
                { x: w * 0.44, y: 0 },
              ],
              curviness: 1.3,
              autoRotate: false,
            },
            duration: 6.5 / charSpeed,
            ease: EASE_SUSPENSION,
          });
          campTl.to(partnerEl, {
            motionPath: {
              path: [
                { x: -1000, y: 0 },
                { x: w * 0.02, y: -10 },
                { x: w * 0.18, y: 0 },
              ],
              curviness: 1.3,
              autoRotate: false,
            },
            duration: 6.5 / charSpeed,
            ease: EASE_SUSPENSION,
          }, "<");

          // Dialogue exchange at center
          addDialoguePhases(campTl, campaign.id, lines);
          campTl.to({}, { duration: 1.6 });

          // Smooth exit past right screen edge
          campTl.to(primaryEl, {
            motionPath: {
              path: [
                { x: w * 0.44, y: 0 },
                { x: w * 0.72, y: -8 },
                { x: w + 650, y: 0 },
              ],
              curviness: 1.2,
              autoRotate: false,
            },
            duration: 5.5 / charSpeed,
            ease: "power1.in",
          });
          campTl.to(partnerEl, {
            motionPath: {
              path: [
                { x: w * 0.18, y: 0 },
                { x: w * 0.48, y: -6 },
                { x: w + 350, y: 0 },
              ],
              curviness: 1.2,
              autoRotate: false,
            },
            duration: 5.5 / charSpeed,
            ease: "power1.in",
          }, "<");

          // Pleasant gap before next cruise
          campTl.to({}, { duration: 2.0 });
        }
        // ----------------------------------------------------
        // 2. CONVOY MODE
        // ----------------------------------------------------
        else if (campaign.campaignMode === "CONVOY" && partnerEl) {
          const clip = findSceneClip(campaign.characterId, campaign.partnerCharacterId!, currentPage);
          const lines = clip?.lines || (campaign.dialogueScript
            ? [
                { speaker: 1 as const, text: campaign.dialogueScript.char1Line, durationMs: 2200 },
                { speaker: 2 as const, text: campaign.dialogueScript.char2Line, durationMs: 2200 },
              ]
            : [{ speaker: 1 as const, text: "United Mobility Convoy! 🚀", durationMs: 2000 }]);

          campTl.set(primaryEl, { x: -650, y: 0, visibility: "visible", opacity: 1 });
          campTl.set(partnerEl, { x: -1000, y: 0, visibility: "visible", opacity: 1 });

          campTl.to(primaryEl, {
            x: w * 0.50,
            duration: 6.5 / charSpeed,
            ease: EASE_SUSPENSION,
          });
          campTl.to(partnerEl, {
            x: w * 0.22,
            duration: 6.5 / charSpeed,
            ease: EASE_SUSPENSION,
          }, "<");

          addDialoguePhases(campTl, campaign.id, lines);
          campTl.to({}, { duration: 1.4 });

          campTl.to(primaryEl, {
            x: w + 650,
            duration: 6.0 / charSpeed,
            ease: "power1.in",
          });
          campTl.to(partnerEl, {
            x: w + 350,
            duration: 6.0 / charSpeed,
            ease: "power1.in",
          }, "<");

          campTl.to({}, { duration: 2.0 });
        }
        // ----------------------------------------------------
        // 3. RACE OVERTAKE MODE
        // ----------------------------------------------------
        else if (campaign.campaignMode === "RACE_OVERTAKE" && partnerEl) {
          const clip = findSceneClip(campaign.characterId, campaign.partnerCharacterId!, currentPage);
          const lines = clip?.lines || [
            { speaker: 1 as const, text: "Passing on the left! ⚡", durationMs: 2000 },
            { speaker: 2 as const, text: "Go go go! 💨", durationMs: 2000 },
          ];

          campTl.set(partnerEl, { x: -500, y: -22, visibility: "visible", opacity: 1 });
          campTl.set(primaryEl, { x: -850, y: 0, visibility: "visible", opacity: 1 });

          campTl.to(partnerEl, {
            x: w * 0.45,
            duration: 5.5 / charSpeed,
            ease: EASE_SUSPENSION,
          });
          campTl.to(primaryEl, {
            x: w * 0.20,
            duration: 5.5 / charSpeed,
            ease: EASE_SUSPENSION,
          }, "<");

          campTl.to(primaryEl, {
            x: w * 0.68,
            y: -10,
            duration: 2.8,
            ease: EASE_TURBO_BOOST,
          });
          campTl.to(partnerEl, {
            x: w * 0.55,
            duration: 3.2,
            ease: "none",
          }, "<");

          addDialoguePhases(campTl, campaign.id, lines);
          campTl.to({}, { duration: 1.0 });

          campTl.to(primaryEl, {
            x: w + 700,
            duration: 4.5 / charSpeed,
            ease: "power1.in",
          });
          campTl.to(partnerEl, {
            x: w + 450,
            duration: 5.5 / charSpeed,
            ease: "power1.in",
          }, "<");

          campTl.to({}, { duration: 2.0 });
        }
        // ----------------------------------------------------
        // 4. SOLO MODE
        // ----------------------------------------------------
        else {
          campTl.set(primaryEl, { x: -650, y: 0, visibility: "visible", opacity: 1 });

          // Smooth continuous butter glide all the way across
          campTl.to(primaryEl, {
            x: w + 650,
            duration: 13 / charSpeed,
            ease: "none",
          });

          if (innerPrimaryEl) {
            gsap.to(innerPrimaryEl, {
              y: -8,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }

          campTl.to({}, { duration: 2.0 });
        }

        masterTl.add(campTl);
        timelinesRef.current[campaign.id] = campTl;
      });
    }, containerRef);

    return () => { ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, activeCampaignKey, currentPage, speedMultiplier]);

  // ============================================================
  // RESUME HELPER
  // ============================================================
  const resumeCampaign = useCallback((campaignId: string) => {
    if (masterTlRef.current) {
      gsap.to(masterTlRef.current, { timeScale: 1.0, duration: 0.4 });
      if (masterTlRef.current.paused()) masterTlRef.current.resume();
    }
  }, []);

  // ============================================================
  // HOVER — slow-down / resume
  // ============================================================
  const handleMouseEnter = useCallback((campaignId: string) => {
    setHoveredCampaignId(campaignId);
    if (masterTlRef.current && actionMenuCampaignId !== campaignId) {
      gsap.to(masterTlRef.current, { timeScale: 0.15, duration: 0.4, ease: "power2.out" });
    }
    triggerEmotion(campaignId, "EXCITED");
  }, [actionMenuCampaignId, triggerEmotion]);

  const handleMouseLeave = useCallback((campaignId: string) => {
    setHoveredCampaignId(null);
    if (masterTlRef.current && actionMenuCampaignId !== campaignId) {
      gsap.to(masterTlRef.current, { timeScale: 1.0, duration: 0.6, ease: "power2.inOut" });
    }
  }, [actionMenuCampaignId]);

  // ============================================================
  // FIRST-CLICK ACTION MENU & OUTSIDE DISMISSAL
  // ============================================================
  const handleFirstClick = useCallback((e: React.MouseEvent, campaign: AdCampaign) => {
    e.stopPropagation();

    // If menu already open for this campaign, close it and resume
    if (actionMenuCampaignId === campaign.id) {
      setActionMenuCampaignId(null);
      resumeCampaign(campaign.id);
      triggerEmotion(campaign.id, "DISAPPOINTED");
      return;
    }

    // If another campaign was already open/paused, resume that campaign first
    if (actionMenuCampaignId && actionMenuCampaignId !== campaign.id) {
      resumeCampaign(actionMenuCampaignId);
    }

    // Pause master timeline
    if (masterTlRef.current) masterTlRef.current.pause();

    setActionMenuCampaignId(campaign.id);
    triggerEmotion(campaign.id, "EXCITED");
  }, [actionMenuCampaignId, resumeCampaign, triggerEmotion]);

  const handleViewProducts = useCallback((campaign: AdCampaign) => {
    setActionMenuCampaignId(null);
    resumeCampaign(campaign.id);
    onCampaignClick(campaign);
  }, [onCampaignClick, resumeCampaign]);

  const handleComeBackLater = useCallback((campaignId: string) => {
    setActionMenuCampaignId(null);
    resumeCampaign(campaignId);
    triggerEmotion(campaignId, "DISAPPOINTED");
  }, [resumeCampaign, triggerEmotion]);

  const handleShareDeal = useCallback((campaign: AdCampaign) => {
    const url = `${window.location.origin}?campaign=${campaign.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    // Brief excited reaction
    triggerEmotion(campaign.id, "EXCITED", "Link copied! Share the love! 🔗");
    // Keep menu open momentarily then close and resume
    setTimeout(() => {
      setActionMenuCampaignId(null);
      resumeCampaign(campaign.id);
    }, 1800);
  }, [resumeCampaign, triggerEmotion]);

  // Close action menu on global outside clicks
  useEffect(() => {
    if (!actionMenuCampaignId) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(".character-action-menu")) {
        return;
      }
      handleComeBackLater(actionMenuCampaignId);
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [actionMenuCampaignId, handleComeBackLater]);

  if (!isMounted || activeCampaigns.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 w-full h-72 pointer-events-none z-[60] overflow-hidden"
    >
      {activeCampaigns.map((campaign, idx) => {
        const charMeta    = MOCK_CHARACTERS.find((ch) => ch.id === campaign.characterId);
        const partnerMeta = MOCK_CHARACTERS.find((ch) => ch.id === campaign.partnerCharacterId)
                            || MOCK_CHARACTERS[1];
        const themeColor  = charMeta?.themeColor || "#2563eb";
        const partnerColor = partnerMeta?.themeColor || "#0284c7";

        // Vertical offset on bottom track
        const isMulti = campaign.campaignMode !== "SOLO";
        const bottomOffset = 14 + (idx % 2) * (isMulti ? 24 : 16);

        const currentDialogues = activeDialogues[campaign.id] || {};
        const isHovered = hoveredCampaignId === campaign.id;
        const isMenuOpen = actionMenuCampaignId === campaign.id;
        const emotion = emotionStates[campaign.id] || "IDLE";

        return (
          <React.Fragment key={campaign.id}>
            {/* ---- PRIMARY CHARACTER ---- */}
            <div
              ref={(el) => { adRefs.current[`${campaign.id}_primary`] = el; }}
              onMouseEnter={() => handleMouseEnter(campaign.id)}
              onMouseLeave={() => handleMouseLeave(campaign.id)}
              onClick={(e) => handleFirstClick(e, campaign)}
              className="absolute left-0 pointer-events-auto cursor-pointer group"
              style={{
                transform: "translateX(-1200px)",
                opacity: 0,
                visibility: "hidden",
                bottom: `${bottomOffset}px`,
              }}
            >
              {/* Click-to-interact action menu */}
              <div className="character-action-menu">
                <CharacterActionMenu
                  campaign={campaign}
                  isVisible={isMenuOpen}
                  onViewProducts={() => handleViewProducts(campaign)}
                  onComeBackLater={() => handleComeBackLater(campaign.id)}
                  onShareDeal={() => handleShareDeal(campaign)}
                />
              </div>

              {/* Hover preview tooltip (only when menu not open) */}
              {!isMenuOpen && (
                <CharacterPreviewTooltip campaign={campaign} isVisible={isHovered} />
              )}

              <div
                ref={(el) => { innerAdRefs.current[`${campaign.id}_primary`] = el; }}
                className={`relative transition-drop-shadow duration-200 ${
                  emotion === "EXCITED" ? "drop-shadow-2xl" : ""
                }`}
              >
                <CharacterSprite
                  characterId={campaign.characterId}
                  ctaText={
                    campaign.campaignMode !== "SOLO" && campaign.mergedBannerText
                      ? campaign.mergedBannerText
                      : campaign.ctaText
                  }
                  bubbleText={currentDialogues.char1 || campaign.bubbleText}
                  themeColor={themeColor}
                  flagShape={campaign.flagShape || charMeta?.defaultFlagShape}
                  accessory={campaign.accessory}
                  wheelColor={campaign.wheelColor}
                  size={campaign.characterSize || "large"}
                  isHovered={isHovered || isMenuOpen}
                  isTalking={Boolean(currentDialogues.char1)}
                  isWaving={isHovered || isMenuOpen}
                />
              </div>
            </div>

            {/* ---- PARTNER CHARACTER (CO_OP / CONVOY / RACE_OVERTAKE) ---- */}
            {campaign.campaignMode !== "SOLO" && (
              <div
                ref={(el) => { adRefs.current[`${campaign.id}_partner`] = el; }}
                onMouseEnter={() => handleMouseEnter(campaign.id)}
                onMouseLeave={() => handleMouseLeave(campaign.id)}
                onClick={(e) => handleFirstClick(e, campaign)}
                className="absolute left-0 pointer-events-auto cursor-pointer group"
                style={{
                  transform: "translateX(-1200px)",
                  opacity: 0,
                  visibility: "hidden",
                  bottom: `${bottomOffset + (campaign.campaignMode === "RACE_OVERTAKE" ? 22 : 0)}px`,
                }}
              >
                <div
                  ref={(el) => { innerAdRefs.current[`${campaign.id}_partner`] = el; }}
                  className="relative transition-transform duration-200"
                >
                  <CharacterSprite
                    characterId={campaign.partnerCharacterId || "wheelchair_boy"}
                    ctaText={campaign.ctaText}
                    bubbleText={currentDialogues.char2 || partnerMeta.defaultBubble}
                    themeColor={partnerColor}
                    flagShape={partnerMeta.defaultFlagShape || "swallowtail"}
                    size={campaign.characterSize || "large"}
                    isHovered={isHovered}
                    isTalking={Boolean(currentDialogues.char2)}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

