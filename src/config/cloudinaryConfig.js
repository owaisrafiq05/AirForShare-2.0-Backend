/**
 * Cloudinary configuration
 * 
 * For better security, move these values to .env file
 */
module.exports = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
}; 