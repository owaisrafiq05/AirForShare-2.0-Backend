const { v4: uuidv4 } = require('uuid');

// Map to store active rooms with their information
const rooms = new Map();
// Map to store user socket connections
const connectedUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Store the user connection
    connectedUsers.set(socket.id, { socketId: socket.id });
    
    // Create or join a room
    socket.on('joinRoom', ({ roomId, username, isPrivate = false }) => {
      // If no room ID is provided, create a new one
      const currentRoomId = roomId || uuidv4();
      
      // Check if room exists and create if not
      if (!rooms.has(currentRoomId)) {
        rooms.set(currentRoomId, {
          id: currentRoomId,
          users: [],
          isPrivate,
          creator: socket.id,
          createdAt: new Date()
        });
      }
      
      // Add user to room
      const room = rooms.get(currentRoomId);
      const user = { id: socket.id, username };
      
      // Check if private room and if user is allowed
      if (room.isPrivate && room.creator !== socket.id && !room.users.some(u => u.id === socket.id)) {
        // For private rooms, only allow invited users
        socket.emit('roomJoinError', { message: 'This is a private room. You need an invitation to join.' });
        return;
      }
      
      // Add user to room if not already in
      if (!room.users.some(u => u.id === socket.id)) {
        room.users.push(user);
      }
      
      // Join the socket room
      socket.join(currentRoomId);
      
      // Update connected user info
      connectedUsers.set(socket.id, {
        ...connectedUsers.get(socket.id),
        roomId: currentRoomId,
        username
      });
      
      // Notify room of new user
      io.to(currentRoomId).emit('userJoined', {
        user,
        users: room.users,
        roomId: currentRoomId,
        isPrivate: room.isPrivate
      });
      
      // Send room info back to user
      socket.emit('roomInfo', {
        roomId: currentRoomId,
        users: room.users,
        isPrivate: room.isPrivate
      });
      
      console.log(`User ${username} (${socket.id}) joined room ${currentRoomId}`);
    });
    
    // Handle P2P signaling
    socket.on('p2pSignal', ({ to, signal, from }) => {
      io.to(to).emit('p2pSignal', {
        from,
        signal
      });
    });
    
    // Handle text messages in a room
    socket.on('sendMessage', ({ roomId, message }) => {
      const user = connectedUsers.get(socket.id);
      if (!user || !user.username) return;
      
      io.to(roomId).emit('message', {
        user: { id: socket.id, username: user.username },
        message,
        time: new Date()
      });
    });
    
    // Handle file sharing information
    socket.on('fileInfo', ({ roomId, fileInfo }) => {
      const user = connectedUsers.get(socket.id);
      if (!user || !user.username) return;
      
      // Broadcast file information to room
      io.to(roomId).emit('newFile', {
        user: { id: socket.id, username: user.username },
        fileInfo,
        time: new Date()
      });
    });
    
    // Invite user to private room
    socket.on('inviteToRoom', ({ roomId, targetSocketId }) => {
      const room = rooms.get(roomId);
      const user = connectedUsers.get(socket.id);
      
      if (!room || !user) return;
      
      // Ensure only room creator can invite users to private rooms
      if (room.isPrivate && room.creator !== socket.id) {
        socket.emit('inviteError', { message: 'Only the room creator can invite others to a private room.' });
        return;
      }
      
      // Send invitation to target user
      io.to(targetSocketId).emit('roomInvitation', {
        roomId,
        from: { id: socket.id, username: user.username },
        isPrivate: room.isPrivate
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      
      if (user && user.roomId) {
        const room = rooms.get(user.roomId);
        
        if (room) {
          // Remove user from room
          room.users = room.users.filter(u => u.id !== socket.id);
          
          // Notify room that user has left
          io.to(user.roomId).emit('userLeft', {
            userId: socket.id,
            username: user.username,
            users: room.users
          });
          
          // If room is empty or creator left a private room, remove the room
          if (room.users.length === 0 || (room.isPrivate && room.creator === socket.id)) {
            rooms.delete(user.roomId);
          }
        }
      }
      
      // Remove user from connected users
      connectedUsers.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
  // Function to get active rooms (for API endpoints)
  const getPublicRooms = () => {
    const publicRooms = [];
    rooms.forEach((room) => {
      if (!room.isPrivate) {
        publicRooms.push({
          id: room.id,
          userCount: room.users.length,
          createdAt: room.createdAt
        });
      }
    });
    return publicRooms;
  };
  
  // Expose some functions for the API to use
  return {
    getPublicRooms,
    getRoomById: (roomId) => rooms.get(roomId),
    getConnectedUsers: () => Array.from(connectedUsers.values())
  };
}; 