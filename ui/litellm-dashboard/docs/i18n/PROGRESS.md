# 开发进度

数据快照 2026-10-15，分支 `main`。**汉化尚未完成**，剩余量见"## 汉化完成度实测"；目录规模、欠账清单与文件覆盖率随每次提交更新。最新的测试统计是第 18 簇后的一次全量（886 文件 11576 例、57 失败，无一在 `view_logs`，多出的三个文件单跑全绿），第 19 到 32 簇只复跑了 `view_logs` + `src/lib/i18n`（52 文件 671 例，第 25、26、27、28、29、30、31、32 簇未增删用例；第 20、21、22 簇另跑 `add_model`，均为 94 文件 1672 例），第 33 簇起把 `chat` + `app/chat` + `app/connect` 并进复跑范围（67 文件 749 例，第 34 簇未增删用例），第 35 簇起再把 `components/liteadmin` 并入（70 文件 861 例，第 35、36、37、38、39、40、41 簇未增删用例），第 42 簇起再把 `components/AIHub` 并入（79 文件 978 例，本簇未增删用例），"批次 24：add_model 与 edit_auto_router"一节的 11576 例 / 54 失败是它的前一次，"### 修复后的复核"的 11308 例 / 1 失败与 `## 测试状态` 的表格都是更早的快照，保留用于对照起点

## 2026-10-15 第 42 簇更新

批次 24 第 42 簇：`components/AIHub/forms/MakeAgentPublicForm.tsx`（311 行，接入后 318）接入 `modelHub`，新开 `modelHub.makeAgentPublic.*` 16 键，另把 `Select All` 直接落在 `common.selectAll`，两个消息目录各 +21/−2 行（−2 是 `common.tokensInAndOut` 与 `modelHub.showingMcpServers` 两行补逗号）

改造形态：

- `Select All` 一步就进 `common`：这个标签在本簇之外还有三个已知消费者——同目录的 `MakeModelPublicForm.tsx` 与 `MakeMCPPublicForm.tsx`、以及 `claude_code_plugins/MakeSkillPublicForm.tsx`，四处取值逐字节相同，先放 `modelHub.makeAgentPublic` 再上收只会多一次改动。已有的 `playground.compliance.selectAll` 与 `guardrails.pii.selectAllMask` 一族跨命名空间且不通用，不借
- `STEP_TITLES` 从模块级常量改成组件内 `[t("…stepSelect"), t("…stepConfirm")]`：常量在模块顶层取不到 hook，而这两项只在渲染时用。`stepConfirm` 取自己的键而不是 `common.confirm`——向导步骤名是名词标签，`common.confirm` 是动作按钮，概念不同
- 步骤按钮复用 `common`：`common.cancel` / `common.previous` / `common.next`（取消、上一步、下一步）取值与概念都对得上，且这三个键本已被向导与分页用着
- 计数与富文本三处用 `t.rich`：`selectedInfo`、`totalInfo`、`confirmWarning`。ICU 的复数分支里不能嵌标签——parity 守卫按 `\{([^}]*)\}` 取到的第二段是 `other {<strong>#</strong> agents selected}` 之类"既不是 `# 空格`、也不是标识符、又不含逗号"的残片，会被判成裸花括号，所以写成 `<strong>{count}</strong> {count, plural, one {agent} other {agents}} selected`，标签留在复数外面，加粗范围与旧 JSX 一致
- toast 的成功文案由 `agent(s)` 改成真正的复数：`toastSuccess` EN `Successfully made {count} {count, plural, one {agent} other {agents}} public!`，node + `intl-messageformat` 实测 `count=2` 渲染为 `Successfully made 2 agents public!`，与旧的模板串在同一取值上只差 `(s)`；中文为"已成功公开 {count, number} 个智能体！"，两侧参数名同为 `count`，复数在中文里退化成量词
- `Select All {n > 0 && \`(${n})\`}` 的括号计数留作数据：与第 39 簇的 `Connected (${n})` 同一口径，JSX 里 `{t} {' '}{cond}` 保住原来那个空格，accessible name 仍是 `全选 (2)`
- `console.error("Error making agents public:", error)` 与 `Badge` 里的 `v{agent.version}` 不动，前者是开发日志、后者是版本号数据

测试侧同步：`MakeAgentPublicForm.test.tsx` 用裸 `render` 的 15 处全部换成 `renderWithProviders`（默认钉 `zh-CN`），断言串同步为中文——`Make Agents Public`→将智能体设为公开、`Select Agents to Make Public`→选择要公开的智能体、`Confirm Making Agents Public`→确认公开这些智能体、`Next`→下一步、`Previous`→上一步、`Cancel`→取消、`Make Public`→公开、`Select All (2)`→全选 (2)、`No agents available.`→暂无可公开的智能体。、`+2 more`→还有 2 个。`getByRole` 的 `name` 是整串匹配，"公开"只命中提交按钮，不会误取"将智能体设为公开"（那是 `getByText` 的标题）。步骤二的用例会一路点进来，`confirmWarning` 与 `totalInfo` 两条 `t.rich` 因此在测试里真实渲染过

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（复跑范围自本簇起并入 `components/AIHub`，用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 1 warning，那条 `no-explicit-any` 在 HEAD 的 `resolvePromise: (value: any)` 上就有，本簇未新增；prettier 先证 HEAD 两个文件干净、改动后 `--check` 仍干净，未执行 `--write`；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 428 到 429，47.0%。键数 6783 到 6800（`modelHub` 命名空间 3 到 19，`common` 188 到 189），中英同值 86 不变

## 2026-10-15 第 41 簇更新

批次 24 第 41 簇：`components/chat/ChatShell.tsx`（149 行，接入后 153）接入 `chat`，新开 `chat.shell.*` 8 键——顶部 pre-v0 提示、`New Chat` 按钮与 6 个侧栏导航项，两个消息目录各 +10/−0 行

改造形态：

- pre-v0 提示是一条带链接的整句，改成 `t.rich("shell.betaWarning", { link: (chunks) => <a …>{chunks}</a> })`。原文在 JSX 里是"正文 + `{' '}` + 链接 + `.`"三段拼接，中文语序要把链接挪到句中（"欢迎在<link>这里</link>分享反馈。"），只有 rich 标签能做到；英文取值去掉标签后与旧渲染逐字节相同，含 `here` 前那个空格。`link` 在 parity 守卫的 `RICH_TAGS` 白名单里，中英两侧都必须闭合；守卫只扫 `t("…")` 字面量，`t.rich` 的键名靠 `next-intl.d.ts` 的类型绑定兜住，写错作用域直接是 tsc 错误
- 6 个导航项的 `label` 是字符串 prop，取值放在调用点，`NavItem` 不调 hook，保持纯展示。`navIntegrations` 取 `集成`，与第 39 簇 `chat.credentialsPanel.emptyHint` 的"前往 <b>集成</b>"对齐；`navCredentials` 取 `凭证`、`navApiKeys` 取 `API 密钥`，分别跟 `chat.credentialsPanel.title`（应用凭证）、`chat.keysPanel.title`（你的 API 密钥）同词
- 没有借 `nav` 命名空间：`nav.usage` / `nav.logs` 与 `chat.shell.navUsage` / `chat.shell.navLogs` 的中英取值相同（`Usage`/用量、`Logs`/日志），但那是主控制台侧栏的页面项，跟聊天侧栏不是同一个概念位；按第 29、33、36、38、39、40 簇"跨命名空间借用要挂第二个翻译器，宁可开自己的键"的口径留在 `chat.shell`，中文取值仍与 `nav` 一致，不产生术语分叉

测试侧同步：`ChatShell.test.tsx` 原先用裸 `render`，组件接 `useTranslations` 之后整树必须有 provider，改为 `renderWithProviders`（默认钉 `zh-CN`），5 个用例的 `getByRole("button", { name })` 从 `Chats`/`API Keys`/`Integrations`/`Usage`/`Logs` 换成 对话/API 密钥/集成/用量/日志。`name` 是整串匹配，"对话"不会撞上"新建对话"按钮。同目录的 `ChatShell.serverRootPath.test.ts` 只 `import("./ChatShell")` 取 `getChatRoutes()`、不渲染，因此不需要 provider，2 例照旧绿

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净，改动后 `--check` 仍干净，未动 `.tsx` 之外任何文件（两个消息目录的 JSON 在 HEAD 上本来就不符合 prettier，不参与格式化）

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 427 到 428，46.9%；`components/chat` 11 个非测试文件接入 10 个，只剩 `ConnectFlowSurface.tsx`（59，无自有文案）。键数 6775 到 6783（`chat` 命名空间 138 到 146，`common` 188 不变），中英同值 86 不变

## 2026-10-15 第 40 簇更新

批次 24 第 40 簇：`components/chat/UsagePanel.tsx`（212 行，接入后 221）接入 `chat`，新开 `chat.usagePanel.*` 11 键；`chat.logsPanel.tokensInAndOut` 上收进 `common.tokensInAndOut`，`logsPanel` 由 19 键减到 18 键，净 +11，两个消息目录各 +15/−2 行

改造形态：

- 4 张统计卡的标签、`N/A` 兜底与"输入 X / 输出 Y"的副行都从 `meta` 的模板字符串里拆出来：标签走键，`$${spend.toFixed(2)}`、`formatNumber` 的 `K`/`M` 后缀与 `${pct}%` 留作数据（沿用既有货币与数字缩写欠账的口径）。`sub` 与 `value` 的三元判断没动，只把字符串换成键取值
- `tokensInAndOut` 上收的理由与第 39 簇那 4 个相对时间键相同：UsagePanel 的 token 副行与 LogsPanel 详情卡的 "{prompt} in / {completion} out" 概念与取值逐字节相同，`chat` 下两个面板各留一份是重复，借 `chat.logsPanel` 又让用量面板依赖日志面板的分组，所以放进 `common`。`LogsPanel.tsx` 的 `LogDetailDialog` 新增 `commonT`，`chat` 侧调用点不变；第 37 簇加的 `1,500 (输入 1,000 / 输出 500)` 断言没改值也照样绿，正好证明上收没改渲染
- `usagePanel.na` 取 `N/A` / `无`，与 `agents.na`、`logs.auditLogs.drawer.notApplicable` 同法；没有复用它们是因为那两处跨命名空间，借要挂第二个翻译器（第 29、33、36、38 簇口径）
- `dailySpend` 的中文取 `每日花费`，与 `usage.dailySpend` 一致（同目录 `usage.entity.dailySpend` 译作"每日消费"，取更贴近图表标签的那一支）；`tokensUsed` 译作 `Token 用量`，跟本命名空间 `logsPanel.colTokens` 的"Token 数"一样保留 Token 不译，没有跟 `usage.totalTokens` 的"总令牌数"混用
- 时间范围按钮的 `7d`/`30d`/`90d` 没接键：与第 37 簇 `LogsPanel` 的 `24h`/`7d`/`30d` 同一处理，属"时间范围缩写"那笔数据/格式欠账

测试侧无断言可同步：`UsagePanel` 没有测试文件，唯一消费者是 `src/app/chat/usage/page.tsx`；`chat` 目录内的用例没有一处断言 `Total Spend`/`Success Rate`/`Daily Spend`/`N/A` 这些串

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动 `.tsx`，`LogsPanel.tsx` unchanged；`chat.usagePanel.failedCount` 与上收后的 `common.tokensInAndOut` 都用 node + `intl-messageformat` 实测过渲染串与旧模板字符串逐字节相同

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 426 到 427，46.8%；`components/chat` 11 个非测试文件接入 9 个，剩 2 个是 `ChatShell.tsx`（149）与 `ConnectFlowSurface.tsx`（59，无自有文案）。键数 6764 到 6775（`chat` 命名空间 128 到 138，`common` 187 到 188），中英同值 86 不变

## 2026-10-15 第 39 簇更新

批次 24 第 39 簇：`components/chat/MCPCredentialsTab.tsx`（232 行，接入后 239）接入 `chat`，新开 `chat.credentialsPanel.*` 16 键；同时把第 36 簇放在 `chat.keysPanel` 的 4 个相对时间键上收到 `common`，净 +16，两个消息目录各 +24/−6 行

改造形态：

- `chat.keysPanel.{justNow,minutesAgo,hoursAgo,daysAgo}` 挪进 `common`：`MCPCredentialsTab` 里有一份与 `KeysPanel` 逐分支取值相同的 `relativeTime`（`just now`、`{n}m ago`、`{n}h ago`、`{n}d ago`），概念同为"多久以前"，按"概念与取值都相同才复用"该共用，而跨命名空间借 `chat.keysPanel` 又要把整棵密钥面板挂进第二个翻译器，所以按第 35 簇把 `chat.appsPanel.back` 收进 `common.back` 的口径上收到共享命名空间。`KeysPanel` 的 helper 形参从 `ChatTranslator` 换成 `CommonTranslator`，调用点传 `commonT`
- 两个模块级纯函数沿用"首参传 `t`"的写法（第 36、37 簇）：`relativeTime(commonT, iso)`、`expiryLabel(t, iso)`。`expiryLabel` 返回 `{ text, variant }`，只有 `text` 接键，`variant` 仍是数据判断
- 4 个表头在骨架表与真表各写一遍，两处同步改成 `credentialsPanel.colApp`/`.colConnected` 加 `common.status`/`common.actions`（`Status`/`状态`、`Actions`/`操作` 逐字节相同）。`colConnected` 的中文取 `连接时间`而不是字面的"已连接"：那一列放的是连接发生的时间点，与 `mcpServers.userCredentials.columnConnected` 同一列同一取法保持一致
- 空态提示走 `t.rich`：原 JSX 是 `Go to <span className="font-medium">Integrations</span> and click{" "}<span className="font-medium">Connect</span> to authorize an MCP server`，消息取值写成 `Go to <b>Integrations</b> and click <b>Connect</b> to authorize an MCP server`，渲染函数 `b: (chunks) => <span className="font-medium">{chunks}</span>` 保住原 DOM 与 `font-medium`。`messagesParity` 的 `RICH_TAGS` 认得 `b`，而 `missingKeys` 只匹配 `\bt\(\s*"`，`t.rich` 的键名不在它眼里，键是否存在靠 `next-intl.d.ts` 的键 union 与 tsc 兜住
- `revokeDescription` 带 `{name}`（`displayName(cred)` 的结果，数据不接键）。EN 值里的 `You'll` 是词中撇号，ICU 只在 `'` 后紧跟 `{`/`}`/`#`/`|`/`<`/`'` 时才当转义，实测渲染原样保留。没借 `mcpServers.userCredentials.revokeBody`：那边说"下一次 MCP 请求会失败"，本句说"重新连接才能在聊天中继续使用"，概念不同。中文用"吊销"，与同目录 `revoke`/`couldNotRevoke` 的既有译法一致，没有另起"撤销"
- 状态徽标的 `doesNotExpire`、`expired` 与 `expiresInDays`/`Hours`/`Minutes` 留在本命名空间：目录里 `Expired` 早已按作用域各开一键（`virtualKeys.status.expired`、`chat.keysPanel.expired`），`common` 只有 `sessionExpired`，没有裸 `expired`。三条 `expiresIn*` 用 `{count, number}`，与 `chat.logsPanel.requestsCount` 那批同样经 node + `intl-messageformat` 实测过渲染串与旧模板字符串逐字节相同

测试侧无断言可同步：`MCPCredentialsTab` 与 `KeysPanel` 都没有测试文件，`src/components/chat/*.test.tsx` 里 grep `just now|m ago|h ago|d ago|分钟前|小时前|天前` 也没有命中，上收 4 个键不影响任何断言

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 3 warning，3 条全在 `KeysPanel.tsx`（`complexity` 与两条 `no-large-inline-object-arg`），与第 36 簇记录的 `KeysPanel` 基线逐条相同，`MCPCredentialsTab.tsx` 本身 0 条；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动 `.tsx`，两个消息目录没跑 prettier

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 425 到 426，46.7%；`components/chat` 11 个非测试文件接入 8 个，剩 3 个按大小排是 `UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6748 到 6764（`chat` 命名空间 116 到 128，`common` 183 到 187），中英同值 86 不变

## 2026-10-15 第 38 簇更新

批次 24 第 38 簇：`components/chat/ConversationList.tsx`（332 行，接入后 355）接入 `chat`，新开 `chat.conversationList.*` 10 键（含 `dateGroup.*` 4 个子键），两个消息目录各 +14 行、纯增不删（插在 `chat.logsPanel` 之后）

改造形态：

- `DateGroup` 是内部桶名——`getDateGroup` 的返回值、`DATE_GROUP_ORDER` 的排序与 `map` 的 key 都靠这几个英文串，只有落到分组标题那一刻才翻译。`dateGroupLabel(t, group)` 用 switch 逐分支写 `t("conversationList.dateGroup.recents")` 这样的字面量：写成 `t(\`conversationList.dateGroup.${slug}\`)` 的话 `missingKeys` 守卫（只匹配 `\bt\(\s*"…"`）看不见，键 union 也接不住模板串
- 分组标签没有借 `logs.timeRange.last7Days`（同为 `Last 7 Days`）：那边是筛选下拉的区间选项，这边是历史列表的时间桶，概念不同，且跨命名空间借要把整棵列表挂第二个翻译器，按第 29、33、36 簇的口径另开本命名空间键
- 复用 3 个 `common` 键：`rename`、`delete`、`cancel`。`delete` 在同一条目的 tooltip 与确认弹窗的 action 各出现一次，两处取值 `Delete` / `删除` 相同，没有开第二个键
- 删除确认的说明句没有借 `prompts.info.deleteWarn`：取值差一个句号（`This action cannot be undone.` 对 `This action cannot be undone`），且不在 `common`。ZH 写成不带句号的 `此操作无法撤销`，与本簇 EN 对齐
- 空态是 `No conversations yet` + `<br />` + `Start a new chat above` 两行，换行留在 JSX 里，两个键各管一行，没有把 `<br>` 塞进消息（`next-intl` 的rich message 要走 `<br/>` 标签语法，取值会变成标记串，不值当）

测试侧无断言可同步：`ConversationList` 没有测试文件，唯一消费者 `ChatShell.tsx` 的 `ChatShell.test.tsx:23` 把它整体 mock 成 `<div data-testid="conversation-list" />`，`src/app/chat/page.integration.test.tsx` 走第 35 簇补的 `LocaleProvider`，provider 已就位。判为数据不接键：`dayjs(conv.updatedAt).format("MMM D")` 与标题截断的 `…`（`slice(0, 40)` + `"\u2026"`）

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`；`npx tsc --noEmit` 总 883、非测试 0；`npx eslint src/components/chat/ConversationList.tsx` 0 error / 0 warning，HEAD 同样 0；`npm run build` exit 0；prettier 先证 HEAD 干净再 `--write`，只动 `.tsx`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 424 到 425，46.6%；`components/chat` 11 个非测试文件接入 7 个，剩 4 个按大小排是 `MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6738 到 6748（`chat` 命名空间 106 到 116），中英同值 86 不变

## 2026-10-15 第 37 簇更新

批次 24 第 37 簇：`components/chat/LogsPanel.tsx`（344 行，接入后 369）接入 `chat`，新开 `chat.logsPanel.*` 19 键，两个消息目录各 +21 行、纯增不删（插在 `chat.keysPanel` 之后）

改造形态：

- 6 个模块级组件（`StatusBadge`、`JsonBlock`、`LogsEmpty`、`LogsError`、`LogsTable`、`LogDetailDialog`）各自 `useTranslations("chat")`，不传 `t` prop（沿用第 31、32、34 簇）。`JsonBlock` 的 hook 写在 `if (value == null) return` 之前，保持 hook 先于早退
- 复用 3 个 `common` 键：`success`、`status`、`retry`（取值 `Success`/`成功`、`Status`/`状态`、`Retry`/`重试` 逐字节相同）。`common.previous`、`common.next` 没复用：英文同为 `Previous`/`Next`，中文是向导步骤的 `上一步`/`下一步`，概念不同，按"概念与取值都相同才复用"另开 `previousPage`/`nextPage`（`上一页`/`下一页`）
- `colModel`、`colCost`、`colTokens`、`colDuration` 四个键在表头与详情卡的四个小标题各用一次——同一字段的两种排版，取值相同，没有为卡片另开一组
- 计数行 `chat` 里第一条复数消息：`{count, plural, one {# request} other {# requests}}`。`# request` 的 `#` 后带空格，落进 `messagesParity` 的 `^#\s+\S` 合法形态；`intl-messageformat` 直测 `count: 1500` 渲染成 `1,500 requests`，带千位分隔，与原来 `total.toLocaleString()` + `request{s}` 逐字节相同（`count: 1` → `1 request`）。中文不复数，写 `{count, number} 次请求`。曾考虑把已有的 `{total}` 嵌进复数分支，`messagesParity` 会把嵌套括号判成未加引号的非占位符，作罢
- `pageOf` 的取值以 ` · ` 开头（` · Page {page} of {totalPages}` / ` · 第 {page} 页，共 {totalPages} 页`）：原来是模板串拼在计数后面，分隔符属于这句而不是那句，两个表达式相邻时 JSX 吃掉换行空白，拼接结果必须逐字节等于旧渲染
- 详情卡的 token 行拆成 `formatTokens(total)` 与括号外的 `tokensInAndOut`（`{prompt} in / {completion} out`），左括号跟着前一段文本、右括号单独一行；`LogsPanel.test.tsx` 里补了一条 `1,500 (输入 1,000 / 输出 500)` 断言盯这个拼接，用例数没变

判为数据不接键：时间范围胶囊的 `24h`/`7d`/`30d`、`moment` 的 `MMM D, HH:mm:ss`、`formatCost` 的 `$` 与 `toFixed`、`formatDuration` 的 `s` 与 `-`，归货币/数字与日期格式欠账

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx vitest run` 全量 886 文件 11576 例、59 失败，`LogsPanel` 唯一消费者 `src/app/chat/logs/page.tsx` 在复跑范围内且全绿，失败仍集中在长尾既有那批；`npx tsc --noEmit` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning，`git show HEAD` 覆盖工作区复测过同样是 0，本簇没新增；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动了 `.tsx`，两个消息目录没跑 prettier（HEAD 上同样报 warn，是既有状态）

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 423 到 424，46.5%；`components/chat` 11 个非测试文件接入 6 个，剩 5 个按大小排是 `ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6719 到 6738（`chat` 命名空间 87 到 106），中英同值 86 不变

## 2026-10-15 第 36 簇更新

批次 24 第 36 簇：`components/chat/KeysPanel.tsx`（399 行，接入后 419）接入 `chat`，新开 `chat.keysPanel.*` 34 键，两个消息目录各 +36 行、纯增不删（插在 `chat.messages` 之后）。`missingKeys` 与 `messagesParity` 两个守卫都在这簇抓到过真问题，见下

改造形态：

- 复用 5 个 `common` 键：`close`、`cancel`、`copied`、`noKeysFound`、`never`（"Never" 在空表与到期两处都用 `common.never`，取值 `Never` / `从不` 逐字节相同）。`Key Alias`、`Max Budget (USD)`、`TPM Limit`、`RPM Limit` 这些在 `teams`、`budgets`、`virtualKeys` 里都有同值键，但都不在 `common`，跨命名空间借要连带把整张面板挂第二个翻译器，按第 29、33 簇的口径另开本命名空间的键
- `relativeTime` 是模块级 helper，按首参翻译器约定改成 `relativeTime(t, iso)`，参数类型用 `ChatTranslator`（`src/lib/i18n/translators.ts`），不用裸 `ReturnType<typeof useTranslations>`
- 相对时间三个键是 `chat` 里第一次用带数字的消息。EN 写成 `{count, number}m ago` 而不是 `{count, plural, one {#m ago} other {#m ago}}`：`messagesParity` 的"未加引号的括号必须是占位符"那条只认 `#` 后带空格的 `# <文字>` 形态（`isLegitimate` 的 `^#\s+\S`），`#m ago` 会被判成占位符之外的裸括号；而加那个空格又会让英文从 `5m ago` 变成 `5 m ago`，破坏"EN 取值逐字节等于原渲染"。`{count, number}` 含逗号，守卫放行，两个 locale 实测都渲染成 `5m ago`（`intl-messageformat` 直测），中文侧再用 `{count, number} 分钟前`。EN 此前没有 `{count, number}` 先例，本簇开了第一条；ZH 已有 9 条
- 两处 `Current: {值}` / `New: {值}` 从 JSX 拼接改为带 `{expiry}` 占位符的消息，`(expired)` 后缀单独一键，空格写在 EN 取值里（`" (expired)"`），ZH 用全角括号不带空格
- premium 副标题那句 `". Rotate keys to ..."` 把句号留在取值开头：原渲染是 `View your virtual keys and spend` 与这句直接相邻（JSX 换行的空白会被吃掉，两个表达式之间不补空格），所以 `subtitle` + `rotateHint` 串起来必须逐字节等于原来那串。中文同理用句号开头 `。轮换密钥会生成新的凭据……`。这条与"句号属于取值内部"的既有口径一致，不是新约定
- 表头在骨架屏与真实表里各写一遍，两处都接同一组键，没有为骨架屏另开键

`maskKey` 的 `"sk-..."` 与单元格里 `${spend.toFixed(2)}` 的美元符号判为数据，前者是掩码占位、后者归货币与数字格式欠账

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint src/components/chat/KeysPanel.tsx` 0 error / 3 warning，用 `git show HEAD` 覆盖工作区复测过，同样 3 条（`complexity` 与两条 `no-large-inline-object-arg`），本簇没新增；`npm run build` exit 0；KeysPanel 没有测试文件，唯一消费者是 `src/app/chat/api-keys/page.tsx`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 422 到 423，46.4%；`components/chat` 11 个非测试文件接入 5 个，剩 6 个按大小排是 `LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6685 到 6719（`chat` 命名空间 53 到 87），中英同值 86 不变

## 2026-10-15 第 35 簇更新

批次 24 第 35 簇：`components/chat/ChatMessages.tsx`（473 行，接入后 486 行）接入 `chat`，新开 `chat.messages.*` 11 键。同簇把第 34 簇的 `chat.appsPanel.back` 收进 `common.back`——概念与取值都逐字节相同（`Back` / `返回`），没必要两处各存一份。两个消息目录各 +13 行、-1 行：新增 11 个键加组壳与逗号，删掉那 1 个重复键，除此之外仍是纯插不删

改造形态：

- 4 个只在文件内部使用的组件（`OmittedImage`、`ThinkingPlaceholder`、`CopyButton`、`ToolCard`）各自 `useTranslations("chat")`，不传 `t` prop（沿用第 31、32、34 簇）。`markdownWithoutImages` 的 `img` 分支原来是内联 `<span>{alt || "Image omitted"}</span>`，内联箭头函数在模块级常量里，挂不了 hook，所以换成 `<OmittedImage alt={alt} />`——`components` 那个对象保持模块级，不用 `useMemo` 重建，也不会让 react-markdown 每次渲染都换组件类型
- `Cancel`、`Copy` 复用 `common.cancel` / `common.copy`，走 `commonT = useTranslations("common")`（先例 `VirtualKeysPage/VirtualKeysTable.tsx:95-96`）。`missingKeys` 守卫只看 `\bt(`，看不到 `commonT(...)`，但 `AppConfig.Messages` 把键 union 绑到了命名空间，写错作用域是 tsc 报错，不会漏
- `Copied!` 没有复用 `common.copied`（那是 `Copied` / `已复制`，差一个感叹号），按"概念与取值都相同才复用"另开 `chat.messages.copied`
- `[stopped]` 是 `app/chat/page.tsx:233` 追加进消息正文的中断标记，属于数据不是文案：本簇只翻渲染时回显的那一段（`chat.messages.stopped`，EN 取值逐字节还是 `[stopped]`，ZH 为 `已停止`），剥离用的 `endsWith("[stopped]")` 不动，历史会话里已存好的正文照样能剥
- 3 处 `aria-label`（编辑框、编辑按钮、复制按钮）都接了键，可及名跟着 locale 走；`Edit message` 的 tooltip 与两处 `aria-label` 共用 `chat.messages.editMessage`

测试侧断言一处没改：`chat` / `liteadmin` / `app/chat` 三个目录 grep 过，`ChatMessages` 的文案此前没进过任何断言。要改的是 provider——`src/app/chat/page.integration.test.tsx` 原来两处都是裸 `render(<ChatConversationPage />)`，接入后子树里的 hook 找不到 `NextIntlClientProvider` 会直接抛，补成 `<LocaleProvider locale="zh-CN">`（同文件剩下的 `How can I help you today?`、`Send`、存储横幅仍断言英文，它们来自本簇没动的 `ChatShell.tsx`）。`LiteAdminConversation.tsx:43` 也渲染 `ChatMessageContent`，但 `LiteAdmin.integration.test.tsx` 的 `tree()` 本来就包了 `LocaleProvider`，不用动

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 三个改动文件 0 error / 5 warning（都是既有告警：`no-large-inline-object-arg`、`testing-library/no-node-access`）；`npm run build` exit 0；prettier 先证 HEAD 干净再跑，三个文件 unchanged

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 421 到 422，46.3%；`components/chat` 11 个非测试文件接入 4 个，剩 7 个按大小排是 `KeysPanel.tsx`（399）、`LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6675 到 6685（`chat` 命名空间 43 到 53），中英同值 86 不变

本簇新记的欠账：`formatTimestamp` 输出的是手写 `HH:MM`（`padStart` 拼串，没走 `Intl.DateTimeFormat`），与第 23、24 簇的时序格式同一口径，归"## 技术债"里的日期/数字欠账。`redactSensitiveValues` 打的 `[redacted]` 判为占位值不译，它进的是参数快照的展示与复制文本，跟 `logs` 侧那批哨兵值同类

## 2026-10-14 第 34 簇更新

批次 24 第 34 簇：`components/chat/MCPAppsPanel.tsx`（626 行，接入后 634，`chat` 目录最大的一个文件）接入 `chat`，新开 `chat.appsPanel.*` 29 键，两个消息目录各 +31 行、纯增不删（插在 `chat.connectPicker` 之后，命名空间内仍按簇的加入顺序排）

改造形态：

- 导出的助手组件 `OAuth2ConnectButton` 自己 `useTranslations("chat")`，不加 `t` prop（沿用第 31、32 簇的写法）；badge 与 button 两种形态共用 `connect` / `connecting` 两键
- `connectUnavailabilityLabel` 是 `useCallback`，`t` 进依赖数组（全仓 `.tsx` 已有 15 处 `, t]` 先例）。next-intl 的 `t` 按 locale memo，只有切换语言才换引用，不会让依赖它的 `oauthConnected` effect 反复重跑
- Information 三行原本是 `[["Server ID", v], ["Transport", v], ["Status", v]]` 且 `key={label}`，接 `t()` 后 key 会变成译文，给每行补一个稳定的首元 `rowKey`（`serverId` / `transport` / `status`），label 只管显示
- `{totalTools} tool{s} available` 交给 ICU：EN `{count, plural, one {# tool available} other {# tools available}}`，ZH 退化成 `{count, number} 个工具可用`。目录里 `{count, number}` 已有 5 处、`plural, other` 2 处，取多数写法；`{count, number}` 才带千分位（第 29 簇那条）
- 第 33 簇记下的尾巴收掉：本面板的 toast `Could not load tools for ${serverName}` 与 `connectPicker.loadToolsFailed` 英文值不同（少了后半句），仍不共键，另开 `appsPanel.loadToolsFailed`；`result?.error` 与 `catch` 两个分支照旧各留一次 `t(...)` 调用
- `detailServer.description ?? "MCP server"` 与卡片行 `server.description ?? "MCP server"` 同值同概念，共用一个 `defaultDescription`；它和标题键 `title` 的中文同为 `MCP 服务器`，英文单复数不同，不合并
- Beta 徽标开 `appsPanel.beta`，没有复用 `common.beta`：`common.beta`（`Beta` / `Beta 版`）此刻是死键，它该服务的是共享组件 `components/BetaBadge.tsx`（仍写死 `Beta`），留给共享组件那一簇接入；本面板的徽标是内联 markup，文案归 `chat` 这组。中文取值与 `common.beta` 对齐，`uppercase` 样式把它显示成 `BETA 版`，属样式不属文案
- 页签的 `Connected (${connectedCount})` 只把 `Connected` 收进 `tabConnected`，括号里的裸计数留在 `.tsx`，归"## 技术债"的日期/数字欠账

测试同步：`MCPAppsPanel.test.tsx` 的 3 个 render 点（`renderPanel`、`renderConnectPanel`、内联 `ConnectPanel`）各自新建 `QueryClient`，其中两处还要把同一个 client 传给 `rerender`，换 `renderWithProviders` 会共用测试客户端、动它的缓存与重试假设，所以沿用第 33 簇 `ConnectFlowSurface.test.tsx` 的办法，在原 wrapper 里补一层 `<LocaleProvider locale="zh-CN">`。断言改 10 处：`Connected (1)` / `Connected (2)` → `已连接 (1)` / `已连接 (2)`，`{ name: "Connect" }` → `{ name: "连接" }`（5 处，含 2 处 `fireEvent.click`），`queryByText("Connect", { exact: true })` → `"连接"`，`Not supported on this connection` → `该连接不支持`，`getByText("Connected", { exact: false })` 与它的 `toHaveTextContent` → `已连接`。`已连接` 与页签的 `tabConnected` 同值，那一处仍只有页签命中，不需要改 `getAllByText`

判为数据、不译：`handleTransport(...)` 返回的 `http` / `sse` / `stdio` / `openapi` 是 `TRANSPORT` 常量里的协议 id，只显示在"传输方式"的值位——`mcpServers.transport.*` 那 4 个键虽然存在，值是建服务器表单的选项文案（带"（推荐）""（SSE）"这类限定语），概念不同不能共键；`server_id`、`server_name` / `alias`、`tool.name` 与 `tool.description`（MCP 工具自述）、`logo_url` 与 alt 文本、首字母头像的 `N` 都取自后端；`queryByText("Not available to connected apps")` 那条负断言留着英文——组件从来没有这个字符串，断言的是"它不渲染"

验证：`chat` + `app/chat` + `app/connect` + `view_logs` + `src/lib/i18n` 67 文件 749 例全绿，未增删用例；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 2 个文件 `eslint` 0 错误，1 条 warning 是 `useUserMcpOAuthFlow({ accessToken, serverId, serverAlias, onSuccess })` 的内联对象，`git show HEAD` 复跑 lint 得到同一位置的同一条，属既有；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx，改前均合规；两个 messages JSON 各 31 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 420 到 421，46.2%；`components/chat` 11 个非测试文件接入 3 个，剩余 8 个里 `ConnectFlowSurface.tsx`（60 行）无自有文案，其余按大小排是 `ChatMessages.tsx`（473 行）、`KeysPanel.tsx`（399）、`LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）。键数 6646 到 6675（`chat` 命名空间 14 到 43），中英同值 86 不变

## 2026-10-14 第 33 簇更新

批次 24 第 33 簇：转入 `components/chat/`，先收网关连接流的 2 个文件 `ConnectFlowBanner.tsx`（119 行）与 `MCPConnectPicker.tsx`（133 行），新开顶层 `chat` 命名空间共 14 键（`chat.connectFlow.*` 12 键 + `chat.connectPicker.*` 2 键），两个消息目录各 +20 行、纯增不删

改造形态：

- `chat` 是这批目录的第一个新命名空间。顶层键在文件里按加入顺序排（`logs` 在 3722 行、`playground` 在 6110 行，都不是字母序），本簇把 `"chat": {` 插在 `"playground": {` 之前——既挨着同类界面，又是纯插不删；插在文件尾就要给上一个命名空间的闭括号补逗号
- 命名空间与 `playground` 分开，是因为 `playground` 整组属于 `app/(dashboard)/playground/components/chat_ui/`，两套界面的文案不能共键
- 模块级纯助手 `copyFor(flow, failed)` 改成 `copyFor(t, flow, failed)`，首参类型用新加的 `ChatTranslator`（`src/lib/i18n/translators.ts` 里按 `useChangePasswordTranslator` 之后的位置插入），不用裸 `ReturnType<typeof useTranslations>`
- 四个网关状态各有一条标题与说明，原本用模板串拼 `${clientLabel}` / `${serverLabel}`，现在整句进消息、变量交给 ICU 的 `{client}` / `{server}`。两条兜底标签 `"the application"` / `"the requested MCP server"` 也跟着成为键（`fallbackClient` / `fallbackServer`），因为中文里它们要嵌进句子，不能留着英文原串
- `allowTitle` 被 interactive 与 m2m 两个分支共用（原代码两处模板串逐字相同），所以只开一个键
- picker 的 toast 文案在 `result?.error` 与 `catch` 两个分支重复，原代码本就重复，翻完仍保留两处 `t(...)` 调用，不提前抽变量

测试同步：这 2 个组件此前都在裸 `render()` 下测，接入 `next-intl` 后没有 provider 会直接抛，所以 `ConnectFlowBanner.test.tsx` 与 `MCPConnectPicker.test.tsx` 改用 `renderWithProviders`（默认钉 `zh-CN`）。`ConnectFlowSurface.test.tsx` 不用 `renderWithProviders`——它自带一个每次新建的 `QueryClient` 并 mock 掉 `next/navigation`，改成共用测试客户端会牵动它自己的重试与缓存假设，所以在原 wrapper 里只补一层 `<LocaleProvider locale="zh-CN">`。断言改 8 处：`/finish connecting/i`（4）与合并式 `/finish connecting|cancel|connect/i`（1）转中文，`"Cancel"`（3）转 `"取消"`；合并式里保留 `connect` 这一段，因为 OAuth 按钮的文案在 `MCPAppsPanel.tsx`，本簇没动它

判为数据、不译：表单 `action` 与 `name="flow"` / `name="decision"` / `value="deny"` / `value="manual"` 是提交给网关的协议字段；`client_origin`、`server_name`、`logo_url` 与 `external_logo logo` 这类 alt 文本取自后端；`MCPAppsPanel.tsx` 的 267/275 行 `Could not load tools for ${serverName}` 与 343 行 `No MCP servers configured. Add servers in Tools -> MCP Servers.` 看着和 picker 的两键同形，英文值却不一样（少了后半句、多了导航路径），不共键，留给 `chat` 的下一簇

验证：`chat` + `app/chat` + `app/connect` + `view_logs` + `src/lib/i18n` 67 文件 749 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 6 个文件 `eslint` 0 错误、8 条 warning 全在 `ConnectFlowSurface.test.tsx` 的既有 container/node 访问上；`npm run build` 退出 0；prettier 只 `--write` 本簇 6 个 tsx，改前全部合规；两个 messages JSON 各 20 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 418 到 420，46.1%；`components/chat` 11 个非测试文件接入 2 个，`ConnectFlowSurface.tsx` 经核实没有自有文案（只有 JSDoc 注释），不进接入清单。键数 6632 到 6646，中英同值 86 不变

## 2026-10-14 第 32 簇更新

批次 24 第 32 簇：`components/view_logs/LogDetailsDrawer/LogDetailContent.tsx`（819 行，`view_logs` 目录最后一个仍带自有硬编码文案的文件）接入 `logs`，新增 `logs.detail.*` 47 键与 `logs.guardrail.notRunSuffix`，两个消息目录各 +50 行、纯增不删。`components/view_logs` 整目录的展示文案到此清零

改造形态：

- 文件里 12 个区块组件与两个小助手（`MetricLabel`、`CopyButton`）各自 `useTranslations("logs")`，沿用第 31 簇空态的写法，不给它们加 `t` prop；只有顶层 `LogDetailContent` 的 `t` 是原本就有的
- `CopyButton` 的 `label` 是 `string` prop，翻不动，所以调用点显式传 `detail.copyJson` / `detail.copyMetadata`；`MetricLabel` 的 `{label} info` 可及名收进 `detail.infoAria`，由组件内部解析
- 删掉两个模块级常量 `RESPONSE_CACHE_TOOLTIP`、`CACHE_KEY_TOOLTIP`，英文原值逐字节搬进消息目录，`MetricsSection` 取回来存 4 个局部变量再传给 `MetricLabel`（tooltip 是 `string` prop，不能传 key）。`@/utils/promptCacheUsage` 的 `PROMPT_CACHE_{READ,CREATION}_TOOLTIP` 本簇停止 import 但文件留着——`chat_ui/ResponseMetrics.tsx` 还在用，收编它的那一簇会一并处理，期间英文说明在 util 与目录里并存，属有意重复
- 7 处复用已有键：`requestDetails`、`model`、`tokens`、`cost` 四个顶层通用标量，加 `columns.tags`、`drawer.provider`、`filters.credential` 三个同目录既有键；其余 41 个是新键
- 新键插在 `"logs": {` 之后开新组，`notRunSuffix` 插在 `"guardrail": {` 之后，两处都是纯增不删
- 单复数交给 ICU：跳转徽标的 `${n} guardrail${n !== 1 ? "s" : ""} evaluated` 改 `t("guardrail.guardrailsEvaluated", { count })`（第 30 簇已定形的键，此处直接复用），`, ${n} not run` 拆成独立的 `notRunSuffix`，中文用全角逗号把衔接写进消息值

判为数据、不译：`errorInfo.error_message || "An error occurred"` 是合成的错误载荷，进 `JsonViewer` 也进复制文本，不是界面标签；`"Cache OFF"` 是判断哨兵；`custom_llm_provider || "-"`、`JSON` 页签名、`SYSTEM` / `ASSISTANT` 角色 chip（`InputCard.tsx` / `OutputCard.tsx` / `RealtimePrettyView.tsx`，协议角色名）、`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING` 分级 chip（`RoutingDecisionCard.tsx`，沿第 20 簇"四个等级名固定不译"的先例）。moment 的 `"YYYY-MM-DDTHH:mm:ss.SSS[Z]"`、`-` / `s` / `ms` / `2 / 3` / `42.50 ms` 这类时序与数字格式仍归"## 技术债"的日期/数字欠账

测试同步：`LogDetailContent.integration.test.tsx` 改 41 处文本断言加 2 处 `getAllByRole("img", { name: /info/i })` 到 `{ name: /信息/ }`；`gpt-4o`、`anthropic`、`batch_abc123`、`abc123cachekey`、`PII Filter`、`42.50 ms`、`2 / 3`、`JSON` 这些后端值与不译项不动，`queryByText("Cache Hit")` 的负断言照旧成立；用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`LogDetailContent.tsx` `eslint` 0 错误、11 条 warning 与改前同样数量（全是既有 `no-explicit-any`）；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx，改前均合规；两个 messages JSON 各 50 增 0 删

覆盖率复测：非测试 `.tsx` 912 个、已接入 418 个都不变（本文件此前已接入，只是还留英文），45.8%；`components/view_logs` 71 个里接入 60 个也不变，剩下 11 个是第 31 簇核实过的无文案文件。键数 6584 到 6632，中英同值 86 不变

## 2026-10-14 第 31 簇更新

批次 24 第 31 簇：`components/view_logs/` 根目录的收尾——`log_filter_logic.tsx`、`RequestLogsTable.tsx`、`RequestLogsPanel.tsx`、`index.tsx` 四个文件，新增 10 键，两个消息目录各 +12 行（10 个键 + `"table": {` 与闭括号）。根目录的展示文案到此清零，剩下的硬编码集中在 `LogDetailsDrawer/`，归下一簇

改造形态：

- `LOG_FILTER_LABELS: Record<string, string>` 改为 `LOG_FILTER_LABEL_KEYS: Record<string, LogsFilterLabelKey>`，15 个筛选标签只存键名，翻译落在消费点 `RequestLogsTable.tsx`，按 `VirtualKeysPage/VirtualKeysTable.tsx` 的口径用 `useMemo` 把 `Object.entries` 映射成 `Record<string, string>` 再交给 `DataTableToolbar` 的 `filterLabels`。该表只有一个消费者，没有别的调用点要跟着改
- 15 个标签里 13 个复用已有键：12 个走 `logs.filters.*`，`Status` 与 `Model` 用顶层的 `logs.status` / `logs.model`（取值逐字节相同，概念也一样）。新建的只有 `logs.filters.search`。它没有改用 `common.search`，是因为同一张表的键必须落在同一命名空间：`LogsFilterLabelKey` 的键取自 `LogsTranslator` 的键 union，掺进 `common` 就得在同一个 `useMemo` 里挂第二个翻译器。`VirtualKeysTable` 能直接用 `common`，是因为它整张表都在 `common`
- `RequestLogsEmptyState` 内部自己 `useTranslations("logs")`，与同目录 `AuditLogsEmptyState` 写法一致，不给组件加 `t` prop。`AuditLogsTable` 的空态四键（`empty` / `emptyDesc` / `emptyFiltered` / `emptyFilteredDesc`）也是新组 `logs.table.*` 的命名依据
- `logs.backToLogs` 按 `teams.infoBackToTeams` / `users.infoBackToUsers` 的既有命名排；面板标题不新开键，复用 `logs.tabs.requestLogs`
- `index.tsx` 的 `aria-label="Loading"` 接 `logs.loading`。那个组件已有的 `t` 绑在 `logs.tabs` 上，所以另起一个 `logsT = useTranslations("logs")`，不去改前者的命名空间（tabs 的键全是 `t("requestLogs")` 这种短路径，换绑要动 4 处）

判为数据、不译：`RequestLogsTableColumns.tsx:154` 的 `"Success"` 是 `status` 字段的兜底值，只参与 `status.toLowerCase() !== "failure"` 判断，渲染走 `t("success")` / `t("failure")`；`AuditLogDrawer.tsx:50` 的 `console.error("Copy failed:", e)` 不是用户可见文案。这两条此前被记在漏网清单里，本簇核实后划掉

共享组件欠账（本簇绕开、没在原地修）：`DataTableToolbar.tsx:78` 的 `aria-label={\`Remove ${label} filter\`}` 模板本身是英文，标签翻完之后按钮可及名成了 `Remove 搜索 filter`；`DataTableFilterDrawer.tsx:49` 的默认 `title = "Filters"` 同理。后者本簇在调用点显式传 `logs.table.filtersTitle`，前者留给 `common_components` 长尾，改它要先决定模板进哪个命名空间

测试同步：`RequestLogsPanel.test.tsx` 改 2 处（chip 文本 `搜索:sess-42` 与上面的按钮名），用例数不增不减。`log_filter_logic.test.tsx` 与 `RequestLogsTable` 没有测试依赖 `LOG_FILTER_LABELS`（该目录不存在 `RequestLogsTable.test.tsx`，面板测试走的是渲染结果）

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 4 个文件 `eslint` 0 错误、6 条 warning 全在既有代码行（新增块没触发规则）；`npm run build` 退出 0；prettier 只 `--write` 本簇 4 个 tsx，其中 2 个改前就合规；两个 messages JSON 各 12 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 417 到 418，45.8%；`components/view_logs` 71 个里接入 60 个，剩 11 个经核实全部没有自有文案——`columns.tsx`（类型与排序映射）、`logs_utils.tsx` 与 `AuditLogsTableColumns.tsx` 与 `log_filter_logic.tsx`（本簇起改为接收/只存键名）、`ToolsSection/JsonToolView.tsx` 与 `LogDetailsDrawer/` 的 `SimpleMessageBlock.tsx` / `PrettyMessagesView.tsx`（标签来自 props）、`TraceView/` 的 `SpanIcon` / `Collapse` / `ActiveDot` / `AgentTracesPage`。键数 6574 到 6584，中英同值 86 不变

## 2026-10-14 第 30 簇更新

批次 24 第 30 簇：`components/view_logs/GuardrailViewer/GuardrailViewer.tsx`（851 行）接入 `logs`，沿用第 29 簇的 `logs.guardrail.*` 组并新增 39 键，两个消息目录各 +39 行。`GuardrailViewer/` 目录的展示文案到此清零，5 个非测试 `.tsx` 全部接入

改造形态：

- `formatMode(mode)` 按首参翻译器约定改成 `formatMode(t, mode)`，并加 `MODE_LABEL: Record<string, ModeLabelKey>`：`pre_call` / `post_call` / `during_call` / `logging_only` 四个阶段名走消息，表里没有的值仍按原来的 `replace(/_/g, "-").toUpperCase()` 渲染。这样后端新增阶段名不会变成空白
- `OUTCOME_LABEL` 从 `Record<EntryOutcome, string>` 改值为键名的 `Record<EntryOutcome, OutcomeLabelKey>`，渲染处 `t(OUTCOME_LABEL[outcome])`。徽标文本在卡片头、时间轴行与折叠态各出现一次，走同一张表
- 时间轴的条目在 `useMemo` 里拼好 `label` 再渲染，所以 `t` 进了依赖数组（`[sorted, t]`）。`TimelineEntry.label` 仍是 `string`，类型不用动
- 单复数交给 ICU：`guardrailsEvaluated` 与 `textRecords` 英文写 `{count, plural, one {# …} other {# …}}`，中文退化成量词短语并用 `{count, number}` 保住千分位。原代码 JSX 里的 `textRecords.toLocaleString()` 与 `{textRecords === 1 ? "" : "s"}` 一起去掉，`#` 本身带千分位
- 复用第 29 簇的键：匹配详情表的 `Type` / `Action` 用 `guardrail.thType` / `thAction`，分类区的 `Category:` / `Confidence:` 用 `guardrail.colCategory` / `colConfidence`——同一个 `guardrail` 组、同一个概念，不再另开键
- 新键插在 `"guardrail": {` 之后而不是组尾。插组尾要给原末键补逗号，`git diff --numstat` 就出现删除行；插组首则纯增不删。第 29 簇靠新开组吸收了那个逗号，本簇没有新组可开
- 时间轴的偏移量 `T+{ms}ms`、`formatDurationMs` 的 `{ms}ms` 与导出文件名 `guardrail-compliance-log-<日期>.json` 都留在 `.tsx` 里，属时序数值格式，归"## 技术债"的日期/数字欠账。测试里 `/^T\+/` 的负断言因此照旧成立

不译：`masked_entity_count` 的 `{entityType}: {count}` 与 `match.type` / `detection_method` / `action_taken`（含 `BLOCK`）、`entry.detection_method.split(",")[0]`、后端返回的 `guardrail_name` / `policy_template`、`"guardrail"` 这个 key 兜底串、以及 `—` / `-` 两个哨兵

测试同步：`GuardrailViewer.test.tsx` 改 26 处。标题 `护栏与策略合规`（5）、状态徽标 `通过` / `已标记` / `失败` / `未执行`、计数 `通过 1` / `标记 1` / `未执行 1` / `已评估 0 个护栏`、阶段徽标 `PRE-CALL` 到 `调用前`（2）、时间轴 `收到请求` / `LLM 调用` / `返回响应` 与 `调用前护栏：conduct` 一类带名字的 6 条、命中计数 `命中 3` 与 `/命中/`。`pii-rail`、`no scannable content after message scoping`、`EMAIL_ADDRESS: 2`、`T+250ms`、`1235ms` 这些后端值与格式不动。exact 与 regex 分工要留意：`getByText("通过")` 只匹配徽标元素，`/通过 1/` 只匹配头部计数，中文同名概念靠这点区分才不会撞。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`GuardrailViewer/` 整目录 `eslint` 0 错误、25 条 warning，与第 29 簇后同样数量；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx；两个 messages JSON 各 39 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 416 到 417，45.7%；`components/view_logs` 71 个里接入 59 个，剩 12 个里 4 个是 `TraceView` 的无文案文件，其余为根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6535 到 6574，中英同值 86 不变

## 2026-10-14 第 29 簇更新

批次 24 第 29 簇：`components/view_logs/GuardrailViewer/` 的 4 个展示组件 `PresidioDetectedEntities.tsx`、`ContentFilterDetails.tsx`、`CompliancePanel.tsx`、`BedrockGuardrailDetails.tsx` 接入 `logs`，新增 `logs.guardrail.*` 71 键，两个消息目录各 +73 行（71 个键 + `"guardrail": {` 一行 + `vectorStore` 闭括号补逗号另起一行），纯增不删。目录里只剩 851 行的 `GuardrailViewer.tsx` 留给下一簇

改造形态：

- 四个组件共用一个 `guardrail` 组。护栏术语（detected / masked / blocked / coverage / usage / assessment）在本目录反复出现，键名靠语义前后缀区分（`blockedChip` 对 `colBlockedResponse`、`textGuardedChip` 对 `textCoverageChip`），不再按组件拆组
- `boolPill(b)` 是模块级 helper，按首参翻译器约定改成 `boolPill(t, b)`，调用点同步。`BedrockGuardrailDetails.tsx` 因此 `import type { LogsTranslator }`，而不是裸 `ReturnType<typeof useTranslations>`——后者会把键联合放宽到整个 `logs` 命名空间，写错键名检查不出来（`src/lib/i18n/translators.ts` 的注释就是这条）
- `assess.topicPolicy.topics.map((t, i) => …)` 的形参会遮蔽翻译器，改名 `topic`。这类遮蔽 tsc 未必报错（`t` 恰好也是可调用值），但渲染期就坏，接线时每个 map 形参都要过一遍
- 计数 chip 从模板串抽成带 `{count}` 的消息（`blockedChip`、`maskedChip`、`patternsChip`、`keywordsChip`、`categoriesChip`、`detectedEntities`）；覆盖率 chip 带 `{guarded}` / `{total}` 两个占位，调用度量区另配 `textCoverageChip` / `imagesCoverageChip`，因为中文里两处语序不同
- 合规徽标走三元键名 `t(data.compliant ? "guardrail.compliantBadge" : "guardrail.nonCompliantBadge")`
- `CompliancePanel` 的 hook 在私有子组件 `ComplianceCard` 与主组件各调一次，不做 props 透传。两条 `.catch` 里 `err.message ||` 右侧的兜底文案（`euAiActCheckFailed` / `gdprCheckFailed`）落在渲染路径上，一并接 `t`，`useEffect` 依赖数组随之加 `t`
- 两张表（词表/内容策略、上下文落地）的同名表头复用 `thType` / `thAction` / `thDetected` 各两次；`Section` 标题、`<h6>` 小节名与 `<KV label>` 冒标签各自成键，中英的冒号与全角括号都收在消息值里

不译：

- 法规与产品名 `EU AI Act`、`GDPR`、`PII`、`Bedrock`，以及 AWS 风格的 kebab 动作标签 `word` / `content` / `topic` / `sensitive-info` / `contextual-grounding` / `automated-reasoning`
- usage pill 渲染的是 `{k}: {v}`，`k` 取自后端 `response.usage` 的键名（`contentPolicyUnits` 等），属数据值；`BedrockGuardrailDetails` 底部折叠区的 JSON 原文同样只有标题译了
- `ComplianceCard` 展开体的 `check.check_name` / `check.article` / `check.detail` 全部来自合规接口
- 哨兵值 `—`、`N/A`、`unknown`、`regex`、`topic` 与动作码 `BLOCK` / `GUARDRAIL_INTERVENED` 照旧

测试同步：`PresidioDetectedEntities.test.tsx` 改 8 处（`得分：0.92`、`位置：10-20`、`实体类型：`、`第 10-20 个字符`、`置信度：`、`识别器：`、`说明：`、`第 0-0 个字符`）；`BedrockGuardrailDetails.test.tsx` 改 20 处（`处置：`、`文本已防护 27/100`、`图片已防护 1/3`、`输出`、`评估 #1` 2 处、`词策略`、`自定义词`、`托管词表`、`上下文落地`、`getAllByText("得分")`、`getAllByText("阈值")`、`敏感信息`、`PII 实体`、`自定义正则`、`话题策略`、`调用度量`、`原始 Bedrock 护栏响应`、`（非文本输出）`）；`GuardrailViewer.test.tsx` 改 3 处（`/检出实体/`、`/原始 Bedrock 护栏响应/` 两条负断言与 `输出`）。`contentPolicyUnits: 7`、`wordPolicyUnits: 1`、`"weapons"`、`"Policy violation"`、`"[blocked]"` 这些数据值断言不动；`GuardrailViewer.tsx` 自己的 `Guardrails & Policy Compliance`、`PRE-CALL`、`/Pre-call guardrail:/`、`pii-rail` 还是英文，随下一簇处理。`ContentFilterDetails.tsx` 与 `CompliancePanel.tsx` 没有对应测试文件。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`GuardrailViewer/` 整目录 `eslint` 0 错误、25 条 warning，全是既有代码形态（`complexity`、`no-nested-ternary`、`no-explicit-any`、`no-large-inline-object-arg`），本簇没新增告警类别；`npm run build` 退出 0；prettier 只 `--write` 本簇 3 个 tsx，两个 messages JSON 各 73 增 0 删

顺带记一条方法债：本簇用 `git show HEAD:… | eslint --stdin` 复测 HEAD 时，同一批文件在 HEAD 报出了当前树里并不存在的 error（`no-nested-ternary`、`react-hooks` 的 setState 告警升级为 error）。这个目录靠 `--stdin` 复测不可信，缺 `.tsx` 上下文与类型信息时会换一套规则结果，以当前树的 `npx eslint <目录>` 为准，本簇结论按这条口径写

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 412 到 416，45.6%；`components/view_logs` 71 个里接入 58 个，剩 13 个里 4 个是 `TraceView` 的无文案文件，其余为 `GuardrailViewer/GuardrailViewer.tsx` 与根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6464 到 6535，中英同值 86 不变

## 2026-10-14 第 28 簇更新

批次 24 第 28 簇：`components/view_logs/` 根目录的 4 个查看器 `ConfigInfoMessage.tsx`、`CostBreakdownViewer.tsx`、`EvalViewer/EvalViewer.tsx`、`VectorStoreViewer.tsx` 接入 `logs`，新增 `logs.configInfo.*` 3 键、`logs.costBreakdown.*` 17 键、`logs.eval.*` 17 键、`logs.vectorStore.*` 11 键，共 48 键；两个消息目录各 +56 行，纯增不删

改造形态：

- `ConfigInfoMessage` 的正文段是 `t.rich`，`<code>` 包 `proxy_config.yaml`、`<strong>` 包 `Admin Settings → Logging Settings`，两个处理器各接 `chunks`
- hook 一律早于早退：`ConfigInfoMessage` 的 `t` 在 `if (!show) return null;` 之前，`VectorStoreViewer` 在两个 `useState` 之后、`if (!data || data.length === 0)` 之前；`EvalViewer` 与私有子组件 `EvalEntryCard` 各调一次，不做 props 透传
- `CostBreakdownViewer` 的三处 token 计数从模板串抽成带占位符的消息（`tokensCount` / `promptTokensCount` / `completionTokensCount`），数字仍在组件里 `toLocaleString()`；折扣与利润加成的百分比括注同理收进 `discountPct` / `marginPct`，`formatPercent` 的结果走 `{percent}`
- `eval.scoreValue` 的值 `"{score} / 100"` 是纯数字加分隔符，中英一致，这就是同值键从 85 到 86 的那一个
- `vectorStore.logoAlt` 沿用 `mcpServers.tools.serverLogoAlt` 的既有口径：英文 `"{name} logo"`、中文 `"{name} Logo"`，Logo 属产品词不译
- 通过/未通过徽标走三元键名 `t(passed ? "eval.passed" : "eval.failed")`，与前面几簇同一写法

不译：

- `general_settings:` 那段 YAML 是要复制进配置文件的代码块，`<pre>` 里的三行照旧
- `additional_costs` 的键名（`Azure Model Router Flat Cost`、`Routing Fee` 等）是后端返回的数据值，连渲染时补的那个 ASCII 冒号一起留在 `.tsx` 里
- `vectorStore` 的 `formatTime` 用 `date.toLocaleString()`、耗时是 `${duration.toFixed(2)}ms`，两者都归"## 技术债"里的日期/数字格式欠账，本簇不动
- `Admin Settings → Logging Settings` 是菜单路径，中文值里按前面几簇的口径保留英文原文

测试同步：`ConfigInfoMessage.test.tsx` 从裸 `render` 换成 `renderWithProviders`（固定 zh-CN），标题断言改 `请求/响应数据不可用`；`CostBreakdownViewer.test.tsx` 改 17 处（`成本明细` 3、`输入成本：` / `输出成本：` / `最终计算成本：` 各 2、`提示缓存读取成本：` / `提示缓存写入成本：` 各 1、`/500 个输入令牌/`、`/200 个输出令牌/`、`/（已缓存）/`、`/折扣（10\.00%）/`、`/利润加成（15\.00%）/`）；`LogDetailContent.integration.test.tsx` 改 3 处（`请求/响应数据不可用` 2、`向量存储请求` 1）。`additional_costs` 的 5 条数据键断言、`should reference Admin Settings → Logging Settings` 那条正则、`/prompt tokens \+ .* completion tokens/` 的负断言与 `Start Time` / `End Time` / `Provider` 这些 `LogDetailContent` 自己的描述项标签都不动。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；这 7 个文件 `eslint` 0 错误、6 条 warning 全在既有行（`CostBreakdownViewer` 的 5 条 `complexity` / 条件链与 `VectorStoreViewer` 的 1 条 `<img>`，用 `git show HEAD:… | eslint --stdin` 复测 HEAD 同样是这 5 条）；`npm run build` 退出 0；prettier 只 `--write` 了 3 个查看器 tsx，两个 messages JSON 继续不做整文件重排，`git diff --numstat` 各 56 增 0 删；`PLAN.md` 与 `PROGRESS.md` 在 HEAD 上就不是 prettier 干净（表格会被整体重排），同样不 `--write`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 408 到 412，45.2%；`components/view_logs` 71 个里接入 54 个，剩 17 个里 4 个是 `TraceView` 的无文案文件，其余为 `GuardrailViewer/` 5 个与根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6416 到 6464，中英同值 85 到 86

## 2026-10-14 第 27 簇更新

批次 24 第 27 簇：`components/view_logs/TraceView/TracingSetupCard.tsx` 接入 `logs`，新增 `logs.traceSetup.*` 51 键，两个消息目录各 +53 行（组的开合括号 2 行、`traceList` 末键补逗号 1 行），纯增不删。`TraceView` 目录的展示文案到此清零，24 个非测试 `.tsx` 里 20 个接入 `next-intl`，另外 4 个（`ActiveDot` / `Collapse` / `SpanIcon` / `AgentTracesPage`）本就没有文案

改造形态：

- `otlpEndpoints(proxyUrl)` 按首参翻译器约定改成 `otlpEndpoints(t, proxyUrl)`，返回类型不变；`setupTitle(enabled, connected)` 同样补首参 `t`。两者都是文件内私有，`otlpEndpoints` 虽是 `export`，测试没有直接调用它
- `SEND_LABEL` 从 `Record<kind, string>` 改成 `Record<Exclude<SendState["kind"], "ready">, SendLabelKey>`，值为键名联合类型，渲染处 `t(SEND_LABEL[state.kind])`。`idle` 与 `failed` 共用 `traceSetup.sendTest`
- 标题里的两枚品牌 logo 是本簇唯一的富文本：`traceSetup.stepCodingAgent` 用 `t.rich` 加 `<claude></claude>` / `<codex></codex>` 成对标签，处理器各返回一个 `<img>`。实测 `t.rich` 不替换自闭合标签（`<claude />` 原样输出），只认成对写法
- `messagesParity.test.ts` 的 `RICH_TAGS` 白名单同步加 `claude`、`codex`。这条守卫允许 `t.rich` 的消息保留真标签，不加就会被"尖括号必须属于富文本标签"那条拦下
- 复用已有键不新开：`drawer.copy`（`CodeBlock` 的 `aria-label="Copy"`）、`drawer.copyLabel`（`EndpointValue` 的 `aria-label={`Copy ${value}`}`，值走 `{label}` 占位）
- 长段落整段收进消息值：`enableOnProxyBody` / `tracingKeyBody` / `noTracesYet` / `codingAgentBody` 等，英文值与原 JSX 逐字一致，换行折回来的空格差异因此不存在；`exampleRun` 与 `exampleRunNote` 拆两键，JSX 用 `{" "}` 保留两个 `<span>` 之间那个空格

不译与一处取舍：

- 代码与环境变量都不译：`FRAMEWORKS` 的 `label` / `packages` / `quickstart`、`tracingEnvSnippet`、`codingAgentPrompt`（这是要贴给 Claude Code / Codex 的英文任务描述）、`codingAgentCommand`、`PROXY_CONFIG_SNIPPET`、`TRACING_KEY_REQUEST`（`key_alias: "Agent tracing"` 会落进虚拟密钥列表，属数据值）、`FileLabel` 的 `config.yaml` / `npm` / `Shell` / `my_agent.py`、`LineTabs` 的 `["Claude Code", "Codex"]` / `["pip", "uv"]`、端点值 `OTEL_EXPORTER_OTLP_ENDPOINT` 与 `Authorization: Bearer <LiteLLM virtual key>`、`OTLP/HTTP, protobuf or JSON (gRPC not supported)`、`DOCS_URL`
- 端点值的 `<LiteLLM virtual key>` 带尖括号但不进目录，所以不用 ICU 转义，这是它留在 `.tsx` 里的一个附带好处
- `stepCodingAgent` 的英文原文里 `or` 与第二枚 logo 之间没有空格（JSX 换行接 `<img>`），消息值同样写成 `or<codex></codex>`，中英文各自保留自己语言需要的空格

测试同步：`TracingSetupCard.test.tsx` 改 32 行断言、共 33 处替换（标题、状态行、按钮名、`OpenTelemetry（OTEL）接收端点` 与 `你的智能体框架` 的先后顺序、`复制 http://proxy.test/v1/traces` 这条 aria、`无法发送测试调用链。`、`/调用链仍不可用/`），`AgentTracesSection.test.tsx` 改 17 处对 setup 卡的断言（`未启用调用链`、`检查配置`、`正在检查…`、`启用调用链`、`ClickHouse 与代理配置`、`请联系你的代理管理员`、`连接你的智能体`、`等待你的第一条调用链`、`检查调用链`、`/调用链仍不可用/`）。两个文件的 `detail` 入参 `"Agent tracing is not enabled"`、`store: clickhouse` 与"setup snippets"那个 describe 块都是纯函数断言，输入输出全在英文代码串层面，照旧不动。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView src/lib/i18n` 0 错误（9 条 warning：`TracingSetupCard` 的 6 条 `<img>` 与 `messagesParity` 的 3 条既有行）；`npm run build` 退出 0；prettier 只 `--write` 了 `TracingSetupCard.tsx`（HEAD 上干净），两个 messages JSON 继续不做整文件重排，`git diff --numstat` 各 53 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 407 到 408，44.7%；`components/view_logs` 71 个里接入 50 个；`TraceView` 24 个里接入 20 个。键数 6365 到 6416，中英同值 85 不变

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
| 命名空间                 | 40（此前记 39 是数错，`en.json` 顶层键实际一直是 40 个）|
| `en.json` 叶子键          | 6748（2026-10-15 第 38 簇；6738 是第 37 簇后，6719 是第 36 簇后，6685 是第 35 簇后，6675 是第 34 簇后，6646 是第 33 簇后，6632 是第 32 簇后，6584 是第 31 簇后，6574 是第 30 簇后，6535 是第 29 簇后，6464 是第 28 簇后，6416 是第 27 簇后，6365 是第 26 簇后）|
| `zh-CN.json` 叶子键       | 6748                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 86（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 86 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%（2026-10-13，未记录命令）。2026-10-14 用"## 复测的三个数字"里的命令重测为 912 / 360，覆盖率 39.5%，第 14 簇后为 912 / 361，覆盖率 39.6%，第 18 簇后 912 / 375（41.1%），第 19 簇后 912 / 379（41.6%），第 20 簇后 912 / 380（41.7%），第 23 簇后 912 / 388（42.5%），第 24 簇后 912 / 399（43.7%），第 25 簇后 912 / 405（44.4%），第 26 簇后 912 / 407（44.6%），第 27 簇后 912 / 408（44.7%），第 28 簇后 912 / 412（45.2%），第 29 簇后 912 / 416（45.6%），第 30 簇后 912 / 417（45.7%），第 31 簇后 912 / 418（45.8%），第 32 簇后 912 / 418（45.8%，本簇文件此前已接入，比率不变），第 33 簇后 912 / 420（46.1%），第 34 簇后 912 / 421（46.2%），第 35 簇后 912 / 422（46.3%），第 36 簇后 912 / 423（46.4%），第 37 簇后 912 / 424（46.5%），第 38 簇后 912 / 425（46.6%）；分母与分子的口径都对不上旧那条，两组数字并列，只看趋势

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
