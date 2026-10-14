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
| 24   | 共享组件清扫（长尾，约 460 个 `.tsx`）  | 进行中。已完成 `components/add_model` 与 `components/edit_auto_router` 两个目录，`components/view_logs` 从第 13 簇起按文件推进（已收 `RequestLogsFilters.tsx`（含第 16 簇的错误码下拉表）、`LogsTableToolbar.tsx` 与 `logs_utils.tsx`、`TypeBadges.tsx` 与 `RequestLogsTable.tsx` 与 `LogDetailContent.tsx` 的类型徽标和凭据行、`RequestLogsTableColumns.tsx` 的列头与单元格（第 17 簇）、`LogDetailsDrawer/` 的抽屉外壳与 10 个头部/叶子组件（第 18 簇）） |

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
