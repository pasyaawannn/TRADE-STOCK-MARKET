# 📈 Pasya Stock Market

> **Professional Stock Analytics for the Next Generation Investor**

A full-stack, real-time stock market analytics platform built for the Indonesian Stock Exchange (IDX). Inspired by Bloomberg Terminal, TradingView, and Stockbit.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS, Framer Motion |
| Charts | TradingView Lightweight Charts |
| Backend | Python FastAPI |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Real-time | WebSockets |
| Auth | JWT + NextAuth.js |
| Container | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7.

### 1. Clone & Setup

```bash
git clone https://github.com/pasyaawannn/TRADE-STOCK-MARKET
cd TRADE-STOCK-MARKET
cp .env.example .env
```

### 2. Start with Docker (Recommended)

```bash
docker-compose up -d
```

App will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 3. Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
pasya-stock-market/
├── frontend/               # Next.js 14 App
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Utilities & API client
│       ├── store/          # Zustand state management
│       └── types/          # TypeScript types
├── backend/                # FastAPI Python App
│   └── app/
│       ├── api/            # Route handlers
│       ├── core/           # Config, security, DB
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       └── services/       # Business logic
├── docker/                 # Docker configs
├── docs/                   # Documentation
└── docker-compose.yml
```

---

## ✨ Features

- 📊 **Real-time Candlestick Charts** — TradingView Lightweight Charts with MA, RSI, MACD, Volume
- 🗺️ **Interactive Heatmap** — Sector-based stock performance visualization
- 🏦 **Broker Flow Analytics** — Net buy/sell flow per broker, accumulation detection
- 🔍 **Smart Stock Screener** — Filter by breakout, volume, momentum, foreign flow
- 🤖 **AI Market Insights** — Sentiment analysis, trend prediction, risk scoring
- 📋 **Watchlist System** — Real-time price tracking with alerts
- 🔔 **Smart Alert Engine** — Price breakout, volume spike, broker accumulation alerts
- ⚡ **WebSocket Real-time** — Live price updates via WebSocket
- 🔐 **Authentication** — JWT-based auth with refresh tokens

---

## 🔑 Environment Variables

See `.env.example` for all required variables.

Key variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/pasya_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
IDX_API_KEY=your-idx-api-key
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/stocks` | GET | List all stocks |
| `/api/v1/stocks/{ticker}` | GET | Stock detail + OHLCV |
| `/api/v1/stocks/{ticker}/candles` | GET | Candlestick data |
| `/api/v1/market/indices` | GET | Market indices |
| `/api/v1/market/heatmap` | GET | Sector heatmap data |
| `/api/v1/screener` | POST | Run stock screener |
| `/api/v1/brokerflow/{ticker}` | GET | Broker flow data |
| `/api/v1/ai/insights/{ticker}` | GET | AI analysis |
| `/api/v1/watchlist` | GET/POST/DELETE | Watchlist CRUD |
| `/api/v1/alerts` | GET/POST/DELETE | Alert management |
| `/ws/prices` | WS | Real-time price stream |

---

## 🤝 Contributing

Pull requests welcome! See `docs/CONTRIBUTING.md`.

---

## 📄 License

MIT License — see `LICENSE`
