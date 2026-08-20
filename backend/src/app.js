/**
 * app.js  —  Central Express application
 *
 * Responsibilities:
 *  1. Create and configure the Express app instance.
 *  2. Register global middlewares (CORS, body parsers, request logging).
 *  3. Mount every module's router under the /api/v1 namespace.
 *  4. Attach a global 404 handler and a global error handler.
 *  5. Export the configured app for server.js to consume.
 *
 * Constraint: server.js does `require('./app')` — this file MUST export the
 * Express app instance directly (not wrapped in a factory / async function).
 */

const express = require('express');
const cors    = require('cors');
const env     = require('./config/environment');

const app = express();

// ─── 1. Global Middlewares ────────────────────────────────────────────────────

// CORS — restrict origins in production via CLIENT_URL env var
app.use(
  cors({
    origin      : env.CLIENT_URL || '*',
    methods     : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Minimal request logger (development convenience)
if (env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── 2. Health / Root ─────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    success : true,
    message : 'Parent Teacher App API',
    version : 'v1',
    status  : 'running',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    success   : true,
    status    : 'healthy',
    timestamp : new Date().toISOString(),
    env       : env.NODE_ENV,
  });
});

// ─── 3. Route Registration ────────────────────────────────────────────────────
//
// My modules (auth / students / attendance) are unconditionally loaded.
// Team-mates' modules are wrapped in try/catch so the server still boots even
// when those files don't exist yet — matching the pattern already used by
// server.js for the fallback mode.

// ── Auth (my module) ──────────────────────────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/v1/auth', authRoutes);

// ── Students (my module) ─────────────────────────────────────────────────────
try {
  const studentRoutes = require('./modules/students/student.routes');
  app.use('/api/v1/students', studentRoutes);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.warn('[app.js] students module not found — skipping.');
}

// ── Attendance (my module) ───────────────────────────────────────────────────
try {
  const attendanceRoutes = require('./modules/attendance/attendance.routes');
  app.use('/api/v1/attendance', attendanceRoutes);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.warn('[app.js] attendance module not found — skipping.');
}

// ── Team-mates' modules ───────────────────────────────────────────────────────

try {
  const announcementRoutes = require('./modules/announcements/announcement.routes');
  app.use('/api/v1/announcements', announcementRoutes);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.warn('[app.js] announcements module not found — skipping.');
}

try {
  const messageRoutes = require('./modules/messages/message.routes');
  app.use('/api/v1/communications', messageRoutes);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.warn('[app.js] messages module not found — skipping.');
}

try {
  const notificationRoutes = require('./modules/notifications/notification.routes');
  app.use('/api/v1/notifications', notificationRoutes);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.warn('[app.js] notifications module not found — skipping.');
}

// Future team modules (marks, homework, users, admin) follow the same pattern:
try {
  const userRoutes = require('./modules/users/user.routes');
  app.use('/api/v1/users', userRoutes);
} catch (_) { /* not yet implemented */ }

try {
  const marksRoutes = require('./modules/marks/marks.routes');
  app.use('/api/v1/marks', marksRoutes);
} catch (_) { /* not yet implemented */ }

try {
  const homeworkRoutes = require('./modules/homework/homework.routes');
  app.use('/api/v1/homework', homeworkRoutes);
} catch (_) { /* not yet implemented */ }

try {
  const adminRoutes = require('./modules/admin/admin.routes');
  app.use('/api/v1/admin', adminRoutes);
} catch (_) { /* not yet implemented */ }

// ─── 4. 404 Handler ──────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route not found: ${req.method} ${req.originalUrl}`,
    error   : 'NOT_FOUND',
  });
});

// ─── 5. Global Error Handler ─────────────────────────────────────────────────
// Must have exactly four parameters so Express treats it as an error handler.

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status  = err.statusCode || err.status || 500;
  const message = env.NODE_ENV === 'production' && status === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message;

  console.error(`[GlobalErrorHandler] ${status} — ${err.message}`);
  if (env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(status).json({
    success : false,
    message,
    error   : err.code || 'SERVER_ERROR',
  });
});

module.exports = app;
