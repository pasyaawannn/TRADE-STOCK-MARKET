from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    ENVIRONMENT: str = "development"
    APP_NAME: str = "Pasya Stock Market"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://pasya:pasya@localhost:5432/pasya_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 30         # price data cache
    CACHE_TTL_LONG: int = 300           # 5 min for historical
    CACHE_TTL_DAY: int = 86400          # 24h for static data

    # JWT
    JWT_SECRET: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # External APIs
    OPENAI_API_KEY: str = ""
    POLYGON_API_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
