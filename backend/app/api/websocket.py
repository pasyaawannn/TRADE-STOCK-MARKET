"""
WebSocket — Real-time Price Stream
Broadcasts live price updates to connected clients
"""
import asyncio
import json
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []
        self.subscriptions: dict[WebSocket, set] = {}

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        self.subscriptions[ws] = set()
        logger.info(f"WS connected. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)
        self.subscriptions.pop(ws, None)
        logger.info(f"WS disconnected. Total: {len(self.active)}")

    async def broadcast(self, data: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    async def send_to(self, ws: WebSocket, data: dict):
        try:
            await ws.send_json(data)
        except Exception:
            self.disconnect(ws)


manager = ConnectionManager()

# Simulated price cache (in production: pull from Redis)
_prices: dict = {}


def simulate_tick(ticker: str) -> dict:
    base = _prices.get(ticker, 5000)
    change = random.uniform(-0.005, 0.005)
    new_price = round(base * (1 + change), 2)
    _prices[ticker] = new_price
    prev = base
    return {
        "type": "tick",
        "ticker": ticker,
        "price": new_price,
        "change": round(new_price - prev, 2),
        "change_pct": round((new_price - prev) / prev * 100, 4),
        "volume": random.randint(100_000, 10_000_000),
    }


async def price_broadcaster():
    """Background task: send ticks every second."""
    DEFAULT_TICKERS = ["BBCA", "TLKM", "BBRI", "ASII", "BMRI", "GOTO", "ADRO", "ANTM"]
    # Seed prices
    seeds = [9250, 3790, 5275, 4820, 7100, 68, 2340, 1680]
    for t, p in zip(DEFAULT_TICKERS, seeds):
        _prices[t] = p

    while True:
        if manager.active:
            for ticker in DEFAULT_TICKERS:
                tick = simulate_tick(ticker)
                await manager.broadcast(tick)
                await asyncio.sleep(0.15)
        await asyncio.sleep(1)


@router.websocket("/ws/prices")
async def websocket_prices(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)
            # Client can subscribe to specific tickers
            if msg.get("action") == "subscribe":
                tickers = msg.get("tickers", [])
                manager.subscriptions[ws].update(tickers)
                await manager.send_to(ws, {"type": "subscribed", "tickers": tickers})
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception as e:
        logger.error(f"WS error: {e}")
        manager.disconnect(ws)


@router.on_event("startup")
async def start_broadcaster():
    asyncio.create_task(price_broadcaster())
