from fastapi import APIRouter
from app.services.stock_service import stock_service

router = APIRouter()


@router.get("/indices")
async def get_indices():
    return {"indices": await stock_service.get_market_indices()}


@router.get("/movers")
async def get_movers():
    return await stock_service.get_top_movers()


@router.get("/heatmap")
async def get_heatmap():
    movers = await stock_service.get_top_movers()
    all_stocks = movers["gainers"] + movers["losers"] + movers["most_active"]
    seen = set()
    unique = [s for s in all_stocks if s["ticker"] not in seen and not seen.add(s["ticker"])]
    return {"heatmap": unique}


@router.get("/overview")
async def get_overview():
    indices = await stock_service.get_market_indices()
    movers = await stock_service.get_top_movers()
    return {"indices": indices, **movers}
