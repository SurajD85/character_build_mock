"use client";

import React from "react";

interface QuietModeToggleProps {
  isQuiet: boolean;
  onToggle: () => void;
  isReducedMotionSystem?: boolean;
}

export const QuietModeToggle: React.FC<QuietModeToggleProps> = ({
  isQuiet,
  onToggle,
  isReducedMotionSystem = false,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-[70] pointer-events-auto flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggle}
        title={
          isQuiet
            ? "Quiet mode active: Mascot movement is paused. Click to resume motion."
            : "Pause mascot cruising animations for an accessibility-friendly reading experience."
        }
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border backdrop-blur-md transition-all duration-200 ${
          isQuiet
            ? "bg-slate-900/90 text-amber-300 border-amber-500/40 hover:bg-slate-900 ring-2 ring-amber-400/20"
            : "bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white hover:text-slate-900 hover:border-slate-300"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isQuiet ? "bg-amber-400" : "bg-emerald-500 animate-pulse"}`} />
        <span>{isQuiet ? "⏸ Motion Paused" : "✨ Cruising Active"}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
          {isQuiet ? "Resume" : "Quiet"}
        </span>
      </button>
      {isReducedMotionSystem && (
        <span
          title="System prefers-reduced-motion detected"
          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full border border-slate-700 font-semibold"
        >
          OS Reduced Motion
        </span>
      )}
    </div>
  );
};
