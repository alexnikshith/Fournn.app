const mongoose = require('mongoose');

const AttentionItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  category: {
    type: String,
    enum: ['urgent', 'important', 'waiting', 'upcoming', 'resolved'],
    default: 'important'
  },
  progress: { type: Number, default: 0 },
  reason: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  evidence: [{ type: String }],
  draftResponse: { type: String, default: '' },
  confidence: { type: Number, default: 0.85 },
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'dismissed', 'executed', 'resolved'],
    default: 'pending_review'
  },
  sourceRef: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttentionItem', AttentionItemSchema);
