# 开发进度

数据快照 2026-10-12，仓库 `D:\Qoder-workspace\LiteLLM-Chinese`，分支 `main`，HEAD `ff54aee`（测试统计来自 `6d06b7b` 后的全量运行）

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                       | 数值                                                 |
| ------------------------ | ---------------------------------------------------- |
| 命名空间                 | 38                                                   |
| `en.json` 叶子键          | 5178                                                 |
| `zh-CN.json` 叶子键       | 5178                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 71（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 71 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 298 个，覆盖率 34.6%

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
| **共享 `src` 目录**        | **442/482** |                    |             |

共享 `src` 目录那一行是长尾，也就是批次 24。它贡献了 442 个未接入文件，占全部 563 个未接入文件的绝大多数，不过里面混着大量本来就不含文案的文件（hooks、types、纯逻辑封装），不能直接按这个数字估工作量

mcp-servers 名义上剩 5 个未接入文件，但其中 4 个本来就没有面向用户文案（页面壳、re-export、键常量表、测试 harness），校验文案已于 `5c2da87` 接入。cost-optimization 剩的 1 个同样是无文案的页面壳

## 测试状态

命令：`npx vitest run --reporter=json`，全项目，2026-10-12 实测

| 指标             | 数值                     |
| ---------------- | ------------------------ |
| 用例总数         | 11306                    |
| 通过             | 10356（91.6%）           |
| 失败             | 950                      |
| 有失败的测试文件 | 149                      |

上一次全量为 1323 失败，此后 team 批次（`deab7e7`）消掉 172，Provider 批次（`6d06b7b`）消掉 223 条缺 Provider 加 45 条连带断言。本次运行与 mcp-servers 的一次小改动有时间重叠，mcp-servers 目录单独复测为 20 例 / 2 文件，其余数字未再修正

### 失败的归属

按被测源文件（同目录同名去 `.test`）是否引入 `next-intl` 分类

| 归属               | 文件数 | 失败用例数 |
| ------------------ | ------ | ---------- |
| 源文件已接入翻译   | 114    | 666        |
| 源文件未接入翻译   | 6      | 10         |
| 同位找不到源文件    | 29     | 274        |

第三类多为跨模块的 integration 测试，一个测试文件测多个组件，不能简单按同位文件判定

按错误文本聚合

| 失败用例数 | 错误文本                                          |
| ---------- | ------------------------------------------------- |
| 820        | `Unable to find ...` 各类元素找不到                |
| 59         | `toBeEnabled` / `toBeDisabled` / `toBeChecked`     |
| 58         | `toHaveTextContent` / `toHaveValue` 等内容断言     |
| 13         | 其他（数组深比对、`toBeVisible` 等）               |

223 条缺 `NextIntlClientProvider` 已全部清零。剩下的主力是 820 条"找不到元素"，绝大多数是断言停在英文（第六类），但其中混有与翻译无关的既有失败，处理时要逐文件回 HEAD 基线确认，不要一律当成翻译的账

失败最集中的目录与文件

| 位置                                        | 失败用例数 |
| ------------------------------------------- | ---------- |
| `src/app/(dashboard)`                       | 793        |
| `src/components/edit_auto_router`           | 46         |
| `src/components/add_model`                  | 28         |
| `src/components/leftnav.test.tsx`           | 27         |
| `src/components/view_logs`                  | 15         |
| 单文件前三：`edit_auto_router_modal.integration`(46)、`users/user_edit_view`(38)、`users/view_users/user_info_view.integration`(28) | |

### 各路由的测试状态

| 路由                  | 失败用例 | 失败文件 | 路由                | 失败用例 | 失败文件 |
| --------------------- | -------- | -------- | ------------------- | -------- | -------- |
| guardrails            | 120      | 24       | mcp-servers         | 20       | 2        |
| policies              | 112      | 14       | old-usage           | 20       | 1        |
| users                 | 91       | 4        | admin-panel         | 19       | 1        |
| projects              | 82       | 10       | caching             | 18       | 3        |
| prompts               | 56       | 18       | tag-management      | 11       | 3        |
| agents                | 55       | 10       | router-settings     | 8        | 1        |
| usage                 | 45       | 6        | memory              | 7        | 2        |
| cost-tracking         | 36       | 6        | skills              | 6        | 3        |
| guardrails-monitor    | 30       | 5        | change-password     | 5        | 1        |
| playground            | 27       | 9        | budgets             | 21       | 4        |

models-and-endpoints、cost-optimization、access-groups、organizations、workflows、transform-request、ui-theme 保持零失败

### i18n 自身的守卫

三条守卫全部通过，16 个用例

```
npx vitest run src/lib/i18n
```

`locales.test.ts` 7 个、`messagesParity.test.ts` 8 个、`missingKeys.test.ts` 1 个

其中 `missingKeys.test.ts` 在这一轮之前是失效的，见 [FIXES.md](./FIXES.md) 的"2026-10-12 新发现并修复的两条"。修好之后它报出 47 条真实缺失，补齐后转绿

`src/components/shared/LanguageSwitcher.test.tsx` 有 2 个失败，属于设计冲突而非缺陷：`renderWithProviders` 强制 `locale="zh-CN"`，而这两个用例假设默认是英文，并且想验证"切换后变中文"这条链路。强制 locale 会把 `localStorage` 驱动的那条链路短路掉，所以这个组件的测试不能走 `renderWithProviders`，需要一个可以省略 `locale` 的包裹层

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

## 下一步优先级

原来的四个优先级里，第一（223 条缺 Provider）、第二（team 172 例）、第三（页面收口）都已完成。mcp-servers 剩余 5 个"未接入"文件里四个本来就没有面向用户文案（页面壳、键常量、测试 harness），校验文案补齐后该页真正剩下的只有 20 例第六类断言过时；cost-optimization 剩的那 1 个文件是无文案的页面壳

所以下一步就是一件事：按第六类清 820 条"找不到元素"。建议从失败最集中的单文件开始，逐个用"回 HEAD 基线确认既有失败"的办法区分翻译账和非翻译账

| 顺序 | 目标                                                                 | 失败数 |
| ---- | -------------------------------------------------------------------- | ------ |
| 1    | `edit_auto_router/edit_auto_router_modal.integration.test.tsx`        | 46     |
| 2    | `users/user_edit_view.test.tsx`                                       | 38     |
| 3    | `users/view_users/user_info_view.integration.test.tsx`                | 28     |
| 4    | `leftnav.test.tsx`                                                    | 27     |
| 5    | `old-usage/usage.test.tsx`                                            | 20     |
| 6    | `mcp-servers/CreateMCPServer.integration.test.tsx`（含 1 例 OAuth 既有失败） | 19     |
| 7    | guardrails 族（24 个文件 120 例）与 policies 族（14 个文件 112 例）    | 232    |

最后才是批次 24 的共享组件长尾与硬编码收口，欠账清单见 [FIXES.md](./FIXES.md) 的"批次 24 硬编码英文欠账清单"

另外有一件小事不依赖批次顺序，且卡着一个具体失败：`renderWithProviders` 强制 `locale="zh-CN"`，`LanguageSwitcher` 的 2 个失败就是它造成的。判断口径在 `tests/test-utils.tsx` 里留了标记

## 技术债

`AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败是既有问题，与 i18n 无关，留给对应模块

`mcp_server_edit.test.tsx` 的 "preserves a stored client_id on OAuth-resume restore" 1 例在 HEAD 上即失败（`expected '' to be 'stored-client'`），2026-10-12 用单文件 stash 对照确认与翻译无关

全仓库 `tsc --noEmit` 有 928 条错误，分布在 60 个文件（2026-10-12 实测），都是翻译之前就有的。`TRANSLATION_PLAN.md` 里写的"约 819 条、56 个文件"是更早的一次测量，已过时

比对基线前先确认 `ui/litellm-dashboard/next-env.d.ts` 存在（它被 gitignore，删掉后会虚增 145 条 `assets/logos` 的 TS2307），标准内容就两行 `/// <reference types="next" />` 与 `/// <reference types="next/image-types/global" />`

判断有无新增要逐条比对，不要只看总数，按文件去重会掩盖同一文件内的新增错误。`src/lib/i18n` 目录目前是零错误

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
