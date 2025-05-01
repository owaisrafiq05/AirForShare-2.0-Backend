const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { publicUpload, privateUpload } = require('../utils/fileUtils');

// Get all files (for debugging - includes both public and private)
router.get('/all', fileController.getAllFiles);

// Get all public files
router.get('/public', fileController.getPublicFiles);

// Upload a public file
router.post('/public/upload', publicUpload.single('file'), fileController.uploadPublicFile);

// Get a public file by filename - this route is obsolete for Cloudinary but kept for backwards compatibility
router.get('/public/:filename', fileController.getPublicFile);

// Delete a public file using publicId
router.delete('/public/:publicId', fileController.deletePublicFile);

// Upload a private file (for P2P sharing)
router.post('/private/upload', privateUpload.single('file'), fileController.uploadPrivateFile);

// Get a private file by filename - this route is obsolete for Cloudinary but kept for backwards compatibility
router.get('/private/:filename', fileController.getPrivateFile);

// Delete a private file using publicId
router.delete('/private/:publicId', fileController.deletePrivateFile);

module.exports = router; 