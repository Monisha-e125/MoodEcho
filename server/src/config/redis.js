const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (!process.env.REDIS_URL) {
        logger.warn('⚠️ REDIS_URL not set — running without cache');
        resolve(null);
        return;
      }

      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            logger.warn('⚠️ Redis: Max retries reached');
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true
      });

      redisClient.on('connect', () => {
        logger.info('✅ Redis connected');
      });

      redisClient.on('error', (err) => {
        logger.warn(`Redis error: ${err.message}`);
      });

      redisClient
        .connect()
        .then(() => resolve(redisClient))
        .catch((err) => {
          logger.warn(`⚠️ Redis connection failed: ${err.message}`);
          redisClient = null;
          resolve(null);
        });
    } catch (error) {
      logger.warn(`⚠️ Redis init failed: ${error.message}`);
      resolve(null);
    }
  });
};

const getRedis = () => redisClient;

module.exports = { connectRedis, getRedis };