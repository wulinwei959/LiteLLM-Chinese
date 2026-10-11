# 开发进度

数据快照 2026-10-12，仓库 `D:\Claude\LiteLLM-Chinese`，分支 `main`，HEAD `dd32399`

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                       | 数值                                                 |
| ------------------------ | ---------------------------------------------------- |
| 命名空间                 | 38                                                   |
| `en.json` 叶子键          | 5175                                                 |
| `zh-CN.json` 叶子键       | 5175                                                 |
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

mcp-servers 只剩 5 个文件未接入，是完成度最高的页面族。cost-optimization 只剩 1 个

## 测试状态

命令：`npx vitest run --reporter=json`，全项目，2026-10-12 实测

| 指标             | 数值                     |
| ---------------- | ------------------------ |
| 用例总数         | 11306                    |
| 通过             | 9983（88.3%）            |
| 失败             | 1323                     |
| 有失败的测试文件 | 186                      |

### 失败的归属

按被测源文件是否引入 `next-intl` 分类

| 归属             | 文件数 | 失败用例数 |
| ---------------- | ------ | ---------- |
| 源文件已接入翻译 | 159    | 1136       |
| 源文件未接入翻译 | 27     | 187        |

已接入翻译的文件占了 86% 的失败，说明主力工作是"断言还停在英文、组件已经输出中文"，也就是 [FIXES.md](./FIXES.md) 的第六类

按错误文本聚合，前几类

| 失败用例数 | 错误文本                                                |
| ---------- | ------------------------------------------------------- |
| 223        | `context from NextIntlClientProvider was not found`      |
| 1008       | `Unable to find ...` 各类元素找不到                       |
| 45         | `toHaveTextContent` / `toHaveValue` 等内容断言不符        |
| 13         | `toBeEnabled` / `toBeDisabled` 等状态断言不符             |
| 34         | 其他                                                     |

223 条缺 `NextIntlClientProvider` 是确定无疑的 i18n 问题，改成 `renderWithProviders` 即可

1008 条"找不到元素"是最需要小心的一类。它们绝大多数是断言停在英文（找不到 `Edit Settings`、`Project Name`、`Save Changes` 这些已变成中文的文本），但其中混有与翻译无关的既有失败。处理时要逐文件用 `git stash` 回基线确认，不要一律当成翻译的账

失败最集中的目录

| 目录                              | 失败用例数 |
| --------------------------------- | ---------- |
| `src/app/(dashboard)`             | 814        |
| `src/components/team`             | 172        |
| `src/components/view_logs`        | 38         |
| `src/components/add_model`        | 29         |
| `src/components/leftnav.test.tsx` | 27         |
| `src/components/templates`        | 25         |

`src/components/team` 的 172 个失败是单目录最大的一块，14 个文件已接入翻译，是批次 10 的欠账

### 各路由的测试状态

| 路由                  | 失败用例 | 失败文件 |
| --------------------- | -------- | -------- |
| models-and-endpoints  | 0        | 0        |
| cost-optimization     | 0        | 0        |
| access-groups         | 0        | 0        |
| organizations         | 0        | 0        |
| workflows             | 0        | 0        |
| transform-request     | 0        | 0        |
| ui-theme              | 0        | 0        |
| mcp-servers           | 20       | 2        |
| guardrails-monitor    | 30       | 5        |
| prompts               | 56       | 18       |
| policies              | 112      | 14       |

上表前七个模块是零失败，对应 [PLAN.md](./PLAN.md) 里已完成的核心批次

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

排序的依据是"用户影响 / 工作量"的比值。手上有这些候选，顺序见下一节

第一优先是 223 条缺 `NextIntlClientProvider` 的失败。它们的修法统一（换 `renderWithProviders`），机械且批量，一次能消掉六分之一的失败用例，是所有工作里性价比最高的

第二优先是 `src/components/team` 的 172 个失败。它是单目录最大的一块，且团队管理是核心功能

第三优先是补完未接入翻译的页面。mcp-servers、cost-optimization、guardrails、prompts 都只剩个位数文件，收口成本低

最后才是批次 24 的共享组件长尾。它必须等页面批次全部完成后才能一次性收口，早做会让同一个文件被反复改动

### 下一步的批次顺序

上面是按我给出的判断排的。实际的优先级取决于你更在意什么，是先把测试全绿（那么从 223 条 Provider 缺失入手），还是先把某个具体页面在中文下做完整（那么从 mcp-servers 或 cost-optimization 收口），还是先把团队管理这块最大的坑填掉

取舍在于：先修测试能立刻拿到可验证的进展，但修的可能是即将被下一批翻译继续改动的文件；先补翻译则会让测试失败数继续上升，短期内看不到"变好"

另外有一件小事不依赖批次顺序，且卡着一个具体失败：`renderWithProviders` 强制 `locale="zh-CN"`，`LanguageSwitcher` 的 2 个失败就是它造成的。判断口径在 `tests/test-utils.tsx` 里留了标记

## 技术债

`AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败是既有问题，与 i18n 无关，留给对应模块

全仓库 `tsc --noEmit` 有 928 条错误，分布在 60 个文件（2026-10-12 实测），都是翻译之前就有的。`TRANSLATION_PLAN.md` 里写的"约 819 条、56 个文件"是更早的一次测量，已过时

判断有无新增要逐条比对，不要只看总数，按文件去重会掩盖同一文件内的新增错误。`src/lib/i18n` 目录目前是零错误

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
