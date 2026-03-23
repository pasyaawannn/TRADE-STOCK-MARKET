"""Watchlist API"""
from fastapi import APIRouter, Depends, HTTPException, Body
from app.api.v1.auth import get_current_user, USERS_DB
from app.services.stock_service import stock_service
import asyncio

router = APIRouter()


@router.get("/")
async def get_watchlist(current_user: str = Depends(get_current_user)):
    user = USERS_DB.get(current_user, {})
    tickers = user.get("watchlist", [])
    if not tickers:
        return {"watchlist": []}
    tasks = [stock_service.get_quote(t) for t in tickers]
    quotes = await asyncio.gather(*tasks, return_exceptions=True)
    return {"watchlist": [q for q in quotes if isinstance(q, dict) and "error" not in q]}


@router.post("/")
async def add_to_watchlist(ticker: str = Body(..., embed=True), current_user: str = Depends(get_current_user)):
    user = USERS_DB.setdefault(current_user, {"watchlist": [], "alerts": []})
    ticker = ticker.upper()
    if ticker not in user["watchlist"]:
        user["watchlist"].append(ticker)
    return {"message": f"{ticker} added to watchlist", "watchlist": user["watchlist"]}


@router.delete("/{ticker}")
async def remove_from_watchlist(ticker: str, current_user: str = Depends(get_current_user)):
    user = USERS_DB.get(current_user, {})
    user["watchlist"] = [t for t in user.get("watchlist", []) if t != ticker.upper()]
    return {"message": f"{ticker} removed", "watchlist": user["watchlist"]}
