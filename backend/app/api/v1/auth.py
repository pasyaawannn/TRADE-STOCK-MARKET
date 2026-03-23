"""Watchlist, Alerts, Auth — simple JWT-based stubs"""
from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# ===== AUTH =====
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# In-memory user store (replace with DB in production)
USERS_DB: dict = {}


def create_token(data: dict, expire_minutes: int = 30):
    data["exp"] = datetime.utcnow() + timedelta(minutes=expire_minutes)
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/register")
async def register(email: str = Body(...), password: str = Body(...), username: str = Body(...)):
    if email in USERS_DB:
        raise HTTPException(status_code=400, detail="Email already registered")
    USERS_DB[email] = {
        "email": email,
        "username": username,
        "hashed_password": pwd_context.hash(password),
        "watchlist": [],
        "alerts": [],
    }
    token = create_token({"sub": email})
    return {"access_token": token, "token_type": "bearer", "username": username}


@router.post("/login")
async def login(email: str = Body(...), password: str = Body(...)):
    user = USERS_DB.get(email)
    if not user or not pwd_context.verify(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": email})
    return {"access_token": token, "token_type": "bearer", "username": user["username"]}


@router.get("/me")
async def me(current_user: str = Depends(get_current_user)):
    user = USERS_DB.get(current_user, {})
    return {"email": current_user, "username": user.get("username", "")}
