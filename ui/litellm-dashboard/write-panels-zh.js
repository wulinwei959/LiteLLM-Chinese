const fs = require('fs');

// Read existing zh-CN.json
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Add accessGroupBudgets namespace
zh.models.accessGroupBudgets = {
  description: '模型访问组可以携带一个预算，所有通过名称获得该组权限的密钥都共同从中消耗。通过通配符或所有代理模型访问该组模型的密钥不会计入其中。',
  loading: '正在加载模型访问组…',
  budgetSaved: '已为 "{name}" 保存预算',
  budgetCleared: '已清除 "{name}" 的预算',
  clearBudgetTitle: '清除预算',
  clearBudgetMessage: '确定要清除此访问组的预算吗？已记录的共享花费将随之清除，但该组的模型仍然可用。',
  resourceInformationTitle: '访问组',
  resourceInformation: {
    accessGroup: '访问组',
    maxBudget: '最大预算',
  },
  emptyState: {
    title: '暂无模型访问组',
    description: '先在模型设置中将部署放入访问组，然后在此为该组设置共享预算。',
  },
};

// Add retrySettings namespace
zh.models.retrySettings = {
  savedSuccessfully: '重试设置保存成功',
  saveFailed: '保存重试设置失败',
};

fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('zh-CN.json updated with accessGroupBudgets and retrySettings');