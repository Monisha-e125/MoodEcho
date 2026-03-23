const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
    path: '/'
  };
};

// ═══ REGISTER ═══
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    logger.info(`📝 Register attempt: ${email}`);

    if (!name || !email || !password) {
      return ApiResponse.badRequest(res, 'Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.conflict(res, 'Email already registered');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    logger.info(`✅ User created: ${email}`);

    // Generate tokens
    let accessToken, refreshToken;
    try {
      accessToken = user.generateAccessToken();
      refreshToken = user.generateRefreshToken();
    } catch (tokenErr) {
      logger.error(`❌ Token error: ${tokenErr.message}`);
      await User.findByIdAndDelete(user._id);
      return ApiResponse.error(res, 'Server configuration error — JWT secrets missing');
    }

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    logger.info(`✅ Register complete: ${email}`);

    return ApiResponse.created(res, {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    }, 'Welcome to MoodEcho! 🎉');
  } catch (error) {
    logger.error(`❌ Register error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);

    if (error.code === 11000) {
      return ApiResponse.conflict(res, 'Email already registered');
    }
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map((e) => e.message);
      return ApiResponse.badRequest(res, msgs.join('. '));
    }
    return ApiResponse.error(res, 'Registration failed. Please try again.');
  }
};

// ═══ LOGIN ═══
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info(`🔐 Login attempt: ${email}`);

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      logger.warn(`❌ Login failed — not found: ${email}`);
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account deactivated');
    }

    let isValid;
    try {
      isValid = await user.comparePassword(password);
    } catch (compareErr) {
      logger.error(`❌ Password compare error: ${compareErr.message}`);
      return ApiResponse.error(res, 'Login failed. Please try again.');
    }

    if (!isValid) {
      logger.warn(`❌ Login failed — wrong password: ${email}`);
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate tokens
    let accessToken, refreshToken;
    try {
      accessToken = user.generateAccessToken();
      refreshToken = user.generateRefreshToken();
    } catch (tokenErr) {
      logger.error(`❌ Token error: ${tokenErr.message}`);
      return ApiResponse.error(res, 'Server configuration error — JWT secrets missing');
    }

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    logger.info(`✅ Login successful: ${email}`);

    return ApiResponse.success(res, {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    }, 'Welcome back! 👋');
  } catch (error) {
    logger.error(`❌ Login error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    return ApiResponse.error(res, 'Login failed. Please try again.');
  }
};

// ═══ LOGOUT ═══
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    return ApiResponse.error(res, 'Logout failed');
  }
};

// ═══ GET ME ═══
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    return ApiResponse.success(res, user.toSafeObject());
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch profile');
  }
};

// ═══ UPDATE PROFILE ═══
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'preferences'];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true
    });

    return ApiResponse.success(res, user.toSafeObject(), 'Profile updated');
  } catch (error) {
    return ApiResponse.error(res, 'Update failed');
  }
};

// ═══ REFRESH TOKEN ═══
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return ApiResponse.unauthorized(res, 'Refresh token required');

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return ApiResponse.unauthorized(res, 'Invalid refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return ApiResponse.unauthorized(res, 'Invalid refresh token');
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    return ApiResponse.success(res, { accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Token refresh failed');
  }
};

// ═══ DELETE ACCOUNT (GDPR) ═══
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const MoodEntry = require('../models/MoodEntry');
    const WellnessActivity = require('../models/WellnessActivity');
    const Notification = require('../models/Notification');
    const Message = require('../models/Message');

    await Promise.all([
      MoodEntry.deleteMany({ user: userId }),
      WellnessActivity.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      Message.deleteMany({ sender: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });

    logger.info(`🗑️ Account deleted: ${req.user.email}`);
    return ApiResponse.success(res, null, 'Account and all data deleted');
  } catch (error) {
    logger.error(`Delete error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to delete account');
  }
};

// ═══ EXPORT DATA (GDPR) ═══
exports.exportData = async (req, res) => {
  try {
    const userId = req.user._id;

    const MoodEntry = require('../models/MoodEntry');
    const WellnessActivity = require('../models/WellnessActivity');

    const [user, moods, activities] = await Promise.all([
      User.findById(userId),
      MoodEntry.find({ user: userId }).sort({ createdAt: -1 }),
      WellnessActivity.find({ user: userId }).sort({ createdAt: -1 })
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      user: user.toSafeObject(),
      moodEntries: moods,
      wellnessActivities: activities
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=moodecho-data-${Date.now()}.json`);
    return res.json(exportData);
  } catch (error) {
    return ApiResponse.error(res, 'Export failed');
  }
};