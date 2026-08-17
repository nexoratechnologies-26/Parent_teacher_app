const mongoose = require('mongoose');
const env = require('./environment');

const connectDB = async () => {
  try {
    const connStr = env.DATABASE_URL;
    // Mask credentials in connection string for logging
    const maskedUrl = connStr.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    
    console.log(`Connecting to database...`);
    
    const conn = await mongoose.connect(connStr);
    
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    throw error; // Rethrow to let server.js handle graceful startup/shutdown
  }
};

module.exports = {
  connectDB,
  connection: mongoose.connection
};
