# Air For Share 2.0 API Documentation

This documentation provides information about the API endpoints for the Air For Share 2.0 platform, a P2P file sharing system with Cloudinary integration for file storage.

## Base URL

```
http://localhost:3000/api
```

## Cloudinary Integration

This API uses Cloudinary for file storage, which provides several benefits:

- Files are stored securely in the cloud
- Automatic CDN distribution for faster file delivery
- Image and video optimization
- Access control capabilities
- Better scalability for file storage

To use the Cloudinary integration:

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloudinary credentials (cloud name, API key, and API secret)
3. Add them to your `.env` file

## MongoDB Integration

This API uses MongoDB to store file metadata, which provides:

- Persistent storage of file information
- Automatic cleanup of old files (TTL feature)
- Efficient querying of file information

Files in the system have a Time-To-Live (TTL) of 1 hour. After this period, the file metadata will be automatically removed from the database. This ensures that the system doesn't accumulate unnecessary file references over time.

## API Endpoints

### Files API

#### Get All Public Files

Retrieves a list of all files that have been shared publicly.

- **URL**: `/files/public`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "name": "document.pdf",
          "size": 1024000,
          "uploadedAt": "2023-05-08T15:34:16.789Z",
          "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1620481256/airforshare/public/1620481256789-document.pdf"
        },
        {
          "name": "image.jpg",
          "size": 512000,
          "uploadedAt": "2023-05-08T15:34:38.456Z",
          "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1620481278/airforshare/public/1620481278456-image.jpg"
        }
      ]
    }
    ```

#### Upload Public File

Uploads a file to be shared publicly. The file will be uploaded to Cloudinary.

- **URL**: `/files/public/upload`
- **Method**: `POST`
- **Auth Required**: No
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `file`: The file to upload
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "airforshare/public/1620481256789-document",
        "name": "document.pdf",
        "size": 1024000,
        "mimetype": "application/pdf",
        "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1620481256/airforshare/public/1620481256789-document.pdf",
        "publicId": "airforshare/public/1620481256789-document",
        "uploadedAt": "2023-05-08T15:34:16.789Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "success": false,
      "message": "No file uploaded"
    }
    ```

#### Get Public File

Retrieves a specific public file by its filename.

- **URL**: `/files/public/:filename`
- **Method**: `GET`
- **Auth Required**: No
- **URL Params**:
  - `filename`: The name of the file to retrieve
- **Success Response**:
  - **Code**: 200
  - **Content**: The file content
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "success": false,
      "message": "File not found"
    }
    ```

#### Delete Public File

Deletes a specific public file by its Cloudinary public ID.

- **URL**: `/files/public/:publicId`
- **Method**: `DELETE`
- **Auth Required**: No
- **URL Params**:
  - `publicId`: The Cloudinary public ID of the file to delete
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "message": "File deleted successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "success": false,
      "message": "File not found or could not be deleted"
    }
    ```

#### Upload Private File

Uploads a file for private sharing (P2P). The file will be uploaded to Cloudinary.

- **URL**: `/files/private/upload`
- **Method**: `POST`
- **Auth Required**: No
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `file`: The file to upload
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "airforshare/private/1620481300123-private-document",
        "name": "private-document.pdf",
        "size": 1024000,
        "mimetype": "application/pdf",
        "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1620481300/airforshare/private/1620481300123-private-document.pdf",
        "publicId": "airforshare/private/1620481300123-private-document",
        "uploadedAt": "2023-05-08T15:35:00.123Z"
      }
    }
    ```

#### Get Private File

Retrieves a specific private file by its filename.

- **URL**: `/files/private/:filename`
- **Method**: `GET`
- **Auth Required**: No (in production, this should require authentication)
- **URL Params**:
  - `filename`: The name of the file to retrieve
- **Success Response**:
  - **Code**: 200
  - **Content**: The file content
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "success": false,
      "message": "File not found"
    }
    ```

### Rooms API

#### Get All Public Rooms

Retrieves a list of all public rooms.

- **URL**: `/rooms/public`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "id": "5f8d5e6c-1234-5678-90ab-cdef01234567",
          "userCount": 3,
          "createdAt": "2023-05-08T15:30:00.000Z"
        },
        {
          "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
          "userCount": 1,
          "createdAt": "2023-05-08T15:45:00.000Z"
        }
      ]
    }
    ```

#### Get Room By ID

Retrieves details about a specific room.

- **URL**: `/rooms/:roomId`
- **Method**: `GET`
- **Auth Required**: No
- **URL Params**:
  - `roomId`: The ID of the room
- **Success Response**:
  - **Code**: 200
  - **Content for Public Room**:
    ```json
    {
      "success": true,
      "data": {
        "id": "5f8d5e6c-1234-5678-90ab-cdef01234567",
        "userCount": 3,
        "isPrivate": false,
        "createdAt": "2023-05-08T15:30:00.000Z",
        "users": [
          {
            "id": "socket-id-1",
            "username": "User1"
          },
          {
            "id": "socket-id-2",
            "username": "User2"
          },
          {
            "id": "socket-id-3",
            "username": "User3"
          }
        ]
      }
    }
    ```
  - **Content for Private Room**:
    ```json
    {
      "success": true,
      "data": {
        "id": "a1b2c3d4-5678-90ab-cdef-ghijklmnopqr",
        "userCount": 1,
        "isPrivate": true,
        "createdAt": "2023-05-08T15:45:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "success": false,
      "message": "Room not found"
    }
    ```

#### Create Room

Creates a new room.

- **URL**: `/rooms/create`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "isPrivate": true
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "roomId": "b5c6d7e8-9012-3456-7890-abcdef123456",
        "isPrivate": true,
        "message": "Room created successfully. Use the Socket.IO client to join this room."
      }
    }
    ```

## Socket.IO Events

The Air For Share 2.0 platform uses Socket.IO for real-time P2P communication. Here's a list of available events:

### Client-to-Server Events

These are the events that the client emits to the server:

#### `joinRoom`

Join or create a room.

- **Payload**:
  ```typescript
  {
    roomId?: string; // Optional. If not provided, a new room will be created
    username: string; // The user's display name
    isPrivate?: boolean; // Optional. Default is false
  }
  ```

#### `p2pSignal`

Send a WebRTC signaling message to another peer.

- **Payload**:
  ```typescript
  {
    to: string; // The socket ID of the recipient
    signal: any; // The signaling data
    from: string; // The socket ID of the sender
  }
  ```

#### `sendMessage`

Send a text message to everyone in the room.

- **Payload**:
  ```typescript
  {
    roomId: string; // The ID of the room
    message: string; // The message content
  }
  ```

#### `fileInfo`

Share information about a file to everyone in the room.

- **Payload**:
  ```typescript
  {
    roomId: string; // The ID of the room
    fileInfo: {
      id: string;
      name: string;
      size: number;
      url: string;
      mimetype: string;
    }
  }
  ```

#### `inviteToRoom`

Invite a user to a private room.

- **Payload**:
  ```typescript
  {
    roomId: string; // The ID of the room
    targetSocketId: string; // The socket ID of the user to invite
  }
  ```

### Server-to-Client Events

These are the events that the server emits to the client:

#### `userJoined`

Emitted when a user joins a room.

- **Payload**:
  ```typescript
  {
    user: {
      id: string; // The socket ID of the user
      username: string; // The username of the user
    };
    users: Array<{ id: string; username: string }>; // List of users in the room
    roomId: string; // The ID of the room
    isPrivate: boolean; // Whether the room is private
  }
  ```

#### `roomInfo`

Emitted to a user when they successfully join a room.

- **Payload**:
  ```typescript
  {
    roomId: string; // The ID of the room
    users: Array<{ id: string; username: string }>; // List of users in the room
    isPrivate: boolean; // Whether the room is private
  }
  ```

#### `p2pSignal`

Emitted when a peer sends a WebRTC signaling message.

- **Payload**:
  ```typescript
  {
    from: string; // The socket ID of the sender
    signal: any; // The signaling data
  }
  ```

#### `message`

Emitted when a user sends a text message.

- **Payload**:
  ```typescript
  {
    user: {
      id: string; // The socket ID of the user
      username: string; // The username of the user
    };
    message: string; // The message content
    time: string; // The time the message was sent
  }
  ```

#### `newFile`

Emitted when a user shares a file.

- **Payload**:
  ```typescript
  {
    user: {
      id: string; // The socket ID of the user
      username: string; // The username of the user
    };
    fileInfo: {
      id: string;
      name: string;
      size: number;
      url: string;
      mimetype: string;
    };
    time: string; // The time the file was shared
  }
  ```

#### `roomInvitation`

Emitted when a user is invited to a private room.

- **Payload**:
  ```typescript
  {
    roomId: string; // The ID of the room
    from: {
      id: string; // The socket ID of the inviter
      username: string; // The username of the inviter
    };
    isPrivate: boolean; // Whether the room is private
  }
  ```

#### `userLeft`

Emitted when a user leaves a room.

- **Payload**:
  ```typescript
  {
    userId: string; // The socket ID of the user who left
    username: string; // The username of the user who left
    users: Array<{ id: string; username: string }>; // Updated list of users in the room
  }
  ```

#### `roomJoinError`

Emitted when a user cannot join a room.

- **Payload**:
  ```typescript
  {
    message: string; // Error message
  }
  ```

#### `inviteError`

Emitted when a user cannot invite another user.

- **Payload**:
  ```typescript
  {
    message: string; // Error message
  }
  ```

## Integration Examples

### Frontend Integration Example (JavaScript/React)

Here's a simple example of how to connect to the server using Socket.IO and join a room:

```javascript
import { io } from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:3000');

// Join a room
const joinRoom = (roomId, username, isPrivate = false) => {
  socket.emit('joinRoom', { roomId, username, isPrivate });
};

// Listen for room join confirmation
socket.on('roomInfo', (data) => {
  console.log('Joined room:', data.roomId);
  console.log('Users in room:', data.users);
});

// Listen for new users joining
socket.on('userJoined', (data) => {
  console.log(`User ${data.user.username} joined the room`);
  console.log('Updated user list:', data.users);
});

// Send a message to the room
const sendMessage = (roomId, message) => {
  socket.emit('sendMessage', { roomId, message });
};

// Listen for incoming messages
socket.on('message', (data) => {
  console.log(`${data.user.username}: ${data.message}`);
});

// Upload and share a file
const uploadAndShareFile = async (roomId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Upload the file
    const response = await fetch('http://localhost:3000/api/files/public/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Share the file info with the room
      socket.emit('fileInfo', {
        roomId,
        fileInfo: result.data
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// Listen for shared files
socket.on('newFile', (data) => {
  console.log(`${data.user.username} shared a file: ${data.fileInfo.name}`);
  console.log('File URL:', data.fileInfo.url);
});
```

### P2P WebRTC File Transfer Example

Here's a simplified example of how to implement P2P file transfer using WebRTC:

```javascript
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';

// Connect to the server
const socket = io('http://localhost:3000');
let mySocketId;

// Keep track of peers
const peers = {};

// When connected to the server
socket.on('connect', () => {
  mySocketId = socket.id;
  console.log('Connected to server with ID:', mySocketId);
});

// Join a room
const joinRoom = (roomId, username, isPrivate = false) => {
  socket.emit('joinRoom', { roomId, username, isPrivate });
};

// When a new user joins the room
socket.on('userJoined', (data) => {
  console.log(`User ${data.user.username} joined the room`);
  
  // Create a new peer connection for the new user if it's not yourself
  if (data.user.id !== mySocketId && !peers[data.user.id]) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false
    });
    
    // When the peer generates signal data, send it to the other peer
    peer.on('signal', (signalData) => {
      socket.emit('p2pSignal', {
        to: data.user.id,
        signal: signalData,
        from: mySocketId
      });
    });
    
    // When the peer connection is established
    peer.on('connect', () => {
      console.log('Connected to peer:', data.user.username);
    });
    
    // When data is received from the peer
    peer.on('data', (data) => {
      const receivedData = JSON.parse(data.toString());
      console.log('Received data from peer:', receivedData);
    });
    
    // Store the peer connection
    peers[data.user.id] = {
      peer,
      username: data.user.username
    };
  }
});

// When you receive a signal from another peer
socket.on('p2pSignal', (data) => {
  console.log('Received signal from:', data.from);
  
  // If you already have a peer connection with this user
  if (peers[data.from]) {
    peers[data.from].peer.signal(data.signal);
  } else {
    // Create a new peer connection
    const peer = new SimplePeer({
      initiator: false,
      trickle: false
    });
    
    // When the peer generates signal data, send it to the other peer
    peer.on('signal', (signalData) => {
      socket.emit('p2pSignal', {
        to: data.from,
        signal: signalData,
        from: mySocketId
      });
    });
    
    // When the peer connection is established
    peer.on('connect', () => {
      console.log('Connected to peer:', data.from);
    });
    
    // When data is received from the peer
    peer.on('data', (data) => {
      const receivedData = JSON.parse(data.toString());
      console.log('Received data from peer:', receivedData);
    });
    
    // Signal the peer with the received signal data
    peer.signal(data.signal);
    
    // Store the peer connection
    peers[data.from] = {
      peer,
      username: 'Unknown' // You would get the username from somewhere else
    };
  }
});

// Send a file to a specific peer
const sendFileToPeer = (targetPeerId, file) => {
  if (!peers[targetPeerId]) {
    console.error('Peer not found');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: event.target.result
    };
    
    // You might want to chunk larger files for better performance
    peers[targetPeerId].peer.send(JSON.stringify({
      type: 'file',
      fileData
    }));
  };
  
  reader.readAsArrayBuffer(file);
};
```

## Error Handling

All API endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace (only in development mode)"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Resource created
- `400`: Bad request (e.g., missing required fields)
- `404`: Resource not found
- `500`: Server error 