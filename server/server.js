require('dotenv').config();

const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const { initializeSocket } = require('./src/config/socket');
const { initGemini } = require('./src/config/gemini');
const logger = require('./src/utils/logger');
const { createServer } = require('http');

// Seed default support rooms
const seedRooms = async () => {
  try {
    const SupportRoom = require('./src/models/SupportRoom');
    const count = await SupportRoom.countDocuments();
    if (count === 0) {
      await SupportRoom.insertMany([
        {
          name: '💬 General Support',
          description: 'A safe space to share and listen',
          topic: 'general'
        },
        {
          name: '😰 Anxiety & Stress',
          description: 'Support for anxiety and stress management',
          topic: 'anxiety'
        },
        {
          name: '🌟 Positivity Corner',
          description: 'Share good vibes and encouragement',
          topic: 'positivity'
        },
        {
          name: '💼 Work Stress',
          description: 'Dealing with workplace challenges',
          topic: 'work'
        },
        {
          name: '🤝 Loneliness',
          description: 'You\'re not alone — connect with others',
          topic: 'loneliness'
        }
      ]);
      logger.info('✅ Default support rooms created');
    }
  } catch (error) {
    logger.warn(`Room seeding error: ${error.message}`);
  }
};

const PORT = process.env.PORT || 4001;
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();

    try {
      await connectRedis();
    } catch (e) {
      logger.warn(`⚠️ Redis: ${e.message}. Running without cache.`);
    }

    // Initialize Gemini AI
    initGemini();

    // Seed default data
    await seedRooms();

    httpServer.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════');
      logger.info(`🧠 MoodEcho Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
      logger.info(`❤️  Health: http://localhost:${PORT}/api/health`);
      logger.info('═══════════════════════════════════════════');
    });
  } catch (error) {
    logger.error(`❌ Server start failed: ${error.message}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM — shutting down...');
  httpServer.close(() => process.exit(0));
});

startServer();