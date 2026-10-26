# 静态英文基线门禁

`scan-english.mjs` 只给工作清单，不是判定；渲染扫描又只在本地跑。新写的硬编码英文因此可以一路绿到主干。这一层补的是静态口径的 pass/fail 门禁：把已判定保留的残留冻结成基线，新增命中即红

## 范围与口径

- 文件：`src/**/*.{ts,tsx}`，排除 `*.test.*`、`*.test-d.*` 与 `*.d.ts`
- 四口径：JSX 文本、14 个文案属性（`aria-label`、`alt`、`description`、`emptyText`、`errorMessage`、`helperText`、`hint`、`label`、`message`、`placeholder`、`sublabel`、`subtitle`、`title`、`tooltip`）、`toast.{success,error,warning,info}` 首参、`new *Error("…")` 首参
- 宽口径 `--all`（字符串与模板串）不进门禁，避免把代码语料全卷进来

## 基线

`english-leaks-baseline.json`，2026-10-26 第 534 簇冻结 284 条、162 个文件。类型分布：JSX 141、`prop:placeholder` 67、`error` 65、`prop:title` 4、`prop:alt` 4、`prop:label` 2、`prop:aria-label` 1

判定沿用 `GLOSSARY.md` 的"保留英文"五档，残留主要是

- 品牌与产品名：`LiteLLM`、`Moyai`、`Langchain Py`、`LlamaIndex`、`OpenAI Python SDK`、`datadog-logging`、`langfuse-logging`
- 机读面与协议：`x-litellm-response-cost*`、`images`/`model`/`tool_calls`、`/v1/decisions`、`gatewaySessions.byAiClient` 这类传给 `t()` 的键、CSV 列名与后端枚举
- 格式示例与代码语料：URL、JSON、YAML 片段、`e.g., …`、`final_cost = …`
- 单位、缩写、符号与键盘键：`ms`、`KB`、`RPM`、`TPM`、`USD`、`(UTC)`、`v`/`s`/`x`、`esc`、`Enter`、箭头与 `&middot;`
- 内部异常与测试脚手架：`throw new Error("Access token is required")` 这类调用方吞掉或喂给模型的串，以及 `McpFormTestHarness` 的 `Submit`

本簇唯一真漏是 `usePlaygroundSend` 的 `toast.info("Request cancelled")`，复用现成 `playground.chat.requestCancelled` 接净。扫描器同时修掉一处误报：`new Date("2026-09-01T00:00:00Z")` 曾因"任意 `new X("…")`"口径被当作 error，现收紧到 `new *Error`

## 用法

```
npm run check:english-leaks        # 新增命中即失败，基线已解决条目提示 stale
npm run check:english-leaks:write  # 翻译或移动文件后刷新基线
```

新命中优先翻译；确属机读面、格式示例或品牌时，先在本文件补一条判定理由，再 `--write` 冻结。基线已解决条目会让门禁红，提示刷新，避免基线只增不减

本地跑门禁前，新建文件要 `git add`，文件枚举走 `git ls-files`

## CI

接在 `test-unit.yml` 的 `ui-unit` job，步骤名 `Check for new English display strings`，排在 `npm run typecheck` 之后、完整 Vitest 之前。该 job 在 push main 与 PR 都跑，PR 只在改了 UI 文件时执行，扫描约半分钟，失败以 `::error file=…` 标出文件与新串

死键门禁仍只在 PR 的 `UI i18n Gates` 跑，渲染扫描保持本地
