// Entity Extraction & Entity Resolution Engine

class EntityExtractionService {
  static extractEntities(text = '', sender = '') {
    const combined = `${text} ${sender}`.toLowerCase();
    const entities = [];

    // Company Detection
    if (combined.includes('accenture')) entities.push({ name: 'Accenture', type: 'company' });
    if (combined.includes('deloitte')) entities.push({ name: 'Deloitte', type: 'company' });
    if (combined.includes('atidiv')) entities.push({ name: 'Atidiv', type: 'company' });
    if (combined.includes('optimspace')) entities.push({ name: 'Optimspace', type: 'company' });
    if (combined.includes('naukri')) entities.push({ name: 'Naukri', type: 'company' });
    if (combined.includes('salesforce')) entities.push({ name: 'Salesforce', type: 'company' });
    if (combined.includes('freelancer')) entities.push({ name: 'Freelancer', type: 'company' });
    if (combined.includes('makemytrip')) entities.push({ name: 'MakeMyTrip', type: 'company' });

    // Job / Role Detection
    if (combined.includes('engineer') || combined.includes('developer')) entities.push({ name: 'Software Developer', type: 'job' });
    if (combined.includes('intern')) entities.push({ name: 'Front-End Intern', type: 'job' });
    if (combined.includes('manager')) entities.push({ name: 'Product Manager', type: 'job' });

    // Person Detection
    if (combined.includes('nivin')) entities.push({ name: 'Nivin', type: 'person' });
    if (combined.includes('samantha')) entities.push({ name: 'Samantha Jo West', type: 'person' });
    if (combined.includes('alex nick') || combined.includes('alexnick')) entities.push({ name: 'Alex Nick', type: 'person' });

    // Skill Detection
    if (combined.includes('react') || combined.includes('node') || combined.includes('aws') || combined.includes('servicenow')) {
      entities.push({ name: 'Enterprise Tech Skills', type: 'skill' });
    }

    return entities;
  }
}

module.exports = EntityExtractionService;
