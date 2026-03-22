const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io = null;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3001',
        process.env.CLIENT_URL
      ].filter(Boolean),
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userName = decoded.name;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 User connected: ${socket.userId}`);

    // Join personal room
    socket.join(`user:${socket.userId}`);

    // Handle joining support rooms
    socket.on('join-room', (roomId) => {
      socket.join(`room:${roomId}`);
      logger.info(`User ${socket.userId} joined room ${roomId}`);
    });

    // Handle leaving support rooms
    socket.on('leave-room', (roomId) => {
      socket.leave(`room:${roomId}`);
    });

    // Handle support chat messages
    socket.on('send-message', (data) => {
      io.to(`room:${data.roomId}`).emit('new-message', {
        ...data,
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
    });

    // Handle encouragement
    socket.on('send-encouragement', (data) => {
      io.to(`user:${data.toUserId}`).emit('received-encouragement', {
        message: data.message,
        fromName: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 User disconnected: ${socket.userId}`);
    });
  });

  logger.info('⚡ Socket.IO initialized');
  return io;
};

const getIO = () => io;

module.exports = { initializeSocket, getIO };