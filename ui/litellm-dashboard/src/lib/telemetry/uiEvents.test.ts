import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { queryClient } from "@/contexts/ReactQueryProvider";
import { backgroundFetchClient } from "@/lib/http/api";
/** Spying the typed client traps TS in its recursive path types, so spy through a plain shape. */
const clientMock = backgroundFetchClient as unknown as Record<"GET" | "POST", Mock>;

const spyGET = () => vi.spyOn(clientMock, "GET") as Mock;
const spyPOST = () => vi.spyOn(clientMock, "POST") as Mock;
import { pageNavigationQuery, recordUiEvent } from "./uiEvents";

const enabledResponse = (enabled: boolean) => ({ data: { enabled }, response: new Response() });

describe("recordUiEvent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it("sends nothing while the proxy says page navigation is off", async () => {
    spyGET().mockResolvedValue(enabledResponse(false));
    const post = spyPOST();
    post.mockResolvedValue({ data: undefined, response: new Response() });

    await recordUiEvent({ page: "teams", action: "view" });

    expect(post).not.toHaveBeenCalled();
  });

  it("asks the proxy once per window and posts every event while page navigation is on", async () => {
    const get = spyGET();
    get.mockResolvedValue(enabledResponse(true));
    const post = spyPOST();
    post.mockResolvedValue({ data: undefined, response: new Response() });

    await recordUiEvent({ page: "teams", action: "view" });
    await recordUiEvent({ page: "teams", action: "click", target: "tab=members" });

    expect(get).toHaveBeenCalledOnce();
    expect(post).toHaveBeenLastCalledWith("/telemetry/ui_events", {
      body: { page: "teams", action: "click", target: "tab=members" },
    });
    expect(post).toHaveBeenCalledTimes(2);
  });

  it("asks the proxy again once the cached answer is older than the report window", async () => {
    vi.useFakeTimers();
    const get = spyGET();
    get.mockResolvedValue(enabledResponse(false));

    await recordUiEvent({ page: "teams", action: "view" });
    vi.advanceTimersByTime(pageNavigationQuery.staleTime + 1);
    await recordUiEvent({ page: "teams", action: "view" });

    vi.useRealTimers();
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("swallows a failed check or post so telemetry never breaks the page", async () => {
    spyGET().mockRejectedValue(new Error("offline"));

    await expect(recordUiEvent({ page: "teams", action: "view" })).resolves.toBeUndefined();
  });
});
