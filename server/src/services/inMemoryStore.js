const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// In-Memory Data Storage Fallback for Serverless Environments without MongoDB Atlas
const users = new Map();
const userGraphs = new Map();
const userAttention = new Map();
const userDecisions = new Map();
const userGoals = new Map();
const userAgents = new Map();
const userMemories = new Map();
const userIntegrations = new Map();

function seedInMemoryUser(userId, name, email) {
  // Graph Nodes & Edges
  userGraphs.set(userId, {
    nodes: [
      { id: 'usr_1', label: name, category: 'Person', details: 'User Self Node' },
      { id: 'comp_google', label: 'Google AI Team', category: 'Company', details: 'Target Employer' },
      { id: 'person_sarah', label: 'Sarah Jenkins', category: 'Person', details: 'Recruiter at Google' },
      { id: 'evt_interview', label: 'Google Technical Screen', category: 'Event', details: 'Scheduled in 6 days' },
      { id: 'email_invite', label: 'Interview Prep Guidelines', category: 'Email', details: 'Received 2 days ago' },
      { id: 'refund_ecom', label: '₹2,400 Overdue Refund', category: 'Refund', details: 'E-commerce return pending 3 days' },
      { id: 'dec_laptop', label: 'Dev Laptop Upgrade', category: 'Decision', details: 'MacBook Pro M3 Max vs ThinkPad Z16' },
      { id: 'goal_career', label: 'Land Senior AI Role', category: 'Goal', details: 'Q3 Outcome Goal - 60% Progress' }
    ],
    edges: [
      { id: 'e1', source: 'person_sarah', target: 'comp_google', label: 'belongs_to' },
      { id: 'e2', source: 'comp_google', target: 'evt_interview', label: 'scheduled_for' },
      { id: 'e3', source: 'evt_interview', target: 'email_invite', label: 'mentioned_in' },
      { id: 'e4', source: 'usr_1', target: 'evt_interview', label: 'requires_action' },
      { id: 'e5', source: 'usr_1', target: 'refund_ecom', label: 'waiting_for' },
      { id: 'e6', source: 'usr_1', target: 'dec_laptop', label: 'evaluating' },
      { id: 'e7', source: 'usr_1', target: 'goal_career', label: 'pursuing' }
    ]
  });

  // Attention Items
  userAttention.set(userId, [
    {
      _id: 'att_1',
      title: '₹2,400 E-Commerce Refund Overdue',
      category: 'Financial',
      priority: 'Urgent',
      status: 'Pending Review',
      summary: 'Order return received 5 days ago, but ₹2,400 refund has not credited your bank account.',
      proposedAction: 'Dispatch follow-up support ticket inquiring about transaction reference ID.',
      draftResponse: 'Hi Support Team, order #88491 was returned 5 days ago. Please confirm status of the ₹2,400 refund.',
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

  // Decisions
  userDecisions.set(userId, [
    {
      _id: 'dec_1',
      title: 'Dev Laptop Upgrade Selection',
      category: 'Hardware',
      status: 'In Analysis',
      recommendedOption: 'MacBook Pro M3 Max (36GB RAM)',
      confidenceScore: 86,
      summary: 'Evaluating high-performance workstation upgrade for local LLM inference and full-stack development.',
      options: [
        {
          name: 'MacBook Pro M3 Max (36GB RAM)',
          pros: ['Unmatched battery life', 'CoreML model acceleration', 'Silent fanless operation'],
          cons: ['Higher price point', 'Limited upgradeability'],
          cost: 2499,
          score: 88
        },
        {
          name: 'ThinkPad Z16 Gen 2 (64GB RAM)',
          pros: ['Native Linux kernel support', 'Lower cost', 'Upgradable storage'],
          cons: ['Shorter battery life under load', 'Higher thermal output'],
          cost: 1899,
          score: 76
        }
      ],
      triggerCondition: 'Recommendation flips to ThinkPad if monthly travel requires Linux native kernel debugging.'
    }
  ]);

  // Goals
  userGoals.set(userId, [
    {
      _id: 'goal_1',
      title: 'Land Senior AI / Full-Stack Lead Role',
      category: 'Career',
      progress: 60,
      targetDate: '2026-10-15',
      milestones: [
        { title: 'Update Resume & Portfolio', completed: true },
        { title: 'Complete System Design Mock Interviews', completed: true },
        { title: 'Google Technical Screen Preparation', completed: false },
        { title: 'Negotiate Compensation & Offer', completed: false }
      ]
    }
  ]);

  // Memories
  userMemories.set(userId, [
    { _id: 'mem_1', key: 'Focus Hours', value: 'Prefers deep work focus blocks between 9 AM - 12 PM EST', category: 'Productivity' },
    { _id: 'mem_2', key: 'Target Salary', value: 'Base compensation target > $180k USD or equivalent INR tier', category: 'Career' }
  ]);

  // Integrations
  userIntegrations.set(userId, [
    { _id: 'int_1', service: 'gmail', connected: true, accountEmail: email, syncStatus: 'Active Synced', permissions: { read: true, send: true } },
    { _id: 'int_2', service: 'calendar', connected: true, accountEmail: email, syncStatus: 'Active Synced', permissions: { read: true, write: true } }
  ]);
}

function clearInMemoryUser(userId) {
  userGraphs.set(userId, { nodes: [], edges: [] });
  userAttention.set(userId, []);
  userDecisions.set(userId, []);
  userGoals.set(userId, []);
  userMemories.set(userId, []);
}

module.exports = {
  users,
  userGraphs,
  userAttention,
  userDecisions,
  userGoals,
  userAgents,
  userMemories,
  userIntegrations,
  seedInMemoryUser,
  clearInMemoryUser
};
