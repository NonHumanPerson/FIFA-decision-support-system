# MatchDay Genie - FIFA World Cup 2026 🏆

MatchDay Genie is a GenAI-enabled full-stack solution designed to enhance stadium operations and the overall tournament experience for fans, organizers, and venue staff during the FIFA World Cup 2026. It leverages Google's Gemini AI and modern web technologies to provide real-time assistance, interactive mapping, and operational intelligence.

## 🌟 Key Features

### 🏟️ Fan Hub
- **Multilingual AI Assistant**: Powered by Gemini 2.5 Flash, the chatbot assists fans with stadium navigation, transportation, accessibility, and stadium rules based on their current location.
- **Interactive Stadium Map**: A responsive, interactive SVG map built with D3.js. It highlights key amenities like concessions, restrooms, and emergency exits, with interactive filtering capabilities.
- **Context-Aware Recommendations**: The chatbot takes the fan's real-time location (e.g., "Gate B") to provide hyper-localized guidance.

### 🛡️ Command Center (Staff Operations)
- **Real-Time Telemetry**: Monitor live stadium metrics including attendance, temperature, and gate congestion.
- **Incident Management**: View active incident reports, medical alerts, and security updates.
- **AI Decision Support**: Generate actionable, real-time action plans for crowd management and resource allocation using Gemini's advanced analysis capabilities based on selected incidents and current metrics.

### 🎨 Universal Features
- **Dark Mode**: Accessible light/dark theme toggle to suit different environments.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on both mobile and desktop devices.
- **Accessible**: Implements proper ARIA attributes, semantic HTML, and mindful color contrasts.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, D3.js, React Markdown, DOMPurify
- **Backend**: Node.js, Express.js (with Helmet, Express Rate Limit, Compression)
- **AI Integration**: Google GenAI SDK (`@google/genai`) using `gemini-2.5-flash`
- **Testing**: Vitest, React Testing Library
- **Language**: TypeScript (Strict Mode)

## 📂 Architecture & Project Structure

The application follows a full-stack SPA architecture where Vite is served via Express in both development and production.

```text
├── server.ts                    # Express server (API & Static Asset Serving)
├── src/
│   ├── App.tsx                  # Main application component & routing state
│   ├── App.test.tsx             # Main integration tests
│   ├── index.css                # Global styles and Tailwind configuration
│   ├── main.tsx                 # React entry point
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts             # Utility functions (e.g., Tailwind class merging)
│   └── components/
│       ├── FanHub.tsx           # Fan-facing AI chat interface & layout
│       ├── FanHub.test.tsx      # Tests for the Fan Hub
│       ├── StadiumMap.tsx       # D3.js interactive stadium map
│       ├── StadiumMap.test.tsx  # Tests for the Stadium Map
│       ├── StaffDashboard.tsx   # Staff operational command center
│       └── StaffDashboard.test.tsx # Tests for Staff Dashboard
├── package.json                 # Project metadata and dependencies
├── vite.config.ts               # Vite & Vitest configuration
└── tsconfig.json                # TypeScript compiler configuration
```

## 🔌 API Reference

### `POST /api/chat`
Handles fan interactions with the MatchDay Genie assistant.
- **Body**: `{ message: string, history: ChatMessage[], userLocation?: string }`
- **Response**: `{ text: string }`

### `POST /api/staff/insights`
Generates real-time AI operational insights for stadium staff.
- **Body**: `{ metrics: StadiumMetrics, incident: string }`
- **Response**: `{ insights: string }`

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: A `.env.example` file is provided for reference.)*

### 3. Development Mode
Run the full-stack app in development mode (starts Express server with Vite middleware on port 3000):
```bash
npm run dev
```

### 4. Production Build
Build the React client and compile the Express backend into a single `server.cjs` bundle, then start it:
```bash
npm run build
npm run start
```

## 🔒 Security & Performance Features

We take security and performance seriously for large-scale stadium deployments:
- **Rate Limiting**: `express-rate-limit` is configured to prevent API abuse (max 100 requests / 15 mins per IP).
- **Security Headers**: `helmet` is utilized in production to set secure HTTP response headers.
- **Payload Validation**: Strict size limits and type checking on incoming Express JSON bodies to prevent excessive data consumption.
- **Cross-Site Scripting (XSS) Prevention**: `DOMPurify` is used on the frontend to sanitize any Markdown or HTML rendered from the AI responses.
- **Lazy AI Initialization**: The Gemini API client initializes lazily to ensure environment variables are present and fails gracefully.
- **Compression**: Gzip compression is enabled via the `compression` middleware to reduce payload sizes and speed up delivery.
- **Optimized Bundling**: Custom Vite/Rollup chunking separates `node_modules` into a vendor bundle to improve caching.

## 🧪 Testing

The project is fully unit-tested using Vitest and React Testing Library.

Run the test suite:
```bash
npm test
```

Check code quality/linting:
```bash
npm run lint
```
