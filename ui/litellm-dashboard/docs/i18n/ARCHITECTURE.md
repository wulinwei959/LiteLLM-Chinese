# 项目细节：i18n 架构

这一篇讲清单哪些文件构成这一层、语言怎么定下来、消息怎么送到组件里，以及哪些测试在防回归

## 技术选型

用 `next-intl` 4.x 提供运行时与类型。没有走它常见的"路由前缀"方案（`/zh-CN/keys`），原因是这个仪表盘是 `output: "export"` 的静态导出（见 `next.config.mjs`），整套 UI 由 LiteLLM 代理进程以静态文件形式挂在 `/ui` 下，多语言靠路由前缀会把静态产物的路径结构改掉，牵动代理侧的路由与资源前缀 `assetPrefix: "/litellm-asset-prefix"`

所以语言状态放在客户端，用一个 React Context 加 `localStorage` 传播，`NextIntlClientProvider` 手工喂 `locale` 与 `messages`。两套语言的消息目录在构建时就整包打进产物，代价是产物体积，换来的是切换语言不需要重新请求任何资源

## 文件职责

| 文件                                         | 职责                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/i18n/locales.ts`                    | 纯函数层：支持的语言常量、类型守卫、语言标签归一、初始语言决策                         |
| `src/contexts/LocaleContext.tsx`             | 运行时层：读 `localStorage`、订阅变更、挂 `NextIntlClientProvider`、暴露 `useUiLocale` |
| `src/components/shared/LanguageSwitcher.tsx` | 唯一的选择器 UI，挂在 `UserDropdown` 与 `SidebarAccountMenu` 两处                      |
| `src/lib/i18n/format.ts`                     | 格式化层：按当前 UI locale 格式化日期、时间、数字与货币                                |
| `src/messages/en.json`                       | 英语目录，同时是类型的真身（见"类型增强"）                                             |
| `src/messages/zh-CN.json`                    | 中文目录，键树必须与 `en.json` 逐条一致                                                |
| `src/lib/i18n/next-intl.d.ts`                | 三行模块增强，把 `Messages` 收敛成 `en.json` 的形状                                    |
| `src/lib/i18n/translators.ts`                | 每个命名空间一个具体翻译器类型，供 props 与函数参数使用                                |
| `src/lib/i18n/messagesParity.test.ts`        | 守卫：两侧键树一致、占位符一致、ICU 语法合法                                           |
| `src/lib/i18n/missingKeys.test.ts`           | 守卫：代码里 `t("x")` 引用的键在 `en.json` 里真的存在                                  |
| `src/lib/i18n/locales.test.ts`               | 守卫：语言解析与回退规则                                                               |
| `src/lib/i18n/format.test.tsx`               | 守卫：格式化按当前 locale 走，无效日期不抛                                             |
| `scripts/dead-keys.py`                       | 判定器：找出 `en.json` 里代码从未引用的键                                              |
| `scripts/dead-key-lib.mjs`                   | 判定器的可单测部分：输出解析、新增死键与已解决死键两个方向                             |
| `scripts/check-dead-keys.mjs`                | 门禁：死键集合对基线做棘轮，新增即失败                                                 |
| `dead-keys-baseline.json`                    | 死键基线，当前为空集                                                                   |
| `tests/dead-key-lib.test.ts`                 | 判定器判定逻辑的单测                                                                   |
| `tests/test-utils.tsx`                       | 测试侧的 `renderWithProviders`，已包好 `LocaleProvider`                                |
| `tests/i18nStub.ts`                          | 测试侧的 `enMessages`，给拿不到 React 上下文的纯函数查 `en.json`                       |
| `tests/mocks/authorizedSession.ts`           | 测试侧的 auth session 工厂，给打桩 `useAuthorized` 的用例用                            |

## 语言怎么定下来

`resolveInitialLocale` 是一条明确的三级回退链，优先级从高到低是 `localStorage` 里存过的合法值、浏览器语言里以 `zh` 开头的标签、英语

浏览器语言的归一在 `localeFromBrowserLanguage`，它把 `zh`、`zh-CN`、`zh-TW`、`ZH-HANS-CN` 全部映射到 `zh-CN`。繁体标签也落到简体是刻意的：目前没有 `zh-TW` 目录，与其让繁体用户看到英文，不如给简体。如果将来要加繁体，改这一个函数即可，`locales.test.ts` 已经把这个行为固化下来

`LocaleContext` 用 `useSyncExternalStore` 而不是 `useState`，因为语言要对两件事同时响应：同标签页内的切换（自定义事件）、跨标签页的切换（原生 `storage` 事件）。`getServerSnapshot` 固定返回英语，这样静态导出的 HTML 在客户端 hydration 前就是英语，避免 hydration mismatch

`LocaleProvider` 带一个可选的 `locale` 属性，传了就强制使用、并且不再订阅存储。这条路径是给测试用的，让用例能把语言钉死

## 日期与数字的格式化

界面上的日期、时间、金额原本是硬编码 `"en-US"` 格式化的，中文界面里照样出英文月份缩写（`Aug 7, 2026`）、12 小时制（`08:00 PM`）、`US$1,234.56`。这类不是文案而是格式化，改的是渲染结果而不是目录

`next-intl` 自带 `useFormatter()` 能做这件事，但它是 Hook。格式化需求里有相当一部分落在拿不到 React 上下文的纯模块上（`licenseUtils.formatExpiryDate`、`costOptimizationUtils.shortDate`、`roiCalculatorData.formatMoney` 这类），Hook 在那里用不了

所以另起一层 `src/lib/i18n/format.ts`，导出 `formatDate` / `formatTime` / `formatNumber` / `formatCurrency`。locale 的取法沿用 `toast.ts` 第 380 簇建立的桥接：读 `document.documentElement.lang`（`LocaleContext` 的 effect 维护它），无 `document` 时回落 `DEFAULT_UI_LOCALE`

读 DOM 属性而不是走 React 上下文，是为了让纯模块能用。代价是它不响应 locale 切换本身，调用方需要在切换后重新渲染。这是可接受的：格式化点绝大多数在组件渲染体里，组件重渲染时自然重算

两个细节值得记住。一是货币要用 `currencyDisplay: "narrowSymbol"`，否则中文下渲染成 `US$1,234.56`，与应用里手写 `$${...}` 的既有风格不一致。二是 `Intl.DateTimeFormat.format` 对无效日期抛 `RangeError`，而 `toLocaleDateString` 返回 `"Invalid Date"` 字符串不抛；`formatDate` 显式判了 `NaN` 并返回同样的字符串，否则 mock 数据里的 `expires: "null"` 这类字符串会让整棵组件树崩掉

紧凑记法（`notation: "compact"`）在中文下于万位才缩写（`6万`），万以下不缩写（`6000`），这是中文数量词习惯，不是缺陷

`src/components/shared/table_cells/date_cell.tsx` 原本不用 Intl，而是手写一个 `MONTHS` 数组拼出 `Jul 7, 2026`，所以它不在「硬编码 `"en-US"`」的扫描口径里，中文界面里仍出英文月名。这类手写月份数组是同一类问题的另一种形态，改法与硬编码 locale 相同

## 消息目录的形状

顶层 38 个命名空间，按功能域切分，不是按文件切分。`mcpServers` 最大，因为 MCP 服务器是功能最多的路由

| 命名空间            | 归属                                       |
| ------------------- | ------------------------------------------ |
| `common`            | 跨页面通用的按钮、状态、回退文案            |
| `nav`、`breadcrumb` | 导航结构                                    |
| `viewSwitcher`      | 旧版与新版的视图切换                        |
| `login`、`onboarding`、`ssoEnabledNotice`、`changePassword` | 认证与首次进入 |
| `virtualKeys`、`teams`、`users`、`organizations`、`budgets`、`projects`、`access-groups` | 身份与权限管理 |
| `models`            | 模型与端点，含 `autoRouters` 子命名空间      |
| `mcpServers`        | MCP 服务器全线，最大的一个                  |
| `guardrails`、`guardrailsMonitor`、`policies` | 安全与合规                    |
| `usage`、`costTracking`、`costOptimization` | 用量与成本                      |
| `prompts`、`skills`、`memory`、`workflows`、`agents` | 智能体相关功能      |
| `vectorStores`、`searchTools`、`caching`、`tagManagement` | 数据与检索      |
| `playground`、`apiReference` 等 | 工具与参考页                     |
| `logs`、`adminPanel`、`uiTheme`、`routerSettings`、`transformRequest` | 运维与系统设置 |

命名空间可以嵌套，`models.autoRouters` 与 `usage.aiChat` 就是例子。嵌套会让键树更长，但能让一个页面的键自成一块，读起来比平铺清楚

## 类型增强

`src/lib/i18n/next-intl.d.ts` 只有三行，作用是把 `en.json` 的结构声明成全局的 `Messages` 类型。加上之后 `t("common.save")` 这样的调用会被逐字检查，键名拼错或跨命名空间乱用直接编译失败

这个增强有一段历史值得记住。它刚加上时报出 75 条历史欠账，全是真 bug，包括 `VirtualKeysTable` 用 `virtualKeys` 的翻译器去取 `common` 才有的键、`keyTableColumns` 里 19 个从没进过目录的键。强化类型检查在这里的收益是实打实的

## 翻译器的具体类型

`translators.ts` 给每个命名空间导出一个具体类型，比如 `McpServersTranslator`，做法是包一个只为了捕获返回类型的空函数

这份文件存在的唯一理由是绕开一个 `next-intl` 的类型缺陷。不带命名空间参数的 `ReturnType<typeof useTranslations>` 在 props 与函数参数位置两个方向都不可靠：加上 `Messages` 增强后，key 联合退化成全目录五千多条的巨型联合，编译器算不过来就放弃，判定结果取决于联合的内部排布。实测同一个类型下，`t("common.save")` 这个合法全路径报错，`t("loading")` 这个哪都不存在的键反而通过

所以 props 与工厂函数的参数一律用具体类型，不要用裸的 `ReturnType<typeof useTranslations>`。调用点本身继续写 `useTranslations("<ns>")`，两者结构完全一致，赋值双向通过

## 守卫测试

三条守卫各管一个方向，缺一条就有盲区

`messagesParity.test.ts` 管"两侧目录是否对齐"。它比对键树是否逐条一致、顶层 ICU 参数名集合是否一致、以及消息语法是否合法。语法那部分拦的是三类运行时才炸的错误：未加引号的尖括号（ICU 当富文本标签，抛 `UNCLOSED_TAG`）、开了没闭合的标签、以及未加引号的花括号（ICU 当参数，抛 `MALFORMED_ARGUMENT`）。这三类在英文界面上一片空白，只在打开特定表单时才暴露

`missingKeys.test.ts` 管反方向："代码引用的键是否存在"。它遍历 `src` 下所有调过 `useTranslations` 的文件，按作用域解析每个 `t("x")`。这个方向 `parity` 管不到，因为一个键在两侧都不存在时，键树依然是"一致的"

`locales.test.ts` 管语言解析，把三级回退链和中文标签归一都钉住

## 死键守卫

前三条守卫管「引用了但不存在」，没人管反方向：「目录里有、但代码里没人用」。这类键不会让界面出错，只是让目录越来越臃肿，真正的漏接藏在噪声里。第 409 簇清掉 226 个这样的键，之后第 410 簇把判定器接进 CI

判定器 `scripts/dead-keys.py` 要处理三种调用形态。同文件里的 `useTranslations("ns")` 直接可读；经 props 传入的译员从 `src/lib/i18n/translators.ts` 的包装函数反推命名空间，或从本地 `type XTranslator = ReturnType<typeof useTranslations<"ns">>` 读取；`toastMessage` 桥固定读 `toast` 命名空间

误报是这个判定器的主要风险，处理办法是兜底。凡是在源码里以完整相对路径原样出现过的键一律保命，不管判定器能否把它归属到某个命名空间。表常量 `labelKey: "authType.tokenExchange"` 这种就无法静态归属，硬判会错

字符串字面量必须逐引号扫描，不能用「一对引号」的正则。`LensSetup.tsx` 的 `t("investigation")` 曾因此被漏判成死键，差点误删，tsc 立刻报出 17 条新错

门禁 `scripts/check-dead-keys.mjs` 沿用仓库既有的「预算 + 棘轮」范式（对照 `check-lint-budgets.mjs` 与 `eslint-budgets.json`）：`dead-keys-baseline.json` 记录已确认的死键集合，新增死键即失败并列出键名，基线里已解决的条目提示刷新基线（`npm run check:dead-keys:write`）。CI 侧接在 `test-litellm-ui-lint.yml` 的 knip 死代码检查之后

判定逻辑抽在 `scripts/dead-key-lib.mjs` 里，输出解析、新增死键、已解决死键三个方向各有单测在 `tests/dead-key-lib.test.ts`

## 测试侧的两个入口

`renderWithProviders` 把 `NuqsTestingAdapter`、`QueryClientProvider`、`LocaleProvider` 三层包好，默认把 `locale` 钉在 `zh-CN`。钉住是有意的：翻译工作的断言对象是中文文案，让每个用例都自己拼语言环境只会重复

但钉住会把 `localStorage` 那条链路短路掉，而 `LanguageSwitcher` 要测的恰恰是它。所以 helper 的 `locale` 选项接受 `null` 表示不钉，此时 `LocaleProvider` 回落到读存储与浏览器语言。用 `null` 而不是省略，是因为省略的语义是"用默认值"，两者必须能区分

switcher 的用例走这条出口，并在 `beforeEach` 里清 `localStorage`、显式 stub `navigator.language`。这样做不是啰嗦：`localStorage` 在同一文件内跨用例存活，而浏览器语言的默认值由 jsdom 决定，属于我们不拥有的外部事实，钉住它会让用例随环境漂移

`LocaleProvider` 里 `useSyncExternalStore` 必须无条件调用，取值时才在 `forcedLocale` 与存储值之间选。写成 `forcedLocale ?? useSyncExternalStore(...)` 会让 hook 的调用次数随 `forcedLocale` 的有无变化，`react-hooks/rules-of-hooks` 直接报 error，一旦有调用方让它变过就会崩

`enMessages` 给列定义工厂这类拿不到 React 上下文的纯函数用。它按 `mcpServers` 命名空间去 `en.json` 查值，查不到就抛错。这样测试断言的仍是真实英文文案（`+1 more`）而不是键名（`toolsets.moreCount`），键名写错会立刻失败

`NAMESPACE` 常量要和调用点生产的 `useTranslations("mcpServers")` 保持一致，所以工厂里的键写相对路径 `toolsets.edit`，写成全名会被拼成两层而解析失败

`authorizedSession` 是同一个思路的另一处应用。打桩 `useAuthorized` 的用例过去把整份 session 形状手抄一遍，每份 8 到 12 个字段，抄漏字段时 `mockReturnValue` 会留下 TS2345。现在形状由 `tests/mocks/authorizedSession.ts` 给出，取的是 hook 的完整返回类型，测试只写自己关心的那几个字段。override 类型放宽成 `{ [K in keyof AuthorizedSession]?: AuthorizedSession[K] | null }`，因为 mock 常常要表达"没有 token / 没有用户 / 没有角色"，而 hook 自己的类型把 `userRole` 写成普通 string，不放宽就赋不了 null

格式化相关的测试有一处环境坑。`unit` 项目跑在 node 环境，没有 `document`，`format.ts` 里的 locale 读取恒定回落英语，于是断言英文日期的用例会通过，中文分支却从未被测到。测 locale 相关行为要用 `.test.tsx`（走 jsdom）并在用例里显式设 `document.documentElement.lang`，`src/utils/licenseUtils.test.ts` 搬成 `.test.tsx` 就是这个原因
