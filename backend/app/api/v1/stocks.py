from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.stock_service import stock_service

router = APIRouter()


@router.get("/")
async def list_stocks(
    search: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
):
    """List all available IDX stocks."""
    from app.services.stock_service import IDX_STOCKS
    tickers = [t.replace(".JK", "") for t in IDX_STOCKS[:limit]]
    if search:
        tickers = [t for t in tickers if search.upper() in t]
    return {"stocks": tickers, "total": len(tickers)}


@router.get("/{ticker}")
async def get_stock(ticker: str):
    """Get real-time quote for a stock."""
    quote = await stock_service.get_quote(ticker.upper())
    if "error" in quote:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")
    return quote


@router.get("/{ticker}/candles")
async def get_candles(
    ticker: str,
    timeframe: str = Query("1D", regex="^(1m|5m|1h|1D|1W|1M)$"),
):
    """Get OHLCV candlestick data."""
    candles = await stock_service.get_candles(ticker.upper(), timeframe)
    if not candles:
        raise HTTPException(status_code=404, detail="No candle data found")
    return {"ticker": ticker, "timeframe": timeframe, "candles": candles, "count": len(candles)}


@router.get("/{ticker}/summary")
async def get_summary(ticker: str):
    """Get full stock summary including quote + AI analysis."""
    quote = await stock_service.get_quote(ticker.upper())
    from app.services.ai_service import ai_service
    ai = await ai_service.analyze(ticker.upper())
    return {**quote, "ai": ai}
