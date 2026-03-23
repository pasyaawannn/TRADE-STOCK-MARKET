"""Screener API"""
from fastapi import APIRouter, Body
from app.services.stock_service import stock_service

router = APIRouter()


@router.post("/")
async def run_screener(filters: dict = Body(...)):
    """
    Run smart stock screener.
    
    Filter options:
    - min_change_pct: float (e.g. 2.0 for >2%)
    - min_volume: int
    - breakout: bool
    - unusual_volume: bool
    - high_momentum: bool
    - foreign_accumulation: bool
    """
    results = await stock_service.run_screener(filters)
    return {"results": results, "count": len(results), "filters": filters}


@router.get("/presets/{preset}")
async def screener_preset(preset: str):
    """Run pre-built screener presets."""
    PRESETS = {
        "breakout": {"breakout": True, "min_change_pct": 1.5},
        "unusual_volume": {"unusual_volume": True},
        "high_momentum": {"min_change_pct": 2.0},
        "oversold": {"max_change_pct": -3.0},
    }
    filters = PRESETS.get(preset, {})
    results = await stock_service.run_screener(filters)
    return {"preset": preset, "results": results, "count": len(results)}
