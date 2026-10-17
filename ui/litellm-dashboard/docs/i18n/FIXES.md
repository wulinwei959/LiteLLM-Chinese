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

## 2026-10-17 第 126-131 簇：t.rich 的 tag 必须是消息里的字面量标签

next-intl 的 `t.rich` 只会对消息串里出现的字面量标签（`<code>`、`<link>` 等）调用传入的函数。如果把标签名写成普通占位符 `{usernameVar}`，再往 `t.rich` 里塞同名函数，运行时不会报错，但每个函数收到的 `chunks` 是空的，整段标签内容静默消失。表现是正文里 `UI_USERNAME`、`general_settings.disable_env_credential_login: true` 这类代码片段全没了，只剩两个空格，而测试报的是 `Unable to find an element with the text: ...`。

所以正文里的代码片段一律写成消息里的字面量 `<code>`，不用占位符：

```json
"body": "Anyone with <code>UI_USERNAME</code>/<code>UI_PASSWORD</code> ..."
```

另外，用 `Object.fromEntries([...].map(...))` 拼 tag 映射表也会踩同一个坑：`fromEntries` 的返回类型是 `{[k: string]: Function}`，next-intl 的类型增强认不出这是 tag 表，于是按普通实参处理。tag 表必须是字面量对象。

## 2026-10-17 第 126-131 簇：中文 plural 分支不能加引号

`messagesParity` 有两条互相对抗的检查：

- "quote every brace that is not a placeholder" 要求非占位符的花括号加引号；
- "should use the same argument names in both languages" 会先跑 `stripIcuQuotes`，而它把 `'{` 当成 ICU 转义引号直接吃掉，于是加引号后的 `{个工具}` 被当成一个新的实参名，和英文侧的 `{count}` 对不上。

唯一的写法是把 plural 分支的左花括号紧贴关键字、不留空格，让第一条检查的非重叠正则只匹配到 `{count, plural, other{个工具}`（含逗号，判定合法），而 `stripIcuQuotes` 也不会动它：

```json
"toolWord": "{count, plural, other{个工具}}"
```

仓库里 `roiCalculator.prCount` 的 `"{count} {count, plural, other{个 PR}}"` 就是这个写法。英文侧照常用 `one {...} other {...}`。

## 2026-10-17 第 126-131 簇：一个文件只能有一个 useTranslations 命名空间

`missingKeys` 的 "should resolve every t() call that names a namespace via useTranslations" 是按文件里最近的 `useTranslations("ns")` 字面量去解析所有裸 `t("x")` 调用的。所以哪怕某个 `t` 是从 props 传进来的，只要同文件里还有一处 `useTranslations("vectorStores.table")`，那个 `t` 就会被当成 `vectorStores.table` 翻译器，报出一堆 `vectorStores.table.openActions` 之类的假缺失。

结论是：一个文件里要么只用 props 传的翻译器，要么所有 `useTranslations` 挂在同一命名空间上。列定义工厂的惯例（`t`/`tableT`/`commonT` 全部由调用方传入，本文件不调 `useTranslations`）正好绕开这条限制。

## 2026-10-17 第 136 簇：hook 里的抛错文案也算用户可见

`useMcpOAuthFlow` 的十几句提示有两类出口：直接的 `toast.error(...)`，和 `throw new Error(...)` 之后再被 `extractErrorMessage` 收进 toast。两条路最终都落在用户屏幕上，所以都得接键；判据不是"这句在哪个语法位置"，而是"最终有没有人看到"。这与第 112 簇"只写进 `console.error` 的串保持英文"是同一条规则的两面。副作用是 hook 的两个 `useCallback` 依赖要补上 `t`，否则切语言后闭包里还是旧文案。

非组件模块直接挂 `useTranslations` 时，`renderHook` 的测试也要给包装层：`renderHook(fn, { wrapper })`，`wrapper` 用 `LocaleProvider locale="zh-CN"` 包一层即可，不必上完整的 `renderWithProviders`（那是给 `render` 用的，里面还有 react-query 和 nuqs）。不包的话首个渲染就抛 "context from `NextIntlClientProvider` was not found"。

## 2026-10-17 第 137-139 簇：一条消息里两个链接要开两个标签名、列头的可访问名藏在 meta.title

`indexesIntro` 的说明段里有两个指向不同地址的链接。ICU 的富文本标签按名字路由到 handler，所以两个 `<link>` 会拿到同一个渲染器，没法各给各的 href；得开两个语义化标签（`docsLink`、`issueLink`），并在 `messagesParity` 的 `RICH_TAGS` 白名单里登记。顺带发现同一条守卫的"是否闭合"检查用的是大小写敏感的 `includes`，混排大小写的标签会被误报未闭合，改成先整体小写再比。

列定义工厂里，`header` 翻了不代表全部：`meta: { title: ... }` 是骨架屏与列隐藏菜单用的可访问名，多数表把它写成英文字面量，只有 `header` 走 `t`。清残留时两处都要查，`ToolPoliciesTableColumns` 的 `Input Policy`/`Output Policy`/`Team Name`/`Key Name` 就是这么漏下的。

## 2026-10-17 第 140 簇：改共享组件的导出形状前先看渲染链路

把 `MODEL_SENTINEL_OPTIONS` 从英文 `label` 改成键名时，顺手把 `create_key_button.integration.test.tsx` 里的 `All Proxy Models` 断言一起改成了中文，结果红了。那个下拉根本不是 `ModelSelect`，而是 `create_key_button.tsx` 里 `modelOptions` 数组的另一份硬编码，该文件还没接线。教训是同名字符串在仓库里往往有多份来源，改断言前先确认被测元素由哪个文件渲染，别按"这个字符串应该归这个组件管"来推断。

另一个连带问题：`DefaultUserSettingsForm` 原来在模块顶层用 `MODEL_SENTINEL_OPTIONS` 建了一张 value 到英文 label 的表，改键名后这张表拿不到 `t`，只能下沉进组件体、用第二把 `modelSelect` 翻译器即时解析。模块级常量承载文案是同一个病根，键名化之后自然要把翻译点挪到组件里。

## 2026-10-17 第 148 簇：ICU 复数的分支臂必须保持单词

`messagesParity` 的"该给花括号加引号没加"那条守卫会把 `{count, plural, one {new feature} other {new features}}` 里臂内的 `{new feature}` 判成未加引号的占位符并报错，因为 `new feature` 既不是裸标识符、也不带逗号。写法上要么把臂保持单词、把修饰词提到 plural 外面（`"{count} new {count, plural, one {feature} other {features}}"`），要么给整个臂加引号。前者更干净，和 `roiCalculator.prCount` 的做法一致。

另两条：

- **拼进句子的片段不能只翻片段**。`LicenseExpiryBanner` 原本有一个 `describeCountdown(days)` 返回 `expires in 20 days` 之类的英文片段，再拼成 `Your LiteLLM Enterprise license ${countdown} (${date})`。中文里这两种语序不同，只翻片段必然拼出病句；正确做法是按分支取整句消息（今天到期 / N 天后到期 / 已过期三键），删掉那个片段函数
- **列表连接词与分隔符也是文案**。`describeRelease` 把三段用 `", "` 拼起来、并在第三段前加 `and`。要中文读得通就得把 `and` 和 `listSeparator` 各接一键，否则中文会变成"，以及 3 项其他更新"这种半中半英的句子

## 2026-10-17 第 145-146 簇：配置表键名化时让 id 或字段名本身当键名，别写查表函数

`CALLBACK_CONFIGS` 的 17 条描述与 `vectorStoreProviderFields` 的 31 个字段都是"数据表 + 文案"的结构。做法上可以写一个 `switch` 或映射函数把 id 翻译成 i18n key，也可以让 id（回调）与 `<provider>.<field>`（字段）**本身就是键名**。后者明显更好：不用维护查表函数，新增一条只改数据表一处，键名会同步出现在联合类型里，漏写会在 `t()` 上编译报错。联合类型还能按规则生成（遍历数据表收集 `label`、`tooltip`、`placeholder` 三个 part），不会出现"声明了 93 个键、目录里其实只有 90 个"的漂移。生成时记得 `placeholder` 只在该字段真的有占位符时才加进去，我第一版给每个字段都补齐三个 part，多声明了 3 个不存在的键。

三个坑：

- **批量重写数据表时多行字符串会留下孤儿行**。原有 9 处 `tooltip:` 是折行写的（第一行属性名、第二行只有字符串字面量），只按属性名过滤会删掉第一行却留下第二行，文件当场语法错误。除了这三种属性，还要顺手清掉只剩一个字符串字面量的续行
- **改数据表结构后，mock 了该模块的测试不会自动跟着对**。`CreateVectorStore.characterization.test.tsx` 自己 mock 了一份字段配置，字段从 `placeholder` 变成 `placeholderKey` 之后就静默失效（`placeholderKey` 是 `undefined`，要等 `getByPlaceholderText` 才报错）。改完数据表要 grep 一遍指向它的 `vi.mock`，把 mock 里的字段形状一起换掉
- **改 `t.rich` 或跨组件共享的文案后，要按目录重跑整包测试**。`vector-stores/_components/index.test.tsx` 早在第 137 簇就该红——那一簇把索引页说明段落改成了 `t.rich`，测试断言的还是英文原文，但第 137 簇只跑了 `DocumentsTable.test.tsx`、`IndexesTable.test.tsx` 与两条 i18n 守卫，没带上它；直到第 146 簇跑整包才发现

## 2026-10-16 第 119-126 簇：`as const` 是选项数组接翻译的前提

把一个选项数组从 `label` 改成 `labelKey` 之后，如果不加 `as const`，数组元素的 `labelKey` 会被推成 `string`，于是 `t(option.labelKey)` 报 `TS2345: Argument of type 'string' is not assignable to parameter of type 'NamespacedMessageKeys<...>'`。`npm run build` 的类型检查阶段能抓到，但 `npx vitest run` 的 `types` 项目有时不会（取决于 `AppConfig.Messages` 的类型增强是否命中该调用点）。所以凡是"数组里存 key、渲染时取文案"的写法，数组末尾一律补 `as const`：

```ts
const EXECUTION_OPTIONS = [
  { value: "enabled", labelKey: "executionEnabled" },
  { value: "disabled", labelKey: "executionDisabled" },
] as const;
```

另外，`Record<Metric, "metricRequests" | ...>` 这种显式联合标注也能达到同样效果，但 `as const` 更短，也和仓库里既有的 `PUBLIC_MODEL_HUB_SORT_KEYS` 写法一致。

## 2026-10-16 第 119-126 簇：删常量要 grep 全部引用

`ModelInsightsView.tsx` 里把 `METRIC_LABELS` 这个英文串映射换成 `METRIC_KEYS` 之后，只改了渲染处，忘了第 307 行的 JSX 里还有一处引用。运行时后果是整个组件抛错，但 vitest 只打一句 `An error occurred in the <ModelInsightsView> component`，DOM 是空的，报错文本里既没有变量名也没有行号，看起来像是组件自己返回了 null。定位花的时间比改动本身长得多。删任何一个模块级常量之前，先 `grep` 一遍确认零引用。

## 2026-10-16 第 111-117 簇：自建 Provider 树的测试会绕过默认 locale

`LiteAdmin.integration.test.tsx` 自己搭了一棵测试树，而不是用 `tests/test-utils.tsx` 的 `renderWithProviders`：

```tsx
<QueryClientProvider client={client}>
  <LocaleProvider>
    <Toaster />
    <AuthProvider>
      <LiteAdmin />
    </AuthProvider>
  </LocaleProvider>
</QueryClientProvider>
```

`LocaleProvider` 不带 `locale` prop 时跟随浏览器语言，在 jsdom 里就是英文。于是这份测试整份跑在英文目录下，把组件里的文案换成中文之后 17 例一起红。判断方法很简单：断言里如果出现过英文原文，先确认这份测试到底跑在哪个 locale。两条路子，要么把测试改成 `renderWithProviders`（默认钉 `zh-CN`）并把断言一并换成中文，要么保持英文断言但确认组件在英文下确实渲染英文。后者更省事，前者更一致。改之前先 `git checkout` 掉测试文件试一次，能省掉一整轮无效替换。

同类的还有 `GuardrailDetail.test.tsx`（自带未 pin locale 的 `LocaleProvider`）、`model_info_view.test.tsx`（自带 wrapper 但显式钉了 `zh-CN`）。凡是测试文件里自己 `import { LocaleProvider }` 的，都要在动手前先看一眼它 pin 的是哪个 locale。

## 2026-10-16 第 111-117 簇：同名文案撞查询

`cloudzero_export_modal.tsx` 的提交按钮文案随所选导出目标在两串之间切换，而目标类型切换里恰好也有一个同名选项，于是页面上同时存在两个 "Export CSV"，`getByRole("button", { name: "导出 CSV" })` 直接报 `Found multiple elements`。修法是给提交按钮单独开一个键（`exportCsvBtn`），哪怕英文值与选项文案逐字相同。判断标准很朴素：如果一个名字在渲染树上会同时命中两个可交互元素，就不能复用同一个键。

## 2026-10-16 第 93-109 簇新发现的五条

**用英文展示值当数据在用**（第 108 簇最典型）。`ToolPolicies` 的测试原本这样读策略值：`(cell?.textContent ?? "").replace(/[^a-z]/gi, "")`，靠剥掉圆点和箭头再与 `untrusted` 比较。这在翻译之前能work，因为选项的 `label` 恰好等于 `value`；标签一翻成中文，这条正则就再也匹配不到任何东西，而且失败信息会是"找不到 `untrusted`"，很容易被误判成组件坏了。修法是给控件加一个与语言无关的 `data-policy={value}`，断言改读它。凡是"界面上显示的字符串同时也是要断言的业务值"，都要先补一个语言无关的读取口，再翻译。同类的还有 `HealthChecksTableColumns` 里那几个排序用的 `NEVER_CHECKED` 常量，它们是后端原样下发的字符串，翻译它们会让排序断言在 `zh-CN` 下失效。

**派生值与展示值共用一个函数**（第 103 簇）。`shared/charts` 的 `formatCategoryName` 把 dataKey 机械地转成标题（`metrics.cache_read_input_tokens` → `Cache Read Input Tokens`），`CustomLegend`、`CustomTooltip` 与 `activity_metrics` 都调它。直接给它接翻译会同时破坏未登记 key 的兜底路径。做法是保留 `formatCategoryName` 作为纯函数，另加 `useCategoryName` hook：已知 dataKey 查 `chartLabels`，未知 key 走原来的机械转换，英文渲染因此逐字不变。

**中文同形导致的断言歧义**（第 103 簇）。`chartLabels.avgResponseTimeMs` 一开始译成"平均响应时间"，与卡片标题 `activityMetrics.avgResponseTime` 完全同名，于是测试里"图例里有这条"与"图例里没有这条"两个断言都无法区分。中文里给毫秒图例单独写成"平均响应时间 (ms)"既符合习惯也消掉了歧义。同一文件里 `chartLabels.totalTokens` 与 `activityMetrics.totalTokens` 也同名（"令牌总数"），靠所在容器区分，没有制造问题，但值得记住这种坑。

**同值键跨命名空间复用会引出隐性耦合**（第 105 簇）。`public_model_hub.test.tsx` 里手写的表格 harness 调列工厂，而列工厂现在需要 `t`。测试没有 `renderWithProviders` 提供的上下文，就用 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "modelHub" })` 直接构造。注意 `createTranslator` 的参数是 `{ locale, messages, namespace }` 这个对象，传裸 messages 会得到一个把键名原样回显的假翻译器（`t("colServerName")` 返回字符串 `"colServerName"`），症状是断言找不到英文原文，很容易误判成翻译没生效。

**并行的代价：共享文件的合并冲突**（第 96-101 簇）。多个 worktree 同时改 `en.json`/`zh-CN.json` 时，只要每个簇都在文件末尾追加自己的顶层命名空间，git 一定会把末尾判成冲突。这次用脚本做递归三方并集解决，键集互不相交时结果是两边的并集。`translators.ts` 这类追加型的 TS 文件则手工解。教训是：并行簇要保证新增内容落在互不相交的顶层命名空间上，否则并集脚本也救不了同键不同值。

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

## 2026-10-16 第 92 簇：共享组件的默认 `label` 怎么接键、动到存量脏文件顺手清

`components/common_components/Filters/` 的两个按钮把可见文案写在解构默认值里（`label = "Filters"`），两条值得固化：

- **通用组件的默认 `label` 接键：默认值放 `common`，写法用 `label ?? t(...)`**。这类组件被多处复用、调用方可能传也可能不传 `label`。把解构默认值 `label = "Filters"` 改成可选 `label`、渲染处 `label ?? t("filters")`，未传时走目录、传了则原样用。默认值文案进 `common`（通用兜底），不进某个特性命名空间。注意 `common` 已有 `filter`（单数 `Filter`）但没有复数 `Filters`，英文字面不同就要各开一键，别为了少建键拿单数顶替。相对地，`FilterInput` 的 `placeholder` 是调用方入参、组件自身无文案，就保持不挂 hook，别为了让"目录里每个文件都挂 hook"而硬接
- **动到一个文件时，顺手清掉它存量的 lint 错误，但要先确认是存量**。`OrganizationsPanel.test.tsx` 的 import 里有个一直没用的 `render`，HEAD 单跑 `npx eslint <该文件>` 就报 `unused-imports/no-unused-imports`、且没进 `eslint-suppressions.json`。既然本簇改了这个文件，就删掉它（一行、无行为变化），让"改动文件 eslint 干净"这句话成立。用 `git stash -u` 回基线单跑同一文件确认是存量，再决定删。若确认后是别处模块的账、又与本次改动无关，就别顺手动（判断办法见本篇开头"总则"）

## 2026-10-16 第 91 簇：新开顶层命名空间时如何复用 `common`、哪些位置能自己挂 hook

`components/CloudZeroCostTracking/` 是批次 24 里第一个自成一体的集成目录（新开顶层 `cloudZero` 命名空间），三条值得固化：

- **新开命名空间不排斥复用 `common.*`，但要再挂一把 `useTranslations("common")`**。`Cancel`/`Create`/`Update`/`Delete`/`Edit`/`Export`/`Actions` 以及状态回退 `Active` 在 `common` 里都是同值键，直接复用，别在新命名空间里复制一份同值叶子（复制会把"中英同值"计数推高、还把一句话拆成两处维护）。代价是同一文件里出现两个 translator：`const t = useTranslations("cloudZero")` 取专属文案，`const commonT = useTranslations("common")` 取通用按钮，与 `PassThroughSettings`、`PluginSettings` 的既有写法一致。判据仍是"概念与取值都相同就复用"
- **能自己挂 hook 的位置比想象的多**：`React.forwardRef` 的渲染函数就是组件体（`CloudZeroApiKeyInput` 在里面对 `useTranslations("cloudZero")` 取显隐按钮的两条 aria），模块级、无参、只渲染一处文案的函数组件也在自身挂 hook（本簇的 `NotConfigured`）。真正的边界只有"非 React 组件的纯函数"（工具函数、列定义工厂、`label`/`hint` 拼装函数），它们才走首参/入参 `t`。所以给一个目录接线时，先按"它是不是组件"分堆，组件一律就地 `useTranslations`，别把 `t` 当 prop 层层往下传
- **`npx tsc --noEmit` 在本仓库基线本就大面积报错**（本簇实测 880 条，几乎全落在存量 `*.test.tsx`，如 `src/utils/returnUrlUtils.test.ts` 缺 vitest 全局、`tests/top_key_view.test.tsx` 夹具字段不全）。这不是本簇引入的，判断有没有净增要 `git stash -u` 回基线跑同一命令比条数（本簇前后都是 880）。日常只报"非测试文件 0 错"，真正的类型门禁是 `npx vitest run` 里 `types` 项目那行 `Type Errors  no errors`。若碰巧改到的测试文件本来就有 `getByText(string | null)` 之类的存量类型错（本簇 `CloudZeroIntegrationSettings.test.tsx` 即两处），照旧保留、不必顺手改

## 2026-10-16 第 87-90 簇：子串碰撞的标签查询、非组件工具的翻译入参、`render(` 全局替换误伤 `rerender(`

`Settings/AdminSettings/` 家族最后四个目录（`PluginSettings`、`WebSearchInterceptionSettings`、`MCPSemanticFilterSettings`、`MCPToolSearchSettings`）收口时踩到三条：

- **`getByLabelText(regex)` 会同时命中 `aria-label`，当心子串碰撞**。`PluginSettings` 的密钥字段 `<label>插件密钥</label>` 与显隐按钮 `aria-label="显示插件密钥"`/`"隐藏插件密钥"` 都含"插件密钥"，`getByLabelText(/插件密钥/)` 报 `Found multiple elements`（`getByLabelText` 按子串匹配正则，且把 `aria-label` 也算作标签）。英文原文 `Plugin Key` 与 `Show plugin key` 因大小写不同没这问题，译成中文后子串关系才暴露。修法是把查询改成精确串 `getByLabelText("插件密钥")`（字符串按全等匹配）或锚定正则 `/^插件密钥$/`。同理要留意任何"字段名是另一个按钮名子串"的标签
- **非组件模块的 toast 文案接翻译，用入参加 `t`，测试用 `createTranslator` 读真实目录**。`semanticFilterTestUtils.ts` 的 `runSemanticFilterTest` 不是 React 组件、不能挂 hook，按第 55/62/73 簇的首参翻译器约定给它加 `t: AdminPanelTranslator` 入参（本函数收单个 options 对象，就加进对象里）。类型取 `lib/i18n/translators` 的具体 translator（`AdminPanelTranslator`），别用裸 `ReturnType<typeof useTranslations>`。单测里用 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "adminPanel" })` 造一个真翻译器传进去，断言直接读真实中文，既测了目录又不依赖 provider。与它同簇的 `SaveSuccessAlert` 相反：那是模块作用域里的 React 函数组件，就在自身函数体内挂 `useTranslations`，别把 `t` 当 prop 往下传
- **批量替换 `render(<X` 会误伤 `rerender(<X`**。给 `WebSearchInterceptionSettings.test.tsx` 换 `renderWithProviders` 时，脚本把 `rerender(<WebSearchInterceptionSettings />)` 里的子串也换成了 `rerenderWithProviders(...)`，运行时 React 报错、3 例全红。规矩是替换前先数一遍、把 `rerender(` 排除在外，或替换后 `grep -n "rerenderWithProviders"` 复查

顺带一条 ICU 事实（本簇两处用到）：直引号 `"` 在 ICU 里不是特殊字符，`"FX"` 原样输出；而 `'<key>'`/`'<name>'` 里的 `'` 后跟 `<` 会触发引号引用、把尖括号转成字面量，正好用来在消息里写字面 `<key>`。两者都要用 `intl-messageformat` 实跑确认渲染结果

## 2026-10-16 第 86 簇：枚举标签与 `common` 通用词同值同义就复用，一处文案兼多角色只建一键

`UserBannerSettings` 的严重程度三档原来是模块级 `SEVERITY_LABELS` 里的 `Info`/`Warning`/`Error`，同时充当可访问名与可见文案。两条值得固化：

- **枚举标签若与 `common` 里的通用词同值同义，优先复用而不是新建**。目录里 `common.info`/`common.warning`/`common.error` 早有同值键，只是全仓查不到调用点。判据回到本仓库一贯的"概念与取值都相同就复用"：三档就是同一组级别词，直接 `tc("info")` 复用，不新建 `severityInfo` 之类。表声明成 `Record<UserBannerSeverity, "info" | "warning" | "error">`（值的联合写死，别退化成 `string`），遍历时 `tc(SEVERITY_LABEL_KEYS[severity])` 既能按枚举查表、又把 `t()` 入参锁死在 `common` 键上。反之新建键会多出三条与 `common` 逐字相同的叶子，把"中英同值"计数推高却没有任何收益
- **同一段文案在同一处兼作 aria、可见 `Label`、`SelectValue` 占位时只建一键**。本簇 `Publish user banner` 同时是 `<Switch aria-label>` 与可见 `<Label>`，`Severity` 同时是 `<Label>` 与 `<SelectValue placeholder>`，英文原文逐字一致，各建一键（`publishSwitch`、`severityLabel`）在多个渲染点 `t(...)` 同一个键即可。这与第 84 簇"同一句话拆成两段就是两种文案"是相反的两面：那里断句不同必须分键，这里逐字相同就该合并

顺带补 ICU 一句：placeholder 里的 Markdown `**…**`、`[文字](url)`、`:` 都不是 ICU 语法，只有 `{}` 才是，所以这类示例文案照原文翻译即可，不必给 `[]` 或 `**` 加引号（加了反而会多印出 `'`）

## 2026-10-16 第 85 簇：字段说明"接口优先、兜底接键"，`as const` 的键名表按查表方向选

`Settings/AdminSettings/LoggingSettings/LoggingSettings.tsx` 的五个可选旋钮把 label、placeholder 与说明都写死在模块级 `OPTIONAL_FIELDS`，其中说明还经 `describeField(name, fallback)` 优先取后端的 `field_description`。两条值得固化：

- **字段说明是"接口值优先、本地兜底接键"**。`describeField` 命中后端 `field_description` 就用它（那是数据，随代理版本回显英文，不进目录），只有没命中才回落写死的 `fallbackTooltip`，所以只有兜底那一段接键：`describeField(field.name, t(field.tooltipKey))`，父组件的 `describeField` 不必再持有文案。判据与第 60 簇 `property?.description ?? t(...)`、第 57 簇把默认参数值挪到渲染处同源：**凡是"外部数据 ?? 本地兜底"的取值，只给本地那半边接键**。反过来把后端值也塞进目录，就成了给一个不受我们控制的字符串找键
- **同一根 `as const`，按查表方向决定用不用**。第 83 簇记的是"按任意 `string` 查表的表不能用 `as const`"（要拿 `role`/`selectedProvider` 当键去查，对象没有索引签名）；本簇 `OPTIONAL_FIELDS` 恰恰相反，遍历出来的 `field.labelKey` 直接喂 `t()`，`as const` 让每个键成为字面量联合、逐个被目录类型检查，写错编译期红。规矩补全成：**遍历喂 `t` 的表用 `as const`，按外部 `string` 当键查表的表用显式 `Record<string, 联合>`**

顺带记两条小账：`Saving...` 复用 `common.saving` 需要在表单里再挂一把 `useTranslations("common")`（同第 80 簇 `AddSSOSettingsModal` 的两把 translator），不为省一把 translator 去建同值的 `savingButton`；spinner 的 `aria-label="loading"` 是技术标识不接键，与既有 `ChangePasswordForm`/`LoginPage`/`OnboardingFormBody` 保持一致

## 2026-10-16 第 84 簇：同一句话拆成两段就是两种文案，带 `{error}` 的消息别往无参调用点上套

`components/SSOModals.tsx` 是 admin 面板那套老 SSO 弹窗（与 `Settings/AdminSettings/SSOSettings/Modals/` 的新弹窗并存，由 `AdminPanel.tsx` 挂载），标题、五颗按钮、四条 toast、清除确认弹窗与四步说明弹窗全是英文字面量。接线时新建 11 键，另有 9 处直接复用既有键（`addModalTitle`/`editModalTitle`/`deleteConfirmTitle`/`clearSuccessToast`/`saveFailedToast` 与 `common.save`/`cancel`/`done`/`clear`），但"能回溯"不等于"能复用"。四条值得固化：

- **同一句话在不同文件里断句不同，就各建一键，别拼**。`SSOModals` 的确认弹窗是两个 `<p>`：`Are you sure you want to clear all SSO settings? This action cannot be undone.` 与 `Users will no longer be able to login using SSO after this change.`；第 80 簇的 `deleteConfirmBody` 把第二句和"确定要清除吗"合成了一句，`cannotUndo` 又是独立一条。三条既有键都只覆盖了一半，用 `{t(a)} {t(b)}` 拼出来的英文与源串对不上（多一个空格、少一个问号），跨语言还可能要换语序。规矩与第 82 簇"必填整句别参数化"同源：**整句进一个键**，本簇因此建 `clearConfirmBody` 与 `clearLoginWarning`，中文各自整句落 `此操作不可撤销。` 与 `更改后用户将无法再通过 SSO 登录。`，与 `cannotUndo`/`deleteConfirmBody` 按模块重复记账
- **带 `{error}` 的消息不能复用于不报详情的调用点**。既有 `clearFailedToast` 是 `Failed to clear SSO settings: {error}`，而 `SSOModals.handleClearSSO` 的 catch 只 `console.error(error)` 后 toast 一句不带详情的 `Failed to clear SSO settings`。套过去要传 `{ error: "" }`，英文会留下尾冒号、中文留下尾冒号，两边都改了原串。所以另建 `clearFailedToastWithoutError`，反过来 `handleFormSubmit` 那句 `"Failed to save SSO settings: " + parseErrorMessage(error)` 与 `saveFailedToast` 逐字一致（含 `: ` 分隔），直接带参复用。判据是**先比英文是否逐字相等，再比参数占位是否一致**，两者都过才算复用
- **带序号的步骤，序号留在消息里**。目录里已有先例（`vectorStores.step1` = `Step 1: Upload Documents` → `步骤 1：上传文档`），本簇 `instructionStep1..4` 照此把 `1.` `2.` 写进值里，JSX 不做手工编号。否则编号进了结构，翻译要负责调序号、屏幕阅读器朗读顺序也会跟着散
- **老弹窗的说明流一条断言都没有**。`isInstructionsModalVisible` 由 `AdminPanel` 控制，`SSOModals.test.tsx` 十个用例全走 `false`，那五个 `<p>` 与 `Done` 按钮从来没被渲染过。汉化把它接上时补一条用例钉住标题、引导句与四步全文，并用变异验证确认它会红（把 `instructionStep2` 换成 `instructionStep4`，报 `Unable to find an element with the text: 2. 新开一个标签页，访问你的代理基础 URL`）。补文案簇碰到"这片渲染根本没有断言"时，值得为覆盖加用例，和"配置守卫该不该加"是两套判据

顺带记一笔没动的债：`SSOModals.tsx` 自带一份 `detectSSOProvider` 与一份 clear payload 手搭逻辑，和 `SSOSettings/utils.ts` 的同名实现重复（字段集合已不一致，老的少 `team_mappings`），新弹窗走 `useEditSSOSettings` hook、老的直连 `updateSSOSettings`。合并两套 SSO 弹窗属于功能重构，不该混进汉化簇


## 2026-10-16 第 83 簇：数据模块改接翻译要回溯渲染处的拼装规则，按键名查表的表别用 `as const`

`SSOSettings/constants.ts` 的两张展示名表（五个 provider、四个默认角色）是这一片 SSO 文案最后的英文来源，接键之后连带影响三个消费方与四份测试。三条值得固化：

- **按任意 `string` 查表的键名表不能写成 `as const`**。第 82 簇那三列键名是把具名联合写在字段声明上，本簇两张表要拿接口回来的 `role`、`selectedProvider` 当键去查，`as const` 的对象没有索引签名，`obj[someString]` 是隐式 any（旧写法 `Record<string, string>` 能过就是靠那个索引签名）。规矩补一句：值的联合显式命名（`SSOProviderNameKey`、`DefaultRoleNameKey`），表声明成 `Record<string, 那个联合>`，既能按 string 查，又把 `t()` 的入参锁死在目录键上，写错的键仍旧编译期红
- **展示名进了消息目录，渲染处拼出来的 alt 会跟着变**。`Logo` 的 `alt` 是由模板串把 `name` 与 ` logo` 拼出来的，label 一换语言 alt 就换。改断言前先回溯这条拼装规则：本簇四个品牌名按 GLOSSARY"product 名保留英文"落得与英文逐字相同，所以 `getByAltText("Google SSO logo")`、`getByText("SAML SSO")` 和字母头像的 `getByText("O")` 零改动；唯一改了值的"通用 SSO"恰好没有 logo（`ssoProviderLogoMap.generic` 是空串），只沾到 `queryByAltText("Generic SSO logo")` 那条负向断言，中文下仍旧成立。反过来，若 generic 哪天配了 logo，`/通用 SSO/` 与那条 alt 断言就得一起动
- **同一个角色在两处英文不同串，必须分键**。表单里第 82 簇建的 `roleAdminViewer` 是 "Admin Viewer"，`defaultRoleDisplayNames` 的 `proxy_admin_viewer` 是 "Proxy Admin Viewer"，差两个词也是不同文案，不能为省一个键去改英语原文。落两条键，中文分别"管理员（只读）"与"代理管理员（只读）"，按分组内重复记账，不做跨串合并

顺带留一条"要不要补配置守卫"的判据。第 82 簇那条守卫值得加，因为漏配 `requiredKey` 会**静默**退化成 zod 自己的通用英文消息；本簇漏配一个展示名，兜底会把原始 id（`google`、`internal_user_viewer`）直接渲染出来，肉眼和测试都看得见，而五个 provider 与四个角色的中文串已分别被下拉断言和 `RoleMappings.test.tsx` 的四条用例钉住，就不再补一条只查配置表结构的用例

## 2026-10-16 第 82 簇：配置表改收键名要给可选字段补守卫、必填整句别参数化

`BaseSSOSettingsForm.tsx` 把五个 provider 的字段清单写在模块级 `ssoProviderConfigs` 里，label、必填消息、placeholder 三列都是英文字面量。接线没有把 `t` 传进模块作用域（hook 不能在模块顶层调用，见第 71 簇），而是把这三列换成三个受限的键名联合类型（`FieldLabelKey`/`FieldRequiredKey`/`FieldPlaceholderKey`），由渲染点 `SSOProviderField` 和 schema 工厂 `buildSSOSettingsSchema(variant, t)` 各自 `t(key)`。配置表从"英文文案表"变成"键名表"，写错的键在编译期就红（`t()` 的入参是目录键的联合类型），比运行时回显全键路径早一步

两个坑值得固化：

- **`requiredKey` 设成可选就开了一个静默洞**。schema 工厂里那段循环是 `if (field.required === false || !requiredKey) return;`，必填字段忘配 `requiredKey` 不报错，只退化成 zod 自己的通用英文消息。补一条配置守卫：`ssoProviderConfigs` 里 `required !== false` 且 `requiredKey === undefined` 的字段名集合必须为空。守卫要变异验证才算数——临时摘掉 `google_client_id` 的 `requiredKey`，它报 `expected [ 'google_client_id' ] to deeply equal []`，装回去转绿。本就 `required: false` 的可选字段（`generic_scope` 与四个 saml 字段）不会被误伤
- **必填整句别用一条带 `{field}` 参数的通用消息**。`请输入 {field}` 这类写法只有两条出路，都不对：把英文改成 Title Case 的 `Please enter the {field}`，与源码里逐字小写的 `Please enter the google client id` 不再是同一串，破了"英语原文逐字不动"；或者在中文句子里塞进 ASCII 小写字段名，产出 `请输入google 客户端 id`。参数化换来的仅是 10 个键收成 1 个键加一份字段名映射，而中英 placeholder 集合一致本就是守卫要求，不值当。规矩：源串是从代码里逐字抠出的整句，就一句一键

第 79 簇那条"看文案来自组件还是数据模块"在本簇复用：provider 下拉项名字与 `Logo` 的 `alt` 仍取 `constants.ts`，所以 `/google sso/i`、`getByAltText("Google SSO logo")` 这些断言原样留英文，同文件的 label 断言改中文

顺带一条 harness 迁移细节：`tests/test-utils` 在 `src` 之外（`ui/litellm-dashboard/tests/`），`src/components/SSOModals.test.tsx` 里要写 `../../tests/test-utils`。按 `src` 内的直觉写成 `../tests/test-utils` 会撞 vite 的 `Failed to resolve import`，整个文件 0 例装载，报错还不指向 locale provider

## 2026-10-15 第 81 簇：拼接脚本"先写盘后校验"会把坏 JSON 落盘

往目录批量追加键的拼接脚本，第 81 簇第一版把行末逗号写进了**行字符串本身**（`'      "editModalTitle": "Edit SSO Settings",'`）又用 `",\n".join(lines)` 连接，产出 `,,` 双逗号——而 `json.loads` 校验放在**写盘之后**，坏 JSON 已经落盘才发现，只能 `git checkout --` 还原重拼。规矩两条：**行字符串一律不带尾逗号**（逗号只由 join 的分隔符与 extra 的前导 `,\n` 提供）；**先在内存里 `json.loads(new)` 校验、断言键数，全过再落盘**。另外 extra 末尾的 `"\n"` 会在最后一个键与闭合 `}` 之间留一个空行——JSON 合法但难看，拼完顺手把 `"\n\n    }"` 收成 `"\n    }"`

同簇还确认一条 ICU 行为：`t("key", { error: parseErrorMessage(error) })` 在入参为 `undefined` 时**渲染为空串**（旧写法 `"前缀: " + parseErrorMessage(error)` 会把字面 `undefined` 三字透给用户）。从字符串拼接迁到 ICU 带参，断言要按新渲染更新：`undefined` 用例期望值从 `${PREFIX} undefined` 改为 `PREFIX` 本身，拼接处自带的空格（`": "`）改全角冒号后消失，`${PREFIX}Parsed error message` 不再补空格

## 2026-10-15 第 79 簇：`t()` 调用撑破 printWidth、模块级"子组件"各挂各的 `useTranslations`

`SSOSettings.tsx` 的字段配置本是单行的 `{ label: "Proxy Base URL", render: … },`（111 字符，printWidth 120 内）。把 `label` 换成 `t("ssoSettings.proxyBaseUrl")` 后这行涨到 128、越界，`prettier --list-different` 直接点名该文件——**接线把短字面量换成 `t("ns.key")` 调用，行数不减、宽度反增，落码后必须重跑 prettier**。确认 HEAD 是否本就 clean：把 `git show HEAD:./$f` 落到**仓库内**兄弟名（如 `…/head79check.tsx`）再 `--list-different`，`/tmp` 会因脱离项目根而丢 `.prettierrc` 解析；HEAD clean 就 `--write` 让它拆超长行，HEAD 不 clean（如两个消息目录）就别动、只手工保证新行合规

`NotConfigured`、`EndpointValue` 这类定义在组件文件**模块作用域、但本身是 React 函数组件**（返回 JSX、被当 `<X/>` 渲染）的小件，要用 `t` 就在它们各自函数体内 `const t = useTranslations("adminPanel")`——组件挂 hook 合法，不必从父 `SSOSettings()` 把 `t` 当 prop 往下传。与"纯函数"分清楚：`serializeRouterConfig` 那种非组件的模块函数才走首参 translator 约定（见第 62/73 簇），别把两者混为一谈

provider 展示名（`ssoProviderDisplayNames` 的 "Google SSO"/"SAML SSO"）连同 `Logo` 的 `alt` 由 `${label} logo` 拼出（如 "Google SSO logo"），均来自 `constants.ts` 的数据、按"数据模块留待专簇"不动。于是同文件里 `getByText("SAML SSO")`、`getByAltText("Google SSO logo")` 保持英文断言，而 heading/按钮/徽标改中文。判断某断言改不改，看那句文案是**组件自身的框架文案**还是**从数据模块取的值**——后者接线前先回溯来源，来源没翻就别跟着翻断言

## 2026-10-15 第 78 簇：同缩进的兄弟块只看缩进会插错父级

给 `adminPanel` 加 `ssoSettings` 子命名空间时，第一版锚点写成"`pageVisibility` 的 `reset` 行 + `}` + `}` + `},`"。看着是"在 `uiSettings` 那块后面插"，实际落在 `adminPanel.uiSettings.ssoSettings`——因为 `uiSettings`（4 空格）与它内部的 `pageVisibility`（6 空格）各有一个 `}`，`pageVisibility` 的 `}` 与 `uiSettings` 的 `}` 是**不同缩进的相邻两行**，而真正要插入的层级是 `uiSettings` 的 `}` **之后**（与 `uiSettings` 同层、在 `adminPanel` 内）。锚点只到 `      }\n    }\n  },` 就分不清这两层

症状很有辨识度：组件测试把 `t("ssoSettings.configureSso")` 渲染成**裸键** `adminPanel.ssoSettings.configureSso`（next-intl 找不到就回显全键路径），而不是抛错。此时守卫可能是绿的——因为 `missingKeys` 只查"代码引用的键在 scope 里存不存在"，若接线前先跑守卫（键还没被引用）就查不出来

规矩：往顶层命名空间里加**兄弟**块时，锚点必须含**下一层级的兄弟行的开头**（本项目是 `  },\n  "usage": {\n    "title": `，比 `pageVisibility` 的 `}` 低一层），落表后用 `json.load` 断言 `d["adminPanel"]["ssoSettings"]` 存在且键数正确，而不是只看 JSON 合法——合法 JSON 插错父级一样合法

测试里 `queryByText("<英文空态语>")` 这类**负向**断言（断言某文案不存在）在文案翻中文后会**假绿**：英文串永远查不到。翻文案时要把这类负向断言一起翻成新串，否则测的是"这句话不存在"这件恒真的事

## 2026-10-15 第 77 簇：复用已有命名空间、兜底语义回调用点、ICU 入参不接受 null

`price_data_reload.tsx` 挑中它是因为它**已经有一把 `useTranslations("models.priceData")` 的消费者**（`PriceDataManagementTab.tsx`）。补一体文件时先看命名空间在不在：在，就沿用同一把、只补净新键（本簇 3→48），省掉新建命名空间与消费者同步两件事。别一见新文件就开新命名空间

模块级纯函数里的硬编码英文兜底值，翻不动就先改语义、把决定权交回调用点。`formatDateTime` 原本 `if (!dateTimeString) return "Never";`——"Never" 是英文、且函数在模块级拿不到 `t`。改法是 `return null`，调用点各自 `?? t("never")`。改完要按**调用点是否已受保护**逐个过一遍：`CostMapProvenanceRows` 里那处外头有 `sourceInfo.loaded_at &&`，`?? t("never")` 是死分支、要删；状态卡的 "Last run" 行没有保护，必须补兜底否则空态从 "Never" 变成空白（静默回归，测试不一定会抓）

next-intl 的 ICU 入参类型不收 `null`：`t("scheduledEvery", { hours: reloadStatus.interval_hours })` 里 `interval_hours: number | null`，`tsc` 报 TS2322 `Type 'number | null' is not assignable to type 'string | number | Date'`，基线 880 → 881。补 `?? ""` 即回到 880。`number | ""` 这种联合天然合法，不用动

`buttonText = "Reload Price Data"` 这种**带英文默认值的可选 prop**，改成可选 `buttonText`、体内 `const reloadLabel = buttonText ?? t("reloadButton")`；消费者本就传 `t("reloadButton")`，行为不变。同一个 handler 里重复出现的同一句 toast（本簇三处 `"No access token available"`）用一个键一次替换（`Edit` 的 `allow_multiple`），别逐个手改

zh 目录里给标签配的**全角冒号**（`源修订版本：`/`ETag：`/`加载时间：`）会原样进 DOM，测试断言要跟着写全角 `：`，不是 ASCII `:`——这类"看着一样、字节不同"的差是断言翻中文时最容易漏的一类

## 2026-10-15 第 76 簇：`??` 兜底改中文，测试里的可访问名却仍来自 mock；裸 `render` 要换 harness

`UISettings.tsx` 的开关写成 `ariaLabel={property?.description ?? t("…")}`：兜底串翻成中文，**并不决定测试里的可访问名**。只要 mock 的 `field_schema.properties.*.description` 有值，`Switch` 的 `aria-label` 就取自那段 mock 英文串，故 `getByRole("switch", { name: "Disable model add for internal users" })` 要保持英文；同一个组件里随 `t` 变中文的只有卡片标题与 toast。判断开关断言改不改，先看 mock 的 schema 给没给 description，别看到兜底串翻了就跟着翻

给组件挂 `t` 前先看测试用的哪个 `render`。`useTranslations` 需要 `NextIntlClientProvider`，本仓库把 provider 挂在 `LocaleProvider` 里、只由 `tests/test-utils.tsx` 的 `renderWithProviders` 装配；`UISettings.test.tsx` 原本是裸 `render`，直接挂 `t` 会抛 "No intl context"。规则：凡把裸 `render` 的组件接上 `t`，先把 `render` 换成 `renderWithProviders`、import 改从 `@/../tests/test-utils` 借出（它 re-export 了 testing-library 的全部），再改断言——`renderWithProviders` 默认钉 zh-CN，翻成中文的文案随之断言

家族补完照既有子命名空间写：`adminPanel` 里 `teamAdminEditable` 是早就存在的嵌套对象，新加的 `uiSettings` 照它的"对象套对象"写法，调用走 `t("uiSettings.pageVisibility.title")` 点号路径，不用给子组件 `PageVisibilitySettings` 再开第二把 `useTranslations`。`getAvailablePages()` 返回的 `label`/`description`/`group` 是英文数据（同 `vector_store_providers` 一类），本轮只翻组件自身的框架文案，分组名与勾选名留英文

## 2026-10-15 第 75 簇：页签文案、URL 契约与跨文件 label 的边界

补完一个已接入的家族时，先数清命名空间里已有什么。`organization_view.tsx` 需要的串里有 20 个在 `organizations` 与 `common` 里已经存在（同一家族前几个文件留下的），只补了真正缺的 24 个净新键。硬翻一遍会凭空造出重复键

页签要分清"显示文案"和"取值"：`<TabsTrigger value="members">{t("members")}</TabsTrigger>`——`value` 是 `useUrlTab`/`?org_tab=` 的 URL 契约，不能动；动的只是文本。但 Radix 的 `TabsContent` 用 `aria-labelledby` 指回触发器，所以页签文案一改，**面板的可访问名也跟着改**，测试里 `getByRole("tab", { name })` 和 `getByRole("tabpanel", { name })` 要一起换

`getByLabelText(/Organization Name/i)` 这类查询可能落在**另一个还没接入的文件**上：本视图的编辑态渲染的是 `org-settings/OrgSettingsForm.tsx`，它的 `label="Organization Name"` 仍是英文，所以这条断言保持英文、与本簇无关。改测试前先确认查询命中的是哪个组件，别把别人的账算到自己头上

## 2026-10-15 第 74 簇：图表桶标签的生成键与查找键必须同源

`user_agent_activity.tsx` 的堆叠柱状图不直接渲染接口数据，而是先"铺满空桶再回填"：`generateWeeklyChartData` 先生成 7 个 `{ week: ... }` 条目，再用 `wauData.results.forEach` 按 `chartData.find((d) => d.week === weekLabel)` 回填。接口返回的 `date` 是英文（如 `"Week 1 (Jul 27)"`），桶标签由 `/Week (\d+)/` 抽出序号后拼出。把桶标签改接翻译时，**生成键和查找键必须走同一个 `t(...)` 调用**——两边都改成 `t("weekBucket", { n })` 才能让 `find` 命中；只改生成侧不改查找侧，`find` 会安静地返回 `undefined`，图表不报错、只是全为 0，很难从测试里一眼看出。月度桶（`monthBucket`）同理

接口返回的 `date` 仍是英文原文，故抽取序号的 `/Week (\d+)/`、`/Month (\d+)/` 正则保持不变——翻译的是"桶标签的展示形态"，不是后端契约

组件级默认缩写（DAU/WAU/MAU 三个内层页签、外层 `"DAU/WAU/MAU"` 页签）按仓库惯例保留英文；测试断言只对随 `t` 变的文案改中文，被 mock 的 `PerUserUsage` 与接口 `date` 数据保持英文

## 2026-10-15 第 73 簇：共享 helper 的形参与 translator 依赖

一个被多处复用的格式化 helper 要接翻译时，最容易顺手把 `t` 追加成第 N 个形参。`keyEditFieldNormalizers.ts` 的 `currentValuePlaceholder(premiumUser, current, premiumHint, emptyHint, t)` 就是这样——`max-params`（上限 4）直接报 ERROR。改法不是关规则，而是把同类字符串收进一个对象：`(premiumUser, current, hints: { premium, empty }, t)`，形参回到 4 个，调用点也更清楚

模块级常量持有文案时，改成接收 translator（或接收 `messages` 对象）的工厂：`keyEditFormSchema`→`buildKeyEditFormSchema(estimateMessages)`、`estimateRules(messages)`、`estimateTooltips(canEdit, t)`。这和第 59、71 簇把列定义/schema 改成工厂是同一类改法

`useEffect` 里从写死英文改成调 translator 后，`react-hooks/exhaustive-deps` 会立刻报"缺依赖"。**别用 disable 注释压**：`use-intl` 的 `useTranslations` 内部是 `useMemo(() => createBaseTranslator(...))`，返回的引用在一次挂载内稳定，把它补进依赖数组既消警告又不会造成重跑

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
