# 开发进度

数据快照 2026-10-14，分支 `main`。**汉化尚未完成**，剩余量见"## 汉化完成度实测"；目录规模、欠账清单与文件覆盖率随每次提交更新。最新的测试统计见"批次 24：add_model 与 edit_auto_router"一节（11576 例、54 失败），"### 修复后的复核"的 11308 例 / 1 失败与 `## 测试状态` 的表格都是更早的快照，保留用于对照起点

## 2026-10-14 更新

批次 24 第 13 簇：`src/components/view_logs/RequestLogsFilters.tsx`（请求日志筛选面板的 14 个筛选字段）接入 `logs` 命名空间，新增 41 个 `logs.filters.*` 键，同时复用已有的 `logs.status`、`logs.model`、`logs.allStatuses`、`logs.success`、`logs.failure`。没有借其他命名空间的同名键，`ARCHITECTURE.md` 记着跨命名空间借键是历史 bug 族

四个模块作用域的标签表（`STATUS_FILTER_ITEMS`、`CACHE_FILTER_ITEMS`、`CREDENTIAL_FILTER_ITEMS`、`SPAN_TYPE_FILTER_ITEMS`）改成组件内的 `useMemo`，依赖数组带 `t`，与 `VirtualKeysTable.tsx` 的既有写法一致。`CREDENTIAL_FILTER_ITEMS` 原本从 `constants.ts` 的 `CREDENTIAL_LABELS` 展开，现在直接写 `"true"` / `"false"` 两个字面量值，`CREDENTIAL_LABELS` 只剩 `LogDetailContent.tsx` 一个消费方，那一簇改完就可以删

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

2026-10-14 实测：非测试 `.tsx` 共 912 个，已接入 360 个，覆盖率 39.5%。此前记的 861 / 305 复现不出来，那条没写命令，两个数都对不上今天这个口径，所以并列记录，不要拿 39.5% 减 35.4% 当进度

目录规模同步复测：命名空间 39 个不变，两侧叶子键各 5978（10-13 记的 5228 是第 5 到 12 簇补键之前的数），中英文取值完全相同的键 78 个，本簇贡献其中 2 个（`logs.filters.options.llm` / `.mcp`）

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
| `en.json` 叶子键          | 5978（2026-10-14；10-13 记的 5228 是第 5 到 12 簇补键之前）|
| `zh-CN.json` 叶子键       | 5978                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 78（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 78 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%（2026-10-13，未记录命令）。2026-10-14 用"## 复测的三个数字"里的命令重测为 912 / 360，覆盖率 39.5%，分母与分子的口径都对不上旧那条，两组数字并列，只看趋势

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

`components/view_logs` 是眼下最密的目录（71 个非测试 `.tsx`，第 13 簇后接入 2 个）。剩下的按依赖排：第 14 簇 `LogsTableToolbar.tsx` 加 `constants.ts` 的 `QUICK_SELECT_OPTIONS`（6 条时间区间标签）与 `LiveTailBanner`；第 15 簇 `TypeBadges.tsx` 加 `SPAN_TYPE_LABELS`，必须沿用第 13 簇的 `logs.filters.options.*` 那四个词，不要另起一套键；第 16 簇 `ERROR_CODE_OPTIONS`（11 条 `400 - Bad Request` 型标签），这一簇会碰到真实行为改动：`ErrorCodeFilterField` 是按 `option.label.toLowerCase()` 做子串过滤的，标签进目录之后搜索命中的是中文，得决定按值搜还是按标签搜，并且 `RequestLogsFilters.test.tsx` 有两条用例直接断言 `429 - Rate Limited` 这类标签。同一簇里还有 `constants.ts` 的 `CREDENTIAL_LABELS`，消费方只剩 `LogDetailContent.tsx`，接完就能删，键已在 `logs.filters.options.clientOAuthToken` 与 `.configuredKey`

原来的四个优先级里，第一（223 条缺 Provider）、第二（team 172 例）、第三（页面收口）都已完成。此前按失败集中度排出的 1-6 号目标也全部清零：`edit_auto_router_modal.integration` 的 46 例经单文件复跑确认是全量并发造成的假失败（独立运行为 0），其余按 6d06b7b、e2350f6、c109bdb、0e8f5f6 四次提交逐个转绿。中途顺带清掉了未列进表的 `AdminPanel`（19）、`EntityUsage`（18）、`add_attachment_form`（17）、`BulkEditUsers`（16）、`leftnav` 之外的 `user_edit_view` / `user_info_view.integration` / `old-usage`

第 7 项已清零。guardrails 族起点 150 例，`d0c3436` 收掉 content_filter 子族的 68 例，本次提交收掉其余 22 个文件的 82 例（起点：`guardrail_info.characterization` 14、`add_guardrail_form.characterization` 11、`GuardrailsOverview` 11、`CustomCodeModal` 9、`GuardrailUsageBreakdown` 7、`TeamGuardrailsTab.integration` 7，加 6/5/4/3 的长尾），`src/app/(dashboard)/guardrails` 目录复跑 272 例全绿。policies 族（14 个文件 112 例）已在 bdac478 清零。清的时候仍按"回 HEAD 基线确认既有失败"区分翻译账和非翻译账，并且先单文件复跑，别信全量报告里的集中失败

几处踩过的坑，写在这里省得再查：

- 组件里的硬编码英文哨兵值不能被翻译。`AdminPanel.tsx` 的 `all_ip_address_allowed = "All IP Addresses Allowed"` 同时用于渲染和比对后端返回的 IP 行，测试的 mock 数据必须保持英文，只有断言渲染文本的那几处才跟着 t() 走
- 共享组件里写死的英文按钮同样保持英文。`DeleteResourceModal` 的按钮固定渲染 `Cancel` / `Delete` / `Deleting...`，`policies/_components/index.test.tsx` 里这三处断言不能跟着目录里其他断言一起改
- 测试自己 mock 出来的 stub 文案与语言无关。`index.test.tsx` 把 `FlowBuilderPage` mock 成一个写着 `Back to policies` 的按钮，改中文会直接查不到元素
- 英文不同、中文同值的两个键会破坏 `getByText` 的唯一性。`flow.guardrailBadge`（GUARDRAIL）与 `flow.guardrailLabel`（Guardrail）都渲染成"护栏"，`pipeline_flow_builder.test.tsx` 那一处只能改成 `getAllByText(...).length`
- next-intl 走 ICU 语法，消息里的单引号是转义符而不是字面量。`Microsoft Entra OBO requires a scope, e.g. api://'<app-id>'/.default` 渲染出来是 `api://<app-id>/.default`（引号被吞），断言要按渲染结果写
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

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
