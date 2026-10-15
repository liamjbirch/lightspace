import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Send, Sparkles, ShieldCheck, Clock, Star, 
  MessageSquare, FileText, Truck, DollarSign, CheckCircle, Package
} from "lucide-react";
import { MarketplaceListing, SupplierInquiry, InquiryMessage } from "../types";

interface SupplierMessageModalProps {
  listing: MarketplaceListing;
  isOpen: boolean;
  onClose: () => void;
  inquiries: SupplierInquiry[];
  onSendInquiry: (inquiry: SupplierInquiry) => void;
  onAddMessageToInquiry: (inquiryId: string, message: InquiryMessage) => void;
  currentUserName?: string;
}

const INQUIRY_TYPES = [
  { id: "quote", label: "Request Custom Quote", icon: DollarSign, desc: "Volume discounts, freight, and customized payment" },
  { id: "specs", label: "Technical Specifications", icon: FileText, desc: "Sensor telemetry, soil biology strains, GIS details" },
  { id: "logistics", label: "Delivery & Fulfillment", icon: Truck, desc: "Shipping timelines, regional customs, site delivery" },
  { id: "partnership", label: "Long-term Alliance", icon: Package, desc: "Ongoing supply covenants and stewardship terms" }
] as const;

export const SupplierMessageModal: React.FC<SupplierMessageModalProps> = ({
  listing,
  isOpen,
  onClose,
  inquiries,
  onSendInquiry,
  onAddMessageToInquiry,
  currentUserName = "Steward Buyer"
}) => {
  // Check for existing conversation with this supplier for this listing
  const existingInquiry = inquiries.find(i => i.listingId === listing.id);

  const [activeTab, setActiveTab] = useState<"new" | "thread">(existingInquiry ? "thread" : "new");
  const [inquiryType, setInquiryType] = useState<SupplierInquiry["inquiryType"]>("quote");
  const [quantity, setQuantity] = useState("1 system / parcel");
  const [senderName, setSenderName] = useState(currentUserName);
  const [senderContact, setSenderContact] = useState("");
  const [messageText, setMessageText] = useState("");
  const [threadReplyText, setThreadReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSupplierTyping, setIsSupplierTyping] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "thread") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, existingInquiry?.messages, isSupplierTyping]);

  if (!isOpen) return null;

  // Generate simulated contextual reply with optional formal quote card
  const generateSupplierReply = (
    type: SupplierInquiry["inquiryType"],
    userQty: string,
    text: string
  ): InquiryMessage => {
    let replyText = "";
    let quoteDetails: InquiryMessage["quoteDetails"] = undefined;

    if (type === "quote") {
      replyText = `Thank you for your inquiry regarding "${listing.title}". For your requested scope (${userQty || "Standard"}), our operations team has prepared the following customized estimate:`;
      quoteDetails = {
        price: listing.price.includes("USD") ? `${listing.price} (Includes 5% Eco-Steward Discount)` : "Custom Quote Calculated",
        timeline: "Dispatched in 3-5 business days via regional carbon-neutral freight",
        status: "quoted"
      };
    } else if (type === "specs") {
      replyText = `Greetings! Regarding your question on "${listing.title}": All our offerings conform strictly to regional regenerative agriculture and organic certification guidelines. Full telemetry data sheets and lab assays are attached to this ledger transaction.`;
    } else if (type === "logistics") {
      replyText = `Hello! We fulfill orders to ${listing.location} and globally via coordinated carbon-offset freight. Tracking numbers and smart-contract escrow release keys are generated automatically upon shipping.`;
    } else {
      replyText = `Thank you for reaching out to ${listing.provider}. We are deeply aligned with long-term regenerative partnerships and look forward to co-creating this initiative with you.`;
    }

    return {
      id: `msg-sup-reply-${Date.now()}`,
      sender: listing.provider,
      senderRole: "Verified Marketplace Provider",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: true,
      quoteDetails
    };
  };

  const handleStartInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;

    setIsSending(true);

    const userMessage: InquiryMessage = {
      id: `msg-user-${Date.now()}`,
      sender: senderName || "Steward Buyer",
      senderRole: "Buyer / Steward",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: false
    };

    const newInquiryId = `inq-supplier-${Date.now()}`;
    const newInquiry: SupplierInquiry = {
      id: newInquiryId,
      listingId: listing.id,
      listingTitle: listing.title,
      supplierName: listing.provider,
      senderName: senderName || "Steward Buyer",
      senderContact: senderContact || "buyer@lightspace.earth",
      inquiryType,
      scopeOrQuantity: quantity,
      status: inquiryType === "quote" ? "inquiry_sent" : "inquiry_sent",
      unreadReplies: 0,
      createdAt: new Date().toISOString(),
      messages: [userMessage]
    };

    onSendInquiry(newInquiry);
    setMessageText("");
    setIsSending(false);
    setActiveTab("thread");

    // Simulate supplier response
    setTimeout(() => {
      setIsSupplierTyping(true);
      setTimeout(() => {
        setIsSupplierTyping(false);
        const autoReply = generateSupplierReply(inquiryType, quantity, userMessage.text);
        onAddMessageToInquiry(newInquiryId, autoReply);
      }, 1900);
    }, 1100);
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadReplyText.trim() || !existingInquiry || isSending) return;

    const userMsg: InquiryMessage = {
      id: `msg-user-${Date.now()}`,
      sender: senderName || "You",
      senderRole: "Buyer / Steward",
      text: threadReplyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: false
    };

    onAddMessageToInquiry(existingInquiry.id, userMsg);
    const sentText = threadReplyText.trim();
    setThreadReplyText("");

    setIsSupplierTyping(true);
    setTimeout(() => {
      setIsSupplierTyping(false);
      const autoReply = generateSupplierReply(existingInquiry.inquiryType, existingInquiry.scopeOrQuantity || "1", sentText);
      onAddMessageToInquiry(existingInquiry.id, autoReply);
    }, 2000);
  };

  const handleAcceptQuote = () => {
    setQuoteAccepted(true);
    if (existingInquiry) {
      const acceptMsg: InquiryMessage = {
        id: `msg-accept-${Date.now()}`,
        sender: senderName || "You",
        senderRole: "Buyer / Steward",
        text: "✅ I accept this quote! Escrow deposit instructions have been initiated.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStewardOrSupplier: false
      };
      onAddMessageToInquiry(existingInquiry.id, acceptMsg);

      setTimeout(() => {
        const confirmMsg: InquiryMessage = {
          id: `msg-confirm-${Date.now()}`,
          sender: listing.provider,
          senderRole: "Verified Marketplace Provider",
          text: "Splendid! The order has been locked into the escrow smart contract. Fulfillment preparation has begun.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isStewardOrSupplier: true
        };
        onAddMessageToInquiry(existingInquiry.id, confirmMsg);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-forest-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="bg-forest-950 border border-forest-800/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Header: Supplier & Listing Card */}
        <div className="p-5 sm:p-6 bg-forest-900/40 border-b border-forest-800/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-forest-950/60 border border-forest-800 text-forest-400 hover:text-earth-sand hover:border-amber-gold/50 transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <img
              src={listing.image}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-forest-800/60 shadow"
            />
            <div className="space-y-1 flex-1 pr-6">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase bg-amber-gold/15 text-amber-gold px-2 py-0.5 rounded border border-amber-gold/30 font-semibold">
                  {listing.type}
                </span>
                <span className="text-xs font-mono font-bold text-amber-gold">{listing.price}</span>
              </div>
              <h3 className="font-serif text-lg text-earth-sand font-bold leading-tight">
                {listing.title}
              </h3>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-forest-300 flex-wrap">
                <span className="flex items-center space-x-1 text-earth-sand">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <strong>{listing.provider}</strong>
                </span>
                {listing.supplierRating && (
                  <span className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{listing.supplierRating.toFixed(1)}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-forest-400">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{listing.supplierResponseTime || "Under 2 hours"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          {existingInquiry && (
            <div className="flex space-x-2 mt-4 pt-3 border-t border-forest-800/30">
              <button
                onClick={() => setActiveTab("thread")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  activeTab === "thread"
                    ? "bg-amber-gold/15 border border-amber-gold/50 text-amber-gold font-bold"
                    : "bg-forest-950/40 text-forest-400 hover:text-earth-sand border border-forest-800/40"
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Supplier Thread ({existingInquiry.messages.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  activeTab === "new"
                    ? "bg-amber-gold/15 border border-amber-gold/50 text-amber-gold font-bold"
                    : "bg-forest-950/40 text-forest-400 hover:text-earth-sand border border-forest-800/40"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>New Quote Request</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === "thread" && existingInquiry ? (
              <motion.div
                key="thread-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 flex flex-col h-full"
              >
                {/* Thread Header details */}
                <div className="flex items-center justify-between text-[11px] font-mono text-forest-400 pb-2 border-b border-forest-800/20">
                  <span className="uppercase">Type: <strong className="text-earth-sand">{existingInquiry.inquiryType}</strong></span>
                  <span className="text-emerald-400">
                    Status: {existingInquiry.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 min-h-[160px] max-h-[300px] overflow-y-auto pr-1">
                  {existingInquiry.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isStewardOrSupplier ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-forest-400 mb-1">
                        <span className="font-semibold text-earth-sand">{m.sender}</span>
                        {m.senderRole && <span>({m.senderRole})</span>}
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs font-serif leading-relaxed ${
                          m.isStewardOrSupplier
                            ? "bg-forest-900/60 border border-amber-gold/25 text-earth-sand rounded-tl-sm shadow-md"
                            : "bg-amber-900/20 border border-amber-gold/40 text-amber-50 rounded-tr-sm"
                        }`}
                      >
                        <p>{m.text}</p>

                        {/* Formal Quote Card inside chat message */}
                        {m.quoteDetails && (
                          <div className="mt-2.5 p-3 rounded-xl bg-forest-950/80 border border-amber-gold/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase text-amber-gold font-bold">Formal Supplier Quote</span>
                              <span className="text-xs font-mono font-bold text-amber-gold">{m.quoteDetails.price}</span>
                            </div>
                            {m.quoteDetails.timeline && (
                              <p className="text-[11px] font-mono text-forest-300">
                                🚚 {m.quoteDetails.timeline}
                              </p>
                            )}
                            <div className="pt-1.5 flex justify-end">
                              <button
                                onClick={handleAcceptQuote}
                                disabled={quoteAccepted}
                                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase transition-all shadow flex items-center space-x-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>{quoteAccepted ? "Quote Accepted ✓" : "Accept Quote & Deposit Escrow"}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Supplier Typing Indicator */}
                  {isSupplierTyping && (
                    <div className="flex items-center space-x-2 text-forest-400 text-xs font-mono py-1">
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] italic text-amber-gold/80">{listing.provider} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendThreadReply} className="pt-2 border-t border-forest-800/30 flex gap-2">
                  <input
                    type="text"
                    value={threadReplyText}
                    onChange={(e) => setThreadReplyText(e.target.value)}
                    placeholder={`Reply to ${listing.provider}...`}
                    className="flex-1 px-3.5 py-2.5 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                  />
                  <button
                    type="submit"
                    disabled={!threadReplyText.trim() || isSupplierTyping}
                    className="px-4 py-2.5 bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold rounded-xl transition-all shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              /* New Inquiry / Quote Request Form */
              <motion.form
                key="new-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleStartInquiry}
                className="space-y-4"
              >
                {/* Inquiry Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                    Inquiry Objective
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INQUIRY_TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = inquiryType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setInquiryType(t.id)}
                          className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-amber-gold/15 border-amber-gold/60 text-earth-sand shadow"
                              : "bg-forest-900/20 border-forest-800/40 text-forest-300 hover:border-forest-700"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? "text-amber-gold" : "text-forest-400"}`} />
                          <div>
                            <span className="text-xs font-serif font-semibold block">{t.label}</span>
                            <span className="text-[10px] text-forest-400 block leading-tight">{t.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scope / Quantity & Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                      Scope / Quantity
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 2 Units, 50 Acres"
                      required
                      className="w-full px-3 py-2 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                      Your Name / Org
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      required
                      className="w-full px-3 py-2 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                      Email / Telegram
                    </label>
                    <input
                      type="text"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      placeholder="e.g. buyer@earth.org"
                      required
                      className="w-full px-3 py-2 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                    Detailed Inquiry Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    placeholder="Specify project parameters, desired delivery window, delivery location, or questions regarding ecological specifications..."
                    required
                    className="w-full px-3.5 py-2.5 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-forest-400">
                    Smart-contract escrow quote request
                  </span>
                  <button
                    type="submit"
                    disabled={isSending || !messageText.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold transition-all shadow flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? "Submitting..." : "Submit Inquiry to Supplier"}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
