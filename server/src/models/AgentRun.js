const mongoose = require('mongoose');

const AgentRunSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  agentName: {
    type: String,
    enum: [
      'ContextAgent',
      'ResearchAgent',
      'DecisionAgent',
      'PlanningAgent',
      'FollowUpAgent',
      'ExecutionAgent',
      'VerificationAgent',
      'MemoryAgent'
    ],
    required: true
  },
  action: { type: String, required: true },
  reason: { type: String, required: true },
  inputContext: { type: String, default: '' },
  recommendation: { type: String, required: true },
  userApproved: { type: Boolean, default: false },
  executionStatus: {
    type: String,
    enum: ['idle', 'running', 'waiting_permission', 'executed', 'verified', 'failed', 'paused'],
    default: 'waiting_permission'
  },
  verificationDetails: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AgentRun', AgentRunSchema);
