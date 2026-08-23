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
async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fournn';

  try {
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB local instance.');
  } catch (err) {
    console.log('Local MongoDB connection failed/unavailable. Launching MongoMemoryServer in-memory fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('Connected to In-Memory MongoDB Server successfully at:', memoryUri);
    } catch (memErr) {
      console.error('Failed to start in-memory database:', memErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Fournn AI Personal Operating System API Server running on port ${PORT}`);
  });
}

startServer();
