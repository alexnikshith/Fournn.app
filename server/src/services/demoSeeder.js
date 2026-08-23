const User = require('../models/User');
const { Node, Edge } = require('../models/FournnGraph');
const AttentionItem = require('../models/AttentionItem');
const Decision = require('../models/Decision');
const Goal = require('../models/Goal');
const AgentRun = require('../models/AgentRun');
const MemoryItem = require('../models/MemoryItem');
const Integration = require('../models/Integration');

async function seedDemoData(userId) {
  // Clear existing items for this user
  await Promise.all([
    Node.deleteMany({ userId }),
    Edge.deleteMany({ userId }),
    AttentionItem.deleteMany({ userId }),
    Decision.deleteMany({ userId }),
    Goal.deleteMany({ userId }),
    AgentRun.deleteMany({ userId }),
    MemoryItem.deleteMany({ userId }),
    Integration.deleteMany({ userId })
  ]);

  // 1. Context Graph Nodes
  const nodesData = [
    { entityId: 'user_self', label: 'User (You)', category: 'Person', summary: 'Senior Full-Stack & AI Engineer' },
    { entityId: 'comp_google', label: 'Google AI Team', category: 'Company', summary: 'Target employer for Staff role' },
    { entityId: 'evt_interview', label: 'Tech Lead Interview', category: 'Event', summary: 'Scheduled for Friday 10:00 AM' },
    { entityId: 'email_invite', label: 'Interview Prep Guidelines', category: 'Email', summary: 'Sent by recruiter Sarah Jenkins' },
    { entityId: 'refund_item', label: '₹2,400 Gadget Refund', category: 'Subscription', summary: 'Returned monitor dock 5 days ago' },
    { entityId: 'dec_laptop', label: 'Dev Laptop Upgrade', category: 'Decision', summary: 'Comparing M3 Max vs ThinkPad Z16' },
    { entityId: 'goal_career', label: 'Land Senior AI Role', category: 'Goal', summary: 'Primary career target for Q3' }
  ];

  const createdNodes = await Node.insertMany(nodesData.map(n => ({ ...n, userId })));

  // 2. Context Graph Edges
  const edgesData = [
    { sourceNodeId: 'user_self', targetNodeId: 'goal_career', relationship: 'belongs_to', strength: 1.0 },
    { sourceNodeId: 'goal_career', targetNodeId: 'comp_google', relationship: 'requires_action', strength: 0.9 },
    { sourceNodeId: 'comp_google', targetNodeId: 'evt_interview', relationship: 'scheduled_for', strength: 0.95 },
    { sourceNodeId: 'evt_interview', targetNodeId: 'email_invite', relationship: 'mentioned_in', strength: 0.85 },
    { sourceNodeId: 'user_self', targetNodeId: 'refund_item', relationship: 'waiting_for', strength: 0.8 },
    { sourceNodeId: 'user_self', targetNodeId: 'dec_laptop', relationship: 'related_to', strength: 0.75 }
  ];

  await Edge.insertMany(edgesData.map(e => ({ ...e, userId })));

  // 3. Attention Items
  const attentionData = [
    {
      title: 'Interview Preparation Progress',
      subtitle: 'Google Staff Engineer Interview in 6 days',
      category: 'urgent',
      progress: 42,
      reason: 'Interview scheduled on Friday 10:00 AM. 3 prep topics remaining: System Design, Distributed Consensus & Agentic AI.',
      recommendedAction: 'Block 2 hours on Google Calendar today for System Design mock practice.',
      evidence: ['Email from sarah.j@google.com on Aug 18', 'Calendar invite confirmed for Aug 29'],
      confidence: 0.94,
      status: 'pending_review',
      sourceRef: 'email_invite'
    },
    {
      title: '₹2,400 Refund Overdue',
      subtitle: 'Order #408-982121 refund pending from E-Store',
      category: 'urgent',
      progress: 10,
      reason: 'Returned USB-C Hub on Aug 15. E-Store email promised refund within 3 business days. 5 business days have passed.',
      recommendedAction: 'Draft and send automated follow-up ticket to Support requesting status.',
      evidence: ['Return receipt email from Aug 15', 'Bank statement shows no credit as of Aug 23'],
      draftResponse: 'Hi Support Team, I am following up on Order #408-982121 return. The refund of ₹2,400 has not reached my account. Please check the credit status.',
      confidence: 0.91,
      status: 'pending_review',
      sourceRef: 'refund_item'
    },
    {
      title: 'Job Application Follow-Up Required',
      subtitle: 'Recruiter Alex Vance requested scheduling availability',
      category: 'important',
      progress: 0,
      reason: 'Email received 2 days ago asking for availability for a technical screen next week.',
      recommendedAction: 'Send suggested calendar slots (Mon/Tue 2-4 PM).',
      evidence: ['Email from alex.vance@anthropic.com'],
      draftResponse: 'Hi Alex, Thanks for reaching out! I am available on Monday and Tuesday between 2:00 PM and 4:00 PM PST. Let me know what works best.',
      confidence: 0.88,
      status: 'pending_review',
      sourceRef: 'email_invite'
    },
    {
      title: 'Laptop Comparison Analysis Ready',
      subtitle: 'Decision Agent found an unexpected discount',
      category: 'upcoming',
      progress: 80,
      reason: 'You were comparing MacBook Pro M3 Max vs ThinkPad Z16. Fournn identified a 15% promotional offer on M3 Max with developer trade-in.',
      recommendedAction: 'Review updated decision matrix & trade-in details.',
      evidence: ['Apple Refurbished Store API feed', 'Lenovo Corporate Store pricing'],
      confidence: 0.85,
      status: 'pending_review',
      sourceRef: 'dec_laptop'
    }
  ];

  await AttentionItem.insertMany(attentionData.map(a => ({ ...a, userId })));

  // 4. Decisions
  const decisionData = [
    {
      title: 'Dev Workstation Upgrade (MacBook Pro vs ThinkPad)',
      description: 'Selecting primary hardware for LLM prototyping and local development.',
      category: 'Hardware',
      options: [
        {
          title: 'MacBook Pro 16" M3 Max (64GB RAM)',
          description: 'Unified memory architecture capable of running 34B local models fast.',
          pros: ['Extreme battery efficiency (18 hrs)', '64GB unified memory for LLM execution', 'High trade-in value'],
          cons: ['Higher upfront cost (₹3,20,000)', 'Fixed memory (non-upgradable)'],
          cost: '₹3,20,000',
          risk: 'Over-spec if local LLM inference moves to cloud API'
        },
        {
          title: 'Lenovo ThinkPad Z16 Gen 2 (64GB RAM)',
          description: 'High-performance Linux-friendly workstation.',
          pros: ['Modular upgradeability', 'Great keyboard & Linux kernel support', 'Lower cost (₹2,40,000)'],
          cons: ['Shorter battery life under AI workloads', 'Heavier power brick'],
          cost: '₹2,40,000',
          risk: 'Sub-optimal local GPU acceleration compared to Apple Silicon Metal'
        }
      ],
      evidence: ['Geekbench 6 LLM token/sec benchmarks', 'User work logs (85% macOS tooling compatibility)'],
      recommendation: 'MacBook Pro 16" M3 Max (64GB RAM)',
      confidence: 0.86,
      biggestAdvantage: 'Unified memory allows running 34B parameter models directly on GPU metal locally with zero latency.',
      biggestRisk: 'Upfront cost is ₹80,000 higher than ThinkPad.',
      triggerCondition: 'Recommendation flips to ThinkPad if monthly travel demands Linux native Kernel debugging tools.',
      status: 'review_pending'
    }
  ];

  await Decision.insertMany(decisionData.map(d => ({ ...d, userId })));

  // 5. Goals
  const goalData = [
    {
      title: 'Land Senior AI/Full-Stack Lead Role',
      category: 'Career',
      targetDate: new Date('2026-09-30'),
      progress: 60,
      milestones: [
        { title: 'Update Resume & Portfolio with Agentic AI Projects', completed: true },
        { title: 'Complete System Design Mock Interviews', completed: false, dueDate: new Date('2026-08-28') },
        { title: 'Finalize Technical Onsites with Target Companies', completed: false, dueDate: new Date('2026-09-15') }
      ],
      actionSteps: [
        { title: 'Review Fournn architecture notes for System Design interview', status: 'in_progress', agentAssigned: 'PlanningAgent' },
        { title: 'Confirm schedule for Google Staff Technical Screen', status: 'pending', agentAssigned: 'FollowUpAgent' }
      ]
    }
  ];

  await Goal.insertMany(goalData.map(g => ({ ...g, userId })));

  // 6. Agent Audit Runs
  const agentRunData = [
    {
      agentName: 'ContextAgent',
      action: 'Ingested 14 emails & 8 calendar events',
      reason: 'Daily sync cycle executed.',
      inputContext: 'Gmail Inbox & Google Calendar feed',
      recommendation: 'Identified 1 urgent interview timeline and 1 overdue refund.',
      userApproved: true,
      executionStatus: 'verified',
      verificationDetails: 'Graph nodes user_self, comp_google, refund_item linked successfully.',
      timestamp: new Date(Date.now() - 3600000 * 3)
    },
    {
      agentName: 'FollowUpAgent',
      action: 'Detected overdue refund of ₹2,400',
      reason: 'Return delivery confirmed 5 business days ago; refund status unpaid.',
      inputContext: 'E-Store order receipt email #408-982121',
      recommendation: 'Drafted follow-up email to E-Store Support.',
      userApproved: false,
      executionStatus: 'waiting_permission',
      verificationDetails: 'Awaiting user permission before dispatching email draft.',
      timestamp: new Date(Date.now() - 3600000 * 2)
    },
    {
      agentName: 'DecisionAgent',
      action: 'Evaluated Dev Workstation Hardware Upgrade',
      reason: 'User submitted choice comparison request.',
      inputContext: 'M3 Max vs ThinkPad Z16 specs and pricing data',
      recommendation: 'Recommend MacBook Pro 16" M3 Max based on 64GB local LLM memory requirements.',
      userApproved: true,
      executionStatus: 'verified',
      verificationDetails: 'Decision report generated and saved to Decision Center.',
      timestamp: new Date(Date.now() - 3600000 * 1)
    }
  ];

  await AgentRun.insertMany(agentRunData.map(ar => ({ ...ar, userId })));

  // 7. Memory Items
  const memoryData = [
    { key: 'career_target', category: 'goal', value: 'Seeking Staff / Principal AI Engineer role ($200k+ target range)', sensitivity: 'medium' },
    { key: 'hardware_preference', category: 'preference', value: 'Prefers 64GB+ RAM workstations for running local LLM benchmarks', sensitivity: 'low' },
    { key: 'refund_threshold', category: 'context', value: 'Auto-flag any overdue refund greater than ₹1,000 after 3 business days', sensitivity: 'low' },
    { key: 'working_hours', category: 'preference', value: 'Focus time window: 9:00 AM - 1:00 PM (No non-urgent interrupts)', sensitivity: 'low' }
  ];

  await MemoryItem.insertMany(memoryData.map(m => ({ ...m, userId })));

  // 8. Integrations
  const integrationsData = [
    { service: 'gmail', connected: true, accountEmail: 'user.demo@fournn.app', permissions: { readEmails: true, sendEmails: false, deleteEmails: false } },
    { service: 'calendar', connected: true, accountEmail: 'user.demo@fournn.app', permissions: { readCalendar: true, createEvents: false, deleteEvents: false } }
  ];

  await Integration.insertMany(integrationsData.map(i => ({ ...i, userId })));

  // Mark user as onboarded
  await User.findByIdAndUpdate(userId, {
    isOnboarded: true,
    onboardingData: {
      focusAreas: ['Career', 'Finance', 'Projects'],
      helpGoals: ['Remember important things', 'Track commitments', 'Manage follow-ups', 'Make decisions'],
      connectedServices: ['gmail', 'calendar']
    }
  });

  return { message: 'Demo data seeded successfully' };
}

module.exports = { seedDemoData };
