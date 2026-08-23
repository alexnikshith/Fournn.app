const mongoose = require('mongoose');

const MemoryItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  key: { type: String, required: true },
  category: { type: String, enum: ['preference', 'goal', 'project', 'commitment', 'relationship', 'context'], default: 'context' },
  value: { type: String, required: true },
  source: { type: String, default: 'System Agent' },
  sensitivity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  userEditable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MemoryItem', MemoryItemSchema);
