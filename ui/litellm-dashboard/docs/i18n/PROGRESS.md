# 开发进度

数据快照 2026-10-15，分支 `main`。**汉化尚未完成**，剩余量见"## 汉化完成度实测"；目录规模、欠账清单与文件覆盖率随每次提交更新。覆盖率最新一次是第 70 簇后（非测试 `.tsx` 912 个接入 486 个、53.3%，目录叶子 7331、中英同值 89）。最新的四片全量是第 70 簇（886 文件 11581 例、8 失败 + 9 例预期失败，8 例全在 `cost_tracking_settings`（7）与 `LensSetup`（1）这两个已定性为上游既有的文件上，与本簇无关；第 67 簇那一片里另曾多报一条 `LensSetup` 的"找不到按钮 Continue"，单跑该文件不复现、只剩既有那 1 例日期断言，故记为并发负载抖动，第 68、69、70 簇的四片里不再出现；例数与第 62、63、64、65、66、67、68、69 簇持平，本簇只换断言、未增删用例）。最新的测试统计是第 55 簇后的一次全量（886 文件 11577 例、27 失败 + 9 例预期失败，27 例落在 12 个测试文件上：19 例是已汉化组件的英文断言欠账、已在随后的清扫里改绿，8 例经与上游快照比对确认不是汉化欠账，明细见"## 2026-10-15 第 55 簇后的全量快照"与"## 2026-10-15 断言欠账清扫"），上一次全量是第 53 簇后（886 文件 11577 例、56 失败 + 9 例预期失败，明细见"## 2026-10-15 第 53 簇更新"），再上一次是第 18 簇后（886 文件 11576 例、57 失败，无一在 `view_logs`，多出的三个文件单跑全绿），第 19 到 32 簇只复跑了 `view_logs` + `src/lib/i18n`（52 文件 671 例，第 25、26、27、28、29、30、31、32 簇未增删用例；第 20、21、22 簇另跑 `add_model`，均为 94 文件 1672 例），第 33 簇起把 `chat` + `app/chat` + `app/connect` 并进复跑范围（67 文件 749 例，第 34 簇未增删用例），第 35 簇起再把 `components/liteadmin` 并入（70 文件 861 例，第 35、36、37、38、39、40、41 簇未增删用例），第 42 簇起再把 `components/AIHub` 并入（79 文件 978 例，第 42、43、44、45、46、47、48、49 簇未增删用例；第 50 簇在 `ModelHubTable.test.tsx` 补了 1 例模型详情弹窗，为 979 例；第 51、52 簇未增删用例），"批次 24：add_model 与 edit_auto_router"一节的 11576 例 / 54 失败是它的前一次，"### 修复后的复核"的 11308 例 / 1 失败与 `## 测试状态` 的表格都是更早的快照，保留用于对照起点

## 2026-10-15 第 70 簇更新

批次 24 第 70 簇：`Settings/AdminSettings/CyberArk/` 与 `Settings/AdminSettings/HashicorpVault/` 两个密钥管理器卡片目录（各自的卡片外壳、空态占位、编辑弹窗与 `constants.ts`）。16 个文件 +391/−198，其中两个消息目录各 +84/−0

- 新开顶层命名空间 `secretManager`，分 `shared`（21 键，两张卡通用的卡副标题、认证方式、三条卡头按钮、清除字段三件、`Clear {name}` 带参模板、客户端证书/密钥、`TLS 证书`、`连接` 等）、`cyberark`（25 键）、`vault`（30 键），共 76 键；目录叶子 7255→7331
- 复用优先：两张卡的 `Edit Configuration`/`Test Connection`/`Delete Configuration` 在 `shared` 里只留一份，字段标签表也统一进 `shared.clientCert`/`shared.clientKey`；卡内 `<h3>` 标题继续取第 6x 簇已接入的 `adminPanel.tabCyberArk`/`tabVault`，弹窗的取消/保存走 `common.cancel`/`common.save`/`common.saving`；目录叶子 76 键覆盖了两张卡的全部 60 余条文案
- 中英同值 +2：`shared.tls`（`TLS`）、`vault.approle`（`AppRole`），87→89
- `detectAuthMethod(values)` 是模块级函数拿不到 hook，改为 `detectAuthMethod(values, t)`，并在 `src/lib/i18n/translators.ts` 加 `SecretManagerTranslator` 别名（该文件第 6 个）
- 动态键的类型处理（本簇新学，细则记在 `FIXES.md` 的"## 2026-10-15 动态键表接 next-intl 的三条类型规矩"）：`FIELD_LABELS: Record<string, string>` 换成 `FIELD_LABEL_KEYS = { … } as const`，取标签时用 `FIELD_LABEL_KEYS[field as keyof typeof FIELD_LABEL_KEYS]`，组件内再包一个 `labelOf(field)` 回落到原始字段名；把 `string` 直接喂给 `t()` 会被 `NamespacedMessageKeys` 判为 TS2345
- 编辑弹窗的 `FIELD_GROUPS` 同理从「interface + 数组」改成 `as const` 字面量并删掉接口：`titleKey`/`subtitleKey` 都是键名而非文案，`subtitleKey` 是可选成员，渲染处必须写成 `{"subtitleKey" in group && (…)}` 才能收窄（漏掉前导 `{` 会撞出 TS1381，`tsc` 总数从 880 塌到 2）
- zod 校验消息、`buildSchema` 与 `useMemo` 依赖：`leaveBlankPlaceholder` 用 `{value}` 带参模板，schema 用 `useMemo(() => buildSchema(visibleFields, t("shared.urlSchemeError")), [visibleFields, t])` 重建；`console.error` 的三处日志串按房内惯例保持英文
- 测试接线 5 个文件：`CyberArk.test.tsx`（"认证方式"、`getAllByText("API 密钥")`、/测试连接/i）、`EditCyberArkModal.test.tsx`（保存/取消、"客户端密钥"、"账户"、"Conjur 服务器地址"、"必须以 http:// 或 https:// 开头"、"留空则保留现有值（super-secret-key）"）、`HashicorpVault.test.tsx`、`EditHashicorpVaultModal.test.tsx`（令牌/登录命名空间/密钥命名空间/密钥 ID/角色 ID/Vault 地址）、`HashicorpVaultEmptyPlaceholder.test.tsx` 从裸 `render(` 换成 `../../../../../tests/test-utils` 的 `renderWithProviders`
- 门禁：守卫 16 例全绿；两个目录 5 文件 27 例；消费方 `admin-panel` 1 文件 25 例；`tsc --noEmit` 总数 880、非测试 0；触达文件 eslint 与 HEAD 逐条一致（HEAD 探针同样 2 条既有警告，未使用 stash）；8 个 HEAD 探针文件 prettier 全净，据此放行 `--write`；`npm run build` 退出 0；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，与基线逐例一致（仍是 `cost_tracking_settings` 7 例 + `LensSetup` 既有日期断言 1 例）；接入数 480→486/912、52.6%→53.3%

## 2026-10-15 第 69 簇更新

批次 24 第 69 簇：`Settings/RouterSettings/Fallbacks/Fallbacks.tsx`——模型回退列表页外壳；本簇过后 `Settings/RouterSettings/` 整目录接入完毕。3 个源文件 +54/−39，两个消息目录各 +41/−30

- 新开 11 键，全部并入第 68 簇刚开的 `routerSettings.fallbacks` 子命名空间（空态、保存与测试的三条 toast、编辑/删除两枚 tooltip、删除确认三件、测试成功的富文本），命名空间到 41 键；目录叶子 7244→7255
- 复用优先：表头三列直接取已有的 `models.table.modelName`、`routerSettings.tabFallbacks`、`common.actions`；两处更新失败提示复用第 67 簇的 `routerSettings.updateFailedToast`；`testSuccessRich` 走 `t.rich`，按房内写法把 `<strong>`/`<link>` 拆成两个渲染器，`<link>` 渲染成真正的 `<a>`
- `testFallbackModelResponse` 是模块级函数拿不到 hook，沿用既有做法在 `src/lib/i18n/translators.ts` 加 `RouterSettingsFallbacksTranslator` 别名（该文件第 5 个），调用点把组件的 `t` 传下去
- 顺手纠正第 68 簇写歪的 30 行嵌套键缩进（4 空格→房内 6 空格），消息目录本次 +41/−30 里的 30 行删除就是这次纠正；两个消息目录的 prettier 欠账从 150/156 行收敛到 90/96 行，剩下的都是这批簇之前就有的旧块，本簇没有新增
- 测试接线：`Fallbacks.test.tsx` 三条真实渲染的英文断言换中文（"确定删除该回退吗？"与两条空态正则）；`AddFallbacks`、`DeleteResourceModal` 仍是桩件，其按钮断言保持英文
- 门禁：守卫 16 例全绿；`Fallbacks` 目录 8 文件 62 例；消费方 12 文件 100 例（含 `router-settings/_components` 的集成测试）；`tsc --noEmit` 总数 880、非测试 0，与基线持平；本簇源文件 eslint 与 HEAD 逐条一致（首轮多出一条 `local/no-large-inline-object-arg`，把四个属性的 `t.rich` 参数提成命名变量 `toastValues` 后消除）；`npm run build` 通过；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，与基线逐例一致；接入数 479→480/912、52.5%→52.6%
## 2026-10-15 第 68 簇更新

批次 24 第 68 簇：`Settings/RouterSettings/Fallbacks/` 的五张回退配置卡（`AddFallbacks.tsx`、`AddFallbacksModal.tsx`、`FallbackSelectionForm.tsx`、`FallbackGroupConfig.tsx`、`EditFallbacks.tsx`）。12 个文件 +199/−113，两个消息目录各 +33/−1

- 新开 30 键，全部挂在新的 `routerSettings.fallbacks` 子命名空间下（添加/编辑两段的标题与说明、保存进行态、页签与移除的带参 aria、主模型与回退选择器、链上限提示、四条 toast）；目录叶子 7214→7244
- 复用优先：取消用 `common.cancel`，保存更改复用第 67 簇刚开的 `routerSettings.saveChanges`；`Group {index}`、`Remove {name}`、`Max {max}`、`{used}/{max}` 都是同一模板的中英两份，占位名保持一致
- `Fallbacks.tsx`（列表页外壳）留给下一簇，本簇只把它测试文件里真实渲染的 `EditFallbacks` 断言换成中文——该测试 mock 掉了 `AddFallbacks` 与 `DeleteResourceModal`，所以对桩件的英文按钮断言仍留英文
- 测试接线：4 个自家测试改用 `tests/test-utils` 的 `renderWithProviders`（该目录相对路径是 `../../../../../tests/test-utils`）；`EditFallbacks.test.tsx` 与 `Fallbacks.test.tsx` 自建 QueryClient，保留自家 provider 再套一层 `LocaleProvider locale="zh-CN"`，避免共享缓存把别的簇的数据带进来
- 说明文案里的括号按中英排版规则处理：中文说明用全角（一次最多 5 组），`Max {max} fallbacks at a time` 这类英文括注在中文里同样用全角；`fallbackChainLabel` 与 `chainAria` 复用同一个「回退链」值，`role="list"` 的名字断言因此统一为中文
- 门禁：守卫 16 例、`Fallbacks/` 8 文件 62 例、消费者 6 文件 32 例全绿；`tsc --noEmit` 总数 880、非测试 0；eslint 工作树 8 警告 0 错误，与 HEAD 同目录 10 警告（多出的 2 条属于未动的 `Fallbacks.tsx`）持平；10 个 HEAD 文件 prettier 探针全净，故放行 2 处 `--write`；`npm run build` 退出 0；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，与基线逐例一致（`cost_tracking_settings` 7 例 + `LensSetup` 既有日期断言 1 例）；接入数 474→479/912、52.0%→52.5%

## 2026-10-15 第 67 簇更新

批次 24 第 67 簇：`router_settings/` 整目录（`index.tsx`、`RouterSettingsForm.tsx`、`RoutingStrategySelector.tsx`、`TagFilteringToggle.tsx`、`ReliabilityRetriesSection.tsx`、`LatencyBasedConfiguration.tsx`），加上标签页外壳 `common_components/RouterSettingsAccordion.tsx`——两者同屏，拆开做会留下半英文的路由设置页。17 个文件 +140/−86，两个消息目录各 +14/−1

- 新开 13 键，全部落在 `routerSettings`（33 键）：`routingSettingsTitle`/`routingSettingsDescription`、`routingStrategyFallback`/`tagFilteringFallback`、`reliabilityTitle`/`reliabilityDescription`、`latencyTitle`/`latencyDescription`、两条参数解释 `latencyTtlHelp`/`latencyBufferHelp`、`saveChanges`，以及两条 toast `updateSuccessToast` 与带 `{error}` 的 `updateFailedToast`；目录叶子 7201→7214
- 复用优先：两个 `TabsTrigger` 直接用既有的 `routerSettings.tabLoadbalancing`/`tabFallbacks`，`了解更多` 用 `common.learnMore`，`重置` 用 `common.reset`，7 个源文件只新开 13 键
- `RoutingStrategySelector` 与 `TagFilteringToggle` 的标签都写成 `metadata?.label || "英文兜底"`，接口没返回时才会显示兜底串；兜底按既有做法接成 `|| t("…Fallback")`，服务端真给了英文名仍旧原样透出
- `LatencyBasedConfiguration` 把 `paramExplanation` 从模块级常量下沉进组件才能拿到 `t`（同第 54、55、65 簇的办法）；`ReliabilityRetriesSection` 的 `placeholder="—"` 与 `{routerFieldsMetadata[param]?.ui_field_name || param}` 是数据值、不接键
- 断言同步 8 个测试文件：6 个 `router_settings` 测试从裸 `render(` 换成 `renderWithProviders(`（"基于延迟的配置"、`/滑动窗口/`、`/随机调度/`、"可靠性与重试"、"路由策略"、"启用标签过滤"、`/了解更多/`、"路由设置"）；`index.test.tsx` 另把 `{ name: /保存更改/ }`×6、`{ name: /重置/ }` 与 `toHaveBeenCalledWith("路由设置更新成功")` 接上；`RouterSettingsAccordion.test.tsx` 与 `routerSettingsWiring.test.tsx` 自建 QueryClient，按既有做法在其 QueryClientProvider 内再套一层 `<LocaleProvider locale="zh-CN">`，不改它们的缓存隔离
- 全量复跑 886 文件 11581 例、8 失败 + 9 例预期失败，与第 62、63、64、65、66 簇逐条一致（本簇那一度的第 9 例经单跑排除为负载抖动）；`npm run build` 通过，`tsc` 非测试报错 0，触达文件 eslint 32 条警告与 HEAD 画像相同（0 报错）；`ReliabilityRetriesSection.test.tsx` 因换函数名后 JSX 超 100 列被 prettier 判定，HEAD 版本探针干净故按规则 `--write` 该一个文件，重跑其 8 例全绿

## 2026-10-15 第 66 簇更新

批次 24 第 66 簇：`common_components/PassThroughGuardrailsSection.tsx`（透传端点的护栏选择 + 字段级定位区块）。4 个文件 +68/−39，两个消息目录各 +18/−0

- 新开 18 键，全部挂在 `models.passThrough` 下、紧跟第 64 簇的 `securityEnterpriseNotice`：区块说明 `guardrailsDescription`、`fieldTargetingTitle`/`fieldTargetingIntro`、`commonExamples` 与三条示例 `exampleQuery`/`exampleDocuments`/`exampleMessages`、`selectGuardrails`/`selectGuardrailsHint`、`fieldTargetingOptional`、`tipLeaveEmpty`、两个输入框标签 `requestFieldsLabel`/`responseFieldsLabel` 及其 `requestFieldsHint`/`responseFieldsHint`、`examplesLabel` 与两个占位符 `requestFieldsPlaceholder`/`responseFieldsPlaceholder`；目录叶子 7183→7201
- 标题与"Learn more"复用既有键：h3 直接用 `guardrails.title`、链接文字用 `common.learnMore`，不为同词再开新键
- 三条示例都是 `• <code>query</code> - 说明` 的形态，`code` 在守卫的 `RICH_TAGS` 白名单里，故走 `t.rich` + 一个组件内 `codeRenderer`（输出真 `<code className="rounded-sm bg-muted px-1">`），比第 64 簇的 `link` 少一层转义顾虑
- 留在英文的数据：输入框下方的 `+ query`/`+ documents[*]`/`+ results[*]` 三个快捷按钮是 JSONPath 片段、tooltip 里"示例"后的 `• query` 是字段名，`pre_call`/`post_call` 是服务端枚举，三者都不接键
- 断言同步 1 个测试文件：`PassThroughGuardrailsSection.test.tsx` 由裸 `render` 改为 `renderWithProviders`（`../../../tests/test-utils`，锁 zh-CN），`FIELDS` 的两条 matcher 改为 `/请求字段/`、`/响应字段/`，另外 2 条用例的提交值断言不含文案、无需改
- 连带成本为零：两个消费者 `add_pass_through.integration.test.tsx` 与 `pass_through_info.integration.test.tsx` 本就全用 `renderWithProviders`，单跑 2 文件 22 例全绿；区块内新文案与它们的既有断言无重叠字符串
- 全量复跑 886 文件 11581 例、8 失败 + 9 例预期失败，与第 62、63、64、65 簇逐条一致；`npm run build` 通过，`tsc` 非测试报错 0，两个改动文件的 eslint 零输出（HEAD 亦无）、`prettier --list-different` 干净
- 中途一次目录写坏：插入脚本把 `•`/`💡` 写成了 `\\u2022`/`\\U0001F4A1` 字面量，`U` 不是合法 JSON 转义，解析即报错；因两目录当时是干净已提交态，`git checkout HEAD --` 回退后改用字面字符重插，parity 守卫复核 7201 对齐

## 2026-10-15 第 65 簇更新

批次 24 第 65 簇：`common_components/` 的 `KeyLifecycleSettings.tsx`（密钥有效期 + 自动轮换表单）与 `AutoRotationView.tsx`（同一主题的只读展示卡）。7 个文件 +144/−78，两个消息目录各 +33/−0

- 新开 29 键：`virtualKeys.lifecycle` 21 键（两节的标题、`expireKey`/`neverExpire`/`enableAutoRotation`/`rotationInterval`/`selectInterval` 五个控件名、三条 tooltip 长提示 `expireHint`/`enableHint`/`intervalHint`、两个占位符 `createPlaceholder`/`editPlaceholder` 与自定义输入的 `customPlaceholder`、`supportedFormats`、`rotationNotice`，以及 `interval7d`/`interval30d`/`interval90d`/`interval180d`/`interval365d`/`intervalCustom` 六个周期名）与 `virtualKeys.autoRotation` 8 键（`title` 三处共用、`cardDescription`、带 `{interval}` 的 `everyInterval`、`lastRotation`/`nextRotation`/`noHistory`/`notEnabled`、带 `{date}`/`{time}` 的 `atTime`）；目录叶子 7154→7183
- 启用/禁用徽标逐字节复用 `common.enabled`/`common.disabled`，不再新开键
- 模块级 `INTERVAL_LABELS` 常量拿不到 `t`，按第 54、55 簇的老办法下沉为组件内 `intervalLabels`；下拉显示态保留了 `intervalLabels[selected] ?? selected` 的原兜底——自定义周期（如 `14d`）不在表里，必须显示原始值而不是"自定义周期"，本簇一度把它误写成 `?? intervalLabels.custom`，靠读代码纠回
- `formatTimestamp` 里的 ` at ` 连接词是文案、接成 `atTime` 的 `{date}`/`{time}`；`toLocaleDateString("en-US")` 的英文日期与时分 AM/PM 格式记为格式债留下
- 断言同步 3 个测试文件 28 处：`KeyLifecycleSettings.test.tsx` 24 处（含两个占位符常量、`getByLabelText("密钥过期时间")`、`getAllByTitle("90 天")`、`chooseSelectOption` 的"自定义周期"），`create_key_button.integration.test.tsx` 2 处 `findByLabelText`，`key_edit_view.integration.test.tsx` 2 处（`"例如 30d"` 与把 `/never expire/i` 正则改为整串 `"永不过期"`）
- 连带成本为零：`key_info_view.tsx` 与 `key_edit_view.tsx` 的两处挂载点，其 4 个测试文件本就全用 `renderWithProviders`（191 例 + 2 例预期失败画像不变）；`RegenerateKeyModal.tsx` 自己另有一个 `label="Expire Key"`，属未接线文件、不受本簇影响
- 全量复跑 886 文件 11581 例、8 失败 + 9 例预期失败，与第 62、63、64 簇逐条一致；`npm run build` 通过，`tsc` 非测试报错 0，5 个文件的 eslint 与 HEAD 画像相同（8 条既有警告）

## 2026-10-15 第 64 簇更新

批次 24 第 64 簇：`common_components/` 的两块企业版提示卡 `PassThroughSecuritySection.tsx` 与 `PremiumLoggingSettings.tsx`。5 个文件 +38/−18，两个消息目录各 +5/−0

- 新开 5 键：`models.passThrough` 的 `securityTitle`/`securityDescription`/`authPremiumLabel`/`securityEnterpriseNotice`，与 `teams.loggingEnterpriseNotice`；目录叶子 7149→7154
- 两条企业版提示语都带"获取试用 key"的链接，改用 `t.rich` 承载。守卫的富文本标签白名单（`messagesParity.test.ts` 的 `RICH_TAGS`）不含 `a`，但含 `link`，故消息里写 `<link>…</link>`、渲染器仍输出 `<a target="_blank" rel="noopener noreferrer">`；第 46 簇的 `<label>` 走的是同一道守卫、当时改用 `<strong>`，本簇用更贴语义的 `link`
- `PassThroughSecuritySection` 的标题、说明与"Authentication (Premium)"标签一并接入 `models.passThrough`，与第 62 簇的 `routesPlaceholder`/`routesEmpty` 同组
- `PremiumLoggingSettings.test.tsx` 有一条读源码的守卫（断 `export function PremiumLoggingSettings`、语义 token、无硬编码色板），故保留 `export function` 写法与全部 class；`✨ langfuse-logging`/`✨ datadog-logging` 是徽标的数据值、不接键；两条 `/LiteLLM Enterprise feature/` 断言换成 `/企业版功能/`
- 连带成本落在 4 个消费者测试文件（`Teams.test.tsx`、`create_key_button.integration.test.tsx`、`add_pass_through.integration.test.tsx`、`pass_through_info.integration.test.tsx`），全部零断言改动：`Teams.test.tsx` 的 `next-intl` mock 查不到键值时回退成键名、不会抛错，另三个只断言自己的表单文案；`create_key_button` 与 `Teams` 单跑 164 例 + 1 例预期失败画像不变
- 全量复跑 886 文件 11581 例、8 失败 + 9 例预期失败，与第 62、63 簇逐条一致；`npm run build` 通过，`tsc` 非测试报错 0，两个组件的 eslint 与 HEAD 画像相同（`PremiumLoggingSettings` 那两条 `any` 警告是既有的）

## 2026-10-15 第 63 簇更新

批次 24 第 63 簇：`common_components/` 的 `LabeledField.tsx`、`RouterSettingsSummary.tsx`，加上 `LabeledField` 唯一的消费方 `templates/KeyInfoHeader.tsx`（两者是一对，拆开做只会留下半个英文的密钥信息头）。9 个文件 +172/−115，两个消息目录各 +18/−0

- 新开 16 键：`virtualKeys.header` 14 键（`backToKeys`/`regenerateKey`/`createNewKey`/`blockKey`/`unblockKey`/`resetSpend`/`deleteKey`/`moreKeyActions`/`copyKeyAlias`/`copyKeyId`/带 `{value}` 的 `keyIdValue`/`lastUpdated`/`userAlias`/`userEmail`）、`teams.infoFallbacksLabel`（`Fallbacks:`／回退：）、`common.copyField`（带 `{label}` 的复制按钮名）；目录叶子 7133→7149
- `RouterSettingsSummary` 与 `TeamInfo.tsx` 内联的那份路由设置摘要同源，8 条展示语逐字节复用 `teams.info*`（`infoRoutingStrategy`/`infoNumberOfRetries`/`infoAllowedFailures`/`infoCooldownTime`/`infoTimeout`/`infoRetryAfter`/`infoTagFilteringEnabled`/`infoNoRouterSettings`），只缺一个不带计数后缀的 `Fallbacks:` 裸标签，故新开 1 键；这样两处口径一致、不会分叉
- `KeyInfoHeader` 的 7 个 `LabeledField` 标签复用 `virtualKeys.columns.*`（`user`/`expires`/`createdAt`/`createdBy`/`lastActive`/`team`/`organization`）、封禁徽标复用 `virtualKeys.status.blocked`、hover 卡片的"用户 ID"复用 `common.filterLabels.userId`，只有该头独有的动作名与"Last Updated"新开键
- `backButtonText = "Back to Keys"` 是 props 默认值、模块级拿不到 `t`，同第 61、62 簇改成可选 props + 渲染处 `?? t("header.backToKeys")`；`RouterSettingsSummary` 的 `emptyText` 默认值同法
- `key_info_view.tsx` 自己也有一个"Back to Keys"返回按钮（第 186 行，未接线），所以 `key_info_view.test.tsx` 里那两处 `/back to keys/i` 保持英文——它们断的是视图层的按钮，不是本簇接线的 `KeyInfoHeader` 按钮
- 连带 4 个测试文件 73 处断言换中文：`KeyInfoHeader.test.tsx` 39 处（含把 `/block key/i`、`/unblock key/i` 这类正则为防"封禁密钥"命中"解除封禁密钥"改成整串精确匹配）、`key_info_view.test.tsx` 23 处、`LabeledField.test.tsx` 5 处（`Copy User ID`→复制 User ID）、`RouterSettingsSummary.test.tsx` 6 处并改挂 `renderWithProviders`
- 验证：`src/lib/i18n` 3 文件 16 例全绿；`templates` + `common_components` + `src/lib/i18n` 42 文件 523 例全绿 + 2 例预期失败；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，8 例仍全落在 `cost_tracking_settings`（7）与 `LensSetup`（1），画像与第 62 簇逐字相同；`tsc --noEmit -p .` 仍 880 条、非测试文件 0 条；改动的三个组件 eslint 0 error 0 warning，`KeyInfoHeader.test.tsx` 2 条、`key_info_view.test.tsx` 20 条均为该文件原有的 testing-library/inline-arg warning；prettier 只需 `--write` 两个组件（HEAD 上这两个文件干净，已用 `--stdin-filepath … --list-different` 验过），两个 messages JSON 继续保留 HEAD 的非 prettier 形态；`npm run build` 退出 0

## 2026-10-15 第 62 簇更新

批次 24 第 62 簇：`common_components/` 里三个小的共享选择器/表格件 `AccessGroupSelector.tsx`、`PassThroughRoutesSelector.tsx`、`simple_table.tsx`，并把第 61 簇放在 `teams` 里的空态语上收到 `common`。7 个文件 +58/−24，两个消息目录各 +7/−1

- 新开 7 键：`access-groups` 的 `selectorPlaceholder`（选择访问组）/`selectorLabel`（访问组）/`selectorLoadFailed`（访问组加载失败）/`selectorEmpty`（未找到访问组），`models.passThrough` 的 `routesPlaceholder`（选择透传路由）/`routesEmpty`（未找到透传路由），以及 `common.noDataShort`（No data／暂无数据）
- `teams.memberTable.noData` 整条删除、上收为 `common.noDataShort`：`MemberTable.tsx` 与 `simple_table.tsx` 的空态兜底都指向它，同值语只留一份；目录叶子 7127→7133（+7 新键、−1 上收），中英同值 87 未变
- 两个选择器的 `placeholder`／`labelText` 仍是可选 props，默认值走渲染处 `?? t(...)` 兜底（同第 61 簇那两处默认参数值的做法），加载失败与空态由 `isError` 分流；`PassThroughRoutesSelector` 的 `console.error` 是开发日志、按既定口径留英文原文
- `simple_table.tsx` 的 `loadingMessage = "Loading..."`／`emptyMessage = "No data available"` 两处默认参数值去掉，改成 props 可选 + 渲染处 `?? commonT("loading")`／`?? commonT("noDataShort")`，调用方仍可自行覆盖
- 消费方零断言改写：`AccessGroupSelector` 与 `PassThroughRoutesSelector` 被 Teams(79)、`create_key_button.integration`(86)、`key_edit_view.integration`(102)、TeamInfo(122+14)、`add_agent_form`(6)、`agent_info`(9)、`MemberTable`(20) 等真实挂载，合计 435 例全绿 + 3 例预期失败——这些调用方本来就各自传中文占位符，默认值换语言不动断言
- `simple_table.test.tsx` 原先用裸 `render`，接线后必须换 `renderWithProviders`（`../../../tests/test-utils`），并补 2 例断"加载中..."与"暂无数据"兜底
- 验证：`src/lib/i18n` 3 文件 16 例全绿；本簇组件测试 3 例全绿；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，8 例全落在 `cost_tracking_settings`（7）与 `LensSetup`（1）这两个已记为上游既有的文件，画像与第 61 簇完全一致；`tsc --noEmit -p .` 仍 880 条、非测试文件 0 条；改动文件 eslint 与 HEAD 同为 0 error；prettier 与第 61 簇一样只对两个 messages JSON 保持 HEAD 原有的非 prettier 形态、不做整文件重排；`npm run build` 退出 0

## 2026-10-15 第 61 簇更新

批次 24 第 61 簇：`common_components/` 的 `MemberTable.tsx` 与 `user_search_modal.tsx` 成员域一对，外加第 60 簇记下的最后一处同名英文串 `ToolPoliciesView.tsx`。9 个文件 +149/−76，两个消息目录各 +21/−0

- 新开 2 组 17 键：`teams.memberTable`（`editTooltip`/`deleteTooltip`/`resetSpendTooltip`/`allRoles`/带 `#` 复数的 `membersCount`/`noMatch`/`noData`/`filtersTitle`/`filtersDescription`/`searchPlaceholder`）与 `teams.memberSearch`（`defaultTitle`/两条角色描述/`existingUsersNotice`/两个搜索占位符/`memberRoleLabel`）；`teams.member` 的 `addMember`/`adding`/`or`/`email`/`userId` 与 `teams.keysUserEmail`、`common` 的 `name`/`actions`/`role`/`empty`/`loading`/`defaultProxyAdmin` 全部逐字节复用，共 11 处
- 默认参数值的两处老问题照第 56、57 簇做法收口：`roleColumnTitle = "Role"` 与 `title = "Add Team Member"` 改成 props 可选 + 渲染处 `?? t(...)` 兜底，`roles = [admin/user 两条]` 整块从参数默认值搬进组件体内的 `resolvedRoles`，否则模块级默认值拿不到 `t`
- `buildColumns` 是模块级工厂，按首参翻译器约定把 `t: TeamsTranslator` 与 `commonT: CommonTranslator` 放进 `MemberColumnDeps`，列头、单元格徽标与三个操作 tooltip 都从 deps 取，工厂本身不引 hook
- `UserSearchModal` 的 `renderUserSearch` 加第 5、6 个参数会撞 `max-params`（上限 4），空态与加载语改为在函数体内直接读 `commonT`，参数表回到 4 个；eslint 画像与 HEAD 同为 5 warning 0 error
- 角色下拉的 `label`（`admin`/`user`）是后端枚举值、组织侧还另传 `org_admin`/`internal_user`，按"下拉取值留作数据"留原文，只翻 `description`
- 连带 3 个测试文件 25 处断言换中文：`MemberTable.test.tsx` 补 1 例断"未传角色列名时落 `角色`、单人计数为 `1 名成员`、筛选抽屉里出现 `全部角色`"（覆盖两处默认值兜底），`TeamMemberTab.test.tsx` 的 7 处含第 60 簇记下的 `Default Proxy Admin`→默认代理管理员，`user_search_modal.integration.test.tsx` 的 16 处含两条 `toHaveTextContent` 正则在中文下永不命中、改成整段子串
- `ToolPoliciesView.tsx` 是第 44 簇那条注释的收尾：标题复用 `nav.toolPolicies`（工具策略），提示语走第 60 簇的 `common.adminOnlyNotice`，测试由正则断言换成整句"工具策略仅管理员可用。"并补一条 h1 断言；它是 `src/components` 根目录里最小的一个未接线文件（44 行 2 句）
- 验证：`src/lib/i18n` 3 文件 16 例全绿；本簇 7 个文件 95 例全绿；四片全量 886 文件 11579 例、8 失败 + 9 例预期失败，8 例全落在 `cost_tracking_settings`（7）与 `LensSetup`（1）这两个已记为上游既有的文件，与本簇无关，与第 60 簇那份"9 例既有 + 1 例本簇自身"的画像相比没有新增；`tsc --noEmit -p .` 仍 880 条、非测试文件 0 条；改动文件 eslint 与 HEAD 同为 5 warning 0 error；prettier 只有两个 `common_components` 组件需要 `--write`（HEAD 上这两个文件是干净的），两个 messages JSON 与第 60 簇一样在 HEAD 即非 prettier 形态、继续不做整文件重排；`npm run build` 退出 0

## 2026-10-15 MCP 接入向导步骤卡的参数缺失修复

第 60 簇跑全量时唯一的 `FORMATTING_ERROR`（162 次重复）出自 `mcp-servers/_components/mcp_connect.tsx` 的 `StepCard`：整批翻译时把标题 `title` 换成 `titleKey` 并复用正文的键，标题那次 `t(titleKey)` 不给 `copyConfig` 传 `{mac}`/`{windows}`，运行期直接炸成原样串；`openSettings` 则相反，本身没有占位符、正文传的多余参数被丢弃，快捷键那半句在两种语言里都丢了。详见 `FIXES.md` 的"2026-10-15 标题复用正文键"

- 按上游的三个标题 + 三个正文拆开：新开 `mcpConnect.navigateToMcpTools`/`addConfiguration`/`openSettingsShortcut` 3 键（后者带 `{mac}`/`{windows}`），标题不再复用正文，两个消息目录各 +3/−0
- `mcp_connect.test.tsx` 补 1 例：打开 Cursor 页签后断三个中文标题、断插值后的快捷键整句，并断面板里不再出现裸 `{mac}`。这条是**运行期**缺陷的守卫，`missingKeys` 抓不到（`t(变量)` 属动态键）、`messagesParity` 也抓不到（两侧键树一直对齐）
- 验证：`src/app/(dashboard)/mcp-servers` + `src/lib/i18n` 44 文件 772 例全绿 + 2 例预期失败，日志里 `FORMATTING_ERROR` 清零；`tsc` 仍 880 条、非测试 0 条；`mcp_connect.tsx` 的 2 条 eslint warning（第 57、79 行）与 HEAD 同位置同内容，本簇未触及；该文件 HEAD 上本就有 23 行 prettier 差异（整批翻译留下的），本簇改动行不在其中，因此没有 `--write` 顺手清扫无关区域；`npm run build` 退出 0

## 2026-10-15 第 60 簇更新

批次 24 第 60 簇：`common_components/` 的 `DefaultProxyAdminTag.tsx` 与 `LoadingScreen.tsx`、`shared/AdminOnlyNotice.tsx` 三个 `common` 小件，加上 `memory`/`workflows`/`guardrails-monitor` 三个页面的管理员专享提示。6 个非测试文件共 +25/−11，两个消息目录各 +2/−0

- 新开 2 键、复用 1 键：`common.defaultProxyAdmin`（`Default Proxy Admin`→默认代理管理员）与带 `{pageTitle}` 的 `common.adminOnlyNotice`（`{pageTitle} is only available to admin users.`→`{pageTitle}仅管理员可用。`）；加载屏那句 `Loading...` 与已有的 `common.loading` 逐字节相同，直接复用，品牌串 `🚅 LiteLLM` 属数据留原文
- 中文提示条不带空格：三个调用点传进来的标题已是中文（记忆/工作流运行/护栏监控），`记忆 仅管理员可用。` 中间的空格是英文句式残留，中英两边按各自语言习惯写成 `{pageTitle} is only…` 与 `{pageTitle}仅管理员可用。`
- 提示条的标题参数由页面自己给：三个页面把 `AdminOnlyNotice` 的 `pageTitle` 换成各自命名空间的现成键（`memory.title`、`workflows.title`、`guardrailsMonitor.overview.title`），组件不再依赖调用方传英文，`AdminOnlyNotice` 从箭头直接返回 JSX 改为带 `t` 的函数体
- **连带成本落在 10 个测试文件**：这三个小件的消费者全是"整树渲染"的——`DefaultProxyAdminTag.test.tsx`（4 处裸 `render`）与 `LabeledField.test.tsx`（13 处）与 `KeyInfoHeader.test.tsx`（38 处）改挂 provider，`TeamVirtualKeysTable`/`AuditLogsTable` 与上述三文件共 9 条 `Default Proxy Admin` 断言换中文，三个页面的集成测试各 1 条提示语换成"记忆仅管理员可用。"这类整句
- `LoginPage.test.tsx`（+12/−72）与 `LoginPage.integration.test.tsx`（+3/−10）拆掉了手搭的 `QueryClientProvider` 与 `createQueryClient` helper 改走 `renderWithProviders`，`LoginPage.tsx` 本身未接线、标题断言仍为英文；`tests/CreateKeyPage.expiredToken.test.tsx` 补 `vi.mock(LoadingScreen)` 桩，与同目录 `layout.test.tsx`/`page.test.tsx` 的既有做法一致
- 两处同名英文串**不在本簇账上**：`common_components/MemberTable.tsx:146` 的 `StatusBadge label="Default Proxy Admin"` 与 `ToolPoliciesView.tsx:30` 的 `Tool Policies is only available to admin users.`，两个文件都还没接线，`TeamMemberTab.test.tsx:276` 与 `ToolPoliciesView.test.tsx:42` 的断言因此保持英文

验证：`src/lib/i18n` 3 文件 16 例全绿；本簇 26 个文件 232 例全绿；一次全量 4 分片 886 文件 11577 例、12 失败 + 9 例预期失败，其中 3 例正是 `CreateKeyPage.expiredToken` 缺 `LoadingScreen` 桩（补桩后单跑全绿），余下 9 例落在 `cost_tracking_settings`（7）与 `LensSetup`（2）这两个已记为上游既有的文件上，`LensSetup` 单跑只红 1 例、另一例是分片并发时序假红；`tsc --noEmit -p .` 仍 880 条、非测试文件 0 条；`npx eslint` 改动 17 个 tsx 与 HEAD 同为 14 条 warning，仅两行行号因新增 import 各前移 1 行；`npm run build` 退出 0；prettier 只有 `KeyInfoHeader.test.tsx` 因 `renderWithProviders(` 变长需要折行，已 `--write` 收掉，两个 messages JSON 继续不做整文件重排

## 2026-10-15 第 59 簇更新

批次 24 第 59 簇：`common_components/MetadataKeyValueFields.tsx`（157 行，+16/−12）与 `common_components/RateLimitTypeFormItem.tsx`（122 行，+34/−41）这一对密钥/团队表单块接入各自的 `teams` 与 `virtualKeys`，两个消息目录各 +19/−0 行。前者是元数据键值对编辑器，只有 `Teams.tsx` 与 `team/TeamInfo.tsx` 两个消费者；后者是 TPM/RPM 速率限制类型下拉，只有 `organisms/create_key_button.tsx` 与 `templates/KeyEditViewControls.tsx` 两个消费者

- 新开 2 组共 15 键：`teams.metadata`（`key`/`value`/`removePair`/`addPair`/`missingKey`/`duplicateKey` 6 键）与 `virtualKeys.rateLimitType`（`label`/`tooltip`/`selectPlaceholder`/`bestEffort`/`guaranteed`/`dynamic` 与三条 `*Description` 9 键）
- 复用 1 键：详细模式下第一个选项的标签在英文里就是 `"Default"`，直接走第二条 `useTranslations("common")` 的 `common.default`；而收起模式（`showDetailedDescriptions={false}`）同一个值是 `rateLimitType.bestEffort`，两处分开是源码本来的不一致，不改渲染
- 带参消息：`label` 是 `{type} Rate Limit Type`（`upper` 由调用点算好传入），`tooltip` 内插两次 `{type}`，`bestEffortDescription`/`guaranteedDescription` 内插 `{lower}`，`dynamicDescription` 内插两次 `{upper}`。ICU 允许同名参数重复出现，`{lower}`/`{upper}` 直接传 `type.toLowerCase()`/`toUpperCase()`，`tpm`/`rpm` 这两个字母串属数据，两边都不翻译
- **zod 校验消息**必须走工厂：模块级的 `metadataPairsSchema` 在 import 时求值，`useTranslations` 拿不到。按第 54 簇 `buildSubmitGuardrailSchema(t: GuardrailsTranslator)` 的既有做法改为 `buildMetadataPairsSchema(t: TeamsTranslator)`，两个消费者（`Teams.tsx:86` 与 `TeamInfo.tsx:430` 的 schema builder）本就持有 `t`，改动各 2 行
- 模块级函数下沉：`rateLimitTypeOptions`/`plainLabels`/`rateLimitTypeLabelText`/`rateLimitTypeTooltip` 四个纯函数合并进组件体，`plainLabels` 改为 `t(...)` 攒出的局部映射，选项数组直接内联——留一个只接翻译器的模块级函数没有意义

测试侧：`MetadataKeyValueFields.test.tsx` 的 harness schema 从模块级移进 `Harness` 组件（`useMemo` + `useTranslations("teams")`），11 处裸 `render` 换 `renderWithProviders`，键值对占位符、按钮名、aria-label 与两条校验消息共 20 余处断言同步中文，`rerender` 由 `renderWithProviders` 的返回值继续提供（批量替换把 `rerender(` 误写成 `rerenderWithProviders(` 已修）；`RateLimitTypeFormItem.test.tsx` 本来就挂 provider，5 处断言改中文。四个消费者里 `TeamInfo.test.tsx`（7 处）、`create_key_button.integration.test.tsx`（2 处）、`key_edit_view.integration.test.tsx`（3 处，含 `chooseSelectOption` 的 `/^保证吞吐/`）跟着换成中文；`Teams.test.tsx` 是唯一 `vi.mock("next-intl")` 的消费者，mock 查不到键就回落到键名本身，所以它**保持英文断言**、改为在 `mockTranslations` 里补 6 条 `teams.metadata.*`（第 53 簇"mock 的要补"那条口径的第二次落地）

其余门禁：自身 2 文件 26 例 + 守卫 3 文件 16 例 + 4 个消费者文件 389 例全过；再扩到 `common_components`、`team`、`TeamsPage`、`organisms`、`templates` 整范围 73 文件 1313 通过 / 3 例预期失败、`Type Errors no errors`；`npx tsc --noEmit -p .` 总 880、非测试 0，与基线同数；`npx eslint` 10 个 `.tsx` 文件 0 error / 128 warning，与 HEAD 版同数（备份 /tmp → `git checkout HEAD --` → 复跑 → 还原）；prettier 只 `--check`：`TeamInfo.tsx`、`TeamInfo.test.tsx` 与两份消息目录报警，前两者把 HEAD 版拷到 /tmp 复跑确认改动前就不合规，按口径不跑 `--write`，其余 8 个文件干净；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 445 到 447 个、48.8% 到 49.0%，目录叶子 7090 到 7105，中英同值 87 不变

## 2026-10-15 第 58 簇更新

批次 24 第 58 簇：`common_components/OrganizationDropdown.tsx`（45 行，+5/−3）、`common_components/ProjectDropdown.tsx`（44 行，+4/−2）、`common_components/UserDropdown.tsx`（66 行，+5/−3）这三台实体选择器接入各自的 `organizations` / `projects` / `users` 作用域，两个消息目录各 +5/−0 行。三台的改动都只在传给 `SearchSelect` / `PaginatedSearchSelect` 的 `placeholder`、`emptyText`、`loadingText` 三个展示 props 上，选项 `label`/`sublabel` 是别名与 id，属数据不动。消费者面：组织那台在 `TeamSSOSettings`、`organisms/create_key_button`、`templates/key_edit_view`，项目那台只有 `create_key_button`，用户那台在 `usage/EntityUsage`、`usage/UsagePageView`、`cost-optimization/ShadowEvalStartForm`

- 复用 4 条已有键：`organizations.noOrganizations`、`users.noUsers`、`users.loading`、`projects.loading`，都在各自同一作用域里取顶层键，不算跨组借
- 新开 5 键：`organizations.allOrganizations`（All Organizations/全部组织）、`organizations.dropdownLoading`、`projects.searchOrSelectProject`（Search or select a project/搜索或选择项目）、`projects.noProjectsFound`（No projects found/未找到项目）、`users.dropdownSearch`（Search users by email…/按邮箱搜索用户…）。`organizations.dropdownLoading` 必须单开：它与已有 `organizations.loading` 是"正在加载组织…"（U+2026）与三点式的两种字节形态，沿用第 52、56 簇"省略号形态不同值就另开"的口径；`noOrganizations` 与 `dropdownLoading` 同理各留各的
- `OrganizationDropdown` 的 `placeholder = "All Organizations"` 是**默认参数值**，与第 56、57 簇同样处理：删默认值、渲染处 `placeholder ?? t("allOrganizations")`，这样显式传占位符的消费者不受影响

测试侧：`OrganizationDropdown.test.tsx`（7 例）与 `UserDropdown.test.tsx`（13 例）都是裸 `render`，20 处换成 `renderWithProviders(`（`view.rerender` 不动）。这两份自身测试不断言这三句英文，只断言选项文本与 onChange 值，因此自身零断言改动。唯一被打破的是消费者的占位符断言 2 处：`UsagePageView.test.tsx:894` 的 `promptsWith("Search users by email…")` 与 `EntityUsage/EntityUsage.test.tsx:1375` 的 `toHaveAttribute("placeholder", …)`，都改成 `按邮箱搜索用户…`。`create_key_button.integration.test.tsx` 里的 `"No users found"` / `"Searching..."` 属于仍未接入的 `user_search_modal`，不是 `UserDropdown`，按口径不动

其余门禁：自身 2 文件 20 例 + 守卫 3 文件 16 例 + 消费者与 `common_components`、`usage`、`organisms`、`cost-optimization` 整范围 40 文件 894 通过 / 3 例预期失败、`Type Errors no errors`；`npx tsc --noEmit -p .` 总 880、非测试 0，与基线同数；`npx eslint` 9 个文件 0 error / 48 warning，与 HEAD 版逐条同数（22 `testing-library/no-node-access`、13 `no-explicit-any`、6 `testing-library/no-container`、5 `local/no-large-inline-object-arg`；备份 /tmp → `git checkout HEAD --` → 复跑 → 还原）；prettier 只 `--check`：`EntityUsage.test.tsx` 与两份消息目录报警，把 HEAD 版拷到 /tmp 复跑确认 `EntityUsage.test.tsx` 在本簇改动前就不合规，按口径不跑 `--write`；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 442 到 445 个、48.5% 到 48.8%，目录叶子 7085 到 7090，中英同值 87 不变

## 2026-10-15 第 57 簇更新

批次 24 第 57 簇：`common_components/ModelSelector.tsx`（116 行，+8/−6）与 `common_components/ModelAliasManager.tsx`（324 行，+28/−25）这一对模型选择器/别名管理台接入 `models`，两个消息目录各 +24/−0 行。单选那台是全库被引用最多的模型选择器之一——`Teams.tsx`、`team/TeamInfo.tsx`、`organisms/create_key_button.tsx`、`app/chat/page.tsx`、`prompts/…/ModelConfigCard.tsx`、`MCPSemanticFilterTestPanel` 与 `models-and-endpoints` 都用它，别名管理台又内嵌它，所以连带成本仍然只在 provider，不在断言

- 新开 2 组共 20 键：`models.selector`（`label`/`placeholder`/`customOption`/`customPlaceholder` 4 键）与 `models.aliasManager`（16 键：6 句 toast 与校验、`addNew`/`manageExisting`/`aliasName`/`aliasNamePlaceholder`/`selectTargetModel`/`editAliasName`、带 `{name}` 的 `editAlias`/`deleteAlias`、空表提示、配置示例标题与说明）
- 复用已有键：表头"Target Model/目标模型"与按钮"Add Alias/添加别名"直接用同作用域的 `t("modelGroupAlias.targetModel")`、`t("modelGroupAlias.addAlias")`，不算跨组借；`Save`/`Cancel`/`Actions` 另开第二条 `useTranslations("common")` 取 `common.save`/`common.cancel`/`common.actions`——一个组件两个翻译器是本长尾既有做法，比复制三份同值键干净
- `ModelSelector` 的 `placeholder = "Select a Model"` 与 `labelText = "Select Model"` 都是**默认参数值**，与第 56 簇多选那台同样处理：删默认值、渲染处 `?? t(...)`。`MCPSemanticFilterTestPanel.tsx:79` 显式传的死 `labelText="Select Model"` 保持英文——那台组件自身还没接入，这条属它自己的账，本簇不动
- 选项对象 `{ value: "custom", label: "Enter custom model" }` 里只有 `label` 是文案，`value` 与 `onModelChange` 里对 `"custom"` 的比较都不动
- 配置示例卡片里的 `model_aliases:` 与 `# No aliases configured yet` 是 YAML 代码块内容，按既定口径留英文，只汉化卡片标题与说明两句

测试侧：两份自身测试都是裸 `render`，5 处换成 `renderWithProviders(`；`ModelSelector.test.tsx` 的选项名与占位符改中文（`输入自定义模型`、`输入自定义模型名称`），`ModelAliasManager.test.tsx` 的 `Alias Name`、`/add alias/i`、`Edit alias name`、`Save`、`Cancel`、`Edit fast-model`、`Delete fast-model`、空表提示 8 处改中文。`aria-label` 从模板串换成 `t("aliasManager.editAlias", { name })` 后，断言用整串 `"编辑 fast-model"` 而不是 `Edit ${…}` 的正则。同一文件里那条"读源码"的暗色 token 守卫断言 `toContain("Manage Existing Aliases")`，这句接入后进了目录，锚点换成同文件稳定的 `ModelAliasManagerProps`（守卫真正要证明的是 `readFileSync` 读到了内容）。9 个消费者文件（`TeamInfo`、`TeamInfo.integration`、`Teams`、`MCPSemanticFilterTestPanel`、`ModelConfigCard`、`models-and-endpoints/page.integration`、`create_key_button` 两份、`app/chat/page.integration`）**零断言改动全绿**

其余门禁：自身 2 文件 10 例 + 守卫 3 文件 16 例 + 消费者 9 文件 330 例（1 例预期失败）全过；`npx tsc --noEmit -p .` 总 880、非测试 0，与基线同数；`npx eslint` 4 个 `.tsx` 文件 0 error / 2 warning，与 HEAD 版同数（备份 /tmp → `git checkout HEAD --` → 复跑 → 还原，两条 `testing-library/no-node-access` 是 `.closest("tr")` 的既有告警，只因新增 import 从 122 行移到 123 行）；prettier 只 `--check`：`ModelSelector.tsx` 与 `ModelSelector.test.tsx` 干净，`ModelAliasManager.test.tsx` 与两份消息目录在 HEAD 上本就不合规（把 HEAD 版拷到 /tmp 复跑确认），按口径不跑 `--write`；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 440 到 442 个、48.2% 到 48.5%，目录叶子 7065 到 7085，中英同值 87 不变

## 2026-10-15 第 56 簇更新

批次 24 第 56 簇：`common_components/team_dropdown.tsx`（109 行，+6/−4）与 `common_components/team_multi_select.tsx`（71 行，+7/−5）这一对团队选择器接入 `teams`，两个消息目录各 +4/−0 行。这对文件是全库被引用最多的选择器之一：单选那台被 `CreateUserButton`、`add_model/AddModelForm` 与 `add_auto_router_tab`、`organisms/create_key_button`、`ToolDetail`、`agents/add_agent_form`、`guardrails/TeamGuardrailsTab` 七处使用，多选那台在 `usage/EntityUsage` 与 `cost-optimization/ShadowEvalStartForm`。改动全落在传给 `PaginatedSearchSelect` / `PaginatedMultiSelect` 的四个展示 props 上，选项 `label`/`sublabel` 是团队别名与 `team_id`，属数据，不动

- 复用两条已有键：`teams.noTeams`（No teams found/未找到团队）与多选那台的 `teams.loading`（正在加载团队...），同一个 `useTranslations("teams")` 作用域里取顶层键，不算跨组借
- 新开 4 键：`dropdownSearch`（Search or select a team/搜索或选择团队）、`dropdownLoading`、`multiSelectSearch`（Search teams by alias.../按别名搜索团队...）、`multiSelectClearAll`（Clear all teams/清空全部团队）。`dropdownLoading` 必须单开：单选那台写的是 `Loading teams…`（U+2026），与 `teams.loading` 的三点式不同字节，沿用第 52 簇"省略号形态不同值就另开"的口径，两边渲染都保持原样
- `team_multi_select` 的占位符原来是**默认参数值** `placeholder = "Search teams by alias..."`。默认参数在 hook 之前求值，只能改成 `placeholder` 无默认 + 渲染处 `placeholder ?? t("multiSelectSearch")`；`ShadowEvalStartForm` 本来就自带 `costOptimization.shadowEval.searchTeams` 的占位符传进来，走 `??` 左侧不受影响，只有 `EntityUsage` 吃到新的中文兜底
- 单选那台里 `teams.find((t) => t.team_id === teamId)` 的参数与新加的翻译器 `t` 重名，改成 `(team) =>`，避免遮蔽

测试侧：两份自身测试都是裸 `render`，接入后必须有 provider，11 处 `render(` 换成 `renderWithProviders(`（`rerender` 与 `view.rerender` 不动，靠正则 `(?<![A-Za-z])render\(` 区分）；`team_multi_select.test.tsx` 的 `/No teams found/` 换成 `/未找到团队/`，而它自己传入的 `"Search teams by alias..."` 是消费者 props，两处断言保持英文。7 个消费者文件与 `add_model`、`agents`、`guardrails`、`usage`、`cost-optimization`、`organisms` 整目录一起复跑 **100 文件 1874 例全绿**（1 例预期失败），说明这轮的连带成本只在 provider，不在断言——消费者测试里没有任何一条查这三句英文

其余门禁：`src/lib/i18n` 守卫 3 文件 16 例全过；`npx tsc --noEmit -p .` 总 880、非测试 0，与清扫簇同数；`npx eslint` 4 个文件 0 error / 3 warning，与 HEAD 版同数（备份 /tmp → `git checkout HEAD --` → 复跑 → 还原）；prettier 四个文件 HEAD 与改后都干净，不跑 `--write`；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 438 到 440 个、48.0% 到 48.2%，目录叶子 7061 到 7065，中英同值 87 不变

## 2026-10-15 第 55 簇后的全量快照

批次 24 第 53 到 55 簇之后做一次全量：`npx vitest run --shard=k/4` 四片串行，得 **886 文件 11577 例、27 失败 + 9 例预期失败**、`Type Errors no errors`。比第 53 簇那次的 56 失败少 29 例，几乎全部来自第 54 簇修掉的决策模型集成测试。27 例逐个归因如下（按失败数降序）：

| 文件 | 例 | 归因 |
| --- | --- | --- |
| `cost-tracking/_components/cost_tracking_settings.test.tsx` | 7 | 上游既有失败，非汉化欠账（下方单列） |
| `components/model_add/CredentialModal.test.tsx` | 5 | 断言欠账：`useTranslations` 缺 `NextIntlClientProvider` 上下文 |
| `organizations/_components/OrganizationsTable.test.tsx` | 3 | 断言欠账 + **组件残留 2 处**（下方单列） |
| `agents/_components/agent_info.integration.test.tsx` | 3 | 断言欠账：`Agent Name`、`Display Name` |
| `access-groups/…/AccessGroupEditModal.integration.test.tsx` | 2 | 断言欠账：选项卡名 `/MCP Servers/` |
| `components/templates/key_info_view.test.tsx` | 1 | 断言欠账：第 53 簇 `DeleteResourceModal` 11 个消费者里漏掉的一个 `/^delete$/i` |
| `components/shared/DataTable/DataTable.test.tsx` | 1 | 早前迁 `renderWithProviders` 时漏改的裸 `render`（同第 54 簇 `guardrail_info` 那一类） |
| `lens/_components/LensSetup.integration.test.tsx` | 1 | 上游断言与格式化函数对不上，非汉化欠账（下方单列） |
| `agents/_components/agent_info.test.tsx` | 1 | 断言欠账：`Edit Settings`、`Description`、`TPM Limit` |
| `agents/_components/add_agent_form.integration.test.tsx` | 1 | 断言欠账：`Agent Name`、`Display Name`、描述占位符 |
| `agents/_components/AgentsTable.test.tsx` | 1 | 断言欠账：表头「消费（美元）」「智能体名称」 |
| `access-groups/…/AccessGroupCreateDialog.test.tsx` | 1 | 断言欠账：名称、MCP/代理选项卡、创建按钮 |

上表 12 个文件已全部在本次清扫中改绿；第 53 簇记下的 `mcp_server_edit` 那 1 例这次没有复现。清扫与门禁明细见"## 2026-10-15 断言欠账清扫"。

两条**不是**汉化欠账的判定过程，记下来避免以后重复排查：

- `cost_tracking_settings.test.tsx` 的 7 例。一开始以为是本长尾的欠账，但 DOM 里只有 4 个按钮、`TabsContent` 没展开，不像文案问题。把同一文件在导入快照 `610473cb` 上跑一遍（`git worktree add -f /tmp/up_base 610473cb` + 软链 `node_modules`），结果同为 7 失败 / 12 通过，失败用例名逐行 `diff` 相同——判定为上游既有失败，文件保持原样。教训是基线必须用**未改动的组件**跑：拿英文测试配我们改过一半的组件（`eb8394dc^` 那次）会得到 14 失败的污染基线
- `LensSetup.integration.test.tsx:119` 的 `expect(screen.getByText(/2026-09-30/))`。被断言的时间由 `lensData.runTime` → `utils/activityTimestamp.formatActivityTimestamp` 输出，后者是 `toLocaleString(undefined, …)`，实机渲染为 `Sep 30, 2026, 6:00:00 PM GMT+8`，`2026-09-30` 这种 ISO 形态在任何 locale 下都匹配不上；且 `src/app/(dashboard)/lens` 与 `src/utils/activityTimestamp.ts` 自上游同步 `f8786efb` 以来 `git diff` 为空。判定为上游测试自身的缺陷（且依赖 runner 时区），不动

`OrganizationsTable` 的 3 例是这次唯一牵出**组件残留**的：断言早就写着中文，红的原因是 `OrganizationsTableColumns.tsx` 里 `Created` 表头和 `{n} Members` 单元格漏接入。补完两处后同向变绿——这是"测试期望中文、组件还给英文"这一类失败的标准解释路径，不要反过来把断言改回英文。`Members` 那处新开 `organizations.membersCount`，英文 `{count, plural, other {# Members}}`、中文 `{count, number} 成员`：裸 `#` 在 ICU 里会原样输出，必须走 `other {}` 分支。

度量口径修正一条：`view_logs` 其实已经全量接入。度量脚本仍在 71 个文件里列出 9 个"未接入"（`PrettyMessagesView`、`SimpleMessageBlock`、`JsonToolView`、`columns.tsx`、`SpanIcon`、`Collapse`、`AgentTracesPage`、`ActiveDot`、`AuditLogsTableColumns`），逐个读下来要么没有任何面向用户的文案，要么通过 props 收翻译器（`LogsTranslator`）。脚本按"文件里有没有 `useTranslations`"计数，因此该目录的剩余量长期**高报**，看长尾规模时按 0 处理。

## 2026-10-15 断言欠账清扫

批次 24 第 55 簇后的定向清扫，不动任何文案键的语义（除上面那条 `membersCount`），只把已汉化组件的测试断言对齐：11 个测试文件 + `OrganizationsTableColumns.tsx` + 两个消息目录，共 69 行插入 / 36 行删除。

- `CredentialModal.test.tsx` 沿用第 53 簇 `CloudZero` 的做法：测试自带 `createQueryClient()`，不换 `renderWithProviders`，在树内补一层 `<LocaleProvider locale="zh-CN">`
- `DataTable.test.tsx` 第 162 行的裸 `render` 换成 `renderWithProviders`（同文件另外 11 处早已是后者）
- `agents` 三个文件的字段名走 `agent_form_fields.tsx` 的 `configText` + `FIELD_TEXT_KEYS` 表：`Agent Name`→智能体名称、`Display Name`→显示名称、`Describe what this agent does...`（占位符）→描述这个智能体的用途...、`TPM Limit`→`agents.tpmLimit` 的 TPM 限制。同文件里 `URL` 中英同值、`Save Changes` 与 `Settings` 选项卡仍属未接入部分，断言原样保留
- `AccessGroupCreateDialog.test.tsx` 只换查询里的文案，mock 数据名（`GitHub MCP`、`Support Agent`、`srv-1`）不动——它们是接口数据
- 判定"是组件残留还是断言欠账"靠改前改后各跑一遍：`add_agent_form.integration.test.tsx:390` 的 `getByLabelText("TPM Limit")` 在清扫后仍通过，说明那条走的是另一处未接入的表单，不在本簇范围

门禁：`src/lib/i18n` 守卫 3 文件 16 例全过；清扫范围与既有簇范围合并复跑（`view_logs`、`chat`、`app/chat`、`app/connect`、`agents`、`organizations`、`access-groups`、`model_add`、`shared/DataTable`、`templates`、`liteadmin`、`AIHub`、`guardrails`）→ **109 文件 1282 例全绿**、2 例预期失败；`npx tsc --noEmit -p .` 总 880、非测试 0（比第 54 簇的 881 少 1）；`npx eslint` 11 个改动文件 0 error / 39 warning，与 HEAD 版同数（备份 /tmp → `git checkout HEAD --` → 复跑 → 还原）；prettier 4 个文件（含 `PLAN.md`、`PROGRESS.md`）**HEAD 本就不干净**，按口径不跑 `--write`；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 438 个、48.0%，目录叶子 7060 到 7061，中英同值 87 不变。

## 2026-10-15 第 55 簇更新

批次 24 第 55 簇：`guardrails/_components/guardrail_garden_detail.tsx`（+9/−9）里的护栏分类标签接入 `guardrails.garden`，两个消息目录各 +3/−0 行。触发点是第 54 簇复跑 `guardrails` 目录时剩下的 2 例：详情页的表头、选项卡、按钮在早前几簇已经汉化，唯独分类这一行的**值**还是模块级常量 `CATEGORY_LABELS` 里写死的英文，同一行中英混杂（`提供商` / `Decision Model`），`getByRole("row", { name: … })` 的可访问名因此对不上

- 六个标签里有四个能逐字节复用同组已有键：`garden.litellmTitle`、`garden.typeContent`、`garden.providerPartner`、`garden.typePartner`。`providerPartner`/`typeContent`/`typePartner` 三个建组时还没有调用点（死键没有守卫，只能这样人工发现），本簇正好接上，不开新键
- 决策模型一栏没有现成键，新开 `providerDecisionModel`、`typeDecisionModel` 与 `costDecisionModel`。前两个的英文与 `guardrails.decisionModel.modelLabel` 同值，但按"分组命名空间内不跨组借"的口径留在 `garden` 里，与上面四个同组键对齐；这条重复记账，攒够第三次再上收
- `$0 / request`、`<1ms`、评测表里的 `"0"` 与 `{precision}%` 都是数据/格式，不动
- 测试侧把两条行名与一条 `getAllByText`、一条 `getByText` 换成中文，`/^Cost/` 换成 `/^费用/`

## 2026-10-15 第 54 簇更新

批次 24 第 54 簇：`guardrails/_components/decision_model/` 整个目录接入 `guardrails`，新开 `decisionModel` 分组 46 键，两个消息目录各 +49/−0 行。这是批次 24 里少见的"一个特性一套目录"的簇：`DecisionModelFields.tsx`（262 行，+49/−40）、`DecisionTestSection.tsx`（165 行，+22/−22）、`DecisionModelDetails.tsx`（56 行，+25/−21）、`buildDecisionModelParams.ts`（60 行，+9/−4），加上 `add_guardrail_form.tsx` 的两处调用点（+2/−2），改完目录内已无硬编码英文

改造形态：

- `guardrails` 是分组命名空间，新组落在 `judge` 与 `perm` 之间，与页面上"决策模型"这一档的位置对应。46 个键覆盖横幅、模型选择、问题列表、试跑区、只读详情五块；`<strong>Decision Model</strong>` 那句走 `t.rich`，`strong` 在富文本白名单内
- 动作下拉的 `ACTION_ITEMS` 是模块级常量，标签要跟着 `t()` 走只能整体搬进组件成为 `actionItems`
- `decisionChecksProblem()` 是纯函数校验器，不在 React 树里，取首参约定之外的第二种形态：**收翻译器**（`t: GuardrailsTranslator`）。`src/lib/i18n/translators.ts` 里的命名空间翻译器类型不是 `(key: string) => string`，next-intl 的 `t` 可以直接传，而 stub 必须先 `as unknown as GuardrailsTranslator`。`tests/i18nStub.ts` 为此从固定 `mcpServers` 作用域重构成 `enMessagesFor(namespace)`，旧的 `enMessages` 保持原语义
- 数据/格式债照旧不翻：`runTestShortcutLabel()` 的 `⌘/Ctrl+Enter`、`check.action ?? "block"` 的枚举值、provider 显示名来自 `getProviderLogoAndName`

测试同步是三份文件，也是本簇的主要成本：

- `add_guardrail_form.decision_model.integration.test.tsx`（+90/−94）22 例此前**全红**——它在第 53 簇的全量快照里独占约 20 例失败。第一处 `findByLabelText("Guardrail Name")` 就查不到，整条链路后续都走不到。逐条换成中文后全绿。模型提供商名（`Decision Model`、`Presidio PII`、`LiteLLM LLM as a Judge`）来自 `getGuardrailProviderSpecificParams` 的 mock `ui_friendly_name`，是接口数据，继续按英文断言；`queryByLabelText("Decision Provider")` 是断言"这个字段不存在"，中英都不存在，留着不误导
- `guardrail_info.test.tsx`（+8/−8）有两处裸 `render()` 是上一轮迁 `renderWithProviders` 时漏改的，`ReferenceError: render is not defined`，被误记成 i18n 失败。这两例正是决策模型详情的用例，一并修掉，顺带少了 2 条 `tsc` 错误
- `buildDecisionModelParams.test.ts`（+9/−5）5 个调用点补上翻译器，断言仍走 `enMessagesFor("guardrails")` 查真实英文文案

其余门禁：`src/app/(dashboard)/guardrails` + `src/lib/i18n` 复跑 44 文件 348 例全绿（目录本身 41 文件 332 例）；`npx tsc --noEmit -p .` 总 881、非测试 0，比第 53 簇的 883 少 2 条，就是上面那两个裸 `render`；`npx eslint` 11 个改动文件 0 error / 35 warning，与 HEAD 版逐文件同数（备份到 /tmp → `git checkout HEAD --` → 复跑 → 还原）；prettier 六个文件因本簇改动引入格式漂移（HEAD 版都干净），`--write` 后 `--check` 全过；`npm run build` exit 0；覆盖率复测非测试 `.tsx` 912 个接入 438 个、48.0%，目录叶子 7060、中英同值 87

## 2026-10-15 第 53 簇更新

批次 24 第 53 簇：`common_components/DeleteResourceModal.tsx`（112 行，接入后 117，+8/−3）接入 `common`，新开 2 键、复用 `common` 的 cancel/delete，两个消息目录各 +2/−0 行。这是批次 24 里第一个"共享组件本体只有两句话、消费者却铺满全库"的文件：它被 20 个页面用作删除确认弹窗，改动落到 13 个 `.tsx`（1 个源文件 + 1 个自身测试 + 11 个消费者测试），共 51 行插入 / 45 行删除

改造形态：

- `common.deleting` = `Deleting...`/删除中...，与 `mcpServers.deleting`、`playground.agentBuilder.deleting` 是同一句的第三次出现，本簇把新键放在共享之家 `common` 而没有另立，也没去动那两个已有键（第 51 簇的"重复攒够再上收"口径）
- `common.typeNameToConfirmDeletion` = `Type <strong>{name}</strong> to confirm deletion:` / 输入 `<strong>{name}</strong>` 以确认删除：。原 DOM 是文本 + 一个 `font-semibold text-destructive` 的 `<span>`，改走 `t.rich`，`strong` 渲染器仍产出同样的 `<span className="font-semibold text-destructive">`，`<label>` 不在守卫的富文本标签白名单里、`<strong>` 在（第 46 簇已验证）
- `common.cancel`/`common.delete` 逐字节相同直接复用；`value ?? "-"` 的破折号沿用第 46 簇的既有写法留作格式债，不另开键

测试侧四类连带改动，正是共享组件接入的固定成本：

- 把本组件 `vi.mock` 掉的测试不受影响，`Fallbacks.test.tsx` 与 `MakeModelPublicForm.test.tsx` 都在 mock 里自己画 Cancel/Delete 按钮，一度怀疑受牵连、按 HEAD 复跑确认无关
- 自己 mock `next-intl` 的测试会撞 `t.rich is not a function`——`Teams.test.tsx` 的 mock 只返回一个函数。改成 `Object.assign(translate, { rich: … })`，`rich` 走同一条查表路径再把 `<strong>`/`</strong>` 去掉，保持该文件"断言读真实英文文案"的原意
- 裸 `render` 且真挂到本组件的测试会撞 `Failed to call useTranslations because the context from NextIntlClientProvider was not found`。`CloudZeroIntegrationSettings.test.tsx` 与 `DeleteSSOSettingsModal.test.tsx` 自带 `QueryClientProvider`（有自己的 queryClient），所以不换成 `renderWithProviders`，改为在其内部再套一层 `<LocaleProvider locale="zh-CN">`
- 已经用 `renderWithProviders` 的 8 个测试只需把按钮名换成中文：`"Cancel"`→取消、`"Delete"`→删除、`/delete/i` 与 `/^delete$/i`→/删除/ 与 /^删除$/、`/deleting/i`→/删除中/。`policies/_components/index.test.tsx` 的 `/deleting/i` 是同一条弹窗按钮的第二次断言，容易漏

`AccessGroupsPage.test.tsx` 与 `AutoRoutersPanel.test.tsx` 换完正则后行长变化，prettier 做了 2 次收拢（5 行减成 3 行、2 行各自重排），本簇按口径只对 `.tsx` 跑 `--write`

验证方法补记：接入前不知道消费者测试有多少会红，做法是先把改动过的 15 个文件备份到 /tmp、`git checkout HEAD --` 回退（共享工作区不做 stash）、跑一遍受影响的 27 个测试文件记下每个文件的失败数，再恢复改动跑同一批，逐文件比对失败画像。本簇结果是两边同为 15 个文件失败、同一组测试失败，即无新增；随后全量复跑 `npx vitest run` 得 886 文件 11577 例、56 失败、9 例预期失败，`Type Errors no errors`；这一份是当前最新的全量快照，比第 18 簇那次（11576 例 / 57 失败）新，可与它对照。56 例里 `mcp_server_edit` 1 例是计划内已记的欠账，`AutoRoutersPanel` 与 `AccessGroupBudgetsPanel` 只在并发下偶发、单跑全绿，`cost_tracking_settings` 7 例与 `CredentialModal` 5 例、`OrganizationsTable` 3 例是长尾里的既有失败，与本簇无关

其余门禁：定向 7 个范围复跑 → 79 文件 979 例全绿；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 13 个改动 `.tsx` 0 error / 41 warning，与 HEAD 版逐条同规则（先 `git show HEAD` 覆盖再比对）；prettier 最终 `--check` 全过；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个，已接入 434 到 435、47.6% 到 47.7%。键数 7009 到 7011，`common` 命名空间叶子 189 到 191，中英同值 87 不变

## 2026-10-15 第 52 簇更新

批次 24 第 52 簇：`components/model_filters.tsx`（214 行，接入后 216，+11/−9）的模型筛选条接入 `modelHub`，新开 8 键、复用本命名空间已有的 `lblMode`，两个消息目录各 +8/−0 行；`ModelHubTable.test.tsx`（+2/−2）把两处 `findByPlaceholderText("Search model names...")` 换成中文。本文件被 AI Hub 整页（`ModelHubTable.tsx` 第 480 行）与公开模型向导（`forms/MakeModelPublicForm.tsx` 第 161 行）共用，后者测试里是 `vi.mock` 掉的，不受影响

改造形态：

- 8 个键落 `modelHub` 平铺层：`searchModelsLabel`/`searchModelsPlaceholder` 与第 49 簇的 `searchAgentsLabel`/`searchAgentsPlaceholder` 成对，`lblProvider`/`lblFeatures` 延用 `lbl*`、`allProviders`/`allModes`/`allFeatures` 延用第 47 簇 `allTools` 的下拉首项形态，`clearFilters` 是四个筛选都有值时才出现的链接按钮
- 一次同命名空间复用：`lblMode` = `Mode:`/模式： 与本文件逐字节相同、概念同为"模式字段标签"，直接借用而不另开 `searchModeLabel`。这是第 48 簇 `viewDetails` 之后平铺层内跨文件复用的第二次兑现
- `"Provider:"` 至此在全库有三处：`logs.vectorStore.provider`、`vectorStores.providerLabel` 与本簇 `modelHub.lblProvider`，跨命名空间不借，按口径新开并记账。`lblProvider` 的中文"提供商："与 `lblProviders`（Providers:）同形，是第 50 簇那批冒号重复的延续；`models.modelTable.searchPlaceholder` 是 `"Search model names…"`（U+2026 一个字符），与本文件的 `"Search model names..."`（三个点）不同值，故 `searchModelsPlaceholder` 也新开
- `clearFilters` 与 `chat` 域已有的 `clearFilters`（"Clear all filters"）只差值，键名撞车属正常的跨命名空间重名，沿用第 51 簇"重复攒够再上收"的口径不动其他命名空间
- 数据与格式留原文：三个 `<select>` 里由 `getUniqueProviders`/`getUniqueModes`/`getUniqueFeatures` 推出的 `<option>` 取值本身，尤其是 `supports_*` 键名首字母拼接出的特性名（与第 48 簇 `formatCapabilityName` 同一类数据债）

测试侧同步只有 `ModelHubTable.test.tsx` 两处占位符断言，用例数不变（14 例）。`public_model_hub.tsx` 第 396、409 行有一套同文的搜索标签，那个文件已挂 `modelHub` 却仍写着英文常量，等接入公开模型中心整页时可直接复用本簇这两个键，另带一个 `aria-label="Search model names"` 要一起处理

验证：定向 `npx vitest run src/components/AIHub/ src/lib/i18n` → 12 文件全绿；相邻的 `public_model_hub.test.tsx` + `AIHub/forms` 4 文件 82 例全绿；复跑 7 个范围 → 79 文件 979 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 5 warning，与 `git show HEAD` 覆盖后的基线逐条相同（源文件一条 `any` 加两条 `no-long-condition-chain`，行号只随新增 import 位移 1 到 2 行；测试文件 92/178 行两条 `no-large-inline-object-arg` 未动）；prettier 对两个 `.tsx` `--check` 直接通过；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个，已接入 433 到 434、47.5% 到 47.6%。键数 7001 到 7009（`modelHub` 命名空间叶子 191 到 199），中英同值 87 不变

## 2026-10-15 第 51 簇更新

批次 24 第 51 簇：`components/AIHub/UsefulLinksManagement.tsx`（455 行，接入后 456，+38/−37）的链接管理卡片接入 `modelHub`，新开 27 键、复用 `common` 的 cancel/save/actions，两个消息目录各 +27/−0 行；`UsefulLinksManagement.test.tsx`（248 行，+29/−28）从裸 `render` 换成 `renderWithProviders` 并同步 9 处断言。至此 AIHub 目录 10 个非测试 `.tsx` 全部接线（6 个自带 `useTranslations`，4 个列定义由 props 接收 `t`），该目录不再有未接线文件

改造形态：

- 27 个键落 `modelHub` 平铺层，沿用第 50 簇定下的构词法：卡片标题 `linksTitle`/`linksDescription`、分组 `addNewLink`/`manageExistingLinks`、列标题兼表单标签 `colDisplayName`/`colUrl`、按钮 `addLink`/`rearrangeOrder`/`saveOrder`/`publicModelHub`、`title` 与 tooltip 七项 `moveUp`/`moveDown`/`alreadyAtTop`/`alreadyAtBottom`/`openLink`/`editLink`/`deleteLink`、空态 `noLinksYet`、七条 toast。表头与标签同键：两处都在说同一个字段名，概念一致
- 三个泛型动作复用 `common`：`cancel`（两处取消按钮）、`save`（行内保存）、`actions`（操作表头），与第 48 簇同一口径；`Display Name`/`URL` 在 `agents`、`mcpServers` 里已有同名键，跨命名空间不借，本命名空间另开
- `colUrl` 是 EN 与 ZH 逐字节同为 `URL` 的键，中英同值从 86 到 87，与 `common.disable` 那批既有同值键同类，不算漏译
- 带参 toast：`Failed to save links - ${error}` 改写成 `toastSaveFailed` = `Failed to save links - {error}`，中文"保存链接失败 - {error}"。catch 里的 `error` 是 `unknown`，模板字符串能拼、消息参数字段类型不行，tsc 报 `Type 'unknown' is not assignable to type 'string | number | Date'`，显式 `String(error)` 收口，渲染结果与原串逐字节相同
- 引号照 `common` 那批既有中文的写法用弯引号：EN 的 `under 'Useful Links'` 在 JSX 里是 `&apos;` 实体，中文写作"公开模型中心“常用链接”下方展示的链接"；`Useful Links` 这个分区名在全库没有对应键，本簇按公开页的叫法译作"常用链接"，若日后公开页接入再对齐
- 数据与格式留原文：`placeholder="https://example.com"`、链接本身的 `displayName`/`url` 值、`dataTestId` 拼接、3 条 `console.error` 日志文本

测试侧：这个文件是 AIHub 里最后一个还在用裸 `render` 的测试，组件一旦调用 `useTranslations` 就整个抛错，9 例全红。改成 `renderWithProviders`（`tests/test-utils` 里已把 locale 钉在 zh-CN），断言同步：链接管理、便于识别的名称、添加链接、调整顺序、保存顺序、公开模型中心、保存、取消、管理已有链接，以及三条 toast 文案。用例数 9 例不变

踩到的坑：往消息目录插键时锚点不唯一。`"supportsAuthExtendedCard"` 在 `agents`（第 43 簇）和 `modelHub`（第 50 簇）各有一份，脚本的 `findIndex` 命中的是靠前那份，27 个键先整体落进了 `agents`。中英两个目录错得一模一样，parity 守卫自然全绿——它只比较结构，不校验键该属于哪个命名空间；`missingKeys` 守卫也查不出，因为它按 `t("key")` 的字面量在源文件里找，找不到命名空间归属。真正的信号是测试：`renderWithProviders` 把键名原样渲染成 `modelHub.linksTitle`。口径补充：脚本插键要么用锚点所在行的行号范围，要么先确认锚点在目标命名空间内唯一，改完必须验证一次 `en.<namespace>.<key>` 读得到

验证：定向 `npx vitest run src/components/AIHub/ src/lib/i18n` → 12 文件全绿；复跑 7 个范围 → 79 文件 979 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0（本簇一度因 `{error}` 传 `unknown` 多出一条，已按上面的 `String(error)` 收口）；`npx eslint` 两个改动文件 0 error / 10 warning，源文件 4 条（三条 `any` + 一条 `exhaustive-deps`）与测试文件 6 条（`no-large-inline-object-arg`）都用 `git show HEAD` 覆盖工作区复跑过，逐条同规则、行号只差插入的 import 行；prettier 对两个 `.tsx` `--check` 直接通过；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个，已接入 432 到 433（本文件此前未接线）、47.4% 到 47.5%。键数 6974 到 7001（`modelHub` 命名空间叶子 164 到 191），中英同值 86 到 87

## 2026-10-15 第 50 簇更新

批次 24 第 50 簇：`components/AIHub/ModelHubTable.tsx`（1172 行，+62/−62 全部原地替换，行数不变）的三个详情弹窗（模型 / 智能体 / MCP 服务器）接入 `modelHub`，新开 52 键、复用本命名空间已有的 `unknownStatus`，两个消息目录各 +52/−0 行；`ModelHubTable.test.tsx`（341 行到 360 行）新增 1 例覆盖模型弹窗。本簇之后 `ModelHubTable.tsx` 只剩两处 python 代码示例与 8 条 `console.error`，AIHub 目录里四个中心表列定义都已由 props 接收 `t`，只剩整页文件 `UsefulLinksManagement.tsx`（455 行）既没有 `useTranslations` 也没有 `t` 注入

改造形态：

- 键一律落 `modelHub` 平铺层，本簇起新增两组构词法：分组小标题用 `sec*`（`secModelOverview`、`secTokenCost`、`secCapabilities`、`secRateLimits`、`secSupportedParams`、`secUsageExample`、`secAgentOverview`、`secIOModes`、`secSkills`、`secAdditionalFeatures`、`secServerOverview`、`secConnectionDetails`、`secAllowedTools`、`secTeams`、`secAccessGroups`、`secMetadata`），字段标签用 `lbl*` 且冒号写进消息串（`lblModelGroup`、`lblCreatedBy`、`lblHealthCheckError` 等 30 个），与第 49 簇的 `modelHubUrlLabel`、`searchAgentsLabel` 同一口径；弹窗标题兜底用 `*DetailsTitle` 三项
- 唯一一次复用是 `unknownStatus`：MCP 弹窗状态徽标的 `status || "unknown"` 与第 47 簇列定义里的小写 `unknown`/未知逐字节相同、概念同为"状态未知"，直接复用
- 术语沿用目录里已有的既定译法，不做新译：Capabilities→能力（同 `agents.capabilities`）、Rate Limits→速率限制、Access Groups→访问组、Metadata→元数据、Allowed Tools→允许的工具、Supports Authenticated Extended Card→支持认证扩展卡片；"能力"与第 48 簇的 Features→功能（`colFeatures`）是两个词，模型表的功能列与弹窗的能力分组各用各的
- 由此攒下一批带冒号的重复记账：`lblName`/`lblDescription`/`lblStatus`/`lblVersion`/`lblTransport`/`lblAuthType`/`lblServerName`/`lblCreatedBy` 与 `common` 的 name/description/status/version、本命名空间的 `colTransport`/`colAuthType`/`colServerName`/`colCreated` 只差一个冒号；`lblDescription` 还是全库 `"Description:"` 的第四例（前有 `logs.guardrail.colDescription`、`agents.descriptionLabel`、`vectorStores.descriptionLabel`）。冒号算进逐字节比较，故一律新开；等这批 `*Label:` 攒出统一形态再考虑上收
- 数据与格式留原文：两个 `SyntaxHighlighter` 里的 python 示例（含 `# Your LiteLLM Proxy URL` 注释行，代码不译）、技能条目的 `ID: {skill.id}`、徽标上的 `v{version}`、`formatCapabilityName` 推出的能力徽章名、智能体 `capabilities` 的原始键名、transport/auth_type/status 的取值本身、`toLocaleString()` 的数字与日期

测试侧：`ModelHubTable.test.tsx` 加一例"localizes the model details modal headings, labels and fallbacks"，走列定义的操作菜单进模型弹窗。首个断言 `getByText("能力")` 撞到两个元素——弹窗外还有智能体中心表格的"能力"列头（`agents.capabilities`），页签是 `keepMounted` 的，隐藏的表格也在文档里；改成就 `within(dialog)` 包住全部断言，这也是本文件第一次用 `screen.findByRole("dialog")` 划定作用域。"未指定"用 `getAllByText` 断言 4 处（输入/输出上限与输入/输出成本，`mode` 有值故不计）。该文件 13 例到 14 例，复跑范围 978 例到 979 例

验证：定向 `npx vitest run src/components/AIHub/ src/lib/i18n` → 12 文件 133 例全绿；复跑 7 个范围 → 79 文件 979 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 5 warning，与 HEAD 版逐条相同（源文件 `complexity 89` 与两条 `any`，测试文件 92/178 行两条 `no-large-inline-object-arg`，均未随本簇改动位移）；prettier 对两个 `.tsx` `--check` 直接通过，未做二次格式化；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 432 不变（本文件早已带 `useTranslations`）、47.4%。键数 6922 到 6974（`modelHub` 命名空间叶子 112 到 164，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 49 簇更新

批次 24 第 49 簇：`components/AIHub/ModelHubTable.tsx`（1189 行，接入后 1172，+28/−45）的 AI Hub 页签外壳接入 `modelHub`，新开 31 键，两个消息目录各 +31/−0 行；`ModelHubTable.test.tsx`（341 行，+9/−9）同步断言。本簇只管页面骨架——标题与描述、URL 复制条、四个页签、四个公开入口按钮、三张表的加载提示与空态、智能体搜索框、公开页未启用卡片；三个详情弹窗（模型 / 智能体 / MCP 服务器）的分组小标题与字段标签留给下一簇

改造形态：

- 31 个键全落 `modelHub` 平铺层（与 `showing*`、`col*` 同层）：`hubTitle`、`hubAdminDescription`/`hubUserDescription`、`modelHubUrlLabel`、`copyUrl`、`tabModels`/`tabAgents`/`tabMcp`/`tabSkills`、四个公开入口按钮、`loadingModels`/`loadingAgents`/`loadingMcpServers`、九个空态文本、`searchAgentsLabel`/`searchAgentsPlaceholder`/`clearSearch`、`publicHubNotEnabled`/`publicHubNotEnabledHint`
- 术语对齐已有键的中文，但键一律新开：`hubTitle` 取"AI 中心"（同 `nav.aiHub`，那是侧栏导航命名空间）、`clearSearch` 取"清除搜索"（`skills`/`agents`/`projects`/`access-groups` 已有四个同名键）、`loadingModels` 取"正在加载模型…"（同 `usage.aiChat.loadingModels`）、`noAgentsYet`/`noMatchingAgents` 取"暂无智能体"/"没有匹配的智能体"（同 `agents.noneYet`/`agents.noMatching`）
- 由此留下 `clearSearch` 的第五个同名键。第 47 簇记下的口径是"重复攒够了再上收"，本簇按同一处理只记账不动其他四个命名空间；`selectModelsToMakePublic`/`selectAgentsToMakePublic`/`manageMcpHubVisibility` 与第 42、43、44 簇三个向导的 `dialogTitle`/`selectTitle` 也是同一类重复——页面上的入口按钮与弹窗自己的标题分属分组层与平铺层，跨分组不借
- 富文本无需 `t.rich`：`what&apos;s available.` 在 JSX 里是实体，消息串里直接写 `'`，渲染结果逐字节相同；`Loading models…` 的省略号是 U+2026 一个字符，照抄进消息串
- 数据与格式留原文：`${getProxyBaseUrl()}/ui/model_hub_table` 的地址串、`console.error` 的 8 条日志文本（第 144、158、195、219、240、337、358、375 行）

测试侧同步：`ModelHubTable.test.tsx` 只换语言不改含义，9 处——`AI Hub`→AI 中心、`No models yet`→暂无模型、三个页签名 `MCP Hub`/`Agent Hub`/`Model Hub`→MCP 中心/智能体中心/模型中心、`Manage MCP Hub Visibility`→管理 MCP 中心的可见性、`No matching agents`→没有匹配的智能体、搜索框 `getByPlaceholderText("Search agent names or descriptions...")`→搜索智能体名称或描述...。单文件实测 13 例，数量未增删

验证：定向 `npx vitest run src/components/AIHub/ src/lib/i18n` → 12 文件全绿；全量复跑 7 个范围的 `npx vitest run` → 79 文件 978 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 5 warning，与 HEAD 版逐条相同（测试文件两条 `no-large-inline-object-arg` 在未改动的 92/178 行，源文件 `complexity 89` 与两条 `any` 行号未动）；prettier 对本簇改动的多行三元做了 17 行收拢；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 432 不变（本文件早已带 `useTranslations`）、47.4%。键数 6891 到 6922（`modelHub` 命名空间叶子 81 到 112，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 48 簇更新

批次 24 第 48 簇：`components/AIHub/ModelHubTableColumns.tsx`（243 行，接入后 251，+32/−24）的模型中心列定义接入 `modelHub`，新开 8 键、复用 `common` 五键与本命名空间已有的 `viewDetails`，两个消息目录各 +8/−0 行；消费者 `ModelHubTable.tsx`（1189 行，+4/−1）把 `modelColumns` 的 `useMemo` 改为传入 `t` 与 `commonT`。至此 AIHub 三个中心表的列定义（技能、智能体、MCP 服务器、模型）全部接入，该目录只剩整页文件 `UsefulLinksManagement.tsx` 与 `ModelHubTable.tsx` 自身的页签外壳文案

改造形态：

- 列标题继续走第 47 簇定下的 `col*` 构词法：`colPublicModelName`、`colTokens`、`colCostPerMillion`、`colFeatures`、`colPublic`，另加操作菜单三项 `openModelActions`/`copyModelName`/`modelNameCopied`。`viewDetails` 是第 47 簇为 MCP 菜单开的键，EN `View details` 与本文件逐字节相同、概念同为"打开详情弹窗"，按口径直接复用而不另开 `modelHub.viewModelDetails`——这是平铺命名空间内跨文件复用的又一次兑现
- 四个泛型标签落 `common`：`provider`（Provider/提供商）、`mode`（Mode/模式）、`yes`/`no`（是/否，公开列的徽标）与 `actions`（操作，sr-only 表头）。`models.modelTable.provider` 等同名键属于模型管理页，跨命名空间不借
- `colPublicModelName` 的中文取"公共模型名称"，与 `models.modelTable.publicModelName` 同词——EN 在 `models.*` 有四个同串键，但跨命名空间借不是口径，本簇另开键、只对齐术语
- `colTokens` 取"Token 数"（同第 37 簇 `chat.logsPanel.colTokens`），不用 `logs.tokens` 的"令牌"；`colCostPerMillion` 取"成本/1M"，列宽 110px，装不下 `models.addModel.inputCostPerToken` 那种"输入成本（每百万 Token）"的长写法
- `colFeatures` 与第 46 簇的 `agents.capabilities`（Capabilities/能力）不是同一个短语，HEAD 这里写的是 `Features`，所以另开 `colFeatures`（功能）而不是借近义键
- 数据与格式留原文：`formatCapabilityName` 从 `supports_*` 键名推出的徽章文本（`Vision`、`Function Calling`）、`formatCost` 的 `$` + `toFixed(2)`、`formatTokens` 的 K/M、`+{providers.length - 2}` 溢出计数、`providers` 与 `mode` 的接口取值、空值占位 `-`、`data-testid`。前两处与第 46、47 簇记下的同类账一起（能力值/数字格式），要接得连着模型管理页那套同名词一起做

测试侧同步：

- `ModelHubTableColumns.test.tsx`（94 行，接入后 122，+38/−10）与第 45、46、47 簇同法改造：新增 `ModelHubTableHarness` 在组件内 `useTranslations("modelHub")` / `("common")` + `useMemo` 组列，`renderTable` 改走 `renderWithProviders`。8 例数量与含义未增删
- 断言换语言：`Yes`/`No`→`是`/`否`；列标题断言并入"renders the model row"一例（公共模型名称/提供商/模式/Token 数/成本/1M/公开，外加原有的"没有 URL 列"），未新开用例
- 一条踩坑记下来：Base UI 的下拉菜单项在 `user.click(item)` 之后随弹窗卸载，先点再 `getByTestId` 会报"Unable to find"。改成 `findByTestId` 拿到元素、先断文本、再点击——`AgentHubTableColumns.test.tsx` 早就是这个写法，本簇照做即可

验证：定向 `npx vitest run src/components/AIHub/` → 9 文件全绿；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 三个改动文件 0 error / 4 warning，与 HEAD 版逐条相同（`ModelHubTableColumns.tsx` 一条 `no-explicit-any` 只是从 34 行移到 35 行，`ModelHubTable.tsx` 的 `complexity 89` 与两条 `any` 未动）；prettier `--check` 只有测试文件不干净（harness 的 props 类型一行超 printWidth），`--write` 后两个源文件报 unchanged；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 432 不变、47.4%（同第 46、47 簇的理由——工厂走 props 收 `t`）。键数 6883 到 6891（`modelHub` 命名空间叶子 73 到 81，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 47 簇更新

批次 24 第 47 簇：`components/AIHub/MCPHubTableColumns.tsx`（233 行，接入后 241，+35/−27）的 MCP 服务器列定义接入 `modelHub`，新开 15 键、复用 `common` 三键，两个消息目录各 +15/−0 行；真实消费者 `ModelHubTable.tsx`（1178 行，+5/−1）补 `commonT`；`src/lib/i18n/translators.ts`（+5/−0）新增 `ModelHubTranslator` 别名。至此 AIHub 三个中心表只剩 `ModelHubTableColumns.tsx`（另有整页文件 `UsefulLinksManagement.tsx` 未接入）

改造形态：

- 新键落在 `modelHub` 的平铺层（与三个 `showing*` 同层），列标题沿用第 46 簇记下的 `col*` 构词法：`colServerName`、`colTransport`、`colAuthType`、`colCreated`、`colTools`、`colHubListing`。既不借 `mcpServers.view.*`（跨命名空间，那些是 MCP 服务器管理页的详情面板标签），也不借 `modelHub.makeMcpPublic.*`（分组命名空间内跨分组借不是口径，第 29、33、36、38、39、41、42、43、44 簇）；由此留下三处 EN 逐字节重复——`serverName`/`mcpServers.view.serverName`、`copyServerName`/`mcpServers.view.copyServerName`、`unknownStatus`/`makeMcpPublic.unknownStatus`，按第 39、40 簇的方式记为待第三个消费者出现时上收，本簇不动 `mcpServers`
- `common` 复用：`description`（描述）、`status`（状态）、`actions`（操作，sr-only 表头）三个泛型标签直接走共享层，本簇不新开同名键
- `unknownStatus` 的取值是小写 `unknown`：HEAD 的兜底字面量是 `row.original.status || "unknown"`，而 `common.unknown` 是 `Unknown`（首字母大写），概念同但取值不同一项不借，另开键——与第 44 簇 `makeMcpPublic.unknownStatus` 同判据
- `toolsCount` 用 `#` 复数：`{count, plural, one {# tool} other {# tools}}` / `{count, number} 个工具`，node + `intl-messageformat` 实测 `1` → `1 tool`、`2` → `2 tools`，与旧模板串逐字节相同。旧代码的 `tools.length > 0 ?` 三元让 0 这一支渲染成 `All tools`，所以 `0 tools` 实际不出现，键与分支都按原样保留
- `ModelHubTranslator` 别名新增：`modelHub` 此前只在组件里 `useTranslations`，没有跨文件传递的需求；列工厂要按 `*ColumnsDeps` 口径收一个命名空间绑定的 `t`，裸 `ReturnType<typeof useTranslations>` 会让键联合超出可检查范围（`translators.ts` 开头那段说明），所以补别名而不是让工厂收裸类型
- 数据留原文：`STATUS_TONES` 的键、`row.original.status`/`transport`/`auth_type` 的取值、`+{tools.length - 2}` 溢出计数、空值占位 `-`、`data-testid`
- 顺带记下的旧账：状态徽标的 tooltip 走 `MCP_REACHABLE_DESCRIPTION`（`mcp_tools/types.tsx` 的模块级常量，与 `app/(dashboard)/mcp-servers/_components/MCPServerCard.tsx` 共用），它的英文原文在 `mcp_server_view.test.tsx` 与本簇测试里都按整串断言，接键要连着那两个消费者一起做，留给 `mcp_tools` 一簇

测试侧同步：

- `MCPHubTableColumns.test.tsx`（117 行，接入后 148，+48/−17）与第 45、46 簇同法改造：`MCPHubTableHarness` 组件内 `useTranslations("modelHub")` / `("common")` + `useMemo` 组列，`renderTable` 走 `renderWithProviders`。9 例数量与含义未增删
- "does not expose a URL column" 一例原本在 React 之外直接调工厂拿列定义，接 `t` 后没有渲染上下文就拿不到翻译器。改成让 harness 把建好的列写进调用方传入的 `columnsRef`，断言内容不变（仍是"没有标题为 URL 的列"）。第一版在渲染函数体里直接 `columnsRef.current = columns`，被 `react-hooks/refs` 判为 error（"Cannot update ref during render"），改到 `useEffect` 里——`renderWithProviders` 在 `act` 内渲染，effect 同步刷完，断言无需 await
- 断言换语言：`Server Name`→服务器名称、`Transport`→传输方式、`Auth Type`→认证类型、`Hub listing`→中心列表、`Listed`/`Unlisted`→已列出/未列出；操作菜单详情一例改用 `getByRole("button", { name: "打开 MCP 服务器操作菜单" })` 定位触发器（覆盖本簇接上的 aria-label），并补 `查看详情` / `复制服务器名称` 两条文本断言，与第 45、46 簇一致
- reachable tooltip 一例不动：`MCP_REACHABLE_DESCRIPTION` 未接入，徽标文本 `reachable` 是接口数据，hover 定位仍用英文取值

验证：定向 `npx vitest run src/lib/i18n src/components/AIHub/MCPHubTableColumns.test.tsx` → 4 文件 25 例全绿；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0，`AIHub` 与 `i18n/translators` 均无错误；`npx eslint` 四个改动文件 0 error / 9 warning，与 HEAD 版逐条相同（`MCPHubTableColumns.tsx` 六条 `no-explicit-any` 全在 `MCPServerData` 的 `any` 字段上，`ModelHubTable.tsx` 的 `complexity 89` 与两条 `any`），只有行号位移；prettier 先证 HEAD 四个文件干净，改动后 `--check` 仍干净、`--write` 报四个 unchanged（工厂签名与 harness 的换行是手写时就按 printWidth 排的）；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 432 不变、47.4%——同第 46 簇的理由（工厂走 props 收 `t`，消费者本就带 `useTranslations`）。键数 6868 到 6883（`modelHub` 命名空间 58 到 73，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 46 簇更新

批次 24 第 46 簇：`components/AIHub/AgentHubTableColumns.tsx`（234 行，接入后 241，+37/−30）的智能体中心列定义接入 `agents`，新开 9 键，两个消息目录各 +10/−1 行（−1 是 `agents.pleaseEnter` 补逗号）。列工厂按第 45 簇同一形状改造，`ModelHubTable.tsx`（1178 行，+5/−1）作为真实消费者补上 `const agentsT = useTranslations("agents")` 并把 `agentsT` 传进 `getAgentHubTableColumns` 的 `useMemo`

改造形态：

- 平铺命名空间内按概念复用已有键（第 45 簇记下的口径）：`agents` 命名空间没有分组（176 个键全是叶子），本簇七个列标题与徽标、操作菜单全走已有键——`colAgentName`、`description`、`version`、`skills`、`capabilities`、`yes`/`no`、`actions`，另有 `openAgentActions`（`Open agent actions`，与本文件 HEAD 的 aria-label 逐字节相同，它是 `app/(dashboard)/agents` 一侧的键，平铺命名空间内跨文件复用正是第 45 簇记下的口径）。九个新键里三个是列标题、三个是表格内容、三个是菜单项
- 新列标题跟着命名空间自己的 `col*` 构词法走：`colProtocol`、`colPublic`、`colIoModes`。`agents.protocolVersion` 早已存在且取值是 `Protocol Version`，与本列标题 `Protocol` 不是同一个短语，不能借；`agents.public` 没有，`colPublic` 承担，而行内的是 `yes`/`no` 徽标（`Public` 这一列展示的是布尔，不是状态名）
- `skillsCount` 写成 `{count, plural, one {# skill} other {# skills}}` / `{count, number} 个技能`：第 43 簇那条规则的又一次兑现，多词分支必须用 `#`，数字由复数分支自己渲染。node + `intl-messageformat` 实测 `1` → `1 skill`、`2` → `2 skills`、`1234` → `1,234 skills`，与 HEAD 的 `{skills.length} skill{…}` 逐字节相同
- io_modes 那两行的 `<span className="font-medium">In:</span> {modes}` 是 `t.rich`：本簇第一次写成 `<label>In:</label> {modes}`，parity 守卫的富文本标签白名单（`messagesParity.test.ts:157` 的 `RICH_TAGS` = `strong, b, i, em, link, code, br, claude, codex`）立刻把两条键判为 offender——守卫查的是消息串里所有 `<...>`，`<label>` 不在允许集合内。改成 `<strong>` 承载、渲染器写回 `<span className="font-medium">{chunks}</span>`，加粗范围与类名都和旧 JSX 一致，EN 实测渲染 `In: text, image` / `Out: text, image`，与旧模板串逐字节相同
- 数据留原文：`v{row.original.version}`、`+{skills.length - 2}` 的溢出计数、`skill.name` 与 `capability` 的取值、`row.original.protocolVersion` 的单元格值（A2A 协议版本号，接口数据）、空值占位 `-` 与 `inputModes.join(", ") || "-"` 的哨兵、`data-testid`、`Object.entries(capabilities)` 筛 `true` 的键名

测试侧同步：

- `AgentHubTableColumns.test.tsx`（127 行，接入后 146，+35/−16）与第 45 簇同法改造：删掉裸 `render`，新增 `AgentHubTableHarness` 在组件内 `useTranslations("agents")` + `useMemo` 组列，`renderTable` 改走 `renderWithProviders`。15 例数量与含义未增删
- 断言换语言：`3 skills`→`3 个技能`、`1 skill`→`1 个技能`、`Yes`/`No`→`是`/`否`；io_modes 那条改为 `getByText("输入：")` + `parentElement?.textContent` 断 `"输入：text"`，`getByText` 命中富文本渲染出的那个 `<span>`，与标签名无关，所以 `<label>`→`<strong>` 的重写不需要动测试
- 操作菜单的两条用例各补一个文本断言：详情那条顺带把触发按钮的定位从 `getByTestId("agent-hub-actions-agent-1")` 换成 `getByRole("button", { name: "打开智能体操作" })`，让本簇接上的 aria-label 有用例覆盖；复制那条仍用 testid 定位、只补 `toHaveTextContent("复制智能体名称")`，与第 45 簇补 `查看详情`/`复制技能名称` 的动机一致
- `ModelHubTable.test.tsx` 不用改：它断言的是自己尚未接入的触发按钮与空态文案（`No matching agents` 等），智能体表格的列标题它没有断言，并入范围跑仍全绿

验证：定向 `npx vitest run src/lib/i18n src/components/AIHub/AgentHubTableColumns.test.tsx` → 4 文件 31 例全绿（parity 守卫在首跑里抓出上面那条 `<label>` 标签问题，改标签后转绿）；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（用例未增删），prettier 改写后复跑仍 978 全绿；`npx tsc --noEmit -p .` 总 883、非测试 0，且 `AIHub` 一条错误都没有；`npx eslint` 三个改动文件 0 error / 5 warning，与 HEAD 版逐条相同（`AgentHubTableColumns.tsx` 两条 `no-explicit-any` 在 `[key: string]: any` 那两行，`ModelHubTable.tsx` 一条 `complexity 89` 与两条 `no-explicit-any`），只有行号位移；HEAD 对照的做法是 `git show "HEAD:<path>"` 落到临时文件会被 eslint 判"outside of base path"，改为临时覆盖工作树文件跑完再原样写回（不 stash，共享工作树口径）；prettier 先证 HEAD 三个 `.tsx` 干净，改动后对 `.tsx` 执行 `--write`（工厂签名换行、harness 的类型参数换行由此而来，`ModelHubTable.tsx` 报 unchanged）；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 432 不变、47.4%——本簇新接入的工厂走 props 收 `t`（指标脚本判"未接入"），消费者 `ModelHubTable.tsx` 本来就带 `useTranslations`，所以两个可计数文件都没进增量；这正说明该指标只统计出现 `useTranslations`/`getTranslations` 字面量的文件，列工厂簇天然不计。键数 6859 到 6868（`agents` 命名空间 167 到 176，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 45 簇更新

批次 24 第 45 簇：`components/AIHub/SkillHubTableColumns.tsx`（172 行，接入后 180，+29/−21）与它的唯一真实消费者 `components/AIHub/SkillHubDashboard.tsx`（186 行，接入后 188，+19/−17）一起接入，新开 `skills` 20 键 + `common` 借 1 键，两个消息目录各 +21/−1 行（−1 是 `skills.createdAt` 补逗号）。表头列与页面外壳本来就是一对，列工厂要 `t` 就得由外壳的 `useTranslations` 提供，所以不做半截接入

改造形态：

- 列工厂按 `RequestLogsTableColumns.tsx` / `keyTableColumns.tsx` 的既有口径接 `*ColumnsDeps`：`SkillHubTableColumnsDeps` 增加 `t: SkillsTranslator` 与 `commonT: CommonTranslator`，`SkillHubRowActions` 也从同一次 `t` 里取，不在列单元里调 hook（工厂在组件外被调用，那时没有渲染上下文）。`translators.ts` 第 153 行的 `SkillsTranslator` 别名直接复用，没有新开别名
- 复用兑现最多的一簇：七个列标题里五个走已有键——`skills.skillName`（技能名称）、`skills.description`（描述）、`skills.category`（分类）、`skills.public`（公开）、`skills.actions`（操作），这些正是 `app/(dashboard)/skills/_components/PluginTableColumns.tsx` 已在用的同名同值键（列标题这一概念在两处是同一个），再加 `common.status`（状态）承担第六个，`skills.loadingSkills` 承担表格加载语。本簇真正的新键只有 `domain`、`source`、`draft`、`openActions`、`viewDetails`、`copySkillName`、`skillNameCopied` 七个表格项，加上外壳十三个
- 外壳的空态组件 `SkillsEmptyState` 自己调 `useTranslations`，不靠 props 传 `t`：它是渲染树里的真组件，Hook 可用，而 `filtered` 那个布尔分支（`noMatchingSkills`/`noSkillsYet` 与其两条说明）中英两条路径都要翻，包在自己身上最省事。新键名跟着已有的 `noSkills` / `noSkillsDesc` 一对的构词法走（`noMatchingSkills` + `noMatchingSkillsDesc`、`noSkillsYet` + `noSkillsYetDesc`）
- 标题的 `All {publicPage ? "Public " : ""}Skills` 拆成两个键而不是插值：`allSkills`（全部技能）/ `allPublicSkills`（全部公开技能）。英文靠拼 `"Public "` 这种半截词的做法进 ICU 会变成中英各自断词，两个完整短语反而两侧都干净
- `showingCount` 保留 HEAD 的一个怪写法：原串是 `Showing {filteredSkills.length} of {totalSkills} skill{totalSkills !== 1 ? "s" : ""}`——复数跟着**总数**变而非跟着显示数变。键里写成 `Showing {shown} of {total} {total, plural, one {skill} other {skills}}`，参数名换成 `shown`/`total` 但复数仍取 `total`，与旧渲染逐字节相同（node + `intl-messageformat` 实测 `{shown:3,total:5}` → `Showing 3 of 5 skills`、`{1,1}` → `Showing 1 of 1 skill`）；中文不分复数，写"显示 {shown} 条，共 {total} 条技能"。这条也是第 44 簇那条"分支体是单个标识符就放过"的再一次兑现
- 数据留原文：`getSkillSourceLink()` 由 `source.repo`/`url`/`path` 拼出的链接与显示串、`domain` 与 `category` 的取值、空值占位 `-`、筛选里 `s.domain || "General"` 的比对哨兵（它不参与渲染，下拉项只由真实 `domain` 生成）；`data-testid` 与 `href` 同理
- 顺带记下发现的旧账：同形状的 `PluginTableColumns.tsx` 虽然已经把 `t` 传进 `PluginRowActions`，但该组件里 `aria-label="Open skill actions"`、`Copy skill ID`、`Skill ID copied`、`Delete` 以及 `Yes`/`No`、`N/A`、`No description`、`Uncategorized` 仍写死英文——本簇的 `skills.openActions` 取值与那句 aria-label 逐字节相同，后续接它时可直接复用，不必再开键

测试侧同步：

- `SkillHubTableColumns.test.tsx` 原来是"测试里直接调工厂 + 裸 `render`"，接 `t` 后这样调就绕过了渲染上下文。改成 `SkillHubTableHarness` 组件：在里面 `useTranslations("skills")` / `("common")`，`useMemo` 组列，再交给 `DataTable`——与真实外壳 `SkillHubDashboard.tsx` 的写法同形，测试因此仍走真实调用路径。6 例数量与含义未增删，`Public`/`Draft` 断言换成 公开/草稿，另外给操作菜单的两条用例补了 `查看详情` / `复制技能名称` 的文本断言（菜单项本来靠 `data-testid` 定位，补断言是为了让这四个新键有用例覆盖）
- `SkillHubDashboard.tsx` 没有自己的测试文件，外壳文案靠构建与手工核对；`ModelHubTable.tsx` 的 skills 页签用 `keepMounted`，所以 `ModelHubTable.test.tsx` 会把外壳挂进树，本簇并入范围跑后仍全绿

验证：定向 `npx vitest run src/lib/i18n src/components/AIHub/SkillHubTableColumns.test.tsx` → 4 文件 22 例全绿；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 三个改动文件 0 error / 1 warning，那条 `local/no-long-condition-chain` 在 `SkillHubDashboard.tsx` 搜索过滤的 5 条件布尔表达式上，HEAD 既有、本簇未动该逻辑；prettier 先证 HEAD 三个 `.tsx` 干净（两个消息目录在 HEAD 就已被 `--check` 判为不合规，属既有状态，按口径不跑 `--write`），改动后对三个 `.tsx` 执行 `--write`（工厂签名与徽标行的换行由此而来）；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 431 到 432，47.4%——`SkillHubTableColumns.tsx` 走 props 收 `t`、自身没有 `useTranslations` 字面量，指标脚本不计它（就是技术债一节说的"props 传 `t` 的调用点无法静态判定"），所以两文件改动只 +1。键数 6839 到 6859（`skills` 命名空间 44 到 64，`common` 189 不变），中英同值 86 不变

## 2026-10-15 第 44 簇更新

批次 24 第 44 簇：`components/AIHub/forms/MakeMCPPublicForm.tsx`（376 行，接入后 380）接入 `modelHub`，新开 `modelHub.makeMcpPublic.*` 24 键，两个消息目录各 +26/−0 行。这是三个公开向导里文案最密的一个——除两步向导本体，还有遗留模式说明、YAML 折叠配置区、缺元数据的 alert 与"加载中"状态

改造形态：

- `common` 复用第四次兑现：`Select All`、`Cancel`、`Previous`、`Next` 全走第 42 簇落好的四个键，本簇一个新共享键都没加
- `aria-label={`Publish ${server.server_name}`}` 接成带参数的 `publishAria`（`Publish {name}` / 公开 `{name}`）：屏幕阅读器读的也是界面文案，属于要翻的那一类，`{name}` 留作数据；测试里 `{ name: "Publish Test Server 1" }` 因此同步为 `公开 Test Server 1`
- `server.status || "unknown"` 的兜底接 `unknownStatus`（未知），而 `server.status`、`server.transport` 的取值本身仍是接口数据，与第 42 簇的 `v{version}` 同一口径。两处状态徽标共用这一个键（同组件内，不是跨命名空间借）
- `toolsMore` 与第 42 簇 `makeAgentPublic.skillsMore` 的 EN 取值逐字节相同（`+{count, number} more`），但一个数的是 allowed_tools、一个数的是 skills，而且"同一命名空间内跨分组借"本就不是项目口径（第 29、33、36、38、39、41、42、43 簇），所以各留一份；等 `MCPHubTableColumns.tsx` 这类第三个消费者出现再按第 39、40 簇的方式上收
- 两条计数 chip 的复数分支写成正面情形：`<strong>{count}</strong> MCP {count, plural, one {server} other {servers}} selected`——分支体是单个标识符，parity 守卫的花括号合法性判断放过（第 43 簇那条 `#` 限制只在多词分支才需要），加粗范围与旧 JSX 一致；`saveInfo` 同理
- 配置字面量全部留原文：`public_mcp_hub_strict_whitelist`、`litellm_settings.public_mcp_servers`、`server_id`、`mcp_servers` 与 `publicationYaml` 生成的 YAML 代码块内容；`console.error("Error making MCP servers public:", error)` 是开发日志；`toast.fromError(error)` 本来就传的是错误对象

测试侧同步：

- `MakeMCPPublicForm.test.tsx` 的 19 处 `render` 换成 `renderWithProviders`，两处 `rerender(...)` 调用不动（`const { rerender }` 来自 provider 包裹后的返回值）；断言串同步为中文——`Manage MCP Hub Visibility`→管理 MCP 中心的可见性、`Select MCP Servers for the Hub`→选择要在中心展示的 MCP 服务器、`Confirm MCP Hub Publication`→确认 MCP 中心的公开列表、`Next`→下一步、`Previous`→上一步、`Cancel`→取消、`Save Publication List`→保存公开列表、`Select All (2)`→全选 (2)、`No MCP servers available.`→暂无可用的 MCP 服务器。、`Listed by legacy mode`→由遗留模式列出、`Configure in YAML`→在 YAML 中配置、`+2 more`→还有 2 个；`toHaveTextContent("explicit publication status")` 改成 alert 中文文案里的片段"明确的公开状态"。25 例数量未增删
- 连带改 `ModelHubTable.test.tsx` 的 "requires a fresh MCP publication list before and after saving"：这条用例会真的点进本簇的向导，两步按钮改成 下一步 / 保存公开列表。它断言的 `Manage MCP Hub Visibility` 是 `ModelHubTable.tsx` 自己的触发按钮，尚未接入，保持英文——所以 MCP 测试单跑绿、并进范围跑时还差这一条，改完才全绿

验证：定向 `npx vitest run src/lib/i18n src/components/AIHub/forms/MakeMCPPublicForm.test.tsx` → 4 文件 41 例全绿；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 三个改动文件 0 error / 3 warning，`ModelHubTable.test.tsx` 92、178 行的两条 `local/no-large-inline-object-arg` 与 MCP 测试 `resolvePromise: (value: any)` 那条 `no-explicit-any` 都是 HEAD 既有；prettier 先证 HEAD 三个文件干净，改动后只有 `.tsx` 组件报 style，对其单跑 `--write`（+45/−41 里含这次换行重排），两个测试文件未执行；`npm run build` exit 0；node + `intl-messageformat` 实测 `publishAria` 渲染 `Publish Test Server 1`、`toolsMore` 渲染 `+2 more`，与旧模板串逐字节相同

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 430 到 431，47.3%。键数 6815 到 6839（`modelHub` 命名空间 34 到 58），中英同值 86 不变

## 2026-10-15 第 43 簇更新

批次 24 第 43 簇：`components/AIHub/forms/MakeModelPublicForm.tsx`（341 行，接入后 346）接入 `modelHub`，新开 `modelHub.makeModelPublic.*` 15 键，两个消息目录各 +17/−0 行

改造形态：

- 与第 42 簇同形的第二步：`STEP_TITLES` 模块级常量删掉、换成组件内 `[t("…stepSelect"), t("…stepConfirm")]`，`DialogTitle`、两步的 `h3`、提示段、三条 `t.rich`（`selectedInfo` / `confirmWarning` / `totalInfo`）、列表标题、四条 toast、三个步骤按钮全部走键。`Select All`、`Cancel`、`Previous`、`Next` 直接复用第 42 簇落好的 `common.selectAll` / `cancel` / `previous` / `next`——这正是那一簇"一步就进 `common`"的理由，本簇四个消费点一个都不用新键
- 空态不借智能体向导的 `empty`：这里的空态跟着 `ModelFilters` 的筛选结果走（`filteredData.length === 0`），HEAD 的串是 `No models match the current filters.`，说的是"没有符合筛选条件的模型"，与 `makeAgentPublic.empty`（`No agents available.`，压根没有可选项）概念不同，所以新开 `emptyFiltered`（没有符合当前筛选条件的模型。）。`ModelFilters` 自己是未接入的长尾文件，本簇不碰它也不借它的文案
- 复数分支的多词取值改用 `#`：`toastSuccess` 一开始按第 42 簇的写法写成 `Successfully made {count} {count, plural, one {model group} other {model groups}} public!`，parity 守卫立刻报 `modelHub.makeModelPublic.toastSuccess: {model groups}`——花括号合法性判断只放过 `# 空格`、标识符、`/标识符` 或含逗号四种，`model groups` 带空格又不含逗号就落在四种之外。目录里 `#` 形态早有先例（`node` 递归数下来 33 个键在用，例如 `guardrails.test.testButton`、`guardrails.pii.selected`、`models.addModel.overrideCount`），于是整条改成 `{count, plural, one {# model group} other {# model groups}}`，数字由复数分支自己渲染；node + `intl-messageformat` 实测 `count=2` → `Successfully made 2 model groups public!`，中文仍是"已成功公开 {count, number} 个模型组！"，两侧参数名同为 `count`。`selectedInfo` 与 `totalInfo` 的分支是单词 `model` / `models`，不必改，标签也仍留在复数外面（第 42 簇那条规则不变）
- 术语分层：toast 沿用 HEAD 的 `model groups` → 模型组（一次 API 调用改的是 model group 的公开位），选择与确认文案用"模型"（UI 列表里 `model_group` 就以模型名直接展示）
- 不动的：`(${filteredData.length})` 计数、`console.error("Error making model groups public:", error)`、`Badge` 里的 `mode` 与 `providers` 取值，口径同第 42 簇

测试侧同步：`MakeModelPublicForm.test.tsx` 的 17 处裸 `render` 全部换成 `renderWithProviders`，断言串同步为中文——`Make Models Public`→将模型设为公开、`Select Models to Make Public`→选择要公开的模型、`Confirm Making Models Public`→确认公开这些模型、`Next`→下一步、`Previous`→上一步、`Cancel`→取消、`Make Public`→公开、`Select All (2)`→全选 (2)、`No models match the current filters.`→没有符合当前筛选条件的模型。
- 选中计数那条断言换了写法：原来是 `getByText("model selected")` + `toHaveTextContent("1 model selected")`。`getByText` 比较的是元素的**直接文本子节点**拼接（`getNodeText` 不含子元素），英文 JSX 里 `<strong>{n}</strong> model selected` 的 `<p>` 恰好有一个 `" model selected"` 文本节点，归一化后就是那个匹配串；中文把量词放在数字后面（`已选择 <strong>1</strong> 个模型`），`<p>` 的直接文本变成"已选择 "与" 个模型"两段，整串再也不是任何元素的直接文本，于是改成 `getByText(/个模型/)` 定位、`toHaveTextContent("已选择 1 个模型")` 断言完整渲染值。步骤二里另有"共计 …个模型将被公开"，但那条用例停在步骤一，正则不冲突
- `/Warning:/` 改 `/警告/`，仍能命中 `<strong>`；`/model_hub_table/` 不动，仍命中 `<code>`；17 例数量与含义未增删，只换语言

验证：定向跑 `npx vitest run src/lib/i18n src/components/AIHub/forms/MakeModelPublicForm.test.tsx` → 4 文件 33 例全绿（parity 守卫先在这一跑里抓住并修掉了上面那条花括号问题）；全量复跑 `npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 4 warning，全是 HEAD 已有的 `no-explicit-any`（组件 `[key: string]: any` 一处，测试里 `ModelFilters` mock 与 `resolvePromise: (value: any)` 三处），行号只随本簇改动位移；prettier 先证 HEAD 两个文件干净、改动后 `--check` 仍干净，未执行 `--write`；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 429 到 430，47.1%。键数 6800 到 6815（`modelHub` 命名空间 19 到 34，`common` 与 `chat` 不变），中英同值 86 不变

## 2026-10-15 第 42 簇更新

批次 24 第 42 簇：`components/AIHub/forms/MakeAgentPublicForm.tsx`（311 行，接入后 318）接入 `modelHub`，新开 `modelHub.makeAgentPublic.*` 16 键，另把 `Select All` 直接落在 `common.selectAll`，两个消息目录各 +21/−2 行（−2 是 `common.tokensInAndOut` 与 `modelHub.showingMcpServers` 两行补逗号）

改造形态：

- `Select All` 一步就进 `common`：这个标签在本簇之外还有三个已知消费者——同目录的 `MakeModelPublicForm.tsx` 与 `MakeMCPPublicForm.tsx`、以及 `claude_code_plugins/MakeSkillPublicForm.tsx`，四处取值逐字节相同，先放 `modelHub.makeAgentPublic` 再上收只会多一次改动。已有的 `playground.compliance.selectAll` 与 `guardrails.pii.selectAllMask` 一族跨命名空间且不通用，不借
- `STEP_TITLES` 从模块级常量改成组件内 `[t("…stepSelect"), t("…stepConfirm")]`：常量在模块顶层取不到 hook，而这两项只在渲染时用。`stepConfirm` 取自己的键而不是 `common.confirm`——向导步骤名是名词标签，`common.confirm` 是动作按钮，概念不同
- 步骤按钮复用 `common`：`common.cancel` / `common.previous` / `common.next`（取消、上一步、下一步）取值与概念都对得上，且这三个键本已被向导与分页用着
- 计数与富文本三处用 `t.rich`：`selectedInfo`、`totalInfo`、`confirmWarning`。ICU 的复数分支里不能嵌标签——parity 守卫按 `\{([^}]*)\}` 取到的第二段是 `other {<strong>#</strong> agents selected}` 之类"既不是 `# 空格`、也不是标识符、又不含逗号"的残片，会被判成裸花括号，所以写成 `<strong>{count}</strong> {count, plural, one {agent} other {agents}} selected`，标签留在复数外面，加粗范围与旧 JSX 一致
- toast 的成功文案由 `agent(s)` 改成真正的复数：`toastSuccess` EN `Successfully made {count} {count, plural, one {agent} other {agents}} public!`，node + `intl-messageformat` 实测 `count=2` 渲染为 `Successfully made 2 agents public!`，与旧的模板串在同一取值上只差 `(s)`；中文为"已成功公开 {count, number} 个智能体！"，两侧参数名同为 `count`，复数在中文里退化成量词
- `Select All {n > 0 && \`(${n})\`}` 的括号计数留作数据：与第 39 簇的 `Connected (${n})` 同一口径，JSX 里 `{t} {' '}{cond}` 保住原来那个空格，accessible name 仍是 `全选 (2)`
- `console.error("Error making agents public:", error)` 与 `Badge` 里的 `v{agent.version}` 不动，前者是开发日志、后者是版本号数据

测试侧同步：`MakeAgentPublicForm.test.tsx` 用裸 `render` 的 15 处全部换成 `renderWithProviders`（默认钉 `zh-CN`），断言串同步为中文——`Make Agents Public`→将智能体设为公开、`Select Agents to Make Public`→选择要公开的智能体、`Confirm Making Agents Public`→确认公开这些智能体、`Next`→下一步、`Previous`→上一步、`Cancel`→取消、`Make Public`→公开、`Select All (2)`→全选 (2)、`No agents available.`→暂无可公开的智能体。、`+2 more`→还有 2 个。`getByRole` 的 `name` 是整串匹配，"公开"只命中提交按钮，不会误取"将智能体设为公开"（那是 `getByText` 的标题）。步骤二的用例会一路点进来，`confirmWarning` 与 `totalInfo` 两条 `t.rich` 因此在测试里真实渲染过

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin src/components/AIHub` → 79 文件 978 例全绿，`Type Errors no errors`（复跑范围自本簇起并入 `components/AIHub`，用例未增删）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 1 warning，那条 `no-explicit-any` 在 HEAD 的 `resolvePromise: (value: any)` 上就有，本簇未新增；prettier 先证 HEAD 两个文件干净、改动后 `--check` 仍干净，未执行 `--write`；`npm run build` exit 0

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 428 到 429，47.0%。键数 6783 到 6800（`modelHub` 命名空间 3 到 19，`common` 188 到 189），中英同值 86 不变

## 2026-10-15 第 41 簇更新

批次 24 第 41 簇：`components/chat/ChatShell.tsx`（149 行，接入后 153）接入 `chat`，新开 `chat.shell.*` 8 键——顶部 pre-v0 提示、`New Chat` 按钮与 6 个侧栏导航项，两个消息目录各 +10/−0 行

改造形态：

- pre-v0 提示是一条带链接的整句，改成 `t.rich("shell.betaWarning", { link: (chunks) => <a …>{chunks}</a> })`。原文在 JSX 里是"正文 + `{' '}` + 链接 + `.`"三段拼接，中文语序要把链接挪到句中（"欢迎在<link>这里</link>分享反馈。"），只有 rich 标签能做到；英文取值去掉标签后与旧渲染逐字节相同，含 `here` 前那个空格。`link` 在 parity 守卫的 `RICH_TAGS` 白名单里，中英两侧都必须闭合；守卫只扫 `t("…")` 字面量，`t.rich` 的键名靠 `next-intl.d.ts` 的类型绑定兜住，写错作用域直接是 tsc 错误
- 6 个导航项的 `label` 是字符串 prop，取值放在调用点，`NavItem` 不调 hook，保持纯展示。`navIntegrations` 取 `集成`，与第 39 簇 `chat.credentialsPanel.emptyHint` 的"前往 <b>集成</b>"对齐；`navCredentials` 取 `凭证`、`navApiKeys` 取 `API 密钥`，分别跟 `chat.credentialsPanel.title`（应用凭证）、`chat.keysPanel.title`（你的 API 密钥）同词
- 没有借 `nav` 命名空间：`nav.usage` / `nav.logs` 与 `chat.shell.navUsage` / `chat.shell.navLogs` 的中英取值相同（`Usage`/用量、`Logs`/日志），但那是主控制台侧栏的页面项，跟聊天侧栏不是同一个概念位；按第 29、33、36、38、39、40 簇"跨命名空间借用要挂第二个翻译器，宁可开自己的键"的口径留在 `chat.shell`，中文取值仍与 `nav` 一致，不产生术语分叉

测试侧同步：`ChatShell.test.tsx` 原先用裸 `render`，组件接 `useTranslations` 之后整树必须有 provider，改为 `renderWithProviders`（默认钉 `zh-CN`），5 个用例的 `getByRole("button", { name })` 从 `Chats`/`API Keys`/`Integrations`/`Usage`/`Logs` 换成 对话/API 密钥/集成/用量/日志。`name` 是整串匹配，"对话"不会撞上"新建对话"按钮。同目录的 `ChatShell.serverRootPath.test.ts` 只 `import("./ChatShell")` 取 `getChatRoutes()`、不渲染，因此不需要 provider，2 例照旧绿

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净，改动后 `--check` 仍干净，未动 `.tsx` 之外任何文件（两个消息目录的 JSON 在 HEAD 上本来就不符合 prettier，不参与格式化）

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 427 到 428，46.9%；`components/chat` 11 个非测试文件接入 10 个，只剩 `ConnectFlowSurface.tsx`（59，无自有文案）。键数 6775 到 6783（`chat` 命名空间 138 到 146，`common` 188 不变），中英同值 86 不变

## 2026-10-15 第 40 簇更新

批次 24 第 40 簇：`components/chat/UsagePanel.tsx`（212 行，接入后 221）接入 `chat`，新开 `chat.usagePanel.*` 11 键；`chat.logsPanel.tokensInAndOut` 上收进 `common.tokensInAndOut`，`logsPanel` 由 19 键减到 18 键，净 +11，两个消息目录各 +15/−2 行

改造形态：

- 4 张统计卡的标签、`N/A` 兜底与"输入 X / 输出 Y"的副行都从 `meta` 的模板字符串里拆出来：标签走键，`$${spend.toFixed(2)}`、`formatNumber` 的 `K`/`M` 后缀与 `${pct}%` 留作数据（沿用既有货币与数字缩写欠账的口径）。`sub` 与 `value` 的三元判断没动，只把字符串换成键取值
- `tokensInAndOut` 上收的理由与第 39 簇那 4 个相对时间键相同：UsagePanel 的 token 副行与 LogsPanel 详情卡的 "{prompt} in / {completion} out" 概念与取值逐字节相同，`chat` 下两个面板各留一份是重复，借 `chat.logsPanel` 又让用量面板依赖日志面板的分组，所以放进 `common`。`LogsPanel.tsx` 的 `LogDetailDialog` 新增 `commonT`，`chat` 侧调用点不变；第 37 簇加的 `1,500 (输入 1,000 / 输出 500)` 断言没改值也照样绿，正好证明上收没改渲染
- `usagePanel.na` 取 `N/A` / `无`，与 `agents.na`、`logs.auditLogs.drawer.notApplicable` 同法；没有复用它们是因为那两处跨命名空间，借要挂第二个翻译器（第 29、33、36、38 簇口径）
- `dailySpend` 的中文取 `每日花费`，与 `usage.dailySpend` 一致（同目录 `usage.entity.dailySpend` 译作"每日消费"，取更贴近图表标签的那一支）；`tokensUsed` 译作 `Token 用量`，跟本命名空间 `logsPanel.colTokens` 的"Token 数"一样保留 Token 不译，没有跟 `usage.totalTokens` 的"总令牌数"混用
- 时间范围按钮的 `7d`/`30d`/`90d` 没接键：与第 37 簇 `LogsPanel` 的 `24h`/`7d`/`30d` 同一处理，属"时间范围缩写"那笔数据/格式欠账

测试侧无断言可同步：`UsagePanel` 没有测试文件，唯一消费者是 `src/app/chat/usage/page.tsx`；`chat` 目录内的用例没有一处断言 `Total Spend`/`Success Rate`/`Daily Spend`/`N/A` 这些串

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动 `.tsx`，`LogsPanel.tsx` unchanged；`chat.usagePanel.failedCount` 与上收后的 `common.tokensInAndOut` 都用 node + `intl-messageformat` 实测过渲染串与旧模板字符串逐字节相同

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 426 到 427，46.8%；`components/chat` 11 个非测试文件接入 9 个，剩 2 个是 `ChatShell.tsx`（149）与 `ConnectFlowSurface.tsx`（59，无自有文案）。键数 6764 到 6775（`chat` 命名空间 128 到 138，`common` 187 到 188），中英同值 86 不变

## 2026-10-15 第 39 簇更新

批次 24 第 39 簇：`components/chat/MCPCredentialsTab.tsx`（232 行，接入后 239）接入 `chat`，新开 `chat.credentialsPanel.*` 16 键；同时把第 36 簇放在 `chat.keysPanel` 的 4 个相对时间键上收到 `common`，净 +16，两个消息目录各 +24/−6 行

改造形态：

- `chat.keysPanel.{justNow,minutesAgo,hoursAgo,daysAgo}` 挪进 `common`：`MCPCredentialsTab` 里有一份与 `KeysPanel` 逐分支取值相同的 `relativeTime`（`just now`、`{n}m ago`、`{n}h ago`、`{n}d ago`），概念同为"多久以前"，按"概念与取值都相同才复用"该共用，而跨命名空间借 `chat.keysPanel` 又要把整棵密钥面板挂进第二个翻译器，所以按第 35 簇把 `chat.appsPanel.back` 收进 `common.back` 的口径上收到共享命名空间。`KeysPanel` 的 helper 形参从 `ChatTranslator` 换成 `CommonTranslator`，调用点传 `commonT`
- 两个模块级纯函数沿用"首参传 `t`"的写法（第 36、37 簇）：`relativeTime(commonT, iso)`、`expiryLabel(t, iso)`。`expiryLabel` 返回 `{ text, variant }`，只有 `text` 接键，`variant` 仍是数据判断
- 4 个表头在骨架表与真表各写一遍，两处同步改成 `credentialsPanel.colApp`/`.colConnected` 加 `common.status`/`common.actions`（`Status`/`状态`、`Actions`/`操作` 逐字节相同）。`colConnected` 的中文取 `连接时间`而不是字面的"已连接"：那一列放的是连接发生的时间点，与 `mcpServers.userCredentials.columnConnected` 同一列同一取法保持一致
- 空态提示走 `t.rich`：原 JSX 是 `Go to <span className="font-medium">Integrations</span> and click{" "}<span className="font-medium">Connect</span> to authorize an MCP server`，消息取值写成 `Go to <b>Integrations</b> and click <b>Connect</b> to authorize an MCP server`，渲染函数 `b: (chunks) => <span className="font-medium">{chunks}</span>` 保住原 DOM 与 `font-medium`。`messagesParity` 的 `RICH_TAGS` 认得 `b`，而 `missingKeys` 只匹配 `\bt\(\s*"`，`t.rich` 的键名不在它眼里，键是否存在靠 `next-intl.d.ts` 的键 union 与 tsc 兜住
- `revokeDescription` 带 `{name}`（`displayName(cred)` 的结果，数据不接键）。EN 值里的 `You'll` 是词中撇号，ICU 只在 `'` 后紧跟 `{`/`}`/`#`/`|`/`<`/`'` 时才当转义，实测渲染原样保留。没借 `mcpServers.userCredentials.revokeBody`：那边说"下一次 MCP 请求会失败"，本句说"重新连接才能在聊天中继续使用"，概念不同。中文用"吊销"，与同目录 `revoke`/`couldNotRevoke` 的既有译法一致，没有另起"撤销"
- 状态徽标的 `doesNotExpire`、`expired` 与 `expiresInDays`/`Hours`/`Minutes` 留在本命名空间：目录里 `Expired` 早已按作用域各开一键（`virtualKeys.status.expired`、`chat.keysPanel.expired`），`common` 只有 `sessionExpired`，没有裸 `expired`。三条 `expiresIn*` 用 `{count, number}`，与 `chat.logsPanel.requestsCount` 那批同样经 node + `intl-messageformat` 实测过渲染串与旧模板字符串逐字节相同

测试侧无断言可同步：`MCPCredentialsTab` 与 `KeysPanel` 都没有测试文件，`src/components/chat/*.test.tsx` 里 grep `just now|m ago|h ago|d ago|分钟前|小时前|天前` 也没有命中，上收 4 个键不影响任何断言

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 3 warning，3 条全在 `KeysPanel.tsx`（`complexity` 与两条 `no-large-inline-object-arg`），与第 36 簇记录的 `KeysPanel` 基线逐条相同，`MCPCredentialsTab.tsx` 本身 0 条；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动 `.tsx`，两个消息目录没跑 prettier

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 425 到 426，46.7%；`components/chat` 11 个非测试文件接入 8 个，剩 3 个按大小排是 `UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6748 到 6764（`chat` 命名空间 116 到 128，`common` 183 到 187），中英同值 86 不变

## 2026-10-15 第 38 簇更新

批次 24 第 38 簇：`components/chat/ConversationList.tsx`（332 行，接入后 355）接入 `chat`，新开 `chat.conversationList.*` 10 键（含 `dateGroup.*` 4 个子键），两个消息目录各 +14 行、纯增不删（插在 `chat.logsPanel` 之后）

改造形态：

- `DateGroup` 是内部桶名——`getDateGroup` 的返回值、`DATE_GROUP_ORDER` 的排序与 `map` 的 key 都靠这几个英文串，只有落到分组标题那一刻才翻译。`dateGroupLabel(t, group)` 用 switch 逐分支写 `t("conversationList.dateGroup.recents")` 这样的字面量：写成 `t(\`conversationList.dateGroup.${slug}\`)` 的话 `missingKeys` 守卫（只匹配 `\bt\(\s*"…"`）看不见，键 union 也接不住模板串
- 分组标签没有借 `logs.timeRange.last7Days`（同为 `Last 7 Days`）：那边是筛选下拉的区间选项，这边是历史列表的时间桶，概念不同，且跨命名空间借要把整棵列表挂第二个翻译器，按第 29、33、36 簇的口径另开本命名空间键
- 复用 3 个 `common` 键：`rename`、`delete`、`cancel`。`delete` 在同一条目的 tooltip 与确认弹窗的 action 各出现一次，两处取值 `Delete` / `删除` 相同，没有开第二个键
- 删除确认的说明句没有借 `prompts.info.deleteWarn`：取值差一个句号（`This action cannot be undone.` 对 `This action cannot be undone`），且不在 `common`。ZH 写成不带句号的 `此操作无法撤销`，与本簇 EN 对齐
- 空态是 `No conversations yet` + `<br />` + `Start a new chat above` 两行，换行留在 JSX 里，两个键各管一行，没有把 `<br>` 塞进消息（`next-intl` 的rich message 要走 `<br/>` 标签语法，取值会变成标记串，不值当）

测试侧无断言可同步：`ConversationList` 没有测试文件，唯一消费者 `ChatShell.tsx` 的 `ChatShell.test.tsx:23` 把它整体 mock 成 `<div data-testid="conversation-list" />`，`src/app/chat/page.integration.test.tsx` 走第 35 簇补的 `LocaleProvider`，provider 已就位。判为数据不接键：`dayjs(conv.updatedAt).format("MMM D")` 与标题截断的 `…`（`slice(0, 40)` + `"\u2026"`）

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`；`npx tsc --noEmit` 总 883、非测试 0；`npx eslint src/components/chat/ConversationList.tsx` 0 error / 0 warning，HEAD 同样 0；`npm run build` exit 0；prettier 先证 HEAD 干净再 `--write`，只动 `.tsx`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 424 到 425，46.6%；`components/chat` 11 个非测试文件接入 7 个，剩 4 个按大小排是 `MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6738 到 6748（`chat` 命名空间 106 到 116），中英同值 86 不变

## 2026-10-15 第 37 簇更新

批次 24 第 37 簇：`components/chat/LogsPanel.tsx`（344 行，接入后 369）接入 `chat`，新开 `chat.logsPanel.*` 19 键，两个消息目录各 +21 行、纯增不删（插在 `chat.keysPanel` 之后）

改造形态：

- 6 个模块级组件（`StatusBadge`、`JsonBlock`、`LogsEmpty`、`LogsError`、`LogsTable`、`LogDetailDialog`）各自 `useTranslations("chat")`，不传 `t` prop（沿用第 31、32、34 簇）。`JsonBlock` 的 hook 写在 `if (value == null) return` 之前，保持 hook 先于早退
- 复用 3 个 `common` 键：`success`、`status`、`retry`（取值 `Success`/`成功`、`Status`/`状态`、`Retry`/`重试` 逐字节相同）。`common.previous`、`common.next` 没复用：英文同为 `Previous`/`Next`，中文是向导步骤的 `上一步`/`下一步`，概念不同，按"概念与取值都相同才复用"另开 `previousPage`/`nextPage`（`上一页`/`下一页`）
- `colModel`、`colCost`、`colTokens`、`colDuration` 四个键在表头与详情卡的四个小标题各用一次——同一字段的两种排版，取值相同，没有为卡片另开一组
- 计数行 `chat` 里第一条复数消息：`{count, plural, one {# request} other {# requests}}`。`# request` 的 `#` 后带空格，落进 `messagesParity` 的 `^#\s+\S` 合法形态；`intl-messageformat` 直测 `count: 1500` 渲染成 `1,500 requests`，带千位分隔，与原来 `total.toLocaleString()` + `request{s}` 逐字节相同（`count: 1` → `1 request`）。中文不复数，写 `{count, number} 次请求`。曾考虑把已有的 `{total}` 嵌进复数分支，`messagesParity` 会把嵌套括号判成未加引号的非占位符，作罢
- `pageOf` 的取值以 ` · ` 开头（` · Page {page} of {totalPages}` / ` · 第 {page} 页，共 {totalPages} 页`）：原来是模板串拼在计数后面，分隔符属于这句而不是那句，两个表达式相邻时 JSX 吃掉换行空白，拼接结果必须逐字节等于旧渲染
- 详情卡的 token 行拆成 `formatTokens(total)` 与括号外的 `tokensInAndOut`（`{prompt} in / {completion} out`），左括号跟着前一段文本、右括号单独一行；`LogsPanel.test.tsx` 里补了一条 `1,500 (输入 1,000 / 输出 500)` 断言盯这个拼接，用例数没变

判为数据不接键：时间范围胶囊的 `24h`/`7d`/`30d`、`moment` 的 `MMM D, HH:mm:ss`、`formatCost` 的 `$` 与 `toFixed`、`formatDuration` 的 `s` 与 `-`，归货币/数字与日期格式欠账

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx vitest run` 全量 886 文件 11576 例、59 失败，`LogsPanel` 唯一消费者 `src/app/chat/logs/page.tsx` 在复跑范围内且全绿，失败仍集中在长尾既有那批；`npx tsc --noEmit` 总 883、非测试 0；`npx eslint` 两个改动文件 0 error / 0 warning，`git show HEAD` 覆盖工作区复测过同样是 0，本簇没新增；`npm run build` exit 0；prettier 先证 HEAD 两个文件干净再 `--write`，只动了 `.tsx`，两个消息目录没跑 prettier（HEAD 上同样报 warn，是既有状态）

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 423 到 424，46.5%；`components/chat` 11 个非测试文件接入 6 个，剩 5 个按大小排是 `ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6719 到 6738（`chat` 命名空间 87 到 106），中英同值 86 不变

## 2026-10-15 第 36 簇更新

批次 24 第 36 簇：`components/chat/KeysPanel.tsx`（399 行，接入后 419）接入 `chat`，新开 `chat.keysPanel.*` 34 键，两个消息目录各 +36 行、纯增不删（插在 `chat.messages` 之后）。`missingKeys` 与 `messagesParity` 两个守卫都在这簇抓到过真问题，见下

改造形态：

- 复用 5 个 `common` 键：`close`、`cancel`、`copied`、`noKeysFound`、`never`（"Never" 在空表与到期两处都用 `common.never`，取值 `Never` / `从不` 逐字节相同）。`Key Alias`、`Max Budget (USD)`、`TPM Limit`、`RPM Limit` 这些在 `teams`、`budgets`、`virtualKeys` 里都有同值键，但都不在 `common`，跨命名空间借要连带把整张面板挂第二个翻译器，按第 29、33 簇的口径另开本命名空间的键
- `relativeTime` 是模块级 helper，按首参翻译器约定改成 `relativeTime(t, iso)`，参数类型用 `ChatTranslator`（`src/lib/i18n/translators.ts`），不用裸 `ReturnType<typeof useTranslations>`
- 相对时间三个键是 `chat` 里第一次用带数字的消息。EN 写成 `{count, number}m ago` 而不是 `{count, plural, one {#m ago} other {#m ago}}`：`messagesParity` 的"未加引号的括号必须是占位符"那条只认 `#` 后带空格的 `# <文字>` 形态（`isLegitimate` 的 `^#\s+\S`），`#m ago` 会被判成占位符之外的裸括号；而加那个空格又会让英文从 `5m ago` 变成 `5 m ago`，破坏"EN 取值逐字节等于原渲染"。`{count, number}` 含逗号，守卫放行，两个 locale 实测都渲染成 `5m ago`（`intl-messageformat` 直测），中文侧再用 `{count, number} 分钟前`。EN 此前没有 `{count, number}` 先例，本簇开了第一条；ZH 已有 9 条
- 两处 `Current: {值}` / `New: {值}` 从 JSX 拼接改为带 `{expiry}` 占位符的消息，`(expired)` 后缀单独一键，空格写在 EN 取值里（`" (expired)"`），ZH 用全角括号不带空格
- premium 副标题那句 `". Rotate keys to ..."` 把句号留在取值开头：原渲染是 `View your virtual keys and spend` 与这句直接相邻（JSX 换行的空白会被吃掉，两个表达式之间不补空格），所以 `subtitle` + `rotateHint` 串起来必须逐字节等于原来那串。中文同理用句号开头 `。轮换密钥会生成新的凭据……`。这条与"句号属于取值内部"的既有口径一致，不是新约定
- 表头在骨架屏与真实表里各写一遍，两处都接同一组键，没有为骨架屏另开键

`maskKey` 的 `"sk-..."` 与单元格里 `${spend.toFixed(2)}` 的美元符号判为数据，前者是掩码占位、后者归货币与数字格式欠账

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`（第 35 簇起的复跑范围，本簇未增删用例）；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint src/components/chat/KeysPanel.tsx` 0 error / 3 warning，用 `git show HEAD` 覆盖工作区复测过，同样 3 条（`complexity` 与两条 `no-large-inline-object-arg`），本簇没新增；`npm run build` exit 0；KeysPanel 没有测试文件，唯一消费者是 `src/app/chat/api-keys/page.tsx`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 422 到 423，46.4%；`components/chat` 11 个非测试文件接入 5 个，剩 6 个按大小排是 `LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6685 到 6719（`chat` 命名空间 53 到 87），中英同值 86 不变

## 2026-10-15 第 35 簇更新

批次 24 第 35 簇：`components/chat/ChatMessages.tsx`（473 行，接入后 486 行）接入 `chat`，新开 `chat.messages.*` 11 键。同簇把第 34 簇的 `chat.appsPanel.back` 收进 `common.back`——概念与取值都逐字节相同（`Back` / `返回`），没必要两处各存一份。两个消息目录各 +13 行、-1 行：新增 11 个键加组壳与逗号，删掉那 1 个重复键，除此之外仍是纯插不删

改造形态：

- 4 个只在文件内部使用的组件（`OmittedImage`、`ThinkingPlaceholder`、`CopyButton`、`ToolCard`）各自 `useTranslations("chat")`，不传 `t` prop（沿用第 31、32、34 簇）。`markdownWithoutImages` 的 `img` 分支原来是内联 `<span>{alt || "Image omitted"}</span>`，内联箭头函数在模块级常量里，挂不了 hook，所以换成 `<OmittedImage alt={alt} />`——`components` 那个对象保持模块级，不用 `useMemo` 重建，也不会让 react-markdown 每次渲染都换组件类型
- `Cancel`、`Copy` 复用 `common.cancel` / `common.copy`，走 `commonT = useTranslations("common")`（先例 `VirtualKeysPage/VirtualKeysTable.tsx:95-96`）。`missingKeys` 守卫只看 `\bt(`，看不到 `commonT(...)`，但 `AppConfig.Messages` 把键 union 绑到了命名空间，写错作用域是 tsc 报错，不会漏
- `Copied!` 没有复用 `common.copied`（那是 `Copied` / `已复制`，差一个感叹号），按"概念与取值都相同才复用"另开 `chat.messages.copied`
- `[stopped]` 是 `app/chat/page.tsx:233` 追加进消息正文的中断标记，属于数据不是文案：本簇只翻渲染时回显的那一段（`chat.messages.stopped`，EN 取值逐字节还是 `[stopped]`，ZH 为 `已停止`），剥离用的 `endsWith("[stopped]")` 不动，历史会话里已存好的正文照样能剥
- 3 处 `aria-label`（编辑框、编辑按钮、复制按钮）都接了键，可及名跟着 locale 走；`Edit message` 的 tooltip 与两处 `aria-label` 共用 `chat.messages.editMessage`

测试侧断言一处没改：`chat` / `liteadmin` / `app/chat` 三个目录 grep 过，`ChatMessages` 的文案此前没进过任何断言。要改的是 provider——`src/app/chat/page.integration.test.tsx` 原来两处都是裸 `render(<ChatConversationPage />)`，接入后子树里的 hook 找不到 `NextIntlClientProvider` 会直接抛，补成 `<LocaleProvider locale="zh-CN">`（同文件剩下的 `How can I help you today?`、`Send`、存储横幅仍断言英文，它们来自本簇没动的 `ChatShell.tsx`）。`LiteAdminConversation.tsx:43` 也渲染 `ChatMessageContent`，但 `LiteAdmin.integration.test.tsx` 的 `tree()` 本来就包了 `LocaleProvider`，不用动

验证：`npx vitest run src/lib/i18n src/components/chat src/app/chat src/app/connect src/components/view_logs src/components/liteadmin` → 70 文件 861 例全绿，`Type Errors no errors`；`npx tsc --noEmit -p .` 总 883、非测试 0；`npx eslint` 三个改动文件 0 error / 5 warning（都是既有告警：`no-large-inline-object-arg`、`testing-library/no-node-access`）；`npm run build` exit 0；prettier 先证 HEAD 干净再跑，三个文件 unchanged

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 421 到 422，46.3%；`components/chat` 11 个非测试文件接入 4 个，剩 7 个按大小排是 `KeysPanel.tsx`（399）、`LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）、`ConnectFlowSurface.tsx`（59，无自有文案）。键数 6675 到 6685（`chat` 命名空间 43 到 53），中英同值 86 不变

本簇新记的欠账：`formatTimestamp` 输出的是手写 `HH:MM`（`padStart` 拼串，没走 `Intl.DateTimeFormat`），与第 23、24 簇的时序格式同一口径，归"## 技术债"里的日期/数字欠账。`redactSensitiveValues` 打的 `[redacted]` 判为占位值不译，它进的是参数快照的展示与复制文本，跟 `logs` 侧那批哨兵值同类

## 2026-10-14 第 34 簇更新

批次 24 第 34 簇：`components/chat/MCPAppsPanel.tsx`（626 行，接入后 634，`chat` 目录最大的一个文件）接入 `chat`，新开 `chat.appsPanel.*` 29 键，两个消息目录各 +31 行、纯增不删（插在 `chat.connectPicker` 之后，命名空间内仍按簇的加入顺序排）

改造形态：

- 导出的助手组件 `OAuth2ConnectButton` 自己 `useTranslations("chat")`，不加 `t` prop（沿用第 31、32 簇的写法）；badge 与 button 两种形态共用 `connect` / `connecting` 两键
- `connectUnavailabilityLabel` 是 `useCallback`，`t` 进依赖数组（全仓 `.tsx` 已有 15 处 `, t]` 先例）。next-intl 的 `t` 按 locale memo，只有切换语言才换引用，不会让依赖它的 `oauthConnected` effect 反复重跑
- Information 三行原本是 `[["Server ID", v], ["Transport", v], ["Status", v]]` 且 `key={label}`，接 `t()` 后 key 会变成译文，给每行补一个稳定的首元 `rowKey`（`serverId` / `transport` / `status`），label 只管显示
- `{totalTools} tool{s} available` 交给 ICU：EN `{count, plural, one {# tool available} other {# tools available}}`，ZH 退化成 `{count, number} 个工具可用`。目录里 `{count, number}` 已有 5 处、`plural, other` 2 处，取多数写法；`{count, number}` 才带千分位（第 29 簇那条）
- 第 33 簇记下的尾巴收掉：本面板的 toast `Could not load tools for ${serverName}` 与 `connectPicker.loadToolsFailed` 英文值不同（少了后半句），仍不共键，另开 `appsPanel.loadToolsFailed`；`result?.error` 与 `catch` 两个分支照旧各留一次 `t(...)` 调用
- `detailServer.description ?? "MCP server"` 与卡片行 `server.description ?? "MCP server"` 同值同概念，共用一个 `defaultDescription`；它和标题键 `title` 的中文同为 `MCP 服务器`，英文单复数不同，不合并
- Beta 徽标开 `appsPanel.beta`，没有复用 `common.beta`：`common.beta`（`Beta` / `Beta 版`）此刻是死键，它该服务的是共享组件 `components/BetaBadge.tsx`（仍写死 `Beta`），留给共享组件那一簇接入；本面板的徽标是内联 markup，文案归 `chat` 这组。中文取值与 `common.beta` 对齐，`uppercase` 样式把它显示成 `BETA 版`，属样式不属文案
- 页签的 `Connected (${connectedCount})` 只把 `Connected` 收进 `tabConnected`，括号里的裸计数留在 `.tsx`，归"## 技术债"的日期/数字欠账

测试同步：`MCPAppsPanel.test.tsx` 的 3 个 render 点（`renderPanel`、`renderConnectPanel`、内联 `ConnectPanel`）各自新建 `QueryClient`，其中两处还要把同一个 client 传给 `rerender`，换 `renderWithProviders` 会共用测试客户端、动它的缓存与重试假设，所以沿用第 33 簇 `ConnectFlowSurface.test.tsx` 的办法，在原 wrapper 里补一层 `<LocaleProvider locale="zh-CN">`。断言改 10 处：`Connected (1)` / `Connected (2)` → `已连接 (1)` / `已连接 (2)`，`{ name: "Connect" }` → `{ name: "连接" }`（5 处，含 2 处 `fireEvent.click`），`queryByText("Connect", { exact: true })` → `"连接"`，`Not supported on this connection` → `该连接不支持`，`getByText("Connected", { exact: false })` 与它的 `toHaveTextContent` → `已连接`。`已连接` 与页签的 `tabConnected` 同值，那一处仍只有页签命中，不需要改 `getAllByText`

判为数据、不译：`handleTransport(...)` 返回的 `http` / `sse` / `stdio` / `openapi` 是 `TRANSPORT` 常量里的协议 id，只显示在"传输方式"的值位——`mcpServers.transport.*` 那 4 个键虽然存在，值是建服务器表单的选项文案（带"（推荐）""（SSE）"这类限定语），概念不同不能共键；`server_id`、`server_name` / `alias`、`tool.name` 与 `tool.description`（MCP 工具自述）、`logo_url` 与 alt 文本、首字母头像的 `N` 都取自后端；`queryByText("Not available to connected apps")` 那条负断言留着英文——组件从来没有这个字符串，断言的是"它不渲染"

验证：`chat` + `app/chat` + `app/connect` + `view_logs` + `src/lib/i18n` 67 文件 749 例全绿，未增删用例；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 2 个文件 `eslint` 0 错误，1 条 warning 是 `useUserMcpOAuthFlow({ accessToken, serverId, serverAlias, onSuccess })` 的内联对象，`git show HEAD` 复跑 lint 得到同一位置的同一条，属既有；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx，改前均合规；两个 messages JSON 各 31 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 420 到 421，46.2%；`components/chat` 11 个非测试文件接入 3 个，剩余 8 个里 `ConnectFlowSurface.tsx`（60 行）无自有文案，其余按大小排是 `ChatMessages.tsx`（473 行）、`KeysPanel.tsx`（399）、`LogsPanel.tsx`（344）、`ConversationList.tsx`（332）、`MCPCredentialsTab.tsx`（232）、`UsagePanel.tsx`（212）、`ChatShell.tsx`（149）。键数 6646 到 6675（`chat` 命名空间 14 到 43），中英同值 86 不变

## 2026-10-14 第 33 簇更新

批次 24 第 33 簇：转入 `components/chat/`，先收网关连接流的 2 个文件 `ConnectFlowBanner.tsx`（119 行）与 `MCPConnectPicker.tsx`（133 行），新开顶层 `chat` 命名空间共 14 键（`chat.connectFlow.*` 12 键 + `chat.connectPicker.*` 2 键），两个消息目录各 +20 行、纯增不删

改造形态：

- `chat` 是这批目录的第一个新命名空间。顶层键在文件里按加入顺序排（`logs` 在 3722 行、`playground` 在 6110 行，都不是字母序），本簇把 `"chat": {` 插在 `"playground": {` 之前——既挨着同类界面，又是纯插不删；插在文件尾就要给上一个命名空间的闭括号补逗号
- 命名空间与 `playground` 分开，是因为 `playground` 整组属于 `app/(dashboard)/playground/components/chat_ui/`，两套界面的文案不能共键
- 模块级纯助手 `copyFor(flow, failed)` 改成 `copyFor(t, flow, failed)`，首参类型用新加的 `ChatTranslator`（`src/lib/i18n/translators.ts` 里按 `useChangePasswordTranslator` 之后的位置插入），不用裸 `ReturnType<typeof useTranslations>`
- 四个网关状态各有一条标题与说明，原本用模板串拼 `${clientLabel}` / `${serverLabel}`，现在整句进消息、变量交给 ICU 的 `{client}` / `{server}`。两条兜底标签 `"the application"` / `"the requested MCP server"` 也跟着成为键（`fallbackClient` / `fallbackServer`），因为中文里它们要嵌进句子，不能留着英文原串
- `allowTitle` 被 interactive 与 m2m 两个分支共用（原代码两处模板串逐字相同），所以只开一个键
- picker 的 toast 文案在 `result?.error` 与 `catch` 两个分支重复，原代码本就重复，翻完仍保留两处 `t(...)` 调用，不提前抽变量

测试同步：这 2 个组件此前都在裸 `render()` 下测，接入 `next-intl` 后没有 provider 会直接抛，所以 `ConnectFlowBanner.test.tsx` 与 `MCPConnectPicker.test.tsx` 改用 `renderWithProviders`（默认钉 `zh-CN`）。`ConnectFlowSurface.test.tsx` 不用 `renderWithProviders`——它自带一个每次新建的 `QueryClient` 并 mock 掉 `next/navigation`，改成共用测试客户端会牵动它自己的重试与缓存假设，所以在原 wrapper 里只补一层 `<LocaleProvider locale="zh-CN">`。断言改 8 处：`/finish connecting/i`（4）与合并式 `/finish connecting|cancel|connect/i`（1）转中文，`"Cancel"`（3）转 `"取消"`；合并式里保留 `connect` 这一段，因为 OAuth 按钮的文案在 `MCPAppsPanel.tsx`，本簇没动它

判为数据、不译：表单 `action` 与 `name="flow"` / `name="decision"` / `value="deny"` / `value="manual"` 是提交给网关的协议字段；`client_origin`、`server_name`、`logo_url` 与 `external_logo logo` 这类 alt 文本取自后端；`MCPAppsPanel.tsx` 的 267/275 行 `Could not load tools for ${serverName}` 与 343 行 `No MCP servers configured. Add servers in Tools -> MCP Servers.` 看着和 picker 的两键同形，英文值却不一样（少了后半句、多了导航路径），不共键，留给 `chat` 的下一簇

验证：`chat` + `app/chat` + `app/connect` + `view_logs` + `src/lib/i18n` 67 文件 749 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 6 个文件 `eslint` 0 错误、8 条 warning 全在 `ConnectFlowSurface.test.tsx` 的既有 container/node 访问上；`npm run build` 退出 0；prettier 只 `--write` 本簇 6 个 tsx，改前全部合规；两个 messages JSON 各 20 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 418 到 420，46.1%；`components/chat` 11 个非测试文件接入 2 个，`ConnectFlowSurface.tsx` 经核实没有自有文案（只有 JSDoc 注释），不进接入清单。键数 6632 到 6646，中英同值 86 不变

## 2026-10-14 第 32 簇更新

批次 24 第 32 簇：`components/view_logs/LogDetailsDrawer/LogDetailContent.tsx`（819 行，`view_logs` 目录最后一个仍带自有硬编码文案的文件）接入 `logs`，新增 `logs.detail.*` 47 键与 `logs.guardrail.notRunSuffix`，两个消息目录各 +50 行、纯增不删。`components/view_logs` 整目录的展示文案到此清零

改造形态：

- 文件里 12 个区块组件与两个小助手（`MetricLabel`、`CopyButton`）各自 `useTranslations("logs")`，沿用第 31 簇空态的写法，不给它们加 `t` prop；只有顶层 `LogDetailContent` 的 `t` 是原本就有的
- `CopyButton` 的 `label` 是 `string` prop，翻不动，所以调用点显式传 `detail.copyJson` / `detail.copyMetadata`；`MetricLabel` 的 `{label} info` 可及名收进 `detail.infoAria`，由组件内部解析
- 删掉两个模块级常量 `RESPONSE_CACHE_TOOLTIP`、`CACHE_KEY_TOOLTIP`，英文原值逐字节搬进消息目录，`MetricsSection` 取回来存 4 个局部变量再传给 `MetricLabel`（tooltip 是 `string` prop，不能传 key）。`@/utils/promptCacheUsage` 的 `PROMPT_CACHE_{READ,CREATION}_TOOLTIP` 本簇停止 import 但文件留着——`chat_ui/ResponseMetrics.tsx` 还在用，收编它的那一簇会一并处理，期间英文说明在 util 与目录里并存，属有意重复
- 7 处复用已有键：`requestDetails`、`model`、`tokens`、`cost` 四个顶层通用标量，加 `columns.tags`、`drawer.provider`、`filters.credential` 三个同目录既有键；其余 41 个是新键
- 新键插在 `"logs": {` 之后开新组，`notRunSuffix` 插在 `"guardrail": {` 之后，两处都是纯增不删
- 单复数交给 ICU：跳转徽标的 `${n} guardrail${n !== 1 ? "s" : ""} evaluated` 改 `t("guardrail.guardrailsEvaluated", { count })`（第 30 簇已定形的键，此处直接复用），`, ${n} not run` 拆成独立的 `notRunSuffix`，中文用全角逗号把衔接写进消息值

判为数据、不译：`errorInfo.error_message || "An error occurred"` 是合成的错误载荷，进 `JsonViewer` 也进复制文本，不是界面标签；`"Cache OFF"` 是判断哨兵；`custom_llm_provider || "-"`、`JSON` 页签名、`SYSTEM` / `ASSISTANT` 角色 chip（`InputCard.tsx` / `OutputCard.tsx` / `RealtimePrettyView.tsx`，协议角色名）、`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING` 分级 chip（`RoutingDecisionCard.tsx`，沿第 20 簇"四个等级名固定不译"的先例）。moment 的 `"YYYY-MM-DDTHH:mm:ss.SSS[Z]"`、`-` / `s` / `ms` / `2 / 3` / `42.50 ms` 这类时序与数字格式仍归"## 技术债"的日期/数字欠账

测试同步：`LogDetailContent.integration.test.tsx` 改 41 处文本断言加 2 处 `getAllByRole("img", { name: /info/i })` 到 `{ name: /信息/ }`；`gpt-4o`、`anthropic`、`batch_abc123`、`abc123cachekey`、`PII Filter`、`42.50 ms`、`2 / 3`、`JSON` 这些后端值与不译项不动，`queryByText("Cache Hit")` 的负断言照旧成立；用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`LogDetailContent.tsx` `eslint` 0 错误、11 条 warning 与改前同样数量（全是既有 `no-explicit-any`）；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx，改前均合规；两个 messages JSON 各 50 增 0 删

覆盖率复测：非测试 `.tsx` 912 个、已接入 418 个都不变（本文件此前已接入，只是还留英文），45.8%；`components/view_logs` 71 个里接入 60 个也不变，剩下 11 个是第 31 簇核实过的无文案文件。键数 6584 到 6632，中英同值 86 不变

## 2026-10-14 第 31 簇更新

批次 24 第 31 簇：`components/view_logs/` 根目录的收尾——`log_filter_logic.tsx`、`RequestLogsTable.tsx`、`RequestLogsPanel.tsx`、`index.tsx` 四个文件，新增 10 键，两个消息目录各 +12 行（10 个键 + `"table": {` 与闭括号）。根目录的展示文案到此清零，剩下的硬编码集中在 `LogDetailsDrawer/`，归下一簇

改造形态：

- `LOG_FILTER_LABELS: Record<string, string>` 改为 `LOG_FILTER_LABEL_KEYS: Record<string, LogsFilterLabelKey>`，15 个筛选标签只存键名，翻译落在消费点 `RequestLogsTable.tsx`，按 `VirtualKeysPage/VirtualKeysTable.tsx` 的口径用 `useMemo` 把 `Object.entries` 映射成 `Record<string, string>` 再交给 `DataTableToolbar` 的 `filterLabels`。该表只有一个消费者，没有别的调用点要跟着改
- 15 个标签里 13 个复用已有键：12 个走 `logs.filters.*`，`Status` 与 `Model` 用顶层的 `logs.status` / `logs.model`（取值逐字节相同，概念也一样）。新建的只有 `logs.filters.search`。它没有改用 `common.search`，是因为同一张表的键必须落在同一命名空间：`LogsFilterLabelKey` 的键取自 `LogsTranslator` 的键 union，掺进 `common` 就得在同一个 `useMemo` 里挂第二个翻译器。`VirtualKeysTable` 能直接用 `common`，是因为它整张表都在 `common`
- `RequestLogsEmptyState` 内部自己 `useTranslations("logs")`，与同目录 `AuditLogsEmptyState` 写法一致，不给组件加 `t` prop。`AuditLogsTable` 的空态四键（`empty` / `emptyDesc` / `emptyFiltered` / `emptyFilteredDesc`）也是新组 `logs.table.*` 的命名依据
- `logs.backToLogs` 按 `teams.infoBackToTeams` / `users.infoBackToUsers` 的既有命名排；面板标题不新开键，复用 `logs.tabs.requestLogs`
- `index.tsx` 的 `aria-label="Loading"` 接 `logs.loading`。那个组件已有的 `t` 绑在 `logs.tabs` 上，所以另起一个 `logsT = useTranslations("logs")`，不去改前者的命名空间（tabs 的键全是 `t("requestLogs")` 这种短路径，换绑要动 4 处）

判为数据、不译：`RequestLogsTableColumns.tsx:154` 的 `"Success"` 是 `status` 字段的兜底值，只参与 `status.toLowerCase() !== "failure"` 判断，渲染走 `t("success")` / `t("failure")`；`AuditLogDrawer.tsx:50` 的 `console.error("Copy failed:", e)` 不是用户可见文案。这两条此前被记在漏网清单里，本簇核实后划掉

共享组件欠账（本簇绕开、没在原地修）：`DataTableToolbar.tsx:78` 的 `aria-label={\`Remove ${label} filter\`}` 模板本身是英文，标签翻完之后按钮可及名成了 `Remove 搜索 filter`；`DataTableFilterDrawer.tsx:49` 的默认 `title = "Filters"` 同理。后者本簇在调用点显式传 `logs.table.filtersTitle`，前者留给 `common_components` 长尾，改它要先决定模板进哪个命名空间

测试同步：`RequestLogsPanel.test.tsx` 改 2 处（chip 文本 `搜索:sess-42` 与上面的按钮名），用例数不增不减。`log_filter_logic.test.tsx` 与 `RequestLogsTable` 没有测试依赖 `LOG_FILTER_LABELS`（该目录不存在 `RequestLogsTable.test.tsx`，面板测试走的是渲染结果）

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；本簇 4 个文件 `eslint` 0 错误、6 条 warning 全在既有代码行（新增块没触发规则）；`npm run build` 退出 0；prettier 只 `--write` 本簇 4 个 tsx，其中 2 个改前就合规；两个 messages JSON 各 12 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 417 到 418，45.8%；`components/view_logs` 71 个里接入 60 个，剩 11 个经核实全部没有自有文案——`columns.tsx`（类型与排序映射）、`logs_utils.tsx` 与 `AuditLogsTableColumns.tsx` 与 `log_filter_logic.tsx`（本簇起改为接收/只存键名）、`ToolsSection/JsonToolView.tsx` 与 `LogDetailsDrawer/` 的 `SimpleMessageBlock.tsx` / `PrettyMessagesView.tsx`（标签来自 props）、`TraceView/` 的 `SpanIcon` / `Collapse` / `ActiveDot` / `AgentTracesPage`。键数 6574 到 6584，中英同值 86 不变

## 2026-10-14 第 30 簇更新

批次 24 第 30 簇：`components/view_logs/GuardrailViewer/GuardrailViewer.tsx`（851 行）接入 `logs`，沿用第 29 簇的 `logs.guardrail.*` 组并新增 39 键，两个消息目录各 +39 行。`GuardrailViewer/` 目录的展示文案到此清零，5 个非测试 `.tsx` 全部接入

改造形态：

- `formatMode(mode)` 按首参翻译器约定改成 `formatMode(t, mode)`，并加 `MODE_LABEL: Record<string, ModeLabelKey>`：`pre_call` / `post_call` / `during_call` / `logging_only` 四个阶段名走消息，表里没有的值仍按原来的 `replace(/_/g, "-").toUpperCase()` 渲染。这样后端新增阶段名不会变成空白
- `OUTCOME_LABEL` 从 `Record<EntryOutcome, string>` 改值为键名的 `Record<EntryOutcome, OutcomeLabelKey>`，渲染处 `t(OUTCOME_LABEL[outcome])`。徽标文本在卡片头、时间轴行与折叠态各出现一次，走同一张表
- 时间轴的条目在 `useMemo` 里拼好 `label` 再渲染，所以 `t` 进了依赖数组（`[sorted, t]`）。`TimelineEntry.label` 仍是 `string`，类型不用动
- 单复数交给 ICU：`guardrailsEvaluated` 与 `textRecords` 英文写 `{count, plural, one {# …} other {# …}}`，中文退化成量词短语并用 `{count, number}` 保住千分位。原代码 JSX 里的 `textRecords.toLocaleString()` 与 `{textRecords === 1 ? "" : "s"}` 一起去掉，`#` 本身带千分位
- 复用第 29 簇的键：匹配详情表的 `Type` / `Action` 用 `guardrail.thType` / `thAction`，分类区的 `Category:` / `Confidence:` 用 `guardrail.colCategory` / `colConfidence`——同一个 `guardrail` 组、同一个概念，不再另开键
- 新键插在 `"guardrail": {` 之后而不是组尾。插组尾要给原末键补逗号，`git diff --numstat` 就出现删除行；插组首则纯增不删。第 29 簇靠新开组吸收了那个逗号，本簇没有新组可开
- 时间轴的偏移量 `T+{ms}ms`、`formatDurationMs` 的 `{ms}ms` 与导出文件名 `guardrail-compliance-log-<日期>.json` 都留在 `.tsx` 里，属时序数值格式，归"## 技术债"的日期/数字欠账。测试里 `/^T\+/` 的负断言因此照旧成立

不译：`masked_entity_count` 的 `{entityType}: {count}` 与 `match.type` / `detection_method` / `action_taken`（含 `BLOCK`）、`entry.detection_method.split(",")[0]`、后端返回的 `guardrail_name` / `policy_template`、`"guardrail"` 这个 key 兜底串、以及 `—` / `-` 两个哨兵

测试同步：`GuardrailViewer.test.tsx` 改 26 处。标题 `护栏与策略合规`（5）、状态徽标 `通过` / `已标记` / `失败` / `未执行`、计数 `通过 1` / `标记 1` / `未执行 1` / `已评估 0 个护栏`、阶段徽标 `PRE-CALL` 到 `调用前`（2）、时间轴 `收到请求` / `LLM 调用` / `返回响应` 与 `调用前护栏：conduct` 一类带名字的 6 条、命中计数 `命中 3` 与 `/命中/`。`pii-rail`、`no scannable content after message scoping`、`EMAIL_ADDRESS: 2`、`T+250ms`、`1235ms` 这些后端值与格式不动。exact 与 regex 分工要留意：`getByText("通过")` 只匹配徽标元素，`/通过 1/` 只匹配头部计数，中文同名概念靠这点区分才不会撞。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`GuardrailViewer/` 整目录 `eslint` 0 错误、25 条 warning，与第 29 簇后同样数量；`npm run build` 退出 0；prettier 只 `--write` 本簇 2 个 tsx；两个 messages JSON 各 39 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 416 到 417，45.7%；`components/view_logs` 71 个里接入 59 个，剩 12 个里 4 个是 `TraceView` 的无文案文件，其余为根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6535 到 6574，中英同值 86 不变

## 2026-10-14 第 29 簇更新

批次 24 第 29 簇：`components/view_logs/GuardrailViewer/` 的 4 个展示组件 `PresidioDetectedEntities.tsx`、`ContentFilterDetails.tsx`、`CompliancePanel.tsx`、`BedrockGuardrailDetails.tsx` 接入 `logs`，新增 `logs.guardrail.*` 71 键，两个消息目录各 +73 行（71 个键 + `"guardrail": {` 一行 + `vectorStore` 闭括号补逗号另起一行），纯增不删。目录里只剩 851 行的 `GuardrailViewer.tsx` 留给下一簇

改造形态：

- 四个组件共用一个 `guardrail` 组。护栏术语（detected / masked / blocked / coverage / usage / assessment）在本目录反复出现，键名靠语义前后缀区分（`blockedChip` 对 `colBlockedResponse`、`textGuardedChip` 对 `textCoverageChip`），不再按组件拆组
- `boolPill(b)` 是模块级 helper，按首参翻译器约定改成 `boolPill(t, b)`，调用点同步。`BedrockGuardrailDetails.tsx` 因此 `import type { LogsTranslator }`，而不是裸 `ReturnType<typeof useTranslations>`——后者会把键联合放宽到整个 `logs` 命名空间，写错键名检查不出来（`src/lib/i18n/translators.ts` 的注释就是这条）
- `assess.topicPolicy.topics.map((t, i) => …)` 的形参会遮蔽翻译器，改名 `topic`。这类遮蔽 tsc 未必报错（`t` 恰好也是可调用值），但渲染期就坏，接线时每个 map 形参都要过一遍
- 计数 chip 从模板串抽成带 `{count}` 的消息（`blockedChip`、`maskedChip`、`patternsChip`、`keywordsChip`、`categoriesChip`、`detectedEntities`）；覆盖率 chip 带 `{guarded}` / `{total}` 两个占位，调用度量区另配 `textCoverageChip` / `imagesCoverageChip`，因为中文里两处语序不同
- 合规徽标走三元键名 `t(data.compliant ? "guardrail.compliantBadge" : "guardrail.nonCompliantBadge")`
- `CompliancePanel` 的 hook 在私有子组件 `ComplianceCard` 与主组件各调一次，不做 props 透传。两条 `.catch` 里 `err.message ||` 右侧的兜底文案（`euAiActCheckFailed` / `gdprCheckFailed`）落在渲染路径上，一并接 `t`，`useEffect` 依赖数组随之加 `t`
- 两张表（词表/内容策略、上下文落地）的同名表头复用 `thType` / `thAction` / `thDetected` 各两次；`Section` 标题、`<h6>` 小节名与 `<KV label>` 冒标签各自成键，中英的冒号与全角括号都收在消息值里

不译：

- 法规与产品名 `EU AI Act`、`GDPR`、`PII`、`Bedrock`，以及 AWS 风格的 kebab 动作标签 `word` / `content` / `topic` / `sensitive-info` / `contextual-grounding` / `automated-reasoning`
- usage pill 渲染的是 `{k}: {v}`，`k` 取自后端 `response.usage` 的键名（`contentPolicyUnits` 等），属数据值；`BedrockGuardrailDetails` 底部折叠区的 JSON 原文同样只有标题译了
- `ComplianceCard` 展开体的 `check.check_name` / `check.article` / `check.detail` 全部来自合规接口
- 哨兵值 `—`、`N/A`、`unknown`、`regex`、`topic` 与动作码 `BLOCK` / `GUARDRAIL_INTERVENED` 照旧

测试同步：`PresidioDetectedEntities.test.tsx` 改 8 处（`得分：0.92`、`位置：10-20`、`实体类型：`、`第 10-20 个字符`、`置信度：`、`识别器：`、`说明：`、`第 0-0 个字符`）；`BedrockGuardrailDetails.test.tsx` 改 20 处（`处置：`、`文本已防护 27/100`、`图片已防护 1/3`、`输出`、`评估 #1` 2 处、`词策略`、`自定义词`、`托管词表`、`上下文落地`、`getAllByText("得分")`、`getAllByText("阈值")`、`敏感信息`、`PII 实体`、`自定义正则`、`话题策略`、`调用度量`、`原始 Bedrock 护栏响应`、`（非文本输出）`）；`GuardrailViewer.test.tsx` 改 3 处（`/检出实体/`、`/原始 Bedrock 护栏响应/` 两条负断言与 `输出`）。`contentPolicyUnits: 7`、`wordPolicyUnits: 1`、`"weapons"`、`"Policy violation"`、`"[blocked]"` 这些数据值断言不动；`GuardrailViewer.tsx` 自己的 `Guardrails & Policy Compliance`、`PRE-CALL`、`/Pre-call guardrail:/`、`pii-rail` 还是英文，随下一簇处理。`ContentFilterDetails.tsx` 与 `CompliancePanel.tsx` 没有对应测试文件。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`GuardrailViewer/` 整目录 `eslint` 0 错误、25 条 warning，全是既有代码形态（`complexity`、`no-nested-ternary`、`no-explicit-any`、`no-large-inline-object-arg`），本簇没新增告警类别；`npm run build` 退出 0；prettier 只 `--write` 本簇 3 个 tsx，两个 messages JSON 各 73 增 0 删

顺带记一条方法债：本簇用 `git show HEAD:… | eslint --stdin` 复测 HEAD 时，同一批文件在 HEAD 报出了当前树里并不存在的 error（`no-nested-ternary`、`react-hooks` 的 setState 告警升级为 error）。这个目录靠 `--stdin` 复测不可信，缺 `.tsx` 上下文与类型信息时会换一套规则结果，以当前树的 `npx eslint <目录>` 为准，本簇结论按这条口径写

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 412 到 416，45.6%；`components/view_logs` 71 个里接入 58 个，剩 13 个里 4 个是 `TraceView` 的无文案文件，其余为 `GuardrailViewer/GuardrailViewer.tsx` 与根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6464 到 6535，中英同值 86 不变

## 2026-10-14 第 28 簇更新

批次 24 第 28 簇：`components/view_logs/` 根目录的 4 个查看器 `ConfigInfoMessage.tsx`、`CostBreakdownViewer.tsx`、`EvalViewer/EvalViewer.tsx`、`VectorStoreViewer.tsx` 接入 `logs`，新增 `logs.configInfo.*` 3 键、`logs.costBreakdown.*` 17 键、`logs.eval.*` 17 键、`logs.vectorStore.*` 11 键，共 48 键；两个消息目录各 +56 行，纯增不删

改造形态：

- `ConfigInfoMessage` 的正文段是 `t.rich`，`<code>` 包 `proxy_config.yaml`、`<strong>` 包 `Admin Settings → Logging Settings`，两个处理器各接 `chunks`
- hook 一律早于早退：`ConfigInfoMessage` 的 `t` 在 `if (!show) return null;` 之前，`VectorStoreViewer` 在两个 `useState` 之后、`if (!data || data.length === 0)` 之前；`EvalViewer` 与私有子组件 `EvalEntryCard` 各调一次，不做 props 透传
- `CostBreakdownViewer` 的三处 token 计数从模板串抽成带占位符的消息（`tokensCount` / `promptTokensCount` / `completionTokensCount`），数字仍在组件里 `toLocaleString()`；折扣与利润加成的百分比括注同理收进 `discountPct` / `marginPct`，`formatPercent` 的结果走 `{percent}`
- `eval.scoreValue` 的值 `"{score} / 100"` 是纯数字加分隔符，中英一致，这就是同值键从 85 到 86 的那一个
- `vectorStore.logoAlt` 沿用 `mcpServers.tools.serverLogoAlt` 的既有口径：英文 `"{name} logo"`、中文 `"{name} Logo"`，Logo 属产品词不译
- 通过/未通过徽标走三元键名 `t(passed ? "eval.passed" : "eval.failed")`，与前面几簇同一写法

不译：

- `general_settings:` 那段 YAML 是要复制进配置文件的代码块，`<pre>` 里的三行照旧
- `additional_costs` 的键名（`Azure Model Router Flat Cost`、`Routing Fee` 等）是后端返回的数据值，连渲染时补的那个 ASCII 冒号一起留在 `.tsx` 里
- `vectorStore` 的 `formatTime` 用 `date.toLocaleString()`、耗时是 `${duration.toFixed(2)}ms`，两者都归"## 技术债"里的日期/数字格式欠账，本簇不动
- `Admin Settings → Logging Settings` 是菜单路径，中文值里按前面几簇的口径保留英文原文

测试同步：`ConfigInfoMessage.test.tsx` 从裸 `render` 换成 `renderWithProviders`（固定 zh-CN），标题断言改 `请求/响应数据不可用`；`CostBreakdownViewer.test.tsx` 改 17 处（`成本明细` 3、`输入成本：` / `输出成本：` / `最终计算成本：` 各 2、`提示缓存读取成本：` / `提示缓存写入成本：` 各 1、`/500 个输入令牌/`、`/200 个输出令牌/`、`/（已缓存）/`、`/折扣（10\.00%）/`、`/利润加成（15\.00%）/`）；`LogDetailContent.integration.test.tsx` 改 3 处（`请求/响应数据不可用` 2、`向量存储请求` 1）。`additional_costs` 的 5 条数据键断言、`should reference Admin Settings → Logging Settings` 那条正则、`/prompt tokens \+ .* completion tokens/` 的负断言与 `Start Time` / `End Time` / `Provider` 这些 `LogDetailContent` 自己的描述项标签都不动。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；这 7 个文件 `eslint` 0 错误、6 条 warning 全在既有行（`CostBreakdownViewer` 的 5 条 `complexity` / 条件链与 `VectorStoreViewer` 的 1 条 `<img>`，用 `git show HEAD:… | eslint --stdin` 复测 HEAD 同样是这 5 条）；`npm run build` 退出 0；prettier 只 `--write` 了 3 个查看器 tsx，两个 messages JSON 继续不做整文件重排，`git diff --numstat` 各 56 增 0 删；`PLAN.md` 与 `PROGRESS.md` 在 HEAD 上就不是 prettier 干净（表格会被整体重排），同样不 `--write`

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 408 到 412，45.2%；`components/view_logs` 71 个里接入 54 个，剩 17 个里 4 个是 `TraceView` 的无文案文件，其余为 `GuardrailViewer/` 5 个与根目录的 `columns.tsx` / `AuditLogsTableColumns.tsx` / `logs_utils.tsx` / `log_filter_logic.tsx` / `RequestLogsPanel.tsx` / `ToolsSection/JsonToolView.tsx` / `LogDetailsDrawer/` 的 2 个消息块。键数 6416 到 6464，中英同值 85 到 86

## 2026-10-14 第 27 簇更新

批次 24 第 27 簇：`components/view_logs/TraceView/TracingSetupCard.tsx` 接入 `logs`，新增 `logs.traceSetup.*` 51 键，两个消息目录各 +53 行（组的开合括号 2 行、`traceList` 末键补逗号 1 行），纯增不删。`TraceView` 目录的展示文案到此清零，24 个非测试 `.tsx` 里 20 个接入 `next-intl`，另外 4 个（`ActiveDot` / `Collapse` / `SpanIcon` / `AgentTracesPage`）本就没有文案

改造形态：

- `otlpEndpoints(proxyUrl)` 按首参翻译器约定改成 `otlpEndpoints(t, proxyUrl)`，返回类型不变；`setupTitle(enabled, connected)` 同样补首参 `t`。两者都是文件内私有，`otlpEndpoints` 虽是 `export`，测试没有直接调用它
- `SEND_LABEL` 从 `Record<kind, string>` 改成 `Record<Exclude<SendState["kind"], "ready">, SendLabelKey>`，值为键名联合类型，渲染处 `t(SEND_LABEL[state.kind])`。`idle` 与 `failed` 共用 `traceSetup.sendTest`
- 标题里的两枚品牌 logo 是本簇唯一的富文本：`traceSetup.stepCodingAgent` 用 `t.rich` 加 `<claude></claude>` / `<codex></codex>` 成对标签，处理器各返回一个 `<img>`。实测 `t.rich` 不替换自闭合标签（`<claude />` 原样输出），只认成对写法
- `messagesParity.test.ts` 的 `RICH_TAGS` 白名单同步加 `claude`、`codex`。这条守卫允许 `t.rich` 的消息保留真标签，不加就会被"尖括号必须属于富文本标签"那条拦下
- 复用已有键不新开：`drawer.copy`（`CodeBlock` 的 `aria-label="Copy"`）、`drawer.copyLabel`（`EndpointValue` 的 `aria-label={`Copy ${value}`}`，值走 `{label}` 占位）
- 长段落整段收进消息值：`enableOnProxyBody` / `tracingKeyBody` / `noTracesYet` / `codingAgentBody` 等，英文值与原 JSX 逐字一致，换行折回来的空格差异因此不存在；`exampleRun` 与 `exampleRunNote` 拆两键，JSX 用 `{" "}` 保留两个 `<span>` 之间那个空格

不译与一处取舍：

- 代码与环境变量都不译：`FRAMEWORKS` 的 `label` / `packages` / `quickstart`、`tracingEnvSnippet`、`codingAgentPrompt`（这是要贴给 Claude Code / Codex 的英文任务描述）、`codingAgentCommand`、`PROXY_CONFIG_SNIPPET`、`TRACING_KEY_REQUEST`（`key_alias: "Agent tracing"` 会落进虚拟密钥列表，属数据值）、`FileLabel` 的 `config.yaml` / `npm` / `Shell` / `my_agent.py`、`LineTabs` 的 `["Claude Code", "Codex"]` / `["pip", "uv"]`、端点值 `OTEL_EXPORTER_OTLP_ENDPOINT` 与 `Authorization: Bearer <LiteLLM virtual key>`、`OTLP/HTTP, protobuf or JSON (gRPC not supported)`、`DOCS_URL`
- 端点值的 `<LiteLLM virtual key>` 带尖括号但不进目录，所以不用 ICU 转义，这是它留在 `.tsx` 里的一个附带好处
- `stepCodingAgent` 的英文原文里 `or` 与第二枚 logo 之间没有空格（JSX 换行接 `<img>`），消息值同样写成 `or<codex></codex>`，中英文各自保留自己语言需要的空格

测试同步：`TracingSetupCard.test.tsx` 改 32 行断言、共 33 处替换（标题、状态行、按钮名、`OpenTelemetry（OTEL）接收端点` 与 `你的智能体框架` 的先后顺序、`复制 http://proxy.test/v1/traces` 这条 aria、`无法发送测试调用链。`、`/调用链仍不可用/`），`AgentTracesSection.test.tsx` 改 17 处对 setup 卡的断言（`未启用调用链`、`检查配置`、`正在检查…`、`启用调用链`、`ClickHouse 与代理配置`、`请联系你的代理管理员`、`连接你的智能体`、`等待你的第一条调用链`、`检查调用链`、`/调用链仍不可用/`）。两个文件的 `detail` 入参 `"Agent tracing is not enabled"`、`store: clickhouse` 与"setup snippets"那个 describe 块都是纯函数断言，输入输出全在英文代码串层面，照旧不动。用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView src/lib/i18n` 0 错误（9 条 warning：`TracingSetupCard` 的 6 条 `<img>` 与 `messagesParity` 的 3 条既有行）；`npm run build` 退出 0；prettier 只 `--write` 了 `TracingSetupCard.tsx`（HEAD 上干净），两个 messages JSON 继续不做整文件重排，`git diff --numstat` 各 53 增 0 删

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 407 到 408，44.7%；`components/view_logs` 71 个里接入 50 个；`TraceView` 24 个里接入 20 个。键数 6365 到 6416，中英同值 85 不变

## 2026-10-14 第 26 簇更新

批次 24 第 26 簇：`components/view_logs/TraceView/` 剩的两个列表侧文件 `AgentTracesSection.tsx`、`RunDrawer.tsx` 接入 `logs`，新增 `logs.traceList.*` 9 键与 `logs.drawer.*` 5 键，两个消息目录各 +16 行、组末键补逗号 2 行，纯增不删

改造形态：

- `TraceHistoryError` 的 `useTranslations("logs")` 放在 `if (!history.error) return null;` 之前，hook 早于早退
- `RunsFooter` 里 `{count} {count === 1 ? "run" : "runs"}` 的手工单复数改回复用第 25 簇的 `traceList.runCount`（ICU `plural`），行为逐字不变
- 缩放 chip 的 `{A} to {B} ×` 走 `traceList.rangeTo`，`" ×"` 收进模板串末尾。若写成 `{t(...)}{" "}\n×`，JSX 折行会把两个字符拆成两个子节点、可读性更差
- `RunDrawer` 的 `HeaderButton` 是私有子组件，`label` 继续按字符串 props 传（同时喂 `aria-label` 和 `title`），文案在父组件里用 `t` 生成；`ResizeHandle` 自己调一次 hook
- `drawer.*` 与第 18、19 簇的 `LogDetailsDrawer` 同组，本簇的 5 个键都是"抽屉"面：`resizePanel` / `traceDetails` / `closeEsc` / `nextTrace` / `prevTrace`

不译与两处取舍：

- `RunDrawer` 头部的 `{index + 1} / {runs.length}` 是纯数字加分隔符的位置计数器，两种语言渲染一致，不接消息
- 缩放 chip 的 `"MMM DD, HH:mm"` 与 `{count} / {total}` 的 `×` 字形留在代码里，前者属第 23 簇起的日期格式欠账
- `TracingSetupCard.tsx` 留第 27 簇，本簇不动它的英文断言；`AgentTracesSection.test.tsx` 里 `RunView` 的测试替身输出 `run ${traceId}`，是被 mock 的详情侧文案，不属本簇断言面

测试同步：`AgentTracesSection.test.tsx` 改 12 处（`更新失败`、`正在更新…`、`已收到调用链。选择一个运行记录查看详情。`、`无法检查更早的调用链。History unavailable`、`重试调用链检查`、`调用链详情` 4 处、`下一个调用链（J）` / `上一个调用链（K）`、`${runs.length} 次运行`）；`RunDrawer.test.tsx` 改 3 处 `调用链详情`。两个文件用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView` 0 错误（7 条 warning 全在既有行）；`npm run build` 退出 0；prettier 改动的 4 个 tsx 全干净，两个 messages JSON 继续不做整文件重排

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 405 到 407，44.6%；`components/view_logs` 71 个里接入 49 个；`TraceView` 24 个里接入 19 个。键数 6351 到 6365，中英同值 85 不变

## 2026-10-14 第 25 簇更新

批次 24 第 25 簇：`components/view_logs/TraceView/` 的列表侧 6 个文件首次接入 `logs`——`AgentTracesTable.tsx`、`RunsToolbar.tsx`、`TimeRangeControls.tsx`、`TracesTimeline.tsx`、`StatusMark.tsx`、`TracePreview.tsx`，新增 `logs.traceList.*` 29 键与 `logs.timeRange.last6Hours` / `.last30Days` 2 键，两个消息目录各 +35 行、纯增不删

改造形态：

- `formatSpan` 与 `rangeLabel` 按首参翻译器约定改成 `formatSpan(t, ms)` / `rangeLabel(t, range)`，`LogsTranslator` 从 `lib/i18n/translators` 引入。两者的调用点都在组件里，直接传 `useTranslations("logs")` 的结果；`SelectionBracket`、`BucketTooltip` 是私有组件，各自调一次 hook
- 时长单位从模板拼接改成五条完整消息：`spanMinutes` / `spanHours` / `spanHoursMinutes` / `spanDays` / `spanDaysHours`。`"6h 12m"` 与 `"6 小时 12 分钟"` 的空格差异因此收进消息值，代码里不再写 `` `${h}h ${m}m` ``。这是第 24 簇 `trace.tokSuffix` 的同一口径
- `STATUS_ITEMS` 的 `label` → `labelKey` 配局部联合类型 `StatusLabelKey`，`RANGE_PRESETS` 同理配 `RangeLabelKey`。`RANGE_PRESETS` 原本是 `as const`，改成显式类型数组后导出面不变（只有本文件用）
- 复用已有键不新开：`columns.time` / `drawer.input` / `trace.factDuration` / `logs.cost`（四个表头）、`logs.success`（`StatusMark` 两处 aria）、`logs.allStatuses`（状态下拉的 `All status`，目录值本就是 `All Statuses`）、`logs.filterByStatus`（筛选 aria，目录值 `Filter by Status`）、`timeRange.lastHour` / `.last24Hours` / `.last7Days`（预设标签，目录值首字母大写）
- 单复数走 ICU `plural`：`traceList.runCount`、`traceList.errorCount` 英文写 `{count, plural, one {# run} other {# runs}}`，中文直接 `{count} 次运行` / `{count} 个错误`，沿用 `logs.realtime.turnCount` 的既有写法

不译与三处取舍：

- `Agents` / `Steps` / `Failed` 三个表头与 `trace.statSteps`（`steps`）、`trace.statFailed`（`failed`）、`trace.groupAgent`（`Agent`）、`filters.options.agent`（`Agent`）英文同词，但中文取值和语境都不同（列头 vs 详情侧统计 vs Span 类型），按第 24 簇的判定各开新键
- 时间格式串照旧不动：`RANGE_LABEL_FORMAT = "MMM D, h:mm A"`、`EDGE_FORMAT = "MMM DD, HH:mm"`、`"HH:mm"`，与第 23 簇的 moment 格式、第 24 簇的 `absoluteTime` 是同一笔欠账
- 本簇只收列表侧。`AgentTracesSection.tsx`（`Update failed` / `Updating…` / `{count} runs` / `Retry trace check`）与 `RunDrawer.tsx`（`Trace details` / `Close (Esc)` / `Next trace (J)`）留第 26 簇，`TracingSetupCard.tsx` 留第 27 簇。`TracePreview` 只被 `TracingSetupCard.tsx:741` 用，但它是列表侧口径的独立文件，本簇收；其测试只断言 `data-testid`，没有文案耦合
- `TracePreview` 的 `preview.name` / `preview.input_preview` 取自 `previewTrace.json` 示例数据，属数据值不译

测试同步：`TracesTimeline.test.ts` 加 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "logs" })`，`formatSpan` 5 条断言改中文（`45 分钟`、`6 小时 12 分钟`、`1 天`、`152 天 23 小时`、`0 分钟`）。`AgentTracesSection.test.tsx` 改 23 处：`无法加载运行记录：`（含那条正则）、`没有符合这些筛选条件的运行记录。` 4 处、`成本` / `智能体` 表头、`搜索运行记录`、`按智能体筛选` / `全部智能体`、`时间范围` 3 处、`重置缩放`、`实时`、`最近 7 天` / `最近 1 小时`、`总计 1 天` / `总计 7 天`、区间分隔正则 `/ to /` 改 `/ 至 /`、`getByLabelText("2 个错误")`。两个文件用例数不增不减

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs/TraceView` 0 错误（7 条 warning 全在既有行：`TraceDrawer` 的 `complexity` 23、`TracingSetupCard` 的 6 条 `<img>`）；`npm run build` 退出 0。prettier：8 个 tsx/ts 的折行已 `--write` 收掉；两个 messages JSON 被 `--write` 顺手折叠了 `chat.suggestions` 等 3 处与本簇无关的数组，已按 HEAD 原文重写、只保留本簇的插入，最终 diff 为 68 增 2 改

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 399 到 405，44.4%；`components/view_logs` 71 个里接入 47 个；`TraceView` 24 个里接入 17 个。键数 6320 到 6351，中英同值 85 不变

## 2026-10-14 第 24 簇更新

批次 24 第 24 簇：`components/view_logs/TraceView/` 的 run 详情侧 11 个文件首次接入 `logs`——`TraceDrawer.tsx`、`DetailPane.tsx`、`DetailContent.tsx`、`SpanTree.tsx`、`SpanHoverCard.tsx`、`MessageCard.tsx`、`RequestDetail.tsx`、`AttributesDetail.tsx`、`KeyValueRows.tsx`、`IdChip.tsx`、`CopyButton.tsx`，新增 `logs.trace.*` 108 键，两个消息目录各 +110 行（含 `trace` 组的开合括号）、纯增不删

改造形态：

- `agentHandoffText` 是纯函数，按首参翻译器约定改成 `agentHandoffText(t, traceId, spanId?, traceRef?)`，`LogsTranslator` 从 `lib/i18n/translators` 引入。两个调用点（`DetailPane` 的 span 页脚与分组页脚）和 `CopyForAgent` 都在组件里，直接传 `useTranslations("logs")` 的结果
- `CopyButton.tsx` 的 `label` / `copiedLabel` 由必填改可选，缺省在组件内部取 `trace.copy` / `trace.copied`。默认值不能在参数默认表达式里引用 `t`，所以两个值在函数体里用 `??` 解析
- 四张英文表换成键表加局部键联合类型：`ROLE_LABEL` → `ROLE_LABEL_KEYS`、`TYPE_LABEL` → `TYPE_LABEL_KEYS`、`ERROR_SOURCE_LABEL` → `ERROR_SOURCE_KEYS`、`TABS` 的 `label` → `labelKey`。`roleLabel(t, role)` 查不到键继续回落原值，未知角色不至于显示空白
- `DetailPane.tsx` 的 `TABS.map((t) => ...)` 参数改名 `tabItem`，否则遮蔽同文件新加的翻译器变量
- 复用已有键不新开：`drawer.copyTraceId`（原 `Copy trace ID`，英文目录值归一为 `Copy trace id`）、`drawer.input` / `drawer.output`（`Section` 的两个标题）、`logs.tokens` / `logs.cost` / `logs.success`

不译与一处取舍：

- 术语：`trace` 译调用链，`span` 保留 `Span` 原词（`span_id`、`Span 详情`、`{count} 个 Span`），`agent` 译智能体，`framework span` 译框架 Span。协议字段名（`trace_id`、`parent_span_id`、`request_id`、`gen_ai.*`）、`"—"` 缺值哨兵、`IdChip` 的 `ID` 字形、错误来源缺省值 `LiteLLM` 都是数据值，留在原处
- 语言相关的空格收进消息值：`trace.tokSuffix`（`" tok"` / `" 令牌"`）与五条键盘提示 `trace.kbdStep` / `.kbdTrace` / `.kbdMove` / `.kbdFold` / `.kbdClose`（`" step"` / `" 切换步骤"`），JSX 里 `<Kbd>` 与文字之间不再写 `{" "}`。这是第 23 簇 `tokenLabel` 的同一口径，英文逐字渲染不变
- 本簇只收 run 详情侧。列表侧（`AgentTracesPage` / `AgentTracesSection` / `AgentTracesTable`、`RunDrawer`、`RunsToolbar`、`TimeRangeControls`、`TracePreview`、`TracesTimeline`）与 `StatusMark.tsx` 留第 25 簇，`TracingSetupCard.tsx` 留第 26 簇。`StatusMark` 的 aria 被 `AgentTracesSection.test.tsx:240` 断言，和 `ActiveDot` / `TracePreview` 一样属于列表侧那一簇的测试耦合面，本簇不动，避免一次改两个目录的测试
- `SpanHoverCard` 的 `absoluteTime` 用 `new Intl.DateTimeFormat("en-US", ...)`，和第 23 簇的时间戳同一口径，等 `shared/table_cells` 那簇一起解决

测试同步：`TraceDrawer.test.tsx` 断言改中文 8 处（`时长 40.20s`、`步数 N`、`失败 N`、`按时间排序的 Span`、`返回运行列表`、`返回调用链列表`、`复制给智能体`、`命令已复制`），纯函数那两行给 `agentHandoffText` 补 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "logs" })`。`DetailPane.integration.test.tsx` 改 34 处：tab 与 region 名、`工具 · ValueError`、`分组详情` 的 `调用次数12` / `失败次数12`、`复制此步骤`、`展开 note` / `折叠 note`、hover 卡的 `时间` / `标签` / `开始` / `结束`。`MessageCard.test.tsx` 7 处断言改中文，并把裸 `render` 换成 `renderWithProviders`（该文件此前不套 Provider，接了 `useTranslations` 就必须在 Provider 下渲染）。三文件用例数不增不减，`Section` 用例照旧传 `title="Output"` 原值断言，因为那是 props 不是文案

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（9 条 warning 全在既有行：`TraceDrawer` 的 `complexity` 23、`TracingSetupCard` 的 6 条 `<img>`，两个 JSON 报"无匹配配置"属预期）；`npm run build` 退出 0；prettier 改动 14 个 tsx 在 HEAD 上全干净，本簇折行已 `--write` 收掉，两个 messages JSON 继续不做整文件重排。`lens` 目录顺带复跑：56 通过 1 失败，失败是 `LensSetup.integration.test.tsx` 找不到 `/2026-09-30/`，即本文件"批次 24"表里记的那条非 i18n 既有失败，与 `TraceView` 无关

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 388 到 399，43.7%；`components/view_logs` 71 个里接入 41 个；`TraceView` 24 个里接入 11 个。键数 6212 到 6320，中英同值 83 到 85（新增的 `trace.roleAssistant` 取 `AI`、`trace.typeLlm` 取 `LLM`）

技术债：`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是 `tsc` 增量构建产物，一直在库里，每次类型检查或 `npm run build` 都会脏一次、逼着提交前 `git checkout --`。本簇起加进 `.gitignore` 并 `git rm --cached` 脱离跟踪

## 2026-10-14 第 23 簇更新

批次 24 第 23 簇：`view_logs` 的审计日志族四个文件首次接入 `logs`——`AuditLogsPanel.tsx`、`AuditLogsTable.tsx`、`AuditLogsTableColumns.tsx`、`AuditLogDrawer/AuditLogDrawer.tsx`，新增 `logs.auditLogs.*` 45 键与 `logs.filters.placeholders.*` 3 键，两个消息目录各 +48 行、仍是纯增

改造形态：

- `getAuditLogsTableColumns` 的依赖对象加上 `t: LogsTranslator`，`AuditLogsTable.tsx` 的 `useMemo` 依赖跟着变成 `[onViewLog, t]`。列定义工厂里不调 `useTranslations`，这是 PLAN 定的写法（不复制 `ModelsTableColumns.tsx` 曾有过的 `react-hooks/rules-of-hooks` 豁免）
- `AUDIT_TABLE_NAME_DISPLAY` 换成 `AUDIT_TABLE_NAME_KEYS`（导出的键表，抽屉也在用）配 `auditTableNameLabel(t, name)`，`auditActionLabel` 改成首参翻译器并新增 `ACTION_LABEL_KEYS`。两者查不到键就渲染原值，动作那条继续保留原来"下划线换空格 + 首字母大写"的派生逻辑，后端新加动作时不至于显示空白
- 抽屉头部的 `StatusBadge` 原先直接渲染 `log.action` 原值（`updated`），与表内角标的 `Updated` 两套写法；本簇让它走同一个 `auditActionLabel(t, ...)`，两处语言一致
- 面板标题复用 `logs.tabs.auditLogs`，筛选标签复用 `logs.filters.teamId` / `.keyHash` / `.placeholders.enterKeyHash`，没有为同义文案另开键。新增的 `enterObjectId` / `enterUserId` / `enterTeamId` 挂进 `filters.placeholders` 组而不是审计组，请求日志筛选器后面能用
- 筛选抽屉标题沿用 `VirtualKeysTable`、`TeamsTable` 的写法：调用方传 `title={t("auditLogs.filters")}` / `description=`，不去改共享 `DataTableFilterDrawer` 的 `title = "Filters"` 默认值——那会一次动到七个调用点和它们的测试

不译与一处取舍：

- 时间戳。抽屉用 `moment.utc(...).format("MMM D, YYYY HH:mm:ss")`，表里的 `DateCell` 用 `shared/table_cells/date_cell.tsx` 的英文月份表，两处同源。单独把抽屉改成中文日期会和表内不一致，格式串留在原处，等汉化 `shared/table_cells` 那一簇一起解决
- `log.action`、`table_name`、`created` / `LiteLLM_VerificationToken` 这些后端原值是查表键和查询参数，一律不译；`LiteLLM_SomethingElse` 这类未映射值走原值回落，测试专门留着一条
- `ui/sheet.tsx` 的 `Close`、`ResizableSheetContent` 的 `Expand drawer` / `Collapse drawer` 属于 `ui/` 层，本簇不动，测试里 `/close/i`、`/expand drawer/i` 两处正则照旧命中
- `tokenLabel` / `spendLabel` / `maxBudgetLabel` 三个键把"冒号 + 空格"整段收进消息值：英文 `"Spend: "`、中文 `"花费："`，JSX 里 `</span>` 与值之间不再写 `{" "}`。这是第 20 簇 `routing.gapUnit` 前导空格的同一口径。渲染验证用一次性探针跑了两遍 `renderWithProviders(..., { locale: "en" })` / `"zh-CN"`，确认英文逐字仍是 `Spend: $1.000000`、中文是 `花费：$1.000000`，探针文件随即删除

测试同步：`AuditLogDrawer.test.tsx` 15 处裸 `render` 全换 `renderWithProviders`（含 prettier 折行后两处多行调用），断言改中文 12 处——`Details`→详情、`Table`→数据表、`Teams`→团队、`API Key (Hash)`→API 密钥（哈希）、`Before`/`After`→变更前/变更后、`N/A`→无、`Copy JSON`→复制 JSON、`No differing fields detected`→未检测到有差异的字段、角标 `updated`→已更新。`AuditLogsTable.test.tsx` 改 10 处，`AuditLogsPanel.test.tsx` 的 `TEXT_FILTERS` / `SELECT_FILTERS` 两张表驱动数据改 6 处。`Default Proxy Admin` 仍是英文——`common_components/DefaultProxyAdminTag.tsx` 没汉化

验证：审计族 3 文件 37 例全绿；`view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（10 条 warning 全在既有行：抽屉的 4 条 `Record<string, any>`、测试的 2 条 `no-node-access`、面板的 4 条长条件链/内联对象/`<img>`）；`npm run build` 退出 0。prettier：四个 tsx 在 HEAD 上都是干净的，本簇引入的折行已 `--write` 收掉；两个 messages JSON 在 HEAD 上就不干净，继续不做整文件重排

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 385 到 388，42.5%；`components/view_logs` 71 个里接入 30 个；抽屉目录 19 个里接入 17 个。审计族四个文件都在抽屉之外，`AuditLogsTableColumns.tsx` 因为只接 `t` 不调 hook，仍被 grep 口径的扫描脚本算作"未接入"。键数 6167 到 6212，中英同值 83 不变

顺带记一处漏网：`LogDetailsDrawer/LogDetailContent.tsx` 第 691 行附近的 `Request` / `Response` 两个 `TabsTrigger` 和 `label="Copy JSON"` 还是硬编码英文，是第 18、19 簇收抽屉时的遗漏，留给抽屉收口簇

## 2026-10-14 第 22 簇更新

批次 24 第 22 簇：`components/view_logs/ToolsSection/`（工具清单区，5 个非测试 `.tsx`）接入 `logs`，其中 4 个有展示文案（`ToolsSection.tsx`、`ToolItem.tsx`、`ToolExpandedContent.tsx`、`FormattedToolView.tsx`），新增 `logs.tools.*` 10 键，两个消息目录各 +10 行、纯增不删

改造形态：

- 四个组件都在自己内部 `useTranslations("logs")`。`ToolsSection` 与 `ToolItem`、`ToolExpandedContent` 的 hook 必须排在 `if (tools.length === 0) return null` 这类提前返回之前，`ToolsSection` 尤其注意，它是先算 `tools` 再返回的写法
- 摘要行 `2 provided, 1 called` 收进 `tools.summary`（`{provided}` / `{called}` 两个具名占位符），中文"提供 {provided} 个，调用 {called} 个"，不再拼字符串。`missingKeys` 与 `messagesParity` 的占位符契约要求两侧顶层参数名一致，所以中文没有改成"调用数 / 提供数"之类的别的名字
- 表头 `Type` 复用 `logs.columns.type`，头部 `Tools` 不复用 `logs.realtime.configRows.tools`——后者是实时会话配置行的标签，跨区复用会把两个语义不同的位置绑在一起

一处刻意的意译：`Parameters`（区块标签）与 `Parameter`（表头）在中文里本来同为"参数"，两者同树渲染会破坏 `getByText` 唯一性。表头那一列渲染的是参数名加必填星号，所以中文定作"参数名"（键 `tools.parameterName`），英文逐字保持 `Parameter`。这是第 20 簇"英文不同、中文同值"那条坑的预防性处理，不是同义键重复

不译的部分：`tool.name`、`tool.description`、`schema.type || "any"`、`schema.description || "-"`、tabs 的 `value="formatted"` / `value="json"`（是状态值不是文案）、`JsonToolView` 里重建请求体用的 `type: "function"` 与 `function` 字段名，全是 OpenAI 协议数据值。`tools.json` 的值 `JSON` 中英同值，同值键 82 到 83

测试同步：`ToolsSection.test.tsx` 7 例，5 处裸 `render` 换 `renderWithProviders`（`../../../../tests/test-utils`，与抽屉目录同深度）。中文断言 6 处：`工具`、`提供 2 个，调用 1 个`、`已调用` / `未调用`、`描述`。`isShown` 用的是 `queryAllByText` 精确匹配，`已调用` 与 `未调用` 互不包含，不像英文 `called` 那样需要防 `not called` 的子串问题；`/alpha, beta/` 与 `/1\. get_weather/` 是喂进去的工具名数据，不动

验证：`ToolsSection` + `src/lib/i18n` 5 文件 35 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿（与第 21 簇同数，用例不增不减）；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条、改动文件 0 条；`npx eslint` 改动文件 0 错误（2 条 warning 为既有 `no-explicit-any` 与 `no-node-access`）；`npm run build` 退出 0；`prettier --check` 对改动 `.tsx` 全绿，两个消息文件仍失败——用 `git show HEAD:./<path>` 落到仓库内临时目录复测确认基线同样失败（是别处的数组折行问题），本簇不夹带整体重排。全量分片未跑

覆盖率复测：两侧叶子键 6157 到 6167；非测试 `.tsx` 912 个不变，已接入 381 到 385，42.2%；`components/view_logs` 71 个里接入 23 到 27 个，目录里剩余带展示文案的集中在 `GuardrailViewer/`、`TraceView/`、`AuditLogDrawer/` 三个子目录与 `RequestLogsPanel.tsx`、`EvalViewer.tsx`、`CostBreakdownViewer.tsx`、`VectorStoreViewer.tsx` 几个根文件

## 2026-10-14 第 21 簇更新

批次 24 第 21 簇：`LogDetailsDrawer/RealtimePrettyView.tsx`（OpenAI Realtime API 的会话视图，494 行）接入 `logs`，新增 `logs.realtime.*` 16 键（8 个展示句 + `configRows` 8 个标签），两个消息目录各 +20 行、纯增不删。抽屉目录最后一个有硬编码英文的文件收掉，`LogDetailsDrawer/` 至此只剩 `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 两个第 19 簇确认过"没有可展示文案"的文件

改造形态：

- 组件本体、`SessionCard`、`ResponseTurn` 三处各自 `useTranslations("logs")`，都在条件返回之前，沿用第 18 簇抽屉内部组件直接挂 hook 的做法，不走 props
- 七行 `ConfigRow` 的标签收进 `realtime.configRows.*`，头部那个 `Session` 复用第 18 簇已有的 `drawer.session`，没有为同一个词开第二个键
- `TokenBreakdown` 原来收 `label="Input"` 再在组件内拼 `` `${label} Token Breakdown` ``。中英是"定语 + 中心词"与"中心词在后"两种顺序（`输入令牌明细`），拼串在中文里不成立，改成调用点传整句 `title={t("realtime.inputTokenBreakdown")}`，prop 一并改名
- `turnCount` 走 ICU 复数 `{count, plural, one {# turn} other {# turns}}`，中文退化成 `{count} 轮`；替掉原来的 `{turnCount} {turnCount === 1 ? "turn" : "turns"}` 手拼

不译的部分：`session.model`、`session.voice`、`modalities` 的 `audio` / `text`、`turn_detection.type`、`response.status`、`output.role`（协议角色，与第 19 簇记的 `label="ASSISTANT"` 同源）都是后端读回来的数据值；`formatTokenLabel` 派生出的 `Cache Creation` / `Cache Read` 是上游 token detail 的字段名，加了一条注释说明为什么保留原拼写。中英同值键仍为 82，本簇没有新增同值键

测试同步：本文件 27 例，中文断言 9 处（`会话`、`2 轮` / `1 轮`、`输入 116 / 输出 46 令牌`、`温度`、`指令`、`输入音频格式`、`未发现可识别的实时事件`）。跨目录又抓到一处：`PrettyMessagesView.test.tsx:64` 的 `getByText("Session")` 是被本簇组件渲染出去的，改成 `会话`——第 14 簇记的"只跑本目录会漏掉跨目录断言"第三次应验，判断范围要顺着渲染树走到 `PrettyMessagesView` 那一层

验证：`RealtimePrettyView` 单文件 27 例、`PrettyMessagesView` 11 例、`messagesParity` 8 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条、改动文件 0 条；`npx eslint` 改动文件 0 错误（15 条 warning 全是该文件既有的 `no-explicit-any` 与 `no-long-condition-chain`，不在本簇新增行上）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：两侧叶子键 6141 到 6157；非测试 `.tsx` 912 个不变，已接入 380 到 381，41.8%；`components/view_logs` 71 个里接入 23 个；抽屉目录 19 个里接入 17 个，展示文案清零


## 2026-10-14 第 20 簇更新

批次 24 第 20 簇：`LogDetailsDrawer/RoutingDecisionCard.tsx`（自动路由决策卡，368 行）接入 `logs`，新增 `logs.routing.*` 75 键，按 `routerTypes` / `bands` / `rows` / `sections` / `causes` / `planMode` / `housekeeping` / `escalation` 分组，两个消息目录各 +93 行、仍是纯增

改造形态：

- 六个纯函数（`describeScoreAgainstBoundaries`、`describePlanModeFloor`、`describeHousekeeping`、`describeReasoningOverride`、`describeCause`、`describeEscalation`）一律改成首参翻译器 `t: LogsTranslator`，沿用第 14 簇起的约定；`Row`、`PercentageRow`、`CapabilityForecast`、`FuseV2Forecast` 与卡片本体自己在组件里 `useTranslations("logs")`，hook 必须写在 `if (!decision || !decision.cause) return null` 之前
- `ROUTER_TYPE_LABELS` 与 `CONSTANT_CAUSE_LABELS` 两张英文值表换成 `ROUTER_TYPE_LABEL_KEYS` / `CONSTANT_CAUSE_LABEL_KEYS` 两张键表，配 `RoutingRouterTypeKey`、`RoutingCauseKey` 两个联合类型（照第 16 簇 `LogsErrorCodeKey` 的写法）。后端的 `router_type`、`cause` 原值是查表用的键、本身不显示；查不到就渲染原值，连原值都没有才落 `routing.causes.unknown`

不译的部分：档位 id（`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING` 以及运营者改名的 `SECURITY_REVIEW` 之类）、`signals`、`request_type`、`classifier_model`、校准版本、`matched_keyword` 哨兵、`exit_plan_mode` 工具名，全是运营者在路由配置里读写的数据值；`Auto-Router v2` 与 `FUSE v2` 是产品名/缩写，中英同值，同值键 80 到 82。`routing.gapUnit` 是"数值 + 单位"而不是整句，所以继续拼接：英文逐字保留前导空格 `" percentage points"`，中文用"个百分点"

ICU 里的一处取舍：`reasoningOverride` 的 `{floor}` 既可能是数字，也可能是"简单档与中等档的分界"这段中文，照英文那样在占位符前留空格会渲染出"得分不低于 简单档…"。中文键去掉这个空格，英文键逐字不动

测试同步：本文件 46 例，裸 `render` 全部换 `renderWithProviders`（`vi.mock("lucide-react")` 只替掉 `Waypoints`，provider 树不受影响）。英文原文那句"排除任意档位区间"的负断言 `/below|to 0|at or above/` 不能逐词换成中文——中文档位区间写"低于"，而覆盖说明"得分不低于……"里含同样的两个字，会自己命中自己；改成按形状判断的 `bandShape = /^\((?:低于|达到或超过|[\d.]+ 到)/`，注释里写明了原因。跨目录又抓到一处：`add_model/JevConnectionTest.integration.test.tsx` 的 `findByText("JEV classifier")` 改 `JEV 分类器`，第 14 簇记的"只跑本目录会漏掉跨目录断言"再次应验；同文件 152 行的 `JEV classifier unavailable` 是后端 `detail` 原文，不动。顺手用 prettier 收了该文件里第 20 簇之前就存在的一处三元折行

验证：`RoutingDecisionCard` 单文件 46 例全绿；`view_logs` + `add_model` + `src/lib/i18n` 共 94 文件 1672 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（卡片函数 `complexity 23` 的 warning 在 HEAD 上就是 23，不是本簇新增）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 379 到 380，41.7%；`components/view_logs` 71 个里接入 22 个；抽屉目录 19 个里接入 16 个，还有硬编码英文的只剩 `RealtimePrettyView.tsx`（494 行）；键数 6066 到 6141

## 2026-10-14 第 19 簇更新

批次 24 第 19 簇：抽屉的卡片层。`InputCard.tsx`、`OutputCard.tsx`、`SimpleToolCallBlock.tsx`、`ClassifierAuditView.tsx` 四个文件首次接入 `logs`，新增 `logs.cards.*` 4 键与 `logs.classifierAudit.*` 8 键，两个目录文件各 +16 行、纯增不删

处理决定：

- `toast.success("Input copied")` / `("Output copied")` 收进 `cards.inputCopied` / `.outputCopied`，`OutputCard` 的空占位收进 `cards.noResponseData`。这三处是渲染出去的文案，没有哨兵问题
- `SimpleToolCallBlock` 的 `function` 角标译成"函数"；同一文件里 `role: "function"`、`type: "function"` 这类 OpenAI 协议枚举是数据值，一律保持英文，测试里 `getByText("function")` 只有角标那一处改中文
- `ClassifierAuditView` 的三块 `Card` 用 `aria-label={title}` 暴露成 `region`，标题走 `classifierAudit.*Title`，`LogDetailContent.integration.test.tsx` 里 `getByRole("region", { name })` 的三条断言跟着换成中文名。复制按钮复用第 18 簇的 `drawer.copyLabel`（`复制 {label}`），没有为 `Copy ${title}` 新开重复键；`AuditField` 是个内部组件，自己 `useTranslations("logs")`
- `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 翻过一遍没有可展示文案（角色标签由调用方传 `label="ASSISTANT"` 这类协议角色名，原样渲染），本簇不动，抽屉目录里它们仍归在"未接入"计数中

测试同步：`ClassifierAuditView.test.tsx`、`SimpleToolCallBlock.test.tsx`、`SimpleMessageBlock.test.tsx` 的裸 `render` 换 `renderWithProviders`——前两者因为组件接了 hook，第三者没有 hook 但它渲染 `SimpleToolCallBlock`，整树必须有 provider。断言改动共 12 处：`暂无响应数据`（`OutputCard` 2 + `PrettyMessagesView` 4）、`函数`、三个 region 名、`未留档，或消息日志已关闭`、截断 `status` 的文本、复制按钮可访问名 `复制 分类器输入`；`classification rubric` / `source-only` / `a greeting` 是喂进去的测试数据，不动。顺手把第 15 簇遗留的 `LogDetailContent.integration.test.tsx` 三处超长 `renderWithProviders(...)` 按 prettier 折行，该文件此前 `format:check` 不过

验证：抽屉目录 19 文件 232 例全绿；`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（10 条 `testing-library/no-node-access` 与 `no-large-inline-object-arg` warning 都在既有行）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 375 到 379（本簇 +4），41.6%。抽屉目录 19 个非测试 `.tsx` 接入 15 个，真正还有硬编码英文的只剩 `RealtimePrettyView.tsx`（494 行）与 `RoutingDecisionCard.tsx`（368 行）

## 2026-10-14 第 18 簇更新

批次 24 第 18 簇：`LogDetailsDrawer/` 的抽屉外壳与 9 个叶子组件接入 `logs` 命名空间——`LogDetailsDrawer.tsx`、`DrawerHeader.tsx`、`SectionHeader.tsx`、`SidebarToggle.tsx`、`ClassifyTag.tsx`、`CollapsibleMessage.tsx`、`HistoryTree.tsx`、`JsonViewer.tsx`、`TruncatedValue.tsx`、`TokenFlow.tsx`，新增 `logs.drawer.*` 32 键。这些组件全都在抽屉树内部渲染、已经在 `NextIntlClientProvider` 之下，一律直接 `useTranslations("logs")`，不用走 props

几个处理决定：

- 侧栏的会话构成复用第 17 簇的 `logs.cells.sessionSummaryLlm` / `.sessionSummaryAgent` / `.sessionSummaryMcp`。原来是 `[" LLM", " Agent", " MCP"][i]` 这种"数字 + 英文后缀"的拼串，现在三类计数收进 `sessionSummaryCounts` 常量表，渲染走 `{count}` 插值，中英都不再拼字符串
- `CopyableId` 的可访问名做成整句插值 `drawer.copyLabel`（`复制 {label}`），`label` 传 `t("columns.requestId")`。同一行里可见的 `x-litellm-call-id:` 是 HTTP 头名，原样保留不译
- `environment = metadata?.user_api_key_team_alias || "default"` 与 `metadata.status === "failure"` 一样是拿来和后端值比对的哨兵/数据默认值，保持英文，只有渲染出去的 `Env: {environment}` 徽标和状态 label 中文化
- `drawer.history` 用 ICU 复数（`{count, plural, one {# message} other {# messages}}`，中文统一"历史（{count} 条消息）"），替掉原来的 `message{messages.length !== 1 ? "s" : ""}` 手拼；目录里已有 `overrideCount` 这种复数键，写法不新

测试同步：抽屉叶子组件从此刻起需要 i18n 上下文，13 个测试文件的裸 `render` 换成 `renderWithProviders`（`InputCard` / `OutputCard` / `RealtimePrettyView` 是第 19 簇的文件，但它们渲染 `SectionHeader`，本簇被间接带进来，一并换掉），断言改中文约 40 处：`Classify`→分类、`(5 chars)`→（5 字符）、`No data`→暂无数据、`HISTORY (3 messages)`→历史（3 条消息）、`Tokens:`/`Cost: $`/`Turns:`→令牌：/成本：$/轮次：、`Copy output`→复制输出、`Expand trace sidebar`→展开调用链侧栏、`Copy Request ID`→复制 请求 ID、`Start time`/`Duration`→开始时间/耗时。`SectionHeader` 那条 `{ name: /copy/i }` 改成具体的 `复制输入`——正则 `copy` 在中文下永不命中，而按钮本来就有确定的可访问名

验证：`src/components/view_logs` + `src/lib/i18n` + `tests/i18n` 52 文件 671 例全绿（用例数不增不减，只换渲染方式与断言文案）；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint src/components/view_logs` 0 错误、warning 数不变；`npm run build` 退出 0。这次跑了一次全量：886 文件 11576 例，57 例失败分布在 18 个文件，**没有一个在 `view_logs`**；比"批次 24"那张 17 文件的旧表多出的 `add_auto_router_tab.integration` / `edit_auto_router_modal.integration` / `user_agent_activity` 三个文件单跑全绿（160 例 + 7 例），属并发时序假红，与本次改动无关。`tests/e2e/ui/tests/logs/logs.spec.ts:236` 的 `getByLabel("Expand trace sidebar")` 不用动——英文目录值逐字未改，英文 locale 下的 e2e 照旧命中

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 365 到 375（本簇 +10），覆盖率 41.1%。`view_logs/LogDetailsDrawer/` 19 个非测试 `.tsx` 里接入 11 个，此前只有 `LogDetailContent.tsx`

目录规模复测：两侧叶子键各 6054（本簇 +34，含第 17 簇未记的 2 条 `columns`/`cells` 补数口径差），中英文取值完全相同的键 78 到 80——第 17 簇的 `logs.cells.sessionSummaryLlm` 与 `.sessionSummaryMcp` 中英同值（`{count} LLM` / `{count} MCP`，缩写不译），当时漏记，本次一并计入

## 2026-10-14 第 17 簇更新

批次 24 第 17 簇：`view_logs/RequestLogsTableColumns.tsx` 的 16 个列头与 11 条单元格文案接入 `logs` 命名空间，新增 `logs.columns.*` 8 键与 `logs.cells.*` 11 键，另外 8 个列头复用已有键（`logs.status` / `logs.model` / `logs.cost` / `logs.tokens` / `logs.filters.sessionId` / `.keyHash` / `.keyAlias` / `.endUser`），英文值与列头原文逐字相同，不新开重复键。`RequestIdWithCallIdTooltip` 是个组件，直接用 `useTranslations("logs")`；列工厂 `getRequestLogsTableColumns` 走依赖对象，照 `getAvailableTeamsTableColumns` 的写法把 `t: LogsTranslator` 加进 `RequestLogsTableColumnsDeps`，调用点 `RequestLogsTable.tsx` 传已有的 `t`

带参数的文案一律做成整句插值，不做中英拼接：`{successful}/{total} succeeded`、`{failed} of {total} batch requests failed`、`incl. {spend} from {count} MCP`、会话构成 tooltip 的 `{count} LLM` / `{count} Agent` / `{count} MCP` / `{count} cache hit`（中文里 `LLM` 与 `MCP` 是缩写不动，`Agent` 与 `cache hit` 译作"智能体""次缓存命中"）。`status` 单元格里的 `|| "Success"` 是用来和后端值比对的哨兵，不是展示文案，保持英文；只有渲染出去的 label 改成 `t("success")` / `t("failure")`

测试同步：`RequestLogsTableColumns.test.tsx` 顶部按 `logs_utils.test.tsx` 的做法建 `createTranslator({ locale: "zh-CN", namespace: "logs" })` 塞进 `noopDeps`，两个测试内联的 `deps` 改成展开 `noopDeps`；`session total` / `batch cost` / `Success` / `Failure` / `2/3 succeeded` / `1 of 3 batch requests failed` / 复制按钮的可访问名共 14 处断言改中文，`2 LLM • 1 MCP` 中英同值不动。`index.test.tsx`、`index.integration.test.tsx`、`log_filter_logic.test.tsx` 里的 `Internal User` 是角色名不是列头，没动

验证：`src/components/view_logs` + `src/lib/i18n` 52 文件 671 例全绿；`tsc --noEmit -p .` 仍 883 条、非测试文件 0 条；`npx eslint` 改动文件 0 错误（`<img>` 与两处 `no-large-inline-object-arg` warning 是既有行，本簇没有新增 warning）；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 364 到 365（本簇 +1，`RequestLogsTableColumns.tsx` 首次接入），覆盖率 40.0%

## 2026-10-14 第 16 簇更新

批次 24 第 16 簇：`view_logs/constants.ts` 的 `ERROR_CODE_OPTIONS` 从 `{ label, value }` 改成 `{ labelKey, value }`，类型收成 `LogsErrorCodeKey` 联合，新增 `logs.filters.errorCodes.code400` 到 `code529` 共 11 键。中文值保留 `429 - ` 这样的数字前缀，只翻译后半个词，这样 `ErrorCodeFilterField` 里按 `option.label.toLowerCase()` 做子串过滤的逻辑一行都不用改——用户输 `429` 在两种语言下都能命中

`RequestLogsFilters.tsx` 的 `ErrorCodeFilterField` 先用 `useMemo` 把键表铺成 `SearchSelectOption`（`localizedOptions`），过滤、已知码判断与 `selected` 回显都改读这张表；自定义码分支（`filters.useCustomCode`）本来就是中文，不变。本簇没有新增接入 `next-intl` 的文件

验证：`src/components/view_logs` 49 文件 655 例全绿（`RequestLogsFilters.test.tsx` 39 例，两条选项名断言改 `429 - 触发限流`，`ERROR_CODE_OPTIONS.length` 那条照旧成立），i18n 三条守卫 16 例通过；`tsc --noEmit -p .` 仍 883 条、全在测试文件，非测试 0 条；`npx eslint` 改动文件 0 错误；`npm run build` 退出 0。全量分片未跑。覆盖率 912 / 364（39.9%）不变

## 2026-10-14 第 15 簇更新

批次 24 第 15 簇：`TypeBadges.tsx` 四个徽标改用 `useTranslations("logs")` 读第 13 簇的 `logs.filters.options.llm` / `.agent` / `.mcp` / `.batch`，没有新增键。`RequestLogsTable.tsx` 的 `formatFilterValue` 改成首参翻译器（照 `BudgetTable.tsx` 的写法），`LogDetailContent.tsx` 的凭据行同批接上 `filters.options.clientOAuthToken` / `.configuredKey`。`constants.ts` 里两张英文表 `SPAN_TYPE_LABELS` 与 `CREDENTIAL_LABELS` 删除，换成 `SPAN_TYPE_LABEL_KEYS` 与 `CREDENTIAL_LABEL_KEYS` 两个键表（`Readonly<Record<string, 键联合类型>>`），全仓无残留引用

徽标接了 hook，`TypeBadges.test.tsx`、`RequestLogsTableColumns.test.tsx` 的裸 `render` 换成 `renderWithProviders`，`LogDetailContent.integration.test.tsx` 50 处同换；`Agent` / `Batch` 与凭据两条断言改中文（`LLM` 与 `MCP` 是缩写，中英同值，断言不动）

验证：`src/components/view_logs` 49 文件 655 例全绿，i18n 守卫 16 例通过；`tsc --noEmit -p .` 仍 883 条、全在测试文件（其中 `LogDetailContent.integration.test.tsx` 321/322 两条 `TS2769` 是既有行，不是本簇引入），非测试文件 0 条；`npx eslint` 改动文件 0 错误；`npm run build` 退出 0。全量分片未跑

覆盖率复测：非测试 `.tsx` 912 个不变，已接入 361 到 364（本簇 +3），覆盖率 39.9%。`components/view_logs` 71 个非测试 `.tsx` 里接入 7 个

## 2026-10-14 第 14 簇更新

批次 24 第 14 簇：`src/components/view_logs/LogsTableToolbar.tsx` 加同文件的 `LiveTailBanner` 接入 `logs` 命名空间，新增 `logs.toolbar.*` 7 键与 `logs.timeRange.*` 7 键

时间区间标签有两个来源：`constants.ts` 的 `QUICK_SELECT_OPTIONS`（下拉里的 6 项）与 `logs_utils.tsx` 的 `getTimeRangeDisplay`（触发按钮上的当前区间）。两边 5 条同文，只有 1 分钟那条英文本来就分叉（`Last Minute` 与 `Last 1 Minute`），按"英语原文逐字不动"各留一键（`timeRange.lastMinute` 与 `timeRange.lastOneMinute`），中文都写"最近 1 分钟"。两处共用同一组键，下拉与按钮不会说出两种话

`QUICK_SELECT_OPTIONS` 的 `label` 换成 `labelKey`，类型收成 `LogsTimeRangeKey` 联合，标签在组件内用 `useMemo` 配 `t` 生成，与第 13 簇的四张筛选标签表同一写法。`getTimeRangeDisplay` 是纯函数，改成首参翻译器约定（`LogsTranslator`，`translators.ts` 新增），全仓只有一个调用点

测试同步：`logs_utils.test.tsx` 用 `createTranslator({ locale: "zh-CN", namespace: "logs" })` 断言中文返回值，沿用 `GuardrailsMonitor/usageUnits.test.ts` 的做法；`RequestLogsPanel.test.tsx` 8 处按钮与开关的可访问名改中文。日期区间串（`MMM D - MMM D`）是格式化结果不是文案，两条断言不动

验证：`src/components/view_logs` 49 个文件 655 例全绿，i18n 三条守卫 16 例通过；`npx tsc --noEmit -p .` 883 条错误，非测试文件 0 条，本簇文件 0 条；`npx eslint` 对改动文件 0 错误（`RequestLogsPanel.test.tsx` 6 条 warning 是既有行号，与本簇无关）；`npm run build` 退出 0。全量分片未跑

顺带更正一条：`CREDENTIAL_LABELS` 的消费方不止 `LogDetailContent.tsx`，`RequestLogsTable.tsx:44` 也在用。它要等第 15 簇（`SPAN_TYPE_LABELS` 与它在同一个文件里消费）才能删，第 13 簇那节的说法过时了

## 2026-10-14 更新

批次 24 第 13 簇：`src/components/view_logs/RequestLogsFilters.tsx`（请求日志筛选面板的 14 个筛选字段）接入 `logs` 命名空间，新增 41 个 `logs.filters.*` 键，同时复用已有的 `logs.status`、`logs.model`、`logs.allStatuses`、`logs.success`、`logs.failure`。没有借其他命名空间的同名键，`ARCHITECTURE.md` 记着跨命名空间借键是历史 bug 族

四个模块作用域的标签表（`STATUS_FILTER_ITEMS`、`CACHE_FILTER_ITEMS`、`CREDENTIAL_FILTER_ITEMS`、`SPAN_TYPE_FILTER_ITEMS`）改成组件内的 `useMemo`，依赖数组带 `t`，与 `VirtualKeysTable.tsx` 的既有写法一致。`CREDENTIAL_FILTER_ITEMS` 原本从 `constants.ts` 的 `CREDENTIAL_LABELS` 展开，现在直接写 `"true"` / `"false"` 两个字面量值。（本节当时记"`CREDENTIAL_LABELS` 只剩 `LogDetailContent.tsx` 一个消费方"不准，`RequestLogsTable.tsx` 也在用，见上一节的更正）

翻译边界：Span Type 的四个取值按散文翻（`Agent` 智能体、`Batch` 批处理），`LLM` 与 `MCP` 是缩写、两侧同值。这与第 12 簇"连通性测试对话框的前缀标签按标识符保留"不冲突，那条是紧邻模型名的诊断输出，这条是筛选下拉里给人点的选项。同一批词在 `TypeBadges.tsx` 与 `SPAN_TYPE_LABELS` 里必须沿用同一套键，否则筛选下拉写"智能体"而表格徽标写"Agent"

测试同步：`RequestLogsFilters.test.tsx` 39 例的标签、占位符与选项断言改中文。顺带清掉了"批次 24"那张 16 文件失败表里的 `view_logs/index.test.tsx`（第 75 行还停在 `Request Logs`，同文件上面几行早已中文化），该文件 14 例全绿

e2e 侧有 8 处按 placeholder 文本或 combobox 可访问名寻址这些筛选器，分布在 3 个 spec，已同步中文：`logs.spec.ts` 1 处、`logsFilters.spec.ts` 5 处、`logsPagination.spec.ts` 2 处。这 8 处**没有跑过**，Playwright 需要活代理与真实数据，本机只做了字符串替换

验证：i18n 三条守卫 16 例通过；`RequestLogsFilters.test.tsx` 加 `src/lib/i18n/` 共 55 例通过；view_logs 相邻 6 个文件 149 例通过，合计 204 例全绿。`npx tsc --noEmit -p .` 883 条错误、58 个文件，非测试文件 0 条，本簇文件 0 条。`npx eslint` 对改动的 `.tsx` 无输出。`npm run build` 退出 0。没有跑全量分片，54 例基线失败里只有 `view_logs/index.test.tsx` 这 1 例被清，其余 53 例本簇未触碰

### 复测的三个数字

覆盖率命令（在 `ui/litellm-dashboard` 下执行）

```
find src -name "*.tsx" -not -name "*.test.tsx" | wc -l
grep -rl "useTranslations(\|getTranslations(" --include="*.tsx" src | grep -v "\.test\.tsx" | wc -l
```

2026-10-14 第 15 簇后实测：非测试 `.tsx` 共 912 个，已接入 364 个，覆盖率 39.9%。同日第 14 簇后是 912 / 361（39.6%）、第 13 簇后 912 / 360（39.5%），此前记的 861 / 305 复现不出来，那条没写命令，两个数都对不上今天这个口径，所以并列记录，不要拿 39.9% 减 35.4% 当进度

目录规模同步复测：命名空间 39 个不变，两侧叶子键各 5992（第 13 簇后是 5978，本簇加 14 键；10-13 记的 5228 是第 5 到 12 簇补键之前的数），中英文取值完全相同的键 78 个，第 13 簇贡献 `logs.filters.options.llm` 与 `.mcp` 两个，本簇的 `timeRange.lastMinute` 与 `.lastOneMinute` 中文同值但英文不同，不计入

启发式扫描的非测试源文件基数也变了：`.tsx` 加 `.ts` 共 1302 个（10-13 记 1232），差的是上游 v1.105.0 同步带进来的文件

## 2026-10-13 更新

- **已合并至 `main`**：同步上游 v1.105.0 的 UI 交集文件，包含中文汉化完成的代码
- **修复构建阻断**：`ModelsTableColumns.tsx` 的 `"use client"` 指令移至文件顶部（Next.js App Router 要求），修复 Docker 构建编译错误
- **测试状态**：下面这条是 `507e347` 附近的旧快照（11308 个用例，11307 通过，1 失败）；批次 24 收口后实测为 11576 用例、11513 通过、54 失败，失败清单与归类见"批次 24：add_model 与 edit_auto_router"一节。唯一的非 i18n 既有失败仍是 `mcp_server_edit.test.tsx` 的 OAuth 恢复用例——该定性已在 2026-10-15 推翻，它是测试中文文案写错，`f3b21f32` 修掉，见"## 技术债"
- **类型检查**：非测试文件 0 错误，`npm run build` 绿色
- **i18n 守卫**：三条全部通过（16 个用例）
- **Lint**：36 个预存错误（全部为代码库原有，非新增）

### 批次 24：add_model 与 edit_auto_router

本轮把 `src/components/add_model` 与 `src/components/edit_auto_router` 接入 next-intl，按簇提交（`bed5b6c6`、`fc057e2f`、`63c381eb` 等）。覆盖面：路由测试与连接测试对话框、`RouterConfigBuilder` 的路线树、`add_auto_router_tab` 新建表单（预设选择器、名称/团队/访问组、三个操作按钮、提交前连通性测试）、层级显示名与层级配置面板、以及 `build_complexity_router_config` 的整套校验错误族

校验错误族统一改成首参翻译器约定（`getTierLabelsError(t, ...)`、`getMissingTiersError(t, ...)`、`getSemanticConfigError(t, {...})` 等），`TierRestriction.reason` 改成 `reasonKey`，`getSubmitBlockedReason` 与 `handleAddAutoRouterSubmit` 因 `max-params: 4` 上限改成对象入参。`build_complexity_router_config` 的去重基线刻意保留英文规范名（`TIER_DESCRIPTIONS[tier].label`），只把渲染面翻成中文

收口复扫时补掉五处残留硬编码（`63c381eb`）：`serializeRouterConfig` 的无模型路由 throw（新增 `routerRouteModelRequired`）、`edit_auto_router_modal` 第二处保存成功 toast（漏改的 `editModalSaved`）、`auto_router_connection_test` 的 `Jev connection` aria-label（`connJevStatusLabel`）、`cache_control_settings` 角色下拉的 `None`（`cacheControlNone`）、`handle_add_model_submit` 两处解析错误 throw（改用 `failedParseExtraParams`）

非测试源文件里还剩两处未接入，都不产生可见英文：`TierRowSelect.tsx` 是纯展示组件，文案全部由 props 传入；`add_model_modes.tsx` 的 `AUTO_ROUTER_MODES` 全仓无引用，是死代码。连通性测试结果对话框里每条目标的前缀标签（`SIMPLE`、`Default`、`Embedding`、`Classifier`）仍是原始标识符，与紧邻的模型名 `gpt-4o-mini` 一样属于诊断面，本轮按标识符保留

验证：目录级 45 文件 1174 用例全绿，i18n 守卫 16 例通过，非测试文件 tsc 0 错误，eslint 0 错误（新增的 `local/no-large-inline-object-arg` 已通过提取具名变量消除），`npm run build` 退出 0

批次 24 收口后又跑了一次四片全量（串行，`--shard=k/4`）：11576 用例，11513 通过，54 失败，分布在 17 个文件。逐文件单跑后只有 1 个文件是本批造成的，其余与本批无关。本批的那一个是 `models-and-endpoints/panels/AddModelPanel.integration.test.tsx`：第 1 簇把 `advanced_settings.tsx` 的标签翻成中文后，该文件里 6 处断言仍停在 `LiteLLM Params` 与 `Please enter at least one model.`。已在该文件把 6 处 `getByLabelText("LiteLLM Params")` 改成 `LiteLLM 参数`、`Please enter at least one model.` 改成 `请至少选择一个模型。`，17 例全绿

其余 16 个文件不是本批的账，单跑均稳定失败，逐条如下（错误信息取单跑首条）：

| 文件 | 首条错误 | 归类 |
| ---- | -------- | ---- |
| `guardrails/_components/add_guardrail_form.decision_model.integration.test.tsx` | 找不到标签 `Guardrail Name` | 第六类，guardrails 批次遗留 |
| `guardrails/_components/guardrail_info.test.tsx` | `Guardrail stale-id not found` | 非 i18n，取值/mock 问题 |
| `guardrails/_components/guardrail_garden_detail.test.tsx` | 找不到行 `Provider Decision Model` | 第六类 |
| `agents/_components/AgentsTable.test.tsx` | 找不到列头 `Spend (USD)` | 第六类 |
| `agents/_components/add_agent_form.integration.test.tsx` | 找不到标签 `Agent Name` | 第六类 |
| `agents/_components/agent_info.integration.test.tsx` | 找不到标签 `Agent Name` | 第六类 |
| `agents/_components/agent_info.test.tsx` | 找不到按钮 `Edit Settings` | 第六类 |
| `access-groups/.../AccessGroupEditModal.integration.test.tsx` | 找不到 tab `/MCP Servers/` | 第六类 |
| `access-groups/.../AccessGroupCreateDialog.test.tsx` | 找不到标签 `Group Name` | 第六类 |
| `model_add/CredentialModal.test.tsx` | `useTranslations` 上下文缺失 | 第一类，测试缺 `NextIntlClientProvider` |
| `view_logs/index.test.tsx` | 找不到 tab `Request Logs` | 第六类，2026-10-14 第 13 簇已修 |
| `organizations/_components/OrganizationsTable.test.tsx` | 找不到文本 `创建时间` | 需复查：断言已中文化但组件未渲染中文表头，或渲染路径不同 |
| `shared/DataTable/DataTable.test.tsx` | `render is not defined` | 非 i18n，测试缺 import |
| `mcp-servers/_components/mcp_server_edit.test.tsx` | 取值失败 | 非 i18n，既有技术债（见 `FIXES.md`） |
| `UsagePage/components/KeyActivityPanel.integration.test.tsx` | 重试行为 | 非 i18n，疑似时序 |
| `lens/_components/LensSetup.integration.test.tsx` | 找不到日期 `/2026-09-30/` | 非 i18n，日期/数据 |

这些失败此前被各批次各自的"只跑本目录"验证漏掉，且 `PROGRESS.md` 顶部"1 失败"的旧快照是更早提交上的数字，已经过时。修一批就跨目录复跑一次全量，或至少把改动文件的下游消费方一起跑，才能及时抓到这一类

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                       | 数值                                                 |
| ------------------------ | ---------------------------------------------------- |
| 命名空间                 | 40（此前记 39 是数错，`en.json` 顶层键实际一直是 40 个）|
| `en.json` 叶子键          | 6748（2026-10-15 第 38 簇；6738 是第 37 簇后，6719 是第 36 簇后，6685 是第 35 簇后，6675 是第 34 簇后，6646 是第 33 簇后，6632 是第 32 簇后，6584 是第 31 簇后，6574 是第 30 簇后，6535 是第 29 簇后，6464 是第 28 簇后，6416 是第 27 簇后，6365 是第 26 簇后）|
| `zh-CN.json` 叶子键       | 6748                                                 |
| 键树一致性               | 一致，`messagesParity` 通过                           |
| 中英文取值完全相同的键    | 86（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）      |

中英文取值相同的那 86 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%（2026-10-13，未记录命令）。2026-10-14 用"## 复测的三个数字"里的命令重测为 912 / 360，覆盖率 39.5%，第 14 簇后为 912 / 361，覆盖率 39.6%，第 18 簇后 912 / 375（41.1%），第 19 簇后 912 / 379（41.6%），第 20 簇后 912 / 380（41.7%），第 23 簇后 912 / 388（42.5%），第 24 簇后 912 / 399（43.7%），第 25 簇后 912 / 405（44.4%），第 26 簇后 912 / 407（44.6%），第 27 簇后 912 / 408（44.7%），第 28 簇后 912 / 412（45.2%），第 29 簇后 912 / 416（45.6%），第 30 簇后 912 / 417（45.7%），第 31 簇后 912 / 418（45.8%），第 32 簇后 912 / 418（45.8%，本簇文件此前已接入，比率不变），第 33 簇后 912 / 420（46.1%），第 34 簇后 912 / 421（46.2%），第 35 簇后 912 / 422（46.3%），第 36 簇后 912 / 423（46.4%），第 37 簇后 912 / 424（46.5%），第 38 簇后 912 / 425（46.6%）；分母与分子的口径都对不上旧那条，两组数字并列，只看趋势

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

2026-10-12 下午又清掉失败最集中的四个路由共 229 例：projects（`8218f0c`，82）、prompts（`c9fa5a1`，56）、agents（`c4ed112`，55）、cost-tracking（`eb8394d`，36），四个路由复跑分别 161 / 117 / 128 / 206 例全绿。全量口径未重跑，下表 450 的分布仍是 507e347 的旧快照

晚场继续按目录级实测清零：playground（`f6d6210`，27，复跑 275 例）、usage（`178b97b`，27，223 例）、budgets（`cfae555`，20，48 例）、caching（`7ae597a`，18，108 例）、非路由 view_logs 与 add_pass_through（`17077de`，27）、六条小头路由 users / router-settings / tag-management / memory / skills / change-password（`25303e9`，46，复跑 302 例），合计 165 例

随后用 `--shard=k/4` 串行复核全量（这台机器单进程全跑超 10 分钟执行窗，产物会被截断，详见 [FIXES.md](./FIXES.md) 的收口一节）。分片又抓出 27 例不在快照里的第六类/同类断言停更（`ebf1fca` 8、`edeb082` 1、`041b668` 17、SSO 骨架 1 随本次提交，内容为共享分页脚、日志集成标题、创建密钥弹窗可访问名、请求头组件、批量邀请按钮等）与 6 例 auto_router 两套件的时序假红（`4550833`，把提交按钮可用性的等待预算从默认 1s 提到 5s 后 64 + 90 例全绿）。另 `f061fee` 回退了 playground 批次里越界跑 `eslint . --prune-suppressions` 对共享基线文件的改动

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

其他类里有两条不属于 i18n。`mcp_server_edit.test.tsx` 的 `preserves a stored client_id on OAuth-resume restore even when the saved snapshot is token-only` 报 `expected '' to be 'stored-client'`，当时判为取值失败而不是文案断言，已列为既有失败（2026-10-15 复查：是测试中文占位符正则写错，`f3b21f32` 修掉）。`tests/fetch-location-rule.test.ts` 报 `STACK_TRACE_ERROR`，这条守卫自 `610473c` 起就没动过，是上游带过来的

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

`src/components/shared/LanguageSwitcher.test.tsx` 曾有 2 个失败，属于设计冲突而非缺陷：`renderWithProviders` 强制 `locale="zh-CN"`，而这两个用例假设默认是英文，并且想验证"切换后变中文"这条链路。强制 locale 会把 `localStorage` 驱动的那条链路短路掉。已给 helper 加 `locale: null` 出口解决，见 [ARCHITECTURE.md](./ARCHITECTURE.md) 的"测试侧的两个入口"

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

## 汉化完成度实测（2026-10-13）

**测试全绿不等于汉化完成**，两者衡量的是不同东西。测试只说明"已有的断言与当前实现一致"，而没被翻译的组件通常也没有中文断言，它们既不红也不绿，只是没被任何断言覆盖。所以 99.99% 的通过率不能当作汉化收尾的证据

对 `src` 下 1232 个非测试 `.tsx` / `.ts` 做了一次启发式扫描：找未接入 `next-intl`、且含 JSX 文本节点或 `placeholder` / `aria-label` / `title` / `label` / `alt` 英文字面量的文件

| 项                                 | 数量 |
| ---------------------------------- | ---- |
| 非测试源文件                       | 1232 |
| 已接入 `next-intl`                 | 309  |
| 含用户可见英文且未接入             | 232  |
| 已接入但仍有英文字面量             | 44   |

232 个里有 230 个被其他源码 import，另 2 个是 `app/chat/page.tsx` 与 `app/mcp/oauth/callback/page.tsx` 这类路由入口（Next 直接挂载，不需要被 import），所以**全部是活代码**，不是死文件。抽查确认不是误报：`components/activity_metrics.tsx` 里直接写 `<p className="text-sm text-muted-foreground">Total Requests</p>`

按目录看，前几名是 `components/add_model`（43 文件 / 171 处）、`components/Settings`（27 / 89）、`components/view_logs`（22 / 42）、`components/chat`（10 / 39）、`components/AIHub`（9 / 36）

`components/add_model` 这一行在 2026-10-14 已经过时：批次 24 第 1 到 12 簇把这 43 个文件基本扫完了，实测该目录 56 个非测试 `.tsx` 里 52 个已接入，剩下 4 个不产生可见英文（见"批次 24：add_model 与 edit_auto_router"一节）。同一命令下 `components/view_logs` 是 71 个非测试 `.tsx` 接入 2 个，是现在最密的目标。命令与口径见"## 2026-10-14 更新"

这正是 [PLAN.md](./PLAN.md) 里批次 24 的账。需要区分的是：[FIXES.md](./FIXES.md) 记的"批次 24 硬编码英文欠账清单"只是 2026-10-12 修 Provider 与 team 批次时顺手记下的 10 条已知欠账，那份清单清空不等于批次 24 完成

扫描是启发式的，会漏掉模板字符串里拼接的文案、常量表里的标签、以及非 JSX 位置渲染的字符串，也会把少量技术标识误判成文案。所以 232 是量级估计，不是可直接施工的精确清单；真要收口，得逐文件读一遍

## 下一步优先级

`components/view_logs` 是眼下最密的目录（71 个非测试 `.tsx`，第 20 簇后按 `useTranslations(`/`getTranslations(` 的 grep 口径接入 22 个，另有 `logs_utils.tsx` 走首参翻译器、grep 抓不到）。第 16 簇把 `ERROR_CODE_OPTIONS` 收进目录，搜索改成"先铺成中文标签再子串匹配"，靠中文值保留 `429 - ` 数字前缀让两种语言都能命中；第 17 簇把请求日志表的列头与单元格文案收干净，表头这一层已经没有硬编码英文；第 18 簇收了抽屉外壳与侧栏、抽屉头部和 9 个叶子组件；第 19 簇收了抽屉卡片层的 `InputCard.tsx`、`OutputCard.tsx`、`SimpleToolCallBlock.tsx`、`ClassifierAuditView.tsx`；第 20 簇收了抽屉的 `RoutingDecisionCard.tsx` 路由决策卡；第 21 簇收了抽屉的 `RealtimePrettyView.tsx` 实时会话视图，抽屉目录的展示文案到此清零，只剩 `PrettyMessagesView.tsx` 与 `SimpleMessageBlock.tsx` 两个没有可展示文件计在"未接入"里；第 22 簇收了 `ToolsSection/` 的四个有文案的文件（`JsonToolView.tsx` 只渲染 JSON 数据，不算文案）；第 23 簇收了审计日志族——`AuditLogsPanel.tsx`、`AuditLogsTable.tsx`、`AuditLogsTableColumns.tsx` 与 `AuditLogDrawer/AuditLogDrawer.tsx`。此后 `view_logs` 的余量按大小排是 `TraceView/` 子目录（23 个非测试 `.tsx`）、`RequestLogsTable.tsx` 与 `RequestLogsPanel.tsx` 的空态和筛选文案、`GuardrailViewer/` 一族（`BedrockGuardrailDetails`、`CompliancePanel`、`ContentFilterDetails`、`PresidioDetectedEntities`、`GuardrailViewer`）、`EvalViewer` / `CostBreakdownViewer` / `VectorStoreViewer` / `ConfigInfoMessage` 四个根文件，外加 `columns.tsx`、`log_filter_logic.tsx` 这类没有展示文案、只是扫描口径算作未接入的文件

这一行到 2026-10-15 已整体过时：第 13 到 32 簇把 `view_logs` 逐目录推到文案清零，清扫簇又逐个读完度量脚本仍列为"未接入"的 9 个文件（`PrettyMessagesView`、`SimpleMessageBlock`、`JsonToolView`、`columns.tsx`、`SpanIcon`、`Collapse`、`AgentTracesPage`、`ActiveDot`、`AuditLogsTableColumns`），要么没有面向用户的文案，要么从 props 收 `LogsTranslator`。**`components/view_logs` 到此没有剩余账**，脚本的"71 接入 60"要按"接入 71"读

原来的四个优先级里，第一（223 条缺 Provider）、第二（team 172 例）、第三（页面收口）都已完成。此前按失败集中度排出的 1-6 号目标也全部清零：`edit_auto_router_modal.integration` 的 46 例经单文件复跑确认是全量并发造成的假失败（独立运行为 0），其余按 6d06b7b、e2350f6、c109bdb、0e8f5f6 四次提交逐个转绿。中途顺带清掉了未列进表的 `AdminPanel`（19）、`EntityUsage`（18）、`add_attachment_form`（17）、`BulkEditUsers`（16）、`leftnav` 之外的 `user_edit_view` / `user_info_view.integration` / `old-usage`

第 7 项已清零。guardrails 族起点 150 例，`d0c3436` 收掉 content_filter 子族的 68 例，本次提交收掉其余 22 个文件的 82 例（起点：`guardrail_info.characterization` 14、`add_guardrail_form.characterization` 11、`GuardrailsOverview` 11、`CustomCodeModal` 9、`GuardrailUsageBreakdown` 7、`TeamGuardrailsTab.integration` 7，加 6/5/4/3 的长尾），`src/app/(dashboard)/guardrails` 目录复跑 272 例全绿。policies 族（14 个文件 112 例）已在 bdac478 清零。清的时候仍按"回 HEAD 基线确认既有失败"区分翻译账和非翻译账，并且先单文件复跑，别信全量报告里的集中失败

几处踩过的坑，写在这里省得再查：

- 组件里的硬编码英文哨兵值不能被翻译。`AdminPanel.tsx` 的 `all_ip_address_allowed = "All IP Addresses Allowed"` 同时用于渲染和比对后端返回的 IP 行，测试的 mock 数据必须保持英文，只有断言渲染文本的那几处才跟着 t() 走
- 共享组件里写死的英文按钮同样保持英文。`DeleteResourceModal` 的按钮固定渲染 `Cancel` / `Delete` / `Deleting...`，`policies/_components/index.test.tsx` 里这三处断言不能跟着目录里其他断言一起改
- 测试自己 mock 出来的 stub 文案与语言无关。`index.test.tsx` 把 `FlowBuilderPage` mock 成一个写着 `Back to policies` 的按钮，改中文会直接查不到元素
- 英文不同、中文同值的两个键会破坏 `getByText` 的唯一性。`flow.guardrailBadge`（GUARDRAIL）与 `flow.guardrailLabel`（Guardrail）都渲染成"护栏"，`pipeline_flow_builder.test.tsx` 那一处只能改成 `getAllByText(...).length`
- next-intl 走 ICU 语法，消息里的单引号是转义符而不是字面量。`Microsoft Entra OBO requires a scope, e.g. api://'<app-id>'/.default` 渲染出来是 `api://<app-id>/.default`（引号被吞），断言要按渲染结果写
- 英文正则断言在中文下永不命中，不能指望它跨语言。`SectionHeader.test.tsx` 的 `getByRole("button", { name: /copy/i })` 在按钮可访问名变成"复制输入"之后查不到元素，只能改成具体文案；同一行里 `x-litellm-call-id:` 这类头名、`LLM` / `MCP` 这类缩写中英同值，反而不需要动
- 纯展示叶子组件一旦接 `useTranslations`，它的测试就从"能裸 `render`"变成"必须有 provider"。第 18 簇里 `InputCard` / `OutputCard` / `RealtimePrettyView` 的测试本身没改组件，却因为渲染了 `SectionHeader` 而一起要换 `renderWithProviders`——判断范围要看渲染树，不要只看改了哪些源文件；第 19 簇的 `SimpleMessageBlock` 自己一行翻译都没有，只因为它的子节点 `SimpleToolCallBlock` 接了 hook，测试同样得整树包 provider
- ICU plural 在中文里退化成量词短语，英文整句正则要按中文语序重写。`test.testButton` 的 `Test {count} guardrails` 中文是"测试 {count} 个护栏"，`providerFields.jsonObject` 的 `{field} must be a valid JSON object` 中文把占位符留在前缀（"detect_secrets_config 必须是有效的 JSON 对象"），`eval.descNamed` 更是把 `{name}` 挪到句中（"为 {name} 配置 AI 评估"）
- 纯逻辑模块拼出来的英文展示串也在页面上，属于批次 24 的账。`components/GuardrailsMonitor/usageUnits.ts` 的 `unpricedSummary()`、`counterLabel()` 与 `counterMathRow()` 已按 `(t, ...)` 首参约定接入 `guardrailsMonitor` 命名空间，中文断言同步。`counterLabel()` 改为先查 9 个真实计数器的映射表（键取自 `bedrock/guardrails` 成本表），未知计数器才走驼峰派生兜底
- 图表图例的 `categories` 是 dataKey，不能直接传中文，否则图例说中文而 tooltip 与序列名对不上。给共享的 `bar_chart` 加了可选 `categoryLabels`，同时覆盖 `ChartConfig.label`（图例）与 `Bar name`（tooltip 名），dataKey 保持 `passed` / `blocked` 不动
- 中文目录里 `{count}` 不会千分位，`{count, number}` 才会。`unpricedSummary()` 的 `1234 units unpriced` 中文写 `{count, number} 个单位未定价`，`1,234` 才对；同理 ICU plural 组内的 `#` 自带千分位
- 组件里写死的按钮英文会伪装成翻译问题。`TeamGuardrailsTab` 的详情面板把 `Approve` / `Reject` / `Add` 写死，接上 `t("team.approve")` / `t("team.reject")` / `t("team.add")` 之后 `getAllByRole("button", { name: /批准/ })` 的计数才与英文一致，这一处随本次提交一起改掉了

到此，第六类（断言停在英文）排得出名次的目标全部清零，剩下的主力就是批次 24 的共享组件长尾。清单里的硬编码也全部收口：guardrails 相关四条（`usageUnits.ts`、`ScoreChart.tsx`、`CustomCodeModal.tsx`、`TeamGuardrailsTab.tsx`）已在 `3d617ec` 清零，最后一行 `public_model_hub` 分页脚（连同 `AIHub/ModelHubTable.tsx` 的孪生组件）已在本次提交清零，[FIXES.md](./FIXES.md) 的"批次 24 硬编码英文欠账清单"到此清空。本次提交同时把两处既有脚注断言改成中文，并给公开页补了一条 agents/MCP 脚注的中文用例

顺带修掉 `dd32399` 留在非测试文件里的 22 处类型错误，生产构建从那时起一直红着，本次恢复绿色。起点是 `cache_control_settings.tsx` 的导出常量被删后 `ModelInfoEditForm.tsx`（未翻译的长尾文件）还在 import；修掉缺导出后构建推进到下一层，又停在 `layout.tsx` 的 `Cannot find name 't'`。同一提交共留下五类错误：删掉的导出仍被引用、`t()` 调用处没有 hook（10 条）、`keyof typeof` 指向不存在的名字、重复的 interface 声明、无意义的 `data-testid` 解构。vitest 对这些全绿（Vite 把缺失导出解析成 `undefined`），tsc 会报但混在存量里没被逐条比对，只有 `npm run build` 会硬失败且一次只报第一个错。五类的例子与修法见 [FIXES.md](./FIXES.md) 的"2026-10-12 构建报错"一节

`renderWithProviders` 与 `LanguageSwitcher` 的设计冲突已解决，题面就是 `tests/test-utils.tsx` 里那条标记：helper 默认钉 `zh-CN`，而 switcher 要测的正是被钉住时短路掉的那条链路。修法是让 `locale` 选项接受 `null` 表示不钉，配合修掉 `LocaleProvider` 里 `useSyncExternalStore` 的条件调用（`react-hooks/rules-of-hooks` 的 error，此前一直红着）

### 核实后的剩余工作

507e347 快照里的失败已逐块清零：四个重路由 229 例 + 晚场六个块 165 例 + 分片复核补抓的 27 例第六类/同类 = 421 例，另有 6 例 auto_router 时序假红转为等待预算修复（`4550833`）。四片全量复核覆盖全部 858 个文件，各分片的失败项已逐一单文件复跑清零或定性，**第六类（断言停在英文）在本轮观测中归零**

剩余失败均为非第六类，口径是分片全量加单文件复跑：`LanguageSwitcher` 2 例（`renderWithProviders` 强制 zh-CN 的设计冲突，需要一个可省略 locale 的包裹层，已修）、`mcp_server_edit` 1 例（`stored client_id` 取值失败，与翻译无关）。此前记在技术债里的 `AutoRoutersPanel` 2、`AccessGroupBudgetsPanel` 2、`fetch-location-rule` 1 在本轮四片全量中均未复现

后续若开新清理轮：先按分片拿全量失败清单，逐项单文件复跑区分真假，再按失败数从多到少逐块清零；不要跑单进程全量（会撞执行窗），也别并发跑多个 vitest（互相拖慢且放大失败数）

### f4fb7c2 上的独立复核

按上面的建议在 `f4fb7c2` 上跑了一次四片全量：11307 个用例，11303 通过，4 失败（99.96%），文件覆盖 858 个。上面"第六类归零"的结论成立，另抓到一条不在清单里的漏网断言

| 失败项 | 性质 | 处置 |
| ------ | ---- | ---- |
| `DeletedKeysPage/DeletedKeysTable.test.tsx :: should show the total count in the pagination footer` | 第六类漏网。同一用例的 `pagination-range` 已改中文，紧邻的 `pagination-page` 停在 `Page 1 of 3` | 已改中文，单文件复跑 8 例全绿 |
| `mcp_server_edit.test.tsx :: preserves a stored client_id ...` | 取值失败，非 i18n | 保留，见技术债 |
| `LanguageSwitcher.test.tsx` 2 例 | 设计冲突 | 已修，helper 加 `locale: null` 出口 |

同一次复核还发现 `ProjectDetailsPage.tsx` 的项目状态徽标写死 `"Blocked" : "Active"`，而 `projects.statusBlocked` / `projects.statusActive` 两个键早就存在于两侧目录（`活跃` / `已封禁`），属于"键已存在但调用点没接"，是 `AgentsTableColumns` / `TeamGuardrailsTab` 那一类的残留。接上 `t()` 并同步两条断言后，该文件 22 例全绿

三处修完，`mcp_server_edit` 1 例是仅剩的已知失败

修复后（2026-10-13）重跑四片全量：11308 个用例，11307 通过，1 失败（99.99%）。用例数比上一轮多 1，来自 `LanguageSwitcher` 的用例由 3 个扩到 4 个（新增"跟随浏览器语言"一条）。唯一的失败就是上面那条 `mcp_server_edit`，其余全部转绿，说明 `LanguageSwitcher` 与 `LocaleProvider` 的改动没有波及依赖钉住 locale 的其余测试

## 技术债

`AutoRoutersPanel` 2 个与 `AccessGroupBudgetsPanel` 2 个失败此前记为"既有问题，与 i18n 无关"。2026-10-15 复测：两个文件单跑两次全绿，放进 `models-and-endpoints` 子树（16 个文件）也全绿，最近一次全量快照的失败清单里没有它们。口径改为并发下的时序假红，不再当作待修项挂在账上；哪天在全量里重现，按第 53 簇记的分片复跑流程重新定性

`mcp_server_edit.test.tsx` 的 "preserves a stored client_id on OAuth-resume restore" 已在 `f3b21f32` 修掉，本条从技术债转为已清。真正的病灶是测试里那条占位符正则写错了：`/留空则保留当前已保存的密钥|留空以保留当前已保存的应用/`，前半句是 client_secret 的文案、后半句把"则"错写成"以"，`findByPlaceholderText` 因此一直抓到密钥框而不是应用框，`waitFor` 超时后值停在 `''`。改成上游那一句的精确中文（`留空则保留当前已保存的应用（若有）`）后 81 例全绿。2026-10-15 第 55 簇后的全量里它也没有复现

两条**永久挂在上游名下**的失败，已从汉化账里摘出，别再重复排查（判定过程见"## 2026-10-15 第 55 簇后的全量快照"）：`cost_tracking_settings.test.tsx` 7 例在导入快照 `610473cb` 上失败用例名逐行相同；`LensSetup.integration.test.tsx:119` 断言 `/2026-09-30/`，而被断言的字符串出自 `toLocaleString(undefined, …)`，任何 locale 下都渲染成 `Sep 30, 2026, …`，且 `lens/` 目录自上游同步以来零改动

度量脚本对 `view_logs` 长期高报：它按"文件里有没有 `useTranslations`"计数，而该目录剩余 9 个文件要么没有面向用户的文案、要么从 props 收翻译器。看该目录长尾时按 0 计

所以上面那段"判定与翻译无关的依据是逻辑本身"以及 2026-10-13 的"稳定失败、排除并发竞态"结论都只说对了一半：失败确实稳定、确实与组件逻辑无关，但它恰恰是翻译账——错在测试同步的中文文案上，不在组件里。教训是"逻辑与上游逐行一致"只能排除组件，不能排除测试自己的文案断言；这类用例要先按 `findByPlaceholderText`/`getByLabelText` 的字面量与目录逐条比对，再决定往哪边修

全仓库 `tsc --noEmit` 有 904 条错误（去重后，原始输出 905 行），分布在 56 个文件（2026-10-13 实测），**全部位于 `*.test.tsx` / `*.test.ts`**，大头是 vitest 全局类型缺失的 TS2304/TS2582 与测试文件自身的类型债。此前记的 928 条里有 24 条是翻译引入的，全部在非测试文件（`dd32399` 的五个错误类，9 个文件 22 条 + `ModelInfoEditForm.tsx` 引用缺导出的 2 条），本次修完后降到 904，**非测试文件清零**，`npm run build` 恢复绿色。注意 `next.config.mjs` 设了 `useTypeScriptCli: false`，Next 16 自带的类型检查阶段不扫测试文件，所以这 904 条与绿色构建共存；哪天开了这个实验开关，测试文件债会立刻变成构建红灯。`TRANSLATION_PLAN.md` 里写的"约 819 条、56 个文件"是更早的一次测量，已过时。基线比对之后要区分"非测试文件 0 错误"与"测试文件存量债"两件事

比对基线前先确认 `ui/litellm-dashboard/next-env.d.ts` 存在（它被 gitignore，删掉后会虚增 145 条 `assets/logos` 的 TS2307），标准内容就两行 `/// <reference types="next" />` 与 `/// <reference types="next/image-types/global" />`

判断有无新增要逐条比对，不要只看总数，按文件去重会掩盖同一文件内的新增错误。`src/lib/i18n` 目录目前是零错误

`ui/litellm-dashboard/tsconfig.tsbuildinfo` 是构建产物，不应随翻译提交。2026-10-14 第 24 簇已收（`e6a72717`）：加进根 `.gitignore`（第 149 行）并 `git rm --cached` 脱离跟踪，本地文件保留，`tsc` 与 `npm run build` 不再脏工作树。2026-10-15 复核：`git ls-files` 查无此文件，本条闭环

目前所有批次直接提交到 `main`。若后续要开 PR，按仓库约定从默认分支切出 `litellm_` 前缀分支

死键（`en.json` 里有、代码没人用）没有守卫，只能人工发现

`t` 通过 props 传进来的调用点无法静态判定作用域，`missingKeys` 会跳过
