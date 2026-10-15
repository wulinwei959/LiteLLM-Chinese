# 错误修复步骤

翻译工作的失败很少是"翻译错了"，绝大多数是下面七类里的一类。这一篇先给分类表和定位手段，再给这一轮实际修过的缺陷清单，最后是回归守卫

## 总则：先分类，再修

不要按测试名猜原因。批量失败时先按**错误文本**聚合，同一段错误文本往往对应同一个根因，修一处能消掉几十个失败

聚合办法是跑一份 JSON 报告再按 `failureMessages[0]` 分组

```
npx vitest run "<路径>" --reporter=json --outputFile="$TEMP/fails.json"
```

`models-and-endpoints` 与 `VirtualKeysPage` 原有 74 个失败，看着像一批"翻译后没同步的过时查询"，聚合后发现 62 个是同一个原因（缺 `NextIntlClientProvider`）。按测试名一个个看会浪费一整天

判断某个失败是不是自己引入的，用 `git stash` 回基线复跑同一个文件对比。基线里就有的失败不要顺手"修"，那是另一个模块的账

## 缺陷分类表

| 症状                                                       | 根因                                             | 修法                                                     |
| ---------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| 抛 `context from NextIntlClientProvider was not found`      | 测试用普通 `render`，组件调 `useTranslations`     | 改用 `renderWithProviders`                                |
| 界面显示点分键名，如 `playground.compliance.stop`           | `t("x")` 指向的键在目录里不存在                   | 补键，两侧同时补                                         |
| 控制台 `IntlError: MISSING_MESSAGE`                         | 同上                                             | 同上                                                     |
| `messagesParity` 报键树不一致                               | 一侧多键或少键                                   | 找出多/少的那条，对齐                                     |
| 界面空白，控制台 `INVALID_MESSAGE: UNCLOSED_TAG`            | 消息里有未加引号的尖括号                          | 用单引号把尖括号括起来                                   |
| 界面空白，控制台 `INVALID_MESSAGE: MALFORMED_ARGUMENT`      | 消息里有未加引号的花括号                          | 用单引号把花括号括起来                                   |
| React 报 `Do not call Hooks inside useMemo`                 | 列定义工厂里调了 `useTranslations`                | 把 `t` 作为参数传进工厂，并进 `useMemo` 依赖              |
| tsc 报 `TS2345` / 裸 `Translator` 判定不可靠                | props 用了 `ReturnType<typeof useTranslations>`   | 换成 `translators.ts` 里的具体类型                        |
| 测试报 `Found multiple elements`                            | 两处不同英文被映射到同一个已存在的键              | 各开各的键                                               |
| 测试断言失败，实际界面已变中文                              | 断言还是英文原文                                 | 更新断言                                                 |
| 用例要验证的正是被测试 helper 钉住的那条链路                | helper 固定了环境值，把被测链路短路              | 给 helper 加"不钉"出口，用 `null` 而不是省略             |
| ESLint 报 `rules-of-hooks` 说 hook 被条件调用               | `cond ?? useHook()` 这类短路写法                 | hook 无条件调用，取值时再在候选值之间选                   |

## 缺 Provider（第一类）

组件接入 `next-intl` 后，原来用普通 `render` 的测试会抛 "context from `NextIntlClientProvider` was not found"，异常发生在渲染阶段，**后面的断言一条都不会执行**，所以整份文件看起来是"全部失败"而不是"只错了一点"

修法是把 `render` 换成 `tests/test-utils.tsx` 的 `renderWithProviders`，它已经包好 `LocaleProvider`、`QueryClientProvider` 与 `NuqsTestingAdapter`。注意相对层级：文件在 `src/app/(dashboard)/<route>/` 下用 4 级 `../`，在 `.../<route>/_components/` 下用 5 级

只有测试需要自定义包裹层且不便改造时，才 mock `next-intl`，参照 `VirtualKeysTable.test.tsx`

用 `renderWithProviders` 前先看组件是否用 react-query。用到的话，共享的 `testQueryClient` 带 `staleTime: Infinity`，用例内覆盖 `mockResolvedValue` 必须在 `beforeEach` 里 `testQueryClient.clear()`，否则会拿到上一个用例的缓存

## 缺键（第二类）

### 运行期的真实表现

这一点必须说清楚，因为它决定严重程度。**React 路径下 next-intl 不抛异常**，它记一条 `IntlError: MISSING_MESSAGE` 然后渲染回退值，而回退值就是键路径本身。用户看到的是 `playground.compliance.testConfigTitle` 这样一串点分键名

只有直接调 `createTranslator(...)` 的核心 API 才会抛。两者的行为不同，用核心 API 做实验会得出错误结论，必须用 `NextIntlClientProvider` 加 `renderWithProviders` 实测

所以这类缺陷不会让页面崩溃，但会让一块界面全是键名，比崩溃更隐蔽，因为不会有错误上报

### 定位

`missingKeys.test.ts` 就是干这个的。它遍历 `src` 下所有调过 `useTranslations` 的文件，按作用域解析每个 `t("x")`

它有两条已知盲区。`t` 通过 props 传进来的文件无法静态判定作用域，会被跳过，`keyTableColumns` 的 19 个缺失就是这么漏的。一个文件同时引入多个命名空间时，裸 `t("x")` 只要在任意一个作用域里能解析就不算缺失，`VirtualKeysTable` 的 `filterLabels.*` 就是这么漏的，它在 `common` 里有同名键但运行时走的是 `virtualKeys`

### 补键时英文原文要逐字恢复

不要凭上下文猜英文，也不要润色。测试可能断言了原文，猜错会让本来通过的用例变红

从 i18n 之前的快照取。本仓库的基线提交是 `610473c`（upstream 源码快照，2026-09-27）

```
git diff -U0 610473c HEAD -- <相对当前目录的路径>
```

`git diff` 天然给出前后行配对，比按行号对齐可靠。注意 `git show` 的路径要加 `ui/litellm-dashboard/` 前缀，而 `git diff` 的 pathspec 是相对当前目录的，两者不一样。Windows 上用 `execFileSync` 传参数数组，cmd 不认单引号，路径里的 `(dashboard)` 会被吃掉

### 写目录要用脚本，并且回读核对

手工编辑大 JSON 会出错，用脚本更稳，但脚本本身有两个坑

脚本打印"写入成功"不等于成功。JSON 被覆盖后要**重新读回来**，逐条核对键存在、值非空、两侧键树一致。有过连续两次被同一种假成功骗到的记录

行尾要先探测，别照抄任何文档里的结论，包括这一条。`JSON.stringify(x, null, 2)` 输出 LF，如果文件实际是 CRLF 而直接写回，整个文件会显示为全部改动，几十行真实改动淹没在几千行行尾噪音里。2026-10-14 在本机 checkout 实测：`en.json`、`zh-CN.json` 与 `src` 下的 `.tsx` 全是 LF，CR 字节数为 0，仓库也没设 `core.autocrlf`。早先这里写的是"这两个目录是 CRLF"，那是另一台机器上 Windows checkout 的状态，照它拼 `\r\n` 反而会把行尾改脏。探测一条命令：`node -e "const s=require('fs').readFileSync(f,'latin1');console.log((s.match(/\r/g)||[]).length)"`，为 0 就按 LF 写

写回的核对方式也别只看 `git diff --stat` 的行数：`git diff` 默认会把行尾差异算进改动行。用脚本把写入后的文件读回来，逐条比对键路径与值，比任何 diff 统计都可靠

## 键树不一致（第三类）

`messagesParity.test.ts` 的 "should keep the zh-CN key tree identical to en" 会报这个。它在断言里直接给出两侧路径的差异数组，照上面找

常见的产生方式是在一侧补了键但另一侧忘了，或者是嵌套对象与字符串同名（`status` 已经是字符串，又加了 `status.active`）

定位的一条命令

```
node -e "const en=require('./src/messages/en.json'),zh=require('./src/messages/zh-CN.json');
const p=(n,x)=>typeof n==='object'&&n!==null?Object.entries(n).flatMap(([k,v])=>p(v,x?x+'.'+k:k)):[x];
const e=new Set(p(en,'')),z=new Set(p(zh,''));
console.log('en 有 zh 无:',[...e].filter(k=>!z.has(k)));
console.log('zh 有 en 无:',[...z].filter(k=>!e.has(k)));"
```

## ICU 语法（第四类）

尖括号与花括号两类问题都在 `messagesParity.test.ts` 里有守卫，所以它们不会跑到生产环境，但加新消息时容易踩

| 场景           | 写法                                        |
| -------------- | ------------------------------------------- |
| RFC 里的尖括号 | `api://'<app-id>'/.default`                 |
| 内嵌 JSON      | `(e.g. '{'"organization": "my-org"'}')`     |
| 富文本         | `请查看 <link>文档</link>`，用 `t.rich` 渲染 |

三个细节

已经在引号里的尖括号不要动。`'Authorization: Bearer <token>'` 本来就有引号，再加一层会变成 `'<token>''` 反而坏掉

闭合标签要一起判断。`<strong>` 在富文本白名单里，`</strong>` 的 body 是 `/strong`，不先剥掉斜杠就会把闭合标签也加上引号，消息从"能渲染"变成"渲染出字面量标签"

`t(key, values)` 的 `values` 只接受 `string | number | Date`。要传 React 节点处理器必须用 `t.rich(key, handlers)`，写成 `t(key, { tag: (chunks) => <b>{chunks}</b> })` 编译不过

单复数不要拆成两个键再加三元选择，用 ICU 的 `plural`。中文那条只留 `{count}`，`next-intl` 自动走 `other` 分支

可选后缀不要用 `select`。`select` 按值匹配而 `""` 也是一个值，会走 `other` 分支渲染出多余的冒号。把分隔符和值一起作为后缀传进去

## Hook 规则（第五类）

列定义工厂被 `useMemo` 调用，工厂里调 `useTranslations` 会让 hook 顺序在不同渲染间错位，表格直接崩。这不是风格问题

```tsx
// 错：列定义工厂不是组件，也不是自定义 Hook
const getModelsTableColumns = (deps: ModelsTableColumnDeps) => {
  const t = useTranslations("models");
  ...
}

// 对：t 由调用方传入，并进 useMemo 的依赖数组
const columns = useMemo(() => getModelsTableColumns({ ...deps, t }), [t, ...]);
```

`eslint` 的 `react-hooks/rules-of-hooks` 能抓到，跑的时候要真的看退出码，不要只看输出里有没有 "error"

## 断言过时（第六类）

中文目录补齐后，测试里断言的英文文案要换成中文。这一类没有守卫，只能靠跑测试发现

改断言时注意别把测试改弱。断言要精确到行为破坏时会失败：`getByText("语言")` 比 `queryByText(/语/)` 好

`eslint-plugin-testing-library` 与 `eslint-plugin-jest-dom` 会机械性地拦掉一部分问题，但**不要信任 `eslint --fix`**。批量修整这套插件时产出过七类坏结果，其中两类是静默的：`prefer-checked` 把 `checked` 属性换成 `.checked` 属性（radio 可以一个真一个假），`prefer-to-have-text-content` 把字符串包成未转义的 `new RegExp()`，`toContain("100K+ requests")` 会变成"100 后面跟一个或多个 K"这类语义完全不同的正则，编译通过、lint 干净、测试继续绿但不再断言原本的意思

## 类型（第七类）

`ReturnType<typeof useTranslations>` 不带命名空间参数时，key 联合会退化成全目录五千多条的巨型联合，编译器算到一半放弃，之后所有判定都不可靠

```
declare const t: ReturnType<typeof useTranslations>;
t("common.save"); // 合法全路径，误报
t("loading");     // 哪都不存在，漏报
```

所以 props 与工厂函数的参数一律用 `src/lib/i18n/translators.ts` 里的具体命名空间类型。测试替身用 `as unknown as McpServersTranslator` 传进去，替身内部仍然查 `en.json`，牙齿没丢

判断"有没有新增类型错误"时，**逐条比对，不要按文件去重**。按文件去重会掩盖同一文件内的新增错误：`MCPToolsetsTab.tsx` 把 `t.rich` 写成 `t()` 那次，`tsc` 对比显示"56 个文件对 56 个，零差异"就放行了，因为那个文件本来就在报错列表里

```
npx tsc --noEmit 2>&1 | grep "error TS" | sed 's/^ *//' | sort -u
```

基线是 904 条（去重后）、56 个文件（2026-10-13 实测），全部落在测试文件里，非测试文件零错误

## 测试 helper 与被测链路冲突（第八类）

`renderWithProviders` 默认把 `locale` 钉在 `zh-CN`，这对翻译断言是对的：它们读的是真实中文文案。但 `LanguageSwitcher` 要测的行为恰恰是"读 `localStorage` 决定语言"，钉住就把这条链路短路了，于是它的两个用例一直是红的，而组件本身没有缺陷

修法是给 helper 加一个"不钉"的出口，让调用方自己选。三个细节值得记

出口的值用 `null` 而不是省略。省略在 JS 里的语义是"没传，用默认值"，和"明确要求不钉"必须能区分开，否则默认值就永远关不掉

用例要自带前置条件。`localStorage` 在同一文件内跨用例存活，而浏览器语言的默认值由 jsdom 决定，属于我们不拥有的外部事实。switcher 的用例在 `beforeEach` 里清存储，并显式 stub `navigator.language`，这样"无存储偏好且浏览器语言非中文时回落到英文"这条断言才有意义，不会随 jsdom 版本漂移

顺带修掉 `LocaleProvider` 里 `useSyncExternalStore` 的条件调用。`forcedLocale ?? useSyncExternalStore(...)` 让 hook 的调用次数随 prop 的有无变化，`react-hooks/rules-of-hooks` 报 error 且不在 `eslint-suppressions.json` 基线里，也就是说这是一条常驻的 lint 红灯。改成无条件调用、取值时再在两个候选之间选，钉住的行为不变（`forcedLocale` 优先），只是钉住时也会订阅存储

新增的用例要有牙齿。把 `getSnapshot` 里的浏览器语言回退临时去掉，只有"跟随浏览器语言"那一条变红，其余三条仍绿，说明它盯的确实是这条回退

## 本轮修过的缺陷

2026-10-12 这一轮从"翻译做完，测试红一片"收尾到"核心模块全绿"，修的东西按类分

第一类是缺 Provider，占绝大多数。`ModelsTableColumns`、`AutoRoutersPanel`、`AccessGroupBudgetsPanel`、`MCPNetworkSettings`、`MCPToolsetsTab`、`MCPGatewaySessionsTab`、`UserEnvVarsModal`、`PromptCachingRequestsTable`、`PriceDataManagementTab`、`ModelRetrySettingsTab`、`AccessGroupsModal`、`mcp_server_edit`、`mcp_servers`、`mcp_tool_configuration` 等一批文件里的测试从普通 `render` 改为 `renderWithProviders`

第二类是 Hook 规则。`useTranslations` 被写在模块作用域、`useEffect`、`useMemo` 里的几处，改成由调用方传 `t`

第三类是缺键。补齐 `zh-CN.json` 里被引用但缺失的一百多个键

第四类是断言过时。把断言从英文改为中文

第五类是组件里的硬编码字符串。`Switch` 的 `aria-label` 等仍然写死的英文改为走 `t()`

## 2026-10-12 新发现并修复的两条

### `missingKeys.test.ts` 从未生效

这条守卫的 `scopes` 计算里写成了

```ts
.filter((ns) => resolve(en as Record<string, unknown>, ns) !== undefined)
```

`resolve` 的第一个参数要的是命名空间字符串，这里传进去的是整个 `en` 对象。运行期 `en["[object Object]"]` 恒为 `undefined`，于是 `scopes` 恒为空集，函数在 `scopes.size === 0` 处提前返回，一个键都没检查过

它当初是绿的，`tsc` 也确实报了 `TS2345`，但基线有 819 条错误，这一条淹在里面没人看

修它的时候还发现第二个 bug。原实现把"首段是顶层命名空间的键"当成绝对路径处理

```ts
const explicitRoot = key.split(".")[0];
const namespaces = NAMESPACES.has(explicitRoot) ? [explicitRoot] : [...scopes];
```

但 `next-intl` **没有**绝对路径回退。用真实库实证过：`useTranslations("usage")` 作用域下调 `t("common.save")`，解析的是 `usage.common.save`，抛 `MISSING_MESSAGE`。所以 `t("models")` 在 `access-groups` 作用域下解析的是 `access-groups.models`，把它当绝对路径会误报

两个 bug 都修好后，守卫从"永远绿"变成"报出 47 条真实缺失"，集中在两个文件

| 文件                        | 缺失键                                              |
| --------------------------- | --------------------------------------------------- |
| `MCPGatewaySessionsTab.tsx` | `mcpServers.actions`（zh 有、en 没有）               |
| `ComplianceUI.tsx`          | `playground.compliance.*` 46 个                     |

这 47 个键当天已经补齐，守卫转绿。**这条守卫现在是有牙齿的**：它在目录缺键时红、补齐后绿，两个方向都实测过。补键时英文按 `610473c` 逐字恢复，中文按 `GLOSSARY.md` 定译

### `ComplianceUI` 的合规测试界面一直是键名

`playground.compliance` 在两侧目录里都只有 5 个键（`requiredColumns`、`optionalColumns`、`typeToTest`、`returned`、`triggeredBy`），而组件引用了 51 个。缺的 46 个包括标题、按钮、表格标签、结果统计，也就是说这一整块界面显示的是 `playground.compliance.testConfigTitle` 这样的键名

它的产生过程是：翻译 `bd3def8` 把这一文件的英文替换成了 `t()` 调用，但漏掉了键的定义；两侧目录同样地缺，所以 `messagesParity` 的键树比对通过；`missingKeys` 当时是坏的，也没报

顺带记录两处遗留。一是 `pressEnter` 的原文是 `Press <kbd>Enter</kbd> to submit · <kbd>Shift+Enter</kbd> for new line`，翻译后整段换成 `t("compliance.pressEnter")`，两个 `<kbd>` 元素的样式丢了，文案本身还在，属于外观退化

二是 `total`、`correct`、`falseNegativeLabel`、`falsePositiveLabel` 四处调用传了 `{ count }`，但数字实际由相邻的 span 单独渲染，消息里并不使用这个参数。`next-intl` 会静默忽略多余的 values，所以没有行为问题，但读代码的人会以为数字来自消息。这四处可以去掉多余的参数

## 2026-10-12 构建报错：dd32399 在非测试文件里留下的 22 处类型错误

`dd32399`（翻译大屏合并提交）把 `add_model/cache_control_settings.tsx` 里的英文常量换成 `t()` 调用，顺手删掉了 `CACHE_CONTROL_LABEL` / `CACHE_CONTROL_TOOLTIP` 等五个导出，但没查引用方。`ModelInfoEditForm.tsx`（上游快照带来的未翻译文件）仍在 import 其中两个，生产构建从那时起就是红的，到本次发现已隔 23 个提交。这还没完：修掉缺导出的报错后构建推进到下一层，`Failed to type check` 又停在 `layout.tsx` 的 `Cannot find name 't'`。同一提交在非测试文件里共留下五类错误、22 条、9 个文件

| 类 | 例子 | 修法 |
| -- | ---- | ---- |
| 删掉的导出仍被引用 | `ModelInfoEditForm.tsx` 引用 `CACHE_CONTROL_LABEL`/`CACHE_CONTROL_TOOLTIP` | 接入 `models.addModel.cacheControlLabel` 与 `cacheControlTooltipDesc`（后者此前是死键） |
| `t()` 调用处没有 hook | `layout.tsx` 的 `AgentControlPlaneView`、`MCPToolsetsTab.tsx` 的 `MCPToolList`、`A2AMetrics.tsx` 共 10 条 TS2304 | 补 `useTranslations("nav")` / `("mcpServers")` / `("playground")`；`layout.tsx` 的键名同步从 `t("nav.plugin")` 改回 `t("plugin")` |
| `keyof typeof` 指向不存在的名字 | `models-and-endpoints/page.tsx` 的 `keyof typeof models.tabs` 里 `models` 未定义 | `import type enMessages from "@/messages/en.json"`，改 `keyof typeof enMessages.models.tabs` |
| 重复的 interface 声明 | `AccessGroupBudgetColumns.tsx` 残留了导出接口的旧副本，TS2395/TS2339 | 删掉本地重复声明，保留带 `t` 字段的导出版本 |
| 无意义的解构 | `ui/input.tsx`、`ui/input-group.tsx`、`PasswordInput.tsx` 里 `"data-testid": testId` 解构后原样再传，React 19 的 `ComponentProps` 不认带连字符的键 | 退回上游的 `{...props}` 透传写法；调用点 `data-testid` 本就经 spread 落到 DOM，行为不变 |

三个信号里只有构建能看见这一整类。`npx vitest run` 什么都不报，Vite 对缺失的具名导出解析为 `undefined`，测试照常绿；`npx tsc --noEmit` 会报，但 22 条混在 928 条存量里没人逐条比对；`npm run build` 才会硬失败，且一次只报第一个错（先是 Turbopack 的 `Export CACHE_CONTROL_LABEL doesn't exist in target module`，修完再报 `Failed to type check … layout.tsx:78 Cannot find name 't'`）

修完 22 条后：`tsc` 基线从 928 降到 904 条（82 个文件），**剩下的 904 条全部在 `*.test.tsx` / `*.test.ts` 里**（大头是 vitest 全局类型缺失的 TS2304/TS2582 与测试文件自身的类型债），非测试文件清零。`npm run build` 恢复绿色（退出码 0）。注意 `next.config.mjs` 设了 `useTypeScriptCli: false`，Next 16 自带的类型检查阶段不覆盖测试文件，所以 904 条测试文件错误不拦构建，与它们共存是当前常态；哪天开了这个实验开关，测试文件债会立刻变成构建红灯

教训有三条。删导出前全仓搜引用，搜索范围要包含未翻译的批次 24 长尾文件；改大文件里的 `t()` 之前确认 hook 在作用域里（改前 diff 里看得到 `Cannot find name 't'` 这种低级错误不该进提交）；每批收口跑一次 `npm run build` 并检查退出码，vitest 与 tsc 基线比对都拦不住这一类

## 2026-10-12 全量分片收口：六例 auto_router 时序假红与"单跑全绿"的时效

清扫完快照列出的所有块后，用 `--shard=k/4` 串行复核全量（这台机器单进程全跑进不了 10 分钟执行窗，产物会被截断；并发跑多个 vitest 会互相拖慢且把失败数放大）。分片前后共抓出 33 例不在快照里的失败，其中 27 例是第六类或同类断言停更（分页脚、日志集成标题、创建密钥弹窗可访问名、请求头组件、批量邀请按钮、SSO 骨架文案等，分布在 11 个文件，随 `ebf1fca` 8 例、`edeb082` 1 例、`041b668` 17 例与本次提交清零），另 6 例是 `toBeEnabled` 超时，集中在 `add_auto_router_tab` 与 `edit_auto_router_modal` 两个套件

这 6 例的根因不是翻译也不是产品缺陷：提交按钮要等 `useAutoRouterAvailability` 的 300ms 防抖加重新取数，大表单重渲染把这段过程推过了 `waitFor` 默认的 1s 预算（实测把预算提到 5s 后全部通过）。失败集合还会随机器负载漂移：同一文件两次单跑分别是 5 例与 4 例、名字都不同。修法是两套件里提交按钮可用性的全部等待统一加 `{ timeout: 5000 }`（`4550833`），复跑 64 + 90 例全绿

两条教训。其一，"单跑全绿"的旧结论有时效性：它可能是机器更快或组件更小的时刻测得的，链条上的文件没改并不代表结论仍成立。本次用 `git log 507e347..HEAD -- <链路文件>` 逐一证明 availability hook、networking、test-utils 自上游导入后均未变，把"回归"排除成"边缘时序"，旧记录在 PROGRESS 里同步改口。其二，`waitFor` 默认 1s 对"防抖 + 取数 + 重渲染"的交互偏紧，写这类等待要么显式给预算，要么断言更上游的可观测信号

## 2026-10-12 四族清零：229 例断言同步的踩坑记录

projects（82）、prompts（56）、agents（55）、cost-tracking（36）四个路由收口时，除了常规的"断言停在英文"，还踩到几类值得记的坑：

- 以旧英文串为锚的测试辅助函数会静默失效。`multi_cost_results.test.tsx` 的 `shownBreakdown()` 找的是上游时代的硬编码标记 `Total/Request`，翻译接入 `t("totalPerRequestShort")`（渲染"合计/请求"）后它永远返回 null：两条"隐藏态"断言假绿、两条"可见态"断言报错。改键之前先搜测试里的辅助函数，别只搜断言本身。`ProjectsPage.test.tsx` 的 `queryByRole("heading", { name: /projects/i })` 同理，翻译后变成真空断言，本次一并改成 `/^项目$/`
- 同一表单的两种变体翻译进度可能不一致。agents 编辑器里 agent_name 标签在静态表单是硬编码英文、在动态表单已是 `t("agentName")`，测试断言哪种语言都会有一半走不通；修法是给静态表单补接既有键（`agentName` / `nameFieldHint` / `nameRequired`），而不是让断言迁就半成品
- "键已存在但调用点没接"是常见残留。`AgentsTableColumns` 的 meta 里已有 `t("colAgentName")`，header 却写死英文；同理 agents 面板标题、表单标签都有"目录有键、调用点写死"的情况。碰到"界面是英文但目录里明明有键"时先确认是不是这一类，接上即可，不用加新键。`ProjectDetailsPage.tsx` 的项目状态徽标是同一类：`projects.statusActive` / `statusBlocked` 两侧目录都有（`Active` / `活跃`、`Blocked` / `已封禁`），组件却写死 `project.blocked ? "Blocked" : "Active"`，中文界面下一直显示英文。这类残留的共同点是**断言与组件自洽**（都是英文），所以测试全绿，只有拿目录里的键去反查调用点才会发现；按"界面是英文"扫不出，得按"目录有键没人用"扫
- 面板级翻译不完整会产生"标题中文、字段英文"的混排（agents 的 capabilities / optional / cost / auth headers 面板都是这样）。断言同步时逐串确认该串在源码里是 `t()` 还是硬编码：`t()` 的改为中文断言，硬编码的保持英文断言，并在提交信息里记下边界
- 批量改断言时把消息值从 `zh-CN.json` 读出来生成替换串，不要手抄。"请求头名称（如 Authorization）"的全角括号、"移除中…"的省略号、ICU 里的 `{name}` 占位符，手抄一次错一次；用脚本取值替换，一步到位
- `findByLabelText` / `getByLabelText` 前缀不同，替换模式写 `getByLabelText(...)` 会漏掉 `findByLabelText(...)` 的那些行。替换后按 `ByLabelText(` 之类的后缀再扫一遍兜底

## 2026-10-13 同步上游 v1.105.0 后的修复

### `"use client"` 指令位置错误导致 Docker 构建失败

**症状**：Docker 多阶段构建在 `ui-builder` 阶段报错 `Module build failed: "use client" must be placed before any import statements`

**根因**：`src/app/(dashboard)/models-and-endpoints/components/ModelsTableColumns.tsx` 里 `"use client"` 指令写在 import 语句之后（第 6 行），Next.js App Router 要求 `"use client"` 必须是文件的第一行（注释除外）

**修法**：将 `"use client"` 移至文件第 1 行，所有 import 之前

```diff
- import type { ModelsTranslator } from "@/lib/i18n/translators";
- import { useTranslations } from "next-intl";
- "use client";
+ "use client";
+
+ import type { ModelsTranslator } from "@/lib/i18n/translators";
+ import { useTranslations } from "next-intl";
```

**验证**：`docker compose build --no-cache` 通过，容器正常启动

2026-10-12 修 Provider 批次和 team 批次时实测确认：以下位置的组件仍输出硬编码英文，对应测试断言保留英文原文。批次 24 收口时先把这些字符串接入 `t()`，再把断言同步为中文

| 文件 | 硬编码内容 | 状态 |
| ---- | ---------- | ---- |
| `common_components/budget_duration_dropdown.tsx` | `Never resets` 与 hourly/daily/weekly/monthly 选项文案（路径在 `common_components` 下，不是 `shared`） | 已修 `dfcf2ca` |
| `team/useMemberBudgetReset.ts` | toast 文案（`Reset N member budgets to the team default`、`... the rest could not be reset`、`Team updated, but member budgets could not be reset`） | 已修 `78024a5` |
| `shared/ScopedSavingsTab.tsx` | `Loading savings...` 与 `No usage recorded for this ...` 空态文案（路径在 `shared` 下，不是 `templates`） | 已修 `45c7998` |
| `add_model/cache_control_settings.tsx` | aria-label 拼接 `${label} help`，`label` 已翻译（角色/索引）但 ` help` 后缀是英文，整名混语（"角色 help"） | 已修 `1abc26d` |
| `public_model_hub` 分页脚 | 实际写死的是 `Showing {n} of {m} agents` 与 `Showing {n} of {m} MCP servers`，与共享表格的"第 X 页，共 Y 页"不一致 | 已修（本次提交）。`AIHub/ModelHubTable.tsx` 有一份同样的脚注（多一条 models），一并接入 `modelHub` 命名空间 |
| `templates/key_edit_view.tsx` | budget duration 选择框的 placeholder `Never resets` | 已修 `dfcf2ca`。该文件已接近 800 行上限，改用共享下拉的 `emptyMeansNeverResets` 表达空值，不在这文件里加引词代码 |
| `components/GuardrailsMonitor/usageUnits.ts` | `unpricedSummary()` 的 `N units unpriced`、`counterLabel()` 由驼峰键派生的计数器名（`Content Policy`）、`counterMathRow()` 的 `no known price, left out` 与 `N unpriced units left out`，中文下仍渲染英文 | 已修（本次提交） |
| `guardrails-monitor/_components/ScoreChart.tsx` | 图例 `categories={["passed", "blocked"]}` 写死英文 | 已修（本次提交） |
| `guardrails/_components/custom_code/CustomCodeModal.tsx` | 名称输入框 placeholder `e.g., block-pii-custom` | 已修（本次提交） |
| `guardrails/_components/TeamGuardrailsTab.tsx` | 提交弹窗的 `https://your-guardrail-api.com/v1/check`、两个 JSON 示例 placeholder 与"等效配置"YAML 片段 | 已修（本次提交）。YAML 注释接入 `t()`；示例 URL 与 JSON 示例值保留英文 |

批次 24 扫 `add_model` / `edit_auto_router` 时又实测到五处残留硬编码英文，均已在 `63c381eb` 接入 `t()` 并把断言同步中文

| 文件 | 硬编码内容 | 状态 |
| ---- | ---------- | ---- |
| `add_model/RouterConfigBuilder.tsx` | `serializeRouterConfig` 在路由缺模型时 `throw new Error("Please select a model for every route")`，经 `edit_auto_router_modal` 的 `handleSubmit` catch 走 `toast.fromError`，英文直接进弹窗 | 已修 `63c381eb`。`serializeRouterConfig(t, config)` 首参翻译器，键 `routerRouteModelRequired` |
| `edit_auto_router/edit_auto_router_modal.tsx` | 第二处保存成功 `toast.success("Auto router configuration updated successfully")` 漏改（同文件另一处已接 `editModalSaved`） | 已修 `63c381eb` |
| `add_model/auto_router_connection_test.tsx` | `role="status"` 的 `aria-label="Jev connection"` | 已修 `63c381eb`，键 `connJevStatusLabel` |
| `add_model/cache_control_settings.tsx` | 角色下拉的 `<SelectItem value={null}>None</SelectItem>` | 已修 `63c381eb`，键 `cacheControlNone` |
| `add_model/handle_add_model_submit.tsx` | 两处 JSON 解析失败 `throw new Error("Failed to parse litellm_extra_params: " + error)`，内层 toast 已翻，但外层 catch 的 `{ suffix: 占位 error}` 会把英文再拼进 toast | 已修 `63c381eb`，改用 `failedParseExtraParams` |

`serializeRouterConfig` 是纯函数，调用点只有 `edit_auto_router_modal` 一处，加首参翻译器即可，注意它的单测 `RouterConfigBuilder.test.ts` 同步改 `serializeRouterConfig(t, ...)` 与中文断言。`handle_add_model_submit` 那条要注意双 toast：139/155 行先 `toast.fromError(t("failedParseExtraParams", ...))` 再 throw，外层 catch 又 `t("failedToCreateModel", { suffix: 占位 error })`；把 throw 的文案也换成 `failedParseExtraParams` 后两条 toast 才都全中文

guardrails 这一轮定了一条翻译边界：面向读者的散文（标签、注释、公式、空态）翻，机器可读的样例不翻。保留英文的四类：`usageUnits.ts` 的 `pricingIssueUrl`（预填 GitHub feature request，`title`/`the-feature` 面向上游维护者）、`TeamGuardrailsTab` 的示例 URL `https://your-guardrail-api.com/v1/check` 与两段 JSON 示例 placeholder、`CustomCodeModal` 的 Python 模板与 `{"texts": [...]}` placeholder、YAML 片段里的配置值（`fail_closed`、`os.environ/...`）。与 `TeamInfo.tsx` 的 `{"gpt-4": 4096}` 同一处理，改动时不要顺手翻

分页脚这一行对应两个文件：公开的 `public_model_hub.tsx` 与登录后的 `AIHub/ModelHubTable.tsx`，`Showing {n} of {m} ...` 各写了一份，改了一处必须搜另一处。三个键进新的 `modelHub` 命名空间，英文侧用 ICU plural（`one {# agent} other {# agents}`），中文侧直接写 `{shown}` 与 `{total}`，不加 plural。注意两个组件其余文案仍是英文，`modelHub` 只覆盖这三条脚注，批次 24 扫到这两个文件之前，这两页是混语状态

翻译会顶破 `max-lines`（800 行，跳过空行与注释）。`CustomCodeModal.tsx` 在 `83899df` 从 782 涨到 805，此后 `npx eslint <该文件>` 一直报 `max-lines` error。`eslint-suppressions.json` 是上游快照带来的批量豁免基线（19 个文件带 `max-lines` 豁免，含 `TeamGuardrailsTab.tsx`），不要往里追加新豁免；修法是抽块，本次把组件内的 `TEST_INPUT_EXAMPLES` 常量挪到 `custom_code/testInputExamples.ts`（89 行），文件回到 780 行。另外 `eslint --stdin` 不套用批量豁免，报出的 error 会比按文件跑多（本例 8 对 1），核对以按文件跑为准

另有两处结构性注意事项。`templates/KeySavingsTab` 的 SummaryCard testid 由译文经 `slugOf(label)` 派生（如 `summary-card-压缩节省`），testid 随 locale 变化，改译文即改 testid，断言勿按英文 testid 写死。三个测试（`view_logs/RequestLogsPanel`、`organization/organization_view`、`model_info_view`）用自定义 `wrapper` 覆盖 Provider，已在 wrapper 内嵌 `<LocaleProvider locale="zh-CN">` 保住中文渲染，后续改造时不要丢掉这一层

## 2026-10-14 第 13 簇（view_logs 筛选面板）踩到的四条

`prettier --check` 对消息目录、e2e spec 和 `docs/i18n/*.md` **本来就不是绿的**。`src/messages/en.json`、`src/messages/zh-CN.json` 与 `tests/e2e/ui/tests/logs/` 下三个 spec 在 HEAD 上就报格式差异（用 `--stdin-filepath` 按各自真实路径复测，差异行数分别是 18、24、114、186、96），`PROGRESS.md` / `FIXES.md` / `PLAN.md` 同样如此（202、96、74 行，主要是表格竖线对齐）。也就是说 `npm run format:check` 不是这些文件的门禁，`npm run lint` 走的是 `eslint-config-prettier`，只关掉格式规则。改完千万不要顺手 `prettier --write` 这几个文件，那会把 50 行的真实改动放大成整文件重写，正好踩上一条里说的坑。`.tsx` 组件与测试文件是按 prettier 写的，那几个可以也应该跑

组件模块作用域里的标签表（`STATUS_FILTER_ITEMS` 这类 `as const`）不能直接调 `t`，`t` 是 hook 返回值。改法是在组件内 `useMemo` 重建，并把 `t` 写进依赖数组；`VirtualKeysTable.tsx` 里 `statusFilterItems` 就是这个写法，别自己发明。同一条规则适用于 `useMemo` 内已有的模板字符串（`Model ID: ${id}` 变 `t("filters.modelIdLabel", { modelId })`），依赖数组同样要加 `t`

批量把测试里的英文标签换成中文时，`it.each([["success", "成功"]])` 这类数组只有第二项是可渲染文案，第一项是筛选器发给后端的值，翻了就直接查不到数据。用带引号的字面量做整串替换（`"Status"` 而不是 `Status`）能天然避开它，但 `["", "All Statuses"]` 这种首元素是空串的组要单独看一眼。同一次替换还会顺带命中 `it()` 标题之外的地方，跑完必须逐条看替换计数，`MISS` 和数量异常的都要回查

e2e 里这些筛选器是按 placeholder 文本给 combobox 命名来寻址的（`getByRole("combobox", { name: "Search a key alias" })`、`getByPlaceholder("Enter session ID…")`），所以字段标签换语言不影响 e2e，placeholder 换语言一定影响。本簇 3 个 spec 共 8 处：`logs.spec.ts` 的 `Search an end user`，`logsFilters.spec.ts` 的 `Search a key alias` 三处加 `All Statuses` 与 `Failure`，`logsPagination.spec.ts` 的 `Search a key alias` 与 `Enter session ID…`。`logsFilters.spec.ts:111` 那条注释提醒的是另一件事：Status 字段只标了分组、没标到 trigger 上，所以那个 combobox 只能按它当前显示的值定位。Playwright 需要活代理与真实请求数据，这 8 处改完只是字符串替换，没有跑过，别把它当成已验证

## 2026-10-15 标题复用正文键：一类守卫抓不到的缺陷

`mcp_connect.tsx` 的 `StepCard` 上游是两个文案位：`title="Add Configuration"` 加一段带 `<code>` 快捷键的正文。整批翻译（`dd323992`）为了少建键，把 `title` 改成 `titleKey` 并直接复用正文的键，于是同一句话既当标题又当正文，还留下三类后果

- `t(titleKey)` 是**动态键**，`missingKeys` 守卫只解析字面量 `t("a.b")`，所以它一条不报；`messagesParity` 只看两侧键树，也看不见调用点少传参数
- 正文 `copyConfig` 带 `{mac}`/`{windows}`，标题这次调用没传参，运行期抛 `FORMATTING_ERROR`，next-intl 走兜底，页面标题直接显示 `{mac}` 原样串。全量日志里这一条重复了 162 次，是当时唯一的 `FORMATTING_ERROR`
- 反过来 `openSettings` 本身没有占位符，正文那次 `t("openSettings", { mac, windows })` 的多余参数被静默丢弃，快捷键那半句话在两种语言里都消失了

修法是回到上游的文案位数量：标题三个键（`openSettings` 与新开 `navigateToMcpTools`/`addConfiguration`），正文三个键（新开 `openSettingsShortcut` 带两个参数，正文用已有 `goToMcpTools`/`copyConfig`），两侧目录各 +3 行，并补 1 例断言标题与插值后的快捷键、且面板里不再出现裸 `{mac}`

给后续簇留的规矩：**同一个键别同时当标题和正文**。若源码里 `t(变量)` 的变量取值带 ICU 参数，调用点不传参就一定会炸，改的时候要么把标题拆成独立无参键，要么把参数一路带到标题调用处

## 2026-10-15 消息目录手工插键的两条格式规矩

第 68 簇往 `routerSettings.fallbacks` 里插 30 个嵌套键时，用 4 空格写键名。目录能读、守卫全绿、测试也过，唯一信号是 prettier：那 30 行在 `diff -u 目录 <(npx prettier 目录)` 里每侧多算 60 行欠账。第 69 簇要往同一个块尾追加键，锚点定位脚本按"下一行必须是 `    }`"判断块边界，4 空格键名让这个断言直接失败，才把格式问题暴露出来

两条规矩：

- 嵌套块的键名用 6 空格（房内既有风格，参照 `virtualKeys.lifecycle`），块内正文行除最后一行外都要带逗号。第 69 簇把第 68 簇那 30 行统一纠正回 6 空格，两个消息目录的 prettier 欠账随之从 150/156 行收敛到 90/96 行；剩下的 90/96 是这批簇之前就在的（第 360–373 行一类 8 空格旧块），本簇没有新增
- 插键脚本必须带 `assert after == before + N` 与两侧键树相等两道检查，还要 `json.load` 一遍。第 69 簇第一版漏了逗号，报错是 `JSONDecodeError: Expecting ',' delimiter: line 4980`，位置在整份目录里而不是新块里，排查成本高；当时的处置是 `git checkout HEAD -- src/messages/en.json src/messages/zh-CN.json` 退回、重跑缩进纠正、再补逗号逻辑重写

## 2026-10-15 动态键表接 next-intl 的三条类型规矩

第 70 簇的两张密钥管理器卡把字段标签放在模块级表里（`FIELD_LABELS: Record<string, string>`），把弹窗分组放在 `interface FieldGroup { title: string; subtitle?: string }` + 数组字面量里。直接把这些值喂给 `t()` 会撞上 `NamespacedMessageKeys`——`Record<string, string>` 的值是宽 `string`，next-intl 的类型只接受目录里真实存在的键名，`tsc` 一下多出 8 条 TS2345

三条规矩：

- 键表写成 `const FIELD_LABEL_KEYS = { … } as const`，别加 `Record<string, string>` 注解（注解会把字面量类型重新放宽，等于没写）。取值用 `FIELD_LABEL_KEYS[field as keyof typeof FIELD_LABEL_KEYS]`，查不到时回落到原始字段名，组件里包一层 `labelOf(field)` 就够了。这个写法在第 24 簇的 `src/components/team/TeamMemberTab.tsx`（`BUDGET_SOURCE_LABEL_KEYS … as const satisfies Record<…>`）已经有先例
- 分组数组同样写成 `const FIELD_GROUPS = [...] as const`，成员存 `titleKey`/`subtitleKey` 而不是文案，并把只为描述形状而存在的 interface 删掉——留着接口就还得给键名标 `string`，又回到 TS2345
- 可选键在 JSX 里要用 `{"subtitleKey" in group && (<p>{t(group.subtitleKey)}</p>)}` 收窄，`group.subtitleKey && …` 这种写法通不过检查。改这行时注意别吃掉开头的 `{`，第 70 簇就漏过一次，报错是 TS1381 `Unexpected token`，症状却是 `tsc` 总数从 880 塌到 2——单文件语法错误让后续类型检查中断，看着像"错误变少了"

守卫侧不受影响：`missingKeys` 只解析同文件里的 `useTranslations("<ns>")` 与字面量 `t("a.b")`，`t(变量)` 一律跳过，所以键表本身不会被静态检查证伪，类型检查是唯一防线。

## 2026-10-15 接线脚本的两条锚点/依赖规矩

第 71 簇给两个直通端点组件做批量替换时，两条踩坑值得固化：

- **锚点必须带前导换行**。`src.count(old)` 里 `old` 若以若干空格开头，短缩进行是长缩进行的子串——同一个 `Headers` 段在 18 空格处出现一次、在 22 空格处又作为子串出现一次，断言数就变成 2，替换也会连带改到不该改的行。规矩是把所有以空格开头的锚点前缀 `"\n"`，让缩进从行首算起
- **别为省一次重建就把对象塞进 `useMemo`**。`add_pass_through.tsx` 的表单 schema 依赖一份 `formMessages`（内含 `t("...")` 结果）。写成 `useMemo(() => passThroughFormSchemaFor(formMessages), [formMessages])` 会触发 `react-hooks/exhaustive-deps`——`formMessages` 是组件体内每个渲染都新建的对象字面量，当 dep 不稳定。直接让 `const schema = passThroughFormSchemaFor(formMessages)` 每渲染重建一次即可：`useZodForm(schema, …)` 只在初始化时把 schema 交给 `zodResolver`，后续渲染换不换对象都无影响。这样 eslint 警告数回到与 HEAD 一致的 8 条

另一处非直觉点：`useTranslations` 是 hook，`translators.ts` 里那些给模块级纯函数用的 `*Translator` 别名只能从组件把 `t` 往下传，别在模块顶层调用 hook。第 71 簇两个 schema 工厂本身不碰 `t`，只收已算好的 `messages`，所以可以安全地留在模块级。

## 2026-10-15 第 72 簇：三态文案别写嵌套三元、逐行替换的键要整行

第 72 簇给 `key_info_view.tsx` 换预算重置文案时踩到两条：

- **三态以上的文案兜底别用嵌套三元**。预算重置要分"无 `reset_at` 走 `common.never`、有 `budget_duration` 走 `everyDurationNext`、否则裸时间戳"三种，第一版顺手写成 `a ? x : b ? y : z`，被本地 eslint 规则 `no-nested-ternary`（**ERROR** 级，不是 warning）直接判红。规矩是提前算：`let budgetResetDisplay: string;` + `if/else if/else`，再把 `{budgetResetDisplay}` 放进 JSX。凡是一段文案按二态以上分支组装的（`? :` 出现两次），都按这个改
- **逐行替换的字面量键必须是整行（`stripped` 后）**。批量脚本常把 `<stripped 原行> → <stripped 替换>` 放进字典按行套用来保留原缩进，比整块多行锚点更省事；但键若是"长行的截断"，就会漏。第 72 簇两次踩到：`<p className="text-xs text-muted-foreground">Loading guardrails...</p>` 其实是 `{loadingPolicies && <p …>…</p>}` 的尾巴、`{currentKeyData.key_alias || "Not Set"}` 被包在 `<p className="text-sm">…</p>` 里——短键既匹配不到（脚本报"unused key"）又可能误伤更深缩进的同名行。规矩是键写完整 stripped 行，落表前用 `src.count("\n"+key)` 数一遍，断言为 1 再替换

## 回归守卫

改完之后这几条必须一起跑

```
npx vitest run src/lib/i18n/messagesParity.test.ts src/lib/i18n/missingKeys.test.ts src/lib/i18n/locales.test.ts
```

`messagesParity` 管两侧对齐与 ICU 语法，`missingKeys` 管代码引用的键是否存在，`locales` 管语言解析。三条各管一个方向

改过引号转义之后，还要用真实 parser 跑一遍渲染结果，不能肉眼看原始字符串。有一批转义脚本把 `'<app-id>'` 又包了一层变成 `''<app-id>''`，肉眼看着"加了引号"，实际还是炸

## 还没有守卫的方向

`en.json` 里有、但代码没人用的死键。抓它要处理动态键、`getTranslations`、非 React 调用等情形，误报会很多。目前只能人工发现，发现一个删一个，删之前确认它不是被动态拼接的键名引用的

`t` 从 props 传进来的调用点。静态分析判定不了作用域，只能跳过，`keyTableColumns` 的 19 个缺失就是这么漏的
