import React, { useEffect, useRef, useState, ReactNode } from "react";

interface VantaEffect {
  destroy: () => void;
}

interface VANTA {
  RINGS: (options: Record<string, unknown>) => VantaEffect;
}

declare global {
  interface Window {
    VANTA?: VANTA;
  }
}

interface RingsBackgroundProps {
  children: ReactNode;
}

const RingsBackground: React.FC<RingsBackgroundProps> = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      const effect = window.VANTA.RINGS({
        el: vantaRef.current,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x000000,
        color: 0x111111, // Very dark gray rings
        backgroundAlpha: 1.0,
        size: 0.5,
        spacing: 70,
        speed: 0.05,
        quantity: 1,
      });

      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div className="relative min-h-screen">
      <div 
        ref={vantaRef} 
        className="fixed inset-0 w-full h-full z-0" 
      />

      <div className="relative z-10">
        {children}
      </div>
      
      {/* Scripts */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" />
      <script 
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.rings.min.js" 
        onLoad={() => console.log("Vanta RINGS loaded")} 
      />
    </div>
  );
};

export default RingsBackground;
