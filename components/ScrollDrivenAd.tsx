"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDrivenAdProps {
  adText?: string;
  businessName?: string;
  themeColor?: string;
}

export default function ScrollDrivenAd({ 
  adText = "Need a Welcab? Click to see ours.", 
  businessName = "Ability Motors",
  themeColor = "#3b82f6" // blue-500
}: ScrollDrivenAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !carRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Move the car across the screen tied to scroll
      gsap.to(carRef.current, {
        x: () => window.innerWidth + 400, // Drive off screen to the right
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
        }
      });
      
      // 2. Add a continuous subtle bouncing effect to simulate driving
      gsap.to(carRef.current, {
        y: -3,
        duration: 0.15,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      
      // 3. Add a slight rotation when scrolling fast (momentum effect)
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // Tilt back slightly when moving forward quickly
          gsap.to(carRef.current, {
            rotation: Math.min(Math.max(velocity / -500, -5), 5),
            duration: 0.2
          });
        }
      });
      
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-0 left-0 w-full h-56 pointer-events-none z-50 overflow-hidden">
      {/* The Car Container */}
      <div 
        ref={carRef}
        className="absolute bottom-8 -left-[350px] w-[300px] h-[140px] pointer-events-auto cursor-pointer group"
      >
        {/* Floating Speech Bubble (Caption) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-slate-800 text-sm font-bold py-3 px-5 rounded-3xl shadow-xl shadow-blue-900/10 whitespace-nowrap border border-slate-100/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100 origin-bottom">
          {adText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-b border-r border-slate-100/50 transform rotate-45"></div>
        </div>

        {/* Pulse indicator to prompt hover */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75 group-hover:hidden"></div>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-sm group-hover:hidden"></div>

        {/* SVG Van */}
        <svg viewBox="0 0 300 140" className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-105">
          {/* Shadow beneath car */}
          <ellipse cx="150" cy="130" rx="120" ry="6" fill="#000000" opacity="0.15" />
          
          {/* Back Wheel */}
          <g>
            <circle cx="70" cy="110" r="22" fill="#1e293b" />
            <circle cx="70" cy="110" r="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="70" cy="110" r="4" fill="#64748b" />
          </g>
          
          {/* Front Wheel */}
          <g>
            <circle cx="230" cy="110" r="22" fill="#1e293b" />
            <circle cx="230" cy="110" r="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="230" cy="110" r="4" fill="#64748b" />
          </g>
          
          {/* Main Body */}
          <path d="M 20 100 Q 20 40 40 30 L 170 30 Q 190 30 200 50 L 250 50 Q 280 50 280 80 L 280 100 Q 280 115 265 115 L 40 115 Q 20 115 20 100 Z" fill={themeColor} />
          
          {/* Bumpers */}
          <path d="M 15 100 Q 15 95 20 95 L 30 95 L 30 115 L 20 115 Q 15 115 15 100 Z" fill="#64748b" />
          <path d="M 270 95 L 285 95 Q 290 95 290 105 L 290 115 L 270 115 Z" fill="#64748b" />
          
          {/* Headlights */}
          <rect x="275" y="75" width="8" height="15" rx="3" fill="#fef08a" />
          <path d="M 283 82 L 300 70 L 300 95 Z" fill="#fef08a" opacity="0.3" /> {/* Light beam */}
          <rect x="18" y="75" width="6" height="15" rx="2" fill="#ef4444" /> {/* Tail light */}

          {/* Front Window */}
          <path d="M 175 35 L 195 50 L 235 50 L 235 75 L 175 75 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
          
          {/* Door Handle */}
          <rect x="185" y="80" width="15" height="4" rx="2" fill="#ffffff" opacity="0.5" />
          
          {/* Side Panel (For Business Name) */}
          <rect x="50" y="45" width="115" height="55" rx="8" fill="#ffffff" />
          <rect x="52" y="47" width="111" height="51" rx="6" fill="#f8fafc" />
        </svg>

        {/* Dynamic Business Name overlaid on SVG Panel */}
        <div className="absolute top-[52px] left-[55px] w-[105px] h-[45px] flex flex-col items-center justify-center overflow-hidden">
          <span className="text-[12px] font-black text-slate-800 text-center uppercase tracking-widest leading-tight">
            {businessName.split(' ')[0]}
          </span>
          {businessName.split(' ')[1] && (
            <span className="text-[10px] font-bold text-blue-600 text-center uppercase tracking-wider leading-tight">
              {businessName.split(' ').slice(1).join(' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
