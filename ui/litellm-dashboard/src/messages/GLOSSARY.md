# LiteLLM 管理面板中英术语对照表

新增或修改 `src/messages/zh-CN.json` 时，以本表为准。已存在的不同译法不再批量回改（避免无意义的 UI  diff），但新 key 必须用本表的定译。

## 核心领域术语

| 英文 | 中文 | 说明 |
| --- | --- | --- |
| Virtual Key(s) | 虚拟密钥 | |
| Budget(s) | 预算 | |
| Team(s) | 团队 | |
| Organization(s) | 组织 | |
| Member(s) | 成员 | Team Member 固定译作"团队成员" |
| Model(s) | 模型 | |
| Deployment(s) | 部署 | |
| Endpoint(s) | 端点 | |
| Provider(s) | 提供商 | LLM 服务商 |
| Credential(s) | 凭据 | OAuth 令牌、API 密钥等统称 |
| API Key(s) | API 密钥 | product 名不翻译大小写不变 |
| Access Group(s) | 访问组 | |
| Policy / Policies | 策略 | |
| Guardrail(s) | 护栏 | 存量有"防护栏"（如 Guardrail Garden），新 key 一律用护栏 |
| Role(s) | 角色 | |
| Permission(s) | 权限 | |
| Scope(s) | 作用域 | OAuth scope 固定用作用域；泛指的范围（如 Team Scope）用范围 |
| Spend | 花费 | 与 Cost 区分：Spend 是已经花掉的钱 |
| Cost | 成本 | Cost Optimization、成本统计等语境；按次计费的单价用费用（如"默认费用"） |
| Usage | 用量 | |
| Log(s) | 日志 | Audit Logs 译作审计日志 |
| Router(s) | 路由器 | Auto Router 译作自动路由器 |
| Tool(s) | 工具 | |
| Toolset(s) | 工具集 | MCP 工具集 |
| MCP Server(s) | MCP 服务器 | product 名保留英文 |
| Agent(s) | 智能体 | AI 智能体语境；存量 teams 里有"代理"（如 Agent Settings），新 key 用智能体 |
| Workflow(s) | 工作流 | Workflow Runs 译作工作流运行 |
| Skill(s) | 技能 | |
| Memory | 记忆 | 功能名 |
| Vector Store(s) | 向量存储 | |
| Cache | 缓存 | Response Cache 译作响应缓存 |
| Playground | 演练场 | API Playground 译作 API 演练场 |
| Prompt(s) | 提示词 | 含 Prompt Caching（提示词缓存） |
| Project(s) | 项目 | |
| Tag(s) | 标签 | Tag Management 译作标签管理 |
| Session(s) | 会话 | |
| Owner | 所属人 | |
| Admin | 管理员 | Admin Settings 译作管理设置 |
| User(s) | 用户 | |
| Key | 密钥 | 存量个别处用"键"，新 key 一律用密钥 |
| Alias | 别名 | |
| Secret(s) | 密钥 | Secret Manager 译作密钥管理；注意与 Key 的译法相同，按英文区分使用 |
| Token(s) | 令牌 | |
| Rate Limit(s) | 速率限制 | RPM/TPM 上限这类具体条目用"上限"（如 TPM 上限） |
| Retry | 重试 | Retry Policy 译作重试策略 |
| Fallback(s) | 回退 | |
| Cooldown | 冷却 | |
| Monitor | 监控 | Guardrails Monitor 译作护栏监控 |
| Alert(s) | 告警 | Budget Alert 译作预算告警 |
| Search | 搜索 | |
| Gateway | 网关 | AI Gateway 译作 AI 网关 |
| Proxy | 代理 | 指 LiteLLM Proxy 本体时不翻译也可，视语境 |

## 通用 UI 词汇

通用按钮与状态词以 `common` 命名空间现有译法为准（保存、取消、删除、编辑、确认、重试、暂无、未知、从不、无限制等），不再逐条列出。容易混淆的决策单列如下：

| 英文 | 中文 | 说明 |
| --- | --- | --- |
| Never（回退文案） | 从不 | 日期/数值缺失时的回退，不是"永不" |
| Unknown（回退文案） | 未知 | |
| Unlimited | 无限制 | |
| No ... found | 未找到... | 如 No keys found 译作未找到密钥 |
| Loading ... | 正在加载... | Loading 后加具体对象，如正在加载自动路由器 |
| Select ... | 选择... | Select Team 译作选择团队 |
| Optional | 可选 | 括号形式为"（可选）" |
| Required | 必填 | |
| Enabled / Disabled | 已启用 / 已禁用 | |
| Active / Inactive | 活跃 / 非活跃 | Key 状态 Active 译作活跃 |
| Blocked（Key 状态） | 已封禁 | 与 teams 里的"封禁"动词一致 |
| Deleted（Key 状态） | 已删除 | |
| Expired（Key 状态） | 已过期 | |

## 已知存量分歧（暂不改，只记录）

- `Cost`：nav 与 models 用"成本"，mcpServers 费用配置用"费用"。按语境区分是合理的（优化与统计用成本，按次计费的单价用费用），维持现状。
- `Agents`：nav 用"智能体"，teams 存量用"代理"。新 key 用智能体。
- `Key`：个别存量用"键"。新 key 用密钥。
- `Scope/Scopes`："范围"与"作用域"并存。OAuth 相关固定用作用域。
- `Team Member Budget (USD)`：`teams.list` 用"（USD）"，`teams.member` 用"（美元）"。等语义不受影响，暂不动。
