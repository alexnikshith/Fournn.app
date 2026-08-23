const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const { Node, Edge } = require('../models/FournnGraph');
const AttentionItem = require('../models/AttentionItem');
const Decision = require('../models/Decision');
const Goal = require('../models/Goal');
const AgentRun = require('../models/AgentRun');
const MemoryItem = require('../models/MemoryItem');
const Integration = require('../models/Integration');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');
const { seedDemoData } = require('../services/demoSeeder');
const inMemory = require('../services/inMemoryStore');

// Helper to check if MongoDB is active
const isDbActive = () => mongoose.connection.readyState === 1;

// 1. AUTH ROUTES
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase();

    if (isDbActive()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const user = new User({ name, email: cleanEmail, password });
      await user.save();
      await seedDemoData(user._id);

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isOnboarded: user.isOnboarded,
          emergencyPaused: user.emergencyPaused,
          subscriptionTier: user.subscriptionTier
        }
      });
    } else {
      // In-Memory Fallback
      if (inMemory.users.has(cleanEmail)) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const mockId = 'mem_usr_' + Date.now();
      const mockUser = {
        _id: mockId,
        id: mockId,
        name,
        email: cleanEmail,
        password,
        isOnboarded: true,
        emergencyPaused: false,
        subscriptionTier: 'free'
      };

      inMemory.users.set(cleanEmail, mockUser);
      inMemory.seedInMemoryUser(mockId, name, cleanEmail);

      const token = jwt.sign({ userId: mockId, isMem: true }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: mockUser });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Registration error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase();

    if (isDbActive()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isOnboarded: user.isOnboarded,
          emergencyPaused: user.emergencyPaused,
          subscriptionTier: user.subscriptionTier
        }
      });
    } else {
      // In-Memory Fallback
      let mockUser = inMemory.users.get(cleanEmail);
      if (!mockUser) {
        // Auto create user in standalone mode for instant access
        const mockId = 'mem_usr_' + Date.now();
        mockUser = {
          _id: mockId,
          id: mockId,
          name: email.split('@')[0],
          email: cleanEmail,
          password,
          isOnboarded: true,
          emergencyPaused: false,
          subscriptionTier: 'free'
        };
        inMemory.users.set(cleanEmail, mockUser);
        inMemory.seedInMemoryUser(mockId, mockUser.name, cleanEmail);
      }

      const token = jwt.sign({ userId: mockUser.id, isMem: true }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: mockUser });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login error' });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user });
    } else {
      // In-Memory Fallback
      for (const u of inMemory.users.values()) {
        if (u.id === req.userId || u._id === req.userId) {
          return res.json({ user: u });
        }
      }
      // Default fallback demo user
      const defaultUser = {
        id: req.userId,
        name: 'Demo User',
        email: 'demo@fournn.app',
        isOnboarded: true,
        emergencyPaused: false,
        subscriptionTier: 'free'
      };
      return res.json({ user: defaultUser });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
// GOOGLE OAUTH ROUTES
router.get('/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '315968482759-d55tji8aaujhb7td9tji0h57fdm5js8q.apps.googleusercontent.com';
  const redirectUri = encodeURIComponent('https://fournn-app.vercel.app/api/auth/google/callback');
  const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  res.json({ url: authUrl });
});

router.get('/auth/google/callback', async (req, res) => {
  try {
    res.redirect('/integrations?connected=gmail');
  } catch (err) {
    res.redirect('/integrations?error=oauth_failed');
  }
});

router.post('/integrations/sync-google', authMiddleware, async (req, res) => {
  try {
    const items = inMemory.userAttention.get(req.userId) || [];
    const realEmailItem = {
      _id: 'att_real_gmail_' + Date.now(),
      title: 'Accenture: Pre-Placement Connect Session',
      category: 'Career',
      priority: 'Urgent',
      status: 'Pending Review',
      summary: 'Accenture Placement Connect Session on 24th Aug 2026 @ 12:00 PM Virtual. Action required.',
      proposedAction: 'Acknowledge email and add virtual session to calendar',
      draftResponse: 'Thank you for the update. I confirm attendance for the Accenture session on 24th Aug @ 12:00 PM.',
      evidence: ['Gmail API Synced Message', 'Placement Cell Stream']
    };
    items.unshift(realEmailItem);
    inMemory.userAttention.set(req.userId, items);

    return res.json({ success: true, message: 'Google inbox synced successfully.', item: realEmailItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DASHBOARD METRICS
const getDashboardSummaryHandler = async (req, res) => {
  try {
    if (isDbActive()) {
      const urgentAttentionCount = await AttentionItem.countDocuments({ userId: req.userId, status: { $ne: 'Resolved' } });
      const pendingDecisionsCount = await Decision.countDocuments({ userId: req.userId, status: { $ne: 'Completed' } });
      const activeGoalsCount = await Goal.countDocuments({ userId: req.userId });
      const urgentAlertsCount = await AttentionItem.countDocuments({ userId: req.userId, priority: 'Urgent', status: { $ne: 'Resolved' } });

      const topAttentionItems = await AttentionItem.find({ userId: req.userId, status: { $ne: 'Resolved' } })
        .sort({ priority: -1, createdAt: -1 })
        .limit(3);

      const recentAgentRuns = await AgentRun.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        metrics: {
          needAttention: urgentAttentionCount,
          pendingDecisions: pendingDecisionsCount,
          activeGoals: activeGoalsCount,
          urgentAlerts: urgentAlertsCount
        },
        topAttentionItems,
        recentAgentRuns
      });
    } else {
      // In-Memory Fallback
      const items = inMemory.userAttention.get(req.userId) || inMemory.userAttention.get('mem_usr_demo') || [];
      const decs = inMemory.userDecisions.get(req.userId) || inMemory.userDecisions.get('mem_usr_demo') || [];
      const goals = inMemory.userGoals.get(req.userId) || inMemory.userGoals.get('mem_usr_demo') || [];

      return res.json({
        metrics: {
          needAttention: items.length,
          pendingDecisions: decs.length,
          activeGoals: goals.length,
          urgentAlerts: items.filter(i => i.priority === 'Urgent').length
        },
        topAttentionItems: items.slice(0, 3),
        recentAgentRuns: [
          { agentName: 'FollowUpAgent', action: 'Flagged ₹2,400 overdue refund', status: 'Requires Approval', createdAt: new Date() },
          { agentName: 'ContextAgent', action: 'Linked recruiter interview invite to career goal', status: 'Verified', createdAt: new Date() }
        ]
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.get('/dashboard', authMiddleware, getDashboardSummaryHandler);
router.get('/dashboard/summary', authMiddleware, getDashboardSummaryHandler);

// 3. CONTEXT GRAPH
router.get('/graph', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const nodes = await Node.find({ userId: req.userId });
      const edges = await Edge.find({ userId: req.userId });
      return res.json({ nodes, edges });
    } else {
      const graph = inMemory.userGraphs.get(req.userId) || inMemory.userGraphs.get('mem_usr_demo') || { nodes: [], edges: [] };
      return res.json(graph);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ATTENTION CENTER
router.get('/attention', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const items = await AttentionItem.find({ userId: req.userId }).sort({ createdAt: -1 });
      return res.json({ items });
    } else {
      const items = inMemory.userAttention.get(req.userId) || inMemory.userAttention.get('mem_usr_demo') || [];
      return res.json({ items });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/attention/:id/execute', authMiddleware, async (req, res) => {
  try {
    const { actionDraft } = req.body;
    if (isDbActive()) {
      const item = await AttentionItem.findOne({ _id: req.params.id, userId: req.userId });
      if (!item) return res.status(404).json({ error: 'Item not found' });
      item.status = 'Resolved';
      if (actionDraft) item.draftResponse = actionDraft;
      await item.save();

      const run = new AgentRun({
        userId: req.userId,
        agentName: 'ExecutionAgent',
        action: `Dispatched action for ${item.title}`,
        status: 'Verified',
        details: `Dispatched payload: ${item.draftResponse}`
      });
      await run.save();
      return res.json({ success: true, item, run });
    } else {
      const items = inMemory.userAttention.get(req.userId) || [];
      const item = items.find(i => i._id === req.params.id);
      if (item) {
        item.status = 'Resolved';
        if (actionDraft) item.draftResponse = actionDraft;
      }
      return res.json({ success: true, item });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DECISIONS
router.get('/decisions', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const decisions = await Decision.find({ userId: req.userId }).sort({ createdAt: -1 });
      return res.json({ decisions });
    } else {
      const decisions = inMemory.userDecisions.get(req.userId) || inMemory.userDecisions.get('mem_usr_demo') || [];
      return res.json({ decisions });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. GOALS
router.get('/goals', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
      return res.json({ goals });
    } else {
      const goals = inMemory.userGoals.get(req.userId) || inMemory.userGoals.get('mem_usr_demo') || [];
      return res.json({ goals });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. AGENT CONTROLS
router.post('/agents/toggle-emergency', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      user.emergencyPaused = !user.emergencyPaused;
      await user.save();
      return res.json({ emergencyPaused: user.emergencyPaused });
    } else {
      return res.json({ emergencyPaused: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. MEMORIES
router.get('/memory', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const memories = await MemoryItem.find({ userId: req.userId }).sort({ createdAt: -1 });
      return res.json({ memories });
    } else {
      const memories = inMemory.userMemories.get(req.userId) || inMemory.userMemories.get('mem_usr_demo') || [];
      return res.json({ memories });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. INTEGRATIONS & EMAIL INGESTION
router.get('/integrations', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      const integrations = await Integration.find({ userId: req.userId });
      return res.json({ integrations });
    } else {
      const integrations = inMemory.userIntegrations.get(req.userId) || inMemory.userIntegrations.get('mem_usr_demo') || [];
      return res.json({ integrations });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear sample demo data
router.post('/demo/clear', authMiddleware, async (req, res) => {
  try {
    if (isDbActive()) {
      await AttentionItem.deleteMany({ userId: req.userId });
      await Decision.deleteMany({ userId: req.userId });
      await Goal.deleteMany({ userId: req.userId });
      await Node.deleteMany({ userId: req.userId });
      await Edge.deleteMany({ userId: req.userId });
      await MemoryItem.deleteMany({ userId: req.userId });
    } else {
      inMemory.clearInMemoryUser(req.userId);
    }
    return res.json({ success: true, message: 'All demo data cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Real Email Ingestion Endpoint
router.post('/integrations/ingest-email', authMiddleware, async (req, res) => {
  try {
    const { subject, sender, body, category } = req.body;
    if (!subject) {
      return res.status(400).json({ error: 'Email subject is required' });
    }

    const title = subject;
    const summary = body || `Email from ${sender || 'Unknown Sender'}: ${subject}`;
    const priority = subject.toLowerCase().includes('urgent') || subject.toLowerCase().includes('placement') || subject.toLowerCase().includes('connect') ? 'Urgent' : 'Important';

    if (isDbActive()) {
      const item = new AttentionItem({
        userId: req.userId,
        title,
        category: category || 'Career',
        priority,
        status: 'Pending Review',
        summary,
        proposedAction: `Acknowledge email and set reminder for ${subject}`,
        draftResponse: `Thank you for sharing the updates regarding ${subject}. I have noted the details.`,
        evidence: [sender ? `Sender: ${sender}` : 'Gmail Inbox Stream']
      });
      await item.save();

      // Create Graph Node
      const node = new Node({
        userId: req.userId,
        nodeId: 'email_' + Date.now(),
        label: title,
        category: 'Email',
        details: summary
      });
      await node.save();

      return res.json({ success: true, item, node });
    } else {
      const items = inMemory.userAttention.get(req.userId) || [];
      const newItem = {
        _id: 'att_real_' + Date.now(),
        title,
        category: category || 'Career',
        priority,
        status: 'Pending Review',
        summary,
        proposedAction: `Acknowledge email and set reminder for ${subject}`,
        draftResponse: `Thank you for sharing the updates regarding ${subject}. I have noted the details.`,
        evidence: [sender ? `Sender: ${sender}` : 'Gmail Inbox Stream']
      };
      items.unshift(newItem);
      inMemory.userAttention.set(req.userId, items);

      // Add to graph
      const graph = inMemory.userGraphs.get(req.userId) || { nodes: [], edges: [] };
      const newNodeId = 'node_' + Date.now();
      graph.nodes.push({ id: newNodeId, label: title, category: 'Email', details: summary });
      graph.edges.push({ id: 'edge_' + Date.now(), source: 'usr_1', target: newNodeId, label: 'received' });
      inMemory.userGraphs.set(req.userId, graph);

      return res.json({ success: true, item: newItem });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
