import { getRedisClient } from '@/config/redis';

export class CacheService {
  buildKey(prefix: string, payload: object): string {
    return `${prefix}:${JSON.stringify(payload)}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = getRedisClient();
      const raw = await client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn('[Cache] GET error, bypassing cache:', err);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    try {
      const client = getRedisClient();
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn('[Cache] SET error:', err);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const client = getRedisClient();
      await client.del(key);
    } catch (err) {
      console.warn('[Cache] DEL error:', err);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (err) {
      console.warn('[Cache] invalidatePattern error:', err);
    }
  }
}
