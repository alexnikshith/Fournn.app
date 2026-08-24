const mongoose = require('mongoose');

const situationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, enum: ['ACTIVE', 'AT_RISK', 'WAITING', 'RESOLVED'], default: 'ACTIVE' },
  category: { type: String, required: true, enum: ['Career', 'Personal', 'Financial', 'Education', 'Projects', 'Promotions'], default: 'Career' },
  attentionScore: { type: Number, default: 50 },
  attentionCategory: { type: String, enum: ['URGENT', 'IMPORTANT', 'AT_RISK', 'WAITING', 'UPCOMING', 'OPPORTUNITY', 'RESOLVED'], default: 'IMPORTANT' },
  attentionFactors: [{
    factor: { type: String },
    weight: { type: Number },
    reason: { type: String }
  }],
  currentState: { type: String },
  desiredState: { type: String },
  nextAction: { type: String },
  dependencies: [{ type: String }],
  risks: [{ type: String }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  relatedSourceItems: [{ type: String }],
  relatedEntities: [{ type: String }],
  relatedGoals: [{ type: String }],
  relatedDecisions: [{ type: String }],
  outcomeReference: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

situationSchema.index({ userId: 1, status: 1, category: 1 });

module.exports = mongoose.models.Situation || mongoose.model('Situation', situationSchema);
