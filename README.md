# LumiChat — Personal Full-Stack Chat Interface
A modern, fully responsive ChatGPT-style interface built with **React + TailwindCSS + Express**.  
Supports **session-based conversations**, **structured responses**, and a clean **dark / pure-black dark theme**.
---
##  Key Features
### 🔹 Frontend (React + TailwindCSS)
- Responsive two-pane layout: **Sidebar (slide-drawer)** + Chat Window  
- **Slide-drawer (mobile)** — the sidebar becomes a sliding drawer on small screens for a native chat-app feel  
- Sidebar includes:
  - Session list  
  - Create new chat  
  - Delete session  
  - User info block  
- **Theme toggle** (Light / Pure Black Dark Mode)  
- Chat UI:
  - User & Assistant message bubbles  
  - Typing animation with dots  
  - Structured (tabular) response view  
  - Feedback buttons (👍 / 👎)  
- Built with **Tailwind CSS v4** for fast styling and consistent design

### 🔹 Backend (Node.js + Express)
- Lightweight REST API with mock JSON responses  
- Session-based conversation store (in-memory)  
- API Endpoints:
  - `GET /api/sessions`
  - `GET /api/new-chat`
  - `GET /api/session/:id`
  - `POST /api/chat/:id`
  - `DELETE /api/session/:id`

---

## ▶️ Running Locally

### 1) Start Backend
```bash
cd backend
npm install
npm start
By default the backend runs on http://localhost:3001 (adjust PORT as needed).

2) Start Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Vite typically serves at http://localhost:5173.

Ensure the frontend is configured to use the backend URL:

Vite: VITE_API_BASE_URL=http://localhost:3001

Example usage in code:

js
Copy code
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
🧭 UX Notes — Slide Drawer / Divider Behavior
On desktop, the Sidebar appears as a persistent left column showing session list and user info.

On mobile/tablet, the Sidebar becomes a slide-drawer (sliding in from the left). This allows:

Quick session switching without leaving the main chat view

A ChatGPT-like mobile experience (tap the menu button to slide the sidebar open)

The drawer includes a subtle divider and backdrop overlay for focus; transitions are smooth and accessible.

🛠 Tech Stack
Frontend

React (Hooks + Router)

Tailwind CSS v4

Vite

Backend

Node.js

Express

CORS

🌐 Deployment
Recommended (separate services)
Frontend → Vercel

Root directory: frontend

Build command: npm run build or vite build

Output dir: dist

Set env var

Backend → Render / Railway / Heroku

Start command: npm start

Ensure CORS allows the frontend origin (or use cors() for development)

https://chatapp-eight-wheat.vercel.app/
