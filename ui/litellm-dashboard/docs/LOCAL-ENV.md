# 本地开发环境

这台机器上跑通代理侧与渲染扫描要准备的东西。记录的是实际踩过的坑，不是理想流程。

## Python 依赖

仪表盘的 OpenAPI 类型是从代理的 FastAPI app 现生成的，所以本地要能 import 代理。

### uv

```
pip3 install --break-system-packages uv
```

仓库用 uv + workspace（`enterprise`、`litellm-proxy-extras`），照 CI 的配方装：

```
export UV_DEFAULT_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple/
uv sync --frozen --no-install-project \
  --group ci --group proxy-dev --extra google --extra proxy --extra semantic-router
```

三处要点：

- **用清华的 simple 索引，别用阿里云。** 阿里云的索引不带 `upload-time`，uv 会把缺失的上传时间填成 `exclude-newer` 的截止时刻，于是所有包都恰好落在截止点上、被判定器全被排除，报的是"找不到某个版本"这种看不出原因的错误。清华的索引带 `upload-time`，`exclude-newer` 正常工作。
- **`--no-install-project` 是有意的。** 根项目的构建后端是 maturin，要编 Rust 扩展；不装本地包、直接从源码树 import `litellm` 就够了。Rust 扩展本身是可选的（`litellm/rust_bridge/loader.py` 的 `get_native_bridge()` 找不到就返回 `None`），生成 OpenAPI 用不到它。
- **workspace 成员仍会构建**，但它们是 `uv_build` 的纯 Python 包，不需要 Rust。

### 重新生成仪表盘的 API 类型

CI 的顺序是：装依赖 → `prisma generate` → 刷新懒加载 OpenAPI 快照 → `npm run gen:api`。本地照做：

```
cd ui/litellm-dashboard
export LITELLM_PYTHON=/path/to/repo/.venv/bin/python
npm run gen:api
```

`prisma generate` 会自己装 Prisma CLI，npm 源已经是镜像。

`litellm.proxy._lazy_openapi_snapshot` 生成的快照文件是提交物，改过路由后要一并刷新：

```
.venv/bin/python -m litellm.proxy._lazy_openapi_snapshot
```

### 一条已知的仓库缺陷

提交在仓库里的 `ui/litellm-dashboard/src/lib/http/schema.d.ts` 比上游同期的版本**少 11 条路径**：企业版的 `/audit*`、`/project/*`、`/user/available_users`，加上 `/email/event_settings*` 与 `/robots.txt`。原因是第 414 簇之前那次"分区同步上游 v1.105.0"重新生成类型时，环境里企业包没装上，那批路由没注册进 spec。

上游 main 的同名文件有这 11 条。CI 的 "Check UI API Types Sync" 只在 PR 动了代理或类型时才跑，所以这个偏差一直没人看见。装了企业包之后重新生成即可补齐。

## 渲染扫描

`npm run scan:rendered` 要 Playwright 的 Chromium。Linux 上它还缺几个系统库：

```
npx playwright install chromium
```

装完跑起来会报 `libnspr4.so: cannot open shared object file`。没有 sudo 时可以把 deb 解到本地目录再用 `LD_LIBRARY_PATH` 指过去：

```
apt-get download libnspr4 libnss3 libasound2t64
for f in *.deb; do dpkg -x "$f" /path/to/sysroot; done
LD_LIBRARY_PATH=/path/to/sysroot/usr/lib/x86_64-linux-gnu npm run scan:rendered
```

## Docker

这台机器上装的是 Windows 的 Docker Desktop，WSL 发行版里没有它的 CLI（`docker` 命令会提示"在 Docker Desktop 设置里启用 WSL integration"）。要跑容器得先在 Windows 侧打开集成。
