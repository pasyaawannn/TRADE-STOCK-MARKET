"""
API v1 Router — Pasya Stock Market
"""
from fastapi import APIRouter
from app.api.v1 import stocks, market, screener, brokerflow, ai, auth, watchlist, alerts

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
router.include_router(market.router, prefix="/market", tags=["Market"])
router.include_router(screener.router, prefix="/screener", tags=["Screener"])
router.include_router(brokerflow.router, prefix="/brokerflow", tags=["Broker Flow"])
router.include_router(ai.router, prefix="/ai", tags=["AI Insights"])
router.include_router(watchlist.router, prefix="/watchlist", tags=["Watchlist"])
router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
