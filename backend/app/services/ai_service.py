"""
AI Market Insights Service
Uses technical indicators + optional OpenAI for analysis
"""
import numpy as np
from typing import Optional
from loguru import logger

from app.core.config import settings
from app.core.redis import cache_get, cache_set
from app.services.stock_service import stock_service


def compute_rsi(closes: list, period: int = 14) -> float:
    if len(closes) < period + 1:
        return 50.0
    deltas = [closes[i+1] - closes[i] for i in range(len(closes)-1)]
    gains = [d for d in deltas[-period:] if d > 0]
    losses = [-d for d in deltas[-period:] if d < 0]
    avg_gain = sum(gains) / period if gains else 0
    avg_loss = sum(losses) / period if losses else 1e-9
    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)


def compute_macd(closes: list):
    if len(closes) < 26:
        return 0, 0, 0

    def ema(data, period):
        k = 2 / (period + 1)
        ema_val = data[0]
        for price in data[1:]:
            ema_val = price * k + ema_val * (1 - k)
        return ema_val

    ema12 = ema(closes, 12)
    ema26 = ema(closes, 26)
    macd_line = ema12 - ema26
    signal = macd_line * 0.8  # simplified
    histogram = macd_line - signal
    return round(macd_line, 2), round(signal, 2), round(histogram, 2)


def compute_moving_averages(closes: list):
    def sma(data, period):
        if len(data) < period:
            return None
        return round(sum(data[-period:]) / period, 2)
    return {
        "ma20": sma(closes, 20),
        "ma50": sma(closes, 50),
        "ma200": sma(closes, 200),
    }


class AIAnalysisService:

    async def analyze(self, ticker: str) -> dict:
        cache_key = f"ai:analysis:{ticker}"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        candles = await stock_service.get_candles(ticker, "1D")
        quote = await stock_service.get_quote(ticker)

        if not candles:
            return {"ticker": ticker, "error": "No data available"}

        closes = [c["close"] for c in candles]
        volumes = [c["volume"] for c in candles]

        # Compute indicators
        rsi = compute_rsi(closes)
        macd_line, signal, histogram = compute_macd(closes)
        mas = compute_moving_averages(closes)
        current_price = closes[-1] if closes else 0
        avg_volume = sum(volumes[-20:]) / 20 if len(volumes) >= 20 else 1
        volume_ratio = round(volumes[-1] / avg_volume, 2) if volumes else 1

        # Golden/Death cross
        golden_cross = (
            mas["ma50"] and mas["ma200"] and
            mas["ma50"] > mas["ma200"]
        )

        # Determine sentiment
        bullish_signals = sum([
            rsi < 70 and rsi > 50,
            histogram > 0,
            golden_cross,
            current_price > (mas["ma50"] or 0),
            volume_ratio > 1.2,
        ])
        bearish_signals = sum([
            rsi > 70 or rsi < 30,
            histogram < 0,
            not golden_cross,
            current_price < (mas["ma50"] or float('inf')),
            volume_ratio < 0.8,
        ])

        if bullish_signals >= 3:
            sentiment = "bullish"
            trend = "Uptrend"
        elif bearish_signals >= 3:
            sentiment = "bearish"
            trend = "Downtrend"
        else:
            sentiment = "neutral"
            trend = "Sideways"

        # Risk level (1=low, 5=high)
        risk = 3
        if rsi > 75 or rsi < 25:
            risk += 1
        if volume_ratio > 3:
            risk += 1
        if golden_cross:
            risk -= 1
        risk = max(1, min(5, risk))

        # Confidence score
        confidence = round(min(0.95, 0.5 + abs(bullish_signals - bearish_signals) * 0.1), 2)

        # Price target (simple Fibonacci projection)
        recent_high = max(closes[-20:]) if len(closes) >= 20 else current_price
        recent_low = min(closes[-20:]) if len(closes) >= 20 else current_price
        fib_range = recent_high - recent_low
        price_target = round(current_price + fib_range * 0.618, 2) if sentiment == "bullish" else \
                       round(current_price - fib_range * 0.618, 2)

        # Summary text
        summary = self._generate_summary(ticker, sentiment, rsi, macd_line, histogram, golden_cross, volume_ratio, price_target)

        result = {
            "ticker": ticker,
            "sentiment": sentiment,
            "trend": trend,
            "summary": summary,
            "risk_level": risk,
            "confidence": confidence,
            "price_target": price_target,
            "indicators": {
                "rsi": rsi,
                "macd": macd_line,
                "macd_signal": signal,
                "macd_histogram": histogram,
                "ma20": mas["ma20"],
                "ma50": mas["ma50"],
                "ma200": mas["ma200"],
                "golden_cross": golden_cross,
                "volume_ratio": volume_ratio,
            },
            "bullish_signals": bullish_signals,
            "bearish_signals": bearish_signals,
        }

        await cache_set(cache_key, result, ttl=900)  # 15 min cache
        return result

    def _generate_summary(self, ticker, sentiment, rsi, macd, histogram, golden_cross, vol_ratio, target):
        parts = []
        if sentiment == "bullish":
            parts.append(f"{ticker} menunjukkan sinyal bullish yang kuat.")
            if golden_cross:
                parts.append("Golden cross MA50/MA200 terkonfirmasi.")
            if rsi < 70:
                parts.append(f"RSI {rsi:.0f} berada di zona momentum positif.")
            if histogram > 0:
                parts.append("MACD histogram positif, momentum beli menguat.")
        elif sentiment == "bearish":
            parts.append(f"{ticker} menunjukkan tekanan jual yang meningkat.")
            if rsi > 70:
                parts.append(f"RSI {rsi:.0f} memasuki wilayah overbought, waspadai koreksi.")
            if histogram < 0:
                parts.append("MACD histogram negatif, momentum jual dominan.")
        else:
            parts.append(f"{ticker} bergerak sideways tanpa sinyal yang jelas.")
            parts.append("Tunggu konfirmasi breakout sebelum mengambil posisi.")

        if vol_ratio > 1.5:
            parts.append(f"Volume unusually tinggi ({vol_ratio:.1f}x rata-rata).")
        parts.append(f"Target harga teknikal: {target:,.0f}.")

        return " ".join(parts)


ai_service = AIAnalysisService()
