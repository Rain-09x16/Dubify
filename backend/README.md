# Dubai Navigator AI - FastAPI Backend

> Python-based AI backend with Google Gemini 2.5 Flash, Qdrant Vector DB, and FastAPI

**Status:** ✅ Production Ready | **Python Version:** 3.11+

This is the backend API for the Dubai Navigator AI project, providing AI-powered tourism services including chatbot, semantic search, and safety assessments.

## 🏗️ Architecture

```
Frontend (Next.js)  →  Backend API (FastAPI)  →  AI Services
                                               ↓
                                          - Gemini AI
                                          - Qdrant Vector DB
```

## ✨ Features

### 1. AI Tourism Chatbot
- Powered by Google Gemini 2.5 Flash
- Context-aware conversations about Dubai
- Cultural and safety-first responses
- Markdown-formatted replies

### 2. Semantic Search
- Vector-based search using Qdrant
- Understands meaning, not just keywords
- Search by "vibes" (e.g., "romantic sunset spots")
- Fallback to in-memory search

### 3. AI Safety Assessment
- Real-time location safety analysis
- Risk scoring (0-100) with AI reasoning
- Time-of-day aware recommendations
- Emergency contact information

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Google Gemini API key
- (Optional) Qdrant Cloud account

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
```

5. **Run the server:**
```bash
python -m app.main

# Or using uvicorn directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. **Test it's working:**
```bash
# Open browser and visit:
http://localhost:8000          # API info
http://localhost:8000/docs     # Interactive API documentation
http://localhost:8000/health   # Health check
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration & environment variables
│   │
│   ├── api/                 # API endpoints
│   │   ├── chat.py         # POST /api/chat
│   │   ├── search.py       # POST /api/search
│   │   └── safety.py       # POST /api/safety
│   │
│   ├── services/            # Business logic
│   │   ├── gemini_service.py   # Gemini AI integration
│   │   └── qdrant_service.py   # Vector search
│   │
│   ├── models/              # Data models
│   │   └── schemas.py      # Pydantic models
│   │
│   ├── middleware/          # Middleware (auth, rate limiting)
│   └── utils/               # Utility functions
│
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .env                    # Your actual secrets (gitignored)
├── README.md               # This file
└── LEARNING_GUIDE.md       # Detailed code explanations
```

## 🔑 Environment Variables

Create a `.env` file with these variables:

```env
# Google Gemini API (REQUIRED)
GEMINI_API_KEY=your_api_key_here

# Qdrant Vector Database (OPTIONAL - has fallback)
QDRANT_URL=https://your-cluster.aws.cloud.qdrant.io
QDRANT_API_KEY=your_api_key_here

# Clerk Authentication (REQUIRED for auth endpoints)
CLERK_SECRET_KEY=your_clerk_secret_key

# Application Settings
APP_NAME=Dubai Navigator AI
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Origins
CORS_ORIGINS=http://localhost:3000,https://dubify-five.vercel.app
```

### Getting API Keys

**Google Gemini:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" → "Create API key"
3. Copy and paste into `.env`

**Qdrant (Optional):**
1. Visit [Qdrant Cloud](https://cloud.qdrant.io/)
2. Create free cluster
3. Copy URL and API key

**Clerk:**
1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Go to API Keys
3. Copy Secret Key

## 📖 API Endpoints

### 1. Chat with AI

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "message": "What's the best time to visit Dubai?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ],
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "response": "The best time to visit Dubai is November to March..."
}
```

### 2. Semantic Search

**Endpoint:** `POST /api/search`

**Request:**
```json
{
  "query": "romantic dinner with sunset views",
  "limit": 10,
  "filters": {
    "category": "restaurant",
    "min_price": 3
  },
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "loc_1",
      "name": "Pierchic",
      "description": "Overwater dining with stunning views",
      "score": 0.92,
      "category": "restaurant"
    }
  ],
  "count": 1
}
```

### 3. Safety Check

**Endpoint:** `POST /api/safety`

**Request:**
```json
{
  "location_name": "Dubai Marina Walk",
  "coordinates": {"lat": 25.08, "lng": 55.14},
  "time_of_day": "night",
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "risk_score": 15,
  "risk_level": "low",
  "analysis": "Dubai Marina is very safe at night...",
  "recommendations": [
    "Stay in well-lit areas",
    "Keep valuables secure"
  ]
}
```

## 🧪 Testing

### Manual Testing

```bash
# Test chat endpoint
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "user_id": "test_user"}'

# Test with Python
python
>>> import requests
>>> response = requests.post('http://localhost:8000/api/chat',
...     json={'message': 'What is Dubai famous for?', 'user_id': 'test'})
>>> print(response.json())
```

### Interactive API Docs

Visit `http://localhost:8000/docs` for interactive Swagger UI where you can:
- See all endpoints
- Try them out directly in the browser
- View request/response schemas
- Test without writing code!

## 📚 Learning Resources

### For Beginners

Read [LEARNING_GUIDE.md](LEARNING_GUIDE.md) for:
- Complete explanation of every file
- How FastAPI works
- Understanding async/await
- Data flow diagrams
- Common patterns explained

### Code Comments

Every file has extensive comments explaining:
- What the code does
- Why it's written that way
- How it fits into the bigger picture

## 🔧 Development

### Adding New Endpoints

1. Create a new file in `app/api/`
2. Define your router and endpoints
3. Import and include in `app/main.py`

Example:
```python
# app/api/new_feature.py
from fastapi import APIRouter
router = APIRouter()

@router.post("/new-feature")
async def new_feature():
    return {"message": "Hello!"}

# app/main.py
from app.api import new_feature
app.include_router(new_feature.router, prefix="/api", tags=["New"])
```

### Adding New Services

1. Create a new file in `app/services/`
2. Define your service class
3. Create a singleton instance
4. Import and use in endpoints

## 🚀 Deployment

### Option 1: Railway.app (Recommended)

1. Connect your GitHub repository
2. Add environment variables
3. Deploy! Railway auto-detects Python

### Option 2: Render.com

1. Create new Web Service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 3: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 💡 Tips for Resume/Portfolio

**Highlight These:**
- ✅ **Polyglot Development** - TypeScript frontend + Python backend
- ✅ **Modern AI Integration** - Gemini 2.5 Flash API
- ✅ **Vector Search** - Semantic understanding with Qdrant
- ✅ **Clean Architecture** - Separation of concerns (routes, services, models)
- ✅ **Production Patterns** - Error handling, validation, async operations
- ✅ **Auto-Documentation** - Interactive API docs with FastAPI

## 📞 Support

- **Code Questions:** Check [LEARNING_GUIDE.md](LEARNING_GUIDE.md)
- **API Docs:** Visit `/docs` endpoint
- **Issues:** File an issue on GitHub

## 👨‍💻 Author

**Aritra**
- Project: Dubai Navigator AI
- Tech Stack: FastAPI, Python, Gemini AI, Qdrant

---

**Built with ❤️ using FastAPI and Python**
