import React from "react";
import { renderHook, screen, waitFor } from "@testing-library/react";

import { renderWithProviders } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSPORT_ITEMS } from "@/components/mcp_tools/types";
import { switchToWorkerUrl } from "@/components/networking";
import { TransportSelectItems, useMcpStdioEnabled } from "./StdioAvailability";

function openTransportSelect(stdioEnabled: boolean) {
  renderWithProviders(
    <Select items={TRANSPORT_ITEMS.map(({ value, labelKey }) => ({ value, label: labelKey }))} value={null} defaultOpen>
      <SelectTrigger data-testid="trigger">
        <SelectValue placeholder="Select transport" />
      </SelectTrigger>
      <SelectContent>
        <TransportSelectItems stdioEnabled={stdioEnabled} />
      </SelectContent>
    </Select>,
  );
}

const option = (name: RegExp) => screen.getByRole("option", { name });

describe("TransportSelectItems", () => {
  it("greys out only the stdio option and explains how to enable it when stdio is off", async () => {
    const user = userEvent.setup();
    openTransportSelect(false);

    expect(option(/标准输入\/输出（stdio）/)).toHaveAttribute("data-disabled");
    expect(option(/Streamable HTTP（推荐）/)).not.toHaveAttribute("data-disabled");
    expect(option(/服务器发送事件（SSE）/)).not.toHaveAttribute("data-disabled");
    expect(option(/OpenAPI 规范/)).not.toHaveAttribute("data-disabled");

    await user.hover(screen.getByLabelText("帮助"));

    expect(await screen.findByText(/此代理已禁用 stdio MCP 服务器/)).toBeInTheDocument();
  });

  it("offers stdio like any other transport when stdio is on", () => {
    openTransportSelect(true);

    expect(option(/标准输入\/输出（stdio）/)).not.toHaveAttribute("data-disabled");
    expect(screen.queryByLabelText("帮助")).not.toBeInTheDocument();
  });
});

describe("useMcpStdioEnabled", () => {
  afterEach(() => {
    switchToWorkerUrl(null);
    vi.restoreAllMocks();
  });

  const renderWithConfig = (config: object) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response(JSON.stringify(config), { status: 200 }));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useMcpStdioEnabled(), { wrapper });
    const settled = () =>
      waitFor(() =>
        expect(
          client
            .getQueryCache()
            .getAll()
            .map((query) => query.state.status),
        ).toEqual(["success"]),
      );
    return { result, fetchSpy, settled };
  };

  it("reads the flag from the worker the dashboard is managing", async () => {
    switchToWorkerUrl("http://worker-b.example:4000");
    const { result, fetchSpy, settled } = renderWithConfig({ mcp_stdio_enabled: false });

    await settled();
    expect(result.current).toBe(false);
    expect(fetchSpy.mock.calls.map(([request]) => (request as Request).url)).toEqual([
      "http://worker-b.example:4000/.well-known/litellm-ui-config",
    ]);
  });

  it.each([
    [{ mcp_stdio_enabled: false }, false],
    [{ mcp_stdio_enabled: true }, true],
    [{}, true],
  ])("treats %o as stdio enabled=%s", async (config, enabled) => {
    const { result, settled } = renderWithConfig(config);

    await settled();
    expect(result.current).toBe(enabled);
  });

  it("keeps stdio available while the proxy has not answered yet", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise<Response>(() => {}));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useMcpStdioEnabled(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(result.current).toBe(true);
  });
});
