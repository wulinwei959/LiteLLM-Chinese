/**
 * Fixtures for the rendered-UI scan: the pages to visit, the API responses the
 * dashboard asks for, and the words that are allowed to stay in English.
 *
 * The API responses have to mirror what the proxy really returns, down to the
 * difference between a bare array and a paginated body, or the page hits its
 * error boundary and the scan reads the error page instead of the interface.
 * Each entry below was matched against the proxy's own response model.
 */

export const PAGES = [
  { name: "home", path: "/" },
  { name: "keys", path: "/api-keys" },
  { name: "models", path: "/model_hub_table" },
  { name: "teams", path: "/teams" },
  { name: "logs", path: "/logs" },
  { name: "usage", path: "/usage" },
  { name: "guardrails", path: "/guardrails" },
  { name: "policies", path: "/policies" },
  { name: "agents", path: "/agents" },
  { name: "prompts", path: "/prompts" },
  { name: "budgets", path: "/budgets" },
  { name: "users", path: "/users" },
];

/**
 * Words that are legitimately not translated: product names, protocol names,
 * units, and the identifiers the interface shows as data.
 */
export const ALLOWED_ENGLISH = new Set([
  "AI",
  "AI Hub",
  "API",
  "APIs",
  "Admin",
  "AWS",
  "Azure",
  "Bedrock",
  "Beta",
  "Cohere",
  "CSV",
  "Ctrl K",
  "DeepSeek",
  "Enter",
  "Gemini",
  "GCP",
  "GPT",
  "ID",
  "IDs",
  "IP",
  "IPs",
  "JSON",
  "JWT",
  "Key",
  "Keys",
  "LLaMA",
  "LLM",
  "LLMs",
  "Lens",
  "LiteAdmin",
  "LiteLLM",
  "litellm",
  "MCP",
  "Mistral",
  "New",
  "OAuth",
  "Ollama",
  "OpenAI",
  "Playground",
  "Postgres",
  "PostgreSQL",
  "Proxy",
  "RAG",
  "ROI",
  "Redis",
  "SDK",
  "SSO",
  "SSO ID",
  "SSL",
  "TLS",
  "TPD",
  "TPM",
  "Token",
  "Tokens",
  "USD",
  "UI",
  "URL",
  "URLs",
  "Webhook",
  "Webhooks",
  "prompt",
  "prompt_id",
  "user_role",
  // Units the interface shows as acronyms.
  "RPM",
  // The stub session's own name and email domain, shown in the account menu.
  "scanner",
  "example.com",
]);

const list = (items) => ({ data: items, total_count: items.length });

/** The responses the dashboard's pages read, matched on a path fragment. */
export const API_STUBS = [
  [
    "/.well-known/litellm-ui-config",
    { admin_ui_disabled: false, proxy_admin_email: null, server_root_path: "", proxy_base_url: null },
  ],
  [
    "/health/license",
    {
      license_type: "enterprise",
      user_id: "user-admin",
      team_id: null,
      spend: 100,
      max_budget: 1000,
      max_team_budget: 5000,
    },
  ],
  ["/health/readiness", { status: "healthy" }],
  ["/global/health", { status: "healthy" }],
  ["/ui_theme_settings", { theme: "light" }],
  ["/user_banner", { banner: null }],
  ["/api/plugins", { plugins: [] }],
  ["/latest_release_info", { version: "1.0.0", update_available: false }],
  ["/public/litellm_blog_posts", { posts: [] }],
  ["/sso/get/ui_settings", { sso_configured: false }],
  ["/get/ui_settings", { sso_configured: false }],
  ["/user/info", { user_role: "proxy_admin", user_email: "admin@example.com", user_id: "user-admin" }],
  ["/user/available_users", { users: [] }],
  ["/user/available_roles", { roles: [] }],
  ["/models", list([{ id: "gpt-4o", name: "gpt-4o", mode: "chat" }])],
  [
    "/model/info",
    {
      data: [
        {
          model_name: "gpt-4o",
          litellm_params: { model: "openai/gpt-4o" },
          model_info: { id: "gpt-4o", max_tokens: 128000, mode: "chat" },
        },
      ],
    },
  ],
  ["/v2/key/list", { keys: [], key_list: [] }],
  ["/key/list", { keys: [], key_list: [] }],
  ["/v2/team/list", { teams: [], total: 0, page: 1, page_size: 100, total_pages: 1 }],
  ["/team/list", []],
  ["/organization/list", []],
  ["/user/list", { users: [] }],
  ["/project/list", { projects: [] }],
  ["/tag/list", { tags: [] }],
  ["/v2/guardrails/list", { guardrails: [] }],
  ["/guardrails/submissions", { submissions: [], summary: { total: 0, pending_review: 0, active: 0, rejected: 0 } }],
  ["/policies/list", { policies: [] }],
  ["/prompts/list", { prompts: [] }],
  ["/v1/agents", []],
  ["/v1/vector_stores", { vector_stores: [] }],
  ["/v1/mcp/server", { mcp_servers: [] }],
  ["/spend/logs/ui", { data: [], total: 0, page: 1, page_size: 50, total_pages: 0 }],
  ["/user/daily/activity/aggregated/keys", { api_keys: [], total_api_keys: 0, offset: 0, limit: 50 }],
  ["/user/daily/activity/aggregated/users", { users: [], total_users: 0, offset: 0, limit: 50 }],
  [
    "/user/daily/activity/aggregated",
    {
      results: [],
      metadata: {
        has_more: false,
        page: 1,
        total_pages: 1,
        total_spend: 0,
        total_flat_cost: 0,
        total_ptu_hours: 0,
        total_api_requests: 0,
        total_successful_requests: 0,
        total_failed_requests: 0,
        total_tokens: 0,
        total_prompt_tokens: 0,
        total_completion_tokens: 0,
        total_cache_read_input_tokens: 0,
        total_cache_creation_input_tokens: 0,
        total_compression_saved_tokens: 0,
        total_compression_savings_spend: 0,
        total_prompt_caching_savings_spend: 0,
        total_gateway_injected_caching_savings_spend: 0,
        total_autorouter_savings_spend: 0,
        total_response_time_ms: 0,
        total_timed_requests: 0,
      },
    },
  ],
  ["/gateway/daily/activity", { total_successful_requests: 0, total_failed_requests: 0, by_date: [], by_route: [] }],
  ["/customer/list", []],
  ["/team/metadata_schema", { keys: [] }],
  ["/public/v1/model_hub", { data: [], meta: { total_count: 0, page: 1, page_size: 50, total_pages: 1 } }],
  ["/public/agents/fields", []],
  ["/policy/templates", []],
  ["/policies/attachments/list", []],
  ["/management/v1/budgets", { data: [], meta: { total_count: 0, page: 1, page_size: 50, total_pages: 1 } }],
  [
    "/get/internal_user_settings",
    { values: { user_role: "internal_user", max_budget: null, budget_duration: null, models: [], teams: [] } },
  ],
  ["/global/activity/cache_hits", { results: [], filter_options: { key_aliases: [] }, metadata: {} }],
  ["/model_group/info", {}],
  ["/coordination_redis/settings", {}],
  [
    "/cache/settings",
    { current_values: { redis_type: "redis", url: "", host: "", port: "", password: "", namespace: "", ttl: 0 } },
  ],
  ["/global/spend/report", { total_spend: 0, total_requests: 0 }],
  ["/global/activity", { results: [] }],
  [
    "/model_hub/info",
    { model_hub: true, docs_title: "LiteLLM Gateway", custom_docs_description: null, litellm_version: "1.0.0" },
  ],
  [
    "/public/model_hub/info",
    { model_hub: true, docs_title: "LiteLLM Gateway", custom_docs_description: null, litellm_version: "1.0.0" },
  ],
  ["/v1/budget", { budgets: [] }],
  ["/v1/router/settings", { router_settings: {} }],
  ["/v1/team/members", { members: [] }],
];

/**
 * The session the dashboard reads when it asks the proxy who it is. The token
 * is a JWT the dashboard only decodes, so a locally crafted one is enough: it
 * carries the claims that decide which panels a proxy admin may open.
 */
export const ADMIN_SESSION_CLAIMS = {
  key: "sk-admin-token",
  user_id: "scanner",
  user_email: "scanner@example.com",
  user_role: "proxy_admin",
  premium_user: true,
  login_method: "username_password",
  disabled_non_admin_personal_key_creation: false,
  exp: Math.floor(Date.now() / 1000) + 3600,
};

/** Console noise the dev server produces that says nothing about the page. */
export const IGNORED_CONSOLE = [
  /Failed to load resource/i,
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  // Upstream renders anchor-as-button (`<Button render={<a/>}>`) for nav actions; the Base UI
  // nativeButton warning fires upstream too and role="link" assertions depend on that shape.
  /expected a native <button>/i,
];
