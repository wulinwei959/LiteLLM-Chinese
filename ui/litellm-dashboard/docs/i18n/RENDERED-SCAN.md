# 渲染扫描

静态扫描能回答"文案在目录里、但调用点没接"，回答不了"目录里的文案本身在运行期才炸"。第 417 到 419 簇里八个真实的运行时故障，全是渲染扫描找出来的，源码扫描一条都查不出。

最近一次复跑：2026-11-05 第 574 簇，口径同时扩到属性文案。`scanObjectProperty` 让静态门禁看见 `.ts` 表值之后，运行期这一侧的同类盲区也补上了：扫描除 `innerText()` 外还读 `COPY_ATTRIBUTES`（`alt`、`aria-label`、`placeholder`、`title`），按 `attr:<属性名>` 记发现。41 页复跑 0 渲染错误，正文英文仍是 58 条基线项、0 新增，属性口径新增 228 条，去重后只有 31 个不同串，其中 `beta`(80 页次)、`Slack`(41)、`Notifications alt`(41)、`unknown`(40) 四条是页面外壳与数据值在每个页面重复计入，其余是 `config.yaml`、`agent`/`research`/`plan`/`docs`/`search`/`benchmark`/`run`/`answer` 这类工具与步骤名、以及 `Valkey`/`redis`/`host`/`password`/`Cmd`/`Ctrl`/`Shift`/`logo.png` 这类输入示例，本轮没有撞出新的产品文案漏翻。`Notifications alt` 在 `src` 里 grep 不到字面量，是运行期拼出来的外壳标签，记待查。基线因此 58 涨到 286 条，涨的是新口径第一次被看见，不是门禁变松

（沿革）2026-11-04 第 561 复跑：`PAGES` 从 38 扩到 41，补上从未进过扫描面的 `playground`、`old-usage`、`change-password`（`/` 与 `/home` 是同一个组件，不必单列）。扩面撞出 7 条新发现，6 处英文加 1 条运行期错误，逐条溯源后全部接掉或判归。`change-password` 的面包屑渲染出 `Change Password`，走的是 `getBreadcrumb` 的 `prettify` 回落，新开 `nav.changePassword` 并把它列进 `UNLISTED_TITLES`。playground 空会话的三条示例提示词是英文，同一张能力表由 2026-10-20 的上游合并带入、从没进过汉化批次。`chat` 与 `completions` 是端点下拉里展示的 `/v1/chat/completions` 路径段，判机读面进 `ALLOWED_ENGLISH`。`CompliancePromptLibrary.tsx` 把框架行的"全选/清除"按钮嵌在整行可点的展开按钮里，React 直接报 `<button>` 不能是 `<button>` 的后代，拆成同一行的兄弟按钮，`stopPropagation` 随之删掉。那张能力表里还躺着八条输入占位符和三条附件提示，扫描一条也看不见，`rendered-ui-scan.mjs` 取的是 `innerText()`，属性文案不在它的口径里，只能读代码捞，一并改成常量存键名、渲染处 `t()`，示例提示词复用既有的 `playground.chat.suggestions.default` 与 `.a2a`，代码解释器三条另开 `.codeInterpreter`。白名单那一条顺带让 `transform-request` 的两条基线项消失，基线从 60 降到 58。桩表补 `/v1/mcp/toolset` 后 0 条 stub-miss。复跑 41 页 0 渲染错误、0 条新发现，剩余 58 条按页是 api-reference 31、transform-request 18、lens 8、model-insights 1

（沿革）2026-10-29 第 539 簇。PR #14/#15 合并后复跑，38 页 0 渲染错误，撞出 25 条新英文泄漏（usage 17、caching 2、cost-optimization 3、home 3），全部集中在 PR #13/#14 接回的用量域。逐条溯源修复后复扫归零：`UsageStatStrip`、`UsageBreakdownChart`、`BreakdownChart`、`UsageViewSelect`、`advanced_date_picker`、`overviewData`、`ClientUsagePanel` 的硬编码英文与 `en-US` locale 格式化全部接翻译键或改按当前 locale 渲染，图表月份轴从 Oct/Sep 变 10月/9月。基线维持 60 条，0 条新发现。`rendered-ui-scan.mjs` 改用 `channel: "chrome"` 走本机 Chrome，不再要求 Playwright 下载的 Chromium。剩余 60 条按页是 lens 8、api-reference 31、transform-request 20、model-insights 1

（沿革）第 532 簇把第 530 簇进基线的零头（除 lens 86、api-reference 31、transform-request 20 外的 25 条）逐条甄别完：6 条真漏接键（model-insights 的 Requests/Spend/Linear/Log、telemetry 的面包屑 Telemetry、cost-tracking 的 Docs 按钮默认值），18 条判技术 token 或品牌名进 `ALLOWED_ENGLISH`，`model-insights` 的 `session` 判保留（`session_id` API 字段词）。基线从 162 撤到 138，38 页 0 渲染错误、0 条新发现

（沿革）第 530 簇复跑把扫描面从 15 页扩到 38 页主路由（`PAGES` 列表见 `rendered-ui-fixtures.mjs`），并给 stub 代理补了 20 多个端点的最小形状（`/v1/mcp/server`、`/alerting/settings`、`/cache/settings`、`/coordination_redis/settings`、`/v1/traces` 这类），其中 6 个页面此前在空 stub 下直接崩进 Next 错误页，错误页的 "Back/Reload" 假英文会污染结果；现在 38 页全部渲染出真实内容。诊断手段也进了一步：`pageerror` 会带上调用栈前两帧、未命中 stub 的请求路径会以 `[stub-miss]` 打到 stderr，这两条是本次定位 6 处崩溃的手段，保留为常设行为

基线因此从 2 条涨到 162 条。这不是门禁变松，而是新页面的真账第一次被看见：lens（追踪观察页）86 条、api-reference 31 条（多为代码语料）、transform-request 20 条（curl 示例）、model-insights 5 条、其余零头见基线文件（lens 侧已于第 533 簇批量接入完成，撤到 8 条）

（沿革记录）第 525 簇复跑时是 15 个页面，各 0 个渲染错误，只有 `model-health` 剩基线里的 2 处端点路径段，与第 515 簇首跑那轮的结论逐页一致，中间两簇的文件级拆分没有改变渲染结果

页面清单新增 `search-tools`、`roi-calculator` 与 `model-health`。`model-health` 靠 URL 参数 `?tab=health` 直达页内 tab（`useUrlTab` 的键就是 `tab`），不需要脚本支持点击。首轮撞出 `proxyConfigData.find is not a function`，成因仍是桩代理对未登记路径回 `{}`，补 `/models/list`（两行模型，一行带健康记录、一行不带，用来同时覆盖日期列与"无"哨兵列）、`/health/latest`、`/config/list`（数组）三个桩后归零。同轮扫出两处真缺陷：`DecisionModelsBanner` 的 `orTry` 词条本身已是完整句（en ", or try them in the Decisions playground."），JSX 却又硬拼一个 `playground.{" "}` 文本节点，两种语言都会重复渲染句尾，且 JSX 那个多余的 `, ` 与词条前导逗号叠成双逗号；顺带把 zh 的 `orTry` 从"决策 playground"改成侧栏既有术语"决策演练场"。正文里剩下的 `GitHub` 与 `GitHub Enterprise` 是产品名，进 `ALLOWED_ENGLISH`。ROI 页第一次扫时撞出 `Cannot read properties of undefined (reading 'length')`，原因是桩代理对未登记的 `/roi-calculator/*` 一律回 `{}`，补进四个桩（settings、report、sync、repositories，字段按 `schema.d.ts` 的 `ROISettingsResponse`/`ROISyncStatus`/`ROIReportResponse`/`ROIRepositoriesResponse` 对齐）后归零。正文里剩下的 `GitHub` 与 `GitHub Enterprise` 是产品名，进 `ALLOWED_ENGLISH`

## 它查什么

用真实浏览器打开每个页面，收集两样东西：

1. **渲染过程中的错误**。`console.error` 与未捕获的异常。目录里的消息写对了、调用点看着也对，但两边对不上时，next-intl 会在渲染那一刻抛 `FORMATTING_ERROR`；静态看两边都是合法的。
2. **渲染后的正文里剩下的英文**。界面语言是中文，正文里却还有英文词组，就是漏翻。按词组报，不按单词报。
3. **属性里的文案**。`alt`、`aria-label`、`placeholder`、`title` 这四类值用户读得到但不进 `innerText()`，第 561 簇那批输入占位符就是这么漏在扫描面外的。

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

第 561 簇在一台 Ubuntu 开发机上从零跑通，四条环境前提记在这里，免得下回重新排查

1. `rendered-ui-scan.mjs` 走 `channel: "chrome"`，Chrome 要在 `google-chrome-stable` 或 `/opt/google/chrome/chrome`。装不到稳定版时把 playwright 的 Chrome for Testing 解到后一个路径即可
2. Turbopack 的文件监听会撞 `fs.inotify.max_user_watches` 的默认 61281 直接 panic。抬到 524288（`sudo sysctl -w fs.inotify.max_user_watches=524288`），不写进 `/etc/sysctl.d/` 就重启回落
3. 别用 `npm run dev:webpack` 跑扫描：`public/assets/logos/claude.svg` 文件头是一段 HTML 注释，webpack 的图片规则判它"不是合法图片"，`usage` 与 `models-and-endpoints` 两页直接 500，Turbopack 和 `next build` 都不受影响，这不是汉化缺陷
4. 内存吃紧的机器上 Next dev 会在接近阈值时自动重启，扫描中途表现为 `ERR_CONNECTION_REFUSED`。41 页一轮约 3 分钟，Turbopack 本轮没重启，webpack 那轮在第 15 页被撞断

## 怎么判

发现跟基线比，规则和死键门禁一样：基线里有的算已知，新增的让运行失败。基线在 `scripts/rendered-ui-baseline.json`，确认过要保留的发现之后用

```
npm run scan:rendered -- --update-baseline
```

刷新。

第 574 簇起这道门禁进 CI：`.github/workflows/test-litellm-ui-lint.yml`（名字就叫 UI i18n Gates）新增 `rendered-scan` job，`npm ci` 后装 Chromium，`npm run dev` 起服务，等 `http://localhost:3000/` 就绪再跑 `npm run scan:rendered -- --channel chromium --settle-ms 8000`，与死键、静态英文、中文取值三道静态口径并列。第 575 簇修掉首轮红灯：面板是 `output: "export"` 静态导出，`npm run start` 的 `next start` 不支持这种产物，进程直接退出，3000 端口从未监听；原先的等待循环 60 次全失败也不报错，白等两分钟后扫描撞 `ERR_CONNECTION_REFUSED`。现在改回本地口径的 `npm run dev`，循环放宽到 90 次并在末尾加一条硬校验，起不来就打印 dev 日志并立即失败。扫描脚本的浏览器渠道可由 `--channel` 指定（默认 `chrome` 走本机 Chrome，CI 传 `chromium` 用 Playwright 自带内核），页面导航超时由 `--nav-timeout-ms` 指定，默认 60 秒，本地 dev 模式首次编译冷页不再撞 30 秒默认值

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

2026-10-24 第 523 与 524 两簇只搬代码、清 lint，没动任何文案与目录，按本篇判据不需要复跑。下一次复跑应在渲染面有改动的簇里顺带做
