const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe,
  updateProfile, refreshToken, deleteAccount, exportData
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { registerRules, loginRules } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/refresh-token', refreshToken);

router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.get('/export', exportData);

module.exports = router;