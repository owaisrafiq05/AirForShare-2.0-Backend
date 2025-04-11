const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - update with your actual connection string
    // Replace this with a value from your .env file in a production setup
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/airforshare';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process in production, handle the error gracefully
    // process.exit(1);
    return null;
  }
};

module.exports = connectDB; 