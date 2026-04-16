import { getRedisClient } from '../config/redis';

/**
 * CacheService — Cache-Aside pattern implementation using Redis.
 *
 * Callers are responsible for:
 *  1. Checking the cache before querying the DB  (get)
 *  2. Populating the cache after a DB read         (set)
 *  3. Invalidating stale entries after mutations   (invalidatePattern)
 */
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
      // Cache miss on error — degrade gracefully, never block the request
      console.warn('[Cache] GET error, bypassing cache:', err);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    try {
      const client = getRedisClient();
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      // Non-fatal — the app continues without caching
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

  /**
   * Invalidate all keys matching a glob-style pattern.
   * e.g. invalidatePattern('character*') removes character:* and characters:*
   */
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
