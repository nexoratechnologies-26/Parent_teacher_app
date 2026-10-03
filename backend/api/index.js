const app = require('../src/app');
const { connectDB } = require('../src/config/database');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to establish database connection.',
      error: err.message,
    });
  }
  return app(req, res);
};
