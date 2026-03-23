<div align="center">
  <h1>🧠 MoodEcho</h1>
  <p><strong>AI-Powered Mental Wellness & Mood Intelligence Platform</strong></p>

  <p>
    <a href="https://moodecho.vercel.app">🌐 Live Demo</a> •
    <a href="#features">✨ Features</a> •
    <a href="#tech-stack">🛠️ Tech Stack</a> •
    <a href="#installation">📦 Setup</a> •
    <a href="#api-docs">📖 API Docs</a>
  </p>

  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</div>

---

## 📋 About

**MoodEcho** is a full-stack mental wellness platform that helps users track, understand, and improve their emotional health through **AI-powered mood analysis**, **guided wellness exercises**, and **real-time peer support**.

Unlike simple mood trackers that just log emojis, MoodEcho uses **Google Gemini AI** to analyze journal entries, detect emotional patterns, provide personalized wellness insights, and automatically detect crisis situations — helping users build genuine self-awareness over time.

> ⚠️ **Disclaimer**: MoodEcho is a wellness tool, not a medical device. It is not a substitute for professional mental health care. If you're in crisis, please contact a mental health professional or your local emergency helpline.

---

## ✨ Features

### 🧠 Intelligent Mood Tracking
- **Journal-Based Logging** — Write how you feel in your own words
- **AI Sentiment Analysis** — Gemini AI detects emotions from text
- **Multi-Factor Tracking** — Mood score + energy + sleep + triggers + emotions
- **Daily Streaks** — Gamified consistency tracking with milestone notifications

### 📊 Smart Analytics
- **Mood Over Time Chart** — Interactive area chart of daily mood averages
- **Weekday Patterns** — Bar chart showing which days you feel best/worst
- **Top Emotions & Triggers** — Progress bars showing most frequent patterns
- **AI Weekly Insights** — Gemini generates personalized weekly mood reports with recommendations

### 🆘 Crisis Detection & Safety
- **Keyword Detection** — Automatic detection of distress signals in journal entries
- **Severity Levels** — High and medium crisis classification
- **Real-time Alerts** — Instant crisis banner with helpline numbers via Socket.IO
- **Emergency Resources** — Dedicated helplines page (India, USA, UK, Global)
- **Safety Disclaimers** — Responsible mental health messaging on every page

### 🧘 Guided Wellness Exercises
- **Box Breathing** — 4-4-4-4 breathing technique with visual timer
- **4-7-8 Breathing** — Calming technique with animated guide
- **Gratitude Journal** — Three Good Things exercise with AI prompts
- **5-4-3-2-1 Grounding** — Sensory grounding technique with step-by-step guide
- **Activity Logging** — Track completed exercises and mood improvement

### 💬 Real-Time Peer Support
- **Anonymous Support Rooms** — Topic-based group chat (Anxiety, Work Stress, Positivity, etc.)
- **Real-time Messaging** — Socket.IO powered instant chat
- **Encouragement System** — Send/receive positive affirmations
- **Content Moderation** — Anonymous by default for user safety

### 🔔 Smart Notifications
- **Mood Reminders** — Daily check-in prompts
- **Streak Milestones** — Celebration at 3, 7, 14, 30, 60, 100 days
- **Crisis Resources** — Automatic helpline notification when crisis detected
- **Wellness Suggestions** — AI recommends exercises based on current mood
- **Weekly Reports** — Notification when AI insights are ready
- **Real-time Delivery** — Push via Socket.IO

### 🔒 Privacy & Data Control (GDPR Compliant)
- **Data Export** — Download all your data as JSON
- **Account Deletion** — Permanently delete account and all associated data
- **HTTP-Only Cookies** — Secure cross-domain authentication
- **JWT Token Rotation** — Access + refresh token system

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Redux Toolkit** | State management |
| **React Router v6** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP client with interceptors |
| **Recharts** | Data visualization (charts) |
| **Lucide React** | Icon library |
| **Framer Motion** | Animations |
| **React Hot Toast** | Toast notifications |
| **date-fns** | Date utilities |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 20** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Google Gemini AI** | Sentiment analysis & insights |
| **Socket.IO** | WebSocket server |
| **Redis (optional)** | Caching layer |
| **JWT** | Authentication tokens |
| **bcrypt.js** | Password hashing (12 rounds) |
| **express-validator** | Input validation |
| **express-rate-limit** | Rate limiting |
| **Helmet** | Security headers |
| **Winston** | Structured logging |
| **Morgan** | HTTP request logging |

### Deployment
| Platform | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **Docker** | Containerization |
| **GitHub** | Version control |

---

## 🏗️ Architecture
┌──────────────┐ ┌──────────────┐ ┌──────────┐
│ React SPA │ HTTPS │ Express API │ TCP │ MongoDB │
│ (Vercel) │◄──────►│ (Render) │◄──────►│ Atlas │
│ │ │ │ └──────────┘
│ • Redux │ WS │ • REST API │
│ • Recharts │◄──────►│ • Socket.IO │ ┌──────────┐
│ • Tailwind │ │ • Gemini AI │◄──────►│ Redis │
└──────────────┘ │ • JWT Auth │ TCP │ (opt.) │
└──────────────┘ └──────────┘

text


---

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (free: https://aistudio.google.com/apikey)

### 1. Clone Repository

```bash
git clone https://github.com/Monisha-e125/moodecho.git
cd moodecho
2. Backend Setup
Bash

cd server
npm install
cp .env.example .env
Configure server/.env:

env

NODE_ENV=development
PORT=4001
MONGO_URI=mongodb+srv://moodEcho:Y9I9jtbGaWmQxXqi@cluster0.179tjaj.mongodb.net/appName=moodecho
JWT_SECRET=your-jwt-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
GEMINI_API_KEY=AIzaSyCFVgaeoCUnns1xstak1oRnq8dMR1VjuoU
CLIENT_URL=http://localhost:5173
Bash

npm run dev
3. Frontend Setup
Bash

cd client
npm install
cp .env .env.local
Configure client/.env:

env

VITE_API_URL=http://localhost:4001/api/v1
VITE_SOCKET_URL=http://localhost:4001
VITE_APP_NAME=MoodEcho
Bash

npm run dev
4. Open in Browser
text

Frontend: http://localhost:5173
Backend:  http://localhost:4001
API:      http://localhost:4001/api/v1
Health:   http://localhost:4001/api/health
📖 API Docs
Base URL
text

Development: http://localhost:4001/api/v1
Production:  https://moodecho-api.onrender.com/api/v1
Authentication
Method	Endpoint	Description	Auth
POST	/auth/register	Register new user	❌
POST	/auth/login	Login	❌
POST	/auth/logout	Logout	✅
GET	/auth/me	Get profile	✅
PUT	/auth/profile	Update profile	✅
POST	/auth/refresh-token	Refresh JWT	❌
GET	/auth/export	Export all data (GDPR)	✅
DELETE	/auth/account	Delete account (GDPR)	✅
Mood
Method	Endpoint	Description	Auth
POST	/mood	Log mood entry (+ AI analysis)	✅
GET	/mood	Get mood history (paginated)	✅
GET	/mood/today	Get today's entries	✅
GET	/mood/:id	Get single entry	✅
DELETE	/mood/:id	Delete entry	✅
Analytics
Method	Endpoint	Description	Auth
GET	/analytics/stats?days=30	Mood statistics	✅
GET	/analytics/calendar?year=2024&month=3	Calendar heatmap	✅
GET	/analytics/insights	AI weekly insights	✅
GET	/analytics/suggest-exercise?mood=3	AI exercise suggestion	✅
Wellness
Method	Endpoint	Description	Auth
GET	/wellness/exercises	Get all exercises	✅
POST	/wellness/log	Log completed activity	✅
GET	/wellness/history	Activity history	✅
GET	/wellness/stats	Wellness statistics	✅
Support
Method	Endpoint	Description	Auth
GET	/support/helplines	Get crisis helplines	❌
GET	/support/rooms	Get support rooms	✅
GET	/support/rooms/:id/messages	Get room messages	✅
POST	/support/rooms/:id/messages	Send message	✅
Notifications
Method	Endpoint	Description	Auth
GET	/notifications	Get all notifications	✅
GET	/notifications/unread-count	Unread count	✅
PUT	/notifications/read-all	Mark all read	✅
PUT	/notifications/:id/read	Mark one read	✅
DELETE	/notifications/clear	Clear all	✅
DELETE	/notifications/:id	Delete one	✅
📁 Project Structure
text

moodecho/
├── server/                          # Backend
│   ├── server.js                    # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js                   # Express app
│       ├── config/
│       │   ├── database.js          # MongoDB
│       │   ├── redis.js             # Redis
│       │   ├── socket.js            # Socket.IO
│       │   ├── gemini.js            # Gemini AI
│       │   └── constants.js         # App constants
│       ├── models/
│       │   ├── User.js
│       │   ├── MoodEntry.js
│       │   ├── WellnessActivity.js
│       │   ├── SupportRoom.js
│       │   ├── Message.js
│       │   └── Notification.js
│       ├── controllers/             # Route handlers
│       ├── services/                # Business logic
│       │   ├── aiService.js         # Gemini integration
│       │   ├── crisisService.js     # Crisis detection
│       │   ├── analyticsService.js  # Mood analytics
│       │   └── notificationService.js
│       ├── routes/                  # API routes
│       ├── middleware/              # Auth, validation, errors
│       ├── validators/             # Input rules
│       └── utils/                  # Logger, helpers
│
├── client/                          # Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/axios.js
│       ├── services/               # API call functions
│       ├── store/                   # Redux store + slices
│       ├── hooks/                   # Custom hooks
│       ├── context/                 # Socket context
│       ├── components/
│       │   ├── common/             # Button, Input, Modal, Loader
│       │   ├── layout/             # Layout, Sidebar, Navbar
│       │   ├── mood/               # MoodCard, MoodCalendar, etc.
│       │   ├── analytics/          # Charts, InsightCard, etc.
│       │   ├── wellness/           # Breathing, Gratitude, Grounding
│       │   └── support/            # ChatMessage, Encouragement
│       └── pages/                  # All page components
│
└── README.md
🔒 Security
🔐 JWT dual-token authentication (access + refresh)
🍪 HTTP-only cookies with sameSite: none for cross-domain
🛡️ Helmet.js security headers
⏱️ Rate limiting (100 req/15min general, 15 req/hr auth)
🔑 bcrypt password hashing (12 salt rounds)
✅ express-validator input validation
🚫 CORS whitelisted origins only
🔄 Token rotation on refresh
🆘 Crisis Resources
If you or someone you know is struggling:

Country	Helpline	Number
🇮🇳 India	iCall	9152987821
🇮🇳 India	Vandrevala Foundation	1860-2662-345
🇮🇳 India	AASRA	9820466726
🇺🇸 USA	Suicide & Crisis Lifeline	988
🇺🇸 USA	Crisis Text Line	Text HOME to 741741
🇬🇧 UK	Samaritans	116 123
🌍 Global	Befrienders	www.befrienders.org
🚀 Deployment
See detailed deployment guide below for Vercel + Render.

🤝 Contributing
Fork the repository
Create feature branch (git checkout -b feature/new-feature)
Commit changes (git commit -m 'Add new feature')
Push to branch (git push origin feature/new-feature)
Open a Pull Request
📄 License
MIT License — see LICENSE file.

👩‍💻 Author
Monisha E

GitHub: @Monisha-e125
Email: monishae2830@gmail.com
<div align="center"> <p>Built with ❤️ for better mental wellness</p> <p><em>Remember: It's okay to not be okay. Reach out for help.</em> 💙</p> </div> ```