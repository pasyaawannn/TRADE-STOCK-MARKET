# Deployment Guide — Pasya Stock Market

## Production Deployment

### 1. Cloud Setup (Recommended: AWS / GCP / DigitalOcean)

**Minimum specs:**
- 2 vCPU, 4GB RAM (backend + DB)
- 1 vCPU, 2GB RAM (frontend)

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with production values:
# - Strong passwords for POSTGRES_PASSWORD, REDIS_PASSWORD
# - Long random JWT_SECRET (min 64 chars)
# - ENVIRONMENT=production
```

### 3. Start Production Stack

```bash
docker-compose --profile production up -d
```

This starts: PostgreSQL, Redis, FastAPI backend, Next.js frontend, Nginx reverse proxy.

### 4. Database Migrations

```bash
docker-compose exec backend alembic upgrade head
```

### 5. SSL/HTTPS (via Certbot)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## Connecting Real Data

### Option A: yfinance (Free, Indonesian stocks)
Already configured. Works out of the box for `.JK` tickers.

### Option B: IDX Official API
Register at https://www.idx.co.id/api.
```
IDX_API_KEY=your_key
```

### Option C: Polygon.io (Premium, real-time US data)
```
POLYGON_API_KEY=your_key
```

---

## Adding Broker Flow Data

Real broker flow data (data flow broker) for IDX is available from:
- **RTI Business** (paid)
- **IPOT API** (InvestasiOnline)
- **Stockbit Pro API**
- Manual scraping from IDX website

Replace the simulated data in `backend/app/api/v1/brokerflow.py` with real API calls.

---

## AI Insights with OpenAI

1. Get API key from https://platform.openai.com
2. Add to `.env`: `OPENAI_API_KEY=sk-...`
3. Update `backend/app/services/ai_service.py` to call GPT-4 for richer analysis

---

## Performance Tuning

- **Redis TTL**: Adjust cache TTLs in `app/core/config.py`
- **DB Pool**: Tune `pool_size` and `max_overflow` in `app/core/database.py`
- **WebSocket**: For scale, use Redis pub/sub for broadcasting to multiple backend instances

---

## Monitoring

```bash
# Backend logs
docker-compose logs -f backend

# Redis monitor
docker-compose exec redis redis-cli monitor

# DB queries
docker-compose exec postgres psql -U pasya pasya_db
```
