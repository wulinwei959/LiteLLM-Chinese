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

每批独立可合并,默认语言保持英文,存量用户与测试零影响。测试侧的守卫最初是三类:中英消息文件 key 树一致性校验、切换器可见文案变化断言、locale 持久化 helper 单测。现在已扩到 `src/lib/i18n` 五道加 toast 标题覆盖一道，清单见下文

## 上游

基于 [BerriAI/litellm](https://github.com/BerriAI/litellm) 的 `ui/litellm-dashboard` 展开

## 当前状态 (2026-10-24)

| 项目 | 状态 |
|---|---|
| **分支** | `main`，已与 LAN 远端同步 |
| **上游基线** | 官方 release `v1.107.0`（commit `66c8f5b1a9`），2026-10-23 用逐文件三方合并并入并合回 `main`，其上的汉化重接与收口做到第 524 簇 |
| **汉化完成度** | 收口清单九项全部完成（第 513 到 524 簇）。非测试 `.tsx` 953 个中接入翻译器 736 个 (77.2%)，未接入的多数本身没有文案；静态扫描的四条口径（JSX 文本、四个属性、toast/throw、模板串）加宽口径 string 的"变量转传"复读都已清完，可见队列只剩判定账里的机读串 |
| **目录规模** | 中英消息各 11877 个叶子，键树完全对齐 (parity 守卫 0 差集)，中英同值 139 个（多为 URL、模型名、协议单位等格式示例，非漏翻）；死键 0，按空基线棘轮 |
| **测试** | 全量三 project 合跑 970 个文件、13056 例，9 例是仓库既有的预期失败，真红 0；`Type Errors` 报 no errors，旧账里的 878 条测试文件类型债已清 |
| **类型与构建** | `tsc --project tsconfig.production.json` 0 错，`npm run build` 退出 0 |
| **i18n 守卫** | `src/lib/i18n` 五道（locales、messagesParity、missingKeys、messageArgs、format）加 `src/lib/toast.test.ts` 的动态标题目录覆盖守卫，6 个文件 59 例通过 |
| **CI 门禁** | `eslint .` 0 error（第 524 簇前是 77 条未抑制的 error）；`check-lint-budgets.mjs` 九条全过，其中 `no-large-inline-object-arg` 476/477、`no-long-condition-chain` 200/200、`no-console` 16/16 与 `testing-library/prefer-screen-queries` 18/18 已顶格；`npm run knip:ci` 通过；`npm run check:dead-keys` 通过；`npm run scan:rendered` 在 15 页上 0 渲染错误、除基线两枚端点路径外 0 处英文（该数字是第 515 簇实测，第 523 与 524 簇只搬代码未动文案，按判据不需复跑） |

进度、逐簇账与口径以 [`ui/litellm-dashboard/docs/i18n/PROGRESS.md`](ui/litellm-dashboard/docs/i18n/PROGRESS.md) 为准；实施流程见同目录 `WORKFLOW.md`

### 已修复的关键问题

1. **Docker 构建阻断**：`ModelsTableColumns.tsx` 的 `"use client"` 指令位置错误 → 已修复并合并至 `main`
2. **构建时类型错误**：`dd32399` 遗留的非测试文件类型错误 → 全部清零，`npm run build` 恢复绿色
3. **缺 Provider 测试失败**：223 例 → 全部修复
4. **缺键**：47 条真实缺失 (被 `missingKeys` 守卫拦截) → 全部补齐
5. **断言过时**：第六类失败 (断言停在英文) → 在观测范围内归零
6. **`mcp_server_edit` OAuth 恢复取值失败**：根因是测试占位符正则写错，非组件缺陷 → 已在 `f3b21f32` 修复
7. **认证类型标签接线后消费方测试仍按英文名查**：`AddModelForm.integration` 与 `CredentialModal.integration` 共 12 处查询（含正则形式）没跟着翻面，8 例稳定红 → 已翻成「认证类型：」，并把"改动组件要连消费方测试一起跑"写进 `WORKFLOW.md` 第六步
8. **仓库级 lint 77 条未抑制 error**：54 处未用导入、14 处 `zod/v4` 导入、3 处嵌套三元、2 处超参数、2 处超行数、1 处裸 fetch、1 处 children prop → 全部清零，`eslint . --prune-suppressions` 顺带削掉 7 条过期基线；清死导入后彻底无引用的 `HotkeysProvider.tsx` 与 `HeuristicKeywordOverrides.tsx` 一并删除，knip 恢复绿色
9. **批量建用户的"下载 CSV 模板"按钮没有 `onClick`**：点了不做事 → 表头由同文件解析器读取的六列唯一确定，动作抽进 `bulkUsersCsvTemplate.ts` 并补一条真断言测试

### 剩余工作

- **下一次上游同步**：按决定暂缓，计划与风险见 [`ui/litellm-dashboard/docs/i18n/UPSTREAM-SYNC.md`](ui/litellm-dashboard/docs/i18n/UPSTREAM-SYNC.md)。同步当天要额外做三件事：按合并后实数重测 `eslint-budgets.json` 的棘轮、跑 `eslint . --prune-suppressions` 让抑制基线跟着新树走、复跑死键门禁与渲染扫描
- **lint 预算几乎没有余量**：`no-console` 与 `testing-library/prefer-screen-queries` 已顶到上限，`no-long-condition-chain` 也是 200/200，`complexity` 只剩 1 条。新增这类写法会直接把门禁改红，收口办法是把内联对象提成具名变量、把条件链改成早返回的辅助函数，不要调上限
- **18 个文件仍走 `max-lines` 抑制基线**：这些是上游既有的巨型文件，本轮只处理了汉化真正推过线的四个。要清得逐个做文件级拆分，属独立一簇
- **换新维度而不是重扫旧正则**：四条静态口径与宽口径 string 的可见队列都已清空，剩下的命中全部有判定归属（技术值、协议标识、导出列头与文件名、代码语料、品牌名、MCP 协议能力名）。下一轮应从新组件、新页面、新交互形态入手，配合 `npm run scan:rendered` 在运行期发现
- **可选的小重构**：`bulkUsersCsvTemplate.ts` 的模板表头与 `bulk_create_users_button.tsx` 解析器读取的列名现在是两份并列事实，可以收成一个共享来源，让改列名时测试自然变红
