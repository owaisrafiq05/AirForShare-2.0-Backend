const path = require('path');
const fs = require('fs');
const { getFileInfo, getPublicFiles: fetchPublicFiles, deleteFile } = require('../utils/fileUtils');
const { uploadToCloudinary, deleteFromCloudinary, getCloudinaryFileInfo } = require('../utils/cloudinaryUtils');

/**
 * @desc   Get all public files
 * @route  GET /api/files/public
 * @access Public
 */
const getPublicFiles = (req, res) => {
  try {
    const files = fetchPublicFiles();
    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Error fetching public files:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching public files'
    });
  }
};

/**
 * @desc   Upload a public file
 * @route  POST /api/files/public/upload
 * @access Public
 */
const uploadPublicFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file, true);
    
    // Get file info in a standardized format
    const fileInfo = getCloudinaryFileInfo(cloudinaryResult, req.file);
    
    res.status(201).json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('Error uploading public file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file'
    });
  }
};

/**
 * @desc   Get a public file by filename
 * @route  GET /api/files/public/:filename
 * @access Public
 */
const getPublicFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/public', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error fetching public file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching file'
    });
  }
};

/**
 * @desc   Delete a public file
 * @route  DELETE /api/files/public/:filename
 * @access Public
 */
const deletePublicFile = async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Delete file from Cloudinary
    const result = await deleteFromCloudinary(publicId);
    
    if (result.result !== 'ok') {
      return res.status(404).json({
        success: false,
        message: 'File not found or could not be deleted'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting public file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
};

/**
 * @desc   Upload a private file (for P2P sharing)
 * @route  POST /api/files/private/upload
 * @access Public
 */
const uploadPrivateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file, false);
    
    // Get file info in a standardized format
    const fileInfo = getCloudinaryFileInfo(cloudinaryResult, req.file);
    
    res.status(201).json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('Error uploading private file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file'
    });
  }
};

/**
 * @desc   Get a private file by filename
 * @route  GET /api/files/private/:filename
 * @access Restricted (should only be accessible by users in the same room)
 */
const getPrivateFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/private', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // In a production environment, you would implement proper authentication
    // to ensure only authorized users can access private files
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error fetching private file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching file'
    });
  }
};

module.exports = {
  getPublicFiles,
  uploadPublicFile,
  getPublicFile,
  deletePublicFile,
  uploadPrivateFile,
  getPrivateFile
}; 