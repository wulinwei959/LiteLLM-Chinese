# 汉化镜像的构建与发布

本文件说明 `release-docker-image.yml` 的用法，以及版本号从哪来。工作流只有手动触发一条路径，
不在 push 或 PR 上跑，因为单次构建在免费 4 核 runner 上就要几十分钟。

## 版本号规则

Release tag 与镜像 tag 都取自仓库里最新的 `litellm_sync_v*` 分支名。每次合并上游前新建的这条
同步分支就是版本来源，`sort -V` 取最大者，例如同时存在 `litellm_sync_v1.105.0` 与
`litellm_sync_v1.107.0` 时得到 `v1.107.0`。

由此有两条约束：

- 这些 `litellm_sync_v*` 分支不能删，删掉就等于删掉版本来源。工作流找不到任何此类分支时会直接失败，
  不会猜一个号发出去。
- 分支版本号可以领先于上游已发布的官方 tag。例如 `v1.107.0` 在上游只有 `v1.107.0-rc.2` 这类预发布
  引用，没有正式 tag。工作流会去查 `BerriAI/litellm` 的 tag 引用，把结果原样写进 Release 正文，
  不做拦截，也不据此改动 tag 值。

`pyproject.toml` 的版本会一并写进正文供对照，当前是 `1.108.0`，与同步分支号不一致属正常，
两者表示不同的东西。

想指定别的号，触发时在 `version_tag` 里填，格式限 `v主.次.补丁`，可选 `-rc.N`。填写内容会经
正则校验后才进入 shell，不合规直接失败。`prerelease` 复选框决定是否标为预发布。

## 构建内容

构建命令等价于：

```
docker build --target runtime --build-arg LITELLM_RELEASE_TAG=<tag> -t litellm-chinese:<tag> -f Dockerfile .
```

`runtime` 是根 `Dockerfile` 的最后一个阶段，内含 Dashboard、Prisma 与 pgbouncer、Rust bridge，
基础镜像按 digest 钉死在 `cgr.dev/chainguard/wolfi-base`。`LITELLM_RELEASE_TAG` 会烘进镜像环境，
容器内可读到自己的版本号。构建上下文由 `.dockerignore` 收窄，排除了 `.github`、`tests`、`docs`、`.git`。

只构建主镜像。`docker/Dockerfile.non_root`、`docker/Dockerfile.database`、`ui/`、`gateway/`、
`backend/`、`migrations/` 这些目标不在本工作流范围内，需要时再按需加，不要一次全带上，
免费并发额度会立刻被打满。

## 发布形态

镜像用 `docker save` 加 `gzip -n` 压成 `litellm-chinese-<tag>.tar.gz`，作为 GitHub Release 的附件，
不推 GHCR。附件走的是普通 Release 资源，公开可下。

同 tag 的 Release 已存在时不重建，改用 `gh release upload --clobber` 覆盖附件，方便重跑。
工作流的 `concurrency` 组是单例且 `cancel-in-progress: false`，避免两次发布互相取消。

下载后本地加载：

```
docker load -i litellm-chinese-v1.107.0.tar.gz
docker run -d -p 4000:4000 -e LITELLM_MASTER_KEY=<自己的主密钥> litellm-chinese:v1.107.0
```

健康检查在 `http://localhost:4000/health/readiness`，管理面板在 `http://localhost:4000/ui`。

## 时长与失败排查

job 超时给到 90 分钟。参考同仓库其他 Docker 任务的量级，免费 runner 上首次全量构建（含 UI 打包与
Python 依赖安装）通常在 30 到 50 分钟，`docker save` 与上传取决于镜像大小，公共仓 Release 附件
不占 Actions 存储但上传本身要时间。

常见失败点按顺序看：

- 解析步骤报“找不到 `litellm_sync_v*` 分支”：分支被删了，或该次触发没填 `version_tag`。
- 构建步骤网络失败：`cgr.dev`、`ghcr.io/astral-sh/uv`、npm 与 PyPI 拉取被掐，本仓网络分档会变，
  重试即可，不是配置问题。
- 上传步骤 404：工作流缺 `contents: write`，本文件已在 workflow 级声明。
- Release 正文里上游官方 tag 显示“上游无此 tag”：说明同步分支号领先于正式发布，属预期信息而非错误。
