# 上游同步计划

上游镜像：`http://192.168.3.224:3001/wulinwei959/litellm.git`（已加为 `upstream` remote）

## 状态（2026-10-24）

汉化工程收口时决定暂不执行同步，本篇仍是待执行的计划。真到同步那天，除了下面的阶段还要额外做三件事：按合并后的实数重测 `eslint-budgets.json` 的棘轮（`fc664c04` 那次就是这么做的，第 524 簇又补测了一轮）、跑 `eslint . --prune-suppressions` 让抑制基线跟着新树走、以及重跑 `npm run check:dead-keys` 与渲染扫描各页

## 一、为什么不能直接 git merge

**本 fork 与上游没有共同祖先。** 我们的历史是 `bcbf23ad` → `610473cb`（`chore: import litellm upstream source snapshot`，整体导入上游快照）→ 之后独立演进。`git merge-base HEAD upstream/main` 返回空，`git merge upstream/main` 会拿 916 个本地提交去撞 55032 个上游提交。

## 二、现在各自站在哪

|                | 我们的状态                                                                          | 上游             |
| -------------- | ----------------------------------------------------------------------------------- | ---------------- |
| 仪表盘源码     | 基准 = 官方 release `v1.107.0`（commit `66c8f5b1a9`），已合并并在其上重接汉化       | 后续只跟 release |
| 代理（Python） | 基准 = `v1.107.0`，整段取 release 树，`litellm/proxy` 与 `litellm/types` 逐字节一致 | 与 release 一致  |
| 资产与脚本     | `f8786efba6` 带入的 logo、构建脚本、eslint 预算与抑制文件，合并时随上游更新         | —                |

合并已于 2026-10-23 完成，见第九节。第二至七节保留为合并前的计划与测算，数字不再代表当前状态。

我们的导入快照 `610473cb` 与上游 `303434d` 的仪表盘内容只差 3 个文件的元数据（0 行增删），所以 `303434d` 曾是仪表盘侧的上游基准；实际执行时改用 `v1.105.0` 作三方合并基线，详见第八节。

## 三、差距量化

| 维度                     | 数字                                                          |
| ------------------------ | ------------------------------------------------------------- |
| 上游改动的仪表盘文件     | 1065（340 新增 / 26 删除 / 601 修改 / 约 100 重命名）         |
| 上游改动的代理与类型文件 | 1527，其中 **156** 个触及 API 路由或类型（会改 OpenAPI spec） |
| 上游新增的 `.tsx` 组件   | 161 个，23947 行 —— 同步后的主要汉化工作量                    |
| 我们改过的仪表盘文件     | 1650                                                          |
| **双方都改（冲突热点）** | **569**（455 tsx / 91 ts / 4 json / 19 资产）                 |
| 双方都新增（路径撞车）   | 54，几乎全是 logo 资产                                        |
| 上游删掉、但我们改过     | 24，其中 **12** 个带汉化接线（组件要搬家或直接消失）          |
| 只我们改                 | 1081                                                          |
| 只上游改                 | 496                                                           |

依赖侧的大版本变动：`openai` 4.104 → 6.49、`zod` 3.25 → 4.6、`next` 16.3.3 → 16.3.8、`moment` 2.30 → 2.31；新增 `tsconfig.production.json` 与 `typecheck` 脚本（只查生产代码、排除测试），以及 `@litellm/lens-ui` 这个 `file:vendor/*.tgz` 本地依赖。

## 四、做法：逐文件三方合并

不用 `git merge`，也不用「`git checkout upstream/main -- ui/litellm-dashboard` 覆盖」（那会丢掉全部 1650 个文件的汉化接线）。

对每个文件做一次 `git merge-file`：

```
base   = 610473cb 的内容      （我们导入的上游快照）
ours   = HEAD 的内容          （汉化后的）
theirs = upstream/main 的内容 （上游的新版）
```

- 只有一侧改动的文件，直接取那一侧
- 两侧都改的，做三方合并，冲突逐个解
- 一侧删除、另一侧修改的，按「上游删除则删除，若组件搬家则在新位置重接汉化」处理

冲突分三类，各有默认处置：

| 类       | 判据                                                                          | 处置                           |
| -------- | ----------------------------------------------------------------------------- | ------------------------------ |
| 文案周边 | 冲突块里有 `t(` / `useTranslations`                                           | 手工重接，保留上游的新文案语义 |
| 上游重构 | 组件改名、拆分、搬目录                                                        | 取上游结构，在新位置重接汉化   |
| 生成物   | `schema.d.ts`、`package-lock.json`、`eslint-suppressions.json`、`tsbuildinfo` | 取上游版本或重新生成，不手工合 |

合并本身脚本化，产出冲突清单，逐个处理。

## 五、分阶段

每阶段一个可验证的提交，推送后让 CI 跑。

### Phase 0 · 准备

- 打 tag `pre-upstream-sync-2026-10-21` 标记当前状态
- 建分支 `litellm_sync_v1.107.0`（命名沿用 `litellm_sync_v1.105.0` 那条线）
- 记录基线数字：叶子 11261、lint 471/471、tsc 878、全量 11626 例 1 失败、死键 0

### Phase 1 · 代理侧（Python）

我们的 `litellm/proxy` 与 `litellm/types` 没有任何本地改动（`f8786efba6` 之后 0 个提交），所以这一侧没有冲突面：直接取上游 main 的版本，1527 个文件。

验证：本机没有 Python 依赖也没有 Docker，代理侧的单测跑不了 → 单独推一个提交让 CI 验。

### Phase 2 · 依赖与配置

手工合并，逐项过：

- `package.json`：上游的版本升级（openai / zod / next / moment）、新增依赖与 `vendor/*.tgz`、`typecheck` 脚本，加上我们的 `playwright` devDep 与 `check:dead-keys` / `scan:rendered` 脚本
- `package-lock.json`：改完 `package.json` 后重新生成，不手工合
- `tsconfig.production.json`：取上游的。它只查生产代码，正好把「非测试文件 0 错误」这条现有约定变成一条可跑的 CI 命令，也把 878 条测试文件类型债隔离开
- `eslint-budgets.json` / `eslint-suppressions.json`：上游也改了这两份，与我们的棘轮合并
- `AGENTS.md`：上游的版本 + 我们已提交的 Next.js 生成块

验证：`npm ci` 通过、`npm run typecheck` 零错、`npm run lint` 与预算棘轮对齐。

### Phase 3 · 仪表盘源码三方合并

1650 + 1065 个文件，569 处冲突。按目录分批，每批一个提交：

1. 叶子组件（`src/components/**` 里上游改得最多的）
2. 页面与布局（`src/app/**`）
3. 网络层与 hooks（`src/components/networking.tsx`、`src/app/(dashboard)/hooks/**`）
4. 图表与共享件（`src/components/shared/**`）

冲突解法逐个记进 `docs/i18n/PROGRESS.md`，渲染扫描复验。

### Phase 4 · 生成物

- `src/lib/http/schema.d.ts`：取上游版本（上游自己提交的就是它对着自己代理生成的产物）
- CI 跑 `npm run gen:api` 核对，必要时用 `LITELLM_PYTHON="uv run --no-sync python"` 重新生成

### Phase 5 · 汉化层重接

上游没有自己的 i18n，这一层全是我们的，随源码一起重接：

- `src/lib/i18n/translators.ts`：上游新增的组件补命名空间
- `src/messages/en.json` / `zh-CN.json`：上游新增组件的文案补键（161 个新组件是主要工作量）
- 清理上游删掉的组件留下的孤儿键：死键门禁会直接报出来（合并后基线必然要更新一次）
- `t.rich` 的标签名与调用点 handler 名要对上（`messageArgs` 守卫会报）

### Phase 6 · 验证与棘轮

- `npm run typecheck`（只查生产代码，零错）
- `npx tsc --noEmit`（测试文件类型债，允许高于现在，但要说明）
- 全量 vitest
- i18n 四条守卫 + 渲染扫描
- lint 预算棘轮、死键基线更新
- `npm run build`

## 六、风险与预案

| 风险                              | 预案                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `zod` 3 → 4 的破坏性变更          | 已排查：仪表盘里的 zod 用法已是 v4 兼容形态（`z.record` 两参、无 `.email()` 链、zod 上下文里没有 `message:`），我们的 i18n 层不用 zod |
| `openai` 4 → 6                    | 影响面集中在 `llm_calls`，由上游承担；我们只在汉化时碰到                                                                              |
| `schema.d.ts` 与代理不同步        | Phase 1 与 Phase 4 配对；CI 的 "Check UI API Types Sync" 兜底                                                                         |
| 上游删掉的 24 个文件带汉化接线    | 逐个确认组件是否搬家，搬了的重接                                                                                                      |
| 死键暴增                          | 死键门禁是基线棘轮，合并后一次性清理并更新基线                                                                                        |
| 569 处冲突里混着上游的真 bug      | 冲突解法逐个记录，渲染扫描复验                                                                                                        |
| 本机没有 Python 依赖、没有 Docker | 代理侧与 `gen:api` 的验证只能靠 CI，Phase 1 与 Phase 4 单独推送                                                                       |
| 上游 main 继续往前走              | 合并以 `upstream/main` 当时的头为准，同步期间上游有新提交就再取一次 head（源码侧冲突面会小得多，因为只多了一天）                      |

## 七、规模估计与建议切法

- 569 处冲突，按每处 10~40 分钟算，**2~4 个工作日**是最花时间的部分
- 上游 161 个新组件的汉化，**1~2 周**（渲染扫描 + 扫描器辅助）
- 一次完整同步约 **3~5 周**

不建议一次全同步。建议切法：

1. **先做 Phase 1 + 2**（代理 + 依赖）。纯上游搬运、风险低，收益是拿到 24 天的后端特性与依赖升级
2. **再做 Phase 3**（仪表盘源码），单独一条分支，冲突分批解，每批推送让 CI 兜住
3. **汉化（Phase 5）跟着 Phase 3 走**，上游每多一批组件就补一批键，不必等合并全部结束
4. **Phase 6 收口**，更新死键基线与 lint 预算棘轮

## 八、执行记录（2026-10-21）

计划已执行到 Phase 3，Phase 4~6 尚未开始。这一节记的是实际做法与实际结果，与前面的计划有出入的地方以这一节为准。

实际用的分支是 `litellm_sync_v1.107.0`，上游基线最终取的是官方 release `v1.107.0`（commit `66c8f5b1a9`）而不是 `upstream/main`——release 与 main 之间还差 78 个代理侧文件，而仪表盘只差 1 行生成物，用 release 更贴近实际发布物。

### 合并基线改了

计划里仪表盘侧的基线写的是上游 `303434d`（2026-09-26）。实际执行时发现基线选错了：我们的仪表盘不是停在 `303434d`，而是停在 `v1.105.0` 那次同步带进来的状态。`v1.105.0` 与 `303434d` 之间上游又改过仪表盘，所以拿 `303434d` 当基线时，三方合并会把"上游从 303434d 到 v1.105.0 的改动"当成"我们的改动"，于是一大批本该干净合并的文件报冲突，合并结果里出现上游新代码与旧代码拼接的半成品（JSX 标签不闭合、引用了不存在的标识符）。

改用 `v1.105.0` 作仪表盘侧基线后，同样一批文件的冲突数从 113 处降到 0，合并结果也干净得多。代理侧基线仍是 `v1.105.0`（我们的 Python 树与那个 tag 逐字节一致）。

### 工具

`scripts/upstream-merge.py` 做逐文件三方合并：

- 基线按路径分区：仪表盘用 `--dashboard-base`，其余用 `--rest-base`
- 只有一侧改动的文件直接取那一侧
- 两侧都改的走 `git merge-file`
- 上游搬过家的文件跟着重命名走，`git diff -M` 认出 old→new 后把我们的改动合并到新路径下，汉化随代码一起搬
- 二进制文件不做合并，直接取上游那份
- `--keep` 保留 fork 自有的基础设施（我们的 2 个 UI 工作流：`test-litellm-ui-lint.yml` 死键门禁与 `test-litellm-ui-build.yml` 构建检查）

### 实际数字

仪表盘侧：1395 个文件合并、103 处重命名带汉化、385 个新增、88 个上游删除。代理与仓库其余部分：3818 个文件取上游、137 处重命名、2626 个新增、1124 个上游删除。合并提交是 `797ecb3208`，共 8591 个文件、+1310663 / -504842。

上游删掉、我们也改过的文件里，绝大多数是搬家（`view_logs` 整目录搬到 `components/logs`，`lens` 与 `roi-calculator` 的页面组件搬进上游的 `@litellm/lens-ui` 本地包）。这些在原路径留下的旧副本是合并产物里的孤儿，共 1467 个文件，已按"上游同路径没有该文件且内容在别处存在"判据清掉。

### 汉化层重接（Phase 5，进行中）

合并把上游的新结构与我们的汉化接线拼在一起，产生两类问题：

一类是上游改了辅助函数的签名而我们改过同一批签名。典型是 `makeOpenAIResponsesRequest` 等 llm_calls 系列函数，我们的做法是首参注入 `PlaygroundTranslator` 把报错文案接进目录，上游新增的调用点（`playground/components/chat/dispatchRequest.ts`）不知道要传，于是类型不匹配。这类要沿调用链把译员补齐。

另一类是文件被拼成半成品：上游的新 JSX 配我们旧的 import 与 state，出现"找不到标识符"（`SparklesIcon`、`QUIET_HEADER`、`selectedAuthType` 这类）。这类要取上游那份骨架，再把汉化按新结构重新贴回去。

已重接完并通过类型检查的文件（举例）：`PageHeader`、`onboarding_link`、`NotificationsBell`、`ProjectsPage`、`AccessGroupsPage`、`TeamAdminEditableFieldsSettings`、`playground/page`、`budget_panel`、`CostOptimizationView`、`user_agent_activity`、`MCPAppsPanel`、`activity_metrics`、`LiteAdmin`、`CustomCodeModal`（含 `custom_code_catalog.ts` 的模板名/模式/原语描述改键）、`EntityUsage`（含 `entityUsageSummary.ts`）、`SpendByProvider`、`KeyActivityPanel`、`UsagePageView`、`ModelInsightsView`、`key_edit_view`、`Teams`、`VirtualKeysTable`、`general_settings`、`guardrail_info_helpers`、`provider_specific_fields`、`shared/timeline/Timeline`、两个测试文件。

### 当前状态与欠账

- 生产类型检查（`npm run typecheck`，排除测试文件）**0 条错误**
- 测试文件类型错误 419 条（合并前基线 878）。其中一大半是 `tsconfig` 一直没把 vitest 的全局类型纳进来导致的悬空 `describe`/`it`/`expect`，补上 `"types": ["node", "vitest/globals", "@testing-library/jest-dom"]` 后一次消掉 534 条；余下的是测试用旧 API 写的地方，要按上游的新结构逐个改
- 目录：死键 0（合并后一次性清了 735 个无人引用的键）、中英 parity 与缺键守卫 17 例全绿
- `npm run build` 待最终跑一遍确认

### Phase 5 收官：合并带入的组件全部汉化（2026-10-22）

上一节说的"重接"只做到把生产类型错误清零，合并带进来的 131 个新组件本身仍是英文。本节记把这一层也做完的过程与数字。

先说清判断口径。"哪些文件是合并带进来的"用 git 树算：`HEAD` 的树减去 `main` 的树，落在 `ui/litellm-dashboard/src/` 下、且后缀是 `.tsx`/`.ts`、不含 `.test.` 的文件，131 个 `.tsx` 加 90 个 `.ts`。这批文件此前一句汉化都没有。

哪些字符串算"用户可见"用 AST 判，不用正则扫全文。`ui/litellm-dashboard/scripts/scan-english.mjs` 走 TypeScript 解析器，只收四类节点：JSX 文本、承载文案的 props（`label`/`title`/`placeholder`/`aria-label`/`description`/`emptyText`/`alt`/`tooltip`/`subtitle`/`errorMessage`/`helperText`/`hint`/`message`/`sublabel`）、`toast.*` 的单参数调用、`new Error(...)` 的字面量。文件里对象字面量形式的标签表（`ERROR_ENTITY_LABEL`、`GROUP_COPY`、`STREAM_SCOPE_OPTIONS` 这类）扫不到，靠 `--all` 模式补一遍人工过。

结论：131 个 `.tsx` 里 74 个文件命中 561 条候选串。清完这 74 个文件之后重扫，剩 0 条可见英文，只留下端点路径（`/v1/decisions`）、品牌名（`LiteLLM`、`MCP`、`Moyai`）、代码片段（`git clone`）、快捷键提示（`J`/`K`）和配置键名（`UI_PASSWORD`、`LITELLM_LOG=DEBUG`）这类技术串，按仓库既有惯例保留。

模块级函数不能调 `useTranslations`，组件外会抛 Invalid hook call。凡是模块级函数要出文案的地方（`errorsData.ts` 的标签与状态码映射、`issueLabel.ts` 的路径标签、`validatePayload.ts` 的校验消息、`telemetryGroups.ts` 的分组说明、`guardrail_info_helpers.tsx` 的流式范围与仅日志范围选项、`DeploymentWarningContent.tsx` 的警告正文、`RequestTagMappings.tsx` 的映射校验），一律把译员当参数传下去，类型用 `src/lib/i18n/translators.ts` 里按命名空间取的具名 translator。目录新增 `playground.systemOne`、`playground.inspector`、`playground.chat`、`playground.mcp`、`usage.errors`、`usage.overview`、`usage.userActivity`、`guardrails.streamScope`、`deploymentHealth`、`telemetry`、`moyai`、`modelAdd`、`home`、`aiHub`、`modelInfo`、`commandPalette`、`searchBox`、`costOptimization`、`routerSettings.requestTagMappings` 等命名空间。

### 这一层用到的工具

- `ui/litellm-dashboard/scripts/scan-english.mjs`：TS AST 扫用户可见英文串，可加 `--all` 输出全部字面量
- `ui/litellm-dashboard/scripts/add-i18n-hooks.mjs`：按 AST 往指定函数体首行插 `const t = useTranslations("<ns>")`，函数名匹配 `function` 声明、箭头函数 const 与 `React.FC` 赋值三种形态，已有 `t` 的跳过
- `scripts/catalog-set.py`：改目录但不动文件其余部分的字节。做法是自写 JSON 解析器记下每个值的起止偏移，改动时只重渲染变化的那一段，其余按原样复制。对两个目录做过 round-trip 验证：无改动时输出与输入逐字节相同
- `scripts/catalog-batch.py` / `scripts/i18n-apply.py` / `scripts/i18n_helper.py`：批量落键、批量替换与插 hook 的组合入口

`scripts/catalog-key.py` 这轮不再用于新增键，它按文本找命名空间并在缺失时插入嵌套对象，改到一半的对象会被后续调用当成叶子覆盖，踩了三次。它仍被 `restore-missing-keys.py` 与 `restore-catalog-keys.py` 引用（合并工具链），所以保留不动，只是把命令行参数顺序理顺了。`catalog-set.py` 走的是解析后的树，插入行为是确定的。

### 这一层的实际数字

- 131 个新 `.tsx` 文件里 74 个完成汉化，可见英文 561 → 0
- 目录叶子键 10254 → 11022（新增 768 枚，英中两侧同数）
- 生产类型检查 0 条错误
- 死键 0（收尾时清掉自己引入的 4 枚未引用键）
- i18n 五条守卫 23 例全绿
- `npm run build` 绿
- 受影响测试：errorsData 22、issueLabel 10、validatePayload 51、decisions + example 43、DeploymentWarningContent 12、RequestTagMappings 10，合计 148 例全绿，断言随文案翻成中文

### 仍然欠着的

- zod 的自定义校验消息（`systemOneUI/lib/schemas.ts` 与 `openAIDecisions.ts` 里那些 `refine(..., "Model must be a non-empty string.")`）仍是英文。这批消息只在 payload 不合法时出现在校验列表里，要译得把 schema 改成按译员构造的工厂函数，`openAIDecisionsForm.ts` 用了 `openAIDecisionsRequestSchema.shape.input`，改签名要一起动
- 测试文件的存量类型错误 418 条（合并前基线 878），大头是测试还在用旧 API 的 props 与旧英文断言，与汉化无关但会让将来打开 `useTypeScriptCli` 时构建变红
- 渲染扫描（`npm run scan:rendered`）需要起 dev server，本轮没跑，漏网的动态文案以它为准

### 下一步（2026-10-22 时点，已完成部分以第九节为准）

1. 按错误数从多到少把剩下 94 个文件逐个重接（每个文件的做法固定：取上游那份 + 按 diff 里的 `t(...)` 贴回汉化 + 补目录键）
2. 测试文件那 1123 条：先分清"上游带来的 vitest 全局类型债"（与上游同源，可不修）与"汉化接线变了断言"（要翻面）
3. 收口：死键基线复核、lint 预算棘轮、`npm run build` 转绿、渲染扫描重跑

## 九、执行记录（2026-10-23）：v1.107.0 合并完成与第二批汉化

合并基线最终取官方 release `v1.107.0`（commit `66c8f5b1a9`）。代理侧整段取 release 树，落地提交 `797ecb3208`；仪表盘侧以 `v1.105.0` 为三方合并基线，冲突按第八节的办法逐个解。汉化层随后分四批重接，生产类型错误从 460 降到 0。

`8d69521186` 之后，在 `litellm_sync_v1.107.0` 分支上又完成 13 个汉化提交，从团队页、AI 中心、MCP 服务器与提交审核，到用量页、访问组、密钥活动面板、用户页、成员编辑、凭据弹窗与对象权限。逐批记录见 `PROGRESS.md` 第 425 簇。

2026-10-23 复核：非测试 TSX 145 个文件 313 条可见英文命中（AST 口径，技术串按既有判定保留）；目录叶子键 11482，英中同数；生产类型检查 0 条错误；测试文件类型错误 395 条；死键 0；`npm run build` exit 0；i18n 五条守卫此前 23 例全绿。

仍然欠着：zod 的自定义校验消息仍待改成按译员构造；测试文件类型错误与旧英文断言按文件逐个收；渲染扫描本枝已在 2026-10-23 跑通，桩形状三处缺口（`/user/daily/activity/aggregated/users` 与 `/guardrails/submissions` 缺桩、`/user/daily/activity/aggregated` metadata 只给了两枚字段）已按第 427 簇补齐，用量页与护栏页的运行时错误清零，剩余 25 条命中见 PROGRESS。`scan-english-pos.tmp.mjs` 复核从未入库（`git log --all` 无史），该句作废。

分支策略：合并、汉化与测试收口全部在 `litellm_sync_v1.107.0` 上完成，`main` 保持不动，最后再合入。
