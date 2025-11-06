const { Server } = require('socket.io');
const { verifyToken } = require('./utils/auth');

let io;

// Store user socket connections (userId -> socketId)
const userSockets = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store user's socket connection
    userSockets.set(socket.userId, socket.id);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
    });
  });

  return io;
}

// Emit notification to specific user
function notifyUser(userId, event, data) {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }
  
  io.to(`user:${userId}`).emit(event, data);
  console.log(`📢 Notification sent to user ${userId}: ${event}`);
}

// Emit notification to multiple users
function notifyUsers(userIds, event, data) {
  userIds.forEach(userId => notifyUser(userId, event, data));
}

module.exports = {
  initializeSocket,
  notifyUser,
  notifyUsers,
  getIO: () => io
};
