# LiteLLM 管理 UI 简体中文翻译文档

这套文档记录 `ui/litellm-dashboard` 简体中文（`zh-CN`）翻译的技术方案、批次计划、当前进度、单批实施流程与缺陷修复方法

`TRANSLATION_PLAN.md` 是这套文档的前身，仍然保留，因为它的"踩坑记录"部分是一手的、别处没有的经验，但它的进度表已经过期，数字停在九月底。要看当前状态请以本目录为准

## 文档索引

| 文档                                 | 内容                                                             |
| ------------------------------------ | ---------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 项目细节：i18n 层的文件职责、语言解析、状态传播、类型增强、守卫测试 |
| [PLAN.md](./PLAN.md)                 | 开发计划：目标、原则、批次划分与优先级                            |
| [PROGRESS.md](./PROGRESS.md)         | 开发进度：覆盖率统计、模块状态、测试基线、下一步优先级             |
| [WORKFLOW.md](./WORKFLOW.md)         | 实施步骤：单批执行流程、验证清单、编码约定                         |
| [FIXES.md](./FIXES.md)               | 错误修复步骤：缺陷分类、定位手段、修复方式与回归                   |

## 相关文档

| 文档                                          | 内容                                       |
| --------------------------------------------- | ------------------------------------------ |
| [`src/messages/GLOSSARY.md`](../../src/messages/GLOSSARY.md) | 中英术语对照表，新增中文文案的定译依据 |
| [`TRANSLATION_PLAN.md`](../../TRANSLATION_PLAN.md)           | 历史计划与踩坑日志，按下文取舍阅读     |
| [`AGENTS.md`](../../AGENTS.md)                               | 该子项目的测试分层与断言约定           |

## 读哪一篇

接手翻译工作时按这个顺序读。先看 [ARCHITECTURE.md](./ARCHITECTURE.md) 搞清 `next-intl` 在这一层怎么接的，再读 [PLAN.md](./PLAN.md) 的批次划分知道自己该动哪一块，动手前把 [WORKFLOW.md](./WORKFLOW.md) 的七步流程过一遍，遇到红灯查 [FIXES.md](./FIXES.md)，想知道还剩下什么就看 [PROGRESS.md](./PROGRESS.md)

只想快速定位某个文件为什么翻译没生效，直接跳到 [FIXES.md](./FIXES.md) 的分类表，那里按症状索引
