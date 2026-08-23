const mongoose = require('mongoose');

const DecisionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  options: [{
    title: { type: String, required: true },
    description: { type: String },
    pros: [{ type: String }],
    cons: [{ type: String }],
    cost: { type: String },
    risk: { type: String }
  }],
  evidence: [{ type: String }],
  recommendation: { type: String, required: true },
  confidence: { type: Number, default: 0.8 },
  biggestAdvantage: { type: String, default: '' },
  biggestRisk: { type: String, default: '' },
  triggerCondition: { type: String, default: '' },
  status: { type: String, enum: ['analyzing', 'review_pending', 'decided', 'archived'], default: 'review_pending' },
  selectedOption: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Decision', DecisionSchema);
