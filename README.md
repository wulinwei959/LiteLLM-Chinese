# LiteLLM-Chinese

LiteLLM AI Gateway 管理面板(Admin UI)的简体中文支持项目

## 背景

LiteLLM 上游的管理面板(`ui/litellm-dashboard`)没有任何国际化基础设施:界面文案硬编码英文,`<html lang="en">` 写死,数字与日期格式固定 `en-US`,也没有语言切换入口。本项目在保留英文为默认语言的前提下,为管理面板引入完整的 zh-CN 本地化

## 技术方案

采用 next-intl 的 "without i18n routing" 模式,理由有三:

1. 上游面板是 Next.js 静态导出(`output: "export"`),由 Python proxy 托管在 `/ui/` 路径下,Next.js 官方 i18n 路由与静态导出不兼容,URL locale 前缀方案被排除
2. next-intl 官方支持纯客户端的 locale 切换,且活跃适配 Next.js 16
3. 自带 ICU 消息格式、消息 key 编译期类型校验、`useFormatter()` 本地化日期数字格式化

核心设计:

| 关注点 | 方案 |
|---|---|
| 消息文件 | `src/messages/en.json` + `zh-CN.json`,按功能域分 namespace |
| 类型安全 | `en.json` 驱动 `IntlMessages` 类型增强,key typo 编译期报错 |
| locale 持久化 | localStorage,首访跟随 `navigator.language` |
| 切换入口 | Navbar 用户下拉菜单与侧边栏账户菜单 |
| 日期数字 | `useFormatter()` 替换全部 `"en-US"` 硬编码 |

## 实施计划

| 批次 | 内容 |
|---|---|
| Batch 0 | next-intl 接入、LocaleProvider、切换器、类型增强、key 一致性测试 |
| Batch 1 | 侧边栏导航、Navbar、面包屑、登录与引导页 |
| Batch 2 | Virtual Keys 页与创建流程、Models + Endpoints |
| Batch 3 | Logs 列表与详情抽屉、Usage 看板 |
| Batch 4 | Teams、Internal Users、Organizations、Budgets |
| Batch 5 | Guardrails、Policies、Settings 及其余管理页 |
| 长尾 | playground、prompts、mcp-servers 等按需排期 |

每批独立可合并,默认语言保持英文,存量用户与测试零影响。测试新增三类:中英消息文件 key 树一致性校验、切换器可见文案变化断言、locale 持久化 helper 单测

## 上游

基于 [BerriAI/litellm](https://github.com/BerriAI/litellm) 的 `ui/litellm-dashboard` 展开
