export interface MCPConnectorImportResult {
  name: string;
  server_id: string;
  alias: string;
}

export interface MCPConnectorImportSkipped {
  name: string;
  reason: string;
}

export interface MCPConnectorImportFailure {
  name: string;
  error: string;
}

export interface MCPConnectorImportResponse {
  imported: MCPConnectorImportResult[];
  skipped: MCPConnectorImportSkipped[];
  errors: MCPConnectorImportFailure[];
}

export type ConnectorConfigErrorKey =
  | "import.pasteFirst"
  | "import.invalidJson"
  | "import.expectedServersKey"
  | "import.serversNotObject"
  | "import.serversEmpty"
  | "import.serversListNotArray"
  | "import.serversListEmpty";

export type ParsedConnectorConfig =
  | { ok: true; payload: Record<string, unknown>; connectorCount: number }
  | { ok: false; error: ConnectorConfigErrorKey };

export const parseConnectorConfig = (text: string): ParsedConnectorConfig => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "import.pasteFirst" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "import.invalidJson" };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "import.expectedServersKey" };
  }
  const record = parsed as Record<string, unknown>;
  const mapping = record.mcpServers;
  if (mapping !== undefined) {
    if (typeof mapping !== "object" || mapping === null || Array.isArray(mapping)) {
      return { ok: false, error: "import.serversNotObject" };
    }
    const connectorCount = Object.keys(mapping).length;
    if (connectorCount === 0) {
      return { ok: false, error: "import.serversEmpty" };
    }
    return { ok: true, payload: { mcpServers: mapping }, connectorCount };
  }
  const list = record.mcp_servers;
  if (list !== undefined) {
    if (!Array.isArray(list)) {
      return { ok: false, error: "import.serversListNotArray" };
    }
    if (list.length === 0) {
      return { ok: false, error: "import.serversListEmpty" };
    }
    return { ok: true, payload: { mcp_servers: list }, connectorCount: list.length };
  }
  return { ok: false, error: "import.expectedServersKey" };
};
