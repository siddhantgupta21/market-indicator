"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import Script from "next/script";

interface VantaEffect {
  destroy: () => void;
}

interface VANTA {
  DOTS: (options: Record<string, unknown>) => VantaEffect;
}

declare global {
  interface Window {
    VANTA?: VANTA;
  }
}

interface VantaBackgroundProps {
  children: ReactNode;
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadVanta = () => {
      if (!vantaEffect && window.VANTA) {
        const effect = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xfacc15, // yellow
          backgroundColor: 0x000000, // black background
          size: 3.5, // ball size
          spacing: 50.0, // distance between balls
          showLines: false, // hide connecting lines
          speed: 0.5, // lower value = slower motion
        });

        setVantaEffect(effect);
      }
    };

    loadVanta();

    return () => {
      vantaEffect?.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="relative min-h-screen">
      {/* Vanta background layer */}
      <div ref={vantaRef} className="fixed inset-0 w-full h-full z-0" />

      {/* Content layer */}
      <div className="relative z-10">
        {/* Load three.js and Vanta.js */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js"
          strategy="beforeInteractive"
          onLoad={() => console.log("Vanta DOTS loaded")}
        />
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
