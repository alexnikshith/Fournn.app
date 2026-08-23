require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Database Connection with seamless Memory Server fallback
let dbConnected = false;
async function connectDB() {
  if (dbConnected) return;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fournn';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log('Connected to MongoDB instance.');
  } catch (err) {
    console.log('Local MongoDB connection failed. Launching MongoMemoryServer in-memory fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      dbConnected = true;
      console.log('Connected to In-Memory MongoDB Server at:', memoryUri);
    } catch (memErr) {
      console.error('Failed to start in-memory database:', memErr.message);
    }
  }
}

connectDB();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Fournn API Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function deployment
module.exports = app;
