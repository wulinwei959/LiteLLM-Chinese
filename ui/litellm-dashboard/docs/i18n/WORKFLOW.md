# 实施步骤

这一篇是动手时照着做的清单。背景与原理见 [ARCHITECTURE.md](./ARCHITECTURE.md)，出问题查 [FIXES.md](./FIXES.md)

## 单批执行流程

### 第一步：通读组件树，列字符串

先把这一批涉及的组件树读一遍，把面向用户的字符串全部列出来，再设计键集。不要边读边加键，那样会得到一批语义重复的键，比如同一个 "Save" 在三个文件里被加了三次

读的时候注意区分三类字符串。面向用户的文案要翻译；纯逻辑标识（`id`、`data-testid`、事件名）不碰；拼给后端的值不碰

### 第二步：同时给两侧加键

`en.json` 与 `zh-CN.json` 必须同时加，键树保持一致。加完立刻跑 `messagesParity.test.ts`，不用等组件改完

用脚本插入时锚点要取整行或相邻两行成对，不要只匹配键名。`"mcpLabel": "MCP"`、`"removeHeader"` 这类行在目录里各出现两次，`guardrailsHint` 这种同名键还跨命名空间存在，只按键名 `index` 会把键插错位置

在命名空间块尾追加时，块尾要用花括号深度跟踪找。按整行匹配 `strip() == "}"` 会先命中嵌套对象的收口行，键插到子对象里面；两侧目录犯同一个错时 parse 和 parity 都照过。插完必须从目标命名空间顶层取值一次，不能只断言解析成功。手写深度计数会被值里不配对的花括号（ICU 占位符、富文本标签）带偏，更稳的做法是从 `"agents": {` 的 `{` 位置起 `json.JSONDecoder().raw_decode(text, brace_pos)`，返回的结束偏移即块收口；插完的新末条不带逗号，原末条补逗号。插入点要用 `text.rindex("\n", brace_pos, close) + 1` 在收口花括号之前回找行首，取收口之后的换行会把键插进父命名空间。取命名空间起点时锚点也要带顶层缩进（如 `\n  "caching": {`）并断言唯一，`"caching": {` 裸匹配会命中别的命名空间里同名的嵌套子对象，raw_decode 收口收在错块上；再加一条该块必须已有的旧键在解析出的对象里作双保险

设计键名时避开两个坑。一是不要出现同名键既是字符串又是对象的情况，比如已经用了 `status` 作字符串就不能再加 `status.active`。二是不要把语义不同的两处文案归并到一个键，英文原文有差异（哪怕只是大小写）就要分开

中文值以 [`src/messages/GLOSSARY.md`](../../src/messages/GLOSSARY.md) 为准。已有定译的通用词不要再发明新译法，存量分歧只记录不批量回改

### 第三步：改组件

英语原文不动，只把字面量换成 `t("...")`

`useTranslations` 只能放在 React 组件或自定义 Hook 里。列定义工厂这类普通函数拿不到 Hook，要把 `t` 作为参数传进去，并进 `useMemo` 的依赖数组

替换的对象要想清楚。只替换**传给组件的字符串**，不要替换组件本身。列定义里

```tsx
header: ({ column }) => <DataTableSortHeader column={column} title="Name" />
```

要改成 `title={t("name")}`，写成 `header: t("name")` 会把 `DataTableSortHeader` 整个丢掉，表头不再可点击排序，而且只有断言排序的测试才会暴露这个问题

翻译后的调用点普遍比英文字面量长，可能把文件顶过 prettier printWidth 120 的换行、进而撑破 eslint `max-lines` 800（按代码行计，不含空行注释）。`tsc` 和 vitest 都不报这条，只有 `npx eslint` 会。收尾必须对改动文件跑一遍 eslint，并与 `git show HEAD:<path>` 的基线告警数对比，别把翻译引入的新错误算作既有噪声

只读展示的值不要从 `form.formState.defaultValues` 取。它在挂载时冻结，保存后父组件更新的是自己的数据（如 `localModelData`），只读模式会显示改动前的旧值。直接读父组件传下来的当前数据，并补一条"编辑保存后只读显示新值"的回归测试

### 第四步：处理校验文案

zod schema 里的提示也是用户可见文案。schema 定义在模块顶层时拿不到 `t`，按仓库既有做法改成接收 `t` 的工厂函数

```ts
const buildXSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({ name: z.string().min(1, t("nameRequired")) });
```

类型用 `z.infer<ReturnType<typeof buildXSchema>>` 跟着变，`superRefine` 里的 `ctx.addIssue({ message })` 同样要接 `t`

已按此处理的有 `adminPanel.allowedIPSchema`、`changePassword.changePasswordSchema`、`accessGroupFormSchema`、`accessGroupCreateSchema`、`projectFormSchema`

收尾时搜索漏网的校验文案，关键词是 `min(1, "`、`refine(` 后面跟英文引号、以及 `message: "` 与 `error: "`

### 第四步之后：模型驱动的面只翻到 DOM 为止

LiteAdmin 这类由模型调工具的界面，文案分两层。喂给模型的那一层保持英文：`SYSTEM_PROMPT`、工具的 `name`/`title`/`description`、工具 schema 的 zod 校验消息、回给模型的结果串（`Gateway action receipt:`、`projectToolResult` 的 `notice`）。这层是模型输入，换了词就改变模型行为，跟代码示例同样按不翻处理。会落到 DOM 的才接键：徽标、按钮、告警、字段错误、以及只作为 `throw` 文案但仍会进对话区的行动上限提示。

判断一条串要不要翻，追它的消费者，不要看它长在哪个文件里。`operations.ts` 里 `throw new Error("Action cancelled. No change was sent.")` 和读失败时的 `"The gateway could not complete this lookup."` 都由 SDK 塞回模型，永远不进 DOM，留英文；同一层的行动次数超限会 reject 到 `useLiteAdmin` 的错误条目，就要翻。

动作卡标题不要给 `operations.ts` 注入翻译器。把 `LiteAdminAction.name` 声明成受限 union，渲染层写 `t(\`operations.${name}\`)`，卡片标签由目录决定，喂给模型的 prompt 一个字节都不变。代价是标题在目录和 prompt 里各写一遍，用一行注释说明哪一份是给谁看的。

动态键 `missingKeys` 扫不到，要另加一份运行期同步守卫：用桩 context 构造工具表，断言工具 `name` 集合与目录子对象的键集合相等。少键 `tsc` 会拦（union 的每个成员都得在 `en.json` 里存在），多出来的孤儿键只有这道测试拦得住。

### 第五步：改测试

组件引入 `useTranslations` 后，原来用普通 `render` 的测试会抛 "context from `NextIntlClientProvider` was not found"，后面的断言全都不执行

绝大多数情况改用 `tests/test-utils.tsx` 的 `renderWithProviders` 即可，它已经包好 `LocaleProvider`、`QueryClientProvider` 和 `NuqsTestingAdapter`。注意相对层级：文件在 `src/app/(dashboard)/<route>/` 下用 4 级 `../`，在 `.../<route>/_components/` 下用 5 级

只有需要自定义包裹层且不便改造时，才 mock `next-intl`，参照 `VirtualKeysTable.test.tsx`

断言要跟着改。中文目录补齐后，测试里断言的英文文案要换成中文。这一步容易漏，跑一遍就能发现

漏的多是 `getByLabelText(/metadata/i)` 这种正则断言，英文串埋在正则里，按纯英文串 grep 抓不到，换语言才红

改断言前先确认这份测试挂的是哪套 provider。`tests/test-utils.tsx` 的 `renderWithProviders` 把语言钉在 `zh-CN`；自己写包裹层、只包 `LocaleProvider` 而不传 `locale` 的，会按 jsdom 的 `navigator.language`（`en-US`）渲染英文目录，此时把断言换成中文必然全红。碰到这种给 `LocaleProvider` 传 `locale="zh-CN"`，别把断言留回英文，那样测的只是文案没接翻译的旧状态

测试分层按 [`AGENTS.md`](../../AGENTS.md) 的约定：`Foo.test.tsx` 是单元测试，一个模块、毫秒级；`Foo.integration.test.tsx` 是集成测试，渲染真实组件树、只打桩网络边界；浏览器级测试在 `tests/e2e/ui/`。改动哪个文件就归类哪个文件

### 第六步：验证

按顺序跑，前面的失败不用往下走

```
npx vitest run <本批改动的测试文件> src/lib/i18n/messagesParity.test.ts src/lib/i18n/missingKeys.test.ts
npx tsc --noEmit
npx eslint <改动的文件>
npm run build
```

`npm run build` 的 TypeScript 阶段比 `npx tsc --noEmit` 更严，两个都要跑

eslint 的路径形式在 `(dashboard)` 这类含括号的路径目录下会低报（疑似 flat config 的 glob 匹配撞上括号）。路径形式与 `npx eslint --stdin --stdin-filename <路径> < 文件` 的结果不一致时，以 stdin 形式为准，并把 HEAD 内容与当前内容各测一遍再对比，别把工具的低报当成没有告警

不要跑全量单元测试（`npx vitest run` 不带路径）。380 个文件会把机器占满好几分钟，CI 会跑。只跑本次改动触及的文件，加上任何本次改动**有可能**解释其失败的文件

新增键较多的批次，再补两道静态校验，覆盖测试没渲染到的键。一道是用 `intl-messageformat` 把本批每条中英消息各解析一遍，抓 ICU 语法错；另一道是把组件里 `t("key", { a, b })` 传的参数名和消息里的 `{arg}`、`<tag>` 逐个对一遍，名字不一致要到运行期才抛错。两道都是临时脚本，跑完即删

### 第七步：提交

提交标题、正文与 PR 说明一律用简体中文，类型前缀（`feat`、`fix`、`chore`、`docs`）保留英文。示例

```
feat(ui): 翻译 MCP 服务器页面为简体中文
```

提交前删掉所有临时脚本（`write-*.js`、`check-*.js` 等），不要留在仓库里

## 加键时的三条硬约束

### 单复数交给 ICU

`Imported ${n} MCP server${n === 1 ? "" : "s"}` 这种拼接不能拆成两个键再加三元选键。英文有单复数而中文没有，用三元会让中文那边永远只能命中一个分支

```
Imported {count, plural, one {#} MCP server} other {#} MCP servers}
```

中文那条只留 `{count}`，`next-intl` 自动走 `other` 分支

### 可选后缀不要用 select

`"Failed to update" + (reason ? ": " + reason : "")` 这种条件拼接写成 ICU 的 `select` 是错的，因为 `select` 按值匹配而 `""` 也是一个值，会走 `other` 分支渲染出多余的冒号

把分隔符和值一起作为后缀传进去

```
Failed to update MCP Server{suffix}
```

调用处写 `t("edit.updateFailedToast", { suffix: reason ? `: ${reason}` : "" })`

### 占位符只增不改

`messagesParity.test.ts` 的契约测试要求两侧顶层参数名集合一致。富文本标签（`{strong}`、`{/link}`）、复数体内的 `{#}`、引号内的字面量不参与比对，`{count, plural, ...}` 只取 `count`

改中文时如果把某个 `{name}` 漏掉了，这条守卫会拦下来

## ICU 转义速查

消息里的尖括号与花括号都要用单引号括起来，否则 `t()` 在渲染时抛错

| 场景                   | 写法                                                    |
| ---------------------- | ------------------------------------------------------- |
| RFC 里的尖括号         | `api://'<app-id>'/.default`                             |
| 内嵌 JSON 示例         | `(e.g. '{'"organization": "my-org"'}')`                 |
| 富文本                 | `请查看 <link>文档</link>`，用 `t.rich` 渲染            |
| 所有格里的撇号         | `caller's` 直接写，不会被当成引号                        |

富文本标签名有白名单（`strong, b, i, em, link, code, br, claude, codex, docslink, issuelink`），`messagesParity` 会拒掉别的尖括号，比如自造的 `<v>`；样式留在 JSX formatter 里，`t.rich` 传入的 formatter 键名必须与标签名一致

转义规则本身有点绕：只有后面跟着 `{ } # \| < '` 其中之一的 `'` 才开启引用，`''` 是转义后的单个引号。`'Authorization: Bearer <token>'` 里的引号后面跟的是普通字母，按规则不算引用，里面的 `<token>` 会被当成真标签而抛 `UNCLOSED_TAG`

所以凡是改引号转义，落盘前必须用真实 parser（`intl-messageformat`）跑一遍渲染结果，不能肉眼看原始字符串。有一批转义脚本把 `'<app-id>'` 又包了一层变成 `''<app-id>''`，肉眼看着"加了引号"，实际还是炸

## 编码约定

不分配置外的抽象。加键就加键，不要为了"以后好扩展"引入消息加载器或翻译服务层

不留语义相近的重复键。同一个意思有多个英文说法时各开各的键，`accessGroups` 与 `modelAccessGroup` 并存正是出过错的诱因

`Record<Col, string>`、`{ label: string }` 这类装着键名的 map 要 `as const`，否则 `t(map[key])` 的参数是宽 `string` 直接被拒。`as const` 后 key 是字面量联合，逐个被检查

`.map()` 回调里写的对象字面量会重新 widen，得在内部再加 `as const`。解构后再判定的写法会丢掉字段间的关联，改成 `item.scope === "common" ? commonT(item.labelKey) : otherT(item.labelKey)` 让 narrowing 生效

动态键（如 `t(label.replace(/^nav\./, ""))`）用一个集中断言收口，断言只出现一次并注明"配置保证前缀合法"
