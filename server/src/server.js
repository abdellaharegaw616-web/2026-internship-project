const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectTemplateRoutes = require('./routes/projectTemplateRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const dashboardLayoutRoutes = require('./routes/dashboardLayoutRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const skillRoutes = require('./routes/skillRoutes');
const performanceReviewRoutes = require('./routes/performanceReviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const roleRoutes = require('./routes/roleRoutes');
const backupRoutes = require('./routes/backupRoutes');
const reportRoutes = require('./routes/reportRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { initializeSocket } = require('./config/socket');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Security Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// HTTP request logging (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

const allowedOrigins = [
  'http://localhost:5173',
  'https://2026-internship-project.vercel.app'
];

if (process.env.CLIENT_URL) {
  const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...clientUrls);
}

// CORS
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-templates', projectTemplateRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard-layout', dashboardLayoutRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/performance-reviews', performanceReviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/invitations', invitationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Task Flow API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_URL)
  .then(() => {
    logger.info('MongoDB connected successfully');
    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`API Health: http://localhost:${PORT}/api/health`);
      logger.info(`Socket.io initialized`);
    });
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in .env.`);
    process.exit(1);
  }

  logger.error(`Server error: ${err.message}`);
  process.exit(1);
});

module.exports = { app, server };
