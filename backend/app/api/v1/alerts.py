"""Alerts API"""
from fastapi import APIRouter, Depends, Body
from app.api.v1.auth import get_current_user, USERS_DB
from datetime import datetime

router = APIRouter()


@router.get("/")
async def get_alerts(current_user: str = Depends(get_current_user)):
    user = USERS_DB.get(current_user, {})
    return {"alerts": user.get("alerts", [])}


@router.post("/")
async def create_alert(
    ticker: str = Body(...),
    alert_type: str = Body(...),
    target_value: float = Body(None),
    current_user: str = Depends(get_current_user),
):
    user = USERS_DB.setdefault(current_user, {"watchlist": [], "alerts": []})
    alert = {
        "id": len(user["alerts"]) + 1,
        "ticker": ticker.upper(),
        "alert_type": alert_type,
        "target_value": target_value,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
    }
    user["alerts"].append(alert)
    return {"message": "Alert created", "alert": alert}


@router.delete("/{alert_id}")
async def delete_alert(alert_id: int, current_user: str = Depends(get_current_user)):
    user = USERS_DB.get(current_user, {})
    user["alerts"] = [a for a in user.get("alerts", []) if a["id"] != alert_id]
    return {"message": f"Alert {alert_id} deleted"}
