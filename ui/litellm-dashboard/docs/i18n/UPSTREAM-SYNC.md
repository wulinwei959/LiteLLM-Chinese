# 上游同步计划

上游镜像：`http://192.168.3.224:3001/wulinwei959/litellm.git`（已加为 `upstream` remote）

## 一、为什么不能直接 git merge

**本 fork 与上游没有共同祖先。** 我们的历史是 `bcbf23ad` → `610473cb`（`chore: import litellm upstream source snapshot`，整体导入上游快照）→ 之后独立演进。`git merge-base HEAD upstream/main` 返回空，`git merge upstream/main` 会拿 916 个本地提交去撞 55032 个上游提交。

## 二、现在各自站在哪

|                | 我们的状态                                                                                             | 上游 main                  |
| -------------- | ------------------------------------------------------------------------------------------------------ | -------------------------- |
| 仪表盘源码     | 基准 = 上游 `303434d`（2026-09-26）+ 1650 个文件的汉化改动                                             | 2026-10-20，24 天之后      |
| 代理（Python） | 基准 = 上游 `v1.105.0`，树哈希与上游该 tag 完全一致，此后我们没动过 `litellm/proxy` 与 `litellm/types` | 1527 文件，+95217 / -28852 |
| 资产与脚本     | `f8786efba6` 那笔「分区同步上游 v1.105.0（基础部分）」顺带带进了 logo、构建脚本、eslint 预算与抑制文件 | —                          |

我们的导入快照 `610473cb` 与上游 `303434d` 的仪表盘内容只差 3 个文件的元数据（0 行增删），所以 `303434d` 就是仪表盘侧真正的上游基准。

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
- `--keep` 保留 fork 自有的基础设施（我们的 4 个 UI 工作流、`check-ui-api-types.yml`）

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

### 下一步

1. 按错误数从多到少把剩下 94 个文件逐个重接（每个文件的做法固定：取上游那份 + 按 diff 里的 `t(...)` 贴回汉化 + 补目录键）
2. 测试文件那 1123 条：先分清"上游带来的 vitest 全局类型债"（与上游同源，可不修）与"汉化接线变了断言"（要翻面）
3. 收口：死键基线复核、lint 预算棘轮、`npm run build` 转绿、渲染扫描重跑
