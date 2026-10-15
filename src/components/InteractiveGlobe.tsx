import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Compass, Globe, Navigation, Heart, Shield, Trees } from "lucide-react";
import { LandProperty } from "../types";

interface InteractiveGlobeProps {
  properties: LandProperty[];
  onSelectProperty: (property: LandProperty) => void;
  onBack: () => void;
}

interface LandDot {
  phi: number;   // latitude in radians
  theta: number; // longitude in radians
}

// Bounding box checks for rough procedural Earth continents
function isLandPoint(lat: number, lon: number): boolean {
  // North America & Central America
  if (lat >= 8 && lat <= 75 && lon >= -170 && lon <= -55) {
    if (lat < 25 && lon > -90) {
      // Central America bridge
      if (lat >= 8 && lat < 18 && lon >= -90 && lon <= -75) return true;
      return false; 
    }
    if (lat > 15 && lat < 30 && lon > -115 && lon < -110) return false; // Gulf of California
    return true;
  }
  // South America
  if (lat >= -56 && lat <= 12 && lon >= -82 && lon <= -34) {
    if (lat > 8 && lon > -50) return false;
    return true;
  }
  // Europe
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 45) {
    if (lat > 55 && lon < -5) return false; // Atlantic gaps
    if (lat < 42 && lon > 15 && lon < 25) return true; // Italy / Greece
    return true;
  }
  // Africa
  if (lat >= -35 && lat <= 36 && lon >= -18 && lon <= 52) {
    if (lat > 12 && lon > 34 && lon < 45) return false; // Red Sea gap
    return true;
  }
  // Asia (including India, Indochina, Indonesia)
  if (lat >= 5 && lat <= 75 && lon >= 45 && lon <= 180) {
    if (lat < 30 && lon > 35 && lon < 60) {
      // Arabia
      if (lat < 12) return false;
      return true;
    }
    if (lat < 10 && lon > 95 && lon < 140) return true; // SE Asia / Indonesia
    return true;
  }
  // Australia
  if (lat >= -44 && lat <= -10 && lon >= 110 && lon <= 155) {
    return true;
  }
  // New Zealand
  if (lat >= -47 && lat <= -34 && lon >= 165 && lon <= 179) {
    return true;
  }
  // Greenland
  if (lat >= 60 && lat <= 83 && lon >= -75 && lon <= -10) {
    return true;
  }
  // Great Britain & Ireland
  if (lat >= 50 && lat <= 61 && lon >= -11 && lon <= 2) {
    return true;
  }
  // Japan & Korea
  if (lat >= 30 && lat <= 46 && lon >= 125 && lon <= 146) {
    return true;
  }
  // Madagascar
  if (lat >= -26 && lat <= -12 && lon >= 43 && lon <= 51) {
    return true;
  }
  // Hawaii / Caribbean
  if (lat >= 18 && lat <= 26 && lon >= -161 && lon <= -150) {
    return true;
  }
  // Iceland
  if (lat >= 63 && lat <= 67 && lon >= -25 && lon <= -13) {
    return true;
  }
  return false;
}

// Get regional colors based on latitude and longitude to depict deserts, forests, and ice caps
function getLandColor(lat: number, lon: number): string {
  // Polar Ice/Tundra
  if (lat > 64 || lat < -60) {
    return "#E2E8F0"; // soft ice white
  }
  // Saharan / Arabian Deserts
  if (lat >= 14 && lat <= 32 && lon >= -15 && lon <= 55) {
    return "#D4A373"; // sandy gold
  }
  // Australian Outback Desert
  if (lat >= -32 && lat <= -18 && lon >= 115 && lon <= 140) {
    return "#C49A6C"; // reddish outback
  }
  // Tropical Rainforests (Amazon, Congo, SE Asia)
  if (lat >= -15 && lat <= 12) {
    if (lon >= -80 && lon <= -40) return "#34D399"; // Amazon emerald
    if (lon >= 10 && lon <= 30) return "#059669"; // Congo deep green
    if (lon >= 95 && lon <= 145) return "#34D399"; // Sundaland green
  }
  // Default temperate forest/grassland
  return "#84B090";
}

const GLOBE_LABELS = [
  { text: "NORTH AMERICA", lat: 38, lon: -100, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "SOUTH AMERICA", lat: -15, lon: -60, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "EUROPE", lat: 50, lon: 15, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "AFRICA", lat: 5, lon: 20, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "ASIA", lat: 45, lon: 90, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "AUSTRALIA", lat: -25, lon: 135, color: "rgba(220, 214, 205, 0.55)", fontSize: "7px" },
  { text: "HAWAII (USA)", lat: 24, lon: -156, color: "#E9D8A6", fontSize: "7.5px" },
  { text: "TEXAS (USA)", lat: 31.0, lon: -97.5, color: "#94D2BD", fontSize: "7.5px" },
  { text: "SPAIN", lat: 45, lon: -3, color: "#EE9B00", fontSize: "7.5px" },
  { text: "CALIFORNIA", lat: 39, lon: -121.5, color: "#F48FB1", fontSize: "7.5px" },
];

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  properties,
  onSelectProperty,
  onBack,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dimensions and center coordinates
  const R = 150; // Sphere radius
  const cx = 200; // Center X inside 400x400 view
  const cy = 200; // Center Y inside 400x400 view

  // Interactive rotation state (in radians)
  // rotY: rotation around Y-axis (left/right, i.e., longitude offset)
  // rotX: rotation around X-axis (up/down, i.e., latitude offset/tilt)
  const [rotY, setRotY] = useState(0.5); // Initial Y rotation
  const [rotX, setRotX] = useState(0.2); // Initial X rotation (slight downward tilt)

  // Target coordinates for smooth centering animations
  const [targetRotY, setTargetRotY] = useState<number | null>(null);
  const [targetRotX, setTargetRotX] = useState<number | null>(null);

  // Drag interaction states
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Hover state for tooltip / project details
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Pre-calculate Earth's land points procedural dot grid
  const landDots = useMemo(() => {
    const dots: LandDot[] = [];
    // 4.5-degree steps for a beautiful dense dot-matrix resolution
    for (let lat = -80; lat <= 80; lat += 4.5) {
      for (let lon = -180; lon <= 180; lon += 4.5) {
        if (isLandPoint(lat, lon)) {
          dots.push({
            phi: (lat * Math.PI) / 180,
            theta: (lon * Math.PI) / 180,
          });
        }
      }
    }
    return dots;
  }, []);

  // Map the properties to physical latitude and longitude coordinates
  const propertyCoords = useMemo(() => {
    return properties.map((prop, idx) => {
      let lat = 0;
      let lon = 0;

      // Map coordinates based on known sanctuaries or project ID
      if (prop.id.includes("maui") || prop.id.includes("haleakala") || idx === 0) {
        lat = 20.7;
        lon = -156.3; // Hawaii
      } else if (prop.id.includes("texas") || prop.id.includes("costarica") || prop.id.includes("osa") || idx === 1) {
        lat = 30.5;
        lon = -97.5; // Central Texas (Taylor / Austin Clean Energy Corridor)
      } else if (prop.id.includes("pyrenees") || prop.id.includes("aragon") || idx === 2) {
        lat = 42.3;
        lon = -0.3; // Spain Pyrenees
      } else if (prop.id.includes("redwood") || idx === 3) {
        lat = 37.8;
        lon = -122.2; // Oakland, CA
      }

      return {
        property: prop,
        phi: (lat * Math.PI) / 180,
        theta: (lon * Math.PI) / 180,
        lat,
        lon,
      };
    });
  }, [properties]);

  // Smooth Y-axis auto-rotation or centering interpolation loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (isDragging) {
        // Stop centering on drag
        setTargetRotY(null);
        setTargetRotX(null);
      } else {
        // 1. If we are auto-animating towards a centered coordinate
        if (targetRotY !== null || targetRotX !== null) {
          let updatedY = rotY;
          let updatedX = rotX;

          if (targetRotY !== null) {
            let diffY = targetRotY - rotY;
            // Shortest-path angular interpolation
            diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
            if (Math.abs(diffY) < 0.002) {
              updatedY = targetRotY;
              setTargetRotY(null);
            } else {
              updatedY += diffY * 0.12; // 12% speed
            }
          }

          if (targetRotX !== null) {
            let diffX = targetRotX - rotX;
            if (Math.abs(diffX) < 0.002) {
              updatedX = targetRotX;
              setTargetRotX(null);
            } else {
              updatedX += diffX * 0.12;
            }
          }

          setRotY(updatedY);
          setRotX(updatedX);
        } else {
          // 2. Slow natural Earth orbital rotation
          setRotY((prev) => prev + 0.0025);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [rotY, rotX, targetRotY, targetRotX, isDragging]);

  // Project 3D sphere coordinate to 2D screen coordinate
  // Incorporates rotY (Y-axis spin) and rotX (X-axis tilt)
  const projectPoint = (phi: number, theta: number) => {
    // 1. Rotate around Y-axis by rotY
    const rotatedTheta = theta + rotY;

    const x1 = R * Math.cos(phi) * Math.sin(rotatedTheta);
    const y1 = -R * Math.sin(phi);
    const z1 = R * Math.cos(phi) * Math.cos(rotatedTheta);

    // 2. Rotate around X-axis (tilt up/down) by rotX
    const x2 = x1;
    const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

    return {
      x: cx + x2,
      y: cy + y2,
      z: z2, // positive z is in front, negative z is behind
    };
  };

  // Mouse / Touch Drag Handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    // Adjust angles based on drag distance
    setRotY((prev) => prev + dx * 0.005);
    // Clamp X rotation (tilt) to prevent flipping upside down
    setRotX((prev) => Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev - dy * 0.005)));

    dragStart.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Quick centering handler for active projects
  const centerOnProject = (theta: number, phi: number) => {
    // To center on target: target longitude rotated theta + rotY = 0 => rotY_target = -theta
    // We adjust by -Math.PI / 2 to face directly outwards towards user
    const targetY = -theta;
    const targetX = phi; // tilt matches project latitude

    setTargetRotY(targetY);
    setTargetRotX(targetX);
  };

  // SVG Paths for Latitude grid lines (Parallels)
  const latitudeLines = useMemo(() => {
    const lines = [-60, -40, -20, 0, 20, 40, 60];
    return lines.map((latDeg) => {
      const phi = (latDeg * Math.PI) / 180;
      const points: string[] = [];
      let drawing = false;

      // Draw full circumference but project and segment only the front side (z >= 0)
      for (let thetaDeg = 0; thetaDeg <= 360; thetaDeg += 6) {
        const theta = (thetaDeg * Math.PI) / 180;
        const projected = projectPoint(phi, theta);

        if (projected.z >= -10) {
          if (!drawing) {
            points.push(`M ${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`);
            drawing = true;
          } else {
            points.push(`L ${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`);
          }
        } else {
          drawing = false;
        }
      }
      return points.join(" ");
    });
  }, [rotY, rotX]);

  // SVG Paths for Longitude grid lines (Meridians)
  const longitudeLines = useMemo(() => {
    const lines = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    return lines.map((lonDeg) => {
      const theta = (lonDeg * Math.PI) / 180;
      const points: string[] = [];
      let drawing = false;

      for (let latDeg = -90; latDeg <= 90; latDeg += 6) {
        const phi = (latDeg * Math.PI) / 180;
        const projected = projectPoint(phi, theta);

        if (projected.z >= -10) {
          if (!drawing) {
            points.push(`M ${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`);
            drawing = true;
          } else {
            points.push(`L ${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`);
          }
        } else {
          drawing = false;
        }
      }
      return points.join(" ");
    });
  }, [rotY, rotX]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 select-none overflow-visible">
      
      {/* Return button & header */}
      <div className="w-full flex items-center justify-between border-b border-forest-900/40 pb-3 mb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-forest-300 hover:text-amber-gold font-mono text-[11px] uppercase tracking-wider transition-colors bg-forest-950/40 px-3.5 py-1.5 rounded-full border border-forest-800/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Flower of Life Menu</span>
        </button>
        <div className="text-right">
          <span className="text-[9px] font-mono text-amber-gold uppercase tracking-widest block font-bold">
            Planetary Grid Active
          </span>
          <span className="text-xs font-serif italic text-earth-sand">
            Rotating Holographic Map
          </span>
        </div>
      </div>

      {/* Sphere Interaction Area */}
      <div 
        ref={containerRef}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handleEnd}
        className="relative w-full max-w-[400px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible touch-none"
      >
        {/* Glow behind globe */}
        <div className="absolute w-72 h-72 rounded-full bg-forest-500/15 blur-3xl -z-10 pointer-events-none animate-pulse" />
        <div className="absolute w-52 h-52 rounded-full bg-amber-gold/5 blur-2xl -z-10 pointer-events-none" />

        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible"
        >
          {/* 1. Deep Space Atmospheric outer glow ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R + 8}
            fill="none"
            stroke="rgba(212, 163, 115, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-spin-slow"
          />

          <circle
            cx={cx}
            cy={cy}
            r={R + 4}
            fill="none"
            stroke="rgba(116, 151, 127, 0.25)"
            strokeWidth="1"
          />

          {/* 2. Main Ocean Sphere Background */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="radial-gradient(circle, rgba(14, 25, 20, 0.95) 0%, rgba(6, 12, 10, 0.99) 100%)"
            stroke="rgba(116, 151, 127, 0.4)"
            strokeWidth="1.5"
            className="shadow-inner"
            style={{ fill: "#0C1410" }} // Deep dark forest green for oceans
          />

          {/* 3. Latitude and Longitude Grid Lines (Under the land dots) */}
          <g stroke="rgba(116, 151, 127, 0.12)" strokeWidth="0.8" fill="none">
            {latitudeLines.map((path, i) => path && (
              <path key={`lat-${i}`} d={path} />
            ))}
            {longitudeLines.map((path, i) => path && (
              <path key={`lon-${i}`} d={path} />
            ))}
          </g>

          {/* 4. Procedural Holographic Land Matrix Dots */}
          <g>
            {landDots.map((dot, index) => {
              const proj = projectPoint(dot.phi, dot.theta);
              // Only render dots on the facing hemisphere
              if (proj.z < -2) return null;

              // Scale dot size slightly based on depth perspective
              const depthScale = (proj.z + R) / (2 * R); // range 0 to 1
              const r = 0.7 + depthScale * 0.9;
              const opacity = 0.22 + depthScale * 0.68;

              const latDeg = (dot.phi * 180) / Math.PI;
              const lonDeg = (dot.theta * 180) / Math.PI;
              const landColor = getLandColor(latDeg, lonDeg);

              return (
                <circle
                  key={`dot-${index}`}
                  cx={proj.x.toFixed(1)}
                  cy={proj.y.toFixed(1)}
                  r={r.toFixed(1)}
                  opacity={opacity.toFixed(2)}
                  fill={landColor}
                />
              );
            })}
          </g>

          {/* 4.5. 3D Rotating Country & Continent Labels */}
          <g pointerEvents="none" style={{ userSelect: "none" }}>
            {GLOBE_LABELS.map((label, index) => {
              const phi = (label.lat * Math.PI) / 180;
              const theta = (label.lon * Math.PI) / 180;
              const proj = projectPoint(phi, theta);

              // Only render if they are on the front facing side of the sphere
              if (proj.z < -15) return null;

              // Calculate dynamic opacity based on depth z-axis (facing hemisphere fading)
              const depthScale = (proj.z + R) / (2 * R); // ranges 0 to 1
              const opacity = Math.max(0, (depthScale - 0.25) * 1.3); // fade out near edges

              if (opacity <= 0.05) return null;

              return (
                <g key={`glabel-${index}`} opacity={opacity.toFixed(2)}>
                  {/* Subtle shadow background */}
                  <text
                    x={proj.x}
                    y={proj.y}
                    fill="#030712"
                    fontSize={label.fontSize}
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="font-bold tracking-widest uppercase select-none opacity-90"
                    dy="0.5"
                  >
                    {label.text}
                  </text>
                  <text
                    x={proj.x}
                    y={proj.y}
                    fill={label.color}
                    fontSize={label.fontSize}
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="font-bold tracking-widest uppercase select-none"
                  >
                    {label.text}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 5. Project Pinpoints */}
          {propertyCoords.map(({ property, phi, theta, lat, lon }, index) => {
            const proj = projectPoint(phi, theta);
            const isFacing = proj.z >= -12;
            const isHovered = hoveredProjectId === property.id;

            if (!isFacing) return null;

            // Pin size based on depth
            const depthScale = (proj.z + R) / (2 * R);
            const scale = 0.85 + depthScale * 0.4;

            const getPinColors = (id: string, idx: number) => {
              if (id.includes("maui") || idx === 0) {
                return { strokeOuter: "#E9D8A6", strokeInner: "#D4A373", fill: "#F4F1EA" };
              } else if (id.includes("texas") || id.includes("costarica") || idx === 1) {
                return { strokeOuter: "#94D2BD", strokeInner: "#84B090", fill: "#34D399" };
              } else if (id.includes("pyrenees") || idx === 2) {
                return { strokeOuter: "#EE9B00", strokeInner: "#C49A6C", fill: "#FBBF24" };
              } else {
                return { strokeOuter: "#F48FB1", strokeInner: "#D4939C", fill: "#EC4899" };
              }
            };
            const pinColors = getPinColors(property.id, index);
            
            return (
              <g
                key={`pin-${property.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredProjectId(property.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProperty(property);
                }}
              >
                {/* Outward expanding pulse wave */}
                <circle
                  cx={proj.x}
                  cy={proj.y}
                  r={12 * scale * (isHovered ? 1.5 : 1)}
                  fill="none"
                  stroke={pinColors.strokeOuter}
                  strokeWidth="1"
                  opacity={isHovered ? 0.8 : 0.4}
                  className="animate-ping"
                  style={{ animationDuration: "2.5s" }}
                />

                {/* Pin core glow ring */}
                <circle
                  cx={proj.x}
                  cy={proj.y}
                  r={7 * scale}
                  fill="rgba(31, 31, 16, 0.9)"
                  stroke={pinColors.strokeInner}
                  strokeWidth="2"
                />

                {/* Core shining bead */}
                <circle
                  cx={proj.x}
                  cy={proj.y}
                  r={3.5 * scale}
                  fill={pinColors.fill}
                />

                {/* Pin floating details/tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <g className="pointer-events-none">
                      {/* Line from pin up and right to the floating toolcard */}
                      <path
                        d={`M ${proj.x} ${proj.y} L ${proj.x + 18} ${proj.y - 22}`}
                        stroke="rgba(212, 163, 115, 0.6)"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                        fill="none"
                      />
                      
                      {/* Tooltip Card Overlay container (Using foreignObject to enable HTML/Tailwind) */}
                      <foreignObject
                        x={proj.x + 18}
                        y={proj.y - 105}
                        width="170"
                        height="100"
                      >
                        <div className="bg-forest-950 border border-amber-gold/45 text-earth-sand rounded-xl p-2.5 shadow-2xl space-y-1 backdrop-blur-md opacity-95">
                          <span className="text-[7.5px] font-mono text-amber-gold uppercase block font-semibold">
                            {property.location.split(",")[0]}
                          </span>
                          <h4 className="text-[10.5px] font-serif font-bold text-earth-sand leading-tight">
                            {property.name}
                          </h4>
                          <p className="text-[8.5px] text-forest-300 leading-normal italic line-clamp-2">
                            "{property.tagline}"
                          </p>
                          <div className="flex justify-between items-center text-[7px] font-mono text-emerald-400 mt-1">
                            <span>CO2: {property.sensorData.carbonOffset}t</span>
                            <span>Moisture: {property.sensorData.soilMoisture}%</span>
                          </div>
                          <span className="text-[6.5px] font-mono text-forest-500 uppercase block text-right">
                            Click Pin to Open Space →
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* Floating Instruction overlay */}
        <div className="absolute bottom-1 bg-forest-950/70 border border-forest-800/40 px-3 py-1 rounded-full text-[9px] font-mono text-forest-400 pointer-events-none">
          Drag to spin globe • Hover or click pinpoints
        </div>
      </div>

      {/* Quick Center Shortcuts & Legend */}
      <div className="w-full space-y-3.5">
        <span className="text-[9px] font-mono text-forest-400 uppercase tracking-widest block text-center">
          Centering Coordinates
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {propertyCoords.map(({ property, phi, theta }, idx) => (
            <button
              key={`btn-${property.id}`}
              onClick={() => centerOnProject(theta, phi)}
              className="px-2 py-2 bg-forest-900/40 hover:bg-forest-900/80 border border-forest-800/60 rounded-xl flex flex-col items-center transition-all group"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-gold mb-1 group-hover:rotate-45 transition-transform" />
              <span className="text-[9.5px] font-serif font-bold text-earth-sand text-center line-clamp-1">
                {property.name.replace(" Sanctuary", "").replace(" Campus", "").replace(" Verdad", "").replace(" Canopy", "")}
              </span>
              <span className="text-[7.5px] font-mono text-forest-500 uppercase mt-0.5">
                {property.id.includes("maui") || idx === 0 ? "Hawaii" : 
                 property.id.includes("texas") || property.id.includes("costarica") || idx === 1 ? "Texas" : 
                 property.id.includes("pyrenees") || idx === 2 ? "Spain" : "California"}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
