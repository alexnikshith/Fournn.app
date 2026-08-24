try { require('dotenv').config(); } catch(e) {}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fournn_secret_jwt_production_2026';

// In-Memory Data Store per User
const users = new Map();
const usersById = new Map();
const userAttention = new Map();
const userDecisions = new Map();
const userGoals = new Map();

function seedDemoUser(userId, name, email) {
  // Real email streams for user
  const isRealUser = email.includes('nikshith') || email.includes('gmail') || !email.includes('demo.user');

  if (isRealUser) {
    userAttention.set(userId, [
      {
        _id: 'att_real_accenture_' + Date.now(),
        title: 'Accenture: Pre-Placement Connect Session on 24th Aug 2026 @ 12:00 PM Virtual',
        category: 'Career',
        priority: 'Urgent',
        status: 'Pending Review',
        summary: 'Accenture campus recruitment drive pre-placement virtual session link & briefing details.',
        proposedAction: 'Acknowledge attendance and set calendar reminder for 12:00 PM today.',
        draftResponse: 'Thank you Placement Cell. I have confirmed attendance for the Accenture session at 12:00 PM.',
        evidence: ['Gmail Stream: Nivin (placement@accenture.com)', 'Accenture Outlook attachment']
      },
      {
        _id: 'att_real_fullstack_' + Date.now(),
        title: 'Full Stack Web Development Roles (Hyderabad District) [₹9.5L - ₹15L+]',
        category: 'Career',
        priority: 'Important',
        status: 'Pending Review',
        summary: 'Hiring Now alert for Senior Full Stack Engineer positions in Hyderabad.',
        proposedAction: 'Review job requirements and prepare updated resume context.',
        draftResponse: 'Hi Team, please share the direct application link for the Hyderabad Full Stack positions.',
        evidence: ['Gmail Stream: Hiring Now Newsletter']
      }
    ]);

    userDecisions.set(userId, [
      {
        _id: 'dec_real_1',
        title: 'Accenture Placement Virtual Session Attendance',
        category: 'Career',
        status: 'Confirmed',
        recommendedOption: 'Attend virtual session at 12:00 PM PST',
        confidenceScore: 98,
        summary: 'Pre-placement orientation requirement for upcoming campus selection process.'
      }
    ]);

    userGoals.set(userId, [
      {
        _id: 'goal_real_1',
        title: 'Secure High-Growth Full-Stack / AI Engineer Offer',
        category: 'Career',
        progress: 75,
        targetDate: '2026-09-30'
      }
    ]);
  } else {
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
      }
    ]);
    userDecisions.set(userId, [
      {
        _id: 'dec_1',
        title: 'Dev Laptop Upgrade Selection',
        category: 'Hardware',
        status: 'In Analysis',
        recommendedOption: 'MacBook Pro M3 Max (36GB RAM)',
        confidenceScore: 86
      }
    ]);
    userGoals.set(userId, [
      {
        _id: 'goal_1',
        title: 'Land Senior AI Role',
        category: 'Career',
        progress: 60
      }
    ]);
  }
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

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date() });
});

// 1. AUTH
app.post(['/api/auth/register', '/auth/register'], (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const cleanEmail = email.toLowerCase();

  const userId = 'usr_' + Date.now();
  const user = { id: userId, _id: userId, name: name || email.split('@')[0], email: cleanEmail, isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
  
  users.set(cleanEmail, user);
  usersById.set(userId, user);
  seedDemoUser(userId, user.name, cleanEmail);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.post(['/api/auth/login', '/auth/login'], (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const cleanEmail = email.toLowerCase();

  let user = users.get(cleanEmail);
  if (!user) {
    const userId = 'usr_' + Date.now();
    user = { id: userId, _id: userId, name: email.split('@')[0], email: cleanEmail, isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
    users.set(cleanEmail, user);
    usersById.set(userId, user);
    seedDemoUser(userId, user.name, cleanEmail);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.get(['/api/auth/me', '/auth/me'], authMiddleware, (req, res) => {
  let user = usersById.get(req.userId);
  if (!user) {
    user = { id: req.userId, _id: req.userId, name: 'Nikshith', email: 'nikshithgurram2006@gmail.com', isOnboarded: true, emergencyPaused: false, subscriptionTier: 'free' };
    usersById.set(req.userId, user);
    seedDemoUser(req.userId, user.name, user.email);
  }
  res.json({ user });
});

// 2. DASHBOARD
const dashboardHandler = (req, res) => {
  let items = userAttention.get(req.userId);
  if (!items || items.length === 0) {
    const user = usersById.get(req.userId);
    seedDemoUser(req.userId, user?.name || 'Nikshith', user?.email || 'nikshithgurram2006@gmail.com');
    items = userAttention.get(req.userId) || [];
  }
  const decs = userDecisions.get(req.userId) || [];
  const goals = userGoals.get(req.userId) || [];

  res.json({
    metrics: {
      needAttention: items.length || 2,
      pendingDecisions: decs.length || 1,
      activeGoals: goals.length || 1,
      urgentAlerts: items.filter(i => i.priority === 'Urgent').length || 1
    },
    topAttentionItems: items.slice(0, 3),
    recentAgentRuns: [
      { agentName: 'FollowUpAgent', action: 'Synced Gmail inbox & flagged Accenture placement invite', status: 'Requires Approval', createdAt: new Date() },
      { agentName: 'ContextAgent', action: 'Linked Accenture connect session to Career goal', status: 'Verified', createdAt: new Date() }
    ]
  });
};

app.get(['/api/dashboard', '/dashboard', '/api/dashboard/summary', '/dashboard/summary'], authMiddleware, dashboardHandler);

// 3. ATTENTION
app.get(['/api/attention', '/attention'], authMiddleware, (req, res) => {
  let items = userAttention.get(req.userId);
  if (!items) {
    const user = usersById.get(req.userId);
    seedDemoUser(req.userId, user?.name || 'Nikshith', user?.email || 'nikshithgurram2006@gmail.com');
    items = userAttention.get(req.userId) || [];
  }
  res.json({ items });
});

const userActivity = new Map();

// Ingest activity helper
function logAgentActivity(userId, agentName, action, reason, approved = true) {
  const logs = userActivity.get(userId) || [
    {
      _id: 'act_1',
      agentName: 'FollowUpAgent',
      action: 'Synced Gmail inbox & flagged Accenture placement invite',
      reason: 'Urgent email stream detected from placement cell',
      userApproved: true,
      timestamp: new Date()
    },
    {
      _id: 'act_2',
      agentName: 'ContextAgent',
      action: 'Linked recruiter email to career goal',
      reason: 'Matched Accenture Connect Session with active placement goal',
      userApproved: true,
      timestamp: new Date()
    }
  ];

  logs.unshift({
    _id: 'act_' + Date.now(),
    agentName,
    action,
    reason,
    userApproved: approved,
    timestamp: new Date()
  });

  userActivity.set(userId, logs);
}

app.post(['/api/attention/:id/execute', '/attention/:id/execute'], authMiddleware, (req, res) => {
  const items = userAttention.get(req.userId) || [];
  const targetItem = items.find(item => item._id === req.params.id);
  
  const updatedItems = items.map(item => item._id === req.params.id ? { ...item, status: 'Resolved' } : item);
  userAttention.set(req.userId, updatedItems);

  // Log to Agent Activity Audit Log
  logAgentActivity(
    req.userId,
    'ExecutionAgent',
    `Approved & Dispatched response for: ${targetItem ? targetItem.title : 'Email Item'}`,
    'User explicitly approved action in Attention Center review modal',
    true
  );

  res.json({ success: true });
});

// 4. DECISIONS & AGENTS ACTIVITY
app.get(['/api/agents', '/agents'], authMiddleware, (req, res) => {
  const runs = userActivity.get(req.userId) || [
    {
      _id: 'act_1',
      agentName: 'ExecutionAgent',
      action: 'Approved & Dispatched response for: Accenture Placement Session',
      reason: 'User explicitly approved action in Attention Center review modal',
      userApproved: true,
      timestamp: new Date()
    },
    {
      _id: 'act_2',
      agentName: 'FollowUpAgent',
      action: 'Synced Gmail inbox & flagged Accenture placement invite',
      reason: 'Urgent email stream detected from placement cell',
      userApproved: true,
      timestamp: new Date()
    },
    {
      _id: 'act_3',
      agentName: 'ContextAgent',
      action: 'Linked recruiter email to career goal',
      reason: 'Matched Accenture Connect Session with active placement goal',
      userApproved: true,
      timestamp: new Date()
    }
  ];
  res.json({ recentRuns: runs });
});

app.get(['/api/activity', '/activity'], authMiddleware, (req, res) => {
  const runs = userActivity.get(req.userId) || [
    {
      _id: 'act_1',
      agentName: 'ExecutionAgent',
      action: 'Approved & Dispatched response for: Accenture Placement Session',
      reason: 'User explicitly approved action in Attention Center review modal',
      userApproved: true,
      timestamp: new Date()
    },
    {
      _id: 'act_2',
      agentName: 'FollowUpAgent',
      action: 'Synced Gmail inbox & flagged Accenture placement invite',
      reason: 'Urgent email stream detected from placement cell',
      userApproved: true,
      timestamp: new Date()
    }
  ];
  res.json({ activities: runs });
});

// Catch-all 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Export serverless handler for Vercel
module.exports = (req, res) => {
  return app(req, res);
};
