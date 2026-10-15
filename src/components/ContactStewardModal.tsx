import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Send, Sparkles, Trees, CheckCircle, Clock, ShieldCheck, 
  MessageSquare, User, Mail, HeartHandshake, Compass
} from "lucide-react";
import { LandProperty, StewardInquiry, InquiryMessage } from "../types";

interface ContactStewardModalProps {
  property: LandProperty;
  isOpen: boolean;
  onClose: () => void;
  inquiries: StewardInquiry[];
  onSendInquiry: (inquiry: StewardInquiry) => void;
  onAddMessageToInquiry: (inquiryId: string, message: InquiryMessage, autoReply?: InquiryMessage) => void;
  currentUserName?: string;
  currentUserRole?: string;
}

const TOPICS = [
  { id: "volunteering", label: "Field Volunteering & Soil Work", icon: Trees },
  { id: "research", label: "Research & Ecological Studies", icon: Compass },
  { id: "indigenous", label: "Indigenous Wisdom & Culture", icon: HeartHandshake },
  { id: "funding", label: "Conservation Funding & Resources", icon: ShieldCheck },
  { id: "general", label: "General Inquiry", icon: MessageSquare }
] as const;

export const ContactStewardModal: React.FC<ContactStewardModalProps> = ({
  property,
  isOpen,
  onClose,
  inquiries,
  onSendInquiry,
  onAddMessageToInquiry,
  currentUserName = "Land Ally",
  currentUserRole = "Contributor"
}) => {
  // Find any existing inquiry for this property
  const existingInquiry = inquiries.find(i => i.propertyId === property.id);

  const [activeTab, setActiveTab] = useState<"new" | "thread">(existingInquiry ? "thread" : "new");
  const [topic, setTopic] = useState<StewardInquiry["topic"]>("volunteering");
  const [senderName, setSenderName] = useState(currentUserName);
  const [senderContact, setSenderContact] = useState("");
  const [messageText, setMessageText] = useState("");
  const [threadReplyText, setThreadReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isStewardTyping, setIsStewardTyping] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "thread") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, existingInquiry?.messages, isStewardTyping]);

  if (!isOpen) return null;

  // Generate simulated contextual reply from the steward
  const generateStewardReply = (sentTopic: StewardInquiry["topic"], text: string): InquiryMessage => {
    let reply = `Aloha and greetings from ${property.name}. I received your message: "${text.slice(0, 40)}..."`;
    if (sentTopic === "volunteering") {
      reply = `Aloha ${senderName}! Mahalo for stepping forward to care for our soil and canopy. We hold community planting and bio-swale monitoring circles every week. We'd be honored to have your hands on the land!`;
    } else if (sentTopic === "funding") {
      reply = `Aloha! Your stewardship funding proposal for ${property.name} resonates deeply. Every dollar or token deployed here goes directly to bio-char inoculation, gravity water trenches, and seed nurseries. Let's arrange a sacred walk or digital circle.`;
    } else if (sentTopic === "research") {
      reply = `Greetings, researcher. Our on-chain multi-sensor arrays and satellite indices are open for verified ecological studies. We welcome your partnership in tracking biodiversity regeneration!`;
    } else if (sentTopic === "indigenous") {
      reply = `Mahalo nui loa for honoring the ancient lineages and ahupuaʻa traditions of this land. We walk with humility and welcome your shared reverence.`;
    } else {
      reply = `Aloha and blessings. Thank you for reaching out to ${property.name}. I have received your words and will reply in depth as soon as the sun sets over the ridge.`;
    }

    return {
      id: `msg-steward-reply-${Date.now()}`,
      sender: property.steward,
      senderRole: "Primary Property Steward",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: true
    };
  };

  const handleStartInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;

    setIsSending(true);

    const userMessage: InquiryMessage = {
      id: `msg-user-${Date.now()}`,
      sender: senderName || "Land Ally",
      senderRole: currentUserRole,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: false
    };

    const newInquiryId = `inq-steward-${Date.now()}`;
    const newInquiry: StewardInquiry = {
      id: newInquiryId,
      propertyId: property.id,
      propertyName: property.name,
      stewardName: property.steward,
      senderName: senderName || "Land Ally",
      senderContact: senderContact || "messenger@lightspace.earth",
      topic,
      status: "sent",
      unreadReplies: 0,
      createdAt: new Date().toISOString(),
      messages: [userMessage]
    };

    onSendInquiry(newInquiry);
    setMessageText("");
    setIsSending(false);
    setSentSuccess(true);
    setActiveTab("thread");

    // Simulate steward typing and answering
    setTimeout(() => {
      setSentSuccess(false);
      setIsStewardTyping(true);
      setTimeout(() => {
        setIsStewardTyping(false);
        const autoReply = generateStewardReply(topic, userMessage.text);
        onAddMessageToInquiry(newInquiryId, autoReply);
      }, 1800);
    }, 1200);
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadReplyText.trim() || !existingInquiry || isSending) return;

    const userMsg: InquiryMessage = {
      id: `msg-user-${Date.now()}`,
      sender: senderName || "You",
      senderRole: currentUserRole,
      text: threadReplyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStewardOrSupplier: false
    };

    onAddMessageToInquiry(existingInquiry.id, userMsg);
    const sentText = threadReplyText.trim();
    setThreadReplyText("");

    // Simulate steward response
    setIsStewardTyping(true);
    setTimeout(() => {
      setIsStewardTyping(false);
      const autoReply = generateStewardReply(existingInquiry.topic, sentText);
      onAddMessageToInquiry(existingInquiry.id, autoReply);
    }, 2000);
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
        {/* Header with Steward Profile */}
        <div className="p-5 sm:p-6 bg-forest-900/40 border-b border-forest-800/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-forest-950/60 border border-forest-800 text-forest-400 hover:text-earth-sand hover:border-amber-gold/50 transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 border border-amber-gold/40 flex items-center justify-center font-serif text-2xl font-bold text-amber-gold shadow-lg">
                {property.steward[0]}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-forest-950 flex items-center justify-center" title="Steward Active">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="font-serif text-lg sm:text-xl text-earth-sand font-bold">
                  Reach Out to {property.steward}
                </h3>
                {property.stewardKeyTier && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-gold border border-amber-gold/30">
                    {property.stewardKeyTier}
                  </span>
                )}
              </div>
              <p className="text-xs text-forest-300 font-serif">
                Primary Land Steward at <span className="text-amber-gold/90 font-medium">{property.name}</span> • {property.location}
              </p>
              <p className="text-[11px] font-mono text-forest-400 flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{property.stewardResponseTime || "Usually responds within 2 hours"}</span>
              </p>
            </div>
          </div>

          {property.stewardBio && (
            <p className="mt-3 text-xs italic text-forest-300/90 font-serif bg-forest-950/40 p-2.5 rounded-xl border border-forest-800/20">
              "{property.stewardBio}"
            </p>
          )}

          {/* Tab Switcher if existing inquiry exists */}
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
                <span>Active Conversation ({existingInquiry.messages.length})</span>
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
                <span>New Outreach Topic</span>
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
                {/* Topic Banner */}
                <div className="flex items-center justify-between text-[11px] font-mono text-forest-400 pb-2 border-b border-forest-800/20">
                  <span className="uppercase">Topic: <strong className="text-earth-sand">{existingInquiry.topic}</strong></span>
                  <span className="text-emerald-400">Status: {existingInquiry.status}</span>
                </div>

                {/* Messages Stream */}
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
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isStewardTyping && (
                    <div className="flex items-center space-x-2 text-forest-400 text-xs font-mono py-1">
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-amber-gold animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] italic text-amber-gold/80">{property.steward} is penning a reply...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Thread Reply Box */}
                <form onSubmit={handleSendThreadReply} className="pt-2 border-t border-forest-800/30 flex gap-2">
                  <input
                    type="text"
                    value={threadReplyText}
                    onChange={(e) => setThreadReplyText(e.target.value)}
                    placeholder={`Message ${property.steward}...`}
                    className="flex-1 px-3.5 py-2.5 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                  />
                  <button
                    type="submit"
                    disabled={!threadReplyText.trim() || isStewardTyping}
                    className="px-4 py-2.5 bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold rounded-xl transition-all shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              /* New Outreach Form */
              <motion.form
                key="new-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleStartInquiry}
                className="space-y-4"
              >
                {/* Topic Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                    Choose Outreach Reason
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TOPICS.map((t) => {
                      const Icon = t.icon;
                      const isSelected = topic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTopic(t.id)}
                          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-amber-gold/15 border-amber-gold/60 text-earth-sand shadow"
                              : "bg-forest-900/20 border-forest-800/40 text-forest-300 hover:border-forest-700"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? "text-amber-gold" : "text-forest-400"}`} />
                          <span className="text-xs font-serif">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sender Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block flex items-center space-x-1">
                      <User className="w-3 h-3 text-amber-gold" />
                      <span>Your Name / Collective</span>
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Maya Lin, Aloha Agroforestry"
                      required
                      className="w-full px-3 py-2 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-amber-gold" />
                      <span>Contact Email / Handle</span>
                    </label>
                    <input
                      type="text"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      placeholder="e.g. steward@example.org or @telegram"
                      required
                      className="w-full px-3 py-2 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-forest-400 uppercase tracking-wider block">
                    Your Message to {property.steward}
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    placeholder="Introduce yourself, your heart for the land, and how you would like to collaborate or offer support..."
                    required
                    className="w-full px-3.5 py-2.5 bg-forest-900/50 border border-forest-800 rounded-xl text-earth-sand text-xs font-serif focus:outline-none focus:border-amber-gold/50 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-forest-400">
                    Encrypted on-chain dispatch & steward relay
                  </span>
                  <button
                    type="submit"
                    disabled={isSending || !messageText.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-gold hover:bg-yellow-400 text-forest-950 font-mono text-xs font-bold transition-all shadow flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? "Dispatching..." : "Send Message to Steward"}</span>
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
