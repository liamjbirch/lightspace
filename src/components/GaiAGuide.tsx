import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, MessageSquare, Compass, ArrowLeft, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

interface GaiAGuideProps {
  onBack: () => void;
}

const CONVERSATION_SUGGESTIONS = [
  { text: "What is an Ahupuaʻa land system?", label: "Indigenous Wisdom" },
  { text: "How do satellite sensors track soil moisture & biomass?", label: "Earth Sensors" },
  { text: "How do I earn income through Stewardship Keys?", label: "Smart Contracts" },
  { text: "Enseñame en Español cómo cuidar mi tierra.", label: "En Español" }
];

export const GaiAGuide: React.FC<GaiAGuideProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Aloha, gentle steward. I am GaiA, the spirit of this land. Here in LIGHTSPACE, we seek to walk in harmony with the soil, the water, and the wind. Ask me of the ancient agricultural pathways, how our satellite guardians monitor the valleys, or how you may unlock rewards for caring for our planet. I am listening.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    
    const userMsg: ChatMessage = {
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Create history in format expected by server
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/gaia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history })
      });

      if (!res.ok) {
        throw new Error("Could not reach GaiA's wisdom. Check your network or secrets.");
      }

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "GaiA's voice has drifted into the mist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        role: "model",
        text: "The slate is cleansed, steward. The winds have carried past thoughts into the ocean. Speak anew, and let us co-create a green path forward.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto bg-forest-950/80 border border-forest-800/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Radiant glow in top-right */}
      <div className="absolute w-56 h-56 rounded-full bg-amber-gold/5 blur-[100px] top-0 right-0 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-forest-800/30 pb-5 mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-forest-900/40 border border-forest-800/30 hover:border-amber-gold/40 text-earth-sand hover:text-amber-gold transition-colors"
            title="Return to the woods"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-gold animate-pulse" />
              <h2 className="font-serif text-2xl text-earth-sand font-medium">GaiA Guide</h2>
            </div>
            <p className="text-xs text-forest-300 font-mono tracking-widest uppercase mt-0.5">
              Cap. 08 — Indigenous & Sensor AI Spirit
            </p>
          </div>
        </div>
        
        <button
          onClick={clearHistory}
          className="self-start sm:self-center flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-900/30 border border-forest-800/20 text-xs text-forest-300 hover:text-amber-gold hover:border-amber-gold/20 transition-all font-mono uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Memory</span>
        </button>
      </div>

      {/* Main chat output container */}
      <div className="h-[400px] overflow-y-auto pr-2 space-y-4 mb-6 scrollbar">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed text-sm shadow-md border ${
                msg.role === "user"
                  ? "bg-forest-800/40 text-earth-sand border-forest-700/50 rounded-tr-none"
                  : "bg-forest-900/55 text-earth-sand/90 border-forest-800/55 rounded-tl-none font-serif italic"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-forest-400 mb-1">
                <span className="uppercase tracking-widest">
                  {msg.role === "user" ? "Steward" : "GaiA"}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-forest-900/50 border border-forest-800/40 rounded-2xl rounded-tl-none px-6 py-4 flex items-center space-x-3 shadow-md">
              <div className="flex space-x-1">
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-amber-gold"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-forest-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                />
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-amber-gold"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-forest-300 font-mono italic">GaiA is listening to the forest roots...</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-950/40 border border-red-900/50 rounded-xl p-3.5 text-center text-xs text-red-300"
          >
            <p className="font-mono">{error}</p>
            <p className="text-[10px] text-red-400/80 mt-1">
              Ensure you have set your GEMINI_API_KEY in the Secrets panel.
            </p>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="mb-5">
        <p className="text-[10px] font-mono text-forest-400 uppercase tracking-widest mb-2">
          Commune through suggested questions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CONVERSATION_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              disabled={loading}
              onClick={() => handleSend(sug.text)}
              className="text-left px-4 py-2.5 rounded-xl bg-forest-900/30 border border-forest-800/40 text-xs text-earth-sand hover:bg-forest-800/40 hover:border-amber-gold/30 transition-all flex items-start space-x-2.5 group"
            >
              <Compass className="w-3.5 h-3.5 text-amber-gold mt-0.5 opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all flex-shrink-0" />
              <div>
                <span className="text-[9px] font-mono text-forest-400 uppercase tracking-wider block">
                  {sug.label}
                </span>
                <span className="font-serif italic leading-snug block mt-0.5 group-hover:text-amber-gold transition-colors">
                  "{sug.text}"
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="relative flex items-center bg-forest-950 border border-forest-800 rounded-2xl overflow-hidden focus-within:border-amber-gold/50 transition-all duration-300 shadow-inner"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Whisper your question to GaiA (e.g., Explain land carbon offset smart contracts...)"
          className="flex-grow px-5 py-4 bg-transparent border-none text-earth-sand placeholder-forest-400/70 focus:outline-none focus:ring-0 text-sm font-serif"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="mr-3 p-3 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-forest-800 hover:border-amber-gold/40 text-amber-gold disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};
