import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles,
  Key, Wallet, Users, CheckCircle2, ChevronRight, Compass,
  Trees, Server, Landmark, RefreshCw, AlertCircle
} from "lucide-react";
import { EtherealWind } from "./EtherealWind";
import { FlowerOfLife } from "./FlowerOfLife";

export interface UserSession {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  propertyId?: string;
  propertyName?: string;
  stewardKeyTier?: string;
  isLoggedIn: boolean;
}

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onContinueAsGuest?: () => void;
  onBack?: () => void;
  initialRole?: string;
}

const DEMO_PERSONAS = [
  {
    role: "steward",
    roleLabel: "Land Steward",
    name: "Kai Kealoha",
    email: "kai@haleakala-sanctuary.org",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    propertyId: "prop-maui",
    propertyName: "Haleakalā Sanctuary",
    location: "Maui, Hawaiʻi",
    stewardKeyTier: "Emerald Root",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
    icon: Trees,
    desc: "Agroforestry practitioner reviving native koa ridges"
  },
  {
    role: "steward",
    roleLabel: "Data Center Steward",
    name: "Jordan Reed",
    email: "jordan@cleandata.tx",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    propertyId: "prop-texas",
    propertyName: "Texas Clean Data Center Campus",
    location: "Taylor, Texas",
    stewardKeyTier: "Golden Leaf",
    badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30",
    icon: Server,
    desc: "Zero-water immersion cooling & 45MW microgrid compute lead"
  },
  {
    role: "investor",
    roleLabel: "Impact Partner",
    name: "Marcus Thorne",
    email: "m.thorne@biocorridors.fund",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    propertyName: "BioCorridors Fund",
    location: "Zurich / Austin",
    badgeColor: "border-amber-500/40 text-amber-gold bg-amber-950/30",
    icon: Landmark,
    desc: "Deploying catalytic capital to regenerative land trusts"
  },
  {
    role: "contributor",
    roleLabel: "Regenerative Supplier",
    name: "Elena Goya",
    email: "elena@regenescape.labs",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    propertyName: "RegeneScape Labs",
    location: "Pyrenees, Spain",
    badgeColor: "border-rose-500/40 text-rose-300 bg-rose-950/30",
    icon: Sparkles,
    desc: "Keyline hydrology scanning & drone topography mapping"
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  onBack,
  initialRole = "steward",
}) => {
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("kai@haleakala-sanctuary.org");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Registration state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regSubmitted, setRegSubmitted] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your steward email or sanctuary ID.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage("Verifying cryptographic credentials with Gaia consensus...");

    setTimeout(() => {
      // Find matching persona or synthesize session
      const matchedPersona = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      const session: UserSession = matchedPersona 
        ? {
            name: matchedPersona.name,
            email: matchedPersona.email,
            role: matchedPersona.role,
            avatar: matchedPersona.avatar,
            propertyId: matchedPersona.propertyId,
            propertyName: matchedPersona.propertyName,
            stewardKeyTier: matchedPersona.stewardKeyTier,
            isLoggedIn: true
          }
        : {
            name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase()),
            email: email,
            role: selectedRole,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            propertyName: "Sanctuary Common",
            stewardKeyTier: "Golden Leaf",
            isLoggedIn: true
          };

      setIsLoading(false);
      onLoginSuccess(session);
    }, 1100);
  };

  const handlePersonaSelect = (persona: typeof DEMO_PERSONAS[0]) => {
    setEmail(persona.email);
    setPassword("••••••••••••");
    setSelectedRole(persona.role);
    setIsLoading(true);
    setLoadingMessage(`Logging in as ${persona.name} (${persona.roleLabel})...`);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: persona.name,
        email: persona.email,
        role: persona.role,
        avatar: persona.avatar,
        propertyId: persona.propertyId,
        propertyName: persona.propertyName,
        stewardKeyTier: persona.stewardKeyTier,
        isLoggedIn: true
      });
    }, 800);
  };

  const handleWeb3Connect = () => {
    setIsLoading(true);
    setLoadingMessage("Detecting Web3 Stewardship Key & Hardware Escrow...");
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: "Steward 0x71a...94F",
        email: "0x71a82b49fe1c89@steward.eth",
        role: "steward",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        propertyId: "prop-maui",
        propertyName: "Haleakalā Sanctuary",
        stewardKeyTier: "Emerald Root",
        isLoggedIn: true
      });
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      setError("Please fill in your name and email.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage("Transmitting application to GaiA Community Council...");
    setTimeout(() => {
      setIsLoading(false);
      setRegSubmitted(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-[92vh] w-full flex items-center justify-center px-4 py-8 overflow-hidden select-none">
      {/* Dynamic Background Wind & Particles */}
      <EtherealWind />

      {/* Radiant ambient glow blobs behind the card */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-xl bg-forest-950/85 backdrop-blur-2xl border border-forest-800/60 rounded-3xl p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] z-20 overflow-hidden"
      >
        {/* Subtle decorative Sacred Geometry watermark in card header */}
        <div className="absolute -top-24 -right-24 opacity-15 pointer-events-none">
          <FlowerOfLife size={240} glowColor="rgba(244,143,177,0.3)" />
        </div>

        {/* Back navigation if available */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-forest-400 hover:text-earth-sand text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>
        )}

        {/* BRANDING HEADER: LOGO & NAME */}
        <div className="flex flex-col items-center text-center mt-2 mb-8">
          {/* Logo with pulsating aura */}
          <div className="relative mb-3 group">
            <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-xl scale-125 animate-pulse" />
            <motion.div
              animate={{ 
                scale: [1, 1.03, 1],
                filter: [
                  "drop-shadow(0 0 16px rgba(244,143,177,0.45))",
                  "drop-shadow(0 0 24px rgba(244,143,177,0.75))",
                  "drop-shadow(0 0 16px rgba(244,143,177,0.45))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center cursor-pointer"
            >
              <img
                src="/lightspace-logo.png"
                alt="LIGHTSPACE Official Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>

          {/* Title: lightspace */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.22em] text-earth-sand uppercase">
            LIGHTSPACE
          </h1>

          <div className="flex items-center space-x-2 mt-1.5">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-amber-gold/50" />
            <p className="text-[10px] sm:text-xs font-mono text-forest-300 uppercase tracking-widest font-medium">
              The Regenerative Real Estate Ecosystem
            </p>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-gold/50" />
          </div>

          <p className="text-[11px] font-serif italic text-earth-sand/70 max-w-sm mt-2 leading-relaxed">
            Welcome to the sovereign portal connecting land stewards, clean infrastructure, and regenerative capital.
          </p>
        </div>

        {/* NAVIGATION TABS: Sign In vs Request Access */}
        <div className="flex border-b border-forest-800/60 mb-6 font-mono text-xs">
          <button
            onClick={() => { setActiveTab("signin"); setError(null); }}
            className={`flex-1 pb-3 text-center transition-all border-b-2 font-semibold ${
              activeTab === "signin"
                ? "border-amber-gold text-amber-gold"
                : "border-transparent text-forest-400 hover:text-forest-200"
            }`}
          >
            Steward Sign In
          </button>
          <button
            onClick={() => { setActiveTab("register"); setError(null); }}
            className={`flex-1 pb-3 text-center transition-all border-b-2 font-semibold ${
              activeTab === "register"
                ? "border-amber-gold text-amber-gold"
                : "border-forest-400 hover:text-forest-200"
            }`}
          >
            Request Access
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center space-x-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB CONTENT */}
        {activeTab === "signin" ? (
          <div>
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email / Sanctuary ID */}
              <div>
                <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1.5">
                  Steward Email or Sanctuary ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="steward@lightspace.earth"
                    className="w-full pl-10 pr-4 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-sm font-mono text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 focus:bg-forest-900/60 transition-all"
                  />
                </div>
              </div>

              {/* Passphrase */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider">
                    Secret Passphrase / Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setError("Enter any demo passphrase or select a persona below to log in instantly.")}
                    className="text-[10px] font-mono text-amber-gold/80 hover:text-amber-gold transition-colors"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your private passkey"
                    className="w-full pl-10 pr-10 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-sm font-mono text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 focus:bg-forest-900/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-forest-500 hover:text-forest-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs font-mono text-forest-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-forest-700 bg-forest-900/60 text-amber-gold focus:ring-0 cursor-pointer"
                  />
                  <span>Keep session cached on this node</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-700/80 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-forest-950 font-serif font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-900/20 hover:shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-forest-950" />
                    <span>{loadingMessage || "Authenticating..."}</span>
                  </>
                ) : (
                  <>
                    <span>Enter LIGHTSPACE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* OR Web3 / Hardware Vault Access */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-forest-800/60" />
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
                <span className="bg-forest-950 px-3 text-forest-400">
                  Or Sovereign Cryptographic Key
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWeb3Connect}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-forest-900/40 hover:bg-forest-900/70 border border-forest-700/50 hover:border-amber-gold/40 text-earth-sand rounded-xl font-mono text-xs flex items-center justify-center space-x-2.5 transition-all group cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-amber-gold group-hover:scale-110 transition-transform" />
              <span>Connect Stewardship Vault Key (Web3 / DID)</span>
            </button>

            {/* FAST ACCESS / DEMO PERSONAS */}
            <div className="mt-8 pt-6 border-t border-forest-800/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-forest-400 uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-gold" />
                  <span>One-Click Demonstration Personas</span>
                </span>
                <span className="text-[9px] font-mono text-forest-500">Fast sign in</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_PERSONAS.map((persona) => {
                  const Icon = persona.icon;
                  return (
                    <button
                      key={persona.email}
                      type="button"
                      onClick={() => handlePersonaSelect(persona)}
                      className="p-2.5 text-left rounded-xl bg-forest-900/20 hover:bg-forest-900/60 border border-forest-800/50 hover:border-amber-gold/40 transition-all flex items-start space-x-2.5 group cursor-pointer"
                    >
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-9 h-9 rounded-full object-cover border border-forest-700/60 flex-shrink-0 group-hover:border-amber-gold/60 transition-colors"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif font-bold text-earth-sand truncate group-hover:text-amber-gold transition-colors">
                            {persona.name}
                          </span>
                          <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${persona.badgeColor}`}>
                            {persona.roleLabel}
                          </span>
                        </div>
                        <p className="text-[9.5px] font-mono text-forest-400 truncate mt-0.5">
                          {persona.propertyName || persona.location}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* REGISTRATION / REQUEST ACCESS TAB */
          <div>
            {!regSubmitted ? (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3.5 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-sm font-mono text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. maya@earthtrust.org"
                    className="w-full px-3.5 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-sm font-mono text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1">
                    Sanctuary, Farm or Organization
                  </label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="e.g. Cascades Forest Sanctuary"
                    className="w-full px-3.5 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-sm font-mono text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1">
                    Role in the Ecosystem
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-forest-900/40 border border-forest-700/50 rounded-xl text-xs font-mono text-earth-sand focus:outline-none focus:border-amber-gold/70 transition-all"
                  >
                    <option value="steward">Land Steward (Direct Soil / Canopy Care)</option>
                    <option value="owner">Sanctuary Owner / Property Guardian</option>
                    <option value="investor">Impact Investor / Fund Partner</option>
                    <option value="contributor">Contributor / Eco-Supplier</option>
                    <option value="leader">Community Leader / Elder</option>
                    <option value="auditor">Ecological Auditor / Scientist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-forest-300 uppercase tracking-wider mb-1">
                    Stewardship Intent / Note to GaiA
                  </label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    placeholder="Tell us about the soil, trees, or ecological mandate you wish to anchor..."
                    className="w-full px-3.5 py-2 bg-forest-900/40 border border-forest-700/50 rounded-xl text-xs font-serif italic text-earth-sand placeholder:text-forest-600 focus:outline-none focus:border-amber-gold/70 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-earth-sand font-serif font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application to DAO Commons</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-earth-sand">
                  Stewardship Request Received
                </h3>
                <p className="text-xs font-serif italic text-earth-sand/80 max-w-sm mx-auto leading-relaxed">
                  Aloha {regName || "friend"}. Your application has been logged on the GaiA peer ledger. A community steward will review your sanctuary coordinates shortly.
                </p>
                <button
                  onClick={() => {
                    setRegSubmitted(false);
                    setActiveTab("signin");
                  }}
                  className="px-5 py-2 bg-forest-900 border border-forest-700 hover:border-amber-gold text-xs font-mono text-earth-sand rounded-xl transition-all"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* GUEST EXPLORATION OPTION & SECURITY FOOTER */}
        <div className="mt-6 pt-5 border-t border-forest-800/40 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-forest-400 gap-3">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-gold" />
            <span>Encrypted • Zero-Knowledge Telemetry</span>
          </div>

          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-earth-sand hover:text-amber-gold transition-colors underline underline-offset-4 decoration-forest-700 cursor-pointer"
            >
              Continue as Guest Observer →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
