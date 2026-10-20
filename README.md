# LiteLLM-Chinese

LiteLLM AI Gateway 管理面板(Admin UI)的简体中文支持项目

## 背景

LiteLLM 上游的管理面板(`ui/litellm-dashboard`)没有任何国际化基础设施:界面文案硬编码英文,`<html lang="en">` 写死,数字与日期格式固定 `en-US`,也没有语言切换入口。本项目在保留英文为默认语言的前提下,为管理面板引入完整的 zh-CN 本地化

## 技术方案

采用 next-intl 的 "without i18n routing" 模式,理由有三:

1. 上游面板是 Next.js 静态导出(`output: "export"`),由 Python proxy 托管在 `/ui/` 路径下,Next.js 官方 i18n 路由与静态导出不兼容,URL locale 前缀方案被排除
2. next-intl 官方支持纯客户端的 locale 切换,且活跃适配 Next.js 16
3. 自带 ICU 消息格式、消息 key 编译期类型校验；日期与数字格式化另起一层 `src/lib/i18n/format.ts`，因为 `useFormatter()` 是 Hook，纯模块用不了

核心设计:

| 关注点 | 方案 |
|---|---|
| 消息文件 | `src/messages/en.json` + `zh-CN.json`,按功能域分 namespace |
| 类型安全 | `en.json` 驱动 `IntlMessages` 类型增强,key typo 编译期报错 |
| locale 持久化 | localStorage,首访跟随 `navigator.language` |
| 切换入口 | Navbar 用户下拉菜单与侧边栏账户菜单 |
| 日期数字 | `src/lib/i18n/format.ts` 按当前 UI locale 格式化,替换全部 `"en-US"` 硬编码 |
| 死键守卫 | `scripts/dead-keys.py` 判定无人引用的键,CI 里 `npm run check:dead-keys` 按基线棘轮 |

## 实施计划

| 批次 | 内容 |
|---|---|
| Batch 0 | next-intl 接入、LocaleProvider、切换器、类型增强、key 一致性测试 |
| Batch 1 | 侧边栏导航、Navbar、面包屑、登录与引导页 |
| Batch 2 | Virtual Keys 页与创建流程、Models + Endpoints |
| Batch 3 | Logs 列表与详情抽屉、Usage 看板 |
| Batch 4 | Teams、Internal Users、Organizations、Budgets |
| Batch 5 | Guardrails、Policies、Settings 及其余管理页 |
| 长尾 | playground、prompts、mcp-servers 等按需排期 |

每批独立可合并,默认语言保持英文,存量用户与测试零影响。测试新增三类:中英消息文件 key 树一致性校验、切换器可见文案变化断言、locale 持久化 helper 单测

## 上游

基于 [BerriAI/litellm](https://github.com/BerriAI/litellm) 的 `ui/litellm-dashboard` 展开

## 当前状态 (2026-10-21)

| 项目 | 状态 |
|---|---|
| **分支** | `main` |
| **汉化完成度** | 批次 0-14 (核心管理页) 完成，批次 24 (共享组件长尾) 按簇推进到第 412 簇。非测试 `.tsx` 913 个中接入翻译 709 个 (77.7%，带括号调用口径)，未接入宽口径命中全为误报或判定账。第 306 到 407 簇逐片把组件内字面量、共享 util 里的归一化替换串、模块常量当展示文案用的形态、共享件 aria 模板里的内嵌英文词、caller 侧把 thrown message 与硬编前缀拼成气泡内容的形态、浏览器标签页与 meta 描述、服务端错误兜底里的硬编提示逐类接进目录；第 409 簇清掉 226 个无人引用的死键并把判定器接进 CI 门禁 (`npm run check:dead-keys`，按基线棘轮，新增死键即红)；第 410 到 412 簇把死键守卫接进 UI Lint 工作流，并把全仓 26 处硬编码 `"en-US"` 的日期、货币与紧凑记法连同表格日期的手写英文月份数组改成按当前 UI locale 格式化 (`src/lib/i18n/format.ts`)。扫描仍是启发式的，不能据此宣布收口 |
| **目录规模** | 中英消息各 11247 个叶子，键树完全对齐 (parity 守卫 0 缺失)，中英同值 133 个 (多为 URL、模型名等格式示例，非漏翻) |
| **测试** | 最近一次全量 (第 413 簇后，`src/components` + `src/app` + `src/utils` + integration) 11615 例，15 例失败，逐个单跑复验后 4 例属并发时序假失败（`add_auto_router_tab.integration` 与 `edit_auto_router_modal.integration` 单跑 160 例全绿），其余为 HEAD 既有欠账，零翻译回归；逐簇只跑定向文件，全绿 |
| **类型检查** | 非测试文件 0 错误，`npm run build` 绿色；测试文件有 883 条存量类型债 (vitest 全局类型缺失等)，不阻塞构建 |
| **i18n 守卫** | 3 条全部通过 (`locales.test.ts` 7 + `messagesParity.test.ts` 8 + `missingKeys.test.ts` 1) |

进度、逐簇账与口径以 [`ui/litellm-dashboard/docs/i18n/PROGRESS.md`](ui/litellm-dashboard/docs/i18n/PROGRESS.md) 为准；实施流程见同目录 `WORKFLOW.md`

### 已修复的关键问题

1. **Docker 构建阻断**：`ModelsTableColumns.tsx` 的 `"use client"` 指令位置错误 → 已修复并合并至 `main`
2. **构建时类型错误**：`dd32399` 遗留的非测试文件类型错误 → 全部清零，`npm run build` 恢复绿色
3. **缺 Provider 测试失败**：223 例 → 全部修复
4. **缺键**：47 条真实缺失 (被 `missingKeys` 守卫拦截) → 全部补齐
5. **断言过时**：第六类失败 (断言停在英文) → 在观测范围内归零
6. **`mcp_server_edit` OAuth 恢复取值失败**：根因是测试占位符正则写错，非组件缺陷 → 已在 `f3b21f32` 修复

### 剩余工作

- **批次 24 长尾按簇推进**：`components/add_model`、`components/view_logs`、`usage/EntityUsage`、`caching`、`vector-stores`、`tag-management`、`organization`、`claude_code_plugins` 等此前最密的目录已逐簇文案清零；`mcp-servers`、`search-tools`、`agents`、`guardrails` 等目录在第 404 到 406 簇按「模块常量」「共享件 aria 模板」「caller 侧错误气泡」三类形态逐片收过，余量集中在少数组件的英文默认参数、判定账里的 provider 名与品牌 token、以及 CSV 列头与代码语料
- **永久挂在上游名下的失败**：`cost_tracking_settings.test.tsx` 的超时 flaky 与 `LensSetup.integration.test.tsx` 的 `/2026-09-30/` 日期断言 (任何 locale 下 `toLocaleString` 都渲染英文月名)，已从汉化账摘出，不再重复排查；`AddModelPanel.integration.test.tsx` 的英文 "Please enter valid JSON" 断言（第 401 簇已改走 `models.addModel.invalidJson` zh 键，测试未翻面）与 `view_users/user_info_view.integration.test.tsx` 的上一区间 savings 提交断言同属既有欠账
