const File = require('../models/File');

/**
 * Save file metadata to database
 * @param {Object} fileInfo - File information object
 * @returns {Promise<Object>} - Saved file document
 */
const saveFileToDb = async (fileInfo) => {
  try {
    const file = new File({
      name: fileInfo.name,
      size: fileInfo.size,
      mimetype: fileInfo.mimetype,
      url: fileInfo.url,
      publicId: fileInfo.publicId,
      isPublic: fileInfo.isPublic !== undefined ? fileInfo.isPublic : true,
      uploadedAt: fileInfo.uploadedAt || new Date()
    });
    
    await file.save();
    return file;
  } catch (error) {
    console.error('Error saving file to database:', error);
    throw error;
  }
};

/**
 * Get all public files from database
 * @returns {Promise<Array>} - Array of public files
 */
const getPublicFilesFromDb = async () => {
  try {
    const files = await File.find({ isPublic: true }).sort({ uploadedAt: -1 });
    return files;
  } catch (error) {
    console.error('Error fetching public files from database:', error);
    return [];
  }
};

/**
 * Get all private files from database
 * @returns {Promise<Array>} - Array of private files
 */
const getPrivateFilesFromDb = async () => {
  try {
    const files = await File.find({ isPublic: false }).sort({ uploadedAt: -1 });
    return files;
  } catch (error) {
    console.error('Error fetching private files from database:', error);
    return [];
  }
};

/**
 * Delete file metadata from database by publicId
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise<boolean>} - Whether the file was successfully deleted
 */
const deleteFileFromDb = async (publicId) => {
  try {
    const result = await File.deleteOne({ publicId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting file from database:', error);
    return false;
  }
};

/**
 * Get file by publicId
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise<Object|null>} - File document or null if not found
 */
const getFileByPublicId = async (publicId) => {
  try {
    const file = await File.findOne({ publicId });
    return file;
  } catch (error) {
    console.error('Error fetching file from database:', error);
    return null;
  }
};

/**
 * Get all files from database
 * @returns {Promise<Array>} - Array of all files
 */
const getAllFilesFromDb = async () => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    return files;
  } catch (error) {
    console.error('Error fetching all files from database:', error);
    return [];
  }
};

module.exports = {
  saveFileToDb,
  getPublicFilesFromDb,
  getPrivateFilesFromDb,
  deleteFileFromDb,
  getFileByPublicId,
  getAllFilesFromDb
}; 