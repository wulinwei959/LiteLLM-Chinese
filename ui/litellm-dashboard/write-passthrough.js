const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

en.models.passThrough = {
  title: 'Pass Through Endpoints',
  description: 'Configure and manage your pass-through endpoints',
  addEndpoint: 'Add Endpoint',
  path: 'Path',
  target: 'Target URL',
  loading: 'Loading pass-through endpoints...',
  noEndpoints: 'No pass-through endpoints configured',
  notFound: 'Endpoint not found',
  deleteConfirmTitle: 'Delete Pass-Through Endpoint',
  deleteConfirmMessage: 'Are you sure you want to delete this pass-through endpoint? This action cannot be undone.',
  deletedSuccessfully: 'Endpoint deleted successfully.',
  deleteFailed: 'Error deleting the endpoint',
};

zh.models.passThrough = {
  title: '直通端点',
  description: '配置和管理您的直通端点',
  addEndpoint: '添加端点',
  path: '路径',
  target: '目标 URL',
  loading: '正在加载直通端点...',
  noEndpoints: '未配置直通端点',
  notFound: '未找到端点',
  deleteConfirmTitle: '删除直通端点',
  deleteConfirmMessage: '确定要删除此直通端点吗？此操作无法撤销。',
  deletedSuccessfully: '端点删除成功。',
  deleteFailed: '删除端点失败',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('Both files updated with full passThrough namespace');