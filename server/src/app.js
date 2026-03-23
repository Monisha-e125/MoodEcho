const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, AppError } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const supportRoutes = require('./routes/supportRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ ADDED

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://mood-echo-chi.vercel.app/',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiting
app.use('/api/', apiLimiter);

// Parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) }
    })
  );
}

// Root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🧠 MoodEcho API is running!',
    version: '1.0.0',
    disclaimer: 'This is a wellness tool, not a substitute for professional mental health care.'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🧠 MoodEcho API is healthy!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mood', moodRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/wellness', wellnessRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/notifications', notificationRoutes); // ✅ ADDED

// API info
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'MoodEcho API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      mood: '/api/v1/mood',
      analytics: '/api/v1/analytics',
      wellness: '/api/v1/wellness',
      support: '/api/v1/support',
      notifications: '/api/v1/notifications' // ✅ ADDED
    }
  });
});

// ✅ 404 Handler (Express 5 compatible)
app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Error handler
app.use(errorHandler);

module.exports = app;