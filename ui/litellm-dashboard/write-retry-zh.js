const fs = require('fs');

// Read existing zh-CN.json
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Update retrySettings namespace with all keys
zh.models.retrySettings = {
  scopeLabel: '重试策略范围:',
  globalDefault: '全局默认',
  globalRetryPolicy: '全局重试策略',
  globalRetryPolicyDesc: '应用于所有模型组的默认重试设置，除非被覆盖',
  retryPolicyFor: '{name} 的重试策略',
  modelSpecificRetryDesc: '模型特定的重试设置。未设置时回退到全局默认值。',
  globalLabel: '全局',
  retryCount: '重试次数',
  reset: '重置',
  save: '保存',
  savedSuccessfully: '重试设置保存成功',
  saveFailed: '保存重试设置失败',
};

fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('zh-CN.json updated retrySettings');