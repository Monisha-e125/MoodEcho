const express = require('express');
const router = express.Router();
const {
  getRooms, getRoomMessages,
  sendMessage, getHelplines
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.get('/helplines', getHelplines); // Public

router.use(protect);

router.get('/rooms', getRooms);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.post('/rooms/:roomId/messages', sendMessage);

module.exports = router;