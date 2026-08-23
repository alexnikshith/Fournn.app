const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  entityId: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  category: {
    type: String,
    enum: ['Person', 'Email', 'Event', 'Task', 'Goal', 'Project', 'Company', 'Document', 'Decision', 'Commitment', 'Deadline', 'Application', 'Subscription', 'Conversation'],
    required: true
  },
  summary: { type: String, default: '' },
  properties: { type: Map, of: mongoose.Schema.Types.Mixed },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const EdgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sourceNodeId: { type: String, required: true },
  targetNodeId: { type: String, required: true },
  relationship: {
    type: String,
    enum: [
      'belongs_to',
      'related_to',
      'requires_action',
      'depends_on',
      'follows',
      'mentioned_in',
      'scheduled_for',
      'associated_with',
      'waiting_for',
      'completed_by'
    ],
    required: true
  },
  strength: { type: Number, default: 1.0 },
  createdAt: { type: Date, default: Date.now }
});

const Node = mongoose.model('FournnNode', NodeSchema);
const Edge = mongoose.model('FournnEdge', EdgeSchema);

module.exports = { Node, Edge };
