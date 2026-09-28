const fs = require('fs');

// Read existing en.json
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

// Update retrySettings namespace with all keys
en.models.retrySettings = {
  scopeLabel: 'Retry Policy Scope:',
  globalDefault: 'Global Default',
  globalRetryPolicy: 'Global Retry Policy',
  globalRetryPolicyDesc: 'Default retry settings applied to all model groups unless overridden',
  retryPolicyFor: 'Retry Policy for {name}',
  modelSpecificRetryDesc: 'Model-specific retry settings. Falls back to global defaults if not set.',
  globalLabel: 'Global',
  retryCount: 'retry count',
  reset: 'Reset',
  save: 'Save',
  savedSuccessfully: 'Retry settings saved successfully',
  saveFailed: 'Failed to save retry settings',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
console.log('en.json updated retrySettings');