"""Broker Flow API — stub with simulated IDX broker data"""
from fastapi import APIRouter, Query
from app.core.redis import cache_get, cache_set
import random, math

router = APIRouter()

BROKERS = ["BK","YP","ZP","AK","MU","CS","DX","GR","KZ","HD","OD","LS","RX","CP","WH"]

def simulate_broker_flow(ticker: str, seed: int = 42):
    random.seed(hash(ticker) + seed)
    flows = []
    for b in BROKERS:
        net = round(random.uniform(-50, 50), 2)
        flows.append({
            "broker": b,
            "buy_value": round(abs(net) + random.uniform(5, 30), 2),
            "sell_value": round(abs(net) + random.uniform(5, 30) if net < 0 else random.uniform(5, 20), 2),
            "net_value": net,
            "type": "buy" if net > 0 else "sell",
        })
    return sorted(flows, key=lambda x: abs(x["net_value"]), reverse=True)


@router.get("/{ticker}")
async def get_broker_flow(ticker: str, days: int = Query(1, ge=1, le=30)):
    cache_key = f"brokerflow:{ticker}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    flows = simulate_broker_flow(ticker.upper())
    top_accum = sorted([f for f in flows if f["type"]=="buy"], key=lambda x: x["net_value"], reverse=True)[:5]
    top_distrib = sorted([f for f in flows if f["type"]=="sell"], key=lambda x: x["net_value"])[:5]

    result = {
        "ticker": ticker,
        "flows": flows,
        "top_accumulation": top_accum,
        "top_distribution": top_distrib,
        "total_buy": round(sum(f["buy_value"] for f in flows), 2),
        "total_sell": round(sum(f["sell_value"] for f in flows), 2),
        "net_flow": round(sum(f["net_value"] for f in flows), 2),
    }
    await cache_set(cache_key, result, ttl=60)
    return result
