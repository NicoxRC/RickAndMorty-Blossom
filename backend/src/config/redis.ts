import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

export async function connectRedis(): Promise<void> {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      lazyConnect: true,
    });

    await redisClient.connect();
    console.log('Redis connected.');
  } catch (err) {
    console.error('Unable to connect to Redis:', err);
    throw err;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
