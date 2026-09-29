# LiteLLM 管理 UI 中文翻译开发计划

本计划跟踪 `ui/litellm-dashboard` 的简体中文翻译进度与后续安排。英语为默认语言，简体中文（`zh-CN`）为可选语言，通过右上角/侧边栏的语言切换器切换。

## 目标与原则

管理 UI 的所有面向用户的文案都要能翻译成简体中文，同时保持英语为默认语言，不改变现有功能、不破坏现有测试。翻译按功能域分批进行，每批都要通过构建与测试后再提交。英语文案保持原样，避免因为改英文而牵动测试断言或用户体验。

## 技术方案

翻译基于 `next-intl`。语言资源放在 `src/messages/en.json` 与 `src/messages/zh-CN.json`，两侧键树必须完全一致，由 `src/lib/i18n/messagesParity.test.ts` 强制校验。组件通过 `useTranslations("<namespace>")` 取词。语言状态与切换在 `src/contexts/LocaleContext.tsx`，切换器是 `src/components/shared/LanguageSwitcher.tsx`，入口在 `UserDropdown` 与 `SidebarAccountMenu`。

命名空间按功能域划分，当前已有：`common`、`nav`、`viewSwitcher`、`login`、`onboarding`、`breadcrumb`、`ssoEnabledNotice`、`virtualKeys`、`models`、`teams`、`users`、`organizations`、`budgets`、`guardrails`、`policies`、`adminPanel`、`usage`、`logs`、`projects`、`access-groups`、`uiTheme`、`routerSettings`、`changePassword`、`transformRequest`、`mcpServers`。

## 进度概览

翻译覆盖以“是否引入 `next-intl`”粗略统计。`src` 下共 860 个非测试 `.tsx`，其中 73 个已引入 `next-intl`。这个数字偏低，是因为早期批次多只翻译了每个页面的外层 Panel，未覆盖其子组件。下表列出各路由的未翻译文件数（仅统计该路由目录下的 `.tsx`）。

| 路由 | 未翻译/总数 | 路由 | 未翻译/总数 |
| --- | --- | --- | --- |
| mcp-servers | 42/44 | cost-optimization | 11/11 |
| playground | 37/37 | projects | 1/11 |
| guardrails | 34/35 | cost-tracking | 10/10 |
| prompts | 27/27 | search-tools | 10/10 |
| policies | 17/18 | access-groups | 1/8 |
| agents | 15/15 | guardrails-monitor | 7/7 |
| vector-stores | 15/15 | users | 2/9 |
| caching | 13/13 | memory | 6/6 |
| models-and-endpoints | 13/21 | tag-management | 6/6 |
| usage | 12/13 | budgets | 5/6 |
| skills | 5/5 | organizations | 4/5 |
| admin-panel | 1/2 | api-keys、old-usage、workflows | 各 2/2 |
| api-reference | 3/3 | teams、logs、model-hub-table、tool-policies | 各 1/1 |
| change-password、router-settings、transform-request、ui-theme、logging-and-alerts | 各 1/2 | | |

此外 `src/components` 下仍有大量共享与页面组件未翻译，是真正的长尾，见“批次 24”。

## 已完成批次

| 批次 | 内容 | 主要文件 |
| --- | --- | --- |
| 0 | i18n 基础设施与语言切换器 | `LocaleContext.tsx`、`locales.ts`、`LanguageSwitcher.tsx`、`layout.tsx` |
| 1 | 侧边栏、导航栏、面包屑、登录、入门 | `leftnav.tsx`、`DashboardHeader.tsx`、`login`、`onboarding` |
| 2 | 虚拟密钥页 | `VirtualKeysTable.tsx`、`keyTableColumns.tsx` |
| 3 | 模型与端点 | `ModelsTableColumns.tsx`、`AllModelsTable.tsx`、`AddModelForm.tsx`、`AutoRouters*` |
| 4 | 访问组预算与模型重试 | `AccessGroupBudgetsPanel.tsx`、`ModelRetrySettings*` |
| 5 | 价格数据、凭证、直通 | `PriceDataManagementTab.tsx`、`CredentialsPanel.tsx`、`PassThroughSettings.tsx` |
| 6 | 组织与预算面板 | `budget_panel.tsx`、`OrganizationsPanel.tsx` |
| 7 | 护栏与策略面板 | `GuardrailsPanel.tsx`、`policies/index.tsx` |
| 8 | 用量与日志页 | `UsagePageView.tsx`、`view_logs/index.tsx` |
| 9 | 内部用户表格 | `UsersTable.tsx`、`UsersTableColumns.tsx`、`UsersTable.test.tsx` |
| 10 | 内部用户页收尾与团队管理 | `view_users.tsx`、`BulkEditUsers.tsx`、`user_edit_view.tsx`、`DefaultUserSettingsForm.tsx`、`user_info_view.tsx`、`components/Teams.tsx`、`components/team/*`、`TeamSSOSettings.tsx`、`MSTeamsSettings.tsx` |
| 11 | 组织与预算 | `OrganizationsPanel.tsx`、`BudgetTableColumns.tsx`、`edit_budget_modal.tsx` |
| 12 | 项目与访问组 | `ProjectsPage.tsx`、`ProjectDetailsPage.tsx`、`ProjectModals/*`、`AccessGroupsPage.tsx`、`AccessGroupsTableColumns.tsx`、`AccessGroupCreateDialog.tsx` |
| 13 | 管理面板与系统设置 | `AdminPanel.tsx`、`UIThemeSettings.tsx`、`general_settings.tsx`、`ChangePasswordForm.tsx`、`TransformRequestPanel.tsx` |
| 14a | MCP 服务器列表页与卡片 | `mcp_servers.tsx`、`MCPServerCard.tsx` |

批次 3 到 8 存在“只翻译外壳、未翻译子组件”的欠账，因此下面把对应页面族重新列出收尾。

## 待办批次

批次按用户影响排序，核心管理功能优先。括号内是该批次的未翻译文件数。

### 批次 11：组织与预算（P0，已完成）
`organizations`：`OrganizationsPanel.tsx`、`OrganizationsTableColumns.tsx`、`OrganizationFilters.tsx`、`page.tsx`、`OrganizationsTable.tsx`、`OrganizationInfoView.tsx`、`OrgCreateDialog.tsx`。
`budgets`：`budget_panel.tsx`、`BudgetTableColumns.tsx`、`BudgetTable.tsx`、`edit_budget_modal.tsx`、`budget_modal.tsx`、`page.tsx`。

### 批次 12：项目与访问组（P0，已完成）
`projects`（11）：`ProjectsPage.tsx`、`ProjectDetailsPage.tsx`、`ProjectKeys*`、`ProjectModals/*`、`ProjectsTable*`
`access-groups`（8）：`AccessGroupsPage.tsx`、`AccessGroupsDetailsPage.tsx`、`AccessGroupsTable*`、`AccessGroupCreateDialog.tsx`、`AccessGroupEditModal.tsx`、`AccessGroupBaseForm.tsx`

`AccessGroupCreateDialog.test.tsx` 原本用普通 `render` 加自建 `QueryClientProvider`，缺少 `NextIntlClientProvider` 导致 `useTranslations` 抛错，改为 `renderWithProviders`。

### 批次 13：管理面板与系统设置（P0，已完成）
`admin-panel/_components/AdminPanel.tsx`：九个标签页、允许 IP 弹窗、SSO 废弃提示、界面访问控制。扩展 `adminPanel`。
`ui-theme/UIThemeSettings.tsx`：新增 `uiTheme`。
`router-settings/_components/general_settings.tsx`：标签页、通用设置表格、提示词缓存面板。新增 `routerSettings`。
`change-password/ChangePasswordForm.tsx`：新增 `changePassword`。
`transform-request/TransformRequestPanel.tsx`：新增 `transformRequest`。

`logging-and-alerts/page.tsx` 只是转发到共享的 `components/settings`，留到批次 24。

`AdminPanel.test.tsx`、`UIThemeSettings.test.tsx`、`TransformRequestPanel.test.tsx`、`ChangePasswordForm.integration.test.tsx` 原本都用普通 `render`，改为 `renderWithProviders`。注意 `tests/test-utils` 的相对层级：文件在 `src/app/(dashboard)/<route>/` 下用 4 级 `../`，在 `.../<route>/_components/` 下用 5 级。

### 批次 14：MCP 服务器（44，分四个子批次）

规模最大的一批，约 11000 行，按用户可见的主线拆开做。

- **14a 列表页与卡片（已完成）**：`mcp_servers.tsx`（页头、标签页、筛选、搜索、排序、删除弹窗、空状态）、`MCPServerCard.tsx`（卡片菜单、健康度标签、OAuth 提示、按用户凭据与 BYOK 行）。新增 `mcpServers` 命名空间。
- **14b 详情页**：`mcp_server_view.tsx`、`mcp_connection_status.tsx`、`mcp_server_cost_config.tsx`、`mcp_server_cost_display.tsx`、`MCPServerUserCredentialsPanel.tsx`。
- **14c 创建与编辑表单**：`CreateMCPServer.tsx`、`mcp_server_edit.tsx`、`mcpFormStore`、各 `*FormFields`（OAuth、IdJag、AwsSigV4、TokenExchange、EnvVars 等）、`OpenAPI*`、`StdioConfiguration`、`MCPLogoSelector`、`ImportMCPServers`。
- **14d 工具与权限**：`mcp_tools.tsx`、`mcp_tool_configuration.tsx`、`MCPToolsetsTab.tsx`、`MCPToolsetTableColumns.tsx`、`ToolArgumentsForm.tsx`、`ToolTestPanel.tsx`、`MCPPermissionManagement.tsx`、`MCPGatewaySessionsTab.tsx`、`MCPSubmissionsTab.tsx`、`MCPNetworkSettings.tsx`、`mcp_connect.tsx`、`mcp_discovery.tsx`。

`mcp_servers.tsx` 里 `SORT_OPTIONS` 原本是带 `label` 的字面量数组，翻译时改为 `SORT_KEYS`（只存 key）加 `SORT_LABEL_KEYS`（key 到 i18n key 的映射），下拉项和 `items` prop 都从 `SORT_KEYS` 派生。

### 批次 15：Playground（37）
`playground/components/chat_ui/*`、`compareUI/*`、`complianceUI/*`。注意 `llm_calls/*.tsx` 是调用封装，不是界面文案，按情况跳过。新增 `playground` 命名空间。

### 批次 16：护栏与护栏监控（41）
`guardrails`（34）：表单、内容过滤、PII、LLM Judge、工具权限、测试面板。
`guardrails-monitor`（7）：`GuardrailsMonitorView.tsx`、`GuardrailDetail.tsx`、`GuardrailsOverview.tsx`、`EvaluationSettingsModal.tsx` 等。扩展 `guardrails`，新增 `guardrailsMonitor`。

### 批次 17：策略（18）
`policies`（17）：`PolicyTable*`、`add_policy_form.tsx`、`add_attachment_form.tsx`、`pipeline_flow_builder.tsx`、`policy_templates.tsx` 等。`tool-policies`（1）。扩展 `policies`。

### 批次 18：提示词（27）
`prompts/_components/*`，含编辑器、版本历史、发布、工具、代码片段。新增 `prompts` 命名空间。

### 批次 19：模型与端点收尾（13）
`components/AllModelsTab.tsx`、`AccessGroupBudgetColumns.tsx`、`AccessGroupBudgetModal.tsx`、`AutoRouters/AutoRoutersPanel.tsx`、`panels/*`。扩展 `models`。

### 批次 20：用量、成本（33）
`usage`（12）、`cost-tracking`（10）、`cost-optimization`（11）。扩展 `usage`，新增 `costTracking`、`costOptimization`。

### 批次 21：向量库、搜索工具、记忆、技能（36）
`vector-stores`（15）、`search-tools`（10）、`memory`（6）、`skills`（5）。新增对应命名空间。

### 批次 22：缓存、标签、代理（34）
`caching`（13）、`tag-management`（6）、`agents`（15）。新增 `caching`、`tags`、`agents`。

### 批次 23：收尾页面（约 12）
`api-keys`（2）、`workflows`（2）、`model-hub-table`（1）、`api-reference`（3）、`old-usage`（2）、`chat` 与 `connect` 等非 dashboard 页面。

### 批次 24：共享组件清扫（长尾）
`src/components` 下的共享组件（约 460 个 `.tsx`）。其中的通用 UI 原语（`ui/*`）通常不含业务文案，重点放在 `VirtualKeysPage` 之外的业务组件、`common_components`、`shared`、各功能面板。这一批会让已翻译页面里仍为英文的弹窗、提示、按钮补齐。建议在页面批次完成后统一扫一遍，遇到共享组件时随手翻译，避免同一组件被反复改动。

## 单批执行流程

1. 先通读该页面的组件树，列出所有面向用户的字符串，再设计最小键集。
2. 在 `en.json` 与 `zh-CN.json` 同时加键，保持键树一致，避免同名键既是字符串又是对象（例如 `status` 与 `status.active` 冲突）。加完立即跑 `messagesParity.test.ts`。
3. 改组件：英语原文不变，只把字面量换成 `t("...")`。`useTranslations` 只能放在 React 组件或自定义 Hook 里；对非组件的列工厂函数，把 `t` 作为参数传入，不要在工厂里直接调用 Hook。
   - 只替换**传给组件的字符串**，绝不替换组件本身。列定义里 `header: ({ column }) => <DataTableSortHeader column={column} title="Name" />` 应改成 `title={t("name")}`；写成 `header: t("name")` 会把 `DataTableSortHeader` 整个丢掉，表头不再可点击排序，且测试只在断言排序时才暴露。
4. 对改动或新增的测试，优先改用 `tests/test-utils.tsx` 的 `renderWithProviders`，它已经包好 `LocaleProvider`。只有当测试需要自定义包裹层且不便改造时，才参照 `VirtualKeysTable.test.tsx` mock `next-intl`。纯 `render` 的测试在组件引入 `useTranslations` 后会抛 “context from `NextIntlClientProvider` was not found”。
5. 验证：`npx vitest run <改动测试> src/lib/i18n/messagesParity.test.ts`、对改动文件跑 `npx eslint`、`npx tsc --noEmit` 确认无新错误、`npm run build` 通过。
6. 删除任何临时脚本（`write-*.js`、`check-*.js` 等），不要留在仓库里。
7. 提交并推送。提交信息用 conventional commits 类型前缀加中文正文，例如 `feat(ui): 翻译 MCP 服务器页面为简体中文`。提交标题、提交正文与 PR 说明一律用简体中文书写，类型前缀（`feat`、`fix`、`chore`、`docs`）保留英文。

## 验证清单

- `messagesParity.test.ts` 通过，`en` 与 `zh-CN` 键树一致
- 该批次相关的组件测试通过，且测试里 mock 了 `next-intl`
- 改动文件 `eslint` 无新增错误
- `tsc --noEmit` 无新增类型错误
- `npm run build` 成功产出静态路由
- 仓库内无临时脚本残留

## 约定

- 提交标题、提交正文与 PR 说明一律用简体中文书写，类型前缀（`feat`、`fix`、`chore`、`docs`）保留英文
- 英语为默认并进行原文断言，中文键值随批补齐
- 不翻译非面向用户的文件（hooks、utils、types、纯逻辑封装）
- 组件测试默认在无 `NextIntlClientProvider` 环境下运行，必须 mock `next-intl`，否则 `useTranslations` 会报错
- 不新增 `eslint` 豁免。已提交的 `ModelsTableColumns.tsx` 存在 `react-hooks/rules-of-hooks` 豁免，新代码通过传 `t` 规避，不要再复制这种豁免
- 改动用示例字符串时，保持与英语原文完全一致，避免影响测试断言与用户预期

## 待清理与技术债

- `ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交
- 目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支
- 早期批次只翻译了页面外壳，本计划用批次 10 到 19 补齐这些页面的子组件
