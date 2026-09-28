const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Add usage namespace
en.usage = {
  title: 'Usage',
  tabs: {
    cost: 'Cost',
    models: 'Model Activity',
    keys: 'Key Activity',
    mcp: 'MCP Server Activity',
    endpoints: 'Endpoint Activity',
  },
  metrics: 'Usage Metrics',
  totalRequests: 'Total Requests',
  totalTokens: 'Total Tokens',
  dailySpend: 'Daily Spend',
  spend: 'Spend',
  topModels: 'Top Models',
  topKeys: 'Top Keys',
  viewAll: 'View All',
  exportData: 'Export Usage Data',
  dateRange: 'Date Range',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  custom: 'Custom',
  noData: 'No usage data available',
  loading: 'Loading usage data...',
};

zh.usage = {
  title: '用量',
  tabs: {
    cost: '成本',
    models: '模型活动',
    keys: '密钥活动',
    mcp: 'MCP 服务器活动',
    endpoints: '端点活动',
  },
  metrics: '用量指标',
  totalRequests: '总请求数',
  totalTokens: '总令牌数',
  dailySpend: '每日花费',
  spend: '花费',
  topModels: '热门模型',
  topKeys: '热门密钥',
  viewAll: '查看全部',
  exportData: '导出用量数据',
  dateRange: '日期范围',
  last7Days: '最近 7 天',
  last30Days: '最近 30 天',
  custom: '自定义',
  noData: '暂无用量数据',
  loading: '正在加载用量数据...',
};

// Add logs namespace
en.logs = {
  title: 'Logs',
  tabs: {
    requestLogs: 'Request Logs',
    auditLogs: 'Audit Logs',
    deletedKeys: 'Deleted Keys',
    deletedTeams: 'Deleted Teams',
  },
  loading: 'Loading',
  noLogs: 'No logs found',
  requestDetails: 'Request Details',
  responseDetails: 'Response Details',
  requestTime: 'Request Time',
  model: 'Model',
  tokens: 'Tokens',
  cost: 'Cost',
  status: 'Status',
  searchPlaceholder: 'Search logs...',
  filterByStatus: 'Filter by Status',
  filterByModel: 'Filter by Model',
  allStatuses: 'All Statuses',
  success: 'Success',
  failure: 'Failure',
  details: 'Details',
  close: 'Close',
};

zh.logs = {
  title: '日志',
  tabs: {
    requestLogs: '请求日志',
    auditLogs: '审计日志',
    deletedKeys: '已删除密钥',
    deletedTeams: '已删除团队',
  },
  loading: '加载中',
  noLogs: '未找到日志',
  requestDetails: '请求详情',
  responseDetails: '响应详情',
  requestTime: '请求时间',
  model: '模型',
  tokens: '令牌',
  cost: '成本',
  status: '状态',
  searchPlaceholder: '搜索日志...',
  filterByStatus: '按状态筛选',
  filterByModel: '按模型筛选',
  allStatuses: '所有状态',
  success: '成功',
  failure: '失败',
  details: '详情',
  close: '关闭',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('Both files updated with usage and logs namespaces');