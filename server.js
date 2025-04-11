const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require("./src/config/dbConfig");

// Route imports
const fileRoutes = require("./src/routes/fileRoutes");
const roomRoutes = require("./src/routes/roomRoutes");

// Controller imports
const roomController = require("./src/controllers/roomController");

// Middleware imports
const { errorHandler } = require("./src/middlewares/errorMiddleware");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
const publicUploadsDir = path.join(uploadsDir, "public");
const privateUploadsDir = path.join(uploadsDir, "private");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  fs.mkdirSync(publicUploadsDir);
  fs.mkdirSync(privateUploadsDir);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Socket.IO and pass instance to room controller
const socketInstance = require("./src/utils/socket")(io);
roomController.setSocketInstance(socketInstance);

// Routes
app.use("/api/files", fileRoutes);
app.use("/api/rooms", roomRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Air For Share 2.0 API - A P2P File Sharing System');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});