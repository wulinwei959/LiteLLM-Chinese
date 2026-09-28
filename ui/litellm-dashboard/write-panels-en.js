const fs = require('fs');

// Read existing en.json
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

// Add accessGroupBudgets namespace
en.models.accessGroupBudgets = {
  description: 'A model access group can carry one budget that every key granted the group by name draws from together. Keys that reach the group\'s models through a wildcard or all-proxy-models are not charged against it.',
  loading: 'Loading model access groups…',
  budgetSaved: 'Budget saved for "{name}"',
  budgetCleared: 'Budget cleared for "{name}"',
  clearBudgetTitle: 'Clear Budget',
  clearBudgetMessage: 'Are you sure you want to clear this access group\'s budget? The recorded shared spend is cleared with it, and the group\'s models stay available.',
  resourceInformationTitle: 'Access Group',
  resourceInformation: {
    accessGroup: 'Access Group',
    maxBudget: 'Max Budget',
  },
  emptyState: {
    title: 'No model access groups yet',
    description: 'Put a deployment in an access group from its model settings, then give the group a shared budget here.',
  },
};

// Add retrySettings namespace
en.models.retrySettings = {
  savedSuccessfully: 'Retry settings saved successfully',
  saveFailed: 'Failed to save retry settings',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
console.log('en.json updated with accessGroupBudgets and retrySettings');