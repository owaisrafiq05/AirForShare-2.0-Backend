# Air For Share 2.0 - P2P File Sharing Backend

Air For Share 2.0 is a peer-to-peer (P2P) file sharing system that allows users to share files both publicly and privately. The backend is built using Node.js, Express, Socket.IO, and Cloudinary for file storage.

## Features

- **Public File Sharing**: Upload and share files with everyone
- **Private P2P File Sharing**: Share files directly with specific users
- **Real-time Communication**: Chat with other users in public or private rooms
- **Cloud Storage**: Files are stored securely in Cloudinary
- **WebRTC Support**: Direct P2P connections for efficient file transfers

## Technologies Used

- **Node.js & Express**: Backend server and API
- **Socket.IO**: Real-time bi-directional communication
- **Cloudinary**: Cloud storage for uploaded files
- **Multer**: Middleware for handling file uploads
- **WebRTC** (via frontend): Peer-to-peer connections

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Cloudinary account
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/owaisrafiq05/AirForShare-2.0-Backend.git
   cd AirForShare-2.0-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/airforshare
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Set up Cloudinary configuration:
   - Create a Cloudinary account at [cloudinary.com](https://cloudinary.com) if you don't have one
   - Get your Cloudinary credentials (cloud name, API key, and API secret)
   - Add them to your `.env` file

5. Set up MongoDB:
   - Install MongoDB locally or create a MongoDB Atlas cluster
   - Update the `MONGO_URI` in your `.env` file with your MongoDB connection string

6. Create upload directories (for local development before Cloudinary upload):
   ```bash
   mkdir -p uploads/public uploads/private
   ```

7. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Project Structure

```
├── server.js              # Main entry point
├── package.json           # Project dependencies
├── uploads/               # Temporary storage for uploads before Cloudinary
│   ├── public/            # Public files
│   └── private/           # Private files
├── src/
│   ├── config/            # Configuration files
│   │   └── cloudinaryConfig.js  # Cloudinary credentials
│   ├── controllers/       # Request handlers
│   │   ├── fileController.js    # File operations controller
│   │   └── roomController.js    # Room operations controller
│   ├── middlewares/       # Express middlewares
│   │   └── errorMiddleware.js   # Error handling middleware
│   ├── routes/            # API routes
│   │   ├── fileRoutes.js        # File-related routes
│   │   └── roomRoutes.js        # Room-related routes
│   └── utils/             # Utility functions
│       ├── cloudinaryUtils.js   # Cloudinary helper functions
│       ├── fileUtils.js         # File operations utilities
│       └── socket.js            # Socket.IO event handlers
```

## Cloudinary Integration

This project uses Cloudinary for file storage, which provides several benefits:

- **Cloud Storage**: Files are stored securely in the cloud
- **CDN Delivery**: Automatic CDN distribution for faster file delivery
- **Image & Video Processing**: Automatic optimization and transformation capabilities
- **Scalability**: Better handling of large files and high traffic

### How Files are Handled

1. Files are first uploaded to the server using Multer
2. The files are then uploaded to Cloudinary
3. Once the upload to Cloudinary is successful, the local file is deleted
4. File URLs and metadata are returned to the client
5. For private sharing, file information is shared through Socket.IO events

## WebRTC P2P File Sharing

For direct peer-to-peer file sharing:

1. Users connect to a room via Socket.IO
2. When a new user joins, WebRTC connections are established between peers
3. Socket.IO is used for WebRTC signaling
4. Once connected, files can be transferred directly between peers without going through the server

## Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.

## Authors

- Abubakar Bin Hassan
- Muhammad Owais Rafiq 