const mongoose = require('mongoose');

const situationEventSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  situationId: { type: String, required: true, index: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: [
      'EMAIL_RECEIVED', 
      'INTERVIEW_SCHEDULED', 
      'DEADLINE_CHANGED', 
      'DOCUMENT_UPDATED', 
      'USER_GOAL_CREATED', 
      'SITUATION_UPDATED', 
      'DECISION_CREATED', 
      'ACTION_APPROVED', 
      'ACTION_EXECUTED', 
      'ACTION_VERIFIED', 
      'OUTCOME_UPDATED'
    ] 
  },
  title: { type: String, required: true },
  description: { type: String },
  sourceItemId: { type: String },
  entityId: { type: String },
  goalId: { type: String },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

situationEventSchema.index({ userId: 1, situationId: 1, timestamp: -1 });

module.exports = mongoose.models.SituationEvent || mongoose.model('SituationEvent', situationEventSchema);
