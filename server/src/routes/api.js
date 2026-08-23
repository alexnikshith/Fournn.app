const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
const AgentEngine = require('../agents/AgentEngine');

// 1. AUTH ROUTES
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Auto seed demo data for seamless out of the box experience
    await seedDemoData(user._id);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DEMO SEED ROUTE
router.post('/demo/seed', authMiddleware, async (req, res) => {
  try {
    const result = await seedDemoData(req.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DASHBOARD METRICS & SUMMARY
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');

    const [attentionCount, urgentCount, decisionCount, goalCount, activeAgentRuns] = await Promise.all([
      AttentionItem.countDocuments({ userId, status: { $ne: 'resolved' } }),
      AttentionItem.countDocuments({ userId, category: 'urgent', status: { $ne: 'resolved' } }),
      Decision.countDocuments({ userId, status: 'review_pending' }),
      Goal.countDocuments({ userId, status: 'active' }),
      AgentRun.find({ userId }).sort({ timestamp: -1 }).limit(5)
    ]);

    const topAttentionItems = await AttentionItem.find({ userId, status: { $ne: 'resolved' } })
      .sort({ category: 1, createdAt: -1 })
      .limit(4);

    res.json({
      user,
      metrics: {
        needAttention: attentionCount,
        urgent: urgentCount,
        decisions: decisionCount,
        activeGoals: goalCount
      },
      topAttentionItems,
      recentAgentActivity: activeAgentRuns
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CONTEXT GRAPH
router.get('/graph', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const nodes = await Node.find({ userId });
    const edges = await Edge.find({ userId });
    res.json({ nodes, edges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ATTENTION ITEMS
router.get('/attention', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const items = await AttentionItem.find({ userId }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/attention/:id/action', authMiddleware, async (req, res) => {
  try {
    const { action, editedDraft } = req.body;
    const item = await AttentionItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Attention item not found' });

    if (action === 'approve') {
      item.status = 'executed';
      if (editedDraft) item.draftResponse = editedDraft;

      // Log execution via AgentEngine verification
      await AgentRun.create({
        userId: req.userId,
        agentName: 'ExecutionAgent',
        action: `Approved & Executed: ${item.title}`,
        reason: item.reason,
        inputContext: item.recommendedAction,
        recommendation: item.draftResponse || item.recommendedAction,
        userApproved: true,
        executionStatus: 'verified',
        verificationDetails: `Successfully dispatched response and updated graph item ${item.title}`
      });
    } else if (action === 'dismiss') {
      item.status = 'dismissed';
    } else if (action === 'resolve') {
      item.status = 'resolved';
    }

    item.updatedAt = new Date();
    await item.save();
    res.json({ item, message: `Action '${action}' applied successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DECISIONS
router.get('/decisions', authMiddleware, async (req, res) => {
  try {
    const decisions = await Decision.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ decisions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/decisions/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, options } = req.body;
    if (!title || !options || options.length < 2) {
      return res.status(400).json({ error: 'Decision title and at least 2 options are required' });
    }

    // AI Analysis Simulation
    const decision = new Decision({
      userId: req.userId,
      title,
      description,
      options: options.map(opt => ({
        title: opt.title,
        description: opt.description || '',
        pros: opt.pros || ['Strong alignment with current priorities'],
        cons: opt.cons || ['Requires time investment'],
        cost: opt.cost || 'N/A',
        risk: opt.risk || 'Low'
      })),
      evidence: ['Analyzed user historical preferences', 'Evaluated goal alignment'],
      recommendation: options[0].title,
      confidence: 0.84,
      biggestAdvantage: `${options[0].title} offers the best balance of output and long-term goal progression.`,
      biggestRisk: 'Initial adjustment overhead during adoption phase.',
      triggerCondition: 'Recommendation updates if timeline constraints change by > 2 weeks.',
      status: 'review_pending'
    });

    await decision.save();

    await AgentRun.create({
      userId: req.userId,
      agentName: 'DecisionAgent',
      action: `Analyzed new decision: ${title}`,
      reason: 'User submitted new decision inquiry',
      recommendation: `Recommended ${options[0].title} with 84% confidence`,
      userApproved: false,
      executionStatus: 'waiting_permission',
      verificationDetails: 'Awaiting user choice confirmation.'
    });

    res.json({ decision });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/decisions/:id/select', authMiddleware, async (req, res) => {
  try {
    const { selectedOption } = req.body;
    const decision = await Decision.findOne({ _id: req.params.id, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    decision.status = 'decided';
    decision.selectedOption = selectedOption;
    await decision.save();

    res.json({ decision });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. GOALS
router.get('/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ goals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/goals/create', authMiddleware, async (req, res) => {
  try {
    const { title, category, targetDate } = req.body;
    if (!title) return res.status(400).json({ error: 'Goal title is required' });

    const goal = new Goal({
      userId: req.userId,
      title,
      category: category || 'General',
      targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 30 * 86400000),
      progress: 15,
      milestones: [
        { title: 'Define scope and key deliverables', completed: true },
        { title: 'Execute primary milestone tasks', completed: false },
        { title: 'Review & measure target outcome', completed: false }
      ],
      actionSteps: [
        { title: `Initial setup for ${title}`, status: 'in_progress', agentAssigned: 'PlanningAgent' }
      ]
    });

    await goal.save();
    res.json({ goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. AGENT CONTROLS & AUDIT LOGS
router.get('/agents', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('emergencyPaused');
    const runs = await AgentRun.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(20);
    const integrations = await Integration.find({ userId: req.userId });

    const agentsList = [
      { name: 'ContextAgent', role: 'Ingests digital data & constructs context graph', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'ResearchAgent', role: 'Gathers context, evidence & verifies facts', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'DecisionAgent', role: 'Analyzes options, tradeoffs & uncertainty', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'PlanningAgent', role: 'Breaks goals into milestone action plans', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'FollowUpAgent', role: 'Monitors unanswered comms & overdue items', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'ExecutionAgent', role: 'Performs user-approved actions safely', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'VerificationAgent', role: 'Verifies outcomes & updates system memory', status: user.emergencyPaused ? 'Paused' : 'Active' },
      { name: 'MemoryAgent', role: 'Manages long-term structured personal memory', status: user.emergencyPaused ? 'Paused' : 'Active' }
    ];

    res.json({
      emergencyPaused: user.emergencyPaused,
      agents: agentsList,
      recentRuns: runs,
      integrations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/agents/toggle-emergency', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.emergencyPaused = !user.emergencyPaused;
    await user.save();

    await AgentRun.create({
      userId: req.userId,
      agentName: 'ExecutionAgent',
      action: user.emergencyPaused ? 'EMERGENCY PAUSE ALL AGENTS' : 'RESUME AGENT OPERATIONS',
      reason: 'User toggled Emergency Switch from settings header.',
      recommendation: user.emergencyPaused ? 'All autonomous background jobs suspended.' : 'Normal agent ops resumed.',
      userApproved: true,
      executionStatus: user.emergencyPaused ? 'paused' : 'verified',
      verificationDetails: `System state updated: emergencyPaused = ${user.emergencyPaused}`
    });

    res.json({ emergencyPaused: user.emergencyPaused, message: `Agents are now ${user.emergencyPaused ? 'Paused' : 'Active'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. MEMORY CONTROLS
router.get('/memory', authMiddleware, async (req, res) => {
  try {
    const memories = await MemoryItem.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ memories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/memory/create', authMiddleware, async (req, res) => {
  try {
    const { key, category, value, sensitivity } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'Key and Value are required' });

    const memory = new MemoryItem({
      userId: req.userId,
      key,
      category: category || 'context',
      value,
      sensitivity: sensitivity || 'low',
      source: 'User Defined'
    });
    await memory.save();
    res.json({ memory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/memory/:id', authMiddleware, async (req, res) => {
  try {
    await MemoryItem.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Memory item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/memory/clear-all', authMiddleware, async (req, res) => {
  try {
    await MemoryItem.deleteMany({ userId: req.userId });
    res.json({ message: 'All personal memory items purged successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. INTEGRATIONS
router.get('/integrations', authMiddleware, async (req, res) => {
  try {
    let integrations = await Integration.find({ userId: req.userId });
    if (integrations.length === 0) {
      // Create defaults
      integrations = await Integration.insertMany([
        { userId: req.userId, service: 'gmail', connected: true, accountEmail: 'user@fournn.app' },
        { userId: req.userId, service: 'calendar', connected: true, accountEmail: 'user@fournn.app' }
      ]);
    }
    res.json({ integrations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/integrations/permission', authMiddleware, async (req, res) => {
  try {
    const { service, permissionKey, value } = req.body;
    const integration = await Integration.findOne({ service, userId: req.userId });
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    integration.permissions[permissionKey] = value;
    await integration.save();

    res.json({ integration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
