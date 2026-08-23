require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Synchronous Connection Manager for Serverless & Standalone Execution
let cachedDb = null;
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;

  connectionPromise = (async () => {
    if (mongoUri && mongoUri.trim().length > 0) {
      try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000
        });
        console.log('MongoDB Atlas connected successfully.');
        return mongoose.connection;
      } catch (err) {
        console.error('MongoDB Atlas connection error:', err.message);
      }
    }

    // Fallback: Local / Memory Server (for non-Vercel local dev)
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        await mongoose.connect(memoryUri);
        console.log('Connected to In-Memory MongoDB at:', memoryUri);
        return mongoose.connection;
      } catch (memErr) {
        console.error('In-memory DB fallback failed:', memErr.message);
      }
    }

    // Secondary fallback: Local MongoDB
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/fournn', { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB.');
      return mongoose.connection;
    } catch (localErr) {
      console.error('Local MongoDB connection failed.');
    }
  })();

  try {
    cachedDb = await connectionPromise;
    return cachedDb;
  } finally {
    connectionPromise = null;
  }
}

// Guaranteed DB Connection Middleware BEFORE processing any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err.message);
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

module.exports = app;
