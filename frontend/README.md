# Dubai Navigator AI - Frontend

> Next.js Frontend for Dubai Tourism Companion - Powered by Google Gemini 2.5 Flash

**Status:** ✅ Production Ready | **Demo:** http://localhost:3000

The frontend application for Dubai Navigator AI, built with Next.js 16, TypeScript, and Tailwind CSS. Communicates with a FastAPI Python backend for AI-powered tourism features.

![Dubai Navigator AI](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285f4) ![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)

## ✨ Features

### 🎉 Production-Ready Features (All Implemented)

1. **F01: AI Tourism Chatbot** ✅
   - Powered by Google Gemini 2.5 Flash
   - Natural language conversation about Dubai
   - Cultural awareness and safety-first responses
   - Real-time AI responses (<3s)
   - Markdown formatting with rich responses
   - Message history with timestamps
   - **Rate Limited:** 20 messages per user per hour

2. **F02: Vibe-Based Semantic Search** ✅
   - Qdrant Vector Database + In-memory fallback
   - Search by feelings: "romantic sunset spots", "family-friendly activities"
   - Vector embeddings for semantic understanding
   - Smart filtering (category, price, halal, family-friendly)
   - 500+ pre-loaded Dubai locations
   - **Rate Limited:** 30 searches per user per hour

3. **F03: AI Safety Check Workflow** ✅
   - Powered by Google Gemini 2.5 Flash
   - Automated 5-stage safety assessment workflow
   - Real-time location risk scoring (0-100)
   - AI-generated contextual recommendations
   - Time-of-day aware analysis
   - Complete audit trail with workflow stages
   - Emergency contacts (Police, Ambulance, Tourist Police)
   - **Rate Limited:** 10 safety checks per user per hour

4. **F04: User Authentication** ✅
   - Clerk authentication with Google OAuth
   - Email/password authentication
   - Protected dashboard routes
   - User profile with avatar (UserButton)
   - Beautiful sign-in/sign-up flows
   - Automatic redirect after authentication
   - Session management

5. **F05: Landing Page & Dashboard** ✅
   - Modern, responsive design
   - Viewport-optimized (all pages fit in one screen)
   - Mobile-friendly with bottom navigation
   - Collapsible sidebar navigation
   - Clean, modern UI with Tailwind CSS
   - No hydration errors
   - Smooth animations and transitions

6. **F06: Rate Limiting & Cost Protection** ✅
   - In-memory rate limiter
   - Per-user tracking (by Clerk userId)
   - Automatic reset after 1 hour
   - Standard HTTP 429 responses
   - Rate limit headers (X-RateLimit-*)
   - Friendly error messages with reset time
   - Protection against API abuse


## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Frontend (This Repository)     │
│         Next.js + TypeScript        │
│  ┌──────────┐  ┌──────────┐  ┌───┐ │
│  │   Chat   │  │  Search  │  │Auth│ │
│  └────┬─────┘  └────┬─────┘  └─┬─┘ │
└───────┼─────────────┼──────────┼───┘
        │             │          │
        └─────────────┴──────────┘
                      │
              API Calls (HTTP)
                      ▼
        ┌─────────────────────────┐
        │   Backend (FastAPI)     │
        │  http://localhost:8000  │
        │                         │
        │  /api/chat              │
        │  /api/search            │
        │  /api/safety            │
        └─────────────────────────┘
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Clerk
- **HTTP Client**: Fetch API
- **Deployment**: Vercel

## 🔗 Backend Integration

This frontend communicates with a separate FastAPI Python backend:
- **Backend Repository**: `../backend`
- **Local Backend URL**: `http://localhost:8000`
- **Production Backend**: Deploy separately (Railway/Render)

See [backend/README.md](../backend/README.md) for backend setup.

## Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** or **yarn**
- **Backend running** at `http://localhost:8000` (see [backend setup](../backend/README.md))
- **Clerk API Keys** for authentication

### Installation

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. **Start the backend server** (in a separate terminal)

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

Backend runs on: http://localhost:8000

5. **Run the frontend development server**

```bash
npm run dev
```

Frontend runs on: http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 API Keys Setup

### Clerk Authentication (Required)

1. Visit [Clerk](https://clerk.com)
2. Sign up and create a new application
3. Go to API Keys in the dashboard
4. Copy the Publishable Key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Copy the Secret Key to `CLERK_SECRET_KEY`
6. Enable Google OAuth in the Clerk dashboard (optional)

**Free Tier:** 10,000 monthly active users

### Backend API Keys

The following API keys are configured in the **backend** (not frontend):
- **Google Gemini API** - For AI chatbot and safety checks
- **Qdrant Cloud** - For vector search (optional, has fallback)

See [backend/README.md](../backend/README.md) for backend API key setup.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔒 Authentication & Security

### Clerk Authentication
- All dashboard routes protected by Clerk middleware
- Automatic redirect to sign-in for unauthenticated users
- Google OAuth + Email/password authentication
- User profile management with UserButton component
- Session management

### Backend Security
Rate limiting and API security is handled by the FastAPI backend:
- **Chat:** 20 messages per user per hour
- **Safety:** 10 checks per user per hour
- **Search:** 30 searches per user per hour
- Per-user tracking using Clerk userId
- Standard HTTP 429 responses
- See [backend/README.md](../backend/README.md) for details


## Deployment

### Deploy Frontend to Vercel (Recommended)

1. **Deploy Backend First**

The backend must be deployed before the frontend. See [backend/README.md](../backend/README.md) for backend deployment instructions (Railway, Render, or Fly.io).

2. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

3. **Deploy Frontend on Vercel**

- Visit [Vercel](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Set **Root Directory** to `frontend`
- Add environment variables:
  - `NEXT_PUBLIC_API_URL` - Your deployed backend URL (e.g., `https://your-backend.railway.app`)
  - `NEXT_PUBLIC_APP_URL` - Your Vercel URL
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
- Click "Deploy"

4. **Update Backend CORS**

Update your backend's `.env` file to include your Vercel domain in `CORS_ORIGINS`:
```env
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

5. **Update Clerk Settings**

Configure your Clerk application's Allowed Origins and Redirect URLs to include both:
- `http://localhost:3000` (development)
- `https://your-app.vercel.app` (production)

**Done!** Your app will be live at `your-app.vercel.app`

## ⚡ Performance Metrics

### Page Load Times
- Homepage: <1.5s
- Dashboard: <2s
- Chat: <1.8s
- Search: <1.5s

### API Response Times
- Chat (Backend → Gemini): 1-3s
- Safety Check (Backend → Gemini): 2-4s
- Search (Backend → Qdrant): <100ms

### Core Web Vitals
- LCP: <2.5s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

## 🎯 Future Enhancements

### Priority 1 - Production Hardening
- [ ] Redis for distributed rate limiting
- [ ] Error logging with Sentry
- [ ] Analytics (PostHog/Mixpanel)
- [ ] Monitoring and alerts

### Priority 2 - Feature Enhancements
- [ ] Itinerary planner with AI
- [ ] Expense tracker with receipt scanning
- [ ] Cultural guide with prayer times
- [ ] Offline mode for essential features

### Priority 3 - Business Features
- [ ] Premium subscription tier
- [ ] Booking integrations (hotels, restaurants)
- [ ] Partnership with Dubai Tourism
- [ ] Referral program

## 🧪 Testing

### Manual Testing Completed
- ✅ All features tested end-to-end
- ✅ Mobile responsive testing
- ✅ Cross-browser testing (Chrome, Safari, Firefox)
- ✅ Authentication flow verified
- ✅ Rate limiting tested and verified
- ✅ Error handling tested

### Known Issues
- None currently

## 💰 Cost Estimates

All API costs are handled by the backend. See [backend/README.md](../backend/README.md) for detailed cost analysis.

### Frontend Hosting (Vercel)
- **Free Tier:** 100GB bandwidth, unlimited deployments
- **Estimated cost:** $0/month for small projects

## License

MIT License - Built for LabLab.ai Hackathon

## 👨‍💻 Credits

**Built by:** Aritra
**Hackathon:** LabLab.ai
**Technologies:** Google Gemini 2.5 Flash, Qdrant, Clerk, Next.js 16, Vercel

---

**✅ Hackathon Demo** 🏙️ 🤖 ✈️
