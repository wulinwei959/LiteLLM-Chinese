# 项目细节：i18n 架构

这一篇讲清单哪些文件构成这一层、语言怎么定下来、消息怎么送到组件里，以及哪些测试在防回归

## 技术选型

用 `next-intl` 4.x 提供运行时与类型。没有走它常见的"路由前缀"方案（`/zh-CN/keys`），原因是这个仪表盘是 `output: "export"` 的静态导出（见 `next.config.mjs`），整套 UI 由 LiteLLM 代理进程以静态文件形式挂在 `/ui` 下，多语言靠路由前缀会把静态产物的路径结构改掉，牵动代理侧的路由与资源前缀 `assetPrefix: "/litellm-asset-prefix"`

所以语言状态放在客户端，用一个 React Context 加 `localStorage` 传播，`NextIntlClientProvider` 手工喂 `locale` 与 `messages`。两套语言的消息目录在构建时就整包打进产物，代价是产物体积，换来的是切换语言不需要重新请求任何资源

## 文件职责

| 文件                                          | 职责                                                                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/i18n/locales.ts`                     | 纯函数层：支持的语言常量、类型守卫、语言标签归一、初始语言决策                          |
| `src/contexts/LocaleContext.tsx`              | 运行时层：读 `localStorage`、订阅变更、挂 `NextIntlClientProvider`、暴露 `useUiLocale`  |
| `src/components/shared/LanguageSwitcher.tsx`  | 唯一的选择器 UI，挂在 `UserDropdown` 与 `SidebarAccountMenu` 两处                       |
| `src/messages/en.json`                        | 英语目录，同时是类型的真身（见"类型增强"）                                              |
| `src/messages/zh-CN.json`                     | 中文目录，键树必须与 `en.json` 逐条一致                                                 |
| `src/lib/i18n/next-intl.d.ts`                 | 三行模块增强，把 `Messages` 收敛成 `en.json` 的形状                                     |
| `src/lib/i18n/translators.ts`                 | 每个命名空间一个具体翻译器类型，供 props 与函数参数使用                                  |
| `src/lib/i18n/messagesParity.test.ts`         | 守卫：两侧键树一致、占位符一致、ICU 语法合法                                             |
| `src/lib/i18n/missingKeys.test.ts`            | 守卫：代码里 `t("x")` 引用的键在 `en.json` 里真的存在                                    |
| `src/lib/i18n/locales.test.ts`                | 守卫：语言解析与回退规则                                                                |
| `tests/test-utils.tsx`                        | 测试侧的 `renderWithProviders`，已包好 `LocaleProvider`                                 |
| `tests/i18nStub.ts`                           | 测试侧的 `enMessages`，给拿不到 React 上下文的纯函数查 `en.json`                        |

## 语言怎么定下来

`resolveInitialLocale` 是一条明确的三级回退链，优先级从高到低是 `localStorage` 里存过的合法值、浏览器语言里以 `zh` 开头的标签、英语

浏览器语言的归一在 `localeFromBrowserLanguage`，它把 `zh`、`zh-CN`、`zh-TW`、`ZH-HANS-CN` 全部映射到 `zh-CN`。繁体标签也落到简体是刻意的：目前没有 `zh-TW` 目录，与其让繁体用户看到英文，不如给简体。如果将来要加繁体，改这一个函数即可，`locales.test.ts` 已经把这个行为固化下来

`LocaleContext` 用 `useSyncExternalStore` 而不是 `useState`，因为语言要对两件事同时响应：同标签页内的切换（自定义事件）、跨标签页的切换（原生 `storage` 事件）。`getServerSnapshot` 固定返回英语，这样静态导出的 HTML 在客户端 hydration 前就是英语，避免 hydration mismatch

`LocaleProvider` 带一个可选的 `locale` 属性，传了就强制使用、并且不再订阅存储。这条路径是给测试用的，让用例能把语言钉死

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

还有一个方向目前没人管：`en.json` 里有、但代码里没人用的死键。抓它要处理动态键、`getTranslations`、非 React 调用等情形，误报会很多，值得单开一个任务

## 测试侧的两个入口

`renderWithProviders` 把 `NuqsTestingAdapter`、`QueryClientProvider`、`LocaleProvider` 三层包好，并强制 `locale="zh-CN"`。强制中文是有意的：翻译工作的断言对象是中文文案，让每个用例都自己拼语言环境只会重复

但这个强制也带来一个副作用，写测试时要知道。`LanguageSwitcher` 自己的行为是"读 `localStorage` 决定语言"，而强制 `locale` 会把这条链路短路掉，所以那个组件的测试不能靠 `renderWithProviders`

`enMessages` 给列定义工厂这类拿不到 React 上下文的纯函数用。它按 `mcpServers` 命名空间去 `en.json` 查值，查不到就抛错。这样测试断言的仍是真实英文文案（`+1 more`）而不是键名（`toolsets.moreCount`），键名写错会立刻失败

`NAMESPACE` 常量要和调用点生产的 `useTranslations("mcpServers")` 保持一致，所以工厂里的键写相对路径 `toolsets.edit`，写成全名会被拼成两层而解析失败
