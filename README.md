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
| **汉化完成度** | 批次 0-14 (核心管理页) 完成，批次 24 (共享组件长尾) 按簇推进到第 417 簇。非测试 `.tsx` 913 个中接入翻译 709 个 (77.7%，带括号调用口径)，未接入的 204 个逐个筛过、含疑似英文文案的只剩 14 个文件且 9 个已入判定账。第 306 到 407 簇逐片把组件内字面量、共享 util 里的归一化替换串、模块常量当展示文案用的形态、共享件 aria 模板里的内嵌英文词、caller 侧把 thrown message 与硬编前缀拼成气泡内容的形态、浏览器标签页与 meta 描述、服务端错误兜底里的硬编提示逐类接进目录；第 409 簇清掉 226 个无人引用的死键并把判定器接进 CI 门禁 (`npm run check:dead-keys`，按基线棘轮，新增死键即红)；第 410 到 412 簇把死键守卫接进 UI Lint 工作流、把全仓 26 处硬编码 `"en-US"` 的日期货币紧凑记法连同表格日期的手写英文月份数组改成按当前 UI locale 格式化 (`src/lib/i18n/format.ts`)；第 414 簇把 97 处手抄的 auth session mock 收进共享工厂，lint 预算 568 压到 472 并棘轮；第 415 簇接完最后一批显示层回落串 (15 处)；第 416 簇清掉四笔既有测试欠账；第 417 簇实机验收修掉六处富文本运行时故障（登录页默认凭据提示崩溃、五处附件作用域标记原样显示），并加了一条常驻守卫比对"消息要的参数"与"调用点给的参数" |
| **目录规模** | 中英消息各 11261 个叶子，键树完全对齐 (parity 守卫 0 缺失)，中英同值 133 个 (多为 URL、模型名等格式示例，非漏翻) |
| **测试** | 最近一次全量 (第 417 簇后，`src/components` + `src/app` + `src/utils` + integration) 11617 例，仅 7 例失败，逐个单跑复验后全部落在 LensSetup 与 edit_auto_router_modal 两个文件上、单跑 83 例全绿，属并发时序假失败，零翻译回归 |
| **类型检查** | 非测试文件 0 错误，`npm run build` 绿色；测试文件有 878 条存量类型债 (vitest 全局类型缺失等)，不阻塞构建 |
| **i18n 守卫** | 4 条全部通过 (`locales.test.ts` 7 + `messagesParity.test.ts` 8 + `missingKeys.test.ts` 1 + `messageArgs.test.ts` 1)，第四条比对消息要的参数与调用点给的参数 |
| **CI 门禁** | UI Lint 工作流的全部门禁绿：lint 预算 (472 = max 472)、knip 死代码、死键基线棘轮 |

进度、逐簇账与口径以 [`ui/litellm-dashboard/docs/i18n/PROGRESS.md`](ui/litellm-dashboard/docs/i18n/PROGRESS.md) 为准；实施流程见同目录 `WORKFLOW.md`

### 已修复的关键问题

1. **Docker 构建阻断**：`ModelsTableColumns.tsx` 的 `"use client"` 指令位置错误 → 已修复并合并至 `main`
2. **构建时类型错误**：`dd32399` 遗留的非测试文件类型错误 → 全部清零，`npm run build` 恢复绿色
3. **缺 Provider 测试失败**：223 例 → 全部修复
4. **缺键**：47 条真实缺失 (被 `missingKeys` 守卫拦截) → 全部补齐
5. **断言过时**：第六类失败 (断言停在英文) → 在观测范围内归零
6. **`mcp_server_edit` OAuth 恢复取值失败**：根因是测试占位符正则写错，非组件缺陷 → 已在 `f3b21f32` 修复

### 剩余工作

- **换新维度而不是重扫旧正则**：按当前四条扫描口径 (回落串、模板串、JSX 文本节点、更宽的 `>text<`)，真 UI 文案的可接线余量已经见底，剩下的命中全部有判定归属 (技术值、协议标识、CSV 列头、代码语料、品牌名)。下一轮应从新组件、新页面、新交互形态入手，不该再重扫这四条正则。逐条甄别结果见 `docs/i18n/PROGRESS.md` 的「扫描维度收口」一节
- **上游持续演进**：本 fork 的上游仍在更新，新组件会带来新的英文串。按簇推进仍是唯一可靠的收口方式
- **lint 预算还有 172 条余量**：`local/no-large-inline-object-arg` 已从 568 压到 472 (目标 300)。剩下的分布是测试文件里的 mock 与断言载荷为主，改动价值低于收益，按需做
