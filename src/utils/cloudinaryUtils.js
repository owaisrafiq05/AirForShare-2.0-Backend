const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cloudinaryConfig = require('../config/cloudinaryConfig');

// Configure cloudinary
cloudinary.config(cloudinaryConfig);

/**
 * Upload a file to Cloudinary
 * @param {Object} file - File object from multer
 * @param {boolean} isPublic - Whether the file is for public or private sharing
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (file, isPublic = true) => {
  try {
    // Set the folder based on whether it's public or private
    const folder = isPublic ? 'airforshare/public' : 'airforshare/private';
    
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto', // Automatically detect resource type
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Create a unique public ID
    });
    
    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(file.path);
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Get file info in a standardized format from Cloudinary result
 * @param {Object} cloudinaryResult - Result from Cloudinary upload
 * @param {Object} originalFile - Original file details
 * @returns {Object} - Standardized file info
 */
const getCloudinaryFileInfo = (cloudinaryResult, originalFile) => {
  return {
    id: cloudinaryResult.public_id,
    name: originalFile.originalname,
    size: originalFile.size,
    mimetype: originalFile.mimetype,
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
    uploadedAt: new Date()
  };
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryFileInfo
}; 