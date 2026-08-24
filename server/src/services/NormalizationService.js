// Provider-Neutral Normalization Layer

class NormalizationService {
  static normalizeEmail(rawEmail, provider = 'gmail') {
    return {
      provider,
      externalId: rawEmail.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sourceType: 'email',
      title: rawEmail.subject || rawEmail.title || 'Untitled Email Stream',
      sender: rawEmail.sender || rawEmail.from || 'Unknown Sender',
      content: rawEmail.body || rawEmail.content || rawEmail.summary || '',
      summary: rawEmail.summary || rawEmail.body?.slice(0, 200) || '',
      timestamp: rawEmail.timestamp ? new Date(rawEmail.timestamp) : new Date(),
      metadata: rawEmail.metadata || {},
      normalizedStatus: 'normalized'
    };
  }

  static normalizeCalendarEvent(rawEvent, provider = 'google_calendar') {
    return {
      provider,
      externalId: rawEvent.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sourceType: 'calendar_event',
      title: rawEvent.summary || rawEvent.title || 'Scheduled Calendar Event',
      sender: rawEvent.organizer || 'Calendar Stream',
      content: rawEvent.description || '',
      summary: `Event scheduled for ${rawEvent.startTime || 'specified time'}`,
      timestamp: rawEvent.startTime ? new Date(rawEvent.startTime) : new Date(),
      metadata: { location: rawEvent.location, attendees: rawEvent.attendees || [] },
      normalizedStatus: 'normalized'
    };
  }
}

module.exports = NormalizationService;
