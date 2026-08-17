const http = require('http');
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/environment');
const { connectDB } = require('./config/database');

const startServer = async () => {
  try {
    // 1. Initialize database connection
    await connectDB();

    let app;

    try {
      // Attempt to load Akshaya's app.js
      app = require('./app');
      console.log('Successfully loaded app.js');
    } catch (err) {
      // If app.js doesn't exist (MODULE_NOT_FOUND on itself), set up fallback Express app
      const isAppJsMissing = err.code === 'MODULE_NOT_FOUND' && 
                             (err.message.includes("Cannot find module './app'") || err.message.includes("Cannot find module '../app'"));
      
      if (isAppJsMissing) {
        console.warn('src/app.js not found. Initializing fallback Express server to host our modules.');
        
        app = express();
        
        // Standard parser middlewares
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Mount our routes in the fallback server
        const announcementRoutes = require('./modules/announcements/announcement.routes');
        const messageRoutes = require('./modules/messages/message.routes');
        const notificationRoutes = require('./modules/notifications/notification.routes');

        app.use('/api/v1/announcements', announcementRoutes);
        app.use('/api/v1/communications', messageRoutes);
        app.use('/api/v1/notifications', notificationRoutes);

        // Fallback root endpoint
        app.get('/', (req, res) => {
          res.json({
            success: true,
            message: 'Parent Teacher App Backend (Fallback Mode)',
            modules: ['announcements', 'communications', 'notifications'],
          });
        });

        // 404 handler
        app.use((req, res) => {
          res.status(404).json({
            success: false,
            message: `Route not found: ${req.method} ${req.url}`,
            error: 'NOT_FOUND',
          });
        });
      } else {
        // App.js exists but failed to compile/load, throw the original error
        throw err;
      }
    }

    // 2. Start HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          console.log('Database connection closed.');
          process.exit(0);
        } catch (dbErr) {
          console.error('Error during database disconnection:', dbErr.message);
          process.exit(1);
        }
      });

      // Force terminate after 10s
      setTimeout(() => {
        console.error('Forceful shutdown executed after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Fatal startup error:', error.message);
    process.exit(1);
  }
};

startServer();
