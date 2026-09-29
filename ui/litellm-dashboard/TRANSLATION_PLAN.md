# LiteLLM 管理 UI 中文翻译开发计划

本计划跟踪 `ui/litellm-dashboard` 的简体中文翻译进度与后续安排。英语为默认语言，简体中文（`zh-CN`）为可选语言，通过右上角/侧边栏的语言切换器切换。

## 目标与原则

管理 UI 的所有面向用户的文案都要能翻译成简体中文，同时保持英语为默认语言，不改变现有功能、不破坏现有测试。翻译按功能域分批进行，每批都要通过构建与测试后再提交。英语文案保持原样，避免因为改英文而牵动测试断言或用户体验。

## 技术方案

翻译基于 `next-intl`。语言资源放在 `src/messages/en.json` 与 `src/messages/zh-CN.json`，两侧键树必须完全一致，由 `src/lib/i18n/messagesParity.test.ts` 强制校验。组件通过 `useTranslations("<namespace>")` 取词。语言状态与切换在 `src/contexts/LocaleContext.tsx`，切换器是 `src/components/shared/LanguageSwitcher.tsx`，入口在 `UserDropdown` 与 `SidebarAccountMenu`。

命名空间按功能域划分，当前已有：`common`、`nav`、`viewSwitcher`、`login`、`onboarding`、`breadcrumb`、`ssoEnabledNotice`、`virtualKeys`、`models`、`teams`、`users`、`organizations`、`budgets`、`guardrails`、`policies`、`adminPanel`、`usage`、`logs`、`projects`、`access-groups`、`uiTheme`、`routerSettings`、`changePassword`、`transformRequest`、`mcpServers`。

## 进度概览

翻译覆盖以“是否引入 `next-intl`”粗略统计。`src` 下共 860 个非测试 `.tsx`，其中 73 个已引入 `next-intl`。这个数字偏低，是因为早期批次多只翻译了每个页面的外层 Panel，未覆盖其子组件。下表列出各路由的未翻译文件数（仅统计该路由目录下的 `.tsx`）。

| 路由                                                                              | 未翻译/总数 | 路由                                        | 未翻译/总数 |
| --------------------------------------------------------------------------------- | ----------- | ------------------------------------------- | ----------- |
| mcp-servers                                                                       | 42/44       | cost-optimization                           | 11/11       |
| playground                                                                        | 37/37       | projects                                    | 1/11        |
| guardrails                                                                        | 34/35       | cost-tracking                               | 10/10       |
| prompts                                                                           | 27/27       | search-tools                                | 10/10       |
| policies                                                                          | 17/18       | access-groups                               | 1/8         |
| agents                                                                            | 15/15       | guardrails-monitor                          | 7/7         |
| vector-stores                                                                     | 15/15       | users                                       | 2/9         |
| caching                                                                           | 13/13       | memory                                      | 6/6         |
| models-and-endpoints                                                              | 13/21       | tag-management                              | 6/6         |
| usage                                                                             | 12/13       | budgets                                     | 5/6         |
| skills                                                                            | 5/5         | organizations                               | 4/5         |
| admin-panel                                                                       | 1/2         | api-keys、old-usage、workflows              | 各 2/2      |
| api-reference                                                                     | 3/3         | teams、logs、model-hub-table、tool-policies | 各 1/1      |
| change-password、router-settings、transform-request、ui-theme、logging-and-alerts | 各 1/2      |                                             |             |

此外 `src/components` 下仍有大量共享与页面组件未翻译，是真正的长尾，见“批次 24”。

## 已完成批次

| 批次 | 内容                               | 主要文件                                                                                                                                                                                                                                                                                                            |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | i18n 基础设施与语言切换器          | `LocaleContext.tsx`、`locales.ts`、`LanguageSwitcher.tsx`、`layout.tsx`                                                                                                                                                                                                                                             |
| 1    | 侧边栏、导航栏、面包屑、登录、入门 | `leftnav.tsx`、`DashboardHeader.tsx`、`login`、`onboarding`                                                                                                                                                                                                                                                         |
| 2    | 虚拟密钥页                         | `VirtualKeysTable.tsx`、`keyTableColumns.tsx`                                                                                                                                                                                                                                                                       |
| 3    | 模型与端点                         | `ModelsTableColumns.tsx`、`AllModelsTable.tsx`、`AddModelForm.tsx`、`AutoRouters*`                                                                                                                                                                                                                                  |
| 4    | 访问组预算与模型重试               | `AccessGroupBudgetsPanel.tsx`、`ModelRetrySettings*`                                                                                                                                                                                                                                                                |
| 5    | 价格数据、凭证、直通               | `PriceDataManagementTab.tsx`、`CredentialsPanel.tsx`、`PassThroughSettings.tsx`                                                                                                                                                                                                                                     |
| 6    | 组织与预算面板                     | `budget_panel.tsx`、`OrganizationsPanel.tsx`                                                                                                                                                                                                                                                                        |
| 7    | 护栏与策略面板                     | `GuardrailsPanel.tsx`、`policies/index.tsx`                                                                                                                                                                                                                                                                         |
| 8    | 用量与日志页                       | `UsagePageView.tsx`、`view_logs/index.tsx`                                                                                                                                                                                                                                                                          |
| 9    | 内部用户表格                       | `UsersTable.tsx`、`UsersTableColumns.tsx`、`UsersTable.test.tsx`                                                                                                                                                                                                                                                    |
| 10   | 内部用户页收尾与团队管理           | `view_users.tsx`、`BulkEditUsers.tsx`、`user_edit_view.tsx`、`DefaultUserSettingsForm.tsx`、`user_info_view.tsx`、`components/Teams.tsx`、`components/team/*`、`TeamSSOSettings.tsx`、`MSTeamsSettings.tsx`                                                                                                         |
| 11   | 组织与预算                         | `OrganizationsPanel.tsx`、`BudgetTableColumns.tsx`、`edit_budget_modal.tsx`                                                                                                                                                                                                                                         |
| 12   | 项目与访问组                       | `ProjectsPage.tsx`、`ProjectDetailsPage.tsx`、`ProjectModals/*`、`AccessGroupsPage.tsx`、`AccessGroupsTableColumns.tsx`、`AccessGroupCreateDialog.tsx`                                                                                                                                                              |
| 13   | 管理面板与系统设置                 | `AdminPanel.tsx`、`UIThemeSettings.tsx`、`general_settings.tsx`、`ChangePasswordForm.tsx`、`TransformRequestPanel.tsx`                                                                                                                                                                                              |
| 14a  | MCP 服务器列表页与卡片             | `mcp_servers.tsx`、`MCPServerCard.tsx`                                                                                                                                                                                                                                                                              |
| 14b  | MCP 服务器详情页                   | `mcp_server_view.tsx`、`mcp_connection_status.tsx`、`mcp_server_cost_config.tsx`、`mcp_server_cost_display.tsx`、`MCPServerUserCredentialsPanel.tsx`、`utils.tsx`                                                                                                                                                   |
| 14c  | MCP 创建与编辑表单                 | 29 个组件，拆成 14c-1 字段组件、14c-2 弹窗与剩余表单、14c-3 表单主体                                                                                                                                                                                                                                                |
| 14d  | MCP 工具与权限                     | `mcp_tools.tsx`、`mcp_discovery.tsx`、`MCPToolsetsTab.tsx`、`MCPToolsetTableColumns.tsx` 已完成，余 `mcp_tool_configuration.tsx`、`ToolTestPanel.tsx`、`MCPPermissionManagement.tsx`、`MCPNetworkSettings.tsx`、`mcp_connect.tsx`、`MCPGatewaySessionsTab.tsx`、`MCPSubmissionsTab.tsx`、`MCPStandardsSettings.tsx` |

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
- **14b 详情页（已完成）**：`mcp_server_view.tsx`、`mcp_connection_status.tsx`、`mcp_server_cost_config.tsx`、`mcp_server_cost_display.tsx`、`MCPServerUserCredentialsPanel.tsx`，另加共享的 `utils.tsx`（见下）。新增 103 个 key，`mcpServers` 命名空间共 161 个。
- **14c-1 表单字段组件（已完成）**：`AwsSigV4Fields`、`IdJagFormFields`、`TokenExchangeFormFields`、`OpenApiByokFields`、`UpstreamTokenHeaderField`、`DcrBridgeToggle`、`StdioConfiguration`、`TruePassthroughWarning`、`PassthroughAuthorizeSection`、`OpenAPIFormSection`、`OpenAPIQuickPicker`、`TokenEndpointAuthMethodField`、`MCPLogoSelector`、`EnvVarsSection`。新增 136 个 key，`mcpServers` 命名空间共 297 个。
- **14c-2 其余表单与弹窗（已完成）**：`UserEnvVarsModal`、`ImportMCPServers`、`ToolArgumentsForm`、`OAuthFormFields`。新增 88 个 key，`mcpServers` 命名空间共 385 个。
- **14c-3 创建与编辑表单主体（已完成）**：`CreateMCPServer.tsx`（44KB）、`mcp_server_edit.tsx`（58KB）、共享的 `types.tsx` 选项标签。新增 96 个 key，`mcpServers` 命名空间共 481 个。
- **14d 工具与权限（进行中）**：`mcp_tools.tsx`、`mcp_discovery.tsx`、`MCPToolsetsTab.tsx`、`MCPToolsetTableColumns.tsx` 已完成。余 `mcp_tool_configuration.tsx`、`ToolTestPanel.tsx`、`MCPPermissionManagement.tsx`、`MCPNetworkSettings.tsx`、`mcp_connect.tsx`、`MCPGatewaySessionsTab.tsx`、`MCPSubmissionsTab.tsx`、`MCPStandardsSettings.tsx`。`ToolArgumentsForm.tsx` 虽列在本批原始清单里，实际已在 14c-2 完成。

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

### zod 校验文案

校验提示也是用户可见文案，不能漏。schema 定义在模块顶层时拿不到 `t`，按仓库既有做法改成接收 `t` 的工厂函数（见 `Teams.tsx` 的 `createTeamFieldsSchema`、`EditMembership.tsx` 的 `buildMemberSchema`、`TeamInfo.tsx`）：

```ts
const buildXSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({ name: z.string().min(1, t("nameRequired")) });
```

类型用 `z.infer<ReturnType<typeof buildXSchema>>` / `z.output<ReturnType<...>>` 跟着变。`superRefine` 里的 `ctx.addIssue({ message })` 同样要接 `t`。

已按此处理：`adminPanel.allowedIPSchema`、`changePassword.changePasswordSchema`、`accessGroupFormSchema`、`accessGroupCreateSchema`、`projectFormSchema`。注意 `projectFormSchema.ts` 的 7 条提示在批次 12 结束时漏掉了，是全量搜索校验文案时才补上的，所以收尾时要搜的关键词是 `min(1, "`、`refine(` 后跟英文逗号、以及 `message: "` / `error: "`。

后续批次仍待处理（`vector-stores`、`guardrails/TeamGuardrailsTab`、`memory`、`tag-management`、`search-tools`、`policies`、`prompts`、`MCPToolsetsTab`、`add_pass_through`、`SCIM`、`routing_groups`、`organization/org-settings`、`models-and-endpoints/AccessGroupBudgetModal`、`skills`、`cost-optimization`、`cloudzero*`、`PluginSettings/schema`、`MetadataKeyValueFields`、`add_model`、`edit_auto_router`、`model_add`、`templates`、`update_model_credentials_modal`、`login`、`onboarding`），统一放进批次 24 的共享组件与表单校验清扫。

## 已知缺陷：被引用但 en.json 里不存在的 key

比"文案没翻译"更严重。next-intl 解析不到会抛 `MISSING_MESSAGE`，界面上直接报错而不是显示英文。

现在有守卫测试 `src/lib/i18n/missingKeys.test.ts`，与 `messagesParity.test.ts` 一起跑。parity 只比对 en 与 zh 的键树，管不到"代码引用的 key 是否存在"这个方向，所以需要单独一条。

手工扫描的做法：遍历 `src` 下所有含 `useTranslations` 的文件，收集作用域内的命名空间，再把每个 `t("...")` 在 `en.json` 里解析一遍。

三个坑，都踩过（类型增强后，后两个已被 tsc 覆盖，守卫留作快检）：

- `useTranslations("models")` 作用域内的调用写作 `t("modelTable.x")`，不带 `models.` 前缀。只匹配 `t("ns.key")` 会漏掉大部分
- 一个文件可能同时引入多个命名空间，裸 `t("x")` 只要在**任意一个**作用域里能解析就不算缺失。`VirtualKeysTable` 就是这么漏掉 `filterLabels.*` 的：key 在 `common` 里存在，但运行时走的是 `virtualKeys` 的 `t`
- `t` 通过 props 传进来的文件无法静态判定作用域，守卫会跳过。`keyTableColumns` 的 19 个缺失就是这么漏的

补 key 时英文原文要从 i18n 之前的快照取，不要凭上下文猜（测试可能断言了原文）：

```
git diff -U0 610473c HEAD -- <相对仓库根的路径>
```

`git diff` 天然给出前后行配对，比按行号对齐可靠。`git show` 的路径要加 `ui/litellm-dashboard/` 前缀，而 `git diff` 的 pathspec 是相对当前目录的，两者不一样。Windows 上用 `execFileSync` 传参数数组，cmd 不认单引号，路径里的 `(dashboard)` 会被吃掉。

2026-09-29 修掉的：`common` 60 个、`models` 32 个、`virtualKeys` 9 个，来自批次 2 与批次 3。同时发现 `AddModelForm.tsx` 写的是 `useTranslations("models.addModel")`，这个命名空间不存在，导致该文件 37 处文案全部解析失败。

类型增强后又挖出一批（英文全部从 `610473c` 逐字恢复）：`virtualKeys` 19 个（`status.blocked`、5 个状态 tooltip、`columns.key/userTooltip/createdBy/updatedAt/lastActive(+Tooltip)/expires/spendBudget/lifetimeSpend(+Tooltip)/budgetReset/models/rateLimits`）；`models.autoRouters` 8 个（空 `table` 对象下的 7 个加 `loading`）；顶层 `common` 3 个（`never/unknown/unlimited`，`models.common` 下的重复保留，别处在用）；`budgets.durationHourlyLower` 1 个（其余复用 `duration*Lower` 与 `notSet`，`budget_modal` 早就是这个约定）。另有不需加 key 的错命名空间引用：`VirtualKeysTable` 的 `filterLabels.*` 与 `keyTableColumns` 的 `t("common.*")` 改走 `commonT`；`BudgetTable` 的 duration 选项把展示文案当 key，改成 `labelKey`。

### 基线对比要逐条，不要按文件去重

`tsc --noEmit` 的输出按文件去重后对比，会**掩盖同一文件内的新增错误**。批次 14d-1 就栽在这里：`MCPToolsetsTab.tsx` 里把 `t.rich` 写成了 `t()`，构建报 `Type error: Type '(chunks: any) => Element' is not assignable to type 'string | number | Date'`，但那次 `tsc` 对比显示"56 个文件对 56 个，零差异"，于是放行了。

原因是那个文件本来就已经因为别的原因在报错列表里，新增的第二条被同一个文件名吸收了。正确的做法是保留完整错误行（含行号与错误码）再逐条对比：

```powershell
npx tsc --noEmit 2>&1 | Select-String "error TS" | ForEach-Object { $_.Line.Trim() } | Sort-Object -Unique
```

基线约 819 条，逐条 `Compare-Object` 才能看见真实差异。

另外 `npm run build` 的 TypeScript 阶段和 `npx tsc --noEmit` 的判定并不完全一致，`build` 更严。两者都要跑。

### `t(...)` 传函数是 `t.rich(...)` 的用法

`t(key, values)` 的 `values` 只接受 `string | number | Date`。要传 React 节点处理器必须用 `t.rich(key, handlers)`。写成 `t(key, { tag: (chunks) => <b>{chunks}</b> })` 编译不过。

写富文本时先看消息里有没有 `{tag}...{/tag}`，有就用 `t.rich`。

### 组件外用得到的 t，要一个能查 en.json 的替身

列定义工厂、纯函数这类拿不到 React 上下文的场景，测试里没法直接调 `useTranslations`。加一个 `tests/i18nStub.ts` 里的 `enMessages(key, values?)`，按 `mcpServers` 命名空间去 `en.json` 查值，查不到就抛错而不是返回键名。

这样测试断言的仍是真实英文文案（`+1 more` 而不是 `toolsets.moreCount`），键名写错也会立刻失败。

注意 `enMessages` 的命名空间要和生产调用点的 `useTranslations("mcpServers")` 一致，所以列工厂里的键要写相对路径（`toolsets.edit`），不能写全名。守卫 `missingKeys.test.ts` 也是按相对路径拼命名空间的，写成 `mcpServers.toolsets.edit` 会被拼成两层而报错。

工厂的参数类型不要写成 `ReturnType<typeof useTranslations>`，也不要写成 `(key: string, ...) => string` 这种宽切片。原因见下面"裸 translator 类型两边都不可靠"。每个命名空间在 `src/lib/i18n/translators.ts` 里有一个具体类型（如 `VirtualKeysTranslator`、`McpServersTranslator`），直接拿来用：

```ts
import type { McpServersTranslator } from "@/lib/i18n/translators";

interface Deps {
  t: McpServersTranslator;
}
```

测试替身按 `as unknown as McpServersTranslator` 传入（`permission_definitions.test.tsx` 与 `MCPToolsetTableColumns.test.tsx` 都是这么做的）。替身本身查 `en.json`，键名写错照样在运行时抛错，牙齿没丢。

### 裸 translator 类型两边都不可靠，必须根除

`ReturnType<typeof useTranslations>`（不带命名空间参数）在 props 与函数参数位置出现了 57 处。加上 `AppConfig.Messages` 增强后，用探针证明了它两个方向都坏：

```ts
declare const t: ReturnType<typeof useTranslations>;
t("common.save"); // 合法全路径，报错（误报）
t("loading"); // 到处都不存在，通过（漏报）
```

原因是无参数时命名空间泛型取 `never`，key 联合退化成全目录 2400+ 条的巨型联合，编译器算到一半放弃（`TS2590`），剩下的判定全凭联合的内部排布碰运气。今天 `"common.save"` 报错而 `"loading"` 通过，改一行目录就可能反过来。所以"没报错"不等于"key 正确"，之前所有"tsc 零新增"的结论里，只要涉及裸 `t` 传参的文件都不可信。

修法：`src/lib/i18n/translators.ts` 给每个命名空间一个 wrapper，导出具体类型。调用方继续写 `useTranslations("<ns>")`（结构完全一致，赋值双向通过），props 只接受具体类型。`next-intl` 把真正的 `Translator` 类型藏成了私有的 `_Translator`，不要去引。

同理，`Record<Col, string>`、`{ label: string }` 这类装着 key 的 map 也要 `as const`，否则 `t(map[key])` 的参数是 `string`，直接被拒。`as const` 后 key 是字面量联合，逐个被检查。注意 `.map()` 回调里写的对象字面量会重新 widen，得在内部再加 `as const`（`VirtualKeysTable` 的 scope 字段就栽过一次）；解构后再判定的写法会丢掉字段间的关联（`scope === "common" ? commonT(labelKey)` 里 labelKey 还是全联合），改成 `item.scope === ... ? ...(item.labelKey)` 让 narrowing 生效。

`leftnav` 的 `navT(label.replace('nav.', ''))` 这类动态 key，用一个集中断言收口：

```ts
export type NavMessageKey = Parameters<NavTranslator>[0];
const navMessageKey = (label: string): NavMessageKey => label.replace(/^nav\./, "") as NavMessageKey;
```

断言只出现一次，注释写清"菜单配置保证前缀合法"。注意原来是 `replace('nav.', '')`（替换任意位置首次出现），改成锚定开头的 `/^nav\./`，已核实 `data-i18n` 只有两处且都是前缀，无行为差异。

测试里给 `getBreadcrumb` 传 mock，原来的 `(key: string) => string` 不能赋值给重载的 `Translator`，改成 `as unknown as NavTranslator`（已有先例）。mock 自带的英文表是第二真相源，有空再换成 `enMessages`。

### `AppConfig.Messages` 类型增强

`src/lib/i18n/next-intl.d.ts`，三行：

```ts
import type { UiLocale } from "./locales";
import type enMessages from "@/messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: UiLocale;
    Messages: typeof enMessages;
  }
}
```

加上后第一次跑，多了 75 条，全是历史欠账，一批修完，基线回到 819。它抓到的真 bug：`VirtualKeysTable` 用 `virtualKeys` 的 `t` 调 `common` 才有的 `filterLabels.*`（7 处，筛选抽屉标签全坏）；`keyTableColumns` 里 19 个从没进过目录的 key、`t("common.never")` 这类跨命名空间引用；`models.autoRouters.table` 建了空对象但 7 个 key 一个没加，外加 `loading`；`BudgetTable` 把展示文案（`"hourly"`、`"Not set"`）直接塞进 `t()`。

它抓不到的：`t` 拿到的是变量而 key 合法但语义错（比如中英文占位符对不上，已由 `messagesParity.test.ts` 的契约测试覆盖，见"约定"）。

### 共享模块里的选项标签改成键名

`types.tsx` 的 `AUTH_TYPE_ITEMS` 和 `TRANSPORT_ITEMS` 带英文 `label`，被创建和编辑两个表单引用。把标签换成 `labelKey`，由组件调 `t(item.labelKey)` 渲染：

```ts
export type AuthTypeItem = { value: string; labelKey: string };
export const AUTH_TYPE_ITEMS: readonly AuthTypeItem[] = [
  { value: AUTH_TYPE.NONE, labelKey: "authType.none" },
  ...
];
```

`readonly` 是必要的：两个组件各自 `map` 出带本地化标签的新数组，共享常量不能被就地改写。

### 可选后缀不要用 select

`"Failed to update MCP Server" + (reason ? ": " + reason : "")` 这种条件拼接，不能写成 `{reason, select, none {} other {: {reason}}}`。ICU 的 `select` 按值匹配，而 `""` 也是一个值，会走 `other` 分支渲染出多余的冒号。

正确做法是把分隔符和值一起作为后缀传进去：

```
Failed to update MCP Server{suffix}
```

调用处 `t("edit.updateFailedToast", { suffix: reason ? \`: ${reason}\` : "" })`。

### 消息里的花括号也要加引号

尖括号的问题在花括号上同样存在。ICU 把 `{...}` 当参数，tooltip 里内嵌一段 JSON 示例（`{"organization": "my-org"}`）就会抛 `INVALID_MESSAGE: MALFORMED_ARGUMENT`，整条消息渲染不出来。`OAuthFormFields` 的令牌校验规则提示就踩了这个。

```
(e.g. '{'"organization": "my-org", "team.id": "123"'}')
```

加引号只保护花括号本身，里面的双引号不用动。解析后与原文逐字一致。

守卫里判断花括号是否合法，要放行四种形式：裸标识符 `{name}`、`t.rich` 的闭合标签 `{/link}`、复数/选择参数体（名字后面带逗号）、复数体内的数字占位符 `{#}`。少放行一种就会误报，批次 14c-2 为此改了三轮。

### 单复数交给 ICU，不要拆两个 key

`Imported ${n} MCP server${n === 1 ? "" : "s"}` 这种拼接，翻译时拆成 `countToast` 与 `countToastPlural` 两个 key 是错的。英文有单复数，中文没有，用三元选 key 会让中文那边永远只能选到一个分支。

正确写法是 ICU 的 `plural`：

```
Imported {count, plural, one {#} MCP server} other {#} MCP servers}
```

中文那条只留 `{count}`，next-intl 自动走 `other` 分支。

### ICU 引号规则：只有后面跟语法字符的 `'` 才开引号

`caller's` 这种所有格里的 `'` 是字面量，只有后面跟 `{ } # | < '` 其中之一的 `'` 才开启引用，`''` 是转义后的单个引号。守卫里剥引号必须实现同一套规则，不能用 `'[^']*'` 一刀切，否则两个不相干的 `'` 之间的真语法会被吞掉（`forwardBody` 的 `{code}` 就是这么被误杀的）。

反过来，`'Authorization: Bearer <token>'` 这种引号后面跟的是普通字母，按规则不是引用，里面的 `<token>` 是真标签，运行时抛 `UNCLOSED_TAG`。这是用真实 parser（`intl-messageformat`）实证过的，不是我猜的：凡是涉及引号转义的修改，落盘前必须用真实 parser 跑一遍渲染结果，而不是肉眼看原始字符串。批次 14c 的转义脚本把 `'<app-id>'` 又包了一层变成 `''<app-id>''`，肉眼看着"加了引号"，实际还是炸，就是这么来的。

新守卫刚加上时如果报了存量 key，先拿真实 parser 验证是真阳性还是误报，再决定修目录还是修守卫。

### 消息里的尖括号要加引号

ICU 把 `<...>` 当成富文本标签。RFC 举例里出现 `api://<app-id>/.default` 这种写法时，普通 `t()` 会抛 `INVALID_MESSAGE: UNCLOSED_TAG`，整条消息渲染不出来，界面上一片空白，而且只在真正打开那个表单时才发现。

按 ICU 规范用单引号把尖括号括起来就按字面量渲染，界面上看到的英文不变：

```
Microsoft Entra OBO requires a scope, e.g. api://'<app-id>'/.default
```

写转义脚本时踩了两次坑：

- 已经在引号里的尖括号不要动。`'Authorization: Bearer <token>'` 对 ICU 本来就是字面量，再加一层引号会变成 `'<token>''`，反而坏掉
- 闭合标签要一起判断。`<strong>` 在富名单里，`</strong>` 的 body 是 `/strong`，不先剥掉斜杠就会把闭合标签也加上引号，消息从"能渲染"变成"渲染出字面量标签"

`messagesParity.test.ts` 里有两条守卫盯这件事：未加引号且不属于富文本标签的尖括号，以及开了标签没闭合。两条都验证过能抓到实际的 bug。

`t.rich` 的 handler 是按标签名取的，所以 `<strong>{name}</strong>` 不需要额外的 `{strong}` 占位符，守卫不要去要求它。

### 大小写不同的两个字符串也要分开

`mcp_connection_status.tsx` 里状态行写 `Connection failed`，告警标题写 `Connection Failed`。看着是同一个词的不同大小写，其实测试各断言一次。合成一个 key 就会漏掉其中一个。批次 14b 因为这个红了一个用例。

定 key 的时候按字面量逐个对，不要按"这句话是什么意思"归并。

### 数据函数不要返回展示文案

`getMCPNetworkAccess` 原本返回 `{ label, description }`，两个都是英文句子。它同时被 `mcp_server_view.tsx`（批次 14b）和 `MCPServerCard.tsx`（批次 14a）用，所以翻译完的卡片上仍有一块英文，而且纯函数测试只能断言英文散文。

改成返回分类，文案交给组件渲染：

```ts
type MCPNetworkAccess = {
  readonly kind: "public" | "internal" | "unknown";
  readonly dotClassName: string;
  readonly reason: "direct" | "hubPublished" | "unknown";
};
```

配两个把分类映射到键名的函数（`networkAccessLabelKey`、`networkAccessDescriptionKey`），用 `switch` 穷举而不是模板拼接，这样 `missingKeys.test.ts` 还能静态扫到这些字面量。测试也从断言英文散文改成断言 `kind` 与 `reason`，断的是我们自己的分类逻辑。

写 `switch` 时要逐个组合核对原始布尔条件。改成三条独立分支那次漏掉了 `available_on_public_internet` 为 `undefined` 而 `is_public_explicit` 为 `true` 的组合，原逻辑判 public，新逻辑判 unknown。

### 英文必须与原文逐字一致

翻译时把英文一并润色，是比缺 key 更隐蔽的一类破坏。测试断言的是原文，改了就红。2026-09-29 在 `models-and-endpoints` 一次改回四处：

| 原文（`610473c`）               | 翻译时被改成                                        |
| ------------------------------- | --------------------------------------------------- |
| `Search model names…`           | `Search model names...`（省略号字符被替换成三个点） |
| `Model Access Group`            | 复用了 `accessGroups` 键，值是 `Access Groups`      |
| `Source`（`db_model` 列的标题） | `Status`                                            |
| `Config Model`（徽标）          | 复用了 `configModel` 键，值是 `Defined in config`   |

后两处的教训是同一个：一个 key 被两个语义不同的位置共用。`Status`/`Source` 只在那一列用，直接改值即可；`Config Model` 与 `Defined in config` 一个是徽标、一个是创建者，两处都要，所以另开 `modelTable.configBadge`。

### 命名空间存在不等于 key 存在

`models.emptyState` 早就有 `noModels` / `noModelsDesc`，那是别的面板的空状态。`AutoRoutersTable` 引用 `models.autoRouters.emptyState.title` 时看着像"这个命名空间有内容"，其实三个 key 一个都没有。只比对键名存在性会漏掉这种情况，要比对完整路径。

补 key 时确认作用域：`useTranslations("models.autoRouters")` 下的 `t("emptyState.title")` 落在 `models.autoRouters.emptyState.title`，不是 `models.emptyState.title`。这类文件 `missingKeys.test.ts` 是能扫到的，但只在**没有任何** `t` 来自 props 时才生效；`AutoRoutersTable` 的 `EmptyState` 自己调了 `useTranslations`，所以当时没被守卫拦下。

### 测试失败先分清是缺 provider 还是查询过时

`models-and-endpoints` 与 `VirtualKeysPage` 原有 74 个失败，看起来像一批"翻译后没同步的过时查询"，实际 62 个是同一个原因：测试文件用普通 `render`，渲染出的组件调 `useTranslations` 时找不到 `NextIntlClientProvider` 上下文，直接抛错，后面的断言全都不执行。改用 `tests/test-utils` 的 `renderWithProviders` 即可，它已经带了 Locale、QueryClient 和 Nuqs adapter。

定位办法是按报错文本归类，不要按测试名猜：

```powershell
npx vitest run "<路径>" --reporter=json --outputFile="$env:TEMP\fails.json"
node -e "const r=require(process.env.TEMP+'/fails.json'); /* 聚合 failureMessages[0] */"
```

按错误文本分组之后，少数几类才值得逐个看。剩下的 4 个（`AutoRoutersPanel` 2 个、`AccessGroupBudgetsPanel` 2 个）用 `git stash` 回到基线复跑确认是既有问题，与 i18n 无关，不要顺手"修"。

### 列定义工厂里调 hook

翻译列定义时容易把 `useTranslations` 留在工厂函数里，而工厂是被 `useMemo` 调用的。这不是风格问题，React 会报 `Do not call Hooks inside useMemo` 并让 hook 顺序在不同渲染间错位，表格直接崩。

```tsx
// 错：列定义工厂不是组件，也不是自定义 Hook
const getModelsTableColumns = (deps: ModelsTableColumnDeps) => {
  const t = useTranslations("models");
  ...
}

// 对：t 由调用方传入，并进 useMemo 的依赖数组
const columns = useMemo(() => getModelsTableColumns({ ...deps, t }), [t, ...]);
```

`ModelsTableColumns.tsx` 与 `AutoRoutersTableColumns.tsx` 各有一处这样的工厂，`eslint` 的 `react-hooks/rules-of-hooks` 能抓到，但它是 error 而不是 warning，跑的时候要真的看退出码。

## 收尾时容易搞错的两处

一是同一段 JSX 里两个不同英文被映射到同一个已存在的 key，会让测试报 "Found multiple elements"。`BudgetTable` 的空状态里 "No matching budgets" 和 "No budget matches your search or filters." 就是这种，要各自独立的 key。

二是 `budgets` 里 `reset` 是"重置预算"、`save` 是"保存"，不要混用。把提交按钮的 "Save" 写成 `t("reset")` 会同时改掉文案和让测试找不到按钮。

## 自身引入过的错误（已修，留作对照）

- 翻译列定义时把 `header: ({ column }) => <DataTableSortHeader .../>` 写成 `header: t("name")`，组件被整个丢掉，排序静默失效
- 给共享的 `DataTableSortHeader` 加 `aria-label` 想让测试通过，会改掉全仓库表头的无障碍名称
- 写 key 的脚本里 `writeFileSync` 放在循环之后，前面某个命名空间冲突抛错，导致后面所有 key 都没落盘，而代码已经引用了它们
- `UsagePageView.tsx` 里的翻译变量叫 `usageT` 不是 `t`，凭习惯写 `t(...)` 会得到 `t is not defined`
- 用 `git stash` 对比基线时忘了 `git stash pop`，会把改动留在 stash 里
- 写 key 的脚本用 `path.split(".")` 拆路径，`["modelTable", "searchPlaceholder"]` 少处理一层，把值写到了 `models.searchPlaceholder`，脚本却打印成功
- 脚本打印"写入成功"就当成功，其实 JSON 被覆盖后要重新读回来核对。这次连着两次被同一个假成功骗到
- 翻译时顺手把英文润色（`Source` 改 `Status`、省略号改三个点、`Model Access Group` 改成 `Access Groups`），比缺 key 更隐蔽，因为界面看着完全正常
- 批量改测试文件的 PowerShell 脚本里，用 `$Matches[1]` 从 `import { describe, it, expect } from "vitest"` 抓取名字，`describe, ` 被正则的 `describe, ` 前缀吃掉了，四个文件的 `describe` 导入全丢。改完必须 `rg` 确认 import 行还在，`vitest` 测试运行时不报这个错，只有 `tsc` 会报
- `git checkout HEAD -- src/messages/en.json` 是整文件回退，会把本批刚加的键一起退掉。回退后要重新落盘，别以为只是"撤销一次误操作"
- PowerShell 里 `node -e "...\"...\""` 会把双引号吃掉报 `Expression expected`。含引号的脚本一律写成 `.cjs` 文件再 `node` 执行

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
- 组件测试默认在无 `NextIntlClientProvider` 环境下运行，优先改用 `tests/test-utils.tsx` 的 `renderWithProviders`；只有需要自定义包裹层时才 mock `next-intl`
- 不新增 `eslint` 豁免。列定义工厂里的 `useTranslations` 一律通过传 `t` 规避，不要再复制 `ModelsTableColumns.tsx` 曾有的 `react-hooks/rules-of-hooks` 豁免
- 改动用示例字符串时，保持与英语原文完全一致，避免影响测试断言与用户预期
- 判断测试失败是否与本次改动有关，用 `git stash` 回到基线复跑同一文件对比，不要顺手改掉既有失败
- 改用 `renderWithProviders` 前先看组件是否用 react-query。用到的话，共享的 `testQueryClient` 带 `staleTime: Infinity`，用例内覆盖 `mockResolvedValue` 必须在 `beforeEach` 里 `testQueryClient.clear()`，否则拿到上一个用例的缓存
- 不留语义相近的重复 key。同一个词有多个英文说法时各开各的键，`accessGroups` 与 `modelAccessGroup` 并存正是这次出错的诱因
- 新增或修改中文文案时，以 `src/messages/GLOSSARY.md` 为准。通用词已有定译的不再发明，存量分歧只记录不批量回改
- 占位符只增不改：`messagesParity.test.ts` 的契约测试要求两侧顶层参数名集合一致。`t.rich` 的标签（`{strong}`、`{/link}`）、复数体内的 `{#}`、引号内的字面量不参比，`{count, plural, ...}` 只取 `count`

## 待清理与技术债

- `ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交
- 目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支
- 早期批次只翻译了页面外壳，本计划用批次 10 到 19 补齐这些页面的子组件
- `AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败是既有问题，与 i18n 无关，留给对应模块自己处理
- 全仓库 `tsc --noEmit` 有 56 个文件报错，`AddModelForm.integration.test.tsx` 就在其中，都是本次翻译之前就有的。判断有无新增要跟基线逐文件对比，不要只看总数
- `AutoRoutersPanel` 有 2 个失败属于既有问题，与 i18n 无关：面板渲染出了标题和说明，但 `DataTable` 的 `noDataMessage` 没有渲染出来，留给对应模块
- 守卫测试只覆盖"引用的 key 存在"这一个方向，没有覆盖"en.json 里的 key 有人用"。死键（`modelTable.accessGroups`）只能靠人工发现。补这一条要处理动态 key、`getTranslations`、非 React 调用等情形，误报会很多，值得单开一个任务
