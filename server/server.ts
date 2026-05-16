import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors());
app.use(express.json());

// Serve static demo files
app.use('/demo', express.static(path.join(__dirname, '../demo')));

// Database connection (Serverless compatible)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Ensure DB is connected before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Mount API Routes
app.use('/api', apiRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Only bind to port if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Functions
export default app;