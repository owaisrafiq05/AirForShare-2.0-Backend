const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Get all public rooms
router.get('/public', roomController.getPublicRooms);

// Get room details
router.get('/:roomId', roomController.getRoomById);

// Create a new room
router.post('/create', roomController.createRoom);

module.exports = router; 