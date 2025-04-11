const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Automatically delete document after 1 hour (3600 seconds)
  }
});

// Create an index on uploadedAt for TTL functionality
FileSchema.index({ uploadedAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('File', FileSchema); 