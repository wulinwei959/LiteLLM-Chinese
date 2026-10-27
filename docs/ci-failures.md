# CI 失败记录

> 现状锚（2026-10-27）：`ui-unit` 的 Vitest 当前为 `--maxWorkers=4`、job 超时 90 分钟；依赖安全的 8 条已按「`requires-python >=3.11` + 官方升级 filelock / pillow / next」修复，otel-api 与 msal-node 用带过期时间的 osv 豁免。下文各条里的 `maxWorkers=14` 等是当时实录，不代表现状

## 2026-10-25 unit / root 分片：select_ui 测试期望与 workflow 参数不一致

- 运行：GitHub Actions run 40227548016（workflow_dispatch，main@d040e4e0）
- job：root，失败步骤为 Run tests
- 现象：8 个用例失败，断言内容都是实际 npm 调用与期望 argv 不一致
  - 实际：`--maxWorkers=14`，来自 `.github/workflows/test-unit.yml` 的 `full_suite()` 与 related 调用
  - 期望：`--maxWorkers=4`，来自 `tests/unit/test_select_ui_test_scope.py`
- 根因：把 `.github` 回退到本地化前基线 `7547303c` 后，workflow 恢复为 14；此前 LAN 适配时把测试期望改成 4 的提交没有随 `.github` 一起回退，导致测试与 workflow 脱节
- 修复：把测试期望改回 14（`FULL_SUITE_ARGV` 与 related 调用两处），本地 `pytest tests/unit/test_select_ui_test_scope.py` 19 passed
- 性质：回退 `.github` 时遗漏的测试侧对齐，不是 runner、网络或代码缺陷

## 结论

GitHub 官方 runner 调度正常，root 分片其余用例通过；该失败只影响这一个测试文件，修复后需重新跑 unit 验证。

## 2026-10-25 unit / ui-unit：大规格 runner 标签不可用导致无限排队

- 运行：40227548016（同一轮 unit），job `ui-unit` 排队 20 分钟以上未启动
- 现象：job labels 只有 `ubuntu-latest-16-cores`
- 根因：大规格 runner 仅对付费/组织账户开放，公开个人仓库没有该标签的 runner，任务会一直处于 queued
- 修复：把 `test-unit.yml`、`test-litellm-ui-unit.yml`、`test-e2e-redis-chaos.yml`、`lens-install-smoke.yml` 中 5 处 `ubuntu-latest-16-cores` 改为 `ubuntu-latest`
- 性质：fork 沿用了上游的大 runner 配置，迁移到公开免费仓库后不可用，与代码无关

## 2026-10-25 UI Unit Tests：切换 ubuntu-latest 后 20 分钟超时

- 运行：40229189629（push，main@08efc1f9），job `ui-unit-tests` 在 20m18s 处被取消
- 现象：步骤 `Run UI unit tests (Vitest)` cancelled，正好落在 `timeout-minutes: 20`
- 根因：上游 UI 工作流按 16 核大 runner 设计（`--maxWorkers=14`、20 分钟）；改成 4 核的 `ubuntu-latest` 后完整 Vitest 套件耗时超过 20 分钟。unit 工作流里的同名 ui-unit 恰好在 20 分钟内完成，属临界
- 修复：`test-litellm-ui-unit.yml` 与 `test-unit.yml` 的 ui-unit 超时从 20 放宽到 35
- 性质：免费标准 runner 与上游大 runner 的性能差异，不是测试或代码问题

## 2026-10-25 UI Unit Tests：auto_router 两例保存按钮等待超时

- 运行：40230891563（push，main@af572303），job `ui-unit-tests` 在 24m34s 处失败，不是超时取消
- 现象：13058 例里只挂 2 例，都在 `edit_auto_router_modal.integration.test.tsx`，失败断言都是
  `waitFor(() => expect(保存更改按钮).toBeEnabled(), { timeout: 5000 })`；其余 13047 例通过
- 对照：同一轮 40230891551 的 `unit / ui-unit` 跑的是同一份完整 Vitest 套件，24m38s 全绿
- 根因：保存按钮要先等 `useAutoRouterAvailability` 的 300ms 防抖加一次 availability 请求返回，
  在 `--maxWorkers=14` / 4 核 `ubuntu-latest` 的满载尾段，worker 会被长时间挤占，5 秒真实时钟
  不一定够走完这一段。该预算此前已从默认 1s 提到 5s（`4550833`），本次是同一时序边缘在更慢的
  官方 runner 上再次出现，失败集合在两次相同套件之间漂移，说明与用例内容无关
- 修复：把该文件 54 处保存按钮可用性等待统一从 5s 提到 15s，其余等待不动；本地复跑 66 例全绿
- 性质：测试等待预算不足，不是产品缺陷，也不是翻译/回退引入

## 结论（第二轮）

25 个工作流的结构与上游一致，`unit` 主链路 55/55 全绿；独立 UI 工作流只剩上述 2 例时序假红，
放宽等待预算后重跑验证。

## 2026-10-26 unit / ui-unit：KeyActivityPanel 重试等待超时，并合并重复的 UI 套件

- 运行：40233205062（push，main@03272491），job `ui-unit` 在 24m47s 处失败，步骤 `Run UI unit tests (Vitest)`
- 现象：970 个文件里只挂 1 例，`KeyActivityPanel.integration.test.tsx:403` 的 `findByRole(/key-51/)` 等满 5 秒
- 实据：失败文件 16 例耗时 65.2 秒，失败用例 17.9 秒，同文件相邻的同类用例 24.2 秒；同轮 `TeamInfo.integration.test.tsx` 19 例 137.7 秒，多个单例 8 到 11 秒
- 对照：同一提交 40233205085（`UI Unit Tests`）跑同一份全量套件 19m05s 全绿，上一轮 `unit` 40230891551 也全绿，失败点在文件之间漂移
- 根因：`--maxWorkers=14` 跑在 4 核免费 `ubuntu-latest` 上约 3.5 倍超配，满载尾段单次渲染被拉长到秒级，5 秒 `asyncUtilTimeout` 不够
- 修复：该文件三处 `key-51` 等待（218、403、436 行）提到 15 秒；同时删除上游已移除的 `test-litellm-ui-unit.yml`，UI 全量套件只在 `unit / ui-unit` 跑一份，不再每轮 push 重复执行
- 性质：测试等待预算不足，不是产品缺陷

## 结论（第三轮）

UI 套件合并后只剩 `unit / ui-unit` 一份；三处等待放宽到 15 秒后需重新跑 unit 验证。

## 2026-10-26 unit / ui-unit：ChangePasswordForm 断言等的是元素出现，不是值变空

- 运行：40252965363（push，main@c90ef73a），job `ui-unit` 第 10 步 `Run UI unit tests (Vitest)` 失败，其余 54 个 job 全绿
- 现象：973 个文件里只挂 1 例，`ChangePasswordForm.integration.test.tsx:54` 的
  `expect(await screen.findByLabelText("当前密码")).toHaveValue("")`，Received 为 `OldP@ssw0rd-2026`；
  13076 例里 13066 通过、9 例预期失败。同轮两道汉化门禁（英文 284/284、中文取值 215/0）与 UI 类型检查都是绿的
- 对照：上一轮 40249622617 同一份全量套件全绿，失败点从 KeyActivityPanel 漂到本文件，属同一族的负载相关漂移
- 根因：这一类断言的等待原语与断言对象不匹配。组件在 `await changePasswordCall` 之后才 `form.reset()`，
  清空落到 DOM 需要 React 再一次调度；而 `findByLabelText` 首次检查是同步的，该输入框从头到尾都在文档里，
  所以它立刻返回并只断言一次，命中重置前还是重置后取决于谁先跑。**把 `asyncUtilTimeout` 调大对这种写法无效**，
  因为它不会因值不对而重试，这和前两轮"等待预算不够"不是同一个问题
- 取证：临时把期望改成重置前的 `OldP@ssw0rd-2026`，该用例依然通过，说明第一次同步检查那一刻字段确实还是旧密码，
  重置发生在之后的轮询里
- 修复：改为 `await waitFor(() => expect(screen.getByLabelText("当前密码")).toHaveValue(""))`，按值轮询；
  本地复跑该文件 6 例全绿
- 性质：测试写法不成立，不是产品缺陷，重置逻辑本身正确

## 结论（第四轮）

本轮只改 CI 实际挂掉的这一处。套件里 `findBy...` 后接 `toHaveValue` 的写法还有若干处，其中输入框只在异步数据
到位后才出现的，等元素即等价于等值，属正常用法；是否还有同族的"元素常驻但断言状态变化"需要按实际红灯再逐处判定，
不做无证据的批量改写

## 2026-10-26 修复验证：run 40259681120 全绿

- 提交：`9d38b32c test(ui): 改密码用例改为按值轮询重置结果`，推 main 触发 unit 工作流，18m52s 完成
- 结论：55 个 job 全部 success。`ui-unit` 13 个步骤逐条 success，其中 `Check for new English display strings`、
  `Check Chinese coverage of the catalogs`、`Run UI unit tests (Vitest)`、`Run UI type tests (Vitest)` 均通过
- 取证口径：以 `gh run view --json jobs` 的步骤结论为准。`gh run view --log` 拉 1.2 MB 作业日志时触发限流，
  返回码 124 且落地 0 字节，步骤级结论不依赖该日志
- 判定：第四轮的等待预算型假红与本轮的断言写法型假红都已消除，UI 套件在免费 4 核 runner 上恢复稳定

## 2026-10-26 unit / ui-unit：EntityUsage 与 VersionHistorySidePanel 等容器不等内容

同族的第三种写法缺陷，特征是"等的对象在渲染初始就已经存在"，等于没等。两轮连续红灯落在不同文件，
每轮只挂 1 例，属满载下的调度漂移。

### run 403（40262652707，main@3ed933e3）

- 失败点：`EntityUsage.test.tsx:567`，`Unable to find an element with the text: 标签 消费总览`
- 前提：`3ed933e3` 只改文档，UI 代码与上一轮全绿的 `9d38b32c` 相同，可排除本次改动引入
- 根因：标题在 `EntityUsage.tsx:470` 的 `loading ? <ChartLoader /> : ...` 之后才随 costPanel 挂载；
  用例只 `await waitFor(() => expect(mockTagDailyActivityCall).toHaveBeenCalled())`，即"请求已发出"，
  紧随的 `getByText` 是同步单次检查。CI 的 DOM dump 里 `按标签筛选` 已渲染而面板仍是 ChartLoader，正是该窗口
- 修复：按正则枚举同文件 9 处同一写法（567/587/622/637/652/667/682/1216/1229，所在用例均为 async），
  统一改为 `expect(await screen.findByText(...))`，与文件内 819 行既有正确写法一致；本地复跑 63 例全绿
- 提交：`033bf354`

### run 404（40266668178，main@033bf354）

- 失败点：`VersionHistorySidePanel.test.tsx:46`，找不到 `role=button` 且 name 匹配 `/v2/i` 的元素
- 根因：同一族。用例先 `await screen.findByRole("dialog", { name: "版本历史" })`，但该 dialog 由 `isOpen`
  立即渲染，等它不等版本列表落地；随后 `getByRole("button", ...)` 断的是 `getPromptVersions` 返回后的内容
- 修复：45、46 行改为 `await screen.findByRole("button", ...)`；本地复跑 25 例全绿

### 关于批量改写的一次否定结论

改完两例后先试着量化同族暴露面。按"等请求发出后 4 行内出现同步 `screen.getBy...`"这一窄判据，全仓命中
33 个文件 63 处，`UsagePageView.test.tsx` 的 8 处经逐一看过，断言对象是页签与选项这类挂载即渲染的静态外壳，
不构成竞态，未改。再试更宽的判据"同一 `it` 块内在任何 `await find`/`waitFor` 之前出现同步 `getBy...`"，
命中 518 个文件 3871 处，这个数本身就说明判据不成立，绝大多数组件本来就是同步渲染，`getBy` 是正确用法。
结论是这个仓库没有静态可判的同族规则，批量改写会摧毁大量正常用例；有效的口径仍然是只改 CI 实际红过、
且已核对该元素确被加载门控的位置，配合本文件按机制分类累积的判据

## 2026-10-26 免费 runner 适配：ui-unit 的 Vitest 并发从 14 降到 4

- 背景：`--pool forks --maxWorkers=14` 是上游按 16 核付费 runner 设计的，迁到免费 4 核 `ubuntu-latest`
  后成为 3.5 倍超配。run 403/404/405 三轮"每轮只挂 1 例、文件随机漂移"的环境根源即此
- 实测锚点：同一配置下 Vitest 步全量墙钟 16m13s（402 绿）到 22m58s（403 红），方差约 ±40%；
  串行测试时间 11215 秒
- 过程：先按折中方案降到 8（`b65856a5`，负载指数 2.0，job 超时 35 改 60）。run 406 的 `ui-unit`
  在 8 workers 下 21m22s 全绿，但把失败 job 单独重跑也能通过，说明失败与并发压力强相关、属随机错误
- 决策：改为核数匹配的 4（负载指数 1.0），job `timeout-minutes` 提到 90；8 与 14 都只是降低引爆概率，
  只有 1.0 的负载指数才消除超配
- 同步：`tests/unit/test_select_ui_test_scope.py` 的 `FULL_SUITE_ARGV` 与 related 期望两处同步改为 4，
  本地 19 例通过（该测试钉住 workflow 的 argv，历史第一轮红就是两者脱节）
- 实测结果（run 408，`c7228ea9`）：55 个 job 全绿，`ui-unit` job 17m08s、Vitest 步 14m45s。
  与另两档对比，同一套件三轮：14 workers 为 18m37s / Vitest 16m13s（另有 22-23 分钟的红灯轮），
  8 workers 为 24m15s / 21m22s，4 workers 反而最快
- 推算修正：改前预计 4 workers 需要 50-57 分钟，算法是拿 14 workers 下测得的串行 11215 秒除以 4。
  该估计高估了，因为那些单文件时长本身被争抢放大；实测 4 workers 最优，说明 4 核上此套件在
  负载指数 1.0 时吞吐最高，超配是负收益
- 代价与后续：实际没有付出额外时长，无需拆 job；若未来套件继续膨胀，优先考虑按目录拆成多 job
  并行，而不是提高单 job 的 workers
- 审计结论：43 个工作流中 20 个已停用（上游发布/issue 自动化/需密钥），其余 runner 标签全部干净；
  OSV Scan 与 LiteLLM Rust 的历史失败是 10-20 至 10-24 账务窗口期的 runner 启动失败（annotation 为
  payment failed），非测试问题；`test-merge-smoke` 的 windows-sdk 与 `test-litellm-ui-build` 的 Docker
  构建（均 10 分钟、PR-only）在 2 核 Windows / 4 核 Linux 上属边缘值，红了再提，不预先加时

## 2026-10-26 安全分析启用与工作流精简

- CodeQL 与 Scorecard 适配后启用。两者的定时那一路原本在本仓恒不执行：CodeQL 的 job 带
  `github.repository == 'BerriAI/litellm'` 守卫，Scorecard 的 `if` 读 `github.event.repository.default_branch`
  而 schedule 事件下该对象不存在。分别改为无守卫加每周一 04:00 UTC、`github.ref == 'refs/heads/main'`
  保留每周四与手动触发。Scorecard 的 `publish_results` 关掉并撤掉随之无用的 `id-token`，不再向 OSSF 外发
- 新增 `release-docker-image.yml`，仅手动触发，版本号取最新 `litellm_sync_v*` 分支，产物作为本仓 Release 附件
- 删除 19 个不适用工作流（17 个已停用加 `e2e_record_replay` 与 `weekly_load_anomaly` 两个没有 provider
  密钥就无法工作的）。文件数从 44 降到 25，其中 24 个 active、`image-scan.yml` 停用备用。排除配方写在
  `ui/litellm-dashboard/docs/i18n/UPSTREAM-SYNC.md`，后续同步必须带 `--exclude-paths`，否则上游会把这些
  文件按新增带回
- 这批工作流引用的脚本与单测暂留，`uv_sync_with_retries.sh` 因多个在用工作流依赖必须保留
