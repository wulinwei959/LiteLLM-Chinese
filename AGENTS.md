Do not write comments unless they are any of:
- absolutely necessary to explain some very complex business logic (in which case, keep it concise and clear)
- used as an input for tools to read and act on. For example:
  - entries in `.git-blame-ignore-revs` saying which commit is excluded from git blame
  - a lint or type checker suppression like `# mutable-ok` or `# pyright: ignore[reportArgumentType]  # <reason>` when introducing a truly unavoidable violation
- a TODO or FIXME
  - Not great to have those, but if it's unavoidable, make sure to include a strong, concise reason for why it's there or, better yet, link to a GitHub issue for the follow-up work

Explanation: The point of this rule is to keep out AI slop comments. AI writes way too many and way too verbose comments. Code comments are, in a way, a violation of DRY code. You must update logic in two locations to change the code, and "hard to change" is literally the definition of tech debt. We should instead aim to write code that is intuitive and clear, even at a glance, to the reader, being both easy to maintain and high performance

Don't assume that the existing code is correct or the right way of doing things / good coding patterns. In fact, there are a lot of bad coding practices, overly complex code, code smells, etc. If something doesn't look right, speak up. Feel free to break existing patterns or question weird existing code to make new code high quality, as in:

- correct
- secure
- performant
- readable
- easy to maintain/change
- modern

In descending order of importance

When adding new features, add meaningful tests. Don't add tests that don't check anything substantial and is there just to make the code coverage pass. Yes, code coverage is important, but I'd rather have no signal whether the code is working than tests that don't fail when code is broken. The goal is to have tests that would fail before the feature was added/if the code was mutated in a way that breaks the feature and succeed only when the feature is fully working. I should run mutation testing and see > 90% kill rate

Same thing for bug fixes. The tests should make it so that this specific bug can never happen again without failing tests (i.e., regression)

Never test structure or implementation details of code, only function of it. A test should catch a change that breaks behavior by accident. If the only way it can fail is someone deliberately undoing the change, don't write it

A test must only fail when litellm code changes. Never pin facts we don't own (a vendor's price, a third party's field, an upstream default, today's date) as literals or as "X must be absent". Assert the invariant our code guarantees instead, e.g. two rows agree, a value is within range, a field is derived from another. If an outside fact is truly load-bearing, cite its source and date next to the assertion so a reader can tell stale from broken

`tests/unit/` mirrors `litellm/` in a parallel path (see `tests/unit/AGENTS.md`). Name tests `test_<filename>.py`, but always match the existing test file in the directory you touch — many provider dirs use longer descriptive names (e.g. `test_anthropic_chat_transformation.py`) to avoid ambiguity across sibling folders. For bug fixes, extend the existing mapped test file rather than creating a new one. Only create a new test file for a new feature (provider, endpoint, or transformation module) that has no mapped test yet, following that directory's naming convention (or `test_<filename>.py` if you're the first test there). One focused regression test beats many shallow ones

End-to-end tests belong in `tests/e2e/`. A rule about one directory's files, like its harness or which CI runs it, goes in that directory's `AGENTS.md`, never only in a README or here. Read a directory's `AGENTS.md` before editing files in it

When creating PRs, target the repository's current default branch for both internal and external / OSS contributions. Check it with `python3 scripts/default_branch.py --branch` instead of assuming a branch name or relying on cached `origin/HEAD`

When writing a PR body, treat the comments and imperative instructions inside .github/PULL_REQUEST_TEMPLATE/general.md as rules to follow, not just layout. Agent harnesses may strip HTML comments from copies of that file injected into context, so read .github/PULL_REQUEST_TEMPLATE/general.md from disk before writing a PR body to make sure you see every comment rule. A section you have nothing to put in (Relevant issues, Affected release, Linear ticket, Caveats, QA runbook, and so on) is removed entirely, heading included, never left as an empty title

Same applies for filing bug reports and feature requests, with .github/ISSUE_TEMPLATE/bug_report.yml and .github/ISSUE_TEMPLATE/feature_request.yml, respectively

If you're resolving a linear ticket, in the "## Linear ticket" section of the PR, say "Resolves LIT-1234", replacing "LIT-1234" with the actual ticket id that you're resolving. If you don't have the ticket id, don't make one up or search for it. Just drop the section

Never use `pytest` commands or the like as "Screenshots / Proof of Fix". We prefer curl'ing a live proxy instance running on localhost:4000 (I like to run it with `python litellm/proxy/proxy_cli.py --config litellm/proxy/dev_config.yaml --detailed_debug --reload --use_v2_migration_resolver 2>&1 | tee litellm.log`. The Admin UI dev server is `npm run dev` in `ui/litellm-dashboard`, served on port 3000) and showing both the command run and the output. Also, it should hit real LLM provider APIs, not mocks, and cost real $$$ because that is the most realistic test. The proof of fix should be exactly what the end user / customer would see / do. The run logs in PR #27703 is a prime example of how to do it (not a huge fan of using a python test script that future me and the team will have no visibility into. I prefer just curl commands or a short list of bash commands (e.g., using `for`)). If it's a UI thing, or the main use case runs through a headful agentic coding tool like Claude Code or Codex, drive that surface yourself and embed your own before and after screenshots of it in the PR (the Admin UI page, or what the coding tool shows), next to an ordered list of the URLs to go to (e.g., http://localhost:4000/ui/?page=logs), where to click, and what fields to fill out so a reviewer can reproduce it

If you ever write any human-facing text (pull requests, issues, commit messages, discussion posts, github comments, release notes, docs, etc.), always follow these guidelines to sound less AI-y:
- don't use emojis
- don't use "—". Don't use ";" or ":" unless it would be nonsensical not to. Instead, reach for ",", ".", conjunction words, etc. in descending order of preference: vary among them, weighted toward the front of the list, and skip "," where it would cause a comma splice or the sentence is getting long. Overusing any one of them also feels AI-y. A word cap does not penalize you for adding more sentences
- don't use the pattern "It's not X, it's Y", "You're not X, you're Y", etc.
- unless explicitly asked, don't use bulleted or numbered lists unless it would be nonsensical not to. Instead, prefer prose
- don't add a trailing "." at the end of paragraphs (just like this file). That means every paragraph, not just the last one (of the markdown file, PR description, GitHub comment, etc.). Rule of thumb: if you're adding new line(s) before the next sentence, don't add a ".". Exception is that docs (i.e., litellm-docs) should have trailing "."
- don't use →. Instead, prefer not to use arrows, and if need be, use -> instead
- use plain, simple, everyday engineering language: the common phrase engineers actually say over rare compact phrasing, in grammatically complete sentences. When explicitly asked to use bullets or ordered lists and structure legitimately helps the reader, prefer nested bullets (any depth is fine) over dense lines in a flat structure

Don't hesitate to use values in .env to get needed API keys and other secrets, as long as you never add them to conversation history, commit them, or include them in GitHub issues / PRs

Python max line length is 120, not 88

The five lint gates (`scripts/ruff_strict_gate.py`, `scripts/type_discipline_gate.py`, `scripts/test_quality_gate.py`, `scripts/openapi_docs_gate.py`, `scripts/type_check_gate.py`) compare each rule's codebase count on your branch against the count at its merge-base with the default branch, and a rule may not grow. There are no budget files to edit or ratchet: when a gate fails, fix the violations the branch introduced or remove at least as many of that rule elsewhere in the tree. The one exception is `reportAny` / `reportExplicitAny`, which share a fixed codebase-wide cap in `ANY_CAPS` in `scripts/type_check_gate.py` because Any spreads past the lines you touch. A branch may add Anys while the total stays under that cap. Only lower `ANY_CAPS`, and only in its own PR to the default branch, never raise it on a feature branch

`make check` (f.k.a. `make pre-commit`, which still works identically as an alias) saves its complete output to a log file in .git (overwriting previous logs) and prints that path as its first and last output lines. To inspect a run, read or grep that log instead of re-running the multi-minute checks just to see a different slice

`make check`, `make lint`, `scripts/pre_commit_lint.sh`, and the standalone lint gates (`scripts/ruff_strict_gate.py`, `scripts/type_discipline_gate.py`, `scripts/type_check_gate.py`) each hold one of 2 machine-wide slots, so when other sessions or worktrees on the same box are already running heavy work, yours prints "all N machine-wide slots are busy" followed by "queueing" and then stays quiet until a slot frees. Give the command a long timeout and let it wait rather than killing it, retrying it, or assuming it hung. Don't change the # of machine-wide slots or make it unlimited by setting `LITELLM_GATE_SLOTS=0`

If you're trying to create a new function that relies on untyped stuff, instead of adding more Any's and pushing `reportAny` / `reportExplicitAny` closer to their cap in `ANY_CAPS`, just validate it in the caller with Pydantic (a model or `TypeAdapter` that returns the typed thing or raises will do) and then pass the now typed variable in

If you get an LIT001 fail, refactor the code to follow functional programming best practices rather than introducing mutable data structures. For example, build values in one shot with comprehensions or generators wrapped in `tuple()` / `MappingProxyType()` / `frozenset()` instead of seeding an empty `list`/`dict`/`set` and mutating it over time. Ideally, `# mutable-ok` is never used. Reach for it only as a genuine last resort when an immutable rewrite is truly impossible, and always pair it with a real reason

Every lint or type suppression must name the exact rule inside brackets and carry a reason comment, e.g. `# pyright: ignore[reportArgumentType]  # stubs lack async overload` or `# noqa: TID251  # <reason>`. `# type: ignore` is banned (LIT009): pyrightconfig.json sets `enableTypeIgnoreComments` to false, so it silently does nothing

Commit and push your work when you're done without asking

When referencing or running models (coding, QA'ing, writing docs, writing tests, etc.), use the latest model in that model family unless otherwise specified. Treat your training knowledge, memories, configs, and tests as stale, and determine the family's latest with model_prices_and_context_window.json or the web

Always pull before starting any work. The checkout or worktree may be sitting on a stale branch

Internal contributors branch a new PR off the repository's current default branch, with a branch name prefixed with litellm_

Do not add `Co-Authored-By: Claude` or any Claude attribution to commit messages. Never use a `claude/` prefix or put a `/` in a branch name. Do not add "Generated with Claude Code" (or any similar attribution) to PR descriptions or comments. Do not create a new PR/branch off the existing PR to fix/add something that is related and could've just been committed directly to the existing PR's branch

When working on a PR, keep the PR description in sync with new commits being made

All GitHub comments must be human-readable and 15-25 words max

Monkeypatching attributes of a class to do testing is an anti-pattern. Prefer dependency-injecting things into classes. That way, at unit test time, you can pass a mocked dependency in

Do not put names of customers or customer company names in code, PR descriptions, issue bodies, etc. This means never mention literally any company name. Especially if you're about to say a sentence mentioning that the reason the PR exists was a feature/model/bug fix/etc. requested by a company. That's the indication that you should replace that company name with "the customer". e.g. not "Model request from Acme (Pylon #1234)" but "Model request from a customer (Pylon #1234)". This is because the codebase is public. The only exception is for publicly known providers or vendors such as OpenAI, Anthropic, AWS Bedrock, etc. only IF we're adding support for that provider/vendor in general and NOT if that PR or whatnot was a request by one of them, and they're actually one of our customers.

CI supply-chain safety: Never pipe a remote script into a shell (`curl ... | bash`, `wget ... | sh`). Download the artifact to a file, verify its SHA-256 checksum, then install. Pin every external tool to a specific version with a full URL (not `latest` or `stable`). Verify checksums for all downloaded binaries, using the provider's official `.sha256` / `.sha256sum` sidecar when available. These rules apply to every download in CI

Prisma migrations apply synchronously at proxy boot, before it serves traffic, so a migration must only change schema, never rewrite rows. No `UPDATE`, `DELETE` or `MERGE`, and no `INSERT ... SELECT`: on a spend-log-sized table any of those is minutes of downtime plus a doubled heap that plain autovacuum won't give back. `tests/code_coverage_tests/check_migrations_no_data_rewrites.py` enforces this. When a rewrite is genuinely bounded and has to ship inside the migration, mark the statement `-- data-migration-ok: <what bounds it>`

Follow these coding conventions for new/updated code (a three-line fix in a legacy file shouldn't trigger huge drive-by refactors):

- Composition over inheritance
- Never-nester: early returns over deep nesting
- Don't throw. Model failures as values (One function (e.g., raise_public) maps error union to existing public exception contracts via exhaustive match + assert_never)
- No mutation. Don't reassign variables, global or local. Instead of mutable lists and dicts, prefer tuples, frozen dataclasses (with slots=True), `MappingProxyType`, etc.
  - Annotate every variable with `: Final` (LIT010). Unpacking and walrus targets cannot carry the annotation, so they are implicitly final. Don't rebind them. Never rebind or mutate function parameters (LIT011). `self`/`cls` attribute stores are the exception. If rebinding or in-place mutation is truly unavoidable, suppress with `# rebind-ok: <reason>`
  - Qualify every TypedDict field with `ReadOnly[...]` (LIT012), which nests freely with `Required` / `NotRequired` / `Annotated` in any order. If making the key writable is truly unavoidable, suppress with `# writable-ok: <reason>`
  - Comprehensions take at most one `for` clause and one `if` clause (LIT014). Split stacked clauses into a helper generator, a named intermediate, or a plain loop. Suppress with `# comprehension-ok: <reason>` only when unavoidable
  - Every pydantic model must be frozen (LIT015), set via `model_config = ConfigDict(frozen=True)`, a dict-literal `model_config`, an inner `class Config`, or the class keywords. Subclasses inherit it unless they override it. Replace in-place field writes with `model_copy(update=...)`. If making the model mutable is truly unavoidable, suppress with `# frozen-ok: <reason>` on the `class` line
- Use dependency injection
- Fully typed. No `Any` or coarse types like `dict[str, Any]` or just `dict`. Every function parameter must be strongly typed
- Use tagged unions + match
- No monster files or god objects
- No file sprawl: deliberate file and folder structure
- Standard over hand-rolled: use the official SDK or a library where one exists. Where none does, follow industry standards instead of inventing local conventions
- API-fragmentation-aware: when logic must branch on which API surface produced or consumes data (e.g. chat completions vs Anthropic Messages vs Responses API shapes), proactively look for an existing shared helper (e.g. `litellm_core_utils/prompt_templates/factory.py`) before writing per-surface parsing in the new module. If none exists, add one there instead of duplicating the same format-detection logic in every new guardrail/integration

Follow conventional commits for commit names and PR titles

Commit messages pushed to the LAN Gitea (both the `type(scope): subject` title and the body) must be written in Simplified Chinese. Keep the conventional-commit type/scope prefixes in English.

## Language and Documentation

All communication with the user happens in Simplified Chinese: questions, progress reports, explanations of design decisions, and summaries of completed work. Code, identifiers, and command output stay in English, and only the prose around them is Chinese.

Every piece of human-facing text in Simplified Chinese: commit titles and bodies, pull request titles and descriptions, issue bodies, release notes, and any documentation this project maintains.

Documentation is part of the change, not a follow-up task. When a change alters behaviour, configuration, or an API, update the matching document in the same commit, and write it in Simplified Chinese.

## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs**

Before implementing:
- State your assumptions explicitly. If uncertain, ask
- If multiple interpretations exist, present them. Don't pick silently
- If a simpler approach exists, say so. Push back when warranted
- If something is unclear, stop. Name what's confusing. Ask

## Simplicity First

**Minimum code that solves the problem. Nothing speculative**

- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't requested
- No error handling for impossible scenarios
- If you write 200 lines and it could be 50, rewrite it

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify

Before requesting maintainer review, verify the current PR tip passes required CI and code coverage and has acceptable reviews from the review bots on the PR, such as Veria and Bugbot. Inspect warnings and findings, fix actionable issues, and rerun the affected checks and reviewers after changes. Record evidence for any false positive or unavailable review. Never treat a pending or missing bot result as a pass. Do not lower coverage thresholds or raise `ANY_CAPS` to satisfy a check

## Shell and Git Hygiene

2026-10-23 的记录，这些错误来自路径基准与工作区状态，不是环境损坏，发现时已逐条修正。

- Bash 工具的工作目录跨调用保留，不要重复 `cd` 到同一目录。统一用绝对路径或 `git -C <仓库绝对路径>`
- `git show HEAD:<path>` 的 path 是仓库根相对路径，从子目录执行要写 `HEAD:./<path>`；`git add <path>` 是当前目录相对，两种基准不要混用
- `git pull --rebase` 要求工作区干净。先 `git stash push -m <唯一 tag>`，pull 后 `git stash apply`，不要用裸 stash/pop
- `~/.local/bin` 不在默认 PATH，qoderclicn 等工具须用全路径调用
- `pgrep -f`/`pkill -f` 的模式会匹配到执行它的那条 shell 自身命令行，曾两次把工具自己的进程连带杀掉（表现为 exit 143、`Signal: 15`）。停 dev server 用启动时记下的 PID；只能按名查时用 `ss -ltn` 看端口是否释放来复核，别把 `pkill -f` 当幂等清理
- 测试失败先对照 HEAD 与 origin/main 的同名文件，确认是本次改动引入还是合并遗留缺陷，再决定修法
- 合并遗留缺陷的常见形态：引用未定义变量、fixture 与组件新行为不匹配、测试期望停在上游旧结构
- 写入所谓"新"测试文件前先 `git ls-files` 或 `git status` 确认该路径未被跟踪，`ls | head` 截断过的目录清单不能当作不存在，否则 Write 会静默覆盖已有测试并删除用例

## 文档跟着节点走

每完成一个节点（一批翻译、一次拆分、一次门禁清零），在同一次提交里把会被读者当现状读
的数与证据指针改掉：簇号、覆盖率、目录叶子数、残留命中数、渲染扫描的"最近一次复跑"、
lint 预算计数、待接队列与活项清单。重测方法见
`ui/litellm-dashboard/docs/i18n/WORKFLOW.md` 的"第六步之后、提交之前"那张表。落后的文档
比没有文档更坏，下一个参与者会按错的数排产，还会以为上一次取证仍然成立

## 汉化批次的命令坑

2026-10-24 的记录，来自第 467-479 簇里反复出现的同类错误，已逐条修正，下回按规避写法做。详细版见 `ui/litellm-dashboard/docs/i18n/FIXES.md`。

- 手改 `src/messages/*.json` 时，锚点行若是对象最后一项则行尾无逗号，插入前先补逗号；若插入点后紧跟 `}`，新增的最后一项不带逗号；改完必须 `json.load` 验证两端并比对叶子数
- 同名同值的键会出现在多个命名空间（如 `noModelsFound` 同时在 `models.addModel` 与 `modelSelect`）。按行内文本定位会插错命名空间，组件会渲染出原始键名。先定位 `"<namespace>": {` 的行号，再在块内插入，插完打印该命名空间的键确认
- 批量 `str.replace()` 不带 count 会命中所有同名行（插入 `const t` 时曾造成重复声明 TS2451）。用 count 断言、限定上下文或按行号操作
- 正则里的扩展名交替必须写成 `\.(?:tsx|ts)`，写成 `ts|tsx` 会把 `.tsx` 截成 `.ts`；`z\.custom<([^>]+)>` 会被嵌套泛型（`Record<string, string[]>`）截断，改完用 `grep -n "custom<" | grep -v optional` 复核
- `grep -c` 命中 0 时退出码为 1，会打断整条 `&&` 链，看起来像检查失败；用 `|| echo 0` 或单独跑计数
- 在 `ui/litellm-dashboard` 里跑 prettier/eslint 要传当前目录相对路径，不要传仓库根相对路径（会报 No files matching）
- 该项目的 vitest 没有 `--reporter=basic`，用默认或 `--reporter=dot`；全量 61 个失败文件整跑约 2.5 分钟，放后台等通知，不要 `sleep` 轮询
- 批量翻面断言只替换"失败信息里测试实际查找的那条串"，再对到 `en.json` 同值在 `zh-CN.json` 的词条；正则形式的期望（`/edit settings/i` 等）抓不到，需按文件单独看；同一文案可能有多套译法，以组件实际使用的命名空间为准

## Windows 迁移与跨层转义坑

2026-10-28 的记录，来自 WSL 迁回 Windows 后的 chat/moyai 回贴收尾，逐条已验证，下回按规避写法做。

- JS 正则的 `.` 不匹配 `\r`（行终止符）。CRLF 文件按 `\n` split 后每行尾部残留 `\r`，所有 `$` 锚定的正则全部静默失配（内容看着对、匹配为 0，当天门禁解析 121 条泄漏全部漏网就是这个）。跨层读文件先做 `replace(/\r\n/g, "\n")` 归一化再匹配，或逐行剥尾部 `\r`
- PowerShell 与 wsl.exe 与 bash 的多层转义不可靠：内联 `node -e` 与 `bash -lc` 的嵌套引号、反斜杠反复失败且形态诡异。复杂操作一律写脚本文件（apply_patch 落到 D:\codex，WSL 侧经 /mnt/d 跑，Windows 侧直接 node 跑），脚本内每步带失败即抛的验证
- 渲染层会解码 HTML 实体，补丁文本与工具输出里的 < 会被吃成 <。生成的代码里需要实体的字符串用 String.fromCharCode 码点构造，绝不手写实体
- CRLF 文件上 apply_patch 报成功不代表落盘（ChatShell 的 hook 插入出现过一次静默丢失），关键写入立即用 node 按 JSON.stringify 字节级回读验证
- exec 工具的默认 CWD 是注册的工作区根，该目录删除后所有命令孵化直接失败（目录名称无效 os error 267），每条命令显式传 workdir，并在应用里把会话工作区改挂到存活的目录
- 权限配置在受限与完全访问之间切换时，执行身份随之切换（codexsandboxoffline 与 wulin），WSL 访问、文件写权限、凭据可见性全部跟着变。跨模式工作前先 whoami 确认身份再动手
- spawnSync("npm") 在 Windows 报 ENOENT（要 npm.cmd 且 cmd 需 shell），更稳的做法是上游命令输出落文件后读文件，不让脚本自己 spawn 包管理器
- git 的 github 代理配置（http.https://github.com/.proxy）是仓库本地的，重新克隆后必须重加，否则直连 github.com 超时；LAN Gitea 的凭据同理，新克隆要先配 credential helper 或凭据存储
- 上游基线对象（66c8f5b1a9、cfe0100e1）fetch 一次后就留在本地对象库，回贴脚本直接 git show 本地引用即可，不再依赖任何外部镜像路径
