const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  currentState: { type: String, required: true },
  desiredState: { type: String, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['IN_PROGRESS', 'ACHIEVED', 'AT_RISK', 'BLOCKED'], default: 'IN_PROGRESS' },
  targetDate: { type: Date },
  probability: { type: Number, default: 75, min: 0, max: 100 },
  impact: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
  relatedSituationId: { type: String },
  relatedGoalId: { type: String },
  verificationState: { type: String, default: 'PENDING_VERIFICATION' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

outcomeSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.models.Outcome || mongoose.model('Outcome', outcomeSchema);
