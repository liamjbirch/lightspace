import React, { useEffect, useState } from "react";

interface Leaf {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
}

export const EtherealWind: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate organic particles
    const leafColors = [
      "rgba(167, 173, 155, 0.45)", // soft sage green
      "rgba(140, 125, 107, 0.35)", // warm taupe soil brown
      "rgba(212, 163, 115, 0.35)", // warm clay gold
      "rgba(244, 241, 234, 0.25)"  // off-white sand
    ];

    const initialLeaves: Leaf[] = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * -30, // start in negative to distribute them immediately
      duration: 12 + Math.random() * 24, // speed
      size: 5 + Math.random() * 14, // dimensions
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      rotation: Math.random() * 360
    }));

    setLeaves(initialLeaves);

    // Periodically replace leaves to ensure continuous drift
    const interval = setInterval(() => {
      setLeaves((prev) =>
        prev.map((l) => {
          // Keep active or reset l if it would have finished its long duration
          return l;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="absolute opacity-0"
          style={{
            left: `${leaf.left}%`,
            top: "-5%",
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.5}px`,
            fill: leaf.color,
            animation: `leaf-fall ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
            transform: `rotate(${leaf.rotation}deg)`,
            filter: "blur(0.5px)"
          }}
          viewBox="0 0 20 30"
        >
          {/* Natural organic leaf curve */}
          <path d="M10,0 C17,10 20,20 10,30 C0,20 3,10 10,0 Z" />
          {/* Subtle leaf stem line */}
          <path
            d="M10,0 L10,30"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
          />
        </svg>
      ))}
      
      {/* Serene organic soft glowing orbs (mandalas of light) in background */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none opacity-20 -top-40 -left-40 animate-pulse-slow"
        style={{ background: "radial-gradient(circle, rgba(167, 173, 155, 0.4) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none opacity-25 -bottom-60 -right-60 animate-pulse-slow"
        style={{ background: "radial-gradient(circle, rgba(212, 163, 115, 0.3) 0%, transparent 70%)", animationDelay: "5s" }}
      />
    </div>
  );
};
