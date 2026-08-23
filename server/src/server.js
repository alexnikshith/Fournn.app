require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Disable Mongoose buffering so requests fail/fallback instantly instead of timing out after 10000ms
mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json());

// Database Connection Manager with Fail-Fast Fallback
let isConnecting = false;
let dbConnected = false;

async function connectDB() {
  if (dbConnected && mongoose.connection.readyState === 1) return;
  if (isConnecting) return;
  
  isConnecting = true;
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      console.log('Attempting connection to MongoDB Atlas...');
      await mongoose.connect(mongoUri, { 
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000
      });
      dbConnected = true;
      isConnecting = false;
      console.log('Connected to MongoDB Atlas database successfully.');
      return;
    } catch (err) {
      console.error('MongoDB Atlas connection failed:', err.message);
      console.log('Falling back to MongoMemoryServer in-memory store...');
    }
  }

  // Fallback: Local / Memory Store
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    dbConnected = true;
    console.log('Connected to In-Memory MongoDB Server at:', memoryUri);
  } catch (memErr) {
    console.error('Failed to start in-memory database:', memErr.message);
  } finally {
    isConnecting = false;
  }
}

// Connect DB middleware for Vercel Serverless Function lifecycle
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Middleware Error:', err);
    next();
  }
});

// API Routes
app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Fournn API Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function deployment
module.exports = app;
