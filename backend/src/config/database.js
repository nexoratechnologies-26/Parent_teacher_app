const mongoose = require('mongoose');
const env = require('./environment');

// Global cache for serverless environments (e.g. Vercel) to prevent connection leaks
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connStr = env.DATABASE_URL;
    if (!connStr) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }
    
    // Mask credentials in connection string for logging
    const maskedUrl = connStr.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to database (${maskedUrl})...`);

    cached.promise = mongoose.connect(connStr, {
      bufferCommands: false,
    }).then((m) => {
      console.log(`MongoDB Connected successfully to host: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = {
  connectDB,
  connection: mongoose.connection
};
