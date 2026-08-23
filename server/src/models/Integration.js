const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  service: { type: String, enum: ['gmail', 'calendar', 'notion', 'slack', 'github'], required: true },
  connected: { type: Boolean, default: false },
  accountEmail: { type: String, default: '' },
  permissions: {
    readEmails: { type: Boolean, default: true },
    sendEmails: { type: Boolean, default: false },
    deleteEmails: { type: Boolean, default: false },
    readCalendar: { type: Boolean, default: true },
    createEvents: { type: Boolean, default: false },
    deleteEvents: { type: Boolean, default: false }
  },
  lastSyncedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Integration', IntegrationSchema);
