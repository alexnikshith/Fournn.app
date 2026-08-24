const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['person', 'company', 'project', 'job', 'event', 'document', 'skill', 'product', 'location', 'organization'] },
  aliases: [{ type: String }],
  metadata: { type: Object, default: {} },
  relatedSituations: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

entitySchema.index({ userId: 1, name: 1, type: 1 });

module.exports = mongoose.models.Entity || mongoose.model('Entity', entitySchema);
