# 开发计划

`PLAN.md` 讲要做什么、按什么顺序做。技术方案本身见 [ARCHITECTURE.md](./ARCHITECTURE.md)，当前做到哪一步见 [PROGRESS.md](./PROGRESS.md)

## 目标与原则

目标是让管理 UI 所有面向用户的文案都能显示为简体中文，同时英语保持默认语言，不改变任何现有功能

五条贯穿全程的原则

英语原文逐字不动。翻译时顺手润色英文是比漏翻更隐蔽的破坏，测试断言的就是原文，改一个省略号（`…` 换成 `...`）或者把 `Source` 写成 `Status` 都会红。要改英文就单独提，不要混在翻译里

中文键值随后补齐，英语先到。这样任何一批做完，界面在英语下都是完整的，不会出现半截翻译

只翻译面向用户的字符串。hooks、utils、types、纯逻辑封装、`llm_calls` 这类调用封装不碰

不新增 lint 豁免。遇到 `react-hooks/rules-of-hooks` 这类报错，用传参把 `t` 递下去解决，不要加豁免注释

不破坏既有测试。判断某个失败是不是自己引入的，用 `git stash` 回基线复跑对比，不要顺手把既有失败一起"修"了

## 分域的理由

批次按功能域切，不按文件切。同一个命名空间的键要一起设计才能避免语义重复，比如 `budgets` 里同时存在 `reset`（重置预算）与 `save`（保存），如果两批分别加键就很容易混用

每个批次的目标是"这个页面在中文下没有英文残留"，而不是"这个批次改了多少文件"。所以批次边界按页面走，一个页面族的子组件哪怕分散在多个目录也放在同一批

## 批次划分

批次 0 到 14 已经完成，15 之后是收尾。每一批的"内容"列列出该批实际动过的主要文件，方便回溯

### 已完成

| 批次 | 内容                               | 主要文件                                                                                                                                                                 |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0    | i18n 基础设施与语言切换器          | `LocaleContext.tsx`、`locales.ts`、`LanguageSwitcher.tsx`、`app/layout.tsx`                                                                                              |
| 1    | 侧边栏、导航栏、面包屑、登录、入门 | `leftnav.tsx`、`DashboardHeader.tsx`、`login`、`onboarding`                                                                                                              |
| 2    | 虚拟密钥页                         | `VirtualKeysTable.tsx`、`keyTableColumns.tsx`                                                                                                                            |
| 3    | 模型与端点                         | `ModelsTableColumns.tsx`、`AllModelsTable.tsx`、`AddModelForm.tsx`、`AutoRouters*`                                                                                       |
| 4    | 访问组预算与模型重试               | `AccessGroupBudgetsPanel.tsx`、`ModelRetrySettings*`                                                                                                                     |
| 5    | 价格数据、凭证、直通               | `PriceDataManagementTab.tsx`、`CredentialsPanel.tsx`、`PassThroughSettings.tsx`                                                                                          |
| 6    | 组织与预算面板                     | `budget_panel.tsx`、`OrganizationsPanel.tsx`                                                                                                                             |
| 7    | 护栏与策略面板                     | `GuardrailsPanel.tsx`、`policies/index.tsx`                                                                                                                              |
| 8    | 用量与日志页                       | `UsagePageView.tsx`、`view_logs/index.tsx`                                                                                                                               |
| 9    | 内部用户表格                       | `UsersTable.tsx`、`UsersTableColumns.tsx`                                                                                                                                |
| 10   | 内部用户页收尾与团队管理           | `view_users.tsx`、`BulkEditUsers.tsx`、`user_edit_view.tsx`、`DefaultUserSettingsForm.tsx`、`Teams.tsx`、`team/*`、`TeamSSOSettings.tsx`、`MSTeamsSettings.tsx`           |
| 11   | 组织与预算收尾                     | `OrganizationsPanel.tsx`、`BudgetTableColumns.tsx`、`edit_budget_modal.tsx`                                                                                              |
| 12   | 项目与访问组                       | `ProjectsPage.tsx`、`ProjectDetailsPage.tsx`、`ProjectModals/*`、`AccessGroupsPage.tsx`、`AccessGroupsTableColumns.tsx`、`AccessGroupCreateDialog.tsx`                   |
| 13   | 管理面板与系统设置                 | `AdminPanel.tsx`、`UIThemeSettings.tsx`、`general_settings.tsx`、`ChangePasswordForm.tsx`、`TransformRequestPanel.tsx`                                                   |
| 14   | MCP 服务器（分 14a 到 14d）        | 见下                                                                                                                                                                     |

批次 14 是最大的一批，约 11000 行，拆成四个子批次推进

| 子批次 | 内容                   | 产出                                                                                                              |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 14a    | 列表页与卡片           | `mcp_servers.tsx`、`MCPServerCard.tsx`，新建 `mcpServers` 命名空间                                                |
| 14b    | 详情页                 | `mcp_server_view.tsx`、`mcp_connection_status.tsx`、`mcp_server_cost_config.tsx`、`MCPServerUserCredentialsPanel.tsx`，命名空间到 161 键 |
| 14c-1  | 表单字段组件           | 14 个字段组件（`AwsSigV4Fields`、`IdJagFormFields`、`OpenAPIFormSection` 等），命名空间到 297 键                   |
| 14c-2  | 其余表单与弹窗         | `UserEnvVarsModal`、`ImportMCPServers`、`ToolArgumentsForm`、`OAuthFormFields`，命名空间到 385 键                  |
| 14c-3  | 创建与编辑表单主体     | `CreateMCPServer.tsx`（44KB）、`mcp_server_edit.tsx`（58KB），命名空间到 481 键                                   |
| 14d    | 工具、权限与网络       | `mcp_tools.tsx`、`mcp_discovery.tsx`、`MCPToolsetsTab.tsx`、`MCPNetworkSettings.tsx`、`ToolTestPanel.tsx` 等        |

批次 3 到 8 当时只翻译了页面的外层 Panel，没覆盖子组件。这个欠账由批次 10 到 19 的收尾批次补上，也是为什么批次编号在 14 之后又出现了 11、12、13

### 收尾批次

| 批次 | 范围                                    | 状态                                       |
| ---- | --------------------------------------- | ------------------------------------------ |
| 15   | Playground                              | 部分完成，`chat_ui` 与 `compareUI` 仍有余量 |
| 16   | 护栏与护栏监控                          | 基本完成，余 `content_filter` 等表单        |
| 17   | 策略                                    | 基本完成，余 `pipeline_flow_builder` 等     |
| 18   | 提示词                                  | 基本完成，余编辑器与版本历史                |
| 19   | 模型与端点收尾                          | 基本完成                                    |
| 20   | 用量、成本追踪、成本优化                | 基本完成                                    |
| 21   | 向量库、搜索工具、记忆、技能            | 基本完成                                    |
| 22   | 缓存、标签、代理                        | 缓存与代理仍有余量                          |
| 23   | 收尾页面（api-keys、workflows 等）      | 基本完成                                    |
| 24   | 共享组件清扫（长尾，约 460 个 `.tsx`）  | 进行中。已完成 `components/add_model` 与 `components/edit_auto_router` 两个目录，`components/view_logs` 从第 13 簇起按文件推进（已收 `RequestLogsFilters.tsx`（含第 16 簇的错误码下拉表）、`LogsTableToolbar.tsx` 与 `logs_utils.tsx`、`TypeBadges.tsx` 与 `RequestLogsTable.tsx` 与 `LogDetailContent.tsx` 的类型徽标和凭据行、`RequestLogsTableColumns.tsx` 的列头与单元格（第 17 簇）、`LogDetailsDrawer/` 的抽屉外壳与 10 个头部/叶子组件（第 18 簇）、`LogDetailsDrawer/` 卡片层的输入卡、输出卡、工具调用块与分类器留档视图（第 19 簇）、`LogDetailsDrawer/` 的 `RoutingDecisionCard.tsx` 自动路由决策卡（第 20 簇）、`LogDetailsDrawer/` 的 `RealtimePrettyView.tsx` 实时会话视图（第 21 簇，抽屉展示文案清零）、`ToolsSection/` 的工具清单区（第 22 簇）、审计日志面板与表与列定义及 `AuditLogDrawer/`（第 23 簇）、`TraceView/` 的 run 详情侧 11 个文件（第 24 簇，`logs.trace.*` 108 键）、`TraceView/` 的列表侧 6 个文件含 `StatusMark.tsx`（第 25 簇，`logs.traceList.*` 29 键与 `timeRange.last6Hours`/`.last30Days`）、`TraceView/` 的 `AgentTracesSection.tsx` 与 `RunDrawer.tsx`（第 26 簇，`logs.traceList.*` 9 键与 `logs.drawer.*` 5 键）、`TraceView/` 的 `TracingSetupCard.tsx`（第 27 簇，`logs.traceSetup.*` 51 键，`TraceView` 展示文案清零）、`view_logs` 根目录的 4 个查看器 `ConfigInfoMessage.tsx` 与 `CostBreakdownViewer.tsx` 与 `EvalViewer/EvalViewer.tsx` 与 `VectorStoreViewer.tsx`（第 28 簇，`logs.configInfo.*` 3 键、`logs.costBreakdown.*` 17 键、`logs.eval.*` 17 键、`logs.vectorStore.*` 11 键）、`view_logs/GuardrailViewer/` 的 `PresidioDetectedEntities.tsx` 与 `ContentFilterDetails.tsx` 与 `CompliancePanel.tsx` 与 `BedrockGuardrailDetails.tsx`（第 29 簇，`logs.guardrail.*` 71 键，同组留给下一簇的 `GuardrailViewer.tsx`）与同目录的 `GuardrailViewer.tsx`（第 30 簇，`logs.guardrail.*` 再补 39 键，该目录文案清零）与 `view_logs` 根目录的收尾 4 文件 `log_filter_logic.tsx` 与 `RequestLogsTable.tsx` 与 `RequestLogsPanel.tsx` 与 `index.tsx`（第 31 簇，新增 `logs.table.*` 8 键与 `logs.backToLogs`、`logs.filters.search`，15 个筛选标签改为键名表，根目录文案清零）与 `LogDetailsDrawer/LogDetailContent.tsx` 的指标区、批处理结果、请求与响应、元数据与护栏跳转徽标（第 32 簇，`logs.detail.*` 47 键与 `logs.guardrail.notRunSuffix`，`view_logs` 整目录文案清零）与 `components/chat/` 的网关连接流 `ConnectFlowBanner.tsx` 与 `MCPConnectPicker.tsx`（第 33 簇，新开顶层 `chat` 命名空间 14 键，`ConnectFlowSurface.tsx` 无自有文案）与 `components/chat/MCPAppsPanel.tsx` 的服务器网格、详情视图与连接动作（第 34 簇，`chat.appsPanel.*` 29 键）与 `components/chat/ChatMessages.tsx` 的消息气泡、编辑态、复制与工具调用卡（第 35 簇，`chat.messages.*` 11 键，`chat.appsPanel.back` 收进 `common.back`）与 `components/chat/KeysPanel.tsx` 的密钥表、轮换弹窗与相对时间（第 36 簇，`chat.keysPanel.*` 34 键，5 个键复用 `common`）与 `components/chat/LogsPanel.tsx` 的日志表、详情弹窗与分页计数（第 37 簇，`chat.logsPanel.*` 19 键，3 个键复用 `common`，`chat` 第一条复数消息）与 `components/chat/ConversationList.tsx` 的日期分组标题、改名与删除动作、搜索弹窗与空态（第 38 簇，`chat.conversationList.*` 10 键，3 个键复用 `common`）与 `components/chat/MCPCredentialsTab.tsx` 的凭据表、过期徽标与吊销确认（第 39 簇，`chat.credentialsPanel.*` 16 键，7 个键复用 `common`，并把第 36 簇的 4 个相对时间键从 `chat.keysPanel` 上收进 `common`）与 `components/chat/UsagePanel.tsx` 的用量标题、4 张统计卡与每日花费/请求小图（第 40 簇，`chat.usagePanel.*` 11 键，第 37 簇的 `chat.logsPanel.tokensInAndOut` 上收进 `common`）与 `components/chat/ChatShell.tsx` 的 pre-v0 提示条、新建对话按钮与 6 个侧栏导航项（第 41 簇，`chat.shell.*` 8 键，`ChatShell.test.tsx` 改挂 provider 并把 5 条按钮名断言同步为中文；`components/chat` 文案清零）与 `components/AIHub/forms/MakeAgentPublicForm.tsx` 的公开智能体向导（第 42 簇，新开 `modelHub.makeAgentPublic.*` 16 键，`Select All` 直接落进 `common.selectAll`，测试整树挂 provider 并同步中文断言）与 `components/AIHub/forms/MakeModelPublicForm.tsx` 的公开模型向导（第 43 簇，新开 `modelHub.makeModelPublic.*` 15 键，步骤按钮与 `Select All` 全部复用 `common`，`toastSuccess` 因复数分支带空格改用 `#` 形态，测试 17 处 `render` 换 `renderWithProviders` 并同步中文断言）与 `components/AIHub/forms/MakeMCPPublicForm.tsx` 的 MCP 中心可见性向导（第 44 簇，新开 `modelHub.makeMcpPublic.*` 24 键，四个共享标签全走 `common`，`Publish {name}` 的 aria-label 与 `unknown` 兜底也接键，连带把 `ModelHubTable.test.tsx` 里点进该向导的两步按钮改为中文）与 `components/AIHub/SkillHubTableColumns.tsx` 的技能中心列定义与唯一消费者 `SkillHubDashboard.tsx` 的统计卡、筛选、空态与分页脚（第 45 簇，`skills` 新开 20 键，五个列标题与加载语复用 `skills` 已有键、状态列复用 `common.status`，`All Public Skills` 拆两键，`showingCount` 保留复数跟总数的旧渲染，工厂测试改为 provider 内的 harness 组件） |

批次 24 是唯一一个必须等前面全部做完才能收口的批次。它扫的是 `src/components` 下的共享组件，这些组件被多个页面复用，早做会导致同一个文件被反复改动。策略是在页面批次里顺手翻译碰到的那几个，最后统一扫一遍

批次 24 已收口的第一个域是 `components/add_model` 与 `components/edit_auto_router`（覆盖自动路由的新建与编辑全流程，含校验错误族、层级配置、连通性测试），按簇推进、每簇一并同步目录内测试断言。过程中验证了两条经验，后续批次照做：一是纯函数里的用户可见文案（如 `serializeRouterConfig` 的 throw、`customDimensionsError` 的拼串）要按首参翻译器约定改造，逻辑测试用 `createTranslator` 断言真实文案；二是收口时跑一次四片全量（`--shard=k/4`，串行）并把改动文件的下游消费方一起复跑，因为"只跑本目录"会漏掉跨目录断言（本次即由此抓到 `AddModelPanel` 集成测试的 6 处漏网），跨目录清单与归类见 [PROGRESS.md](./PROGRESS.md) 的"批次 24"一节

## 单批的优先级

排序依据是用户影响，核心管理功能优先于辅助功能。虚拟密钥、团队、模型、MCP 服务器是日常必用的，排在前面；本地 playground、API 参考页排在后面

具体下一批做哪个，见 [PROGRESS.md](./PROGRESS.md) 的"下一步优先级"

## 批次之外的常驻工作

有两件事不属于任何批次，但每批都要做

一是表单校验文案。zod schema 里的提示也是用户可见文案，很容易漏。schema 定义在模块顶层时拿不到 `t`，按仓库既有做法改成接收 `t` 的工厂函数。已按此处理的见 [WORKFLOW.md](./WORKFLOW.md)

二是死键清理。`en.json` 里存在但代码没人引用的键，目前没有守卫能抓到，只能人工发现。发现一个删一个，同时确认它不是被动态拼接的键名引用的

## 已完成批次里值得回头看的两处重构

`mcp_servers.tsx` 的排序下拉原本是带 `label` 的字面量数组，翻译时改成 `SORT_KEYS`（只存 key）加 `SORT_LABEL_KEYS`（key 到 i18n key 的映射），下拉项与 `items` 属性都从 `SORT_KEYS` 派生。这样数组本身不含文案，重排或增删选项不会碰到翻译

`getMCPNetworkAccess` 原本返回 `{ label, description }`，两个字段都是英文句子，而它同时被详情页与卡片页使用。改成返回分类（`kind` 与 `reason`），文案交给组件渲染。改的时候要逐个核对原始布尔条件的组合，有一处 `available_on_public_internet` 为 `undefined` 而 `is_public_explicit` 为 `true` 的组合差点被判成未知
