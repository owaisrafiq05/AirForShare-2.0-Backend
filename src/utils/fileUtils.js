const fs = require('fs');
const path = require('path');
const multer = require('multer');

// In-memory store of uploaded files (temporary solution until database is implemented)
// Files will be stored with their metadata
const uploadedFiles = {
  public: [],
  private: []
};

// Configure storage for public files
const publicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../uploads/public');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original filename to prevent duplicate names
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Configure storage for private files
const privateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../uploads/private');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original filename to prevent duplicate names
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Accept all file types for now
  // You can implement specific file type filtering here if needed
  cb(null, true);
};

// Create multer upload instances
const publicUpload = multer({
  storage: publicStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit file size to 100MB
  },
  fileFilter
});

const privateUpload = multer({
  storage: privateStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit file size to 100MB
  },
  fileFilter
});

// Function to add a file to the in-memory store
const addFileToStore = (fileInfo, isPublic = true) => {
  const store = isPublic ? uploadedFiles.public : uploadedFiles.private;
  
  // Add file to the store
  store.push({
    ...fileInfo,
    addedAt: new Date()
  });
  
  // Sort files by addedAt date (newest first)
  store.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  
  return store;
};

// Function to get file info
const getFileInfo = (file, isPublic = true) => {
  return {
    id: path.basename(file.filename, path.extname(file.filename)),
    name: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path,
    url: isPublic ? `/uploads/public/${file.filename}` : `/uploads/private/${file.filename}`,
    uploadedAt: new Date()
  };
};

// Function to get all public files
const getPublicFiles = () => {
  try {
    // Return files from the in-memory store instead of the file system
    return uploadedFiles.public;
    
    // Note: In a production environment with Cloudinary integration, 
    // you would either:
    // 1. Fetch all files from Cloudinary using their API
    // 2. Maintain a local database of uploaded files with their Cloudinary details
  } catch (error) {
    console.error('Error getting public files:', error);
    return [];
  }
};

// Function to delete a file
const deleteFile = (filename, isPublic = true) => {
  const dirPath = isPublic ? 
    path.join(__dirname, '../../uploads/public') : 
    path.join(__dirname, '../../uploads/private');
  
  const filePath = path.join(dirPath, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Also remove from the in-memory store
      const store = isPublic ? uploadedFiles.public : uploadedFiles.private;
      const index = store.findIndex(file => file.name === filename || file.publicId === filename);
      
      if (index !== -1) {
        store.splice(index, 1);
        return true;
      }
      
      return false;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
    return false;
  }
};

module.exports = {
  publicUpload,
  privateUpload,
  getFileInfo,
  getPublicFiles,
  deleteFile,
  addFileToStore
}; 