import json
from typing import Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings

redis_client: aioredis.Redis = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def cache_get(key: str) -> Optional[Any]:
    data = await redis_client.get(key)
    if data:
        return json.loads(data)
    return None


async def cache_set(key: str, value: Any, ttl: int = settings.CACHE_TTL_SECONDS):
    await redis_client.setex(key, ttl, json.dumps(value))


async def cache_delete(key: str):
    await redis_client.delete(key)


async def cache_keys(pattern: str):
    return await redis_client.keys(pattern)
