import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Landmark, Clock, Trees, Users, ShieldCheck, Sliders, Compass,
  ArrowUpRight, BarChart2, CheckCircle, Plus, Sparkles, Database,
  CheckSquare, Square, ChevronRight, Play, AlertCircle, FileText, Settings2,
  MessageSquare
} from "lucide-react";
import { LandProperty } from "../types";

interface DashboardProps {
  properties: LandProperty[];
  onSelectProperty: (property: LandProperty) => void;
  onLogSystemEvent: (category: string, message: string) => void;
  onOpenContactSteward?: (property: LandProperty) => void;
}

/* 1. PROJECT OWNER DASHBOARD */
export const OwnerHomeDashboard: React.FC<DashboardProps> = ({
  properties,
  onSelectProperty,
  onLogSystemEvent,
}) => {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "");
  const [reportText, setReportText] = useState("");
  const [signing, setSigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const handleSignReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || !activeProp) return;
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSuccessMsg(true);
      onLogSystemEvent("COVENANT SIGN", `Owner signed new ecological report for ${activeProp.name}`);
      setReportText("");
      setTimeout(() => setSuccessMsg(false), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Property Selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-mono text-forest-400 uppercase block tracking-wider">
          Select Sanctuary to Manage
        </label>
        <select
          value={selectedPropId}
          onChange={(e) => setSelectedPropId(e.target.value)}
          className="w-full bg-forest-950/80 border border-forest-800/65 rounded-xl px-3 py-1.5 text-xs font-serif text-earth-sand focus:outline-none"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Active Covenant Status */}
      {activeProp && (
        <div className="bg-forest-900/20 border border-forest-800/40 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-forest-400 block uppercase">Data Covenant</span>
            <span className="text-xs font-serif italic text-earth-sand">{activeProp.dataSharingLevel || "public"}</span>
          </div>
          <button
            onClick={() => onSelectProperty(activeProp)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/60 text-[10px] font-mono text-emerald-900 uppercase font-bold transition-all"
          >
            <Settings2 className="w-3 h-3" />
            <span>Manage Rules</span>
          </button>
        </div>
      )}

      {/* Interactive Quick Report Signer */}
      <form onSubmit={handleSignReport} className="space-y-2">
        <label className="text-[9px] font-mono text-forest-400 uppercase block tracking-wider">
          Sign Permanent Ecological Report
        </label>
        <div className="relative">
          <input
            type="text"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe soil, water, or canopy audit parameters..."
            className="w-full bg-forest-950 border border-forest-800/70 rounded-xl pl-3 pr-16 py-2 text-xs font-serif text-earth-sand placeholder-forest-500/80 focus:outline-none focus:border-amber-gold/30"
            required
          />
          <button
            type="submit"
            disabled={signing}
            className="absolute right-1.5 top-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-50 font-mono text-[9px] uppercase px-2.5 py-1 rounded-lg transition-all font-bold"
          >
            {signing ? "Signing..." : "Sign"}
          </button>
        </div>
        <AnimatePresence>
          {successMsg && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-mono text-emerald-400 font-semibold"
            >
              ✓ Report permanently signed and sealed on-chain!
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Direct Workspace link */}
      {activeProp && (
        <button
          onClick={() => onSelectProperty(activeProp)}
          className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-50 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-1 border border-emerald-700/40 shadow-lg shadow-emerald-950/20"
        >
          <span>Open {activeProp.name} Workspace</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};


/* 2. INVESTOR DASHBOARD */
export const InvestorHomeDashboard: React.FC<DashboardProps> = ({
  properties,
  onSelectProperty,
  onLogSystemEvent,
}) => {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "");
  const [investAmount, setInvestAmount] = useState("45000");
  const [years, setYears] = useState(15);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const carbonYield = (years * 12 * (parseFloat(investAmount) / 10000)) || 0;
  const usdcPayout = (years * 850 * (parseFloat(investAmount) / 10000)) || 0;

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onLogSystemEvent("WIRE INITIATED", `Authorized ${parseFloat(investAmount).toLocaleString()} USDC capital wire for ${activeProp.name}`);
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Property Selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-mono text-forest-400 uppercase block tracking-wider">
          Target Land Sanctuary
        </label>
        <select
          value={selectedPropId}
          onChange={(e) => setSelectedPropId(e.target.value)}
          className="w-full bg-forest-950/80 border border-forest-800/65 rounded-xl px-3 py-1.5 text-xs font-serif text-earth-sand focus:outline-none"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Capital Input and Yield Forecasting */}
      <form onSubmit={handleFund} className="space-y-3.5 bg-forest-950/40 p-3 border border-forest-800/20 rounded-2xl">
        <div className="space-y-1">
          <label className="text-[9px] font-mono text-forest-400 uppercase block">USDC Deployment Amount</label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            className="w-full bg-forest-950 border border-forest-800/80 rounded-xl px-3 py-1.5 text-xs font-mono text-earth-sand focus:outline-none"
            required
            min="1000"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] font-mono text-forest-400">
            <span>Projection Window: {years} Yrs</span>
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <input
            type="range"
            min="2"
            max="40"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Real-time yield predictions */}
        <div className="grid grid-cols-2 gap-2 bg-forest-950 p-2.5 rounded-lg border border-forest-800/30 text-center font-mono">
          <div>
            <span className="text-[8px] text-forest-500 uppercase block">Est. Sequestration</span>
            <span className="text-xs text-emerald-400 font-bold">{carbonYield.toFixed(0)} tons</span>
          </div>
          <div>
            <span className="text-[8px] text-forest-500 uppercase block">Projected USDC Returns</span>
            <span className="text-xs text-amber-gold font-bold">${usdcPayout.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-purple-900 hover:bg-purple-800 text-purple-50 font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center space-x-1.5"
        >
          {loading ? (
            <span>Securing transfer routing...</span>
          ) : (
            <>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Deploy Capital Wire</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-mono text-emerald-400 text-center bg-emerald-950/20 p-2 border border-emerald-500/25 rounded-lg"
          >
            ✓ Wire authorized! Expected yield calculations registered.
          </motion.div>
        )}
      </AnimatePresence>

      {activeProp && (
        <button
          onClick={() => onSelectProperty(activeProp)}
          className="w-full py-2 bg-forest-300 hover:bg-forest-400 text-forest-950 hover:text-amber-gold rounded-xl font-mono text-xs font-bold transition-all border border-forest-400/30"
        >
          Inspect Deeds & Wires for {activeProp.name}
        </button>
      )}
    </div>
  );
};


/* 3. CONTRIBUTOR DASHBOARD */
export const ContributorHomeDashboard: React.FC<DashboardProps> = ({
  properties,
  onSelectProperty,
  onLogSystemEvent,
  onOpenContactSteward
}) => {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const tasks = [
    { id: "c1", label: "Check topsoil hydration multi-depth probe" },
    { id: "c2", label: "Inspect gravity-fed bamboo bio-swale catchment" },
    { id: "c3", label: "Review sentinel-5 satellite index alignment" },
    { id: "c4", label: "Log native vetiver ground cover density" },
  ];

  const handleCheck = (taskId: string, label: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [taskId]: checked }));
    if (checked && activeProp) {
      onLogSystemEvent("FIELD LOG", `Contributor logged task: "${label}" on ${activeProp.name}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Property Selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-mono text-forest-400 uppercase block tracking-wider">
          Active Working Field
        </label>
        <select
          value={selectedPropId}
          onChange={(e) => {
            setSelectedPropId(e.target.value);
            setCheckedItems({});
          }}
          className="w-full bg-forest-950/80 border border-forest-800/65 rounded-xl px-3 py-1.5 text-xs font-serif text-earth-sand focus:outline-none"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Field Checklist */}
      <div className="space-y-2.5 bg-forest-950/40 p-3.5 border border-forest-800/20 rounded-2xl">
        <span className="text-[9px] font-mono text-teal-400 block uppercase font-bold tracking-widest mb-1">
          Field Operations Checklist
        </span>
        <div className="space-y-2">
          {tasks.map(item => (
            <label key={item.id} className="flex items-start space-x-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!checkedItems[item.id]}
                onChange={(e) => handleCheck(item.id, item.label, e.target.checked)}
                className="mt-0.5 rounded border-forest-800 bg-forest-950 text-teal-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
              />
              <span className={`text-[11px] font-mono leading-relaxed transition-colors ${
                checkedItems[item.id] ? "text-forest-500 line-through" : "text-earth-sand/90 group-hover:text-earth-sand"
              }`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-[9px] text-forest-400 italic leading-relaxed text-center">
        "Checklist completion generates cryptographic activity payloads in real-time."
      </p>

      {activeProp && (
        <div className="flex gap-2">
          {onOpenContactSteward && (
            <button
              onClick={() => onOpenContactSteward(activeProp)}
              className="py-2.5 px-3 bg-forest-900/60 hover:bg-forest-800 text-amber-gold border border-forest-800 hover:border-amber-gold/50 rounded-xl font-mono text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow"
              title={`Message ${activeProp.steward}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Steward</span>
            </button>
          )}
          <button
            onClick={() => onSelectProperty(activeProp)}
            className="flex-1 py-2.5 bg-teal-900 hover:bg-teal-800 text-teal-50 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-1 border border-teal-700/40"
          >
            <span>Open Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};


/* 4. STEWARD DASHBOARD */
interface StewardDashboardProps extends DashboardProps {
  onSelectView: (view: "home" | "marketplace" | "keys" | "gaia" | "about" | "login") => void;
}

export const StewardHomeDashboard: React.FC<StewardDashboardProps> = ({
  properties,
  onSelectProperty,
  onSelectView,
  onLogSystemEvent,
}) => {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "");
  const [actText, setActText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const handleSaveActOfCare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actText.trim() || !activeProp) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onLogSystemEvent("STEWARD LOG", `Recorded act of care on-chain: "${actText.substring(0, 30)}..."`);
      setActText("");
      setTimeout(() => setSaved(false), 3000);
    }, 1100);
  };

  return (
    <div className="space-y-4">
      {/* Land Telemetry Stats Overview */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-forest-950 p-2 rounded-xl border border-forest-800/30">
          <span className="text-[8px] text-forest-500 uppercase block font-mono">Soil Avg</span>
          <span className="text-xs font-mono text-emerald-400 font-bold">78%</span>
        </div>
        <div className="bg-forest-950 p-2 rounded-xl border border-forest-800/30">
          <span className="text-[8px] text-forest-500 uppercase block font-mono">Hydrology</span>
          <span className="text-xs font-mono text-sky-400 font-bold">84%</span>
        </div>
        <div className="bg-forest-950 p-2 rounded-xl border border-forest-800/30">
          <span className="text-[8px] text-forest-500 uppercase block font-mono">Active Keys</span>
          <span className="text-xs font-mono text-amber-gold font-bold">3</span>
        </div>
      </div>

      {/* Quick Act of Care Logger */}
      <form onSubmit={handleSaveActOfCare} className="space-y-2 bg-forest-950/40 p-3 border border-forest-800/20 rounded-2xl">
        <label className="text-[9px] font-mono text-forest-400 uppercase block tracking-wider">
          Directly Record Act of Care (Steward Log)
        </label>
        <div className="space-y-1.5">
          <select
            value={selectedPropId}
            onChange={(e) => setSelectedPropId(e.target.value)}
            className="w-full bg-forest-950 border border-forest-800 rounded-lg px-2.5 py-1 text-[11px] font-serif text-earth-sand focus:outline-none"
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <textarea
            value={actText}
            onChange={(e) => setActText(e.target.value)}
            placeholder="e.g., Planted 8 native hibiscus trees to strengthen the creek soil..."
            rows={2}
            className="w-full bg-forest-950 border border-forest-800 rounded-xl px-2.5 py-1.5 text-xs font-serif text-earth-sand focus:outline-none placeholder-forest-600/80"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-amber-gold hover:bg-[#c69362] text-forest-300 font-mono text-[10px] font-bold uppercase rounded-xl transition-all"
        >
          {saving ? "Signing on Ledger..." : "Seal Steward Entry"}
        </button>
        {saved && (
          <span className="text-[9px] font-mono text-emerald-400 text-center block mt-1">
            ✓ Entry verified and rewards points minted!
          </span>
        )}
      </form>

      {/* Shortcut Links */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectView("keys")}
          className="py-2 bg-forest-300 hover:bg-forest-400 border border-forest-400/20 text-forest-950 hover:text-amber-gold text-[10px] font-mono uppercase font-bold rounded-xl transition-all"
        >
          Steward Keys Portal
        </button>
        {activeProp && (
          <button
            onClick={() => onSelectProperty(activeProp)}
            className="py-2 bg-forest-300 hover:bg-forest-400 border border-forest-400/20 text-forest-950 hover:text-amber-gold text-[10px] font-mono uppercase font-bold rounded-xl transition-all"
          >
            Open Active Journal
          </button>
        )}
      </div>
    </div>
  );
};


/* 5. COMMUNITY LEADER DASHBOARD */
export const LeaderHomeDashboard: React.FC<DashboardProps> = ({
  properties,
  onSelectProperty,
  onLogSystemEvent,
}) => {
  const [vote, setVote] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  const handleVote = (choice: string) => {
    setVote(choice);
    setVoted(true);
    onLogSystemEvent("COMMUNITY GOVERNANCE", `Leader voted "${choice}" on regional water allocation consensus`);
  };

  return (
    <div className="space-y-4">
      {/* Governance Proposal Voting Block */}
      <div className="bg-forest-950/40 p-3.5 border border-forest-800/20 rounded-2xl space-y-3">
        <div>
          <span className="text-[8px] font-mono text-amber-gold uppercase block tracking-widest font-bold">
            Consensus Ballot: Proposal #049
          </span>
          <h4 className="text-xs font-serif text-earth-sand mt-0.5 leading-normal">
            Should we allocate 35% of carbon smart contract rewards directly to local bamboo gravity-water filtration pipes?
          </h4>
        </div>

        {!voted ? (
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] font-bold">
            <button
              onClick={() => handleVote("YES")}
              className="py-1.5 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 text-emerald-900 rounded-lg transition-all"
            >
              YES (Support)
            </button>
            <button
              onClick={() => handleVote("NEUTRAL")}
              className="py-1.5 bg-forest-800 hover:bg-forest-700 border border-forest-600/40 text-forest-300 rounded-lg transition-all"
            >
              NEUTRAL
            </button>
            <button
              onClick={() => handleVote("NO")}
              className="py-1.5 bg-rose-100 hover:bg-rose-200 border border-rose-300/80 text-rose-900 rounded-lg transition-all"
            >
              NO (Oppose)
            </button>
          </div>
        ) : (
          <div className="bg-forest-950 p-2 rounded-lg border border-forest-800/40 text-center font-mono">
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Vote successfully cast: {vote}</span>
            <div className="flex justify-between text-[8px] text-forest-500 uppercase mt-1 px-1.5">
              <span>YES: 84%</span>
              <span>NEUTRAL: 10%</span>
              <span>NO: 6%</span>
            </div>
          </div>
        )}
      </div>

      {/* Community Guardians Monitor */}
      <div className="bg-forest-950/20 border border-forest-800/40 rounded-xl p-3 space-y-2">
        <span className="text-[9px] font-mono text-forest-400 block uppercase">Ahupua'a Resource Allocation</span>
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex justify-between">
            <span className="text-forest-400">Aragon Canopy</span>
            <span className="text-earth-sand">8,200 gal/day water allocated</span>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-400">Haleakala Sanctuary</span>
            <span className="text-earth-sand">12,500 gal/day water allocated</span>
          </div>
        </div>
      </div>

      {properties[0] && (
        <button
          onClick={() => onSelectProperty(properties[0])}
          className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-50 rounded-xl font-mono text-xs font-bold border border-emerald-700/40"
        >
          Review Covenant Compliance Ledgers
        </button>
      )}
    </div>
  );
};


/* 6. AUDITOR DASHBOARD */
export const AuditorHomeDashboard: React.FC<{ onLogSystemEvent: (category: string, message: string) => void }> = ({
  onLogSystemEvent,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const triggerScan = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      onLogSystemEvent("TELEMETRY AUDIT", "Run satellite & LIDAR carbon check across all properties - All certified!");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Auditing records table */}
      <div className="bg-forest-950/60 border border-forest-800/40 rounded-xl p-3 space-y-2 font-mono text-[10px]">
        <div className="flex justify-between border-b border-forest-800/30 pb-1 font-bold text-forest-400 uppercase">
          <span>Telemetry Record</span>
          <span>IPFS Hash</span>
          <span>Status</span>
        </div>
        <div className="flex justify-between">
          <span className="text-earth-sand">Carbon Index Block</span>
          <span className="text-forest-500">QmX8...y9Z</span>
          <span className="text-emerald-400">Certified</span>
        </div>
        <div className="flex justify-between">
          <span className="text-earth-sand">Biomass Volume</span>
          <span className="text-forest-500">QmR4...t7U</span>
          <span className="text-emerald-400">Certified</span>
        </div>
        <div className="flex justify-between">
          <span className="text-earth-sand">Outflow Hydrology</span>
          <span className="text-forest-500">QmW2...x3P</span>
          <span className="text-emerald-400">Certified</span>
        </div>
      </div>

      {/* Interactive Telemetry Verifier */}
      <button
        onClick={triggerScan}
        disabled={scanning}
        className="w-full py-2.5 bg-amber-gold hover:bg-[#c69362] disabled:bg-forest-800 text-forest-300 disabled:text-forest-400 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center space-x-1.5 border border-forest-400/20"
      >
        {scanning ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-dashed border-forest-300 rounded-full animate-spin" />
            <span>Scanning Satellite Nodes...</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5" />
            <span>Run Dynamic Telemetry Audit Scan</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {scanned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-emerald-950/20 border border-emerald-500/35 rounded-xl text-center space-y-1 animate-pulse"
          >
            <span className="text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">
              ✦ Telemetry Authenticated ✦
            </span>
            <p className="text-[9px] font-mono text-forest-300">
              Sentinel Satellite Block & LIDAR density indices verified on-ledger. Carbon offsets offset correctly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/* 7. ADMIN DASHBOARD */
export const AdminHomeDashboard: React.FC<{ onLogSystemEvent: (category: string, message: string) => void }> = ({
  onLogSystemEvent,
}) => {
  const [multiplier, setMultiplier] = useState(2.4);
  const [carbonPrice, setCarbonPrice] = useState(45);
  const [saved, setSaved] = useState(false);

  const rewardRate = multiplier * carbonPrice;

  const handleSave = () => {
    setSaved(true);
    onLogSystemEvent("ADMIN CONFIG", `Updated global contract settings: Multiplier ${multiplier}x, CO2 Base $${carbonPrice}/t`);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Smart Contract parameters adjust */}
      <div className="bg-forest-950/40 p-3 border border-forest-800/20 rounded-2xl space-y-3">
        <span className="text-[9px] font-mono text-forest-400 block uppercase font-bold tracking-widest">
          Tokenomic Reward Rates
        </span>
        
        {/* Multiplier Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-forest-400">
            <span>Base Rewards Multiplier</span>
            <span className="text-amber-gold font-bold">{multiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="w-full accent-amber-gold cursor-pointer"
          />
        </div>

        {/* Carbon Price Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-forest-400">
            <span>CO2 Base Valuation</span>
            <span className="text-amber-gold font-bold">${carbonPrice}/ton</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={carbonPrice}
            onChange={(e) => setCarbonPrice(parseInt(e.target.value))}
            className="w-full accent-amber-gold cursor-pointer"
          />
        </div>

        {/* Result Rate Calculation */}
        <div className="bg-forest-950 p-2.5 rounded-xl border border-forest-800/30 text-center font-mono">
          <span className="text-[8px] text-forest-500 uppercase block">Calculated Smart Reward Rate</span>
          <span className="text-sm text-emerald-400 font-bold">${rewardRate.toFixed(2)} USDC / unit</span>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2 bg-amber-gold hover:bg-[#c69362] text-forest-300 font-mono text-[10px] font-bold uppercase rounded-xl transition-all"
        >
          Re-anchor Smart Contract Rates
        </button>

        {saved && (
          <span className="text-[9px] font-mono text-emerald-400 text-center block mt-1">
            ✓ Smart contract parameters re-anchored live on blockchain.
          </span>
        )}
      </div>
    </div>
  );
};


/* 8. PUBLIC DASHBOARD */
export const PublicHomeDashboard: React.FC<{ 
  properties?: LandProperty[];
  onSelectProperty?: (property: LandProperty) => void;
  onSelectView: (view: "home" | "marketplace" | "keys" | "gaia" | "about" | "login") => void;
  onOpenContactSteward?: (property: LandProperty) => void;
}> = ({
  properties = [],
  onSelectProperty,
  onSelectView,
  onOpenContactSteward
}) => {
  const firstProp = properties[0];
  return (
    <div className="space-y-4">
      <div className="bg-forest-950/40 p-3.5 border border-forest-800/20 rounded-2xl space-y-2">
        <span className="text-[8px] font-mono text-forest-400 block uppercase tracking-widest font-bold">
          Open Telemetry Protocol
        </span>
        <p className="text-[11px] text-forest-300 font-serif leading-relaxed">
          LIGHTSPACE is built on an open database protocol. Satellite indicators, ecological records, and reward ledgers are viewable by everyone, verifying trust in planetary regeneration.
        </p>
      </div>

      {firstProp && onOpenContactSteward && (
        <button
          onClick={() => onOpenContactSteward(firstProp)}
          className="w-full py-2.5 bg-forest-900/60 hover:bg-forest-900 border border-amber-gold/40 text-amber-gold font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Reach Out to Land Stewards</span>
        </button>
      )}

      <button
        onClick={() => onSelectView("keys")}
        className="w-full py-2.5 bg-forest-300 hover:bg-forest-400 text-forest-950 hover:text-amber-gold font-mono text-xs font-bold border border-forest-400/20 rounded-xl transition-all flex items-center justify-center space-x-1"
      >
        <span>Apply for Stewardship Key</span>
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </button>
    </div>
  );
};
