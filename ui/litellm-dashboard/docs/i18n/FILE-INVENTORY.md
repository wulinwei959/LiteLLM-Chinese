# 未接入翻译器的文件清单

覆盖率按"文件里有没有 `useTranslations(`/`getTranslations(`"计数，只能告诉你有多少文件接了翻译器，答不了剩下那些到底是"没有文案"还是"有文案没人接"。这份清单把后者逐个落到文件与字符串，判定标准是机器可复核的，不是读目录时顺口感官判断

复跑（在 `ui/litellm-dashboard` 下）：

```
node scripts/i18n-file-inventory.mjs
```

它遍历 `src` 下所有非测试 `.tsx`，跳过带翻译器的，对剩下的按七个口径取证据：JSX 文本、可见属性（`title`/`label`/`aria-label`/`alt`/`description`/`placeholder`/`tooltip`/`hint`/`helperText`/`sublabel`/`subtitle`/`emptyText`/`header`/`message`）、对象属性（表格列定义与配置映射，`scan-english.mjs` 看不见的盲区）、参数默认值（第二个盲区）、toast 首参、`new Error` 首参、模块级 `export const` 的字符串初值（第三个盲区，2026-11-05 补，判据是大写蛇形名）。对象属性与 `const` 两个口径要求值像散文（两个以上纯字母词），`const` 还另加一条正则挡掉 Tailwind 类名串

## 结论

2026-11-05 补上 `const` 口径并接入 usage 页那批之后复跑，非测试 `.tsx` 共 990 个，接入翻译器 771 个，未接入 219 个。枚举规则即本文件的产出脚本 `node scripts/i18n-file-inventory.mjs`：`src` 下 `.tsx`，文件名匹配 `.(test|spec)` 与 `.d.ts` 的排除，接入判据是源码出现 `useTranslations(` 或 `getTranslations(`

| 分桶           | 数量 | 含义                                                   |
| -------------- | ---- | ------------------------------------------------------ |
| 七口径零命中   | 201  | 文件里没有任何面向用户的英文字面量，不需要接入         |
| 有证据且已判定 | 18   | 有英文串，但都属数据、协议标识、程序异常串或测试脚手架 |

按目录的分布：`src/app` 路由文件 89 个（其中 `page.tsx` 39 个，只做重定向或包一层 Panel），shadcn 原语 40 个（`src/components/ui`，只有样式与转接），共享容器 22 个，其余 50 个散在 30 个目录里；另 18 个有可见文案证据。全部清单见下面两节

（已接，2026-11-05 第 563 簇）真漏那条是 2026-11-05 扩口径重跑时新漂出来的，2026-10-26 那一版还没有它。`src/app/(dashboard)/usage/_components/components/ModelViewToggle.tsx:24` 直出 `{option.label}`，`"Public Model Name"` 与 `"Litellm Model Name"` 两个切换按钮无翻译器，文件由 `d20a9cb6` 带入。`usage.modelViewToggle` 在两份目录里都是空对象，键位留着没人填。渲染扫描抓不到它，`/usage` 的 stub 返回空数组，模型视图为空时这个 toggle 不进 DOM。接入把 `label` 换成 `labelKey`（`publicModelName`/`litellmModelName`），`usage.modelViewToggle` 两份目录补齐，消费方 `EntityUsage.test.tsx:877`、`:883` 与 `UsagePageView.test.tsx` 的六处断言按中文取值翻面

## 口径盲区：`.ts` 文件

这份清单原本只遍历 `.tsx`，`check:english-leaks` 同样只看 `.tsx`。文案放在 `.ts` 的对象字面量里，这道静态口径与本文件都看不见，只有渲染扫描按词组抓得到

2026-11-04 第 561 簇把扫描扩到 playground 时命中一条真漏。`src/app/(dashboard)/playground/components/chat/endpointCapabilities.ts` 由 2026-10-20 的上游合并带入，八条端点能力里的 `placeholder`、三条附件提示和七组示例提示词全是英文字面量。页面渲染出英文，死键、静态英文、中文取值三道门禁当时全绿。修法是把字面量换成键名常量（`placeholderKey`、`ATTACH_LABEL_KEYS`、`SUGGESTION_KEYS`），渲染处 `t()` 取值，沿用 `src/app/chat/page.tsx` 的 `SUGGESTION_KEYS` 先例

渲染扫描也补不上这个洞的一半。它取的是 `innerText()`，`placeholder` 与 tooltip 这类属性文案不在口径里，本轮那十一条属性英文是靠读代码捞的。扫描侧要不要一并读属性，仍是没定的事

还有第三道盲区，判据本身挡不住：接入判据只看文件里有没有 `useTranslations(`/`getTranslations(`，所以已挂翻译器的文件内部的硬编码英文一律不进这份清单。第 564 簇接的那批全在这里，`EntityUsage.tsx` 早就握着 `t = useTranslations("usage")`，JSX 里却仍写死 `Daily`/`Weekly`/`Linear`/`Log`/`Flat cost` 与两处图表标题。它也不是 `check:english-leaks` 的命中（接完复跑 280/280、无 resolved 条目，那批串本就不在它的口径里），是靠读第 563 簇那两个 builder 的消费点读出来的。同一文件的同类活账散在 PROGRESS 的各簇里，没有机读的清单，这是缺口

第 565 簇清的是同一块地：`EntityUsage.tsx` 下钻表的五个列头与「端点活动」页签、`TopModelView.tsx` 的五个列头与视图切换按钮、`TeamUserSpendCard.tsx` 的七个列头与两条空态、`EndpointUsageTable.tsx` 的空态与端点计数。四个文件全都挂着翻译器，接完复跑本清单，687、87、600 三个数一个没动。这批改动里 19 条是复用已有词条，其中 14 条接之前在自己的命名空间内没有任何读取点

死键门禁看不见这一层，是第四道盲区，而且它自己的 docstring 写明了原因。`scripts/dead-keys.py` 最后一步 `referenced_verbatim` 是：键路径的任意后缀在全仓任意字符串字面量里出现过，这个键就算活着。`usage.topModelView` 的五条（`colModel`/`colSpend`/`colTokens`/`tableView`/`chartView`）、`usage.teamUserSpend` 的七条（`team`/`user`/`spend`/`successful`/`failed`/`tokens`/`selectTeamHint`，同命名空间的 `requests` 由 `ClientUsagePanel.tsx:267` 在读）、`usage.endpointUsage.noData`、`usage.tabs.endpoints` 在自己的命名空间内此前无人读取，靠的是 `AgentsTableColumns.tsx` 的 `t("colSpend")`、`TopKeyView.tsx` 的 `t("tableView")`、`AddModelForm.tsx` 的 `t("selectTeamHint")`、`EndpointUsageTable.tsx` 的 `t("endpoints")` 这类别处的同名兄弟把它们救活，所以门禁报 0。命名空间级孤儿只能靠读消费点或逐文件 `node scripts/scan-english.mjs <file>` 捞

## `.ts` 侧的枚举与判定

2026-11-05 把枚举口径从 `.tsx` 扩到 `.ts`，产出脚本加了 `--include-ts`（`.ts` 按 `ScriptKind.TS` 解析，避免把泛型读成 JSX；跳过 `.test.`、`.spec.`、`.d.ts`、`vendor/`、`src/lib/i18n/`）。同日又补了 `const` 口径，`.ts` 侧因此多浮出 7 个文件各 1 条：`src/utils/promptCacheUsage.ts` 的两条提示（真漏，第 563 簇已接，`common.promptCacheReadTooltip` 与 `common.promptCacheCreationTooltip` 一条一个键，由 `chat_ui/ResponseMetrics.tsx` 和 `logs/detail/LogDetailContent.tsx` 各自经 `useTranslations('common')` 取值，英文串不再住在 `.ts` 里）、`src/utils/budgetUtils.ts` 的预算说明串（`describeBudgetResetSchedule` 无生产消费点）、`src/utils/activityTimestamp.ts` 的日期格式串（机读值）、`src/components/liteadmin/aria-brand.ts` 的专名、`src/app/(dashboard)/agents/_components/kill_switch_config.ts` 与 `src/app/(dashboard)/usage/_components/hooks/clientUsageData.ts` 和 `src/components/add_model/build_auto_router_routing_test_request.ts` 各 1 条待判不带 `--include-ts` 时输出与扩面之前只差一行：`src/components/shared/DataTable/DataTable.test-d.tsx` 被新的排除规则挡掉，它是类型测试不是源文件

```
node scripts/i18n-file-inventory.mjs --include-ts
```

复跑：`.tsx` 与 `.ts` 未接入翻译器共 687 个，87 个有可见文案证据（`.tsx` 18 个 40 条、`.ts` 69 个 286 条），600 个零命中。上一版记的 88 个与 287 条是第 563 簇落地之前取的数，`entityUsageSummary.ts` 接完之后退出证据桶（少 1 个文件 1 条）

`.ts` 的判据跟 `.tsx` 不一样。`.tsx` 里一条命中基本就是待接文案，`.ts` 是数据层，同一个字符串可能是渲染值、回退数据、比较键、协议字段或没人调的死代码，这五种只能靠消费点区分。2026-11-04 那一版按"文件里有英文"就记真漏，判错了，把渲染处读出来重判之后真漏从 10 个文件缩到 8 个文件，其中 4 个文件根本不是漏。按消费点重数的条数是 97，比上一版的 92 还多，因为上一版漏数了 federation 两份的 `tooltip`（跨行字面量，单行 grep 抓不到）与 `entityUsageSummary` 整块。`entityUsageSummary` 那 9 条已接，形状是 `SummaryTile` 加稳定 `id`，标题与 tooltip 由 `buildSummaryTiles(t, metadata, …)` 在构建处经 `UsageTranslator` 取值，`EntityUsage.tsx` 的 `TILE_TRENDS` 与 React key 改按 `id` 比对，六条挂空词条（`usage.entity.totalSpend`、`usage.entity.totalCost`、`usage.totalRequests`、`usage.totalTokens`、`usage.metrics.successfulRequests`、`usage.metrics.failedRequests`）全部复用，新增 `usage.entity.requestCost`/`flatCost`/`ptuHours` 三条标题与四条 `…Hint`。下面按消费点分三桶，命中条数取脚本输出，判定列的 file:line 是渲染处或"无消费点"的证据

### A 真漏，无键间接层，直接渲染成可见文案（7 个文件 88 条，`entityUsageSummary.ts` 已于 2026-11-05 第 563 簇接入）

| 文件                                                                        | 命中 | 渲染处与接入要点                                                                                                                                                                                            |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(dashboard)/usage/_components/components/overview/agentCatalog.ts` | 30   | `TopAgents.tsx:101` 与 `:108` 取 `agent.label`/`agent.description`。label 同时是数据键（`agentCatalog.ts:358` 按 label 建每日序列、`:240` `colorOf(label)`），接入要把键与显示名拆开                        |
| `src/components/model_add/anthropic_federation.ts`                          | 30   | `FederationFields.tsx:93` 经 `LabelWithHint.tsx:10` 把 `label` 与 `tooltip` 直出；`:165`/`:153` 的下拉项来自 `anthropic_federation.ts:242`；`:249`/`:258`/`:268` 的校验串经 `MountedFormField.tsx:170` 显示 |
| `src/components/add_model/provider_auth_types.ts`                           | 8    | `provider_specific_fields.tsx:363` 的 `SelectItem`、`:368` 的描述段、`:353` 的 `items`，同段兄弟文案已经走 `t()`                                                                                            |
| `src/components/model_add/openai_federation.ts`                             | 6    | 同 anthropic 那份，`FederationFields.tsx:93` 渲染 `label`/`tooltip`，校验串在 `openai_federation.ts:46`                                                                                                     |
| `src/components/liteadmin/operations.ts`                                    | 6    | 只有 `:195` 的 `ActionResult.message` 进气泡（`LiteAdminConversation.tsx:205` 的 `<AlertDescription>`），`:138`/`:141`/`:179`/`:204` 是回给 Agents SDK 的工具结果，不渲染                                   |
| `src/components/liteadmin/usageChart.ts`                                    | 5    | `UsageAnswerChart.tsx:16` 的图表标题、`:25` 的 scope 与 period、`:74` 的 note、`:66` 的点标签。LiteAdmin 挂在 `layout.tsx:193`，确实在出货界面上                                                            |
| `src/app/(dashboard)/prompts/_components/prompt_editor_view/utils.ts`       | 3    | 只有 `:249` 的示例任务串，它被塞进 `messages[0].content` 再由 `PromptMessagesCard.tsx:119` 的 textarea 显示；另两处 `throw` 在 `index.tsx:24` 被 catch 换成 `t("editor.parseFailed")`                       |

`errorsData.ts` 的命中标在 C 桶，但同文件确有两条真漏（`series.codes` 的 `Other`/`No status` 渲染在 `ErrorsTab.tsx:238` 图例、`row.topStatus` 渲染在 `:313`），只是那两个字段不在枚举的可见键里

一条附带发现：A 桶里六条标题在消息目录早有对应键、中英齐全却无人引用（`usage.entity.totalSpend`、`usage.entity.totalCost`、`usage.metrics.successfulRequests`、`usage.metrics.failedRequests`、`usage.totalRequests`、`usage.totalTokens`，errors 侧的 `usage.errors.status.noStatus`、`usage.errors.other` 同理）。这些是挂空词条，接入时优先复用而不是新建

### B 已有键间接层，英文字面量是回退数据（4 个文件 82 条，非真漏）

| 文件                                                                         | 命中 | 间接层与残留缺口                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(dashboard)/guardrails/_components/guardrail_garden_data.ts`        | 47   | `:592` 的 `localizeGuardrailCard` 查 `guardrails.garden.cards.<id>`，渲染处走它。真缺口是目录少 3 条（`llm_shield_proxy`、`wingback`、`airia`），数据侧 58 个 id、中英目录各 55 条    |
| `src/app/(dashboard)/agents/_components/agent_config.ts`                     | 30   | `:467` 的 `configText(t, text)` 配 `FIELD_TEXT_KEYS`（46 项，中英两侧齐全），`agent_form_fields.tsx:247-363` 全部经它取值，命中无一条直出。`:196`/`:200`/`:203` 的 tracing 段无消费点 |
| `src/app/(dashboard)/playground/components/systemOneUI/lib/example.ts`       | 4    | `SystemOneUI.tsx:68` 按 `preset.id` 查 `t("preset.<id>")`，`preset.label` 只有自身测试读                                                                                              |
| `src/app/(dashboard)/cost-optimization/_components/costOptimizationUtils.ts` | 1    | `SAVINGS_DRIVERS` 的名字是 `chart_tooltip.tsx:33` 那张 `chartLabels` 的查找键。残留漏点在 `donut_chart.tsx:56` 把原名当 label 传出，`chart_tooltip.tsx:70` 接不住                     |

### C 命中但不渲染，无消费点、属死代码或是机读与协议值（其余 53 个文件 110 条）

- `src/app/(dashboard)/hooks/**` 与 `src/hooks/**` 里 38 个文件各 1 条，是 `throw new Error("Access token is required")` 一类的守卫串（30 条同文），另有 `liteadmin/agent.ts` 2 条、`dataUtils.ts` 与 `keyExpiryUtils.ts` 各 1 条。它们本身不进 DOM，但调用方普遍写 `toast.fromError(error.message)`（如 `AccessGroupCreateDialog.tsx:80`），守卫一旦触发就原文贴进 toast。算低优先：正常会话取不到空 access token，真要接得先把 hook 改成抛带键的类型化错误再由调用方映射，而不是逐条翻字符串
- `src/components/shared/timeRange/timeRange.ts` 5 条 `label` 是孤儿，`RANGE_PRESETS`/`presetLabel` 只被同目录 `timeRange.test.ts` 引用，活的等价物在 `components/logs/constants.ts:86` 已经用 `labelKey`
- `src/components/UsagePage/keyActivityData.ts:11` 的 `label` 只用于搜索匹配（`modelActivityFilter.ts:11`），`KeyActivityPanel.tsx` 不读它
- `errorsData.ts` 的 `ERROR_RATE_VIEW_OPTIONS`、`ERROR_ENTITY_LABEL`、`StatusCodeRow.label` 无人 import，`ErrorsTab.tsx:96` 已用 `t("viewTotal")`/`t("viewStatus")` 自建
- `src/app/(dashboard)/mcp-servers/_components/editServerPayload.differential.cases.ts` 47 条是差分测试用例，不渲染，文件名不含 `.test.` 所以进了枚举
- `prompts/.../utils.ts` 的 dotprompt 线格式串、`networking/core.ts` 的 `headerName: "Authorization"`、`useUrlTab.ts` 的 `key: "tab"`、`jev_classifier_config.ts` 的 `provider: "jev"`、`validatePayload.ts` 的 `endpoint`、`budgetUtils.ts:96` 的 `Never resets`（`describeBudgetResetSchedule` 只被自身测试引用）

`anthropic_federation.ts` 的 `fdrl_`/`svac_`/`wrkspc_` 前缀和路径、URL、secret 引用示例是输入值提示，`client_secret_basic`/`client_secret_post` 是协议枚举。`src/data/compliancePrompts.ts`、`financialCompliancePrompts.ts`、`insultsCompliancePrompts.ts` 的 `content` 是发给模型的提示词正文。`agentCatalog.ts` 的产品名（`Claude Desktop`、`GitHub Copilot`）与 `provider_auth_types.ts` 的 `id`/`fieldKeys` 同名同值，属专名与配置字段

还有一层盲区叠加在这几张表上：渲染扫描的 stub 对 `/guardrails`、`/agents`、`/usage` 这类页返回空数组，卡片与表格行根本不进 DOM，所以这些字符串既不在静态口径里、也不在扫描面上。等 A 桶接完，`rendered-ui-fixtures.mjs` 要按第 530 簇的先例给这几个端点补最小非空形状，扫描才接得住它们

## 有可见文案证据的 18 个

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

上表 10 行加上下面这 8 个，就是本轮 `.tsx` 侧的 18 个有证据文件。`const` 口径在 `.tsx` 侧新浮出 8 个文件。7 个是 `throw new Error("useAuth must be used within an AuthProvider")` 一类的开发期断言串（`src/contexts/AuthContext.tsx`、`ChatShellContext.tsx`、`ThemeContext.tsx`、`src/components/ui/chart.tsx`、`src/components/shared/InspectorTable.tsx`、`src/components/shared/dotField/DotField.tsx`、`src/components/common_components/MountedFormField.tsx`），React 契约违背时抛在开发控制台，不进 DOM，判同 C 桶的 hook 守卫串。剩 1 个待判：`src/app/(dashboard)/tag-management/_components/tagTableColumns.tsx` 的 `"This is just a spend tag that was passed dynamically in a request. It does not control any LLM models."`，要先确认它渲染在哪个 tooltip 或说明列

一处可选的收口：`callback_info_helpers.tsx` 里 `description` 与 `descriptionKey` 是两份并列事实，前者已无消费点，删掉它可以避免有人改英文却忘了改目录

## 七口径零命中的 201 个

共 201 个，2026-11-05 由 `node scripts/i18n-file-inventory.mjs` 产出，按目录分组，括号里是文件行数。判定标准是四条静态口径（JSX 文本、`placeholder`/`title`/`label`/`aria-label`/`alt`/`description` 等属性、toast 与 `new Error` 首参、模板串）加三个盲区口径（对象属性、参数默认值、模块级 `export const`）全部零命中，即文件里没有任何面向用户的英文字面量

### `src/components/ui`（40 个）

- `accordion.tsx`（60 行）
- `alert-dialog.tsx`（171 行）
- `alert.tsx`（57 行）
- `attachment.tsx`（186 行）
- `avatar.tsx`（49 行）
- `badge.tsx`（50 行）
- `Bubble.tsx`（75 行）
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
- `Resizable.tsx`（42 行）
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
- `CopyButton.tsx`（87 行）
- `DurationInput.tsx`（71 行）
- `EntityLink.tsx`（56 行）
- `errorUtils.tsx`（47 行）
- `Meter.tsx`（83 行）
- `Page.tsx`（41 行）
- `Sidebar.tsx`（207 行）
- `ToolbarSeparator.tsx`（13 行）

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

### `src/components`（6 个）

- `constants.tsx`（18 行）
- `key_info_utils.tsx`（64 行）
- `LeftnavMenuGroups.tsx`（337 行）
- `provider_info_helpers.tsx`（562 行）
- `PublicModelHubTableColumns.tsx`（481 行）
- `vector_store_providers.tsx`（452 行）

### `src/components/shared/table_cells`（5 个）

- `cell_tooltip.tsx`（22 行）
- `date_cell.tsx`（53 行）
- `identity_cell.tsx`（69 行）
- `money_cell.tsx`（32 行）
- `status_badge.tsx`（69 行）

### `src/components/add_model`（4 个）

- `add_model_modes.tsx`（16 行）
- `handle_add_auto_router_submit.tsx`（67 行）
- `handle_add_model_submit.tsx`（250 行）
- `TierRowSelect.tsx`（26 行）

### `src/app/(dashboard)/mcp-servers/_components`（3 个）

- `index.tsx`（5 行）
- `MCPStandardsSettings.tsx`（89 行）
- `utils.tsx`（166 行）

### `src/app/(dashboard)/playground/components/chat_ui`（3 个）

- `ChatImageUtils.tsx`（76 行）
- `EndpointUtils.tsx`（23 行）
- `ResponsesImageUtils.tsx`（68 行）

### `src/app/(dashboard)/prompts/_components`（3 个）

- `prompt_editor_view.tsx`（4 行）
- `prompt_utils.tsx`（105 行）
- `PromptTableColumns.tsx`（243 行）

### `src/app/(dashboard)/search-tools/_components`（3 个）

- `index.tsx`（2 行）
- `SearchToolTableColumns.tsx`（175 行）
- `types.tsx`（31 行）

### `src/app/(dashboard)/vector-stores/_components`（3 个）

- `DocumentsTableColumns.tsx`（137 行）
- `IndexesTableColumns.tsx`（112 行）
- `VectorStoreTableColumns.tsx`（250 行）

### `src/components/AIHub`（3 个）

- `MCPHubTableColumns.tsx`（242 行）
- `ModelHubTableColumns.tsx`（272 行）
- `SkillHubTableColumns.tsx`（181 行）

### `src/components/key_team_helpers`（3 个）

- `fetch_available_models_team_key.tsx`（76 行）
- `key_list.tsx`（131 行）
- `transform_key_info.tsx`（12 行）

### `src/components/llm_calls`（3 个）

- `chat_completion.tsx`（302 行）
- `fetch_models.tsx`（79 行）
- `responses_api.tsx`（361 行）

### `src/components/shared/charts`（3 个）

- `chart_legend.tsx`（29 行）
- `donut_chart.tsx`（96 行）
- `line_chart.tsx`（102 行）

### `src/components/shared/form`（3 个）

- `FormField.tsx`（76 行）
- `LabelWithHint.tsx`（35 行）
- `UtcDateTimeInput.tsx`（54 行）

### `src/components/team`（3 个）

- `EditLoggingSettings.tsx`（32 行）
- `permission_definitions.tsx`（66 行）
- `TeamInfoOverview.tsx`（272 行）

### `src/app/(dashboard)/api-keys`（2 个）

- `ApiKeysDashboard.tsx`（85 行）
- `page.tsx`（23 行）

### `src/app/(dashboard)/models-and-endpoints/panels`（2 个）

- `LlmCredentialsPanel.tsx`（18 行）
- `PassThroughPanel.tsx`（10 行）

### `src/app/(dashboard)/policies/_components`（2 个）

- `AttachmentTableColumns.tsx`（229 行）
- `PolicyTableColumns.tsx`（233 行）

### `src/app/(dashboard)/projects/_components`（2 个）

- `ProjectKeysTableColumns.tsx`（67 行）
- `ProjectsTableColumns.tsx`（150 行）

### `src/app/connect`（2 个）

- `layout.tsx`（21 行）
- `page.tsx`（29 行）

### `src/components/chat`（2 个）

- `ChatFileChip.tsx`（19 行）
- `ConnectFlowSurface.tsx`（60 行）

### `src/components/chat_ui`（2 个）

- `CodeSnippets.tsx`（596 行）
- `mode_endpoint_mapping.tsx`（77 行）

### `src/components/logs/detail`（2 个）

- `PrettyMessagesView.tsx`（44 行）
- `SimpleMessageBlock.tsx`（53 行）

### `src/contexts`（2 个）

- `PluginModeContext.tsx`（114 行）
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

### `src/app/(dashboard)/old-usage/_components`（1 个）

- `TeamSpendBarList.tsx`（30 行）

### `src/app/(dashboard)/organizations`（1 个）

- `page.tsx`（10 行）

### `src/app/(dashboard)/playground/components/complianceUI`（1 个）

- `ComplianceUIShared.tsx`（98 行）

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

- `keyTableColumns.tsx`（386 行）

### `src/components/common_components/Filters`（1 个）

- `FilterInput.tsx`（43 行）

### `src/components/common_components/IconActionButton`（1 个）

- `BaseActionButton.tsx`（36 行）

### `src/components/common_components/IconActionButton/TableIconActionButtons`（1 个）

- `TableIconActionButton.tsx`（67 行）

### `src/components/liteadmin`（1 个）

- `AriaAvatar.tsx`（18 行）

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

| 位置                                                     | 接线前                                                                                         | 落定的键                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `vendor/.../onboarding/tracing/TracingSetupCard.tsx:508` | 三条 `message = "…"` 整句漏抽（抽取工具只认翻译调用形态）                                      | 新开 `onboarding.enableLensExistingHelmDocker`/`lensConfiguredLiteLLMUnreachable`/`lensConnectedTracingStorageUnavailable` |
| `vendor/.../agents/AgentGitHubDialog.tsx:161`            | `availability_error \|\| "The App may have been…"` 英文 fallback 藏在 ICU 参数值里             | 复用批量抽好的 `agents.appMayBeenRemoved`                                                                                  |
| `vendor/.../agents/GitHubWorkflowSetup.tsx:221`          | `gate.passed ? "Gate passed" : "Gate failed, review…"` 同上                                    | 复用 `agents.gatePassed`/`agents.gateFailedReviewResult`                                                                   |
| `vendor/.../investigations/WatchAllBanner.tsx:30`        | `` `${name} needs a fix` `` / `` `${n} need a fix` `` 模板拼串                                 | 复用 `investigations.value0NeedsFix`/`value0NeedFix`                                                                       |
| `vendor/.../evals/runs/connectSnippets.ts:141`           | `` `, model=${pyString(scorer.model)}` `` 内嵌插值                                             | 复用 `evals.modelValue0`                                                                                                   |
| `vendor/.../settings/signals/SignalSettings.tsx:32`      | 模块顶层 `new Set(SIGNAL_LIBRARY.map(...question))` 在翻译器注册前触发 getter，lens 页整页崩溃 | 改惰性函数 `LIBRARY_QUESTIONS()`                                                                                           |

这批接线同时把死键判定器真死账清零：判定器此前只扫 `src`，lens 键全库误报 1293 条死，文件清单补 `vendor/lens-ui/src` 后剩的 6 条真死键即上表中间四行

## 静态英文基线（2026-10-26 第 534 簇）

默认四口径扫 `src` 下非测试 `.ts/.tsx` 得到 286 条命中，逐条分类后 1 条真漏已接，284 条判定保留冻结进 `english-leaks-baseline.json`（162 个文件）。本文件原有的 216 个未接入文件判定账不变；静态残留的机读冻结清单、五档判定与刷新方法见 [ENGLISH-BASELINE.md](./ENGLISH-BASELINE.md)

## 第 566 簇（2026-11-05）：client usage 错误通道与区间说明

第 565 簇清单未覆盖到的六个文件内部硬编码英文，接入判据只看 `useTranslations(`/`getTranslations(`，挂了翻译器的文件内部裸串一律不进清单（第四道盲区）。本簇六文件约 16 处，集中改为 translator-first，复用/新增 17 条 `clientUsage` 词条，叶子 13594 → 13611。

| 位置                                                                                     | 接线前                                        | 落定的键                                                                                                              |
| ---------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/app/(dashboard)/usage/_components/hooks/clientUsageScope.ts:79/84/88/95`            | 四处 `return { error: "..." }`                | `chooseAdminTeam`/`chooseTeamMember`/`chooseTeamBeforeOtherMember`/`signInRequired`（复用）                           |
| `src/app/(dashboard)/usage/_components/hooks/useClientUsage.ts:27/28/29/68`              | `scopeError` 四分支 + `emptyClientUsage` 兜底 | `selectUserOrTeam`/`selectValidDateRange`/`signInRequired`/`couldNotLoad`（复用）                                     |
| `src/app/(dashboard)/usage/_components/hooks/clientUsageData.ts:187/189/191/195/198/200` | `INCOMPLETE_CLIENT_USAGE` 常量 + 五处字面量   | `selectUserOrTeam`/`proxyIncompleteData`/`incompleteClientUsage`/`proxyUsageOutsideUser`/`proxyUsageOutsideTeam`      |
| `src/app/(dashboard)/usage/_components/hooks/useClientAgentModels.ts:21/27/29/66`        | `loadModels` 两处 + hook 范围校验             | `chooseShorterDateRange`/`couldNotLoadCompleteModelUsage`/`couldNotLoadModelBreakdown`/`selectValidDateRange`（复用） |
| `src/app/(dashboard)/usage/_components/hooks/clientAgentModelsData.ts:65/70/87`          | 三处字面量                                    | `proxyIncompleteModelData`/`proxyDuplicateModelData`/`modelUsageMismatch`                                             |
| `src/app/(dashboard)/usage/_components/components/ClientUsagePanel.tsx:57/272/299`       | `countLabel` 回落 "Unavailable"、两处区间提示 | `unavailable`/`scopedRequestHint`/`allUsersHint`/`chooseAnotherPerson`（复用）                                        |

新增 `clientUsage` 词条 17 条（`chooseAdminTeam`/`chooseTeamMember`/`chooseTeamBeforeOtherMember`/`incompleteClientUsage`/`proxyIncompleteData`/`proxyIncompleteModelData`/`proxyUsageOutsideUser`/`proxyUsageOutsideTeam`/`chooseShorterDateRange`/`couldNotLoadCompleteModelUsage`/`couldNotLoadModelBreakdown`/`modelUsageMismatch`/`scopedRequestHint`/`allUsersHint`/`selectedUser`/`unavailable`/`loadingAria`），叶子 13594 → 13611。其余复用 `signInRequired`/`couldNotLoad`/`selectUserOrTeam`/`selectValidDateRange`/`chooseAnotherPerson`。

同步更新 8 个测试文件，注入英语 translator / `LocaleProvider` 包装 / 断言改中文，109 例全绿。i18n 三闸全绿（死键 0/0、静态英文 280/280、zh 未译 222/222）。

第 565 簇已记的"第四道盲区"（`dead-keys.py` 的 `referenced_verbatim` 把命名空间级孤儿救活）本簇补记 14 个命名空间孤儿键与救活它们的同名兄弟：

| 孤儿键（本簇新增/复用）              | 救活它的同名兄弟（不同命名空间）                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `usage.topModelView.colSuccessful`   | `AgentsTableColumns.tsx` `t("colSpend")`、`TopKeyView.tsx` `t("tableView")` 这类同名兄弟 |
| `usage.topModelView.colFailed`       | 同上                                                                                     |
| `usage.topModelView.colModel`        | 同上                                                                                     |
| `usage.topModelView.colSpend`        | 同上                                                                                     |
| `usage.topModelView.colTokens`       | 同上                                                                                     |
| `usage.topModelView.tableView`       | 同上                                                                                     |
| `usage.topModelView.chartView`       | 同上                                                                                     |
| `usage.teamUserSpend.selectTeamHint` | `AddModelForm.tsx` `t("selectTeamHint")` 等                                              |
| `usage.teamUserSpend.team`           | 同上                                                                                     |
| `usage.teamUserSpend.user`           | 同上                                                                                     |
| `usage.teamUserSpend.spend`          | 同上                                                                                     |
| `usage.teamUserSpend.successful`     | 同上                                                                                     |
| `usage.teamUserSpend.failed`         | 同上                                                                                     |
| `usage.teamUserSpend.tokens`         | 同上                                                                                     |

以及 `usage.endpointUsage.noData`、`usage.tabs.endpoints`、`usage.endpointUsage.endpointCount` 三条孤儿，无同名兄弟救活，纯靠本簇接线激活。

清单复跑：未接入 687、有证据 87、零命中 600，三个数与 565 簇完全一致，本簇六文件均在清单内部，对清单零影响。

## 第 567 簇：A 桶首片 `agentCatalog.ts`（2026-11-05）

A 桶 7 个 `.ts` 里命中最多的一个接完。`FAMILIES` 表 22 个品牌的 `label`/`description` 直出 Top Agents 面板与图表，文件此前不挂翻译器、逐文件扫描也判它无 JSX 文本可报。接线形态：locale 无关常量保留 `match`/`kind`/`logo`/`id`，显示文本换成 `labelKey`/`descriptionKey` 字面量键，只有建 `AgentRow` 的 `agentFor(t, ...)` 起需要译员；`familyFor`/`usageClientFromUserAgent` 免译员，识别链路（`clientUsageData.ts`）零改动。踩到一条门禁事实：Desc 键若用 `` `${labelKey}Desc` `` 模板拼接，`dead-keys.py` 的 `referenced_verbatim` 找不到字面量、22 条全误报成死键，故 `descriptionKey` 按字面量落表。`TopAgents.tsx` 的 `` `View ${label} usage` `` aria-label 一并接 `catalogViewUsageAria`。新增 46 键，21 条品牌名 zh 值保留英文加 2 条 SDK 描述入 zh 基线（222 → 245）。清单：未接入 687 → 685、有证据 87 → 85、零命中 600 → 602。A 桶剩 `anthropic_federation.ts`(30)、`provider_auth_types.ts`(8)、`openai_federation.ts`(6)、`operations.ts`(6)、`usageChart.ts`(5)、`prompt_editor_view/utils.ts`(3)

## 第 568 簇与接入判据的第五道盲区（2026-11-05）

`anthropic_federation.ts`、`openai_federation.ts` 接完后清单只动了两格：有证据 85 → 83、零命中 602 → 604，未接入总数 685 不变。原因是接入判据按 `useTranslations(`/`getTranslations(` 认线，而 translator-first 数据模块收的是译员参数、文件内不出现这两个调用，接完仍留在未接入桶里（`federation_field.ts` 与 `credential_federation.ts` 同）。第 567 簇的 `agentCatalog.ts` 因 import 了 `useTranslations` 字样在 `TopAgents.tsx` 侧才被记成已接入？不是——它本身也仍未挂线，两簇合起来说明：未接入桶从 567 簇起混入了已接净的 translator-first 模块，读这份清单要交叉核对逐文件 `scan-english` 零命中，不能按桶判断一个 `.ts` 是否有活。后续把判据改成「含 `useTranslations(`/`getTranslations(`/或导出收 `*Translator` 入参的 builder」再说，本簇先在数里记明口径变化

## A 桶清零（2026-11-05 第 569 簇）

`provider_auth_types.ts`(8)、`operations.ts`(6)、`usageChart.ts`(5)、`prompt_editor_view/utils.ts`(3) 接完，A 桶 7 个文件 88 条全部有归属：567 簇 `agentCatalog`、568 簇两份 federation、569 簇这四片，另 `errorsData.ts` 的 `Other`/`No status` 仍按 seriesKey 数据键与图例名纠缠留在判定账。三条口径记录：LiteAdmin 工具 description 与 renderChart 反馈串是发给模型的语料，固定英文（`createTranslator({locale:"en"})` 取值，UI title 另走译员）；`{{template_variables}}` 字面量在 ICU 消息里冲突，收 `{templateVar}` 参数由调用点传字面量；`usageChartSource` 加译员后 5 位置参触 eslint `max-params`，改单对象参。有证据桶 83 → 80，剩余命中集中在 `errorsData.ts` 与 B/C 判定面

## 第 570 簇：errorsData 纠缠拆开（2026-11-05）

`seriesKey` 的双身份拆开：数据键改 `no_status`/`other` 稳定标识，显示名由渲染点按 `usage.errors.status.noStatus`/`usage.errors.other` 两条长期孤儿键映射；`entityRows` 返回状态码数据不再拼串。`statusCodeLabel`/`ERROR_ENTITY_LABEL`/`ERROR_RATE_VIEW_OPTIONS`/`StatusCodeRow.label` 四条死导出连测试删除（渲染面早被组件本地已译版接管，属判定账里"死常量遮蔽"型）。`LineChart` 新增可选 `categoryLabels`（此前 config label 直接回显数据键，`no_status` 会亮进图例）。零新键，有证据桶 80 → 79，A 桶与 `errorsData` 专项清零；残留显示英文自此只剩 B/C 判定面与上游新增

## 门禁口径第五条：对象属性字面量（2026-11-05 第 571 簇开线，第 573 簇扩口径并首片接清）

`check:english-leaks` 的 `scanSource` 此前只认 JSX 文本、JSX 属性、toast 首参与 `new Error` 四类，`.ts` 数据表里 `label:` / `tooltip:` / `title:` 这类对象属性字面量一律不可见，A 桶那批表就是靠 FILE-INVENTORY 人肉逐簇清的。第 571 簇给库加 `scanObjectProperty`，口径一次扩出 361 条 `prop:` 存量命中，全部冻结进 `english-leaks-baseline.json`（276 到 560）。第 573 簇把键引用豁免补全：`KEY_REFERENCE` 允许无点小写开头的单段标识符（`allProxyModels`、`openingBuiltInPlaceholder` 这类值与 `nav.virtualKeys` 同性质），并让同一条豁免作用于 JSX 属性口径，8 条误报当场退场（`gatewaySessions.byAiClient`/`byUser`、`allProxyModels`/`noDefaultModels`、两处 `cURL`、两处 placeholder 键名）

同一簇接清真显示面 27 条，基线 560 到 534 到 529：

- `LiteAdminHomeComposer.tsx` 首页 6 条建议词改 `labelKey`，新键 `liteAdmin.composer.suggest*`
- `SearchBox.tsx` 运算符说明 4 条（含被小写词过滤器漏掉的 `equals`）改 `labelKey`，新键 `searchBox.operators.*`
- `Teams.tsx` 删除确认弹窗的 4 条 label、`resourceInformationTitle` 和模板字面量警告全部改走已有键（`listTeamId`/`listTeamName`/`keys`/`members`/`listTeamInformation`/`listDeleteKeysWarning`），此前是整块绕过 i18n 的漏接
- `MCPNetworkSettings.tsx` 两条能力开关名改 `labelKey`，新键 `mcpServers.capabilityPrompts`/`capabilityResources`
- `MCPToolsetTableColumns.tsx` 的 `Toolset ID` 用回已有键 `toolsets.columnToolsetId`
- `PlaygroundChat.tsx` 的 MCP 分组名新键 `playground.chat.mcpServers`
- `credentialOptions.ts` 的 `None` 改 `noCredentialOption(t)` 与 `credentialOptions(t, credentials)`，形参类型取 `(key: "none") => string`，4 处消费者传 common 译者
- `ComplexityRouterConfig.tsx` 的 `TIER_DESCRIPTIONS.label` 改名 `builtInName`，5 条随之退场（该字段只用于和用户自填层名的相等比对，显示走 `labelKey`，属误挂文案槽位）

第 574 簇把 `agent_config.ts` 的 45 条表值改成正向键引用：`FieldConfig.label`/`tooltip`/`helpText` 与 `SectionConfig.title` 换成 `labelKey`/`tooltipKey`/`helpTextKey`/`titleKey`，`SKILL_FIELD_CONFIG` 同形，消费点直接 `t(field.labelKey)`，placeholder 走新的 `fieldPlaceholderText(t, field)`。反向查找表 `FIELD_TEXT_KEYS` 与 `configText` 只剩后端下发的凭据字段还在用（`credential_fields` 的 label/tooltip/placeholder 来自网关，不是本地表），因此改名 `serverFieldText` 说明它翻译的是服务端英文。纯数字与版本号占位符（`0.0`、`1.0.0`）保持字面量，本就不含字母、不进口径。基线 529 到 484，`prop:` 命中 330 到 285，待接 54 到 9

下表按当前 484 条基线里的 285 条 `prop:` 命中重排，判定列区分两类：判定保留是长期留在基线的账（语料、品牌与缩写、格式示例），不是待办；待接才是下一簇的活。一簇把某文件的表值改成键引用（或删死串）后，该文件的基线条目随命中消失而移除，resolved 触红即门禁生效，新增英文串不再能静默进表

| 条数 | 文件                                                                                          | 判定                             |
| ---- | --------------------------------------------------------------------------------------------- | -------------------------------- |
| 58   | `src/app/(dashboard)/guardrails/_components/guardrail_garden_data.ts`                         | 判定保留：第三方网关语料         |
| 50   | `src/app/(dashboard)/mcp-servers/_components/editServerPayload.differential.cases.ts`         | 判定保留：差分用例语料           |
| 17   | `src/components/callback_info_helpers.tsx`                                                    | 判定保留：集成商产品名           |
| 12   | `src/app/(dashboard)/playground/components/chat_ui/chatConstants.ts`                          | 判定保留：API 路径               |
| 8    | `src/data/compliancePrompts.ts`                                                               | 判定保留：合规提示语料           |
| 6    | `src/app/(dashboard)/mcp-servers/_components/IdJagFormFields.tsx`                             | 判定保留：URL/JSON/正则格式示例  |
| 6    | `src/components/model_add/anthropic_federation.ts`                                            | 判定保留：URL/JSON/正则格式示例  |
| 6    | `src/components/model_dashboard/HealthCheckComponent.tsx`                                     | 判定保留：异常类名               |
| 5    | `src/app/(dashboard)/guardrails/_components/custom_code/CustomCodeModal.tsx`                  | 判定保留：示例工具语料           |
| 5    | `src/app/(dashboard)/mcp-servers/_components/OAuthFormFields.tsx`                             | 判定保留：URL/JSON/正则格式示例  |
| 5    | `src/app/(dashboard)/skills/_components/add_plugin_form.tsx`                                  | 判定保留：URL/JSON/正则格式示例  |
| 5    | `src/components/Settings/AdminSettings/SSOSettings/Modals/BaseSSOSettingsForm.tsx`            | 判定保留：URL/JSON/正则格式示例  |
| 5    | `src/components/shared/timeRange/timeRange.ts`                                                | 待接：无生产消费者，接线时一并翻 |
| 4    | `src/app/(dashboard)/guardrails/_components/tool_permission/ToolPermissionRulesEditor.tsx`    | 判定保留：URL/JSON/正则格式示例  |
| 4    | `src/app/(dashboard)/playground/components/systemOneUI/lib/example.ts`                        | 判定保留：示例负载语料           |
| 4    | `src/components/shared/CreatedKeyDisplay.tsx`                                                 | 判定保留：品牌名                 |
| 3    | `src/app/(dashboard)/guardrails/_components/TeamGuardrailsTab.tsx`                            | 判定保留：URL/JSON/正则格式示例  |
| 3    | `src/app/(dashboard)/guardrails/_components/content_filter/CompetitorIntentConfiguration.tsx` | 判定保留：URL/JSON/正则格式示例  |
| 3    | `src/app/(dashboard)/mcp-servers/_components/TokenExchangeFormFields.tsx`                     | 判定保留：URL/JSON/正则格式示例  |
| 3    | `src/app/(dashboard)/ui-theme/UIThemeSettings.tsx`                                            | 判定保留：URL/JSON/正则格式示例  |
| 3    | `src/components/liteadmin/operations.ts`                                                      | 判定保留：模型侧工具说明         |
| 3    | `src/components/user_agent_activity.tsx`                                                      | 判定保留：缩写                   |
| 3    | `src/utils/budgetUtils.ts`                                                                    | 待接：无生产消费者，接线时一并翻 |
| 2    | `src/app/(dashboard)/agents/_components/KillSwitchFormFields.tsx`                             | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/app/(dashboard)/guardrails/_components/content_filter/CustomPatternModal.tsx`            | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/app/(dashboard)/mcp-servers/_components/CreateMCPServer.tsx`                             | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/app/(dashboard)/mcp-servers/_components/PassthroughAuthorizeSection.tsx`                 | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/app/(dashboard)/mcp-servers/_components/mcp_server_edit.tsx`                             | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/app/(dashboard)/playground/components/chat_ui/GeneratedCodeDialog.tsx`                   | 判定保留：SDK 名                 |
| 2    | `src/app/(dashboard)/prompts/_components/prompt_editor_view/PromptCodeSnippets.tsx`           | 判定保留：SDK 名                 |
| 2    | `src/app/(dashboard)/usage/_components/components/ClientUsageSelect.tsx`                      | 判定保留：品牌名                 |
| 2    | `src/app/layout.tsx`                                                                          | 判定保留：产品名（文档标题）     |
| 2    | `src/components/TeamsPage/teamTableColumns.tsx`                                               | 判定保留：缩写 RPM/TPM           |
| 2    | `src/components/add_model/ReminderMarkers.tsx`                                                | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/components/add_model/advanced_settings.tsx`                                              | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/components/key_team_helpers/key_sorting.ts`                                              | 判定保留：缩写 RPM/TPM           |
| 2    | `src/components/pass_through_info.tsx`                                                        | 判定保留：URL/JSON/正则格式示例  |
| 2    | `src/components/routing_groups/RoutingGroupUsagePanel.tsx`                                    | 判定保留：SDK 名                 |
| 2    | `src/components/team/TeamEditSettingsForm.tsx`                                                | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/access-groups/_components/AccessGroupsTableColumns.tsx`                  | 判定保留：缩写 ID                |
| 1    | `src/app/(dashboard)/agents/_components/AgentIdentityFields.tsx`                              | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/agents/_components/dynamic_agent_form_fields.tsx`                        | 判定保留：预置技能种子           |
| 1    | `src/app/(dashboard)/cost-optimization/_components/PromptCompressionTab.tsx`                  | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/cost-tracking/_components/add_provider_form.tsx`                         | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/guardrails/_components/GuardrailTestPanel.tsx`                           | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/guardrails/_components/add_guardrail_form.tsx`                           | 判定保留：API 路径               |
| 1    | `src/app/(dashboard)/mcp-servers/_components/OpenAPIFormSection.tsx`                          | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/mcp-servers/_components/OpenApiByokFields.tsx`                           | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/mcp-servers/_components/UpstreamTokenHeaderField.tsx`                    | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/memory/_components/MemoryEditModal.tsx`                                  | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/models-and-endpoints/components/AutoRouters/AutoRoutersPanel.tsx`        | 判定保留：缩写 ID                |
| 1    | `src/app/(dashboard)/projects/_components/ProjectsTableColumns.tsx`                           | 判定保留：缩写 ID                |
| 1    | `src/app/(dashboard)/roi-calculator/_components/ROISettingsPanel.tsx`                         | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/router-settings/_components/RequestTagMappings.tsx`                      | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/vector-stores/_components/VectorStoreForm.tsx`                           | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/vector-stores/_components/vector_store_info.tsx`                         | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/app/(dashboard)/workflows/WorkflowRuns.tsx`                                              | 判定保留：元数据键名             |
| 1    | `src/components/AIHub/UsefulLinksManagement.tsx`                                              | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/Navbar/ViewSwitcher.tsx`                                                      | 判定保留：品牌名                 |
| 1    | `src/components/Teams.tsx`                                                                    | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/UsagePage/keyActivityData.ts`                                                 | 判定保留：度量集名，渲染侧另有键 |
| 1    | `src/components/add_pass_through.tsx`                                                         | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/cloudzero_export_modal.tsx`                                                   | 判定保留：品牌名                 |
| 1    | `src/components/leftnav.tsx`                                                                  | 判定保留：品牌名                 |
| 1    | `src/components/model_add/openai_federation.ts`                                               | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/networking.tsx`                                                               | 待接：解析失败的返回值           |
| 1    | `src/components/routing_groups/RoutingGroupModal.tsx`                                         | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/team/EditMembership.tsx`                                                      | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/components/templates/KeyEditViewControls.tsx`                                            | 判定保留：URL/JSON/正则格式示例  |
| 1    | `src/data/financialCompliancePrompts.ts`                                                      | 判定保留：合规提示语料           |
| 1    | `src/data/insultsCompliancePrompts.ts`                                                        | 判定保留：合规提示语料           |

剩在待接列的 9 条分三型：`timeRange.ts` 5 条与 `budgetUtils.ts` 3 条所在模块暂无生产消费者（`RANGE_PRESETS`/`presetLabel` 与 `describeBudgetResetSchedule` 只有测试引用），接线时一并翻，现在造键等于翻译没人看的串；`networking.tsx` 1 条是解析失败的返回值，与同函数 `console.error` 成对

第六条口径已开（2026-11-05 第 575 簇）。`COPY_PROPS` 原先按属性名精确匹配，`alertMessage`、`resourceInformationTitle`、`searchPlaceholder`、`tooltipText`、`copyLabel` 这类以文案词结尾的复合属性名看不见，`title={`...`}` 这类无插值模板字面量也看不见。库改成按 camel 末词判定（`COPY_TAILS`：label、title、description、placeholder、tooltip、hint、message、text、alt、sublabel、subtitle、error、empty、helper），`copyValue` 同时收字符串字面量与无插值模板字面量，CSS 自定义属性名（`--normal-text`）排除

一次扩出 61 条，5 条真漏同簇接掉：`MemberTable.tsx` 的三个 `tooltipText`（"Edit member"/"Delete member" 用已有键 `teams.memberTable.editTooltip`/`deleteTooltip`，"Reset spend" 新开 `.resetSpendTooltip`，`ResetSpendAction` 加 `tooltipText` 形参、由列构建处传入）、`MemoryTable.tsx` 的 `searchPlaceholder` 新键 `memory.searchPlaceholder`、`Conversation.tsx` 回复头模型名的 `copyLabel` 新键 `playground.conversation.copy.modelName`（同页 `Inspector.tsx` 早就在传 `t("copy.modelName")`，这条是漏接的第二处）。基线 484 到 540，零条既有条目消失

新增 56 条按型记判定账：合规提示库 `categoryDescription` 37 条（`compliancePrompts.ts`、`canadianPiiCompliancePrompts.ts`、`insultsCompliancePrompts.ts`、`financialCompliancePrompts.ts`，与提示词语料同批显示，翻描述不翻语料没意义）、侧栏分组段名 `groupLabel` 5 条（`LeftnavMenuGroups.tsx` 的 "AI GATEWAY" 等是 `SECTION_DISPLAY` 的索引键，显示走 `nav.*`）、类型判别 `typeLabel` 4 条（`autoRouterTypeLabelKey`/`TYPE_LABEL_KEYS` 映射后渲染）、输入格式示例 `placeholder` 5 条（JSON 与工具名样例）、缩写 `text` 2 条（TopAgents 的 JS/Py）与 `shortLabel` 2 条（MTD/YTD）、代码示例入参 `inputMessage` 1 条（`modelDialogHelpers.ts` 生成示例用的 "Hello, how are you?"）
