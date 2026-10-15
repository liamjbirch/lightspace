import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Info, Heart, Volume2, VolumeX, ShieldAlert, 
  Map, Sparkles, Trees, Landmark, BookOpen, Layers,
  User, ChevronDown, Sliders, Users, ShieldCheck, Clock, Settings,
  MessageSquare, Lock, LogIn, LogOut
} from "lucide-react";
import { FlowerOfLife } from "./components/FlowerOfLife";
import { EtherealWind } from "./components/EtherealWind";
import { NatureForest } from "./components/NatureForest";
import { LightspaceLogo } from "./components/LightspaceLogo";
import { PropertyWorkspace } from "./components/PropertyWorkspace";
import { Marketplace } from "./components/Marketplace";
import { OnboardingAndKeys } from "./components/OnboardingAndKeys";
import { GaiAGuide } from "./components/GaiAGuide";
import { ContactStewardModal } from "./components/ContactStewardModal";
import { LoginPage, UserSession } from "./components/LoginPage";
import { 
  OwnerHomeDashboard, InvestorHomeDashboard, ContributorHomeDashboard,
  StewardHomeDashboard, LeaderHomeDashboard, AuditorHomeDashboard,
  AdminHomeDashboard, PublicHomeDashboard
} from "./components/HomeDashboards";
import { 
  INITIAL_PROPERTIES, MARKETPLACE_LISTINGS, STEWARDSHIP_KEYS,
  INITIAL_STEWARD_INQUIRIES, INITIAL_SUPPLIER_INQUIRIES
} from "./data";
import { LandProperty, MarketplaceListing, StewardshipKey, StewardInquiry, SupplierInquiry, InquiryMessage } from "./types";

const USER_ROLES = [
  { id: "steward", name: "Stewards" },
  { id: "leader", name: "Community Leaders" },
  { id: "owner", name: "Project Owners" },
  { id: "contributor", name: "Contributors" },
  { id: "investor", name: "Investors / Partners" },
  { id: "public", name: "Public / External" },
  { id: "admin", name: "Admins / Operators" },
  { id: "auditor", name: "Auditors" }
];

export default function App() {
  const [properties, setProperties] = useState<LandProperty[]>(INITIAL_PROPERTIES);
  const [userRole, setUserRole] = useState<string>("steward");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ category: string; message: string } | null>(null);

  const showSystemToast = (category: string, message: string) => {
    setToast({ category, message });
    // Auto-dismiss after 4.5s
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 4500);
  };
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(MARKETPLACE_LISTINGS);
  const [stewardshipKeys, setStewardshipKeys] = useState<StewardshipKey[]>(STEWARDSHIP_KEYS);

  // Inquiries State with localStorage persistence
  const [stewardInquiries, setStewardInquiries] = useState<StewardInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("lightspace_steward_inquiries");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize any old prop-costarica entries to prop-texas
        return parsed.map((inq: StewardInquiry) => {
          if (inq.propertyId === "prop-costarica") {
            return {
              ...inq,
              propertyId: "prop-texas",
              propertyName: "Texas Clean Data Center Campus",
              stewardName: "Jordan Reed"
            };
          }
          return inq;
        });
      }
      return INITIAL_STEWARD_INQUIRIES;
    } catch {
      return INITIAL_STEWARD_INQUIRIES;
    }
  });

  const [supplierInquiries, setSupplierInquiries] = useState<SupplierInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("lightspace_supplier_inquiries");
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIER_INQUIRIES;
    } catch {
      return INITIAL_SUPPLIER_INQUIRIES;
    }
  });

  // Modal state when reaching out to steward from home/dashboards
  const [contactingPropertySteward, setContactingPropertySteward] = useState<LandProperty | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("lightspace_steward_inquiries", JSON.stringify(stewardInquiries));
    } catch {}
  }, [stewardInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem("lightspace_supplier_inquiries", JSON.stringify(supplierInquiries));
    } catch {}
  }, [supplierInquiries]);

  const handleSendStewardInquiry = (newInquiry: StewardInquiry) => {
    setStewardInquiries(prev => [newInquiry, ...prev]);
    showSystemToast("COMMUNICATION", `Outreach dispatched to steward ${newInquiry.stewardName}`);
  };

  const handleAddMessageToStewardInquiry = (inquiryId: string, message: InquiryMessage) => {
    setStewardInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        if (message.isStewardOrSupplier) {
          showSystemToast("STEWARD REPLY", `${inq.stewardName} replied to your inquiry!`);
        }
        return {
          ...inq,
          status: message.isStewardOrSupplier ? "replied" : inq.status,
          messages: [...inq.messages, message]
        };
      }
      return inq;
    }));
  };

  const handleSendSupplierInquiry = (newInquiry: SupplierInquiry) => {
    setSupplierInquiries(prev => [newInquiry, ...prev]);
    showSystemToast("MARKETPLACE", `Inquiry sent to ${newInquiry.supplierName}`);
  };

  const handleAddMessageToSupplierInquiry = (inquiryId: string, message: InquiryMessage) => {
    setSupplierInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        if (message.isStewardOrSupplier) {
          showSystemToast("SUPPLIER REPLY", `${inq.supplierName} sent an update / quote!`);
        }
        return {
          ...inq,
          status: message.quoteDetails ? "quote_provided" : inq.status,
          messages: [...inq.messages, message]
        };
      }
      return inq;
    }));
  };

  // Navigation states
  const [activeProperty, setActiveProperty] = useState<LandProperty | null>(null);
  const [activeView, setActiveView] = useState<"home" | "marketplace" | "keys" | "gaia" | "about" | "login">("home");

  // Authenticated User Session
  const [currentUserSession, setCurrentUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("lightspace_user_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUserSession) {
        localStorage.setItem("lightspace_user_session", JSON.stringify(currentUserSession));
      } else {
        localStorage.removeItem("lightspace_user_session");
      }
    } catch {}
  }, [currentUserSession]);

  const handleSignOut = () => {
    setCurrentUserSession(null);
    setUserRole("public");
    showSystemToast("SESSION ENDED", "Signed out of Lightspace. Switched to Public perspective.");
  };

  // Audio state
  const [audioActive, setAudioActive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);

  // Toggles the natural forest ambient sound synthesizer (wind drone & chimes)
  const toggleAmbientSound = () => {
    if (audioActive) {
      if (oscillator) {
        try { oscillator.stop(); } catch(e){}
        setOscillator(null);
      }
      setAudioActive(false);
    } else {
      try {
        const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) setAudioContext(ctx);

        // Synthesize a soothing organic wind-chime drone
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 110Hz or low sub representing "Earth grounding frequency"
        osc.frequency.setValueAtTime(110, ctx.currentTime); 
        osc.type = "sine";

        // Filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, ctx.currentTime);

        // LFO to simulate organic wind swaying
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.15; // slow modulation
        lfoGain.gain.value = 0.05; // gentle fluctuation

        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(0.04, ctx.currentTime); // soft background amplitude
        osc.start();
        lfo.start();

        setOscillator(osc);
        setAudioActive(true);
      } catch (err) {
        console.warn("Audio context blocked by frame security or not supported:", err);
      }
    }
  };

  // State handlers to bubble up changes
  const handleUpdateProperty = (updated: LandProperty) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    setActiveProperty(updated);
  };

  const handleAddListing = (newListing: MarketplaceListing) => {
    setMarketplaceListings(prev => [newListing, ...prev]);
  };

  const handleUpdateKeys = (updated: StewardshipKey[]) => {
    setStewardshipKeys(updated);
  };

  // Helper values calculated dynamically for real telemetry indicators
  const totalAcres = properties.reduce((acc, p) => acc + p.areaAcres, 0);
  const totalCarbon = properties.reduce((acc, p) => acc + p.sensorData.carbonOffset, 0);
  const claimedRewards = stewardshipKeys.reduce((acc, k) => acc + parseFloat(k.rewardsClaimed.replace(/[^0-9.]/g, "")), 0);

  return (
    <div className="relative min-h-screen bg-forest-950 flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* Background Ethereal elements */}
      <EtherealWind />

      {/* HEADER SECTION */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-6 pb-2 flex flex-col sm:flex-row justify-between items-center border-b border-forest-900/40 z-30 gap-4">
        {/* Branding Title */}
        <div 
          onClick={() => {
            setActiveProperty(null);
            setActiveView("home");
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <LightspaceLogo className="w-12 h-12 group-hover:scale-105 transition-all duration-300" />
          <div>
            <h1 className="font-serif text-xl md:text-2xl text-earth-sand font-bold tracking-widest uppercase">
              LIGHTSPACE
            </h1>
            <p className="text-[9px] font-mono text-forest-300 tracking-wider uppercase">
              The Regenerative Real Estate Ecosystem
            </p>
          </div>
        </div>

        {/* Real-time Telemetry Dashboard (Authentic, low-clutter) */}
        <div className="flex items-center space-x-5 md:space-x-8 bg-forest-900/10 border border-forest-800/25 rounded-full px-5 py-2">
          <div className="text-center">
            <span className="text-[8px] font-mono text-forest-400 block uppercase">Acres Secured</span>
            <span className="text-[11px] font-mono text-amber-gold font-bold">{totalAcres}</span>
          </div>
          <div className="border-r border-forest-800/30 h-6" />
          <div className="text-center">
            <span className="text-[8px] font-mono text-forest-400 block uppercase">Carbon Ledger</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">{totalCarbon} t</span>
          </div>
          <div className="border-r border-forest-800/30 h-6" />
          <div className="text-center">
            <span className="text-[8px] font-mono text-forest-400 block uppercase">Rewards Claimed</span>
            <span className="text-[11px] font-mono text-earth-sand font-bold">${claimedRewards.toLocaleString()}</span>
          </div>
        </div>

        {/* Utility Toolbar */}
        <div className="flex items-center space-x-2.5">
          {/* Dedicated Login / Portal Button */}
          <button
            onClick={() => {
              setActiveProperty(null);
              setActiveView(activeView === "login" ? "home" : "login");
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 font-mono text-[10px] uppercase tracking-wider cursor-pointer ${
              activeView === "login"
                ? "bg-amber-gold border-amber-gold text-forest-950 font-bold shadow-lg shadow-amber-gold/20"
                : currentUserSession
                ? "bg-forest-900/60 border-amber-gold/40 text-earth-sand hover:border-amber-gold"
                : "bg-forest-900/40 border-amber-gold/50 text-amber-gold hover:bg-forest-900/70 hover:border-amber-gold shadow-sm"
            }`}
            title={currentUserSession ? `Signed in as ${currentUserSession.name}` : "Open Lightspace Login Portal"}
          >
            {currentUserSession ? (
              <>
                <img 
                  src={currentUserSession.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"} 
                  alt={currentUserSession.name} 
                  className="w-4 h-4 rounded-full object-cover border border-amber-gold/70 flex-shrink-0"
                />
                <span className="max-w-[85px] truncate font-semibold">{currentUserSession.name.split(" ")[0]}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-gold" />
                <span>Log In</span>
              </>
            )}
          </button>

          {/* User Role Selector Dropdown */}
          <div className="relative mr-1">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-2 bg-forest-900/40 border border-amber-gold/30 rounded-full px-4 py-1.5 cursor-pointer text-earth-sand hover:border-amber-gold hover:bg-forest-900/60 transition-all focus:outline-none"
            >
              <User className="w-3.5 h-3.5 text-amber-gold" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                {USER_ROLES.find(r => r.id === userRole)?.name || userRole}
              </span>
              <ChevronDown className="w-3 h-3 text-forest-400 group-hover:text-amber-gold transition-colors" />
            </button>
            
            {/* Click-away backdrop */}
            {isRoleDropdownOpen && (
              <div 
                className="fixed inset-0 z-40 cursor-default bg-transparent" 
                onClick={() => setIsRoleDropdownOpen(false)} 
              />
            )}

            {/* Dropdown Options */}
            <div className={`absolute right-0 mt-1.5 w-56 bg-forest-950 border border-forest-800/80 rounded-xl shadow-xl py-1 z-50 transition-all duration-200 ${
              isRoleDropdownOpen 
                ? "opacity-100 pointer-events-auto scale-100" 
                : "opacity-0 pointer-events-none scale-95"
            }`}>
              <div className="px-3 py-1.5 border-b border-forest-900/60 mb-1">
                <span className="text-[9px] font-mono text-forest-500 uppercase block">Switch Perspective</span>
              </div>
              {USER_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setUserRole(role.id);
                    setIsRoleDropdownOpen(false);
                    showSystemToast("ROLE SWITCH", `Viewing platform as ${role.name}`);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-mono transition-colors flex items-center justify-between ${
                    userRole === role.id 
                      ? "text-amber-gold bg-forest-900/40 font-bold" 
                      : "text-forest-300 hover:text-earth-sand hover:bg-forest-900/20"
                  }`}
                >
                  <span>{role.name}</span>
                  {userRole === role.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-gold animate-ping" />}
                </button>
              ))}

              <div className="border-t border-forest-900/60 mt-1 pt-1">
                <button
                  onClick={() => {
                    setActiveProperty(null);
                    setActiveView("login");
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs font-mono text-amber-gold hover:bg-forest-900/30 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login / Switch Portal</span>
                </button>
                {currentUserSession && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-950/20 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sound Ambiance button */}
          <button
            onClick={toggleAmbientSound}
            className={`p-2.5 rounded-full border transition-all duration-300 ${
              audioActive 
                ? "bg-amber-gold/15 border-amber-gold text-amber-gold shadow-lg shadow-amber-gold/10" 
                : "bg-forest-900/20 border-forest-800/40 text-forest-400 hover:border-forest-600 hover:text-earth-sand"
            }`}
            title={audioActive ? "Mute forest hum" : "Activate forest drone"}
          >
            {audioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* About / Guide Button */}
          <button
            onClick={() => {
              setActiveProperty(null);
              setActiveView("about");
            }}
            className={`p-2.5 rounded-full border transition-all duration-300 ${
              activeView === "about" 
                ? "bg-forest-900 border-amber-gold text-amber-gold" 
                : "bg-forest-900/20 border-forest-800/40 text-forest-400 hover:border-forest-600 hover:text-earth-sand"
            }`}
            title="Read Lightspace Vision"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex items-center justify-center z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* ACTIVE SANCTUARY PROPERTY PANEL */}
          {activeProperty ? (
            <PropertyWorkspace
              key="property-workspace"
              property={activeProperty}
              userRoleId={userRole}
              onBack={() => setActiveProperty(null)}
              onUpdateProperty={handleUpdateProperty}
              onSwitchRole={setUserRole}
              onLogSystemEvent={showSystemToast}
              stewardInquiries={stewardInquiries}
              onSendStewardInquiry={handleSendStewardInquiry}
              onAddMessageToStewardInquiry={handleAddMessageToStewardInquiry}
              currentUserName={USER_ROLES.find(r => r.id === userRole)?.name || "Field Ally"}
            />
          ) : activeView === "marketplace" ? (
            /* MARKETPLACE VIEW */
            <Marketplace
              key="marketplace-view"
              listings={marketplaceListings}
              onBack={() => setActiveView("home")}
              onAddListing={handleAddListing}
              supplierInquiries={supplierInquiries}
              onSendSupplierInquiry={handleSendSupplierInquiry}
              onAddMessageToSupplierInquiry={handleAddMessageToSupplierInquiry}
              currentUserName={USER_ROLES.find(r => r.id === userRole)?.name || "Steward Buyer"}
            />
          ) : activeView === "keys" ? (
            /* ONBOARDING & KEYS VIEW */
            <OnboardingAndKeys
              key="keys-view"
              stewardshipKeys={stewardshipKeys}
              onBack={() => setActiveView("home")}
              onUpdateKeys={handleUpdateKeys}
            />
          ) : activeView === "gaia" ? (
            /* GAIA GUIDE VIEW */
            <GaiAGuide
              key="gaia-view"
              onBack={() => setActiveView("home")}
            />
          ) : activeView === "about" ? (
            /* VISION & DOCUMENTATION */
            <motion.div
              key="about-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl bg-forest-950/80 border border-forest-800/40 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative space-y-6"
            >
              <div className="border-b border-forest-800/30 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-earth-sand font-bold">The LIGHTSPACE Vision</h2>
                  <p className="text-xs text-forest-300 font-mono tracking-widest uppercase mt-0.5">
                    Regenerative Real Estate Manifesto
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("home")}
                  className="px-4 py-1.5 rounded-full bg-forest-900 border border-forest-800 text-xs font-mono text-forest-300 hover:text-amber-gold hover:border-amber-gold/30 transition-all"
                >
                  Return
                </button>
              </div>

              <div className="font-serif italic text-earth-sand/90 text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  "The land is not an asset class. The land is a living, breathing ancestor. It is watched by our satellite guardians, nourished by our stewards, and financed by those who believe that ecological restoration and economic abundance are twins of the same soil."
                </p>
                <p>
                  LIGHTSPACE is one platform for the whole regenerative real estate movement. It connects land stewards who nurse soils back to life, professionals who design keyline water trenches, and founders who back carbon-rich forestry.
                </p>
                <p>
                  Through digital Stewardship Keys and automated smart contract rewards, we reward people for verified acts of care. We secure sacred cultural parameters, maintain full audit trails of documents, wires, and permits, and let GaiA - our intelligent spirit AI - translate satellite indicators into clear, humble human guidance.
                </p>
              </div>

              <div className="bg-forest-900/15 border border-forest-800/30 rounded-2xl p-5 space-y-3.5">
                <h4 className="font-sans font-bold text-xs text-amber-gold uppercase tracking-wider">
                  Our Nine Platform Core Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif italic text-earth-sand/80">
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>01. Identity & Onboarding (EN/ES)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>02. Active Property Workspaces</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>03. Guided Permits & Permanent Wires</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>04. Land & Services Marketplace</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>05. Stewardship Keys & Auto-rewards</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>06. Permanent On-Chain Provenance Records</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>07. Unified Data Platform Accounts</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>08. GaiA Intelligence Guide</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-gold flex-shrink-0" />
                    <span>09. Real-time Satellite & Sensor Monitoring</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : activeView === "login" ? (
            /* DEDICATED LIGHTSPACE LOGIN PORTAL */
            <LoginPage
              key="login-view"
              onLoginSuccess={(session) => {
                setCurrentUserSession(session);
                setUserRole(session.role);
                setActiveView("home");
                showSystemToast("AUTHENTICATION", `Welcome to LIGHTSPACE, ${session.name}!`);
              }}
              onContinueAsGuest={() => {
                setActiveView("home");
                showSystemToast("GUEST ACCESS", "Browsing LIGHTSPACE as Guest Observer.");
              }}
              onBack={() => setActiveView("home")}
              initialRole={userRole}
            />
          ) : (
            /* DEFAULT HOME FOREST NAVIGATION STATE */
            <motion.div
              key="default-woods"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]"
            >
              {/* Left Column: Sacred Geometry interactive Nature navigation ecosystem */}
              <div className="lg:col-span-7 flex justify-center items-center">
                <NatureForest
                  properties={properties}
                  onSelectProperty={setActiveProperty}
                  onSelectView={setActiveView}
                  currentProperty={activeProperty}
                />
              </div>

              {/* Right Column: Dynamic Role Perspective Dashboard Panel */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-forest-900/15 border border-forest-800/35 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-5 relative overflow-hidden">
                  {/* Subtle decorative background elements */}
                  <div className="absolute inset-0 bg-grid-white/[0.02] -z-10 pointer-events-none" />
                  
                  {/* Active Perspective Header */}
                  <div className="flex items-start justify-between border-b border-forest-800/30 pb-3">
                    <div>
                      <h3 className="font-serif text-xl text-earth-sand font-bold mt-1">
                        {USER_ROLES.find(r => r.id === userRole)?.name || userRole} Portal
                      </h3>
                    </div>
                    <div className="p-2.5 bg-forest-900/40 border border-forest-800/60 rounded-xl text-amber-gold">
                      {userRole === "owner" && <Settings className="w-4 h-4" />}
                      {userRole === "investor" && <Landmark className="w-4 h-4" />}
                      {userRole === "contributor" && <Clock className="w-4 h-4" />}
                      {userRole === "steward" && <Trees className="w-4 h-4" />}
                      {userRole === "leader" && <Users className="w-4 h-4" />}
                      {userRole === "auditor" && <ShieldCheck className="w-4 h-4" />}
                      {userRole === "admin" && <Sliders className="w-4 h-4" />}
                      {userRole === "public" && <Compass className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Description of Active Perspective */}
                  <p className="text-xs text-forest-300 leading-relaxed italic">
                    {userRole === "owner" && '"As a Project Owner, you hold full custodianship over your sanctuary. You establish covenants, update land telemetry descriptors, and sign permanent impact audits."'}
                    {userRole === "investor" && '"As an Investor or Partner, you deploy USDC capital to fund regenerative expansion. You receive automated smart contract payouts and track real-time CO2 offsets."'}
                    {userRole === "contributor" && '"As a Field Contributor, you execute operations on the ground. Checking off actions signs cryptographic timestamps to boost ecological rewards multipliers."'}
                    {userRole === "steward" && '"As a Land Steward, you nurse soil biodiversity back to life, log daily soil moisture metrics, and claim on-chain rewards for verified acts of care."'}
                    {userRole === "leader" && '"As a Community Leader, you guide local ahupua\'a covenants, direct communal water allocations, and verify regional compliance ledgers."'}
                    {userRole === "auditor" && '"As an Auditor, you review independent satellite telemetry and LIDAR scans to verify carbon density offsets and confirm cryptographic record-keeping."'}
                    {userRole === "admin" && '"As an Administrator, you configure smart-contract parameters, provision new digital Stewardship Keys, and monitor global ecosystem telemetry."'}
                    {userRole === "public" && '"As a member of the Public, you can explore the valley\'s open-ledger telemetry. Apply for a Stewardship Key to participate directly."'}
                  </p>

                  {/* Dynamic Action Panel Content depending on the role */}
                  <div className="space-y-4 pt-2 border-t border-forest-800/25">
                    {userRole === "owner" && (
                      <OwnerHomeDashboard 
                        properties={properties} 
                        onSelectProperty={setActiveProperty} 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "investor" && (
                      <InvestorHomeDashboard 
                        properties={properties} 
                        onSelectProperty={setActiveProperty} 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "contributor" && (
                      <ContributorHomeDashboard 
                        properties={properties} 
                        onSelectProperty={setActiveProperty} 
                        onLogSystemEvent={showSystemToast} 
                        onOpenContactSteward={setContactingPropertySteward}
                      />
                    )}
                    {userRole === "steward" && (
                      <StewardHomeDashboard 
                        properties={properties} 
                        onSelectProperty={setActiveProperty} 
                        onSelectView={setActiveView} 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "leader" && (
                      <LeaderHomeDashboard 
                        properties={properties} 
                        onSelectProperty={setActiveProperty} 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "auditor" && (
                      <AuditorHomeDashboard 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "admin" && (
                      <AdminHomeDashboard 
                        onLogSystemEvent={showSystemToast} 
                      />
                    )}
                    {userRole === "public" && (
                      <PublicHomeDashboard 
                        properties={properties}
                        onSelectProperty={setActiveProperty}
                        onSelectView={setActiveView} 
                        onOpenContactSteward={setContactingPropertySteward}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-forest-900/40 z-10 gap-3">
        <p className="text-[10px] font-mono text-forest-500 uppercase tracking-wider">
          © 2026 LIGHTSPACE — IN HARMONY WITH GAIA & ALOHA
        </p>
        
        {/* Navigation Quick Return Shortcuts */}
        {(activeProperty || activeView !== "home") && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setActiveProperty(null);
              setActiveView("home");
            }}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-forest-900 border border-amber-gold/30 text-[10px] font-mono text-amber-gold uppercase tracking-widest hover:bg-forest-800 hover:border-amber-gold hover:shadow-lg hover:shadow-amber-gold/5 transition-all"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Return to the Woods</span>
          </motion.button>
        )}

        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-forest-500">
          <span>Stewardship verified</span>
          <Heart className="w-3 h-3 text-amber-gold animate-pulse inline" />
          <span>on-chain</span>
        </div>
      </footer>

      {/* Contact Steward Modal triggered from Dashboard/Home */}
      {contactingPropertySteward && (
        <ContactStewardModal
          property={contactingPropertySteward}
          isOpen={true}
          onClose={() => setContactingPropertySteward(null)}
          inquiries={stewardInquiries}
          onSendInquiry={handleSendStewardInquiry}
          onAddMessageToInquiry={handleAddMessageToStewardInquiry}
          currentUserName={USER_ROLES.find(r => r.id === userRole)?.name || "Field Ally"}
          currentUserRole={userRole}
        />
      )}

      {/* Global Ledger System Events Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-forest-950 border border-amber-gold/40 text-earth-sand rounded-2xl p-4 shadow-2xl max-w-sm z-50 flex items-start space-x-3 backdrop-blur-xl"
          >
            <div className="p-2 bg-forest-900 border border-amber-gold/30 rounded-lg text-amber-gold flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-amber-gold uppercase block tracking-widest font-bold">
                {toast.category} Recorded
              </span>
              <p className="text-xs font-serif italic text-earth-sand/90 mt-1 leading-relaxed">
                "{toast.message}"
              </p>
              <span className="text-[8px] font-mono text-forest-500 block mt-2 uppercase">
                Cryptographic timestamp sealed
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
