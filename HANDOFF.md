# 交接文档

给接手这个仓库的下一位 agent。本文只写现状、入口与坑，方法细节都在链接的文档里，不重复抄。读完本文再按"必读顺序"读下去，不要直接动手改代码

## 项目是什么

LiteLLM 的 fork，工作几乎全部集中在 Admin UI（`ui/litellm-dashboard`）的简体中文汉化。活动远端是 GitHub 公开仓库 `wulinwei959/LiteLLM-Chinese`，主干 `main`，LAN Gitea 已弃用。汉化按"簇"推进，一簇一个 PR，squash merge，main 的历史按 PR 读。截至 2026-11-11 第 578 簇（commit `d5faba8d`，PR #49），静态与运行期两侧的在案活项全部清零

## 现状快照（2026-11-11，第 578 簇后）

- 目录：中英叶子各 13817（数组展开口径，数组算一片为 13807），命名空间 126，键树无差集，中英同值 214，死键 0
- 门禁基线：静态英文 532 条 / 196 文件；zh 无汉字 246 条、en 夹中文 0；渲染扫描 245 条（正文 58、属性 187）
- 覆盖率：非测试 `.tsx` 990 个，接入翻译器 771 个（77.9%），未接入 219 个全部有判定归属
- zh 246 条不是翻译欠账。第 578 簇逐条复核全部有意保留英文（品牌、协议取值、占位符、代码模式、lens 装饰性章节标识），判定账在 `docs/i18n/ARCHITECTURE.md` 的"中文取值守卫"一节。不要看见无汉字就去"补译"
- 唯一剩余大事是上游同步，按维护者决定暂缓，重启需要用户拍板

## 必读顺序

1. 根 `AGENTS.md` 与 `ui/litellm-dashboard/AGENTS.md`：协作纪律、测试分层、lint 门禁，是硬约束
2. `ui/litellm-dashboard/docs/i18n/README.md`：当前状态与文档索引
3. 同目录 `ARCHITECTURE.md`：i18n 层怎么接的、四道守卫的判定逻辑
4. 同目录 `WORKFLOW.md`：单簇七步流程与"第六步之后、提交之前"的复测表，动手前必过
5. 同目录 `PROGRESS.md` 的"下一步优先级"一节：只列活项的清单（当前为空），其余段落是沿革
6. 遇到红灯查 `FIXES.md`，定译查 `src/messages/GLOSSARY.md`（含"保留英文"五档判定）

判定账的位置：静态英文逐条分类在 `ENGLISH-BASELINE.md`，未接入 219 个文件在 `FILE-INVENTORY.md`，渲染扫描口径与基线在 `RENDERED-SCAN.md`，上游同步计划在 `UPSTREAM-SYNC.md`

## 常用命令（都在 `ui/litellm-dashboard` 下跑）

- 四道静态门禁：`npm run check:dead-keys`、`npm run check:english-leaks`、`npm run check:zh-coverage`、`npm run typecheck`。基线文件分别是 `dead-keys-baseline.json`、`english-leaks-baseline.json`、仪表盘根目录的 `zh-coverage-baseline.json`（不在 scripts/ 下）。新增即红，基线已解决条目也红，确认后用各门禁的 `--write` 刷新
- 测试：分 project 入口 `npm run test:unit`（node）、`test:component`、`test:integration`（jsdom）、`test:types`。不要裸跑 `npx vitest run` 全量，只跑改动触及的文件加 import 它的测试；`--reporter=dot` 是唯一可用的点状报告；多 project 合跑把 `TMPDIR` 固定到 `/tmp/vitest_tmp`
- 渲染扫描：先 `npm run dev`（端口 3000）再起 `npm run scan:rendered`，用本机 Chrome（playwright `channel: "chrome"`），41 页空桩。只有加 `--update-baseline` 才写基线 `scripts/rendered-ui-baseline.json`
- 改了后端路由或响应模型：`npm run gen:api` 重新生成 `src/lib/http/schema.d.ts`，该文件不手改
- 接入率复算：`node scripts/i18n-file-inventory.mjs`；叶子与同值口径用 `scripts/dead-keys.py` 的 `flat`

## 工作流纪律

- 开工先 `git pull`（工作区要干净，必要时按唯一 tag stash）。分支从最新 main 开，名字前缀 `litellm_`，不带 `/`
- 提交用 conventional 前缀（英文）+ 中文标题与正文。一个 PR 可装多条相关修复，不夹带无关改动。文档跟着节点走：簇号、覆盖率、基线数、活项清单在同一次提交里更新，落后的文档比没有文档更坏
- PR 正文参照 #46 到 #49 的格式：开头一两句说清做什么，然后"变更内容"与"验证"两节，全中文。建 PR 前读磁盘上的 `.github/PULL_REQUEST_TEMPLATE/general.md`，空节整节删掉
- CI 全绿后 squash merge 并删分支。github.com 直连间歇超时，push/fetch 失败重试即可，不是配置坏了
- 所有交流与人类-facing 文本用简体中文，代码与标识符保持英文

## 环境坑（Windows，都是踩过的）

- Bash 工具工作目录跨调用不保持，用工具的 `dir_path` 参数固定到 `ui/litellm-dashboard`，不要靠 `cd`
- 停 dev server 用启动时记下的 PID 或后台任务 ID，`pkill -f` 会匹配到执行它的 shell 自身、把工具进程杀掉
- CRLF 文件按 `\n` split 后行尾残留 `\r`，`$` 锚定正则全部静默失配，跨层读文件先归一化 `\r\n`
- 复杂操作写脚本文件再跑，不要叠 `node -e` 与多层 shell 引号；双引号里的反引号会真的执行命令，模式里有反引号一律用单引号
- prettier 只管仪表盘内文件，根 `README.md` 不在管辖内。仪表盘内跑 prettier/eslint 传当前目录相对路径
- 手改 `src/messages/*.json` 的坑（锚点逗号、同名键插错命名空间、改完 `json.load` 验证）见根 `AGENTS.md` 的"汉化批次的命令坑"
- 长命令成败紧跟一条语句取 `$?`，不要接管道再取

## 下一步方向（供与用户对齐）

1. 上游同步：暂缓中，是英文重新进面的唯一通道。重启按 `UPSTREAM-SYNC.md` 逐文件三方合并，当天额外做三件事（重测 lint 棘轮、`eslint . --prune-suppressions`、复跑死键与渲染扫描）
2. 拿新形态撞口径：渲染扫描目前全是空桩，登录态、真实数据、弹窗与交互态未覆盖，是静态门禁之外最可能再捞出真漏的方向
3. 判定账顺手项：17 个上游巨型文件的 `max-lines` 豁免（第 529 簇）、顶格 lint 规则，日后打开哪个文件顺手做，不单开簇