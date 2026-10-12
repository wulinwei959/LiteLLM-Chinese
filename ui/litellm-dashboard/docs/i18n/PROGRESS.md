# 开发进度

数据快照 2026-10-12，分支 `main`。目录规模、欠账清单与文件覆盖率随每次提交更新；测试统计来自 `507e347` 上的全量实测（11306 个用例）

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                       | 数值                                                 |
| ------------------------ | ---------------------------------------------------- |
| 命名空间                 | 39                                                   |
| `en.json` 叶子键          | 5228                                                 |
| `zh-CN.json` 叶子键       | 5228                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 71（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 71 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%

## 按路由的进度

"未接入/总数"指该目录下的 `.tsx`，数字越小越接近完成

| 路由                       | 未接入/总数 | 路由               | 未接入/总数 |
| -------------------------- | ----------- | ------------------ | ----------- |
| mcp-servers                | 5/43        | access-groups      | 2/8         |
| guardrails                 | 4/35        | guardrails-monitor | 2/7         |
| playground                 | 14/37       | budgets            | 2/6         |
| prompts                    | 5/27        | memory             | 2/6         |
| models-and-endpoints       | 2/21        | tag-management     | 2/6         |
| policies                   | 3/18        | organizations      | 1/5         |
| agents                     | 4/15        | skills             | 2/5         |
| vector-stores              | 5/15        | change-password    | 1/2         |
| caching                    | 6/13        | router-settings    | 1/2         |
| usage                      | 6/13        | transform-request  | 1/2         |
| cost-optimization          | 1/11        | ui-theme           | 1/2         |
| projects                   | 3/11        | workflows          | 1/2         |
| cost-tracking              | 3/10        | api-keys           | 2/2         |
| search-tools               | 4/10        | old-usage          | 1/2         |
| users                      | 2/9         | 其余单文件路由      | 各 1/1      |
| **共享 `src` 目录**        | **435/482** |                    |             |

共享 `src` 目录那一行是长尾，也就是批次 24。它贡献了 435 个未接入文件，占全部 556 个未接入文件的绝大多数，不过里面混着大量本来就不含文案的文件（hooks、types、纯逻辑封装），不能直接按这个数字估工作量

mcp-servers 名义上剩 5 个未接入文件，但其中 4 个本来就没有面向用户文案（页面壳、re-export、键常量表、测试 harness），校验文案已于 `5c2da87` 接入。cost-optimization 剩的 1 个同样是无文案的页面壳

## 测试状态

命令：`npx vitest run --reporter=json`，全项目，2026-10-12 实测

| 指标             | 数值                     |
| ---------------- | ------------------------ |
| 用例总数         | 11306                    |
| 通过             | 10856（96.0%）           |
| 失败             | 450                      |
| 有失败的测试文件 | 96                       |

起始基线是 1323 失败，此后 team 批次（`deab7e7`）、Provider 批次（`6d06b7b`）、guardrails 与 policies 两族收口累计消掉 873 例

### 失败的归属

按被测源文件（同目录同名去 `.test`）是否引入 `next-intl` 分类

| 归属             | 文件数 | 失败用例数 |
| ---------------- | ------ | ---------- |
| 源文件已接入翻译 | 87     | 408        |
| 源文件未接入翻译 | 9      | 42         |

按错误文本聚合

| 失败用例数 | 错误文本                                      |
| ---------- | --------------------------------------------- |
| 383        | `Unable to find ...` 各类元素找不到            |
| 32         | `toHaveTextContent` / `toHaveValue` 等内容断言 |
| 24         | `toBeEnabled` / `toBeDisabled` / `toBeChecked` |
| 11         | 其他（数组深比对、`toBeVisible`、守卫测试等）   |

223 条缺 `NextIntlClientProvider` 已清零。剩下的主力是 383 条"找不到元素"，绝大多数是断言停在英文（第六类），但其中混有与翻译无关的既有失败，处理时要逐文件回 HEAD 基线确认，不要一律当成翻译的账

其他类里有两条不属于 i18n。`mcp_server_edit.test.tsx` 的 `preserves a stored client_id on OAuth-resume restore even when the saved snapshot is token-only` 报 `expected '' to be 'stored-client'`，是取值失败而不是文案断言，已列为既有失败。`tests/fetch-location-rule.test.ts` 报 `STACK_TRACE_ERROR`，这条守卫自 `610473c` 起就没动过，是上游带过来的

### 全量报告里有并发假失败，核实前要单文件复跑

上面的 450 是**一次全量运行**的原始结果，它不等于真实失败数，因为重型 integration 测试在高并发下会超时或竞态

已有的例子是 `edit_auto_router_modal.integration.test.tsx`：全量报告里 23 例失败，单独跑 64 例全绿（该文件单跑耗时 54 秒）。所以那 23 例是并发产物，不是缺陷

但不是所有集中失败都是假的。2026-10-12 逐个单文件复跑了失败最多的四个文件，结果与全量一致，都是真失败

| 文件                                                                   | 全量 | 单跑 |
| ---------------------------------------------------------------------- | ---- | ---- |
| `cost-tracking/_components/cost_tracking_settings.test.tsx`            | 14   | 14   |
| `projects/.../EditProjectModal.integration.test.tsx`                   | 13   | 13   |
| `agents/_components/agent_info.integration.test.tsx`                   | 12   | 12   |
| `add_pass_through.integration.test.tsx`                                | 12   | 12   |

这四个都是第六类：断言停在 `Save Changes`、`Advanced Settings`、`Project Name`、`Edit Settings` 这些已经变成中文的文案上

结论是处理失败清单前先单文件复跑，别信全量报告里的集中失败，也别因为一例是假的就把其余都当成假的

失败最集中的单文件

| 文件                                                                       | 失败用例数 |
| -------------------------------------------------------------------------- | ---------- |
| `src/components/edit_auto_router/edit_auto_router_modal.integration.test.tsx` | 23      |
| `src/app/(dashboard)/cost-tracking/_components/cost_tracking_settings.test.tsx` | 14    |
| `src/app/(dashboard)/projects/_components/ProjectsPage.test.tsx`            | 13         |
| `src/app/(dashboard)/projects/_components/ProjectModals/EditProjectModal.integration.test.tsx` | 13 |
| `src/components/view_logs/index.test.tsx`                                   | 12         |
| `src/components/add_pass_through.integration.test.tsx`                      | 12         |
| `src/app/(dashboard)/agents/_components/agent_info.integration.test.tsx`    | 12         |
| `src/app/(dashboard)/projects/_components/ProjectModals/CreateProjectModal.integration.test.tsx` | 12 |
| `src/app/(dashboard)/prompts/_components/prompt_editor_view/VersionHistorySidePanel.test.tsx` | 11 |
| `src/app/(dashboard)/usage/_components/components/UsagePageView.test.tsx`   | 11         |

### 各路由的测试状态

| 路由               | 失败用例 | 失败文件 | 路由            | 失败用例 | 失败文件 |
| ------------------ | -------- | -------- | --------------- | -------- | -------- |
| projects           | 82       | 10       | tag-management  | 11       | 3        |
| （非路由）          | 81       | 19       | users           | 9        | 1        |
| prompts            | 56       | 18       | router-settings | 8        | 1        |
| agents             | 55       | 10       | memory          | 7        | 2        |
| cost-tracking      | 36       | 6        | skills          | 6        | 3        |
| playground         | 27       | 9        | change-password | 5        | 1        |
| usage              | 27       | 5        | mcp-servers     | 1        | 1        |
| budgets            | 21       | 4        |                 |          |          |
| caching            | 18       | 3        |                 |          |          |

"（非路由）"指 `src/components` 与 `tests` 下不属于任何 dashboard 路由的测试，其中 `edit_auto_router` 占 23、`view_logs/index` 占 12、`add_pass_through` 占 12

models-and-endpoints、cost-optimization、access-groups、organizations、workflows、transform-request、ui-theme 保持零失败。mcp-servers 从 20 例降到 1 例，是上面那条 `stored client_id` 的取值失败

### i18n 自身的守卫

三条守卫全部通过，16 个用例

```
npx vitest run src/lib/i18n
```

`locales.test.ts` 7 个、`messagesParity.test.ts` 8 个、`missingKeys.test.ts` 1 个

其中 `missingKeys.test.ts` 在这一轮之前是失效的，见 [FIXES.md](./FIXES.md) 的"2026-10-12 新发现并修复的两条"。修好之后它报出 47 条真实缺失，补齐后转绿

`src/components/shared/LanguageSwitcher.test.tsx` 有 2 个失败，属于设计冲突而非缺陷：`renderWithProviders` 强制 `locale="zh-CN"`，而这两个用例假设默认是英文，并且想验证"切换后变中文"这条链路。强制 locale 会把 `localStorage` 驱动的那条链路短路掉，所以这个组件的测试不能走 `renderWithProviders`，需要一个可以省略 `locale` 的包裹层

## 已完成的部分

i18n 基础设施完整可用：语言解析、切换器、状态传播、类型增强、三条守卫都在，`locales.test.ts` 覆盖了三级回退链

批次 0 到 14 完成。核心管理页面（虚拟密钥、团队、用户、组织、预算、项目、访问组、模型与端点、MCP 服务器、护栏、策略、用量、日志、管理面板）的文案已经接入

2026-10-12 又收掉三块。Provider 批次（`6d06b7b`）：26 个测试文件从裸 `render` 换成 `renderWithProviders`，223 例缺 Provider 清零，附带 45 例断言中文化，其中 3 个自定义 wrapper 场景在 wrapper 内嵌 `<LocaleProvider locale="zh-CN">`。team 批次（`deab7e7`）：12 个测试文件 172 例清零。mcp-servers 校验文案（`5c2da87`）：`utils.tsx` 三个校验器改为调用方传入 `t()` 消息，目录新增 `mcpServers.validation` 三键

七个核心模块的测试全绿，数字来自上面那份全量基线

| 模块                 | 用例数 | 结果      |
| -------------------- | ------ | --------- |
| cost-optimization    | 216    | 216 通过  |
| models-and-endpoints | 196    | 196 通过  |
| access-groups        | 73     | 73 通过   |
| organizations        | 37     | 37 通过   |
| workflows            | 16     | 16 通过   |
| transform-request    | 7      | 7 通过    |
| ui-theme             | 6      | 6 通过    |

i18n 自身的三条守卫也是全绿，16 个用例

## 下一步优先级

原来的四个优先级里，第一（223 条缺 Provider）、第二（team 172 例）、第三（页面收口）都已完成。此前按失败集中度排出的 1-6 号目标也全部清零：`edit_auto_router_modal.integration` 的 46 例经单文件复跑确认是全量并发造成的假失败（独立运行为 0），其余按 6d06b7b、e2350f6、c109bdb、0e8f5f6 四次提交逐个转绿。中途顺带清掉了未列进表的 `AdminPanel`（19）、`EntityUsage`（18）、`add_attachment_form`（17）、`BulkEditUsers`（16）、`leftnav` 之外的 `user_edit_view` / `user_info_view.integration` / `old-usage`

第 7 项已清零。guardrails 族起点 150 例，`d0c3436` 收掉 content_filter 子族的 68 例，本次提交收掉其余 22 个文件的 82 例（起点：`guardrail_info.characterization` 14、`add_guardrail_form.characterization` 11、`GuardrailsOverview` 11、`CustomCodeModal` 9、`GuardrailUsageBreakdown` 7、`TeamGuardrailsTab.integration` 7，加 6/5/4/3 的长尾），`src/app/(dashboard)/guardrails` 目录复跑 272 例全绿。policies 族（14 个文件 112 例）已在 bdac478 清零。清的时候仍按"回 HEAD 基线确认既有失败"区分翻译账和非翻译账，并且先单文件复跑，别信全量报告里的集中失败

几处踩过的坑，写在这里省得再查：

- 组件里的硬编码英文哨兵值不能被翻译。`AdminPanel.tsx` 的 `all_ip_address_allowed = "All IP Addresses Allowed"` 同时用于渲染和比对后端返回的 IP 行，测试的 mock 数据必须保持英文，只有断言渲染文本的那几处才跟着 t() 走
- 共享组件里写死的英文按钮同样保持英文。`DeleteResourceModal` 的按钮固定渲染 `Cancel` / `Delete` / `Deleting...`，`policies/_components/index.test.tsx` 里这三处断言不能跟着目录里其他断言一起改
- 测试自己 mock 出来的 stub 文案与语言无关。`index.test.tsx` 把 `FlowBuilderPage` mock 成一个写着 `Back to policies` 的按钮，改中文会直接查不到元素
- 英文不同、中文同值的两个键会破坏 `getByText` 的唯一性。`flow.guardrailBadge`（GUARDRAIL）与 `flow.guardrailLabel`（Guardrail）都渲染成"护栏"，`pipeline_flow_builder.test.tsx` 那一处只能改成 `getAllByText(...).length`
- next-intl 走 ICU 语法，消息里的单引号是转义符而不是字面量。`Microsoft Entra OBO requires a scope, e.g. api://'<app-id>'/.default` 渲染出来是 `api://<app-id>/.default`（引号被吞），断言要按渲染结果写
- ICU plural 在中文里退化成量词短语，英文整句正则要按中文语序重写。`test.testButton` 的 `Test {count} guardrails` 中文是"测试 {count} 个护栏"，`providerFields.jsonObject` 的 `{field} must be a valid JSON object` 中文把占位符留在前缀（"detect_secrets_config 必须是有效的 JSON 对象"），`eval.descNamed` 更是把 `{name}` 挪到句中（"为 {name} 配置 AI 评估"）
- 纯逻辑模块拼出来的英文展示串也在页面上，属于批次 24 的账。`components/GuardrailsMonitor/usageUnits.ts` 的 `unpricedSummary()`、`counterLabel()` 与 `counterMathRow()` 已按 `(t, ...)` 首参约定接入 `guardrailsMonitor` 命名空间，中文断言同步。`counterLabel()` 改为先查 9 个真实计数器的映射表（键取自 `bedrock/guardrails` 成本表），未知计数器才走驼峰派生兜底
- 图表图例的 `categories` 是 dataKey，不能直接传中文，否则图例说中文而 tooltip 与序列名对不上。给共享的 `bar_chart` 加了可选 `categoryLabels`，同时覆盖 `ChartConfig.label`（图例）与 `Bar name`（tooltip 名），dataKey 保持 `passed` / `blocked` 不动
- 中文目录里 `{count}` 不会千分位，`{count, number}` 才会。`unpricedSummary()` 的 `1234 units unpriced` 中文写 `{count, number} 个单位未定价`，`1,234` 才对；同理 ICU plural 组内的 `#` 自带千分位
- 组件里写死的按钮英文会伪装成翻译问题。`TeamGuardrailsTab` 的详情面板把 `Approve` / `Reject` / `Add` 写死，接上 `t("team.approve")` / `t("team.reject")` / `t("team.add")` 之后 `getAllByRole("button", { name: /批准/ })` 的计数才与英文一致，这一处随本次提交一起改掉了

到此，第六类（断言停在英文）排得出名次的目标全部清零，剩下的主力就是批次 24 的共享组件长尾。清单里的硬编码也全部收口：guardrails 相关四条（`usageUnits.ts`、`ScoreChart.tsx`、`CustomCodeModal.tsx`、`TeamGuardrailsTab.tsx`）已在 `3d617ec` 清零，最后一行 `public_model_hub` 分页脚（连同 `AIHub/ModelHubTable.tsx` 的孪生组件）已在本次提交清零，[FIXES.md](./FIXES.md) 的"批次 24 硬编码英文欠账清单"到此清空。本次提交同时把两处既有脚注断言改成中文，并给公开页补了一条 agents/MCP 脚注的中文用例

顺带修掉 `dd32399` 留在非测试文件里的 22 处类型错误，生产构建从那时起一直红着，本次恢复绿色。起点是 `cache_control_settings.tsx` 的导出常量被删后 `ModelInfoEditForm.tsx`（未翻译的长尾文件）还在 import；修掉缺导出后构建推进到下一层，又停在 `layout.tsx` 的 `Cannot find name 't'`。同一提交共留下五类错误：删掉的导出仍被引用、`t()` 调用处没有 hook（10 条）、`keyof typeof` 指向不存在的名字、重复的 interface 声明、无意义的 `data-testid` 解构。vitest 对这些全绿（Vite 把缺失导出解析成 `undefined`），tsc 会报但混在存量里没被逐条比对，只有 `npm run build` 会硬失败且一次只报第一个错。五类的例子与修法见 [FIXES.md](./FIXES.md) 的"2026-10-12 构建报错"一节

另外有一件小事不依赖批次顺序，且卡着一个具体失败：`renderWithProviders` 强制 `locale="zh-CN"`，`LanguageSwitcher` 的 2 个失败就是它造成的。判断口径在 `tests/test-utils.tsx` 里留了标记

### 核实后的剩余工作

507e347 上实测的 450 例失败，扣掉 `edit_auto_router_modal.integration` 的 23 例并发假失败，实际约 427 例，分布在 96 个文件里

其中 projects（82）、prompts（56）、agents（55）、cost-tracking（36）四个路由占了 229 例，是接下来最值得动的四块。`src/components` 下的非路由测试（81 例）里，`view_logs/index` 与 `add_pass_through` 各占 12 例

处理顺序建议按失败数从多到少，每处理完一组就单文件复跑确认，不要直接看下一份全量报告

## 技术债

`AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败是既有问题，与 i18n 无关，留给对应模块

`mcp_server_edit.test.tsx` 的 "preserves a stored client_id on OAuth-resume restore" 1 例在 HEAD 上即失败（`expected '' to be 'stored-client'`），2026-10-12 用单文件 stash 对照确认与翻译无关

全仓库 `tsc --noEmit` 有 904 条错误，分布在 82 个文件（2026-10-12 实测），**全部位于 `*.test.tsx` / `*.test.ts`**，大头是 vitest 全局类型缺失的 TS2304/TS2582 与测试文件自身的类型债。此前记的 928 条里有 24 条是翻译引入的，全部在非测试文件（`dd32399` 的五个错误类，9 个文件 22 条 + `ModelInfoEditForm.tsx` 引用缺导出的 2 条），本次修完后降到 904，**非测试文件清零**，`npm run build` 恢复绿色。注意 `next.config.mjs` 设了 `useTypeScriptCli: false`，Next 16 自带的类型检查阶段不扫测试文件，所以这 904 条与绿色构建共存；哪天开了这个实验开关，测试文件债会立刻变成构建红灯。`TRANSLATION_PLAN.md` 里写的"约 819 条、56 个文件"是更早的一次测量，已过时。基线比对之后要区分"非测试文件 0 错误"与"测试文件存量债"两件事

比对基线前先确认 `ui/litellm-dashboard/next-env.d.ts` 存在（它被 gitignore，删掉后会虚增 145 条 `assets/logos` 的 TS2307），标准内容就两行 `/// <reference types="next" />` 与 `/// <reference types="next/image-types/global" />`

判断有无新增要逐条比对，不要只看总数，按文件去重会掩盖同一文件内的新增错误。`src/lib/i18n` 目录目前是零错误

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
