const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://2026-internship-project.vercel.app'
  ];

  if (process.env.CLIENT_URL) {
    const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
    allowedOrigins.push(...clientUrls);
  }

  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
          return callback(new Error('CORS blocked'), false);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // console.log('Client connected:', socket.id);

    socket.on('join-room', (userId) => {
      socket.join(userId);
      // console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
