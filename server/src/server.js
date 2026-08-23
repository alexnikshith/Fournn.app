require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serverless DB Connection Manager
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      isConnected = true;
      console.log('Connected to MongoDB Atlas.');
      return;
    } catch (err) {
      console.error('MongoDB Atlas connection failed:', err.message);
    }
  }

  // Only attempt MongoMemoryServer in local development (Never in Vercel Serverless environment)
  if (!process.env.VERCEL) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log('Connected to local MongoMemoryServer at:', memoryUri);
      return;
    } catch (memErr) {
      console.error('MongoMemoryServer fallback failed:', memErr.message);
    }
  }
}

// DB Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB Connection Middleware error:', err.message);
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler Guaranteeing Always Valid JSON Responses
app.use((err, req, res, next) => {
  console.error('Server Uncaught Error:', err);
  res.status(500).json({ 
    error: err.message || 'An internal server error occurred. Please try again.' 
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Fournn API Server running on port ${PORT}`);
  });
}

module.exports = app;
