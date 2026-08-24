const mongoose = require('mongoose');

const sourceItemSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  provider: { type: String, required: true, enum: ['gmail', 'google_calendar', 'github', 'notion', 'linkedin', 'synthetic'] },
  externalId: { type: String },
  sourceType: { type: String, required: true, enum: ['email', 'calendar_event', 'document', 'issue', 'message'] },
  title: { type: String, required: true },
  sender: { type: String },
  content: { type: String },
  summary: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} },
  normalizedStatus: { type: String, default: 'unprocessed' },
  relatedEntities: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sourceItemSchema.index({ userId: 1, provider: 1, externalId: 1 });

module.exports = mongoose.models.SourceItem || mongoose.model('SourceItem', sourceItemSchema);
