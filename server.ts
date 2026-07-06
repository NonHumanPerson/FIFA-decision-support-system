import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security: Apply rate limiting to all requests
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." }
  });

  app.use(express.json());
  app.use("/api/", apiLimiter);

  // Initialize Gemini lazily
  let aiClient: GoogleGenAI | null = null;
  function getAIClient() {
    if (!aiClient) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API route for Fan Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const ai = getAIClient();
      const { message, history, userLocation } = req.body;
      
      // Security: Validate input payload to prevent excessive data consumption
      if (!message || typeof message !== "string" || message.length > 500) {
        return res.status(400).json({ error: "Invalid or oversized message." });
      }
      if (!Array.isArray(history) || history.length > 50) {
        return res.status(400).json({ error: "Invalid or excessive history length." });
      }

      const systemInstruction = `You are the official 'MatchDay Genie' for the FIFA World Cup 2026. 
You assist fans with stadium navigation, transportation, accessibility, and stadium rules.
The user is currently located at: ${userLocation || 'Unknown'}.
Be concise, friendly, and helpful. Use multiple languages if the user speaks to you in a different language.
Provide realistic-sounding advice for a stadium context (e.g., direct them to nearest gates, food stalls, restrooms).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Error in chat API:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // API route for Staff Operations Insights
  app.post("/api/staff/insights", async (req, res) => {
    try {
      const ai = getAIClient();
      const { metrics, incident } = req.body;
      
      // Security: Validate input
      if (!incident || typeof incident !== "string" || incident.length > 500) {
        return res.status(400).json({ error: "Invalid or oversized incident report." });
      }

      const systemInstruction = `You are an AI Operational Intelligence Assistant for stadium management at the FIFA World Cup 2026.
Analyze the provided stadium metrics and recent incidents, and provide actionable real-time decision support.
Focus on crowd management, resource allocation (security, medical, staff), and safety.
Format your response with clear, actionable bullet points.`;

      const prompt = `Current Stadium Metrics:
${JSON.stringify(metrics, null, 2)}

Recent Incident / Issue Reported:
"${incident}"

Please provide an operational analysis, potential risks, and recommended actions.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          temperature: 0.5,
        }
      });

      res.json({ insights: response.text });
    } catch (error) {
      console.error("Error in insights API:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
