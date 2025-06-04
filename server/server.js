import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB BEFORE starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});