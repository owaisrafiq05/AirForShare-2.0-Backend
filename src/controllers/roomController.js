const { v4: uuidv4 } = require('uuid');
let socketInstance;

// This function will be called from server.js to set the socket instance
const setSocketInstance = (instance) => {
  socketInstance = instance;
};

/**
 * @desc   Get all public rooms
 * @route  GET /api/rooms/public
 * @access Public
 */
const getPublicRooms = (req, res) => {
  try {
    if (!socketInstance) {
      return res.status(500).json({
        success: false,
        message: 'Socket service not initialized'
      });
    }
    
    const publicRooms = socketInstance.getPublicRooms();
    
    res.status(200).json({
      success: true,
      count: publicRooms.length,
      data: publicRooms
    });
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching public rooms'
    });
  }
};

/**
 * @desc   Get room by ID
 * @route  GET /api/rooms/:roomId
 * @access Public (but private room details are limited)
 */
const getRoomById = (req, res) => {
  try {
    if (!socketInstance) {
      return res.status(500).json({
        success: false,
        message: 'Socket service not initialized'
      });
    }
    
    const roomId = req.params.roomId;
    const room = socketInstance.getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Return limited info for private rooms through the API
    const responseData = {
      id: room.id,
      userCount: room.users.length,
      isPrivate: room.isPrivate,
      createdAt: room.createdAt
    };
    
    // Only include the list of users for public rooms
    if (!room.isPrivate) {
      responseData.users = room.users.map(user => ({
        id: user.id,
        username: user.username
      }));
    }
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room'
    });
  }
};

/**
 * @desc   Create a new room
 * @route  POST /api/rooms/create
 * @access Public
 */
const createRoom = (req, res) => {
  try {
    const { isPrivate = false } = req.body;
    
    // Generate a unique room ID
    const roomId = uuidv4();
    
    res.status(201).json({
      success: true,
      data: {
        roomId,
        isPrivate,
        message: 'Room created successfully. Use the Socket.IO client to join this room.'
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating room'
    });
  }
};

module.exports = {
  setSocketInstance,
  getPublicRooms,
  getRoomById,
  createRoom
}; 