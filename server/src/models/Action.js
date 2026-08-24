const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['SEND_EMAIL', 'CREATE_EVENT', 'UPDATE_STATUS', 'ACKNOWLEDGE_MESSAGE', 'PREPARE_PLAN'] },
  description: { type: String, required: true },
  situationId: { type: String, required: true, index: true },
  outcomeId: { type: String },
  proposedBy: { type: String, default: 'PlanningAgent' },
  trustLevel: { type: Number, default: 3, min: 0, max: 4 }, // Level 0: Observe, 1: Recommend, 2: Draft, 3: Execute w/ Approval, 4: Autonomous
  status: { type: String, enum: ['PROPOSED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXECUTING', 'COMPLETED', 'FAILED'], default: 'PENDING_APPROVAL' },
  requiresApproval: { type: Boolean, default: true },
  approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  executionStatus: { type: String, enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUCCESS', 'FAILED'], default: 'NOT_STARTED' },
  executionResult: { type: Object, default: {} },
  verificationStatus: { type: String, enum: ['UNVERIFIED', 'VERIFIED', 'VERIFICATION_FAILED'], default: 'UNVERIFIED' },
  verificationResult: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  executedAt: { type: Date },
  verifiedAt: { type: Date }
});

actionSchema.index({ userId: 1, situationId: 1, status: 1 });

module.exports = mongoose.models.Action || mongoose.model('Action', actionSchema);
