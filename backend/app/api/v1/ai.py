"""AI Insights API"""
from fastapi import APIRouter, HTTPException
from app.services.ai_service import ai_service
from app.services.stock_service import IDX_STOCKS
import asyncio

router = APIRouter()


@router.get("/{ticker}")
async def get_ai_insight(ticker: str):
    result = await ai_service.analyze(ticker.upper())
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/")
async def get_all_insights(limit: int = 10):
    tickers = [t.replace(".JK", "") for t in IDX_STOCKS[:limit]]
    tasks = [ai_service.analyze(t) for t in tickers]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    valid = [r for r in results if isinstance(r, dict) and "error" not in r]
    return {"insights": valid, "count": len(valid)}
