# 🏙️ Dubai Navigator AI (Dubify)

> Your Intelligent Tourism Companion for Dubai - Full-Stack Application with AI-Powered Features

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB)](https://www.python.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285f4)](https://ai.google.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)](https://clerk.com/)

**Live Demo:** [https://dubify-five.vercel.app](https://dubify-five.vercel.app)

A comprehensive full-stack AI tourism application featuring Google Gemini 2.5 Flash AI, Qdrant vector search, intelligent rate limiting, and modern authentication.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Docker Setup](#running-with-docker)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Dubai Navigator AI is a **full-stack web application** that helps tourists explore Dubai safely and intelligently using AI-powered features:

- 🤖 **AI Tourism Chatbot** - Natural conversations about Dubai powered by Gemini 2.5 Flash
- 🔍 **Semantic Search** - Find places by "vibes" using vector embeddings and Qdrant
- 🛡️ **AI Safety Assessment** - Real-time location safety analysis with risk scoring
- 🔐 **Secure Authentication** - Clerk-powered auth with Google OAuth

### Why This Project Stands Out

- **Polyglot Development**: TypeScript frontend + Python backend showcasing versatility
- **Modern AI Integration**: Google's latest Gemini 2.5 Flash model
- **Production Architecture**: Separated frontend/backend with proper API design
- **Vector Search**: Semantic understanding using Qdrant vector database
- **Clean Code**: Extensive documentation, type safety, and error handling

---

## ✨ Features

### 🎯 Core Features

#### 1. AI Tourism Chatbot
- Powered by Google Gemini 2.5 Flash
- Context-aware conversations about Dubai attractions, culture, and customs
- Markdown-formatted responses with rich information
- Message history and conversation context
- Cultural awareness and safety-first approach
- **Rate Limited:** 20 messages per user per hour

#### 2. Vibe-Based Semantic Search
- Search by feelings/vibes (e.g., "romantic sunset spots", "family-friendly activities")
- Vector embeddings for semantic understanding
- Qdrant Vector Database with in-memory fallback
- Smart filtering (category, price range, halal, family-friendly)
- 500+ pre-loaded Dubai locations
- **Rate Limited:** 30 searches per user per hour

#### 3. AI Safety Check Workflow
- 5-stage automated safety assessment
- Real-time location risk scoring (0-100)
- AI-generated contextual recommendations
- Time-of-day aware analysis
- Complete audit trail with workflow stages
- Emergency contact information
- **Rate Limited:** 10 safety checks per user per hour

#### 4. User Authentication
- Clerk authentication with Google OAuth
- Email/password authentication
- Protected dashboard routes
- User profile management
- Session management and security

### 🎨 Additional Features

- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode Ready**: Tailwind CSS with customizable themes
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error messages and fallbacks
- **Auto Documentation**: Interactive API docs at `/docs`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                  (Next.js + TypeScript)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Chat   │  │  Search  │  │  Safety  │  │   Auth   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────────┼─────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │      Backend API            │
        │   (FastAPI + Python)        │
        │                             │
        │  ┌─────────────────────┐   │
        │  │  API Endpoints      │   │
        │  ├─────────────────────┤   │
        │  │ /api/chat           │   │
        │  │ /api/search         │   │
        │  │ /api/safety         │   │
        │  └─────────────────────┘   │
        │            │                │
        │            ▼                │
        │  ┌─────────────────────┐   │
        │  │  Business Logic     │   │
        │  │  (Services)         │   │
        │  └─────────────────────┘   │
        └──────────┬─────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│  Gemini AI   │    │  Qdrant Vector   │
│  2.5 Flash   │    │    Database      │
└──────────────┘    └──────────────────┘
```

### Data Flow

1. **User Request** → Frontend (Next.js)
2. **API Call** → Backend (FastAPI) at `http://localhost:8000`
3. **Business Logic** → Service Layer (Gemini/Qdrant)
4. **External APIs** → Google Gemini AI / Qdrant Cloud
5. **Response** → Backend → Frontend → User

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend (`/backend`)
- **Framework**: FastAPI 0.115
- **Language**: Python 3.11+
- **AI**: Google Gemini 2.5 Flash (google-generativeai)
- **Vector DB**: Qdrant Cloud
- **Authentication**: Clerk (verification)
- **Validation**: Pydantic
- **Rate Limiting**: SlowAPI
- **Server**: Uvicorn (ASGI)
- **Deployment**: Railway / Render / Fly.io

### External Services
- **AI Model**: Google Gemini 2.5 Flash
- **Vector Search**: Qdrant Cloud
- **Authentication**: Clerk
- **Hosting**: Vercel (Frontend) + Railway (Backend)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **npm** or **yarn** (package manager)
- **Git** (version control)

### Required API Keys

1. **Google Gemini API Key**
   - Get from: https://aistudio.google.com/app/apikey
   - Used for: AI chatbot and safety analysis

2. **Qdrant Cloud** (Optional - has fallback)
   - Get from: https://cloud.qdrant.io
   - Used for: Vector search

3. **Clerk Authentication**
   - Get from: https://dashboard.clerk.com
   - Used for: User authentication

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dubai-navigator.git
cd dubai-navigator
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your API keys

# Run the server
python -m app.main
```

Backend will run on: http://localhost:8000
API Documentation: http://localhost:8000/docs

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
copy .env.example .env.local
# Edit .env.local and add your Clerk keys

# Run development server
npm run dev
```

Frontend will run on: http://localhost:3000

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python -m app.main
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Now visit: http://localhost:3000

### Running with Docker

The easiest way to run both frontend and backend together is using Docker Compose:

#### Prerequisites
- **Docker Desktop** (includes Docker and Docker Compose)
- Download from: https://www.docker.com/products/docker-desktop

#### Using Docker Compose

1. **Make sure you have environment files ready:**
   - `backend/.env` with your API keys
   - `frontend/.env.local` with Clerk keys

2. **Build and start all services:**
```bash
# Build and start in detached mode
docker-compose up -d --build

# Or run in foreground (see logs)
docker-compose up --build
```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

4. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

5. **Stop services:**
```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

#### Running Individual Services with Docker

**Backend only:**
```bash
cd backend
docker build -t dubai-navigator-backend .
docker run -p 8000:8000 --env-file .env dubai-navigator-backend
```

**Frontend only:**
```bash
cd frontend
docker build -t dubai-navigator-frontend .
docker run -p 3000:3000 --env-file .env.local dubai-navigator-frontend
```

#### Docker Benefits
- ✅ No need to install Python or Node.js
- ✅ Consistent environment across all machines
- ✅ Easy deployment to cloud platforms
- ✅ Isolated dependencies

---

## 📁 Project Structure

```
Dubai-Navigator/
├── frontend/                    # Next.js Frontend
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API route handlers (deprecated - use backend)
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── chat/             # Chat interface
│   │   ├── search/           # Search components
│   │   ├── safety/           # Safety check UI
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities and helpers
│   ├── .env.local            # Frontend environment variables
│   ├── .env.example          # Environment template
│   ├── package.json          # Node dependencies
│   └── README.md             # Frontend documentation
│
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── config.py         # Configuration
│   │   ├── api/              # API endpoints
│   │   │   ├── chat.py       # POST /api/chat
│   │   │   ├── search.py     # POST /api/search
│   │   │   └── safety.py     # POST /api/safety
│   │   ├── services/         # Business logic
│   │   │   ├── gemini_service.py
│   │   │   └── qdrant_service.py
│   │   └── models/           # Data models
│   │       └── schemas.py    # Pydantic schemas
│   ├── .env                  # Backend environment variables (gitignored)
│   ├── .env.example          # Environment template
│   ├── requirements.txt      # Python dependencies
│   ├── test_api.py          # API testing script
│   ├── README.md            # Backend documentation
│   ├── QUICKSTART.md        # Beginner setup guide
│   └── LEARNING_GUIDE.md    # Code explanations
│
├── .gitignore               # Git ignore rules
└── README.md                # This file (Main documentation)
```

---

## 📚 API Documentation

### Interactive API Docs

Visit http://localhost:8000/docs when the backend is running for interactive API documentation powered by Swagger UI.

### Endpoints

#### 1. Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What are the best places to visit in Dubai?",
  "user_id": "user_123",
  "history": []  // Optional conversation history
}
```

**Response:**
```json
{
  "success": true,
  "response": "Dubai has many amazing attractions...",
  "error": null
}
```

#### 2. Search Endpoint
```http
POST /api/search
Content-Type: application/json

{
  "query": "romantic sunset spots",
  "limit": 10,
  "user_id": "user_123",
  "filters": {
    "category": "dining",
    "price_range": "medium"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [...],
  "count": 10,
  "error": null
}
```

#### 3. Safety Check Endpoint
```http
POST /api/safety
Content-Type: application/json

{
  "location_name": "Dubai Marina",
  "coordinates": {"lat": 25.08, "lng": 55.14},
  "time_of_day": "evening",
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "risk_level": "low",
  "risk_score": 15,
  "analysis": "Dubai Marina is very safe...",
  "recommendations": [...]
}
```

---

## 🚀 Deployment

### Step 1: Deploy Backend First

Choose one of these platforms for the FastAPI backend:

#### Railway (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Navigate to backend
cd backend

# Login and deploy
railway login
railway init
railway up
```

#### Render
1. Connect GitHub repository
2. Select `backend` folder as root directory
3. Build command: `pip install -r requirements.txt`
4. Start command: `python -m app.main`
5. Add environment variables

#### Fly.io
```bash
# Install Fly CLI
cd backend
fly launch
fly deploy
```

**Required Backend Environment Variables:**
- `GEMINI_API_KEY` - Your Google Gemini API key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `QDRANT_URL` (optional) - Qdrant cluster URL
- `QDRANT_API_KEY` (optional) - Qdrant API key
- `CORS_ORIGINS` - Update with your frontend URL

### Step 2: Deploy Frontend to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Visit [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Set **Root Directory** to `frontend`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL` - Your deployed backend URL (e.g., `https://your-backend.railway.app`)
     - `NEXT_PUBLIC_APP_URL` - Your Vercel URL
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
     - `CLERK_SECRET_KEY` - Clerk secret key
     - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
     - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
   - Click "Deploy"

3. **Update Backend CORS**

After deploying frontend, update your backend's `CORS_ORIGINS` environment variable to include your Vercel domain:
```
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

4. **Update Clerk Settings**

In your Clerk dashboard, add both URLs to:
- Allowed Origins
- Redirect URLs

**Done!** Your full-stack app is now live!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the powerful Gemini 2.5 Flash AI model
- **Qdrant** - For the excellent vector database
- **Clerk** - For seamless authentication
- **Vercel** - For the amazing Next.js hosting
---

## 📞 Contact

**Built by:** Aritra
**Hackathon:** LabLab.ai
**Technologies:** Google Gemini 2.5 Flash, Qdrant, Clerk, Next.js 16, FastAPI, Vercel

**Project Link:** [https://github.com/Rain-09x16/Dubify](https://github.com/Rain-09x16/Dubify)

---

## 🎓 Learning Resources

New to the technologies used in this project?

- **Frontend Documentation**: [frontend/README.md](frontend/README.md)
- **Backend Documentation**: [backend/README.md](backend/README.md)

---

<div align="center">

**Built with ❤️**

⭐ Star this repo if you find it helpful!

</div>



