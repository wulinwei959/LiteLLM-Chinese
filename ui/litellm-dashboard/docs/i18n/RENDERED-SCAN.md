# 渲染扫描

静态扫描能回答"文案在目录里、但调用点没接"，回答不了"目录里的文案本身在运行期才炸"。第 417 到 419 簇里八个真实的运行时故障，全是渲染扫描找出来的，源码扫描一条都查不出。

最近一次复跑：2026-10-24 第 515 簇，15 个页面各 0 个渲染错误，新增的 `model-health`（`/models-and-endpoints?tab=health`）剩 2 处端点路径段已进基线，其余 14 页 0 处英文。

页面清单新增 `search-tools`、`roi-calculator` 与 `model-health`。`model-health` 靠 URL 参数 `?tab=health` 直达页内 tab（`useUrlTab` 的键就是 `tab`），不需要脚本支持点击。首轮撞出 `proxyConfigData.find is not a function`，成因仍是桩代理对未登记路径回 `{}`，补 `/models/list`（两行模型，一行带健康记录、一行不带，用来同时覆盖日期列与"无"哨兵列）、`/health/latest`、`/config/list`（数组）三个桩后归零。同轮扫出两处真缺陷：`DecisionModelsBanner` 的 `orTry` 词条本身已是完整句（en ", or try them in the Decisions playground."），JSX 却又硬拼一个 `playground.{" "}` 文本节点，两种语言都会重复渲染句尾，且 JSX 那个多余的 `, ` 与词条前导逗号叠成双逗号；顺带把 zh 的 `orTry` 从"决策 playground"改成侧栏既有术语"决策演练场"。正文里剩下的 `GitHub` 与 `GitHub Enterprise` 是产品名，进 `ALLOWED_ENGLISH`。ROI 页第一次扫时撞出 `Cannot read properties of undefined (reading 'length')`，原因是桩代理对未登记的 `/roi-calculator/*` 一律回 `{}`，补进四个桩（settings、report、sync、repositories，字段按 `schema.d.ts` 的 `ROISettingsResponse`/`ROISyncStatus`/`ROIReportResponse`/`ROIRepositoriesResponse` 对齐）后归零。正文里剩下的 `GitHub` 与 `GitHub Enterprise` 是产品名，进 `ALLOWED_ENGLISH`

## 它查什么

用真实浏览器打开每个页面，收集两样东西：

1. **渲染过程中的错误**。`console.error` 与未捕获的异常。目录里的消息写对了、调用点看着也对，但两边对不上时，next-intl 会在渲染那一刻抛 `FORMATTING_ERROR`；静态看两边都是合法的。
2. **渲染后的正文里剩下的英文**。界面语言是中文，正文里却还有英文词组，就是漏翻。按词组报，不按单词报。

## 怎么跑

```
npm run dev            # 一个终端
npm run scan:rendered  # 另一个终端
```

需要先装浏览器：

```
npm i -D playwright
npx playwright install chromium
```

Linux 上 Chromium 还要系统库，`npx playwright install --with-deps chromium` 会一并装上（要 sudo）。

## 怎么判

发现跟基线比，规则和死键门禁一样：基线里有的算已知，新增的让运行失败。基线在 `scripts/rendered-ui-baseline.json`，确认过要保留的发现之后用

```
npm run scan:rendered -- --update-baseline
```

刷新。

## 数据从哪来

默认自己起一个桩代理，喂给仪表盘的那些响应写在 `scripts/rendered-ui-fixtures.mjs` 里。**形状必须跟代理真返回的一致**，否则页面撞上错误边界，扫到的是错误页而不是界面。踩过的几处：`/team/list` 与 `/organization/list` 返回裸数组，`/v2/team/list` 才分页；`/spend/logs/ui` 是 `{data, total, page, page_size, total_pages}`；`/public/v1/model_hub` 是 `{data, meta}`。

要对着真代理跑，指过去就行：

```
npm run scan:rendered -- --proxy-url http://localhost:4000
```

桩代理就不起了。

## 白名单

`ALLOWED_ENGLISH` 列的是判定账里的东西：产品名（LiteLLM、Lens、LiteAdmin、AI Hub）、协议名（MCP、JWT、OAuth、SSO）、单位（TPD、RPM、USD）、以及界面上当数据展示的标识符（键别名、模型名、`.prompt`）。

往里加之前先确认那不是漏翻的文案。

## 局限

- 扫的是正文，扫不到 canvas、图表里的图例文字、输入框的 placeholder
- 桩里的数据是空的，所以带数据的交互路径（展开行、打开抽屉、翻页）扫不到
- 页面清单在 `PAGES` 里，手动维护；上游加了新页面要补
