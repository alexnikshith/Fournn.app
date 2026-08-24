// Situation Detection & Context Resolution Engine

class SituationDetectionService {
  static detectOrUpdateSituation(normalizedItem, existingSituations = []) {
    const text = `${normalizedItem.title} ${normalizedItem.content} ${normalizedItem.sender}`.toLowerCase();

    // Check if item matches an active existing situation
    let target = existingSituations.find(s => {
      const sitTitle = s.title.toLowerCase();
      if (text.includes('accenture') && sitTitle.includes('accenture')) return true;
      if ((text.includes('freelance') || text.includes('invoice') || text.includes('payment')) && sitTitle.includes('freelance')) return true;
      if (text.includes('servicenow') && sitTitle.includes('servicenow')) return true;
      return false;
    });

    if (target) {
      return {
        isNew: false,
        situationId: target._id,
        situation: {
          ...target,
          updatedAt: new Date(),
          currentState: `Updated with stream: ${normalizedItem.title}`
        }
      };
    }

    // Spawn new Situation
    let category = 'Personal';
    if (text.includes('job') || text.includes('interview') || text.includes('career') || text.includes('role') || text.includes('deloitte') || text.includes('bv.com')) category = 'Career';
    else if (text.includes('invoice') || text.includes('bank') || text.includes('refund') || text.includes('trip')) category = 'Financial';
    else if (text.includes('workshop') || text.includes('course') || text.includes('event')) category = 'Education';

    const newSituation = {
      _id: 'sit_auto_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: normalizedItem.title,
      description: normalizedItem.summary || normalizedItem.content,
      status: 'ACTIVE',
      category,
      attentionScore: text.includes('urgent') || text.includes('interview') ? 85 : 65,
      attentionCategory: text.includes('urgent') || text.includes('interview') ? 'URGENT' : 'IMPORTANT',
      attentionFactors: [
        { factor: 'New Stream Ingestion', weight: 40, reason: `New ${normalizedItem.sourceType} stream detected from ${normalizedItem.sender}` }
      ],
      currentState: `Stream received: ${normalizedItem.title}`,
      desiredState: `Resolve situation for ${normalizedItem.title}`,
      nextAction: `Review incoming ${normalizedItem.sourceType} details`,
      dependencies: [normalizedItem.sender],
      risks: ['Unresolved inquiry'],
      progress: 25,
      relatedSourceItems: [normalizedItem.externalId],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      isNew: true,
      situationId: newSituation._id,
      situation: newSituation
    };
  }
}

module.exports = SituationDetectionService;
