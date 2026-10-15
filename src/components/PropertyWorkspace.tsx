import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Sliders, Database, FileText, Landmark, BookOpen, 
  CheckCircle, Plus, Sparkles, Activity, ShieldCheck, CheckSquare, Square,
  Lock, Unlock, ShieldAlert, Users, ArrowUpRight, BarChart2, Settings, Upload, Clock,
  MessageSquare, Send, Trees
} from "lucide-react";
import { LandProperty, JournalEntry, Task, PropertyDocument, WireTransaction, StewardInquiry, InquiryMessage } from "../types";
import { ContactStewardModal } from "./ContactStewardModal";

interface PropertyWorkspaceProps {
  property: LandProperty;
  onBack: () => void;
  onUpdateProperty: (updated: LandProperty) => void;
  userRoleId: string;
  onSwitchRole?: (roleId: string) => void;
  onLogSystemEvent?: (source: string, detail: string) => void;
  stewardInquiries?: StewardInquiry[];
  onSendStewardInquiry?: (inquiry: StewardInquiry) => void;
  onAddMessageToStewardInquiry?: (inquiryId: string, message: InquiryMessage) => void;
  currentUserName?: string;
}

export const PropertyWorkspace: React.FC<PropertyWorkspaceProps> = ({
  property,
  onBack,
  onUpdateProperty,
  userRoleId,
  onSwitchRole,
  onLogSystemEvent,
  stewardInquiries = [],
  onSendStewardInquiry = () => {},
  onAddMessageToStewardInquiry = () => {},
  currentUserName
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "sensors" | "journal" | "docs">("overview");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // States for adding a new Journal Entry
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryCategory, setNewEntryCategory] = useState<JournalEntry["category"]>("planting");
  const [addingEntry, setAddingEntry] = useState(false);

  // States for Owner Settings & Report
  const [sharingLevel, setSharingLevel] = useState<"public" | "permissioned" | "private">(property.dataSharingLevel || "public");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(property.name);
  const [editLocation, setEditLocation] = useState(property.location);
  const [editTagline, setEditTagline] = useState(property.tagline);
  const [editDescription, setEditDescription] = useState(property.description);
  const [editAreaAcres, setEditAreaAcres] = useState(property.areaAcres.toString());

  const [reportType, setReportType] = useState("biodiversity");
  const [reportContent, setReportContent] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // States for Investor Capital Backing
  const [investAmount, setInvestAmount] = useState("50000");
  const [investPurpose, setInvestPurpose] = useState("Agroforestry corridor expansion");
  const [investSuccess, setInvestSuccess] = useState(false);
  const [calculatorYears, setCalculatorYears] = useState(10);

  // Core Permission Checker
  const hasAccess = (() => {
    const level = property.dataSharingLevel || "public";
    if (level === "public") return true;
    if (userRoleId === "admin" || userRoleId === "steward" || userRoleId === "auditor") return true;
    if (level === "permissioned") {
      return ["leader", "owner", "contributor", "investor"].includes(userRoleId);
    }
    if (level === "private") {
      return userRoleId === "owner";
    }
    return false;
  })();

  const canToggleTask = ["owner", "leader", "contributor", "steward", "admin"].includes(userRoleId);

  // Toggle tasks
  const handleToggleTask = (taskId: string) => {
    if (!canToggleTask) return;
    const updatedTasks = property.tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus: Task["status"] = t.status === "done" ? "todo" : t.status === "todo" ? "doing" : "done";
        if (onLogSystemEvent) {
          onLogSystemEvent("TASK", `Toggled task "${t.title}" status for ${property.name}`);
        }
        return { ...t, status: nextStatus };
      }
      return t;
    });
    onUpdateProperty({ ...property, tasks: updatedTasks });
  };

  // Add journal entry
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryContent.trim()) return;

    // Generate simulated secure on-chain transaction hash
    const chars = "0123456789abcdef";
    let mockTx = "0x";
    for (let i = 0; i < 8; i++) mockTx += chars[Math.floor(Math.random() * 16)];
    mockTx += "...";
    for (let i = 0; i < 4; i++) mockTx += chars[Math.floor(Math.random() * 16)];

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      author: userRoleId === "owner" ? `${property.steward} (Owner)` : "Field Contributor (You)",
      content: newEntryContent,
      category: newEntryCategory,
      proofOnChain: mockTx,
      verified: true
    };

    const updatedJournal = [newEntry, ...property.journal];
    onUpdateProperty({ 
      ...property, 
      journal: updatedJournal,
      // Seeding carbon rewards on planting
      sensorData: {
        ...property.sensorData,
        carbonOffset: property.sensorData.carbonOffset + (newEntryCategory === "planting" ? 15 : 4),
        netZeroIndex: Math.min(100, property.sensorData.netZeroIndex + 1)
      }
    });

    if (onLogSystemEvent) {
      onLogSystemEvent("LEDGER", `Recorded on-chain act of care: "${newEntryContent.substring(0, 30)}..." with hash ${mockTx}`);
    }

    setNewEntryContent("");
    setAddingEntry(false);
  };

  // Owner Update details
  const handleUpdateDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...property,
      name: editName,
      location: editLocation,
      tagline: editTagline,
      description: editDescription,
      areaAcres: parseFloat(editAreaAcres) || property.areaAcres
    };
    onUpdateProperty(updated);
    setIsEditingDetails(false);
    if (onLogSystemEvent) {
      onLogSystemEvent("DATABASE", `Owner updated sanctuary details for "${editName}"`);
    }
  };

  // Owner Data Sharing Covenant change
  const handleCovenantChange = (level: "public" | "permissioned" | "private") => {
    setSharingLevel(level);
    const updated = {
      ...property,
      dataSharingLevel: level
    };
    onUpdateProperty(updated);
    if (onLogSystemEvent) {
      onLogSystemEvent("COVENANT", `Shifted data sharing level of ${property.name} to "${level.toUpperCase()}"`);
    }
  };

  // Owner Submit Impact Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) return;

    const chars = "0123456789abcdef";
    let mockHash = "ipfs://Qm";
    for (let i = 0; i < 10; i++) mockHash += chars[Math.floor(Math.random() * 16)];

    const newDoc: PropertyDocument = {
      id: `doc-report-${Date.now()}`,
      name: `Ecological Report: ${reportType.toUpperCase()} - ${new Date().getFullYear()}`,
      type: "survey",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      hash: mockHash
    };

    onUpdateProperty({
      ...property,
      documents: [newDoc, ...property.documents]
    });

    setReportSuccess(true);
    setReportContent("");
    if (onLogSystemEvent) {
      onLogSystemEvent("AUDIT", `Submitted signed ${reportType} report with IPFS hash ${mockHash}`);
    }
    setTimeout(() => setReportSuccess(false), 3000);
  };

  // Owner Simulated Asset Upload
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFile(file.name);
      
      const updated = {
        ...property,
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80" // Forest dense placeholder
      };
      onUpdateProperty(updated);

      if (onLogSystemEvent) {
        onLogSystemEvent("DATABASE", `Uploaded active media asset: "${file.name}"`);
      }
    }, 1500);
  };

  // Investor Deploy Capital
  const handleDeployCapitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(investAmount.replace(/[^0-9.]/g, "")) || 50000;
    
    const chars = "0123456789abcdef";
    let mockTx = "0x";
    for (let i = 0; i < 8; i++) mockTx += chars[Math.floor(Math.random() * 16)];
    mockTx += "...";
    for (let i = 0; i < 4; i++) mockTx += chars[Math.floor(Math.random() * 16)];

    const newWire: WireTransaction = {
      id: `wire-${Date.now()}`,
      from: "Ecosystem Partner (Investor)",
      to: `${property.name} Vault`,
      amount: `${amountNum.toLocaleString()} USDC`,
      purpose: investPurpose,
      status: "completed",
      hash: mockTx
    };

    onUpdateProperty({
      ...property,
      wires: [newWire, ...property.wires],
      areaAcres: property.areaAcres + Math.round(amountNum / 5000) // 1 acre per $5000 invested!
    });

    setInvestSuccess(true);
    if (onLogSystemEvent) {
      onLogSystemEvent("LEDGER", `Inscribed investment of ${amountNum.toLocaleString()} USDC for ${investPurpose}`);
    }
    setTimeout(() => setInvestSuccess(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto bg-forest-950/85 border border-forest-800/40 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative"
    >
      {/* Visual Header Image Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <img 
          src={property.image} 
          alt={property.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-75 scale-105 filter saturate-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-forest-950/80 border border-forest-800/60 hover:border-amber-gold text-earth-sand hover:text-amber-gold transition-all duration-300 shadow-lg z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Contact Steward Quick Button */}
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="absolute top-4 right-4 py-2 px-3.5 rounded-full bg-forest-950/85 border border-amber-gold/50 hover:border-amber-gold text-amber-gold hover:bg-forest-900 font-mono text-xs transition-all duration-300 shadow-lg z-10 flex items-center space-x-1.5 backdrop-blur-md group"
          title={`Message ${property.steward}`}
        >
          <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Contact Steward</span>
          {stewardInquiries && stewardInquiries.some(i => i.propertyId === property.id) && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          )}
        </button>

        {/* Floating Land Badge */}
        <div className="absolute bottom-4 left-6 md:left-8 z-10">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="font-mono text-[9px] text-amber-gold border border-amber-gold/30 bg-forest-950/90 px-2.5 py-1 rounded-full uppercase tracking-widest block w-max">
              Living Record — Est. {property.established}
            </span>
            <span className="font-mono text-[9px] text-emerald-400 border border-emerald-500/30 bg-forest-950/90 px-2.5 py-1 rounded-full uppercase tracking-widest block w-max">
              Covenant: {property.dataSharingLevel || "public"}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-earth-sand font-bold tracking-tight">
            {property.name}
          </h1>
          <p className="font-sans text-xs md:text-sm text-forest-300 flex items-center space-x-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1" />
            <span>{property.location}</span>
            <span className="text-forest-500">•</span>
            <span>{property.areaAcres} Connected Acres</span>
          </p>
        </div>
      </div>

      {hasAccess ? (
        <>
          {/* Workspace Menu Tabs */}
          <div className="flex border-b border-forest-800/30 overflow-x-auto bg-forest-950/50">
            {[
              { id: "overview", label: "Canopy Story", icon: BookOpen },
              { id: "sensors", label: "Earth Sensors", icon: Activity },
              { id: "journal", label: "Steward Journal", icon: Database },
              { id: "docs", label: "Deeds & Wires", icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? "border-amber-gold text-amber-gold bg-forest-900/25 font-bold" 
                      : "border-transparent text-forest-400 hover:text-earth-sand hover:bg-forest-900/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Workspace Panels */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Left description columns */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="font-serif text-lg italic text-amber-gold mb-2">"{property.tagline}"</h3>
                      <p className="text-earth-sand/95 leading-relaxed text-sm font-light whitespace-pre-line">
                        {property.description}
                      </p>
                    </div>

                    {/* Task Workspace */}
                    <div className="bg-forest-900/15 border border-forest-800/30 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4 border-b border-forest-800/20 pb-2">
                        <h4 className="font-serif text-sm text-earth-sand font-semibold">Active Restoration Tasks</h4>
                        <span className="text-[10px] font-mono text-forest-400">
                          {canToggleTask ? "TAP TO TOGGLE STATE" : "READ-ONLY FOR VISITORS"}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {property.tasks.map(task => (
                          <div 
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className={`flex items-center justify-between p-3 rounded-xl bg-forest-900/20 border transition-all ${
                              canToggleTask 
                                ? "border-forest-800/25 hover:border-amber-gold/30 hover:bg-forest-900/45 cursor-pointer group" 
                                : "border-forest-800/10 opacity-80 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {task.status === "done" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : task.status === "doing" ? (
                                <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-gold animate-spin" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-forest-600 transition-colors" />
                              )}
                              <span className={`text-xs ${task.status === "done" ? "line-through text-forest-500" : "text-earth-sand/90"}`}>
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] font-mono text-forest-400 bg-forest-950 px-2 py-0.5 rounded uppercase">
                                {task.assignee}
                              </span>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${
                                task.status === "done" ? "bg-emerald-950 text-emerald-400" : task.status === "doing" ? "bg-amber-950 text-amber-400" : "bg-forest-900 text-forest-400"
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar stats & role dashboards */}
                  <div className="space-y-6">
                    {/* Health Score */}
                    <div className="bg-forest-900/20 border border-forest-800/30 rounded-2xl p-5 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-30">
                        <Sparkles className="w-5 h-5 text-amber-gold" />
                      </div>
                      <p className="text-[10px] font-mono text-forest-400 tracking-widest uppercase">
                        NetZero Health Score
                      </p>
                      <h3 className="font-serif text-5xl font-extrabold text-amber-gold my-3">
                        {property.sensorData.netZeroIndex}%
                      </h3>
                      <p className="text-xs text-forest-300 leading-relaxed font-light">
                        The land ecosystem is thriving. Standard satellite bio-matter metrics indicate carbon stabilization exceeds historical averages.
                      </p>
                    </div>

                    {/* Interactive Steward Profile Card */}
                    <div className="bg-forest-900/15 border border-forest-800/40 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-xs text-earth-sand uppercase tracking-wider">
                          Primary Land Steward
                        </h4>
                        {property.stewardKeyTier && (
                          <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-gold border border-amber-gold/30 px-2 py-0.5 rounded">
                            {property.stewardKeyTier}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-xl bg-forest-800 flex items-center justify-center border border-amber-gold/40 text-amber-gold font-serif text-lg font-bold shadow">
                          {property.steward[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-earth-sand truncate">{property.steward}</p>
                          <p className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{property.stewardResponseTime || "Usually responds within 2 hours"}</span>
                          </p>
                        </div>
                      </div>

                      {property.stewardBio && (
                        <p className="text-xs font-serif italic text-forest-300 leading-relaxed bg-forest-950/40 p-2.5 rounded-xl border border-forest-800/20">
                          "{property.stewardBio}"
                        </p>
                      )}

                      <div className="pt-1">
                        <button
                          onClick={() => setIsContactModalOpen(true)}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 group"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-forest-900 group-hover:scale-110 transition-transform" />
                          <span>Reach Out to {property.steward.split(" ")[0]}</span>
                          {stewardInquiries && stewardInquiries.some(i => i.propertyId === property.id) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse ml-1" title="Active conversation" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* OWNER CONTROLS PANEL */}
                    {userRoleId === "owner" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-center space-x-2 text-emerald-400 pb-2 border-b border-emerald-800/20">
                          <Settings className="w-4 h-4 animate-spin-slow" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">Owner Settings & Covenants</h4>
                        </div>

                        {/* Covenant Level */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-forest-400 uppercase block">Data Sharing Covenant</label>
                          <div className="grid grid-cols-3 gap-1.5 bg-forest-950/80 p-1 rounded-lg border border-forest-800/30">
                            {(["public", "permissioned", "private"] as const).map(lvl => (
                              <button
                                key={lvl}
                                onClick={() => handleCovenantChange(lvl)}
                                className={`py-1 rounded text-[9px] font-mono uppercase font-bold transition-all ${
                                  property.dataSharingLevel === lvl
                                    ? "bg-emerald-800 text-earth-sand"
                                    : "text-forest-400 hover:text-earth-sand"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit Impact Report */}
                        <form onSubmit={handleSubmitReport} className="space-y-2 pt-2 border-t border-emerald-900/20">
                          <label className="text-[10px] font-mono text-forest-400 uppercase block">Submit Permanent Ecological Report</label>
                          <div className="flex space-x-1.5">
                            <select
                              value={reportType}
                              onChange={(e) => setReportType(e.target.value)}
                              className="bg-forest-950 border border-forest-800 rounded px-2 py-1 text-[10px] font-mono text-earth-sand focus:outline-none"
                            >
                              <option value="biodiversity">Biodiversity</option>
                              <option value="soil">Soil Carbon</option>
                              <option value="hydrological">Hydrology</option>
                            </select>
                            <input
                              type="text"
                              value={reportContent}
                              onChange={(e) => setReportContent(e.target.value)}
                              placeholder="Describe core ecological audit values..."
                              className="flex-1 bg-forest-950 border border-forest-800 rounded px-2.5 py-1 text-[10px] font-serif text-earth-sand focus:outline-none"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-[10px] px-3 py-1 rounded transition-all font-bold"
                            >
                              Sign
                            </button>
                          </div>
                          {reportSuccess && (
                            <span className="text-[9px] font-mono text-emerald-400 animate-pulse block">Signed report recorded successfully on IPFS!</span>
                          )}
                        </form>

                        {/* Media Asset Upload */}
                        <div className="pt-2 border-t border-emerald-900/20">
                          <label className="text-[10px] font-mono text-forest-400 uppercase block mb-1.5">Upload Land Imagery (Simulated)</label>
                          <div className="relative border border-dashed border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-3 text-center cursor-pointer transition-all bg-forest-950/40">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSimulatedUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              disabled={isUploading}
                            />
                            {isUploading ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-center space-x-1">
                                <span className="w-2.5 h-2.5 border-2 border-dashed border-emerald-400 rounded-full animate-spin" />
                                <span>Securing metadata payload...</span>
                              </span>
                            ) : uploadedFile ? (
                              <span className="text-[10px] font-mono text-emerald-400">Uploaded: {uploadedFile} (Active replacement)</span>
                            ) : (
                              <span className="text-[10px] font-mono text-forest-400 flex items-center justify-center space-x-1.5">
                                <Upload className="w-3.5 h-3.5 text-forest-500" />
                                <span>Click to upload drone JPEG/PNG</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* INVESTOR DEPLOYMENT PORTAL */}
                    {userRoleId === "investor" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-purple-800/20">
                          <Landmark className="w-4 h-4" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">Capital Deployment Desk</h4>
                        </div>

                        <form onSubmit={handleDeployCapitalSubmit} className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-forest-400 uppercase block">USDC Investment Amount</label>
                            <input
                              type="number"
                              value={investAmount}
                              onChange={(e) => setInvestAmount(e.target.value)}
                              className="w-full bg-forest-950 border border-forest-800 rounded px-2.5 py-1 text-xs font-mono text-earth-sand focus:outline-none"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-forest-400 uppercase block">Stewardship Purpose</label>
                            <select
                              value={investPurpose}
                              onChange={(e) => setInvestPurpose(e.target.value)}
                              className="w-full bg-forest-950 border border-forest-800 rounded px-2.5 py-1 text-[10px] font-mono text-earth-sand focus:outline-none"
                            >
                              <option value="Agroforestry corridor expansion">Agroforestry Expansion</option>
                              <option value="Gravity flow bamboo irrigation">Gravity Irrigation</option>
                              <option value="Satellite telemetry infrastructure">Telemetry Nodes</option>
                              <option value="Indigenous bio-char soil enrichment">Bio-char Inoculation</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-earth-sand rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-1"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Authorize Transfer Wire</span>
                          </button>
                        </form>

                        {investSuccess && (
                          <div className="text-[10px] font-mono text-emerald-400 animate-pulse text-center bg-forest-950 p-2 rounded-lg border border-emerald-500/25">
                            Transaction complete! Added to wire ledger, expanded sanctuary acreage!
                          </div>
                        )}

                        {/* Regenerative Yield Forecasting Calculator */}
                        <div className="pt-4 border-t border-purple-900/20 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-purple-300 uppercase block">Yield Calculator ({calculatorYears} Yrs)</label>
                            <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="40"
                            value={calculatorYears}
                            onChange={(e) => setCalculatorYears(parseInt(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                          <div className="grid grid-cols-2 gap-2 bg-forest-950 p-2 rounded-lg border border-forest-800/30 text-center font-mono">
                            <div>
                              <span className="text-[8px] text-forest-500 uppercase block">Carbon Sequestered</span>
                              <span className="text-xs text-purple-300 font-bold">{(calculatorYears * 12 * (parseFloat(investAmount) / 10000)).toFixed(0)} tons</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-forest-500 uppercase block">Expected Reward Payout</span>
                              <span className="text-xs text-amber-gold font-bold">{(calculatorYears * 850 * (parseFloat(investAmount) / 10000)).toLocaleString(undefined, {maximumFractionDigits:0})} USDC</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* CONTRIBUTOR CHECKLIST PANEL */}
                    {userRoleId === "contributor" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-teal-950/40 border border-teal-500/30 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-center space-x-2 text-teal-400 pb-2 border-b border-teal-800/20">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">Field Operations Checklist</h4>
                        </div>
                        <ul className="space-y-2.5 font-mono text-[10px] text-earth-sand/90">
                          {[
                            "Soil moisture sensor battery diagnostic",
                            "Measure native bamboo core hydration",
                            "Log seed conservation dome ambient air flow",
                            "Sign regional ahupua'a compliance ledger"
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <input 
                                type="checkbox" 
                                className="mt-0.5 rounded border-forest-800 bg-forest-950 text-teal-600 focus:ring-0 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.checked && onLogSystemEvent) {
                                    onLogSystemEvent("CONTRIBUTOR", `Field contribution logged: Checked off "${item}"`);
                                  }
                                }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[9px] text-forest-400 leading-relaxed pt-2 border-t border-teal-900/20">
                          "Checking off items registers field stewardship timestamps instantly on the regional ledger, validating rewards multipliers."
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SATELLITE & SENSORS TELEMETRY */}
              {activeTab === "sensors" && (
                <motion.div
                  key="sensors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Soil Moisture Rate", value: `${property.sensorData.soilMoisture}%`, sub: "Multi-depth probe", color: "text-sky-400", desc: "Healthy moisture profile, optimal for agroforest rooting cycles." },
                      { label: "Water Outflow Purity", value: `${property.sensorData.waterPurity}%`, sub: "Biological catchment", color: "text-emerald-400", desc: "Bio-swale filter performance indicates perfect run-off filtration." },
                      { label: "Living Biomass Density", value: `${property.sensorData.biomassDensity} t/ha`, sub: "Satellite LIDAR Scan", color: "text-amber-gold", desc: "Tree canopy density tracking shows high bio-matter restoration rate." },
                      { label: "Carbon Offset Ledger", value: `${property.sensorData.carbonOffset} tons`, sub: "CO2 Sequestration", color: "text-teal-400", desc: "Carbon tonnage recorded live and verified on the blockchain ledger." }
                    ].map((sensor, idx) => (
                      <div key={idx} className="bg-forest-900/20 border border-forest-800/30 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-forest-400 uppercase block mb-1">{sensor.label}</span>
                          <h4 className={`text-2xl font-mono font-bold ${sensor.color} my-1`}>{sensor.value}</h4>
                          <span className="text-[9px] font-mono text-forest-500 uppercase tracking-wider block">{sensor.sub}</span>
                        </div>
                        <p className="text-[11px] text-forest-300 font-light leading-relaxed mt-4 pt-3 border-t border-forest-800/20">
                          {sensor.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Sat Recommendation from GaiA */}
                  <div className="bg-forest-900/10 border border-amber-gold/20 rounded-2xl p-5 md:p-6 flex items-start space-x-4">
                    <div className="p-2.5 rounded-full bg-forest-900 border border-amber-gold/40 text-amber-gold flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-amber-gold font-semibold mb-1">GaiA's Real-time Satellite Land Assessment</h4>
                      <p className="text-xs text-earth-sand/90 leading-relaxed font-light">
                        "My sensors record a highly stable root structure across your property, dear steward. Your water table continues to enrich, proving that the gravity-fed bamboo bio-swales are filtering tropical sediment perfectly. I recommend expanding the fungal inoculation in your northwest block to increase biomass absorption by another 3% before autumn."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEWARD JOURNAL (PROVENANCE RECORD) */}
              {activeTab === "journal" && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Toggle to add a new Journal Post */}
                  <div className="flex justify-between items-center pb-4 border-b border-forest-800/20">
                    <h3 className="font-serif text-lg text-earth-sand">Provenance Logs</h3>
                    <button
                      onClick={() => setAddingEntry(!addingEntry)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-gold text-[#3E3E2F] font-mono text-xs font-semibold hover:bg-yellow-400 transition-all shadow-md shadow-amber-gold/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Stewardship Act</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {addingEntry && (
                      <motion.form
                        onSubmit={handleAddJournal}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-forest-900/25 border border-forest-800/40 rounded-2xl p-5 space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-[10px] font-mono text-forest-400 uppercase mb-2">
                            Stewardship Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(["planting", "soil", "water", "community", "general"] as const).map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setNewEntryCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-mono capitalize border transition-all ${
                                  newEntryCategory === cat 
                                    ? "bg-amber-gold border-amber-gold text-[#3E3E2F] font-semibold"
                                    : "bg-forest-950/80 border-forest-800 text-forest-300 hover:text-earth-sand hover:border-forest-700"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-forest-400 uppercase mb-2">
                            Describe your Stewardship Act (What changes were made to the land?)
                          </label>
                          <textarea
                            value={newEntryContent}
                            onChange={(e) => setNewEntryContent(e.target.value)}
                            placeholder="e.g., Gathered organic vetiver grass and planted it on the slope boundary to prevent topsoil mudslides. Monitored rainfall infiltration."
                            rows={3}
                            className="w-full px-4 py-3 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif placeholder-forest-500 focus:outline-none focus:border-amber-gold/50"
                            required
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setAddingEntry(false)}
                            className="px-4 py-1.5 rounded-full border border-forest-800 text-xs font-mono text-forest-300 hover:text-earth-sand transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-1.5 rounded-full bg-forest-900 border border-amber-gold/40 text-amber-gold font-mono text-xs hover:bg-forest-800 transition-all flex items-center space-x-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Sign & Record On-Chain</span>
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Journal Grid */}
                  <div className="space-y-4">
                    {property.journal.map((entry) => (
                      <div key={entry.id} className="bg-forest-900/15 border border-forest-800/25 rounded-2xl p-5 md:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-forest-800 border border-forest-700 text-xs font-mono font-bold flex items-center justify-center text-forest-300">
                              {entry.author[0]}
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-earth-sand">{entry.author}</h5>
                              <span className="text-[10px] font-mono text-forest-400 uppercase">{entry.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 items-center">
                            {entry.auditorCertified && (
                              <div className="flex items-center space-x-1 bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-amber-gold px-2.5 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3 text-amber-gold animate-pulse" />
                                <span className="uppercase tracking-wider">Audited Signature</span>
                              </div>
                            )}
                            <span className="text-[9px] font-mono bg-forest-950 border border-forest-800 text-amber-gold px-2.5 py-0.5 rounded-full uppercase">
                              {entry.category}
                            </span>
                            <div className="flex items-center space-x-1.5 bg-emerald-950/55 border border-emerald-900/60 text-[9px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" />
                              <span className="uppercase tracking-wider">Verified: {entry.proofOnChain}</span>
                            </div>
                            
                            {userRoleId === "auditor" && !entry.auditorCertified && (
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...property,
                                    journal: property.journal.map(j => j.id === entry.id ? { ...j, auditorCertified: true } : j)
                                  };
                                  onUpdateProperty(updated);
                                  if (onLogSystemEvent) {
                                    onLogSystemEvent("AUDIT", `Auditor signed provenance log entry: "${entry.content.substring(0, 30)}..."`);
                                  }
                                }}
                                className="bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700 text-[8px] font-mono px-2 py-0.5 rounded transition-all uppercase"
                              >
                                Certify
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="font-serif italic text-earth-sand/90 text-sm leading-relaxed whitespace-pre-line pl-1.5 border-l-2 border-forest-800">
                          "{entry.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DOCUMENTS, PERMITS, WIRES */}
              {activeTab === "docs" && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Documents & Permits */}
                  <div className="space-y-5">
                    <div className="border-b border-forest-800/30 pb-3">
                      <h4 className="font-serif text-base text-earth-sand font-medium">Official Filings & Covenants</h4>
                      <p className="text-[10px] font-mono text-forest-400 uppercase mt-0.5">Permanent Land Records</p>
                    </div>
                    <div className="space-y-3">
                      {property.documents.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-xl bg-forest-900/20 border border-forest-800/25 flex justify-between items-start">
                          <div className="flex items-start space-x-3.5">
                            <FileText className="w-5 h-5 text-amber-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-semibold text-earth-sand leading-tight">{doc.name}</h5>
                              <span className="text-[9px] font-mono text-forest-400 uppercase tracking-wider block mt-1">
                                Type: {doc.type} • Filed: {doc.date}
                              </span>
                              <span className="text-[9px] font-mono text-forest-500 mt-0.5 block truncate max-w-[150px] sm:max-w-[190px]">
                                {doc.hash}
                              </span>
                              {doc.auditorCertified && (
                                <span className="inline-flex items-center space-x-1 text-[9px] font-mono text-amber-gold bg-amber-500/10 border border-amber-500/25 rounded px-1.5 py-0.2 mt-1 uppercase">
                                  <CheckCircle className="w-2.5 h-2.5" />
                                  <span>Audited Deed</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-1.5">
                            <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                              doc.status === "approved" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                            }`}>
                              {doc.status}
                            </span>
                            {userRoleId === "auditor" && !doc.auditorCertified && (
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...property,
                                    documents: property.documents.map(d => d.id === doc.id ? { ...d, auditorCertified: true } : d)
                                  };
                                  onUpdateProperty(updated);
                                  if (onLogSystemEvent) {
                                    onLogSystemEvent("AUDIT", `Auditor cryptographically sealed document: ${doc.name}`);
                                  }
                                }}
                                className="bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700 text-[8px] font-mono px-2 py-0.5 rounded transition-all uppercase"
                              >
                                Certify Doc
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wire Transactions / Smart Contracts Ledger */}
                  <div className="space-y-5">
                    <div className="border-b border-forest-800/30 pb-3">
                      <h4 className="font-serif text-base text-earth-sand font-medium">Stewardship Wires Ledger</h4>
                      <p className="text-[10px] font-mono text-forest-400 uppercase mt-0.5">Permanent Auditable Capital Trails</p>
                    </div>
                    <div className="space-y-3">
                      {property.wires.map((wire) => (
                        <div key={wire.id} className="p-4 rounded-xl bg-forest-900/20 border border-forest-800/25 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Landmark className="w-4 h-4 text-forest-400" />
                              <span className="text-xs font-bold text-amber-gold">{wire.amount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {wire.auditorCertified && (
                                <span className="inline-flex items-center space-x-1 text-[8px] font-mono text-amber-gold bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.2 uppercase">
                                  <CheckCircle className="w-2.5 h-2.5" />
                                  <span>Audited Ledger</span>
                                </span>
                              )}
                              <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded">
                                {wire.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] font-light text-forest-300 leading-relaxed">
                            <p><span className="font-semibold text-earth-sand">From:</span> {wire.from}</p>
                            <p><span className="font-semibold text-earth-sand">To:</span> {wire.to}</p>
                            <p className="mt-1"><span className="font-semibold text-earth-sand">Purpose:</span> {wire.purpose}</p>
                          </div>
                          <div className="text-[9px] font-mono text-forest-500 pt-2 border-t border-forest-800/10 flex justify-between items-center gap-2">
                            <span className="truncate max-w-[160px] sm:max-w-[210px]">Tx Hash: {wire.hash}</span>
                            {userRoleId === "auditor" && !wire.auditorCertified && (
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...property,
                                    wires: property.wires.map(w => w.id === wire.id ? { ...w, auditorCertified: true } : w)
                                  };
                                  onUpdateProperty(updated);
                                  if (onLogSystemEvent) {
                                    onLogSystemEvent("AUDIT", `Auditor confirmed escrow integrity check for wire: ${wire.amount}`);
                                  }
                                }}
                                className="bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700 text-[8px] font-mono px-2 py-0.5 rounded transition-all uppercase flex-shrink-0"
                              >
                                Sign Wire
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* ACCESS RESTRICTED SECURE GATEWAY OVERLAY */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-forest-900 border border-amber-gold/40 flex items-center justify-center text-amber-gold animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-amber-gold border border-amber-gold/30 bg-forest-950 px-2.5 py-1 rounded-full uppercase tracking-widest block w-max mx-auto mb-3">
              Covenant Protected Record
            </span>
            <h2 className="font-serif text-2xl text-earth-sand font-bold">Access Restricted</h2>
            <p className="text-xs text-forest-300 mt-2 font-mono uppercase tracking-wider">
              Sharing Level: {property.dataSharingLevel || "public"}
            </p>
          </div>
          <p className="text-sm text-forest-300/90 leading-relaxed font-light">
            "We protect the boundaries of our sanctuary to preserve indigenous sovereignty and biological integrity. Only authorized land owners, platform operators, ecosystem auditors, and verified community partners can view these records."
          </p>
          
          <div className="w-full bg-forest-900/15 border border-forest-800/30 rounded-2xl p-4 text-left space-y-2.5">
            <p className="text-[10px] font-mono text-forest-400 uppercase">Authorized roles for this covenant:</p>
            <div className="flex flex-wrap gap-1.5">
              {property.dataSharingLevel === "private" ? (
                ["owner", "steward", "admin", "auditor"].map(role => (
                  <span key={role} className="text-[9px] font-mono bg-forest-950 border border-forest-800 text-forest-300 px-2 py-0.5 rounded uppercase">
                    {role}
                  </span>
                ))
              ) : (
                ["owner", "leader", "contributor", "investor", "steward", "admin", "auditor"].map(role => (
                  <span key={role} className="text-[9px] font-mono bg-forest-950 border border-forest-800 text-forest-300 px-2 py-0.5 rounded uppercase">
                    {role}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-full border border-forest-800 text-xs font-mono text-forest-300 hover:text-earth-sand transition-all"
            >
              Return to Map
            </button>
            {onSwitchRole && (
              <button
                onClick={() => onSwitchRole(property.dataSharingLevel === "private" ? "owner" : "investor")}
                className="px-5 py-2 rounded-full bg-amber-gold text-[#3E3E2F] font-mono text-xs font-semibold hover:bg-yellow-400 transition-all flex items-center justify-center space-x-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Bypass: Switch to {property.dataSharingLevel === "private" ? "Owner" : "Investor"}</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Contact Steward Modal */}
      <ContactStewardModal
        property={property}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        inquiries={stewardInquiries}
        onSendInquiry={onSendStewardInquiry}
        onAddMessageToInquiry={onAddMessageToStewardInquiry}
        currentUserName={currentUserName}
        currentUserRole={userRoleId}
      />
    </motion.div>
  );
};
