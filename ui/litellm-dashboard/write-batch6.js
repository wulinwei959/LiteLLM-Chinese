const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

// Add teams namespace
en.teams = {
  title: 'Teams',
  subtitle: 'Manage teams, their members, and their model access',
  createTeam: 'Create Team',
  searchPlaceholder: 'Search teams...',
  loading: 'Loading teams...',
  noTeams: 'No teams found',
  deletedSuccessfully: 'Team deleted successfully',
  deleteFailed: 'Failed to delete team',
  deleteConfirmTitle: 'Delete Team?',
  deleteConfirmMessage: 'Are you sure you want to delete this team? This action cannot be undone.',
  members: 'Members',
  models: 'Models',
  budget: 'Budget',
  settings: 'Settings',
  keys: 'Keys',
};

zh.teams = {
  title: '团队',
  subtitle: '管理团队、其成员及其模型访问权限',
  createTeam: '创建团队',
  searchPlaceholder: '搜索团队...',
  loading: '正在加载团队...',
  noTeams: '未找到团队',
  deletedSuccessfully: '团队删除成功',
  deleteFailed: '删除团队失败',
  deleteConfirmTitle: '删除团队？',
  deleteConfirmMessage: '确定要删除此团队吗？此操作无法撤销。',
  members: '成员',
  models: '模型',
  budget: '预算',
  settings: '设置',
  keys: '密钥',
};

// Add users namespace
en.users = {
  title: 'Internal Users',
  subtitle: 'Manage internal users and their permissions',
  createUser: 'Create User',
  inviteUser: 'Invite User',
  bulkCreate: 'Bulk Create Users',
  bulkEdit: 'Bulk Edit',
  searchPlaceholder: 'Search users...',
  loading: 'Loading users...',
  noUsers: 'No users found',
  deletedSuccessfully: 'User deleted successfully',
  deleteFailed: 'Failed to delete user',
  deleteConfirmTitle: 'Delete User?',
  deleteConfirmMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
  userID: 'User ID',
  userEmail: 'User Email',
  userRole: 'User Role',
  userAlias: 'User Alias',
  spend: 'Spend',
  createdAt: 'Created At',
  lastUsed: 'Last Used',
  status: 'Status',
  actions: 'Actions',
  defaultSettings: 'Default Settings',
  editUser: 'Edit User',
  viewUser: 'View User',
};

zh.users = {
  title: '内部用户',
  subtitle: '管理内部用户及其权限',
  createUser: '创建用户',
  inviteUser: '邀请用户',
  bulkCreate: '批量创建用户',
  bulkEdit: '批量编辑',
  searchPlaceholder: '搜索用户...',
  loading: '正在加载用户...',
  noUsers: '未找到用户',
  deletedSuccessfully: '用户删除成功',
  deleteFailed: '删除用户失败',
  deleteConfirmTitle: '删除用户？',
  deleteConfirmMessage: '确定要删除此用户吗？此操作无法撤销。',
  userID: '用户 ID',
  userEmail: '用户邮箱',
  userRole: '用户角色',
  userAlias: '用户别名',
  spend: '花费',
  createdAt: '创建时间',
  lastUsed: '最后使用',
  status: '状态',
  actions: '操作',
  defaultSettings: '默认设置',
  editUser: '编辑用户',
  viewUser: '查看用户',
};

// Add organizations namespace
en.organizations = {
  title: 'Organizations',
  subtitle: 'Manage organizations and their members',
  createOrganization: 'Create New Organization',
  enterpriseFeature: 'This is a LiteLLM Enterprise feature, and requires a valid key to use. Get a trial key {link}here{/link}.',
  clickToView: 'Click on an organization ID to view its details.',
  loading: 'Loading organizations...',
  noOrganizations: 'No organizations found',
  deletedSuccessfully: 'Organization deleted successfully',
  deleteFailed: 'Failed to delete organization',
  deleteConfirmTitle: 'Delete Organization?',
  deleteConfirmMessage: 'Are you sure you want to delete this organization? This action cannot be undone.',
  organizationID: 'Organization ID',
  organizationAlias: 'Organization Alias',
  members: 'Members',
  budget: 'Budget',
  models: 'Models',
  settings: 'Settings',
};

zh.organizations = {
  title: '组织',
  subtitle: '管理组织及其成员',
  createOrganization: '创建新组织',
  enterpriseFeature: '这是 LiteLLM 企业版功能，需要有效的密钥才能使用。获取试用密钥请点击{link}这里{/link}。',
  clickToView: '点击组织 ID 查看其详情。',
  loading: '正在加载组织...',
  noOrganizations: '未找到组织',
  deletedSuccessfully: '组织删除成功',
  deleteFailed: '删除组织失败',
  deleteConfirmTitle: '删除组织？',
  deleteConfirmMessage: '确定要删除此组织吗？此操作无法撤销。',
  organizationID: '组织 ID',
  organizationAlias: '组织别名',
  members: '成员',
  budget: '预算',
  models: '模型',
  settings: '设置',
};

// Add budgets namespace
en.budgets = {
  title: 'Budgets',
  subtitle: 'Spend, TPM and RPM limits you can assign to customers.',
  createBudget: 'Create Budget',
  tabs: {
    budgets: 'Budgets',
    examples: 'Examples',
  },
  loading: 'Loading budgets...',
  noBudgets: 'No budgets found',
  deletedSuccessfully: 'Budget deleted.',
  deleteFailed: 'Failed to delete budget',
  deleteConfirmTitle: 'Delete Budget?',
  deleteConfirmMessage: 'Are you sure you want to delete this budget? This action cannot be undone.',
  budgetID: 'Budget ID',
  maxBudget: 'Max Budget',
  tpm: 'TPM',
  rpm: 'RPM',
  tpdBatch: 'TPD (batch)',
  howToUse: 'How to use budget id',
  assignBudget: 'Assign Budget to Customer',
};

zh.budgets = {
  title: '预算',
  subtitle: '可分配给客户的花费、TPM 和 RPM 限制。',
  createBudget: '创建预算',
  tabs: {
    budgets: '预算',
    examples: '示例',
  },
  loading: '正在加载预算...',
  noBudgets: '未找到预算',
  deletedSuccessfully: '预算已删除。',
  deleteFailed: '删除预算失败',
  deleteConfirmTitle: '删除预算？',
  deleteConfirmMessage: '确定要删除此预算吗？此操作无法撤销。',
  budgetID: '预算 ID',
  maxBudget: '最大预算',
  tpm: 'TPM',
  rpm: 'RPM',
  tpdBatch: 'TPD（批量）',
  howToUse: '如何使用预算 ID',
  assignBudget: '将预算分配给客户',
};

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/messages/zh-CN.json', JSON.stringify(zh, null, 2) + '\n');
console.log('Both files updated with teams, users, organizations, budgets namespaces');