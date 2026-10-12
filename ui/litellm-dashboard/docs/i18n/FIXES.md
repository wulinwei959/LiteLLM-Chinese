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

`en.json` 与 `zh-CN.json` 是 **CRLF** 行尾。`JSON.stringify(x, null, 2)` 输出的是 LF，直接写会让整个文件显示为全部改动，几百行的真实改动淹没在几千行的行尾噪音里。写之前先探测行尾再拼回去

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

基线是 928 条、60 个文件（2026-10-12 实测）

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

## 2026-10-12 四族清零：229 例断言同步的踩坑记录

projects（82）、prompts（56）、agents（55）、cost-tracking（36）四个路由收口时，除了常规的"断言停在英文"，还踩到几类值得记的坑：

- 以旧英文串为锚的测试辅助函数会静默失效。`multi_cost_results.test.tsx` 的 `shownBreakdown()` 找的是上游时代的硬编码标记 `Total/Request`，翻译接入 `t("totalPerRequestShort")`（渲染"合计/请求"）后它永远返回 null：两条"隐藏态"断言假绿、两条"可见态"断言报错。改键之前先搜测试里的辅助函数，别只搜断言本身。`ProjectsPage.test.tsx` 的 `queryByRole("heading", { name: /projects/i })` 同理，翻译后变成真空断言，本次一并改成 `/^项目$/`
- 同一表单的两种变体翻译进度可能不一致。agents 编辑器里 agent_name 标签在静态表单是硬编码英文、在动态表单已是 `t("agentName")`，测试断言哪种语言都会有一半走不通；修法是给静态表单补接既有键（`agentName` / `nameFieldHint` / `nameRequired`），而不是让断言迁就半成品
- "键已存在但调用点没接"是常见残留。`AgentsTableColumns` 的 meta 里已有 `t("colAgentName")`，header 却写死英文；同理 agents 面板标题、表单标签都有"目录有键、调用点写死"的情况。碰到"界面是英文但目录里明明有键"时先确认是不是这一类，接上即可，不用加新键
- 面板级翻译不完整会产生"标题中文、字段英文"的混排（agents 的 capabilities / optional / cost / auth headers 面板都是这样）。断言同步时逐串确认该串在源码里是 `t()` 还是硬编码：`t()` 的改为中文断言，硬编码的保持英文断言，并在提交信息里记下边界
- 批量改断言时把消息值从 `zh-CN.json` 读出来生成替换串，不要手抄。"请求头名称（如 Authorization）"的全角括号、"移除中…"的省略号、ICU 里的 `{name}` 占位符，手抄一次错一次；用脚本取值替换，一步到位
- `findByLabelText` / `getByLabelText` 前缀不同，替换模式写 `getByLabelText(...)` 会漏掉 `findByLabelText(...)` 的那些行。替换后按 `ByLabelText(` 之类的后缀再扫一遍兜底

## 批次 24 硬编码英文欠账清单

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

guardrails 这一轮定了一条翻译边界：面向读者的散文（标签、注释、公式、空态）翻，机器可读的样例不翻。保留英文的四类：`usageUnits.ts` 的 `pricingIssueUrl`（预填 GitHub feature request，`title`/`the-feature` 面向上游维护者）、`TeamGuardrailsTab` 的示例 URL `https://your-guardrail-api.com/v1/check` 与两段 JSON 示例 placeholder、`CustomCodeModal` 的 Python 模板与 `{"texts": [...]}` placeholder、YAML 片段里的配置值（`fail_closed`、`os.environ/...`）。与 `TeamInfo.tsx` 的 `{"gpt-4": 4096}` 同一处理，改动时不要顺手翻

分页脚这一行对应两个文件：公开的 `public_model_hub.tsx` 与登录后的 `AIHub/ModelHubTable.tsx`，`Showing {n} of {m} ...` 各写了一份，改了一处必须搜另一处。三个键进新的 `modelHub` 命名空间，英文侧用 ICU plural（`one {# agent} other {# agents}`），中文侧直接写 `{shown}` 与 `{total}`，不加 plural。注意两个组件其余文案仍是英文，`modelHub` 只覆盖这三条脚注，批次 24 扫到这两个文件之前，这两页是混语状态

翻译会顶破 `max-lines`（800 行，跳过空行与注释）。`CustomCodeModal.tsx` 在 `83899df` 从 782 涨到 805，此后 `npx eslint <该文件>` 一直报 `max-lines` error。`eslint-suppressions.json` 是上游快照带来的批量豁免基线（19 个文件带 `max-lines` 豁免，含 `TeamGuardrailsTab.tsx`），不要往里追加新豁免；修法是抽块，本次把组件内的 `TEST_INPUT_EXAMPLES` 常量挪到 `custom_code/testInputExamples.ts`（89 行），文件回到 780 行。另外 `eslint --stdin` 不套用批量豁免，报出的 error 会比按文件跑多（本例 8 对 1），核对以按文件跑为准

另有两处结构性注意事项。`templates/KeySavingsTab` 的 SummaryCard testid 由译文经 `slugOf(label)` 派生（如 `summary-card-压缩节省`），testid 随 locale 变化，改译文即改 testid，断言勿按英文 testid 写死。三个测试（`view_logs/RequestLogsPanel`、`organization/organization_view`、`model_info_view`）用自定义 `wrapper` 覆盖 Provider，已在 wrapper 内嵌 `<LocaleProvider locale="zh-CN">` 保住中文渲染，后续改造时不要丢掉这一层

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
