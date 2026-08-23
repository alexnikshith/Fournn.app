require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Clean Serverless DB Connection Manager (Zero Binary Dependencies)
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000
      });
      isConnected = true;
      console.log('Connected to MongoDB Atlas database successfully.');
      return;
    } catch (err) {
      console.error('MongoDB Atlas connection attempt failed:', err.message);
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

// API Routes (Mounted on both /api and / for Vercel serverless compatibility)
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Global Error Handler Guaranteeing Always Valid JSON Responses
app.use((err, req, res, next) => {
  console.error('Server Uncaught Error:', err);
  res.status(500).json({ 
    error: err.message || 'An internal server error occurred. Please try again.' 
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Fournn API Server running on port ${PORT}`);
  });
}

module.exports = app;
