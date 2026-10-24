# LiteLLM 管理 UI 简体中文翻译文档

这套文档记录 `ui/litellm-dashboard` 简体中文（`zh-CN`）翻译的技术方案、批次计划、当前进度、单批实施流程与缺陷修复方法

`TRANSLATION_PLAN.md` 是这套文档的前身，仍然保留，因为它的"踩坑记录"部分是一手的、别处没有的经验，但它的进度表已经过期，数字停在九月底。要看当前状态请以本目录为准

## 当前状态（2026-10-24）

汉化工程已收口，清单上的九项全部做完，`main` 与 LAN 远端同步。逐簇的账在 [PROGRESS.md](./PROGRESS.md)，本目录其余七篇写的是方法不是进度

三条实测口径。中英目录叶子各 11877 且键树无差集、死键 0。非测试 `.tsx` 共 954 个，接入翻译器 737 个，77.3%，未接入的多数本身没有文案。门槛全绿，`eslint .` 0 error、`check-lint-budgets.mjs` 九条规则通过、`tsc` 0 错，全量三 project 合跑 13056 例，9 例是仓库既有的预期失败，首轮 5 例红已逐条归零（3 例是断言没跟着翻面、2 例是整机负载抖动，单跑全绿）

三处边界要记住。上游同步按决定暂缓，[UPSTREAM-SYNC.md](./UPSTREAM-SYNC.md) 仍是计划。按判定账留英文的是机读面（导出列头与文件名、MCP 协议能力名、后端枚举、代码语料），不是漏翻。`no-console` 与 `testing-library/prefer-screen-queries` 两条预算已经顶到上限，任何新增调用都会让门禁红

## 文档索引

| 文档                                   | 内容                                                                |
| -------------------------------------- | ------------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | 项目细节：i18n 层的文件职责、语言解析、状态传播、类型增强、守卫测试 |
| [PLAN.md](./PLAN.md)                   | 开发计划：目标、原则、批次划分与优先级                              |
| [PROGRESS.md](./PROGRESS.md)           | 开发进度：覆盖率统计、模块状态、测试基线、下一步优先级              |
| [WORKFLOW.md](./WORKFLOW.md)           | 实施步骤：单批执行流程、验证清单、编码约定                          |
| [FIXES.md](./FIXES.md)                 | 错误修复步骤：缺陷分类、定位手段、修复方式与回归                    |
| [RENDERED-SCAN.md](./RENDERED-SCAN.md) | 渲染扫描：用真实浏览器查运行期才炸的故障与残留英文                  |
| [UPSTREAM-SYNC.md](./UPSTREAM-SYNC.md) | 上游同步计划：差距量化、逐文件三方合并的阶段与风险                  |

## 相关文档

| 文档                                                         | 内容                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| [`src/messages/GLOSSARY.md`](../../src/messages/GLOSSARY.md) | 中英术语对照表，新增中文文案的定译依据 |
| [`TRANSLATION_PLAN.md`](../../TRANSLATION_PLAN.md)           | 历史计划与踩坑日志，按下文取舍阅读     |
| [`AGENTS.md`](../../AGENTS.md)                               | 该子项目的测试分层与断言约定           |

## 读哪一篇

接手翻译工作时按这个顺序读。先看 [ARCHITECTURE.md](./ARCHITECTURE.md) 搞清 `next-intl` 在这一层怎么接的，再读 [PLAN.md](./PLAN.md) 的批次划分知道自己该动哪一块，动手前把 [WORKFLOW.md](./WORKFLOW.md) 的七步流程过一遍，遇到红灯查 [FIXES.md](./FIXES.md)，想知道还剩下什么就看 [PROGRESS.md](./PROGRESS.md)

只想快速定位某个文件为什么翻译没生效，直接跳到 [FIXES.md](./FIXES.md) 的分类表，那里按症状索引
