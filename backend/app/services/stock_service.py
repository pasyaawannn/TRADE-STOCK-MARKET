"""
Stock Data Service — fetches real market data via yfinance
Supports IDX (.JK suffix) and global markets
"""
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
import yfinance as yf
import pandas as pd
from loguru import logger

from app.core.redis import cache_get, cache_set
from app.core.config import settings


# ===== IDX STOCK LIST =====
IDX_STOCKS = [
    "BBCA.JK", "TLKM.JK", "BBRI.JK", "ASII.JK", "BMRI.JK",
    "UNVR.JK", "GOTO.JK", "INDF.JK", "PGAS.JK", "ICBP.JK",
    "KLBF.JK", "SMGR.JK", "ADRO.JK", "PTBA.JK", "ANTM.JK",
    "BRPT.JK", "CPIN.JK", "EXCL.JK", "GGRM.JK", "HMSP.JK",
    "INCO.JK", "INKP.JK", "ITMG.JK", "JPFA.JK", "MNCN.JK",
    "PTPP.JK", "SCMA.JK", "TBIG.JK", "TPIA.JK", "WIKA.JK",
]

MARKET_INDICES = {
    "IHSG": "^JKSE",
    "LQ45": "^LQ45.JK",
    "S&P500": "^GSPC",
    "NASDAQ": "^IXIC",
    "Nikkei": "^N225",
    "HangSeng": "^HSI",
}

TIMEFRAME_MAP = {
    "1m": ("1d", "1m"),
    "5m": ("5d", "5m"),
    "1h": ("1mo", "1h"),
    "1D": ("1y", "1d"),
    "1W": ("5y", "1wk"),
    "1M": ("10y", "1mo"),
}


class StockService:

    async def get_quote(self, ticker: str) -> dict:
        """Get real-time quote for a single ticker."""
        cache_key = f"quote:{ticker}"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        try:
            suffix = ".JK" if not ticker.endswith(".JK") and not ticker.startswith("^") else ""
            t = yf.Ticker(f"{ticker}{suffix}")
            info = t.fast_info

            result = {
                "ticker": ticker,
                "price": round(info.last_price or 0, 2),
                "open": round(info.open or 0, 2),
                "high": round(info.day_high or 0, 2),
                "low": round(info.day_low or 0, 2),
                "prev_close": round(info.previous_close or 0, 2),
                "volume": int(info.three_month_average_volume or 0),
                "market_cap": info.market_cap,
                "change": round((info.last_price or 0) - (info.previous_close or 0), 2),
                "change_pct": round(
                    ((info.last_price or 0) - (info.previous_close or 0))
                    / (info.previous_close or 1) * 100, 2
                ),
                "timestamp": datetime.utcnow().isoformat(),
            }

            await cache_set(cache_key, result, ttl=settings.CACHE_TTL_SECONDS)
            return result

        except Exception as e:
            logger.error(f"Error fetching quote for {ticker}: {e}")
            return {"ticker": ticker, "error": str(e)}

    async def get_candles(self, ticker: str, timeframe: str = "1D") -> List[dict]:
        """Get OHLCV candle data."""
        cache_key = f"candles:{ticker}:{timeframe}"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        period, interval = TIMEFRAME_MAP.get(timeframe, ("1y", "1d"))

        try:
            suffix = ".JK" if not ticker.endswith(".JK") and not ticker.startswith("^") else ""
            df: pd.DataFrame = yf.download(
                f"{ticker}{suffix}",
                period=period,
                interval=interval,
                auto_adjust=True,
                progress=False,
            )

            candles = []
            for ts, row in df.iterrows():
                candles.append({
                    "time": int(ts.timestamp()),
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                })

            ttl = settings.CACHE_TTL_SECONDS if timeframe in ("1m","5m") else settings.CACHE_TTL_LONG
            await cache_set(cache_key, candles, ttl=ttl)
            return candles

        except Exception as e:
            logger.error(f"Error fetching candles for {ticker}: {e}")
            return []

    async def get_market_indices(self) -> List[dict]:
        """Get all market indices."""
        cache_key = "market:indices"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        tasks = [self.get_quote(sym) for sym in MARKET_INDICES.values()]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        indices = []
        for name, result in zip(MARKET_INDICES.keys(), results):
            if isinstance(result, dict) and "error" not in result:
                result["name"] = name
                indices.append(result)

        await cache_set(cache_key, indices, ttl=30)
        return indices

    async def get_top_movers(self) -> dict:
        """Get top gainers and losers."""
        cache_key = "market:movers"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        tasks = [self.get_quote(t.replace(".JK", "")) for t in IDX_STOCKS[:20]]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid = [r for r in results if isinstance(r, dict) and "error" not in r]

        gainers = sorted(valid, key=lambda x: x.get("change_pct", 0), reverse=True)[:5]
        losers = sorted(valid, key=lambda x: x.get("change_pct", 0))[:5]
        most_active = sorted(valid, key=lambda x: x.get("volume", 0), reverse=True)[:5]

        result = {"gainers": gainers, "losers": losers, "most_active": most_active}
        await cache_set(cache_key, result, ttl=60)
        return result

    async def run_screener(self, filters: dict) -> List[dict]:
        """Run stock screener with given filters."""
        tasks = [self.get_quote(t.replace(".JK", "")) for t in IDX_STOCKS]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        stocks = [r for r in results if isinstance(r, dict) and "error" not in r]

        # Apply filters
        if filters.get("min_change_pct"):
            stocks = [s for s in stocks if s.get("change_pct", 0) >= filters["min_change_pct"]]
        if filters.get("min_volume"):
            stocks = [s for s in stocks if s.get("volume", 0) >= filters["min_volume"]]
        if filters.get("breakout"):
            stocks = [s for s in stocks if s.get("change_pct", 0) > 1.5]
        if filters.get("unusual_volume"):
            avg_vol = sum(s.get("volume", 0) for s in stocks) / max(len(stocks), 1)
            stocks = [s for s in stocks if s.get("volume", 0) > avg_vol * 1.5]

        return sorted(stocks, key=lambda x: x.get("change_pct", 0), reverse=True)


stock_service = StockService()
