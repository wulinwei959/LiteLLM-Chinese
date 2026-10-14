# 开发进度

数据快照 2026-10-14，分支 `main`。**汉化尚未完成**，剩余量见"## 汉化完成度实测"；目录规模、欠账清单与文件覆盖率随每次提交更新。最新的测试统计是第 18 簇后的一次全量（886 文件 11576 例、57 失败，无一在 `view_logs`，多出的三个文件单跑全绿），第 19 到 26 簇只复跑了 `view_logs` + `src/lib/i18n`（52 文件 671 例，第 25、26 簇未增删用例；第 20、21、22 簇另跑 `add_model`，均为 94 文件 1672 例），"批次 24：add_model 与 edit_auto_router"一节的 11576 例 / 54 失败是它的前一次，"### 修复后的复核"的 11308 例 / 1 失败与 `## 测试状态` 的表格都是更早的快照，保留用于对照起点

## 2026-10-14 第 26 簇更新

批次 24 第 26 簇：`components/view_logs/TraceView/` 剩的两个列表侧文件 `AgentTracesSection.tsx`、`RunDrawer.tsx` 接入 `logs`，新增 `logs.traceList.*` 9 键与 `logs.drawer.*` 5 键，两个消息目录各 +16 行、组末键补逗号 2 行，纯增不删

改造形态：

- `TraceHistoryError` 的 `useTranslations("logs")` 放在 `if (!history.error) return null;` 之前，hook 早于早退
- `RunsFooter` 里 `{count} {count === 1 ? "run" : "runs"}` 的手工单复数改回复用第 25 簇的 `traceList.runCount`（ICU `plural`），行为逐字不变
- 缩放 chip 的 `{A} to {B} ×` 走 `traceList.rangeTo`，`" ×"` 收进模板串末尾。若写成 `{t(...)}{" "}\n×`，JSX 折行会把两个字符拆成两个子节点、可读性更差
- `RunDrawer` 的 `HeaderButton` 是私有子组件，`label` 继续按字符串 props 传（同时喂 `aria-label` 和 `title`），文案在父组件里用 `t` 生成；`ResizeHandle` 自己调一次 hook
- `drawer.*` 与第 18、19 簇的 `LogDetailsDrawer` 同组，本簇的 5 个键都是"抽屉"面：`resizePanel` / `traceDetails` / `closeEsc` / `nextTrace` / `prevTrace`

不译与两处取舍：

- `RunDrawer` 头部的 `{index + 1} / {runs.length}` 是纯数字加分隔符的位置计数器，两种语言渲染一致，不接消息
- 缩放 chip 的 `"MMM DD, HH:mm"` 与 `{count} / {total}` 的 `×` 字形留在代码里，前者属第 23 簇起的日期格式欠账
- `TracingSetupCard.tsx` 留第 27 簇，本簇不动它的英文断言；`AgentTracesSection.test.tsx` 里 `RunView` 的测试替身输出 `run ${traceId}`，是被 mock 的详情侧文案，不属本簇断言面

测试同步：`AgentTracesSection.test.tsx` 改 12 处（`更新失败`、`正在更新…`、`已收到调用链。选择一个运行记录查看详情。`、`无法检查更早的调用链。History unavailable`、`重试调用链检查`、`调用链详情` 4 处、`下一个调用链（J）` / `上一个调用链（K）`、`${runs.length} 次运行`）；`RunDrawer.test.tsx` 改 3 处 `调用链详情`。两个文件用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView` 0 错误（7 条 warning 全在既有行）；`npm run build` 退出 0；prettier 改动的 4 个 tsx 全干净，两个 messages JSON 继续不做整文件重排

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 405 到 407，44.6%；`components/view_logs` 71 个里接入 49 个；`TraceView` 24 个里接入 19 个。键数 6351 到 6365，中英同值 85 不变

## 2026-10-14 第 25 簇更新

批次 24 第 25 簇：`components/view_logs/TraceView/` 的列表侧 6 个文件首次接入 `logs`——`AgentTracesTable.tsx`、`RunsToolbar.tsx`、`TimeRangeControls.tsx`、`TracesTimeline.tsx`、`StatusMark.tsx`、`TracePreview.tsx`，新增 `logs.traceList.*` 29 键与 `logs.timeRange.last6Hours` / `.last30Days` 2 键，两个消息目录各 +35 行、纯增不删

改造形态：

- `formatSpan` 与 `rangeLabel` 按首参翻译器约定改成 `formatSpan(t, ms)` / `rangeLabel(t, range)`，`LogsTranslator` 从 `lib/i18n/translators` 引入。两者的调用点都在组件里，直接传 `useTranslations("logs")` 的结果；`SelectionBracket`、`BucketTooltip` 是私有组件，各自调一次 hook
- 时长单位从模板拼接改成五条完整消息：`spanMinutes` / `spanHours` / `spanHoursMinutes` / `spanDays` / `spanDaysHours`。`"6h 12m"` 与 `"6 小时 12 分钟"` 的空格差异因此收进消息值，代码里不再写 `` `${h}h ${m}m` ``。这是第 24 簇 `trace.tokSuffix` 的同一口径
- `STATUS_ITEMS` 的 `label` → `labelKey` 配局部联合类型 `StatusLabelKey`，`RANGE_PRESETS` 同理配 `RangeLabelKey`。`RANGE_PRESETS` 原本是 `as const`，改成显式类型数组后导出面不变（只有本文件用）
- 复用已有键不新开：`columns.time` / `drawer.input` / `trace.factDuration` / `logs.cost`（四个表头）、`logs.success`（`StatusMark` 两处 aria）、`logs.allStatuses`（状态下拉的 `All status`，目录值本就是 `All Statuses`）、`logs.filterByStatus`（筛选 aria，目录值 `Filter by Status`）、`timeRange.lastHour` / `.last24Hours` / `.last7Days`（预设标签，目录值首字母大写）
- 单复数走 ICU `plural`：`traceList.runCount`、`traceList.errorCount` 英文写 `{count, plural, one {# run} other {# runs}}`，中文直接 `{count} 次运行` / `{count} 个错误`，沿用 `logs.realtime.turnCount` 的既有写法

不译与三处取舍：

- `Agents` / `Steps` / `Failed` 三个表头与 `trace.statSteps`（`steps`）、`trace.statFailed`（`failed`）、`trace.groupAgent`（`Agent`）、`filters.options.agent`（`Agent`）英文同词，但中文取值和语境都不同（列头 vs 详情侧统计 vs Span 类型），按第 24 簇的判定各开新键
- 时间格式串照旧不动：`RANGE_LABEL_FORMAT = "MMM D, h:mm A"`、`EDGE_FORMAT = "MMM DD, HH:mm"`、`"HH:mm"`，与第 23 簇的 moment 格式、第 24 簇的 `absoluteTime` 是同一笔欠账
- 本簇只收列表侧。`AgentTracesSection.tsx`（`Update failed` / `Updating…` / `{count} runs` / `Retry trace check`）与 `RunDrawer.tsx`（`Trace details` / `Close (Esc)` / `Next trace (J)`）留第 26 簇，`TracingSetupCard.tsx` 留第 27 簇。`TracePreview` 只被 `TracingSetupCard.tsx:741` 用，但它是列表侧口径的独立文件，本簇收；其测试只断言 `data-testid`，没有文案耦合
- `TracePreview` 的 `preview.name` / `preview.input_preview` 取自 `previewTrace.json` 示例数据，属数据值不译

测试同步：`TracesTimeline.test.ts` 加 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "logs" })`，`formatSpan` 5 条断言改中文（`45 分钟`、`6 小时 12 分钟`、`1 天`、`152 天 23 小时`、`0 分钟`）。`AgentTracesSection.test.tsx` 改 23 处：`无法加载运行记录：`（含那条正则）、`没有符合这些筛选条件的运行记录。` 4 处、`成本` / `智能体` 表头、`搜索运行记录`、`按智能体筛选` / `全部智能体`、`时间范围` 3 处、`重置缩放`、`实时`、`最近 7 天` / `最近 1 小时`、`总计 1 天` / `总计 7 天`、区间分隔正则 `/ to /` 改 `/ 至 /`、`getByLabelText("2 个错误")`。两个文件用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView` 0 错误（7 条 warning 全在既有行：`TraceDrawer` 的 `complexity` 23、`TracingSetupCard` 的 6 条 `<img>`）；`npm run build` 退出 0。prettier：8 个 tsx/ts 的折行已 `--write` 收掉；两个 messages JSON 被 `--write` 顺手折叠了 `chat.suggestions` 等 3 处与本簇无关的数组，已按 HEAD 原文重写、只保留本簇的插入，最终 diff 为 68 增 2 改

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 399 到 405，44.4%；`components/view_logs` 71 个里接入 47 个；`TraceView` 24 个里接入 17 个。键数 6320 到 6351，中英同值 85 不变

## 2026-10-14 第 24 簇更新

批次 24 第 24 簇：`components/view_logs/TraceView/` 的 run 详情侧 11 个文件首次接入 `logs`——`TraceDrawer.tsx`、`DetailPane.tsx`、`DetailContent.tsx`、`SpanTree.tsx`、`SpanHoverCard.tsx`、`MessageCard.tsx`、`RequestDetail.tsx`、`AttributesDetail.tsx`、`KeyValueRows.tsx`、`IdChip.tsx`、`CopyButton.tsx`，新增 `logs.trace.*` 108 键，两个消息目录各 +110 行（含 `trace` 组的开合括号）、纯增不删

改造形态：

- `agentHandoffText` 是纯函数，按首参翻译器约定改成 `agentHandoffText(t, traceId, spanId?, traceRef?)`，`LogsTranslator` 从 `lib/i18n/translators` 引入。两个调用点（`DetailPane` 的 span 页脚与分组页脚）和 `CopyForAgent` 都在组件里，直接传 `useTranslations("logs")` 的结果
- `CopyButton.tsx` 的 `label` / `copiedLabel` 由必填改可选，缺省在组件内部取 `trace.copy` / `trace.copied`。默认值不能在参数默认表达式里引用 `t`，所以两个值在函数体里用 `??` 解析
- 四张英文表换成键表加局部键联合类型：`ROLE_LABEL` → `ROLE_LABEL_KEYS`、`TYPE_LABEL` → `TYPE_LABEL_KEYS`、`ERROR_SOURCE_LABEL` → `ERROR_SOURCE_KEYS`、`TABS` 的 `label` → `labelKey`。`roleLabel(t, role)` 查不到键继续回落原值，未知角色不至于显示空白
- `DetailPane.tsx` 的 `TABS.map((t) => ...)` 参数改名 `tabItem`，否则遮蔽同文件新加的翻译器变量
- 复用已有键不新开：`drawer.copyTraceId`（原 `Copy trace ID`，英文目录值归一为 `Copy trace id`）、`drawer.input` / `drawer.output`（`Section` 的两个标题）、`logs.tokens` / `logs.cost` / `logs.success`

不译与一处取舍：

- 术语：`trace` 译调用链，`span` 保留 `Span` 原词（`span_id`、`Span 详情`、`{count} 个 Span`），`agent` 译智能体，`framework span` 译框架 Span。协议字段名（`trace_id`、`parent_span_id`、`request_id`、`gen_ai.*`）、`"—"` 缺值哨兵、`IdChip` 的 `ID` 字形、错误来源缺省值 `LiteLLM` 都是数据值，留在原处
- 语言相关的空格收进消息值：`trace.tokSuffix`（`" tok"` / `" 令牌"`）与五条键盘提示 `trace.kbdStep` / `.kbdTrace` / `.kbdMove` / `.kbdFold` / `.kbdClose`（`" step"` / `" 切换步骤"`），JSX 里 `<Kbd>` 与文字之间不再写 `{" "}`。这是第 23 簇 `tokenLabel` 的同一口径，英文逐字渲染不变
- 本簇只收 run 详情侧。列表侧（`AgentTracesPage` / `AgentTracesSection` / `AgentTracesTable`、`RunDrawer`、`RunsToolbar`、`TimeRangeControls`、`TracePreview`、`TracesTimeline`）与 `StatusMark.tsx` 留第 25 簇，`TracingSetupCard.tsx` 留第 26 簇。`StatusMark` 的 aria 被 `AgentTracesSection.test.tsx:240` 断言，和 `ActiveDot` / `TracePreview` 一样属于列表侧那一簇的测试耦合面，本簇不动，避免一次改两个目录的测试
- `SpanHoverCard` 的 `absoluteTime` 用 `new Intl.DateTimeFormat("en-US", ...)`，和第 23 簇的时间戳同一口径，等 `shared/table_cells` 那簇一起解决

测试同步：`TraceDrawer.test.tsx` 断言改中文 8 处（`时长 40.20s`、`步数 N`、`失败 N`、`按时间排序的 Span`、`返回运行列表`、`返回调用链列表`、`复制给智能体`、`命令已复制`），纯函数那两行给 `agentHandoffText` 补 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "logs" })`。`DetailPane.integration.test.tsx` 改 34 处：tab 与 region 名、`工具 · ValueError`、`分组详情` 的 `调用次数12` / `失败次数12`、`复制此步骤`、`展开 note` / `折叠 note`、hover 卡的 `时间` / `标签` / `开始` / `结束`。`MessageCard.test.tsx` 7 处断言改中文，并把裸 `render` 换成 `renderWithProviders`（该文件此前不套 Provider，接了 `useTranslations` 就必须在 Provider 下渲染）。三文件用例数不增不减，`Section` 用例照旧传 `title="Output"` 原值断言，因为那是 props 不是文案

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（9 条 warning 全在既有行：`TraceDrawer` 的 `complexity` 23、`TracingSetupCard` 的 6 条 `<img>`，两个 JSON 报"无匹配配置"属预期）；`npm run build` 退出 0；prettier 改动 14 个 tsx 在 HEAD 上全干净，本簇折行已 `--write` 收掉，两个 messages JSON 继续不做整文件重排。`lens` 目录顺带复跑：56 通过 1 失败，失败是 `LensSetup.integration.test.tsx` 找不到 `/2026-09-30/`，即本文件"批次 24"表里记的那条非 i18n 既有失败，与 `TraceView` 无关

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 388 到 399，43.7%；`components/view_logs` 71 个里接入 41 个；`TraceView` 24 个里接入 11 个。键数 6212 到 6320，中英同值 83 到 85（新增的 `trace.roleAssistant` 取 `AI`、`trace.typeLlm` 取 `LLM`）

技术债：`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是 `tsc` 增量构建产物，一直在库里，每次类型检查或 `npm run build` 都会脏一次、逼着提交前 `git checkout --`。本簇起加进 `.gitignore` 并 `git rm --cached` 脱离跟踪

## 2026-10-14 第 23 簇更新

批次 24 第 23 簇：`view_logs` 的审计日志族四个文件首次接入 `logs`——`AuditLogsPanel.tsx`、`AuditLogsTable.tsx`、`AuditLogsTableColumns.tsx`、`AuditLogDrawer/AuditLogDrawer.tsx`，新增 `logs.auditLogs.*` 45 键与 `logs.filters.placeholders.*` 3 键，两个消息目录各 +48 行、仍是纯增

改造形态：

- `getAuditLogsTableColumns` 的依赖对象加上 `t: LogsTranslator`，`AuditLogsTable.tsx` 的 `useMemo` 依赖跟着变成 `[onViewLog, t]`。列定义工厂里不调 `useTranslations`，这是 PLAN 定的写法（不复制 `ModelsTableColumns.tsx` 曾有过的 `react-hooks/rules-of-hooks` 豁免）
- `AUDIT_TABLE_NAME_DISPLAY` 换成 `AUDIT_TABLE_NAME_KEYS`（导出的键表，抽屉也在用）配 `auditTableNameLabel(t, name)`，`auditActionLabel` 改成首参翻译器并新增 `ACTION_LABEL_KEYS`。两者查不到键就渲染原值，动作那条继续保留原来"下划线换空格 + 首字母大写"的派生逻辑，后端新加动作时不至于显示空白
- 抽屉头部的 `StatusBadge` 原先直接渲染 `log.action` 原值（`updated`），与表内角标的 `Updated` 两套写法；本簇让它走同一个 `auditActionLabel(t, ...)`，两处语言一致
- 面板标题复用 `logs.tabs.auditLogs`，筛选标签复用 `logs.filters.teamId` / `.keyHash` / `.placeholders.enterKeyHash`，没有为同义文案另开键。新增的 `enterObjectId` / `enterUserId` / `enterTeamId` 挂进 `filters.placeholders` 组而不是审计组，请求日志筛选器后面能用
- 筛选抽屉标题沿用 `VirtualKeysTable`、`TeamsTable` 的写法：调用方传 `title={t("auditLogs.filters")}` / `description=`，不去改共享 `DataTableFilterDrawer` 的 `title = "Filters"` 默认值——那会一次动到七个调用点和它们的测试

不译与一处取舍：

- 时间戳。抽屉用 `moment.utc(...).format("MMM D, YYYY HH:mm:ss")`，表里的 `DateCell` 用 `shared/table_cells/date_cell.tsx` 的英文月份表，两处同源。单独把抽屉改成中文日期会和表内不一致，格式串留在原处，等汉化 `shared/table_cells` 那一簇一起解决
- `log.action`、`table_name`、`created` / `LiteLLM_VerificationToken` 这些后端原值是查表键和查询参数，一律不译；`LiteLLM_SomethingElse` 这类未映射值走原值回落，测试专门留着一条
- `ui/sheet.tsx` 的 `Close`、`ResizableSheetContent` 的 `Expand drawer` / `Collapse drawer` 属于 `ui/` 层，本簇不动，测试里 `/close/i`、`/expand drawer/i` 两处正则照旧命中
- `tokenLabel` / `spendLabel` / `maxBudgetLabel` 三个键把"冒号 + 空格"整段收进消息值：英文 `"Spend: "`、中文 `"花费："`，JSX 里 `</span>` 与值之间不再写 `{" "}`。这是第 20 簇 `routing.gapUnit` 前导空格的同一口径。渲染验证用一次性探针跑了两遍 `renderWithProviders(..., { locale: "en" })` / `"zh-CN"`，确认英文逐字仍是 `Spend: $1.000000`、中文是 `花费：$1.000000`，探针文件随即删除

测试同步：`AuditLogDrawer.test.tsx` 15 处裸 `render` 全换 `renderWithProviders`（含 prettier 折行后两处多行调用），断言改中文 12 处——`Details`→详情、`Table`→数据表、`Teams`→团队、`API Key (Hash)`→API 密钥（哈希）、`Before`/`After`→变更前/变更后、`N/A`→无、`Copy JSON`→复制 JSON、`No differing fields detected`→未检测到有差异的字段、角标 `updated`→已更新。`AuditLogsTable.test.tsx` 改 10 处，`AuditLogsPanel.test.tsx` 的 `TEXT_FILTERS` / `SELECT_FILTERS` 两张表驱动数据改 6 处。`Default Proxy Admin` 仍是英文——`common_components/DefaultProxyAdminTag.tsx` 没汉化

验证：审计族 3 文件 37 例全绿；`view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（10 条 warning 全在既有行：抽屉的 4 条 `Record<string, any>`、测试的 2 条 `no-node-access`、面板的 4 条长条件链/内联对象/`<img>`）；`npm run build` 退出 0。prettier：四个 tsx 在 HEAD 上都是干净的，本簇引入的折行已 `--write` 收掉；两个 messages JSON 在 HEAD 上就不干净，继续不做整文件重排

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 385 到 388，42.5%；`components/view_logs` 71 个里接入 30 个；抽屉目录 19 个里接入 17 个。审计族四个文件都在抽屉之外，`AuditLogsTableColumns.tsx` 因为只接 `t` 不调 hook，仍被 grep 口径的扫描脚本算作"未接入"。键数 6167 到 6212，中英同值 83 不变

顺带记一处漏网：`LogDetailsDrawer/LogDetailContent.tsx` 第 691 行附近的 `Request` / `Response` 两个 `TabsTrigger` 和 `label="Copy JSON"` 还是硬编码英文，是第 18、19 簇收抽屉时的遗漏，留给抽屉收口簇

## 2026-10-14 第 22 簇更新

批次 24 第 22 簇：`components/view_logs/ToolsSection/`（工具清单区，5 个非测试 `.tsx`）接入 `logs`，其中 4 个有展示文案（`ToolsSection.tsx`、`ToolItem.tsx`、`ToolExpandedContent.tsx`、`FormattedToolView.tsx`），新增 `logs.tools.*` 10 键，两个消息目录各 +10 行、纯增不删

改造形态：

- 四个组件都在自己内部 `useTranslations("logs")`。`ToolsSection` 与 `ToolItem`、`ToolExpandedContent` 的 hook 必须排在 `if (tools.length === 0) return null` 这类提前返回之前，`ToolsSection` 尤其注意，它是先算 `tools` 再返回的写法
- 摘要行 `2 provided, 1 called` 收进 `tools.summary`（`{provided}` / `{called}` 两个具名占位符），中文"提供 {provided} 个，调用 {called} 个"，不再拼字符串。`missingKeys` 与 `messagesParity` 的占位符契约要求两侧顶层参数名一致，所以中文没有改成"调用数 / 提供数"之类的别的名字
- 表头 `Type` 复用 `logs.columns.type`，头部 `Tools` 不复用 `logs.realtime.configRows.tools`——后者是实时会话配置行的标签，跨区复用会把两个语义不同的位置绑在一起

一处刻意的意译：`Parameters`（区块标签）与 `Parameter`（表头）在中文里本来同为"参数"，两者同树渲染会破坏 `getByText` 唯一性。表头那一列渲染的是参数名加必填星号，所以中文定作"参数名"（键 `tools.parameterName`），英文逐字保持 `Parameter`。这是第 20 簇"英文不同、中文同值"那条坑的预防性处理，不是同义键重复

不译的部分：`tool.name`、`tool.description`、`schema.type || "any"`、`schema.description || "-"`、tabs 的 `value="formatted"` / `value="json"`（是状态值不是文案）、`JsonToolView` 里重建请求体用的 `type: "function"` 与 `function` 字段名，全是 OpenAI 协议数据值。`tools.json` 的值 `JSON` 中英同值，同值键 82 到 83

测试同步：`ToolsSection.test.tsx` 7 例，5 处裸 `render` 换 `renderWithProviders`（`../../../../tests/test-utils`，与抽屉目录同深度）。中文断言 6 处：`工具`、`提供 2 个，调用 1 个`、`已调用` / `未调用`、`描述`。`isShown` 用的是 `queryAllByText` 精确匹配，`已调用` 与 `未调用` 互不包含，不像英文 `called` 那样需要防 `not called` 的子串问题；`/alpha, beta/` 与 `/1\. get_weather/` 是喂进去的工具名数据，不动

验证：`ToolsSection` + `src/lib/i18n` 5 文件 35 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿（与第 21 簇同数，用例不增不减）；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条、改动文件 0 条；`npx eslint` 改动文件 0 错误（2 条 warning 为既有 `no-explicit-any` 与 `no-node-access`）；`npm run build` 退出 0；`prettier --check` 对改动 `.tsx` 全绿，两个消息文件仍失败——用 `git show HEAD:./<path>` 落到仓库内临时目录复测确认基线同样失败（是别处的数组折行问题），本簇不夹带整体重排。全量分片未跑

覆盖率复测：两侧叶子键 6157 到 6167；非测试 `.tsx` 912 个不变，已接入 381 到 385，42.2%；`components/view_logs` 71 个里接入 23 到 27 个，目录里剩余带展示文案的集中在 `GuardrailViewer/`、`TraceView/`、`AuditLogDrawer/` 三个子目录与 `RequestLogsPanel.tsx`、`EvalViewer.tsx`、`CostBreakdownViewer.tsx`、`VectorStoreViewer.tsx` 几个根文件

## 2026-10-14 第 21 簇更新

批次 24 第 21 簇：`LogDetailsDrawer/RealtimePrettyView.tsx`（OpenAI Realtime API 的会话视图，494 行）接入 `logs`，新增 `logs.realtime.*` 16 键（8 个展示句 + `configRows` 8 个标签），两个消息目录各 +20 行、纯增不删。抽屉目录最后一个有硬编码英文的文件收掉，`LogDetailsDrawer/` 至此只剩 `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 两个第 19 簇确认过"没有可展示文案"的文件

改造形态：

- 组件本体、`SessionCard`、`ResponseTurn` 三处各自 `useTranslations("logs")`，都在条件返回之前，沿用第 18 簇抽屉内部组件直接挂 hook 的做法，不走 props
- 七行 `ConfigRow` 的标签收进 `realtime.configRows.*`，头部那个 `Session` 复用第 18 簇已有的 `drawer.session`，没有为同一个词开第二个键
- `TokenBreakdown` 原来收 `label="Input"` 再在组件内拼 `` `${label} Token Breakdown` ``。中英是"定语 + 中心词"与"中心词在后"两种顺序（`输入令牌明细`），拼串在中文里不成立，改成调用点传整句 `title={t("realtime.inputTokenBreakdown")}`，prop 一并改名
- `turnCount` 走 ICU 复数 `{count, plural, one {# turn} other {# turns}}`，中文退化成 `{count} 轮`；替掉原来的 `{turnCount} {turnCount === 1 ? "turn" : "turns"}` 手拼

不译的部分：`session.model`、`session.voice`、`modalities` 的 `audio` / `text`、`turn_detection.type`、`response.status`、`output.role`（协议角色，与第 19 簇记的 `label="ASSISTANT"` 同源）都是后端读回来的数据值；`formatTokenLabel` 派生出的 `Cache Creation` / `Cache Read` 是上游 token detail 的字段名，加了一条注释说明为什么保留原拼写。中英同值键仍为 82，本簇没有新增同值键

测试同步：本文件 27 例，中文断言 9 处（`会话`、`2 轮` / `1 轮`、`输入 116 / 输出 46 令牌`、`温度`、`指令`、`输入音频格式`、`未发现可识别的实时事件`）。跨目录又抓到一处：`PrettyMessagesView.test.tsx:64` 的 `getByText("Session")` 是被本簇组件渲染出去的，改成 `会话`——第 14 簇记的"只跑本目录会漏掉跨目录断言"第三次应验，判断范围要顺着渲染树走到 `PrettyMessagesView` 那一层

验证：`RealtimePrettyView` 单文件 27 例、`PrettyMessagesView` 11 例、`messagesParity` 8 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条、改动文件 0 条；`npx eslint` 改动文件 0 错误（15 条 warning 全是该文件既有的 `no-explicit-any` 与 `no-long-condition-chain`，不在本簇新增行上）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：两侧叶子键 6141 到 6157；非测试 `.tsx` 912 个不变，已接入 380 到 381，41.8%；`components/view_logs` 71 个里接入 23 个；抽屉目录 19 个里接入 17 个，展示文案清零


## 2026-10-14 第 20 簇更新

批次 24 第 20 簇：`LogDetailsDrawer/RoutingDecisionCard.tsx`（自动路由决策卡，368 行）接入 `logs`，新增 `logs.routing.*` 75 键，按 `routerTypes` / `bands` / `rows` / `sections` / `causes` / `planMode` / `housekeeping` / `escalation` 分组，两个消息目录各 +93 行、仍是纯增

改造形态：

- 六个纯函数（`describeScoreAgainstBoundaries`、`describePlanModeFloor`、`describeHousekeeping`、`describeReasoningOverride`、`describeCause`、`describeEscalation`）一律改成首参翻译器 `t: LogsTranslator`，沿用第 14 簇起的约定；`Row`、`PercentageRow`、`CapabilityForecast`、`FuseV2Forecast` 与卡片本体自己在组件里 `useTranslations("logs")`，hook 必须写在 `if (!decision || !decision.cause) return null` 之前
- `ROUTER_TYPE_LABELS` 与 `CONSTANT_CAUSE_LABELS` 两张英文值表换成 `ROUTER_TYPE_LABEL_KEYS` / `CONSTANT_CAUSE_LABEL_KEYS` 两张键表，配 `RoutingRouterTypeKey`、`RoutingCauseKey` 两个联合类型（照第 16 簇 `LogsErrorCodeKey` 的写法）。后端的 `router_type`、`cause` 原值是查表用的键、本身不显示；查不到就渲染原值，连原值都没有才落 `routing.causes.unknown`

不译的部分：档位 id（`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING` 以及运营者改名的 `SECURITY_REVIEW` 之类）、`signals`、`request_type`、`classifier_model`、校准版本、`matched_keyword` 哨兵、`exit_plan_mode` 工具名，全是运营者在路由配置里读写的数据值；`Auto-Router v2` 与 `FUSE v2` 是产品名/缩写，中英同值，同值键 80 到 82。`routing.gapUnit` 是"数值 + 单位"而不是整句，所以继续拼接：英文逐字保留前导空格 `" percentage points"`，中文用"个百分点"

ICU 里的一处取舍：`reasoningOverride` 的 `{floor}` 既可能是数字，也可能是"简单档与中等档的分界"这段中文，照英文那样在占位符前留空格会渲染出"得分不低于 简单档…"。中文键去掉这个空格，英文键逐字不动

测试同步：本文件 46 例，裸 `render` 全部换 `renderWithProviders`（`vi.mock("lucide-react")` 只替掉 `Waypoints`，provider 树不受影响）。英文原文那句"排除任意档位区间"的负断言 `/below|to 0|at or above/` 不能逐词换成中文——中文档位区间写"低于"，而覆盖说明"得分不低于……"里含同样的两个字，会自己命中自己；改成按形状判断的 `bandShape = /^\((?:低于|达到或超过|[\d.]+ 到)/`，注释里写明了原因。跨目录又抓到一处：`add_model/JevConnectionTest.integration.test.tsx` 的 `findByText("JEV classifier")` 改 `JEV 分类器`，第 14 簇记的"只跑本目录会漏掉跨目录断言"再次应验；同文件 152 行的 `JEV classifier unavailable` 是后端 `detail` 原文，不动。顺手用 prettier 收了该文件里第 20 簇之前就存在的一处三元折行

验证：`RoutingDecisionCard` 单文件 46 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（卡片函数 `complexity 23` 的 warning 在 HEAD 上就是 23，不是本簇新增）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 379 到 380，41.7%；`components/view_logs` 71 个里接入 22 个；抽屉目录 19 个里接入 16 个，还有硬编码英文的只剩 `RealtimePrettyView.tsx`（494 行）；键数 6066 到 6141

## 2026-10-14 第 19 簇更新

批次 24 第 19 簇：抽屉的卡片层。`InputCard.tsx`、`OutputCard.tsx`、`SimpleToolCallBlock.tsx`、`ClassifierAuditView.tsx` 四个文件首次接入 `logs`，新增 `logs.cards.*` 4 键与 `logs.classifierAudit.*` 8 键，两个目录文件各 +16 行、纯增不删

处理决定：

- `toast.success("Input copied")` / `("Output copied")` 收进 `cards.inputCopied` / `.outputCopied`，`OutputCard` 的空占位收进 `cards.noResponseData`。这三处是渲染出去的文案，没有哨兵问题
- `SimpleToolCallBlock` 的 `function` 角标译成"函数"；同一文件里 `role: "function"`、`type: "function"` 这类 OpenAI 协议枚举是数据值，一律保持英文，测试里 `getByText("function")` 只有角标那一处改中文
- `ClassifierAuditView` 的三块 `Card` 用 `aria-label={title}` 暴露成 `region`，标题走 `classifierAudit.*Title`，`LogDetailContent.integration.test.tsx` 里 `getByRole("region", { name })` 的三条断言跟着换成中文名。复制按钮复用第 18 簇的 `drawer.copyLabel`（`复制 {label}`），没有为 `Copy ${title}` 新开重复键；`AuditField` 是个内部组件，自己 `useTranslations("logs")`
- `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 翻过一遍没有可展示文案（角色标签由调用方传 `label="ASSISTANT"` 这类协议角色名，原样渲染），本簇不动，抽屉目录里它们仍归在"未接入"计数中

测试同步：`ClassifierAuditView.test.tsx`、`SimpleToolCallBlock.test.tsx`、`SimpleMessageBlock.test.tsx` 的裸 `render` 换 `renderWithProviders`——前两者因为组件接了 hook，第三者没有 hook 但它渲染 `SimpleToolCallBlock`，整树必须有 provider。断言改动共 12 处：`暂无响应数据`（`OutputCard` 2 + `PrettyMessagesView` 4）、`函数`、三个 region 名、`未留档，或消息日志已关闭`、截断 `status` 的文本、复制按钮可访问名 `复制 分类器输入`；`classification rubric` / `source-only` / `a greeting` 是喂进去的测试数据，不动。顺手把第 15 簇遗留的 `LogDetailContent.integration.test.tsx` 三处超长 `renderWithProviders(...)` 按 prettier 折行，该文件此前 `format:check` 不过

验证：抽屉目录 19 文件 232 例全绿；`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（10 条 `testing-library/no-node-access` 与 `no-large-inline-object-arg` warning 都在既有行）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 375 到 379（本簇 +4），41.6%。抽屉目录 19 个非测试 `.tsx` 接入 15 个，真正还有硬编码英文的只剩 `RealtimePrettyView.tsx`（494 行）与 `RoutingDecisionCard.tsx`（368 行）

## 2026-10-14 第 18 簇更新

批次 24 第 18 簇：`LogDetailsDrawer/` 的抽屉外壳与 9 个叶子组件接入 `logs` 命名空间——`LogDetailsDrawer.tsx`、`DrawerHeader.tsx`、`SectionHeader.tsx`、`SidebarToggle.tsx`、`ClassifyTag.tsx`、`CollapsibleMessage.tsx`、`HistoryTree.tsx`、`JsonViewer.tsx`、`TruncatedValue.tsx`、`TokenFlow.tsx`，新增 `logs.drawer.*` 32 键。这些组件全都在抽屉树内部渲染、已经在 `NextIntlClientProvider` 之下，一律直接 `useTranslations("logs")`，不用走 props

几个处理决定：

- 侧栏的会话构成复用第 17 簇的 `logs.cells.sessionSummaryLlm` / `.sessionSummaryAgent` / `.sessionSummaryMcp`。原来是 `[" LLM", " Agent", " MCP"][i]` 这种"数字 + 英文后缀"的拼串，现在三类计数收进 `sessionSummaryCounts` 常量表，渲染走 `{count}` 插值，中英都不再拼字符串
- `CopyableId` 的可访问名做成整句插值 `drawer.copyLabel`（`复制 {label}`），`label` 传 `t("columns.requestId")`。同一行里可见的 `x-litellm-call-id:` 是 HTTP 头名，原样保留不译
- `environment = metadata?.user_api_key_team_alias || "default"` 与 `metadata.status === "failure"` 一样是拿来和后端值比对的哨兵/数据默认值，保持英文，只有渲染出去的 `Env: {environment}` 徽标和状态 label 中文化
- `drawer.history` 用 ICU 复数（`{count, plural, one {# message} other {# messages}}`，中文统一"历史（{count} 条消息）"），替掉原来的 `message{messages.length !== 1 ? "s" : ""}` 手拼；目录里已有 `overrideCount` 这种复数键，写法不新

测试同步：抽屉叶子组件从此刻起需要 i18n 上下文，13 个测试文件的裸 `render` 换成 `renderWithProviders`（`InputCard` / `OutputCard` / `RealtimePrettyView` 是第 19 簇的文件，但它们渲染 `SectionHeader`，本簇被间接带进来，一并换掉），断言改中文约 40 处：`Classify`→分类、`(5 chars)`→（5 字符）、`No data`→暂无数据、`HISTORY (3 messages)`→历史（3 条消息）、`Tokens:`/`Cost: $`/`Turns:`→令牌：/成本：$/轮次：、`Copy output`→复制输出、`Expand trace sidebar`→展开调用链侧栏、`Copy Request ID`→复制 请求 ID、`Start time`/`Duration`→开始时间/耗时。`SectionHeader` 那条 `{ name: /copy/i }` 改成具体的 `复制输入`——正则 `copy` 在中文下永不命中，而按钮本来就有确定的可访问名

验证：`src/components/view_logs` + `src/lib/i18n` + `tests/i18n` 52 文件 671 例全绿（用例数不增不减，只换渲染方式与断言文案）；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs` 0 错误、warning 数不变；`npm run build` 退出 0。这次跑了一次全量：886 文件 11576 例，57 例失败分布在 18 个文件，**没有一个在 `view_logs`**；比"批次 24"那张 17 文件的旧表多出的 `add_auto_router_tab.integration` / `edit_auto_router_modal.integration` / `user_agent_activity` 三个文件单跑全绿（160 例 + 7 例），属并发时序假红，与本次改动无关。`tests/e2e/ui/tests/logs/logs.spec.ts:236` 的 `getByLabel("Expand trace sidebar")` 不用动——英文目录值逐字未改，英文 locale 下的 e2e 照旧命中

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 365 到 375（本簇 +10），覆盖率 41.1%。`view_logs/LogDetailsDrawer/` 19 个非测试 `.tsx` 里接入 11 个，此前只有 `LogDetailContent.tsx`

目录规模复测：两侧叶子键各 6054（本簇 +34，含第 17 簇未记的 2 条 `columns`/`cells` 补数口径差），中英文取值完全相同的键 78 到 80——第 17 簇的 `logs.cells.sessionSummaryLlm` 与 `.sessionSummaryMcp` 中英同值（`{count} LLM` / `{count} MCP`，缩写不译），当时漏记，本次一并计入

## 2026-10-14 第 17 簇更新

批次 24 第 17 簇：`view_logs/RequestLogsTableColumns.tsx` 的 16 个列头与 11 条单元格文案接入 `logs` 命名空间，新增 `logs.columns.*` 8 键与 `logs.cells.*` 11 键，另外 8 个列头复用已有键（`logs.status` / `logs.model` / `logs.cost` / `logs.tokens` / `logs.filters.sessionId` / `.keyHash` / `.keyAlias` / `.endUser`），英文值与列头原文逐字相同，不新开重复键。`RequestIdWithCallIdTooltip` 是个组件，直接用 `useTranslations("logs")`；列工厂 `getRequestLogsTableColumns` 走依赖对象，照 `getAvailableTeamsTableColumns` 的写法把 `t: LogsTranslator` 加进 `RequestLogsTableColumnsDeps`，调用点 `RequestLogsTable.tsx` 传已有的 `t`

带参数的文案一律做成整句插值，不做中英拼接：`{successful}/{total} succeeded`、`{failed} of {total} batch requests failed`、`incl. {spend} from {count} MCP`、会话构成 tooltip 的 `{count} LLM` / `{count} Agent` / `{count} MCP` / `{count} cache hit`（中文里 `LLM` 与 `MCP` 是缩写不动，`Agent` 与 `cache hit` 译作"智能体""次缓存命中"）。`status` 单元格里的 `|| "Success"` 是用来和后端值比对的哨兵，不是展示文案，保持英文；只有渲染出去的 label 改成 `t("success")` / `t("failure")`

测试同步：`RequestLogsTableColumns.test.tsx` 顶部按 `logs_utils.test.tsx` 的做法建 `createTranslator({ locale: "zh-CN", namespace: "logs" })` 塞进 `noopDeps`，两个测试内联的 `deps` 改成展开 `noopDeps`；`session total` / `batch cost` / `Success` / `Failure` / `2/3 succeeded` / `1 of 3 batch requests failed` / 复制按钮的可访问名共 14 处断言改中文，`2 LLM • 1 MCP` 中英同值不动。`index.test.tsx`、`index.integration.test.tsx`、`log_filter_logic.test.tsx` 里的 `Internal User` 是角色名不是列头，没动

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（`<img>` 与两处 `no-large-inline-object-arg` warning 是既有行，本簇没有新增 warning）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 364 到 365（本簇 +1，`RequestLogsTableColumns.tsx` 首次接入），覆盖率 40.0%

## 2026-10-14 第 16 簇更新

批次 24 第 16 簇：`view_logs/constants.ts` 的 `ERROR_CODE_OPTIONS` 从 `{ label, value }` 改成 `{ labelKey, value }`，类型收成 `LogsErrorCodeKey` 联合，新增 `logs.filters.errorCodes.code400` 到 `code529` 共 11 键。中文值保留 `429 - ` 这样的数字前缀，只翻译后半个词，这样 `ErrorCodeFilterField` 里按 `option.label.toLowerCase()` 做子串过滤的逻辑一行都不用改——用户输 `429` 在两种语言下都能命中

`RequestLogsFilters.tsx` 的 `ErrorCodeFilterField` 先用 `useMemo` 把键表铺成 `SearchSelectOption`（`localizedOptions`），过滤、已知码判断与 `selected` 回显都改读这张表；自定义码分支（`filters.useCustomCode`）本来就是中文，不变。本簇没有新增接入 `next-intl` 的文件

验证：`src/components/view_logs` 49 文件 655 例全绿（`RequestLogsFilters.test.tsx` 39 例，两条选项名断言改 `429 - 触发限流`，`ERROR_CODE_OPTIONS.length` 那条照旧成立），i18n 三条守卫 16 例通过；`tsc --noEmit -p .` 仍 883 条、全在测试文件，非测试 0 条；`npx eslint` 改动文件 0 错误；`npm run build` 退出 0。全量分片未跑。覆盖率 912 / 364（39.9%）不变

## 2026-10-14 第 15 簇更新

批次 24 第 15 簇：`TypeBadges.tsx` 四个徽标改用 `useTranslations("logs")` 读第 13 簇的 `logs.filters.options.llm` / `.agent` / `.mcp` / `.batch`，没有新增键。`RequestLogsTable.tsx` 的 `formatFilterValue` 改成首参翻译器（照 `BudgetTable.tsx` 的写法），`LogDetailContent.tsx` 的凭据行同批接上 `filters.options.clientOAuthToken` / `.configuredKey`。`constants.ts` 里两张英文表 `SPAN_TYPE_LABELS` 与 `CREDENTIAL_LABELS` 删除，换成 `SPAN_TYPE_LABEL_KEYS` 与 `CREDENTIAL_LABEL_KEYS` 两个键表（`Readonly<Record<string, 键联合类型>>`），全仓无残留引用

徽标接了 hook，`TypeBadges.test.tsx`、`RequestLogsTableColumns.test.tsx` 的裸 `render` 换成 `renderWithProviders`，`LogDetailContent.integration.test.tsx` 50 处同换；`Agent` / `Batch` 与凭据两条断言改中文（`LLM` 与 `MCP` 是缩写，中英同值，断言不动）

验证：`src/components/view_logs` 49 文件 655 例全绿，i18n 守卫 16 例通过；`tsc --noEmit -p .` 仍 883 条、全在测试文件（其中 `LogDetailContent.integration.test.tsx` 321/322 两条 `TS2769` 是既有行，不是本簇引入），非测试文件 0 条；`npx eslint` 改动文件 0 错误；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 361 到 364（本簇 +3），覆盖率 39.9%。`components/view_logs` 71 个非测试 `.tsx` 里接入 7 个

## 2026-10-14 第 14 簇更新

批次 24 第 14 簇：`src/components/view_logs/LogsTableToolbar.tsx` 加同文件的 `LiveTailBanner` 接入 `logs` 命名空间，新增 `logs.toolbar.*` 7 键与 `logs.timeRange.*` 7 键

时间区间标签有两个来源：`constants.ts` 的 `QUICK_SELECT_OPTIONS`（下拉里的 6 项）与 `logs_utils.tsx` 的 `getTimeRangeDisplay`（触发按钮上的当前区间）。两边 5 条同文，只有 1 分钟那条英文本来就分叉（`Last Minute` 与 `Last 1 Minute`），按"英语原文逐字不动"各留一键（`timeRange.lastMinute` 与 `timeRange.lastOneMinute`），中文都写"最近 1 分钟"。两处共用同一组键，下拉与按钮不会说出两种话

`QUICK_SELECT_OPTIONS` 的 `label` 换成 `labelKey`，类型收成 `LogsTimeRangeKey` 联合，标签在组件内用 `useMemo` 配 `t` 生成，与第 13 簇的四张筛选标签表同一写法。`getTimeRangeDisplay` 是纯函数，改成首参翻译器约定（`LogsTranslator`，`translators.ts` 新增），全仓只有一个调用点

测试同步：`logs_utils.test.tsx` 用 `createTranslator({ locale: "zh-CN", namespace: "logs" })` 断言中文返回值，沿用 `GuardrailsMonitor/usageUnits.test.ts` 的做法；`RequestLogsPanel.test.tsx` 8 处按钮与开关的可访问名改中文。日期区间串（`MMM D - MMM D`）是格式化结果不是文案，两条断言不动

验证：`src/components/view_logs` 49 个文件 655 例全绿，i18n 三条守卫 16 例通过；`npx tsc --noEmit -p .` 883 条错误，非测试文件 0 条，本簇文件 0 条；`npx eslint` 对改动文件 0 错误（`RequestLogsPanel.test.tsx` 6 条 warning 是既有行号，与本簇无关）；`npm run build` 退出 0。全量分片未跑

顺带更正一条：`CREDENTIAL_LABELS` 的消费方不止 `LogDetailContent.tsx`，`RequestLogsTable.tsx:44` 也在用。它要等第 15 簇（`SPAN_TYPE_LABELS` 与它在同一个文件里消费）才能删，第 13 簇那节的说法过时了

## 2026-10-14 更新

批次 24 第 13 簇：`src/components/view_logs/RequestLogsFilters.tsx`（请求日志筛选面板的 14 个筛选字段）接入 `logs` 命名空间，新增 41 个 `logs.filters.*` 键，同时复用已有的 `logs.status`、`logs.model`、`logs.allStatuses`、`logs.success`、`logs.failure`。没有借其他命名空间的同名键，`ARCHITECTURE.md` 记着跨命名空间借键是历史 bug 族

四个模块作用域的标签表（`STATUS_FILTER_ITEMS`、`CACHE_FILTER_ITEMS`、`CREDENTIAL_FILTER_ITEMS`、`SPAN_TYPE_FILTER_ITEMS`）改成组件内的 `useMemo`，依赖数组带 `t`，与 `VirtualKeysTable.tsx` 的既有写法一致。`CREDENTIAL_FILTER_ITEMS` 原本从 `constants.ts` 的 `CREDENTIAL_LABELS` 展开，现在直接写 `"true"` / `"false"` 两个字面量值。（本节当时记"`CREDENTIAL_LABELS` 只剩 `LogDetailContent.tsx` 一个消费方"不准，`RequestLogsTable.tsx` 也在用，见上一节的更正）

翻译边界：Span Type 的四个取值按散文翻（`Agent` 智能体、`Batch` 批处理），`LLM` 与 `MCP` 是缩写、两侧同值。这与第 12 簇"连通性测试对话框的前缀标签按标识符保留"不冲突，那条是紧邻模型名的诊断输出，这条是筛选下拉里给人点的选项。同一批词在 `TypeBadges.tsx` 与 `SPAN_TYPE_LABELS` 里必须沿用同一套键，否则筛选下拉写"智能体"而表格徽标写"Agent"

测试同步：`RequestLogsFilters.test.tsx` 39 例的标签、占位符与选项断言改中文。顺带清掉了"批次 24"那张 16 文件失败表里的 `view_logs/index.test.tsx`（第 75 行还停在 `Request Logs`，同文件上面几行早已中文化），该文件 14 例全绿

e2e 侧有 8 处按 placeholder 文本或 combobox 可访问名寻址这些筛选器，分布在 3 个 spec，已同步中文：`logs.spec.ts` 1 处、`logsFilters.spec.ts` 5 处、`logsPagination.spec.ts` 2 处。这 8 处**没有跑过**，Playwright 需要活代理与真实数据，本机只做了字符串替换

验证：i18n 三条守卫 16 例通过；`RequestLogsFilters.test.tsx` 加 `src/lib/i18n/` 共 55 例通过；view_logs 相邻 6 个文件 149 例通过，合计 204 例全绿。`npx tsc --noEmit -p .` 883 条错误、58 个文件，非测试文件 0 条，本簇文件 0 条。`npx eslint` 对改动的 `.tsx` 无输出。`npm run build` 退出 0。没有跑全量分片，54 例基线失败里只有 `view_logs/index.test.tsx` 这 1 例被清，其余 53 例本簇未触碰

### 复测的三个数字

覆盖率命令（在 `ui/litellm-dashboard` 下执行）

```
find src -name "*.tsx" -not -name "*.test.tsx" | wc -l
grep -rl "useTranslations(\|getTranslations(" --include="*.tsx" src | grep -v "\.test\.tsx" | wc -l
```

2026-10-14 第 15 簇后实测：非测试 `.tsx` 共 912 个，已接入 364 个，覆盖率 39.9%。同日第 14 簇后是 912 / 361（39.6%）、第 13 簇后 912 / 360（39.5%），此前记的 861 / 305 复现不出来，那条没写命令，两个数都对不上今天这个口径，所以并列记录，不要拿 39.9% 减 35.4% 当进度

目录规模同步复测：命名空间 39 个不变，两侧叶子键各 5992（第 13 簇后是 5978，本簇加 14 键；10-13 记的 5228 是第 5 到 12 簇补键之前的数），中英文取值完全相同的键 78 个，第 13 簇贡献 `logs.filters.options.llm` 与 `.mcp` 两个，本簇的 `timeRange.lastMinute` 与 `.lastOneMinute` 中文同值但英文不同，不计入

启发式扫描的非测试源文件基数也变了：`.tsx` 加 `.ts` 共 1302 个（10-13 记 1232），差的是上游 v1.105.0 同步带进来的文件

## 2026-10-13 更新

- **已合并至 `main`**：同步上游 v1.105.0 的 UI 交集文件，包含中文汉化完成的代码
- **修复构建阻断**：`ModelsTableColumns.tsx` 的 `"use client"` 指令移至文件顶部（Next.js App Router 要求），修复 Docker 构建编译错误
- **测试状态**：下面这条是 `507e347` 附近的旧快照（11308 个用例，11307 通过，1 失败）；批次 24 收口后实测为 11576 用例、11513 通过、54 失败，失败清单与归类见"批次 24：add_model 与 edit_auto_router"一节。唯一的非 i18n 既有失败仍是 `mcp_server_edit.test.tsx` 的 OAuth 恢复用例
- **类型检查**：非测试文件 0 错误，`npm run build` 绿色
- **i18n 守卫**：三条全部通过（16 个用例）
- **Lint**：36 个预存错误（全部为代码库原有，非新增）

### 批次 24：add_model 与 edit_auto_router

本轮把 `src/components/add_model` 与 `src/components/edit_auto_router` 接入 next-intl，按簇提交（`bed5b6c6`、`fc057e2f`、`63c381eb` 等）。覆盖面：路由测试与连接测试对话框、`RouterConfigBuilder` 的路线树、`add_auto_router_tab` 新建表单（预设选择器、名称/团队/访问组、三个操作按钮、提交前连通性测试）、层级显示名与层级配置面板、以及 `build_complexity_router_config` 的整套校验错误族

校验错误族统一改成首参翻译器约定（`getTierLabelsError(t, ...)`、`getMissingTiersError(t, ...)`、`getSemanticConfigError(t, {...})` 等），`TierRestriction.reason` 改成 `reasonKey`，`getSubmitBlockedReason` 与 `handleAddAutoRouterSubmit` 因 `max-params: 4` 上限改成对象入参。`build_complexity_router_config` 的去重基线刻意保留英文规范名（`TIER_DESCRIPTIONS[tier].label`），只把渲染面翻成中文

收口复扫时补掉五处残留硬编码（`63c381eb`）：`serializeRouterConfig` 的无模型路由 throw（新增 `routerRouteModelRequired`）、`edit_auto_router_modal` 第二处保存成功 toast（漏改的 `editModalSaved`）、`auto_router_connection_test` 的 `Jev connection` aria-label（`connJevStatusLabel`）、`cache_control_settings` 角色下拉的 `None`（`cacheControlNone`）、`handle_add_model_submit` 两处解析错误 throw（改用 `failedParseExtraParams`）

非测试源文件里还剩两处未接入，都不产生可见英文：`TierRowSelect.tsx` 是纯展示组件，文案全部由 props 传入；`add_model_modes.tsx` 的 `AUTO_ROUTER_MODES` 全仓无引用，是死代码。连通性测试结果对话框里每条目标的前缀标签（`SIMPLE`、`Default`、`Embedding`、`Classifier`）仍是原始标识符，与紧邻的模型名 `gpt-4o-mini` 一样属于诊断面，本轮按标识符保留

验证：目录级 45 文件 1174 用例全绿，i18n 守卫 16 例通过，非测试文件 tsc 0 错误，eslint 0 错误（新增的 `local/no-large-inline-object-arg` 已通过提取具名变量消除），`npm run build` 退出 0

批次 24 收口后又跑了一次四片全量（串行，`--shard=k/4`）：11576 用例，11513 通过，54 失败，分布在 17 个文件。逐文件单跑后只有 1 个文件是本批造成的，其余与本批无关。本批的那一个是 `models-and-endpoints/panels/AddModelPanel.integration.test.tsx`：第 1 簇把 `advanced_settings.tsx` 的标签翻成中文后，该文件里 6 处断言仍停在 `LiteLLM Params` 与 `Please enter at least one model.`。已在该文件把 6 处 `getByLabelText("LiteLLM Params")` 改成 `LiteLLM 参数`、`Please enter at least one model.` 改成 `请至少选择一个模型。`，17 例全绿

其余 16 个文件不是本批的账，单跑均稳定失败，逐条如下（错误信息取单跑首条）：

| 文件 | 首条错误 | 归类 |
| ---- | -------- | ---- |
| `guardrails/_components/add_guardrail_form.decision_model.integration.test.tsx` | 找不到标签 `Guardrail Name` | 第六类，guardrails 批次遗留 |
| `guardrails/_components/guardrail_info.test.tsx` | `Guardrail stale-id not found` | 非 i18n，取值/mock 问题 |
| `guardrails/_components/guardrail_garden_detail.test.tsx` | 找不到行 `Provider Decision Model` | 第六类 |
| `agents/_components/AgentsTable.test.tsx` | 找不到列头 `Spend (USD)` | 第六类 |
| `agents/_components/add_agent_form.integration.test.tsx` | 找不到标签 `Agent Name` | 第六类 |
| `agents/_components/agent_info.integration.test.tsx` | 找不到标签 `Agent Name` | 第六类 |
| `agents/_components/agent_info.test.tsx` | 找不到按钮 `Edit Settings` | 第六类 |
| `access-groups/.../AccessGroupEditModal.integration.test.tsx` | 找不到 tab `/MCP Servers/` | 第六类 |
| `access-groups/.../AccessGroupCreateDialog.test.tsx` | 找不到标签 `Group Name` | 第六类 |
| `model_add/CredentialModal.test.tsx` | `useTranslations` 上下文缺失 | 第一类，测试缺 `NextIntlClientProvider` |
| `view_logs/index.test.tsx` | 找不到 tab `Request Logs` | 第六类，2026-10-14 第 13 簇已修 |
| `organizations/_components/OrganizationsTable.test.tsx` | 找不到文本 `创建时间` | 需复查：断言已中文化但组件未渲染中文表头，或渲染路径不同 |
| `shared/DataTable/DataTable.test.tsx` | `render is not defined` | 非 i18n，测试缺 import |
| `mcp-servers/_components/mcp_server_edit.test.tsx` | 取值失败 | 非 i18n，既有技术债（见 `FIXES.md`） |
| `UsagePage/components/KeyActivityPanel.integration.test.tsx` | 重试行为 | 非 i18n，疑似时序 |
| `lens/_components/LensSetup.integration.test.tsx` | 找不到日期 `/2026-09-30/` | 非 i18n，日期/数据 |

这些失败此前被各批次各自的"只跑本目录"验证漏掉，且 `PROGRESS.md` 顶部"1 失败"的旧快照是更早提交上的数字，已经过时。修一批就跨目录复跑一次全量，或至少把改动文件的下游消费方一起跑，才能及时抓到这一类

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                       | 数值                                                 |
| ------------------------ | ---------------------------------------------------- |
| 命名空间                 | 39                                                   |
| `en.json` 叶子键          | 6365（2026-10-14 第 26 簇；6351 是第 25 簇后，6320 是第 24 簇后，6212 是第 23 簇后，6141 那条是第 20 簇后的旧快照）|
| `zh-CN.json` 叶子键       | 6365                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 85（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 85 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%（2026-10-13，未记录命令）。2026-10-14 用"## 复测的三个数字"里的命令重测为 912 / 360，覆盖率 39.5%，第 14 簇后为 912 / 361，覆盖率 39.6%，第 18 簇后 912 / 375（41.1%），第 19 簇后 912 / 379（41.6%），第 20 簇后 912 / 380（41.7%），第 23 簇后 912 / 388（42.5%），第 24 簇后 912 / 399（43.7%），第 25 簇后 912 / 405（44.4%），第 26 簇后 912 / 407（44.6%）；分母与分子的口径都对不上旧那条，两组数字并列，只看趋势

## 按路由的进度

"未接入/总数"指该目录下的 `.tsx`，数字越小越接近完成

| 路由                       | 未接入/总数 | 路由               | 未接入/总数 |
| -------------------------- | ----------- | ------------------ | ----------- |
| mcp-servers                | 5/43        | access-groups      | 2/8         |
| guardrails                 | 4/35        | guardrails-monitor | 2/7         |
| playground                 | 14/37       | budgets            | 2/6         |
| prompts                    | 5/27        | memory             | 2/6         |
| models-and-endpoints       | 2/21        | tag-management     | 2/6         |
| policies                   | 3/18        | organizations      | 1/5         |
| agents                     | 4/15        | skills             | 2/5         |
| vector-stores              | 5/15        | change-password    | 1/2         |
| caching                    | 6/13        | router-settings    | 1/2         |
| usage                      | 6/13        | transform-request  | 1/2         |
| cost-optimization          | 1/11        | ui-theme           | 1/2         |
| projects                   | 3/11        | workflows          | 1/2         |
| cost-tracking              | 3/10        | api-keys           | 2/2         |
| search-tools               | 4/10        | old-usage          | 1/2         |
| users                      | 2/9         | 其余单文件路由      | 各 1/1      |
| **共享 `src` 目录**        | **435/482** |                    |             |

共享 `src` 目录那一行是长尾，也就是批次 24。它贡献了 435 个未接入文件，占全部 556 个未接入文件的绝大多数，不过里面混着大量本来就不含文案的文件（hooks、types、纯逻辑封装），不能直接按这个数字估工作量

mcp-servers 名义上剩 5 个未接入文件，但其中 4 个本来就没有面向用户文案（页面壳、re-export、键常量表、测试 harness），校验文案已于 `5c2da87` 接入。cost-optimization 剩的 1 个同样是无文案的页面壳

## 测试状态

命令：`npx vitest run --reporter=json`，全项目，2026-10-12 实测

| 指标             | 数值                     |
| ---------------- | ------------------------ |
| 用例总数         | 11306                    |
| 通过             | 10856（96.0%）           |
| 失败             | 450                      |
| 有失败的测试文件 | 96                       |

起始基线是 1323 失败，此后 team 批次（`deab7e7`）、Provider 批次（`6d06b7b`）、guardrails 与 policies 两族收口累计消掉 873 例

2026-10-12 下午又清掉失败最集中的四个路由共 229 例：projects（`8218f0c`，82）、prompts（`c9fa5a1`，56）、agents（`c4ed112`，55）、cost-tracking（`eb8394d`，36），四个路由复跑分别 161 / 117 / 128 / 206 例全绿。全量口径未重跑，下表 450 的分布仍是 507e347 的旧快照

晚场继续按目录级实测清零：playground（`f6d6210`，27，复跑 275 例）、usage（`178b97b`，27，223 例）、budgets（`cfae555`，20，48 例）、caching（`7ae597a`，18，108 例）、非路由 view_logs 与 add_pass_through（`17077de`，27）、六条小头路由 users / router-settings / tag-management / memory / skills / change-password（`25303e9`，46，复跑 302 例），合计 165 例

随后用 `--shard=k/4` 串行复核全量（这台机器单进程全跑超 10 分钟执行窗，产物会被截断，详见 [FIXES.md](./FIXES.md) 的收口一节）。分片又抓出 27 例不在快照里的第六类/同类断言停更（`ebf1fca` 8、`edeb082` 1、`041b668` 17、SSO 骨架 1 随本次提交，内容为共享分页脚、日志集成标题、创建密钥弹窗可访问名、请求头组件、批量邀请按钮等）与 6 例 auto_router 两套件的时序假红（`4550833`，把提交按钮可用性的等待预算从默认 1s 提到 5s 后 64 + 90 例全绿）。另 `f061fee` 回退了 playground 批次里越界跑 `eslint . --prune-suppressions` 对共享基线文件的改动

### 失败的归属

按被测源文件（同目录同名去 `.test`）是否引入 `next-intl` 分类

| 归属             | 文件数 | 失败用例数 |
| ---------------- | ------ | ---------- |
| 源文件已接入翻译 | 87     | 408        |
| 源文件未接入翻译 | 9      | 42         |

按错误文本聚合

| 失败用例数 | 错误文本                                      |
| ---------- | --------------------------------------------- |
| 383        | `Unable to find ...` 各类元素找不到            |
| 32         | `toHaveTextContent` / `toHaveValue` 等内容断言 |
| 24         | `toBeEnabled` / `toBeDisabled` / `toBeChecked` |
| 11         | 其他（数组深比对、`toBeVisible`、守卫测试等）   |

223 条缺 `NextIntlClientProvider` 已清零。剩下的主力是 383 条"找不到元素"，绝大多数是断言停在英文（第六类），但其中混有与翻译无关的既有失败，处理时要逐文件回 HEAD 基线确认，不要一律当成翻译的账

其他类里有两条不属于 i18n。`mcp_server_edit.test.tsx` 的 `preserves a stored client_id on OAuth-resume restore even when the saved snapshot is token-only` 报 `expected '' to be 'stored-client'`，是取值失败而不是文案断言，已列为既有失败。`tests/fetch-location-rule.test.ts` 报 `STACK_TRACE_ERROR`，这条守卫自 `610473c` 起就没动过，是上游带过来的

### 全量报告里有并发假失败，核实前要单文件复跑

上面的 450 是**一次全量运行**的原始结果，它不等于真实失败数，因为重型 integration 测试在高并发下会超时或竞态

已有的例子是 `edit_auto_router_modal.integration.test.tsx`：全量报告里 23 例失败，单独跑 64 例全绿（该文件单跑耗时 54 秒）。所以那 23 例是并发产物，不是缺陷

但不是所有集中失败都是假的。2026-10-12 逐个单文件复跑了失败最多的四个文件，结果与全量一致，都是真失败

| 文件                                                                   | 全量 | 单跑 |
| ---------------------------------------------------------------------- | ---- | ---- |
| `cost-tracking/_components/cost_tracking_settings.test.tsx`            | 14   | 14   |
| `projects/.../EditProjectModal.integration.test.tsx`                   | 13   | 13   |
| `agents/_components/agent_info.integration.test.tsx`                   | 12   | 12   |
| `add_pass_through.integration.test.tsx`                                | 12   | 12   |

这四个都是第六类：断言停在 `Save Changes`、`Advanced Settings`、`Project Name`、`Edit Settings` 这些已经变成中文的文案上

结论是处理失败清单前先单文件复跑，别信全量报告里的集中失败，也别因为一例是假的就把其余都当成假的

失败最集中的单文件

| 文件                                                                       | 失败用例数 |
| -------------------------------------------------------------------------- | ---------- |
| `src/components/edit_auto_router/edit_auto_router_modal.integration.test.tsx` | 23      |
| `src/app/(dashboard)/cost-tracking/_components/cost_tracking_settings.test.tsx` | 14    |
| `src/app/(dashboard)/projects/_components/ProjectsPage.test.tsx`            | 13         |
| `src/app/(dashboard)/projects/_components/ProjectModals/EditProjectModal.integration.test.tsx` | 13 |
| `src/components/view_logs/index.test.tsx`                                   | 12         |
| `src/components/add_pass_through.integration.test.tsx`                      | 12         |
| `src/app/(dashboard)/agents/_components/agent_info.integration.test.tsx`    | 12         |
| `src/app/(dashboard)/projects/_components/ProjectModals/CreateProjectModal.integration.test.tsx` | 12 |
| `src/app/(dashboard)/prompts/_components/prompt_editor_view/VersionHistorySidePanel.test.tsx` | 11 |
| `src/app/(dashboard)/usage/_components/components/UsagePageView.test.tsx`   | 11         |

### 各路由的测试状态

| 路由               | 失败用例 | 失败文件 | 路由            | 失败用例 | 失败文件 |
| ------------------ | -------- | -------- | --------------- | -------- | -------- |
| projects           | 82       | 10       | tag-management  | 11       | 3        |
| （非路由）          | 81       | 19       | users           | 9        | 1        |
| prompts            | 56       | 18       | router-settings | 8        | 1        |
| agents             | 55       | 10       | memory          | 7        | 2        |
| cost-tracking      | 36       | 6        | skills          | 6        | 3        |
| playground         | 27       | 9        | change-password | 5        | 1        |
| usage              | 27       | 5        | mcp-servers     | 1        | 1        |
| budgets            | 21       | 4        |                 |          |          |
| caching            | 18       | 3        |                 |          |          |

"（非路由）"指 `src/components` 与 `tests` 下不属于任何 dashboard 路由的测试，其中 `edit_auto_router` 占 23、`view_logs/index` 占 12、`add_pass_through` 占 12

models-and-endpoints、cost-optimization、access-groups、organizations、workflows、transform-request、ui-theme 保持零失败。mcp-servers 从 20 例降到 1 例，是上面那条 `stored client_id` 的取值失败

### i18n 自身的守卫

三条守卫全部通过，16 个用例

```
npx vitest run src/lib/i18n
```

`locales.test.ts` 7 个、`messagesParity.test.ts` 8 个、`missingKeys.test.ts` 1 个

其中 `missingKeys.test.ts` 在这一轮之前是失效的，见 [FIXES.md](./FIXES.md) 的"2026-10-12 新发现并修复的两条"。修好之后它报出 47 条真实缺失，补齐后转绿

`src/components/shared/LanguageSwitcher.test.tsx` 曾有 2 个失败，属于设计冲突而非缺陷：`renderWithProviders` 强制 `locale="zh-CN"`，而这两个用例假设默认是英文，并且想验证"切换后变中文"这条链路。强制 locale 会把 `localStorage` 驱动的那条链路短路掉。已给 helper 加 `locale: null` 出口解决，见 [ARCHITECTURE.md](./ARCHITECTURE.md) 的"测试侧的两个入口"

## 已完成的部分

i18n 基础设施完整可用：语言解析、切换器、状态传播、类型增强、三条守卫都在，`locales.test.ts` 覆盖了三级回退链

批次 0 到 14 完成。核心管理页面（虚拟密钥、团队、用户、组织、预算、项目、访问组、模型与端点、MCP 服务器、护栏、策略、用量、日志、管理面板）的文案已经接入

2026-10-12 又收掉三块。Provider 批次（`6d06b7b`）：26 个测试文件从裸 `render` 换成 `renderWithProviders`，223 例缺 Provider 清零，附带 45 例断言中文化，其中 3 个自定义 wrapper 场景在 wrapper 内嵌 `<LocaleProvider locale="zh-CN">`。team 批次（`deab7e7`）：12 个测试文件 172 例清零。mcp-servers 校验文案（`5c2da87`）：`utils.tsx` 三个校验器改为调用方传入 `t()` 消息，目录新增 `mcpServers.validation` 三键

七个核心模块的测试全绿，数字来自上面那份全量基线

| 模块                 | 用例数 | 结果      |
| -------------------- | ------ | --------- |
| cost-optimization    | 216    | 216 通过  |
| models-and-endpoints | 196    | 196 通过  |
| access-groups        | 73     | 73 通过   |
| organizations        | 37     | 37 通过   |
| workflows            | 16     | 16 通过   |
| transform-request    | 7      | 7 通过    |
| ui-theme             | 6      | 6 通过    |

i18n 自身的三条守卫也是全绿，16 个用例

## 汉化完成度实测（2026-10-13）

**测试全绿不等于汉化完成**，两者衡量的是不同东西。测试只说明"已有的断言与当前实现一致"，而没被翻译的组件通常也没有中文断言，它们既不红也不绿，只是没被任何断言覆盖。所以 99.99% 的通过率不能当作汉化收尾的证据

对 `src` 下 1232 个非测试 `.tsx` / `.ts` 做了一次启发式扫描：找未接入 `next-intl`、且含 JSX 文本节点或 `placeholder` / `aria-label` / `title` / `label` / `alt` 英文字面量的文件

| 项                                 | 数量 |
| ---------------------------------- | ---- |
| 非测试源文件                       | 1232 |
| 已接入 `next-intl`                 | 309  |
| 含用户可见英文且未接入             | 232  |
| 已接入但仍有英文字面量             | 44   |

232 个里有 230 个被其他源码 import，另 2 个是 `app/chat/page.tsx` 与 `app/mcp/oauth/callback/page.tsx` 这类路由入口（Next 直接挂载，不需要被 import），所以**全部是活代码**，不是死文件。抽查确认不是误报：`components/activity_metrics.tsx` 里直接写 `<p className="text-sm text-muted-foreground">Total Requests</p>`

按目录看，前几名是 `components/add_model`（43 文件 / 171 处）、`components/Settings`（27 / 89）、`components/view_logs`（22 / 42）、`components/chat`（10 / 39）、`components/AIHub`（9 / 36）

`components/add_model` 这一行在 2026-10-14 已经过时：批次 24 第 1 到 12 簇把这 43 个文件基本扫完了，实测该目录 56 个非测试 `.tsx` 里 52 个已接入，剩下 4 个不产生可见英文（见"批次 24：add_model 与 edit_auto_router"一节）。同一命令下 `components/view_logs` 是 71 个非测试 `.tsx` 接入 2 个，是现在最密的目标。命令与口径见"## 2026-10-14 更新"

这正是 [PLAN.md](./PLAN.md) 里批次 24 的账。需要区分的是：[FIXES.md](./FIXES.md) 记的"批次 24 硬编码英文欠账清单"只是 2026-10-12 修 Provider 与 team 批次时顺手记下的 10 条已知欠账，那份清单清空不等于批次 24 完成

扫描是启发式的，会漏掉模板字符串里拼接的文案、常量表里的标签、以及非 JSX 位置渲染的字符串，也会把少量技术标识误判成文案。所以 232 是量级估计，不是可直接施工的精确清单；真要收口，得逐文件读一遍

## 下一步优先级

`components/view_logs` 是眼下最密的目录（71 个非测试 `.tsx`，第 20 簇后按 `useTranslations(`/`getTranslations(` 的 grep 口径接入 22 个，另有 `logs_utils.tsx` 走首参翻译器、grep 抓不到）。第 16 簇把 `ERROR_CODE_OPTIONS` 收进目录，搜索改成"先铺成中文标签再子串匹配"，靠中文值保留 `429 - ` 数字前缀让两种语言都能命中；第 17 簇把请求日志表的列头与单元格文案收干净，表头这一层已经没有硬编码英文；第 18 簇收了抽屉外壳与侧栏、抽屉头部和 9 个叶子组件；第 19 簇收了抽屉卡片层的 `InputCard.tsx`、`OutputCard.tsx`、`SimpleToolCallBlock.tsx`、`ClassifierAuditView.tsx`；第 20 簇收了抽屉的 `RoutingDecisionCard.tsx` 路由决策卡；第 21 簇收了抽屉的 `RealtimePrettyView.tsx` 实时会话视图，抽屉目录的展示文案到此清零，只剩 `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 两个没有可展示文件计在"未接入"里；第 22 簇收了 `ToolsSection/` 的四个有文案的文件（`JsonToolView.tsx` 只渲染 JSON 数据，不算文案）；第 23 簇收了审计日志族——`AuditLogsPanel.tsx`、`AuditLogsTable.tsx`、`AuditLogsTableColumns.tsx` 与 `AuditLogDrawer/AuditLogDrawer.tsx`。此后 `view_logs` 的余量按大小排是 `TraceView/` 子目录（23 个非测试 `.tsx`）、`RequestLogsTable.tsx` 与 `RequestLogsPanel.tsx` 的空态和筛选文案、`GuardrailViewer/` 一族（`BedrockGuardrailDetails`、`CompliancePanel`、`ContentFilterDetails`、`PresidioDetectedEntities`、`GuardrailViewer`）、`EvalViewer` / `CostBreakdownViewer` / `VectorStoreViewer` / `ConfigInfoMessage` 四个根文件，外加 `columns.tsx`、`log_filter_logic.tsx` 这类没有展示文案、只是扫描口径算作未接入的文件

原来的四个优先级里，第一（223 条缺 Provider）、第二（team 172 例）、第三（页面收口）都已完成。此前按失败集中度排出的 1-6 号目标也全部清零：`edit_auto_router_modal.integration` 的 46 例经单文件复跑确认是全量并发造成的假失败（独立运行为 0），其余按 6d06b7b、e2350f6、c109bdb、0e8f5f6 四次提交逐个转绿。中途顺带清掉了未列进表的 `AdminPanel`（19）、`EntityUsage`（18）、`add_attachment_form`（17）、`BulkEditUsers`（16）、`leftnav` 之外的 `user_edit_view` / `user_info_view.integration` / `old-usage`

第 7 项已清零。guardrails 族起点 150 例，`d0c3436` 收掉 content_filter 子族的 68 例，本次提交收掉其余 22 个文件的 82 例（起点：`guardrail_info.characterization` 14、`add_guardrail_form.characterization` 11、`GuardrailsOverview` 11、`CustomCodeModal` 9、`GuardrailUsageBreakdown` 7、`TeamGuardrailsTab.integration` 7，加 6/5/4/3 的长尾），`src/app/(dashboard)/guardrails` 目录复跑 272 例全绿。policies 族（14 个文件 112 例）已在 bdac478 清零。清的时候仍按"回 HEAD 基线确认既有失败"区分翻译账和非翻译账，并且先单文件复跑，别信全量报告里的集中失败

几处踩过的坑，写在这里省得再查：

- 组件里的硬编码英文哨兵值不能被翻译。`AdminPanel.tsx` 的 `all_ip_address_allowed = "All IP Addresses Allowed"` 同时用于渲染和比对后端返回的 IP 行，测试的 mock 数据必须保持英文，只有断言渲染文本的那几处才跟着 t() 走
- 共享组件里写死的英文按钮同样保持英文。`DeleteResourceModal` 的按钮固定渲染 `Cancel` / `Delete` / `Deleting...`，`policies/_components/index.test.tsx` 里这三处断言不能跟着目录里其他断言一起改
- 测试自己 mock 出来的 stub 文案与语言无关。`index.test.tsx` 把 `FlowBuilderPage` mock 成一个写着 `Back to policies` 的按钮，改中文会直接查不到元素
- 英文不同、中文同值的两个键会破坏 `getByText` 的唯一性。`flow.guardrailBadge`（GUARDRAIL）与 `flow.guardrailLabel`（Guardrail）都渲染成"护栏"，`pipeline_flow_builder.test.tsx` 那一处只能改成 `getAllByText(...).length`
- next-intl 走 ICU 语法，消息里的单引号是转义符而不是字面量。`Microsoft Entra OBO requires a scope, e.g. api://'<app-id>'/.default` 渲染出来是 `api://<app-id>/.default`（引号被吞），断言要按渲染结果写
- 英文正则断言在中文下永不命中，不能指望它跨语言。`SectionHeader.test.tsx` 的 `getByRole("button", { name: /copy/i })` 在按钮可访问名变成"复制输入"之后查不到元素，只能改成具体文案；同一行里 `x-litellm-call-id:` 这类头名、`LLM` / `MCP` 这类缩写中英同值，反而不需要动
- 纯展示叶子组件一旦接 `useTranslations`，它的测试就从"能裸 `render`"变成"必须有 provider"。第 18 簇里 `InputCard` / `OutputCard` / `RealtimePrettyView` 的测试本身没改组件，却因为渲染了 `SectionHeader` 而一起要换 `renderWithProviders`——判断范围要看渲染树，不要只看改了哪些源文件；第 19 簇的 `SimpleMessageBlock` 自己一行翻译都没有，只因为它的子节点 `SimpleToolCallBlock` 接了 hook，测试同样得整树包 provider
- ICU plural 在中文里退化成量词短语，英文整句正则要按中文语序重写。`test.testButton` 的 `Test {count} guardrails` 中文是"测试 {count} 个护栏"，`providerFields.jsonObject` 的 `{field} must be a valid JSON object` 中文把占位符留在前缀（"detect_secrets_config 必须是有效的 JSON 对象"），`eval.descNamed` 更是把 `{name}` 挪到句中（"为 {name} 配置 AI 评估"）
- 纯逻辑模块拼出来的英文展示串也在页面上，属于批次 24 的账。`components/GuardrailsMonitor/usageUnits.ts` 的 `unpricedSummary()`、`counterLabel()` 与 `counterMathRow()` 已按 `(t, ...)` 首参约定接入 `guardrailsMonitor` 命名空间，中文断言同步。`counterLabel()` 改为先查 9 个真实计数器的映射表（键取自 `bedrock/guardrails` 成本表），未知计数器才走驼峰派生兜底
- 图表图例的 `categories` 是 dataKey，不能直接传中文，否则图例说中文而 tooltip 与序列名对不上。给共享的 `bar_chart` 加了可选 `categoryLabels`，同时覆盖 `ChartConfig.label`（图例）与 `Bar name`（tooltip 名），dataKey 保持 `passed` / `blocked` 不动
- 中文目录里 `{count}` 不会千分位，`{count, number}` 才会。`unpricedSummary()` 的 `1234 units unpriced` 中文写 `{count, number} 个单位未定价`，`1,234` 才对；同理 ICU plural 组内的 `#` 自带千分位
- 组件里写死的按钮英文会伪装成翻译问题。`TeamGuardrailsTab` 的详情面板把 `Approve` / `Reject` / `Add` 写死，接上 `t("team.approve")` / `t("team.reject")` / `t("team.add")` 之后 `getAllByRole("button", { name: /批准/ })` 的计数才与英文一致，这一处随本次提交一起改掉了

到此，第六类（断言停在英文）排得出名次的目标全部清零，剩下的主力就是批次 24 的共享组件长尾。清单里的硬编码也全部收口：guardrails 相关四条（`usageUnits.ts`、`ScoreChart.tsx`、`CustomCodeModal.tsx`、`TeamGuardrailsTab.tsx`）已在 `3d617ec` 清零，最后一行 `public_model_hub` 分页脚（连同 `AIHub/ModelHubTable.tsx` 的孪生组件）已在本次提交清零，[FIXES.md](./FIXES.md) 的"批次 24 硬编码英文欠账清单"到此清空。本次提交同时把两处既有脚注断言改成中文，并给公开页补了一条 agents/MCP 脚注的中文用例

顺带修掉 `dd32399` 留在非测试文件里的 22 处类型错误，生产构建从那时起一直红着，本次恢复绿色。起点是 `cache_control_settings.tsx` 的导出常量被删后 `ModelInfoEditForm.tsx`（未翻译的长尾文件）还在 import；修掉缺导出后构建推进到下一层，又停在 `layout.tsx` 的 `Cannot find name 't'`。同一提交共留下五类错误：删掉的导出仍被引用、`t()` 调用处没有 hook（10 条）、`keyof typeof` 指向不存在的名字、重复的 interface 声明、无意义的 `data-testid` 解构。vitest 对这些全绿（Vite 把缺失导出解析成 `undefined`），tsc 会报但混在存量里没被逐条比对，只有 `npm run build` 会硬失败且一次只报第一个错。五类的例子与修法见 [FIXES.md](./FIXES.md) 的"2026-10-12 构建报错"一节

`renderWithProviders` 与 `LanguageSwitcher` 的设计冲突已解决，题面就是 `tests/test-utils.tsx` 里那条标记：helper 默认钉 `zh-CN`，而 switcher 要测的正是被钉住时短路掉的那条链路。修法是让 `locale` 选项接受 `null` 表示不钉，配合修掉 `LocaleProvider` 里 `useSyncExternalStore` 的条件调用（`react-hooks/rules-of-hooks` 的 error，此前一直红着）

### 核实后的剩余工作

507e347 快照里的失败已逐块清零：四个重路由 229 例 + 晚场六个块 165 例 + 分片复核补抓的 27 例第六类/同类 = 421 例，另有 6 例 auto_router 时序假红转为等待预算修复（`4550833`）。四片全量复核覆盖全部 858 个文件，各分片的失败项已逐一单文件复跑清零或定性，**第六类（断言停在英文）在本轮观测中归零**

剩余失败均为非第六类，口径是分片全量加单文件复跑：`LanguageSwitcher` 2 例（`renderWithProviders` 强制 zh-CN 的设计冲突，需要一个可省略 locale 的包裹层，已修）、`mcp_server_edit` 1 例（`stored client_id` 取值失败，与翻译无关）。此前记在技术债里的 `AutoRoutersPanel` 2、`AccessGroupBudgetsPanel` 2、`fetch-location-rule` 1 在本轮四片全量中均未复现

后续若开新清理轮：先按分片拿全量失败清单，逐项单文件复跑区分真假，再按失败数从多到少逐块清零；不要跑单进程全量（会撞执行窗），也别并发跑多个 vitest（互相拖慢且放大失败数）

### f4fb7c2 上的独立复核

按上面的建议在 `f4fb7c2` 上跑了一次四片全量：11307 个用例，11303 通过，4 失败（99.96%），文件覆盖 858 个。上面"第六类归零"的结论成立，另抓到一条不在清单里的漏网断言

| 失败项 | 性质 | 处置 |
| ------ | ---- | ---- |
| `DeletedKeysPage/DeletedKeysTable.test.tsx :: should show the total count in the pagination footer` | 第六类漏网。同一用例的 `pagination-range` 已改中文，紧邻的 `pagination-page` 停在 `Page 1 of 3` | 已改中文，单文件复跑 8 例全绿 |
| `mcp_server_edit.test.tsx :: preserves a stored client_id ...` | 取值失败，非 i18n | 保留，见技术债 |
| `LanguageSwitcher.test.tsx` 2 例 | 设计冲突 | 已修，helper 加 `locale: null` 出口 |

同一次复核还发现 `ProjectDetailsPage.tsx` 的项目状态徽标写死 `"Blocked" : "Active"`，而 `projects.statusBlocked` / `projects.statusActive` 两个键早就存在于两侧目录（`活跃` / `已封禁`），属于"键已存在但调用点没接"，是 `AgentsTableColumns` / `TeamGuardrailsTab` 那一类的残留。接上 `t()` 并同步两条断言后，该文件 22 例全绿

三处修完，`mcp_server_edit` 1 例是仅剩的已知失败

修复后（2026-10-13）重跑四片全量：11308 个用例，11307 通过，1 失败（99.99%）。用例数比上一轮多 1，来自 `LanguageSwitcher` 的用例由 3 个扩到 4 个（新增"跟随浏览器语言"一条）。唯一的失败就是上面那条 `mcp_server_edit`，其余全部转绿，说明 `LanguageSwitcher` 与 `LocaleProvider` 的改动没有波及依赖钉住 locale 的其余测试

## 技术债

`AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败是既有问题，与 i18n 无关，留给对应模块

`mcp_server_edit.test.tsx` 的 "preserves a stored client_id on OAuth-resume restore" 1 例是**稳定失败**，不是偶发。2026-10-13 用 `-t` 只跑该用例（其余 80 例 skip）仍然失败，`waitFor` 超时后字段值停在 `''`，这就排除了并发竞态。此前记的"单跑会通过、分片下偶发"与本机实测不符，已按实测更正

判定与翻译无关的依据是逻辑本身：该用例走 `mcp_server_edit.tsx` 的 OAuth 恢复 effect，那段"服务器凭据与快照合并后再剥 token"的代码与 `610473c` 上游版本逐行一致，翻译只动了文案。上游快照里这个测试就存在，所以它要么是上游带来的既有缺陷，要么依赖某些环境条件。定级为待查，本轮没动手改，因为修它要先判断期望行为该由组件还是测试承担

全仓库 `tsc --noEmit` 有 904 条错误（去重后，原始输出 905 行），分布在 56 个文件（2026-10-13 实测），**全部位于 `*.test.tsx` / `*.test.ts`**，大头是 vitest 全局类型缺失的 TS2304/TS2582 与测试文件自身的类型债。此前记的 928 条里有 24 条是翻译引入的，全部在非测试文件（`dd32399` 的五个错误类，9 个文件 22 条 + `ModelInfoEditForm.tsx` 引用缺导出的 2 条），本次修完后降到 904，**非测试文件清零**，`npm run build` 恢复绿色。注意 `next.config.mjs` 设了 `useTypeScriptCli: false`，Next 16 自带的类型检查阶段不扫测试文件，所以这 904 条与绿色构建共存；哪天开了这个实验开关，测试文件债会立刻变成构建红灯。`TRANSLATION_PLAN.md` 里写的"约 819 条、56 个文件"是更早的一次测量，已过时。基线比对之后要区分"非测试文件 0 错误"与"测试文件存量债"两件事

比对基线前先确认 `ui/litellm-dashboard/next-env.d.ts` 存在（它被 gitignore，删掉后会虚增 145 条 `assets/logos` 的 TS2307），标准内容就两行 `/// <reference types="next" />` 与 `/// <reference types="next/image-types/global" />`

判断有无新增要逐条比对，不要只看总数，按文件去重会掩盖同一文件内的新增错误。`src/lib/i18n` 目录目前是零错误

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交。2026-10-14 第 24 簇已收：加进根 `.gitignore` 并 `git rm --cached` 脱离跟踪，本地文件保留，`tsc` 与 `npm run build` 不再脏工作树

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
