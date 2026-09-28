const fs = require('fs');

// Read existing files
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Add health namespace
en.models.health = {
  title: 'Health Status',
  description: 'Monitor the health of your model deployments',
  runCheck: 'Run Check',
  checking: 'Checking...',
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
  loading: 'Loading health status...',
  noData: 'No health check data available',
  lastCheck: 'Last Check',
  lastSuccess: 'Last Success',
  none: 'None',
  checkFailed: 'Health check failed',
  errorDetails: 'Error Details',
  successDetails: 'Success Details',
  modelName: 'Model',
  status: 'Status',
  actions: 'Actions',
  checkAll: 'Check All',
  checkingAll: 'Checking all models...',
  checkComplete: 'Health check complete',
  someUnhealthy: 'Some models are unhealthy',
  allHealthy: 'All models are healthy',
  unknown: 'Unknown',
};

zh.models.health = {
  title: '健康状态',
  description: '监控模型部署的健康状况',
  runCheck: '运行检查',
  checking: '检查中...',
  healthy: '健康',
  unhealthy: '不健康',
  loading: '正在加载健康状态...',
  noData: '暂无健康检查数据',
  lastCheck: '最后检查',
  lastSuccess: '最后成功',
  none: '无',
  checkFailed: '健康检查失败',
  errorDetails: '错误详情',
  successDetails: '成功详情',
  modelName: '模型',
  status: '状态',
  actions: '操作',
  checkAll: '全部检查',
  checkingAll: '正在检查所有模型...',
  checkComplete: '健康检查完成',
  someUnhealthy: '部分模型不健康',
  allHealthy: '所有模型健康',
  unknown: '未知',
};

// Add priceData namespace
en.models.priceData = {
  title: 'Price Data Management',
  description: 'Manage model pricing data and configure automatic reload schedules',
  reloadButton: 'Reload Price Data',
};

zh.models.priceData = {
  title: '价格数据管理',
  description: '管理模型定价数据并配置自动重载计划',
  reloadButton: '重载价格数据',
};

// Add credentials namespace
en.models.credentials = {
  title: 'LLM Credentials',
  description: 'Manage reusable provider credentials',
  addCredential: 'Add Credential',
  updateCredential: 'Update Credential',
  deleteCredential: 'Delete Credential',
  updatedSuccessfully: 'Credential updated successfully',
  createdSuccessfully: 'Credential created successfully',
  deletedSuccessfully: 'Credential deleted successfully',
  deleteFailed: 'Failed to delete credential',
  confirmDelete: 'Are you sure you want to delete this credential?',
  credentialName: 'Credential Name',
  provider: 'Provider',
  noCredentials: 'No credentials found',
  loading: 'Loading credentials...',
};

zh.models.credentials = {
  title: 'LLM 凭据',
  description: '管理可复用的提供商凭据',
  addCredential: '添加凭据',
  updateCredential: '更新凭据',
  deleteCredential: '删除凭据',
  updatedSuccessfully: '凭据更新成功',
  createdSuccessfully: '凭据创建成功',
  deletedSuccessfully: '凭据删除成功',
  deleteFailed: '删除凭据失败',
  confirmDelete: '确定要删除此凭据吗？',
  credentialName: '凭据名称',
  provider: '提供商',
  noCredentials: '未找到凭据',
  loading: '正在加载凭据...',
};

// Add passThrough namespace
en.models.passThrough = {
  title: 'Pass-Through Endpoints',
  description: 'Configure endpoints that forward requests directly to external providers',
  addEndpoint: 'Add Endpoint',
  path: 'Path',
  target: 'Target URL',
  loading: 'Loading pass-through endpoints...',
  noEndpoints: 'No pass-through endpoints configured',
  deleteConfirmTitle: 'Delete Pass-Through Endpoint',
  deleteConfirmMessage: 'Are you sure you want to delete this pass-through endpoint?',
  deletedSuccessfully: 'Pass-through endpoint deleted successfully',
  deleteFailed: 'Failed to delete pass-through endpoint',
};

zh.models.passThrough = {
  title: '直通端点',
  description: '配置直接转发请求到外部提供商的端点',
  addEndpoint: '添加端点',
  path: '路径',
  target: '目标 URL',
  loading: '正在加载直通端点...',
  noEndpoints: '未配置直通端点',
  deleteConfirmTitle: '删除直通端点',
  deleteConfirmMessage: '确定要删除此直通端点吗？',
  deletedSuccessfully: '直通端点删除成功',
  deleteFailed: '删除直通端点失败',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('Both files updated with health, priceData, credentials, passThrough namespaces');