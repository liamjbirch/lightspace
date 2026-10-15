import React from "react";
import { motion } from "motion/react";

interface FlowerOfLifeProps {
  className?: string;
  size?: number;
  glowColor?: string;
}

export const FlowerOfLife: React.FC<FlowerOfLifeProps> = ({
  className = "",
  size = 300,
  glowColor = "rgba(116, 151, 127, 0.4)"
}) => {
  // Overlapping circles calculation for Flower of Life
  // 1 central circle + 6 in the first layer + 12 in the second layer
  const r = 40; // circle radius
  
  // Center is (150, 150) inside a 300x300 viewport
  const cx = 150;
  const cy = 150;

  // Layer 1 coordinates (6 circles at 60 degree intervals)
  const layer1 = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  });

  // Layer 2 coordinates (12 circles: 6 at 2r distance, 6 in between at sqrt(3)r)
  const layer2 = Array.from({ length: 6 }).flatMap((_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    const angleOffset = ((i * 60 + 30) * Math.PI) / 180;
    
    // Circle at vertex (distance 2r)
    const p1 = {
      x: cx + 2 * r * Math.cos(angle),
      y: cy + 2 * r * Math.sin(angle)
    };
    
    // Circle along edge (distance sqrt(3)r ~ 1.732r)
    const p2 = {
      x: cx + Math.sqrt(3) * r * Math.cos(angleOffset),
      y: cy + Math.sqrt(3) * r * Math.sin(angleOffset)
    };
    
    return [p1, p2];
  });

  const allCircles = [
    { x: cx, y: cy, delay: 0 },
    ...layer1.map((p, i) => ({ ...p, delay: 0.1 + i * 0.05 })),
    ...layer2.map((p, i) => ({ ...p, delay: 0.4 + i * 0.03 }))
  ];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        className="overflow-visible"
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          filter: `drop-shadow(0 0 12px ${glowColor})`
        }}
      >
        {/* Outer boundary circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r * 3}
          fill="none"
          stroke="rgba(212, 163, 115, 0.55)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 3, delay: 0.2 }}
        />
        
        {/* Outer boundary circle 2 */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r * 3 - 6}
          fill="none"
          stroke="rgba(212, 163, 115, 0.25)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 3, delay: 0.5 }}
        />

        {/* Sacred Geometry Circles */}
        {allCircles.map((circle, index) => (
          <motion.circle
            key={index}
            cx={circle.x}
            cy={circle.y}
            r={r}
            fill="none"
            stroke="rgba(140, 125, 107, 0.65)"
            strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              pathLength: { duration: 2, delay: circle.delay, ease: "easeInOut" },
              opacity: { duration: 1.5, delay: circle.delay },
              scale: { duration: 1.5, delay: circle.delay }
            }}
            whileHover={{
              stroke: "rgba(212, 163, 115, 1)",
              strokeWidth: 2,
              transition: { duration: 0.3 }
            }}
          />
        ))}

        {/* Dynamic connecting lines of light */}
        {layer1.map((p, i) => (
          <motion.line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(212, 163, 115, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
        ))}
      </motion.svg>
    </div>
  );
};
