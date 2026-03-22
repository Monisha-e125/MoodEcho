const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Please login to continue');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Session expired. Please login again.');
      }
      return ApiResponse.unauthorized(res, 'Invalid token');
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return ApiResponse.unauthorized(res, 'User not found or deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
};

module.exports = { protect };