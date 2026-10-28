import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import type { ConnectFlowStatus } from "@/components/networking";
import { renderWithProviders } from "../../../tests/test-utils";
import ConnectFlowBanner, { isLoopbackOrigin } from "./ConnectFlowBanner";

const { startOAuthFlow } = vi.hoisted(() => ({ startOAuthFlow: vi.fn() }));

vi.mock("@/components/networking", () => ({
  getProxyBaseUrl: () => "https://gateway.example.com",
}));

vi.mock("@/hooks/useUserMcpOAuthFlow", () => ({
  useUserMcpOAuthFlow: () => ({ startOAuthFlow, status: "idle" }),
}));

afterEach(() => {
  vi.restoreAllMocks();
  startOAuthFlow.mockClear();
});

const unscoped = (client_origin: string): ConnectFlowStatus => ({
  state: "unscoped",
  client_origin,
  server_id: null,
  server_name: null,
  connected: null,
  servers: null,
});

const renderBanner = (clientOrigin: string) =>
  renderWithProviders(
    <ConnectFlowBanner
      flowHandle="flow-handle-123"
      flow={unscoped(clientOrigin)}
      accessToken="tok"
      onConnected={vi.fn()}
      failed={false}
    />,
  );

describe("ConnectFlowBanner", () => {
  it("posts only the flow handle to the proxy /authorize/complete as a full-page form", () => {
    const { container } = renderBanner("https://claude.ai");

    const form = container.querySelector("form")!;
    expect(form).toHaveAttribute("method", "POST");
    expect(form).toHaveAttribute("action", "https://gateway.example.com/authorize/complete");
    expect(screen.getByDisplayValue("flow-handle-123")).toHaveAttribute("name", "flow");
    expect(form.innerHTML).not.toContain("token");
    expect(screen.getByRole("button", { name: "完成连接" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "取消" })).not.toBeInTheDocument();
  });

  it("lists multi-server consent and requires every server before finishing", () => {
    const flow: ConnectFlowStatus = {
      state: "multi",
      client_origin: "https://claude.ai",
      server_id: null,
      server_name: null,
      connected: null,
      servers: [
        { server_id: "alpha-id", server_name: "alpha", connected: false },
        { server_id: "beta-id", server_name: "beta", connected: false },
      ],
    };
    const { rerender } = renderWithProviders(
      <ConnectFlowBanner
        flowHandle="flow-handle-123"
        flow={flow}
        accessToken="tok"
        onConnected={vi.fn()}
        failed={false}
      />,
    );

    expect(screen.getByText("允许https://claude.ai使用alpha, beta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "连接alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "连接beta" })).toBeInTheDocument();
    expect(startOAuthFlow).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "完成连接" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();

    rerender(
      <ConnectFlowBanner
        flowHandle="flow-handle-123"
        flow={{
          ...flow,
          servers: flow.servers?.map((server) => ({ ...server, connected: true })) ?? null,
        }}
        accessToken="tok"
        onConnected={vi.fn()}
        failed={false}
      />,
    );

    expect(
      screen.getByText("点击“完成连接”，以你的身份让https://claude.ai获得访问alpha, beta的权限。"),
    ).toBeInTheDocument();
  });

  it("offers manual delivery only for a loopback client, posted only when checked", () => {
    const loopback = renderBanner("http://localhost:3118");
    const checkbox = loopback.container.querySelector('input[type="checkbox"][name="delivery"]') as HTMLInputElement;
    expect(checkbox.value).toBe("manual");
    expect(checkbox.checked).toBe(false);
    loopback.unmount();

    const routable = renderBanner("https://claude.ai");
    expect(routable.container.querySelector('input[name="delivery"]')).toBeNull();
  });

  it("classifies loopback origins like the server does", () => {
    expect(isLoopbackOrigin("http://localhost:3118")).toBe(true);
    expect(isLoopbackOrigin("http://127.0.0.1:8080")).toBe(true);
    expect(isLoopbackOrigin("http://127.5.4.3:1")).toBe(true);
    expect(isLoopbackOrigin("http://[::1]:9000")).toBe(true);
    expect(isLoopbackOrigin("http://[0:0:0:0:0:0:0:1]:9000")).toBe(true);
    expect(isLoopbackOrigin("https://claude.ai")).toBe(false);
    expect(isLoopbackOrigin("http://127.evil.com")).toBe(false);
    expect(isLoopbackOrigin("http://localhost.evil.com")).toBe(false);
    expect(isLoopbackOrigin(null)).toBe(false);
    expect(isLoopbackOrigin("not a url")).toBe(false);
  });

  it("does NOT complete the flow on pagehide (completion requires the explicit button)", () => {
    const beaconMock = vi.fn(() => true);
    vi.stubGlobal("navigator", { ...navigator, sendBeacon: beaconMock });
    renderBanner("https://claude.ai");

    window.dispatchEvent(new Event("pagehide"));

    expect(beaconMock).not.toHaveBeenCalled();
  });
});
