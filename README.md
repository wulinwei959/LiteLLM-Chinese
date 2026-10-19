# LiteLLM-Chinese

LiteLLM AI Gateway 管理面板(Admin UI)的简体中文支持项目

## 背景

LiteLLM 上游的管理面板(`ui/litellm-dashboard`)没有任何国际化基础设施:界面文案硬编码英文,`<html lang="en">` 写死,数字与日期格式固定 `en-US`,也没有语言切换入口。本项目在保留英文为默认语言的前提下,为管理面板引入完整的 zh-CN 本地化

## 技术方案

采用 next-intl 的 "without i18n routing" 模式,理由有三:

1. 上游面板是 Next.js 静态导出(`output: "export"`),由 Python proxy 托管在 `/ui/` 路径下,Next.js 官方 i18n 路由与静态导出不兼容,URL locale 前缀方案被排除
2. next-intl 官方支持纯客户端的 locale 切换,且活跃适配 Next.js 16
3. 自带 ICU 消息格式、消息 key 编译期类型校验、`useFormatter()` 本地化日期数字格式化

核心设计:

| 关注点 | 方案 |
|---|---|
| 消息文件 | `src/messages/en.json` + `zh-CN.json`,按功能域分 namespace |
| 类型安全 | `en.json` 驱动 `IntlMessages` 类型增强,key typo 编译期报错 |
| locale 持久化 | localStorage,首访跟随 `navigator.language` |
| 切换入口 | Navbar 用户下拉菜单与侧边栏账户菜单 |
| 日期数字 | `useFormatter()` 替换全部 `"en-US"` 硬编码 |

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

## 当前状态 (2026-10-18)

| 项目 | 状态 |
|---|---|
| **分支** | `main` |
| **汉化完成度** | 批次 0-14 (核心管理页) 完成，批次 24 (共享组件长尾) 按簇推进到第 297 簇。非测试 `.tsx` 912 个中接入翻译 692 个 (75.9%，带括号调用口径)，未接入宽口径命中 11 个全为误报或判定账；`.ts` 侧新账 388 个命中 19 个，多数为数据值/演示样例判定账，kill_switch、key_scope、auto_router 类型标签、chat 种子标题四片已接净。扫描是启发式的、会漏模板拼接文案，故仍不能据此宣布收口 |
| **目录规模** | 中英消息各 11121 个叶子，键树完全对齐 (parity 守卫 0 缺失)，中英同值 141 个 (多为 URL、模型名等格式示例，非漏翻) |
| **测试** | 最新全量 (第 85 簇四片) 886 文件 11583 例，1 失败 + 9 例预期失败；逐簇只跑定向文件，全绿 |
| **类型检查** | 非测试文件 0 错误，`npm run build` 绿色；测试文件有 904 条存量类型债 (vitest 全局类型缺失等)，不阻塞构建 |
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

- **批次 24 长尾按簇推进**：`components/add_model`、`components/view_logs` 等此前最密的目录已逐簇文案清零，`usage/EntityUsage`、`caching`、`vector-stores`、`tag-management`、`organization`、`claude_code_plugins` 等也已逐文件收过；剩余多是 `mcp-servers`、`search-tools`、`agents`、`guardrails` 等仍含硬编码英文 (列头、tooltip、告警、动态拼装串、复数计数句) 的组件，按 `files with hits` 队列逐文件收
- **永久挂在上游名下的失败**：`cost_tracking_settings.test.tsx` 7 例 (与导入快照逐行相同的既有失败) 与 `LensSetup.integration.test.tsx` 的 `/2026-09-30/` 日期断言 (任何 locale 下 `toLocaleString` 都渲染英文月名)，已从汉化账摘出，不再重复排查
