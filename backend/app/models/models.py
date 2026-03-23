"""
Database Models — Pasya Stock Market
"""
from datetime import datetime
from sqlalchemy import (
    String, Float, Integer, Boolean, DateTime, Text,
    ForeignKey, Enum, Index, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.core.database import Base


# ===== ENUMS =====
class AlertType(str, enum.Enum):
    PRICE_BREAKOUT = "price_breakout"
    PRICE_DROP = "price_drop"
    VOLUME_SPIKE = "volume_spike"
    RSI_OVERSOLD = "rsi_oversold"
    RSI_OVERBOUGHT = "rsi_overbought"
    BROKER_ACCUMULATION = "broker_accumulation"
    BROKER_DISTRIBUTION = "broker_distribution"


class Sentiment(str, enum.Enum):
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"


# ===== STOCK =====
class Stock(Base):
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ticker: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200))
    sector: Mapped[str] = mapped_column(String(100), nullable=True)
    subsector: Mapped[str] = mapped_column(String(100), nullable=True)
    market_cap: Mapped[float] = mapped_column(Float, nullable=True)
    shares_outstanding: Mapped[float] = mapped_column(Float, nullable=True)
    listing_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    prices: Mapped[list["StockPrice"]] = relationship(back_populates="stock")
    broker_flows: Mapped[list["BrokerFlow"]] = relationship(back_populates="stock")
    ai_analyses: Mapped[list["AIAnalysis"]] = relationship(back_populates="stock")


# ===== OHLCV PRICE DATA =====
class StockPrice(Base):
    __tablename__ = "stock_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(5), nullable=False)  # 1m, 5m, 1h, 1D
    open: Mapped[float] = mapped_column(Float)
    high: Mapped[float] = mapped_column(Float)
    low: Mapped[float] = mapped_column(Float)
    close: Mapped[float] = mapped_column(Float)
    volume: Mapped[float] = mapped_column(Float)
    value: Mapped[float] = mapped_column(Float, nullable=True)  # IDR value traded

    stock: Mapped["Stock"] = relationship(back_populates="prices")

    __table_args__ = (
        UniqueConstraint("stock_id", "timestamp", "timeframe"),
        Index("idx_price_stock_time", "stock_id", "timestamp"),
    )


# ===== BROKER FLOW =====
class BrokerFlow(Base):
    __tablename__ = "broker_flows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    broker_code: Mapped[str] = mapped_column(String(10))
    broker_name: Mapped[str] = mapped_column(String(100), nullable=True)
    buy_value: Mapped[float] = mapped_column(Float, default=0)
    sell_value: Mapped[float] = mapped_column(Float, default=0)
    buy_volume: Mapped[float] = mapped_column(Float, default=0)
    sell_volume: Mapped[float] = mapped_column(Float, default=0)
    net_value: Mapped[float] = mapped_column(Float, default=0)  # buy - sell

    stock: Mapped["Stock"] = relationship(back_populates="broker_flows")

    __table_args__ = (
        Index("idx_brokerflow_stock_date", "stock_id", "date"),
    )


# ===== USER =====
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    watchlists: Mapped[list["Watchlist"]] = relationship(back_populates="user")
    alerts: Mapped[list["Alert"]] = relationship(back_populates="user")


# ===== WATCHLIST =====
class Watchlist(Base):
    __tablename__ = "watchlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    ticker: Mapped[str] = mapped_column(String(10))
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship(back_populates="watchlists")

    __table_args__ = (UniqueConstraint("user_id", "ticker"),)


# ===== ALERT =====
class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    ticker: Mapped[str] = mapped_column(String(10))
    alert_type: Mapped[AlertType] = mapped_column(Enum(AlertType))
    target_value: Mapped[float] = mapped_column(Float, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    triggered_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="alerts")


# ===== AI ANALYSIS =====
class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"))
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    sentiment: Mapped[Sentiment] = mapped_column(Enum(Sentiment))
    trend: Mapped[str] = mapped_column(String(50))
    summary: Mapped[str] = mapped_column(Text)
    risk_level: Mapped[int] = mapped_column(Integer)  # 1-5
    confidence: Mapped[float] = mapped_column(Float)   # 0-1
    price_target: Mapped[float] = mapped_column(Float, nullable=True)

    stock: Mapped["Stock"] = relationship(back_populates="ai_analyses")
