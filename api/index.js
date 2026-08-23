try { require('dotenv').config(); } catch(e) {}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fournn_secret_jwt_production_2026';

// In-Memory Data Store Fallback for Vercel Serverless
const users = new Map();
const userAttention = new Map();
const userDecisions = new Map();
const userGoals = new Map();

function seedDemoUser(userId, name, email) {
  userAttention.set(userId, [
    {
      _id: 'att_1',
      title: '₹2,400 E-Commerce Refund Overdue',
      category: 'Financial',
      priority: 'Urgent',
      status: 'Pending Review',
      summary: 'Order return received 5 days ago, but ₹2,400 refund has not credited your bank account.',
      proposedAction: 'Dispatch follow-up support ticket inquiring about transaction reference ID.',
      draftResponse: 'Hi Support Team, order #88491 was returned 5 days ago. Please confirm status of refund.',
      evidence: ['Email confirmation #88491', 'Return delivery timestamp 5 days ago']
    },
    {
      _id: 'att_2',
      title: 'Google Staff Engineer Interview Reply Needed',
      category: 'Career',
      priority: 'Important',
      status: 'Pending Review',
      summary: 'Recruiter Sarah Jenkins requested your availability for Staff Screen scheduled in 6 days.',
      proposedAction: 'Send availability slots for Monday & Tuesday 2-4 PM PST.',
      draftResponse: 'Hi Sarah, thank you for reaching out! I am available on Monday and Tuesday between 2:00 PM and 4:00 PM PST.',
      evidence: ['Recruiter email thread', 'Calendar slot comparison']
    }
  ]);

  userDecisions.set(userId, [
    {
      _id: 'dec_1',
      title: 'Dev Laptop Upgrade Selection',
      category: 'Hardware',
      status: 'In Analysis',
      recommendedOption: 'MacBook Pro M3 Max (36GB RAM)',
      confidenceScore: 86,
      summary: 'Evaluating high-performance workstation upgrade for local LLM inference and full-stack development.'
    }
  ]);

  userGoals.set(userId, [
    {
      _id: 'goal_1',
      title: 'Land Senior AI / Full-Stack Lead Role',
      category: 'Career',
      progress: 60,
      targetDate: '2026-10-15'
    }
  ]);
}

// DB Connection Manager
let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      isConnected = true;
    } catch (e) {
      console.error('Atlas connect warning:', e.message);
    }
  }
}

app.use(async (req, res, next) => {
  try { await connectDB(); } catch(e) {}
  next();
});

// Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 1. AUTH
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const cleanEmail = email.toLowerCase();

  const userId = 'usr_' + Date.now();
  const user = { id: userId, _id: userId, name: name || email.split('@')[0], email: cleanEmail, isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
  users.set(cleanEmail, user);
  seedDemoUser(userId, user.name, cleanEmail);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const cleanEmail = email.toLowerCase();

  let user = users.get(cleanEmail);
  if (!user) {
    const userId = 'usr_' + Date.now();
    user = { id: userId, _id: userId, name: email.split('@')[0], email: cleanEmail, isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
    users.set(cleanEmail, user);
    seedDemoUser(userId, user.name, cleanEmail);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = { id: req.userId, name: 'User', email: 'user@fournn.app', isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
  res.json({ user });
});

// 2. DASHBOARD
const dashboardHandler = (req, res) => {
  const items = userAttention.get(req.userId) || userAttention.get('demo') || [];
  const decs = userDecisions.get(req.userId) || [];
  const goals = userGoals.get(req.userId) || [];

  res.json({
    metrics: {
      needAttention: items.length || 2,
      pendingDecisions: decs.length || 1,
      activeGoals: goals.length || 1,
      urgentAlerts: 1
    },
    topAttentionItems: items.length > 0 ? items.slice(0, 3) : [
      { _id: 'att_1', title: '₹2,400 E-Commerce Refund Overdue', priority: 'Urgent', category: 'Financial', summary: 'Order return received 5 days ago.' }
    ],
    recentAgentRuns: [
      { agentName: 'FollowUpAgent', action: 'Flagged ₹2,400 overdue refund', status: 'Requires Approval', createdAt: new Date() }
    ]
  });
};

app.get('/api/dashboard', authMiddleware, dashboardHandler);
app.get('/api/dashboard/summary', authMiddleware, dashboardHandler);

// 3. ATTENTION
app.get('/api/attention', authMiddleware, (req, res) => {
  const items = userAttention.get(req.userId) || [
    { _id: 'att_1', title: '₹2,400 E-Commerce Refund Overdue', priority: 'Urgent', category: 'Financial', status: 'Pending Review', summary: 'Order return received 5 days ago.' }
  ];
  res.json({ items });
});

app.post('/api/attention/:id/execute', authMiddleware, (req, res) => {
  res.json({ success: true });
});

// 4. DECISIONS
app.get('/api/decisions', authMiddleware, (req, res) => {
  const decisions = userDecisions.get(req.userId) || [
    { _id: 'dec_1', title: 'Dev Laptop Upgrade Selection', category: 'Hardware', status: 'In Analysis', recommendedOption: 'MacBook Pro M3 Max' }
  ];
  res.json({ decisions });
});

// 5. GOALS
app.get('/api/goals', authMiddleware, (req, res) => {
  const goals = userGoals.get(req.userId) || [
    { _id: 'goal_1', title: 'Land Senior AI Role', category: 'Career', progress: 60 }
  ];
  res.json({ goals });
});

// 6. GRAPH
app.get('/api/graph', authMiddleware, (req, res) => {
  res.json({
    nodes: [
      { id: 'u1', label: 'User', category: 'Person' },
      { id: 'n1', label: '₹2,400 Refund', category: 'Refund' },
      { id: 'n2', label: 'Google Screen', category: 'Event' }
    ],
    edges: [
      { id: 'e1', source: 'u1', target: 'n1', label: 'waiting_for' },
      { id: 'e2', source: 'u1', target: 'n2', label: 'requires_action' }
    ]
  });
});

// 7. DEMO CLEAR & INGEST
app.post('/api/demo/clear', authMiddleware, (req, res) => {
  userAttention.set(req.userId, []);
  userDecisions.set(req.userId, []);
  userGoals.set(req.userId, []);
  res.json({ success: true });
});

app.post('/api/integrations/ingest-email', authMiddleware, (req, res) => {
  const { subject, sender, body } = req.body;
  const items = userAttention.get(req.userId) || [];
  const newItem = {
    _id: 'att_real_' + Date.now(),
    title: subject || 'New Email',
    category: 'Career',
    priority: 'Urgent',
    status: 'Pending Review',
    summary: body || `Email from ${sender}: ${subject}`,
    proposedAction: `Acknowledge email for ${subject}`,
    draftResponse: `Thank you for sharing updates regarding ${subject}.`
  };
  items.unshift(newItem);
  userAttention.set(req.userId, items);
  res.json({ success: true, item: newItem });
});

app.get('/api/integrations', authMiddleware, (req, res) => {
  res.json({
    integrations: [
      { _id: 'i1', service: 'gmail', connected: true, accountEmail: 'user@fournn.app' },
      { _id: 'i2', service: 'calendar', connected: true, accountEmail: 'user@fournn.app' }
    ]
  });
});

app.get('/api/memory', authMiddleware, (req, res) => {
  res.json({ memories: [] });
});

app.get('/api/activity', authMiddleware, (req, res) => {
  res.json({ activities: [] });
});

// Export serverless handler
module.exports = app;
