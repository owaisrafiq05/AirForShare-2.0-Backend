const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
  const directoryPath = path.join(__dirname, '../../uploads/public');
  
  try {
    // Note: In a production environment with Cloudinary integration, 
    // you would either:
    // 1. Fetch all files from Cloudinary using their API
    // 2. Maintain a local database of uploaded files with their Cloudinary details
    
    const files = fs.readdirSync(directoryPath);
    return files.map(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        size: stats.size,
        uploadedAt: stats.mtime,
        url: `/uploads/public/${file}`
      };
    });
  } catch (error) {
    console.error('Error reading public files directory:', error);
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
      return true;
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
  deleteFile
}; 