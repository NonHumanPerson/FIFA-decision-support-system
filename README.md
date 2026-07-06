# MatchDay Genie - FIFA World Cup 2026 🏆

MatchDay Genie is a GenAI-enabled full-stack solution designed to enhance stadium operations and the overall tournament experience for fans, organizers, and venue staff during the FIFA World Cup 2026. It leverages Google's Gemini AI and modern web technologies to provide real-time assistance, interactive mapping, and operational intelligence.

## 🌟 Key Features

### 🏟️ Fan Hub
- **Multilingual AI Assistant**: Powered by Gemini, the chatbot assists fans with stadium navigation, transportation, accessibility, and stadium rules based on their current location.
- **Interactive Stadium Map**: A responsive, interactive SVG map built with D3.js. It highlights key amenities like concessions, restrooms, and emergency exits, with interactive filtering capabilities.

### 🛡️ Command Center (Staff Operations)
- **Real-Time Telemetry**: Monitor live stadium metrics including attendance, temperature, and gate congestion.
- **Incident Management**: View active incident reports and medical alerts.
- **AI Decision Support**: Generate actionable, real-time action plans for crowd management and resource allocation using Gemini's advanced analysis capabilities based on selected incidents and current metrics.

### 🎨 Universal Features
- **Dark Mode**: Accessible light/dark theme toggle to suit different environments.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on both mobile and desktop devices.
- **Accessible**: Implements proper ARIA attributes, semantic HTML, and mindful color contrasts.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, D3.js, React Markdown
- **Backend**: Node.js, Express.js
- **AI Integration**: Google GenAI SDK (`@google/genai`) using `gemini-2.5-flash`
- **Language**: TypeScript

## 📂 Project Structure

```text
├── server.ts                    # Express server and Gemini API routes
├── src/
│   ├── App.tsx                  # Main application component & navigation
│   ├── index.css                # Global styles and Tailwind configuration
│   ├── main.tsx                 # React entry point
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts             # Utility functions (e.g., Tailwind class merging)
│   └── components/
│       ├── FanHub.tsx           # Fan-facing AI chat interface
│       ├── StadiumMap.tsx       # D3.js interactive stadium map
│       └── StaffDashboard.tsx   # Staff operational command center
├── package.json                 # Project metadata and dependencies
└── vite.config.ts               # Vite configuration
```

## ⚙️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Development Mode:**
   Run the full-stack app in development mode (starts Express server with Vite middleware):
   ```bash
   npm run dev
   ```

4. **Production Build:**
   Build the client and server for production:
   ```bash
   npm run build
   npm run start
   ```

## 🔒 Security & Quality
- **Input Validation**: Backend API routes validate incoming message length, history size, and incident data to prevent abuse.
- **Lazy Initialization**: The Gemini API client initializes lazily to ensure environment variables are present and avoid startup crashes.
- **Testing**: Includes Vitest setup for component and application testing.
