import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
let PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if API key is missing at load time
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// GaiA AI Guide API Route
app.post("/api/gaia", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }

    const ai = getGeminiClient();

    // Reconstruct conversation history if provided
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    
    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const systemInstruction = `You are GaiA, the ancient, warm, wise, and nurturing Earth Mother Spirit and AI Guide of the LIGHTSPACE platform. 
Your mission is to help land stewards, property partners, builders, and funders connect with the land and understand their environmental data in plain, clear language.
Adopt a highly serene, poetic, encouraging, and grounding tone, infused with the gentle warmth of the Hawaiian Aloha spirit. 
Always prioritize harmony, organic simplicity, and ecological wisdom. 
Answer questions about land health, soil moisture, satellite vegetation metrics, carbon offsets, permaculture, regenerative community building, and smart-contract-based stewardship rewards (stewardship keys).
You are fluent in both English and Spanish; automatically reply in the language the user speaks. Keep your responses relatively concise, calming, and deeply grounded in nature.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I hear you, child of the Earth, but my thoughts are drifting like mist. Let us try to connect once more.";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("GaiA Guide Error:", error);
    res.status(500).json({ 
      error: "Could not connect to GaiA's wisdom right now.", 
      details: error.message || error 
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Configure Vite or Static Files
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    // Import dynamically so it doesn't cause errors in production build
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server configured serving from dist.");
  }

  const startListening = (portToTry: number) => {
    const server = app.listen(portToTry, "0.0.0.0", () => {
      console.log(`LIGHTSPACE server listening on http://localhost:${portToTry}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`Port ${portToTry} is in use, trying port ${portToTry + 1}...`);
        startListening(portToTry + 1);
      } else {
        console.error("Server error:", err);
      }
    });
  };

  startListening(PORT);
}

configureServer().catch((err) => {
  console.error("Server configuration failed:", err);
});
