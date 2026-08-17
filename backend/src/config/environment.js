const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
];

const missingEnvVars = [];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    missingEnvVars.push(key);
  }
});

if (missingEnvVars.length > 0) {
  throw new Error(`Environment validation failed. The following required variables are missing: ${missingEnvVars.join(', ')}`);
}

module.exports = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:8081',
};
