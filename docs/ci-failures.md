# CI 失败记录

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
- 根因：上游 UI 工作流按 16 核大 runner 设计（`--maxWorkers=14`、20 分钟）；改成 2 核的 `ubuntu-latest` 后完整 Vitest 套件耗时超过 20 分钟。unit 工作流里的同名 ui-unit 恰好在 20 分钟内完成，属临界
- 修复：`test-litellm-ui-unit.yml` 与 `test-unit.yml` 的 ui-unit 超时从 20 放宽到 35
- 性质：免费标准 runner 与上游大 runner 的性能差异，不是测试或代码问题
