import type { Agent } from "@/components/agents/types";

/**
 * A row the `getAgentsList` mock can return.
 *
 * `AgentResponse` carries defaults the UI relies on, so a fixture built from
 * only `agent_id`/`agent_name` leaves `mockResolvedValue` with a TS2322 for
 * every field the transport says is required. Callers override the fields the
 * test cares about; the rest keep the values below.
 */
export const makeAgent = (overrides: Partial<Agent> = {}): Agent =>
  ({
    agent_id: "agent-1",
    agent_name: "Test Agent",
    agent_card_params: {},
    litellm_params: { model: "gpt-4" },
    object_permission: null,
    enabled: true,
    execution_mode: "autonomous",
    identity_managed: false,
    jwt_auth_configured: false,
    spend: 0,
    keys: [],
    ...overrides,
  }) as Agent;
