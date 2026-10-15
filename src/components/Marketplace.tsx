import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ShoppingBag, Search, Plus, Filter, Compass, Tag, CheckCircle, MessageSquare, ShieldCheck, Clock, Star, DollarSign, X } from "lucide-react";
import { MarketplaceListing, SupplierInquiry, InquiryMessage } from "../types";
import { SupplierMessageModal } from "./SupplierMessageModal";

interface MarketplaceProps {
  listings: MarketplaceListing[];
  onBack: () => void;
  onAddListing: (newListing: MarketplaceListing) => void;
  supplierInquiries?: SupplierInquiry[];
  onSendSupplierInquiry?: (inquiry: SupplierInquiry) => void;
  onAddMessageToSupplierInquiry?: (inquiryId: string, message: InquiryMessage) => void;
  currentUserName?: string;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  onBack,
  onAddListing,
  supplierInquiries = [],
  onSendSupplierInquiry = () => {},
  onAddMessageToSupplierInquiry = () => {},
  currentUserName
}) => {
  const [filterType, setFilterType] = useState<"all" | "land" | "service" | "professional" | "technology">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [messagingListing, setMessagingListing] = useState<MarketplaceListing | null>(null);
  const [showInquiriesDrawer, setShowInquiriesDrawer] = useState(false);
  
  // States for matching/connecting
  const [contacting, setContacting] = useState(false);
  const [stewardName, setStewardName] = useState("");
  const [stewardMsg, setStewardMsg] = useState("");
  const [matchSuccess, setMatchSuccess] = useState(false);

  // States for adding a new listing
  const [publishing, setPublishing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"land" | "service" | "professional" | "technology">("land");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTags, setNewTags] = useState("");

  const filtered = listings.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const listTagArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedImages: Record<string, string> = {
      land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      service: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
      technology: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      professional: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
    };

    const newListing: MarketplaceListing = {
      id: `market-${Date.now()}`,
      title: newTitle,
      type: newType,
      provider: "You (Active Steward)",
      location: newLocation || "Global / Remote",
      price: newPrice || "Contact for Pricing",
      description: newDesc,
      image: generatedImages[newType],
      tags: listTagArray.length > 0 ? listTagArray : ["Regenerative", "Stewardship"]
    };

    onAddListing(newListing);
    setNewTitle("");
    setNewPrice("");
    setNewDesc("");
    setNewLocation("");
    setNewTags("");
    setPublishing(false);
  };

  const handleMatchRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setContacting(true);
    setTimeout(() => {
      setContacting(false);
      setMatchSuccess(true);
      setTimeout(() => {
        setMatchSuccess(false);
        setSelectedListing(null);
        setStewardName("");
        setStewardMsg("");
      }, 3500);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto bg-forest-950/85 border border-forest-800/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative"
    >
      {/* Glow */}
      <div className="absolute w-64 h-64 rounded-full bg-forest-400/5 blur-[120px] bottom-0 left-0 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-forest-800/30 pb-5 mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-forest-900/40 border border-forest-800/30 hover:border-amber-gold text-earth-sand hover:text-amber-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-gold" />
              <h2 className="font-serif text-2xl text-earth-sand font-medium">Steward Marketplace</h2>
            </div>
            <p className="text-xs text-forest-300 font-mono tracking-widest uppercase mt-0.5">
              Cap. 04 — Ecological Land & Exchange
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-center">
          <button
            onClick={() => setShowInquiriesDrawer(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-forest-900/60 border border-forest-800/80 hover:border-amber-gold/50 text-forest-300 hover:text-earth-sand font-mono text-xs transition-all shadow"
            title="View Active Inquiries & Quotes"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-gold" />
            <span>Supplier Inquiries</span>
            {supplierInquiries.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-gold/20 text-amber-gold border border-amber-gold/40 text-[10px] rounded-full font-bold">
                {supplierInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setPublishing(!publishing)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-gold text-[#3E3E2F] font-mono text-xs font-semibold hover:bg-yellow-400 transition-all shadow-md shadow-amber-gold/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Offer</span>
          </button>
        </div>
      </div>

      {/* Dynamic Search & Category Filtering */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-forest-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lands, bio-technologies, permaculture specialists..."
            className="w-full pl-11 pr-4 py-3 bg-forest-950/60 border border-forest-800/40 rounded-2xl text-earth-sand text-xs font-serif placeholder-forest-500 focus:outline-none focus:border-amber-gold/50"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-2 pb-1 md:pb-0 scrollbar">
          {["all", "land", "service", "professional", "technology"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat as any)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono capitalize tracking-wider transition-all flex-shrink-0 ${
                filterType === cat 
                  ? "bg-forest-900 border-amber-gold text-amber-gold font-semibold"
                  : "bg-forest-950 border-forest-800/40 text-forest-300 hover:text-earth-sand hover:border-forest-700"
              }`}
            >
              {cat === "all" ? "All Offerings" : cat}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {publishing ? (
          /* PUBLISH FORM */
          <motion.form
            key="publishing-form"
            onSubmit={handleCreateListing}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-forest-900/15 border border-forest-800/30 rounded-2xl p-5 mb-6 space-y-4 overflow-hidden"
          >
            <div className="border-b border-forest-800/20 pb-2 mb-3">
              <h4 className="font-serif text-sm text-amber-gold font-medium">Create Stewardship Listing</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Listing Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Solar Compost Tea Bio-Reactor"
                  className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Offering Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-mono focus:outline-none focus:border-amber-gold/50"
                >
                  <option value="land">Regenerative Land</option>
                  <option value="service">Stewardship Service</option>
                  <option value="professional">Consultant / Professional</option>
                  <option value="technology">Green Technology</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Value / Price</label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g., 2,500 USDC or Shipped free"
                  className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g., Kauai, Hawaiʻi or Remote"
                  className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Tags (Comma separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Permaculture, Solar, Water Management"
                className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-forest-400 uppercase mb-1.5">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Give a deep, serene explanation of what you are listing, keeping with our values of Earth harmony and organic progress..."
                rows={3}
                className="w-full px-4 py-3 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPublishing(false)}
                className="px-4 py-1.5 rounded-full border border-forest-800 text-xs font-mono text-forest-300 hover:text-earth-sand transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-full bg-forest-900 border border-amber-gold/40 text-amber-gold font-mono text-xs hover:bg-forest-800 transition-all"
              >
                Publish Offering
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            onClick={() => setSelectedListing(item)}
            className="group cursor-pointer bg-forest-900/10 border border-forest-800/25 rounded-2xl overflow-hidden hover:border-amber-gold/30 hover:bg-forest-900/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                <span className="absolute top-3 left-3 text-[9px] font-mono font-semibold uppercase tracking-wider bg-forest-950/90 text-amber-gold px-2.5 py-1 rounded border border-amber-gold/25 shadow">
                  {item.type}
                </span>
              </div>

              {/* Text */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono text-forest-400 block">{item.location}</span>
                <h3 className="font-serif text-base text-earth-sand font-semibold leading-tight group-hover:text-amber-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-forest-300 font-light line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Bottom details */}
            <div className="px-4 pb-4 pt-3 border-t border-forest-800/15 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-gold block">{item.price}</span>
                <span className="text-[9px] font-mono text-forest-400 block">
                  {item.provider.split(" ")[0]} {item.supplierVerified ? "✓" : ""}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMessagingListing(item);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-800/80 hover:bg-amber-gold text-forest-300 hover:text-forest-950 font-mono text-[10px] font-bold border border-forest-700/60 hover:border-amber-gold transition-all shadow-sm group/btn"
                title={`Message ${item.provider}`}
              >
                <MessageSquare className="w-3 h-3 text-amber-gold group-hover/btn:text-forest-950" />
                <span>Message</span>
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-forest-900/5 border border-forest-800/15 rounded-2xl">
            <Compass className="w-8 h-8 text-forest-400 mx-auto opacity-40 mb-2.5 animate-spin-slow" />
            <p className="font-serif italic text-earth-sand/60 text-sm">
              The winds of search came back silent. Try widening your query.
            </p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 bg-forest-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={selectedListing.id}
              className="bg-forest-950 border border-forest-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative"
            >
              <div className="h-48 w-full relative">
                <img 
                  src={selectedListing.image} 
                  alt={selectedListing.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter saturate-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent" />
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-forest-950/80 text-earth-sand hover:text-amber-gold border border-forest-800"
                >
                  <ArrowLeft className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-forest-900 text-amber-gold px-2.5 py-0.5 rounded">
                      {selectedListing.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-gold">{selectedListing.price}</span>
                  </div>
                  <h3 className="font-serif text-xl text-earth-sand font-bold">{selectedListing.title}</h3>
                  <p className="text-[10px] font-mono text-forest-400 uppercase tracking-wider">
                    Location: {selectedListing.location} • Listed by: {selectedListing.provider}
                  </p>
                </div>

                <p className="text-xs text-earth-sand/80 leading-relaxed font-serif italic">
                  "{selectedListing.description}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedListing.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-forest-900 border border-forest-800 text-forest-300 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Supplier Communication & Quote Actions */}
                <div className="border-t border-forest-800/30 pt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-forest-900/30 p-4 rounded-2xl border border-forest-800/40">
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-xs text-amber-gold uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Supplier Communications Desk</span>
                      </h4>
                      <p className="text-[11px] font-mono text-forest-300">
                        Request custom pricing, volume delivery & technical specs
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const target = selectedListing;
                        setSelectedListing(null);
                        setMessagingListing(target);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold transition-all shadow flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Supplier / Get Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supplier Messaging & Quote Modal */}
      {messagingListing && (
        <SupplierMessageModal
          listing={messagingListing}
          isOpen={true}
          onClose={() => setMessagingListing(null)}
          inquiries={supplierInquiries}
          onSendInquiry={onSendSupplierInquiry}
          onAddMessageToInquiry={onAddMessageToSupplierInquiry}
          currentUserName={currentUserName}
        />
      )}

      {/* Active Inquiries & Quotes Drawer / Modal */}
      <AnimatePresence>
        {showInquiriesDrawer && (
          <div className="fixed inset-0 bg-forest-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-forest-950 border border-forest-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-forest-800/40 flex items-center justify-between bg-forest-900/40">
                <div className="flex items-center space-x-2.5">
                  <MessageSquare className="w-5 h-5 text-amber-gold" />
                  <h3 className="font-serif text-lg text-earth-sand font-bold">
                    Active Supplier Inquiries & Quotes ({supplierInquiries.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowInquiriesDrawer(false)}
                  className="p-1.5 rounded-full bg-forest-900 border border-forest-800 text-forest-400 hover:text-earth-sand"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {supplierInquiries.length === 0 ? (
                  <p className="text-center py-8 font-serif italic text-forest-400 text-xs">
                    No active supplier inquiries yet. Click "Message" on any offering to request a quote.
                  </p>
                ) : (
                  supplierInquiries.map((inq) => {
                    const matchListing = listings.find(l => l.id === inq.listingId) || {
                      id: inq.listingId,
                      title: inq.listingTitle,
                      type: "technology" as const,
                      provider: inq.supplierName,
                      location: "Remote / Shipped",
                      price: "Quoted",
                      description: "",
                      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
                      tags: []
                    };
                    const lastMsg = inq.messages[inq.messages.length - 1];
                    return (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-forest-900/25 border border-forest-800/60 hover:border-amber-gold/40 transition-all flex flex-col space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-serif text-sm text-earth-sand font-semibold">{inq.listingTitle}</h4>
                            <p className="text-[11px] font-mono text-forest-300">
                              Supplier: <strong className="text-amber-gold">{inq.supplierName}</strong>
                            </p>
                          </div>
                          <span className="text-[10px] font-mono uppercase bg-forest-900 border border-forest-800 text-emerald-400 px-2 py-0.5 rounded">
                            {inq.status.replace("_", " ")}
                          </span>
                        </div>

                        {lastMsg && (
                          <div className="text-xs font-serif italic text-forest-300/80 bg-forest-950/60 p-2 rounded-xl border border-forest-800/20 line-clamp-2">
                            "{lastMsg.text}"
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono text-forest-400">
                            {inq.messages.length} messages • Scope: {inq.scopeOrQuantity || "Standard"}
                          </span>
                          <button
                            onClick={() => {
                              setShowInquiriesDrawer(false);
                              setMessagingListing(matchListing);
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold transition-all shadow"
                          >
                            Open Conversation →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
