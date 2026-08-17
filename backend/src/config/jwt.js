const jwt = require('jsonwebtoken');
const env = require('./environment');

const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing or invalid',
      error: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    let errorType = 'INVALID_TOKEN';
    let message = 'Invalid authorization token';
    if (error.name === 'TokenExpiredError') {
      errorType = 'TOKEN_EXPIRED';
      message = 'Authorization token has expired';
    }
    
    return res.status(401).json({
      success: false,
      message,
      error: errorType,
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: insufficient permissions',
        error: 'FORBIDDEN',
      });
    }
    next();
  };
};

module.exports = {
  signToken,
  verifyToken,
  authenticateJWT,
  authorizeRoles,
};
