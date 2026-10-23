# 开发进度

数据快照 2026-10-23，分支 `litellm_sync_v1.107.0`（合并与收口完成后再回 `main`）。**汉化尚未完成**，剩余量见"## 汉化完成度实测"；目录规模、欠账清单与文件覆盖率随每次提交更新。覆盖率最新一次是第 421 簇后，按带括号 `useTranslations(`/`getTranslations(` 口径（非测试 `.tsx` 912 个接入 707 个、77.5%；第 294 簇起开 `.ts` 侧新账，388 个非测试 `.ts` 按对象属性英文字面量宽口径命中 19 个，多数为数据值/演示样例判定账，kill*switch、key_scope、auto_router 类型标签、chat 种子标题、savings 图例、skills 校验消息与 flow 死常量、AllModelsTable 死常量遮蔽、cost 面板查表七片、agent 表单标签消费面（第 306 簇）与 mcpServers 工具参数校验句（第 307 簇）、ToolPolicies 模板串（第 308 簇）与 model-insights 副标题/tooltip（第 309 簇）、MCPGatewaySessionsTab 断开结果与选择器（第 310 簇）、TierTurnsChart 总数标签（第 311 簇）、provider_margin_table 行操作 aria（第 312 簇）、聊天上传校验报错（第 313 簇）、`policies/index.tsx` guardrail 删除/创建 toast（第 314 簇）、`AutoRoutersPanel` 删除成功/失败 toast（第 315 簇）、`ByokCredentialModal` 连接成功 toast（第 316 簇）、`ClaudeCodePluginsPanel` 删除成功 toast（第 317 簇）、`useDeletePolicyAttachment` hook 删除成功/失败 toast（第 318 簇，首参注入 PoliciesTranslator）、`useConversation` hook 校验/取消/清空四 toast（第 319 簇，首参注入 PromptsTranslator）、`image_edits.tsx` 与 `audio_transcriptions.tsx` 两个模块级函数的成功/失败 toast 与默认回落句六键（第 320 簇，首参注入 PlaygroundTranslator）、`useBlockUnpricedConfig` 两条开关 toast、`useMultiCostEstimate` 两条估算失败回落与 `provider_margin_table` 空态一句（第 321 簇，hook 首参/props 注入 CostTrackingTranslator）、`AgentsTable` 表载消息与 `AgentFormKit`/`TagsInput` 三组件 combobox 空态默认值（第 322 簇）、`validateKillSwitchBody` 两条请求体校验与 `buildIdentityParams` 两条 Entra throw（第 323 簇，首参注入 AgentsTranslator）、七页 `DeprecationBanner` 的 featureName 字面量（第 324 簇，收进 `banners.deprecation.feature*`七键）、六个 llm_calls 模块函数的 catch toast 模板串（第 325 簇，首参注入 PlaygroundTranslator，复用目录既有`errorXxx` 键四枚、新键两枚）、`claude*code_plugins/helpers.ts`六函数的来源预览 label 与未知来源回落句（第 326 簇，首参注入 SkillsTranslator，收进`skills.sourceLabel.*`五键加`sourceUnknown`）、`networking.tsx`的`updatePassThroughEndpoint`成功 toast（第 327 簇，首参注入 PassThroughTranslator，收进`models.passThrough.updatedToast`）、`networking.tsx`的`teamUpdateCall`失败 toast 前缀（第 328 簇，首参注入 TeamsTranslator，收进`teams.updateFailedToast`）、`networking.tsx`的`keyInfoV1Call`拉取密钥信息失败 toast（第 329 簇，首参注入 VirtualKeysTranslator 走`virtualKeys.keyInfoFailed`，贯穿 `useKeyInfo` hook 首参与三调用者）、`networking.tsx`的`modelCreateCall`模型创建成功 toast（第 330 簇，首参注入 ModelsAddModelTranslator 走`models.addModel.createdToast`，两 submit handler 复用既有 t、AgentBuilderView 加第二 hook）、四表 `loadingMessage="Loading X…"`长尾（第 331 簇，组件已接入各以其命名空间 t 接`tableLoading`/`passThrough.table.loadingMessage`）、`SpendByProvider`空态`noDataMessage`（第 332 簇，接 `usage.provider.noDataMessage`）、`updateConfigFieldSetting`与`deleteConfigFieldSetting`两条通用配置 toast（第 333 簇，首参注入 CommonTranslator，收进`common.configValueUpdated`与`common.configFieldReset`，15 调用点跨 5 文件）、`VectorStoreTable`空态第二行帮助句接`vectorStores.noVectorStoresHint`（第 334 簇）、cost-optimization `TierTurnsChart`图注接既有 orphan 键`costOptimization.autoRouter.tierTurnsDesc`与`CostOptimizationView`spend-fetch 失败告警接`costOptimization.view.spendFetchFailedAlert`（第 335 簇）、usage `UsagePageView`四处网关指标文案（第 336 簇，两处复用 orphan 键`entity.spendFetchFailed`/`metrics.successfulHint`、两处新增 `gatewayRequestsByEndpoint`/`gatewayRequestsByEndpointHint`，凭证富文本那句另簇）、cost-tracking `how*it_works`两处折扣计算器说明接`costTracking.calcDiscountAppliedTo`/`calcVerifyHint`（第 337 簇）、跨四命名空间帮助说明句接 `scim.usingScimDesc`/`loggingSettingsView.subtitle`/`keyProjectField.pendingHint`/`modelInsights.sessionHint`（第 338 簇）、`HealthCheckComponent`标题/副标接`models.health.pageHeading`/`pageSubtitle`与`BudgetFallbacksEditor`非空分支重复 blurb 去重返用`budgetEditors.fallbacks.blurb`（第 339 簇）、`AllModelsTab`虚拟密钥访问指引两句被`<a>`打断的拆分句改`t.rich`接`models.accessViaKeyNoTeam`/`accessViaKeyWithTeam`（第 340 簇）、`UsagePageView`可复用凭据 tag 前缀提示改`t.rich`接`usage.reusableCredentialsHint`（第 341 簇）、`skill_detail`三条 prose 引导句接`claudeCodePlugins.enableSkillCommandIntro`/`staleCatalogHint`（带 `{name}`）/`registerMarketplaceIntro`（第 342 簇）、`skill_detail`两处内嵌元素句改`t.rich`接`claudeCodePlugins.needMarketplaceSetupHint`/`addToSettingsHint`（第 343 簇）、`impact_preview_alert`影响摘要句被`<strong>`与`{upTo}`插值打断改`t.rich`接`impact.affectedSummary`（第 344 簇）、第 345 簇据更宽 JSX 文本补扫接 `usage.exportButton`/`projectSpend` 两枚按钮与卡片标签、`topKeyView.tableView`/`chartView`两处视图切换（TopKeyView 表头视图英文测试翻面）、第 346 簇补扫接 agents 域`agent_info`「Back to Agents」与 `{agent.agent_name || "Unnamed Agent"}` 回落标签、`agent_form_fields`「Add Skill」/「Remove Skill」（新增 `agents.addSkill`/`removeSkill`/`backToAgents`/`unnamedAgent`，`add_agent_form.integration`一处`/Add Skill/`英文断言翻面）、第 347 簇补扫接`VectorStoreTester`「Clear History」(`vectorStores.clearHistory`)、`pricing_calculator`「Add Another Model」(`costTracking.addAnotherModel`)、`MCPGatewaySessionsTab`「Disconnect all」（复用既有 orphan `mcpServers.gatewaySessions.disconnectAll`，pricing/vectorStore 两文件英文测试断言翻面）、第 348 簇补扫把 `AgentIdentityFields`的「Open`<a>`Entra Enterprise applications`</a>, select this application...」整段 help 改 `t.rich`接`agentIdentity.enterpriseObjectIdHelp`（`link`包原`<a>`）、第 349 簇补扫开启「`{...}`表达式内英文回落串」子口径，接`agent_virtual_keys`「Unnamed key」(`agents.unnamedKey`)、`CodeInterpreterOutput` alt「Generated chart」(`playground.generatedChart`)、`MessageDisplay`「Assistant」回落（复用 `playground.chatMessageBubble.assistant`）三枚可见回落串）、第 350 簇续接 `ByokCredentialModal`「Service」(`byokModal.service`) 与 `prompt_editor_view`「Unnamed Tool」(`prompts.unnamedTool`) 两枚显示名回落、第 352 簇开「JSX 属性英文字面量」补扫接 `ModelsTableColumns`「IN」复用死 orphan `models.table.costIn`（同列兄弟「OUT」早已用 `table.costOut`、唯 IN 漏接硬编码）已接净；第 308 簇起开第四条「模板串」扫描口径，1289 个非测试 `.ts`/`.tsx` 命中 9 个：3 个判代码语料/上游 issue 预填面（`PromptCodeSnippets`、`editServerPayload.differential.cases`、`usageUnits.pricingIssueUrl`），4 个已在 308 到 311 簇接净，networking toast 系多调用点重构队列，按每簇贯穿一函数推进（第 327-330、333 簇已接 `updatePassThroughEndpoint`、`teamUpdateCall`、`keyInfoV1Call`（含 `useKeyInfo` hook 贯穿）、`modelCreateCall`、`updateConfigFieldSetting`/`deleteConfigFieldSetting`通用配置 toast（第 333 簇，15 调用点跨 5 文件、调用者命名空间各异且测试面含 toStrictEqual 全数组形状约 35 处，首参注入 CommonTranslator，MCPNetworkSettings 自定义 mock 的位置参数读取需同步位移）五件，六条里可干净贯穿的真 UI toast 全部接净；余`handleError`（~100 调用点、仅 1 条硬编码 UI Session Expired 句，余皆 errorData 透传）一件入判定账作专项重构，详见下一步优先级；helpers label 一处已于第 326 簇重构接净）；`guardrail_garden_data.ts` 大表管道（第 302 簇）后 decision_model 5 张（303）、litellm 22 张（304）、partner 28 张（305）三片全接，garden 显示层收口，partner 与 dm 的 name 为品牌/模型标识判保留；其余扫描命中（服务端凭据元数据、查表源值、品牌名、console 前缀、SVG path、数字/URL 占位符）均判保留入判定账；toast 字面量定向扫描在第 330 簇后收口，剩余命中全落高扇出共享件判入判定账：`dataUtils.ts`的`copyToClipboard`（34 调用点，硬编码默认 messageText "Copied to clipboard" 与失败句 "Failed to copy to clipboard"，贯穿需改全部调用点）与 networking 的 handleError 同属专项重构（config-field 两件已于第 333 簇首参注入 CommonTranslator 重构接净）；第 334 簇开第五条「JSX 文本节点」扫描口径（`>`与`<`之间的裸英文子文本，前四条口径只扫属性值与 toast 首参、从未覆盖此类），据此纠正第 332 簇「可干净贯穿的 UI 属性/文本长尾就此见底」为「属性/toast 口径耗尽、JSX 裸文本口径尚有余量」，甄别出 help/空态说明若干真实串按特性域逐簇接线中（334-361 共六十五条真串：334 VectorStoreTable、335 cost-optimization 两句、336 usage 网关四处、337 how_it_works 两句、338 跨四命名空间帮助句四条、339 HealthCheck 两句加 blurb 去重一句、340 AllModelsTab 两句 t.rich、341 usage 凭据提示 t.rich 一句、342 skill_detail 三条 prose、343 skill_detail 两处 t.rich、344 impact_preview_alert 一处 t.rich、345 补扫四枚 usage 按钮/切换标签、346 补扫四枚 agents 按钮/回落标签、347 补扫三枚散落按钮、348 一枚富文本 help、349 三枚、350 两枚`{...}`表达式回落串、353 三元`? :` 分支六枚（`chart_loader`加载态四与`ReasoningContent` 折叠两）、354 三元分支四枚（`ModelsTableColumns`tooltip 两与`leftnav` aria 两）、355 三元分支两枚（ThemeToggle 深浅模式 label）、356 PasswordInput 显隐 aria 两枚、357 两选择器占位符四枚（`guardrails`/`policies`各 disabled/enabled 两支）、358 TagsInput loading 占位一枚（复用`common.loading`、0 新键）、361 how_it_works 残四枚；复用 tierTurnsDesc/entity.spendFetchFailed/metrics.successfulHint/budgetEditors.fallbacks.blurb/gatewaySessions.disconnectAll/chatMessageBubble.assistant 六枚 orphan 键、净新增八十三键，344 将逐域枚举队列清零后 345/346 按更宽正则补扫又检出散落标签若干（且发现连「已接入」文件内部仍有裸英文与 `{...}`回落串，如 agent_info 的 Unnamed Agent），第 353 簇续开「三元`? "English" :`英文字面量分支」补扫接`chart_loader`加载态四枚与`ReasoningContent`推理折叠两枚（新增`common.chartLoadingTitle`/`chartLoadingSub`/`chartProcessingTitle`/`chartProcessingSub`/`hideReasoning`/`showReasoning`六键、两测试从裸`render`迁`renderWithProviders`并翻面，同口径余 ThemeToggle/PasswordInput/leftnav 三件待续；第 354 簇续接同口径把`ModelsTableColumns`暂停/恢复 tooltip 两枚接新增`modelTable.pauseTooltipNormal`/`resumeTooltipNormal`（与同列 318 行 aria 短式 `pauseTooltip`/`resumeTooltip` 区分）、`leftnav`侧栏折叠 aria 两枚接新增`nav.expandSidebar`/`collapseSidebar`（值与既有 `navbar.*`逐字同但本组件`useTranslations("nav")` 跨命名空间不可复用故另立）、`operations.ts`的`mode==="read"?"Read-only.":...`系喂模型的 LiteAdmin 工具描述判入判定账、余 ThemeToggle（专测缺 intl provider）与 PasswordInput（多消费者 aria）两件待续；第 355 簇接 ThemeToggle 深浅模式切换 label 接新增`common.switchToLightMode`/`switchToDarkMode`（专测 wrapper 由 `ThemeProvider`内嵌`LocaleProvider locale="zh-CN"`补上 intl provider、四处 accessible-name 断言翻面），PasswordInput show/hide aria 因 27 消费方高扇出判作阻塞片待下簇全量核；第 356 簇把 PasswordInput 显隐 aria 接`common`新增`showPassword`/`hidePassword`（一处接线覆盖 27 消费方生产渲染路径），翻 `provider*specific_fields.test`与`update_model_credentials_modal.test`共四处英文 accessible-name 断言，全量`src/components`+`src/app`复核其余消费方测试均经`renderWithProviders` 别名/`vi.mock`/已开弹层路径不抛，第 356 簇把高扇出 `shared/PasswordInput`显隐 aria 接`common`两键并翻两处英文断言，第 357 簇续接`GuardrailSelector`/`PolicySelector` 的 disabled/enabled 占位符四枚（`guardrails`/`policies` 各另立两键、`key_edit_view.integration`两处 combobox 随翻），三元`? :`口径可见串大体接净、第 358 簇接 TagsInput loading 占位复用`common.loading`（0 新键）并把 `DetailContent`「LiteLLM」品牌、`provider_margin_table`「Global」显示名 token 两枚入判定账，两侧皆英文的三元 `? "English" : "English"` 全仓非测试复扫归零；第 359 簇开「单侧三元英文串」子口径（`? "English" : 变量`），`networking.tsx`的`? "True"` 判 API 序列化字段值、`DetailContent`「LiteLLM」品牌、`toast.ts`error-title 族追认为`toast.fromError`355 调用点高扇出专项重构（同 handleError/copyToClipboard 类，且`WARNING_TITLES.has(title)` 以英文 title 判色、直译破分支须先改键判定）三枚入判定账，operations.ts 工具描述等亦入账），补扫仍在推进故暂不宣称该维度归零；第 360 簇另开「导出文档内容」维度，接定价计算器 PDF 报告 25 枚（`costTracking.multiExport.report`，`.ts` translator 注入、`createTranslator` 建测试译员，CSV 列头判数据交换标识入判定账；第 361 簇以「独占一行英文句」更宽正则重扫 JSX 文本节点，接 how_it_works 四条第 337 簇漏接残句（`calcExampleResult`/`validatingIntro`/`responseCostLabel`/`discountAmountLabel`四枚新键）；目录叶子 11371、中英同值 141（第 295/296 簇`SCIM`、`Fuse v2`两侧同值各 +1）；未接入`.tsx`侧宽口径扫描命中 11 个文件，逐文件读后全为误报或判定账，"files with hits 267"那类基于旧扫描列表的账目随列表失效不再续报；"已接入但仍有英文"长尾随第 238 到 271 簇减 33）。同值口径以同一扁平化脚本对 HEAD 与当前双侧复测为准：第 205 簇复测两侧均 138，第 202 簇记的 134 无法复现，回改；叶子总数改用「对象值以外的所有终端计一片」的即时 node 复算，同法复测 HEAD 得 10845（正文旧记 10837 系更早期口径，差在空串终端的取舍，不再回改历史行，以复算增量为准），第 246 簇 +4 至 10849，247 零新增 10849，248 +6 至 10855，249 +7 至 10862，250 +2 至 10864，251 +5 至 10869，252 +3 至 10872，253 +1 至 10873，254 +2 至 10875，255 +5 至 10880，256 零新增 10880，257 +11 至 10891，258 +4 至 10895，259 +8 至 10903，260 +2 至 10905，261 +2 至 10907，262 +3 至 10910，263 +2 至 10912，264 +2 至 10914，265 +3 至 10917，266 零新增 10917，267 +4 至 10921，268 零新增 10921，269 +2 至 10923，270 +1 至 10924；第 271 簇以同法复测 HEAD 得 10916（此前正文 10924 系混入早期空串口径的临时账），其后 +6 至 10922，历史绝对数不回改、以复算增量为准），272 +31 至 10953，273 +1 至 10954，274 +6 至 10960，275 +9 至 10969，276 +2 至 10971，277 +8 至 10979，278 +10 至 10989，279 +13 至 11002，280 +6 至 11008，281 +1 至 11009，282 +3 至 11012，283 +20 至 11032，284 +16 至 11048，第 285 簇以同法复测 HEAD 得 11056（较前记 11048 差 8 系数组终端计片口径，不回改历史），+7 至 11063，286 +9 至 11072，287 +5 至 11076，288 +1 至 11077，289 +11 至 11088，290 +4 至 11092，291 +9 至 11101，292 零新增维持 11101，293 +2 至 11103，294 +3 至 11106，295 +3 至 11109，296 +11 至 11120，297 +1 至 11121，298 +3 至 11124，299 +2 至 11126，300 +1 至 11127，302 零新增维持 11127，303 +5 至 11132，304 +44 至 11176，305 +28 至 11204，306 +1 至 11205，307 +5 至 11210，308 +4 至 11214，309 +2 至 11216，310 +6 至 11222，311 +1 至 11223，312 +4 至 11227，313 +5 至 11232，314 +3 至 11235，315 +2 至 11237，316 +1 至 11238，317 +1 至 11239，318 +2 至 11241，319 +4 至 11245，320 +6 至 11251，321 +4 至 11255，322 +3 至 11258，323 +4 至 11262，324 +7 至 11269，325 +2 至 11271，326 +6 至 11277，327 +1 至 11278，328 +1 至 11279，329 +1 至 11280，330 +1 至 11281，331 +4 至 11285，332 +1 至 11286，333 +2 至 11288，334 +1 至 11289，335 +1 至 11290，336 +2 至 11292，337 +2 至 11294，338 +4 至 11298，339 +2 至 11300，340 +2 至 11302，341 +1 至 11303，342 +3 至 11306，343 +2 至 11308，344 +1 至 11309，345 +4 至 11313，346 +4 至 11317，347 +2 至 11319，348 +1 至 11320，349 +2 至 11322，350 +2 至 11324，351 与 352 零新增维持 11324（352 复用死 orphan`models.table.costIn`不增键），353 +6 至 11330，354 +4 至 11334，355 +2 至 11336，356 +2 至 11338，357 +4 至 11342，358 零新增维持 11342（复用`common.loading`），360 +25 至 11367（定价计算器 PDF 报告；359 纯判定零新键不计），361 +4 至 11371（how_it_works 残四枚），362 +7 至 11378（multi_cost_results 内联英文八处七键），363 +1 至 11379（chat 空白态引导句），364 +3 至 11382（StdioAvailability 小写起头串族），365 +2 至 11384（ToolDetail 原生 alert 四条、复用两键加新两键），366 零新增维持 11384（复用 `common.loading` 接 aria-label 四枚），367 +1 至 11385（common.copiedToClipboard，copyToClipboard 阻塞片首三文件），368 零新增维持 11385（复用该键续接余六 utilCopyToClipboard 包装器、补各文件 commonT hook），369 零新增维持 11385（复用该键接最后七处直调 dataUtils copyToClipboard 省 messageText 者），370 零新增维持 11385（DataTable loading 默认接 common.loading 一处盖约 31 省略调用方）371 +1 至 11386（DataTableFilterDrawer 三默认 title/applyLabel/resetLabel 全接 common，复用既有 filters/reset、新增 applyFilters 一枚）372 +1 至 11387（ModelsTableColumns CreatedByCell 的 createdAt ?? "Unknown date" 回落接新增 models.unknownDate 一枚）373 零新增维持 11387（ui/combobox ComboboxClear aria-label 默认 "Clear" 接 common.clear 复用、一接线盖 11+ showClear 消费方、翻 22 处英文 accessible-name 断言），394 +1 至 11440（provider_margin_table 三枚 SimpleTable 列头接 costTracking.colProvider/colMargin/colActions，其中 colMargin 新增、colProvider 与 colActions 复用姊妹文件既有键），395 +6 至 11446（共享件 aria/placeholder 模板里的硬编英文词族：policies dismissAlert、entityUsageExport clearFilter/filtersLabel/noUsageInRange/filterCount、mcpServers.networkSettings.removeRange，另修 entityUsageExport.entityNames.agent 的 zh 值 Agent→智能体），396 +3 至 11449（playground llm_calls 域漏网的 thrown 英文串：responses_api 两枚守卫接 llmCalls.virtualKeyRequired（复用既有键）与新增 llmCalls.modelRequired、embeddings_api 与 interactions_api 两枚 status 回落接新增 llmCalls.requestFailedWithStatus；另 chat 页 partialResponseSaved 一枚），397 +1 至 11450（模型重试设置表 catch-all 行标签 All other errors 接新增 models.retrySettings.allOtherErrors，八枚错误类名保留英文技术 token），398 +3 至 11453（prompts 会话面板错误气泡：Error: 前缀与 No response body 兜底句接 prompts.conversation.errorPrefix/noResponseBody；networking.tsx 两枚 No response body 走 toastMessage 桥接 toast.noResponseBody），399 +1 至 11454（RealtimePlayground 的 Error: 前缀与 🎙️ Listening... 状态文案接 playground.realtime.errorPrefix 与既有 realtime.listening），400 +9 至 11463（errorPatterns 表九条 replacement 串接 models.health.errorPatterns 九枚，经 errorPatternReplacement(t, pattern) 取译），401 零新增维持 11463（formItemValidateJSON 的 "Please enter valid JSON" 接既有 models.addModel.invalidJson 死键、清一 orphan，util 改收第三个 message 参数），402 +3 至 11466（许可证到期状态三枚散文接 sidebarUsageCard.noExpiration/expiredOn/expiresOn，formatExpirationStatus 改收译员首参），403 +1 至 11467（networking modelInfoCall 的模型列表空态提示接 toast.noModelsExist，走既有 toastMessage 桥），404 +2 至 11469（模块常量里的英文串改收译员：MCP 重复标识提示接 mcpServers.duplicateIdentifier、团队临时预算配对提示接 teams.member.tempBudgetPairRequired），405 +2 至 11471（浏览器标签页标题与描述接 appMetadata.title/description，经新增客户端组件 DocumentMetadata 写入 document.title 与 meta description），406 +2 至 11473（MCP 域：多选框空态提示接 mcpServers.typeToAdd、服务器地址变更提示接 mcpServers.serverOriginChanged），407 +5 至 11478（团队信息页六个页签标签接 teams.infoTab* 五枚新键与既有 infoVirtualKeys，TEAM_INFO_TAB_LABELS 改为键表），408 +3 至 11481（创建密钥失败前缀与团队成员权限提示接 virtualKeys.createErrorPrefix/teamMemberPermissionError；工具预览禁用提示接 toast.toolsPreviewForbidden 并删死导出），409 零新增减 226 至 11247（死键清理：目录叶子 11481 -> 11247，两侧同步删除 226 个无人引用的键），411 零新增维持 11247（en-US locale 格式化专项：新增 src/lib/i18n/format.ts 按当前 UI locale 格式化，替换 26 处硬编码），412 零新增维持 11247（表格日期的手写英文月份数组改走 formatDate），414 零新增维持 11247（auth session mock 收进共享工厂，lint 预算 568 -> 472 棘轮），415 +14 至 11261（最后一批显示层回落串），417 零新增维持 11261（实机验收修六处富文本运行时故障：一条崩溃 + 五处标记原样显示，另加三条旧式写法），418 零新增维持 11261（渲染扫描修两处英文日期漏：废弃横幅的硬编日期与日期选择器的 moment 英文月名），419 零新增维持 11261（渲染扫描扩到十一个页面，清掉 budgets.tpdBatch 这条没翻的目录项），420 零新增维持 11261（清掉最后两笔单跑也红的稳定失败：模型页的「设置」页签与 ROI 计算器的同步时间断言），421 零新增维持 11261（渲染扫描落进仓库成为常驻工具，并修掉它自己抓出的 ENVIRONMENT_FALLBACK 时区错误）374 零新增维持 11387（测试补账：修第 369 簇漏网的 BudgetTable 复制断言，全量 826 回归发现并登记一处第 321 簇既有 cost_tracking_settings 超时假失败入判定账）375 +2 至 11389（old-usage usage.tsx tagOptions 两枚可见 label "All Tags"/"✨ …(Enterprise only Feature)" 接 usage.old.allTags/enterpriseOnlyFeature，带 {tag} 占位）376 零新增维持 11389（MemberTable user_email 列硬编 meta.title "User Email" 接同头 t(keysUserEmail) 复用）377 +2 至 11391（agent_form_fields skill id/name 两枚 placeholder 漏过 configText、与另五枚不一致，补 agents.skillIdPlaceholder/skillNamePlaceholder 两键加 FIELD_TEXT_KEYS 两映射、两处改 configText）378 纯判定零新键维持 11391（label 选项/configText 查表/meta.title 三面普查见底，keyActivityData "Overall Usage" 判死字段入判定账）379 零新增维持 11391（toast.fromError 阻塞片前置：色彩判定从英文 label 解耦到稳定 category，行为逐例等价）380 +11 至 11402（toast.fromError 阻塞片接净：title 查 toast 命名空间按 documentElement.lang 现 locale 解析、11 键、en 缺省回退保 toast.test 绿、345 caller 零改动、全量回归仅余既有 4 已知假失败）381 +2 至 11404（handleError 的 UI Session Expired 句 + copyToClipboard 失败支 toast.fromError 描述句，复用第 380 簇 toastMessage 桥按 DOM lang 接净；网络/数据两处模块内部串、caller 零改；toast 全局测试 mock 改 importOriginal 保真实 toastMessage）382 +6 至 11410（networking throw-fallback 队列首片：向量存储/RAG 六枚 error.detail||"Failed to X" 走 toastMessage 接 toast 六键，throw 内部串、caller 零改、display 系 caller 的 t 包裹内 {error} 插值、无测试断英文故零翻面）383 +7 至 11417（networking throw-fallback 队列续片：team-member 加/批量加、MCP tools 拉取、cache MCP server、OAuth client 注册、OAuth 凭据存/销八枚 `|| "Failed to X"` 回退句走 toastMessage 接 toast 七键（add team member 两处复用同键），throw/return message 内部串、caller 零改、消费方测试全 mock 网络函数不破、无测试断英文故零翻面）384 +3 至 11420（throw-fallback 队列续片：email event settings get/update/reset 三枚 `throw new Error("Failed to X email event settings")`，caller `toast.fromError(error)` 作第二条 toast description 露出（handleError 已先透传服务器 detail），可达可见、走 toastMessage 接三键，console.error 侧同句保留非 UI、测试 mock 网络函数不破、无断英文零翻面）385 +3 至 11423（Category-B 逐个核 caller 显性：仅 `validateBlockedWordsFile`/`updateGuardrailCall`/`keyCreateForAgentCall` 三枚 thrown 英文被 caller 以 `String(error)`/`error.message` 嵌进已译 toast `{error}`/`{reason}` 而露出、接之走 toastMessage 三键；`getGuardrailInfo`/`getGuardrailUISettings`/`getGuardrailProviderSpecificParams`/`getAgentInfo`/`patchAgentCall`/`getAgentCreateMetadata`/`getProviderCreateMetadata`(useQuery)/`getAgentsList`(9 caller 全 console 或空态) 判 caller 吞 thrown（仅 console.error 或 toast.fromError(t(...))/toast.error(t(...)) 用本地化 caller 句、不嵌 error）不可达可见入判定账保留）386 +6 至 11429（hooks「error-fallback 队列」收口，按漏/吞判据追 useMutation 消费方 catch：CloudZero dryRun/export/create 三 hook `onError: toast.error(error?.message || t(...))`（error.message 恒真、遮蔽了本地化 t 回落，真实漏）、storeModelInDB/storeRequestInSpendLogs 两 hook caller `t(...) + parseErrorMessage(error)`/`t({error: parseErrorMessage(error)})`（parseErrorMessage 取 error.message、漏）、useTestMCPConnection `setToolsError(toolsResponse.message || "...")` 经 CreateMCPServer `externalError` 渲染（漏）——六枚 `|| "Failed to X"`/`toolsResponse.message || "..."` 回退走 toastMessage 接 toast 六键。四枚 hook 单测（dryRun/export/create/storeModelInDB）直接断 `error?.message` 英文，因 hook 测试用裸 `renderHook` 无 LocaleProvider、jsdom documentElement.lang 空→toastMessage 回退 en 逐字同故全绿；生产 zh 露中文）387 +2 至 11431（开「组件内 error 回落/displayed literal 英文」新维度，按漏/吞判据扫全 src 非 networking/hooks 的 `throw new Error("Failed…")`/`|| "…"`/`setX("English")`：UIThemeSettings 两 throw 被 caller 本地化 `toast.fromError(t("themeUpdateFailed"))` 吞（同 385 型、判保留死码）、LogDetailContent `|| "An error occurred"` 系 JSON-shaped API-error 对象落代码查看器（同 349 数据语料、保留）、view_users `throw "Access token required"`/keyExpiryUtils `"Invalid duration format"` 系鉴权前置/程序异常逻辑哨兵（保留）；唯 OnboardingForm 两处真用户可见漏（line 44 `setClaimError("Failed to start session. Please try again.")` 与 line 57 `error.message || "Failed to submit. Please try again."`，经 OnboardingFormBody `<AlertTitle>{claimError}</AlertTitle>` 渲染），组件加 `useTranslations("onboarding")`、接 `startSessionFailed`/`submitFailed` 两键（en 逐字、zh 会话启动失败，请重试。/提交失败，请重试。）、OnboardingForm.test 七处裸 `render` 迁 `renderWithProviders` 钉 zh、line185 英文断言翻「会话启动失败」）388 +4 至 11435（续组件内 error-fallback 维度、playground llm_calls 片：makeOpenAIEmbeddingsRequest/makeInteractionsRequest/makeOpenAIImageGenerationRequest 三模块函数（首参 `t: PlaygroundTranslator`）内 try 中 `throw new Error("No embedding returned from server")`/`"No response body received"`/`"No image data found in response"`/`"Invalid response format"` 四枚，被同函数 catch `toast.fromError(t("llmCalls.errorX", { error: String(error) }))` 作 `{error}` 嵌已译句露出（漏，throw 在 try 内已逐个核 span），接 `t("llmCalls.noEmbeddingReturned")` 等 4 新键（en 逐字、zh 服务器未返回嵌入向量/未收到响应体/响应中未找到图像数据/响应格式无效）；`"Virtual Key is required"` 守卫在 try 外抛出（传 caller、catch 不捕）判保留、`llmCalls.virtualKeyRequired`/`a2a.noResponseBody` 留作 orphan；embeddings/interactions 测试 mock toast+仅断 fetch/UI 不触 throw 路径、image_generation 无测试，全 15 例绿零翻面）389 +1 至 11436（playground llm_calls 续片：追 ChatUI `catch(1156)→updateTextUI(t("chat.errorFetching",{error:String(error)}))` 确证 `if(!accessToken) throw new Error("Virtual Key is required")` 守卫（try 外抛、传 caller）经 `{error}` 漏出，故 embeddings/interactions/anthropic_messages 三枚守卫接现成 orphan `t("llmCalls.virtualKeyRequired")`（0 新键、en 逐字、复用即清 orphan）；audio_transcriptions try 内 `throw "No transcription text in response"` 经同函数 `error.message→t("llmCalls.audioTranscriptionFailedToast",{error})` 漏、接新键 `noTranscriptionText`（zh 响应中无转录文本）；四函数测试全 `createTranslator(locale:en)`→t 返回 en 逐字同故 `.rejects.toThrow` 断言零翻面（audio:118 仍绿），a2a `:296 throw "No response body"` catch 仅 re-throw 传 caller 复杂流式另簇、`a2a.noResponseBody` orphan 留待）390 零新增维持 11436（纯判定簇：追实 a2a_send_message 双导出函数 `makeA2ASendMessageRequest`/`makeA2AStreamMessageRequest` 全文件无 `useTranslations`/Translator import、`t(` 零调用，5 枚 `llmCalls.a2a.{httpError,a2aError,noResponseBody,errorMessage,jsonParseError}` 键现全 orphan 未用，系设计留位未接的整件专项重构——需给两函数加首参 `t: PlaygroundTranslator`、贯穿 ChatUI:1145 与 CompareUI:584 两 caller（含 10+ 位置参数位移）、接 :296/:384 硬编回退并谨慎处理 166/177/291 的 server-detail/jsonRpc/`HTTP ${status}` 动态透传、且流式 catch 的 `!message.includes("JSON")` 判别逻辑敏感、a2a 全仓无测试覆盖——高风险无安全网，判入判定账列 `下一步优先级` 专项，本簇不强推）391 +1 至 11437（a2a 专项首片即 390 顾虑的「无安全网强推」经核实可低风险接：仅 `makeA2AStreamMessageRequest`（流式，唯一 caller CompareUI:584）持两枚硬编回退 :296 "No response body"/:384 "Unknown A2A error"，二者经 caller requestPromise.catch 的 `t("compare.errorFetching",{error:errorMessage})` 漏；加首参 `t: PlaygroundTranslator`、CompareUI 传其 `useTranslations("playground")` 的 t，:296 复用 orphan `t("llmCalls.a2a.noResponseBody")`（无响应体）、:384 接新键 `t("llmCalls.a2a.unknownA2AError")`（未知 A2A 错误）。两串皆不含 "JSON" 子串，故 389 行 `!message.includes("JSON")` 流式解析错误判别逐字节不破（解析错误来自原生 JSON.parse 的 message、非本串）；非流式函数 109-229 仅 server-detail/jsonRpc/`HTTP ${status}` 动态透传判保留、无 t 不需加；a2a 无直接单测但 tsc 校签名位移、CompareUI+ChatUI 全 playground 168 例回归绿证 caller 不破，余 3 枚 a2a orphan（httpError/a2aError/errorMessage/jsonParseError 中的动态型）随透传维持保留）392 +2 至 11439（开「已接入 `.tsx` 内多行 JSX 文本」盲区，用 Python 区段扫描定位 `leftnav` 两枚 Badge 标签硬编 "Model Leaderboard"/"ROI Calculator"（同文件 253/276 行兄弟项走 `<span data-i18n="nav.x"/>` 约定、唯此二枚漏接裸英文），按该约定接 `nav.modelLeaderboard`/`nav.roiCalculator` 两键、`npm run build` 与 leftnav.test 全绿；同簇另试把侧栏分组标题 798 行 `{group.groupLabel}` 改 `navT(navMessageKey(SECTION_DISPLAY[...]))` 接五枚 groupLabel，致 `leftnav.test.tsx` 两处 `getByText("设置")` 撞上 SETTINGS 组头 zh-collision 多匹配（文档已记的两侧同 zh 陷阱），判定须配 `getAllByText` 另立 393 簇处理、本簇已回退该改动只保留两枚 Badge 标签）393 零新增维持 11439（续 392 的 leftnav 盲区收尾：798 行 `<SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>` 裸英文组头（AI GATEWAY/OBSERVABILITY/ACCESS CONTROL/DEVELOPER TOOLS/SETTINGS 五枚）改 `navT(navMessageKey(SECTION_DISPLAY[group.groupLabel] ?? group.groupLabel))`，复用 breadcrumb 已用的同五枚 nav 键、0 新键；SETTINGS 组头译文「设置」与 Settings 子菜单 toggle 项译文「设置」同串，触发 `leftnav.test.tsx` 两处 `getByText("设置")` 多匹配，改按交互角色收窄：207 presence 循环用 `getAllByText(label).find(el => el.closest("a,button"))`（静态 div 组头非链接/按钮被排除）、558 展开循环用 `getAllByText(group).find(el => el.closest("button"))` 取 toggle，两处均为强断言（去掉项仍失败）；leftnav 41 例 + 中英 parity/missingKeys 9 例全绿、tsc 883 基线零非测试错、eslint stdin HEAD 6=WORK 6、prettier 组头三元换行合规、build 退出 0）第 93 到 271 簇（184、189、190、191、194、198、199、200、203、212、217、222、224、225、226、227、228、230、231、233 为纯判定簇，235 主体纯判定但带第 232 簇消费者测试补账的 feat 提交，247、256、266 为纯复用零新键簇）均按 `WORKFLOW.md` 第六步跑定向文件，第 148 簇例外跑了 `src/components` 整包，未起全量；期间 `LensSetup.integration.test.tsx` 在 `Asia/Shanghai` 下的 `/2026-09-30/` 日期断言仍会挂（上游既有，`TZ=UTC` 单跑全绿）。最新的四片全量仍是第 85 簇（886 文件 11583 例、1 失败 + 9 例预期失败，那 1 例即上述时区断言）；第 305 簇与第 307 簇后各跑了一次 `src/components` 加 `src/app` 全量，两轮 826 文件、10529/10530 例，失败面完全相同（`add_auto_router_tab.integration`、`KeyActivityPanel.integration`，单跑全绿），属已知并发假失败，零翻译回归

第 148 簇把 `src/components` 整包（6116 例）跑了一遍，暴露并修掉 26 处红灯，剩下 3 例（`add_auto_router_tab`、`KeyActivityPanel`）单跑全绿，是已知的并发假失败。修掉的这些里有一部分是本轮之前几簇的遗留账，逐条记在下面各簇里。

中英同值从 106 涨到 128 是第 146 簇带来的：供应商字段的占位符多半是 URL、模型名、字段名这类格式示例（如 `text-embedding-3-small`、`embedding`、`6379`），两侧本来就该一致。这类同值不是漏翻。

## 2026-10-21 第 413 簇更新

清第六类欠账的收尾。`tests/top_key_view.test.tsx` 有 4 例在 HEAD 上一直红：断言停在英文（`getByText("Tags")`、`getByText("Key ID")`、`getByText("Spend (USD)")`、展开按钮的 `title === "Show all tags"`），而组件早就接了 `topKeyView` 命名空间、渲染的是中文。这 4 例从上游快照起就带着，是「断言停在英文」这一类里最后没被清掉的一处。

本簇不只翻面，还把翻面过程中暴露的两处空断言补上牙齿。第一类是 `queryByText("Tags")`：界面中文化之后 DOM 里根本不存在 "Tags" 这个串，于是「标签列不显示时看不到 Tags」这条断言恒真，等于什么都没断言。改成 `queryByText("标签")` 之后才真正在断言。第二类是「展开后显示全部标签」用例里的 `if (expandButton) { ... }` 卫语句：展开按钮的 `title` 变中文后 `find` 返回 undefined，整条断言被静默跳过。去掉卫语句并先断言按钮存在。

顺带把一个零断言的用例补实。`should show tooltip on hover with tag information` 原本只有 `fireEvent.mouseOver` 和三行注释，什么都不断。Radix 的 Tooltip 在 jsdom 里靠 `focus` 打开、靠 `pointermove` 做 hover 意图，`mouseOver` 打不开它；改用 `fireEvent.focus` 后用 `findByText("标签名称：")` 等它出现，再断言标签名与金额插值都渲染出来（`high-volume` / `$125.50`）。实测 313ms、无 act 告警，连跑三次稳定。

另有两个文件的同类欠账一并清掉。`src/components/team/TeamInfo.test.tsx` 的四条 `queryByText("TPM: Unlimited")` 之类断言周围已经是中文（`TPM：0`、`TPM 限制：0`），只有这四条停在英文，同样恒真；改成目录里实际的中文形态（`TPM：无限制`、`TPM 限制：无限制` 等，全角冒号）。`src/components/team/TeamInfo.integration.test.tsx` 的三处 `queryByText("Loading...")` 更彻底：重置弹窗（`ResetMemberBudgetsDialog`）从来就没有渲染过 "Loading..." 文本，它的忙状态是靠按钮 `disabled` 表达的，所以这三条断言从建立起就是空的。改成断言真正表达该状态的按钮状态：在途时重置按钮 `toBeDisabled()`；失败后重置按钮消失、换成「重试重置」且可用；保存失败回到提示态时没有「重试重置」按钮。

变异验证：把「标签列恒显示」改掉，`Tags Column Visibility` 与 `Table Structure` 两条 `queryByText("标签")` 断言变红；把展开按钮改成恒不渲染，两条展开用例变红；把重置按钮的 `disabled={busy}` 去掉，在途用例变红；把失败态切到重试按钮的分支去掉，重试用例变红；把 TPM 一律渲染成「无限制」，`TeamInfo.test.tsx` 那条用例变红。五处变异全部被捕获，改完即还原。

验证：`top_key_view` 17 例、`TeamInfo.test.tsx` 122 例、`TeamInfo.integration.test.tsx` 14 例、team 目录 18 文件 373 例全绿；`src/components` 加 `src/app` 加 `src/utils` 加 integration 全量 11615 例，HEAD 17 失败、本簇 15 失败，逐个单跑复验后 `add_auto_router_tab.integration` 与 `edit_auto_router_modal.integration` 的 4 例在 HEAD 与本簇的差异属并发时序假失败（两文件单跑 160 例全绿），本簇修好的正是 `top_key_view` 那 4 例；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 计数与 HEAD 同态（`local/no-large-inline-object-arg` 568 超预算 551 仍是 HEAD 既有欠账，本簇未新增该规则告警）；prettier 三个改动文件里 `TeamInfo.integration.test.tsx` 在 HEAD 即脏、本簇新增行与 prettier 输出逐字一致；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；叶子零新增维持 11247。

## 2026-10-21 扫描维度收口

第 415 与 416 簇之后，把 PROGRESS 里记着的四个"检测盲区"逐条复扫一遍，结论是四个维度都已见底，剩下的命中全部有明确的判定归属。这一节把逐条甄别结果记下来，下一轮不必再从这些正则重扫。

**回落串**（`|| "English"` / `?? "English"` / `? "English" :`）：全仓 48 处。第 415 簇接掉 15 处（另加 CompareUI 的 `Image` 一处），余下 47 处判保留，归属五类：HTTP 方法与请求头（`POST` / `PUT` / `X-API-Key`，七处）、后端枚举值（护栏的 `MASK` / `BLOCK`，五处）、时区码（`UTC`，三处）、tier 标识（`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING`，四处）、品牌与协议 token（`LiteLLM` / `True` / `PDF`）。另有三处看着像文案但不能翻：`RequestLogsTableColumns` 的 `"Success"` 只参与比较、从不渲染；`RoutingDecisionCard` 的 tier id 在该文件里有一行注释明说"是运维在路由配置里手打的标识"；`HealthCheckComponent` 的九处 `"None"` 与 `HealthChecksTableColumns` 的 `NEVER_CHECKED` / `CHECK_IN_PROGRESS` / `NEVER_SUCCEEDED` / `NONE` 是一组逐字比较的排序哨兵。

**模板串**（反引号内含两个以上英文单词）：58 个候选，逐条读过全是 JSDoc 注释（用双反引号）、URL 拼装、技术值插值（如 `` `unhandled edit payload result: ${JSON.stringify(value)}` ``）与代码语料，无一是展示文案。

**JSX 文本节点**（`>` 与 `<` 之间的裸英文）：真正的展示串只剩十二处，全部判保留——键盘键名（`Enter`，两处）、自定义代码的输入字段名（`texts` / `images` / `tools` / `model`）、测试脚手架（`McpFormTestHarness` 的 `Submit`）、CSV 列名（`prompt` / `framework` / `category` 与批量创建说明里的 `user_role` / `teams` / `max_budget` / `budget_duration` / `models`，都是用户要照抄进 CSV 的标识）、格式与文件名（`JSON` / `config.yaml` / `Shell`）、品牌名（`LiteLLM`），外加 `view_user_spend.tsx` 里一段被注释掉的死代码。

**更宽的 `>text<` 口径**：两个真实命中，一个是 `HealthChecksTableColumns` 的 `Checking...`（第 415 簇已接 `models.health.checking`），另一个在注释块里。

**未接入的 204 个非测试 `.tsx`**：逐个筛过，含疑似英文文案的只有 14 个文件，其中 9 个此前已入判定账（`a2a_send_message`、`llm_calls` 四件、`networking`、`useTestMCPConnection`、两处 `console` 日志），真正没判过的只剩 `shared/errorUtils.ts`（第 415 簇已接）与 `tagTableColumns.tsx` 的 `DYNAMIC_SPEND_TAG_DESCRIPTION`——后者是被后端原样回传的哨兵值、拿来跟 `tag.description` 比对，显示用的 tooltip 早已接了 `t("dynamicViewBlocked")`。

结论：按当前的四条扫描口径，真 UI 文案的可接线余量已经见底。剩下的要么是判定账里的技术值与协议标识，要么是上游持续演进带来的新串。**这不等于整体收口**，扫描本身是启发式的，本 fork 的上游仍在演进；下一轮若要继续，应当换新维度（新组件、新页面、新交互形态）而不是重扫这四条正则。

## 2026-10-21 第 416 簇更新

四笔既有测试欠账清零，全量失败面从 17 例降到 10 例，余下的全是并发时序假失败。

一、`AddModelPanel.integration.test.tsx` 的英文 JSON 断言。第 401 簇把源码改成走 `models.addModel.invalidJson` 这个 zh 键，测试却没跟着翻面，一直断言英文 "Please enter valid JSON"，改断言为「请输入有效的 JSON」。

二、`user_info_view.integration.test.tsx` 的上一区间 savings 断言。这条此前被误记成既有欠账，实际是第 411 簇的连带影响：它靠 `queryByText("累计已节省 · Sep 1 – Sep 2 (UTC)")` 判断新区间的提交，而第 411 簇把 `formatRangeLabel` 改成按 UI locale 格式化之后，中文下这段文字变成「9月1日 – 9月2日」，探针再也匹配不上，`committedTotals` 恒为空。断言翻成中文形态。

三、`LensSetup.integration.test.tsx` 的 `/2026-09-30/` 断言。根因不是 locale 而是时区：`tests/setupTests.ts` 把 `Date.prototype.toLocaleString` 桩成本地时间串，而这条用例断言的是 UTC 时间戳渲染出来的日期，于是只有 `TZ=UTC` 时才绿。改成用同一个本地时间换算推导期望值，断言在任何时区下都成立；`TZ=UTC` 与默认时区各跑一遍都绿。

四、`cost_tracking_settings.test.tsx` 的 60 秒超时 flaky。根因是用例把 promise 的 resolve 包在 `await act(async () => {...})` 里，而被测组件在 promise 兑现后还要跑一段退出动画，act 作用域一直等不到空闲，测试体跑完了 vitest 仍按 60 秒超时判失败。改成直接 resolve，紧随其后的 `waitFor` 本来就会把 React 更新刷出来。四条断言（在途时「移除中…」按钮禁用、取消按钮禁用、兑现后弹窗关闭、`removeDiscount` 被调用）一条没少。

## 2026-10-21 第 415 簇更新

最后一批显示层回落串。全仓 `|| "English"` / `?? "English"` / `? "English" :` 三种回落形态共 65 处，逐处甄别后接了 15 处、判保留 50 处。

接上的 15 处分五类。第一类是"目录里已有键、调用点没接"的复用：`models.health.checking`（HealthChecksTableColumns 的 `Checking...`）、`playground.filePreview.image`（CompareUI 的 `Image`）、`nav.plugin`（dashboard layout 里 iframe 的 `Plugin` 标题）、`models.autoRouters.typeHeuristic`（autoRouterRows 的 `Heuristic`）。第二类是新增键：`toast.unknownError`、`toast.oauthTokenExchangeFailed`、`logs.trace.agentTracingNotEnabled`、`logs.guardrail.notAvailable`、`prompts.unnamedPrompt`、`playground.compliance.csvUploadFramework`、`playground.compliance.uploadedPromptsCategory`、`caching.notAvailable`、`modelHub.notAvailable`、`modelHub.modeChat`、`modelHub.free`、`modelHub.unknownHealth`、`modelHub.responseTime`、`modelHub.lastChecked`，两侧各 14 键，目录叶子 11247 涨到 11261。

第三类是这个专项目标本身：`shared/errorUtils.ts` 的 `parseErrorMessage` 在 error 为空时返回 `"An unknown error occurred"`，而它的 20 多个消费方全部把返回值塞进 `toast.fromError(...)`，是可见的。改走第 380 簇建立的 `toastMessage` 桥，取 `toast` 命名空间。

第四类是 `networking.tsx` 的 `exchangeMcpOAuthToken`：它的最后一道回落 `"OAuth token exchange failed"` 会被 `useMcpOAuthFlow` 的 catch 取出、`toast.error(message)` 弹出来，也是可见的，改走 `toastMessage` 桥。

第五类是纯模块函数的译员注入：`prompts/_components/prompt_editor_view/utils.ts` 的 `parseExistingPrompt` 产出提示词名与工具名两处回落（`"Unnamed Prompt"` / `"Unnamed Tool"`），该文件是纯模块拿不到 React 上下文，按仓库既有约定把 `t` 作为首参注入，并沿 `parseExistingPrompt` -> `parseDotpromptFrontmatter` -> `parseToolsFromFrontmatter` 三层穿下去；三个调用点在 `prompt_editor_view/index.tsx`，单测改用 `tests/i18nStub.ts` 的 `enMessagesFor("prompts")` 提供译员。

顺带把 `PublicModelHubTableColumns.tsx` 的 `Last Checked: {date}` 里的 `toLocaleString()` 换成第 411 簇新加的 `formatDate`，让日期跟着 UI locale 走。

判保留的 50 处分五类，都是"改了会坏"的那一类：HTTP 方法与请求头（`POST` / `PUT` / `X-API-Key` 七处）、后端枚举值（护栏的 `MASK` / `BLOCK` 五处）、时区码（`UTC` 三处）、tier 标识（`SIMPLE` / `MEDIUM` / `COMPLEX` / `REASONING` 四处）、品牌与协议 token（`LiteLLM` / `True` / `PDF`）。另有三处看着像文案但不能翻：`RequestLogsTableColumns` 的 `"Success"` 只参与 `status.toLowerCase() !== "failure"` 的比较、从不渲染；`RoutingDecisionCard` 的 tier id 在该文件里有一行注释明说"是运维在路由配置里手打的标识，只有周围的措辞本地化"；`HealthCheckComponent` 的九处 `"None"` 与 `HealthChecksTableColumns` 的 `NEVER_CHECKED` / `CHECK_IN_PROGRESS` / `NEVER_SUCCEEDED` / `NONE` 是一组逐字比较的哨兵，文件注释写着"代理就是发这些串、靠逐字比较给行排序"。另有 `fetch_agents.tsx` 的 `"Failed to fetch agents"` 属第 385 簇已判定的"caller 吞 thrown"、`CodeSnippets.tsx` 与 `semanticFilterTestUtils.ts` 属代码语料与测试脚手架、`networking.tsx` 与 `LogDetailContent.tsx` 的 `"An error occurred"` 属第 387 簇已判定的 JSON 形态 API 错误对象。

测试翻面两处：`public_model_hub.test.tsx` 的 `getByText("Unknown")` 改 `未知`，`HealthChecksTable.test.tsx` 的 `getByText("Checking...")` 改 `检查中...`。

验证：i18n 守卫 16 例全绿；tsc 全仓 878 与上一簇同数、非测试文件零错；eslint 计数 472 = max 472、其余规则与 HEAD 同态；prettier 四个改动文件里三个在 HEAD 即脏、本簇新增行与 prettier 输出逐字一致；全量 11615 例 21 失败，逐个单跑复验后差异项全部落在 add_agent_form / mcp_server_edit / add_auto_router_tab / edit_auto_router_modal 四个文件上、单跑 195 例全绿，属并发时序假失败，本簇零回归；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0。

## 2026-10-21 第 421 簇更新

把渲染扫描从一次性脚本变成仓库里的工具。

第 417 到 419 簇的渲染扫描是临时写在 /tmp 里的：起 dev server、用 Playwright 的 Chromium 打开每个页面、拦下 API 请求喂假数据、把页面正文取出来扫。这套东西找出了八个真实的运行时故障——静态扫描一条都查不出——但它躺在临时目录里，会丢。

本簇把它落进仓库：

- `scripts/rendered-ui-scan.mjs` 是扫描器。收集两样东西：渲染过程中的 `console.error` 与未捕获异常，以及渲染后正文里剩下的英文词组。发现跟基线比，规则和死键门禁一样——基线里有的算已知，新增的让运行失败。
- `scripts/rendered-ui-fixtures.mjs` 是页面清单、API 桩与英文白名单。桩的形状必须跟代理真返回的一致，否则页面撞错误边界、扫到的是错误页而不是界面。
- `scripts/rendered-ui-lib.mjs` 是判定逻辑（英文词组提取、桩匹配、基线比对），按仓库既有的 `dead-key-lib` 范式单独拆出来，配 `tests/rendered-ui-lib.test.ts` 九例。
- `scripts/rendered-ui-baseline.json` 是基线，当前为空。
- `docs/i18n/RENDERED-SCAN.md` 讲怎么跑、怎么判、桩的形状坑与局限。

`npm run scan:rendered` 跑它。默认自己起桩代理；对着真代理跑用 `--proxy-url`。为此把 `playwright` 补进 devDependencies（版本与树里已有的一致，不动 next-intl 的传递依赖）。

**这一簇自己又抓出一个真错误**：第 418 簇给废弃横幅与日期选择器换上的 `useFormatter().dateTime(...)` 没给 timeZone，next-intl 在渲染时抛 `IntlError: ENVIRONMENT_FALLBACK`（用量页六次）。它不是崩溃，但 next-intl 明确说"没有全局默认时区会造成环境差异导致的标记不匹配"，属于真问题。修法不是补 timeZone，而是换一个格式化入口：给 `src/lib/i18n/format.ts` 加 `useUiFormat()`，从 React 上下文取 locale、自己调 `Intl`，不经过 next-intl 的 formatter。

这么改还顺手解决了一处不一致：模块级的 `formatDate` 从 `document.documentElement.lang` 读语言，而 `LocaleContext` 是在 effect 里才写这个属性的，首帧与测试里读到的都是旧值。组件用 `useUiFormat()` 读上下文，语言跟界面其余部分同源；纯模块没有上下文可读，仍用模块级那份。

验证：i18n 守卫四条加渲染扫描库共 26 例全绿；渲染扫描 12 个页面 0 渲染错误 0 英文，退出码 0；tsc 全仓 878 非测试文件零错；eslint 计数 471 = max 471、其余规则与 HEAD 同态；prettier 改动文件 clean；全量 11626 例 1 失败（LensSetup 的并发时序假失败，单跑全绿）；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；叶子零新增维持 11261。

## 2026-10-21 第 420 簇更新

清掉最后两笔稳定失败。它们一直没被归进"并发假失败"，因为单跑也红、且失败面在两轮全量之间不动——是真失败，不是抖动。查清之后是两笔同一类的账：断言没跟上中文形态。

一、`models-and-endpoints/page.integration.test.tsx` 的「Settings」页签。带 `?team=` 打开模型页时渲染的是 `TeamInfoView`，测试要点开团队信息页的「设置」页签。断言写的还是英文 `findByRole("tab", { name: "Settings" })`，而团队信息页的页签名 `teams.infoTabSettings` 的中文值是「设置」。同一个文件里下一条用例又写着 `queryByRole("button", { name: /edit settings/i })`——一条英文一条中文，是半翻状态。两条都按目录里的实际值翻过来（`teams.infoEditSettings` 的中文值是「编辑设置」）。

二、`ROICalculatorView.integration.test.tsx` 的同步时间。断言 `toHaveTextContent("上次同步 Sep 30, 2026, 12:00 PM UTC")`，而第 411 簇把 `formatSyncedAt` 改成按 UI locale 格式化之后，中文下这段渲染成「上次同步 2026年9月30日 UTC 12:00」。改成分别断言「上次同步」「2026年9月30日」「12:00」三段，不写死字段顺序（Intl 在 zh-CN 下把时区名放在时刻前面，顺序随 ICU 版本变）。这段时间的时区是显式 UTC，机器时区不影响取值。

验证：两个文件 12 例全绿；全量 11617 例的最终失败面见本簇提交说明；tsc 878 非测试文件零错；eslint 与 HEAD 同态；prettier 改动文件 clean；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；叶子零新增维持 11261。

**这轮补上的是"单跑也红"的那一类账**。之前的分类只有两种：单跑绿的算并发假失败、单跑红的算既有欠账。这次两笔都曾被记进"既有欠账"再没动过——而"既有欠账"这个标签最大的问题就是它不设截止日期。第 413 到 420 簇一路清下来，全量失败面从 17 降到只剩并发假失败，说明这类标签是可以被逐条兑现的。

## 2026-10-21 第 419 簇更新

把渲染扫描的页面覆盖从七个扩到十一个，并清掉一条根本没翻的目录项。

扩覆盖的活还是调 API 响应的形状。这一轮又对齐了几处代理真返回的样子：`/v1/agents` 与 `/public/agents/fields` 是裸数组，`/policy/templates` 与 `/policies/attachments/list` 是裸数组，`/management/v1/budgets` 与 `/public/v1/model_hub` 是 `{data, meta}` 的分页体，`/get/internal_user_settings` 是 `{values: {...}}`，`/global/activity/cache_hits` 带 `filter_options.key_aliases`，`/public/model_hub/info` 带 `litellm_version`。对齐之后，策略、智能体、预算、内部用户、模型中心五个页面也能渲染出真实界面，合计十一个页面（首页、虚拟密钥、团队、日志、用量、护栏、提示词、策略、智能体、预算、用户、模型中心）。

扫出来的真漏只有一条，而且是老账：`budgets.tpdBatch` 的中文值就是英文 "TPD (batch)"，从来没翻过。同族的 `virtualKeys.editForm.tpdLimitBatch` 早就翻成了"TPD 限制（批量）"，这条漏了。按同族口径改成"TPD（批量）"。顺带把目录里 133 条"中英同值"全查了一遍，除它之外全是 URL、模型名、字段名这类标识符，没有第二条漏翻。

至此渲染扫描的结论是：十一个页面渲染出的正文里，剩下的英文只有产品名（ROI 计算器、Lens、LiteAdmin、AI Hub）、用户数据（admin、example.com）、协议与单位 token（TPD、JWT、SSO ID、Enter、.prompt、prompt_id），全部属于判定账，没有漏翻的展示文案。

验证：i18n 守卫四条共 17 例全绿；tsc 全仓 878 与上一簇同数、非测试文件零错；eslint 计数 471 = max 471、其余规则与 HEAD 同态；prettier 改动文件全 clean；全量 11617 例 3 失败，逐个单跑复验后差异项落在 LensSetup 一个文件上、单跑全绿，属并发时序假失败；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；键树不变 11261，同值 133 -> 132（`budgets.tpdBatch` 只改中文侧的值）。

## 2026-10-21 第 418 簇更新

把渲染后的界面扫一遍，而不是源码。

第 417 簇是登录页炸出来的，这一条是从渲染结果里看出来的。做法是：起 dev server、用 Playwright 打开每个页面、拦下 API 请求喂假数据、把页面正文取出来，扫里面还剩下的英文词组，再逐个判归属。

先说方法上的坑。API 响应的形状必须跟代理真的一致，否则页面撞错误边界、扫的是错误提示而不是界面内容。踩了三处：`/team/list` 返回的是裸数组（`/v2/team/list` 才分页），`/organization/list` 也是裸数组，`/spend/logs/ui` 是 `{data, total, page, page_size, total_pages}` 的分页体。照着代理的 `response_model` 一个个对齐后，首页、虚拟密钥、团队、日志、用量、护栏、提示词七个页面都能渲染出真实界面。

扫出来的残留英文分两类。真漏两处：一是 `DeprecationBanner` 里硬编的 `const DEPRECATION_TARGET_DATE = "September 1, 2026"`，中文界面里显示成"最早可能于 September 1, 2026 移除"。改成 `Date` 常量加 `useFormatter().dateTime(...)`，英文侧逐字节不变（仍是 "September 1, 2026"），中文侧变"2026年9月1日"。二是 `advanced_date_picker.tsx` 用 moment 的 `format("D MMM, HH:mm")` 与 `format("MMM D, YYYY [至] HH:mm:ss")`，`MMM` 是 moment 的英文月名缩写，日期选择器在中文界面里显示"14 Oct, 09:49"。改用 `useFormatter().dateTime(...)`，日期段与时刻段分开、之间仍放译好的连接词，英文侧只有区间标签的字段顺序按 CLDR 归一（"14 Oct" -> "Oct 14"），其余不变。

不漏的残留全是判定账里的东西：产品名（ROI 计算器、Lens、LiteAdmin）、用户数据（admin、example.com）、键名（Enter）、文件扩展名与列名（.prompt、prompt_id）。

顺带修了两处测试问题。`ToolPolicies/PolicySelect.test.tsx` 的选项列表是点击后才异步渲染进 portal 的，断言却用 `getByRole` 同步取，全量并行时抢跑就红（单跑时绿，负载下一红，是典型的负载敏感假失败）。改成 `findByRole`。`advanced_date_picker.test.tsx` 那条断言区间格式的正则也跟着翻成中文形态，并注明这条用例把语言钉在 zh-CN。

**这轮的教训**：源码扫描能覆盖"文案在目录里、但调用点没接"，覆盖不了"目录里的文案本身在运行期才炸"。第 417 簇那条 `IntlError` 静态扫描一条都查不出来，源码里的字面量、目录、调用点三者看着都对，只有真正渲染一次才炸。渲染扫描是静态扫描补不上的那一半。

## 2026-10-21 第 417 簇更新

实机验收挖出的六处运行时故障，外加一条常驻守卫。

这一簇的起点不是扫描，是把面板真的跑起来看。起 Next.js dev server、用 Playwright 的 Chromium 打开登录页、拦下 API 请求喂假数据，页面上直接跳出 `IntlError: FORMATTING_ERROR: The intl string context variable "code" was not provided to the string "默认情况下，用户名为 <code>admin</code>..."`。这条错在两种语言下都出，测试里却一直绿：那块提示只在"没设界面凭据"时才渲染，没有任何用例走到它。

查清是 next-intl 的富文本契约：消息里的 `<tag>` 就是调用点必须提供的参数名。给 values 对象而没给这个 tag，next-intl 抛 FORMATTING_ERROR；压根不给 values，它不抛，但把 `<code>` 当普通文本渲染出来，用户直接看到尖括号。

**故障一（崩溃）**：`login.defaultCredentialsDesc` 的消息用 `<code>admin</code>` / `<code>MASTER_KEY</code>`，调用点却传 `username` / `masterKey` 两个 handler。两侧对不上，登录页的默认凭据提示整块抛错。这处是第 67862246 簇（2026-10-16）把消息从 `{username}` 变量改成 `<code>` 标签时留下的，英文原文被一并改掉，违反"英语原文逐字不动"。改法是消息回到上游的标签写法、调用点改传 `code` handler，与上游 `LoginPage.tsx` 里那段 `<code className="bg-muted px-1 py-0.5 rounded-sm text-xs">admin</code>` 的 JSX 一一对应。

**故障二到六（标记原样显示）**：`policies.attach.scopeGlobal/Teams/Keys/Models/Tags` 五条消息用了 `<code>` 标签，调用点却是 `t.rich("attach.scopeGlobal")` 这样的空调用，标签原样显示在界面上。上游原文这五处用的是 `<strong>`（`Global (*)` / `Teams` / `Keys` / `Models` / `Tags`），只有 Tags 那条里的 `metadata.tags` / `healthcare` / `prod-*` 是 `<code>`。按上游把标签改回去，调用点补 `strong` 与 `code` 两个 handler。

**另外三处旧式写法**：`guardrails.team.forwardBody`（`{code}Authorization{/code}`）、`mcpServers.byok.setAuthTypeFirst`（`{strong}...` 与 `</strong>` 混用）、`playground.toolsets.guideBody`（`{link}...` 与 `</link>` 混用）是 next-intl v3 的富文本写法，v4 根本不认，调用点传的 handler 被忽略、括号原样显示。三条消息改成 XML 风格标签。

**常驻守卫**：新增 `src/lib/i18n/messageArgs.test.ts`。它用 TypeScript 的 AST 扫 `src` 下所有非测试文件，把每个 `t()` / `t.rich()` / `t.raw()` 调用点解析出来，对上它所属命名空间（`useTranslations("ns")` 的绑定），查出消息在 ICU 语法上要的参数名，再跟调用点给的参数名对照，三类不匹配都算失败：给了 values 但少了参数、没给 values 而消息要参数、消息用了旧式 `{tag}` 写法。消息的 ICU 分析走 `intl-messageformat`（next-intl 自己用的解析器），元素类型不写死常量，而是用一条探针消息标定出来，解析器改编号也不会失效。为此把 `intl-messageformat@11.2.15` 补进 devDependencies（版本与树里已有的一致，不升级 next-intl 的传递依赖）。

这条守卫补的是既有三条守卫都看不见的方向：`messagesParity` 只比两侧目录，`missingKeys` 只查键在不在，都不查"消息要的参数"和"调用点给的参数"对不对得上。守卫写好后做变异验证：把登录页的 handler 改回 `username`、把 `setAuthTypeFirst` 改回旧式写法、把 `policies.attach.scopeGlobal` 的调用点去掉 values，三处都被抓出。

顺带补一条渲染用例：`LoginPage.test.tsx` 新增"渲染默认凭据提示且用户名与密钥是代码样式"，断言提示文字出现、两个值都在 `<code>` 里。这条用例会先于守卫抓到第一处故障。

验证：i18n 守卫四条（locales / messagesParity / missingKeys / messageArgs）共 17 例全绿；tsc 全仓 878 与上一簇同数、非测试文件零错；eslint 计数与 HEAD 同态；prettier 改动文件全 clean（`policies/_components/index.tsx` 在 HEAD 即脏、本簇新增行与 prettier 输出逐字一致）；全量 11617 例 7 失败，逐个单跑复验后差异项落在 LensSetup 与 edit_auto_router_modal 两个文件上、单跑 83 例全绿，属并发时序假失败；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0。实机复验：登录页在 Chromium 里正常渲染中文，控制台零错误。

## 2026-10-21 第 412 簇更新

表格日期的月份名本地化。第 411 簇把硬编码 `"en-US"` 的 26 处格式化接完，`src/components/shared/table_cells/date_cell.tsx` 里的手写英文月份数组（`const MONTHS = ["Jan", ..., "Dec"]`）不在那 26 处之列，它根本不调 Intl，所以中文界面里表格日期仍显示 `Jul 7, 2026` 这类英文月名。

本簇把那套手写拼接换成 `src/lib/i18n/format.ts` 的 `formatDate`。英文侧输出逐字节不变：`formatCellDate` 的 datetime 精度仍是 `Jul 7, 09:50:13`（`{month:"short", day:"numeric"}` 加 24 小时制时分秒），date 精度仍是 `Dec 31, 2026`；`formatFullTimestamp` 仍是 `Jul 7, 2026, 09:50:13 (America/New_York)` 这形态，末尾的 IANA 时区名是手拼的、没动。中文侧 date 精度变 `2026年7月7日`、datetime 精度变 `7月7日 09:50:13`。

时间选项用 `hourCycle: "h23"` 而不是 `hour12: false`。后者在部分 ICU 版本上对午夜会渲染成 `24:00:00`（h24 而非 h23），显式写 h23 才稳定，且在英语与中文下都出 `09:50:13`。

测试翻面一处：`src/components/team/TeamMemberTab.test.tsx` 的 `getByText("Jul 15, 2026")` 改 `2026年7月15日`，该用例走 `renderWithProviders`（语言钉在 zh-CN，`LocaleContext` 的 effect 把 `document.documentElement.lang` 设成 `zh-CN`），所以月份名跟着变。`date_cell.test.tsx` 用裸 `render`、没有 Provider，`document.documentElement.lang` 是空串、回落英语，原有断言逐字不变，本簇另补一条把 lang 设成 `zh-CN` 的用例把中文分支钉住。

验证：table_cells 目录 8 文件 70 例、team 目录 12 文件 243 例全绿；`src/components` 加 `src/app` 全量 10103 例仅 5 例失败，逐个复验后 `top_key_view` 4 例与 `cost_tracking_settings` 1 例在 HEAD 同样失败、属既有欠账与并发假失败，本簇零回归；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 计数与 HEAD 同态；prettier 三个改动文件 clean；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；叶子零新增维持 11247。

## 2026-10-21 第 411 簇更新

`en-US` locale 格式化专项。全仓有 23 处把 locale 硬编成 `"en-US"`（`toLocaleDateString` / `toLocaleTimeString` / `toLocaleString` / `Intl.DateTimeFormat` / `Intl.NumberFormat`），在 zh 构建下仍按美式格式输出：日期出英文月份缩写（`Aug 7, 2026`）、时间出 12 小时制（`08:00 PM`）、货币出 `US$1,234.56`。这与「界面显示简体中文」的目标直接冲突，且第 402 簇改完 `formatExpirationStatus` 的散文后，日期部分仍是英文，混在同一句里。

新增 `src/lib/i18n/format.ts`：按当前 UI locale 格式化日期、时间、数字与货币。locale 的取法沿用第 380 簇 `toast.ts` 的既有桥接，读 `document.documentElement.lang`（`LocaleContext` 的 effect 维护），无 document 时回落 `DEFAULT_UI_LOCALE`，这样纯模块也能用，不必是 React 组件。

替换 23 处硬编码，分三类。日期 12 处：`BlogDropdown`、`SpanHoverCard`（模块级 `Intl.DateTimeFormat` 常量改成按调用时格式化，否则 locale 切换后不重算）、`model_info_view`、`key_info_view` 与 `AutoRotationView`（两处 `formatTimestamp` 结构相同，一并改）、`licenseUtils.formatExpiryDate`、`costOptimizationUtils` 的 `shortDate` 与 `formatRangeLabel`、`UsagePageView` 的区间起止、`EndpointUsageLineChart` 的横轴。货币 5 处：`LensView`、`AnalysisKeyDetails`、`modelInsightsData`、`roiCalculatorData`，统一加 `currencyDisplay: "narrowSymbol"`，让 zh 下仍是 `$1,234.56` 而不是 `US$1,234.56`，与应用里手写 `$${...}` 的既有风格一致。紧凑记法 4 处：`modelInsightsData` 与 `cache_dashboard`、`old-usage/usage` 改走 `formatNumber`，zh 下得 `1.2万` 这类中文数量词，是正确的中文表达而非缺陷。

数字格式化本身在两种 locale 下输出逐字节相同（`1,234,567.89` 两边一致），故 `utils/dataUtils.ts` 的 `formatNumberWithCommas` / `getSpendString` / `formatPerSecondCost` 保持原样，不动 132 处调用点。

行为差异与测试翻面：日期在 zh 下从 `Aug 7, 2026` 变 `2026年8月7日`、时间从 `08:00 PM` 变 `下午8:00`、短日期从 `Jul 1` 变 `7月1日`、区间标签从 `Jul 6 - Aug 5 (UTC)` 变 `7月6日 - 8月5日 (UTC)`。据此翻面 8 个测试文件共 14 处断言：UsageTab 5 处、AutoRouterBenchmarksTab 1 处、BlogDropdown 1 处、key_info_view 2 处、key_info_view.budget_display 2 处、EndpointUsageLineChart 1 处、SidebarUsageCard 2 处。

两处需要说明的坑。一是 `Intl.DateTimeFormat.format` 对无效日期抛 RangeError，而 `toLocaleDateString` 返回 "Invalid Date" 字符串不抛；`key_info_view` 的 mock 数据里 `expires: "null"`（字符串）会构造出 Invalid Date，改动后该测试直接崩，故 `formatDate` 对无效日期显式返回 "Invalid Date"，与原行为一致。二是 `utils/licenseUtils.test.ts` 原在 node 环境跑（无 `document`），locale 恒回落 en，断言英文日期因此通过、zh 分支从未被覆盖；本簇把它移到 `.test.tsx` 走 jsdom，并补一条把 `document.documentElement.lang` 设为 `zh-CN` 的用例。

新增 `src/lib/i18n/format.test.tsx` 六例，覆盖 locale 解析与回落、日期按 locale 格式化、无效日期不抛、数字分组、货币窄符号。

验证：format.test 6 例、licenseUtils 24 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 计数与 HEAD 完全持平；prettier 全部改动文件 clean；`src/components` 加 `src/app` 全量 10101 例仅 7 例失败，逐个复验后 `top_key_view` 4 例与 `cost_tracking_settings` 1 例在 HEAD 同样失败（既有欠账与 flaky），其余为本簇翻面后复跑转绿；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0；叶子零新增维持 11247。

同簇后续片把余下三处紧凑记法也接上：`cache_dashboard` 与 `old-usage/usage` 的 y 轴刻度 formatter、`roiCalculatorData` 的普通数字格式（该文件自己导出一个同名 `formatNumber`，故 import 处取别名 `formatNumberValue` 避免同名冲突）。紧凑记法在 zh 下于万位才缩写（`6万`），万以下不缩写（`6000`），与中文数量词习惯一致；`cache_dashboard.test.tsx` 原断言刻度形如 `60K`，翻面为 `6万` 并放宽正则以容纳「数字」与「数字+万」两种形态。

补充片验证：`src/components` 加 `src/app` 全量 10102 例仅 5 例失败，逐个复验后 `top_key_view` 4 例与 `cost_tracking_settings` 1 例在 HEAD 同样失败、属既有欠账与 flaky，本簇零回归；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 计数与 HEAD 同态（no-console 12、其余同）；prettier 两个改动文件在 HEAD 已脏、本簇未新增脏区；knip:ci 绿；`npm run check:dead-keys` 绿；`npm run build` exit 0。

## 2026-10-21 第 410 簇更新

死键判定器接进 CI。第 409 簇清掉 226 个死键，但死键本身没有守卫，下一轮又会攒起来，而它们正好把真正的漏接藏在噪声里。本簇把判定器变成门禁。

新增 `scripts/check-dead-keys.mjs` 门禁脚本与 `scripts/dead-key-lib.mjs` 判定库，沿用仓库既有的「预算 + 棘轮」范式（对照 `scripts/check-lint-budgets.mjs` 与 `eslint-budgets.json`）。`dead-keys-baseline.json` 记录已确认的死键集合，新增死键即失败并列出键名，基线里已解决的条目则提示刷新基线（`npm run check:dead-keys:write`）。当前基线为空集，因为第 409 簇已把存量清干净。

判定器本轮补强了两处。一是本地定义的译员类型：`src/lib/i18n/translators.ts` 之外的 26 个模块各自定义 `type XTranslator = ReturnType<typeof useTranslations<"ns">>`，命名空间写在类型参数里，此前无法反推、其引用点会被误判成死键，现按该形态解析出命名空间。二是动态展开的键名：实测在 `t(\`entityNames.${x}\`)` 这类模板覆盖的子树内注入探测键仍被判为活键，动态前缀保命成立。

门禁行为实测：向 `toast` 命名空间注入一枚探测键，脚本报「1 new dead message keys」并以退出码 1 失败；移除后恢复绿色。

CI 侧接在 `test-litellm-ui-lint.yml` 的 knip 死代码检查之后，用 `npm run check:dead-keys`。该工作流只在 PR 改了 UI 文件时跑，而死键的来源正是 `src/messages` 下的目录文件与组件代码，落在同一覆盖范围内。

新增 `tests/dead-key-lib.test.ts` 七例，覆盖输出解析、新增死键与已解决死键两个方向。

验证：两个库的测试文件 10 例全绿；`npm run check:dead-keys` 绿（死键 0、基线 0）；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 计数与 HEAD 完全持平（no-console 12、其余同），新增脚本改用 `console.warn` 以不突破 `eslint-budgets.json` 的 no-console 预算；prettier 新增文件全 clean；knip:ci 绿；`npm run build` exit 0。

`local/no-large-inline-object-arg` 在 HEAD 已是 568、超出预算 551，本簇未新增该规则的任何告警（逐文件比对增量为零），属上游既有欠账。

## 2026-10-20 第 409 簇更新

死键清理。`en.json` / `zh-CN.json` 里存在大量「键在目录里、代码没人引用」的条目，它们既拖慢目录体积，又让真正的漏接藏在噪声里。PROGRESS 一直记着「死键没有守卫，只能人工发现」，本簇把这件事做成可重复的判定。

新增 `scripts/dead-keys.py`：按三种调用形态解析键的引用。一是同文件内的 `useTranslations("ns")`，二是经 props 传入的译员（`t: SomeTranslator`），其命名空间从 `src/lib/i18n/translators.ts` 里每个包装函数的 `useTranslations("<ns>")` 反推，三是 `toastMessage` 桥，它固定读 `toast` 命名空间。键在某个作用域下被判为被引用，当且仅当该作用域所在文件里出现过它的相对路径（或其前缀）；另有一套「字面量兜底」：表常量里写的 `labelKey: "authType.tokenExchange"` 这类写法无法静态归属到命名空间，故任何在源码中以完整相对路径原样出现过的键一律保命。

判定器的实现有个必须记下的坑：字符串字面量不能用「一对引号」的正则提取。文件里只要有一处含转义引号的字面量，配对就会错位，把后面的键名一起吞掉。`LensSetup.tsx` 的 `t("investigation")` 就曾因此被漏判成死键、险些误删。改为逐引号扫描后才得到正确结果。

最终删掉 226 个键，两侧同步：playground 39、teams 33、organizations 31、models 20、common 16、budgets 13、vectorStores 11、adminPanel 8、tagManagement 8、mcpServers 7、virtualKeys 6、users 5，其余分散。目录叶子 11481 降到 11247，中英同值 141 降到 133（减的 8 枚是 zh 值本就等于 en 的技术 token，如 `TPM`、`RS256`、`DISABLE_ADMIN_UI=False`）。

删除方式是行级改写而非 JSON 往返：两个目录文件带手调过的缩进，整份重序列化会把无关行也重排、真实改动被噪声淹没。改写只动目标行，并把「删掉的成员原本带的尾逗号」移交给它的前一个兄弟，最后统一收拾各对象块的尾逗号。

顺带清掉 `en.json` 里 `nav.homeAria` 的重复键（同一行出现两次，JSON 解析取后者，zh 侧只有一行），删掉后两侧键树完全对称。

新增 `scripts/prune-dead-keys.py` 承担实际的行级删除，删前会校验键存在、删后重解 JSON，两侧删除数必须一致。

验证：i18n 守卫（missingKeys 加 messagesParity）9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；`src/components` 加 `src/app` 全量 6767 例仅 1 例失败（`cost_tracking_settings` 的既有超时 flaky，HEAD 同样失败）；integration 项目 1512 例的失败项逐个单跑复验，`LensSetup` 的 `/2026-09-30/` 时区断言与 `AddModelPanel` 的英文 "Please enter valid JSON" 断言（第 401 簇已把该串改走 zh 键，此测试尚未翻面）在 HEAD 同样失败、属既有欠账，其余为并发时序假失败、单跑即绿；`npm run build` exit 0；prettier 对两个目录文件报脏，与 HEAD 同态（这两份文件本就不是 prettier-clean）。

本簇不改任何组件代码，只删目录条目；后续若要防同类问题，可把 `scripts/dead-keys.py` 接进 CI，但本簇未做，避免在无稳定基线时引入会红的门禁。

## 2026-10-20 第 408 簇更新

续 util 维度，扫到两处真漏接。`components/organisms/utils.ts` 的 `simplifyKeyGenerateError` 返回两句面向用户的英文：兜底的 "Error creating the key: {error}"（经 `create_key_button.tsx` 的 `toast.fromError(simplifiedError)` 弹出）与团队成员权限提示 "Team member does not have permission to generate key for this team. Ask your proxy admin to configure the team member permission settings."；`components/mcp_tools/constants.ts` 的 `MCP_TOOLS_PREVIEW_FORBIDDEN_MESSAGE` = "Tool preview is not available for submissions. Tools will be verified by an admin during review."，经 `networking.tsx` 的 `testMCPToolsListRequest` 在 403 时放进返回值的 `message`、再由 `mcp_server_edit.tsx` 的 `setToolsError(toolsResponse.message || ...)` 渲染成用户可见的工具预览错误

接线：`simplifyKeyGenerateError` 改收译员首参 `t: VirtualKeysTranslator`、两句散文改接 `virtualKeys.createErrorPrefix`（"Error creating the key: {error}" / zh「创建密钥时出错：{error}」）与 `virtualKeys.teamMemberPermissionError`（zh「团队成员无权为该团队生成密钥。请联系代理管理员配置团队成员权限设置。」），调用方 `create_key_button.tsx` 传其已有的 `useTranslations("virtualKeys")` 的 `t`；`MCP_TOOLS_PREVIEW_FORBIDDEN_MESSAGE` 因 `networking.tsx` 无 React 上下文，走既有 `toastMessage` 桥接 `toast.toolsPreviewForbidden`（zh「提交申请时无法预览工具。工具将在审核期间由管理员验证。」）。改完后 `MCP_TOOLS_PREVIEW_FORBIDDEN_MESSAGE` 无人消费，成为死导出，一并删除（死键清理是 PLAN.md 列的常驻工作）。

测试补账：`organisms/utils.test.ts` 十七例改传译员（`createTranslator` 建 zh 译员）、期望的兜底前缀与权限提示改断目录里的真实译文（原先是硬编英文串常量，改为 `zh.virtualKeys.teamMemberPermissionError`，避免测试与目录各写一份文案而互相漂移）

验证：organisms 目录 7 文件 248 例、mcp-servers 目录与 networking.test 合 42 文件 800 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错（改签名期间测试文件曾多出 17 条 TS2554、随测试一并改后回落）；eslint 五文件 HEAD 136=工作 136（全既有 warning，含 create_key_button 的 complexity 既有债）；prettier 三文件 clean；`npm run build` exit 0；叶子 +3 至 11481、中英同值 141

## 2026-10-20 第 407 簇更新

续 util 维度，扫到 `components/team/tabVisibilityUtils.ts` 的 `TEAM_INFO_TAB_LABELS`：一张「页签键 -> 英文标签」映射，被 `TeamInfo.tsx` 的 `tabItems` 逐条取用渲染成团队信息页的六个页签（Overview / My User / Virtual Keys / Members / Member Permissions / Settings），zh 下仍是英文

接线：把该表从「标签文本」改为「标签键」表 `TEAM_INFO_TAB_LABEL_KEYS`（`as const satisfies Record<string, string>` 收窄键类型），新增 `teams.infoTabOverview` / `infoTabMyUser` / `infoTabMembers` / `infoTabMemberPermissions` / `infoTabSettings` 五枚（en 逐字同旧标签、zh 为「概览」「我的用户」「成员」「成员权限」「设置」），Virtual Keys 复用同命名空间既有的 `infoVirtualKeys`（zh「虚拟密钥」，此前已存在只是没被这个表用上）。`TeamInfo.tsx` 六处 `label: TEAM_INFO_TAB_LABELS[...]` 改为 `label: t(TEAM_INFO_TAB_LABEL_KEYS[...])`，`t` 是该组件已有的 `useTranslations("teams")`。

关键取舍：把标签表做成键表而不是给表加译员参数，是因为这个表只被 `TeamInfo.tsx` 一处消费，而键表能顺带让 `missingKeys` 守卫静态校验每个键确实存在（`t(...)` 的实参类型是命名空间键的联合，传错键会编译失败）。

测试补账：`tabVisibilityUtils.test.ts` 的六条标签断言改断键名（`infoTabOverview` 等）；`TeamInfo.test.tsx` 53 处 `getByRole("tab"/"tabpanel", { name: ... })` 与 `TeamInfo.integration.test.tsx` 3 处翻为中文页签名（概览/我的用户/虚拟密钥/成员/成员权限/设置），只改角色限定的查询、不动其它同名文本断言

验证：team 目录 20 文件 407 例（component 加 integration 加 unit）全绿，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 五文件 HEAD 84=工作 84（全既有 warning）；prettier 四文件 clean（`TeamInfo.integration.test.tsx` 的 HEAD 既存脏区按规则还原、diff 只含本簇三行）；`npm run build` exit 0；叶子 +5 至 11478、中英同值 141

## 2026-10-20 第 406 簇更新

续 util 维度，扫到 MCP 域两处真漏接。`mcp-servers/_components/mcpFieldRules.ts` 的 `tagsControl` 返回 `emptyText: "Type to add"`，该值是 `MultiSelect` 的下拉空态提示、被 OAuth/TokenExchange/IdJag/MCPPermissionManagement/OpenApiByok 五个表单组件消费，zh 下仍是英文；`editToolPreview.ts` 的 `getEditToolPreview` 在服务器地址变更且需重新输入凭据时返回 `message: "The server origin changed. Enter credentials and replace or remove saved static headers to preview tools."`，该 message 经 `mcp_server_edit.tsx` 的 `setToolsError(...)` 渲染成用户可见的工具预览错误

接线：`tagsControl` 改收译员首参 `t: McpServersTranslator`、`emptyText` 接 `mcpServers.typeToAdd`（zh「输入以添加」），五个消费点都已有 `useTranslations("mcpServers")` 的 `t` 在作用域内，逐个改为 `tagsControl(t, control)`；`getEditToolPreview` 的返回结构把 `message?: string` 换成 `messageKey?: "serverOriginChanged"`，消费点改为 `toolPreview.messageKey ? t(toolPreview.messageKey) : t("edit.completeSettingsToLoadTools")`，新增 `mcpServers.serverOriginChanged`（zh「服务器地址已变更。请输入凭据，并替换或移除已保存的静态请求头以预览工具。」）。

关键取舍：`getEditToolPreview` 是纯函数、无 React 上下文，改为返回 i18n 键而非译好的文案，比给函数塞译员更干净：判别逻辑与文案彻底解耦，消费点决定怎么渲染。

测试补账：`mcpFieldRules.test.ts` 九例改传译员（用 `createTranslator` 建 zh 译员）；`editToolPreview.test.ts` 的 `message: expect.stringContaining("origin changed")` 改断 `messageKey: "serverOriginChanged"`

验证：mcp-servers 目录 32 文件 493 例（component 加 integration）全绿，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错（改签名期间测试文件曾多出 10 条 TS2554、随测试一并改后回落）；eslint 八文件 HEAD 14=工作 14（全既有 warning，含 mcp_server_edit 的 complexity 与 any 既有债）；prettier 四文件 clean；`npm run build` exit 0；叶子 +2 至 11473、中英同值 141

## 2026-10-20 第 405 簇更新

开「浏览器标签页与 meta 描述」维度。`src/app/layout.tsx` 静态导出 `metadata`（title "LiteLLM Dashboard"、description "LiteLLM Proxy Admin UI"），这两串是用户能在浏览器标签页与书签里直接看到的文案，zh 下始终是英文

接线：新增 `appMetadata.title` / `appMetadata.description` 两枚（en 逐字同旧串、zh「LiteLLM 控制台」/「LiteLLM 代理管理界面」），并新增客户端组件 `src/components/shared/DocumentMetadata.tsx`：在 `useEffect` 里写 `document.title` 与 `meta[name="description"]` 的 content，挂在根 layout 的 `LocaleProvider` 内（必须在 provider 内，`useTranslations` 才拿得到当前 locale 的目录）。

关键约束：Next.js 的 `metadata` 是服务端静态导出，而本项目的 locale 只存在 localStorage（`LocaleContext` 的 `getSnapshot` 读 `UI_LOCALE_STORAGE_KEY`，无 cookie），服务器端无从得知用户选的语言，因此不能改用 `generateMetadata` 按 locale 产出，只能在客户端写。组件因此不复用 `layout.tsx` 里那份静态 metadata 的值，而是从目录取，两侧共用 `appMetadata.*` 保证一致。

测试补账：新增 `src/components/shared/DocumentMetadata.test.tsx` 两例，锁住 `document.title` 与 `meta description` 写的是中文译文、以及组件不往页面里渲染任何内容

验证：DocumentMetadata.test 2 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 三文件 0 error（测试里查 meta 标签触发两条 `no-node-access` warning，与仓库既有测试写法同型）；prettier 三文件 clean；`npm run build` exit 0；叶子 +2 至 11471、中英同值 141

## 2026-10-20 第 404 簇更新

开「模块常量里的英文串」维度。此前各簇处理的多是组件内的字面量与函数内的串，本维度看的是「导出的常量直接当展示文案用」这一形态：常量在模块顶层定义、不带 React 上下文，组件 import 后直接渲染或直接作表单错误消息，zh 下仍是英文

接两枚：`mcp-servers/_components/duplicateServerCheck.ts` 的 `DUPLICATE_IDENTIFIER_MESSAGE` = "An MCP server with this name/alias already exists."，被 `CreateMCPServer` 与 `mcp_server_edit` 两处同时用作 `form.setError` 的字段级错误与 `toast.fromError` 的消息，改为导出函数 `duplicateIdentifierMessage(t)`、接 `mcpServers.duplicateIdentifier`（zh「已存在同名的 MCP 服务器。」），两个消费点的 `t` 都在作用域内（均为 `useTranslations("mcpServers")`）；`components/team/memberFormValues.ts` 的 `TEMP_BUDGET_PAIR_MESSAGE` = "Set both a temporary budget increase and its expiry, or neither"，被 `EditMembership` 的 zod `superRefine` 产成表单校验消息，改为 `tempBudgetPairMessage(t)`、接 `teams.member.tempBudgetPairRequired`（zh「临时预算增幅与到期时间需同时设置或同时不设置」），消费方 `buildMemberSchema` 本就收 `t: TeamsTranslator`

同维度逐个复核的判定：`useChatHistory.ts` 的 `DEFAULT_CONVERSATION_TITLE` = "New conversation" 是写入会话存储的默认标题值、`ConversationList` 渲染时按该值比对并改显本地化文案，本体不直接显示，判数据值保留；`build_auto_router_routing_test_request.ts` 的 `JEV_CONNECTION_TEST_PROMPT` = "What is 2 plus 2?" 是发给模型的测试 prompt，判模型输入保留

测试补账：`EditMembership.integration.test.tsx` 的本地常量翻为中文并随之翻断言；`duplicateServerCheck.test.ts` 新增一例锁住 `duplicateIdentifierMessage(t)` 返回中文译文

验证：duplicateServerCheck.test 10 例、EditMembership.integration.test 20 例、CreateMCPServer 与 mcp_server_edit 集成测试 71 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错（CreateMCPServer.integration.test 的 selectOption(RegExp) 四处 TS2345 是 HEAD 既有的测试文件类型债、非本簇引入）；eslint 六文件 HEAD 28=工作 28（全既有 warning，含 EditMembership 的 complexity 既有债）；prettier 四文件 clean；`npm run build` exit 0；叶子 +2 至 11469、中英同值 141

## 2026-10-20 第 403 簇更新

开「服务端错误兜底里的硬编提示」维度。`src/components/networking.tsx` 的 `modelInfoCall` 在响应非 ok 且正文含 "No model list passed" 时，把 `errorData` 换成一句面向用户的引导 "No Models Exist. Click Add Model to get started." 再 `toast.info(errorData)` 弹出。该句是本地硬编的引导文案、不是服务器原文，zh 下仍为英文，属真漏接

接线：新增 `toast.noModelsExist` = "No Models Exist. Click Add Model to get started." / zh「尚无模型。请点击「添加模型」开始使用。」，调用点改走既有 `toastMessage` 桥（第 380/381 簇建的「按 DOM lang 读消息目录」通道），caller 与控制流一字未动。注意同句所在的 `errorData` 其余分支是服务器原文透传、不可译，本簇只换这句本地引导

测试补账：新增 `src/components/networking.modelListHint.test.ts` 一例，桩 `fetch` 返回 400 加 "No model list passed"，断言 `toast.info` 收到的是 `zh.toast.noModelsExist` 的真实译文（mock 的 `toastMessage` 直接读 zh 目录、不返回 key 桩值，避免测试只验证了「传了键名」而非「传了译文」）

同维度逐个复核的判定：hooks 域里成片的 "Access token is required" / "Missing auth or teamId" 是鉴权前置逻辑哨兵（caller 恒有 token，抛错不达用户），判保留；`useDeletePolicyAttachment` 的 "Error deleting attachment:" 是 console.error 侧日志、其 onError 走本地化 `t("attach.deleteFailedToast")` 不嵌 error，判吞；`useProxySettings` 的 "Gateway changed while loading settings." 是 queryFn 内的并发守卫，判保留

验证：networking.modelListHint.test 1 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint networking.tsx HEAD 126=工作 126（全既有 warning）；prettier 新测试文件 clean；`npm run build` exit 0；叶子 +1 至 11467、中英同值 141

## 2026-10-20 第 402 簇更新

续 util 维度，扫到 `src/utils/licenseUtils.ts` 的 `formatExpirationStatus`：返回三条可见英文 "No expiration" / "Expired {date}" / "Expires {date}"，消费方 `SidebarUsageCard` 把结果直接当侧边栏卡片的副标题渲染，zh 下仍是英文

接线：按项目「模块函数首参注入译员」惯例给该函数加译员首参（`SidebarUsageCardTranslator`，`translators.ts` 新增 `useSidebarUsageCardTranslator`），三枚散文改接 `sidebarUsageCard.noExpiration` / `expiredOn`（"Expired {date}" / zh「已于 {date} 过期」）/ `expiresOn`（"Expires {date}" / zh「将于 {date} 到期」）。`formatExpiryDate` 本身不动（见下方 locale 维度登记）

顺带开一条新维度的登记：全仓有 23 处 `toLocaleDateString("en-US")` / `toLocaleString("en-US")` / `Intl.NumberFormat("en-US")` 硬编码英文 locale（如 `licenseUtils` 的 `formatExpiryDate`、各图表的坐标轴与 tooltip 数字格式），它们在 zh 下仍按美式格式输出（日期出英文月份缩写、数字出美式分组）。这类不是文案而是格式化，改动会连带影响图表轴标签与既有断言，本簇只登记入判定账留作专项，不在本簇动

测试补账：`licenseUtils.test.ts` 的 `formatExpirationStatus` 五例改为用 `createTranslator` 建 zh 译员传入、断言改中文（「将于 Aug 7, 2026 到期」等），`SidebarUsageCard.test.tsx` 两处副标题断言翻为「将于 Dec 31, 2099 到期」「已于 Jan 1, 2020 过期」

验证：licenseUtils.test 23 例、SidebarUsageCard.test 10 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 五文件 HEAD 8=工作 8（全既有 warning，含测试里的 no-node-access 既有债）；prettier 本簇新行已折行至 120 内、其余文件 clean；`npm run build` exit 0；叶子 +3 至 11466、中英同值 141

## 2026-10-20 第 401 簇更新

续第 400 簇的 util 维度，扫到 `src/utils/textUtils.ts` 的 `formItemValidateJSON`（表单 JSON 校验器，消费方 `add_model/advanced_settings.tsx` 的 litellm_extra_params 与 model_info_params 两个字段）：非法 JSON 时 `Promise.reject("Please enter valid JSON")`，该串是 antd 表单校验器直接渲染给用户的错误提示，zh 下仍是英文

接线：按 WORKFLOW.md「zod schema 顶层拿不到 t，改成接收 t 的工厂函数」的同类约定，给该校验器加第三个参数 `invalidJsonMessage`，由调用方传入译文；`advanced_settings.tsx` 两处消费点改为 `validatorRules({ validator: (_, value) => formItemValidateJSON(_, value, t("invalidJson")) })`。复用的 `models.addModel.invalidJson` 键早已存在、en 逐字同旧串（"Please enter valid JSON"）、zh 已是「请输入有效的 JSON」，此前从未被引用，属「键已存在、调用点未接」一类，本簇接上即清一 orphan、0 新键

测试补账：`textUtils.test.ts` 的 `formItemValidateJSON` 五例改为传第三个参数（原先断 `rejects.toBe("Please enter valid JSON")`），断言改为调用方传入的中文消息，证明校验器透传的是调用方的文案而非 util 内置串

验证：textUtils.test 10 例、add_model 目录 14 文件 118 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 三文件 HEAD 5=工作 5（全既有 warning，含 textUtils 的 `any` 既有债）；prettier 本簇新行已折行至 120 内、advanced_settings.tsx 其余脏区系 HEAD 既存不动；`npm run build` exit 0；叶子零新增维持 11463、中英同值 141

## 2026-10-20 第 400 簇更新

开「共享 util 里的归一化替换串」维度。`src/utils/errorPatterns.ts` 是集中维护的错误模式表（注释写明「Add new patterns here without touching component files」），九条 pattern 各带一条 `replacement` 英文串，供 `HealthCheckComponent` 的 `extractMeaningfulError` 在原始错误匹配不上时替成一句人类可读的归一化描述。该串最终进模型健康检查的错误详情弹窗与卡片错误行，zh 下仍是英文，属真漏接

接线：把表项的 `replacement: string` 改为 `replacementKey`（九枚键名收窄成字面量联合），新增 `errorPatternReplacement(t, pattern)` 取译；`errorPatterns.ts` 按项目「模块函数首参注入译员」惯例收 `ModelsHealthTranslator`（`src/lib/i18n/translators.ts` 新增 `useModelsHealthTranslator`/`ModelsHealthTranslator`，此前 `models.health` 命名空间没有对应译员类型）。目录侧新增 `models.health.errorPatterns` 九枚（en 逐字同旧 replacement、zh 为「缺少 API 密钥」「连接超时」「网络连接失败」「访问被拒绝 - 请检查 API 密钥权限」「未授权 - API 密钥无效」「超过速率限制」「提供商内部服务器错误」「认证失败」「API 错误」）。`HealthCheckComponent` 的循环改为 `for (const pattern of errorPatterns)` 后 `return errorPatternReplacement(t, pattern)`，其余判定逻辑（`ERROR_TO_STATUS` 映射、`KEYWORD_ERRORS` 关键词表、清理兜底）一字未动

顺带说明：同文件的 `KEYWORD_ERRORS` 六枚 label（"AuthenticationError: 401" 等）判保留不译，它们是错误类名加状态码的技术标识、与第 397 簇的重试表同类；`ERROR_TO_STATUS` 映射表的 value 同理。本簇只处理 `errorPatterns` 里真正是散文描述的九枚

测试补账：新增 `src/utils/errorPatterns.test.ts` 四例（按 AGENTS.md「逻辑抽出来单测、不从组件驱动」的约定，直接测 util 而非渲染 HealthCheck），分别锁住缺密钥、限流、wrapped 认证三类错误的译文，以及不匹配的错误不落任何一条 pattern。原先 `HealthCheckComponent.test.tsx` 11 例未覆盖这张表（绿灯不代表接对了）

验证：errorPatterns.test 4 例、HealthCheckComponent.test 11 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 四文件 HEAD 7=工作 7（全既有 warning，含 HealthCheck 缺 `t` 依赖的既有债）；prettier 三文件 clean；`npm run build` exit 0；叶子 +9 至 11463、中英同值 141

## 2026-10-20 第 399 簇更新

续第 398 簇「caller 把 thrown message 与硬编前缀拼成气泡内容」口径，扫到 `playground/components/chat_ui/RealtimePlayground.tsx` 的两处可见英文：WebSocket 收到 `type: "error"` 帧时 `addMessage("status", \`Error: ${data.error?.message || JSON.stringify(data.error)}\`)`的「Error: 」前缀，以及开始录音成功后`addMessage("status", "🎙️ Listening...")` 的整句

接线：新增 `playground.realtime.errorPrefix` = "Error: {message}" / zh「错误：{message}」，en 侧前缀逐字保持 "Error: "（与 `usage.aiChat.errorPrefix`、`prompts.conversation.errorPrefix` 同一句式，各命名空间自持一份）；「🎙️ Listening...」复用同命名空间既有的 `realtime.listening` 键（zh 已是「🎙️ 正在聆听...」），此前该键已存在却没被组件引用，属「键已存在、调用点未接」一类，接上即清一 orphan

测试翻面与补账：`RealtimePlayground.test.tsx` 的 `getByText("Error: rate limited")` 翻为「错误：rate limited」；新增一条用例锁住录音中显示「🎙️ 正在聆听...」且英文串不再出现。为让该用例能跑通，给测试补了 `navigator.mediaDevices.getUserMedia` 与 `AudioContext.createScriptProcessor` / `createMediaStreamSource` 三处 stub（此前测试只 stub 了 `createBuffer` 与 `createBufferSource`，录音路径走不到 `addMessage`）

验证：RealtimePlayground.test 16 例加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 两文件 HEAD 7=工作 7（全既有 warning，含 `useCallback` 缺 `t` 依赖的既有债，本簇未动依赖数组以免与 React Compiler 规则冲突）；prettier 本簇新行已折行至 120 内、文件其余脏区系 HEAD 既存不动；`npm run build` exit 0；叶子 +1 至 11454、中英同值 141

## 2026-10-20 第 398 簇更新

按「错误气泡里的英文前缀与兜底句」口径扫 prompts 与 networking 两域。第 396 簇的 `llmCalls` 片只清了模块函数内 throw 的英文句，本簇补上更靠外的一层：caller 把 thrown message 与硬编前缀拼成气泡内容的那一段

`prompts/_components/prompt_editor_view/conversation_panel/useConversation.ts` 的 catch 分支把 `error.message` 拼成 `` `Error: ${error.message}` `` 塞进 assistant 消息气泡（两处：复用最后一条空 assistant 与追加新条），「Error: 」前缀是硬编英文；同文件 `throw new Error("No response body")` 是无响应体时的兜底句、也经该气泡露出。接 `prompts.conversation.errorPrefix` = "Error: {message}" / zh「错误：{message}」与 `prompts.conversation.noResponseBody` = "No response body" / zh「未收到响应体」。en 侧前缀逐字保持 "Error: "（与 `usage.aiChat.errorPrefix` 同一句式，同一 en 值不同命名空间各持一份，与「每命名空间自持一份」惯例一致）。`HTTP error! status: ${response.status}, ${errorText}` 一枚判保留不译：它是 HTTP 协议诊断串、errorText 为服务器原文透传，译前半句会与后半句的原文混排失真

`components/networking.tsx` 两枚 `if (!reader) throw new Error("No response body")`（`enrichPolicyTemplateStream` 与 `usageAiChatStream`）走既有 `toastMessage` 桥接 `toast.noResponseBody` = "No response body" / zh「未收到响应体」，caller 零改动：前者经 `template_parameter_modal` 的 onError 回调与外层 catch 落地（后者 `UsageAIChatPanel` 已用 `t("errorPrefix", { message })` 包裹，英文会露在 `{message}` 位）

测试补账：新增 `useConversation.test.tsx`（首建该 hook 的专测）两条用例，分别锁住 HTTP 失败时气泡内容为「错误：HTTP error! status: 500, upstream detail」与无响应体时为「错误：未收到响应体」。测试用 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "prompts" })` 建译员（承 `modelOwnership.test` 等既有做法），文件放 `.test.tsx` 以走 jsdom 的 component 项目（`renderHook` 在 node 环境无 `document`）

验证：prompts `prompt_editor_view` 目录 15 文件 55 例（含新增 2 例）加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 两源文件 HEAD 138=工作 138（全既有 warning）；prettier 两文件 clean；`npm run build` exit 0；叶子 +3 至 11453、中英同值 141

## 2026-10-20 第 397 簇更新

按「同一张表里散文与字段名混列」的口径复核模型重试设置表（`ModelRetrySettingsTab.tsx`）。该表的 `retryPolicyMap` 九条目是「显示标签 -> 代理重试策略字段」映射，九条标签在表格里逐行渲染，其中八条是错误类名加状态码（`BadRequestError (400)`、`AuthenticationError  (401)` 等），与右侧 policy key（`BadRequestErrorRetries` 等）一一对应、且与代理配置里的字段名同名，判技术 token 保留英文（与第 352 簇 role/displayName token 判保留同族）；只有末条 `All other errors` 是纯散文、不是任何字段名，属真漏接

接线：新增 `models.retrySettings.allOtherErrors` = "All other errors" / zh「其他所有错误」，组件加一张 `RETRY_POLICY_LABEL_KEYS` 映射（`as const` 收窄键类型以过 next-intl 的 `NamespacedMessageKeys` 校验），渲染时按映射取译文、无映射者沿用原标签。表格首格与输入框的 aria-label 同用该译文（aria-label 原为 `${exceptionType} ${t("retryCount")}`，须同步，否则可及名与可见名不一致）

测试补账：新增一条用例锁住 catch-all 行译成「其他所有错误」、英文标签不再出现、且输入框 accessible-name 同步为「其他所有错误 重试次数」。原有八条错误类名断言保持英文不变（它们是技术 token，译了反与 policy key 脱节）

验证：ModelRetrySettingsTab.test 24 例加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错（`as const` 收窄后无新错，首版 `Record<string, string>` 写法曾报 TS2345 一条、已改）；eslint 该文件 clean；prettier 该文件 HEAD 既存脏（`--write` 曾顺带重排本簇无关的既有脏区、已按 HEAD-clean 规则还原，只留本簇行）；`npm run build` exit 0；叶子 +1 至 11450、中英同值 141

## 2026-10-20 第 396 簇更新

开「模块函数 thrown 英文串在 caller 侧经 `{error}` 插值漏出」维度的收口片，按第 385 簇确立的「漏/吞」判据重扫 playground `llm_calls` 域。第 388/389 簇已接该域的 `No embedding returned from server`/`No response body received` 等四枚，本簇补上当时判为「判保留」但实为漏的两处：`embeddings_api.tsx` 与 `interactions_api.tsx` 的 `throw new Error(errorText || \`Request failed with status ${response.status}\`)`位于各自 try 块内、被同函数 catch 的`toast.fromError(t("llmCalls.errorXxx", { error: String(error) }))`作`{error}`插值露出（errorText 为服务器原文、仅回落分支是硬编英文），故接新键`playground.llmCalls.requestFailedWithStatus`（en 逐字 "Request failed with status {status}"、zh「请求失败，状态码 {status}」，两文件同句复用同键）

同片另接 `src/components/llm_calls/responses_api.tsx` 的两枚守卫句：`if (!accessToken) throw new Error("Virtual Key is required")` 与 `if (!selectedModel ...) throw new Error("Model is required. Please select a model before sending a request.")`。该文件已收首参 `t: PlaygroundTranslator`，但两枚守卫写在 try 之前、抛给 caller，而两个 caller（`ChatUI.tsx` 的 `updateTextUI("assistant", t("chat.errorFetching", { error: String(error) }))` 与 `app/chat/page.tsx` 的 catch）都把 thrown message 嵌进已译句或渲染为气泡文本，故为漏。`"Virtual Key is required"` 复用既有 `llmCalls.virtualKeyRequired`（en 逐字同、0 新键），另一枚新增 `llmCalls.modelRequired`（en 逐字、zh「需要模型，请先选择模型再发送请求。」）

同簇另接 `app/chat/page.tsx` catch 分支的 `content: "[Something went wrong. The partial response has been saved.]"`（新增 `chat.page.partialResponseSaved`，en 逐字含方括号、zh「[出现错误，部分回复已保存。]」，方括号保留以维持原消息形状）。相邻的 `accumulatedContent + " [stopped]"` 判保留不译：它是 `ChatMessages.tsx` 与本页之间的协议标记（读取方按字面 `endsWith("[stopped]")` 匹配后剥离、再渲染 `chat.messages.stopped`），译它会破坏匹配

验证：responses_api.test 加 playground `llm_calls` 目录四文件与 `app/chat/page.integration.test` 合 6 文件 36 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 四源文件 HEAD 26=工作 26（全既有 warning，chat/page.tsx 的 max-depth 债与本簇无关）；prettier 四文件 clean；`npm run build` exit 0；叶子 +3 至 11449、中英同值 141

`app/chat/page.tsx` 的 `handleSend` useCallback 依赖数组按 eslint exhaustive-deps 补 `t`（next-intl 的 t 引用稳定，加进 deps 无环）

## 2026-10-20 第 395 簇更新

开「共享件 aria/placeholder 模板里的硬编英文词」维度：此前各口径只扫属性字面量本身（`aria-label="Clear"` 形态），未覆盖模板串里内嵌的英文动词（`aria-label={`Clear ${x}`}`）与按条件拼出的英文句子，这类命中散在共享组件的模板表达式里，既非 JSX 文本节点也非裸属性值，前几条口径都抓不到

接六枚：`policies/_components/index.tsx` 的 `DismissibleAlert` 关闭按钮 `aria-label={`Dismiss ${title}`}`（新增 `policies.dismissAlert` = "Dismiss {title}" / zh「关闭 {title}」，组件内加 `useTranslations("policies")`）；`EntityUsageExport/UsageExportHeader.tsx` 的清除按钮 `aria-label={`Clear ${filterLabel ?? "filters"}`}`（新增 `entityUsageExport.clearFilter` = "Clear {label}" / zh「清除 {label}」与 `filtersLabel` = "filters" / zh「筛选条件」，后者兜底原硬编的 "filters"）；同文件空态占位 `No ${entityType}s with usage in this range` 改 `t("noUsageInRange", { entity: t(`entityNames.${entityType}`) })`（新增 = "No {entity}s with usage in this range" / zh「此区间没有{entity}的使用数据」，en 侧经 entityNames 复数拼接后与原句逐字相同）；`ExportSummary.tsx` 的筛选计数 `· ${n} filter${n > 1 ? "s" : ""}` 改 `t("filterCount", { count })`（新增 = "{count, plural, one {# filter} other {# filters}}" / zh「{count} 个筛选条件」，zh 侧不用 plural 以避 ICU 复数在中文下的退化）；`MCPNetworkSettings.tsx` 的网段删除按钮 `aria-label={`Remove ${range}`}`（新增 `mcpServers.networkSettings.removeRange` = "Remove {range}" / zh「移除 {range}」）

顺带修一条 zh 侧未译值：`entityUsageExport.entityNames.agent` 的 zh 值是英文 "Agent"，而 GLOSSARY 定译为「智能体」、同项目 `usage.entity.type.agent` 已是「智能体」。该键被 `noUsageInRange` 与 `EntityUsageExportModal` 的标题/成功 toast 消费，留英文会让新句与旧句都带英文实体名，故一并改为「智能体」。存量分歧按 GLOSSARY 不批量回改的原则只改这一条新键直接依赖的

测试翻面：UsageExportHeader.test 四处（空态占位三处 + 清除按钮 accessible-name 一处）、ExportSummary.test 三处（复数计数两处 + 否定断言一处）、MCPNetworkSettings.test 两处（网段删除按钮 accessible-name）翻为对应中文。另注意 `clearFilter` 的 zh 值写成「清除 {label}」带空格，与 en 侧 "Clear {label}" 的词间距对齐

验证：EntityUsageExport 目录 5 文件 28 例、policies index.test、MCPNetworkSettings.test 合 33 例，加 i18n 守卫 9 例全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 四源文件 HEAD 13=工作 13（全既有 warning，含 MCPNetworkSettings 的 any 与 exhaustive-deps 债）；prettier 两文件 HEAD 既存脏、其余 clean（policies index.tsx 与 MCPNetworkSettings.tsx 的脏区系既有非本簇行，按 HEAD-clean 规则不动）；`npm run build` exit 0；叶子 +6 至 11446、中英同值 141（`entityNames.agent` 改译不增同值，因 en 侧本就是 "agent"）

本维度首扫接净六枚，剩余命中待后续逐文件读判

## 2026-10-20 第 394 簇更新

按「同族姊妹文件已接、同文件仍写死英文」的口径普查 cost-tracking 域，接 `provider_margin_table.tsx` 的 `SimpleTable` 三枚列头。该组件的列定义把表头直接写死英文串 `header: "Provider"` / `"Margin"` / `"Actions"`，而同目录的姊妹文件 `provider_discount_table.tsx` 早已走 `t("colProvider")` / `t("colActions")`，即同一功能域两张表一张中文化一张留英文、用户在加成配置页仍见三枚英文列头。根因是第 312 簇接该文件行操作 aria-label 时只改了 aria 侧，表头走 `SimpleTable` 的 `header: string` 属性、不在 aria/文本两条扫描口径的命中面上，直到本簇按姊妹文件对照才检出

接线：`Provider` 复用既有 `costTracking.colProvider`、`Actions` 复用既有 `costTracking.colActions`（两键在姊妹文件已在用、值逐字相同），`Margin` 目录无对应键故新增 `costTracking.colMargin`（en 逐字 "Margin"、zh「加成」，与同命名空间既有 `marginFee`「加成费用」、`marginTitle`「费用/价格加成」用词一致）。组件顶层已有 `const t = useTranslations("costTracking")`，三处列头直接改 `t(...)` 即可，caller 与数据流零改动

测试翻面：`provider_margin_table.test.tsx` 第 46-50 行五条 `getByRole("columnheader", { name: "Provider" })` 等英文断言改为对应中文（提供方/加成/操作），与姊妹文件 `provider_discount_table.test.tsx` 早已是中文断言的形态对齐。这类断言原是组件裸英文的泄漏信号（zh 默认 locale 下靠英文命中才绿），翻面后即成 zh 断言

验证：provider_margin_table.test 21 例加 i18n 守卫（missingKeys 1、messagesParity 8）全绿；tsc 全仓 883 与 HEAD 同数、非测试文件零错；eslint 该文件 HEAD 1=工作 1（唯一 warning 是 57 行既有 `local/no-long-condition-chain`、非本簇引入）；prettier 两文件 clean；`npm run build` exit 0；叶子 +1 至 11440、中英同值 141、覆盖率口径不变（本文件早已接入）

## 2026-10-20 第 393 簇更新

续第 392 簇回退的 leftnav 侧栏组头收尾。798 行 `<SidebarGroupLabel>` 五枚组头（AI GATEWAY/OBSERVABILITY/ACCESS CONTROL/DEVELOPER TOOLS/SETTINGS）此前直接渲染 `group.groupLabel` 英文串，改走 `navT(navMessageKey(SECTION_DISPLAY[...] ?? ...))`，复用 breadcrumb 早已使用的同五枚 nav 键（AI 网关/可观测性/访问控制/开发者工具/设置），零新键。

关键在 zh-collision：SETTINGS 组头译文「设置」与 Settings 子菜单可展开 toggle 项译文同为「设置」，`leftnav.test.tsx` 两处 `getByText("设置")` 撞多匹配。修法是把断言按 DOM 角色收窄而非放宽——组头是静态 `<div>`（`SidebarGroupLabel` forwardRef 到 div），菜单项是 `<a>`/`<button>`。207 行 top-level tabs 遍历改用 `getAllByText(label).find((el) => el.closest("a,button"))`、558 行展开遍历改用 `getAllByText(group).find((el) => el.closest("button"))` 命中 toggle，二者仍是强断言（项若缺失即失败，只是不再误命中组头）。leftnav 41 例、parity/missingKeys 9 例全绿，五件套通过。

## 2026-10-20 第 392 簇更新

开「已接入 `.tsx` 文件内部多行 JSX 文本」盲区：前几轮的 JSX 文本扫描只覆盖裸属性值与 toast 首参，多行 `<span>` 包裹内的硬编英文标签一直漏网。用 Python 按 JSX 区段扫描定位 `leftnav` 两枚 Badge 项 `Model Leaderboard`/`ROI Calculator`（同文件 253/276 行兄弟项走 `<span data-i18n="nav.x"/>` 约定、唯此二枚直接写死英文），按该约定接 `nav.modelLeaderboard`/`nav.roiCalculator` 两键，`npm run build` 与 leftnav.test 50 例全绿。

同簇另试把侧栏分组标题（798 行 `{group.groupLabel}`）改 `navT(navMessageKey(SECTION_DISPLAY[group.groupLabel] ?? group.groupLabel))` 一次接五枚 groupLabel，跑测试后 `leftnav.test.tsx` 两处 `getByText("设置")` 撞上 SETTINGS 组头（组头译文与某项译文同为「设置」）触发 zh-collision 多匹配。判定此改动须同时把测试改成 `getAllByText`/按 link-role 收窄 scope，与本簇两枚 Badge 标签的安全子集性质不同，故回退 groupLabel 改动、另立第 393 簇连测试一起处理。

## 2026-10-20 第 391 簇更新

把 390 列的 a2a 专项里「低风险可即接」的流式硬编回退子集接掉。390 顾虑的是整件重构的无测试流式路径，但细查后两枚硬编回退只需碰一个函数（流式 `makeA2AStreamMessageRequest`，唯一 caller 是 CompareUI）即可，且非流式函数（109-229）的 throw 全是 server-detail/jsonRpc/`HTTP ${status}` 动态透传（不接），故本簇把范围收窄到流式硬编回退两枚，风险可控、可验证

接线：给 `makeA2AStreamMessageRequest`（242）加首参 `t: PlaygroundTranslator`（import 同兄弟函数约定），CompareUI:584 调用处前插其 `useTranslations("playground")` 的 `t`（637 行已用同 t、作用域内）；:296 `throw new Error("No response body")` 复用现成 orphan `t("llmCalls.a2a.noResponseBody")`（清一 orphan、en 逐字、zh 无响应体）、:384 `chunk.error.message || "Unknown A2A error"` 接新键 `t("llmCalls.a2a.unknownA2AError")`（en 逐字、zh 未知 A2A 错误）

`includes("JSON")` 安全性专项论证（390 列的头号顾虑）：流式内层 catch(387) 的 `if (parseError instanceof Error && parseError.message && !parseError.message.includes("JSON")) throw parseError` 用 message 是否含 "JSON" 子串区分「原生 JSON.parse 抛的解析错误（吞掉续读）」vs「业务 throw（上抛）」。本簇两枚新串 "No response body"/"Unknown A2A error"（zh "无响应体"/"未知 A2A 错误"）均不含 "JSON"，而真正依赖该子串的解析错误 message 来自运行时 `JSON.parse`、从不经过我的本地化，故判别逻辑逐 locale 行为不变

验证：a2a 全仓无单测，改以 tsc 校签名位移（caller 漏传 t 即编译错，883 持平）+ caller 回归——CompareUI.test + ChatUI 全 13 个 playground 测试共 168 例全绿（含 CompareUI 走 requestPromise 的流式/非流式分支）、messagesParity/missingKeys（a2a +1、noResponseBody 复用不增键）绿；eslint stdin a2a HEAD 33=工作 33、CompareUI 13=13 持平既有债；prettier clean；`npm run build` exit 0；叶子 +1 至 11437、中英同值 141。a2a 专项流式硬编回退子集接净、`a2a.noResponseBody` orphan 清零，余 a2aError/httpError/errorMessage 动态透传型维持保留

承 389「a2a 另簇」的边界，本簇追实 a2a_send_message 可达可见漏出但判作专项重构入判定账、不强推

经核 `a2a_send_message.tsx` 全文 `t(` 调用、`useTranslations`/`Translator` import 皆为零——两个导出函数 `makeA2ASendMessageRequest`（109，ChatUI:1145 调）与 `makeA2AStreamMessageRequest`（242，CompareUI:584 调）均不收 translator，故 389 想「复用 orphan」的设想不成立：`llmCalls.a2a.{httpError,a2aError,noResponseBody,errorMessage,jsonParseError}` 五键全是设计留位的 unused orphan。a2a 内可达可见英文确证存在（:296 `throw "No response body"`、:384 `chunk.error.message || "Unknown A2A error"` 经各自 caller 的 `String(error)`/`parseErrorMessage` 漏出 ChatUI:1160/CompareUI:637 嵌已译气泡/toast），但接它需整件重构：给两函数加首参 `t`、贯穿两 caller（CompareUI 调用 10+ 位置参数、加 t 致位移需逐个对位）、谨慎区分 server-detail/jsonRpc/`HTTP ${status}` 三型动态透传（那些非硬编、属后端串不接）、且流式内层 catch 的 `!parseError.message.includes("JSON")`（389 行）判别依赖 thrown message 是否含 "JSON" 子串来分「解析错误 vs 真错误」——本地化若误伤该子串会改流式错误处置；加之 a2a 全仓无单测、无安全网

判定：这是「设计留位未接」的整件专项重构（同 382 前 networking throw-fallback 当初被列阻塞片的性质，但 a2a 更碎、无测试、含 JSON 判别敏感逻辑），按「execute with care」与无验证不轻动流式错误路径的原则，列 `下一步优先级` 专项，本簇纯判定零新键、叶子维持 11436

至此组件内 error-fallback 维度的「同函数 catch 即漏」与「try-外守卫传 caller 经 String(error) 漏」两类可达可见者在 387-389 接净，「caller 仅 console/置空吞」（fetch_agents/prompts-utils/UITheme 本地化吞）与「JSON 判别敏感无测试流式重构」（a2a）两类明确入判定账

playground llm_calls error-fallback 续片，把「漏/吞」判据用到 try-外守卫 throw（传 caller）与 try-内 throw（同函数 catch）两类，并优先复用既有 orphan 键

漏出四枚接净：其一 `if (!accessToken) throw new Error("Virtual Key is required")` 守卫在三个模块函数（`makeOpenAIEmbeddingsRequest`/`makeInteractionsRequest`/`makeAnthropicMessagesRequest`）的 try 之前抛、不被本函数 catch 捕，但 caller `ChatUI.tsx:1156` catch 做 `updateTextUI("assistant", t("chat.errorFetching", { error: String(error) }))` 把 propagated thrown message 作 `{error}` 嵌已译气泡文本露出，故三枚守卫改 `t("llmCalls.virtualKeyRequired")`——该键早成 orphan（`llmCalls.virtualKeyRequired`="Virtual Key is required"），复用即清零、0 新键、en 逐字同。其二 `audio_transcriptions.tsx:54` try 内 `throw new Error("No transcription text in response")` 经同函数 catch（56-69）`error.message → t("llmCalls.audioTranscriptionFailedToast", { error: errorMessage })` 漏，改新键 `t("llmCalls.noTranscriptionText")`（en 逐字、zh 响应中无转录文本）

测试面：embeddings/interactions/anthropic_messages/audio_transcriptions 四测试皆 `createTranslator({ locale: "en", messages: en, namespace: "playground" })` 构 t，故 `t("llmCalls.<key>")` 返回 en 逐字同旧 literal，`audio_transcriptions.test:118 .rejects.toThrow("No transcription text in response")` 仍绿、零翻面；三守卫测试本就以有效 token 调用、不断 guard 文案

判保留：`a2a_send_message.tsx:296 throw new Error("No response body")` 在 try(278)-内、但 catch(409) 仅 `console.error + throw error` re-throw（不 toast），漏出与否取决于 a2a caller（流式双函数复杂），另簇追 caller 后接（`llmCalls.a2a.noResponseBody` orphan 现成留待）；`fetch_agents.tsx:56 "Failed to fetch agents"` 与 `prompts/utils.ts:219/225 dotprompt 解析` 经核 caller（ChatUI/CompareUI loadAgents）仅 `console.error`+置空、吞 thrown，不可达可见入判定账；`AgentBuilderView:330 setDraftSystemPrompt("You are a helpful assistant.")` 系喂 LLM 的默认 system prompt（模型输入非 UI 文案）判保留

验证：messagesParity/missingKeys（llmCalls +1、virtualKeyRequired 复用不增键）+ 四 llm_calls 测试 六文件 24 例全绿、无 type error；tsc 全仓 883；eslint stdin 四源文件 HEAD=WORK（embeddings 5、interactions 8、anthropic 10、audio 8，持平既有债）；prettier clean；`npm run build` exit 0；叶子 +1 至 11436、中英同值 141。playground error-fallback 续片接净、orphan `virtualKeyRequired` 清零，余 a2a 流式另簇

续组件内 error-fallback 维度，攻 playground `llm_calls/` 三个模块函数（首参 `t: PlaygroundTranslator`，同 325 簇同型）。这些函数体内 try 中的响应形状失败 `throw new Error("English")`，被同函数 catch 的 `toast.fromError(t("llmCalls.errorX", { error: String(error) }))` 作 `{error}` 嵌进已译句露出（漏型，承 382-386 的 String(error) 插值判据）。逐个核 throw 是否在 catch 的 try span 内——是则接，否（守卫在 try 外抛出、传 caller）判保留

接四枚：`makeOpenAIEmbeddingsRequest` "No embedding returned from server"、`makeInteractionsRequest` "No response body received"、`makeOpenAIImageGenerationRequest` 两枚 "No image data found in response"/"Invalid response format"，各改 `throw new Error(t("llmCalls.<key>"))`、加 `playground.llmCalls` 四键（en 逐字、zh 服务器未返回嵌入向量/未收到响应体/响应中未找到图像数据/响应格式无效；嵌入/图片循目录既有 llmCalls 译法）

判保留：三函数首行 `if (!accessToken) throw new Error("Virtual Key is required")` 守卫在 try 之前抛、不被本函数 catch 捕（catch 的 try 起于请求段），thrown 串传 caller，本簇不动（且 `llmCalls.virtualKeyRequired`/`llmCalls.a2a.noResponseBody` 两键现成 orphan，待后续片按需接 caller 显示点）；a2a_send_message 流式 throw 多带 server detail/JSON-RPC message/HTTP status 透传（非硬编回退）与双 catch 复杂度，audio_transcriptions 有直接 `.rejects.toThrow("No transcription text in response")` 断言，二者另簇处理

验证：messagesParity/missingKeys（llmCalls +4）+ embeddings_api.test + interactions_api.test 四文件 15 例全绿、无 type error（两测试 mock `@/lib/toast`、仅断 fetch/updateUI 不触 throw 文案，image_generation 无测试）；tsc 全仓 883；eslint stdin 三源文件 HEAD=WORK（embeddings 5、interactions 8、image_generation 5，持平既有债）；prettier clean；`npm run build` exit 0；叶子 +4 至 11435、中英同值 141。组件内 error-fallback 维度 playground 片接净，余 Virtual Key 守卫/a2a/audio 待续片

承 385/386 的「漏/吞」判据，新开「React 组件内 error 回退/已显示英文字面量」维度，扫全 `src` 非 networking/hooks 的 `throw new Error("English")`、`|| "English"` 回退、`setX("English")` 直接 display 串，逐个追显示路径定性

判保留四组（不可达可见或死码）：`ui-theme/UIThemeSettings.tsx` 80/112 两 `throw new Error("Failed to update settings"/"Failed to reset")`——caller 同文件 84/116 catch 做 `toast.fromError(t("themeUpdateFailed"))`/`t("themeResetFailed")` 用本地化自造句、从不嵌 error.message（同 networking getGuardrailInfo 吞型），thrown 英文死码；`view_logs/LogDetailContent.tsx` 111 `errorInfo.error_message || "An error occurred"` 落在 `getFormattedResponse` 造的 `{error:{message,type:"error",code:"unknown"}}` JSON-shaped API 响应对象（仿 LLM API 错误形状、在代码/JSON 查看器渲染，同 349 数据语料判保留）、真错误文本是 332 行 server 的 `errorInfo.error_message`；`view_users.tsx` 245/270 `throw new Error("Access token required")` 与 `keyExpiryUtils.ts` 49/68 `"Invalid duration format"` 系鉴权前置/解析程序异常逻辑哨兵（非客户可读、走开发者路径）

接净漏出（OnboardingForm 组件内直接 display）：`app/onboarding/OnboardingForm.tsx` 44 `setClaimError("Failed to start session. Please try again.")`（成功回调无 token 分支）与 57 `setClaimError(error.message || "Failed to submit. Please try again.")`（onError 回落），二者经容器传 prop、`OnboardingFormBody` `<AlertTitle>{claimError}</AlertTitle>` 渲染、邀请注册页真用户可见。容器无翻译器但路由有 intl（page/body/error 全用 `useTranslations("onboarding")`），故容器加 `useTranslations("onboarding")`、两串接 `startSessionFailed`/`submitFailed`（en 逐字同旧 literal、zh 会话启动失败，请重试。/提交失败，请重试。）

测试面：`OnboardingForm.test.tsx` 七处裸 `render(<OnboardingForm/>)` 因容器新增 hook 必须包 provider，全迁 `renderWithProviders`（test-utils，钉 zh-CN），唯一断 translated 文本的 line185 从 `toHaveTextContent("Failed to start session")` 翻「会话启动失败」；其余断言（loading-view/error-view/form-body data-\* 属性/sessionStorage/cookie path）与 locale 无关不动；`OnboardingFormBody.integration.test` 渲的是 body 组件、早已 renderWithProviders，不受容器改动波及；body.test `claimError="Something went wrong"` 传 prop 非 translated、保留

验证：messagesParity/missingKeys（onboarding +2 键）+ OnboardingForm.test + body.test + body.integration 五文件 31 例全绿、无 type error；tsc 全仓 883；eslint stdin OnboardingForm.tsx HEAD 3=工作 3（新增 hook 不增债、React Compiler 不扰）、test 0=0；prettier 两文件 clean；`npm run build` exit 0；叶子 +2 至 11431、中英同值 141。组件内 error-fallback 维度开启，可达可见者按簇甄别推进中

把 385 簇确立的「漏/吞」判据用到第 3791 行 `下一步优先级` 早先笼统记为「`|| "Failed..."/"An error occurred"` 与 handleError 同属高扇出判定账不翻」的 hooks error-fallback 队列，逐个追 useMutation 消费方 catch 后翻案：多数并非「吞」而是「漏」，故接净

漏判据在 hooks 的具体形态：`onError: (error) => toast.error(error?.message || t("failedToast"))` 里 error.message **恒真**（hook 必 `throw new Error(带 message)`），所以本地化 `t("failedToast")` 回落成死码、thrown 英文（含服务器 detail 或硬编回退）恒露出；`toast.fromError(t("prefix") + parseErrorMessage(error))` 与 `t("x", { error: parseErrorMessage(error) })` 里 `parseErrorMessage` 取 error.message 拼进已译句、同样露出；`setToolsError(resp.message || "English")` 经组件 `externalError`/`toolsError` prop 渲染。三型皆为「漏」，须接

本簇接六枚：`useCloudZeroDryRun`("Failed to perform dry run")、`useCloudZeroExport`("Failed to export data")、`useCloudZeroCreate`("Failed to create CloudZero integration")（三者经 CloudZeroIntegrationSettings/CloudZeroCreateModal 的 `error?.message||t(...)` 露出，且 CloudZero dryRun 的 zh `cloudZero.dryRunFailedToast`="试运行失败" 早被遮蔽）、`useStoreModelInDB`("Failed to update model storage settings"，caller ModelSettingsModal `t(...)+parseErrorMessage`)、`useStoreRequestInSpendLogs`("Failed to update spend logs settings"，caller LoggingSettings `t({error: parseErrorMessage})`)、`useTestMCPConnection`("Failed to retrieve tools list"，CreateMCPServer 渲染)。各 `|| toastMessage("<key>")`、`@/lib/toast` 加 import、toast 命名空间加六键（en 逐字、zh 试运行/导出数据/创建 CloudZero 集成/更新模型存储设置/更新花费日志/获取工具列表 失败，Spend→花费循 GLOSSARY、CloudZero/MCP 品牌保留）

测试面关键：dryRun/export/create/storeModelInDB 四 hook 单测**直接断 `error?.message === 英文回退`**，但 hook 测试用裸 `renderHook`（非 renderWithProviders、不挂 LocaleProvider），jsdom `documentElement.lang` 空→`toastMessage` 走 DEFAULT_UI_LOCALE=en 回退、返回逐字同旧英文，故四断言全绿零翻面（桥设计自证：en 缺省恒等、生产 zh 才变中文），83+47 例全过；useTestMCPConnection/useStoreRequestInSpendLogs 无直接单测、消费方 CloudZero/Logging/ModelSettings 测试全 mock 钩子不破

甄别余量：`parseErrorMessage` 自身 `!error → "An unknown error occurred"` 与 caller 传 `t(...)` 串（toast.fromError 内部已本地化 title）非 hook thrown、不属本队列；余 network 类 `throw new Error("Access token is required")` 等属逻辑哨兵/鉴权前置判保留。hooks error-fallback 队列可达可见者本簇清零

验证：messagesParity/missingKeys（toast +6）+ toast.test + 四 hook 单测 + 四消费方组件测试 全绿、无 type error；tsc 全仓 883；eslint stdin 六 hook HEAD=WORK（dryRun/export/create 各 4、storeModel/storeRequest 各 3、useTestMCPConnection 11，持平既有债）；prettier 六文件 clean（仅 storeRequest 一行逾 120、按 HEAD-clean 规则拆行，余五枚未破不重排）；`npm run build` exit 0；叶子 +6 至 11429、中英同值 141。hooks error-fallback 队列按漏/吞判据收口

续 Category-B 逐个核 caller 显性（承 384 甄别法），本簇把 networking 余下全部裸 `throw new Error("Failed to X")` 运营句定性收口，确立「漏 vs 吞」判据：caller catch 若以 `String(error)`/`error.message`/`error` 把 thrown message 嵌进已译 toast 插值（`{error}`/`{reason}`）即「漏」、英文露出、须接；若 caller 仅 `console.error(error)` 吞之、或用 `toast.error(t("..."))`/`toast.fromError(t("..."))` 传本地化 caller 自造句而不嵌 error，即「吞」、thrown 英文不可达可见、判保留（接了也是死码、无显示路径）

「漏」接净三枚：`keyCreateForAgentCall`（950）thrown 经 `add_agent_form.tsx:444-445` `errorMessage=error.message` 嵌进 `t("createAgentFailedReason",{reason})`；`updateGuardrailCall`（6197）经 `CustomCodeModal.tsx:359-362` `message=error.message` 嵌进 `t("custom.updateFailed",{error})`（注：`guardrail_info.tsx` 那路 caller 是吞的，取「至少一路漏」即接、对吞路 neutral）；`validateBlockedWordsFile`（6375）经 `ContentFilterConfiguration.tsx:200` `String(error)` 嵌进 `t("filter.uploadFailed",{error})`。各改 `toastMessage("<key>")`、加 `toast.createKeyForAgentFailed`/`updateGuardrailFailed`/`validateBlockedWordsFileFailed`（en 逐字、zh 为智能体创建密钥失败/更新护栏失败/校验屏蔽词文件失败，护栏/智能体循 GLOSSARY）

「吞」入判定账八枚（逐个核 caller 后确证不可达可见）：`getProviderCreateMetadata`(434)、`getAgentCreateMetadata`(478)（caller `agent_info.tsx:108`/`add_agent_form.tsx:184` 全 console.error）、`getGuardrailInfo`(6119，`guardrail_info.tsx:184` `toast.fromError(t("info.loadFailed"))` 不嵌 error)、`getGuardrailProviderSpecificParams`(5972) 与 `getGuardrailUISettings`(5944)（`guardrail_info.tsx:197/207` console-only）、`getAgentInfo`(6083，`agent_info.tsx:147` `toast.error(t("loadInfoFailed"))`)、`patchAgentCall`(6161，`agent_info.tsx:261` `toast.error(t("updateFailed"))`)、`getAgentsList`(6057，9 caller 全 useQuery `.catch(console)`/`setAgents([])` 空态、无嵌 error)

至此 networking「throw-fallback 多调用点队列」全队列收口：Category-A `|| "Failed to X"` 回退（382/383 接净）与 Category-B 裸 throw（384 email 三枚 + 385 漏三枚接净、吞八枚入账）全部定性，无遗留可达可见英文。`"Failed to parse X: "+error` 拼接系内部诊断维持保留（382 边界已记）

验证：messagesParity/missingKeys（toast +3 键）+ toast.test + ContentFilterConfiguration/CustomCodeModal/add_agent_form 三 consumer 测试 六文件 68 例全绿、无 type error（consumer 全 mock 网络函数、thrown 文案测试不执行）；tsc 全仓 883；eslint stdin networking HEAD 327=工作 327 持平；prettier networking clean（JSON 双侧 HEAD 本就非 clean、不回改）；`npm run build` exit 0；叶子 +3 至 11423、中英同值 141。Category-B 定性收口、漏吞判据确立

throw-fallback 队列进入 Category-B（无 `||` 回退、裸 `throw new Error("Failed to X")` 运营句）。此类需逐个核 caller 显性，确立甄别法：追到组件 catch，看它是否 `toast.fromError(error)`/`toast.error(error.message)` 把 thrown message 作 UI 露出——是则可达可见、接之正确或中性；若 caller 仅 `console.error` 吞掉或 catch 后渲染不含 message 的兜底 UI，则不可见、判保留不接

本簇接 email event settings 三枚：`getEmailEventSettings`/`updateEmailEventSettings`/`resetEmailEventSettings` 的 `throw new Error("Failed to … email event settings")`。追 caller `email_event_settings.tsx` 三 handler 全 catch 后 `toast.fromError(error)`，thrown message 作第二条 toast 的 description 露出（前一条是 `handleError(errorData)` 透传的服务器 detail），故可达可见。改 `toastMessage("<key>")`、加 `toast.getEmailEventSettingsFailed` 等三键（en 逐字、zh 获取/更新/重置邮件事件设置失败）。函数体内同串的 `console.error("Failed to …")` 是开发者日志非 UI、维持不动；`email_event_settings.test` 全 mock 三网络函数（返回值桩定），thrown 文案在测试不执行、`grep` 亦无断英文，零翻面

甄别边界（Category-B 余量，逐个显性待核后续片）：provider/agent config load 434/478/950、guardrail UI params/provider params/info/update 5944/5972/6119/6197、agents list/info/patch 6057/6083/6161、blocked words validate 6375，需追各 caller 确认是否 toast.fromError/直接显示 message；`"Failed to parse metadata/tpm/rpm: "+error` 拼接系内部诊断维持保留

验证：messagesParity/missingKeys（toast +3 键）+ toast.test + email_event_settings.test 四文件 51 例全绿、无 type error；tsc 全仓 883；eslint stdin networking HEAD 327=工作 327 持平；prettier networking clean（JSON 双侧 HEAD 本就非 prettier-clean、历史大文件 delta、不回改）；`npm run build` exit 0；叶子 +3 至 11420、中英同值 141。Category-B 可达可见首三枚接净、逐个核显性法确立

续 networking「throw-fallback 队列」第二片，口径沿用第 382 簇：回退句在模块内部生成（`throw new Error(… || "English")` 或 `return { message: … || "English" }`），caller 已 t 包裹或直接 toast，故就地 `|| toastMessage("<key>")` 即接净、caller 零改、显示零翻面

本簇接八枚 `|| "Failed to X"` 回退运营句：`teamMemberAddCall`（2789）与另一 `teamMemberAdd` 变体（2921）的 `parsedError?.detail?.error || "Failed to add team member"`（两处同句、复用 `toast.addTeamMemberFailed` 同键）、`teamBulkMemberAddCall`（2847）"Failed to bulk add team members"、`fetchMCPTools`（5171，"never throws" 契约返回 `message`）"Failed to fetch MCP tools"、`cacheMCPServer`（6718）"Failed to cache MCP server"、`registerOAuthClient`（6753）"Failed to register OAuth client"、`storeOAuthCredential`（7752）/`revokeOAuthCredential`（7783）`detailMsg || "Failed to (store|revoke) OAuth credential"`。加 `toast` 七键（add/bulk-add/fetchMCPTools/cacheMCPServer/registerOAuthClient/storeOAuthCredential/revokeOAuthCredentialFailed，en 逐字同旧回退，zh 按 GLOSSARY：MCP 服务器、OAuth、凭据、团队成员保留既有译法）。`grep` 确无测试断这八条英文；消费方测试全 mock 网络函数（返回值桩定），本簇只动函数体内回退支不破断言，零翻面

甄别边界：余 networking `throw new Error("Failed to X")` 纯字面运营句（provider/agent config load 434/478/950、email event settings get/update/reset 5751/5778/5804、guardrail UI/provider params/info/update 5944/5972/6119/6197、agents list/info/patch 6057/6083/6161、blocked words validate 6375）列入续片，但需逐个核 caller 是否 catch 后显性显示（部分可能仅 console/吞掉，非可见即不必接，按"可达可见"口径处理）；`"Failed to parse metadata/tpm/rpm: "+error` 拼接系内部诊断（含运行时插值、开发者文案）维持保留

验证：messagesParity/missingKeys（toast 命名空间 +7 键）+ toast.test + MCPToolPermissions.test + TeamInfo.test 五文件 206 例全绿、无 type error；tsc 全仓 883；eslint stdin networking HEAD 327=工作 327 持平既有债；prettier networking clean（en/zh JSON 双侧 HEAD 本就不 prettier-clean，系历史大文件 delta，非本簇引入，不回改）；`npm run build` exit 0；叶子 +7 至 11417、中英同值 141。throw-fallback 队列续片接净，余 Category-B 运营 throw 待逐个核显性

开 networking「throw-fallback 多调用点队列」——第 378/381 簇列为续片的最后一面。核显性证据定口径：`VectorStoreForm.tsx:279` catch 做 `toast.fromError(t("createErrorToast", { error: String(error) }))`，即调用方把 thrown 消息作 `{error}` 嵌进已译句里显示，thrown 的 `error.detail || "Failed to X"` 回退支在服务器无 detail 时以英文露出。关键同前两片——这些串在模块内部 throw、非 caller 传，故就地用第 381 簇 `toastMessage(key)` 包回退支即接净，caller 零改、显示零翻面（caller 已 t 包裹）

本簇接向量存储/RAG 六枚：`vectorStoreCreateCall/ListCall/DeleteCall/InfoCall/UpdateCall` 与 `ragIngestCall` 的 `|| "Failed to (create|list|delete) vector store"/"...get...info"/"...update..."/"Failed to ingest document"`，各改 `|| toastMessage("<key>")`，加 `toast.createVectorStoreFailed` 等 6 键（en 逐字同旧回退、zh 创建向量存储失败…导入文档失败）。throw 消息非 UI 直显（caller 插值包裹），但本地化回退支使最终 toast 全中文，属正确改进；`grep` 确无测试断这些英文 throw 文案，零翻面

甄别边界：generic 内部诊断 throw（"Network response was not ok"、"No response body"、"Must provide either userIds…"、`"Failed to parse X: "+error` 拼接）属开发者/程序异常非客户可读文案，且部分含运行时插值，判保留不接（见 PROGRESS 后续仍剩的 throw 多为该类或需逐调用方核显性的运营句）。本簇只接纯回退运营失败句一片，余 MCP/agent/guardrail/email/team-member 同型句列入续片

验证：messagesParity/missingKeys（含 toast 命名空间新增 6 键）+ `vector-stores/` 全 15 文件 122 例全绿（控制台见「未找到…」类中文露出证桥在 zh provider 生效）；tsc 全仓 883；eslint stdin networking 325=325 持平既有债；prettier clean；`npm run build` exit 0；叶子 +6 至 11410、中英同值 141。throw-fallback 队列首片接净、口径与边界确立，余运营句续片（非全 dead，部分 caller 显性需逐个核）

## 2026-10-20 第 381 簇更新

复用第 380 簇的 DOM-lang+消息目录桥，接净最后两片高扇出阻塞：`handleError` 与 `copyToClipboard` 失败支。关键同理——两处的英文串皆在模块**内部**生成、非调用方传入，故 caller 零改

- `networking.tsx` 的 `handleError`（~100 caller 但不收译员）唯一硬编 UI 句 `toast.info("UI Session Expired. Logging out.")` 改 `toast.info(toastMessage("sessionExpired"))`，加 `toast.sessionExpired`（en 逐字、zh 会话已过期，正在退出登录。）
- `utils/dataUtils.ts` 的 `copyToClipboard` catch 支 `toast.fromError("Failed to copy to clipboard")`：第 380 簇后 fromError 的 title 已本地化（generic→错误），唯 description=该串仍英文，改 `toast.fromError(toastMessage("copyFailed"))`，加 `toast.copyFailed`（en 逐字、zh 复制到剪贴板失败）。成功支 `messageText` 默认由第 367-369 簇 caller 侧接 `common.copiedToClipboard` 已覆盖，本簇不动其默认（避免重开 58 caller 与组件测试面）

桥泛化：`toast.ts` 把第 380 簇的 `errorTitle` 更名导出为通用 `toastMessage(key)`（同读 `documentElement.lang`、同 `toast` 目录）、`ERROR_TITLE_CATALOG`→`TOAST_MESSAGES`，handleError/copyToClipboard 各自 import 它

测试侧关键修正：全局 `tests/setupTests.ts` 与 `tests/setup.unit.ts` 的 `vi.mock("@/lib/toast")` 工厂只给 `toast`、缺新导出 `toastMessage`，致 dataUtils/networking 在测试里 `toastMessage` 未定义而抛。改 `vi.mock(..., async (importOriginal) => ({ ...await importOriginal(), toast:{...vi.fn} }))` 部分 mock：保留真实 `toastMessage`、仍桩 `toast` 供断言。unit jsdom 下 `documentElement.lang` 空→toastMessage 回退 en，故 `dataUtils.test` 两处 `toHaveBeenCalledWith("Failed to copy to clipboard")` 仍绿（零翻面）；无测试断 session-expired 句

验证：dataUtils+toast+parity+missingKeys 全绿；`src/components`+`src/app`+`src/utils`+`src/lib` 全量 871 跑 867 绿、4 红逐文件即既往入判定账的已知假失败（cost_tracking 60s 超时、LensSetup 时区、add_auto_router/KeyActivityPanel 并发假失败），`TZ=UTC --no-file-parallelism` 单跑那 3 个 130 例全绿证实系并发假失败、本簇全局 mock 改动零新增回归；tsc 全仓 883；五文件 eslint stdin 与 HEAD 完全持平（networking 325=325、dataUtils 3warn=3warn、setupTests 4=4 皆既有债、toast/setup.unit clean）；prettier 全 clean；`npm run build` exit 0；叶子 +2 至 11404、中英同值 141。三片高扇出阻塞 toast.fromError（380）、handleError+copyToClipboard 失败支（381）全部接净，无遗留待接可见英文面

## 2026-10-20 第 380 簇更新

承第 379 簇色彩解耦，正式接净 toast.fromError 高扇出阻塞片——错误 toast 标题本地化。关键发现修正旧账：fromError 的 title 非 345 调用方传入（它们只喂 error 对象），而是模块内 `describeError→titleFor` 据 status/proxyType 查表生成，故本地化 title **无需触碰任何调用点**，此前记的「贯穿需改全部调用点」对 title 面不成立（仅 description=server 透传 error 文本，不在本地化范围）

做法：新增顶层 `toast` 命名空间 11 键（budget/rateLimit/service/auth/forbidden/notFound/validation/request/conflict/server/generic，en 逐字同旧硬编 label、zh 预算超限/请求频率超限/服务不可用/认证错误/拒绝访问/未找到/校验错误/请求错误/已存在/服务器错误/错误）。toast.ts 把 `PROXY_TYPE_TITLES`/`STATUS_TITLES` 改为 `_*_CATEGORIES`（值即 camelCase 键，与第 379 簇的 category 对齐），加 `errorTitle(category)`：读 `document.documentElement.lang`（LocaleProvider 既有 effect 维护）经 `isUiLocale` 判 locale、缺省 `DEFAULT_UI_LOCALE`，从 `enMessages.toast`/`zhMessages.toast` 目录取串，`fromError` 以 `errorTitle(category)` 现取标题、色彩仍走 `WARNING_CATEGORIES`（第 379 簇已 locale-无关）。非 React 模块取译员的桥接采用「按 DOM lang 读消息目录」最轻形态，不引全局可变 translator 单例、不触 LocaleProvider 生命周期

测试安全论证：`toast.test.ts`（node/jsdom，`document.documentElement.lang` 空→回退 en）断言的仍是英文标题，34 例原样绿；全仓断言错误 toast 标题的组件测试仅 `AgentTracesSection.test`（其 "Not Found" 系 ApiError 入参、断的是卡片文案非标题），核后 23 例绿

验证：toast.test 34 + messagesParity/missingKeys（含 toast 命名空间 11 键中英齐备）全绿；tsc 全仓 883；eslint stdin clean；prettier clean；`npm run build` exit 0；`src/components`+`src/app` 全量 826 跑：822 绿、4 红逐文件比对恰为既往入判定账的已知假失败（cost_tracking 第 321 簇 60s 超时、LensSetup 时区、add_auto_router/KeyActivityPanel 并发假失败），零新增、零 toast 标题相关红、BudgetTable 第 369 簇修复稳。叶子 +11 至 11402、中英同值 141。toast.fromError 阻塞片就此接净；余 `handleError`（~100 调用点、仅 UI Session Expired 一枚硬编、需 translator 桥接同法，可续）、`copyToClipboard` 失败支（toast.fromError 同族、其 message 现可走桥、仅一处英文直换）两片为后续候选

## 2026-10-20 第 379 簇更新

开 toast.fromError 阻塞片前置重构（承第 359 簇判记「`WARNING_TITLES.has(title)` 以英文 title 判色、直译破分支须先改键判定」，本轮先拆此耦合、不动可见文案）。核 `src/lib/toast.ts`：fromError 的 title 非调用方传（345 调用点只传 error 对象），而是模块内部由 `describeError`→`titleFor` 据 status/proxyType 查 `PROXY_TYPE_TITLES`/`STATUS_TITLES` 生成，且 `WARNING_TITLES.has(title)` 拿生成的英文串判 error/warning 色——即色彩逻辑依赖了显示文案本身，这是个潜在正确性隐患（任何 title 改动、含本地化，都会误判色），亦是标题本地化的前置障碍

重构：两张 title 表的 value 由 `string` 改为 `{ category, label }`，`titleFor`/`titleForStatus` 返回 `ToastTitle`，`WARNING_TITLES`（英文 label 集）换成 `WARNING_CATEGORIES`（稳定 category 集，仅 budget/rate_limit），`fromError` 改 `show(WARNING_CATEGORIES.has(category) ? "warning" : "error", label, …)`。label 逐字不变、色彩判定走 category 走事实（proxyType==="budget_exceeded"→budget、status 429→rate_limit，与旧两枚警告 label 一一对应），故对终端输出零变化、对 345 调用点零改动，仅根除「显示串驱动逻辑」的耦合，为后续接 translator 本地化 title 扫清分支风险

验证：`toast.test.ts` 34 例全绿（逐 status/type 断言 (title, kind)，证色彩迁移逐例等价、行为零回归）；tsc 全仓 883；eslint clean；prettier 本行 HEAD clean、我把三元写成多行后折回单行（非既有脏、系我引入故按规则重排该处）；`npm run build` exit 0；零键、叶子维持 11391。阻塞片 toast.fromError 由「直译破色彩分支」降为「title 待译、色已 locale-无关」，余 translator 桥接（非 React 模块取译员、与 345 caller/测试 harness 耦合、属架构级专项）仍是入判定账的大片，本簇不硬塞

## 2026-10-20 第 378 簇更新

纯判定簇（零代码零键，承 184/189/359 等先例）。把第 375-377 开的「选项 label / configText 查表 / DataTable 列 meta.title」三面普查扫到底：

- `meta.title`：全仓仅 2 处英文字面量，`AutoRoutersTableColumns` 为空串、`ProjectsTableColumns` 的 "ID" 系通用技术缩写（同 MCP/LLM 判保留），无第三例
- `label:` 选项数组：余量除第 375 簇 old-usage 两枚已接外，皆 SDK/集成商品牌名（Arize/Datadog/New Relic/Langfuse/Vercel AI SDK/Pydantic AI 等）、数字/URL 格式样例、或 configText 表内已译项
- `configText`/`FIELD_TEXT_KEYS` 框架（agent_config）：第 377 簇补净 skill 两 placeholder 后，框架覆盖度审计完备，未映射项仅 `"1.0.0"`/`"0.0"`/`"0.000001"` 等数字样例

追一条新线索 `UsagePage/keyActivityData.ts` 的 `overallUsageMetrics` 硬编 `label: "Overall Usage"`——本似可见泄漏（KeyActivityPanel 渲 `metrics.label`），但逐层核渲染流：该 `.label` 经核无任何读取点（`grep summary.label|summaryMetrics.label|summary.title` 全仓空），摘要头实际走 `activity_metrics.tsx:521 resolvedSummaryTitle = summaryTitle ?? t("defaultSummaryTitle")` 且两调用方 EntityUsage/UsagePageView 皆不传 `summaryTitle`、故落 `t("defaultSummaryTitle")`（既有键、已译）；KeyActivityPanel:320 的 `metrics.label` 是 per-key 动态别名非摘要。判 "Overall Usage" 为被 i18n 回退路径遮蔽的死字段、不可达，入判定账不动（且此改动会触达 `KeyActivityPanel.integration`——既有并发假失败组件，验证面噪声大，进一步佐证不在此簇硬接）

结论：小面可见串（属性、JSX 文本单/多词、`??`/`||` 回落、组件默认参、单/多词默认、useState、toast 字面量、enum、选项 label、meta.title、查表框架、摘要标题流）十二口径本轮独立复扫全见底，真漏仅余三片高扇出判定账 `handleError`(~100) / `toast.fromError`(~355) / `copyToClipboard` 失败支。验证：无码改，跳过五件套，仅本 PROGRESS 记录

## 2026-10-20 第 377 簇更新

续「选项/label 英文字面量」面，顺 `label:` 补扫追到 agent 表单框架 `agent_config.ts`：其 `configText(t, text)` 用 `FIELD_TEXT_KEYS` 查表把 config 英文串映射成 `agents.*` 键、未命中则原样回吐英文。核该框架覆盖度——`AGENT_FORM_CONFIG` 各 `title`/`label`/`placeholder` 与 `SKILL_FIELD_CONFIG` 几乎全部在表内（仅 `"1.0.0"`/`"0.000001"` 数字格式样例未映射、判保留），框架本身完备

但渲染层有漏网：`agent_form_fields.tsx` skill 编辑器七字段，desc/tags/examples 三枚 placeholder 走 `configText`、五枚 label 全走，唯 `id`(71) 与 `name`(87) 两枚 placeholder 直接 `placeholder={SKILL_FIELD_CONFIG.x.placeholder}` 原样吐——既与同表单五兄弟不一致（潜在 bug），且值 `"e.g., hello_world"`/`"e.g., Returns hello world"` 不在 `FIELD_TEXT_KEYS`，即便改走 configText 也回吐英文。修：两处包 `configText(t, ...)`，并补 `FIELD_TEXT_KEYS` 两映射 `"e.g., hello_world"→skillIdPlaceholder`、`"e.g., Returns hello world"→skillNamePlaceholder`，加 `agents.skillIdPlaceholder`（en 逐字 "e.g., hello_world"、zh「例如：hello_world」）与 `agents.skillNamePlaceholder`（en "e.g., Returns hello world"、zh「例如：返回 hello world」）两键，hello_world/hello world 作样例 token 保留

排除项：`cost_config_fields:29` placeholder 原样但值皆数字格式样例（configText 亦回吐、无英文）判无害不动；`dynamic_agent_form_fields` 的 `field.label`/`placeholder` 原样系喂渲染的远端 agent 自带 schema 字段名（如 "Assistant ID"）属外部数据、非本 app 静态 chrome，判保留。`callback_info_helpers` displayName（Arize/Datadog/New Relic/Langfuse 等）系可观测集成商品牌名入账

测试面：`agents/` 整目录 16 文件 151 例全绿（无一断言 skill placeholder 英文）；tsc 全仓 883；eslint stdin agent_config 12warn=12warn、agent_form_fields 1err=1err 与 HEAD 持平（既有债）；prettier agent_config clean、agent_form_fields HEAD 即脏（diff 在既往 57/73/140 行 configText 越 120、非本簇 71/87 短行）故不重排；`npm run build` exit 0；叶子 +2 至 11391、中英同值 141。configText 查表框架审计完备、渲染层一处漏网补净

## 2026-10-20 第 376 簇更新

续第 375 簇「下拉/选项 label」补扫扩到「DataTable 列 `meta.title`」面。`meta.title` 非列头本身，而是 `DataTableViewOptions.tsx:49` 列可见性开关文案与 `DataTableToolbar.tsx:55` 筛选 chip 标签的取值源（`meta?.title ?? columnId`）。命中 `MemberTable.tsx:141` 的 user_email 列 `meta: { title: "User Email" }` 硬编英文——同列 header 早用 `t("keysUserEmail")`、同表兄弟列 user_alias 的 meta 用 `commonT("name")`（皆译），唯 user_email 的 meta 漏接，致列开关菜单/筛选 chip 在 zh 构建显英文

`teams.keysUserEmail`（"User Email"/"用户邮箱"）与硬编值逐字同，直接复用该键 `meta: { title: t("keysUserEmail") }` 即与 header 一致，零新键。甄别本面其它 `meta.title`/`roleColumnTitle` 皆已译或为动态值，`callback_info_helpers` 的 `displayName: "Arize"/"Datadog"/"New Relic"/"Langfuse"` 等系可观测/追踪集成商品牌名判保留入判定账

测试面：MemberTable 列 meta 走 `renderWithProviders`，`MemberTable.test`/`TeamMemberTab.test`/`DataTableViewOptions` 相关 4 文件 61 例全绿（无一按 "User Email" 断列开关文案，零翻面；其它 `"User Email"` 命中系 `it` 名/注释/`LabeledField` 与 `id_cell` 显式 prop 非本 meta）

验证：61 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin 当前与 HEAD 皆 0 problem；prettier clean；`npm run build` exit 0；零新键、叶子维持 11389、中英同值 141。`meta.title` 面首开，MemberTable 一处接净，余量表列 meta 待续普查

## 2026-10-20 第 375 簇更新

以「下拉/选项 `label:` 英文字面量」口径补扫渲染为可选文案的 label，命中三族：SDK/产品品牌名（`Python (OpenAI SDK)`/`Azure SDK`/`Deep Agents`/`Vercel AI SDK`/`Pydantic AI`）判品牌保留；`ComplexityRouterConfig` 的 `TIER_DESCRIPTIONS` 里 `label: "Simple"/"Medium"/...` 经核是 `build_complexity_router_config.ts:347/375` 用的后端匹配/构造数据值、显示走 `t(labelKey)`，判数据不入接（改它会破 payload 比对逻辑）；真可见漏网落 `old-usage/_components/usage.tsx` 的 tagOptions：`label: "All Tags"` 与非会员 `label: ✨ ${tag} (Enterprise only Feature)`，两处 label 经 combobox 的 `itemToStringLabel`/`ComboboxChip`/`aria-label` 渲染可见。`old-usage` 在 leftnav:351 与 legacyPageRoutes 有路由、系仍挂导航的 legacy 页且早被部分接入（已有 `useTranslations("usage.old")`），非死页

接线：line 108 现成 `t`，`label: t("allTags")` 与 `label: premiumUser ? tag : t("enterpriseOnlyFeature", { tag })`（premium 分支只显 tag 原值、属数据保留）。新增 `usage.old.allTags`（en 逐字 "All Tags"、zh 全部标签）与 `usage.old.enterpriseOnlyFeature`（en "✨ {tag} (Enterprise only Feature)" 保留既有 emoji、zh "✨ {tag}（仅企业版功能）"）两枚，{tag} 占位经 messagesParity 参数名两侧一致校验

`usage.test.tsx`（14 例）仅断言中文分区/tab 名（"标签用量"/"各标签消费"），不断言 tagOptions 英文 label，零翻面。甄别中排除的近似命中已记（品牌、后端匹配数据 label、premium 原值）

验证：usage.test + messagesParity/missingKeys 31 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin 当前与 HEAD 均 34 problems（10err/24warn 同数，含既有 `max-lines` 846 行超 800，本簇纯换串不增行）；prettier 本 legacy 文件 HEAD 即脏、diff 不含本簇 144/149 行故不重排；`npm run build` exit 0；叶子 +2 至 11389、中英同值 141。下拉 label 口径开启，余量入品牌/数据判定账

## 2026-10-20 第 374 簇更新

补第 373 簇 combobox 高扇出改动触发的全量回归。`src/components`+`src/app` 整包 826 文件跑一遍，5 文件红灯。逐一甄别：

- `add_auto_router_tab.integration`（2 例）、`KeyActivityPanel.integration` 系既往已知并发假失败，`--no-file-parallelism` 单跑全绿，入账不变
- `LensSetup.integration` 挂 `/2026-09-30/` 日期断言，`TZ=UTC` 单跑全绿，系既有上游时区账，与本簇无关
- `BudgetTable.test > should copy the budget id` 系第 369 簇真漏网：BudgetTable 复制单元格走 `id_cell.tsx`（第 369 簇接 `common.copiedToClipboard`），生产现传 `[budgetId, "已复制到剪贴板"]` 两参，而该消费方测试 `toHaveBeenCalledWith(budgetId)` 未翻。补 `, "已复制到剪贴板"` 即绿。教训复申：改共享复制件须把所有渲染它的表测跑净，不能只跑被点名文件（[[feedback-shared-component-consumer-tests]]）
- `cost_tracking_settings.test > should hold the confirmation open while the removal is still in flight` 60s 超时。`git log 4b122aff..HEAD -- cost-tracking/` 空，本会话三簇（371/372/373）未触碰 cost-tracking 组件或其标签，且 JSON 改动纯增键不破查找；该测试最后改动在第 321 簇、自第 307 簇全量后从未整包复跑，故属第 321 簇既有、被历史全量缺口漏检的假失败（`Promise.withResolvers` + `act` 悬挂，非 findByRole 早失败，非翻译漏网），登记入判定账待独立排查，不并入本簇

本簇净改动一处测试（BudgetTable 补账），零键、零生产码变更。验证：BudgetTable 单文件 `--no-file-parallelism` 绿；全量其余仅余上述入账的已知假失败。共享件英文默认参数与 `??`/`||` 回落两口径、单/多词 JSX 文本、属性 alt/placeholder/title/aria 六面本轮独立复扫均无新真可见命中（属性面命中均为 JSDoc 注释/HTTP 头名 `Authorization`/格式示例占位 `my-skill`·`Productivity` 判保留），小面可见串维度可判阶段性见底，余量集中在 handleError·toast.fromError·copyToClipboard 失败支三片高扇出判定账

## 2026-10-20 第 373 簇更新

续「共享件英文默认参数字面量」维度（370 DataTable、371 FilterDrawer）到 `ui/combobox.tsx` 的 `ComboboxClear`：`aria-label` 默认参 `"Clear"`。`ComboboxInput` 在 line 74 `{showClear && <ComboboxClear disabled={disabled} />}` 内部渲染 ComboboxClear 且不传 aria-label，故全部 `showClear` 消费方（SearchSelect/PaginatedSearchSelect/RequestLogsFilters/ModelChoiceCombobox/ToolDetail/CreateSearchTools/ActivityScope/add_plugin_form/vector_store_info/VectorStoreForm/UsageAIChatPanel 11+ 处）在 zh 构建吃英文 accessible-name "Clear"。同第 356 簇 PasswordInput 一处接线盖 27 消费方模式

ComboboxClear 由函数签名默认解构 `ariaLabel = "Clear"` 改为无默认参 + 体内 `const t = useTranslations("common")` + `aria-label={ariaLabel ?? t("clear")}`（用 `??` 而非默认参：调用方显式传的 aria-label 仍覆盖，仅省略者取译员默认）。复用既有 `common.clear`（"Clear"/"清除"）逐字同值，零新键

消费者测试翻面：全仓 `name: "Clear"` 断言 22 处跨 16 文件，均经 `renderWithProviders` 钉 zh（无一裸 render，故加 hook 不抛 intl context），翻成 `name: "清除"`。翻后全跑 16 文件 EXIT=0、`name: "Clear"` 残留 0。querySelector `[data-slot="combobox-clear"]` 系测试（UserDropdown/EntityUsage/PaginatedMultiSelect/MCPSemanticFilterSettings）不吃 accessible-name，原样通过。`RequestLogsFilters` 的 `{ name: "Clear", hidden: true }` 用 allow_multiple 同翻 hidden 兄弟不变

甄别排除的近似命中：`view_user_spend.tsx:133 "Team Models"` 在 `{/* */}` 注释块内死码；`McpFormTestHarness.tsx:31 "Submit"` 系测试脚手架（`renderInMcpForm`）非生产；`RequestLogsTableColumns.tsx:155 || "Success"` 是驱动 `isSuccess` 的逻辑哨兵、可见标签早用 `t("success")`；`PublicModelHubTableColumns.tsx:209 || "Chat"` 与同格原样渲染的技术模式标识（chat/embedding）同源、译单枚反致不一致，判数据值；`TracingSetupCard "Shell"`/`SpanTree "Esc"` 语言与按键 token；ComplianceUI `|| "CSV Upload"/"Uploaded Prompts"` 作分组 map 键、窄特性、耦合度高，暂缓

验证：16 combobox 消费测试文件加 messagesParity/missingKeys 全绿（198 例首轮 + 全量二跑 EXIT=0）；tsc 全仓 883 与 HEAD 同数；eslint stdin combobox 当前与 HEAD 均 1 枚既有 `filename-pascal-case` 错（非本簇）；prettier clean；`npm run build` exit 0；零新键、叶子维持 11387、中英同值 141。`|| English` 与 `?? English` 两口径组件渲染真可见串至此扫净（余皆逻辑哨兵/数据值/token/测试脚手架/分组键入账或暂缓）

## 2026-10-20 第 372 簇更新

以「nullish `?? "English"` 回落串」口径补扫 JSX 表达式内英文回落（第 349/350 簇 `{...}` 回落族之外的 `??` 变体），命中 `ModelsTableColumns.tsx` 的 `CreatedByCell`：`const secondaryForDbModel = createdAt ?? "Unknown date";`。`formatShortDate` 在值缺失或非法日期时返 null（返回类型 `string | null`），且该单元格仅 db_model 分支渲染 secondary，故 "Unknown date" 真可达、zh 构建漏英文。`CreatedByCell` 顶层已 `const t = useTranslations("models")`（同函数 line 179 已用 `t("health.unknown")`），直接接 `t("unknownDate")`

`models.health.unknown` 值 "Unknown" 与 "Unknown date" 逐字不同不可复用，models 根无现成 unknownDate，新增 `models.unknownDate` 一枚（en 逐字 "Unknown date" 同旧回落、zh「未知日期」）

全仓 `?? "` 扫描此为该口径唯一真可见命中（余皆 enum 品牌/供应商名判定账面，provider_info_helpers/vector_store_providers/guardrail_info_helpers 的 `Bedrock = "Amazon Bedrock"` 类前簇已入账）。无任何测试断言 "Unknown date"/"未知日期"（grep 归零），零翻面

验证：ModelsTableColumns/AllModelsTable/AllModelsTab 加 i18n 守卫 4 文件 78 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin 当前与 HEAD 均无 problem；prettier 本文件 HEAD 即脏（91/125/143/148 等既往接线遗留越 120，本簇 line 180 短、不在 prettier diff 内）故不整文件重排；`npm run build` exit 0；新键无 ICU 占位、经 messagesParity；叶子 +1 至 11387、中英同值 141。`??` 回落口径就此扫净；共享件英文默认参数维度（370 DataTable、371 FilterDrawer）与本簇 JSX 回落另属不同面，不宣称各维度归零

## 2026-10-20 第 371 簇更新

续第 370 簇「共享件英文默认参数字面量」维度，接 `DataTableFilterDrawer` 三个英文默认参 `title = "Filters"`、`applyLabel = "Apply Filters"`、`resetLabel = "Reset"`。可达性普查（11 个调用方逐一读 `<DataTableFilterDrawer ...>` 起始块）：全部 11 方都传 `title={t(...)}`（memberTable.filtersTitle/auditLogs.filters/filters×4/teamsTable.filters/table.filtersTitle/modelTable.filters/keysFilters/filtersTitle），故 `title` 默认第 370 簇判死；`resetLabel` 仅 AllModelsTable 传 `t("common.reset")`，余 10 方省略、在 zh 构建吃英文 "Reset"；`applyLabel` 无任何调用方传，全部 11 张表的抽屉「Apply」按钮吃英文 "Apply Filters"。后两枚真触达，是本簇主修面

第 370 簇对死参 `title` 记「不为此动共享件」，但该结论前提是「不触碰本文件」；本簇为接 applyLabel/resetLabel 无论如何都要给此组件加 `useTranslations`，而 `common.filters`（"Filters"）与 `common.reset`（"Reset"）两键早已存在且逐字同默认值，把 `title` 默认一并接 `t("filters")` 零新键、零可见风险（全调用方覆盖之），顺带清掉源码里残留的英文字面量，较留死更干净，故本簇把三枚默认全接

组件此前直接在函数签名里解构默认值，无法在默认里引用 `t`，改成 `props` 单参 + 体内解构（同第 370 簇 DataTable 形态）：`const t = useTranslations("common")` 置顶，解构 `title = t("filters")`、`applyLabel = t("applyFilters")`、`resetLabel = t("reset")`。复用 `common.filters`/`common.reset` 两既有键，新增 `common.applyFilters`（en 逐字 "Apply Filters" 同旧默认、zh「应用筛选」）一枚。裸英文默认参数字面量就此清零

抽屉自测按 `data-testid`（filter-drawer-apply/reset）点击而非 accessible-name，11 消费表测试亦以 testid 触发，全量复核无一处按 "Apply Filters"/"Reset" 文本断言（ResetMemberBudgetsDialog 的 "Reset to $10.00" 系无关组件、MakeModelPublicForm.test 的 "Apply Filters" 在 `vi.mock(model_filters)` 内非本件），故零翻面

验证：DataTable 子树 11 文件 124 例（含 messagesParity 8、missingKeys 1）加 9 消费表 183 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin 当前与 HEAD 均无 problem；prettier clean；`npm run build` exit 0；新键无 ICU 占位、经 messagesParity 参数名校验；叶子 +1 至 11386、中英同值 141。共享件英文默认参数维度续进，FilterDrawer 三默认接净，不宣称该维度归零（须继续普查其它组件 props 英文默认）

## 2026-10-20 第 370 簇更新

开「共享件英文默认参数字面量」维度（copyToClipboard 调查引出的同类盲区：组件 props 的英文默认值非调用点、前四条 toast/属性口径扫不到）。普查发现 `DataTable.tsx` 的 `loadingMessage = "Loading…"` 默认——74 个 `<DataTable>` 渲染点里 43 个显式传 loadingMessage、余约 31 个省略、在 zh 构建里吃英文 "Loading…"。一处接线覆盖全部省略调用方（同第 356 簇 PasswordInput 一接线盖 27 消费方模式）。DataTable 已 import `useTranslations` 但主体此前未调，在 `export function DataTable` 顶部、props 解构前加 `const t = useTranslations("common")`，默认改 `loadingMessage = t("loading")`，复用既有 `common.loading`（"Loading..."/"加载中..."），零新键。en 由单字符省略号 "Loading…" 规范为三点 "Loading..."（与 common.loading 及第 331 簇各表 loading 键同形，属可接受归一，非既有串误译）

同维度另一命中 `DataTableFilterDrawer` 的 `title = "Filters"` 默认判死参不入账：全部 4+ 调用方都传 `title={t(...)}`（keysFilters/teamsTable.filters/filters），默认从不触达，接它无收益且动共享件有扇出——按「可达性」筛，只接真触达者

DataTable 现无条件调 `useTranslations`，故任何裸 `render`（无 intl provider）渲染 DataTable 的测试会抛 context not found。按此风险定向排查：筛「import 裸 render 且引用 Table/DataTable 且无 renderWithProviders/mock next-intl」的测试得 4 文件（TableIconActionButton/ref-forwarding/ApiKeysDashboard/EndpointUsage），全跑通过（其或用 provider 包裹、或 mock、或未真渲 DataTable）

验证：DataTable 子树加 6 代表表消费方 15 文件 212 例、加 4 裸 render 候选 32 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin DataTable 与 HEAD 均无 problem；prettier clean；`npm run build` exit 0；叶子维持 11385、中英同值 141。共享件英文默认参数维度首开，DataTable loading 一处接净，FilterDrawer title 判死参入判定账，不宣称该维度归零（须继续普查其它组件 props 英文默认）

## 2026-10-20 第 369 簇更新

copyToClipboard 阻塞片真正收尾：第 367/368 只清了 `utilCopyToClipboard` 别名的九包装器，仍有直接 import dataUtils `copyToClipboard`（无本地包装、无别名）却省 messageText 吃英文默认的七处——id_cell.tsx、RequestLogsTableColumns.tsx（`RequestIdWithCallIdTooltip`）、TracingSetupCard.tsx 两复制组件、ModelHubTable.tsx 三处。甄别须按「import dataUtils 且文件内无 `const copyToClipboard =` 本地包装」筛（前簇踩过本地同名包装器把第二参当 `setCopiedStates` key 的坑，那些 raw-literal 非可见串不入账）。ModelHubTable 已自带 `commonT`，余四组件各补一行 `useTranslations("common")`；TracingSetupCard 三组件里两个复制组件共享 `t`+`[copied]` 两行模式，用 `allow_multiple` 一次给两处加 hook（第三个 `[state]` 组件不受累）。复用 `common.copiedToClipboard`，零新键

消费者测试翻面：`id_cell.test`(2)、`RequestLogsTableColumns.test`(1)、`TracingSetupCard.test`(2) 五处 `toHaveBeenCalledWith`/`toHaveBeenLastCalledWith` 因调用增第二参而红，均 `renderWithProviders` 钉 zh，补 `, "已复制到剪贴板"`

验证：tsc 全仓 883（hook 作用域全对）；83 例（四文件测试加 i18n 守卫）全绿；eslint 四文件 stdin 与 HEAD 持平（ModelHubTable 9=9、其余 0/0/6w=6w）；prettier ModelHubTable 因 433 行 onClick 越 120 由 `--write` 折成三行（HEAD 该行 clean、非既有脏，故安全重排），余文件 clean；`npm run build` exit 0；叶子维持 11385、中英同值 141。至此复制成功 toast 英文默认全被显式译员文案取代（九包装器 + 七直调 = 16 处），dataUtils 英文默认参数成死参（删属独立清理、暂留）；余 `copyToClipboard` failure 分支 `toast.fromError("Failed to copy to clipboard")` 与 `handleError`/`toast.fromError` 两高扇出专项未动

## 2026-10-20 第 368 簇更新

copyToClipboard 阻塞片收尾：续第 367 簇把余下 6 个 `await utilCopyToClipboard(text)`（省 messageText、吃英文默认）包装器接上 `common.copiedToClipboard`——TeamInfo/user_info_view/tag_info/prompt_info/mcp_connect/mcp_server_view。这六文件无 `commonT`，各在所属组件顶层 translator 后补一行 `const commonT = useTranslations("common")` 再接。tag_info/mcp_connect 各有两个同名 `const t = useTranslations("tagManagement"/"mcpServers")`，插 hook 时锚点带上下相邻行定位到包装器所在组件那一处（循 WORKFLOW 第二步锚点取整行成对的告诫）。九文件全接后，dataUtils 英文默认 "Copied to clipboard" 不再被任何省略 messageText 的调用点触达（默认参本身暂留，删它属独立清理）

验证：tsc 全仓 883（hook 作用域全对、无 TS2304）；195 例（六文件测试加 i18n 守卫）全绿、无测试断言复制调用 args 故零翻面；eslint 六文件 stdin 与 HEAD 完全持平（各自 28/11/5/12/7/6 problems 同数、全既有债）；prettier HEAD 与当前脏行数逐文件相等（TeamInfo 329=329、tag 14=14…），本簇 hook/wire 行未越 120、不整文件重排；`npm run build` exit 0；叶子维持 11385（复用 `common.copiedToClipboard`）、中英同值 141。copyToClipboard 复制成功 toast 一径就此接净，failure 分支 `toast.fromError("Failed to copy to clipboard")` 归 toast.fromError 355 点专项、handleError 与 toast.fromError 两阻塞片未动

## 2026-10-20 第 367 簇更新

启动 copyToClipboard 阻塞片第一片（不再整体注入译员重构 58 调用点，改用仓库既有「调用方自传文案」约定逐片化解）。甄别关键：`copyToClipboard(` 全局 grep 严重误导——`public_model_hub`/`skill_detail`/`tag_info` 等文件各有本地 1–2 参 `copyToClipboard` 包装器，第二参或作 toast 或作 UI 态 key（`setCopied(key)`）非可见英文，早先一轮误把 public_model_hub 的本地包装当 dataUtils 函数接 `commonT` 反致 tsc +7（本地包装只 1 参），已回退并改按「import dataUtils 别名 `utilCopyToClipboard` 且调用省略 messageText→吃英文默认 "Copied to clipboard"」精确定位。真漏共 9 文件（均 `await utilCopyToClipboard(text)` 无第二参），本簇先接已自带 `commonT` 译员的三文件 SearchToolView/model_info_view/guardrail_info（确认包装器与 commonT 同组件作用域），各改 `utilCopyToClipboard(text, commonT("copiedToClipboard"))`，新增 `common.copiedToClipboard`（en 逐字 "Copied to clipboard" 同旧默认、zh「已复制到剪贴板」）

消费者测试翻面：`SearchToolView.test` 三处 `toHaveBeenCalledWith("…")` 因包装器新增第二参而红，补 `, "已复制到剪贴板"`（render 系 `renderWithProviders` 钉 zh）。教训入 memory：搜「哪些测试断言旧英文/旧 args」不能 `head` 截断

验证：三文件测试加 i18n 守卫 146 例全绿（4 expected fail 既有）；tsc 全仓 883 与 HEAD 同数（回退误接后复绿）；eslint 三文件 stdin 与 HEAD 完全持平（SearchToolView 0、model_info 20=20、guardrail_info 26=26，均既有债）；prettier SearchToolView/model_info clean，guardrail_info 唯一告警在 682 行既有 `<Info>`、非本簇 510 行（我的行未越 120、不在 prettier diff）故不整文件重排；`npm run build` exit 0；叶子 +1 至 11385、中英同值 141。余 6 个 utilCopyToClipboard 包装器（TeamInfo/user_info_view/tag_info/prompt_info/mcp_connect/mcp_server_view，均无 commonT）待第 368 簇各补 hook 续接

## 2026-10-20 第 366 簇更新

按「放宽口径甄别」把可及性文本纳入接线：先对 `aria-label`/`alt`/`title` 单复词英文字面量做穷举正则，结论是唯一可译真串即 `UiLoadingSpinner` 的 `aria-label="loading"`×4（LoggingSettings/ChangePasswordForm/LoginPage/OnboardingFormBody），余 `alt="LiteLLM"`/`title="GDPR"`/`CloudZero` 品牌与法规专名、`title="gatewaySessions.*"` 系键路径、`aria-label="file-pdf"` 系数据 token 均入账。复用既有 `common.loading`（zh「加载中...」）、零新键，循 `BlogDropdown` 早先把 spinner aria 接 `common.loading` 且测试断 `/加载中/` 的先例

各调用点译员已在域者直接用（LoggingSettings 的 `tc`、LoginPage 的 `commonT`），OnboardingFormBody 与 ChangePasswordForm 各补一行 `useTranslations("common")`。en 侧 aria 由裸「loading」规范为「Loading...」与可见文案一致、仅利屏幕阅读器，无碍。`LoginPage.tsx` 该行换 `commonT("loading")` 后超 printWidth 120，按 prettier 折成括号多行 JSX（其余三文件行未越界）

消费者测试翻面（守第 353 簇教训、跨 4 文件全跑）：`LoggingSettings.test` 两处、`OnboardingFormBody.test` 一处 `getByRole("img", { name: "loading" })` 改 `/加载中/`（顺带订正 OnboardingFormBody 那句「antd v5 渲染 loading 图标」的过时注释——实为本组件 UiLoadingSpinner）。首轮漏网 `OnboardingFormBody.test` 正因搜索 accessible-name 时 `head` 被 logo 用例刷满截断，印证消费者断言须逐文件核到底、不能截断

验证：四消费文件 8 测试文件 70 例全绿（LoginPage 15、LoggingSettings 25、Onboarding 各例含）加 i18n 守卫；tsc 全仓 883 与 HEAD 同数；eslint 三文件 0 新增（LoginPage 3 条均既有：setState-in-effect×2、340 行 no-complex-jsx-arrow，与 321 行改动无关、HEAD 同数）、其余 0 问题；prettier 折行后五文件全 clean；`npm run build` exit 0；叶子维持 11384（复用 `common.loading`）、中英同值 141、按文件覆盖率不变（四文件本已接入）。可及性 aria/alt/title 维度就此收口，可见 DOM 文本与可及性文本两线本轮均见底

## 2026-10-20 第 365 簇更新

开「原生 `alert()`/`confirm()` 弹窗文案」第六条扫描维度（前五条只扫 JSX 文本/属性/toast 首参/模板串/`{...}` 回落，浏览器原生对话框的字符串一直漏网，虽非 DOM 内渲染但用户可见）。命中 `components/ToolDetail.tsx` 四条 `alert(\`Failed to …: ${err}\`)`：其中「Failed to update input/output policy」两条的键 `toolPolicies.updateInputPolicyFailed`/`updateOutputPolicyFailed`（`{message}`参）早已存在且被`ToolPoliciesPanel`用`toast.fromError`接走，唯 ToolDetail 的`alert`调用点没接、裸英文写死（"键已存在、调用点未接"一类，与第 352 簇`ModelsTableColumns`「IN」、`ProjectDetailsPage`状态徽标同类）；另「Failed to add/remove override」两条无键，新增`addOverrideFailed`/`removeOverrideFailed`。四条统一改 `alert(t(key, { message: e instanceof Error ? e.message : String(e) }))`，en 渲染逐字节同旧模板串、`e.message` 系运行期透传不翻，`{message}` 参数名两侧一致、`intl-messageformat` 解析无 brace 残留

`t` 进 `useCallback` 依赖数组（四处各补 `t`）：next-intl 的 `t` 引用稳定、加进 deps 无环，且 WORKFLOW 第 31 行记的 React Compiler `preserve-manual-memoization` 报错只针对 `useMemo`、`useCallback` 不受累，eslint stdin 与 HEAD 完全持平（3 条既有 warning 均在 60/82/98 组件顶部、与改动区无关）、tsc/build 无此路径报错

验证：`ToolDetail.test`（10 例，仅断 API mock 调用、不碰 alert 文本、零翻面）加 i18n 守卫 19 例全绿；tsc 全仓 883 与 HEAD 同数；eslint 持平；prettier clean；`npm run build` exit 0；叶子 +2 至 11384、中英同值维持 141。原生弹窗维度首扫，其余正则盲区仍在推进，不宣称归零

## 2026-10-20 第 364 簇后补充扫描

第 362 到 364 簇把「更宽正则盲区」逐条扫了一遍并记判定，可见小面串趋薄：单行 `>Title Case<` 生产命中仅 `view_user_spend.tsx` 一处、且在 `{/* */}` 注释块内非渲染（假阳性）；插值后内联英文（`{x} Input` 形）仅 multi_cost_results 一族（362 已接）；属性维度 `alt`/`aria-label`/`title`/`placeholder` 英文字面量全落判定账——法规专名 `EU AI Act`/`GDPR` 与品牌 `CloudZero` 中英同值、`GroupCountTable title="gatewaySessions.*"` 系 i18n 键路径非裸串、`aria-label="file-pdf"` 与 slug/数字/协议头/prompt 样例占位符系格式示例（循 349/360 例）；多行散文命中全在 `{/* */}` 代码注释；`{" "}` 后接英文与反引号渲染散文两条正则零命中。仅余一类边界项待用户定夺：`UiLoadingSpinner` 的 `aria-label="loading"` 于 LoggingSettings/ChangePasswordForm/LoginPage/OnboardingFormBody 四处重复、屏幕阅读器在 zh 构建下仍读英文 `loading`，属可及性文本非「可见串」，且 `common.loading` 值是「Loading...」与现「loading」不同字、贯穿或改共享件均有扇出，暂不入队待确认（后于第 366 簇按放宽口径接入四枚、复用 `common.loading` 零新键，见上）不据本报告宣布整体完成

第 365 簇续扫两条口径亦归账：`toast.(success|info|warning|error|loading)("English…")` 字面量在全仓非测试代码仅剩 `networking.tsx` `handleError` 内 `toast.info("UI Session Expired. Logging out.")` 一条，属 ~100 调用点、无 React 上下文的高扇出专项重构（同 handleError 整体、与 copyToClipboard/toast.fromError 并列在下一步优先级阻塞片），非小面目标不入队；两词 Title Case 文本标签（`<Button|SelectItem|TableHead|option>Word Word</…>`）正则零命中。至此本轮六条更宽正则盲区（单行 Title Case、属性字面量、小写起头文本节点、多行散文、原生弹窗、toast/两词标签）扫尽，可见小面串或已接（362 到 365）或判入账，余量全落 ledger/高扇出/assistive 三类，须靠重构或更宽正则跨文件复读才能再推进，不据本报告宣布整体完成

## 2026-10-20 第 364 簇更新

开「小写起头 JSX 文本节点」补扫（前几簇 Title Case 正则 `[A-Z]…` 漏掉以 `stdio`/变量名等小写起头的句子），命中 `mcp-servers/_components/StdioAvailability.tsx` 一处真串族：模块级导出常量 `STDIO_DISABLED_MESSAGE`「stdio MCP servers are disabled…restart to enable them」作 tooltip 内容（`TransportSelectItems` 已接入行 25）与横幅正文（`StdioDisabledBanner` 未接 hook）、`AlertTitle`「stdio is disabled on this proxy」、正文后缀「. Until then this server cannot start or be saved as stdio.」。常量无法调 `t()`，故删常量、三键化：新增 `mcpServers.stdioDisabledMessage`（en 逐字同旧常量、`LITELLM_ENABLE_MCP_STDIO=true` 环境变量标识原样、`=`/`.` 非 ICU 特殊字符）、`stdioDisabledTitle`、`stdioDisabledUntilThen`；横幅正文写 `{t(msg)}. {t(until)}` 与旧字面量逐字节一致，`TransportSelectItems` tooltip 改 `t("stdioDisabledMessage")`（该组件 `mcpServers` 译员已在域）

顺带清一处死账：`MCPServerCard.tsx` 只 import 从不引用 `STDIO_DISABLED_MESSAGE`（HEAD eslint 因此报 1 error），删常量后连同该 unused import 一并去掉，net eslint 1 error→0。`StdioDisabledBanner` 由 `mcp_server_view.tsx` 消费（消费者测试全跑，守第 353 簇 ChartLoader 教训）

消费者测试翻面：`StdioAvailability.test.tsx` 用 `renderWithProviders`（钉 zh）却以 `findByText(STDIO_DISABLED_MESSAGE)` 抓英文 const——正是「const 参与断言、换语言即红」的一类，改 `findByText(/此代理已禁用 stdio MCP 服务器/)`，并从 import 去掉 const

验证：`StdioAvailability`（7 例）+ 消费者 `MCPServerCard`（14 例）+ `mcp_server_view`（20 例）加 i18n 守卫 50 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin StdioAvailability 0 问题、MCPServerCard 由 HEAD 的 1 error 降为 0（仅余 2 条既有 warning）；prettier 三文件 clean；`npm run build` exit 0；叶子 +3 至 11382、中英同值维持 141。小写起头 JSX 文本为新盲区、补扫刚启动，其余维度亦仍在推进，不宣称归零

## 2026-10-20 第 363 簇更新

接第 362 簇同轮扫出的 `app/chat/page.tsx:543` 空白态引导句「Chat with 100+ LLMs + MCP tools; authenticate once, use them here.」（后接 `{" "}` 与 `openIntegrations` 链接按钮），该文件其余文案早接 `chat.page.*`，此句裸英文漏网，接新增 `chat.page.blankIntro` 一枚。`100+`/`+`/`;` 均非 ICU 特殊字符、无 `{}`/`#`/`'`/`<>`，`intl-messageformat` 双侧解析通过；zh 循 GLOSSARY「LLM」「MCP 工具」保留标识符，`->` 箭头同 `openIntegrations`「打开集成 ->」原样

无测试断言该句（`page.integration.test` 用裸 `render` 但钉 zh、只断「发送」按钮，不碰引导句），零翻面

验证：`page.integration`（4 例）+ `layout`（3 例）加 i18n 守卫 16 例全绿；tsc 全仓 883 与 HEAD 同数；eslint stdin 该文件与 HEAD 持平（既有 1 条 no-nested-ternary + 2 条 no-img warning 均在 543 行以外、与本簇无关）；prettier 该文件 clean；`npm run build` exit 0（prerender 的 `ENVIRONMENT_FALLBACK` 为无害 env 回落告警）；叶子 +1 至 11379、中英同值维持 141。JSX 内联/裸文本口径余量趋窄，补扫仍在推进不宣称归零

## 2026-10-20 第 362 簇更新

续开「JSX 文本节点内联英文」更宽正则的 Title Case 标签盲区（前几簇已收独占一行句与 `{" "}` 拼接句，此口径专扫「`{插值}` 之后紧跟英文字面量」与「`>` 与 `<` 之间单行英文片段」），命中 `cost-tracking/_components/pricing_calculator/multi_cost_results.tsx` 八处：`SingleModelBreakdown` 里 `{periodLabel} Input`/`Output`/`Margin Fee` 三枚（`periodLabel` 走既有 `daily`/`monthly` 已接、唯其后的英文后缀裸着）、`Token Pricing:` 引导行与 `Input $…/1M`/`Output $…/1M` 两枚 token 单价、汇总卡 `{periodLabel} Margin Fee`、以及表格零成本告警句「No pricing data found for this model. Set base_model in config.」。新增 `costTracking.periodInput`/`periodOutput`/`periodMarginFee`（`{period}` 插值，zh 循既有 `totalForPeriod`「{period}总计」前置无空格、en 逐字 "{period} Input"）、`tokenPricing`/`inputPerMillion`/`outputPerMillion`（`{cost}` 传格式化后的字符串、`$` 非 ICU 特殊字符逐字保留，en "Input ${cost}/1M" 渲染与旧字面量一致）、`noPricingData`（zh 保留 `config` 与 `base_model` 配置键名原样）。七键全 `{arg}` 插值、`intl-messageformat` 双侧解析并核参数名一致、无 brace 残留，`messagesParity` 与 `missingKeys` 通过

消费者测试翻面：`multi_cost_results.test.tsx` 里 `/no pricing data found/i` 一条正则英文断言（裸串 grep 抓不到、换中文即红，正是 WORKFLOW 第五步警示的 regex-literal 类）改 `/未找到该模型的定价数据/`；其余 period/token 串无测试断言、`Pricing not found` 那条是 mock 数据驱动的 `e.error` 原文非本簇文案、不动

验证：`multi_cost_results.test`（19 例含）加 i18n 守卫 28 例全绿；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin 该文件与 HEAD 持平（各 1 条既有 filename-pascal-case）；messages JSON 全仓本就非 prettier-clean（HEAD 同态），本簇仅 +7 行、不整文件重排；`npm run build` exit 0；叶子 +7 至 11378（双侧一致）、中英同值维持 141。JSX 内联英文 Title Case 标签余量趋窄，同维度同轮另检出 `app/chat/page.tsx` 空白态引导句（第 363 簇续接），补扫仍在推进不宣称归零

## 2026-10-20 第 361 簇更新

以「独占一行英文句」更宽正则重扫非测试 `.tsx` 的 JSX 文本节点，命中 `cost-tracking/_components/how_it_works.tsx` 四条第 337 簇当时漏接的残句（该文件余标签早接 `costTracking.*`，此四支裸英文漏网）：示例结果句「A 5% discount on a $10.00 request results in: $10.00 × (1 - 0.05) = $9.50」接 `calcExampleResult`、验证引导句「Make a test request and check the response headers to verify discounts are applied:」接 `validatingIntro`、两个字段 Label「Response Cost (x-litellm-response-cost)」/「Discount Amount (x-litellm-response-cost-discount-amount)」接 `responseCostLabel`/`discountAmountLabel`（四枚新键，en 逐字一致，zh 保留 x-litellm-* 响应头标识原样）。`$`/`%`/`×`/`()`均非 ICU 特殊字符无需转义、无`{}`/`#`，`messagesParity`brace 守卫通过。另一命中`APIReferenceView.tsx:48`「Langchain Py」系框架品牌名（同第 348 簇 SDK 选项卡账）不翻

验证：`how_it_works.test`（19 例含）加 i18n 守卫全绿、无专测断言这四条英文故零翻面；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin how_it_works 2=2；prettier 该文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +4 至 11371、中英同值维持 141。更宽正则复扫 JSX 文本节点余量趋窄，仍按维度逐簇推进不宣称归零

## 2026-10-20 第 360 簇更新

开「导出文档内容」新维度（前几条口径只扫交互式 UI 属性/文本/toast，下载的成品报告文本一直漏网）。定价计算器 `multi_export_utils.ts` 的「导出为 PDF」把整份报告拼成 HTML 弹窗打印，其中面向人的标题/表头/汇总标签全硬编码英文，接 `costTracking.multiExport.report` 命名空间新增 25 键（documentTitle/heading/modelsConfigured/combinedTotals/totalPerRequest/totalDaily/totalMonthly/marginPerRequest/dailyMargin/monthlyMargin/modelBreakdown/inputTokensPerRequest/outputTokensPerRequest/requestsPerDay/requestsPerMonth/costType/perRequest/daily/monthly/inputCost/outputCost/marginFee/total/footer/allowPopups）。`.ts` 模块无 React 上下文，按既有 translator 注入约定给 `exportMultiToPDF`/`generateModelSection` 加首参 `t: CostTrackingTranslator`（`multi_export_dropdown.tsx` 已有 `useTranslations("costTracking.multiExport")`，另取 `useTranslations("costTracking")` 基座 `ctT` 传入），footer 用 `{date}` 插值保留品牌串 "LiteLLM Pricing Calculator" 原样、modelsConfigured 用 ICU 复数。`exportMultiToCSV` 的列头（"Input Cost/Req"/"Margin/Req" 等）判为数据交换标识、同第 352/358 簇 role/displayName token 类保留不译（CSV 供表格/程序读、英文列头是惯例标识），故本簇只接 PDF 报告、CSV 入判定账

`footer` 用 `{date}` 插值、`modelsConfigured` en 用 `{count, plural, one {# model...} other {# models...}}`；zh 起初也用带 `#` 复数「已配置 # 个模型」被 `messagesParity` 的「brace 须是占位符」守卫拦下（该守卫要求 `#` 数占位须置于复数分支体首，zh 语序 `#` 在中间不合），因中文无单复数变形，改 zh 为直插 `{count}`「已配置 {count} 个模型」（`{count}` 系合法标识符占位），复跑守卫绿。测试侧 `multi_export_utils.test.ts` 按既有 `createTranslator({ locale:"en", messages: en, namespace:"costTracking" })` 建英译员传入，生成 HTML 保持英文、原「LLM Cost Estimate Report」「Margin/Request」等断言不动；`multi_export_dropdown.test.tsx` 的 `toHaveBeenCalledWith(multiResult)` 随签名加 `expect.any(Function)`

验证：pricing_calculator 目录 `multi_export_utils`/`multi_export_dropdown`/`multi_cost_results`/`index` 四测试文件加 i18n 守卫共 67 例全绿（`createTranslator` 建译员模式与既有 `modelOwnership`/`TracesTimeline` 一致）；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin 四文件对 HEAD 全持平（0/2/0/0）；prettier 四文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +25 至 11367、中英同值维持 141。导出文档维度首片接净 PDF、CSV 列头入判定账；此维度或仍有其他导出件（各报表/仪表盘导出）待更宽正则补扫，不据本簇宣称该维度归零

## 2026-10-20 第 359 簇更新

纯判定簇（无代码改动、无新键）。开「单侧三元英文字面量」补扫口径（`? "English" : 变量/undefined` 与 `? 变量 : "English"` 两侧只一侧英文者，前几簇两侧皆英文口径漏此类），命中四处逐条判：`networking.tsx` 的 `return_wildcard_routes===true ? "True" : undefined` 与 `only_model_access_groups===true ? "True" : undefined` 系拼进请求体的序列化字段值（后端读 "True" 字符串），属 API 协议语料不翻；`view_logs/TraceView/DetailContent.tsx:59` 的 `? "LiteLLM"` 品牌标识已于第 358 簇入判定账；`lib/toast.ts:125` 的 `status===undefined ? "Error" : titleForStatus(status)` 经追认为高扇出专项重构阻塞片入账——`toast.fromError(input)` 单入口算出 `title`（"Error"/"Server Error"/"Request Error"/"Access Denied" 加 `STATUS_TITLES`/`PROXY_TYPE_TITLES` 两张查找表）后第 143 行 `show(kind, title, {description})` 把 title 作 sonner 可见消息渲染，是真人面 UI，但 `toast.fromError` 全仓 355 个调用点（与已入账的 `handleError` ~100、`copyToClipboard` 34 同属高扇出类），且 `WARNING_TITLES.has(title)` 以英文 title 串做集合判定决定 warning/error 色，直译 title 会连带破坏该分支逻辑、须先改用键/码判定，非 `.ts` 模块内可取 `useTranslations`、贯穿 355 点需译员注入式重构，作专项重构队列、不草率接线。至此单侧三元英文字面量可见串全落判定账（品牌/协议/API-error-title 高扇出三类），`? :` 口径（两侧与单侧）复扫归零，余更宽正则盲区（模板串内英文、`{...}` 回落、小写起头标签、`{" "}` 拼接、`<code>` 内嵌）待续，不据本报告宣布整体完成

无代码变更，免跑 vitest/tsc/eslint/prettier/build；叶子维持 11342、同值 141；已在「下一步优先级」登记 `toast.fromError` error-title 355 点高扇出重构与 `WARNING_TITLES` 逻辑耦合为专项阻塞片

## 2026-10-20 第 358 簇更新

三元 `? :` 口径收口簇。接线一片：`content_filter/TagsInput.tsx` 的 `placeholder={loading ? "Loading..." : placeholder}` 接 `common`（该组件已有 `useTranslations("guardrails")`，为取通用 "Loading..." 补第二 hook `useTranslations("common")` 复用既有 `common.loading`，0 新键、不另立重复键），本组件早已 require provider 故消费方测试无新增抛错风险。同口径余两枚判入判定账不接：`view_logs/TraceView/DetailContent.tsx:59` 的 `sourceKey === undefined ? "LiteLLM" : t(sourceKey)`，"LiteLLM" 系代理自身品牌/默认来源标识（中英同值品牌账，与 EU AI Act 同类）；`cost-tracking/provider_margin_table.tsx:25` 的 `provider === "global" ? "Global" : getProviderLogoAndName(provider).displayName`，"Global" 是合成 global 行的显示名、与同行其余 provider 直出 server `displayName`（未译数据值）保持一致，单译它反致不一致（与第 352 簇 role/provider 显示名 token 判保留同类）。至此两侧皆英文字面量的三元 `? "English" : "English"` 全仓非测试 `.tsx` 复扫归零，`? "English" : 变量/undefined` 单侧形亦经本簇覆盖至 TagsInput，余下正则盲区（小写起头、模板串内、`{...}` 内英文、`{" "}` 拼接）另立更宽正则补扫，不据本簇宣称整体完成

验证：TagsInput.test（含 token 提交等）加 i18n 守卫共 14 例全绿；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin TagsInput 0=0；prettier TagsInput HEAD 与当前均 clean；`npm run build` exit 0；叶子不变 11342（复用 common.loading、0 新键）、中英同值维持 141

## 2026-10-20 第 357 簇更新

续三元 `? "English" :` 口径，接两个此前无 `useTranslations` 的选择器占位符：`GuardrailSelector.tsx` 的 `disabled ? "Setting guardrails is a premium feature." : "Select guardrails"` 接 `guardrails` 命名空间新增 `premiumGuardrailPlaceholder`/`selectGuardrailsPlaceholder`，`PolicySelector.tsx` 的 `disabled ? "Setting policies is a premium feature." : "Select policies (production or published versions)"` 接 `policies` 命名空间新增 `premiumPolicyPlaceholder`/`selectPoliciesPlaceholder`（四枚新键，en 逐字一致）；两组件各加 `useTranslations`。`policies`/`guardrails` 顶层命名空间已存在（flat title/tabs/loading 等），既有 `guardrailsPlaceholder`/`policiesPlaceholder` 散在 `teams`/`models.addModel`/`projects`/`policies.attach` 等别处命名空间、语义与值均不合，故各自命名空间另立键。占位符经 `MultiSelect` 成为 combobox 的 accessible name，`key_edit_view.integration.test.tsx` 的 `pickFromCombobox` 用 `getByLabelText` 匹配旧英文，两处（guardrail/policy）随接线翻为 zh「选择护栏」「选择策略…」

验证：因是复用组件接线，按第 356 簇教训跑全部消费方测试面——`GuardrailSelector.test`（用 `renderWithProviders as render` 别名、provider 安全）、`PolicySelector.test`（同，且 disabled 用例只查 `toBeDisabled` 不查文本）、`key_edit_view.integration`（两处 combobox 翻面后绿）、`add_agent_form.integration`、`ComparisonPanel.test`、`PassThroughGuardrailsSection.test`、`ChatUI.integration`（均 `renderWithProviders`）加 i18n 守卫共 7 文件 144 例（2 预期失败）全绿，ComplianceUI 无专测；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin GuardrailSelector 0=0、PolicySelector 2=2、key_edit_view 4=4 增量 0；prettier 三文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +4 至 11342、中英同值维持 141。三元口径余 `TagsInput` loading 占位一句待下簇

## 2026-10-20 第 356 簇更新

续三元 `? :` 口径、处置登记的高扇出阻塞片 `shared/PasswordInput.tsx`。该 forwardRef 组件把显隐切换按钮的 aria-label 写死 `{revealed ? "Hide password" : "Show password"}`，被 27 个消费方引用，一处接线即覆盖全部生产渲染路径（生产应用树本就在 provider 下，唯测试面需核）。接 `common` 新增 `showPassword`/`hidePassword` 两键（en 逐字一致，zh 显示密码/隐藏密码，与既有 `teams.logging.*`、`vectorStores.*` 同名键分属不同命名空间、跨命名空间不可复用故另立），组件加 `useTranslations("common")`。测试面经全量 `src/components`+`src/app` 复核：16 个消费方专测中多数用 `renderWithProviders as render` 别名（自带 intl provider，接 `useTranslations` 不抛）、OnboardingForm 以 `vi.mock` 替掉含 PasswordInput 的 FormBody、SearchTools.integration 裸 render 但 PasswordInput 在已开弹层内亦不抛（实测全绿）；唯二真回归是按英文 accessible-name 的两文件——`provider_specific_fields.test`（上轮已翻）与 `update_model_credentials_modal.test.tsx:138/142` 的 `/show password/i`、`/hide password/i` 正则（本簇翻为 zh 名）

验证：PasswordInput 触点与两英文断言测试文件加 i18n 守卫（missingKeys 1 + messagesParity 8）全绿，`update_model_credentials_modal.test`（reveal 用例）与 `provider_specific_fields.test`（reveal 用例）翻面后复跑绿；tsc 全仓 883 与 HEAD 同数、触点零错；eslint stdin PasswordInput 0=0、provider_specific_fields 0=0、update_model_credentials 0=0；prettier 三文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +2 至 11338、中英同值维持 141。全量 `src/components`+`src/app` 复核另暴露本簇之外的账：ChartLoader 于第 353 簇接 `common.chartLoadingTitle` 后改渲 zh「正在加载图表数据…」，但 `EntityUsage.test.tsx`（1024/1033）与 `KeyActivityPanel.integration.test.tsx`（292/298）两处仍断言旧英文加载态、第 353 簇当时只跑 chart_loader 专测未及这两处消费方测试故漏网（KeyActivityPanel 长期被记为「已知并发假失败」实为此真回归、非并发假失败），本簇一并按 zh 断言翻正并单跑复绿；`SpendByProvider.test.tsx` 第 8 行是自带英文加载态文本的 ChartLoader 测试替身、自洽不受影响。另 `cost_tracking_settings.test.tsx`「should hold the confirmation open while removal in flight」单跑 60s 超时（不涉任何翻译串、与本簇无关），判为既有慢/超时型 flaky，续列已知失败面。三元 `? :` 口径可见串至此接净，余判定账（operations.ts 工具描述等）已入账，不据本簇宣称整体完成

## 2026-10-20 第 355 簇更新

续三元 `? :` 口径第三片：`ThemeToggle.tsx` 的 `label = isDark ? "Switch to light mode" : "Switch to dark mode (beta)"`（同灌 aria-label 与 title 两处），接新增 `common.switchToLightMode`/`switchToDarkMode` 两键（zh 切换到浅色模式/切换到深色模式（beta）），组件加 `useTranslations("common")`。此件系登记的两件待续之一、难点在专测：`ThemeToggle.test.tsx` 原 `renderToggle` 只包 `ThemeProvider`、无 intl provider，裸接 `useTranslations` 必抛，故把 wrapper 改为 `ThemeProvider` 内嵌 `LocaleProvider locale="zh-CN"`（`LocaleProvider` 仅依赖 next-intl 与 messages、不需 QueryClient，可与 ThemeProvider 自由嵌套），并翻四处按 accessible-name 的断言（正则 `/切换到(浅色|深色)模式/` 与两处显式名、`toHaveAccessibleName("切换到浅色模式")`），`not.toHaveTextContent("Beta")` 查子节点文本、与 aria 无关保留。另一待续件 `shared/PasswordInput.tsx` 的 show/hide aria-label 判为高扇出阻塞片另簇处置：该 forwardRef 组件被 27 个消费方引用，接 `common` 后需逐个确认消费方测试均在 provider 下渲染（`provider_specific_fields.test` 两处英文名待翻，`teams.logging`/`vectorStores` 各自的 show/hide 键属本地输入、不受影响），须跑全量消费方测试面方能定，不草率接线

验证：`ThemeToggle.test`（5 例）加 i18n 守卫全绿；tsc 全仓 883 与 HEAD 同数、触点文件零错；eslint stdin 两文件 0=0；prettier 两文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +2 至 11336、中英同值维持 141。三元口径本簇再接 ThemeToggle 一片，余 PasswordInput 一片作高扇出阻塞片待下簇全量核

## 2026-10-20 第 354 簇更新

续第 353 簇「三元 `? "English" :` 英文字面量分支」口径补扫，命中可见真串两片。`ModelsTableColumns.tsx` 的 `resolvePauseTooltip` 正常态分支「Resume model — restore normal routing.」/「Pause model — stop routing requests until resumed.」，该函数其余分支早已走 `modelTable.pauseTooltipConfig`/`pauseTooltipAdmin`、唯此支漏接硬编码，接新增 `modelTable.pauseTooltipNormal`/`resumeTooltipNormal` 两键（en 保 em dash 原样字节一致、zh 用逗号断句），与同列 318 行 aria-label 短式 `pauseTooltip`/`resumeTooltip` 区分不复用。`leftnav.tsx` 侧栏折叠按钮 aria-label「Expand sidebar」/「Collapse sidebar」值与既有 `navbar.expandSidebar`/`collapseSidebar` 逐字相同，但本组件 `useTranslations("nav")` 跨命名空间不可复用，故在 `nav` 下另立同名两键（本簇共 +4 键）。判定账一片：`liteadmin/operations.ts` 的 `mode === "read" ? "Read-only." : "Requires..."` 拼进 `description` 系喂给模型的 LiteAdmin 工具描述（144 行注释点明卡片 label 另取 `liteAdmin.operations.<name>`）、翻译改工具协议语义判保留。余两件待续：`ThemeToggle` 切换 label 其专测仅包 `ThemeProvider` 缺 intl provider、需先补双 provider 包裹，`PasswordInput` show/hide aria-label 多消费者共享需先核 pin

验证：`models-and-endpoints` 全 19 文件 246 例加 `leftnav.test` 与 i18n 守卫全绿；tsc 首跑因跨命名空间报 TS2345 两枚、补 `nav` 键后复测回落 883 与 HEAD 同数、触点文件零错；eslint stdin leftnav 7=7、ModelsTableColumns 0=0 增量 0；prettier leftnav HEAD 与当前均 clean、ModelsTableColumns HEAD 既存脏且本簇行未进变更区不动；`npm run build` exit 0；叶子 +4 至 11334、中英同值维持 141。侧栏折叠与 tooltip 均无专测 pin，未翻任何测试。三元口径本簇再接两片、判定账收 operations 一片，余两件（缺 provider 的测试与多消费者 aria）待续，不据本簇宣称该维度归零

## 2026-10-20 第 353 簇更新

开「三元 `? "English" :` 英文字面量分支」补扫口径（条件渲染里直接写死的英文标签，前三条属性/文本/toast 口径均未覆盖此类裸字面量）。命中可见真串两片：`chart_loader.tsx` 的加载态四枚「Loading chart data...」/「Fetching your data」/「Processing date selection...」/「This will only take a moment」与 `ReasoningContent.tsx` 的折叠切换两枚「Hide reasoning」/「Show reasoning」，均收进 `common` 命名空间新增 `chartLoadingTitle`/`chartLoadingSub`/`chartProcessingTitle`/`chartProcessingSub`/`hideReasoning`/`showReasoning` 六键（en 字节一致，zh 分别为正在加载图表数据…/正在获取你的数据/正在处理日期选择…/稍等片刻即可完成/收起推理过程/展开推理过程）；`chart_loader` 由隐式返回箭头改块体并注入 `useTranslations("common")`，`ReasoningContent` 加第二 hook 替换三元两支。同口径余三件待续：`ThemeToggle` label「switch mode」其专测仅包 `ThemeProvider` 无 intl provider、需补双 provider 包裹；`PasswordInput` 的 show/hide aria-label 系多消费者共享件、`provider_specific_fields.test` 有硬断言需先核；`leftnav` expand/collapse sidebar aria-label 已有 `navT` 可直接接、无测试 pin，留待下簇单独成簇

验证：`chart_loader.test`（4 例）与 `ReasoningContent.test`（3 例）从裸 `render` 迁 `renderWithProviders` 并将英文断言翻为对应 zh，加 i18n 守卫 `missingKeys`（1）与 `messagesParity`（8）共 16 例全绿；tsc 全仓 883 与 HEAD 同数、四触点文件 0 错；eslint stdin 计数 chart_loader 2=2、ReasoningContent 0=0、两测试 0=0 与 3=3 增量皆 0；prettier 四文件 HEAD 与当前均 clean；`npm run build` exit 0；叶子 +6 至 11330、中英同值维持 141。三元口径首扫，可见两片已接、余三件（含需补 provider 的测试与多消费者 aria）待续，不据本簇宣称该维度归零

## 2026-10-20 第 352 簇更新

开「JSX 属性英文字面量」补扫口径（placeholder/title/aria-label/alt/label 等硬编码英文属性，前四条虽扫属性值但收口后仍有漏面）。命中 13 处，逐条判：唯一真漏接——`ModelsTableColumns.tsx` 成本行 `label="IN"`，其同列兄弟 OUT 走 `t("table.costOut")` 而 IN 硬编码，复用已存在但从未被引用的死 orphan `models.table.costIn`（en "IN" 字节一致 / zh "输入"）接上、0 新键。其余 12 处判保留入判定账：品牌 alt/title（`leftnav` alt="LiteLLM"、`cloudzero_export_modal` alt="CloudZero"、`CompliancePanel` title="EU AI Act"/"GDPR" 系既有法规专名账）；API 角色 token（`OutputCard`/`InputCard` 的 label="ASSISTANT"/"SYSTEM"，同文件 `lastMessage.role.toUpperCase()` 动态取 server role 原文、硬编码两处是同一 role enum 的静态形态，翻则与动态路径不一致）；协议头/技术单位（`UpstreamTokenHeaderField` placeholder="Authorization" 系 HTTP header 名、`teamTableColumns` label="TPM"/"RPM"）；格式示例占位符（`add_plugin_form` 的 "Productivity"/"workflows"/"search, web, api"/"my-skill"/URL 等示例输入值）；`numerical_input.tsx` 命中在 JSDoc 注释非渲染

验证：ModelsTableColumns 无专测、跑 `models-and-endpoints/` 全目录 16 文件 196 例加 i18n 守卫全绿、类型零错（IN 断言仅 AddModelPanel 表单 label「输入成本…」与本 cost 行 tag 无关、未受影响）；tsc 全仓 883 与 HEAD 同数；eslint ModelsTableColumns.tsx stdin 0=0；prettier 该文件 HEAD 既存脏、本簇行未进变更区故不动；`npm run build` exit 0；叶子不变 11324（复用死 orphan、无新键）、同值不变。属性口径首扫收口，可见漏接已补、余量全落品牌/role/协议单位/示例四类判定账

## 2026-10-20 第 351 簇更新

纯判定簇（无代码改动、无新键）。把 `{...}` 表达式回落串口径的残余命中全量复核分类入判定账：以 `\|\|\s*"[A-Z]` 正则对非测试 `.tsx`/`.ts` 全仓重扫，逐条判为三类——（1）API 错误回落（`networking.tsx` 导出纯函数、`useCloudZeroExport`/`useCloudZeroDryRun`/`useStoreModelInDB`/`useStoreRequestInSpendLogs`/`useAgentTraces`/`useTestMCPConnection`/`fetch_agents`/`LogDetailContent` 的 `... || "Failed..."/"An error occurred"`），经核为 `throw new Error` 或 errorData 透传，与既有 `handleError`/`copyToClipboard` 高扇出重构判定账同类，不翻；（2）数据 enum/分类 token（`PublicModelHub`「Chat」/`RequestLogs`「Success」/`SkillHub`「General」/`autoRouterRows`「Heuristic」/`ComplianceUI`「Uploaded Prompts」/`HealthCheck`「None」×8），随同行 server 原文 enum 渲染、翻 fallback 反不一致，或穿 `toCheckedAtLabel`/`toLastSuccessLabel` util 默认参与初态属高扇出，判保留；（3）代码语料（`CodeSnippets`/`semanticFilterTestUtils` 生成代码/JSON 样例里的 `"Your prompt here"` 等）判语料。可见显示名/alt 类真串已于 349/350 接净，故该口径扫描至此收口

无代码变更，免跑 vitest/tsc/eslint/prettier/build；仅 PROGRESS 账目更新（下一步优先级段已改写三类判保留理由并标 `{...}` 回落串口径收口）

## 2026-10-20 第 350 簇更新

补扫第五簇，续接表达式回落串口径两枚显示名回落：`ByokCredentialModal` 服务显示名三级回退 `server.alias || server.server_name || "Service"` 接 `byokModal.service`（"Service"/"服务"，该 display name 灌入已译的 connectTitle/connectSuccessToast 等 `{server}` 插值位），`prompt_editor_view` 的 `addTool` 解析无函数名时回退「Unnamed Tool」接 `prompts.unnamedTool`（"Unnamed Tool"/"未命名工具"，与 346/349 Unnamed 系列同构）

关键坑：回落值 `serverDisplayName` 被 `.charAt(0).toUpperCase()` 取首字母当头像字，zh「服务」首字「服」作 avatar 亦可、无害；`addTool` 是组件体内闭包 arrow、顶层 `t = useTranslations("prompts")` 在其作用域内可直取（tsc 验证零错）。两串皆无测试 pin、0 翻面。同轮据「数据 enum token 只翻 fallback 反与 server 原文不一致」原则把 `PublicModelHub`「Chat」/`RequestLogs`「Success」/`SkillHub`「General」判保留、`HealthCheck`「None」×8（穿 util 默认参）归高扇出判定账

验证：ByokCredentialModal 2 例加 i18n 守卫 9 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（两文件零命中）；eslint 两文件 stdin 对 HEAD 持平（0=0、4=4）；prettier 两文件 HEAD 与当前皆净、messages HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11324、同值不变。回落串口径余量已收窄（多判数据 token/高扇出账），不据此宣布整体完成

## 2026-10-20 第 349 簇更新

补扫新口径：加第三条正则扫 `{cond || "English"}` / `{... ? "English" : ...}` 表达式内英文回落串（前两条只扫文本节点、抓不到 JSX `{}` 里的），接三枚可见展示回落：`agent_virtual_keys` key 别名回退「Unnamed key」接新增 `agents.unnamedKey`（"Unnamed key"/"未命名密钥"，与 346 `unnamedAgent` 同构）、`CodeInterpreterOutput` 图表 alt「Generated chart」接新增 `playground.generatedChart`（"Generated chart"/"生成的图表"，置 playground 顶层与 `uploadPreviewAlt` 同排）、`MessageDisplay` compare 视图 displayModel 回退「Assistant」复用既有 `playground.chatMessageBubble.assistant`（0 新键）

关键坑：`playground` 命名空间下 `assistant` 有两处（`chat.assistant`、`chatMessageBubble.assistant`，皆 en "Assistant"/zh "助手"）但 MessageDisplay 用顶层 `t = useTranslations("playground")`，须以 `t("chatMessageBubble.assistant")` 点子路径取、不可裸 `t("assistant")`（顶层无此键、missingKeys 会红）。选 `chatMessageBubble.assistant` 因它是 User/Assistant 角色对、语义正合 fallback。三文件皆无测试 pin 这些回落（默认 zh 用例下回落本少触发），无需翻面

验证：agent_virtual_keys 4 例加 MessageDisplay 3 例加 CodeInterpreterOutput 9 例加 i18n 守卫 9 例合 25 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（三文件零命中）；eslint 三文件 stdin 对 HEAD 持平（3=3、4=4、5=5）；prettier 三文件 HEAD 与当前皆净、messages HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11322、同值不变。回落串口径余量待续（Byok/PublicModelHub/RequestLogs/SkillHub/HealthCheck/Compliance 待甄别，networking 错误回落入判定账），不据此宣布整体完成

## 2026-10-20 第 348 簇更新

补扫第四簇，把 `AgentIdentityFields` 服务主体对象 ID 字段的帮助说明整段富文本接 `t.rich`：原文「Open `<a>`Entra Enterprise applications`</a>`, select this application, and copy its Object ID. The App registrations Object ID is a different value.」被一个外链 `<a>` 打断成三个文本节点，新增 `agentIdentity.enterpriseObjectIdHelp`（`link` 标签包原 `<a className="underline" href=entra 门户>`），复用现成 `t = useTranslations("agentIdentity")`，0 测试翻面

关键坑：help 里三个门户专名定译须与本命名空间既有条目对齐——`enterpriseObjectId` zh 已作「企业应用程序对象 ID」、`clientIdDescLink` zh 作「Entra 应用注册」，故 "Entra Enterprise applications"→"Entra 企业应用程序"、"App registrations"→"应用注册"、"Object ID"→"对象 ID"，Entra 品牌保留不译。`<a>` 的 href/target/rel 留在组件 link 渲染函数里、不进消息串，消息串本身无 ICU 特殊字符（无 `'`/`{`/`}`/`#`），`link` 系白名单标签、messagesParity 通过。此簇印证：`{...}` 表达式内、被 `<a>` 打断的多节点 help，两条 JSX 文本正则都抓不全，须逐文件读 description/placeholder 富文本位

验证：agents `_components` 目录 18 文件 160 例加 i18n 守卫全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint AgentIdentityFields.tsx stdin 对 HEAD 计数持平（2=2）；prettier 该文件 HEAD 与当前皆净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +1 至 11320、同值不变。345-348 登记补扫候选全部接净或入账（APIReferenceView SDK 选项卡判框架品牌名入判定账），唯二正则盲区未穷尽，下一轮再放宽正则并逐文件复读，不据此宣布整体完成

## 2026-10-20 第 347 簇更新

补扫第三簇，三枚散落按钮接线：`VectorStoreTester`「Clear History」接新增 `vectorStores.clearHistory`（"Clear History"/"清空历史"）、`pricing_calculator/index.tsx`「Add Another Model」接新增 `costTracking.addAnotherModel`（"Add Another Model"/"添加另一个模型"）、`MCPGatewaySessionsTab`「Disconnect all」接既有 orphan `mcpServers.gatewaySessions.disconnectAll`（"Disconnect all"/"全部断开"，0 新键）。三文件各挂现成 `t`（vectorStores/costTracking/mcpServers）

关键坑：「Disconnect all」按钮带 `aria-label={t("gatewaySessions.disconnectAllSessions",...)}`，`getByRole` 的可及名取 aria-label 而非可见文本，故 `mcp_servers.test.tsx` 的 `/^Disconnect all/`、`/^Disconnect/` 负向断言（view-only 无断开控件）在可见文本改 zh 前后都由 aria-label 决定、不受本簇接线影响、无需翻面；另两文件测试须翻面——`pricing_calculator/index.test.tsx` 四处 `/add another model/i` 改 `/添加另一个模型/`、`VectorStoreTester.test.tsx` 两处 `/clear history/i`（含一处无历史时的负向断言）改 `/清空历史/`。立规：接线前辨清按钮有无 aria-label，有则测试按可及名匹配、可见文本接线不触发翻面

验证：pricing_calculator/vector-stores/mcp-servers 相关 18 文件 175 例加 i18n 守卫全绿、类型零错；tsc 全仓 883 与 HEAD 同数（五文件零命中）；eslint 五文件 stdin 对 HEAD 计数持平（4=4、3=3、2=2、0=0、0=0）；prettier VectorStoreTester/其 test/index.test HEAD 与当前皆净，index.tsx/MCPGatewaySessionsTab HEAD 既存脏、本簇新行未进变更区（MCP 脏区系既有 aria-label 长行）故不动、messages HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11319、同值不变。补扫续推，余 AgentIdentityFields 整段富文本 help（t.rich）与 APIReferenceView 框架专名甄别，不据此宣布整体完成

## 2026-10-20 第 346 簇更新

补扫第二簇，落 agents 域。`agent_info.tsx` 返回按钮 "Back to Agents" 与 `{agent.agent_name || "Unnamed Agent"}` 名称回落串、`agent_form_fields.tsx` 的 `SkillsFieldArray` "Add Skill"/"Remove Skill" 四处裸英文接现成 `t = useTranslations("agents")`。新增 4 键 `agents.backToAgents`（"Back to Agents"/"返回智能体列表"）、`unnamedAgent`（"Unnamed Agent"/"未命名智能体"）、`addSkill`（"Add Skill"/"添加技能"）、`removeSkill`（"Remove Skill"/"移除技能"）

三处辨析：① 既有 `skills.addSkill`（"Add Skill"，`add_plugin_form.tsx` 经 `useTranslations("skills")` 消费）不属 agents 命名空间、跨域不可借，故 `agents.addSkill` 须新立（与 `usage.topModelView` vs `topKeyView` 同构的「每命名空间自持一份」）。② 既有 `agents.backToAgent` 单数（"Back to Agent"）与本页列表返回的复数 "Back to Agents" 字面不同，另立 `backToAgents`，zh 取 "返回智能体列表" 与单数键 "返回智能体" 区分、避免两 en 键同 zh 值。③ "Unnamed Agent" 藏在 `{...}` 回落到，两条 JSX 文本正则（独占一行裸句、`>` 与 `<` 间单行）皆抓不到，补扫内再次印证「已接入文件内部仍有裸英文」。测试翻面：`add_agent_form.integration.test.tsx` 的 `getByRole("button",{name:/Add Skill/})` 系默认 zh 用例下静默通过的泄漏信号，接线后改 `/添加技能/`

验证：agents `_components` 目录 18 文件 160 例（含 agent_info.test/integration、add_agent_form.integration）加 i18n 守卫全绿、类型零错；tsc 全仓 883 与 HEAD 同数（三文件零命中）；eslint 三文件 stdin 对 HEAD 计数持平（9=9、2=2、3=3）；prettier 三文件 HEAD 既存脏、本簇新行未进 prettier 变更区故不动、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +4 至 11317、同值不变。补扫续推，余 pricing_calculator/vectorStore/mcp 散落标签与 AgentIdentityFields 富文本 help、APIReferenceView 框架专名待逐簇甄别，不据此宣布整体完成

## 2026-10-19 第 345 簇更新

第五条 JSX 口径的更宽正则补扫首簇。两条正则（「独占一行的裸大写句、含尾随 `{" "}`」与「`>` 与 `<` 间单行英文」）对非测试 `.tsx` 重扫，命中 usage 域四处真串泄漏接线：`UsagePageView` 全局导出按钮硬编码 "Export Data"、总花费卡片标签 "Project Spend"，`TopKeyView`（`old-usage` 页 legacy 组件、仍 live 渲染）两处视图切换按钮 "Table View"/"Chart View"。新增 4 键 `usage.exportButton`（"Export Data"）、`usage.projectSpend`（"Project Spend"）、`topKeyView.tableView`/`chartView`（"Table View"/"Chart View"）

关键坑：`usage.exportData` 已存在但值为 "Export Usage Data"，与按钮文案 "Export Data" 仅近似，复用会改写可见英文、违反 en 字节一致铁律，故另立 `exportButton`；`topKeyView.tableView`/`chartView` 不跨域复用 `usage.topModelView` 同名键，沿用「每命名空间自持一份」既有惯例。测试翻面：`TopKeyView.test.tsx` 以 `getByRole("button",{name:"Table View"/"Chart View"})` 英文断言共八处（默认 zh-CN 用例下因组件裸英文而静默通过，正是泄漏信号），接线后改 "表格视图"/"图表视图"；`UsagePageView.test.tsx` `getByText("Export Data")` 同类泄漏，改 "导出数据"。立规：接 `t()` 后须 grep 该组件相关测试有无以裸英文作 name/text 的断言，一并翻面

验证：TopKeyView.test 加 UsagePageView.test 40 例加 i18n 守卫（missingKeys 1、messagesParity 8）合 83 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（两测试文件命中均系既有 mock userContext 形状的 TS2345/TS2322 基线错、非本簇新引，字符串改动不产类型错）；eslint 四文件 stdin 对 HEAD 计数持平（9=9、17=17、8=8、31=31）；prettier 四 `.tsx` HEAD 与当前皆净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +4 至 11313、同值不变。补扫仍推进，余 agent/pricing/vectorstore/mcp 等域散落标签与 `Langchain Py`/`Entra` 疑专名待逐簇甄别接线，不据本报告宣布整体完成

## 2026-10-19 第 344 簇更新

`impact_preview_alert.tsx` 影响范围摘要句被 `<strong>` 与 `{upTo}`/`{keys}`/`{teams}` 插值打断，接 `policies` 命名空间一新键 `impact.affectedSummary`（en "This attachment would affect {upTo}<strong>{keys}</strong> and <strong>{teams}</strong>." / zh "此附件将影响{upTo}<strong>{keys}</strong>以及<strong>{teams}</strong>。"），`keys`/`teams` 复用同域既有 plural 键 `impact.keysLine`/`teamsLine`、`upTo` 复用 `impact.upTo`，`t.rich` 的 `strong` 标签包 `<strong>`，复用现成 `t = useTranslations("policies")`

关键坑：`eslint local/no-large-inline-object-arg` 禁止 4 属性以上对象字面量内联作实参，初版把 `{upTo, keys, teams, strong}` 直接写进 `t.rich(...)` 触发该告警（HEAD 净、本簇引脏 +1），把 values 抽成组件体内命名变量 `affectedSummary` 再传入即消；抽出后 `chunks` 失去 `t.rich` 上下文类型，须显式标注 `(chunks: React.ReactNode) => <strong>{chunks}</strong>` 避免隐式 any。立规：`t.rich` 传 ≥4 values 时先抽 named const、tag 函数补 `React.ReactNode` 参型。测试侧无需翻面：`impact_preview_alert.test.tsx` 11 例早已按 zh 断言（`/3 个密钥/`、`/至多/`、`queryByText(/至多/)` not present），接线前那三段连接词是裸英文泄漏、断言只 pin 强标签内的已译子串，改后 DOM（`<span>` 包 `t.rich` 文本加 `<strong>`）结构不变、断言照绿

验证：impact_preview_alert.test 11 例加 i18n 守卫（missingKeys 1、messagesParity 8）全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint impact_preview_alert.tsx stdin 对 HEAD 计数持平（HEAD 与当前各 2、差 0，唯一实项是 HEAD 既存 filename PascalCase error）；prettier 该文件 HEAD 既存脏（`SampleList` 缩进、`globalAlert`/`defaultNote` 折行），本簇新行净、diff 未触该脏区故不动、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +1 至 11309、同值不变。至此第五条 JSX 口径逐域枚举的真串队列全部接净，余仅 Title Case 卡标题等检测盲区待更宽正则补扫，不据此宣布整体完成

## 2026-10-19 第 343 簇更新

`skill_detail.tsx` 两处内嵌元素句改 `t.rich` 接 `claudeCodePlugins` 两新键：`needMarketplaceSetupHint`（"Don't have the marketplace configured yet? <link>See one-time setup →</link>"，`link` 标签包原 `<span onClick>`）、`addToSettingsHint`（"Or add this to <code>~/.claude/settings.json</code> for a persistent configuration:"，`code` 标签包文件路径常量、该路径两侧同字不翻），复用现成 `t = useTranslations("claudeCodePlugins")`

关键坑：`messagesParity` 含「angle-bracket 只允许属于已登记 rich-text tag」的白名单校验，初版把可点 span 命名 `<setup>` 被该测试红牌拦下（报 `claudeCodePlugins.needMarketplaceSetupHint: <setup>`），改 `<link>`（沿用 AllModelsTab 340 已白名单标签、且语义即导航）即过。立规：`t.rich` 自定义标签名须用既有白名单词（`link`/`code`/`strong` 等），新串先 grep 守卫测试的 tag 清单再定名。`→` 系原 UI 字面、保 en 字节一致留用（非报告 prose，不受禁 → 约束）

验证：skill_detail.test 3 例加 i18n 守卫 12 例全绿（tag 改前 messagesParity 1 红、改 `<link>` 后全绿）、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint skill_detail.tsx stdin 3=3；prettier 源净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11308、同值不变。第五条口径纯文本与富文本两簇仅剩 `impact_preview_alert`（`<strong>` 已白名单、`{isDefault}` 插值打断）一处

## 2026-10-19 第 342 簇更新

`skill_detail.tsx` 三条 prose 引导句接 `claudeCodePlugins` 三新键：`enableSkillCommandIntro`（"Once your proxy is set as a marketplace, enable this skill..."）、`staleCatalogHint`（"If you see \"Plugin {name} not found in marketplace\", update the catalog first:" 带 `{name}`=skill.name）、`registerMarketplaceIntro`（"Run this command in Claude Code to register the marketplace:"）。三句皆 `<p>` 纯文本节点、命令在兄弟 `<pre>`（非内嵌），仅 staleCatalogHint 需 `{name}` 参数；引号串内 "Plugin X not found in marketplace" 系 Claude Code 外部工具的报错字面、判保留不翻，仅 surrounding prose 译 zh

同文件另两处含内嵌元素、本簇不接触留 t.rich 簇：「Don't have the marketplace configured yet? <span onClick>See one-time setup →</span>」可点 span、「Or add this to <code>~/.claude/settings.json</code> for a persistent configuration:」内联 code，连同 `impact_preview_alert` 归 t.rich 待办。接前 grep 双语无 orphan、全库无测试 pin 这三串、无翻面

验证：skill_detail.test 3 例加 i18n 守卫 12 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint skill_detail.tsx stdin 3=3；prettier HEAD 净、三处 prose 折行引脏 `--write` 复净后 test 仍绿、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +3 至 11306、同值不变

## 2026-10-19 第 341 簇更新

`UsagePageView` 963-969 行可复用凭据 tag 前缀提示：原系三段裸文 —— pre「When a reusable credential is used, it will appear as a tag prefixed with」+ `<code>{credentialPrefix}</code>` + tail「in this view.」。既有 orphan `reusableCredentialsTagBody`（恰为 pre 段）与 `credentialPrefix` 早已备好却从没被组件引用（两 key 此前皆 dead）。选 `t.rich` 整句接新增键 `usage.reusableCredentialsHint`（消息内 `<code>{prefix}</code>`，`prefix: usageT("credentialPrefix")` 作参、`code` 标签包 chunks），zh 词序自然（"使用可复用凭据时，它会在此视图中显示为以 <code>凭据：</code> 为前缀的标签。"），优于把整句硬拆 pre/tail 三键；dead 的 `reusableCredentialsTagBody` 不删（删属另一动作、超本簇范围）

接前 grep 全库无测试 pin 此句（`showCredentialBanner` 默认关、`UsagePageView.test` 不断言凭据 banner），无翻面；tsc 类型零错反证 `{prefix}` 参数与 `code` 标签函数签名正确

验证：UsagePageView.test 40 例加 i18n 守卫 3 文件 49 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint UsagePageView.tsx stdin 8=8；prettier 源净（多行 t.rich 合式、无需 --write）、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +1 至 11303、同值不变。余富文本簇 `skill_detail`（四段含 inline `<code>` 命令）与 `impact_preview_alert`（`<strong>` 与插值打断）待 t.rich 接

## 2026-10-19 第 340 簇更新

`AllModelsTab` 虚拟密钥访问指引：两句被 `<a href={uiHref("api-keys")}>Virtual Keys page</a>` 打断的拆分裸英文（个人团队分支与选中团队分支），改 `t.rich` 接 `models.accessViaKeyNoTeam`/`accessViaKeyWithTeam`，消息内用 `<link>…</link>` 标记、withTeam 句带 `{team}` 插值（en 直双引号 `"{team}"` 系 ICU 字面量非转义、zh 用中文引号“{team}”）。取 `t.rich` 而非拆 pre/post 双键是为保词序（zh 把链接置句中），沿用 `LicenseExpiryBanner` 等既有 `{ link: (chunks) => <a …>{chunks}</a> }` 惯例

测试翻面：`AllModelsTab.test` 的 virtual key hint describe 四断言原在 zh 默认 locale 靠裸英文命中，逐个改 zh —— `/create a Virtual Key without selecting a team/i`→`/不选择团队的虚拟密钥/`、两处 `getByRole("link", { name: "Virtual Keys page" })`→"虚拟密钥页面"、两处 `/select Team as "Engineering"/i`→`/团队设为“Engineering”/`；line 317 `queryByText(/To access these models/).not.toBeInTheDocument()` 系负向断言、zh 下永不命中故不动。要点：`getNodeText` 只取 span 的直接文本子节点（pre+post 两段，不含 `<a>` 内文字），故正则须落在 pre/post 段内而非含链接的整句，已逐条验证

验证：AllModelsTab.test 40 例加 i18n 守卫 3 文件 49 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint AllModelsTab.tsx 2=2、AllModelsTab.test.tsx 3=3；prettier 源与测试净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11302、同值不变。余富文本簇 `impact_preview_alert`（`<strong>` 与插值打断）、`usage` 974（`<code>` 前缀）、`skill_detail`（四段含 inline `<code>` 命令）同按 t.rich 推进

## 2026-10-19 第 339 簇更新

`BudgetFallbacksEditor.tsx` 去重：非空分支（77-79 行）硬编码了与空分支（66 行 `{t("blurb")}`）同串的英文，把非空分支裸文本也接 `{t("blurb")}`，复用既有 orphan 键 `budgetEditors.fallbacks.blurb`（en/zh 早备、零新键）。`HealthCheckComponent.tsx` 的 h2 "Model Health Status" 与 p "Run health checks on individual models to verify they are working correctly" 系两行裸 JSX 文本，与同命名空间既有的 `models.health.title`("Health Status")/`description`("Monitor the health...") 措辞不同不可复用，故新增 `models.health.pageHeading`（zh"模型健康状态"）/`pageSubtitle`（zh"对单个模型运行健康检查，确认其正常工作"）保持现渲染字节一致；组件 `t = useTranslations("models.health")` 在 159 行函数体内、作用域可及

`HealthCheckComponent.test.tsx:84/86` 原在 zh 默认 locale 靠裸英文命中（同 335/336 的静默通过即漏翻信号），接后翻成 "模型健康状态"/"对单个模型运行健康检查，确认其正常工作"；`BudgetFallbacksEditor.test` 断言命中空分支已接 blurb、非空分支去重不影响其断言、无翻面

验证：BudgetFallbacksEditor.test 7 例加 HealthCheckComponent.test 11 例加 i18n 守卫 4 文件 27 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（两组件零命中）；eslint 三文件 stdin 对 HEAD 计数持平（0=0/8=8/5=5）；prettier 三源测试文件净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11300、同值不变。第五条 JSX 口径下纯文本 help 句已接一批，余四簇富文本（AllModelsTab/impact_preview_alert/usage 974/skill_detail，含 `<a>`/`<code>`/`<strong>` 与插值打断）须按 t.rich 推进

## 2026-10-19 第 338 簇更新

跨四命名空间各一条裸 JSX 帮助句一簇接净：`SCIM.tsx` 的 AlertDescription "You need a SCIM token to authenticate with the SCIM API..." 接 `scim.usingScimDesc`（SCIM 缩写照留）、`logging_settings_view.tsx` 副标 "Active logging integrations and disabled callbacks for this key" 接 `loggingSettingsView.subtitle`、`KeyProjectField.tsx` 的 pending 提示 "The project will be removed when you save..." 接 `keyProjectField.pendingHint`、`ModelInsightsView.tsx` 卡内 "Add a stable session_id to requests..." 接 `modelInsights.sessionHint`（session_id 系请求字段名照留）。四组件各复用现成 `t`（命名空间 scim/loggingSettingsView/keyProjectField/modelInsights），四串皆纯文本节点无内嵌元素、无 ICU 特殊字符

四组件 HEAD prettier 全净、我把两行折一行（SCIM/ModelInsights 的 wrap 句）与单行改长（logging/KeyProject）引脏 → `--write` 复净；eslint 四文件计数持平（5/2/0/0）；接前 grep 双语全无 orphan 故净新增四键。`SCIM.test`/`logging_settings_view.test`/`ModelInsightsView.test` 均不 pin 这四句（SCIM.test 只断言按钮与 Toast 的已接 zh 文案），无测试翻面

验证：SCIM 8 例 + ModelInsights 6 例 + logging_settings_view.test + i18n 守卫 5 文件 27 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（四组件零命中）；prettier `--write` 净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +4 至 11298、同值不变。本簇清一批 help 句，余下队列含 AllModelsTab/skill_detail/usage 974 三处富文本、HealthCheckComponent 标题+副标（test pin 英文需翻面）、BudgetFallbacksEditor（疑 orphan 复用 blurb）、impact_preview_alert

## 2026-10-19 第 337 簇更新

cost-tracking `how_it_works.tsx` 两处折扣计算器说明裸 JSX 文本接线：40 行 `Discounts are applied to provider costs:` 接新增键 `costTracking.calcDiscountAppliedTo`（zh"折扣应用于供应商成本："），其后 `{" "}<code>final_cost = base_cost × (1 - discount%/100)</code>` 系公式代码判保留；98 行 `Enter values from your response headers to verify the discount:` 接新增键 `costTracking.calcVerifyHint`（zh"填入响应头中的数值以验证折扣："）。复用现成 `t = useTranslations("costTracking")`，两句皆纯文本节点（`<code>`/`{" "}` 是兄弟非内嵌，不需 t.rich）

接前 grep 双语无 orphan、故净新增两键；how_it_works.test.tsx 不 pin 这两串、接后 19 例全绿。本簇组件 HEAD prettier 净，我把 `{t(...)}{" "}` 与单行 `{t(...)}` 折行引脏 → `--write` 复净后再跑仍全绿

验证：how_it_works.test 加 i18n 守卫（missingKeys 加 messagesParity）3 文件 19 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint how_it_works.tsx stdin 2=2；prettier `--write` 净、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11294、同值不变。cost-tracking how_it_works 域清零，队列续至 AllModelsTab/skill_detail/SCIM/HealthCheckComponent/logging_settings_view/BudgetFallbacksEditor/KeyProjectField/impact_preview_alert/ModelInsightsView 与 usage 974 富文本

## 2026-10-19 第 336 簇更新

usage `UsagePageView` 四处网关指标裸 JSX 文本接线：469 行 "totals" 版复用 orphan 键 `usage.entity.spendFetchFailed`（与 `EntityUsage` 同串同义）接 `t("entity.spendFetchFailed")`；577 行图注复用 orphan 键 `usage.metrics.successfulHint` 接 `usageT("metrics.successfulHint")`；756 行卡标题 `Gateway Requests by Endpoint` 新增 `usage.gatewayRequestsByEndpoint`（zh"按端点统计的网关请求"）；760 行图注新增 `usage.gatewayRequestsByEndpointHint`（zh"由网关中间件在应答每个请求时统计，涵盖整个部署的 LLM、MCP 与 A2A 端点。"）。`t` 与 `usageT` 皆 `useTranslations("usage")`，两复用两新增、本簇净 +2 叶。974 行凭证提示因英文被 `<code>{usageT("credentialPrefix")}</code>` 打断、须 t.rich 富文本另簇接，不入本簇

系统性发现：335/336 连续撞见 orphan 双语键（`tierTurnsDesc`、`entity.spendFetchFailed`、`metrics.successfulHint` 三枚早已备齐 en+zh 却从不被引用），坐实此 fork 处于「键铺好、组件没接」的半成品态，第五条 JSX 口径漏掉的裸文本里不少本就是待接 orphan。据此固化接前动作：先 grep 双语是否已存（命中即复用、省叶、免近重复），未存才新增。另记检测盲区——首扫多词模式 `[A-Z][a-z]+ [a-z]+` 漏 Title Case 卡标题（`Gateway Requests by Endpoint` 因第二词大写未命中），且 `{" "}`/`<code>` 拆分句被 `-v '\{'` 过滤掉，后续 JSX 扫描须补 Title Case、单行句与拆分富文本句

验证：UsagePageView.test 40 例加 i18n 守卫全绿、类型零错；tsc 全仓 883 与 HEAD 同数（component 零命中）；eslint UsagePageView.tsx 8=8、UsagePageView.test.tsx 31=31；prettier HEAD 净、本簇把四处多行折单行引脏 → `--write` 复净后 40 例仍全绿、messages 两文件 HEAD 既存脏不动；`npm run build` exit 0；叶子 +2 至 11292、同值不变

## 2026-10-19 第 335 簇更新

cost-optimization 域两句裸 JSX 文本接线：`TierTurnsChart.tsx` 的 CardHeader 图注 `Turns each tier served...` 接**既有 orphan 键** `costOptimization.autoRouter.tierTurnsDesc`（en:7767/zh:7766 双语早备好却从不被引用，组件裸渲染英文）；`CostOptimizationView.tsx` 的 spend-fetch 失败 Alert `Fetching spend data failed, so the savings below...` 接**新增键** `costOptimization.view.spendFetchFailedAlert`（zh"拉取消耗数据失败…"），与 usage 侧 `EntityUsage.tsx` 已用的 `spendFetchFailed`（"totals"变体）判为不同屏不同措辞、分键不合并，两组件都复用现成 `t = useTranslations("costOptimization")`

关键坑与启示：`CostOptimizationView.activity.test.tsx:86` 断言 `/Fetching spend data failed/`，在 `DEFAULT_TEST_LOCALE="zh-CN"` 下**靠组件裸渲染英文才命中**（测试静默通过即漏翻信号），接 t() 后 zh 渲染必挂，故翻成 `/拉取消耗数据失败/`；`TierTurnsChart` 图注无测试 pin、纯接线安全。据此立两条接前动作：orphan 双语键说明前序簇只补了 key 未接线，新串先 grep 双语是否已备再决定新增或复用；en 正则在 zh 默认 locale「通过」要警惕是蒙裸英文。`UsageTab` 复核无裸 JSX 文本，判首扫误报不入账

验证：TierTurnsChart/CostOptimizationView/CostOptimizationView.activity/UsageTab 测试加 i18n 守卫 6 文件 50 例全绿、类型零错；tsc 全仓 883 与 HEAD 同数（唯一触及命中在未改动的 TierTurnsChart.test.tsx:172，属基线既有）；eslint 三文件 stdin 对 HEAD 全 0=0；prettier 源与测试净、两个 messages HEAD 既存脏不动；`npm run build` exit 0；叶子 +1 至 11290、同值不变。cost-optimization 域 UsageTab 判误报清零，本簇净新增仅 spendFetchFailedAlert 一

## 2026-10-19 第 334 簇更新

第五条扫描口径开账：`VectorStoreTable.tsx` 的 `EmptyState` 第二行帮助句 `Connect a vector store to enable retrieval-augmented generation.` 接进 `vectorStores.noVectorStoresHint`（zh"连接向量存储即可启用检索增强生成。"），`EmptyState` 已接入用现成 `t = useTranslations("vectorStores")`，并把其空态测试补一行 `getByText` 断言（接前渲染裸英文、断言必红，接后随 zh locale 命中，是有效的回归）

本簇开「JSX 文本节点」第五条扫描口径（`>` 与 `<` 之间的裸英文子文本），前四条口径（toast 首参、属性值、对象英文字面量、模板串）从未覆盖此类，据此纠正第 332 簇「可干净贯穿的 UI 属性/文本长尾就此见底」为「属性/toast 口径耗尽、JSX 裸文本口径尚有余量」。首扫 15 个命中文件逐一读后甄别：真 UI help/空态句待接（`VectorStoreTable`〔334 已接〕、`UsagePageView` 四处、`AllModelsTab` 两处、`cost-tracking/how_it_works`、`KeyProjectField`、`HealthCheckComponent`、`logging_settings_view`、`BudgetFallbacksEditor`、`SCIM`、`impact_preview_alert`、`ModelInsightsView`、`cost-optimization/{UsageTab,TierTurnsChart,CostOptimizationView}`、`skill_detail` 四段散文）；判保留入既有判定账者四类：代码语料（`TracingSetupCard.tsx:140` Python 示例）、服务端凭据元数据（`dynamic_agent_form_fields.tsx:57` 的 `field.label` 来自 `agentTypeInfo.credential_fields`，非 `AGENT_FORM_CONFIG`，`agent_form_fields.tsx` 的 `configText(t, …)` 反查表已接、此处属服务器数据）、格式示例占位符（`numerical_input.tsx` JSDoc 误报、cost 数字 `0.0` 类 `placeholder`）、法规专名（`CompliancePanel.tsx:182-183` "EU AI Act"/"GDPR" 系中英同值品牌/标识，随 `noVectorStoresList` 同级保留）

验证：VectorStoreTable.test 加 i18n 守卫（missingKeys 加 messagesParity）3 文件 21 例全绿、类型零错；tsc 触及路径零命中（全仓 883 与 HEAD 同数）；eslint VectorStoreTable.tsx stdin 2=2 持平；prettier 源与测试净、两个 messages 文件 HEAD 既存脏不动（新行随邻居四空格缩进）；`npm run build` exit 0；叶子 +1 至 11289、同值不变；带括号 `.tsx` 口径不变。JSX 文本口径真串按特性域继续逐簇接

## 2026-10-19 第 333 簇更新

重构阻塞片续接：`networking.tsx` 的 `updateConfigFieldSetting`、`deleteConfigFieldSetting` 两个导出纯 API 函数首参注入 `CommonTranslator`，把两条通用配置 toast（`Successfully updated value!`、`Field reset on proxy`）收进 `common.configValueUpdated`（zh"值更新成功！"）与 `common.configFieldReset`（zh"字段已在代理端重置"），15 调用点贯穿 5 文件——`PluginSettings.tsx`（1，复用既有 `tc = useTranslations("common")`）、`alerting_settings.tsx`（3，加 `commonT`）、`MCPNetworkSettings.tsx`（6，3 update 加 3 delete，加 `commonT`，其调用参数首序是 `token` 非 `accessToken`）、`MCPSubmissionsTab.tsx`（1，加 `commonT`）、`general_settings.tsx`（4，两组件各加 `commonT`，两处 `deleteConfigFieldSetting` 同形串用 allow_multiple 一并改）。取 `common` 命名空间因这两句跨五个异命名空间调用方共享、无单一 feature 归属，且 `common` 已是两侧都接入的通用桶

测试面按全数组/位置读取同步位移：`general_settings.integration.test.tsx` 与 `MCPNetworkSettings.test.tsx` 的 `toHaveBeenCalledWith` 前置 `expect.any(Function),`、`toEqual([[...]])` 内层数组首元素同样前置；`PluginSettings.integration.test.tsx` 三处 `toStrictEqual` 全数组在 `savedPayload()` 返回的调用参数首序补 `expect.any(Function),`。关键坑：`MCPNetworkSettings.test.tsx` 的 `vi.mocked(updateConfigFieldSetting).mockImplementation((_token, fieldName) => ...)` 靠位置读 `fieldName` 门控延迟写入，首参加入后位移会把 `"tok"` 误读进 `fieldName`、令 `finishRangeWrite` 分支永不触发，签名改为 `(_t, _token, fieldName)`；两测试文件因 sed 批量前置引脏，`--write` 复净后 50 例仍全绿

验证：config-field 测试集 81 例、调用方测试（alerting/PluginSettings）18 例、prettier 后复跑 50 例、i18n 守卫（missingKeys 加 messagesParity）全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数）；eslint stdin 对 HEAD 九文件计数持平（325/0/7/3/6/9/0/5/0）；prettier 源文件 HEAD 脏不动、本簇引脏两测试文件 --write 复净；`npm run build` exit 0；叶子 +2 至 11288、同值不变；带括号 `.tsx` 口径不变。networking toast 六条队列至此仅剩 `handleError` 一条（~100 调用点、仅 1 条硬编码 UI Session Expired 句、余皆 errorData 透传）留判定账，`copyToClipboard` 同属高扇出专项重构判定账

## 2026-10-19 第 332 簇更新

UI 属性字面量长尾续接：`SpendByProvider.tsx` 的 `noDataMessage="No provider usage data"` 接进 `usage.provider.noDataMessage`（zh"暂无供应商用量数据"），组件已接入用现成 `t = useTranslations("usage.provider")`，本簇唯一干净串

定向扫描至此确认属性长尾枯竭：全库 `noDataMessage`/`emptyMessage` 空态属性仅此一串、`aria-label` 字面量零命中（全 `{t()}`）、`label=` 命中 `InputCard`/`OutputCard` 的 "SYSTEM"/"ASSISTANT" 系随动态 `role.toUpperCase()` 展示的技术角色标识判保留、`placeholder` 命中 `numerical_input.tsx:22` 系 JSDoc 注释误报（实际代码 34 行早 `placeholder ?? t("numericalPlaceholder")`）、已接入区多词 JSX 文本节点扫描零命中。可干净贯穿的 UI 属性/文本长尾就此见底

验证：SpendByProvider.test 加 UsagePageView.test 加 i18n 守卫 4 文件 74 例全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数）；eslint SpendByProvider 0=0；prettier 净；`npm run build` exit 0；叶子 +1 至 11286、同值不变；带括号 `.tsx` 口径不变。剩余汉化量集中在高扇出共享件（config-field/handleError/copyToClipboard 已入判定账作专项重构）与既有判定账（console/技术标识/查表源值/格式示例），干净接线候选耗尽

## 2026-10-19 第 331 簇更新

toast 队列收口后转"已接入文件仍有英文长尾"口径，UI 属性字面量定向扫描命中四表 `loadingMessage="Loading X…"` 家族（同 322 簇 AgentsTable 形态，组件均已接入、`t` 在 loadingMessage 行作用域）：PassThroughEndpointsTable、OrganizationsTable、MemoryTable、VectorStoreTable

各表以自身命名空间接键：`models.passThrough.table.loadingMessage`、`organizations.tableLoading`、`memory.tableLoading`、`vectorStores.tableLoading`（en 逐字保真含 U+2026 ellipsis、zh 沿用 322 定调"正在加载X…"）。四表 loadingMessage 由字面量换 `t(...)`

踩坑记：passThrough.table 加键时锚 `"table": {\n "modelName"...` 误配到 en:783 的 `models.table`（models.passThrough 在 1741、其 `.table` 实为 1856 且首键 emptyTitle），missingKeys 守卫 `expect(unresolved).toEqual([])` 当场报 `models.passThrough.table|common.loadingMessage` 未解析暴露此错，撤销 783 误加、改投 1856 真实块。教训：嵌套子命名空间加键锚必须含足够上下文锁定父路径，单凭 `"table": {` 加首个易撞键名会落错表；missingKeys 守卫正是兜住这类命名空间错投的网。其余三表用顶层 `"<ns>": {` 唯一锚无此险

测试面零改：Org 测试渲染 loading 态但不断言文案（断言 pagination-range），passThrough/memory/vectorStore 表测无 loadingMessage 文本钉；en 值逐字故 parity 过

验证：organizations 加 memory 加 vector-stores 加 PassThroughSettings 四目录加 i18n 守卫 25 文件 215 例全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数）；eslint stdin 四文件对 HEAD 全持平（1/0/0/1）；prettier 四文件净；`npm run build` exit 0；叶子 +4 至 11285、同值不变；带括号 `.tsx` 口径不变（四表早已接入）。UI 属性字面量长尾续扫：`numerical_input` placeholder "Enter a numerical value"（shared 组件、多消费者）等仍待逐条甄别，余 placeholder 命中（Agent.Invoke/Authorization/RS256/Productivity）判格式/技术示例入判定账

## 2026-10-19 第 330 簇更新

networking 队列第四簇，接 `modelCreateCall`（模型/自动路由/agent 三处共用的创建成功 toast）：`toast.success(\`Model ${formValues.model_name} created successfully\`)`接进`models.addModel.createdToast`（ICU `{name}`取`model_name`，en 逐字等原模板串、zh"模型 {name} 创建成功"），首参 `ModelsAddModelTranslator`（`translators.ts`新增，绑`models.addModel`）

三调用者中 `handle_add_model_submit`/`handle_add_auto_router_submit` 两 handler 早已首收 `t: AddModelTranslator`（=`useTranslations<"models.addModel">`，与 `ModelsAddModelTranslator` 结构同型），直接复用现有 t 零新 hook；唯 `AgentBuilderView.tsx`（playground 建 agent）加第二 hook `addModelT = useTranslations("models.addModel")`（199 行 `handleSaveAgent` 普通箭头非 useCallback 无 deps 负担）

测试面：`AddModelPanel.integration.test.tsx` 的 `vi.mock` 包装器 `modelCreateCall: (accessToken, model) =>` 须同步加首参 `(t, accessToken, model) =>` 转发（否则首参误绑 accessToken），`lastCreatedModel` 取 `calls.at(-1)?.[1]`→`[2]`；`AgentBuilderView.test` payload `calls[0][1]`→`[2]`（其 mock 用 `(...args)` 展开转发免改包装）；`add_auto_router_tab.integration.test` 一处 `toHaveBeenLastCalledWith("token", {...})` 前插 `expect.any(Function)`（此前 grep 漏了 `toHaveBeenLastCalledWith` 形态，单跑暴露）。`handle_add_model_submit.test` 仅 mock 返回值无参数钉零改

验证：AddModelPanel.integration 加 AgentBuilderView.test 加 handle_add_model_submit.test 加 add_auto_router_tab.integration 四文件 142 例全绿、i18n 守卫 9 例全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数，add_auto_router_tab.integration 命中的 535/539/624/630 系既有 overload 债非本簇 810 行）；eslint stdin 八文件对 HEAD 全持平（networking 325、两 handler 14/1、AgentBuilderView 14、三测试 24/0/3、translators 0）；prettier 六源/测试净，AgentBuilderView HEAD 即脏本簇 addModelT 行不入分歧区不碰；`npm run build` exit 0；叶子 +1 至 11281、同值不变；带括号 `.tsx` 口径不变。networking 六条可干净贯穿的真 UI toast 就此接净，余 config-field 两函数（13 调用点跨 5 文件、命名空间各异、测试 toStrictEqual 全数组约 35 处风险过高）与 `handleError`（~100 调用点仅 1 硬编码句）入判定账作专项重构

## 2026-10-19 第 329 簇更新

networking 队列第三簇，接首个 hook 贯穿件 `keyInfoV1Call`：其 `toast.fromError("Failed to fetch key info - " + errorData)` 外层前缀接进 `virtualKeys.keyInfoFailed`（ICU `{error}` 收 raw `errorData` 透传，en 逐字等原拼接、zh"获取密钥信息失败：{error}"），首参 `VirtualKeysTranslator`

串归 `virtualKeys`（密钥特性 UI 命名空间，VirtualKeysTable 主用此），三调用者命名空间各异故需分别供给 VirtualKeysTranslator：`useKeyInfo` hook 按 src/hooks 约定（318/319 先例）首参加 `t` 转交 keyInfoV1Call，唯一组件消费者 `VirtualKeysTable.tsx`（已有 `t = useTranslations("virtualKeys")`）直接传 `useKeyInfo(t, keyId, ...)`；`RequestLogsPanel.tsx`（`logs`）与 `TopKeyView.tsx`（`topKeyView`）各加第二 hook `keysT = useTranslations("virtualKeys")`（324 簇 bannersT 先例）传入。queryFn/普通 handler 非 useCallback 无 exhaustive-deps 负担

测试面比 327/328 更广但轻：`useKeyInfo.test.ts` 建 en translator 作首参（keyInfoV1Call 已 mock 故 t 惰化，318 先例）、三处 `useKeyInfo(KEY_ID)`→`useKeyInfo(t, KEY_ID)`；`TopKeyView.test.tsx` 三处 `toHaveBeenCalledWith("test-token", key)` 前插 `expect.any(Function)`；`VirtualKeysTable.test`（整体 mock hook）与 RequestLogsPanel/usage.test（只 mock 返回值无参数钉）零改。首参右移仅触及真实调 keyInfoV1Call 的 TopKeyView 参数钉

验证：useKeyInfo.test 加 VirtualKeysTable.test 加 RequestLogsPanel.test 加 TopKeyView.test 加 old-usage/usage.test 五文件 105 例全绿（TopKeyView 34）、i18n 守卫 9 例全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数，触及文件命中的均系既有测试类型债如重复属性/mock 形状）；eslint stdin 七文件对 HEAD 全持平（networking 325、useKeyInfo 0、VirtualKeysTable 0、RequestLogsPanel 2、TopKeyView 8、useKeyInfo.test 0、TopKeyView.test 16）；prettier 五源文件净，useKeyInfo.test HEAD 即脏、本簇 createTranslator 行手动改多行式不入分歧区、余脏不碰；`npm run build` exit 0；叶子 +1 至 11280、同值不变；带括号 `.tsx` 口径不变（三消费者早已接入，hook 系 `.ts`）。networking 队列剩余：config-field 两函数（13 调用点跨 5 文件）、`handleError`（~100 调用点最深层）

## 2026-10-19 第 328 簇更新

networking 队列第二簇，接单调用点的 `teamUpdateCall`：其 `toast.fromError("Failed to update team settings: " + unwrapProxyErrorMessage(errorData))` 外层英文前缀接进 `teams.updateFailedToast`（"Failed to update team settings: {error}"，ICU `{error}` 收后端 `unwrapProxyErrorMessage` 透传内容，en 渲染逐字等于原拼接、zh 用全角冒号"更新团队设置失败：{error}"对齐 `routerSettings` 同型先例），首参 `TeamsTranslator`

串并入既有 `teams` 命名空间（兄弟键 `deleteFailed`/`infoTeamSettingsUpdated` 已在此），复用调用者 `TeamInfo.tsx` 组件已有的 `t = useTranslations("teams")`，免加第二 hook。`networking.tsx` 的 `import type` 由第 327 簇的 `PassThroughTranslator` 扩为并列 `TeamsTranslator`

测试面是本簇主体工作量：TeamInfo.tsx 及 TeamInfo 两测试文件里 `teamUpdateCall` 全程被 `vi.fn()` mock、内部 toast 不执行，故零文案翻转，只有首参 t 带来调用签名右移。TeamInfo.test.tsx 十四处 `mock.calls[0][1]`（payload）经 `sed` 定向行翻至 `[0][2]`、两处 `const [, payload]` 解构补空位成 `const [, , payload]`（t 占 index 0）、三处 `toHaveBeenCalledWith("test-token", ...)` 前插 `expect.any(Function)`；TeamInfo.integration.test.tsx 五处 `[0][1]`→`[0][2]` 同法翻转；models-and-endpoints page.integration 仅 mock 不钉参数零改

验证：TeamInfo.test 加 TeamInfo.integration 加 models-and-endpoints.integration 三文件 138 例全绿（索引翻转后 payload 断言全命中）、i18n 守卫 9 例全绿；tsc 触及路径零命中（全仓 883 与 HEAD 同数零新增）；eslint stdin 四文件对 HEAD 全持平（networking 325=325、TeamInfo 28=28、TeamInfo.test 61=61、integration 0=0）；prettier TeamInfo.tsx 与 integration HEAD 即脏、本簇行不在分歧区不碰，networking/TeamInfo.test 双侧净；`npm run build` exit 0；叶子 +1 至 11279、同值不变；带括号 `.tsx` 口径不变。networking 队列剩余：`keyInfoV1Call`（3 调用点含 useKeyInfo hook 先参贯穿）、config-field 两函数（13 调用点跨 5 文件）、`handleError`（~100 调用点最深层）

## 2026-10-19 第 327 簇更新

networking 多调用点重构队列开篇，按"每簇贯穿一函数（函数+其全部调用点+测试）"控风险推进。本簇取 fanout 最小的 `updatePassThroughEndpoint`（仅 1 生产调用点）：其 `toast.success("Pass through endpoint updated successfully")` 首参加 `PassThroughTranslator` 走 `t("updatedToast")`

命名空间取舍：未新开 `networking` 顶层命名空间，而把成功串并入既有 `models.passThrough`（其 createdToast/deletedToast/updateFailedToast 等兄弟 toast 键已在此），既与特性 UI 同域、en 值逐字保真，又复用调用者 `pass_through_info.tsx` 组件已有的 `t = useTranslations("models.passThrough")`（免加第二 hook）。`translators.ts` 补 `usePassThroughTranslator`/`PassThroughTranslator`（绑 `models.passThrough`，与既有 `.table` 子命名空间并列）。updatePassThroughEndpoint 三参加 t 后为四参、恰在 max-params 上限内不触 error

`pass_through_info.integration.test.tsx` 三处位置钉随首参右移（`lastPayload` 的 `calls.at(-1)?.[2]`→`[3]`、accessToken `[0]`→`[1]`、endpointPath `[1]`→`[2]`，同 325 簇 ARG 索引 +1 先例），该测试 `vi.mock("./networking")` 替身不跑真函数故 toast 文案不入断言、零逐字翻转

验证：pass_through_info.integration 加 i18n 守卫 3 文件 18 例全绿（9+9）；tsc 触及路径零命中（全仓 883 与 HEAD 及第 326 簇同数、零新增）；eslint stdin 四文件对 HEAD 全持平（networking 325=325 既有告警、pass_through_info 6=6、translators 0、integration 1=1）；prettier 四文件双侧净；`npm run build` exit 0；叶子 +1 至 11278、同值不变；带括号 `.tsx` 口径不变（networking.tsx 模块函数走 translator 首参不带入括号调用）。networking 队列剩余：`teamUpdateCall`（1 调用点但 TeamInfo.test 约 25 处 payload 索引钉）、`keyInfoV1Call`（3 调用点含 `useKeyInfo` hook 需先参贯穿）、`updateConfigFieldSetting`/`deleteConfigFieldSetting`（13 调用点跨 5 文件）、`handleError`（~100 调用点，最深层待专项）

## 2026-10-19 第 326 簇更新

第 308/311 簇登记的 helpers label 重构阻塞片落地。`claude_code_plugins/helpers.ts` 六个来源解析函数（`parseSkillSource`/`parseGitHubSource`/`buildGitSourcePreview`/`parseRawGitSource`/`parseSshSource`/`parseArchiveSource`）与末路 `getSourceDisplayText` 首参贯穿 `SkillsTranslator`，把渲染进技能详情/新增表单预览的 `label`（如 "GitHub repo — {org}/{repo}"、"Zip archive — {host}{path}"）与 `getSourceDisplayText` 兜底句 "Unknown source" 收进 `skills.sourceLabel.{githubRepo,githubSubdir,gitRepo,gitSubdir,zipArchive}` 五键加 `sourceUnknown`（en 逐字保真、zh 镜像仓库/子目录/Zip 压缩包/未知来源，brand 位 Git/SSH 为协议标识不译）

`buildGitSourcePreview` 加首参后触 `max-params` error，同 323 簇 `withAgentIdentity` 手法把 `kind/repoUrl/repoName` 三末参收成 `repo: { kind; url; name }` 一对象降回 3 参（两调用点 `parseRawGitSource`/`parseSshSource` 同步改传对象，label 内 `brand: repo.kind` 取值不变）。消费者 `skill_detail.tsx` 加 `skillsT = useTranslations("skills")` 传 `getSourceDisplayText(skillsT, source)`，`add_plugin_form.tsx` 两处 `parseSkillSource(t, ...)`（该文件既有 skills hook）。`helpers.test.ts` 按 318 先例建 en translator 作首参、逐字钉全保（en 值同值零改，94 例绿）；`add_plugin_form.test.tsx` 五处 preview label 正则钉（`/GitHub repo/` 等）按 WORKFLOW 第五步随 zh locale 翻中（`/claude-code 仓库/`、`/Git 子目录/`、`/Zip 压缩包/` 等，锚 label 前缀避 `—` 与品牌位歧义）

验证：claude_code_plugins 加 skills 两目录 5 文件 122 例全绿（helpers.test 94、add_plugin_form.test 19、余三文件 9）；i18n 守卫 parity/missingKeys 9 例全绿；tsc 触及路径零命中（全仓 883 系 returnUrlUtils/roles/top_key_view 等 HEAD 既有测试类型基线，与本簇无关）；eslint stdin 五文件对 HEAD 全持平（helpers 重构后回 2=2 告警、max-params error 清零；skill_detail 1 err 1 warn、add_plugin_form 1 err 均 HEAD 既有）；prettier helpers.test 本簇引脏 `--write`、en/zh/add_plugin_form HEAD 即脏本簇行不在分歧区不碰；`npm run build` exit 0；叶子 +6 至 11277、同值不变；带括号 `.tsx` 口径不变（新接文件 helpers 系 `.ts` 走 translator 注入，skill_detail/add_plugin_form 早已接入）。下一片候选：networking toast 七条重构片（本簇后唯一登记的「需重构非翻译」阻塞件）与已接入文件"仍有英文"长尾逐片甄别

## 2026-10-19 第 325 簇更新

全库 toast 字面量定向扫描（跨行版，补第 319 簇单行口径漏掉的换行调用）命中 13 处：6 个 llm_calls 模块函数 catch 内 `toast.fromError(\`Error occurred while ...\`)`、networking 7 条（重构阻塞照旧判留）。关键发现：目录 `playground.llmCalls.errorGeneratingResponse` 等既有键**零消费者**——早期铺键后 toast 逻辑移进了 llm_calls 文件自身仍写死模板串，是同 312/321 的"键铺好接线漏"形态

接线：anthropic_messages/responses_api 复用 `errorGeneratingResponse`（en 逐字同值）、image_generation 复用 `errorGeneratingImage`、interactions_api 复用 `errorInteractionsApi`；audio_speech 串是 "generating speech"（目录只有 generating audio）、embeddings_api 是 "making embeddings request"（目录是 generating embeddings），原文不同按口径另开 `errorGeneratingSpeech`/`errorMakingEmbeddingsRequest` 两新键。六函数首参加 `PlaygroundTranslator`（320 簇模块函数先例），`catch(error)` 为 unknown 按 278 教训传 `String(error)`。消费者 ChatUI 六调用点与 `src/app/chat/page.tsx` 传 t（chat 页加第二 hook `llmT = useTranslations("playground")` 并补进 useCallback deps 消新增 exhaustive-deps 告警）。五个直接测函数的测试建 en translator 加首参；`ChatUI.integration` 与 `chat/page.integration` 钉位置参数的三/四常量（ARG_COUNT 与 INDEX）随首参 +1，`args[1]` 取 updateTextUI 改 `args[2]`

验证：playground 全目录加 chat 加 responses_api 测试加守卫 31+1 文件全绿（309+7 例）、ChatUI.integration 23 例单跑全绿；tsc 触及路径零命中；eslint stdin 十五文件对 HEAD 全持平（chat/page 一度 +1 exhaustive-deps 告警，补 llmT 进 deps 后回 3=3）；prettier 触及七源文件净、ChatUI HEAD 即脏且本簇行不在分歧区不碰；`npm run build` exit 0；叶子 +2 至 11271、同值不变；带括号 `.tsx` 口径 698/912 不变（新接文件多为本已接入或 .tsx 模块函数走 translator 注入）。toast 定向扫描再跑无 llm_calls 残留，剩余真 UI 面转 networking 重构片与已接入长尾逐文件甄别

## 2026-10-19 第 324 簇更新

放宽口径全库甄别转整齐件：全库 7 个 `<DeprecationBanner featureName="...">` 字面量（workflows/prompts/memory/old-usage/api-reference/playground 的 Agent Builder/MCPNetworkSettings），featureName 渲染进已接入的 `banners.deprecation.title/body` 的 `{feature}` 占位，中文界面混排英文特性名。收进 `banners.deprecation.feature*` 七键（zh 沿用目录既有定译：智能体构建器、网络设置、仅限内网、用量、提示词、记忆；API Reference 对齐 `apiReference.pageTitle` 的"API 参考"），四个已接入页加第二 hook `bannersT`（ChatUI `t`+`commonT` 先例），prompts/old-usage/api-reference 三页首次接入 `useTranslations`

同轮甄别判留：AdminPanel 的 `"All IP Addresses Allowed"` 是 IP 列表哨兵值（第 289 簇记录的哨兵先例本体）、非 UI 文案；`cache_health.tsx` 的 `"Error formatting JSON: "` 拼 `JSON.parse` 引擎原生消息进 `<pre>` 诊断区，按聊天气泡 `Error: ${message}` 先例判保留。`banners.deprecation` 的键插入锚用唯一 title 行（close 行全库 6 处重复，按 WORKFLOW 第二步锚点唯一性要求避过）

验证：workflows+memory+prompts+old-usage+api-reference+mcp-servers 六目录加守卫 73 文件 967 通过 + 2 例预期失败；playground page 测试 9 例全绿；tsc 触及路径零命中；eslint stdin 七文件对 HEAD 全持平（MCPNetworkSettings 3=3、余六页 0）；prettier 五页净、playground/MCPNS 两页 HEAD 即脏且本簇行不在分歧区间不碰；`npm run build` exit 0；叶子 +7 至 11269、同值不变；带括号 `.tsx` 口径 695 至 698/912（76.5%，三页首次接入）。下一片候选：bulk_create_users_button、TeamInfo、activity_metrics、view_users 等命中数靠前的已接入文件需逐片读甄别"已接入仍有英文"长尾

## 2026-10-19 第 323 簇更新

第 322 簇登记的 sink 贯穿片落地。`validateKillSwitchBody(t, text)` 加首参 AgentsTranslator：`Body must be a JSON object` 走新键 `bodyObjectError`，parse 用同值常量 `BODY_NOT_OBJECT` 匹配；`JSON.parse` 的 SyntaxError 原生消息是引擎技术诊断（测试 `toMatch(/JSON/)` 钉即此路），按 318/319 先例保留透传，`bodyJsonError` 只兜非 Error 抛出。`buildIdentityParams(t, ...)`/`withAgentIdentity(t, ...)` 两条 Entra throw 转 `identityFieldsRequired`/`identitySpRequired`（Entra/Object ID 品牌与字段名保留），reason 经 add_agent_form catch 的 `createAgentFailedReason {reason}` 进 toast 是真 sink

`withAgentIdentity` 加 t 后触 `max-params` error，把 `existing/cardEdited` 两末参收成 `state?: { existing?, cardEdited? }` 保 4 参（`!existing ||` 的 undefined 语义不变：不传 state 与不传 existing 同为"无既有卡"）。`buildKillSwitchFromForm/applyKillSwitchToPayload/buildAgentDataFromForm` 链不动——react-hook-form validate 先拦、submit 期 parse 再抛不可达，且 `buildAgentDataFromForm(values: any)` 属第 306 簇登记的 agent_config 大工程，判保留入判定账。`dynamic_agent_form_fields` 的 `"General chat capability"` 是拼给后端 agent_card 的 skills description，判保留。两测试按 318 先例建 en translator 加首参，`toBe("Body must be a JSON object")`/`toThrow("Enter valid Entra")` 等钉因 en 值逐字相同零改

验证：agents 全目录加 i18n 守卫 18 文件 160 例全绿；tsc 触及路径零命中；eslint 七文件 stdin 对 HEAD 除 agent_identity.ts 外全持平、该文件新增 1 error（max-params）以 4 参 options 对象重构清零；prettier agent_identity.ts 本簇引脏 `--write`、add_agent_form/agent_info 脏点 diff 区间（64/78/475、376/432/467）不含本簇行（373、252 附近）不碰；`npm run build` exit 0；叶子 +4 至 11262、同值不变；带括号 `.tsx` 口径 695/912 不变（本簇动的是 `.ts` 与早已接入的消费者）。下一片候选：`api-reference/page.tsx` "The API Reference tab"、`cache_health.tsx` "Error formatting JSON:" 追 sink；bulk_create_users/TeamInfo/activity_metrics 等放宽命中大头需逐片读

## 2026-10-19 第 322 簇更新

放宽口径续取 agents/content_filter 片。甄别结果：`AgentsTable` 的 `loadingMessage="Loading agents…"` 与 `AgentFormKit.tsx` 两组件、`content_filter/TagsInput.tsx` 的 `emptyText = "No matching options"` 默认参数是真 UI 漏接（组合框空态与表加载行，无调用点显式传值）；`agent_form_fields.tsx` 的 "Unique identifier for the agent" 是 `agent_config.ts` FIELD_TEXT_KEYS 查表源键（第 306 簇消费面已接）、判误报；`kill_switch_config.ts`/`agent_identity.ts` 的 throw 句追 sink 后判入下一簇（validate 进表单错误要接，但需贯穿首参、单列成片）

键 3 条：`agents.tableLoading`（"Loading agents…"，与既有 `agents.loadingAgents` "Loading agents..." 三点版是不同 sink 不同原文，按口径分键不复用）、`agents.noMatchingOptions`、`guardrails.noMatchingOptions`（zh 均镜像 vectorStores 先例"没有匹配的选项"）。组件侧 `AgentFormKit`/`TagsInput` 两文件首次加 `useTranslations`，默认参数改 `emptyTextProp ?? t(...)` 保调用点覆盖能力。`TagsInput.test.tsx` 原用裸 `render` 挂 hook 后 5 例全红 context missing，按 WORKFLOW 第五步换 `renderWithProviders`（该 harness 不钉英文空态串、zh 钉下零断言改动）

验证：agents 全目录加 content_filter 全目录加 i18n 守卫 28 文件 238 例全绿；tsc 触及路径零命中；eslint stdin 四文件对 HEAD 2/1/0/0 全持平；prettier AgentsTable 脏点系 HEAD 既有块（38-40 行）不碰、TagsInput.test 本簇 85 行引脏按 313 先例 `--write`；`npm run build` exit 0；叶子 +3 至 11258（即时 node 复算）、同值不变；带括号 `.tsx` 口径 693 至 695/912（76.2%，`AgentFormKit.tsx` 与 `TagsInput.tsx` 两片首次接入）。下一片候选：kill_switch 两条校验句与 agent_identity 两条 throw 贯穿首参（sink 分别表单错误与 create toast 的 {reason}）；`useLiteAdmin`/`networking`/`helpers.ts` 重构片照旧

## 2026-10-19 第 321 簇更新

toast 队列见底后转放宽口径甄别。先复核第 314 簇点名的两片：`policies/EvaluationSettingsModal` 命中串在 `DEFAULT_SCHEMA`（喂模型的 json_schema 载荷）、`TransformRequestPanel` 命中串在 textarea 种子的示例请求 JSON（payload 演示语料），两处 UI 面早已接净，均判误报入判定账。过滤重扫（排 className/console/data 语料）在 cost-tracking 片捞出真 UI：`useBlockUnpricedConfig` 开关两条 `toast.success`、`useMultiCostEstimate` 两条失败回落（`Failed to estimate cost`/`Network error`，经 `multi_cost_results` 的 `e.error` 落 DOM）、`provider_margin_table` 的 `emptyMessage="No provider margins configured"`（孪生折扣表早接 `t("noDiscounts")`，目录 `noMargins` 键已在，同 312 簇 aria 的标准漏接补全）

hook 接线沿用首参/props translator 约定：`UseBlockUnpricedConfigProps` 加 `t: CostTrackingTranslator`（`translators.ts` 已有），`useMultiCostEstimate(accessToken, t)` 追加末位形参（319 簇先例），两 `useCallback` deps 补 `t`。消费者 `cost_tracking_settings.tsx` 与 `pricing_calculator/index.tsx` 本就持 `useTranslations("costTracking")`，调用点直接传。新键 4 条进 `costTracking` 扁平段（`blockUnpricedBlockedToast`/`blockUnpricedAllowedToast`/`estimateFailed`/`networkError`，en 值逐字不变；zh 沿用同段 `blockUnpriced` 的"未配置定价的模型"措辞；`networkError` 与 `common.networkError` 值不同句、按口径另开不复用）。margin 表空态一处测试钉随接线翻中文（镜像折扣表同位钉）。两 hook 测试按 318 先例建 `createTranslator({locale:"en",namespace:"costTracking"})` 传参，既有正则/等值钉因 en 目录值逐字相同零改

顺带修一处 HEAD 既有红灯：`cost_tracking_settings.test.tsx` 头注写明"mock 子 hook 免网络"却漏 mock `use_block_unpriced_config`，真实 `apiClient` 让挂载 effect 的 `Promise.all` 在本机不结算、`isFetching` 永真，7 例依赖表格/空态的用例全挂（HEAD 基线单跑复现，与翻译无关）。补上该 mock 后 7 红清到 1：剩余 `still in flight` 一例断言全过但 RTL teardown 卡死到超时（React 19 act 队列在 jsdom cleanup 死锁的既有环境问题），登记为已知红灯、非本簇引入

验证：cost-tracking 整目录加 i18n 守卫 19 文件 215 例 214 通过、1 例为上述 HEAD 既有 teardown 死锁（HEAD 起红、插桩判定测试体全过、卡在 cleanup）；tsc 触及路径零命中；eslint 八文件 stdin 形式对 HEAD 全持平（0/0、0/0、6/6、2/2、4/4、10/10、1/1、2/2）；prettier 三文件本簇行引脏按 313 先例 `--write` 收齐、`index.tsx` 脏点在 HEAD 既有块不碰；`npm run build` exit 0；叶子 +4 至 11255（即时 node 复算）、同值不变；带括号 `.tsx` 口径 693/912 不变。放宽口径下一片候选：`agent_config.ts` 的表单配置（48 命中大头、306 簇记单列后续工程）与 `AgentsTable` "Loading agents…"、`AgentFormKit`/`TagsInput` "No matching options" 等短句需逐条追 sink

## 2026-10-19 第 320 簇更新

定向 toast 扫描续取 `playground/llm_calls/image_edits.tsx` 与 `audio_transcriptions.tsx`（模块级 async 函数的 `.tsx`，无 React 上下文）。每文件三处 user-facing 串：成功 toast `Successfully processed ${n} images`（仅 n>1 时触发）、失败 toast 前缀 `Image edit failed: ${errorMessage}`/`Audio transcription failed: ${errorMessage}`、errorMessage 的默认回落 `Failed to edit image(s)`/`Failed to transcribe audio`（同样进 toast）。判保留：`throw new Error("No transcription text in response")` 是技术诊断串、作动态值 `{error}` 透传，同判入 toast 但非 `t()` 可及的静态面；两处 console.error 前缀同判保留

沿用 318/319 react-hook 首参 translator 约定：两函数首参加 `t: PlaygroundTranslator`（`translators.ts` 已有此类型），消费者 `ChatUI.tsx` 第 134 行本就 `useTranslations("playground")`，两调用点加 `t,`。新增 `playground.llmCalls` 六键，en 值经 `intl-messageformat` 实渲染逐字节等于原模板串（成功 toast 用 ICU `plural` `one {# image} other {# images}`，仅 n>1 触发故英文零变化；`image(s)` 的括号为 ICU 普通字符无需转义）；zh 失败串用半角冒号对齐同段 `错误: {error}` 风格，"转录"沿用同段 `errorTranscribingAudio` 用词。`audio_transcriptions.test.tsx` 以 `createTranslator({locale:"en",namespace:"playground"})` 建 t、5 处调用点加首参，既有断言（含两条 `rejects.toThrow` 钉）一字不改即过。全库 grep 确认无其他测试钉这两模块 toast、ChatUI 为该两函数唯一消费者，干净接线簇

验证：audio 测试加 ChatUI 集成加 i18n 守卫 4 文件 36 例全绿；tsc 触及路径仅 ChatUI.integration 的 14 笔 `RegExp not assignable` 存量债（对第 313 簇记录同文件同数，本簇零新增）；eslint 四文件 stdin 形式对 HEAD 5/7/2/31 全持平、零新增；prettier 三文件净、ChatUI 脏点全在 HEAD 既有块且本簇两行不在 prettier 分歧区间（974/1074 附近 diff 为空）；`npm run build` exit 0；叶子 +6 至 11251（即时 node 复算确认）、同值不变；带括号 `.tsx` 口径 693/912 不变（两候选文件经首参 translator 接线，不带入括号调用）。定向 toast 队列就此见底，剩余 `networking.tsx` 与 `claude_code_plugins/helpers.ts` 均判重构阻塞；下一簇回到放宽口径 138 命中继续甄别真 UI（第 314 簇记 `EvaluationSettingsModal`/`TransformRequestPanel` 等仍待逐条甄别）

## 2026-10-19 第 319 簇更新

定向 toast 扫描续取 `prompts/.../conversation_panel/useConversation.ts`（react-query/useState 自定义 hook，未接入）。4 处 user-facing toast：`toast.fromError("Access token is required")`、`toast.fromError("Please fill in all template variables")`、`toast.info("Request cancelled")`、`toast.success("Chat history cleared.")`。throw 的 `No response body`/`HTTP error! status: ...` 经 catch 渲染进聊天气泡 `Error: ${error.message}`，属技术诊断串且部分动态，判保留；第 162/181 行 console.error 前缀同判保留

沿用 318 簇 react-hook 约定：hook 内不调 useTranslations，首参 `t: PromptsTranslator`（`translators.ts` 已有此类型）注入。消费者 `conversation_panel/index.tsx` 把 `const t = useTranslations("prompts")` 上移到解构块之前并传 `t`（hook 是位置参数 `useConversation(prompt, accessToken, t)`，非 props 对象）。新建 `prompts.conversation` 子对象 4 键，`conversation_panel/index.test.tsx` 在带 provider 下渲染、未 pin 这些 toast，零 pin 干净接线

验证：conversation_panel 测试加 i18n 守卫 3 文件 10 例全绿；tsc 触及两路径零错；eslint 两文件 13 告警 0 错（全是流式解析块 134–147 行 max-depth 与 catch 参数 any，本簇 4 处单行 toast 替换不增嵌套不增 any，零新增）；prettier 触及两文件未进脏名单（仅两目录既有手工缩进脏）、不 `--write`；`npm run build` exit 0；叶子 +4 至 11245、同值不变；带括号 `.tsx` 口径 693/912 不变（hook 是 `.ts`，消费者本就接入）。定向扫描余下候选：playground `image_edits`/`audio_transcriptions`（未接入 `.tsx`）；`networking.tsx` 与 `claude_code_plugins/helpers.ts` 仍判重构阻塞

## 2026-10-19 第 318 簇更新

定向 toast 扫描续取 `hooks/policies/useDeletePolicyAttachment.ts`（react-query 自定义 hook，未接入）。`onSuccess`/`onError` 两处 toast：`Attachment deleted successfully`、`Failed to delete attachment`。第 15 行 `throw new Error("Access token is required")` 不进 toast（onError 用固定串、非 `err.message`），判保留；第 26 行 console.error 前缀同判保留

`src/hooks` 全目录 0 个 hook 内部调 `useTranslations`（约定不在 hook 内直接调，且共存测试 wrapper 只给 QueryClientProvider 无 next-intl provider，内部调会抛 context 缺失），故按首参翻译器约定给 hook 加 `t: PoliciesTranslator`（`translators.ts` 已有此类型），toast 走 `t("attach.deletedToast")`/`t("attach.deleteFailedToast")`。消费者 `policies/index.tsx` 第 222 行 hook 调用加 `t,`（其 `t` 即同 `policies` 作用域）；测试 `useDeletePolicyAttachment.test.tsx` 用 `createTranslator({locale:"en",namespace:"policies"})` 建 t 传两处 renderHook，两条 `toHaveBeenCalledWith("Attachment deleted successfully"/"Failed to delete attachment")` 因 en 目录值逐字相同而不改即过。`policies.attach` 段有 `copiedToast`/`createFailed` 等 `*Toast` 命名先例，新增两键同风格

验证：hook 测试加 policies 共存测试加 i18n 守卫 4 文件 14 例全绿；tsc 触及三路径零错；eslint 三文件 15 告警对 HEAD 同法 15（`error: any` 等均存量、本簇零新增——注：eslint 必须在 dashboard 目录跑，仓库根 cwd 下配置不同会给出"No matches found"假象）；prettier 两 hook 文件干净、index.tsx 既有脏块不碰、不 `--write`；`npm run build` exit 0；叶子 +2 至 11241、同值不变；带括号 `.tsx` 口径 693/912 不变（hook 是 `.ts`，且消费者本就接入）。定向扫描余下候选：`useConversation.ts`（`.ts` hook 未接入，含 `Request cancelled`/`Chat history cleared.`）、playground `image_edits`/`audio_transcriptions`（未接入 `.tsx`）

## 2026-10-19 第 317 簇更新

定向 toast 扫描续取 `skills/_components/ClaudeCodePluginsPanel.tsx`（已接入 `useTranslations("skills")`）。`handleDeleteConfirm` try 块内唯一 user-facing 串：成功 toast `Skill "{name}" deleted successfully`；同函数 catch 里第 53/76 行 `console.error("Error fetching/deleting skill:", error)` 是前缀日志（判保留、非 toast 落地），失败 toast 已走 `t("deleteFailed")`。共存测试 `ClaudeCodePluginsPanel.test.tsx` 在 zh locale 下只断言确认框（`/确定要删除技能：/`、`删除`、`取消`）与删除后列表刷新，未 pin 成功 toast，零 pin 干净接线

新增 `skills.deletedToast: "Skill \"{name}\" deleted successfully"`，沿用同段 `registeredToast`/`registerFailedToast` 的 `*Toast` 命名与 `deleteConfirmBody` 的 `{name}` 风格，zh `技能 "{name}" 删除成功`（双引号原样透传，与 guardrail 同类）

验证：共存测试加 i18n 守卫 3 文件 14 例全绿；tsc 触及路径零错；eslint 组件 1 告警（第 61 行 useEffect 缺 `fetchPlugins` 依赖），stash 回 HEAD 同法 2 行（1 告警 + 汇总）一致、本簇零新增；prettier 组件干净（仅两目录既有手工缩进脏，HEAD 同）、不 `--write`；`npm run build` exit 0；叶子 +1 至 11239、同值不变。定向扫描余下候选：`useDeletePolicyAttachment.ts` 与 `useConversation.ts`（均 `.ts` hook 未接入）、playground `image_edits`/`audio_transcriptions`（未接入 `.tsx`）

## 2026-10-19 第 316 簇更新

定向 toast 扫描续取 `components/mcp_tools/ByokCredentialModal.tsx`（已接入 `useTranslations("byokModal")`，同文件错误路径已走 `byokSaveErrorMessage(t, e)` 翻译器约定）。唯一 stray：成功 toast `Connected to ${serverDisplayName}`（`handleConnect` try 块内）。共存测试 `ByokCredentialModal.test.tsx` 仅 pin 了 `toast.error` 的不支持分支，未 pin 本 toast.success，零 pin 干净接线

新增 `byokModal.connectSuccessToast`，沿用同段 `connectTitle: "Connect {server}"` 的 `{server}` 占位名（不另起 `{name}`，保持 arg 名一致），zh `已连接到{server}`

验证：共存测试加 i18n 守卫 3 文件 11 例全绿；tsc 触及路径零错、eslint 组件 0；prettier 组件干净（仅两目录既有手工缩进脏，HEAD 同）、不 `--write`；`npm run build` exit 0；叶子 +1 至 11238、同值不变。定向扫描余下候选：`useDeletePolicyAttachment.ts` 与 `useConversation.ts`（均 `.ts` hook 未接入）、playground `image_edits`/`audio_transcriptions`（未接入 `.tsx`）、`ClaudeCodePluginsPanel.tsx`（helpers label 重构判定之外的本组件 toast）

## 2026-10-19 第 315 簇更新

定向 toast 英文字面量全库扫描取 `models-and-endpoints/.../AutoRouters/AutoRoutersPanel.tsx`（组件已接入 `useTranslations("models.autoRouters")`）。`handleConfirmDelete` 内两处：成功 `Deleted auto router: ${name}`（带 `{name}` 插值）与失败 `toast.fromError(`Failed to delete auto router: ${error}`)`（catch 变量 unknown，按 278 簇教训包 `String(error)`）。两个耦合测试（共存 `AutoRoutersPanel.test.tsx` 与消费者 `AutoRoutersTabPanel.test.tsx`）grep 后零 toast pin，是干净接线簇

`models.autoRouters` 段有 `deleteTitle`/`deleteBody` 却无 toast 键，新增 `deletedToast`、`deleteFailedToast`，沿用同段 `deleteBody` 的 `{name}` 转义风格；zh 用全角冒号对齐既有 `删除…失败：{error}`（如向量存储行）。`{name}`/`{error}` 均传后端/运行时动态值原样透传

验证：两测试加 i18n 守卫 4 文件 18 例全绿；tsc 触及路径零组件错、测试文件仅 `beforeEach` 与 discriminated-union 两笔存量债（stash 回 HEAD 同测试 2 笔、本簇零新增）；eslint 组件 0；prettier 三文件 HEAD 即脏（目录手工缩进、组件既有脏块），我的两行短 t() 替换不引入新脏、不 `--write`；`npm run build` exit 0；叶子 +2 至 11237、同值不变。定向扫描余下候选：`ByokCredentialModal`（已接入，`Connected to ${serverDisplayName}` 一处）、`useDeletePolicyAttachment.ts` 与 `useConversation.ts`（均 `.ts` hook 未接入，需首参翻译器或判 hook 形态）、playground `image_edits`/`audio_transcriptions`（未接入 `.tsx`）；`networking.tsx` 与 `claude_code_plugins/helpers.ts` 仍判重构阻塞

## 2026-10-19 第 314 簇更新

放宽口径第四片真 UI 取 `policies/_components/index.tsx`（`PoliciesPanel`，作用域已有 `useTranslations("policies")`）。三处英文 toast 全为 `toast.success`/`toast.warning` 用户面：删除成功 `Policy "{name}" deleted successfully`（第 205 行）、护栏创建成功 `Created {n} guardrail(s)! Complete the policy form to save.`（第 378 行，模板串带三元复数）、部分失败 `Failed to create {n} guardrail(s): {names}. You may need to create them manually.`（第 386 行）。全库 grep 确认零测试 pin（`index.test.tsx` 的 guardrail 命中是 mock 数据非断言，`useDeletePolicyAttachment.test.tsx` pin 的是另一文件的另一串），是干净接线簇

键设计：删除带名句复用同段先例 `guardrails.deletedSuccessfully: "Guardrail \"{name}\" deleted successfully"` 的 `{name}` 双引号插值风格，新增 `policies.deletedNamedSuccessfully`（保留原 `deletedSuccessfully` 无名版不动）；两条创建句并入 `policies.select` 子树新键 `createdToast`、`createdFailedToast`，用 ICU `plural`（en `{count, plural, one {# guardrail} other {# guardrails}}`，zh 纯 `{count}`，`#` 跳过、`count` 双侧计片），`{names}` 传 `failedGuardrails.join(", ")`（后端护栏名属动态数据原样透传，ICU 不重解析实参）。`createdToast` en 值沿用同段 `readyToast` 的 `!` 与 `Complete the policy form to save.` 收尾，与既有 zh `模板就绪！请完成策略表单后保存。` 语气对齐

验证：`index.test.tsx` 加 i18n 守卫 3 文件 12 例全绿（stderr 里 `t.rich` 的 `<code>`/`"code"` FORMATTING_ERROR 在第 555 行另一句，HEAD 既有、与本簇无关、测试仍通过）；tsc 触及路径零错；eslint 同法复测 HEAD 13 行对当前 13 行，告警零新增（含 141/156 行 `'t'` exhaustive-deps 系 `fetchPolicies`/`fetchAttachments` useCallback 早已引用 `t` 的存量债，我加的 `t` 都在普通 async handler 里）；prettier 三文件在 HEAD 即脏（目录手工缩进、组件既有脏块），我的行沿用既有风格不 `--write`；`npm run build` exit 0；叶子 +3 至 11235、同值不变；带括号口径接入 693/912 不变（该文件本就接入）。放宽口径里 `policies/index.tsx` 这片已接净，`EvaluationSettingsModal`/`TransformRequestPanel` 等仍待逐条甄别

## 2026-10-19 第 313 簇更新

放宽口径 138 命中里第三片真 UI 取 `playground/components/chat_ui/uploadValidation.ts`。五个校验错误串（`"{name}" is too large. Maximum size is {max}`、`not a supported attachment/image/audio file. Use ...`、`You can upload at most {count} images`）全经三个消费方 `ChatUI`/`ChatImageUpload`/`ResponsesImageUpload` 的 `toast.error(result.error)` 落地，是真用户面。按首参翻译器约定给 `validateChatAttachment`/`validateImageEditFile`/`validateAudioFile` 及内部 `validateSize` 加 `PlaygroundTranslator` 首参，新增 `playground` 五条 flat 键（沿用同段已有的扁平 `uploadPreviewAlt`/`removeAttachmentAria` 命名，不另开子对象），en 值逐字含文件名两侧的双引号（ICU 只对单引号转义，双引号原样透传，英文渲染零变化）。MIME/扩展名列表（PNG、JPEG、MP3...）是技术 token，中英同形留在句里

配套给 `translators.ts` 补 `PlaygroundTranslator` 类型（此前无 playground 注入型）。`uploadValidation.test.ts` 用 `createTranslator({locale:"en"})` 建共享 t，15 处调用点加首参，4 条 `toContain("too large"/"not a supported attachment"/"at most {N}"/"not a supported image")` 子串断言一字不改即证键路径解析到值（en 目录值含这些子串）

验证：chat_ui 整目录加 i18n 守卫 16 文件 181 例全绿；tsc 触及路径仅 `ChatUI.integration.test.tsx` 的 14 笔 `RegExp not assignable to string`，`git stash` 回 HEAD 复测同位既有 14 笔，属存量测试类型债、本簇零新增；eslint 除 ChatUI 外五文件 0，ChatUI 对 HEAD 同路径 20→20（我加的 `t` 都在普通箭头 handler 里、非 useCallback，不触发 exhaustive-deps）；prettier 仅 `uploadValidation.ts` 一条被加长的签名需折行、`--write` 后确认仅此一处，ChatUI 余下 34 处脏点全在 HEAD 既有块不碰；`npm run build` exit 0；叶子 +5 至 11232、同值 141 不变；带括号口径接入 693/912 不变。放宽口径里还剩 `policies/index.tsx`（guardrail 删除/创建 toast）等几条待逐条甄别

## 2026-10-19 第 312 簇更新

第 311 簇后我判断「t()-swap 队列耗尽」下早了：放宽模板口径重扫（要求反引号内 2 个以上连续英文词、把 `${}` 视为空白，专门捞 3 词阈值漏掉的短句与占位符前后的英文），1289 文件从 9 命中升到 138——多数是 className 碎片、代码语料、agent system prompt 与 `getSourceDisplayText` 一类判定账，但混进了几条真 UI。第 312 簇取 `cost-tracking/_components/provider_margin_table.tsx`：四个行操作 `aria-label` 写死英文（`Save/Edit/Cancel editing/Remove margin for X`），而孪生的 `provider_discount_table.tsx` 早已接 `ariaSaveDiscount` 等四条键，是同段建键、隔壁段写死的标准漏接。补 `ariaSave/Cancel/Edit/RemoveMargin` 四条键镜像折扣值、名词沿用既有 `margin→加成`，en 值逐字不变（叶子 +4 至 11227）

测试:放宽后的口径也提醒我 grep 要跨全 src——`provider_margin_table.test.tsx` 有 4 条正则钉 + 5 条精确串，消费方 `cost_tracking_settings.test.tsx` 另有 1 条 `Remove margin for openai`（该 render 里 displayName 是小写线值 "openai"），首轮只改了本目录那 9 处、漏了消费方那 1 处，cost-tracking 整包跑出 1 红才补上，是「消费者测试别只扫组件目录」的复现教训。共 10 处钉随接线改中文

验证:cost-tracking 整目录 20 文件 222 例加 i18n 守卫全绿;tsc 触及路径零命中;eslint 三文件对 HEAD 各 0/0;prettier 三文件整文件净;`npm run build` exit 0;带括号口径接入 693/912 不变。第 311 簇后那次全量（`src/components`+`src/app`）为 826 文件 10531 例、5 例红全部落在已知并发三件（`LensSetup.integration`、`add_auto_router_tab.integration`、`KeyActivityPanel.integration`），三文件单跑 130 例全绿，零翻译回归。放宽口径捞出的真 UI 短句尚未穷尽，下一簇应继续按「先跨全 src grep 每个候选串、排除 className/语料/prompt 线值、确认 sink 是 UI 再接」的顺序从 138 命中里甄别

## 2026-10-19 第 311 簇更新

模板队列第三片按便宜程度取 `cost-optimization/_components/TierTurnsChart.tsx`（1 串 1 钉），把 `claude_code_plugins/helpers.ts` 那片往后排（下一节说明为何它最重）。DonutChart 的 `label={\`${total.toLocaleString()} total turns\`}`改接`costOptimization.totalTurnsLabel`，值 `{total, number} total turns`：ICU 的 number 格式承接原来 `toLocaleString()`的千分位，en 渲染逐字不变，zh 写"共 {total, number} 次对话"。测试把`toHaveTextContent("4 total turns")` 钉改成中文整句（该用例本就 zh 混排钉，Cheap 75%/复杂 25% 同段）

`tsc` 在 `TierTurnsChart.test.tsx:172` 报一个 mock 对象形状不匹配，`git stash -u` 回 HEAD 复测同位既有，是 README 记的 904 条测试存量类型债之一，本簇零新增

下一片 `helpers.ts` 为什么重：它 6 处 `label:` 拼英文（GitHub repo / GitHub subdir / Git|SSH subdir / Git|SSH repo / Zip archive），`parseSkillSource` 及其四个 parse 子函数全是无 React 上下文的纯 `.ts`，要接就得把 `SkillsTranslator` 首参从 `parseSkillSource` 一路贯到 `parseGitHubSource`/`buildGitSourcePreview`/`parseArchiveSource`；label 最终在 `add_plugin_form.tsx` 的 `t("detected", { label })` 里当值渲染，品牌词 GitHub/Git/SSH/Zip 与 URL、path 都是线值判保留，只有 repo/subdir/archive 三个通名可翻。`helpers.test.ts` 逐字钉了 label 全串（如 line 417 的 `Zip archive — ...aws...zip`），接线要同步改这些结构断言。比它更便宜的 `networking.tsx` 5 个 toast 可先做

验证：TierTurnsChart 用例加 i18n 守卫 4 文件 30 例全绿；tsc 触及路径仅 HEAD 既有债；eslint 两文件 0；prettier 我新增行零脏点（测试文件那 1 处脏在 HEAD 既有块）；`npm run build` exit 0；目录叶子 +1 至 11223、同值 141 不变；带括号口径接入 693/912 不变

## 2026-10-19 第 310 簇更新

模板队列第二片取 `mcp-servers/_components/MCPGatewaySessionsTab.tsx`。三个模块级函数拼英文：`describeTerminateResult` 原先用 `terminated_sessions === 1 ? "session" : "sessions"` 手搓复数、`describeSelector` 拼 `every live session opened by user X` 与 `session X`、告警正文 `Clients holding those sessions must send...` 与确认框 `In-flight requests fail...` 紧跟其后。改成首参 `McpServersTranslator`，新增 `gatewaySessions` 六条键（叶子 +6 至 11222），en 值逐字沿用原句

两处工程决定记一下：其一，复数交给 ICU `{count, plural, one {# session} other {# sessions}}`，zh 侧写成量词短语"已断开 {count} 个会话"，`messagesParity.test.ts` 的 `collectArgumentNames` 把 plural 的 `count` 记作参数、`#` 记作语法跳过，所以两侧参数名都是 count/pid 不报红。其二，结果串和后面的整段说明本来靠 JSX 相邻文本拼接，直接接线会中英混排，各收成一个整句键、把结果/选择器当 `{detail}`/`{scope}` 嵌入，中文语序自由。`forceCloseScope` 的 en 值结尾留了一个空格，配 `{scope}In-flight...` 拼出"worker. In-flight"单空格，新增用例 `describeSelector` 断言 en 拼接整句恰好一个空格，把"尾部空格会不会被 next-intl 吞掉"这个担心钉死（实测不吞）

测试：`MCPGatewaySessionsTab.integration.test.tsx` 用 `createTranslator({locale:"en"})` 建共享 enT，`describeTerminateResult` 用例加 t 参数、断言 en 原值不变，新增 `describeSelector` 组合用例；zh 渲染侧三处钉随接线改中文（`会话 bbbb2222`、两处断开结果告警）

验证：mcp-servers 整目录加 i18n 守卫 44 文件 773 例通过 + 2 例预期失败；tsc 触及路径零命中；eslint 两文件 0；prettier 仅测试文件两行被我加长的表达式（import 与 enT 定义）被要求折行，`--write` 后确认仅此两处；`npm run build` exit 0；带括号口径接入 693/912 不变。模板队列余三片：`TierTurnsChart.tsx`、`claude_code_plugins/helpers.ts`、`networking.tsx` 的 5 个 toast

## 2026-10-19 第 309 簇更新

模板队列第一片取 `model-insights/_components/ModelInsightsView.tsx`（已接入、零钉，最便宜）。两处模板串：`PageHeader` 的副标题 `See which models your gateway used from ${data.start_date} through ${data.end_date}` 与图表 tooltip 的 `${label} · Gateway total ${...}`。新增 `modelInsights.leaderboardSubtitle` / `gatewayTotal` 两条键（叶子 +2 至 11216），en 值逐字沿用原句；日期与模型名是服务端线值，一律走占位符不进目录。zh 副标题按中文语序整句重排（"你的网关在 {start} 至 {end} 期间用过的模型"），没有拆前缀后缀

该文件没有任何测试钉住这两句，所以补一条：`ModelInsightsView.test.tsx` 首个用例断言副标题按 fixture 的 `start_date`/`end_date` 拼出中文整句（期望串从 fixture 取，不硬编码日期），接键前渲染的是英文、这条必红，接后转绿

验证：model-insights 目录加 i18n 守卫 5 文件 32 例全绿；tsc 触及路径零命中；eslint 两文件 0 问题；prettier 新断言行按 printWidth 折行后我新增行零脏点，该测试文件余下脏点（148 到 155）是 HEAD 既有块不碰；`npm run build` exit 0；带括号口径接入 693/912 不变（本文件早已接入）。模板队列余四片：`MCPGatewaySessionsTab.tsx`、`TierTurnsChart.tsx`、`claude_code_plugins/helpers.ts`、`networking.tsx` 的 5 个 toast

## 2026-10-19 第 308 簇更新

第 307 簇后又跑了一次全量（`src/components` 加 `src/app`，`TZ=UTC`，完整日志落 `/tmp`）：826 文件 10530 例，仍只有 `add_auto_router_tab.integration` 与 `KeyActivityPanel.integration` 那两文件 2 例红，单跑全绿，与第 305 簇后的两次结果同一形状，零翻译回归

同轮补了第四条扫描口径：**模板串**。前三条（未接入 `.tsx` 宽口径、非测试 `.ts` 对象属性英文字面量、已接入文件三词盲扫）都抓不到用反引号拼出来的英文句子，第 306/307 簇的 `toolCallArguments.ts` 就是这么漏的。新口径要求引号或反引号内含三个以上英文词，或 `${...}` 之后紧跟小写开头的英文短语，对全库非测试 `.ts`/`.tsx` 跑，1289 文件命中 9 个。分账：`editServerPayload.differential.cases.ts` 与 `PromptCodeSnippets.tsx` 是测试样例与代码语料（判定账），其余 6 个是真实剩余，按钉数与接线成本排队

第 308 簇取 `components/ToolPolicies/ToolPoliciesPanel.tsx`。三处模板串在中文界面直出英文：趋势副标题 `` `+${diff} since yesterday` ``、两条 `toast.fromError(\`Failed to update input policy: ${toMessage(e, "unknown error")}\`)`。新增 `toolPolicies` 四条键（叶子 +4 至 11214），en 值逐字沿用原句所以英文界面零变化；趋势句把正负号留在代码里（`diff > 0 ? \`+${diff}\` : diff`）由 `{diff}` 承接，zh 写成"较昨日 {diff}"，`unknownError`是"未知错误"回落，与`common.unknown`（"未知"）概念不同不复用。实现上有一处结构性小改：`const t = useTranslations("toolPolicies")`原先写在`return`前，而两个`useCallback`与一个`useMemo`在它上面用不到，把声明移到组件开头并给这三处依赖数组加`t`，eslint 该文件 2 降到 0。测试只有一处 toast 钉（`ToolPoliciesPanel.test.tsx`）改中文，副标题无钉

验证：ToolPolicies 四测试文件加 i18n 守卫 8 文件 72 例全绿（首轮并发跑时 `PolicySelect.test.tsx` 假红，单跑 7 例全绿，判定以单跑为准）；tsc 触及路径零命中；eslint 面板 2→0、测试 7→7；prettier 两文件整文件净、目录脏点全在 HEAD 既有块；`npm run build` exit 0；带括号口径接入 693/912 不变。下一片按模板队列取 `model-insights/ModelInsightsView.tsx`（2 串、零钉，最便宜），再 `MCPGatewaySessionsTab.tsx`（含 `describeSelector`/`describeTerminateResult` 两个模块级函数与一处 ICU 复数、2 钉）、`TierTurnsChart.tsx`（1 串 1 钉）、`claude_code_plugins/helpers.ts`（3 串，纯 `.ts` 需首参翻译器）、`networking.tsx` 的 5 个 toast（该文件此前判"API 层不翻"，toast 是真用户面，要单独甄别）

## 2026-10-19 第 307 簇更新

接第 306 簇复扫查出的 `mcp-servers/_components/toolCallArguments.ts`。`validateToolArgument` 原先返回 5 条写死英文（`Please enter ${field.key}`、`Please select a valid ${field.key}`、`Invalid JSON`、`Please enter a JSON object`、`Please enter a JSON array`），`toolArgumentsResolver` 把它们塞进 react-hook-form 的 `message`，工具测试面板在中文界面下显示英文。按首参翻译器约定改成 `validateToolArgument(t: McpServersTranslator, field, value)`，resolver 同步加 `t` 形参；唯一消费者 `ToolArgumentsForm.tsx` 本来就有 `useTranslations("mcpServers")` 的 `t`，一行传进去即可。目录在既有 `mcpServers.toolArgs` 子组下加 5 条键（叶子 +5 至 11210），en 值逐字沿用原英文句、英文界面零变化，字段名统一走 `{key}` 占位符，与同组 `jsonObjectPlaceholder`、`enterKey` 的口径一致；`{key}` 填的是工具 JSON Schema 的属性名，属线值不翻

测试：`toolCallArguments.test.ts` 不再用 echo 桩，改用 `createTranslator({ locale: "en", messages: en, namespace: "mcpServers" })`（仓库既有做法，见 `inheritedGrants.test.ts`），15 处调用点加 `t` 而断言字面量一字未改，这样既证明键路径真能解析到值，也把"目录键被删或改名"变成失败信号。`ToolTestPanel.integration.test.tsx` 的 3 处消息钉（`请输入 message`、两处 `JSON 无效`）随接线改中文，该文件本就钉 zh，接线前必红

验证：mcp-servers 整目录加 i18n 守卫 44 文件 772 例通过 + 2 例预期失败；tsc 触及路径零命中；eslint 四文件合计 1 条 `no-node-access` 警告且落在我改动区间之外（HEAD 既有）；prettier 只有测试文件两行被 `t, ` 撑长的表达式被要求折行，`--write` 后确认改动仅此两处，其余脏点零；`npm run build` exit 0；同值 141 不变。至此第 306 簇"三条扫描口径无真实目标"的结论重新成立，`mcpServers` 一片接净

## 2026-10-19 第 306 簇更新

第 305 簇后先做一次全量复账：`src/components` 加 `src/app` 共 826 文件 10529 例，只有 `add_auto_router_tab.integration`（2 例）与 `KeyActivityPanel.integration`（1 例）红，这两文件单跑全绿，是已知的并发假失败；`LensSetup` 在 `TZ=UTC` 下不再红。除这三例已知噪声外，零翻译回归

复账同时重跑三条扫描口径。未接入 `.ts` 宽口径命中从 19 降到 15，逐文件复核全是判定账：`agent_config.ts`/`guardrail_garden_data.ts` 是查表源值，`costOptimizationUtils.ts` 的 name 是图例 dataKey，`keyActivityData.ts` 的 `Overall Usage` 只挂在 summary 对象上而 `activity_metrics.tsx` 从不读 `.label`（不渲染），`editServerPayload.differential.cases.ts`/`fixtures.ts`/`sampleTrace.ts`/`testInputExamples.ts` 是演示与测试样例，`mcp_tool_blocks.ts` 的 `litellm` 是品牌名，Vault/CyberArk 的 `constants.ts` 命中字段线值，两份 compliancePrompts 是内置护栏样例。但 `agent_config.ts` 那片不是纯判定账：它的 `AGENT_FORM_CONFIG` 显示串仍有消费面直出英文

本簇收这个口。`agent_form_fields.tsx` 三个面板的 `label={field.label}` 改走 `configText(t, field.label)`，49 条查表键全都建过，零新键。凭据字段 `CredentialField` 的 label/tooltip/placeholder 来自服务端 `AgentCredentialFieldMetadata`，判保留；可它自己拼的两条校验句是我们写的英文，`Please enter ${field.label}` 复用现成 `agents.pleaseEnter`，`${field.label} looks incomplete or malformed` 新建 `agents.fieldMalformed`（en 值逐字等于原拼接句，英文界面零变化），`buildValidationPatternRule` 加一个 `fallbackMessage` 形参把消息从组件里传进去，服务端给了 `validation_message` 时仍优先用服务端的

测试：`agent_info.integration.test.tsx` 新增用例，元数据 `validation_message: null` 且值不匹配 `validation_pattern` 时，断言字段下方出现"Agent Runtime ARN 看起来不完整或格式有误"并拦住保存；`add_agent_form.integration.test.tsx` 的 5 个标签钉（Streaming、Push Notifications、Icon URL、Model (Optional)、Make Public）随接线改中文，接线前这些断言必红。`cost_config_fields.tsx` 的 `placeholder={field.placeholder}` 维持不动，成本面板占位符是 `0.0`/`0.000001`/`0.000002` 三个数字格式样例，属数字占位符判定账

验证：agents 目录加 i18n 守卫 19 文件 167 例全绿；tsc 触及文件零命中；eslint 两源文件 0/0，两测试文件 5 条警告全落在我改动区间之外的 HEAD 既有行（`no-large-inline-object-arg`、`no-node-access`）；三个脏文件逐行比对，我新增行零 prettier 脏点；`npm run build` exit 0；目录叶子 +1 至 11205、同值 141 不变；带括号口径接入 693/912 不变（两文件早已接线）。本簇之外新发现一条真实账：`mcp-servers/_components/toolCallArguments.ts` 返回的 `Please enter name`、`Please enter a JSON object` 一类校验句会在 ToolTestPanel 真渲染（有测试钉着英文原文），下一簇处理

## 2026-10-19 第 305 簇更新

garden 最后一刀取 `partner` 分片 28 张：`garden.cards` 表补 28 条 description（叶子 +28 至 11204），`name` 一张都不建键。逐张看过，这 28 个 name 全是品牌名或产品名（Pangea AI Guardrails、AWS Bedrock Guardrails、Lakera Guard、Panther Labs Pixels...），属判定账保留原值，渲染时走 `localizeGuardrailCard` 的回退分支取数据里的英文，en/zh 同屏。en 侧为避开 ICU 撇号转义顺带改写了三条："TypeSafe's..."与"Perplexity's..."式所有格换成 "The ... from TypeSafe/Perplexity"，`deepkeep` 描述里的破折号换成冒号；这是本簇唯一动到英文字面量的地方，改动只落在目录值，数据文件 `guardrail_garden_data.ts` 未改。已知碰撞：`guardrail_garden_detail.test.tsx` 的合成 fixture id 就叫 `bedrock`，会命中目录里真 `bedrock` 条目，但该用例只断言自己传入的 description 与 name，没有对目录值取证，实测仍绿，不加特判。至此 garden 三片（decision_model 5、litellm 22、partner 28）全部接完，guardrail garden 显示层收口

验证：guardrails 整目录加 i18n 守卫 44 文件 349 例全绿；tsc 精确过滤 `guardrail_garden|localizeGuardrailCard` 零命中；本簇只改两个 JSON 目录，无源码改动故无 eslint 账；prettier 对 `en.json`/`zh-CN.json` 报脏，逐块比对确认脏点全在 HEAD 既有缩进块（`followsCostMap`、`model_usage` 一带），我新增的 hunk 内 prettier 零可改；`npm run build` exit 0。下一步转入收尾复账：全量扫描 `src/components` 与 `src/app` 判红灯面，再复跑宽口径与盲扫三套脚本确认剩余命中全为判定账

## 2026-10-19 第 304 簇更新

继续串行推进。garden 第二刀取 `litellm` 分片 22 张内容过滤卡：`garden.cards` 表补 `cf_*`/`block_code_execution` 的 name+description 双语 44 键（叶子 +44 至 11176）。功能标签按语义翻（Denied Financial Advice 拒绝金融建议、Bias: Gender 偏见：性别、Prompt Injection: Jailbreak 提示注入：越狱等），描述整句翻并保留 `SSN`、`SQL`、`e.g. Python, JavaScript, Bash`、`(EN, AU, DE, ES, FR)` 这些技术 token 原样；tags 不建键（品牌/技术词回退）。`cf_bias_racial` zh 初稿繁体"內容"随手修成正体。翻钉 3 处：`guardrail_garden.test.tsx` 的 capped-set 用例原先从原始数据 `LITELLM_CARDS[i].name` 取期望、接线后屏幕是目录中文查不到，改钉 `拒绝金融建议`/`竞品名称拦截` 字面（首末卡），这条也是"测试期望要从渲染面同源取值"的判例

验证：guardrails 整目录加 i18n 守卫 44 文件 349 例全绿；tsc 触及路径零命中；eslint 0；prettier 净；`npm run build` exit 0。下一片是最后的 `partner` 28 张（多含品牌名 Logo 与 providerKey 线值，name 逐张甄别品牌/通名再决定回退或翻）

## 2026-10-19 第 303 簇更新

继续串行推进。garden 分片第一刀取 `decision_model` 5 张：只本地化 `description`（prose 文案），`name`/`tags` 是品牌+模型标识（TypeSafe Jev、pplx-decider、gpt-6-luna、Microsoft-Decision-1、OpenJev）回退原值。向第 302 簇的 `garden.cards` 表加 `dm_*` 五条 description，en 侧顺带去掉了原文的撇号（"TypeSafe's"/"Perplexity's" 改 "The ... from TypeSafe/Perplexity"，避开 next-intl ICU 单引号转义吞字），zh 侧统一"会针对每个请求/响应回答你是或非的问题"。管道首次真实生效：`guardrail_garden_detail.test.tsx` 加一条用真目录渲染 `dm_perplexity`，断言中文描述压过原始英文（`getAllByText(...).length > 0`），证明 `localizeGuardrailCard` 端到端可用

验证：guardrails 整目录 44 文件 349 例全绿；tsc 触及文件零命中；eslint detail.test 0；prettier 净；`npm run build` exit 0。目录叶子 +5 至 11132（en/zh 双侧一致）。下一片按队列取 `litellm` 23 张内容过滤卡（name 是英文功能标签如 "Denied Financial Advice" 可翻，description 整句翻，tags 保留技术 token），再 `partner` 28 张

## 2026-10-19 第 302 簇更新

继续串行推进。按第 301 簇写下的施工边界开 `guardrail_garden_data.ts` 大表，本簇是零新键的使能管道：目录 `guardrails.garden` 加 `"cards": {}` 骨架，`guardrail_garden_data.ts` 导出 `localizeGuardrailCard(t, card)`，用 `t.raw("garden.cards" as never)`（对象路径不在 `NamespacedMessageKeys` 叶子联合里，沿用 `agent_config.ts` 的 `as never` 先例）按 `card.id` 查表，name/description/subcategory/tags 逐项回退原值。三处渲染面统一改走回退视图：卡片（Logo label+标题+描述）、详情（面包屑/标题/两处描述/subcategory 行/tags 标签行/评估表头）、以及最重要的**搜索**——`guardrail_garden.tsx` 的 `filteredCards` 现在对本地化后的显示值做子串匹配，后续簇往目录里加中文键时搜索自动跟随，不需要再碰代码

核实记录：创建预填取 `GUARDRAIL_PRESETS[card.id]` 的 `preset.*`（`guardrail_garden_configs.ts`），与卡片显示串完全解耦，翻译 name 不会污染写入后端的 `guardrail_name`；detail 里 `litellm/{card.id}` 用的是 id，不受影响

验证：guardrails 整目录 41 文件 332 例全绿（行为零变化，零翻钉）；tsc 触及文件零命中；eslint 3 文件 2→0、data 0/0；prettier 除 card.tsx 一处 HEAD 存量长行外全净；`npm run build` exit 0。叶子零新增维持 11127。下一簇按分片加键：先 `decision_model` 5 张（名多为品牌+Decision Model，描述整句翻），再 litellm 23 张、partner 28 张；注意 en 目录值别带撇号（ICU 转义吞引号，第 156 簇教训），可顺手把 "TypeSafe's Jev..." 这类原值措辞改写掉

## 2026-10-19 第 301 簇更新

继续串行推进。`agent_config.ts` 的 48 处扫描命中拆穿后不是漏翻海洋：串是配置源值，翻译机制早已存在于 `agent_form_fields.tsx` 私有的 `configText(t, 源值)` 查 `FIELD_TEXT_KEYS` 表（表里本就覆盖全部 cost 标签/tooltip/面板标题，目录键也是预置好的），只是 `cost_config_fields.tsx` 这个消费者没走查表、直接渲 `field.label`。本簇把 `configText`+`FIELD_TEXT_KEYS` 整表迁到 `agent_config.ts` 导出（字符串归拥有者，破循环引用：`agent_form_fields` 本就 import cost 片），`cost_config_fields` 接 `useTranslations("agents")` 后 label/tooltip 走 `configText`；cost 占位符 `0.0`/`0.000001` 数字样例判保留。`dynamic_agent_form_fields` 的裸 `field.label` 与 `Please enter ${field.label}` 拼句来自 `AgentCredentialFieldMetadata` 服务端元数据，按线值口径整片判保留登记。翻钉 5 处：`add_agent_form.integration` 三片 cost label 查询改中文（每次查询成本（美元）等）

验证：agents 目录 16 文件 150 例全绿；tsc 触及路径零命中；eslint 四文件 13/13、2→0、2→0、3/3 只减不增；prettier 迁移块引号键随 --write 归零（脏是随表搬家的存量），其余两文件脏块 HEAD 存量不碰；`npm run build` exit 0。目录叶子零新增维持 11127（en/zh 双侧一致），同值 141 不变；带括号口径接入 692 升到 693、76.0%（cost_config_fields 首次接线）。`.ts`/盲区账到此只剩 `guardrail_garden_data.ts` 一个真实大数据表

## 2026-10-19 第 300 簇更新

继续串行推进。第 299 簇点名的 `AllModelsTable.tsx` 拆解后比预想轻：模块级 `FILTER_LABELS`/`VIEW_MODE_LABELS`/`ALL_PROXY_MODELS_LABEL` 三常量里前两个早被组件内同名 `filterLabels`/`viewModeLabels`（已接 `t("modelTable.filterLabels.*")`/`t("modelTable.viewModes.all")`）整体遮蔽，是死代码直接删；真正渲染的英文只剩两处——`modelGroupOptions` 首项 label（新开 `modelTable.allProxyModels`，All Proxy Models/所有代理模型）与 `viewModeLabels.current_team`（接预置键 `viewModes.currentTeam`，当前团队模型）。消费者测试钉仅一处：`AllModelsTable.test.tsx` 418 行 view-select 文案改钉"当前团队模型"，目录整包 16 文件 196 例复跑确认无其他列头耦合钉

验证：AllModelsTable+parity+missingKeys 45 例与 models-and-endpoints 整包 196 例全绿；tsc 触及路径零命中；eslint 0/0 与 7/7 持平；prettier 两文件净；`npm run build` exit 0。目录叶子 +1 至 11127（en/zh 双侧一致），同值 141 不变。盲区扫描余量只剩 `agent_config.ts` 与 `guardrail_garden_data.ts` 两个大数据表和 console/演示判定账

## 2026-10-19 第 299 簇更新

继续串行推进。原文件队列见底后改用盲区脚本重扫接入文件（≥3 词英文字符串字面量），55 个命中逐个分诊：大头是 console.error/warn 前缀（ChatUI sessionStorage、old-usage fetchAndSetData、ModelHubTable/public_model_hub "There was an error fetching"、useMcpOAuthFlow、mcp_server_edit、UIThemeSettings、SearchTools/view_users 不可见 query 错误）、SVG path 与查表键（GuardrailViewer、agent_form_fields 的 FIELD_TEXT_KEYS 英文源键）、演示语料与品牌名（ComplianceUI、CustomCodeModal、TracingSetupCard、prompt 语言标签、mcp_connect demo）。真实可见的取两文件成簇

本簇接线：`agent_form_fields.tsx` 四处 skills 校验消息 `required: "Required"` 改 `t("fieldRequired")`（新键 agents.fieldRequired，Required/必填）；`pipeline_flow_builder.tsx` 删模块级 `testSourceOptions` 死常量（组件内 useMemo 版早已 `t("flow.quickChat")/t("flow.allData")`，被同名遮蔽从未生效），默认测试消息种子 `"Hello, can you help me?"` 接 `t("flow.defaultTestMessage")`（新键 en 原值/zh "你好，能帮我一下吗？"）。零翻钉：两侧测试不查这些串

验证：agents+policies+i18n 守卫 361 例全绿；tsc 触及文件零命中；eslint 2→0、13→8 只减不增；prettier 两文件脏块均为 HEAD 存量（FIELD_TEXT_KEYS 引号键、flow builder 内联样式块）不碰，本簇行净；`npm run build` exit 0。目录叶子 +2 至 11126（en/zh 双侧一致），同值 141 不变。下一簇候选：`AllModelsTable.tsx` 的列头兼筛选值四串（图表/列头耦合口径，先扫消费者测试钉）

## 2026-10-19 第 298 簇更新

继续串行推进。`costOptimizationUtils.ts` 的三枚 savings 驱动名（"Compression"/"Prompt caching"/"Auto-router"）兼图表 dataKey 与数据对象键，第 297 簇按图表口径判"留待专门处理"，本簇发现现成的低爆炸半径通道：`CustomLegend` 与 `AreaChart`/`BarChart` 的 tooltip 都已经过共享原语 `chart_tooltip.tsx` 的 `useCategoryName()`，未命中表时回落 `formatCategoryName` 首字母大写。只需给 `CATEGORY_LABEL_KEYS` 加三行映射、`chartLabels` 补三键（en 侧取回落形态 `Compression`/`Prompt Caching`/`Auto Router` 保证英文界面零变化，zh 压缩/提示词缓存/自动路由），数据层与 `SavingsPoint` 键一个不碰。判定登记：`SAVINGS_DRIVERS` 的 name 兼翻译键索引（与第 296 簇 `TYPE_LABEL_KEYS` 同口径）；byDriver 环图标签按 `index="driver"` 逐 datum 渲染、不经 categoryName，留作图表改键形态余量

验证：charts+cost-optimization+ScopedSavingsTab+SavingsTiles+i18n 守卫 26 文件 270 例全绿（无任何测试钉住回落英文，零翻钉）；tsc 触及文件零命中；eslint `chart_tooltip.tsx` 2→0；prettier 净；`npm run build` exit 0。目录叶子 +3 至 11124（en/zh 双侧一致），同值 141 不变；`.tsx` 接入计数不动。下一簇余量只剩两个大工程：`agent_config.ts`（48 命中表单配置表，8 消费者）与 `guardrail_garden_data.ts`（44 命中卡片目录，需先甄别显示名兼匹配值）

## 2026-10-19 第 297 簇更新

继续串行推进。`.ts` 队列取 `useChatHistory.ts`（1 处 title）。"New conversation" 同时是 localStorage 里持久化的种子标题和"首条用户消息后自动改名"的比较哨兵，照 `AdminPanel` 哨兵先例存储侧不翻：导出 `DEFAULT_CONVERSATION_TITLE` 常量替换两处字面量，翻译落在显示层——`ConversationList.tsx` 的行标题与搜索过滤把哨兵值映射成 `t("conversationList.newTitle")`（新键 en "New conversation" / zh "新对话"，与 `emptyHint` 的"开始新对话"用词一致），编辑框预填仍走原始标题

判定登记：`costOptimizationUtils.ts` 的 `SAVINGS_DRIVERS` name 兼图表数据键与图例，按图表簇口径（第 283/287 簇 `categoryLabels` 改键形态）留待专门处理，不入本簇

验证：chat 目录加 i18n 守卫 16 文件 90 例全绿；tsc 触及文件零命中；eslint 两文件 0/0；prettier `useChatHistory` 净、`ConversationList` 本簇 filter 块按输出 --write 归零；`npm run build` exit 0。目录叶子 +1 至 11121（en/zh 双侧一致），同值 141 不变；`.tsx` 接入计数不动（`ConversationList` 早已接入）。下一簇按队列取 `guardrail_garden_data.ts`（44 命中，先甄别显示名兼匹配值）或图表形态的 `costOptimizationUtils.ts`

## 2026-10-19 第 296 簇更新

继续串行推进。`.ts` 队列取 `auto_router_strategies.ts`（4 处 label）：查证 `AUTO_ROUTER_STRATEGIES` 全库零外部消费者、`label` 字段模块内也没人读，是纯死数据，从接口与四个条目里整体删掉。真正的 pill 文案在 `autoRouterRows.ts` 的 `PRESENTERS`/`COMPLEXITY_TYPE_LABELS`（数据层，11 个规范英文标签），渲染面是 `AutoRoutersTableColumns.tsx` 的 `TypeCell` 与 `AutoRoutersPanel.tsx` 删除弹窗两处。按 `ShadowEvalSection` 的查表先例：数据层保持英文规范值不动（`autoRouterRows.test.ts` 的 8 处 `typeLabel` 断言因此零改写），`autoRouterRows.ts` 导出 `TYPE_LABEL_KEYS` 常量表与 `autoRouterTypeLabelKey()` 查找，两处消费者经 `t("models.autoRouters.typeXxx")` 落目录，新开 11 键（`Fuse v2` 两侧同值，同值 140 升到 141）

判定登记：`autoRouterRows.ts` 里 11 个英文值转为查表标签后仍留原文，属"数据层规范值兼翻译键索引"，与 `management_routes`/`auto_router/*` 线值同册

验证：models-and-endpoints+edit_auto_router+add_model+i18n 四路 64 文件 1386 例全绿；tsc 触及路径仅 `AutoRoutersPanel.test.tsx` 两笔（151 `beforeEach` 全局缺失、218 mock 联合类型），stash 回 HEAD 复测同位既有；eslint 四文件 0/0；prettier 三文件净、`AutoRoutersPanel.tsx` 一处 `DialogDescription` 折行为 HEAD 存量漂移不碰；`npm run build` exit 0。目录叶子 +11 至 11120（en/zh 双侧一致）。下一簇仍按 `.ts` 队列：剩余命中大头 `agent_config.ts`（48 处表单配置）与 `guardrail_garden_data.ts`（44 处，需先甄别显示名兼匹配值）、`costOptimizationUtils.ts`（3 处 name 显示名）

## 2026-10-19 第 295 簇更新

继续串行推进。`.ts` 队列取 `key_scope.ts`（3 处 label）：`deriveKeyModelScope` 改首参翻译器形态（`CommonTranslator`，沿用 `translators.ts` 现成别名），三个模块级 scope 常量收纯成 `managementScope(t)`/`readOnlyScope(t)`/`scimScope(t)` 工厂，label 落 `common.keyScopeManagement`（Management/管理）、`keyScopeReadOnly`（Read-only/只读）、`keyScopeScim`（SCIM，两侧同值——品牌缩写不翻，同值 139 升到 140）。两个消费者 `models_cell.tsx` 与 `TeamVirtualKeysTable.tsx` 各加一行 `commonT` 传入；`management_routes`/`info_routes`/`"/scim"` 前缀与 `"all-proxy-models"` 是后端线值判保留。`key_scope.test.ts` 按 echo 翻译器先例改造：`(key) => key` 回显、断言键名，行为契约不变

验证：key_scope+table_cells+team 三目录加 i18n 守卫 36 文件 639 例全绿；tsc 触及路径唯一命中 `TeamVirtualKeysTable.test.tsx` 421 行 TS2741 经 stash 回 HEAD 复测同位既有；eslint `models_cell` 2→0、其余 0/0 只减不增；prettier 三文件净、`TeamVirtualKeysTable` 两处单行 header 超长为 HEAD 存量漂移不碰；`npm run build` exit 0。目录叶子 +3 至 11109（en/zh 双侧一致）；`.tsx` 接入计数不动（两消费者早已接入）。下一簇按 `.ts` 队列取 `auto_router_strategies.ts`（4 处 label），`agent_config.ts`（48 命中的大表单配置表）单列成后续工程

## 2026-10-19 第 294 簇更新

继续串行推进。`.tsx` 侧接净后开 `.ts` 侧新账：388 个非测试 `.ts` 按「对象属性英文字面量」宽口径命中 19 个，逐个甄别后大头是判定账——`editServerPayload.differential.cases.ts`/`__tests__/fixtures.ts`/`sampleTrace.ts`/`testInputExamples.ts` 是测试样例与演示数据，`guardrail_garden_data.ts`/`financialCompliancePrompts.ts` 等是后端数据值，`cacheSettingsFields.ts`/`coordinationRedisFields.ts`/`constants.ts` 命中的是表单字段键 `name:"host"` 一类线值，`mcp_tool_blocks.ts` 的 "litellm" 是品牌名。真实用户可见的第一片是 kill_switch 认证类型

本簇接线：`kill_switch_config.ts` 的 `KILL_SWITCH_AUTH_TYPES` 从 `{value,label}` 表收纯成 `readonly KillSwitchAuthType[]`（label 只有 `KillSwitchFormFields.tsx` 一个消费者，删表不伤线值），消费端加 `AUTH_TYPE_LABEL_KEYS`（`as const satisfies Record<KillSwitchAuthType, string>`）按值查键渲染 `t(...)`。`agents.bearerToken` 复用零新键，新开 `authTypeNone`（en "None" / zh "无"）、`authTypeApiKey`（en "API key header" / zh "API 密钥请求头"）、`authTypeBasic`（en "Basic auth" / zh "Basic 认证"）三键。测试面零翻钉：agents 目录测试只断言 `auth_type` 线值，不查渲染标签

验证：agents 目录 19 文件 166 例加 parity+missingKeys 全绿；tsc 触及文件零命中；eslint 两文件 0/0；prettier 两源文件全绿（目录 HEAD 即脏、本簇行同构不引漂移）；`npm run build` exit 0。目录叶子 +3 至 11106（en/zh 双侧一致），同值 139 不变；`.tsx` 接入计数不动（本簇动的是 `.ts` 与其已接入消费者）。下一簇按 `.ts` 队列取 `key_scope.ts`（3 处 label）与 `auto_router_strategies.ts`（4 处 label）两个选项标签表

## 2026-10-19 第 293 簇更新

继续串行推进。复测确认未接入侧宽口径命中的 14 个文件里，真实剩余只有三枚 ui 原语 aria，本簇一次接净：`sheet.tsx` 的 SheetContent sr-only Close（复用 `common.close` 零新键）、`tooltip.tsx` 帮助图标 aria（新键 `common.helpIcon`，原模块级 `defaultTrigger` 常量移入组件体内以取 hook）、`breadcrumb.tsx` 的 nav aria（新键 `common.breadcrumbAria`）。其余 11 个命中（input-group/chart/alert/card 等 ui 文件的 `>svg<`/`>input<` 标签名、teamTableColumns 的 TPM/RPM 缩写）逐文件读后判为误报或既有判定账

爆炸半径按第 292 簇先例全库扫消费者测试并翻钉：question-circle 帮助图标 5 文件 15 处（StdioAvailability 2、AutoRouterBenchmarksTab 1、key_info_view.budget_display 7、spend_budget_cell 3、InheritedBudgetHint 2）改 `帮助`；走 Sheet 关闭钮的 MemoryDetailDrawer 与 AuditLogDrawer 各 1 处 `/close/i` 改 `/关闭/`；MemoryView 与 UsageExportHeader 的 `close` 钉经单跑确认查的是自有按钮、未动。`tooltip.test.tsx` 与 `breadcrumb.test.tsx` 是原语自身裸 render 测试，包 `LocaleProvider locale="zh-CN"` 后钉改 `帮助`/`面包屑导航`

验证：ui 目录 87 例、`src/lib/i18n` parity+missingKeys 16 例、七笔翻钉文件 104 例、并发假失败两文件加两笔未动 close 钉共 125 例，全绿；`src/components`+`src/app` 全量两轮（10500+ 例）除上述回归外只剩已知噪声（LensSetup 仅 `TZ=Asia/Shanghai` 存量红）。tsc 触及文件 5 处命中经 stash 回 HEAD 复测全部既有；eslint 十二文件只减不增；prettier 全绿；`npm run build` 绿。目录叶子 +2 至 11103（en/zh 双侧一致），同值 139 不变；带括号口径接入 689 升到 692、75.9%

## 2026-10-19 第 292 簇更新

继续串行推进。这一簇是 ui 原语 `dialog.tsx`（DialogContent 的 sr-only Close 与 DialogFooter 默认 Close 按钮，复用 `common.close` 零新键）加两笔补账。宽口径扫 220 个未接入 `.tsx`：teamTableColumns 的 TPM/RPM 是行业标准缩写判保留、networking 残余 4 条是 API 层判定账，未接入大头已尽

补账一：第 291 簇 ResizableSheetContent 接线漏跑其自身裸 `render` 测试（4 红，useTranslations 无 Provider 崩），按 205 先例包 `LocaleProvider locale="zh-CN"` 修复
补账二：dialog hook 波及与历史消费者漏钉一并翻齐——RegenerateKeyModal/public_model_hub/ModelSettingsModal/add_auto_router/LensView/CreateUserButton 的 `Close`/`/^close$/i` 钉改 `关闭`；`KeyAutoRouterUsageTab.integration`（HEAD 存量红，第 272/283 簇接线时漏翻消费者）四钉改 zh（`LLM 支出`/`分类成本`/`估算基线支出`/`（$62.50 / 千轮）`）；`user_info_view.integration` 两处 `Older sessions...` 钉改 `/未记录用户 ID 的历史会话不计入/`（`costOptimization.autoRouter.userScopeNote` 早接）

测试：components 与 app 全量整跑（10500+ 例）验证 dialog 爆炸半径；ui 目录 87 例、五文件 175 例、LensView 与 user_info 42 例全绿；LensSetup 仅 `TZ=Asia/Shanghai` 下的 `/2026-09-30/` 上游存量红（`TZ=UTC` 19 例全绿，头部既记）

验证：tsc dialog 零命中；eslint 九文件只减不增（dialog 1→0）；prettier dialog 与 ResizableSheetContent.test 本簇行按输出 --write 归零，其余 HEAD 即绿；`npm run build` 绿。目录叶子零新增维持 11101（en/zh 双侧一致），同值 139 不变；非测试 `.tsx` 接入 691 升到 692（dialog.tsx）

## 2026-10-19 第 291 簇更新

继续串行推进。长尾清零后按宽口径扫未接入文件(222 个,其中 networking/provider_info_helpers/guardrail_info_helpers/vector_store_providers 等大头是品牌枚举与 API 层判定账),本簇取两个有真实用户可见串的:`provider_discount_table.tsx`(折扣表列头与四枚动作 aria)与 `ResizableSheetContent.tsx`(抽屉原语三枚 aria)

复用与判据:列头 "Discount Percentage" 与空态复用现成 `costTracking.discountPercentageLabel`/`noDiscounts`,新开 `colProvider`/`colActions` 与四枚 ICU aria(`ariaSaveDiscount` 等,`{name}` 带品牌名不翻);ResizableSheetContent 是 ui 原语、唯一消费者 AuditLogDrawer 恒在 LocaleProvider 下渲染,接 `common.resizeDrawerAria/collapseDrawerAria/expandDrawerAria` 三新键。placeholder="5"、"%" 与 JSON 示例判保留;`vector_store_providers.tsx` 全文件品牌枚举值判保留

测试:cost-tracking 整目录 20 文件 233 例加 parity 加 missingKeys 加 AuditLogDrawer 全绿;翻钉 13 处(provider_discount_table.test 四正则五字面串两列头一空态、cost_tracking_settings.test 消费者四钉 `移除 openai 的折扣`、AuditLogDrawer.test 两抽屉 aria);margin 表的 EN aria 钉(`Remove margin for openai`)属未接文件,不动

验证:tsc 本批文件零命中;eslint 只减不增(provider_discount_table 1→0);prettier 四文件全绿;`npm run build` 绿。目录叶子 +9 至 11101(en/zh 双侧一致),同值 139 不变;非测试 `.tsx` 接入 689 升到 691、75.8%,files with hits 269 降到 267

## 2026-10-19 第 290 簇更新

继续串行推进。这一簇是三个文件的接线：`models-and-endpoints/page.tsx`（Last Refreshed 串与刷新 aria）、`UsagePageView.tsx`（导出前置 reject 串）、`MCPToolArgumentsForm.tsx`（枚举空串选项回显 ×2）

复用与判据：新开 4 键（`models.lastRefreshedLabel` ICU `{time}`、`models.refreshModelsAria`、`usage.missingTokenOrRange`、`mcpToolArgs.emptyString`）。本批其余候选核查后全部判归判定账：`UIThemeSettings.tsx` 两处 throw 被 catch 吞掉、toast 用现成键不吃 err.message；`SearchTools.tsx`/`view_users.tsx` queryFn throw 有 enabled 守卫且错误无 UI 消费；`useMcpOAuthFlow.tsx` 三条是 console 前缀；`numerical_input.tsx`/`mcp_servers.tsx`/`TraceDrawer.tsx`/`SidebarUsageCard.tsx`/`RequestDetail.tsx`/`BudgetTable.tsx` 的命中在代码注释；`TeamsTable.tsx` "Admin Viewer" 与 `email_event_settings.tsx` 的 `.includes()` 是后端枚举/匹配串；`models page` 之外 `public_model_hub.tsx` console 前缀

补账：`AddModelPanel.integration.test.tsx` PTU 断言红在 HEAD（第 192 簇 ptuValidation 接线时漏翻该消费者钉），本簇按 271 先例翻成 zh 目录值 `models.addModel.ptuStartRequired` 清零

测试：mcp_tools 90 例、usage components 208 例、models-and-endpoints 29 文件全绿（含修好的 17 例）、parity 加 missingKeys 全绿；翻钉三处（Empty string ×2、PTU 一钉）

验证：tsc 命中 8 与 HEAD 持平（存量旧测试债）；eslint 只减不增（MCPToolArgumentsForm 15→14、UsagePageView 7→1）；prettier 两文件 HEAD 干净、本簇行按输出收拢；`npm run build` 绿。目录叶子 +4 至 11092（en/zh 双侧一致），同值 139 不变；长尾账清零，扫描剩余命中全部归入判定账

## 2026-10-19 第 289 簇更新

继续串行推进。这一簇是四个文件的空态与过滤标签：`OrganizationsTable.tsx`（空态四串）、`BudgetTable.tsx`（过滤值格式化）、`logging_settings_view.tsx`（事件类型徽标标签）、`TeamUserSpendCard.tsx`（无数据文案二串）

复用与判据：`budgets.unlimitedOnly` 现成键接回；两处 "X to Y" 模板归并进新开 `budgets.rangeBetween`（ICU `{from}`/`{to}`）加 `anyValue`（"any"/"不限"），max_budget 与 created_at 两条同构模板共用一键。organizations 新开 4 键、loggingSettingsView 新开 3 键（`successAndFailure` 值含 `&` 属富文本白名单外普通字符,安全）、usage.teamUserSpend 新开 2 键。BudgetTable 的 `"Not set"` 命中在代码注释,非用户可见

测试：organizations 加 budgets 加 EntityUsage 目录加 parity 加 missingKeys 16 文件 219 例全绿；翻钉两处（OrganizationsTable.test 空态标题）；VirtualKeysTable/Teams.test 的同串命中是各自 mockTranslations 桩值,与本簇组件无关不动

验证：tsc 0/0 与 HEAD 持平；eslint 只减不增（logging_settings_view 1→0）；prettier 组织与预算两文件 HEAD 干净、按 prettier 输出收拢,TeamUserSpendCard HEAD 即脏整文件 --write；`npm run build` 绿。目录叶子 +11 至 11088（en/zh 双侧一致），同值 139 不变；本簇把 4 个"已接入仍有英文"文件清零，长尾计减 4 至 2

## 2026-10-19 第 288 簇更新

继续串行推进。这一簇是两处小接线加一批长尾判定：`leftnav.tsx`（logo 链接 aria-label 新开 `nav.homeAria`）、`key_info_view.tsx`（项目未设回显复用现成 `common.notSet`）

判定清单（扫描仍命中但用户可见英文为零或本就不该翻）：`ChatUI.tsx` 的 `Error parsing ... from sessionStorage` 全是 console.error 前缀、`Azure SDK` 是供应商枚举值；`mcp_connect.tsx` 的 "Run available tools"/"Zapier Gmail" 是示例 cURL 演示数据；`TracingSetupCard.tsx` 的 `key_alias: "Agent tracing"` 是发往后端的数据值、Deep Agents/Pydantic AI 是框架品牌、Python 行是示例代码；`LogDetailContent.tsx` 的 `|| "An error occurred"` 回显进日志响应 JSON 载荷（翻了会伪造后端回包形态）、`"Cache OFF"` 是逐字比较哨兵；`TeamInfo.tsx` 是后端错误 `.includes()` 匹配串；`public_model_hub.tsx` 三条是 console.error 前缀；`view_users.tsx` 的 `throw new Error("Access token required")` 两处都在 queryFn、查询错误无任何 UI 消费（只读 isLoading）不可见，与第 287 簇 MemoryView 走 toast 的情形不同，判定保留；`view_user_spend.tsx` 的 "Team Models" 在整段注释掉的 JSX 里、"Default Team" 是 team_alias 比较哨兵

测试：leftnav 加 key_info_view 三文件 141 例加 key_edit_view 消费侧 100 例（含 2 例预期失败存量）加 parity 加 missingKeys 全绿；翻钉五处（leftnav.test `/litellm home/i`→`/litellm 首页/i`）

验证：tsc 命中 39 与 HEAD 持平（全在 key_info_view 旧测试 fixture 存量）；eslint 只减不增（leftnav 6→5、key_info_view 13→10）；prettier 三文件绿；`npm run build` 绿。目录叶子 +1 至 11077（en/zh 双侧一致），同值 139 不变；本簇把 2 个"已接入仍有英文"文件清零，判定文件移入判定账，长尾计减 2 至 6

## 2026-10-19 第 287 簇更新

继续串行推进。这一簇是三个文件：`navbar.tsx`（侧栏折叠按钮 title）、`MemoryView.tsx`（四处 `throw new Error("Access token required")`，mutation 的会经 `toast.error(saveFailedToast {message})` 透到用户，接线）、`EntityUsage.tsx`（日花费图系列名与导出前置错误）

复用与判据：图例复用现成键 `usage.entity.requestCost`/`flatCost`（数据键改 `request_cost`/`flat_cost` id、`categoryLabels` 接线，283 口径；`metrics.spend` 键无图例不可见不动）；导出拒因新开 `usage.selectRangeToExport`；navbar 新开 `expandSidebar`/`collapseSidebar`；memory 新开 `accessTokenRequired`。CustomCodeModal 的 `block("Invalid JSON response")` 等是展示给用户编辑的示例 Python 代码语料，判定不翻；MCPNetworkSettings `Remove ${range}` aria 拼 IP 段数据值，判定保留

测试：navbar 加 memory 加 EntityUsage 目录加 parity 加 missingKeys 13 文件 182 例全绿；翻钉一处（navbar.test `getByTitle("收起侧边栏")` ×2），其余串零测试钉

验证：tsc 命中分布与 HEAD 逐文件一致（46 条全在 EntityUsageExport 旧测试存量，本簇源文件零命中）；eslint 只减不增（EntityUsage 7→5、navbar 4→3）；prettier EntityUsage HEAD 干净、引号键被要求去引号后 --write 归零，其余 HEAD 即绿；`npm run build` 绿。目录叶子 +5 至 11076（en/zh 双侧一致），同值 139 不变；本簇把 3 个"已接入仍有英文"文件清零，长尾计减 3 至 8

## 2026-10-19 第 286 簇更新

继续串行推进。这一簇是三个文件的长尾残余：`KillSwitchFormFields.tsx`（kill switch 表单）、`agent_cost_view.tsx`（智能体成本展示卡）、`HealthChecksTableColumns.tsx`（健康表错误列空态）

复用与判据：`queryValuePh`/`queryNamePh` 现成键接回查询参数占位符（此前误用裸英文 "Parameter name/value"），`removeHeader`/`removeQueryParam`/`keyNameRequired`/`jsonBodyLabel`/`jsonBodyHint` 五新开，`KeyValueFieldArray` 补 `useTranslations("agents")`；`aria-label={`Remove ${addLabel.replace(/^Add /, "")}`}` 是英文正则剥前缀拼 aria 的脆弱写法，中文下必然拼出混语，改显式 `removeLabel` 属性传入。成本卡三行标签新开 `rowCostPerQuery`/`rowInputCostPerToken`/`rowOutputCostPerToken`（不复用带 `($)`后缀的表单键，值列已带`$`前缀，复用会双重标注货币）。HealthChecksTableColumns 的`NEVER_CHECKED`/`NEVER_SUCCEEDED`/`CHECK_IN_PROGRESS`是代理侧逐字比较的排序哨兵值（文件内注释自证），判定不翻、仅接回展示层`noErrors`。MCPNetworkSettings 的 `Remove ${range}` aria 拼的是 IP 段数据值，判定保留

测试：agents 与 model_dashboard 全包 19 文件 188 例 + parity + missingKeys 全绿；翻钉六处（agent_cost_view.test 三标签 ×两测试组）

验证：tsc 本簇文件零命中；eslint 全 0 且 agent_cost_view 较 HEAD 少一条（只减不增）；prettier KillSwitchFormFields HEAD 即脏（早先簇的 `<>` 缩进），整文件 --write 归零；`npm run build` 绿。目录叶子 +9 至 11072（en/zh 双侧一致），同值 139 不变；本簇把 3 个"已接入仍有英文"文件的用户可见英文清零（哨兵值归判定账），长尾计减 3 至 11

## 2026-10-19 第 285 簇更新

继续串行推进。这一簇是四个文件的属性字面量长尾：`cost_tracking_settings.tsx`（成本追踪设置页）、`WorkflowRuns.tsx`（工作流运行页）、`HealthChecksTable.tsx`（模型健康空态）、`ChatMessageBubble.tsx`（聊天气泡生成图 alt）

复用与判据：cost_tracking 五处全复用现成键（`customPricingLabel`/`spendTrackingLabel` 接回 DocsMenu、`getStartedDiscounts`/`getStartedMargins` 接回两处空态、`addMarginDesc` 接回加成弹窗描述，均为早先预置未接的漏账），`REMOVAL_COPY` 常量只剩 `keyof typeof` 用途、title/noun 英文字段是死代码，删除并把 `kind` 改为字面量联合；WorkflowRuns 的 Type/Status 列头复用 `typeLabel`/`statusLabel`；新增 7 键（`workflows.colRun`/`colCreated`/`messagesSection`/`noMessages`、`models.health.noModelsFound`/`emptyHint`、`playground.chat.generatedImageAlt`）。`"proxy_admin" || "Admin"` 角色比较值是后端枚举不翻。UsefulLinksManagement/MemberTable 的 `variant="Open|Edit|Delete"` 与 `e.key === "Enter"` 一类命中经核查是组件 API 与按键码，扫描误报不接

测试：五文件 59 例 + parity + missingKeys 全绿、消费者侧 HealthCheckComponent 与 workflows page.integration 17 例全绿；翻钉三处（WorkflowRuns 抽屉按钮 `/Messages/i`→`/消息/i`、HealthChecksTable `未找到模型`、ChatMessageBubble 两处 `生成的图片`），cost_tracking 测试钉本就在 zh 侧无需动

验证：tsc 本簇文件零新增命中（WorkflowRuns.test.tsx TS2352 为 HEAD 存量，stash 复测同报）；eslint 只减不增（cost_tracking 5→2、ChatMessageBubble 8→7）；prettier 三文件本簇整文件 --write 归零；`npm run build` 绿。目录叶子以新脚本同法复测 HEAD 得 11056（较旧记 11048 差 8 系数组终端计片口径，不回改历史），复算 +7 至 11063（en/zh 双侧一致），同值 139 不变；本簇把 4 个"已接入仍有英文"文件清零，长尾计减 4 至 14

## 2026-10-19 第 284 簇更新

继续串行推进（补记：本簇当时只更新了头部叶子链，正文条目漏写，现回补）。这一簇是 `SearchConnectionTest.tsx`（搜索工具连接测试页）。新增 16 键（`testSuccessToast`/`unknownErrorOccurred`/`unknownError`/`authFailedDetail`/`authErrorGeneric`/`testingConnection`/`searchProviderFallback`/`connectionSuccess`/`testQueryLabel`/`resultsRetrieved`/`connectionFailed`/`errorTypeLabel`/`hideDetails`/`showDetailsLabel`/`tipDocs`/`viewSearchDocs`）

判据与插曲：`getCleanErrorMessage` 的兜底返回值是用户可见错误文本，接线；ICU 无内联默认值，`search_provider` 缺失走 `t("searchProviderFallback")` 兜底键；`useEffect` 补 `t` 依赖。zh 目录插入时锚点 `"historyCleared"` 在 searchTools 与 vectorStores 两命名空间撞值，块误落 vectorStores，按连续切片重插到 searchTools 并双侧校验归属。目录键值复用核查中 `unknownError` 等值在 caching/modelInfo 等命名空间另有同值键，不跨命名空间借用

验证：SearchConnectionTest 8 例 + parity + missingKeys 全绿，tsc 零命中，eslint 2/2 持平，prettier 绿，build 绿。叶子 +16 至 11048，同值 139 不变，长尾减 1 至 18

## 2026-10-19 第 283 簇更新

继续串行推进（补记同上）。这一簇是缓存分析页两文件：`cache_dashboard.tsx` 与 `ErrorDrilldown.tsx`。新增 20 键（`caching` 命名空间：四页签、`analyticsIntro` 的 t.rich link/docslink、统计卡、图表系列标签、`drilldownTitle`、`errorCodeTooltip`、健康检查 toast 等）

口径：BarChart 用 `categoryLabels` 属性把图表数据键改为稳定 id（api_requests/cache_hits 等），系列名与 `FAILED_REQUESTS_SERIES` 跨组件常量同改 id；`ErrorCodeTooltip` 的 `useTranslations` 提到所有提前返回之前（rules-of-hooks）；下钻点击判定 `item.categoryClicked === "failed_requests"`

验证：cache_dashboard.test 与 ErrorDrilldown.test 全绿（zh 钉全为本地），tsc 零命中，eslint complexity 存量 25 无新增，prettier 两文件 --write 归零，build 绿。叶子 +20 至 11032，同值 139 不变，长尾减 2 至 19

## 2026-10-19 第 282 簇更新

继续串行推进（补记同上）。这一簇是 playground 对比模式与路由预览三个属性字面量：`SessionManagement.tsx`、`CompareUI.tsx`、`route_preview.tsx`。新增 3 键（alt/aria/label 各一）

验证：相关测试全绿，tsc 零命中，eslint 持平，prettier 三文件 HEAD 即脏处不整写、本簇行干净，build 绿。叶子 +3 至 11012，同值 139 不变，长尾减 3 至 21

## 2026-10-19 第 281 簇更新

继续串行推进（补记同上）。这一簇是 `alerting_settings.tsx` 的代理生效提示 toast。补 `useTranslations("alerting")`，新增 1 键 `proxyUpdateWait`

验证：alerting 测试 + parity + missingKeys 全绿，tsc 零命中，eslint 持平，prettier 绿（zh 插入产生的前置逗号风格已归一），build 绿。叶子 +1 至 11009，同值 139 不变，长尾减 1 至 24

## 2026-10-19 第 280 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/memory/_components/MemoryView.tsx`（记忆列表页，第 275 簇的后续，CRUD 结果 toast 长尾）。新增 6 键（`createdToast`/`updatedToast`/`deletedToast`/`saveFailedToast`/`deleteFailedToast`/`metadataInvalid`），零复用

复用与判据：六条模板串 toast（`Created ${key}` 等，两条 Save failed 被创建/更新两个 mutation 复用）改 ICU `{key}`/`{message}`；`err` 已是 `Error` 类型无需 String()。alerting_settings 的 toast 所在文件无 useTranslations hook，整文件归属簇处理，不在本簇

测试：memory 全目录 6 文件 41 例 + parity + missingKeys 全绿，toast 串零测试钉

验证：tsc 零命中；eslint 0 条与 HEAD 持平；prettier 绿；`npm run build` 绿。目录叶子复算 +6 至 11008（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 1 至 25

## 2026-10-18 第 279 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/models-and-endpoints/components/AllModelsTab.tsx`（全部模型页，已挂 `models`，暂存清单里的文件实际余量只有 13 串，解除暂存）。新增 13 键（`personalTeam`/`deletedToast`/`pausedToast`/`resumedToast`/`deleteTitle`/`deleteWarning`/`deleteConfirm`/`resourceInfoTitle`/`modelNameLabel`/`litellmModelNameLabel`/`providerLabel`/`createdByLabel`/`notSet`），零复用

复用与判据：DeleteResourceModal 的 title/alertMessage/message/resourceInformationTitle/资源行 label:value 全部接键（`Not Set` 兜底单键复用 4 处）；teamOptions 的 "Personal" 过滤项与两条 toast 接键。useMemo/useCallback 内新增 t() 触发两条 exhaustive-deps，补 `t` 进依赖数组拉回 eslint 基线。测试表中 `["Model Information", ...]` 是表格排序 fixture 非本弹窗串，不动

测试：`AllModelsTab.test.tsx` 翻 1 处钉（findByText Delete Model），40 例 + parity + missingKeys 全绿

验证：tsc 零命中；eslint complexity 25 为存量（补 t 依赖后无新增）；prettier 绿；`npm run build` 绿。目录叶子复算 +13 至 11002（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 1 至 26

## 2026-10-18 第 278 簇更新

继续串行推进。这一簇是四个文件的 toast 长尾残余：`VectorStoreTester.tsx`（第 276 簇的后续）、`CodeInterpreterTool.tsx`、`ClaudeCodePluginsPanel.tsx`、`tag-management/index.tsx`。新增 10 键（`vectorStores.queryRequired`/`historyCleared`、`playground.codeInterpreterOpenaiOnly`、`skills.deleteFailed`、`tagManagement.tagCreated`/`tagDeleted`/`fetchTagsFailed`/`createTagFailed`/`deleteTagFailed`/`fetchModelsFailed`），零复用

复用与判据：四条 `fromError("Error ...: " + error)` 拼接串改 ICU `{error}` 并包 `String()`（unknown 类型）；探测器两条与 searchTools 同义的 toast 按口径在 `vectorStores` 自加键不跨命名空间。插曲：`playground.codeInterpreter` 实为 `playground.config` 子键，首轮把新键插进 config 下导致 missingKeys 静态扫描 unresolved；又用 json.dump 整写目录把两文件重排出 2.4 万行 diff——立即 checkout 回滚后改行级文本插入重做（教训入记忆：目录只做行级插入，永不 json.dump 整写）

测试：`VectorStoreTester.test.tsx` 翻 1 处 toast 钉；tag-management 全目录 + parity + missingKeys 共 50 例全绿

验证：tsc 仅剩 index.test.tsx(77) 存量 TS2345（HEAD 同代码）；eslint 四文件与 HEAD 持平（tag-management 因 useEffect 内新增 t() 补依赖数组后回到 3 条基线）；prettier 绿；`npm run build` 绿。目录叶子复算 +10 至 10989（en/zh 双侧一致），同值 139 不变；本簇把 4 个"已接入仍有英文"文件的 toast 清零，长尾计减 4 至 27

## 2026-10-18 第 277 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/cost-tracking/_components/pricing_calculator/` 的 `index.tsx` 与 `multi_cost_results.tsx`（多模型定价计算器，均已挂 `costTracking`，整组长尾漏接）。新增 8 键（`requestsPerDay`/`requestsPerMonth`/`removeModelRow`/`unknownModel`/`totalWithReq`/`totalForPeriod`/`showBreakdownFor`/`hideBreakdownFor`），复用 2 处（`periodLabel` 三元接 `daily`/`monthly` 既有键）

复用与判据：Requests/Day|Month 列头按时间粒度分两键；`{period} Total (N req)` 与 `Total {period}` 用 `{count, number}` ICU；`Show/Hide cost breakdown for {model}` aria 分两键接 `{model}`。三处可空值（periodRequests、record.model）按第 257 簇口径包 `String()`

测试：`multi_cost_results.test.tsx` 翻 8 处钉（helper regex /cost breakdown for /、Total Daily/Monthly、columnheader Daily、Show/Hide aria、模板串 `Total (100 req)`）；`index.test.tsx` 翻 Requests/Month|Day 各 2 处

验证：pricing_calculator 全目录 5 文件 73 例 + parity + missingKeys 全绿；tsc 零命中（三处 nullable 由 String() 修复）；eslint 两文件 1→0、1→0 只减不增；prettier 绿；`npm run build` 绿。目录叶子复算 +8 至 10979（en/zh 双侧一致），同值 139 不变；本簇把 2 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 2 至 31

## 2026-10-18 第 276 簇更新

继续串行推进。这一簇是两个文件的短串长尾残余：`src/components/ToolDetail.tsx`（工具详情屏蔽区，第 269 簇接过主体）与 `src/app/(dashboard)/vector-stores/_components/VectorStoreTester.tsx`（向量存储测试器）。新增 2 键（`toolPolicies.blockFor`、`vectorStores.search`），复用 3 处（Team/Key 标签与 scope 取值复用 `toolPolicies.team`/`key`）

复用与判据：`Block for {scope}` 的 scope 本身就是刚翻译的 team/key 取值，接 `blockFor`（EN `Block for {scope}`，ZH `为{scope}阻止`）并传已译 scope；"Search" 按钮不跨命名空间借用 `searchTools.search`，按口径在 `vectorStores` 自加 `search` 键

测试：`ToolDetail.test.tsx` 翻 4 处 regex 钉（/Block for team|key/），`VectorStoreTester.test.tsx` 翻 1 处 helper（/search/i，唯一定义行、全文件共用）

验证：两文件关联 4 测试 + parity + missingKeys 共 40 例全绿；tsc 零命中；eslint 4/4 与 4/4 较 HEAD 持平；prettier 绿；`npm run build` 绿。目录叶子复算 +2 至 10971（en/zh 双侧一致），同值 139 不变；本簇把 2 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 2 至 33

## 2026-10-18 第 275 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/memory/_components/MemoryEditModal.tsx`（记忆编辑弹窗，已挂 `memory`，整弹窗长尾漏接）。新增 9 键（`titleCreate`/`titleEdit`/`keyHint`/`phKey`/`valueHint`/`metadataOptional`/`metadataHint`/`keyRequired`/`valueRequired`），复用 6 处（`keyLabel`/`value`/`metadata`/`editPlaceholder` 用 memory 既有键，Cancel/Create/Save 补 `commonT` 复用 `common.cancel`/`create`/`save`）

复用与判据：模块级 zod schema 的两条英文错误消息随 schema 够不着 `t`，按工厂先例把 schema 移进组件 `useMemo`（`EMPTY_MEMORY` 改手写类型），错误消息接 `keyRequired`/`valueRequired`；标题接 ICU `titleEdit`（`Edit {key}`）。测试翻转分两种语境：`MemoryEditModal.integration.test.tsx` 走 zh 真目录（Create/Save 按钮、"Key is required" 等、`/^Key/` label 正则 ×18 全翻）；`MemoryView.test.tsx` 用 `LocaleProvider` 裸 render、英文语境（en 目录值与原硬编码一致），钉不动——首轮误翻成 zh 后红灯，回退为英文钉

验证：memory 全目录 4 文件 32 例 + parity(8) + missingKeys(1) 全绿；tsc 零命中；eslint 0 条较 HEAD 持平；prettier 绿（DialogTitle 等收拢）；`npm run build` 绿。目录叶子复算 +9 至 10969（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 1 至 34

## 2026-10-18 第 274 簇更新

继续串行推进。这一簇是 `src/components/claude_code_plugins/skill_detail.tsx`（技能详情页，已挂 `claudeCodePlugins`，短串长尾漏接）。新增 6 键（`tabOverview`/`tabUsage`/`statusPublic`/`statusDraft`/`copy`/`copied`），零复用

复用与判据：两个 tab label 在组件内 `tabs` 数组（有 `t` 在作用域），直接内联接键；`Public`/`Draft` 状态徽标与三处 `Copied`/`Copy` 切换同理。测试走 zh 真目录且对这 7 串零钉，接线零翻转

甄别排除（本轮探测账）：TransformRequestPanel 的 4 处 prose 全是请求体 JSON 示例、SearchTools/audio_transcriptions/UIAccessControlForm/SSOModals/price_data_reload/model_group_alias_settings 的 prose 全是 console.error 前缀、ComplianceUI 的 prose 是 LLM 测试题库——均非 UI 文案

验证：claude_code_plugins 2 测试文件 97 例 + parity(8) + missingKeys(1) 全绿；tsc 零命中；eslint 2/2 持平；prettier 绿；`npm run build` 绿。目录叶子复算 +6 至 10960（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件的用户可见英文清零，长尾计减 1 至 34

## 2026-10-18 第 273 簇更新

继续串行推进。这一簇是 `costOptimizationUtils.ts` 的 `classificationRatePer1kTurns`（第 272 簇记下的 "1K turns" 尾缀欠账）。新增 1 键（`autoRouter.per1kTurns`）

复用与判据：纯函数原返回拼死的英文串 `($X.XX / 1K turns)`，改为只返回费率串（`usd(rate)` / `"<$0.0001"` / 零轮 `$0.00`）并更名 `classificationRatePer1k`，括号与 "1K turns" 尾缀上移到组件用 `t("autoRouter.per1kTurns", { rate })` 拼（EN `({rate} / 1K turns)`，ZH `（{rate} / 千轮）`）。全库唯一消费者是 AutoRouterBenchmarksTab

测试：`costOptimizationUtils.test.ts` 的 6 个 toBe 翻成裸费率并随更名改 8 处引用；`AutoRouterBenchmarksTab.test.tsx` 翻 3 处（模板串、negated regex、terms 数组）

验证：两测试文件 69 例 + parity + missingKeys 全绿；tsc cost-optimization 仅剩既录存量债（tab within(tile) 282/283、TierTurnsChart.test 172、useAutoRouterBenchmarks.test TS2589，均不曾碰过的文件或 HEAD 同代码）；eslint 0/0 持平；prettier 三文件绿（test 的 python 编辑长行收拢）；`npm run build` 绿。目录叶子复算 +1 至 10954（en/zh 双侧一致），同值 139 不变；第 272 簇欠账清零

## 2026-10-18 第 272 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/cost-optimization/_components/AutoRouterBenchmarksTab.tsx` + `autoRouterBenchmarks.ts`（自动路由用量页，已挂 `costOptimization`，整页长尾漏接）。新增 31 键（`autoRouter.savingsTitle`/`valueUnavailable`/`comparedOn`/`actualSpend`/`actualSpendTooltip`/`llmSpend`/`classificationCost`/`breakdownUnavailable`/`baselineSpend`/`turnsByBucketAria`/`turnsCount`/`expiredMiss`/`expiredMissTooltip`/`turnsMeasured`/`outOfOrder`/`avgSaved`/`sessionsHint`/`avgTurns`/`avgSessionLength`/`avgTokens`/`benchmarkNote`/`userScopeNote`/`tabUsage`/`tabShadowEvals`/`bucketSameModel(+Hint)`/`bucketFirstVisit(+Hint)`/`bucketReturnToTier(+Hint)`/`bucketDesc`），零复用

复用与判据：HeroCard/StackedTurnBar 原本无 hook，补 `costOptimization`；三个分桶的 label/sublabel 原是模块级英文常量（`bucketRows` 返回、仅本 tab 消费、模块测试零断言），按 FILTER_LABELS 先例从 `BucketRow` 删除改组件内按 key 查表（`bucketText`）；`turnsMeasured` 的数字强调改 `t.rich` + `strong` 富标签；两处 `{n, number}` ICU 数值（comparedOn/turnsCount/turnsMeasured/outOfOrder/sessionsHint）替代 `toLocaleString()`。甄别排除：`ALL_ROUTERS_LABEL` 是哨兵值永不渲染（displayLabel 比较后替换成 `allRouters` 键）、`(UTC)` 范围后缀保留、`classificationRatePer1kTurns` 的 "1K turns" 尾缀在纯函数工具 `costOptimizationUtils.ts`（随该文件归属簇处理，本簇记欠账）

测试：`AutoRouterBenchmarksTab.test.tsx` 翻 33 处英文钉（zh 真目录语境，含 4 元素 Unavailable 数组、5 指标 labels 数组与 regex 交替、tab 名、img aria 名、模板串 `· 94 sessions`）；`autoRouterBenchmarks.test.ts` 零 label 断言无需动

验证：该簇 4 测试文件 69 例 + parity(8) + missingKeys(1) 全绿、Type Errors 无报错（test 内 `within(tile)` TS2345 与 ShadowEvalSection.test 债为存量，对照 HEAD 同代码）；eslint 三文件 0 警告较 HEAD 基线持平；prettier 本簇行与所触块（BucketTable 原有缩进漂移一并收敛）整文件绿；`npm run build` 绿。目录叶子复算 +31 至 10953（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件的用户可见英文清零（余 "(UTC)" 与欠账的 1K turns 尾缀），长尾计减 1 至 34

## 2026-10-18 第 271 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/agents/_components/agent_form_fields.tsx` 与 `dynamic_agent_form_fields.tsx`（智能体表单认证请求头面板与两个动态面板标题，均已接入、长尾漏接）。新增 6 键（`panelAuthHeadersTitle`/`staticHeadersLabel`/`staticHeadersHint`/`forwardHeadersLabel`/`forwardHeadersHint`/`addStaticHeader`），复用 3 处（面板 "Kill Switch" 复用 `killSwitch`（zh "紧急停止开关"），动态成本面板复用 `costConfigTitle`，同义替换 `forwardHeadersHint` 顺带去掉 EN "client's" 撇号的 ICU 引号风险）

复用与判据：AgentFormPanel 标题不经过 `configText` 通路、按裸字符串直渲，两个动态面板（成本/Kill Switch）在 dynamic 文件里裸传英文；本簇接 `t` 并让 dynamic 与 a2a 两条路径共用同一批键。甄别排除：`FIELD_TEXT_KEYS` 英文→键映射表是 configText 的查表源（源文不渲染，保留）、`e.g. x-api-key, Authorization` 占位符是请求头名技术示例（保留）；old-usage/usage.tsx 的 7 处 prose 经查全是 `console.error` 前缀（非用户可见，按口径不翻），排除

测试：`add_agent_form.integration.test.tsx` 与 `agent_info.integration.test.tsx` 各 3/2 个英文钉翻转（zh 真目录语境）；顺带补第 264 簇欠账——后者 14 例在 HEAD 上即红（`Save Changes`/`Cancel` 钉未随 agent_info.tsx 的 saveChanges 接线翻转，上次该文件改动停在更早提交），本次一并翻成"保存更改"/"取消"

测试结果：agents 全树 5 文件 46 例全绿（含补账后的 agent_info.integration 15/15）、parity(8) + missingKeys(1) 绿、Type Errors 无报错

验证：tsc 真路径零命中（prompts/utils.test 的既有类型债不碰）；eslint 两源文件 0 条较 HEAD 基线各 1 条只减不增；prettier 三文件存量漂移不动（FIELD_TEXT_KEYS 引号键、dynamic 整块缩进、测试旧断言换行均非本簇行），我的行收拢后零漂移；`npm run build` 绿。目录叶子复算 +6 至 10922（en/zh 双侧一致；第 271 簇同法复测 HEAD 为 10916，此前正文 10924 为临时口径，见头部注记），同值 139 不变；本簇两文件仍余 configText 查表源与占位符，长尾计数不动

## 2026-10-18 第 270 簇更新

继续串行推进。这一簇是 `src/components/TeamsPage/TeamsTable.tsx`（团队表格，251 簇已接大半，长尾残余）。新增 1 键（`teams.listTeamAlias`），复用 2 处（`listOrganization`/`listTeamId`）

复用与判据：模块级 `FILTER_LABELS`（org_id/alias/team_id → 英文）传给 `DataTableToolbar` 的 `filterLabels` 作过滤标签——模块级常量够不着 `t`，删掉改在组件内用 `t` 内联三键。`Organization`/`Team ID` 复用既有键，"Team alias" 无现键故新增。同文件族测试分两类语境：`Teams.test.tsx` 用 vi.mock 的英文 `mockTranslations`（未命中回退裸键名），故新键同步补进 mock；`TeamsPage/TeamsTable.test.tsx` 走 zh 真目录无需动。甄别排除：`Teams.test.tsx` 里 "Team Member Budget (USD)"/"Reset Budget"/"Remove key-value pair" 等钉的定义不在本文件（预算/成员表单组件），留待其归属簇

测试：Teams(全量) + TeamsTable.test + parity + missingKeys 四文件 115 例全绿；tsc 报的 2 条（DeletedTeamsTable.test 98、TeamsTable.test 172 的 null 债）为未碰过的测试文件既有类型债

验证：tsc 组件文件零命中；eslint 两文件 25 条较 HEAD 基线 26 条只减不增（内联 3 属性对象低于阈值）；prettier 两文件整文件绿；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +1 至 10924（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 269 簇更新

继续串行推进。这一簇是 `src/components/ToolDetail.tsx`（工具详情，已挂 `toolPolicies`，长尾漏接）。新增 2 键（`inputPolicyDesc`/`outputPolicyDesc`），零复用

复用与判据：输入/输出策略说明的两处 `?? "英文兜底"` 接键；`outputPolicyDesc` 原 EN 含 "tool's" 撇号（ICU 引号风险），改写为 "the output of this tool"。`resourceInformation` 类 label（"ID" 等）与既有接线不动

测试：协同 `ToolDetail.test.tsx`（10 例）与全库对这两串零钉，接线零翻转

验证：ToolDetail(10) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint 3 条较 HEAD 基线 4 条只减不增（长串收短后一条 inline-object 警告消失）；prettier 我的两个多行 `<p>` 被打回收拢后整文件绿；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +2 至 10923（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 268 簇更新

继续串行推进。这一簇是 `src/components/add_model/add_model_modes.tsx`（模型测试模式常量，长尾漏接）。零新键：同文件 `TEST_MODES` 早就是 `labelKey` 接线风格（消费方 `AddModelForm` 用 `addModelT(mode.labelKey)`），而 `AUTO_ROUTER_MODES` 的 6 条英文 label 经全库 grep 确认是孤儿导出（除自身定义外零引用、永不渲染）——翻译死代码无意义，按口径整块删除，文件随之清零

甄别排除：`public_model_hub.tsx` 的 prose 密度全是 Python 代码示例与注释（非 UI 文案）；`old-usage/usage.tsx` 是旧路由遗留，待确认去留后处理

测试：add_model 全树 44 文件 1010 例复跑全绿（删除孤儿导出无任何引用方）、parity + missingKeys 绿、Type Errors 无报错；tsc 零命中；eslint/prettier 干净；`npm run build` 绿。目录叶子复算零新增维持 10921（未动目录），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 267 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/agents/_components/AgentIdentityFields.tsx`（智能体身份字段，已挂 `agentIdentity`，长尾漏接）。新增 4 键（`trustedTenantRequired`/`tenantEmptyHint`/`principalUuidInvalid`/`identityBindingHint`），零复用

复用与判据：租户下拉的 `required` 校验、UUID pattern 校验消息、两个说明 `<p>` 均为整串写死。`identityBindingHint` 原 EN 含 "agent's" 撇号（ICU 引号风险），改写为 "the Entra token of the agent" 规避。甄别排除：`public_model_hub.tsx` 的 prose 密度全是代码示例与注释（非 UI 文案）；`add_model_modes.tsx` 的 6 条路由模式 label 是模块级常量数组，消费方与测试耦合待独立簇评估

测试：无协同测试、无消费方测试钉（grep 确认 4 串零命中），接线零翻转

验证：parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint 1 条 exhaustive-deps（HEAD 基线 2 条、本簇只减不增）；prettier 我的三行块被 prettier 打回收拢后整文件绿；`npm run build` 绿（重排后复跑）。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +4 至 10921（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 266 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/mcp-servers/_components/MCPNetworkSettings.tsx`（MCP 网络设置，已挂 `mcpServers`，长尾漏接）。纯复用零新键，收口 1 处：专用 IP 段说明段写死英文，而 `networkSettings.privateIpRangesDesc` 键在 en/zh 双侧目录里早已有完整译文——"键齐了调用点没接"的又一例

复用与判据：`<p>` 说明段接 `t("networkSettings.privateIpRangesDesc")`（zh "定义哪些 IP 段属于您的内部网络…可在公网访问…），紧邻的 `privateIpRangesTitle` 本就接线。`DeprecationBanner featureName=` 传的是功能名、横幅文案在共享组件内自理，不属本文件残余；发给评审 LLM 的 `DEFAULT_PROMPT`（EvaluationSettingsModal）是模型提示词内容而非 UI 界面文案，按口径不译

测试：`MCPNetworkSettings.test.tsx`（37 例，走 zh）无此串的钉，接线零翻转

验证：MCPNetworkSettings(37) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint 1 条 exhaustive-deps（181 行 HEAD 既有基线）零新增；prettier 漂移在 120-123 行 addClient/editClient 对话框块（既有、未碰）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算零新增维持 10917（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 265 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/models-and-endpoints/components/AutoRouters/AutoRoutersPanel.tsx`（自动路由器面板，已挂 `models.autoRouters`，长尾漏接）。新增 3 键（`deleteTitle`/`deleteBody`/`resourceTitle`），复用 2 处（`table.name`/`table.type`）

复用与判据：删除确认 `DeleteResourceModal` 的 5 处写死——标题接 `deleteTitle`、message 模板（含 `{name}` 插值）接 `deleteBody`、`resourceInformationTitle` 接 `resourceTitle`，明细行 label "Name"/"Type" 复用既有的 `table.name`/`table.type`（表格列头本就有），"ID" 标识不译。同族 `autoRouterRows.ts` 是纯函数模块（策略/分类器标签英文、`autoRouterRows.test.ts` 单测按英文钉），按口径留待独立簇

测试：`AutoRoutersPanel.test.tsx`（6 例）与全库测试对这 5 串零钉，接线零翻转；tsc 报的 2 条（测试 151 行 `beforeEach` 未导入、218 行数组类型不匹配）是该测试文件的既有类型债、本簇未碰

验证：AutoRoutersPanel(6) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 组件文件零命中；eslint 0；prettier 漂移在 108-110 行 addDialog 描述块（既有、未碰）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +3 至 10917（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 264 簇更新

继续串行推进。这一簇是第 258 簇 `agent_info.tsx` 的补漏——该簇扫描用的正则只抓"首词大写+次词小写"与带引号串，漏掉了帕斯卡式双词（`Save Changes`）、裸 JSX 单词（`Cancel`）与三元里的 `"Yes"/"No"/"None"`。本簇收口 5 处，复用 4 处、新增 2 键

复用与判据：streaming 能力显示 `"Yes"/"No"` 复用 `agents.yes/no`（"是"/"否"）；无值显示 `"None"` 加 `commonT` 钩子复用 `common.none`（"None"/"无"）；编辑表单的 `Cancel` 复用 `agents.cancel`；提交钮 `Save Changes` 加 `agents.saveChanges`（"保存更改"，common 无此键、users 命名空间的同名键不跨用）；只读态提示句 `Click "Edit Settings" to modify agent configuration.` 整句接 `agents.editHint`（zh 点击"编辑设置"以修改智能体配置，引号用全角、内嵌按钮名按 257 簇教训折整句不拆）

测试：`agent_info.test.tsx` 钉 5 处——`getByText("None")` 翻 `无`；4 处正则 `/Save Changes/`（引号 grep 漏掉的正则钉，首跑 4 红、失败信息点名后补翻 `/保存更改/`）复绿 18 例；Yes/No/Cancel/editHint 无测试钉

验证：agent_info(9) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint 组件 5 条与 258 簇基线逐条一致（行号因插钩子 +1），测试 0 条，零新增；prettier 组件漂移仍是 258 簇记过的 colModel/mcpToolsets/tagsLabel 三处旧行（+1），我的行全净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +2 至 10914（en/zh 双侧一致），同值 139 不变；agent_info 至此清零，长尾减 1

## 2026-10-18 第 263 簇更新

继续串行推进。这一簇是 `src/components/templates/KeyProjectField.tsx`（密钥项目字段，已挂 `keyProjectField`，长尾漏接）。新增 2 键（`detach`、`keep`），零复用

复用与判据：60 行小文件唯一残余是项目切换钮 `{pending ? "Keep project" : "Detach from project"}`（该命名空间原本只有 `projectLabel` 一键）；zh 用 "移出项目"/"保留项目"。测试壳的 "Submit"、"Save configuration" 等是包装组件自己的按钮，非本文件残余

测试：消费方 `key_edit_view.integration.test.tsx` 走 `renderWithProviders`（钉 zh），8 处 `{ name: "Detach from project" }`（正/负断言混合）随接线经 allow_multiple 改 `{ name: "移出项目" }`；pending 态 "Keep project" 无测试钉

验证：key_edit_view.integration(111, 含 2 例上游预期失败) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint/prettier 组件整文件干净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +2 至 10912（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 262 簇更新

继续串行推进。这一簇是 `src/components/organization/org-create/OrgCreateDialog.tsx`（创建组织对话框，已挂 `organizations.orgForm`+`organizations` 双命名空间，长尾漏接）。新增 3 键（`organizations.creating`/`createdToast`/`createFailed`），复用 1 处（`organizations.createOrganization`，对话框标题本就在用）

复用与判据：提交钮 `{isPending ? "Creating..." : "Create Organization"}` 的静态态复用 `createOrganization`，加载态加 `creating`（zh "创建中..."）；两条 toast 是整串（其一为 `error instanceof Error ? error.message : 兜底` 形态，只译兜底、保留动态 `.message`）

命名空间教训：三键都放在 `organizations` 根上（与 `createOrganization` 同层），调用点最初误用 `t`（挂在 `orgForm` 子命名空间）——next-intl 的严格键类型（`src/lib/i18n/next-intl.d.ts` 从 en.json 推导）在 tsc 直接拦下 "not assignable to NamespacedMessageKeys"，同文件内 `orgT`（根命名空间）才对。排查时先怀疑 incremental tsbuildinfo 缓存旧 JSON（删除后复现，排除），真正根因是作用域。此前各簇 tsc 都跑在 build 之后、键都在正确命名空间，故未见过此错

测试：`OrgCreateDialog.test.tsx`（10 例）走 `renderWithProviders`（钉 zh），6 处 `{ name: "Create Organization" }` 随接线改 `{ name: "创建组织" }`（allow_multiple）；两条 toast 无测试钉；无其他消费方测试

验证：OrgCreateDialog(10) + parity(8) + missingKeys(1) 三文件 19 例全绿、Type Errors 无报错；tsc 真路径零命中；eslint 两文件 0 问题；prettier 整文件绿（onError 行因短串能收一行、被 prettier 打回后重排）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +3 至 10910（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 261 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/mcp-servers/_components/OAuthFormFields.tsx`（MCP 服务器 OAuth 凭证表单，已挂 `mcpServers`，长尾漏接）。新增 2 键（`oauth.tokenUrl`、`oauth.tokenStorageTtlPlaceholder`），零复用

复用与判据：M2M 流的 `label="Token URL"` 接 `oauth.tokenUrl`（zh "令牌 URL"，与既有的可变体 `tokenUrlOptional`="令牌 URL（可选）" 同词根）；令牌存储 TTL 的 `placeholder="e.g. 3600"` 加 `tokenStorageTtlPlaceholder`（zh "如 3600"，各命名空间本就各持一个 "e.g. N" 占位键，无公共键可复用）。不译残留均按口径：`placeholder="https://auth.example.com/oauth/token"`（URL 示例）、令牌端点认证方式的 "Client Secret Basic/Post"（OAuth RFC 术语、测试也按英文钉）、`{"organization": ...}` JSON 示例、`UpstreamTokenHeaderField` 的 `placeholder="Authorization"`（用户要输入的字面 HTTP 头名）

测试：`OAuthFormFields.test.tsx`（21 例）走 `renderWithProviders`（钉 zh），M2M 用例 2 处 `getByText("Token URL")` 随接线改 `"令牌 URL"`（可变体用例断言的 `令牌 URL（可选）` 是另一串、不动）；TTL 占位符无测试钉。消费方 `mcp_server_edit.test` 与 `CreateMCPServer.integration.test` 不钉这两串（152 例复跑全绿）；`MountedFormField.test` 命中的 "Token URL is required" 是它自己的示例校验消息，无关

验证：OAuthFormFields(21) + 消费方两文件(152) + parity(8) + missingKeys(1) 全绿、Type Errors 无报错；tsc 真路径零命中；eslint 8 条全为测试既有 `.closest()` node-access 基线，零新增；prettier 组件整文件绿（TTL 行超宽被 prettier 打回后已重排）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +2 至 10907（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 260 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/mcp-servers/_components/MCPToolsetsTab.tsx`（MCP 工具集标签页，已挂 `mcpServers`，长尾漏接）。新增 2 键（`toolsets.nameRequired`、`toolsets.clearSearch`），复用 1 处（`toolsets.copy`），另修 1 处上游坏 ICU 标签

复用与判据：模块级 zod 的 `"Please enter a toolset name"` 按 246 簇工厂化模式改成 `buildToolsetSchema(nameRequired)` + `z.infer<ReturnType<...>>`，组件内把 `t` 声明提前、`useZodForm(buildToolsetSchema(t("toolsets.nameRequired")), ...)`；`aria-label="Clear search"` 加 `toolsets.clearSearch`（与 projects/access-groups/skills/agents/modelHub/routingGroups 六个同值 `clearSearch` 键同型，zh "清空搜索"）；配置片段的 `copy` 钮复用现键 `toolsets.copy`（"copy"/"复制"），扫描正则此前漏掉这个小写单词

坏 ICU 标签修复：`toolsets.guideBody` 消息写成 `{link}…</link>`（参数占位符配游离闭合标签），next-intl 把 rich 回调函数当参数塞进 React 子节点——控制台报 "Functions are not valid as a React child"，且两种语言下强调的 "API Keys → Edit Key → MCP Servers" 段一直没渲染。双侧改 `<link>…</link>`（`link` 在 parity RICH_TAGS 白名单，消费方本就传 `link` 回调）后 stderr 消失、强调段恢复渲染。同病的 `playground.toolsets.guideBody` 与 `playground.agentBuilder.experimentalWarning` 是无消费方的孤儿键（不渲染、无此告警），不在本簇动

测试：`MCPToolsetsTab.integration.test.tsx`（6 例）走 `renderWithProviders`（钉 zh），114 行 `findByText("Please enter a toolset name")` 随接线改 `"请输入工具集名称"`；aria-label 与 copy 钮无测试钉（grep 确认）

验证：integration(6) + parity(8) + missingKeys(1) 三文件 15 例全绿、Type Errors 无报错、stderr 清零；tsc 真路径两文件零命中；eslint 组件 3 条与 HEAD 基线一致（any、no-large-inline-object-arg）、测试的 prefer-screen-queries 全既有，零新增；prettier 组件整文件绿（我首版 aria-label 行超宽被 prettier 打回，已按其输出重排）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +2 至 10905（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 259 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/search-tools/_components/SearchToolTester.tsx`（搜索工具测试面板，已挂 `searchTools`，长尾漏接）。新增 8 键（queryRequired/queryFailed/historyCleared/searchQueryLabel/resultCount/openResultAria/showMore/showLess），复用 2 处（`common.search`、`common.clearAll`，组件加 `commonT` 钩子）

复用与判据：Search 钮与 `common.search`（"Search"/"搜索"）一字不差、Clear All 钮与 `common.clearAll`（"Clear all"/"全部清除"）同义（大小写从 canonical），故复用；其余 8 键进 `searchTools`。结果计数 `{N} {N===1?"result":"results"}` 两处拼串改 ICU 复数 `resultCount`：EN `{count, plural, one {# result} other {# results}}`、ZH `{count} 条结果`（zh 不复数、只有 other 语义，双侧参数同名 `count`、`#` 非 ICU 参数）。`toast.fromError` 实参是整串写死（非 error.message 兜底），整句接键；`console.error` 前缀、`{latency}ms`、结果 URL/snippet（动态数据）不动

测试：`SearchToolTester.test.tsx`（29 例）走 `renderWithProviders`（钉 zh），是"英文正则当搜索触发器"的重耦合簇——接线后 24 处 `{ name: /search/i }`（全部唯一命中搜索钮）、6 处 `/Show more/i`、2 处 `/Show less/i`、`"2 results"`/`"1 result"`、`/clear all/i`、两条 toast 实参随接线翻中；mock 数据（Test Result 1/2、URL、snippet、输入的 query 串）与技术属性不动。369 行 `queryByText("Previous Searches")` 是上游既有空过（组件早接 `previousSearches` 显示"历史搜索"，英文永不命中），与本簇无关、不碰

验证：SearchToolTester(29) + parity(8) + missingKeys(1) 三文件 38 例全绿、Type Errors 无报错；tsc 真路径两文件零命中；eslint 组件 0 问题、测试 4 条全是 327/371 行既有 `.closest()`/`.parentElement` node-access 基线（我未碰）；prettier 两文件整文件绿；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +8 至 10903（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 258 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/agents/_components/agent_info.tsx`（智能体详情视图，已挂 `agents`，长尾漏接）。新增 4 键（loadInfoFailed/updateSuccess/updateFailed/backToAgent），零复用

复用与判据：4 处均静态 toast/prop、无插值。3 条 toast 是整串写死（非 `error.message` 兜底），整句接键即可；`console.error("Error fetching/updating agent:", error)` 前缀按口径不动。`backButtonText="Back to Agent"` 传给 `KeyInfoView`，同族已有 `RequestLogsPanel` 用 `backButtonText={t("backToLogs")}` 的先例，故接 `t("backToAgent")`（该 prop 缺省会回落到 `KeyInfoHeader` 的 `t("header.backToKeys")`，与本键不冲突）。zh 术语统一"智能体"

测试：`agent_info.test.tsx` 走 `renderWithProviders`（钉 zh），grep 全库确认这 4 串无任何测试钉（`"Back to Agent"` 在 `src/**/*.test.tsx` 零命中，`KeyInfoView` 自有默认键不受影响）——接线零测试翻转。selectedKey 分支（渲染 `KeyInfoView`）在此测试未触发，跑一遍确认无回归

既有漂移不动：本 .tsx 在 HEAD 即有 3 处 prettier 漂移（375 行 `colModel` 的 `<DetailItem>` 三元、431 行 `mcpToolsets` join、466 行 `tagsLabel` 后 `{" "}`，均前几轮既有、我未碰），我改的 4 行 prettier 自净（不在 diff 内），故不重排无关旧块。eslint 5 条警告全在 83/115/167/406/456（complexity、exhaustive-deps、条件链、`any`），我 4 处编辑行中性、零新增

验证：`agent_info.test.tsx`(9) + parity(8) + missingKeys(1) 三文件 18 例全绿、Type Errors 无报错；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +4 至 10895（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 257 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/agents/_components/AgentKillSwitchDangerZone.tsx`（智能体"紧急停止"危险区，已挂 `agents`，长尾漏接）。新增 11 键（dangerZone/fireKillSwitch/firing/killSwitchFired/killSwitchFireFailed/killSwitchDesc/killSwitchNotConfigured/lastResult/fireKillSwitchForAgent/fireConfirmWarning/typeToConfirm），复用 3 处（cancel、killSwitchWarning、confirmAgentName）。

复用与判据：zh 术语沿用现键 `killSwitch`="紧急停止开关"（非"熔断"），所有新句统一叫"紧急停止开关"。"Danger Zone" heading 经 `aria-labelledby` 成为 region 的可访问名，接线即连带改 region 名。`status_code` 是生成 schema 的可空字段，next-intl 参数类型只收 `string|number|Date`，用 `String(...)` 兜住——原模板串 `` `HTTP ${status_code}` `` 本就是同一隐式转换，不动 `schema.d.ts`

ICU 与拼接：`killSwitchFired`/`lastResult` 带 `{code}`、`fireKillSwitchForAgent` 带 `{agentName}`、`fireConfirmWarning` 带 `{method}{url}`，双侧同名。`typeToConfirm` 用 `t.rich` 把 `<strong>{agentName}</strong>` 映射到红字 `<span>`，保住原"输入名称确认"的强调样式（`strong` 在 parity RICH_TAGS 白名单）。原描述句把 `killSwitchWarning` 夹在硬编码前后拼出来，改写成整句 `killSwitchDesc` 避免前/后缀拼接丢 ICU 语序自由，新句不含旧子串

测试：`AgentKillSwitchDangerZone.test.tsx` 与消费者 `agent_info.test.tsx` 都走 `renderWithProviders`（钉 zh），6 处英文查询随接线翻中——`Fire Kill Switch`→`触发紧急停止开关`（4 正向 + 2 负向）、`Danger Zone` region→`危险区域`、`Not configured`→`尚未配置`、`Last result` 前缀→`上次结果`、`toast.success` 实参→`紧急停止开关已触发（HTTP 202）`、`Cancel`→`取消`。负向断言（非管理员、无 killSwitch）一并翻中，免得"英文永不出"空过。`DELETE https://...`、response_body、`toast.error` 走 error.message 动态分支、`queryByText("Kill Switch")`（早接的 `killSwitch` 键、与本簇无关）、`it()` 标题里的 "Danger Zone"（描述文本、非带引号串）均不动

既有漂移不动：三 .tsx prettier 整文件 `--check` 绿；eslint 0 problem（本簇只接线与翻中查询串，未引入新警告）

验证：parity(8) + missingKeys(1) + `AgentKillSwitchDangerZone`(7) + `agent_info`(9) 四文件 25 例全绿（修 `String()` 后重跑两组件测试 16 例复绿）；tsc 真路径三文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算 +11 至 10891（en/zh 双侧一致），同值 139 不变（新键皆非中英同值）；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 256 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/vector-stores/_components/vector_store_info.tsx`（向量存储详情页，已挂 `vectorStores`，长尾漏接）。纯复用零新键，收口 1 处：成功态详情视图返回钮的写死 `Back to Vector Stores`。

复用与判据：该钮与早有的 `vectorStores.backToList`（"Back to Vector Stores"/"返回向量存储列表"）一模一样，调用点却写死——再接一个"键齐了没接"。同一个键第 201 行（拉取失败的 early-return 返回钮）本就接了；两处分支互斥（loadFailed 直接 return，成功才渲染下方），故复用同一 `backToList` 无歧义。详情页其余非接入残留均按口径不动：源标签 `"DB"`（line 228 徽标标识符）、`placeholder='{"key": "value"}'`（JSON 格式示例）、只读区 `<p className="font-medium">ID</p>`（字段标识）都不译

测试：`vector_store_info.test.tsx` 走 `renderWithProviders`（钉 zh），grep 确认 `"Back to Vector Stores"` 无任何测试钉（0 命中）；唯一 `/返回向量存储列表/` 断言在"拉取失败态返回钮可用"用例里，测的是第 201 行那颗已接好的钮，与本簇改的第 222 行成功态那颗无关。故接线零测试翻转、零新键

既有漂移不动：本 .tsx prettier 整文件 `--check` 绿；eslint 仅 1 条 `react-hooks/exhaustive-deps`（line 150，HEAD 既有基线警告，本簇只换第 222 行一处字符串、零新增）

验证：`vector_store_info.test.tsx`(6) + parity(8) + missingKeys(1) 三文件 15 例全绿、Type Errors 无报错（loadFailed 用例 stderr 是被 catch 的 console.error、预期）；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 689 不动；目录叶子复算零新增维持 10880（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 255 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/agents/_components/AgentsPanel.tsx`（智能体主页，已挂 `agents`，长尾漏接）。收口 6 处：删除成功 toast、删除失败 toast、页首说明句、认证方式 Alert 的标题与正文、`Add New Agent` 钮。新增 5 键（deleteSuccess/deleteFailed/panelDesc/authQTitle/authQBody），复用 1 处

复用与判据：`Add New Agent` 钮早有一模一样的 `agents.addNewAgent`（"Add New Agent"/"新建智能体"），组件却写死——再接一个"键齐了调用点没接"。删除成功 toast 原为模板串 `Agent "${name}" deleted successfully`，改 ICU 键 `deleteSuccess` 带 `{name}`（占位符只增不改，双侧都声明 `{name}`）。`A2A`、`AI Hub`、`JWT`、`Entra` 这些规范/产品/协议名按口径保留英文、夹在已译句里；`Error deleting agent:` console.error 前缀不动；`deleteConfirmBody`/`deleteAgent`/`cancel`/`deleteButton` 等删除弹窗早接好，未碰

测试：`AgentsPanel.test.tsx` 走 `renderWithProviders`（钉 zh），4 处 `"Add New Agent"` 查询随接线改 `"新建智能体"`——其中 2 处 `getByText`（admin/proxy_admin 可见）、2 处 `queryByText` 负向（非管理员查不到）一起改：负向断言若留英文会因"英文永不出"而空过，改中后仍真实验证非管理员看不到该钮。`it()` 标题里的 "Add New Agent" 是描述文本、非带引号串、不动。两条 toast 与 Alert 标题/正文无测试钉（已 grep 确认）；`AgentsTable`/`AddAgentForm`/`AgentInfoView` 是子组件、不经这层

既有漂移不动：本 .tsx 在 HEAD 即有 1 处 prettier 漂移（200 行 `deleteConfirmBody` 的 `<AlertDialogDescription>` 三段式块，前几轮既有、我未碰），我新增/改写的 toast、说明句、Alert、按钮行 prettier 自净，故不重排那条无关旧块。eslint 真路径组件 0 问题，测试 6 警告全是既有 `.closest()` node-access、本簇只改字符串零新增

验证：`AgentsPanel.test.tsx`(18) + parity + missingKeys 三文件 27 例全绿、Type Errors 无报错（删除失败用例 stderr 是被 catch 的 console.error、预期）；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +5 至 10880（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 254 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/mcp-servers/_components/MCPPermissionManagement.tsx`（MCP 权限管理折叠面板，已挂 `mcpServers`，`permissionMgmt` 子 ns 接得很满，长尾零星漏接）。收口 3 处：可见标签 `Internal network only`、两个静态请求头必填校验文案。新增 2 键（permissionMgmt.headerNameRequired/headerValueRequired），复用 1 处

复用：可见标签 `Internal network only`（222 行）直接接现成 `t("permissionMgmt.internalNetworkOnly")`（"Internal network only"/"仅限内部网络"，EXACT），该键本就用在同排开关的 aria-label（232 行）上——又是"键齐了、可见文案漏接"。两个校验：`requiredRule("Header name is required")`/`("Header value is required")` 在 `StaticHeadersFieldArray` 里（57 行有 `t`），把字面量换成 `requiredRule(t("permissionMgmt.headerNameRequired"))` 等，`requiredRule` 收已译串（同 CredentialModal/OrgSettingsForm 的接法，JSX 内联、无需工厂）；其占位符 `headerNamePlaceholder` 等早已接好，只缺 required 两个键

测试：`MCPPermissionManagement.test.tsx` 走 `renderWithProviders`，但本簇 3 个串全无断言（grep `Internal network only`/`仅限内部网络`/`…必填` 零命中），无消费者测试钉，纯展示串+校验文案接线；`mountedAuthType` 的注释、`authorization`/`public_mcp_servers` 等技术串不动

既有漂移不动：本 .tsx 在 HEAD 即不过 prettier（85 行 ClearableInput 超长、194/210/227/245/270/288 等一堆 `<p>{t(...)}</p>` 三段式块、232 行 aria-label 行——全是前几轮既有的同款写法、我一行没碰），且我改的 `requiredRule(t(...))` 与标签行 prettier 自净，不在 diff 里，故不对 300 行大文件做无关重排。eslint 真路径 0 问题、tsc 真路径本文件零命中

验证：`MCPPermissionManagement.test.tsx`(5) + parity + missingKeys 三文件 14 例全绿、Type Errors 无报错；prettier 本簇改动行净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +2 至 10875（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 253 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/mcp-servers/_components/mcp_tool_configuration.tsx`（MCP 工具配置区，已挂 `mcpServers`，长尾漏接）。收口 3 处：两个视图切换钮 `Risk Groups`/`Flat List` 的文案、铅笔编辑钮的 `title="Edit display name and description"`。复用 2、新增 1

复用：`mcpServers.toolConfig` 子 ns 早备了 `riskGroups`（"Risk Groups"/"风险分组"）与 `flatList`（"Flat List"/"平铺列表"）EXACT 键，组件却写死、没接，直接 `t("toolConfig.riskGroups")`/`t("toolConfig.flatList")`（又一个"键齐了调用点没接"）。`Edit display name and description` 钮的 title 无现成键，新增 `toolConfig.editTooltip`。`viewMode` 的状态值 `crud`/`flat` 是逻辑枚举、不动，只翻其上的显示文案

测试：`mcp_tool_configuration.test.tsx`（同目录）与消费者集成测试 `mcp_server_edit.integration.test.tsx` 都在 `renderWithProviders` 的 zh locale 下按英文查这两个串——正是漏接信号。改：前者 `getByText("Flat List")`×4→`平铺列表`、`getAllByTitle("Edit display name and description")`×2→`编辑显示名称与描述`；后者 `findByRole("button", { name: "Flat List" })`×4→`{ name: "平铺列表" }`。`ToolRow` 与 `MCPToolConfiguration` 各有自己的 `t`（73、174 行），两处改动分别落在各自作用域内

既有漂移不动：这三个 .tsx 在 HEAD 即不过 prettier（组件 90/126-146/466 等行、测试里 `getByText("只允许字母…")` 多行块、集成测试 `getByLabelText(/MCP Server URL…/)` 超长行），且我改的行本身 prettier 干净（不在 diff 里），大文件零散漂移不做无关重排。全量 `tsc` 在 `mcp_server_edit.test.tsx`（本簇没碰）和集成测试若干行报 `RegExp 不能赋给 string` 等存量类型债、eslint 13 警告全是组件既有 exhaustive-deps/条件链——均 HEAD 基线，本簇零新增

验证：`mcp_tool_configuration.test.tsx`(5) + parity + missingKeys 三文件 14 例全绿；消费者 `mcp_server_edit.integration.test.tsx` 23 例全绿（含 4 处改中的平铺列表点击）；Type Errors 无报错；prettier 本簇改动行净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +1 至 10873（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 252 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/search-tools/_components/SearchToolView.tsx`（搜索工具详情视图，已挂 `searchTools`，长尾漏接）。收口 5 处：`Back to All Search Tools` 返回钮、两个复制钮的 `aria-label`（Copy search tool name/ID）、API Key 缺省文案 `Not set`、created_at 缺省文案 `Unknown`。新增 3 键（backToAll/copyNameAria/copyIdAria），复用 2 处

复用：`Not set`→`common.notSet`、`Unknown`→`common.unknown`（现成通用键，不另开）。`common.notSet` 值是 "Not Set"（大写 S），与写死的 "Not set"（小写）仅大小写之差，按"同概念归一到规范键"复用、不再为这点差异留一个长尾串。两个 `aria-label` 与 `Back to All Search Tools` 是搜索工具专属、`searchTools` 内无现成键，新增

判据：卡片列头 `{t("providerCol")}`/`apiKeyCol`/`createdAtCol`/`descriptionCol` 早已接好；`api_key ? "****" : ...` 的 `****` 是掩码、技术占位、不翻；`search_tool_name`/`search_tool_id`/`description`/provider 友好名都是后端数据，不动

测试：`SearchToolView.test.tsx` 走 `renderWithProviders`（钉 zh），三处断言随接线改中——`getByText("Not set")`→`未设置`、`getByText("Unknown")`→`未知`、返回钮 `getByRole("button", { name: /back to all search tools/i })`→`/返回所有搜索工具/`（本就在 zh locale 下钉英文正则，正是漏接信号）。两个复制钮的测试用 `within(container).getByRole("button")` 取钮、不按 aria-label 名查，故 aria-label 改动对测试不可见；`it()` 标题里的 'Not set'/'Unknown' 是描述文本、不动。两个消费者 `SearchTools.test.tsx`/`SearchTools.integration.test.tsx` 都把 `./SearchToolView` 整个 `vi.mock` 掉，真实 DOM 从不渲染，无外部断言受影响

验证：`SearchToolView.test.tsx`(19) + parity + missingKeys 三文件 28 例全绿、Type Errors 无报错；eslint 真路径 0 错误 11 警告，全是测试里既有 `.closest("div")`/`.querySelector` 的 node-access（HEAD 既有、本簇只改 3 个串字面量、零新增），组件文件本身 0 问题；prettier 净；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +3 至 10872（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 251 簇更新

继续串行推进。这一簇是 `src/components/TeamsPage/TeamsTable.tsx`（团队表筛选抽屉，已挂 `teams` 与 `teams.teamsTable` 两路、`common`，长尾漏接）。收口筛选抽屉 7 处：三个 `DataTableFilterField` 标签、两个 `Input` 占位符、`SearchSelect` 的占位符与 emptyText。新增 5 键（teamsTable 下 filterTeamAlias/selectOrgPlaceholder/noOrganizationsFound/enterTeamAliasPlaceholder/enterTeamIdPlaceholder），复用 2 处

复用：`Organization` 标签直接接现成 `t("listOrganization")`（"Organization"/"组织"，EXACT）、`Team ID` 接 `t("listTeamId")`（"Team ID"/"团队 ID"，EXACT）。`Select an organization…` 虽与 `infoSelectOrganization`（"Select an organization"）近义但带省略号、且属另一上下文，按 sibling 占位符在 `teamsTable.searchPlaceholder`（"Search teams by name or ID…"）同款「… 收尾」约定，单开带省略号键、不硬凑复用。`Team alias` 全 ns 无 EXACT 键，新键

测试耦合（本簇最重要的教训）：先前用 `grep -rn TeamsTable ... | grep -v TeamsPage/TeamsTable` 排消费者，结果把同目录的 `TeamsPage/TeamsTable.test.tsx` 也一起 `-v` 掉了，一度误判"无耦合"。真跑 `tsc` 时它报了本文件外的一条既有 null 错，顺带暴露了这个被漏看的同目录测试。读它发现：它走 `renderWithProviders`（钉 zh）、真渲染 TeamsTable 并 `openFilters()`，用 `findByPlaceholderText(/Enter team alias/)`、`/Enter team ID/` 两条英文正则定位筛选输入框——这正是"测试在 zh locale 下按英文串查 UI"的漏接信号（组件没接键时它才命中英文）。接好后这两条正则必断：改 `/输入团队别名/`、`/输入团队 ID/`（正则不含省略号，命中"输入团队别名…"）。其余断言（筛选钮"筛选"、列头"团队/创建时间"、单元格、动作菜单等）早中文、不动；标签、emptyText 无断言。教训回记：找同目录测试别用会被自身路径误伤的 `grep -v`，改用更精确的负向或直接读目录 `ls`

验证：`TeamsTable.test.tsx`(27) + parity + missingKeys 三文件 36 例全绿、Type Errors 无报错（全量 `tsc` 报的 172 行 `queryByText().closest` 可空错是该测试 HEAD 既有类型债、vitest 类型测未拦、非本簇引入）；eslint 真路径 0 错误 5 警告（一处 `any` + 四处 `.closest` node-access，全既有、本簇 2 行正则改动零新增）；prettier 净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +5 至 10869（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 250 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/guardrails/_components/guardrail_garden.tsx`（护栏花园页，已挂 `guardrails.garden`，长尾漏接）。收口 2 处：Decision Model 区段标题与它的说明句。新增 2 键（decisionModelTitle/decisionModelDesc）

判据与命名：本组件早把三个区段里的两个接好了（litellmTitle/litellmDesc、partnerTitle/partnerDesc），唯独第三个 Decision Model 区漏接，是"同段已建键、隔壁一段写死"的典型。新增按既有 `<类别>Title`/`<类别>Desc` 命名约定走 `decisionModelTitle`/`decisionModelDesc`。`decisionModelTitle` 的值 "Decision Model" 与现成 `typeDecisionModel`/`providerDecisionModel`（卡片类型徽标用）英文相同，但不复用：那两键是卡片类型标签、语义与"区段大标题"不同，且若绑一起日后改徽标会悄悄改到标题；按"同段同款、各管一面"的 sibling 约定单开键更可读。说明句唯一、`yes/no` 的 `/` 与无花括号/尖括号/撇号，ICU 安全

测试：`guardrail_garden.test.tsx` 走 `renderWithProviders`（钉 zh）。原 "should render both sections..." 用例（其实漏了第三个区段）只断言了 litellm+partner 两段的中文标题/说明、本就没钉 Decision Model，所以接键前不会红。把该用例扩成断言三段（重命名为 "all three sections..."），补 Decision Model 的 `决策模型` 标题与整句中文说明断言——这是有意义的回归：接键前这两句渲染的是英文，补的断言会红，接好后转绿，验证了漏接收口。`card.name`/detail mock 的 `Back to garden` 是测试桩与卡片数据，不动；消费者 `guardrail_garden_detail.test.tsx` 钉的是 typeDecisionModel/providerDecisionModel（卡片视图，非本页区段标题），不受影响

格式：本 .tsx 与其测试在 HEAD 即不过 prettier（两个 h2 单行超 120、测试的 getByText 多行块等是既有漂移），本簇新增行沿用了同款风格；为不把我的行再加进漂移、又不一并动无关行，对这两个小 .tsx 跑了一次 prettier --write 整文件归位（纯格式化、git diff 仅 4+2 处换行/缩进、无逻辑改动），改完 prettier 净、eslint 0 问题、测试仍 6 例全绿

验证：`guardrail_garden.test.tsx` + parity + missingKeys 三文件 15 例全绿、Type Errors 无报错；eslint 真路径 0 问题；prettier 净（整文件归位后）；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +2 至 10864（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 249 簇更新

继续串行推进。这一簇是 `src/components/SCIM.tsx`（SCIM 配置页，已挂 `scim`，长尾漏接）。收口 10 处：zod 校验文案、SCIM 简介句、两步标题（SCIM Tenant URL / Authentication Token）、URL 说明句、`Copy` 两钮、`Create SCIM Token` 钮、令牌警示句、`Create Another Token` 钮。新增 7 键（nameRequired/intro/tenantUrl/tenantUrlHint/authToken/tokenWarning/createAnotherToken），复用 2 处

判据与复用：`Create SCIM Token` 早有一模一样的现成键 `createButton`，组件却写死英文串，直接并到 `t("createButton")`（这正印证扫描器"已接入仍有英文"口径——键齐了但调用点没接）；两个 `Copy` 走现成 `common.copy`，新增 `commonT = useTranslations("common")`。`SCIM`、`LiteLLM`、URL 模板 `<your_proxy_base_url>`、`console.error("Error creating SCIM token:", ...)` 前缀、后端派生的 `error.message` 都是技术标识/动态值/日志前缀，按口径不翻

zod 校验文案同第 246 簇：模块级 `scimTokenSchema` 拿不到 `t`，改工厂 `buildScimTokenSchema(nameRequired)`，组件内 `useZodForm(buildScimTokenSchema(t("nameRequired")), ...)`，类型走 `z.infer<ReturnType<typeof buildScimTokenSchema>>`

测试：`SCIM.test.tsx` 走 `renderWithProviders`（默认钉 zh）。原先按钮写死英文，测试用 `/create scim token/i`（大小写无关的英文正则）点按钮、用 `"Please enter a name for your token"` 钉校验——这些在 zh locale 下能命中，恰因组件没接 t。接好后改中：6 处 `{ name: /create scim token/i }`→`{ name: "创建 SCIM 令牌" }`、1 处 `{ name: /create another token/i }`→`{ name: "创建另一个令牌" }`、校验 `findByText`→`请输入令牌名称`。`fireEvent.change(...{ value: "My SCIM Token" })` 是用户手填的 key_alias 输入值、不是 UI 文案，且随后断言 `keyCreateCall` 收到同名，保留英文；`getByDisplayValue("https://proxy.example.com/scim/v2")` 钉 URL、不动。消费者 `AdminPanel.tsx` 在 `AdminPanel.test.tsx` 里把 `@/components/SCIM` 整个 `vi.mock` 掉，全库 grep 确认无其他测试钉这些串

验证：`SCIM.test.tsx` + parity + missingKeys 三文件 17 例全绿、Type Errors 无报错（失败用例的 stderr 是 `console.error` 打的被 catch 报错、属预期）；eslint 真路径 0 错误 5 警告，全是 HEAD 既有（`proxySettings: any`/`useState<any>`/`catch(error:any)` 三处 any + 测试两处内联对象），本簇零新增；prettier 本组件与测试净；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +7 至 10862（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 248 簇更新

继续串行推进。这一簇是 `src/components/claude_code_plugins/MakeSkillPublicForm.tsx`（把技能发布到技能中心的向导弹窗，已挂 `claudeCodePlugins`，长尾漏接）。收口 11 处：两步指示器标题、`Select All (N)`、说明句、`N skill(s) will be published` 两行（步骤一与步骤二，后者带 `Total:` 前缀）、成功 toast、空选 toast、底部 `Cancel`/`Previous`/`Next`/`Publish to Hub` 四钮

手法：复用优先。空选 toast 与 `handleNext` 早用的 `selectAtLeastOne` 同串，写死处直接改接该键；`Cancel`/`Previous`/`Next` 走现成 `common` ns（新增 `commonT = useTranslations("common")`），步骤二标题 `Confirm` 复用 `common.confirm`；`Publish to Hub` 与已有 `publishToHub`（值"Publish to Skill Hub"，作 DialogTitle）语义同一动作，按钮直接并给该键、不再为短一点的字面量另开近似键。新增 6 键：stepSelectSkills、selectAllWithCount、publishHint、countWillPublish、totalWillPublish、publishSuccess

两条 `will be published` 是「数字 + 英文复数 s」的句，且把数量加粗在 `<strong>` 里，不能拆成 prefix/suffix 碎片（会丢 ICU 语序自由，见第 244 簇教训）。走 `t.rich(key,{count, strong:(c)=><strong>{c}</strong>})`，消息里 `<strong>{count, plural, one {# skill} other {# skills}}</strong> ...`，中文写成"将发布 <strong>{count, plural, other {# 个技能}}</strong>"（中文无复数，只留 `other` 臂）。`<strong>` 在 parity 测试的 `RICH_TAGS` 白名单内，`#` 后紧跟文本（`# 个技能`）合 `^#\s+\S`，`{count}` 两侧同名、复数臂带逗号，全过 `messagesParity` 的语法关；成功 toast 同理用复数键 `publishSuccess`。`skill(s)` 这种"字面括号"弃用，统一走 ICU 复数，渲染更准

测试：本组件无同目录测试，唯一消费者 `AIHub/ModelHubTable.tsx` 在弹窗 `visible` 时才挂载其内部，`ModelHubTable.test.tsx` 不深渲染、不钉这些串（已 grep 确认无测试钉 `Publish to Hub`/`Select All (`/`will be published`/`Skill Hub updated` 等旧英文），故本簇无断言可同步；验证靠 `missingKeys` 静态收这 11 个 `t(...)`/`t.rich(...)` 调用点 + `messagesParity`（含新复数/rich 键的语法与中英对齐）+ 消费者 `ModelHubTable.test.tsx` + 生产构建

验证：`messagesParity` + `missingKeys` 两文件 9 例全绿、Type Errors 无报错；消费者 `ModelHubTable.test.tsx` 14 例全绿；eslint 真路径 0 问题；prettier 本组件净（两个 JSON 目录在 HEAD 即不过 prettier、非 prettier 托管，按既有 4 空格缩进对齐本簇新增行、不整文件重排）；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +6 至 10855（en/zh 双侧一致），同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 247 簇更新

继续串行推进。这一簇是 `src/components/organization/org-settings/OrgSettingsForm.tsx`（组织设置表单，早挂 `organizations.orgForm` 与 `organizations` 两个 ns，长尾漏接）。收口 5 处，全是"目录里键已建好、调用点却写死英文"的典型漏接，零新键纯复用：成功 toast `Organization settings updated successfully`→`orgT("updateSuccess")`、失败兜底 `Failed to update organization settings`→`orgT("updateFailed")`、存 vector-store 选择器占位符 `Select vector stores`→`t("vectorStoresPlaceholder")`、MCP 选择器占位符 `Select MCP servers and access groups`→`t("mcpServersPlaceholder")`、提交按钮 `Saving...`/`Save Changes`→`orgT("saving")`/`orgT("saveChanges")`

判据：`orgT("updateFailed")` 只换 `error instanceof Error` 假分支的兜底字面量，真分支仍透传后端 `error.message`（动态值不翻）；两个 placeholder 现成键比硬编码串多一个 `(optional)` 尾，但这是同 ns 内为这两个可选选择器预备的规范文案，`org-create/OrgCreateDialog.tsx` 已用同名键，对齐复用、不改语义，"optional"本就属实（字段确为可选）；`vectorStores`/`mcpServersAndAccessGroups` 是这些字段的标签键（早接），占位符走各自的 `*Placeholder` 键，不混用

测试：`OrgSettingsForm.test.tsx` 走 `renderWithProviders`（默认钉 zh），两个选择器被 `vi.mock` 成按钮、placeholder 从不渲染，四条 toast 无断言，故只有提交按钮受影响——原先按钮写死英文，12 处 `getByRole("button", { name: "Save Changes" })` 一并改 `{ name: "保存更改" }`；`it()` 标题里的 "Save Changes" 是描述文本、不动。消费者 `organization_view.tsx` 的真测试 `organization_view.test.tsx` 不钉这些串（已 grep 确认），`OrganizationsPanel.test.tsx` 把 organization_view 整个 `vi.mock` 掉，不受影响；其余命中 `Save Changes` 的是 project/users/agent/router_settings 各自组件、与本簇无关

验证：`OrgSettingsForm.test.tsx` + parity + missingKeys 三文件 21 例全绿、Type Errors 无报错；eslint 真路径 0 问题；prettier 净（`onError` 兜底改短后 prettier 要求单行收齐）；tsc 真路径本文件零命中（全量 tsc 报的是 HEAD 既有他文件错）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；零新键，目录叶子仍 10849、同值 139 不变；本簇把 1 个"已接入仍有英文"文件清零，长尾减 1

## 2026-10-18 第 246 簇更新

继续串行推进。这一簇是 `src/components/model_add/reuse_credentials.tsx`（复用凭据弹窗，已挂 `reuseCredentials`，长尾漏接）。收口 4 处：zod 校验失败文案 `Credential name is required`、存值只读输入框的占位符 `Enter ${key}`、外链 `Need Help?`、`Cancel` 按钮。新增 4 键（nameRequired/enterField/needHelp/cancel），标题与提交按钮沿用现成 `title`/`submit`/`nameLabel`/`githubHelp`

判据与手法：校验文案不是 JSX 串，藏在模块级 `z.object(...).min(1, "字面量")` 里，拿不到 `t`。把该 schema 改成工厂 `buildReuseCredentialsSchema(nameRequired)`，在校验消息位收一个已译好的串参数，组件内 `useZodForm(buildReuseCredentialsSchema(t("nameRequired")), {...})` 现取现用；`ReuseCredentialsFormValues` 类型随之走 `z.infer<ReturnType<typeof buildReuseCredentialsSchema>>`，不丢推断。占位符 `Enter {field}` 做成带 `{field}` 参数的键（两侧都声明 `{field}`，符合"占位符只增不改"），`FieldLabel` 里裸显示的 `{key}`（`api_key` 之类）是后端字段名/技术标识、按口径不翻也不套 t。`Need Help?` 与 `githubHelp` tooltip 是两句不同串，分键不复用

测试：`reuse_credentials.test.tsx` 走 `renderWithProviders`（默认钉 zh），把两处英文断言改中——校验失败 `findByText("Credential name is required")`→`请输入凭据名称`，取消按钮 `getByRole("button", { name: "Cancel" })`→`取消`。`it()` 标题里的 "Cancel is clicked" 是描述文本、非查询串，不动；`getByLabelText("api_key")`/`api_base` 钉的是 `FieldLabel` 里的技术字段名（本就不翻），不动；其余断言（`复用凭据` 提交、`凭据名称：` 标签）早已中文，不改

验证：`reuse_credentials.test.tsx` + parity + missingKeys 三文件 16 例全绿、Type Errors 无报错；eslint 真路径 0 问题；prettier 净；tsc 真路径本文件零命中（全量 tsc 报的是 `returnUrlUtils.test.ts`/`roles.test.ts`/`top_key_view.test.tsx` 等 HEAD 既有错，与本簇无关）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子复算 +4 至 10849（同法复测 HEAD 为 10845），同值 139 不变

## 2026-10-18 第 245 簇更新

继续串行推进。这一簇是 `src/components/model_group_alias_settings.tsx`（模型组别名设置，已挂 `modelGroupAlias`，长尾）。收口 5 处：`Add Alias` 按钮、行内 `Save`/`Cancel`、空态 `No aliases added yet. Add a new alias above.`、配置示例说明句 `Here's how your current aliases would look in the config.yaml:`。新增 5 键（addAliasBtn/save/cancel/noAliases/configExampleIntro）

判据两处：按钮 `Add Alias` 与既有标签键 `addAlias`（"Add New Alias"）英文不同，按口径分键 `addAliasBtn` 不复用；下方 `router_settings:` / `model_group_alias:` / `# No aliases configured yet` 是示例 config.yaml 的代码内容，按第 222 簇"示例代码内容判不翻"的口径整块保留英文，只翻它外面的说明句

测试：本组件无同目录测试，唯一消费者 `models-and-endpoints/panels/ModelGroupAliasPanel.tsx` 在 `page.test.tsx`/`page.integration.test.tsx` 里被 `vi.mock` 成 `<div data-testid="panel-alias">`，真实 DOM 从不在测试里渲染，全库 grep 也确认没有别的用例钉这 5 个串（其他测试里的 `Save`/`Cancel` 是各自组件、与本组件无关）。所以本簇是纯展示串替换，无断言可同步；验证靠 `missingKeys` 静态扫（已收录这 5 个 `t("...")` 调用点）+ `messagesParity` + 生产构建三道关，不新增空断言测试凑数

验证：`messagesParity` + `missingKeys` 全绿、Type Errors 无报错；eslint 0 问题、prettier 净、tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10837（+5），同值 139 不变

## 2026-10-18 第 244 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/tag-management/_components/index.tsx`（标签主页，已挂 `tagManagement`，长尾，和第 239 簇同 ns）。收口：页首提示 `Click on a tag name...`、带文档链接的标签路由说明句、`+ Create New Tag` 按钮、删除弹窗的 title/message/resourceInformationTitle/字段标签。`Tag Name` 复用现成 `tagName`；新增 6 键（deleteTagTitle/deleteConfirmMessage/tagInformationTitle/listHint/tagRoutingHelp/createNewTagBtn）

说明句 `...Read more about tag routing here.` 里 `here` 是个外链，走 `t.rich("tagRoutingHelp",{ link:(chunks)=><a href=...>{chunks}</a> })`，`<link>` 在富文本白名单内、无需登记；链接文本 `here` 连同整句一起进消息，不再拆成 prefix/suffix 碎片（碎体会丢 ICU 的语序自由，中文可把"请阅读此处"放到句尾自然位置）。`+ Create New Tag` 与既有 `createTitle`（"Create New Tag"，无加号）语义有别，按口径分键 `createNewTagBtn`，不把 `+` 拼在 JSX 里

测试：`index.test.tsx` 走 `renderWithProviders`，只 3 处 `findByText/queryByText("Tag Information")` 改 `标签信息`；其删除按钮断言本就是 `/删除/`、取消是 `取消`（`DeleteResourceModal` 的内建按钮早被翻好，非本簇 props），不动。说明句、提示、创建按钮、message 无断言覆盖，全库扫无其他钉点。`CreateTagModal`/`TagTable`/`TagInfo` 是各自子组件，不经这层

验证：`index.test.tsx` + parity + missingKeys 三文件 13 例全绿、Type Errors 无报错；eslint 真路径 0 错误 3 警告（any/inline-object/exhaustive-deps，均 HEAD 既有、本簇未碰，与 HEAD 基线 3 警告持平）；prettier 净（t.rich 块本已合规）；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10832（+6），同值 139 不变

## 2026-10-18 第 243 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/vector-stores/_components/index.tsx`（向量存储主页，已挂 `vectorStores`，长尾）。收口：四个页签（Create/Manage/Test/Indexes）、`+ Add Vector Store` 按钮、`Last Refreshed:` 标签、页首说明句、删除弹窗的 title/message/resourceInformationTitle/字段标签、以及四条 toast（fetchList/fetchCreds 失败、delete 成功/失败）

`vectorStores` 是已建得很全的 ns，本簇大量复用现成键：`createTitle`（创建向量存储）、`testerTitle`（测试向量存储）、`deleteConfirmTitle`（删除向量存储）直接接给页签与弹窗标题，不另开键；只新增 12 个（manageTab/indexesTab/addVectorStore/pageIntro/lastRefreshed/deleteConfirmMessage/deleteInfoTitle/vectorStoreIdShort + 四条 toast 前缀）。删除弹窗的 message 与既有 `deleteConfirmBody`（含 `{name}`）语义不同（这处不带 name），故新键而非硬塞 name

toast 的 `"前缀 " + error` 拼接改成带 `{error}` 参数的单条消息（`t("fetchListFailed",{error:String(error)})`），既避免把英文冒号前缀留在译文里，也满足"占位符只增不改"：两侧都声明 `{error}`。`console.error(...)` 前缀按口径不动。`toast.fromError` 收 string 也收 Error，传 t 的结果安全

测试：`index.test.tsx` 走 `renderWithProviders`，把四个按角色名查的页签与按钮改中（`getByRole/queryByRole("tab",{name})` 的 `Manage Vector Stores`→`管理向量存储`、`Create Vector Store`→`创建向量存储`、`Indexes`→`索引`，`button name "+ Add Vector Store"`→`+ 添加向量存储`）。只改 `name:` 实参、不动 `it()` 标题里的同名串。四条 toast 与删除弹窗文案本文件无断言覆盖，全库扫确认无其他钉点（`Vector Store Management` 那条 `queryByText` 负向断言仍成立，因 `pageTitle` 早已是中文）。其余 `vector-stores` 测试渲染的是各自子组件、不经这层 tabs

验证：`index.test.tsx` + parity + missingKeys 三文件 21 例全绿（一条 loading 用例的 stderr 是被 catch 的 fetch 报错、属预期）、Type Errors 无报错；eslint 真路径 0 错误 1 警告（`useEffect` deps，HEAD 既有、本簇未碰），temp 路径多出的 2 error 是文件名解析假象；prettier 改动区收齐；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10826（+12），同值 139 不变。下一簇可继续 `vectorStores` 邻近子组件，或转按命中数排未接入队列

## 2026-10-18 第 242 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/caching/_components/cache_health.tsx`（健康检查页，已挂 `caching`，长尾漏接）。收口：`Run Health Check`/`Running Health Check...` 按钮、`Summary`/`Raw Response` 页签、`Cache Status:` 标签、`Error Details`/`Cache Details`/`Redis Details` 三个分区标题、错误回退 `Unknown error`（复用现成 `caching.unknownError`）、`No traceback available`、`Error parsing details`。共 10 个新键

判据：分区标题、页签、按钮、标签是展示文案，翻；`Cache Status: ` 后面跟的 `response?.status`（`healthy`/`unhealthy`）是后端状态值、保留英文不动（与 `N/A` 同理）；`litellm_settings.cache_params` 这个字段标签是点号配置路径、是技术标识不翻；`deepParse`/`redisDetails` 里的 `"N/A"` 兜底是通用占位、不翻。`CacheHealthDetails` 在 `try`/`catch` 顶层拿 `t`（L81 已 `useTranslations`），回退文案直接 `t(...)`

测试：`cache_health.test.tsx` 走 `renderWithProviders`，原本就中英混钉（已翻的 `Ping 响应`/`Redis 主机` 钉中文，未翻的钉英文）。把 8 类断言改中：`Run Health Check`→`运行健康检查`、`Running Health Check...`→`健康检查运行中...`、`/Cache Status:/`→`/缓存状态:/`、`Cache Status: healthy`/`unhealthy`→`缓存状态: healthy`/`unhealthy`（状态值仍英文）、`Cache Details`→`缓存详情`、`Redis Details`→`Redis 详情`、`Error Details`→`错误详情`、`Summary`→`摘要`、`Raw Response`→`原始响应`。mock 数据 `success`/`Connection refused`/`redis.internal`/`7.2.1`/`litellm-ns` 是后端值，不动。消费者 `cache_dashboard.tsx` 只传 props 不钉这些串，无外部测试受影响

验证：`cache_health.test.tsx` + parity + missingKeys 三文件 19 例全绿、Type Errors 无报错；eslint 真路径 0 错误 11 警告，与 HEAD 基线 11 警告持平（temp 路径多出的 1 error 是文件名解析假象）；prettier 净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10814（+10），同值 139 不变。再记一条目录命名坑：`caching` 这个顶层 ns 之外，`coordination` 子对象里还有个嵌套 `"caching"`（只含 `loadFailed`/`rangeNote`），按整行 `"caching": {` 匹配会先命中嵌套块、把键插错；本簇改用 `caching.unknownError` + 紧邻 `toast` 子对象作锚才落到顶层 ns（与 WORKFLOW 第二步"锚点带顶层缩进并断言唯一"同源）

## 2026-10-18 第 241 簇更新

继续串行推进。这一簇是 `src/components/mcp_tools/ByokCredentialModal.tsx`（BYOK 凭据弹窗，早已挂 `t = useTranslations("byokModal")`，长尾漏接）。收口 8 处：标题 `Connect {server}`、`LiteLLM needs access to {server}...`、主按钮 `Continue to Authentication`、`Cancel`、`Where do I find my API key?`、可见的 `Save key for future use`、安全说明句、`Connect & Authorize` 按钮。新增 7 个 `byokModal` 键；可见的"Save key for future use"与同义 `saveKeyAria` 是同一句英文，复用现成 `saveKeyAria` 不另开键。`&` 在 ICU 里是普通字面量，`Connect & Authorize` 直接进目录，JSX 原 `&amp;` 实体随之去掉

测试：`ByokCredentialModal.test.tsx` 走 `renderWithProviders`，仅两步操作断言 `getByText("Continue to Authentication")` 与 `getByRole("button", { name: /Connect & Authorize/ })` 改中文（`前往身份验证`、`/连接并授权/`）。全库扫确认无其他用例钉这些串，无外部消费者 import 此 modal

验证：`ByokCredentialModal.test.tsx` + parity + missingKeys 三文件 11 例全绿、Type Errors 无报错；eslint 0 问题（prettier 要求标题行换行，按本簇改动行收齐）；tsc 真路径本文件零命中；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10804（+7），同值 139 不变。另注：本簇前用启发式扫"已接入仍有英文"长尾时命中过 `add_model_modes.tsx` 的 `AUTO_ROUTER_MODES`，但 grep 确认它零消费者、零测试（死导出），不产生用户可见英文，故不翻也不作候选

## 2026-10-18 第 240 簇更新

继续串行推进。这一簇是 `src/components/GuardrailsMonitor/LogViewer.tsx`（已接入 `guardrailsMonitor.log`，长尾）。收口：护栏动作徽标四类（Blocked/Passed/Flagged/Not run）、筛选按钮四枚（All/Blocked/Flagged/Passed）、`Logs — {name}` 与 `Request Logs` 标题、`Loading…`/`Showing {shown} of {total} entries`/两条空态。共新增 12 个 `guardrailsMonitor.log` 键

判定口径：`actionConfig` 里的 `label` 是纯展示串，比对走的是枚举键 `log.action === activeFilter`（值 `"blocked"` 等），与 `label` 文案无关，所以 label 可放心翻。`actionConfig` 是模块级常量拿不到 `t`，且 WORKFLOW 已禁止给它注入翻译器到模型驱动层——这里不是喂模型，只是渲染层，做法是把 `label` 字段从 `actionConfig` 摘掉，另立 `ACTION_LABEL_KEYS`/`FILTER_LABEL_KEYS` 两份 `as const satisfies` 映射（键取自动作/筛选枚举，值是 `log.*` 键名），渲染处写 `t(ACTION_LABEL_KEYS[log.action])`/`t(FILTER_LABEL_KEYS[f])`。动词译法对齐同命名空间既有 `guardrailsMonitor.chart.blocked="拦截"`/`chart.passed="通过"`，新键取 拦截/通过/标记/未运行/全部

测试：`LogViewer.test.tsx` 走 `renderWithProviders` 钉 zh-CN，仅徽标那条用例（`it("renders a not_run log as a neutral Not run badge...")` 标题不改）里 3 处 `getByText("Not run")`/`queryByText("Passed")`/`queryByText("Blocked")` 改为 `未运行`/`通过`/`拦截`。全库扫 `GuardrailsMonitorView.test.tsx`/`GuardrailDetail.test.tsx` 确认没别的用例钉这些串

验证：`LogViewer.test.tsx` + parity + missingKeys 三文件 12 例全绿、Type Errors 无报错；eslint 真路径 0 错误 2 警告（complexity 28 与 inline-object，均 HEAD 既有、计数持平），temp 拷贝路径冒出的 2 error 是 eslint 按文件名解析的老假象，不在真路径复现；prettier 改动区净；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数不动；目录叶子涨到 10797，同值 139 不变。下一簇仍按"已接入仍有英文"长尾取轻测试者（`AllModelsTab.tsx` 等），或转按命中数排未接入队列

## 2026-10-18 第 239 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/tag-management/_components/TagTable.tsx`（早已接入 `tagManagement`，属"已接入但仍有英文"长尾）。收口四处：`NoMatchingTags` 空态两句、`TagFilters` 两个输入框的 `aria-label` 与 `placeholder`。`NoMatchingTags` 与 `TagFilters` 都是 React 组件，直接各自 `useTranslations("tagManagement")` 即可（不像列定义工厂要走首参）。新增 6 个键：`noMatchingTags`/`noMatchingTagsDesc` + `filterByName`/`filterByNamePlaceholder`/`filterByDescription`/`filterByDescriptionPlaceholder`。placeholder 与 aria-label 英文只差结尾省略号，属语义有别的两处，按 WORKFLOW 不并键、各开一个，中文 placeholder 也带 `…`

测试：`TagTable.test.tsx` 走 `renderWithProviders` 钉 zh-CN，9 处 `getByRole("textbox", { name: "Filter by tag name"/"Filter by description" })` 与 1 处 `getByText("No matching tags")` 改中文（`getByRole` 的 `name` 命中 `aria-label`，与 placeholder 无关，故只动 aria 对应值）。该测试文件无对 placeholder 的断言

踩到的取舍：本想找 `caching/cache_dashboard.tsx` 当目标（同属"已接入仍有英文"且串多），但其 `cache_dashboard.test.tsx` 深测图表内部——按英文 dataKey 断言 `Bar` 的 `name` 与颜色映射（`{"Generated Completion Tokens": ...}`）。给图表接 `categoryLabels` 会把 `Bar name` 换成中文（`bar_chart.tsx:126`），连锁改一片颜色/图例断言，收益风险不划算，遂改挑串少、测试轻的 `TagTable.tsx`。`cache_dashboard.tsx` 仍挂在"已接入仍有英文"账上，做它时要么走 `categoryLabels` 并连带同步图表内部断言，要么只翻统计卡与文案、暂留图例英文

验证：`TagTable.test.tsx` + parity + missingKeys 三文件 29 例全绿、Type Errors 无报错；eslint 改动文件 0 错误 1 警告，且该警告与 prettier 待改行（第 76 行 `columns = useMemo`）都是 HEAD 既有、本簇未碰，按口径不 `--write` 整文件；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 与接入计数 912/689 不动；目录叶子 10780 涨到 10786（新增 6 键），中英同值 139 不变。下一簇按"已接入仍有英文"长尾取串少测试轻者（如 `GuardrailsMonitor/LogViewer.tsx`、`models-and-endpoints/components/AllModelsTab.tsx`），或回到按命中数排序的未接入队列

## 2026-10-18 第 238 簇更新

继续串行推进。这一簇是 `src/app/(dashboard)/usage/_components/components/EntityUsage/EntityUsage.tsx`，第 237 簇的直接消费者，属"已接入但仍有英文"长尾（早已挂 `t = useTranslations("usage.entity")` 与 `usageT = useTranslations("usage")`，但 JSX 里仍写死一批文案）。收口的面向用户字符串：三张表共 9 个列头（实体细分表 `capitalizedEntityLabel` 改译出的实体标签，其余 Spend/Successful/Failed/Tokens/Provider 复用现成的 `usage.provider.*` 四键 + `provider.provider`）、日消费图与每实体图两处 `customTooltip` 的行标签（复用 `entity.{requestCost,flatCost,totalCost,totalSpend}`、`usage.{totalRequests,totalTokens}`、`usage.provider.{successful,failed}`、`teamUserSpend.requests`，新增 `totalEntities`/`spendByEntity`/`andMore`）、三处"目录有键但 JSX 漏接"的活账（`spendOverview`/`spendPerEntity`/`getStarted` 三键本就在两侧，JSX 却写死英文，现接回并传入译出的 `{label}`）、两张 DataTable 的 `noDataMessage`、agent 页签的 `Request / Token Consumption`、两条失败告警、`getFilterLabel`/`getFilterPlaceholder` 的 `Filter by`/`Select ... to filter`

实体类型标签此前根本没有定译：`capitalizedEntityLabel = entityType.charAt(0).toUpperCase() + ...` 把技术 id（user/team/tag/organization/customer/agent）直接首字母大写当文案。新增 `usage.entity.type` 子对象六键（`用户/团队/标签/组织/客户/智能体`），用 `as const satisfies Record<EntityType, string>` 的 `ENTITY_TYPE_KEYS` 映射，`entityLabel = t(ENTITY_TYPE_KEYS[entityType])`，替换所有 `capitalizedEntityLabel` 用处。图表 `categories`/dataKey（`"Request cost"`、`"Flat cost"`）按既有口径保持英文不动（是序列名不是文案，要译得走 `bar_chart` 的 `categoryLabels`，留给后续）

**踩到新坑：React Compiler 的 `react-hooks/preserve-manual-memoization`。** 把 `t()` 的结果（`entityLabel`、或整个 `usageT` 函数）放进 `useMemo` 依赖数组会报 error（不是 warning），编译器认定该依赖"may be modified later"、拒绝保留手工 memo。HEAD 的 `[capitalizedEntityLabel]` 是纯字符串方法链、不报错，一旦依赖变成 `t()` 产物就触发。修法不是把 `t` 塞进 deps（WORKFLOW 第三步那条在这台 React 编译配置下会撞 error），而是**去掉这两个列定义的 `useMemo`、改成普通数组常量**，让编译器自行 memo。先把表头解析成 `colSpend` 等字符串常量、再连同 `entityLabel` 一起进 deps 也仍报同一 error（被标记的是 `t()` 来源值本身），所以最终是删 memo。后续凡是"列定义 useMemo + 依赖来自 useTranslations"的文件，优先直接不手写 memo，别在 deps 上跟编译器较劲

测试同步：`EntityUsage.test.tsx` 里 16 处 `"<X> Spend Overview"`（Tag/Team/Organization/Customer/Agent/User，含 `NON_TEAM_PANELS`/`TEAM_PANELS` 两处数组与 capability gating 的 it.each）改为 `"<中文实体标签> 消费总览"`，`Request / Token Consumption` 改 `请求 / Token 消耗`，正则 `/Fetching spend data failed/` 改 `/消费数据拉取失败/`。消费者侧 `UsageExportHeader.test.tsx` 的 `Select tag to filter...` 是它自己 mock 传的字面 prop、与本簇无关；`ProjectDetailsPage.test.tsx` 的 `Spend by Model` 只是 describe 名；`EntityUsage.test.tsx` 的 `UsageExportHeader` mock 渲染 `filterLabel` 但没有任何用例断言其值，故零改。全库复扫确认这些串无其他钉点

验证：`entityUsageSummary.test.ts` + `EntityUsage.test.tsx` + parity + missingKeys 四文件 80 例全绿、Type Errors 无报错；tsc 全量本簇文件零命中；eslint 改动文件 5 警告 0 错误，与 HEAD 基线持平（此前一度冒出 1 条 `preserve-manual-memoization` error，按上法删 memo 后归零）；prettier 只改动本簇 tooltip/anchor 区（`{t("here")}</a>` 那条既有脏行正落在本簇改动的 getStarted div 内，一并收齐），不碰其他 hunk；`npm run build` 绿。扫描器口径：本文件本就接入，files with hits 269 不动、接入计数 912/689 不动；目录叶子 10764 涨到 10780（新增 10 平铺键 + `type` 子对象 6 键），中英同值 139 不变。下一簇仍按"已接入但仍有英文"长尾与未接入命中并行取，候选可回到 `EntityUsage` 同目录的 `TeamUserSpendCard`、`TopModelView` 等，或按未接入命中队列取 `components/Settings` 一带

## 2026-10-18 第 237 簇更新

继续串行推进，没有派子代理。这一簇是 `src/app/(dashboard)/usage/_components/components/EntityUsage/entityUsageSummary.ts`，扫描器 3 条命中的是模块里 3 条导出给 UI 的 tooltip 常量。但通读整树后确认面向用户的英文远不止这 3 条：`buildSummaryTiles` 与 `buildCostBreakdownTiles` 里 8 个 `title`（`Total Cost`/`Total Spend`/`Total Requests`/`Successful Requests`/`Failed Requests`/`Total Tokens`/`Request Cost`/`Flat Cost`）和 3 条 tooltip 都经 `EntityUsage.tsx` 的 `renderSummaryTile` 落到 `<h3>`/`TooltipContent`，一并收口

这是纯逻辑模块（不是组件、拿不到 Hook），按 `usageUnits.ts` 的首参翻译器约定处理：给两个 builder 加 `t: UsageTranslator` 首参，`hasFlatCost` 不接翻译器保持原样；调用点 `EntityUsage.tsx` 已握有 `usageT = useTranslations("usage")`，传进去即可。三条 tooltip 常量原先 `export`，全库 grep 只有本文件自用，改为直接 `t(...)` 后删掉导出。4 个指标名复用现成键（`usage.totalRequests`、`usage.totalTokens`、`usage.metrics.successfulRequests`、`usage.metrics.failedRequests`，中英已定），4 个成本名与 3 条 tooltip 新增到 `usage.entity`：`totalCost`/`totalSpend`/`requestCost`/`flatCost` + 三条 tooltip，成本词按 GLOSSARY 取"成本"、spend 取"消费"

测试两层。本模块的 `entityUsageSummary.test.ts` 是纯逻辑单测，改为 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "usage" })` 造 `t` 传入 builder，断言跟着翻中（`总消费`/`总成本`/`请求成本`/`固定成本`），`toContain("budget")` 改 `toContain("预算")`。消费者 `EntityUsage.test.tsx` 走 `renderWithProviders` 钉 zh-CN，4 处 `getByText`/`queryByText("Total Spend")` 全改 `"总消费"`，单文件 60 例复跑全绿。CSV 导出头 `teamUserSpend.test.ts` 里的 `Total Tokens` 是拼给后端的列名，按口径不翻

验证：`entityUsageSummary.test.ts` + `EntityUsage.test.tsx` + `messagesParity` + `missingKeys` 四文件 80 例全绿、Type Errors 无报错；tsc 全量本簇三文件零命中（报出的都是 `*.test.tsx` 里既有的 vitest 全局类型债，非本簇引入）；eslint 改动区 0 错误，`EntityUsage.tsx` 维持 HEAD 基线 5 警告 0 错误持平；`EntityUsage.tsx` HEAD 即 prettier 脏（521 行 `>{t("here")}</a>` 既有欠账），按口径不整文件 `--write`，只把本簇改动的 `breakdownTiles` 行收成单行与 prettier 对齐，其余既有待改 hunk 不动；`npm run build` 绿

覆盖率与扫描口径：本簇是首参翻译器文件，不含 `useTranslations(`/`getTranslations(`，grep 口径的接入计数（912/689）不动；但文件已无面向用户英文，退出命中清单，files with hits 270 减 1 到 269。目录叶子 10757 涨到 10764（新增 7 键 × 单侧），中英同值 139 不变（新键中英皆异）。下一簇建议取直接消费者 `src/app/(dashboard)/usage/_components/components/EntityUsage/EntityUsage.tsx`：它有多处"目录有键但 JSX 漏接"的活账（`spendOverview`/`spendPerEntity`/`getStarted` 三键已在两侧，JSX 仍写死 `${capitalizedEntityLabel} Spend Overview`、`Spend Per {...}`、`Get Started by Tracking cost per {...}`），外加两张表列头、图表 tooltip、两条失败告警、`Request / Token Consumption` 标签与 `Filter by`/`Select ... to filter` 这类硬编码英文

## 2026-10-18 第 236 簇更新

继续串行推进，没有派子代理。这一簇是 `src/app/(dashboard)/usage/_components/components/UsageAIChatPanel.tsx`，用量页 AI 问答面板（早已整片接 `usage.aiChat` 16 键）。扫描器 3 条命中：147 行 `Failed to load models:` 是 console.error 前缀、309 行是 lucide 聊天气泡图标的 SVG 路径几何（226 簇口径），均不翻。313 行是活账：目录两侧早就备好了 `emptyExample` 键，JSX 却把 `e.g. "Which model costs me the most?"` 用 `&quot;` 实体硬编码，本簇接回 `{t("emptyExample")}` 一行收口，目录零改动。盲区反查本片零撞库：65 行 `step.tool_label` 与 197 行 `statusMessage` 是后端流事件透传值（兜底早已 `t("thinking")`），49 行日期区间的 `→` 分隔符与 ✓/✗、`TOOL_ICONS` 表情是纯标记，按口径不翻。测试零改动：本片与消费者 `UsagePageView.test.tsx` 都走 `renderWithProviders` 钉 zh-CN，没有任何用例钉这句英文。全库 grep 示例句原文确认无其他钉点。验证：两文件 48 例全绿、Type Errors 无报错；tsc 锚定零命中；eslint 路径 stash 前后均 5 警告 0 错误持平；该文件 HEAD 即 prettier 脏（68 行 `filterLabel` 拼接行的既有欠账），按口径不 `--write`，本簇改动区不在 prettier 待改 hunk 内；`npm run build` 绿。扫描器本片留 2 条登记不翻，files with hits 270 不动，覆盖率三项不动（912/689、10757、139）。下一簇按队列取 `src/app/(dashboard)/usage/_components/components/EntityUsage/entityUsageSummary.ts`（3 条）。

## 2026-10-18 第 235 簇更新

继续串行推进，没有派子代理。这一簇主体文件是 `src/app/(dashboard)/users/_components/view_users/user_info_view.tsx`，用户详情视图（早已整片接 `users` 域与 `common.budgetDuration`，`info*` 键体系齐全）。扫描器 3 条命中全部判不翻登记：163/228/269 行 `Error fetching user data:`/`Error adding user to team:`/`Error removing user from team:` 是 console.error 前缀（195/208/210/212/231/233 簇口径，失败的用户可见面走 `toast.fromError(...)`），阅读时顺带确认 187/311/359 行还有三条同款前缀（扫描器因单词数不够没报）。盲区反查本片零命中：828 行 `{option.value}` 渲染的成员角色 `user`/`admin` 是线值比较与透传（224/225 簇 `Admin` 口径）。本文件代码零改动，与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁对主体文件由构造持平。

这一簇真正的活是补第 232 簇的消费者测试欠账，教训记一下：翻共享组件的字符串必须全库扫消费者测试，第 232 簇当时只定向 grep 了手头点名的几个文件，漏了两处。`user_info_view.test.tsx` 是裸 `render` 加 `vi.mock("next-intl")` 的英文字典 mock，未登记的键查不到会原样回落到键名本身，所以把断言翻成中文反而必红。正确修法是往 mock 字典补 `mcpToolPermissions.selectAll`/`deselectAll`/`loadingTools` 三条命名空间英文键，按钮断言保持英文。`user_edit_view.test.tsx` 走 `renderWithProviders` 钉 zh-CN，两条继承徽章断言直接翻中（`经由访问组：group-a`、`经由工具集：Toolset A`）。全库复扫确认剩余同类命中都不是欠账：`mcp_tool_configuration.test.tsx` 的 `Flat List` 钉的是仍未接线的 `mcp_tool_configuration.tsx`（它自己那簇的活），`guardrail_selection_modal` 的 `Deselect All` 与 `page_utils.test.ts` 的 `No description available` 是别的组件。验证：`view_users` 目录 + `src/lib/i18n` 7 文件 111 例全绿、`user_edit_view.test.tsx` 42 例全绿、Type Errors 无报错；两个测试文件 eslint 路径 stash 前后均 19 警告 0 错误持平，prettier HEAD 与工作树双净。扫描器本片留 3 条登记不翻，files with hits 270 不动；目录零改动，覆盖率三项不动（912/689、10757、139）。下一簇按队列取 `src/app/(dashboard)/usage/_components/components/UsageAIChatPanel.tsx`（3 条）。

## 2026-10-18 第 234 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/ToolPolicies/ToolPoliciesTable.tsx`，工具策略表主体（早已接 `toolPolicies` 域，列定义表在第 139 簇收过）。扫描器 3 条命中之外，实际没接线的有 6 句：空态组件 `ToolPoliciesEmptyState` 的两标题两正文（它是纯函数式组件，直接在内部挂本域钩子）、`loadingMessage="Loading tools…"` 与 `searchPlaceholder="Search by Tool Name"`。新开 6 键：`tool_calls` 保持线值原样进句，"chat completion" 按 `playground.agentBuilder` 既有术语译"聊天补全"，"Loading tools…" 中文取主流的 `正在加载工具...`（ASCII 三点），搜索占位按列名 `colToolName` 对齐"按工具名称搜索"。测试同步：本文件 117/193/194/201 行与消费者 `ToolPoliciesPanel.test.tsx` 173 行翻中，正则 `/tool_calls to start auto-discovery/` 改 `/tool_calls.*自动发现/`。验证：`src/components/ToolPolicies` + `src/lib/i18n` 8 文件 72 例全绿、Type Errors 无报错；eslint 路径 stash 前后均 10 警告 0 错误持平；三个代码文件 HEAD 与工作树 prettier 双净（本簇无需 `--write`），目录插入区不在脏 hunk 内；tsc 锚定本片无错；`npm run build` 绿。扫描器本片清零，files with hits 271 → 270，目录叶子 10751 → 10757（+6），覆盖率 912/689 与同值 139 不动。下一簇按队列取 `src/app/(dashboard)/users/_components/view_users/user_info_view.tsx`（3 条）。

## 2026-10-18 第 233 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/components/email_events/email_event_settings.tsx`，邮件事件设置页（第 134 簇早已整片接 `emailEventSettings` 9 键）。扫描器 3 条命中全部判不翻登记：50/71/85 行 `Failed to fetch/update/reset email event settings:` 是 console.error 前缀（195/208/210/212/231 簇口径，失败的用户可见面走 `toast.fromError(error)`）。盲区反查本片零命中。115 行渲染的 `setting.event` 是后端事件线值，属第 134 簇"后端原始值不翻"，`descGeneric` 的 `{words}` 拆解传参也是该簇口径。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（仅按第六步单跑本片测试 `email_event_settings.test.tsx` 8 例全绿、Type Errors 无报错）。files with hits 271 不动，覆盖率三项不动（912/689、10751、139）。下一簇按队列取 `src/components/ToolPolicies/ToolPoliciesTable.tsx`（3 条）。

## 2026-10-18 第 232 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/mcp_server_management/MCPToolPermissions.tsx`，工具授权矩阵。文件早已接 `mcpToolPermissions` 域（30 键），扫描器 3 条只是冰山一角，实际没接线的有 17 句：三个继承徽章（`inheritedBadgeFor` 是模块级纯函数，按 218/229 簇译器入参口径在 `translators.ts` 新增 `McpToolPermissionsTranslator` 别名后把 `t` 注进函数）、取工具失败兜底句、服务器列表不完整提示、空访问组标题与其 `t.rich` 说明（内嵌 `<code>` 标签已在 RICH_TAGS 白名单）、工具集不可达提示、通配授权说明、歧义共享键句与工具集锁定句（后两类把连接串与工具名作 ICU 参数传入，单复数两键），外加风险分组/平铺列表/全选/取消全选/无描述五个按钮与视图切换词。后五个按 223 簇跨域同值不复用口径本域新键、中文对齐既有术语（风险分组/平铺列表随 `mcpServers.toolConfig`，全选随 `common.selectAll`，取消全选随 `policies.select.deselect`，无描述随主流的"无描述"）。实测 `Access group "{group}" has 0 servers` 的双引号不吞 `{group}`，intl-messageformat 照常插值，取值直接用原文。131 行 console.error 模板前缀按 195/208/210/212 口径不翻。测试侧本文件 41 例断言整体翻中，`Select All`/`Deselect All`/`Flat List`/徽章整句/歧义键句等改中文，`/^Via /` 相应改 `/^经由/`（中文徽章词后无空格）。验证：本片 41 例 + `src/lib/i18n` 守卫 16 例共 57 全绿、Type Errors 无报错，消费方 `add_agent_form` 两份 + `agent_info` + 同目录三份共 116 例全绿，ICU 守卫 34 侧（17 键 × 双侧）通过，eslint 路径 stash 前后均 6 警告 0 错误持平，两个 tsx 在 HEAD 干净、本簇 `--write`，两个目录插入区不在 prettier 脏 hunk 内，`npm run build` 绿。扫描器本片清零，files with hits 272 → 271，目录叶子 10734 → 10751（+17），覆盖率 912/689 不动（文件早已接线），同值 139 不动。下一簇按队列取 `src/components/email_events/email_event_settings.tsx`（3 条）。

## 2026-10-18 第 231 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/components/templates/key_info_view.tsx`，密钥详情视图（早已整片接 `virtualKeys`/`common`/`budgets` 多钩子，`info*` 键体系齐全）。扫描器 3 条命中全部判不翻登记：165/415 行 `Failed to fetch policy guardrails:`/`Error deleting the key:` 是 console.error 前缀（195/208/210/212 簇口径，删除失败的用户可见面走 `toast.fromError(error)`），77 行 `send only when changed` 出自 `PREMIUM_METADATA_FIELDS` 上方的代码注释散文（227 簇注释口径）。盲区反查同判不翻：364 行 `30d`/`1h`/`24h`/`7d` 是 `wordToCanonical` 的 budget_duration 线值映射表（217 簇线值口径），379 行 `blocked` 是 `teamAdminMemberKeyPayload` 返回的判别联合 kind 内部标记（展示文案早已 `t("info.teamAdminFieldsBlocked")`），478 行 `userRole !== "Internal Viewer"` 是后端角色线值比较（224/225 簇 `Admin` 同款），542/761/766/770 行 `unlimited` 撞库处实际代码早已 `commonT("unlimited")` 接线、撞的是键值本身。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（仅按第六步单跑本片测试 `key_info_view.test.tsx` + `key_info_view.budget_display.test.tsx` 2 文件 72 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动（912/689、10734、139）。下一簇按队列取 `src/components/mcp_server_management/MCPToolPermissions.tsx`（3 条）。

## 2026-10-18 第 230 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/components/ui/button-group.tsx`，按钮组基础组件（base-ui + cva）。扫描器 3 条命中全部是 `cva` 的 tailwind 选择器类名字符串（focus-visible/z 轴/圆角/边框变体表达式），是样式标识符不是文案，判不翻。盲区反查零撞库。本片无测试文件，代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平。files with hits 272 不动，覆盖率三项不动（912/689、10734、139）。下一簇按队列取 `src/components/templates/key_info_view.tsx`（3 条）。

## 2026-10-18 第 229 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/view_logs/TraceView/useAgentTraces.ts`，Logs 页调用链数据 hook（纯逻辑 `.ts`，接线前无翻译钩子，不计入 912 非测试 `.tsx` 口径）。扫描器 3 条命中逐条判定：26/27 行 401/403 展示文案经 `displayError` 造的 Error 会进 `traces.error`、由 `AgentTracesTable` 包在 `t("traceList.loadRunsError", {message})` 里上屏（集成测试钉着断言），用户可见，接线。`useAgentTraces` 内加 `useTranslations("logs")`，`displayError` 提为收 `LogsTranslator`（`@/lib/i18n/translators` 现成别名）双参函数，新开 `logs.traceList.sessionExpired`/`noTracesAccess` 两键（插在 `loadRunsError` 后）。100 行 `Agent tracing is not enabled` 兜底串判定不翻：`notEnabledDetail` 流向 `TracingSetupCard` 的 `detail` prop，该 prop 只做 `detail === null` 判空与 memo 比较、内容从不渲染（消费链 `useTracingSetup` -> `disabledDetail` -> `TracingSetupCard` 逐点核实），纯标记串，回退了先接 `t("traceList.agentTracingNotEnabled")` 的初稿并删掉该键。测试面：`AgentTracesSection.test.tsx` it.each 两例断言改钉 zh（`你的登录会话已失效，请退出后重新登录。`、`你的账号无权查看这些调用链。`），曾加过 fallback 可见性新用例、因上述判空结论撤回；TraceView 整包 11 文件 114 例全绿、`src/lib/i18n` 三守卫全绿、Type Errors 无报错。门禁：tsc 锚定零命中，eslint 两改动文件 0 条（本簇无新增警告账），prettier 双侧干净、目录新键区干净，ICU 守卫 2 键 4 侧通过，`next build` 通过，扫描器本文件剩 1 条即登记不翻的兜底标记串（files with hits 272 不动）。覆盖率：叶子 10732 涨到 10734，同值 139 不动，接入数不动（`.ts` 不在口径）。下一簇按队列取 `src/components/ui/button-group.tsx`（3 条）。

## 2026-10-18 第 228 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/hooks/useMcpOAuthFlow.tsx`，MCP OAuth 流程 hook（早已接 `mcpOauthFlow`）。扫描器 3 条命中（106 行 `Failed to clear OAuth storage` 为 console.warn、209/222 行 `Failed to prepare for OAuth redirect`/`Failed to start OAuth flow` 为 console.error）全是调试前缀（195/208/210/212 簇口径）。用户可见面早已接线：存储写入失败抛 `t("storageUnavailable")`，流程失败经 `extractErrorMessage` + `toast.error` 透出。盲区反查零撞库。代码零改动，工作树与 HEAD 逐字节一致，门禁由构造持平（仅按第六步单跑本片测试 6 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动。下一簇按队列取 `src/components/view_logs/TraceView/useAgentTraces.ts`（3 条）。

## 2026-10-18 第 227 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/lib/autorouter_presets.ts`，自动路由预设工具模块（纯逻辑 `.ts`，无翻译钩子，不计入 912 非测试 `.tsx` 口径）。扫描器 3 条命中全部是代码注释里的英文散文片段（59/303 行是 `preset's`/`caller's` 这类含撇号所有格被正则截出的注释文字，112 行是注释里举例的回溯正则串 `"a*a*a*..."`），注释不是用户可见面，判不翻（AGENTS.md 注释口径）。预设的 `label`/`description` 展示文本经 `hydratePresets` 来自后端响应，本文件零硬编码展示串，前端无从接线。盲区反查零撞库。代码零改动，工作树与 HEAD 逐字节一致，门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 120 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动（912/689、10732、139）。下一簇按队列取 `src/hooks/useMcpOAuthFlow.tsx`（3 条）。

## 2026-10-18 第 226 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`policies/_components/policy_test_panel.tsx`，策略模拟面板（早已整片接 `policies`，`sim.*` 键体系齐全）。扫描器 4 条命中全部判不翻登记：124/132/140 行 `Failed to load teams:/keys:/models:` 是 console.error 前缀（195/208/210/212 簇口径），251 行命中串是 lucide 风格 SVG 图标的 `d` 路径几何数据（本地化图标路径无从谈起）。盲区反查 1 条同判不翻：200 行 `name="model"` 是 react-hook-form 字段标识（label 早已 `t("sim.modelLabel")`）。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 9 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动（912/689、10732、139）。下一簇按队列取 `src/lib/autorouter_presets.ts`（3 条）。

## 2026-10-18 第 225 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/components/Teams.tsx`，团队页容器（1288 行，早已整片接 `teams` 与 `common.budgetDuration`，`list*` 键体系齐全，且标 `@deprecated`）。扫描器 4 条命中（312/326/413/562 行 `Failed to fetch guardrails:`/`Failed to fetch policies:`/`Error fetching user models:`/`Error creating the team:`）全是 console.error 前缀（195/208/210/212 簇口径），562 行同段的用户可见 toast 早已走 `t("listCreateError")`。盲区反查同判不翻：四处 `userRole === "Admin"` 是后端角色线值比较（2495 行 `value: "user"` 同款），三处 `code: "custom"` 是 zod 库枚举，两处 `context="team"` 是模型选择组件 prop 标识，`useQueryState("team")` 是 URL 查询参数键，630 行撞库的是 `t("keys")` 的键名字符串本身、标签早已接线。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 `Teams.test.tsx` 79 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动（912/689、10732、139）。下一簇按队列取 `policies/_components/policy_test_panel.tsx`（4 条）。

## 2026-10-18 第 224 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`src/components/team/TeamInfo.tsx`，团队详情页（2636 行，早已整片接 `teams` 与 `teams.estimatedOutputTokens` 双钩子，`info*` 键体系齐全）。扫描器 4 条命中全部判不翻登记：759/790 行 `Failed to fetch policies:`/`Failed to fetch policy guardrails:` 是 console.error 前缀（195/208/210/212 簇口径），824/868 行 `Assigning team admins is a premium feature` 是 `error?.raw?.detail...includes(...)` 的后端英文报错嗅探串，改译会让探测失效（该分支的用户可见结果早已走现成键 `infoAdminsEnterpriseOnly`）。盲区反查 8 条同判不翻：四处 `code: "custom"` 是 zod `addIssue` 的库枚举值，395 行 `model` 与相邻 `tpm` 是 zod `path` 字段定位串，1535 行 `context="team"` 是模型选择组件的 prop 标识，2495 行 `value: "user"` 是角色后端线值（label 早已 `t("infoRoleUser")`，221 簇 `"embedding"` 线值同款）。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 `TeamInfo.test.tsx` + `TeamInfo.integration.test.tsx` 2 文件 136 例全绿、Type Errors 无报错）。files with hits 272 不动，覆盖率三项不动（912/689、10732、139）。下一簇按队列取 `src/components/Teams.tsx`（4 条）。

## 2026-10-18 第 223 簇更新

继续串行推进，没有派子代理。这一簇是 `agents/_components/agent_card_discovery.tsx`，智能体卡片发现面板（早已接 `agents`，`discoverFromUrl`/`discoveryFailed`/`upstreamLoaded` 等键在用）。扫描器 4 条命中全是 `setError` 裸文案，用户可见，全部接线：`No access token available` 盲区反查精确撞同域现成键 `agents.noAccessToken` 直接复用（218/219 簇现成键归并同款），另两条条件错误与失败兜底新开 `fillConnectionFirst`/`enterBaseUrlFirst`/`discoverCardFailed`。盲区整片复查再捞出九处硬编码英文：按钮 `Discover`/`Re-discover` 撞的是 `policies.ai.discover`/`rediscover` 外域键，按只复用同域或 common 键的口径新开本域 `discover`/`reDiscover`（中文对齐 policies 同款译法"发现"/"重新发现"），两处 `TooltipContent`、两段说明、`{selected} / {total} selected` 计数徽标与 `not advertised upstream` 徽标一并接线为 `discoverTooltip`/`usingConnectionDetails`/`manualUrlHint`/`skillsSelected`/`capabilitiesTooltip`/`notAdvertisedUpstream`。`manualUrlHint` 含三个行内 `<code>` 路径插槽走 `t.rich`，标签名 `code` 本就在 `messagesParity` 的 RICH_TAGS 白名单、无需登记。共新开 12 键（插在 `capabilities` 后）。不翻登记四处：能力开关 `{key}` 是 `ALLOWED_CAPABILITY_KEYS` 后端线值（capitalize 展示）、`e?.message` 是上游报错透传、技能名/标签/provider 组织名/版本号是上游卡片数据、占位符 `https://upstream-agent.example.com` 是格式样例（两侧同值入目录 `phUpstreamUrl`，沿用同域 `phIcon`/`phDocs` 先例，中英同值 138 涨到 139）。`handleDiscover` 的 useCallback 依赖加入 `t`（协调 Redis 页 `[accessToken, t]` 先例）。测试面：`agent_card_discovery.test.tsx` 四处按钮与错误断言改钉 zh（`发现`、`重新发现`、`请先输入智能体的基础 URL`、`没有可用的访问令牌`），新增 `已选 2 / 2` 计数徽标断言；占位符因两侧同值未动，`/^streaming$/i` 因线值不翻未动。agents 整包 16 文件 150 例全绿、`src/lib/i18n` 三守卫全绿、Type Errors 无报错。门禁：tsc 锚定零命中，eslint stash 路径级双侧对拉持平（3 条 warning 均为既有账：complexity 21 与两处 `no-explicit-any`，仅行号漂移），prettier 组件 HEAD 即脏（`nameShownToClients` 标签的可折叠段系上游既有排法，工作树与之唯一差异即该处）、本簇改动区干净未越界重排，测试文件双侧干净，目录双侧各 23 处既有缩进脏块不在本簇插入区、未顺手重排，ICU 守卫 12 键 24 侧通过（`t.rich` 需同时传 `code` 恒等渲染函数），`next build` 通过，扫描器本文件归零（files with hits 273 降到 272）。覆盖率：叶子 10720 涨到 10732，接入数不动（本文件早已接入）。下一簇按队列取 `src/components/team/TeamInfo.tsx`（4 条）。

## 2026-10-18 第 222 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`api-reference/_components/APIReferenceView.tsx`，OpenAI 兼容代理 API 参考页（早已接 `apiReference`，`pageTitle`/`blurb`/DocLink 三键全覆盖）。扫描器 4 条命中全部落在三个 Python 示例代码模板串内部的请求内容里（`"content": "this is a test request, write a short poem"`、`query("What did the author do growing up?")`、`SystemMessage`/`HumanMessage` 的 content），与 216/217 簇 `CODE_TEMPLATES` 口径同款：示例代码是用户复制即跑的内容，本地化会教出带中文的 API 示例，全判不翻。盲区复查 1 条同判不翻：64 行 `"role": "user"` 是 OpenAI 消息线值精确撞库（`costOptimization.shadowEval.typeUser` 等值 strip 后同词）。另登记三处一贯口径：三个 tab 标签 `OpenAI Python SDK`/`LlamaIndex`/`Langchain Py` 是产品与框架专名（测试也钉着这三个名字断言 tab 顺序与选中态）、`<your_proxy_base_url>`/`<your-master-key>` 是占位符样例、示例代码里的 `# model to send to the proxy` 等行尾注释随代码整体不翻。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 8 例全绿、Type Errors 无报错）。files with hits 273 不动，覆盖率三项不动（912/689、10720、138）。下一簇按队列取 `agents/_components/agent_card_discovery.tsx`（4 条）。

## 2026-10-18 第 221 簇更新

继续串行推进，没有派子代理。这一簇是 `caching/_components/cache_settings/index.tsx`，Redis 缓存设置页（早已接 `caching` 与 `cacheSettings` 双命名空间，`settingsTitle`/`sections.*` 等在用）。扫描器 4 条命中：两条 `Failed to load/save cache settings:` 是 console.error 前缀（195/208/210/212 簇口径，登记不翻），两条 `toast.fromError` 用户可见，接线。盲区复查按上游新功能口径整片扫：按钮四段 JSX 文本 `Testing...`/`Test Connection`/`Saving...`/`Save Changes` 竟是硬编码英文，而 `caching.testConnection`/`testing`/`saveChanges` 与 `common.saving` 现成键早已被姊妹页 `coordination_redis_settings/index.tsx` 消费，本簇直接复用对齐（218/219 簇现成键归并同款）；`Unknown error` 兜底复用现成 `caching.unknownError`；五条 toast 新开嵌套 `caching.toast.loadFailed/testSuccess/testFailed{reason}/saveSuccess/updateFailed`（插在 `unknownError` 与 `coordination` 之间，镜像 `coordination.toast.*` 结构，`testFailed` 与协调页同句式）。`loadCacheSettings` 的 useCallback 依赖加入 `t`（协调页 `[accessToken, t]` 先例，无重启循环账）。console 前缀之外另登记两条不翻：L75 `"embedding"` 是 `model.mode` 后端线值，测试面：`index.integration.test.tsx` 的按钮名两处（`Test Connection` 与 `/save changes/i`）与 `index.test.tsx` 五处 `/save changes/i` 正则改钉 zh（`测试连接`、`保存更改`）；caching 整包 11 文件 108 例全绿、`src/lib/i18n` 三守卫全绿、Type Errors 无报错。门禁：tsc 锚定与 HEAD 对拉同为 2 条（`RedisTypeSelector.test.tsx` 既有账，不在本簇文件），eslint stash 双侧对拉持平（两测试文件各 1 条 `no-large-inline-object-arg` 既有账，本簇组件改动区 0 警告），prettier 三文件 HEAD 干净、接线后被 `toast.fromError` 长行触发折叠已 `--write` 复净，ICU 守卫 5 键 10 侧通过，`next build` 通过，扫描器本文件剩 2 条均为登记不翻的 console 前缀（files with hits 273 不动）。覆盖率：叶子 10715 涨到 10720，同值 138 不动（5 新键两侧全不同值），接入数不动（本文件早已接入）。下一簇按队列取 `api-reference/_components/APIReferenceView.tsx`（4 条）。

## 2026-10-18 第 220 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-optimization/_components/ShadowEvalSection.tsx`，影子评估区（上游新功能整片，早只用着 `shadowEval.title`/`loading` 等少数键）。扫描器 4 条命中只是冰山一角，按"上游新功能文件做全量盲区复查"口径把整片界面文案一次接线：区块说明、作业卡标题行与元信息、状态徽章、分层表头、成本对比块、裁决分布条、每密钥目标表、空态文案、历史评估折叠等，新插 60 键（插在 `duration30d` 后）。两条 headline 键与模型范围键走 `t.rich` 等宽插槽 `<m>`/`<r>`/`<b>`/`<tg>`（LoginPage `ssoRedirectNotice` 与 vectorStores 语义标签先例同款），`b` 本就在 `messagesParity` 的 RICH_TAGS 白名单，`m`/`r`/`tg` 三个标签名带注释登记进白名单。状态、目标类型与另一侧臂标签都用显式键名联合（`StatusLabelKey`/`TargetTypeLabelKey`/`otherArmLabelKey`）加原值兜底，不碰 155-156 簇模板字面量教训；reverse 分支 `baseline_model` 可空，传值处 `?? ""` 收口类型。`t.rich` 的 7 属性内联字面量触发 `local/no-large-inline-object-arg` 新警告，提名为 `headlineValues` 构造函数后组件 0 警告。纯函数 `shadowedTargetLabel` 返回的是数据标识（别名/掩码名/截断 hash）不接线。测试面：`ShadowEvalSection.test.tsx` 约四十处英文断言改钉 zh（headline textContent 全文、表头、裁决条正则、预算/轮次/成本行、停止按钮、历史评估折叠等），StartForm 侧断言本就是 zh 未动；tsc 里该片测试的 9 条红灯（fixture 缺 `by_router` 字段 2 条、`getByRole` option 重载 7 条）经 stash 对拉与 HEAD 逐条一致，系上游既有账不计本簇。门禁：cost-optimization 整包加 `src/lib/i18n` 三守卫 20 文件 228 例全绿（本片 42 例）、Type Errors 无报错；tsc 锚定组件与守卫零命中；eslint stash 双侧对拉持平（守卫 2 条既有账）；prettier 组件 HEAD 即脏，本簇改动区内 3 处折叠/展开差异已按 prettier 输出落净，测试与守卫文件 HEAD 干净、当前仍干净，目录两侧各自 11 处既有 4 空格缩进脏块不在本簇插入区、未顺手重排；ICU 守卫 60 键 120 侧通过（`t.rich` 标签名需同时传恒等函数值），`next build` 通过，扫描器本文件归零（files with hits 274 降到 273）。覆盖率：叶子 10655 涨到 10715，同值 138 不动（60 新键两侧全不同值），接入数不动（本文件早已接入）。下一簇按队列取 `caching/_components/cache_settings/index.tsx`（4 条）。

## 2026-10-18 第 219 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-tracking/_components/add_provider_form.tsx`，折扣添加表单（218 簇姊妹片，早已接 `costTracking`，`selectProvider`/`noProviders` 占位符键在用）。扫描器 2 条命中全是 `labelWithHint` 的 tooltip 提示语，用户可见，全部接线；顺带把同一批两个裸标签与底部按钮一起键名化：`Provider` 复用现成 `common.provider`（218 簇同款口径），按钮 `Add Provider Discount` 复用同域现成 `addProviderDiscount`（该键早已被折扣弹窗标题 `cost_tracking_settings.tsx` 消费，本簇把表单底部按钮也对齐同一键，218 簇 `addProviderMargin` 同款归并），其余新开 3 键（`discountProviderHint`/`discountPercentageLabel`/`discountPercentageHint`，插在 `fixedMarginAmountHint` 后）。数字占位符 `5` 与 `%` 前缀是纯格式样例与币种符号，不翻（218 簇口径）。`provider_discount_table.test.tsx` 里 columnheader "Discount Percentage" 断言出自设置页折扣表格的裸表头渲染，那是另一片、不在本轮队列，未触碰。测试面：`add_provider_form.test.tsx` 六处断言改钉 zh（`添加供应商折扣`、`折扣百分比`），`add_provider_form.integration.test.tsx` 一处、`cost_tracking_settings.integration.test.tsx` 三处相应改钉 zh；cost-tracking 与 `src/lib/i18n` 守卫 20 文件 222 例全绿、Type Errors 无报错。门禁：tsc 锚定零命中，eslint stash 双侧对拉持平（`cost_tracking_settings.integration.test.tsx` 的 `no-node-access` 6 条为既有账），prettier 本文件 HEAD 干净、接线后短行未触发重排、当前仍干净，ICU 守卫 3 键 6 侧通过，`next build` 通过，扫描器本文件归零（files with hits 275 降到 274）。覆盖率：叶子 10652 涨到 10655，同值 138 不动，接入数不动（本文件早已接入）。下一簇按队列取 `cost-optimization/_components/ShadowEvalSection.tsx`（4 条）。

## 2026-10-18 第 218 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-tracking/_components/add_margin_form.tsx`，供应商加成添加表单（早已接 `costTracking` 与 `CostTrackingTranslator`，`globalAll` 等键在用）。扫描器 4 条命中全是 `labelWithHint` 的 tooltip 提示语，用户可见，全部接线；顺带把同一批裸标签与两个单选 JSX 文本一起键名化：`Provider` 复用现成 `common.provider`（盲区反查精确撞库，19 个同值键里挑 common 域，210 簇 `common.cancel` 复用先例同款），按钮 `Add Provider Margin` 复用同域现成 `addProviderMargin`（该键早已被加成弹窗标题 `cost_tracking_settings.tsx` 消费，本簇把表单底部按钮也对齐同一键），其余新开 9 键（`marginProviderHint`/`marginTypeLabel`/`marginTypeHint`/`percentageBased`/`fixedAmount`/`marginPercentageLabel`/`marginPercentageHint`/`fixedMarginAmountLabel`/`fixedMarginAmountHint`，插在 `fixedAmountNonNegative` 后）。数字占位符 `10`/`0.001` 与 `%`/`$` 前缀是纯格式样例与币种符号，不翻。姊妹片 `add_provider_form.tsx` 扫描器另有 2 条同款裸提示（`Provider` 标签与 "e.g., 5 for 5% discount"），按 211 簇"归并留给姊妹自己的簇"口径本轮不动，登记为下一簇。`marginProviderHint` 英文值里 `'Global'` 的直引号沿用了预置键 `selectProviderOrGlobal` 的同款写法，ICU 复跑确认渲染一致。测试面：`add_margin_form.test.tsx` 九处 `/add provider margin/i` 与两处 radio 文本断言改钉 zh（`添加供应商加成`、`按百分比`、`固定金额`），`cost_tracking_settings.integration.test.tsx` 三处 label/按钮断言改钉 zh；cost-tracking 整包 17 文件 206 例全绿、`src/lib/i18n` 三守卫全绿、Type Errors 无报错。门禁：tsc 锚定零命中，eslint 双侧 stash 对拉持平（`no-long-condition-chain` 1 条与 `no-node-access` 6 条均为既有账），prettier 本文件 HEAD 干净、接线后被 `labelWithHint` 短行触发折叠、已跑 `prettier --write` 复净，ICU 守卫 9 键 18 侧通过，`next build` 通过，扫描器本文件归零（files with hits 276 降到 275）。覆盖率：叶子 10643 涨到 10652，同值 138 不动，接入数不动（本文件早已接入）。下一簇按队列取 `cost-tracking/_components/add_provider_form.tsx`（2 条）。

## 2026-10-18 第 217 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`guardrails/_components/custom_code/CustomCodeModal.tsx`，自定义代码护栏编辑弹窗（216 簇消费链上的姊妹片，早已整片接 `guardrails`，`custom.*` 与 `form.*` 全覆盖）。扫描器 4 条命中全部判不翻登记：`SQL code not allowed`（70 行）与 `Bearer YOUR_API_KEY`（97 行）都在 `CODE_TEMPLATES` 的 Python 示例代码串里，模板整体是用户在编辑器里接着改的代码内容（含 41-43 行的示例注释、`block(...)` 参数、请求头样例），本地化代码示例本身会教出带中文的护栏模板，与模板注释一贯不翻。两条 `Failed to save guardrail:`/`Failed to test custom code:` 是 console.error 前缀（第 195/208/210/212 簇口径）。盲区复查 4 条同判不翻：79/96 行的 `required`/`text` 又是示例代码里的字典字面量精确撞库（`virtualKeys.createForm.requiredHelp` 等目录值 strip 后同词），179 行 `logging_only` 是 `MODE_OPTIONS` 的后端线值（label 早已走 `custom.modeLogging`），627 行 `model` 是字段名指南里加粗展示的后端输入键。另登记三处一贯口径：指南网格里 `(pre_call)` 等括号注是线模式标识符、测试输入 `placeholder='{"texts": [...]}'` 是纯 JSON 格式样例（146 簇两侧同值口径）、`-&gt;` 是排版箭头字形。代码零改动，工作树与 HEAD 逐字节一致，tsc/eslint/prettier/build 门禁由构造持平（复跑无信息量，仅按第六步单跑本片测试 11 例全绿、Type Errors 无报错）。files with hits 276 不动，覆盖率三项不动（912/689、10643、138）。下一簇按队列取 `cost-tracking/_components/add_margin_form.tsx`（4 条）。

## 2026-10-18 第 216 簇更新

继续串行推进，没有派子代理。这一簇是 `guardrails/_components/guardrail_info_helpers.tsx`，护栏提供商常量与格式化 helpers 模块。扫描器 4 条命中（`LiteLLM LLM as a Judge` ×2、`llm_as_a_judge` ×2）与盲区复查浮出的 3 条（`LiteLLM Content Filter` ×2、`Decision Model`）全部判定不翻登记：前者是 `populateGuardrailProviders` 写入的提供商显示名与 `guardrail_provider_map` 的后端线值，会被 API 返回的 `ui_friendly_name` 覆盖，属显示名兼匹配字面量；后两者是 `guardrailLogoMap` 的查表键与 `shouldRender*ConfigSettings` 系函数的后端值比较对象，本地化会断查表与判定。真正的接线点是盲区脚本看不到的模板尾巴：`formatGuardrailMode` 对 tag-based 模式对象拼的 `` ` (tag-based)` `` 是纯展示文案（拼接式、非精确整值，扫描器与反向脚本都漏），六个消费点（`guardrailTableColumns`、`GuardrailsPanel` 删除弹窗、`guardrail_info` 两处、`GuardrailTestPlayground`、policies 侧 `guardrail_selection_modal`）全部把它渲进界面。跨 guardrails 与 policies 两个域，按口径落 `common.tagBased`（en "tag-based"、zh "按标签"，括号留在模板里两侧共用，与目录既有 `自动路由器 (Beta)` 的半角括号先例一致），helpers 改注入现成共享别名 `CommonTranslator`，消费点各补一行 `useTranslations("common")`。`guardrail_table.tsx` 的列依赖对象因加 `commonT` 到 4 属性触发 `local/no-large-inline-object-arg`，照 `MemoryTable.tsx` 先例抽 `columnDeps` 具名中间变量后归静。测试面：helpers 单测 `formatGuardrailMode` 块改用 `((key) => key === "tagBased" ? "tag-based" : key) as unknown as CommonTranslator` 回显翻译器（沿用 `teamAdminEditAccess.test.ts` 的 echo 形态），英文断言零改写；组件测试走真实 zh 目录，`guardrail_table.test.tsx` 与 `guardrail_info.test.tsx` 各一条 `(tag-based)` 断言改钉 `(按标签)`。门禁：guardrails 与 policies 两目录 57 文件 527 例全绿、Type Errors 无报错，`src/lib/i18n` 三守卫套件加三个消费方测试文件另跑 6 文件 37 例全绿，tsc 锚定 1 条与本簇无关（HEAD 复测同位既有 `CustomGuardrail` 断言，行号仅因导入行偏移），eslint 经 stash 双侧对拉逐规则逐文件完全持平（首轮 `.tmp` 副本少报 typed 规则与 `max-lines` 系未入 tsconfig 的路径效应，改 stash 复测排除；`guardrail_info.tsx` 的 `max-lines` 806>800 为 HEAD 既有账），prettier 三文件 HEAD 即脏不改写、新写行与 prettier 输出逐字一致，ICU 守卫 1 键 2 侧通过，`next build` 通过，扫描器本文件剩 4 条登记不翻（files with hits 276 不动）。覆盖率：叶子 10642 涨到 10643，同值 138 不动，接入数不动（消费文件早已接入）。下一簇按队列取 `guardrails/_components/custom_code/CustomCodeModal.tsx`（4 条）。

## 2026-10-18 第 215 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/mcp_server_edit.tsx`，MCP 服务器编辑表单（1336 行，早已接 `mcpServers` 93 处）。扫描器 4 条命中两判两接：`Failed to persist MCP edit state`（console.warn）与 `Failed to restore MCP edit state`（console.error）按第 195/208/210/212 簇口径判不翻登记，值得一提的是目录里 `mcpServers.edit.failedToPersistState`/`failedToRestoreState` 两键早被机翻预置好却无人消费，正好印证 console 前缀不入门禁口径；两处 `Failed to load tools` 是 `setToolsError` 的用户可见兜底（渲进工具页签 `externalError`），复用现成键 `edit.failedToLoadTools` 零新开。盲区复查是本簇主战场，脚本改成"字面量精确值命中目录即报"后揪出四处：`label="Alias"`/`label="Description"` 复用同域 `create.alias`/`create.description`（新建表单同款字段标签先例），`placeholder="e.g. 10"` 新开 `create.maxConcurrentPlaceholder`（中英 "e.g. 10"/"例如 10"，沿用 `commandPlaceholder`"例如 npx" 与 `teams.infoPlaceholderEg100` 的格式示例也翻口径），另两处 `placeholder="https://..."` 是纯 URL 样例照第 146 簇口径两侧同值不翻。代码注释与 `rel="noopener noreferrer"`、JSON 样例 `{\n "KEY": "value"\n}` 均不翻。同片浮出候选留给后续：`CreateMCPServer.tsx` 第 825 行同一处 `placeholder="e.g. 10"` 仍是裸值。测试面：`mcp_server_edit.test.tsx` 三处 `getByPlaceholderText("e.g. 10")` 改钉 "例如 10"，本文件 81 例加姊妹 `mcp_server_view.test.tsx` 20 例加 `messagesParity`/`locales`/`missingKeys` 16 例全绿、Type Errors 无报错。门禁：tsc 锚定 11 条与本簇无关（HEAD 复测同为 11 条，全是 `getByPlaceholderText` 传正则的既有账），eslint 非 testing-library 规则计数与 HEAD 副本逐规则持平（any 10、内联大对象 6、复杂度 3、exhaustive-deps 2、incompatible-library 1），real 路径多出的 10 条 no-node-access 是双重上报的路径效应，prettier 两文件 HEAD 即脏不改写，ICU 守卫 4 键 8 侧通过，`next build` 通过，扫描器本文件剩 2 条登记不翻（files with hits 276 不动）。覆盖率接入数不动（本文件早已接入，叶子 10641 涨到 10642）。下一簇按队列取 `guardrails/_components/guardrail_info_helpers.tsx`（4 条）。

## 2026-10-18 第 214 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/mcp_servers.tsx`，MCP 服务器主页（早已整片接 `mcpServers`）。扫描器 4 条命中全部判不翻登记：`N user fields missing` 两处（235、825 行）都在代码注释里讲卡片页脚文案，注释面向开发者不入门禁口径（各簇一贯）；`Failed to restore MCP edit view state` 与 `Error deleting the mcp server:` 是 console.error 前缀（第 195/208/210/212 簇口径）。盲区复查揪出一处：团队筛选下拉的 `teamSelectItems` 记忆化里 `personal: "Personal"` 是裸字面量，扫描器因为 `mcpServers.personal` 精确同值（"Personal"/个人）早就存在而看不见，同一段 `SelectContent` 早已用 `t("personal")`，两处不一致会让选中后的 trigger 回显走 items 表显示英文；改成 `personal: t("personal")`，`t` 已在依赖数组里，零新开键。测试面：本文件 30 例 HEAD 即全绿、无断言改写（`mcp-servers` 目录测试不涉及 `Personal` 文案）。门禁：tsc 锚定零命中，eslint 零告警，prettier 本文件 HEAD 干净当前即干净，无目录改动故 ICU 守卫与同值复测跳过（叶子仍 10641、同值 138），`next build` 通过，files with hits 276 不动（登记不翻不入清零口径）。覆盖率接入数不动（本文件早已接入）。下一簇按队列取 `mcp-servers/_components/mcp_server_edit.tsx`（4 条）。

## 2026-10-18 第 213 簇更新

继续串行推进，没有派子代理。这一簇是 `models-and-endpoints/components/AccessGroupBudgetModal.tsx`，模型访问组共享预算弹窗。扫描器 4 条命中（`requireAtLeastOne` 校验消息加三条 tooltip 说明）只是冰山一角：整个片此前完全没接线，标题、说明段、三个字段标签、留空提示、取消/保存按钮全是裸字面量，扫描器漏掉是因为它们精确值早被批次 15 的机翻预置进目录了（`models.accessGroupBudgetModal` 15 个键零消费方，本簇是首个）。盲区复查把这 12 处一次性全部接上，只新开 1 键。校验模式按第 209/211 簇工厂化：`budgetSchema` 改 `(t) => z.object(...).refine(...)`，翻译器类型走本文件局部 `BudgetModalTranslator = ReturnType<typeof useTranslations<"models.accessGroupBudgetModal">>`（`translators.ts` 只有父域 `ModelsTranslator`，子命名空间另起别名沿用 `passThroughTableTranslator` 形态），消费处 `useZodForm(budgetSchema(t), ...)` 每渲染新建无环。说明段目录值带字面 `<code>all-proxy-models</code>`，按 `WORKFLOW.md` 富文本口径用 `t.rich("description", { code: (chunks) => <code>{chunks}</code> })` 渲染，标签名落在白名单内，`all-proxy-models` 与撇号 `group's` 由真实 parser 复跑确认不炸。标题是唯一新开键：预置的 `editBudget`/`setBudget`/`budgetFor` 三键组合起来在任一侧都会拼出重复词（en "Edit budget budget for X"、zh "编辑 为 X 设置预算"），故加 `title` 用 `{action}` 参数穿两个既有动词键（en `{action} for "{group}"`、zh `为 "{group}" {action}`），两侧顶层参数名一致过 `messagesParity`，预置的 `budgetFor` 留作未消费不删（叶子 10640 涨到 10641）。测试面：`AccessGroupBudgetsPanel.integration.test.tsx` 五条断言改钉 zh 目录值（`/最大预算/`、`保存预算`、`/请至少设置最大预算/`），菜单项两侧正则早已兼容。门禁：本片 9 例全绿、Type Errors 无报错，`models-and-endpoints` 整包 196 例 1 失败为 HEAD 既有红灯（`AddModelPanel` PTU Effective From 一例，`git stash` 复测 HEAD 同样失败，与本簇无关），tsc 锚定零命中，eslint 两文件零告警，prettier 两代码文件 HEAD 干净当前即干净（两份目录 HEAD 即脏不改写），ICU 守卫 7 键 14 侧通过，`next build` 通过（日志里的 `ENVIRONMENT_FALLBACK` 是静态生成的既有噪声，exit 0），扫描器本文件归零（files with hits 277 降到 276）。覆盖率接入数不动（本文件早已接入）。下一簇按队列取 `mcp-servers/_components/mcp_servers.tsx`（4 条）。

## 2026-10-18 第 212 簇更新

继续串行推进，没有派子代理。这一簇是纯判定簇：`policies/_components/policy_test_panel.tsx`，策略模拟器面板。扫描器 4 条命中全判不翻登记：`Failed to load teams:`/`Failed to load keys:`/`Failed to load models:` 与 `Error resolving policies:` 是 console.error 前缀（第 195/208/210 簇口径，开发者面向、不入目录），SVG `path d` 矢量 `d` 属性是 wire 值。盲区复查发现本片用户可见文案早在上一轮就整片接好了（`sim.*` 15 个键全覆盖，含 `sim.intro`/`sim.emptyDesc` 带 `{simulate}` 参数的两处），本轮无改动，测试面 9 例 HEAD 即全绿、无断言改写。门禁：tsc 锚定零命中，eslint 4 warning 与 HEAD 逐规则持平（3 条 `no-explicit-any` 加 1 条 `local/no-long-condition-chain`，均为本文件既有账），prettier 不改写未动文件，`next build` 通过，files with hits 277 不动（登记不翻不入清零口径）。覆盖率不动。下一簇按队列取 `models-and-endpoints/components/AccessGroupBudgetModal.tsx`（4 条）。

## 2026-10-18 第 211 簇更新

继续串行推进，没有派子代理。这一簇是 `app/(dashboard)/users/_components/default-user-settings/schema.ts`，默认用户设置表单的 zod 校验模式（纯 `.ts`，模块级常量，与第 209 簇的 org schema 同构）。扫描器 4 条命中全是校验消息，用户可见（走 `useZodForm`/`zodResolver` 渲进字段 `role="alert"`），全部接线。教条第六次落地：整个模式改 `(t) => z.object(...)` 工厂，翻译器类型这次直接用 `@/lib/i18n/translators` 的现成共享别名 `UsersTranslator`（第 210 簇 `CloudZeroTranslator` 同款口径，比 209 簇的局部 `ReturnType<typeof useTranslations<"ns">>` 更省一层定义）；模块级 `amountOrEmpty` 改 `(t) =>` 工厂，`defaultTeamRowSchema` 同步改工厂，`defaultUserSettingsSchema` 的 `superRefine` 去重规则因消息在 `.superRefine()` 链的内联对象里、被 `local/no-large-inline-object-arg` 判罚，按 209 簇办法抽 `defaultUserSettingsShape(t)` 帮助函数后 eslint 归静。消费方 `DefaultUserSettingsForm.tsx` 把现成的 `t = useTranslations("users")` 穿进 `useZodForm(defaultUserSettingsSchema(t), ...)`，同目录 `mapper.ts` 只有类型导入零涟漪；导出类型 `DefaultUserSettingsFormValues`/`DefaultUserSettingsSubmitValues` 改 `z.input`/`z.output<ReturnType<typeof defaultUserSettingsSchema>>` 保持形状不变。消息口径：`max_budget`/`max_budget_in_team` 的 "Must be a non-negative number" 与 209 簇 `organizations.orgForm.nonNegativeNumber` 精确同值但跨命名空间，本簇按 `users` 域新开 `users.nonNegativeNumber`（跨域复用留给同失效链路的姊妹片，见 210 簇 cloudZero 归并口径是"同域"才做），"This team is already listed" 新开 `users.teamAlreadyListed`；`team_id` 空值两条复用现成键 `users.infoSelectTeam`（该键原本是模型选择器的下拉占位符文案，此处作为必填错误提示，同域同义、零新开键）。叶子 10638 涨到 10640（新增 2 键），中英同值双侧复测仍 138。测试面：`schema.test.ts` 是纯模式单测、不经组件渲染，改用 `@tests/i18nStub` 的 `enMessagesFor("users")` 造翻译器并 `as unknown as UsersTranslator` 传入工厂，五条英文断言零改写（这是 schema 类文件的标准迁移法，不必把断言换成 zh）；组件侧 `DefaultUserSettingsForm.test.tsx` 用 `vi.mock("next-intl")` 的白名单表（命中返回表值、否则回裸键名），新接线的三条键必须补进 `mockTranslations` 且用 zh 值，否则断言改钉 zh 前会先在 DOM 里看到裸键名而假失败，两条 alert 断言相应改钉 "选择团队"/"该团队已在列表中"（排查时用临时 `writeFileSync` dump DOM 再正则取 `data-slot="field-error"` 文本，比截断的 testing-library 输出可读，用完即删）。门禁：本目录 29 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 四个改动代码文件零告警，prettier `schema.ts` HEAD 干净当前即干净（两份目录 HEAD 即脏不改写），ICU 守卫 3 键 6 侧通过，`next build` 通过，扫描器本文件归零（files with hits 278 降到 277，队尾浮出 `cost-optimization/_components/ShadowEvalSection.tsx` 4 条）。覆盖率接入数不动（本文件是 `.ts`）。下一簇按队列取 `policies/_components/policy_test_panel.tsx`（4 条）。

## 2026-10-18 第 210 簇更新

继续串行推进，没有派子代理。这一簇是 `components/cloudzero_export_modal.tsx`，用量数据导出弹窗（页面骨架早前已接 `cloudZeroExport`）。扫描器 4 条命中两接两判不翻登记：`Error exporting to CloudZero:` 是 console.error 前缀（第 195/208 簇口径），SVG `path d` 属性是矢量绘制的 wire 值。盲区复查四处全部接线，口径整片复用同域姊妹组件 `CloudZeroCreateModal`/`CloudZeroUpdateModal` 的先例：校验模式从模块级常量改 `buildExportSchema(t)` 工厂，翻译器类型用 `@/lib/i18n/translators` 的现成共享别名 `CloudZeroTranslator`，两条消息直接挪用 `cloudZero.apiKeyRequired`/`connectionIdRequired` 零新开键，其中 "Please enter **the** CloudZero connection ID" 归并进姊妹的 "your" 版，三个 CloudZero 弹窗校验文案就此一致（与第 205 簇 `stateLost` 同失效成因归并口径）。已有配置告警的裸 JSX 标签行 "API Key:"/"Connection ID:" 复用 `cloudZero.apiKeyRedacted`/`connectionIdLabel`，密钥行英文显示从 "API Key:" 升级为 "API Key (Redacted):"，与集成详情页脱敏行对齐；Cancel 按钮接 `common.cancel`（姊妹的 `commonT` 用法）。全簇新开仅一键：`cloudZeroExport.csvExportDescription`（CSV 说明整句，插在 `csvExport` 键后，叶子 10637 涨到 10638），zh 值为"将用量数据导出为 CSV 文件，便于在电子表格应用中分析"。测试面：套件钉 zh-CN，integration 三条英文校验断言改钉 zh 目录值，integration 8 例加 usage 消费侧 `UsagePageView` 40 例加 parity/locales 15 例全绿、Type Errors 无报错。覆盖率接入数不动（本文件早已接入）。门禁：tsc 锚定零命中，eslint 本文件 2 warning 与 HEAD 逐规则持平（HEAD 副本多报的 4 条 raw-fetch error 系临时目录路径效应，本文件在白名单），prettier 两代码文件 HEAD 与当前均干净、两份目录 HEAD 即脏不改写，ICU 守卫 5 键 10 侧通过，`next build` 通过，扫描器本文件剩 2 条登记不翻（不入清零口径，files with hits 278 不动，队尾浮出 `cost-tracking/_components/add_margin_form.tsx` 4 条）。下一簇按队列取 `users/_components/default-user-settings/schema.ts`（4 条，本簇已备好同款校验消息的复用口径）。

## 2026-10-18 第 209 簇更新

继续串行推进，没有派子代理。这一簇是 `components/organization/org-settings/schema.ts`，组织设置表单与新建组织弹窗共用的 zod 校验模式（纯 `.ts`，模块级常量）。扫描器 4 条命中全是校验消息，用户可见（走 `useZodForm`/`zodResolver` 渲进字段 `role="alert"`），全部接线。纯模块翻译器注入教条第五次落地，且直接命中同仓现成先例 `edit_auto_router/editAutoRouterFormSchema.ts`：整个模式改 `(t) => z.object(...)` 工厂，`OrgFormTranslator = ReturnType<typeof useTranslations<"organizations.orgForm">>`（`import type` 仅取类型），模块级校验器 `wholeNumberOrEmpty`/`amountOrEmpty` 同步改 `(t) =>` 工厂。两个消费方 `OrgSettingsForm.tsx` 与 `OrgCreateDialog.tsx` 各自把现成的 `t = useTranslations("organizations.orgForm")` 穿进 `useZodForm(orgSettingsSchema(t), ...)`，`useZodForm` 只是把模式实例交给 `zodResolver` 供 react-hook-form 每渲染消费，工厂每渲染新建无环、不必上 `useMemo`（先例弹窗上 memo 是因为它按模式条件二选一）。类型导出 `OrgSettingsFormValues` 改 `z.output<ReturnType<typeof orgSettingsSchema>>` 保持形状不变，两份 mapper 只有类型导入零涟漪。四条消息在 `organizations.orgForm` 块尾新开 4 键（`nameRequired`/`nonNegativeWholeNumber`/`nonNegativeNumber`/`metadataInvalidJson`，叶子 10633 涨到 10637），英文原句逐字进目录；队列次一位的姊妹片 `default-user-settings/schema.ts` 有一条精确同值的 "Must be a non-negative number"，下一簇可直接照本簇键名形态对齐。测试面：套件 `DEFAULT_TEST_LOCALE` 钉 zh-CN，`OrgSettingsForm.test.tsx` 一条与 `OrgCreateDialog.test.tsx` 两条 alert 断言（缺组织名、元数据非法 JSON）改钉 zh 目录值，等价于工厂本地化渲染的端到端回归。门禁：org 四文件 36 例加 `messagesParity`/`locales` 15 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 五文件零告警（新写 schema 无历史账），prettier 五文件 HEAD 干净当前即干净，ICU 守卫 4 键 8 侧通过，`next build` 通过，扫描器本文件归零（files with hits 279 降到 278，队尾浮出 `guardrails/_components/custom_code/CustomCodeModal.tsx` 4 条）。覆盖率接入数不动（本文件是 `.ts`）。下一簇按队列取 `components/cloudzero_export_modal.tsx`（4 条）。

## 2026-10-18 第 208 簇更新

继续串行推进，没有派子代理。这一簇是 `components/team/TeamInfo.tsx`，团队详情页（2600 行，早前已大面积接入 `teams` 命名空间）。扫描器 4 条命中判定不翻并登记：`Failed to fetch policies:`/`Failed to fetch policy guardrails:` 是 console.error 前缀（同第 195/198 簇口径），两处 `Assigning team admins is a premium feature` 更关键，它们不是展示文案而是拿 `error?.raw?.detail...includes(...)` 与后端错误报文做检测比对的线值字面量，本地化会直接破坏 premium 判定（分支命中后展示的 `infoAdminsEnterpriseOnly` 早已键名化）。真正的工作量在盲区：扫描器只盯字符串字面量，漏掉十九处裸 JSX 文本节点，逐处键名化接线。全部零新开键，十九处全部命中 `teams` 里早前预置、此前零或少消费者的既有键，两种键形态沿用文件内已有用法：纯标签（`infoTeamMemberSettings`/`infoBudgetResetPeriod`/`infoAllowedModels` 等六处，配 `{" "}` 保留与 Info 图标的间距）和带 `{value}`/`{count}`/`{example}` 的内插整句（`infoUserKeys`/`infoTotal`/`infoCooldownTime`/`infoFallbacks`/`infoMetadataDescription` 等十三处，`infoMetadataDescription` 的示例参数就传原字面量 `{"region": "us"}`）。ICU 守卫 13 键 26 侧通过。`{" -> "}` 回退链箭头是排版符号保留。测试面核查：套件 `DEFAULT_TEST_LOCALE` 为 zh-CN，`TeamInfo.test.tsx`/`integration` 均以中文文案交互（"团队成员设置"等），无断言钉住本簇接线前的英文；`EditMembership.integration.test.tsx` 的英文 label 是它自己 mock 的 schema 夹具，与本文件无关。覆盖率三项不动（912/689、10633、138）。门禁：team 与 parity 五文件 159 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 23 warning 与 HEAD 逐规则持平，prettier 本文件 HEAD 即脏不改写，`next build` 通过，扫描器本文件仍显示这 4 条（登记不翻项不入清零口径）。下一簇按队列取 `organization/org-settings/schema.ts`（4 条）。

## 2026-10-18 第 207 簇更新

继续串行推进，没有派子代理。这一簇是 `components/team/teamModelAccess.ts`，团队详情页模型徽标的计算模块（纯 `.ts`，无 React）。扫描器 4 条命中是四段静态 tooltip，盲区复查另逮到两处徽标标签（`All proxy models`/`No default models`）、`viaGroups` 兜底 `an access group`、`describeGroups` 的两条模板串和 `Granted directly ... and also via ${...}`/`Granted via ${...}` 两条动态拼接，全部一并键名化。翻译器注入教条第四次落地：`TeamBadgeTranslator = ReturnType<typeof useTranslations<"teams">>`（`import type`），`computeTeamModelBadges(models, accessGroupModels, accessGroupDetails, t)` 与 `describeGroups(names, t)` 尾参穿入，唯一消费方 `TeamInfo.tsx` 的调用点直接吃组件里现成的 `t = useTranslations("teams")`。中英两侧在 `teams` 块尾新开 11 键（叶子 10622 涨到 10633）：两条标签、五条静态 tooltip、`tooltipDirectAndGroups`/`tooltipViaGroups` 带 `{groups}`、`groupsOne`/`groupsMany` 带 `{names}`、`oneAccessGroup`；单复数没上 ICU 而复数形态留在代码侧按键选择，因为 `@tests/i18nStub` 的正值插桩渲染不了嵌套 plural，代码本来就拿着 `names.length`，键名化不引入新判定。zh 标签与 `modelSelect.allProxyModels`/`noDefaultModels` 的既有中文（所有代理模型/无默认模型）对齐，`tooltipAllProxyEntry` 里引用的条目名同步。测试迁移零断言改写：`teamModelAccess.test.ts` 注入 `enMessagesFor("teams")` 桩后，六处调用点补 `t`，英文等值断言原样成立（8 例）；`TeamInfo.test.tsx` 钉 "All proxy models" 标签的两行断言改钉 zh 值（测试套件 `DEFAULT_TEST_LOCALE` 是 zh-CN，本地化后页面渲染中文）。目录插入第一次踩出教条补丁：批量键尾行不带逗号（锚是块尾键时留逗号即非法 JSON），脚本按锚行逗号有无分流、末行统一收口。门禁：team 三文件 144 例加 parity 15 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 四文件 84 warning 与 HEAD 逐规则持平（HEAD 副本多报的 6 error 系临时目录文件名与位置效应），prettier 三文件 HEAD 干净、测试文件本轮改写归零、TeamInfo.tsx HEAD 即脏不改写，ICU 守卫 4 键 8 侧通过，`next build` 通过，扫描器本文件归零（files with hits 280 降到 279），覆盖率接入数不动（本文件是 `.ts`）。下一簇按队列取 `components/team/TeamInfo.tsx`（4 条）。

## 2026-10-18 第 206 簇更新

继续串行推进，没有派子代理。这一簇是 `hooks/useToolsOAuthFlow.tsx`，Tools 页重连路径的 OAuth2 PKCE 钩子，与第 205 簇的用户连接钩子同构（四条恢复链路命中加一处 `toast.success("Connected successfully")` 盲区，RESULT/FLOW_STATE 键位不同）。全部按 205 确立的口径接线 `mcpOauthFlow` 命名空间：`resumeFailed`/`stateLost`/`stateMismatch`/`codeMissing`/`connectedSuccess` 五处零新开键（`connectedSuccess` 上簇预置，本簇补上第二个消费者），`resumeOAuthFlow` 依赖数组补 `t`。短版 "OAuth session state was lost. Please retry." 在此也归并进目录长版，三个 OAuth 钩子文案就此完全一致。既有测试 `useToolsOAuthFlow.test.tsx` 原本裸 `renderHook`，接线后 `useTranslations` 无 Provider 即崩，按管理员/用户钩子测试先例补 `LocaleProvider locale="zh-CN"` 包裹；另新增两条 zh-CN 等值回归（state 不匹配走 error 态加 toast，成功路径断 `connectedSuccess` 文案与 `onSuccess` 收到新令牌），未接线必红。盲区复查：`startOAuthFlow` 的 catch 与 payload.error 分支是后端透传通道不翻。覆盖率：叶子 10622、同值 138 不动，非测试 `.tsx` 接入 688 升到 689、75.5%。门禁：tools 加 user 钩子 7 例、消费侧 mcp_tools 与 parity 与管理员共 4 文件 37 例、复跑 tools 单文件 4 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 本文件 3 warning 与 HEAD 持平、测试文件复跑只剩 1 条既有同款（新 render 帮助函数的内联对象告警已改具名变量消掉），prettier 两文件 HEAD 干净且当前即干净，`next build` 通过，扫描器本文件归零（files with hits 281 降到 280）。下一簇按队列取 `components/team/teamModelAccess.ts`（4 条）。

## 2026-10-18 第 205 簇更新

继续串行推进，没有派子代理。这一簇是 `hooks/useUserMcpOAuthFlow.tsx`，聊天面板（`MCPAppsPanel`）与服务器工具页（`mcp_tools`）共用的用户侧 OAuth2 PKCE 连接钩子。四条扫描命中全在 `resumeOAuthFlow` 的回跳恢复链路：`resumeFailed` 走 `setError`，另三条 `throw` 被本地 catch 经 `extractErrorMessage` 同时灌进错误态与 `toast.error`，均为用户可见，与第 203 簇的纯透传通道不同，本簇全部接线。复用管理员钩子 `useMcpOAuthFlow` 已接入的顶层 `mcpOauthFlow` 命名空间：`resumeFailed`/`stateMismatch`/`codeMissing` 精确同值直接挪用；`stateLost` 原文是短版 "OAuth session state was lost. Please retry."，目录里是带浏览器隐私设置提示的长版，同一失效成因、提示对本场景同样成立，三个 OAuth 钩子就此口径统一，接受这条英文文案归并（本簇唯一一处非纯翻译改动）。盲区 `toast.success("Connected successfully")` 不复用 `success`（"OAuth token retrieved successfully" 面向管理员取令牌场景，非同值），新开 `connectedSuccess` 键（连接成功，叶子 10621 涨到 10622），`resumeOAuthFlow` 依赖数组补 `t`。新开测试 `useUserMcpOAuthFlow.test.tsx`：仿管理员测试的 `LocaleProvider locale="zh-CN"` 包裹，三条用例分别锁定解析失败、state 不匹配、连接成功三条路径的 error 态与 toast 等值断言（对照 zh-CN.json 目录值），未接线时必红。同值口径复测：同一扁平化脚本对 HEAD 与当前双侧均 138，第 202 簇记的 134 无法复现，头部回改。门禁：新测试 3 例加 OAuth 相关消费侧 6 文件 48 例加 `messagesParity`/`locales` 15 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 本文件 5 条 warning 与 HEAD 持平、测试文件零告警（HEAD 副本复测报出的 2 条 error 系临时目录文件名规则与副本位置效应，真实文件无），prettier 两份目录 HEAD 即脏不改写、代码文件干净，`next build` 通过，扫描器本文件归零（files with hits 282 降到 281），非测试 `.tsx` 接入升到 688/912、75.4%。下一簇按队列取 `hooks/useToolsOAuthFlow.tsx`（4 条，同款字符串，本簇已备好复用口径；注意其现有测试 `renderHook` 未包 Provider，接线后要补 wrapper）。

## 2026-10-18 第 204 簇更新

继续串行推进，没有派子代理。这一簇是 `utils/ptuValidation.ts`，PTU（预留容量）定价表单的校验规则模块，四条扫描命中加两条模板串盲区（`ptuCountRules`/`ptuRateRules` 的带参消息）。第 192/201 簇"纯模块翻译器注入"教条第三次落地：六条 `Promise.reject(new Error(...))` 全部改为按 `PtuTranslator`（`ReturnType<typeof useTranslations<"models.addModel">>`，`import type` 仅取类型）参数化，消息零新开，全部精确同值复用 `models.addModel` 既有键：`ptuCountRange`/`ptuRateRange`（带 `{max}`，与 `ModelInfoEditForm.tsx` 的用法逐字对齐）、`ptuPairRequired`、`ptuStartRequired`、`ptuWindowOrder`、`ptuCostReservedOnly`，中英两侧早前已备（这些键正是 ModelInfoEditForm 一簇预置的）。API 形态：`ptuCountRules`/`ptuRateRules` 模块级数组改 `(t) => ValidatorRule` 工厂（数组本是单元素包装的遗留），`ptuPairRule(siblingField, t)`、`ptuNoUsageCostRule(countField, t, thisField?)`、`ptuStartRequiredRule(countField, t)`、`ptuWindowOrderRule(siblingField, thisBound, t)` 追加 t 参，唯一消费方 `advanced_settings.tsx` 八处调用点随之穿入现成的 `t = useTranslations("models.addModel")`（其 `AdvancedSettingsTranslator` 本地别名与 `PtuTranslator` 同型）。测试迁移走 `tests/i18nStub.ts` 通道：把桩的命名空间解析泛化为点分路径 walk（单段命名空间行为不变），测试注入 `enMessagesFor("models.addModel")` 渲染 en.json 真实英文，既有英文子串断言（"whole number between 1 and"、"1,000,000" 等）一字不动仍然成立，27 例全绿。覆盖率不动（本文件是 `.ts`，目录叶子与同值零变化：10621/134）。门禁：add_model 整包加 ModelInfoEditForm 加两个桩消费测试共 44 文件 1016 例全绿、Type Errors 无报错，tsc 锚定零命中（`import type` 值命名空间供 `typeof` 查询可行），eslint 四文件与 HEAD 持平（advanced_settings 少一条属改善），prettier 三文件 HEAD 干净改写归零、advanced_settings HEAD 即脏不改写，`next build` 通过，扫描器本文件归零（files with hits 283 降到 282）。下一簇按队列取 `hooks/useUserMcpOAuthFlow.tsx`（4 条）。

## 2026-10-18 第 203 簇更新

继续串行推进，没有派子代理。这一簇是 `hooks/cloudzero/useCloudZeroSettings.ts`，CloudZero 集成的 react-query 钩子模块（非组件，本文件无钩子可用的翻译器），纯判定簇，零接线、零改动（覆盖率沿用第 202 簇后口径：非测试 `.tsx` 912 个接入 687 个、75.3%，叶子 10621、同值 134）。扫描器 5 条命中逐条判定：`Failed to fetch/update/delete CloudZero settings` 三条与两条 `Access token is required` 全是错误归一化阶梯里的本地兜底（后端 `errorData.error.message/detail/statusText` 取不到时才落到这些串），消费链路查实为整通道原样透传：`CloudZeroCostTracking.tsx` 渲染 `t("loadError") + error.message`（前缀已汉化、消息体透传），三个模态的 `onError` 走 `toast.error(error.message || t("…FailedToast"))`（兜底 toast 已各自键名化），与第 199 簇 A2A 通道同构，整通道按 backend 数据透教条不翻。接线成本另有一档：模块函数在 React 树外拿不到 `useTranslations`，要么把翻译器作参穿进三个公开钩子签名（波及 3 个消费组件与 7 个按英文消息文本做等值断言的测试文件，含 sso/uiSettings/projects 同款 `Access token is required` 断言先例），要么在无 Provider 的 renderHook 测试里引钩子直接崩，超出汉化簇最小改动边界。`cloudZero`/`cloudZeroExport` 命名空间 UI 文案早已齐备，同值的 `updateFailedToast`/`deleteFailedToast` 说的是 integration 不是 settings，精确同值教条下不可挪用。盲区复查：`Bearer ${accessToken}` 头、`application/json`、`GET/PUT/DELETE` 与 query key 全是 wire 值，注释非 UI。本文件扫描器 5 条登记为不翻。下一簇按队列取 `utils/ptuValidation.ts`（4 条）。

## 2026-10-18 第 202 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/MCPSubmissionsTab.tsx`，MCP 服务器提交审核页（规则面板、统计卡、提交卡片与确认弹窗）。页面骨架早前已接 `mcpServers.submissions.*`，本簇接线的是四处盲区：`ConfirmDialog` 标题两条裸串、`Are you sure you want to {action}` 把 approve/reject 英文动作词裸插进整句（连 rejectBody 三元与 approve 详情串一起），改组为三条整句键并用 `t.rich` 的 `<b>` 标签保留服务器名强调样式；`MCPServerCard` 无规则分支的 `Re-approve` 裸串复用既有 `submissions.reapprove`（此前只接在 checks 头部）；`` `${failCount} check${...} failed` `` 与 `{pass} passing, {fail} failing` 复用早前预置、零消费者的 `checksFailed`/`passingFailing`，其中 `checksFailed` 中英两侧升级为 ICU 复数（原英文实现有 `1 check failed` 单数语法，普通 `{count}` 键会退化）。扫描器 5 条命中：确认弹窗 3 条如上接线，`Failed to load submissions` 是 `setError` 兜底、渲染进错误占位 div，接新开 `loadFailed` 键（`err.message` 分支属后端透传通道不翻），`console.warn` 前缀不翻。顺手修掉一处既有 bug：`StatCard` 收了字典键 `label` 却裸渲染（页面显示 `submissions.totalSubmitted` 原始键名且 `t` 挂空），改为 `t(label)` 并把 prop 类型收紧为键名联合。新开 6 键插在 `submissions` 块尾 `rulesSaveFailedToast` 后（`confirmApproveTitle`、`confirmRejectTitle`、`confirmApproveBody`、`confirmRejectBodyLive`、`confirmRejectBodyPending`、`loadFailed`，叶子 10615 涨到 10621；`fetchData` 回调新增 `t` 依赖，next-intl 的 `t` 随上下文 memo，不会引发重取循环）。本组件无测试文件，`messagesParity`/`locales` 15 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 与 HEAD 双侧持平 PARITY-OK，prettier 本文件与两份目录 HEAD 即脏、按教条不改写，ICU 守卫 8 键 16 侧通过（富文本键补 `b` 标签回调），`next build` 通过，扫描器本文件剩 1 条 `console.warn` 登记不翻。另按 HEAD 重测中英同值实为 134，此前记录的 138 是旧口径，头部一并修正。下一簇按队列取 `hooks/cloudzero/useCloudZeroSettings.ts`（5 条）。

## 2026-10-18 第 201 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/editServerPayload.ts`，编辑 MCP 服务器弹窗的纯 payload 构建模块。早前只在 fixtures 层面登记过不碰，本簇整片复判坐实：`editPayloadErrorMessage` 五条校验消息全是用户可见（唯一调用方 `mcp_server_edit.tsx` L759 `toast.fromError`），第 192 簇"纯函数返回值键名化"教条的变体落地：纯模块无法自持钩子，改按 `translators.ts` 的 `McpServersTranslator` 类型参数化翻译器注入（`editPayloadErrorMessage(built, t)`），函数体从返回英文串改为返回 `t(...)` 渲染值。三条与创建流精确同值直接复用：`create.invalidToolDisplayName`（模板串盲区补线，带 name 参数）、`create.invalidStdioJson`、`create.invalidTokenValidationJson`；三条新开插 `mcpServers.edit` 块 `authorizeInAuthSection` 后（`stdioConfigMissingCommand`、`invalidStdioEnvJson`、`stdioCommandRequired`，叶子 10612 涨到 10615）。`assertNever` 的开发态抛出与 `unknown` 兜底名是内部断言非 UI，differential cases/fixtures 早前登记不碰。differential 与 edit 测试零消息文本断言、签名变更无涟漪，159 例全绿 + 2 例预期失败（既有），Type Errors 无报错，tsc 锚定零命中，eslint 双侧持平 PARITY-OK，prettier HEAD 脏 1 行按教条不改写，ICU 守卫 6 键 12 侧通过，`next build` 通过，扫描器本文件归零。下一簇按队列取 `mcp-servers/_components/MCPSubmissionsTab.tsx`（5 条）。

## 2026-10-18 第 200 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/mcp_connect.tsx`，MCP 连接方式说明页（Cursor/Claude Code/curl/Streamable HTTP 等页签），早前批次只在盲区复查时判过 Bearer 样本、未整片过，本簇按复判计划整片过一遍，结论是纯判定簇，零接线、零改动（覆盖率沿用第 197 簇后口径：非测试 `.tsx` 912 个接入 687 个、75.3%，叶子 10612、同值 138）。页面全部 UI 文案早已接 `mcpServers.mcpConnect.*`：FeatureCard 走 `titleKey` + `t(titleKey)`，描述、传输方式、页签、服务器地址小节、限制工具开关（t.rich limitToolsHint）、twoOptions/option1/option2 提示与 mixBoth 等全部就位；placeholder/aria-label/title/label 属性别搜零裸串，全文件无 console 调用。扫描器 5 条命中逐条判定：4 条在 `CodeBlock` 的 curl/JSON 代码样本内（`Bearer YOUR_LITELLM_VIRTUAL_KEY`、`Bearer YOUR_LITELLM_API_KEY`），1 条在 `getHeadersConfig()`，该函数唯一消费方是把 `"x-litellm-api-key": "Bearer ..."` 回填进代码样本的 headers 占位（cloneElement 正则替换），同属样本负载，按第 183/197 簇样本教条与第 190 簇 Bearer 先例登记不翻。`Zapier_MCP`、`dev-group`、`"Server1,dev-group"` 是示例值/wire 值不动，`Run available tools` 等是 curl 样本 payload。本文件扫描器 5 条登记为不翻。下一簇按队列取 `mcp-servers/_components/editServerPayload.ts`（5 条，fixtures 早前登记过不碰，届时复判坐实）。

## 2026-10-18 第 199 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/llm_calls/a2a_send_message.tsx`，A2A JSON-RPC 2.0 请求模块（非组件、无钩子可用），纯判定簇，零接线、零改动（覆盖率沿用第 197 簇后口径：非测试 `.tsx` 912 个接入 687 个、75.3%，叶子 10612、同值 138）。扫描器 5 条命中逐条判定：4 条开发日志前缀（提取失败与流式 chunk 解析失败两条 `console.warn`、发送/流式两条 `console.error`）照旧不翻；`Unknown A2A error` 是 JSON-RPC 错误 chunk 缺 `message` 时的抛出兜底，消费链路查实为 ChatUI `catch` 里 `String(error)` 原样灌进聊天文本、CompareUI `catch` 里 `error.message` 灌进 `compare.errorFetching` toast，同一条透传通道还携带后端 `error.message`、`errorData.detail` 与 `HTTP {status}` 码，整通道按 backend 数据透教条不翻，本地兜底一词单独键名化要跨两个消费方设计错误通道映射，超出汉化簇最小改动边界，一并登记不翻。盲区复查：`No response body`、`HTTP ${response.status}` 同理走该透传通道不翻，`parseError.message.includes("JSON")` 是解析分流逻辑非文案，文件头与函数注释非 UI。本文件扫描器 5 条登记为不翻。下一簇按队列取 `mcp-servers/_components/mcp_connect.tsx`（5 条，早前盲区判过 Bearer 样本，届时整片复判）。

## 2026-10-18 第 198 簇更新

继续串行推进，没有派子代理。这一簇是 `policies/_components/add_attachment_form.tsx`，护栏附件创建弹窗，纯判定簇，零接线、零改动（覆盖率沿用第 197 簇后口径：非测试 `.tsx` 912 个接入 687 个、75.3%，叶子 10612、同值 138）。该文件在早前批次已整片接完 `policies.attach.*`/`policies.form.*`：zod 消息（含 superRefine 的 invalidTeams 带参）、五个 TokenSelect 的标签/提示/占位/空态、加载态占位、优先级与默认开关的标签/提示/说明、t.rich tagsDesc、成功/部分成功/失败 toast、抛出串 form.noToken 与 createFailedWith 全部就位。扫描器 5 条命中逐条判定：全部是数据拉取与提交失败回调里的 `console.error` 前缀（teams/keys/models/estimate impact/create attachment），按既定教条不翻。盲区复查过全文件：优先级输入框占位 `e.g. 10` 按第 171/183 簇数字格式示例教条保持英文（中英同值非漏翻），`INT32_MIN/MAX` 常量、`(t: any)` 箭头参数遮蔽译器（第 193 簇先例，合法）与代码注释均非 UI 文案。本文件扫描器 5 条登记为不翻。下一簇按队列取 `playground/llm_calls/a2a_send_message.tsx`（5 条）。

## 2026-10-18 第 197 簇更新

继续串行推进，没有派子代理。这一簇是 `transform-request/TransformRequestPanel.tsx`，请求转换演练场页。页面主体早前已接 `transformRequest.*`，本簇真文案只有两条失败 toast：JSON 解析失败 `fromError("Invalid JSON in request body")` 与令牌缺失 `fromError("No access token found")`，各新开 1 键（`invalidJsonBody`、`noAccessToken`，插在 `foundErrorHere` 之后保持字母序，叶子 10610 涨到 10612）。扫描器其余 3 条命中（`You are a helpful assistant.` ×2、`Explain quantum computing in simple terms`）分别在 `useState` 默认请求 JSON 样本与 `<pre>` 里的 curl 兜底样本内，属可编辑的请求负载示例（与第 183 簇 testInputExamples、curl 样本教条同级）登记不翻，`Error transforming request:` console.error 同判。测试 2 处 `fromError` 断言迁移中文，23 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 与 HEAD 双侧持平 PARITY-OK，prettier 双侧零脏行未改写，ICU 守卫 4 侧通过，`next build` 通过，扫描器本文件剩 3 条全部登记为不翻。下一簇按队列取 `policies/_components/add_attachment_form.tsx`（5 条）。

## 2026-10-18 第 196 簇更新

继续串行推进，没有派子代理。这一簇是 `vector-stores/_components/vector_store_info.tsx`，向量存储详情页（查看/编辑两个形态加测试页签）。文件在早前批次已接 `vectorStores.*` 大半，本簇把剩余裸串整片清零：扫描器 5 条里两条 zod 必填消息走 `SearchTools.tsx` 的翻译器工厂先例（`vectorStoreEditSchema(t)` 包 `z.object`，消费方 `useZodForm(useMemo(() => vectorStoreEditSchema(t), [t]), ...)`，类型改 `z.infer<ReturnType<...>>`），metadata JSON 非法 toast 与 Provider 标签/提示直接复用同命名空间精确同值的 `metadataJsonInvalid`/`providerShort`/`providerHint`；`Metadata` 标签复用 `metadataLabel`，但同值 `metadataHint` 带"(optional)"尾巴不可复用，新开 `metadataFieldHint`。盲区补线更多：两处 `Back to Vector Stores` 复用同值 `backToList`，Config 徽标复用 `table.sourceConfig`（列表列同款接法），拉取失败 toast 新开带参 `fetchDetailsFailed`，更新成功新开 `updatedToast`（对齐既有 `createdToast`），凭据二选一提示新开 `credsChoiceHint`，OR 分隔线新开 `orDivider`（或），Cancel 走第二钩子 `commonT("cancel")`。不翻登记：`"DB"` 徽标沿用 `VectorStoreTableColumns.tsx` 列表列字面量与测试断言先例（`ID`/TTFT 同级缩写），详情视图 `ID` 短标签、`{"key": "value"}` JSON 占位符同理。新开 6 键插在 `updateFailed` 之后（叶子 10604 涨到 10610，同值持平 138，覆盖率持平 687/912）。测试 4 处选择器迁移中文（Config、Back、Invalid JSON toast、ID 必填），vector-stores 整包加 i18n 129 例全绿、Type Errors 无报错，tsc 锚定零命中，eslint 与 HEAD 持平 PARITY-OK，prettier HEAD 干净、改写 1 处后归零，ICU 守卫 13 键 26 侧通过（首轮 PARAM-DROPPED 是守卫自身大小写误报，改按渲染值断言），`next build` 通过，扫描器本文件归零。下一簇按队列取 `transform-request/TransformRequestPanel.tsx`（5 条）。

## 2026-10-18 第 195 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/Teams.tsx`，团队管理页。该文件在早前批次已整片接 `teams.*`，本簇只剩一条真文案：catch 里 `throw new Error("Failed to parse secret manager settings: " + e)` 的抛出串。追了消费链路确认是用户可见文本：创建团队失败时该 Error 经 `extractProxyErrorMessage`（`src/lib/http/client.ts`，对 Error 直接取 `.message`）灌进 `listCreateError` toast，故改为 `t("secretManagerParseFailed", { error: String(e) })`，中英各新开 1 键、插在 `teams.listCreateError` 之后（叶子 10603 涨到 10604，同值持平 138）。文件其余 4 条 `console.error` 前缀（guardrails/policies/user models/创建团队日志）照旧登记不翻。Teams.tsx 早已接入翻译器，覆盖率持平 687/912、75.3%。定向 vitest 95 例全绿、Type Errors 无报错，tsc/eslint 与 HEAD 持平 0/0，prettier 双侧零脏行未改写，ICU 守卫中英 2 侧通过，`next build` 通过。下一簇按队列取 `vector-stores/_components/vector_store_info.tsx`（5 条）。

## 2026-10-18 第 194 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/user_agent_activity.tsx`，纯判定簇，零接线、零改动（覆盖率沿用第 193 簇后口径：非测试 `.tsx` 912 个接入 687 个、75.3%，叶子 10603、同值 138）。该文件在第 74 簇已整片接 `userAgentActivity.*`（卡片区、组合框筛选、DAU/WAU/MAU 页签与三个堆叠图标题）。扫描器 5 条命中全部是 fetch 回调里的 `console.error` 前缀串（`Failed to fetch available tags:` 与 DAU/WAU/MAU/summary 四条数据拉取失败），按既定教条不翻。盲区复查两轮：`"User-Agent: "` 是后端 tag 的 wire 前缀用于解析剥除属数据值，`substring(0, 50)}...` 是截断装饰非文案，toast 与模板串处均已走 `t()`。本文件扫描器 5 条登记为不翻。下一簇按队列取 `src/components/Teams.tsx`（5 条）。

## 2026-10-18 第 193 簇更新

继续串行推进，没有派子代理。这一簇是 `src/utils/mcpToolCrudClassification.ts`，MCP 工具 CRUD 风险分组模块（正则分类加组元数据），扫描器 5 条命中是 `CRUD_GROUP_META` 的五条 description。模块在 React 上下文外，按第 192 簇返回值即键名路子把 `label`/`description` 裸字符串改成 `CrudGroupLabelKey`（groupRead 等五键）与 `CrudGroupDescriptionKey`（descRead 等五键）联合字面量，`risk` 保持 wire 值并导出 `CrudRiskLevel` 类型。唯一消费方 `McpCrudPermissionPanel.tsx` 整片未接线，本簇一并接线：补 `useTranslations("mcpToolPermissions")`（该命名空间此前只有 MCPToolPermissions.tsx 的 6 条加载失败键），分组标题 `t(meta.labelKey)`、描述行 `t(meta.descriptionKey)`、风险徽标新增 `RISK_LABEL_KEY: Record<CrudRiskLevel, RiskLabelKey>` 映射四档（riskSafe/riskMedium/riskHigh/riskUnclassified），计数改带 `{allowed}/{total}` 参数的 `allowedCount`，开关态三串 `allOn`/`partial`/`allOff`，组级勾选 aria 改带 `{name}` 参数的 `allowAllTools`（name 传 `t(meta.labelKey)`），单工具 on/off 徽标 `toolOn`/`toolOff`。工具名与描述、`RISK_BADGE` 类名表均数据值不动。新开 21 键（叶子 10582 涨到 10603，同值 138 持平），en 侧逐字保留（含 em dash 原文案），zh 侧破折号句式改冒号引导枚举。锚点 `noTools` 在目录里有五处同名键，插入脚本要先定位 `"mcpToolPermissions": {` 块再在块内找锚，否则会插错命名空间。

测试迁移：`mcpToolCrudClassification.test.ts` 只测分类函数不碰元数据，零改动；`MCPToolPermissions.test.tsx` 三处组级勾选 aria 选择器 `Allow all Read tools` 换 `允许全部 读取 工具`，`crudTools` 夹具（delete_document、"Destroy a document"）是测试数据保持英文。面板同时被 mcp_tool_configuration 与 agents 三个测试文件消费，跑 mcp-servers 目录加 mcp_server_management 加 agents 三文件加 utils 加 i18n 共 77 文件 1470 例全绿（2 例预期失败）、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径三文件两侧均 0/0（组件内箭头参数 `t` 与译器 `t` 同名不构成 shadow 报错），prettier 三文件 HEAD 均干净、`--write` 只重排本簇长行、复跑仍绿；21 键 42 侧 `IntlMessageFormat` 实跑（两条带参数逐侧渲染逐字相等），`npm run build` 过，扫描器两文件归零。面板接线后接入文件 686 涨到 687（75.3%）。下一簇按队列取 `src/components/user_agent_activity.tsx`（5 条）。

## 2026-10-18 第 192 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/importConnectorConfig.ts`，连接器 JSON 导入的纯解析校验函数。它拿不到 React 上下文，`ParsedConnectorConfig` 的 `error: string` 按模块数据键名化路子改成 `ConnectorConfigErrorKey` 七个键字面量联合（`import.pasteFirst`/`invalidJson`/`expectedServersKey`/`serversNotObject`/`serversEmpty`/`serversListNotArray`/`serversListEmpty`），返回值即键名；消费侧 `ImportMCPServers.tsx` 早已整片接 `mcpServers.import.*`，`setParseError(parsed.error)` 改 `t(parsed.error)` 一处。同文件 `PLACEHOLDER` 的 JSON 样本、`console.error("Failed to import MCP servers:")` 与后端 `skipped.reason`/`errors.error` 数据值均不翻。新开 7 键插到 `mcpServers.import.countToast` 之后（叶子 10575 涨到 10582，同值 138 持平），en 侧逐字保留原错误串（两处重复的 `Expected a JSON object...` 收敛成一个键），zh 侧 `mcpServers`/`mcp_servers`/JSON 是 wire 键名与格式名原样保留；该锚点是 import 子块末键（无尾逗号），目录插入脚本要按锚点是否带逗号决定新块末行加不加逗号。测试迁移：`importConnectorConfig.test.ts` 六处 `toContain(英文子串)` 改成键名 `toBe` 逐字相等；无 ImportMCPServers 组件测试。验证：mcp-servers 目录加 `src/lib/i18n` 44 文件 772 例全绿（2 例预期失败）、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径三文件两侧均 0/0，prettier 三文件 HEAD 与当前均干净零改写；7 键 14 侧 `IntlMessageFormat` 实跑逐字相等，`npm run build` 过，扫描器本文件归零（全队列带命中的文件数 288 降到 287）。`.ts` 文件不计覆盖率，接入文件持平 686/912。下一簇按队列取 `src/utils/mcpToolCrudClassification.ts`（5 条）。

## 2026-10-18 第 191 簇更新

继续串行推进，没有派子代理。这一簇是对 `policies/_components/ai_suggestion_modal.tsx` 的复判，纯判定簇，零接线、零改动（覆盖率沿用第 188 簇后口径：非测试 `.tsx` 686/912、75.2%，叶子 10575、同值 138）。该文件在早前批次已整片接完 `policies.ai` 键并补过六个占位符键，当时条目末尾"扫描器本文件归零"记错了，本轮复判坐实残留的 6 条正是当时逐条判定过的那批：2 条 `console.error` 前缀串（`Failed to load models:`、`Failed to enrich templates:`）加 4 条 SVG path 数据（其中告警三角 path 在 575/749 两处复用），全部既定不翻。盲区复查过全文件：`placeholder` 处攻击示例四键早已接线，JSX 文本节点与 toast 无裸英文。本文件扫描器 6 条登记为不翻。下一簇按队列取 `mcp-servers/_components/importConnectorConfig.ts`（6 条）。

## 2026-10-18 第 190 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/AIHub/ModelHubTable.tsx`，AI Hub 目录页（模型/智能体/MCP/Skill 四个页签加三个详情弹层），纯判定簇，零接线、零改动（覆盖率沿用第 188 簇后口径：非测试 `.tsx` 686/912、75.2%，叶子 10575、同值 138）。页面主体早已整片接 `modelHub.*`：标题与角色说明、四个页签、三张表的加载/空态（含 `HubEmptyState` 的 title/body 由调用侧传译好的串）、各段 sec* 小节标题与 lbl* 字段标签、showing* 计数带参数、make public 按钮、Agent 搜索框与清空 aria、公开页未启用提示、notSpecified/unknownStatus 兜底、modelDetailsTitle 等全部就位。扫描器 6 条逐条判定：4 条 `console.error` 前缀串（`There was an error fetching the model data` 等，另外三条 `Error refreshing ...:` 形态扫描器不报，同判不翻），`Hello, how are you?` 与 `f"Available tools: ..."` 在模型用法示例与 MCP 用法示例的 Python 代码样本里（`SyntaxHighlighter` 渲染的 curl/代码样本内容教条不翻，`your_api_key`、`# Your LiteLLM Proxy URL`、`name="tool_name"` 同理）。盲区复查：Agent 技能卡的 `ID: {skill.id}` 短前缀按目录先例不翻（`"columnId"/"id": "ID"` 等中文侧全目录保持 ID 原样，与第 182 簇 TTFT 缩写同级），`Bearer <your-master-key>` 是 Bearer 样本先例，provider/transport/auth*type/status/支持参数/能力徽标（`formatCapabilityName` 从 `supports**`wire 键派生）与版本号、时间戳均为数据值或 wire 值不动。本文件扫描器 6 条登记为不翻。下一簇按队列取`policies/\_components/ai_suggestion_modal.tsx`（6 条，此前登记过需复判）。

## 2026-10-18 第 189 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/add_model/add_model_modes.tsx`，纯判定簇，零接线、零改动（覆盖率沿用第 188 簇后口径：非测试 `.tsx` 686/912、75.2%，叶子 10575、同值 138）。扫描器 6 条命中全部是 `AUTO_ROUTER_MODES` 的六个路由策略 label。全树检索确认该导出没有任何消费方（`grep -rn AUTO_ROUTER_MODES` 只命中定义行，dashboard 目录除 node_modules/.next 外零引用），同文件的 `TEST_MODES` 早已被 `AddModelForm.tsx` 按 `labelKey` 键名化接线，不是死键铺法的问题。真正渲染策略标签的是 `routing_groups/strategy.ts` 的键映射与 `router_settings` 组件，均已接线；自动路由器编辑页 `add_auto_router_tab.tsx` 不渲染任何策略英文。按第 181/184 簇死元数据教条，六个 label 与 `AUTO_ROUTER_MODES` 本体一并登记为不接不删：汉化分支对上游文件保持最小 diff，删除死导出不属汉化簇职责。本文件扫描器 6 条登记为不翻。下一簇按队列取 `src/components/AIHub/ModelHubTable.tsx`（6 条）。

## 2026-10-18 第 188 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/settings.tsx`，日志回调与告警设置页。页面主体早有 `useTranslations("settings")` 与 `commonT`，扫描器 6 条命中在动态参数区的裸英文：必填校验模板 `Please enter the ${label.toLowerCase()}`、下拉占位 `Select ${...}`、密码/文本占位 `Enter your ${...}`、数字占位 `Enter ${...}`，label 取自后端 `ui_name` 属数据值不翻，参数化外壳四个键化（`fieldRequired`/`selectFieldPlaceholder`/`enterYourField`/`enterField`，均带 `{name}`）。盲区是大头：`alerts_to_UI_NAME` 的 11 个告警标签（LLM Exceptions 等）按第 177/183 簇键名化路子改成 `AlertLabelKey` 联合类型 + `Record<string, AlertLabelKey>`，渲染处 `t(value)`，wire 键（`llm_exceptions`）不动，保存载荷与 `document.querySelector(input[name=...])` 选择器不受影响；六条 toast（回调更新/添加带 `{name}`/删除带 `{name}`/告警保存/健康检查/告警测试）、`getCallbackConfigsCall` 解析失败带 `{error}` 的 `loadCallbackConfigsFailed`、Slack 说明段 `t.rich("slackWebhookDesc")` 带 `<link>` 标签保留外链 href/target、保存与测试按钮、`LiteLLM Docs: Logging` 链接、添加/保存中按钮态、`commonT("cancel")`×2、DeleteResourceModal 的确认文案与回调信息/回调名称/模式三个标签（模式取值 `"success"` 是 wire 值不翻）共 32 个 settings 命名空间新键（叶子 10543 涨到 10575，同值 138 持平）。

测试迁移：`settings.test.tsx` 12 处 `{ name: "Save Changes" }` 换 `保存更改`，必选校验断言换 `请输入public key`（小写由处理器传入），s3_v2 未选占位断言换 `toHaveTextContent("选择 folder partitioning")`；`ui_name` 派生的字段标签（Public Key/Endpoint URL/Export Protocol/Log Prompts Only/Folder Partitioning 等）保持英文。验证：`settings.test.tsx` 加 `src/lib/i18n` 共 4 文件 41 例全绿、Type Errors no errors，tsc 锚定 `^src/components/settings\.(tsx|test\.tsx)` 无本簇文件报错，eslint stdin 口径 20/20 与 HEAD 逐条同数（接线 loadConfig toast 后新爆一条 exhaustive-deps，useEffect 依赖补 `t` 归位），prettier 先证 HEAD 干净后 `--write` 只重排本簇 127 列校验行，复跑仍绿；32 键 64 侧 `IntlMessageFormat` 实跑（`slackWebhookDesc` 带 link 处理器、四条 `{name}` 与 `{error}` 参数逐侧渲染比对），`npm run build` 过，扫描器本文件只剩 `Failed to delete callback:` 一条 console.error 既定不翻。本文件早有 `useTranslations`，接入文件持平 686/912。下一簇按队列取 `src/components/add_model/add_model_modes.tsx`（6 条）。

## 2026-10-18 第 187 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-tracking/_components/use_discount_config.ts`，成本折扣配置的 hook，与第 185 簇的加成 hook 同构（fetch/save 两条 REST 加增删改回调）。扫描器 6 条里 1 条是 `console.error("Failed to fetch discount config")`（既定不翻，另两条 `Error ...:` 前缀形态扫描器不报），5 条 toast 接线；盲区补三条：保存成功 toast、`Invalid provider selected`、模板串 `Discount for ${...} already exists. Edit it in the table above.`。八条用户可见 toast 全部键化，其中 `Invalid provider selected` 与 detail 缺失兜底 `Failed to update settings` 逐字同值复用同 ns 既有键 `invalidProviderSelected`/`updateSettingsFailed`，新开 6 键（叶子 10537 涨到 10543，同值 138 持平）：`fetchDiscountConfigFailed`/`discountConfigUpdated`/`updateDiscountConfigFailed`/`selectProviderAndDiscountRequired`/`discountPercentRange`/带 `{name}` 的 `discountExists`，中文措辞对齐第 185 簇加成侧先例（获取折扣配置失败、`{name} 的折扣已存在，请在上方的表格中编辑。`、`折扣必须在 0% 到 100% 之间`）。`.ts` hook 体内 `useTranslations("costTracking")`，三个 `useCallback` 依赖补 `t`。

测试迁移：`use_discount_config.test.ts` 按第 185 簇 wrapper 先例包 `LocaleProvider locale="zh-CN"`（`React.createElement` 免 JSX、children 进 props 对象），11 处 `renderHook` 统一加 `{ wrapper }`，6 处断言换中文逐字面量（`/failed to fetch/i`、两处必选提示、`/0%.*100%/i`、`/already exists/i` 带 OpenAI 名、成功 toast）。children-as-props 触发 `react/no-children-prop` 一条新错：eslint 指令行不允许尾随 reason（会被当成第二个规则名报 rule not found），按仓库惯例改成分两行，reason 独立注释在上、裸指令在下压制。`use_margin_config.test.ts` 同款错误是第 185 簇遗留已提交，本簇不动。验证：cost-tracking 目录 20 文件 222 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径 hook 2/2（raw fetch 既有欠账）与 HEAD 逐条同数、测试 0/0，prettier 两文件 HEAD 与当前均干净零改写；6 键 12 侧 `IntlMessageFormat` 实跑（`discountExists` 带 `{name}` 渲染逐字相等，`0%`/`100%` 百分号非 ICU 特殊字符），`npm run build` 过，扫描器本文件只剩 1 条 console.error 既定不翻。hook 是 `.ts` 不计入非测试 `.tsx` 覆盖率，接入文件持平 686/912。下一簇按队列取 `src/components/settings.tsx`。

## 2026-10-18 第 186 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-optimization/_components/ShadowEvalStartForm.tsx`，影子评估发起表单。页面主体早已接 `shadowEval.*`，扫描器 7 条命中是 `DIRECTION_OPTIONS` 两条方向标签、`START_FORM_DESCRIPTION` 两条四句长文、`Only on models` 与两处 `No chat models available`；盲区还有一批抓不到的短串：Direction/Keys to shadow/Teams to shadow/Users to shadow/Traffic sampled/Duration/Spend budget/Baseline model/Judge model 共 9 个 Field 标签（scanner 报过的 `Only on models` 算上共 10 个）、`% of traffic`、`max shadow + judge spend, per target`、评审下拉的 `Recommended` sublabel、按钮 `Start shadow eval`/`Starting...` 与 `DURATION_OPTIONS` 五条 `N day(s)`。

按第 177/183 簇键名化路子把三块模块级数据改成键字面量：`DIRECTION_OPTIONS`、`DURATION_OPTIONS` 的 `label` 换成 `labelKey` 联合类型，`START_FORM_DESCRIPTION` 改成 `Record<ShadowEvalDirection, "shadowEval.descForward" | "shadowEval.descReverse">`，渲染时 `t` 查表；`SelectValue` 的回显派生 `directionLabelKey`/`durationLabelKey` 后用 `{key ? t(key) : null}` 兜住可选类型。字段标签、`pctOfTraffic`、`budgetHint`、`noChatModels`、`recommended`、按钮态 `starting`/`startSubmit` 逐一接线。新开 25 键（叶子 10512 涨到 10537，同值 138 持平），中文措辞对齐目录先例：评审模型/基线模型/推荐既有叫法，时长沿用 `virtualKeys.lifecycle.interval7d` 的"N 天"构词。`RECOMMENDED_JUDGE_MODELS` 是模型 id、`MAX_ROUTERS`/`MAX_MODELS` 是数字，均不动。

测试迁移：`ShadowEvalSection.test.tsx` 23 处渲染串换中文逐字面量（方向标签 4+4、`开始影子评估` 12、`/prod-judge.*推荐/` 与 `queryByText("推荐")` 各 1、`每个路由看到…`整句 1），it 描述照旧英文；L461 `/ends in 3 days/` 由未接线组件渲染保持英文。验证：cost-optimization 目录 16 文件加 `src/lib/i18n` 共 20 文件 228 例全绿、Type Errors no errors，tsc 本簇测试文件 9 条报错经 HEAD 基线换回比对逐条同数（`by_router` 缺字段 TS2741 等既有欠账），eslint stdin 口径组件 0/0、测试 13/13 与 HEAD 逐条同数，prettier 先证 HEAD 两文件均脏（组件 38、测试 4）按口径不跑 `--write`，本簇新写的 union 类型直接按 prettier 规范形态落盘，改过的 4 处 `chooseSelectOption` 与 1 处 `expect` 手工折成单行，测试文件脏行清零，组件脏行 38 与 HEAD 基线持平（整块 `RouterField` 缩进欠账非本簇触碰）；25 键 50 侧 `IntlMessageFormat` 实跑（无参数，英文撇号按字面渲染），`npm run build` 过，扫描器本文件归零。本文件接线前就已含 `useTranslations`，接入文件持平 686/912。下一簇按队列取 `cost-tracking/_components/use_discount_config.ts`。

## 2026-10-18 第 185 簇更新

继续串行推进，没有派子代理。这一簇是 `cost-tracking/_components/use_margin_config.ts`，成本加成配置的 hook（fetch/save 两条 REST 加增删改回调）。`.ts` hook 带 toast 的先例是 `team/useMemberBudgetReset.ts`：直接在 hook 体内 `useTranslations("costTracking")`，九条用户可见 toast 全部键化：fetch 失败与 save 失败（`fetchMarginConfigFailed`/`updateMarginConfigFailed`）、保存成功（`marginConfigUpdated`）、服务端 detail 缺失时的兜底串（`updateSettingsFailed`）、供应商必选与非法（`selectProviderRequired`/`invalidProviderSelected`）、百分比区间 0% 到 1000%（`marginPercentRange`）、固定金额非负（`fixedAmountNonNegative`），以及模板串 `Margin for ${displayName} already exists...` 改成带 `{name}` 参数的 `marginExists`，displayName 里写死的 "Global" 换成本命名空间既有键 `global`（供应商名取 `Providers` 映射属数据值）。三个 `useCallback` 依赖补 `t`。新开 9 键（叶子 10503 涨到 10512，同值 138 持平），`百分比必须在 0% 到 1000% 之间` 的措辞对齐同 ns `validRangeDesc` 的折扣句式；跨 ns 有两条逐字同值的 "Please select a provider"（guardrails/vectorStores），按同命名空间教条不复用。两条 `console.error` 照旧不翻，本文件扫描器只剩这一形态。

测试迁移：本文件是裸 `renderHook`，接线后必须有 Intl 上下文，按 `useMemberBudgetReset.test.tsx` 的 wrapper 先例包 `LocaleProvider locale="zh-CN"`（`.ts` 文件用 `React.createElement` 免 JSX；`LocaleProviderProps.children` 是必填字段，children 得放进 props 对象而不是第三参，否则 TS2769）；12 处 `renderHook` 统一加 `{ wrapper }`，六条断言换中文逐字面量（`/failed to fetch/i`、`/0%.*1000%/i`、`/already exists/i` 三条 regex 一并换成整句断言）。`cost_tracking_settings` 两个测试文件把 hook 整体 mock 掉不受影响。验证：cost-tracking 目录 20 文件 222 例全绿加单跑本文件 12 例、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径 hook 2/2、测试 6/6 与 HEAD 逐条同数，prettier 两文件 HEAD 均干净且 `--write` 零改写；9 键 18 侧 `IntlMessageFormat` 实跑（marginExists 带 `{name}` 渲染逐字相等，`0%`/`1000%` 百分号非 ICU 特殊字符），`npm run build` 过。hook 是 `.ts` 不计入非测试 `.tsx` 覆盖率，接入文件持平 686/912。队列新冒出一行 `hooks/cloudzero/useCloudZeroSettings.ts`（5 条）。

## 2026-10-18 第 184 簇更新

继续串行推进，没有派子代理。这一簇是 `guardrails/_components/custom_code/testInputExamples.ts`，自定义代码护栏测试面板的三个示例输入常量。纯判定簇，零接线、零目录改动（覆盖率沿用第 183 簇后口径：非测试 `.tsx` 686/912、75.2%，叶子 10503、同值 138）。扫描器 7 条命中逐条判定：SSN 示例文本、`get_weather` 的工具描述、system/user 消息、旧金山天气响应、`read_wiki_structure` 描述与 "Pre MCP" 名称，全部位于 `TEST_INPUT_EXAMPLES.*.data`，唯一消费方 `CustomCodeModal.tsx` 只取 `.data` 做 `JSON.stringify` 灌进测试输入代码编辑器，属 curl/JSON 样本内容教条不翻（`model: "gpt-4"`、`tool_calls` 的 id 与 arguments 串同理）。三个 `name` 字段没有任何消费方读取（按钮文案走已接线的 `custom.exPre`/`exMcp`/`exPost`），死元数据不接不删。盲区复查过全文件：其余串（"City name"、repoName 描述、`Tool: read_wiki_structure` 文本）同样是样本负载，无 DOM 文案。扫描器对本文件的 7 条登记为不翻。下一簇按队列取 `cost-tracking/_components/use_margin_config.ts`。

## 2026-10-18 第 183 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/mcp_connect.tsx`，MCP 客户端连接页（OpenAI API / LiteLLM 代理 / Cursor / Streamable HTTP 四个页签）。页面主体早已接 `mcpConnect.*`，扫描器 7 条里 5 条是 curl/JSON 示例里的 `Bearer YOUR_LITELLM_*` 占位值（含 `getHeadersConfig` 注入的一处，示例内容既定不翻），真缺口全在盲区：文件自带的 `FeatureCard`/`CodeBlock` 组件把 `title` 当裸字符串 prop 传进 `<h5>`/`<strong>` 渲染，14 个调用点（8 个 FeatureCard 标题、6 个 CodeBlock 标题）全是没接线的英文字面量；另有开关说明 Label、Alert 三行（`Get a specific server:` 等）、OpenAI 密钥引导段（"Get your API key from the" 加外链）、游标与 HTTP 传输两段说明共 5 段裸英文。

按第 177 簇键名化路子把两个组件的 `title` 改成 `titleKey` 联合类型（`FeatureCardTitleKey` 六键、`CodeBlockTitleKey` 三键），标题在组件内 `t(titleKey)` 渲染；`FeatureCard` 里 `title === "Implementation Example" || title === "Configuration"` 的功能比较随之改成键名比较。标题 12 处调用点复用 8 个已铺好的既有键（virtualKeySetup/mcpServerInfo/environmentVariable/serverUrl/apiKeySetup/configuration/universalMcpConnection/headersConfiguration），新开 6 键（叶子 10497 涨到 10503，同值持平 138）：`implementationExample`、带 `<code>` rich 标签的 `limitToolsHint`、`getSpecificServer`/`getMcpGroup`/`mixBoth`、带 `<link>` 标签与 `{platform}` 参数的 `getApiKeyFrom`（消费侧保留原 `<a>` 的 href/target/rel 并把 `openaiPlatform` 作参数传入，外链图标留在处理器内）。游标与传输两段复用逐字同值的 `cursorDesc`/`differentTransports`。Alert 里 `"dev-group"`、`"Server1,dev-group"` 与服务器名示例仍是样本值不翻。

测试零改动：`mcp_connect.test.tsx` 断言的是页签中文名（`LiteLLM 代理`/`Cursor`，既有键）、StepCard 中文标题与 `"x-mcp-servers"` JSON 代码内容，键名化后标题渲染值不变、开关比较逻辑等价，全部照常绿。验证：mcp-servers 目录 41 文件 756 例全绿（2 例预期失败）加 `src/lib/i18n` 4 文件 18 例、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径 7/7 与 HEAD 逐条同数（既有欠账），prettier 先证 HEAD 本就脏（23 脏行）按口径不跑 `--write`，把手工新写的 union 类型、条件块与两个 CodeBlock 调用点逐段换成 prettier 的规范形态，剩余脏行 20 恰为 HEAD 基线减去被本次接线消掉的英文裸串那一处 hunk，其余五个 hunk 与 HEAD 逐条相同；6 键 12 侧 `IntlMessageFormat` 实跑，limitToolsHint 带 code 处理器、getApiKeyFrom 带 link 处理器加 `{platform}` 参数与去标签目标串逐字相等，`npm run build` 过，扫描器本文件只剩 5 条 Bearer 示例既定不翻。接入文件持平 686/912。

## 2026-10-18 第 182 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/chat_ui/A2AMetrics.tsx`，playground 里 A2A 调用的指标条。扫描器 7 条命中全是 `t("a2a.xxx")` 的键引用被词形正则误判成英文句子（接线后同形键变 15 条，仍全为误报），真缺口都在扫描器盲区：触发器上的 `Task:`/`Session:` 短标签、两处 `Click to copy: {id}` tooltip、四处复制按钮的模板串 aria-label（`Copy task ID ${taskId}` 等）、`Details` 折叠按钮。接线八处：新开 5 个 `playground.a2a` 键（taskLabel/sessionLabel/clickToCopy/copyTaskIdAria/copySessionIdAria，叶子 10492 涨到 10497，同值持平 138），aria 两条带 `{id}` 参数、clickToCopy 一条 `{id}` 参数逐侧渲染比对逐字相等；`Details` 复用 `common.details`（本页首个 `commonT`）。`TTFT:` 是专业缩写与 `s` 单位同级不翻，徽标里直接渲染的 `status.state`（completed/working/failed 等）是 A2A 协议 wire 值不翻，时间戳 tooltip 展示原始 `status.timestamp` 属数据值不动。

测试零改动：`ChatMessageBubble.test.tsx` 把 A2AMetrics 整体 mock 成 div，真实文案不进断言。验证：playground 目录加 `src/lib/i18n` 共 29 文件 291 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径 1/1 与 HEAD 同数（既有欠账），prettier 先证 HEAD 干净、`--write` 零改写；5 键 10 侧 `IntlMessageFormat` 带 `{id}` 处理器实跑与去参数目标串逐字相等，`npm run build` 过。扫描器本文件剩 15 条 t() 键引用误报，登记为不翻。接入文件持平 686/912。

## 2026-10-18 第 181 簇更新

继续串行推进，没有派子代理。这一簇是 `src/components/model_info_view.tsx`，模型详情弹层页。扫描器 7 条命中里 4 条是 `console.error` 前缀串（`Failed to fetch guardrails:` 等，目录里躺着同值的 `fetchGuardrailsFailed`/`deleteError` 键但没有任何消费方引用，属早前批次给 console 消息预铺的死键，按教条不接不删）、2 条 SVG path 数据（既定不翻），加上 1 条真文案（`SimpleTooltip` 的 "Only DB models can be edited..."）；同段盲区还有一批两三个词的短文案扫描器抓不到：`Back to Models` 三处、`Public Model Name:`、`Test Connection`、`Update API Key`、`Re-use Credentials`、页签 `Overview`/`Raw JSON`、裸 `<p>Provider</p>`、`Created At`、`Edit Auto Router`、`Edit Settings`、对话框 `Cancel`/`Close`，连同 tooltip 一并接线共 16 处。新开 10 个 modelInfo 键（叶子 10482 涨到 10492，同值持平 138），中文措辞全部对齐既有同概念键：`更新 API 密钥`、`测试连接`、`原始 JSON`、`创建时间`、`编辑设置`、`公共模型名称` 取自其他命名空间同值先例，`返回模型列表` 对齐 `virtualKeys.header.backToKeys` 的构词，`编辑自动路由器` 对齐本页 `deleteAutoRouter`。`Overview`/`Cancel`/`Close` 复用 `common.overview`/`common.cancel`/`common.close`（本页首个 `commonT`），裸 `Provider` 标签复用同命名空间 `provider`。`updateModelCredentials.title` 等跨命名空间同值键按教条不复用。

测试迁移：`model_info_view.test.tsx` 65 处英文选择器换中文正则（`edit settings` 47 处、`raw json` 3 处、`edit auto router` 3 处、`test connection` 4 处等，另两处 getByText 字面量），it 描述照旧保持英文。验证：`model_info_view.test.tsx` 108 例加 models-and-endpoints 两页签目录与 `src/lib/i18n` 共 20 文件 324 例全绿（4 例预期失败）、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 20/20、测试 5/5 与 HEAD 逐条同数（既有欠账），prettier 两文件 HEAD 均干净，`--write` 后复跑仍绿；10 键 20 侧 `IntlMessageFormat` 实跑全过，`npm run build` 过，扫描器本文件只剩 console.error 与 SVG path 既定不翻。接入文件持平 686/912。

## 2026-10-18 第 180 簇更新

继续串行推进，没有派子代理。这一簇是 `agents/_components/agent_config.ts`，模块级智能体表单配置（`AGENT_FORM_CONFIG` 与 `SKILL_FIELD_CONFIG`）。该文件的英文字面量不是就地渲染，而是 `agent_form_fields.tsx` 里 `configText`/`FIELD_TEXT_KEYS` 桥接的查表源串，扫描器 8 条里有 3 条（`phDesc`、`urlTooltip`、`enableTracingTooltip`）此前已铺好映射与中英键、经 basic 面板的 configText 渲染；tracing 段配置没有任何消费方从数据路径渲染到 DOM（`add_agent_form.tsx` 的追踪 UI 直接走 `t()`），判定为已接线。剩下 5 条是真缺口：protocolVersion 的长 tooltip 与 helpText 不在映射表，helpText 消费处还是裸的 `description={field.helpText}`；三个技能占位符（"What this skill does"/"Type a tag and press Enter"/"Type an example and press Enter"）在 `SkillsFieldArray` 里整段裸渲染。新开 5 个 agents 键（叶子 10477 涨到 10482，同值持平 138），`FIELD_TEXT_KEYS` 补 5 条映射，helpText 消费处改成三元桥接，`SkillsFieldArray` 补 `t` 钩子后把五个标签与三个占位符都走 configText（五个标签的映射键早就铺好但消费处一直没接）。跨命名空间有个同值诱惑：`policies.sim.tagsPlaceholder` 的 en 值与 "Type a tag and press Enter" 逐字相同，按同命名空间教条不复用，agents 另开 `skillTagsPlaceholder`。协议选项 "1.0"/"0.3" 与默认值 "1.0.0" 照旧是 wire 值不翻。`dynamic_agent_form_fields.tsx` 与 `agent_info.tsx` 排查过：前者渲染的是服务端下发的凭据字段元数据，后者只取 `field.name` 做脏检查，均不吃这 8 条字面量。

测试迁移：`add_agent_form.integration.test.tsx` 五处断言换中文（技能 ID/技能名称/这个技能的作用/标签/示例）。验证：agents 目录 16 文件加 `src/lib/i18n` 共 19 文件 166 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 1/1、测试 2/2 与 HEAD 逐条同数，prettier 两文件 HEAD 均脏按口径不跑 `--write`，映射表两条超长键手工拆成 prettier 的键值分行形态，脏行数当前与 HEAD 基线逐文件持平（44/44 与 10/10）；5 新键 10 侧 `IntlMessageFormat` 实跑全过（撇号消息按字面渲染），`npm run build` 过。扫描器对本文件仍报 8 条属桥接源串常驻，不视为漏翻。接入文件持平 686/912。

## 2026-10-18 第 179 簇更新

继续串行推进，没有派子代理。这一簇是 `mcp-servers/_components/ToolTestPanel.tsx`，MCP 工具测试面板。该文件主体早已接 `toolTest.*`，扫描器 8 条里 7 条是 SVG path 数据（第 172 簇判定不翻），真文案在扫描器盲区：占位 schema 的 `description: "Input for this tool"` 会流进 ToolArgumentsForm 的输入框 placeholder 与 tooltip（prop.description 优先于 toolArgs 键），新开 `toolTest.inputFieldDescription` 接上，所在 useMemo 依赖补 `t`；"Provider: {server_name}" 行新开 `toolTest.providerLine` 带参；服务器 logo 的 alt 复用同命名空间 `tools.serverLogoAlt`（mcp_tools.tsx 同款接法）；Formatted/JSON 切换按钮接早已铺好的 `toolTest.formatted`/`toolTest.json`（json 中英同值 "JSON" 属格式专名非漏翻）；结果图 alt 借 `toolTest.toolResult`（原 "Tool result" 与键值只差大小写）；关闭按钮 aria-label 走 `common.close`（本页首个 `commonT`）。新开 2 键（叶子 10475 涨到 10477，同值持平 138）。`section.includes("Score:")` 是解析工具输出的功能逻辑，`execCommand failed` throw 与 `console.error` 照旧不翻。

测试零改动：`ToolTestPanel.integration.test.tsx` 的断言全走 toolArgs/common 中文键，与本次接线的 6 处文案不相交。验证：mcp-servers 目录加 `src/lib/i18n` 共 44 文件 772 例全绿（2 例预期失败）再加单跑本文件 24 例、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径 7/7 与 HEAD 逐条同数（既有 any/条件链/setState 欠账），prettier HEAD 本就脏按口径不跑 `--write`，只把手写的超长行按 prettier 形态拆行；2 新键加复用键 6 条 12 侧 `IntlMessageFormat` 实跑逐字相等（`{server}` 渲染），`npm run build` 过，扫描器本文件只剩 SVG path 既定不翻。接入文件持平 686/912。

## 2026-10-18 第 178 簇更新

继续串行推进，没有派子代理。这一簇是 `vector-stores/_components/CreateVectorStore.tsx`，创建向量存储页签（上传文档加 RAG 逐文件 ingest）。扫描器只报 9 条，算上模板字符串与跨行 JSX 实际清了 22 处：两条文件校验 toast 从 `${file.name}` 拼接改成 `{name}` 参数消息，成功 toast `document(s)`/`Vector Store ID: ${id}` 拆成 `{count}`/`{storeId}` 双参（`String(vectorStoreId)` 保住 undefined 时的原渲染），失败 toast 与第 177 簇同法参数化 `{error}`。复用六处逐字同值：`providerRequired`、`indexTooShort`、`nameFieldLabel`/`descriptionShort`/`providerShort` 三个标签、按钮 "Create Vector Store" 借页头标题键 `createTitle`（同页同值，沿第 177 簇 `table.columnId` 跨角色复用判定）；`bucketTooShort` 因 en 值少 "Vector" 前缀不算同值，另开 `vectorBucketTooShort`。新开 16 键（叶子 10459 涨到 10475，同值持平 138），两个示例占位符按第 171 簇教条处理：名称示例只译 `例如：` 保留 "Product Documentation" 等资源名，描述示例整句翻译。`console.error` 与代码注释照旧不翻，页签标签 "Create Vector Store" 硬编码在同页 `index.tsx`（扫描器另有 1 条命中）留给下一簇。

目录插入这次栽在 join 上：16 行键值用 `"\n".join` 拼行忘了行尾逗号，json.loads 在写入前就炸，文件未受影响，补成 `",\n".join` 后 en/zh 各插 16 键逐键读回全过（brace 定位法本身没骗人，收尾 `}` 停在 vertexSearchStep4 后一行）。测试迁移：`CreateVectorStore.test.tsx` 的标题/上传说明/供应商标签与 combobox aria regex、按钮 regex、已上传文档计数共 12 处换中文；characterization 测试的上传断言、按钮 regex 与两个占位符 6 处同步。验证：vector-stores 目录 13 测试文件加 `src/lib/i18n` 共 16 文件 129 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 1/1（既有 complexity 告警）、主测试 10/10、characterization 4/4 与 HEAD 逐条同数，prettier 三文件 HEAD 与当前均干净零改写；16 键 32 侧 `IntlMessageFormat` 实跑渲染与去参数目标串逐字相等，`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 177 簇更新

继续串行推进，没有派子代理。这一簇是 `vector-stores/_components/VectorStoreForm.tsx`，新建向量存储弹窗，本轮第一次吃到 vector-stores 页（该页的 schema、表格列名与说明段在前面的批次已由 `VectorStoresTranslator` 键化，本簇补剩下的字段文案、toast 与四段供应商引导）。模块级常量表 `VECTOR_STORE_ID_PLACEHOLDERS` 等三个常量按第 173 簇键名化路子改成 `VectorStoreIdPlaceholderKey` union 加 `VECTOR_STORE_ID_PLACEHOLDER_KEYS` 映射，`vertex_ai/search_api` 设了引擎 ID 时的特例走三元挑 `idPlaceholderWithEngine`，union 类型让 `t()` 的键参数保持类型安全。文件内自带的 `PasswordInput` forwardRef 组件补了 `useTranslations("vectorStores")`，显隐按钮 aria-label 接 `showPassword`/`hidePassword`；credentialOptions 的 "None" 复用 `noneLabel`；三条 toast 里 `createErrorToast` 与第 176 簇同法把字符串拼接改成 ICU 参数 `{error}`。字段标签六处复用（`providerShort`、嵌套键 `table.columnId` 直接当表单标签、`descriptionShort`、`existingCreds`、`metadataShort`、`engineId`），tooltip 五条与三个按钮链接文案新开；取消按钮走本页 `commonT` 先例的 `common.cancel`。

四段供应商引导（pgVector/valkey/vertexRAG/vertexSearch）共 22 条说明是新开键的大头：引导链接与强调用 `t.rich` 的 `<link>`/`<strong>` 处理器渲染，消费侧保留原 `<a>` 的 href、target、rel 与下划线样式，`vertexSearchStep4` 里 `{engineId}` 参数直接传 `t("engineId")`；`valkeyStep4` 消息含字面 `"text"`/`"embedding"` 字段名，中英两侧原样保留。vertexRAG/vertexSearch 的 Note 行 en 侧带 `- ` 破折连字符，目录照抄不改成中文破折号以外的形态。新开 32 键（叶子 10427 涨到 10459，同值持平 138）。`console.error` 与元数据示例占位符 `'{"key": "value"}'` 照旧不翻。

测试迁移：`VectorStoreForm.test.tsx` 的 `/Vector Store ID/` regex 两处换 `/向量存储 ID/`、"Cancel" 按钮换 "取消"；`VectorStoreForm.integration.test.tsx` 的默认 ID 占位符五处、vertex search 占位符一处（zh 值保留 `my-datastore_1234567890` 与 `"Agent Search"` 专名）、`fromError` 断言一处换中文；`index.test.tsx` 里该组件是 `() => null` mock 不受影响。验证：本目录 13 文件 113 例加 `src/lib/i18n` 全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 1/1、integration 3/3、测试 0/0 与 HEAD 逐条同数（残留都是既有 no-large-inline-object-arg），prettier 先证 HEAD 三文件全干净，组件当前脏 `--write` 后复跑 17 例仍绿；33 键（含 1 条只补逗号的既有键）66 侧 `IntlMessageFormat` 实跑，四条带标签消息带 link/strong/code 处理器渲染与去标签目标串逐字相等，`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 176 簇更新

继续串行推进，没有派子代理。这一簇是 `search-tools/_components/CreateSearchTools.tsx`，新建搜索工具弹窗，第 175 簇 schema 工厂路子在本轮的第二次复用：`createSearchToolShape(t)`/`createSearchToolSchema(t)`，消费方 `useZodForm(useMemo(() => createSearchToolSchema(t), [t]), ...)`。三条校验全键化：`nameRequired`/`providerRequired` 与第 175 簇 en 值逐字相同直接复用，正则消息新开 `namePattern`；`EMPTY_VALUES` 的类型推导随之改成 `z.input<ReturnType<typeof createSearchToolSchema>>`。新开 12 键（叶子 10415 涨到 10427，同值持平 138）：三条 toast（createdToast/createErrorToast/testFieldsRequired，其中 createErrorToast 把原先 `"Error creating search tool: " + error` 的字符串拼接改成 ICU 参数 `{error}`，消费方传 `String(error)`）、三个字段 tooltip（nameHint/providerHint/apiKeyHint）、示例占位符 `createNameExample`（资源名保持英文只译 `例如：`）、`descriptionOptional`/`needHelp`/`testConnection`/`addTool` 四个按钮与链接文案；标签四个复用（searchToolName/providerLabel/apiKeyCol + DialogTitle 既有 addNew），Close 走 `common.close`。Combobox 清除按钮的 "Clear" 是 `ui/combobox.tsx` 里 `aria-label = "Clear"` 的默认形参，属共享基础组件不在本簇接线，测试保持英文断言；`throw new Error("Access Token required")` 是内部异常消息不翻。

目录插入踩了一次锚点坑：searchTools 块的收尾 `}` 与最后一个键同行（第 175 簇插入留下的现状行），按"收尾行上一行"找插入点的行式配方把逗号加到了倒数第二键上产生双逗号、en.json 一度写坏。回滚用 `git checkout --`（当时工作区对 HEAD 的 diff 只有那次坏插入，无其他未提交内容），改用从收尾花括号反向跳过空白定位的写法后两个目录各插 12 键，json.load 与逐键读回全过。

测试迁移：`CreateSearchTools.integration.test.tsx` 的 `/Search Tool Name/` `/API Key/` `/Description/` regex、"添加搜索工具"/"测试连接"按钮名与四条校验/必填消息换中文（sed 首轮把捕获组连同前斜杠一起留下产生 `//` 尾巴，二轮修净后 esbuild 才过）。验证：CreateSearchTools 两测试 + SearchTools 两测试 + `src/lib/i18n` 6 文件 45 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 0/0、integration 0/0、测试 2/2 与 HEAD 逐条同数，prettier 先证 HEAD 三文件全干净，组件与 integration 当前脏 `--write` 后复跑全绿；12 键 24 侧 `IntlMessageFormat` 实跑（createErrorToast 带 `{error}` 渲染、nameHint 的孤立撇号实测按字面处理），`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 175 簇更新

继续串行推进，没有派子代理。这一簇是 `search-tools/_components/SearchTools.tsx`，搜索工具列表页与编辑弹窗。模块级 zod schema 首次在本轮走 `editAutoRouterFormSchema.ts` 的翻译器工厂先例（上游既有文件）：`editSearchToolShape(t)` 返回四个字段、`editSearchToolSchema(t)` 包 `z.object`，消费方 `useZodForm(useMemo(() => editSearchToolSchema(t), [t]), ...)`，两条必填消息（`nameRequired`/`providerRequired`）随语言切换。新开 14 键（叶子 10401 涨到 10415）：五条 toast（deletedToast/deleteError/updatedToast/updateError）、删除弹窗三件套（deleteTitle/deleteConfirm/resourceInfoTitle）、四个表单标签（searchToolName/providerLabel/apiKeyDesc/nameExample）、两条校验。`apiKeyCol`/`descriptionCol`/`providerCol`/`nameCol`/`addNew`/`idLabel` 全部同命名空间复用，取消/确定用 `common.cancel`/`common.ok`（本页第二个 `useTranslations` 钩子取名 `commonT`，沿 `commonT` 先例）。`nameExample` 保持资源名示例英文化，只把 `e.g.,` 换成 `例如：`（第 171 簇示例占位符教条）；`idLabel` 中英同值 "ID"/"ID"（同值 137 涨到 138，非漏翻）。`console.error` 三条照旧不翻。

测试迁移：`SearchTools.integration.test.tsx` 的 `getByLabelText`（搜索工具名称/描述）与 `getByRole("确定")` 共 11 处、必填提示断言 1 处换中文；`SearchTools.test.tsx` 的 `/add new search tool/i` 4 处换 `/新建搜索工具/`，mock 里 DeleteResourceModal 自有的 Confirm Delete/Cancel Delete 按钮不受影响不动。验证：两测试加 `src/lib/i18n` 5 文件 33 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 3 problems 与 HEAD 逐条同数（先挤掉一个本簇自造的 no-large-inline-object-arg 告警，改成具名 shape），两个测试文件两侧均 0；prettier 先证 HEAD：三个 tsx 文件 HEAD 全干净，组件当前脏，`--write` 后复跑测试仍绿，目录两侧 HEAD 本就脏按口径不跑 `--write`；14 键 28 侧 `IntlMessageFormat` 实跑逐字相等（全部无 ICU 特殊字符），`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 174 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/chat_ui/AgentBuilderView.tsx`，智能体构建器整页。`playground.agentBuilder` 目录块在前面的批次已经铺满（61 键、中英逐字对应），这一簇只是把组件里硬编码的文案接上现成键，零新叶：11 条 toast（loadError/createError/updateError/deleteError/nameRequired/savedToast/deletedToast/keyCreated/keyCreatedButNoValue/keyCreateError）、空态与页签（signIn/noAgents/noAgentForChat/noAgentForTest/noAgentForConnect/configureTab/chatTab/testTab/connectTab）、按钮（saveAgent/updateAgent/delete/cancel/testInChat/connectCreateKeyBtn）、两处 aria-label（addAgent/underlyingLlm）、mcpPlaceholder、missingModelId、keyCreationDisabled、connectKeyCreated 全走 `t()`；`experimentalBanner` 改 `<link>` 标签形态走 `t.rich`，`toolsSaved`（带 `{count}` 与 `<code>`）、`connectCreateKeyDesc`、`deleteConfirmBody`（带 `{name}`）同理。

两处目录侧改写：`experimentalBanner` 中英的 `{link}` 参数改成 `<link>product@berri.ai</link>` 标签（实测 intl-messageformat 允许撇号后跟标签，"We'd" 不吃掉尖括号）；`connectCreateKeyDesc` 原值里糊了一段字面 JSX（`'<span className=\"font-mono...\">'{agentName}'</span>'`），改成 `<code>{agentName}</code>`，消费方把 code 处理器指回原来的 `font-mono text-foreground` span。`setDraftSystemPrompt("You are a helpful assistant.")` 是发给模型的提示词种子值，curl 示例与 `product@berri.ai` 邮件地址是上游既有产品内容，`console.error` 三条，照旧不翻；扫描器本文件只剩 329 行这条既定不翻。

测试迁移：`AgentBuilderView.test.tsx` 裸 `renderWithProviders` 走中文目录，登录提示、新建/保存/更新/删除/取消按钮 regex、页签（配置/聊天/批量测试/连接）、删除确认句式、创建密钥按钮与实验横幅共 20+ 处断言换中文，`getByDisplayValue("You are a helpful assistant.")` 与 mock 内部 label（chat scratch/batch scratch）不动；prettier 证 HEAD 干净后对测试文件 `--write`。验证：本测试加 `src/lib/i18n` 4 文件 32 例全绿（missingKeys 与 messagesParity 的标签规则同时过了改写后的两条消息）、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 14 problems、测试 3 problems 与 HEAD 逐条同数，prettier 组件与目录 HEAD 本就脏按口径不跑 `--write`，四条接线消息中英 8 侧 `IntlMessageFormat` 实跑渲染含标签处理器全通过，`npm run build` 过。接入文件持平 686/912。

## 2026-10-18 第 173 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/chat_ui/chatConstants.ts`，语音选择的标签数据文件。模块级常量拿不到 `t()`，按第 169/168 簇的键名化做法：删掉 `OPEN_AI_VOICE_LABELS`，新增 `PlaygroundVoiceMessageKey` 十字面量 union（注释标明在 `playground` 命名空间下解析）与 `OPEN_AI_VOICE_LABEL_KEYS` 映射，`OPEN_AI_VOICE_SELECT_OPTIONS` 改产出 `{ value, labelKey }`；`OPEN_AI_VOICES` 的 wire 值（alloy 等）与 `ENDPOINT_OPTIONS` 的 API 路径照旧不翻。`playground.voices` 新开 10 键（叶子 10391 涨到 10401），zh 侧如 "Alloy - 专业自信"。消费接线两处：`ChatUI.tsx` 的下拉 `items` 与 `SelectItem` 都改 `t(v.labelKey)`；`RealtimePlayground.tsx` 把选中项提成 `selectedVoiceOption` 再渲染 `t(...labelKey)`，`aria-label="Voice"` 复用现成的 `config.voice`（en "Voice"/zh "语音"）。

顺带修掉 `bd3def8d` 那批的遗留账：`realtime.clickConnectDesc` 两条消息都带 `<b>` 标签，组件里却用裸 `t()` 渲染，测试常年往 stderr 喷 FORMATTING_ERROR，改成 `t.rich(..., { b: (chunks) => <strong>{chunks}</strong> })`，与同命名空间 `ChatUI.tsx` 的 `<strong>` 先例一致。

测试迁移：`ChatUI.integration.test.tsx` 语音内容断言换 "Alloy - 专业自信"。验证：RealtimePlayground + ChatUI 集成 2 文件 38 例全绿（改 t.rich 后 RealtimePlayground 单跑 15 例 stderr 噪声归零）、Type Errors no errors，tsc 报的 14 处 RegExp 参数错逐行与 HEAD 相同（既有基线，不在本簇改动行），eslint stdin 口径四个文件与 HEAD 逐条同数（chatConstants 两侧均 0），prettier 先证 HEAD：chatConstants 与集成测试干净且当前保持干净，另两文件 HEAD 本就脏按口径不跑 `--write`；10 条消息 20 侧 `IntlMessageFormat` 解析渲染逐字相等，`npm run build` 过，扫描器本文件只剩 endpoint 路径一条既定不翻。接入文件持平 686/912。

## 2026-10-18 第 172 簇更新

继续串行推进，没有派子代理。这一簇是 `policies/_components/ai_suggestion_modal.tsx`，AI 生成策略模板的建议弹窗。正文四十九条 `policies.ai` 键在前面的批次已接完，扫描器报的 11 条命中里两条是 `console.error`、四条是 SVG path 数据，真文案只剩输入占位符：四条攻击示例（`attackEx1`-`4`）、说明示例 `descEx`、品牌示例 `brandEx`，新开 6 键（叶子 10385 涨到 10391）。SQL 注入示例引号内的 `SELECT * FROM users WHERE 1=1` 是代码，中文侧原样保留只翻 `e.g.`；品牌示例 en 侧是上游的公司名，zh 侧改写为"你的品牌名"，不把具体公司带进目录（第 171 簇"命名示例保持英文"的延长：会进用户输入引导的专名换成通名）。`result.action` 首字母大写、`template.complexity` 徽章与 `suggestion.reason`、流式 `status` 都是后端数据值，照第 160 簇"接口值不翻"。

测试同步：`ai_suggestion_modal.test.tsx` 走裸 `renderWithProviders`（zh 目录），`/Block PII leakage/` 8 处与 `/Ignore all previous instructions/` 1 处占位符正则换成中文。验证：本测试加 `src/lib/i18n` 4 文件 29 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径组件 29 problems（16 errors 13 warnings）与 HEAD 逐条同数（全是历史欠账），测试文件两侧均 0；prettier 组件 34 行、测试 8 行的不合规与 HEAD 完全同量，按口径不跑 `--write`；6 条新消息 12 侧 `IntlMessageFormat` 解析渲染逐字相等，`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 171 簇更新

继续串行推进，没有派子代理。开工前先清队列：扫描器榜首三份都已有定案，`operations.ts` 的 31 条在第 160 簇按"追消费者"判过不翻（29 个工具 title、description 模板、zod 校验句与三条 throw 全不进 DOM），`CodeSnippets.tsx` 的 20 条整文件是拼给用户的 Python 代码串，落在第 158 簇"代码示例不翻"的延长判定里，`editServerPayload.differential.cases.ts` 是测试夹具。本簇落到 `vector-stores/_components/S3VectorsConfig.tsx`，创建向量库弹窗里 s3_vectors 供应商的专页配置。

这个文件四个字段标签、AWS 区域与嵌入模型两条提示、`us-west-2` 占位符与第 146 簇铺好的 `fields.s3Vectors.*` 逐字同值，直接借用；它自己的两条 tooltip（存储桶加"至少 3 个字符、只能小写字母数字连字符和点"、索引加"如填写至少 3 个字符"）与两个占位符（多了 "(min 3 chars)" 尾巴）语义不同，新开 13 个平铺键（叶子 10372 涨到 10385）：`s3Desc`/`s3AutoCreate`/`s3AutoDimensions`/`s3Permissions` 四条说明、`s3LearnMore`（`t.rich` 的 `<link>` 标签包住文档链接，中英文案里"Learn more: "后的空格改由消息自身控制）、`s3BucketTooltip`/`s3IndexTooltip`/`s3BucketPlaceholder`/`s3IndexPlaceholder` 四条字段文案、`bucketTooShort`/`indexTooShort` 两条行内校验、`loadingModels`/`noEmbeddingModels` 两条下拉空态（"Loading models..." 在 models/playground/agents 命名空间有现成同值键，按不跨页借键另开，中文对齐"正在加载模型..."）。`console.error` 与 AWS 文档 URL、`my-vector-bucket` 这类命名示例保持英文。

顺带修掉一处第 146 簇的遗留账：`CreateVectorStore.test.tsx` 的 `getProviderSpecificFields` mock 还返回键名化前的 `label`/`tooltip`/`placeholder` 旧形态，s3 必填校验测试点 Create 时组件里 `t(field.labelKey)` 取到 undefined，常年往 stderr 喷 MISSING_MESSAGE（测试本身不红，所以一直没被发现）。mock 补成 `labelKey` 三键形态后噪声归零，这条路径从此真的过目录解析。

测试迁移：`S3VectorsConfig.test.tsx` 走裸 `renderWithProviders`（zh 目录），4 条标签、3 条说明正则、2 条占位符共 9 处断言换中文，新增链接 role 断言和一条"名称过短显示中文校验"的回归例；`CreateVectorStore.test.tsx` 换 3 条标签断言。验证：vector-stores 四个测试文件加 `src/lib/i18n` 共 7 文件 57 例全绿、Type Errors no errors，tsc 无本簇文件报错，eslint stdin 口径三个改动文件与 HEAD 持平（CreateVectorStore.test.tsx 十条 warning 既有），prettier 先证 HEAD 三文件干净再 `--write` 两个（第三个 unchanged），13 条新消息 26 侧 `IntlMessageFormat` 解析通过、`s3LearnMore` 实跑渲染与目标串逐字相等，`npm run build` 过，扫描器本文件归零。接入文件持平 686/912。

## 2026-10-18 第 170 簇更新

继续串行推进，没有派子代理。这一簇把 `coordination_redis_settings/index.tsx` 整片收尾（扫描器只数到 3 条 toast，但它还有跨行 JSX 文本和按钮三元这类扫描器盲区，实际清了 11 处）：四个区块标题复用 `cacheSettings.sections.connection`/`cluster`/`sentinel`/`ssl`（英文逐字同值，且该文件本已挂 `cacheT`），"Saving..." 复用 `common.saving`（补了 `commonT`），新开 `caching` 四条平铺动作键 `testConnection`/`testing`/`saveChanges`/`unknownError`（目录里 "Save Changes" 与 "Unknown error" 的现成键全在别的页面命名空间，沿用第 169 簇"不跨页借键"的判定）与 `caching.coordination` 下 `intro` 说明段加 `toast.*` 五条，共 10 键（叶子 10362 涨到 10372）。`Connection test failed: {reason}` 两条拼接合并成一条带参消息，兜底 `Unknown error` 传参。至此 coordination Redis 设置整页在扫描器归零。

测试零改动：`index.test.tsx` 与 integration 都包 `LocaleProvider` 走英文目录，10 条 en 值与原文逐字一致（`Connection Settings`→`sections.connection`、`/successful/i`、`/restart/i`、`stringContaining("connection refused")` 全绿）。

验证：caching 加 `src/lib/i18n` 14 文件 124 例绿，tsc 无本簇文件报错，eslint stdin 口径 index.tsx 与 HEAD 同为 1 error（既有），prettier 干净，10 条新消息两侧 `IntlMessageFormat` 解析通过、`testFailed` 实跑渲染 `Connection test failed: boom`，`npm run build` 过。接入文件持平 686/912。协调 Redis 三簇（168 数据文件、169 徽章、170 页面壳）合计把这一页全部接入，新增键 18、其余 38 处复用现成键。

## 2026-10-18 第 169 簇更新

继续串行推进，没有派子代理。这一簇是 `coordinationRedisUtils.ts`，收尾 coordination Redis 设置剩下的来源徽章。`SourceBadgeDescriptor` 的 `label`/`tooltip` 键名化为 `labelKey`/`tooltipKey`，新开 `CoordinationBadgeMessageKey` 八字面量 union（注释标明在 `caching` 命名空间下解析），`caching.coordination` 新增 badge/tooltip 两组共 8 键（叶子 10354 涨到 10362）。目录里另有四处现成的 "Not configured"（adminPanel/agents/cloudZero/secretManager），判定不跨页借用，避免不相干页面互相绑键。`general_settings.coordination_redis` 是配置路径、`REDIS_*` 是环境变量名，句中保留原文。消费接线两处：`index.tsx` 的 `StatusBadge label={t(badge.labelKey)}` 与说明行 `{t(badge.tooltipKey)}`。index.tsx 剩余 3 处命中（加载失败 toast、连接测试与保存按钮、说明段）留给下一簇。

插键又踩一次结构撞名：`text.index('"caching": {')` 命中的是别的命名空间里嵌套的 `caching` 子对象（prompt 缓存页的 `loadFailed`/`rangeNote`），键插进了错误命名空间，`"coordination" not in obj` 和 parse 断言都没拦住，取值才暴露（`coordination` 恰好也没在错的块里，判据只查了新键不存在）。正确锚点是 `\n  "caching": {`（两个空格缩进=顶层），锚点唯一性断言 + 用该块必须已有的旧键（如 `restartNote`）双重确认后再插。错插的 en.json 用 `git restore` 回滚重做，判据补进 WORKFLOW 第二步。

测试迁移：`coordinationRedisUtils.test.ts` 的 sourceBadge 三个 describe 从 `.label` 英文值断言改为 `.labelKey`/`.tooltipKey` 键名断言，fallback 例顺带补了 tooltipKey 等值断言。`index.test.tsx` 不用动：它包 `LocaleProvider` 走英文目录，8 条 en 值与原文逐字一致，徽章文案断言原样绿。

验证：caching 加 `src/lib/i18n` 14 文件 124 例绿，tsc 无本簇文件报错，eslint stdin 口径三个改动文件与 HEAD 逐一持平（index.tsx 那条 error 既有），prettier 三文件干净，8 条新消息两侧 `IntlMessageFormat` 解析通过，`npm run build` 过，扫描器 `coordinationRedisUtils.ts` 归零。接入文件数持平（686/912，utils 是 `.ts` 不计入）。

## 2026-10-18 第 168 簇更新

继续串行推进，没有派子代理。这一簇是 `caching/_components/coordination_redis_settings/coordinationRedisFields.ts`，协调 Redis 设置的数据文件。它的兄弟模块 `cache_settings/cacheSettingsFields.ts` 早已键名化，且两侧字段的英文值几乎逐字相同，本轮新增键只有两个：`cacheSettings.coordination.urlHelp`（优先级说明后缀是"主机、端口、用户名与密码"，与响应缓存侧的"数据库序号"版本语义不同，不能复用）和 `coordination.startupNodesHelp`（示例端口 7001 不带引号，与 `redis_startup_nodes.help` 非严格同值）。其余全部命中现成键：十个字段的 label/help、`redisTypes.*` 三个类型名、`redisTypeDescriptions.*` 三条描述、`rules.portRange`/`validJsonArray`/`jsonArray` 三条校验消息、`secretAlreadySet` 占位符，`startup_nodes` 的 label 直接借用 `fields.redis_startup_nodes.label`（同值）。叶子 10352 涨到 10354，同值持平。

数据文件改法与 cache_settings 对齐：`CoordinationMessageKey` 字面量 union（注释标明全部在 `cacheSettings` 命名空间下解析），`CoordinationField` 的 `label`/`helpText` 换成 `labelKey`/`helpKey`，`CoordinationFieldRule` 返回 `CoordinationMessageKey | null`，两个 LABELS/DESCRIPTIONS 常量改名 `_KEYS`。`SECRET_ALREADY_SET_PLACEHOLDER` 常量删除（导出无消费方），改在 `CoordinationRedisFormField.tsx` 里 `cacheT("secretAlreadySet")`。消费接线三处：FormField 解 label/description/placeholder，TypeSelector 解类型名与描述，`index.tsx` 的 validate 把规则键过 `cacheT` 再进 `form.setError`（与 cache_settings/index.tsx 第 89 行同款）。index.tsx 剩下的三个命中（来源徽章、按钮、toast）与 `coordinationRedisUtils.ts` 的 5 个命中留给后续簇。

ICU 花括号这簇真炸出一次教训：新键 `startupNodesHelp` 内嵌 JSON 示例 `[{"host": ..., "port": 7001}]`，裸花括号 `IntlMessageFormat` 直接 `MALFORMED_ARGUMENT`，而 `messagesParity` 的花括号守卫放过了它（分支体含逗号即视为合法），肉眼看目录根本发现不了。按 WORKFLOW 的 ICU 速查把花括号用 `'{'`/`'}'` 括起来，`intl-messageformat` 实跑渲染回原文。中文侧初版在示例外加的包裹撇号 `'[` 与转义三元组 `'{'` 粘连（`'[{'` 里的 `'` 提前开引号），又炸一次，逐字符重拼后两侧渲染 OK。守卫脚本只能拦"解析失败"，拦不住守卫盲区，凡带字面花括号的新消息必须过真实 parser 的渲染等值断言。

测试迁移：`CoordinationRedisTypeSelector.test.tsx` 从 `COORDINATION_REDIS_TYPE_DESCRIPTIONS` 常量断言改用 `zhCN.cacheSettings` 为根的 `zh(key)` 解析器（沿用第 167 簇 `UnifiedSelector.test.tsx` 先例），标签、描述、下拉选项名五处改读键。`index.test.tsx` 与 integration 测试整体绿不用动：它们包了 `LocaleProvider`，渲染口径是英文目录。

验证：coordination_redis_settings 目录 4 文件 46 例绿，caching 加 `src/lib/i18n` 14 文件 124 例绿，tsc 无本簇文件报错，eslint stdin 口径五个改动文件与 HEAD 逐一持平（index.tsx 那条 error 是 HEAD 既有），prettier 五个文件全干净，两条新消息两侧 `IntlMessageFormat` 渲染等值通过，`npm run build` 过，扫描器 `coordinationRedisFields.ts` 归零。接入文件 685 涨到 686（FormField 新挂 hook）。

## 2026-10-17 第 167 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/compareUI/endpoint_config.ts`，Compare 标签页的端点配置数据文件。`playground.compare.endpoints` 十四项键在目录里早已备好（含 `/a2a (智能体)` 这类路径加词），缺的只是消费侧。改法沿用第 155/156/165 簇的键名化：`EndpointConfig` 的 `label`/`selectorLabel`/`selectorPlaceholder`/`inputPlaceholder`/`loadingMessage`/`validationMessage` 六个字段全部换成 `xxxKey` 字面量 union 字段，`getAvailableEndpoints` 返回 `labelKey`，文案在渲染处解引用。消费方共三个文件五处：`CompareUI.tsx` 的 validation toast、端点下拉（`SelectValue` 与 `SelectItem`）、加载句与输入占位符，`UnifiedSelector.tsx` 的 noun（`t(selectorLabelKey).toLowerCase()`，中文 lowercase 是无操作）与占位符。本轮零新增键，叶子与同值持平。文件头尾的开发文档注释（怎么加新端点）与 `EndpointId` 的路径值是给维护者看的说明和标识符，不翻；`/v1/chat/completions` 本来就是路径。

测试迁移：`endpoint_config.test.ts` 两处（`getAvailableEndpoints` 的期望对象改 `labelKey`、`selectorLabel` "Model" 断言改 `selectorLabelKey` 键名）；`UnifiedSelector.test.tsx` 沿用 `lensData.test.ts` 的目录导入先例，加 `zhCN.playground` 为根的 `zh(key)` 解析器，四处期望值（两个占位符、`正在加载 {noun}...`、`无可用 {noun}`）从配置旧字段改读目录。第一版解析器忘了从 `playground` 命名空间根起算，`compare.endpoints` 取不到，4 例红后修正。

验证：compareUI 目录 6 文件 41 例绿（含 `CompareUI.test.tsx` 未受影响），tsc 该目录零错误，eslint stdin 口径五个文件现版与改前 problem 数逐一持平，`npm run build` 过，扫描器 `endpoint_config.ts` 归零。用户中途要求先提交，代码改动在 `021c323a` 单独成一个 commit，本段文档为收尾提交。CompareUI.tsx 尚余 3 处命中（`compare.errorFetching` 两处未接线、`Upload preview`/`Remove attachment`），留给后续簇。

## 2026-10-17 第 166 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/complianceUI/ComplianceUI.tsx`，playground 页的合规测试标签页。它前几批已接了 `playground.compliance` 的大部分键，本轮补剩下的：CSV 上传校验错误全家（9 处）、快速测试三条系统消息与被两处复用的 `Error: {reason}` 前缀、结果气泡的「已拦截/已放行」徽章、Add 表单与 CSV 面板的两个 Cancel、结果筛选四个枚举、FN/FP 两个 tooltip（头部 chip 和统计条各出现一次）、框架行的 "N prompts" 计数、策略与护栏选择器中间的 or、护栏列头、`(fail or pass)` 提示、结果行折叠展开 aria、护栏 chip 的 Remove aria、自定义提示词的 Delete aria、testButtonLabel 的单复数拼接、自定义与 CSV 两条分类描述，共新增 33 个键（叶子 10319 涨到 10352）。

复用优先。护栏列头命中同命名空间的 `playground.compare.guardrails`（en/zh 值都严格一致），Expect Block/Allow 复用现成的 `compliance.expectBlock`/`expectAllow`，确认添加按钮复用 `compliance.add`，Cancel/Remove/Delete 复用 `common` 三键（组件补了 `useTranslations("common")`）。结果筛选沿用第 165 簇 `STEP_TITLE_KEYS` 的键名化路子，`RESULT_FILTER_KEYS: Record<ResultFilter, 四个字面量 union>` 后 `t(RESULT_FILTER_KEYS[filter])`，同时把按钮上只对英文有意义的 `capitalize` 类去掉了。testButtonLabel 拆成 `testBtn`、`testBtnWith` 加两条 ICU 复数（`testBtnPolicies` 英文 one/other、中文只写 other），parts 之间的 `&` 是符号，留在拼接代码里。

不翻的：CSV 模板里三条英文示例提示词（下载文件内容，列名和 expected_result 取值必须跟解析逻辑一致，扫描器剩的 3 处命中全是它）、导出结果 CSV 的表头与 yes/no、`CSV Upload`/`Uploaded Prompts`/`Custom`/`Custom Prompts` 这类框架与分类名（既是展示词又是折叠态 Set 键和分组键，内置框架名来自定为不碰的数据文件，自定义侧不能单独跑偏）、`FN`/`FP` 指标缩写（同 TPM/RPM 先例）、`prompt`/`expected_result` 等 code 列名、后端拼出来的 `guardrail_name: message`、`litellm_content_filter` 类型标签。

测试：ComplianceUI 没有专属测试文件，`page.test.tsx` 与 `AgentBuilderView.test.tsx` 都把它整体 mock 掉，无需断言迁移，一处没改。

插键脚本又踩一次坑：拿 raw_decode 的收口偏移找插入行时，用了 `}` 之后的换行，31 个键全落到 compliance 块的收口花括号后面、成了 `playground` 顶层键，en.json 当场 JSON 解析失败，`git restore` 回滚重做。正确做法是 `text.rindex("\n", brace_pos, close) + 1` 在收口花括号之前回找行首再插，判据补进 WORKFLOW 第二步。

验证：`messagesParity` 与 `missingKeys` 9 例绿，`page.test.tsx` 加 `AgentBuilderView.test.tsx` 25 例绿，tsc 该文件零错误，eslint stdin 口径现版与 HEAD 同为 20 problems（12 errors 8 warnings）无新欠账，`npm run build` 过，33 条新消息 `IntlMessageFormat` 全解析通过。

## 2026-10-17 第 165 簇更新

继续串行推进，没有派子代理。这一簇是 `agents/_components/add_agent_form.tsx`，新建智能体五步弹窗。它前几批已接了 26 个 `agents` 键，本轮补剩下的：步骤条、四个失败 toast、entitlements 步整段（说明句、两组标签与提示、两组占位符）、治理步的 trace-id 开关两条标签与提示、预算标题与警示句、护栏说明、配置步的 "Not listed?"、GENERIC 徽章、custom 说明、动态凭据区标题与必填校验、密钥管理步的团队选择、推荐徽章、密钥搜索占位符、两个跳过选项、结果页四句、页脚按钮，共新增 47 个键（叶子 10272 涨到 10319）。

复用优先。速率限制四个标签、`accessGroups`、`allowedMcpServers`、`description`、`cancel`、`loadingKeys`、动态必填的 `pleaseEnter`（"请输入{field}"）都命中现成键，一个没新建。页脚返回/下一步复用 `common.back`/`common.next`，箭头符号留在 JSX 里（`← {commonT("back")}`、`{commonT("next")} →`），不必造 "← Back" 这种带箭头的重复键。`Loading keys…`（省略号字符）与既有 `loadingKeys`（"Loading keys..."）只差省略号写法，判定复用后者、统一成三点。`STEP_TITLES` 按第 155/156 簇键名化改成 `STEP_TITLE_KEYS`，union 有限，`StepProgress` 内部自取 `useTranslations("agents")` 后 `t(key)` 类型检查能覆盖。`keyAssignedBody` 是本轮第一个 `t.rich` 消息，`<b>` 在白名单内，formatter 键取标签名 `b`、`alias` 作值传入。

不翻的：`e.g. 25`、`e.g. my-agent-key` 等八个数字/命名格式示例（中英同值，进的是后端字段），`your-agent` 兜底名（参与拼 `${agentName}-key` 发后端），句中的 `x-litellm-trace-id` 是报头名，`agent_type_display_name` 与 `field.label` 是后端数据值，`console.error` 开发日志，选项截断用的 `…`。`GENERIC` 徽章英文原样、中文翻「通用」。

插键脚本又踩一次坑：第 164 簇那版手写花括号深度计数在 `agents` 块上找到的块尾不对，插出来 trailing comma 报错。改用 `json.JSONDecoder().raw_decode(text, brace_pos)` 直接从 `"agents": {` 的 `{` 定位块收口，判据记进 WORKFLOW 第二步。

测试迁移：`add_agent_form.test.tsx` 14 处（按钮名 `Next →`/`Create Agent →`、跳过链接、`Agent logo` 的 alt 三处随 `logoAltAgent` 变「智能体 logo」、字母头像断言从 "A" 改「智」），`add_agent_form.integration.test.tsx` 26 处（`/^Next/` 到 `/^下一步/`、`/Create Agent/` 到 `/创建智能体/`、entitlements 两处标签、TPM/会话 RPM 标签、密钥搜索占位符、结果页两句、`Agent Created!`）。

覆盖率：接入文件持平 685/912、75.1%，消息叶子 10272 涨到 10319（+47），中英同值 137 持平。验证：两份 add_agent_form 测试加 `messagesParity`、`missingKeys` 共 4 份 27 例全绿（首轮 1 红即字母头像那处，改断言后复跑 18 例全绿）；agents 命名空间 448 条字符串消息全部过 `intl-messageformat`，三个带参键（`createAgentFailedReason`、`typeSettings`、`keyAssignedBody`）调用点参数对齐；`tsc` 相关文件 0 错；eslint stdin 形式当前与 HEAD 完全同为 12 项（7 错 5 警，均基线既有）；`npm run build` 通过；扫描器里 `add_agent_form.tsx` 已 0 命中。

## 2026-10-17 第 164 簇更新

继续串行推进，没有派子代理。这一簇是 `skills/_components/add_plugin_form.tsx`，技能注册弹窗。它的字段标签在前几批已经接了 25 个 `skills` 键，本轮补上剩下的：子目录与压缩包摘要两个字段、识别结果行、两条字段禁用说明、七个校验 toast、两个按钮、六条 zod 校验消息，共新增 23 个键（叶子 10249 涨到 10272）。

schema 按第四步改工厂。`addPluginShape` 一度直接内联进 `z.object({...})` 传给工厂，撞上 `local/no-large-inline-object-arg` 告警（HEAD 用拆开的 shape 常量所以没有），恢复成 `buildAddPluginShape(t)` 加 `z.object(buildAddPluginShape(t))` 的两段式。`SUB_PATH_LOCK_REASON` 按第 155/156 簇的键名化改成 `SUB_PATH_LOCK_KEY`，值就是 `skills` 下两个键名，union 有限，`t(SUB_PATH_LOCK_KEY[subPathLock])` 类型检查能覆盖。取消按钮复用 `skills.cancel`（英文原文逐字相同）。

本轮撞了两次目录插键的坑，都值得记。第一次：插入脚本用 `strip() == "}"` 找块尾，结果命中嵌套 `skills.selector` 的收口行，23 个键插进了 selector 里，parse 和键集合断言都过了、取值才暴露（中英两侧一起错所以 parity 抓不住）。改成从 `"skills": {` 起做花括号深度跟踪找块尾，并给原末条补逗号、新末条不带逗号。第二次是第 162 簇记过的锚点问题换了个形态：不是键名撞名，是结构撞名。插完必须做"新键在目标命名空间顶层可见"的取值断言，不能只断言 parse 成功。

不翻的：`PREDEFINED_CATEGORIES` 八个分类值是原样提交后端并进 marketplace.json 的数据值（跟第 159 簇角色枚举同判据）；来源 URL 占位符是两个 URL 示例加 "or"、`my-skill`/`Productivity`/`workflows`/`search, web, api`/`1.0.0`/`author@example.com` 都是格式示例，中英同值；识别结果行里的预览标签（`GitHub repo — …` 等）产自 `claude_code_plugins/helpers.ts`，纯函数没有 hook，要接翻译器得把 `t` 注进 `parseSkillSource` 并波及全部调用方，留给该文件自己那一簇；`console.error` 开发日志。

`add_plugin_form.test.tsx` 迁移 5 处（摘要占位符、子目录标签、按钮名、压缩包禁用说明、zod 摘要消息）。`/GitHub repo/` 这类正则在加前缀后仍命中，未动。

覆盖率：接入文件持平 685/912、75.1%，消息叶子 10249 涨到 10272（+23），中英同值 137 持平。验证：skills 三份测试加 `messagesParity`、`missingKeys` 共 5 份文件 43 例全绿，重构 schema 后复跑 28 例仍全绿且类型检查无错；46 条新消息过 `intl-messageformat`、48 处 `t()` 调用点参数对齐；`tsc` 0 错；eslint 路径形式 0 告警，stdin 形式当前与 HEAD 同为 1 错（该文件名非 PascalCase，基线既有）；`npm run build` 通过。

## 2026-10-17 第 163 簇更新

继续串行推进，没有派子代理。这一簇是 `view_logs/TraceView/TracingSetupCard.tsx`，Lens 调用链页面的接入引导卡。

这一簇工作量比扫描器报的小得多：卡片的界面文案在前几批已经整体键名化（`logs.traceSetup` 五十多个键全接了中文），本轮把 17 处命中逐条判了归属，真正落 DOM 的英文只剩协议行 `OTLP/HTTP, protobuf or JSON (gRPC not supported)`。新增 `traceSetup.protocolValue` 一个键（叶子 10248 涨到 10249），它 `copyable=false`、不进剪贴板，翻成中文没有副作用；端点表测试补了一条该行的断言。

其余命中的判据还是第 160 簇那条"追消费者"，但有一个新场景：`codingAgentPrompt` 是喂给 Claude Code / Codex 这类编码智能体的 prompt，`codingAgentCommand` 是带它的 shell 命令，两块都渲染在复制按钮后面的 `<pre>` 里。DOM 上唯一面向人的那句说明（`codingAgentBody`）已经是中文，指令正文按模型输入处理，不翻。同样不翻的：`tracingEnvSnippet` 的三条 `export OTEL_*` 和端点表里 `Authorization: Bearer <LiteLLM virtual key>`，这些走复制、要逐字进用户的环境配置，中文占位符会被直接粘进去；九个框架的 quickstart 是代码示例；`pip`/`uv`/`npm`、框架 label、`config.yaml` 这类文件名是产品标识；`TRACING_KEY_REQUEST.key_alias: "Agent tracing"` 是发给后端的取值，`tracingKeyBody` 的中文版引用它时保留了英文原字，前一批在这点上已经做对。

覆盖率：接入文件持平 685/912、75.1%（本文件原本已挂 hook），消息叶子 10248 涨到 10249（+1），中英同值 137 持平。验证：TracingSetupCard 测试加 `messagesParity`、`missingKeys` 共 3 份文件 23 例全绿且类型检查无错；`tsc` 对改动文件 0 错；`eslint` 0 错误 / 6 警告（全是该文件既有的 `no-img-element`）；`npm run build` 通过。

## 2026-10-17 第 162 簇更新

继续串行推进，没有派子代理。这一簇是 `playground/components/chat_ui/ChatUI.tsx`，playground 那个两千一百多行的会话组件。

`playground` 新增 18 个键（config 5、chat 13），目录叶子 10230 涨到 10248。全部 MCP 服务器选项与描述、工具集计数、模式子标签都写成带参 ICU（`toolsetToolsCount`、`modeSublabel`），发送前校验的十条 toast、跳转与上传预览的 aria-label、自定义模型选项一并接键。跨命名空间没有去蹭 `models.selector.customOption` 或 `mcpServers.toolTest.executedSuccessfully`，英文原文不同（差个句号），按第二步的规矩各开各的键。

大头其实花在 7 条存量值上。更早的提交（bd3def8d）预置了 `config.{vectorStoreHint,guardrailsHint,policiesHint}` 这批 `{link}.` 尾巴的孤儿键，没有调用方，本轮把它们改成 `<link>here</link>.` 的规范形态接上 `t.rich`，工具集说明对话框的 `toolsets.*` 四条也补了显式的 `<b>`/`<strong>`/`<code>` 标签。`messagesParity` 只认白名单标签名，最初自造的 `<v>` 被拒，换成 `<strong>`，紫色样式留在 JSX formatter 里。这条和脚本插键必须锚整行的坑（`"mcpLabel": "MCP"` 每侧目录出现两次、`guardrailsHint` 跨命名空间同名）都写进了 `WORKFLOW.md`。

顺带修了两处遗留账。图片上传删除按钮的 `aria-label` 原来写成 `` `{t("chat.audioUpload.remove")} ${file.name}` ``，可访问性树里直接显示调用表达式字面量，改成 `t("chat.imageUpload.remove", { name: file.name })`。同一提交还把 7 处注释里的英文单词 Clear 误替换成了 `{t("config.clear")}`，注释不翻，全部恢复上游文本。

不翻的：`console.error` 开发日志与 `"chat.inputPlaceholder.a2a"` 这类键名字符串，这两类之外该文件扫描无残留命中。

`ChatUI.integration.test.tsx` 迁移 4 处断言（模式子标签、输入自定义模型、全部 MCP 服务器、跳到底部）。该文件 HEAD 就带的 10 处类型错误（RegExp 传给 string 型下拉框辅助函数）没动。

eslint 门撞到一个值得记的工具异常：路径形式跑 ChatUI.tsx 报 0 错误 / 19 警告，`--stdin --stdin-filename` 对同一内容跑报 12 错误 / 19 警告（setState-in-effect 4、no-nested-ternary 6、max-lines 1、no-complex-jsx-arrow 1），`--print-config` 确认这些规则该路径就是 severity 2。把 HEAD 内容喂 stdin 同样报 31 条，说明本簇没引入新 lint 债，分歧疑在 flat config 的 glob 匹配撞上 `(dashboard)` 路径段。判法写进了 `WORKFLOW.md` 第六步。

覆盖率：接入文件持平 685/912、75.1%（本文件原本已挂 hook），消息叶子 10230 涨到 10248（+18），中英同值 137 持平。验证：chat_ui 目录加 `messagesParity`、`missingKeys` 共 15 份文件 174 例全绿；两道静态守卫把 25 条新增或改写消息各过一遍 `intl-messageformat`，132 处 `t()` 加 7 处 `t.rich()` 调用点参数与标签逐一对齐；`tsc` 对改动文件除 HEAD 既有错误外无新增；`npm run build` 通过。确认 HEAD 非 prettier-clean，未跑 `--write`。

## 2026-10-17 第 161 簇更新

继续串行推进，没有派子代理。这一簇是 `components/ModelInfoEditForm.tsx`，模型详情页第 160 簇之后剩下的那块编辑/只读混合表单（815 行）。

`models.addModel` 命名空间本簇新增 43 个键，叶子 785 涨到 828。复用压掉了大半工作量：字段标签、PTU 四项、`cancelLabel`/`saveChanges` 等 26 个键目录里已有，`notSet`/`none`/`enabled`/`disabled` 挂 `commonT`，`modelName`/`manual` 直接用了 `models.table` 的现成键，真正新造的只有占位符、校验消息、tooltip 这一批。带范围的校验消息写成 ICU 参数（`ptuCountRange`、`ptuRateRange` 各带 `{max}`），上限值仍由代码里的常量决定。

PTU 字段表延续第 155/156 簇的键名化路子。`PTU_EDIT_FIELDS` 的 `labelKey`/`placeholderKey` 换成两个有限 union（`PtuLabelKey`、`PtuPlaceholderKey`），渲染层 `t(ptuField.labelKey)` 取词。`buildSchema` 原来是模块级函数返回英文 zod 消息，改成工厂接收 `AddModelTranslator`（本地别名 `ReturnType<typeof useTranslations<"models.addModel">>`，比照 `editAutoRouterFormSchema.ts`，没动共享的 `translators.ts` 注册表）。union 有限，所以 tsc 能覆盖动态键的存在性，本簇没有目录侧孤儿方向可漏，不需要像第 159/160 簇那样补守卫测试。

顺带修了两个语义坑：`displayCost` 原来返回 `"Not Set"` 字面量，改成返回 `null` 由渲染层兜底；`ChipList` 自己挂 `useTranslations("common")`。只读值来源那次改动值得记：`textField`/`numberField` 一度改从 `form.formState.defaultValues` 取值，这在保存后是错的（defaultValues 挂载即冻结，父组件保存后更新的是 `localModelData`），新加的回归测试钉住"只读模式显示保存后的值"，并用变异检查验证过该测试在错误实现下会红。这个坑也写进了 `WORKFLOW.md` 第三步。

不翻的：两条 JSON 占位符示例（`{"key": "value"}` 形态）、`input_cost_per_token` 这类字面参数字符串。

`model_info_view.test.tsx` 迁移 44 处计数断言（`/save changes/i` 到 `/保存更改/`、`{ name: "None" }` 到 `{ name: "无" }`、占位符与标签按目录取词、8 处 ICU 校验正则）。父页面按钮（`/edit settings/i` 等）留给 model_info_view 那一簇。

覆盖率：接入文件持平 685/912、75.1%（本簇文件原本就挂了 hook），目录叶子 10187 涨到 10230（+43），中英同值 137 持平。验证：`model_info_view.test.tsx` 加 models-and-endpoints 整页和 i18n 守卫共 19 份文件 313 例全绿（4 例预期失败）且类型检查无错；`tsc -p .` 对改动文件 0 错；`eslint` 0 错误 / 7 警告（与 HEAD 基线同集合，翻译把复杂度从 39 压到 31）；`npm run build` 两次通过。两道静态校验照跑：43 条新消息过 `intl-messageformat`，67 处静态 `t()` 调用点参数名与占位符对齐。中途一个提交前自查发现翻译后的调用点撑破了 prettier printWidth 120 又撞上 eslint `max-lines` 800（只有 `npx eslint` 会报，tsc 和 vitest 都不管），靠去掉 `textField`/`numberField` 重复的 `stored` 参数把代码行从 815 收回 787。

## 2026-10-17 第 160 簇更新

继续串行推进，没有派子代理。这一簇是 `components/liteadmin/`，右下角那个管理员智能体面板，六份源文件加两份测试。

新增 42 条 `liteAdmin` 键：13 条扁平的告警、按钮与提示，加一个 29 键的嵌套 `liteAdmin.operations`，键名逐一对上工具名。

动作卡标题改成目录驱动。`LiteAdminAction.name` 声明成 29 成员的受限 union，渲染层写 `t(\`operations.${entry.action.name}\`)`，于是 `LiteAdminAction.title`与`ActionResult.message` 两个字段一起删掉了，模型看到的 prompt 一个字节没变。模板字面量键只在 union 有限时编译得过，这条已经在第 155-156 簇记过，这次是新场景。

`resolveInferenceTarget` 是纯函数，把返回的英文句子换成键：`InferenceTargetError` 这个 union 就是 `liteAdmin` 下的两个键名，渲染层 `t(target?.error ?? "gatewaySettingsError")` 取词，跟第 156 簇的键名化一致。`runLiteAdmin` 反过来要往 `LiteAdminOptions` 里加 `t`，由 `useLiteAdmin` 注入，因为行动次数超限那句会 reject 成对话区的错误条目。

不翻的：`SYSTEM_PROMPT`、29 个工具 `title`、`description` 模板、两条 zod 校验消息（`Use the key hash…`、`Choose an ordered date range…`）、`Action cancelled. No change was sent.`、`The change could not be verified.…`、`The gateway could not complete this lookup.`、`projectToolResult` 的两条 `notice`、`Gateway action receipt:`、`DOMException("Session changed")`。判据是消费者：前八条只进模型，最后一条被 `useLiteAdmin` 的 catch 吞掉，都不落 DOM。

`LiteAdmin.integration.test.tsx` 又是手写包裹层只包 `LocaleProvider` 不传 `locale`，跟第 159 簇的 `CreateUserButton.test.tsx` 同一个坑，按 `locale="zh-CN"` 钉死后迁移 26 处断言。模型桩回复（`"The team budget is $40."`、`"Widget key"`）是喂给组件的数据，保持英文。新增 `operations.test.ts` 做工具名与 `operations` 键集合的相等断言，孤儿键只有这里能抓到。

覆盖率：文件接入数不变（685/912、75.1%，`LiteAdmin.tsx` 与 `LiteAdminConversation.tsx` 原本已挂 hook，其余是 `.ts`），消息叶子 10145 涨到 10187（+42），中英同值 137 持平。验证：liteadmin 目录加 `messagesParity`、`missingKeys` 共 6 份文件 122 例全绿且类型检查无错，`tsc -p .` 对改动文件无错（仓库裸跑基线还有 1154 行与本轮无关的历史错误），`eslint` 0 错误 / 1 警告（`useLiteAdmin` 的 `useLayoutEffect` 缺 `t` 依赖，HEAD 同一位置缺的是 `toast`，基线既有且同数量），`npm run build` 通过。两道静态校验照跑：42 条中英消息各过一遍 `intl-messageformat`，带参的两条（`messageTooLong`、`eachMessageTooLong`）`{count}` 与调用点对齐。中途 prettier 把这份集成测试整文件重排，是 26 处中文串变长导致的正常换行，先确认该文件在 HEAD 上本就 prettier-clean。

## 2026-10-17 第 159 簇更新

继续串行推进，没有派子代理。这一簇是用户创建这一对按钮：`bulk_create_users_button.tsx`（批量导入，880 行）和 `CreateUserButton.tsx`（邀请单个用户，446 行）。

先记一个扫描器的坑：`bulk_create_users_button.tsx` 只报了 24 条命中，实际该文件有 78 处取词。原因是 `is_english_sentence()` 用停用词表和词数阈值筛候选，单词标签（`Back`、`Email`、`Role`、`Status`、`Next` 这一类）全被滤掉了。所以扫描器的单文件计数只是下界，不能拿它当工作量，也不能拿它当完成判据，收尾还是得整文件过一遍。

`users` 命名空间本簇新增 81 个键，插在该块末尾，`users` 叶子 198 涨到 279。批量那份沿用既有的 `bulk*` 平铺前缀（`bulkCreate`、`bulkEdit`、`bulkInviteUsersButton` 已经在那儿），没有为三步向导另开嵌套子对象，跟目录里现有的形状一致。校验报错、解析结果、汇总计数这些带数字和列表的都写成 ICU 参数（`bulkInvalidFileType` 带 `{name}`、`bulkRowsWithErrors` 带 `{invalid}`/`{total}`、`bulkCreateUsers` 带 `{count}`），不再用模板字面量拼。

复用清单：`users` 侧按值查到 `userEmail`、`infoTeam`、`metadata`、`enterMetadataAsJson`、`userRole`、`createUser`、`inviteUser`、`globalProxyRole`、`allProxyModels`、`noDefaultModels`、`selectModels`、`email`、`status`、`budget`、`infoTeams`、`filterLabels.role`；通用词整把挂 `commonT`，用掉 `back`、`next`、`previous`、`copy`、`remove`、`pending`、`success`、`failed`、`processing` 和 `pagination.pageOf`。`CreateUserButton` 的邮件邀请提示原来是把 `<a>` 硬写在 JSX 里，改成 `t.rich` 配 `link` formatter，链接文字与前后句一起交给消息决定。

不翻的：CSV 列名 `user_email`/`user_role`/`teams`/`max_budget`/`budget_duration`/`models` 是解析器逐字匹配的表头，模板里也只翻列的说明不翻列名；四个角色枚举取值、`all-proxy-models`/`no-default-models` 两个哨兵值、`bulk_users_results.csv` 这个下载文件名、`"userData" + userID` 这个存储键、两条 `console.error`。

ICU 撇号规则这回真用上了：`as a 'user' role` 和 `your users' information` 都不用转义，因为 `'` 只有紧跟 `{`、`}`、`#`、`|`、`<`、`'` 时才开引号。

`CreateUserButton.test.tsx` 踩到一个更值钱的问题。这份文件自带一个手写的 `renderWithProviders`，只包了 `LocaleProvider` 但没传 `locale`，于是按 jsdom 的 `navigator.language`（`en-US`）渲染英文目录。断言换中文后 41 例红了 28 例，一开始看着像改错文案，实际是这份测试从来没测过中文。修的是包裹层，给 `LocaleProvider` 传 `locale="zh-CN"`，跟 `tests/test-utils.tsx` 里钉死的默认测试语言对齐，而不是把断言留回英文。剩下 1 例是 `getByLabelText(/metadata/i)`，英文串埋在正则里，按纯英文串 grep 抓不到，只有跑测试才暴露。这两条都写进了 `WORKFLOW.md` 第五步。

补了两道静态校验，写进 `WORKFLOW.md` 第六步：本批每条中英消息各过一遍 `intl-messageformat` 解析，抓 ICU 语法错，162 条全过；再把组件里 `t("key", { … })` 传的参数名和消息里的 `{arg}`、`<tag>` 逐个对一遍，零不一致。这两道覆盖的是测试没渲染到的键，光靠 vitest 发现不了。

覆盖率：文件接入数不变（685/912、75.1%，两个文件原本都已挂 hook），消息叶子 10064 涨到 10145（+81），中英同值 137 持平。另外把这两个指标的口径固定下来，避免下次再对不上：接入 = 非测试 `.tsx` 文件正文含 `useTranslations` 子串（不是按调用形式匹配）；叶子 = 目录全部叶子，数组值按 1 个叶子计。按这个口径回测 HEAD 得到 685 与 10064，与文档一致。验证：相关 5 份文件 48 例全绿且类型检查无错，`messagesParity` 与 `missingKeys` 通过，`tsc` 对改动文件无错，`eslint` 0 错误 / 7 + 2 警告与基线同数，`npm run build` 通过。

## 2026-10-17 第 158 簇更新

继续串行推进，没有派子代理。这一簇清掉 `public_model_hub.tsx`，公开模型中心整页，1365 行。

这个文件的特别之处是它早早就挂了 `useTranslations("modelHub")`，只是主路径接了、边角没接。`modelHub` 目录里已经有 214 个叶子，`lbl*` / `sec*` / `tab*` 三套命名把详情弹窗需要的标签基本铺好了，所以本簇真正新增的只有 44 条键。改完之后全文件 109 处取词，只有 48 处用新键，其余 61 处直接命中已有键，包括 `notSpecified`、`noCapabilitiesListed`、`searchAgentsPlaceholder` 这种逐字相同的。这也顺带验证了一个判断：先把命名空间铺密，后清的边角就会越来越便宜。

剩下的 44 条集中在几类：页头的关于、常用链接、健康与端点状态和 `Service status: {status}`；三个页签各自的可用 X 标题、搜索标签、占位符与下拉空态；模型详情里的通配符路由说明；智能体详情的文档区与 A2A 示例的两步标题。`serviceStatus` 是模块作用域外的三元表达式，`"I'm alive! ✓"` 与 `"Service unavailable"` 两个值改由翻译器取词再塞进 `{status}` 参数。

通配符路由那段是本簇唯一值得单独记的改写。原来是 `You can pass any value where you see the{" "}<code className="...">*</code> symbol.`，把 `<code>` 拆在 JSX 里手写，两句里同一个 className 重复了三遍。改成 `t.rich` 配 `code: (chunks) => <code className="...">{chunks}</code>`，两句共用一个 formatter，语序交给消息自己决定，中文侧写成"看到 <code>\*</code> 的位置都可以传入任意值"，不必跟着英文的断句走。带值的第二句用 `<code>{modelGroup}</code>` 与 `<code>{example}</code>` 两个同名标签加两个 ICU 参数，`t.rich` 会为每次出现各调一遍 formatter。

扫描器在这个文件报 28 条，实际只有 14 条是文案。其余 14 条里 4 条是 `console.error` 的开发日志，10 条落在 `<pre>` 里：Python A2A 示例代码、FastMCP 示例代码，以及传给 `generateCodeSnippet` 当样例消息的 `"Hello, how are you?"`。代码示例按口径不翻，这条判定对后面几片（`CodeSnippets.tsx`、playground 那几个）同样适用，可以直接少查一半。

另外记一处判断：`Transport:` 这种带冒号的字段标签，`modelHub` 里 `lblTransport` 和 `colTransport` 两种都有，前者带冒号后者不带。筛选区和详情弹窗都该走 `lbl*`，一度新加了 `transportFilterLabel`，回头对上已有键后删掉了。写新键前先按值而不是按键名查一遍目录，能省下一批重复叶子。

覆盖率：文件接入数不变（685/912、75.1%，此文件本来已接入），消息叶子 10020 涨到 10064（+44），中英同值 137 持平。验证：`public_model_hub.test.tsx` 25 例全绿，相关 5 份文件 40 例全绿，`messagesParity` 与 `missingKeys` 9 通过，`tsc` 对该文件无错，`eslint` 0 错误 / 5 警告且与 HEAD 基线同类同数（复杂度 66 未涨），`npm run build` 通过。中途 prettier 报解析错，是脚本把 `>Model Hub</TabsTrigger>` 换成 `{t("tabModels")}</TabsTrigger>` 时吞掉了左尖括号，四处页签同时坏；这次是 prettier 当场拦下的，比第 157 簇靠测试红灯发现更靠前。

## 2026-10-17 第 157 簇更新

继续串行推进，没有派子代理。这一簇是按钮族的头一片：`organisms/create_key_button.tsx`，创建虚拟密钥的整张表单，1877 行。

从密钥归属、密钥详情、可选设置、MCP / 智能体 / 技能 / 日志 / 路由 / 模型别名 / 密钥生命周期一路到高级设置，标签、tooltip、`help`、占位符、校验规则全部接键。`KEY_TYPE_OPTIONS` 是模块级常量拿不到 hook，沿用第 146 簇的写法：常量里存 `labelKey` / `hintKey` 字面量，组件内 `useMemo` 解析。预算、TPM、RPM、TPD 四处"不能超过团队上限"的说明，原来是用模板字面量把 `team?.tpm_limit ?? "unlimited"` 拼在 `help` 里，改成带 ICU 参数的消息 `ct("tpmCeilingHelp", { limit })`，`unlimited` 落到 `common.unlimitedLower`。日志设置的企业版说明和高级设置的文档链接两处要内嵌 `<a>`，用 `ct.rich` 配 `{ link: (chunks) => ... }`。

命名空间的取舍：同一条串只在 `virtualKeys.*` / `common` / `users` / `guardrails` / `policies` / `agents.selector` / `budgetEditors` 这些同域或通用命名空间里已经存在的，一律复用，27 处标签直接走 `t("editForm.*")`。只在 `teams.*`、`projects.*`、`models.addModel.*` 下存在的同款串，本簇另开 `virtualKeys.createForm` 键，不为省一个键把三个模块的目录耦到一起。这笔重复记在收尾的去重待办里，等主路径都接完再统一合并。

两个坑值得单独记。第一个是 JSX 漏花括号：批量脚本把 `label` 写成 `t("x"){" "}`，少了一对花括号，编译与 `tsc` 都不报错，页面直接把 `t("maxBudget")` 当纯文本渲染出来，集成测试一下红了 84 处才暴露。凡是脚本生成 `{t(...)}` 属性或文本节点，务必断言生成的串真的带花括号。第二个是 prettier 会把中英目录砸花：`src/messages/*.json` 不在 `.prettierignore` 里，但它们在当前仓库状态下本来就不是 prettier 排过版的，跑一次每个文件多出约 470 行纯空白改动，把 104 行的真实增量埋进 574 行的假 diff 里。恢复办法是先备份、再 `git show HEAD:./...` 还原、用唯一锚点重放插入，最后断言解析出的 dict 与备份相等。判据用 `git diff -w`。写脚本前先确认目标文件在 HEAD 上是否已经是 prettier-clean：`.tsx` 是，`messages/*.json` 不是。

覆盖率这一簇文件接入数不变（685/912、75.1%，`create_key_button.tsx` 原本已经挂了 hook，只是文案没接），消息叶子 9918 涨到 10020（+102，104 行插入里含两条新增子对象的花括号行），中英同值 137 持平。另外校正一处：老文档记的 681 与 9914 是更早一次快照的口径，用同一份脚本回测 HEAD~1 得到的是 685 与 9918，本簇及以后的差值都以回测基线为准。

验证：`create_key_button.integration.test.tsx` 85 通过 + 1 例预期失败（断言与 `SECTIONS` 正则整套换成中文），加上相关 7 份测试文件 148 通过 + 2 例预期失败，`messagesParity` 与 `missingKeys` 9 通过，`tsc` 无错，`eslint` 0 错误 / 8 警告（与改前基线一致，中途因把 `selectedModels` 这个 `?? []` 表达式塞进 `useMemo` 依赖多加了一条 `react-hooks` 警告，把派生布尔 `allModelsSentinel` 提到外面提出来解决），`npm run build` 通过。扫描器在该文件还剩 15 处命中，全是 `console.error` 的开发日志和 `another_user` 这个内部枚举取值，按口径不翻。

## 2026-10-17 第 155-156 簇更新

继续串行推进，没有派子代理。这一批换了个扫描口径，从"哪些文件没挂 hook"换成"哪些文件里还有整句英文"，于是翻出一批此前不在候选清单里的数据表与配置模块。

第 155 簇 `page_metadata.ts`：40 条页面说明按页面 id 键名化成 `pageMetadata.<页面 id>`，页面 id 本身当键，所以 `pageDescriptions` 的值和键是同一个字符串，不需要并行查表。`getAvailablePages` 改为收翻译器，`PageVisibilitySettings` 挂上 `pageMetadata` 传下去。两条同步测试（菜单页必须有说明、说明不能有孤儿）改用 `createTranslator` 从 `en.json` 构造英文翻译器，语义不变。

第 156 簇 `cacheSettingsFields.ts`：21 个字段按 `fields.<字段名>.label|help` 键名化，另有选项列表、Redis 类型标签与说明、分区标题、五条校验规则各自成键表。一处值得记：`CacheFieldRule` 原本返回英文错误串，键名化后改成返回消息键，校验逻辑因此保持纯函数、不必收翻译器，翻译只在表单层做一次——这比把 `t` 一路传进五条规则函数干净。

这两簇都踩到同一个类型坑：`CacheMessageKey` / `PageDescriptionKey` 最初写成模板字面量类型（`` `cacheSettings.${string}` ``），编译不过 next-intl 的 `NamespacedMessageKeys`。那个类型接受任意字符串，TS 无法证明它落在消息目录的真实键集合里。凡是给翻译器用的键类型，都得列成字面量联合，第 146 簇的 `VectorStoreFieldMessageKey` 已经是这个写法，当时没意识到原因。

覆盖率这两簇持平（非测试 `.tsx` 接入数不变，数据模块本来就不挂 hook）：912 个接入 681 个、74.7%，消息叶子 9807→9914（+107），中英同值 135→137。整包 825 文件 10525 例只剩 3 例已知假失败与时区断言。

## 中心网络层的处置决定

`src/components/networking.tsx` 的四条英文 toast（`Field reset on proxy`、`Pass through endpoint updated successfully`、`Successfully updated value!`、`UI Session Expired. Logging out.`）暂时不动，这是 2026-10-17 与维护者确认过的决定：这个文件是所有数据请求的中心网络层，穿透成本大于收益，改它要连带复核的调用点以百计，而且这四条文案只在操作失败或会话过期的边缘路径上出现，不是日常主路径。其余候选清完后，再回头评估是否值得为这四条文案单独改造，还是继续记账。

顺带把候选清单里剩下的判定为不翻的几类一并定案，避免以后重复排查：`add_model_modes.tsx` 的 `AUTO_ROUTER_MODES` 是无消费者的死代码；`vector_store_providers.tsx` 剩下五处是 `global`/`us`/`eu`/`true`/`false` 这类接口枚举取值；`teamTableColumns` 的 `TPM`/`RPM` 是缩写；`src/app/layout.tsx` 的 `metadata` 是 `export const` 静态元数据，不在 React 树里，`next-intl` 的 hook 取不到；`useUserMcpOAuthFlow`/`useTestMCPConnection`/`useToolsOAuthFlow` 里的 `Promise` 是扫描器把 TypeScript 泛型当成了文案。

## 2026-10-17 第 154 簇更新

继续串行推进，没有派子代理。这一簇把候选清单里剩下的单文件小控件一次清掉。

`CodeBlock.tsx` 新开 `codeBlock`（复制按钮的 aria）；`ModelPricingSummary.tsx` 的两条来源说明接进既有的 `models`（新开 `pricingSummary` 三键），"覆盖哪些字段"那条把字段名列表当 `{fields}` 入参，中文侧的语序"为 {fields} 覆盖模型成本表"写在消息里。`ModelTeamSelect`、`TagSelector`、`VectorStoreSelector`、`KeyProjectField` 四处占位符与字段标签接键，其中 `VectorStoreSelector` 的占位符跟 `SkillSelector`/`SearchToolSelector` 同款，从解构默认值改成 `placeholder ?? t(...)`。

`ExportFormatSelector.tsx` 的 `FORMAT_LABELS` 是模块级 `Record`，改成组件内按 `ExportFormat` 二分支即时取键，模块级只留 `EXPORT_FORMATS` 枚举供下拉遍历。`EntityUsageExportModal.tsx` 的弹窗标题、取消、导出按钮、导出中与两条 toast 全部接键，标题与 toast 复用 `entityNames.<实体>` 填实体名，因此删掉了原来那句 `entityType.charAt(0).toUpperCase()` 的大小写加工。

两个 Deleted 页面的企业版提示合成 `common` 三键（标题共用，正文按 key/team 各一条）。`model_hub` 与 `model_hub_table` 的 `Suspense` 兜底复用既有 `common.loading`。

这一段合计：非测试 `.tsx` 912 接入 669→681（73.4%→74.7%），消息叶子 9787→9807（+20），中英同值 135 持平。候选文件 28→19，其中真剩下的是 `add_model_modes.tsx`（死代码）、`vector_store_providers.tsx`（接口枚举取值）、`teamTableColumns` 的 `TPM`/`RPM`（缩写）、`layout.tsx`（静态元数据）四类判定为不翻的，以及 `useUserMcpOAuthFlow`/`useTestMCPConnection`/`useToolsOAuthFlow` 三份 hook 里被扫描器误判的 `Promise` 泛型。

`VectorStoreSelector.test.tsx` 与 `ModelPricingSummary.test.tsx` 两份用裸 `render` 渲染已接线组件，整包复跑才暴露；`MakeMCPPublicForm.test.tsx` 的复制按钮与 `model_info_view.test.tsx` 的团队占位符是本簇引入的同批修掉。

## 2026-10-17 第 153 簇更新

继续串行推进，没有派子代理。这一簇清掉告警动态表单、导航条、Lens 页、MCP OAuth 回调页与一处排序字段表。

`alerting/dynamic_form.tsx`：新开 `alerting` 三键（存于数据库、来自配置、更新设置）。`✨ Enterprise Feature` 这枚徽标在 `settings.tsx` 里还有第二份，两处合成 `common.enterpriseFeatureBadge` 一键；逐字段的重置可访问名（`Reset {field}`）同理进 `common`，因为它拼的是后端下发的字段名，命名空间无关。

`navbar.tsx`：品牌图的 alt、月亮图标的 title 与文档区 `<nav>` 的可访问名接进既有 `navbar`（第 147 簇开的）。

`lens/page.tsx`：页签文案复用既有 `lens.traces`/`lens.investigations`，页签组的可访问名与管理员提示新开 `lens.page`。

`keyTableColumns.tsx`：`SPEND_BUDGET_SORT_FIELDS` 是模块级常量，拿不到 hook，改成 `getSpendBudgetSortFields(t)` 即时生成；模块级只保留 id 数组供 `KEY_TABLE_SORT_FIELDS` 展开，标签复用既有 `virtualKeys.columns.spend`/`budget`。`teamTableColumns` 里 `TPM`/`RPM` 是缩写，按口径不翻。

`mcp/oauth/callback/page.tsx`：新开 `mcpServers.oauthCallback` 四键。`Suspense` 的 fallback 是独立子树，翻译器要在外层组件挂一次。

`src/app/layout.tsx` 的 `metadata.title`/`description` 留着没动：那是 `export const` 静态元数据，不在 React 树里，`next-intl` 的 hook 取不到，且它只影响浏览器标签页标题。

这一段合计：非测试 `.tsx` 912 接入 665→669（72.9%→73.4%），消息叶子 9771→9787（+16），中英同值 132→135（`oauthCallback.title` 的 `LiteLLM MCP OAuth`、`lens.page.title` 的 `Lens`、`common.notSet` 的三处历史键对）。候选文件 39→28。

## 2026-10-17 第 152 簇更新

继续串行推进，没有派子代理。这一簇清掉候选清单里的三个多选器、两个导出组件与表格勾选列。

`SkillSelector.tsx` 与 `SearchToolSelector.tsx`：占位符原来是解构默认值里的英文（`placeholder = "Select skills (optional)"`），改成把 `placeholder` 留成可选 prop、组件内 `placeholder ?? t("placeholder")` 解析。这样调用方显式传值时不白翻译，也不用把默认值挂在消息里。`SkillSelector` 的空态与加载文案复用既有 `skills.loadingSkills`/`skills.noSkills`（同一命名空间挂第二把 `skillsT`）；`SearchToolSelector` 的两条搜索工具专有文案新开 `searchTools.selector`。`SkillSelector` 里 `private` 出现两次（可访问名与徽标），合成一键。

`AgentSelector.tsx`：接 `agents.selector`，顺带把 `MultiSelect` 的 `emptyText="No agents found"` 也接了键——它原本没进扫描器（属性值赋给了组件 prop，`label` 模式只匹配 `label:`/`label=`）。

`ExportTypeSelector.tsx`：新开 `entityUsageExport`。六个实体名单独成 `entityNames` 子表，八个标题/说明按整句取键、实体名走 `{entity}` 入参。中文侧把"按{entity}逐日拆分"这种语序写进消息，实体名只管填，这样 `{entity}` 是"团队"还是"Key 归属者"都不会破坏语序。

`DataTableSelectionColumn.tsx`：新开 `dataTableSelection`。`meta.title` 与逐行 `rowAriaLabel` 都是模块级工厂产物拿不到 hook，改为 `SelectionColumnOptions` 新收一个 `title`、逐行标签由调用方给，两个调用方（`UsersTableColumns`、`HealthChecksTableColumns`）各挂一把 `dataTableSelection` 翻译器并通过 deps 传下去。`SelectionTranslator` 从 `DataTableSelectionColumn` 导出、`index.ts` 再导出，调用方只 import 类型不引运行时值。

这一段合计：非测试 `.tsx` 912 接入 658→665（72.1%→72.9%），消息叶子 9736→9771（+35），中英同值 131→132（`entityNames` 里六个英文实体名，中文侧译成"用户/团队/标签/组织/客户/Agent"）。候选文件 42→39 上下。

整包（`src/components` + `src/app`，825 文件 10525 例）只剩 5 例红灯：`add_auto_router_tab`、`KeyActivityPanel` 两例仍是已知的并发假失败（单跑全绿），`LensSetup` 一例仍是 `Asia/Shanghai` 时区断言，另两例是本簇引入的 `create_key_button` 私有技能可访问名断言，同批修掉。

## 2026-10-17 第 151 簇更新

继续串行推进，没有派子代理。这一簇清掉候选清单里四个共享组件。

`DataTableSortHeader.tsx`：新开 `dataTableSortHeader` 八键。多字段合并表头的菜单项是"`{字段}` 升序/降序"，这类"调用方已翻好的标签 + 方向词"拼出来的句子必须按字段名取整句消息，不能只翻方向词再拼；连接词 `or` 也接键，中文侧是"或"，`/` 分隔符同样接键。菜单里的 `Reset` 复用既有 `common.reset`。

`check_openapi_schema.tsx`：新开 `checkOpenapiSchema`，把 14 条字段帮助文案键名化成 `help.<字段名>`，类型默认帮助（文本/数值/整数/布尔）合并进同一张键名表，运行时按 `Object.keys` 建的 `Set` 判定字段名是否在表内，避免 `as const` 与 `Record` 双写。这个文件的四条 JSON 示例搬进消息目录后立刻撞上 `messagesParity` 的花括号守卫（原文在 TSX 里不受约束），按既有规矩给示例花括号加单引号。

`AgentIdentityDetails.tsx`：新开 `agents.identity` 15 键。执行状态复用 `common.enabled`/`common.disabled`，认证结论三条按分支取整句消息而不是翻片段，`Execution`/`Mode` 那行连中间的 `·` 一起进消息，避免中文侧标点错位。

`APIReferenceView.tsx`：标题与说明两键接进既有的 `apiReference`。

`DataTableSortHeader.test.tsx` 用裸 `render` 渲染已接线组件，换 `renderWithProviders`。`DataTable.test.tsx` 里多字段表头的字段标签是测试自己硬写的英文 `Spend`/`Budget`，菜单项因此渲染成"Spend 升序"这种混合，断言按实际渲染改。

顺带修好三份与本簇无关的过时英文断言：`BudgetTable.test.tsx` 的 `Copy ID`、`AllModelsTable.test.tsx` 的列菜单按钮、`ChatUI.integration.test.tsx` 的模拟失败与流式响应两处。

这一段合计：非测试 `.tsx` 912 接入 654→658（71.7%→72.1%），消息叶子 9683→9736（+53），中英同值 130→131（`fieldSeparator` 的 `/`，中文侧保留同样的分隔符）。候选文件 46→42。`src/app` 整包 4405 例只剩 `LensSetup` 那两例已知的时区假失败。

## 2026-10-17 第 149-150 簇更新

继续串行推进，没有派子代理。这一批把范围从 `src/components` 换到 `src/app`。

第 149 簇表格列定义与小控件（九个文件）：`AgentsTableColumns` 的 JWT 徽标接 `agents.jwtConfigured`，行操作的删除项复用既有 `agents.deleteButton`；`PluginTableColumns` 的未分类、复制技能 ID、无描述、无版本四处新键，触发器与删除项复用既有 `skills.openActions`/`skills.deleteButton`，是否徽标走 `common.yes`/`common.no`；`MemoryTableColumns` 的查看/编辑/删除全走 `common`，触发器新开 `memory.openActions`，两个调用方补挂 `common` 翻译器；`EndpointUsageTable` 新开 `usage.endpointUsage` 八键；`ModelViewToggle` 的选项从英文 `label` 改存受限 union 的键名；`DocLink` 新开 `apiReference` 三键；`CoordinationRedisTypeSelector` 复用既有 `caching.redisType`。`ProjectsTableColumns` 扫出来的 "ID" 是误报，那个文件的文案早已全部接键。

第 150 簇 `chat/page.tsx` + `TopModelView.tsx` + `OnboardingLoadingView.tsx`：`chat.page` 新开 13 键。四条建议词从模块级英文数组改成受限 union 的键名，建议词的标签与拼进输入框的前缀都用同一个翻译结果，这样中文用户点"写作"拿到的是中文前缀而不是标签中文、提示词英文；`getGreeting` 改成收翻译器的纯函数，顺带给拉模型列表那个 effect 补上 `t` 依赖（eslint 的 exhaustive-deps 报的）。`usage.topModelView` 新开 9 键。`OnboardingLoadingView` 复用既有 `onboarding.loadingInvitation`。

这一段合计：非测试 `.tsx` 912 接入 647→654（70.9%→71.7%），目录叶子 9650→9683（+33），中英同值 130 持平。候选文件 56→46。

这一段修掉一处此前一直没人注意的隐藏失败：`src/app/chat/page.integration.test.tsx` 里有六处 `chatUi` 标签断言（`Total: 20`、`Total Latency: 1.20s`、`In: 12`、`Out: 8`、`Cost: $0.000063`）还写着英文，`git stash` 对照确认它在本次改动之前就已经在挂，只是每次都被同文件里更早的失败盖住。教训是"同一份测试文件里有多个失败"时，先把整份文件里所有英文断言一次性比对完再跑，否则会一个一个冒出来。

`src/app` 剩余候选里最大的是 `MCPStandardsSettings.tsx`（14 处），但它的键名 `mcpStandards.*` 第 141 簇已就位、目录里既没有该命名空间也没有组件消费，属于已知的"键先行、组件未接线"状态，动它之前得先确认 `MCPServerSelector` 那次的接线是否漏了。`networking.tsx` 仍单独记账。

## 2026-10-17 第 147-148 簇更新

继续串行推进，没有派子代理。

第 147 簇 `Navbar/` 六个文件：新开 `navbar` 命名空间并按组件分子对象（viewSwitcher、docsLink、community、notifications、blog、worker）。`ViewSwitcher` 的 AI Gateway 复用既有 `nav.aiGateway` 而不是新开同值键。`CommunityEngagementButtons` 的链接表改存受限 union 的键名，GitHub 的标签与提示文案逐字相同因此共用一键。`DocsLink`、`NotificationsBell`、`BlogDropdown`、`WorkerDropdown` 的文案全部接键。`ViewSwitcher`、`DocsLink`、`WorkerDropdown` 三份测试原本用裸 `render`，换 `renderWithProviders` 后要重新核一遍断言。

第 148 簇横幅一族（`LicenseExpiryBanner`、`UpgradeBanner`、`DeprecationBanner`、`DebugWarningBanner`、`UserBanner`、`BetaBadge`、`cost_optimization_feedback_banner`）：新开 `banners` 命名空间，同样按组件分子对象。`LicenseExpiryBanner` 原本把 `describeCountdown` 返回的英文倒计时片段拼进英文句子，翻译时不能只翻片段，改成按 tier 与天数取整句消息（`expiredOn`/`expiresToday`/`expiresInDays` 三键）。`UpgradeBanner` 的 `describeRelease` 改为收翻译器，三段复数、连接词与分隔符各自接键（`and` 与 `listSeparator` 两键让中文能用"，"而不是硬编码英文逗号加空格）。`DeprecationBanner` 与 `DebugWarningBanner` 的正文走 `t.rich`。

这一段合计：非测试 `.tsx` 912 接入 634→647（69.5%→70.9%），目录叶子 9604→9650（+46），中英同值 128→130（`Beta` 徽标两条）。候选文件 69→56。

这一段还顺带修好第 132 簇起的六处遗留账：`DataTableToolbar.test.tsx`、`DataTableFilterDrawer.test.tsx`、`AgentSelector.test.tsx`、`TagSelector.test.tsx`、`GuardrailSelector.test.tsx`、`cost_optimization_feedback_banner.test.tsx` 六份测试用裸 `render` 渲染已接线组件，整包复跑才暴露出来；`add_pass_through.integration.test.tsx` 与 `AvailableTeamsPanel.test.tsx` 的过时断言同一批修掉。

## 2026-10-17 第 145-146 簇更新

继续串行推进，没有派子代理。这一批清掉了候选清单里最大的两个文件。

第 145 簇 `callback_info_helpers.tsx` + `team/LoggingSettings.tsx`：17 条回调描述接进既有 `loggingCallbacks` 命名空间，键名直接用回调的 `id`，`CallbackConfig` 去掉 `description` 字段、`id` 收窄成 `CallbackId` 联合类型，因此不需要并行查表。`callbackInfo` 是按 displayName 建的索引，tooltip 处改用 `callbackInfo[name]?.id` 再交给翻译器解析。

第 146 簇 `vector_store_providers.tsx`：`vectorStores` 新增 `fields.<provider>.<field>` 三段式 90 键，覆盖 8 个供应商 31 个字段的标签、说明与占位符。`VectorStoreFieldConfig` 改为存 `labelKey`/`tooltipKey`/`placeholderKey`，用 `VectorStoreFieldMessageKey` 联合类型钉住键名。`VectorStoreForm` 的 zod `shape` 与 `superRefine` 改成收翻译器的工厂，两条必填文案按 select/input 分成两个键（不做 select）。消费者 `CreateVectorStore.tsx` 三处接键。供应商的枚举取值（`global`/`us`/`eu`、`false`/`true`）保持英文，它们是接口值。这一簇顺带修好了两处旧账：`index.test.tsx` 因第 137 簇的索引说明走 `t.rich` 而过期的三处断言，以及 `VectorStoreForm.integration.test.tsx` 的占位符与必填文案断言。

这两个文件原本合计 79 处候选英文，现在只剩 `vector_store_providers.tsx` 的 5 处接口枚举取值（属数据，按口径不翻）。

这一段合计：非测试 `.tsx` 912 接入 634 持平（两个文件都不新挂 hook，接键的是它们已有的消费者与数据模块），目录叶子 9492→9604（+112），中英同值 106→128（+22，全是格式示例占位符）。候选文件 70→69。

## 2026-10-17 第 140-144 簇更新

继续串行推进，没有派子代理。这一批把候选清单里的一批选择器与单文件弹窗收掉了，也核实了两个误报。

第 140 簇 `ModelSelect/ModelSelect.tsx`：新开 `modelSelect` 9 键。`MODEL_SENTINEL_OPTIONS` 从英文 `label` 改存键名，`DefaultUserSettingsForm` 的只读摘要改用 `modelSelect` 翻译器即时解析（原来是模块级 Map，拿不到 hook）；通配符分组的 `All {provider} models` 走带参模板，provider 名是派生数据。这一簇的教训是改共享组件的导出形状前先查消费者：`create_key_button.integration.test.tsx` 里的 `All Proxy Models` 来自 `create_key_button.tsx` 自己那份硬编码（该文件尚未接线），不是本组件的导出，改断言前先看渲染链路。

第 141 簇 `mcp_server_management/MCPServerSelector.tsx`：接进既有 `mcpServers` 的新 `selector` 子对象 8 键。三个来源（访问组、服务器、工具集）的 description、两个哨兵选项与其说明、占位符与空态全部接键。

第 142 簇 `model_add/CredentialsTableColumns.tsx` + `CredentialsTable.tsx` + `CredentialModal.tsx`：新开 `credentials` 18 键，列工厂收 `t`/`commonT`，编辑、删除、操作列复用 `common`，供应商选择与取消也复用 `common`。

第 143 簇 `model_dashboard/ModelSettingsModal/ModelSettingsModal.tsx`：新开 `modelSettings` 7 键。`Store Model in DB` 的字段说明按"接口值优先、本地兜底接键"只给兜底那半边接键；保存失败的 toast 前缀接键，后端错误详情仍拼在后面。

第 144 簇 `TeamsPage/teamTableColumns.tsx` 行操作菜单残留：编辑/复制 ID/删除三个菜单项接进既有 `teams` 的 `listEditTeam`/`listCopyTeamId`/`listDeleteTeam`。

两个核实为误报的候选：`add_model_modes.tsx` 的 `AUTO_ROUTER_MODES` 是无消费者的死代码，`TEST_MODES` 本就已用 `labelKey`；`mcp-servers/_components/MCPStandardsSettings.tsx` 的 `mcpStandards.*` 键名已就位但目录里没有该命名空间，且当前没有任何组件消费它，只有自己的测试在用。

这一段合计：非测试 `.tsx` 912 接入 629→634（69.0%→69.5%），目录叶子 9447→9492（+45），中英同值 106 不变。候选文件 76→70。

## 2026-10-17 第 137-139 簇更新

继续串行推进，没有派子代理。

第 137 簇 `vector-stores/_components/` 的 `DocumentsTableColumns.tsx` 与 `IndexesTab.tsx`：接进既有 `vectorStores`，9 键。文档状态徽标从 `{ tone, label }` 常量表改成 `STATUS_LABEL_KEYS`（键名）+ `STATUS_TONES`（色调）两张表，未知状态回落到后端原始值；说明段落走 `t.rich`，`docsLink` 与 `issueLink` 两个标签各自指向不同地址，因此 `messagesParity` 的富文本标签白名单补了 `docslink`/`issuelink`，闭合检查改成大小写不敏感（原文是 `body.includes("</" + tag + ">")`，混排大小写的标签会被误报未闭合）。

第 138 簇 `usage/_components/components/UsageViewSelect/UsageViewSelect.tsx`：接进既有 `usage` 的新 `viewSelect` 子对象，21 键。`OPTIONS` 选项表从英文 `label`/`description` 改存受限 union 的键名，管理员与非管理员两套文案用 `nonAdminLabelKey`/`nonAdminDescriptionKey` 表达；`title`/`description` 默认参数改为渲染处 `?? t(...)` 兜底。

第 139 簇两张列定义表的残留：`ToolPoliciesTableColumns.tsx` 的四处 `meta.title`（skeleton 与隐藏列用的可访问名，此前只翻了 `header`）与新键 `colUserTooltip`；`TeamsPage/teamTableColumns.tsx` 的 `Unlimited` 与 `fallback="Never"`，列工厂 deps 补 `commonT`。

这一段合计：非测试 `.tsx` 912 接入 627→629（68.8%→69.0%），目录叶子 9416→9447（+31），中英同值 106 不变。候选文件 80→76（含 `MCPStandardsSettings.tsx` 这种"键名已就位但目录还没有对应命名空间、且当前无组件消费"的误报，以及 `callback_info_helpers.tsx` 这类数据表）。

## 2026-10-17 第 132-136 簇更新

继续串行推进，同样没有派子代理。这一批把候选清单里剩下的几个中等体量文件收掉了。

第 132 簇 `update_model_credentials_modal.tsx` 与 `shared/DataTable/DataTableToolbar.tsx` + `DataTableViewOptions.tsx`：新开 `updateModelCredentials` 9 键、`dataTableToolbar` 6 键、`dataTableViewOptions` 1 键。工具栏的 `searchPlaceholder` 默认值从参数默认改成函数体内 `?? t("searchPlaceholder")`（默认参数在 hook 之前求值，不能调 hook）；`DataTableViewOptions` 的 `label` 默认值同样改成 `label ?? t("view")`。工具栏是全仓共享组件，`TeamsTable`、`TeamInfo`、`RequestLogsPanel` 三份测试里按英文按钮名查询的断言跟着改成中文，`VirtualKeysTable.test.tsx` 那份自己 mock 了 `next-intl`（回退返回键名），所以它的 `openFilters` helper 保持不动。zod 校验的 `api_key` 必填文案按约定改成收翻译器的 `updateCredentialsSchema(t)` 工厂。

第 133 簇四张列定义表：`SearchToolTableColumns.tsx`（接进既有 `searchTools`，16 键）、`IndexesTableColumns.tsx`（接进既有 `vectorStores.table`，6 键）、`DeletedKeysTableColumns.tsx` 与 `DeletedTeamsTableColumns.tsx`（各新开一个命名空间，15 + 14 键）。后三张原本零参，改成首参收 translator；`SearchToolRowActions` 从模块常量改为由父级把 `t` 传下去。`translators.ts` 补了 `DeletedKeysTableTranslator`、`DeletedTeamsTableTranslator` 两个类型。这一簇顺手修了 `TeamInfo.test.tsx` 两处早已过期的断言：对象权限卡的 tooltip（`inheritedGrants.grantedViaGroup`）与护栏设置的标题（`guardrailSettingsView.title`），都是前面簇翻译组件时没同步测试留下的，属于存量红灯不是本批引入。

第 134 簇 `email_settings.tsx` 与 `email_events/email_event_settings.tsx`：新开 `emailSettings` 17 键、`emailEventSettings` 9 键。`FIELD_HELP` 从模块级常量改成 `buildFieldHelp(t, required)` 工厂，必填标记 `Required *` 单独成键、两侧的空格留在 JSX 里，保证英文渲染逐字一致；`getEventDescription` 从组件内函数提升为模块级 `(event, t)`，兜底模板 `Receive an email notification when {words}` 里的 `{words}` 仍是后端事件名拆出来的英文，属"后端原始值不翻"的口径。

第 135 簇 `per_user_usage.tsx` 与 `view_user_spend.tsx`：新开 `perUserUsage` 22 键、`viewUserSpend` 4 键。直方图的六个分桶标签原来是对象字面量的键，改成计算属性 `[t("cat1to9")]`，逻辑不变；`usersCount` 用 ICU plural，照抄 `roiCalculator.prCount` 的写法（数字放在 plural 外面的 `{count}`，分支里只放量词），`usersFormatter` 的正则断言从 `/ users$/` 改成 `/个用户$/`。未识别的 user agent 回退复用 `common.unknown`。

第 136 簇 `hooks/useMcpOAuthFlow.tsx`：新开 `mcpOauthFlow` 11 键。hook 体内直接挂 `useTranslations`，`startOAuthFlow`、`resumeOAuthFlow` 两个 `useCallback` 的依赖补上 `t`；抛出的 `new Error(...)` 文案一并接键，因为这些串最终经 `extractErrorMessage` 进 toast，是用户可见的。单测 `renderHook` 加了 `LocaleProvider` 包装。

这一段合计：非测试 `.tsx` 912 接入 617→627（67.7%→68.8%），目录叶子 9284→9416（+132），中英同值 106 不变。候选文件 80 个（本批重跑了启发式扫描，脚本与上一批略有出入，85→80 的差值不能按文件逐个对账；其余 14 个本批接完的文件已从清单里消失）。

## 2026-10-17 第 126-131 簇更新

继续串行推进，同样没有派子代理。

第 126 簇 `logging_settings_view.tsx`：新开 `loggingSettingsView` 8 键。

第 127 簇 `mcp_tools/MCPToolArgumentsForm.tsx`：新开 `mcpToolArgs` 17 键。这个文件的校验层全是模块级纯函数（`jsonErrorFor`、`collectErrors`、`buildResolver`），按约定逐个加翻译器首参；`STRING_SCHEMA_MESSAGES` 与 `BOOLEAN_ITEMS` 从常量改成 `stringSchemaMessages(t)`、`booleanItems(t)` 工厂。

第 128 簇 `shared/advanced_date_picker.tsx`：新开 `advancedDatePicker` 22 键。相对时间选项数组原本拿 `shortLabel`（`today`/`7d`/`MTD`）同时当选中态标识和展示文案，改成 `id`（标识）+ `labelKey` + `badgeKey` 三个字段；`label` 变成可选入参，缺省时回落到目录里的 `defaultLabel`。

第 129 簇 `PassThroughSettings/`：接进既有 `models.passThrough` 的新 `table` 子对象，21 键。列工厂同时要 `common.edit`/`common.delete`/`common.yes`/`common.no`，所以 deps 上并列传了 `t`（`models.passThrough.table`）和 `commonT`（`common`）两个翻译器。

第 130 簇 `vector-stores/_components/`：接进既有 `vectorStores` 的新 `table` 子对象，18 键。同上并列传 `t`/`tableT`/`commonT`。

第 131 簇一批小组件：`UIAccessControlForm.tsx`（13 键）、`EnvCredentialLoginWarningBanner.tsx`、`NoRedisWarningBanner.tsx`、`SidebarUsageCard.tsx`、`onboarding_link.tsx`（改名 `onboardingModal`，与已有的 `onboarding.*` 命名空间区分）、`query_param_input.tsx`，合计约 45 键。`uiAccessControlSchema` 改成收翻译器的工厂，`type UIAccessControlFormValues = z.output<ReturnType<typeof uiAccessControlSchema>>`。

这一段合计：非测试 `.tsx` 912 接入 601→617（65.9%→67.7%），目录叶子 9128→9284（+156），中英同值 105→106。候选文件 85 个。

## 2026-10-16 第 119-126 簇更新

继续串行推进，同样没有派子代理。

第 119 簇 `playground/components/chat_ui/AdditionalModelSettings.tsx`：接进既有 `playground` 命名空间下的 `additionalSettings` 子对象，19 键。三个 tooltip 的正文（流式响应、温度、最大令牌数）都是跨行的 JSX 文本，收拢成单个键。

第 120 簇 `claude_code_plugins/`：`skill_detail.tsx` 与 `MakeSkillPublicForm.tsx`，新开 `claudeCodePlugins` 23 键。

第 121 簇 `agents/_components/AgentIdentityFields.tsx`：新开 `agentIdentity` 33 键。三个选项数组（身份提供商、执行模式、执行开关）从 `label` 改成 `labelKey` 加 `as const`，这样 `t(option.labelKey)` 的键是字面量联合而不是 `string`，否则 `npm run build` 会报 `TS2345: Argument of type 'string' is not assignable to parameter of type 'NamespacedMessageKeys<...>'`。这两个子组件（`ResourcesCell` 式的内联渲染、`AgentFormField` 的包装）都需要在 props 上带 `t`。

第 122 簇 `mcp_tools/ByokCredentialModal.tsx`：新开 `byokModal` 14 键。`byokSaveErrorMessage` 是模块级函数，按约定首参收翻译器。

第 123 簇 `model-insights/_components/ModelInsightsView.tsx`：新开 `modelInsights` 25 键。`METRIC_LABELS` 与 `GRANULARITY_LABELS` 从英文串映射改成 i18n key 映射。删掉 `METRIC_LABELS` 后忘了还有两处 JSX 在用它，运行时整个组件抛错、日志里只剩一句 "An error occurred in the <ModelInsightsView> component"，很难定位；`grep METRIC_LABELS` 才发现第 307 行还留着引用。

第 124 簇 `GuardrailSettingsView.tsx`：新开 `guardrailSettingsView` 8 键。

第 125 簇 `TeamsPage/teamTableColumns.tsx`：这个文件之前已经接过翻译，列工厂本来就把 `t` 作为入参，但 `meta.title`、`sr-only` 的表头、资源单元格里的 `label` 与复制提示仍是英文字面量，属于上一批的漏网。补进既有 `teams.table`：`created`、`actions`、`openRowActions`、`keys`、`teamIdCopied`。两个内联子组件（`ResourcesCell`、`TeamRowActions`）按 props 传 `t`。

这一段合计：非测试 `.tsx` 912 接入 593→601（65.0%→65.9%），目录叶子 9008→9128（+120），中英同值 103→105。

## 2026-10-16 第 111-117 簇更新

这一段是串行推进的一批，全部由主会话亲手做，没有再派子代理（子代理在第 93-109 簇那轮撞上模型限速全部失败）。工作树里那批限速的 worktree 已不再使用。

第 111 簇 `components/settings.tsx`：设置页里的日志回调选择器与六个告警页签，新开顶层 `settings` 命名空间 14 键。`CallbackSelector` 的 `required: "Please select a callback"` 是 react-hook-form 的校验规则文案，一并接键。

第 112 簇 `components/model_info_view.tsx`：模型信息详情视图，新开 `modelInfo` 命名空间 46 键。删除确认弹窗的 `Are you sure you want to delete this {kind}?` 按约定把 `auto-router`/`model` 作为 `{kind}` 参数传入而不是 select。`Failed to fetch guardrails:` 这类只在 `console.error` 里、从不进 UI 的串保持英文。

第 113 簇 `components/liteadmin/`：`LiteAdmin.tsx`、`LiteAdminConversation.tsx` 与 `useLiteAdmin.ts` 三个文件，新开 `liteAdmin` 命名空间。`ACTION_STATUS` 从英文串映射改成 i18n key 映射。`useLiteAdmin` 是 hook，直接在函数体内挂 `useTranslations`，模块顶部的 `INTERRUPTED_WRITE` 常量因此删掉。这一簇踩到一个测试陷阱：`LiteAdmin.integration.test.tsx` 自己搭了一棵 `<LocaleProvider>`（不带 `locale` prop，跟随浏览器语言即英文）而不是用 `renderWithProviders`，所以它整份测试都跑在英文下，断言必须保持英文。第一版把断言换成中文后 17 例全红，`git checkout` 撤销测试文件才对。

第 114 簇 `components/model_group_alias_settings.tsx`：新开 `modelGroupAlias` 16 键，说明段落里的 `'gpt-4o'` 是 HTML 实体 `&apos;`，键里保留同样的实体写法以保证英文渲染逐字一致。

第 115 簇 `components/cloudzero_export_modal.tsx`：新开 `cloudZeroExport` 22 键。提交按钮的文案随所选目标在 "Export to CloudZero" 与 "Export CSV" 之间切换，与目标类型切换里的同名选项撞名，故提交按钮单独用 `exportCsvBtn`，否则 `getByRole("button", { name })` 会命中两个元素。

第 116 簇 `components/SCIM.tsx`：新开 `scim` 11 键。创建失败提示 `Failed to create SCIM token: ` 是前缀，`parseErrorMessage(error)` 拼在后面，键只存前缀。

`components/networking.tsx`（14 处）这一段没做：它是全仓的中心网络层，函数被几十个调用方直接调用，把翻译器逐层穿透进去的改动面远大于收益，且其中大部分串是 `console.error`。记在剩余清单里，等有专门的接口层重构时一起处理。

本段合计：非测试 `.tsx` 912 接入 585→593（64.1%→65.0%），目录叶子 8879→9008（+129），中英同值 102→103。

## 2026-10-16 第 93-109 簇更新

这一段是一轮并行推进，簇的编号沿用顺序，其中第 96 到 101 簇在各自 worktree 完成后再三方合并回 `main`。并行带来两个必须记住的坑：`en.json`/`zh-CN.json` 的合并冲突用脚本做递归三方并集解决（每个 worktree 只在自己的命名空间末尾追加，键集互不相交），`translators.ts` 与其他共享文件的冲突手工解。

第 93 簇 `components/shared/table_cells/`：10 个共享单元格渲染器里只有 5 个含面向用户的文案（`AutoRouterTag`、`UserPopoverCell`、`id_cell`、`models_cell`、`spend_budget_cell`）。新开顶层 `tableCells` 12 键。`date_cell` 的月份数组、`cell_tooltip`/`identity_cell`/`status_badge` 是数据格式化或纯透传，没有可译文案，保持未挂 hook。`id_cell` 的 `copyLabel` 默认值从解构默认值改成 `copyLabel ?? t("copyId")`，`UserPopoverCell` 改为传 `t("copyField", { label })`。消费者 `OrganizationsTable`、`TeamsTable`、`AccessGroupBudgetsPanel` 的 `+N more`/`of $X`/`· Unlimited` 断言同步换中文。

第 94 簇共享下拉选择组件（`MultiSelect`、`PaginatedMultiSelect`、`PaginatedSearchSelect`、`SearchSelect`、`numerical_input`）：这些是通用组件，默认值文案按既有约定落 `common` 而非特性命名空间，新增 `common.selectOptions`、`commonOptionsFound` 等 9 键。`MultiSelect` 的 `Loading...` 复用既有 `common.loading`（逐字相同），`Paginated*` 的 `Loading…` 是省略号字符，与 `common.loading` 不同值，另开 `common.loadingEllipsis`。三态省略号与句点混用时必须逐字区分，这是第 94 簇最容易出错的地方。`numerical_input.tsx` 原本没有 `"use client"`，加 hook 前先补上。消费者 `ComplexityRouterConfig`、`add_auto_router_tab`、`edit_auto_router` 的 `Create "..."` 断言换中文。

第 95 簇 `chat_ui/`（`ResponseMetrics`、`MCPEventsDisplay`）：新开 `chatUi` 26 键。`ResponseMetrics` 里 `RESPONSE_CACHE_TOOLTIP` 从模块常量改成 `ResponseCacheIndicator` 组件内取键；`PROMPT_CACHE_READ_TOOLTIP`/`PROMPT_CACHE_CREATION_TOOLTIP` 来自 `@/utils/promptCacheUsage`，属另一个模块的文案，本簇只译本文件内的标签，这两条 tooltip 暂留英文。

第 96 簇若干共享展示组件（`CreatedKeyDisplay`、`SummaryCard`、`PageHeader`、`InheritedBudgetHint`、图表 `area_chart`/`bar_chart` 的空态）：新开 `createdKeyDisplay` 与 `sharedComponents` 两个命名空间。`CreatedKeyDisplay` 的内联加粗长句走 `t.rich` 的 `b` 渲染器。图表空态复用既有 `common.noDataShort`，不新建同值键。`InheritedBudgetHint` 的 `scope`（Team/Organization/User）是面向用户的词，各开一个键，`formatGate` 按约定把条件后缀作为 `{suffix}` 参数传入而不用 select。顺带发现 `activity_metrics`、`KeyModelUsageView`、`KeyActivityPanel` 等用裸 `render` 的图表消费者测试，一并换成 `renderWithProviders`。

第 97 簇 `app/(dashboard)/lens/_components/`：13 个组件加 `lensData.ts`，新开 `lens` 命名空间。`lensData.ts` 的纯函数（`scopeLabel`、`normalizeFilters`、`lensStatus`、`analysisProgress`、`durationLabel`、`nextCheckStatus` 等）按"非组件模块"约定改成首参收翻译器。`LensWelcome` 与 `WorkerSetup` 同时渲染 `Connect worker` 与 `Connect a worker` 两个不同串，故拆成两键。`LensSetup.integration.test.tsx` 那条时区日期断言是上游既有，未动。

第 98 簇 `app/(dashboard)/roi-calculator/_components/`：新开 `roiCalculator` 138 键，是本轮最大的一块。`chartConfig` 从模块常量改成组件内基于 `t` 构建；`effortNote`/`coverageLabel`/`estimateLabel` 改成收 `t`。用裸占位符加复数词而不是 `#` 格式化，否则 `1000` 会被渲染成 `1,000`（`#` 会按 locale 加千分位）。`peopleCsv` 的 CSV 表头与 `formatMoney`/`formatNumber` 的 `en-US` 固定格式属数据与格式化，不是文案，保持原样，中文句里会出现 `$0.01` 这类串是预期。

第 99 簇 `components/routing_groups/`：5 个组件外加 `strategy.ts`、`routingGroupPayload.ts`、`modelOwnership.ts` 三个纯逻辑模块，新开 `routingGroups` 60 键。三个纯逻辑的首参从原参数列表首位插入 `t`，各自单测改用 `createTranslator` 注入翻译器。删除确认与用量面板的富文本走 `t.rich` 的 `strong`。策略标签 `formatStrategyLabel` 与校验文案同属面向用户的展示串，一并接入。

第 100 簇 `components/key_team_helpers/` 的 5 个预算编辑器：新开 `budgetEditors` 55 键。`BUDGET_WINDOW_OPTIONS` 与 `MODEL_BUDGET_PERIOD_OPTIONS` 从 `label/resetHint` 改成 `labelKey/resetKey`，与 `DefaultUserSettingsForm` 的既有约定一致。`EndUserBudgetSelect` 的 aria 复用 `virtualKeys.editForm.defaultCustomerBudget`。连带更新了 `Teams`、`TeamInfo`、`key_edit_view`、`create_key_button`、`user_edit_view`、`user_info_view` 六个消费者测试的英文断言。

第 101 簇 `RegenerateKeyModal` 与 `LoggingCallbacks` 设置：新开 `regenerateKey` 与 `loggingCallbacks`。`LoggingCallbacksTableColumns` 的列工厂把模块顶层的 `CALLBACK_MODE_LABELS` 移进工厂并接收 `t`/`tCommon`，`useMemo` 依赖同步加。`RegenerateKeyModal` 的 zod 改成 `buildSchema(t)`，过期后缀按约定作为 `{expiredSuffix}` 参数传入。弹窗右上角 X 的 `sr-only` 文案在共享 `ui/dialog.tsx` 里，超出本簇范围，保持英文，故"点击 X 关闭"的断言仍用 `Close`。

第 102 簇 `app/onboarding/`：`onboarding` 命名空间早已存在但没被使用（`OnboardingFormBody`、`OnboardingErrorView` 仍是字面量），本簇把组件挂上并复用既有键，只新增 `onboarding.passwordRequired` 一条给 zod。`page.tsx` 的 Suspense 兜底复用 `common.loading`。`OnboardingLoadingView` 只有一条技术性 `aria-label="loading"`，按既有约定保持英文不接键。

第 103 簇 `activity_metrics.tsx` 与图表图例：新开 `activityMetrics` 31 键与 `chartLabels` 10 键。`shared/charts` 的 `formatCategoryName` 是从 dataKey 机械派生的（`metrics.spend` → `Spend`），直接接翻译会破坏所有未知 key 的兜底；做法是新增 `useCategoryName` hook，按已知 dataKey 查 `chartLabels`，未知 key 仍走 `formatCategoryName` 的机械转换，英文因此逐字不变。`chartLabels.avgResponseTimeMs` 的中文特意写成"平均响应时间 (ms)"而不是与卡片标题同名的"平均响应时间"，否则测试里两处断言无法区分。

第 104 簇 `UsagePage` 的 `KeyActivityPanel`、`KeyModelUsageView`、`EntityUsage/TopKeyView`：新开 `usageKeyActivity`、`keyModelUsage`、`topKeyView` 三个命名空间。`keyCountText` 是模块级纯函数，改成首参收翻译器；为绕开 `max-params` 的 4 参上限，把四个布尔与数值打包成一个 `KeyCountInput` 对象。

第 105 簇 `PublicModelHubTableColumns.tsx`：表头在既有 `modelHub` 命名空间下补 15 个 `col*` 键，三个列工厂各加一个 `t` 形参。测试里的 `PublicMcpTestTable` 用 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "modelHub" })` 注入，而不是裸 `render`——列工厂是普通函数拿不到 hook。

第 106 簇 `components/model_dashboard/`：表头与弹窗文案补进既有 `models.health` 命名空间。`HealthChecksTableColumns` 里的 `NEVER_CHECKED`/`CHECK_IN_PROGRESS`/`NEVER_SUCCEEDED`/`NONE` 是后端下发的原始值、排序比较按字符串逐字匹配，因此这四个常量保持英文不翻译，只有渲染时才用 `t(...)`；把它们翻译会让 `HealthChecksTable.test.tsx` 的排序断言在 `zh-CN` 下直接失效。

第 107 簇账户菜单（`UserDropdown`、`SidebarAccountMenu`）：新开 `accountMenus` 23 键。触发按钮的 `aria-label` 是模板串，改为带 `{role}`/`{identity}` 的键，角色缺失时用同命名空间的 `unknownRole` 兜底。

第 108 簇 `ToolPolicies/` 与 `ToolDetail.tsx`：新开 `toolPolicies` 50 键。`PolicySelect` 的选项原本 `label` 就是 `value`（`untrusted`/`trusted`/`blocked`），改成 `labelKey` 并在组件内取键，同时给 `SelectTrigger` 加 `data-policy={value}`。这一步不只是为了翻译：原测试用 `(cell.textContent ?? "").replace(/[^a-z]/gi, "")` 剥掉标点与圆点来读策略值，是拿英文 label 当数据在用；标签一翻译这条正则就废了，改成读 `data-policy` 后断言与语言彻底解耦。`needsReviewBody` 用 ICU plural 处理 `{count, plural, ...}`。

第 109 簇 `organization/org-create` 与 `org-settings` 两个表单：在既有 `organizations` 命名空间下补 `orgForm` 21 键。预算重置周期沿用 `DefaultUserSettingsForm` 已有的 `labelKey` 约定，两个表单共用同一份 `BUDGET_DURATION_OPTIONS`。顺带修好 `OrganizationFilters.test.tsx` 的 3 例存量红灯。

本轮合计：非测试 `.tsx` 912 接入 518→585（56.8%→64.1%），目录叶子 7975→8879（+904），中英同值 98→102。

## 2026-10-16 第 92 簇更新

批次 24 第 92 簇：`components/common_components/Filters/`，组织列表页复用的筛选控件家族（`FilterInput`/`FiltersButton`/`ResetFiltersButton`）。只有 `FiltersButton` 的默认 `Filters` 与 `ResetFiltersButton` 的默认 `Reset Filters` 是硬编码文案，二者只被 `OrganizationFilters.tsx` 消费且都没传 `label`，故这两条是页面上真实可见的英文残留。7 文件 +37/−28（`en.json` +2/−0、`zh-CN.json` +2/−0、`FiltersButton.tsx` +6/−5、`ResetFiltersButton.tsx` +4/−2、两个组件测试 +17/−13、`OrganizationsPanel.test.tsx` +3/−3）

- `FilterInput` 的占位符来自调用方 `placeholder` 入参，属组装值不接键，故它保持未挂 hook；本簇只接 `FiltersButton` 与 `ResetFiltersButton`
- 默认值文案放 `common` 而非某个特性命名空间：这两个是通用组件，默认 `label` 是组件的兜底文案。`common` 原有 `filter`（`Filter`，单数）但无 `Filters`（复数），按"英文原文有差异就分开"新增 `common.filters`（`Filters`）与 `common.resetFilters`（`Reset Filters`）；中文分别为"筛选""重置筛选"
- 组件侧把解构默认值改成 `label ?? t("filters")`（原 `label = "Filters"`）：`label` 保持可选，未传时回退到目录，传了则原样用调用方的串（测试里的 `Advanced Filters`/`Clear All` 仍为英文）
- 测试：两个组件测试从裸 `render` 换成 `renderWithProviders`（`src/components/common_components/Filters/` 是四级目录，相对路径 `../../../../tests/test-utils`），默认标签断言换中文；消费者 `OrganizationsPanel.test.tsx` 的两处 `getByRole("button", { name: "Filters" })`/`"Reset Filters"` 同步换 `筛选`/`重置筛选`；共 38 例通过（`Filters/` 4 文件含未改的 `FilterInput.test.tsx`）
- `OrganizationsPanel.test.tsx` 的 import 里 `render` 是存量未用导入（HEAD 单跑即报 `unused-imports/no-unused-imports` 错误、未进 `eslint-suppressions.json`），本簇动了该文件就顺手删去；`FiltersButton.test.tsx` 的 4 条 `no-container`/`no-node-access` warning 与 HEAD 逐条一致（同样两处 `container` 查询）
- 验证：定向 `Filters/`、`src/lib/i18n` 与消费者 `OrganizationsPanel.test.tsx` 共 6 文件 38 例通过；`tsc --noEmit` 非测试文件 0 错、与第 91 簇一样基线存量错不净增；eslint 改动源码零告警、测试仅 4 条既有 warning；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 516→518（56.6%→56.8%，`FiltersButton.tsx`/`ResetFiltersButton.tsx` 各新挂 `useTranslations`）；目录叶子 7973→7975（+2）；中英同值 98 不变（两条新键中英皆不同值）

## 2026-10-16 第 91 簇更新

批次 24 第 91 簇：`components/CloudZeroCostTracking/`，CloudZero 成本追踪集成（空态占位、创建/编辑弹窗、配置卡与试运行/导出/删除流程，外加密钥显隐控件；`cloudZeroPayload.ts` 与 `types.ts` 纯逻辑无文案未改）。覆盖 13 个 `.tsx`（6 组件 + 7 测试）加 `translators.ts` 与两侧目录，共 16 文件 +262/−221（`en.json` +45/−0、`zh-CN.json` +45/−0、`CloudZeroIntegrationSettings.tsx` +38/−30、`CloudZeroCreateModal.tsx` +22/−17、`CloudZeroUpdateModal.tsx` +22/−17、`translators.ts` +5/−0、其余组件与测试随行）

- 新开顶层命名空间 `cloudZero` 45 键，全为净新：空态三段（标题/正文/按钮）、创建与编辑弹窗的标题/标签/占位/提示与 zod 文案、密钥显隐按钮的两条 aria、配置卡的标题与四行详情、试运行与导出的按钮与告警、导出确认与删除确认的标题正文、集成详情标题，以及六条 toast。目录叶子 7928→7973（+45），中英同值 97→98（+1：`timezonePlaceholder` 为 `UTC`，属示例值）
- 跨命名空间复用 `common.*`：`Cancel`→`common.cancel`、`Create`→`common.create`、`Update`→`common.update`、`Delete`→`common.delete`、`Edit`→`common.edit`、`Export`→`common.export`、`Actions`→`common.actions`、状态回退 `Active`→`common.active`；各文件按需再挂一把 `useTranslations("common")`（第 86 簇 `SEVERITY_LABELS`、第 88 簇的必要同值键同理，能复用就不新开同值键）。`CloudZero` 是 product 名不翻译
- 两个模块级 zod schema 改成工厂：`buildCreateSchema(t)`/`buildUpdateSchema(t)`，入参类型用新加的 `CloudZeroTranslator`（`translators.ts` 里的具体类型，非裸 `ReturnType`），组件内 `useZodForm(buildCreateSchema(t), …)` 现调
- `CloudZeroFormControls.tsx` 的 `CloudZeroApiKeyInput` 是 `React.forwardRef`，其渲染体即组件体，在自身挂 `useTranslations("cloudZero")` 取显隐 aria；`CloudZeroIntegrationSettings.tsx` 的模块级无参 `NotConfigured` 同理在自身挂 hook（第 87-90 簇"组件挂 hook 合法、纯函数才走首参约定"）
- 加载失败前缀 `Error loading CloudZero settings:` 与错误消息是两段 JSX 文本，键只存前缀，渲染写 `{t("loadError")} {message}` 保留原有一个空格；试运行输出 `Simulation output for connection: {connection_id}` 改带参键，`connection_id` 兜底 `?? ""` 与原 JSX 渲染 null 等价
- 测试：5 个单测从裸 `render` 换成 `renderWithProviders`（含原本自带 `LocaleProvider` 的 `CloudZeroIntegrationSettings.test.tsx`，一并去掉自建 `QueryClientProvider`），断言按 `cloudZero` 目录换中文；2 个集成测试同步换 provider，按钮名 `创建`/`更新`、zod 文案 `请输入你的 CloudZero API 密钥`/`请输入你的 CloudZero 连接 ID` 随目录；7 文件 33 例通过，例数未增删。`getByLabelText` 用精确串（`CloudZero API 密钥`/`连接 ID`/`时区`）避开子串碰撞
- 验证：定向 `CloudZeroCostTracking/` 与 `src/lib/i18n` 共 10 文件 33 例通过；消费者 `settings.test.tsx` 与 `UsagePageView.test.tsx` 共 65 例通过（二者都以 mock 替换该组件，无英文字面量断言）；`tsc --noEmit` 与 `git stash` 基线对照均为 880 错（几乎全在存量测试文件，本簇未净增，非测试文件 0 错）；eslint 改动文件零告警；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 510→516（55.9%→56.6%，6 个组件各新挂 `useTranslations`）；目录叶子 7928→7973（+45）；中英同值 97→98

## 2026-10-16 第 90 簇更新

批次 24 第 90 簇：`components/Settings/AdminSettings/MCPToolSearchSettings/MCPToolSearchSettings.tsx`，MCP 服务器页里"原生 MCP 工具搜索"的设置面板（嵌入模型、Top K、相似度阈值与核心工具四组旋钮），收口后 `Settings/AdminSettings/` 家族只剩已接入的目录。4 文件 +53/−29（`en.json` +22/−0、`zh-CN.json` +22/−0、组件 +21/−29、测试 +10/−9）

- `adminPanel.mcpToolSearch` 20 键，全为净新：登录提示、加载失败标题、说明标题与正文、`Ranking`/`Core Tools` 两张卡片标题、四个字段的标签与提示、模型下拉三态文案、保存按钮与更新成功 toast；目录叶子 7908→7928（+20），中英同值 97 不变
- `toolSearchForm.ts` 是纯逻辑（`parseCoreTools`/`clampTopK`/`storedValuesToForm`/`formToPayload`）无用户可见文案，未改动，故本簇只动一个组件
- 说明正文含 `<code>mcp_tool_search</code>`，走 `t.rich` 的 `code` 渲染器；正文里的 `"FX"` 与 `"foreign exchange rates"` 是直引号（JSX 里原为 `&quot;`），在 ICU 中非特殊字符，经 `intl-messageformat` 实跑确认英文逐字还原
- 单测从裸 `render` 换成 `renderWithProviders`（`/top k results/i`→`/Top K 结果数/i`、`/always returned first/i`→`/始终优先返回/`、`/save settings/i`→`/保存设置/`、`/please log in/i`→`/请登录/`，`Database not connected` 属数据保留）；例数 8 未增删
- 验证：定向 `MCPToolSearchSettings/` 与 `src/lib/i18n` 共 5 文件 24 例通过；消费者 `mcp_servers.test.tsx` 与 `MCPToolSearchSettings.test.tsx` 共 33 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 改动文件零告警；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 509→510（55.9%，`MCPToolSearchSettings.tsx` 新挂 `useTranslations`）；目录叶子 7908→7928（+20）；中英同值 97 不变

## 2026-10-16 第 89 簇更新

批次 24 第 89 簇：`components/Settings/AdminSettings/MCPSemanticFilterSettings/`，MCP 服务器页里"语义工具过滤"的三处（设置组件、测试面板、测试工具函数），是本家族里唯一多文件且有非组件模块的一簇。8 文件 +241/−159（`en.json` +54/−0、`zh-CN.json` +54/−0、`MCPSemanticFilterSettings.tsx` +36/−25、`MCPSemanticFilterSettings.test.tsx` +24/−23、`MCPSemanticFilterTestPanel.tsx` +33/−22、`MCPSemanticFilterTestPanel.test.tsx` +41/−36、`semanticFilterTestUtils.ts` +8/−5、`semanticFilterTestUtils.test.ts` +11/−6）

- `adminPanel.mcpSemanticFilter` 46 键，按 `settings`（21）/`testPanel`（21）/`toast`（4）三段：设置区覆盖登录提示、加载与更新失败标题、保存成功标题、说明正文、`Configuration` 卡片、四个字段的标签与提示、模型下拉三态文案、保存按钮与更新成功 toast；测试面板覆盖标题、两个页签、测试查询、模型选择、`Test Filter` 按钮、禁用与未运行告警、`{selected} of {total} tools selected`/`{count} tools filtered out`/`+{count} more...` 三条带参、`API Usage` 正文与响应头示例；toast 四句供工具函数消费。目录叶子 7862→7908（+46），中英同值 97 不变
- `semanticFilterTestUtils.ts` 的 `runSemanticFilterTest` 按"非组件模块纯函数"约定（第 55、62、73 簇）新增 `t: AdminPanelTranslator` 入参，四句 toast 与兜底错误消息走目录；`getCurlCommand` 生成的 curl 片段属技术示例，保持英文（含 `Your query here`/`your-master-key` 占位）
- `SaveSuccessAlert` 是模块作用域里的 React 函数组件，在自身函数体内挂 `useTranslations("adminPanel")` 与 `useTranslations("common")`（第 84 簇记的"组件挂 hook 合法、纯函数才走首参约定"），关闭按钮 `aria-label="Close"` 复用 `common.close`
- 英文原文逐字可证：脚本比对 HEAD 组件的字符串字面量与 `en.json` 新值，`Settings updated successfully...`/说明正文等逐一命中；ICU 实跑核对三条带参消息
- 单测：设置与测试面板从裸 `render` 换成 `renderWithProviders`、断言换中文；utils 测试改用 `createTranslator({ locale: "zh-CN", messages: zh, namespace: "adminPanel" })` 读真实 zh 目录并把 `t` 传进 `runSemanticFilterTest`，四句断言换中文；三文件共 64 例通过，例数未增删
- 验证：定向 `MCPSemanticFilterSettings/` 与 `src/lib/i18n` 共 6 文件 64 例通过；消费者 `mcp_servers.test.tsx` 30 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 组件两条 `no-large-inline-object-arg` warning 与 HEAD 逐条一致（同一对象、阈值 4 未变）、测试文件 warning 均既有；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 507→509（55.7%→55.9%，`MCPSemanticFilterSettings.tsx` 与 `MCPSemanticFilterTestPanel.tsx` 各新挂 `useTranslations`）；目录叶子 7862→7908（+46）；中英同值 97 不变

## 2026-10-16 第 88 簇更新

批次 24 第 88 簇：`components/Settings/AdminSettings/WebSearchInterceptionSettings/WebSearchInterceptionSettings.tsx`，管理面板"网页搜索拦截"页签（导航拦截开关、拦截提供商、搜索工具与最大智能体循环四组旋钮，外加未在本 pod 生效的告警）。4 文件 +56/−46（`en.json` +20/−0、`zh-CN.json` +20/−0、组件 +22/−33、测试 +14/−13）

- `adminPanel.webSearchInterception` 18 键，全为净新：登录提示、加载与更新失败标题、四个字段的标签与提示、两个下拉占位、保存按钮、更新成功 toast、未生效告警的标题与正文、顶部说明正文；信息告警标题复用既有 `tabWebSearch`（同值同义，避免新键）。目录叶子 7844→7862（+18），中英同值 97 不变
- 正文里的 `'Save Settings'` 与 `that proxy's` 直写单引号即可（`'` 后跟非特殊字符按字面量），经 `intl-messageformat` 实跑确认英文渲染与源串逐字一致；中文把 `'Save Settings'` 用全角引号包裹
- 后端 `field_schema` 的 `description` 属数据不接键（第 85 簇同一约定），只翻组件内兜底文案
- 单测从裸 `render` 换成 `renderWithProviders`（`Web Search Interception`→`网页搜索拦截`、`/please log in/i`→`/请登录/`、`/save settings/i`→`/保存设置/`、`/max agentic loops/i`→`/最大智能体循环次数/`、`/has not applied it/i`→`/尚未应用/`）；`rerender` 保持 RTL 原样（脚本首版把 `rerender(<...>)` 里的子串一并换成 `renderWithProviders` 致 provider 重复，已改回）；例数 27 未增删
- 验证：定向 `WebSearchInterceptionSettings.test.tsx` 与 `src/lib/i18n` 共 4 文件 27 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 测试文件 12 条 `no-explicit-any` warning 与 HEAD 逐条一致（行号相同）、组件零告警；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 506→507（55.5%→55.6%，`WebSearchInterceptionSettings.tsx` 新挂 `useTranslations`）；目录叶子 7844→7862（+18）；中英同值 97 不变

## 2026-10-16 第 87 簇更新

批次 24 第 87 簇：`components/Settings/AdminSettings/PluginSettings/`，管理面板"插件"页签（插件表、新增/编辑弹窗与密钥显隐，含 zod 校验 schema）。5 文件 +130/−65（`en.json` +25/−0、`zh-CN.json` +25/−0、`PluginSettings.tsx` +54/−32、`PluginSettings.integration.test.tsx` +23/−22、`schema.ts` +14/−11）

- `adminPanel.pluginSettings` 23 键，全为净新：卡片标题与说明（说明里的 `<code>GET /api/plugin-manifest</code>` 走 `t.rich`）、增改插件弹窗标题、表格列头与表单标签、编辑与删除按钮的带参 aria、三处字段说明与占位、密钥显隐按钮的 aria，以及 zod 文案 `required`/`invalidUrl`；`Cancel`/`Save` 复用 `common.cancel`/`common.save`，`Name`/`Actions` 复用 `common.name`/`common.actions`，`No data` 复用 `common.noDataShort`。目录叶子 7821→7844（+23），中英同值 93→97（+4：`namePlaceholder`/`displayNamePlaceholder`/`url`/`urlPlaceholder` 属示例标识符与缩写）
- `schema.ts` 从模块级 `pluginSchema` 改成 `buildPluginSchema(t: AdminPanelTranslator)` 工厂，校验消息走目录；保留具名 `pluginShape` 以免触发 `no-large-inline-object-arg`（阈值 4）
- `plugin_key` 说明里的 `<key>`/`<name>` 用单引号转义为 ICU 字面量，经 `intl-messageformat` 实跑确认渲染为 `<key>`/`<name>`（`'` 后跟 `<` 触发引用）
- 集成测试从裸 `render` 换成 `renderWithProviders`并改中文断言；密钥标签查询改用精确串 `"插件密钥"`，以避开 `"显示插件密钥"`/`"隐藏插件密钥"` 的子串碰撞（`getByLabelText` 会同时匹配 `aria-label`）；例数 7 未增删
- 验证：定向 `PluginSettings.integration.test.tsx` 与 `src/lib/i18n` 共 4 文件 20 例通过；消费者 `AdminPanel.test.tsx` 25 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 组件与 schema 零告警（具名 `pluginShape` 后）、测试零告警；prettier 改动文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 505→506（55.4%→55.5%，`PluginSettings.tsx` 新挂 `useTranslations`）；目录叶子 7821→7844（+23）；中英同值 93→97

## 2026-10-16 第 86 簇更新

批次 24 第 86 簇：`components/Settings/AdminSettings/UserBannerSettings/UserBannerSettings.tsx`，管理面板"界面"页签的第三张卡（也是最后一张），发布用户公告横幅的开关、消息、严重程度与预览。`UISettings` 与 `TeamAdminEditableFieldsSettings` 已先接入，本簇收口后该页签无英文残留。4 文件 +66/−39（`en.json` +13/−0、`zh-CN.json` +13/−0、组件 +28/−27、测试 +12/−12）

- `adminPanel.userBanner` 11 键，全为净新：卡片 `title`/`description`、开关 `publishSwitch`（同一段文案兼作 `aria-label` 与可见 `Label`）、`messageLabel`/`messagePlaceholder`/`messageRequiredHint`、`severityLabel`（兼作 `SelectValue` 占位）、`severitySelectAria`、`previewLabel`、`saveButton`、`updatedToast`；`Saving...` 复用 `common.saving`；目录叶子 7810→7821（+11）
- 严重程度下拉三档直接复用 `common.info`/`common.warning`/`common.error`（存量目录里一直没被调用的三条键），`SEVERITY_LABELS: Record<UserBannerSeverity, string>` 改成 `SEVERITY_LABEL_KEYS: Record<UserBannerSeverity, "info" | "warning" | "error">`，组件内用 `tc(...)` 现拼 `severityItems`，`items` 与 `SelectContent` 两处消费同一份，模块级英文 `SEVERITY_ITEMS` 随之删除
- 表单挂 `useTranslations("adminPanel")` 与 `useTranslations("common")` 两把（同第 85 簇 `LoggingSettings`），卡片壳与内容都在同一个 `UserBannerSettingsForm` 里
- 含 Markdown 的 placeholder 用 `intl-messageformat` 实跑确认 `**`/`[]()`/`:` 不触发 ICU 解析（只有 `{}` 才是语法），英文渲染与原值逐字相同
- 英文原文逐字可证：带引号的字面量经脚本与 `en.json` 比对逐一命中；JSX 文本六段（标题、说明、`Message`、`Add a message before publishing.`、`Severity`、`Preview`）按 JSX 空白折叠规则手工核对，唯一例外是 `Saving...` 复用 `common.saving`
- 测试：断言换中文（`getByLabelText("消息")`、开关名 `发布用户横幅`、按钮 `保存横幅`、必填提示 `发布前请先填写消息。`、combobox 名 `横幅严重程度`、三档 `信息`/`警告`/`错误`）；预览卡的 `Maintenance` 断言保留英文（那是测试数据里的 Markdown 正文，非 UI 文案）；例数 8 未增删
- 验证：定向 `UserBannerSettings.test.tsx` 与 `src/lib/i18n` 共 4 文件 24 例通过；消费者 `AdminPanel.test.tsx` 25 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 测试文件 5 条既有 warning 与 HEAD 逐条一致（行号相同）、组件零告警；prettier 四个文件全净；`npm run build` 退出 0；按 `WORKFLOW.md` 第六步未跑全量
- 指标：非测试 `.tsx` 912 接入 505（55.3%→55.4%，+1：`UserBannerSettings.tsx` 新挂 `useTranslations`）；目录叶子 7810→7821（+11）；中英同值 93 不变

## 2026-10-16 第 85 簇更新

批次 24 第 85 簇：`components/Settings/AdminSettings/LoggingSettings/LoggingSettings.tsx`，管理面板"日志"页签的日志设置卡片（消费日志的提示词存储开关、最长保留期，以及清理批处理大小/最大批次/运行预算/批处理超时四类清理旋钮，外加保存按钮与三条 toast），是"补完 `adminPanel` 家族"的后续一簇。4 文件 +139/−101（`en.json` +25/−0、`zh-CN.json` +25/−0、组件 +33/−45、测试 +56/−56）

- `adminPanel.loggingSettings` 23 键，全为净新：卡片 `title`/`description`、开关 `storePromptsInSpendLogs` 与 `storePromptsDesc`、五组清理旋钮各 `*Label`/`*Placeholder`/`*Tooltip`（15 键）、`saveButton`、`updatedToast`、两条带参 toast `saveFailedToast`/`clearFailedToast`；`Saving...` 复用 `common.saving`（取值同为 `Saving...`/`保存中...`）；目录叶子 7787→7810（+23）
- `OPTIONAL_FIELDS` 从存英文 `label`/`placeholder`/`fallbackTooltip` 改成存键名 `labelKey`/`placeholderKey`/`tooltipKey`，`as const` 让三元组各自成字面量联合、`t(field.labelKey)` 才过得了类型检查；原 `OptionalField` 接口随之删除。卡片外壳与表单各挂一把 `useTranslations("adminPanel")`，表单再挂第二把 `useTranslations("common")` 只为取 `saving`；`describeField` 的兜底改由调用处传已翻译的 `t(...)`，父组件不再持有文案
- 两条失败 toast 从字符串拼接改 ICU 带参：`"Failed to save spend logs settings: " + parseErrorMessage(error)` 接成 `t("saveFailedToast", { error })`，`Failed to clear saved value for: ${failed.join(", ")}` 接成 `t("clearFailedToast", { fields: failed.join(", ") })`，英文渲染结果与原拼接逐字相同
- 五条 tooltip 含 `'7d'`/`'5m'`/`'30s'` 这类单引号，用 `intl-messageformat` 实跑确认它们按字面量渲染（`'` 后跟数字/字母不算引用），`messagesParity` 通过
- 英文原文逐字可证：脚本比对 HEAD 组件里的字符串字面量与 `en.json` 新值，19 条逐一命中，唯一例外是 `Saving...` 复用 `common.saving`
- 测试：断言串同步中文（`getByText("日志设置")`、5 个 label 与 5 个 placeholder、18 处 `保存设置`、`/保存中/`、成功 toast 与 `${前缀}Backend error`）；`getByRole("img", { name: "loading" })` 保持英文，`aria-label="loading"` 是技术标识（既有 `ChangePasswordForm`/`LoginPage` 同样保留），不接键；例数 25 未增删
- 验证：定向 `LoggingSettings.test.tsx` 与 `src/lib/i18n` 共 4 文件 41 例通过；消费者 `AdminPanel.test.tsx` 25 例通过；`tsc --noEmit` 非测试文件 0 错；eslint 两个改动文件 9 条既有 warning 与 HEAD 逐条一致（行号相同）；prettier 四个文件全净；`npm run build` 退出 0；四片全量 886 文件 11583 例、1 失败 + 9 例预期失败，那 1 例是 `LensSetup` 时区必挂、`TZ=UTC` 单跑 19 例全绿
- 指标：非测试 `.tsx` 912 接入 504（55.2%→55.3%，+1：`LoggingSettings.tsx` 新挂 `useTranslations`）；目录叶子 7787→7810（+23）；中英同值 93 不变

## 2026-10-16 第 84 簇更新

批次 24 第 84 簇：`components/SSOModals.tsx`，admin 面板挂载的老 SSO 弹窗（添加与编辑标题、五颗按钮、清除确认弹窗、四步说明弹窗与四条 toast），做完 SSO 相关的非测试 `.tsx` 全部接入（`find` 出 9 个 `*SSO*.tsx` 源文件，逐个带 `useTranslations(`）。4 文件 +88/−32（`en.json` +12/−1、`zh-CN.json` +12/−1、组件 +25/−21、`SSOModals.test.tsx` +39/−9）

- `adminPanel.ssoSettings` 95→106 键（净新 11）：`noAccessTokenToast`、`clearConfirmButton`、`clearConfirmBody`、`clearLoginWarning`、`clearFailedToastWithoutError`、`instructionsTitle`、`instructionsIntro`、`instructionStep1`~`instructionStep4`；复用 `addModalTitle`/`editModalTitle`/`deleteConfirmTitle`/`clearSuccessToast`/`saveFailedToast`（带 `{error}`，与 HEAD 的 `"Failed to save SSO settings: " + parseErrorMessage(error)` 逐字一致）以及 `common.save`/`cancel`/`done`/`clear`，组件因此挂两把 `useTranslations`（`t` 走 adminPanel、`tc` 走 common，与第 80、81 簇同形）。目录叶子 7776→7787（+11）、中英同值 93 持平
- 两条"看着能复用其实不能"：确认弹窗是两个 `<p>`，与第 80 簇的 `deleteConfirmBody` 加 `cannotUndo` 同义但断句不同，拼 `{t(a)} {t(b)}` 得到的英文对不上源串（多空格、少问号），故各建整句键；既有 `clearFailedToast` 带 `{error}`，而本文件 `handleClearSSO` 的 catch 只 `console.error` 不报详情，套上去会留尾冒号，另建 `clearFailedToastWithoutError`。判据（先比英文逐字、再比参数占位）记 `FIXES.md`
- 序号留在消息里：`instructionStep1`~`instructionStep4` 的 `1.` `2.` 跟着英文源串进值，沿用目录里 `vectorStores.step1`（`Step 1: Upload Documents` 与 `步骤 1：上传文档`）的先例，JSX 里不做手工编号
- 说明弹窗此前零覆盖：`SSOModals.test.tsx` 十个用例全传 `isInstructionsModalVisible={false}`，五个 `<p>` 与 `Done` 按钮从未渲染过。补一条用例钉住标题、引导句与四步全文（10→11 例），并用变异验证确认它会红（把 `instructionStep2` 换成 `instructionStep4`，报 `Unable to find an element with the text: 2. 新开一个标签页，访问你的代理基础 URL`，改回即绿）
- 断言同步：`Add SSO`→`添加 SSO`、`Save` 五处→`保存`、`Clear`→`清除`、`Yes, Clear`→`确认清除`、成功 toast→`SSO 设置已清除`；`AdminPanel.test.tsx` 把本组件整体 mock 掉，25 例零改动
- 顺手删掉 `return` 上面那句失效注释（`// Helper function to render provider fields`，它描述的 `renderProviderFields` 其实在上方就已调用）。没动的债：本文件自带一份 `detectSSOProvider` 与一份 clear payload 手搭逻辑，与 `SSOSettings/utils.ts` 重复且字段集合已不一致（老的少 `team_mappings`），合并两套 SSO 弹窗属功能重构，不进汉化簇
- 验证：定向 16 文件 160 例通过；`npx tsc --noEmit` 880 持平、非测试文件 0 错；eslint 与 HEAD 逐条一致（组件 0 条，测试文件 8 条既有 warning，规则与行号未变，用 HEAD 版本覆盖复跑比对，未用 stash）；prettier 四个改动文件全部合规；`npm run build` 退出 0、`✓ Compiled successfully`（三条 `Error: ENVIRONMENT_FALLBACK` 与 AVIF 警告为既有）；`adminPanel.ssoSettings` 摘掉本簇 11 键后与 HEAD 逐键相等，`adminPanel` 之外的键树与 HEAD 全等；文件内英文字面量扫描只剩数据、枚举与 dev-log 串；域收口四片全量 886 文件 11583 例、4 失败 + 9 例预期失败，4 例都不在本簇改动面上（`EntityUsage` 1 例、`mcp_server_edit` 1 例与 `KeyActivityPanel` 1 例所在三个文件单跑 98 例全绿；`LensSetup` 1 例本地单跑 1 failed|18 passed、`TZ=UTC` 单跑 19 例全绿，是记过的 `/2026-09-30/` 时区必挂）；同一天前一次四片的 FAIL 是 5 条且集合不同（`LensSetup` 2 条、`mcp_server_edit` 1 条、`add_auto_router_tab` 1 条、`KeyActivityPanel` 1 条），继续记为并发与时区相关的上游既有抖动；例数比第 83 簇多 1，即本簇那条说明弹窗用例；非测试 `.tsx` 接入 502→503/912（55.0%→55.2%，`SSOModals.tsx` 新挂 `useTranslations`）

## 2026-10-16 第 83 簇更新

批次 24 第 83 簇：`components/Settings/AdminSettings/SSOSettings/constants.ts`，SSO 的两张展示名配置表（5 个 provider 名、4 个默认角色名），是"补完 SSOSettings 目录"的第六步，做完该目录非测试文件里的用户可见英文字面量清零。8 文件 +70/−42（`en.json` +7/−1、`zh-CN.json` +7/−1、`constants.ts` +24/−11、`SSOSettings.tsx` +7/−7、`Modals/BaseSSOSettingsForm.tsx` +7/−9、`RoleMappings.tsx` +8/−3、`RoleMappings.test.tsx` +8/−8、`Modals/BaseSSOSettingsForm.test.tsx` +2/−2）

- `adminPanel.ssoSettings` 89→95 键（净新 6）：`providerNameGoogle`/`providerNameMicrosoft`/`providerNameOkta`/`providerNameGeneric`/`providerNameSaml` 五个 provider 名与 `roleProxyAdminViewer`；`roleInternalViewer`/`roleInternalUser`/`roleProxyAdmin` 三条与第 82 簇默认角色选项的英语原文逐字节相同，直接复用，没有为省键去改英语原文。目录叶子 7770→7776（+6）、中英同值 89→93（+4 个品牌名）
- 两张表从存"名字"改成存"键名"：`ssoProviderDisplayNames`→`ssoProviderNameKeys`、`defaultRoleDisplayNames`→`defaultRoleNameKeys`，值类型是受限 union（`SSOProviderNameKey`/`DefaultRoleNameKey`）。与第 82 簇把 union 写在字段声明上不同，本簇要按任意 string 查表（provider 值来自 `detectSSOProvider`，role 值来自后端 payload），表只能声明成 `Record<string, Union>`：`as const` 的字面量对象没有索引签名，`ssoProviderNameKeys[value]` 在 `value: string` 下取不到类型
- 数据模块改接翻译要回溯渲染处的拼装规则：`BaseSSOSettingsForm.tsx` 模块级 `providerOptionLabel` 的兜底是 `value.charAt(0).toUpperCase() + value.slice(1) + " SSO"`，命中不了表就会拼出英文串，因此整个函数搬进 `SSOProviderSelectField` 里读 `t`，未命中回退原始 `value`；`RoleMappings.tsx` 的 `roleName` 同款，沿用第 82 簇 `option ? t(option.labelKey) : role` 的回退形态。`SSOSettings.tsx` 的 `<Logo label>` 顺手去掉重复查表与那条不可达兜底，直接用 `config.providerText`
- 品牌名保留英文（`GLOSSARY.md` 的 product 名规则），四条 provider 名中英同值，于是 `getByAltText("Google SSO logo")`（`alt` 由 `Logo.tsx` 内部拼 `${name} logo`）、下拉项字母头像 `getByText("O")`、`getByText("SAML SSO")`、`findByText("Google SSO")` 全部零改动；唯一改值的是没有 logo 的"通用 SSO"，只涉及 `BaseSSOSettingsForm.test.tsx` 两处 `findByText(/generic sso/i)`；`RoleMappings.test.tsx` 的 4 条 `displayName` 与表格 4 条 `getAllByText` 换中文
- 不补配置守卫用例，判据记在 `FIXES.md`：缺键会渲染原始 id 而非静默空串，且 5 个 provider 名与 4 个角色名的中文串已被现有断言全部钉住，加一条只查表结构不查行为的用例没有价值
- 验证：定向 16 文件 159 例通过；`npx tsc --noEmit` 880 持平、非测试文件 0 错；eslint 与 HEAD 逐条一致（仅 `BaseSSOSettingsForm.test.tsx` 两条既有 `no-large-inline-object-arg` warning，行号 339/415 未变）；prettier 只有 `BaseSSOSettingsForm.tsx` 不合规（HEAD 探针全净），`--write` 后合规；`npm run build` 退出 0；`adminPanel.ssoSettings` 摘掉本簇 6 键后与 HEAD 逐键相等；目录内非测试文件的英文字面量扫描无残留；域收口四片全量 886 文件 11582 例、1 失败 + 9 例预期失败，那 1 例是 `LensSetup` 的时区必挂，第 82 簇的 `add_auto_router_tab` 2 例与 `KeyActivityPanel` 1 例本簇未复现；例数持平，本簇未增删用例；非测试 `.tsx` 接入 502/912、55.0% 持平

## 2026-10-16 第 82 簇更新

批次 24 第 82 簇：`components/Settings/AdminSettings/SSOSettings/Modals/BaseSSOSettingsForm.tsx`，SSO 添加/编辑弹窗与根目录 `SSOModals.tsx` 共用的表单基座（五个 provider 的字段配置表、zod 校验 schema、八个字段组件），是"补完 SSOSettings 目录"的第五步，做完只剩 `constants.ts` 的 provider 与角色展示名。8 文件 +402/−226（`en.json` +58/−31、`zh-CN.json` +59/−36、组件 +193/−80、`SSOModals.tsx` +3/−1、`BaseSSOSettingsForm.test.tsx` +37/−27、`SSOModals.test.tsx` +47/−46、`AddSSOSettingsModal.test.tsx` +1/−1、`EditSSOSettingsModal.integration.test.tsx` +4/−4）

- `adminPanel.ssoSettings` 49→89 键（净新 40）：10 个字段 label（`ssoProvider`/`proxyAdminEmail`/`googleClientId`/`googleClientSecret`/`microsoftClientId`/`microsoftClientSecret`/`microsoftTenant`/`genericClientId`/`genericClientSecret`/`userinfoEndpoint`）、4 个团队映射 label（`proxyAdminTeams`/`adminViewerTeams`/`internalUserTeams`/`internalViewerTeams`）、10 条必填整句（`enter*`）、5 条 schema 级必填（`pleaseSelectProvider`/`pleaseEnterAdminEmail`/`proxyBaseUrlRequired`/`groupClaimRequired`/`teamIdsJwtFieldRequired`）、2 条 URL 校验（`urlMustStartWithHttp`/`urlMustNotEndWithSlash`）、3 条 placeholder（`idpMetadataUrlPlaceholder`/`idpMetadataXmlPlaceholder`/`spEntityIdPlaceholder`）、2 个开关（`useRoleMappings`/`useTeamMappings`）、4 个默认角色选项（`roleInternalViewer`/`roleInternalUser`/`roleAdminViewer`/`roleProxyAdmin`）；`authorizationEndpoint`/`tokenEndpoint`/`scopes`/`idpMetadataUrl`/`idpMetadataXml`/`spEntityId`/`allowUnsolicited`/`groupClaim`/`defaultRole`/`proxyBaseUrl`/`teamIdsJwtField` 复用目录里既有的 11 个键（多数来自第 79 簇展示卡的字段 label，`groupClaim`/`defaultRole` 更早来自第 78 簇的 `RoleMappings.tsx`）；目录叶子 7730→7770（+40）
- 配置表改收键名、不把 `t` 传进模块作用域：`ssoProviderConfigs` 的 `label` 与模块级 `REQUIRED_MESSAGES` 换成 `labelKey`/`requiredKey`/`placeholderKey` 三列，类型是三个受限 union（`FieldLabelKey`/`FieldRequiredKey`/`FieldPlaceholderKey`），渲染点在 `SSOProviderField`、消息点在 schema 工厂 `buildSSOSettingsSchema(variant, t)`。`useSSOSettingsForm` 因此从箭头函数改成块体、内部挂一把 `useTranslations("adminPanel")`，形参类型用 `lib/i18n/translators` 的 `AdminPanelTranslator`；`MappingToggleField` 的 `label: string` 与 `DEFAULT_ROLE_OPTIONS` 的 `label` 一并改 `labelKey`，`SSOModals.tsx` 那个调用点同步。两条坑（`requiredKey` 设可选开出的静默洞、必填整句为何不做参数化）见 `FIXES.md`
- 英语原文逐字可证：10 条 `enter*` 整句按 HEAD 的 `Please enter the ${field.label.toLowerCase()}` 公式逐一对齐（脚本比对 HEAD label 派生集合，"新键值不在派生集合里"为零），HEAD 能派生但本簇没建键的 9 条（`Please enter the scopes`、四条 saml 字段等）对应字段本就 `required: false`、消息从不触发
- `spEntityIdPlaceholder` 的 `Defaults to <proxy base url>/sso/saml/metadata` 含尖括号，ICU 里必须写成 `'<proxy base url>'`（中文侧 `'<代理基础 URL>'`）才不炸 `UNCLOSED_TAG`，渲染结果用 `intl-messageformat` 实跑与 HEAD 原串逐字对齐
- 测试：`BaseSSOSettingsForm.test.tsx` 24→25 例，新增一条配置守卫（`ssoProviderConfigs` 里 `required !== false` 且缺 `requiredKey` 的字段名集合必须为空），并用变异验证确认它会红——临时摘掉 `google_client_id` 的 `requiredKey`，报 `expected [ 'google_client_id' ] to deeply equal []`，装回即绿；两颗开关的 `it.each` 改成 `{ english, chinese }` 对象形式，标题留英文便于与源码对照、查询走中文；`SSOModals.test.tsx` 10 处裸 `render` 换 `renderWithProviders`（该文件在 `src/components/`，路径是 `../../tests/test-utils`）并同步 label 与校验消息断言；`AddSSOSettingsModal.test.tsx` 改 1 处 `SSO Provider`；`EditSSOSettingsModal.integration.test.tsx` 改 3 处（两个 `Google Client ID` label 与一条 zod 整句）；`EditSSOSettingsModal.test.tsx` 只用 `field.name`/`field.type`，零改动，32 例原样通过
- 仍留英文的断言一律能回溯到数据模块或本簇范围外（第 79 簇那条判据）：provider 下拉项 `/google sso/i`、`/okta/i`、`/generic sso/i`、`/saml sso/i` 与 `getByAltText("Google SSO logo")` 等取自 `constants.ts`，留第 83 簇；`https://example.com`、`https://your-domain/*`、`openid email profile` 是数据/契约串；`SSOModals.tsx` 自己的 `Add SSO`/`Save`/`Clear`/`Yes, Clear` 与清除 toast 仍是字面量，属该文件后续簇的账
- prettier：`ssoProviderConfigs` 的条目改成四行展开后 `BaseSSOSettingsForm.tsx` 与它的测试必须 `--write`，两个消息目录一并 `--write`，顺带把第 80 簇遗留的 `header` 块 8 空格缩进与三处 `suggestedPrompts` 多行数组压成合规排版。深比对（`python` 去掉本簇 40 键后与 `git show HEAD` 版逐键相等）确认没有改动任何既有值
- 本地验证：`SSOSettings` 目录 11 文件 + 消费者 `SSOModals.test.tsx` = 12 文件 118 例，再加 `src/lib/i18n` 16 例共 15 文件 134 例通过；`tsc --noEmit` 880（与基线持平，非测试 0）；eslint 6 个 tsx/ts 改动文件与 HEAD 逐条一致（11 条既有 warning 只有行号平移，/tmp 备份 + `git show HEAD` 还原复跑，未使用 stash）；`npm run build` 退出 0、`✓ Compiled successfully`（三条 `Error: ENVIRONMENT_FALLBACK` 与 AVIF 警告为既有）；四片全量 886 文件 11582 例、4 失败 + 9 例预期失败，4 例单跑复全绿（`add_auto_router_tab` 96 例、`KeyActivityPanel` 15 例）或 `TZ=UTC` 复全绿（`LensSetup` 19 例），第 81 簇基线里的 `cost_tracking_settings` 7 例本簇四片未复现；例数 +1 即本簇那条配置守卫
- 指标：非测试 `.tsx` 912 接入 502（54.9%→55.0%，+1：`BaseSSOSettingsForm.tsx` 新挂 `useTranslations`）；目录叶子 7730→7770（+40）；中英同值 89 不变。两条角色选项与既有键同串（`roleInternalUser` 的 `内部用户` 与 `nav.internalUsers`、`users.title`、`organizations.roleInternalUser`、`logs.columns.internalUser` 一致，`roleInternalViewer` 的 `内部用户（只读）` 与 `organizations.roleInternalUserViewer` 一致），四条团队映射 label 与两条开关则各自唯一——按模块重复是既有口径，未做跨命名空间合并

## 2026-10-15 第 81 簇更新

批次 24 第 81 簇：`components/Settings/AdminSettings/SSOSettings/Modals/EditSSOSettingsModal.tsx` 编辑弹窗（复用 `BaseSSOSettingsForm` 的种子化表单，弹窗本体只有标题、三颗按钮与三条 toast），是"补完 SSOSettings 目录"的第四步（`BaseSSOSettingsForm.tsx`、根目录 `SSOModals.tsx`、`constants.ts` 展示名留后续）。5 文件 +31/−20（两个消息目录各 +4/−1、组件 +9/−6、734 行测试 +13/−11、集成测试 +1/−1）

- `adminPanel.ssoSettings` 46→49 键（净新 3）：`editModalTitle`/`updatedToast`/`processFailedToast`；`saveFailedToast` 与第 80 簇同串直接复用，取消/保存/保存中复用 `common.cancel`/`common.save`/`common.saving`（`common.saving` 早已存在，未开 `savingButton` 同值键）；目录叶子 7727→7730（+3）
- 两条失败 toast 从 `"前缀: " + parseErrorMessage(error)` 拼接改为 `t("ssoSettings.saveFailedToast", { error: parseErrorMessage(error) })` 的 ICU 带参——**ICU 缺参渲染为空串**，`parseErrorMessage` 返回 `undefined` 时 toast 从"保存 SSO 设置失败：undefined"变为"保存 SSO 设置失败："（旧拼接会把 `undefined` 三字透给用户，视为迁移顺带的微小行为改善），对应测试断言同步改掉 `${PREFIX} undefined` 模板
- 734 行测试由裸 `render` 换 `renderWithProviders`（`tests/test-utils` 的 rerender 沿用 wrapper，"replaces every field when reopened"那条 `rerender` 用例无需另改）；`TEST_DATA` 六处断言串换中文、保存按钮可访问名正则 `/^(Save|Saving)/`→`/^(保存|保存中)/`；错误前缀断言从 `${PREFIX} Parsed error message`（旧拼接自带空格）改为 `${PREFIX}Parsed error message`（全角冒号后不补空格）
- 集成测试只改保存按钮名 `Save`→`保存`；`Google Client ID` 表单 label 与 `Please enter the google client id` zod 消息取自未接入的 `BaseSSOSettingsForm`，保持英文留给第 82 簇
- 拼接脚手架踩坑（已记 `FIXES.md`）：批量追加键的行末逗号放进行字符串、又用 `",\n".join` 连接，产出 `,,` 双逗号坏 JSON——`json.loads` 校验放写盘**之后**才发现，en.json 已被写坏、`git checkout --` 还原重拼；正确顺序是先在内存里 `json.loads` 校验再落盘，行字符串一律不带尾逗号；本次还在替换闭合括号前多出一个空行，一并清掉
- 本地验证：`src/lib/i18n`（16 例）+ Modals 目录 5 文件 60 例 + 消费者 `SSOModals.test.tsx`（10 例）通过；`tsc --noEmit` 880（基线，0 非测试）；eslint 3 个改动文件与 HEAD 逐条一致（测试文件因新增 import 行整体 +1 行号平移、24 条既有 warning 逐条对上；/tmp 备份 + `git show HEAD` 还原复跑，未使用 stash）；prettier 三个文件全净、无需 `--write`；`npm run build` 退出 0；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，与基线逐例一致（连 shard 1 偶发的 `LensSetup` "saves a discovered agent"都未出现）
- 指标：非测试 `.tsx` 912 接入 501（54.9%，+1：`EditSSOSettingsModal.tsx` 新挂 `useTranslations`）；目录叶子 7727→7730（+3）；中英同值 89 不变

## 2026-10-15 第 80 簇更新

批次 24 第 80 簇：`components/Settings/AdminSettings/SSOSettings/Modals/` 的添加与删除两个自足弹窗——`AddSSOSettingsModal.tsx`（标题/主按钮/取消/两条 toast）与 `DeleteSSOSettingsModal.tsx`（确认标题/不可撤销/确认正文/资源标题/Provider 标签与 Generic 兜底/两条清除 toast），是"补完 SSOSettings 目录"的第三步（`EditSSOSettingsModal`、`BaseSSOSettingsForm.tsx`、根目录 `SSOModals.tsx`、`constants.ts` 展示名留后续）。6 文件 +49/−22（两个消息目录各 +11、两个组件 +8/−5 与 +13/−7、两个测试 +2/−2 与 +2/−6）

- `adminPanel.ssoSettings` 35→46 键（新增 11）：`addModalTitle`/`addingButton`/`addSuccessToast`/`saveFailedToast`（添加段）、`deleteConfirmTitle`/`cannotUndo`/`deleteConfirmBody`/`deleteResourceTitle`/`providerGenericFallback`/`clearSuccessToast`/`clearFailedToast`（删除段）；`cancel` 复用 `common.cancel`（`AddSSOSettingsModal` 挂第二把 `useTranslations("common")`）；目录叶子 7716→7727（+11）
- `AddSSOSettingsModal` 主按钮的 `isPending ? "Adding..." : "Add SSO"` 三元分支接成 `t("ssoSettings.addingButton") : t("ssoSettings.addModalTitle")`——加载态与弹窗标题同串（`Add SSO`），与既有 "标题即按钮" 构词一致；两条 toast 走 `parseErrorMessage(error)` 的 `{error}` 带参键
- `DeleteSSOSettingsModal` 的 `DeleteResourceModal` 四个 props（`title`/`alertMessage`/`message`/`resourceInformationTitle`）与 `resourceInformation` 的 label/兜底全部接键；`detectSSOProvider` 的返回值是数据、只翻 `|| t("ssoSettings.providerGenericFallback")` 兜底
- 测试：`AddSSOSettingsModal.test.tsx` 改 `取消` 与 `getAllByText("添加 SSO")`（标题+按钮两处，长度断言不变）、`SSO Provider` 取自未接入的 `BaseSSOSettingsForm` 表单故保持英文；`DeleteSSOSettingsModal.test.tsx` 改 `确认清除 SSO 设置` 与中文确认正文（该测试是手搭 `QueryClientProvider` + `LocaleProvider locale="zh-CN"`、本就带 intl 上下文，无需换 `renderWithProviders`）
- prettier：`DeleteSSOSettingsModal.tsx` 的 `resourceInformation` 条目换 `t(...)` 后越行宽、测试的多行 `getByText` 参数被收敛，HEAD 探针（仓库内兄弟名验证）均 clean，`--write` 两个文件；另两个文件无需动，消息目录保持既有债不动
- 本地验证：`src/lib/i18n`（16 例）+ `SSOSettings` 目录 14 文件 123 例 + 消费者 `SSOModals.test.tsx`（10 例）通过；`tsc --noEmit` 880（基线，0 非测试）；eslint 4 个改动文件与 HEAD 逐条一致（/tmp 备份 + `git show HEAD` 还原复跑，未使用 stash）；`npm run build` 退出 0；四片全量 886 文件 11581 例、9 失败 + 9 例预期失败（`cost_tracking_settings` 7、`LensSetup` 2——一条时区必挂、一条 shard 1 并发偶发复跑未现）
- 指标：非测试 `.tsx` 912 接入 500（54.8%，+2：两个 Modal 各挂一把 `useTranslations`）；目录叶子 7716→7727（+11）；中英同值 89 不变

## 2026-10-15 第 79 簇更新

批次 24 第 79 簇：`components/Settings/AdminSettings/SSOSettings/` 里的展示卡片 `SSOSettings.tsx` 与骨架屏 `SSOSettingsLoadingSkeleton.tsx`——两个早已因消费 `ssoDesc` 而挂上 `useTranslations("adminPanel")` 的组件，本簇补齐其余框架文案，是"补完 SSOSettings 目录"的第二步（`constants.ts` 展示名、三个 Modal 与 `BaseSSOSettingsForm.tsx` 留后续）。6 文件 +128/−46（两个消息目录各 +23、`SSOSettings.tsx` +73/−37、骨架屏 +2/−2、两个测试 +3/−3 与 +2/−2）

- `adminPanel.ssoSettings` 12→35 键（新增 23）：`title`/`loadingAria`（卡片标题与骨架 aria）、`editButton`/`deleteButton`、`providerLabel`/`provided`/`enabled`/`disabled`、`copyValue`/`copiedToClipboard`，以及 13 个 provider 字段 label（`clientId`/`clientSecret`/`proxyBaseUrl`/`tenant`/`authorizationEndpoint`/`tokenEndpoint`/`userInfoEndpoint`/`scopes`/`teamIdsJwtField`/`idpMetadataUrl`/`idpMetadataXml`/`spEntityId`/`allowUnsolicited`）；目录叶子 7693→7716（+23）
- 模块级子组件各挂各的 `t`：`NotConfigured` 与 `EndpointValue` 定义在组件文件的模块作用域、但本身是 React 函数组件（用 JSX、被当 `<X/>` 渲染），故直接在其函数体内 `const t = useTranslations("adminPanel")`，不必从 `SSOSettings()` 往下传（区别于纯函数走首参 translator 约定，见 `FIXES.md`）
- 骨架屏与卡片同源：`Card` 的 `aria-label={t("ssoSettings.loadingAria")}`、`<h3>{t("ssoSettings.title")}</h3>` 复用与 `SSOSettings.tsx` 同一 `title` 键；`t("ssoDesc")` 是既有卡片描述、不动
- 数据留英文：provider 展示名 `ssoProviderDisplayNames`（"Google SSO"/"SAML SSO" 等）与 `Logo` 的 `alt` 仍取自 `constants.ts`，按"数据模块留待专簇"不动，故 `SSOSettings.test.tsx` 的 `getByText("SAML SSO")`、`getByAltText("Google SSO logo")` 保持英文，只有 heading/按钮/徽标断言改中文
- prettier 拆行（`printWidth: 120`）：原本单行的 `{ label: "Proxy Base URL", render: … },`（111 字符）换成 `t("ssoSettings.proxyBaseUrl")` 后涨到 128、越过行宽，`--list-different` 报警；HEAD 版本本就 clean（把 `git show HEAD:./$f` 落仓库内兄弟名再查），故 `--write` 只把这些超长行拆成多行；骨架屏与两个测试无需 `--write`，两个消息目录保持既有债不动
- 测试改中文：`SSOSettings.test.tsx` 改 `getByText("SSO 配置")`、`/编辑 SSO 设置/`、`getByText("已启用")`；`SSOSettingsLoadingSkeleton.test.tsx` 改 heading `SSO 配置` 与 status `正在加载 SSO 配置`；`AdminPanel.test.tsx` 整体 mock 掉本组件、不受影响
- 本地验证：`src/lib/i18n`（16 例）+ `SSOSettings` 目录与 `AdminPanel` 消费者共 12 文件 132 例通过；四片全量 886 文件 11581 例、9 失败 + 9 例预期失败（`cost_tracking_settings` 7、`LensSetup` 2——一条时区必挂、一条 shard 1 并发偶发单跑绿）；`tsc --noEmit` 880（基线，0 非测试）；eslint 两个代码文件均 0 warning、与 HEAD 一致；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 498 持平（`SSOSettings.tsx` 与 `SSOSettingsLoadingSkeleton.tsx` 本就因 `ssoDesc` 计入）；目录叶子 7693→7716（+23）；中英同值 89 不变

## 2026-10-15 第 76 簇更新

批次 24 第 76 簇：`components/Settings/AdminSettings/UISettings/` 目录余下的两个文件——`UISettings.tsx`（界面设置卡片）与子组件 `PageVisibilitySettings.tsx`（内部用户页面可见性）。二者属已接入的 `adminPanel` 家族——`SSOSettings.tsx`、`TeamAdminEditableFieldsSettings.tsx` 都已接 `useTranslations("adminPanel")`，只剩这一个目录没接完，故按"补完家族最后一个目录"纳入。6 文件 +163/−102（两个消息目录各 +40、组件 +57/−66 与 +10/−13、两个测试 +10/−9 与 +6/−6）

- 单 translator：两个组件各 `const t = useTranslations("adminPanel")`，只调用 `t("uiSettings.…")` / `t("uiSettings.pageVisibility.…")` 点号路径，不新增第二把
- 新增 `adminPanel.uiSettings` 子命名空间（仿既有 `teamAdminEditable` 的嵌套写法）：29 个顶层键（title/loading/loadErrorTitle/updateErrorTitle/三个 toast、11 组开关 label、Projects/Chat 的 aria 与 label 各拆分、6 段 description 兜底文案）加嵌套 `pageVisibility` 8 键（title/badgeCount/badgeNotSet/defaultHint/note/configure/save/reset）；目录叶子 7600→7636（+36 叶子，即 28 个标量 + 8 个嵌套）
- `??` 兜底与实例文案同源：开关的 `ariaLabel={property?.description ?? t("…")}` 与 `label={t("…")}` 用同一键（11 组文案本相同）；Projects/Chat 因 label 带 `[BETA]` 前缀、aria 不带，拆成 `enableProjectsUi`/`enableProjectsUiLabel`、`enableChatUi`/`enableChatUiLabel` 两组；`description={property?.description ?? t("…Desc")}` 同理，6 段长文案改成键
- 三档 toast 分清：11 处 `updatedToast`、2 处 `updatedRefreshToast`（Projects/Chat 改完刷新页）、1 处 `pageVisibilityUpdatedToast`
- 数据模块不改：`PageVisibilitySettings` 里 `getAvailablePages()` 返回的 `label`/`description`/`group` 是英文数据（同 `vector_store_providers` 那一类），页面标题/分组名/勾选名均来自它，本轮只翻组件自身的框架文案，数据留待那一簇
- 测试改中文 + 换 harness：`UISettings.test.tsx` 由裸 `render` 换成 `renderWithProviders`（否则无 intl provider 直接抛错），断言随钉住的 zh-CN 改；但三个 `getByRole("switch", { name: "…英文…" })` **保持英文**——开关的可访问名取自 mock 的 `field_schema.properties.*.description`（仍是英文），不是兜底键；`PageVisibilitySettings.test.tsx` 本就用 `renderWithProviders`，改"未设置（所有页面可见）"/"已选择 2 个页面"/"已选择 1 个页面"与 `/配置页面可见性/`、`/重置为默认/`，mock 的 `Analytics`/`Access` 分组与 `Usage`/`Models`/`API Keys` 勾选名保持英文
- 本地验证：`src/lib/i18n`（16 例）+ `UISettings` 目录与 `admin-panel` 消费者共 4 文件 43 例通过；`AdminPanel.test.tsx` 整体 mock 掉本组件、不受影响；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败（与基线一致，shard 1 另抖出一条 `LensSetup`、单跑该文件不复现）；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 规则集完全一致（同为 1 条 `complexity` warning，仅行号位移）；两个代码文件 `--write` 后 prettier-clean（HEAD 本就 clean），两个测试文件无需 `--write`，两个消息目录保持既有债不动；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 494（54.2%，+2：`UISettings.tsx` 与 `PageVisibilitySettings.tsx` 各挂一个 `useTranslations`）；目录叶子 7600→7636；中英同值 89 不变

## 2026-10-15 第 77 簇更新

批次 24 第 77 簇：`components/price_data_reload.tsx` 及其测试。原定 `SSOSettings/Modals/BaseSSOSettingsForm.tsx`，评估后推迟——它把 15 条字段 label/placeholder、5 条 `REQUIRED_MESSAGES`、4 条角色标签、整段 zod 校验消息都写在**模块级常量**里（消费者还有 `SSOModals.tsx`、`AdminPanel.tsx` 等），要让 `t` 渗进 `ssoProviderConfigs`/`buildSSOSettingsSchema` 是一次大改，不适合一簇赶完，故改挑这个**复用既有 `models.priceData` 命名空间**的孤立文件。4 文件 +222/−134（两个消息目录各 +46/−1、组件 +90/−92、测试 +40/−40）

- 复用既有命名空间、只补净新键：`models.priceData` 本已在 `PriceDataManagementTab.tsx` 接入（含 `reloadButton`），故沿用同一把 `useTranslations("models.priceData")`，命名空间 3→48 键（+45），不新造第二把、不新造命名空间
- 定点改 `formatDateTime` 的兜底语义：由 `return "Never"`（硬编码英文）改为 `return null`，让"从未运行"这层语义回到调用点用 `t("never")` 决定——`CostMapProvenanceRows` 里受 `sourceInfo.loaded_at &&` 保护、`?? t("never")` 是死分支故删掉；状态卡"Last run"行未被保护，补 `?? t("never")` 以保留原"Never"展示
- 三处 `noAccessToken` 合并：硬刷新/调度/取消三个 handler 各有一处 `toast.fromError("No access token available")`，同一键替换（`allow_multiple`）
- `buttonText` 默认值外移：props 由 `buttonText = "Reload Price Data"` 改为可选 `buttonText`，在体内 `const reloadLabel = buttonText ?? t("reloadButton")`；消费者 `PriceDataManagementTab.tsx` 本就传 `buttonText={t("reloadButton")}`，行为不变
- ICU 占位符类型：`t("scheduledEvery", { hours: reloadStatus.interval_hours })` 因 `interval_hours: number | null` 报 TS2322（ICU 入参不接受 `null`），改 `?? ""`；`scheduleSummary` 的 `hours: number | ""` 天然合法
- 测试换 harness + 断言转中文：裸 `render` → `renderWithProviders`；"Pricing Data Source"/"Remote"/"No periodic reload scheduled"/"Source revision:"/"ETag:"/"Loaded at:"/worker-note 两段正则、硬刷新对话框与"是"、"Set Up Periodic Reload"下拉、调度对话框标题与 spinbutton aria、三处 toast、`/Cancel Periodic Reload/`，全部转 zh-CN（注意 `sourceRevision`/`etag`/`loadedAt`/`lastRun` 等键的值用**全角冒号**，断言要跟着）
- 本地验证：`src/lib/i18n`（16 例）+ 本组件测试（12 例）+ 消费者 `PriceDataManagementTab.test.tsx`（1 例）通过；四片全量 886 文件 11581 例、9 失败 + 9 例预期失败（`cost_tracking_settings` 7 + `LensSetup` 2，均上游既有：`LensSetup` 的 `/2026-09-30/` 日期断言在 `Asia/Shanghai` 下必挂、`TZ=UTC` 单跑即绿，另一条只在并发下偶发）；`tsc --noEmit` 880（基线，0 非测试，过程中曾因上述 ICU `null` 多出 1 条、改 `?? ""` 后归零）；eslint 与 HEAD 同规则集一致（同为 1 条 `complexity` warning，仅行号位移 24→26）；两个代码文件 prettier-clean，两个消息目录 HEAD 本就 non-conformant、按惯例保持不动；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 495（54.3%，+1：`price_data_reload.tsx`）；目录叶子 7636→7681（+45）；中英同值 89 不变

## 2026-10-15 第 78 簇更新

批次 24 第 78 簇：`components/Settings/AdminSettings/SSOSettings/` 目录的三个自足叶子组件——`RedactableField.tsx`（可隐藏的密钥显示）、`SSOSettingsEmptyPlaceholder.tsx`（未配置空态）、`RoleMappings.tsx`（角色映射卡）。这是"补完 `adminPanel` 家族里 SSOSettings 目录"的第一步：先挑不依赖模块级常量的三件，给整个目录开 `adminPanel.ssoSettings` 子命名空间，后续簇（`SSOSettings.tsx` 主体、三个 Modal、`BaseSSOSettingsForm.tsx`）复用其中的字段标签键。8 文件 +60/−37（两个消息目录各 +14、六个组件/测试见 numstat）

- 新增 `adminPanel.ssoSettings` 子命名空间 12 键：`notConfigured`/`showValue`/`hideValue`（`RedactableField`）、`emptyTitle`/`emptyBody`/`configureSso`（空态）、`roleMappingsTitle`/`groupClaim`/`defaultRole`/`roleColumn`/`mappedGroupsColumn`/`noGroupsMapped`（角色映射）；目录叶子 7681→7693（+12）
- 锚点踩坑（已记 `FIXES.md`）：首版把新块插在 `pageVisibility` 的 `}` 与 `uiSettings` 的 `}` 之间，落成 `adminPanel.uiSettings.ssoSettings`——**同缩进层**的两个 `}` 只看缩进会插错层级；组件测试立刻渲染出裸键 `adminPanel.ssoSettings.configureSso` 才暴露，而当时守卫却在接线前跑、`missingKeys` 无引用可查故未报警。正确锚点是 `uiSettings` 的 `}` + `adminPanel` 的 `},` + 紧随的 `"usage": {`，插入后 `uiSettings` 的 `}` 补逗号、新块与 `uiSettings` 同层
- 共用键预留：`groupClaim`/`defaultRole` 也出现在 `BaseSSOSettingsForm` 的 `GroupClaimField`/`Default Role` 里，本簇先在此定义，后续那簇直接复用、不再造重复键
- 数据留英文：`RoleMappings` 里 `defaultRoleDisplayNames[role]`（`Internal Viewer` 等）来自 `constants.ts`，同 `PageVisibilitySettings.getAvailablePages()` 一类，属显示数据、留给收口 `constants.ts` 的那一簇，故测试里四条 `displayName` 断言保持英文，只翻 `Role Mappings`/`Group Claim`/`Default Role`/`Role`/`Mapped Groups`/`No groups mapped` 六处框架文案
- 连带改一处消费者断言：`SSOSettings.test.tsx` 有 `queryByText("No SSO Configuration Found")`（在"已配置"SAML 用例里断言空态不存在，英文串本会因翻译改成"永远查不到"而假绿），一并改成中文 `未找到 SSO 配置` 保住这条负向断言的含义；`SSOModals.test.tsx` 按 `getByLabelText("Group Claim")` 命中的是未接入的 `BaseSSOSettingsForm` 表单标签、与本簇无关，保持不变
- `SSOSettingsEmptyPlaceholder.test.tsx` 由裸 `render` 换 `renderWithProviders`（同目录另两个测试本就用 provider）
- 本地验证：`src/lib/i18n`（16 例）+ `SSOSettings` 目录与 `SSOModals` 消费者共 12 文件 117 例通过；四片全量 886 文件 11581 例、9 失败 + 9 例预期失败（`cost_tracking_settings` 7、`LensSetup` 1 时区相关、`add_auto_router_tab` 1 并发抖动单跑 96 例全绿）；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 完全一致（同 2 条 `no-node-access` warning、0 error）；七个代码/测试文件 prettier-clean，两个消息目录 HEAD 本就 non-conformant、保持不动；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 498（54.6%，+3：三个叶子各挂一个 `useTranslations`）；目录叶子 7681→7693（+12）；中英同值 89 不变

## 2026-10-15 第 75 簇更新

批次 24 第 75 簇：`components/organization/organization_view.tsx`（组织详情视图，概览/成员/设置三页签）。它属于已接入的 `organizations` 家族——`OrganizationFilters.tsx`、`OrganizationsPanel.tsx`、`OrganizationsTable.tsx`、`OrganizationsTableColumns.tsx`、`OrganizationDropdown.tsx` 都已接 `useTranslations("organizations")`，只剩这个详情视图没接，故按"补完家族最后一个文件"纳入。4 文件 +150/−79（两个消息目录各 +25/−1，组件 +76/−53，测试 +24/−24）

- 复用优先：`organizations` 已有 `overview`/`members`/`settings`（页签）、`organizationDetails`/`budgetStatus`/`models`/`teams`/`allProxyModels`/`maxParallelRequests`/`tpm`/`rpm`/`unlimited`/`of`/`backToOrganizations`/`organizationName`/`organizationId`/`createdAt`/`editSettings`/`spend`/`createdBy`，`common` 已有 `loading`/`updated`/`reset`/`never`，全部复用；只补 24 个净新键（organizationNotFound/copyOrganizationId/createdLabel/rateLimitsLabel/organizationRole/noMembersFound/organizationSettings/budgetLabel/maxLabel/noLimit/addMemberTitle/editMemberTitle/roleOrgAdmin/roleInternalUser/roleInternalUserViewer/roleDescOrgAdmin/roleDescInternalUser/roleDescInternalUserViewer 与六个成员增删改 toast 键）；目录叶子 7576→7600
- 两把 translator：`const t = useTranslations("organizations")` 与 `const tc = useTranslations("common")`；页签只翻显示文案，`value` 仍为 overview/members/settings（`ORGANIZATION_TABS` 与 `?org_tab=` 的 URL 契约不动）
- 语义取值保留英文：成员弹窗的 `value: "org_admin"/"internal_user"/"internal_user_viewer"`、`defaultRole="internal_user"`、`orgExtraColumns` 的 `key: "spend"/"created_at"`，只翻 title/label
- `TPM`/`RPM` 是缩写故沿用（"TPM: 0" 断言不变）；测试改中文：三个页签名（概览/成员/设置）、`tabpanel` 名、`/编辑设置/` 按钮、"未找到成员"；`findByLabelText(/Organization Name/i)` 命中的是仍未接入的 `org-settings/OrgSettingsForm.tsx`（`label="Organization Name"`），故保持英文
- 本地验证：`src/lib/i18n`（16 例）+ `organization_view.test.tsx`（14 例）+ 家族/消费者 `components/organization` 与 `app/(dashboard)/organizations` 共 8 文件 88 例通过；消费者 `OrganizationsPanel.test.tsx` 整体 mock 掉本视图、不受影响；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败（与基线一致）；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 规则集完全一致（11 warn/0 err，与 HEAD 同为 11）；两个代码文件本就 prettier-clean、无需 `--write`，两个消息目录保持既有债不动；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 492（53.9%，+1：`organization_view.tsx` 新挂 `useTranslations`）；目录叶子 7576→7600；中英同值 89 不变

## 2026-10-15 第 74 簇更新

批次 24 第 74 簇：`components/user_agent_activity.tsx`（用户代理活跃度）——"按用户代理汇总"卡片区（前 4 个代理的 Success Requests / Total Tokens / Total Cost）＋ 组合框筛选（多选 tags、清空、空态）＋ 外层 DAU/WAU/MAU 与 Per User Usage 两组页签、内层 DAU/WAU/MAU 三个堆叠柱状图（近 7 天 / 7 周 / 7 月）。选它的原因是长尾已按"文件级剩余字符串量"排序，它与 `vector_store_providers.tsx` 并列在顶部，但后者是配置模块 + 4 个只部分接入的跨文件消费者，风险偏高，故先取这个单文件 + 单测试的自足簇。4 文件 +93/−59（两个消息目录各 +20/0，组件 +25/−23，测试 +28/−36）

- 新开顶层 `userAgentActivity` 命名空间 18 键（summaryTitle/summarySubtitle/filterLabel/allUserAgents/clearFilter/noUserAgents/successRequests/totalTokens/totalCost/noData/tabPerUser/sectionTitle/sectionSubtitle/dailyTitle/weeklyTitle/monthlyTitle/weekBucket/monthBucket）；目录叶子 7558→7576
- 参数化两处桶标签：`generateWeeklyChartData`/`generateMonthlyChartData` 的生成键与回填查找键都改用 `t("weekBucket", { n })`/`t("monthBucket", { n })`，两边必须取同一 ICU 结果才能让 `chartData.find(...)` 命中；接口返回的 `date`（"Week 1 (Jan 1)"、"Month 1 (Jan)"）仍是英文，`/Week (\d+)/`、`/Month (\d+)/` 正则保持不变、不需动
- 保留硬编码缩写：DAU/WAU/MAU 三个内层页签与外层 "DAU/WAU/MAU" 页签按惯例留英文；`sectionTitle` 文案里的 "DAU/WAU/MAU" 随 `t` 走
- 测试：`user_agent_activity.test.tsx` 由裸 `render` 改为 `tests/test-utils` 的 `renderWithProviders`（默认 `zh-CN`），断言整体翻成中文（"按用户代理汇总"/"不同用户代理的性能指标"/"按用户代理筛选"/"所有用户代理"/"成功请求数"/"Token 总数"/"总费用"、"日/周/月活跃用户 - 近 7 天/周/月"、`chartForTitle` 三个标题、`expectStackedTwoCategoryChart(..., "第 1 周"/"第 1 月")`）；被 mock 的 `PerUserUsage` `<div>Per User Usage</div>` 与接口 `date` 数据保持英文
- 本地验证：`src/lib/i18n`（16 例）+ `user_agent_activity.test.tsx`（7 例）通过；消费者 `UsagePageView.test.tsx` 40 例通过；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败（与基线一致）；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 逐条一致（24 warn/0 err，与 HEAD 同为 24）；prettier 对 `user_agent_activity.test.tsx` 已 `--write`（HEAD 本为 0 债），组件本已 0 债，两个消息目录保持既有债不动；`npm run build` 通过
- 指标：非测试 `.tsx` 912 接入 491（53.8%，+1：`user_agent_activity.tsx` 新挂 `useTranslations`）；目录叶子 7558→7576；中英同值 89 不变

## 2026-10-15 第 73 簇更新

批次 24 第 73 簇：`components/templates/key_edit_view.tsx`（密钥编辑抽屉）及其同屏的自定义控件家族——`KeyEditViewControls.tsx`（密钥类型/限流/智能体技能/元数据四组控件）、`keyEditFormValues.ts`（zod 表单）、`estimatedOutputTokens.ts`（预估输出 Token 提示与校验）、`keyEditFieldNormalizers.ts`（哨兵选项与占位符）。这五个文件互相 `import`、共用一个表单，拆开会留下半英文的一屏，故并作一簇；因 `buildKeyEditFormSchema`/`estimateMessages` 的签名变化，连带改了唯一的小消费者 `team/TeamInfo.tsx`。12 文件 +668/−496（两个消息目录各 +83/0）

- 新开 `virtualKeys.editForm` 子命名空间 67 键（密钥类型四选项与其 hint、模型/预算/回退/限流/标签/提示词/直通/访问组/智能体/向量存储各行标签与 hint、组织与团队的锁定态、标签迁移 toast、`saveChanges`、`tagsFetchFailed`）＋ `virtualKeys.estimatedOutputTokens` 5 键与 `teams.estimatedOutputTokens` 5 键（tooltipReserved/tooltipPerModel/tooltipAdminOnly/invalidPositive/invalidPerModel，两个命名空间结构相同、共用 `EstimatedOutputTokensTranslator` 类型）；目录叶子 7481→7558
- 复用优先：`virtualKeys.columns.*`（keyAlias/models/organization 等）、`virtualKeys.info.*`（teamIdLabel/tagsLabel/promptsLabel/routerSettingsLabel/allowedRoutesLabel/allowedPassThroughRoutesLabel/disableGlobalGuardrailsLabel/budgetFallbacksLabel/metadataLabel）、`common.cancel`、`guardrails.title`、`policies.title`、`budgets.tpmLimit`/`rpmLimit`，只补 77 个净新键
- 把模块级常量改成工厂：`keyEditFormSchema`→`buildKeyEditFormSchema(estimateMessages)`、`estimateRules(messages)`、`estimateTooltips(canEdit, t)`；`currentValuePlaceholder` 首版把 `t` 直列成第 5 个形参，被 eslint 的 `max-params`（上限 4）拦下，改为把 premium/empty 两条 hint 收进一个 `hints` 对象
- 一处 `useEffect`（`fetchTags`）的 catch 引入 `editFormT` 后，`react-hooks/exhaustive-deps` 新报"缺依赖 `editFormT`"；核对 next-intl 的 `useTranslations` 内部走 `useMemo`（返回稳定引用），故把 `editFormT` 补进依赖数组、不引入重跑
- `invalidPerModel` 的示例里含字面花括号 `{"gpt-4": 4096}`，ICU 会当参数解析，被 `messagesParity` 的"should quote every brace that is not a placeholder"守卫拦下；按仓库既有写法（`tokenValidationRulesTooltip`）把花括号逐字 ICU 单引号转义为 `'{'\"gpt-4\": 4096'}'`
- 未接入的邻居记作债：`key_team_helpers/ModelMaxBudgetEditor.tsx`（"Per-Model Budgets"/"Cap spend per model…"/"Max spend ($)"）与 `key_team_helpers/EndUserBudgetSelect.tsx` 的 `aria-label="Default Customer Budget"` 都在本簇之外，对应的集成断言保持英文
- 测试：`key_edit_view.integration.test.tsx`（102 例，37 组英文→中文断言整体替换）与 `estimatedOutputTokens.test.ts`/`keyEditFormValues.test.ts` 的 helper 断言改中文；`KeyEditViewControls`/`keyEditFieldNormalizers` 无独立用例
- 本地验证：`src/lib/i18n` + `templates/` + `team/TeamInfo.test.tsx` + `team/TeamInfo.integration.test.tsx` + `team/TeamAdminSettingsForm.test.tsx` 共 17 文件 436 例通过 + 2 例预期失败；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 逐条一致（35 warn/0 err，与 HEAD 同为 35）；prettier 对 `keyEditFieldNormalizers.ts`/`key_edit_view.tsx` 已 `--write`（HEAD 本为 0 债），两个消息目录与 `TeamInfo.tsx` 保持既有债不动；`npm run build` 通过；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败
- 指标：非测试 `.tsx` 912 接入 490（53.7%，+2：`key_edit_view.tsx` 与 `KeyEditViewControls.tsx` 两文件新挂 `useTranslations`）；目录叶子 7481→7558；中英同值 89 不变

## 2026-10-15 第 72 簇更新

批次 24 第 72 簇：`components/templates/key_info_view.tsx`（密钥详情视图，含概览/节省/自动路由用量/设置四个页签）。选它是按"文件级剩余字符串量"排的——该文件在第 63 簇已挂 `useTranslations`（当时只接了页头），但主体 JSX、五个 toast、三处删除/重置/封禁确认弹窗仍是英文字面量，属于"已接入但仍有英文"的桶。6 文件 +428/−239（两个消息目录各 75/−1，源文件净增 185/−144，三个测试文件各 35/−35、23/−23、35/−35）

- 新开 `virtualKeys.info` 子命名空间 72 键：四个页签（`tabSavings`/`tabAutoRouterUsage`，`Settings` 与 overview 复用 `common`）、概览卡（`resourceInfoTitle`、`createdLabel`/`lastRegeneratedLabel`/`recentBadge`、`teamIdLabel`/`projectLabel`/`secretKeyLabel`）、预算展示（`ofBudget`、`resetsLabel`、`everyDurationNext`、`softBudgetNotFinite`、`throttleOnBudgetExceeded`）、设置面板八类标签与空值兜底、限流区七个 `*Value`、护栏/策略的加载与空态、生命周期回填（`lifetimeSpendValue`/`lifetimeBackfillAria`/`lifetimeBackfillHint`）、三处确认弹窗、五条 toast、兜底与错误（`notFound` 等）；目录叶子 7409→7481
- 复用优先：`virtualKeys.columns.*`（team/model 等列名）、`virtualKeys.header.backToKeys`、`virtualKeys.autoRotation.atTime`、`common.unlimited`/`never`/`settings`/`overview`、`guardrails.title`、`policies.title`，只补 72 个净新键
- 两处 `<strong>` 包裹的确认正文走 `t.rich(..., { name, strong: (c) => <strong>{c}</strong> })`，守卫的富文本白名单含 `strong`
- 预算重置文案的三层分支（无 reset_at 走 `common.never`、有 duration 走 `everyDurationNext`、否则裸时间戳）首版写成嵌套三元，被 eslint 的 `no-nested-ternary`（ERROR 级）拦下，改为 `let budgetResetDisplay: string;` + `if/else if/else` 再进 JSX；`formatTimestamp` 返回处直接接 `t("autoRotation.atTime", …)`，`en-US` 月名与 `Jul 22, 2026` 形态记为格式债
- 测试：`key_info_view.test.tsx`（20 对）、`key_info_view.budget_display.test.tsx`（12 对）、`KeyInfoView.handleKeyUpdate.test.tsx`（4 对 + 1 条 toast 断言）共 91 例全部转中文断言；`common_components` 里那个 `InheritedBudgetHint` 没有 `useTranslations`，其 `toHaveTextContent` 与 `question-circle` 查找保持英文、不改
- 本地验证：`src/lib/i18n` 3 文件 16 例全绿；`templates/` 目录 11 文件 276 例通过 + 2 例预期失败；10 个消费者文件 236 例通过 + 2 例预期失败；`tsc --noEmit` 880（基线，0 非测试）；eslint 与 HEAD 逐条一致（源文件 0 err/10 warn，三个测试文件 21/0/49）；prettier 债 0；`npm run build` 通过；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败
- 指标：非测试 `.tsx` 912 接入 488（53.5%，与第 71 簇持平——本簇接的是已挂 `useTranslations` 的文件，只清英文字面量、不加接入计数）；目录叶子 7409→7481；中英同值 89 不变

## 2026-10-15 第 71 簇更新

批次 24 第 71 簇：`components/pass_through_info.tsx`（直通端点详情页）与 `components/add_pass_through.tsx`（新增直通端点表单）。两者同屏成对、共享 HTTP 方法选择与超时/计费三段，拆开做会留下半英文的一屏，故并作一簇。6 个文件 +101/−23（两个消息目录各 101/−23），源文件净增 12/−14 与 76/−64

- 不新开命名空间，往第 66 簇已建的 `models.passThrough` 平铺键表里补 78 键（36→114）：两族共用的 HTTP 方法选择、请求超时、单次请求成本、请求头字面量只留一份，详情页与新增表单取同一个键；目录叶子 7331→7409
- 复用优先：`Path`/`Target URL` 直接取目录里已有的 `passThrough.path`/`passThrough.target`，取消/返回/页签/是否分别取自 `common.cancel`/`back`/`overview`/`settings`/`yes`/`no`，加载态取 `common.loading`；`saveChanges` 与第 67 簇 `routerSettings.saveChanges` 同值但分属两个命名空间，各留一份
- zod 校验消息写在模块级常量里，拿不到 hook，改成 schema 工厂 `endpointSettingsSchemaFor(messages)` / `passThroughFormSchemaFor(messages)`，组件里把 `t` 取出的消息对象传进去；`EndpointSettingsValues` 的推导从 `typeof schema` 改成 `ReturnType<typeof factory>`，类型不漏
- 新增表单的消息对象是 4 个属性，直接内联当参数会撞 `local/no-large-inline-object-arg`，故先落成命名变量 `formMessages`；最初又用 `useMemo(() => passThroughFormSchemaFor(formMessages), [formMessages])`，`exhaustive-deps` 判定 `formMessages` 每次渲染换新、memo 失去意义而报警，最终直接 `const schema = passThroughFormSchemaFor(formMessages)`——`useZodForm` 只在初始化时把 schema 交给 `zodResolver`，schema 换新对象不影响表单状态
- 测试接线 2 个集成测试（本来就用了 `renderWithProviders`，只换断言字面量）：详情页 7 处（"设置"页签、"编辑设置"、"保存更改"、`目标 URL`×5、"请求头（JSON）"×2、"单次请求成本"×2、"请输入目标 URL"），新增表单 9 处（"+ 添加直通端点"、"路由配置"、"添加直通端点"、`/HTTP 方法/`、三条校验消息、"请输入有效的 URL"、"取消"×3）；`QueryParamInput` 与 `KeyValueInput` 的占位符仍是英文，那是别的簇的账，本簇不动
- 顺手纠正 `models.passThrough` 块里 22 行 4 空格键名（第 66 簇留下的）为房内 6 空格，两个消息目录的 prettier 欠账从 90/96 行降到 46/52 行；剩下的 46/52 是这批簇之前就在的旧块，本簇没有新增
- 门禁：守卫 16 例全绿；两个集成测试 22 例；消费方 `PassThroughSettings` + `common_components` 30 文件 248 例；`tsc --noEmit` 总数 880、非测试 0；触达文件 eslint 8 警告与 HEAD 逐条一致（HEAD 探针同为 8 条、0 报错，未使用 stash）；HEAD 探针显示两个组件原本 prettier 全净，故对二者放行 `--write`，两个消息目录探针本就有欠账、按规矩不动；`npm run build` 退出 0；四片全量 886 文件 11581 例、8 失败 + 9 例预期失败，与基线逐例一致；接入数 486→488/912、53.3%→53.5%

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
- `formatTimestamp` 里的 `at` 连接词是文案、接成 `atTime` 的 `{date}`/`{time}`；`toLocaleDateString("en-US")` 的英文日期与时分 AM/PM 格式记为格式债留下
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

| 文件                                                        | 例  | 归因                                                                                   |
| ----------------------------------------------------------- | --- | -------------------------------------------------------------------------------------- |
| `cost-tracking/_components/cost_tracking_settings.test.tsx` | 7   | 上游既有失败，非汉化欠账（下方单列）                                                   |
| `components/model_add/CredentialModal.test.tsx`             | 5   | 断言欠账：`useTranslations` 缺 `NextIntlClientProvider` 上下文                         |
| `organizations/_components/OrganizationsTable.test.tsx`     | 3   | 断言欠账 + **组件残留 2 处**（下方单列）                                               |
| `agents/_components/agent_info.integration.test.tsx`        | 3   | 断言欠账：`Agent Name`、`Display Name`                                                 |
| `access-groups/…/AccessGroupEditModal.integration.test.tsx` | 2   | 断言欠账：选项卡名 `/MCP Servers/`                                                     |
| `components/templates/key_info_view.test.tsx`               | 1   | 断言欠账：第 53 簇 `DeleteResourceModal` 11 个消费者里漏掉的一个 `/^delete$/i`         |
| `components/shared/DataTable/DataTable.test.tsx`            | 1   | 早前迁 `renderWithProviders` 时漏改的裸 `render`（同第 54 簇 `guardrail_info` 那一类） |
| `lens/_components/LensSetup.integration.test.tsx`           | 1   | 上游断言与格式化函数对不上，非汉化欠账（下方单列）                                     |
| `agents/_components/agent_info.test.tsx`                    | 1   | 断言欠账：`Edit Settings`、`Description`、`TPM Limit`                                  |
| `agents/_components/add_agent_form.integration.test.tsx`    | 1   | 断言欠账：`Agent Name`、`Display Name`、描述占位符                                     |
| `agents/_components/AgentsTable.test.tsx`                   | 1   | 断言欠账：表头「消费（美元）」「智能体名称」                                           |
| `access-groups/…/AccessGroupCreateDialog.test.tsx`          | 1   | 断言欠账：名称、MCP/代理选项卡、创建按钮                                               |

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
- `Select All {n > 0 && \`(${n})\`}`的括号计数留作数据：与第 39 簇的`Connected (${n})`同一口径，JSX 里`{t} {' '}{cond}`保住原来那个空格，accessible name 仍是`全选 (2)`
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

- `DateGroup` 是内部桶名——`getDateGroup` 的返回值、`DATE_GROUP_ORDER` 的排序与 `map` 的 key 都靠这几个英文串，只有落到分组标题那一刻才翻译。`dateGroupLabel(t, group)` 用 switch 逐分支写 `t("conversationList.dateGroup.recents")` 这样的字面量：写成 `t(\`conversationList.dateGroup.${slug}\`)`的话`missingKeys`守卫（只匹配`\bt\(\s\*"…"`）看不见，键 union 也接不住模板串
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
- `pageOf` 的取值以 `·` 开头（` · Page {page} of {totalPages}` / ` · 第 {page} 页，共 {totalPages} 页`）：原来是模板串拼在计数后面，分隔符属于这句而不是那句，两个表达式相邻时 JSX 吃掉换行空白，拼接结果必须逐字节等于旧渲染
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

共享组件欠账（本簇绕开、没在原地修）：`DataTableToolbar.tsx:78` 的 `aria-label={\`Remove ${label} filter\`}`模板本身是英文，标签翻完之后按钮可及名成了`Remove 搜索 filter`；`DataTableFilterDrawer.tsx:49`的默认`title = "Filters"`同理。后者本簇在调用点显式传`logs.table.filtersTitle`，前者留给 `common_components` 长尾，改它要先决定模板进哪个命名空间

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

| 文件                                                                            | 首条错误                           | 归类                                                     |
| ------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `guardrails/_components/add_guardrail_form.decision_model.integration.test.tsx` | 找不到标签 `Guardrail Name`        | 第六类，guardrails 批次遗留                              |
| `guardrails/_components/guardrail_info.test.tsx`                                | `Guardrail stale-id not found`     | 非 i18n，取值/mock 问题                                  |
| `guardrails/_components/guardrail_garden_detail.test.tsx`                       | 找不到行 `Provider Decision Model` | 第六类                                                   |
| `agents/_components/AgentsTable.test.tsx`                                       | 找不到列头 `Spend (USD)`           | 第六类                                                   |
| `agents/_components/add_agent_form.integration.test.tsx`                        | 找不到标签 `Agent Name`            | 第六类                                                   |
| `agents/_components/agent_info.integration.test.tsx`                            | 找不到标签 `Agent Name`            | 第六类                                                   |
| `agents/_components/agent_info.test.tsx`                                        | 找不到按钮 `Edit Settings`         | 第六类                                                   |
| `access-groups/.../AccessGroupEditModal.integration.test.tsx`                   | 找不到 tab `/MCP Servers/`         | 第六类                                                   |
| `access-groups/.../AccessGroupCreateDialog.test.tsx`                            | 找不到标签 `Group Name`            | 第六类                                                   |
| `model_add/CredentialModal.test.tsx`                                            | `useTranslations` 上下文缺失       | 第一类，测试缺 `NextIntlClientProvider`                  |
| `view_logs/index.test.tsx`                                                      | 找不到 tab `Request Logs`          | 第六类，2026-10-14 第 13 簇已修                          |
| `organizations/_components/OrganizationsTable.test.tsx`                         | 找不到文本 `创建时间`              | 需复查：断言已中文化但组件未渲染中文表头，或渲染路径不同 |
| `shared/DataTable/DataTable.test.tsx`                                           | `render is not defined`            | 非 i18n，测试缺 import                                   |
| `mcp-servers/_components/mcp_server_edit.test.tsx`                              | 取值失败                           | 非 i18n，既有技术债（见 `FIXES.md`）                     |
| `UsagePage/components/KeyActivityPanel.integration.test.tsx`                    | 重试行为                           | 非 i18n，疑似时序                                        |
| `lens/_components/LensSetup.integration.test.tsx`                               | 找不到日期 `/2026-09-30/`          | 非 i18n，日期/数据                                       |

这些失败此前被各批次各自的"只跑本目录"验证漏掉，且 `PROGRESS.md` 顶部"1 失败"的旧快照是更早提交上的数字，已经过时。修一批就跨目录复跑一次全量，或至少把改动文件的下游消费方一起跑，才能及时抓到这一类

## 统计口径

覆盖率按"文件是否引入 `next-intl`"计算，也就是 `src` 下非测试 `.tsx` 里含 `useTranslations(` 或 `getTranslations(` 的比例

这个口径偏保守，会低估实际进度，因为一部分文件本来就没有面向用户的文案（hooks、types、纯逻辑封装、`llm_calls` 这样的调用封装），它们永远不会"接入翻译"，但会计入分母。反向也不成立：一个页面外壳引入了 `next-intl`，不代表它的子组件都翻了，早期批次正是只翻了外壳

所以这个数字只适合看趋势，不适合当验收标准。真正的验收标准是"在中文下打开这个页面，看不到英文"，那只能靠人看或者靠测试断言中文

## 目录规模

| 项                     | 数值                                                                                                                                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 命名空间               | 40（此前记 39 是数错，`en.json` 顶层键实际一直是 40 个）                                                                                                                                                                                                        |
| `en.json` 叶子键       | 6748（2026-10-15 第 38 簇；6738 是第 37 簇后，6719 是第 36 簇后，6685 是第 35 簇后，6675 是第 34 簇后，6646 是第 33 簇后，6632 是第 32 簇后，6584 是第 31 簇后，6574 是第 30 簇后，6535 是第 29 簇后，6464 是第 28 簇后，6416 是第 27 簇后，6365 是第 26 簇后） |
| `zh-CN.json` 叶子键    | 6748                                                                                                                                                                                                                                                            |
| 键树一致性             | 一致，`messagesParity` 通过                                                                                                                                                                                                                                     |
| 中英文取值完全相同的键 | 86（产品名如 `CSV`、`MCP`、`LiteLLM` 等，属预期）                                                                                                                                                                                                               |

中英文取值相同的那 86 个不是漏翻。产品名、缩写、`CSV` 这类不需要翻译的词保留英文是刻意的，`GLOSSARY.md` 里有对应条目

## 文件覆盖率

`src` 下非测试 `.tsx` 共 861 个，已接入 `next-intl` 305 个，覆盖率 35.4%（2026-10-13，未记录命令）。2026-10-14 用"## 复测的三个数字"里的命令重测为 912 / 360，覆盖率 39.5%，第 14 簇后为 912 / 361，覆盖率 39.6%，第 18 簇后 912 / 375（41.1%），第 19 簇后 912 / 379（41.6%），第 20 簇后 912 / 380（41.7%），第 23 簇后 912 / 388（42.5%），第 24 簇后 912 / 399（43.7%），第 25 簇后 912 / 405（44.4%），第 26 簇后 912 / 407（44.6%），第 27 簇后 912 / 408（44.7%），第 28 簇后 912 / 412（45.2%），第 29 簇后 912 / 416（45.6%），第 30 簇后 912 / 417（45.7%），第 31 簇后 912 / 418（45.8%），第 32 簇后 912 / 418（45.8%，本簇文件此前已接入，比率不变），第 33 簇后 912 / 420（46.1%），第 34 簇后 912 / 421（46.2%），第 35 簇后 912 / 422（46.3%），第 36 簇后 912 / 423（46.4%），第 37 簇后 912 / 424（46.5%），第 38 簇后 912 / 425（46.6%）；分母与分子的口径都对不上旧那条，两组数字并列，只看趋势

## 按路由的进度

"未接入/总数"指该目录下的 `.tsx`，数字越小越接近完成

| 路由                 | 未接入/总数 | 路由               | 未接入/总数 |
| -------------------- | ----------- | ------------------ | ----------- |
| mcp-servers          | 5/43        | access-groups      | 2/8         |
| guardrails           | 4/35        | guardrails-monitor | 2/7         |
| playground           | 14/37       | budgets            | 2/6         |
| prompts              | 5/27        | memory             | 2/6         |
| models-and-endpoints | 2/21        | tag-management     | 2/6         |
| policies             | 3/18        | organizations      | 1/5         |
| agents               | 4/15        | skills             | 2/5         |
| vector-stores        | 5/15        | change-password    | 1/2         |
| caching              | 6/13        | router-settings    | 1/2         |
| usage                | 6/13        | transform-request  | 1/2         |
| cost-optimization    | 1/11        | ui-theme           | 1/2         |
| projects             | 3/11        | workflows          | 1/2         |
| cost-tracking        | 3/10        | api-keys           | 2/2         |
| search-tools         | 4/10        | old-usage          | 1/2         |
| users                | 2/9         | 其余单文件路由     | 各 1/1      |
| **共享 `src` 目录**  | **435/482** |                    |             |

共享 `src` 目录那一行是长尾，也就是批次 24。它贡献了 435 个未接入文件，占全部 556 个未接入文件的绝大多数，不过里面混着大量本来就不含文案的文件（hooks、types、纯逻辑封装），不能直接按这个数字估工作量

mcp-servers 名义上剩 5 个未接入文件，但其中 4 个本来就没有面向用户文案（页面壳、re-export、键常量表、测试 harness），校验文案已于 `5c2da87` 接入。cost-optimization 剩的 1 个同样是无文案的页面壳

## 测试状态

命令：`npx vitest run --reporter=json`，全项目，2026-10-12 实测

| 指标             | 数值           |
| ---------------- | -------------- |
| 用例总数         | 11306          |
| 通过             | 10856（96.0%） |
| 失败             | 450            |
| 有失败的测试文件 | 96             |

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

| 失败用例数 | 错误文本                                       |
| ---------- | ---------------------------------------------- |
| 383        | `Unable to find ...` 各类元素找不到            |
| 32         | `toHaveTextContent` / `toHaveValue` 等内容断言 |
| 24         | `toBeEnabled` / `toBeDisabled` / `toBeChecked` |
| 11         | 其他（数组深比对、`toBeVisible`、守卫测试等）  |

223 条缺 `NextIntlClientProvider` 已清零。剩下的主力是 383 条"找不到元素"，绝大多数是断言停在英文（第六类），但其中混有与翻译无关的既有失败，处理时要逐文件回 HEAD 基线确认，不要一律当成翻译的账

其他类里有两条不属于 i18n。`mcp_server_edit.test.tsx` 的 `preserves a stored client_id on OAuth-resume restore even when the saved snapshot is token-only` 报 `expected '' to be 'stored-client'`，当时判为取值失败而不是文案断言，已列为既有失败（2026-10-15 复查：是测试中文占位符正则写错，`f3b21f32` 修掉）。`tests/fetch-location-rule.test.ts` 报 `STACK_TRACE_ERROR`，这条守卫自 `610473c` 起就没动过，是上游带过来的

### 全量报告里有并发假失败，核实前要单文件复跑

上面的 450 是**一次全量运行**的原始结果，它不等于真实失败数，因为重型 integration 测试在高并发下会超时或竞态

已有的例子是 `edit_auto_router_modal.integration.test.tsx`：全量报告里 23 例失败，单独跑 64 例全绿（该文件单跑耗时 54 秒）。所以那 23 例是并发产物，不是缺陷

但不是所有集中失败都是假的。2026-10-12 逐个单文件复跑了失败最多的四个文件，结果与全量一致，都是真失败

| 文件                                                        | 全量 | 单跑 |
| ----------------------------------------------------------- | ---- | ---- |
| `cost-tracking/_components/cost_tracking_settings.test.tsx` | 14   | 14   |
| `projects/.../EditProjectModal.integration.test.tsx`        | 13   | 13   |
| `agents/_components/agent_info.integration.test.tsx`        | 12   | 12   |
| `add_pass_through.integration.test.tsx`                     | 12   | 12   |

这四个都是第六类：断言停在 `Save Changes`、`Advanced Settings`、`Project Name`、`Edit Settings` 这些已经变成中文的文案上

结论是处理失败清单前先单文件复跑，别信全量报告里的集中失败，也别因为一例是假的就把其余都当成假的

失败最集中的单文件

| 文件                                                                                             | 失败用例数 |
| ------------------------------------------------------------------------------------------------ | ---------- |
| `src/components/edit_auto_router/edit_auto_router_modal.integration.test.tsx`                    | 23         |
| `src/app/(dashboard)/cost-tracking/_components/cost_tracking_settings.test.tsx`                  | 14         |
| `src/app/(dashboard)/projects/_components/ProjectsPage.test.tsx`                                 | 13         |
| `src/app/(dashboard)/projects/_components/ProjectModals/EditProjectModal.integration.test.tsx`   | 13         |
| `src/components/view_logs/index.test.tsx`                                                        | 12         |
| `src/components/add_pass_through.integration.test.tsx`                                           | 12         |
| `src/app/(dashboard)/agents/_components/agent_info.integration.test.tsx`                         | 12         |
| `src/app/(dashboard)/projects/_components/ProjectModals/CreateProjectModal.integration.test.tsx` | 12         |
| `src/app/(dashboard)/prompts/_components/prompt_editor_view/VersionHistorySidePanel.test.tsx`    | 11         |
| `src/app/(dashboard)/usage/_components/components/UsagePageView.test.tsx`                        | 11         |

### 各路由的测试状态

| 路由          | 失败用例 | 失败文件 | 路由            | 失败用例 | 失败文件 |
| ------------- | -------- | -------- | --------------- | -------- | -------- |
| projects      | 82       | 10       | tag-management  | 11       | 3        |
| （非路由）    | 81       | 19       | users           | 9        | 1        |
| prompts       | 56       | 18       | router-settings | 8        | 1        |
| agents        | 55       | 10       | memory          | 7        | 2        |
| cost-tracking | 36       | 6        | skills          | 6        | 3        |
| playground    | 27       | 9        | change-password | 5        | 1        |
| usage         | 27       | 5        | mcp-servers     | 1        | 1        |
| budgets       | 21       | 4        |                 |          |          |
| caching       | 18       | 3        |                 |          |          |

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

| 模块                 | 用例数 | 结果     |
| -------------------- | ------ | -------- |
| cost-optimization    | 216    | 216 通过 |
| models-and-endpoints | 196    | 196 通过 |
| access-groups        | 73     | 73 通过  |
| organizations        | 37     | 37 通过  |
| workflows            | 16     | 16 通过  |
| transform-request    | 7      | 7 通过   |
| ui-theme             | 6      | 6 通过   |

i18n 自身的三条守卫也是全绿，16 个用例

## 汉化完成度实测（2026-10-13）

**测试全绿不等于汉化完成**，两者衡量的是不同东西。测试只说明"已有的断言与当前实现一致"，而没被翻译的组件通常也没有中文断言，它们既不红也不绿，只是没被任何断言覆盖。所以 99.99% 的通过率不能当作汉化收尾的证据

对 `src` 下 1232 个非测试 `.tsx` / `.ts` 做了一次启发式扫描：找未接入 `next-intl`、且含 JSX 文本节点或 `placeholder` / `aria-label` / `title` / `label` / `alt` 英文字面量的文件

| 项                     | 数量 |
| ---------------------- | ---- |
| 非测试源文件           | 1232 |
| 已接入 `next-intl`     | 309  |
| 含用户可见英文且未接入 | 232  |
| 已接入但仍有英文字面量 | 44   |

232 个里有 230 个被其他源码 import，另 2 个是 `app/chat/page.tsx` 与 `app/mcp/oauth/callback/page.tsx` 这类路由入口（Next 直接挂载，不需要被 import），所以**全部是活代码**，不是死文件。抽查确认不是误报：`components/activity_metrics.tsx` 里直接写 `<p className="text-sm text-muted-foreground">Total Requests</p>`

按目录看，前几名是 `components/add_model`（43 文件 / 171 处）、`components/Settings`（27 / 89）、`components/view_logs`（22 / 42）、`components/chat`（10 / 39）、`components/AIHub`（9 / 36）

`components/add_model` 这一行在 2026-10-14 已经过时：批次 24 第 1 到 12 簇把这 43 个文件基本扫完了，实测该目录 56 个非测试 `.tsx` 里 52 个已接入，剩下 4 个不产生可见英文（见"批次 24：add_model 与 edit_auto_router"一节）。同一命令下 `components/view_logs` 是 71 个非测试 `.tsx` 接入 2 个，是现在最密的目标。命令与口径见"## 2026-10-14 更新"

这正是 [PLAN.md](./PLAN.md) 里批次 24 的账。需要区分的是：[FIXES.md](./FIXES.md) 记的"批次 24 硬编码英文欠账清单"只是 2026-10-12 修 Provider 与 team 批次时顺手记下的 10 条已知欠账，那份清单清空不等于批次 24 完成

扫描是启发式的，会漏掉模板字符串里拼接的文案、常量表里的标签、以及非 JSX 位置渲染的字符串，也会把少量技术标识误判成文案。所以 232 是量级估计，不是可直接施工的精确清单；真要收口，得逐文件读一遍

### 2026-10-19 第 290 到 293 簇后的复测

到第 292 簇为止,「已接入但仍有英文」长尾逐簇清零(285 起累计减 16,含判定账归册)。**未接入侧复测(宽口径:JSX 文本节点加 placeholder/aria-label/title/label/alt 英文字面量)**:220 个未接入 `.tsx` 里命中 14 个,逐文件读一遍后 11 个是 `>svg<`/泛型参数/枚举数据值一类误报或判定账(TPM/RPM 缩写、sse/oauth 枚举),真实剩余仅三处 ui 原语:`sheet.tsx` 的 sr-only Close(复用 `common.close`)、`tooltip.tsx` 帮助图标 aria、`breadcrumb.tsx` 的 nav aria,已由第 293 簇接净,复扫命中随之降到 11 且全为误报或判定账。接入计数双口径复测备查:第 292 簇后带括号 `useTranslations(`/`getTranslations(` 调用 git grep 对 HEAD 复测为 689/912(75.3%,小节初稿记的 686 系扫描列表未含 dialog 接线所致,作废),含 `typeof useTranslations` 翻译器注入型 706/912(77.4%);第 293 簇后带括号口径为 692/912(75.9%),后续按带括号口径报数并把注入型单列

`networking.tsx`(44 命中)与 `provider_info_helpers`/`guardrail_info_helpers`/`callback_info_helpers`/`vector_store_providers` 各 5 到 26 命中全部维持"品牌枚举与 API 层不翻"判定;`agent_form_fields.tsx` 的 25 命中是 `FIELD_TEXT_KEYS` 查找键表(判定账)

## 下一步优先级

2026-10-20 追加（承 382-391 error-fallback 维度收口）：`playground/llm_calls/a2a_send_message.tsx` 专项已于 391 接其硬编回退子集——流式 `makeA2AStreamMessageRequest`（唯一 caller CompareUI:584）的 :296 "No response body" 复用 orphan `t("llmCalls.a2a.noResponseBody")`、:384 "Unknown A2A error" 接新键 `t("llmCalls.a2a.unknownA2AError")`，两串皆不含 "JSON" 故 `includes("JSON")` 流式解析错误判别逐 locale 不破、a2a 无单测但以 tsc 校签名位移 + 全 playground 168 例回归绿验 caller；非流式函数与流式内 server-detail/jsonRpc/`HTTP ${status}`/a2aError/errorMessage 动态透传判保留（后端串非 UI）。a2a 专项据此收口、无余留硬编 UI 英文待接；其余 error-fallback 漏已 382-389 接净、吞者（fetch_agents/prompts-utils/UITheme）入判定账。注：本节原 2026-10-13 文字（toast.fromError 355/handleError/copyToClipboard 三阻塞片）已于 380/381 接净、`useXxx` hooks error 已于 386 收口，相关「列入判定账」表述作废

第 353 到 361 簇逐维度收口后可接线余量的当前边界（下一轮勿从这些正则重扫，直接攻阻塞片或换新正则）：三元 `? :`（两侧与单侧）已复扫归零、可见串接净或入判定账；JSX 文本节点「独占一行英文句」更宽正则仅剩 how_it_works（361 已接）与 `APIReferenceView` 框架品牌名（判定账）；`placeholder`/`aria-label`/`title`/`label` 属性英文字面量复扫仅剩 JSDoc 注释（`numerical_input`）、格式示例（`add_plugin_form` "Productivity"/`AgentIdentityFields` "Agent.Invoke"）、协议头（`UpstreamTokenHeaderField` "Authorization"）四类判定账；短按钮文本节点复扫仅命中 `McpFormTestHarness` "Submit"（测试脚手架非产品 UI）。真正待做的剩余量集中在三件高扇出专项重构（`toast.fromError` 355 调用点、`handleError` ~100、`copyToClipboard` 34，均需模块函数首参注入 translator 且 `toast.fromError` 还须先把 `WARNING_TITLES.has(title)` 改成键/码判定）与「导出文档内容」维度其余报表件（各 dashboard 表格/图表的 CSV/HTML 导出，需逐件判人面 PDF 报告接、数据交换 CSV 列头留），以及更宽正则盲区（模板串内英文、`{...}` 内回落、`<code>` 内嵌、`{" "}` 拼接、单行 `>text<`），不据本报告宣布整体完成

第 308 簇开的第四条「模板串」扫描口径（引号内含三词以上英文，或占位符后紧跟英文短语）在 1289 个非测试 `.ts`/`.tsx` 命中 9 个文件，分账如下：`editServerPayload.differential.cases.ts` 与 `PromptCodeSnippets.tsx` 判测试样例与代码语料（判定账），`GuardrailsMonitor/usageUnits.ts` 的 `pricingIssueUrl` 拼的 `[Feature]: add X pricing...` 与 `the-feature` 句是喂给 GitHub `issues/new?template=feature_request.yml` 的 URL query 预填值、只作 `href` 不作可见文案（`usageUnits.test.ts` 也按解析 URL 断言），上游 issue 面属判定账不翻，`ToolPoliciesPanel.tsx`（308）、`ModelInsightsView.tsx`（309）、`MCPGatewaySessionsTab.tsx`（310）、`TierTurnsChart.tsx`（311）四片已接净，剩两片，当初判为 `t()` 替换不能解决、需重构的高扇出件，后以「模块函数/hook 首参注入 translator」约定逐簇化解，不再算重构阻塞：其一 `components/networking.tsx` 的 5 处 `toast.success/info` 英文（`Model X created successfully`、`Successfully updated value!`、`Field reset on proxy`、`Pass through endpoint updated successfully`、`UI Session Expired. Logging out.`），嵌在 `updatePassThroughEndpoint`、`modelCreateCall`、`updateConfigFieldSetting`/`deleteConfigFieldSetting`、`handleError` 等导出纯 API 函数里、无 React 上下文被全站复用，第 327/330/333 簇已按首参 translator 把前四条接净（`UI Session Expired` 属 `handleError`，~100 调用点、仅 1 条硬编码句余皆 errorData 透传，仍留判定账）；其二 `claude_code_plugins/helpers.ts` 的 label/display 串（`GitHub repo/subdir`、`Git|SSH subdir/repo`、`Zip archive`、`Unknown source`），由 `parseSkillSource` 与 `getSourceDisplayText` 两个纯函数产出、被两命名空间共用，已于第 326 簇把首参 `SkillsTranslator` 贯过整条 parse 链并改全部调用点接净。这两片化解后，四条原口径再无「改一行 t() 就接净」的真实目标；但第 312 簇把模板口径放宽到「反引号内 2 个以上连续英文词、`${}` 视作空白」重扫，1289 文件命中从 9 升到 138，其中 `provider_margin_table.tsx` 的 aria-label（312）与 `uploadValidation.ts` 的上传报错（313）已接净，其余混着 className 碎片/代码语料/agent system prompt 线值，还剩 `policies/index.tsx` 的 guardrail toast 等待甄别，故真 UI 短句尚未穷尽；剩下的是重构工程与启发式漏面（模板串起头形态、`t.rich` 内嵌英文、非 JSX 位渲染），所以命中清零不等于收口，本 fork 的上游持续演进，汉化按簇推进到此为当前可达的收口状态，不据本报告宣布整体完成。第三条高扇出阻塞片（第 359 簇登记）是 `lib/toast.ts` 的 `toast.fromError`：其 error-title 族（"Error"/"Server Error"/"Request Error"/"Access Denied" 加 `STATUS_TITLES`/`PROXY_TYPE_TITLES` 两张查找表）经 143 行 `show` 作 sonner 可见标题渲染，是真 UI，但 355 调用点贯穿需模块函数首参注入 translator（同 handleError/copyToClipboard 类），且 `WARNING_TITLES.has(title)` 以英文 title 判色、直译破分支须先改用键/码判定，专项重构未排期。后续若做上述重构，按 WORKFLOW 第六步为每片补 zh 断言再提交

第 334 簇开的第五条「JSX 文本节点」口径是当前最主要的真串余量：前四条口径只扫属性值与 toast 首参，`>`/`<` 间的裸英文子文本一直漏网。已甄别待接的真 UI help/空态句按特性域排成队列（`vectorStores` 于 334、cost-optimization 于 335 已接），后续逐域各成一簇：cost-optimization（`CostOptimizationView`/`TierTurnsChart` 335 已接、`UsageTab` 判误报清零）、usage（`UsagePageView` gateway 计量四处 336 已接、974 行凭证 hint 待 t.rich 另簇；Title Case 卡标题系检测盲区、须补扫）、cost-tracking `how_it_works`（两处 337 已接清零）、`AllModelsTab` 两处访问指引 340 已接（`t.rich` 含 `<link>` 与 `{team}`）、`skill_detail` 四段 marketplace 命令散文 342 已接、`SCIM`/`logging_settings_view`/`KeyProjectField`/`ModelInsightsView` 各一句 338 已接清零、`HealthCheckComponent` 标题副标与 `BudgetFallbacksEditor` blurb 去重 339 已接、`skill_detail` 两处内嵌元素句（可点 `<span onClick>`、inline `<code>` settings.json）343 已接 `t.rich`。第五条口径的富文本尾项 `impact_preview_alert` 已于 344 接 `t.rich`（`impact.affectedSummary`，`<strong>` 与 `{upTo}` 插值，四属性 values 抽成命名变量以过 `no-large-inline-object-arg`），本口径逐域枚举的真串队列至此清零。但 Title Case 卡标题、`{" "}` 拼接句、`<code>` 内嵌等检测盲区仍在（见 usage 条须补扫），故枚举队列清零不等于该维度命中归零，须按更宽正则补扫后再逐簇接线，不据本报告宣布整体完成（`usage` 974 凭据提示 341 已接）。补扫已自 345 簇启动：以「独占一行的裸大写句（含尾随 `{" "}`）」与「`>` 与 `<` 间单行英文」两条正则对非测试 `.tsx` 重扫，345 接 usage 域四枚（`usage.exportButton`/`projectSpend`、`topKeyView.tableView`/`chartView`，TopKeyView 视图切换英文测试八处翻面）、346 接 agents 域四枚（新增 `agents.addSkill`/`removeSkill`/`backToAgents`/`unnamedAgent`，`add_agent_form.integration` `/Add Skill/` 翻面，并顺带接出 agent_info 早前漏网的 `{agent_name || "Unnamed Agent"}` 回落串，印证补扫连「已接入」文件内部仍有裸英文）、347 接三枚散落按钮（新增 `vectorStores.clearHistory`/`costTracking.addAnotherModel`、复用 orphan `mcpServers.gatewaySessions.disconnectAll`，pricing_calculator 与 VectorStoreTester 两测试共六处英文断言翻面，`Disconnect all` 因 aria-label 覆写测试名故不受影响）。348 把 `AgentIdentityFields` 该段富文本 help 接 `agentIdentity.enterpriseObjectIdHelp`（`link` 包 `<a>`，门户专名 Entra/对象 ID/应用注册 随语境定译）；`APIReferenceView` 的三个 SDK 选项卡「OpenAI Python SDK」/「LlamaIndex」/「Langchain Py」系框架品牌名、整页又全是代码样例，判入判定账不翻。至此 345 起登记的补扫候选全部接净或入账，唯二正则本身仍漏小写起头标签、`{...}` 内回落串、`<code>` 内嵌、单行 `>text<` 与模板串内文案，下一轮须再放宽正则并逐文件复读才能确证该维度真正归零，不据本报告宣布整体完成。349 起加第三条正则扫「`{cond || "English"}` 表达式回落串」，349 接 `agent_virtual_keys`/`CodeInterpreterOutput`/`MessageDisplay` 三枚（Assistant 复用 `chatMessageBubble.assistant`）、350 接 `ByokCredentialModal`「Service」(`byokModal.service`) 与 `prompt_editor_view`「Unnamed Tool」(`prompts.unnamedTool`) 两枚显示名回落；判保留的 enum/数据 token 类——`PublicModelHubTableColumns`「Chat」/`RequestLogsTableColumns`「Success」/`SkillHubDashboard`「General」/`autoRouterRows`「Heuristic」/`ComplianceUI`「Uploaded Prompts」与同行服务端 enum/分类值同形（该列直接渲染 server 原文 enum，只翻 fallback 反与 server 不一致，判数据 token 保留），`HealthCheckComponent`「None」×8 穿过 `toCheckedAtLabel`/`toLastSuccessLabel` util 默认参与初态属高扇出专项重构判定账；API 错误回落族（`networking.tsx` 导出纯函数、`useCloudZeroExport`/`useCloudZeroDryRun`/`useStoreModelInDB`/`useStoreRequestInSpendLogs`/`useAgentTraces`/`useTestMCPConnection`/`fetch_agents`/`LogDetailContent` 的 `... || "Failed..."/"An error occurred"` 系 `throw new Error` 或 errorData 透传、与 `handleError` 同属高扇出判定账不翻）；代码语料回落（`CodeSnippets`/`semanticFilterTestUtils` 生成代码/JSON 请求样例里的 `"Your prompt here"` 等）判语料不翻。至此 `{...}` 表达式回落串口径扫描收口：可见显示名/alt 类真串已在 349/350 接净，余量全落数据 token/错误族/代码语料三类判定账。判保留不入队列者：代码语料、服务端凭据元数据、数字/URL 格式示例占位符、`EU AI Act`/`GDPR` 法规专名（中英同值品牌标识）

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

| 失败项                                                                                              | 性质                                                                                            | 处置                                |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------- |
| `DeletedKeysPage/DeletedKeysTable.test.tsx :: should show the total count in the pagination footer` | 第六类漏网。同一用例的 `pagination-range` 已改中文，紧邻的 `pagination-page` 停在 `Page 1 of 3` | 已改中文，单文件复跑 8 例全绿       |
| `mcp_server_edit.test.tsx :: preserves a stored client_id ...`                                      | 取值失败，非 i18n                                                                               | 保留，见技术债                      |
| `LanguageSwitcher.test.tsx` 2 例                                                                    | 设计冲突                                                                                        | 已修，helper 加 `locale: null` 出口 |

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

## 2026-10-21 第 422 簇：上游 main 同步

这一簇做的是上游同步本身，方法、数字与欠账记在 `UPSTREAM-SYNC.md` 第八节，这里只记与汉化账直接相关的几点。

合并把上游的新结构与我们的汉化接线拼在一起，产生两类待收口的问题：一类是上游改了辅助函数签名而我们改过同一批签名（llm_calls 系列首参注入译员，上游新增的调用点不知道要传），一类是文件被拼成半成品（上游新 JSX 配我们旧 import 与 state，出现找不到标识符）。本簇重接了 30 余个文件，其余 94 个文件的生产类型错误留到下一簇。

目录侧：合并后一次性清了 735 个无人引用的键（死键 735 → 0），新增与补回的键 22 枚（`playground.headerSubtitle`、`playground.tabs.decisions`、`usage.provider.totalSpend`、`usage.entity.ptuHours*`、`usageKeyActivity.searchFailed/requestsColumn/virtualKeysTitle/keyColumn/spendColumn`、`liteAdmin.askAria/homeSubtitle/recentChats/chatsAria/chatLabel`、`guardrails.custom.modeTagScoped/modeTagScopedShort/continueObserving`、`usage.usageViewAccessDenied/linkCopied/copyShareLink/gatewayRequestsByEndpointSubtitle/searchModels/searchByModelName/clearModelSearch`、`navbar.notifications.unread`）。i18n 四条守卫 17 例全绿。

合并基线踩了个坑并记在案：仪表盘侧原计划用上游 `303434d`（2026-09-26）当基线，实际我们的仪表盘停在 `v1.105.0`，用错基线会把上游自己的演进当成我们的改动，合并出大批半成品。改用 `v1.105.0` 后同批文件的冲突从 113 降到 0。

欠账：生产类型检查 330 条错误（94 个文件），测试文件 1123 条（合并前基线 878，大头是 vitest 全局类型缺失的 TS2304/TS2582，与上游同源），`npm run build` 暂时不绿。

## 2026-10-21 第 422 簇续：汉化层重接做完，生产类型检查清零

上一节记的是"还剩 330 条"。这一批把它们清完了，方法固定为三步：共享模块与目录键先修，调用点再按上游的新结构贴回汉化，模块级列定义把译员随 deps 传下去。

做完之后的数：生产类型检查 0 条，测试文件 419 条（合并前基线 878），i18n 四条守卫 17 例全绿，死键 0。

顺带记一笔：`tsconfig` 一直没把 vitest 的全局类型纳进来，测试文件里的 `describe`/`it`/`expect` 全是悬空引用（TS2304/TS2582 一共 651 条，其中 224 条就是 TS2582）。补 `"types": ["node", "vitest/globals", "@testing-library/jest-dom"]` 之后一次消掉 534 条。这条账合并前就在，只是被别的问题盖住了。

上游新增的东西也要按我们的规矩接：mcp server 的 `stdioEnabled`、桶分类的 `labelKey`、PTU 编辑项的 `labelKey`、回调来源的 `descriptionKey`、操作名 `key_detach_from_team`、回调路由的 `descriptionKey`，都补进了我们改过的类型与目录。

测试文件剩下的 419 条要逐个改（测试还在用旧 API 的 props 与文案），下一簇接着做。

## 2026-10-22 第 423 簇：合并带入的组件全部汉化

上一节把汉化层的接线重接完，生产类型错误清零，但合并带进来的 131 个新组件本身还是英文。这一簇把这一层做完，过程与数字记在 `UPSTREAM-SYNC.md` 第八节"Phase 5 收官"里，这里只记判定与欠账。

口径先说清。"合并带入的文件"用 git 树算，`HEAD` 树减 `main` 树，落在 `ui/litellm-dashboard/src/` 下、后缀 `.tsx`/`.ts`、不含 `.test.` 的文件，131 个 `.tsx` 加 90 个 `.ts`。这批文件此前一句汉化都没有。

"用户可见的字符串"用 AST 判，不用正则扫全文。`ui/litellm-dashboard/scripts/scan-english.mjs` 走 TypeScript 解析器，只收四类节点：JSX 文本、承载文案的 props、`toast.*` 的单参数调用、`new Error(...)` 的字面量。对象字面量形式的标签表（`ERROR_ENTITY_LABEL`、`GROUP_COPY`、`STREAM_SCOPE_OPTIONS` 这类）扫不到，靠 `--all` 模式补一遍人工过。这一条是这轮踩得最实的地方，正则扫全文会把 `describe()` 的用例名、注释、接口路径全捞进来，分不出哪些真会显示给人看。

数：131 个 `.tsx` 里 74 个文件命中 561 条候选串，清完后重扫剩 0 条可见英文。剩下的只有端点路径、品牌名、代码片段、快捷键提示和配置键名这类技术串，按仓库既有惯例保留。

模块级函数不能调 `useTranslations`，组件外会抛 Invalid hook call。凡是模块级函数要出文案的地方一律把译员当参数传下去，类型取 `src/lib/i18n/translators.ts` 里按命名空间命名的具名 translator。这轮新增的命名空间：`playground.systemOne`、`playground.inspector`、`playground.chat`、`playground.mcp`、`playground.modelName`、`playground.conversation`、`playground.composer`、`playground.controls`、`playground.pickers`、`playground.reply`、`playground.byok`、`usage.errors`、`usage.overview`、`usage.userActivity`、`guardrails.streamScope`、`deploymentHealth`、`telemetry`、`moyai`、`modelAdd`、`home`、`aiHub`、`modelInfo`、`commandPalette`、`searchBox`、`costOptimization`、`routerSettings.requestTagMappings`。

目录叶子键 10254 → 11022（新增 768 枚，英中两侧同数）。死键 0。生产类型检查 0 条错误。i18n 五条守卫 23 例全绿。`npm run build` 绿。

测试跟着翻面：errorsData 22 例、issueLabel 10 例、validatePayload 51 例、decisions + example 43 例、DeploymentWarningContent 12 例、RequestTagMappings 10 例，合计 148 例全绿。翻面的做法有两种，数据模块的单元测试用 `createTranslator` 从 `zh-CN.json` 取真值再断言中文；渲染测试用 `NextIntlClientProvider` 包 `zh-CN` 消息，让组件拿到真译员，断言改成中文后的可访问名。

新工具留在仓库里：`scripts/catalog-set.py`（按原文件风格改目录，未变更部分逐字节保留，对两个目录做过 round-trip 验证）、`scripts/catalog-batch.py`、`scripts/i18n-apply.py`、`scripts/i18n_helper.py`、`ui/litellm-dashboard/scripts/scan-english.mjs`、`ui/litellm-dashboard/scripts/add-i18n-hooks.mjs`。

还欠着：zod 的自定义校验消息（`systemOneUI/lib/schemas.ts` 与 `openAIDecisions.ts` 里那些 `refine(..., "Model must be a non-empty string.")`）仍是英文，要译得把 schema 改成按译员构造的工厂函数，`openAIDecisionsForm.ts` 用了 `openAIDecisionsRequestSchema.shape.input`，改签名要一起动。测试文件的存量类型错误 418 条（合并前基线 878），大头是测试还在用旧 API 的 props 与旧英文断言，与汉化无关。渲染扫描（`npm run scan:rendered`）需要起 dev server，本轮没跑，漏网的动态文案以它为准。

## 2026-10-23 第 424 簇：hook 误用清扫与两页收口

上一簇的清单只扫了合并改过的 87 个文件，漏掉了被合并覆盖回英文的旧文件。全库重扫后是 178 个文件、736 条可见英文。这一簇先做了两件事。

一是把 `useTranslations` 的误用扫干净。`react-hooks/rules-of-hooks` 报了 33 处，分布在 14 个文件：模块级纯函数里调 hook、表格列构造器里调 hook、事件回调里调 hook、zod schema 的 `refine` 里调 hook。这类问题只在渲染或校验时才炸，静态检查能拦住，所以按 lint 结果逐处改成把译员当参数传下去，或者复用组件作用域的 `t`。顺带修了 `claude_code_plugins/helpers` 里 `getSourceDisplayText` 少传一个参数导致的类型错误。

二是收口 `ModelInfoEditForm` 与 `model_info_view`。`ModelInfoEditForm` 是合并覆盖的典型：main 上整页是中文，合并后回到英文，连字段标签、占位符、缓存控制的注入点、知识库与标签的空态都丢了。zod schema 改成按译员构造的工厂后不再依赖 hook，五条英文校验消息换成目录里已有的中文。`model_info_view` 补完剩下 13 条。两个文件的测试合计 125 例全绿。

`AutoRouterBenchmarksTab` 还暴露了一个合并口径问题。合并时组件取了 release 的树，测试却留着 main 的版本，于是 36 例全红。release 的测试文件没带 `NextIntlClientProvider`（上游没有 i18n），直接拿来也是 36 例全红。最后的做法是取 release 的测试，换成 `renderWithProviders` 包住，断言按新的中文文案翻面，并把 `ALL_ROUTERS` 的哨兵值在渲染前换成目录里的「全部自动路由」。日期范围标签走 `Intl`，测试环境里跟着 `zh-CN` 输出「7月6日 – 8月5日 (UTC)」。

数：36 例全绿，可见英文只剩 `(UTC)` 这个标准时区缩写。生产类型检查 0 条，死键 0，i18n 守卫 23 例全绿。

## 2026-10-23 第 425 簇：v1.107.0 合并后第二批汉化

本节记 `8d69521186` 之后、在 `litellm_sync_v1.107.0` 分支上完成的 13 个提交。合并本身与汉化层四批重接见 `UPSTREAM-SYNC.md`。

批次按提交顺序：`aedb02675d` 团队页与创建团队表单、`06fdab310a` AI 中心模型表与决策模型卡、`684ea623d6` MCP 网络设置页、`45e3965106` 团队成员页预算来源与重置弹窗、`621e5c1f19` MCP 提交审核页、`fa8f72448d` 用量页统计条与错误分析、`da89b2fd0a` 访问组创建与自定义代码护栏、`fcf92c68dd` 密钥活动面板与全部模型表、`c60344faa1` 团队日志设置与搜索工具、`568afbbd07` 凭据表与日期范围选择器、`3137faf769` 用户编辑表单与用户表列、`68ce4a47b1` 成员编辑与用量图表零散文案、`3cbc8ee886` 凭据弹窗与对象权限。

做法沿用既有约定：键优先复用目录既有条目，通用按钮走 `common`，模块级函数把译员当参数传，新增译员类型集中在 `src/lib/i18n/translators.ts`。每批只跑相关 vitest，并同步翻面测试断言；合并带入的测试以 release 行为为准，只做语言与选择器适配。凭据弹窗那批还修了测试隔离：`renderWithProviders` 共享模块级 `testQueryClient`，JWKS 成功用例的缓存会让错误用例不发请求，在 `beforeEach` 里 `testQueryClient.clear()` 后 34 例全绿。

2026-10-23 复核数字：非测试 TSX 145 个文件 313 条可见英文命中（AST 口径，含技术串判定账）；目录叶子键 11482，英中同数；生产类型检查 0 条错误；测试文件类型错误 395 条；死键 0；`npm run build` exit 0；i18n 五条守卫此前 23 例全绿。

剩余工作：313 条命中里继续摘用户可见文案，团队页的 RPM/TPM、示例邮箱、品牌与协议标识等按既有判定保留；zod 自定义校验消息仍待改成按译员构造；`npm run scan:rendered` 尚未跑；测试文件类型错误与旧英文断言按文件逐个收；临时脚本 `scripts/scan-english-pos.tmp.mjs` 待删除。分支策略是在 `litellm_sync_v1.107.0` 上完成合并、测试与收口后再合入 `main`。

## 2026-10-23 第 426 簇：命令面板族接线与 nav 键路径裂缝修复

上游合并带进的 CommandPalette 族在 425 簇只接了一半：触发器占位（"Search keys…"/"Search or jump to…"）、提示条后半句（"to search keys"/"to search or jump to a page"）、对话框输入占位、分组标题（Actions/Pages/Keys/Recent keys）、动作卡题与副标、空态两句、类型标签（Key/Page/Action 渲染于 ResultRow）、"Unnamed key" 回落共十七处裸英文。新增 `commandPalette.trigger.*`、`hint.toSearchKeys`/`toSearchOrJumpTo`、`placeholder.*`、`group.*`、`entry.*`、`empty.noKeysMatch`/`noRecentKeys`、`typeLabel.key/page/action`、`unnamedKey` 十八键（两侧同数，叶子 11482 后复测 11508）。typeLabel 循"受限 union + 渲染层查表"先例：`CommandPaletteRowData.typeLabel` 保持 `"Key"|"Page"|"Action"` union，ResultRow 用 `as const` 映射表取键，喂给行数据的构造点不动。

渲染扫描同时暴露一条合并接缝裂缝：leftnav 的 `labelText`/`sectionText` 返回的是 `nav.*` 键路径（侧栏自己渲染时剥前缀查目录），CommandPalette 的 `flattenNavItems` 却把键路径直接当 title/section 渲染并参与 matchRank，中文界面会读出 `nav.logs` 裸键、按"日志"也搜不到。修法是面板内加 `useTranslations("nav")`（LoginPage `commonT` 先例），在 `navItems` memo 里把 `nav.` 前缀项解析成目录文本再交给匹配与渲染，前缀不变量由 leftnav 既有集中断言担保。

`Ctrl K` 判键盘键名技术串保留（循 Enter/J/K 例），进 `rendered-ui-fixtures.mjs` 的 `ALLOWED_ENGLISH` 白名单。

`CommandPalette.integration.test.tsx` 在 HEAD 基线即 18 例红（425 簇接线后断言未翻面），本簇全量翻面：combobox 名、dialog 名、提示条、占位、分组 role、选项名等按 zh 目录值重写；"logs" 键入改"日志"，Logs 选项名匹配用函数式 `(node)=>startsWith("日志")&&!startsWith("日志与")`（zh 下 "日志" 与 "日志与告警" 共享前缀，正则 /^日志/ 双命中）。31 例全绿。

验证：渲染扫描 59→29 命中（面板族与 Ctrl K 清零）；i18n 守卫与死键库 30 例绿、死键 0；生产 typecheck 0 错；eslint 六文件与 HEAD 计数持平（CommandPalette.tsx 5=5）；prettier clean。

## 2026-10-23 第 427 簇：桩形状三补缺，usage 与 guardrails 运行时错误清零

按 RENDERED-SCAN 的"桩的形状必须跟代理真返回的一致"契约补三处：`/user/daily/activity/aggregated/users` 整条缺桩（上游新增的按用户分页端点），`path.includes(fragment)` 最长优先命中的只有更短的 `/user/daily/activity/aggregated`，返回 `{results,metadata}` 里没有 `users`，`useUserActivityPage` 在 `page.users.length` 抛 TypeError；补 `{ users: [], total_users: 0, offset: 0, limit: 50 }`。`/guardrails/submissions` 同样缺桩，TeamGuardrailsTab 的 `res.submissions.map` 抛错后把原始英文错误消息渲染进页面（"Cannot read properties of undefined (reading 'map')"），补 `{ submissions: [], summary: { total: 0, pending_review: 0, active: 0, rejected: 0 } }`。`/user/daily/activity/aggregated` 的 metadata 只有 `total_spend/total_requests` 两枚，而 `overallUsageMetrics` 逐字段搬运 `DailyActivityMetadata` 十余枚，`KeySummaryStrip` 对 undefined 调 `toLocaleString` 抛错、整页落进路由错误边界（连带露出上游英文错误页文案），按产品自带 `EMPTY_DAILY_ACTIVITY_METADATA` 全量对齐。

复扫 59→25：usage 的 `length`/`toLocaleString` 两错与错误边界六句、guardrails 的 `map` 三片段清零；错误边界文案随崩溃消失，不在本簇翻译（上游 `error.tsx` 面另账）。usage 页真实渲染后露出图表轴与表头新命中（`Requests`/`Spend`/`cache read`/`failed`/`Oct`），与 home 族、`Undefined Role` 十页同判下一批。桩改动无产品源码变更、无测试翻面；`stubFor` 最长优先匹配经三前缀共存验证。

## 2026-10-23 第 428 簇：账户菜单角色标签显示层翻译

`formatUserRole` 的输出同时是权限比较哨兵（`old_admin_roles` 含 "Admin"/"Admin Viewer" 字面量、`projectReaderRoles` 含 "Org Admin"、`isOrgAdminSessionRole` 与其结果逐字比较，AdminPanel 哨兵先例同形），标签本体不能动。改显示层：`roles.ts` 新增 `roleLabelForDisplay(t: CommonTranslator, label)`，九个英文标签逐个映 `common.role.*` 九键（新增，值循词汇表 所属人/管理员/内部用户 与既有「（只读）」构词），非角色串原样透传；渲染点接 UserDropdown 两处可见文本与两处 `accountMenuTrigger` aria 插值、SidebarAccountMenu 的 trigger aria、副行与 Badge 共七处。`useAuthorized` 的 `userRoleLabel` 保持英文，比较逻辑零触碰。

roles.test.ts 补三条：全标签集落 `role.` 键、非标签透传、`formatUserRole` 输出集恰被全覆盖（防两函数漂移）。消费测试翻面 3 处（`ByText("Admin")`→`ByText("管理员")`，mock 输入保英文）。验证：三测试文件 100 例绿、i18n 守卫 30 例绿、死键 0、生产 typecheck 0 错、eslint 四文件与 HEAD 持平（UserDropdown 3=3 皆既有）、prettier clean；渲染扫描 25→15，十页 `Undefined Role` 清零。

## 2026-10-23 第 429 簇：home/usage 可见面收口，渲染扫描归零

427/428 簇复扫留下的 15 条本簇清零。usage 概览条 UsageStatStrip 接 `usage.overview.statStrip` 的 ok/failed/tokensExact/cacheRead/successRate/ofBudget/noBudgetSet 七键；BreakdownChart 与 TopAgents 的 METRIC_OPTIONS/DIMENSION_OPTIONS 从裸英文 label 改 `{ value, labelKey } as const`，渲染层 `t(option.labelKey)` 解析（词汇表 metric.spend/tokens/requests、dimension.model/deployment/provider 六键），value 兼查询参数不翻。StackedUsageChart 的 totalLabel 默认值从 prop 缺省英文挪进组件内 `tc("total")`，ErrorsTab 显式传 `tc("failed")`。图表轴与首页日期的 `toLocaleDateString("en-US")` 两处（overviewData/homeContent）改 `@/lib/i18n/format` 的 formatDate。HomePage 接 leaderboardSubtitle（带 days 参数）与 usageAria；leftnav 的 getBreadcrumb 对 HOME_ROUTE 特判 `nav.home`，修掉首页面包屑裸英文。advanced_date_picker 的触发器显示弃 moment（`formatRange` 用 "MMM D, HH:mm" 硬英文），改 `useUiFormat().date` 一次组合格式化：en 出 "Oct 16, 10:16"，zh 出 "10月16日 10:16"，逐 locale 自然加空，空态接 `advancedDatePicker.selectDateRange`。目录新增 18 叶（11508→11526，两侧同数）。

测试翻面五文件：UsagePageView.test.tsx 的 "N ok"/"N failed"/title "75,000 tokens"/轴标 "Jan 1" 按 zh 目录值重写；advanced_date_picker.test.tsx 断言改 zh 日期正则（逗号版被组合格式化推翻，空格版即 zh 自然输出）；leftnav.test.tsx 首页 breadcrumb 断言重写并对 mock 目录补 home 键；DashboardHeader.test.tsx 六用例包 CommandPaletteProvider（426 簇面板接了 useTranslations 后裸渲染会抛）；HomePage.integration.test.tsx 迁 renderWithProviders、`beforeEach` 加 `testQueryClient.clear()`（gcTime Infinity 的首页 blog 缓存跨用例泄漏，426 簇凭据弹窗同方）、首页/用量/发送等断言翻面。

验证：渲染扫描 12 页 15→0 命中；扩域 vitest（shared+usage+cost-optimization+dead-key+i18n，1081 例）42 红 = HEAD 基线逐文件一致，本簇净新增红 0；生产 typecheck 0 错；死键 0；eslint 触及文件与 HEAD 计数持平（leftnav 3 错、DashboardHeader.test 2 错皆上游快照既有）；prettier clean；`npm run build` exit 0。

## 2026-10-23 第 430 簇：zod 请求校验消息改按译员构造

上游快照把 playground systemOneUI 请求侧 schema 的 22 条校验消息硬编码成英文（schemas.ts 的 systemOneRequestSchema/decisionsRequestSchema 与 openAIDecisions.ts 的 openAIDecisionsRequestSchema），`validatePayload` 把 `issue.message` 原样转交 `toIssue`，中文界面的校验问题面板照旧出英文。改为译员参数化的构造函数 `buildSystemOneRequestSchema(t)`/`buildDecisionsRequestSchema(t)`/`buildOpenAIDecisionsRequestSchema(t)`（`SystemOneTranslator`，`playground.systemOne` 命名空间），消息逐条走 `t("validation.*")`；目录两侧新增 22 叶（11526→11548），en 值与原句逐字一致，zh 按该命名空间词汇表（instructions=指令、noul=是 / 否，属性名 'state'/'questions' 与 choice/noul/score 枚举值保留原文），带数字的三条参数化成 `{count}`。响应侧 schema 不动：`sendDecisionRequest` 把解析失败整体改写成 `"... response has an invalid shape."`，zod 消息不上屏。openAIDecisions.ts 拆出 `decisionsInputSchema` 具名导出供表单侧复用（原 `openAIDecisionsRequestSchema.shape.input` 读法随工厂失效，表单回读不展示消息、无需译员）。类型导出改 `z.infer<ReturnType<...>>`。

测试：validatePayload.test.ts 22 条消息断言翻成 zh 目录值；openAIDecisionsForm.test.ts 五例漏传 t（HEAD 基线即 TypeError 红），补 zh 译员后转绿；ValidationFeedback.test.tsx 四例裸 render 补 renderWithProviders 并翻面（2 个问题/请求内容有效/请求内容校验问题/可以发送/1 个问题待修正），playground 全量 533 例从 HEAD 86 红降至 77 红，逐测试名 diff 净新增 0。

验证：lib 目录 8 文件 146 例全绿；生产 typecheck 0 错；死键 0；触及文件 eslint 0 错（validatePayload 1 条 warning 既有）；prettier clean；`npm run build` exit 0。剩余 77 红为 SystemOneUI/PlaygroundChat 集成族旧断言与 provider 缺线，按测试债逐文件收的既定口径另簇推进。
