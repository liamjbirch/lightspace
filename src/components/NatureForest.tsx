import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trees, Key, ShoppingBag, MessageSquare, Info, Compass, Sparkles, Globe } from "lucide-react";
import { LandProperty } from "../types";
import { InteractiveGlobe } from "./InteractiveGlobe";
import { LightspaceLogo } from "./LightspaceLogo";

interface NatureForestProps {
  properties: LandProperty[];
  onSelectProperty: (property: LandProperty) => void;
  onSelectView: (view: "home" | "marketplace" | "keys" | "gaia" | "about" | "login") => void;
  currentProperty: LandProperty | null;
}

export const NatureForest: React.FC<NatureForestProps> = ({
  properties,
  onSelectProperty,
  onSelectView,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showGlobe, setShowGlobe] = useState(false);

  // Geometry dimensions for the Flower of Life SVG
  const r = 75; // radius of overlapping circles
  const cx = 250; // center X
  const cy = 250; // center Y

  // Layer 1 coordinates (6 circles at 60 degree intervals, distance = r)
  const layer1 = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      delay: 0.1 + i * 0.08,
    };
  });

  // Layer 2 coordinates (12 circles: 6 at 2r distance, 6 at sqrt(3)r distance)
  const layer2 = Array.from({ length: 6 }).flatMap((_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    const angleOffset = ((i * 60 + 30) * Math.PI) / 180;

    return [
      {
        x: cx + 2 * r * Math.cos(angle),
        y: cy + 2 * r * Math.sin(angle),
        delay: 0.5 + i * 0.05,
      },
      {
        x: cx + Math.sqrt(3) * r * Math.cos(angleOffset),
        y: cy + Math.sqrt(3) * r * Math.sin(angleOffset),
        delay: 0.7 + i * 0.05,
      },
    ];
  });

  // Combining background circles (1 central, 6 layer 1, 12 layer 2)
  const backgroundCircles = [
    { x: cx, y: cy, delay: 0 },
    ...layer1,
    ...layer2,
  ];

  // Spaced out coordinate calculator for outer menu items to prevent overlaps
  const nodeDistance = 122; // spread them out beautifully from center (originally 75px)
  const getOuterCoords = (angleDeg: number) => {
    const angle = (angleDeg * Math.PI) / 180;
    return {
      x: cx + nodeDistance * Math.cos(angle),
      y: cy + nodeDistance * Math.sin(angle),
    };
  };

  const pGaia = getOuterCoords(30);
  const pMarketplace = getOuterCoords(150);
  const pKeys = getOuterCoords(210);
  const pAbout = getOuterCoords(330);

  // Symmetrical and expanded layout of menu nodes
  const menuNodes = [
    {
      id: "projects",
      type: "globe" as const,
      name: "Planetary Projects",
      cap: "Cap. 02 — Active Sanctuaries",
      desc: "Open the interactive rotating 3D Earth globe to explore pinpointed ecological sanctuaries.",
      icon: Globe,
      color: "rgba(167, 173, 155, 0.95)", // soft sage green
      x: cx,
      y: cy,
      radius: 38, // bigger center node
    },
    {
      id: "gaia",
      type: "view" as const,
      view: "gaia" as const,
      name: "The Gaia Shrine",
      cap: "Cap. 08 — GaiA Guide",
      desc: "Commune with the wise AI spirit of regenerative ecosystem wisdom.",
      icon: MessageSquare,
      color: "rgba(212, 163, 115, 0.95)", // warm clay gold
      x: pGaia.x,
      y: pGaia.y,
      radius: 34,
    },
    {
      id: "marketplace",
      type: "view" as const,
      view: "marketplace" as const,
      name: "Marketplace",
      cap: "Cap. 04 — Marketplace",
      desc: "Connect with land stewards, design specialists, and agroforestry suppliers.",
      icon: ShoppingBag,
      color: "rgba(212, 163, 115, 0.95)", // warm clay gold
      x: pMarketplace.x,
      y: pMarketplace.y,
      radius: 34,
    },
    {
      id: "keys",
      type: "view" as const,
      view: "keys" as const,
      name: "Steward Portal",
      cap: "Cap. 01 & 05 — Steward Portal",
      desc: "Manage digital Stewardship Keys, secure credentials, and view auto-rewards.",
      icon: Key,
      color: "rgba(212, 163, 115, 0.95)", // warm clay gold
      x: pKeys.x,
      y: pKeys.y,
      radius: 34,
    },
    {
      id: "about",
      type: "view" as const,
      view: "about" as const,
      name: "The LIGHTSPACE Vision",
      cap: "Cap. 06 — Vision Manifesto",
      desc: "Read our comprehensive blueprint and manifesto for regenerative community real estate.",
      icon: Info,
      color: "rgba(140, 125, 107, 0.95)", // warm soil brown
      x: pAbout.x,
      y: pAbout.y,
      radius: 34,
    },
  ];

  const [transitioningNode, setTransitioningNode] = useState<typeof menuNodes[0] | null>(null);
  const activeHoveredNode = menuNodes.find((n) => n.id === hoveredNodeId);

  const handleNodeClick = (node: typeof menuNodes[0]) => {
    if (transitioningNode) return;
    setTransitioningNode(node);

    setTimeout(() => {
      if (node.id === "projects") {
        setShowGlobe(true);
      } else if (node.type === "view") {
        onSelectView(node.view);
      }
      setTransitioningNode(null);
    }, 2200);
  };

  if (showGlobe) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 md:p-6 bg-forest-900/10 border border-forest-800/25 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-visible">
        <InteractiveGlobe
          properties={properties}
          onSelectProperty={onSelectProperty}
          onBack={() => setShowGlobe(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 select-none overflow-visible">
      
      {/* Lightspace Logo Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="mb-1 pointer-events-none z-10"
      >
        <LightspaceLogo className="w-16 h-16 filter drop-shadow-[0_0_8px_rgba(212,163,115,0.3)]" />
      </motion.div>

      {/* Welcome Home Title */}
      <motion.div
        className="text-center mb-1 pointer-events-none z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15 }}
      >
        <h2 className="font-serif text-3xl md:text-4xl text-earth-sand font-bold tracking-widest mb-1 uppercase">
          Welcome home
        </h2>
      </motion.div>

      {/* Background Guide Note */}
      <div className="text-center mb-6 pointer-events-none z-10">
        <motion.p 
          className="font-serif italic text-earth-sand/70 text-xs tracking-widest animate-pulse"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          ~ Commune with the sacred geometry to navigate the valley ~
        </motion.p>
      </div>

      {/* CENTERPIECE: SACRED GEOMETRY INTERACTIVE CANVAS */}
      <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center overflow-visible mb-8">
        
        {/* Subtle Ambient Glowing Backdrops */}
        <div className="absolute w-80 h-80 rounded-full bg-forest-500/10 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute w-60 h-60 rounded-full bg-amber-gold/5 blur-2xl -z-10 pointer-events-none" />

        {/* Dynamic Interactive SVG Flower of Life */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full overflow-visible"
        >
          {/* Slowly Rotating Outer Group */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "250px 250px" }}
          >
            {/* Outer Boundary Circle 1 */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={r * 3}
              fill="none"
              stroke="rgba(212, 163, 115, 0.45)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2.5 }}
            />

            {/* Outer Boundary Circle 2 */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={r * 3 - 6}
              fill="none"
              stroke="rgba(212, 163, 115, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 2.5, delay: 0.3 }}
            />

            {/* Dynamic connecting lines of light from the center to each outer menu item */}
            {[pGaia, pMarketplace, pKeys, pAbout].map((p, i) => (
              <motion.line
                key={`line-${i}`}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="rgba(212, 163, 115, 0.4)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 + i * 0.1 }}
              />
            ))}

            {/* Standard Sacred Geometry Flower of Life Circles */}
            {backgroundCircles.map((circle, index) => (
              <motion.circle
                key={`bg-circle-${index}`}
                cx={circle.x}
                cy={circle.y}
                r={r}
                fill="none"
                stroke="rgba(140, 125, 107, 0.45)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  pathLength: { duration: 2, delay: circle.delay, ease: "easeInOut" },
                  opacity: { duration: 1.5, delay: circle.delay },
                }}
              />
            ))}

            {/* Dotted interactive indicators (Faint hints for navigation hubs) */}
            {menuNodes.map((node) => (
              <g key={`indicator-${node.id}`} className="pointer-events-none">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 12}
                  fill="none"
                  stroke="rgba(212, 163, 115, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill="rgba(212, 163, 115, 0.5)"
                />
              </g>
            ))}

            {/* INTERACTIVE MENU CORES (Surgical Hover/Click elements) */}
            {menuNodes.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const IconComponent = node.icon;

              return (
                <g
                  key={`menu-node-${node.id}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Large Invisible Hover Target Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 18}
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Counter-rotation to keep all visuals upright/horizontal */}
                  <motion.g
                    animate={{ rotate: -360 }}
                    transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    className="pointer-events-none"
                  >
                    {/* Permanent Menu Item Label Throughout the Flower of Life */}
                    {!isHovered && (
                      <g className="pointer-events-none opacity-90 transition-opacity duration-200">
                        <rect
                          x={node.x - 55}
                          y={node.y + node.radius + 6}
                          width="110"
                          height="15"
                          rx="7.5"
                          fill="rgba(24, 38, 30, 0.88)"
                          stroke="rgba(212, 163, 115, 0.35)"
                          strokeWidth="0.5"
                        />
                        <text
                          x={node.x}
                          y={node.y + node.radius + 16}
                          textAnchor="middle"
                          fill="#F4F1EA"
                          className="font-mono text-[8px] font-bold tracking-wider"
                        >
                          {node.name.replace("The ", "").replace(" Sanctuary", "").replace(" Canopy", "").replace(" Guard", "")}
                        </text>
                      </g>
                    )}

                    {/* The Interactive Menu Circle (Always visible, expands on hover) */}
                    <motion.g
                      initial={{ scale: 0.95, opacity: 0.85 }}
                      animate={{ 
                        scale: isHovered ? 1.15 : 1.0, 
                        opacity: isHovered ? 1.0 : 0.85 
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 280, 
                        damping: 18 
                      }}
                      className="pointer-events-none"
                    >
                      {/* Outer Pulsing Glow */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 10}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.5"
                        opacity={isHovered ? "0.7" : "0.25"}
                        className={isHovered ? "animate-pulse" : ""}
                      />

                      {/* Main Circle Core */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill="#1F2A22" // Beautiful dark green-gray forest core
                        stroke={node.color}
                        strokeWidth="2.5"
                        style={{
                          filter: isHovered ? `drop-shadow(0 0 12px ${node.color})` : "none"
                        }}
                      />

                      {/* Icon Rendered inside SVG via foreignObject */}
                      <foreignObject
                        x={node.x - 15}
                        y={node.y - 15}
                        width="30"
                        height="30"
                      >
                        <div className="w-full h-full flex items-center justify-center text-amber-gold">
                          <IconComponent className="w-5.5 h-5.5" />
                        </div>
                      </foreignObject>
                    </motion.g>

                    {/* Floating Capsule Label hovering directly above the Circle */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.g
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="pointer-events-none"
                        >
                          {/* Background label pill */}
                          <rect
                            x={node.x - 70}
                            y={node.y - node.radius - 32}
                            width="140"
                            height="20"
                            rx="10"
                            fill="#F4F1EA"
                            stroke="#8C7D6B"
                            strokeWidth="1"
                          />
                          <text
                            x={node.x}
                            y={node.y - node.radius - 19}
                            textAnchor="middle"
                            fill="#3E3E2F"
                            className="font-serif text-[9.5px] font-bold tracking-wider uppercase"
                          >
                            {node.name.replace("The ", "")}
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>
                </g>
              );
            })}

            {/* Sparkling forest light particles within Flower of Life */}
            <g className="pointer-events-none">
              <motion.circle 
                cx="180" cy="180" r="2.5" fill="#D4A373"
                animate={{ opacity: [0.2, 0.9, 0.2], y: [180, 175, 180] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
              <motion.circle 
                cx="320" cy="180" r="2" fill="#D4A373"
                animate={{ opacity: [0.1, 0.8, 0.1], y: [180, 185, 180] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
              />
              <motion.circle 
                cx="250" cy="350" r="3" fill="#D4A373"
                animate={{ opacity: [0.1, 0.9, 0.1], x: [250, 255, 250] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              />
              <motion.circle 
                cx="130" cy="280" r="2" fill="#D4A373"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
              />
              <motion.circle 
                cx="370" cy="280" r="2" fill="#D4A373"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
              />
            </g>
          </motion.g>

          {/* SACRED OPENING ROSE PORTAL TRANSITION OVERLAY */}
          <AnimatePresence>
            {transitioningNode && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-none"
              >
                {/* Backdrop to isolate the rose */}
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="500"
                  fill="rgba(244, 241, 234, 0.9)"
                  rx="24"
                  className="backdrop-blur-sm"
                />

                {/* Main Rose Container Centered at (250, 250) */}
                <g transform="translate(250, 250)">
                  {/* Spinning/Blooming Rose Animation */}
                  <motion.g
                    initial={{ scale: 0.2, rotate: 0 }}
                    animate={{ scale: [0.3, 1.25, 1.45], rotate: 1080 }}
                    exit={{ scale: 2.2, opacity: 0 }}
                    transition={{ 
                      duration: 2.1, 
                      ease: "easeInOut",
                    }}
                  >
                    {/* Layer 1: Green Sepals/Leaves */}
                    <g fill="rgba(167, 173, 155, 0.85)" stroke="#5A5A40" strokeWidth="1">
                      {Array.from({ length: 3 }).map((_, i) => {
                        const angle = i * 120;
                        return (
                          <motion.path
                            key={`sepal-${i}`}
                            d="M 0 0 C -25 -70, 25 -70, 0 0"
                            transform={`rotate(${angle})`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.9 }}
                          />
                        );
                      })}
                    </g>

                    {/* Layer 2: Outer Rose Petals (Amber Gold Accent #D4A373) */}
                    <g fill="rgba(212, 163, 115, 0.92)" stroke="#3E3E2F" strokeWidth="1.2">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const angle = i * 60;
                        return (
                          <motion.path
                            key={`outer-petal-${i}`}
                            d="M 0 0 C -35 -65, 35 -65, 0 0"
                            transform={`rotate(${angle})`}
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1.1, rotate: 0 }}
                            transition={{ delay: 0.3, duration: 1.1 }}
                          />
                        );
                      })}
                    </g>

                    {/* Layer 3: Middle Rose Petals (Soft Sand #DCD6CD) */}
                    <g fill="rgba(220, 214, 205, 0.96)" stroke="#3E3E2F" strokeWidth="1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const angle = i * 72 + 36;
                        return (
                          <motion.path
                            key={`mid-petal-${i}`}
                            d="M 0 0 C -25 -50, 25 -50, 0 0"
                            transform={`rotate(${angle})`}
                            initial={{ scale: 0, rotate: 30 }}
                            animate={{ scale: 1.0, rotate: 0 }}
                            transition={{ delay: 0.5, duration: 1.0 }}
                          />
                        );
                      })}
                    </g>

                    {/* Layer 4: Inner Petals (Deep Earth Clay #8C7D6B) */}
                    <g fill="rgba(140, 125, 107, 0.98)" stroke="#3E3E2F" strokeWidth="0.8">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const angle = i * 90 + 15;
                        return (
                          <motion.path
                            key={`inner-petal-${i}`}
                            d="M 0 0 C -15 -35, 15 -35, 0 0"
                            transform={`rotate(${angle})`}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 0.85, rotate: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                          />
                        );
                      })}
                    </g>

                    {/* Layer 5: Central Glowing Rose Core */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="#F4F1EA"
                      stroke="#D4A373"
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    />

                    {/* Pollen details */}
                    {Array.from({ length: 6 }).map((_, i) => {
                      const angle = (i * 60 * Math.PI) / 180;
                      return (
                        <motion.circle
                          key={`pollen-${i}`}
                          cx={Math.cos(angle) * 5}
                          cy={Math.sin(angle) * 5}
                          r="1.8"
                          fill="#D4A373"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.1, duration: 0.4 }}
                        />
                      );
                    })}
                  </motion.g>

                  {/* Sacred Text Label overlay centered above the rose */}
                  <motion.g
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <rect
                      x="-80"
                      y="110"
                      width="160"
                      height="22"
                      rx="11"
                      fill="#3E3E2F"
                      stroke="#D4A373"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="124"
                      textAnchor="middle"
                      fill="#F4F1EA"
                      className="font-mono text-[9px] font-bold tracking-widest uppercase"
                    >
                      {transitioningNode.name.replace("The ", "")}
                    </text>
                  </motion.g>
                </g>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* DETAILED COMMUNIQUÉ PANEL AT BOTTOM */}
      <div className="w-full max-w-lg px-4 z-10">
        <div className="w-full bg-forest-950/80 border border-forest-800/40 rounded-2xl p-5 shadow-xl backdrop-blur-md min-h-[115px] flex flex-col justify-center transition-all duration-300">
          <AnimatePresence mode="wait">
            {activeHoveredNode ? (
              <motion.div
                key={activeHoveredNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <span className="text-[10px] font-mono text-amber-gold uppercase tracking-widest block mb-1.5">
                  {activeHoveredNode.cap}
                </span>
                <h3 className="font-serif text-lg text-earth-sand font-bold mb-1">
                  {activeHoveredNode.name}
                </h3>
                <p className="text-xs text-forest-300 max-w-sm mx-auto leading-relaxed">
                  {activeHoveredNode.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-forest-400 py-1"
              >
                <Compass className="w-5 h-5 mx-auto text-forest-500/60 animate-spin-slow mb-2.5" />
                <p className="text-xs font-serif italic text-forest-300/80">
                  Hover over the circles of the Flower of Life to reveal the gates of LIGHTSPACE...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};
