# LiteLLM-Chinese

LiteLLM AI Gateway 管理面板（Admin UI）的简体中文支持项目，围绕上游 [BerriAI/litellm](https://github.com/BerriAI/litellm) 的 `ui/litellm-dashboard` 展开。代理侧的 Python 代码不在翻译范围，只跟随上游 release

**当前节点（2026-10-24）**：汉化工程已收口，收口清单上的九项全部做完，`main` 与 LAN 远端同步，本地跑得到的门禁全部为绿。上游基线是官方 release `v1.107.0`（commit `66c8f5b1a9`），2026-10-23 合并完成，其上的汉化重接与收口推进到第 524 簇

## 背景

上游的管理面板原本没有任何国际化基础设施：界面文案硬编码英文，`<html lang="en">` 写死，日期与数字固定按 `en-US` 格式化，也没有语言切换入口。本项目在保留英文为默认语言的前提下，给面板补上完整的 zh-CN 本地化，并把"翻译是否接上、是否漏翻、是否臃肿"三件事都变成机器可检查的门禁

## 范围

| 项 | 说明 |
|---|---|
| 翻什么 | 用户能看见的一切：界面文案、toast 标题与正文、表单校验消息、可访问名称（label、aria、alt）、日期时间与数字货币的格式 |
| 不翻什么 | 机读面与语料。导出 CSV 的列头与文件名、MCP 协议能力名（`prompts`、`resources`）与方法名、后端枚举取值、代码与 curl 示例、URL 与模型名这类格式示例、品牌与产品名 |
| 默认语言 | 仍是英文（`DEFAULT_UI_LOCALE = "en"`），中文由浏览器语言或用户选择决定，存量英文用户与上游测试的默认断言不受影响 |

## 技术选型

采用 next-intl 的 "without i18n routing" 模式，三个理由

1. 面板是 Next.js 静态导出（`output: "export"`），由 Python proxy 托管在 `/ui/` 路径下，Next.js 官方的 i18n 路由与静态导出对不上，URL 带 locale 前缀的方案被排除
2. next-intl 支持纯客户端的 locale 切换，且活跃适配当前锁定的版本（`next@16.3.8`、`next-intl@4.14.6`、`react@19.2.8`）
3. 自带 ICU 消息格式，并能把 `en.json` 的形状接进类型系统，key 打错在编译期就报错

日期与数字没有用 next-intl 的 `useFormatter()`，因为它是 Hook，而格式化需求里相当一部分落在拿不到 React 上下文的纯模块上（`licenseUtils.formatExpiryDate`、列定义里的单元格渲染器这类）。所以另起一层 `src/lib/i18n/format.ts`。代价是它不响应切换本身，调用方要在切换后重新渲染，这是有意的取舍。两个细节：货币必须带 `currencyDisplay: "narrowSymbol"`，否则中文下渲染成 `US$1,234.56`；中文紧凑记法在万位才缩写（`6万`，而 6000 不缩），属数量词习惯不是缺陷

## 语言怎么定下来

`resolveInitialLocale` 是三级回退链，优先级从高到低为 `localStorage` 里存过的合法值（键 `litellm-ui-locale`）、浏览器语言中以 `zh` 开头的标签、英语。`localeFromBrowserLanguage` 把 `zh`、`zh-CN`、`zh-TW`、`ZH-HANS-CN` 一律归到 `zh-CN`，繁体落到简体是刻意的，因为目前没有 `zh-Hant` 目录

静态外壳上的 `lang="en"` 只是首屏，运行期由 `LocaleContext` 把 `document.documentElement.lang` 改成当前 locale，纯模块（`format.ts`、`toast.ts` 的标题查表）都从这个属性读。`LocaleContext` 用 `useSyncExternalStore` 而不是 `useState`，语言要同时响应两件事：同标签页内的切换（自定义事件）与跨标签页的切换（原生 storage 事件），两条链路都靠 `src/utils/localStorageUtils.ts` 统一。`LocaleProvider` 带一个可选的 `locale` 属性，传了就用它并停止订阅存储，这条出口是给测试钉语言用的，测试 harness 默认钉在 `zh-CN`

## 关键文件

| 路径 | 职责 |
|---|---|
| `src/messages/en.json` / `zh-CN.json` | 两侧消息目录，按功能域分 namespace，键树必须逐条一致；`en.json` 同时是类型真身 |
| `src/messages/GLOSSARY.md` | 中英术语定译表，新增中文文案的依据 |
| `src/lib/i18n/locales.ts` | 纯函数层：支持的语言、标签归一、初始语言决策、存储键 |
| `src/lib/i18n/translators.ts` | 每个命名空间一把具体 translator 类型，供 props 与函数参数使用 |
| `src/lib/i18n/next-intl.d.ts` | 模块增强，把 `Messages` 收敛成 `en.json` 的形状 |
| `src/lib/i18n/format.ts` | 按当前 UI locale 格式化日期、时间、数字与货币 |
| `src/contexts/LocaleContext.tsx` | 运行时层：读存储、订阅变更、盖 `documentElement.lang`、挂 `NextIntlClientProvider` |
| `src/components/shared/LanguageSwitcher.tsx` | 唯一的选择器 UI，挂在 `UserDropdown` 与 `SidebarAccountMenu` 两处 |
| `tests/test-utils.tsx` | `renderWithProviders`，已包好 URL 适配、QueryClient 与 `LocaleProvider` |
| `scripts/scan-english.mjs` | AST 静态扫描器，按 jsx 文本、四个属性、toast、throw 与宽口径的模板串找英文字面量 |
| `scripts/dead-keys.py` + `scripts/check-dead-keys.mjs` | 死键判定器与门禁，按 `dead-keys-baseline.json` 棘轮 |
| `scripts/check-lint-budgets.mjs` + `eslint-budgets.json` | lint 预算棘轮，规则计数不得越过上限 |
| `scripts/rendered-ui-scan.mjs` 三件套 | 渲染扫描：脚本、桩数据夹具 `scripts/rendered-ui-fixtures.mjs`、英文基线 `scripts/rendered-ui-baseline.json` |
| `docs/i18n/` | 八篇方法与进度文档，索引见文末 |

## 防回归的守卫

`src/lib/i18n` 下五道，各管一个方向，缺一道就有盲区，另加 `src/lib/toast.test.ts` 里那一道动态取键的覆盖检查

| 守卫 | 抓什么 |
|---|---|
| `messagesParity.test.ts` | 两侧键树是否逐条一致、顶层 ICU 参数名集合是否一致、消息语法是否合法。富文本标签由文件里的 `RICH_TAGS` 白名单限定（`strong`、`link`、`code` 等） |
| `missingKeys.test.ts` | 反方向：代码里 `t("x")` 引用的键在 `en.json` 是否真的存在，按命名空间作用域解析 |
| `messageArgs.test.ts` | 调用点交出的参数名与标签渲染器是否等于消息要求的。名字对不上要到运行期才抛 FORMATTING_ERROR，静态类型抓不到 |
| `locales.test.ts` | 语言解析、三级回退链与中文标签归一 |
| `format.test.tsx` | 格式化按当前 locale 走，无效日期不抛 |
| `toast.test.ts` | `toastMessage(category)` 的键是运行期拼的，静态守卫看不见，这里断言由两张查找表派生出的 `TOAST_TITLE_CATEGORIES` 在中英两侧的 `toast` 命名空间都存在 |

目录健康度还有两道：`npm run check:dead-keys` 抓"目录里有但代码没人用"的键（基线是空集，新增即红），`npm run knip:ci` 抓没有任何引用的死文件。代码形态由仓库自有的 lint 规则把关，`local/filename-pascal-case` 管 `.tsx` 文件名，`local/no-large-inline-object-arg` 与 `local/no-long-condition-chain` 进预算棘轮，`local/no-ad-hoc-z-index` 管层叠上下文

## 进度（2026-10-24 实测）

| 项目 | 状态 |
|---|---|
| 批次 | 批次 0 到 14 是核心管理页，15 到 24 是长尾收尾。`PLAN.md` 的状态列写于各批次推进时点，已被第 513 到 524 簇的收口轮覆盖，当前进度一律以 `PROGRESS.md` 的逐簇账为准 |
| 组件接入 | 非测试 `.tsx` 954 个中 737 个接入翻译器，77.3%。未接入的 217 个多数本身没有文案（图表容器、类型外壳、纯布局） |
| 目录规模 | 中英各 11877 个叶子，键树无差集；中英同值 139 个（URL、模型名、协议单位等格式示例，不是漏翻）；死键 0 |
| 测试 | 全量三 project 合跑 970 个文件、13056 例，9 例是仓库既有的预期失败，真红 0；`Type Errors` 报 no errors |
| 类型与构建 | `npm run typecheck` 0 错，`npm run build` 退出 0 |
| Lint | `eslint .` 0 error（第 524 簇清理前是 77 条未抑制的 error，分布在 60 个文件）；预算九条全过，`no-large-inline-object-arg` 476/477、`no-long-condition-chain` 200/200、`no-console` 16/16、`testing-library/prefer-screen-queries` 18/18，后三条已顶格 |
| 死代码与死键 | `npm run knip:ci` 通过，`npm run check:dead-keys` 通过（死键 0，基线 0） |
| i18n 守卫 | `src/lib/i18n` 五道加 `src/lib/toast.test.ts` 的动态标题覆盖，6 个文件 59 例通过，`Type Errors` 报 no errors |
| 实机 | `npm run scan:rendered` 在 15 个页面 0 渲染错误、除基线两枚端点路径外 0 处英文（2026-10-24 在第 524 簇之后复跑过，与第 515 簇首跑逐页一致） |
| CI | UI 侧四个工作流：`test-litellm-ui-lint`（改动文件 prettier + eslint、lint 预算、knip、死键）、`test-litellm-ui-unit`、`test-litellm-ui-build`、`check-ui-api-types` |

## 怎么验证

都在 `ui/litellm-dashboard` 下执行，按顺序跑，前面的失败不用往下走

```
npm run typecheck
TMPDIR=/tmp/vitest_tmp npx vitest run <显式文件路径> --reporter=dot
npx eslint .
npx eslint . -f json -o /tmp/lint.json && node scripts/check-lint-budgets.mjs /tmp/lint.json eslint-budgets.json
npm run check:dead-keys
npm run knip:ci
npm run build
```

几条口径要记住。不要裸跑全量 `npx vitest run`，那是 970 个文件、会把机器占满十几分钟，CI 本来就会跑；只跑本次改动触及的文件加上可能解释其失败的文件，改组件时把 import 它的测试一并跑（认证类型那批红灯就是这么漏的）。`--reporter=dot` 是唯一可用的点状报告，本项目没有 `basic`。多 project 合跑要把 `TMPDIR` 固定到 `/tmp/vitest_tmp`，否则临时目录被回收会报成文件级失败而实际 0 例失败。死键门禁取文件走 `git ls-files`，新建模块要先 `git add` 再跑。要看某文件的 `max-lines` 真实行数（该规则跳过空行与注释），把上限临时压到 1 逼它打印：`npx eslint <文件> --rule '{"max-lines": ["error", {"max": 1, "skipBlankLines": true, "skipComments": true}]}'`

分 project 的入口是 `npm run test:unit`（node 环境）、`test:component`、`test:integration`（jsdom）、`test:types`。渲染扫描要先起 `npm run dev`（端口 3000），再跑 `npm run scan:rendered`，只有加 `--update-baseline` 才写基线。改了后端路由或响应模型，跑 `npm run gen:api` 重新生成 `src/lib/http/schema.d.ts`，那个文件不要手改

## 上游同步

上游镜像 `http://192.168.3.224:3001/wulinwei959/litellm.git` 已加为 `upstream` remote。基线只跟官方 release，不跟 `upstream/main`（`v1.107.0` 与当时的 main 之间还差 78 个代理侧文件，仪表盘只差 1 行生成物，取 release 更贴近实际发布物）。合并不是 `git merge`，而是逐文件三方合并把 release 树取进来：代理侧 `litellm/proxy` 与 `litellm/types` 与 release 逐字节一致，仪表盘侧保留我们的汉化层，合并后再按上游新结构重接汉化层与测试断言

下一次同步按决定暂缓。同步当天要额外做三件事：按合并后的实数重测 `eslint-budgets.json` 的棘轮、跑 `eslint . --prune-suppressions` 让抑制基线跟着新树走、复跑死键门禁与渲染扫描。阶段划分与风险见 [`ui/litellm-dashboard/docs/i18n/UPSTREAM-SYNC.md`](ui/litellm-dashboard/docs/i18n/UPSTREAM-SYNC.md)

## 剩余工作

- **换新维度而不是重扫旧正则**。四条静态口径与宽口径 string 的"变量转传"复读都已清空，剩下的命中全部有判定归属。下一轮应从新组件、新页面、新交互形态入手，配合渲染扫描在运行期发现
- **18 个文件仍走 `max-lines` 抑制基线**。这 18 个是上游既有的巨型文件，逐个拆分属独立一簇。本轮真正推过线的四个已经在第 524 簇拆完退线（`ModelInfoEditForm.tsx` 拆出 `modelInfoEditFields.ts`、`key_edit_view.tsx` 拆出 `KeyEditViewControls.tsx` 的字段块、`leftnav.tsx` 拆出 `LeftnavMenuGroups.tsx`、`guardrail_info.tsx` 拆出两张护栏小卡）
- **lint 预算几乎没有余量**。三条规则顶格、`complexity` 只剩 1 条。新增这类写法会直接把门禁改红，收口办法是把内联对象提成具名变量、把条件链改成早返回的辅助函数，不要调上限
- **一处可选的小重构**。`bulkUsersCsvTemplate.ts` 的模板表头与 `bulk_create_users_button.tsx` 解析器读取的列名是两份并列事实，可以收成一个共享来源，让改列名时测试自然变红

## 相关文档

| 文档 | 内容 |
|---|---|
| [`ui/litellm-dashboard/docs/i18n/README.md`](ui/litellm-dashboard/docs/i18n/README.md) | 这套文档的索引与当前状态 |
| [`ui/litellm-dashboard/docs/i18n/ARCHITECTURE.md`](ui/litellm-dashboard/docs/i18n/ARCHITECTURE.md) | i18n 层的文件职责、语言解析、消息目录形状、类型增强、守卫 |
| [`ui/litellm-dashboard/docs/i18n/PLAN.md`](ui/litellm-dashboard/docs/i18n/PLAN.md) | 目标、原则、批次划分与优先级 |
| [`ui/litellm-dashboard/docs/i18n/PROGRESS.md`](ui/litellm-dashboard/docs/i18n/PROGRESS.md) | 逐簇的账、覆盖率与判定账、下一步优先级，进度以此为准 |
| [`ui/litellm-dashboard/docs/i18n/WORKFLOW.md`](ui/litellm-dashboard/docs/i18n/WORKFLOW.md) | 单批执行的七步流程、验证清单、编码约定与文件拆分口径 |
| [`ui/litellm-dashboard/docs/i18n/FIXES.md`](ui/litellm-dashboard/docs/i18n/FIXES.md) | 缺陷八类的分类表、定位手段与踩坑记录 |
| [`ui/litellm-dashboard/docs/i18n/RENDERED-SCAN.md`](ui/litellm-dashboard/docs/i18n/RENDERED-SCAN.md) | 渲染扫描的用法与判据 |
| [`ui/litellm-dashboard/AGENTS.md`](ui/litellm-dashboard/AGENTS.md) | 该子项目的测试分层、断言约定与门禁说明 |
| [`ui/litellm-dashboard/TRANSLATION_PLAN.md`](ui/litellm-dashboard/TRANSLATION_PLAN.md) | 历史计划与一手踩坑日志，进度部分已过期 |
