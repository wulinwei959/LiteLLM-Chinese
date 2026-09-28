const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Update credentials namespace with all keys
en.models.credentials = {
  title: 'LLM Credentials',
  description: 'Configured credentials for different AI providers. Add and manage your API credentials.',
  addCredential: 'Add Credential',
  updateCredential: 'Update Credential',
  deleteCredential: 'Delete Credential',
  updatedSuccessfully: 'Credential updated successfully',
  updateFailed: 'Failed to update credential',
  createdSuccessfully: 'Credential added successfully',
  createFailed: 'Failed to add credential',
  deletedSuccessfully: 'Credential deleted successfully',
  deleteFailed: 'Failed to delete credential',
  deleteConfirmTitle: 'Delete Credential?',
  deleteConfirmMessage: 'Are you sure you want to delete this credential? This action cannot be undone and may break existing integrations.',
  resourceInformationTitle: 'Credential Information',
  credentialName: 'Credential Name',
  provider: 'Provider',
  noCredentials: 'No credentials found',
  loading: 'Loading credentials...',
};

zh.models.credentials = {
  title: 'LLM 凭据',
  description: '为不同 AI 提供商配置的凭据。添加和管理您的 API 凭据。',
  addCredential: '添加凭据',
  updateCredential: '更新凭据',
  deleteCredential: '删除凭据',
  updatedSuccessfully: '凭据更新成功',
  updateFailed: '更新凭据失败',
  createdSuccessfully: '凭据添加成功',
  createFailed: '添加凭据失败',
  deletedSuccessfully: '凭据删除成功',
  deleteFailed: '删除凭据失败',
  deleteConfirmTitle: '删除凭据？',
  deleteConfirmMessage: '确定要删除此凭据吗？此操作无法撤销，可能会破坏现有集成。',
  resourceInformationTitle: '凭据信息',
  credentialName: '凭据名称',
  provider: '提供商',
  noCredentials: '未找到凭据',
  loading: '正在加载凭据...',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('Both files updated with full credentials namespace');