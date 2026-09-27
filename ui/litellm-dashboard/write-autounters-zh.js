const fs = require('fs');

// Read existing zh-CN.json
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Add autoRouters namespace
zh.models.autoRouters = {
  title: '自动路由器',
  description: '自动路由器位于您的部署之上，并为每个请求选择一个模型。它们像其他模型一样被调用，因此客户端可以继续使用单一模型名称。',
  addRouter: '添加自动路由器',
  routerName: '路由器名称',
  strategy: '路由策略',
  models: '模型',
  createdAt: '创建时间',
  updatedAt: '更新时间',
  actions: '操作',
  deleteConfirm: '确定要删除此自动路由器吗？',
  deleted: '已删除自动路由器: {name}',
  deleteError: '删除自动路由器失败: {error}',
  table: {
    name: '名称',
    type: '类型',
    routesTo: '路由至',
    defaultModel: '默认模型',
    createdAt: '创建时间',
    actions: '操作',
    delete: '删除自动路由器',
    deleteAria: '打开 {name} 的操作菜单',
  },
  emptyState: {
    title: '暂无自动路由器',
    descriptionCanModify: '创建自动路由器以根据请求选择合适的模型，而不是固定使用某个模型。',
    descriptionNoModify: '自动路由器会根据请求选择合适的模型，而不是固定使用某个模型。',
  },
};

zh.models.addAutoRouter = {
  title: '添加自动路由器',
  description: '选择一个分类器为每个请求路由到模型。像其他模型一样调用，因此客户端继续使用单一模型名称。',
  routerName: '路由器名称',
  routerNamePlaceholder: '输入路由器名称',
  strategy: '路由策略',
  models: '模型',
  modelsPlaceholder: '选择模型...',
  create: '创建',
  cancel: '取消',
  success: '自动路由器创建成功',
  error: '创建自动路由器失败',
};

zh.models.autoRoutersPanel = {
  title: '自动路由器',
  description: '自动路由器位于您的部署之上，并为每个请求选择一个模型。它们像其他模型一样被调用，因此客户端可以继续使用单一模型名称。',
  addRouter: '添加自动路由器',
  deleteConfirmTitle: '删除自动路由器',
  deleteConfirmMessage: '确定要删除 "{name}" 吗？仍在调用此模型名称的客户端将开始失败。',
  resourceInformationTitle: '自动路由器',
  resourceInformation: {
    name: '名称',
    type: '类型',
    id: 'ID',
  },
};

fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('zh-CN.json updated with autoRouters namespace');