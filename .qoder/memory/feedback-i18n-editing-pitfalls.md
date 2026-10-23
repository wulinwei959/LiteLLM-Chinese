---
name: feedback-i18n-editing-pitfalls
description: 汉化批次里手改消息目录、批量替换与验证命令反复踩的坑及规避写法
metadata:
  type: feedback
---

本轮第 467-479 簇里，同一类命令错误反复出现，逐条记录，下回按规避写法做。

**目录 JSON 手改**
- 锚点行若恰好是对象最后一项，行尾没有逗号；直接在其后插行会得到非法 JSON。插入前先给锚点补逗号，若插入点后紧跟 `}`，则新增的最后一行不带逗号。最终一定要 `python3 -c "json.load(...)"` 验证两端。
- 同名同值的键会出现在多个命名空间（`noModelsFound` 在 `models.addModel` 与 `modelSelect` 都有，值都是"未找到模型"）。按"行内值"定位会把键插错命名空间，组件就会渲染原始键名。正确做法：先定位 `"<namespace>": {` 的行号，再在这个块内插入，插完打印该命名空间的键确认。
- 插入失败后重跑修复脚本前，先看文件当前状态，否则会出现同一组键插两遍（本次在 searchBox 上发生过）。
- 批量 `str.replace()` 不带 count 会命中所有同名行（例如 `const { data } = useDeploymentWarnings();` 出现两次，插入 `const t` 后重复声明报 TS2451）。改用 count 断言、限定上下文或按行号操作。

**正则**
- `\.(?:ts|tsx)` 会把 `.tsx` 截成 `.ts`，导致所有文件 `exists=False`、脚本报"0 候选"。必须写成 `\.(?:tsx|ts)`。
- `z\.custom<([^>]+)>` 遇到嵌套泛型（`Record<string, string[]>`）会截断，漏改字段。改完用 `grep -n "custom<" | grep -v optional` 复核。
- 多行替换在 prettier 重排后会失配（`.custom(...)` 与 `.refine(...)` 的换行变化），失败时先 `sed -n` 看当前格式再改。

**Shell 与命令**
- `grep -c` 命中 0 时退出码是 1，会把 `&&` 链整条打断，看起来像"检查失败"。要么用 `grep -c ... || echo 0`，要么把计数单独跑。
- 在 `ui/litellm-dashboard` 里跑 prettier/eslint 时，不要传仓库根相对路径（会报 No files matching），先转成当前目录相对路径。
- 该项目的 vitest 没有 `--reporter=basic`，用默认或 `--reporter=dot`。
- 全量 61 个失败文件整跑约 2.5 分钟，放后台等通知，不要 `sleep` 轮询。

**批量翻面断言**
- 只替换"失败信息里测试实际查找的那条串"，再对到 `en.json` 同值在 `zh-CN.json` 的词条；不要整文件替换英文，否则会误伤 mock 数据里的同名值。
- 正则形式的期望（`/edit settings/i`、`/Budget & Rate Limits/`、`/add model budget/i`）不在字符串映射里，批处理抓不到，需要按失败文件单独看。
- 同一文案在目录里可能有多套译法（`Chat` 同时有"聊天"和"对话"），以组件实际使用的命名空间为准。

相关：[[feedback-model-rate-limit]]、[[feedback-simplified-chinese]]
