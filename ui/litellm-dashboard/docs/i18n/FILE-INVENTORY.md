# 未接入翻译器的文件清单

覆盖率按"文件里有没有 `useTranslations(`/`getTranslations(`"计数，只能告诉你有多少文件接了翻译器，答不了剩下那些到底是"没有文案"还是"有文案没人接"。这份清单把后者逐个落到文件与字符串，判定标准是机器可复核的，不是读目录时顺口感官判断

复跑（在 `ui/litellm-dashboard` 下）：

```
node scripts/i18n-file-inventory.mjs
```

它遍历 `src` 下所有非测试 `.tsx`，跳过带翻译器的，对剩下的按六个口径取证据：JSX 文本、可见属性（`title`/`label`/`aria-label`/`alt`/`description`/`placeholder`/`tooltip`/`hint`/`helperText`/`sublabel`/`subtitle`/`emptyText`/`header`/`message`）、对象属性（表格列定义与配置映射，`scan-english.mjs` 看不见的盲区）、参数默认值（第二个盲区）、toast 首参、`new Error` 首参。对象属性口径要求值像散文（两个以上纯字母词）以免被 Tailwind 类名淹没

## 结论

2026-10-26 复跑，非测试 `.tsx` 共 955 个，接入翻译器 739 个，未接入 216 个。枚举规则即本文件的产出脚本 `node scripts/i18n-file-inventory.mjs`：`src` 下 `.tsx`，文件名含 `.test.` 的排除，接入判据是源码出现 `useTranslations(` 或 `getTranslations(`

| 分桶             | 数量 | 含义                                                   |
| ---------------- | ---- | ------------------------------------------------------ |
| 六口径零命中     | 200  | 文件里没有任何面向用户的英文字面量，不需要接入         |
| 有证据且已判定   | 17   | 有英文串，但都属数据、协议标识、程序异常串或测试脚手架 |
| 有证据且判为真漏 | 0    | 本桶为空                                               |

216 个里 199 个零命中，按目录的分布：`src/app` 路由文件 88 个（其中 `page.tsx` 40 个，只做重定向或包一层 Panel），shadcn 原语 40 个（`src/components/ui`，只有样式与转接），共享容器 23 个，其余 48 个散在 58 个目录里；另 17 个有可见文案证据。全部清单见下面两节

## 有可见文案证据的 17 个

| 文件                                                                                                                                                                              | 证据                                                                                                                                                 | 判定                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/callback_info_helpers.tsx`                                                                                                                                        | 16 条 `description: "Arize Logging Integration"` 之类的集成说明                                                                                      | 渲染处一律走同表并存的 `descriptionKey`（`team/LoggingSettings.tsx:282` 与 `:375` 用 `useTranslations("loggingCallbacks")` 查键，17 个键两侧目录齐全且无中英同值）。`description` 字段全仓无消费点，属数据源 |
| `src/components/DeploymentHealth/DeploymentWarningContent.tsx`                                                                                                                    | JSX 里的 `UI_USERNAME`、`UI_PASSWORD`、`LITELLM_LOG=DEBUG`、`general_settings.disable_env_credential_login: true`                                    | 环境变量名与 YAML 配置键，中文界面也照原样显示，属机读面                                                                                                                                                     |
| `src/components/networking.tsx`                                                                                                                                                   | `headerName = "Authorization"`、`content: "test from litellm"`、一条 `Must provide either userIds…`、`message: "Failed to parse MCP tools response"` | 依次是协议头名、发给日志服务的测试载荷、程序断言串、被吞的返回字段。`message` 的唯一消费点 `mcp-servers/_components/MCPToolsetsTab.tsx:69` 只读 `result.tools`，用户看不到它                                 |
| `src/app/layout.tsx`                                                                                                                                                              | `metadata()` 里的 `title: "LiteLLM Dashboard"` 与 `description`                                                                                      | 静态外壳的首屏 head 值，运行期由 `DocumentMetadata`（第 405 簇）按当前 locale 覆写 `document.title` 与 meta description                                                                                      |
| `src/components/TeamsPage/teamTableColumns.tsx`                                                                                                                                   | `label="TPM"`、`label="RPM"`                                                                                                                         | 单位缩写，在渲染扫描的 `ALLOWED_ENGLISH` 白名单里                                                                                                                                                            |
| `src/app/(dashboard)/caching/_components/response_time_indicator.tsx`                                                                                                             | JSX `ms`                                                                                                                                             | 时间单位                                                                                                                                                                                                     |
| `src/app/(dashboard)/mcp-servers/_components/McpFormTestHarness.tsx`                                                                                                              | JSX `Submit`                                                                                                                                         | 测试脚手架，不在产品路由上                                                                                                                                                                                   |
| `src/components/AIHub/AgentHubTableColumns.tsx`                                                                                                                                   | JSX `v`                                                                                                                                              | 版本号前缀                                                                                                                                                                                                   |
| `src/contexts/LocaleContext.tsx`、`ThemeContext.tsx`、`AuthContext.tsx`、`ChatShellContext.tsx`                                                                                   | `useX must be used within a XProvider`                                                                                                               | React provider 缺失时的程序异常串，进控制台与错误堆栈，不渲染成人面文案                                                                                                                                      |
| `src/components/CommandPalette/CommandPaletteProvider.tsx`、`common_components/MountedFormField.tsx`、`shared/InspectorTable.tsx`、`shared/dotField/DotField.tsx`、`ui/chart.tsx` | 同上形态的组合根守卫串                                                                                                                               | 同上，程序异常串                                                                                                                                                                                             |

一处可选的收口：`callback_info_helpers.tsx` 里 `description` 与 `descriptionKey` 是两份并列事实，前者已无消费点，删掉它可以避免有人改英文却忘了改目录

## 六口径零命中的 200 个

共 200 个，按目录分组，括号里是文件行数。判定标准是四条静态口径（JSX 文本、`placeholder`/`title`/`label`/`aria-label`/`alt`/`description` 等属性、toast 与 `new Error` 首参、模板串）加两个盲区口径（对象属性、参数默认值）全部零命中，即文件里没有任何面向用户的英文字面量

### `src/components/ui`（40 个）

- `Bubble.tsx`（75 行）
- `Resizable.tsx`（42 行）
- `accordion.tsx`（60 行）
- `alert-dialog.tsx`（171 行）
- `alert.tsx`（57 行）
- `attachment.tsx`（186 行）
- `avatar.tsx`（49 行）
- `badge.tsx`（50 行）
- `button-group.tsx`（79 行）
- `button.tsx`（52 行）
- `card.tsx`（87 行）
- `checkbox.tsx`（29 行）
- `collapsible.tsx`（18 行）
- `dropdown-menu.tsx`（255 行）
- `empty.tsx`（87 行）
- `field.tsx`（219 行）
- `hover-card.tsx`（47 行）
- `input-group.tsx`（139 行）
- `input.tsx`（26 行）
- `item.tsx`（180 行）
- `kbd.tsx`（21 行）
- `label.tsx`（21 行）
- `marker.tsx`（68 行）
- `message-scroller.tsx`（118 行）
- `message.tsx`（75 行）
- `popover.tsx`（66 行）
- `radio-group.tsx`（30 行）
- `scroll-area.tsx`（41 行）
- `select.tsx`（168 行）
- `separator.tsx`（22 行）
- `skeleton.tsx`（8 行）
- `slider.tsx`（42 行）
- `sonner.tsx`（38 行）
- `switch.tsx`（33 行）
- `table.tsx`（102 行）
- `tabs.tsx`（72 行）
- `textarea.tsx`（19 行）
- `toggle-group.tsx`（88 行）
- `toggle.tsx`（38 行）
- `ui-loading-spinner.tsx`（47 行）

### `src/components/shared`（10 个）

- `Alert.tsx`（33 行）
- `BadgeLink.tsx`（47 行）
- `CopyButton.tsx`（97 行）
- `DurationInput.tsx`（71 行）
- `EntityLink.tsx`（56 行）
- `Meter.tsx`（83 行）
- `Page.tsx`（41 行）
- `Sidebar.tsx`（207 行）
- `ToolbarSeparator.tsx`（13 行）
- `errorUtils.tsx`（47 行）

### `src/app/(dashboard)/playground/llm_calls`（9 个）

- `a2a_send_message.tsx`（419 行）
- `anthropic_messages.tsx`（144 行）
- `audio_speech.tsx`（64 行）
- `audio_transcriptions.tsx`（77 行）
- `embeddings_api.tsx`（71 行）
- `fetch_agents.tsx`（114 行）
- `image_edits.tsx`（93 行）
- `image_generation.tsx`（66 行）
- `interactions_api.tsx`（131 行）

### `src/components`（7 个）

- `DocsMenu.tsx`（68 行）
- `LeftnavMenuGroups.tsx`（337 行）
- `PublicModelHubTableColumns.tsx`（481 行）
- `constants.tsx`（18 行）
- `key_info_utils.tsx`（64 行）
- `provider_info_helpers.tsx`（558 行）
- `vector_store_providers.tsx`（452 行）

### `src/components/shared/table_cells`（5 个）

- `cell_tooltip.tsx`（22 行）
- `date_cell.tsx`（53 行）
- `identity_cell.tsx`（69 行）
- `money_cell.tsx`（32 行）
- `status_badge.tsx`（69 行）

### `src/components/add_model`（4 个）

- `TierRowSelect.tsx`（26 行）
- `add_model_modes.tsx`（16 行）
- `handle_add_auto_router_submit.tsx`（67 行）
- `handle_add_model_submit.tsx`（250 行）

### `src/app/(dashboard)/mcp-servers/_components`（3 个）

- `MCPStandardsSettings.tsx`（89 行）
- `index.tsx`（5 行）
- `utils.tsx`（166 行）

### `src/app/(dashboard)/playground/components/chat_ui`（3 个）

- `ChatImageUtils.tsx`（76 行）
- `EndpointUtils.tsx`（23 行）
- `ResponsesImageUtils.tsx`（68 行）

### `src/app/(dashboard)/prompts/_components`（3 个）

- `PromptTableColumns.tsx`（243 行）
- `prompt_editor_view.tsx`（4 行）
- `prompt_utils.tsx`（105 行）

### `src/app/(dashboard)/search-tools/_components`（3 个）

- `SearchToolTableColumns.tsx`（175 行）
- `index.tsx`（2 行）
- `types.tsx`（31 行）

### `src/app/(dashboard)/vector-stores/_components`（3 个）

- `DocumentsTableColumns.tsx`（137 行）
- `IndexesTableColumns.tsx`（112 行）
- `VectorStoreTableColumns.tsx`（250 行）

### `src/components/AIHub`（3 个）

- `MCPHubTableColumns.tsx`（242 行）
- `ModelHubTableColumns.tsx`（255 行）
- `SkillHubTableColumns.tsx`（181 行）

### `src/components/key_team_helpers`（3 个）

- `fetch_available_models_team_key.tsx`（76 行）
- `key_list.tsx`（129 行）
- `transform_key_info.tsx`（12 行）

### `src/components/llm_calls`（3 个）

- `chat_completion.tsx`（302 行）
- `fetch_models.tsx`（79 行）
- `responses_api.tsx`（346 行）

### `src/components/shared/charts`（3 个）

- `chart_legend.tsx`（29 行）
- `donut_chart.tsx`（96 行）
- `line_chart.tsx`（102 行）

### `src/components/shared/form`（3 个）

- `FormField.tsx`（76 行）
- `LabelWithHint.tsx`（35 行）
- `UtcDateTimeInput.tsx`（54 行）

### `src/app/(dashboard)/api-keys`（2 个）

- `ApiKeysDashboard.tsx`（85 行）
- `page.tsx`（23 行）

### `src/app/(dashboard)/policies/_components`（2 个）

- `AttachmentTableColumns.tsx`（229 行）
- `PolicyTableColumns.tsx`（233 行）

### `src/app/(dashboard)/projects/_components`（2 个）

- `ProjectKeysTableColumns.tsx`（67 行）
- `ProjectsTableColumns.tsx`（150 行）

### `src/app/connect`（2 个）

- `layout.tsx`（21 行）
- `page.tsx`（29 行）

### `src/components/chat_ui`（2 个）

- `CodeSnippets.tsx`（596 行）
- `mode_endpoint_mapping.tsx`（77 行）

### `src/components/logs/detail`（2 个）

- `PrettyMessagesView.tsx`（44 行）
- `SimpleMessageBlock.tsx`（53 行）

### `src/components/team`（2 个）

- `EditLoggingSettings.tsx`（32 行）
- `permission_definitions.tsx`（66 行）

### `src/contexts`（2 个）

- `PluginModeContext.tsx`（102 行）
- `ReactQueryProvider.tsx`（18 行）

### `src/app/(dashboard)`（1 个）

- `page.tsx`（102 行）

### `src/app/(dashboard)/access-groups`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/admin-panel`（1 个）

- `page.tsx`（12 行）

### `src/app/(dashboard)/agents`（1 个）

- `page.tsx`（12 行）

### `src/app/(dashboard)/agents/_components`（1 个）

- `AgentsTableColumns.tsx`（169 行）

### `src/app/(dashboard)/budgets`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/caching`（1 个）

- `page.tsx`（18 行）

### `src/app/(dashboard)/caching/_components/cache_settings`（1 个）

- `CacheFieldSection.tsx`（50 行）

### `src/app/(dashboard)/caching/_components/coordination_redis_settings`（1 个）

- `CoordinationRedisFieldSection.tsx`（47 行）

### `src/app/(dashboard)/change-password`（1 个）

- `page.tsx`（8 行）

### `src/app/(dashboard)/components`（1 个）

- `SidebarProvider.tsx`（30 行）

### `src/app/(dashboard)/cost-optimization`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/cost-tracking`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/guardrails`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/guardrails-monitor/_components`（1 个）

- `GuardrailsMonitorView.tsx`（76 行）

### `src/app/(dashboard)/guardrails/_components`（1 个）

- `guardrail_info_helpers.tsx`（480 行）

### `src/app/(dashboard)/guardrails/_components/content_filter`（1 个）

- `ThresholdInput.tsx`（77 行）

### `src/app/(dashboard)/home`（1 个）

- `page.tsx`（14 行）

### `src/app/(dashboard)/hooks`（1 个）

- `useTeams.tsx`（25 行）

### `src/app/(dashboard)/lens`（1 个）

- `page.tsx`（11 行）

### `src/app/(dashboard)/logging-and-alerts`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/mcp-servers`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/memory/_components`（1 个）

- `MemoryTableColumns.tsx`（167 行）

### `src/app/(dashboard)/model-hub-table`（1 个）

- `page.tsx`（29 行）

### `src/app/(dashboard)/model-insights`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/models-and-endpoints/components`（1 个）

- `AccessGroupBudgetColumns.tsx`（183 行）

### `src/app/(dashboard)/models-and-endpoints/panels`（1 个）

- `LlmCredentialsPanel.tsx`（18 行）

### `src/app/(dashboard)/organizations`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/policies`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/projects`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/prompts/_components/prompt_editor_view/conversation_panel`（1 个）

- `MessageBubble.tsx`（112 行）

### `src/app/(dashboard)/roi-calculator`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/router-settings`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/search-tools`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/skills`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/tag-management`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/tag-management/_components`（1 个）

- `tagTableColumns.tsx`（176 行）

### `src/app/(dashboard)/teams`（1 个）

- `page.tsx`（18 行）

### `src/app/(dashboard)/telemetry`（1 个）

- `page.tsx`（8 行）

### `src/app/(dashboard)/tool-policies`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/transform-request`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/ui-theme`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/usage`（1 个）

- `page.tsx`（14 行）

### `src/app/(dashboard)/usage/_components/components/EndpointUsage`（1 个）

- `EndpointUsage.tsx`（70 行）

### `src/app/(dashboard)/usage/_components/components/overview`（1 个）

- `Primitives.tsx`（174 行）

### `src/app/(dashboard)/users`（1 个）

- `page.tsx`（20 行）

### `src/app/(dashboard)/users/_components`（1 个）

- `index.tsx`（2 行）

### `src/app/(dashboard)/vector-stores`（1 个）

- `page.tsx`（12 行）

### `src/app/chat`（1 个）

- `layout.tsx`（65 行）

### `src/app/chat/api-keys`（1 个）

- `page.tsx`（15 行）

### `src/app/chat/credentials`（1 个）

- `page.tsx`（15 行）

### `src/app/chat/integrations`（1 个）

- `page.tsx`（29 行）

### `src/app/chat/logs`（1 个）

- `page.tsx`（15 行）

### `src/app/chat/usage`（1 个）

- `page.tsx`（15 行）

### `src/app/login`（1 个）

- `page.tsx`（6 行）

### `src/components/DeletedKeysPage/DeletedKeysTable`（1 个）

- `DeletedKeysTableColumns.tsx`（144 行）

### `src/components/DeletedTeamsPage/DeletedTeamsTable`（1 个）

- `DeletedTeamsTableColumns.tsx`（121 行）

### `src/components/GuardrailsMonitor`（1 个）

- `MetricCard.tsx`（25 行）

### `src/components/PassThroughSettings`（1 个）

- `PassThroughEndpointsTableColumns.tsx`（236 行）

### `src/components/ToolPolicies`（1 个）

- `ToolPoliciesTableColumns.tsx`（166 行）

### `src/components/UsagePage/utils`（1 个）

- `value_formatters.tsx`（38 行）

### `src/components/VirtualKeysPage`（1 个）

- `keyTableColumns.tsx`（383 行）

### `src/components/chat`（1 个）

- `ConnectFlowSurface.tsx`（60 行）

### `src/components/common_components/Filters`（1 个）

- `FilterInput.tsx`（43 行）

### `src/components/common_components/IconActionButton`（1 个）

- `BaseActionButton.tsx`（36 行）

### `src/components/common_components/IconActionButton/TableIconActionButtons`（1 个）

- `TableIconActionButton.tsx`（67 行）

### `src/components/lens`（1 个）

- `EmbeddedLens.tsx`（33 行）

### `src/components/logs/audit`（1 个）

- `AuditLogsTableColumns.tsx`（142 行）

### `src/components/logs/detail/sections/ToolsSection`（1 个）

- `JsonToolView.tsx`（28 行）

### `src/components/mcp_tools`（1 个）

- `types.tsx`（632 行）

### `src/components/molecules/logo`（1 个）

- `Logo.tsx`（44 行）

### `src/components/molecules/models`（1 个）

- `ProviderLogo.tsx`（12 行）

### `src/components/shared/DataTable`（1 个）

- `DataTable.test-d.tsx`（93 行）

### `src/components/shared/__fixtures__`（1 个）

- `BoundShortcut.tsx`（20 行）

### `src/components/tag_management`（1 个）

- `types.tsx`（31 行）

### `src/components/templates`（1 个）

- `KeyAutoRouterUsageTab.tsx`（19 行）

### `src/components/vector_store_management`（1 个）

- `types.tsx`（89 行）

### `src/components/view_model`（1 个）

- `model_name_display.tsx`（16 行）

### `src/hooks`（1 个）

- `useTestMCPConnection.tsx`（233 行）

## 这份清单顺带纠正的口径盲区

`scan-english.mjs` 的 `add()` 有一条 `if (/^[a-z0-9_.-]+$/.test(value)) return;`，用来把 className 碎片与驼峰标识符挡在噪声之外，但它对 JSX 文本分支同样生效，于是 JSX 里单个小写词整批看不见。第 514 簇之后登记的"可见队列为空"就带上了这个盲区

已把该过滤改成只对非 JSX 分支生效（`scripts/scan-english.mjs:45`）。代价是 JSX 口径新增 65 条命中，`.tsx` 侧从 216 处 / 110 个文件升到 281 处 / 131 个文件，含 `.ts` 全库 330 处 / 174 个文件。逐条读完的归属是：44 条属技术 token（`v` 12 条、`ms` 7 条、`s` 9 条、`x` 2 条、`esc`、`cURL`、`<code>` 里的 JSON 字段名 `prompt`/`framework`/`category`/`texts`/`images`/`tools`/`model`、批量建用户弹窗里作为 CSV 列名展示的 `teams`/`models`，以及成本追踪页 `<code>` 里的响应头名 `x-litellm-response-cost*`），余下 12 条命中落在 11 处真漏，本簇已全部接完

## 已接的 11 处真漏（2026-10-24 第 525 簇）

都在已接入翻译器的文件里，是整句里被小写单词过滤器漏掉的尾词或介词。最后一列是落定的键

| 位置                                                     | 接线前                                            | 落定的键                                                                                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp-servers/_components/MCPToolsetsTab.tsx:96`          | `{selectedSet.size} selected`                     | 新开 `mcpServers.toolsets.selectedCount`                                                                                                                                               |
| `mcp-servers/_components/MCPToolsetTableColumns.tsx:167` | `+{tools.length - 4} more`                        | 复用 `mcpServers.toolsets.moreCount`，键早就在目录里、调用点一直是硬编                                                                                                                 |
| `usage/.../overview/TopAgents.tsx:132`                   | `{formatCompact(agent.tokens)} tokens`            | 复用 `usage.overview.statStrip.tokensExact`，同命名空间已有键                                                                                                                          |
| `UsagePage/components/UserActivityTable.tsx:112`         | `{total.toLocaleString()} users`                  | 新开 `usage.userActivity.userCount`                                                                                                                                                    |
| `src/components/ToolDetail.tsx:256`                      | `{call_count} calls` 徽标                         | 新开 `toolPolicies.callsCount`                                                                                                                                                         |
| `src/app/chat/page.tsx:502`                              | `{n} tool{s} connected`，手工 `? "s" : ""` 拼复数 | 新开 `chat.page.connectedTools`，走 ICU 复数，手拼的 `"s"` 删掉                                                                                                                        |
| `model-insights/_components/ModelInsightsView.tsx:69`    | `by {model.provider}`                             | 新开 `modelInsights.byProvider`。`RankingRow` 是模块级子组件，按先例在函数体内自挂 `useTranslations`                                                                                   |
| `usage/.../overview/BreakdownChart.tsx:162`              | `by {providerForModel(row.key)}`                  | 新开 `usage.overview.byProvider`，与上一条 en 同值，记一笔跨命名空间重复债；顺手把 `providerForModel(row.key)` 的重复调用提成具名 `provider`，否则该实参是 `string \| null` 过不了类型 |
| `organizations/_components/OrganizationsPanel.tsx:111`   | 已译句后裸一个 `<a>here</a>` 与句末 `.`           | `organizations.enterpriseFeature` 改成带 `<link>` 的整句走 `t.rich`。改前 en 与 zh 两条值本身都已含"here/此处"，页面上等于把同一个词渲染两遍                                           |
| `logs/request/LogsTableToolbar.tsx:113`                  | 两个时间输入之间裸 `to`                           | 新开 `logs.toolbar.rangeTo`                                                                                                                                                            |
| `src/components/team/TeamInfo.tsx:2413`                  | `{… : "No Limit"} per {timePeriod}`               | 新开 `teams.infoPerModelBudgetValue`，兜底值改用同文件既有的 `infoNoLimit`（下一行就在用）                                                                                             |

复扫那条小写词探针，命中从 56 条降到 43 条，剩下的全是技术 token。目录叶子两侧各从 11877 升到 11885（新开 8 键、复用 2 键），中英键树仍无差集、同值仍 139 条、死键仍 0

翻面的断言只有三条，都是本簇改动直接命中的：`ToolDetail.test.tsx` 的 `42 calls` → `42 次调用`、`UserActivity.integration.test.tsx` 的 `120 users` → `120 个用户`、`ModelInsightsView.test.tsx` 的 `by openai` → `由 openai 提供`。其余 10 个消费文件复跑 283 例全绿，15 页渲染扫描 0 渲染错误

## 已接的小页零头（2026-10-24 第 532 簇）

第 530 簇把渲染扫描扩到 38 页后进基线的零头里，本簇接掉四处真漏（对应六条命中），其余 19 条判保留：18 条进白名单、`model-insights` 的 `session` 留基线。落定的键如下

| 位置                                                   | 接线前                                                               | 落定的键                                                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `model-insights/_components/ModelInsightsView.tsx:172` | 指标 tab 渲染裸 `{value}`（`Requests`/`Spend`）                      | 查表改走既有 `metricRequests`/`metricSpend`/`metricTokens`，与日/周粒度同一套映射，en 渲染外观不变（capitalize 类把首字母顶大） |
| `model-insights/_components/ModelInsightsView.tsx:191` | 刻度 tab 渲染裸 `{value}`（`Linear`/`Log`）                          | 新开 `modelInsights.scaleLinear`/`scaleLog`，与 `usage.entity` 的同义键两侧值一致                                               |
| `src/components/leftnav.tsx:236`                       | 侧栏没有 telemetry 项，面包屑兜底 `prettify(route)` 拼出 `Telemetry` | 新开 `nav.telemetry`，兜底先查 `UNLISTED_TITLES`（类型约束到 nav 键），查不到仍走 prettify                                      |
| `src/components/DocsMenu.tsx`                          | 默认 `children = "Docs"`                                             | 接 `common.docs`（en Docs / zh 文档）；唯一生产消费方 `cost_tracking_settings.tsx` 不传 children，按钮渲染「文档」              |

`model-insights` 基线里唯一留下的 `session` 判保留：它来自 `costPerSessionHint` 的 `session_id`（教用户往请求里加的 API 字段名），目录里就有这个词，删掉它文案读不通

白名单净增 18 条（`scripts/rendered-ui-fixtures.mjs` 的 `ALLOWED_ENGLISH`），逐条判定：供应商名 `Anthropic`、集成名 `CloudZero`、`MS Teams`、供应商 `Hashicorp Vault`、`CyberArk Conjur`、技能页产品与路径段 `Claude Code`/`claude-code`/`marketplace.json`、协议 `SCIM`、单位 `token`（zh 文案按惯例不译）、端点路径段 `decisions`/`systemone`、时区 `UTC`、文件扩展名 `.png`/`.svg`/`.ico` 与界面词条自带的 `logo`/`Logo`（ui-theme 的 zh 文案本身写的就是“logo 链接”）

## lens 追踪观察页（2026-10-24 第 533 簇）

lens 主体落地后本文件的角色变了：`vendor/lens-ui/src` 166 个源文件经 `scripts/lens-localize.mjs --apply` 改写，lens 命名空间在目录两侧各 1503 键，这份"未接入清单"对 vendor 不再有未接条目。手工位点与批量改写的分工账记在 [PROGRESS.md](./PROGRESS.md) 第 533 簇，此处只记渲染扫描事后揪出的尾账：

| 位置 | 接线前 | 落定的键 |
| --- | --- | --- |
| `vendor/.../onboarding/tracing/TracingSetupCard.tsx:508` | 三条 `message = "…"` 整句漏抽（抽取工具只认翻译调用形态） | 新开 `onboarding.enableLensExistingHelmDocker`/`lensConfiguredLiteLLMUnreachable`/`lensConnectedTracingStorageUnavailable` |
| `vendor/.../agents/AgentGitHubDialog.tsx:161` | `availability_error \|\| "The App may have been…"` 英文 fallback 藏在 ICU 参数值里 | 复用批量抽好的 `agents.appMayBeenRemoved` |
| `vendor/.../agents/GitHubWorkflowSetup.tsx:221` | `gate.passed ? "Gate passed" : "Gate failed, review…"` 同上 | 复用 `agents.gatePassed`/`agents.gateFailedReviewResult` |
| `vendor/.../investigations/WatchAllBanner.tsx:30` | `` `${name} needs a fix` `` / `` `${n} need a fix` `` 模板拼串 | 复用 `investigations.value0NeedsFix`/`value0NeedFix` |
| `vendor/.../evals/runs/connectSnippets.ts:141` | `` `, model=${pyString(scorer.model)}` `` 内嵌插值 | 复用 `evals.modelValue0` |
| `vendor/.../settings/signals/SignalSettings.tsx:32` | 模块顶层 `new Set(SIGNAL_LIBRARY.map(...question))` 在翻译器注册前触发 getter，lens 页整页崩溃 | 改惰性函数 `LIBRARY_QUESTIONS()` |

这批接线同时把死键判定器真死账清零：判定器此前只扫 `src`，lens 键全库误报 1293 条死，文件清单补 `vendor/lens-ui/src` 后剩的 6 条真死键即上表中间四行

## 静态英文基线（2026-10-26 第 534 簇）

默认四口径扫 `src` 下非测试 `.ts/.tsx` 得到 286 条命中，逐条分类后 1 条真漏已接，284 条判定保留冻结进 `english-leaks-baseline.json`（162 个文件）。本文件原有的 216 个未接入文件判定账不变；静态残留的机读冻结清单、五档判定与刷新方法见 [ENGLISH-BASELINE.md](./ENGLISH-BASELINE.md)
